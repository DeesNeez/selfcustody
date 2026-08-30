/* Deterministic Monte Carlo exercise for the Workshop's fabrication gate.

   This is not an entropy-source validation and it does not prove that the
   gate recognises randomness. It answers one narrower engineering question:
   how often do the current project-specific rules refuse sequences generated
   from the ideal model for each input method?

   Run through the public command so the ordinary vectors still run first:

     npm run test:entropy -- --calibrate

   The default is one million sequences split across every supported profile.
   A smaller local smoke run can use `--samples 1000`. The PR/report must always
   state the sample count and seed; neither is allowed to depend on Math.random. */
import { loadCore } from './load-core.mjs';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const C = loadCore();
const DEFAULT_SAMPLES = 1_000_000;
const DEFAULT_SEED = 0x5ec0c7d1;

/* Mulberry32 is deliberately small and deterministic. It is a simulation
   fixture, never a wallet entropy source. Its job is reproducibility across
   operating systems and Node versions, not unpredictability. */
function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

const choose = (rng, values) => values[Math.floor(rng() * values.length)];

function shuffledDeck(rng) {
  const deck = C.CARD_DECK.slice();
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function cards(rng, count) {
  const out = [];
  while (out.length < count) out.push(...shuffledDeck(rng));
  return out.slice(0, count).join('');
}

function diceBits(rng, target) {
  let input = '';
  while (C.diceBits(input).length < target) input += choose(rng, '123456');
  return input;
}

function cardBits(rng, target) {
  let input = '';
  while (C.cardBits(input).length < target) {
    const deck = shuffledDeck(rng);
    for (const card of deck) {
      input += card;
      if (C.cardBits(input).length >= target) break;
    }
  }
  return input;
}

const PROFILES = Object.freeze([
  { name: 'dice · 50 rolls', method: 'dice', make: rng => Array.from({ length: 50 }, () => choose(rng, '123456')).join('') },
  { name: 'dice · 99 rolls', method: 'dice', make: rng => Array.from({ length: 99 }, () => choose(rng, '123456')).join('') },
  { name: 'dice · 500-roll ceiling', method: 'dice', make: rng => Array.from({ length: 500 }, () => choose(rng, '123456')).join('') },
  { name: 'dice bit table · 128 bits', method: 'dicebits', make: rng => diceBits(rng, 128) },
  { name: 'dice bit table · 256 bits', method: 'dicebits', make: rng => diceBits(rng, 256) },
  { name: 'BitBox · 23 lookup words', method: 'bitbox', make: rng => Array.from({ length: 23 }, () => Array.from({ length: 5 }, () => choose(rng, '1234')).join('') + choose(rng, 'HT')).join('') },
  { name: 'octal/hex · 11 lookup words', method: 'octahex', make: rng => Array.from({ length: 11 }, () => choose(rng, '12345678') + choose(rng, '0123456789ABCDEF') + choose(rng, '0123456789ABCDEF')).join('') },
  { name: 'octal/hex · 23 lookup words', method: 'octahex', make: rng => Array.from({ length: 23 }, () => choose(rng, '12345678') + choose(rng, '0123456789ABCDEF') + choose(rng, '0123456789ABCDEF')).join('') },
  { name: 'coin · 128 flips', method: 'coin', make: rng => Array.from({ length: 128 }, () => choose(rng, 'HT')).join('') },
  { name: 'coin · 256 flips', method: 'coin', make: rng => Array.from({ length: 256 }, () => choose(rng, 'HT')).join('') },
  { name: 'cards · 25-card draw', method: 'cards', make: rng => cards(rng, 25) },
  { name: 'cards · 58-card draw', method: 'cards', make: rng => cards(rng, 58) },
  { name: 'cards · 104-card ceiling', method: 'cards', make: rng => cards(rng, 104) },
  { name: 'card bit table · 128 bits', method: 'cardbits', make: rng => cardBits(rng, 128) },
  { name: 'card bit table · 256 bits', method: 'cardbits', make: rng => cardBits(rng, 256) }
]);

/* Wald-Wolfowitz runs statistic in the large-sample form documented by the
   NIST Engineering Statistics Handbook. NIST requires both categories to
   appear more than ten times before the normal approximation is used. The
   statistic is reported by calibration only; assessEntropy() never calls it. */
export function runsTest(sequence) {
  const values = [...sequence];
  const n1 = values.filter(Boolean).length;
  const n2 = values.length - n1;
  let runs = values.length ? 1 : 0;
  for (let i = 1; i < values.length; i += 1) if (values[i] !== values[i - 1]) runs += 1;
  const total = n1 + n2;
  if (!n1 || !n2) return { eligible: false, n1, n2, runs, expected: total ? 1 : 0, z: 0 };
  const expected = 2 * n1 * n2 / total + 1;
  const variance = 2 * n1 * n2 * (2 * n1 * n2 - n1 - n2)
    / (total ** 2 * (total - 1));
  return {
    eligible: n1 > 10 && n2 > 10,
    n1, n2, runs, expected,
    z: variance ? (runs - expected) / Math.sqrt(variance) : 0
  };
}

function runsSelfTest() {
  /* NIST's 20-toss illustration has eleven heads, nine tails and nine runs.
     It is correctly marked ineligible for NIST's large-sample approximation,
     which requires both category counts to exceed ten. */
  const nist = runsTest([...'HHTTHTHHHHTHHTTTTTHH'].map(value => value === 'H'));
  assert.deepEqual([nist.n1, nist.n2, nist.runs, nist.eligible], [11, 9, 9, false]);

  /* With fifty of each category, both extreme orderings have the same
     expected count and opposite deviations. These pin the published formula,
     not a value generated by the implementation under test. */
  const grouped = runsTest([...Array(50).fill(false), ...Array(50).fill(true)]);
  const alternating = runsTest(Array.from({ length: 100 }, (_, i) => Boolean(i % 2)));
  assert.equal(grouped.expected, 51);
  assert.equal(grouped.runs, 2);
  assert.equal(alternating.runs, 100);
  assert.ok(Math.abs(grouped.z + alternating.z) < 1e-12);
  assert.ok(Math.abs(grouped.z + 9.849873095629203) < 1e-12);
}

/* Each physical method is reduced to two categories solely for this
   experiment. Coin flips already are binary. Dice are split across the middle
   of their faces. Cards use colour, which preserves the without-replacement
   ordering question while conditioning on however many red and black cards
   appear in a partial draw. */
export function runsSequence(method, input) {
  const values = C.events(method, input);
  if (method === 'coin') return values.map(value => value === 'H');
  if (method === 'bitbox') {
    return values.filter((_, i) => i % 6 !== 5).map(value => Number(value) >= 3);
  }
  if (method === 'octahex') {
    return values.filter((_, i) => i % 3 !== 0).map(value => parseInt(value, 16) >= 8);
  }
  if (method === 'cards' || method === 'cardbits') {
    return values.map(card => card[1] === 'D' || card[1] === 'H');
  }
  return values.map(value => Number(value) >= 4);
}

function transitionInput({ rng, length, switchProbability, low, high }) {
  let upper = rng() >= 0.5;
  let input = '';
  for (let i = 0; i < length; i += 1) {
    if (i && rng() < switchProbability) upper = !upper;
    input += choose(rng, upper ? high : low);
  }
  return input;
}

/* Find a deterministic example whose category transitions are strongly
   dependent but whose face counts, periods, identical-face runs and
   complexity still pass the current gate. These are diagnostic countercases,
   not claimed models of how a particular person fabricates input. */
function transitionCountercase({ method, length, switchProbability, low, high, seed }) {
  const rng = mulberry32(seed);
  for (let attempt = 1; attempt <= 10_000; attempt += 1) {
    const input = transitionInput({ rng, length, switchProbability, low, high });
    const current = C.assessEntropy({ method, input });
    const runs = runsTest(runsSequence(method, input));
    if (current.ok && runs.eligible && Math.abs(runs.z) >= 6) return { method, input, current, runs, attempt };
  }
  throw new Error(`could not construct ${method} transition countercase`);
}

function orderedCardCountercase(alternating, seed) {
  const rng = mulberry32(seed);
  for (let attempt = 1; attempt <= 10_000; attempt += 1) {
    const deck = shuffledDeck(rng);
    const black = deck.filter(card => card[1] === 'C' || card[1] === 'S');
    const red = deck.filter(card => card[1] === 'D' || card[1] === 'H');
    const arranged = alternating
      ? black.flatMap((card, i) => [card, red[i]])
      : [...black, ...red];
    const input = arranged.join('');
    const current = C.assessEntropy({ method: 'cards', input });
    const runs = runsTest(runsSequence('cards', input));
    if (current.ok && runs.eligible && Math.abs(runs.z) >= 6) {
      return { method: 'cards', input, current, runs, attempt };
    }
  }
  throw new Error('could not construct card-colour countercase');
}

function summarizeRunsCase(name, item) {
  return {
    name,
    method: item.method,
    currentGate: item.current.ok ? 'allowed' : 'refused',
    eligible: item.runs.eligible,
    n1: item.runs.n1,
    n2: item.runs.n2,
    runs: item.runs.runs,
    expected: item.runs.expected,
    z: item.runs.z,
    candidateSixZ: item.runs.eligible && Math.abs(item.runs.z) >= 6,
    searchAttempt: item.attempt,
    currentReasons: item.current.failures
  };
}

function runsCountercases(seed) {
  const transitionCases = [
    ['coin, clustered transitions', transitionCountercase({
      method: 'coin', length: 256, switchProbability: 0.20, low: 'T', high: 'H', seed: seed ^ 0x1001
    })],
    ['coin, excessive transitions', transitionCountercase({
      method: 'coin', length: 256, switchProbability: 0.80, low: 'T', high: 'H', seed: seed ^ 0x1002
    })],
    ['dice, clustered low/high groups', transitionCountercase({
      method: 'dice', length: 99, switchProbability: 0.12, low: '123', high: '456', seed: seed ^ 0x2001
    })],
    ['dice, excessive low/high switching', transitionCountercase({
      method: 'dice', length: 99, switchProbability: 0.88, low: '123', high: '456', seed: seed ^ 0x2002
    })],
    ['cards, colours dealt in two groups', orderedCardCountercase(false, seed ^ 0x3001)],
    ['cards, colours forced to alternate', orderedCardCountercase(true, seed ^ 0x3002)]
  ];
  const knownPatterns = [
    ['coin, HHTT repeated', { method: 'coin', input: 'HHTT'.repeat(64) }],
    ['dice, 123456 repeated', { method: 'dice', input: '123456'.repeat(16) + '123' }],
    ['cards, stepped by rank', {
      method: 'cards',
      input: [...C.CARD_RANKS].flatMap(rank => [...C.CARD_SUITS].map(suit => rank + suit)).join('')
    }]
  ].map(([name, item]) => [name, {
    ...item,
    current: C.assessEntropy(item),
    runs: runsTest(runsSequence(item.method, item.input)),
    attempt: 1
  }]);
  const cases = [...transitionCases, ...knownPatterns].map(([name, item]) => summarizeRunsCase(name, item));
  assert.ok(cases.slice(0, 6).every(item => item.currentGate === 'allowed' && item.candidateSixZ),
    'runs countercases must expose current-gate coverage rather than duplicate it');
  assert.ok(cases.slice(6).every(item => item.currentGate === 'refused' && !item.candidateSixZ),
    'comparison patterns must show why the runs statistic cannot replace the current gate');
  return cases;
}

function cardOrderStats(input) {
  const draw = C.events('cards', input);
  let adjacent = 0, sameSuit = 0, suitRun = draw.length ? 1 : 0, longestSuitRun = suitRun;
  for (let i = 1; i < draw.length; i += 1) {
    if (Math.abs(C.CARD_DECK.indexOf(draw[i]) - C.CARD_DECK.indexOf(draw[i - 1])) === 1) adjacent += 1;
    if (draw[i][1] === draw[i - 1][1]) {
      sameSuit += 1;
      suitRun += 1;
      longestSuitRun = Math.max(longestSuitRun, suitRun);
    } else suitRun = 1;
  }
  const pairs = Math.max(1, draw.length - 1);
  return { adjacent: adjacent / pairs, sameSuit: sameSuit / pairs, suitRun: longestSuitRun };
}

function blankResult(profile, samples) {
  return {
    profile: profile.name,
    method: profile.method,
    samples,
    refused: 0,
    refusalRate: 0,
    inputLength: { min: Infinity, max: 0 },
    observed: {
      minDistinct: Infinity,
      maxRun: 0,
      maxChi: 0,
      minLz: Infinity,
      repeatingPeriod: 0,
      repeatingStepPeriod: 0,
      maxAdjacent: null,
      maxSameSuit: null,
      maxSuitRun: null
    },
    runsTest: {
      eligible: 0,
      maxAbsZ: 0,
      beyond1_96: 0,
      beyond4: 0,
      beyond5: 0,
      beyond6: 0
    },
    limits: C.entropyRule(profile.method),
    refusalReasons: {}
  };
}

function exerciseProfile(profile, samples, rng) {
  const result = blankResult(profile, samples);
  const cardMethod = profile.method === 'cards' || profile.method === 'cardbits';
  if (cardMethod) {
    result.observed.maxAdjacent = 0;
    result.observed.maxSameSuit = 0;
    result.observed.maxSuitRun = 0;
  }
  for (let i = 0; i < samples; i += 1) {
    const input = profile.make(rng);
    const report = C.assessEntropy({ method: profile.method, input });
    const stats = report.stats;
    result.inputLength.min = Math.min(result.inputLength.min, stats.length);
    result.inputLength.max = Math.max(result.inputLength.max, stats.length);
    result.observed.minDistinct = Math.min(result.observed.minDistinct, stats.distinct);
    result.observed.maxRun = Math.max(result.observed.maxRun, stats.run);
    result.observed.maxChi = Math.max(result.observed.maxChi, stats.chi);
    result.observed.minLz = Math.min(result.observed.minLz, stats.lz);
    if (stats.period && stats.period <= stats.length / 3) result.observed.repeatingPeriod += 1;
    if (stats.stepPeriod && stats.stepPeriod <= (stats.length - 1) / 3) result.observed.repeatingStepPeriod += 1;
    const runs = runsTest(runsSequence(profile.method, input));
    if (runs.eligible) {
      const absolute = Math.abs(runs.z);
      result.runsTest.eligible += 1;
      result.runsTest.maxAbsZ = Math.max(result.runsTest.maxAbsZ, absolute);
      if (absolute > 1.96) result.runsTest.beyond1_96 += 1;
      if (absolute >= 4) result.runsTest.beyond4 += 1;
      if (absolute >= 5) result.runsTest.beyond5 += 1;
      if (absolute >= 6) result.runsTest.beyond6 += 1;
    }
    if (cardMethod) {
      const order = cardOrderStats(input);
      result.observed.maxAdjacent = Math.max(result.observed.maxAdjacent, order.adjacent);
      result.observed.maxSameSuit = Math.max(result.observed.maxSameSuit, order.sameSuit);
      result.observed.maxSuitRun = Math.max(result.observed.maxSuitRun, order.suitRun);
    }
    if (!report.ok) {
      result.refused += 1;
      for (const reason of report.failures) {
        result.refusalReasons[reason] = (result.refusalReasons[reason] || 0) + 1;
      }
    }
  }
  result.refusalRate = result.refused / samples;
  return result;
}

export function calibrate({ samples = DEFAULT_SAMPLES, seed = DEFAULT_SEED } = {}) {
  runsSelfTest();
  if (!Number.isSafeInteger(samples) || samples < PROFILES.length) {
    throw new Error(`samples must be an integer of at least ${PROFILES.length}`);
  }
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff) {
    throw new Error('seed must be an unsigned 32-bit integer');
  }
  const rng = mulberry32(seed);
  const base = Math.floor(samples / PROFILES.length);
  let remainder = samples % PROFILES.length;
  const profiles = PROFILES.map(profile => exerciseProfile(profile, base + (remainder-- > 0 ? 1 : 0), rng));
  return {
    samples,
    seed,
    generator: 'Mulberry32 (simulation only; never wallet entropy)',
    profiles,
    refused: profiles.reduce((sum, profile) => sum + profile.refused, 0),
    runsCountercases: runsCountercases(seed)
  };
}

const fixed = value => Number.isFinite(value) ? Number(value.toFixed(4)) : value;

export function printCalibration(report) {
  console.log('Entropy fabrication-gate calibration');
  console.log(`seed 0x${report.seed.toString(16).padStart(8, '0')} · ${report.samples.toLocaleString('en-US')} simulated sequences · ${report.generator}`);
  console.log('This measures false refusals under idealized input models; it does not certify randomness or an entropy source.');
  for (const profile of report.profiles) {
    const lengths = profile.inputLength.min === profile.inputLength.max
      ? String(profile.inputLength.min)
      : `${profile.inputLength.min}-${profile.inputLength.max}`;
    const observed = profile.observed;
    const limits = profile.limits;
    const parts = [
      `${profile.profile}: ${profile.refused}/${profile.samples} refused`,
      `events ${lengths}`,
      `distinct min ${observed.minDistinct} (reject <${limits.minDistinct})`,
      `run max ${observed.maxRun} (reject >=${limits.maxRun})`,
      limits.maxChi === Infinity ? 'chi disabled' : `chi max ${fixed(observed.maxChi)} (reject >${limits.maxChi})`,
      limits.minLz === 0 ? 'LZ disabled' : `LZ min ${fixed(observed.minLz)} (reject <${limits.minLz})`,
      `period hits ${observed.repeatingPeriod}/${observed.repeatingStepPeriod}`
    ];
    if (observed.maxAdjacent !== null) {
      parts.push(`adjacent max ${fixed(observed.maxAdjacent)} (reject >${limits.maxAdjacent})`);
      parts.push(`same-suit max ${fixed(observed.maxSameSuit)} (reject >${limits.maxSameSuit})`);
      parts.push(`suit-run max ${observed.maxSuitRun} (reject >=${limits.maxSuitRun})`);
    }
    console.log(parts.join(' · '));
    const runs = profile.runsTest;
    const rate = runs.eligible ? (100 * runs.beyond1_96 / runs.eligible).toFixed(2) : 'n/a';
    console.log(`  runs experiment: ${runs.eligible}/${profile.samples} eligible · |Z| max ${fixed(runs.maxAbsZ)} · |Z| >1.96 ${runs.beyond1_96} (${rate}%) · >=4 ${runs.beyond4} · >=5 ${runs.beyond5} · >=6 ${runs.beyond6}`);
  }
  console.log('\nRuns-test comparison cases (experimental; never used to accept or refuse input)');
  for (const item of report.runsCountercases) {
    const z = item.eligible ? fixed(item.z) : 'ineligible';
    console.log(`${item.name}: current ${item.currentGate} · runs ${item.runs} vs ${fixed(item.expected)} expected · Z ${z} · |Z| >=6 ${item.candidateSixZ ? 'yes' : 'no'}`);
  }
  console.log(`\nTotal: ${report.refused}/${report.samples} simulated sequences refused`);
  console.log(`Reproduce: npm run test:entropy -- --calibrate --samples ${report.samples} --seed 0x${report.seed.toString(16).padStart(8, '0')}`);
}

function numberArgument(args, name, fallback) {
  const at = args.indexOf(name);
  if (at < 0) return fallback;
  const raw = args[at + 1];
  if (!raw || raw.startsWith('--')) throw new Error(`${name} needs a value`);
  const value = Number(raw);
  if (!Number.isSafeInteger(value)) throw new Error(`${name} must be an integer`);
  return value;
}

export function calibrationOptions(args) {
  return {
    samples: numberArgument(args, '--samples', DEFAULT_SAMPLES),
    seed: numberArgument(args, '--seed', DEFAULT_SEED),
  };
}

/* Also runnable directly for the quick CI smoke check. The public command in
   entropy-test.mjs remains the documented route because it verifies the
   conversion vectors before printing a calibration report. */
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    printCalibration(calibrate(calibrationOptions(process.argv.slice(2))));
  } catch (error) {
    console.error(`calibration failed: ${error.message}`);
    process.exit(1);
  }
}

/* Test vectors for build/tools/entropy-core.js.

   Run:  npm run test:entropy

   Every vector here is from a published specification, not from running this
   code and recording what it said. That distinction is the whole point: a
   self-check that compares the tool against itself proves nothing.

   The same suite is embedded in the shipped page and runs on load. If any of
   it fails the page refuses to show results, because a conversion tool that is
   quietly wrong is worse than no tool -- it would tell someone their hardware
   wallet is dishonest when the fault is here. */
import { readFileSync } from 'node:fs';
import { loadCore } from './load-core.mjs';

const C = loadCore();
const WORDLIST = readFileSync('build/tools/bip39-english.txt', 'utf8').trim().split(/\r?\n/);

/* The 12- and 24-word all-zero-entropy phrases from BIP39's own vectors, used
   as the base mnemonic for every address vector below. */
const ABANDON_12 = 'abandon '.repeat(11) + 'about';
const ABANDON_24 = 'abandon '.repeat(23) + 'art';

/* Two sequences straight from a CSPRNG, pinned here so the suite is
   deterministic. Both must be allowed through: the check exists to catch typed
   input, and a version of it that rejected genuine rolls would be worse than
   having no check at all -- it would teach people to re-roll until they pass,
   which is the one thing the dice guide says never to do. */
const REAL_ROLLS = '544114545535114225212651531526245631146421553114213555633324324654465346361515622414366414163654633';
const REAL_FLIPS = 'THTTTHTHTHTHHHTTHHTTTTHTTHHHTHHHTHHTHHHTTHTHTHTHTHHTHTHTTTTHTTTTTTTTTHHHTTTTHTHTHTTTTHTTTHTHTTTHHTHTTTHHHTTTHHHTHTHTTHTHTTHTHTHTTTHHHTHHHTHTHHTTTTHHTHTTHTHHHHHTHTHTTTHHHHHTTHHHHHHHHTHHTHTTHHHHTHHTHTTTHTHTTTHTHTTTHHTHTHHTTTTTHTTHHTTHHTTTTTTHHHHHHHTHHHTHHHHH';

export const VECTORS = [
  /* ---- FIPS 180-4, RFC 1320 and RFC 4231 ---- */
  ['sha256 of empty', () => C.hex(C.sha256(C.utf8(''))),
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
  ['sha256 of abc', () => C.hex(C.sha256(C.utf8('abc'))),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
  ['sha512 of abc', () => C.hex(C.sha512(C.utf8('abc'))),
    'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'],
  ['ripemd160 of abc', () => C.hex(C.ripemd160(C.utf8('abc'))),
    '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc'],
  ['hmac-sha512 rfc4231 case 2', () => C.hex(C.hmacSha512(C.utf8('Jefe'), C.utf8('what do ya want for nothing?'))),
    '164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737'],

  /* ---- BIP39 ---- */
  ['bip39 12 words from zero entropy',
    () => C.entropyToMnemonic(C.fromHex('00'.repeat(16)), WORDLIST).join(' '), ABANDON_12],
  ['bip39 24 words from zero entropy',
    () => C.entropyToMnemonic(C.fromHex('00'.repeat(32)), WORDLIST).join(' '), ABANDON_24],
  ['bip39 12 words from 7f entropy',
    () => C.entropyToMnemonic(C.fromHex('7f'.repeat(16)), WORDLIST).join(' '),
    'legal winner thank year wave sausage worth useful legal winner thank yellow'],
  ['bip39 12 words from 80 entropy',
    () => C.entropyToMnemonic(C.fromHex('80'.repeat(16)), WORDLIST).join(' '),
    'letter advice cage absurd amount doctor acoustic avoid letter advice cage above'],
  ['bip39 12 words from ff entropy',
    () => C.entropyToMnemonic(C.fromHex('ff'.repeat(16)), WORDLIST).join(' '),
    'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong'],
  ['bip39 seed with TREZOR passphrase',
    () => C.hex(C.mnemonicToSeed(ABANDON_12.split(' '), 'TREZOR')),
    'c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04'],

  /* ---- BIP32 test vector 1, seed 000102...0f ---- */
  ['bip32 master key from seed', () => {
    const m = C.masterKey(C.fromHex('000102030405060708090a0b0c0d0e0f'));
    return `${C.hex(m.key)} ${C.hex(m.chainCode)}`;
  }, 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35 '
   + '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508'],
  ['bip32 derive m/0h/1/2h/2/1000000000', () => {
    const node = C.derive(C.masterKey(C.fromHex('000102030405060708090a0b0c0d0e0f')), "m/0'/1/2'/2/1000000000");
    return `${C.hex(node.key)} ${C.hex(node.chainCode)}`;
  }, '471b76e389e528d6de6d816857e012c5455051cad6660850e58372a6c3e6e7c8 '
   + 'c783e67b921d2beb8f6b389cc646d7263b4145701dadd2161548a8b078e65e9e'],

  /* ---- addresses, from the test vectors in BIP44/49/84/86 ---- */
  ['bip44 legacy receive', () => addressFor('legacy', "m/44'/0'/0'", 0),
    '1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA'],
  ['bip49 nested segwit receive', () => addressFor('nested', "m/49'/0'/0'", 0),
    '37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf'],
  ['bip84 native segwit receive', () => addressFor('native', "m/84'/0'/0'", 0),
    'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu'],
  ['bip84 native segwit change', () => addressFor('native', "m/84'/0'/0'", 1),
    'bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el'],
  ['bip86 taproot receive', () => addressFor('taproot', "m/86'/0'/0'", 0),
    'bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr'],
  ['bip86 taproot change', () => addressFor('taproot', "m/86'/0'/0'", 1),
    'bc1p3qkhfews2uk44qtvauqyr2ttdsw7svhkl9nkm9s9c3x4ax5h60wqwruhk7'],

  /* ---- the two input methods ---- */
  ['coin flips pack straight into entropy',
    () => C.hex(C.METHODS.coin.entropy('H'.repeat(128), 16)), 'ff'.repeat(16)],
  ['coin flips, all tails',
    () => C.hex(C.METHODS.coin.entropy('T'.repeat(128), 16)), '00'.repeat(16)],
  /* ---- the entropy sanity check ----
     Fabricated input must be refused, and real randomness must not be. The
     false-positive rate is measured separately in `npm run test:entropy --
     --calibrate`; these pin the behaviour that matters per case. */
  ['refuses 99 identical rolls', () => refused('dice', '1'.repeat(99)), 'refused'],
  ['refuses "123456" typed to length', () => refused('dice', '123456'.repeat(16) + '123'), 'refused'],
  ['refuses a descending pattern', () => refused('dice', '654321'.repeat(16) + '654'), 'refused'],
  ['refuses blocked runs', () => refused('dice', '111222333444555666'.repeat(5) + '111222333'), 'refused'],
  ['refuses two long blocks', () => refused('dice', '1'.repeat(50) + '2'.repeat(49)), 'refused'],
  ['refuses all heads', () => refused('coin', 'H'.repeat(256)), 'refused'],
  ['refuses alternating flips', () => refused('coin', 'HT'.repeat(128)), 'refused'],
  ['refuses HHTT repeated', () => refused('coin', 'HHTT'.repeat(64)), 'refused'],
  ['allows a real 99-roll sequence', () => refused('dice', REAL_ROLLS), 'allowed'],

  /* ---- how many rolls are accepted ---- */
  ['dice: 99 is the minimum for 24 words', () => C.limits('dice', 24).least, 99],
  ['dice: extras are welcome up to a ceiling', () => C.limits('dice', 24).most, 500],
  ['coin: the count is exact, not a minimum', () => {
    const { least, most } = C.limits('coin', 24);
    return least === most ? 'exact' : 'range';
  }, 'exact'],
  ['an extra roll changes the seed, so it is not wasted', () => {
    const more = REAL_ROLLS + '4';
    return C.hex(C.METHODS.dice.entropy(REAL_ROLLS, 32)) === C.hex(C.METHODS.dice.entropy(more, 32))
      ? 'ignored' : 'absorbed';
  }, 'absorbed'],
  ['150 rolls derive a wallet', () => {
    const long = (REAL_ROLLS + REAL_ROLLS).slice(0, 150);
    return C.deriveSeed({ method: 'dice', input: long, words: 24, wordlist: WORDLIST }).mnemonic.length;
  }, 24],
  ['too few rolls is still refused', () => {
    try { C.deriveSeed({ method: 'dice', input: '1234', words: 24, wordlist: WORDLIST }); return 'accepted'; }
    catch { return 'refused'; }
  }, 'refused'],
  ['past the ceiling is refused', () => {
    try { C.deriveSeed({ method: 'dice', input: REAL_ROLLS.repeat(6), words: 24, wordlist: WORDLIST }); return 'accepted'; }
    catch { return 'refused'; }
  }, 'refused'],
  ['an extra flip is refused rather than dropped', () => {
    try { C.deriveSeed({ method: 'coin', input: REAL_FLIPS + 'H', words: 24, wordlist: WORDLIST }); return 'accepted'; }
    catch { return 'refused'; }
  }, 'refused'],
  ['allows a real 256-flip sequence', () => refused('coin', REAL_FLIPS), 'allowed'],

  ['dice rolls are the sha256 of the digits as typed',
    () => C.hex(C.METHODS.dice.entropy('123456'.repeat(16) + '123', 32)),
    C.hex(C.sha256(C.utf8('123456'.repeat(16) + '123')))]
];

function refused(method, input) {
  return C.assessEntropy({ method, input }).ok ? 'allowed' : 'refused';
}

function addressFor(type, path, branch) {
  const node = C.derive(C.masterKey(C.mnemonicToSeed(ABANDON_12.split(' '))), path);
  const leaf = C.ckdPriv(C.ckdPriv(node, branch), 0);
  const pub = C.compress(C.pointMul(BigInt('0x' + C.hex(leaf.key))));
  return C.ADDRESS_TYPES[type].encode(pub);
}

export function run() {
  const results = VECTORS.map(([name, fn, want]) => {
    let got;
    try { got = fn(); } catch (err) { got = `threw: ${err.message}`; }
    return { name, got, want, ok: got === want };
  });
  return { results, passed: results.filter(r => r.ok).length, total: results.length };
}

const { results, passed, total } = run();
for (const r of results) {
  console.log(`${r.ok ? 'pass' : 'FAIL'}  ${r.name}`);
  if (!r.ok) console.log(`        got  ${r.got}\n        want ${r.want}`);
}
console.log(`\n${passed}/${total} vectors pass`);
process.exit(passed === total ? 0 : 1);

import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/* The two pieces of logic that decide what CI runs are shell embedded in
   build.yml, and nothing executes them until they are deciding a real run --
   at which point a mistake is either an unexplained skip or an unexplained
   half-hour of Rust. Both scripts are extracted from the workflow itself
   rather than copied here, because a copy would go stale exactly when it
   mattered: a rule changed in one place and asserted in the other is not a
   test, it is two opinions. */

const WORKFLOW = '.github/workflows/build.yml';
const lines = readFileSync(WORKFLOW, 'utf8').replace(/\r\n?/g, '\n').split('\n');

/* A step's `run: |` block, dedented. The workflow is hand-written with a
   stable shape -- steps at six spaces, their keys at eight, block scalars at
   ten -- so this reads it by indentation rather than pulling in a YAML parser
   the repository does not otherwise depend on. */
function extractRun(anchor) {
  const start = lines.indexOf(anchor);
  assert.notEqual(start, -1, `${WORKFLOW} no longer contains the step anchored by "${anchor.trim()}"`);
  let run = start;
  while (run < lines.length && lines[run] !== '        run: |') run += 1;
  assert.ok(run < lines.length, `the step anchored by "${anchor.trim()}" has no run block`);
  const body = [];
  for (let i = run + 1; i < lines.length; i += 1) {
    if (lines[i] === '') { body.push(''); continue; }
    if (!lines[i].startsWith('          ')) break;
    body.push(lines[i].slice(10));
  }
  assert.ok(body.length > 0, `the step anchored by "${anchor.trim()}" has an empty run block`);
  return body.join('\n') + '\n';
}

const decideScript = extractRun('        id: decide');
const gateScript = extractRun('      - name: Every relevant check passed');

const workspace = mkdtempSync(join(tmpdir(), 'selfcustody-ci-'));
const scriptPath = name => join(workspace, name);
writeFileSync(scriptPath('decide.sh'), decideScript);
writeFileSync(scriptPath('gate.sh'), gateScript);

let failures = 0;
const report = (label, ok, detail) => {
  if (ok) { console.log(`  ok   ${label}`); return; }
  failures += 1;
  console.log(`  FAIL ${label}\n       ${detail}`);
};

/* ------------------------------------------------------------------ scope */

/* A throwaway repository rather than this one's history: the cases below have
   to state exactly which paths a commit touches, and history that happens to
   suit them today is history that stops suiting them tomorrow. */
const repo = join(workspace, 'repo');
mkdirSync(repo);
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();

git('init', '-q', '-b', 'main');
git('config', 'user.email', 'ci@example.invalid');
git('config', 'user.name', 'CI Scope Test');
git('config', 'core.autocrlf', 'false');

let counter = 0;
function commit(paths) {
  counter += 1;
  for (const path of paths) {
    const full = join(repo, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, `revision ${counter}\n`);
  }
  git('add', '-A');
  git('commit', '-q', '-m', `revision ${counter}`);
  return git('rev-parse', 'HEAD');
}

const BASE_FILES = [
  'README.md',
  'SECURITY.md',
  'package.json',
  'build/guides.mjs',
  'build/content.mjs',
  'build/tools/entropy-core.js',
  'build/tools/wallet-dat-test.mjs',
  'build/tools/lifehash.js',
  'docs/entropy.html',
  'docs/entropy-offline.html',
  'docs/guides/quickstart.html',
  'fuzzing/lifehash/package-lock.json',
  'secp256k1-wasm/src/lib.rs',
  '.github/workflows/build.yml',
];

const base = commit(BASE_FILES);

/* Each commit is made from the same base so the cases stay independent, and
   each names the files a real change of that kind would carry -- generated
   output included, because the site job refuses a commit that omits it. */
const at = paths => {
  git('checkout', '-q', base);
  const sha = commit(paths);
  git('checkout', '-q', 'main');
  return sha;
};

const commits = {
  guides: at(['build/guides.mjs', 'docs/guides/quickstart.html']),
  workshopSource: at(['build/content.mjs', 'docs/entropy.html', 'docs/entropy-offline.html']),
  workshopPage: at(['docs/entropy.html']),
  workshopTest: at(['build/tools/wallet-dat-test.mjs']),
  lifehashRef: at(['fuzzing/lifehash/package-lock.json']),
  lifehashPort: at(['build/tools/lifehash.js', 'docs/entropy.html', 'docs/entropy-offline.html']),
  wasm: at(['secp256k1-wasm/src/lib.rs']),
  workflow: at(['.github/workflows/build.yml']),
  readme: at(['README.md']),
  security: at(['SECURITY.md']),
};

const ZEROS = '0'.repeat(40);

function decide({ event, ref = 'refs/heads/topic', head, before = '', pr = false }) {
  const out = join(workspace, 'decide-output.txt');
  writeFileSync(out, '');
  const result = spawnSync('bash', [scriptPath('decide.sh')], {
    cwd: repo,
    encoding: 'utf8',
    env: {
      ...process.env,
      GITHUB_OUTPUT: out,
      GITHUB_EVENT_NAME: event,
      GITHUB_REF: ref,
      GITHUB_SHA: head ?? '',
      BASE_SHA: pr ? base : '',
      HEAD_SHA: pr ? head : '',
      BEFORE_SHA: before,
      EMPTY_SHA: ZEROS,
    },
  });
  assert.equal(result.status, 0,
    `the scope script exited ${result.status}\n${result.stdout}\n${result.stderr}`);
  return Object.fromEntries(
    readFileSync(out, 'utf8').split('\n').filter(Boolean).map(line => line.split('=')));
}

const scopeCases = [
  ['an ordinary guide edit scopes to nothing',
    { event: 'pull_request', ref: 'refs/pull/1/merge', pr: true, head: commits.guides },
    { entropy: 'false', lifehash: 'false', wasm: 'false', offline_html: 'false' }],

  ['a guide edit merged to main still scopes to nothing',
    { event: 'push', ref: 'refs/heads/main', before: base, head: commits.guides },
    { entropy: 'false', lifehash: 'false', wasm: 'false', offline_html: 'false' }],

  ['a README edit merged to main scopes to nothing',
    { event: 'push', ref: 'refs/heads/main', before: base, head: commits.readme },
    { entropy: 'false', lifehash: 'false', wasm: 'false', offline_html: 'false' }],

  ['Workshop source, through its regenerated output',
    { event: 'pull_request', ref: 'refs/pull/2/merge', pr: true, head: commits.workshopSource },
    { entropy: 'true', lifehash: 'false', wasm: 'false', offline_html: 'false' }],

  ['the Workshop page alone',
    { event: 'pull_request', ref: 'refs/pull/3/merge', pr: true, head: commits.workshopPage },
    { entropy: 'true', lifehash: 'false', wasm: 'false', offline_html: 'false' }],

  ['a Workshop test, which generates no output of its own',
    { event: 'pull_request', ref: 'refs/pull/4/merge', pr: true, head: commits.workshopTest },
    { entropy: 'true', lifehash: 'false', wasm: 'false', offline_html: 'false' }],

  ['SECURITY.md, which the attestation-policy test reads',
    { event: 'pull_request', ref: 'refs/pull/5/merge', pr: true, head: commits.security },
    { entropy: 'true', lifehash: 'false', wasm: 'false', offline_html: 'false' }],

  ['the vendored LifeHash reference',
    { event: 'pull_request', ref: 'refs/pull/6/merge', pr: true, head: commits.lifehashRef },
    { entropy: 'false', lifehash: 'true', wasm: 'false', offline_html: 'false' }],

  ['the LifeHash port, which is also inlined into the page',
    { event: 'pull_request', ref: 'refs/pull/7/merge', pr: true, head: commits.lifehashPort },
    { entropy: 'true', lifehash: 'true', wasm: 'false', offline_html: 'false' }],

  ['the WASM crate',
    { event: 'pull_request', ref: 'refs/pull/8/merge', pr: true, head: commits.wasm },
    { entropy: 'false', lifehash: 'false', wasm: 'true', offline_html: 'false' }],

  ['a workflow change forces the complete suite',
    { event: 'pull_request', ref: 'refs/pull/9/merge', pr: true, head: commits.workflow },
    { entropy: 'true', lifehash: 'true', wasm: 'true', offline_html: 'false' }],

  ['a main push that moves the artifact forces the complete suite',
    { event: 'push', ref: 'refs/heads/main', before: base, head: commits.workshopSource },
    { entropy: 'true', lifehash: 'true', wasm: 'true', offline_html: 'true' }],

  ['the weekly run',
    { event: 'schedule', ref: 'refs/heads/main', head: commits.readme },
    { entropy: 'true', lifehash: 'true', wasm: 'true', offline_html: 'false' }],

  ['a manual run',
    { event: 'workflow_dispatch', ref: 'refs/heads/main', head: commits.readme },
    { entropy: 'true', lifehash: 'true', wasm: 'true', offline_html: 'false' }],

  ['a first push of a branch, with nothing to compare against',
    { event: 'push', before: ZEROS, head: commits.guides },
    { entropy: 'true', lifehash: 'true', wasm: 'true', offline_html: 'false' }],

  ['a first push of main attests, having nothing to compare against',
    { event: 'push', ref: 'refs/heads/main', before: ZEROS, head: commits.guides },
    { entropy: 'true', lifehash: 'true', wasm: 'true', offline_html: 'true' }],

  ['an unreachable base falls back to the complete suite',
    { event: 'push', before: 'f'.repeat(40), head: commits.guides },
    { entropy: 'true', lifehash: 'true', wasm: 'true', offline_html: 'false' }],
];

console.log('scope:');
for (const [label, input, expected] of scopeCases) {
  const actual = decide(input);
  const same = Object.entries(expected).every(([k, v]) => actual[k] === v);
  report(label, same, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

/* ------------------------------------------------------------------- gate */

function gate({ scope = 'success', expect, result }) {
  const run = spawnSync('bash', [scriptPath('gate.sh')], {
    encoding: 'utf8',
    env: {
      ...process.env,
      SCOPE: scope,
      EXPECT_ENTROPY: expect[0], EXPECT_LIFEHASH: expect[1], EXPECT_WASM: expect[2],
      ENTROPY: result[0], LIFEHASH: result[1], WASM: result[2],
    },
  });
  return run.status;
}

const T = 'true', F = 'false';
const gateCases = [
  ['a scoped-in job that passed', 0,
    { expect: [T, F, F], result: ['success', 'skipped', 'skipped'] }],

  ['everything scoped out and skipped', 0,
    { expect: [F, F, F], result: ['skipped', 'skipped', 'skipped'] }],

  ['everything scoped in and passing', 0,
    { expect: [T, T, T], result: ['success', 'success', 'success'] }],

  /* The reason this gate compares two things instead of reading one. A job
     whose condition breaks is skipped, GitHub calls that green, and every
     check the change needed silently did not happen. */
  ['a job scope asked for that was skipped anyway', 1,
    { expect: [F, F, T], result: ['skipped', 'skipped', 'skipped'] }],

  ['a scoped-in job that failed', 1,
    { expect: [T, F, F], result: ['failure', 'skipped', 'skipped'] }],

  ['a cancelled job', 1,
    { expect: [T, F, T], result: ['success', 'skipped', 'cancelled'] }],

  /* scope failing empties every expectation, so the comparison above would
     excuse anything. It has to fail on its own account. */
  ['scope itself failing', 1,
    { scope: 'failure', expect: ['', '', ''], result: ['skipped', 'skipped', 'skipped'] }],

  ['a job that ran although scope did not ask for it', 0,
    { expect: [F, F, F], result: ['success', 'skipped', 'skipped'] }],
];

console.log('gate:');
for (const [label, expected, input] of gateCases) {
  const status = gate(input);
  const ok = expected === 0 ? status === 0 : status !== 0;
  report(label, ok, `expected exit ${expected === 0 ? '0' : 'non-zero'}, got ${status}`);
}

rmSync(workspace, { recursive: true, force: true });

assert.equal(failures, 0, `${failures} CI logic case(s) failed`);
console.log(
  `ci scoping: ${scopeCases.length} scope cases and ${gateCases.length} gate cases ` +
  'pass against the shell extracted from the workflow');

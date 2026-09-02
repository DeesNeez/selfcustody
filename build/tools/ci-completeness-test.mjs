import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Two test files sat in the repository for days without ever running in CI:
// they were written, committed, and then simply not added to the workflow.
// Nothing failed, because nothing ran -- the quietest way for a guard to stop
// guarding. This test closes that gap by making the workflow's coverage of the
// test suite itself an assertion.
//
// Tracked files rather than a directory listing: an untracked scratch test in
// build/tools/ is a local experiment, and demanding CI run something that does
// not exist on the remote would fail every checkout but the author's.
const tracked = execFileSync('git', ['ls-files', 'build/tools/*-test.mjs'], {
  encoding: 'utf8',
})
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

assert.ok(tracked.length > 0, 'no tracked test files were found to check');

const dir = '.github/workflows';
const read = name => readFileSync(join(dir, name), 'utf8').replace(/\r\n?/g, '\n');
const workflowFiles = readdirSync(dir)
  .filter(name => name.endsWith('.yml') || name.endsWith('.yaml'))
  .sort();

assert.ok(workflowFiles.length > 0, `no workflows were found in ${dir}`);

/* Only workflows that fire on their own can be said to run anything. This
   repository also has publish-wasm-builder.yml, which is workflow_dispatch
   only and already names secp256k1-wasm-test.mjs -- so a corpus of "every
   workflow" would call that test covered on the day it was dropped from the
   automatic build. The list is explicit, and the assertion below stops it
   going stale: any other workflow that gains an automatic trigger has to be
   added here or fail. */
const AUTOMATIC = ['build.yml'];
const AUTOMATIC_TRIGGERS = ['push', 'pull_request', 'pull_request_target', 'schedule'];

for (const name of AUTOMATIC) {
  assert.ok(workflowFiles.includes(name),
    `${dir}/${name} is listed as an automatic workflow but does not exist`);
}

for (const name of workflowFiles.filter(f => !AUTOMATIC.includes(f))) {
  // The `on:` block, from the top-level key to the next one.
  const triggers = read(name).match(/^on:\n(?:(?: .*)?\n)*/m)?.[0] ?? '';
  const automatic = AUTOMATIC_TRIGGERS.filter(t => new RegExp(`^  ${t}:`, 'm').test(triggers));
  assert.deepEqual(automatic, [],
    `${dir}/${name} fires automatically on ${automatic.join(', ')} but is not in ` +
    'AUTOMATIC -- add it, or the tests it runs will not count toward completeness');
}

const missingFrom = (corpus, tests) => tests.filter(test => !corpus.includes(test));
const corpusOf = names => names.map(read).join('\n');

const missing = missingFrom(corpusOf(AUTOMATIC), tracked);

assert.deepEqual(missing, [],
  `these tests are committed but never run in CI: ${missing.join(', ')} -- ` +
  `add a step to ${AUTOMATIC.map(n => `${dir}/${n}`).join(' or ')} for each`);

// This file is itself a build/tools/*-test.mjs, so the check above covers it
// too. Stated outright because a completeness guard that CI never invokes is
// the exact failure it exists to prevent.
assert.deepEqual(missingFrom(corpusOf(AUTOMATIC), ['build/tools/ci-completeness-test.mjs']), [],
  'the completeness guard must itself run in CI');

/* The rule above is only worth as much as its corpus, and the corpus is the
   part someone would widen for convenience. This proves what narrowing it
   buys: secp256k1-wasm-test.mjs is named in the manual publisher, and with
   the automatic workflow taken away it is still reported missing. Widen the
   corpus to every file in the directory and this case goes green while the
   test it describes runs nowhere. */
const PROBE = 'build/tools/secp256k1-wasm-test.mjs';
const manual = workflowFiles.filter(name => !AUTOMATIC.includes(name));
assert.ok(manual.length > 0, 'the regression below needs a manual workflow to be meaningful');
assert.deepEqual(missingFrom(corpusOf(manual), [PROBE]), [],
  `precondition: a manual workflow must name ${PROBE} for this regression to bite`);
assert.deepEqual(missingFrom(corpusOf(AUTOMATIC.filter(n => n !== 'build.yml')), [PROBE]), [PROBE],
  'a test named only by a manually triggered workflow must count as missing');

/* Naming a test is not the same as running it. The specialist jobs in
   build.yml are conditional, so a test could be named only inside a job whose
   `if:` never becomes true and everything above would still pass. The gate is
   what turns those conditions back into one reported result, so it has to
   exist, it has to report unconditionally, and every path-scoped job has to be
   named in it -- a scoped job outside the gate can be skipped in every
   ordinary run with nothing left to notice. That the gate then judges those
   results correctly is ci-scope-test.mjs's subject, not this one's. */
const build = read('build.yml');
const jobs = new Map(
  build
    .slice(build.indexOf('\njobs:\n'))
    .split(/\n(?=  [a-z0-9-]+:\n)/)
    .map(block => [block.match(/^\n?  ([a-z0-9-]+):\n/)?.[1], block])
    .filter(([id]) => id));

const gate = jobs.get('gate');
assert.ok(gate, 'build.yml must define the aggregate gate job');
assert.match(gate, /^    if: always\(\)$/m,
  'the gate must report a result even when its specialist jobs are skipped');

const gateNeeds = (gate.match(/^    needs: \[(.*)\]$/m)?.[1] ?? '').split(/,\s*/);
const scoped = [...jobs]
  .filter(([id, body]) => id !== 'gate' && /^    if: needs\.scope\.outputs\./m.test(body))
  .map(([id]) => id);

assert.ok(scoped.length > 0,
  'no path-scoped jobs were found -- the assertion below would be vacuous');

const ungated = scoped.filter(id => !gateNeeds.includes(id));
assert.deepEqual(ungated, [],
  `these jobs are path-scoped but missing from the gate's needs: ${ungated.join(', ')}`);

// The gate can only compare a result against an expectation it was given.
const unjudged = scoped.filter(id =>
  !new RegExp(`^          EXPECT_${id.toUpperCase()}: `, 'm').test(gate));
assert.deepEqual(unjudged, [],
  `the gate is not told what scope expected of: ${unjudged.join(', ')} -- ` +
  'without it a job skipped by a broken condition reads as correctly scoped out');

console.log(
  `ci completeness: all ${tracked.length} tracked tests run in ${AUTOMATIC.join(', ')}, ` +
  `and all ${scoped.length} path-scoped jobs are judged by the gate`);

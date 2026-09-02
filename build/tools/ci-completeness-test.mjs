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

/* ------------------------------------------------------- trigger detection */

/* What a workflow fires on, read from its `on:` key. Every form GitHub accepts
   is read, because the guard below turns "this workflow is manual" into a
   licence to ignore what it runs -- and a detector that understands one
   spelling would grant that licence to a workflow written in another.

   Supported: a block mapping (with per-trigger detail beneath it), a block
   sequence, a plain scalar, and a flow sequence of plain names.

   Anything else throws. That is the point rather than a limitation: the two
   errors here are not symmetrical. Reading an automatic workflow as manual
   costs nothing visible and quietly stops its tests counting for anyone,
   which is the failure this guard exists to prevent. So syntax this parser
   does not read -- a flow mapping, an alias, an anchor, a token that is not a
   plain name -- fails the build with an instruction, rather than falling
   through to an empty list that looks exactly like a manual workflow. The
   alternative is growing a YAML parser inside a test, to serve forms this
   repository does not use.

   Returns null only when there is no `on:` key at all, which is asserted on
   separately as a broken workflow rather than a manual one. */
const TRIGGER_KEY = /^(?:on|"on"|'on'):/;
const PLAIN_NAME = /^[a-z][a-z0-9_]*$/;
const uncomment = line => line.replace(/(^|\s)#.*$/, '').trim();
const unquote = token => token.trim().replace(/^['"]|['"]$/g, '').replace(/:$/, '');

function reject(label, detail) {
  throw new Error(
    `${label}: unsupported \`on:\` syntax -- ${detail}. This guard decides which ` +
    'workflows count as CI, so it refuses to guess: write the trigger as a block ' +
    'mapping, a block sequence, a plain scalar, or a flow sequence of plain names.');
}

function triggerName(token, label) {
  const cleaned = unquote(token);
  if (!PLAIN_NAME.test(cleaned)) {
    reject(label, `\`${token.trim()}\` is not a plain trigger name ` +
      '(an alias, an anchor, a merge key or a typo)');
  }
  return cleaned;
}

function triggersIn(source, label = 'workflow') {
  const lines = source.split('\n');
  // YAML 1.1 reads a bare `on` as the boolean true, so some workflows quote
  // the key. GitHub accepts either and they mean the same thing.
  const start = lines.findIndex(line => TRIGGER_KEY.test(line));
  if (start === -1) return null;

  const inline = uncomment(lines[start].replace(TRIGGER_KEY, ''));
  const names = [];

  if (inline.startsWith('{')) {
    // on: {push: null, pull_request: null}
    reject(label, 'a flow mapping is not read here -- rewrite it as a block mapping');
  } else if (inline.startsWith('[')) {
    // on: [push, pull_request]
    if (!inline.endsWith(']')) reject(label, 'an unterminated flow sequence');
    for (const token of inline.slice(1, -1).split(',')) {
      if (token.trim() === '') continue;
      names.push(triggerName(token, label));
    }
  } else if (inline) {
    // on: push
    names.push(triggerName(inline, label));
  } else {
    // The block beneath `on:`. It ends at the next line in column zero --
    // which is what keeps a job named `push` under `jobs:` from reading as a
    // trigger. Only entries at the block's own depth count, so the `inputs:`
    // of a workflow_dispatch cannot contribute a name either.
    let depth = null;
    for (let i = start + 1; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.trim() === '' || line.trimStart().startsWith('#')) continue;
      const indent = line.length - line.trimStart().length;
      if (indent === 0) break;
      if (depth === null) depth = indent;
      if (indent > depth) continue;
      if (indent < depth) break;

      const body = uncomment(line);
      const sequence = body.match(/^-\s*(.*)$/);            // - push
      if (sequence) { names.push(triggerName(sequence[1], label)); continue; }
      const mapping = body.match(/^([^:\s]+):(?:\s|$)/);    // push:
      if (mapping) { names.push(triggerName(mapping[1], label)); continue; }
      reject(label, `\`${body}\` is neither a mapping key nor a sequence entry`);
    }
  }

  // A workflow that fires on nothing is broken, not manual, and saying so here
  // is the difference between a parser that came up empty and one that was
  // told nothing.
  if (names.length === 0) reject(label, 'the trigger list is empty');
  return names;
}

const AUTOMATIC_TRIGGERS = ['push', 'pull_request', 'pull_request_target', 'schedule'];
const automaticTriggersIn = (source, label) => {
  const triggers = triggersIn(source, label);
  return triggers === null ? null : triggers.filter(t => AUTOMATIC_TRIGGERS.includes(t));
};

/* The detector decides whether a workflow's steps count as CI, so it is worth
   more than the one shape this repository happens to use today. */
const detectorCases = [
  ['block mapping', "on:\n  push:\n    branches: ['**']\n  pull_request:\n", ['push', 'pull_request']],
  ['block sequence', 'on:\n  - push\n  - schedule\n', ['push', 'schedule']],
  ['scalar', 'on: push\n', ['push']],
  ['flow sequence', 'on: [push, pull_request]\n', ['push', 'pull_request']],
  ['flow sequence, quoted and spaced', "on: [ 'push', \"schedule\" ]\n", ['push', 'schedule']],
  ['quoted key, because YAML 1.1 reads bare on as true', '"on": push\n', ['push']],
  ['a trailing comment', 'on: push # only pushes\n', ['push']],
  ['manual, block mapping with inputs', 'on:\n  workflow_dispatch:\n    inputs:\n      sha:\n        type: string\n', []],
  ['manual, scalar', 'on: workflow_dispatch\n', []],
  ['manual, flow sequence', 'on: [workflow_dispatch, workflow_call]\n', []],
  // A nested key that happens to be named after a trigger. Reading the block
  // at any depth would call this workflow automatic and let it vouch for
  // whatever it runs.
  ['an input named push', 'on:\n  workflow_dispatch:\n    inputs:\n      push:\n        type: boolean\n', []],
  // The block has to end at column zero. Reading to end of file would find
  // the job below and call this workflow automatic.
  ['a job named push', 'on:\n  workflow_dispatch:\n\njobs:\n  push:\n    runs-on: ubuntu-latest\n', []],
];

for (const [label, source, expected] of detectorCases) {
  assert.deepEqual(automaticTriggersIn(source, label), expected,
    `trigger detection, ${label}: expected [${expected}], got [${automaticTriggersIn(source, label)}]`);
}

/* Syntax the parser does not read has to say so. Each of these is valid YAML
   that GitHub would honour, and each would otherwise have produced an empty
   list -- indistinguishable from a workflow that really is manual. */
const rejectionCases = [
  ['flow mapping', 'on: {push: null, pull_request: null}\n', /flow mapping is not read here/],
  ['flow mapping, single trigger', 'on: {push: null}\n', /flow mapping is not read here/],
  ['alias as the whole trigger', 'on: *triggers\n', /not a plain trigger name/],
  ['alias inside a flow sequence', 'on: [push, *extra]\n', /not a plain trigger name/],
  ['alias as a block sequence entry', 'on:\n  - push\n  - *extra\n', /not a plain trigger name/],
  ['anchor on the trigger key', 'on: &triggers\n  push:\n', /not a plain trigger name/],
  ['a merge key in the block', 'on:\n  <<: *defaults\n  push:\n', /not a plain trigger name/],
  ['a malformed token', 'on: [push, pull request]\n', /not a plain trigger name/],
  ['an unterminated flow sequence', 'on: [push, pull_request\n', /unterminated flow sequence/],
  ['an empty flow sequence', 'on: []\n', /trigger list is empty/],
  ['an empty block', 'on:\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n', /trigger list is empty/],
];

for (const [label, source, expected] of rejectionCases) {
  assert.throws(() => automaticTriggersIn(source, label), expected,
    `unsupported syntax must be rejected, not read as manual: ${label}`);
  // Every rejection must also name the file it came from and say what to do.
  assert.throws(() => automaticTriggersIn(source, label),
    new RegExp(`^Error: ${label}: unsupported \`on:\` syntax`),
    `the rejection for ${label} must name the workflow`);
  assert.throws(() => automaticTriggersIn(source, label), /write the trigger as a block mapping/,
    `the rejection for ${label} must say what to write instead`);
}

assert.equal(triggersIn('name: nothing\njobs:\n  x:\n    runs-on: ubuntu-latest\n', 'no key'), null,
  'a workflow with no on: key must be reported as broken, not as manual');

/* -------------------------------------------------------- the corpus rule */

/* Only workflows that fire on their own can be said to run anything. This
   repository also has publish-wasm-builder.yml, which is workflow_dispatch
   only and already names secp256k1-wasm-test.mjs -- so a corpus of "every
   workflow" would call that test covered on the day it was dropped from the
   automatic build. The list is explicit, and the assertion below stops it
   going stale: any other workflow that gains an automatic trigger has to be
   added here or fail. */
const AUTOMATIC = ['build.yml'];

for (const name of AUTOMATIC) {
  assert.ok(workflowFiles.includes(name),
    `${dir}/${name} is listed as an automatic workflow but does not exist`);
  const automatic = automaticTriggersIn(read(name), `${dir}/${name}`);
  assert.ok(automatic !== null, `${dir}/${name} has no on: key`);
  assert.notDeepEqual(automatic, [],
    `${dir}/${name} is listed as automatic but fires on nothing automatic`);
}

for (const name of workflowFiles.filter(f => !AUTOMATIC.includes(f))) {
  const automatic = automaticTriggersIn(read(name), `${dir}/${name}`);
  assert.ok(automatic !== null, `${dir}/${name} has no on: key`);
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

/* ------------------------------------------------------------- the gate */

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
  `ci completeness: ${detectorCases.length} trigger forms read and ${rejectionCases.length} unsupported ones rejected, all ` +
  `${tracked.length} tracked tests run in ${AUTOMATIC.join(', ')}, and all ` +
  `${scoped.length} path-scoped jobs are judged by the gate`);

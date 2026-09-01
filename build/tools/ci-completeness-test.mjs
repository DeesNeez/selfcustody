import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

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

const workflow = readFileSync('.github/workflows/build.yml', 'utf8')
  .replace(/\r\n?/g, '\n');

const missing = tracked.filter(file => !workflow.includes(file));

assert.deepEqual(missing, [],
  `these tests are committed but never run in CI: ${missing.join(', ')} -- ` +
  'add a step to .github/workflows/build.yml for each');

// This file is itself a build/tools/*-test.mjs, so the check above covers it
// too. Stated outright because a completeness guard that CI never invokes is
// the exact failure it exists to prevent.
assert.ok(workflow.includes('build/tools/ci-completeness-test.mjs'),
  'the completeness guard must itself run in CI');

console.log(`ci completeness: all ${tracked.length} tracked tests run in the build workflow`);

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/build.yml', 'utf8')
  .replace(/\r\n?/g, '\n');
const security = readFileSync('SECURITY.md', 'utf8');
const job = workflow.match(/^  attest-offline:\n[\s\S]*$/m)?.[0] ?? '';

assert.ok(job, 'the workflow must define an offline-artifact attestation job');
assert.match(job, /github\.event_name == 'push' &&/,
  'attestations must be limited to pushes');
assert.match(job, /github\.ref == 'refs\/heads\/main' &&/,
  'attestations must be limited to the default branch');
/* An attestation is a signature over bytes. Re-signing an unchanged file does
   record another source commit and workflow run, but none of that is needed to
   verify bytes the existing attestation already covers, so a prose-only commit
   on main must not mint one -- and the condition has to be a computed fact
   about the diff, not a habit someone remembers to respect. */
assert.match(job, /needs\.scope\.outputs\.offline_html == 'true'/,
  'attestations must be limited to commits that actually change the artifact');
assert.match(job, /needs: \[site, scope, gate\]/,
  'the attestation must wait for the site build and for the gate that reports ' +
  'the Workshop, LifeHash and WASM checks');
assert.match(job, /permissions:\n\s+contents: read\n\s+id-token: write\n\s+attestations: write/,
  'the attestation job must have only its required GitHub permissions');
assert.match(job, /actions\/attest-build-provenance@[0-9a-f]{40} # v4\.2\.2/,
  'the official provenance action must be pinned to an immutable commit');
assert.match(job, /subject-path: docs\/entropy-offline\.html/,
  'the attestation subject must be the downloadable offline HTML');
assert.match(job, /persist-credentials: false/,
  'the attestation checkout must not retain a repository token');

/* The gate reports green when a specialist job is skipped, which is correct on
   a pull request and wrong on the commit being attested: a signature that
   rests on checks nothing ran is a signature over an untested artifact. The
   same fact that authorises the attestation therefore also forces the complete
   suite, so the two cannot come apart -- and because it is that fact rather
   than the branch, an ordinary merge to main stays scoped instead of
   rebuilding the WebAssembly to prove a guide's wording. */
const scope = workflow.match(/^  scope:\n[\s\S]*?(?=\n  [a-z0-9-]+:\n)/m)?.[0] ?? '';
assert.ok(scope, 'the workflow must define the scope job the attestation reads');
assert.match(scope, /\[ "\$offline_html" = 'true' \]; then\n\s+run_all=/,
  'the push that moves the attested artifact must run the complete suite');
assert.doesNotMatch(scope, /\[ "\$GITHUB_REF" = 'refs\/heads\/main' \]; then\n\s+run_all=/,
  'an ordinary push to main must be scoped like any other, not forced to run everything');

assert.match(security,
  /gh attestation verify entropy-offline\.html -R HodlDee\/selfcustody/,
  'the security policy must document provenance verification');
/* The repository was renamed, and an attestation names the repository it was
   signed under. Every artifact published before the rename verifies only under
   the old name, so the policy has to keep documenting it -- dropping it would
   strand every copy already downloaded. */
assert.match(security,
  /gh attestation verify entropy-offline\.html -R DeesNeez\/selfcustody/,
  'the security policy must keep the pre-rename verification command');
assert.match(security, /does not prove that the source\s+itself is correct/i,
  'the documentation must state the attestation trust boundary');

console.log('attestation policy: main-only, artifact-gated, test-gated, least-privilege provenance is pinned');

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync('.github/workflows/build.yml', 'utf8');
const security = readFileSync('SECURITY.md', 'utf8');
const job = workflow.match(/^  attest-offline:\n[\s\S]*$/m)?.[0] ?? '';

assert.ok(job, 'the workflow must define an offline-artifact attestation job');
assert.match(job, /if: github\.event_name == 'push' && github\.ref == 'refs\/heads\/main'/,
  'attestations must be limited to pushes on the default branch');
assert.match(job, /needs: \[verify, build-wasm\]/,
  'the attestation must wait for ordinary verification and a pinned-source WASM rebuild');
assert.match(job, /permissions:\n\s+contents: read\n\s+id-token: write\n\s+attestations: write/,
  'the attestation job must have only its required GitHub permissions');
assert.match(job, /actions\/attest-build-provenance@[0-9a-f]{40} # v4\.2\.2/,
  'the official provenance action must be pinned to an immutable commit');
assert.match(job, /subject-path: docs\/entropy-offline\.html/,
  'the attestation subject must be the downloadable offline HTML');
assert.match(job, /persist-credentials: false/,
  'the attestation checkout must not retain a repository token');

assert.match(security,
  /gh attestation verify entropy-offline\.html -R DeesNeez\/selfcustody/,
  'the security policy must document provenance verification');
assert.match(security, /does not prove that the source\s+itself is correct/i,
  'the documentation must state the attestation trust boundary');

console.log('attestation policy: main-only, test-gated, least-privilege provenance is pinned');

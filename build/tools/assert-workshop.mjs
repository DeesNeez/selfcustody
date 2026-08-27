/* Build guard: the two Workshop builds must be what they claim to be.

   Everything here is a property the page asserts about itself somewhere in its
   own copy. The point is that a claim printed on the page and a claim checked
   by the build should not be able to disagree -- which they did once already,
   when the site build said it was running offline while fetching fonts.

   The fetch rules live in assert-no-fetch.mjs. This covers the rest: the
   checksum beside the artifact, the self-test that gates results, the build
   flag that decides which build a page thinks it is, and the safeguards a
   reader cannot see but is relying on. */

import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const SITE = 'docs/entropy.html';
const OFFLINE = 'docs/entropy-offline.html';
const SIDECAR = 'docs/entropy-offline.html.sha256';

export function assertWorkshop() {
  const problems = [];
  const check = (ok, message) => { if (!ok) problems.push(message); };

  for (const path of [SITE, OFFLINE]) {
    check(existsSync(path), `${path} was not written`);
  }
  if (problems.length) return report(problems);

  const site = readFileSync(SITE, 'utf8');
  const offline = readFileSync(OFFLINE, 'utf8');
  const offlineBytes = readFileSync(OFFLINE);

  /* ---- the checksum beside the file ------------------------------------
     Not a re-derivation of what the build just computed: read the sidecar
     back off disk and hash the artifact independently, so a truncated or
     stale write is caught rather than assumed away. */
  check(existsSync(SIDECAR), `${SIDECAR} is missing; the download tells people to check it`);
  if (existsSync(SIDECAR)) {
    const published = readFileSync(SIDECAR, 'utf8').trim().split(/\s+/)[0];
    const actual = createHash('sha256').update(offlineBytes).digest('hex');
    check(published === actual,
      `the published checksum does not match the artifact\n       sidecar ${published}\n       actual  ${actual}`);
    check(/entropy-offline\.html\s*$/.test(readFileSync(SIDECAR, 'utf8').trim()),
      'the sidecar does not name entropy-offline.html, so shasum -c cannot use it');
  }

  /* ---- the build flag ---------------------------------------------------
     One constant decides whether a page offers the download or the checksum
     panel, and whether it claims to be the self-contained file. Getting it
     backwards is silent: both builds render, one of them lies. */
  check(/const OFFLINE_BUILD = true/.test(offline),
    'the offline build does not set OFFLINE_BUILD = true');
  check(/const OFFLINE_BUILD = false/.test(site),
    'the site build does not set OFFLINE_BUILD = false');

  /* ---- the self-test ----------------------------------------------------
     The page refuses to show results if its embedded vectors fail. That only
     protects anyone if the vectors are actually in the file. */
  for (const [name, html] of [['site', site], ['offline', offline]]) {
    check(/selftest/.test(html), `the ${name} build has no self-test element`);
    const block = html.slice(html.indexOf('VECTORS = ['));
    const vectors = (block.match(/\n\s*\['[^']+',\s*\(\)/g) || []).length;
    check(vectors >= 20,
      `the ${name} build embeds ${vectors} self-test vectors; it should carry at least 20`);
  }

  /* ---- the safeguards nobody can see ------------------------------------ */
  for (const [name, html] of [['site', site], ['offline', offline]]) {
    check(/addEventListener\('pagehide', clearSensitiveState\)/.test(html),
      `the ${name} build does not clear entered material when the page is left`);
    check(/event\.persisted/.test(html),
      `the ${name} build does not clear on a back/forward-cache restore`);
    check(!/addEventListener\('visibilitychange'/.test(html),
      `the ${name} build clears on visibilitychange, which would destroy work when someone switches apps mid-roll`);
    check(/<noscript>/.test(html),
      `the ${name} build has no noscript notice; with scripting off it is a page of dead controls`);
    check(/name="referrer" content="no-referrer"/.test(html),
      `the ${name} build does not set a no-referrer policy`);
    check(/http-equiv="Content-Security-Policy"/.test(html),
      `the ${name} build has no Content-Security-Policy`);
  }

  /* A meta CSP governs only what is parsed after it, so it has to come before
     the first thing that fetches. */
  for (const [name, html] of [['site', site], ['offline', offline]]) {
    const csp = html.indexOf('http-equiv="Content-Security-Policy"');
    const firstFetch = [...html.matchAll(/<(?:link|script|img)\b/gi)]
      .map(m => m.index).filter(i => i >= 0).sort((a, b) => a - b)[0];
    if (csp >= 0 && firstFetch !== undefined) {
      check(csp < firstFetch,
        `the ${name} build declares its CSP after the first resource reference, so early fetches escape it`);
    }
  }

  /* The offline build's whole claim. connect-src is what would let a
     compromised or careless edit phone home with what was typed. */
  check(/default-src 'none'/.test(offline),
    "the offline build's CSP does not start from default-src 'none'");
  check(/connect-src 'none'/.test(site),
    "the site build's CSP does not forbid connect-src; this page has nothing to send anywhere");

  /* The one thing the tool must never grow.

     Comments are stripped first. The first run of this check failed on both
     builds, and what it had found was the comment in each of them explaining
     that the tool contains no random number generator -- a guard reading prose
     instead of code, which is the mistake it exists to catch. */
  const codeOnly = html => html
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
  for (const [name, html] of [['site', site], ['offline', offline]]) {
    check(!/crypto\.getRandomValues|Math\.random\s*\(/.test(codeOnly(html)),
      `the ${name} build calls a random number generator; this tool converts entropy and must never produce it`);
  }

  report(problems);
}

function report(problems) {
  if (problems.length) {
    console.error('\nABORT: the Entropy Workshop builds do not hold up.\n');
    for (const p of problems) console.error(`  - ${p}`);
    console.error('');
    process.exit(1);
  }
  console.log('workshop guard: checksum, self-test, build flags, CSP and clearing all verified');
}

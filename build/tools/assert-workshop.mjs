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
const CR = String.fromCharCode(13);

const codeOnlyEarly = html => html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/\/\*[\s\S]*?\*\//g, ' ');

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

  /* ---- line endings ------------------------------------------------------
     The artifact is hashed byte for byte, so its bytes must be the same
     everywhere. entropy-core.js is checked out CRLF on Windows and LF
     elsewhere and is inlined verbatim, which produced a mixed file: git
     normalised the committed blob, and the published SHA-256 then described
     the working copy rather than what GitHub served. Anyone following the
     verify instructions got a mismatch and was right to distrust the file. */
  check(!offline.includes(CR),
    'the offline artifact contains carriage returns; git will rewrite it and the published checksum will not match what is served');
  check(!site.includes(CR), 'the site build contains carriage returns');

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
    check(vectors >= 26,
      `the ${name} build embeds ${vectors} self-test vectors; it should carry at least 26`);

    /* A count is not coverage. These four are named because each guards
       something no other vector touches: the wordlist beyond the handful of
       words the address vectors happen to use, and the descriptor, whose
       checksum is a second encoding of the account key. */
    for (const vector of [
      'BIP39 wordlist, official English list',
      'BIP39 wordlist, 2048 unique words in order',
      'Descriptor checksum, BIP380 published vector',
      'Watch-only descriptor, BIP84 account',
      /* The 12-word branch of the dictionary method. The suite covers it, but
         the suite is not what ships -- the page embeds its own vectors, and
         until this was listed the branch a reader would actually exercise had
         none. */
      'Octal and hex, 11 throws make BIP39\u2019s all-zero 12-word phrase'
    ]) {
      check(html.includes(vector),
        `the ${name} build does not embed the "${vector}" self-test vector`);
    }
  }

  /* ---- the safeguards nobody can see ------------------------------------ */
  for (const [name, html] of [['site', site], ['offline', offline]]) {
    check(/addEventListener\('pagehide', clearSensitiveState\)/.test(html),
      `the ${name} build does not clear entered material when the page is left`);
    check(/addEventListener\('pageshow', clearSensitiveState\)/.test(html),
      `the ${name} build does not clear on pageshow, so a restored page can come back with its results`);
    check(!/addEventListener\('visibilitychange'/.test(html),
      `the ${name} build clears on visibilitychange, which would destroy work when someone switches apps mid-roll`);
    check(/\$\('passphrase'\)\.addEventListener\('input',\s*\(\)\s*=>\s*\{\s*invalidateDerivedState\(\);\s*paintCount\(\);/s.test(html),
      `the ${name} build cancels derivation on passphrase edits without restoring the Derive button`);
    check(/<noscript>/.test(html),
      `the ${name} build has no noscript notice; with scripting off it is a page of dead controls`);
    check(/name="referrer" content="no-referrer"/.test(html),
      `the ${name} build does not set a no-referrer policy`);
    check(/http-equiv="Content-Security-Policy"/.test(html),
      `the ${name} build has no Content-Security-Policy`);

    /* The deck-turn branch used to return before repainting the meter, keypad
       and Derive button. Pin both the absence of that early exit and the raw
       input handoff needed to detect old/new alias ambiguity. */
    const script = codeOnlyEarly(html);
    check(/id="export-private-open"/.test(html) && /id="export-watch"/.test(html) &&
      /id="export-private-dialog"/.test(html),
      `the ${name} build does not expose both export records and the private-file warning`);
    check(/C\.buildWalletExportTexts\(\{/.test(script) &&
      /passphraseUsed:\s*\$\('passphrase'\)\.value\.length\s*>\s*0/.test(script),
      `the ${name} build does not pass only passphrase presence to the tested export builder`);
    /* The transcript is optional to the builder, because a wallet restored
       from words has none. This page always has one, and a private record
       without it cannot be checked against the paper it was rolled on. */
    check(/source:\s*\{\s*method: method\(\), input: clean\(\), words: state\.words, choice: state\.choice/
      .test(script),
      `the ${name} build does not record the rolls its wallet came from`);
    check(/URL\.createObjectURL\(new Blob\(\[text\]/.test(script) &&
      /URL\.revokeObjectURL\(url\)/.test(script),
      `the ${name} build does not create and revoke its text-download Blob URLs`);
    check(/function invalidateDerivedState\(\)\s*\{[\s\S]*?clearExportState\(\);[\s\S]*?state\.seed\s*=\s*null/.test(script),
      `the ${name} build does not clear export state when its derived wallet is invalidated`);
    /* The SeedQR is the recovery words in another alphabet. Its wipe is not
       inherited from the box it sits in -- invalidateDerivedState clears the
       ids in SECRET_TEXT and nothing else -- so the registration is the whole
       mechanism and is pinned here. Nothing may be encoded before the button
       is pressed, which is what parking the digits in qrSources buys. */
    check(/'seedqr-digits',\s*'seedqr-grid'/.test(script),
      `the ${name} build does not register its SeedQR digits as clearable secret text`);
    check(/qrSources\.seedqr\s*=\s*\{\s*text:\s*digits/.test(script) &&
      !/paintQr\([^)]*digits/.test(script),
      `the ${name} build draws its SeedQR before the button asks for one`);
    /* The strings parked for the QR buttons have to leave on every path that
       invalidates a wallet, not only on a full clear -- editing one roll
       invalidates too. Pinned as both placement and uniqueness: one deletion
       loop, and it sits inside invalidateDerivedState. */
    check((script.match(/delete qrSources\[key\]/g) || []).length === 1,
      `the ${name} build does not drop its parked QR strings in exactly one place`);
    const invalidateStart = script.indexOf('function invalidateDerivedState()');
    const invalidateEnd = script.indexOf('function clearSensitiveState()', invalidateStart);
    const invalidate = invalidateStart >= 0 && invalidateEnd > invalidateStart
      ? script.slice(invalidateStart, invalidateEnd) : '';
    check(/delete qrSources\[key\];/.test(invalidate),
      `the ${name} build keeps parked QR strings alive after its wallet is invalidated`);
    const paintStart = script.indexOf('function paintCount()');
    const paintEnd = script.indexOf('function hideResults()', paintStart);
    const paint = paintStart >= 0 && paintEnd > paintStart
      ? script.slice(paintStart, paintEnd)
      : '';
    check(paint.includes('C.deckProgress') && !/\breturn\b/.test(paint),
      `the ${name} build can leave controls stale by returning early while repainting deck progress`);
    check(/const rawInput\s*=\s*\$\('input'\)\.value/.test(script) &&
      /deriveSeed\(\{[\s\S]*?input:\s*rawInput/.test(script),
      `the ${name} build canonicalises card aliases before the compatibility guard can compare their legacy reading`);
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

  /* navigator.onLine is allowed in one direction only, and this checks that
     structurally rather than by reading the copy.

     A page cannot see an air gap. A disabled adapter, a sleeping radio and a
     machine with no card look identical through that flag, and only one of
     them is what the security brief asks for. So the flag may be read to
     WARN -- `navigator.onLine === true` -- and never in the negative, where
     the only thing it could produce is false reassurance.

     A first attempt at this grepped the rendered text for phrases like
     "air-gapped", and failed on both builds. What it had found was the
     download panel telling the reader to PUT the file on an air-gapped
     machine, and the noscript notice describing the tool as safe to use
     offline. Both are instructions, not claims about the reader's current
     state -- prose read as if it were code, for the third time in these
     guards. Hence: check the comparison, not the copy. */
  for (const [name, html] of [['site', site], ['offline', offline]]) {
    const uses = [...codeOnlyEarly(html).matchAll(/navigator\.onLine\s*(===\s*true)?/g)];
    const negative = uses.filter(m => !m[1]);
    check(negative.length === 0,
      `the ${name} build reads navigator.onLine somewhere other than a "=== true" test; ` +
      'it may warn when a network appears present and must never claim the absence of one');
  }

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

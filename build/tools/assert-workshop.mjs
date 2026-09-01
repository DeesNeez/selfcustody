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
import { Script } from 'node:vm';

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

  /* The generated page is the executable artifact, so compile every inline
     JavaScript block rather than assuming a successful string build means a
     browser can parse it. This caught CSS accidentally inserted into the main
     application script -- content/order guards all passed while the page was
     dead on arrival. External script tags have an empty body and compile as a
     no-op; non-JavaScript data blocks are skipped. */
  for (const [name, html] of [['site', site], ['offline', offline]]) {
    const tags = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
    tags.forEach((match, index) => {
      const type = match[1].match(/\btype=["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (type && !['text/javascript', 'application/javascript', 'module'].includes(type)) return;
      try {
        new Script(match[2], { filename: `${name}-inline-${index + 1}.js` });
      } catch (error) {
        check(false, `the ${name} build's inline script ${index + 1} does not compile: ${error.message}`);
      }
    });
  }

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
    const script = codeOnlyEarly(html);
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
    check(/dataset\.browserChecks/.test(html) && /dataset\.browserFailed/.test(html) &&
      /window\.__entropyWorkshopPreflightPassed\s*=\s*failed\.length\s*===\s*0/.test(html),
      `the ${name} build does not run and record its browser preflight`);
    check(/view\.setBigUint64\(/.test(html) && /dialog\.showModal/.test(html) &&
      /holder\.replaceChildren/.test(html),
      `the ${name} build's preflight misses binary wallet or modal DOM primitives the Workshop requires`);
    check(/WebAssembly \(libsecp256k1 engine\)/.test(html) &&
      /new WebAssembly\.Module\(/.test(html),
      `the ${name} build does not preflight its libsecp256k1 WebAssembly engine`);
    check(/if \(window\.__entropyWorkshopPreflightPassed !== true\) return;/.test(html),
      `the ${name} build starts the Workshop application after a failed browser preflight`);
    const preflight = html.indexOf('Browser preflight for the Entropy Workshop');
    const secp = html.indexOf('Minimal classic-script facade over the libsecp256k1 WebAssembly module');
    const core = html.indexOf('Crypto core for the entropy tool');
    check(preflight >= 0 && secp > preflight && core > secp,
      `the ${name} build does not load preflight, libsecp256k1 and the crypto core in order`);
    check(/EntropySecp256k1Ready\.then\(/.test(html) &&
      /Cryptography engine failed to start/.test(html),
      `the ${name} build does not gate application boot on libsecp256k1 initialization`);
    check(/EntropySecp256k1\.publicKeyCreate/.test(html) &&
      /EntropySecp256k1\.pointAdd/.test(html) &&
      !/const Gx\s*=|const Gy\s*=|const inv\s*=|const modPow\s*=/.test(html),
      `the ${name} build still contains a hand-written secp256k1 curve path`);
    check(/id="beta-disclaimer"[^>]*role="alertdialog"[^>]*aria-modal="true"[^>]*hidden/.test(html) &&
      /id="beta-disclaimer-accept"[^>]*><span>I understand<\/span><\/button>/.test(html),
      `the ${name} build does not ship a hidden, accessible beta acknowledgement`);
    // The label is wrapped so `.dl > *` can lift it above the shine sweep; an
    // unwrapped text node would sit under it. The acknowledgement wears the
    // download action's own classes rather than a copy of its rules, which is
    // the only thing keeping the two buttons from drifting apart.
    check(/<div class="dl-frame">\s*<button class="dl beta-disclaimer-accept"/.test(html) &&
      !/\.beta-disclaimer-accept\s*\{/.test(html),
      `the ${name} build does not give the acknowledgement the shared download-action skin`);
    /* The local badge reports what the *file* is. It must not drift into
       claiming anything about the machine, which is the same line the
       navigator.onLine check below is drawn on: "no network required" is a
       property of this file and stays true on a connected laptop. Both
       variants ship in the markup so the row settles before paint. */
    check(/<span class="where-local" hidden>/.test(html) &&
      /class="where-doc"[^>]*aria-hidden="true"/.test(html) &&
      /<span class="where-main">Local copy<\/span>/.test(html) &&
      /<span class="where-sep" aria-hidden="true"><\/span>/.test(html) &&
      /<span class="where-sub">No network required<\/span>/.test(html),
      `the ${name} build does not label the local copy as a property of the file`);
    check(/id="adapter"[^>]*>This machine reports a connection</.test(html),
      `the ${name} build does not keep the machine-connection warning`);
    /* Only .good and .warn ever coloured the status dot, so a self-test that
       FAILED showed the same neutral grey as one still running -- the state
       that most needs to be unmistakable was the one with no mark of its own.
       Neither mark animates: a failure that moves reads as progress. */
    check(/class="selftest-mark selftest-pass"[^>]*aria-hidden="true"/.test(html) &&
      /class="selftest-mark selftest-fail"[^>]*aria-hidden="true"/.test(html) &&
      !/\.selftest-mark[^{}]*\{[^{}]*animation/.test(html),
      `the ${name} build does not give the self-test a static pass and fail mark`);
    /* One resting edge for every workbench control, defined once and referenced
       by each skin. The point of the token is the pads that are hidden until
       the source changes: they inherit it without appearing on any list, so a
       new method cannot ship with the old white edge.

       Counted rather than named, because naming the three would have to be
       revisited every time a control is added -- which is the failure this
       replaces. State colours are asserted separately: they set their own
       border-color and must keep winning over the resting one. */
    check(/--edge-rest: rgba\(232, 214, 181, 0\.34\)/.test(html) &&
      (html.match(/border: 1px solid var\(--edge-rest\)/g) || []).length >= 3,
      `the ${name} build does not share one resting edge across the workbench controls`);
    /* \s* before each brace: the site build scopes its selectors and closes
       them up, the offline build leaves them unscoped with a space. Matching
       one form silently passes on one build and fails on the other. */
    check(/seg button\[aria-pressed="true"\]\s*\{[^}]*border-color: var\(--orange\)/.test(html) &&
      /seg button:hover\s*\{[^}]*border-color: rgba\(255, 138, 0, 0\.45\)/.test(html) &&
      /key:hover:not\(:disabled\)\s*\{[^}]*border-color: rgba\(255, 138, 0, 0\.6\)/.test(html),
      `the ${name} build lost a control's hover or selected edge to the resting one`);

    /* The step badge belongs on the heading's own line. It used to be
       absolutely positioned at the fieldset's left edge, which meant every one
       of the seven panels carried ~56px of empty left padding purely to clear
       it -- a column of numbers standing apart from the headings they number,
       paid for out of the content width.

       Both halves are checked, because either one alone lets the old layout
       back: the badge has to stay in flow, and the padding it used to need has
       to stay gone. A guard on only the padding would pass with the badge
       overlapping the controls. */
    const badge = html.match(/workbench legend::before\s*\{[^}]*\}/);
    check(!!badge && /display: inline-grid/.test(badge[0])
      && !/position: absolute/.test(badge[0]),
      `the ${name} build took the step badge out of the heading line`);
    check(/workbench fieldset\s*\{[^}]*padding: 24px 0 25px;/.test(html)
      && /setup-grid fieldset\s*\{[^}]*padding: 18px;/.test(html),
      `the ${name} build still reserves a left gutter for the step badge`);
    check(/selfcustody-entropy-beta-accepted/.test(script) &&
      /localStorage\.getItem\(STORAGE_KEY\)\s*===\s*version/.test(script) &&
      /localStorage\.setItem\(STORAGE_KEY, version\)/.test(script) &&
      /EntropyBetaWarning\.init\(\{ version: '2026-08-29-beta-1' \}\)/.test(script),
      `the ${name} build does not remember acknowledgement by Workshop release`);
    const wasmReady = script.indexOf('EntropySecp256k1Ready.then');
    const betaInit = script.indexOf('EntropyBetaWarning.init');
    check(wasmReady >= 0 && betaInit > wasmReady,
      `the ${name} build can reveal the beta acknowledgement before the cryptography engine succeeds`);
    check(/id="security-brief"/.test(html) &&
      /\.security-brief\s*\{\s*position:\s*relative/.test(html) &&
      !/security-sticky-mobile|security-sticky-toggle|security-sticky-panel/.test(html),
      `the ${name} build does not preserve the normal in-page warning`);
    check(/M8\.982 1\.566a1\.13 1\.13/.test(html),
      `the ${name} build does not use the filled warning triangle in its safety notices`);
    const betaCopy = 'This tool is experimental and should be used only for testing. Do not rely on it to secure real bitcoin, and never test with funds you cannot afford to lose.';
    const phraseCopy = 'Never enter an existing recovery phrase into any page';
    check((html.match(new RegExp(betaCopy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length === 2 &&
      (html.match(new RegExp(phraseCopy, 'g')) || []).length === 2,
      `the ${name} build lets its modal and in-page warning wording drift apart`);
    check(/name="referrer" content="no-referrer"/.test(html),
      `the ${name} build does not set a no-referrer policy`);
    check(/http-equiv="Content-Security-Policy"/.test(html),
      `the ${name} build has no Content-Security-Policy`);

    /* The deck-turn branch used to return before repainting the meter, keypad
       and Derive button. Pin both the absence of that early exit and the raw
       input handoff needed to detect old/new alias ambiguity. */
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
    check(/id="export-wallet-open"/.test(html) &&
      /id="export-wallet-confirm"/.test(html) &&
      /hodlWalletExport\.buildWalletDat\(wallet, true, walletDatDeps\(accountNode\)\)/.test(script),
      `the ${name} build does not offer the private Bitcoin Core wallet.dat behind the export warning`);
    check(/new Blob\(\[bytes\], \{ type: 'application\/octet-stream' \}\)/.test(script) &&
      /downloadBinaryRecord\(bytes, hodlWalletExport\.walletDatFilename\(true\)\)/.test(script),
      `the ${name} build does not create the wallet.dat as a revocable binary download`);
    check(/function invalidateDerivedState\(\)\s*\{[\s\S]*?clearExportState\(\);[\s\S]*?state\.seed\s*=\s*null/.test(script),
      `the ${name} build does not clear export state when its derived wallet is invalidated`);
    /* The check runs on input, so the field is the whole control -- there is
       no button, and the live status is what confirms a match. Both icons are
       decoration; the label's `for` and the status's live region are what
       carry it. */
    check(/class="addr-icon"[^>]*aria-hidden="true"/.test(html) &&
      /<\/svg>Check an address<\/label>/.test(html) &&
      /class="address-match-local"><svg[^>]*aria-hidden="true"/.test(html) &&
      /Checked locally on this page<\/p>/.test(html) &&
      /input\[type="text"\]:focus[^{]*\{[^}]*outline: 2px solid var\(--orange\)/.test(html),
      `the ${name} build does not keep the address panel's icons, local note and focus ring`);
    /* The empty status collapses so it does not hold a blank line under the
       field. It must collapse by height: display: none takes the live region
       out of the accessibility tree, and a region that appears only as it
       gains text is the classic way to lose the announcement. */
    check(/address-match-status:empty\s*\{[^}]*min-height: 0/.test(html)
      && !/address-match-status:empty\s*\{[^}]*display: none/.test(html),
      `the ${name} build hides the empty address status instead of collapsing it`);
    /* The two export cards say opposite things and must not be shades of one
       colour. Red is the private record; green -- the checksum's green, not a
       third one -- is the watch-only. It was orange, the page's caution
       colour, which read as a milder warning rather than as the safe option.
       The wallet.dat control is the one filled button in the pair and is
       keyed by id so it wins over the private card's red. */
    check(/export-card\.is-private\s*\{[^}]*rgba\(214, 94, 64/.test(html) &&
      /export-card\.is-watch\s*\{[^}]*border-color: rgba\(65, 205, 158, 0\.84\)/.test(html) &&
      /is-watch \.export-tag\s*\{[^}]*color: #9af0d3/.test(html) &&
      /is-watch \.export-button\s*\{[^}]*color: #9af0d3/.test(html) &&
      !/is-watch[^{]*\{[^}]*rgba\(255, 138, 0/.test(html),
      `the ${name} build does not keep the export cards red for private and green for watch-only`);
    check((html.match(/class="export-card-icon" aria-hidden="true"/g) || []).length === 2 &&
      /export-card\s*\{[^}]*border: 2px solid/.test(html) &&
      !/export-card(?:\.is-(?:private|watch))?::(?:before|after)/.test(html),
      `the ${name} build loses the export cards' icons or even four-sided borders`);
    check(/<div class="go-frame">\s*<button[^>]*class="go"[^>]*id="go"/.test(html) &&
      /class="go-icon"[^>]*aria-hidden="true"/.test(html) &&
      /id="go-label">Produce wallet/.test(html) &&
      /\$\('go-label'\)\.textContent = info\.lookup/.test(script) &&
      /\$\('go-label'\)\.textContent = 'Working\\u2026'/.test(script) &&
      !/\$\('go'\)\.textContent/.test(script) &&
      /workbench \.go-frame\s*\{[^}]*padding: 6px/.test(html) &&
      /workbench \.go::after\s*\{[^}]*rgba\(255, 245, 224, 0\.42\)/.test(html),
      `the ${name} build loses the framed primary action or its accessible label`);
    check(/<div class="export-actions" role="group" aria-labelledby="export-download-label">/.test(html) &&
      /<div class="export-actions" role="group" aria-labelledby="export-watch-download-label">/.test(html) &&
      (html.match(/id="export-[a-z-]*download-label">Download:</g) || []).length === 3 &&
      /export-actions \.export-button\s*\{[^}]*flex: 1 1 0/.test(html) &&
      /export-actions \.export-button\s*\{[^}]*min-height: 40px/.test(html) &&
      /export-actions \.export-button\s*\{[^}]*min-height: 44px/.test(html) &&
      /#export-wallet-open\s*\{[^}]*background: rgba\(255, 138, 0, 0\.20\)/.test(html),
      `the ${name} build does not lay the private card's two actions out as an even, captioned pair`);
    /* Scoped to the captioned row, not the page. The confirmation dialog
       behind these buttons has its own "Download ..." actions and should keep
       them: that is where the file is actually written. What must not come
       back is the word inside the two labels the caption now covers. */
    const actionRows = [...html.matchAll(/<div class="export-actions"[^>]*>[\s\S]*?<\/div>/g)];
    check(actionRows.length === 3 && actionRows.every(row => !/Download/.test(row[0])),
      `the ${name} build put "Download" back inside a button label the caption already covers`);
    /* Cancel is not a download and must not sit inside the group the caption
       labels -- a screen reader reads that label onto everything in it. */
    check(actionRows.every(row => !/value="cancel"/.test(row[0])),
      `the ${name} build put Cancel inside the labelled download group`);
    /* The button says only "wallet.dat" now, so the card has to say whose
       format that is. Without this the only mention of Bitcoin Core on the way
       to the file is inside the dialog you reach by pressing the button --
       nothing to read beforehand. */
    const privateCard = html.match(/<article class="export-card is-private">[\s\S]*?<\/article>/);
    check(!!privateCard && /Bitcoin Core/.test(privateCard[0]),
      `the ${name} build offers a bare wallet.dat without naming Bitcoin Core on the card`);
    check(/id="address-match"/.test(html) && /id="address-match-status"[^>]*role="status"/.test(html),
      `the ${name} build does not expose the derived-wallet address check`);
    check(/const ADDRESS_SEARCH_LIMIT\s*=\s*1000/.test(script) &&
      /const ADDRESS_SEARCH_BATCH\s*=\s*1/.test(script) &&
      /C\.prepareDerivedAddressSearch\(\{/.test(script) &&
      /C\.matchDerivedAddress\(raw, receive, change\)/.test(script) &&
      /C\.findDerivedAddress\(\{/.test(script) &&
      /setTimeout\(searchNext, 0\)/.test(script),
      `the ${name} build does not check receive and change indices 0-999 in cancellable batches`);
    check(/addressCheckToken\s*\+=\s*1/.test(script) && /renderedAddressRows\s*=\s*null/.test(script),
      `the ${name} build does not cancel an address search when its wallet is invalidated`);
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
    check(/data-qr="compactseedqr"/.test(html) &&
      /qrSources\.compactseedqr\s*=\s*\{\s*bytes:\s*compact/.test(script) &&
      /qrcodegen\.QrCode\.encodeBinary\(payload, ecc\)/.test(script) &&
      /C\.compactSeedQrBytes\(state\.seed\.entropy\)/.test(script),
      `the ${name} build does not offer CompactSeedQR as binary BIP39 entropy`);
    check(/const QR_QUIET\s*=\s*4/.test(script),
      `the ${name} build's QR renderer does not preserve the four-module quiet zone`);
    /* A 12-word octal-and-hex run has 128 checksum-valid endings, but the
       physical choice is only two dice. Pin that direct mapping and keep the
       complete reference list as a disclosure without an inner scrollbar. */
    check(/id="ending-octal"[^>]*aria-label="Octal die result"/.test(html) &&
      /id="ending-hex"[^>]*aria-label="Hex die result"/.test(html) &&
      /<summary>Show all 128 possible words<\/summary>/.test(html),
      `the ${name} build does not expose the two-die ending picker and its full reference list`);
    check(/i\s*=>\s*i\s*\*\s*16\s*\+\s*hex/.test(script) &&
      /i\s*=>\s*octal\s*\*\s*16\s*\+\s*i/.test(script),
      `the ${name} build does not map octal and hex faces to the 128 endings`);
    check(/id="results-loading"[^>]*role="status"/.test(html) &&
      /hideResults\(\{\s*keepEndings,\s*loading:\s*keepEndings\s*\}\)/.test(script),
      `the ${name} build hides the ending picker while it updates the selected wallet`);
    const manyEndingRule = html.match(/\.ending-list\.is-many\s*\{([^}]*)\}/)?.[1] || '';
    check(manyEndingRule && !/max-height|overflow-y/.test(manyEndingRule),
      `the ${name} build puts an inner scrollbar on the 128-word reference grid`);
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
    const paintEnd = script.indexOf('function hideResults(', paintStart);
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
  check(/script-src[^;]*'wasm-unsafe-eval'/.test(site) &&
    /script-src[^;]*'wasm-unsafe-eval'/.test(offline),
    "the Workshop CSP does not permit its inlined libsecp256k1 WebAssembly module");

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

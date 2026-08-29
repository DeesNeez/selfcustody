/* Builds docs/tools/entropy.html -- one self-contained file with no external
   requests of any kind, so it behaves identically served from the site and
   opened from a USB stick on a laptop that has never had a network cable in it.

   Everything is inlined: the crypto core, the 2048-word BIP39 list, the styles,
   the two webfonts and the logo. No font, no stylesheet, no script, no image is
   fetched. The CSP meta tag below is one line, so a reader can check that claim
   without reading the rest of the file:

     default-src 'none'   nothing may be loaded from anywhere
     font-src   data:     except fonts already inside this file
     img-src    data:     and images already inside this file

   `data:` is not a network scheme -- it is the file's own bytes -- so those two
   allowances do not let anything off the page. Grant a scheme rather than a
   host and the guarantee survives.

   Deliberately absent, and worth stating because their absence is the design:

     - nothing that generates randomness. No Math.random, no getRandomValues,
       no "roll for me" button. The user supplies every bit of entropy, which
       is what stops this page from being able to create a wallet on its own.
     - no input that accepts an existing seed phrase or private key. The dice
       guide tells readers that anything asking them to type a real phrase in
       to "verify" it is stealing from them; the site cannot ship that sentence
       and a phrase box on the same domain. */

import { readFileSync } from 'node:fs';
import { scopeCss } from './scope-css.mjs';

const CORE = 'build/tools/entropy-core.js';
const SECP_WASM_B64 = 'build/tools/secp256k1-wasm-b64.js';
const SECP_WASM = 'build/tools/secp256k1-wasm.js';
const BETA_WARNING = 'build/tools/beta-warning.js';
const LIFEHASH = 'build/tools/lifehash.js';
const PREFLIGHT = 'build/tools/browser-preflight.js';
/* EntropyLab's Bitcoin Core descriptor-wallet exporter from pull request #32.
   Both scripts are MIT licensed; the retained notice is beside them under
   build/vendor/entropylab-wallet-export/. */
const SQLITE_WRITER = 'build/tools/sqlite-writer.js';
const WALLET_DAT = 'build/tools/wallet-dat.js';
/* Project Nayuki's QR generator, MIT, vendored and compiled once. See
   build/vendor/qr/README.md for the upstream commit and why this one library
   is here when the crypto beside it is written from the specifications. */
const QRLIB = 'build/vendor/qr/qrcodegen.js';
const WORDS = 'build/tools/bip39-english.txt';
/* Bump only when the Entropy Workshop itself is released. Acceptance stores
   this public label and nothing derived from the reader's input. */
const ENTROPY_RELEASE = '2026-08-29-beta-1';

/* The page wears the site's chrome, which means it needs the site's two
   typefaces and its logo -- and it cannot fetch any of them, because the whole
   point is that it works with the network off. So they are embedded.

   Both families are shipped by Google as a single variable font per family
   rather than one file per weight (the 400, 600 and 700 downloads of Open Sans
   are byte-identical), so one file covers every weight the page uses. Each is
   then subset to the characters that actually appear here, which takes the
   pair from 198 KB to 39 KB. See build/vendor/fonts/README.md. */
const FONTS = [
  { family: 'Jost', file: 'build/vendor/fonts/jost-latin.woff2', range: '100 900' },
  { family: 'Open Sans', file: 'build/vendor/fonts/open-sans-latin.woff2', range: '300 800' }
];

/* font-display: block, not swap.

   swap is the right answer for a font arriving over a network -- show fallback
   text immediately rather than nothing, and accept the reflow when it lands.
   Neither half of that reasoning applies here. There is no request: the bytes
   are already in the file, and the only delay is decoding them. swap still
   painted a frame of fallback first, so every load flickered from system sans
   into Jost for no reason at all.

   block holds the text invisible until the face is ready. Against a network
   that is a gamble; against a data: URI it is a few milliseconds, and the text
   arrives in the right typeface the first time it is drawn. */
const embedFont = ({ family, file, range }) => `
  @font-face {
    font-family: "${family}";
    font-style: normal;
    font-weight: ${range};
    font-display: block;
    src: url(data:font/woff2;base64,${readFileSync(file).toString('base64')}) format("woff2");
  }`;

/* The logo goes in as a CSS background the same way the site does it, so the
   markup stays a bare span. URL-encoded rather than base64: an SVG is text, and
   percent-encoding keeps it roughly a third smaller and still readable. */
const embedSvg = path => 'data:image/svg+xml,' + encodeURIComponent(
  readFileSync(path, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim()
).replace(/'/g, '%27').replace(/"/g, '%22');

const styles = () => `
${FONTS.map(embedFont).join('\n')}

  :root {
    --orange: #ff8a00;
    --orange-dark: #d96f00;
    --ink: #ece7e0;
    --ink-soft: #cfc9bd;
    --muted: #a49e93;
    --paper: #1a1918;
    --surface: #242220;
    --line: #6e695e;
    --success: #35b48a;
    --danger: #d65e40;
  }

  * { box-sizing: border-box; }

  body {
    margin: 0;
    padding: 0;
    color: var(--ink);
    background:
      radial-gradient(circle at 18% 38%, rgba(255, 138, 0, 0.035), transparent 30rem),
      #151514;
    font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.7;
  }

  h1, h2, h3, h4, .brand { font-family: "Jost", "Open Sans", sans-serif; }

  .wrap { max-width: 1040px; margin: 0 auto; padding: 0 28px; }

  /* ---- site chrome ------------------------------------------------------
     Rebuilt here rather than shared with the rest of the site, because a
     <link> to site-refresh.css would leave the downloaded copy unstyled the
     moment it is opened offline. Same tokens, same shapes, one file. */

  /* ---- the file banner --------------------------------------------------

     What sits at the top of the downloaded copy, in place of the site header
     that used to be drawn here. A navigation bar in this file was always a
     small lie: its links only resolve with a connection, and this file exists
     to be useful without one. What an air-gapped reader needs instead is to
     know what they are holding, so that is what it says. */
  .file-banner {
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: #0d0d0e;
  }
  .file-banner-inner {
    display: flex; align-items: center; gap: 14px;
    padding-top: 14px; padding-bottom: 14px;
  }
  .file-banner strong {
    display: block; color: #fff; font-size: 1rem; letter-spacing: 0.01em;
  }
  .file-banner span {
    display: block; margin-top: 2px; color: var(--muted); font-size: 0.85rem;
  }
  .brand-mark {
    flex: 0 0 auto; width: 30px; height: 30px; border-radius: 8px;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 46 46'%3E%3Ccircle cx='13.5' cy='13.5' r='4.6' fill='%23f5222b'/%3E%3Ccircle cx='32.5' cy='13.5' r='4.6' fill='%23eee2c7'/%3E%3Ccircle cx='13.5' cy='32.5' r='4.6' fill='%233c9056'/%3E%3Ccircle cx='32.5' cy='32.5' r='4.6' fill='%23ff9900'/%3E%3C/svg%3E"),
      linear-gradient(152deg, #23262c 0%, #101318 46%, #06070a 100%);
    background-repeat: no-repeat; background-position: center; background-size: 100% 100%;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 3px 8px rgba(0, 0, 0, 0.4);
  }


  /* ---- hero -------------------------------------------------------------
     The same shape the guide pages open with: cleared header, display-size
     heading, lead, then the badges. */
  .hero {
    min-height: 420px;
    display: flex; align-items: center;
    padding: 108px 0 46px;
    color: #fff;
    background:
      radial-gradient(circle at 88% 10%, rgba(255, 138, 0, 0.15), transparent 32rem),
      linear-gradient(135deg, #1f1f1e, #292825);
  }
  /* The 108px above clears the site's fixed header, which the downloaded copy
     does not have -- its banner is a short static bar. Left alone, that
     padding becomes a band of empty space above the breadcrumb. */
  /* min-height plus align-items:center was the real culprit: with the hero
     taller than its contents, centring pushed the breadcrumb down however
     small the padding got. Sized to its content instead, so the padding is
     the whole story. */
  .is-offline-copy .hero { min-height: auto; padding-top: 40px; padding-bottom: 40px; }
  @media (max-width: 820px) {
    .is-offline-copy .hero { padding-top: 30px; padding-bottom: 32px; }
  }

  .crumb { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 700; }
  /* Links default to the accent instead of the browser's blue. Every context
     below used to set its own colour, so any link added somewhere new arrived
     unstyled and close to unreadable on this background -- twice. Class rules
     still win where a context wants something else. */
  a { color: var(--orange); }

  /* An author display rule beats the browser's [hidden] { display: none }, so
     anything given display:grid or display:flex keeps rendering after the
     script hides it. That has now caught the download panel and the
     fingerprint arrow, both of which stayed on screen while their hidden
     attribute was correctly set -- invisible in the markup, obvious on screen.
     One guard, rather than remembering it rule by rule. */
  [hidden] { display: none !important; }

  .crumb a { color: var(--ink-soft); text-decoration: none; }
  .crumb a:hover { color: var(--orange); }
  .crumb span { color: var(--muted); }

  h1 { margin: 0 0 16px; font-size: clamp(2rem, 4.2vw, 3.1rem); line-height: 1.1; color: #fff; }
  .lead { margin: 0; max-width: 640px; color: var(--ink-soft); font-size: 1.12rem; line-height: 1.6; }
  .eyebrow {
    display: block; margin-bottom: 12px; color: var(--orange-dark);
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
  }

  main { display: block; padding-bottom: 70px; }

  .banner {
    margin: 22px 0; padding: 16px 18px; border-radius: 12px;
    border: 1px solid rgba(255, 138, 0, 0.42);
    background: rgba(255, 138, 0, 0.08);
    font-size: 0.93rem;
  }
  .banner strong { color: var(--orange); }
  .banner p { margin: 0 0 8px; }
  .banner p:last-child { margin-bottom: 0; }

  .status {
    display: flex; flex-wrap: wrap; gap: 10px;
    margin: 20px 0 0; padding: 0; list-style: none;
    font-size: 0.78rem; font-weight: 700;
  }
  .status li {
    padding: 6px 11px; border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.03);
    color: var(--muted);
  }
  .status li.good { color: #8be3c6; border-color: rgba(53, 180, 138, 0.4); background: rgba(53, 180, 138, 0.08); }
  .status li.warn { color: #ffc07f; border-color: rgba(255, 138, 0, 0.4); background: rgba(255, 138, 0, 0.08); }
  .status li.bad  { color: #ff9d8a; border-color: rgba(214, 94, 64, 0.5); background: rgba(214, 94, 64, 0.1); }

  fieldset { margin: 26px 0 0; padding: 0; border: 0; }
  legend { padding: 0; margin-bottom: 9px; color: #fff; font-size: 0.95rem; font-weight: 700; }
  .hint { margin: 7px 0 0; color: var(--muted); font-size: 0.85rem; }
  /* The only hint that sits directly on top of something to press. A shared
     7px top margin and no bottom left the sentence crowding the first row of
     keys, so it reads as a label on the "1" rather than as instructions for
     the pad. */
  #pad-hint { margin-bottom: 15px; }


  .seg { display: flex; flex-wrap: wrap; gap: 8px; }
  .seg button {
    flex: 1 1 auto; min-width: 116px; padding: 11px 14px;
    color: var(--ink); background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 10px;
    font: inherit; font-size: 0.92rem; font-weight: 700; cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }
  .seg button:hover { border-color: rgba(255, 138, 0, 0.45); background: rgba(255, 138, 0, 0.07); }
  .seg button[aria-pressed="true"] {
    color: #fff; background: rgba(255, 138, 0, 0.16); border-color: var(--orange);
  }
  .seg button small { display: block; font-weight: 600; font-size: 0.75rem; color: var(--muted); }
  .seg button[aria-pressed="true"] small { color: #ffc07f; }
  .seg button:disabled { opacity: 0.35; cursor: not-allowed; }
  /* Equal shares rather than sized to their text, so a longer label does not
     make one option look like the important one. */
  .seg-even button { flex: 1 1 0; }
  .seg button:disabled:hover { border-color: rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.03); }
  /* Four conversions with device names under them need more room than a
     two-way choice, or the names wrap mid-word. */
  .seg-tall button { min-width: 152px; }

  /* A grid rather than the flex row the other steps use, because a drawing
     plus two lines of text needs a width that flex-wrap cannot promise: at
     700px these went two-across-then-one, the odd card stretched to full
     width. Three equal tracks or one, nothing in between, and grid equalises
     the heights when the longest label takes a second line. */
  .source-pick {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;
  }
  /* Against the left edge, so all three drawings sit at the same offset and
     the row keeps a line down its left side. Centring the group was tried
     both ways -- with the text centred and with it ragged-left -- and both
     put the three drawings at three different offsets.

     Larger type than the other steps carry: this row is the first choice on
     the page and reads as a heading for what follows, not as one more toggle.
     Sized against the 90px card, not against the segmented controls below. */
  .source-pick button {
    display: flex; align-items: center; gap: 13px;
    min-width: 0; text-align: left; font-size: 1.06rem;
  }
  .source-pick button small { margin-top: 2px; font-size: 0.8rem; }
  .source-pick .seg-mark { flex: 0 0 auto; display: grid; place-items: center; }
  .source-pick .seg-mark svg {
    display: block; width: 30px; height: 30px;
    opacity: 0.62; transition: opacity 0.15s ease;
  }
  /* Dimmed until the option is under consideration, so three drawings at rest
     do not compete with the step legend above them. */
  .source-pick button:hover .seg-mark svg,
  .source-pick button[aria-pressed="true"] .seg-mark svg { opacity: 1; }
  .source-pick .seg-body { min-width: 0; }
  /* Three from the site's own four-dot mark: the coin gold, the die bone, the
     card the same red the suit keys use. */
  .source-pick button[data-value="coin"] .seg-mark { color: #ffa933; }
  .source-pick button[data-value="dice"] .seg-mark { color: #e9dcc0; }
  .source-pick button[data-value="cards"] .seg-mark { color: #ff7a6b; }
  /* Below this a third of the row leaves about 90px for the words, which puts
     "six-sided, or octal and hex" on three lines beside a 30px drawing. One
     per row instead: the full width, the picture still on the left. */
  @media (max-width: 720px) {
    .source-pick { grid-template-columns: minmax(0, 1fr); }
  }

  .opt {
    margin-left: 8px; padding: 2px 7px; border-radius: 999px;
    background: rgba(255, 255, 255, 0.07); color: var(--muted);
    font-size: 0.62rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
    vertical-align: middle;
  }

  /* ---- the account key --------------------------------------------------
     Sits below the addresses because it is the same information at a
     different altitude: the addresses are two leaves, this is the branch they
     hang off. Wrapped rather than scrolled, since people copy it by hand as
     often as by button. */
  /* The wallet's identity, so it sits above the words rather than below the
     addresses: it is the first thing to compare against the device. */
  .fingerprint {
    margin: 26px 0 22px; padding: 18px 18px 16px;
    border: 1px solid rgba(255, 138, 0, 0.28); border-radius: 12px;
    background: rgba(255, 138, 0, 0.05);
  }
  .fp-label {
    display: block; margin-bottom: 8px; color: var(--muted);
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
  }
  .fp-row { display: flex; align-items: flex-start; gap: 6px 14px; flex-wrap: wrap; }
  .fp-cell { display: flex; align-items: baseline; gap: 10px; }
  .fp-identity { display: flex; align-items: center; gap: 10px; }
  .fp-copy { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .fp-lifehash {
    width: 48px; height: 48px; flex: 0 0 48px; image-rendering: pixelated;
    border: 3px solid rgba(255, 255, 255, 0.13); border-radius: 8px;
    background: rgba(0, 0, 0, 0.35);
  }
  .fp-lifehash[hidden] { display: none; }
  /* An author display rule beats the browser's [hidden] { display: none }, so
     the arrow half needs to opt back out explicitly. Without this it shows the
     same fingerprint twice whenever there is no passphrase. */
  .fp-cell[hidden] { display: none; }
  .fp-row b {
    color: #ffad4c; font-size: 1.25rem; font-weight: 800; letter-spacing: 0.08em;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
  .fp-cell em {
    color: var(--muted); font-style: normal;
    font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .fp-arrow { color: var(--muted); font-style: normal; font-size: 1.1rem; }
  .fingerprint .hint { margin: 10px 0 0; }

  .xpub-box {
    margin-top: 16px; padding: 18px 20px;
    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px;
    background: rgba(0, 0, 0, 0.22);
  }
  /* An extended key is 111 characters, and at 0.86rem it needed 840px in a box
     offering 834 -- six pixels over, so every key broke onto a second line for
     the sake of about half a character. A smaller fixed size only moves the
     width at which that happens.

     So the type is sized to the box instead: 111 characters at this font
     advance measure 61.1em, which is why the cap is a hair under 1/61 of the
     container. It never grows past 0.86rem, and shrinks only as far as it must.
     The plain declaration first is the fallback for anything without container
     queries -- there the key wraps as it does today rather than vanishing. */
  .xpub-box { container-type: inline-size; }
  .xpub-box p {
    margin: 8px 0 0; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.86rem; line-height: 1.55; color: var(--ink); word-break: break-all;
    /* Clamped, not min(): on a phone the box is 233px and shrink-to-fit would
       have solved the wrap by rendering the key at 3.7px. The floor is the
       point where it stops shrinking and starts wrapping again, which is the
       right trade on a narrow screen. */
    font-size: clamp(0.82rem, 1.6cqi, 0.86rem);
  }
  .xpub-box .label { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .xpub-box .label span {
    color: var(--muted); font-size: 0.72rem; font-weight: 800;
    letter-spacing: 0.12em; text-transform: uppercase;
  }
  .xpub-box .label b { color: #ffad4c; }
  .checksum-note {
    margin: 10px 0 0; padding: 9px 12px; border-radius: 9px;
    font-size: 0.82rem; line-height: 1.55;
  }
  /* The verdict alone on the line, and the arithmetic behind it one tap away.
     The box itself is the disclosure now, so the green line carries nothing
     but "Checksum verified" and a chevron.

     The summary keeps its default display and loses its marker through
     list-style, which is deliberate: setting display on a <summary> stops
     some browsers treating it as the disclosure's summary at all, and the
     first version of this shipped with the "collapsed" text permanently
     visible underneath. The row is laid out by a span inside it instead. */
  .checksum-note > summary { cursor: pointer; list-style: none; }
  .checksum-note > summary::-webkit-details-marker { display: none; }
  .checksum-head { display: flex; align-items: center; gap: 10px; font-weight: 700; }
  .checksum-head b { flex: 1 1 auto; min-width: 0; font-weight: 700; }
  /* Drawn rather than typed, so it takes the box's own colour and turns with
     the disclosure instead of being a glyph the font may not carry. */
  .checksum-head i {
    flex: 0 0 auto; width: 7px; height: 7px; margin-right: 2px;
    border-right: 2px solid currentColor; border-bottom: 2px solid currentColor;
    transform: translateY(-2px) rotate(45deg); transition: transform 0.15s ease;
  }
  .checksum-note[open] .checksum-head i { transform: translateY(1px) rotate(-135deg); }
  .checksum-body b { display: block; margin-top: 10px; opacity: .9; }
  .checksum-body p { margin: 5px 0 0; color: var(--muted); font-size: 0.8rem; line-height: 1.6; }
  /* A failed phrase has nothing worth expanding: it cannot be used, and the
     arithmetic about which last word fits would be beside the point. */
  .checksum-note.is-bad > summary { cursor: default; }
  .checksum-note.is-bad .checksum-head i,
  .checksum-note.is-bad .checksum-body { display: none; }
  .checksum-note.is-ok {
    color: #8be3c6; border: 1px solid rgba(53, 180, 138, 0.48); background: rgba(53, 180, 138, 0.13);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }
  .checksum-note.is-bad {
    color: #ff9d8a; border: 1px solid rgba(214, 94, 64, 0.5); background: rgba(214, 94, 64, 0.1);
  }

  .xpub-box #xpub-alt-row { margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
  /* One long unbroken token with punctuation the browser will happily break
     at the wrong place, so it wraps anywhere rather than pushing the panel
     wide. Same treatment the account key already gets. */
  /* Exempt: at 154 characters this wraps at any readable size, so it keeps
     the full one rather than shrinking to no purpose. */
  .descriptor-box #descriptor { overflow-wrap: anywhere; word-break: break-all; font-size: 0.86rem; }
  /* Sits directly under the recovery words rather than behind a fold. The
     words are the more powerful secret -- they rebuild every account, where
     this rebuilds one -- so hiding the lesser value while printing the greater
     one above it would be theatre. Tinted in the warning colour instead,
     because it is the one value on this page that spends.
     A modifier on .xpub-box, not its own panel, so the two key boxes cannot
     drift apart. Equal specificity, so these win on source order. */
  .xprv-box { border-color: rgba(214, 94, 64, 0.5); background: rgba(214, 94, 64, 0.085); }
  .xprv-box .label span,
  .xprv-box .label b { color: #ff9d8a; }
  .xprv-box #xprv-alt-row { margin-top: 14px; }
  /* Same construction as the checksum disclosure: the summary keeps its
     default display and loses its marker through list-style, with the row laid
     out by a span inside it. Setting display on a <summary> stops some
     browsers treating it as the disclosure's summary at all. */
  .xprv-more { margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(214, 94, 64, 0.28); }
  .xprv-more > summary { cursor: pointer; list-style: none; }
  .xprv-more > summary::-webkit-details-marker { display: none; }
  .xprv-more-head { display: flex; align-items: baseline; gap: 10px; }
  .xprv-more-head b {
    color: var(--ink); font-size: 0.84rem; font-weight: 700;
    letter-spacing: 0.01em;
  }
  /* The summary used to carry the derivation path, which did the pushing.
     The path now sits with the key it belongs to, so the chevron holds the
     right edge itself. */
  .xprv-more-head i {
    flex: 0 0 auto; width: 7px; height: 7px; margin: 0 2px 0 auto;
    border-right: 2px solid #ff9d8a; border-bottom: 2px solid #ff9d8a;
    transform: translateY(-2px) rotate(45deg); transition: transform 0.15s ease;
  }
  .xprv-more[open] .xprv-more-head i { transform: translateY(1px) rotate(-135deg); }
  .xprv-more-body { margin-top: 10px; }
  .xprv-more-body > .label { margin-bottom: 6px; }
  /* Two sections in one disclosure, so the second announces itself. */
  #seedqr-block {
    margin-top: 18px; padding-top: 16px;
    border-top: 1px solid rgba(214, 94, 64, 0.22);
  }
  .xprv-box .qr-button:hover { color: #ff9d8a; border-color: rgba(214, 94, 64, 0.62); }
  /* Grouped in fours because four digits is exactly one word's index, so the
     grouping lines up with the numbered list above rather than being decoration.
     Margins on the spans rather than spaces between them: what a person copies
     is the unbroken run every SeedQR reader expects. */
  .seedqr-digits {
    margin: 12px 0 0; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9rem; line-height: 1.9; color: var(--ink);
  }
  .seedqr-digits span { display: inline-block; margin-right: 0.6em; }
  .descriptor-split { margin-top: 14px; }
  .descriptor-split summary { font-size: 0.85rem; }
  .split-line { display: grid; gap: 3px; margin: 0 0 10px; }
  .split-line span { color: var(--muted); font-size: 0.74rem; letter-spacing: .05em; text-transform: uppercase; }
  .split-line code { overflow-wrap: anywhere; word-break: break-all; font-size: 0.78rem; }
  .xpub-note {
    font-family: inherit !important; color: var(--muted) !important;
    font-size: 0.85rem !important; margin-top: 12px !important; word-break: normal !important;
  }

  /* The two files are deliberately not presented as equivalent buttons. One
     is a spending backup and one is watch-only metadata; putting them in one
     undifferentiated action row would make the dangerous choice look like a
     format preference. The cards state their contents before the buttons,
     and the private one gets the warning colour and a second confirmation. */
  .export-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .export-card {
    display: flex; flex-direction: column; min-width: 0; padding: 18px;
    border: 1px solid rgba(255, 255, 255, 0.11); border-radius: 12px;
    background: rgba(0, 0, 0, 0.18);
  }
  .export-intro { margin-bottom: 15px; }
  .export-card.is-private { border-color: rgba(214, 94, 64, 0.5); background: rgba(214, 94, 64, 0.085); }
  .export-card.is-watch { border-color: rgba(255, 138, 0, 0.34); background: rgba(255, 138, 0, 0.055); }
  .export-tag {
    width: fit-content; margin-bottom: 9px; padding: 4px 9px; border-radius: 5px;
    color: var(--muted); background: rgba(255, 255, 255, 0.06);
    font-size: 0.76rem; font-weight: 800; line-height: 1.25; letter-spacing: 0.07em; text-transform: uppercase;
  }
  .is-private .export-tag { color: #ff9d8a; background: rgba(214, 94, 64, 0.14); }
  .is-watch .export-tag { color: #ffad4c; background: rgba(255, 138, 0, 0.11); }
  .export-card h4 { margin: 0 0 7px; color: #fff; font-size: 0.98rem; }
  .export-card p { margin: 0 0 16px; color: var(--muted); font-size: 0.83rem; line-height: 1.6; }
  .export-card .export-button { margin-top: auto; }
  .export-card .export-button + .export-button { margin-top: 8px; }
  .export-button {
    width: 100%; padding: 10px 13px; border: 1px solid rgba(255, 255, 255, 0.17);
    border-radius: 8px; color: var(--ink); background: rgba(255, 255, 255, 0.055);
    font: inherit; font-size: 0.83rem; font-weight: 800; cursor: pointer;
  }
  .export-button:hover:not(:disabled) { color: #fff; border-color: rgba(255, 138, 0, 0.56); }
  .export-button:disabled { opacity: 0.55; cursor: wait; }
  .is-private .export-button { color: #ff9d8a; border-color: rgba(214, 94, 64, 0.48); }
  .is-private .export-button:hover:not(:disabled) { border-color: rgba(255, 157, 138, 0.72); }
  .is-watch .export-button { color: #ffad4c; border-color: rgba(255, 138, 0, 0.36); }
  .export-status { min-height: 1.4em; margin: 9px 0 0; color: var(--muted); font-size: 0.78rem; }

  .export-dialog {
    width: min(520px, calc(100vw - 32px)); padding: 25px 27px;
    color: var(--ink); background: #201a18;
    border: 1px solid rgba(214, 94, 64, 0.7); border-radius: 14px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.62);
  }
  .export-dialog::backdrop { background: rgba(8, 7, 6, 0.74); }
  .export-dialog h2 { margin: 0 32px 10px 0; color: #ff9d8a; font-size: 1.25rem; }
  .export-dialog p { margin: 0 0 11px; color: var(--ink-soft); font-size: 0.9rem; line-height: 1.65; }
  .export-dialog strong { color: #fff; }
  .export-dialog-close {
    float: right; margin: -5px -5px 0 0; padding: 0 6px; border: 0; border-radius: 6px;
    color: var(--muted); background: none; font-size: 1.3rem; line-height: 1.2; cursor: pointer;
  }
  .export-dialog-close:hover { color: #ff9d8a; }
  /* role="alert" is assertive, which is right here: it only ever carries a
     refusal, and a refusal the person cannot see is the bug this fixes. */
  .export-dialog-error:empty { display: none; }
  .export-dialog-error {
    margin: 16px 0 0; padding: 10px 12px; border-radius: 8px;
    border: 1px solid rgba(214, 94, 64, 0.5); background: rgba(214, 94, 64, 0.12);
    color: #ff9d8a; font-size: 0.84rem; line-height: 1.55;
  }
  .export-dialog-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 19px; }
  .export-dialog-actions .export-button { width: auto; }
  .export-dialog .export-button { color: #ff9d8a; border-color: rgba(214, 94, 64, 0.48); }
  .export-dialog .export-button:hover:not(:disabled) { border-color: rgba(255, 157, 138, 0.72); }

  @media (max-width: 620px) {
    .export-grid { grid-template-columns: 1fr; }
    .export-dialog { padding: 22px 20px; }
    .export-dialog-actions { display: grid; }
    .export-dialog-actions .export-button, .export-dialog-actions .key-tool { width: 100%; }
  }

  /* ---- the checksum-valid endings ---------------------------------------
     Only the lookup methods reach this. It sits between the button and the
     results because it is a step, not an outcome: choosing an ending chooses
     the wallet. */
  .endings {
    margin-top: 22px; padding: 20px 22px;
    border: 1px solid rgba(255, 138, 0, 0.3); border-radius: 14px;
    background: rgba(255, 138, 0, 0.05);
  }
  .endings strong { display: block; margin-bottom: 8px; color: #ffad4c; font-size: 1.02rem; }
  .endings p { margin: 0 0 16px; color: var(--ink-soft); font-size: 0.92rem; line-height: 1.6; }
  .ending-list { display: flex; flex-wrap: wrap; gap: 8px; }
  /* For a 12-word octal-and-hex seed, the physical instruction is to roll one
     octal and one hex die. Mirror those two objects instead of making someone
     search a 128-item control. */
  .ending-direct { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .ending-face-set {
    min-width: 0; padding: 12px; border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 11px; background: rgba(0, 0, 0, 0.16);
  }
  .ending-face-label {
    display: block; margin-bottom: 8px; color: var(--muted); font-size: 0.7rem;
    font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
  }
  .ending-face-options { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 5px; }
  .ending-face {
    min-width: 0; padding: 8px 2px; color: var(--ink-soft);
    border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 7px;
    background: rgba(255, 255, 255, 0.035); font: inherit; font-size: 0.82rem;
    font-weight: 800; cursor: pointer;
  }
  .ending-face:hover { color: #fff; border-color: rgba(255, 138, 0, 0.5); }
  .ending-face[aria-pressed="true"] {
    color: #fff; border-color: var(--orange); background: rgba(255, 138, 0, 0.16);
  }
  .ending-picked {
    grid-column: 1 / -1; display: flex; align-items: baseline; gap: 10px;
    margin: 0; padding: 12px 14px; border: 1px solid rgba(255, 138, 0, 0.28);
    border-radius: 11px; background: rgba(255, 138, 0, 0.06);
  }
  .ending-picked span {
    color: var(--muted); font-size: 0.7rem; font-weight: 800;
    letter-spacing: 0.08em; text-transform: uppercase;
  }
  .ending-picked b { color: #fff; font-size: 1.05rem; }
  .ending-picked code { margin-left: auto; color: #ffad4c; font-size: 0.8rem; }
  .ending-all { margin-top: 14px; }
  .ending-all > summary { color: #ffad4c; }
  .ending-all[open] > summary { margin-bottom: 10px; }
  /* Twelve words offers 128 valid endings. Keep every one in the page flow so
     the optional reference grid expands in the page flow rather than becoming
     a second, easy-to-miss scrolling area inside the page. */
  .ending-list.is-many {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
    gap: 6px;
    padding: 10px; border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 11px;
    background: rgba(0, 0, 0, 0.18);
  }
  .ending-list.is-many .ending { padding: 8px 10px; font-size: 0.82rem; }
  @media (max-width: 620px) {
    .ending-direct { grid-template-columns: 1fr; }
    .ending-picked { grid-column: 1; }
    .ending-face-options { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  /* The throw that picks this ending. */
  .ending small {
    display: block; margin-bottom: 3px;
    color: var(--muted); font-size: 0.66rem; font-weight: 700; letter-spacing: .06em;
  }
  .ending[aria-pressed="true"] small { color: inherit; opacity: 0.75; }

  .ending {
    padding: 10px 16px; color: var(--ink); background: rgba(0, 0, 0, 0.28);
    border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 10px;
    font: inherit; font-size: 0.95rem; font-weight: 700; cursor: pointer;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }
  .ending:hover { border-color: rgba(255, 138, 0, 0.45); background: rgba(255, 138, 0, 0.07); }
  .ending[aria-pressed="true"] { color: #fff; background: rgba(255, 138, 0, 0.16); border-color: var(--orange); }

  input[type="text"], textarea {
    width: 100%; padding: 12px 14px; color: var(--ink);
    background: rgba(0, 0, 0, 0.28);
    border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 10px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.95rem; line-height: 1.6;
  }
  input[type="text"]:focus, textarea:focus { outline: 2px solid var(--orange); outline-offset: 1px; }
  textarea { min-height: 116px; resize: vertical; word-break: break-all; }

  .path-row { display: flex; gap: 8px; align-items: flex-start; }
  .path-row input { flex: 1; }
  .path-row button {
    padding: 12px 14px; color: var(--ink-soft); background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 10px;
    font: inherit; font-size: 0.85rem; font-weight: 700; cursor: pointer; white-space: nowrap;
  }
  .path-row button:hover { border-color: rgba(255, 138, 0, 0.45); }

  /* ---- the keypad -------------------------------------------------------
     Ninety-nine entries is a lot to type without a slip, and a slip here is
     not a typo -- it is a different wallet. Big targets, an undo, and a count
     that never lets you overshoot. Typing still works; this is the easier way
     in, not the only one. */
  .pad {
    display: grid; gap: 8px; margin-bottom: 8px;
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
  .pad[data-method="coin"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  /* Twenty keys. Five across keeps them square-ish at this width and puts
     1-20 in four tidy rows, which is easier to find a face in than six. */
  .pad[data-method="octahex"] { grid-template-columns: repeat(8, minmax(0, 1fr)); }
  .pad[data-method="octahex"] .key { padding: 13px 6px; font-size: 1.15rem; }
  @media (max-width: 560px) {
    .pad[data-method="octahex"] { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  .key {
    padding: 16px 8px; color: #fff;
    background: rgba(255, 255, 255, 0.045);
    border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 11px;
    font: inherit; font-size: 1.35rem; font-weight: 700; line-height: 1.1;
    cursor: pointer; user-select: none;
    transition: background-color 0.12s ease, border-color 0.12s ease, transform 0.06s ease;
  }
  .key small { display: block; margin-top: 3px; font-size: 0.7rem; font-weight: 700; color: var(--muted); letter-spacing: 0.04em; }
  .key:hover:not(:disabled) { background: rgba(255, 138, 0, 0.14); border-color: rgba(255, 138, 0, 0.6); }
  .key:active:not(:disabled) { transform: translateY(1px); background: rgba(255, 138, 0, 0.22); }
  .key:disabled { opacity: 0.3; cursor: not-allowed; }

  .pad-tools { display: flex; gap: 8px; margin-bottom: 12px; }
  .key-tool {
    padding: 9px 14px; color: var(--ink-soft);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 9px;
    font: inherit; font-size: 0.85rem; font-weight: 700; cursor: pointer;
  }
  .key-tool:hover:not(:disabled) { color: #fff; border-color: rgba(255, 138, 0, 0.45); }
  .key-tool:disabled { opacity: 0.35; cursor: not-allowed; }

  @media (max-width: 620px) {
    .pad { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .key { padding: 18px 8px; font-size: 1.5rem; }
  }

  /* Says why entry stopped. role="status" rather than an alert: it is
     information, not an error, and it should not interrupt anyone using a
     screen reader mid-roll. */
  /* The deal, read back. Chips rather than a run of characters, because the
     job here is checking a physical pile against a screen, and 58 cards as one
     unbroken string is exactly the shape that hides a transposition. */
  .deal {
    display: flex; flex-wrap: wrap; gap: 4px;
    margin: 10px 0 0; padding: 10px 12px;
    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
    background: rgba(0, 0, 0, 0.22);
    max-height: 132px; overflow-y: auto;
  }
  .deal b {
    padding: 2px 6px; border-radius: 5px;
    background: rgba(255, 255, 255, 0.06); color: var(--ink);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.78rem; font-weight: 700; line-height: 1.5;
  }
  .deal b.red { color: #ff7a6b; }
  .deal b span { margin-left: 0.15em; }
  /* Where one deck ends and the next begins. A full-width break rather than a
     separator between two chips: the reader is holding 52 cards in one hand and
     six in the other, and the screen should be the same shape. */
  .deal .deal-break {
    flex: 0 0 100%; display: flex; align-items: center; gap: 8px;
    margin: 4px 0 2px; color: #ffad4c;
    font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .deal .deal-break::after {
    content: ""; flex: 1 1 auto; height: 1px; background: rgba(255, 138, 0, 0.35);
  }
  .deck-turn {
    margin: 8px 0 0; padding: 8px 12px; border-radius: 9px;
    border: 1px solid rgba(255, 138, 0, 0.4); background: rgba(255, 138, 0, 0.1);
    color: #ffc07f; font-size: 0.85rem; font-weight: 700; line-height: 1.5;
  }

  .cap-notice {
    margin: 8px 0 0; padding: 9px 12px;
    border: 1px solid rgba(255, 138, 0, 0.35); border-radius: 9px;
    background: rgba(255, 138, 0, 0.08);
    color: #ffad4c; font-size: 0.85rem; line-height: 1.5;
  }

  /* The entropy meter. Deliberately quieter than the roll counter beside it:
     the counter says whether the page will accept the input, which is the
     actionable fact, while this says how much the input could be worth, which
     is the interesting one. */
  .meter { margin-top: 14px; }
  .meter-head {
    display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
    margin-bottom: 7px; color: var(--muted); font-size: 0.78rem;
    letter-spacing: .04em; text-transform: uppercase;
  }
  .meter-head b {
    color: var(--ink); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.85rem; letter-spacing: 0; text-transform: none;
  }
  .meter-track {
    height: 6px; border-radius: 99px; overflow: hidden;
    background: rgba(255, 255, 255, 0.08);
  }
  .meter-track i {
    display: block; width: 0; height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, rgba(255, 138, 0, 0.55), #ff8a00);
    transition: width .28s ease;
  }
  .meter-track i.is-full { background: linear-gradient(90deg, #4fb477, #6ede9a); }
  .meter-note { margin: 8px 0 0; color: var(--muted); font-size: 0.8rem; line-height: 1.55; }
  /* Its own line and its own colour, because it only appears when someone has
     gone past the target and is the one thing on the meter they need to read.
     Block rather than inline: trailing a fourth sentence onto grey body text
     is how a caution gets skimmed. */
  .meter-cap {
    display: block; margin-top: 8px; padding: 7px 11px; border-radius: 8px;
    border: 1px solid rgba(255, 138, 0, 0.34); background: rgba(255, 138, 0, 0.1);
    color: #ffc07f; font-weight: 700; text-align: center;
  }
  @media (prefers-reduced-motion: reduce) { .meter-track i { transition: none; } }

  /* Optional equipment check. A native disclosure keeps every statistic out
     of sight unless it is deliberately opened, and the columns read as a
     small histogram rather than duplicating EntropyLab's verdict card. */
  .distribution {
    margin-top: 16px; border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px; background: rgba(0, 0, 0, 0.16);
  }
  .distribution[hidden] { display: none; }
  .distribution > summary {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 11px 13px; cursor: pointer; color: var(--ink); font-weight: 750;
    list-style: none;
  }
  .distribution > summary::-webkit-details-marker { display: none; }
  .distribution > summary::before { content: '+'; color: #ffad4c; font-size: 1.1rem; }
  .distribution[open] > summary::before { content: '\\2212'; }
  .distribution > summary span:first-child { margin-right: auto; }
  .distribution > summary small {
    color: var(--muted); font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .distribution-body { padding: 0 13px 14px; }
  .distribution-intro, .distribution-wait, .distribution-caveat {
    margin: 0; color: var(--muted); font-size: 0.8rem; line-height: 1.55;
  }
  .distribution-wait { padding-top: 3px; }
  .distribution-report { padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
  .distribution-report + .distribution-report { margin-top: 14px; }
  .distribution-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
  .distribution-head strong { font-size: 0.88rem; }
  .distribution-status { color: var(--muted); font-size: 0.72rem; font-weight: 800; }
  .distribution-status.is-balanced { color: #8be3c6; }
  .distribution-status.is-uneven { color: #ff9d8a; }
  .distribution-stats { margin: 4px 0 10px; color: var(--muted); font-size: 0.72rem; }
  .distribution-chart {
    display: grid; grid-template-columns: repeat(var(--faces), minmax(20px, 1fr));
    align-items: end; gap: 5px; min-height: 112px;
  }
  .distribution-face { display: grid; grid-template-rows: 18px 72px 18px; gap: 3px; text-align: center; }
  .distribution-face > b, .distribution-face > small {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.68rem; font-variant-numeric: tabular-nums;
  }
  .distribution-face > b { color: var(--ink); }
  .distribution-face > small { color: var(--muted); }
  .distribution-column {
    position: relative; display: flex; align-items: end; overflow: hidden;
    border-radius: 5px 5px 2px 2px; background: rgba(255, 255, 255, 0.06);
  }
  .distribution-column > i { width: 100%; min-height: 1px; background: rgba(255, 138, 0, 0.7); }
  .distribution-column > span {
    position: absolute; left: 0; right: 0; height: 1px;
    background: rgba(255, 255, 255, 0.65);
  }
  .distribution-caveat { margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.08); }

  /* The dice source has two kinds behind it; the toggle only appears once the
     dice card is chosen, so the first row stays three even choices.

     The question sits on its own line above the pair rather than inline beside
     them. Set alongside, at the size a hint is set, it read as a caption on
     the buttons instead of a question about them -- and it is a real choice,
     not an aside: the two dice go to different wallets. */
  .sub-pick {
    display: grid; gap: 10px;
    margin-top: 17px; padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.09);
  }
  .sub-pick > span {
    color: #fff; font-family: "Jost", sans-serif; font-size: 1rem; font-weight: 700;
  }

  /* Red suits red, black suits the ordinary key colour -- the one place on the
     pad where the glyph carries meaning the letter does not. */
  .key[data-suit="H"], .key[data-suit="D"] { color: #ff7a6b; }
  /* The glyph is the label here, so it gets the room a face value would. */
  .key[data-suit] { padding-left: 4px; padding-right: 4px; font-size: 1.95rem; line-height: 1; }
  /* "DIAMONDS" is three characters longer than any other name on the pad and
     was the one that did not fit: 66px of text in a 53px box, painting out
     past the key's own edge. The tracking goes and the size comes down until
     the longest name fits the narrowest key. */
  .key[data-suit] small { letter-spacing: 0; font-size: 0.54rem; }
  .pad[data-method="cards"], .pad[data-method="cardscoleman"], .pad[data-method="cardbits"] {
    grid-template-columns: repeat(auto-fit, minmax(58px, 1fr));
  }

  .count { display: flex; justify-content: space-between; gap: 12px; margin-top: 8px; font-size: 0.85rem; }
  .count b { font-variant-numeric: tabular-nums; color: #fff; }
  .count .short { color: var(--muted); }
  .count .ready { color: #8be3c6; }
  .count .over  { color: #ff9d8a; }

  .go {
    margin-top: 22px; padding: 14px 26px; width: 100%;
    color: #241300; background: var(--orange); border: 0; border-radius: 10px;
    font: inherit; font-size: 1rem; font-weight: 800; cursor: pointer;
  }
  .go:hover { background: #ffa233; }
  .go:disabled { opacity: 0.45; cursor: not-allowed; }

  .error {
    margin-top: 18px; padding: 14px 16px; border-radius: 10px;
    border: 1px solid rgba(214, 94, 64, 0.5); background: rgba(214, 94, 64, 0.1);
    color: #ff9d8a; font-size: 0.92rem;
  }

  .sanity-failure { min-height: 58vh; display: grid; place-items: center; padding: 28px 0; }
  .sanity-failure-card {
    width: min(100%, 680px); padding: 28px 24px; text-align: center;
    border: 1px solid rgba(214, 94, 64, 0.62); border-radius: 14px;
    background: rgba(214, 94, 64, 0.1);
  }
  .sanity-failure-icon {
    width: 54px; height: 54px; margin: 0 auto 12px; display: grid; place-items: center;
    border: 2px solid #ff9d8a; border-radius: 50%; color: #ff9d8a;
    font-size: 2rem; line-height: 1;
  }
  .sanity-failure-card h1 { margin: 0 0 8px; font-size: 1.45rem; }
  .sanity-failure-card > p { color: var(--muted); }
  .sanity-failure-card table { width: 100%; margin: 18px 0; border-collapse: collapse; }
  .sanity-failure-card th, .sanity-failure-card td {
    padding: 9px 12px; border: 1px solid rgba(255, 255, 255, 0.14); text-align: left;
  }
  .sanity-failure-card th { color: var(--muted); }
  .sanity-failure-card td:last-child { color: #ff9d8a; font-weight: 800; }
  .sanity-failure-advice { margin-bottom: 0; }

  /* Shown either way, saying different things: served, it offers the download;
     from a local file it confirms which file you are running and keeps the
     checksum check, which is the one moment that check is genuinely useful.
     It sits above the controls rather than below the results, because whether
     to run this online or offline is a decision you want to make before you
     start typing rolls in, not after. */
  .download {
    display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 28px;
    /* Pinned to the top of the row rather than centred in it. Centring
       measures against the copy column, and that column is not the same
       height in both states: served it reads "Run it offline instead", opened
       from disk it reads "Running the local copy" and adds the path line,
       which is 34px taller. So the button sat in a different place depending
       on where the page had been opened from. Against the top edge it lands
       identically in both, and the checksum row below still cannot move it. */
    align-items: start;
    margin: 0 0 38px; padding: 21px 22px; border-radius: 16px;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }
  /* Without this the grid item keeps its default min-width:auto, which is the
     intrinsic width of the widest thing inside it -- the verify commands, set
     in white-space:pre. The item then refuses to shrink and pushes the whole
     page into a horizontal scroll on a phone, rather than letting the <pre>
     scroll inside itself as intended. */
  .download-copy { min-width: 0; }
  .download-copy strong { display: block; margin-bottom: 9px; color: #fff; font-family: "Jost", sans-serif; font-size: 1.25rem; }
  .download-copy p { margin: 0 0 10px; color: var(--ink-soft); font-size: 0.9rem; }
  .download-copy .verify, .verify-details .verify { margin: 0 0 6px; color: var(--muted); font-size: 0.85rem; }
  .download-copy .verify:last-child, .verify-details .verify:last-child { margin-bottom: 0; }
  .download-copy code, .verify-details code {
    padding: 1px 5px; border-radius: 4px; word-break: break-all;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em; color: var(--ink-soft); background: rgba(0, 0, 0, 0.3);
  }
  .download-copy pre {
    margin: 0 0 10px; padding: 10px 12px; overflow-x: auto;
    background: rgba(0, 0, 0, 0.34); border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }
  .download-copy pre code {
    padding: 0; background: none; border-radius: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.8rem; color: var(--ink); white-space: pre;
  }
  .download-copy pre span { color: var(--muted); }

  /* The two commands and the platform each one belongs to. This was a single
     <pre> with the labels pushed right by literal spaces: inside white-space:
     pre that placed them beyond the block's own scroll edge, so on a phone the
     reader got two near-identical hash commands and neither label -- the one
     part that says which is which was the part that could not be seen. As grid
     cells they stay in the layout, and wrap under their command rather than
     off the side of it. */
  .verify-cmds {
    display: grid; grid-template-columns: minmax(0, 1fr) auto;
    gap: 4px 14px; align-items: baseline;
    margin: 0 0 10px; padding: 10px 12px;
    background: rgba(0, 0, 0, 0.34);
    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;
  }
  .verify-cmds code {
    min-width: 0; padding: 0; overflow-x: auto;
    background: none; border-radius: 0; word-break: normal; white-space: pre;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.8rem; color: var(--ink);
  }
  .verify-cmds span { color: var(--muted); font-size: 0.78rem; }

  @media (max-width: 560px) {
    .verify-cmds { grid-template-columns: minmax(0, 1fr); gap: 2px; }
    .verify-cmds span { margin-bottom: 9px; }
    .verify-cmds span:last-of-type { margin-bottom: 0; }
  }
  .download-copy a, .verify-details a { color: var(--orange); }


  /* Its own row under both columns, not the foot of the left one. Opening it
     used to add 150px to that column, which slid the download button down the
     page -- the button moving because of something read beside it. Below
     everything it grows into empty space and nothing above it shifts, on the
     stacked layout as well as the wide one. */
  .verify-details { grid-column: 1 / -1; margin: 0; }
  .verify-details summary {
    display: flex; align-items: center; gap: 9px; width: fit-content;
    color: var(--ink-soft); font-size: 0.84rem;
  }
  .verify-details summary::before {
    content: "+"; display: grid; place-items: center; width: 20px; height: 20px;
    border: 1px solid rgba(255, 138, 0, 0.34); border-radius: 6px;
    color: #ffad4c; font-size: 0.9rem; line-height: 1;
  }
  .verify-details[open] summary::before { content: "\\2212"; }
  .verify-body { margin-top: 12px; }

  .download-action { display: grid; gap: 8px; justify-items: center; width: 205px; }

  /* On the hub, the visible border around "Enter Workshop" is not the button's
     own -- its gradient border-box ring is too close in colour to read clearly
     on its own, same problem as here. What actually reads as a border is the
     dark translucent frame the button sits inside, .sc-hero-actions on that
     page. Copied here as .dl-frame so the two match by construction rather
     than by eye. */
  .dl-frame {
    display: flex; width: 100%;
    padding: 6px;
    background: rgba(8, 9, 11, 0.62);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 14px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 18px 46px rgba(0, 0, 0, 0.34);
  }

  /* Same skin as the hub's "Enter Workshop" button (gradient border, glow, a
     shine sweep on hover) rather than the flat single-color fill this used to
     have. Downloading this file is arguably the main action on this page --
     it deserves the same weight as the button pointing at it from the hub,
     not a plainer one once you actually arrive. */
  .dl {
    display: inline-flex; align-items: center; justify-content: center; gap: 9px;
    position: relative; isolation: isolate; overflow: hidden;
    width: 100%; padding: 15px 20px; white-space: nowrap;
    color: #fff; text-decoration: none; text-shadow: none;
    font-size: 0.95rem; font-weight: 800; text-align: center;
    border: 1px solid transparent;
    border-radius: 10px;
    background:
      linear-gradient(135deg, #ff940f, #d56200) padding-box,
      linear-gradient(135deg, #ffc36f, #7f3200) border-box;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.24),
      0 9px 24px rgba(255, 122, 0, 0.22);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .dl:visited { color: #fff; text-decoration: none; }
  .dl:hover {
    color: #fff; text-decoration: none; text-shadow: none;
    background:
      linear-gradient(135deg, #ffab38, #df6900) padding-box,
      linear-gradient(135deg, #ffe0b5, #9b4000) border-box;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 12px 30px rgba(255, 122, 0, 0.3);
    transform: translateY(-2px);
  }
  .dl::after {
    position: absolute; z-index: 1; top: -45%; bottom: -45%; left: -32%; width: 22%;
    background: linear-gradient(90deg, transparent, rgba(255, 245, 224, 0.42), transparent);
    content: ""; pointer-events: none; opacity: 0;
    transform: skewX(-18deg) translateX(-180%);
    transition: transform 0.72s cubic-bezier(0.2, 0.72, 0.22, 1), opacity 0.18s ease;
  }
  .dl:hover::after { opacity: 1; transform: skewX(-18deg) translateX(700%); }
  /* Keep the white icon and label above the moving highlight. */
  .dl > * { position: relative; z-index: 2; }
  .dl:focus-visible {
    color: #fff; text-decoration: none; text-shadow: none;
    outline: 2px solid #fff; outline-offset: 3px;
  }
  .dl-icon { flex: 0 0 auto; display: block; }
  .download-action small { color: var(--muted); font-size: 0.75rem; }

  @media (max-width: 620px) {
    .download { grid-template-columns: 1fr; gap: 16px; }
    .download-action { width: 100%; justify-items: stretch; }
    .dl { text-align: center; }
  }


  /* Only ever seen with scripting off, so it cannot rely on anything the page
     does at runtime. Styled like the security brief above it rather than as an
     error: nothing has gone wrong, the page just cannot do its job. Red would
     imply a fault to fix. */
  .noscript-brief {
    border-color: rgba(255, 138, 0, 0.4);
    background: rgba(255, 138, 0, 0.07);
  }
  .noscript-brief p { margin: 0 0 10px; color: var(--ink-soft); font-size: 0.92rem; line-height: 1.6; }
  .noscript-brief p:last-child { margin-bottom: 0; color: var(--muted); }
  .noscript-brief strong { color: #ffad4c; }

  /* ---- the refusal dialog ----------------------------------------------
     A modal rather than an inline message, because this is the one thing on
     the page that must not be scrolled past. Red rather than the page's
     orange: everything else here warns, this one stops. */
  .alarm {
    width: min(560px, calc(100vw - 32px));
    padding: 26px 28px; color: var(--ink);
    background: #201a18;
    border: 1px solid rgba(214, 94, 64, 0.7); border-radius: 14px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
  }
  .alarm::backdrop { background: rgba(8, 7, 6, 0.72); }
  .alarm-head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
  .alarm-mark {
    display: grid; place-items: center; flex: 0 0 40px; width: 40px; height: 40px;
    color: #2a0f08; background: #ff9d8a; border-radius: 11px;
    font-family: "Jost", sans-serif; font-size: 1.5rem; font-weight: 700; line-height: 1;
  }
  .alarm h2 { margin: 0; color: #ff9d8a; font-size: 1.3rem; line-height: 1.2; }
  .alarm-lede { margin: 0 0 12px; font-size: 0.95rem; }
  .alarm-reasons { margin: 0 0 18px; padding: 0; list-style: none; display: grid; gap: 8px; }
  .alarm-reasons li {
    padding: 11px 13px; font-size: 0.9rem; line-height: 1.55;
    background: rgba(214, 94, 64, 0.1);
    border-left: 3px solid rgba(214, 94, 64, 0.75);
    border-radius: 0 8px 8px 0;
  }
  .alarm-note { padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
  .alarm-note p { margin: 0 0 10px; color: var(--muted); font-size: 0.86rem; line-height: 1.6; }
  .alarm-note p:last-child { margin-bottom: 0; }
  .alarm-note strong { color: var(--ink-soft); }
  .alarm-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
  .alarm-primary {
    padding: 11px 18px; color: #241300; background: var(--orange);
    border: 0; border-radius: 9px; font: inherit; font-size: 0.92rem; font-weight: 800; cursor: pointer;
  }
  .alarm-primary:hover { background: #ffa233; }

  .results { margin-top: 34px; padding-top: 28px; border-top: 1px solid rgba(110, 105, 94, 0.4); }
  .results h2 { margin: 0 0 4px; font-size: 1.2rem; color: #fff; }
  .results h3 { margin: 28px 0 10px; font-size: 1rem; color: #fff; }
  .results-loading {
    margin-top: 34px; padding-top: 28px;
    border-top: 1px solid rgba(110, 105, 94, 0.4);
  }
  .results-loading h2 { margin: 0 0 5px; font-size: 1.2rem; color: #fff; }
  .results-loading p { margin: 0; color: var(--muted); font-size: 0.9rem; }

  ol.words {
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px;
    margin: 14px 0 0; padding: 0; list-style: none;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }
  ol.words li {
    display: flex; gap: 8px; align-items: baseline; padding: 9px 11px;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;
    font-size: 0.9rem;
  }
  ol.words b { color: #fff; font-weight: 600; }
  ol.words span { color: var(--orange-dark); font-size: 0.72rem; min-width: 1.4em; font-variant-numeric: tabular-nums; }

  .addr { position: relative; margin-top: 10px; padding: 14px 16px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; }
  .addr .label { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px;
                 font-size: 0.75rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
  .addr .label span { color: var(--orange-dark); }
  .addr .label code { color: var(--muted); font-size: 0.75rem; letter-spacing: 0; text-transform: none; }
  .addr p { margin: 8px 0 0; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 0.95rem; color: #fff; word-break: break-all; line-height: 1.5; }

  /* Same disclosure construction as the checksum and private-key folds: the
     summary keeps its default display and drops its marker through list-style,
     with the row laid out by a span inside it. No border or background of its
     own -- it lives inside the address box and should read as part of it. */
  /* Just a chevron in the corner. No label: the box it sits in is already
     titled, and a line of text would say less than the arrow does.
     text-align rather than a display change on the <summary>, because setting
     display there stops some browsers treating it as the disclosure at all --
     the same trap the checksum fold documents. The aria-label carries what a
     screen reader needs, since there is no text to read. */
  /* The closed box has to measure exactly what it did before the run existed,
     so the summary takes no height and the chevron is placed into the padding
     that was already there. Height and overflow rather than display or
     position on the <summary> itself: changing either of those stops some
     browsers treating it as the disclosure at all, which is the trap the
     checksum fold documents. The <i> is the hit area, sized for a finger. */
  /* Zero margin, against the global details rule further down that gives
     every other disclosure on the page 26px of air. Here that margin was the
     whole of the height the box gained. */
  /* Positioned against the fold itself, not the box. Anchored to the box the
     chevron tracked its bottom edge, so opening the run moved the arrow down
     with it -- the control walking away from the pointer that just clicked it.
     The fold's own top edge does not move when it expands. */
  /* flow-root, so the list's margins cannot collapse out through the
     zero-height summary. While they could, the fold's top edge sat 8px higher
     closed than open -- and the chevron anchored to it slid down on the very
     click that opened the fold, walking away from the pointer. */
  .addr-more { position: relative; display: flow-root; margin: 0; }
  .addr-more > summary {
    height: 0; overflow: visible; cursor: pointer; list-style: none;
  }
  .addr-more > summary::-webkit-details-marker { display: none; }
  .addr-more > summary i { position: absolute; right: -8px; top: -26px; width: 24px; height: 24px; }
  .addr-more > summary i::before {
    content: ""; position: absolute; right: 7px; top: 8px; width: 7px; height: 7px;
    border-right: 2px solid var(--muted); border-bottom: 2px solid var(--muted);
    transform: rotate(45deg); transition: transform 0.15s ease;
  }
  .addr-more > summary:hover i::before { border-color: var(--orange-dark); }
  /* Rotated about its own centre so the glyph turns in place. The earlier
     version nudged it down 3px on open, which read as the arrow jumping. */
  .addr-more[open] > summary i::before { transform: rotate(-135deg); }
  .addr-run { margin: 0; padding: 12px 0 0; list-style: none; }

  /* Address on the left, code on the right, both starting at the same line.
     Sized to be read by a phone held to the screen rather than to dominate the
     box -- it is a confirmation, and the address beside it is still the thing
     anybody copies. */
  /* Its own line under the address, flush left. Everything else in these boxes
     starts at the same edge -- the label, the address, the descriptor -- and a
     button that began anywhere else was the one thing that did not line up. In
     the address boxes it shares that line with the chevron in the opposite
     corner, which reads as a row of controls rather than two strays. */
  .qr-row { margin: 10px 0 0; }
  /* Small enough that the box is the height it was before the code existed --
     one line of address and its label, unchanged. At this size it is a glance
     rather than something to scan, which is why it opens. */
  /* A button rather than a small code in the box. A code big enough to point a
     phone at does not fit a line of address, and one that fits is too small to
     read -- so the box keeps its size and the code opens at a size that works. */
  /* Sized to the line it sits on rather than to itself: beside an address it
     was 30px against 23px of text and became the tallest thing on the row. */
  .qr-button {
    flex: 0 0 auto; align-self: center;
    display: inline-block; vertical-align: middle;
    padding: 2px 8px; border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 6px;
    background: rgba(255, 255, 255, 0.04); color: var(--muted);
    /* Named rather than inherited. Under the address it sits inside a <p> that
       is monospace, so "font: inherit" quietly rendered the label in the wrong
       face and made the button a different width in each of the three places
       it appears -- 63px in one, 74px in another, for the same two words. */
    font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 0.66rem; font-weight: 800; letter-spacing: 0.06em;
    line-height: 1.6; text-transform: uppercase; cursor: pointer; white-space: nowrap;
  }
  .qr-button:hover { color: var(--orange); border-color: rgba(255, 138, 0, 0.55); }
  .qr-row { margin: 12px 0 0; }
  .seedqr-actions { display: flex; flex-wrap: wrap; gap: 8px; }
  /* Opened, it is sized to be read by a phone held to the screen. */
  .qr-dialog {
    max-width: min(92vw, 360px); padding: 18px; border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 16px; background: #1f1f1e; color: var(--ink);
  }
  .qr-dialog::backdrop { background: rgba(0, 0, 0, 0.72); }
  .qr-dialog-title {
    margin: 0 0 10px; color: var(--orange-dark); font-size: 0.72rem; font-weight: 800;
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .qr-dialog-code svg { display: block; width: 100%; height: auto; border-radius: 8px; }
  .qr-dialog-text {
    margin: 12px 0 0; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.8rem; line-height: 1.5; color: var(--ink-soft); word-break: break-all;
  }
  .qr-dialog-close {
    float: right; margin: -6px -4px 0 0; padding: 0 6px; border: 0; border-radius: 6px;
    background: none; color: var(--muted); font-size: 1.3rem; line-height: 1.2; cursor: pointer;
  }
  .qr-dialog-close:hover { color: var(--orange); }
  @media (max-width: 560px) {
    .addr-line { display: block; }
    .qr-holder { margin-top: 10px; }
    .qr-holder svg { width: 76px; }
  }
  .addr-run li { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px;
    padding: 6px 0; border-top: 1px solid rgba(255, 255, 255, 0.07); }
  .addr-run li:first-child { border-top: 0; }
  .addr-run code { flex: 0 0 auto; color: var(--muted); font-size: 0.74rem; }
  .addr-run b { flex: 1 1 auto; min-width: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.86rem; font-weight: 400; color: var(--ink); word-break: break-all; }

  .address-match { margin-top: 18px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px; background: rgba(255, 255, 255, 0.025); }
  .address-match label { display: block; margin-bottom: 8px; color: var(--ink-soft); font-weight: 800; }
  .address-match-status { min-height: 1.35em; }
  .address-match-status.is-ok { color: #8be3c6; }
  .address-match-status.is-bad { color: #ff9d8a; }

  /* Every <summary> here is a control, so none of them should behave like
     prose. Left selectable, a second click inside one starts the browser's
     word selection -- and on the address folds, whose summary is a bare
     chevron with no text of its own, that selection spilled into the four
     addresses underneath and highlighted them. */
  summary { user-select: none; -webkit-user-select: none; }

  details { margin-top: 26px; }
  summary { cursor: pointer; color: var(--ink-soft); font-size: 0.9rem; font-weight: 700; }
  details .body { margin-top: 12px; color: var(--muted); font-size: 0.88rem; }
  details code { color: var(--ink-soft); word-break: break-all; }
  /* Every link in a disclosure, not only the ones inside .src-list -- the
     loose paragraphs around the lists were falling back to the browser's
     default blue, which is close to unreadable on this background. */
  details .body a { color: var(--orange); text-decoration: none; }

  /* ---- sources ----------------------------------------------------------
     Every claim this page makes about a device is someone else's published
     document, and a reader who cannot get from the claim to that document is
     being asked for exactly the faith this tool exists to remove. */
  .src-group { margin: 20px 0 0; }
  /* Ruled, because these two headings are the only thing separating one list
     of sources from the next and small uppercase text alone did not read as a
     divider. */
  .src-group h3 {
    margin: 0 0 12px; padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 138, 0, 0.35);
    color: #ffad4c;
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
  }
  .src-list { margin: 0; padding: 0; list-style: none; }
  .src-list li {
    padding: 10px 0; border-top: 1px solid rgba(255, 255, 255, 0.07);
    display: grid; grid-template-columns: 148px minmax(0, 1fr); gap: 4px 18px;
  }
  .src-list li:first-child { border-top: 0; }
  .src-list b { color: var(--ink-soft); font-size: 0.84rem; }
  /* Everything above is a citation for something on the page; the two lines
     below are not, so they are separated from the list rather than reading as
     the end of it. */
  .src-tail {
    margin-top: 22px; padding-top: 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .src-list a { color: var(--orange); text-decoration: none; word-break: break-word; }
  .src-list span { display: block; margin-top: 3px; font-size: 0.82rem; line-height: 1.55; }
  @media (max-width: 620px) {
    .src-list li { grid-template-columns: minmax(0, 1fr); }
  }

  /* ---- site footer ------------------------------------------------------ */

  /* ---- the file footer ---------------------------------------------------

     The site footer used to be redrawn here: a grid of links to Devices,
     Software, Exchanges and the rest, none of which resolve on a machine with
     no network. This replaces it with the two things that do matter when you
     are holding a file offline -- how to prove it is the published one, and
     the warning that outranks everything else on the page. */
  .file-footer {
    margin-top: 40px; padding: 34px 0 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: #0d0d0e;
    color: var(--muted); font-size: 0.9rem;
  }
  .file-footer h2 { margin: 0 0 10px; color: #fff; font-size: 1.1rem; }
  .file-footer p { margin: 0 0 14px; line-height: 1.65; }
  .file-footer pre {
    margin: 0 0 16px; padding: 13px 15px; overflow-x: auto;
    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
    background: rgba(0, 0, 0, 0.4);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.8rem; line-height: 1.7; color: var(--ink-soft);
  }
  .file-footer pre span { color: var(--muted); }
  .file-footer-note { font-size: 0.85rem; }
  .file-footer-note strong { color: #ffad4c; }

  .colophon { margin-top: 32px; padding-top: 22px; border-top: 1px solid rgba(110, 105, 94, 0.4);
              color: var(--muted); font-size: 0.85rem; }
  .colophon a { color: var(--orange); }

  /* The site answers this width with a hamburger menu, which needs a script and
     a focus trap to do properly. For a single leaf page the honest version is
     smaller: stop pinning the header, let it scroll away, and give the four
     links their own scrollable strip. Nothing is hidden behind a control, and
     the hero gets the screen back. */
  @media (max-width: 620px) {
    .site-header { position: static; padding: 14px 0; backdrop-filter: none; }
    .header-inner { flex-wrap: wrap; justify-content: center; gap: 12px; }
    .brand { font-size: 21px; margin-right: 0; }
    .brand-mark { width: 60px; height: 21px; }
    .brand-domain { height: 15px; margin-bottom: 8px; font-size: 11px; }

    .site-nav {
      width: 100%; gap: 2px; overflow-x: auto;
      justify-content: center;
      scrollbar-width: none; -ms-overflow-style: none;
    }
    .site-nav::-webkit-scrollbar { display: none; }
    .site-nav a { padding: 7px 10px; font-size: 0.84rem; white-space: nowrap; }

    .hero { padding: 30px 0 34px; }
    .footer-grid { grid-template-columns: 1fr; }
  }

  /* Same background as every guide article's hero (.sc-guide-head in the main
     site stylesheet) -- one soft orange glow top-right over a plain diagonal
     dark panel. The earlier version of this page had two radial gradients (an
     orange one and a --success green one) plus a pixel-grid overlay and a ringed
     circle bleeding off the corner; none of that exists on a guide page, and
     next to the rest of the site it read as a different, over-decorated
     product rather than a page of this one -- so both are folded into the one
     .hero rule above instead of layered as a second, later-loaded override.
     .wrap's widened measure for the two-column shell is folded into its one
     rule the same way. */
  .hero-shell {
    display: block; width: 100%;
  }
  .hero-heading {
    display: block;
  }
  .hero-copy { min-width: 0; }
  .hero .crumb { margin-bottom: 18px; }
  .hero .eyebrow {
    display: inline-flex; align-items: center; gap: 9px; margin-bottom: 10px;
    color: #ffad4c; letter-spacing: 0.18em;
  }
  .hero .eyebrow::before { content: ""; width: 25px; height: 1px; background: var(--orange); }
  .hero h1 { max-width: 660px; margin-bottom: 14px; font-size: clamp(2.75rem, 5vw, 3.8rem); letter-spacing: -0.035em; }
  .sc-guide-title-row { display: flex; align-items: center; gap: 18px; margin-bottom: 16px; }
  .sc-guide-title-row h1 { margin-bottom: 0; }
  .hero .lead { max-width: 660px; font-size: clamp(0.98rem, 1.35vw, 1.08rem); line-height: 1.55; }
  .hero-meta {
    display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
    margin-top: 18px;
  }
  .github-link {
    display: inline-flex; align-items: center; gap: 11px; min-height: 48px; padding: 12px 20px;
    color: #fff; text-decoration: none; font-size: 0.94rem; font-weight: 700;
    line-height: 1.2;
    border: 1px solid rgba(255, 255, 255, 0.22); border-radius: 9px;
    background: rgba(8, 8, 8, 0.36);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }
  .github-link:visited { color: #fff; text-decoration: none; }
  .github-link:hover {
    color: #fff; text-decoration: none;
    border-color: rgba(255, 173, 76, 0.72); background: rgba(255, 138, 0, 0.11);
    transform: translateY(-1px);
  }
  .github-link:focus-visible { outline: 2px solid #ffad4c; outline-offset: 3px; }
  .github-link svg { flex: 0 0 auto; width: 20px; height: 20px; }
  .hero .status { align-items: stretch; gap: 10px; margin: 0; }
  .hero .status li {
    display: grid; align-items: center; position: relative;
    min-height: 40px; padding: 8px 12px 8px 30px; border-radius: 9px;
    background: rgba(8, 8, 8, 0.28); backdrop-filter: blur(4px);
  }
  .hero .status [data-status-text], .hero .status .status-reserve { grid-area: 1 / 1; }
  .hero .status .status-reserve { visibility: hidden; pointer-events: none; }
  .hero .status li::before {
    content: ""; position: absolute; left: 12px; top: 50%; width: 7px; height: 7px;
    border-radius: 50%; background: #8e887e; transform: translateY(-50%);
    box-shadow: 0 0 0 3px rgba(142, 136, 126, 0.12);
  }
  .hero .status li.good::before { background: var(--success); box-shadow: 0 0 0 3px rgba(53, 180, 138, 0.15), 0 0 12px rgba(53, 180, 138, 0.7); }
  /* The one badge worth catching an eye. Being online is not dangerous here --
     there is nothing to type that could leak a wallet -- but it is the fact
     that decides whether this session suits a wallet worth anything, and a
     still amber dot beside a still green one is easy to read straight past.

     Only the online state moves. The offline state is reassurance, and
     reassurance that flashes stops reassuring. */
  .hero .status li.warn::before {
    background: var(--orange);
    box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.15), 0 0 12px rgba(255, 138, 0, 0.7);
    animation: status-ping 2.6s ease-out infinite;
  }
  @keyframes status-ping {
    0%   { box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.15), 0 0 12px rgba(255, 138, 0, 0.7); }
    35%  { box-shadow: 0 0 0 9px rgba(255, 138, 0, 0), 0 0 16px rgba(255, 138, 0, 0.9); }
    100% { box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.15), 0 0 12px rgba(255, 138, 0, 0.7); }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero .status li.warn::before { animation: none; }
  }
  .hero .status li.bad::before { background: var(--danger); }

  /* The same four-pip die used beside the Roll the dice guide title. Kept as
     an inline SVG so the standalone download still fetches nothing. */
  .guide-die-mark {
    display: block; width: 50px; height: 50px; border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 13px;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 46 46'%3E%3Cdefs%3E%3CradialGradient id='a' cx='.38' cy='.32' r='.78'%3E%3Cstop offset='0' stop-color='%23ff6a71'/%3E%3Cstop offset='.55' stop-color='%23f5222b'/%3E%3Cstop offset='1' stop-color='%23bc0f19'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='.38' cy='.32' r='.78'%3E%3Cstop offset='0' stop-color='%23fffaef'/%3E%3Cstop offset='.55' stop-color='%23eee2c7'/%3E%3Cstop offset='1' stop-color='%23bfae8e'/%3E%3C/radialGradient%3E%3CradialGradient id='c' cx='.38' cy='.32' r='.78'%3E%3Cstop offset='0' stop-color='%236cc687'/%3E%3Cstop offset='.55' stop-color='%233c9056'/%3E%3Cstop offset='1' stop-color='%23246438'/%3E%3C/radialGradient%3E%3CradialGradient id='d' cx='.38' cy='.32' r='.78'%3E%3Cstop offset='0' stop-color='%23ffcb68'/%3E%3Cstop offset='.55' stop-color='%23ff9900'/%3E%3Cstop offset='1' stop-color='%23cb6d00'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='13.5' cy='13.5' r='4.6' fill='url(%23a)'/%3E%3Ccircle cx='32.5' cy='13.5' r='4.6' fill='url(%23b)'/%3E%3Ccircle cx='13.5' cy='32.5' r='4.6' fill='url(%23c)'/%3E%3Ccircle cx='32.5' cy='32.5' r='4.6' fill='url(%23d)'/%3E%3C/svg%3E"),
      linear-gradient(152deg, #23262c 0%, #101318 46%, #06070a 100%);
    background-repeat: no-repeat; background-position: center; background-size: 100% 100%;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 -10px 18px rgba(0, 0, 0, 0.5), 0 7px 16px rgba(0, 0, 0, 0.38);
  }
  .sc-guide-title-row .sc-die-mark {
    flex: 0 0 auto; width: 58px; height: 58px; margin: 0; border-radius: 14px;
  }
  .workspace { padding-bottom: 56px; }
  .security-brief {
    position: sticky; z-index: 30; top: 78px;
    margin: -22px 0 16px; padding: 20px 22px 20px 68px;
    border-color: rgba(255, 138, 0, 0.46); border-radius: 16px;
    background: linear-gradient(135deg, #29231d 0%, #211f1c 100%);
    box-shadow: 0 18px 44px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.05);
  }
  body.is-offline-copy .security-brief { top: 0; }
  .security-icon {
    position: absolute; left: 20px; top: 20px;
    width: 32px; height: 32px; color: var(--orange);
    filter: drop-shadow(0 0 12px rgba(255, 138, 0, .16));
  }
  .security-brief strong { color: #ffad4c; }
  .security-brief .critical-line {
    width: fit-content; max-width: calc(100% + 14px);
    margin: 13px 0 -4px -14px; padding: 11px 14px;
    color: var(--ink-soft); background: rgba(8, 8, 8, .38);
    border: 1px solid rgba(255, 48, 72, .28); border-radius: 9px;
    text-align: left;
  }
  .security-brief strong.critical {
    color: #ff4d5d; text-shadow: 0 0 14px rgba(255, 44, 65, .18);
  }

  .security-sticky-mobile { display: none; }

  body.beta-gate-open { overflow: hidden; }
  .beta-disclaimer {
    position: fixed; z-index: 2200; inset: 0; display: grid; place-items: center;
    padding: 24px; overflow-y: auto;
    background: rgba(3, 3, 4, .86); backdrop-filter: blur(12px);
    opacity: 0; transition: opacity .22s ease;
  }
  .beta-disclaimer[hidden] { display: none; }
  .beta-disclaimer.is-visible { opacity: 1; }
  .beta-disclaimer.is-dismissed { opacity: 0; pointer-events: none; }
  .beta-disclaimer-card {
    position: relative; width: min(100%, 590px); padding: 30px 30px 28px 86px;
    border: 1px solid rgba(255, 138, 0, .48); border-radius: 18px;
    color: var(--ink-soft); background: linear-gradient(145deg, #28231e, #171719 72%);
    box-shadow: 0 30px 90px rgba(0, 0, 0, .62), inset 0 1px 0 rgba(255, 255, 255, .06);
  }
  .beta-disclaimer-card::before {
    content: ""; position: absolute; top: 0; right: 28px; left: 28px; height: 3px;
    border-radius: 0 0 3px 3px; background: var(--orange);
  }
  .beta-disclaimer-card .security-icon { left: 28px; top: 30px; width: 38px; height: 38px; }
  .beta-disclaimer-card h2 { margin: 0 0 14px; color: #fff; font-size: 1.65rem; }
  .beta-disclaimer-card p { margin: 0 0 13px; line-height: 1.65; }
  .beta-disclaimer-card p strong { color: #ffad4c; }
  .beta-disclaimer-card .critical-copy {
    margin-top: 16px; padding: 13px 15px; border: 1px solid rgba(255, 48, 72, .3);
    border-radius: 10px; background: rgba(5, 5, 6, .38);
  }
  .beta-disclaimer-card .critical-copy strong { color: #ff4d5d; }
  .beta-disclaimer-accept {
    min-height: 44px; margin-top: 8px; padding: 11px 21px; border: 0; border-radius: 9px;
    color: #211300; background: var(--orange); font: 800 .94rem/1 "Jost", sans-serif;
    cursor: pointer; box-shadow: 0 8px 24px rgba(255, 138, 0, .18);
  }
  .beta-disclaimer-accept:hover { background: #ffad4c; }
  .beta-disclaimer-accept:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .beta-disclaimer, .security-sticky-chevron { transition: none; }
  }


  .workbench-intro { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 24px; margin: 0 0 16px; }
  .workbench-intro .eyebrow { margin-bottom: 9px; }
  .workbench-intro h2 { margin: 0 0 7px; color: #fff; font-size: clamp(1.7rem, 3vw, 2.35rem); line-height: 1.15; }
  /* Capped, because the column runs to 853px and lines that long are hard to
     track back to the start -- measured at 123 characters unconstrained,
     against the 92 this gives. It used to look truncated only because the
     sentence was long enough to need four lines; shortened, it fills the
     measure and the raggedness goes with it. */
  .workbench-intro p { max-width: 650px; margin: 0; color: var(--muted); font-size: 0.92rem; }
  .step-map { display: flex; align-items: center; gap: 5px; padding-bottom: 6px; color: #777168; font-size: 0.7rem; font-weight: 800; letter-spacing: .08em; }
  .step-map b { display: grid; place-items: center; width: 25px; height: 25px; border: 1px solid rgba(255, 138, 0, .32); border-radius: 50%; color: #ffad4c; }
  .step-map i { width: 11px; height: 1px; background: rgba(255,255,255,.12); }

  .workbench {
    position: relative; padding: 16px 24px 24px; border: 1px solid rgba(255,255,255,.12);
    border-radius: 22px; background: linear-gradient(155deg, rgba(255,255,255,.045), rgba(255,255,255,.018));
    box-shadow: 0 26px 68px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.06), 0 -1px 32px rgba(255,138,0,.035);
  }
  .workbench fieldset { position: relative; margin: 0; padding: 24px 0 25px 56px; border-bottom: 1px solid rgba(255,255,255,.085); }
  .workbench legend { float: left; width: 100%; margin: 0 0 13px; font-family: "Jost", sans-serif; font-size: 1.07rem; }
  .workbench legend .step-num { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
  .workbench legend::before {
    content: attr(data-step); position: absolute; left: 0; top: 21px; display: grid; place-items: center;
    width: 37px; height: 37px; color: #ffad4c; border: 1px solid rgba(255,138,0,.4); border-radius: 11px;
    background: rgba(255,138,0,.075); font: 800 0.82rem/1 "Open Sans", sans-serif;
  }
  /* Every following sibling, not only the first. The legend is floated full
     width, so whatever comes after it has to clear that float -- and with
     `+` only the first sibling did. Both conversion rows live in this
     fieldset and only one is shown at a time, so when the dice row was
     hidden the card row was no longer the first sibling, never cleared, and
     was laid out beside the floated legend: a zero-width strip at the right
     edge with its buttons spilling off the page. */
  .workbench legend ~ * { clear: both; }
  .workbench .seg { gap: 10px; }
  .workbench .seg button { min-height: 58px; border-radius: 12px; }
  .workbench .seg button[aria-pressed="true"] {
    background: linear-gradient(135deg, rgba(255,138,0,.22), rgba(255,138,0,.11));
    box-shadow: inset 0 0 0 1px rgba(255,138,0,.32), inset 0 1px 0 rgba(255,255,255,.08), 0 8px 22px rgba(255,138,0,.08);
    transform: translateY(-1px);
  }
  .workbench .hint strong { color: var(--ink-soft); }
  .workbench textarea { min-height: 132px; }
  .workbench .go {
    margin-top: 27px; min-height: 56px; border-radius: 13px;
    border: 1px solid #ffb14f;
    background: linear-gradient(135deg, #ff9b1a, #e57700);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 16px 34px rgba(255, 138, 0, .18);
    transition: background-color .15s ease, transform .15s ease, box-shadow .15s ease;
  }
  .workbench .go:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 20px 42px rgba(255, 138, 0, .23); }
  .workbench .go:disabled { box-shadow: none; }
  .workbench .results { margin-top: 32px; padding: 28px; border: 1px solid rgba(243,234,220,.26); border-radius: 16px; background: linear-gradient(150deg, rgba(243,234,220,.075), rgba(243,234,220,.025)); box-shadow: inset 0 1px 0 rgba(255,255,255,.07); }
  .workbench .error { margin-bottom: 0; }

  .setup-grid {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;
    padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,.085);
  }
  .workbench .setup-grid fieldset {
    padding: 18px 18px 18px 58px; border: 1px solid rgba(255,255,255,.09); border-radius: 15px;
    background: rgba(255,255,255,.018);
  }
  .workbench .setup-grid legend { font-size: 1rem; }
  .workbench .setup-grid legend::before { left: 14px; top: 15px; width: 34px; height: 34px; border-radius: 10px; }
  .workbench .setup-grid .setup-wide { grid-column: 1 / -1; }
  .workbench .setup-grid .seg button { min-height: 52px; }
  /* Taller than the rest of the row above, because these three carry a drawing
     as well as two lines of text and 52 leaves the picture crowding the words.
     It sits here rather than with the other source-pick rules because the line
     above is weighted .workbench .setup-grid and a bare .source-pick cannot
     reach it -- matching the weight and following it is what makes it apply. */
  .workbench .setup-grid .source-pick button { min-height: 90px; }
  @media (max-width: 720px) {
    /* One per row down here. Three at 90 push step 2 off the first screen and
       buy nothing: stacked, the words already have the full width. */
    .workbench .setup-grid .source-pick button { min-height: 0; }
  }
  .workbench .address-options {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;
  }
  .workbench .address-options button {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
    width: 100%; min-width: 0; height: 58px; padding: 8px;
    line-height: 1.2; text-align: center;
  }
  .workbench .address-options button small { margin: 0; line-height: 1.15; }
  .workbench .entry-step { padding-bottom: 10px; border-bottom: 0; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
  }

  main > details {
    margin-top: 16px; padding: 18px 20px; border: 1px solid rgba(255,255,255,.09);
    border-radius: 13px; background: rgba(255,255,255,.025);
  }
  main > details[open] { border-color: rgba(255,138,0,.25); }
  main > details summary { color: var(--ink); }

  /* Reads as one of the three disclosures at the foot of the page rather
     than as a panel of its own. It used to be a bordered card with its own
     gradient, an orange rule down the side and a chevron, which set it apart
     from "How this page was checked" and "Sources" for no reason a reader
     could act on -- all three are the same kind of thing. It keeps the orange
     summary so it is still the one that answers a question rather than
     listing references. */
  .method-note summary { color: #ffad4c; }

  @media (max-width: 820px) {
    .hero { min-height: auto; padding: 108px 0 44px; }
    .hero h1 { font-size: clamp(2.8rem, 9vw, 3.8rem); }
    .security-brief { top: 70px; margin-top: -20px; }
    body.is-offline-copy .security-brief { top: 0; }
    .workbench-intro { grid-template-columns: 1fr; gap: 12px; }
    .setup-grid { grid-template-columns: 1fr; }
    .workbench .setup-grid .setup-wide { grid-column: auto; }
  }
  @media (max-width: 767.98px) {
    .sc-guide-title-row { align-items: flex-start; gap: 14px; }
    .sc-guide-title-row .sc-die-mark { width: 44px; height: 44px; border-radius: 11px; }
  }
  @media (max-width: 620px) {
    .wrap { padding-inline: 18px; }
    .hero { padding: 34px 0 40px; }
    .hero .crumb { margin-bottom: 18px; }
    .hero h1 { font-size: clamp(2.45rem, 13vw, 3.35rem); }
    .hero-meta { display: grid; gap: 10px; }
    .github-link { justify-content: center; width: 100%; }
    .hero .status { display: grid; gap: 10px; }
    .security-brief { position: relative; top: auto; margin-top: -16px; padding: 58px 18px 18px; }
    .security-brief .security-icon { left: 18px; top: 16px; }
    .security-sticky-mobile {
      position: fixed; z-index: 990; top: 70px; right: 10px; left: 10px;
      display: block; border: 1px solid rgba(255, 138, 0, .52); border-radius: 12px;
      color: var(--ink-soft); background: rgba(27, 25, 23, .985);
      box-shadow: 0 12px 35px rgba(0, 0, 0, .48);
    }
    body.is-offline-copy .security-sticky-mobile { top: 0; }
    .security-sticky-mobile[hidden] { display: none; }
    .security-sticky-toggle {
      display: flex; align-items: center; gap: 10px; width: 100%; min-height: 46px;
      padding: 9px 12px; border: 0; color: #fff; background: transparent;
      font: 800 .9rem/1.2 "Jost", sans-serif; text-align: left; cursor: pointer;
    }
    .security-sticky-toggle .security-icon {
      position: static; flex: 0 0 auto; width: 24px; height: 24px;
    }
    .security-sticky-toggle-label { flex: 1; }
    .security-sticky-chevron {
      width: 9px; height: 9px; border-right: 2px solid #ffad4c;
      border-bottom: 2px solid #ffad4c; transform: rotate(45deg) translateY(-2px);
      transition: transform .18s ease;
    }
    .security-sticky-toggle[aria-expanded="true"] .security-sticky-chevron {
      transform: rotate(225deg) translate(-2px, -2px);
    }
    .security-sticky-panel {
      padding: 0 14px 14px 46px; border-top: 1px solid rgba(255, 255, 255, .08);
      color: #c9c4bc; font-size: .8rem; line-height: 1.52;
    }
    .security-sticky-panel[hidden] { display: none; }
    .security-sticky-panel p { margin: 11px 0 0; }
    .security-sticky-panel strong { color: #ffad4c; }
    .security-sticky-panel .critical { color: #ff4d5d; }
    .beta-disclaimer { padding: 14px; }
    .beta-disclaimer-card { padding: 66px 20px 22px; border-radius: 15px; }
    .beta-disclaimer-card .security-icon { left: 20px; top: 20px; width: 34px; height: 34px; }
    .beta-disclaimer-card h2 { font-size: 1.42rem; }
    .download { margin-bottom: 34px; padding: 19px 18px; }
    .step-map { display: none; }
    .workbench { padding: 12px 14px 20px; border-radius: 18px; }
    .workbench fieldset { padding: 23px 0 24px 0; }
    .workbench .setup-grid fieldset { padding: 18px 14px; }
    .workbench legend { padding-left: 60px; min-height: 37px; display: flex; align-items: center; }
    /* left:0 put the badge exactly on the card's border -- measured at a zero
       gap, so it read as overlapping it. Inset far enough to sit inside the
       box, with the heading moved to match. */
    .workbench legend::before, .workbench .setup-grid legend::before { left: 13px; top: 16px; }
    .workbench .results { padding: 21px 16px; }
    .path-row { flex-direction: column; }
    .path-row button { width: 100%; }
  }

  /* Space below as well as above. The list is two dozen monospace lines and
     the sentence naming their sources ran straight on from the last one, so it
     read as a 25th entry rather than as a note about the whole list. */
  .vectors { margin: 10px 0 20px; padding: 0; list-style: none; font-family: ui-monospace, monospace; font-size: 0.78rem; }
  .vectors li { padding: 2px 0; }
  .vectors li::before { content: "ok  "; color: var(--success); }
  .vectors li.bad::before { content: "FAIL "; color: var(--danger); }

  @media (max-width: 620px) {
    ol.words { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .seg button { min-width: 0; }
  }
`;

/* The suite the page runs on load. Kept as source text rather than imported so
   the shipped file carries its own vectors -- an offline copy that could not
   re-check itself would be asking for exactly the faith this tool removes. */
/* How many vectors the shipped page runs. Counted from the suite below rather
   than written down beside it: the badge reserves width for the finished text,
   and a hand-kept number goes stale the moment a vector is added -- silently,
   because a slightly narrow reserve still looks fine until it does not. */
const selfTestCount = () =>
  (selfTest().match(/\n\s*\['[^']+',\s*\(\)/g) || []).length;

const selfTest = () => `
  /* Every expected value here is from a published specification: FIPS 180-4,
     RFC 4231, and the test vectors in BIP32, BIP39, BIP84 and BIP86. None of
     them was produced by running this code. */
  const LF = String.fromCharCode(10);
  const ABANDON = 'abandon '.repeat(11) + 'about';
  let vectorSeed = null;

  const VECTORS = [
    ['SHA-256, FIPS 180-4', () => C.hex(C.sha256(C.utf8('abc'))),
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
    ['SHA-512, FIPS 180-4', () => C.hex(C.sha512(C.utf8('abc'))),
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'],
    ['RIPEMD-160', () => C.hex(C.ripemd160(C.utf8('abc'))),
      '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc'],
    ['HMAC-SHA512, RFC 4231', () => C.hex(C.hmacSha512(C.utf8('Jefe'), C.utf8('what do ya want for nothing?'))),
      '164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737'],
    ['BIP39 words from entropy', () => C.entropyToMnemonic(C.fromHex('7f'.repeat(16)), WORDLIST).join(' '),
      'legal winner thank year wave sausage worth useful legal winner thank yellow'],
    ['BIP39 entropy to seed', () => C.hex(C.mnemonicToSeed(ABANDON.split(' '), 'TREZOR')),
      'c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04'],
    ['BIP32 derivation', () => {
      const n = C.derive(C.masterKey(C.fromHex('000102030405060708090a0b0c0d0e0f')), "m/0'/1/2'/2/1000000000");
      return C.hex(n.key);
    }, '471b76e389e528d6de6d816857e012c5455051cad6660850e58372a6c3e6e7c8'],
    ['BIP44 legacy address', () => vectorAddress('legacy', "m/44'/0'/0'", 0), '1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA'],
    ['BIP49 nested address', () => vectorAddress('nested', "m/49'/0'/0'", 0), '37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf'],
    ['BIP84 native address', () => vectorAddress('native', "m/84'/0'/0'", 0), 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu'],
    ['Address check accepts a BIP21 URI', () => {
      const address = 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu';
      const hit = C.matchDerivedAddress('bitcoin:' + address.toUpperCase() + '?amount=1',
        [{ index: 0, path: "m/84'/0'/0'/0/0", address }], []);
      return hit.state + ':' + hit.chain + ':' + hit.index;
    }, 'match:receive:0'],
    ['CompactSeedQR carries the raw BIP39 entropy bytes',
      () => C.hex(C.compactSeedQrBytes('00'.repeat(16))), '00'.repeat(16)],
    ['BIP84 change address', () => vectorAddress('native', "m/84'/0'/0'", 1), 'bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el'],
    ['BIP86 taproot address', () => vectorAddress('taproot', "m/86'/0'/0'", 0), 'bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr'],
    /* The conversions themselves. A wrong table here is the worst failure this
       page has -- it would show a stranger's wallet and blame the device -- so
       the corners of the BitBox table and the bit codes are checked on load
       alongside the primitives. The lookup vector ties back to BIP39's own
       all-zero phrase rather than to anything this file computed. */
    ['BitBox02 table, first cell', () => WORDLIST[C.bitboxIndex('11111H')], 'abandon'],
    ['BitBox02 table, last cell', () => WORDLIST[C.bitboxIndex('44444T')], 'zoo'],
    ['BitBox02 rolls to BIP39 phrase',
      () => C.deriveSeed({ method: 'bitbox', input: '11111H'.repeat(23), words: 24, wordlist: WORDLIST, choice: 0 }).mnemonic.join(' '),
      'abandon '.repeat(23) + 'art'],
    ['COLDCARD dice example', () => C.hex(C.METHODS.dice.entropy('123456', 32)),
      '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'],
    ['Octal and hex dictionary, first cell',
      () => WORDLIST[C.METHODS.octahex.indexOf('100')], 'abandon'],
    ['Octal and hex dictionary, last cell',
      () => WORDLIST[C.METHODS.octahex.indexOf('8FF')], 'zoo'],
    /* The 12-word branch of the dictionary method, which the 24-word vectors
       above do not touch: a different rolled-word count, a different number of
       free bits, a 4-bit checksum instead of 8, and a different last-word
       index. Eleven throws of the first cell are 121 zero bits, and ending
       zero adds seven more, so the entropy is 128 zeros -- which BIP39
       publishes the phrase for. */
    ['Octal and hex, 11 throws make BIP39\u2019s all-zero 12-word phrase',
      () => C.deriveSeed({ method: 'octahex', input: '100'.repeat(11), words: 12,
                           wordlist: WORDLIST, choice: 0 }).mnemonic.join(' '),
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'],
    ['Octal and hex, 12 words leave 128 endings and 24 leave 8',
      () => [C.lookupDraft({ method: 'octahex', input: '100'.repeat(11), words: 12, wordlist: WORDLIST }).options.length,
             C.lookupDraft({ method: 'octahex', input: '100'.repeat(23), words: 24, wordlist: WORDLIST }).options.length].join(),
      '128,8'],
    ['Dice bit table codes', () => C.diceBits('123456'), '0110110100'],
    ['Dice with 6 as 0', () => C.hex(C.METHODS.dicezero.entropy('123456', 16)),
      C.hex(C.sha256(C.utf8('123450')).slice(0, 16))],

    /* The wordlist itself, which nothing else here covers.

       Every address vector above goes through a handful of words. One altered
       entry anywhere in the other two thousand would produce wrong recovery
       phrases for the seeds that happen to reach it, while every other test
       still passed -- and the phrase is the backup, so a single wrong word is
       a wallet nobody can restore.

       2f5eed53... is the SHA-256 of the official bip-0039/english.txt, one
       word per line with a trailing newline. The page carries the list
       space-joined, so the canonical form is rebuilt before hashing. */
    ['BIP39 wordlist, official English list',
      () => C.hex(C.sha256(C.utf8(WORDLIST.join(LF) + LF))),
      '2f5eed53a4727b4bf8880d8f3f199efc90e58503646d9ff8eff3a2ed3b24dbda'],
    ['BIP39 wordlist, 2048 unique words in order',
      () => [WORDLIST.length, new Set(WORDLIST).size,
             WORDLIST.every((w, i) => i === 0 || WORDLIST[i - 1] < w)].join(),
      '2048,2048,true'],

    /* The descriptor. Its checksum is a second, independent encoding of the
       account key, so a fault here hands someone a line that looks verified
       and watches the wrong wallet -- or none. */
    ['Descriptor checksum, BIP380 published vector',
      () => C.withChecksum('raw(deadbeef)'), 'raw(deadbeef)#89f8spxm'],
    ['Watch-only descriptor, BIP84 account',
      () => {
        if (!vectorSeed) vectorSeed = C.mnemonicToSeed(ABANDON.split(' '));
        const path = C.accountPath('native', 0);
        return C.watchOnlyDescriptor({
          addressType: 'native',
          fingerprint: C.masterFingerprint(vectorSeed),
          path,
          xpub: C.deriveAddresses({ seed: vectorSeed, addressType: 'native', path }).xpub
        });
      },
      'wpkh([73c5da0a/84h/0h/0h]xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V/<0;1>/*)#qf45pmyh']
  ];

  function vectorAddress(type, path, branch) {
    if (!vectorSeed) vectorSeed = C.mnemonicToSeed(ABANDON.split(' '));
    return C.deriveAddresses({ seed: vectorSeed, addressType: type, path })[branch === 0 ? 'receive' : 'change'].address;
  }

  function runSelfTest() {
    return VECTORS.map(([name, fn, want]) => {
      let got;
      try { got = fn(); } catch (err) { got = 'threw: ' + err.message; }
      return { name, ok: got === want };
    });
  }
`;

const ui = () => `
  const $ = id => document.getElementById(id);
  const WORDLIST = WORDLIST_RAW.split(' ');

  /* Where this copy is running, reported in the status strip at the top and
     used to decide whether to offer the download. It is a weaker signal than
     it looks -- a file:// page can sit on a fully connected machine -- so it
     says which copy you are on, never that the machine is offline.
     navigator.onLine is read separately, and in one direction only: it may
     warn that an interface appears to be up, and never claims one is absent.
     It reports whether an interface exists, not whether traffic can flow, so
     the negative case is worthless as reassurance. See paintAdapter below. */
  const isOffline = () => location.protocol === 'file:';

  /* Two questions that used to have one answer.

     Until this file was split in two, "opened from file://" and "is the
     downloadable copy" were the same thing, so one protocol check decided
     both. They are no longer the same: the site page can be opened from disk
     during development, and the offline file can be served over http. Asking
     the protocol which build you are reading gave the site page a panel
     announcing "you are already running the local copy" and hid its own
     download button.

     So the build states which one it is, and the protocol is left to answer
     only what it can actually see. It is declared where the build can see it,
     just below. */

  const state = {
    source: 'dice',      /* 'coin' | 'dice' | 'cards' -- the physical thing */
    dice: 'd6',          /* 'd6' | 'octahex'  -- which dice, when source is dice */
    conversion: 'dice',  /* which device convention, for a six-sided die */
    cardconv: 'cards',   /* 'cards' | 'cardscoleman' | 'cardbits' */
    /* The shorter seed is the one most people are choosing between these
       days, and it is the cheaper thing to try: 50 rolls rather than 99. The
       24-word option is one tap away for anyone who wants it. */
    words: 12,
    addressType: 'native',
    pathEdited: false,
    choice: 0,         /* which checksum-valid ending, lookup methods only */
    seed: null,        /* cached: the slow half, keyed by seedKey */
    seedKey: null
  };

  /* Three physical sources, and a different number of conventions behind
     each. A coin has one. Cards have three. A six-sided die has four, and which
     one a device uses is the entire question this page exists to answer --
     while the octal-and-hex dice are their own method with nothing to choose,
     so they sit under the dice source rather than beside it. */
  const method = () =>
    state.source === 'coin' ? 'coin'
    : state.source === 'cards' ? state.cardconv
    : state.dice === 'octahex' ? 'octahex'
    : state.conversion;
  const spec = () => C.METHODS[method()];

  const defaultPath = () => C.accountPath(state.addressType, 0);
  const seedKeyFor = input =>
    method() + '|' + state.words + '|' + state.choice + '|' + $('passphrase').value + '|' + input;

  /* ---- the segmented controls ---- */

  function paintSegments() {
    document.querySelectorAll('[data-group]').forEach(button => {
      const group = button.dataset.group;
      const on = String(state[group]) === button.dataset.value;
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function onPick(group, value) {
    state[group] = group === 'words' ? Number(value) : value;
    if (group === 'addressType' && !state.pathEdited) $('path').value = defaultPath();

    /* The lookup table is a 24-word procedure: 23 words rolled and a checksum
       word chosen. There is no 12-word form of it, so picking it moves the
       word count rather than letting the two controls disagree. */
    /* The lookup methods are 24-word procedures: 23 words rolled and a
       checksum word chosen, with no 12-word form. This asked whether the
       *conversion* control had changed, which missed the octal-and-hex method
       entirely -- that one is picked from the source control, so choosing it
       with 12 words selected left the button highlighted for a length the
       method cannot produce. Asking the resulting method instead covers both
       ways in. */
    /* Ask the method which lengths it has rather than assuming a lookup table
       means 24. The BitBox table is published for 24 words only, so it does
       still lock; the octal-and-hex dictionary works at either length, because
       three dice are 11 bits and a word index is 11 bits whatever the seed
       length happens to be. */
    if (!C.METHODS[method()].counts[state.words]) {
      state.words = Number(Object.keys(C.METHODS[method()].counts)[0]);
    }

    /* The chosen ending belongs to a particular seed length. A 12-word draw
       offers 128 of them and a 24-word one offers 8, so a choice made at 12
       can point past the end of the 24-word list -- and the picker only appears
       once enough throws are in, which meant the page could sit in a state it
       could not derive from and offered no way back. */
    if (group === 'words') state.choice = 0;

    if (group === 'source' || group === 'conversion' || group === 'dice' || group === 'cardconv') {
      /* Rolls, flips and lookup entries are different alphabets, so carrying
         the old input across would leave a box full of characters the new
         method rejects. */
      $('input').value = '';
      state.choice = 0;
      buildPad();
    }
    paintSegments();
    paintSteps();
    paintCount();
    /* Everything except the address type and the path changes what the seed
       would be, so the cached one stops being an answer to the question on
       screen. The address type is the one control the cache survives, which is
       the reason it exists. */
    if (group !== 'addressType') invalidateDerivedState();
    else if (state.seed) render();
  }

  /* The conversion step is only a question for dice, and the word count is
     only a question when the method offers both. */
  function paintSteps() {
    /* Only the six-sided die has a conversion worth asking about. The three
       dice name their word outright and a coin has nothing to choose, so the
       step goes away rather than standing there with a single option. */
    /* Only two of the three sources have a convention worth asking about, and
       they ask different questions, so the step carries two sets of buttons
       and shows the one that belongs to the source. */
    const askDice = state.source === 'dice' && state.dice === 'd6';
    const askCards = state.source === 'cards';
    $('step-conversion').hidden = !askDice && !askCards;
    $('conv-dice').hidden = !askDice;
    $('conv-cards').hidden = !askCards;
    $('dice-kind').hidden = state.source !== 'dice';
    /* One wording for both. The dice branch used to ask how your device
       converts and the card branch how the cards become a seed, which made the
       legend change under the reader for a control that does the same job
       either way -- and the hint below already names the devices each method
       belongs to. */
    $('conv-legend').textContent = 'Which conversion method?';
    document.querySelectorAll('[data-group="words"]').forEach(button => {
      button.disabled = !spec().counts[Number(button.dataset.value)];
    });
    $('rolls-title').textContent =
      state.source === 'cards' ? 'Your draw'
      : state.dice === 'octahex' && state.source === 'dice' ? 'Your three dice'
      : spec().lookup ? 'Your dice and coin'
      : state.source === 'coin' ? 'Your flips' : 'Your rolls';
    $('source-note').textContent =
      state.source === 'cards' ? 'Shuffle properly, then draw and record one card at a time. Cards already drawn are greyed out, because one deck cannot produce the same card twice.'
      : state.source === 'coin' ? 'One bit a flip, packed straight in. Nothing is hashed, so you can check the whole mapping by hand.'
      : state.dice === 'octahex' ? 'One octal die and two hex dice are 3 + 4 + 4 = 11 bits, which is one word exactly. Nothing is hashed \u2014 the three faces name the word, the way the printed dictionary does.'
      : 'The common case, and the one with four different conversions behind it.';
    numberSteps();
  }

  /* Step numbers are counted off the steps actually on screen, not written
     into the markup. Coin flips have no conversion to choose, so that step
     goes away and everything below it moves up -- hardcoded numbers would
     leave the badges reading 1, 3, 4 with no explanation for the gap.

     The visible badge and the number read aloud come from the same count, so
     they cannot drift apart, and the map beside the heading is built from the
     same list rather than kept in step by hand. */
  function numberSteps() {
    const steps = [...document.querySelectorAll('.workbench fieldset')].filter(f => !f.hidden);
    steps.forEach((step, i) => {
      const legend = step.querySelector('legend');
      legend.dataset.step = i + 1;
      legend.querySelector('.step-num').textContent = (i + 1) + '. ';
    });

    const map = $('step-map');
    const marks = [];
    steps.forEach((_, i) => {
      if (i) marks.push(document.createElement('i'));
      const b = document.createElement('b');
      b.textContent = i + 1;
      marks.push(b);
    });
    map.replaceChildren(...marks);
  }

  /* ---- the keypad ---- */

  /* Face value first, then what to call it out loud. A die needs no second
     label; heads and tails very much do, since H and T alone are a guess. */
  /* value, spoken name, and what to draw on the key when the two differ.
     A number needs no name under it -- "2" labelled "2" is noise -- but the
     letters do, and the suits read far better as their own symbols. The value
     stays the letter, so the transcript, the hash and the BIP39 tool's table
     all still see C, D, H and S. */
  /* Every rank is named, digits included. Naming only the five faces put a
     caption under A, T, J, Q and K and nothing under 2 to 9, which sat the
     lettered glyphs a line above their neighbours. Spelling the numbers out
     lines the row up and reads as one set rather than five labelled keys
     among eight bare ones. */
  const RANK_NAMES = {
    A: 'Ace', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six',
    7: 'Seven', 8: 'Eight', 9: 'Nine', T: 'Ten', J: 'Jack', Q: 'Queen', K: 'King'
  };

  const CARD_KEYS = [
    ...[...C.CARD_RANKS].map(r => [r, RANK_NAMES[r] || null]),
    ['C', 'Clubs', '♣'], ['D', 'Diamonds', '♦'],
    ['H', 'Hearts', '♥'], ['S', 'Spades', '♠']
  ];

  const KEYS = {
    /* One pad of sixteen for all three dice. Which keys are live depends on
       where you are in the group -- the octal die has eight faces and the hex
       dice sixteen -- which is easier to follow than a rule about every third
       entry. */
    octahex: [...'0123456789ABCDEF'].map(c => [c]),
    dice: [['1'], ['2'], ['3'], ['4'], ['5'], ['6']],
    dicezero: [['1'], ['2'], ['3'], ['4'], ['5'], ['6']],
    dicebits: [['1'], ['2'], ['3'], ['4'], ['5'], ['6']],
    /* Five dice showing 1 to 4, then the coin. Both alphabets are on the pad
       at once and the keys that cannot come next are disabled, which is
       easier to follow than a rule about every sixth entry. */
    bitbox: [['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four'],
             ['H', 'Heads'], ['T', 'Tails']],
    coin: [['H', 'Heads'], ['T', 'Tails']],
    /* Thirteen ranks then four suits, all on the pad at once. Which are live
       is decided by C.nextAllowed, which for cards answers from the deck
       rather than from the position: ranks with nothing left face-down go
       grey, and once a rank is picked only its remaining suits stay lit. */
    cards: CARD_KEYS,
    cardscoleman: CARD_KEYS,
    cardbits: CARD_KEYS
  };

  function buildPad() {
    const pad = $('pad');
    const keys = KEYS[method()];
    /* Only some keys on a pad carry a name -- the ranks pad names A, T, J, Q
       and K but not 2 through 9, and the bitbox pad names its coin but not its
       dice. A caption on some keys and not others sits the named glyphs a line
       higher than their neighbours, so where any key has one they all reserve
       one. Same reservation trick the status line uses: hold the space rather
       than let the row jump around it. */
    const named = keys.some(([, label]) => label);
    pad.dataset.method = method();
    pad.replaceChildren(...keys.map(([value, label, face]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'key';
      button.dataset.key = value;
      if (face) button.dataset.suit = value;
      button.setAttribute('aria-label', label || value);
      button.append(document.createTextNode(face || value));
      if (label || named) {
        const small = document.createElement('small');
        /* A non-breaking space rather than nothing: an empty <small> collapses
           and reserves no line at all. Hidden from screen readers, which have
           the key's aria-label already. */
        small.textContent = label ? label.toUpperCase() : ' ';
        if (!label) small.setAttribute('aria-hidden', 'true');
        button.append(small);
      }
      button.addEventListener('click', () => press(value));
      return button;
    }));
  }

  const limits = () => C.limits(method(), state.words);

  /* Every pad action rewrites the field from its normalised value, so the two
     input routes cannot drift apart -- what the counter counts is exactly what
     gets hashed. The cost is that typed spacing is tidied away on the next
     tap, which is a fair trade for the two never disagreeing. */
  /* Shown when entry is refused, and cleared on the next change so it never
     lingers over a sequence it no longer describes. */
  let capTimer = 0;
  let wasFull = false;
  function sayFull() {
    const info = spec();
    const at = C.progress({ method: method(), input: clean(), words: state.words });
    const el = $('cap-notice');
    /* The ceiling is not the same number as the requirement. Methods that
       absorb extra rolls accept far more than they need, and saying "99, the
       most" over a box holding 500 was simply wrong. */
    const ceiling = C.limits(method(), state.words).most;
    el.textContent = info.lookup
      ? 'That is all ' + C.rolledWords(method(), state.words) + ' words. Any more would not fit the phrase.'
      : info.variable
        ? 'That is ' + at.need + ' bits, a ' + state.words + '-word seed exactly. Further rolls would be dropped rather than used.'
        : info.extra
          ? 'That is ' + ceiling + ' ' + info.unit + 's, the most this accepts. ' + at.need + ' is already enough for ' + state.words + ' words.'
          : 'That is ' + ceiling + ' ' + info.unit + 's, exactly what a ' + state.words + '-word seed takes.';
    el.hidden = false;
    clearTimeout(capTimer);
    capTimer = setTimeout(() => { el.hidden = true; }, 6000);
  }

  function clearFull() {
    clearTimeout(capTimer);
    $('cap-notice').hidden = true;
  }

  /* Every programmatic write to the field goes through here -- the keypad, the
     undo button, clearing -- so this is where the cache has to be dropped.
     It only called hideResults(), which leaves the seed and any queued
     derivation alive: tapping a key after a result was on screen changed the
     input while the cached wallet stayed valid in memory. render()'s key check
     stopped it reaching the screen, but a cache that is wrong is not something
     to keep around and rely on one guard to catch. */
  function setInput(value) {
    $('input').value = value;
    invalidateDerivedState();
    paintCount();
  }

  function press(value) {
    const current = clean();
    /* The pad stops at the ceiling rather than the target: past the minimum,
       more rolls are welcome, but past the maximum they would be refused on
       submit and it is kinder to stop the tap than to explain afterwards.

       The bit table and the lookup table both have a hard stop instead. One
       keeps the last whole 32 bits, so an extra roll past the target silently
       changes which bits are used; the other needs whole groups of six. */
    const at = C.progress({ method: method(), input: current, words: state.words });
    if (at.full) { sayFull(); return; }
    const allowed = C.nextAllowed(method(), current);
    if (allowed && !allowed.includes(value)) return;
    setInput(current + value);
  }

  /* ---- the live counter ---- */

  function clean() { return C.normalise(method(), $('input').value); }

  /* How much unpredictability the physical events could have carried, which
     is a different question from how far along the count is. Worth showing on
     its own: 99 rolls of a six-sided die is the number COLDCARD asks for, and
     it is 255.9 bits rather than 256 -- true, mildly surprising, and invisible
     if the page only ever counts rolls.

     It is an upper bound on the source, not a verdict on the result. A sorted
     deck and a shuffled one of the same length read identically here; that is
     what the fabrication check is for. */
  function paintMeter(input) {
    const info = spec();
    const bits = C.sourceEntropy({ method: method(), input });
    const target = state.words === 24 ? 256 : 128;
    /* Left running past the target rather than pinned to it, because the
       reading is honest about the source: a hundred rolls really do carry
       258.5 bits. What that number must not imply is that the extra helps,
       which is the note's job below. */
    const over = bits > target;
    $('meter-val').textContent = bits.toFixed(1) + ' / ' + target + ' bits';
    $('meter-fill').style.width = Math.min(100, bits / target * 100) + '%';
    $('meter-fill').classList.toggle('is-full', bits >= target);

    const drawn = C.events(method(), input).length;
    $('meter-note-base').textContent =
      info.deck
        ? (() => {
            const left = C.cardsLeft(C.normalise(method(), input)).length;
            const each = 'Drawn without replacement, so each card is worth less than the last: log2(52) = 5.70 bits for the first, then log2(51), and so on.';
            return drawn && left === 52
              ? each + ' That deck is finished \u2014 shuffle it again and keep drawing; the count carries on.'
              : each + (drawn ? ' ' + left + ' cards still face-down.' : '');
          })()
        : info.groupBits
          ? 'Each word is ' + info.groupBits + ' bits: ' +
            (method() === 'octahex' ? 'log2(8) + log2(16) + log2(16) = 3 + 4 + 4.' : 'five four-sided dice and a coin, 5 x 2 + 1.')
        : info.eventBits === 1
          ? 'One bit a flip, so the count and the bits are the same number.'
          : (() => {
              /* The number quoted has to be the number the page will accept.
                 It used to be floor(target / bits-per-roll), which for 12
                 words is 49 -- one short of the 50 the counter demands, so the
                 note explained the arithmetic with a roll count that would be
                 refused. Quoting the real minimum also makes the two cases
                 land either side of the target, which is the point: 50 rolls
                 overshoot 128, 99 fall just short of 256, and both work
                 because the rolls are hashed rather than packed. */
              const need = limits().least;
              const carried = need * info.eventBits;
              return 'Each roll is log2(6) = 2.585 bits, so the ' + need + ' this needs carry '
                + carried.toFixed(1) + ' \u2014 just ' + (carried >= target ? 'past' : 'under')
                + ' the ' + target + ' a ' + state.words + '-word seed holds, which is why the rolls '
                + 'are hashed rather than packed in.';
            })();

    /* Once the source carries more than the seed can hold, the extra is real
       entropy that lands nowhere. Keeping the count climbing without saying so
       would let someone roll another fifty in the belief they were buying
       something. They are not; they are choosing a different wallet. */
    $('meter-cap').hidden = !over;
    $('meter-cap').textContent = over
      ? state.words + ' word seed stops at ' + target + ' bits. More ' + info.unit
        + 's will change which wallet you produce but not how hard it is to guess.'
      : '';
  }

  /* A QR as inline SVG rather than an image: no data: URI to build, nothing
     for the CSP to allow, and it scales without going soft on a phone.

     Drawn as one <path> of unit squares. A version 9 code is 53x53, which is
     2,809 rects if each module is its own element and one path string if it is
     not -- and this is rebuilt every time an address type changes.

     Always dark-on-white with a quiet zone, whatever the page around it is
     doing. A scanner needs the contrast and the margin; a QR that matches the
     site's palette is a QR that does not read. */
  /* ISO/IEC 18004's minimum four-module quiet zone. It matters most for the
     dense numeric SeedQR, but every code uses the same renderer so none can
     accidentally lose the scanner's required white border. */
  const QR_QUIET = 4;

  /* What each button would encode, set when a wallet is derived and emptied
     with everything else. Holding the strings or bytes here rather than in
     the markup keeps them out of the DOM until somebody asks to see one. */
  const qrSources = Object.create(null);
  let renderedAddressRows = null;
  let addressCheckToken = 0;
  const ADDRESS_SEARCH_LIMIT = 1000;
  const ADDRESS_SEARCH_BATCH = 1;

  function showAddressMatch(hit, shown) {
    const status = $('address-match-status');
    const branch = hit.chain === 'receive' ? 'Receiving' : 'Change';
    const extra = hit.index >= shown ? ' (beyond the ' + shown + ' shown)' : '';
    status.textContent = branch + ' address #' + hit.index + ' of this wallet \u00b7 ' + hit.path + extra;
    status.className = 'hint address-match-status is-ok';
  }

  /* Check the five already rendered addresses immediately, then search the
     rest of receive and change indices 0-999 in small tasks. Each address is
     public, but deriving it still costs an elliptic-curve multiplication; the
     batches keep the offline page responsive and the token cancels stale work
     when the pasted address or wallet changes. */
  function checkAddressMatch() {
    const status = $('address-match-status');
    const raw = $('address-match').value;
    const mine = ++addressCheckToken;
    if (!renderedAddressRows || !state.seed) {
      status.textContent = '';
      status.className = 'hint address-match-status';
      return;
    }
    const { receive, change, path, search } = renderedAddressRows;
    const shown = Math.max(receive.length, change.length);
    const immediate = C.matchDerivedAddress(raw, receive, change);
    if (immediate.state === 'empty') {
      status.textContent = '';
      status.className = 'hint address-match-status';
      return;
    }
    if (immediate.state === 'match') {
      showAddressMatch(immediate, shown);
      return;
    }
    status.textContent = 'Not in the ' + shown + ' shown addresses. Checking indices 0\u2013'
      + (ADDRESS_SEARCH_LIMIT - 1) + '\u2026';
    status.className = 'hint address-match-status';
    let start = shown;
    const searchNext = () => {
      if (mine !== addressCheckToken || !state.seed) return;
      const end = Math.min(start + ADDRESS_SEARCH_BATCH, ADDRESS_SEARCH_LIMIT);
      let result;
      try {
        result = C.findDerivedAddress({
          seed: state.seed.seed, addressType: state.addressType, path,
          address: raw, start, end, prepared: search
        });
      } catch (error) {
        status.textContent = 'Could not check that address: ' + error.message + '.';
        status.className = 'hint address-match-status is-bad';
        return;
      }
      if (result.state === 'match') {
        showAddressMatch(result, shown);
      } else if (end < ADDRESS_SEARCH_LIMIT) {
        start = end;
        status.textContent = 'No match through index ' + (end - 1)
          + '. Checking through ' + (ADDRESS_SEARCH_LIMIT - 1) + '\u2026';
        setTimeout(searchNext, 0);
      } else {
        status.textContent = 'No match in receive or change indices 0\u2013'
          + (ADDRESS_SEARCH_LIMIT - 1) + ' for this derivation.';
        status.className = 'hint address-match-status is-bad';
      }
    };
    setTimeout(searchNext, 0);
  }

  /* Download URLs are capabilities for the bytes inside their Blob, so they
     get the same lifecycle as every other derived value. Revoke shortly after
     the synthetic click, and immediately when the result is invalidated or
     Clear is pressed. Static filenames avoid leaking a fingerprint into the
     downloads list or a synced filename. */
  const exportUrls = new Set();

  function revokeExportUrl(url) {
    if (!exportUrls.delete(url)) return;
    URL.revokeObjectURL(url);
  }

  function clearExportState() {
    for (const url of [...exportUrls]) revokeExportUrl(url);
    const dialog = $('export-private-dialog');
    if (dialog && dialog.open) dialog.close();
    for (const id of ['export-status', 'export-private-error']) {
      const line = $(id);
      if (line) line.textContent = '';
    }
  }

  function downloadTextRecord(text, filename) {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    exportUrls.add(url);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => revokeExportUrl(url), 1000);
  }

  function downloadBinaryRecord(bytes, filename) {
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }));
    exportUrls.add(url);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.hidden = true;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => revokeExportUrl(url), 1000);
  }

  /* Translate the one account currently shown by this Workshop into the
     descriptor units consumed by EntropyLab's wallet.dat encoder. The file
     contains receiving and change descriptors for this selected script type,
     plus the account xprv records that let Bitcoin Core spend from them. */
  function walletDatInput(path) {
    const accountNode = C.derive(C.masterKey(state.seed.seed), path);
    const xpub = C.encodeXpub(accountNode);
    const xprv = C.encodeXprv(accountNode);
    const fingerprint = C.masterFingerprint(state.seed.seed);
    const descriptor = (key, branch) => C.watchOnlyDescriptor({
      addressType: state.addressType, fingerprint, path, xpub: key, branch
    });
    const outputId = {
      legacy: 'bip44', nested: 'bip49', native: 'bip84', taproot: 'bip86'
    }[state.addressType];
    return {
      accountNode,
      wallet: {
        kind: 'hd',
        network: 'mainnet',
        accounts: [{
          def: { id: outputId },
          receiveDescriptor: descriptor(xpub, 0),
          changeDescriptor: descriptor(xpub, 1),
          receiveDescriptorPriv: descriptor(xprv, 0),
          changeDescriptorPriv: descriptor(xprv, 1)
        }]
      }
    };
  }

  function walletDatDeps(accountNode) {
    return {
      sha256: C.sha256,
      checksum: C.descriptorChecksum,
      base58Decode: C.base58checkDecode,
      deriveBranchBody: (unusedXpub, branch) => {
        const node = C.ckdPriv(accountNode, branch);
        const body = new Uint8Array(74);
        const view = new DataView(body.buffer);
        body[0] = node.depth;
        body.set(node.parentFingerprint, 1);
        view.setUint32(5, node.index >>> 0, false);
        body.set(node.chainCode, 9);
        body.set(C.publicKeyOf(node), 41);
        return body;
      },
      publicKeyForPrivate: secret => C.publicKeyOf({ key: secret })
    };
  }

  function prepareWalletDat() {
    if (!state.seed || $('results').hidden) return;
    try {
      if (state.seedKey !== seedKeyFor(clean())) {
        throw new Error('the wallet changed before the file was ready');
      }
      const { wallet, accountNode } = walletDatInput($('path').value.trim());
      const bytes = hodlWalletExport.buildWalletDat(wallet, true, walletDatDeps(accountNode));
      downloadBinaryRecord(bytes, hodlWalletExport.walletDatFilename(true));
      if ($('export-private-dialog').open) $('export-private-dialog').close();
      $('export-status').textContent = 'Private Bitcoin Core wallet.dat download requested. It can spend this account; treat it like the wallet itself.';
    } catch (error) {
      const line = $('export-private-dialog').open
        ? $('export-private-error') : $('export-status');
      line.textContent = 'Could not prepare wallet.dat: ' + error.message + '.';
    }
  }

  /* The builder receives the cached seed and only a boolean for passphrase
     state. The passphrase value itself never crosses this boundary. Kept in
     the click handler's task so the Blob download retains the browser's user
     activation: yielding first, for a progress state or any other repaint,
     makes a local file download more likely to be refused as synthetic. That
     is also why nothing here reports progress -- one synchronous task cannot
     paint twice, so a "Preparing" label would be a lie the eye never sees,
     and single-threaded execution already rules out an overlapping click. */
  function prepareExport(kind) {
    if (!state.seed || $('results').hidden) return;
    const isPrivate = kind === 'private';
    const path = $('path').value.trim();

    /* Where a failure has to appear depends on where the click came from. The
       page-level line sits behind the modal's backdrop, so reporting a private
       failure there writes into a region the person cannot see: the button
       does nothing and nothing explains why. */
    const fail = message => {
      const line = isPrivate && $('export-private-dialog').open
        ? $('export-private-error') : $('export-status');
      line.textContent = message;
    };

    try {
      if (state.seedKey !== seedKeyFor(clean())) {
        throw new Error('the wallet changed before the file was ready');
      }
      const texts = C.buildWalletExportTexts({
        mnemonic: state.seed.mnemonic,
        wordlist: WORDLIST,
        seed: state.seed.seed,
        addressType: state.addressType,
        path,
        passphraseUsed: $('passphrase').value.length > 0,
        /* What was rolled, flipped or drawn, so the file can be checked
           against the paper it came from. The builder replays it and refuses
           the record if it does not reproduce these words. */
        source: {
          method: method(), input: clean(), words: state.words, choice: state.choice
        }
      });
      downloadTextRecord(
        isPrivate ? texts.privateText : texts.watchOnlyText,
        isPrivate ? 'selfcustody-private-recovery.txt' : 'selfcustody-watch-only.txt'
      );
      /* Closed before the message is written, so the success line is not
         reported into a region the backdrop is covering. */
      if (isPrivate && $('export-private-dialog').open) $('export-private-dialog').close();
      $('export-status').textContent = isPrivate
        ? 'Private recovery record download requested. Treat the file like the wallet itself.'
        : 'Watch-only record download requested. It cannot spend, but it reveals wallet activity.';
    } catch (error) {
      fail('Could not prepare that record: ' + error.message + '.');
    }
  }

  function qrSvg(payload, ecc, binary) {
    const qr = binary
      ? qrcodegen.QrCode.encodeBinary(payload, ecc)
      : qrcodegen.QrCode.encodeText(payload, ecc);
    const dim = qr.size + QR_QUIET * 2;
    let d = '';
    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (qr.getModule(x, y)) d += 'M' + (x + QR_QUIET) + ' ' + (y + QR_QUIET) + 'h1v1h-1z';
      }
    }
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + dim + ' ' + dim);
    svg.setAttribute('role', 'img');
    svg.setAttribute('shape-rendering', 'crispEdges');
    const bg = document.createElementNS(NS, 'rect');
    bg.setAttribute('width', String(dim));
    bg.setAttribute('height', String(dim));
    bg.setAttribute('fill', '#fff');
    const fg = document.createElementNS(NS, 'path');
    fg.setAttribute('d', d);
    fg.setAttribute('fill', '#000');
    svg.append(bg, fg);
    return svg;
  }

  /* One code into one holder, with the label a screen reader gets instead of
     the picture. Cleared rather than left stale when there is nothing to draw:
     an old wallet's QR under a new wallet's address would be the worst kind of
     wrong, because it would scan. */
  function paintQr(el, payload, label, ecc, binary) {
    if (!el) return;
    if (!payload || payload.length === 0) { el.replaceChildren(); return; }
    const svg = qrSvg(payload, ecc || qrcodegen.QrCode.Ecc.MEDIUM, binary);
    svg.setAttribute('aria-label', label);
    el.replaceChildren(svg);
  }

  /* Reads the canonical transcript back as chips, with a break where one deck
     ends. Never the other way round: nothing here is written back to the
     textarea, so the string that gets hashed is untouched by anything in
     this function. */
  const SUIT_MARK = { C: '\u2663', D: '\u2666', H: '\u2665', S: '\u2660' };

  function paintDeal(input, deck) {
    const el = $('deal');
    if (!deck) { el.hidden = true; return; }
    const cards = C.events(method(), input);
    el.hidden = cards.length === 0;
    const out = [];
    cards.forEach((card, i) => {
      if (deck && i === deck) {
        const mark = document.createElement('span');
        mark.className = 'deal-break';
        mark.textContent = 'Second shuffle';
        out.push(mark);
      }
      const chip = document.createElement('b');
      const suit = card.slice(1);
      if (suit === 'H' || suit === 'D') chip.className = 'red';
      /* Rank and suit as separate nodes so a margin can sit between them:
         monospace sets 3 and a heart hard against each other, and a suit is a
         picture rather than a second digit. Display only -- the string that
         gets hashed never comes back from here. */
      const mark = document.createElement('span');
      mark.textContent = SUIT_MARK[suit] || suit;
      chip.append(card.slice(0, 1), mark);
      out.push(chip);
    });
    el.replaceChildren(...out);
  }

  function paintCount() {
    const info = spec();
    const { least, most } = limits();
    const input = clean();
    const at = C.progress({ method: method(), input, words: state.words });
    const el = $('count');

    /* Physical deck state is counted in cards even when progress is measured
       in bits. The hash method has a fixed six-card second pass; the bit-table
       method does not, so it keeps its bit counter and only gets the reshuffle
       notice. Nothing returns from this branch: the meter, keypad and derive
       button below must repaint at 52 and on every card after it. */
    const deck = info.deck ? 52 : 0;
    const deckAt = C.deckProgress({ method: method(), input, words: state.words });
    const fixedSecondPass = deckAt && deckAt.required !== null && deckAt.second !== null
      && deckAt.second <= deckAt.required;

    const turn = $('deck-turn');
    turn.hidden = !(deckAt && deckAt.turn);
    if (!turn.hidden) {
      turn.textContent = deckAt.required === null
        ? 'First deck complete \u2014 shuffle the entire deck again, then keep drawing until the meter is full.'
        : 'First deck complete \u2014 shuffle the entire deck again, then draw ' + deckAt.required + ' more.';
    }
    paintDeal(input, deck);

    /* Three different units, because three different things are actually
       being counted -- see progress() in the core. */
    if (fixedSecondPass) {
      el.textContent = 'Second shuffle: ' + deckAt.second + ' of ' + deckAt.required + ' cards';
      el.className = deckAt.second >= deckAt.required ? 'ready' : 'short';
    } else if (at.over) {
      el.textContent = at.have + ' ' + at.unit + 's · ' + at.need + ' is the most';
      el.className = 'over';
    } else if (!at.ready) {
      el.textContent = at.have + ' of ' + at.need + ' ' + at.unit + 's';
      el.className = 'short';
    } else {
      el.textContent = at.have + ' ' + at.unit + 's';
      el.className = 'ready';
    }

    if (info.lookup) {
      const rolled = C.rolledWords(method(), state.words);
      const endings = 1 << ((state.words === 24 ? 256 : 128) - rolled * 11);
      $('need').textContent = rolled + (method() === 'octahex'
        ? ' throws of all three dice, ' : ' words of five dice and a coin, ')
        + (rolled * info.grouped) + ' entries in all. The last word is not rolled — '
        + 'it is mostly a checksum, so the page offers the ' + endings
        + ' valid endings once the rest are in.';
    } else if (info.variable) {
      $('need').textContent = state.words === 24 ? '256 bits for 24 words. A roll is worth one or two bits '
        + 'depending on the face — 1, 2, 3 and 6 give two, 4 and 5 give one — so the number of rolls '
        + 'you need is not fixed. Somewhere between 128 and 256.'
        : '128 bits for 12 words, which takes between 64 and 128 rolls depending on what you roll.';
    } else if (info.extra) {
      $('need').textContent = least + ' ' + info.unit + 's for ' + state.words + ' words, and more if you like — every '
        + info.unit + ' goes into the hash, so the extras are not wasted. Up to ' + most + '.';
    } else {
      /* A flip is one bit and a hex roll is four, so the sentence takes the
         figure from the method rather than assuming the coin. */
      $('need').textContent = 'Exactly ' + least + ' ' + info.unit + 's for ' + state.words + ' words. Each '
        + info.unit + ' is ' + info.bitsPer + ' and they are packed straight in, so ' + least
        + ' fills the seed exactly and a further one would have nowhere to go.';
    }

    $('accepts').textContent = 'Accepts ' + info.faces + '. Spaces and line breaks are ignored.';

    const allowed = C.nextAllowed(method(), input);
    paintMeter(input);
    paintDistribution(input, at);
    $('pad-hint').textContent = state.source === 'dice' && state.dice === 'octahex'
      ? (allowed && allowed.length === 8
        ? 'Throw all three, then enter the octal die first — it shows 1 to 8.'
        : 'Now the two hex dice, left to right. Either one can go first; just read them in the order you laid them out.')
      : info.lookup
      ? (allowed === 'HT'
        ? 'Five dice are in — now the coin. No coin? Roll a die: 1 to 3 is heads, 4 to 6 is tails.'
        : 'Five dice showing 1 to 4, then the coin, for each word. Reroll any 5 or 6 rather than recording it.')
      : state.source === 'cards'
      ? (allowed && allowed.length <= 4 && !/[2-9TJQK]/.test(allowed)
        ? 'Now the suit.'
        : 'Tap the rank, then the suit, for each card as you turn it over.')
      : state.source === 'coin'
        ? 'Tap each flip in the order you made them. You can type H and T instead, or paste.'
        : 'Tap each roll in the order you made them. You can type the digits instead, or paste.';

    $('go').disabled = !at.ready;
    $('go').textContent = info.lookup ? 'Produce words' : 'Produce wallet';
    $('matches').textContent = info.matches;

    /* The keys are disabled at the ceiling, so a press cannot report it -- a
       disabled button emits no click. Saying it on arrival covers the keypad
       and typing alike, and only on the transition, so it does not re-announce
       on every later repaint. */
    if (at.full && !wasFull) sayFull();
    wasFull = at.full;

    $('pad').querySelectorAll('.key').forEach(key => {
      key.disabled = at.full || (allowed ? !allowed.includes(key.dataset.key) : false);
    });
    $('undo').disabled = input.length === 0;
    $('clear').disabled = input.length === 0;
  }

  /* ---- deriving ---- */

  function hideResults({ keepEndings = false, loading = false } = {}) {
    $('results').hidden = true;
    $('error').hidden = true;
    $('results-loading').hidden = !loading;
    if (!keepEndings) $('endings').hidden = true;
  }

  /* ---- invalidating a result -------------------------------------------

     The page caches the slow half of the work -- PBKDF2's 2048 rounds -- so
     that changing the address type repaints instead of recomputing. That cache
     has to be thrown away the moment anything it was computed from changes,
     and it was not being thrown away thoroughly enough.

     Three ways a stale wallet could reach the screen:

     Editing the rolls only hid the results; state.seed stayed. Change the
     address type afterwards and render() ran against the old seed, showing
     wallet A while the box on screen visibly held entropy B.

     Switching 12 words to 24 left the seed cached too, so the same thing
     happened with the word count contradicting what was displayed.

     And clearing state.seed without state.seedKey left the pair inconsistent:
     type a passphrase, delete it back to what it was, and the key matched
     while the seed was null, so derive() skipped the work and then read
     .options off null.

     Every one of those is the failure this tool exists not to have -- a
     plausible wrong answer, shown without complaint.

     There is also a timer. derive() schedules the slow part 20ms out so the
     button can repaint first, and that callback closes over the input it was
     given. Left alone it survives the page being cleared: navigate during the
     window, come back through the back/forward cache, and pageshow clears the
     page and then the old callback renders the mnemonic again. So the timer is
     cancelled here, and a generation counter makes any callback that still
     runs return without touching anything. */
  let deriveTimer = 0;
  let generation = 0;

  function invalidateDerivedState() {
    generation += 1;
    if (deriveTimer) { clearTimeout(deriveTimer); deriveTimer = 0; }
    clearExportState();
    state.seed = null;
    state.seedKey = null;
    renderedAddressRows = null;
    addressCheckToken += 1;
    clearLifeHashes();

    /* The strings parked for the QR buttons are derived material like any
       other, and this is the only place that drops them. Clearing the page is
       not the only thing that invalidates a wallet -- editing a single roll
       does too -- and until this moved, that path emptied the DOM while
       leaving the last mnemonic's SeedQR digits reachable in qrSources. The
       buttons live inside #results, so nothing could open one; the defect was
       that a secret outlived the wallet it belonged to and could not be
       collected while a live object still referenced it. */
    for (const key of Object.keys(qrSources)) delete qrSources[key];
    if ($('qr-dialog').open) $('qr-dialog').close();
    $('ending-all').open = false;

    for (const id of SECRET_TEXT) {
      const el = $(id);
      if (!el) continue;
      el.replaceChildren();
      el.textContent = '';
    }
    hideResults();
  }

  /* Every element that ends up holding something derived from the entered
     sequence, plus the two inputs and the cached seed.

     hideResults() only sets hidden, which is right while someone is editing --
     the answer comes back the moment they press the button again. It is not
     enough when the page is being left: the words, the account key and the
     addresses are all still in the document, and a back-navigation that
     restores from the back/forward cache puts them straight back on screen,
     for whoever is now sitting there.

     This is best-effort, and the limit is worth stating plainly rather than
     implying otherwise. It empties fields and detaches nodes, which is what a
     page can do. It cannot erase memory: JavaScript strings are immutable, so
     the old values persist until the garbage collector happens to reclaim
     them, and nothing here can force that. Treat it as tidying the desk, not
     shredding the paper. */
  const SECRET_FIELDS = ['input', 'passphrase', 'address-match'];
  const SECRET_TEXT = [
    'words', 'entropy', 'ending-list', 'ending-octal', 'ending-hex',
    'ending-picked-word', 'ending-picked-label',
    'xpub', 'xpub-path', 'xpub-alt', 'xpub-alt-label',
    'descriptor', 'descriptor-recv', 'descriptor-chng',
    'checksum-line', 'checksum-detail',
    'master-xprv', 'xprv', 'xprv-path', 'xprv-alt', 'xprv-alt-label',
    'recv-addr', 'recv-path', 'chng-addr', 'chng-path', 'recv-more', 'chng-more',
    'address-match-status',
    'qr-dialog-code', 'qr-dialog-text', 'qr-dialog-title',
    'fp-base', 'fp-pass', 'fp-base-tag',
    'seedqr-digits', 'seedqr-grid'
  ];

  function clearLifeHashes() {
    for (const id of ['lifehash-base', 'lifehash-pass']) {
      const image = $(id);
      if (!image) continue;
      image.removeAttribute('src');
      image.alt = '';
      image.hidden = true;
    }
  }

  const formatDistributionP = p => p < 0.001 ? '<0.001' : p.toFixed(3);

  function distributionReportElement(report) {
    const section = document.createElement('section');
    section.className = 'distribution-report';
    const head = document.createElement('div');
    head.className = 'distribution-head';
    const title = document.createElement('strong');
    title.textContent = report.title;
    const status = document.createElement('span');
    status.className = 'distribution-status is-' + report.state;
    status.textContent = report.state === 'insufficient'
      ? 'More observations needed'
      : report.state === 'uneven' ? 'Unusually uneven' : 'No strong imbalance detected';
    head.append(title, status);

    const stats = document.createElement('p');
    stats.className = 'distribution-stats';
    stats.textContent = report.samples < report.minimum
      ? report.samples + ' observations · ' + report.minimum + ' needed for the chi-square approximation'
      : report.samples + ' observations · expected ' + report.expected.toFixed(1)
        + ' per face · chi-square ' + report.score.toFixed(2) + ' · p ' + formatDistributionP(report.p);

    const peak = Math.max(report.expected, ...report.counts.map(face => face.count), 1);
    const chart = document.createElement('div');
    chart.className = 'distribution-chart';
    chart.style.setProperty('--faces', report.counts.length);
    chart.setAttribute('aria-label', report.title + ' face counts');
    for (const face of report.counts) {
      const item = document.createElement('span');
      item.className = 'distribution-face';
      const count = document.createElement('b');
      count.textContent = face.count;
      const column = document.createElement('span');
      column.className = 'distribution-column';
      const bar = document.createElement('i');
      bar.style.height = (face.count / peak * 100).toFixed(1) + '%';
      const expected = document.createElement('span');
      expected.style.bottom = (report.expected / peak * 100).toFixed(1) + '%';
      const label = document.createElement('small');
      label.textContent = face.label;
      column.append(bar, expected);
      item.append(count, column, label);
      chart.append(item);
    }
    section.append(head, stats, chart);
    return section;
  }

  function paintDistribution(input, progress) {
    const details = $('distribution');
    const relevant = state.source === 'dice';
    details.hidden = !relevant;
    if (!relevant) { details.open = false; $('distribution-body').replaceChildren(); return; }
    if (!details.open) { $('distribution-body').replaceChildren(); return; }

    const body = $('distribution-body');
    if (!progress.ready) {
      const waiting = document.createElement('p');
      waiting.className = 'distribution-wait';
      waiting.textContent = 'Finish the minimum sequence first. The chart stays withheld while you are still entering outcomes, so it cannot influence which ones you keep.';
      body.replaceChildren(waiting);
      return;
    }

    const intro = document.createElement('p');
    intro.className = 'distribution-intro';
    intro.textContent = 'The white mark is the count expected at each face. Pearson’s chi-square asks how surprising the differences would be if the source were even.';
    const caveat = document.createElement('p');
    caveat.className = 'distribution-caveat';
    caveat.textContent = 'Advisory only. Fair input can trigger this warning by chance. This is a spellcheck, not proof of randomness. Do not edit or reroll individual outcomes in response; test the physical die in a separate run if something concerns you.';
    body.replaceChildren(intro, ...C.dieDistributionReports(method(), input).map(distributionReportElement), caveat);
  }

  function paintLifeHash(id, fingerprint) {
    const image = $(id);
    image.src = WorkshopLifeHash.fromFingerprint(fingerprint, 2);
    image.alt = 'LifeHash visual fingerprint for ' + fingerprint;
    image.hidden = false;
  }

  function clearSensitiveState() {
    for (const id of SECRET_FIELDS) {
      const el = $(id);
      if (el) el.value = '';
    }
    invalidateDerivedState();
    state.choice = 0;

    /* The transient UI as well, or clearing leaves a page that disagrees with
       itself: a roll counter describing rolls that are gone, an enabled Derive
       button over an empty box, a cap notice about a limit no longer reached,
       and -- if the refusal dialog was open when the page was left -- a modal
       still sitting over a page with nothing in it. */
    const alarm = $('alarm');
    if (alarm && alarm.open) alarm.close();
    clearFull();
    wasFull = false;
    paintCount();
  }

  function fail(message) {
    $('results').hidden = true;
    $('results-loading').hidden = true;
    $('error').hidden = false;
    $('error').textContent = message;
  }

  function derive() {
    /* Changing an ending is a refinement of a choice already on screen. Keep
       that picker anchored while the slower key derivation catches up; only
       the wallet below it is replaced by a loading line. Initial derivation
       still starts with the whole ending step hidden because it does not exist
       yet. */
    const keepEndings = spec().lookup && !$('endings').hidden;
    hideResults({ keepEndings, loading: keepEndings });
    const rawInput = $('input').value;
    const input = clean();

    /* Checked here rather than live, so nobody watches a warning appear and
       disappear as they tap and starts steering their rolls by it.

       Wrapped because it runs outside the derive try/catch below: an
       exception here once escaped the click handler entirely and left the
       last wallet on screen with no error, which is the worst way for this
       page to fail -- it looks like an answer. */
    let verdict;
    try {
      verdict = C.assessEntropy({ method: method(), input: rawInput });
    } catch (err) {
      fail('This page could not check those ' + spec().unit + 's: ' + err.message);
      return;
    }
    if (!verdict.ok) { raiseAlarm(verdict); return; }

    const key = seedKeyFor(input);

    /* Repaint before the slow part so the button state is actually seen. */
    $('go').disabled = true;
    $('go').textContent = 'Working\\u2026';

    const mine = generation;
    deriveTimer = setTimeout(() => {
      deriveTimer = 0;
      /* Anything that invalidates the cache bumps the generation. A callback
         from before that point is describing inputs the page no longer has,
         so it stops here rather than rendering them. */
      if (mine !== generation) return;
      try {
        if (state.seedKey !== key) {
          state.seed = C.deriveSeed({
            method: method(), input: rawInput, words: state.words, wordlist: WORDLIST,
            passphrase: $('passphrase').value, choice: state.choice
          });
          state.seedKey = key;
        }
        if (state.seed.options) paintEndings(state.seed.options);
        render();
      } catch (err) {
        fail(err.message);
      } finally {
        $('go').disabled = false;
        paintCount();
      }
    }, 20);
  }

  /* The checksum-valid endings, shown the way the physical procedure chooses
     them. Picking one is picking a wallet: the phrases share every rolled word
     and nothing downstream. */
  function paintEndings(options) {
    $('endings').hidden = false;
    /* Three unrolled bits is eight endings, and every method that reaches here
       gets them the same way. What differs is how you were told to choose. */
    /* Ask the method, not the source. Both lookup tables sit under the dice
       source now, so a source test cannot tell them apart and this note fell
       through to the BitBox wording whenever the octal dice were chosen. */
    $('endings-note').textContent = method() === 'octahex'
      ? (state.words === 24
        ? 'Your throws fix the first 23 words, which carry 253 bits. A 24-word phrase needs 256 plus an 8-bit checksum, so the last word is three bits you never rolled followed by a check over all of them \u2014 which leaves exactly eight endings. Throw the octal die once more and take that numbered option, counting from the left. Your COLDCARD, SeedSigner or Jade will offer the same eight.'
        : 'Your throws fix the first 11 words, which carry 121 bits. A 12-word phrase needs 128 plus a 4-bit checksum, so the last word is seven bits you never rolled followed by a check over all of them \u2014 which leaves 128 endings rather than eight. Seven bits is one octal die and one hex die, so throw both and select those two faces below. The page will show the matching last word. Every combination is a real wallet, and every one is a different wallet.')
      : 'Your rolls fix the first 23 words, which carry 253 bits. A 24-word phrase needs 256 plus an 8-bit checksum, so the last word is three bits you never rolled followed by a check over all of them. That leaves exactly eight valid endings, and your BitBox02 shows you these same eight. Any one of them is a real wallet \u2014 they are different wallets, so pick the one your device showed you, or roll one more die and count 1 to 8.';
    /* Label each ending with the throw that selects it, rather than leaving it
       to be counted. Eight endings can be counted along a row; a hundred and
       twenty-eight cannot, and "take the 93rd" is an instruction nobody should
       be given. The free bits are exactly one octal die for a 24-word seed, and
       an octal die plus a hex die for a 12-word one, so the label is simply
       what those dice read. */
    const octahex = method() === 'octahex';
    const many = options.length > 8;
    $('ending-list').classList.toggle('is-many', many);
    $('ending-direct').hidden = !many;
    $('ending-short').hidden = many;
    $('ending-all').hidden = !many;
    (many ? $('ending-all-slot') : $('ending-short')).append($('ending-list'));
    const labelFor = i => !octahex ? String(i + 1)
      : many ? String(Math.floor(i / 16) + 1) + String.fromCharCode(183) + (i % 16).toString(16).toUpperCase()
      : String(i + 1);

    /* The 128 choices are exactly the cartesian product printed on the two
       dice, so those faces are the primary control. The complete word grid is
       still built below as an inspectable reference, behind a disclosure. */
    if (many) {
      const choose = choice => {
        state.choice = choice;
        const octal = Math.floor(choice / 16);
        const hex = choice % 16;
        $('ending-octal').querySelectorAll('button').forEach((button, i) => {
          button.setAttribute('aria-pressed', i === octal ? 'true' : 'false');
        });
        $('ending-hex').querySelectorAll('button').forEach((button, i) => {
          button.setAttribute('aria-pressed', i === hex ? 'true' : 'false');
        });
        $('ending-picked-word').textContent = options[choice].word;
        $('ending-picked-label').textContent = labelFor(choice);
        state.seedKey = null;
        derive();
      };
      const faceButtons = (values, active, aria, choiceFor) => values.map((value, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ending-face';
        button.textContent = value;
        button.setAttribute('aria-label', aria + ' ' + value);
        button.setAttribute('aria-pressed', i === active ? 'true' : 'false');
        button.addEventListener('click', () => choose(choiceFor(i)));
        return button;
      });
      const octal = Math.floor(state.choice / 16);
      const hex = state.choice % 16;
      $('ending-octal').replaceChildren(...faceButtons(
        Array.from({ length: 8 }, (_, i) => String(i + 1)), octal, 'Octal die',
        i => i * 16 + hex
      ));
      $('ending-hex').replaceChildren(...faceButtons(
        Array.from({ length: 16 }, (_, i) => i.toString(16).toUpperCase()), hex, 'Hex die',
        i => octal * 16 + i
      ));
      $('ending-picked-word').textContent = options[state.choice].word;
      $('ending-picked-label').textContent = labelFor(state.choice);
    }

    $('ending-list').replaceChildren(...options.map((option, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ending';
      const tag = document.createElement('small');
      tag.textContent = labelFor(i);
      button.append(tag, document.createTextNode(option.word));
      button.setAttribute('aria-label', 'Option ' + labelFor(i) + ': ' + option.word);
      button.setAttribute('aria-pressed', i === state.choice ? 'true' : 'false');
      button.addEventListener('click', () => {
        state.choice = i;
        state.seedKey = null;
        derive();
      });
      return button;
    }));
  }

  function render() {
    /* The last line of defence. render() is called directly when the address
       type or the path changes, on the assumption that the cached seed still
       describes what is on screen. If it does not -- because something changed
       without invalidating, now or after some future edit -- showing the old
       wallet would be worse than showing nothing. */
    if (!state.seed || state.seedKey !== seedKeyFor(clean())) {
      invalidateDerivedState();
      return;
    }

    /* Stop any queued search before parsing the new path. An invalid path
       returns early below, so waiting until the replacement rows exist left
       the old wallet's expensive search running invisibly in the background. */
    addressCheckToken += 1;
    renderedAddressRows = null;
    $('address-match-status').textContent = '';
    $('address-match-status').className = 'hint address-match-status';

    /* A rerender means at least the account presentation may have changed.
       Close a pending confirmation and retire any Blob URL before painting
       the new result, so no control remains attached to the prior one. */
    clearExportState();

    const path = $('path').value.trim();
    let addresses;
    try {
      C.parsePath(path);
      addresses = C.deriveAddresses({ seed: state.seed.seed, addressType: state.addressType, path });
    } catch (err) {
      fail('That derivation path is not usable: ' + err.message);
      return;
    }

    $('error').hidden = true;
    /* What the last word is made of, and whether it checks out.

       Worth saying plainly because the two families of method differ here and
       the difference is invisible otherwise. A hashed sequence fixes every bit
       of the entropy, so exactly one last word is valid and there is nothing to
       choose; a lookup table leaves a few bits unrolled, which is why those
       methods offer a list to pick from. Either way the checksum itself is
       computed, never chosen -- picking it would just mean picking an invalid
       phrase. */
    const sum = C.checkMnemonic(state.seed.mnemonic, WORDLIST);
    const note = $('checksum-note');
    note.className = 'checksum-note' + (sum.ok ? ' is-ok' : ' is-bad');
    /* The verdict is the part worth reading every time; the arithmetic behind
       it is worth reading once. Folded away rather than deleted, because the
       question it answers -- why some methods offer a last word to pick and
       others cannot -- is a real one that came up the moment the choice
       existed. */
    $('checksum-line').textContent = sum.ok
      ? 'Checksum verified.'
      : 'This phrase fails the BIP39 checksum. Do not use it.';
    /* Nothing to open on a failure, and a disclosure that opens onto nothing
       is worse than none: forced shut, with the chevron and body hidden. */
    if (!sum.ok) note.open = false;
    $('checksum-detail').textContent = 'Word ' + sum.words + ' is ' + sum.freeBits
      + ' bits of entropy followed by ' + sum.checksumBits + ' of checksum. '
      + (spec().lookup
        ? 'Those ' + sum.freeBits + ' are the bits you never rolled, which is the choice you made above; the '
          + sum.checksumBits + ' are computed from everything else.'
        : 'Hashing fixes all ' + sum.entropyBits + ' entropy bits, so those ' + sum.freeBits
          + ' are already decided and exactly one word ' + sum.words + ' fits. A lookup table leaves them unrolled and does offer a list; a hash does not.')
      + ' The checksum itself is never a choice \u2014 it is computed either way.';

    $('words').replaceChildren(...state.seed.mnemonic.map((word, i) => {
      const li = document.createElement('li');
      const n = document.createElement('span');
      n.textContent = i + 1;
      const b = document.createElement('b');
      b.textContent = word;
      li.append(n, b);
      return li;
    }));

    /* The eight digits a device shows to say which wallet it is holding. With
       a passphrase there are two of them, and the pair is the useful part:
       the left is the wallet the words alone open, the right is the one your
       passphrase opens. A device showing neither is a device holding
       something else. */
    const base = state.seed.baseFingerprint;
    const withPass = state.seed.fingerprint;
    $('fp-base').textContent = base;
    $('fp-arrow-wrap').hidden = base === withPass;
    $('fp-pass').textContent = withPass;
    $('fp-base-tag').textContent = base === withPass ? '' : 'without passphrase';
    paintLifeHash('lifehash-base', base);
    if (base === withPass) {
      $('lifehash-pass').removeAttribute('src');
      $('lifehash-pass').hidden = true;
    } else {
      paintLifeHash('lifehash-pass', withPass);
    }
    $('fp-note').textContent = base === withPass
      ? 'Your device should be showing this. If it shows something else, it is holding a different wallet.'
      : 'Words alone on the left, words plus your passphrase on the right. Your device should be showing the one on the right \u2014 if it shows the one on the left, the passphrase did not take.';

    /* The account key, which is what a watch-only wallet is actually asking
       for when it says "import your xpub". It cannot spend. */
    $('xpub-path').textContent = path;
    $('xpub').textContent = addresses.xpub;
    /* Built from the canonical xpub, never the ypub/zpub form: the script
       type is already stated by the descriptor function, and a SLIP-132
       prefix would say it a second time in a dialect Core does not read. */
    const descriptorArgs = {
      addressType: state.addressType,
      fingerprint: C.masterFingerprint(state.seed.seed),
      path,
      xpub: addresses.xpub
    };
    const descriptorLine = C.watchOnlyDescriptor(descriptorArgs);
    $('descriptor').textContent = descriptorLine;
    qrSources.descriptor = { text: descriptorLine, title: 'Watch-only descriptor' };
    /* The same account written the older way, for wallets that predate
       BIP389's multipath syntax and reject it outright. */
    $('descriptor-recv').textContent = C.watchOnlyDescriptor({ ...descriptorArgs, branch: 0 });
    $('descriptor-chng').textContent = C.watchOnlyDescriptor({ ...descriptorArgs, branch: 1 });
    $('xpub-alt-row').hidden = !addresses.typedXpub;
    $('xpub-slip').hidden = !addresses.typedXpub;
    if (addresses.typedXpub) {
      $('xpub-alt').textContent = addresses.typedXpub;
      $('xpub-alt-label').textContent = addresses.typedXpub.slice(0, 4);
    }

    $('recv-path').textContent = addresses.receive.path;
    $('recv-addr').textContent = addresses.receive.address;
    $('chng-path').textContent = addresses.change.path;
    $('chng-addr').textContent = addresses.change.address;

    /* Built rather than templated: the count is the core's to decide, and a
       fixed set of ids here would silently show four of five or five of four
       the moment it changed. */
    const runInto = (el, run) => el.replaceChildren(...run.map(entry => {
      const li = document.createElement('li');
      const where = document.createElement('code');
      /* Just the branch and index. The account path they hang off is already
         shown on the two entries above, and repeating it here turned each
         row into a wall of apostrophes. */
      where.textContent = '/' + entry.path.split('/').slice(-2).join('/');
      const addr = document.createElement('b');
      addr.textContent = entry.address;
      li.append(where, addr);
      return li;
    }));
    runInto($('recv-more'), addresses.moreReceive);
    runInto($('chng-more'), addresses.moreChange);
    renderedAddressRows = {
      path,
      search: C.prepareDerivedAddressSearch({
        seed: state.seed.seed, addressType: state.addressType, path
      }),
      receive: [addresses.receive, ...addresses.moreReceive].map((entry, index) => ({ ...entry, index })),
      change: [addresses.change, ...addresses.moreChange].map((entry, index) => ({ ...entry, index }))
    };
    checkAddressMatch();

    /* Codes for the two addresses on show and for the descriptor. The folded
       run gets its own inside runInto above -- these are the ones with a fixed
       holder in the markup. */
    /* Nothing is encoded up front. A code costs a version-9 Reed-Solomon pass
       and most derivations never open one, so the strings are parked on the
       buttons and drawn if a button is pressed. */
    qrSources.recv = { text: addresses.receive.address, title: 'First receiving address' };
    qrSources.chng = { text: addresses.change.address, title: 'First change address' };
    $('entropy').textContent = state.seed.entropy;

    /* The spending key for the same account the xpub above describes, in the
       canonical form and, where the address type has one, the SLIP-132 form
       beside it -- the same pairing the public box shows, for the same reason:
       a wallet showing one and a device showing the other do not disagree. */
    /* Depth 0, so no path and no SLIP-132 twin: the typed prefixes describe a
       script type, and this key sits above the level where a script type has
       been chosen. */
    $('master-xprv').textContent = C.encodeXprv(C.masterKey(state.seed.seed));

    const accountNode = C.derive(C.masterKey(state.seed.seed), path);
    $('xprv-path').textContent = path;
    $('xprv').textContent = C.encodeXprv(accountNode);
    const typedPrivVersion = C.ADDRESS_TYPES[state.addressType].xprvVersion;
    const typedPriv = typedPrivVersion && typedPrivVersion !== C.XPRV_VERSION
      ? C.encodeXprv(accountNode, typedPrivVersion) : null;
    $('xprv-alt-row').hidden = !typedPriv;
    if (typedPriv) {
      $('xprv-alt').textContent = typedPriv;
      $('xprv-alt-label').textContent = typedPriv.slice(0, 4);
    }

    /* 12 words are 48 digits and 24 are 96, which the vendored encoder puts in
       a 25x25 and a 29x29 grid -- the sizes SeedSigner's specification states.
       Both are pinned by the test suite rather than asserted from here.

       A length with no stated grid hides the section rather than guessing one.
       The number is a promise about how many squares somebody is about to
       punch into metal, and 18-word support arriving later must add its grid
       deliberately instead of inheriting whichever branch it happened to take.

       Only the digits are written. Nothing is encoded until the button asks,
       and the string lives in qrSources so it leaves with the rest. */
    const SEEDQR_GRIDS = { 12: '25 \u00d7 25', 24: '29 \u00d7 29' };
    const grid = SEEDQR_GRIDS[state.seed.mnemonic.length];
    $('seedqr-block').hidden = !grid;
    if (grid) {
      const digits = C.seedQrDigits(state.seed.mnemonic, WORDLIST);
      const compact = C.compactSeedQrBytes(state.seed.entropy);
      $('seedqr-grid').textContent = grid;
      $('seedqr-digits').replaceChildren(...(digits.match(/.{4}/g) || []).map(group => {
        const cell = document.createElement('span');
        cell.textContent = group;
        return cell;
      }));
      qrSources.seedqr = { text: digits, title: 'SeedQR' };
      qrSources.compactseedqr = {
        bytes: compact, display: C.hex(compact), title: 'CompactSeedQR',
        ecc: qrcodegen.QrCode.Ecc.LOW
      };
    }
    $('type-note').textContent = C.ADDRESS_TYPES[state.addressType].note;
    $('results-loading').hidden = true;
    $('results').hidden = false;
  }

  /* ---- the refusal ---- */

  function raiseAlarm(verdict) {
    $('alarm-reasons').replaceChildren(...verdict.failures.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
    $('alarm').showModal();
  }

  /* ---- wiring ---- */

  /* Leaving the page, by any route -- navigation, closing the tab, the phone
     going to another app and the page being discarded. pagehide fires where
     unload does not on mobile, and unlike unload it does not prevent the page
     entering the back/forward cache.

     pageshow with persisted set means the browser restored a live page rather
     than loading it again: the DOM comes back exactly as it was, results
     included, which is the case that made this necessary.

     Deliberately not visibilitychange. Switching apps to read the instructions
     on a device screen, or to check a note, is a normal thing to do halfway
     through entering ninety-nine rolls, and destroying that work would be a
     bug of our own making rather than a safeguard. */
  addEventListener('pagehide', clearSensitiveState);
  /* Every pageshow, not only the persisted one. bfcache is the case that
     started this, but it is not the only way a browser puts old values back:
     ordinary history restoration and a discarded tab reloaded with its form
     state both repopulate fields without persisted being set. Clearing on a
     fresh load costs nothing -- there is nothing there yet. */
  addEventListener('pageshow', clearSensitiveState);

  document.querySelectorAll('[data-group]').forEach(button => {
    button.addEventListener('click', () => onPick(button.dataset.group, button.dataset.value));
  });
  /* Typing and pasting used to be able to run past the ceiling, leaving a
     count the page would refuse on submit -- found out at the worst moment,
     after entering it all. Trimmed here instead, with the reason shown. */
  $('input').addEventListener('input', () => {
    const raw = $('input').value;
    const trimmed = C.clamp({ method: method(), input: raw, words: state.words });
    if (C.events(method(), raw).length > C.events(method(), trimmed).length) {
      $('input').value = trimmed;
      sayFull();
    } else {
      clearFull();
    }
    paintCount();
    invalidateDerivedState();
  });
  $('distribution').addEventListener('toggle', () => {
    const input = clean();
    paintDistribution(input, C.progress({ method: method(), input, words: state.words }));
  });
  $('path').addEventListener('input', () => {
    state.pathEdited = $('path').value.trim() !== defaultPath();
    if (state.seed) render();
  });
  $('path-reset').addEventListener('click', () => {
    $('path').value = defaultPath();
    state.pathEdited = false;
    if (state.seed) render();
  });
  /* One entry, taken off the normalised string rather than the raw field, so
     undo can never leave behind half of something that was typed. */
  /* One entry back. For cards an entry is two characters, but a half-entered
     card is one, so undo takes the pending rank first and the whole card
     after -- pressing it never leaves a rank stranded without its suit. */
  $('undo').addEventListener('click', () => {
    const current = clean();
    const size = spec().size || 1;
    const back = size === 1 || current.length % size !== 0 ? 1 : size;
    setInput(current.slice(0, -back));
  });
  /* The button says "Clear all", and now it means it: the same path the page
     uses when it is being left, so there is one definition of "cleared" rather
     than two that can drift. */
  $('clear').addEventListener('click', () => {
    clearFull();
    wasFull = false;
    clearSensitiveState();
    setInput('');
  });
  /* <dialog> rather than a hand-rolled overlay: it takes Escape, the backdrop
     and focus handling from the browser, and form method="dialog" closes it
     without a line of script.

     Filled from qrSources rather than from the DOM, so the code is encoded
     from the same string the page derived rather than from text that has been
     through a render and back. */
  for (const button of document.querySelectorAll('[data-qr]')) {
    button.addEventListener('click', () => {
      const source = qrSources[button.dataset.qr];
      const payload = source && (source.bytes || source.text);
      if (!payload || payload.length === 0) return;
      paintQr($('qr-dialog-code'), payload, source.title + ' as a QR code',
        source.ecc, Boolean(source.bytes));
      $('qr-dialog-title').textContent = source.title;
      $('qr-dialog-text').textContent = source.text || ('BIP39 entropy bytes (hex): ' + source.display);
      $('qr-dialog').showModal();
    });
  }

  $('export-private-open').addEventListener('click', () => {
    /* A refusal from a previous attempt is about a wallet that may no longer
       be on screen. Opening the warning again starts from the warning. */
    $('export-private-error').textContent = '';
    $('export-private-dialog').showModal();
  });
  $('export-wallet-open').addEventListener('click', () => {
    $('export-private-error').textContent = '';
    $('export-private-dialog').showModal();
    requestAnimationFrame(() => $('export-wallet-confirm').focus());
  });
  $('export-private-confirm').addEventListener('click', () => prepareExport('private'));
  $('export-wallet-confirm').addEventListener('click', prepareWalletDat);
  $('export-watch').addEventListener('click', () => prepareExport('watch'));

  $('go').addEventListener('click', derive);
  $('alarm-back').addEventListener('click', () => $('alarm').close());
  /* "Clear and start again" after a refusal. The full clear, not just the
     field: the passphrase and anything already derived belong to the sequence
     being abandoned. */
  $('alarm-clear').addEventListener('click', () => {
    $('alarm').close();
    clearSensitiveState();
    $('input').focus();
  });

  /* ---- boot ---- */

  /* Whether a network interface is up, decided before anything slow runs.

     This badge is the only one that appears rather than changing its text, so
     it is the only one that can change the size of the row. Left until after
     the self-test it did exactly that: the vectors take about a second --
     PBKDF2's 2048 rounds are among them -- so the hero painted with three
     badges, sat there, and then grew to two rows when a fourth arrived. The
     status row went 40px to 90px on the copy where this warning actually
     shows, which is the downloaded file on a machine still connected.

     Nothing here needs the vectors, or the network. It reads a flag the
     browser already holds. */
  function paintAdapter() {
    const adapter = $('adapter');
    if (!adapter) return;
    /* Only on the local copy. Served over a network the badge above already
       says the page came from one, and saying it twice in different words
       reads as two problems rather than one fact. */
    adapter.hidden = !(isOffline() && navigator.onLine === true);
  }

  (function watchAdapter() {
    paintAdapter();
    addEventListener('online', paintAdapter);
    addEventListener('offline', paintAdapter);
    /* Chromium fires this when the connection type changes without the
       up/down state changing. Absent in Firefox and Safari, so it is a bonus
       rather than something the behaviour depends on. */
    if (navigator.connection && navigator.connection.addEventListener) {
      navigator.connection.addEventListener('change', paintAdapter);
    }
  })();

  (function boot() {
    const results = runSelfTest();
    const bad = results.filter(r => !r.ok);
    const badge = $('selftest');
    const badgeText = badge.querySelector('[data-status-text]');

    $('vectors').replaceChildren(...results.map(r => {
      const li = document.createElement('li');
      if (!r.ok) li.className = 'bad';
      li.textContent = r.name;
      return li;
    }));

    if (bad.length) {
      badge.className = 'bad';
      badgeText.textContent = 'Self-test FAILED: ' + bad.length + ' of ' + results.length;
      $('go').disabled = true;
      fail('This copy of the page failed its own test vectors, so its output cannot be trusted. '
         + 'Do not use it. Re-download the file and check it against the published checksum.');
      $('go').removeEventListener('click', derive);
      return;
    }

    badge.className = 'good';
    badgeText.textContent = 'Self-test: ' + results.length + '/' + results.length + ' vectors pass';

    /* Served over a network, or opened from disk. This is the one thing the
       page can actually tell about its own situation, and it is weaker than it
       looks -- a local file can sit on a thoroughly connected machine, and this
       cannot tell. So it reports which copy you are on and offers the download,
       and makes no claim about the machine. */
    const offline = isOffline();
    /* Deliberately not a green "safe" state. The old badge said "this copy is
       running offline" in the same green as the passing self-test, which was
       two mistakes at once: it read as an all-clear, and it was not even true
       -- the site build was fetching three resources from Google Fonts while
       saying it. Those are gone now, so the honest claim is about the file
       rather than the machine: it needs no network. Whether the machine has
       one is not something a page can see. */
    /* The badge itself is set during parse, above the fold, so it is never
       laid out at the wrong size. Nothing to repeat here. */
    /* ---- the network adapter -------------------------------------------

       navigator.onLine is a weak signal and is used in one direction only.

       True means the operating system believes an interface is up. That is
       worth saying: this file needs no network, but the machine it is running
       on is a different question, and someone who downloaded the tool
       specifically to be off the network deserves to know the adapter is
       still on. It may be a captive portal or a LAN with no route out -- the
       wording says "reports a connection", not "you are online", because that
       is genuinely all it knows.

       False is never repeated back as reassurance. An interface being down is
       not an air gap: a disabled adapter, a sleeping radio and a machine that
       has never had a network card all look identical from here, and only one
       of them is what the security brief is asking for. So when onLine is
       false this simply says nothing, and the reader is left with the
       instructions rather than a badge implying they are safe.

       No traffic. It reads a flag the browser already holds and listens for
       the events the browser already fires -- a request to some third party
       to "check connectivity" would be the very thing this page promises not
       to do, and it would fail against connect-src 'none' anyway. */
    /* Which panel to show is a question about the file, not the protocol.
       The site page always offers the download, because it is never the thing
       being downloaded. The offline copy never does: the button would be dead
       anyway -- Chrome silently refuses <a download> on file:// URLs -- and
       pointless besides, since you are holding the file. What it shows instead
       is the checksum check, which matters more here than anywhere: this is
       the moment you can confirm the copy on your disk is the published one. */
    $('dl-served').hidden = OFFLINE_BUILD;
    $('dl-hash-served').hidden = OFFLINE_BUILD;
    $('dl-action').hidden = OFFLINE_BUILD;
    $('dl-local').hidden = !OFFLINE_BUILD;
    $('dl-hash-local').hidden = !OFFLINE_BUILD;
    /* Which panel to show is settled by the build; what it says about where
       this copy is running is not. Served over http, this file was still
       telling the reader it was "running from your disk, not the network"
       while the badge above it correctly said the opposite. The path line goes
       with it -- there is nothing useful to print unless it came from disk. */
    if (OFFLINE_BUILD && offline) {
      $('dl-path').textContent = decodeURIComponent(location.pathname).replace(/^\\//, '');
    } else if (OFFLINE_BUILD) {
      $('dl-path').closest('p').hidden = true;
      $('dl-local-head').textContent = 'This is the file to keep';
      $('dl-local-copy').textContent = 'You are reading it over a network, which is fine for a look around. Save it, check it against the published checksum below, and open it from disk on a machine that has never been online before entering any sequence you care about.';
    }
    /* Chrome refuses <a download> when the page itself came from file://, so
       on a local copy of the site page the button cannot save anything -- it
       just follows the link. Rather than leave a button that looks broken, it
       says what it will actually do. Only reachable by previewing the built
       site from disk; over http, where every real visitor meets it, the
       attribute works and this never runs. */
    if (!OFFLINE_BUILD && offline) {
      const button = document.querySelector('a.dl');
      if (button) {
        button.removeAttribute('download');
        button.querySelector('[data-dl-label]').textContent = 'Open offline';
        const note = document.querySelector('[data-dl-note]');
        if (note) note.textContent = 'Already on disk';
      }
    }

    /* A reload starts this page over: the input is cleared, the wallet is gone
       and the results are hidden. Restoring the old scroll position drops the
       reader into the middle of a results panel that no longer has anything in
       it, which reads as the page having broken rather than reset.

       Only when there is no fragment to honour -- #offline below is a link
       people follow deliberately, and the guides point at it. */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    if (location.hash === '#offline') {
      requestAnimationFrame(() => $('offline').scrollIntoView({ block: 'center' }));
    } else if (!location.hash) {
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }

    /* Relative links are right on the site and broken in the downloaded file:
       someone who saved that single file has no guides.html beside it. So the
       offline build rewrites them to point at the site. They only resolve with
       a connection, which is fine -- following one is a decision to leave the
       tool, not something the tool needs. */
    if (OFFLINE_BUILD) {
      const siteRoot = document.querySelector('[data-site-root]').dataset.siteRoot;
      document.querySelectorAll('[data-site-link]').forEach(link => {
        link.href = siteRoot + link.getAttribute('href').replace(/^(\\.\\.\\/)+/, '');
      });
    }

    /* The site build carries its own footer, whose year is handled by
       site-refresh.js, so this element only exists in the offline copy.
       Unguarded it threw and took the rest of init with it -- the keypad, the
       default path and the roll counter all silently stopped being built. */
    const yearEl = $('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    buildPad();
    $('path').value = defaultPath();
    /* Both halves of the cache, not just the seed. Clearing one and leaving
       the other let a passphrase typed and then deleted arrive back at a
       matching key with no seed behind it, and derive() then skipped the work
       and read .options off null. */
    /* Cancelling the 20 ms derivation timer also cancels its finally block.
       Repaint here so an input event in that small window cannot leave the
       button disabled and labelled "Working..." indefinitely. */
    $('passphrase').addEventListener('input', () => {
      invalidateDerivedState();
      paintCount();
    });
    $('address-match').addEventListener('input', checkAddressMatch);
    paintSegments();
    paintSteps();
    paintCount();
  })();
`;

/* Step 1 is the only choice on this page about a physical object rather than
   about a method, so it is the only one with pictures. Drawn as things resting
   on a table -- the coin with real thickness, the die and the card tilted off
   square -- to match what the page asks for two lines above: flip, roll, or
   draw in the physical world.

   Inline rather than linked, because the offline build must carry every byte
   it renders. One 32-unit grid and one stroke weight across all three, so they
   read as a set; colour comes from the button, which dims them until chosen. */
const sourceIcon = body =>
  `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.9"
        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const ICON_COIN = sourceIcon(`
    <path d="M5 13.4v4.6a11 5.2 0 0 0 22 0v-4.6"/>
    <ellipse cx="16" cy="13.4" rx="11" ry="5.2"/>
    <ellipse cx="16" cy="13.4" rx="4.5" ry="2.1" opacity=".55"/>`);

const ICON_DICE = sourceIcon(`
    <g transform="rotate(-9 16 16)">
      <rect x="5.5" y="5.5" width="21" height="21" rx="5.4"/>
      <g fill="currentColor" stroke="none">
        <circle cx="11.2" cy="11.2" r="1.85"/><circle cx="20.8" cy="11.2" r="1.85"/>
        <circle cx="16" cy="16" r="1.85"/>
        <circle cx="11.2" cy="20.8" r="1.85"/><circle cx="20.8" cy="20.8" r="1.85"/>
      </g>
    </g>`);

const ICON_CARDS = sourceIcon(`
    <g transform="rotate(10 16 16)">
      <rect x="9" y="4.4" width="14" height="23.2" rx="3"/>
      <path d="M16 11.3l3.5 4.7-3.5 4.7-3.5-4.7z" fill="currentColor" stroke="none"/>
    </g>`);

/* Bootstrap Icons' filled warning triangle path, inlined because the
   standalone Workshop cannot depend on the site's icon font. */
const warningTriangle = className => `<svg class="${className}" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233C-.292 14.01.256 15 1.145 15h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>`;

const segment = (group, options) => options.map(o => {
  const body = `${o.label}${o.sub ? `<small>${o.sub}</small>` : ''}`;
  return `
            <button type="button" data-group="${group}" data-value="${o.value}" aria-pressed="false">${
    o.icon ? `<span class="seg-mark">${o.icon}</span><span class="seg-body">${body}</span>` : body}</button>`;
}).join('');

/* ---- the two builds ------------------------------------------------------

   One source, two outputs, because this file has two jobs that pull apart.

   Browsed on the site it should look like the site: real header, real
   navigation, real footer. Downloaded and opened on a machine that has never
   been online it must fetch nothing -- which rules out the site's stylesheet,
   its script and its fonts, and so rules out its header and footer with them.

   Serving both from one file gave the worst of each: a hand-drawn header
   close enough to the real one to look broken beside it. So the markup, the
   styles and the logic are shared and only the chrome differs. The tool a
   reader tries in the browser is the tool they download. */

const toolMarkup = ({ offline = false } = {}) => `<section class="hero">
  <div class="wrap hero-shell">
    <nav class="crumb" aria-label="Breadcrumb">
      <a href="guides.html" data-site-link>Guides</a>
      <span aria-hidden="true">&rarr;</span>
      <span>Entropy Workshop</span>
    </nav>
    <div class="hero-heading">
      <div class="hero-copy">
        <span class="eyebrow">Offline-capable tool</span>
        <div class="sc-guide-title-row">
          <span class="sc-die-mark guide-die-mark" aria-hidden="true"></span>
          <h1>Entropy Workshop</h1>
        </div>
        <p class="lead">Flip a coin, roll dice, or draw a card physically &mdash; then see the wallet those events produce. Nothing here generates randomness on its own &mdash; you supply every bit.</p>
        <div class="hero-meta">
          <a class="github-link" href="https://github.com/DeesNeez/selfcustody/blob/main/docs/entropy-offline.html" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.82a7.65 7.65 0 0 1 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
            </svg>
            <span>View source on GitHub</span>
          </a>
          <ul class="status">
            <li id="selftest"><span data-status-text>Running self-test&hellip;</span><span class="status-reserve" aria-hidden="true">Self-test: ${selfTestCount()}/${selfTestCount()} vectors pass</span></li>
            <li id="adapter" class="warn" hidden>This machine reports a network connection</li>
            <!-- Reserving the longer of the two things this badge can end up
                 saying. Without it the badge was laid out for "Checking..." and
                 then grew to nearly three times that the moment the script ran
                 -- 111px to 318px, measured -- which is the jump on load and
                 refresh that the reserve beside the self-test already prevents.
                 The offline wording is the longer one, and either copy can show
                 either message, since the site build opened from disk reports
                 itself as a local file. -->
            <li id="where"><span data-status-text>Checking&hellip;</span></li>${offline
            /* Only the downloaded file makes this claim, because only it can:
               the site page loads a stylesheet, a script and two webfonts. It
               is also the one claim here worth a badge of its own -- "running
               offline" describes where this copy happens to sit, while this
               describes the file, and stays true on a connected machine.

               The site page says nothing in its place. It would only be a
               second way of saying "you are online", which the badge beside it
               already says. */
            ? '\n            <li class="good">No network requests</li>'
            : ''}
          </ul>
          <!-- The adapter badge is the one thing in the hero that appears
               after load rather than with it, and it costs a whole row: the
               hero went 473px to 523px and the glow, positioned at 10% of that
               height, slid down with it. A visible drop and swell on every
               load of a copy opened from disk.

               Both conditions are readable the moment this line is parsed, so
               the state is settled here instead of in the main script at the
               foot of the page. The badge is laid out once, correctly, and the
               hero never resizes. paintAdapter() below owns it from then on,
               for the online and offline events that can still fire.

               Not a class on <html> and a CSS rule, which is the usual shape
               of this: the site build confines the tool's stylesheet to
               .sc-workshop, so a selector rooted outside that wrapper would
               never match. -->
          <script>
            (function () {
              var local = location.protocol === 'file:';

              /* The same reasoning as the adapter badge beside it. This one
                 said "Checking..." until the script at the foot of the page
                 replaced it, which meant a 318px badge becoming a 452px one
                 after first paint -- so it carried a reserve holding the wider
                 measure, and the box sat two-thirds empty while it waited.

                 There was never anything to wait for. It reports which
                 protocol the page was loaded over, which is known the instant
                 this line is parsed. Settled here, the badge is only ever the
                 size of what it actually says: no reserve, no empty box, no
                 growth. "Checking..." survives in the markup as the no-script
                 fallback, which is the only case that can still see it. */
              var where = document.getElementById('where');
              if (where) {
                where.className = local ? '' : 'warn';
                where.querySelector('[data-status-text]').textContent = local
                  ? 'Opened from a local file \u2014 this tool requires no network requests'
                  : 'Loaded over a network \u2014 this copy is online';
              }

              var badge = document.getElementById('adapter');
              if (badge) badge.hidden = !(local && navigator.onLine === true);
            })();
          </script>
        </div>
      </div>
    </div>
  </div>
</section>

<main class="wrap workspace"${offline ? ' data-site-root="https://selfcustody.ca/"' : ''}>

<noscript>
  <div class="banner noscript-brief">
    <p><strong>This tool needs JavaScript, and it is switched off.</strong> Everything here is arithmetic done in your browser &mdash; hashing the rolls, deriving the keys, checking the results against the published test vectors. None of it can run, so the controls below will not respond and no wallet can be shown.</p>
    <p>Nothing is missing from the page and nothing failed to load; there is simply no server doing this work elsewhere, which is the property that makes the tool safe to use offline. Turn JavaScript on for this page, or open it in a browser where it is enabled.</p>
  </div>
</noscript>

<div class="banner security-brief" id="security-brief">
  ${warningTriangle('security-icon')}
  <p><strong>Beta software.</strong> This tool is experimental and should be used only for testing. Do not rely on it to secure real bitcoin, and never test with funds you cannot afford to lose.</p>
  <p class="critical-line"><strong class="critical">Never enter an existing recovery phrase into any page</strong> &mdash; including this one, which is why there is nowhere here to do it.</p>
</div>

<aside class="security-sticky-mobile" id="security-sticky-mobile" aria-label="Beta software warning" hidden>
  <button class="security-sticky-toggle" id="security-sticky-toggle" type="button" aria-expanded="false" aria-controls="security-sticky-panel">
    ${warningTriangle('security-icon')}
    <span class="security-sticky-toggle-label">Beta software</span>
    <span class="security-sticky-chevron" aria-hidden="true"></span>
  </button>
  <div class="security-sticky-panel" id="security-sticky-panel" hidden>
    <p><strong>Beta software.</strong> This tool is experimental and should be used only for testing. Do not rely on it to secure real bitcoin, and never test with funds you cannot afford to lose.</p>
    <p><strong class="critical">Never enter an existing recovery phrase into any page</strong> &mdash; including this one, which is why there is nowhere here to do it.</p>
  </div>
</aside>

<div class="beta-disclaimer" id="beta-disclaimer" role="alertdialog" aria-modal="true" aria-labelledby="beta-disclaimer-title" aria-describedby="beta-disclaimer-copy beta-disclaimer-critical" hidden>
  <div class="beta-disclaimer-card">
    ${warningTriangle('security-icon')}
    <h2 id="beta-disclaimer-title">Before you use the Workshop</h2>
    <p id="beta-disclaimer-copy"><strong>Beta software.</strong> This tool is experimental and should be used only for testing. Do not rely on it to secure real bitcoin, and never test with funds you cannot afford to lose.</p>
    <p class="critical-copy" id="beta-disclaimer-critical"><strong>Never enter an existing recovery phrase into any page</strong> &mdash; including this one, which is why there is nowhere here to do it.</p>
    <button class="beta-disclaimer-accept" id="beta-disclaimer-accept" type="button">I understand</button>
  </div>
</div>

<section class="download" id="offline">
  <div class="download-copy">
    <div id="dl-served"${offline ? ' hidden' : ''}>
      <strong>Run it offline instead</strong>
      <p>The entire tool is this one self-contained file: no external stylesheet, script, font, or network request. Put it on a USB stick and open it on an air-gapped machine, which is where any sequence worth checking belongs &mdash; even a test one.</p>
    </div>
    <div id="dl-local"${offline ? '' : ' hidden'}>
      <strong id="dl-local-head">Running the local copy</strong>
      <p id="dl-local-copy">This self-contained file is running from your disk, not the network. Copy it to a USB stick or an air-gapped machine and it behaves exactly the same. Check it against the published checksum below before you trust anything it shows you.</p>
      <p class="verify">Running from: <code id="dl-path"></code></p>
    </div>

  </div>
  <div class="download-action" id="dl-action"${offline ? ' hidden' : ''}>
    <div class="dl-frame">
      <a class="dl" href="entropy-offline.html" download="selfcustody-entropy-check.html">
        <svg class="dl-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1.5V10.5M8 10.5L4.5 7M8 10.5L11.5 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2.5 13H13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <span data-dl-label>Download</span>
      </a>
    </div>
    <small data-dl-note>{{FILESIZE}} &middot; no installer</small>
  </div>
    <details class="verify-details"${offline ? ' open' : ''}>
      <summary>Verify this file against the published checksum</summary>
      <div class="verify-body">
        <p class="verify">Check that this is the file that was published, rather than whatever happened to arrive:</p>
        <div class="verify-cmds">
          <code>certutil -hashfile entropy-offline.html SHA256</code><span>Windows</span>
          <code>shasum -a 256 entropy-offline.html</code><span>macOS, Linux</span>
      
        <p class="verify" id="dl-hash-served"${offline ? ' hidden' : ''}>Compare that against <a href="entropy-offline.html.sha256">entropy-offline.html.sha256</a>, published beside this page.</p>
        <p class="verify" id="dl-hash-local"${offline ? '' : ' hidden'}>Compare that against the published <code>entropy-offline.html.sha256</code>, which sits beside this page on selfcustody.ca. That one line is the only thing you need the network for, and you can fetch it from anywhere.</p>
    
    </details>
</section>

<div class="workbench-intro">
  <div>
    <span class="eyebrow">Disposable test vector</span>
    <h2>Build the same wallet, independently.</h2>
    <p>Set the conversion your device uses, enter your sequence, and compare the words and addresses side by side. If they disagree, try another conversion before blaming the device.</p>
  </div>
  <div class="step-map" id="step-map" aria-hidden="true"></div>
</div>

<section class="workbench" aria-label="Entropy conversion controls">
<div class="setup-grid">
<fieldset class="setup-wide">
  <legend data-step="1"><span class="step-num">1. </span>Which entropy source?</legend>
  <div class="seg seg-even source-pick">${segment('source', [
    { value: 'coin', label: 'Coins', sub: 'heads or tails (binary)', icon: ICON_COIN },
    { value: 'dice', label: 'Dice', sub: 'six-sided, or octal and hex', icon: ICON_DICE },
    { value: 'cards', label: 'Cards', sub: 'a shuffled deck', icon: ICON_CARDS }
  ])}</div>
  <div class="sub-pick" id="dice-kind" hidden>
    <span>Which dice?</span>
    <div class="seg">${segment('dice', [
      { value: 'd6', label: 'Six-sided' },
      { value: 'octahex', label: 'Octal and hex', sub: 'three dice, one word' }
    ])}</div>
  </div>
  <p class="hint" id="source-note"></p>
</fieldset>

<fieldset class="setup-wide" id="step-conversion">
  <legend data-step="2"><span class="step-num">2. </span><span id="conv-legend">Which conversion method?</span></legend>
  <div class="seg seg-tall" id="conv-dice">${segment('conversion', [
    { value: 'dice', label: 'Hash the rolls', sub: 'COLDCARD, SeedSigner, Krux' },
    { value: 'dicezero', label: 'Hash, 6 as 0', sub: 'Keystone, BIP39 tool' },
    { value: 'dicebits', label: 'Bit table', sub: 'BIP39 tool, raw' },
    { value: 'bitbox', label: 'Lookup table', sub: 'BitBox02' }
  ])}</div>
  <div class="seg seg-tall" id="conv-cards" hidden>${segment('cardconv', [
    { value: 'cards', label: 'Compact hash', sub: 'SHA-256 of AS2CTD' },
    { value: 'cardscoleman', label: 'Ian Coleman hash', sub: 'SHA-256 of A♠ 2♣ T♦' },
    { value: 'cardbits', label: 'Bit table', sub: 'BIP39 tool, card mode' }
  ])}</div>
  <p class="hint" id="matches"></p>
</fieldset>

<fieldset>
  <legend data-step="3"><span class="step-num">3. </span>How many words?</legend>
  <div class="seg">${segment('words', [
    { value: '12', label: '12 words', sub: '128 bits' },
    { value: '24', label: '24 words', sub: '256 bits' }
  ])}</div>
  <p class="hint" id="need"></p>
</fieldset>

<fieldset>
  <legend data-step="4"><span class="step-num">4. </span>Which address type?</legend>
  <div class="seg address-options">${segment('addressType', [
    { value: 'legacy', label: 'Legacy', sub: 'starts 1' },
    { value: 'nested', label: 'Nested', sub: 'starts 3' },
    { value: 'native', label: 'Native SegWit', sub: 'bc1q' },
    { value: 'taproot', label: 'Taproot', sub: 'bc1p' }
  ])}</div>
  <p class="hint">Each has its own <a href="glossary.html#term-derivation_path" data-site-link>derivation path</a>, filled in below.</p>
</fieldset>

<fieldset>
  <legend data-step="5"><span class="step-num">5. </span>Account path</legend>
  <div class="path-row">
    <input type="text" id="path" spellcheck="false" autocomplete="off" aria-label="Account derivation path">
    <button type="button" id="path-reset">Reset</button>
  </div>
  <p class="hint">This is the <a href="glossary.html#term-account_path" data-site-link>account path</a> for <strong>account 0</strong>, the default every wallet opens with. The receiving branch is <code>/0/0</code> and the change branch is <code>/1/0</code> below it. Change the account number if you are checking a different one.</p>
</fieldset>

<fieldset>
  <legend data-step="6"><span class="step-num">6. </span>Passphrase <span class="opt">optional</span></legend>
  <input type="text" id="passphrase" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="Leave blank if none" aria-label="BIP39 passphrase">
  <p class="hint">A word or phrase added when your words become keys, deriving an entirely separate wallet. Nothing records it, so one wrong character opens a wallet that is real, empty, and not yours &mdash; check the <a href="glossary.html#term-master_fingerprint" data-site-link>master fingerprint</a> below.</p>
  <p class="hint">Called the 13th or 25th word, misleadingly: it is neither a word nor from the list. <a href="guides/passphrase-setup.html" data-site-link>BIP39 passphrases</a> covers choosing one, storing it, and when not to bother.</p>
</fieldset>

</div>

<fieldset class="entry-step">
  <legend data-step="7"><span class="step-num">7. </span><span id="rolls-title">Your rolls</span></legend>
  <p class="hint" id="pad-hint"></p>
  <div class="pad" id="pad" role="group" aria-label="Enter each roll in order"></div>
  <div class="pad-tools">
    <button type="button" class="key-tool" id="undo">Undo last</button>
    <button type="button" class="key-tool" id="clear">Clear all</button>
  </div>
  <textarea id="input" spellcheck="false" autocomplete="off" aria-label="Your recorded rolls, flips or cards"></textarea>
  <!-- Cards only. The textarea above is the canonical transcript and the thing
       that gets hashed; this is a reading of it, laid out so a deal can be
       checked against the pile on the table without counting characters. It is
       aria-hidden because it says exactly what the textarea already says. -->
  <div class="deal" id="deal" hidden aria-hidden="true"></div>
  <p class="deck-turn" id="deck-turn" role="status" hidden></p>
  <dialog class="qr-dialog" id="qr-dialog">
    <form method="dialog"><button class="qr-dialog-close" aria-label="Close">&times;</button></form>
    <p class="qr-dialog-title" id="qr-dialog-title"></p>
    <div class="qr-dialog-code" id="qr-dialog-code"></div>
    <p class="qr-dialog-text" id="qr-dialog-text"></p>
  </dialog>

  <div class="count">
    <span id="accepts"></span>
    <b id="count"></b>
  </div>
  <p class="cap-notice" id="cap-notice" role="status" hidden></p>

  <div class="meter" id="meter">
    <div class="meter-head">
      <span>Estimated source entropy</span>
      <b id="meter-val"></b>
    </div>
    <div class="meter-track"><i id="meter-fill"></i></div>
    <p class="meter-note" id="meter-note"><span id="meter-note-base"></span><span class="meter-cap" id="meter-cap" hidden></span></p>
  </div>

  <details class="distribution" id="distribution">
    <summary><span>Inspect die distribution</span><small>optional</small></summary>
    <div class="distribution-body" id="distribution-body" role="status" aria-live="polite"></div>
  </details>
</fieldset>

<button type="button" class="go" id="go" disabled>Produce wallet</button>

<div class="endings" id="endings" hidden>
  <strong>Now pick the last word.</strong>
  <p id="endings-note"></p>
  <div class="ending-direct" id="ending-direct" hidden>
    <div class="ending-face-set">
      <span class="ending-face-label">Octal die</span>
      <div class="ending-face-options" id="ending-octal" role="group" aria-label="Octal die result"></div>
    </div>
    <div class="ending-face-set">
      <span class="ending-face-label">Hex die</span>
      <div class="ending-face-options" id="ending-hex" role="group" aria-label="Hex die result"></div>
    </div>
    <p class="ending-picked" aria-live="polite">
      <span>Final word</span>
      <b id="ending-picked-word"></b>
      <code id="ending-picked-label"></code>
    </p>
  </div>
  <div id="ending-short">
    <div class="ending-list" id="ending-list" role="group" aria-label="Valid final words"></div>
  </div>
  <details class="ending-all" id="ending-all" hidden>
    <summary>Show all 128 possible words</summary>
    <div id="ending-all-slot"></div>
  </details>
</div>

<div class="error" id="error" hidden></div>

<dialog class="alarm" id="alarm" aria-labelledby="alarm-title">
  <div class="alarm-head">
    <div class="alarm-mark" aria-hidden="true">!</div>
    <h2 id="alarm-title">These were not rolled</h2>
  </div>
  <p class="alarm-lede">This page will not turn them into a wallet, because anyone could guess it. Here is what gave it away:</p>
  <ul class="alarm-reasons" id="alarm-reasons"></ul>
  <div class="alarm-note">
    <p>If you really did roll these, then the die or the recording is at fault &mdash; check both, and roll a fresh set.</p>
    <p><strong>The reverse is worth saying too.</strong> Getting past this check does not mean your randomness is good. It only means nothing here looks typed. Real dice produce long runs and odd clusters that feel wrong and are perfectly fine &mdash; never re-roll a result because it looks unrandom to you. That replaces the die's judgement with your own, and yours is predictable.</p>
  </div>
  <div class="alarm-actions">
    <button type="button" class="alarm-primary" id="alarm-clear">Clear and start again</button>
    <button type="button" class="key-tool" id="alarm-back">Back to my entries</button>
  </div>
</dialog>

<section class="results-loading" id="results-loading" role="status" aria-live="polite" hidden>
  <h2>What your sequence produces</h2>
  <p>Updating for the selected ending&hellip;</p>
</section>

<section class="results" id="results" hidden>
  <h2>What your sequence produces</h2>
  <p class="hint">Compare this against your device. If it disagrees, your device may use a different conversion &mdash; that is common and does not mean either is broken.</p>

  <div class="fingerprint" id="fingerprint-box">
    <span class="fp-label">Master fingerprint</span>
    <span class="fp-row">
      <span class="fp-cell"><span class="fp-identity"><img class="fp-lifehash" id="lifehash-base" alt="" hidden><span class="fp-copy"><b id="fp-base"></b><em id="fp-base-tag"></em></span></span></span>
      <span class="fp-cell" id="fp-arrow-wrap" hidden><i class="fp-arrow" aria-hidden="true">&rarr;</i><span class="fp-identity"><img class="fp-lifehash" id="lifehash-pass" alt="" hidden><span class="fp-copy"><b id="fp-pass"></b><em>with passphrase</em></span></span></span></span>
    </span>
    <p class="hint" id="fp-note"></p>
  </div>

  <h3>Recovery words</h3>
  <ol class="words" id="words"></ol>
  <details class="checksum-note" id="checksum-note">
    <summary><span class="checksum-head"><b id="checksum-line"></b><i aria-hidden="true"></i></span></summary>
    <div class="checksum-body">
      <b>What the last word is made of</b>
      <p id="checksum-detail"></p>
    </div>
  </details>

  <!-- One box, because two long xprv strings side by side is how somebody
       copies the wrong one. The master is what is shown: it restores the whole
       wallet and it is the only key here that reproduces the master
       fingerprint. The account key is a level down and needed less often, so
       it is a fold rather than a second slab of text. -->
  <div class="xpub-box xprv-box">
    <div class="label"><span>Private key</span><code>m</code></div>
    <p id="master-xprv"></p>
    <p class="xpub-note">The root of the tree, and the only key here that reproduces the
      <strong>master fingerprint</strong> below. Anything holding it can move every coin this phrase
      will ever control.</p>

    <!-- One disclosure rather than two stacked in the same box. The summary
         names both rather than filing the SeedQR under the account key: a
         SeedQR is the recovery words as digits, not that key, and saying so
         is the difference between a heading and a claim. -->
    <details class="xprv-more" id="xprv-more">
      <summary><span class="xprv-more-head"><b>Show account key and SeedQR</b><i aria-hidden="true"></i></span></summary>
      <div class="xprv-more-body">
        <div class="label"><span>Account path</span><code id="xprv-path"></code></div>
        <p id="xprv"></p>
        <div id="xprv-alt-row" hidden>
          <div class="label"><span>Same key as <b id="xprv-alt-label"></b></span></div>
          <p id="xprv-alt"></p>
        </div>
        <p class="xpub-note">Spends this account and nothing else. It is the level a <b>yprv</b> or
          <b>zprv</b> exists at, so it is what to match against a device showing one.</p>
        <p class="xpub-note">On its own it reports its own fingerprint, not the master one &mdash; it
          cannot see that far up. The descriptor below carries the origin and does.</p>

        <div id="seedqr-block">
          <div class="label"><span>SeedQR recovery code</span></div>
          <p class="xpub-note">The recovery words as numbers: each word&rsquo;s place in the BIP39 list, four digits per word, in the order they appear above. <a href="https://github.com/SeedSigner/seedsigner/blob/dev/docs/seed_qr/README.md" target="_blank" rel="noopener noreferrer">SeedSigner</a> and compatible signing devices scan it. The numeric code is a <b id="seedqr-grid"></b> grid &mdash; the size of the job if you punch it into metal.</p>
          <p class="seedqr-digits" id="seedqr-digits"></p>
          <p class="xpub-note"><b>CompactSeedQR</b> encodes the same BIP39 entropy as smaller binary data. SeedSigner, Krux, Jade and Passport support it; use the numeric SeedQR for COLDCARD Q.</p>
          <p class="xpub-note">Both codes are the phrase in another alphabet, nothing weaker. Anything that reads either one can spend the wallet. If you use a passphrase, enter it separately on the signer after scanning.</p>
          <p class="qr-row seedqr-actions"><button type="button" class="qr-button" data-qr="seedqr">Show numeric SeedQR</button><button type="button" class="qr-button" data-qr="compactseedqr">Show CompactSeedQR</button></p>
        </div>
      </div>
    </details>
  </div>

  <h3>Addresses</h3>
  <p class="hint" id="type-note"></p>
  <!-- The first of each is what a device check needs. The run continues inside
       the same box rather than in one of its own: these are the next addresses
       on this branch, not a separate thing to reason about. -->
  <div class="addr">
    <div class="label"><span>Receiving</span><code id="recv-path"></code></div>
    <p id="recv-addr"></p>
    <p class="qr-row"><button type="button" class="qr-button" data-qr="recv">Show QR</button></p>
    <details class="addr-more">
      <summary aria-label="Show four more receiving addresses"><i aria-hidden="true"></i></summary>
      <ol class="addr-run" id="recv-more"></ol>
    </details>
  </div>
  <div class="addr">
    <div class="label"><span>Change</span><code id="chng-path"></code></div>
    <p id="chng-addr"></p>
    <p class="qr-row"><button type="button" class="qr-button" data-qr="chng">Show QR</button></p>
    <details class="addr-more">
      <summary aria-label="Show four more change addresses"><i aria-hidden="true"></i></summary>
      <ol class="addr-run" id="chng-more"></ol>
    </details>
  </div>

  <div class="address-match">
    <label for="address-match">Check an address</label>
    <input type="text" id="address-match" spellcheck="false" autocomplete="off" placeholder="Paste a bc1, 1, or 3 address">
    <p class="hint">Paste an address shown by another wallet. This page checks receive and change indices 0&ndash;999 for the account path and address type above, entirely offline.</p>
    <p class="hint address-match-status" id="address-match-status" role="status" aria-live="polite"></p>
  </div>

  <div class="xpub-box">
    <div class="label"><span>Account path</span><code id="xpub-path"></code></div>
    <p id="xpub"></p>
    <div id="xpub-alt-row" hidden>
      <div class="label"><span>Same key as <b id="xpub-alt-label"></b></span></div>
      <p id="xpub-alt"></p>
    </div>
    <p class="xpub-note">The public half, and what a watch-only wallet means by your <a href="glossary.html#term-xpub" data-site-link>xpub</a>. It derives every address below and signs nothing, so it cannot move coins &mdash; but it shows your whole balance and history. Not something to post.</p>
    <p class="xpub-note" id="xpub-slip" hidden>Same key, different version bytes. A wallet showing one and a device showing the other do not disagree.</p>
  </div>

  <div class="xpub-box descriptor-box">
    <div class="label"><span>Watch-only descriptor</span><code><a href="https://github.com/bitcoin/bips/blob/master/bip-0380.mediawiki" target="_blank" rel="noopener noreferrer">BIP380</a> &middot; <a href="https://github.com/bitcoin/bips/blob/master/bip-0389.mediawiki" target="_blank" rel="noopener noreferrer">BIP389</a></code></div>
    <p id="descriptor"></p>
    <p class="qr-row"><button type="button" class="qr-button" data-qr="descriptor">Show QR</button></p>
    <p class="xpub-note">The account key in the form wallets take directly &mdash; Sparrow, Bitcoin Core, most coordinators. Naming the script type is what stops it being imported as the wrong one, the mistake that makes a restored wallet look empty.</p>
    <p class="xpub-note"><code>&lt;0;1&gt;</code> covers receiving and change together. The eight characters after the <code>#</code> are a checksum, so a mistyped line is caught rather than silently watching the wrong account. No private key; signs nothing.</p>
    <details class="descriptor-split">
      <summary>If your wallet will not accept it</summary>
      <div class="body">
        <p>The <code>&lt;0;1&gt;</code> form comes from BIP389, which is still a draft. Sparrow and current Bitcoin Core read it; older software may not, and will usually say the descriptor is malformed rather than guess. If that happens, import these two instead &mdash; receiving first, then change. They describe the same wallet.</p>
        <p class="split-line"><span>Receiving</span><code id="descriptor-recv"></code></p>
        <p class="split-line"><span>Change</span><code id="descriptor-chng"></code></p>
      </div>
    </details>
  </div>

  <h3>Export records</h3>
  <p class="hint export-intro">Two plain-text files for two different jobs. The private one restores and spends; the watch-only one cannot spend, but still reveals the wallet&rsquo;s addresses and history.</p>
  <div class="export-grid">
    <article class="export-card is-private">
      <span class="export-tag">Keep secret</span>
      <h4>Private recovery record</h4>
      <p>Recovery words, SeedQR digits, fingerprints, paths and private keys. It records whether a BIP39 passphrase was used, but never includes the passphrase value.</p>
      <button type="button" class="export-button" id="export-private-open">Review and download</button>
      <button type="button" class="export-button" id="export-wallet-open">Download Bitcoin Core wallet.dat</button>
    </article>
    <article class="export-card is-watch">
      <span class="export-tag">No spending keys</span>
      <h4>Watch-only record</h4>
      <p>Account public keys, checked descriptors and the first five addresses on each branch. Safe from spending, not private from balance and history.</p>
      <button type="button" class="export-button" id="export-watch">Download watch-only record</button>
    </article>
  </div>
  <p class="export-status" id="export-status" role="status" aria-live="polite"></p>

  <dialog class="export-dialog" id="export-private-dialog" aria-labelledby="export-private-title">
    <form method="dialog">
      <button class="export-dialog-close" value="cancel" aria-label="Close">&times;</button>
      <h2 id="export-private-title">These files can spend the wallet</h2>
      <p>The private text record contains the recovery words, SeedQR digits and private keys shown above. The Bitcoin Core wallet.dat contains the selected account private key and its receiving and change descriptors. Anyone who gets either file can move the coins it controls.</p>
      <p><strong>The generated wallet.dat is not encrypted.</strong> Put it in a new, dedicated Bitcoin Core wallet directory. Never replace or overwrite an existing wallet.dat file.</p>
      <p><strong>Download it only on the offline computer</strong>, then move it directly to the protected backup storage you chose. Do not put it in cloud storage, email or chat.</p>
      <p>The BIP39 passphrase value is deliberately left out of both files. The private text record says whether one was used; the wallet.dat already contains the account derived with it.</p>
      <p class="export-dialog-error" id="export-private-error" role="alert"></p>
      <div class="export-dialog-actions">
        <button type="button" class="export-button" id="export-private-confirm">Download private record</button>
        <button type="button" class="export-button" id="export-wallet-confirm">Download Bitcoin Core wallet.dat</button>
        <button type="submit" class="key-tool" value="cancel">Cancel</button>
      </div>
    </form>
  </dialog>

  <details>
    <summary>Show the raw entropy</summary>
    <div class="body">
      <p>The number your rolls became, before it was written out as words:</p>
      <p><code id="entropy"></code></p>
    </div>
  </details>

</section>
</section>

<details class="method-note">
  <summary>Why coins, dice and cards are treated differently</summary>
  <div class="body">
    <p>A coin gives exactly one bit, so 256 flips are 256 bits and go straight in unchanged. You can check that mapping by hand.</p>
    <p>A six-sided die face carries log&#8322;(6) = 2.58 bits, which is not a whole number, so the rolls are hashed with SHA-256 instead and the result used as the entropy. That is what COLDCARD, SeedSigner, Krux and Gordian all do, and it is why 99 rolls is the number you see everywhere.</p>
    <p>Three dice at once sidestep the problem rather than solving it. Eight faces is three bits and sixteen is four, so an octal die and two hex dice throw 3 + 4 + 4 = 11 bits together &mdash; which is one word index exactly, with no remainder to hash away and no bias to correct. A 24-word seed takes 23 throws of all three dice, then one final octal throw to select among eight checksum-valid endings. A 12-word seed takes 11 three-dice throws, then one octal and one hex die to select among 128 endings. The printed dictionary names every word directly; the six-sided-die method instead needs 99 rolls and calculates a checksum you cannot see.</p>
    <p>Cards shorten as you draw them, which no other source here does. The first card is one of 52 and worth log&#8322;(52) = 5.70 bits, the next one of 51, and so on &mdash; so a whole deck is 225.6 bits rather than 52 &times; 5.70, and one deck cannot fill a 24-word seed. Shuffle it and keep drawing. All three conversions above use every card: the two hash modes encode the same draw differently before SHA-256, while the bit-table mode reads the BIP39 tool&rsquo;s codes, which run two, four or five bits long depending on the card.</p>
    <p><strong>There is no standard here.</strong> Four of the conversions in use are offered above, and they disagree with each other on purpose: hashing the digits as rolled, hashing them after rewriting every 6 to a 0, reading them as bits without hashing at all, and looking each word up in a table. The same column of rolls produces four unrelated wallets. Others are not offered &mdash; BlueWallet packs bits its own way, and SeedSigner used a different method before February 2022 &mdash; so a mismatch against all four still does not mean your device is broken.</p>
    <p>Which is the point worth leaving with. Your recovery words are the backup. The column of rolls, flips or cards in your notebook is not, because what you wrote down does not say which of these conversions produced the wallet.</p>
  </div>
</details>

<details>
  <summary>How this page was checked</summary>
  <div class="body">
    <p>The conversion, hashing, encoding and wallet-format code follows the published specifications. Public-key and Taproot curve operations use Bitcoin Core&rsquo;s libsecp256k1 compiled to WebAssembly. The surrounding code and its library bridge can still be subtly wrong, so on load the page runs published test vectors and refuses to produce anything if they do not pass:</p>
    <ul class="vectors" id="vectors"></ul>
    <p>The values come from FIPS 180-4, RFC 4231, BIP380, and the test vectors published in BIP32, BIP39, BIP84 and BIP86. None was produced by running this code.</p>
  </div>
</details>

<details id="sources">
  <summary>Sources</summary>
  <div class="body">
    <p>This page claims that four named devices convert dice four different ways, and refuses to show a wallet unless it agrees with published test vectors. Both are checkable, so here is everything they rest on. Nothing below was written by this project.</p>
    <p>These open in a new tab, because leaving this one would lose the rolls you have entered. They need a connection, which the tool itself never does.</p>

    <div class="src-group">
      <h3>The conversions</h3>
      <ul class="src-list">
        <li>
          <b>Hash the rolls</b>
          <div>
            <a href="https://coldcard.com/docs/verifying-dice-roll-math/" target="_blank" rel="noopener noreferrer">COLDCARD &mdash; Verifying dice roll math</a>
            <span>States the method outright &mdash; SHA-256 over the rolls as an ASCII string &mdash; and gives the 50 and 99 roll counts this page uses. Its worked example is one of the vectors in the self-test.</span>
          </div>
        </li>
        <li>
          <b>Hash, 6 as 0</b>
          <div>
            <a href="https://blog.keyst.one/how-to-verify-the-recovery-phrase-created-by-dice-rolling-af01c16b765e" target="_blank" rel="noopener noreferrer">Keystone &mdash; Verifying a phrase created by dice rolling</a>
            <span>Keystone does not publish the mapping. It tells you to check against the BIP39 HTML tool with <em>Dice entropy</em> and <em>24 words</em> set, and the source below is what that setting does: rewrite every 6 to a 0, then hash. The attribution here is that chain, not a claim from Keystone directly.</span>
          </div>
        </li>
        <li>
          <b>Bit table</b>
          <div>
            <a href="https://github.com/iancoleman/bip39/blob/master/src/js/entropy.js" target="_blank" rel="noopener noreferrer">BIP39 HTML tool &mdash; entropy.js</a>
            <span>The <code>base 6 (dice)</code> table and the 6-to-0 rewrite before it. Read it with <a href="https://github.com/iancoleman/bip39/blob/master/src/js/index.js" target="_blank" rel="noopener noreferrer">index.js</a>, which chooses between two behaviours: a fixed word count hashes, while <em>raw</em> uses the table and keeps the last whole 32 bits. Same rolls, different wallets, which is why both are offered above.</span>
          </div>
        </li>
        <li>
          <b>Lookup table</b>
          <div>
            <a href="https://bitbox.swiss/bitbox02/BitBox_Diceware_LookupTable.pdf" target="_blank" rel="noopener noreferrer">BitBox02 &mdash; Diceware lookup table</a>
            <span>All 2048 words as printed. This page&rsquo;s index arithmetic was checked against every cell of it, not a sample. The <a href="https://bitbox.swiss/bitbox02/BitBox_Diceware_HowTo.pdf" target="_blank" rel="noopener noreferrer">procedure document</a> gives the layout &mdash; first die the page, next three the row, fifth die and the coin the column &mdash; and the rule that 23 words are rolled and the last is chosen.</span>
          </div>
        </li>
        <li>
          <b>Octal and hex dice</b>
          <div>
            <a href="https://entropy.page/dice" target="_blank" rel="noopener noreferrer">entropy.page &mdash; Roll Your Own Seed Phrase</a>
            <span>D++ and Keysa&rsquo;s workshop, where this method comes from. Their
              <a href="https://entropy.page/files/dictionary.pdf" target="_blank" rel="noopener noreferrer">dictionary</a>
              is the specification and the one to print &mdash; it runs 100 to 8FF, which is why the octal die is read as 1 to 8. Cells checked against it end to end. The
              <a href="https://thesimplestbitcoinbook.net/wp-content/uploads/2023/09/Roll-Your-Own-Seed-Phrase-PDF.pdf" target="_blank" rel="noopener noreferrer">slide deck</a>
              has the procedure.</span>
          </div>
        </li>
        <li>
          <b>Coin flips</b>
          <div>
            <span>Nothing to cite. A flip is one bit, the bits are packed in the order you made them, and the whole mapping can be checked by hand against the raw entropy above.</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="src-group">
      <h3>The specifications</h3>
      <ul class="src-list">
        <li>
          <b>Words and seeds</b>
          <div>
            <a href="https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki" target="_blank" rel="noopener noreferrer">BIP39</a>
            <span>Entropy to words, the checksum that fixes the last one, the passphrase that changes the seed without changing the words, and the wordlist itself.</span>
          </div>
        </li>
        <li>
          <b>Keys from a seed</b>
          <div>
            <a href="https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki" target="_blank" rel="noopener noreferrer">BIP32</a>
            <span>The derivation run to reach an address, and the vectors the page checks itself against on load.</span>
          </div>
        </li>
        <li>
          <b>Address types</b>
          <div>
            <a href="https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki" target="_blank" rel="noopener noreferrer">BIP44</a>,
            <a href="https://github.com/bitcoin/bips/blob/master/bip-0049.mediawiki" target="_blank" rel="noopener noreferrer">BIP49</a>,
            <a href="https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki" target="_blank" rel="noopener noreferrer">BIP84</a>,
            <a href="https://github.com/bitcoin/bips/blob/master/bip-0086.mediawiki" target="_blank" rel="noopener noreferrer">BIP86</a>
            <span>One per type, each giving both the standard path filled in above and the receive and change addresses used as vectors.</span>
          </div>
        </li>
        <li>
          <b>Address encoding</b>
          <div>
            <a href="https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki" target="_blank" rel="noopener noreferrer">BIP173</a>,
            <a href="https://github.com/bitcoin/bips/blob/master/bip-0350.mediawiki" target="_blank" rel="noopener noreferrer">BIP350</a>
            <span>bech32 and bech32m, which turn a public key into the <code>bc1</code> strings shown above.</span>
          </div>
        </li>
        <li>
          <b>Hashes</b>
          <div>
            <a href="https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf" target="_blank" rel="noopener noreferrer">FIPS 180-4</a>,
            <a href="https://homes.esat.kuleuven.be/~bosselae/ripemd160.html" target="_blank" rel="noopener noreferrer">RIPEMD-160</a>
            <span>SHA-256 and SHA-512 from the first, RIPEMD-160 from its authors. Both are written out in this file rather than imported, and both are pinned by vectors from these documents.</span>
          </div>
        </li>
        <li>
          <b>HMAC and PBKDF2</b>
          <div>
            <a href="https://www.rfc-editor.org/rfc/rfc4231" target="_blank" rel="noopener noreferrer">RFC 4231</a>,
            <a href="https://www.rfc-editor.org/rfc/rfc2898" target="_blank" rel="noopener noreferrer">RFC 2898</a>
            <span>The 2048 rounds standing between your words and your seed, and the vectors showing this file runs them correctly.</span>
          </div>
        </li>
      </ul>
    </div>

    <p class="src-tail">The Bitcoin Core wallet.dat encoder is adapted from <a href="https://github.com/w-s-bitcoin/entropylab/pull/32" target="_blank" rel="noopener noreferrer">EntropyLab pull request #32</a>, whose generated descriptor wallets were checked against Bitcoin Core 28.3.0. Used under the MIT License.</p>
    <p class="src-tail">Ian Coleman-compatible card hashing is adapted from merged <a href="https://github.com/w-s-bitcoin/entropylab/pull/89" target="_blank" rel="noopener noreferrer">EntropyLab pull request #89</a>. It remains a separate conversion because its spaced suit-symbol transcript must not be confused with the Workshop's compact ASCII hash.</p>
    <p class="src-tail">Visual fingerprints use <a href="https://lifehash.info/" target="_blank" rel="noopener noreferrer">LifeHash version2</a>, adapted from merged <a href="https://github.com/w-s-bitcoin/entropylab/pull/74" target="_blank" rel="noopener noreferrer">EntropyLab pull request #74</a> and the Blockchain Commons reference implementation. Used under the MIT License.</p>
    <p class="src-tail">The optional die-distribution inspector adapts the Pearson chi-square idea from merged <a href="https://github.com/w-s-bitcoin/entropylab/pull/36" target="_blank" rel="noopener noreferrer">EntropyLab pull request #36</a>. Its disclosure, histogram, threshold and wording are original to this Workshop.</p>
    <p class="src-tail">Public-key and Taproot curve operations use Bitcoin Core&rsquo;s libsecp256k1 compiled to WebAssembly, adapted from merged <a href="https://github.com/w-s-bitcoin/entropylab/pull/103" target="_blank" rel="noopener noreferrer">EntropyLab pull request #103</a>. The pinned source, build recipe and artifact checksum ship with this site.</p>
    <p class="src-tail">The per-release beta acknowledgement adapts merged <a href="https://github.com/w-s-bitcoin/entropylab/pull/106" target="_blank" rel="noopener noreferrer">EntropyLab pull request #106</a>. Its compact mobile warning is specific to this Workshop.</p>
    <p class="src-tail">Inspired partly by <a href="https://entropylab.online/" target="_blank" rel="noopener noreferrer">EntropyLab</a> and <a href="https://miguelmedeiros.github.io/entropy/" target="_blank" rel="noopener noreferrer">Entropy Workbench</a>.</p>

    <p>One thing above has no source: the refusal you get when a sequence looks typed rather than rolled. That check is ours, its thresholds come from simulated rolls rather than a specification, and it is a spellcheck &mdash; not a randomness test.</p>
  </div>
</details>

<p class="colophon">Part of <strong>SelfCustody.ca</strong>. The full procedure and the rules that matter more than this tool does are in <a href="guides/dice-entropy.html" data-site-link>Roll the dice</a> and <a href="guides/quickstart.html" data-site-link>Intro to Self Custody</a>. How to read this page itself is in <a href="guides/bring-your-own-entropy.html" data-site-link>Bring Your Own Entropy</a>.</p>

</main>`;

const toolScripts = ({ preflight, secpWasmB64, secpWasm, betaWarning, core, lifehash, sqliteWriter, walletDat, qrlib, wordlist, offline }) => `<script>
${preflight}
</script>
<script>
${secpWasmB64.replace('export const SECP256K1_WASM_B64', 'const SECP256K1_WASM_B64')}
</script>
<script>
${secpWasm}
</script>
<script>
${betaWarning}
</script>
<script>
${core}
</script>
<script>
${lifehash}
</script>
<script>
${sqliteWriter}
</script>
<script>
${walletDat}
</script>
<script>
${qrlib}
</script>
<script>
'use strict';
(function () {
  if (window.__entropyWorkshopPreflightPassed !== true) return;
  EntropySecp256k1Ready.then(() => {
    const OFFLINE_BUILD = ${offline};
    const C = EntropyCore;
    const WORDLIST_RAW = '${wordlist}';
    EntropyBetaWarning.init({ version: '${ENTROPY_RELEASE}' });
${selfTest()}
${ui()}
  }).catch(() => {
    window.__entropyWorkshopPreflightPassed = false;
    document.documentElement.dataset.browserFailed = '1';
    const workspace = document.querySelector('.workspace');
    if (!workspace) return;
    workspace.innerHTML = '<section class="sanity-failure" role="alert">'
      + '<div class="sanity-failure-card">'
      + '<div class="sanity-failure-icon" aria-hidden="true">&times;</div>'
      + '<h1>Cryptography engine failed to start</h1>'
      + '<p>This browser could not initialize libsecp256k1. No wallet was produced.</p>'
      + '<p class="sanity-failure-advice">Open this file in a current Firefox, Chrome, Edge or Safari browser on the trusted offline computer.</p>'
      + '</div></section>';
  });
})();
</script>`;

/* Measured against the assembled file rather than hand-maintained, so it can
   never drift from what a reader receives. Rounded to the nearest 10 KB, which
   absorbs the bytes the number itself adds to the string describing it. */
const withFileSize = html => {
  /* Measure the bytes we actually publish. Source files can be checked out
     with CRLF on Windows, but render.mjs writes this artifact LF-only. Using
     the pre-normalized string length made the rounded label flip between
     ~440 KB and ~450 KB across operating systems; because the label is inside
     the file, that also changed the checksum it was meant to describe. */
  const normalized = html.replace(/\r\n/g, '\n');
  return normalized.replace(
    '{{FILESIZE}}',
    `~${Math.round(Buffer.byteLength(normalized, 'utf8') / 1024 / 10) * 10} KB`
  );
};

const payload = () => ({
  preflight: readFileSync(PREFLIGHT, 'utf8'),
  secpWasmB64: readFileSync(SECP_WASM_B64, 'utf8'),
  secpWasm: readFileSync(SECP_WASM, 'utf8'),
  betaWarning: readFileSync(BETA_WARNING, 'utf8'),
  core: readFileSync(CORE, 'utf8'),
  lifehash: readFileSync(LIFEHASH, 'utf8'),
  sqliteWriter: readFileSync(SQLITE_WRITER, 'utf8'),
  walletDat: readFileSync(WALLET_DAT, 'utf8'),
  qrlib: readFileSync(QRLIB, 'utf8'),
  wordlist: readFileSync(WORDS, 'utf8').trim().split(/\r?\n/).join(' ')
});

/* The downloadable artifact: everything inlined, nothing fetched, and no
   navigation -- links that only resolve with a connection are noise in a file
   whose whole purpose is working without one. What replaces them is what an
   air-gapped reader actually needs: what this file is, and how to prove it. */
export function renderEntropyOffline() {
  return withFileSize(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline' 'wasm-unsafe-eval'; font-src data:; img-src data:; form-action 'none'; base-uri 'none'">
  <meta name="referrer" content="no-referrer">
  <!-- The links in this file are documentation, and the request guard treats
       an anchor as inert because clicking is a decision. Browsers do not
       entirely agree: Chromium resolves hostnames for links it can see, before
       anything is clicked, which would put this file's reading list into a DNS
       log on a machine chosen for having no traffic at all. Off, and declared
       before any link appears. -->
  <meta http-equiv="x-dns-prefetch-control" content="off">
<meta name="robots" content="noindex">
<title>Entropy Workshop | SelfCustody.ca</title>
<style>${styles()}</style>
</head>
<body class="is-offline-copy">

<header class="file-banner">
  <div class="wrap file-banner-inner">
    <span class="brand-mark" aria-hidden="true"></span>
    <div>
      <strong>Entropy Workshop</strong>
      <span>A single file from selfcustody.ca. It fetches nothing, and works with the network off.</span>
    </div>
  </div>
</header>

${toolMarkup({ offline: true })}

<footer class="file-footer">
  <div class="wrap">
    <p class="file-footer-note"><strong>Never type an existing recovery phrase into any page</strong>, including this one &mdash; which is why there is nowhere here to do it. This file is education, not financial advice.</p>
    <p class="file-footer-note">Published at selfcustody.ca/entropy-offline.html, where the checksum sits beside it &middot; &copy; <span id="year">2026</span> SelfCustody.ca</p>
  </div>
</footer>

${toolScripts({ ...payload(), offline: true })}
</body>
</html>
`);
}

/* The pieces the site build drops into an ordinary page. The tool's styles are
   confined to a wrapper so they cannot reach the header and footer around
   them -- it styles bare `a`, `body`, `main` and `h1`, which would otherwise
   restyle the whole page. See build/tools/scope-css.mjs. */
export function renderEntropyEmbed() {
  return {
    styles: scopeCss(styles(), '.sc-workshop'),
    markup: `<div class="sc-workshop">\n${toolMarkup()}\n</div>`,
    scripts: toolScripts({ ...payload(), offline: false }),
    /* The site page has no {{FILESIZE}} of its own to report -- it is the
       offline file's size that matters on the download button -- so it is
       measured from that build. */
    downloadSize: `~${Math.round(renderEntropyOffline().length / 1024 / 10) * 10} KB`
  };
}

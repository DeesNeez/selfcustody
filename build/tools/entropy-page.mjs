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
const WORDS = 'build/tools/bip39-english.txt';

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
  /* Sits under a full-width row of four evenly spaced buttons, where a
     left-aligned single line reads as though it fell out of the row. */
  .hint-centred { text-align: center; }

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
  .xpub-box p {
    margin: 8px 0 0; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.86rem; line-height: 1.55; color: var(--ink); word-break: break-all;
  }
  .xpub-box .label { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .xpub-box .label span {
    color: var(--muted); font-size: 0.72rem; font-weight: 800;
    letter-spacing: 0.12em; text-transform: uppercase;
  }
  .xpub-box .label b { color: #ffad4c; }
  .xpub-box #xpub-alt-row { margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
  /* One long unbroken token with punctuation the browser will happily break
     at the wrong place, so it wraps anywhere rather than pushing the panel
     wide. Same treatment the account key already gets. */
  .descriptor-box #descriptor { overflow-wrap: anywhere; word-break: break-all; }
  .xpub-note {
    font-family: inherit !important; color: var(--muted) !important;
    font-size: 0.85rem !important; margin-top: 12px !important; word-break: normal !important;
  }

  /* ---- the eight endings ------------------------------------------------
     Only the lookup method reaches this. It sits between the button and the
     results because it is a step, not an outcome: nothing downstream is a
     wallet until one of these is chosen. */
  .endings {
    margin-top: 22px; padding: 20px 22px;
    border: 1px solid rgba(255, 138, 0, 0.3); border-radius: 14px;
    background: rgba(255, 138, 0, 0.05);
  }
  .endings strong { display: block; margin-bottom: 8px; color: #ffad4c; font-size: 1.02rem; }
  .endings p { margin: 0 0 16px; color: var(--ink-soft); font-size: 0.92rem; line-height: 1.6; }
  .ending-list { display: flex; flex-wrap: wrap; gap: 8px; }
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
  @media (prefers-reduced-motion: reduce) { .meter-track i { transition: none; } }

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
  .pad[data-method="cards"], .pad[data-method="cardbits"] {
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

  /* Shown either way, saying different things: served, it offers the download;
     from a local file it confirms which file you are running and keeps the
     checksum check, which is the one moment that check is genuinely useful.
     It sits above the controls rather than below the results, because whether
     to run this online or offline is a decision you want to make before you
     start typing rolls in, not after. */
  .download {
    display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 28px;
    align-items: center;
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
  .download-copy .verify { margin: 0 0 6px; color: var(--muted); font-size: 0.85rem; }
  .download-copy .verify:last-child { margin-bottom: 0; }
  .download-copy code {
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
  .download-copy a { color: var(--orange); }


  .verify-details { margin: 12px 0 0; }
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

  .download-action { display: grid; gap: 8px; justify-items: center; min-width: 205px; }

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
    color: var(--ink); text-decoration: none;
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
  .dl:hover {
    background:
      linear-gradient(135deg, #ffab38, #df6900) padding-box,
      linear-gradient(135deg, #ffe0b5, #9b4000) border-box;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 12px 30px rgba(255, 122, 0, 0.3);
    transform: translateY(-2px);
  }
  .dl::after {
    position: absolute; z-index: 1; top: -45%; bottom: -45%; left: -32%; width: 24%;
    background: linear-gradient(90deg, transparent, rgba(255, 245, 224, 0.52), transparent);
    content: ""; opacity: 0; transform: skewX(-18deg) translateX(-180%);
    transition: transform 0.72s cubic-bezier(0.2, 0.72, 0.22, 1), opacity 0.18s ease;
  }
  .dl:hover::after { opacity: 1; transform: skewX(-18deg) translateX(680%); }
  /* Above the sweep. The shine is a positioned box at z-index 1 and the label
     was in normal flow beneath it, so hovering wiped the text as the band
     crossed -- worst on the longest label, "Open the offline file", which the
     band covers most of. The light passes behind the words now. */
  .dl > * { position: relative; z-index: 2; }
  .dl-icon { flex: 0 0 auto; display: block; }
  .download-action small { color: var(--muted); font-size: 0.75rem; }

  @media (max-width: 620px) {
    .download { grid-template-columns: 1fr; gap: 16px; }
    .download-action { justify-items: stretch; }
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

  .addr { margin-top: 10px; padding: 14px 16px; background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; }
  .addr .label { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px;
                 font-size: 0.75rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; }
  .addr .label span { color: var(--orange-dark); }
  .addr .label code { color: var(--muted); font-size: 0.75rem; letter-spacing: 0; text-transform: none; }
  .addr p { margin: 8px 0 0; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            font-size: 0.95rem; color: #fff; word-break: break-all; line-height: 1.5; }

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
    display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
    align-items: center; gap: clamp(28px, 5vw, 56px);
  }
  .hero-copy { min-width: 0; }
  .hero .crumb { margin-bottom: 18px; }
  .hero .eyebrow {
    display: inline-flex; align-items: center; gap: 9px; margin-bottom: 10px;
    color: #ffad4c; letter-spacing: 0.18em;
  }
  .hero .eyebrow::before { content: ""; width: 25px; height: 1px; background: var(--orange); }
  .hero h1 { max-width: 660px; margin-bottom: 14px; font-size: clamp(2.75rem, 5vw, 3.8rem); letter-spacing: -0.035em; }
  .hero .lead { max-width: 660px; font-size: clamp(0.98rem, 1.35vw, 1.08rem); line-height: 1.55; }
  .hero .status { margin-top: 20px; gap: 7px; }
  .hero .status li {
    position: relative; padding: 6px 11px 6px 28px; border-radius: 999px;
    background: rgba(8, 8, 8, 0.28); backdrop-filter: blur(4px);
  }
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

  .entropy-visual {
    padding: 18px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 15px;
    background: rgba(12, 12, 12, 0.42);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.055), 0 18px 44px rgba(0, 0, 0, 0.28);
  }
  .visual-top {
    display: grid; grid-template-columns: 50px minmax(0, 1fr); align-items: center; gap: 14px;
    padding-bottom: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  }
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
  .visual-heading strong { display: block; color: #fff; font: 600 1.08rem/1.2 "Jost", sans-serif; }
  .visual-heading span { display: block; margin-top: 4px; color: var(--muted); font-size: 0.72rem; line-height: 1.4; }
  .entropy-code {
    display: grid; gap: 6px; margin: 14px 0 12px; padding: 10px 12px;
    color: #b9b2a7; background: rgba(0, 0, 0, 0.28); border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.63rem; line-height: 1.2; letter-spacing: 0.055em;
  }
  .entropy-code span { display: flex; justify-content: space-between; gap: 10px; }
  .entropy-code em { color: var(--orange); font-style: normal; }
  .entropy-code b { color: #8be3c6; font-weight: 600; }
  .visual-flow { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 7px; }
  .visual-flow span {
    padding: 7px 5px; color: #c7c0b6; border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 9px; background: rgba(255,255,255,.035); text-align: center;
    font-size: 0.66rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .visual-flow i { color: var(--orange); font-style: normal; }
  .workspace { padding-bottom: 56px; }
  .security-brief {
    position: relative; margin: -22px 0 16px; padding: 20px 22px 20px 68px;
    border-color: rgba(255, 138, 0, 0.46); border-radius: 16px;
    background: linear-gradient(135deg, #29231d, #211f1c);
    box-shadow: 0 18px 44px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.05);
  }
  .security-brief::before {
    content: "!"; position: absolute; left: 20px; top: 20px; display: grid; place-items: center;
    width: 32px; height: 32px; color: #241300; background: var(--orange); border-radius: 10px;
    font-family: "Jost", sans-serif; font-size: 1.2rem; font-weight: 800;
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
  .workbench .results { margin-top: 32px; padding: 28px; border: 1px solid rgba(53,180,138,.32); border-radius: 16px; background: linear-gradient(150deg, rgba(53,180,138,.07), rgba(53,180,138,.025)); box-shadow: inset 0 1px 0 rgba(255,255,255,.04); }
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
    .hero-shell { grid-template-columns: 1fr; gap: 28px; }
    .hero h1 { font-size: clamp(2.8rem, 9vw, 3.8rem); }
    .entropy-visual { width: min(100%, 560px); }
    .security-brief { margin-top: -20px; }
    .workbench-intro { grid-template-columns: 1fr; gap: 12px; }
    .setup-grid { grid-template-columns: 1fr; }
    .workbench .setup-grid .setup-wide { grid-column: auto; }
  }
  @media (max-width: 620px) {
    .wrap { padding-inline: 18px; }
    .hero { padding: 34px 0 40px; }
    .hero .crumb { margin-bottom: 18px; }
    .hero h1 { font-size: clamp(2.45rem, 13vw, 3.35rem); }
    .hero .status { display: grid; }
    .entropy-visual { padding: 20px; border-radius: 16px; }
    .visual-top { grid-template-columns: 54px minmax(0, 1fr); gap: 14px; }
    .guide-die-mark { width: 54px; height: 54px; border-radius: 14px; }
    .visual-flow { gap: 4px; }
    .visual-flow span { padding: 8px 4px; font-size: .58rem; }
    .security-brief { margin-top: -16px; padding: 58px 18px 18px; }
    .security-brief::before { left: 18px; top: 16px; }
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

  .vectors { margin: 10px 0 0; padding: 0; list-style: none; font-family: ui-monospace, monospace; font-size: 0.78rem; }
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
const selfTest = () => `
  /* Every expected value here is from a published specification: FIPS 180-4,
     RFC 4231, and the test vectors in BIP32, BIP39, BIP84 and BIP86. None of
     them was produced by running this code. */
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
    ['Dice bit table codes', () => C.diceBits('123456'), '0110110100'],
    ['Dice with 6 as 0', () => C.hex(C.METHODS.dicezero.entropy('123456', 16)),
      C.hex(C.sha256(C.utf8('123450')).slice(0, 16))]
  ];

  const ABANDON = 'abandon '.repeat(11) + 'about';
  let vectorSeed = null;

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
     navigator.onLine is deliberately not used: it reports whether an interface
     exists, not whether traffic can flow, and is wrong in both directions. */
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
    cardconv: 'cards',   /* 'cards' | 'cardbits' */
    words: 24,
    addressType: 'native',
    pathEdited: false,
    choice: 0,         /* which of the eight endings, lookup method only */
    seed: null,        /* cached: the slow half, keyed by seedKey */
    seedKey: null
  };

  /* Three physical sources, and a different number of conventions behind
     each. A coin has one. Cards have two. A six-sided die has four, and which
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
    if (C.METHODS[method()].lookup) state.words = 24;

    if (group === 'source' || group === 'conversion' || group === 'dice' || group === 'cardconv') {
      /* Rolls, flips and lookup entries are different alphabets, so carrying
         the old input across would leave a box full of characters the new
         method rejects. */
      $('input').value = '';
      state.seed = null;
      state.choice = 0;
      buildPad();
    }
    paintSegments();
    paintSteps();
    paintCount();
    if (group !== 'addressType') hideResults();
    if (group === 'addressType' && state.seed) render();
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
    $('conv-legend').textContent = askCards
      ? 'How should the cards become a seed?'
      : 'How does your device convert them?';
    const locked = spec().lookup;
    document.querySelectorAll('[data-group="words"]').forEach(button => {
      button.disabled = locked && button.dataset.value !== '24';
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
  const CARD_KEYS = [
    ...[...C.CARD_RANKS].map(r => {
      const named = { A: 'Ace', T: 'Ten', J: 'Jack', Q: 'Queen', K: 'King' }[r];
      return named ? [r, named] : [r, null];
    }),
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
    bitbox: [['1'], ['2'], ['3'], ['4'], ['H', 'Heads'], ['T', 'Tails']],
    coin: [['H', 'Heads'], ['T', 'Tails']],
    /* Thirteen ranks then four suits, all on the pad at once. Which are live
       is decided by C.nextAllowed, which for cards answers from the deck
       rather than from the position: ranks with nothing left face-down go
       grey, and once a rank is picked only its remaining suits stay lit. */
    cards: CARD_KEYS,
    cardbits: CARD_KEYS
  };

  function buildPad() {
    const pad = $('pad');
    pad.dataset.method = method();
    pad.replaceChildren(...KEYS[method()].map(([value, label, face]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'key';
      button.dataset.key = value;
      if (face) button.dataset.suit = value;
      button.setAttribute('aria-label', label || value);
      button.append(document.createTextNode(face || value));
      if (label) {
        const small = document.createElement('small');
        small.textContent = label.toUpperCase();
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
      ? 'That is all ' + info.rolled + ' words. Any more would not fit the phrase.'
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

  function setInput(value) {
    $('input').value = value;
    paintCount();
    hideResults();
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
    $('meter-val').textContent = bits.toFixed(1) + ' / ' + target + ' bits';
    $('meter-fill').style.width = Math.min(100, bits / target * 100) + '%';
    $('meter-fill').classList.toggle('is-full', bits >= target);

    const drawn = C.events(method(), input).length;
    $('meter-note').textContent =
      info.deck
        ? (() => {
            const left = C.cardsLeft(C.normalise(method(), input)).length;
            const each = 'Drawn without replacement, so each card is worth less than the last: log2(52) = 5.70 bits for the first, then log2(51), and so on.';
            return drawn && left === 52
              ? each + ' That deck is finished \u2014 shuffle it again and keep drawing; the count carries on.'
              : each + (drawn ? ' ' + left + ' cards still face-down.' : '');
          })()
        : info.groupBits
          ? 'Each word is ' + (state.source === 'cards' ? '' : '') + info.groupBits + ' bits: ' +
            (method() === 'octahex' ? 'log2(8) + log2(16) + log2(16) = 3 + 4 + 4.' : 'five four-sided dice and a coin, 5 x 2 + 1.')
        : info.eventBits === 1
          ? 'One bit a flip, so the count and the bits are the same number.'
          : 'Each roll is log2(6) = 2.585 bits. Ninety-nine of them come to 255.9, just under the 256 a 24-word seed holds \u2014 which is why the rolls are hashed rather than packed in.';
  }

  function paintCount() {
    const info = spec();
    const { least, most } = limits();
    const input = clean();
    const at = C.progress({ method: method(), input, words: state.words });
    const el = $('count');

    /* Three different units, because three different things are actually
       being counted -- see progress() in the core. */
    if (at.over) {
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
      $('need').textContent = info.rolled + (state.source === 'octahex'
        ? ' throws of all three dice, ' : ' words of five dice and a coin, ')
        + (info.rolled * info.grouped) + ' entries in all. The 24th word is not rolled — '
        + 'it is mostly a checksum, so the page offers the eight valid endings once the rest are in.';
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
    $('go').textContent = info.lookup ? 'Show the words these produce' : 'Show the wallet these produce';
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

  function hideResults() {
    $('results').hidden = true;
    $('error').hidden = true;
    $('endings').hidden = true;
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
  const SECRET_FIELDS = ['input', 'passphrase'];
  const SECRET_TEXT = [
    'words', 'entropy', 'ending-list',
    'xpub', 'xpub-path', 'xpub-alt', 'xpub-alt-label', 'descriptor',
    'recv-addr', 'recv-path', 'chng-addr', 'chng-path',
    'fp-base', 'fp-pass', 'fp-base-tag'
  ];

  function clearSensitiveState() {
    for (const id of SECRET_FIELDS) {
      const el = $(id);
      if (el) el.value = '';
    }
    for (const id of SECRET_TEXT) {
      const el = $(id);
      if (!el) continue;
      el.replaceChildren();
      el.textContent = '';
    }
    state.seed = null;
    state.seedKey = null;
    state.choice = 0;
    hideResults();
  }

  function fail(message) {
    $('results').hidden = true;
    $('error').hidden = false;
    $('error').textContent = message;
  }

  function derive() {
    hideResults();
    const input = clean();

    /* Checked here rather than live, so nobody watches a warning appear and
       disappear as they tap and starts steering their rolls by it.

       Wrapped because it runs outside the derive try/catch below: an
       exception here once escaped the click handler entirely and left the
       last wallet on screen with no error, which is the worst way for this
       page to fail -- it looks like an answer. */
    let verdict;
    try {
      verdict = C.assessEntropy({ method: method(), input });
    } catch (err) {
      fail('This page could not check those ' + spec().unit + 's: ' + err.message);
      return;
    }
    if (!verdict.ok) { raiseAlarm(verdict); return; }

    const key = seedKeyFor(input);

    /* Repaint before the slow part so the button state is actually seen. */
    $('go').disabled = true;
    $('go').textContent = 'Working\\u2026';

    setTimeout(() => {
      try {
        if (state.seedKey !== key) {
          state.seed = C.deriveSeed({
            method: method(), input, words: state.words, wordlist: WORDLIST,
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

  /* The eight valid endings, shown the way the device shows them. Picking one
     is picking a wallet: they share 23 words and nothing else. */
  function paintEndings(options) {
    $('endings').hidden = false;
    /* Three unrolled bits is eight endings, and every method that reaches here
       gets them the same way. What differs is how you were told to choose. */
    $('endings-note').textContent = state.source === 'octahex'
      ? 'Your throws fix the first 23 words, which carry 253 bits. A 24-word phrase needs 256 plus an 8-bit checksum, so the last word is three bits you never rolled followed by a check over all of them \u2014 which leaves exactly eight endings. Throw the octal die once more and take that numbered option, counting from the left. Your COLDCARD, SeedSigner or Jade will offer the same eight.'
      : 'Your rolls fix the first 23 words, which carry 253 bits. A 24-word phrase needs 256 plus an 8-bit checksum, so the last word is three bits you never rolled followed by a check over all of them. That leaves exactly eight valid endings, and your BitBox02 shows you these same eight. Any one of them is a real wallet \u2014 they are different wallets, so pick the one your device showed you, or roll one more die and count 1 to 8.';
    $('ending-list').replaceChildren(...options.map((option, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ending';
      button.textContent = option.word;
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
    $('descriptor').textContent = C.watchOnlyDescriptor({
      addressType: state.addressType,
      fingerprint: C.masterFingerprint(state.seed.seed),
      path,
      xpub: addresses.xpub
    });
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
    $('entropy').textContent = state.seed.entropy;
    $('type-note').textContent = C.ADDRESS_TYPES[state.addressType].note;
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
  addEventListener('pageshow', event => { if (event.persisted) clearSensitiveState(); });

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
    hideResults();
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
  $('go').addEventListener('click', derive);
  $('alarm-back').addEventListener('click', () => $('alarm').close());
  $('alarm-clear').addEventListener('click', () => {
    $('alarm').close();
    setInput('');
    $('input').focus();
  });

  /* ---- boot ---- */

  (function boot() {
    const results = runSelfTest();
    const bad = results.filter(r => !r.ok);
    const badge = $('selftest');

    $('vectors').replaceChildren(...results.map(r => {
      const li = document.createElement('li');
      if (!r.ok) li.className = 'bad';
      li.textContent = r.name;
      return li;
    }));

    if (bad.length) {
      badge.className = 'bad';
      badge.textContent = 'Self-test FAILED: ' + bad.length + ' of ' + results.length;
      $('go').disabled = true;
      fail('This copy of the page failed its own test vectors, so its output cannot be trusted. '
         + 'Do not use it. Re-download the file and check it against the published checksum.');
      $('go').removeEventListener('click', derive);
      return;
    }

    badge.className = 'good';
    badge.textContent = 'Self-test: ' + results.length + '/' + results.length + ' vectors pass';

    /* Served over a network, or opened from disk. This is the one thing the
       page can actually tell about its own situation, and it is weaker than it
       looks -- a local file can sit on a thoroughly connected machine, and this
       cannot tell. So it reports which copy you are on and offers the download,
       and makes no claim about the machine. */
    const offline = isOffline();
    const where = $('where');
    /* Deliberately not a green "safe" state. The old badge said "this copy is
       running offline" in the same green as the passing self-test, which was
       two mistakes at once: it read as an all-clear, and it was not even true
       -- the site build was fetching three resources from Google Fonts while
       saying it. Those are gone now, so the honest claim is about the file
       rather than the machine: it needs no network. Whether the machine has
       one is not something a page can see. */
    where.className = offline ? '' : 'warn';
    where.textContent = offline
      ? 'Opened from a local file \\u2014 this tool requires no network requests'
      : 'Loaded over a network \\u2014 this copy is online';
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
    const adapter = $('adapter');
    const paintAdapter = () => {
      /* Only on the local copy. Served over a network the badge above already
         says the page came from one, and saying it twice in different words
         reads as two problems rather than one fact. */
      adapter.hidden = !(offline && navigator.onLine === true);
    };
    paintAdapter();
    addEventListener('online', paintAdapter);
    addEventListener('offline', paintAdapter);
    /* Chromium fires this when the connection type changes without the
       up/down state changing. Absent in Firefox and Safari, so it is a bonus
       rather than something the behaviour depends on. */
    if (navigator.connection && navigator.connection.addEventListener) {
      navigator.connection.addEventListener('change', paintAdapter);
    }

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
      $('dl-local-copy').textContent = 'You are reading it over a network, which is fine for a look around. Save it, check it against the published checksum below, and open it from disk on a machine that has never been online before entering rolls for a wallet you intend to keep.';
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
        button.querySelector('[data-dl-label]').textContent = 'Open the offline file';
        const note = document.querySelector('[data-dl-note]');
        if (note) note.textContent = 'Saving it needs the served site \u2014 this copy is running from disk';
      }
    }

    if (location.hash === '#offline') {
      requestAnimationFrame(() => $('offline').scrollIntoView({ block: 'center' }));
    }

    /* Relative links are right on the site and broken in the downloaded file:
       someone who saved that single file has no guides.html beside it. So the
       offline build rewrites them to point at the site. They only resolve with
       a connection, which is fine -- following one is a decision to leave the
       tool, not something the tool needs. */
    if (OFFLINE_BUILD) {
      document.querySelectorAll('[data-site-link]').forEach(link => {
        link.href = 'https://selfcustody.ca/' + link.getAttribute('href').replace(/^(\\.\\.\\/)+/, '');
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
    $('passphrase').addEventListener('input', () => { state.seed = null; hideResults(); });
    paintSegments();
    paintSteps();
    paintCount();
  })();
`;

const segment = (group, options) => options.map(o => `
            <button type="button" data-group="${group}" data-value="${o.value}" aria-pressed="false">${o.label}${o.sub ? `<small>${o.sub}</small>` : ''}</button>`).join('');

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
    <div class="hero-copy">
      <nav class="crumb" aria-label="Breadcrumb">
        <a href="guides.html" data-site-link>Guides</a>
        <span aria-hidden="true">&rarr;</span>
        <span>Entropy Workshop</span>
      </nav>
      <span class="eyebrow">Offline capable tool</span>
      <h1>Entropy Workshop</h1>
      <p class="lead">Flip a coin, roll dice, or draw a card physically &mdash; then see the wallet those events produce. Nothing here generates randomness on its own &mdash; you supply every bit.</p>
      <ul class="status">
        <li id="selftest">Running self-test&hellip;</li>
        <li id="where">Checking&hellip;</li>
        <li id="adapter" class="warn" hidden>This machine reports a network connection</li>
        ${offline
          /* Only the downloaded file makes this claim, because only it can:
             the site page loads a stylesheet, a script and two webfonts. It
             is also the one claim here worth a badge of its own -- "running
             offline" describes where this copy happens to sit, while this
             describes the file, and stays true on a connected machine.

             The site page says nothing in its place. It would only be a
             second way of saying "you are online", which the badge beside it
             already says. */
          ? '<li class="good">No network requests</li>'
          : ''}
      </ul>
    </div>

    <div class="entropy-visual" aria-hidden="true">
      <div class="visual-top">
        <span class="guide-die-mark"></span>
        <div class="visual-heading"><strong>Entropy pipeline</strong><span>An example, not a live result &mdash; physical randomness converted into a wallet.</span></div>
      </div>
      <div class="entropy-code">
        <span><em>rolls</em> 6 2 5 1 4 3 6 6 2 1&hellip;</span>
        <span><em>digest</em> <b>7f 83 b1 65&hellip;</b></span>
      </div>
      <div class="visual-flow"><span>physical</span><i>&rarr;</i><span>SHA-256</span><i>&rarr;</i><span>BIP39</span></div>
    </div>
  </div>
</section>

<main class="wrap workspace">

<noscript>
  <div class="banner noscript-brief">
    <p><strong>This tool needs JavaScript, and it is switched off.</strong> Everything here is arithmetic done in your browser &mdash; hashing the rolls, deriving the keys, checking the results against the published test vectors. None of it can run, so the controls below will not respond and no wallet can be shown.</p>
    <p>Nothing is missing from the page and nothing failed to load; there is simply no server doing this work elsewhere, which is the property that makes the tool safe to use offline. Turn JavaScript on for this page, or open it in a browser where it is enabled.</p>
  </div>
</noscript>

<div class="banner security-brief">
  <p><strong>Treat this tool like seed material.</strong> For a wallet you intend to keep, download and verify this file, then use it on a machine that has never been online. For a device check, use a disposable test wallet and wipe it afterward.</p>
  <p class="critical-line"><strong class="critical">Never enter an existing recovery phrase into any page</strong> &mdash; including this one, which is why there is nowhere here to do it.</p>
</div>

<section class="download" id="offline">
  <div class="download-copy">
    <div id="dl-served" hidden>
      <strong>Run it offline instead</strong>
      <p>The entire tool is this one self-contained file: no external stylesheet, script, font, or network request. Put it on a USB stick and open it on an air-gapped machine before entering rolls for a wallet you intend to keep.</p>
    </div>
    <div id="dl-local" hidden>
      <strong id="dl-local-head">You are already running the local copy</strong>
      <p id="dl-local-copy">This self-contained file is running from your disk, not the network. Copy it to a USB stick or an air-gapped machine and it behaves exactly the same. Check it against the published checksum below before you trust anything it shows you.</p>
      <p class="verify">Running from: <code id="dl-path"></code></p>
    </div>

    <details class="verify-details"${offline ? ' open' : ''}>
      <summary>Verify this file against the published checksum</summary>
      <div class="verify-body">
        <p class="verify">Check that this is the file that was published, rather than whatever happened to arrive:</p>
        <div class="verify-cmds">
          <code>certutil -hashfile entropy-offline.html SHA256</code><span>Windows</span>
          <code>shasum -a 256 entropy-offline.html</code><span>macOS, Linux</span>
        </div>
        <p class="verify" id="dl-hash-served">Compare that against <a href="entropy-offline.html.sha256">entropy-offline.html.sha256</a>, published beside this page.</p>
        <p class="verify" id="dl-hash-local" hidden>Compare that against the published <code>entropy-offline.html.sha256</code>, which sits beside this page on selfcustody.ca. That one line is the only thing you need the network for, and you can fetch it from anywhere.</p>
      </div>
    </details>
  </div>
  <div class="download-action" id="dl-action" hidden>
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
  <legend data-step="1"><span class="step-num">1. </span>How did you make the randomness?</legend>
  <div class="seg seg-even source-pick">${segment('source', [
    { value: 'coin', label: 'Coins', sub: 'heads or tails' },
    { value: 'dice', label: 'Dice', sub: 'six-sided, or octal and hex' },
    { value: 'cards', label: 'Cards', sub: 'a shuffled deck' }
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
  <legend data-step="2"><span class="step-num">2. </span><span id="conv-legend">How does your device convert them?</span></legend>
  <div class="seg seg-tall" id="conv-dice">${segment('conversion', [
    { value: 'dice', label: 'Hash the rolls', sub: 'COLDCARD, SeedSigner, Krux' },
    { value: 'dicezero', label: 'Hash, 6 as 0', sub: 'Keystone, BIP39 tool' },
    { value: 'dicebits', label: 'Bit table', sub: 'BIP39 tool, raw' },
    { value: 'bitbox', label: 'Lookup table', sub: 'BitBox02' }
  ])}</div>
  <div class="seg seg-even" id="conv-cards" hidden>${segment('cardconv', [
    { value: 'cards', label: 'Hash the draw', sub: 'every card counts in full' },
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
  <p class="hint hint-centred">Each has its own <a href="glossary.html#term-derivation_path" data-site-link>derivation path</a>, filled in below.</p>
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
    <p class="meter-note" id="meter-note"></p>
  </div>
</fieldset>

<button type="button" class="go" id="go" disabled>Show the wallet these produce</button>

<div class="endings" id="endings" hidden>
  <strong>Now pick the last word.</strong>
  <p id="endings-note"></p>
  <div class="ending-list" id="ending-list" role="group" aria-label="Valid final words"></div>
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

<section class="results" id="results" hidden>
  <h2>What those rolls produce</h2>
  <p class="hint">Compare this against your device. If it disagrees, your device may use a different conversion &mdash; that is common and does not mean either is broken.</p>

  <div class="fingerprint" id="fingerprint-box">
    <span class="fp-label">Master fingerprint</span>
    <span class="fp-row">
      <span class="fp-cell"><b id="fp-base"></b><em id="fp-base-tag"></em></span>
      <span class="fp-cell" id="fp-arrow-wrap" hidden><i class="fp-arrow" aria-hidden="true">&rarr;</i><b id="fp-pass"></b><em>with passphrase</em></span>
    </span>
    <p class="hint" id="fp-note"></p>
  </div>

  <h3>Recovery words</h3>
  <ol class="words" id="words"></ol>

  <h3>First addresses</h3>
  <p class="hint" id="type-note"></p>
  <div class="addr">
    <div class="label"><span>Receiving</span><code id="recv-path"></code></div>
    <p id="recv-addr"></p>
  </div>
  <div class="addr">
    <div class="label"><span>Change</span><code id="chng-path"></code></div>
    <p id="chng-addr"></p>
  </div>

  <div class="xpub-box">
    <div class="label"><span>Account path</span><code id="xpub-path"></code></div>
    <p id="xpub"></p>
    <div id="xpub-alt-row" hidden>
      <div class="label"><span>Same key as <b id="xpub-alt-label"></b></span></div>
      <p id="xpub-alt"></p>
    </div>
    <p class="xpub-note">This is the public half of the account, and the thing a watch-only wallet means when it asks for your <a href="glossary.html#term-xpub" data-site-link>xpub</a>. It can work out every address below it and sign nothing, so it cannot move coins &mdash; but anyone holding it can see your whole balance and history, which is why it is not something to post or email.</p>
    <p class="xpub-note" id="xpub-slip" hidden>Some wallets show the same key with a prefix naming the address type. The two strings above are the same key with different version bytes, so a wallet showing one and a device showing the other do not disagree.</p>
  </div>

  <div class="xpub-box descriptor-box">
    <div class="label"><span>Watch-only descriptor</span><code>BIP380 &middot; BIP389</code></div>
    <p id="descriptor"></p>
    <p class="xpub-note">The same account key, written the way a wallet wants to be given it. It names the script type, so it cannot be imported as the wrong address type &mdash; the mistake that makes a restored wallet look empty. Sparrow, Bitcoin Core and most coordinators take this line directly.</p>
    <p class="xpub-note">The <code>&lt;0;1&gt;</code> covers receiving and change together, and the eight characters after the <code>#</code> are a checksum over everything before them, so a wallet can tell you that you mistyped rather than watching the wrong account in silence. It still contains no private key and can sign nothing.</p>
  </div>

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
  <summary>Why the dice and the coins are treated differently</summary>
  <div class="body">
    <p>A coin gives exactly one bit, so 256 flips are 256 bits and go straight in unchanged. You can check that mapping by hand.</p>
    <p>A six-sided die face carries log&#8322;(6) = 2.58 bits, which is not a whole number, so the rolls are hashed with SHA-256 instead and the result used as the entropy. That is what COLDCARD, SeedSigner, Krux and Gordian all do, and it is why 99 rolls is the number you see everywhere.</p>
    <p>Three dice at once sidestep the problem rather than solving it. Eight faces is three bits and sixteen is four, so an octal die and two hex dice throw 3 + 4 + 4 = 11 bits together &mdash; which is one word index exactly, with no remainder to hash away and no bias to correct. That is why a printed dictionary can name the word directly, and why 23 throws finish a seed where a six-sided die needs 99 rolls and a checksum you cannot see.</p>
    <p><strong>There is no standard here.</strong> Four of the conversions in use are offered above, and they disagree with each other on purpose: hashing the digits as rolled, hashing them after rewriting every 6 to a 0, reading them as bits without hashing at all, and looking each word up in a table. The same column of rolls produces four unrelated wallets. Others are not offered &mdash; BlueWallet packs bits its own way, and SeedSigner used a different method before February 2022 &mdash; so a mismatch against all four still does not mean your device is broken.</p>
    <p>Which is the point worth leaving with. Your recovery words are the backup; the column of rolls in your notebook is not, because the rolls alone do not say which of these produced the wallet.</p>
  </div>
</details>

<details>
  <summary>How this page was checked</summary>
  <div class="body">
    <p>Every routine here is written from the published specifications rather than pulled from a library, so that the file can be read end to end. Hand-written cryptography can be subtly wrong, so on load the page runs the official test vectors and refuses to produce anything if they do not pass:</p>
    <ul class="vectors" id="vectors"></ul>
    <p>The values come from FIPS 180-4, RFC 4231, and the test vectors published in BIP32, BIP39, BIP84 and BIP86. None was produced by running this code.</p>
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

    <p>Inspired partly by <a href="https://entropylab.online/" target="_blank" rel="noopener noreferrer">EntropyLab</a> and <a href="https://miguelmedeiros.github.io/entropy/" target="_blank" rel="noopener noreferrer">Entropy Workbench</a>.</p>

    <p>One thing above has no source: the refusal you get when a sequence looks typed rather than rolled. That check is ours, its thresholds come from simulated rolls rather than a specification, and it is a spellcheck &mdash; not a randomness test.</p>
  </div>
</details>

<p class="colophon">Part of <strong>SelfCustody.ca</strong>. The full procedure and the rules that matter more than this tool does are in <a href="guides/dice-entropy.html" data-site-link>Roll the dice</a> and <a href="guides/quickstart.html" data-site-link>Intro to Self Custody</a>.</p>

</main>`;

const toolScripts = ({ core, wordlist, offline }) => `<script>
${core}
</script>
<script>
'use strict';
(function () {
  const OFFLINE_BUILD = ${offline};
  const C = EntropyCore;
  const WORDLIST_RAW = '${wordlist}';
${selfTest()}
${ui()}
})();
</script>`;

/* Measured against the assembled file rather than hand-maintained, so it can
   never drift from what a reader receives. Rounded to the nearest 10 KB, which
   absorbs the bytes the number itself adds to the string describing it. */
const withFileSize = html => html.replace(
  '{{FILESIZE}}',
  `~${Math.round(html.length / 1024 / 10) * 10} KB`
);

const payload = () => ({
  core: readFileSync(CORE, 'utf8'),
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
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; img-src data:; form-action 'none'; base-uri 'none'">
  <meta name="referrer" content="no-referrer">
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

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

  .site-header {
    position: fixed; top: 0; right: 0; left: 0; z-index: 20;
    padding: 16px 0;
    background: rgba(20, 20, 19, 0.92);
    border-bottom: 1px solid rgba(110, 105, 94, 0.34);
    backdrop-filter: blur(9px);
  }
  .header-inner { display: flex; align-items: center; gap: 20px; }

  .brand {
    display: inline-flex; align-items: center; gap: 0; margin-right: auto;
    color: #fff; font-size: 26px; font-weight: 500; white-space: nowrap; text-decoration: none;
  }
  .brand-mark {
    display: block; flex: 0 0 auto; width: 74px; height: 26px;
    background: url("${embedSvg('docs/assets/img/self-custody-symbol.svg')}") center / contain no-repeat;
  }
  .brand-name { margin-left: 11px; letter-spacing: 1px; }
  .brand-domain {
    display: inline-flex; align-self: flex-end; align-items: center; justify-content: center;
    height: 17px; margin-bottom: 11px; margin-left: 6px; padding: 0 7px 0 4px;
    color: #fff; background: #d8292f; border-radius: 5px;
    font-size: 12px; font-weight: 700; line-height: 1;
    font-family: "Open Sans", sans-serif;
  }

  .site-nav { display: flex; gap: 6px; }
  .site-nav a {
    padding: 8px 13px; border-radius: 9px; color: var(--ink);
    font-size: 0.9rem; font-weight: 700; text-decoration: none;
  }
  .site-nav a:hover { color: #fff; background: rgba(255, 255, 255, 0.07); }

  /* ---- hero -------------------------------------------------------------
     The same shape the guide pages open with: cleared header, display-size
     heading, lead, then the badges. */
  .hero {
    min-height: 630px;
    display: flex; align-items: center;
    padding: 132px 0 70px;
    color: #fff;
    background:
      radial-gradient(circle at 88% 12%, rgba(255, 138, 0, 0.16), transparent 38%),
      linear-gradient(135deg, #202020, #303030);
  }
  .crumb { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; font-size: 0.9rem; font-weight: 700; }
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
    margin: 0 0 54px; padding: 27px 28px; border-radius: 18px;
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
  .download-copy a { color: var(--orange); }

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
  .dl-icon { flex: 0 0 auto; display: block; }
  .download-action small { color: var(--muted); font-size: 0.75rem; }

  @media (max-width: 620px) {
    .download { grid-template-columns: 1fr; gap: 16px; }
    .download-action { justify-items: stretch; }
    .dl { text-align: center; }
  }


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

  /* ---- site footer ------------------------------------------------------ */

  .site-footer {
    padding: 54px 0 24px;
    color: rgba(255, 255, 255, 0.68);
    background: linear-gradient(180deg, #08090b 0%, #0e0e0f 96px);
    font-size: 0.92rem;
  }
  /* The site runs brand / explore / warning as three columns, but it has a
     1320px container to do it in. This page is 860px wide, which squeezes the
     warning to ~190px and wraps its two sentences into a column tall enough to
     set the height of the whole footer. So the warning goes full width
     underneath instead: same panel, laid out along its long axis. */
  .footer-grid {
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 26px 30px;
  }
  .footer-brand {
    display: flex; align-items: center; gap: 11px;
    margin: 0 0 12px; color: #fff; font-size: 1.3rem; font-weight: 600;
  }
  .footer-brand span.mark {
    flex: 0 0 32px; width: 32px; height: 32px;
    background: url("${embedSvg('docs/assets/img/self-custody-favicon.svg')}") center / contain no-repeat;
  }
  .site-footer h4 { margin: 0 0 12px; color: #fff; font-size: 1rem; }
  .site-footer p { margin: 0; line-height: 1.65; }
  .footer-links { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; margin: 0; padding: 0; list-style: none; }
  .footer-links a { color: rgba(255, 255, 255, 0.72); text-decoration: none; }
  .footer-links a:hover { color: var(--orange); }

  .footer-warning {
    grid-column: 1 / -1;
    display: flex; align-items: flex-start; gap: 16px;
    padding: 18px 20px; color: #fff;
    background: linear-gradient(145deg, rgba(255, 138, 0, 0.16), rgba(255, 138, 0, 0.055));
    border: 1px solid rgba(242, 138, 0, 0.78); border-radius: 14px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 14px 32px rgba(0, 0, 0, 0.22);
  }
  .footer-warning > div:last-child { min-width: 0; }
  .footer-warning h4 { margin: 0 0 4px; }
  /* The site sets a bootstrap-icons shield in this box. There is no icon font
     here and adding one for a single glyph is not worth 40 KB, so the mark is
     drawn with type instead -- same box, same weight on the page. */
  .footer-warning-mark {
    display: grid; place-items: center; flex: 0 0 40px; width: 40px; height: 40px;
    color: #241300; background: var(--orange); border-radius: 11px;
    box-shadow: 0 8px 20px rgba(242, 138, 0, 0.16);
    font-family: "Jost", sans-serif; font-size: 1.5rem; font-weight: 700; line-height: 1;
  }
  .footer-warning p { font-size: 0.88rem; }

  .footer-bottom {
    display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px;
    margin-top: 34px; padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.86rem;
  }
  .footer-bottom a { color: var(--orange); }

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
    display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(330px, 0.88fr);
    align-items: center; gap: clamp(42px, 7vw, 90px);
  }
  .hero-copy { min-width: 0; }
  .hero .crumb { margin-bottom: 34px; }
  .hero .eyebrow {
    display: inline-flex; align-items: center; gap: 9px; margin-bottom: 16px;
    color: #ffad4c; letter-spacing: 0.18em;
  }
  .hero .eyebrow::before { content: ""; width: 25px; height: 1px; background: var(--orange); }
  .hero h1 { max-width: 600px; margin-bottom: 22px; font-size: clamp(3rem, 6.5vw, 5.4rem); letter-spacing: -0.035em; }
  .hero .lead { max-width: 660px; font-size: clamp(1rem, 1.6vw, 1.18rem); }
  .hero .status { margin-top: 30px; gap: 8px; }
  .hero .status li {
    position: relative; padding: 8px 12px 8px 29px; border-radius: 999px;
    background: rgba(8, 8, 8, 0.28); backdrop-filter: blur(4px);
  }
  .hero .status li::before {
    content: ""; position: absolute; left: 12px; top: 50%; width: 7px; height: 7px;
    border-radius: 50%; background: #8e887e; transform: translateY(-50%);
    box-shadow: 0 0 0 3px rgba(142, 136, 126, 0.12);
  }
  .hero .status li.good::before { background: var(--success); box-shadow: 0 0 0 3px rgba(53, 180, 138, 0.15), 0 0 12px rgba(53, 180, 138, 0.7); }
  .hero .status li.warn::before { background: var(--orange); box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.15), 0 0 12px rgba(255, 138, 0, 0.7); }
  .hero .status li.bad::before { background: var(--danger); }

  .entropy-visual {
    padding: 26px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 18px;
    background: rgba(12, 12, 12, 0.42);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.055), 0 24px 60px rgba(0, 0, 0, 0.3);
  }
  .visual-top {
    display: grid; grid-template-columns: 68px minmax(0, 1fr); align-items: center; gap: 18px;
    padding-bottom: 22px; border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  }
  /* The same four-pip die used beside the Roll the dice guide title. Kept as
     an inline SVG so the standalone download still fetches nothing. */
  .guide-die-mark {
    display: block; width: 68px; height: 68px; border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 17px;
    background-image:
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 46 46'%3E%3Cdefs%3E%3CradialGradient id='a' cx='.38' cy='.32' r='.78'%3E%3Cstop offset='0' stop-color='%23ff6a71'/%3E%3Cstop offset='.55' stop-color='%23f5222b'/%3E%3Cstop offset='1' stop-color='%23bc0f19'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='.38' cy='.32' r='.78'%3E%3Cstop offset='0' stop-color='%23fffaef'/%3E%3Cstop offset='.55' stop-color='%23eee2c7'/%3E%3Cstop offset='1' stop-color='%23bfae8e'/%3E%3C/radialGradient%3E%3CradialGradient id='c' cx='.38' cy='.32' r='.78'%3E%3Cstop offset='0' stop-color='%236cc687'/%3E%3Cstop offset='.55' stop-color='%233c9056'/%3E%3Cstop offset='1' stop-color='%23246438'/%3E%3C/radialGradient%3E%3CradialGradient id='d' cx='.38' cy='.32' r='.78'%3E%3Cstop offset='0' stop-color='%23ffcb68'/%3E%3Cstop offset='.55' stop-color='%23ff9900'/%3E%3Cstop offset='1' stop-color='%23cb6d00'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='13.5' cy='13.5' r='4.6' fill='url(%23a)'/%3E%3Ccircle cx='32.5' cy='13.5' r='4.6' fill='url(%23b)'/%3E%3Ccircle cx='13.5' cy='32.5' r='4.6' fill='url(%23c)'/%3E%3Ccircle cx='32.5' cy='32.5' r='4.6' fill='url(%23d)'/%3E%3C/svg%3E"),
      linear-gradient(152deg, #23262c 0%, #101318 46%, #06070a 100%);
    background-repeat: no-repeat; background-position: center; background-size: 100% 100%;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), inset 0 -10px 18px rgba(0, 0, 0, 0.5), 0 7px 16px rgba(0, 0, 0, 0.38);
  }
  .visual-heading strong { display: block; color: #fff; font: 600 1.25rem/1.2 "Jost", sans-serif; }
  .visual-heading span { display: block; margin-top: 5px; color: var(--muted); font-size: 0.78rem; line-height: 1.45; }
  .entropy-code {
    display: grid; gap: 8px; margin: 22px 0 17px; padding: 14px 15px;
    color: #b9b2a7; background: rgba(0, 0, 0, 0.28); border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.68rem; line-height: 1.2; letter-spacing: 0.08em;
  }
  .entropy-code span { display: flex; justify-content: space-between; gap: 10px; }
  .entropy-code em { color: var(--orange); font-style: normal; }
  .entropy-code b { color: #8be3c6; font-weight: 600; }
  .visual-flow { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 7px; }
  .visual-flow span {
    padding: 9px 7px; color: #c7c0b6; border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 9px; background: rgba(255,255,255,.035); text-align: center;
    font-size: 0.66rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .visual-flow i { color: var(--orange); font-style: normal; }
  .workspace { padding-bottom: 90px; }
  .security-brief {
    position: relative; margin: -30px 0 24px; padding: 25px 27px 25px 78px;
    border-color: rgba(255, 138, 0, 0.46); border-radius: 18px;
    background: linear-gradient(135deg, #29231d, #211f1c);
    box-shadow: 0 22px 55px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.05);
  }
  .security-brief::before {
    content: "!"; position: absolute; left: 25px; top: 25px; display: grid; place-items: center;
    width: 35px; height: 35px; color: #241300; background: var(--orange); border-radius: 11px;
    font-family: "Jost", sans-serif; font-size: 1.2rem; font-weight: 800;
  }
  .security-brief strong { color: #ffad4c; }


  .workbench-intro { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 24px; margin: 0 0 20px; }
  .workbench-intro .eyebrow { margin-bottom: 9px; }
  .workbench-intro h2 { margin: 0 0 7px; color: #fff; font-size: clamp(1.7rem, 3vw, 2.35rem); line-height: 1.15; }
  .workbench-intro p { max-width: 650px; margin: 0; color: var(--muted); font-size: 0.92rem; }
  .step-map { display: flex; align-items: center; gap: 5px; padding-bottom: 6px; color: #777168; font-size: 0.7rem; font-weight: 800; letter-spacing: .08em; }
  .step-map b { display: grid; place-items: center; width: 25px; height: 25px; border: 1px solid rgba(255, 138, 0, .32); border-radius: 50%; color: #ffad4c; }
  .step-map i { width: 11px; height: 1px; background: rgba(255,255,255,.12); }

  .workbench {
    position: relative; padding: 7px 30px 30px; border: 1px solid rgba(255,255,255,.1);
    border-radius: 22px; background: linear-gradient(155deg, rgba(255,255,255,.045), rgba(255,255,255,.018));
    box-shadow: 0 30px 80px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.045);
  }
  .workbench fieldset { position: relative; margin: 0; padding: 25px 0 26px 62px; border-bottom: 1px solid rgba(255,255,255,.085); }
  .workbench fieldset:last-of-type { border-bottom: 0; padding-bottom: 10px; }
  .workbench legend { float: left; width: 100%; margin: 0 0 13px; font-family: "Jost", sans-serif; font-size: 1.07rem; }
  .workbench legend::first-letter { color: transparent; font-size: 0; }
  .workbench legend::before {
    content: attr(data-step); position: absolute; left: 0; top: 22px; display: grid; place-items: center;
    width: 39px; height: 39px; color: #ffad4c; border: 1px solid rgba(255,138,0,.4); border-radius: 12px;
    background: rgba(255,138,0,.075); font: 800 0.82rem/1 "Open Sans", sans-serif;
  }
  .workbench legend + * { clear: both; }
  .workbench .seg { gap: 10px; }
  .workbench .seg button { min-height: 58px; border-radius: 12px; }
  .workbench .seg button[aria-pressed="true"] { box-shadow: inset 0 0 0 1px rgba(255,138,0,.25), 0 8px 22px rgba(255,138,0,.07); }
  .workbench .hint strong { color: var(--ink-soft); }
  .workbench textarea { min-height: 132px; }
  .workbench .go {
    margin-top: 27px; min-height: 56px; border-radius: 13px;
    box-shadow: 0 16px 34px rgba(255, 138, 0, .16); transition: background-color .15s ease, transform .15s ease, box-shadow .15s ease;
  }
  .workbench .go:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 20px 42px rgba(255, 138, 0, .23); }
  .workbench .go:disabled { box-shadow: none; }
  .workbench .results { margin-top: 36px; padding: 30px; border: 1px solid rgba(53,180,138,.25); border-radius: 16px; background: rgba(53,180,138,.045); }
  .workbench .error { margin-bottom: 0; }

  main > details {
    margin-top: 16px; padding: 18px 20px; border: 1px solid rgba(255,255,255,.09);
    border-radius: 13px; background: rgba(255,255,255,.025);
  }
  main > details[open] { border-color: rgba(255,138,0,.25); }
  main > details summary { color: var(--ink); }

  @media (max-width: 820px) {
    .hero { min-height: auto; padding: 126px 0 58px; }
    .hero-shell { grid-template-columns: 1fr; gap: 40px; }
    .hero h1 { font-size: clamp(3.2rem, 11vw, 5rem); }
    .entropy-visual { width: min(100%, 500px); }
    .security-brief { margin-top: -24px; }
    .workbench-intro { grid-template-columns: 1fr; gap: 12px; }
  }
  @media (max-width: 620px) {
    .wrap { padding-inline: 18px; }
    .hero { padding: 38px 0 48px; }
    .hero .crumb { margin-bottom: 26px; }
    .hero h1 { font-size: clamp(2.8rem, 15vw, 4rem); }
    .hero .status { display: grid; }
    .entropy-visual { padding: 20px; border-radius: 16px; }
    .visual-top { grid-template-columns: 54px minmax(0, 1fr); gap: 14px; }
    .guide-die-mark { width: 54px; height: 54px; border-radius: 14px; }
    .visual-flow { gap: 4px; }
    .visual-flow span { padding: 8px 4px; font-size: .58rem; }
    .security-brief { margin-top: -20px; padding: 66px 20px 20px; }
    .security-brief::before { left: 20px; top: 18px; }
    .download { margin-bottom: 44px; padding: 22px 20px; }
    .step-map { display: none; }
    .workbench { padding: 4px 18px 22px; border-radius: 18px; }
    .workbench fieldset { padding: 23px 0 24px 0; }
    .workbench legend { padding-left: 47px; min-height: 37px; display: flex; align-items: center; }
    .workbench legend::before { top: 20px; }
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
    ['BIP86 taproot address', () => vectorAddress('taproot', "m/86'/0'/0'", 0), 'bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr']
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

  const state = {
    method: 'dice',
    words: 24,
    addressType: 'native',
    pathEdited: false,
    seed: null,        /* cached: the slow half, keyed by seedKey */
    seedKey: null
  };

  const defaultPath = () => C.accountPath(state.addressType, 0);
  const seedKeyFor = input => state.method + '|' + state.words + '|' + input;

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
    if (group === 'method') {
      /* Rolls and flips are different alphabets, so carrying the old input
         across would leave a box full of characters the new method rejects. */
      $('input').value = '';
      state.seed = null;
      buildPad();
    }
    paintSegments();
    paintCount();
    if (group === 'addressType' || group === 'words' || group === 'method') hideResults();
    if (group === 'addressType' && state.seed) render();
  }

  /* ---- the keypad ---- */

  /* Face value first, then what to call it out loud. A die needs no second
     label; heads and tails very much do, since H and T alone are a guess. */
  const KEYS = {
    dice: [['1'], ['2'], ['3'], ['4'], ['5'], ['6']],
    coin: [['H', 'Heads'], ['T', 'Tails']]
  };

  function buildPad() {
    const pad = $('pad');
    pad.dataset.method = state.method;
    pad.replaceChildren(...KEYS[state.method].map(([value, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'key';
      button.dataset.key = value;
      button.setAttribute('aria-label', label || value);
      button.append(document.createTextNode(value));
      if (label) {
        const small = document.createElement('small');
        small.textContent = label.toUpperCase();
        button.append(small);
      }
      button.addEventListener('click', () => press(value));
      return button;
    }));
  }

  const limits = () => C.limits(state.method, state.words);

  /* Every pad action rewrites the field from its normalised value, so the two
     input routes cannot drift apart -- what the counter counts is exactly what
     gets hashed. The cost is that typed spacing is tidied away on the next
     tap, which is a fair trade for the two never disagreeing. */
  function setInput(value) {
    $('input').value = value;
    paintCount();
    hideResults();
  }

  function press(value) {
    const current = clean();
    /* The pad stops at the ceiling rather than the target: past the minimum,
       more rolls are welcome, but past the maximum they would be refused on
       submit and it is kinder to stop the tap than to explain afterwards. */
    if (current.length >= limits().most) return;
    setInput(current + value);
  }

  /* ---- the live counter ---- */

  function clean() { return C.normalise(state.method, $('input').value); }

  function paintCount() {
    const spec = C.METHODS[state.method];
    const { least, most } = limits();
    const have = clean().length;
    const el = $('count');

    if (have < least) {
      el.textContent = have + ' of ' + least + ' ' + spec.unit + 's';
      el.className = 'short';
    } else if (have > most) {
      el.textContent = have + ' ' + spec.unit + 's · ' + most + ' is the most';
      el.className = 'over';
    } else {
      el.textContent = have + ' ' + spec.unit + 's';
      el.className = 'ready';
    }

    $('need').textContent = spec.extra
      ? least + ' ' + spec.unit + 's for ' + state.words + ' words, and more if you like — every '
        + spec.unit + ' goes into the hash, so the extras are not wasted. Up to ' + most + '.'
      : 'Exactly ' + least + ' ' + spec.unit + 's for ' + state.words + ' words. Each '
        + spec.unit + ' is one bit and the bits are packed straight in, so ' + least
        + ' fills the seed and a further one would have nowhere to go.';

    $('accepts').textContent = 'Accepts ' + spec.faces + '. Spaces and line breaks are ignored.';
    $('pad-hint').textContent = state.method === 'coin'
      ? 'Tap each flip in the order you made them. You can type H and T instead, or paste.'
      : 'Tap each roll in the order you made them. You can type the digits instead, or paste.';
    $('go').disabled = have < least || have > most;
    $('matches').textContent = spec.matches;

    $('pad').querySelectorAll('.key').forEach(key => { key.disabled = have >= most; });
    $('undo').disabled = have === 0;
    $('clear').disabled = have === 0;
  }

  /* ---- deriving ---- */

  function hideResults() { $('results').hidden = true; $('error').hidden = true; }

  function fail(message) {
    $('results').hidden = true;
    $('error').hidden = false;
    $('error').textContent = message;
  }

  function derive() {
    hideResults();
    const input = clean();

    /* Checked here rather than live, so nobody watches a warning appear and
       disappear as they tap and starts steering their rolls by it. */
    const verdict = C.assessEntropy({ method: state.method, input });
    if (!verdict.ok) { raiseAlarm(verdict); return; }

    const key = seedKeyFor(input);

    /* Repaint before the slow part so the button state is actually seen. */
    $('go').disabled = true;
    $('go').textContent = 'Working\\u2026';

    setTimeout(() => {
      try {
        if (state.seedKey !== key) {
          state.seed = C.deriveSeed({
            method: state.method, input, words: state.words, wordlist: WORDLIST
          });
          state.seedKey = key;
        }
        render();
      } catch (err) {
        fail(err.message);
      } finally {
        $('go').disabled = false;
        $('go').textContent = 'Show the wallet these produce';
      }
    }, 20);
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

  document.querySelectorAll('[data-group]').forEach(button => {
    button.addEventListener('click', () => onPick(button.dataset.group, button.dataset.value));
  });
  $('input').addEventListener('input', () => { paintCount(); hideResults(); });
  $('path').addEventListener('input', () => {
    state.pathEdited = $('path').value.trim() !== defaultPath();
    if (state.seed) render();
  });
  $('path-reset').addEventListener('click', () => {
    $('path').value = defaultPath();
    state.pathEdited = false;
    if (state.seed) render();
  });
  $('undo').addEventListener('click', () => setInput(clean().slice(0, -1)));
  $('clear').addEventListener('click', () => setInput(''));
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
    where.className = offline ? 'good' : 'warn';
    where.textContent = offline
      ? 'Local file \\u2014 this copy is running offline'
      : 'Loaded over a network \\u2014 this copy is online';
    /* The panel is shown either way, but says different things. Served, it
       offers the download. From a local file the button would be dead -- Chrome
       silently refuses <a download> on file:// URLs -- and pointless besides,
       since you already have the file. What does carry over is the checksum
       check, which is arguably more use here than anywhere: this is the moment
       you can confirm the copy on your disk is the copy that was published. */
    $('dl-served').hidden = offline;
    $('dl-hash-served').hidden = offline;
    $('dl-action').hidden = offline;
    $('dl-local').hidden = !offline;
    $('dl-hash-local').hidden = !offline;
    if (offline) {
      $('dl-path').textContent = decodeURIComponent(location.pathname).replace(/^\\//, '');
    }
    if (location.hash === '#offline') {
      requestAnimationFrame(() => $('offline').scrollIntoView({ block: 'center' }));
    }

    /* Relative links are right for the served copy and broken in a downloaded
       one: someone who saved this single file has no ../guides.html next to
       it. So on a local copy they are rewritten to point at the site. They
       only resolve with a connection, which is fine -- following one is a
       decision to leave the tool, not something the tool needs. */
    if (offline) {
      document.querySelectorAll('[data-site-link]').forEach(link => {
        link.href = 'https://selfcustody.ca/' + link.getAttribute('href').replace(/^(\\.\\.\\/)+/, '');
      });
    }

    $('year').textContent = String(new Date().getFullYear());
    buildPad();
    $('path').value = defaultPath();
    paintSegments();
    paintCount();
  })();
`;

const segment = (group, options) => options.map(o => `
            <button type="button" data-group="${group}" data-value="${o.value}" aria-pressed="false">${o.label}${o.sub ? `<small>${o.sub}</small>` : ''}</button>`).join('');

export function renderEntropyPage() {
  const core = readFileSync(CORE, 'utf8');
  const wordlist = readFileSync(WORDS, 'utf8').trim().split(/\r?\n/).join(' ');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; img-src data:; form-action 'none'; base-uri 'none'">
<meta name="robots" content="noindex">
<title>Entropy Workshop | SelfCustody.ca</title>
<style>${styles()}</style>
</head>
<body>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="index.html" data-site-link aria-label="SelfCustody.ca home">
      <span class="brand-mark" aria-hidden="true"></span>
      <span class="brand-name">SELF CUSTODY</span>
      <span class="brand-domain" aria-hidden="true">.CA</span>
    </a>
    <nav class="site-nav" aria-label="Site">
      <a href="index.html" data-site-link>Home</a>
      <a href="guides.html" data-site-link>Guides</a>
      <a href="glossary.html" data-site-link>Glossary</a>
      <a href="contact.html" data-site-link>Get Help</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="wrap hero-shell">
    <div class="hero-copy">
      <nav class="crumb" aria-label="Breadcrumb">
        <a href="guides.html" data-site-link>Guides</a>
        <span aria-hidden="true">&rarr;</span>
        <span>Entropy Workshop</span>
      </nav>
      <span class="eyebrow">Offline capable tool</span>
      <h1>Entropy<br>Workshop</h1>
      <p class="lead">Enter the rolls or flips you already made, and see the wallet they convert to. Nothing here generates randomness &mdash; you supply every bit.</p>
      <ul class="status">
        <li id="selftest">Running self-test&hellip;</li>
        <li id="where">Checking&hellip;</li>
        <li>No network requests</li>
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

<div class="banner security-brief">
  <p><strong>Use throwaway rolls, on a wallet holding nothing.</strong> The right way to use this page is to generate a test wallet on your device from a set of rolls, run the same rolls through here, and see whether the words match. That tells you the device converts dice the way it claims. Then wipe it.</p>
  <p>Do not type the rolls behind a wallet you actually use, and never type an existing recovery phrase into any page, including this one &mdash; which is why there is nowhere here to do it.</p>
</div>

<section class="download" id="offline">
  <div class="download-copy">
    <div id="dl-served" hidden>
      <strong>Run it offline instead</strong>
      <p>The whole tool is this one file. Nothing is fetched from anywhere &mdash; no stylesheet, no script, no font &mdash; so saved to a USB stick and opened on a machine that has never been online, it behaves exactly the same as it does here.</p>
    </div>
    <div id="dl-local" hidden>
      <strong>You are already running the local copy</strong>
      <p>This file is the whole tool, and you are running it from your own disk rather than from the network. Copy it wherever you need it &mdash; a USB stick, a machine that has never been online &mdash; and it behaves exactly the same.</p>
      <p class="verify">Running from: <code id="dl-path"></code></p>
    </div>

    <p class="verify">Worth checking that this is the file that was published, rather than whatever happened to arrive:</p>
    <pre><code>certutil -hashfile entropy.html SHA256     <span>Windows</span>
shasum -a 256 entropy.html                <span>macOS, Linux</span></code></pre>
    <p class="verify" id="dl-hash-served">Compare that against <a href="entropy.html.sha256">entropy.html.sha256</a>, published beside this page.</p>
    <p class="verify" id="dl-hash-local" hidden>Compare that against the published <code>entropy.html.sha256</code>, which sits beside this page on selfcustody.ca. That one line is the only thing you need the network for, and you can fetch it from anywhere.</p>
  </div>
  <div class="download-action" id="dl-action" hidden>
    <div class="dl-frame">
      <a class="dl" href="entropy.html" download="selfcustody-entropy-check.html">
        <svg class="dl-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1.5V10.5M8 10.5L4.5 7M8 10.5L11.5 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2.5 13H13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        Download
      </a>
    </div>
    <small>{{FILESIZE}} &middot; no installer</small>
  </div>
</section>

<div class="workbench-intro">
  <div>
    <span class="eyebrow">Disposable test vector</span>
    <h2>Build the same wallet, independently.</h2>
    <p>Set the method your device uses, enter a throwaway sequence, then compare the words and first addresses side by side.</p>
  </div>
  <div class="step-map" aria-hidden="true"><b>1</b><i></i><b>2</b><i></i><b>3</b><i></i><b>4</b><i></i><b>5</b></div>
</div>

<section class="workbench" aria-label="Entropy conversion controls">
<fieldset>
  <legend data-step="1">1. How did you make the randomness?</legend>
  <div class="seg">${segment('method', [
    { value: 'dice', label: 'Dice', sub: 'six-sided' },
    { value: 'coin', label: 'Coin flips', sub: 'heads or tails' }
  ])}</div>
  <p class="hint" id="matches"></p>
</fieldset>

<fieldset>
  <legend data-step="2">2. How many words?</legend>
  <div class="seg">${segment('words', [
    { value: '12', label: '12 words', sub: '128 bits' },
    { value: '24', label: '24 words', sub: '256 bits' }
  ])}</div>
  <p class="hint" id="need"></p>
</fieldset>

<fieldset>
  <legend data-step="3">3. Which address type?</legend>
  <div class="seg">${segment('addressType', [
    { value: 'legacy', label: 'Legacy', sub: 'starts 1' },
    { value: 'nested', label: 'Nested', sub: 'starts 3' },
    { value: 'native', label: 'Native SegWit', sub: 'bc1q' },
    { value: 'taproot', label: 'Taproot', sub: 'bc1p' }
  ])}</div>
  <p class="hint">Each type has its own standard derivation path, filled in below.</p>
</fieldset>

<fieldset>
  <legend data-step="4">4. Account path</legend>
  <div class="path-row">
    <input type="text" id="path" spellcheck="false" autocomplete="off" aria-label="Account derivation path">
    <button type="button" id="path-reset">Reset</button>
  </div>
  <p class="hint">This is <strong>account 0</strong>, the default every wallet opens with. The receiving branch is <code>/0/0</code> and the change branch is <code>/1/0</code> below it. Change the account number if you are checking a different one.</p>
</fieldset>

<fieldset>
  <legend data-step="5">5. Your rolls</legend>
  <p class="hint" id="pad-hint"></p>
  <div class="pad" id="pad" role="group" aria-label="Enter each roll in order"></div>
  <div class="pad-tools">
    <button type="button" class="key-tool" id="undo">Undo last</button>
    <button type="button" class="key-tool" id="clear">Clear all</button>
  </div>
  <textarea id="input" spellcheck="false" autocomplete="off" aria-label="Your dice rolls or coin flips"></textarea>
  <div class="count">
    <span id="accepts"></span>
    <b id="count"></b>
  </div>
</fieldset>

<button type="button" class="go" id="go" disabled>Show the wallet these produce</button>

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
  <p class="hint">Compare this against your device. If it disagrees, your device uses a different conversion &mdash; that is common and does not mean either is broken.</p>

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

  <details>
    <summary>Show the raw entropy</summary>
    <div class="body">
      <p>The number your rolls became, before it was written out as words:</p>
      <p><code id="entropy"></code></p>
    </div>
  </details>
</section>
</section>

<details>
  <summary>Why the dice and the coins are treated differently</summary>
  <div class="body">
    <p>A coin gives exactly one bit, so 256 flips are 256 bits and go straight in unchanged. You can check that mapping by hand.</p>
    <p>A die face carries log&#8322;(6) = 2.58 bits, which is not a whole number of bits, so the rolls are hashed with SHA-256 instead and the result used as the entropy. That is what COLDCARD, SeedSigner, Krux and Gordian all do, and it is why 99 rolls is the number you see everywhere.</p>
    <p><strong>There is no standard here.</strong> Other wallets convert the same rolls differently &mdash; Keystone rewrites every 6 to a 0 first and wants 100 rolls, BlueWallet packs bits without hashing, and SeedSigner itself used a different method before February 2022. The same rolls can produce completely unrelated wallets on two devices. Your recovery words are the backup; the column of rolls in your notebook is not.</p>
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

<p class="colophon">Part of <strong>SelfCustody.ca</strong>. The full procedure and the rules that matter more than this tool does are in <a href="guides/dice-entropy.html" data-site-link>Roll the dice</a> and <a href="guides/quickstart.html" data-site-link>Intro to Self Custody</a>.</p>

</main>

<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <h3 class="footer-brand"><span class="mark" aria-hidden="true"></span><span>SelfCustody.ca</span></h3>
        <p>Clear, practical guidance to self custody your bitcoin. Learn the basics, test your backups, and keep control of your keys.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <ul class="footer-links">
          <li><a href="index.html" data-site-link>Home</a></li>
          <li><a href="guides.html" data-site-link>Guides</a></li>
          <li><a href="devices.html" data-site-link>Devices</a></li>
          <li><a href="software.html" data-site-link>Software</a></li>
          <li><a href="exchanges.html" data-site-link>Exchanges</a></li>
          <li><a href="glossary.html" data-site-link>Glossary</a></li>
          <li><a href="dashboard.html" data-site-link>Dashboard</a></li>
          <li><a href="contact.html" data-site-link>Get Help</a></li>
        </ul>
      </div>
      <aside class="footer-warning" aria-label="Important security warning">
        <div class="footer-warning-mark" aria-hidden="true">!</div>
        <div>
          <h4>Important!</h4>
          <p><strong>NEVER</strong> share recovery words, private keys, PINs, or passphrases. This site provides education, not financial, tax, or legal advice.</p>
        </div>
      </aside>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span id="year">2026</span> SelfCustody.ca</span>
      <span><a href="mailto:info@selfcustody.ca">info@selfcustody.ca</a></span>
    </div>
  </div>
</footer>

<script>
${core}
</script>
<script>
'use strict';
(function () {
  const C = EntropyCore;
  const WORDLIST_RAW = '${wordlist}';
${selfTest()}
${ui()}
})();
</script>
</body>
</html>
`;

  /* The size next to the download button is filled in against the fully
     assembled page rather than hand-maintained, so it can never drift from
     the file a reader actually receives. Rounding to the nearest 10 KB before
     display absorbs the few bytes {{FILESIZE}} itself adds to the very
     string it is describing -- the one self-reference this page makes. */
  const kb = Math.round(html.length / 1024 / 10) * 10;
  return html.replace('{{FILESIZE}}', `~${kb} KB`);
}

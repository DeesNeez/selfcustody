/* Guide library for selfcustody.ca -- data, not markup.

   Everything on guides.html and every page under docs/guides/ is derived from
   the `guides` array below. Adding a guide means appending one object here;
   render.mjs writes the page, the hub card, the finder filters, and the
   sitemap entry from it. No hand-maintained <head>, no FILES entry.

   Consumed by build/content.mjs (the hub) and build/render.mjs (the pages). */

/* Sections on the hub, in the order they appear. `key` is also the section's
   anchor id, so devices.html can deep-link straight to guides.html#devices. */
const guideCategories = [
  {
    key: "fundamentals",
    label: "Start here",
    eyebrow: "Foundations",
    heading: "Understand the system before you move money",
    blurb: "The vocabulary and the decisions everything else assumes you have already made."
  },
  {
    key: "devices",
    label: "Devices",
    eyebrow: "Hardware",
    heading: "First-time setup for your signing device",
    blurb: "Pick your device for a focused walkthrough, then return for the features worth turning on once the basics work.",
    compare: ["Compare hardware", "devices.html"]
  },
  {
    key: "software",
    label: "Software",
    eyebrow: "Wallets",
    heading: "Drive the wallet software",
    blurb: "Creating wallets, pairing hardware, verifying addresses, and the features past the send button.",
    compare: ["Compare wallet software", "software.html"]
  },
  {
    key: "exchanges",
    label: "Exchanges",
    eyebrow: "Buying and withdrawing",
    heading: "Get bitcoin off the platform",
    blurb: "Platform-specific withdrawal walkthroughs and the Canadian recordkeeping around them.",
    compare: ["Compare purchase routes", "exchanges.html"]
  },
  {
    key: "advanced",
    label: "Techniques",
    eyebrow: "Advanced techniques",
    heading: "Multisig, passphrases, privacy, and inheritance",
    blurb: "Earn this section. Every option here adds a way to lose access as well as a way to protect it."
  },
  /* Last on purpose. Everything above is something to go and do; this is
     background for afterwards, so it sits at the end rather than between a
     reader and the setup guides they came for. */
  {
    key: "concepts",
    label: "Concepts",
    eyebrow: "How it works",
    heading: "The machinery underneath the wallet",
    blurb: "Further reading rather than instructions. Nothing here asks you to change your setup — it explains why the setup looks the way it does."
  }
];

/* Finder question 1. `key` is matched against a guide's `goals`. */
const guideGoals = [
  { key: "setup", label: "Set up a device or wallet", icon: "bi-usb-drive" },
  { key: "withdraw", label: "Get bitcoin off an exchange", icon: "bi-arrow-left-right" },
  { key: "harden", label: "Harden what I already have", icon: "bi-shield-lock" },
  { key: "recover", label: "Recover or restore a wallet", icon: "bi-arrow-counterclockwise" },
  { key: "learn", label: "Understand how this works", icon: "bi-signpost-split" }
];

/* Finder question 3. `shows` lists the guide levels this answer keeps, so the
   filter stays monotonic: saying you are advanced never hides the basics. */
const guideLevels = [
  { key: "new", label: "Beginner", shows: ["beginner"] },
  { key: "some", label: "Intermediate", shows: ["beginner", "intermediate"] },
  { key: "advanced", label: "Advanced", shows: ["beginner", "intermediate", "advanced"] }
];

/* Finder question 2. `href` deep-links back to the comparison page entry, so a
   guide card can always point at "what is this thing" as well as "how do I use
   it". The exchange articles have no anchors of their own yet, so those point
   at the comparison table. */
const guideProducts = [
  { key: "coldcard", label: "COLDCARD", category: "devices", href: "devices.html#coldcard", image: "assets/img/device-logos/coldcard.svg" },
  { key: "passport", label: "Passport", category: "devices", href: "devices.html#passport", image: "assets/img/device-logos/foundation.svg" },
  { key: "jade", label: "Blockstream Jade", category: "devices", href: "devices.html#jade", image: "assets/img/device-logos/jade.svg" },
  { key: "bitbox", label: "BitBox02", category: "devices", href: "devices.html#bitbox", image: "assets/img/device-logos/bitbox.png" },
  { key: "trezor", label: "Trezor", category: "devices", href: "devices.html#trezor", image: "assets/img/device-logos/trezor.png" },
  { key: "seedsigner", label: "SeedSigner", category: "devices", href: "devices.html#seedsigner", image: "assets/img/device-logos/seedsigner.svg" },
  { key: "krux", label: "Krux", category: "devices", href: "devices.html#krux", image: "assets/img/device-logos/krux.png" },
  { key: "ledger", label: "Ledger", category: "devices", href: "devices.html#ledger", image: "assets/img/device-logos/ledger.svg" },
  { key: "bitkey", label: "Bitkey", category: "devices", href: "devices.html#bitkey-device", image: "assets/img/device-logos/bitkey.svg" },
  { key: "tapsigner", label: "TAPSIGNER", category: "devices", href: "coinkite.html#tapsigner", image: "assets/img/device-logos/tapsigner.svg" },
  { key: "satscard", label: "SATSCARD", category: "devices", href: "coinkite.html#satscard", image: "assets/img/device-logos/satscard.svg" },

  { key: "sparrow", label: "Sparrow", category: "software", href: "software.html#sparrow", image: "assets/img/software/sparrow.png" },
  { key: "nunchuk", label: "Nunchuk", category: "software", href: "software.html#nunchuk", image: "assets/img/software/nunchuk.png" },
  { key: "cove", label: "Cove", category: "software", href: "software.html#cove", image: "assets/img/software/cove.png" },
  { key: "electrum", label: "Electrum", category: "software", href: "software.html#electrum", image: "assets/img/software/electrum.png" },
  { key: "bluewallet", label: "BlueWallet", category: "software", href: "software.html#bluewallet", image: "assets/img/software/bluewallet.png" },
  { key: "wasabi", label: "Wasabi", category: "software", href: "software.html#wasabi", image: "assets/img/software/wasabi.svg" },
  { key: "specter", label: "Specter", category: "software", href: "software.html#specter", image: "assets/img/software/specter.png" },

  { key: "shakepay", label: "Shakepay", category: "exchanges", href: "exchanges.html#shakepay", image: "assets/img/exchanges/shakepay.png" },
  { key: "bitbuy", label: "Bitbuy", category: "exchanges", href: "exchanges.html#bitbuy", image: "assets/img/exchanges/bitbuy.png" },
  { key: "bullbitcoin", label: "Bull Bitcoin", category: "exchanges", href: "exchanges.html#bullbitcoin", image: "assets/img/exchanges/bull-bitcoin.png" },
  { key: "bitcoinwell", label: "Bitcoin Well", category: "exchanges", href: "exchanges.html#bitcoinwell", image: "assets/img/exchanges/bitcoin-well.png" },
  { key: "kraken", label: "Kraken", category: "exchanges", href: "exchanges.html#kraken", image: "assets/img/exchanges/kraken.png" },
  { key: "ndax", label: "Ndax", category: "exchanges", href: "exchanges.html#ndax", image: "assets/img/exchanges/ndax.png" },

  { key: "unchained", label: "Unchained", category: "collaborative", href: "https://www.unchained.com/", image: "assets/img/custody/unchained-icon.svg", external: true },
  { key: "casa", label: "Casa", category: "collaborative", href: "https://casa.io/", image: "assets/img/custody/casa-icon-transparent.png", external: true }
];

const levelLabels = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

/* ---- body helpers -------------------------------------------------------
   Guide bodies are written as prose: plain <h2> and <p>, with these for the
   parts that repeat. Every guide uses layout: "article" -- the numbered
   .sc-detail boxes this file used to emit read as a form to fill in rather
   than something to sit and read, so where a sequence matters it is carried by
   a numbered heading inside the prose instead. */

const checklist = items => `<ul class="sc-check-list">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
const cautions = items => `<ul class="sc-caution-list">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
const callout = (title, body) => `<div class="sc-callout mt-4"><h3>${title}</h3><p>${body}</p></div>`;
const official = (url, label = "Official documentation") =>
  `<a class="sc-text-link" href="${url}" target="_blank" rel="noopener">${label} <i class="bi bi-arrow-up-right"></i></a>`;

/* "What you need before you start" -- rendered above step one on every guide
   that supplies it, because the most common failure is discovering halfway in
   that the microSD card or the spare device was never on the table. */
const prerequisites = items => `
  <div class="sc-guide-prereq">
    <h2>Before you start</h2>
    ${checklist(items)}
  </div>`;

/* ---- article furniture --------------------------------------------------
   Guides that explain rather than instruct are written as prose, not as a
   column of numbered boxes. These are the things that break up that prose. */

const figure = ({ src, alt, caption, width, height }) => `
  <figure class="sc-figure">
    <img src="${src}" alt="${alt}" width="${width}" height="${height}" loading="lazy">
    ${caption ? `<figcaption>${caption}</figcaption>` : ""}
  </figure>`;

/* A shot that has not been taken yet. Renders as a labelled frame describing
   the picture that belongs there, so the gap is a brief for the photographer
   rather than an invisible omission -- and so the page reads as finished
   enough to publish while the images are still being gathered. */
const figureSlot = ({ shot, caption, ratio = "16 / 9", icon = "bi-camera" }) => `
  <figure class="sc-figure sc-figure-slot">
    <div class="sc-figure-slot-frame" style="aspect-ratio: ${ratio}">
      <i class="bi ${icon}" aria-hidden="true"></i>
      <p class="sc-figure-slot-shot">${shot}</p>
      <p class="sc-figure-slot-note">Image to come</p>
    </div>
    ${caption ? `<figcaption>${caption}</figcaption>` : ""}
  </figure>`;

const pullQuote = text => `<blockquote class="sc-pull-quote"><p>${text}</p></blockquote>`;

/* ---- the single-sig vs multisig diagram ---------------------------------

   Two panels: one key with one backup in one place, against three keys in
   three places where any two can spend. Drawn rather than photographed
   because the point is the shape of the dependency, not the hardware.

   The strip along the bottom is the part most versions of this diagram leave
   out, and it is the thing this guide is actually about: the wallet
   configuration is required to rebuild and is not contained in any of the
   keys. Semantic colours are the same red and green already used by the
   level badges, so the page keeps one vocabulary. */
const multisigDiagram = () => {
  const box = (x, y, w, h, title, sub, cls = "") => `
    <g>
      <rect class="sc-dg-box ${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>
      <text class="sc-dg-box-title" x="${x + 14}" y="${y + (sub ? 22 : 28)}">${title}</text>
      ${sub ? `<text class="sc-dg-box-sub" x="${x + 14}" y="${y + 39}">${sub}</text>` : ""}
    </g>`;

  /* Elbow connectors: out of each key, along a shared spine, into the wallet. */
  const elbow = (fromY, toY = 326, x1 = 232, spine = 316, x2 = 404) =>
    fromY === toY
      ? `<path class="sc-dg-line" d="M${x1} ${fromY}H${x2}"/>`
      : `<path class="sc-dg-line" d="M${x1} ${fromY}H${spine}V${toY}H${x2}"/>`;

  /* Panels: A 1-151, B 168-426, flag 442-514. Every box and every line of
     text was measured against those bounds rather than eyeballed -- the
     right-hand column of panel B has only ~137px, which is about twenty
     characters at this size, so its lines are deliberately short. */
  return `
    <figure class="sc-figure sc-diagram-figure">
      <svg class="sc-dg-svg" viewBox="0 0 720 520" role="img" aria-labelledby="ms-dg-title ms-dg-desc" preserveAspectRatio="xMidYMid meet">
        <title id="ms-dg-title">Single-signature compared with 2-of-3 multisig</title>
        <desc id="ms-dg-desc">Single-signature: one hardware wallet and one seed backup, both inside one location, so any single loss or theft takes the wallet. 2-of-3 multisig: three keys in three separate locations feeding one wallet, where any two of the three can spend, so losing one key changes nothing. Rebuilding the multisig also requires the wallet configuration, which is not stored in any of the keys.</desc>

        <rect class="sc-dg-panel sc-dg-panel-risk" x="1" y="1" width="718" height="150" rx="12"/>
        <text class="sc-dg-panel-title" x="24" y="34">Single-signature</text>
        <text class="sc-dg-panel-sub" x="24" y="56">1 key &middot; 1 backup &middot; 1 location</text>

        <rect class="sc-dg-zone" x="24" y="72" width="384" height="62" rx="8"/>
        <text class="sc-dg-zone-label" x="36" y="90">LOCATION 1</text>
        ${box(44, 96, 150, 30, "Hardware wallet", null)}
        <path class="sc-dg-line" d="M194 111H238"/>
        ${box(238, 96, 150, 30, "Seed backup", null)}

        <text class="sc-dg-verdict sc-dg-verdict-risk" x="440" y="92">Single point of failure</text>
        <text class="sc-dg-note" x="440" y="114">One fire, one burglary, or one</text>
        <text class="sc-dg-note" x="440" y="130">mistake takes the whole wallet.</text>

        <rect class="sc-dg-panel sc-dg-panel-safe" x="1" y="168" width="718" height="258" rx="12"/>
        <text class="sc-dg-panel-title" x="24" y="201">2-of-3 multisig</text>
        <text class="sc-dg-panel-sub" x="24" y="223">3 keys &middot; 3 locations &middot; any 2 can spend</text>

        ${box(24, 240, 208, 48, "Hardware wallet A", "Location 1")}
        ${box(24, 302, 208, 48, "Hardware wallet B", "Location 2")}
        ${box(24, 364, 208, 48, "Third key", "Location 3 or trusted person")}

        ${elbow(264)}
        ${elbow(326)}
        ${elbow(388)}

        ${box(404, 302, 150, 48, "2-of-3 wallet", "any 2 signatures", "sc-dg-box-accent")}

        <text class="sc-dg-verdict sc-dg-verdict-safe" x="574" y="286">No single point</text>
        <text class="sc-dg-note" x="574" y="308">Different keys,</text>
        <text class="sc-dg-note" x="574" y="324">devices, locations.</text>
        <text class="sc-dg-note" x="574" y="352">One key lost or</text>
        <text class="sc-dg-note" x="574" y="368">stolen changes</text>
        <text class="sc-dg-note" x="574" y="384">nothing.</text>

        <rect class="sc-dg-panel sc-dg-panel-flag" x="1" y="442" width="718" height="72" rx="12"/>
        <text class="sc-dg-flag-title" x="24" y="468">The fourth thing, which is not a key</text>
        <text class="sc-dg-note" x="24" y="488">Rebuilding a multisig also needs the wallet configuration &mdash; the policy, the</text>
        <text class="sc-dg-note" x="24" y="504">derivation paths, and all three public keys. No seed phrase contains it.</text>
      </svg>
      <figcaption>Multisig removes the single seed as the single point of failure. It adds one new dependency in exchange, shown along the bottom, and that is the one this guide keeps returning to.</figcaption>
    </figure>`;
};

/* ---- the entropy chart --------------------------------------------------

   How much randomness survives as a die gets less fair, for both seed lengths.
   The argument it makes: a 24-word seed keeps enormous headroom even when the
   die is badly skewed, while a 12-word seed starts level with the 128-bit mark
   and gives ground immediately -- which is the case for rolling 99 rather
   than 50 when you are doing this by hand.

   Drawn as inline SVG rather than a library: the site ships no charting code,
   and this has to survive with the page's CSS and nothing else.

   Series colours are the two brand accents stepped down into the dark-mode
   lightness band (L 0.48-0.67) and checked for colour-vision separation --
   #d96f00 against #2e9e78 clears the adjacent-pair floor comfortably. They are
   set in the stylesheet, not here, so the palette stays in one place. */

const ENTROPY_ROWS = [
  { scenario: ["Perfectly", "fair die"], long: "A perfectly fair die", w24: 255.9, w12: 128.0 },
  { scenario: ["Cheap die,", "2% bias"], long: "A cheap die, 2% bias", w24: 253.1, w12: 127.8 },
  { scenario: ["One face", "8% high"], long: "One face 8% high", w24: 244.9, w12: 123.7 },
  { scenario: ["One face", "20% high"], long: "One face 20% high", w24: 229.9, w12: 116.1 },
  { scenario: ["One face", "50% high"], long: "One face 50% high", w24: 198.0, w12: 100.0 }
];

const entropyChart = () => {
  const L = 56, R = 704, T = 32, B = 320, MAX = 256;
  const y = v => +(B - (v / MAX) * (B - T)).toFixed(1);
  const band = (R - L) / ENTROPY_ROWS.length;
  const BAR = 24, GAP = 2, RAD = 4;

  /* Square at the baseline, 4px rounded at the data end. */
  const bar = (x, value, cls) => {
    const top = y(value);
    return `<path class="${cls}" d="M${x} ${B}L${x} ${(top + RAD).toFixed(1)}Q${x} ${top} ${x + RAD} ${top}L${x + BAR - RAD} ${top}Q${x + BAR} ${top} ${x + BAR} ${(top + RAD).toFixed(1)}L${x + BAR} ${B}Z"/>`;
  };

  /* A value normally sits 8px above the bar cap. Where that puts it on top of
     a threshold rule -- which happens to the 12-word worst case, whose cap is
     just below the 112 line -- it moves inside the bar instead. Measured
     rather than nudged: the text band is the 13px cap height above the
     baseline, and a rule falling inside that band is a collision. Inside
     labels take the dark ink, which clears contrast on both series fills where
     white would not. */
  const THRESHOLDS = [128, 112];
  const value = (cx, v) => {
    const cap = y(v);
    const clash = THRESHOLDS.some(t => y(t) >= cap - 17.4 && y(t) <= cap - 8);
    return clash
      ? `<text class="sc-chart-value is-inside" x="${cx}" y="${(cap + 17).toFixed(1)}">${Math.round(v)}</text>`
      : `<text class="sc-chart-value" x="${cx}" y="${(cap - 8).toFixed(1)}">${Math.round(v)}</text>`;
  };

  const bars = ENTROPY_ROWS.map((row, i) => {
    const centre = L + band * i + band / 2;
    const xa = +(centre - BAR - GAP / 2).toFixed(1);
    const xb = +(centre + GAP / 2).toFixed(1);
    /* Label the ends only -- the best case and the worst case carry the
       argument, and a number over all ten bars would just be noise. */
    const label = i === 0 || i === ENTROPY_ROWS.length - 1
      ? value((xa + BAR / 2).toFixed(1), row.w24) + value((xb + BAR / 2).toFixed(1), row.w12)
      : "";
    return `${bar(xa, row.w24, "sc-chart-bar-24")}${bar(xb, row.w12, "sc-chart-bar-12")}${label}`;
  }).join("");

  const xLabels = ENTROPY_ROWS.map((row, i) => {
    const centre = +(L + band * i + band / 2).toFixed(1);
    return `<text class="sc-chart-axis-text" x="${centre}" y="342" text-anchor="middle">${row.scenario[0]}<tspan x="${centre}" dy="14">${row.scenario[1]}</tspan></text>`;
  }).join("");

  /* Gridlines skip 128: the threshold rule already sits there, and drawing
     both would double the ink at the one height that matters most. */
  const grid = [64, 192, 256].map(v =>
    `<line class="sc-chart-grid" x1="${L}" y1="${y(v)}" x2="${R}" y2="${y(v)}"/>
     <text class="sc-chart-axis-text" x="${L - 10}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${v}</text>`).join("");

  /* Dashed here is deliberate and is the one place dashing is right: these are
     genuine thresholds, so keeping the gridlines solid preserves the contrast
     between chrome and meaning. */
  const thresholds = [
    [128, "128"],
    [112, "112"]
  ].map(([v, text]) =>
    `<line class="sc-chart-threshold" x1="${L}" y1="${y(v)}" x2="${R}" y2="${y(v)}"/>
     <text class="sc-chart-threshold-text" x="${L - 10}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${text}</text>`).join("");

  const rows = ENTROPY_ROWS.map(r =>
    `<tr><th scope="row">${r.long}</th><td>${r.w24.toFixed(1)}</td><td>${r.w12.toFixed(1)}</td></tr>`).join("");

  return `
    <figure class="sc-figure sc-chart-figure">
      <div class="sc-chart-legend">
        <span><i class="sc-chart-key sc-chart-key-24" aria-hidden="true"></i>24 words &middot; 99 rolls</span>
        <span><i class="sc-chart-key sc-chart-key-12" aria-hidden="true"></i>12 words &middot; 50 rolls</span>
        <span><i class="sc-chart-key sc-chart-key-line" aria-hidden="true"></i>Security thresholds</span>
      </div>

      <svg class="sc-chart-svg" viewBox="0 0 720 400" role="img" aria-labelledby="entropy-chart-title entropy-chart-desc" preserveAspectRatio="xMidYMid meet">
        <title id="entropy-chart-title">Randomness retained as a die becomes less fair</title>
        <desc id="entropy-chart-desc">A 24-word seed from 99 rolls stays between 256 and 198 bits across every scenario. A 12-word seed from 50 rolls starts at 128 bits and falls to 100 bits with a badly skewed die, dropping below both the 128-bit and 112-bit thresholds.</desc>
        ${grid}
        ${thresholds}
        <line class="sc-chart-axis" x1="${L}" y1="${B}" x2="${R}" y2="${B}"/>
        <text class="sc-chart-axis-text" x="${L - 10}" y="${B + 4}" text-anchor="end">0</text>
        ${bars}
        ${xLabels}
        <text class="sc-chart-axis-title" x="14" y="176" transform="rotate(-90 14 176)" text-anchor="middle">Bits of randomness</text>
      </svg>

      <figcaption>Even a die skewed far beyond anything you would own leaves a 24-word wallet with more randomness than a perfect 12-word one. The 12-word bar, by contrast, starts level with the 128-bit mark and loses ground straight away.</figcaption>

      <div class="sc-table-wrap">
        <table class="sc-table">
          <caption>Bits of randomness by die fairness</caption>
          <thead><tr><th scope="col">Die</th><th scope="col">24 words (99 rolls)</th><th scope="col">12 words (50 rolls)</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </figure>`;
};

/* ---- the BIP85 derivation tree ------------------------------------------

   One master seed fanning out into independent child seeds, each addressed by
   an index. Drawn rather than described because the shape is the whole idea:
   the arrows only point downward, and the thing that makes a child reachable
   again is not stored in the child.

   Two details are deliberate. The one-way band across the middle is where
   people's intuition usually fails -- they assume a relationship that can be
   walked in both directions, and it cannot. The flag panel along the bottom
   mirrors the one in the multisig diagram on purpose: both guides are really
   about a record that no seed phrase contains, and a reader who has seen one
   should recognise the other. */
const bip85Diagram = () => {
  const box = (x, y, w, h, title, sub, cls = "") => `
    <g>
      <rect class="sc-dg-box ${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>
      <text class="sc-dg-box-title" x="${x + 14}" y="${y + 24}">${title}</text>
      ${sub ? `<text class="sc-dg-box-sub" x="${x + 14}" y="${y + 42}">${sub}</text>` : ""}
    </g>`;

  /* Children sit at x 35 / 265 / 495, 190 wide, so their centres land on
     130 / 360 / 590 -- the middle drop is collinear with the master's spine,
     which is correct rather than a coincidence to design around. */
  const drop = x => `<path class="sc-dg-line" d="M${x} 158V186"/>`;

  return `
    <figure class="sc-figure sc-diagram-figure">
      <svg class="sc-dg-svg" viewBox="0 0 720 470" role="img" aria-labelledby="b85-dg-title b85-dg-desc" preserveAspectRatio="xMidYMid meet">
        <title id="b85-dg-title">How BIP85 derives child seeds from one master seed</title>
        <desc id="b85-dg-desc">A single master seed sits at the top. Below it, three child seeds are derived at index 0, 1 and 2 — an everyday wallet, a savings wallet, and a seed handed to a family member — and the fan continues indefinitely. Derivation runs downward only: a child seed reveals nothing about the master seed or about its siblings. Along the bottom, the record that no child seed contains: which index produced it, at what word count, and what it was for.</desc>

        <text class="sc-dg-panel-title" x="24" y="30">One seed, backed up once</text>
        <text class="sc-dg-panel-sub" x="24" y="52">Every wallet below is derived from it on demand</text>

        ${box(260, 76, 200, 52, "Master seed", "24 words &middot; the only backup", "sc-dg-box-accent")}
        <path class="sc-dg-line" d="M360 128V158"/>
        <path class="sc-dg-line" d="M130 158H590"/>

        ${drop(130)}${drop(360)}${drop(590)}

        ${box(35, 186, 190, 58, "Everyday wallet", "index 0&#8242; &middot; 12 words")}
        ${box(265, 186, 190, 58, "Savings wallet", "index 1&#8242; &middot; 24 words")}
        ${box(495, 186, 190, 58, "Handed to a niece", "index 2&#8242; &middot; 12 words")}

        <text class="sc-dg-note" x="360" y="268" text-anchor="middle">&hellip; and index 3&#8242;, 4&#8242;, 5&#8242;, indefinitely, all from the same backup</text>

        <rect class="sc-dg-panel sc-dg-panel-safe" x="1" y="288" width="718" height="72" rx="12"/>
        <text class="sc-dg-verdict sc-dg-verdict-safe" x="24" y="316">Derivation runs one way</text>
        <text class="sc-dg-note" x="24" y="338">A child seed is an ordinary seed. Holding it reveals nothing about the master</text>
        <text class="sc-dg-note" x="24" y="354">seed above it, and nothing about any of its siblings.</text>

        <rect class="sc-dg-panel sc-dg-panel-flag" x="1" y="376" width="718" height="86" rx="12"/>
        <text class="sc-dg-flag-title" x="24" y="404">What no child seed contains</text>
        <text class="sc-dg-note" x="24" y="426">Which index produced it, at which word count, and what it was for. That record</text>
        <text class="sc-dg-note" x="24" y="442">lives only where you write it &mdash; and without it the master alone will not find</text>
        <text class="sc-dg-note" x="24" y="458">its way back to a particular wallet.</text>
      </svg>
      <figcaption>The appeal is the top of the picture: one seed to protect, one backup to keep alive. The obligation is the strip along the bottom, and it is the part that gets skipped.</figcaption>
    </figure>`;
};

/* ---- the double-spend fork ----------------------------------------------

   A double-spend attempt drawn as what it actually is: not a coin cloned, but
   two mutually exclusive versions of history competing to be the real one.
   The shared trunk is the past both sides agree on; the fork is the moment
   they stop agreeing.

   The asymmetry is the argument, so the two branches are deliberately drawn
   at different lengths rather than symmetrically -- the attacker is not being
   out-voted, they are being out-built. The flag panel along the bottom is the
   part most explanations of the 51% attack omit, and it is the reason running
   a node is worth the trouble. */
const doubleSpendDiagram = () => {
  /* Blocks carry no text. Numbering them invites the reader to count blocks,
     and counting blocks is the misconception this diagram exists to correct
     -- what is being compared along each branch is work, not length. */
  const blk = (x, y, cls = "") =>
    `<rect class="sc-dg-box ${cls}" x="${x}" y="${y}" width="62" height="40" rx="6"/>`;

  /* Branch geometry: trunk ends at x=154, both branches begin at x=200, and
     the elbow turns at x=178 so the two connectors are mirror images. */
  const honest = [200, 272, 344, 416];
  const attack = [200, 272];
  const join = (xs, y) => xs.slice(1)
    .map(x => `<path class="sc-dg-line" d="M${x - 10} ${y}H${x}"/>`).join("");

  return `
    <figure class="sc-figure sc-diagram-figure">
      <svg class="sc-dg-svg" viewBox="0 0 720 480" role="img" aria-labelledby="ds-dg-title ds-dg-desc" preserveAspectRatio="xMidYMid meet">
        <title id="ds-dg-title">A double-spend attempt as two competing chains</title>
        <desc id="ds-dg-desc">A shared chain of blocks splits into two branches. The upper branch is the network's chain, containing the payment to the merchant, and has four blocks built on top of it. The lower branch is the attacker's hidden chain, containing the same coin paid back to themselves, and has only two blocks. The chain carrying the most accumulated work is the one every node treats as real, so the attacker must out-build the entire network to replace it. Along the bottom: even a majority attacker cannot spend coins whose keys they do not hold, create bitcoin out of nothing, or change the 21 million limit, because full nodes reject invalid blocks regardless of the work behind them.</desc>

        <text class="sc-dg-panel-title" x="24" y="30">The same bitcoin, spent twice</text>
        <text class="sc-dg-panel-sub" x="24" y="52">Two versions of history. Only one of them survives.</text>

        ${blk(20, 200)}${blk(92, 200)}
        <path class="sc-dg-line" d="M82 220H92"/>
        <text class="sc-dg-note" x="20" y="262">Agreed past</text>

        <path class="sc-dg-line" d="M154 220H178V132H200"/>
        <path class="sc-dg-line" d="M154 220H178V308H200"/>

        <text class="sc-dg-verdict sc-dg-verdict-safe" x="200" y="100">The network&rsquo;s chain &mdash; paid to the merchant</text>
        ${honest.map(x => blk(x, 112, "sc-dg-box-accent")).join("")}
        ${join(honest, 132)}
        <text class="sc-dg-note" x="200" y="176">Four blocks of work sit on top of that payment, and every</text>
        <text class="sc-dg-note" x="200" y="192">new block makes undoing it more expensive than the last.</text>

        <text class="sc-dg-verdict sc-dg-verdict-safe" x="360" y="234" text-anchor="middle">The chain with the most accumulated work wins</text>
        <text class="sc-dg-note" x="360" y="254" text-anchor="middle">Not the longest chain, and not the transaction anyone saw first &mdash; the most work.</text>

        ${attack.map(x => blk(x, 288)).join("")}
        ${join(attack, 308)}
        <text class="sc-dg-verdict sc-dg-verdict-risk" x="200" y="350">The attacker&rsquo;s hidden chain &mdash; paid back to themselves</text>
        <text class="sc-dg-note" x="200" y="372">Two blocks. To replace the chain above it, this one has to be built faster</text>
        <text class="sc-dg-note" x="200" y="388">than every other miner in the world combined, and keep winning.</text>

        <rect class="sc-dg-panel sc-dg-panel-flag" x="1" y="404" width="718" height="74" rx="12"/>
        <text class="sc-dg-flag-title" x="24" y="430">What even a winning attacker cannot do</text>
        <text class="sc-dg-note" x="24" y="452">Spend coins whose keys they do not hold, create bitcoin out of nothing, or raise the 21</text>
        <text class="sc-dg-note" x="24" y="468">million limit. Your own node rejects invalid blocks however much work is stacked behind them.</text>
      </svg>
      <figcaption>Nothing is copied and nothing is forged. Two honest-looking histories are offered to the network, and the one that cost more to produce is the one that survives.</figcaption>
    </figure>`;
};

/* ---- the transaction lifecycle ------------------------------------------

   The five states a payment passes through, and the line partway along that
   people actually care about: before it, the transaction can still be changed
   or forgotten; after it, changing it means out-mining the network.

   The two zones are drawn differently on purpose -- dashed for the provisional
   half, solid for the settled half -- so the distinction survives being read
   in greyscale or by someone who does not separate the two accent colours.
   The flag panel carries the point the rest of the site depends on: the key
   never travels, only the signature does. */
const txLifecycleDiagram = () => {
  /* Five stages on a 140px stride: 124 wide with 16px gaps, margins of 18. */
  const stage = (x, title, sub) => `
    <g>
      <rect class="sc-dg-box" x="${x}" y="96" width="124" height="62" rx="8"/>
      <text class="sc-dg-box-title" x="${x + 62}" y="122" text-anchor="middle">${title}</text>
      <text class="sc-dg-box-sub" x="${x + 62}" y="141" text-anchor="middle">${sub}</text>
    </g>`;

  const hop = x => `<path class="sc-dg-line" d="M${x} 127H${x + 16}"/>`;

  return `
    <figure class="sc-figure sc-diagram-figure">
      <svg class="sc-dg-svg" viewBox="0 0 720 400" role="img" aria-labelledby="tx-dg-title tx-dg-desc" preserveAspectRatio="xMidYMid meet">
        <title id="tx-dg-title">The five stages of a bitcoin transaction</title>
        <desc id="tx-dg-desc">A transaction is signed on your device, broadcast to peers, waits in the mempool, is included in a block, and is then buried under further blocks. The first three stages are provisional: the fee can be raised, the transaction replaced, or it can expire unnoticed. From inclusion in a block onward it is settled, and undoing it means out-mining the network, at a cost that rises with every block. Throughout all five stages the private key never leaves the signing device — only the signature travels.</desc>

        <text class="sc-dg-panel-title" x="24" y="30">What happens after you press send</text>
        <text class="sc-dg-panel-sub" x="24" y="52">Five states, and one line that matters more than the others</text>

        ${stage(18, "Signed", "on your device")}
        ${stage(158, "Broadcast", "to your peers")}
        ${stage(298, "Mempool", "waiting, unsettled")}
        ${stage(438, "In a block", "1 confirmation")}
        ${stage(578, "Buried", "6+ confirmations")}

        ${hop(142)}${hop(282)}${hop(422)}${hop(562)}

        <rect class="sc-dg-zone" x="18" y="180" width="404" height="40" rx="8"/>
        <text class="sc-dg-verdict sc-dg-verdict-risk" x="220" y="205" text-anchor="middle">Still changeable</text>

        <rect class="sc-dg-panel sc-dg-panel-safe" x="438" y="180" width="264" height="40" rx="8"/>
        <text class="sc-dg-verdict sc-dg-verdict-safe" x="570" y="205" text-anchor="middle">Settled, and hardening</text>

        <text class="sc-dg-note" x="18" y="246">The fee can be raised, the transaction can be replaced, and if</text>
        <text class="sc-dg-note" x="18" y="262">nobody mines it, it can quietly expire and be forgotten.</text>

        <text class="sc-dg-note" x="438" y="246">Undoing it now means out-mining</text>
        <text class="sc-dg-note" x="438" y="262">the network, and the price of that</text>
        <text class="sc-dg-note" x="438" y="278">climbs with every block on top.</text>

        <rect class="sc-dg-panel sc-dg-panel-flag" x="1" y="302" width="718" height="82" rx="12"/>
        <text class="sc-dg-flag-title" x="24" y="328">What never moves at any stage</text>
        <text class="sc-dg-note" x="24" y="350">Your private key. It stays on the signing device from beginning to end &mdash; what travels</text>
        <text class="sc-dg-note" x="24" y="366">across the network is a signature, which proves the key exists without revealing it.</text>
      </svg>
      <figcaption>The interesting boundary is between the third and fourth box. Everything to its left is a proposal; everything to its right is history, held in place by the cost of rewriting it.</figcaption>
    </figure>`;
};

/* ---- what one transaction reveals ---------------------------------------

   A deliberately ordinary payment, annotated with what a stranger reads off
   it. Chain analysis is usually explained abstractly, which makes it sound
   like a capability someone might have; drawn against real amounts it is
   obviously just arithmetic anyone can do.

   The two inferences shown are the two that do most of the work in practice:
   inputs to one transaction share an owner, and the non-round output is the
   change. Neither requires any special access. */
const chainAnalysisDiagram = () => {
  const box = (x, y, w, title, sub, cls = "") => `
    <g>
      <rect class="sc-dg-box ${cls}" x="${x}" y="${y}" width="${w}" height="54" rx="8"/>
      <text class="sc-dg-box-title" x="${x + 14}" y="${y + 23}">${title}</text>
      <text class="sc-dg-box-sub" x="${x + 14}" y="${y + 41}">${sub}</text>
    </g>`;

  return `
    <figure class="sc-figure sc-diagram-figure">
      <svg class="sc-dg-svg" viewBox="0 0 720 340" role="img" aria-labelledby="ca-dg-title ca-dg-desc" preserveAspectRatio="xMidYMid meet">
        <title id="ca-dg-title">What a single ordinary transaction reveals</title>
        <desc id="ca-dg-desc">A transaction spends two inputs — 0.4 BTC withdrawn from an exchange and 0.15 BTC received from a friend — and creates two outputs: a round 0.5 BTC payment and an uneven 0.0499 BTC remainder. Any observer can infer that both inputs were controlled by the same person, and that the uneven output is change returning to that person, because payments tend to be round and change is whatever is left over.</desc>

        <text class="sc-dg-panel-title" x="24" y="30">One perfectly ordinary payment</text>
        <text class="sc-dg-panel-sub" x="24" y="52">Nothing here is a mistake. This is what a normal transaction looks like.</text>

        ${box(18, 88, 200, "0.4 BTC", "withdrawn from an exchange")}
        ${box(18, 158, 200, "0.15 BTC", "received from a friend")}

        <path class="sc-dg-line" d="M218 115H245V150H272"/>
        <path class="sc-dg-line" d="M218 185H245V150H272"/>

        <rect class="sc-dg-box sc-dg-box-accent" x="272" y="118" width="136" height="64" rx="8"/>
        <text class="sc-dg-box-title" x="340" y="145" text-anchor="middle">One payment</text>
        <text class="sc-dg-box-sub" x="340" y="164" text-anchor="middle">2 in, 2 out</text>

        <path class="sc-dg-line" d="M408 150H435V115H462"/>
        <path class="sc-dg-line" d="M408 150H435V185H462"/>

        ${box(462, 88, 240, "0.5 BTC &mdash; the payment", "to whoever you are paying")}
        ${box(462, 158, 240, "0.0499 BTC &mdash; change", "back to a fresh address of yours")}

        <rect class="sc-dg-panel sc-dg-panel-risk" x="1" y="222" width="718" height="104" rx="12"/>
        <text class="sc-dg-verdict sc-dg-verdict-risk" x="24" y="250">What a stranger reads off it, for free</text>
        <text class="sc-dg-note" x="24" y="272">Those two inputs are almost certainly the same owner &mdash; spending them together is the</text>
        <text class="sc-dg-note" x="24" y="288">strongest signal in chain analysis. The uneven output is the change, because payments are</text>
        <text class="sc-dg-note" x="24" y="304">round and remainders are not. Your exchange coin and your friend&rsquo;s coin are now linked forever.</text>
      </svg>
      <figcaption>No surveillance was required. Both conclusions come from reading amounts off a public ledger, and both are correct.</figcaption>
    </figure>`;
};

/* ---- the library --------------------------------------------------------

   Fields:
     slug      file name under docs/guides/ and the id used by `related`
     category  one of guideCategories
     products  [] means universal -- shown whatever the finder's product answer
     goals     matched against guideGoals
     level     beginner | intermediate | advanced, filtered by guideLevels
     status    "published" writes a page; "planned" renders a dimmed card,
               is excluded from the sitemap, and links nowhere
     body      only read when status is "published"                            */

const guides = [
  /* ---------------------------------------------------------------- start here */
  {
    slug: "owning-your-bitcoin",
    category: "fundamentals",
    products: [],
    title: "With great power comes great responsibility",
    summary: "Self-custody does not just remove the middleman. It removes the work the middleman was doing, and hands you the job. Here is exactly what that job is.",
    level: "beginner",
    minutes: 14,
    goals: ["learn"],
    tags: ["Mindset", "Start here"],
    icon: "bi-currency-bitcoin",
    updated: "2026-08-17",
    status: "published",
    related: ["complete-path", "what-not-to-normalize", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">"Be your own bank" is a good slogan and a bad description. It gets the freedom right and leaves out the job description &mdash; because a bank is not just a place that holds money. It is a large organisation performing a dozen unglamorous tasks on your behalf, most of which you have never had to think about.</p>

      <p>Take custody of your own bitcoin and those tasks do not disappear. They transfer. This page is an inventory of exactly which ones, so you can decide with your eyes open rather than discovering them one at a time.</p>

      ${figureSlot({
        shot: "A single key on a plain surface, shot from above, with a long hard shadow. Sparse and slightly severe rather than triumphant.",
        caption: "The whole proposition, and the whole problem, in one object.",
        ratio: "16 / 9",
        icon: "bi-shield-lock"
      })}

      <h2>What the bank was actually doing</h2>

      <p>When your money sits with a bank or an exchange, a great deal happens quietly in the background. Most of it only becomes visible when it goes wrong.</p>

      <div class="sc-handoff-list" aria-label="Responsibilities that transfer in self-custody">
        <div class="sc-handoff-row"><div><span>Institution</span><p>Reverses a payment you were tricked into making</p></div><i aria-hidden="true">&rarr;</i><div><span>Self-custody</span><p><strong>Nobody.</strong> Transactions are final once confirmed.</p></div></div>
        <div class="sc-handoff-row"><div><span>Institution</span><p>Resets your password when you forget it</p></div><i aria-hidden="true">&rarr;</i><div><span>Self-custody</span><p><strong>Nobody.</strong> There is no account to reset.</p></div></div>
        <div class="sc-handoff-row"><div><span>Institution</span><p>Insures your deposit if the institution fails</p></div><i aria-hidden="true">&rarr;</i><div><span>Self-custody</span><p><strong>Nobody</strong> &mdash; but there is also no institution left to fail.</p></div></div>
        <div class="sc-handoff-row"><div><span>Institution</span><p>Keeps a record of every transaction</p></div><i aria-hidden="true">&rarr;</i><div><span>Self-custody</span><p><strong>You.</strong> The blockchain records amounts, not context.</p></div></div>
        <div class="sc-handoff-row"><div><span>Institution</span><p>Releases funds to your estate when you die</p></div><i aria-hidden="true">&rarr;</i><div><span>Self-custody</span><p><strong>You, in advance,</strong> by writing a plan that works without you.</p></div></div>
        <div class="sc-handoff-row"><div><span>Institution</span><p>Stores the credentials securely</p></div><i aria-hidden="true">&rarr;</i><div><span>Self-custody</span><p><strong>You.</strong> Physically, offline, in more than one place.</p></div></div>
        <div class="sc-handoff-row"><div><span>Institution</span><p>Detects and blocks suspicious activity</p></div><i aria-hidden="true">&rarr;</i><div><span>Self-custody</span><p><strong>You,</strong> at the moment you approve each transaction.</p></div></div>
      </div>

      <p>Read that right-hand column as a to-do list rather than a warning. Every row is achievable, and most of them are achievable in an afternoon. But they are genuinely your work now, and nobody will send a reminder.</p>

      <h2>The Canadian version of this is not hypothetical</h2>

      <p>Deposits at a Canadian bank are protected by CDIC up to defined limits. Crypto assets held on a trading platform are not, whatever the platform's marketing implies. Registration with securities regulators sets rules for how a platform must operate; it is not deposit insurance and does not make you whole if the business fails.</p>

      <p>Canada has its own case study. QuadrigaCX was the country's largest bitcoin exchange until it collapsed in 2019, leaving roughly 76,000 users unable to reach their funds. The Ontario Securities Commission's subsequent investigation concluded the platform had been operating as a fraud. Customers had done nothing wrong &mdash; they had simply left their coins with someone else, which is what everyone does until they decide not to.</p>

      ${pullQuote("Not your keys, not your coins is not a slogan about ideology. It is a description of who bears the loss when a company fails.")}

      <h2>The three things with no substitute</h2>

      <p>Most of the transferred responsibilities have a workaround. These three do not, and they are worth understanding precisely because every other decision follows from them.</p>

      <h3>A confirmed transaction cannot be reversed</h3>

      <p>Not by you, not by the recipient's wallet provider, not by any court or exchange. Once a transaction confirms, the bitcoin belongs to whoever controls the destination key. This is the same property that stops anyone freezing your funds &mdash; it cannot be selectively switched off for your mistakes.</p>

      <p>The practical consequence: <strong>verification happens before you approve, because there is no after.</strong> That is why every guide on this site insists on checking the address on the device screen and sending a small test first.</p>

      <h3>Lost keys are lost permanently</h3>

      <p>There is no recovery department. If the recovery words are destroyed, forgotten, or were never written down correctly in the first place, the bitcoin remains visible on the blockchain forever and is unspendable by anyone, including you. It is not frozen or held pending appeal. It is simply gone.</p>

      <p>This is why a backup you have never tested does not count. <a href="recovery-test-drill.html">Testing the restore</a> is the only thing that converts an assumption into a fact.</p>

      <h3>Nobody is checking whether it is really you</h3>

      <p>A bank might phone you about an unusual transfer. Bitcoin has no such layer. A valid signature is authorisation, full stop &mdash; whether it came from you, from malware on your laptop, or from someone standing behind you.</p>

      <p>The defence is structural rather than watchful: keys kept on a device that malware cannot reach, addresses verified on a screen the computer cannot rewrite, and large amounts held somewhere that takes deliberate effort to spend from.</p>

      <h2>What the responsibility actually looks like</h2>

      <p>"Be careful" is useless advice because it does not tell you what to do on a Tuesday. Concretely, taking this on properly means four things &mdash; and they are finite, not a permanent state of anxiety.</p>

      ${checklist([
        "<strong>A backup that exists in the physical world.</strong> Written by hand, stored somewhere that survives fire and flood, and never photographed or typed into a computer.",
        "<strong>A restore you have actually performed.</strong> Once, deliberately, before the wallet holds anything you would miss.",
        "<strong>A split between spending and savings.</strong> A phone wallet for small amounts you use, a hardware device for the amount you are keeping. Convenience and security have different jobs.",
        "<strong>A plan for the day you are not here.</strong> Instructions someone can follow under stress that do not, by themselves, let them steal from you while you are alive."
      ])}

      <p>That is the whole list. It is not nothing, but it is not endless either &mdash; and it is dramatically less work than most people imagine before they start.</p>

      <h2>Why the trade is still worth making</h2>

      <p>Nothing above is an argument against self-custody. It is an argument for doing it deliberately, because the alternative has its own failure modes and they are not under your control at all.</p>

      <p>Leaving bitcoin on a platform means your access depends on that company remaining solvent, remaining honest, not being compromised, not freezing your account by automated mistake, and continuing to operate in your province. You cannot audit any of those, and you find out they have failed at the moment you most need them not to have.</p>

      <p>Self-custody swaps that for a set of risks you can actually inspect and reduce. A backup either exists in two places or it does not. A restore either worked or it did not. That is a meaningfully better position &mdash; not because the risk vanished, but because it moved somewhere you can reach it.</p>

      <h2>Start smaller than feels worthwhile</h2>

      <p>The most common mistake is not technical. It is moving a life-changing amount on the first attempt, because the process seemed simple enough in the video.</p>

      <p>Move an amount you would genuinely shrug at losing. Live with it for a few weeks. Restore it from the backup. Send some of it out and back. Only then decide what else should follow. Every serious loss in this space involves someone who skipped that stage because they were nearly sure.</p>

      ${callout("The next step is the path itself", `<a href="complete-path.html">Start Here</a> takes this from principle to practice &mdash; five stages from an exchange account to a wallet you have proven you can recover.`)}`
  },
  {
    slug: "complete-path",
    hubOrder: -1,
    category: "fundamentals",
    products: [],
    eyebrow: "First steps",
    title: "From Exchange to Self-Custody",
    summary: "Move your bitcoin, secure the backup, and prove you can recover it.",
    level: "beginner",
    minutes: 20,
    goals: ["learn", "setup", "withdraw"],
    tags: ["Overview", "Start here"],
    icon: "bi-signpost-split",
    updated: "2026-08-17",
    status: "published",
    related: ["what-not-to-normalize", "coldcard-q-setup", "exchange-withdrawal"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">There is a version of this that takes an afternoon and a version that takes six months. The difference is not intelligence or technical skill &mdash; it is whether you moved money before you understood what you were doing with it.</p>

      <p>This is the whole path, start to finish: from having an account on an exchange to holding bitcoin in a wallet you control and have proven you can recover. Five stages, each with one outcome. Work through them in order.</p>

      <p>The rule that makes this work: <strong>do not move on until you can explain the outcome of the current stage in your own words</strong>. Not recite it &mdash; explain it, to yourself, without looking. Every expensive mistake in bitcoin custody is someone who skipped that check because they were nearly sure.</p>

      ${figureSlot({
        shot: "A desk laid out for a setup session: hardware wallet still boxed, a seed card and pen, a laptop closed, a cup of coffee. Calm and unhurried.",
        caption: "Set aside a proper block of time. This is not a thing to do between meetings.",
        ratio: "16 / 9"
      })}

      <h2><span class="sc-article-num">1</span>Understand what you own</h2>

      <p>A bitcoin wallet does not hold coins the way a physical wallet holds notes. There is nothing inside it to spill. What it actually holds is <em>keys</em>, and what it actually does is construct transactions and sign them.</p>

      <p>The bitcoin itself lives on the network, as records of outputs that particular keys are allowed to spend. Your wallet is the thing that proves you are allowed. This distinction sounds academic until the first time someone tells you they "moved their bitcoin into a hardware wallet" and you realise nothing moved anywhere &mdash; the authority to spend changed hands, which is a different and much more interesting thing.</p>

      <h3>The four words everything else assumes</h3>

      ${checklist([
        "<strong>Private key</strong> &mdash; the secret that authorises a spend.",
        "<strong>Recovery words</strong> &mdash; human-readable backup material that can recreate every key in the wallet.",
        "<strong>Address</strong> &mdash; a destination you can share to receive bitcoin.",
        "<strong>UTXO</strong> &mdash; one individual chunk of bitcoin your wallet can spend. Your balance is a pile of these, not a single number."
      ])}

      <p><strong>Outcome:</strong> you can say what your recovery words actually are, and why anyone holding them owns your bitcoin regardless of what device you bought.</p>

      <h2><span class="sc-article-num">2</span>Choose the setup</h2>

      <p>There are three broad shapes, and the honest answer is that most people should start with the simplest option and move through them slowly over years &mdash; not pick the most complex one because it sounds the most secure.</p>

      <div class="sc-setup-grid" aria-label="Three self-custody setup options">
        <article class="sc-setup-option sc-setup-option-mobile">
          <div class="sc-setup-option-top">
            <span class="sc-setup-option-icon" aria-hidden="true"><i class="bi bi-phone"></i></span>
          </div>
          <h3>Mobile Hot Wallet</h3>
          <dl>
            <div><dt>Protects against</dt><dd>The exchange failing, freezing, or losing your account.</dd></div>
            <div><dt>Trade-off</dt><dd>Your keys sit on an internet-connected, general-purpose device.</dd></div>
            <div><dt>Advantages</dt><dd>Fast to start, inexpensive, and useful for learning with smaller amounts.</dd></div>
          </dl>
        </article>

        <article class="sc-setup-option sc-setup-option-hardware">
          <div class="sc-setup-option-top">
            <span class="sc-setup-option-icon" aria-hidden="true"><i class="bi bi-usb-drive"></i></span>
          </div>
          <h3>Cold Wallet</h3>
          <dl>
            <div><dt>Protects against</dt><dd>Malware on your computer or phone reaching your keys.</dd></div>
            <div><dt>Trade-off</dt><dd>A device to buy, and a backup you must store and test.</dd></div>
            <div><dt>Advantages</dt><dd>Keys stay isolated from everyday devices while recovery remains straightforward.</dd></div>
          </dl>
        </article>

        <article class="sc-setup-option sc-setup-option-multisig">
          <div class="sc-setup-option-top">
            <span class="sc-setup-option-icon" aria-hidden="true"><i class="bi bi-diagram-3"></i></span>
          </div>
          <h3>Multisig Wallet</h3>
          <dl>
            <div><dt>Protects against</dt><dd>Any single key being lost, stolen, or coerced.</dd></div>
            <div><dt>Trade-off</dt><dd>Several backups <em>plus</em> the wallet configuration, and a genuinely harder recovery drill.</dd></div>
            <div><dt>Advantages</dt><dd>Removes any one key as a single point of failure and supports geographic separation.</dd></div>
          </dl>
        </article>
      </div>

      <p>Multisig removes the single point of failure, which is real and valuable. It also multiplies the number of things you must back up, and adds a new category of loss: a setup that nobody &mdash; including you &mdash; can actually restore. Reach for it when you have already demonstrated you can recover a simple wallet.</p>

      <p><a class="sc-text-link" href="../devices.html">Compare hardware <i class="bi bi-arrow-right"></i></a> &nbsp; <a class="sc-text-link" href="../software.html">Compare wallet software <i class="bi bi-arrow-right"></i></a></p>

      <p><strong>Outcome:</strong> you have picked one shape and can say what it protects against and what it asks of you.</p>

      <h2><span class="sc-article-num">3</span>Set up and back up</h2>

      <p>This is where the wallet gets created and where the only truly irreplaceable thing &mdash; your recovery words &mdash; comes into existence. Everything here is worth doing slowly.</p>

      ${checklist([
        "Inspect the packaging and authenticate the device using the maker's official app or process.",
        "Generate a new wallet on the device. Never use words that were supplied in the box.",
        "Write the recovery words offline, in order, by hand. Do not photograph them.",
        "Complete the confirmation step when prompted &mdash; it catches transcription errors while they are still fixable.",
        "Store the device and the backup separately, so one theft, fire, or flood cannot take both."
      ])}

      ${figureSlot({
        shot: "Close-up of a hand writing recovery words onto a numbered backup card, hardware wallet screen visible but deliberately out of focus so no real words are legible.",
        caption: "By hand, in order, offline. This is the step with no undo.",
        ratio: "4 / 3",
        icon: "bi-box-seam"
      })}

      ${callout("A passphrase is not a casual extra password", "A forgotten or mistyped BIP39 passphrase does not lock you out with an error &mdash; it silently opens a different, empty wallet. Add one only when you understand the recovery procedure and have a durable way to preserve it. If you do use one, write down that you used one.")}

      <p><strong>Outcome:</strong> the wallet exists, the words are recorded somewhere durable and offline, and the device and backup are not in the same place.</p>

      <h2><span class="sc-article-num">4</span>Withdraw carefully</h2>

      <p>The first withdrawal is the one that teaches you whether any of the previous stage actually worked. Treat it as a test, not a transfer.</p>

      ${checklist([
        "Create a fresh receive address in your wallet.",
        "Verify the full address on the hardware device screen, not only on the computer.",
        "Send a small test withdrawal first and wait for it to confirm.",
        "Confirm it arrived in your wallet before sending anything larger.",
        "Understand the platform fee, the withdrawal fee, and the network fee before approving &mdash; they are three different charges."
      ])}

      <p>The reason for checking the address on the device rather than the screen is specific: malware that swaps addresses in the clipboard is common, cheap, and invisible. The computer shows you what the attacker wants you to see. The device does not.</p>

      <p><a class="sc-text-link" href="../exchanges.html">Compare Canadian purchase routes <i class="bi bi-arrow-right"></i></a></p>

      <p><strong>Outcome:</strong> bitcoin has moved from a platform to a wallet you control, and you watched it arrive.</p>

      <h2><span class="sc-article-num">5</span>Prove you can recover</h2>

      <p>A backup you have never tested is not a backup. It is an assumption, and you will discover whether it was correct at the worst possible moment.</p>

      <p>After the first small transaction, and before you commit real savings, follow your device maker's documented recovery-check procedure or restore the words into a wiped spare device. Confirm the wallet fingerprint, the addresses, or the balance match what you expect. This is the single highest-value hour in the whole path.</p>

      ${figureSlot({
        shot: "A second, wiped hardware wallet part-way through a restore, seed card beside it, with the first device powered off in the background.",
        caption: "A restore you have actually performed is worth more than any amount of care taken earlier.",
        ratio: "16 / 9",
        icon: "bi-arrow-counterclockwise"
      })}

      <h3>Then keep it working</h3>

      ${checklist([
        "Check backups periodically for legibility and environmental damage.",
        "Keep an inheritance instruction that explains the process without exposing the secret.",
        "Download wallet software only from official sources, and verify releases where supported.",
        "Re-evaluate single-signature versus multisig as the amount and the consequences change."
      ])}

      <p><strong>Outcome:</strong> you have restored this wallet at least once, deliberately, and know it works.</p>

      <h2>Where to go from here</h2>

      <p>Those five stages are the whole of it. Everything else on this site &mdash; multisig, passphrases, dice entropy, coin control &mdash; is refinement on top of a foundation that has to be solid first.</p>

      ${callout("Read the failure modes next", `These five stages describe what to do. <a href="what-not-to-normalize.html">What not to normalize</a> describes the six ordinary habits that quietly undo them, and it is worth reading before you move an amount you would miss.`)}`
  },
  {
    slug: "what-not-to-normalize",
    category: "fundamentals",
    products: [],
    title: "What not to normalize",
    summary: "Six habits that look harmless, are extremely common, and are the reason most self-custody losses happen. None of them involve being hacked.",
    level: "beginner",
    minutes: 18,
    goals: ["learn", "harden"],
    tags: ["Failure modes", "Start here"],
    icon: "bi-shield-exclamation",
    updated: "2026-08-17",
    status: "published",
    related: ["complete-path", "dice-entropy", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Almost nobody loses bitcoin to cryptography. The maths holds. What people lose it to is a shortcut that worked the first fifty times, taken by someone who had every intention of being careful.</p>

      <p>Each of the six habits below is normal enough that you will find people recommending it. Each one has a specific, well-documented way of taking everything. None of them require you to be hacked, targeted, or unlucky &mdash; only to be slightly busy on the wrong afternoon.</p>

      ${figureSlot({
        shot: "A phone lying face-up on a desk showing a photo gallery, with a seed-phrase card visible as one of the thumbnails.",
        caption: "The most expensive photograph most people will ever take.",
        ratio: "16 / 9",
        icon: "bi-camera"
      })}

      <h2><span class="sc-article-num">1</span>Keeping a digital copy of your recovery words</h2>

      <p>This is the single most common cause of loss, and it almost never feels like a risk at the time. A photo of your seed card is not a backup. It is an extra copy, sitting on a device built to make your files easy to retrieve &mdash; by you, and by anyone who reaches your account.</p>

      <p>The copies also multiply without you deciding anything. Photos sync to the cloud, often before you have finished putting the pen down. Notes apps back up to the same account as your email, which is the account that resets all your other passwords. Printers keep spooled documents, and shared printers keep them somewhere you do not control. Ordinary password managers are built for credentials you can rotate; recovery words cannot be rotated.</p>

      <p>Deleting the photo afterwards does not undo it. It does not delete the sync history, the cloud backup, or the copy still sitting on the phone you traded in two years ago.</p>

      ${pullQuote("One compromised email account can be enough to reach every copy at once.")}

      <p><strong>Instead:</strong> write the words by hand, keep them offline, and treat a metal backup as the upgrade &mdash; not a second digital copy.</p>

      <h2><span class="sc-article-num">2</span>Using recovery words that came with the device</h2>

      <p>A legitimate device generates its seed during your setup, on the device, in front of you. If words arrive pre-printed on a card in the box, on a scratch panel, or in a leaflet, somebody else already has them and is waiting for you to fund the wallet.</p>

      <p>The setup process should ask <em>you</em> to write words down and then quiz you on them. You should never be asked to enter words supplied by the manufacturer, the seller, or a support agent. A device that arrives already initialised, already holding a wallet, or already showing a PIN has been tampered with, and there are no innocent explanations worth gambling on.</p>

      ${callout("Buy from the maker where you can", "Second-hand devices, marketplace listings, and unauthorised resellers are the usual delivery route for this attack. The saving is never worth it.")}

      <h2><span class="sc-article-num">3</span>Verifying an address only on your computer</h2>

      <p>Clipboard-swapping malware watches for anything shaped like a bitcoin address and quietly replaces it with the attacker's. The website shows the right address. Your wallet shows the right address. The money goes somewhere else.</p>

      <p>The screen on your hardware device exists precisely to break this, because it is the one display an infected computer cannot rewrite. Using it is the entire reason you bought the thing.</p>

      ${checklist([
        "Display every receiving address on the hardware device before you share it.",
        "Check the whole string, not just the first four and last four characters &mdash; attackers generate lookalikes that match at both ends.",
        "Review the recipient and the amount on the device before approving a send, not only in the software.",
        "Prefer QR transfer over copy and paste where both ends support it."
      ])}

      <h2><span class="sc-article-num">4</span>Skipping the test send</h2>

      <p>Moving your whole balance on the first attempt removes every chance to catch a mistake while it is still cheap. A small test exercises the entire path at once: the address, the withdrawal screen, the fees, the waiting, and your own wallet correctly showing the result at the other end.</p>

      <p>Send an amount you would shrug at losing. Wait for it to confirm and appear in your own wallet before sending more. Then do it again after any change &mdash; a new device, new wallet software, a different address type, a restored backup. Bitcoin transactions do not reverse, and no support desk anywhere can recall one.</p>

      ${figureSlot({
        shot: "Split screen: a wallet's send confirmation on a laptop beside a hardware wallet screen showing the same address, with a finger pointing at the matching characters.",
        caption: "The two screens should agree. The device is the one telling the truth.",
        ratio: "16 / 9",
        icon: "bi-arrow-left-right"
      })}

      <h2><span class="sc-article-num">5</span>Building complexity you have never recovered from</h2>

      <p>Multisig, passphrases, split backups, decoy wallets &mdash; every one of them adds a way to protect your funds. Every one of them also adds a way to lose your funds permanently. The second effect arrives immediately; the first only matters if you are actually attacked.</p>

      <p>A simple setup you have restored beats an elaborate one you have not. Rehearse recovery before the setup holds meaningful value, and again after any change. Back up the wallet <em>configuration</em> &mdash; the descriptor, the multisig policy &mdash; and not just the keys, because keys alone will not rebuild a multisig. And ask honestly who else could complete the recovery if you could not, and whether they have what they would need.</p>

      ${callout("Earn the complexity", "Add one layer. Test it. Live with it for a while. Then decide whether the next layer is genuinely worth the recovery burden it brings with it.")}

      <h2><span class="sc-article-num">6</span>Answering anyone who asks about your words</h2>

      <p>No manufacturer, exchange, wallet developer, support agent, or forum moderator will ever need your recovery words, private keys, PIN, or passphrase. The request itself is the attack, regardless of what else appears to be true about who is asking.</p>

      <p>Support that contacts you first is the wrong way round &mdash; you contact them, through an address you typed yourself. Wallet-validation pages, migration tools, and airdrop claims that ask for a seed are theft without exception. And urgency is the tell: real problems survive you slowing down to check.</p>

      ${cautions([
        "Impersonation extends to phone calls, video calls, and people who already know your name and roughly what you own.",
        "If you have entered your words anywhere at all, treat that wallet as compromised and move the funds to a freshly generated one."
      ])}

      <h2>The pattern underneath all six</h2>

      <p>None of these are technical failures. Every one is a moment where the careful path was slightly slower than the convenient one, and the convenient one appeared to work.</p>

      <p>That is what makes them worth naming in advance. You will not be at your most sceptical the day one of these turns up &mdash; you will be tired, or in a hurry, or halfway through something else. The decision is much easier if you have already made it.</p>

      <p class="mt-4"><a class="sc-text-link" href="complete-path.html">Start here <i class="bi bi-arrow-right"></i></a></p>`
  },
  {
    slug: "keys-addresses-utxos",
    category: "fundamentals",
    products: [],
    title: "Keys, addresses, and UTXOs",
    summary: "A beginner's breakdown of what your wallet actually holds. There are no coins anywhere — and once that clicks, most of bitcoin's odder behaviour starts making sense.",
    level: "beginner",
    minutes: 15,
    goals: ["learn"],
    tags: ["Fundamentals", "How it works"],
    icon: "bi-wallet2",
    updated: "2026-08-17",
    status: "published",
    related: ["complete-path", "owning-your-bitcoin", "sparrow-coin-control"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Almost everyone starts with the same mental picture: a wallet is a container, bitcoin sits inside it, and sending bitcoin moves it from your container to someone else's. It is a reasonable guess and it is wrong in every part, which is why so much of bitcoin seems arbitrary until you replace it.</p>

      <p>This page builds the correct picture from the bottom up. It takes about fifteen minutes and it makes everything afterwards easier &mdash; why fees behave oddly, why your wallet keeps generating new addresses, why you can restore everything from twelve words, and why sending a small amount sometimes moves your entire balance.</p>

      ${figureSlot({
        shot: "A clean overhead flat-lay: a key, a padlock, and a small pile of mismatched cash notes of odd denominations, arranged left to right.",
        caption: "The three ideas on this page, in order.",
        ratio: "16 / 9",
        icon: "bi-wallet2"
      })}

      <h2><span class="sc-article-num">1</span>There are no coins</h2>

      <p>Nothing is stored in your wallet. There is no file containing bitcoin, and nothing physically moves when you send a payment.</p>

      <p>What exists is a public ledger &mdash; a record, copied across thousands of computers, of every transaction ever made. That ledger does not track balances by person. It tracks <em>amounts and the conditions required to spend them</em>. Somewhere in it are entries saying, in effect, "this much bitcoin, spendable by whoever can prove they hold a particular key."</p>

      <p>Your wallet's job is to hold that key and to prove it, on demand, without ever revealing it. That is the entire trick.</p>

      <h2><span class="sc-article-num">2</span>The private key is a number that can sign</h2>

      <p>A private key is, underneath, an enormous random number. Its usefulness is that it can produce a <em>signature</em>: a piece of data that anyone can check, that could only have been produced by that key, and that reveals nothing about the key itself.</p>

      <p>That last part is what makes bitcoin work. You prove you are allowed to spend without ever handing over the thing that allows it. Every payment you make is a signature saying "the holder of this key authorises this exact transaction" &mdash; and if a single detail of the transaction changes, the signature no longer matches.</p>

      ${callout("This is why the phrase not your keys, not your coins is literal", "Ownership of bitcoin is not a name on an account. It is the ability to produce a valid signature. Whoever can do that owns the bitcoin, and anyone who cannot does not — including you, if your bitcoin sits on an exchange and only their system can sign.")}

      <h2><span class="sc-article-num">3</span>Addresses are a one-way street</h2>

      <p>From your private key, your wallet derives a <strong>public key</strong>, and from that, an <strong>address</strong>. The derivation only runs one way: address from key is easy, key from address is impossible.</p>

      <p>Think of an address as a padlock you can hand out freely. Anyone can snap it shut on a payment. Only your key opens it.</p>

      <p>That one-way property is why publishing an address is safe. It is also why an address is not a wallet, not an account, and not a login &mdash; it is a destination, and one wallet can produce an effectively unlimited number of them.</p>

      <h2><span class="sc-article-num">4</span>One seed, unlimited keys</h2>

      <p>If a wallet needed a separate backup for every key, self-custody would be unmanageable. It does not, because the keys are not independent.</p>

      <p>Your twelve or twenty-four recovery words encode a single starting number: the <strong>seed</strong>. From that seed, your wallet derives every key it will ever use, in a fixed and standardised order. Key number one, key number two, key number five hundred &mdash; all reproducible, from those words, forever.</p>

      ${checklist([
        "This is why the words are the backup, and the only backup that matters.",
        "This is why you can restore the same wallet in different software and see the same coins.",
        "This is why anyone who has the words has everything, immediately and permanently.",
        "And it is why the words can be written on paper: they encode one number, and that number regenerates the rest."
      ])}

      <h2><span class="sc-article-num">5</span>Why your wallet keeps making new addresses</h2>

      <p>You may have noticed that asking for a receive address twice gives you two different addresses, and that the old one still works. That is deliberate.</p>

      <p>Because the ledger is public, anyone who knows one of your addresses can see every payment it ever received. Reusing a single address builds a public, permanent record of your income in one convenient place. Using a fresh address each time scatters that information instead.</p>

      <p>It is a privacy measure rather than a security one &mdash; an old address is not unsafe, it is just revealing. All of them belong to the same wallet, and your wallet watches all of them.</p>

      <h2><span class="sc-article-num">6</span>Your balance is a pile of chunks</h2>

      <p>Here is the idea that surprises people most, and the one that explains the most.</p>

      <p>The ledger does not store "you have 0.5 bitcoin." It stores individual, indivisible outputs &mdash; each one created by a specific past transaction, each with its own amount. The unspent ones are called <strong>UTXOs</strong>: unspent transaction outputs. Your balance is simply the sum of yours.</p>

      <p>The closest everyday comparison is cash, but cash in strange denominations. If someone paid you 0.3, someone else paid you 0.15, and you bought 0.05, you do not have "0.5." You have a 0.3 note, a 0.15 note, and a 0.05 note. Your wallet adds them up and shows one number, which is a convenience, not the truth.</p>

      ${callout("And this is why change exists", "You cannot tear a note in half. To pay 0.1 using your 0.3 chunk, the whole chunk gets spent — 0.1 goes to the recipient and roughly 0.2 comes straight back to you as a brand-new chunk at a fresh address of your own. That returning amount is called change, and it is why your transaction history sometimes looks like you sent yourself money. You did.")}

      <h2><span class="sc-article-num">7</span>What follows from all this</h2>

      <p>Almost every piece of bitcoin behaviour that seems arbitrary at first is a direct consequence of the four ideas above.</p>

      <div class="sc-consequence-map" aria-label="The odd behaviour, and where it comes from">
        <div class="sc-consequence-head"><span>What you notice</span><span>What causes it</span></div>
        <article><h3>Fees follow transaction size, not value</h3><i class="bi bi-arrow-right" aria-hidden="true"></i><p>You pay for data. Five small chunks take more space than one large one, whatever the totals are.</p></article>
        <article><h3>A small payment seems to move everything</h3><i class="bi bi-arrow-right" aria-hidden="true"></i><p>The whole chunk is spent and the remainder returns to you as change.</p></article>
        <article><h3>A wallet restores in different software</h3><i class="bi bi-arrow-right" aria-hidden="true"></i><p>Every key is reproduced from the seed in a standard order.</p></article>
        <article><h3>Watch-only wallets can exist</h3><i class="bi bi-arrow-right" aria-hidden="true"></i><p>Public keys can find your coins; only spending requires the private key.</p></article>
        <article><h3>The chunks you spend together matter</h3><i class="bi bi-arrow-right" aria-hidden="true"></i><p>Spending two chunks together publicly links them as belonging to one owner.</p></article>
        <article><h3>Transactions cannot be reversed</h3><i class="bi bi-arrow-right" aria-hidden="true"></i><p>There is no account to credit back—only a new transaction signed by the new owner.</p></article>
      </div>

      <p>That fifth row is worth pursuing once the rest has settled. It is the entire basis of <a href='sparrow-coin-control.html'>coin control and labelling</a>, and it is the difference between a wallet that quietly assembles a public map of your finances and one that does not.</p>

      <h2>The short version</h2>

      ${checklist([
        "<strong>You own keys, not coins.</strong> Ownership is the ability to sign.",
        "<strong>Addresses are one-way</strong> and safe to share. Use a fresh one each time.",
        "<strong>One seed makes every key</strong>, which is why the recovery words are the whole backup.",
        "<strong>Your balance is a set of chunks</strong>, and spending one always spends all of it, with the remainder returning as change."
      ])}

      <p>If those four sentences make sense, you have the model. Everything else on this site is detail hung on that frame.</p>

      ${callout("Looking up a word", `This page explains how the pieces fit together rather than defining every term you will meet. For quick definitions — script types, derivation paths, mempool, PSBT, and the rest — the <a href='../glossary.html'>glossary</a> is searchable and built for exactly that.`)}

      ${callout("Ready to do it rather than read about it", `<a href='complete-path.html'>Start Here</a> takes you from an exchange account to a wallet you have proven you can recover, in five stages.`)}`
  },
  {
    slug: "choosing-your-first-setup",
    category: "fundamentals",
    products: [],
    title: "Choosing your first setup",
    summary: "Most people ask which wallet is best. The useful question is how much you are protecting, from what, and who else needs to be able to recover it — which has a different answer.",
    level: "beginner",
    minutes: 15,
    goals: ["learn", "setup"],
    tags: ["Decision", "Getting started"],
    icon: "bi-signpost-split",
    updated: "2026-08-17",
    status: "published",
    related: ["complete-path", "owning-your-bitcoin", "keys-addresses-utxos"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">There is no best bitcoin wallet, and the search for one is where a lot of people stall &mdash; comparing devices for weeks while their bitcoin sits on an exchange, which is the one option they had already decided against.</p>

      <p>The choice is not really between products. It is between <em>shapes</em>: how many keys, on what kind of hardware, in how many places. Pick the shape first and the product question becomes small and easy.</p>

      ${figureSlot({
        shot: "Three setups arranged left to right on a desk: a phone alone, a phone beside a hardware wallet, and three hardware wallets together.",
        caption: "Three shapes. Most people should start at the left and move right over years.",
        ratio: "16 / 9",
        icon: "bi-signpost-split"
      })}

      <h2><span class="sc-article-num">1</span>You probably want two wallets, not one</h2>

      <p>The most common mistake is looking for a single wallet that is both convenient and maximally secure. Those requirements pull in opposite directions, and the compromise usually satisfies neither.</p>

      <p>Almost everyone is better served by two:</p>

      ${checklist([
        "<strong>A spending wallet</strong> on your phone, holding an amount you would be annoyed but not devastated to lose. Fast, always with you, used regularly.",
        "<strong>A savings wallet</strong> on dedicated hardware, holding the rest. Deliberately inconvenient, touched rarely, backed up properly."
      ])}

      <p>This is the same instinct as not carrying your life savings in your pocket. Once you separate them, most of the difficult trade-offs disappear &mdash; the spending wallet can be convenient because the stakes are low, and the savings wallet can be awkward because you barely touch it.</p>

      <h2><span class="sc-article-num">2</span>Four questions that decide the rest</h2>

      <p>Answer these honestly, in order. They matter far more than any feature comparison.</p>

      <h3>How much are you protecting?</h3>

      <p>Not what you hope to hold eventually &mdash; what you will actually hold in the next year. Security measures cost time and add ways to lose access, and both should be proportionate. A setup appropriate for a life-changing sum is genuine overkill for a few hundred dollars, and the extra complexity is a real risk rather than free insurance.</p>

      <h3>What are you actually worried about?</h3>

      <p>Name it. The realistic list for most people, roughly in order of likelihood:</p>

      ${checklist([
        "The exchange failing, freezing your account, or being hacked. Solved by moving to any self-custody wallet at all.",
        "Malware on your computer or phone. Solved by a hardware wallet, where keys never touch the computer.",
        "Losing your own backup. Solved by durable storage and a tested restore — not by buying a better device.",
        "Physical theft of your backup. Solved by location, and structurally by multisig.",
        "Being personally targeted. Rare, and worth planning for only if you have specific reason to think it applies."
      ])}

      <p>Notice how many of those are not fixed by spending more on hardware. The second-most-likely item on that list is solved by discipline, not purchases.</p>

      <h3>Who else needs to be able to recover it?</h3>

      <p>If you were unavailable tomorrow, could anyone reach this bitcoin? For a lot of people the honest answer is no, and that is a design flaw rather than a security feature. It also argues against complexity: every layer you add is another thing someone else has to understand at the worst possible time.</p>

      <h3>How much fiddling will you actually tolerate?</h3>

      <p>Be realistic rather than aspirational. A setup you find annoying is a setup you will work around, and the workarounds are where the mistakes live. A simple arrangement you use correctly beats a sophisticated one you circumvent when you are in a hurry.</p>

      <h2><span class="sc-article-num">3</span>Matching answers to shapes</h2>

      <div class="sc-first-setup-grid" aria-label="Where most people land">
        <article class="is-learn">
          <div class="sc-first-setup-head"><span class="sc-first-setup-icon"><i class="bi bi-phone"></i></span><span class="sc-first-setup-stage">Start here</span></div>
          <p class="sc-first-setup-fit">Learning, small amounts, first time off an exchange</p>
          <h3>Mobile wallet</h3>
          <p>Free, fast, and teaches addresses, fees, and backups while the stakes are low.</p>
        </article>
        <article class="is-save">
          <div class="sc-first-setup-head"><span class="sc-first-setup-icon"><i class="bi bi-usb-drive"></i></span><span class="sc-first-setup-stage">Most people</span></div>
          <p class="sc-first-setup-fit">Holding savings you would genuinely miss</p>
          <h3>Hardware wallet + mobile spending wallet</h3>
          <p>Keys stay off internet-connected machines. This remains the right setup for most people, for years.</p>
        </article>
        <article class="is-scale">
          <div class="sc-first-setup-head"><span class="sc-first-setup-icon"><i class="bi bi-diagram-3"></i></span><span class="sc-first-setup-stage">Later</span></div>
          <p class="sc-first-setup-fit">Large amount, already comfortable, restore tested</p>
          <h3>2-of-3 multisig</h3>
          <p>No single key or location can lose or leak your bitcoin.</p>
        </article>
        <article class="is-recover">
          <div class="sc-first-setup-head"><span class="sc-first-setup-icon"><i class="bi bi-people"></i></span><span class="sc-first-setup-stage">Plan first</span></div>
          <p class="sc-first-setup-fit">Large amount, but nobody around you could recover it</p>
          <h3>Assisted multisig or a simpler written plan</h3>
          <p>Recoverability is security. A wallet nobody else can recover has already failed.</p>
        </article>
      </div>

      <p>Almost nobody should start at the third row. <a href='multisig-2of3.html'>Multisig</a> is the right destination for meaningful savings and the wrong starting point, because it multiplies every backup mistake by three before you have made your first one.</p>

      <h2><span class="sc-article-num">4</span>What actually matters when picking a device</h2>

      <p>Once you know you want a hardware wallet, the field narrows quickly &mdash; most current devices from reputable makers are fine. These are the differences worth weighing.</p>

      ${checklist([
        "<strong>Does it show the full address on its own screen?</strong> Non-negotiable. This is the core function.",
        "<strong>Bitcoin-only firmware available?</strong> Less code, smaller attack surface. Worth preferring if bitcoin is all you hold.",
        "<strong>Open source?</strong> The design is examined publicly rather than asserted. A meaningful advantage, though not the only one that matters.",
        "<strong>Air-gapped signing, by QR or card?</strong> Genuinely stronger than USB, and slower. Worth it for savings you rarely touch.",
        "<strong>Does the software you want to use support it?</strong> Check before buying, not after.",
        "<strong>Can you get it directly from the maker?</strong> Never buy second-hand or from a marketplace."
      ])}

      <p>Things that matter less than the marketing suggests: screen size, metal casing, price above a certain point, and the number of assets supported &mdash; which is a downside rather than a feature if you only hold bitcoin.</p>

      <p><a class="sc-text-link" href="../devices.html">Compare devices <i class="bi bi-arrow-right"></i></a> &nbsp; <a class="sc-text-link" href="../software.html">Compare wallet software <i class="bi bi-arrow-right"></i></a></p>

      <h2><span class="sc-article-num">5</span>Plan to outgrow it</h2>

      <p>Your first setup is not a permanent commitment, and treating it as one is why people stall. Because every wallet is restorable from its recovery words, moving between setups later is a normal, expected operation rather than a migration crisis.</p>

      <p>A reasonable arc, spread over years rather than weeks:</p>

      ${checklist([
        "Mobile wallet, small amount, first withdrawal from an exchange. Learn what an address and a fee are.",
        "Test a restore. This is the step that turns you from someone with a wallet into someone with custody.",
        "Hardware wallet for savings, mobile kept for spending.",
        "Improve the backup — durable storage, a second location, a written note for whoever comes after you.",
        "Only then consider multisig, a passphrase, or your own node."
      ])}

      <h2>The wrong turns</h2>

      ${checklist([
        "<strong>Waiting to choose perfectly.</strong> Bitcoin left on an exchange while you research is exposed to the risk you were trying to avoid. A good setup today beats a perfect one in three months.",
        "<strong>Starting with the most complex option.</strong> Multisig or a passphrase before your first tested restore adds ways to lose access without addressing anything you currently face.",
        "<strong>Buying the most expensive device.</strong> Above a modest threshold you are buying screens and materials, not security.",
        "<strong>One wallet for everything.</strong> The compromise satisfies neither purpose.",
        "<strong>Skipping the restore test.</strong> Whatever you choose, it is unproven until you have recovered from the backup once."
      ])}

      ${callout("Then just do it", `Whatever you pick, <a href='complete-path.html'>Start Here</a> takes it from decision to a wallet you have proven works — five stages, small amounts, no step you cannot undo except the ones clearly marked.`)}`
  },
  {
    slug: "fees-and-confirmations",
    category: "fundamentals",
    products: [],
    title: "Fees, confirmations, and stuck transactions",
    summary: "How fee rates are chosen, what a confirmation means, and what to do when a transaction sits unconfirmed.",
    level: "beginner",
    minutes: 15,
    goals: ["learn"],
    tags: ["Fees", "Mempool"],
    icon: "bi-calculator",
    status: "idea"
  },
  {
    slug: "recovery-test-drill",
    category: "fundamentals",
    products: [],
    title: "Test your recovery without risking your coins",
    summary: "A backup you have never restored is a guess. Here is how to prove it works, including which method to use when you only own one device and it already holds funds.",
    level: "intermediate",
    minutes: 25,
    goals: ["recover", "harden"],
    tags: ["Recovery", "Backups"],
    icon: "bi-arrow-counterclockwise",
    updated: "2026-08-17",
    status: "published",
    related: ["complete-path", "owning-your-bitcoin", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Writing down twelve or twenty-four words feels like the hard part is over. It is not. Until you have restored from those words and watched the correct wallet reappear, you do not have a backup &mdash; you have a hypothesis, and the test will otherwise be run for you at the worst possible time.</p>

      <p>The good news is that this is a genuinely finishable task, usually under half an hour. The bad news is that the obvious way to do it &mdash; wipe the device and type the words back in &mdash; is also the one way to turn a bad backup into an immediate, permanent loss. So the first decision is which method you use.</p>

      ${figureSlot({
        shot: "Two hardware wallets side by side on a desk, one powered on mid-restore, the other switched off. A seed card sits between them.",
        caption: "A restore performed deliberately, while everything still works, is the only version of this that is safe.",
        ratio: "16 / 9",
        icon: "bi-arrow-counterclockwise"
      })}

      ${prerequisites([
        "Your written recovery words, and any passphrase you set.",
        "The device the wallet lives on, or a second one you can wipe.",
        "Somewhere private. This is the one routine task where the words are out on the table.",
        "Your wallet's master fingerprint or first receive address, noted down beforehand &mdash; that is what you will be checking against."
      ])}

      <h2>Pick the method that matches what you own</h2>

      <p>All three prove the same thing. They differ entirely in what happens if the backup turns out to be wrong.</p>

      <div class="sc-guide-choice-grid sc-recovery-methods" aria-label="Three recovery test methods">
        <article class="sc-guide-choice is-safe">
          <span class="sc-choice-status">Safest</span><h3>Built-in backup check</h3>
          <dl><div><dt>You need</dt><dd>Nothing extra. Most devices include one.</dd></div><div><dt>If the backup is bad</dt><dd>It tells you and leaves the wallet untouched. Safe to run any time.</dd></div></dl>
        </article>
        <article class="sc-guide-choice is-thorough">
          <span class="sc-choice-status">Most thorough</span><h3>Restore onto a second device</h3>
          <dl><div><dt>You need</dt><dd>A spare signing device, wiped.</dd></div><div><dt>If the backup is bad</dt><dd>It tells you and leaves the original wallet untouched.</dd></div></dl>
        </article>
        <article class="sc-guide-choice is-danger">
          <span class="sc-choice-status">Do not use</span><h3>Wipe the only device</h3>
          <dl><div><dt>You need</dt><dd>Nothing extra.</dd></div><div><dt>If the backup is bad</dt><dd><strong>The wallet is gone.</strong> There is no third copy to fall back on.</dd></div></dl>
        </article>
      </div>

      ${cautions([
        "Never wipe a device that holds funds in order to test its backup. That is not a test &mdash; it is betting the wallet on the answer, and you only find out you were wrong once it is already unrecoverable."
      ])}

      <p>If your device has a built-in check, use it. That covers most people, most of the time, and it is the only method with no downside.</p>

      <h2>Method one: the device's own check</h2>

      <p>Most signing devices include a function that lets you type your recovery words back in and tells you whether they match the key already stored on the device. Nothing is overwritten and nothing leaves the device &mdash; it is comparing, not restoring.</p>

      <p>The feature goes by different names. Trezor calls it a backup check, Ledger ships it as a recovery check application, and other makers use wording like verify seed or check backup. If you cannot find it, search your device maker's documentation for those phrases before assuming it is absent.</p>

      ${checklist([
        "Find the check in the device's menu or its official companion app.",
        "Enter the words from your written backup &mdash; not from memory, and not from a copy you made later.",
        "Read the result. A pass means the words on that card reproduce the key on that device.",
        "If you use a passphrase, run the check for the passphrase wallet as well. See the section below."
      ])}

      <p>Note what this does and does not prove. It confirms your written words match this device's key. It does not confirm you can rebuild the wallet somewhere else &mdash; for that you want method two, at least once, before the amount gets serious.</p>

      <h2>Method two: restore onto a second device</h2>

      <p>This is the real thing: a full rehearsal of what you would actually do if the first device were lost, stolen, or dead. It needs a spare device, which is the only reason it is not the default advice.</p>

      ${checklist([
        "Wipe the spare device, or use one that has never been set up.",
        "Choose restore or import rather than create new.",
        "Enter the words from your written backup, in order.",
        "Add the passphrase if your wallet uses one.",
        "Compare the result against what you noted earlier &mdash; see the next section for what to compare."
      ])}

      <p>A second-hand or older device is fine for this. It does not need to be the same brand as your original, as long as it supports the same standard and the same address type. If it is a different brand, an address-type mismatch is the most likely reason for a result that looks wrong but is not &mdash; again, see below.</p>

      <h2>What actually counts as proof</h2>

      <p>"It seemed to work" is not a result. You are looking for a specific value to match, and you need to have written it down <em>before</em> you started so you are not comparing against a memory.</p>

      ${checklist([
        "<strong>Master fingerprint.</strong> An eight-character code identifying the wallet. The cleanest check &mdash; if it matches, everything derived from it will too.",
        "<strong>First receive address.</strong> Compare the whole string, not the first and last few characters.",
        "<strong>Balance and history.</strong> Load the restored keys into a watch-only wallet and see whether the expected coins appear."
      ])}

      <p>The fingerprint is the best of the three because it is short enough to compare reliably and specific enough that a match is conclusive. Most wallet software displays it in the wallet's settings or information panel; most hardware devices can show it on screen.</p>

      ${callout("Note it down before you start", "Half of failed recovery tests are people trying to remember what the address was supposed to look like. Write the fingerprint or first address on paper before you begin, separately from the recovery words themselves.")}

      <h2>If it does not match</h2>

      <p>Do not panic, and do not wipe anything. A mismatch usually means the test was set up differently from the original wallet, not that your backup is worthless. Work through these in order.</p>

      ${checklist([
        "<strong>Address type.</strong> Restoring as Legacy when the original was Native SegWit produces a completely different-looking set of addresses from the same correct words. This is the most common cause by a distance.",
        "<strong>A missing passphrase.</strong> Without it you get the wallet that exists at the words alone, which is a real, valid, empty wallet. It looks exactly like a failure.",
        "<strong>Word order.</strong> Two transposed words give a completely different wallet, and the checksum will often still accept it.",
        "<strong>A misread word.</strong> Handwriting confusions and near-identical BIP39 words are common. Check each word against the official wordlist.",
        "<strong>Derivation path.</strong> Some wallets default to different paths. If the software lets you specify one, match the original."
      ])}

      <p>If you work through all of that and it still does not match, treat the backup as unreliable. The correct response is not to keep trying &mdash; it is to generate a brand-new wallet on a device you trust, back that one up carefully, test it, and then move the funds across while you still can. You have caught the problem at the only moment when it is fixable.</p>

      <h2>A passphrase changes what you are testing</h2>

      <p>If you use a BIP39 passphrase, your words alone do not lead to your wallet. They lead to a different one. The passphrase is not a password on top of the seed &mdash; it selects an entirely separate wallet from the same words.</p>

      <p>That has two consequences for this drill &mdash; and <a href='passphrase-setup.html'>passphrases have a guide of their own</a>. The test must include the passphrase, typed exactly, or it proves nothing about the wallet you actually use. And the passphrase itself needs the same durability as the words: recorded somewhere it will survive you forgetting it, and stored separately from the seed card so that finding one does not hand over both.</p>

      <h2>When to run it again</h2>

      <p>This is not a one-time ceremony. Anything that changes the setup invalidates the previous result.</p>

      ${checklist([
        "After any firmware update that touches key handling or backup format.",
        "After adding, changing, or removing a passphrase &mdash; you now have a different wallet.",
        "After moving or recopying the backup, including onto metal.",
        "After changing the wallet's structure, such as moving from single-signature to multisig.",
        "Periodically regardless &mdash; once a year, alongside checking the backup is still legible and undamaged."
      ])}

      <p>For a multisig wallet the drill is larger and the failure mode is different: you must also back up the wallet configuration, and rehearse recovery using only the threshold number of keys. Keys alone will not rebuild a multisig, and discovering that during a real recovery is the worst version of this lesson.</p>

      ${callout("This is stage five of the path", `If you arrived here without a wallet yet, <a href="complete-path.html">Start Here</a> covers the four stages before this one. This drill is the one that turns all of them from intentions into something you have actually checked.`)}`
  },

  /* ------------------------------------------------------------------ devices */
  {
    slug: "coldcard-q-setup",
    category: "devices",
    products: ["coldcard"],
    title: "COLDCARD Q: first-time setup",
    summary: "Unbox and check the tamper evidence, set a PIN, generate a seed on the device, and take a backup you have verified.",
    level: "beginner",
    minutes: 45,
    goals: ["setup"],
    tags: ["Air-gapped", "microSD", "Seed backup"],
    icon: "bi-usb-drive",
    updated: "2026-08-17",
    productGuide: true,
    status: "published",
    related: ["sparrow-first-wallet", "dice-entropy", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">The COLDCARD Q is a deliberately awkward device. It has a full keyboard and a slot for a memory card, and no way at all to talk to your computer over the internet. That awkwardness is the product &mdash; every inconvenience in this guide is a connection somebody decided not to give an attacker.</p>

      <p>Setting one up properly takes about forty-five minutes. Most of that is not fiddly; it is writing things down carefully and resisting the urge to hurry. Read the whole page once before you start, then work through it.</p>

      ${figureSlot({
        shot: "The COLDCARD Q still in its sealed tamper-evident bag, serial number visible, resting on a plain dark surface next to a microSD card and a pen.",
        caption: "Check the bag before you open it. It is the first security step, not packaging.",
        ratio: "16 / 9",
        icon: "bi-box-seam"
      })}

      ${prerequisites([
        "The COLDCARD Q, unopened, bought from Coinkite or an authorised reseller.",
        "Two microSD cards &mdash; one for the encrypted backup, one spare.",
        "A pen and the supplied backup card, or a metal backup plate.",
        "A private room, an uninterrupted hour, and no camera pointed at the desk.",
        "No bitcoin. Nothing here requires funds, and you should not move any until the check at the end passes."
      ])}

      <h2><span class="sc-article-num">1</span>Check the packaging before you power it on</h2>

      <p>Coinkite ships the Q in a sealed bag with a serial number printed on it. During first boot the device shows you a number of its own, and the two are meant to match. That is the whole trick: a bag that has been opened and resealed around a substituted device will not produce a matching number.</p>

      <p>Read the number on the bag and keep it to hand. Inspect the bag for cuts, re-glued seams, or a second seal laid over the first, and look at the case seam and screen edge for scratches that suggest it has been opened.</p>

      ${cautions([
        "If anything about the packaging looks wrong, stop. Contact the vendor before continuing, and do not use the device.",
        "A device that arrives already showing a wallet, a PIN, or a set of recovery words is compromised. There are no exceptions to this and no innocent explanations worth gambling on."
      ])}

      <p>${official("https://coldcard.com/docs/quick-start-q/", "COLDCARD Q quick start")}</p>

      <h2><span class="sc-article-num">2</span>Set the PIN, and understand why it comes in two halves</h2>

      <p>The COLDCARD PIN is entered in two parts, and the gap between them is doing real work. You type the first half, the device responds with two words, and only then do you type the second half.</p>

      <p>Those two words are derived from your prefix combined with a secret held inside that specific device. They will be the same two words every time you log in &mdash; which means if you are ever handed a device that shows you <em>different</em> words, you have caught a substitution before giving away the rest of your PIN. It is a small piece of design that quietly defeats a whole class of attack.</p>

      ${checklist([
        "Choose a PIN you can recall under stress, not one you will need a note to remember.",
        "Write the two anti-phishing words down and keep them with your backup material.",
        "Record the PIN somewhere durable, and somewhere separate from your recovery words."
      ])}

      ${callout("The PIN protects the device, not the seed", "Anyone holding your recovery words can rebuild this wallet without ever seeing the PIN. The PIN buys you time if the device is physically stolen. The words are the thing that actually has to stay secret.")}

      <h2><span class="sc-article-num">3</span>Generate a new seed on the device</h2>

      <p>Choose the option to create a new wallet rather than importing one. The Q generates the seed itself, using its own entropy, and it never leaves the secure element in plaintext. Nothing you type into a computer is involved at any point.</p>

      ${checklist([
        "Select new wallet, not import, and let the device produce the words.",
        "Write the words down in order, on paper or metal, exactly as displayed.",
        "Complete the word-confirmation quiz the device runs afterwards &mdash; it catches transcription errors while you can still fix them.",
        "Decide your passphrase policy now, and write down whether you used one."
      ])}

      <p>If you would rather supply the randomness yourself rather than trust the device's generator, the Q accepts dice rolls at this step &mdash; see <a href="dice-entropy.html">rolling your own entropy</a>. It is optional, and it is not the thing standing between you and losing your coins.</p>

      ${cautions([
        "Never type these words into a phone, a computer, a password manager, or a photograph.",
        "Never use words that came printed with the device or were supplied by anyone else.",
        "Do not add a passphrase on a first setup unless you already understand how to recover from one."
      ])}

      ${figureSlot({
        shot: "The Q's screen showing a numbered word list during seed generation, angled so the words are not legible, with a hand writing on the backup card in the foreground.",
        caption: "In order, by hand, once. The quiz afterwards is there to catch you.",
        ratio: "4 / 3",
        icon: "bi-usb-drive"
      })}

      <h2><span class="sc-article-num">4</span>Take the encrypted backup</h2>

      <p>Separately from the words you just wrote down, the Q writes an encrypted backup file to microSD. This file is protected by a twelve-word backup password that the device displays exactly once.</p>

      <p>That password is not your seed and does not replace it. Write it down before you dismiss the screen &mdash; without it the backup file is inert.</p>

      ${checklist([
        "Write the twelve-word backup password down before moving on.",
        "Save the backup to microSD, then repeat it onto a second card kept somewhere else.",
        "Store the cards apart from the written recovery words where you practically can."
      ])}

      ${callout("The backup file is a convenience, not the safety net", "It restores your settings and any multisig configuration alongside the key, which saves real effort. Your handwritten recovery words remain the thing you genuinely cannot lose.")}

      <h2><span class="sc-article-num">5</span>Verify before you fund it</h2>

      <p>Everything up to this point is an assumption. This stage turns it into a fact, and it is the stage people skip.</p>

      ${checklist([
        "Run the device's own verify-backup option against the file you just wrote.",
        "Export the public keys to microSD and load them into your wallet software as a watch-only wallet.",
        "Compare the master key fingerprint shown on the Q with the one shown in the software &mdash; they must match.",
        "Send a small test amount, confirm it arrives, then send it back out before committing real savings."
      ])}

      <p>If the fingerprints do not match, stop and work out why before going further. It means the software is watching a different wallet from the one the device will sign for, and every address it shows you would be wrong.</p>

      <p class="mt-4"><a class="sc-text-link" href="sparrow-first-wallet.html">Next: pair it with Sparrow <i class="bi bi-arrow-right"></i></a></p>`
  },
  {
    slug: "coldcard-mk4-setup",
    category: "devices",
    products: ["coldcard"],
    title: "COLDCARD Mk4: first-time setup",
    summary: "The same setup path on the Mk4 hardware, including the differences in the keypad and NFC handling.",
    level: "beginner",
    minutes: 45,
    goals: ["setup"],
    tags: ["Air-gapped", "microSD"],
    icon: "bi-usb-drive",
    status: "idea"
  },
  {
    slug: "coldcard-advanced-features",
    category: "devices",
    products: ["coldcard"],
    title: "COLDCARD: the features worth turning on next",
    summary: "Duress wallets, brick-me PIN, trick PINs, login countdown, and which of them create recovery risk.",
    level: "advanced",
    minutes: 35,
    goals: ["harden"],
    tags: ["Duress", "PIN policy"],
    icon: "bi-shield-lock",
    status: "idea"
  },
  {
    slug: "passport-setup",
    category: "devices",
    products: ["passport"],
    title: "Foundation Passport: first-time setup",
    summary: "Camera-based air-gapped signing, a backup system that moved to Keycards and SeedQR, and a device that now does considerably more than bitcoin — which is a decision you make during setup.",
    level: "beginner",
    minutes: 35,
    goals: ["setup"],
    tags: ["QR air-gap", "SeedQR", "Open source"],
    icon: "bi-usb-drive",
    updated: "2026-08-17",
    productGuide: true,
    status: "published",
    related: ["recovery-test-drill", "sparrow-first-wallet", "multisig-2of3"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Passport's core idea has not changed: a camera on the front, a screen on the back, and no data path to your computer at all. Transactions arrive as QR codes and signatures leave as QR codes. Nothing is ever plugged in.</p>

      <p>Two things around that core have changed with Passport Prime, and both are setup decisions rather than details. The backup system moved from a microSD card to NFC Keycards and SeedQR. And the device is no longer bitcoin-only &mdash; its firmware also runs 2FA codes, security keys, and encrypted file storage. Whether you use any of that is up to you, and worth deciding deliberately.</p>

      ${figureSlot({
        shot: "A Passport held in one hand with its camera aimed at a laptop screen showing a QR code, the device's own screen lit with a transaction summary.",
        caption: "The whole data path, in both directions, is a camera and a screen.",
        ratio: "16 / 9",
        icon: "bi-usb-drive"
      })}

      ${prerequisites([
        "A Passport, unopened, bought from Foundation or an authorised reseller.",
        "The Envoy companion app, or wallet software that supports QR signing &mdash; Sparrow, Nunchuk, and Specter all do.",
        "A pen and a backup card or metal plate. You are writing words down regardless of which newer backup option you use.",
        "An uninterrupted half hour somewhere private, with no camera pointed at the desk.",
        "No bitcoin. Move none until the checks at the end pass."
      ])}

      <h2><span class="sc-article-num">1</span>Check the packaging</h2>

      <p>Inspect the packaging for cuts, re-glued seams, or a second seal laid over the first, and the case and screen edges for scratches suggesting it has been opened. Foundation ships with tamper-evident measures &mdash; check them against the current instructions on Foundation's own site rather than assuming what they should look like.</p>

      ${cautions([
        "A device that arrives already set up, already holding a wallet, or supplied with a printed recovery phrase is an attack. Stop and contact the vendor.",
        "Install firmware only through the official process. A firmware file offered by an email, a message, or a support agent is the attack, not the fix."
      ])}

      <h2><span class="sc-article-num">2</span>Set it up air-gapped from the beginning</h2>

      <p>The camera is the reason to own this device, so use it from the first step rather than treating it as an advanced mode to graduate to later. Habits formed during setup are the ones you keep.</p>

      ${checklist([
        "Pair with Envoy, or with Sparrow, Nunchuk, or Specter, using the QR option.",
        "Export the wallet's public keys by QR so your software can watch the wallet without ever touching a private key.",
        "Run one complete transaction over QR before relying on the setup: scan the unsigned transaction out, approve on the device, scan the signature back, broadcast.",
        "Keep using the QR path even when something quicker is offered. An air gap you step around when convenient is not an air gap."
      ])}

      <h2><span class="sc-article-num">3</span>Create the wallet and write the words down</h2>

      <p>Choose to create a new wallet rather than restoring one. The device generates the seed itself and shows the words on its own screen.</p>

      ${checklist([
        "Write the words in order, by hand, on paper or metal.",
        "Complete the confirmation step the device runs afterwards &mdash; it catches transcription errors while they are still fixable.",
        "Store the backup away from the device, so one theft or one fire cannot take both.",
        "Do this even if you intend to rely on Keycards or SeedQR. Handwritten words are the format that restores into anything, years from now, with no hardware in between."
      ])}

      <h2><span class="sc-article-num">4</span>Understand the newer backup options before choosing one</h2>

      <p>Prime replaces the old microSD workflow with NFC Keycards and SeedQR, and Envoy offers an automated backup arrangement on top. These are genuinely convenient. They are also, every one of them, an object or a file that can reconstruct your wallet &mdash; so the question for each is the same one: <em>who could use this if they had it?</em></p>

      ${checklist([
        "<strong>Keycards</strong> are physical cards you tap to the device. Treat one exactly as you would treat a seed card: stored away from the device, never photographed, never left in a laptop bag.",
        "<strong>SeedQR</strong> encodes your seed as a QR code you can print or stamp. Restoring is a two-second scan instead of typing twenty-four words, which removes a real source of error.",
        "<strong>Envoy's backup features</strong> automate part of this. Before enabling any of them, read Foundation's description of exactly what is stored, where it goes, and what is needed to restore it."
      ])}

      ${callout("SeedQR deserves one extra piece of caution", "A handwritten word list photographed by accident is bad. A SeedQR photographed by accident is worse, because it is machine-readable — anyone with the image has your wallet in the time it takes to scan it, with no transcription and no ambiguity. Store it exactly as you would store the words, and be deliberate about never having a camera pointed at it.")}

      <h2><span class="sc-article-num">5</span>Decide what else this device is going to do</h2>

      <p>Prime's firmware also handles 2FA codes, FIDO security keys, and encrypted file storage. That is a real convenience &mdash; one device, one set of habits, one thing to keep safe.</p>

      <p>It is also more code, more interfaces, and more reasons to pick the device up and connect it to things. A single-purpose signer that sits in a drawer between uses has a small attack surface partly because it does so little.</p>

      ${checklist([
        "If this device holds meaningful savings, consider leaving the extra apps unused and keeping it boring.",
        "If you do want one device for everything, that is a legitimate choice &mdash; make it knowingly rather than by enabling features as you meet them.",
        "Either way, do not let the convenience features change how often the device is handled, connected, or carried around."
      ])}

      <h2><span class="sc-article-num">6</span>Turn off the radios you are not using</h2>

      <p>Prime adds Bluetooth and NFC alongside the camera. If your signing happens over QR &mdash; and it should, because that is what this device is for &mdash; then the radios are capability you are not using.</p>

      <p>This is not a claim that they are broken. It is the ordinary principle that a signer's job is to be boring, and every enabled interface is one more thing that has to be correct.</p>

      <h2><span class="sc-article-num">7</span>Verify an address, then check the backup</h2>

      ${checklist([
        "Generate a receive address and display it on the Passport screen. Compare the whole string against what your computer shows, not just the first and last few characters.",
        "Review the recipient and the amount on the device before approving any send.",
        "Send a small test amount, confirm it arrives, and send it back out.",
        "Restore your words onto wiped hardware and confirm the same wallet appears, before the amount gets serious."
      ])}

      <h2>What you are trading</h2>

      <p>Being specific about this makes the choice an informed one rather than a brand preference.</p>

      ${checklist([
        "<strong>You gain a genuine air gap.</strong> Whatever is wrong with your computer stays on your computer. Very few devices offer this as the default rather than an advanced option.",
        "<strong>You gain open-source firmware</strong>, so the design is examined publicly rather than asserted.",
        "<strong>You give up single-purpose simplicity.</strong> Prime is no longer bitcoin-only, and the extra apps and radios add surface a dedicated signer avoids. If that matters more to you than the convenience, the earlier bitcoin-only Passport is a different trade worth looking at.",
        "<strong>You take on a newer backup system.</strong> Keycards and SeedQR are faster than transcription and are also newer, less universal formats. Handwritten words remain the thing that will still work with anything in a decade."
      ])}

      ${callout("Before you fund it properly", `Run the drill in <a href='recovery-test-drill.html'>test your recovery</a>, and test the backup format you actually intend to rely on. If your plan is Keycards, restore from a Keycard. If it is SeedQR, restore by scanning it. An untested backup format is an assumption regardless of how modern it is.`)}

      <p class="sc-source-note">
        Passport Prime is a recent and substantially redesigned device, and backup features in particular are still evolving. Confirm the current setup flow, the tamper-evidence checks, and exactly what any automated backup stores against
        ${official("https://foundation.xyz/", "Foundation's own documentation")}
        before following any step here that does not match what your device shows.
      </p>`
  },
  {
    slug: "jade-setup",
    category: "devices",
    products: ["jade"],
    title: "Blockstream Jade: first-time setup",
    summary: "Jade protects your PIN differently from every other device on this site, and that choice shapes your backup plan. Understand it first, then set the thing up.",
    level: "beginner",
    minutes: 35,
    goals: ["setup"],
    tags: ["Open source", "QR air-gap", "PIN unlock"],
    icon: "bi-usb-drive",
    updated: "2026-08-17",
    productGuide: true,
    status: "published",
    related: ["recovery-test-drill", "sparrow-first-wallet", "multisig-2of3"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Jade is open source down to the hardware, inexpensive, and capable of fully air-gapped signing over QR codes. It is one of the easiest recommendations on this site. It also does one thing so differently from every other device here that setting it up without understanding it first is how people end up surprised later.</p>

      <p>That thing is the PIN. On most hardware wallets a dedicated secure element chip stores your key and counts failed attempts. Jade takes a different route, and the consequence is a design decision you make during setup rather than a detail you can ignore.</p>

      ${figureSlot({
        shot: "A Blockstream Jade Plus held up with its camera facing a laptop screen displaying a QR code, mid-scan.",
        caption: "The camera is the reason to buy this device. Signing without ever plugging it in is the default, not a workaround.",
        ratio: "16 / 9",
        icon: "bi-usb-drive"
      })}

      ${prerequisites([
        "A Jade, unopened, bought from Blockstream or an authorised reseller.",
        "The companion app or your chosen wallet software &mdash; Sparrow, Nunchuk, and Specter all support it.",
        "A pen and a backup card or metal plate.",
        "An uninterrupted half hour somewhere private.",
        "No bitcoin. Move none until the checks at the end pass."
      ])}

      <h2><span class="sc-article-num">1</span>Check the packaging and run the genuine check</h2>

      <p>Inspect the packaging for cuts, re-glued seams, or a second seal laid over the first, and the case for scratches around the seam. Then run the genuine check offered by the companion app, which asks the device to prove cryptographically that it is real Blockstream hardware.</p>

      ${cautions([
        "A device that arrives already set up, already holding a wallet, or supplied with a printed recovery phrase is compromised. Stop and contact the vendor.",
        "Install firmware only through the official app or Blockstream's own instructions."
      ])}

      <h2><span class="sc-article-num">2</span>How the PIN actually works</h2>

      <p>Jade has no dedicated secure element chip. Instead it uses what Blockstream calls a virtual secure element: your seed is stored encrypted on the device, and the key needed to decrypt it is not held entirely on the device either. Part of it lives on a server &mdash; Blockstream's, by default.</p>

      <p>When you enter your PIN, the device talks to that server to complete the unlock. The server is what enforces the limit on wrong attempts, doing the job a secure element chip does elsewhere.</p>

      <p>Two things follow, and neither is hidden or sinister &mdash; but both are yours to plan around:</p>

      ${checklist([
        "<strong>Unlocking normally needs connectivity.</strong> Not to sign, and not to hold your keys &mdash; to unlock. A device that cannot reach the server cannot be unlocked in the usual way.",
        "<strong>The server cannot spend your bitcoin.</strong> It holds a fragment used in decryption, not your key, and not your recovery words. It cannot reconstruct your wallet and neither can anyone who compromises it."
      ])}

      ${callout("This is a trade, not a flaw", "It removes the closed, unauditable chip that other devices depend on, which is exactly what lets Jade be open source all the way down. In exchange, ordinary unlocking involves a service. Whether that is a good trade depends on what you are optimising for &mdash; auditability or independence &mdash; and the next section covers what to do if you want both.")}

      <h2><span class="sc-article-num">3</span>Choose how you want to run it</h2>

      <p>Decide this now, because it determines what your backup has to cover.</p>

      <div class="sc-guide-choice-grid sc-jade-modes" aria-label="Three ways to operate a Jade">
        <article class="sc-guide-choice is-jade-default"><span class="sc-choice-status">Convenient</span><h3>Default</h3><dl><div><dt>How it works</dt><dd>Seed stored on the device; PIN unlock completed through Blockstream's server.</dd></div><div><dt>Good fit</dt><dd>Most people. The server assists with unlocking but cannot spend your coins.</dd></div></dl></article>
        <article class="sc-guide-choice is-jade-server"><span class="sc-choice-status">Independent</span><h3>Your own server</h3><dl><div><dt>How it works</dt><dd>The same design, but you run the open-source unlock service yourself.</dd></div><div><dt>Good fit</dt><dd>People who want the architecture without the external dependency.</dd></div></dl></article>
        <article class="sc-guide-choice is-jade-stateless"><span class="sc-choice-status">Stateless</span><h3>No stored seed</h3><dl><div><dt>How it works</dt><dd>Enter the recovery words to sign; the device forgets them afterwards.</dd></div><div><dt>Good fit</dt><dd>Air-gapped users who want a stolen device to contain nothing useful.</dd></div></dl></article>
      </div>

      <p>The third mode changes the shape of your risk entirely. A Jade holding no seed is just electronics &mdash; losing it costs you the hardware and nothing else. The cost is that every signing session starts with entering your words, which is slower and puts them in front of you far more often. That is a real trade-off in both directions, and it only works if your backup is somewhere you can reach routinely.</p>

      <h2><span class="sc-article-num">4</span>Create the wallet and write the words down</h2>

      <p>Choose to create a new wallet rather than restoring one. The device generates the words and shows them on its own screen.</p>

      ${checklist([
        "Write the words in order, by hand, on paper or metal.",
        "Complete the confirmation step the device runs afterwards.",
        "Store the backup away from the device.",
        "If you plan to run without a stored seed, your backup is not an emergency document &mdash; it is something you will handle regularly. Store it accordingly."
      ])}

      ${cautions([
        "Never photograph the words or type them into a computer or phone.",
        "Nobody legitimate will ever ask for them &mdash; not Blockstream, not support, not a wallet-validation page."
      ])}

      <h2><span class="sc-article-num">5</span>Set up QR signing, which is the reason to own this</h2>

      <p>Jade Plus has a camera and a screen large enough to display QR codes back. That means the whole signing loop can happen without the device ever being connected to anything: your wallet software shows an unsigned transaction as a QR code, Jade reads it, you approve on the device, and Jade displays the signature as a QR code for the computer to read back.</p>

      <p>No cable, no Bluetooth, no shared bus. Whatever is wrong with your computer stays on your computer.</p>

      ${checklist([
        "Pair Jade with <a href='sparrow-first-wallet.html'>Sparrow</a>, Nunchuk, or Specter using the QR or camera option rather than USB.",
        "Export the wallet's public keys by QR so the software can watch the wallet without ever touching a key.",
        "Run one full transaction this way before relying on it &mdash; scan out, approve, scan back, broadcast.",
        "Keep using the QR path even when a cable would be quicker. An air gap you bypass when convenient is not an air gap."
      ])}

      <h2><span class="sc-article-num">6</span>Turn off what you are not using</h2>

      <p>Jade offers Bluetooth and USB alongside the camera. If you have set up QR signing, you do not need the radio, and a capability you never use should not be switched on.</p>

      <p>This is not a claim that Bluetooth on this device is broken. It is the ordinary principle that a signer's job is to be boring, and every enabled interface is one more thing that has to be correct.</p>

      <h2><span class="sc-article-num">7</span>Verify an address, then check the backup</h2>

      ${checklist([
        "Generate a receive address and display it on the Jade screen. Compare the whole string against what the computer shows.",
        "Send a small test amount, confirm it arrives, and send it back out.",
        "Restore your words onto wiped hardware, or into a temporary session, and confirm the same wallet appears.",
        "Do all of this before the wallet holds anything you would miss."
      ])}

      <h2>What this means for your backup plan</h2>

      <p>Because Jade's unlock design is unusual, it is worth being explicit about what your recovery words do and do not depend on.</p>

      ${checklist([
        "<strong>Your words are a complete backup.</strong> They restore your wallet on any compatible device or software, with no involvement from Blockstream, any server, or your original Jade.",
        "<strong>The server is not part of your backup.</strong> It participates in unlocking a particular device, not in owning the wallet. If it vanished permanently your bitcoin would be entirely recoverable from your words.",
        "<strong>The PIN is not a backup either.</strong> It protects the device against someone holding it. Losing the PIN costs you the device's convenience, not the wallet.",
        "<strong>Multisig changes the picture.</strong> If this Jade is one key in a <a href='multisig-2of3.html'>multisig</a>, you also need the wallet configuration backed up. Words alone will not rebuild it."
      ])}

      ${callout("Before you fund it properly", `Run the drill in <a href='recovery-test-drill.html'>test your recovery</a>. It matters on every device and slightly more here, because Jade offers several ways to operate and you want to have proven the one you actually chose.`)}

      <p class="sc-source-note">
        Modes, menu wording, and hardware revisions change between releases. Confirm the current setup flow and the details of the PIN design against
        ${official("https://blockstream.com/jade/", "Blockstream's own documentation")}
        before following any step here that does not match what your device shows.
      </p>`
  },
  {
    slug: "bitbox02-setup",
    category: "devices",
    products: ["bitbox"],
    title: "BitBox02: first-time setup",
    summary: "The microSD backup is what makes this device fast to set up and the part worth thinking hardest about. Here is how to use it without ending up with one fragile copy of everything.",
    level: "beginner",
    minutes: 30,
    goals: ["setup"],
    tags: ["Bitcoin-only", "microSD backup", "Open source"],
    icon: "bi-usb-drive",
    updated: "2026-08-17",
    productGuide: true,
    status: "published",
    related: ["recovery-test-drill", "sparrow-first-wallet", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Most hardware wallets back up by making you write twelve or twenty-four words on a card. The BitBox02 does that too, but its headline feature is a backup written to a microSD card in a few seconds &mdash; which is genuinely faster, genuinely less error-prone, and the one part of this setup that deserves a proper think rather than a shrug.</p>

      <p>The rest is straightforward. Open-source firmware, a dual-chip design, touch sliders instead of buttons, and a Bitcoin-only edition that is locked to bitcoin at the factory. Half an hour is plenty.</p>

      ${figureSlot({
        shot: "A BitBox02 connected to a laptop by USB-C with a microSD card inserted, the small OLED screen lit, backup card and pen alongside.",
        caption: "Two backups, not one: the card is fast, the handwritten words are portable.",
        ratio: "16 / 9",
        icon: "bi-usb-drive"
      })}

      ${prerequisites([
        "A BitBox02, unopened, bought from bitbox.swiss or an authorised reseller.",
        "The BitBoxApp, downloaded from bitbox.swiss typed by hand rather than reached from a search result.",
        "The supplied microSD card, plus a second one if you want a duplicate.",
        "A pen and a backup card or metal plate &mdash; you are doing both backups, for reasons explained below.",
        "No bitcoin. Move none until the recovery check at the end passes."
      ])}

      <h2><span class="sc-article-num">1</span>Take the Bitcoin-only edition, and know it is permanent</h2>

      <p>The Bitcoin-only firmware edition is locked at the factory. It cannot later be switched to the multi-asset firmware, and that is the point rather than a limitation.</p>

      <p>Less code means less that can go wrong, no handling logic for assets you do not own, and no path by which an unrelated coin's bug reaches your bitcoin. If bitcoin is what you hold, this is the edition to buy &mdash; but decide before ordering, because you cannot change your mind in software afterwards.</p>

      <h2><span class="sc-article-num">2</span>Check the packaging and pair the device</h2>

      <p>Inspect the packaging for cuts, re-glued seams, or a second seal over the first, and the case for scratches around the seam. Then connect it over USB-C and let the BitBoxApp guide the pairing.</p>

      <p>Pairing shows a code on both the device screen and the computer. Compare them and confirm on the device &mdash; this is what establishes that the app is talking to your device rather than something in between.</p>

      ${cautions([
        "A device that arrives already set up, already holding a wallet, or supplied with a printed recovery phrase is compromised. Stop and contact the vendor.",
        "Install firmware and the BitBoxApp only from bitbox.swiss. Files offered by an email, a message, or a support agent are the attack."
      ])}

      <h2><span class="sc-article-num">3</span>Set the device password</h2>

      <p>The BitBox02 uses a device password rather than a numeric PIN, entered on the device itself with the touch sliders. It takes a moment to get used to; that is normal and worth the small learning curve, because the computer never sees what you enter.</p>

      ${checklist([
        "Choose something you can recall under stress and record it somewhere durable.",
        "Store it separately from your backups &mdash; finding one should not hand over both.",
        "Repeated wrong entries will reset the device, which is recoverable only from your backup."
      ])}

      <h2><span class="sc-article-num">4</span>The microSD backup, and how to treat it</h2>

      <p>During setup the device writes your wallet backup to the microSD card. It takes seconds, there is nothing to transcribe, and it removes the single most common cause of unrecoverable wallets: a handwriting mistake nobody notices for three years.</p>

      <p>It also means a physical object now exists which, together with your device password, can restore your wallet. So it gets stored with the same seriousness as a written seed &mdash; not left in the device, not in a drawer with the BitBox02, not in a laptop bag.</p>

      ${checklist([
        "Remove the card once the backup is written. A card left in the device is not a backup, it is the same object.",
        "Store it away from the device, so one theft or one fire cannot take both.",
        "Make a second card if you want redundancy, and store it somewhere else again.",
        "Label the cards in a way that means something to you and nothing to a stranger."
      ])}

      ${cautions([
        "Do not copy the backup file onto a computer, a cloud drive, or a phone to make an extra copy. That converts a controlled physical object into copies you cannot track.",
        "microSD cards fail. They are reliable enough for this and not reliable enough to be your only backup, which is what the next step is for."
      ])}

      <h2><span class="sc-article-num">5</span>Write the words down as well</h2>

      <p>The device can also display your recovery words. Do this, and write them by hand, even though you already have the card.</p>

      <p>Two reasons, and they are both practical rather than theoretical. Flash memory degrades, cards get bent, and a backup that depends on one small piece of electronics working in ten years is a backup with a shelf life. And the words are portable &mdash; they will restore into other wallet software if you ever want to move, whereas the card is a BitBox format.</p>

      ${callout("The card is for speed, the words are for longevity", "This is not belt-and-braces paranoia. They fail in completely different ways: the card protects you from mistranscribing, and the words protect you from the card dying or the format becoming inconvenient. Doing both takes ten extra minutes, once.")}

      <h2><span class="sc-article-num">6</span>Verify a receive address on the device</h2>

      <p>Malware that swaps addresses in the clipboard is common and cheap. The computer shows what an attacker wants you to see; the small screen on the device does not.</p>

      ${checklist([
        "Generate a receive address and display it on the device.",
        "Compare the whole string, not only the first and last few characters.",
        "Review the recipient and amount on the device before approving any send.",
        "Send a small test amount, confirm it arrives, and send it back out before committing real savings."
      ])}

      <h2><span class="sc-article-num">7</span>Using it beyond the BitBoxApp</h2>

      <p>The BitBoxApp is a good guided starting point. The device also works as a signer for <a href="sparrow-first-wallet.html">Sparrow</a>, Electrum, and Specter, which is worth knowing once you want coin control, labelling, or a connection to your own node.</p>

      <p>Your keys stay on the BitBox02 either way. You are changing which software builds the transactions, not where the signing happens.</p>

      <h2>What this device does not do</h2>

      ${checklist([
        "<strong>No camera-based air gap.</strong> Normal use is connected over USB-C. If signing without ever touching a computer is what you want, this is the wrong device rather than a device to use differently.",
        "<strong>Limited iOS support on older hardware.</strong> The original BitBox02 does not work with iPhone or iPad &mdash; check the current model if that matters to you.",
        "<strong>It cannot save you from approving a bad transaction.</strong> If you confirm a payment to an attacker's address on the device screen, everything worked as designed."
      ])}

      ${callout("Before you fund it properly", `Run the drill in <a href="recovery-test-drill.html">test your recovery</a> &mdash; and test <em>both</em> backups. Restore from the microSD card, and separately confirm the written words produce the same wallet. Two backups you have never tested are two assumptions, not two safety nets.`)}

      <p class="sc-source-note">
        Setup wording, model names, and app behaviour change between releases. Confirm the current flow against
        ${official("https://bitbox.swiss/", "BitBox's own documentation")}
        and trust what the device screen tells you over any page, including this one.
      </p>`
  },
  {
    slug: "trezor-safe-setup",
    category: "devices",
    products: ["trezor"],
    title: "Trezor Safe: first-time setup",
    summary: "Why the device arrives with no firmware on it, how to record a backup you can actually restore, and which of the extras to leave switched off.",
    level: "beginner",
    minutes: 35,
    goals: ["setup"],
    tags: ["Open source", "Secure element", "Shamir backup"],
    icon: "bi-usb-drive",
    updated: "2026-08-17",
    productGuide: true,
    status: "published",
    related: ["recovery-test-drill", "sparrow-first-wallet", "multisig-2of3"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Trezor's setup has one unusual property worth understanding before you start: the device arrives with <em>no firmware installed at all</em>. Plug it in and it will tell you so, then install firmware and check the manufacturer's signature before it runs.</p>

      <p>That is not an oversight or a cost saving. Firmware installed at the factory would be firmware you have to take on trust; firmware you install yourself, verified against a signature the device checks, is one fewer thing a tampered supply chain can hide in. If your device boots straight into a working wallet on first connection, something is wrong.</p>

      <p>Set aside about half an hour. The parts that need care are the backup and the passphrase decision, and neither should be rushed.</p>

      ${figureSlot({
        shot: "A Trezor Safe still sealed in its packaging with the holographic seal clearly visible across the opening, on a plain dark surface.",
        caption: "Check the seal before you open it. It is the first step of the setup, not the packaging.",
        ratio: "16 / 9",
        icon: "bi-usb-drive"
      })}

      ${prerequisites([
        "A Trezor Safe, unopened, bought from trezor.io or an authorised reseller.",
        "Trezor Suite, downloaded from trezor.io typed by hand rather than reached from a search result.",
        "The supplied backup cards and a pen, or a metal backup plate.",
        "An uninterrupted half hour, somewhere private, with no camera pointing at the desk.",
        "No bitcoin. Nothing here needs funds, and none should be moved until the backup check at the end passes."
      ])}

      <h2><span class="sc-article-num">1</span>Check the seal, then let the device install its own firmware</h2>

      <p>Inspect the holographic seal for cuts, lifting, residue, or a second seal laid over the first. Look at the case seam and screen edge for the scratches that suggest something has been prised open.</p>

      <p>Then connect it and let Trezor Suite walk you through installing firmware. The device verifies the signature itself before running anything.</p>

      ${cautions([
        "A Trezor that arrives with firmware already installed, already showing a wallet, or already holding a PIN has been tampered with. Stop and contact the vendor.",
        "Install firmware only through Trezor Suite. Files offered by a link, an email, or a support agent are the attack, not the fix."
      ])}

      <h2><span class="sc-article-num">2</span>Choose Bitcoin-only firmware if bitcoin is all you hold</h2>

      <p>Trezor publishes a Bitcoin-only firmware edition alongside the standard one. Same hardware, with support for every other asset removed.</p>

      <p>Less code is less to go wrong: a smaller attack surface, and no possibility of an unrelated coin's handling logic affecting your bitcoin. If bitcoin is what you own, take the Bitcoin-only edition. Switching later is possible but means restoring from your backup, so it is easier to decide now.</p>

      <h2><span class="sc-article-num">3</span>Create the wallet and write the backup by hand</h2>

      <p>Choose to create a new wallet rather than recovering one. The device generates the seed itself and displays the words on its own screen &mdash; they never appear on your computer, which is the entire point of the arrangement.</p>

      ${checklist([
        "Select create new wallet, never recover, unless you are deliberately restoring an existing one.",
        "Write the words down in order, by hand, on the supplied cards or a metal plate.",
        "Complete the confirmation step the device runs afterwards. It catches transcription errors while they are still fixable.",
        "Keep the backup and the device in different places once you are finished."
      ])}

      ${cautions([
        "Never photograph the words, type them into a computer or phone, or store them in a password manager.",
        "Nobody legitimate will ever ask for them &mdash; not Trezor, not support, not a wallet-validation page."
      ])}

      <h2><span class="sc-article-num">4</span>Standard backup, or Shamir shares</h2>

      <p>Safe models offer a second backup format: instead of one list of words, your key is split into several shares, of which a threshold is needed to rebuild it. You might create three shares and require any two.</p>

      <p>The appeal is real. No single piece of paper is sufficient on its own, so one share found in a drawer does not compromise you, and one share lost in a fire does not lock you out.</p>

      ${callout("Shamir shares are not multisig, and the difference matters", `Shamir splits <em>one key</em> into pieces. When you recover, those pieces are reassembled into that single key, which exists whole again on the device at that moment. <a href="multisig-2of3.html">Multisig</a> uses several genuinely independent keys, and no single key is ever sufficient or ever assembled anywhere. They protect against different things, and Shamir is not a substitute for multisig.`)}

      ${checklist([
        "If you use Shamir, store every share in a different place. Two shares in one house is a standard backup with extra steps.",
        "Record the threshold in writing &mdash; a future you who finds three envelopes needs to know how many are required.",
        "Test the recovery with only the threshold number of shares, not all of them.",
        "If any of that sounds like more than you want to manage, the standard single backup is a perfectly good choice."
      ])}

      <h2><span class="sc-article-num">5</span>Set the PIN</h2>

      <p>The PIN protects the device against someone who physically has it. Set one during the guided setup, choose something you can recall under stress, and record it somewhere durable and separate from your recovery words.</p>

      <p>On models with a touchscreen the PIN is entered on the device itself, so a keylogger on your computer never sees it. Wrong guesses trigger an increasing delay, which makes brute-forcing impractical rather than merely slow.</p>

      ${callout("The PIN is not what keeps your bitcoin safe", "Anyone holding your recovery words can rebuild this wallet without ever touching the device or knowing the PIN. The PIN buys you time if the device is stolen. The backup is the thing that has to stay secret.")}

      <h2><span class="sc-article-num">6</span>Turn off what you are not using</h2>

      <p>Premium models add conveniences &mdash; Bluetooth, wireless charging, a battery &mdash; and each one is a feature you may not want on a device whose job is to sit in a drawer and be boring.</p>

      <p>Bluetooth in particular can be disabled. If your Trezor lives at home and only ever connects by cable, there is no reason to leave a radio enabled on it. This is not a claim that the radio is broken; it is the ordinary principle that a capability you never use should not be switched on.</p>

      <h2><span class="sc-article-num">7</span>Decide about a passphrase &mdash; carefully</h2>

      <p>A passphrase creates an additional wallet reached by your recovery words <em>plus</em> that phrase. Trezor calls these hidden wallets, and they are genuinely useful: the words alone lead to a separate, ordinary-looking wallet, so a backup found by someone else does not reveal everything.</p>

      <p>They are also the most common way people lose funds through their own configuration, and are worth <a href='passphrase-setup.html'>reading about properly</a> before you commit to one. A passphrase is not a password on an account &mdash; there is no reset, no hint, and no error message. A single wrong character silently opens a different empty wallet that looks exactly like a wallet you have emptied.</p>

      ${cautions([
        "Do not add a passphrase on a first setup unless you already understand how to recover from one.",
        "If you use one, record it as carefully as the seed, stored separately so finding one does not hand over both.",
        "Write down the fact that you used a passphrase at all. People have restored the words alone, seen an empty wallet, and concluded the backup failed."
      ])}

      <h2><span class="sc-article-num">8</span>Verify an address, then check the backup</h2>

      <p>Two checks before this wallet holds anything meaningful, and neither is optional.</p>

      ${checklist([
        "Generate a receive address and display it on the device screen. Compare the full string against what the computer shows &mdash; malware that swaps addresses in the clipboard is common, and the device screen is the display it cannot rewrite.",
        "Run the backup check in Trezor Suite. It has you re-enter the words and confirms whether they match the key on the device, without overwriting anything.",
        "Send a small test amount, confirm it arrives, and send it back out again.",
        "If you set a passphrase, run both checks against the passphrase wallet as well &mdash; that is the wallet you will actually use."
      ])}

      <p>The backup check is comparing, not restoring, so it is safe to run at any time. What it does not prove is that you could rebuild the wallet on different hardware &mdash; for that, do a full restore onto a spare device at least once before the amount gets serious.</p>

      <h2>What this setup does not protect against</h2>

      <p>Trezor's design is open source, which means its security properties are examined publicly rather than asserted. That is a real advantage, and it also means the limits are documented rather than hidden.</p>

      ${checklist([
        "<strong>A passphrase you cannot reproduce.</strong> Nothing in the device can help you here. This remains the most likely way to lose a correctly set-up wallet.",
        "<strong>Approving a bad transaction.</strong> If you confirm a payment to an attacker's address on the device screen, everything worked exactly as designed. Verification is your job, and it happens before you press confirm.",
        "<strong>A backup stored badly.</strong> The device cannot know that your recovery card is in the same drawer as the Trezor.",
        "<strong>Sophisticated physical attacks.</strong> Secure elements raise the cost of extracting a key from a device someone is holding, considerably. They do not make it impossible, which is a reason to treat physical loss as urgent rather than merely annoying."
      ])}

      ${callout("Before you fund it properly", `Run the full drill in <a href="recovery-test-drill.html">test your recovery</a>. A wallet you have never restored is the one part of this setup that has not actually been checked &mdash; and it is the part everything else depends on.`)}

      <p class="sc-source-note">
        Model lineups, firmware editions, and menu wording change between releases. Confirm the current setup flow against
        ${official("https://trezor.io/learn", "Trezor's own documentation")}
        before following any step here that does not match what your device is showing you.
      </p>`
  },
  {
    slug: "seedsigner-setup",
    category: "devices",
    products: ["seedsigner"],
    title: "SeedSigner: build and first use",
    summary: "Assembling the hardware, flashing the image, and the stateless signing model that keeps nothing on the device.",
    level: "advanced",
    minutes: 60,
    goals: ["setup"],
    tags: ["DIY", "Stateless", "QR"],
    icon: "bi-cpu",
    status: "idea"
  },
  {
    slug: "krux-setup",
    category: "devices",
    products: ["krux"],
    title: "Krux: install and first use",
    summary: "Flashing supported hardware, verifying the release, and signing over QR.",
    level: "advanced",
    minutes: 60,
    goals: ["setup"],
    tags: ["DIY", "QR"],
    icon: "bi-cpu",
    status: "idea"
  },
  {
    slug: "ledger-setup",
    category: "devices",
    products: ["ledger"],
    title: "Ledger: first-time setup",
    summary: "Why the box seal proves nothing, what the genuine check actually verifies, the one optional service to think hard about, and the phishing every Ledger owner should expect.",
    level: "beginner",
    minutes: 35,
    goals: ["setup"],
    tags: ["Secure element", "Ledger Live", "Phishing"],
    icon: "bi-usb-drive",
    updated: "2026-08-17",
    productGuide: true,
    status: "published",
    related: ["recovery-test-drill", "sparrow-first-wallet", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Ledger has the largest installed base of any hardware wallet, which means two things for this guide. The setup is polished and hard to get wrong. And Ledger owners are the single most heavily targeted group of bitcoin holders for phishing, which is a section further down that matters more than any of the setup steps.</p>

      <p>There are also two decisions worth making before you begin rather than partway through: whether to enable an optional backup service, and whether to drive the device with Ledger's own app or with Bitcoin-only software. Both are covered below.</p>

      ${figureSlot({
        shot: "A Ledger device and its box on a desk, with a laptop showing Ledger Live's genuine-check result beside it.",
        caption: "The check that matters happens on screen, not on the packaging.",
        ratio: "16 / 9",
        icon: "bi-usb-drive"
      })}

      ${prerequisites([
        "A Ledger device bought from ledger.com or an authorised reseller &mdash; never a marketplace listing or second-hand.",
        "Ledger Live, downloaded from ledger.com typed by hand rather than reached from a search result or an email.",
        "The supplied recovery sheets and a pen, or a metal backup plate.",
        "An uninterrupted half hour somewhere private.",
        "No bitcoin. Move none until the checks at the end pass."
      ])}

      <h2><span class="sc-article-num">1</span>The box seal is not the security check</h2>

      <p>Ledger deliberately does not rely on tamper-evident stickers, on the reasoning that seals are cheap to forge and give false confidence. Some boxes arrive looking casually opened. That is expected and is not, by itself, a problem.</p>

      <p>The real check is cryptographic. Each device holds an attestation key issued during manufacturing, and Ledger Live challenges the device to prove it holds a genuine one. A cloned or substituted device cannot produce that proof.</p>

      ${checklist([
        "Connect the device and run the genuine check when Ledger Live offers it. Do not skip past it.",
        "Set the device up yourself from a blank state &mdash; you should be choosing a PIN and generating a phrase, not being shown one.",
        "Install any firmware update Ledger Live offers before creating the wallet."
      ])}

      ${cautions([
        "A device that arrives already initialised, already holding a PIN, or supplied with a printed recovery phrase is an attack. There is no legitimate version of this.",
        "Never buy Ledger hardware second-hand or through a marketplace, however sealed it appears."
      ])}

      <h2><span class="sc-article-num">2</span>Set the PIN, on the device</h2>

      <p>You choose a PIN using the device's own buttons or touchscreen, so a keylogger on the computer never sees it. Three wrong attempts wipes the device &mdash; which is a feature, and also the reason your recovery phrase needs to exist before you rely on the PIN.</p>

      ${checklist([
        "Choose something you can recall under stress, longer than four digits if the device allows it.",
        "Record it somewhere durable, and separate from your recovery phrase.",
        "Remember that a wipe is recoverable from your phrase, and only from your phrase."
      ])}

      <h2><span class="sc-article-num">3</span>Write down the recovery phrase</h2>

      <p>The device generates the phrase and shows it on its own screen, one word at a time. It never appears on your computer.</p>

      ${checklist([
        "Write the words in order, by hand, on the supplied sheets or a metal plate.",
        "Complete the confirmation step the device runs afterwards.",
        "Store the phrase away from the device, so one theft or one fire cannot take both."
      ])}

      ${cautions([
        "Never photograph the phrase, type it into any computer or phone, or enter it into a website for any reason whatsoever.",
        "Ledger will never ask for it. Any message, email, letter, or support agent asking for it is stealing from you."
      ])}

      <h2><span class="sc-article-num">4</span>Ledger Recover: decide deliberately, then move on</h2>

      <p>Ledger offers an optional subscription service that backs up your recovery phrase by encrypting it, splitting it into shares, and storing those with third-party custodians, with identity verification required to restore. It is opt-in and drew considerable criticism when it launched.</p>

      <p>The objection is not that the cryptography is weak. It is that a service which can reconstruct your key on request, tied to your verified identity, reintroduces exactly the dependency self-custody exists to remove &mdash; a third party who can be compelled, breached, or simply go out of business.</p>

      <p>If you are here to self-custody, decline it and keep your own backup. The service can be ignored entirely and the device works as normal without it. If you are considering it for genuine reasons &mdash; no safe place for a written backup, or nobody who could help you recover &mdash; treat it as a considered trade rather than a default, and understand that you are choosing to have a recoverable identity-linked copy of your key exist.</p>

      <h2><span class="sc-article-num">5</span>Install the Bitcoin app</h2>

      <p>Ledger devices are multi-asset by default and there is no Bitcoin-only firmware edition. Individual coin apps are installed through Ledger Live as you need them.</p>

      ${checklist([
        "Install only the Bitcoin app if bitcoin is all you hold. Every app you do not install is code that is not on the device.",
        "Ledger Live will show your account once the app is installed and the device is unlocked.",
        "Keep the firmware and the Bitcoin app updated through Ledger Live rather than any other source."
      ])}

      <h2><span class="sc-article-num">6</span>Verify a receive address on the device</h2>

      <p>This is the step that defeats malware which swaps addresses on your screen. The computer is assumed to be lying; the device is the thing you trust.</p>

      ${checklist([
        "Generate a receive address and display it on the device.",
        "Compare the whole string, not just the first and last few characters &mdash; lookalike addresses are generated to match at both ends.",
        "Review the recipient and amount on the device before approving any send.",
        "Send a small test amount, confirm it arrives, and send it back out before committing real savings."
      ])}

      <h2><span class="sc-article-num">7</span>Consider driving it with Bitcoin-only software</h2>

      <p>Ledger Live is capable and pleasant, but it is not the only option, and for a bitcoin holder it is often not the best one. The device works as a signer for third-party wallet software including <a href="sparrow-first-wallet.html">Sparrow</a> and Electrum.</p>

      <p>Doing so gives you coin control, labelling, the ability to point at your own node, and a wallet whose scope matches what you actually own. Your keys stay on the Ledger either way &mdash; you are changing which software builds the transactions, not where the signing happens.</p>

      <p>One structural limitation to know: Ledger devices connect over USB or Bluetooth and have no air-gapped signing path &mdash; no QR camera, no microSD workflow. If a fully air-gapped setup is what you want, that is a reason to look at a different device rather than a reason to use this one differently.</p>

      <h2>Expect targeted phishing, because it is aimed at you specifically</h2>

      <p>In 2020 a Ledger e-commerce database was breached, exposing customer contact details including names, postal addresses, phone numbers and email addresses. That data has circulated ever since, and the result is that Ledger owners receive unusually well-informed scam attempts.</p>

      <p>These are not generic spam. They arrive addressed to you by name, sometimes referencing a real order, and occasionally by physical post.</p>

      ${checklist([
        "<strong>Fake security notices</strong> claiming a breach and urging you to verify or migrate your wallet.",
        "<strong>Fake Ledger Live updates</strong> linking to a lookalike site that asks for your recovery phrase.",
        "<strong>Physical letters or replacement devices</strong> arriving unrequested, sometimes with a tampered device or a QR code to scan.",
        "<strong>Phone calls</strong> from people who already know your name, address, and that you own a Ledger."
      ])}

      ${callout("One rule handles every version of this", "Your recovery phrase is never typed into anything except a hardware wallet you are deliberately restoring. Not a website, not Ledger Live, not an app, not a form, not a support agent, no matter what has gone wrong or how urgent it sounds. Any request for it is theft, full stop &mdash; and a device arriving in the post that you did not order goes in the bin, not into a USB port.")}

      <h2>What you are trusting</h2>

      <p>Every hardware wallet asks you to trust something. Being specific about what makes the choice an informed one.</p>

      ${checklist([
        "<strong>The secure element operating system is closed source.</strong> The individual coin apps are open, but the underlying layer cannot be independently reviewed &mdash; you are trusting Ledger's certification rather than auditing the design yourself.",
        "<strong>The certification is real but narrow.</strong> EAL ratings describe resistance to specific evaluated attacks, not a general guarantee.",
        "<strong>There is no air-gapped path.</strong> The device is always connected to something when signing.",
        "<strong>Updates flow through Ledger Live.</strong> Convenient, and a channel you depend on."
      ])}

      <p>None of that makes the device unsuitable &mdash; it is certified hardware with a large user base and a mature app. It does mean the trade is different from a fully open, air-gapped design, and it is worth knowing which one you picked.</p>

      ${callout("Before you fund it properly", `Run the drill in <a href="recovery-test-drill.html">test your recovery</a>. Ledger includes a recovery check that lets you re-enter your phrase and confirms it matches the device without overwriting anything &mdash; use it, then do a full restore onto spare hardware before the amount gets serious.`)}

      <p class="sc-source-note">
        Lineups, app names, and setup wording change between releases. Confirm the current flow against
        ${official("https://support.ledger.com/", "Ledger's own documentation")}
        &mdash; reached by typing the address yourself &mdash; and trust the device screen over any page, including this one.
      </p>`
  },
  {
    slug: "bitkey-setup",
    category: "devices",
    products: ["bitkey"],
    title: "Bitkey: first-time setup",
    summary: "The phone-plus-hardware-plus-recovery model, and what the recovery service can and cannot do.",
    level: "beginner",
    minutes: 25,
    goals: ["setup"],
    tags: ["Mobile", "Assisted recovery"],
    icon: "bi-phone",
    status: "idea"
  },
  {
    slug: "tapsigner-setup",
    category: "devices",
    products: ["tapsigner"],
    title: "TAPSIGNER: setup and NFC signing",
    summary: "Initialising the card, recording the backup, and using it as a key in a supported mobile wallet.",
    level: "beginner",
    minutes: 20,
    goals: ["setup"],
    tags: ["NFC", "Card"],
    icon: "bi-credit-card-2-front",
    status: "idea"
  },
  {
    slug: "satscard-setup",
    category: "devices",
    products: ["satscard"],
    title: "SATSCARD: loading and unsealing",
    summary: "How the slots work, what unsealing does, and why this is a bearer instrument rather than a savings wallet.",
    level: "beginner",
    minutes: 15,
    goals: ["setup", "learn"],
    tags: ["NFC", "Card"],
    icon: "bi-credit-card-2-front",
    status: "idea"
  },
  {
    slug: "air-gapped-psbt-workflow",
    category: "devices",
    products: [],
    title: "The air-gapped PSBT workflow",
    summary: "Moving an unsigned transaction to an offline signer and the signature back, by microSD or QR, without ever connecting the device.",
    level: "intermediate",
    minutes: 25,
    goals: ["harden", "learn"],
    tags: ["PSBT", "Air-gapped"],
    icon: "bi-shuffle",
    status: "idea"
  },

  /* ----------------------------------------------------------------- software */
  {
    slug: "sparrow-first-wallet",
    category: "software",
    products: ["sparrow"],
    title: "Sparrow: pair a hardware wallet and verify a receive address",
    summary: "Create a watch-only wallet from your signing device, check an address on the device screen, and sign a first transaction.",
    level: "beginner",
    minutes: 30,
    goals: ["setup", "withdraw"],
    tags: ["Desktop", "Watch-only", "PSBT"],
    icon: "bi-window",
    updated: "2026-08-17",
    productGuide: true,
    status: "published",
    related: ["coldcard-q-setup", "exchange-withdrawal", "sparrow-coin-control"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">A hardware wallet on its own cannot tell you what you own. It holds keys and signs things; it has no idea what is on the blockchain. Sparrow is the other half &mdash; the part that watches the network, builds transactions, and hands them to your device to be signed.</p>

      <p>The arrangement is deliberate. Sparrow never sees a private key. It imports your <em>public</em> keys, which is enough to see your balance and construct a spend, but not enough to authorise one. Your device keeps the only thing that matters, and the computer is treated as untrusted throughout.</p>

      <p>This takes about half an hour, and covers the piece most people get wrong: verifying a receive address on the device rather than on the screen.</p>

      ${figureSlot({
        shot: "A laptop running Sparrow beside a hardware wallet on a desk, the same bitcoin address visible on both screens.",
        caption: "Two screens, one address. Only one of them is hard for malware to lie on.",
        ratio: "16 / 9",
        icon: "bi-window"
      })}

      ${prerequisites([
        "A hardware signing device already set up, with its recovery words written down and stored.",
        "Sparrow downloaded from sparrowwallet.com &mdash; typed by hand, not reached from a search result.",
        "A microSD card or a USB cable, depending on how your device talks to a computer.",
        "A decision about which server Sparrow will use. Read the section on that before you fund anything."
      ])}

      <h2><span class="sc-article-num">1</span>Verify the download before you run it</h2>

      <p>Wallet software is impersonated relentlessly, and a convincing fake will behave exactly like the real thing right up until it shows you an address that is not yours. The release page publishes a manifest and a signature so you can confirm the file came from the project.</p>

      ${checklist([
        "Download only from sparrowwallet.com, typed by hand rather than clicked from a search result.",
        "Fetch the manifest and its signature from the same release page.",
        "Verify the signature against the project's published key, then check the file hash against the manifest."
      ])}

      <p>This is a five-minute habit that is much easier to form now, before you have anything to lose, than later.</p>

      <p>${official("https://sparrowwallet.com/download/", "Sparrow download and verification")}</p>

      <h2><span class="sc-article-num">2</span>Create the wallet from your device's public keys</h2>

      <p>Sparrow needs to know which addresses are yours, and nothing more. Importing the extended public key gives it exactly that: the ability to watch and to build, without the ability to spend.</p>

      ${checklist([
        "File, then New Wallet, and give it a name you will still recognise in a year.",
        "Set the policy to Single Signature unless you are deliberately building a multisig.",
        "Choose the script type your device exports &mdash; Native SegWit is the usual default and produces bc1 addresses.",
        "Connect the hardware wallet over USB, or import the exported public-key file if you are working air-gapped."
      ])}

      ${callout("Check the fingerprint", "The master key fingerprint Sparrow shows after import should match the one your device reports. If they differ you have imported the wrong keys, and every address Sparrow shows you from that point on will belong to a wallet you cannot spend from.")}

      <h2><span class="sc-article-num">3</span>Verify a receive address on the device screen</h2>

      <p>This is the step the whole arrangement exists for, and the one most often skipped.</p>

      <p>Malware that swaps bitcoin addresses in the clipboard is common and cheap. It does not need to break any cryptography &mdash; it just waits for something address-shaped and substitutes its own. Sparrow will show you the attacker's address. Your browser will show you the attacker's address. The hardware device, which the malware cannot reach, will show you yours.</p>

      ${checklist([
        "Open the Receive tab and generate a fresh address.",
        "Use the option to display that address on the hardware device.",
        "Compare the whole string, not just the first and last few characters &mdash; lookalike addresses are generated to match at both ends.",
        "Use a new address for each incoming payment rather than reusing one."
      ])}

      ${cautions([
        "An address shown only on your computer has not been verified. Checking it on the device is the entire reason you own one."
      ])}

      <h2><span class="sc-article-num">4</span>Decide what your wallet talks to</h2>

      <p>Sparrow has to get blockchain data from somewhere, and that somewhere learns things about you. A public Electrum server is the easy default and works fine &mdash; but it can see which addresses belong to a single wallet, which is a meaningful amount of information about your finances.</p>

      ${checklist([
        "For learning and small amounts, the public server default is workable.",
        "For balances you would mind being catalogued, connect Sparrow to your own Bitcoin Core node.",
        "Enable Tor in Sparrow's server settings if you are staying on a public server."
      ])}

      <p>This is a privacy decision rather than a security one &mdash; a hostile server cannot steal from you &mdash; but it is much easier to make before you start using the wallet than to unpick afterwards.</p>

      <h2><span class="sc-article-num">5</span>Sign a small test transaction</h2>

      <p>The full loop is: Sparrow builds an unsigned transaction, the device signs it, Sparrow broadcasts it. Run it once with an amount you would not mind losing, before you rely on any of this.</p>

      ${checklist([
        "Send a small amount to a destination you control.",
        "Review the recipient address and the fee on the device screen, not just in Sparrow.",
        "Confirm on the device, broadcast, and wait for a confirmation to appear.",
        "If you are working air-gapped, move the unsigned transaction out by microSD or QR, sign it, and bring the signed file back."
      ])}

      <p>Once that has worked end to end, you have a wallet you can actually reason about: the computer proposes, the device disposes, and you have watched both halves happen.</p>

      <p class="mt-4"><a class="sc-text-link" href="complete-path.html">Then test your recovery <i class="bi bi-arrow-right"></i></a></p>`
  },
  {
    slug: "sparrow-coin-control",
    category: "software",
    products: ["sparrow"],
    title: "Sparrow: coin control and labelling",
    summary: "Your balance is not a number, it is a pile of separate chunks — and which ones you spend together tells anyone watching that they belong to the same person.",
    level: "intermediate",
    minutes: 25,
    goals: ["harden", "learn"],
    tags: ["UTXO", "Privacy", "Labels"],
    icon: "bi-pie-chart",
    updated: "2026-08-17",
    status: "published",
    related: ["sparrow-first-wallet", "exchange-withdrawal", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Your wallet shows one number, and that number is a summary. Underneath it your bitcoin exists as separate chunks &mdash; one for each payment you have ever received &mdash; and every chunk carries the history of where it came from.</p>

      <p>That matters because of one simple assumption anyone analysing the blockchain makes: <strong>if a single transaction spends two chunks, the same person owned both.</strong> It is a reasonable assumption and usually correct, which is exactly the problem. Spend an exchange withdrawal alongside a payment from a client, and you have just published a link between your identity-verified account and that client.</p>

      <p>Coin control is choosing which chunks to spend, and it is the difference between a wallet that quietly assembles a map of your finances and one that does not.</p>

      ${figureSlot({
        shot: "Sparrow's UTXO tab on screen showing several coins with clear labels, one of them greyed out as frozen.",
        caption: "The same balance, seen honestly: separate coins with separate histories.",
        ratio: "16 / 9",
        icon: "bi-pie-chart"
      })}

      ${prerequisites([
        "Sparrow already set up with your wallet — see the pairing guide if not.",
        "Ten minutes to label what you already hold, which is the part people put off.",
        "A willingness to pay slightly higher fees sometimes. That is the honest cost, covered at the end."
      ])}

      <h2><span class="sc-article-num">1</span>Look at your coins individually</h2>

      <p>Open your wallet's UTXO view. Instead of one balance you will see a list: each row a separate coin, with its own amount, its own age, and its own address.</p>

      <p>This is what your wallet actually holds. The single balance figure on the main screen is the sum, and it hides everything that matters for the rest of this guide.</p>

      <h2><span class="sc-article-num">2</span>Label everything, starting now</h2>

      <p>A label is a note attached to a coin, an address, or a transaction &mdash; where it came from, what it was for. Sparrow lets you label all three, and the habit is worth more than any single privacy technique.</p>

      <p>The reason is practical rather than philosophical. In two years you will look at a coin from an exchange withdrawal and a coin from a private sale and be unable to tell them apart. Once you cannot tell them apart, you cannot make good decisions about which to spend, and coin control becomes guesswork.</p>

      ${checklist([
        "Label every incoming payment as it arrives: the source, and anything you will want to remember about it.",
        "Label the coins you already hold now, while you still remember where they came from.",
        "Be specific enough to be useful and vague enough that the file is not a dossier — <em>exchange withdrawal March</em> rather than a full account number.",
        "Export your labels regularly. Sparrow supports the BIP329 format, which other wallets can read, so your notes are not trapped in one piece of software."
      ])}

      ${callout("Labels are the part that survives you switching wallets", "Balances are on the blockchain and will always be recoverable from your seed. Labels exist only where you wrote them. Exporting them in a portable format means the context — which is the genuinely irreplaceable part — moves with you.")}

      <h2><span class="sc-article-num">3</span>Choose your inputs when you spend</h2>

      <p>By default a wallet picks coins for you, optimising for fees. That is fine when it does not matter and quietly damaging when it does.</p>

      <p>Sparrow lets you select which coins to spend before building a transaction. The rule to follow is simple: <strong>do not spend coins together unless you are comfortable with them being publicly linked.</strong></p>

      ${checklist([
        "Spending to a merchant? Use a coin whose history you do not mind that merchant's payment processor seeing.",
        "Have coins from an identity-verified exchange and coins from elsewhere? Keep those two groups apart, permanently.",
        "Where possible, spend one coin rather than combining several. A single-input transaction reveals the least.",
        "If you must combine, combine coins that are already publicly linked — merging two exchange withdrawals from the same account gives away nothing new."
      ])}

      <h2><span class="sc-article-num">4</span>Freeze what should never be spent by accident</h2>

      <p>Freezing marks a coin as unavailable, so automatic coin selection can never quietly include it in a transaction. It changes nothing on the blockchain &mdash; it is a note to your own wallet.</p>

      ${checklist([
        "Freeze coins you are deliberately keeping separate, so a hurried payment cannot merge them.",
        "Freeze anything whose origin you do not know or trust.",
        "Freeze dust — see below.",
        "Review your frozen coins occasionally, so you do not forget why something was set aside."
      ])}

      <h2><span class="sc-article-num">5</span>Understand what change gives away</h2>

      <p>Spend part of a coin and the remainder comes back to you as a new coin, called change. This is where a lot of accidental linking happens, because change inherits the connection to everything that funded it.</p>

      <p>Say you hold one large coin and pay a small amount from it. The transaction now shows a small payment and a large remainder, and it is generally obvious which is which. That remainder is still yours, still traceable to the original coin, and now also linked to that payment.</p>

      ${checklist([
        "Label your change outputs like anything else — they are new coins with new histories.",
        "Expect the amounts themselves to leak information. A round number is usually the payment; the awkward remainder is usually change.",
        "Where it matters, prefer spending a coin whose value is close to the amount you are sending, so the change is small or nonexistent."
      ])}

      <h2><span class="sc-article-num">6</span>Dust, and coins you did not ask for</h2>

      <p>Occasionally tiny amounts arrive at your addresses unrequested. Sometimes this is a mistake or a test. Sometimes it is deliberate: the sender is hoping you will eventually spend that dust alongside your real coins, which would link the address they sent to with the rest of your wallet.</p>

      <p>The defence costs nothing. Freeze it and leave it alone.</p>

      ${cautions([
        "Do not try to consolidate dust to tidy up your wallet. Consolidating is precisely the action the sender is waiting for.",
        "Do not follow instructions that arrive attached to unexpected coins. Messages embedded in transactions leading to a website are a scam without exception."
      ])}

      <h2><span class="sc-article-num">7</span>Consolidate deliberately, if at all</h2>

      <p>Combining many small coins into one is sometimes worth doing &mdash; a wallet full of tiny coins becomes expensive to spend from, because every coin you include makes the transaction larger and therefore costlier.</p>

      <p>But consolidation is the single most linking action you can take: it announces that every coin involved has the same owner. If you do it, do it knowingly.</p>

      ${checklist([
        "Consolidate only within groups that are already linked, never across them.",
        "Do it when fees are low — you are paying for size, and the mempool decides the rate.",
        "Never consolidate dust, and never consolidate coins you are deliberately keeping apart."
      ])}

      <h2>What this costs</h2>

      <p>Coin control is not free, and pretending otherwise would be dishonest.</p>

      ${checklist([
        "<strong>Higher fees, sometimes.</strong> Choosing a specific coin rather than the cheapest combination can mean a larger transaction. Privacy has a price measured in sats.",
        "<strong>More coins over time.</strong> Keeping groups separate means not merging them, so you accumulate more, smaller coins.",
        "<strong>Ongoing attention.</strong> Labels only work if you keep writing them. A wallet labelled thoroughly for six months and then neglected is a wallet you can no longer reason about."
      ])}

      <h2>What coin control does not do</h2>

      ${checklist([
        "<strong>It does not undo existing links.</strong> Anything already spent together is already public and permanent. This changes your future, not your past.",
        "<strong>It does not hide you from your wallet's server.</strong> A public Electrum server sees which addresses you query together regardless of how carefully you spend — pointing Sparrow at your own node is a separate and complementary step.",
        "<strong>It does not make you anonymous.</strong> It stops you volunteering information. Someone who already knows one of your addresses still knows it."
      ])}

      <p>None of that is a reason to skip it. Labelling and selecting inputs are cheap habits that prevent the specific, avoidable mistake of publishing links you never meant to publish &mdash; and unlike most privacy measures, they cost nothing but attention.</p>

      ${callout("Where this fits", `<a href='exchange-withdrawal.html'>Withdrawing from an exchange</a> is usually where a wallet's first identity-linked coins arrive. Label them the moment they land, keep them separate from everything else, and the hardest part of this guide is already done.`)}

      <p class="sc-source-note">
        Menu names and views change between Sparrow releases. Confirm the current interface against
        ${official("https://sparrowwallet.com/docs/", "Sparrow's own documentation")}
        if what you are seeing does not match.
      </p>`
  },
  {
    slug: "nunchuk-setup",
    category: "software",
    products: ["nunchuk"],
    title: "Nunchuk: first wallet and shared access",
    summary: "A phone app that coordinates multisig, including wallets shared with another person. What to build first, what to back up beyond the keys, and which features quietly add a dependency.",
    level: "beginner",
    minutes: 30,
    goals: ["setup"],
    tags: ["Mobile", "Multisig", "Shared access"],
    icon: "bi-phone",
    updated: "2026-08-17",
    productGuide: true,
    status: "published",
    related: ["multisig-2of3", "recovery-test-drill", "sparrow-first-wallet"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Most mobile wallets are a wallet. Nunchuk is closer to a coordinator that happens to live on your phone: it can run an ordinary single-signature wallet, but its reason to exist is multisig &mdash; including wallets shared between two or more people, each holding their own key.</p>

      <p>That makes it one of the few practical routes to a household wallet where a partner genuinely co-signs rather than being told the password. It also means the setup involves choices that other wallet apps do not ask you to make, and one backup obligation that is easy to miss.</p>

      ${figureSlot({
        shot: "A phone showing a multisig wallet with two of three keys marked as signed, held above a desk where a hardware wallet and an NFC card are sitting.",
        caption: "The phone coordinates. The keys stay on the hardware.",
        ratio: "16 / 9",
        icon: "bi-phone"
      })}

      ${prerequisites([
        "The Nunchuk app, installed from the official app store listing linked at nunchuk.io rather than found by search.",
        "At least one hardware signing device if you are building anything beyond a small spending wallet.",
        "Backup material for every key you are about to create, plus somewhere to record the wallet configuration.",
        "For a shared wallet, the other person present, with their own device.",
        "No bitcoin. Move none until the checks at the end pass."
      ])}

      <h2><span class="sc-article-num">1</span>Decide what you are actually building</h2>

      <p>Nunchuk will happily build any of these, and they are not interchangeable. Pick before you start.</p>

      <div class="sc-nunchuk-shapes" aria-label="Four wallet shapes available in Nunchuk">
        <article><span class="sc-shape-key"><i class="bi bi-phone" aria-hidden="true"></i>Phone key</span><h3>Software wallet</h3><p>Small spending amounts. The key lives on the internet-connected phone itself.</p></article>
        <article><span class="sc-shape-key"><i class="bi bi-usb-drive" aria-hidden="true"></i>One device</span><h3>Single-sig with hardware</h3><p>Savings without multisig. The phone is only the interface; the signer holds the key.</p></article>
        <article><span class="sc-shape-key"><i class="bi bi-diagram-3" aria-hidden="true"></i>Your devices</span><h3>Personal multisig</h3><p>Larger savings. No single key or device can lose the bitcoin.</p></article>
        <article><span class="sc-shape-key"><i class="bi bi-people" aria-hidden="true"></i>Split ownership</span><h3>Shared multisig</h3><p>Households, partners, businesses, and deliberate inheritance arrangements.</p></article>
      </div>

      <p>If this is your first wallet of any kind, build the first or second row, use it, and prove you can recover it before attempting either multisig option. <a href='multisig-2of3.html'>Multisig</a> multiplies every backup mistake by the number of keys.</p>

      <h2><span class="sc-article-num">2</span>Add your hardware keys</h2>

      <p>Nunchuk supports an unusually broad range of signers &mdash; COLDCARD, TAPSIGNER, Jade, SeedSigner, Trezor, Ledger, BitBox, Passport, and Keystone among them &mdash; and several ways to talk to them.</p>

      ${checklist([
        "<strong>NFC</strong> for card-format signers such as TAPSIGNER: tap the card to the phone to sign.",
        "<strong>QR</strong> for air-gapped devices: the phone displays a code, the device reads it, and the signature comes back the same way. Nothing is ever connected.",
        "<strong>USB</strong> where the device and phone support it.",
        "Set up each device independently, generating its own seed on that device. Never create several keys from one seed &mdash; that is one key wearing several hats, and it defeats the entire point of multisig."
      ])}

      <p>Prefer the QR path where your device offers it. An air gap that exists by default is worth more than one you have to remember to use.</p>

      <h2><span class="sc-article-num">3</span>Back up the configuration, not just the keys</h2>

      <p>This is the obligation people miss, and it is the one that turns a working multisig into an unrecoverable one.</p>

      <p>Your seed phrases alone cannot rebuild a multisig wallet. Software also needs the policy, the script type, the derivation paths, and the public keys of <em>every</em> key in the wallet &mdash; the bundle called the wallet configuration or descriptor. Nunchuk can export it. Do that during setup, while you are already thinking about backups, rather than intending to later.</p>

      ${checklist([
        "Export the wallet configuration from Nunchuk and store a copy alongside every seed backup.",
        "Write a plain-language note with it: how many keys exist, how many are needed, and which is which.",
        "For a shared wallet, make sure every participant holds the configuration, not just the person who set it up.",
        "Record the master fingerprints so a future restore can be checked against something."
      ])}

      ${callout("It is not a secret that can spend your coins", "The configuration contains public keys only. Someone who finds it learns your balance and history, which is a privacy problem, but they cannot move anything. Losing it is far worse than leaking it — so store it widely rather than cleverly.")}

      <h2><span class="sc-article-num">4</span>How a shared wallet actually works</h2>

      <p>In a shared wallet each person holds their own key and can see the wallet, but a spend needs the threshold to be met. A 2-of-2 between partners means neither can move funds alone. A 2-of-3 with a third key held elsewhere means either person can spend with that third key's help, and either can be replaced.</p>

      ${checklist([
        "<strong>Agree the threshold deliberately.</strong> 2-of-2 is genuine joint control and also means one lost key locks you both out. 2-of-3 is more forgiving and slightly less strict.",
        "<strong>Every participant needs their own backup</strong> of their own key, stored where the other person cannot reach it, or you have re-created a single point of failure.",
        "<strong>Every participant needs the wallet configuration.</strong> If only one person has it, that person is a dependency.",
        "<strong>Decide in advance what happens if someone becomes unavailable</strong> — through illness, a falling-out, or death. That is the scenario a shared wallet exists for, and it should not be improvised."
      ])}

      <p>Rehearse a spend with each valid combination of keys before the wallet holds anything meaningful. An untested pair is a pair you are assuming works.</p>

      <h2><span class="sc-article-num">5</span>Assisted services: know which side of the line you are on</h2>

      <p>Nunchuk offers optional paid services alongside the self-serve app &mdash; assisted recovery, inheritance arrangements, and wallets where the platform holds a key or provides support. These are legitimate products and solve real problems, particularly for people who want multisig without becoming its sole operator.</p>

      <p>They also change what you depend on, so establish which features you are using and answer one question before committing anything serious:</p>

      ${pullQuote("If this company disappeared overnight, could I still spend my bitcoin — and do I already hold everything I would need to do it?")}

      ${checklist([
        "Confirm you can export the full wallet configuration yourself, and that you have it stored.",
        "Confirm your own keys meet the spending threshold without any platform key.",
        "Confirm you can recover using other software &mdash; Sparrow and Specter both open standard multisig wallets &mdash; rather than only the Nunchuk app.",
        "Understand what lapses if a subscription lapses. A stopped payment should never be able to strand your funds.",
        "Rehearse a recovery in other software once, so the answer is something you have seen rather than something you were told."
      ])}

      <h2><span class="sc-article-num">6</span>Verify and test before funding</h2>

      ${checklist([
        "Generate a receive address and verify it on a hardware device screen, not only in the app.",
        "Send a small test amount and confirm it arrives.",
        "Spend from it using each valid combination of keys.",
        "Rebuild the wallet in different software from your configuration file and the required seeds. That proves your backup package is complete.",
        "Only then move an amount you would miss."
      ])}

      ${callout("The rebuild is the real test", `Everything else confirms the wallet works today, on this phone, with this app installed. Rebuilding it elsewhere confirms it will work in five years on hardware you have not bought yet — which is the situation your backups actually exist for. <a href='recovery-test-drill.html'>Test your recovery</a> covers the drill in full.`)}

      <p class="sc-source-note">
        Feature tiers, service names, and which capabilities are free change over time. Confirm what is self-serve and what depends on a subscription or a platform key against
        ${official("https://nunchuk.io/", "Nunchuk's own documentation")}
        before relying on any of it.
      </p>`
  },
  {
    slug: "cove-setup",
    category: "software",
    products: ["cove"],
    title: "Cove: mobile wallet setup",
    summary: "Creating or importing a wallet, and using hardware signers over QR and NFC from a phone.",
    level: "beginner",
    minutes: 20,
    goals: ["setup"],
    tags: ["Mobile", "Bitcoin-only"],
    icon: "bi-phone",
    status: "idea"
  },
  {
    slug: "electrum-setup",
    category: "software",
    products: ["electrum"],
    title: "Electrum: watch-only and offline signing",
    summary: "Turn two ordinary computers into cold storage — one that watches the blockchain and one that holds the keys and never goes online. Plus why this is the most impersonated wallet in bitcoin.",
    level: "intermediate",
    minutes: 45,
    goals: ["setup", "harden"],
    tags: ["Desktop", "Cold storage", "Air-gapped"],
    icon: "bi-window",
    updated: "2026-08-17",
    productGuide: true,
    status: "published",
    related: ["recovery-test-drill", "sparrow-first-wallet", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Electrum can split one wallet across two machines. The online one watches the blockchain, shows your balance, and builds transactions but holds no keys and can spend nothing. The offline one holds the keys, never touches a network, and does nothing but sign.</p>

      <p>That arrangement is cold storage built out of computers you already own, and it predates most hardware wallets. It is more work than buying a signing device, and it is genuinely useful when you want a spare recovery path, a second setup that depends on entirely different hardware, or simply to understand what a hardware wallet is doing on your behalf.</p>

      <p>Before any of that, though, one warning that matters more than the setup.</p>

      ${callout("Electrum is the most impersonated wallet in bitcoin", "Fake download sites rank in search results, and malicious Electrum servers have historically pushed convincing fake update messages to users inside the app itself. Never take an update prompt that appears in the wallet. Never download from a search result. Type electrum.org yourself, and verify the signature on what you download — step one below is not optional advice.")}

      ${figureSlot({
        shot: "Two laptops on a desk, the older one with its wifi card visibly removed or a sticker over the port, a USB stick between them.",
        caption: "The offline machine's job is to be useless for anything except signing.",
        ratio: "16 / 9",
        icon: "bi-window"
      })}

      ${prerequisites([
        "Two computers. The offline one can be old and slow — it needs no network and does nothing else.",
        "A way to move files between them: a USB stick, or a QR workflow if you prefer.",
        "Electrum downloaded from electrum.org, typed by hand, with the signature verified.",
        "A pen and backup material for the seed the offline machine will generate.",
        "No bitcoin. Move none until the test at the end passes."
      ])}

      <h2><span class="sc-article-num">1</span>Verify the download before you run anything</h2>

      <p>Electrum publishes a GPG signature alongside each release. Checking it confirms the file came from the project rather than from whoever bought the search advert above the real site.</p>

      ${checklist([
        "Type electrum.org into the address bar yourself. Do not arrive from a search result, an email, or a forum link.",
        "Download the release and its matching signature file.",
        "Verify the signature against the developer key published on the site.",
        "Do this on both machines, and re-verify on every update."
      ])}

      ${cautions([
        "An update prompt that appears inside the wallet is not how Electrum ships updates. Malicious servers have used exactly that to distribute malware. Close it and go to the website yourself.",
        "A wallet that asks you to enter your seed to 'validate', 'migrate', or 'unlock' anything is stealing from you."
      ])}

      <h2><span class="sc-article-num">2</span>How the split actually works</h2>

      <p>The trick is that watching a wallet and spending from it need different information. Watching needs only the master public key, from which every address can be derived. Spending needs the private keys, which never have to leave the offline machine.</p>

      <div class="sc-machine-split" aria-label="Online and offline Electrum machine roles">
        <article class="sc-machine-panel is-online"><div class="sc-machine-head"><span class="sc-machine-signal" aria-hidden="true"></span><h3>Online machine</h3></div><p class="sc-machine-holds"><span>Holds</span>Master public key only</p><ul><li class="is-can">Shows balance and history</li><li class="is-can">Builds and broadcasts transactions</li><li class="is-cannot">Cannot spend anything</li></ul></article>
        <div class="sc-machine-transfer" aria-hidden="true"><span>Unsigned</span><i>&rarr;</i><span>Signed</span><i>&larr;</i></div>
        <article class="sc-machine-panel is-offline"><div class="sc-machine-head"><span class="sc-machine-lock" aria-hidden="true"></span><h3>Offline machine</h3></div><p class="sc-machine-holds"><span>Holds</span>The seed and private keys</p><ul><li class="is-can">Signs transactions handed to it</li><li class="is-cannot">Cannot reach the internet</li><li class="is-cannot">Does not know your balance</li></ul></article>
      </div>

      <p>Compromising the online machine gets an attacker your transaction history and your privacy. It does not get them your bitcoin, because nothing there can produce a signature.</p>

      <h2><span class="sc-article-num">3</span>Prepare the offline machine</h2>

      <p>The offline machine should be genuinely offline, not merely disconnected for the afternoon. Its value comes entirely from never having been exposed.</p>

      ${checklist([
        "Physically remove or disable the wifi card if you can, and never plug in an ethernet cable.",
        "Ideally use a machine that has been wiped and freshly installed, not one with years of history on it.",
        "Install Electrum from a file you verified on the online machine and carried across on a USB stick.",
        "Do not use this machine for anything else. No browsing, no email, no other software."
      ])}

      <h2><span class="sc-article-num">4</span>Create the wallet offline, and export the public key</h2>

      <p>Create a new standard wallet on the offline machine. It generates the seed there, where nothing can watch it.</p>

      ${checklist([
        "Write the seed down by hand, in order, and note that it is an Electrum seed — the format differs from BIP39 and matters when restoring elsewhere.",
        "Set a wallet password. It encrypts the keys on disk, so a stolen machine is not immediately a stolen wallet.",
        "Export the master public key and copy it to a USB stick.",
        "Carry only that public key to the online machine. Nothing else crosses, ever."
      ])}

      ${callout("Electrum seeds are not BIP39", "Electrum uses its own seed format by default. It restores perfectly into Electrum, and does not restore into most other wallets the way a BIP39 phrase would. Write down that it is an Electrum seed alongside the words, or choose a BIP39 option if portability matters more to you than defaults.")}

      <h2><span class="sc-article-num">5</span>Create the watch-only wallet online</h2>

      <p>On the online machine, create a new wallet and choose to import a master public key rather than create a seed. Paste in the key you exported.</p>

      <p>Electrum will scan and show your balance and history. It has no ability to spend, and it will tell you so &mdash; the wallet is marked watch-only.</p>

      ${checklist([
        "Confirm the wallet reports itself as watch-only before you use it.",
        "Generate a receive address here, then confirm the same address appears on the offline machine. Matching addresses prove both halves belong to the same wallet.",
        "Never paste your seed into this machine, for any reason, at any point."
      ])}

      <h2><span class="sc-article-num">6</span>The signing loop</h2>

      <p>Every spend follows the same circuit. It feels laborious the first time and becomes routine quickly.</p>

      ${checklist([
        "<strong>Online:</strong> build the transaction as normal, then save it to a file instead of sending. Electrum writes an unsigned transaction, or PSBT.",
        "<strong>Carry:</strong> move the file to the offline machine on a USB stick.",
        "<strong>Offline:</strong> open the file in Electrum, review the recipient and amount carefully — this is your last chance — sign it, and save the signed version.",
        "<strong>Carry back:</strong> move the signed file to the online machine.",
        "<strong>Online:</strong> load the signed transaction and broadcast it."
      ])}

      ${cautions([
        "The USB stick is the weak point of this air gap. It is a data path, and malware can travel along it in either direction. Use a stick dedicated to this purpose and nothing else, and prefer a QR-based workflow if you would rather have no shared media at all.",
        "Review the transaction on the offline machine, not just the online one. The online machine is the one that might be lying to you."
      ])}

      <h2><span class="sc-article-num">7</span>Choose what your wallet talks to</h2>

      <p>Electrum verifies transactions with SPV, but it still asks servers for your history &mdash; and the server it asks can see which addresses belong to one wallet.</p>

      ${checklist([
        "For small amounts, the default public servers are workable.",
        "For meaningful balances, connect to your own Electrum server or Bitcoin Core node.",
        "Route through Tor if you are staying on public servers.",
        "Remember that server choice affects the transaction information you are shown, not just your privacy."
      ])}

      <h2><span class="sc-article-num">8</span>Test it before it holds anything</h2>

      ${checklist([
        "Send a small amount to an address from the watch-only wallet and confirm it appears.",
        "Run the full signing loop to send it back out. That exercises every step of the arrangement at once.",
        "Restore the seed into a fresh Electrum installation and confirm the same addresses appear.",
        "Only then move an amount you would miss."
      ])}

      <h2>What this protects against, and what it does not</h2>

      ${checklist([
        "<strong>It protects your keys from an internet-connected machine.</strong> That is a large category of real attacks, and it is the same thing a hardware wallet does.",
        "<strong>It does not verify addresses on a trusted display.</strong> A hardware wallet has a screen the computer cannot rewrite; here, the offline machine's screen is doing that job, and it is only as trustworthy as the machine.",
        "<strong>It does not survive a compromised offline machine.</strong> Everything rests on that machine never having been exposed, which is a discipline rather than a hardware guarantee.",
        "<strong>It does not remove the USB risk</strong>, which is why the transfer medium deserves the care it gets above."
      ])}

      <p>For most people a hardware wallet is simpler and stronger. This arrangement earns its place as a second, independent setup &mdash; one that shares no manufacturer, no firmware, and no supply chain with your primary device.</p>

      ${callout("Before you fund it properly", `Run the drill in <a href='recovery-test-drill.html'>test your recovery</a>, and pay particular attention to the seed format. An Electrum seed restored into software expecting BIP39 will produce a different, empty wallet — which looks exactly like a failed backup.`)}

      <p class="sc-source-note">
        Menu wording and file formats change between Electrum releases. Confirm the current flow against
        ${official("https://electrum.readthedocs.io/", "Electrum's own documentation")}
        &mdash; reached from electrum.org typed by hand, never from a search result.
      </p>`
  },
  {
    slug: "bluewallet-watch-only",
    category: "software",
    products: ["bluewallet"],
    title: "BlueWallet: watch your cold storage from a phone",
    summary: "Importing a public key to monitor a hardware wallet without exposing any signing capability.",
    level: "beginner",
    minutes: 15,
    goals: ["setup"],
    tags: ["Mobile", "Watch-only"],
    icon: "bi-phone",
    status: "idea"
  },
  {
    slug: "wasabi-coinjoin-basics",
    category: "software",
    products: ["wasabi"],
    title: "Wasabi: what CoinJoin does and costs",
    summary: "The privacy model, the fee and timing trade-offs, and what it does not protect against.",
    level: "advanced",
    minutes: 30,
    goals: ["harden", "learn"],
    tags: ["Privacy", "CoinJoin"],
    icon: "bi-shuffle",
    status: "idea"
  },
  {
    slug: "specter-multisig-coordinator",
    category: "software",
    products: ["specter"],
    title: "Specter: coordinating a multi-brand multisig",
    summary: "Running Specter against your own node and combining signers from different manufacturers.",
    level: "advanced",
    minutes: 45,
    goals: ["setup", "harden"],
    tags: ["Multisig", "Node"],
    icon: "bi-diagram-3",
    status: "idea"
  },
  {
    slug: "own-node-connection",
    category: "software",
    products: [],
    title: "Point your wallet at your own node",
    summary: "Why a public server sees more than you think, and how to move a wallet onto infrastructure you run.",
    level: "advanced",
    minutes: 40,
    goals: ["harden"],
    tags: ["Node", "Privacy"],
    icon: "bi-cpu",
    status: "idea"
  },

  /* ---------------------------------------------------------------- exchanges */
  {
    slug: "exchange-withdrawal",
    category: "exchanges",
    products: ["shakepay", "bitbuy", "bullbitcoin", "bitcoinwell", "kraken", "ndax"],
    title: "Withdrawing bitcoin from a Canadian exchange",
    summary: "One process that works on every Canadian platform, what changes on the two that send bitcoin straight to your wallet, and the records the CRA expects you to keep.",
    level: "beginner",
    minutes: 25,
    goals: ["withdraw"],
    tags: ["Canada", "Withdrawal", "Test send"],
    icon: "bi-bank",
    updated: "2026-08-17",
    productGuide: true,
    status: "published",
    related: ["complete-path", "sparrow-first-wallet", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Until you withdraw, you do not own bitcoin. You own an entry in a company's database saying they owe you some. The two behave identically right up until the moment they do not &mdash; and by then the withdrawal is no longer available.</p>

      <p>The mechanics barely differ between platforms, so this one guide covers all of them. What does differ is worth knowing up front: two of the six Canadian routes on this site never hold your bitcoin in the first place, which turns "withdrawing" into a different task with a different way of going wrong.</p>

      ${figureSlot({
        shot: "A phone showing an exchange withdrawal screen held beside a hardware wallet displaying a receiving address, both clearly in frame and showing the same string.",
        caption: "The address comes from your wallet. Never from a message, an email, or a support agent.",
        ratio: "16 / 9",
        icon: "bi-phone"
      })}

      ${prerequisites([
        "A wallet you already control, already backed up, and already restored once in a test.",
        "A verified account with withdrawals enabled &mdash; most platforms gate this behind identity checks that take time.",
        "An amount small enough to be a genuine test. Treat it as the price of the lesson.",
        "Somewhere to record the date, amount, and CAD value of every transaction."
      ])}

      ${callout("Platform screens change", "Withdrawal flows, limits, and fees get changed without notice, and this page deliberately does not quote current numbers. What follows is the shape of the task and the reasoning behind each step &mdash; check the wording and the fees inside the app before you approve anything.")}

      <h2>Which kind of platform are you on?</h2>

      <p>This determines what you are actually doing, so establish it before anything else.</p>

      <div class="sc-platform-flows" aria-label="Custodial and direct-to-wallet purchase models">
        <article class="sc-platform-flow is-custodial"><div class="sc-flow-title"><span aria-hidden="true"><i class="bi bi-building-lock"></i></span><div><small>Model one</small><h3>Custodial</h3></div></div><p class="sc-flow-routes">Shakepay · Bitbuy · Kraken · Ndax</p><div class="sc-flow-track" aria-hidden="true"><span>You buy</span><i>&rarr;</i><span>Platform balance</span><i>&rarr;</i><span>Your wallet</span></div><p><strong>Your job:</strong> perform a withdrawal carefully. The risk sits in that transaction.</p></article>
        <article class="sc-platform-flow is-direct"><div class="sc-flow-title"><span aria-hidden="true"><i class="bi bi-arrow-right-circle"></i></span><div><small>Model two</small><h3>Direct-to-wallet</h3></div></div><p class="sc-flow-routes">Bull Bitcoin · Bitcoin Well</p><div class="sc-flow-track" aria-hidden="true"><span>You buy</span><i>&rarr;</i><span>Your wallet</span></div><p><strong>Your job:</strong> verify the saved address. The risk sits in the destination you configured.</p></article>
      </div>

      <p>Most of this guide describes the custodial case, because that is where the withdrawal happens. If you are on a direct-to-wallet service, read the common steps anyway &mdash; the address verification is identical &mdash; then read the section near the end that covers what is different for you.</p>

      <h2>Get the address from your own wallet</h2>

      <p>The address must come from the wallet you control, generated fresh, and verified on your hardware device if you have one. This is the one step where a mistake cannot be undone, so it gets the most care.</p>

      ${checklist([
        "Open your wallet and generate a new receive address.",
        "If you use a hardware signer, display the address on the device and compare the full string against what your computer shows.",
        "Transfer it by QR code where possible &mdash; it removes the clipboard from the process entirely.",
        "Never accept an address sent to you in a message, an email, or by a support agent."
      ])}

      ${cautions([
        "Clipboard-swapping malware targets exactly this moment. After pasting, compare the whole address rather than the first and last few characters &mdash; lookalike addresses are generated to match at both ends.",
        "Bitcoin transactions do not reverse. An address entered wrong is money gone, and no support desk can retrieve it."
      ])}

      <h2>Turn on the account protections first</h2>

      <p>A withdrawal is only as safe as the account authorising it. These take a few minutes and are worth doing before your first transfer rather than after your first scare.</p>

      ${checklist([
        "<strong>App-based two-factor authentication</strong> rather than SMS. A SIM swap defeats text-message codes, and Canadian carriers are not a security boundary.",
        "<strong>Address whitelisting</strong>, where the platform offers it. Withdrawals then only go to addresses you pre-approved, usually with a delay before a new one becomes usable.",
        "<strong>A unique password</strong> and a locked-down email account &mdash; email is the reset path for everything else.",
        "<strong>Any account-level withdrawal lock</strong> the platform provides. Kraken and several others offer settings that freeze changes for a cooling-off period."
      ])}

      <p>Each of these is covered properly in <a href='exchange-account-security.html'>locking down the exchange account</a>. The whitelist delay in particular is a feature, not an obstacle. It means an attacker who reaches your account cannot immediately drain it to a fresh address, and it gives you a window to notice.</p>

      <h2>Start with a test amount</h2>

      <p>Find the send or withdraw option for bitcoin. Before approving anything, separate the platform's withdrawal fee from the Bitcoin network fee &mdash; they are different charges going to different places, and only one moves with network conditions.</p>

      ${checklist([
        "Enter a small test amount, not the full balance.",
        "Paste or scan the address you just generated and verified.",
        "Read the total: amount out, platform fee, network fee.",
        "Check the withdrawal minimum &mdash; a test below it will be rejected rather than sent.",
        "Make sure you are sending on the Bitcoin network, not a wrapped or alternative-chain version of bitcoin."
      ])}

      <p>If the network is busy the fee can be a noticeable fraction of a small test. That is normal, and it is not a reason to skip the test &mdash; it is the cost of finding out that every part of the path works.</p>

      <p><a class="sc-text-link" href="../dashboard.html">Check current network fees <i class="bi bi-arrow-right"></i></a></p>

      <h2>Wait for it properly</h2>

      <p>A withdrawal usually shows as pending on the platform before it is broadcast at all. It is not yours until it has confirmed on-chain <em>and</em> your own wallet is showing it.</p>

      ${checklist([
        "Approve the withdrawal and note the transaction id if the platform provides one.",
        "Watch for it to appear in your own wallet as unconfirmed, then confirmed.",
        "Do not start the larger withdrawal while the test is still pending."
      ])}

      <p>Waiting is the point of the exercise. The pending state is exactly when you would want to discover a problem, and the last moment at which discovering one costs you almost nothing.</p>

      <h2>Send the rest, and write it down</h2>

      <p>Once the test has arrived, repeat with the real amount. Then record it &mdash; in Canada the paperwork is your responsibility rather than the platform's, and platforms close, get acquired, and lose old history.</p>

      ${checklist([
        "Record the date, the amount of bitcoin, and the CAD value at the time.",
        "Export or save the platform's full transaction history while your account is still open.",
        "Keep those records with your other tax documents, and separate from your recovery words.",
        "Consider leaving the account open but empty rather than closing it, so the history stays reachable."
      ])}

      ${callout("This is education, not tax advice", "Moving bitcoin between wallets you own is generally not a disposition, but selling, spending, or trading it can be. Confirm your own situation with a Canadian accountant rather than with a website.")}

      <h2>If you are on a direct-to-wallet service</h2>

      <p>Bull Bitcoin and Bitcoin Well settle purchases to an address you provide, so in the normal flow there is no platform balance to withdraw later. That removes the biggest risk on this page &mdash; your coins are never sitting with a company waiting for you to act &mdash; and replaces it with a smaller, quieter one.</p>

      <p>The address is configured once and then used repeatedly, often for recurring buys running in the background. A mistake there does not cost you one transaction; it costs you every purchase until you notice.</p>

      ${checklist([
        "Verify the payout address on your hardware device when you first set it, exactly as you would for a withdrawal.",
        "Make a small purchase first and confirm it arrives before setting up anything recurring.",
        "If you supply an extended public key so the service can generate fresh addresses, confirm the first few belong to your wallet.",
        "Re-check the configured address after changing wallets, restoring from backup, or altering the account &mdash; a stale address keeps working from the platform's point of view.",
        "Set a reminder to confirm receipt periodically if buys run automatically."
      ])}

      ${cautions([
        "A recurring buy pointed at an address you no longer control will keep succeeding, keep charging you, and keep sending bitcoin somewhere you cannot spend from. Nothing will flag it."
      ])}

      <h2>What you have actually changed</h2>

      <p>Before the withdrawal, your bitcoin depended on a company staying solvent, staying honest, not being compromised, not freezing your account by automated mistake, and continuing to operate in your province. After it, it depends on you keeping a backup safe.</p>

      <p>That is a real trade rather than a pure upgrade, and it is worth being clear-eyed about: you have swapped someone else's failure modes for your own. The reason it is still the right trade is that yours are the ones you can inspect, test, and fix.</p>

      ${callout("Before the amount gets serious", `<a href="recovery-test-drill.html">Test your recovery</a> before you move anything you would miss. A wallet you have never restored is the one part of this process that has not actually been checked.`)}`
  },
  {
    slug: "exchange-account-security",
    category: "exchanges",
    products: [],
    title: "Lock down the exchange account itself",
    summary: "Most people who lose bitcoin from a platform were not victims of an exchange hack. Their own account was opened by someone else — usually through email or a phone number.",
    level: "beginner",
    minutes: 20,
    goals: ["harden"],
    tags: ["2FA", "Account security", "SIM swap"],
    icon: "bi-shield-lock",
    updated: "2026-08-17",
    status: "published",
    related: ["exchange-withdrawal", "what-not-to-normalize", "owning-your-bitcoin"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">When someone loses bitcoin from an exchange, the story is rarely that the exchange was breached. Far more often the account was simply opened by somebody else, using a password reset, a recycled password, or a phone number that stopped being theirs on a Tuesday afternoon.</p>

      <p>That is good news, because it means the defences are things you control. It takes about twenty minutes to close the common routes, and none of it requires you to understand cryptography.</p>

      <p>One thing to say plainly first: the strongest version of this advice is <strong>do not leave bitcoin on a platform you are not actively trading on</strong>. Everything below reduces risk. Withdrawing removes it. Treat this page as protection for the account and the balance that has to live there, not as an alternative to <a href='exchange-withdrawal.html'>getting your bitcoin out</a>.</p>

      ${figureSlot({
        shot: "A phone showing an authenticator app's rotating code beside a hardware security key on a desk, with an exchange login open on a laptop behind.",
        caption: "The two upgrades that close most of the gap.",
        ratio: "16 / 9",
        icon: "bi-shield-lock"
      })}

      <h2><span class="sc-article-num">1</span>Lock your email before you touch anything else</h2>

      <p>Your email account is the master key to every other account you own. It receives password resets, confirmation links, and withdrawal approvals. An attacker who controls it does not need your exchange password, because they can simply ask for a new one.</p>

      <p>Securing the exchange while leaving the email weak is fitting a deadbolt to a door with an open window beside it.</p>

      ${checklist([
        "Use a unique password on your email that appears nowhere else.",
        "Turn on the strongest two-factor method your provider supports &mdash; a security key if available, an authenticator app otherwise.",
        "Review the account's recovery options and remove anything stale: an old phone number, a defunct backup address, a recovery question with a publicly known answer.",
        "Check for forwarding rules and connected apps you do not recognise. A quiet forwarding rule is a common way access is retained after a breach.",
        "Consider an email address used only for financial accounts, never published, never used to sign up for anything else."
      ])}

      <h2><span class="sc-article-num">2</span>Turn off SMS two-factor</h2>

      <p>Text-message codes feel like security and are the weakest common option, because your phone number is not really yours &mdash; it is a record at a carrier that a sufficiently persuasive person can have changed.</p>

      <p>A SIM swap works by social engineering: someone contacts your carrier, poses as you with details gathered from data breaches and social media, and has your number moved to their SIM. Your phone quietly loses service, and every SMS code now arrives on their device. People have watched it happen while holding a phone that simply stopped working.</p>

      ${checklist([
        "Remove SMS as a two-factor method wherever an alternative exists.",
        "Remove your phone number as an account recovery option too &mdash; leaving it there keeps the back door open even after you switch methods.",
        "Ask your mobile carrier to add port-out protection or an account PIN. Canadian carriers offer this, and it is usually a short call.",
        "Do not publicise the number you use for financial accounts."
      ])}

      <h2><span class="sc-article-num">3</span>Use the strongest method the platform offers</h2>

      <div class="sc-auth-ladder" aria-label="Two-factor methods, weakest to strongest">
        <article class="is-weak">
          <div class="sc-auth-rank"><span>01</span><i class="bi bi-phone" aria-hidden="true"></i></div>
          <div class="sc-auth-method"><span>Weakest</span><h3>SMS code</h3></div>
          <div class="sc-auth-detail"><span>Defeated by</span><p>A SIM swap, which needs no technical skill.</p></div>
          <strong>Avoid where anything else exists</strong>
        </article>
        <article class="is-good">
          <div class="sc-auth-rank"><span>02</span><i class="bi bi-shield-lock" aria-hidden="true"></i></div>
          <div class="sc-auth-method"><span>Good</span><h3>Authenticator app</h3></div>
          <div class="sc-auth-detail"><span>Defeated by</span><p>A convincing fake login page that relays your code in real time.</p></div>
          <strong>The sensible default</strong>
        </article>
        <article class="is-best">
          <div class="sc-auth-rank"><span>03</span><i class="bi bi-usb-drive" aria-hidden="true"></i></div>
          <div class="sc-auth-method"><span>Strongest</span><h3>Hardware security key</h3></div>
          <div class="sc-auth-detail"><span>Defeated by</span><p>Very little—it verifies the real site, so a fake page gets nothing.</p></div>
          <strong>Best when supported</strong>
        </article>
      </div>

      <p>The distinction in that last row is the important one. An authenticator code can be phished: a fake site asks for it and forwards it to the real one within its short validity window. A security key cannot be tricked this way, because it verifies which website is actually asking before it responds. If a platform supports security keys, that is the single biggest upgrade available.</p>

      <h2><span class="sc-article-num">4</span>Store your backup codes somewhere real</h2>

      <p>When you enable app-based two-factor, you are shown recovery codes. These exist so a lost phone does not lock you out permanently &mdash; and they bypass your two-factor entirely, so they are as sensitive as the password itself.</p>

      ${checklist([
        "Write them down physically and store them somewhere secure. Losing them is a genuine and common way to lose account access.",
        "Do not screenshot them into your photo library, where they will sync to the cloud.",
        "Do not store them in the same place as the password for that account &mdash; one compromise should not yield both factors.",
        "Set up your authenticator app on a second device if it supports it, so a dropped phone is an inconvenience rather than an incident."
      ])}

      <h2><span class="sc-article-num">5</span>Whitelist withdrawal addresses</h2>

      <p>Many platforms let you pre-approve the addresses withdrawals can go to, usually with a delay before a newly added one becomes usable. Turn this on.</p>

      <p>The delay is the feature. An attacker who gets into your account cannot immediately send funds to a fresh address of their own &mdash; they have to wait, and the platform emails you about the change in the meantime. That window is often the difference between an attempt and a loss.</p>

      ${checklist([
        "Add only addresses from wallets you control, verified on your hardware device when you add them.",
        "Enable any account-level setting that freezes changes for a cooling-off period.",
        "Treat an unexpected email about a new whitelisted address as an emergency rather than a curiosity."
      ])}

      <h2><span class="sc-article-num">6</span>Close the recovery back doors</h2>

      <p>Attackers rarely fight the front door. They use the paths built for people who have lost access, because those paths are designed to be forgiving.</p>

      ${checklist([
        "Review every recovery method on the exchange account and remove what you do not need.",
        "Remove old devices and active sessions you no longer recognise.",
        "Revoke API keys you are not using. A forgotten key with withdrawal permission is a standing invitation.",
        "Check whether the platform lets you require additional confirmation for withdrawals, and turn it on."
      ])}

      <h2><span class="sc-article-num">7</span>Assume the login page is fake</h2>

      <p>Search adverts for exchange names routinely lead to convincing replicas that capture your password and your two-factor code and pass them straight through to the real site. The login appears to work. Nothing looks wrong until the balance moves.</p>

      ${checklist([
        "Reach the exchange by a bookmark you created yourself, or by typing the address. Never from a search result, an email, or a message.",
        "Use the platform's official app rather than a browser where practical.",
        "Distrust urgency completely. Every message engineered to make you act quickly is engineered.",
        "Nobody legitimate will ever contact you first and ask for a code, a password, or a recovery phrase."
      ])}

      <h2>If you think something is wrong</h2>

      <p>Speed matters more than certainty here. Acting on a false alarm costs you an afternoon; hesitating does not.</p>

      ${checklist([
        "If your phone loses service unexpectedly, treat it as a SIM swap until proven otherwise and contact your carrier immediately from another line.",
        "Withdraw to a wallet you control, if you still can.",
        "Change the email password first, then the exchange password.",
        "Revoke all active sessions and API keys.",
        "Contact the platform through an address you typed yourself, never through a link in any message about the incident."
      ])}

      <h2>The version of this that actually works</h2>

      <p>Every measure on this page reduces the chance that someone else opens your account. None of them removes the underlying fact that a company holds your bitcoin and can freeze it, lose it, or fail while holding it.</p>

      <p>Use the account for what it is good at &mdash; buying &mdash; and move the result somewhere only you control. A locked-down account holding nothing is a problem that has solved itself.</p>

      ${callout("The next step", `<a href='exchange-withdrawal.html'>Withdrawing from a Canadian exchange</a> covers the move itself: getting an address from your own wallet, verifying it properly, and starting with a test amount.`)}`
  },

  /* ----------------------------------------------------------------- advanced */
  {
    slug: "dice-entropy",
    category: "advanced",
    products: ["coldcard", "seedsigner", "krux", "jade", "bitbox"],
    title: "Roll the dice: generating your own entropy",
    summary: "Make your wallet's secret from dice you rolled yourself, instead of trusting the device to pick it. What to do, in plain terms, and the three mistakes that ruin it.",
    level: "intermediate",
    minutes: 20,
    goals: ["setup", "harden", "learn"],
    tags: ["Entropy", "Dice", "Seed generation"],
    icon: "bi-shuffle",
    updated: "2026-08-17",
    status: "published",
    related: ["coldcard-q-setup", "seedsigner-setup", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Every bitcoin wallet is built on one enormous random number. Your twelve or twenty-four recovery words are just that number, written in a form a human can copy down. Everything else &mdash; every address, every signature, every coin you will ever hold &mdash; grows out of it.</p>

      <p>Normally your device picks that number for you, in a fraction of a second, using a random number generator sealed inside a chip. It almost certainly does this well. But you cannot watch it happen, you cannot check it afterwards, and you have no way of knowing whether the chip is doing what it claims. You are taking it on faith.</p>

      <p>Rolling dice removes the faith. You generate the randomness yourself, on a table, in front of your own eyes, and hand it to the device already made. Nothing about the chip's honesty matters any more, because you did the one part that had to be secret.</p>

      <p>It costs you about twenty minutes and a little care. Here is how it works, and &mdash; more importantly &mdash; the handful of ways people accidentally ruin it.</p>

      ${figureSlot({
        shot: "Overhead shot: a single white casino die mid-roll on a dark surface, with a notebook and pen beside it showing a column of handwritten numbers.",
        caption: "One die, rolled repeatedly, written down as you go. That is genuinely the whole apparatus.",
        ratio: "16 / 9"
      })}

      ${prerequisites([
        "A wallet that offers a dice option during setup. COLDCARD, SeedSigner, Krux, Blockstream Jade, and BitBox02 all have one.",
        "A die. One is enough. Sharp-edged casino dice are slightly better than cheap rounded ones and cost very little.",
        "Paper and a pen, and somewhere to roll where the die will not escape.",
        "A brand-new wallet with nothing in it. This is for creating a wallet, never for altering one you already use."
      ])}

      <h2>How many times do I roll?</h2>

      <p>Each roll of a six-sided die adds a fixed amount of randomness, so the number of rolls is not something you can negotiate with. The two counts that matter:</p>

      ${checklist([
        "<strong>50 rolls</strong> makes a 12-word wallet.",
        "<strong>99 rolls</strong> makes a 24-word wallet.",
        "Some wallets ask for more &mdash; around <strong>154</strong> for 24 words &mdash; because they do the arithmetic a less efficient way. Follow whatever number your device asks for."
      ])}

      <p>Ninety-nine rolls is a genuine sitting. It takes most people fifteen or twenty minutes to roll and record carefully, and that is the correct pace. Stopping at eighty because your hand is tired does not make the wallet slightly weaker &mdash; it removes a chunk of the protection you sat down to build, and nothing on the screen will warn you that it happened.</p>

      <h2>The rule everyone is tempted to break</h2>

      <p>At some point the die will do something that feels wrong. Four sixes in a row. The same number five times. A run that looks so obviously <em>not random</em> that the temptation to roll it again is almost physical.</p>

      <p>Do not roll it again. Write it down.</p>

      ${callout("Six sixes is exactly as likely as any other six rolls", "Randomness does not look random up close &mdash; it clumps, streaks, and repeats, and that is what makes it randomness. The instant you start rejecting results because they look wrong to you, the output stops reflecting the dice and starts reflecting your judgement. Your judgement is predictable. The dice are not. This is the single most effective way to weaken your own wallet, and it feels like being careful.")}

      <p>The same applies to helping the randomness along. Rolling 1, 2, 3, 4, 5, 6 in sequence over and over would sail past the safety checks on most devices &mdash; they count how often each face appeared, not what order it came in &mdash; and would produce a wallet that could be guessed in moments. Those checks exist to catch a die that has come to rest in a crack, not a person being creative.</p>

      <p>Record every roll, in order, as it happens. Read the die from directly above rather than at an angle. Use one die and roll it repeatedly rather than throwing a handful and reading them together, because reading five dice at once is how numbers get transposed.</p>

      ${figureSlot({
        shot: "Close-up of a hardware wallet screen partway through dice entry, showing the roll counter (e.g. \"47 / 99\") and the digits entered so far.",
        caption: "Most devices show a running count. Keep going until it says you are finished.",
        ratio: "4 / 3",
        icon: "bi-usb-drive"
      })}

      <h2>Are my dice good enough?</h2>

      <p>This is the question people worry about most, and it is the one that matters least.</p>

      <p>Real dice are never perfectly even. People have actually measured this properly &mdash; studies rolling dice hundreds of thousands of times have found individual faces turning up around 1.3% to 1.4% more often than they should. Cheap moulded dice are worse than casino dice with sharp square edges.</p>

      <p>The effect on your wallet is almost nothing. Below is what happens to the randomness as the die gets progressively worse, starting from a perfect one and ending at a die so skewed you would notice it across the room.</p>

      ${entropyChart()}

      <p>Read the orange bars first. A 24-word wallet begins with a colossal surplus and keeps it: even the deliberately absurd final case leaves it far above the line that counts. You could roll with a genuinely bad die and still end up with a wallet nobody is guessing.</p>

      <p>Now read the green bars. A 12-word wallet starts <em>level</em> with the 128-bit mark and has nowhere to go but down. By the last case it has fallen through both thresholds.</p>

      <p>That comparison is the practical argument for rolling 99 times instead of 50. If you are going to the trouble of doing this by hand, the extra forty-nine rolls buy you a margin so large that the fairness of your dice stops being a question worth asking.</p>

      ${pullQuote("Do not try to correct for bias by discarding rolls you dislike. That does far more damage than any real die ever would.")}

      <h2>Your rolls are not a backup</h2>

      <p>Here is the part that catches people out, and it is worth reading twice.</p>

      <p>There is no agreed standard for turning dice rolls into wallet words. Different wallets do the conversion differently &mdash; there are at least five methods in circulation &mdash; which means <strong>the same 99 rolls will produce a completely different wallet on a different device</strong>.</p>

      <p>It is not even stable over time on one device. SeedSigner changed its method in 2022, so rolls recorded before that no longer rebuild the same wallet on current firmware.</p>

      <p>So: your recovery words are the backup. Write them down carefully, exactly as the device shows them, in order. The column of dice rolls in your notebook is working paper, not a safety net &mdash; destroy it once the words are recorded and confirmed, and never file it away imagining it could rebuild the wallet later. It cannot.</p>

      <h2>Why the last word is not really yours</h2>

      <p>You may notice that the final word of your phrase seems fixed, or that the device has to work it out for you rather than letting you pick. That is normal and it is not the dice being ignored.</p>

      <p>The last word is mostly a checksum &mdash; a small built-in error check, calculated from all the words before it. It is quietly one of the most useful things in the whole design: if you copy a word down wrong, the phrase gets rejected when you try to restore it, instead of silently opening a different, empty wallet and leaving you to work out what happened.</p>

      <h2>Checking that your device did what it said</h2>

      <p>It is possible to verify that a device converts rolls the way it claims. You roll a short test set, run the same rolls through an independent tool, and see whether you get the same words out. If they match, the device is honest about its method.</p>

      <p>This is a genuinely advanced exercise, and it carries one rule with no exceptions.</p>

      ${cautions([
        "Only ever do this with throwaway test rolls, on a wallet holding nothing, which you wipe afterwards.",
        "Never type the rolls or the words of a real wallet into anything except the device itself &mdash; not a website, not an offline copy of one, not a notes app, not a spreadsheet.",
        "Anything that asks you to enter an existing recovery phrase to \"verify\" or \"validate\" it is stealing from you, however official it looks."
      ])}

      <h2>Finishing up</h2>

      <p>The dice were the interesting part. They are not the part that keeps your bitcoin safe &mdash; the ordinary, boring steps are, and they are the same ones as for any other wallet.</p>

      ${checklist([
        "Write the recovery words on paper or metal, in order, offline. Never photograph them.",
        "Restore the wallet onto a wiped device, or run your device's own backup check, before sending it anything.",
        "Send a small test amount first and confirm it arrives.",
        "Note which device and firmware version you used, since the dice method belongs to that version."
      ])}

      <p class="mt-4"><a class="sc-text-link" href="what-not-to-normalize.html">Read the habits that undo all of this <i class="bi bi-arrow-right"></i></a></p>

      <p class="sc-source-note">
        Roll counts, the differences between wallets, and the dice-fairness figures charted above are drawn from
        ${official("https://kdmukai-bot.github.io/seedsigner-ai-analysis/dice/standard.html", "an AI-assisted analysis of dice entropy across wallet implementations")}
        published alongside SeedSigner's own dice research. Devices change between firmware releases &mdash; check the roll count and method in your own device's current documentation before creating a wallet you intend to fund.
      </p>`
  },
  {
    slug: "multisig-2of3",
    category: "advanced",
    products: ["unchained", "casa"],
    title: "Build a 2-of-3 multisig",
    summary: "Three keys, any two can spend. The real work is not the setup — it is the wallet configuration everybody forgets to back up, and the rehearsal that proves the whole thing works.",
    level: "advanced",
    minutes: 60,
    goals: ["harden", "setup"],
    tags: ["Multisig", "Descriptor", "Recovery"],
    icon: "bi-diagram-3",
    updated: "2026-08-17",
    status: "published",
    related: ["recovery-test-drill", "sparrow-first-wallet", "coldcard-q-setup"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">A 2-of-3 multisig wallet holds three keys and requires any two of them to spend. Lose one and you are fine. Have one stolen and the thief has nothing. It removes the single point of failure that every ordinary wallet has, and for larger amounts that is a genuine step up.</p>

      <p>It also introduces a new way to lose everything, one that has nothing to do with keys and catches people who did the hard part correctly. That is most of what this guide is about.</p>

      <p>Set aside an afternoon. This is not a thing to do quickly, and the last stage &mdash; rehearsing the recovery &mdash; is the stage that matters most and the one people skip.</p>

      ${multisigDiagram()}

      ${prerequisites([
        "A single-signature wallet you have already restored from backup at least once. If you have not done that, do it first — multisig multiplies every backup mistake by three.",
        "Three signing devices, ideally not all the same make.",
        "Coordinator software: Sparrow, Nunchuk, or Specter.",
        "Backup material for three separate locations, and somewhere to store the wallet configuration alongside each one.",
        "An amount that justifies the complexity. Below a certain value the added ways to lose access outweigh the added protection."
      ])}

      <h2>The thing that kills multisig wallets</h2>

      <p>Your three seed phrases are not enough to rebuild this wallet.</p>

      <p>To reconstruct a multisig, software also needs to know the policy — that it is 2-of-3 — the script type, the derivation path each key uses, and the extended public key of <em>all three</em> keys, including the ones you are not holding. That bundle is called the wallet descriptor, or the wallet configuration file.</p>

      <p>Without it, you can hold all three seeds in your hand and still be unable to find your own coins, because you cannot derive the addresses they live at. The funds are visible on the blockchain and unreachable.</p>

      <div class="sc-survival-grid" role="table" aria-label="What single-signature and multisig setups survive">
        <div class="sc-survival-head" role="row"><span role="columnheader">What happens</span><span role="columnheader">Single-signature</span><span role="columnheader">2-of-3 multisig</span></div>
        <div class="sc-survival-row" role="row"><strong role="rowheader">One backup burns</strong><span class="is-fail" role="cell">Funds lost</span><span class="is-pass" role="cell">Survives</span></div>
        <div class="sc-survival-row" role="row"><strong role="rowheader">One key is stolen</strong><span class="is-fail" role="cell">Funds stolen</span><span class="is-pass" role="cell">Survives</span></div>
        <div class="sc-survival-row" role="row"><strong role="rowheader">One device dies</strong><span class="is-warn" role="cell">Restore backup</span><span class="is-pass" role="cell">No urgency</span></div>
        <div class="sc-survival-row" role="row"><strong role="rowheader">Configuration is lost</strong><span class="is-na" role="cell">Not applicable</span><span class="is-fail" role="cell">May be unreachable</span></div>
        <div class="sc-survival-row" role="row"><strong role="rowheader">You are coerced</strong><span class="is-fail" role="cell">Vulnerable</span><span class="is-fail" role="cell">Still vulnerable</span></div>
        <div class="sc-survival-row" role="row"><strong role="rowheader">Heirs must recover</strong><span class="is-warn" role="cell">Hard</span><span class="is-warn" role="cell">Harder</span></div>
      </div>

      <p>Note the fourth row. It is the only failure in that comparison which multisig <em>introduces</em>, and it is entirely preventable.</p>

      ${callout("Store the configuration with every seed backup", "The descriptor contains public keys, not private ones — it cannot be used to steal from you. It does reveal your balance and history to anyone who reads it, so it is not something to publish. But losing it is catastrophic while leaking it is merely a privacy problem, so availability wins: put a copy with each of the three backups, not in one clever place.")}

      <h2>Choosing the three keys</h2>

      <p>The point of three keys is that no single event takes two of them. That applies to manufacturers as much as to locations.</p>

      <p>Using three devices from different makers means a firmware bug, a supply-chain compromise, or a company disappearing cannot affect more than one of your keys. The cost is that you are learning three interfaces instead of one, and your coordinator has to support all three.</p>

      ${checklist([
        "<strong>Two or three different makes</strong> is the common compromise — meaningful diversity without three separate learning curves.",
        "<strong>Check coordinator support first.</strong> Sparrow, Nunchuk, and Specter each support a wide range, but confirm your exact three before buying.",
        "<strong>Prefer devices that show the full address on their own screen</strong>, since verifying a multisig receive address on-device is how you confirm the wallet is what you think it is.",
        "<strong>Avoid a key you cannot replace.</strong> If one device is discontinued and irreplaceable, plan for how you would rotate it out."
      ])}

      <p>A key held by another person &mdash; a partner, a lawyer, a family member &mdash; is a legitimate third key and is how many people build inheritance into the wallet. It is also a relationship you are now depending on. Decide that deliberately, not by default.</p>

      <h2>Where the keys live</h2>

      <p>Three keys in one house is a single point of failure wearing a disguise. One burglary, one fire, one flood takes all three, and you have paid the complexity cost for nothing.</p>

      <p>The rule is that no single event and no single location should reach two keys. In practice that usually means home, a second property or a trusted person, and a bank safe deposit box or equivalent.</p>

      ${figureSlot({
        shot: "Three different hardware wallets laid out on a desk, visibly different makes, each with its own backup card beside it.",
        caption: "Different makes as well as different places: one firmware bug should not be able to reach two of your keys.",
        ratio: "16 / 9",
        icon: "bi-diagram-3"
      })}

      ${cautions([
        "Spreading keys too far has its own cost. If assembling two signatures takes a week of travel, you will avoid using the wallet, and an unused wallet is one you never verify still works.",
        "Do not store a key and its own backup in the same place. That pairing is what a burglar finds together."
      ])}

      <h2>Building it</h2>

      <p>The mechanics vary by coordinator, but the sequence is the same everywhere.</p>

      ${checklist([
        "Set up each of the three devices independently, generating its own seed on-device and taking its own backup. Do not create all three from one seed — that is one key wearing three hats.",
        "Export the extended public key from each device, by microSD or QR rather than by typing.",
        "In the coordinator, create a new multisig wallet, set the policy to 2-of-3, and import all three public keys.",
        "Give the wallet a name you will recognise in a decade, not <em>wallet2</em>.",
        "Register the wallet configuration back onto each device that supports it — this is what lets the device recognise its own change addresses and display them safely.",
        "Export the wallet configuration file and store a copy with every seed backup."
      ])}

      <p>That registration step matters more than it looks. A device that does not know the wallet policy cannot verify that a change address belongs to you, which means it cannot warn you if a compromised computer tries to route your change somewhere else.</p>

      <h2>What each backup location should contain</h2>

      <p>Three identical packages, in three places. Each one holds one key and everything needed to use it.</p>

      ${checklist([
        "One seed phrase — written by hand, on paper or metal.",
        "A copy of the wallet configuration or descriptor.",
        "A note of the policy in plain language: <em>2 of 3 required to spend</em>.",
        "The wallet's master fingerprints, so a restore can be verified against something.",
        "A note of which coordinator software was used and where to get it.",
        "The passphrase policy, if any key uses one — recorded separately from that key's own words."
      ])}

      <p>Write the note as though the reader has never heard of any of this, because one day the reader may not be you.</p>

      <h2>Rehearse the recovery</h2>

      <p>This is the stage that turns a multisig from an arrangement into something you have actually verified. Skipping it is the single most common way people end up with an elaborate wallet they cannot open.</p>

      ${checklist([
        "Fund the wallet with a small test amount and confirm it arrives.",
        "Spend from it using keys one and two.",
        "Spend from it again using keys one and three, then again with two and three. Every pair must work — an untested pair is a pair you are assuming.",
        "Rebuild the wallet from scratch in a fresh install of the coordinator, using only the configuration file and two seeds. This proves the backup package is sufficient.",
        "Ideally, do that rebuild in a <em>different</em> coordinator than the one you built it in, which proves you are not dependent on one piece of software."
      ])}

      <p>Only after all of that should the wallet hold an amount you would miss.</p>

      <h2>What it does not fix</h2>

      <p>Multisig is not a general-purpose upgrade, and it is worth being precise about the gaps.</p>

      ${checklist([
        "<strong>Coercion.</strong> Someone forcing you to hand over funds can wait while you fetch the second key. Distributing keys makes this slower, not impossible.",
        "<strong>Bad operational habits.</strong> Approving a transaction without checking the address on-device is just as fatal with three keys as with one.",
        "<strong>Inheritance.</strong> Multisig makes this harder, not easier, unless you write the plan down. More parts means more that has to be explained.",
        "<strong>Your own attention.</strong> Three devices, three backups, and three locations need periodic checking. A key you have not verified in five years is a key you may not still have."
      ])}

      <h2>The costs you should expect</h2>

      <p>Multisig transactions carry more data on-chain than single-signature ones, because every spend has to include multiple signatures and the script. Expect to pay noticeably more in network fees for the same transaction, and more still when the mempool is busy.</p>

      <p>Spending is also slower in practice. Two devices must be brought together, or a partially signed transaction passed between them, which is friction by design — useful for savings, poor for anything you spend from regularly. Most people who run multisig keep an ordinary single-signature wallet alongside it for day-to-day amounts.</p>

      <h2>If holding all three keys yourself is too much</h2>

      <p>Everything above assumes you hold every key. There is a middle option between that and leaving coins on an exchange, usually called collaborative custody: a multisig wallet where a company holds one of the keys and you hold the rest.</p>

      <p>The important structural point is that this is <strong>not custody</strong>. In a 2-of-3 where you hold two keys and the company holds one, they cannot move your bitcoin &mdash; one signature is not enough. You can spend without them, using your own two. What they provide is a key that survives your house burning down, plus support from people who do this every day.</p>

      <div class="sc-custody-control-grid" aria-label="Control in three custody arrangements">
        <article class="is-custodian"><span class="sc-control-count">0 keys</span><h3>Exchange or custodian</h3><p>You hold nothing.</p><ul><li class="is-no">You cannot spend alone</li><li class="is-danger">Company can spend alone</li></ul></article>
        <article class="is-collaborative"><span class="sc-control-count">2 of 3 keys</span><h3>Collaborative custody</h3><p>You hold the spending threshold.</p><ul><li class="is-yes">You can spend alone</li><li class="is-safe">Company cannot spend alone</li></ul></article>
        <article class="is-self"><span class="sc-control-count">3 of 3 keys</span><h3>Self-managed multisig</h3><p>You hold every key.</p><ul><li class="is-yes">You can spend with any two</li><li class="is-neutral">No company involved</li></ul></article>
      </div>

      <h3>The services people use</h3>

      ${checklist([
        "<strong>Unchained</strong> &mdash; Bitcoin-only collaborative custody vaults, where the client typically holds two keys and Unchained holds the third. Also offers inheritance arrangements and lending against the vault.",
        "<strong>Casa</strong> &mdash; tiered multisig plans with a company-held recovery key and mobile-first key management, scaling up to larger quorums for higher tiers.",
        "<strong>Nunchuk</strong> &mdash; assisted wallets and inheritance planning layered on top of a wallet you can also run entirely by yourself.",
        "Some Canadian users also arrange an equivalent privately, with a lawyer or accountant holding the third key rather than a company."
      ])}

      <h3>The question that separates good arrangements from bad ones</h3>

      <p>Ask it before you sign up, and expect a clear answer in the documentation rather than from a salesperson:</p>

      ${pullQuote("If this company disappears overnight, can I still spend my bitcoin — and do I already have everything I need to do it?")}

      <p>In a properly structured collaborative custody wallet the answer is yes, because your own two keys meet the threshold. But that only holds if you also hold the wallet configuration, which is the same descriptor problem as before. A service that keeps the configuration and never gives you a copy has quietly made itself necessary.</p>

      ${checklist([
        "Confirm you can export the full wallet descriptor, and store it exactly as described earlier &mdash; with each of your own backups.",
        "Confirm you can recover using open-source software rather than only the company's app.",
        "Rehearse a spend using only your own two keys, before the wallet holds anything serious. This is the whole test.",
        "Understand the ongoing cost. These are subscription services, and a lapsed subscription should not be able to strand your funds &mdash; check what happens if you stop paying."
      ])}

      <h3>What you are trading away</h3>

      ${checklist([
        "<strong>Privacy.</strong> The company knows your identity and your balance, and holds records that can be subpoenaed. Self-managed multisig has no such counterparty.",
        "<strong>An ongoing fee</strong>, indefinitely, for something you could do yourself at zero recurring cost.",
        "<strong>A dependency you did not have before</strong> &mdash; smaller than an exchange, but not zero, and it needs re-evaluating if the business changes hands."
      ])}

      <p>Collaborative custody suits people who want the failure tolerance of multisig without becoming the sole operator of it &mdash; often those with meaningful amounts, limited time, and a family who would struggle to recover a fully self-managed setup. That is a real category of person and it is not a lesser choice. It is simply a different trade: you are paying a company to reduce the chance that <em>you</em> are the point of failure.</p>


      ${callout("Earn it", `If you have not yet restored a single-signature wallet from its backup, <a href="recovery-test-drill.html">do that first</a>. Multisig is the right answer to a problem you should be able to describe before you adopt it — and a simple wallet you have tested beats an elaborate one you have not.`)}`
  },
  {
    slug: "multisig-key-geography",
    category: "advanced",
    products: [],
    title: "Where the keys actually live",
    summary: "Distributing keys across locations and people without creating a set that can be collected in one afternoon.",
    level: "advanced",
    minutes: 30,
    goals: ["harden"],
    tags: ["Multisig", "Threat model"],
    icon: "bi-people",
    status: "idea"
  },
  {
    slug: "passphrase-setup",
    category: "advanced",
    products: [],
    title: "BIP39 passphrases, and when not to use one",
    summary: "A passphrase is not a password on your wallet. It is a switch that selects a different wallet entirely — which is why a single wrong character shows you an empty balance and no error message.",
    level: "advanced",
    minutes: 30,
    goals: ["harden"],
    tags: ["Passphrase", "Recovery", "Threat model"],
    icon: "bi-shield-lock",
    updated: "2026-08-17",
    status: "published",
    related: ["recovery-test-drill", "multisig-2of3", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Almost everything written about passphrases describes them as an extra password protecting your wallet. That description is wrong in a way that costs people their bitcoin, so it is worth replacing before anything else.</p>

      <p>A passphrase does not protect a wallet. It <em>selects</em> one. Your recovery words plus no passphrase lead to one wallet. Your recovery words plus the word <em>garden</em> lead to a completely different wallet. Plus <em>Garden</em>, a third. Plus <em>garden&nbsp;</em> with a trailing space, a fourth. All of them are real, valid, and permanently reachable by anyone who supplies that exact input.</p>

      <p>There is no correct passphrase and no incorrect one. There is only which of the near-infinite wallets you land in.</p>

      ${figureSlot({
        shot: "A single key on a plain surface beside a row of identical closed doors receding into shadow — the same key, many doors.",
        caption: "One seed, unlimited wallets. The passphrase is which door you walk through.",
        ratio: "16 / 9",
        icon: "bi-shield-lock"
      })}

      <h2><span class="sc-article-num">1</span>The failure that has no error message</h2>

      <p>Type your banking password wrong and you get told. Type your passphrase wrong and your wallet opens successfully, shows a balance of zero, and reports no problem at all &mdash; because you have correctly opened a different, empty wallet.</p>

      <p>This is the single most important thing to understand. Every wrong passphrase looks exactly like a wallet that has been emptied by a thief. People have concluded they were robbed when they had mistyped one character, and people have concluded their backup failed when the words were perfect and the passphrase was capitalised differently.</p>

      ${cautions([
        "There is no reset, no hint, no recovery flow, and no support desk. The passphrase is not stored anywhere — not on your device, not by the manufacturer, not in your backup unless you put it there.",
        "Case matters. Spaces matter, including trailing ones. Non-ASCII characters can be handled differently by different wallets, so a passphrase with accents or emoji may not restore identically everywhere."
      ])}

      <h2><span class="sc-article-num">2</span>What it genuinely protects against</h2>

      <p>Used well, a passphrase solves one specific problem: it makes a discovered seed backup insufficient on its own.</p>

      <p>If someone finds your metal plate in a drawer, or the safe deposit box is opened, or a relative goes through your papers, the words alone give them a wallet &mdash; just not yours. That is a genuine and meaningful improvement to the physical security of your backup.</p>

      <div class="sc-passphrase-map" aria-label="Situations where a passphrase helps or does not help">
        <div><span class="is-yes">Yes</span><p><strong>Someone finds the written seed.</strong> This is exactly what a passphrase is designed for.</p></div>
        <div><span class="is-limited">Limited</span><p><strong>The hardware wallet is stolen.</strong> The PIN was already doing most of that job.</p></div>
        <div><span class="is-no">No</span><p><strong>Malware is on the computer.</strong> Device-screen verification protects against that.</p></div>
        <div><span class="is-limited">Barely</span><p><strong>You are physically coerced.</strong> It may delay the attacker, not stop them.</p></div>
        <div><span class="is-risk">Risk</span><p><strong>You forget or mistype it.</strong> The passphrase becomes the cause of loss.</p></div>
        <div><span class="is-no">No</span><p><strong>Your heirs must recover.</strong> It makes their job materially harder.</p></div>
      </div>

      <h2><span class="sc-article-num">3</span>The decoy wallet idea deserves scrutiny</h2>

      <p>A popular argument runs: keep a small balance in the passphrase-free wallet, so if you are ever forced to hand something over you can surrender that one and keep the real wallet hidden.</p>

      <p>It sounds clever, and it rests on an assumption worth stating out loud: <strong>that the person coercing you believes you and stops.</strong></p>

      <p>Anyone sophisticated enough to force you to open a wallet knows passphrases exist. The decoy does not end the encounter; at best it buys time, and at worst it prolongs a situation you wanted over quickly. An empty or obviously-token decoy is transparently a decoy. A convincing one has to hold enough money that losing it hurts.</p>

      <p>None of that means the technique is worthless. It means it is a delay rather than a shield, and it should not be the reason you adopt a passphrase.</p>

      <h2><span class="sc-article-num">4</span>Choosing one you can actually reproduce</h2>

      <p>The requirement is not that it be clever. It is that you can reproduce it <em>exactly</em>, from memory or from a record, in ten years, under stress, possibly on a device with an awkward keyboard.</p>

      ${checklist([
        "<strong>Stick to plain ASCII.</strong> Letters, digits, simple punctuation. Accented characters and emoji are handled inconsistently between wallets and can fail to restore elsewhere.",
        "<strong>Avoid ambiguity you will have to guess about later.</strong> Was it capitalised? Was there a space or a hyphen? If you have to wonder, choose differently.",
        "<strong>Length beats complexity.</strong> Several unrelated words are stronger than a short string of symbols and far easier to record correctly.",
        "<strong>Do not use something derivable from you.</strong> A pet's name and a birth year is guessable by exactly the person most likely to find your backup.",
        "<strong>Never trust it to memory alone.</strong> People are extremely confident about strings they later cannot reproduce."
      ])}

      <h2><span class="sc-article-num">5</span>Storing it</h2>

      <p>The passphrase needs the same durability as the seed and the opposite storage location. Together they open the wallet; separately neither does. That is the entire arrangement, and it only works if the separation is real.</p>

      ${checklist([
        "Record it physically, durably, and away from the seed backup — a different building, ideally.",
        "<strong>Write down the fact that a passphrase exists at all.</strong> This is the step people skip, and it is why heirs restore the words, see an empty wallet, and conclude the bitcoin is gone.",
        "Note the exact form: whether it has spaces, capitals, or punctuation, without writing the passphrase itself in that same note.",
        "If your setup uses one passphrase per wallet, record which is which."
      ])}

      ${callout("Your heirs will not guess it", "A seed backup with no note about a passphrase is, from the outside, indistinguishable from a wallet that was emptied years ago. Whoever handles your estate will find the words, restore them, see nothing, and stop looking. Write it down.")}

      <h2><span class="sc-article-num">6</span>Test it before it holds anything</h2>

      <p>Everything above is theory until you have restored the passphrase wallet at least once, deliberately.</p>

      ${checklist([
        "Restore the words <em>plus</em> the passphrase onto a wiped or spare device and confirm the expected wallet appears.",
        "Check the master fingerprint or first receive address against what you noted beforehand.",
        "Restore the words <em>without</em> the passphrase too, so you know exactly what that empty wallet looks like and will not mistake it for a disaster later.",
        "Repeat after any change to the passphrase — which produces an entirely new wallet, requiring a fresh backup and a fresh test."
      ])}

      <p>The full procedure is in <a href='recovery-test-drill.html'>test your recovery</a>, and the passphrase case is the one where skipping it is most expensive.</p>

      <h2>Should you use one at all?</h2>

      <p>For most people holding a moderate amount, the honest answer is no &mdash; not yet.</p>

      <p>A passphrase converts a physical-security problem into a memory-and-records problem, and people are considerably worse at the second than they expect. The population of bitcoiners who have lost funds to a forgotten or mistyped passphrase is meaningfully larger than the population who were saved by one.</p>

      ${checklist([
        "<strong>Reasonable:</strong> your seed backup is somewhere you cannot fully control, such as shared premises or a location others can access.",
        "<strong>Reasonable:</strong> you already run a tested setup, understand the recovery precisely, and have somewhere durable to record the passphrase separately.",
        "<strong>Not a good reason:</strong> a guide told you it was more secure.",
        "<strong>Not a good reason:</strong> defending against coercion, for the reasons above.",
        "<strong>Not a good reason:</strong> adding it during a first setup, before you have restored anything even once."
      ])}

      <h2>The alternative worth considering first</h2>

      <p>If the problem you are solving is <em>a single discovered backup should not be enough to take my bitcoin</em>, then <a href='multisig-2of3.html'>multisig</a> solves it more robustly and without a memorised secret. Someone finding one key backup has one key, and one key is not enough &mdash; no recall required, and no silent empty wallet if you get a character wrong.</p>

      <p>Multisig is more work to set up and brings its own obligations, particularly around backing up the wallet configuration. But it fails safely where a passphrase fails silently, and for the specific threat both address, that is the more important property.</p>

      ${callout("If you take one thing from this page", "A passphrase is a second secret you must never lose, protecting against a threat you should be able to describe. If you cannot describe the threat, you are adding a way to lose your bitcoin in exchange for nothing.")}`
  },
  {
    slug: "bip85-child-seeds",
    category: "advanced",
    products: [],
    title: "BIP85: one backup, many wallets",
    summary: "One seed can generate an unlimited supply of ordinary, independent wallets on demand — so you protect one backup instead of six. The catch is a bookkeeping obligation nobody warns you about, and a master seed that is now worth six times as much to a thief.",
    level: "advanced",
    minutes: 28,
    goals: ["harden", "learn"],
    tags: ["Seed derivation", "Backups", "Threat model"],
    icon: "bi-diagram-3",
    updated: "2026-08-17",
    status: "published",
    related: ["seed-backup-metal", "passphrase-setup", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Every wallet you create adds a seed phrase to protect, and protecting a seed phrase properly is not a small job. Two metal plates in two buildings, a tested restore, a note for whoever handles your estate &mdash; that is the real cost, and it is the same cost whether the wallet holds a fortune or a coffee fund. Do it four times and most people quietly stop doing it properly.</p>

      <p>BIP85 answers that directly. One master seed becomes a factory that produces as many completely ordinary seed phrases as you ask for, each one a real wallet you can restore anywhere, each one derived again from the master whenever you need it. You back up one thing. Everything else is reproducible.</p>

      <p>That is a genuinely good trade for some people and a bad one for others, and the difference is not about how technical you are. It is about whether you will keep a record.</p>

      ${figureSlot({
        shot: "A single metal seed plate on a workbench, and fanned out in front of it a row of blank paper cards — each one a wallet that does not exist yet. Shot from a low angle so the plate reads as the source and the cards as the output.",
        caption: "One thing to protect. Everything in front of it can be reprinted from it.",
        ratio: "16 / 9",
        icon: "bi-diagram-3"
      })}

      <h2><span class="sc-article-num">1</span>What it actually does</h2>

      <p>BIP85 &mdash; <em>Deterministic Entropy From BIP32 Keychains</em> &mdash; takes your master seed and a number you choose, and produces a fresh block of entropy from the two of them. That entropy is then formatted as whatever you asked for: most usefully, a standard BIP39 seed phrase of twelve or twenty-four words.</p>

      <p>The number you choose is called the index. Index 0 produces one seed phrase. Index 1 produces a completely different one. Index 847 produces a third. The same master with the same index and the same word count always produces the same phrase, on any device that implements the standard.</p>

      ${bip85Diagram()}

      <p>Three properties do the real work here, and each one is worth stating on its own.</p>

      ${checklist([
        "<strong>The children are ordinary seeds.</strong> A BIP85-derived phrase is not a special format. It restores into Sparrow, Electrum, a hardware wallet, or anything else that speaks BIP39, and nothing downstream ever needs to know where it came from.",
        "<strong>Derivation only runs one way.</strong> Someone holding a child seed cannot work backwards to the master, and cannot reach any of its siblings. Each child is genuinely isolated from the others.",
        "<strong>Nothing is stored.</strong> The children are not saved on the device or written into the master's backup. They are recomputed from the master and the index every time, which is exactly why you only have to protect one backup."
      ])}

      <h2><span class="sc-article-num">2</span>The parameters are part of the address</h2>

      <p>The index alone does not identify a wallet. The full derivation path also carries the application and, for seed phrases, the language and the word count:</p>

      <p><code>m/83696968'/39'/0'/12'/0'</code> &mdash; BIP85, BIP39 words, English, <strong>12</strong> words, index <strong>0</strong>.</p>

      <p>Change the word count and you get a different wallet. Twelve words at index 0 and twenty-four words at index 0 are unrelated phrases leading to unrelated wallets, from the same master, at the same index. This surprises people, and it is the most common way a BIP85 wallet gets mislaid.</p>

      ${cautions([
        "Asking for the wrong word count does not produce an error. It produces a valid, empty wallet — the same silent failure a mistyped <a href='passphrase-setup.html'>passphrase</a> produces, for the same underlying reason.",
        "Different tools present these fields differently. Some ask for word count explicitly, some default to 12, some to 24. Note what you actually selected rather than what you assume the default was."
      ])}

      <h2><span class="sc-article-num">3</span>The obligation nobody mentions</h2>

      <p>Here is the part that decides whether BIP85 helps you or hurts you.</p>

      <p>Your master seed is safe on its metal plate. Two years later you want to reach the wallet that holds most of your savings. You have the master. You have a BIP85-capable device. What you need now is the answer to <em>which index, at which word count</em> &mdash; and that answer exists nowhere except in your memory or in a note you wrote.</p>

      ${pullQuote("BIP85 does not remove the record-keeping. It replaces several seed backups with one seed backup plus an index, and the index is the half people forget is load-bearing.")}

      <p>The failure is recoverable in principle: you can walk indexes 0, 1, 2 upward at both word counts and check each resulting wallet for a balance. It is tedious, it is easy to give up on, and it is a genuinely bad thing to be doing for the first time during an emergency &mdash; or for your family to be attempting without you.</p>

      <p>So write it down, and write it down in a form that survives you:</p>

      ${checklist([
        "<strong>Record that BIP85 is in use at all.</strong> A lone master seed with no note looks like an ordinary single wallet. Whoever restores it will find the master's own wallet, see whatever is in it, and never look for the other five.",
        "Record each index, its word count, and what that wallet is for — in plain language, not a private code. <em>Index 1, 24 words, long-term savings</em> beats <em>1/24/LTS</em> when the reader is not you.",
        "Keep that record with the master backup or alongside it. Unlike a passphrase, the index list is not a secret worth separating: on its own it opens nothing, and separating it just gives you a second thing to lose.",
        "Update it the moment you derive a new child, not later. The wallet you forgot to record is always the one you created quickly."
      ])}

      ${callout("The index list is documentation, not a key", "A passphrase must be stored apart from the seed because together they open the wallet. An index list is different — it is useless without the master, and the master is nearly useless without it. Treat it as the label on the box rather than a second lock.")}

      <h2><span class="sc-article-num">4</span>Where it earns its place</h2>

      <p>The clearest wins are the ones where you were going to create several wallets anyway and were quietly dreading the backup work.</p>

      ${checklist([
        "<strong>Separating money by purpose.</strong> A spending wallet on a phone, a savings wallet on a signing device, and a wallet you use for anything public-facing — three real separations, one backup behind them.",
        "<strong>A hot wallet you can afford to lose.</strong> Derive the phone wallet's seed from the master, load it with what you would carry in cash, and treat the phone as disposable rather than as something needing its own backup ritual.",
        "<strong>Wallets with a short life.</strong> A wallet for one project, one trip, or one counterparty, which you would otherwise never get around to backing up at all.",
        "<strong>Replacing a device without replacing your backups.</strong> The child seed goes onto the new hardware; the metal plate in the safe is untouched and still correct.",
        "<strong>Practice and testing.</strong> Deriving a throwaway wallet to rehearse a restore costs nothing and puts nothing real at risk."
      ])}

      <p>Notice what these have in common: in each one the alternative was not <em>a better-protected wallet</em>, it was <em>a wallet whose backup you were going to neglect</em>. BIP85 is at its best when it replaces a bad habit rather than a good one.</p>

      <h2><span class="sc-article-num">5</span>Uncle Jim</h2>

      <p>Most families have one person who ends up as the bitcoin help desk. In bitcoin circles that person has a name &mdash; Uncle Jim &mdash; and BIP85 is frequently recommended to them, because it appears to solve the hardest part of the job.</p>

      <p>The pitch is easy to see. Your sister wants to hold some bitcoin and is never going to maintain a seed backup. So you derive index 5 from your master, hand her those twelve words on a card, help her restore them into a wallet, and she is holding her own bitcoin on her own phone. If she loses the card, her phone, and the note she wrote on the back of an envelope, you can regenerate her seed from your master and have her wallet back in ten minutes.</p>

      <p>That backstop is real, and for someone who would otherwise have left the money on an exchange, it is a meaningful improvement. But the arrangement has a property that must be said out loud, in plain words, to everyone in it.</p>

      ${pullQuote("You can spend her bitcoin. Not through a support process or a legal claim — directly, at any time, from your own master seed, without her knowing.")}

      <p>That does not make it a bad arrangement. It makes it a <em>custodial</em> one, and the trouble starts when it is described as self-custody to someone who then relies on it as though it were.</p>

      ${figureSlot({
        shot: "Two hands across a kitchen table: one passing a small card of recovery words, the other reaching to take it. Warm domestic light, faces out of frame — the transaction is between the hands, not the people.",
        caption: "The moment this works or fails is the conversation, not the derivation.",
        ratio: "16 / 9",
        icon: "bi-people"
      })}

      <h3>Doing it honestly</h3>

      ${checklist([
        "<strong>Say the quiet part first.</strong> “I generated this from my own seed, which means I can access it. You should treat this as training wheels, not as a vault.” If that sentence changes their mind, it needed saying.",
        "<strong>Match the amount to the trust.</strong> This arrangement suits pocket-money balances and first steps. It does not suit someone's retirement.",
        "<strong>Plan the graduation.</strong> The goal is that they eventually generate their own seed, on their own device, and move the funds to it. Agree what triggers that — an amount, a date, or a level of confidence.",
        "<strong>Say what happens if you die.</strong> Their bitcoin is now downstream of your master seed and your index list. If your estate plan does not mention their wallet, your executor may restore the master, see funds derived from it, and treat them as yours.",
        "<strong>Keep their index recorded like any other.</strong> <em>Index 5, 12 words, Sarah's phone wallet</em> — in the same list, in the same place."
      ])}

      <p>And note the asymmetry the diagram above already showed: they cannot reach your wallets, and they cannot reach each other's. The exposure runs in exactly one direction, and it is the direction pointing at you.</p>

      <h3>When to reach for something else</h3>

      <p>If the amount matters, or the relationship would not survive a dispute about who owns what, the honest answer is not a better BIP85 arrangement. It is either their own independently generated seed &mdash; with you helping them back it up properly &mdash; or a <a href='multisig-2of3.html'>2-of-3 multisig</a> where you hold one key and genuinely cannot spend alone. Multisig is more work, and it is the arrangement that actually means what the Uncle Jim setup only appears to mean.</p>

      <h2><span class="sc-article-num">6</span>Where it must not be used</h2>

      <p>Two mistakes here are serious enough to be worth naming explicitly, because both look reasonable from the inside.</p>

      <h3>Never derive multiple keys of one multisig from one master</h3>

      <p>It is tempting: three keys from indexes 0, 1 and 2, one backup covering the lot. It also completely dismantles what multisig is for. The whole premise is that no single secret can move the funds &mdash; and if all three keys descend from your master seed, that master <em>is</em> a single secret that moves the funds. You have built a single-signature wallet wearing a costume, with more moving parts and a false sense of safety.</p>

      ${cautions([
        "Keys in a multisig must come from independently generated seeds, on separate devices, so that no one compromise reaches more than one of them.",
        "The same logic rules out deriving a “backup key” for someone else's multisig from your own master, and rules out using one master to stand up both sides of a shared wallet."
      ])}

      <h3>It is not a substitute for a passphrase, and vice versa</h3>

      <p>They solve opposite problems. A <a href='passphrase-setup.html'>passphrase</a> makes a discovered seed backup insufficient on its own &mdash; the words alone do not reach your money. BIP85 does the reverse: it makes one discovered seed backup sufficient for <em>everything</em>, because every wallet you own descends from it.</p>

      <p>Used together they compose fine &mdash; a passphrase on the master protects the whole tree &mdash; but be clear that BIP85 by itself is a convenience feature, not a security feature. Measured against several independently generated seeds stored in several places, it concentrates risk rather than reducing it.</p>

      <h2><span class="sc-article-num">7</span>The entropy ceiling</h2>

      <p>One technical detail with a practical consequence: <strong>a child can never carry more real randomness than the master it came from.</strong></p>

      <p>Derive twenty-four-word children from a twelve-word master and the phrases will be twenty-four words long, but their unpredictability is still bounded by the master's 128 bits &mdash; anyone attacking the system would go after the master rather than the child. The extra words are formatting, not strength.</p>

      <p>The consequence is simple: if you intend to use BIP85 seriously, generate the master as twenty-four words, and generate it well. <a href='dice-entropy.html'>Rolling your own entropy</a> is more defensible here than anywhere else on this site, because a weakness in this one seed is a weakness in every wallet you will ever derive from it.</p>

      <h2><span class="sc-article-num">8</span>Support is not universal</h2>

      <p>Deriving a child requires a tool that implements BIP85. The resulting seed then works anywhere, but the derivation step does not.</p>

      <p>Support is strongest among air-gapped, Bitcoin-focused signers &mdash; COLDCARD's implementation is the most thoroughly documented, and SeedSigner and Krux both include it, which fits their stateless design. Devices built around a companion app tend not to offer it; Trezor addresses adjacent problems with Shamir backup instead, and Ledger does not expose BIP85 at all.</p>

      ${cautions([
        "Firmware changes. Confirm against the manufacturer's current documentation before you plan a setup around this, rather than trusting a list — including this one.",
        "<strong>Do not use a website to derive seeds.</strong> Browser-based BIP85 tools exist and will happily accept your master seed. Typing a live master seed into a browser is the single worst thing you can do with it, whatever the page promises about running offline.",
        "Prefer deriving on the signing device itself, where the master never leaves the hardware and the child words are only ever shown on its screen."
      ])}

      <h2><span class="sc-article-num">9</span>Test it before it holds anything</h2>

      <p>The claim BIP85 makes is that your child wallets are reproducible from the master. That claim is worth exactly nothing until you have reproduced one on purpose.</p>

      ${checklist([
        "Derive a child at a chosen index and word count, and note its first receive address or master fingerprint.",
        "Wipe the device, or use a spare one, and restore the <em>master</em> seed from your actual backup — the plate in the safe, not the words still on screen.",
        "Derive the same index and word count again and confirm you land on the same wallet. This tests the backup and the derivation together, which is the pairing that matters.",
        "Repeat with a second index, so you have seen the indexes produce genuinely different wallets rather than assuming it.",
        "Have whoever would need to do this without you read your index note and tell you what they think it means."
      ])}

      <p>The full procedure is in <a href='recovery-test-drill.html'>test your recovery</a>. The BIP85 version adds one step to it &mdash; deriving the child &mdash; and that step is the one your family will not know to perform unless you have written it down.</p>

      <h2>Should you use it?</h2>

      <p>It comes down to one honest question about yourself, and it is not a question about technical skill.</p>

      ${checklist([
        "<strong>Good reason:</strong> you genuinely need several wallets, and the realistic alternative is several seed backups you will not maintain properly.",
        "<strong>Good reason:</strong> you already keep organised records, have tested a restore, and want to stop the backup pile growing every time you separate some funds.",
        "<strong>Good reason:</strong> you are standing up short-lived or low-value wallets that would otherwise go entirely unbacked.",
        "<strong>Bad reason:</strong> it sounds more secure. It is not — it concentrates every wallet you own behind one seed.",
        "<strong>Bad reason:</strong> to simplify a multisig. That is the one place it must never go.",
        "<strong>Bad reason:</strong> you have one wallet and no plans for a second. There is nothing here to gain and a new way to get confused."
      ])}

      <p>If you hold a single wallet, BIP85 solves a problem you do not have. If you hold five and can name each one's backup location from memory, you are already doing the hard version well and may not want to change it. It is the middle case &mdash; several wallets, backups you know are not all up to standard &mdash; where this genuinely helps.</p>

      ${callout("If you take one thing from this page", "BIP85 converts a backup problem into a bookkeeping problem. That is a real improvement, because backups are physical and bookkeeping is not — but only if you actually keep the books. An index you cannot remember is a wallet you cannot reach, and the master seed sitting safely in your safe will not tell you which number it was.")}`
  },
  {
    slug: "seed-backup-metal",
    category: "advanced",
    products: [],
    title: "Durable seed backups",
    summary: "Paper survives everything except the events your backup exists for. What metal actually buys you, the four-letter shortcut that halves the work, and the mistakes that quietly ruin a plate.",
    level: "intermediate",
    minutes: 25,
    goals: ["harden"],
    tags: ["Backups", "Metal", "Storage"],
    icon: "bi-box-seam",
    updated: "2026-08-17",
    status: "published",
    related: ["recovery-test-drill", "what-not-to-normalize", "passphrase-setup"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">A seed card in a drawer is a perfectly good backup right up until the moment you actually need it, which is likely to be the same moment your house is on fire, under water, or being emptied by someone else.</p>

      <p>That is the awkward property of backups: the scenarios that make you reach for one are the same scenarios that destroy paper. This page is about closing that gap without turning it into a hobby.</p>

      ${figureSlot({
        shot: "A stamped stainless steel seed plate on a workbench beside a letter punch set and a hammer, a paper seed card alongside for comparison.",
        caption: "An hour of work, once, for a backup that outlives the events it exists for.",
        ratio: "16 / 9",
        icon: "bi-box-seam"
      })}

      <h2><span class="sc-article-num">1</span>What actually happens to paper</h2>

      <p>Paper does not need a disaster to fail. It has a list of ordinary enemies, and most losses come from the boring ones rather than the dramatic ones.</p>

      ${checklist([
        "<strong>Fire</strong> is the obvious one, and paper is gone well before a structure is.",
        "<strong>Water</strong> from flooding, a burst pipe, or the effort to put out the fire. Ink runs; some inks vanish entirely.",
        "<strong>Fading.</strong> Receipt-style thermal paper can go blank in a warm drawer within a couple of years, and some ballpoint and gel inks fade badly in light.",
        "<strong>Damp and mould</strong> in a basement, garage, or safe that is not as dry as it looks.",
        "<strong>Being tidied away.</strong> An unlabelled card of random words looks like rubbish to anyone who is not you, and that includes people helping you move house."
      ])}

      <p>The last one is worth sitting with. Nothing needs to go wrong for it to happen.</p>

      <h2><span class="sc-article-num">2</span>What metal buys, and what it does not</h2>

      <p>A stamped steel plate survives house-fire temperatures, immersion, damp, and decades of neglect. Common stainless steels melt far above the range a typical structure fire reaches, and titanium higher still &mdash; either is comfortably sufficient. Avoid aluminium, which melts at a temperature ordinary house fires can exceed.</p>

      <p>What metal does not do is change anything else about your security. It is exactly as readable to whoever finds it as the paper was, and rather more durable in their hands too.</p>

      ${callout("Durability and secrecy are separate problems", "Moving to metal solves loss. It does nothing about theft — arguably the opposite, since a metal plate advertises that it matters. Location and separation remain the whole of your defence there, and a passphrase or multisig is the structural answer if a found backup is your specific worry.")}

      <h2><span class="sc-article-num">3</span>You only need the first four letters</h2>

      <p>Every word in the BIP39 list is uniquely identified by its first four letters. No two words share them. <em>Abandon</em> and <em>ability</em> differ by the fourth character; nothing beyond that is doing any work.</p>

      <p>So a backup recording <code>ABAN</code> is exactly as complete as one recording <code>ABANDON</code>, and stamping four characters per word rather than up to eight roughly halves the labour and the number of chances to make a mistake.</p>

      ${checklist([
        "Record four letters per word. Any wallet or wordlist will resolve them unambiguously.",
        "Words shorter than four letters are written in full &mdash; there are only a handful.",
        "Number your words. Order is part of the secret, and a plate of unnumbered words is a puzzle you have set for your future self.",
        "This shortcut applies to BIP39 wordlists. If your wallet uses a different scheme &mdash; Electrum's own seed format, for instance &mdash; write the words in full."
      ])}

      <h2><span class="sc-article-num">4</span>Choosing a plate</h2>

      <p>Products fall into two broad families, and the trade between them is straightforward.</p>

      <div class="sc-metal-grid" aria-label="Two ways to get words onto steel">
        <article class="sc-metal-option is-stamped">
          <div class="sc-metal-option-head"><span class="sc-metal-icon" aria-hidden="true"><i class="bi bi-rulers"></i></span><h3>Stamped plate</h3></div>
          <dl>
            <div><dt>How it works</dt><dd>You hammer letter punches into a blank steel plate.</dd></div>
            <div><dt>Trade-off</dt><dd>Cheap, permanent, and unforgiving &mdash; a mis-struck letter cannot be undone.</dd></div>
          </dl>
        </article>
        <article class="sc-metal-option is-modular">
          <div class="sc-metal-option-head"><span class="sc-metal-icon" aria-hidden="true"><i class="bi bi-stack"></i></span><h3>Tile or washer systems</h3></div>
          <dl>
            <div><dt>How it works</dt><dd>Pre-made letter tiles are assembled into slots and locked in place.</dd></div>
            <div><dt>Trade-off</dt><dd>Faster and correctable, but has small parts that can be dislodged or reordered.</dd></div>
          </dl>
        </article>
      </div>

      ${cautions([
        "Avoid anything that stores your words behind a lid, a window, or a sticker rather than in the metal itself. If a casual glance reveals it, so does a casual burglary.",
        "Avoid aluminium, and avoid products that rely on adhesive to keep letters in place."
      ])}

      <h2><span class="sc-article-num">5</span>Stamping it without ruining it</h2>

      <p>The mistakes here are all mechanical, and all avoidable by slowing down.</p>

      ${checklist([
        "Practise on a scrap plate first. Get a feel for how hard to strike before you touch the real one.",
        "Work on a hard, flat surface. A workbench or concrete floor, not a table that absorbs the blow.",
        "Stamp one word at a time and check it against your written list before moving on. Correcting later is not an option.",
        "Watch for upside-down punches. <code>N</code> and <code>Z</code>, <code>M</code> and <code>W</code>, <code>6</code> and <code>9</code> are the usual casualties.",
        "Do this alone, away from windows, with no phone camera facing the bench."
      ])}

      <p>When you have finished, restore from the plate rather than from your paper draft, and confirm you reach the right wallet. The plate is the thing you will be relying on, so the plate is the thing that gets tested.</p>

      <h2><span class="sc-article-num">6</span>What has to be stored alongside it</h2>

      <p>Words alone are a complete backup for a simple single-signature wallet, and an incomplete one for anything more elaborate. This is the step people get wrong after doing everything else right.</p>

      ${checklist([
        "<strong>A passphrase, if you use one</strong> &mdash; recorded separately, never on the same plate. Also record <em>that one exists</em>, or a future reader will restore the words, see an empty wallet, and stop.",
        "<strong>The wallet configuration, for multisig</strong> &mdash; the descriptor, the policy, the other public keys. Seeds alone will not rebuild a multisig wallet.",
        "<strong>The seed format, if it is unusual</strong> &mdash; noting that it is an Electrum seed rather than BIP39 costs one line and saves a great deal of confusion.",
        "<strong>A plain-language note</strong> explaining what the plate is and what it is for, written for someone who has never heard of any of this."
      ])}

      <h2><span class="sc-article-num">7</span>Where it goes</h2>

      <p>A plate stored next to the hardware wallet is one theft away from being useless, and a plate nobody can reach in an emergency is not much better.</p>

      ${checklist([
        "Store the backup and the device in different places. One event should not reach both.",
        "Consider a second plate in a third location if the amount justifies the extra copy &mdash; more copies means more durability and more places to be found, which is a genuine trade rather than an obvious win.",
        "If you use a safe deposit box, check the access terms, what happens on death, and whether anyone else can open it.",
        "Tell someone it exists, without telling them what it is. A backup nobody knows about is a backup that gets skipped."
      ])}

      <h2>The mistakes worth naming</h2>

      ${checklist([
        "<strong>Photographing the plate</strong> to check your work. That instantly recreates the digital copy you went to metal to avoid.",
        "<strong>Inventing an encoding scheme</strong> — shifting letters, reversing order, a personal cipher. You will forget it, or your heirs will never crack it, and it protects against far less than it costs.",
        "<strong>Splitting words across locations</strong> ad hoc — half here, half there. This is not a real security scheme, and it turns one point of failure into two.",
        "<strong>Never testing it</strong> — a plate that has never been restored from is exactly as unproven as any other backup.",
        "<strong>Leaving the paper draft lying around</strong> after stamping. Destroy it once the plate is verified."
      ])}

      <h2>Testing durability, sensibly</h2>

      <p>You will see videos of people taking blowtorches and acid to seed plates. That testing is useful and it is not something to perform on your own backup.</p>

      <p>If you want the reassurance, stamp a decoy plate with a throwaway set of words using the same product and technique, and abuse that one instead. What you are testing is whether the letters remain legible after heat and impact &mdash; which is a property of the product and your stamping depth, not of your particular words.</p>

      ${callout("The plate is not the point", `Metal solves one failure mode: the backup being physically destroyed. It does nothing about the far more common one, which is a backup that was never correct in the first place. Restore from it once, properly, before you rely on it — <a href='recovery-test-drill.html'>test your recovery</a> covers the drill.`)}`
  },
  {
    slug: "inheritance-plan",
    category: "advanced",
    products: ["unchained", "casa"],
    title: "An inheritance plan that does not leak the secret",
    summary: "Writing instructions someone can follow under stress, without those instructions being enough to steal with.",
    level: "advanced",
    minutes: 45,
    goals: ["harden"],
    tags: ["Inheritance", "Estate"],
    icon: "bi-people",
    status: "idea"
  },
  {
    slug: "coin-control-privacy",
    category: "advanced",
    products: [],
    title: "Coin control and on-chain privacy",
    summary: "How spending links your history together, and the habits that keep unrelated coins unrelated.",
    level: "advanced",
    minutes: 35,
    goals: ["harden", "learn"],
    tags: ["Privacy", "UTXO"],
    icon: "bi-pie-chart",
    status: "idea"
  },
  {
    slug: "duress-and-coercion",
    category: "advanced",
    products: [],
    title: "Planning for coercion",
    summary: "Decoy wallets, time delays, and an honest look at which of these help and which just add ways to lose funds.",
    level: "advanced",
    minutes: 30,
    goals: ["harden"],
    tags: ["Threat model", "Duress"],
    icon: "bi-shield-exclamation",
    status: "idea"
  },

  /* ----------------------------------------------------------------- concepts */
  {
    slug: "double-spend-problem",
    category: "concepts",
    products: [],
    title: "The problem bitcoin solved",
    summary: "Digital money was considered impossible for thirty years, and the obstacle was not cryptography. It was getting strangers who cannot trust each other to agree on what happened first.",
    level: "intermediate",
    minutes: 18,
    goals: ["learn"],
    tags: ["Fundamentals", "How it works", "Proof of work"],
    icon: "bi-stack",
    updated: "2026-08-17",
    status: "published",
    related: ["keys-addresses-utxos", "owning-your-bitcoin", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Digital cash was not a new idea in 2008. Cryptographers had been trying to build it since the early 1980s, and they had already solved the parts that sound hard. Unforgeable signatures: solved. Private transfers: solved. What defeated every attempt for a quarter of a century was something that sounds trivial by comparison &mdash; stopping someone spending the same money twice.</p>

      <p>Understanding why that was so difficult is the fastest route to understanding why bitcoin behaves the way it does: why you wait for confirmations, why a payment cannot be reversed, and why running your own node is worth the trouble.</p>

      ${figureSlot({
        shot: "A single banknote held taut at both edges by two different hands pulling gently in opposite directions, shot tight against a plain dark background so neither hand is winning yet.",
        caption: "The problem in one image: two people with an equally good claim, and no referee in the room.",
        ratio: "16 / 9",
        icon: "bi-currency-bitcoin"
      })}

      <h2><span class="sc-article-num">1</span>Digital things copy perfectly</h2>

      <p>Physical cash works because a note is a thing. Hand it over and you no longer have it. That property is doing enormous quiet work: it makes spending the same twenty dollars twice a physical impossibility rather than a rule anyone has to enforce.</p>

      <p>Digital files have the opposite property. Sending a file does not move it &mdash; it copies it. So a "digital coin" that is simply a file with a signature on it can be sent to a shop in Halifax and a shop in Vancouver in the same minute. Both receive something perfectly valid. Both have no way to know about the other.</p>

      <p>This is the <strong>double-spend problem</strong>, and notice what it is not. It is not a forgery problem; both copies are genuine. It is not a signature problem; both signatures verify. It is a question about <em>order</em>: which of these two equally valid transactions happened first, and who gets to decide?</p>

      <h2><span class="sc-article-num">2</span>The old answer, and its price</h2>

      <p>Every pre-bitcoin attempt answered that question the same way: appoint someone to keep the list. A central server records that the coin moved to the Halifax shop, so when the Vancouver transaction arrives it is refused. Simple, fast, and it works.</p>

      <p>It also quietly reintroduces everything digital cash was supposed to remove. Whoever keeps the list can edit it, freeze it, be hacked, go bankrupt, be bought, or be compelled by a court. Every early digital cash system that reached real users died at that single point &mdash; not because the cryptography failed, but because the company holding the ledger did.</p>

      ${pullQuote("The double-spend problem is easy to solve if you are willing to trust somebody. The whole difficulty was solving it without that.")}

      <p>Which turns the question into something harder and much more general: <em>can a group of strangers, with no leader and no reason to trust each other, agree on a single shared record of events?</em> That question already had a name.</p>

      <h2><span class="sc-article-num">3</span>The Byzantine Generals Problem</h2>

      <p>In 1982, Leslie Lamport, Robert Shostak and Marshall Pease published a paper describing the difficulty as a story.</p>

      <p>Several divisions of the Byzantine army are camped around an enemy city, each under its own general. They can only communicate by messenger. They must agree on one plan &mdash; attack together or retreat together &mdash; because a coordinated attack wins and an uncoordinated one loses. And some of the generals are traitors, actively sending contradictory messages to make sure the loyal ones disagree.</p>

      <p>Strip out the story and the question is precisely the one digital cash needed answered: <strong>how do independent participants reach agreement when some of them are lying?</strong> A general receiving "attack" from one colleague and "retreat" from another cannot tell which is the traitor. Neither can a shopkeeper receiving one version of a payment while a shop across the country receives another.</p>

      ${callout("Why the metaphor keeps its grip", "A traitorous general is not a broken one. Broken participants fail in obvious ways — they go silent, or send garbage. A traitor sends messages that look completely legitimate and are individually plausible, but are designed to produce disagreement. That is exactly what a double-spend attempt looks like from the network's point of view: two well-formed, correctly signed transactions that cannot both be true.")}

      <p>Computer scientists made real progress on this. By the late 1990s there were working algorithms for Byzantine agreement, and they came with a hard requirement: <strong>you had to know who the generals were.</strong> The maths depends on counting participants &mdash; a fixed roster, of known size, where you can establish that more than two thirds are honest.</p>

      <h2><span class="sc-article-num">4</span>The wall: counting is free to fake</h2>

      <p>On an open network, that requirement is fatal, and the reason is worth sitting with because it is the real obstacle bitcoin had to clear.</p>

      <p>If anybody may join, then "one participant, one vote" means nothing. Creating a new identity online costs nothing &mdash; so an attacker wanting a majority does not need to convince anyone or compromise anything. They simply run ten thousand copies of the software and vote ten thousand times. This is called a <strong>Sybil attack</strong>, and it makes headcount-based agreement worthless the moment membership is open to all.</p>

      <p>So the field was stuck between two options. Know your participants and get consensus, but need a gatekeeper deciding who is admitted. Or admit everyone, and lose the ability to count anything. Digital cash needed the second setting and the first result, and for decades nobody had a way to get both.</p>

      <h2><span class="sc-article-num">5</span>Bitcoin's move: make voting expensive</h2>

      <p>Bitcoin's answer is not a better way to count participants. It is a decision to <strong>stop counting participants at all.</strong></p>

      <p>Instead of one vote per identity, votes are attached to something that cannot be conjured for free: computation. To propose the next batch of transactions &mdash; a block &mdash; a miner must find a number that makes the block's cryptographic fingerprint fall below a target. There is no clever route to that number. You guess, astronomically many times, burning real electricity on real hardware until you find one.</p>

      <p>That is <strong>proof of work</strong>, and its usefulness is entirely in what it costs. Identities are free, so an attacker can have as many as they like. Energy is not, so influence over the ledger has a price list, payable in the physical world, that scales with how much of it you want.</p>

      ${checklist([
        "<strong>Nobody grants permission.</strong> There is no roster and no admission process. Anyone may mine, exactly as intended.",
        "<strong>Faking participation gains nothing.</strong> Ten thousand instances with no hashpower produce ten thousand nothings — the Sybil attack simply stops working.",
        "<strong>Influence is bought, not claimed.</strong> Half the say over new blocks requires roughly half the world's mining capacity, running continuously."
      ])}

      <h2><span class="sc-article-num">6</span>Which is how the order gets settled</h2>

      <p>Now return to our double-spender. They pay a merchant, and at the same time build a competing version of history where that same coin went back to their own wallet instead. Both versions are validly signed. Both are real candidates.</p>

      ${doubleSpendDiagram()}

      <p>Every node follows one rule: <strong>treat as real the valid chain carrying the greatest total proof of work.</strong> The attacker's alternative history is not rejected for being fraudulent &mdash; nothing in it is malformed. It loses because less work went into it, and the moment the honest chain is ahead, the attacker's version is simply the one that fewer resources vouch for.</p>

      <p>It is usually called the "longest chain" rule, which is a useful shorthand and slightly wrong. What is compared is accumulated work, not block count &mdash; a chain of fewer, harder-won blocks beats a longer chain of easier ones.</p>

      <p>So the ordering problem that defeated digital cash for thirty years is answered without a referee. Nobody adjudicates which transaction came first. The version of events that cost the most to produce becomes the version everyone keeps building on, and the alternative is abandoned.</p>

      <h2><span class="sc-article-num">7</span>Which is why you wait for confirmations</h2>

      <p>This design buys something real, and it charges for it in a currency you have already noticed: <strong>time</strong>.</p>

      <p>A transaction that has just been broadcast is a proposal. Once it is included in a block it has one confirmation, and each block built on top adds another. Nothing flips from "pending" to "permanent" &mdash; instead, reversal gets steadily more expensive, because undoing a transaction buried under six blocks means rebuilding all six faster than the entire network is extending the real chain.</p>

      ${checklist([
        "<strong>Zero confirmations is not settlement.</strong> It is a credible promise, which is fine for a coffee and not fine for a car.",
        "<strong>One confirmation</strong> is enough for ordinary amounts. The coin is in the chain and reversing it now costs real money.",
        "<strong>Six confirmations</strong> — around an hour — is the long-standing convention for amounts you would be upset to lose, and is why exchanges make you wait.",
        "<strong>Waiting is the product, not a defect.</strong> Instant reversible payments already exist; you can get them from any bank. The hour buys you the property that no one can take it back."
      ])}

      ${figureSlot({
        shot: "A phone face-up on a café table showing a wallet screen with a transaction marked as one confirmation, beside a half-finished coffee going cold. Ordinary, unhurried, slightly boring.",
        caption: "Thirty years of unsolved computer science, experienced by the user as a short wait.",
        ratio: "16 / 9",
        icon: "bi-hourglass-split"
      })}

      <h2><span class="sc-article-num">8</span>What it does not solve</h2>

      <p>Being precise about the limits is more useful than the usual claim that bitcoin "solved" Byzantine agreement outright. It did not, quite.</p>

      <p>Classical Byzantine agreement, once reached, is final. Bitcoin's is <em>probabilistic</em>: the chance of reversal shrinks with every block but never becomes mathematically zero. In exchange, it works in the open setting where the classical result cannot be applied at all. That is the trade, and it is a good one &mdash; but it is a trade, not a clean win.</p>

      <p>The well-known limit is the 51% attack. An entity controlling most of the hashpower can rewrite recent history, reverse their own recent transactions, and block transactions from confirming. It is spectacularly expensive and self-harming &mdash; the attack devalues the asset the attacker's hardware exists to earn &mdash; but it is possible, and it is why "wait for more confirmations" scales with the amount at stake.</p>

      <p>What matters just as much is the list on the other side, because it is where the limits stop:</p>

      ${cautions([
        "A majority attacker <strong>cannot spend coins whose keys they do not hold.</strong> Mining power is not signing power, and no amount of hashrate substitutes for your private key.",
        "They <strong>cannot create bitcoin out of nothing</strong>, pay themselves a larger block reward, or raise the 21 million limit. Blocks breaking those rules are invalid, and invalid blocks are discarded no matter how much work sits behind them.",
        "They <strong>cannot force those rules to change</strong>, because the rules are not enforced by miners. They are enforced by every full node independently checking every block — which is the entire argument for running one."
      ])}

      <p>That last point is the practical takeaway hiding inside the theory. Proof of work decides the <em>order</em> of valid transactions. It has no say over what counts as valid. That judgment sits with the nodes &mdash; and if you run one, some of it sits with you.</p>

      <h2>The short version</h2>

      <p>Digital money's obstacle was never secrecy or signatures. It was agreement: getting a network of strangers, some of them hostile, to concur on a single ordering of events without appointing anyone to decide. Classical computer science could do it only among known participants. Bitcoin sidestepped the counting problem entirely by making influence cost energy, so history is settled by what was expensive to produce rather than by who claims to be present.</p>

      <p>Everything you experience as a user falls out of that one decision. The wait for confirmations is the cost accumulating. The irreversibility is the guarantee being delivered. And the reason nobody can reverse a payment on your behalf is the same reason nobody can reverse one against you.</p>

      ${callout("If you take one thing from this page", "Nothing is protecting your bitcoin because an authority decided it should be. It is protected because rewriting the record costs more than it is worth — and because your own node checks the rules rather than taking anyone's word for them. That is the whole system, and it is why the responsibilities on the rest of this site sit with you.")}`
  },
  {
    slug: "life-of-a-transaction",
    category: "concepts",
    products: [],
    title: "The life of a transaction",
    summary: "What actually happens between pressing send and seeing a confirmation — the signature, the nonce that must never repeat, the waiting room nobody owns, and the moment your own node decides the payment is real.",
    level: "intermediate",
    minutes: 20,
    goals: ["learn"],
    tags: ["Transactions", "How it works", "Signing"],
    icon: "bi-arrow-left-right",
    updated: "2026-08-17",
    status: "published",
    related: ["keys-addresses-utxos", "double-spend-problem", "sparrow-coin-control"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">From the outside, sending bitcoin looks like sending an email. You enter an address, enter an amount, press a button, and some minutes later it has arrived. Underneath, almost none of that is what happens &mdash; nothing is sent to the recipient, nothing is submitted anywhere in particular, and the thing that finally makes the payment real is a decision made independently by thousands of computers that have never heard of you.</p>

      <p>This page follows one payment from a private key to a confirmed block. Not as instructions &mdash; there is nothing here to do &mdash; but because knowing the shape of it explains most of the advice on the rest of this site.</p>

      ${txLifecycleDiagram()}

      <h2><span class="sc-article-num">1</span>It starts with a key that never moves</h2>

      <p>Your wallet holds a private key: an enormous random number. From it, a public key is derived by one-way maths, and from that, an address. The chain runs in one direction only &mdash; an address tells the world nothing useful about the key behind it, which is why publishing addresses is safe and why guessing backwards is not a viable attack.</p>

      <p>The important property for what follows: <strong>the private key is never transmitted anywhere, at any stage.</strong> Not to the recipient, not to the network, not to a miner. It stays where it was generated. If you take one structural fact from this page, that is the one &mdash; and it is why a hardware wallet can safely be plugged into a compromised computer.</p>

      <p><a href='keys-addresses-utxos.html'>Keys, addresses, and UTXOs</a> covers this layer properly. Here it is just the starting point.</p>

      <h2><span class="sc-article-num">2</span>Building the transaction</h2>

      <p>The first surprise is that you do not spend a balance. There is no account holding a number. What you own is a set of discrete previous outputs &mdash; UTXOs &mdash; each one a specific chunk of bitcoin from a specific earlier transaction, each one spendable only in full.</p>

      <p>So a transaction is a short document that says: <em>these particular previous outputs are being consumed, and here is where their value goes instead.</em> Inputs point backwards at outputs of earlier transactions. Outputs create new chunks, one to the recipient and usually one back to yourself as change.</p>

      ${callout("The fee is not a field", "Nowhere in a transaction is the fee written down. It is simply whatever is left over: total inputs minus total outputs. Miners take the remainder. This is elegant and unforgiving in equal measure — omit the change output and the entire remainder becomes the fee, which is exactly how people have accidentally paid tens of bitcoin to have one transaction mined.")}

      <p>Everything so far is just arithmetic on public data. Anyone could compose this document about your coins. What they could not do is the next step.</p>

      <h2><span class="sc-article-num">3</span>Signing, and the number that must never repeat</h2>

      <p>Signing produces a proof that the holder of the private key authorised <em>this exact transaction</em> &mdash; not a password, not an unlock, but a piece of mathematics that anyone can verify against your public key and nobody can produce without your private one.</p>

      <p>What gets signed matters. By default a signature commits to the whole transaction: every input, every output, every amount. Change a single character of the destination address afterwards and the signature stops verifying. This is precisely why checking the address <em>on the signing device's own screen</em> is worth doing &mdash; the device shows you what it is about to commit to, and once committed, the details cannot be edited by malware on the computer.</p>

      ${figureSlot({
        shot: "A hardware wallet held in one hand mid-confirmation, thumb resting on the button, its small screen sharp and readable while the laptop behind it falls completely out of focus.",
        caption: "The only screen in the room that malware cannot rewrite.",
        ratio: "16 / 9",
        icon: "bi-shield-lock"
      })}

      <h3>The nonce</h3>

      <p>Each signature also consumes a fresh secret number, used once and discarded, called a nonce. It never leaves the device and never appears in the transaction &mdash; but it is arguably the most dangerous number in the whole process.</p>

      <p>If a wallet ever signs two different transactions using the <strong>same</strong> nonce with the same key, anyone who sees both signatures can recover the private key outright. Not brute-force it &mdash; solve for it, with school algebra, in a fraction of a second. This is not theoretical: it is how the PlayStation 3's signing key was extracted in 2010, and a 2013 flaw in Android's random number generator drained real bitcoin wallets by exactly this route.</p>

      ${cautions([
        "The danger is not a weak nonce, it is a <strong>repeated</strong> one. Two signatures are enough.",
        "Modern wallets avoid the problem by deriving the nonce deterministically from the private key and the transaction itself, so it cannot repeat unless the transaction does.",
        "A malicious signing device could go the other way — subtly biasing nonces so that its signatures leak your key a few bits at a time, in public, with nothing looking wrong. Some devices support anti-exfil protocols where your computer contributes randomness to each nonce and can verify it was used, which closes that door. It is worth knowing the attack exists when you choose hardware."
      ])}

      <p>The same principle applies to the newer Schnorr signatures used by Taproot addresses. Different mathematics, identical rule: the nonce is used once, or not at all.</p>

      <h2><span class="sc-article-num">4</span>Broadcast, which is not a submission</h2>

      <p>The signed transaction now needs to reach miners, and here is the second surprise: <strong>there is nowhere to send it.</strong> No server, no submission endpoint, no queue with an operator.</p>

      <p>Your wallet hands the transaction to the handful of peers it is connected to. Each of those checks it, and if it is valid, passes it to their peers, who do the same. Within a couple of seconds it has reached most of the network by nothing more organised than gossip. Nobody accepted it and nobody could have refused it on the network's behalf &mdash; each node simply decided independently whether to keep passing it along.</p>

      <p>Note what did <em>not</em> happen: the recipient was not contacted. They find out they have been paid the same way everyone else does, by watching the chain. A bitcoin payment is not delivered to anyone; it is announced to everyone.</p>

      <h2><span class="sc-article-num">5</span>The mempool: a waiting room nobody owns</h2>

      <p>Until a miner includes it, your transaction sits in the mempool &mdash; the pool of valid, unconfirmed transactions each node keeps in memory.</p>

      <p>And there is no such thing as <em>the</em> mempool. Every node keeps its own, they differ from each other, and none is authoritative. When a block explorer shows you "the mempool", it is showing you one particular node's view of the queue.</p>

      ${figureSlot({
        shot: "A large split-flap departure board in a station, most rows reading as waiting rather than departing, photographed from below so the board fills the frame.",
        caption: "A useful mental model, with one difference: here, the boards in different stations do not quite agree with each other.",
        ratio: "16 / 9",
        icon: "bi-hourglass-split"
      })}

      <p>Miners are not obliged to take transactions in order, and they do not. They assemble the most profitable block they can, which in practice means selecting by fee rate &mdash; satoshis per unit of transaction size, not total fee. A physically small transaction paying a modest fee can easily outrank a large one paying more in absolute terms.</p>

      ${checklist([
        "<strong>A transaction in the mempool has not happened.</strong> It is a proposal that most of the network currently considers valid and plausible.",
        "<strong>It can be replaced.</strong> Fee too low? Sign a replacement paying more and the network will generally prefer it — useful when you underpaid, and the reason zero-confirmation payments cannot be treated as settled.",
        "<strong>It can simply expire.</strong> Nodes evict transactions when their mempool fills, and drop them entirely after about two weeks by default. Nothing is refunded because nothing was ever taken — the coins never left your control.",
        "<strong>Congestion is a market, not an outage.</strong> When blocks are full, the fee needed to be selected rises. Nothing is broken; you are bidding for space."
      ])}

      <h2><span class="sc-article-num">6</span>Mining, and the <em>other</em> nonce</h2>

      <p>A miner gathers transactions into a candidate block, summarises them all into a single fingerprint called a merkle root, and builds an 80-byte header containing that root, the previous block's hash, a timestamp, and the current difficulty target.</p>

      <p>Then the work: hash the header, and check whether the result falls below the target. It almost certainly does not. So change one field and hash again. That field is the header's <strong>nonce</strong> &mdash; a number with no meaning whatsoever, existing purely to be changed so the header hashes differently.</p>

      ${callout("Two nonces, two entirely different jobs", "The signing nonce from step three is a secret that must never repeat, and leaks your private key if it does. The mining nonce here is a public counter, visible in every block header, that is meant to be tried billions of times. They share a name and nothing else — worth keeping straight, because conflating them makes both stories confusing.")}

      <p>The header nonce is only 32 bits, so modern hardware exhausts all four billion possibilities in well under a second. Miners therefore also vary a spare field inside the block's first transaction, which changes the merkle root and hands them a fresh nonce range to grind through &mdash; and repeat, quadrillions of times per second across the network, until someone's header comes out below the target.</p>

      <p>Whoever finds one broadcasts the block immediately. Everyone else verifies it in milliseconds, abandons the candidate they were working on, and starts again on top of the new tip. The difficulty target adjusts every 2,016 blocks so that this contest keeps resolving roughly every ten minutes no matter how much hardware joins or leaves.</p>

      <h2><span class="sc-article-num">7</span>Your node has the final say</h2>

      <p>The block arrives at your own node, and this is the part people skip. Your node does not accept it because a miner spent money producing it. It <strong>re-verifies everything, from scratch, for itself:</strong></p>

      ${checklist([
        "That the block's own proof of work genuinely meets the current target.",
        "That every input in every transaction refers to an output that exists and has not already been spent, checked against the node's own UTXO set.",
        "That every signature is valid for the key it claims to come from.",
        "That the block claims no more subsidy than the schedule permits, and breaks no other consensus rule.",
        "That the whole thing fits the size and weight limits."
      ])}

      <p>Fail any of these and the block is discarded, regardless of how much work is behind it. This is the practical meaning of the point made in <a href='double-spend-problem.html'>the problem bitcoin solved</a>: mining decides the <em>order</em> of valid transactions, and has no authority over what counts as valid. That authority is distributed across every node independently enforcing the same rules &mdash; and if you run one, you are one of them.</p>

      <p>Only after those checks pass does your wallet show one confirmation. Everything before that moment was, from your node's point of view, a rumour it had not yet finished checking.</p>

      <h2><span class="sc-article-num">8</span>Confirmations are depth, not status</h2>

      <p>One confirmation means one block. Six means five more were built on top. Nothing changes state along the way; what changes is how much work an attacker would have to redo to remove your transaction, and that grows with every block.</p>

      <p>Occasionally two miners find a block at nearly the same moment and the network briefly follows two tips. Within a block or so, one side gains work, the other is abandoned, and its transactions return to the mempool to be mined again. This is ordinary and self-correcting &mdash; and it is the concrete reason a single confirmation is good rather than final.</p>

      <h2>The short version</h2>

      <p>A key that never moves signs a document that consumes specific earlier outputs. That document is gossiped to strangers, none of whom can accept or reject it on anyone else's behalf. It waits in a queue that has no owner, gets selected by a miner competing to guess a meaningless number, and is finally made real by your own computer independently checking every claim in the block that contains it.</p>

      <p>There is no step in that sequence where an institution grants permission. That is the entire design, and it is why the responsibility for your keys, your verification, and your backups cannot be handed to anyone else &mdash; there is nobody in the system to hand it to.</p>

      ${callout("If you take one thing from this page", "Everything that travels — the transaction, the signature, the block — is public and verifiable by anyone. The one thing that never travels is the private key. Every security practice on this site is ultimately about keeping that asymmetry intact.")}`
  },
  {
    slug: "how-wallets-find-coins",
    category: "concepts",
    products: [],
    title: "How a wallet finds your coins",
    summary: "Your seed words are not a wallet. They are the root of a tree, and finding your money means knowing which branch to walk down — which is why the same words can restore perfectly and still show a balance of zero.",
    level: "intermediate",
    minutes: 16,
    goals: ["learn", "recover"],
    tags: ["Derivation", "Recovery", "How it works"],
    icon: "bi-diagram-2",
    updated: "2026-08-18",
    status: "published",
    related: ["recovery-test-drill", "keys-addresses-utxos", "life-of-a-transaction"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Here is a scenario that plays out constantly, and almost never means what the person experiencing it thinks it means. You restore your seed words into a different wallet than the one you set up with. The words are accepted without complaint. The wallet opens. The balance is zero.</p>

      <p>The overwhelmingly likely explanation is not that your bitcoin is gone. It is that the wallet is looking in the wrong place &mdash; and understanding why requires knowing what your seed words actually produce, which is not a wallet but a tree.</p>

      <h2><span class="sc-article-num">1</span>One seed, an unlimited tree of keys</h2>

      <p>Your twelve or twenty-four words encode a single large number. From that number, a defined procedure produces a master key, and from the master key an endless branching structure of child keys &mdash; a hierarchical deterministic wallet, universally shortened to HD.</p>

      <p>Deterministic is the important half. Nothing is random after the seed. Anyone starting from the same words and walking the same route through the tree arrives at exactly the same keys, every time, on any software. That is what makes a backup of twelve words sufficient to restore a wallet holding thousands of addresses.</p>

      <p>Branching is the half that causes the trouble. The tree is enormous, and your coins are on one specific branch of it. Restoring the seed gives a wallet the whole tree. It still has to be told, or has to guess, where to look.</p>

      <h2><span class="sc-article-num">2</span>Reading a derivation path</h2>

      <p>The route through the tree is written as a derivation path. You will have seen one, probably without being told what it meant:</p>

      <p><code>m/84'/0'/0'/0/0</code></p>

      <p>Read left to right, each segment is a turn:</p>

      ${checklist([
        "<strong>m</strong> &mdash; the master key derived from your seed. The root.",
        "<strong>84'</strong> &mdash; the purpose, which in practice means the address type. 44&#8242; is legacy, 49&#8242; is wrapped SegWit, 84&#8242; is native SegWit, 86&#8242; is Taproot.",
        "<strong>0'</strong> &mdash; the coin. Zero is bitcoin.",
        "<strong>0'</strong> &mdash; the account number, so one seed can hold several separately-tracked wallets.",
        "<strong>0</strong> &mdash; the branch: 0 for addresses you hand out, 1 for change coming back to you.",
        "<strong>0</strong> &mdash; the index, counting up as you generate address after address."
      ])}

      <p>Change any one of those numbers and you land somewhere else entirely &mdash; a valid, empty wallet with no relationship to the one you were looking for. This is the same silent-failure shape as a mistyped <a href='passphrase-setup.html'>passphrase</a>: nothing errors, because nothing is wrong. You simply asked a different question and got its correct answer.</p>

      ${callout("Why the address-type number matters most", "The purpose field is the one that bites people, because different wallets default to different values. A wallet that defaults to 84&#8242; restoring a seed created by a wallet defaulting to 44&#8242; will show nothing at all — the coins are sitting on the 44&#8242; branch, untouched, perfectly safe, and completely invisible until someone tells the software to look there.")}

      ${figureSlot({
        shot: "A bare winter tree photographed from directly beneath the trunk, branches splitting overhead into hundreds of forks against a flat pale sky.",
        caption: "Restoring the seed hands you the whole tree. The derivation path is which branch you climb.",
        ratio: "16 / 9",
        icon: "bi-diagram-2"
      })}

      <h2><span class="sc-article-num">3</span>The gap limit</h2>

      <p>Even on the correct branch, a wallet does not check infinitely many addresses. It works forward from index zero, and it stops after a run of consecutive empty ones &mdash; conventionally twenty. That run is the gap limit.</p>

      <p>It exists for a sensible reason: each address has to be checked against the chain, and scanning forever would make restoring impossibly slow. But it creates a specific and genuinely alarming failure.</p>

      <p>Suppose you generated thirty fresh receiving addresses while experimenting, used none of them, and then received a payment on the thirty-first. On restore, the wallet checks addresses 1 through 20, finds nothing, concludes the wallet ends there, and reports a zero balance. Your coins are ten addresses past the point where it stopped looking.</p>

      ${checklist([
        "Most wallets let you raise the gap limit manually. Setting it to a few hundred and rescanning costs some time and finds the coins.",
        "Avoid generating large numbers of addresses you never use — this is the main way people end up beyond the default.",
        "If a restore comes back empty, raising the gap limit is the second thing to try, after checking the derivation path."
      ])}

      <h2><span class="sc-article-num">4</span>The xpub, and what it gives away</h2>

      <p>At the account level of the tree sits an extended public key &mdash; an xpub. From it, anyone can derive every address in that account, past and future, but no private keys and therefore no ability to spend.</p>

      <p>This is what makes watch-only wallets possible: your phone or laptop can track balances and build unsigned transactions while the keys stay on a device in a drawer. It is genuinely useful, and it carries a privacy cost worth stating plainly.</p>

      ${cautions([
        "An xpub reveals <strong>every address in the account</strong>, so anyone holding it can see your complete balance and transaction history, forever, without you being able to revoke it.",
        "Handing an xpub to a service, a block explorer, or a friend's node hands over exactly that. It cannot take your bitcoin; it can watch all of it.",
        "This is one of the strongest arguments for pointing your wallet at <a href='why-run-a-node.html'>your own node</a> rather than someone else's server."
      ])}

      <h2><span class="sc-article-num">5</span>Descriptors: writing it down properly</h2>

      <p>Derivation paths on their own are an incomplete description, which is why the modern replacement bundles everything into one string. An output descriptor states the script type, the key, and the path together:</p>

      <p><code>wpkh([d34db33f/84'/0'/0']xpub6C.../0/*)</code></p>

      <p>That says: native SegWit, this key, this path, this branch, all indexes. There is nothing left for the receiving wallet to assume. Descriptors also handle multisig and more complex conditions, which plain paths cannot describe at all.</p>

      <p>The practical advice follows directly: <strong>when your wallet offers to export a descriptor, save it with your backup.</strong> It is not secret in the way your seed is &mdash; it contains public keys only &mdash; but it is the difference between a restore that works immediately and one that starts with guesswork.</p>

      <h2><span class="sc-article-num">6</span>What to do when a restore comes back empty</h2>

      <p>Work through it in this order, and do not do anything drastic before finishing the list.</p>

      ${checklist([
        "<strong>Stop.</strong> Do not re-enter the seed anywhere unusual, and do not type it into a website offering to help. A quiet empty wallet is not an emergency; a leaked seed is.",
        "<strong>Check the address type.</strong> Try the other purpose values — 44&#8242;, 49&#8242;, 84&#8242;, 86&#8242;. Good software offers this as a dropdown during import.",
        "<strong>Check the account number.</strong> Some wallets create account 1 in situations where others use account 0.",
        "<strong>Raise the gap limit</strong> to several hundred and rescan.",
        "<strong>Ask whether a passphrase was ever set.</strong> A forgotten passphrase produces this exact symptom, and produces it permanently.",
        "<strong>Check a known address instead of the balance.</strong> If you have an address you know received coins, searching a block explorer for it tells you whether the money is still there — which is a separate question from whether this wallet can see it."
      ])}

      <p>Almost every case resolves at step two or four. The point of <a href='recovery-test-drill.html'>testing your recovery</a> before you need it is that you discover which of these applies to you on a calm afternoon rather than during a crisis.</p>

      <h2>The short version</h2>

      <p>Seed words are the root of a deterministic tree, not a wallet. Finding your coins takes the words <em>plus</em> the route: address type, account, and enough patience to scan past the gap. Record the derivation path or, better, the descriptor alongside your backup, and a future restore becomes a two-minute job instead of an afternoon of dread.</p>

      ${callout("If you take one thing from this page", "An empty balance after a restore is far more often a wrong branch than a lost coin. Nothing on the chain has changed — the chain does not know or care which wallet you are using. Check the derivation path before you panic, and write it down now so you never have to.")}`
  },
  {
    slug: "address-types",
    category: "concepts",
    products: [],
    title: "Why addresses look different",
    summary: "Some start with 1, some with 3, some with bc1q and some with bc1p. They are not cosmetic variants — they commit to different spending rules, cost different amounts to use, and are not equally supported.",
    level: "intermediate",
    minutes: 15,
    goals: ["learn"],
    tags: ["Addresses", "SegWit", "Taproot"],
    icon: "bi-credit-card-2-front",
    updated: "2026-08-18",
    status: "published",
    related: ["keys-addresses-utxos", "how-fees-work", "how-wallets-find-coins"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Open two wallets and you may well be given two addresses that look nothing alike. One begins with a 1, another with bc1q, a third with bc1p. Nothing is broken and neither wallet is wrong &mdash; but the differences are not cosmetic, and one of them will quietly cost you money every time you spend.</p>

      <p>An address is not an account and not a location. It is a compact, human-transmissible encoding of <em>the conditions under which these coins may later be spent</em>. Different prefixes encode different kinds of condition.</p>

      <h2><span class="sc-article-num">1</span>The four you will meet</h2>

      <p>Bitcoin has added address formats over time, always without removing the old ones. All four remain valid and spendable today.</p>

      <div class="sc-table-wrap">
        <table class="sc-table">
          <caption>Address formats in current use</caption>
          <thead><tr><th scope="col">Starts with</th><th scope="col">Name</th><th scope="col">Arrived</th><th scope="col">Notes</th></tr></thead>
          <tbody>
            <tr><td><strong>1</strong></td><td>Legacy (P2PKH)</td><td>2009</td><td>Universally accepted, and the most expensive to spend.</td></tr>
            <tr><td><strong>3</strong></td><td>Script hash (P2SH)</td><td>2012</td><td>Multisig, and SegWit wrapped for compatibility.</td></tr>
            <tr><td><strong>bc1q</strong></td><td>SegWit (bech32)</td><td>2017</td><td>The common default. Cheaper to spend, error-detecting.</td></tr>
            <tr><td><strong>bc1p</strong></td><td>Taproot (bech32m)</td><td>2021</td><td>Cheapest for simple spends, and hides complex conditions.</td></tr>
          </tbody>
        </table>
      </div>

      <p>A wallet that hands you a bc1q address is not a different kind of wallet from one handing you a 1 address. Very often it is the same seed, on the same device, walking a different branch of the same tree &mdash; which is precisely the mechanism described in <a href='how-wallets-find-coins.html'>how a wallet finds your coins</a>.</p>

      <h2><span class="sc-article-num">2</span>Why anyone bothered changing</h2>

      <p>Each format solved a real problem rather than being a redesign for its own sake.</p>

      <h3>P2SH, and paying to a condition</h3>

      <p>Originally, an address committed to a single public key. That made anything more sophisticated &mdash; multisig especially &mdash; awkward, because the sender had to be handed the whole complicated condition and pay for its size. P2SH inverted it: the address commits to a <em>hash</em> of the conditions, the sender pays for a short address regardless of complexity, and the spender reveals the full detail later. Addresses starting with 3 are the result, and it is why receiving into a multisig looks no different from any other payment.</p>

      <h3>SegWit, and moving the signatures</h3>

      <p>SegWit restructured transactions so signature data sits in a separate section, discounted when a block's size is measured. Two consequences follow: spending a SegWit output costs meaningfully less in fees, and transaction IDs stopped being malleable &mdash; a fix that Lightning depends on. Native SegWit uses bech32 encoding, which is why bc1q addresses are lowercase and slightly longer, and why they carry a checksum strong enough to catch typos rather than merely usually catching them.</p>

      <h3>Taproot, and hiding the complexity</h3>

      <p>Taproot goes further: a simple single-key spend and an elaborate multi-condition contract can look <em>identical</em> on-chain. If the straightforward path is taken, that is all anyone ever sees; the unused alternatives are never published. It also brought Schnorr signatures, which make the common case cheaper still.</p>

      <p>That privacy property is not incidental &mdash; it is the whole point, and it is why <a href='scripts-and-miniscript.html'>complex spending conditions</a> became practical to use without advertising to the world that you have them.</p>

      ${figureSlot({
        shot: "Four keys of visibly different ages laid in a row on dark cloth — an ornate old brass one through to a flat modern electronic fob — all clearly keys, all clearly for different locks.",
        caption: "Every one of them still opens something. They just cost different amounts to carry.",
        ratio: "16 / 9",
        icon: "bi-credit-card-2-front"
      })}

      <h2><span class="sc-article-num">3</span>The part that costs you money</h2>

      <p>Fees are charged by transaction <em>size</em>, not by amount sent. Address type is one of the largest influences on that size &mdash; and specifically on the size of your <em>inputs</em>, meaning the coins you are spending.</p>

      <p>Approximate input sizes, which is what you pay for when spending:</p>

      ${checklist([
        "<strong>Legacy (1&hellip;)</strong> &mdash; around 148 vbytes per input. The most expensive by a wide margin.",
        "<strong>Wrapped SegWit (3&hellip;)</strong> &mdash; around 91 vbytes.",
        "<strong>Native SegWit (bc1q&hellip;)</strong> &mdash; around 68 vbytes.",
        "<strong>Taproot (bc1p&hellip;)</strong> &mdash; around 58 vbytes for an ordinary single-key spend."
      ])}

      <p>Spending a single coin, the difference is small change. Consolidating twenty small legacy inputs versus twenty Taproot ones is roughly 1,800 vbytes of difference &mdash; a real sum during a busy fee period, and the reason <a href='how-fees-work.html'>fees</a> and address types are the same conversation.</p>

      ${callout("Receiving costs you nothing", "The size penalty lands when coins are spent, not when they arrive — and it is paid by whoever spends them. Being handed a legacy address by a service costs you nothing today and costs you later, when those coins move. It is a reason to prefer modern formats for your own receiving, not a reason to refuse a payment.")}

      <h2><span class="sc-article-num">4</span>Compatibility, and the shrinking list of exceptions</h2>

      <p>Adoption lags activation by years, because every service has to update its own software.</p>

      ${cautions([
        "Some older exchanges and services still cannot send to Taproot (bc1p) addresses, and a smaller number still struggle with bc1q. If a withdrawal form rejects your address, this is usually why.",
        "The fix is to receive to a format the sender supports — most wallets can produce all four from the same seed — rather than to abandon the withdrawal.",
        "Sending <em>to</em> an old-format address always works. The limitation is only ever on the sending side."
      ])}

      <p>Bech32 addresses are case-insensitive, so bc1q&hellip; and BC1Q&hellip; are the same address. They are conventionally shown in lowercase, and a QR code of one may be uppercase purely because that encodes more compactly. Neither is a sign of anything wrong.</p>

      <h2><span class="sc-article-num">5</span>Practical guidance</h2>

      ${checklist([
        "<strong>Take your wallet's default</strong> unless you have a reason not to. Modern wallets default to native SegWit or Taproot, both of which are fine.",
        "<strong>Use a fresh address for every payment.</strong> Reusing one links payments together permanently and publicly — see <a href='bitcoin-privacy.html'>the privacy you actually have</a>. This matters far more than which format you picked.",
        "<strong>Do not chase the newest format</strong> for its own sake. The saving between bc1q and bc1p is a few percent of an already small number for most people.",
        "<strong>Do note the format alongside your backup</strong>, because it determines the derivation path a future restore has to use.",
        "<strong>Verify the address on your signing device's screen</strong>, whatever the format. Address-swapping malware does not care which prefix you use."
      ])}

      <h2>The short version</h2>

      <p>Four formats, all valid, all spendable, differing in what they commit to and what they cost to spend. Newer ones are cheaper and better at hiding complexity; older ones are more widely accepted. Your wallet's default is almost certainly the right answer, and the format you use matters considerably less than not reusing whichever one you chose.</p>

      ${callout("If you take one thing from this page", "The prefix is a statement about spending rules, not a brand. It travels with the coins, it sets what they cost to move, and it is one of the fields a future restore needs to get right — so it is worth writing down, and worth not thinking about much beyond that.")}`
  },
  {
    slug: "how-fees-work",
    category: "concepts",
    products: [],
    title: "What a fee actually buys",
    summary: "You are not paying for the amount you send. You are bidding for physical room in the next block, priced by the size of your transaction — which is why a payment of ten dollars can cost more to send than one of ten thousand.",
    level: "intermediate",
    minutes: 17,
    goals: ["learn"],
    tags: ["Fees", "Mempool", "UTXO"],
    icon: "bi-calculator",
    updated: "2026-08-18",
    status: "published",
    related: ["life-of-a-transaction", "sparrow-coin-control", "address-types"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Bitcoin fees confuse people because they behave nothing like the fees everywhere else in finance. Sending a hundred thousand dollars can cost less than sending fifty. The same payment can cost four dollars on Tuesday and forty on Thursday. And the wallet's suggestion is frequently several times what you actually needed to pay.</p>

      <p>All of this follows from one fact: <strong>the amount you are sending is irrelevant.</strong> You are buying space.</p>

      <h2><span class="sc-article-num">1</span>The thing being sold</h2>

      <p>Every block has a hard capacity limit, and it is measured in data rather than in transactions or in value. Roughly four million weight units, which for practical purposes behaves like a budget of about one million <em>virtual bytes</em> per block, arriving on average every ten minutes.</p>

      <p>That is the entire supply. It does not expand when demand rises, and no amount of paying more creates additional room. So when more transactions want in than will fit, miners face a straightforward commercial choice about which to include &mdash; and they resolve it the way anyone would.</p>

      <p>They rank by <strong>fee rate</strong>: satoshis paid per virtual byte occupied. Not total fee. A compact transaction paying 2,000 sats can easily outrank a bulky one paying 8,000, because the miner earns more per unit of the scarce thing.</p>

      ${pullQuote("Fees are rent on block space, charged by the square foot. The value of what you keep in the room does not enter into it.")}

      <h2><span class="sc-article-num">2</span>What makes a transaction big</h2>

      <p>Since you pay by size, it is worth knowing what drives it &mdash; and the dominant factor surprises people. It is not the amount, and it is not the number of recipients. It is <strong>how many separate coins you are spending.</strong></p>

      <p>Recall that you do not hold a balance but a collection of discrete UTXOs. To pay someone, your wallet gathers enough of them to cover the amount, and every one it picks up adds its own chunk of size:</p>

      ${checklist([
        "<strong>Each input</strong> &mdash; roughly 58 to 148 vbytes depending on <a href='address-types.html'>address type</a>. This is the expensive part.",
        "<strong>Each output</strong> &mdash; roughly 31 to 43 vbytes. Usually two: the recipient and your change.",
        "<strong>Fixed overhead</strong> &mdash; about 10 vbytes for the transaction itself."
      ])}

      <p>So a simple modern payment from one input is around 140 vbytes. The same payment assembled from fifteen small inputs is over a thousand &mdash; seven times the cost, for the same amount arriving at the same place.</p>

      ${callout("This is what “dust” really means", "A very small UTXO can cost more in fees to spend than it is worth, at which point it is economically stranded — still yours, still real, and not worth moving. Receiving many tiny payments quietly builds a wallet full of these. It is not a bug, it is arithmetic, and it is the reason coin control is worth learning.")}

      <h2><span class="sc-article-num">3</span>Why the price moves</h2>

      <p>Demand for block space is genuinely variable, and the fee market reprices continuously.</p>

      <p>When the mempool is nearly empty, almost anything gets mined quickly and the going rate collapses toward the minimum a node will even relay. When a backlog builds, transactions compete, and the rate needed to be included in the next few blocks climbs &mdash; sometimes by an order of magnitude within hours.</p>

      <p>Nothing is broken when this happens. A congested mempool is an auction with more bidders, and the posted price is simply what other people are currently willing to pay.</p>

      ${figureSlot({
        shot: "A cargo ship being loaded at a container terminal, deck partly full, a crane holding one more container above a gap that will clearly not fit everything waiting on the dock.",
        caption: "Fixed capacity, a queue on the quayside, and a price that rises with the queue.",
        ratio: "16 / 9",
        icon: "bi-box-seam"
      })}

      <h2><span class="sc-article-num">4</span>Your wallet is guessing</h2>

      <p>Wallets estimate fees by watching the mempool and extrapolating &mdash; and they are systematically cautious, because a wallet that gets you stuck generates far more complaints than one that overcharges you quietly.</p>

      ${checklist([
        "<strong>Choose the slowest option you can tolerate.</strong> Most wallets offer a target in blocks or hours. If the payment is not urgent, the difference between one hour and one day is often several multiples of the fee.",
        "<strong>Check the current rate independently</strong> before anything large. A mempool visualiser shows what is actually clearing, and wallet defaults are frequently well above it.",
        "<strong>Watch the clock and the calendar.</strong> Demand has rhythms — weekends and quiet hours are routinely cheaper.",
        "<strong>Do not pay for speed you cannot use.</strong> If the recipient will not credit the payment until several confirmations anyway, paying to be in the very next block buys nothing."
      ])}

      <h2><span class="sc-article-num">5</span>Getting unstuck</h2>

      <p>If you underpay, the transaction sits in the mempool rather than failing. Nothing is lost &mdash; the coins never left your control &mdash; and there are three ways out.</p>

      ${checklist([
        "<strong>Wait.</strong> Backlogs clear. A transaction that looks abandoned on Friday is often mined by Sunday, and this costs nothing.",
        "<strong>Replace it (RBF).</strong> Sign a new version of the same transaction paying a higher fee. Nodes prefer the better-paying one and the original is dropped. Most wallets expose this as “bump fee”.",
        "<strong>Have the receiver push it (CPFP).</strong> Whoever received the coins can spend them onward paying a high fee. Since the child cannot be mined without the parent, a miner takes both for the combined rate. Useful when you are waiting on an incoming payment someone else underpaid."
      ])}

      <p>And if none of those apply, a transaction that is never mined eventually falls out of every mempool &mdash; typically after about a fortnight &mdash; leaving your coins exactly where they started.</p>

      <h2><span class="sc-article-num">6</span>Spending less over time</h2>

      <p>The habits that reduce fees are mostly about the shape of your wallet rather than the moment of paying.</p>

      ${checklist([
        "<strong>Consolidate when fees are low.</strong> Combining many small UTXOs into one during a quiet period is the single most effective saving available — you pay the cost of a big transaction once, cheaply, instead of repeatedly at whatever rate happens to prevail later. Consider the <a href='bitcoin-privacy.html'>privacy trade-off</a> first, since consolidating publicly links those coins together.",
        "<strong>Receive fewer, larger payments</strong> where you have the choice. Ten withdrawals of equal total value cost roughly ten times as much to eventually spend as one.",
        "<strong>Use modern address types</strong>, which are cheaper per input.",
        "<strong>Batch your own payments.</strong> Paying three people in one transaction costs far less than three transactions."
      ])}

      <h2>The short version</h2>

      <p>You are renting space in the next block, priced by how much of it you occupy, in an auction that reprices every few minutes. Size is driven mostly by how many separate coins you are spending. The amount you are sending never enters the calculation at all.</p>

      ${callout("If you take one thing from this page", "A high fee is not a malfunction and not a penalty — it is the current market price of a genuinely scarce resource. Almost everything you can do about it happens before you press send: fewer, larger coins, modern address types, and the patience to move them when nobody else is trying to.")}`
  },
  {
    slug: "twenty-one-million",
    category: "concepts",
    products: [],
    title: "Where 21 million comes from",
    summary: "The number is not a policy anyone chose to announce and cannot be raised by agreement. It falls out of a halving schedule, and it holds because every node independently refuses to accept a block that breaks it.",
    level: "intermediate",
    minutes: 15,
    goals: ["learn"],
    tags: ["Supply", "Halving", "Consensus"],
    icon: "bi-graph-down-arrow",
    updated: "2026-08-18",
    status: "published",
    related: ["double-spend-problem", "why-run-a-node", "owning-your-bitcoin"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Twenty-one million is the most quoted number in bitcoin and the least examined. It is usually presented as a rule someone wrote down &mdash; a cap, a limit, a promise. It is none of those things. Nobody decreed it, no document states it as a target, and there is no clause anywhere saying "the supply shall be 21,000,000".</p>

      <p>It is a <em>consequence</em>. And knowing what it is a consequence of tells you rather a lot about how much confidence the number deserves.</p>

      <h2><span class="sc-article-num">1</span>The schedule</h2>

      <p>Each new block creates some bitcoin from nothing and awards it to whoever mined it. That is the only way bitcoin is ever issued &mdash; there is no other tap.</p>

      <p>The amount is not fixed. It began at 50 bitcoin per block and <strong>halves every 210,000 blocks</strong>, which at ten minutes a block works out to roughly every four years. Everything else follows from those two numbers.</p>

      <div class="sc-table-wrap">
        <table class="sc-table">
          <caption>The issuance schedule so far</caption>
          <thead><tr><th scope="col">Era</th><th scope="col">Per block</th><th scope="col">Created in the era</th></tr></thead>
          <tbody>
            <tr><td>2009&ndash;2012</td><td>50 BTC</td><td>10,500,000</td></tr>
            <tr><td>2012&ndash;2016</td><td>25 BTC</td><td>5,250,000</td></tr>
            <tr><td>2016&ndash;2020</td><td>12.5 BTC</td><td>2,625,000</td></tr>
            <tr><td>2020&ndash;2024</td><td>6.25 BTC</td><td>1,312,500</td></tr>
            <tr><td>2024&ndash;2028</td><td>3.125 BTC</td><td>656,250</td></tr>
            <tr><td>&hellip;and so on</td><td>halving each era</td><td>halving each era</td></tr>
          </tbody>
        </table>
      </div>

      <h2><span class="sc-article-num">2</span>Where the number falls out</h2>

      <p>Add that column up and it converges, for the same reason walking half the remaining distance to a wall never quite reaches it but never overshoots either.</p>

      <p>A halving series sums to exactly twice its first term. Each era mints 210,000 blocks, and the first era pays 50 per block, so:</p>

      <p><code>210,000 &times; 50 &times; 2 = 21,000,000</code></p>

      <p>That is the whole derivation. Twenty-one million is not a ceiling anyone imposed on the schedule &mdash; it is what the schedule <em>adds up to</em>. Ask why it is not twenty or twenty-five million and the honest answer is that the initial reward and the halving interval were chosen, and this is their product.</p>

      ${pullQuote("Nobody set the supply cap. Somebody set a payout schedule, and 21 million is where it lands.")}

      <h2><span class="sc-article-num">3</span>Slightly less than 21 million, actually</h2>

      <p>The true final figure is a little under, for reasons that are pleasingly mundane.</p>

      ${checklist([
        "<strong>The maths is done in whole satoshis.</strong> Rewards are integers of the smallest unit, so each halving discards fractional remainders. Those roundings never come back.",
        "<strong>The genesis block's 50 bitcoin cannot be spent.</strong> A quirk of the original code leaves it permanently outside the spendable set — the very first coins ever issued are unreachable.",
        "<strong>Some miners under-claimed.</strong> A handful of blocks over the years paid their own reward incorrectly and took less than they were entitled to. That bitcoin was simply never created.",
        "<strong>Coins get lost.</strong> Not part of the protocol, but real: keys thrown away, drives destroyed, seeds never written down. Those coins remain in the ledger permanently and will never move again."
      ])}

      <p>So the ceiling is just below 21 million, the circulating figure is meaningfully lower still, and no accounting anywhere can tell you the difference &mdash; because a lost coin and a patiently held one look identical on-chain.</p>

      <h2><span class="sc-article-num">4</span>Where we are now</h2>

      <p>Four halvings have happened. The reward stands at 3.125 bitcoin per block, and a little over twenty million &mdash; roughly 95% of everything there will ever be &mdash; has already been issued.</p>

      <p>That means the famous scarcity is largely historical. The remaining million or so trickles out over the next hundred and fourteen years, with the final satoshi arriving somewhere around 2140. Anyone buying today is buying from existing holders far more than from new supply.</p>

      ${figureSlot({
        shot: "A tall glass measuring jug almost full, with a single slow drip suspended from the tap above it, shot against a dark background so the meniscus reads clearly.",
        caption: "Roughly 95% poured. The remainder takes another century.",
        ratio: "16 / 9",
        icon: "bi-graph-down-arrow"
      })}

      <h2><span class="sc-article-num">5</span>Why the cap actually holds</h2>

      <p>This is the part that matters, and it is not about mathematics at all.</p>

      <p>A schedule in a document is worth nothing on its own &mdash; every currency that ever inflated had rules against it. What makes bitcoin's different is <strong>who checks</strong>.</p>

      <p>When a miner produces a block, they write their own reward into it. Nothing stops them writing a larger number. What stops it mattering is that every node receiving that block independently recalculates what the reward should be at that height and compares. A block claiming more is <em>invalid</em> &mdash; not disputed, not overruled by vote, simply discarded, along with all the work that went into producing it.</p>

      <p>So the cap is not enforced by a majority, a foundation, or an agreement. It is enforced separately, in parallel, by every full node in the world, each answering only to its own copy of the rules. A miner with all the hashpower on earth cannot mint one extra satoshi, because the recipients would refuse the block. This is precisely the boundary drawn in <a href='double-spend-problem.html'>the problem bitcoin solved</a>: mining decides ordering, nodes decide validity.</p>

      ${callout("Which is why the node question is not academic", "Every node running the same rules is another independent check that nobody has quietly changed them. If you use only somebody else's node, you are trusting their answer about what the rules say. Running your own is how you personally verify the 21 million — see <a href='why-run-a-node.html'>why run a node</a>.")}

      <h2><span class="sc-article-num">6</span>What happens when issuance ends</h2>

      <p>Miners are paid from two sources: the block subsidy, and the fees in the transactions they include. Today the subsidy is much the larger. It halves every four years toward nothing, and eventually fees have to carry the whole security budget on their own.</p>

      <p>Whether that transition is comfortable is a genuinely open question, and anyone claiming certainty in either direction is overselling. The honest position:</p>

      ${cautions([
        "The subsidy shrinks on a fixed schedule that does not care whether fee revenue has grown to replace it.",
        "Fee revenue is volatile — it depends on demand for block space, which rises and falls with use.",
        "The transition is gradual, spanning decades, which gives the fee market a long time to develop. That is a reason for optimism rather than a guarantee.",
        "Nobody has to solve it today, and nobody can currently prove how it resolves."
      ])}

      <h2><span class="sc-article-num">7</span>You will probably never own a whole one</h2>

      <p>Twenty-one million is small. Fewer coins than there are millionaires in the world, and the unit was never meant to be the thing you hold.</p>

      <p>Each bitcoin divides into 100,000,000 satoshis, giving 2.1 quadrillion of them in total &mdash; and the satoshi, not the bitcoin, is the actual base unit of the protocol. Every amount in every transaction is denominated in whole satoshis; "0.001 BTC" is a display convenience your wallet performs for you.</p>

      <p>Thinking in satoshis makes the arithmetic saner and removes the psychological trap of feeling shut out because you cannot buy a whole one. You would not refuse to hold dollars on the grounds that you own no gold bars.</p>

      <h2>The short version</h2>

      <p>Fifty bitcoin per block, halving every 210,000 blocks, sums to 21 million. Slightly less in practice, thanks to rounding, an unspendable genesis block, a few under-claiming miners, and a great many lost keys. About 95% is already issued. And the number holds not because anyone promised it but because every node independently rejects any block that breaks it.</p>

      ${callout("If you take one thing from this page", "The supply limit is not a promise you are trusting — it is an arithmetic check that thousands of computers perform on every single block. That distinction is the entire reason the number is worth anything, and it is why who runs nodes matters more than who owns hashpower.")}`
  },
  {
    slug: "why-run-a-node",
    category: "concepts",
    products: [],
    title: "Why run a node",
    summary: "Without one, your wallet is asking a stranger's computer what you own and believing the answer. A node is how “don't trust, verify” stops being a slogan and becomes something you actually do.",
    level: "intermediate",
    minutes: 17,
    goals: ["learn", "harden"],
    tags: ["Node", "Verification", "Privacy"],
    icon: "bi-cpu",
    updated: "2026-08-18",
    status: "published",
    related: ["double-spend-problem", "life-of-a-transaction", "bitcoin-privacy"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Open your wallet and it shows a balance. Where did that number come from? Not from the bitcoin network in the abstract &mdash; networks do not answer questions. It came from a specific computer, owned by somebody, that your wallet asked. Unless you run a node, that somebody is a stranger, and their answer is what you are looking at.</p>

      <p>This does not mean you are being lied to. It means the option of being lied to exists, and that you have no way to notice.</p>

      <h2><span class="sc-article-num">1</span>What your wallet does without one</h2>

      <p>A wallet with no node of its own has to get its information somewhere. In practice that is a server run by the wallet's developer, a public Electrum server, or a block explorer's API. Your wallet tells it which addresses to watch, and the server reports back balances and history.</p>

      <p>Some wallets do better and verify block headers, checking that the chain they are being shown carries real proof of work. That rules out an outright fabricated history but not much else &mdash; a header is a summary, and confirming that work was done is not the same as confirming the transactions underneath were valid.</p>

      <p>Two distinct problems come out of this, and they are worth separating because people usually only think about the first.</p>

      <h2><span class="sc-article-num">2</span>Problem one: you are trusting their answer</h2>

      <p>Nothing here lets a server steal from you. Your keys are yours, and a signature it did not produce is one it cannot forge. What it can do is <strong>tell you things that are not true</strong>.</p>

      ${cautions([
        "It can show a payment as confirmed when no such transaction exists, which matters if you hand over goods on that basis.",
        "It can hide transactions from you, so your displayed balance is simply wrong.",
        "It can feed you a stale view of the chain, or fail to relay a transaction you asked it to broadcast.",
        "If the consensus rules ever changed contentiously, it decides which chain's version of reality you are shown — and you would have no independent way to check."
      ])}

      <p>None of this is common. All of it is possible, and the entire architecture of bitcoin exists to remove exactly this class of dependency. Keeping it at the last step is an odd place to stop.</p>

      <h2><span class="sc-article-num">3</span>Problem two: you are telling them everything</h2>

      <p>This one is not hypothetical, not rare, and happens continuously.</p>

      <p>To watch your coins, the server must know what to watch. Many wallets simply hand over the account's extended public key &mdash; the <a href='how-wallets-find-coins.html'>xpub</a> &mdash; which lets the server derive every address you will ever use in that account. Others query address by address, which reveals the same information a little more slowly.</p>

      <p>Either way the operator can see your complete balance, your full transaction history, and your future receipts as they arrive, correlated with the IP address you connected from. They did not need to break anything. You told them, and there is no way to take it back.</p>

      ${pullQuote("A wallet with no node of its own is a privacy leak with a nice interface. The keys stay safe; everything else is on display.")}

      <h2><span class="sc-article-num">4</span>What changes when the node is yours</h2>

      <p>A full node downloads every block and checks all of it for itself &mdash; signatures, whether each input exists and is unspent, the subsidy, the script rules, the proof of work. It builds its own picture of who owns what, from the raw data, trusting nothing.</p>

      ${checklist([
        "<strong>You verify instead of asking.</strong> Your balance is a conclusion your own machine reached, not a number a stranger sent you.",
        "<strong>You enforce the rules yourself.</strong> A block breaking the <a href='twenty-one-million.html'>supply schedule</a> or any other rule is rejected by your node regardless of how much work is behind it. This is the mechanism, not a metaphor.",
        "<strong>You stop leaking.</strong> Your wallet queries your own machine, so no third party learns your addresses, balances, or IP.",
        "<strong>You broadcast privately.</strong> Your transactions enter the network from your own node rather than through a service that knows they are yours.",
        "<strong>You are not asking permission.</strong> Nobody can rate-limit you, log you, or decline to serve you."
      ])}

      ${figureSlot({
        shot: "A small single-board computer sitting on a shelf beside a router, one LED lit, an unremarkable domestic corner with a power cable and an ethernet lead. Deliberately boring.",
        caption: "The entire apparatus. It asks nobody's permission and answers only to you.",
        ratio: "16 / 9",
        icon: "bi-cpu"
      })}

      <h2><span class="sc-article-num">5</span>What it actually costs</h2>

      <p>Less than people expect, but not nothing, and the honest figures are worth knowing before you start.</p>

      ${checklist([
        "<strong>Disk.</strong> The full chain is around 750 gigabytes, growing by roughly 50 to 100 gigabytes a year while blocks stay full. Bitcoin Core's own guidance is to have at least 1TB free; a 2TB SSD means not thinking about it again. Check the current figure before buying — it only moves one way.",
        "<strong>Initial sync.</strong> Verifying the whole history from scratch takes anywhere from several hours to a couple of days depending on hardware and connection. It happens once.",
        "<strong>Bandwidth.</strong> Modest for your own use; higher if you let other nodes download blocks from you, which is the neighbourly default and can be limited.",
        "<strong>Hardware.</strong> A Raspberry Pi-class machine is enough. Any desktop from the last decade is more than enough.",
        "<strong>Attention.</strong> Occasional updates. It otherwise sits there and does its job."
      ])}

      <p>If the disk requirement is the obstacle, a <strong>pruned</strong> node solves it. It verifies every block exactly as a full node does, then discards the old ones once it has finished checking them, keeping the total under about ten gigabytes. You get complete validation and complete rule enforcement; what you give up is the ability to serve history to other nodes, and rescanning an old wallet becomes awkward. For most people it is the right trade.</p>

      <h2><span class="sc-article-num">6</span>Getting one running</h2>

      <p>There are three routes, in rising order of convenience and falling order of control.</p>

      ${checklist([
        "<strong>Bitcoin Core on a computer you already own.</strong> Free, official, and the reference implementation everything else is measured against. Install it, let it sync, point your wallet at it.",
        "<strong>A node distribution</strong> — Umbrel, Start9, myNode, RaspiBlitz and similar — which wrap Core in a friendly interface and bundle the extra services wallets want. Easier, at the cost of trusting the packaging.",
        "<strong>A prebuilt node appliance</strong>, bought ready to plug in. Fastest, most expensive, and worth checking what the vendor can see."
      ])}

      <p>One detail catches people out: most wallets do not speak to Bitcoin Core directly for address lookups. They expect an index layer &mdash; Electrs, Fulcrum, or similar &mdash; sitting alongside it. The node distributions include this already; a manual Core install usually needs it added. Sparrow and Electrum both connect happily once it is there.</p>

      ${callout("Verify the download, whichever route you take", "Node software is a high-value target for tampering, and the projects publish signatures precisely so you do not have to trust the download server. Checking them is a five-minute job that defeats an entire category of attack — and it is the same discipline as verifying your wallet software.")}

      <h2><span class="sc-article-num">7</span>Does everyone need one?</h2>

      <p>No, and pretending otherwise puts people off unnecessarily.</p>

      <p>If you hold a modest amount, use a mobile wallet, and are comfortable with the privacy trade, you are making a reasonable decision. The security of your <em>keys</em> does not depend on running a node, and a hardware wallet without one is still enormously better than an exchange.</p>

      <p>But the case strengthens quickly as the stakes rise:</p>

      ${checklist([
        "<strong>Holding an amount that would hurt to lose.</strong> At some point the balance you are shown deserves to be one you verified.",
        "<strong>Receiving payments regularly</strong>, especially in business, where being shown a false confirmation has direct consequences.",
        "<strong>Caring about privacy at all</strong> — this is the single largest improvement available to most people, ahead of anything more exotic.",
        "<strong>Running multisig or a serious setup.</strong> If you are careful enough to hold keys in three places, asking a stranger what they contain is an odd gap.",
        "<strong>Wanting the network to keep working like this.</strong> Nodes are what enforce the rules. A network where few people run them is one where fewer people are checking."
      ])}

      <h2>The short version</h2>

      <p>Your keys prove you own bitcoin. Your node tells you what you own, and whether the rules were followed. Without one, the second half is outsourced to somebody you have never met, who also learns your entire financial history in exchange for the service.</p>

      <p>It is a cheap old computer, a large disk, and an afternoon of syncing &mdash; and it converts the most repeated slogan in bitcoin into something you are actually doing.</p>

      ${callout("If you take one thing from this page", "Every other page on this site describes rules — the supply, validity, confirmation. A node is the thing that checks them on your behalf. Without one you are trusting that somebody else checked, which is the arrangement bitcoin exists to make unnecessary.")}`
  },
  {
    slug: "bitcoin-privacy",
    category: "concepts",
    products: [],
    title: "The privacy you actually have",
    summary: "Bitcoin is not anonymous and never was. It is a permanent public ledger with pseudonyms attached, and most of what links those pseudonyms to you is done by ordinary arithmetic anyone can perform.",
    level: "intermediate",
    minutes: 22,
    goals: ["learn", "harden"],
    tags: ["Privacy", "Chain analysis", "Lightning"],
    icon: "bi-wifi",
    updated: "2026-08-18",
    status: "published",
    related: ["sparrow-coin-control", "why-run-a-node", "life-of-a-transaction"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">The most durable misconception about bitcoin is that it is anonymous money for anonymous people. The truth is closer to the opposite: every transaction ever made is published, permanently, to anyone who wants to read it, and it stays readable forever. Cash is anonymous. Bitcoin is a public accounting record with nicknames.</p>

      <p>That does not make privacy impossible. It makes it something you have to do deliberately, understanding what leaks and where &mdash; which is what this page is for.</p>

      <h2><span class="sc-article-num">1</span>Pseudonymous, which is a different thing</h2>

      <p>Addresses are not names, and that is genuinely worth something. An observer scrolling the chain sees strings, not people.</p>

      <p>But pseudonymity is brittle in a specific way: it holds perfectly until <em>one</em> link is made, and then it fails backwards through everything connected. Learn that one address is yours and the observer does not learn one fact about you &mdash; they learn every transaction that address ever took part in, every address linked to it, and every future move those coins make. Retroactively, permanently, with no way to withdraw the information.</p>

      <p>Compare that with a bank, which knows everything about you but shows the world nothing. Bitcoin inverts it: the world sees everything and initially knows nothing about who you are. The whole game is keeping the second half true.</p>

      <h2><span class="sc-article-num">2</span>What one ordinary payment gives away</h2>

      <p>Before any surveillance industry gets involved, look at what falls out of a completely normal transaction.</p>

      ${chainAnalysisDiagram()}

      <p>Two inferences did all that work, and both are just reasoning about amounts:</p>

      ${checklist([
        "<strong>Common input ownership.</strong> If a transaction spends several coins at once, one person almost certainly controlled all of them — you need every private key to sign. This is the single most powerful heuristic in chain analysis, and it merges your coins' histories into one identity every time you combine them.",
        "<strong>Change detection.</strong> Payments tend to be round; change is the leftover. Add supporting signals — the change often returns to the same <a href='address-types.html'>address type</a> as the inputs, while the payment may not — and following your money forward becomes reliable rather than speculative."
      ])}

      <p>Chain analysis firms sell sophistication on top of this, but the foundations are these two observations applied at scale. Nobody needed to hack anything.</p>

      <h2><span class="sc-article-num">3</span>Where your name gets attached</h2>

      <p>The ledger has no identities in it. They come from outside, at a small number of predictable points.</p>

      ${cautions([
        "<strong>Regulated exchanges.</strong> You verified your identity, then withdrew to an address. That address is now documented as yours, and the analysis spreads outward from it. This is the most common entry point by a wide margin.",
        "<strong>Address reuse.</strong> Publishing one address that receives repeatedly — a donation address, a shop's payment address — creates a permanent, public dossier of everything it ever received.",
        "<strong>Paying identified counterparties.</strong> Every merchant, service, or friend who knows your name also learns an address of yours.",
        "<strong>Your wallet's server.</strong> Covered in <a href='why-run-a-node.html'>why run a node</a>, and worth repeating: a wallet with no node hands your address set and your IP to somebody else's machine.",
        "<strong>Block explorer lookups.</strong> Checking your own transaction on a public explorer tells that explorer which transaction you care about, from your IP address."
      ])}

      <h2><span class="sc-article-num">4</span>What actually helps</h2>

      <p>Roughly in order of benefit per unit of effort. The first three are the ones that matter for almost everybody.</p>

      ${checklist([
        "<strong>Never reuse an address.</strong> A fresh one for every payment, always. Wallets do this automatically if you let them; the harm comes from pasting a saved address repeatedly.",
        "<strong>Run your own node.</strong> The largest single improvement available. It closes the xpub leak, the address-query leak, and the IP correlation in one step.",
        "<strong>Keep coins from different sources apart.</strong> Coins from a KYC exchange and coins from a private sale should not be spent together, because doing so publicly declares one owner. This is what coin control is <em>for</em> — see <a href='sparrow-coin-control.html'>coin control in Sparrow</a>.",
        "<strong>Label everything as it arrives.</strong> You cannot avoid combining coins carelessly if you cannot remember where any of them came from. Labels are a privacy tool, not bookkeeping.",
        "<strong>Route over Tor</strong> where your wallet supports it, so your IP is not attached to your broadcasts and queries.",
        "<strong>Think before consolidating.</strong> Merging many coins when fees are low is good <a href='how-fees-work.html'>fee strategy</a> and bad privacy — it announces common ownership of everything merged. Consolidate within a context, not across."
      ])}

      <h3>CoinJoin, briefly</h3>

      <p>A CoinJoin builds one transaction with many participants and many equal-sized outputs, so an observer cannot tell which output belongs to which contributor. It genuinely breaks the input-ownership heuristic, which is the strongest tool used against you.</p>

      <p>It is also not a cleaning service. Coins carry their visible history before and after; what changes is that a specific link becomes ambiguous. Some exchanges treat CoinJoined coins with suspicion, the coordinator landscape has repeatedly proven unstable, and doing it badly &mdash; consolidating the outputs afterwards, for instance &mdash; can undo the benefit entirely. Worth understanding properly before using, rather than as a reflex.</p>

      <h2><span class="sc-article-num">5</span>Layer two, and what it changes</h2>

      <p>The obvious question is whether moving off the main chain fixes any of this. Partly, and with real caveats.</p>

      <h3>Lightning</h3>

      <p>Lightning payments happen between participants who have locked funds into a shared channel, and the individual payments are <em>not</em> published to the chain. That is a substantial and genuine improvement &mdash; a hundred Lightning payments leave no hundred entries in a public ledger for anyone to analyse later. Payments are also onion-routed, so an intermediate node forwarding your payment does not learn who sent it or who ultimately receives it.</p>

      <p>What it does not do:</p>

      ${cautions([
        "<strong>Opening and closing a channel is an on-chain transaction</strong>, with all the usual analysis applying. Your entry into and exit from Lightning is public, including the amount you committed.",
        "<strong>Your channel partner sees your activity.</strong> They necessarily know the payments passing through your shared channel and how the balance moves.",
        "<strong>Forwarding nodes see amounts</strong> passing through them, and can infer more when they sit at both ends of a route or when payments are distinctive in size.",
        "<strong>Announced channels are public.</strong> Nodes advertising themselves for routing publish their channels, capacities, and partners. Unannounced channels avoid this at the cost of being unroutable to.",
        "<strong>Custodial Lightning wallets see everything</strong>, because they are simply holding your money and doing the Lightning part for you. Convenient, and not self-custody."
      ])}

      <p>Net: Lightning is a real privacy gain for <em>the payments themselves</em>, and no help at all for the on-chain footprint at either end.</p>

      <h3>Liquid and the sidechain approach</h3>

      <p>Liquid takes a different angle: transactions on it use Confidential Transactions, so the <strong>amounts are cryptographically hidden</strong> while still being publicly verifiable as balanced. That is something the main chain simply cannot do &mdash; on bitcoin, every amount is in the clear.</p>

      <p>The price is the trust model. Liquid is operated by a federation of known businesses who collectively control the peg holding the bitcoin. That is a materially weaker arrangement than bitcoin's, and it should be evaluated as such rather than treated as a free upgrade.</p>

      <h3>Newer designs</h3>

      <p>Statechains, Ark and similar constructions each rearrange the trade-offs &mdash; typically improving on-chain footprint or interactivity, each with their own assumptions about who must be online, who can censor, and what happens if a participant vanishes. They are worth watching and, as of now, worth understanding thoroughly before trusting with meaningful amounts.</p>

      ${callout("Where every layer-two design leaks", "The entrances and the exits. Bitcoin has to be moved onto a second layer and eventually off again, and both moves are ordinary on-chain transactions carrying ordinary on-chain analysis. A layer two can hide what you did while you were inside it. None of them hide that you went in, when, or with how much.")}

      <h2><span class="sc-article-num">6</span>Being realistic about it</h2>

      <p>Two failure modes are common, and they are opposite.</p>

      <p>The first is assuming privacy you do not have &mdash; treating bitcoin as untraceable and being surprised when an exchange asks pointed questions about the origin of a deposit. The chain remembers everything, and the analysis industry is mature and well funded.</p>

      <p>The second is chasing perfect privacy and making everything worse. Elaborate schemes carry real risks: exotic wallet configurations you cannot restore, coins stranded in tools that stop being maintained, and self-inflicted losses that cost more than the surveillance ever would.</p>

      ${pullQuote("Privacy is a practice, not a product. The unglamorous habits — fresh addresses, your own node, coins kept apart, everything labelled — outperform anything you can buy or install.")}

      <p>And be clear about the threat you are addressing. Keeping your net worth off a public ledger that your neighbours, colleagues and potential burglars can read is an entirely ordinary thing to want, and it is what these practices achieve. That is a different goal from evading a determined state adversary, which is not a problem a wallet setting solves.</p>

      <h2>The short version</h2>

      <p>Every transaction is public forever. Addresses are pseudonyms that fail backwards the moment one is linked to you, and the linking is done mostly with two pieces of arithmetic: coins spent together share an owner, and the uneven output is the change. Identity enters at exchanges and at reuse. Lightning genuinely hides individual payments and does nothing for the on-chain footprint at either end.</p>

      ${callout("If you take one thing from this page", "You cannot make the ledger forget. Everything you do adds to a permanent public record that will be analysed with better tools than exist today. That argues for building good habits now rather than hoping to clean up later — because there is no later, and there is no cleaning up.")}`
  },
  {
    slug: "scripts-and-miniscript",
    category: "concepts",
    products: [],
    title: "Scripts and miniscript",
    summary: "Bitcoin can enforce far more than “whoever holds this key may spend”. It can enforce quorums, deadlines, and conditions that change over time — and miniscript is what made writing those safely something other than a specialist art.",
    level: "advanced",
    minutes: 20,
    goals: ["learn", "harden"],
    tags: ["Script", "Miniscript", "Timelock"],
    icon: "bi-building-lock",
    updated: "2026-08-18",
    status: "published",
    related: ["multisig-2of3", "address-types", "life-of-a-transaction"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Almost everything written about bitcoin describes ownership as holding a key. That is the common case, not the rule. What the network actually enforces is a <em>condition</em> &mdash; and "a valid signature from this key" is merely the simplest condition anyone writes.</p>

      <p>The conditions can be considerably richer: two of these three keys, or this one key after a year has passed, or this key today and that key from next March. The chain enforces all of it mathematically, with no institution involved and no way to appeal.</p>

      <h2><span class="sc-article-num">1</span>Outputs carry conditions, not owners</h2>

      <p>Every output on the chain has a small program attached, written in a language called Script. To spend that output, you supply data satisfying the program. Nodes run it, and the coins move only if it succeeds.</p>

      <p>For an ordinary payment the program says: <em>provide a signature matching this public key.</em> That is why we talk about keys as ownership &mdash; in the overwhelming majority of cases, they are the whole condition.</p>

      <p>But Script has other pieces available. It can require several signatures. It can check that a certain block height has passed, or that a specified duration has elapsed since the coin was created. It can offer alternative routes and accept whichever is satisfied. Combine those and you can express arrangements no bank product corresponds to.</p>

      ${callout("Why this looks like nothing from outside", "Since P2SH, and far more so with Taproot, an address commits to a hash of the conditions rather than the conditions themselves. A single-key wallet and an elaborate corporate vault produce addresses that look identical. With Taproot, if the straightforward path is the one used, the alternatives are never revealed at all — see <a href='address-types.html'>why addresses look different</a>.")}

      <h2><span class="sc-article-num">2</span>Timelocks: conditions that arrive later</h2>

      <p>The piece that makes genuinely interesting arrangements possible is bitcoin's ability to enforce <em>time</em>.</p>

      ${checklist([
        "<strong>Absolute timelocks</strong> make an output unspendable until a stated block height or date. \"Not before 2030\" is enforceable by every node.",
        "<strong>Relative timelocks</strong> count from when the coin was created. \"Not until six months after this coin appeared\" &mdash; useful because the clock starts when you move funds in, rather than at a fixed calendar point you must keep updating."
      ])}

      <p>Crucially, timelocks can sit on <em>one branch</em> of a condition while other branches remain available immediately. That is what turns them from a curiosity into the basis of real inheritance and recovery designs: the normal path works today, and a fallback path quietly becomes available if the normal one goes unused for long enough.</p>

      ${figureSlot({
        shot: "A bank of safe deposit boxes with three different keyholes on one door, and a small brass dial beside them showing a date rather than a combination.",
        caption: "Not one lock but a policy: who may open it, and when that changes.",
        ratio: "16 / 9",
        icon: "bi-building-lock"
      })}

      <h2><span class="sc-article-num">3</span>Why nobody wrote raw Script</h2>

      <p>Script is a low-level stack language, and writing it by hand is genuinely dangerous. The failure modes are not the friendly kind where something does not work &mdash; they are the kind where it works today and locks your money away permanently under conditions you did not intend.</p>

      ${cautions([
        "A subtly wrong script can be <strong>unspendable</strong>. The coins arrive, the address is valid, and nothing you ever do will move them again.",
        "It can be <strong>spendable by the wrong person</strong>, if a branch you did not think through is satisfiable more easily than you assumed.",
        "You often <strong>cannot tell by reading it</strong> which of those you have written. Analysing an arbitrary script for these properties is not something a person can do reliably by eye.",
        "Wallets cannot estimate fees for it, because they cannot know what a spend will cost without understanding the script's structure."
      ])}

      <p>The practical result was that complex conditions stayed the preserve of specialists writing bespoke code, and everyone else used plain multisig even when it fitted their problem poorly.</p>

      <h2><span class="sc-article-num">4</span>Miniscript</h2>

      <p>Miniscript is a restricted, structured way of writing the useful subset of Script &mdash; and the restriction is the entire point. By limiting how pieces may be assembled, it makes the resulting policy something software can <em>analyse</em> rather than merely execute.</p>

      ${checklist([
        "<strong>It can be checked for correctness.</strong> Software can prove a miniscript is spendable by the parties intended, and cannot be spent by anyone else. The catastrophic failure of a hand-written script becomes a compile-time error.",
        "<strong>It composes.</strong> Conditions can be built from smaller ones — this key AND that timelock, OR two of these three — without the combination producing surprises.",
        "<strong>Wallets can work with it.</strong> They can compute the cost of each spending path, so fee estimation works and coin selection behaves.",
        "<strong>It is readable.</strong> A policy can be written in a form a careful person can actually check against what they meant, and it travels inside a <a href='how-wallets-find-coins.html'>descriptor</a> alongside the keys and derivation paths.",
        "<strong>It is not a new protocol.</strong> Miniscript compiles to ordinary Script that existing nodes already validate. Nothing had to change for it to work."
      ])}

      <p>A policy might read, in plain English: <em>three of five company keys can spend at any time; or two of five, but only after ninety days; or a single recovery key after one year.</em> Ordinary multisig cannot express that at all &mdash; it has exactly one quorum, fixed forever. Miniscript expresses it, proves it does what it says, and produces an address that looks utterly unremarkable.</p>

      <h2><span class="sc-article-num">5</span>What this makes possible</h2>

      ${checklist([
        "<strong>Inheritance that does not need a lawyer to execute.</strong> You spend normally; if your key goes unused for a year, an heir's key becomes able to spend. No custodian, no dead man's switch to maintain, no trust in anyone's cooperation.",
        "<strong>Degrading quorums.</strong> A high bar for normal operation that relaxes over time, so losing keys becomes survivable without making theft easy today.",
        "<strong>Business controls.</strong> Two officers to move funds during the week, more required for larger amounts, a slow recovery path if the company reorganises.",
        "<strong>Collaborative custody with a real exit.</strong> A partner co-signs while the arrangement is active, and drops out automatically if they stop being available."
      ])}

      <p>That last pattern is worth a concrete example, because a live product implements it and it demonstrates the whole idea better than any abstract description.</p>

      <h3>A worked example: AnchorWatch</h3>

      <p><a href="https://anchorwatch.com/" target="_blank" rel="noopener">AnchorWatch</a> is a Lloyd's of London coverholder offering insured bitcoin custody, and its Trident Vault is built on miniscript rather than plain multisig. The reason is precisely the expressiveness described above.</p>

      <p>While the insurance policy is active, AnchorWatch is a required co-signer &mdash; which is what makes the coverage underwritable, since they can enforce controls on how funds move. They cannot spend unilaterally at any point. And the vault carries timelocked recovery paths, so if keys are lost, destroyed, or become unavailable through death or staff changes, different combinations of keys become usable as time passes.</p>

      <p>The elegant part is what happens when the policy lapses. The timelocks expire and the vault <strong>degrades into plain self-custody</strong> &mdash; the customer's keys alone become sufficient, with no cooperation from AnchorWatch required and no action needed from them to release it. Renewing the policy restarts the clocks. The company's continued existence is not a dependency, which is a property no amount of contract drafting can provide.</p>

      ${callout("Why that example is worth studying", "It shows the shape of a well-designed condition: the arrangement you want while things are normal, and an automatic fall-back to something safe if the counterparty disappears. Whether or not you would ever buy the product, that pattern — the vault fails open to you, never closed — is the one to copy in any setup involving a third party.")}

      <h2><span class="sc-article-num">6</span>Before you build one</h2>

      <p>Everything above is real and available today. It is also a place where enthusiasm outruns caution, so a few things need saying plainly.</p>

      ${cautions([
        "<strong>A complex policy is more to back up, not less.</strong> Rebuilding it needs the full descriptor — every public key, every path, every condition. Keys alone will not do it, exactly as with <a href='multisig-2of3.html'>multisig</a>, and the consequences of losing that record are the same.",
        "<strong>Wallet support is uneven.</strong> Miniscript handling has improved considerably, but not every wallet and not every signing device copes with every policy. Verify your whole chain of tools before funding anything.",
        "<strong>Timelocks are unforgiving.</strong> A path that unlocks in a year unlocks in a year. There is no early release and nobody to ask.",
        "<strong>Test every branch.</strong> Not just the everyday path — the recovery path, the timelocked path, the one your family would need. On a testnet or with trivial amounts, before it matters.",
        "<strong>Complexity you cannot explain is complexity you should not deploy.</strong> If you cannot describe the policy in one paragraph to the person who would have to use the fallback, it is not finished."
      ])}

      <h2>The short version</h2>

      <p>Bitcoin outputs carry conditions, and conditions can involve multiple keys, deadlines, and alternative routes that open over time. Writing those in raw Script risks locking funds away forever. Miniscript constrains the language so software can prove what a policy does before you rely on it, which moves these arrangements from specialist territory into something a careful person can use.</p>

      <p>The obligation that comes with it is the same one multisig carries, only larger: the keys are not enough. The description of the policy is part of your backup, and without it the money is unreachable no matter how many keys you hold.</p>

      ${callout("If you take one thing from this page", "The chain will enforce whatever you tell it to, exactly, forever, with nobody to appeal to. That is the feature and the danger in one sentence — and the reason miniscript's ability to prove what a policy does before you fund it matters more than anything it makes newly expressible.")}`
  },
  {
    slug: "who-decides-the-rules",
    category: "concepts",
    products: [],
    title: "Who decides the rules",
    summary: "Bitcoin has no board, no vote, and no procedure for changing itself — yet it changes. How that works, why the block size war ended as it did, and what a failed fork in August 2026 demonstrated in under eight hours.",
    level: "intermediate",
    minutes: 20,
    goals: ["learn"],
    tags: ["Consensus", "Forks", "Governance"],
    icon: "bi-check2-circle",
    updated: "2026-08-18",
    status: "published",
    related: ["double-spend-problem", "why-run-a-node", "twenty-one-million"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Bitcoin has no chief executive, no board, no shareholders, and no mechanism by which anyone can be made to accept a change. There is no vote that binds anybody. And yet the rules have changed several times, and other attempts to change them have failed decisively.</p>

      <p>Understanding how that actually resolves is not political trivia. It is the reason the <a href='twenty-one-million.html'>21 million limit</a> is credible, and it is the clearest argument for <a href='why-run-a-node.html'>running your own node</a>.</p>

      <h2><span class="sc-article-num">1</span>The rules are whatever nodes enforce</h2>

      <p>Start from the mechanism rather than the politics. A node holds a set of validity rules and rejects anything violating them. It does not consult anyone. It does not care what a majority thinks. It applies its own rules to every block it receives.</p>

      <p>So "the rules of bitcoin" is not a document. It is <strong>the overlap between what everyone's software independently enforces</strong>. Where that overlap is total, there is one chain. Where it stops being total, there are two &mdash; and everyone follows the one their own node accepts.</p>

      <p>Which gives the honest answer to who decides: <em>everyone, individually, by choosing what to run</em> &mdash; and nobody, collectively, because there is no body to hold the decision. It is less an election than a question of what people will accept.</p>

      <h2><span class="sc-article-num">2</span>Two kinds of change</h2>

      <p>The distinction matters enormously, because it determines what happens to people who do not upgrade.</p>

      <h3>Soft forks tighten the rules</h3>

      <p>A soft fork makes previously valid things invalid. Blocks following the new stricter rules still satisfy the old ones, so nodes that never upgrade continue accepting the chain &mdash; they simply do not understand the new features and do not need to.</p>

      <p>This backwards compatibility is why almost every successful upgrade has been a soft fork. SegWit in 2017 and Taproot in 2021 both worked this way. Nobody was forced to do anything on a deadline.</p>

      <h3>Hard forks loosen them</h3>

      <p>A hard fork makes previously invalid things valid &mdash; larger blocks, a different supply, a new opcode requiring relaxed limits. Old nodes reject the new blocks outright, because from where they stand the rules are being broken.</p>

      <p>The consequence is stark: <strong>everybody must upgrade, or the network splits into two chains.</strong> There is no gentle version. This is why hard forks are treated with such suspicion &mdash; not because change is forbidden, but because the coordination requirement is absolute.</p>

      ${callout("A split is not a bug in the design", "When people cannot agree, both sets of rules can simply continue, each with its own chain and its own coins. Nobody is stopped. What decides the outcome is which chain attracts users, miners, exchanges and developers — and historically that has been extremely lopsided rather than an even division.")}

      <h2><span class="sc-article-num">3</span>The block size war</h2>

      <p>Between roughly 2015 and 2017 bitcoin had its defining fight, and it is worth knowing because it established the precedent everything since has followed.</p>

      <p>The dispute was over the one-megabyte block limit. One side argued for raising it &mdash; more transactions per block, lower fees, more usable payments. The other argued that larger blocks make running a node more expensive, and that if ordinary people cannot afford to validate, the property that makes bitcoin work is quietly lost.</p>

      <p>Proposal after proposal was made to raise the limit: <strong>BIP 101</strong> (Bitcoin XT), <strong>BIP 109</strong> (Bitcoin Classic), and several others, all now closed. Later came SegWit2x, an agreement among many large companies and most of the mining industry to activate SegWit and then hard fork to two-megabyte blocks.</p>

      <p>By any conventional reading of power, the larger-block side should have won. They had most of the hashpower and most of the major businesses.</p>

      <p>They lost, and the reason is the whole lesson.</p>

      ${pullQuote("Miners produce blocks. They do not decide which blocks count. A block nobody will accept is worthless no matter how much electricity produced it.")}

      <p>Node operators, exchanges and users largely declined to run the new software. A movement formed around a <em>user-activated</em> soft fork &mdash; BIP 148 &mdash; in which nodes would simply begin rejecting blocks that did not signal for SegWit, regardless of what miners preferred. Faced with producing blocks the economy would refuse, the miners moved. SegWit activated. SegWit2x was abandoned weeks before it was due. The larger-block chains that did split away exist, and trade at a small fraction of bitcoin.</p>

      <h2><span class="sc-article-num">4</span>What happened in August 2026</h2>

      <p>If that history feels distant, a much more recent episode demonstrated the same mechanics in a matter of hours.</p>

      <p>The dispute this time was about arbitrary data. Since 2022, inscriptions and token schemes had been using bitcoin's transaction structure to store non-financial data on-chain, which one group regarded as an abuse imposing costs on every node operator and another regarded as a legitimate use of paid-for block space.</p>

      <p><strong>BIP 110</strong>, the Reduced Data Temporary Softfork, proposed doing something about it. For one year it would have capped most new outputs at 34 bytes, limited OP_RETURN to 83, restricted data pushes to 256 bytes, and disabled several Taproot features used to carry large payloads. Coins created before activation were exempt.</p>

      <p>One design choice mattered more than all the technical content: it set an activation threshold of <strong>55%</strong> of blocks signalling, where soft forks conventionally use 95%. That difference is not a detail. A 95% threshold is a way of confirming that essentially nobody objects. A 55% threshold is a decision to proceed while a large minority disagrees &mdash; which is a recipe for exactly one outcome.</p>

      <p>The result was not close:</p>

      ${checklist([
        "Only about <strong>2.5%</strong> of blocks signalled support during the window — far below even the reduced threshold the proposal set itself.",
        "The chain split at block <strong>961,632</strong> on 8 August 2026, when nodes enforcing the new rules rejected a block that did not comply.",
        "The minority chain produced <strong>two blocks in eight hours</strong> and then stalled, while the main chain continued at its usual pace and pulled far ahead.",
        "Roughly <strong>99.85%</strong> of hashpower stayed with the original rules. The BIP was marked closed the following day."
      ])}

      ${cautions([
        "The proposal shipped <strong>without replay protection</strong>, meaning a transaction broadcast on one chain could be valid on the other. Holders who transacted during the split risked moving coins on both chains unintentionally.",
        "The standing advice during any contentious split is simple: <strong>do not transact until it resolves.</strong> Coins sitting still are unaffected by a fork; coins in motion during one are where the accidents happen.",
        "Your keys cover both chains automatically. There is nothing to claim, migrate, or rescue — which is another argument for holding keys rather than an exchange balance."
      ])}

      <p>Whatever one thinks of the underlying grievance &mdash; and it is a real disagreement held sincerely on both sides &mdash; the episode is an unusually clean demonstration. A change with a low threshold, insufficient support, and no broad consensus did not force anything. It produced a two-block chain that stopped.</p>

      ${figureSlot({
        shot: "A railway junction photographed from above where one line continues into the distance while a second peels off and ends abruptly in overgrown gravel a short way along.",
        caption: "Both are real track. Only one of them goes anywhere.",
        ratio: "16 / 9",
        icon: "bi-signpost-split"
      })}

      <h2><span class="sc-article-num">5</span>How successful changes actually happen</h2>

      <p>Set against those failures, the pattern behind the changes that did succeed is fairly consistent.</p>

      ${checklist([
        "<strong>A proposal is published</strong> as a BIP and argued over publicly, often for years. Taproot was discussed for roughly four before activating.",
        "<strong>It is made a soft fork wherever possible</strong>, so nobody is forced to act on a deadline.",
        "<strong>Objections are addressed rather than outvoted.</strong> Since there is no vote, an unresolved technical objection simply remains unresolved, and that is usually fatal.",
        "<strong>Activation is deliberately conservative.</strong> High thresholds, long windows, and mechanisms designed to fail quietly rather than split the chain.",
        "<strong>Adoption is gradual afterwards.</strong> Years after Taproot, plenty of wallets still default to older <a href='address-types.html'>address types</a>, and nothing is broken by that."
      ])}

      <p>The system is strongly biased against change, and that is not a defect. For money whose main claim is that its rules cannot be altered to suit whoever currently holds power, difficulty in changing the rules <em>is</em> the product.</p>

      <h2><span class="sc-article-num">6</span>Where you fit</h2>

      <p>"Running a node is voting" is a slogan that overstates things, so here is the precise version.</p>

      <p>Your node does not cast a ballot. It enforces the rules you chose when you decided which software to run, and it independently refuses anything violating them. Multiply that by everyone doing the same and you get the only thing that has ever actually decided a bitcoin rule dispute: <strong>what the economy will accept.</strong></p>

      <p>If you hold coins through an exchange, your position in that is held by the exchange. If you hold your own keys and validate with your own node, it is held by you. That is the entire mechanism, and it is not a metaphor.</p>

      <h2>The short version</h2>

      <p>There is no authority. Rules are whatever nodes independently enforce, so change requires persuading people to run different software rather than winning a vote. Soft forks tighten rules and stay compatible; hard forks loosen them and split the network unless everyone moves. The block size war established that hashpower does not decide, and BIP 110 demonstrated the same thing in 2026 in under a day.</p>

      ${callout("If you take one thing from this page", "Nobody can change the rules of the bitcoin you hold without your cooperation, because your node enforces them and no block breaking them will ever be accepted by it. That protection is only yours if you are actually running one — otherwise you have delegated it to whoever you are asking.")}`
  },
];

/* ---- derived lookups ---------------------------------------------------- */

/* Three statuses, not two:
     published  a page is written for it
     planned    shown on the hub as a dimmed card -- the next few up
     idea       kept here but rendered nowhere

   The split exists because the roadmap outgrew the delivery: forty "being
   written" cards against six real ones made the library read as a backlog.
   Ideas stay in this file so nothing is lost; they just stop being a public
   promise until they are genuinely next. */
const published = guides.filter(g => g.status === "published");
const listed = guides.filter(g => g.status !== "idea");
const guideBySlug = new Map(guides.map(g => [g.slug, g]));
const productByKey = new Map(guideProducts.map(p => [p.key, p]));

const guideUrl = (guide, base = "") => `${base}guides/${guide.slug}.html`;

const glossaryTagIds = new Map([
  ["bitcoin only", "bitcoin_only"],
  ["bitcoin-only", "bitcoin_only"],
  ["cold storage", "cold_storage"],
  ["entropy", "entropy"],
  ["multisig", "multisig"],
  ["2-of-3 multisig", "multisig"],
  ["open source", "open_source"],
  ["utxo", "utxo"],
  ["withdrawal", "withdrawal"],
  ["2fa", "two_factor_authentication_2fa"],
  ["air-gap options", "air_gap"],
  ["air-gapped", "air_gap"],
  ["qr air-gap", "air_gap"],
  ["descriptor", "descriptor"],
  ["mobile", "mobile_wallet"],
  ["psbt", "psbt"],
  ["hardware wallet selection", "hardware_wallet"],
  ["multisig planning", "multisig"],
  ["test transactions", "transaction"],
  ["microsd", "microsd_backup"],
  ["microsd backup", "microsd_backup"],
  ["nfc", "nfc"],
  ["nfc keycards", "nfc"],
  ["passphrase", "passphrase"],
  ["passphrases", "passphrase"],
  ["phishing", "phishing"],
  ["secure element", "secure_element"],
  ["2× secure elements", "secure_element"],
  ["dual secure elements", "secure_element"],
  ["shamir backup", "shamir_backup"],
  ["reproducible firmware", "reproducible_firmware"],
  ["sim swap", "sim_swap"],
  ["threat model", "threat_model"],
  ["watch-only", "watch_only_wallet"]
]);

const renderGlossaryTag = (label, base = "", extraClass = "") => {
  const termId = glossaryTagIds.get(String(label).trim().toLowerCase());
  const classes = `sc-tag${extraClass ? ` ${extraClass}` : ""}`;
  return termId
    ? `<a class="${classes} sc-tag-link" href="${base}glossary.html#term-${termId}">${label}</a>`
    : `<span class="${classes}">${label}</span>`;
};

/* Rendered inside a product's entry on devices/software/exchanges.

   Only published guides count. A link promising a guide that is still being
   written is worse than no link at all -- it advertises the gap -- so a
   product with nothing ready renders nothing, and the block appears on its
   own the moment that product's first guide ships. Nothing to remember when
   writing guide number forty. */
const productGuideLinks = key => {
  /* Only guides written *about* this product, never ones that merely apply to
     it. Dice entropy lists five devices because the technique works on all of
     them, but "Guides for Krux" pointing at a dice article is a non-answer --
     if a product has no guide of its own, the block should simply not appear.

     Rendered as a plain .sc-text-link, the same weight as the official-site
     link it sits next to in the card footer, right-aligned under the card,
     rather than the full-width orange banner this used to be (an earlier
     pass tried the homepage's big gradient "Explore Guides" button here,
     but next to a plain text link on every card it was too loud). The
     guide's title, level, and length move to the link's aria-label/title so
     the visual stays a one-word "Guide". */
  const hits = published.filter(g => g.productGuide && g.products.includes(key));
  if (!hits.length) return "";
  const items = hits.map(g => {
    const detail = `${g.title} — ${levelLabels[g.level]} · ${g.minutes} min`;
    return `<a class="sc-text-link" href="guides/${g.slug}.html" title="${detail}" aria-label="${detail}">Guide <i class="bi bi-arrow-right" aria-hidden="true"></i></a>`;
  }).join("");

  return `
    <div class="sc-product-guides">${items}</div>`;
};

const formatUpdated = iso => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];
  return `${month} ${d}, ${y}`;
};

/* ---- hub rendering ------------------------------------------------------ */

const guideCard = guide => {
  const planned = guide.status !== "published";
  const featured = guide.hubOrder < 0;
  const cardTitle = guide.category === "devices"
    ? guide.title.replace(/:\s*first-time setup$/i, "")
    : guide.title;
  const meta = [
    `<span><i class="bi bi-hourglass-split" aria-hidden="true"></i> ${guide.minutes} min</span>`,
    planned ? "" : `<span>Updated ${formatUpdated(guide.updated)}</span>`
  ].filter(Boolean).join("");
  const cardProduct = ["devices", "software"].includes(guide.category)
    ? guide.products.map(key => productByKey.get(key)).find(product => product?.image)
    : null;
  const cardMark = cardProduct
    ? `<div class="sc-guide-card-brand sc-guide-card-brand-${cardProduct.key}" aria-hidden="true"><img src="${cardProduct.image}" alt="" width="52" height="52"></div>`
    : `<div class="sc-icon"><i class="bi ${guide.icon}"></i></div>`;

  const inner = `
    <div class="sc-card-body">
      ${featured ? `<span class="sc-guide-card-featured">Recommended</span>` : ""}
      <div class="sc-guide-card-top">
        ${cardMark}
        <div class="sc-guide-card-badges">
          <span class="sc-level sc-level-${guide.level}">${levelLabels[guide.level]}</span>
        </div>
      </div>
      <h3>${cardTitle}</h3>
      <p>${guide.summary}</p>
      <div class="sc-tags">${guide.tags.map(t => renderGlossaryTag(t)).join("")}</div>
      <p class="sc-guide-card-meta">${meta}</p>
      ${planned
        ? `<span class="sc-guide-card-soon">Being written</span>`
        : `<span class="sc-text-link">Read guide <i class="bi bi-arrow-right"></i></span>`}
    </div>`;

  /* data-* attributes are the entire filter contract with site-refresh.js.
     Products are space-joined; an empty string means "applies to everything"
     and is treated as a match against any product answer. */
  const data = [
    `data-guide="${guide.slug}"`,
    `data-guide-category="${guide.category}"`,
    `data-guide-goals="${guide.goals.join(" ")}"`,
    `data-guide-products="${guide.products.join(" ")}"`,
    `data-guide-level="${guide.level}"`,
    `data-guide-status="${guide.status}"`
  ].join(" ");

  return `
    <div class="col-md-6 col-xl-4 sc-guide-cell" ${data}>
      ${planned
        ? `<article class="sc-card sc-guide-card is-planned">${inner}</article>`
        : `<article class="sc-card sc-guide-card${featured ? " is-featured" : ""} sc-path-card-link"><a class="sc-card-cover-link" href="${guideUrl(guide)}" aria-label="Read guide: ${cardTitle}"></a>${inner}</article>`}
    </div>`;
};

const chip = (group, value, label, icon, image = "") => `
  <button type="button" class="sc-chip" data-finder-group="${group}" data-finder-value="${value}" aria-pressed="false">
    ${image
      ? `<span class="sc-chip-logo" aria-hidden="true"><img src="${image}" alt="" width="24" height="24"></span>`
      : icon ? `<i class="bi ${icon}" aria-hidden="true"></i>` : ""}<span>${label}</span>
  </button>`;

/* The finder ships with `hidden` on the section and is revealed by
   site-refresh.js. Without JS the chips would be dead controls sitting above a
   library that is already fully browsable, so it is better that they never
   appear at all -- the sections below work on anchors alone. */
const renderGuideFinder = () => {
  const finderGroups = [
    ["devices", "Hardware"],
    ["software", "Wallets"],
    ["exchanges", "Exchanges"],
    ["collaborative", "Collaborative custody"]
  ];
  const productGroups = finderGroups.map(([cat, label]) => {
    const chips = guideProducts.filter(p => p.category === cat)
      .map(p => chip("product", p.key, p.label, "", p.image)).join("");
    return `<div class="sc-chip-group${cat === "collaborative" ? " sc-chip-group-collaborative" : ""}"><h4>${label}</h4><div class="sc-chips">${chips}</div></div>`;
  }).join("");

  return `
    <section id="finder" class="sc-section sc-section-muted sc-finder-section" hidden data-guide-finder>
      <div class="container">
        <div class="sc-section-head">
          <span class="sc-eyebrow">Guide finder</span>
          <h2>Tell us what you are doing</h2>
          <p>Answer one question or all three. The library below narrows as you go, and you can clear it at any point.</p>
        </div>

        <div class="sc-finder">
          <fieldset class="sc-finder-q">
            <legend><span class="sc-finder-step">1</span> What are you trying to do?</legend>
            <div class="sc-chips">${guideGoals.map(g => chip("goal", g.key, g.label, g.icon)).join("")}</div>
          </fieldset>

          <fieldset class="sc-finder-q">
            <legend><span class="sc-finder-step">2</span> What are you using?</legend>
            <div class="sc-chip-groups">${productGroups}</div>
          </fieldset>

          <fieldset class="sc-finder-q">
            <legend><span class="sc-finder-step">3</span> How far along are you?</legend>
            <div class="sc-chips">${guideLevels.map(l => chip("level", l.key, l.label)).join("")}</div>
          </fieldset>

          <div class="sc-finder-bar" data-finder-bar hidden>
            <p class="sc-finder-count" data-finder-count aria-live="polite"></p>
            <button type="button" class="sc-finder-clear" data-finder-clear><i class="bi bi-x" aria-hidden="true"></i> Clear answers</button>
          </div>

          <div class="sc-finder-pick" data-finder-pick hidden></div>
          <p class="sc-guides-empty" data-guide-none hidden>Nothing matches that combination yet. Clear an answer, or <a href="contact.html">ask for the guide</a> and it moves up the queue.</p>
        </div>
      </div>
    </section>`;
};

const renderGuideSections = () => guideCategories.map((cat, index) => {
  const cards = listed
    .filter(g => g.category === cat.key)
    .sort((a, b) => (a.hubOrder ?? 0) - (b.hubOrder ?? 0))
    .map(guideCard)
    .join("");
  const compare = cat.compare
    ? `<p class="sc-section-head-aside"><a class="sc-text-link" href="${cat.compare[1]}">${cat.compare[0]} <i class="bi bi-arrow-right"></i></a></p>`
    : "";

  return `
    <section id="${cat.key}" class="sc-section${index % 2 ? " sc-section-muted" : ""}" data-guide-section="${cat.key}">
      <div class="container">
        <div class="sc-section-head">
          <span class="sc-eyebrow">${cat.eyebrow}</span>
          <h2>${cat.heading}</h2>
          <p>${cat.blurb}</p>
          ${compare}
        </div>
        <div class="row g-4">${cards}</div>
      </div>
    </section>`;
}).join("");

/* Jump links under the hero. Counts are published-only, since a planned guide
   is not something a visitor can read yet. */
const renderGuideIndexNav = () => {
  const items = guideCategories.map(cat => {
    const n = published.filter(g => g.category === cat.key).length;
    return `<li><a href="#${cat.key}">${cat.label} <span class="sc-guide-nav-count">${n}</span></a></li>`;
  }).join("");
  return `<nav class="sc-guide-nav" aria-label="Guide sections"><ul>${items}</ul></nav>`;
};

/* ---- guide page rendering ----------------------------------------------- */

const renderGuideBody = guide => {
  const category = guideCategories.find(c => c.key === guide.category);
  const products = guide.products.map(k => productByKey.get(k)).filter(Boolean);

  const related = (guide.related || [])
    .map(slug => guideBySlug.get(slug))
    .filter(g => g && g.slug !== guide.slug);

  const productLinks = products.length
    ? `<p class="sc-guide-product-links">${products
        .map(p => `<a class="sc-text-link" href="${p.external ? p.href : `../${p.href}`}"${p.external ? ' target="_blank" rel="noopener"' : ""}>About ${p.label} <i class="bi ${p.external ? "bi-arrow-up-right" : "bi-arrow-right"}"></i></a>`)
        .join("")}</p>`
    : "";

  const relatedSection = related.length ? `
    <section class="sc-section sc-section-muted sc-related-guides">
      <div class="container">
        <div class="sc-section-head"><span class="sc-eyebrow">Keep going</span><h2>Related guides</h2></div>
        <div class="row g-4">${related.map(g => {
          const planned = g.status !== "published";
          const body = `
            <div class="sc-card-body">
              <div class="sc-guide-card-top">
                <div class="sc-icon"><i class="bi ${g.icon}"></i></div>
                <span class="sc-level sc-level-${g.level}">${levelLabels[g.level]}</span>
              </div>
              <h3>${g.title}</h3>
              <p>${g.summary}</p>
              ${planned
                ? `<span class="sc-guide-card-soon">Being written</span>`
                : `<span class="sc-text-link">Read guide <i class="bi bi-arrow-right"></i></span>`}
            </div>`;
          return `<div class="col-md-6 col-xl-4">${planned
            ? `<article class="sc-card sc-guide-card is-planned">${body}</article>`
            : `<a class="sc-card sc-guide-card sc-path-card-link" href="${g.slug}.html">${body}</a>`}</div>`;
        }).join("")}</div>
      </div>
    </section>` : "";

  return `
    <section class="sc-guide-head">
      <div class="container">
        <nav class="sc-breadcrumb" aria-label="Breadcrumb">
          <a href="../guides.html">Guides</a>
          <i class="bi bi-arrow-right" aria-hidden="true"></i>
          <a href="../guides.html#${category.key}">${category.label}</a>
        </nav>
        <span class="sc-eyebrow">${guide.eyebrow || category.eyebrow}</span>
        <h1>${guide.title}</h1>
        <p class="sc-lead">${guide.summary}</p>
        <div class="sc-guide-meta">
          <span class="sc-level sc-level-${guide.level}">${levelLabels[guide.level]}</span>
          <span><i class="bi bi-hourglass-split" aria-hidden="true"></i> About ${guide.minutes} minutes</span>
          <span>Updated ${formatUpdated(guide.updated)}</span>
        </div>
        <div class="sc-tags sc-tags-lg">${guide.tags.map(t => renderGlossaryTag(t, "../")).join("")}</div>
        ${productLinks}
      </div>
    </section>

    <section class="sc-section sc-guide-body">
      <div class="container">
        ${guide.layout === "article"
          ? `<div class="sc-article">${guide.body}</div>`
          : guide.body}
      </div>
    </section>

    <section class="sc-guide-foot">
      <div class="container">
        <div class="sc-guide-next">
          <div class="sc-guide-next-copy">
            <span class="sc-eyebrow">Do not guess</span>
            <h2>Stuck on a step?</h2>
            <p>If the screen in front of you does not match the guide, stop. Review the related walkthroughs or get a second set of eyes before exposing recovery words or approving a transaction.</p>
          </div>
          <div class="sc-hero-actions sc-guide-next-actions">
            <a class="sc-btn sc-btn-primary" href="../guides.html"><span>All Guides</span></a>
            <a class="sc-btn sc-btn-ghost sc-guide-help-btn" href="../contact.html"><span>Get Help</span></a>
          </div>
          <div class="sc-guide-next-mark" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </section>

    ${relatedSection}`;
};

export {
  guides,
  productGuideLinks,
  published as publishedGuides,
  guideCategories,
  guideGoals,
  guideLevels,
  guideProducts,
  guideUrl,
  renderGlossaryTag,
  renderGuideFinder,
  renderGuideSections,
  renderGuideIndexNav,
  renderGuideBody
};

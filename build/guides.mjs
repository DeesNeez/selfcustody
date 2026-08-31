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

/* Finder question 1. `key` is matched against a guide's `goals`.

   setup/harden/learn each match roughly twenty guides, so on their own they
   barely narrow anything -- these three sit alongside them to catch the
   clusters that had no entry point at all: privacy (the largest, and one of
   the most common reasons people arrive), multisig, and inheritance. */
const guideGoals = [
  { key: "setup", label: "Set up a device or wallet", icon: "bi-usb-drive" },
  { key: "withdraw", label: "Get bitcoin off an exchange", icon: "bi-arrow-left-right" },
  { key: "harden", label: "Harden what I already have", icon: "bi-shield-lock" },
  { key: "privacy", label: "Improve my privacy", icon: "bi-window" },
  { key: "multisig", label: "Set up multisig", icon: "bi-diagram-3" },
  { key: "inherit", label: "Plan for inheritance", icon: "bi-people" },
  /* Was "Recover or restore a wallet" and matched two guides, which read as
     broken when picked. Backups are the same job seen from the other end, so
     the label covers both and the backup guides are tagged into it. */
  { key: "recover", label: "Back up or recover", icon: "bi-arrow-counterclockwise" },
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

/* A guide link introduced by its subject's own mark, the way the dice guide
   carries the die face beside its title. Only worth doing where the mark says
   something a bootstrap icon would not -- pointing at the entropy guide from
   the middle of a page about seed generation is exactly that case.

   The mark is a sibling of the anchor rather than a child on purpose:
   .sc-text-link widens its flex gap on hover, and a mark inside would drift
   away from the words it belongs to every time the pointer crossed it. */
const markLink = (href, label, mark = "sc-die-mark") => `
      <p class="sc-mark-link">
        <span class="${mark}" aria-hidden="true"></span>
        <a class="sc-text-link" href="${href}">${label} <i class="bi bi-arrow-right"></i></a>
      </p>`;

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

/* ---- the self-check quiz ------------------------------------------------

   Five questions closing the Quickstart. The markup ships fully readable
   without JavaScript: every explanation is present and visible, and the
   option buttons simply do nothing. site-refresh.js hides the explanations,
   activates the buttons, and keeps score -- so the quiz is an enhancement
   over a readable page rather than the only way to reach the content.

   Correctness lives in a data attribute rather than a script, which means a
   determined reader can view-source the answers. That is the right trade for
   a self-check: the cost of cheating is falling for one of the five documented
   ways people lose bitcoin, and the benefit is that the reasoning survives
   with the script off. */
const quiz = ({ heading, eyebrow, intro, questions }) => {
  const letters = ["A", "B", "C", "D"];

  const items = questions.map((q, qi) => {
    const options = q.options.map((o, oi) => `
          <button class="sc-quiz-option" type="button" data-quiz-option${o.correct ? " data-quiz-correct" : ""}>
            <span class="sc-quiz-letter" aria-hidden="true">${letters[oi]}</span>
            <span>${o.text}</span>
          </button>`).join("");

    return `
      <li class="sc-quiz-item" data-quiz-item>
        <p class="sc-quiz-prompt"><span class="sc-quiz-n" aria-hidden="true">${qi + 1}</span>${q.prompt}</p>
        <div class="sc-quiz-options" role="group" aria-label="Answers to question ${qi + 1}">${options}
        </div>
        <p class="sc-quiz-why" data-quiz-why><strong>Why:</strong> ${q.why}</p>
      </li>`;
  }).join("");

  return `
    <section class="sc-quiz" data-quiz aria-labelledby="sc-quiz-heading">
      <div class="sc-quiz-head">
        <span class="sc-die-mark" aria-hidden="true"></span>
        <div>
          <span>${eyebrow}</span>
          <h2 id="sc-quiz-heading">${heading}</h2>
        </div>
        <strong class="sc-quiz-score" data-quiz-score hidden>0 / ${questions.length}</strong>
      </div>
      <p class="sc-quiz-intro">${intro}</p>
      <ol class="sc-quiz-list">${items}
      </ol>
      <p class="sc-quiz-result" data-quiz-result hidden></p>
    </section>`;
};

/* ---- what the seed splits into ------------------------------------------

   The half of the wallet that can spend, against the half that can only look.
   Drawn because the asymmetry is the whole idea and prose keeps making it
   sound like a permissions setting: the xpub is not a restricted version of
   the private key, it is a different object that derivation only ever
   produces in one direction.

   The flag panel along the bottom is the part the "vault with a glass front"
   metaphor leaves out, and it is deliberately the same orange strip the
   multisig and BIP85 diagrams end on -- all three are about an obligation
   that the reassuring part of the picture does not contain. */
const watchOnlyDiagram = () => {
  return `
    <figure class="sc-figure sc-diagram-figure sc-key-split-figure">
      <svg class="sc-dg-svg sc-key-split" viewBox="0 0 720 470" role="img" aria-labelledby="wo-dg-title wo-dg-desc" preserveAspectRatio="xMidYMid meet">
        <title id="wo-dg-title">What the seed splits into: keys that spend, and keys that only watch</title>
        <desc id="wo-dg-desc">One seed branches into two sharply different capabilities. On the left, the private keys, written as an xprv, stay on the signing device and are the only thing that can authorise a spend. On the right, the matching public keys, the xpub, can be handed to wallet software so it can derive addresses and watch the balance, but never spend. A privacy warning runs across the bottom: anyone holding the xpub can see every address and payment in the wallet.</desc>

        <defs>
          <linearGradient id="wo-seed-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#4a3214"/>
            <stop offset="0.52" stop-color="#312719"/>
            <stop offset="1" stop-color="#20201d"/>
          </linearGradient>
          <linearGradient id="wo-risk-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#2c201e"/>
            <stop offset="0.5" stop-color="#211d1c"/>
            <stop offset="1" stop-color="#191a19"/>
          </linearGradient>
          <linearGradient id="wo-safe-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#1c2b26"/>
            <stop offset="0.5" stop-color="#1b2421"/>
            <stop offset="1" stop-color="#191b1a"/>
          </linearGradient>
          <linearGradient id="wo-privacy-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#332718"/>
            <stop offset="0.58" stop-color="#282218"/>
            <stop offset="1" stop-color="#211e19"/>
          </linearGradient>
          <filter id="wo-card-shadow" x="-12%" y="-18%" width="124%" height="145%">
            <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity="0.3"/>
          </filter>
          <marker id="wo-arrow-risk" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="#d65e40"/></marker>
          <marker id="wo-arrow-safe" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="#35b48a"/></marker>
        </defs>

        <text class="sc-dg-panel-title" x="24" y="30">One secret, two halves</text>
        <text class="sc-dg-panel-sub" x="24" y="52">What stays on the device, and what is safe to hand your phone</text>

        <g class="sc-wo-seed-card" filter="url(#wo-card-shadow)">
          <rect class="sc-wo-seed" x="244" y="72" width="232" height="64" rx="12" fill="url(#wo-seed-fill)"/>
          <circle class="sc-wo-seed-icon" cx="274" cy="104" r="17"/>
          <circle class="sc-wo-seed-dot" cx="268" cy="99" r="2.2"/><circle class="sc-wo-seed-dot" cx="280" cy="99" r="2.2"/>
          <circle class="sc-wo-seed-dot" cx="268" cy="109" r="2.2"/><circle class="sc-wo-seed-dot" cx="280" cy="109" r="2.2"/>
          <text class="sc-wo-seed-title" x="304" y="101">Your seed</text>
          <text class="sc-wo-seed-sub" x="304" y="120">12 or 24 words &middot; the root secret</text>
        </g>

        <path class="sc-wo-root-line" d="M360 136V158"/>
        <circle class="sc-wo-junction" cx="360" cy="158" r="4"/>
        <path class="sc-wo-branch sc-wo-branch-risk" d="M356 158H176V180" marker-end="url(#wo-arrow-risk)"/>
        <path class="sc-wo-branch sc-wo-branch-safe" d="M364 158H544V180" marker-end="url(#wo-arrow-safe)"/>

        <g filter="url(#wo-card-shadow)">
          <rect class="sc-wo-panel sc-wo-panel-risk" x="1" y="184" width="350" height="188" rx="14" fill="url(#wo-risk-fill)"/>
          <path class="sc-wo-panel-rule sc-wo-panel-rule-risk" d="M16 185H336"/>
          <rect class="sc-wo-header-card sc-wo-header-card-risk" x="20" y="198" width="312" height="42" rx="9"/>
          <rect class="sc-wo-badge sc-wo-badge-risk" x="28" y="205" width="28" height="28" rx="8"/>
          <circle class="sc-wo-key-ring" cx="39" cy="219" r="4.5"/>
          <path class="sc-wo-key-stem" d="M43.5 219H50M47 219V223"/>
          <text class="sc-wo-kicker sc-wo-kicker-risk" x="68" y="212">DEVICE ONLY</text>
          <text class="sc-wo-panel-heading" x="68" y="229">Private keys &middot; xprv</text>
          <rect class="sc-wo-capability sc-wo-capability-risk" x="20" y="245" width="312" height="43" rx="8"/>
          <text class="sc-wo-capability-main" x="34" y="264">Can sign and spend</text>
          <text class="sc-wo-capability-sub" x="34" y="281">Never exported &middot; never shown to the phone</text>
          <text class="sc-wo-note" x="20" y="314">Spending produces a signature, not a key.</text>
          <text class="sc-wo-note" x="20" y="330">The signature proves the key exists without</text>
          <text class="sc-wo-note" x="20" y="346">revealing it &mdash; the secret never reaches your</text>
          <text class="sc-wo-note" x="20" y="362">laptop and never crosses the network.</text>
        </g>

        <g filter="url(#wo-card-shadow)">
          <rect class="sc-wo-panel sc-wo-panel-safe" x="369" y="184" width="350" height="188" rx="14" fill="url(#wo-safe-fill)"/>
          <path class="sc-wo-panel-rule sc-wo-panel-rule-safe" d="M384 185H704"/>
          <rect class="sc-wo-header-card sc-wo-header-card-safe" x="388" y="198" width="312" height="42" rx="9"/>
          <rect class="sc-wo-badge sc-wo-badge-safe" x="396" y="205" width="28" height="28" rx="8"/>
          <path class="sc-wo-eye" d="M401 219S405 214 410 214S419 219 419 219S415 224 410 224S401 219 401 219Z"/>
          <circle class="sc-wo-eye-dot" cx="410" cy="219" r="2.4"/>
          <text class="sc-wo-kicker sc-wo-kicker-safe" x="436" y="212">WATCH ONLY</text>
          <text class="sc-wo-panel-heading" x="436" y="229">Public keys &middot; xpub</text>
          <rect class="sc-wo-capability sc-wo-capability-safe" x="388" y="245" width="312" height="43" rx="8"/>
          <text class="sc-wo-capability-main" x="402" y="264">Can derive and watch</text>
          <text class="sc-wo-capability-sub" x="402" y="281">No signature &middot; no spending power</text>
          <text class="sc-wo-note" x="388" y="314">Import it and the software derives every</text>
          <text class="sc-wo-note" x="388" y="330">address, watches the chain, and shows the</text>
          <text class="sc-wo-note" x="388" y="346">balance, history, and a fresh receiving address</text>
          <text class="sc-wo-note" x="388" y="362">whenever you need one.</text>
        </g>

        <g filter="url(#wo-card-shadow)">
          <rect class="sc-wo-privacy" x="1" y="390" width="718" height="68" rx="14" fill="url(#wo-privacy-fill)"/>
          <circle class="sc-wo-privacy-icon" cx="40" cy="424" r="17"/>
          <path class="sc-wo-privacy-eye" d="M30 424S34 419 40 419S50 424 50 424S46 429 40 429S30 424 30 424Z"/>
          <circle class="sc-wo-privacy-eye-dot" cx="40" cy="424" r="2.4"/>
          <text class="sc-wo-privacy-title" x="74" y="415">The xpub cannot steal your bitcoin &mdash; but it can map your life</text>
          <text class="sc-wo-privacy-note" x="74" y="436">Anyone holding it sees every address and every payment, past and future.</text>
          <text class="sc-wo-privacy-note" x="74" y="452">That is a permanent privacy exposure, not a spending risk.</text>
        </g>
      </svg>
      <div class="sc-key-split-mobile" role="img" aria-labelledby="wo-mobile-title wo-mobile-desc">
        <p class="sc-ksm-title" id="wo-mobile-title">One secret, two halves</p>
        <p class="sc-ksm-sub">What stays on the device, and what is safe to hand your phone</p>

        <div class="sc-ksm-seed">
          <span class="sc-ksm-seed-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span><strong>Your seed</strong><small>12 or 24 words &middot; the root secret</small></span>
        </div>
        <span class="sc-ksm-flow" aria-hidden="true">ONE SEED &middot; TWO CAPABILITIES</span>

        <article class="sc-ksm-panel sc-ksm-panel-risk">
          <header><span class="sc-ksm-badge" aria-hidden="true">S</span><span><small>DEVICE ONLY</small><strong>Private keys &middot; xprv</strong></span></header>
          <div class="sc-ksm-capability"><strong>Can sign and spend</strong><span>Never exported &middot; never shown to the phone</span></div>
          <p>Spending produces a signature, not a key. The signature proves the key exists without revealing it, so the secret never reaches your laptop or the network.</p>
        </article>

        <article class="sc-ksm-panel sc-ksm-panel-safe">
          <header><span class="sc-ksm-badge" aria-hidden="true">W</span><span><small>WATCH ONLY</small><strong>Public keys &middot; xpub</strong></span></header>
          <div class="sc-ksm-capability"><strong>Can derive and watch</strong><span>No signature &middot; no spending power</span></div>
          <p>Wallet software derives every address, watches the chain, and shows your balance, history, and a fresh receiving address whenever you need one.</p>
        </article>

        <aside class="sc-ksm-privacy"><span class="sc-ksm-badge" aria-hidden="true">P</span><span><strong>The xpub cannot steal your bitcoin &mdash; but it can map your life</strong><small>Anyone holding it sees every address and payment, past and future. That is a permanent privacy exposure.</small></span></aside>
        <p class="visually-hidden" id="wo-mobile-desc">The seed derives private keys that remain on the signing device and can spend, plus public keys that wallet software can use to watch every address without spending. Sharing the xpub is a permanent privacy exposure.</p>
      </div>
      <figcaption>The xpub opens a window, not the vault. Your phone can count what is inside and hand out deposit slots; opening it still requires a signature from the device.</figcaption>
    </figure>`;
};

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
    `<div class="sc-entropy-row" role="row">
      <strong role="rowheader">${r.long}</strong>
      <span class="sc-entropy-value is-24" role="cell"><b>${r.w24.toFixed(1)}</b><small>bits</small></span>
      <span class="sc-entropy-value is-12" role="cell"><b>${r.w12.toFixed(1)}</b><small>bits</small></span>
    </div>`).join("");

  return `
    <figure class="sc-figure sc-chart-figure">
      <div class="sc-chart-heading">
        <span class="sc-chart-mark" aria-hidden="true"></span>
        <div>
          <span>Bias stress test</span>
          <h3>How much randomness survives?</h3>
        </div>
        <strong>99 rolls keep a wide margin</strong>
      </div>

      <div class="sc-chart-legend">
        <span><i class="sc-chart-key sc-chart-key-24" aria-hidden="true"></i>24 words &middot; 99 rolls</span>
        <span><i class="sc-chart-key sc-chart-key-12" aria-hidden="true"></i>12 words &middot; 50 rolls</span>
        <span><i class="sc-chart-key sc-chart-key-line" aria-hidden="true"></i>Security thresholds</span>
      </div>

      <div class="sc-chart-plot">
        <svg class="sc-chart-svg" viewBox="0 0 720 400" role="img" aria-labelledby="entropy-chart-title entropy-chart-desc" preserveAspectRatio="xMidYMid meet">
          <title id="entropy-chart-title">Randomness retained as a die becomes less fair</title>
          <desc id="entropy-chart-desc">A 24-word seed from 99 rolls stays between 256 and 198 bits across every scenario. A 12-word seed from 50 rolls starts at 128 bits and falls to 100 bits with a badly skewed die, dropping below both the 128-bit and 112-bit thresholds.</desc>
          <defs>
            <linearGradient id="entropy-bar-24" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#ff9f24"/>
              <stop offset="1" stop-color="#c75f00"/>
            </linearGradient>
            <linearGradient id="entropy-bar-12" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#4dcc9f"/>
              <stop offset="1" stop-color="#238564"/>
            </linearGradient>
          </defs>
          ${grid}
          ${thresholds}
          <line class="sc-chart-axis" x1="${L}" y1="${B}" x2="${R}" y2="${B}"/>
          <text class="sc-chart-axis-text" x="${L - 10}" y="${B + 4}" text-anchor="end">0</text>
          ${bars}
          ${xLabels}
          <text class="sc-chart-axis-title" x="14" y="176" transform="rotate(-90 14 176)" text-anchor="middle">Bits of randomness</text>
        </svg>
      </div>

      <figcaption class="sc-chart-summary"><strong>What it shows</strong><span>Even a die skewed far beyond anything you would own leaves a 24-word wallet with more randomness than a perfect 12-word one. The 12-word bar, by contrast, starts level with the 128-bit mark and loses ground straight away.</span></figcaption>

      <div class="sc-entropy-grid" role="table" aria-label="Bits of randomness by die fairness">
        <div class="sc-entropy-head" role="row">
          <span role="columnheader">Die fairness</span>
          <span class="is-24" role="columnheader">24 words <small>99 rolls</small></span>
          <span class="is-12" role="columnheader">12 words <small>50 rolls</small></span>
        </div>
        <div role="rowgroup">
          ${rows}
        </div>
      </div>
    </figure>`;
};

/* ---- how the entropy methods trade against each other --------------------

   A table rather than a chart, because none of these cells is a quantity --
   they are three fixed questions asked of six methods, and the answer to each
   is a short phrase. Forcing that into bars would invent a scale nobody has
   measured.

   The argument the table has to carry is that no row wins. Every method is
   excellent at something and pays for it somewhere else, and the dice-hashed
   row -- the one this guide teaches -- is the only one that is merely fine at
   all three. That reads off the colour band instantly and takes a paragraph
   to say in prose, which is the test for whether a table is earning its
   space.

   Tier colour is decoration, never the message: every cell states its answer
   in words, so the table survives being read aloud, printed in mono, or seen
   by someone who cannot separate the green from the red. */
const TRADEOFF_TIERS = [
  ["is-free", "nothing to pay here"],
  ["is-minor", "a small cost"],
  ["is-cost", "a real cost"],
  ["is-weak", "where the method gives up the most"]
];

const TRADEOFF_GROUPS = [
  {
    label: "The device makes the number",
    rows: [
      {
        method: "Built-in generator",
        note: "the default almost everywhere",
        cells: [
          ["is-free", "Nothing to gather"],
          ["is-free", "Instant, automatic"],
          ["is-weak", "The input, not at all"]
        ]
      },
      {
        method: "Camera noise",
        note: "SeedSigner photographs a scene",
        cells: [
          ["is-free", "Nothing to gather"],
          ["is-free", "Point, look, accept"],
          ["is-cost", "Nothing outside the device"]
        ]
      }
    ]
  },
  {
    label: "You make the number, the device converts it",
    rows: [
      {
        method: "Dice, device converts",
        note: "what this guide covers",
        cells: [
          ["is-minor", "One die"],
          ["is-minor", "99 rolls, typed in"],
          ["is-minor", "Every word, with effort"]
        ]
      }
    ]
  },
  {
    label: "You make the number and the words",
    rows: [
      {
        method: "Coin flips",
        note: "11 flips per word",
        cells: [
          ["is-minor", "Coins and a word list"],
          ["is-cost", "Binary, by hand, 253 times"],
          ["is-free", "Only the checksum word"]
        ]
      },
      {
        method: "Dice on a worksheet",
        note: "rolls straight to words",
        cells: [
          ["is-minor", "Dice and a worksheet"],
          ["is-weak", "Rolls, re-rolls, lookups"],
          ["is-free", "Only the checksum word"]
        ]
      },
      {
        method: "Drawing paper slips",
        note: "pull words from a bag",
        cells: [
          ["is-weak", "Cut out 2048 slips"],
          ["is-minor", "Draw, replace, type in"],
          ["is-free", "Only the checksum word"]
        ]
      }
    ]
  }
];

const methodTradeoffs = () => {
  const legend = TRADEOFF_TIERS.map(([cls, label]) =>
    `<span><i class="sc-tradeoff-key ${cls}" aria-hidden="true"></i>${label}</span>`).join("");

  const groupClasses = ["is-device", "is-conversion", "is-manual"];
  const groups = TRADEOFF_GROUPS.map((group, index) => {
    const rows = group.rows.map(r => {
      const labels = ["Before you start", "The work itself", "What you can check"];
      const cells = r.cells.map(([cls, text], cellIndex) =>
        `<span class="sc-tradeoff-cell ${cls}" role="cell" data-label="${labels[cellIndex]}"><small>${labels[cellIndex]}</small>${text}</span>`).join("");
      return `<article class="sc-tradeoff-row" role="row"><div class="sc-tradeoff-method" role="rowheader"><strong>${r.method}</strong><small>${r.note}</small></div>${cells}</article>`;
    }).join("");
    return `<div class="sc-tradeoff-group ${groupClasses[index]}" role="rowgroup"><h4>${group.label}</h4>${rows}</div>`;
  }).join("");

  return `
    <figure class="sc-figure sc-chart-figure sc-tradeoff-figure">
      <div class="sc-chart-heading">
        <span class="sc-chart-mark" aria-hidden="true"></span>
        <div>
          <span>Six ways to make the number</span>
          <h3>What each one costs you</h3>
        </div>
        <strong>No row wins outright</strong>
      </div>

      <div class="sc-chart-legend sc-tradeoff-legend">${legend}</div>

      <div class="sc-tradeoff-grid" role="table" aria-label="Six methods of generating wallet entropy, compared by preparation, work, and verifiability">
        <div class="sc-tradeoff-head" role="row">
          <span role="columnheader">Method</span><span role="columnheader">Before you start</span><span role="columnheader">The work itself</span><span role="columnheader">What you can check</span>
        </div>
        ${groups}
      </div>

      <figcaption class="sc-chart-summary"><strong>What it shows</strong><span>Read down the middle row rather than across it. Dice-with-conversion is the only method carrying no green and no red &mdash; beaten on convenience by the top two and on verifiability by the bottom three, and beaten badly by none of them.</span></figcaption>
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

        ${box(35, 186, 190, 58, "Everyday wallet", "index 0' &middot; 12 words")}
        ${box(265, 186, 190, 58, "Savings wallet", "index 1' &middot; 24 words")}
        ${box(495, 186, 190, 58, "Handed to a niece", "index 2' &middot; 12 words")}

        <text class="sc-dg-note" x="360" y="268" text-anchor="middle">&hellip; and index 3', 4', 5', indefinitely, all from the same backup</text>

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
    related: ["quickstart", "what-not-to-normalize", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">"Be your own bank" is a good slogan and a bad description. It gets the freedom right and leaves out the job description &mdash; because a bank is not just a place that holds money. It is a large organisation performing a dozen unglamorous tasks on your behalf, most of which you have never had to think about.</p>

      <p>Take custody of your own bitcoin and those tasks do not disappear. They transfer. This page is an inventory of exactly which ones, so you can decide with your eyes open rather than discovering them one at a time.</p>

      ${figure({
        src: "../assets/img/owning-your-bitcoin-key.jpg",
        alt: "A single key on a plain surface, shot from above, with a long hard shadow",
        caption: "The whole proposition, and the whole problem, in one object.",
        width: 1300,
        height: 726
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

      ${callout("The next step is the path itself", `<a href="quickstart.html">Start Here</a> turns the principle into four practical steps: create, back up, test recovery, and receive a small amount.`)}`
  },
  {
    slug: "quickstart",
    aliases: ["complete-path"],
    hubOrder: -1,
    category: "fundamentals",
    products: [],
    eyebrow: "First steps",
    title: "Intro to Self Custody",
    summary: "Create a wallet, back it up, prove you can recover it, and only then receive bitcoin.",
    level: "beginner",
    minutes: 32,
    goals: ["learn", "setup", "withdraw"],
    tags: ["Overview", "Start here"],
    icon: "bi-signpost-split",
    updated: "2026-08-25",
    status: "published",
    related: ["what-not-to-normalize", "choosing-your-first-setup", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Self custody means one specific thing: the secret that authorises spending your bitcoin exists only where you put it. No company holds a copy &mdash; which is why no company can freeze it, lose it in a bankruptcy, or hand it over on request, and why nobody can help you if you destroy it. Both halves of that sentence are the job.</p>

      <p>This is the foundation article for everything else on this site. It assumes nothing except that you have bought some bitcoin, or are about to. It is longer than a checklist because a checklist is easy to follow, and easy to follow into a hole &mdash; the reasoning underneath each step is what tells you what to do when the screen in front of you does not match the instructions.</p>

      <p>There is a version of this that takes an afternoon and a version that takes six months. The difference is not intelligence or technical skill. It is whether you moved money before you understood what you were doing with it.</p>

      ${figure({
        src: "../assets/img/quickstart-desk.jpg",
        alt: "A desk laid out for a setup session: a boxed hardware wallet, a recovery-phrase card and pen, a closed laptop, and a cup of coffee",
        caption: "Set aside a proper block of time. This is not a thing to do between meetings.",
        width: 1375,
        height: 768
      })}

      <h2 id="what-you-are-building">What you are actually building</h2>

      <p>Strip away the hardware and the vocabulary and a bitcoin wallet is one enormous random number, plus software that knows what to do with it. That number is called the <strong>seed</strong>, and it is written out as twelve or twenty-four ordinary English words so that a human being can copy it down without making a mistake. Every key, every address, and every signature your wallet will ever produce is derived from it, in a fixed and publicly documented order.</p>

      <p>Three consequences follow, and between them they set the shape of everything below.</p>

      ${checklist([
        "<strong>The words are the wallet.</strong> Not the device, not the app, not the brand. Any compatible wallet fed the same words rebuilds the same keys and finds the same coins.",
        "<strong>Anyone holding the words holds the bitcoin</strong> &mdash; immediately, permanently, and without needing anything else you own.",
        "<strong>Nobody can reissue them.</strong> There is no recovery department, no reset link, and no support line with a copy on file."
      ])}

      <p>So the four stages below are not four chores to get through. They are one idea, taken in order: <strong>make that number well, record it durably, prove the record works, and only then put money behind it.</strong></p>

      <p>The rule that makes it work: <strong>do not move on until you can explain the outcome of the current stage in your own words</strong>. Not recite it &mdash; explain it, to yourself, without looking. Every expensive mistake in bitcoin custody is someone who skipped that check because they were nearly sure.</p>

      <h2 id="create-your-wallet"><span class="sc-article-num">1</span>Create your wallet</h2>

      <p>This stage has four parts, and only the first is about shopping. Begin with the simplest setup that fits what you are protecting: complexity can come later, once you have proven you can operate and recover a basic wallet.</p>

      <h3>Pick a shape before you pick a product</h3>

      <p>People stall here for weeks comparing devices, which is a strange place to stall &mdash; the whole time, the bitcoin is sitting on an exchange, which is the one option they had already decided against. The choice is not really between products. It is between shapes: how many keys, on what kind of hardware, in how many places.</p>

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

      <p>Most people should start with the simplest suitable option and move through them slowly over years &mdash; not pick the most complex one because it sounds the most secure. Multisig removes the single point of failure, which is real and valuable. It also multiplies the number of things you must back up, and adds a new category of loss: a setup that nobody, including you, can actually restore. Reach for it after you have demonstrated you can recover a simple wallet, not before.</p>

      <h3>You do not have to buy a hardware wallet</h3>

      <p>Dedicated signing hardware is the recommendation on most of this site, and for good reason: it keeps the key away from the machine that reads your email. But it is a recommendation, not an entry requirement, and treating it as one keeps people custodial for another year while they save up and read reviews. There are several honest routes in.</p>

      ${checklist([
        "<strong>A phone wallet, today.</strong> Free, five minutes, and it teaches you what an address, a fee, and a backup actually are while the amount at stake is small. The keys live on an internet-connected device, so keep the balance to something you would be annoyed rather than devastated to lose.",
        "<strong>A dedicated signing device.</strong> The usual answer for savings, and the one the rest of this site assumes by default. Keys are generated on the device and never touch a general-purpose computer.",
        "<strong>Hardware you build yourself.</strong> Open projects like SeedSigner and Krux run on inexpensive off-the-shelf parts and sign by QR code, so nothing is ever plugged in. More assembly, no supply chain to trust, and no purchase that links your name to a bitcoin product.",
        "<strong>Bitcoin Core on a computer you control.</strong> The reference implementation ships with a wallet of its own &mdash; see the note below.",
        "<strong>An old phone or laptop, kept permanently offline.</strong> A workable cold setup, and a genuinely awkward one to operate safely. Worth knowing it exists; worth attempting only once the rest of this page is second nature."
      ])}

      <p>None of these is the wrong answer. The wrong answer is leaving the coins on an exchange for another eighteen months while you decide.</p>

      ${callout("A note on Bitcoin Core", `<a href="why-run-a-node.html">Running your own node</a> means you verify the rules yourself instead of asking somebody else's server what your balance is, and Bitcoin Core includes a perfectly usable wallet. Two things to know before you pick it. Its keys sit on the computer, so it is a hot wallet unless you pair it with a signing device. And it does not hand you twelve words &mdash; a Core wallet is described by a <a href="../glossary.html#term-descriptor">descriptor</a> containing an extended private key, and the backup is a file rather than a phrase. That is a good backup, but it is not the one the rest of this page describes, and it restores into other descriptor-aware software rather than by typing words into a device. Many people run Core as their node and keep the keys elsewhere, which is the best of both.`)}

      <p><a class="sc-text-link" href="choosing-your-first-setup.html">Choosing your first setup <i class="bi bi-arrow-right"></i></a> &nbsp; <a class="sc-text-link" href="../devices.html">Compare hardware <i class="bi bi-arrow-right"></i></a> &nbsp; <a class="sc-text-link" href="../software.html">Compare wallet software <i class="bi bi-arrow-right"></i></a></p>

      <h3>Where the seed comes from is the most important decision on this page</h3>

      <p>Whatever you chose above, the moment that decides the security of the whole wallet is a few seconds long and almost invisible: the device offers to generate the seed for you, you press yes, and twelve words appear.</p>

      <p>That step is the one part of the process you cannot check. A random number generator is a black box by construction. Good randomness and bad randomness look identical from the outside &mdash; there is no test you can run on twelve words to find out whether they came from a well-seeded generator, a subtly broken one, or a list somebody prepared in advance. If the number is weak or known, nothing you do afterwards helps. The backup is perfect, the recovery test passes, and the coins leave anyway.</p>

      <p>The fix is not to suspect a particular manufacturer. It is to remove the question from the table: <strong>supply the randomness yourself, from something physical you can watch</strong>. Do that and the quality of the device's generator stops mattering, because it is no longer the thing deciding your wallet.</p>

      ${figure({
        src: "../assets/img/quickstart-dice.jpg",
        alt: "Two white dice caught in mid-air above a green felt runner on a scarred wooden table, beside a whisky glass, a brass oil lamp and a leather notebook",
        caption: "A physical process you can watch, in a room you control. That is the entire argument for doing it this way.",
        width: 1376,
        height: 768
      })}

      <p>Most serious signing devices accept this directly. You roll, you type the results in, and the device hashes what you gave it into a seed &mdash; and the better implementations mix your rolls with their own <a href="../glossary.html#term-entropy">entropy</a>, so you are never worse off than if you had let it choose. Ninety-nine rolls of an ordinary six-sided die produce a full-strength twenty-four-word seed.</p>

      <p>Dice are the common route, not the only one:</p>

      ${checklist([
        "<strong>A coin.</strong> One flip is exactly one binary digit, so 256 flips is a 256-bit seed. Slower and more tedious than dice, and it needs nothing but a coin and patience.",
        "<strong>Dice with more faces.</strong> Powers of two are the tidiest: a sixteen-sided die is exactly four binary digits a roll, an eight-sided die exactly three. A twenty-sided die carries more randomness per roll than a D6 but does not divide cleanly into binary, so it needs a discard rule &mdash; one more thing to get wrong at two in the morning.",
        "<strong>Casino dice.</strong> Precision-made and sharp-edged rather than rounded, so the bias is smaller than a board-game die. Nice to have, and not remotely necessary &mdash; the maths tolerates a badly skewed die far better than most people expect.",
        "<strong>Whatever you use, do not re-roll a result you dislike.</strong> Editing the randomness is the one way to actually damage it. Roll on a hard flat surface, record what lands, and keep going."
      ])}

      ${cautions([
        "Do not use a website, a phone app, or a spreadsheet to generate the number. That is trading a black box you own for one you do not.",
        "Do not invent the words yourself, or pick a phrase you find memorable. Human-chosen seeds are guessed at scale, automatically, and emptied within minutes.",
        "Do not shorten the roll count because it is probably enough. It is one afternoon, once, for the life of the wallet."
      ])}

      ${markLink("dice-entropy.html", "Roll the dice: generating your own entropy")}

      <p>Whichever way you make the number, there is one thing worth knowing before you start: <strong>there is no standard for turning rolls into words</strong>. COLDCARD, SeedSigner and Krux hash the digits; Keystone rewrites every 6 to a 0 first and wants 100 rolls; BlueWallet packs bits without hashing at all. The same rolls produce unrelated wallets on different devices, which is why the recovery words are the backup and the column of rolls in your notebook is not. If you want to see that for yourself, <a href="../entropy.html">Entropy Workshop</a> converts a set of test rolls and shows you the wallet they land on.</p>

      <h3>What the words actually are</h3>

      <p>Worth ninety seconds, because it explains several things that otherwise look arbitrary. The twelve or twenty-four words come from a standard called <a href="../glossary.html#term-bip39">BIP39</a>, which maps a random number onto a fixed list of 2,048 English words. Each word therefore carries eleven bits. Twenty-four words is 264 bits: 256 bits of actual seed plus an eight-bit <a href="../glossary.html#term-checksum">checksum</a>. Twelve words is 132 bits: 128 of seed plus four of checksum.</p>

      <p>That checksum is quietly one of the most useful things in the design. Copy a word down wrong and the phrase is usually rejected outright, rather than silently opening a different, empty wallet and leaving you to work out what happened.</p>

      <p>From the seed, your wallet derives a master private key &mdash; written out as an <code>xprv</code> &mdash; and a matching master public key, the <a href="../glossary.html#term-xpub">xpub</a>. Every key in the wallet hangs off that root, addressed by a derivation path, which is why one backup can restore an unlimited number of addresses. It is also why the next section matters.</p>

      ${callout("Not every wallet uses words, and words do not cross schemes", `BIP39 is the most common format, not the only one. Bitcoin Core backs up a descriptor with an <code>xprv</code> in it. Some Trezor models offer SLIP39 Shamir shares instead of a single phrase. Electrum has a seed format of its own. Words written under one scheme will not restore under another, so record which wallet produced them. The formats, the extended-key types, and the derivation paths behind them deserve an article of their own &mdash; for now, <a href="keys-addresses-utxos.html">keys, addresses and UTXOs</a> covers the model and <a href="how-wallets-find-coins.html">how a wallet finds your coins</a> covers the branch problem.`)}

      <h3>Pair it with wallet software, even if the keys are cold</h3>

      <p>A signing device is deliberately stupid. It has a small screen, no idea what the current block height is, and no way to look anything up. On its own it can tell you almost nothing about your money.</p>

      <p>The wallet software is the other half. It watches the blockchain, finds every payment made to you, adds them up, keeps labels and history, estimates fees, and builds the transactions your device will sign. You want it even for a wallet you intend never to touch &mdash; a balance you cannot see is a balance you will start checking on a block explorer instead, which is worse for your privacy and worse for your nerves.</p>

      <p>What you give it is not the seed. It is the <strong>xpub</strong>: one long line of text from which the software can derive every address the wallet will ever use, watch for payments to all of them, and show you the result &mdash; with no ability whatsoever to move a single satoshi. This is called a <a href="../glossary.html#term-watch_only_wallet">watch-only wallet</a>.</p>

      ${pullQuote("A vault with a glass front. You can count what is inside, watch deposits land, and hand out deposit slots all day. Opening it takes the key, and the key is in your other hand.")}

      ${watchOnlyDiagram()}

      <p>When you do want to spend, the two halves work together and the seed still never travels: the software builds an unsigned transaction &mdash; a <a href="../glossary.html#term-psbt">PSBT</a> &mdash; the device displays it, you approve it on the device's own screen, and the software broadcasts the signed result. <a href="sparrow-first-wallet.html">Sparrow</a> is the usual desktop answer; <a href="bluewallet-watch-only.html">BlueWallet</a>, Cove and Nunchuk do the same job from a phone.</p>

      <p>One thing to be clear-eyed about: your xpub is not a spending risk, but it is not nothing either. Anyone holding it sees every address you will ever use and every payment you ever receive, forever. Treat it as private information rather than as a public identifier.</p>

      <h3>Doing it</h3>

      ${checklist([
        "Download wallet software only from the maker's official site or the app-store listing linked from it. Verify the release signature where the maker publishes one.",
        "Buy hardware direct from the manufacturer. Never second-hand, never from a marketplace listing, never from a reseller you found through an advertisement.",
        "Inspect the packaging and run the maker's own authenticity check before going any further.",
        "Generate a completely new wallet on the device or in the app. Never use recovery words supplied in the box, printed on an enclosed card, or given to you by another person &mdash; there is no legitimate reason for a wallet to arrive with a seed already in it.",
        "Supply your own entropy if the device supports it, and take the extra twenty minutes to do it properly.",
        "Note the wallet fingerprint and the first receiving address. Neither is secret, and they are what you will check against in stage three.",
        "Pair a watch-only wallet using the xpub, and keep the seed off every internet-connected machine.",
        "Keep the wallet empty for now. Creating it is not the same as proving you can recover it."
      ])}

      <p><strong>Outcome:</strong> you have created a new, empty wallet whose seed you know the origin of, and you can see it from software without being able to spend from that software.</p>

      <h2 id="back-it-up"><span class="sc-article-num">2</span>Back it up</h2>

      <p>Your recovery words are the only truly irreplaceable part of the setup. The device can be replaced with an identical one, or a different brand entirely. The software can be reinstalled. The words cannot be reissued by anybody, at any price. Everything in this stage is worth doing slowly.</p>

      ${checklist([
        "Write the words offline, in order, by hand, on the card the device came with or on plain paper. Do not photograph them, email them, type them into a computer, or store them in a password manager.",
        "Number every word. Order is part of the secret, and an unnumbered list is a puzzle you have set for your future self.",
        "Complete the wallet's confirmation step when it prompts you. It catches transcription errors while they are still free to fix.",
        "Check every word is legible to somebody who is not you and who is under stress. Your handwriting is the failure mode here, not your memory."
      ])}

      ${figure({
        src: "../assets/img/quickstart-seed-words.jpg",
        alt: "A close-up of a hand writing a recovery word onto a numbered backup card, several words already filled in above it",
        caption: "By hand, offline. This is the step with no undo.",
        width: 1300,
        height: 725
      })}

      <h3>Paper is where you start, not where you finish</h3>

      <p>The awkward property of backups is that the situations which make you reach for one are the same situations that destroy paper. A card in a drawer is a perfectly good backup right up until the house is on fire, under water, or being emptied by somebody else.</p>

      <p>And paper does not need a disaster to fail. Ink fades in a warm drawer. Damp and mould get into a basement or a garage. A burst pipe two floors up reaches it. Somebody helping you move house sees an unlabelled card of random words and throws it out. None of these announce themselves &mdash; you find out at the moment you go looking.</p>

      <p>A stamped stainless steel plate closes most of that gap in about an hour. Common stainless steels melt far above the temperatures a house fire reaches, and steel does not care about water, damp, or thirty years in a box. Titanium is higher still. Avoid aluminium, which ordinary structure fires can exceed.</p>

      <p>Two things metal is not. It is not theft protection &mdash; a plate is exactly as readable to whoever finds it as the paper was, and rather more durable in their hands. And it is not an excuse to keep only one copy. Durability and secrecy are separate problems, and location is still the whole of your defence on the second one.</p>

      ${callout("The shortcut that halves the work", `Every word in the BIP39 list is uniquely identified by its first four letters &mdash; no two words share them. A plate recording <strong>ABAN</strong> is exactly as complete as one recording <strong>ABANDON</strong>. Four characters per word roughly halves both the stamping and the number of chances to mis-strike. Words shorter than four letters are written in full, and the shortcut applies to BIP39 wordlists only.`)}

      <p><a class="sc-text-link" href="seed-backup-metal.html">Durable seed backups <i class="bi bi-arrow-right"></i></a></p>

      <h3>Write down more than the words</h3>

      <p>The words restore the keys. Finding the coins also needs to know which branch of the key tree to walk down, and a wallet restored a decade from now &mdash; or set up with anything other than the current default &mdash; may not guess correctly. Keep a short, separate note recording:</p>

      ${checklist([
        "How many words there are, and which wallet or device produced them.",
        "Whether a passphrase is in use. Not the passphrase, and not in the same place &mdash; just the fact that one exists, so your heirs are not restoring an empty wallet and concluding the bitcoin was a story.",
        "The script type or derivation path, and the full wallet descriptor if you have one. Essential for multisig, and cheap insurance for everything else.",
        "The master fingerprint and the first receiving address, so a future restore has something to check itself against.",
        "The date, and where the other copy lives."
      ])}

      <p>None of that is secret on its own, and none of it can spend anything. It is the difference between a restore that works and a restore that shows a balance of zero and no explanation.</p>

      <h3>Where it lives</h3>

      ${checklist([
        "Store the device and the backup separately, so one theft, fire, or flood cannot take both.",
        "Consider a second copy in a genuinely different building. Two copies in one house is one copy.",
        "Think about who could find it accidentally, and who could find it deliberately. Those are different lists.",
        "Never enter the words into a website, a support chat, a recovery tool, or a form. There is no legitimate process that requires another person to see them."
      ])}

      <div class="sc-callout mt-4">
        <h3>A passphrase, in one paragraph</h3>
        <p>A BIP39 <a href="../glossary.html#term-passphrase">passphrase</a> is an extra word or sentence added on top of the seed. It is not a password on your wallet &mdash; it is a switch that selects a different wallet entirely. Every possible passphrase is valid, so a forgotten or mistyped one does not lock you out with an error: it silently opens a different, empty wallet, and there is no message telling you which case you are in. That is genuinely useful, because a found backup without the passphrase reaches nothing. It is also a second irreplaceable secret, and it deserves its own article rather than a footnote here. Do not add one during your first setup. <a href="passphrase-setup.html">BIP39 passphrases, and when not to use one</a> is the full treatment.</p>
      </div>

      <p><strong>Outcome:</strong> the words exist somewhere durable and offline, the device and the backup are not in the same place, and you have recorded the handful of non-secret details a future restore will need.</p>

      <h2 id="test-your-recovery"><span class="sc-article-num">3</span>Test your recovery</h2>

      <p>A backup you have never tested is not a backup. It is an assumption &mdash; and if you never test it deliberately, the test still happens, at a moment you did not choose.</p>

      <p>Most advice stops at "follow the manufacturer's instructions", which is not enough, because the device is not the thing under test. <strong>The card on your table is the thing under test.</strong> A real recovery drill starts from those words and nothing else, and finishes with a specific value you can compare.</p>

      <h3>First, decide what a pass looks like</h3>

      <p>Before you touch anything, write down two things from the wallet you already have:</p>

      ${checklist([
        "<strong>The master fingerprint</strong> &mdash; eight hexadecimal characters, shown by most devices under a settings or advanced menu, and by your wallet software next to the key.",
        "<strong>The first receiving address, in full</strong> &mdash; every character, including the prefix."
      ])}

      <p>Neither is secret, and neither can spend anything. Without one of them the drill has no pass condition, and "it seemed to restore fine" is not a result.</p>

      <h3>Then pick the method that matches what you own</h3>

      <p>All three prove something. They differ entirely in what happens if the backup turns out to be wrong.</p>

      <p><strong>A second device, wiped.</strong> The most thorough version and the safest one. Take any compatible signing device &mdash; a spare, a second unit, a borrowed one you will wipe afterwards &mdash; reset it, and enter the words from your card. Only from the card. Then compare the fingerprint and the first address. If they match, your handwriting reproduces the wallet, and your original device was never touched. Wipe the second device again when you are done: a spare quietly holding a live copy of your seed is a new problem, not a spare.</p>

      <p><strong>The device's built-in backup check.</strong> Most devices offer one, called something like <em>verify backup</em>, <em>dry-run recovery</em>, or <em>seed check</em>. You type the words back in and the device compares them against the seed it already holds, without erasing anything. It is fast, completely safe, and it will tell you plainly if a word is wrong. Its limit is worth knowing: it proves the words match <em>this device's</em> seed. It does not prove they rebuild the wallet anywhere else, and it will not catch a wrong derivation path or a passphrase you have misremembered.</p>

      <p><strong>Wipe your only device and restore from the card.</strong> This is the real thing &mdash; the full chain, end to end, with nothing held in reserve. It is also the one method that turns a bad backup into an immediate and permanent loss. There is exactly one safe moment for it, and it is now, while the wallet is empty. Reset the device to factory settings, enter the words, and watch the same wallet reappear. Done today it costs you twenty minutes. Done after the wallet has a balance, you are betting that balance on your own handwriting.</p>

      <p>That last point is the entire reason this stage sits before stage four rather than after it. Prefer a second device if you have one, the built-in check if you do not, and the full wipe-and-restore while there is still nothing to lose.</p>

      ${figure({
        src: "../assets/img/recovery-test-drill-two-devices.jpg",
        alt: "Two hardware wallets side by side on a desk with a seed card between them",
        caption: "A restore you have actually performed is worth more than any amount of care taken earlier.",
        width: 1300,
        height: 726
      })}

      <h3>What counts as a pass</h3>

      ${checklist([
        "The restored wallet reports the same master fingerprint.",
        "The first receiving address matches character for character, prefix included. A different prefix means a different script type, not a different wallet &mdash; fixable, but you need to know before you fund it.",
        "The balance is what you expect it to be, which at this stage is zero.",
        "If you used a passphrase, run the check twice: once without it, confirming you land in the empty base wallet, and once with it, confirming you land in the right one.",
        "Wipe whatever you restored onto, unless it is now a key in its own right."
      ])}

      ${cautions([
        "If anything does not match, stop. Do not fund the wallet. Re-read the card for transposed or misread words &mdash; and if it cannot be reconciled, generate a fresh seed and start stage one again. That is an annoying afternoon, not a loss.",
        "The words go into a signing device's own keypad or screen, and nowhere else. Not a website, not a laptop, not a spreadsheet, not a support chat, however official it looks."
      ])}

      <p><a class="sc-text-link" href="recovery-test-drill.html">The full recovery drill <i class="bi bi-arrow-right"></i></a></p>

      <p><strong>Outcome:</strong> you have rebuilt this wallet from the backup alone and confirmed it produced the same fingerprint and the same first address.</p>

      <h2 id="receive-bitcoin"><span class="sc-article-num">4</span>Receive bitcoin</h2>

      <p>Your wallet exists, its backup is protected, and recovery has been proven. Now check the receiving path with an amount that does not matter. Treat this as a test, not a transfer.</p>

      ${checklist([
        "Create a fresh receiving address in your wallet software.",
        "With a hardware wallet, display the same address on the device screen and compare it to the one on the computer. The device is the trustworthy screen; the computer is not.",
        "Send a small amount from an exchange or another wallet, and wait for it to confirm.",
        "Confirm it arrived in the wallet you just recovered, watching from your own software rather than a public block explorer.",
        "Understand the platform fee, the withdrawal fee, and the network fee before approving. They are three different charges and only one of them is bitcoin's."
      ])}

      <p>The reason for checking the address on the device rather than the computer is specific rather than superstitious. Malware that swaps a bitcoin address on the clipboard is common, cheap, and entirely automated &mdash; you copy your address, and something else pastes. The device screen is drawn by the device itself, so an address that matches on both was not swapped in transit.</p>

      <p>Once the test amount lands, send some of it back out again. Receiving proves the address. Spending proves the whole loop: that the device signs, that you can approve it, and that the software broadcasts. That is the point at which the wallet is genuinely working rather than merely populated.</p>

      <p><a class="sc-text-link" href="exchange-withdrawal.html">Withdraw from an exchange <i class="bi bi-arrow-right"></i></a> &nbsp; <a class="sc-text-link" href="test-transaction.html">Send a test transaction <i class="bi bi-arrow-right"></i></a></p>

      <p><strong>Outcome:</strong> a small amount of bitcoin has arrived in a wallet you created, backed up, and proved you can recover &mdash; and you have moved some of it out again.</p>

      ${quiz({
        heading: "Did it land?",
        eyebrow: "Five questions",
        intro: "One per stage. They are not trick questions, but they are not giveaways either &mdash; each one is a place where the intuitive answer is the expensive one.",
        questions: [
          {
            prompt: "Your hardware wallet arrives sealed, and inside the box is a card with twelve words already filled in and a note calling it your recovery phrase. What is it?",
            options: [
              { text: "Your wallet, pre-generated at the factory to save you a step." },
              { text: "A theft attempt. Generate a new wallet on the device and never use those words.", correct: true },
              { text: "Usable, as long as you add a passphrase so the printed words are not enough on their own." }
            ],
            why: "No legitimate manufacturer ships a seed. Whoever printed that card can spend from it the moment you fund it, and the third option is worse than it looks &mdash; it keeps a seed somebody else knows at the root of your wallet, and now your entire security rests on one passphrase you also have to back up."
          },
          {
            prompt: "The device's own random number generator is almost certainly fine. So what does rolling ninety-nine dice actually buy you?",
            options: [
              { text: "More randomness than a chip can produce, so a stronger seed." },
              { text: "A seed that is longer, and therefore harder to guess." },
              { text: "Nothing extra, if the generator is fine. The point is that you cannot tell whether it is.", correct: true }
            ],
            why: "A 24-word seed is 256 bits either way &mdash; quantity is not the issue. The issue is that a weak or rigged generator produces output indistinguishable from a good one, and no test on the finished words can separate them. Supplying the number yourself removes the only step in the process you were taking on faith."
          },
          {
            prompt: "You imported your cold wallet's xpub into a phone app to watch the balance. Someone takes the phone, unlocked. What can they do?",
            options: [
              { text: "Nothing much &mdash; they can see the current balance, but not the history." },
              { text: "Spend the coins, since the xpub is derived from the private key." },
              { text: "See every address and every payment, past and future, but move nothing.", correct: true }
            ],
            why: "Derivation runs one way: the xpub yields public keys and addresses, never the private keys, so spending is impossible without a signature from the device. What they get instead is complete and permanent visibility of your finances. That is a privacy loss rather than a theft, which is exactly why an xpub should be treated as private rather than published."
          },
          {
            prompt: "Which of these actually proves your written backup works?",
            options: [
              { text: "Checking that the words are legible, correctly spelled, and in the right order on the card." },
              { text: "Entering the words into a wiped device and confirming it derives the same fingerprint and first address.", correct: true },
              { text: "Keeping two copies of the card in two separate buildings." }
            ],
            why: "The first is proofreading and the third is redundancy &mdash; both worth doing, and neither is a test. Only the second one starts from the backup alone and ends with a value you can compare, which is the definition of a test. Two copies of a wrong phrase is still nothing."
          },
          {
            prompt: "Your wallet software shows a receive address. Why bother comparing it against the hardware wallet's own screen?",
            options: [
              { text: "Because malware on the computer can show you an address that is not yours.", correct: true },
              { text: "Because the device stores addresses that the software does not know about." },
              { text: "Because it confirms the address has not been used before." }
            ],
            why: "The computer is the part of the setup you cannot vouch for, and clipboard-swapping malware is cheap and fully automated. The device's screen is drawn by the device itself, so matching the two is the one check that catches a substitution &mdash; and it is per-address, every time, not once at setup."
          }
        ]
      })}

      <section class="sc-quickstart-next" aria-labelledby="what-comes-next">
      <h2 id="what-comes-next">What comes next?</h2>

      <h3>Understand what you own</h3>

      <p>You now have a working wallet and a small test balance. Before moving an amount you would not want to lose, learn what the wallet is actually controlling.</p>

      <p>A bitcoin wallet does not hold coins the way a physical wallet holds notes. It holds the keys that authorise transactions. The bitcoin itself remains recorded on the network as individual spendable outputs.</p>

      ${checklist([
        "<strong>Private key</strong> &mdash; the secret that authorises a spend.",
        "<strong>Recovery words</strong> &mdash; backup material that can recreate every key in the wallet.",
        "<strong>Address</strong> &mdash; a destination you can share to receive bitcoin.",
        "<strong>UTXO</strong> &mdash; one individual chunk of bitcoin your wallet can spend. Your balance is a collection of these, not a single number."
      ])}

      <p><a class="sc-text-link" href="keys-addresses-utxos.html">Understand what you own <i class="bi bi-arrow-right"></i></a></p>

      <h3>Keep it working</h3>

      ${checklist([
        "Check backups periodically for legibility and environmental damage.",
        "Keep an inheritance instruction that explains the process without exposing the secret.",
        "Download wallet software only from official sources, and verify releases where supported.",
        "Re-evaluate single-signature versus multisig as the amount and the consequences change."
      ])}

      ${callout("Read the failure modes next", `These four stages describe what to do. <a href="what-not-to-normalize.html">What not to normalize</a> describes the ordinary habits that quietly undo them, and it is worth reading before you move an amount you would miss.`)}
      </section>`
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
    related: ["quickstart", "dice-entropy", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Almost nobody loses bitcoin to cryptography. The maths holds. What people lose it to is a shortcut that worked the first fifty times, taken by someone who had every intention of being careful.</p>

      <p>Each of the six habits below is normal enough that you will find people recommending it. Each one has a specific, well-documented way of taking everything. None of them require you to be hacked, targeted, or unlucky &mdash; only to be slightly busy on the wrong afternoon.</p>

      ${figure({
        src: "../assets/img/what-not-to-normalize-phone-gallery.jpg",
        alt: "A phone lying face-up on a desk showing a photo gallery, with a seed-phrase card visible as one of the thumbnails",
        caption: "The most expensive photograph most people will ever take.",
        width: 1300,
        height: 726
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

      <p>Send an amount you would shrug at losing. Wait for it to confirm and appear in your own wallet before sending more &mdash; <a href="test-transaction.html">sending a test transaction</a> walks the whole loop, including what to do when it does not turn up. Then do it again after any change &mdash; a new device, new wallet software, a different address type, a restored backup. Bitcoin transactions do not reverse, and no support desk anywhere can recall one.</p>

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

      <p class="mt-4"><a class="sc-text-link" href="quickstart.html">Start here <i class="bi bi-arrow-right"></i></a></p>`
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
    related: ["quickstart", "owning-your-bitcoin", "sparrow-coin-control"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Almost everyone starts with the same mental picture: a wallet is a container, bitcoin sits inside it, and sending bitcoin moves it from your container to someone else's. It is a reasonable guess and it is wrong in every part, which is why so much of bitcoin seems arbitrary until you replace it.</p>

      <p>This page builds the correct picture from the bottom up. It takes about fifteen minutes and it makes everything afterwards easier &mdash; why fees behave oddly, why your wallet keeps generating new addresses, why you can restore everything from twelve words, and why sending a small amount sometimes moves your entire balance.</p>

      ${figure({
        src: "../assets/img/keys-addresses-utxos-flatlay.jpg",
        alt: "A clean overhead flat-lay: a key, a padlock, and a small pile of mismatched cash notes of odd denominations, arranged left to right",
        caption: "The three ideas on this page, in order.",
        width: 1300,
        height: 726
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

      ${callout("Ready to do it rather than read about it", `<a href='quickstart.html'>Start Here</a> walks through four practical steps: create, back up, test recovery, and receive a small amount.`)}`
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
    related: ["quickstart", "owning-your-bitcoin", "keys-addresses-utxos"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">There is no one-size-fits-all bitcoin wallet, and the search for one is where a lot of people stall &mdash; comparing devices for weeks while their bitcoin sits on an exchange, which is the one option they had already decided against.</p>

      <p>The choice is not really between products. It is between <em>shapes</em>: how many keys, on what kind of hardware, in how many places. Pick the shape first and the product question becomes small and easy.</p>

      ${figure({
        src: "../assets/img/choosing-your-first-setup-three-shapes.jpg",
        alt: "Three setups arranged left to right on a desk: a phone alone, a phone beside a hardware wallet, and three hardware wallets together",
        caption: "A hot wallet, a single hardware wallet, and multisig. The goal isn't to end up at the right &mdash; it's to match the shape to what you're actually holding.",
        width: 1300,
        height: 726
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

      ${callout("Then just do it", `Whatever you pick, <a href='quickstart.html'>Start Here</a> takes it from decision to a wallet you have proven works &mdash; four steps, small amounts, and recovery tested before bitcoin arrives.`)}`
  },
  {
    slug: "stuck-transaction",
    category: "fundamentals",
    products: [],
    title: "Your transaction is stuck",
    summary: "It has been hours, the explorer still says unconfirmed, and the money has left your balance. Nothing is lost. Here is how to tell whether it is genuinely stuck, the two ways to push it through, and the kind of help that will cost you everything.",
    level: "beginner",
    minutes: 12,
    goals: ["learn"],
    tags: ["Fees", "Mempool"],
    icon: "bi-hourglass-split",
    updated: "2026-08-18",
    status: "published",
    related: ["how-fees-work", "life-of-a-transaction", "sparrow-coin-control"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">It has been six hours. The explorer still says unconfirmed, your balance has gone down, and the person you were paying has received nothing. Every instinct says something has broken and you should try again.</p>

      <p>Almost nothing has broken. An unconfirmed transaction has not failed &mdash; it is a bid that has not been accepted yet, and the coins are still entirely yours. Bitcoin has no state where money is in transit and belongs to nobody.</p>

      <p>What follows is the order to work through it: how to tell whether it is genuinely stuck, the two ways to push it through, and the one category of &ldquo;help&rdquo; that turns an irritating wait into a permanent loss.</p>

      ${figure({
        src: "../assets/img/stuck-transaction-envelope.jpg",
        alt: "A single envelope sitting alone in a wire out-tray on an empty desk, late light, nobody around to collect it",
        caption: "Posted, not delivered, and still yours until somebody picks it up.",
        width: 1300,
        height: 726
      })}

      <h2><span class="sc-article-num">1</span>Nothing is lost, and that is not reassurance</h2>

      <p>It is worth being precise about where your coins are, because the fear driving most bad decisions here is that they are somewhere in between.</p>

      <p>They are not. Your transaction is sitting in the mempool &mdash; the waiting room every node keeps of transactions it has heard about but not yet seen mined. From there exactly two things can happen. It gets confirmed, and the payment is made. Or it is eventually forgotten, and the coins are spendable again exactly as they were before. There is no third outcome where they vanish.</p>

      ${callout("Why your balance already dropped", `Your wallet spent whole coins and is waiting on its own change to come back, so it shows the reduced figure immediately. That change is unconfirmed too, which is why the number can look alarming while nothing is actually wrong. <a href='life-of-a-transaction.html'>The life of a transaction</a> covers what a confirmation is and why depth matters more than status.`)}

      <h2><span class="sc-article-num">2</span>Check whether it is actually stuck</h2>

      <p>Blocks arrive about every ten minutes <em>on average</em>, and an average is not a schedule. Gaps of forty minutes are ordinary. Before doing anything, find out whether you are underpaying or simply impatient.</p>

      ${checklist([
        "<strong>Find the transaction ID.</strong> Your wallet lists it against the payment, often as a long string labelled txid. Copy it.",
        "<strong>Look it up on a block explorer or mempool visualiser.</strong> Pasting a txid reveals nothing about you &mdash; it is already public.",
        "<strong>Read the fee rate, not the fee.</strong> You want the figure in sats per virtual byte. The total in dollars tells you nothing about your position in the queue.",
        "<strong>Compare it with what is clearing now.</strong> If your rate is above the current next-block rate, you are not stuck and there is nothing to fix.",
        "<strong>Look at the size of the backlog.</strong> A mempool that is draining will reach you on its own. One that keeps growing will not."
      ])}

      <p>If your rate sits well below what is being mined and the backlog is not shrinking, it is genuinely stuck. Everything after this point assumes that is what you found.</p>

      <h2><span class="sc-article-num">3</span>If you sent it: replace it</h2>

      <p>The direct fix is to replace the transaction with an identical one paying more. Wallets label this <strong>bump fee</strong>, <strong>increase fee</strong>, or <strong>speed up</strong>. It is the same payment to the same recipient &mdash; you are not sending twice, and only one version can ever confirm.</p>

      ${checklist([
        "<strong>Bump generously, not by a hair.</strong> A replacement has to beat the original on both total fee and fee rate, and cover its own relay cost. Token increases are simply rejected, and you will have to do it again.",
        "<strong>Aim at the current next-block rate</strong> rather than slightly above what you first paid. You are re-entering the auction at today's prices.",
        "<strong>Re-verify the address on your device screen.</strong> A replacement is a new transaction requiring a new signature, so give it the same check you gave the first one.",
        "<strong>Expect the txid to change.</strong> The old one may linger on explorers for a while. The new one is the real payment."
      ])}

      <p>One wrinkle: transactions have historically been marked as replaceable or not at the moment they were built, and older wallets that marked yours as final may refuse to bump it. Relay policy across the network has broadened considerably since, but what you can actually do is decided by your wallet's interface, not by the network. If the option is greyed out, move to the next section.</p>

      <h2><span class="sc-article-num">4</span>If you are waiting to be paid: push from your end</h2>

      <p>When somebody else underpaid, you cannot replace their transaction &mdash; it is not yours to re-sign. You can bribe a miner to want it, by spending the incoming coin onward in a second transaction paying a high rate.</p>

      <p>The child cannot be mined unless the parent is mined first, so a miner evaluating the pair takes both or neither, at their combined rate. This is <strong>child pays for parent</strong>, and it is the standard tool for an incoming payment stuck in somebody else's underpaid transaction.</p>

      ${checklist([
        "Your wallet must allow spending unconfirmed coins, and must let you choose which coin to spend. <a href='sparrow-coin-control.html'>Coin control</a> is what makes this possible.",
        "Send the stuck coin to another address you control, paying a deliberately high rate.",
        "Size the fee to carry both transactions &mdash; you are paying off the parent's shortfall as well as the child's own cost.",
        "If the amount is small, check the arithmetic first. Rescuing a tiny payment can cost more than the payment."
      ])}

      <h2><span class="sc-article-num">5</span>If neither applies: wait properly</h2>

      <p>Waiting is a legitimate strategy and frequently the right one. Backlogs clear, usually faster than they feel like they will, and it costs nothing.</p>

      <p>Demand also has rhythms &mdash; weekends and overnight hours are routinely quieter, and a transaction that looked abandoned on Friday afternoon is often mined by Sunday without anyone touching it.</p>

      <p>If it is never mined, nodes eventually drop it, typically after about a fortnight. The coins become spendable again with no action from you, though some wallets need a restart or a rescan before they notice. Until that happens, treat the payment as still live: it can confirm at any moment if the backlog clears.</p>

      ${pullQuote("A stuck transaction is a payment waiting for a better price. It is not a payment that failed, and it is not money that went missing.")}

      <h2><span class="sc-article-num">6</span>What not to do</h2>

      <p>This is the part that matters most, because a stuck transaction produces exactly the anxious, hurried state that scams are built to catch.</p>

      ${cautions([
        "<strong>Do not send the payment again from a different wallet.</strong> Two transactions funded by different coins can both confirm, and you will have paid twice with no way to undo it.",
        "<strong>Never enter your recovery words into anything offering to release, unstick, or rescue a transaction.</strong> There is no such service. It is the single most reliable way to lose everything you hold, and the sites are polished and convincing.",
        "<strong>Treat paid accelerators with heavy suspicion.</strong> A legitimate one needs nothing but the txid. Anything asking for a seed phrase, a private key, or an upfront transfer is stealing from you.",
        "<strong>Do not let urgency choose the fee.</strong> Panic-bumping to many times the going rate is a permanent overpayment to fix a temporary delay."
      ])}

      ${callout("The tell is always the same", `Unsticking a transaction never requires access to your wallet &mdash; only a higher fee, which only you can authorise from the device holding the keys. Any page that asks for your recovery phrase to solve this is not confused about how bitcoin works. It is counting on you being too rattled to notice.`)}

      <h2><span class="sc-article-num">7</span>Making it rarer next time</h2>

      <p>Most stuck transactions are set up long before the moment of paying, and the habits that prevent them are covered properly in <a href='how-fees-work.html'>what a fee actually buys</a>. In short:</p>

      ${checklist([
        "Check the going rate independently before anything large. Wallet defaults are guesses, and often stale ones.",
        "Send fewer, larger coins. A payment assembled from fifteen small ones is many times the size, and size is what you pay for.",
        "Consolidate small coins during quiet periods, weighing the <a href='bitcoin-privacy.html'>privacy trade-off</a> first.",
        "Do not buy speed you cannot use. If the recipient waits for several confirmations anyway, paying for the very next block buys nothing."
      ])}

      <h2>The short version</h2>

      <p>Look up the txid and compare your fee rate against what is clearing. If you sent it, bump the fee properly. If you are receiving it, spend it onward at a high rate. If neither is available, wait &mdash; the backlog clears, or the transaction expires and your coins come back untouched.</p>

      ${callout("If you take one thing from this page", `The coins never left your control, so there is no deadline and no emergency. The only irreversible mistake available to you here is handing your recovery phrase to somebody promising to fix it.`)}`
  },
  {
    slug: "recovery-test-drill",
    category: "fundamentals",
    products: [],
    title: "Test your recovery without risking your coins",
    summary: "A backup you have never restored is a guess. Here is how to prove it works, including which method to use when you only own one device and it already holds funds.",
    level: "intermediate",
    minutes: 25,
    goals: ["recover", "harden", "inherit"],
    tags: ["Recovery", "Backups"],
    icon: "bi-arrow-counterclockwise",
    updated: "2026-08-17",
    status: "published",
    related: ["quickstart", "owning-your-bitcoin", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Writing down twelve or twenty-four words feels like the hard part is over. It is not. Until you have restored from those words and watched the correct wallet reappear, you do not have a backup &mdash; you have a hypothesis, and the test will otherwise be run for you at the worst possible time.</p>

      <p>The good news is that this is a genuinely finishable task, usually under half an hour. The bad news is that the obvious way to do it &mdash; wipe the device and type the words back in &mdash; is also the one way to turn a bad backup into an immediate, permanent loss. So the first decision is which method you use.</p>

      ${figure({
        src: "../assets/img/recovery-test-drill-two-devices.jpg",
        alt: "Two hardware wallets side by side on a desk with a seed card between them",
        caption: "A restore performed deliberately, while everything still works, is the only version of this that is safe. (The card shown is a deliberately low-entropy demo phrase &mdash; never reuse a word twelve times on a real seed.)",
        width: 1300,
        height: 726
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
        "<strong>Word order.</strong> Two transposed words give a completely different wallet, and the <a href='../glossary.html#term-checksum'>checksum</a> will often still accept it.",
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

      ${callout("This is step three of the path", `If you arrived here without a wallet yet, <a href="quickstart.html">Start Here</a> puts this recovery drill after backup and before receiving bitcoin. It is the step that turns the backup from an intention into something you have actually checked.`)}`
  },

  {
    slug: "test-transaction",
    category: "fundamentals",
    products: [],
    title: "Send a test transaction first",
    summary: "Before you move the balance, move five dollars along exactly the same route and watch it arrive. It is the cheapest way to find out that something in the chain is wrong.",
    level: "beginner",
    minutes: 20,
    goals: ["setup", "withdraw", "harden"],
    tags: ["Test transactions", "Cold storage", "UTXO"],
    icon: "bi-check2-circle",
    updated: "2026-08-23",
    status: "published",
    related: ["exchange-withdrawal", "recovery-test-drill", "how-fees-work"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">A bitcoin transaction is final. There is no chargeback, no support desk that can reverse it, and no version of this where money sent to the wrong address comes back. A test send is how you find out whether the whole path works while a mistake still costs a few dollars instead of everything.</p>

      <p>The method is unglamorous. Before moving the balance from your <a href="../glossary.html#term-hot_wallet">hot wallet</a> to <a href="../glossary.html#term-cold_storage">cold storage</a>, send a token amount along exactly the same route, and watch it arrive at the other end. Twenty minutes, most of it waiting.</p>

      ${figureSlot({
        shot: "A laptop showing a wallet's send screen beside a hardware wallet displaying the same receive address, with a finger tracing the characters in the middle of the string.",
        caption: "Two screens, one address. The device is the one telling the truth.",
        ratio: "16 / 9",
        icon: "bi-arrow-left-right"
      })}

      <h2>What the test proves, and what it does not</h2>

      <p>Worth being precise about this, because it is easy to run the test, watch it succeed, and draw a bigger conclusion than you earned.</p>

      ${checklist([
        "The address you copied is the address the coins actually reached.",
        "Your cold wallet knows about those coins &mdash; the right account, the right address type, the right derivation. That is a different claim from the address merely existing.",
        "The route works end to end: your sending wallet built it, the network accepted it, the fee was enough, it confirmed.",
        "You have now done it once, so the transfer that matters is a repeat rather than a first attempt."
      ])}

      <p>And the things it says nothing about:</p>

      ${cautions([
        "<strong>It does not prove you can spend from cold storage.</strong> Receiving needs only a public address. Spending needs the device, the PIN, and a signature &mdash; none of which were exercised here.",
        "<strong>It does not prove your backup works.</strong> That is a separate drill with a separate failure mode. See <a href='recovery-test-drill.html'>testing your recovery</a>.",
        "<strong>It does not prove the next address is right.</strong> The proof attaches to this destination, on this day, from this wallet. Change any of those and you are testing something new."
      ])}

      ${prerequisites([
        "The cold wallet already set up, with its recovery words written down and stored.",
        "The hot wallet holding the coins, with enough to cover the test amount plus fees.",
        "A way to see the cold wallet's balance &mdash; the wallet software paired to your signing device, or a <a href='../glossary.html#term-watch_only_wallet'>watch-only wallet</a>.",
        "A current fee estimate. <a href='how-fees-work.html'>How fees work</a> covers reading one."
      ])}

      <h2><span class="sc-article-num">1</span>Decide what a few dollars means today</h2>

      <p>The amount you send is not the cost of the test. It is your money going to your own wallet &mdash; you keep it. What the test costs is the fee to send it, and later the fee to spend it again.</p>

      <p>That second fee is the one that decides how small you can sensibly go. Everything you receive arrives as a <a href="../glossary.html#term-utxo">UTXO</a>, an individual chunk your wallet must one day spend, and the fee to spend a chunk depends on its size in bytes rather than its value. Send too little and you create an output that costs more to move than it is worth &mdash; economically <a href="../glossary.html#term-dust">dust</a>, even when it sits well above the protocol's own dust threshold.</p>

      <p>So: enough that spending it later during a busy <a href="../glossary.html#term-mempool">mempool</a> would still leave most of it intact. A few dollars is a reasonable floor when fees are calm, and worth raising when they are not. The upper bound is the amount you would genuinely shrug at losing, because that is the whole point of the exercise.</p>

      <h2><span class="sc-article-num">2</span>Get a receive address, and verify it on the device</h2>

      <p>Generate a fresh, unused receive address in the wallet software paired to your cold storage. Then display that same address on the signing device's own screen and compare the two.</p>

      <p>This is the step, not a formality around it. Malware that quietly substitutes an address in the clipboard or on screen is a well-documented, actively used attack, and the device screen is the only display in the chain that is not attached to the internet. If the two disagree, the computer is lying and you have just caught it.</p>

      ${checklist([
        "Compare the whole string, not the first four and last four characters &mdash; lookalike addresses are generated to match at both ends.",
        "Use QR transfer rather than copy and paste where both ends support it.",
        "Never accept an address that arrived by message, email, or screenshot. Derive it yourself, on the device.",
        "If your cold wallet has no screen of its own, you have no independent display to check against &mdash; be correspondingly more careful about the machine you are deriving it on."
      ])}

      <h2><span class="sc-article-num">3</span>Send it</h2>

      <p>Back in the hot wallet, enter the address, the amount, and a fee rate. Check the address once more on the sending side before you approve &mdash; this is the last screen where a substitution can still be caught.</p>

      <p>Do not pick the cheapest possible fee. You are buying information, and a test that sits unconfirmed for three days has not told you anything yet. Choose a rate that clears in the next block or two, note the transaction id, and leave it alone.</p>

      <h2><span class="sc-article-num">4</span>Watch it land</h2>

      <p>The transaction goes to the mempool first, unconfirmed, and then into a block. One <a href="../glossary.html#term-confirmation">confirmation</a> is plenty for a test of this size.</p>

      <p>Where you watch it from matters more than people expect. Pasting your own address into a public <a href="../glossary.html#term-block_explorer">block explorer</a> tells a third party, alongside your IP address, exactly which address you are interested in &mdash; which is a fair summary of the thing you were trying not to publish. Your own wallet is the better window, and <a href="own-node-connection.html">your own node</a> is better still.</p>

      <h2><span class="sc-article-num">5</span>Check the cold wallet, not the explorer</h2>

      <p>The result you are looking for is your cold wallet displaying the coins. An explorer showing the address funded is a weaker claim: it says the address received money, not that the wallet you intend to rely on can see it.</p>

      <p>If the explorer shows the funds and your wallet shows zero, the test has just done its job. Something in the setup &mdash; the account, the address type, the derivation path, the watch-only export &mdash; does not match, and you have found out for the price of the test rather than the price of the balance. Work through the troubleshooting list at the foot of this page before sending anything else.</p>

      <h2><span class="sc-article-num">6</span>Then send the rest</h2>

      <p>Use a fresh receive address for the real transfer rather than the one you just tested. <a href="../glossary.html#term-address_reuse">Address reuse</a> links the two payments together publicly for no benefit, and the proof you just built belongs to the wallet, not to that one address. Verify the new address on the device screen as well &mdash; that check is per-address, every time.</p>

      <p>One transaction for the whole balance is cheaper to spend later than several small ones; several give you separate chunks you can move independently. Neither is wrong, and <a href="sparrow-coin-control.html">coin control</a> covers the trade-off if it matters to you.</p>

      <h2>The step most people skip</h2>

      <p>Once the real transfer has settled, sign one small spend back out of cold storage to your hot wallet. It costs a single fee and it closes the gap this whole page leaves open: the device, the PIN, the signing flow, and &mdash; if you are working air-gapped &mdash; the business of carrying a PSBT out and the signature back.</p>

      ${pullQuote("A wallet you have only ever sent money to is a wallet you have never actually used.")}

      <p>Do it now, while the amount is small and nothing depends on the answer. Then run the <a href="recovery-test-drill.html">recovery drill</a>, which is the last thing standing between a working setup and one you have genuinely checked.</p>

      <h2>When to run it again</h2>

      ${checklist([
        "A new device, or a new wallet on an existing one.",
        "A wallet restored from backup, or rebuilt on different software.",
        "A change of address type or account &mdash; the addresses change, so the proof does not carry over.",
        "A new destination of any kind, including one belonging to somebody else.",
        "Before any transfer large enough that you would want to have checked."
      ])}

      <h2>When it does not arrive</h2>

      <p>Nothing here is an emergency, and none of it is fixed by handing your recovery words to somebody offering to help.</p>

      ${checklist([
        "<strong>Still unconfirmed after several hours.</strong> The fee was too low for current conditions. <a href='stuck-transaction.html'>Stuck transactions</a> covers bumping it or waiting it out.",
        "<strong>Confirmed on-chain, invisible in your wallet.</strong> Usually the wallet is watching a different account or script type, or has not scanned far enough ahead to see the address. Check the derivation path and force a rescan.",
        "<strong>Watch-only wallet showing nothing.</strong> Confirm it is synced and pointed at a working server before concluding anything about the transaction.",
        "<strong>Nothing at that address at all.</strong> Look up the transaction id and read the output address. If it is not the one you verified, the address was substituted somewhere between the two screens &mdash; stop, and treat the sending machine as compromised.",
        "<strong>Sent to the wrong address.</strong> There is no recovery. This is the outcome the test exists to make survivable, and the reason it was five dollars."
      ])}

      ${callout("If you take one thing from this page", `The test is not a ritual for the nervous &mdash; it is the only point in the process where being wrong is cheap. Spend the fee, wait the ten minutes, and let a mistake cost five dollars instead of the balance.`)}`
  },

  /* ------------------------------------------------------------------ devices */
  {
    slug: "coldcard-setup",
    aliases: ["coldcard-q-setup"],
    category: "devices",
    products: ["coldcard"],
    title: "COLDCARD Q and Mk5: first-time setup",
    summary: "Unbox and check the tamper evidence, set a PIN, generate a seed on the device, and take a backup you have verified. One path, with the handful of places the two models differ called out as you reach them.",
    level: "beginner",
    minutes: 45,
    goals: ["setup"],
    tags: ["Air-gapped", "microSD", "Seed backup"],
    icon: "bi-usb-drive",
    updated: "2026-08-18",
    productGuide: true,
    status: "published",
    related: ["sparrow-first-wallet", "coldcard-advanced-features", "air-gapped-psbt-workflow", "dice-entropy"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">A COLDCARD is a deliberately awkward device. It has a slot for a memory card and no way at all to talk to your computer over the internet. That awkwardness is the product &mdash; every inconvenience in this guide is a connection somebody decided not to give an attacker.</p>

      <p>This page covers both current models. They share the same codebase and the setup sequence is the same on each &mdash; Coinkite ships them as separate firmware builds with independent version numbers, but nothing below depends on that &mdash; so rather than two nearly identical guides, the differences are flagged at the four or five points where they actually change what you press.</p>

      <p>Setting one up properly takes about forty-five minutes. Most of that is not fiddly; it is writing things down carefully and resisting the urge to hurry. Read the whole page once before you start, then work through it.</p>

      ${figure({
        src: "../assets/img/coldcard-q-mk5-devices.jpg",
        alt: "A COLDCARD Q and a COLDCARD Mk5 side by side on a wooden desk, both powered on and showing their home screens",
        caption: "Same codebase, two keyboards. The Q's full QWERTY on the left, the Mk5's numeric keypad on the right.",
        width: 1195,
        height: 672
      })}

      <h2>Which one are you holding?</h2>

      <p>Both models do the same job to the same standard, and nothing in this guide is easier or safer on one than the other. The differences are ergonomic, and they change four things during setup.</p>

      ${checklist([
        "<strong>Typing.</strong> The Q has a full QWERTY keyboard with dedicated QR and NFC keys. The Mk5 has a numeric keypad, so anything involving letters &mdash; a passphrase especially &mdash; is slower and more deliberate.",
        "<strong>Cards.</strong> The Q has two microSD slots and stows two spare cards under the battery door. The Mk5 has one slot, so a second backup copy means swapping cards.",
        "<strong>Power.</strong> The Q runs from USB-C or three AAA batteries, so it can be set up nowhere near a computer. The Mk5 needs USB-C power throughout.",
        "<strong>Getting data out.</strong> The Q has a built-in QR scanner and can move wallet exports and signed transactions by camera. The Mk5 uses microSD, USB, or NFC."
      ])}

      <p>If you are choosing between them, that list is the whole decision. The security model and every step below are shared.</p>

      ${prerequisites([
        "Your COLDCARD, unopened, bought from Coinkite or an authorised reseller.",
        "Two microSD cards &mdash; one for the encrypted backup, one spare. On the Mk5 you will swap them through the single slot.",
        "A pen and the supplied backup card, or a metal backup plate.",
        "A USB-C cable and power source. On the Q, three AAA batteries instead if you would rather stay off a computer entirely.",
        "A private room, an uninterrupted hour, and no camera pointed at the desk.",
        "No bitcoin. Nothing here requires funds, and you should not move any until the check at the end passes."
      ])}

      <h2><span class="sc-article-num">1</span>Check the packaging before you power it on</h2>

      <p>Coinkite ships both models in a sealed bag with a serial number printed on it. During first boot the device shows you a number of its own, and the two are meant to match. That is the whole trick: a bag that has been opened and resealed around a substituted device will not produce a matching number.</p>

      <p>Read the number on the bag and keep it to hand. Inspect the bag for cuts, re-glued seams, or a second seal laid over the first, and look at the case seam and screen edge for scratches that suggest it has been opened.</p>

      ${cautions([
        "If anything about the packaging looks wrong, stop. Contact the vendor before continuing, and do not use the device.",
        "A device that arrives already showing a wallet, a PIN, or a set of recovery words is compromised. There are no exceptions to this and no innocent explanations worth gambling on."
      ])}

      <p>${official("https://coldcard.com/docs/q-quick/", "COLDCARD Q quick start")} &nbsp; ${official("https://coldcard.com/guides/setup/coldcard-mk5-setup", "COLDCARD Mk5 quick start")}</p>

      <h2><span class="sc-article-num">2</span>Set the PIN, and understand why it comes in two halves</h2>

      <p>The COLDCARD PIN is entered in two parts, and the gap between them is doing real work. You type the first half, the device responds with two words, and only then do you type the second half.</p>

      <p>Those two words are derived from your prefix combined with a secret held inside that specific device. They will be the same two words every time you log in &mdash; which means if you are ever handed a device that shows you <em>different</em> words, you have caught a substitution before giving away the rest of your PIN. It is a small piece of design that quietly defeats a whole class of attack.</p>

      ${checklist([
        "Choose a PIN you can recall under stress, not one you will need a note to remember.",
        "Write the two anti-phishing words down and keep them with your backup material.",
        "Record the PIN somewhere durable, and somewhere separate from your recovery words.",
        "On the Mk5, the PIN is entered on the numeric keypad. On the Q it is typed on the keyboard. The two-halves behaviour and the anti-phishing words are identical either way."
      ])}

      ${callout("The PIN protects the device, not the seed", "Anyone holding your recovery words can rebuild this wallet without ever seeing the PIN. The PIN buys you time if the device is physically stolen. The words are the thing that actually has to stay secret.")}

      <h2><span class="sc-article-num">3</span>Generate a new seed on the device</h2>

      <p>Choose the option to create a new wallet rather than importing one. The device generates the seed itself, using its own entropy, and it never leaves the secure element in plaintext. Nothing you type into a computer is involved at any point.</p>

      ${checklist([
        "Select new wallet, not import, and let the device produce the words.",
        "Write the words down in order, on paper or metal, exactly as displayed.",
        "Complete the word-confirmation quiz the device runs afterwards &mdash; it catches transcription errors while you can still fix them.",
        "Decide your passphrase policy now, and write down whether you used one."
      ])}

      <p>If you would rather supply the randomness yourself rather than trust the device's generator, both models accept dice rolls at this step &mdash; see <a href="dice-entropy.html">rolling your own entropy</a>. It is optional, and it is not the thing standing between you and losing your coins.</p>

      ${callout("A note on passphrases, and where the models part company", "A passphrase is a word or sentence added to the seed, producing a different wallet. On the Q you type it on a keyboard. On the Mk5 you assemble it from a numeric keypad, which is slow enough that people shorten the passphrase to get it over with &mdash; exactly the wrong instinct. If you want a passphrase on an Mk5, decide it in advance and accept the typing.")}

      ${cautions([
        "Never type these words into a phone, a computer, a password manager, or a photograph.",
        "Never use words that came printed with the device or were supplied by anyone else.",
        "Do not add a passphrase on a first setup unless you already understand how to recover from one."
      ])}

      ${figure({
        src: "../assets/img/coldcard-seed-word-writing.jpg",
        alt: "A COLDCARD Q and Mk5 beside a blank metal seed plate, ready to have the recovery words stamped into it in order",
        caption: "Write it, stamp it, in order. The quiz afterwards is there to catch you.",
        width: 1300,
        height: 726
      })}

      <h2><span class="sc-article-num">4</span>Take the encrypted backup</h2>

      <p>Separately from the words you just wrote down, the device writes an encrypted backup file to microSD. This file is protected by a twelve-word backup password that the device displays exactly once.</p>

      <p>That password is not your seed and does not replace it. Write it down before you dismiss the screen &mdash; without it the backup file is inert.</p>

      ${checklist([
        "Write the twelve-word backup password down before moving on.",
        "Save the backup to microSD, then repeat it onto a second card kept somewhere else.",
        "On the Q you can leave a card in each slot. On the Mk5, write the first card, eject it, and write the second &mdash; do not skip the second copy because it means swapping.",
        "Store the cards apart from the written recovery words where you practically can."
      ])}

      ${callout("The backup file is a convenience, not the safety net", "It restores your settings and any multisig configuration alongside the key, which saves real effort. Your handwritten recovery words remain the thing you genuinely cannot lose.")}

      <h2><span class="sc-article-num">5</span>Verify before you fund it</h2>

      <p>Everything up to this point is an assumption. This stage turns it into a fact, and it is the stage people skip.</p>

      ${checklist([
        "Run the device's own verify-backup option against the file you just wrote.",
        "Export the public keys and load them into your wallet software as a watch-only wallet. Either model can do this by microSD; on the Q you can also press the QR key and let the software read it off the screen.",
        "Compare the master key fingerprint shown on the device with the one shown in the software &mdash; they must match.",
        "Send a small test amount, confirm it arrives, then send it back out before committing real savings."
      ])}

      <p>If the fingerprints do not match, stop and work out why before going further. It means the software is watching a different wallet from the one the device will sign for, and every address it shows you would be wrong.</p>

      <p class="mt-4"><a class="sc-text-link" href="sparrow-first-wallet.html">Next: pair it with Sparrow <i class="bi bi-arrow-right"></i></a></p>`
  },
  /* The planned standalone Mk5 setup guide was folded into coldcard-setup
     above: same codebase, same sequence, and two near-identical pages would
     have put two links both labelled "Guide" on the one COLDCARD product
     card. */
  {
    slug: "coldcard-advanced-features",
    category: "devices",
    products: ["coldcard"],
    title: "COLDCARD advanced features",
    summary: "Trick PINs, duress wallets, the brick-me PIN, and the login countdown. What each one actually does, and the honest accounting of which of them can cost you your own coins.",
    level: "advanced",
    minutes: 30,
    goals: ["harden"],
    tags: ["Duress", "PIN policy"],
    icon: "bi-shield-lock",
    updated: "2026-08-18",
    status: "published",
    related: ["coldcard-setup", "duress-and-coercion", "passphrase-setup", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Once a COLDCARD is set up and holding coins, the settings menu offers a second layer: alternate PINs that open decoy wallets, wipe the seed, stall an attacker for days, or destroy the device outright. It is the most interesting menu on the device and the one most likely to lose you money.</p>

      <p>Not because the features are badly built &mdash; they work exactly as described. The problem is that every one of them trades a defence against somebody else for a new way to lock yourself out, and the device will let you configure all of it without ever asking whether your backup is real.</p>

      <p>This page explains what each option does and then does the accounting nobody enjoys: which of them you can walk back, and which are permanent.</p>

      ${figureSlot({
        shot: "A COLDCARD face down on a desk beside a fireproof document bag and a metal seed plate, lit hard from one side, nobody in frame.",
        caption: "Everything on this page assumes the plate exists and has been tested. Without that, none of it is a safety feature.",
        ratio: "16 / 9",
        icon: "bi-shield-lock"
      })}

      <h2><span class="sc-article-num">1</span>The rule that governs everything else</h2>

      <p>Before any of this, one fact about the main PIN, because it is the ground every other feature is built on.</p>

      <p><strong>There is no PIN reset and no factory reset.</strong> Coinkite cannot recover it, and neither can you. After thirteen wrong attempts the secure element destroys its contents and the device is finished &mdash; permanently, by design, with no appeal.</p>

      <p>That is not a bug to be nervous about. It is the reason the device is worth owning: a thief with your COLDCARD and no PIN gets thirteen guesses and then a paperweight. But it means the written recovery words are not a fallback for this device. They are the only copy of your wallet that exists.</p>

      ${callout("Do the restore test first, not later", `If you have not already restored these words onto a wiped device and watched the balance reappear, stop and do that before enabling anything below. Every feature on this page increases the chance you will one day need that backup, and <a href='recovery-test-drill.html'>an untested backup is a guess</a>.`)}

      <h2><span class="sc-article-num">2</span>What a trick PIN actually is</h2>

      <p>A trick PIN is a second, third, or tenth PIN that you configure while logged in normally. Enter it at the login screen and the device does not log you in &mdash; it performs whatever action you attached to that PIN, while behaving as though nothing unusual happened.</p>

      <p>The deception is the entire point. Someone standing over you sees a PIN typed and a device responding normally. They do not see which PIN it was, and the COLDCARD gives nothing away.</p>

      <p>You can configure several at once, each with a different action. They live in the secure element alongside the real PIN, and they can only be added, changed, or removed by logging in with the main PIN first.</p>

      <h2><span class="sc-article-num">3</span>The duress wallet</h2>

      <p>The best known of the trick PINs. Enter the duress PIN and the COLDCARD opens a real, working, entirely separate wallet. Balances, addresses, signing &mdash; all genuine. It simply is not your wallet.</p>

      <p>The seed for it is derived from your own seed along a fixed BIP-85 path, using reserved indices &mdash; 1001 to 1003 for a 24-word wallet, 2001 to 2003 for a 12-word one. Two consequences follow, and they matter in opposite directions:</p>

      ${checklist([
        "<strong>You can rebuild it.</strong> Because it is derived from your main seed, anything you leave in a duress wallet is recoverable later from your recovery words and a BIP-85 tool. It is not a black hole.",
        "<strong>They cannot walk backwards.</strong> The derivation runs one way only. Somebody holding the duress wallet, its words, and all its coins has no route from there to your real wallet."
      ])}

      <p>That second property is what makes the feature worth anything. The first is what stops a decoy from being a write-off.</p>

      ${cautions([
        "<strong>An empty decoy is not a decoy.</strong> A wallet with nothing in it tells your attacker they have the wrong PIN, and you are back where you started, having burned your one deception.",
        "<strong>A funded decoy is money you may actually hand over.</strong> Whatever you put in it should be an amount you would be willing to lose to end the situation.",
        "<strong>It only works if you can perform.</strong> The whole mechanism rests on somebody believing you under pressure. <a href='passphrase-setup.html'>The case against decoy wallets</a> is worth reading before you commit to one &mdash; the argument applies just as much here."
      ])}

      <h2><span class="sc-article-num">4</span>The wipe options</h2>

      <p>Several trick PINs destroy the seed on the device rather than hiding it. They differ only in what the attacker sees afterwards:</p>

      ${checklist([
        "<strong>Wipe and reboot.</strong> The seed is erased and the device restarts, looking freshly unboxed.",
        "<strong>Silent wipe.</strong> The seed is erased and the device shows an ordinary wrong-PIN message, so the wipe is invisible.",
        "<strong>Wipe, then open a wallet.</strong> The seed is erased and a duress wallet opens, so the device looks used rather than blank.",
        "<strong>Say wiped and stop.</strong> The device states plainly that it has been wiped."
      ])}

      <p>These are genuinely effective against a thief who wants your coins. They are also the fastest way to destroy your own access, because a wiped COLDCARD is exactly as empty as a stolen one. Everything depends on the words on your backup plate.</p>

      <h2><span class="sc-article-num">5</span>The brick-me PIN</h2>

      <p>This one does what it says. Enter the brick PIN and the secure element is destroyed on the spot. The COLDCARD displays the word <em>Bricked</em> and will do so for the rest of its existence. It cannot be repaired, reflashed, or reset. Coinkite's own advice is to discard it as e-waste.</p>

      <p>It is worth being clear about what this buys you, because it is narrower than it first appears. Bricking does not protect your coins &mdash; a wipe already does that, and leaves you a working device. What bricking adds is certainty that this specific piece of hardware will never be analysed, coerced, or brought back.</p>

      <p>For the overwhelming majority of people that is a threat model they do not have, purchased at the price of a device they do.</p>

      ${pullQuote("A wipe protects your coins and costs you a restore. A brick protects your coins and costs you the device. Be certain you know which problem you are solving.")}

      <h2><span class="sc-article-num">6</span>The login countdown</h2>

      <p>Rather than deceiving or destroying, this one simply refuses to hurry. Enter the PIN, and the device shows a countdown &mdash; anywhere from five minutes to twenty-eight days &mdash; and only accepts the PIN a second time once it has run out.</p>

      <p>Against coercion this is the most quietly useful option on the menu. It converts &ldquo;unlock this now&rdquo; into &ldquo;stand here for a fortnight&rdquo;, which is not a demand most people can make good on.</p>

      <p>There are variants that wipe first and then count down, or count down and then brick. And the obvious catch: <strong>the delay applies to you exactly as it applies to them.</strong> A twenty-eight day countdown means you cannot reach your own coins for twenty-eight days either, from the moment you set it.</p>

      <h2><span class="sc-article-num">7</span>Delta mode, and why it is last</h2>

      <p>Delta mode grants apparent access to your real wallet while quietly preventing transactions from being signed properly. The attacker sees the balance they were after and cannot move it.</p>

      <p>It carries an unusual constraint: the trick PIN must be the same length as your main PIN and identical to it except for the last four digits. Coinkite's documentation says plainly that it is not recommended for novices, and that is the right note to end the menu on. Misconfigure it and you have built a very elaborate way to confuse yourself at the worst possible moment.</p>

      <h2><span class="sc-article-num">8</span>The honest accounting</h2>

      <p>Here is every option measured against the only question that matters: if this fires, by accident or by design, what does it cost you?</p>

      <div class="sc-coldcard-cost-card">
        <div class="sc-coldcard-cost-heading">
          <span class="sc-coldcard-cost-mark" aria-hidden="true"></span>
          <div><span>Consequence map</span><h3>What each trigger actually costs</h3></div>
          <strong>Your backup is the exit</strong>
        </div>
        <div class="sc-coldcard-cost-grid" role="table" aria-label="What each COLDCARD feature costs you if it triggers">
          <div class="sc-coldcard-cost-head" role="row"><span role="columnheader">Feature</span><span role="columnheader">What it costs you</span><span role="columnheader">Recovery path</span></div>
          <div role="rowgroup">
            <div class="sc-coldcard-cost-row is-low" role="row"><strong role="rowheader">Just reboot</strong><span role="cell"><small>Cost</small>Nothing</span><span class="is-safe" role="cell"><small>Recovery</small>Yes &mdash; nothing changed</span></div>
            <div class="sc-coldcard-cost-row is-low" role="row"><strong role="rowheader">Look blank</strong><span role="cell"><small>Cost</small>Nothing; the seed is untouched</span><span class="is-safe" role="cell"><small>Recovery</small>Yes &mdash; nothing changed</span></div>
            <div class="sc-coldcard-cost-row is-contained" role="row"><strong role="rowheader">Duress wallet</strong><span role="cell"><small>Cost</small>Whatever you funded the decoy with</span><span class="is-contained" role="cell"><small>Recovery</small>Yes, via BIP-85 from your seed</span></div>
            <div class="sc-coldcard-cost-row is-delay" role="row"><strong role="rowheader">Login countdown</strong><span role="cell"><small>Cost</small>Your own access, for up to 28 days</span><span class="is-delay" role="cell"><small>Recovery</small>Yes, once it expires</span></div>
            <div class="sc-coldcard-cost-row is-terminal" role="row"><strong role="rowheader">Any wipe variant</strong><span role="cell"><small>Cost</small>The seed on the device</span><span class="is-backup" role="cell"><small>Recovery</small>Only from your written backup</span></div>
            <div class="sc-coldcard-cost-row is-terminal" role="row"><strong role="rowheader">Countdown, then brick</strong><span role="cell"><small>Cost</small>The device, after the delay</span><span class="is-backup" role="cell"><small>Recovery</small>Only from your written backup</span></div>
            <div class="sc-coldcard-cost-row is-terminal" role="row"><strong role="rowheader">Brick me</strong><span role="cell"><small>Cost</small>The device, immediately and permanently</span><span class="is-backup" role="cell"><small>Recovery</small>Only from your written backup</span></div>
            <div class="sc-coldcard-cost-row is-terminal" role="row"><strong role="rowheader">13 wrong main PINs</strong><span role="cell"><small>Cost</small>The device, permanently</span><span class="is-backup" role="cell"><small>Recovery</small>Only from your written backup</span></div>
          </div>
        </div>
      </div>

      <p>The bottom half of that table is not a warning against those features. It is a statement that they all resolve to the same place: a plate with words on it, in a drawer, that you have personally tested. Every one of them is safe if that plate is real, and every one of them is catastrophic if it is not.</p>

      <h2><span class="sc-article-num">9</span>What to actually turn on</h2>

      <p>A recommendation, since a menu of options is not advice.</p>

      ${checklist([
        "<strong>For nearly everyone: none of it.</strong> A tested backup, a PIN you will not forget, and a device nobody knows you own already defeat the threats most people genuinely face.",
        "<strong>If you travel or cross borders:</strong> a modest login countdown, measured in hours rather than weeks, is the option with the best ratio of protection to self-inflicted risk.",
        "<strong>If you are seriously worried about coercion:</strong> a funded duress wallet, but only after reading the case against decoys and only if you are honest about performing under pressure.",
        "<strong>Brick-me and delta mode:</strong> leave them alone unless you can state precisely which adversary they defeat and why a wipe would not have."
      ])}

      <p>And whatever you enable, write down that you enabled it, and store that note with your recovery words. A trick PIN you have forgotten configuring is a trap you built for yourself.</p>

      <h2>The short version</h2>

      <p>Trick PINs are alternate PINs that deceive, delay, wipe, or destroy instead of logging you in. The duress wallet is derived from your own seed and runs one way, so a decoy is recoverable by you and useless to them. Wipes and bricks are only survivable because of your written backup, which means none of this is safe to enable until that backup has been tested.</p>

      ${callout("If you take one thing from this page", `These features do not add security to your wallet &mdash; they add ways for your device to refuse. What actually keeps the coins is the plate in the drawer. Turn on the least you need, write down what you turned on, and never let a clever configuration substitute for a backup you have proven works.`)}`
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

      ${figure({
        src: "../assets/img/passport-setup-qr-scan.jpg",
        alt: "A Foundation Passport device resting on a laptop trackpad, no cable connected",
        caption: "No cable, because there is nothing here to plug in. Every transaction crosses this gap as a QR code, read by the Passport's camera.",
        width: 1300,
        height: 726
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

      ${figure({
        src: "../assets/img/jade-setup-qr-scan.jpg",
        alt: "A Blockstream Jade Plus resting on a laptop keyboard, its screen showing the device's own logo",
        caption: "The camera is the reason to buy this device. Every transaction crosses as a QR code, read by the Jade's own camera &mdash; signing without ever plugging it in is the default, not a workaround.",
        width: 1300,
        height: 769
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
    summary: "Assembling the hardware, verifying and flashing the image, and the stateless signing model that deliberately keeps nothing on the device. Including the part that is genuinely yours to get right, because nobody sealed this one in a bag.",
    level: "advanced",
    minutes: 60,
    goals: ["setup"],
    tags: ["DIY", "Stateless", "QR"],
    icon: "bi-cpu",
    updated: "2026-08-18",
    productGuide: true,
    status: "published",
    related: ["krux-setup", "air-gapped-psbt-workflow", "dice-entropy", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">A SeedSigner is about fifty dollars of commodity electronics that you assemble yourself: a Raspberry Pi Zero, a small screen with a joystick, and a camera. There is no secure element, no company standing behind it, and nothing is sealed in a tamper-evident bag. It signs bitcoin transactions as capably as devices costing ten times more.</p>

      <p>What makes that work is a design decision rather than a component. The device is <strong>stateless</strong>: it holds your seed only while powered on, and forgets it completely the moment you unplug it. There is nothing on the hardware to steal, which is why the hardware does not need to defend itself.</p>

      <p>The trade is that you perform the security yourself &mdash; the checks a manufacturer would normally have done are now your job, and there is one in particular you must not skip. Budget an evening.</p>

      ${figureSlot({
        shot: "The three SeedSigner components laid out unassembled on a workbench: a Raspberry Pi Zero, a Waveshare 1.3 inch LCD hat with its joystick, and a small camera module with ribbon cable.",
        caption: "Three parts, no enclosure yet. The screen is the one people buy wrong.",
        ratio: "16 / 9",
        icon: "bi-cpu"
      })}

      ${prerequisites([
        "<strong>A Raspberry Pi Zero, ideally v1.3</strong> &mdash; the version with no wireless hardware at all. The W and 2 W models work, and so do larger Pis, but see the note in step 1.",
        "<strong>A Waveshare 1.3&Prime; LCD hat, 240&times;240 resolution.</strong> This exact resolution. Waveshare sells several boards that look nearly identical and will not work.",
        "<strong>A Pi Zero-compatible camera module.</strong> The OV5647-sensor 5MP boards are the commonly tested ones. Camera cables come in two styles, so check yours matches your enclosure.",
        "<strong>A microSD card.</strong> Capacity is irrelevant &mdash; the image is well under 100MB.",
        "A computer to verify and flash the image, and a soldering iron if your Pi's GPIO header is not pre-attached.",
        "No bitcoin. Nothing here needs funds, and nothing should be funded until the check at the end passes."
      ])}

      <h2><span class="sc-article-num">1</span>What you are actually building</h2>

      <p>Every other device in this section arrives finished. Someone chose the components, wrote the firmware, sealed the box, and put their name on the result. You check the seal and inherit their work.</p>

      <p>Here you are the manufacturer. Nobody vetted your parts, and the tamper-evident bag does not exist. In exchange you get a device with no proprietary silicon, an image you can rebuild from source, and no supply chain to compromise except the one you ran yourself.</p>

      <p>Two consequences shape the whole build:</p>

      ${checklist([
        "<strong>Verifying the image is not optional here.</strong> On a sealed device the bag is your integrity check. On this one, the signature on the software is the only one you get. Step 3 is the most important step on this page.",
        "<strong>Wireless hardware you do not use is still wireless hardware.</strong> The SeedSigner image never touches WiFi or Bluetooth, but a Pi Zero 1.3 cannot use them because the radios are not on the board. That is a stronger statement than trusting software to leave them off, and it is why the 1.3 is preferred."
      ])}

      <p>${official("https://seedsigner.com/hardware/", "SeedSigner hardware list")} &nbsp; ${official("https://github.com/SeedSigner/seedsigner", "SeedSigner source and releases")}</p>

      ${cautions([
        "There are no official vendors. The project endorses nobody, so judge sellers on their own reputation rather than assuming a listing is legitimate.",
        "Buy the 240&times;240 Waveshare screen specifically. Ordering the wrong lookalike is the single most common way a build fails, and it fails after assembly rather than before."
      ])}

      <h2><span class="sc-article-num">2</span>Assembly</h2>

      <p>Mechanically this is a ten-minute job, assuming your Pi came with its GPIO header already soldered. If it did not, that is the one step needing an iron &mdash; forty pins, or a repair shop and a coffee.</p>

      ${checklist([
        "<strong>Seat the screen on the GPIO header.</strong> The hat covers the 40-pin connector, aligned from the pin-1 corner. It only goes on one way round.",
        "<strong>Connect the camera to the CSI port</strong> with its ribbon cable, contacts facing the correct side for your Pi. The connector lifts, the ribbon slides in, the connector presses back down.",
        "<strong>Leave the enclosure until it boots.</strong> Confirm the thing works before committing it to a case, because taking it apart again to reseat a ribbon is irritating."
      ])}

      <h2><span class="sc-article-num">3</span>Verify the image, then flash it</h2>

      <p>This is the step that replaces the tamper-evident bag, and skipping it means running software of unknown origin on a device you are about to show your seed to.</p>

      <p>Download the release image along with its <a href="../glossary.html#term-checksum">checksum</a> file and the signature of that checksum file. Then, on your computer, three commands do the work &mdash; substituting the version you actually downloaded:</p>

      ${checklist([
        "<strong>Fetch the project's signing key:</strong> <code>gpg --fetch-keys https://keybase.io/seedsigner/pgp_keys.asc</code>",
        "<strong>Verify the checksum file was signed by that key:</strong> <code>gpg --verify seedsigner.0.8.7.sha256.txt.sig</code>",
        "<strong>Verify the image matches the checksum:</strong> <code>shasum -a 256 --ignore-missing --check seedsigner.0.8.7.sha256.txt</code>"
      ])}

      <p>The first command establishes which key you are trusting. The second proves the checksum list came from that key. The third proves your download matches the list. All three have to pass; any one of them alone proves very little.</p>

      <p>Once verified, write the image to the microSD card with Raspberry Pi Imager or Balena Etcher, and put the card in the Pi.</p>

      ${callout("What a signature check does and does not tell you", "It confirms the image is the one the SeedSigner project published, unmodified in transit. It does not tell you the project is trustworthy &mdash; that judgement is yours, and it is the same judgement you make about any wallet maker. What it removes is the middle ground where a tampered download slips past unnoticed.")}

      <h2><span class="sc-article-num">4</span>First boot, and the stateless model</h2>

      <p>Power it on and it comes up in seconds with no setup wizard, no PIN, and no wallet. It is genuinely empty, and it will be empty again every time you power it on.</p>

      <p>This is the part that surprises people arriving from other devices. A COLDCARD remembers its seed and defends it with a PIN and a secure element. A SeedSigner remembers nothing, so there is nothing to defend. Every session begins by loading a seed and ends, at power-off, by forgetting it.</p>

      ${checklist([
        "<strong>Nothing persists.</strong> A SeedSigner recovered from a drawer, or from a thief, holds no key material at all.",
        "<strong>You re-enter the seed each session.</strong> By typing the words, by dice, or by scanning a SeedQR &mdash; see step 6.",
        "<strong>The threat model moves.</strong> Your security no longer rests on the device resisting attack. It rests on where your words live when the device is off, and on nobody watching the screen while they are on it."
      ])}

      <h2><span class="sc-article-num">5</span>Creating a seed on the device</h2>

      <p>The SeedSigner can generate a seed for you, and it offers two sources of randomness rather than asking you to trust a chip you cannot inspect.</p>

      ${checklist([
        "<strong>Dice rolls.</strong> You roll, it converts. This is the most transparent option available on any device and is covered properly in <a href='dice-entropy.html'>rolling your own entropy</a>.",
        "<strong>Image entropy.</strong> The camera photographs something unpredictable and derives randomness from the sensor data."
      ])}

      <p>Write the resulting words down immediately, on paper or metal, in order. On a stateless device this is not a backup step you can defer &mdash; if you power the thing off before recording them, the wallet is gone, and there is nothing anywhere to recover it from.</p>

      ${cautions([
        "The dice-to-seed method changed in 2022, so rolls recorded on older firmware will not reproduce the same wallet today. Your words are the backup; the rolls are working paper.",
        "Decide your passphrase policy now. The device supports a BIP39 passphrase, and a passphrase you cannot reproduce is a wallet you cannot open."
      ])}

      <h2><span class="sc-article-num">6</span>SeedQR, and the trade it asks of you</h2>

      <p>Typing twenty-four words on a joystick every session gets old within a week, so the project offers <strong>SeedQR</strong>: your seed encoded as a QR code that the camera reads instantly. The device walks you through transcribing it by hand onto a blank grid, so the code is created by you rather than printed by anything.</p>

      <p>It genuinely solves the usability problem. It also changes the shape of your risk, and this is worth sitting with before you make one.</p>

      ${pullQuote("Written words have to be read, understood, and typed. A SeedQR only has to be photographed. Convenience for you is convenience for anyone who gets a look at it.")}

      ${cautions([
        "<strong>A photograph of a SeedQR is your wallet.</strong> No transcription, no reading skill, no delay &mdash; a glance from a phone camera is enough.",
        "<strong>Store it as you would the words themselves</strong>, which for most people means not in the same place as the device, and never anywhere a camera can see.",
        "<strong>It is not a substitute for the written words.</strong> Keep the plate. A damaged or unreadable QR with no word backup is a total loss."
      ])}

      <h2><span class="sc-article-num">7</span>Signing a transaction</h2>

      <p>Nothing is plugged in, ever. The SeedSigner and your wallet software talk in QR codes across the air gap, and the round trip goes like this:</p>

      ${checklist([
        "Your wallet software builds an unsigned transaction &mdash; a PSBT &mdash; and shows it as a QR code on the computer screen.",
        "You load your seed on the SeedSigner, then point its camera at that code.",
        "<strong>The device shows you what you are signing.</strong> Amount, destination, fee. Read it here, on the device, not on the computer.",
        "You approve, and the SeedSigner displays the signed result as a QR code.",
        "Your wallet software reads that code with a webcam and broadcasts the transaction."
      ])}

      <p>The device supports single-sig and multisig, exports xpubs for both, and handles taproot, native segwit, nested segwit, and legacy address types &mdash; so it pairs with essentially any modern wallet software.</p>

      ${callout("The screen you read is the screen that matters", "A compromised computer can display an honest-looking transaction while asking you to sign a dishonest one. The SeedSigner's screen is driven by the device doing the signing, which is the entire reason to check the amount and address there rather than on the machine that composed it.")}

      <h2><span class="sc-article-num">8</span>Verify before you fund it</h2>

      <p>Everything so far is an assumption until you prove it, and on a DIY device that proof matters more, not less.</p>

      ${checklist([
        "Export the public keys to your wallet software as a watch-only wallet, and confirm the fingerprint shown on the device matches the one in the software.",
        "Power the SeedSigner off completely, then reload your seed from your written words &mdash; not from a SeedQR &mdash; and confirm you reach the same wallet. This tests your backup and your transcription in one go.",
        "Send a small test amount, confirm it arrives, then sign a transaction sending it back out. Only then is the whole loop proven.",
        "Note the firmware version you used, since the dice method belongs to that version."
      ])}

      <p>If the fingerprints disagree, stop. The software is watching a different wallet from the one the device will sign for, and every address it offers you would be wrong.</p>

      <h2>The short version</h2>

      <p>Buy the right screen, assemble three parts, and verify the image signature before flashing it &mdash; that check is the only supply-chain protection a DIY device has. Then treat the device as disposable and the words as everything, because the SeedSigner is designed to hold nothing at all when it is switched off.</p>

      ${callout("If you take one thing from this page", `The security here does not live in the hardware, and it was never meant to. It lives in a verified image, a written backup you have tested, and the discipline of reading each transaction on the device's own screen. Get those three right and the fifty-dollar signer is not a compromise.`)}`
  },
  {
    slug: "krux-setup",
    category: "devices",
    products: ["krux"],
    title: "Krux: install and first use",
    summary: "Krux is firmware, not a device. Choosing hardware to put it on, verifying and flashing the release, generating a seed from dice or a photograph, and the storage feature its own documentation tells you is not a backup.",
    level: "advanced",
    minutes: 60,
    goals: ["setup"],
    tags: ["DIY", "QR"],
    icon: "bi-cpu",
    updated: "2026-08-18",
    productGuide: true,
    status: "published",
    related: ["seedsigner-setup", "air-gapped-psbt-workflow", "dice-entropy"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Krux is not a product you buy. It is open-source firmware that turns an off-the-shelf Kendryte K210 board &mdash; a class of cheap Chinese microcontroller device sold for machine-vision experiments &mdash; into an air-gapped bitcoin signer.</p>

      <p>That distinction shapes everything. There is no Krux hardware, no Krux company, and no Krux packaging to inspect. You choose a supported device, put verified firmware on it, and what you end up with is as trustworthy as those two decisions were.</p>

      <p>In exchange you get a signer for well under a hundred dollars, often with a colour touchscreen, and a feature set that is frankly broader than devices costing five times more. Budget an evening for the first run.</p>

      ${figureSlot({
        shot: "A Krux-running K210 touchscreen device on a dark desk showing a QR code, beside a D20 die and a handwritten column of numbers.",
        caption: "Ordinary machine-vision hardware, doing something its manufacturer never intended.",
        ratio: "16 / 9",
        icon: "bi-cpu"
      })}

      ${prerequisites([
        "<strong>A supported K210 device.</strong> Maix Amigo, M5StickV, Yahboom, WonderMV, TZT, and Embed Fire are all supported. Some arrive ready to use with large touchscreens; others are development kits for people who enjoy that.",
        "<strong>A computer to flash it from</strong>, with a USB cable that carries data rather than power alone.",
        "<strong>A microSD card</strong> &mdash; optional for signing, but the route to air-gapped updates later.",
        "<strong>A die, if you want to supply your own randomness.</strong> Krux takes a D6 or a D20.",
        "Paper or metal for the recovery words, and somewhere private to work.",
        "No bitcoin. Nothing here needs funds, and nothing should be funded until the check at the end passes."
      ])}

      <h2><span class="sc-article-num">1</span>Choosing what to run it on</h2>

      <p>The supported devices differ more than the firmware does. Krux behaves the same on all of them; what changes is how pleasant the experience is and how much assembly you are signing up for.</p>

      ${checklist([
        "<strong>Ready-to-use touchscreen devices</strong> arrive assembled in a case with a battery. You unbox, flash, and use. For most people this is the correct choice and the reason to prefer Krux over a build-it-yourself signer.",
        "<strong>Development board kits</strong> are cheaper and more open, at the cost of assembling and enclosing them yourself.",
        "<strong>Screen size is not cosmetic here.</strong> You will be reading transaction details and scanning QR codes on this screen, repeatedly. A larger display is a security feature as much as a comfort one."
      ])}

      <p>This is the main practical difference from <a href='seedsigner-setup.html'>SeedSigner</a>, which is otherwise a close cousin: SeedSigner is three parts you assemble and possibly solder, while Krux is firmware for a device that may already be finished when it arrives.</p>

      <p>${official("https://selfcustody.github.io/krux/", "Krux documentation")} &nbsp; ${official("https://github.com/selfcustody/krux", "Krux source and releases")}</p>

      <h2><span class="sc-article-num">2</span>Install the firmware, and verify it first</h2>

      <p>There is no tamper-evident bag in this story either, so the signature on the firmware is the only integrity check available. It is not optional.</p>

      <p>Krux offers four installation routes: the Krux Installer GUI application, a pre-built official release, a pre-built test release, and building from source.</p>

      ${checklist([
        "<strong>The Krux Installer GUI is the sensible default.</strong> It downloads the release, verifies it, and flashes your device, which removes most of the ways this goes wrong by hand.",
        "<strong>Take the official release, not the test one.</strong> Beta builds exist for people testing Krux, not for people securing savings.",
        "<strong>Verify the signature before flashing</strong> if you are installing manually. This is the step that distinguishes running Krux from running something that says it is Krux.",
        "<strong>After the first install you can update by microSD</strong>, which means every subsequent firmware update can happen without the device ever touching a computer again."
      ])}

      ${callout("The first install is the only one that needs a cable", "That microSD update path is worth planning around. Connect the device to a computer once, to put verified firmware on it, and from that point forward the air gap is never broken &mdash; not for updates, not for signing, not for anything.")}

      <h2><span class="sc-article-num">3</span>Generating a seed</h2>

      <p>Krux will not silently produce a seed from a chip you cannot inspect. It asks where the randomness should come from, and it shows its working.</p>

      <p>The dice options are unusually generous, and Krux is one of the few signers that takes a twenty-sided die:</p>

      <div class="sc-krux-dice-panel" aria-label="Minimum dice rolls Krux requires">
        <div class="sc-krux-dice-heading">
          <span class="sc-krux-dice-mark" aria-hidden="true">D6<span>D20</span></span>
          <div><span>Entropy input</span><h3>More sides, fewer rolls</h3></div>
          <strong>Both routes reach the same target</strong>
        </div>
        <div class="sc-krux-dice-grid">
          <article class="is-d6">
            <div class="sc-krux-die-title"><span>D6</span><div><h3>Ordinary die</h3><p>Six-sided</p></div></div>
            <dl>
              <div><dt>Bits per roll</dt><dd>2.585</dd></div>
              <div><dt>12 words</dt><dd>50 <small>rolls</small></dd></div>
              <div><dt>24 words</dt><dd>99 <small>rolls</small></dd></div>
            </dl>
          </article>
          <article class="is-d20">
            <div class="sc-krux-die-title"><span>D20</span><div><h3>Twenty-sided die</h3><p>Higher entropy per throw</p></div></div>
            <dl>
              <div><dt>Bits per roll</dt><dd>4.322</dd></div>
              <div><dt>12 words</dt><dd>30 <small>rolls</small></dd></div>
              <div><dt>24 words</dt><dd>60 <small>rolls</small></dd></div>
            </dl>
          </article>
        </div>
      </div>

      <p>A D20 cuts a 24-word seed from ninety-nine rolls to sixty, which is a meaningful saving when you are doing it by hand. The rules from <a href='dice-entropy.html'>rolling your own entropy</a> apply unchanged: record every roll, never re-roll a result you dislike, and remember the rolls are working paper rather than a backup.</p>

      <p>The alternative is <strong>image entropy</strong>: photograph something chaotic and Krux derives the seed from a hash of the image's raw sensor bytes. Krux displays live quality indicators while you frame the shot &mdash; and its own documentation is careful to say these are approximations meant to guide your choice of image, not absolute measurements of cryptographic entropy. Treat them as a nudge away from photographing a blank wall, not as a score to optimise.</p>

      <p>Whichever source you pick, Krux hashes it with SHA256, shows you the hash, and converts it deterministically into BIP39 words. That displayed hash is the device showing its work, and you can check the conversion independently later if you want to.</p>

      <h2><span class="sc-article-num">4</span>The stored-mnemonic feature, and what it is not</h2>

      <p>Here is where Krux departs from its stateless cousins, and it is the part of the device most worth understanding properly.</p>

      <p>Krux can store your mnemonic, encrypted, either in the device's own flash memory or on a microSD card. You choose a key, and the mnemonic comes back when you supply that key again. It is a real convenience: no re-typing twenty-four words at the start of every session.</p>

      <p>The encryption is not decorative. Krux uses AES, and your key is not used directly &mdash; it is stretched through many rounds of PBKDF2 first, specifically so that guessing at it is slow.</p>

      ${pullQuote("Krux's own documentation says it plainly: stored mnemonics are for convenience only and should not be considered a form of backup.")}

      <p>That warning deserves repeating in the project's own terms, because the feature is genuinely easy to mistake for a backup. Encrypted storage lives on a device that can be lost, dropped, wiped by a firmware update, or simply fail. It protects the mnemonic <em>while the device works</em>. It does nothing at all once the device does not.</p>

      ${cautions([
        "<strong>Make a physical backup regardless</strong> &mdash; words on paper or metal, independent of any electronics.",
        "<strong>Test recovering from that physical backup before you send funds</strong>, exactly as you would with any other wallet.",
        "<strong>A forgotten encryption key is a lost mnemonic.</strong> The PBKDF2 stretching that protects you from an attacker protects the device from you too.",
        "<strong>Storing on the device concentrates risk.</strong> An encrypted mnemonic on the same device you carry through an airport is a different proposition from one on a card in a drawer."
      ])}

      <h2><span class="sc-article-num">5</span>Signing a transaction</h2>

      <p>The signing loop is the familiar air-gapped round trip, with Krux offering two ways across the gap rather than one.</p>

      ${checklist([
        "Your coordinator wallet builds an unsigned transaction &mdash; a PSBT &mdash; and displays it as a QR code, or writes it to a microSD card.",
        "You load your mnemonic on the Krux device and either scan the code with its camera or read the file from the card.",
        "<strong>Check the amount, destination, and fee on the Krux screen.</strong> This is the whole reason the device has a display.",
        "Approve, and Krux returns the signed transaction the same way it came in &mdash; as a QR code, or back onto the card.",
        "Your coordinator reads the signature and broadcasts it."
      ])}

      <p>Krux works with the mainstream coordinator wallets and supports multisig, so it slots into an existing setup rather than demanding its own.</p>

      <h2><span class="sc-article-num">6</span>The unusual extras</h2>

      <p>Krux carries several features you will not find on most signers. None of them are required, and a first-time user should ignore all of them, but they are worth knowing exist:</p>

      ${checklist([
        "<strong>Printing and CNC engraving.</strong> Krux can drive a thermal printer, or output files for a CNC machine, to produce physical backups of a mnemonic or a QR code.",
        "<strong>Tamper detection.</strong> An experimental check intended to reveal whether the device has been interfered with between sessions.",
        "<strong>Mnemonic XOR.</strong> Splitting a mnemonic into parts that are individually useless and only reconstruct the original when combined.",
        "<strong>QR transcription tools.</strong> Guided help for copying a QR code onto a physical medium by hand."
      ])}

      <p>Each of these adds a way to lose access if you misunderstand it. Get a plain wallet working and verified first; the extras will still be there next month.</p>

      <h2><span class="sc-article-num">7</span>Verify before you fund it</h2>

      <p>On firmware you flashed yourself, running on hardware nobody certified, this stage is the one that converts hope into knowledge.</p>

      ${checklist([
        "Export the public keys to your coordinator wallet as a watch-only wallet, and confirm the fingerprint on the device matches the one in the software.",
        "Power the device off, then reload the mnemonic from your <em>written words</em> &mdash; not from encrypted storage &mdash; and confirm you reach the same wallet. This tests the backup you will actually need.",
        "Send a small test amount, confirm it arrives, then sign a transaction sending it back out.",
        "Note the firmware version and the device model, since both belong to the wallet you just made."
      ])}

      <p>If the fingerprints disagree, stop and find out why before going any further. The software would be watching a different wallet from the one the device signs for, and every address it showed you would be wrong.</p>

      <h2>The short version</h2>

      <p>Krux is firmware, so the device is your choice and the verification is your job. Flash a verified official release, generate a seed from dice or a photograph, write the words down on something physical, and treat the encrypted-storage feature as the convenience its authors say it is.</p>

      ${callout("If you take one thing from this page", `The stored mnemonic is not your backup. Krux says so itself, in its own documentation, and it is the single most likely misunderstanding to cost somebody their coins on this device. The words on paper or metal are the wallet. Everything on the device is a copy that happens to be convenient.`)}`
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
    summary: "A wallet with no recovery phrase to write down, because the company holds a third key you can call on. Setting it up, and the honest accounting of what that recovery service can and cannot do.",
    level: "beginner",
    minutes: 25,
    goals: ["setup"],
    tags: ["Mobile", "Assisted recovery"],
    icon: "bi-phone",
    updated: "2026-08-18",
    productGuide: true,
    status: "published",
    related: ["multisig-2of3", "choosing-your-first-setup", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Every other guide in this section ends with the same instruction: write twenty-four words on something durable and never lose them. Bitkey does not have those words. There is nothing to write down, nothing to hide, and nothing to lose in a house fire.</p>

      <p>That is not a shortcut around the problem. It is a different answer to it. Instead of one secret that must survive forever, Bitkey splits control across three keys and requires any two to spend &mdash; a hardware device, your phone, and a key held by Block, the company behind it, purely so that you can recover if one of yours goes missing.</p>

      <p>Whether that is a good trade depends entirely on details most reviews skip, so this page sets up the wallet and then does the accounting: precisely what Block can do, what it cannot, and what happens to your coins if the company vanishes tomorrow.</p>

      ${figureSlot({
        shot: "A Bitkey hardware device resting on a phone showing the Bitkey app, shot from above on a plain surface, no seed backup card anywhere in frame.",
        caption: "Two of the three keys. The third is somewhere else entirely, and that is the point.",
        ratio: "16 / 9",
        icon: "bi-phone"
      })}

      ${prerequisites([
        "<strong>The Bitkey hardware device.</strong> It sells for around CA$360 and includes the fingerprint sensor and screen you will approve transactions on.",
        "<strong>A phone</strong>, iOS or Android, with NFC. The app and the hardware talk by tapping rather than by cable.",
        "<strong>A cloud account you actually control</strong> &mdash; iCloud or Google Drive &mdash; for the encrypted backup of your phone's key.",
        "<strong>Ten minutes and no bitcoin.</strong> As always, fund nothing until the check at the end passes."
      ])}

      <h2><span class="sc-article-num">1</span>The three keys, and who holds them</h2>

      <p>Bitkey is a 2-of-3 multisig wallet. Three keys exist, any two can move coins, and no single key can do anything alone. If the shape of that is unfamiliar, <a href='multisig-2of3.html'>the 2-of-3 guide</a> covers the concept properly &mdash; the difference here is who holds what.</p>

      ${checklist([
        "<strong>The hardware key</strong> lives on the Bitkey device, unlocked by your fingerprint. It never leaves.",
        "<strong>The app key</strong> lives on your phone, with an encrypted copy backed up to your cloud account.",
        "<strong>The recovery key</strong> is held by Block. It exists solely to help you replace one of the other two, and it is never used in your ordinary spending."
      ])}

      <p>Two of those three are yours, which is the whole architecture in one sentence: <strong>you can always spend without asking anyone, and nobody can spend without you.</strong> Block holding one key of three means they can participate in a recovery. It does not mean they can move your coins, because one key of three moves nothing.</p>

      <h2><span class="sc-article-num">2</span>Setting it up</h2>

      <p>This is the easiest setup on the site, deliberately so. There is no seed to transcribe and no quiz to pass.</p>

      ${checklist([
        "<strong>Install the Bitkey app</strong> and create your wallet in it.",
        "<strong>Pair the hardware device</strong> by tapping it against the phone. NFC does the rest.",
        "<strong>Enrol your fingerprint</strong> on the device. This is what authorises the hardware key to sign.",
        "<strong>Complete the cloud backup</strong> when prompted. This is not optional in practice &mdash; it is what makes losing your phone a minor inconvenience instead of a recovery ordeal.",
        "<strong>Add one or two trusted contacts</strong> in settings. They cannot see or spend your bitcoin; they can only help you prove you are you if things go badly."
      ])}

      <h2><span class="sc-article-num">3</span>What &ldquo;no seed phrase&rdquo; actually changes</h2>

      <p>Removing the recovery phrase removes the single most common way people lose bitcoin: a backup that was never written down, written down wrong, lost, destroyed, or photographed and stolen. That is a genuine and substantial win, and it is why this device exists.</p>

      <p>It also removes something. A seed phrase is portable &mdash; twenty-four words restore into any wallet software, from any maker, decades from now, with nobody's permission. You do not have that here. Your recovery path is Bitkey's recovery path.</p>

      ${pullQuote("A recovery phrase is a thing you must protect forever. Bitkey trades that burden for a dependency. Neither is free, and pretending otherwise is how people choose badly.")}

      <p>The rest of this page is about that dependency, because it is the part worth understanding before you fund the wallet rather than after.</p>

      <h2><span class="sc-article-num">4</span>The recovery routes</h2>

      <p>Bitkey has four separate mechanisms, and which one applies depends on what you lost.</p>

      <div class="sc-bitkey-recovery-panel" aria-label="What to expect when something goes missing">
        <div class="sc-bitkey-recovery-heading">
          <span class="sc-bitkey-recovery-mark" aria-hidden="true">2<span>/3</span></span>
          <div><span>Recovery map</span><h3>Four ways back in</h3></div>
          <strong>What you lose decides the route</strong>
        </div>
        <div class="sc-bitkey-recovery-grid">
          <article class="is-cloud">
            <span class="sc-bitkey-loss">Phone lost</span>
            <h3>Your phone, with its cloud backup intact</h3>
            <dl><div><dt>Recovery route</dt><dd>Cloud Recovery</dd></div><div><dt>Expected time</dt><dd>Seconds</dd></div></dl>
          </article>
          <article class="is-delay">
            <span class="sc-bitkey-loss">One key lost</span>
            <h3>A key is genuinely gone, but you hold the other</h3>
            <dl><div><dt>Recovery route</dt><dd>Delay + Notify</dd></div><div><dt>Expected time</dt><dd>7 days</dd></div></dl>
          </article>
          <article class="is-contacts">
            <span class="sc-bitkey-loss">Both keys lost</span>
            <h3>Your phone and hardware are both unavailable</h3>
            <dl><div><dt>Recovery route</dt><dd>Trusted contacts, or Delay + Notify</dd></div><div><dt>Expected time</dt><dd>Up to 7 days</dd></div></dl>
          </article>
          <article class="is-inheritance">
            <span class="sc-bitkey-loss">Inheritance</span>
            <h3>You are unavailable in the estate sense</h3>
            <dl><div><dt>Recovery route</dt><dd>Claim by your beneficiary</dd></div><div><dt>Expected time</dt><dd>6 months</dd></div></dl>
          </article>
        </div>
      </div>

      <p><strong>Cloud Recovery</strong> is the everyday case. Your encrypted app key comes back from iCloud or Google Drive onto a new phone, and you are working again in seconds.</p>

      <p><strong>Delay + Notify</strong> is the one to understand properly, because it behaves differently from how people assume. You start it with the key you still have, then wait seven days while Bitkey notifies you repeatedly and offers to cancel. At the end, it does <em>not</em> restore your old wallet &mdash; it builds a new one with new keys and moves your funds across.</p>

      <p>That design is deliberate and rather good. It means a key you lost, if it ever surfaces in the wrong hands, is cryptographically disconnected from the wallet holding your coins. It also means recovery is an on-chain transaction, so it costs a network fee and your addresses change.</p>

      ${callout("Why seven days is a feature, not friction", "The delay exists so that a recovery started by somebody who is not you cannot complete quietly. You get notified throughout and can cancel at any point. An attacker who somehow got one of your keys still has to wait a week in full view of you &mdash; which is precisely the window in which you stop them.")}

      <p><strong>Inheritance</strong> runs the same idea over six months. You name another Bitkey owner as beneficiary; their claim starts a long, loudly-notified clock, and until it completes they learn nothing &mdash; not even your balance.</p>

      <h2><span class="sc-article-num">5</span>What Block can and cannot do</h2>

      <p>The honest accounting, since this is the question the whole product turns on.</p>

      ${checklist([
        "<strong>They cannot spend your bitcoin.</strong> One key of three authorises nothing. This is arithmetic, not a promise in a terms-of-service document.",
        "<strong>They cannot freeze your wallet.</strong> You hold two keys, which is a spending majority, and you never need their participation to transact.",
        "<strong>They can take part in replacing a lost key</strong> &mdash; which is the service you bought &mdash; but only through a process that notifies you and gives you seven days to stop it.",
        "<strong>They know your wallet exists</strong>, and the addresses in it. This is a real privacy cost, and it is not one the multisig arithmetic removes."
      ])}

      ${cautions([
        "A company that can help you recover is a company with something worth attacking. The seven-day delay is what stands between a compromise at Block and a compromise of your coins.",
        "Assisted recovery means an identifiable relationship with a business. If your reason for holding bitcoin is that nobody should know you hold it, this is the wrong product.",
        "Trusted contacts are people. Choose ones who will still be reachable, and still like you, in five years."
      ])}

      <h2><span class="sc-article-num">6</span>If Bitkey disappeared tomorrow</h2>

      <p>This is the question to ask of any wallet with a company inside it, and it is the one most such products answer badly.</p>

      <p>Bitkey's answer is the <strong>Emergency Exit Kit</strong>: a way to move your funds using your own two keys, without Bitkey's servers being involved at all. Because you hold a spending majority, the company's participation was never required to spend &mdash; the exit kit is what lets you exercise that fact if their infrastructure is gone.</p>

      ${checklist([
        "<strong>Generate and store the Emergency Exit Kit when you set the wallet up</strong>, not when you need it. A tool that lives only on a server you can no longer reach is not a contingency.",
        "<strong>Keep it where you would have kept a seed backup.</strong> The phrase went away; the discipline of an offline copy somewhere safe did not.",
        "<strong>Understand it before you need it.</strong> Read what it does now, while nothing is urgent."
      ])}

      <h2><span class="sc-article-num">7</span>Before you fund it</h2>

      ${checklist([
        "Confirm the cloud backup completed, and that you can actually sign in to that cloud account independently.",
        "Generate and store the Emergency Exit Kit.",
        "Add your trusted contacts and tell them they are on the list.",
        "Send a small test amount, confirm it arrives, and send it back out &mdash; approving on the device screen, which is where you should always read the details.",
        "If you plan to hold a meaningful amount, rehearse a recovery on a wallet holding almost nothing first."
      ])}

      <h2>Who this is actually for</h2>

      <p>Bitkey is a good answer for somebody who wants genuine self-custody, knows themselves well enough to distrust their own filing, and would rather depend on a company's recovery process than on a piece of paper surviving a decade of house moves.</p>

      <p>It is the wrong answer for somebody whose priority is privacy from all counterparties, or who wants a wallet that can be restored into any software decades from now with nobody's help. Those people want a recovery phrase and the burden that comes with it.</p>

      ${callout("If you take one thing from this page", `Block cannot move your coins, and that is arithmetic rather than trust &mdash; two of three keys are yours. What you are actually buying is a recovery service, priced in a seven-day delay and a company knowing your wallet exists. Generate the Emergency Exit Kit on day one, and the dependency stays a convenience rather than a trap.`)}`
  },
  {
    slug: "tapsigner-setup",
    category: "devices",
    products: ["tapsigner"],
    title: "TAPSIGNER: setup and NFC signing",
    summary: "A bitcoin key in a credit card, signing by tap. Initialising it, the backup that must happen before you fund it, and the one number printed on the card that you have to copy down before it goes anywhere.",
    level: "beginner",
    minutes: 20,
    goals: ["setup"],
    tags: ["NFC", "Card"],
    icon: "bi-credit-card-2-front",
    updated: "2026-08-18",
    productGuide: true,
    status: "published",
    related: ["satscard-setup", "nunchuk-setup", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">A TAPSIGNER is a bitcoin key inside a credit card. There is no screen, no battery, and no buttons &mdash; you build a transaction in a wallet app on your phone, hold the card against the back of it, and the card signs. The key itself never leaves the chip.</p>

      <p>It is the least intrusive hardware wallet available: it lives in a wallet next to your bank cards and costs about as much as a nice dinner. That convenience is bought with one specific compromise, which this page will not bury &mdash; and there is a number printed on the card that you must copy down before the card ever leaves your desk.</p>

      ${figureSlot({
        shot: "A TAPSIGNER card held against the back of a phone showing a wallet app mid-signature, shot close, the card's printed back not legible.",
        caption: "The entire interface. Everything you check happens on the phone, which is the trade worth understanding.",
        ratio: "16 / 9",
        icon: "bi-credit-card-2-front"
      })}

      ${prerequisites([
        "<strong>A TAPSIGNER card</strong>, bought from Coinkite or an authorised reseller.",
        "<strong>A phone with NFC</strong> and one of the supported wallet apps &mdash; Nunchuk, Cove, Bitcoin Keeper, or Sparrow on desktop.",
        "<strong>Somewhere to store an encrypted backup file</strong> that is not only your phone.",
        "<strong>A pen.</strong> Genuinely &mdash; see step 3.",
        "No bitcoin yet. Do not fund this card until the backup exists and the check at the end passes."
      ])}

      <h2><span class="sc-article-num">1</span>What it is, and the one thing it cannot do</h2>

      <p>The card holds a single BIP-32 master key in a secure element and signs with it on request. Your wallet app does everything else: watching balances, choosing coins, building transactions, and broadcasting them.</p>

      <p>The compromise is the missing screen. Every other hardware wallet shows you the amount and the destination on its own display, precisely so that a compromised computer cannot show you one transaction while asking you to sign another. A TAPSIGNER has no display, so <strong>it signs what it is given and cannot tell you what that is.</strong></p>

      ${callout("What that actually means for you", "Your phone becomes the thing you are trusting to tell the truth about a payment. That is a real step down from a device with its own screen, and it is the reason to think of a TAPSIGNER as an excellent everyday key rather than the place to keep your life savings.")}

      <h2><span class="sc-article-num">2</span>Pair it with a wallet</h2>

      <p>Setup happens through the wallet app rather than on the card, and takes a couple of minutes.</p>

      ${checklist([
        "<strong>Open your wallet app and add a TAPSIGNER</strong> as a new key or signer.",
        "<strong>Let it verify the factory certificate.</strong> The card proves it is genuine Coinkite hardware and not a substitute. Do not skip past a failure here.",
        "<strong>Create the key on the card.</strong> It generates its own BIP-32 master key internally; nothing is imported and nothing is typed.",
        "<strong>Find the CVC.</strong> A six-digit code is printed on the back of the card &mdash; the spend code, sometimes called the starting PIN. You will need it for every signature, and you can change it later."
      ])}

      <h2><span class="sc-article-num">3</span>The backup, and the number on the card</h2>

      <p>This is the most important section on this page, and the step people skip because the card works fine without it.</p>

      <p>A TAPSIGNER has no recovery words. Instead, it gives you an <strong>encrypted backup file</strong> containing your master key. That file is encrypted with a 128-bit AES key, and that key is <em>printed on the back of the card</em>.</p>

      <p>Read that again, because two conclusions follow and they point in opposite directions.</p>

      ${cautions([
        "<strong>Lose the card and you lose the decryption key with it</strong> &mdash; unless you copied it down first. The backup file alone is inert. Copy the printed key onto paper, now, before the card goes into a wallet or a drawer or a pocket.",
        "<strong>Anyone holding both the file and that printed key has your wallet.</strong> They do not need the card, and they do not need the CVC. A photograph of the back of your card plus a copy of your backup file is a complete theft.",
        "<strong>So store them apart.</strong> The printed key and the backup file in the same place is the same mistake as a seed phrase photographed next to its hardware wallet."
      ])}

      <p>There is also no restoring back onto the card. Recovery decrypts the master key so you can load it into other software &mdash; the original card is not part of the picture. That is fine, and worth knowing before the day you need it.</p>

      ${pullQuote("The card is the convenience. The backup file and the number printed on its back are the wallet. Treat those two the way you would treat twenty-four words.")}

      <h2><span class="sc-article-num">4</span>Signing a transaction</h2>

      <p>Day to day, this is the whole workflow and it is genuinely pleasant:</p>

      ${checklist([
        "Build the payment in your wallet app as usual.",
        "<strong>Check the amount and the destination address on the phone screen.</strong> This is your only opportunity &mdash; the card will not show you anything.",
        "Enter the CVC when prompted.",
        "Hold the card flat against the back of the phone until the app confirms. Finding the NFC sweet spot takes a couple of tries the first time.",
        "The wallet broadcasts the signed transaction."
      ])}

      <h2><span class="sc-article-num">5</span>Before you fund it</h2>

      ${checklist([
        "Confirm the backup file exists and is stored somewhere that is not just your phone.",
        "Confirm you have written the printed decryption key down, separately from that file.",
        "Change the CVC from the printed default if your wallet app supports it, and record the new one.",
        "Send a small test amount, confirm it arrives, then sign a transaction sending it back out.",
        "Consider where this card fits: excellent as an everyday spending key, or as one key of a <a href='multisig-2of3.html'>multisig</a> where the other signers have screens."
      ])}

      <h2>The short version</h2>

      <p>A TAPSIGNER is a key in a card that signs by tap and never reveals itself. It has no screen, so your phone is what you are trusting about each payment. Its backup is an encrypted file whose decryption key is printed on the card &mdash; copy that number down before the card leaves your desk, and never store the copy beside the file.</p>

      ${callout("If you take one thing from this page", `Copy the decryption key off the back of the card today. Everything else here can be fixed later; that number cannot be recovered once the card is gone, and without it the backup file is a permanently locked box.`)}`
  },
  {
    slug: "satscard-setup",
    category: "devices",
    products: ["satscard"],
    title: "SATSCARD: loading and unsealing",
    summary: "Ten slots, one sealed at a time, and bitcoin that travels with the physical card. How to load one, what to check before accepting one, and why unsealing is a door that only opens once.",
    level: "beginner",
    minutes: 15,
    goals: ["setup", "learn"],
    tags: ["NFC", "Card"],
    icon: "bi-credit-card-2-front",
    updated: "2026-08-18",
    productGuide: true,
    status: "published",
    related: ["tapsigner-setup", "keys-addresses-utxos", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">A SATSCARD looks almost exactly like a <a href='tapsigner-setup.html'>TAPSIGNER</a> and does something close to the opposite. A TAPSIGNER is a key that signs and never reveals itself. A SATSCARD is a key you eventually <em>do</em> reveal &mdash; because revealing it is how the coins come out.</p>

      <p>It is a bearer instrument. Load bitcoin onto it, hand the physical card to somebody, and the bitcoin is theirs &mdash; no transaction, no fee, no confirmation wait. Whoever holds the card holds the coins, exactly like cash, with all of the same qualities and all of the same dangers.</p>

      <p>This is a genuinely useful object and a terrible place to keep savings. Both of those are worth understanding before you buy one.</p>

      ${figureSlot({
        shot: "A SATSCARD being passed from one hand to another across a cafe table, card face visible, no screen or electronics apparent.",
        caption: "The entire transfer mechanism. Nothing touches the blockchain at the moment the value changes hands.",
        ratio: "16 / 9",
        icon: "bi-credit-card-2-front"
      })}

      <h2><span class="sc-article-num">1</span>Ten slots, one at a time</h2>

      <p>Each SATSCARD contains ten independent slots, each holding its own private key and its own address. Exactly one slot is active at any moment, and it is in one of two states.</p>

      ${checklist([
        "<strong>Sealed.</strong> The slot has an address you can fund and read, but the private key is locked inside the chip. Nobody &mdash; including you, including Coinkite &mdash; can extract it.",
        "<strong>Unsealed.</strong> The private key has been released. The slot is finished, and the card automatically advances to the next one."
      ])}

      <p>That is the whole mechanism. A sealed slot is a container the coins sit in; unsealing is opening it, and there is no closing it again.</p>

      <h2><span class="sc-article-num">2</span>Loading one</h2>

      <p>Tap the card against an NFC phone with a compatible app and it will show you the current slot's address. Send bitcoin to that address as you would to any other, and wait for it to confirm.</p>

      <p>There is no setup, no PIN, and no pairing. The card was ready when it arrived.</p>

      ${cautions([
        "Fund the <em>currently sealed</em> slot's address only. An old address from a slot you already unsealed is not yours in any meaningful sense any more.",
        "The card cannot tell you a balance. It tells you an address; the blockchain tells you the balance. Check with a block explorer or a wallet."
      ])}

      <h2><span class="sc-article-num">3</span>Handing it over</h2>

      <p>This is the point of the object. You give somebody the card, and the bitcoin at the sealed slot goes with it. Nothing is broadcast, nothing is confirmed, no fee is paid, and the blockchain does not record that anything happened &mdash; because on-chain, nothing did.</p>

      <p>The coins have not moved. Control of them has, because control was always physical.</p>

      <h2><span class="sc-article-num">4</span>Accepting one from somebody else</h2>

      <p>If you are on the receiving end, this is where your attention belongs, because a card in your hand proves less than it appears to.</p>

      ${checklist([
        "<strong>Verify the card is genuine</strong> through the app's authenticity check.",
        "<strong>Confirm the slot is still sealed.</strong> An unsealed slot means the key is already out in the world.",
        "<strong>Check the address matches</strong> what the app reports for the current slot.",
        "<strong>Look up the funding on-chain</strong> and confirm the amount is really there and confirmed."
      ])}

      ${callout("What those checks cannot tell you", "They prove the card is authentic and the slot is sealed. They cannot prove nobody photographed or copied anything along the way, and they cannot tell you who held the card before. A sealed slot is strong evidence, not a custody history. Accept a SATSCARD from a stranger the way you would accept a hundred-dollar note from one — for amounts where being wrong is survivable.")}

      <h2><span class="sc-article-num">5</span>Unsealing, which happens once</h2>

      <p>When you want the coins in a wallet of your own rather than on a card, you unseal. The chip releases the private key, the slot is spent as a concept, and the card moves on to the next slot.</p>

      <p>The rule that follows is absolute and worth stating flatly:</p>

      ${pullQuote("Sweep the entire balance to a wallet you control, immediately, and never send anything to that address again.")}

      <p>Once unsealed, that private key exists outside the chip. It is on your phone, in your app, and possibly in places you did not intend. The address it controls should be treated as public property from that moment onward.</p>

      ${cautions([
        "<strong>Unsealing is irreversible.</strong> There is no resealing a slot and no undoing the reveal.",
        "<strong>Sweep everything, not some.</strong> Leaving a remainder behind at an exposed address is how people lose the last of it.",
        "<strong>Never reuse the address</strong>, including months later when it looks like just another address in your history.",
        "<strong>Ten slots means ten uses.</strong> When the last one is unsealed the card is finished as a bearer instrument."
      ])}

      <h2><span class="sc-article-num">6</span>Why this is not savings</h2>

      <p>Everything that makes a SATSCARD good at handing bitcoin to someone in a pub makes it bad at holding bitcoin for a decade.</p>

      ${checklist([
        "<strong>There is no backup.</strong> No words, no file, no recovery. A lost card is lost coins, precisely as a dropped banknote is.",
        "<strong>There is no PIN.</strong> Whoever picks it up can unseal it. There is nothing to stop them and nothing to prove it was yours.",
        "<strong>It cannot sign.</strong> A SATSCARD is not a wallet and cannot participate in a transaction &mdash; it can only be funded, carried, and eventually opened.",
        "<strong>The design assumes a short life.</strong> Load, hand over, unseal, sweep. Every month it spends sitting in a drawer is a month of unnecessary risk."
      ])}

      <p>If you want a card-shaped device to hold a key for the long term, that is what a <a href='tapsigner-setup.html'>TAPSIGNER</a> is for. If you want to hand somebody bitcoin across a table, this is the better object by a distance.</p>

      <h2>The short version</h2>

      <p>Ten slots, one sealed at a time, funded like any address. Handing over the card hands over the coins with no transaction at all. Unsealing releases the key permanently, so sweep the whole balance immediately and never touch that address again. Treat the card as cash, in amounts you would carry as cash.</p>

      ${callout("If you take one thing from this page", `A sealed SATSCARD is a banknote with no serial number and no bank behind it. That is exactly what makes it useful for a physical handoff, and exactly why it should never hold more than you would be willing to lose in a coat pocket.`)}`
  },
  {
    slug: "air-gapped-psbt-workflow",
    category: "advanced",
    products: [],
    title: "The air-gapped PSBT workflow",
    summary: "How an unsigned transaction reaches an offline signer and a signature comes back, by microSD, QR, or NFC. What the file actually contains, why your device can be lied to, and the one output people never think to check.",
    level: "intermediate",
    minutes: 25,
    goals: ["harden", "learn", "multisig"],
    tags: ["PSBT", "Air-gapped"],
    icon: "bi-arrow-repeat",
    updated: "2026-08-18",
    status: "published",
    related: ["multisig-2of3", "seedsigner-setup", "sparrow-first-wallet"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Every air-gapped signer works the same way underneath. A wallet on your computer builds a transaction it cannot sign, that transaction crosses to a device holding keys but no network connection, the device signs, and the signature comes back. The gap is never bridged by a cable, and the private key never crosses it in either direction.</p>

      <p>The thing making the round trip is a <strong>PSBT</strong> &mdash; a partially signed bitcoin transaction. Four guides on this site mention it in passing; this one explains what is actually in it, because the contents are what determine whether your device can protect you or is merely signing whatever it is handed.</p>

      <p>There is also one output in every transaction that almost nobody thinks to check, and it is the one an attacker would use to rob you.</p>

      <h2><span class="sc-article-num">1</span>Two halves of a wallet</h2>

      <p>An air-gapped setup splits the job of "a wallet" into two pieces that never touch.</p>

      ${checklist([
        "<strong>The coordinator</strong> runs on your computer or phone &mdash; Sparrow, Nunchuk, Electrum, and the rest. It talks to the network, watches your balance, knows your addresses, chooses which coins to spend, and builds transactions. It holds no private keys and cannot sign anything.",
        "<strong>The signer</strong> is the offline device &mdash; a COLDCARD, SeedSigner, Krux, or similar. It holds the keys and can sign, but knows nothing about the blockchain, cannot see your balance, and has no idea what has happened since you last used it."
      ])}

      <p>Neither half can spend your bitcoin alone, and that is the entire architecture. The PSBT is how they cooperate without ever being connected.</p>

      <h2><span class="sc-article-num">2</span>What is actually in the file</h2>

      <p>A PSBT is not just an unsigned transaction. If it were, your signer would be helpless &mdash; it would see addresses and amounts it could not verify and would have to take them on faith.</p>

      <p>So the coordinator packs in everything the offline device needs to check the work itself:</p>

      ${checklist([
        "<strong>The transaction being proposed</strong> &mdash; which coins are being spent, and to which addresses, in what amounts.",
        "<strong>The full details of every input being spent.</strong> This is the part that matters most, and section 3 explains why.",
        "<strong>Derivation paths</strong>, so the device knows which of its keys apply to which input, and which outputs belong to your own wallet.",
        "<strong>Any signatures already collected</strong>, which is what makes multisig possible &mdash; each signer adds theirs and passes it along."
      ])}

      <p>The device reads all of that, works out the truth for itself, shows you the result on its own screen, and only then signs.</p>

      <h2><span class="sc-article-num">3</span>Why the input details matter</h2>

      <p>Here is a subtlety worth understanding, because it explains a design decision that otherwise looks like bloat.</p>

      <p>Your offline signer cannot look up the blockchain. If the PSBT told it only "you are spending these coins" without saying how much each one was worth, the device would have no way to calculate the fee &mdash; and the fee is simply whatever is left over after the outputs are paid.</p>

      <p>A dishonest coordinator could exploit exactly that. It tells the device the inputs are small, the device computes a modest fee and displays it, you approve, and the real transaction burns an enormous amount to the miner. You signed something whose true cost you were never shown.</p>

      ${callout("This is why a PSBT carries the value of every input", "Given the amounts, the device does its own arithmetic: total in, minus total out, equals fee. It is no longer repeating a number the computer told it &mdash; it is computing one and showing you the answer. Believe the number on the signer's screen, not the one on your monitor.")}

      <h2><span class="sc-article-num">4</span>Getting it across the gap</h2>

      <p>The PSBT has to physically travel. Four routes are in common use, and the choice is mostly about which device you own.</p>

      <div class="sc-psbt-routes-panel" aria-label="Transport options and what each costs you">
        <div class="sc-psbt-routes-heading">
          <span class="sc-psbt-routes-mark" aria-hidden="true"><i></i></span>
          <div><span>Transport layer</span><h3>Four ways across the gap</h3></div>
          <strong>QR + microSD preserve the air gap</strong>
        </div>
        <div class="sc-psbt-routes-grid">
          <article class="is-microsd">
            <div class="sc-psbt-route-title"><span>microSD</span><strong>Physical shuttle</strong></div>
            <div class="sc-psbt-route-track" aria-hidden="true"><span>Wallet</span><i>&rarr;</i><b>Card</b><i>&rarr;</i><span>Signer</span></div>
            <p>Coordinator writes a file; you carry the card to the signer and back.</p>
            <aside>Simple and reliable. The card has touched both machines, so dedicate one to this job.</aside>
          </article>
          <article class="is-qr">
            <div class="sc-psbt-route-title"><span>QR codes</span><strong>Optical only</strong></div>
            <div class="sc-psbt-route-track" aria-hidden="true"><span>Screen</span><i>&rarr;</i><b>Light</b><i>&rarr;</i><span>Camera</span></div>
            <p>Screens and cameras move larger transactions across several animated frames.</p>
            <aside>Nothing physical crosses. Complex transactions and poor screens can slow scanning down.</aside>
          </article>
          <article class="is-nfc">
            <div class="sc-psbt-route-title"><span>NFC</span><strong>Radio contact</strong></div>
            <div class="sc-psbt-route-track" aria-hidden="true"><span>Phone</span><i>&rarr;</i><b>Tap</b><i>&rarr;</i><span>Signer</span></div>
            <p>Tap the signing device against a compatible phone.</p>
            <aside>Fast and pleasant. Radio contact is still contact, so some people disable it on principle.</aside>
          </article>
          <article class="is-usb">
            <div class="sc-psbt-route-title"><span>USB</span><strong>Direct connection</strong></div>
            <div class="sc-psbt-route-track" aria-hidden="true"><span>Computer</span><i>&rarr;</i><b>Cable</b><i>&rarr;</i><span>Signer</span></div>
            <p>Connect the signing device directly to the computer.</p>
            <aside>Convenient, but not air-gapped. The signer is talking to a machine that may be compromised.</aside>
          </article>
        </div>
      </div>

      <p>Only the first two involve no electrical or radio connection whatsoever. If the reason you bought an air-gapped signer was to avoid that connection, using it over USB gives most of that back.</p>

      <h2><span class="sc-article-num">5</span>The output nobody checks</h2>

      <p>This is the section to read twice.</p>

      <p>A typical payment has two outputs, not one. There is the amount going to the person you are paying, and there is the <strong>change</strong> coming back to you &mdash; because coins are spent whole, and the remainder has to go somewhere.</p>

      <p>Everyone verifies the recipient address. Almost nobody looks at the change output, because it is "just my own money coming back". And that is precisely the gap.</p>

      ${pullQuote("A compromised coordinator does not need to alter the address you are watching. It only needs to alter the one you are not.")}

      <p>If malicious software sets the change address to one it controls, you would see a correct payment to your intended recipient, approve it, and unknowingly send the entire remainder of the coin to an attacker. The transaction looks perfect on the half of it you inspected.</p>

      <p>The defence is built into the PSBT, and it only works if your device is in a position to use it:</p>

      ${checklist([
        "<strong>The device verifies the change output derives from your own wallet.</strong> It has your keys, so it can check whether it could produce that address. If it cannot, the address is not yours.",
        "<strong>For single-sig, this works out of the box</strong>, because the device knows its own key and can derive its own addresses.",
        "<strong>For multisig, the device must know the whole wallet</strong> &mdash; every co-signer's public key. A change address in a 2-of-3 is derived from all three, and a device that has only seen its own key cannot tell a legitimate change address from a hostile one.",
        "<strong>So register the wallet on each signer</strong> before you fund a multisig. This is the step that makes change verification possible, and <a href='multisig-2of3.html'>the multisig guide</a> covers why that configuration matters for recovery too."
      ])}

      <h2><span class="sc-article-num">6</span>The round trip, start to finish</h2>

      ${checklist([
        "<strong>Build.</strong> The coordinator selects coins, sets the fee, and produces the PSBT.",
        "<strong>Transfer.</strong> The file goes across by card, camera, or tap.",
        "<strong>Verify on the signer.</strong> Amount, recipient, fee, and &mdash; where the device supports it &mdash; confirmation that the change is coming home. Read these on the signer's screen, which is the whole reason it has one.",
        "<strong>Sign.</strong> The device adds its signature into the PSBT. The key does not move.",
        "<strong>Transfer back</strong> the same way it came.",
        "<strong>Finalise and broadcast.</strong> The coordinator assembles the finished transaction and sends it to the network.",
        "<strong>For multisig, repeat</strong> steps two to five with each signer until enough signatures are collected."
      ])}

      <h2><span class="sc-article-num">7</span>When it goes wrong</h2>

      <p>Air-gapped signing fails in a small number of recognisable ways, and none of them put your coins at risk &mdash; an unsigned or unbroadcast transaction has changed nothing.</p>

      ${checklist([
        "<strong>The signer cannot find the file.</strong> Usually a card formatted the wrong way, or the file written to a folder the device does not look in.",
        "<strong>The animated QR will not scan.</strong> Raise the screen brightness, slow the animation if the coordinator allows it, and clean the camera lens. Transactions with many inputs make long animations.",
        "<strong>The device will not show a change address as its own.</strong> On multisig this almost always means the wallet was never registered on that device.",
        "<strong>The fee on the device does not match the computer.</strong> Stop. The device is doing arithmetic on real values; something is wrong on the other side.",
        "<strong>A signature is rejected as invalid.</strong> Typically the wrong device for the wallet, or a derivation path mismatch."
      ])}

      <h2><span class="sc-article-num">8</span>What the air gap does not do</h2>

      <p>Worth stating plainly, because "air-gapped" is often heard as a broader claim than it is.</p>

      ${cautions([
        "<strong>It does not make you private.</strong> The coordinator still talks to the network and still knows every address you own.",
        "<strong>It does not protect a bad backup.</strong> Losing your recovery words loses the wallet regardless of how the signing was done.",
        "<strong>It does not verify the recipient for you.</strong> If you pasted an address from a compromised source, the device faithfully signs a payment to the attacker &mdash; correctly, exactly as instructed.",
        "<strong>It does not help if you approve without reading.</strong> The screen is the protection. Skipping it removes the entire benefit of the arrangement."
      ])}

      <h2>The short version</h2>

      <p>A PSBT carries the proposed transaction plus everything an offline device needs to check it independently &mdash; including the value of every input, so the device computes the fee rather than believing one. It crosses the gap by card, camera, or tap, gets signed, and comes back to be broadcast. Verify on the signer's screen, and register multisig wallets on every device so change addresses can be verified too.</p>

      ${callout("If you take one thing from this page", `Check the change output, not just the recipient. Every other verification habit is widely taught; this is the one that gets skipped, and it is the one a compromised computer is counting on you skipping.`)}`
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
    related: ["coldcard-setup", "exchange-withdrawal", "sparrow-coin-control"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">A hardware wallet on its own cannot tell you what you own. It holds keys and signs things; it has no idea what is on the blockchain. Sparrow is the other half &mdash; the part that watches the network, builds transactions, and hands them to your device to be signed.</p>

      <p>The arrangement is deliberate. Sparrow never sees a private key. It imports your <em>public</em> keys, which is enough to see your balance and construct a spend, but not enough to authorise one. Your device keeps the only thing that matters, and the computer is treated as untrusted throughout.</p>

      <p>This takes about half an hour, and covers the piece most people get wrong: verifying a receive address on the device rather than on the screen.</p>

      ${figure({
        src: "../assets/img/sparrow-laptop-hardware-wallet.jpg",
        alt: "A laptop on a desk running the Sparrow bitcoin wallet, showing a transaction list and balance",
        caption: "The Sparrow interface: balance, transaction history, and the tools to build a spend.",
        width: 1300,
        height: 726
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

      <p class="mt-4"><a class="sc-text-link" href="quickstart.html">Then test your recovery <i class="bi bi-arrow-right"></i></a></p>`
  },
  {
    slug: "sparrow-coin-control",
    category: "software",
    products: ["sparrow"],
    title: "Sparrow: coin control and labelling",
    summary: "Your balance is not a number, it is a pile of separate chunks — and which ones you spend together tells anyone watching that they belong to the same person.",
    level: "intermediate",
    minutes: 25,
    goals: ["harden", "learn", "privacy"],
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
    goals: ["setup", "multisig"],
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
    summary: "A Bitcoin-only phone wallet that can hold a little money itself or drive a hardware signer over QR and NFC. Setting up both, and being clear about which screen you are actually trusting.",
    level: "beginner",
    minutes: 20,
    goals: ["setup"],
    tags: ["Mobile", "Bitcoin-only"],
    icon: "bi-phone",
    updated: "2026-08-18",
    productGuide: true,
    status: "published",
    related: ["air-gapped-psbt-workflow", "tapsigner-setup", "choosing-your-first-setup"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Cove is an open-source, Bitcoin-only wallet for iOS and Android. It will happily hold a small amount of bitcoin itself, and it will also act as the coordinator for a hardware signer &mdash; building transactions, passing them to a COLDCARD or a TAPSIGNER over QR or NFC, and broadcasting what comes back.</p>

      <p>That second job is the interesting one. Most people assume driving a hardware wallet means sitting at a desktop with Sparrow or Electrum. Cove puts that whole workflow on a phone, which for a lot of people is the difference between using their hardware wallet and leaving it in a drawer.</p>

      <p>It also means being honest about which screen you are trusting, and that depends entirely on which signer you pair with. This page sets up both modes and then makes that distinction explicit.</p>

      ${figureSlot({
        shot: "A phone running Cove displaying a QR code, propped beside a hardware signer that is scanning it, on a plain desk with no computer in sight.",
        caption: "The whole coordinator, in a pocket. No desktop involved anywhere in this loop.",
        ratio: "16 / 9",
        icon: "bi-phone"
      })}

      ${prerequisites([
        "<strong>A phone</strong>, iOS or Android. NFC if you want to tap-sign with a card.",
        "<strong>Optionally, a hardware signer.</strong> Cove works with COLDCARD, TAPSIGNER, Krux, SeedSigner, Blockstream Jade, and Foundation Passport.",
        "<strong>Somewhere to write recovery words</strong>, if you are creating a wallet on the phone itself.",
        "No bitcoin yet. Fund nothing until the check at the end passes."
      ])}

      <h2><span class="sc-article-num">1</span>Three ways to use it</h2>

      <p>Decide which of these you are doing before you start, because the security properties are completely different.</p>

      ${checklist([
        "<strong>A hot wallet.</strong> Cove generates and holds the keys on your phone. Convenient, genuinely useful, and appropriate for spending money rather than savings.",
        "<strong>A watch-only wallet.</strong> Import an xpub or a descriptor and Cove shows balances and builds transactions, but holds no keys and can sign nothing.",
        "<strong>A coordinator for a hardware signer.</strong> The keys stay on the hardware; Cove does everything else. This is the setup worth aiming for if you hold a meaningful amount."
      ])}

      <p>The first and third are not rivals. <a href='choosing-your-first-setup.html'>A spending wallet and a savings wallet</a> is the shape most people should end up with, and Cove can be either.</p>

      <h2><span class="sc-article-num">2</span>Creating a hot wallet</h2>

      <p>If you want a phone wallet for everyday amounts, this takes two minutes.</p>

      ${checklist([
        "<strong>Install Cove</strong> from the App Store or Google Play and choose to create a new wallet.",
        "<strong>Write the recovery words down on paper or metal</strong>, in order, before going any further. These are ordinary BIP39 words and they restore into any wallet, so this backup is genuinely portable.",
        "<strong>Set the app lock</strong> &mdash; a PIN or biometrics. This protects the app on an unlocked phone; it is not what protects the coins.",
        "<strong>Decide about cloud backup.</strong> Cove offers an end-to-end encrypted cloud backup protected by passkeys. It is a real convenience and it is not a substitute for the written words."
      ])}

      ${cautions([
        "A hot wallet's keys live on a phone that browses the internet, installs apps, and gets left on tables. Keep the balance to what you would carry in a physical wallet.",
        "The encrypted cloud backup depends on your cloud account and your passkeys. Words on metal depend on nothing."
      ])}

      <h2><span class="sc-article-num">3</span>Pairing a hardware signer</h2>

      <p>This is where Cove earns its place. Import the signer's public keys and Cove becomes the coordinator while the private keys never leave the device.</p>

      ${checklist([
        "<strong>Choose to import a hardware wallet</strong> and pick the transfer method your device supports.",
        "<strong>By QR</strong> &mdash; hold the phone up to the device's screen. Cove reads both BBQr and UR, the two formats used to split large payloads across animated codes.",
        "<strong>By NFC</strong> &mdash; tap the device or card against the phone.",
        "<strong>By file</strong> &mdash; import the export your device wrote to a microSD card.",
        "<strong>Confirm the fingerprint matches</strong> what the device shows. This is the check that proves Cove is watching the wallet your device will actually sign for."
      ])}

      <h2><span class="sc-article-num">4</span>Signing from a phone</h2>

      <p>The round trip is the standard <a href='air-gapped-psbt-workflow.html'>air-gapped PSBT workflow</a>, with the phone playing the part the desktop usually plays.</p>

      ${checklist([
        "Build the payment in Cove. It selects coins, sets a fee, and produces a PSBT.",
        "Pass it to the signer &mdash; show a QR code for the device's camera, tap over NFC, or write a file.",
        "<strong>Verify on the signer, then approve.</strong> More on this in the next section.",
        "Bring the signature back the same way.",
        "Cove finalises the transaction and broadcasts it."
      ])}

      <h2><span class="sc-article-num">5</span>Which screen are you trusting?</h2>

      <p>This is the part that decides how much this setup is really worth, and it depends on the signer rather than on Cove.</p>

      <p>The point of a hardware wallet with a display is that a compromised coordinator cannot lie to you about a payment: the device shows the amount and destination from the data it is signing, on hardware the attacker does not control.</p>

      ${checklist([
        "<strong>With a COLDCARD, Krux, SeedSigner, Jade, or Passport</strong>, that protection is intact. Read the amount, the address, and the fee on the device's own screen. The phone is just the thing that built the transaction.",
        "<strong>With a TAPSIGNER</strong>, there is no screen. The card signs what it is handed and cannot tell you what that is, so the phone display is the only thing you have. That is a reasonable trade for an everyday key and a poor one for savings &mdash; the <a href='tapsigner-setup.html'>TAPSIGNER guide</a> goes into it properly."
      ])}

      ${pullQuote("A hardware signer with a screen protects you from your coordinator. A signer without one asks you to trust it.")}

      <h2><span class="sc-article-num">6</span>The app-lock features, and their cost</h2>

      <p>Cove offers more than a PIN: there are trick PINs that wipe the app's data or open a decoy wallet, in the same spirit as the ones on a <a href='coldcard-advanced-features.html'>COLDCARD</a>.</p>

      <p>They carry the same trade, and it is worth stating in the same terms. Each one is a defence against somebody holding your phone, purchased with a new way to destroy your own access.</p>

      ${cautions([
        "<strong>A wipe is only survivable because of your written words.</strong> If the recovery words are not on paper or metal and tested, a wipe is a permanent loss rather than a clever defence.",
        "<strong>A decoy wallet you never funded is not convincing</strong>, and one you did fund is money you may hand over.",
        "<strong>Write down what you enabled</strong>, and keep that note with your backup. A trick PIN you have forgotten configuring is a trap you set for yourself."
      ])}

      <h2><span class="sc-article-num">7</span>Point it at your own server</h2>

      <p>By default a wallet app asks somebody else's server for your balance, which means telling that server every address you own. Cove lets you connect to your own Electrum or Esplora node instead.</p>

      <p>If you already run a node, this is a five-minute settings change that closes a real privacy leak. If you do not, it is the strongest argument for eventually running one &mdash; and nothing else in this guide depends on it.</p>

      <h2><span class="sc-article-num">8</span>Before you fund it</h2>

      ${checklist([
        "Confirm the recovery words are written down and stored offline, for a hot wallet.",
        "For a hardware setup, confirm the fingerprint in Cove matches the one on the device.",
        "Generate a receive address and <strong>verify it on the hardware device's screen</strong> before sending anything to it.",
        "Send a small test amount, confirm it arrives, then sign a transaction sending it back out.",
        "Only then move a balance you would mind losing."
      ])}

      <h2>The short version</h2>

      <p>Cove is a Bitcoin-only, open-source phone wallet that works as a hot wallet for spending money or as a coordinator for a hardware signer over QR, NFC, or file. Everything about how much that protects you comes down to whether the signer has a screen you can read the transaction on.</p>

      ${callout("If you take one thing from this page", `Putting the coordinator on your phone is a genuine convenience win and costs you nothing in security &mdash; as long as the device you pair with has its own display and you actually read it. Pair with something screenless and the phone becomes the thing you are trusting, which is the arrangement a hardware wallet exists to avoid.`)}`
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
    summary: "Import a public key and your phone can see the balance but never spend it. What that genuinely costs you, and the one thing you should not use the phone for — which is the thing it makes most tempting.",
    level: "beginner",
    minutes: 15,
    goals: ["setup", "privacy"],
    tags: ["Mobile", "Watch-only"],
    icon: "bi-phone",
    updated: "2026-08-18",
    productGuide: true,
    status: "published",
    related: ["sparrow-first-wallet", "how-wallets-find-coins", "bitcoin-privacy"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Your hardware wallet is in a safe. Your coordinator software is on a desktop at home. And you are standing somewhere else, wondering whether that payment arrived.</p>

      <p>A watch-only wallet solves exactly that. You give BlueWallet a public key, and the phone can see every address, every balance, and every transaction &mdash; while being completely unable to spend any of it. Lose the phone and you lose a phone.</p>

      <p>It is a genuinely good idea with one cost that is worth understanding before you do it, and one temptation you should refuse.</p>

      ${figureSlot({
        shot: "A phone showing a bitcoin balance, held in one hand outdoors, with no hardware wallet or computer anywhere nearby.",
        caption: "The whole point: the keys are somewhere else entirely, and it does not matter.",
        ratio: "16 / 9",
        icon: "bi-phone"
      })}

      ${prerequisites([
        "<strong>An existing wallet you already set up properly</strong>, with its keys on a hardware device. This guide adds a window onto it, not a new wallet.",
        "<strong>BlueWallet</strong> on iOS or Android.",
        "<strong>Your account's extended public key</strong> &mdash; the xpub, zpub, or output descriptor. Your hardware wallet or coordinator can export it, usually as a QR code."
      ])}

      <h2><span class="sc-article-num">1</span>What a watch-only wallet can and cannot do</h2>

      <p>An extended public key lets anyone derive every address in the account, but no private keys. That asymmetry is the whole feature.</p>

      ${checklist([
        "<strong>It can</strong> show your balance, your full transaction history, and every address you have used or will use.",
        "<strong>It can</strong> generate receive addresses and build unsigned transactions.",
        "<strong>It cannot</strong> sign anything, and therefore cannot move a single satoshi. There is no PIN to defeat and no setting to change &mdash; the capability is simply absent."
      ])}

      <p>So a stolen phone is a stolen phone. Whoever takes it gets a view of your finances and no ability to touch them.</p>

      <h2><span class="sc-article-num">2</span>The cost: a view is not nothing</h2>

      <p>That safety is real, and it makes people describe watch-only as risk-free. It is not &mdash; it is <em>theft</em>-free. The privacy cost is genuine and permanent.</p>

      <p>An xpub reveals every address in the account, past and future, so anyone holding it can see your complete balance and history forever, and you cannot revoke it. <a href='how-wallets-find-coins.html'>How wallets find coins</a> explains the mechanics properly; the practical consequence is what matters here.</p>

      ${cautions([
        "<strong>The phone itself is a copy of that xpub</strong>, sitting in the most frequently lost, stolen, and inspected device you own.",
        "<strong>By default your wallet asks somebody else's server</strong> for those balances, which tells that server every address you hold. See step 5.",
        "<strong>Border crossings and casual snooping</strong> reveal your total holdings to anyone who opens the app. Consider whether that is a picture you want available on your person."
      ])}

      <p>None of that means do not do it. It means do it deliberately, and consider watching only the account you actually need to watch rather than importing everything you own.</p>

      <h2><span class="sc-article-num">3</span>Importing the key</h2>

      ${checklist([
        "<strong>Export the extended public key</strong> from your hardware wallet or coordinator. Most devices will show it as a QR code; Sparrow, Electrum, and the rest can export one too.",
        "<strong>In BlueWallet, add a wallet and choose the watch-only type.</strong>",
        "<strong>Scan the QR code</strong>, or paste the key if you must. Scanning avoids retyping a long string incorrectly.",
        "<strong>Check the balance and the last few transactions match</strong> what your desktop coordinator shows. If they do not, you have imported a different account &mdash; often the wrong script type or derivation path.",
        "<strong>Name it clearly</strong>, something that tells you which physical device holds the keys. Future you will have forgotten."
      ])}

      <h2><span class="sc-article-num">4</span>The temptation to refuse</h2>

      <p>This is the section that justifies the page, so it is worth being blunt.</p>

      <p>A watch-only wallet can generate receive addresses. It is right there, on your phone, when somebody asks where to send you bitcoin. And the entire reason the phone is useful is that your hardware wallet is somewhere else &mdash; which means you cannot verify that address on the device screen.</p>

      ${pullQuote("The situation that makes the phone convenient is exactly the situation in which you cannot check its work.")}

      <p>Verifying receive addresses on the hardware device's own screen is the standard defence against malware substituting an address, and it is covered in <a href='sparrow-first-wallet.html'>the Sparrow guide</a>. On a phone away from your device, that check is unavailable.</p>

      ${checklist([
        "<strong>For small amounts</strong>, taking an address from the phone is a reasonable everyday risk, the same judgement you make with any hot wallet.",
        "<strong>For anything significant</strong>, wait. Go home, generate the address in your coordinator, and verify it on the hardware device before handing it over.",
        "<strong>Never use a phone-generated address for an exchange withdrawal of real size.</strong> That is precisely the transaction worth attacking, and precisely the one where you skipped the check."
      ])}

      <h2><span class="sc-article-num">5</span>Choose what it talks to</h2>

      <p>By default, BlueWallet asks a public Electrum server for your balances, which hands that server your addresses and links them to your IP address.</p>

      <p>BlueWallet can connect to your own node instead. If you run one, change this in settings &mdash; it closes the leak described in step 2 in a single step, and <a href='bitcoin-privacy.html'>the privacy guide</a> explains why it matters more than most other measures.</p>

      <h2><span class="sc-article-num">6</span>Two things worth knowing about the app</h2>

      ${checklist([
        "<strong>It can graduate to signing.</strong> BlueWallet works with COLDCARD, Passport, Jade, Keystone, and other PSBT-compatible devices, so the same app can later run the full sign-and-broadcast loop if you want it to. Watch-only is simply the safest place to start.",
        "<strong>Lightning is a separate thing in the same app.</strong> A Lightning balance is not your cold storage and does not live behind your hardware wallet. Keep the two mentally separate, and do not let a Lightning setup blur what your watch-only wallet is for."
      ])}

      <h2>The short version</h2>

      <p>Import an extended public key and your phone becomes a window onto cold storage that cannot spend anything. The price is that the phone now carries a permanent, unrevocable view of your finances, so point it at your own node if you can. And do not take receive addresses from it for amounts that matter, because the device that could verify them is exactly the device you left at home.</p>

      ${callout("If you take one thing from this page", `Watch-only protects you from theft, not from being watched. Treat the phone as a read-only dashboard: excellent for answering "did it arrive?", and the wrong tool for answering "where should they send it?"`)}`
  },
  {
    slug: "wasabi-coinjoin-basics",
    category: "software",
    products: ["wasabi"],
    title: "Wasabi: what CoinJoin does and costs",
    summary: "How a collaborative transaction breaks the link between your coins and your history, what it cannot undo, and why the piece that makes it work is also the piece that has already collapsed once.",
    level: "advanced",
    minutes: 30,
    goals: ["harden", "learn", "privacy"],
    tags: ["Privacy", "CoinJoin"],
    icon: "bi-shuffle",
    updated: "2026-08-18",
    productGuide: true,
    status: "published",
    related: ["bitcoin-privacy", "sparrow-coin-control", "how-fees-work"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">The bitcoin ledger is public, and the default assumption an analyst makes about it is simple: if several coins are spent together in one transaction, one person owned all of them. That heuristic is right often enough to build an industry on, and it is how a chain of ordinary payments turns into a map of your finances.</p>

      <p>A CoinJoin is a transaction constructed specifically to make that assumption wrong. Many people contribute coins to a single transaction that pays out many identical amounts, and an observer looking at the result cannot say which output belongs to which contributor.</p>

      <p>It works. It is also the most misunderstood tool in bitcoin, it costs more than money, and the infrastructure it depends on has already failed once in a way worth understanding before you rely on it.</p>

      <h2><span class="sc-article-num">1</span>What the transaction actually does</h2>

      <p>Several participants each contribute inputs. The transaction pays out a large number of outputs in identical denominations, one or more of them yours.</p>

      <p>Afterwards, an observer sees that a coin left your address and entered the CoinJoin, and sees a set of equal outputs come out. What they cannot do is say which of those outputs is yours &mdash; every one of them is an equally plausible candidate. That set of candidates is your <strong>anonymity set</strong>, and its size is roughly the strength of what you bought.</p>

      <p>Wasabi implements this through the WabiSabi protocol, which matters for one specific reason: the coordinator organising the round cannot itself link your inputs to your outputs. It is arranging a transaction it cannot fully see.</p>

      ${callout("What the coordinator can never do", "It cannot take your coins. At no point does anyone else hold them &mdash; you sign an input to a transaction that only becomes valid once every participant has signed. A dishonest or vanished coordinator can waste your time and leak information; it cannot steal.")}

      <h2><span class="sc-article-num">2</span>What it does not do</h2>

      <p>This is the section that matters most, because almost every disappointed CoinJoin user misunderstood one of these.</p>

      ${cautions([
        "<strong>It does not erase your history.</strong> The transaction that put those coins in your wallet is still on the chain forever. CoinJoin breaks the link going forward; it does not rewrite what came before.",
        "<strong>It does not hide that you used it.</strong> CoinJoins are conspicuous. Anyone watching sees you entering one &mdash; they simply cannot follow you out.",
        "<strong>It does not protect you from your own consolidation.</strong> Spending several mixed outputs together in one later transaction tells the world they share an owner, undoing precisely what you paid for.",
        "<strong>It does not break a KYC link at the exit.</strong> Send mixed coins to an exchange account in your name and you have re-attached your identity to them yourself.",
        "<strong>It does not fix a leaky wallet.</strong> If your software is querying a public server about every address you own, that leak continues regardless."
      ])}

      <p>Every item on that list is a way the user, not the protocol, gives the privacy back. <a href='sparrow-coin-control.html'>Coin control</a> is the discipline that prevents most of them, and it is not optional if you intend this to mean anything.</p>

      <h2><span class="sc-article-num">3</span>The coordinator problem</h2>

      <p>Here is the part most guides skip, and it is the reason this page exists.</p>

      <p>A CoinJoin needs someone to organise the round &mdash; to gather participants, collect the registrations, and assemble the transaction. In Wasabi that role is the coordinator, and for years it was operated by zkSNACKs, the company that built the wallet.</p>

      <p><strong>In June 2024, zkSNACKs shut that service down</strong>, citing the regulatory climate. The wallet did not stop working, but its default coordinator ceased to exist, and every user had to find another one.</p>

      <p>What followed is genuinely interesting. Wasabi shipped an interface for choosing any third-party coordinator, community operators appeared within days, former developers continued maintaining the open-source code, and forks emerged with their own defaults. The wallet survived by decentralising the role that had just been removed.</p>

      ${pullQuote("The cryptography was never the fragile part. The company willing to run a server was.")}

      <p>That leaves you making a choice the software used to make for you:</p>

      ${checklist([
        "<strong>You must select a coordinator</strong> before you can CoinJoin at all. Wasabi's own documentation now points you to third-party coordination service providers rather than shipping one of its own.",
        "<strong>Coordinators charge what they choose.</strong> Fees are set by the operator, not by the protocol, so they vary.",
        "<strong>A coordinator can refuse to serve you</strong>, and there is precedent &mdash; the original coordinator filtered certain transactions, which was controversial precisely because it showed the capability existed.",
        "<strong>A coordinator can disappear</strong>, as the original one did. Assume any given one is temporary."
      ])}

      <h2><span class="sc-article-num">4</span>What it costs</h2>

      <p>Three separate costs, and only one is denominated in money.</p>

      ${checklist([
        "<strong>Coordinator fees.</strong> Set by whoever runs the round.",
        "<strong>Mining fees.</strong> CoinJoins are large transactions and you pay for your share of the space. Doing this while <a href='how-fees-work.html'>the mempool is busy</a> is expensive, and there is rarely a reason to hurry.",
        "<strong>Time.</strong> Rounds take as long as they take, and meaningful privacy usually means remixing over days rather than a single pass. This is not a button you press before sending a payment.",
        "<strong>Optionality.</strong> This is the cost nobody budgets for &mdash; mixed coins come with handling rules for the rest of their life. You cannot casually consolidate them, and you cannot casually deposit them somewhere that asks who you are."
      ])}

      <h2><span class="sc-article-num">5</span>The part that is not technical</h2>

      <p>Some exchanges and payment processors treat coins with CoinJoin history as suspicious. Deposits have been delayed, questioned, and in some cases frozen pending explanation. Whether that is reasonable is beside the point; it is a real operational risk you are accepting.</p>

      <p>The broader regulatory climate around these tools has been turbulent, which is precisely what took the original coordinator offline. Nothing about this page is legal advice, and the rules differ by jurisdiction and change.</p>

      ${cautions([
        "Do not move a balance you cannot afford to have delayed into a mixing workflow you have never tested.",
        "Do a small test pass first, and take those coins through the full journey you intend &mdash; including wherever they eventually need to go &mdash; before committing more.",
        "Keep your own records. Being able to explain your own transaction history is worth more than the alternative."
      ])}

      <h2><span class="sc-article-num">6</span>Doing it without wasting it</h2>

      <p>If you have read this far and still want to, the habits that determine whether it accomplishes anything:</p>

      ${checklist([
        "<strong>Label everything, before and after.</strong> You cannot practise coin control on coins you cannot tell apart.",
        "<strong>Never merge mixed outputs</strong> with each other or with unmixed coins. Each one should be spent alone unless you have thought hard about the alternative.",
        "<strong>Let it remix.</strong> A single round is a smaller anonymity set than patience will buy you.",
        "<strong>Route your wallet through your own node</strong>, or at minimum over Tor, so the address queries do not undo the work.",
        "<strong>Decide the exit before the entrance.</strong> Know where these coins are ultimately going. If the answer is an exchange account in your name, the whole exercise was decorative."
      ])}

      <h2><span class="sc-article-num">7</span>Is it worth it?</h2>

      <p>An honest answer, since the rest of this page has been about costs.</p>

      <p>For most people the larger privacy wins are cheaper and duller: running your own node, never reusing addresses, labelling coins, avoiding consolidation, and not publishing addresses beside your name. <a href='bitcoin-privacy.html'>The privacy guide</a> covers those, and someone who has not done them will gain more from an afternoon of housekeeping than from mixing.</p>

      <p>CoinJoin is the right tool when you have already done that work, understand exactly what you are breaking the link between, and are prepared to handle those coins carefully forever. It is a poor tool for someone hoping to undo a decision already made, and a bad one for someone who will consolidate everything into a single payment next month.</p>

      <h2>The short version</h2>

      <p>A CoinJoin makes it impossible to tell which output of a collaborative transaction is yours, forward from that point. It cannot erase your past, hide that you participated, or survive your own careless consolidation afterwards. It costs coordinator fees, mining fees, days of patience, and a permanent obligation to handle those coins deliberately &mdash; and the coordinator it depends on is a single point that has already gone away once.</p>

      ${callout("If you take one thing from this page", `The cryptography is not the weak link and never was. The weak links are the coordinator, which is a legally exposed service run by someone else, and your own handling of the coins afterwards. Only one of those two is under your control, so it is worth being very good at it.`)}`
  },
  {
    slug: "specter-multisig-coordinator",
    category: "software",
    products: ["specter"],
    title: "Specter: coordinating a multi-brand multisig",
    summary: "Specter is a face for your own Bitcoin Core node and nothing else, which matters more for multisig than for any other wallet. Building a wallet from three different manufacturers, and collecting signatures across three different transports.",
    level: "advanced",
    minutes: 45,
    goals: ["setup", "harden", "multisig"],
    tags: ["Multisig", "Node"],
    icon: "bi-diagram-3",
    updated: "2026-08-18",
    productGuide: true,
    status: "published",
    related: ["multisig-2of3", "air-gapped-psbt-workflow", "why-run-a-node"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Specter Desktop is not really a wallet. It is a graphical face for Bitcoin Core, built for people who already run a node and want to drive hardware signers &mdash; particularly several of them at once, from different manufacturers, in a multisig.</p>

      <p>That architecture is unusual and it is the entire reason to choose it. Specter has no servers of its own. It asks your node about your coins, and there is no third party anywhere in the arrangement.</p>

      <p>This page assumes you have already decided <a href='multisig-2of3.html'>what your multisig should look like</a> &mdash; how many keys, from which makers, stored where. That guide covers the choices. This one covers the mechanics of actually building it in Specter, which is the part it leaves to the coordinator.</p>

      ${prerequisites([
        "<strong>Bitcoin Core</strong>, synced. This is not optional and it is the real cost of this setup &mdash; see step 2.",
        "<strong>Two or three hardware wallets</strong>, ideally from different makers. Specter supports COLDCARD, BitBox02, Jade, Passport, SeedSigner, Keystone, Trezor, Ledger, and its own Specter DIY signer, among others.",
        "<strong>A microSD card and reader</strong>, if any of your devices are air-gapped.",
        "<strong>Somewhere durable to store the wallet configuration</strong>, which matters as much as the seeds themselves.",
        "No bitcoin. Build the whole thing, rehearse a recovery, and only then fund it."
      ])}

      <h2><span class="sc-article-num">1</span>What Specter actually is</h2>

      <p>Most wallet software bundles two jobs: a user interface, and a source of blockchain data. Sparrow and Electrum both ship with public servers configured, so they work the moment you install them.</p>

      <p>Specter does only the first job. It has no data source of its own and no fallback &mdash; it talks exclusively to a Bitcoin Core node you provide. Install it without one and it does nothing at all.</p>

      <p>That is a deliberate design, not an omission, and it produces the property the next section is about.</p>

      <h2><span class="sc-article-num">2</span>Why this matters more for multisig</h2>

      <p>When a wallet asks somebody else's server for your balance, it hands over the keys to watch you. For a single-signature wallet that means one extended public key. For a multisig it is worse.</p>

      <p>A multisig is described by an <strong>output descriptor</strong> &mdash; a string containing every co-signer's extended public key, the policy, and the derivation paths. It is the complete specification of your wallet. Hand it to a third-party server and that server can derive every address you will ever use across all of your devices, permanently.</p>

      ${pullQuote("A multisig descriptor is a more complete description of your finances than any single xpub. It is the last thing you want sitting on somebody else's server.")}

      <p>Specter's node requirement removes that question entirely. Your descriptor goes to Bitcoin Core, running on your machine, and nowhere else. <a href='why-run-a-node.html'>Why run a node</a> makes the general case; multisig is where it stops being philosophical.</p>

      <h2><span class="sc-article-num">3</span>The cost, stated honestly</h2>

      <p>Bitcoin Core is a serious piece of infrastructure and this is where most people abandon the plan, so it is worth being upfront.</p>

      ${cautions([
        "<strong>Disk.</strong> A full node stores the entire chain &mdash; several hundred gigabytes and growing. Pruning reduces that substantially, but complicates rescanning when you import an existing wallet with history.",
        "<strong>Time.</strong> The initial sync verifies the chain from the beginning. Expect days on ordinary hardware, not hours.",
        "<strong>Uptime.</strong> Specter is only useful when the node is running. A node that lives on a laptop you close is a coordinator that is frequently unavailable.",
        "<strong>Maintenance.</strong> It is another thing to update and keep healthy, indefinitely."
      ])}

      <p>If that is more than you want, Sparrow with your own Electrum server is a lighter route to a similar privacy position, and Sparrow connected to a public server is still a perfectly reasonable multisig coordinator &mdash; it simply makes the trade this guide is trying to avoid.</p>

      <h2><span class="sc-article-num">4</span>Connecting Specter to your node</h2>

      ${checklist([
        "<strong>Get Bitcoin Core running and fully synced first.</strong> Do not start Specter until the node is caught up; nothing will work properly and you will misdiagnose it.",
        "<strong>Verify the Specter download</strong> before installing. Releases are signed, and a coordinator is exactly the kind of software worth checking.",
        "<strong>Point Specter at the node.</strong> On the same machine it will usually detect Core automatically. Otherwise supply the host, port, and RPC credentials.",
        "<strong>Confirm the connection and block height</strong> in Specter before going further."
      ])}

      <h2><span class="sc-article-num">5</span>Adding the devices</h2>

      <p>Each signer is added to Specter individually, as a device, before any wallet exists. What you are importing is public keys &mdash; no private key ever enters Specter.</p>

      ${checklist([
        "<strong>Add each device</strong> and choose how it connects: USB for Trezor, Ledger, BitBox02 and similar; microSD file import for COLDCARD; QR for SeedSigner, Keystone, and Passport.",
        "<strong>Import the extended public keys</strong> by file or QR rather than typing. A single mistyped character produces a wallet nobody can spend from.",
        "<strong>Check the fingerprint</strong> shown in Specter against the one on each device. This is how you know Specter is describing the device in front of you.",
        "<strong>Name each device for the physical object</strong>, not the brand &mdash; <em>COLDCARD in the safe</em> beats <em>coldcard1</em> when you are recovering under stress in five years."
      ])}

      <h2><span class="sc-article-num">6</span>Building the wallet, and registering it back</h2>

      ${checklist([
        "<strong>Create a new multisig wallet</strong> in Specter, set the policy &mdash; 2-of-3 for most people &mdash; and select the devices you added.",
        "<strong>Choose the script type</strong> and leave it consistent across everything. Native SegWit is the sensible default.",
        "<strong>Export the wallet configuration</strong> immediately, before doing anything else.",
        "<strong>Register that configuration on every device that supports it.</strong> COLDCARD, Jade, BitBox02, Passport, Keystone and others accept a multisig configuration file or QR."
      ])}

      <p>That last step is the one to take seriously, and it is worth knowing precisely why rather than treating it as a formality.</p>

      ${callout("What registration actually buys you", `A device that has only seen its own key cannot tell a legitimate change address from a hostile one, because a multisig change address is derived from <em>all</em> the keys. Register the wallet and the device can verify that change is coming home. Skip it and your signer loses the ability to catch the attack described in <a href='air-gapped-psbt-workflow.html'>the PSBT workflow guide</a> — which is the specific attack that empties multisig wallets.`)}

      <h2><span class="sc-article-num">7</span>Signing across three brands</h2>

      <p>Here is where a multi-brand multisig stops being theoretical. Each manufacturer moves transactions differently, and a single payment may involve two or three different mechanisms.</p>

      <div class="sc-specter-signing-panel" aria-label="What collecting signatures across three device styles looks like">
        <div class="sc-specter-signing-heading">
          <span class="sc-specter-signing-mark" aria-hidden="true"><i></i></span>
          <div><span>Signature lanes</span><h3>One wallet, three transport languages</h3></div>
          <strong>The signing order does not matter</strong>
        </div>
        <div class="sc-specter-signing-grid" role="table">
          <div class="sc-specter-signing-head" role="row"><span role="columnheader">Device style</span><span role="columnheader">Route into Specter</span><span role="columnheader">In practice</span></div>
          <div role="rowgroup">
            <div class="sc-specter-signing-row is-usb" role="row">
              <div role="rowheader"><span>USB</span><strong>Connected signer</strong></div>
              <div class="sc-specter-signing-track" role="cell"><span>Device</span><i>&rarr;</i><b>Cable</b><i>&rarr;</i><span>Specter</span></div>
              <p role="cell">Fastest, but not air-gapped &mdash; the device talks directly to your computer.</p>
            </div>
            <div class="sc-specter-signing-row is-sd" role="row">
              <div role="rowheader"><span>SD</span><strong>microSD signer</strong></div>
              <div class="sc-specter-signing-track" role="cell"><span>Signer</span><i>&rarr;</i><b>Card</b><i>&rarr;</i><span>Specter</span></div>
              <p role="cell">Air-gapped and reliable. Keep one card dedicated to carrying PSBTs.</p>
            </div>
            <div class="sc-specter-signing-row is-qr" role="row">
              <div role="rowheader"><span>QR</span><strong>Camera signer</strong></div>
              <div class="sc-specter-signing-track" role="cell"><span>Signer</span><i>&rarr;</i><b>Frames</b><i>&rarr;</i><span>Specter</span></div>
              <p role="cell">Air-gapped and cable-free. Large multisig transactions create longer animations.</p>
            </div>
          </div>
        </div>
      </div>

      ${checklist([
        "Build the transaction in Specter. It produces a PSBT.",
        "<strong>Take it to the first signer</strong> by whichever route that device uses, and verify amount, destination, fee, and change on the device screen.",
        "Bring the partially signed result back into Specter.",
        "<strong>Repeat with the second signer</strong> &mdash; likely a different transport entirely.",
        "Specter combines the signatures, finalises, and broadcasts through your node."
      ])}

      <p>Collecting signatures one device at a time, in whatever order suits you, is the normal rhythm. Nothing is lost by pausing halfway; an unsigned or partially signed transaction has moved no money.</p>

      <h2><span class="sc-article-num">8</span>What to back up</h2>

      <p>This is where multisig wallets are actually lost, and the failure is never the cryptography.</p>

      ${checklist([
        "<strong>Every seed backup</strong>, one per device, stored apart from each other.",
        "<strong>The wallet configuration file</strong> &mdash; the descriptor &mdash; stored <em>with every one of those seed backups</em>. Seeds alone will not rebuild a multisig.",
        "<strong>A note naming the coordinator, the policy, and the script type</strong>, so a future you knows what they are looking at.",
        "<strong>A rehearsal.</strong> Restore the wallet from the descriptor plus two devices on a clean machine, before it holds anything."
      ])}

      <p><a href='multisig-2of3.html'>The multisig guide</a> goes into why the configuration is the thing that kills these wallets. Specter makes exporting it easy, which removes every excuse for not having done it.</p>

      <h2><span class="sc-article-num">9</span>Where Specter fits</h2>

      ${checklist([
        "<strong>Choose Specter</strong> if you run a node already, or intend to, and want a coordinator whose privacy properties require no configuration because it has no alternative.",
        "<strong>Choose Sparrow</strong> if you want a capable multisig coordinator without a node requirement, and are willing to point it at a server &mdash; ideally your own.",
        "<strong>Choose Nunchuk</strong> if you need shared or collaborative arrangements across people and phones."
      ])}

      <p>All three build the same wallet. A multisig created in one can be rebuilt in another from the descriptor and the devices, which is worth knowing: you are not marrying the software.</p>

      <h2>The short version</h2>

      <p>Specter is a front end for your own Bitcoin Core node, which means your multisig descriptor &mdash; the most complete description of your finances that exists &mdash; never leaves your machine. The price is running and maintaining a node. Add each device, build the wallet, register the configuration back onto every signer, and store that configuration with every seed backup.</p>

      ${callout("If you take one thing from this page", `Register the wallet configuration on every device, and store a copy with every seed. The first makes your signers able to detect a hostile change address; the second is the difference between three seed backups and an actual recoverable wallet. Neither is optional, and Specter makes both easy enough that skipping them is a choice.`)}`
  },
  {
    slug: "own-node-connection",
    category: "advanced",
    products: [],
    title: "Connecting wallets to your node",
    summary: "Running a node and using it are two different achievements. The index layer nobody mentions, connecting each wallet to it, reaching it from outside your house, and proving your wallet is not quietly still using somebody else's server.",
    level: "advanced",
    minutes: 40,
    goals: ["harden", "privacy"],
    tags: ["Node", "Privacy"],
    icon: "bi-cpu",
    updated: "2026-08-18",
    status: "published",
    related: ["why-run-a-node", "bitcoin-privacy", "specter-multisig-coordinator"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Plenty of people run a node and still leak everything. The node hums away in a cupboard, validating blocks, while their wallet carries on asking a stranger's server for balances &mdash; because nothing about installing Bitcoin Core changes what your wallet is configured to talk to.</p>

      <p>Running a node and using a node are separate achievements. <a href='why-run-a-node.html'>Why run a node</a> makes the case for the first. This page is the second: the piece of software nobody warns you about, how each wallet connects, how to reach it when you are not at home, and how to prove it is actually working rather than assuming.</p>

      <h2><span class="sc-article-num">1</span>The layer nobody mentions</h2>

      <p>Here is the thing that confuses almost everybody on their first attempt.</p>

      <p>Bitcoin Core does not keep an index of addresses. It is built to validate the chain and to track wallets it was told about &mdash; it is not built to answer "what is the balance of this arbitrary address?" quickly. That question, which is exactly what a wallet needs to ask, is one Core alone is poorly suited to.</p>

      <p>So most wallets do not talk to Core at all. They speak the Electrum protocol, and expect an <strong>index server</strong> sitting alongside your node, reading its data and maintaining an address index for lookups.</p>

      ${callout("What this means in practice", "\"I installed Bitcoin Core\" is not enough to point Sparrow at it. You need Core <em>plus</em> an index server. Node distributions like Umbrel, Start9, and RaspiBlitz bundle one already, which is most of why they exist. A manual Core install almost always needs one added.")}

      <p>Specter is the notable exception, because it drives Core's own descriptor wallets directly rather than speaking Electrum &mdash; which is why <a href='specter-multisig-coordinator.html'>the Specter guide</a> requires Core and nothing else.</p>

      <h2><span class="sc-article-num">2</span>Choosing the index server</h2>

      <p>Three implementations are in common use, and the choice is a genuine trade rather than a matter of taste.</p>

      <div class="sc-guide-data-panel sc-server-panel">
        <div class="sc-guide-data-heading">
          <span class="sc-guide-data-mark">RPC</span>
          <div><span>Core needs an index</span><h3>Three servers, three different trades</h3></div>
          <strong>Disk vs speed</strong>
        </div>
        <div class="sc-server-grid">
          <article class="is-cream"><header><h3>electrs</h3><span>Rust</span></header><strong>Smallest index</strong><p>Does not need Core's transaction index. Some queries re-read blocks, so lookups are slower.</p></article>
          <article class="is-green"><header><h3>Fulcrum</h3><span>C++</span></header><strong>Fastest queries</strong><p>Sparrow's benchmarks put history loading tens of times quicker than ElectrumX, at the cost of more disk.</p></article>
          <article class="is-orange"><header><h3>ElectrumX</h3><span>Python</span></header><strong>Most featureful</strong><p>The original implementation and the slowest of the three in practice.</p></article>
        </div>
      </div>

      <p>The distributions have already picked for you: Start9 ships Fulcrum, while Umbrel and RaspiBolt default to electrs and offer Fulcrum as an alternative. If your wallet history feels sluggish to load, that setting is usually the cause and switching is usually the cure.</p>

      <h2><span class="sc-article-num">3</span>Connecting, wallet by wallet</h2>

      <p>Every wallet hides this in a different place, but you are always supplying the same thing: a host, a port, and whether to use SSL.</p>

      ${checklist([
        "<strong>Sparrow.</strong> Choose a private Electrum server in the server settings and enter the address. Sparrow will tell you plainly whether it connected.",
        "<strong>Electrum.</strong> Open the network settings, turn off automatic server selection, and add yours. Automatic selection is the setting that quietly undoes this.",
        "<strong>Specter.</strong> No index server needed &mdash; point it straight at Core's RPC interface.",
        "<strong>BlueWallet.</strong> Network settings, then Electrum server, then your details.",
        "<strong>Cove.</strong> Supports your own Electrum or Esplora server in settings.",
        "<strong>Nunchuk.</strong> Accepts a custom Electrum server in its network configuration."
      ])}

      <h2><span class="sc-article-num">4</span>Reaching it from outside the house</h2>

      <p>On your home network this is straightforward: the node has a local address and your laptop can see it. The problem arrives with phones, which are mostly used somewhere else.</p>

      ${checklist([
        "<strong>Tor.</strong> Every node distribution can publish your index server as a hidden service, and most wallets can connect over Tor. Nothing is exposed to the public internet, the address is unguessable, and it works from anywhere. It is slower, and it is the right default for a phone.",
        "<strong>A VPN back to your home network.</strong> Fast and pleasant, at the cost of running a VPN. WireGuard on the router or the node itself is the usual approach.",
        "<strong>Port forwarding.</strong> Works, and puts your server on the public internet where it can be scanned, fingerprinted, and attacked. If you do it, use SSL and treat it as a service you are now responsible for maintaining."
      ])}

      ${cautions([
        "A phone wallet configured only for your home network will fail silently or fall back the moment you leave the house. Decide which of the three routes you are using before you rely on it while out.",
        "Do not expose an index server to the internet without SSL. The queries it answers are your entire wallet history."
      ])}

      <h2><span class="sc-article-num">5</span>Prove it is actually working</h2>

      <p>This is the section that matters most, because the failure mode here is silent by design.</p>

      <p>Wallets are built to work. When your server is unreachable &mdash; the node is updating, Tor is slow, the laptop moved networks &mdash; many will quietly fall back to a public server rather than showing you an error. You get a working balance and the privacy you thought you had bought is simply gone, with no indication.</p>

      ${pullQuote("A wallet that shows you a balance is not telling you where it got it. Assume nothing you have not checked.")}

      ${checklist([
        "<strong>Look for the connection indicator.</strong> Sparrow and Electrum both name the server they are currently using. Read it rather than trusting that your setting took.",
        "<strong>Turn the node off and watch.</strong> The honest test. Your wallet should fail to load balances. If it cheerfully carries on, it is talking to somebody else and you have found the problem.",
        "<strong>Disable automatic server selection</strong> wherever it exists. In Electrum especially, leaving it on means your careful configuration is a preference rather than a rule.",
        "<strong>Re-check after every update.</strong> App updates and node-distribution upgrades both reset network settings more often than they should."
      ])}

      <h2><span class="sc-article-num">6</span>The first connection is the slow one</h2>

      <p>Pointing an existing wallet at your own server for the first time means the server has to find your history, and that is not instant.</p>

      ${checklist([
        "<strong>Expect a wait.</strong> The index server scans for your addresses. On a fresh index this can take a long time, and on modest hardware a very long time.",
        "<strong>Watch the gap limit</strong> if some transactions seem missing. A wallet with a long history of unused addresses can outrun the default lookahead; raising it and rescanning usually recovers the balance.",
        "<strong>Pruned nodes complicate rescans.</strong> Pruning saves substantial disk, but a pruned node has discarded the old blocks a rescan wants to read. If you plan to import wallets with years of history, do not prune.",
        "<strong>Let the index finish before judging performance.</strong> A half-built index is slow in ways a finished one is not."
      ])}

      <h2><span class="sc-article-num">7</span>What this fixes, and what it does not</h2>

      ${checklist([
        "<strong>It fixes the address leak.</strong> Nobody else learns which addresses you own, which is the single largest routine privacy leak in ordinary wallet use.",
        "<strong>It fixes the IP correlation.</strong> Your queries are no longer tied to your home connection by a third party.",
        "<strong>It fixes trusting their answer.</strong> Your balance is now verified against rules you enforce rather than reported by someone else."
      ])}

      ${cautions([
        "<strong>It does not make your transactions private on-chain.</strong> The ledger is still public and still analysable. <a href='bitcoin-privacy.html'>The privacy guide</a> covers what does and does not help there.",
        "<strong>It does not undo what you already leaked.</strong> Addresses that a public server has already seen remain in whatever records it keeps.",
        "<strong>It does not protect a wallet that identifies you elsewhere</strong> &mdash; a KYC withdrawal ties your identity to those coins regardless of who answers your balance queries."
      ])}

      <h2>The short version</h2>

      <p>Bitcoin Core alone cannot answer the questions wallets ask, so you need an index server &mdash; electrs, Fulcrum, or ElectrumX &mdash; alongside it, which node distributions bundle for you. Point each wallet at it explicitly, use Tor or a VPN to reach it from a phone, and then verify by switching the node off and confirming your wallet actually breaks.</p>

      ${callout("If you take one thing from this page", `Test it by turning your node off. It is the only check that cannot be fooled by a setting that did not take or a fallback you did not know about — and a wallet that keeps working when your node is down was never using it.`)}`
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
    related: ["quickstart", "sparrow-first-wallet", "what-not-to-normalize"],
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

      <p>The same test is worth running from your own hot wallet as well, once the coins are off the platform. <a href="test-transaction.html">Sending a test transaction</a> covers that loop end to end &mdash; how small is too small, what a successful test does and does not prove, and what to check when the money does not turn up.</p>

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
    slug: "human-randomness",
    category: "advanced",
    products: [],
    title: "Why you cannot think of a random number",
    titleMark: "sc-die-mark",
    summary: "Every wallet rests on one unguessable number, and the one tool that cannot produce it is the one you were born with. What people get wrong, how it has been measured, and what it cost the ones who tried.",
    level: "beginner",
    minutes: 12,
    goals: ["learn", "harden"],
    tags: ["Entropy", "Seed generation"],
    icon: "bi-shuffle",
    updated: "2026-08-26",
    status: "published",
    related: ["dice-entropy", "three-dice-seed", "what-not-to-normalize"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Think of a number between one and ten. Hold it for a second. You almost certainly did not pick one or ten, and there is a fair chance you picked seven &mdash; and whatever you chose, you did not choose it randomly. You chose it the way people choose, which is a different thing, and it is the reason every serious way of making a wallet takes the decision away from you.</p>

      <p>A bitcoin wallet is one enormous number kept secret. Not a password that a company checks, not an account someone can lock &mdash; a number so large that nobody can search for it. Your recovery words are that number written so a human can copy it down. Everything you will ever own in that wallet hangs on it having been unguessable at the moment it was made.</p>

      <p>Which raises an awkward question, because the obvious way to make a number nobody can guess is to think one up. That instinct is exactly backwards, and this is a guide about why.</p>

      <h2><span class="sc-article-num">1</span>Try it first</h2>

      <p>Rather than take any of this on trust, lose to a machine that has no idea who you are. It decides what you are going to press before you press it, and it is not clever: it remembers what you did the last few times you were in this position and bets you will do it again. That is the whole mechanism, and it is usually enough.</p>

      <p>It cannot simply show you the guess &mdash; you would do the opposite and win every time, because in a game like this whoever moves second wins. So it seals the guess in a hash instead: you cannot unpick it, and it cannot wriggle out of it. Finish the round and it hands over the key, so you can recompute every commitment it made.</p>

<div class="sc-rng-lab" id="sc-rng-lab">
        <div class="sc-rng-head">
          <div>
            <span class="sc-rng-eyebrow"><i aria-hidden="true"></i> Pattern reader</span>
            <h3>It has already guessed your next tap</h3>
          </div>
          <span class="sc-rng-private"><i aria-hidden="true"></i> Runs locally in your browser</span>
        </div>
        <p>Tap heads or tails as randomly as you can manage. Before each tap, the machine makes its guess and seals it as the code below. Once you choose, it reveals whether it read you correctly.</p>

        <div class="sc-rng-console">
          <div class="sc-rng-call-box">
            <span>Next guess</span>
            <div class="sc-rng-seal">
              <i aria-hidden="true"></i>
              <b data-rng-commit>&mdash;</b>
            </div>
            <small>Locked before you choose</small>
          </div>

          <div class="sc-rng-pad" data-rng-pad>
            <button type="button" data-rng-face="H"><span class="sc-rng-coin" aria-hidden="true">H</span><span>Heads</span></button>
            <button type="button" data-rng-face="T"><span class="sc-rng-coin" aria-hidden="true">T</span><span>Tails</span></button>
          </div>
          <p class="sc-rng-last" data-rng-last></p>
        </div>

        <div class="sc-rng-readout">
          <div class="sc-rng-scoreline">
            <span>Machine score</span>
            <b data-rng-score>&ndash;</b>
            <p data-rng-score-note></p>
          </div>
          <div class="sc-rng-unlock">
            <div><span>Pattern breakdown</span><b data-rng-unlock>0 / 24 taps</b></div>
            <div class="sc-rng-progress" aria-hidden="true"><i data-rng-progress></i></div>
          </div>
          <div class="sc-rng-strip" data-rng-strip aria-hidden="true"></div>
        </div>

        <div class="sc-rng-meta">
          <b data-rng-count>0 taps</b>
          <div>
            <button type="button" data-rng-undo>Undo</button>
            <button type="button" data-rng-reset>Start over</button>
            <button type="button" data-rng-finish disabled>Finish and reveal</button>
          </div>
        </div>
        <p class="sc-rng-tape" data-rng-tape></p>
        <div class="sc-rng-result" data-rng-result hidden></div>
        <div class="sc-rng-proof" data-rng-proof hidden></div>
      </div>

      <p>A coin would hold it to fifty percent, because a coin leaves nothing to remember. Most people cannot. Two numbers give them away, and both have exact answers for a real coin: how often you switch should be about half the time, because every gap between two flips is its own independent toss, and your longest streak of the same result should sit near six in sixty-four flips, because that is simply what happens.</p>

      <p>It is worth sitting with why that guess has to be sealed rather than shown. The only reliable way to beat a predictor is to see its answer first &mdash; not to be random, just to be second. Take that away and there is nowhere to hide, because being contrary is a rule as much as being repetitive is, and either one is a pattern.</p>

      <p>Most people switch closer to sixty percent of the time and stop their longest streak at three. Both errors come from the same place: a belief that randomness ought to look even.</p>

      ${pullQuote("Randomness is lumpy. Evenness is the fingerprint of a person trying.")}

      <h2><span class="sc-article-num">2</span>This has been measured for fifty years</h2>

      <p>The machine above is not a modern trick either. Claude Shannon built one at Bell Labs in 1953 &mdash; a box that played matching pennies against whoever walked past, remembering only a couple of moves of history &mdash; and it beat people reliably enough that he wrote it up as <em>A Mind-Reading (?) Machine</em>. The joke in the question mark is that there is no mind reading involved. There is just a person who cannot stop repeating themselves and a machine with a good enough memory to notice.</p>

      <p>The finding is old and it is not subtle. Wilhelm Wagenaar surveyed the literature on human random generation in 1972 and found the same distortions turning up in study after study, whichever way the task was framed: people alternate too much, avoid repeating themselves, and produce sequences far more balanced than chance would ever deliver. Later work has poked at it from every angle &mdash; changing the instructions, the pace, the alphabet, paying people, telling them exactly what they are doing wrong &mdash; and the bias does not go away. Knowing about it does not fix it.</p>

      <p>Some of the specific habits are worth naming, because you can catch yourself doing them:</p>

      <ul>
        <li><strong>You avoid repeats.</strong> Having just written a 4, the next 4 feels illegitimate, so you write something else. A die has no such scruple.</li>
        <li><strong>You spread things out.</strong> Asked for twenty numbers from one to six, people produce a suspiciously flat spread. Twenty real rolls are usually lopsided.</li>
        <li><strong>You avoid the edges.</strong> One and ten feel like weak answers to "pick a number between one and ten", so they are picked less than their share.</li>
        <li><strong>You reach for the same favourites.</strong> Seven does unreasonably well. So do odd numbers, and numbers that are not multiples of five.</li>
        <li><strong>You think a streak owes you.</strong> After four heads, tails feels overdue. It is not. The coin has no memory, and neither does a die.</li>
      </ul>

      <p>None of this is stupidity. It is a mind doing what it is built for &mdash; finding and producing pattern &mdash; applied to the one job where pattern is the enemy.</p>

      <h2><span class="sc-article-num">3</span>What it cost people who tried anyway</h2>

      <p>For a while bitcoin let you do exactly the wrong thing. A brain wallet turned a passphrase you invented into a private key, with nothing else added. No file to lose, no metal plate to hide &mdash; the wallet lived in your head. It sounds elegant until you notice that anyone in the world can guess at it, forever, for free, without touching you or your computer.</p>

      <p>Researchers went and counted the damage. A 2016 study checked around 300 billion candidate passphrases against the blockchain and found 884 brain wallets used between 2011 and 2015, holding about 1,806 BTC between them. <strong>All but 21 were emptied.</strong> Usually within a day of being funded, often within minutes &mdash; and by late 2013 the typical time to be drained was measured in minutes and seconds, because about a dozen automated bots were sitting there competing to be first.</p>

      ${callout("The detail that should end the argument", "The same study found no evidence that people storing more bitcoin chose stronger passphrases. Having more to lose did not make anyone better at this. The people with real money on the line were as guessable as everyone else, because the limitation is not effort or care \u2014 it is that a human mind has no source of randomness in it.")}

      <p>These were not careless people picking "password". They were choosing phrases they believed were obscure: song lyrics, private jokes, lines of scripture, sentences in other languages. Every one of them was reachable by a word list, because the space of things a person thinks of is unimaginably smaller than the space of things a coin can produce.</p>

      <h2><span class="sc-article-num">4</span>The size of the gap</h2>

      <p>It helps to see the numbers, because "not random enough" hides how enormous the shortfall is.</p>

      <p>A 24-word recovery phrase carries 256 bits. That is not a big number written down, but it is roughly the count of atoms in the observable universe &mdash; a search nobody finishes, ever, with any machine that could be built. A 12-word phrase carries 128 bits, which is also never getting searched.</p>

      <p>Now price the alternatives. Ninety-nine rolls of a six-sided die give 255.9 bits &mdash; just short of the 256 a 24-word seed holds, which is why some wallets ask for a hundredth roll and others hash the ninety-nine and call it done. Two hundred and fifty-six coin flips give 256 bits, one per flip. A thoroughly shuffled deck of cards is worth 225.6 bits all by itself, because the order it ended up in is one of 52 factorial possibilities, and dealing it out records that order. A memorable passphrase a person invents, by the estimates used in password research, tends to land somewhere in the twenties of bits &mdash; and the sequence you just tapped out above, however it scored, is worth less than the sixty-four bits it looks like, because your switching habit is itself information an attacker already has.</p>

      <p>The gap between twenty-odd bits and 256 is not a matter of degree. One is a search that finishes while you make coffee. The other does not finish.</p>

      ${pullQuote("A wallet is only as unguessable as the moment it was created. Nothing you do afterwards can add randomness that was never there.")}

      <h2><span class="sc-article-num">5</span>So where does real randomness come from</h2>

      <p>From physics, not from thought. Something has to actually happen in the world, with an outcome nothing recorded in advance.</p>

      <p>It is worth being precise about what that means, because there are two different grades of it. A die is not actually random: it is a lump of plastic obeying ordinary mechanics, and a good enough measurement of the throw would tell you the face. It works because that measurement is impossible in practice &mdash; the outcome depends so violently on the starting conditions that nobody can know them well enough. That is chaos, not randomness, and for our purposes it is enough.</p>

      <p>Then there is the other kind. A single atom of a radioactive isotope will decay at some point, and as far as physics can tell nothing whatsoever determines when. Not a hidden mechanism, not a variable nobody has measured yet &mdash; the timing appears to be indeterminate at the bottom. The half-life only describes what a vast number of them do on average; no fact about the individual atom is waiting to be discovered. That is randomness in the strongest sense available, and it is why serious hardware generators sample physical noise of this sort rather than anything a program computes.</p>

      <p>Both beat you comfortably. The gap between a person and a die is far wider than the gap between a die and an atom.</p>

      <p>Dice are the honest version of this and the reason people bother with them: you can watch the whole process, and there is no step where you are asked to decide anything. <a href="dice-entropy.html">Rolling your own entropy</a> covers doing it properly &mdash; and covers the trap this guide should make obvious, which is that the moment you re-roll a result for looking wrong, you have put your judgement back in charge and undone the point of the exercise. Six sixes is exactly as likely as any other six rolls. Write it down.</p>

      <p>If you would rather see every step of the conversion too, <a href="three-dice-seed.html">three dice, one word</a> uses one octal and two hex dice to name each word directly, with nothing hashed.</p>

      <p>Your hardware wallet's built-in generator is the other real option, and it is genuinely good &mdash; a dedicated circuit sampling physical noise, which is a far better randomness source than you are. The only thing it cannot do is let you watch. That is the whole trade: trust the sealed chip, or supply the randomness yourself from something you can see. Both are defensible. Inventing the number yourself is not.</p>

      <h2><span class="sc-article-num">6</span>What to take away</h2>

      <p>Not that you are bad at this. Everyone is, measurably, including the people who study it, and no amount of trying harder moves the needle.</p>

      <p>What is worth carrying is the instinct to notice when a system is quietly asking you to be a random number generator &mdash; a passphrase you invent, a "memorable" seed, a set of rolls you tidied up because they looked wrong. In each case the fix is the same: hand the job to something physical, record whatever it says without editing, and check the result rather than trusting it.</p>

      <p>The dice do not care what looks random. That is exactly why they are better at this than you are.</p>

      <h2>Sources</h2>

      <ul>
        <li><a href="https://www.semanticscholar.org/paper/Generation-of-random-sequences-by-human-subjects:-A-Wagenaar/c0d41c4e93bf6e01e422339cfeca28e4c983ef9a" target="_blank" rel="noopener noreferrer">Wagenaar, W. A. (1972), "Generation of random sequences by human subjects: A critical survey of literature"</a>, <em>Psychological Bulletin</em> 77(2) &mdash; the survey that established the over-alternation and repeat-avoidance findings.</li>
        <li><a href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1113654/full" target="_blank" rel="noopener noreferrer">Instruction effects on randomness in sequence generation</a> (<em>Frontiers in Psychology</em>, 2023) &mdash; recent work on how far changing the task moves the bias, which is: not far.</li>
        <li><a href="https://www.cs.unm.edu/~vasek/papers/vasekfc16.pdf" target="_blank" rel="noopener noreferrer">Vasek, Bonneau, Castellucci, Keith and Moore (2016), "The Bitcoin Brain Drain"</a>, Financial Cryptography 2016 &mdash; the source of every brain wallet figure quoted above, including the drain times and the finding about larger balances.</li>
        <li><a href="https://rclab.de/_media/shannon/mindreader_overview.pdf" target="_blank" rel="noopener noreferrer">Claude Shannon, "A Mind-Reading (?) Machine" (Bell Laboratories memorandum, 18 March 1953)</a> &mdash; the original of the guessing machine above, and still the clearest description of why it works.</li>
        <li><a href="https://aaronsonoracle.com/" target="_blank" rel="noopener noreferrer">The Aaronson Oracle</a> &mdash; a modern version of the same demonstration, if you want to lose to a different implementation.</li>
        <li><a href="https://www.lancaster.ac.uk/staff/towse/rgpage.html" target="_blank" rel="noopener noreferrer">John Towse's random generation resources</a> &mdash; methods and measures used in this area, for anyone who wants the underlying statistics.</li>
      </ul>

      <p>The panel above is a demonstration, not a test. A short round cannot establish anything about you in particular, and a fair coin beats it often enough that one good result proves nothing either. What it can do is let you watch a very small amount of memory anticipate you, using nothing but what you already typed &mdash; and the longer you play, the harder that is to dismiss.</p>`
  },

  {
    slug: "three-dice-seed",
    category: "advanced",
    products: ["coldcard", "seedsigner", "jade"],
    title: "Three dice, one word: rolling a seed you can read",
    titleMark: "sc-die-mark",
    summary: "One octal die and two hex dice throw exactly eleven bits \u2014 one recovery word, with nothing hashed and nothing to trust. The method, the arithmetic, and the one detail that quietly ruins it.",
    level: "intermediate",
    minutes: 14,
    goals: ["setup", "harden", "learn"],
    tags: ["Entropy", "Dice", "Seed generation"],
    icon: "bi-dice-3",
    updated: "2026-08-26",
    status: "published",
    related: ["dice-entropy", "seed-backup-metal", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Rolling a six-sided die ninety-nine times and hashing the result works, but you cannot check it. You hand a column of digits to a machine and it hands back words, and the step in between is SHA-256 \u2014 which no one does in their head. There is a version of this where nothing is hidden, and it needs three dice.</p>

      <p>The trick is to stop fighting the arithmetic. A recovery word is one of 2048, and 2048 is two to the eleventh, so a word is exactly eleven bits. A six-sided die cannot produce eleven bits neatly because six is not a power of two, which is why every six-sided method ends in a hash. Eight and sixteen <em>are</em> powers of two. An octal die is three bits. A hex die is four. One octal and two hex dice, thrown together, are 3 + 4 + 4 = 11.</p>

      <p>One throw of three dice is one word. Not approximately, not after processing \u2014 the faces are the word.</p>

      ${pullQuote("If the conversion needs a computer, you are trusting the computer. This one needs a printed page.")}

      <h2><span class="sc-article-num">1</span>What you need</h2>

      <p>Three dice: one eight-sided numbered 1 to 8, and two sixteen-sided numbered 0 to F. A printed dictionary that maps the three faces to a word. A pen and a worksheet. A cup to throw them in, so they tumble rather than getting placed. A hard flat surface, and a room with nothing electronic in it.</p>

      <p>You also need a signing device \u2014 COLDCARD, SeedSigner and Jade all work \u2014 but only for the very last step, and not to generate anything. More on why below.</p>

      <h2><span class="sc-article-num">2</span>The throw</h2>

      <p>Shake all three dice in the cup and tip them out. Put the octal die on the left and the two hex dice beside it. It does not matter which hex die you put in the middle; they are identical and independent, so there is no ordering to preserve. What matters is that once they are in a row you read them left to right and write down all three characters.</p>

      <p>That is one word. Look it up in the dictionary and write the word on the worksheet. Then do it again. You need <strong>23 of them</strong>.</p>

      <p>Not 24 \u2014 and that is the part worth understanding rather than just following.</p>

      <h2><span class="sc-article-num">3</span>Why the last word is not yours to choose</h2>

      <p>A 24-word phrase is not 24 free words. It is 256 bits of secret plus an 8-bit checksum, and 24 &times; 11 = 264 = 256 + 8. Those eight checksum bits live in the last word, which is why the twenty-fourth word is mostly a verification digit rather than randomness. Your 23 throws are 253 bits. The last word carries the remaining three bits of secret, followed by a checksum computed over everything.</p>

      <p>Three bits is eight possibilities. So there are exactly eight words that can legally finish your phrase, and which of the eight you pick is the last of your randomness \u2014 the checksum part is then forced.</p>

      <p>The same method shortens to a 12-word seed, and the arithmetic there is worth knowing because it is not the same shape: 11 throws are 121 bits against a 128-bit seed, which leaves seven free bits rather than three \u2014 <strong>128 valid endings to choose from instead of eight</strong>. <a href="bring-your-own-entropy.html">Bring Your Own Entropy</a> covers that case.</p>

      <p>Nobody computes a SHA-256 checksum with a pen. So this is the one step where the device earns its place: you enter your 23 words, it shows you the eight valid endings, and you throw the octal die one last time to choose between them. Faces 1 to 8, options one to eight. The device did not generate anything; it did arithmetic you could not do by hand, in front of you, on a wallet whose entropy you had already fixed.</p>

      ${callout("Do it once as a rehearsal", `Run the whole procedure end to end on a wallet you will wipe immediately. The point is to find out that your dictionary printout is missing a page, or that your handwriting turns 8 into B, while it costs you nothing.`)}

      <h2><span class="sc-article-num">4</span>The detail that quietly ruins it</h2>

      <p>The octal die is numbered <strong>1 to 8</strong>, not 0 to 7.</p>

      <p>This sounds like pedantry and is not. The dictionary is organised in eight blocks of 256 words, and the leading digit selects the block \u2014 but as a label, not as a multiplier. Block 1 is the first 256 words, so the dictionary opens at <code>100</code> for <em>abandon</em> and ends at <code>8FF</code> for <em>zoo</em>. Read the die as 0 to 7 and treat the digit as a multiplier, and every word lands 256 places from where it belongs.</p>

      <p>Nothing would warn you. The phrase would still be 23 valid words, the device would still offer eight endings, and the wallet would still work perfectly \u2014 it would simply be a different wallet than the one your worksheet describes. You would only find out when you tried to restore from the sheet and arrived somewhere empty.</p>

      <p>The safeguard costs nothing: use the printed dictionary as the authority and do not do the arithmetic yourself. The codes on the page already account for it.</p>

      <h2><span class="sc-article-num">5</span>Check it before you trust it</h2>

      <p>The whole appeal of this method is that no step requires trust, so the last thing to do is confirm the words you wrote are the words your dice actually chose. The <a href="../entropy.html" data-site-link>Entropy Workshop</a> takes the same three-character codes, does the same lookup, and shows you the phrase and the first addresses. Download it and run it offline; it fetches nothing and generates nothing.</p>

      <p>If its words match your worksheet, your transcription is clean. If they do not, you have a copying error rather than a broken wallet \u2014 which is exactly the sort of thing you want to discover before funding it.</p>

      ${pullQuote("Your recovery words are the backup. The worksheet full of dice codes is a receipt, not a key.")}

      <h2><span class="sc-article-num">6</span>Is this better than 99 rolls?</h2>

      <p>It is not more secure. Both give you 256 bits from dice you threw yourself, and neither can be improved on in that respect. What changes is how much you have to take on faith.</p>

      <p>Hashing six-sided rolls is opaque, and the opacity has a real cost: as <a href="dice-entropy.html">rolling your own entropy</a> covers, wallets disagree about how to do it. Some hash the digits as written, some rewrite every 6 to a 0 first, some read the rolls as bits without hashing at all. The same column of rolls can produce completely unrelated wallets on two honest devices, and your notebook does not record which one you used.</p>

      <p>The three-dice method has no such ambiguity, because there is no conversion to disagree about. A printed table says what each throw means. The price is buying two kinds of dice and printing a dictionary; the return is a procedure you can follow, check, and explain to someone else without saying "and then it hashes it".</p>

      <p>If you already own six-sided dice and a device that accepts them, that method is fine and this one is not urgent. If you are drawn to this at all, it is probably because you want to see every step \u2014 and that instinct is the right one.</p>

      <h2>Sources</h2>

      <p>The method, the dice, the worksheet and the printed dictionary are the work of <a href="https://entropy.page/dice" target="_blank" rel="noopener noreferrer">D++ and Keysa's workshop</a> at entropy.page. The explanation above is ours; the procedure is theirs.</p>

      <ul>
        <li><a href="https://entropy.page/dice" target="_blank" rel="noopener noreferrer">entropy.page &mdash; Roll Your Own Seed Phrase</a> &mdash; the workshop, and where to get the dice and the printouts.</li>
        <li><a href="https://entropy.page/files/dictionary.pdf" target="_blank" rel="noopener noreferrer">The BIP39 dictionary</a> &mdash; the lookup table itself, running 100 to 8FF. This is the one to print, and the authority on the codes.</li>
        <li><a href="https://thesimplestbitcoinbook.net/wp-content/uploads/2023/09/Roll-Your-Own-Seed-Phrase-PDF.pdf" target="_blank" rel="noopener noreferrer">The slide deck</a> &mdash; the procedure step by step, and the arithmetic behind the three dice.</li>
        <li><a href="https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki" target="_blank" rel="noopener noreferrer">BIP39</a> &mdash; the standard behind the wordlist and the checksum that fixes the last word.</li>
      </ul>`
  },

  {
    slug: "dice-entropy",
    category: "advanced",
    products: ["coldcard", "seedsigner", "krux", "jade", "bitbox"],
    title: "Roll the dice: generating your own entropy",
    titleMark: "sc-die-mark",
    summary: "Make your wallet's secret from dice you rolled yourself, instead of trusting the device to pick it. What to do, in plain terms, and the three mistakes that ruin it.",
    level: "intermediate",
    minutes: 20,
    goals: ["setup", "harden", "learn"],
    tags: ["Entropy", "Dice", "Seed generation"],
    icon: "bi-shuffle",
    updated: "2026-08-21",
    status: "published",
    related: ["coldcard-setup", "seedsigner-setup", "recovery-test-drill"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Every bitcoin wallet is built on one enormous random number. Your twelve or twenty-four recovery words are just that number, written in a form a human can copy down. Everything else &mdash; every address, every signature, every coin you will ever hold &mdash; grows out of it.</p>

      <p>Normally your device picks that number for you, in a fraction of a second, using a random number generator sealed inside a chip. It almost certainly does this well. But you cannot watch it happen, you cannot check it afterwards, and you have no way of knowing whether the chip is doing what it claims. You are taking it on faith.</p>

      <p>Rolling dice removes the faith. You generate the randomness yourself, on a table, in front of your own eyes, and hand it to the device already made. Nothing about the chip's honesty matters any more, because you did the one part that had to be secret.</p>

      <p>It costs you about twenty minutes and a little care. Here is how it works, and &mdash; more importantly &mdash; the handful of ways people accidentally ruin it.</p>

      <aside class="sc-tool-shortcut">
        <span class="sc-die-mark" aria-hidden="true"></span>
        <div>
          <strong>Already rolled, and want to check the device converted them honestly?</strong>
          <p><a href="../entropy.html">Entropy Workshop</a> turns a set of test rolls &mdash; or coin flips, or a shuffled deck &mdash; into the words and addresses they produce, so you can compare. It is a single file, usable in the browser or saved and run with the network off. <a href="#checking-the-conversion">The rules for using it safely</a> are further down and matter more than the tool does.</p>
        </div>
      </aside>

      ${figure({
        src: "../assets/img/dice-entropy.jpg",
        alt: "Two white dice caught in mid-air above a burgundy felt runner on a scarred wooden table, beside a whisky glass, a brass oil lamp and a leather notebook",
        caption: "Each roll is 2.58 bits of entropy. With enough randomness, you get a secret nobody else can guess.",
        width: 1376,
        height: 768
      })}

      <h2>Why dice, and not one of the other ways</h2>

      <p>Dice are not the best method available. It is worth being straight about that, because the case for them is more interesting than the usual one.</p>

      <p>There are six practical ways to produce the number, and they separate along three lines: what you have to get hold of before you can begin, how much work the method itself demands, and how much of the finished result you are able to check. Every method is excellent on one of those and pays for it on another.</p>

      ${methodTradeoffs()}

      <p>The top two rows ask nothing of you at all &mdash; no equipment, no procedure, nothing to get wrong. What you give up is the ability to check the input. A generator sealed in a chip produces a number you cannot observe, reproduce, or test, and a photograph of your kitchen has no external record to compare against either. If you are content to trust the manufacturer's engineering, this is the sensible choice and there is no shame in it.</p>

      <p>The bottom three go the other way. You do the conversion yourself, on paper, so the device never touches your randomness &mdash; it only computes the final checksum word. That is about as little trust as this task can be reduced to. The price is either in setup or in labour: 253 coin flips converted from binary by hand, or a worksheet of rolls and re-rolls, or an evening spent cutting out two thousand and forty-eight paper slips before you have generated a single word.</p>

      <p>Dice with the device doing the conversion sits in the middle and is never the winner of anything. It needs a die you probably already own, it takes twenty minutes of dull rolling, and the conversion happens somewhere you cannot see. But nothing about it is <em>bad</em>. It is the only one of the six with no expensive corner &mdash; and unlike the top two, the part you cannot see is at least checkable afterwards, which is what the section on <a href="#checking-the-conversion">verifying the conversion</a> further down is for.</p>

      <p>That is the honest argument for the method in this guide: not that it beats the alternatives, but that it is the only one that never asks you for very much.</p>

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

      <p>Real dice are never perfectly even. People have actually measured this properly &mdash; a 1971 <em>Psychometrika</em> study rolling dice a few million times found even faces turning up about 1.4% more often than they should, and a 2009 automated re-run of a classic 1894 dice experiment, published in <em>CHANCE</em>, found a comparable 1.3% bias. Cheap moulded dice are worse than casino dice with sharp square edges.</p>

      <p>The effect on your wallet is almost nothing. Below is what happens to the randomness as the die gets progressively worse, starting from a perfect one and ending at a die so skewed you would notice it across the room.</p>

      ${entropyChart()}

      <p>Read the orange bars first. A 24-word wallet begins with a colossal surplus and keeps it: even the deliberately absurd final case leaves it far above the line that counts. You could roll with a genuinely bad die and still end up with a wallet nobody is guessing.</p>

      <p>Now read the green bars. A 12-word wallet starts <em>level</em> with the 128-bit mark and has nowhere to go but down. By the last case it has fallen through both thresholds.</p>

      <p>That comparison is the practical argument for rolling 99 times instead of 50. If you are going to the trouble of doing this by hand, the extra forty-nine rolls buy you a margin so large that the fairness of your dice stops being a question worth asking.</p>

      ${pullQuote("Do not try to correct for bias by discarding rolls you dislike. That does far more damage than any real die ever would.")}

      <h2>Your rolls are not a backup</h2>

      <p>Here is the part that catches people out, and it is worth reading twice.</p>

      <p>There is no agreed standard for turning dice rolls into wallet words. Different wallets do the conversion differently &mdash; Keith Mukai's ${official("https://kdmukai-bot.github.io/seedsigner-ai-analysis/dice/standard.html", "survey of seventeen implementations")} finds five distinct methods in circulation, and three wallets sharing one of them still disagree with each other &mdash; which means <strong>the same 99 rolls will produce a completely different wallet on a different device</strong>.</p>

      <p>It is not even stable over time on one device. SeedSigner changed its method in 2022, so rolls recorded before that no longer rebuild the same wallet on current firmware.</p>

      <p>So: your recovery words are the backup. Write them down carefully, exactly as the device shows them, in order. The column of dice rolls in your notebook is working paper, not a safety net &mdash; destroy it once the words are recorded and confirmed, and never file it away imagining it could rebuild the wallet later. It cannot.</p>

      <h2>Why the last word is not really yours</h2>

      <p>You may notice that the final word of your phrase seems fixed, or that the device has to work it out for you rather than letting you pick. That is normal and it is not the dice being ignored.</p>

      <p>The last word is mostly a <a href="../glossary.html#term-checksum">checksum</a> &mdash; a small built-in error check, calculated from all the words before it. It is quietly one of the most useful things in the whole design: if you copy a word down wrong, the phrase gets rejected when you try to restore it, instead of silently opening a different, empty wallet and leaving you to work out what happened.</p>

      <h2 id="checking-the-conversion">Checking that your device did what it said</h2>

      <p>It is possible to verify that a device converts rolls the way it claims. You roll a short test set, run the same rolls through an independent tool, and see whether you get the same words out. If they match, the device is honest about its method.</p>

      <p>This is a genuinely advanced exercise, and it carries one rule with no exceptions.</p>

      ${cautions([
        "Only ever do this with a test sequence, on a wallet holding nothing that you wipe afterwards. Never with the rolls behind a wallet you use.",
        "Never type the rolls or the words of a real wallet into anything except the device itself &mdash; not a website, not an offline copy of one, not a notes app, not a spreadsheet.",
        "Anything that asks you to enter an existing recovery phrase to \"verify\" or \"validate\" it is stealing from you, however official it looks."
      ])}

      ${callout("The tool for the job", `This site publishes one: <a href="../entropy.html">Entropy Workshop</a>. Enter your test rolls, coin flips or drawn cards and it shows the words and first addresses they convert to, so you can compare them against what your device produced. It is a single file with nothing loaded from anywhere, so you can save it and run it on a machine that has never been online &mdash; and it deliberately cannot generate randomness or accept an existing recovery phrase, which is why it is safe to point you at. <a href="bring-your-own-entropy.html">Bring Your Own Entropy</a> walks through every control on it, and how to check the file itself before you trust what it tells you.`)}

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
        Method comparison, cross-device warning, and verification steps after Keith Mukai&rsquo;s
        ${official("https://kdmukai-bot.github.io/seedsigner-ai-analysis/dice/standard.html", "Dice to seed")}.
        Dice-bias figures from Iversen, Longcor, Mosteller, Gilbert &amp; Youtz, <em>Psychometrika</em> 36(1), 1971, and Labby, <em>CHANCE</em> 22(4), 2009.
      </p>`
  },
  {
    slug: "bring-your-own-entropy",
    category: "advanced",
    products: [],
    title: "BYOE: Bring Your Own Entropy",
    titleMark: "sc-die-mark",
    summary: "The Workshop turns coin flips, dice rolls or a shuffled deck into a wallet you can hold against your device. What it does with what you give it, what it refuses to do, and how to check it before you believe a word of it.",
    level: "intermediate",
    minutes: 16,
    goals: ["learn", "harden"],
    tags: ["Entropy", "Seed generation", "Open source"],
    icon: "bi-rulers",
    updated: "2026-08-27",
    status: "published",
    related: ["dice-entropy", "quickstart", "three-dice-seed", "human-randomness"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">A wallet is one enormous secret number. The Entropy Workshop will not make that number for you &mdash; there is no random number generator anywhere in it, and that absence is the whole design. You bring the randomness in from the physical world, and the page does the arithmetic in front of you: the same arithmetic your signing device does privately, so you can hold the two side by side and see whether they agree.</p>

      <p>This guide is about reading that tool. What each control changes, what comes out the other end, and how to check the page itself before you trust anything it tells you.</p>

      ${markLink("../entropy.html", "Open the Entropy Workshop")}

      <h2><span class="sc-article-num">1</span>It cannot generate anything, and that is the feature</h2>

      <p>Most "seed generator" pages you will find offer a button that produces a phrase. This one does not have that button, because it does not have anything to put behind it. There is no call to the browser&rsquo;s random number generator in the conversion path at all. Every bit that ends up in a wallet came off a coin, a die or a card that you handled.</p>

      <p>The second absence matters just as much: there is nowhere on the page to type a recovery phrase you already own. The tool converts physical events into words, and only in that direction. A page that has no field for your phrase cannot be tricked into sending your phrase somewhere, which is a stronger guarantee than any promise about what it does with the field.</p>

      ${pullQuote("A tool that cannot accept your recovery phrase cannot leak it. That is worth more than a promise not to.")}

      <h2><span class="sc-article-num">2</span>Pick the source you actually have</h2>

      <p>Step one asks what you are going to flip, roll or draw. The three sources are not interchangeable &mdash; they differ in how much each event is worth, and therefore in how long you will be sitting there.</p>

      <ul>
        <li><strong>Coins.</strong> One bit a flip, packed straight into the seed with nothing hashed. That makes it the only source you can check entirely by hand: heads is a 1, tails a 0, in the order you flipped them. It also makes it the longest &mdash; a 12-word seed takes exactly 128 flips, and a 24-word seed exactly 256.</li>
        <li><strong>Six-sided dice.</strong> Each roll carries log2(6) = 2.585 bits, so 50 rolls fill a 12-word seed and 99 fill a 24-word one. The rolls are hashed rather than packed, which is why the count is not a round number.</li>
        <li><strong>Octal and hex dice.</strong> One eight-sided die and two sixteen-sided dice throw 3 + 4 + 4 = 11 bits between them, which is exactly one recovery word. Nothing is hashed: the three faces name the word the way the printed dictionary does.</li>
        <li><strong>Cards.</strong> A shuffled deck, drawn without replacement, so each card is worth slightly less than the last &mdash; log2(52) = 5.70 bits for the first, then log2(51), and so on. Twenty-five cards carry enough for 12 words. Twenty-four needs fifty-eight, which is more than a deck holds: draw all 52, shuffle them back together, and draw six more. The Workshop counts it the same way &mdash; it greys out the cards already drawn, and once the deck is finished it tells you to shuffle and carry on.</li>
      </ul>

      ${figure({
        src: "../assets/img/bring-your-own-entropy-dice.jpg",
        alt: "Two white dice caught in mid-air above a navy felt runner on a scarred wooden table, beside a whisky glass, a brass oil lamp, a leather notebook and a scatter of coins",
        caption: "The part the page cannot do for you. Everything downstream is arithmetic; this is the only step that produces anything unpredictable.",
        width: 1376,
        height: 768
      })}

      <p>Whichever you choose, the page counts events rather than characters, and refuses to count a half-entered one &mdash; a card rank with no suit yet is not a card.</p>

      <h2><span class="sc-article-num">3</span>The conversion is the part that has to match your device</h2>

      <p>Here is the fact that sends most people to a tool like this in the first place: <strong>the same dice rolls produce different recovery words on different devices.</strong> Not because any of them is wrong, but because they made different reasonable choices about how to turn digits into bits.</p>

      <p>So step two asks which convention to follow. For six-sided dice there are four:</p>

      <ul>
        <li><strong>Hash the rolls</strong> &mdash; SHA-256 over the digits exactly as typed. COLDCARD, SeedSigner and Krux.</li>
        <li><strong>Hash, with 6 as 0</strong> &mdash; the same, after rewriting every 6 as a 0 first. Keystone and the BIP39 HTML tool.</li>
        <li><strong>The bit table</strong> &mdash; each face contributes one or two bits, so no fixed number of rolls fills a seed.</li>
        <li><strong>The BitBox lookup</strong> &mdash; five four-sided dice and a coin name a word outright, with nothing hashed.</li>
      </ul>

      <p>Cards have three: hash a compact ASCII transcript, hash the Ian Coleman tool&rsquo;s spaced suit-symbol transcript, or use that tool&rsquo;s variable-length card codes. Coins have one, because there is only one sensible thing to do with a bit.</p>

      ${callout("If the words disagree with your device", `Change the conversion before you conclude anything. A mismatch between this page and your hardware is far more likely to be two different conventions than a dishonest device &mdash; and the page names which devices use which convention precisely so that you can check that first.`)}

      <h2><span class="sc-article-num">4</span>The last word, and when you get to choose it</h2>

      <p>A recovery phrase is not purely random. In a 12-word phrase, the first 11 words and part of the twelfth carry 128 bits of entropy, and the last four bits of the final word are a <a href="../glossary.html#term-checksum">checksum</a> computed from everything before them. In a 24-word phrase it is 256 bits and eight checksum bits. That is what makes a mistyped phrase detectable rather than silently wrong.</p>

      <p>The tool always shows you whether the checksum holds, and it will open up and explain what the last word is made of if you ask it to. Where the interesting difference lies is whether you get a say in that last word:</p>

      <ul>
        <li><strong>Hashing methods leave you no choice.</strong> Hashing fixes all 128 or 256 entropy bits at once, so exactly one final word fits, and the tool fills it in.</li>
        <li><strong>Lookup methods do.</strong> The octal-and-hex dictionary gives you 11 words from 11 throws, which is 121 bits &mdash; seven short of 128. Those seven unrolled bits are yours to pick, which means <strong>128 valid endings</strong> to choose from at 12 words, and eight at 24. The checksum itself is never a choice; it is computed either way.</li>
      </ul>

      <h2><span class="sc-article-num">5</span>What comes out</h2>

      <p>Pressing the button gives you rather more than a phrase, because a phrase on its own is hard to check against anything:</p>

      <ul>
        <li><strong>The recovery words</strong>, numbered, with the checksum verdict beneath them.</li>
        <li><strong>The account private key</strong> &mdash; the half that spends, shown openly beneath the words because the words are the more powerful secret and are already on screen. Where the address type has a SLIP-132 prefix, its twin is shown beside it, so a wallet displaying one and a device displaying the other do not look like a disagreement.</li>
        <li><strong>The account public key</strong>, which is what a watch-only wallet means when it asks for your <a href="../glossary.html#term-xpub">xpub</a>.</li>
        <li><strong>A watch-only <a href="../glossary.html#term-descriptor">descriptor</a></strong>, written the way a wallet wants to be handed one &mdash; script type named so it cannot be imported as the wrong address type, receiving and change covered together, and eight characters of checksum after the hash so a wallet can tell you that you mistyped rather than silently watching the wrong account.</li>
        <li><strong>The first addresses</strong> on both the receiving and change branches, which is usually the fastest thing to compare against a device screen.</li>
      </ul>

      <p>The address type you pick changes the derivation path underneath all of it: legacy sits at m/44&rsquo;/0&rsquo;/0&rsquo;, nested SegWit at m/49&rsquo;/0&rsquo;/0&rsquo;, native SegWit at m/84&rsquo;/0&rsquo;/0&rsquo;, and taproot at m/86&rsquo;/0&rsquo;/0&rsquo;. Restoring the right words down the wrong path is the single most common reason a correctly restored wallet looks empty.</p>

      <h2><span class="sc-article-num">6</span>The meter, and why more rolls stop helping</h2>

      <p>As you enter events the page tracks how many bits they carry against how many the seed can hold. It is worth watching once, because the arithmetic is not intuitive: ninety-nine rolls of a six-sided die come to 255.9 bits, just under the 256 a 24-word seed holds, which is exactly why those rolls are hashed rather than packed in.</p>

      <p>Keep rolling past the target and the count keeps climbing, because the count is honest about the source. What it will also tell you is that the extra lands nowhere: a seed holds what it holds, and everything above that is hashed down into the same number of bits. More rolls past the line change <em>which</em> wallet you get. They do not make it harder to guess.</p>

      <h2><span class="sc-article-num">7</span>It checks itself, and it checks you</h2>

      <p>Three separate guards run, and it is worth knowing what each one does and does not mean.</p>

      <p><strong>It tests itself on load.</strong> The page carries published test vectors and runs them before it will show you anything. If any of them fail, it refuses to render results at all, because a conversion tool that is quietly wrong is worse than no tool.</p>

      <p><strong>It refuses obviously typed input.</strong> Ninety-nine 1s, a walk up and down the faces, a neat repeating block &mdash; these get turned away. Cards get stricter treatment still, because a deck has rules: a rank must be followed by a suit, and one deck cannot deal the same card twice, so an impossible transcript is refused rather than quietly hashed.</p>

      <p><strong>Neither of those is a randomness test.</strong> Passing the fabrication check means "nothing here is obviously fabricated". It does not mean the dice were fair, that you shuffled properly, or that the result is good randomness. No page can tell you that from the digits alone.</p>

      ${cautions([
        "A passing fabrication check is not a verdict on your dice or your shuffle.",
        "The tool cannot detect a loaded die, a sticky coin, or a deck that was not really shuffled.",
        "If you find yourself re-rolling because a sequence <em>looks</em> wrong, stop &mdash; that instinct is the bias the entropy guides describe, and it makes the result worse rather than better."
      ])}

      <h2><span class="sc-article-num">8</span>Check the file before you trust it</h2>

      <p>The whole tool is one self-contained HTML file. It embeds its own fonts, styles, script and wordlist, carries a restrictive content-security policy, and makes no automatic network request of any kind. That is what makes it possible to carry it to a machine that has never been online.</p>

      <p>Its SHA-256 is published beside it, and the page shows you how to check it:</p>

      <ul>
        <li><code>certutil -hashfile entropy-offline.html SHA256</code> on Windows</li>
        <li><code>shasum -a 256 entropy-offline.html</code> on macOS or Linux</li>
      </ul>

      <p>Be clear about what that proves. It proves the file arrived intact &mdash; a truncated download, a proxy that rewrote something, a bad USB stick all change the hash and you will see it. <strong>It does not prove the file is genuine</strong>, because the checksum is served from the same place as the file it describes. Anyone able to replace one could replace the other. Same-origin checksums catch accidents, not adversaries. If a result is going to change what you believe about a wallet, compare a copy fetched over a different network or taken from the repository&rsquo;s history, and read the file &mdash; it is one unminified document, specifically so that reading it is possible.</p>

      <h2><span class="sc-article-num">9</span>Where to run it, and the limit it will not pretend past</h2>

      <p>Download it, check the hash, and open it from disk on a machine with no network. The page will tell you which copy you are running and how it was loaded, and it is careful about the wording, because there is a thing it genuinely cannot know.</p>

      <p><strong>It cannot tell whether your machine is offline.</strong> From inside a browser, a local file on a fully connected laptop is indistinguishable from the same file on an air-gapped one. No badge on any page is proof of an air gap &mdash; only how you set the machine up is.</p>

      ${callout("What this tool is for", `It is experimental, and it is for testing. Do not rely on it to secure real bitcoin, and never test with funds you cannot afford to lose. Use it to check that a device produced what it should have, with a sequence you are content to throw away &mdash; not to manufacture the wallet you are going to live on.`)}

      <h2>This is the instrument, not the procedure</h2>

      <p>Worth being plain about where this page sits. Everything above describes a tool for checking work \u2014 it is not the method, and it is not the part that keeps bitcoin safe. The full dice procedure lives in one guide and the rules that outrank all of this live in another, and if you only read one more thing, read those rather than coming back here.</p>

      <p class="mt-4"><a class="sc-text-link" href="dice-entropy.html">Roll the dice: the full procedure, and the rules people break <i class="bi bi-arrow-right"></i></a></p>
      <p><a class="sc-text-link" href="quickstart.html">Intro to Self Custody: back it up and prove you can recover it <i class="bi bi-arrow-right"></i></a></p>
      <p><a class="sc-text-link" href="human-randomness.html">Why you cannot think of a random number <i class="bi bi-arrow-right"></i></a></p>

      <p class="sc-source-note">
        Conversions follow BIP32, BIP39, BIP44/49/84/86 and SLIP-132; the descriptor follows
        ${official("https://github.com/bitcoin/bips/blob/master/bip-0380.mediawiki", "BIP380")}
        with the multipath notation of
        ${official("https://github.com/bitcoin/bips/blob/master/bip-0389.mediawiki", "BIP389")}.
        Device conventions are taken from each vendor&rsquo;s own documentation and reproduced as published test vectors.
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
    goals: ["harden", "setup", "multisig"],
    tags: ["Multisig", "Descriptor", "Recovery"],
    icon: "bi-diagram-3",
    updated: "2026-08-17",
    status: "published",
    related: ["recovery-test-drill", "sparrow-first-wallet", "coldcard-setup"],
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
    summary: "Three keys in three places is easy to say and easy to get wrong. The locations that only look independent, the window when your keys travel together, and an honest account of what a safe deposit box and a trusted friend each actually do.",
    level: "advanced",
    minutes: 30,
    goals: ["harden", "multisig", "inherit"],
    tags: ["Multisig", "Threat model"],
    icon: "bi-people",
    updated: "2026-08-18",
    status: "published",
    related: ["multisig-2of3", "recovery-test-drill", "seed-backup-metal"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">The rule is easy to state: no single event should reach enough keys to spend. <a href='multisig-2of3.html'>The multisig guide</a> states it, and most people nod and put one key at home, one at their parents' house, and one in a safe deposit box.</p>

      <p>Then they drive all three to the bank on the same Saturday, or discover their two "separate" locations sit in the same flood plain, or find that the person holding key three has moved twice and is not certain where they put it.</p>

      <p>The interesting question is not where to put keys. It is which of your locations are secretly the same location &mdash; because that is the failure this whole arrangement exists to prevent, and it is invisible until it happens.</p>

      ${figureSlot({
        shot: "A map spread on a table with three pins in it, two of them close enough together that the gap between looks smaller than intended, a coffee cup weighing down one corner.",
        caption: "Three pins on a map is the easy part. Whether they are genuinely three is the question.",
        ratio: "16 / 9",
        icon: "bi-people"
      })}

      <h2><span class="sc-article-num">1</span>The test to design against</h2>

      <p>Here is a single criterion that does more work than any list of recommended locations:</p>

      ${pullQuote("Could one person, one event, or one legal process collect enough of your keys in a single afternoon?")}

      <p>If yes, the geography has failed regardless of how many pins are on the map. If no, you have built the thing you were trying to build.</p>

      <p>Note that the test covers three different kinds of adversary, and they do not respect the same boundaries. A burglar is stopped by distance. A flood is stopped by elevation and watershed. A court order is stopped by neither, and is stopped instead by jurisdiction &mdash; or not at all.</p>

      <h2><span class="sc-article-num">2</span>Locations that only look independent</h2>

      <p>This is the section worth the price of admission. Every item below describes two locations most people would count as separate, and a reason they are not.</p>

      ${cautions([
        "<strong>Same disaster footprint.</strong> Your house and your brother's house across town share a flood plain, a wildfire corridor, an earthquake zone, or a hurricane track. Distance on a map is not distance in a hazard map.",
        "<strong>Same institution.</strong> Two safe deposit boxes at two branches of one bank are one bank. A closure, a merger, an outage, or a legal process reaches both at once.",
        "<strong>Same person.</strong> A friend holding one key and also holding your spare house key holds two keys. So does the sibling who has a box at the same bank as you.",
        "<strong>Same jurisdiction.</strong> One court order, one search warrant, one authority. Keys in three houses in one city are three houses and one legal boundary.",
        "<strong>Same credential.</strong> If every location opens with your identification and your presence, then everything that compels you reaches all of them together.",
        "<strong>Same knowledge.</strong> Three keys perfectly distributed, and one document at home listing where they all are. The document is now the wallet.",
        "<strong>Same routine.</strong> If you service all three locations on one annual trip, there is one day a year when the arrangement does not exist. More on that next."
      ])}

      <p>You do not need to defeat all seven. You need to know which ones you have accepted, deliberately, rather than discovering one during the event it was supposed to survive.</p>

      <h2><span class="sc-article-num">3</span>The window when it all travels together</h2>

      <p>Distributed storage has a recurring moment of maximum vulnerability, and almost nobody plans for it: the times the keys move.</p>

      <p>Setup is the first one. You initialise three devices at your kitchen table, and for an afternoon every key you own is within arm's reach of a single event. That is unavoidable, but it should be brief and it should not be documented in photographs.</p>

      <p>The recurring one is worse because it feels responsible. You decide to check your backups annually, so you collect them, verify them, and redistribute them &mdash; and for several hours two or three keys are in one car, in one bag, in one house.</p>

      ${checklist([
        "<strong>Verify in place wherever you can.</strong> Confirming a plate is legible and a device still powers on does not require bringing it home.",
        "<strong>Stagger the schedule.</strong> Check one location in spring and another in autumn rather than all of them on one trip.",
        "<strong>Never carry two keys in one bag,</strong> even for an hour, even locally. This is the specific mistake that turns a well-designed arrangement into a single point of failure for the duration of a drive.",
        "<strong>Rehearse recovery with a spare wallet</strong> rather than the real one, so that <a href='recovery-test-drill.html'>the drill</a> does not require assembling the real keys at all."
      ])}

      <h2><span class="sc-article-num">4</span>Safe deposit boxes, honestly</h2>

      <p>They are a good tool with specific properties, and the properties are not the ones people assume.</p>

      ${checklist([
        "<strong>Excellent against:</strong> house fires, domestic burglary, floods at your address, and casual discovery by visitors and relatives.",
        "<strong>Poor against:</strong> anything requiring access at three in the morning, on a holiday, or during a bank closure.",
        "<strong>Check what happens when you die.</strong> Access can be frozen pending estate process, which is precisely when your heirs need it. This is the single most common unpleasant surprise.",
        "<strong>Check who else can be added</strong>, and what identification they will need years from now.",
        "<strong>Do not assume insurance.</strong> Box contents are typically not covered by the bank, and a home contents policy may not extend to them either.",
        "<strong>They are reachable by legal process.</strong> That may be irrelevant to you, or it may be the entire point &mdash; but it should be a known property rather than a discovery."
      ])}

      <h2><span class="sc-article-num">5</span>Trusted people, honestly</h2>

      <p>The risk with a trusted person is almost never that they steal from you. It is that their life carries on without reference to your arrangement.</p>

      ${cautions([
        "<strong>They move.</strong> Twice, over the decade you were planning for, and the sealed envelope is in whichever box did not get unpacked.",
        "<strong>Their circumstances change.</strong> A divorce, a new partner, a housemate, a break-in at their home &mdash; none of it involves any bad faith towards you.",
        "<strong>They die, or their memory does.</strong> Nobody in their household knows what the object is or that it matters.",
        "<strong>They talk.</strong> Not maliciously. It is an interesting thing to be asked to hold, and mentioning it is human."
      ])}

      ${checklist([
        "<strong>Give them an object, not a secret.</strong> A sealed device or plate they cannot use alone is a much smaller burden than knowledge.",
        "<strong>Tell them it matters and that it is not urgent</strong>, so it gets stored properly rather than left in a drawer or thrown out in a move.",
        "<strong>Write down what should happen to it</strong> if you are not around, and make sure that instruction reaches them by a route that does not depend on you.",
        "<strong>Check in occasionally.</strong> A friendly annual question confirms it still exists, which is more than most arrangements can claim."
      ])}

      <h2><span class="sc-article-num">6</span>What each arrangement actually defends</h2>

      <div class="sc-guide-data-panel sc-geo-panel">
        <div class="sc-guide-data-heading">
          <span class="sc-guide-data-mark">3/5</span>
          <div><span>Geographic resilience</span><h3>What each arrangement survives</h3></div>
          <strong>More distance, more coverage</strong>
        </div>
        <div class="sc-geo-matrix" role="table" aria-label="Common arrangements against the events they are meant to survive">
          <div class="sc-geo-head" role="row"><span>Arrangement</span><span>House fire</span><span>Burglary</span><span>Regional disaster</span><span>Compelled access</span></div>
          <div class="sc-geo-row" role="row"><strong>All keys at home</strong><span class="is-no" data-label="House fire">No</span><span class="is-no" data-label="Burglary">No</span><span class="is-no" data-label="Regional disaster">No</span><span class="is-no" data-label="Compelled access">No</span></div>
          <div class="sc-geo-row" role="row"><strong>Home + a safe in the same house</strong><span class="is-partly" data-label="House fire">Partly</span><span class="is-partly" data-label="Burglary">Partly</span><span class="is-no" data-label="Regional disaster">No</span><span class="is-no" data-label="Compelled access">No</span></div>
          <div class="sc-geo-row" role="row"><strong>Home + local relative + local bank</strong><span class="is-yes" data-label="House fire">Yes</span><span class="is-yes" data-label="Burglary">Yes</span><span class="is-no" data-label="Regional disaster">No</span><span class="is-no" data-label="Compelled access">No</span></div>
          <div class="sc-geo-row" role="row"><strong>Home + distant relative + bank</strong><span class="is-yes" data-label="House fire">Yes</span><span class="is-yes" data-label="Burglary">Yes</span><span class="is-yes" data-label="Regional disaster">Yes</span><span class="is-partly" data-label="Compelled access">Partly</span></div>
          <div class="sc-geo-row" role="row"><strong>Distributed across jurisdictions</strong><span class="is-yes" data-label="House fire">Yes</span><span class="is-yes" data-label="Burglary">Yes</span><span class="is-yes" data-label="Regional disaster">Yes</span><span class="is-yes" data-label="Compelled access">Yes</span></div>
        </div>
      </div>

      <p>Read that bottom row with suspicion rather than ambition. Crossing jurisdictions defends against the one thing nothing else does, and it introduces problems most people should not accept: keys you cannot reach quickly, arrangements that depend on travel remaining easy, and complexity your heirs will inherit. It is the right answer for a small number of people and an expensive affectation for everyone else.</p>

      <h2><span class="sc-article-num">7</span>The cost nobody prices in</h2>

      <p>Every increase in dispersion buys resilience and spends accessibility, and accessibility is not a luxury &mdash; it is what determines whether the arrangement ever gets tested.</p>

      <p>A wallet requiring a weekend of travel to use is a wallet you will not verify. An unverified backup is a guess, and a guess that has sat in a box for four years is a worse guess. The most common way these setups fail is not dramatic: the owner simply never checked, and something had gone wrong quietly.</p>

      ${callout("The honest calibration", "Aim for an arrangement you can fully exercise once a year without dreading it. If the plan is so elaborate that you keep postponing the rehearsal, it is not a more secure plan than the simpler one you would actually maintain — it is a less secure one wearing a costume.")}

      <h2><span class="sc-article-num">8</span>The map problem</h2>

      <p>Every dispersed arrangement eventually produces a document explaining it, because otherwise nobody &mdash; including future you &mdash; can use it.</p>

      <p>That document is a genuine hazard. A single page saying which key is where, found in a desk drawer, converts your carefully distributed setup back into a one-afternoon collection job for anyone who reads it.</p>

      ${checklist([
        "<strong>Describe locations without addresses</strong> where you can &mdash; enough for someone who already knows your life, not enough for a stranger.",
        "<strong>Separate the map from the keys.</strong> It should not live in any location that holds one.",
        "<strong>Do not list what the objects are.</strong> \"The sealed envelope with Ruth\" is safer than a full explanation of what it contains and what it is worth.",
        "<strong>Plan how it reaches the right person</strong> at the right time. That is an inheritance problem, and it is a large enough one to deserve its own treatment."
      ])}

      <h2>The short version</h2>

      <p>Ask whether one person, one event, or one legal process could collect enough keys in a single afternoon. Watch for locations that share a hazard, an institution, a person, a jurisdiction, or a document. Never let two keys travel together, know what a safe deposit box does when you die, and choose a level of dispersion you will actually maintain.</p>

      ${callout("If you take one thing from this page", `Independence is a property of threats, not of distance. Two locations are only genuinely separate with respect to a specific event — and the arrangement that survives a house fire may fall to one court order, one bank merger, or one Saturday when everything was in the same car.`)}`
  },
  {
    slug: "passphrase-setup",
    category: "advanced",
    products: [],
    title: "BIP39 passphrases, and when not to use one",
    summary: "A passphrase is not a password on your wallet. It is a switch that selects a different wallet entirely — which is why a single wrong character shows you an empty balance and no error message.",
    level: "advanced",
    minutes: 30,
    goals: ["harden", "recover"],
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
    goals: ["harden", "learn", "recover"],
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

      <div class="sc-guide-data-panel sc-bip85-panel">
        <div class="sc-guide-data-heading">
          <span class="sc-guide-data-mark">85</span>
          <div><span>On-device support</span><h3>Where child-seed derivation works</h3></div>
          <strong>Checked with makers</strong>
        </div>
        <div class="sc-bip85-columns">
          <section class="is-supported"><h3><span>Yes</span> Available on-device</h3>
            <article><strong>COLDCARD</strong><p>Advanced/Tools; outputs words, XPRV, hex, or passwords.</p></article>
            <article><strong>Blockstream Jade</strong><p>Options &rarr; Wallet &rarr; BIP85; choose 12 or 24 words and an index.</p></article>
            <article><strong>Foundation Passport</strong><p>Key Manager extension, with SeedQR export of the child.</p></article>
            <article><strong>SeedSigner</strong><p>Child-seed generation on a device that stores nothing.</p></article>
            <article><strong>Krux</strong><p>Derives a child BIP39 mnemonic on-device.</p></article>
          </section>
          <section class="is-unsupported"><h3><span>No</span> Not currently supported</h3>
            <article><strong>Trezor</strong><p>Requested since 2021 and still not implemented. Shamir backup solves a different problem.</p></article>
            <article><strong>Ledger</strong><p>Not in Ledger Live. Its Seed Tool app lists BIP85 as planned rather than available.</p></article>
          </section>
        </div>
      </div>

      <p>Notice what that list does <em>not</em> divide along. It is not air-gapped against connected, and not standalone against companion-app &mdash; Jade and Passport both ship companion apps and both support it. The two without it are the large multi-asset incumbents, which is a different distinction entirely.</p>

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
    goals: ["harden", "recover"],
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
    summary: "Instructions someone can follow while grieving, that are not enough to steal with while you are alive. Why your will is the wrong place for any of it, and the failure that loses more coins than any other.",
    level: "advanced",
    minutes: 45,
    goals: ["harden", "inherit", "multisig"],
    tags: ["Inheritance", "Estate"],
    icon: "bi-people",
    updated: "2026-08-18",
    status: "published",
    related: ["multisig-2of3", "scripts-and-miniscript", "multisig-key-geography"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">An inheritance plan has to do two things that pull in opposite directions. It must let someone reach your bitcoin after you die. And it must not let anyone reach it before &mdash; including the person you are relying on.</p>

      <p>Get the first wrong and the coins are gone forever, which is the outcome most people are worried about. Get the second wrong and you have simply given your bitcoin away early, to someone who now has years of opportunity and every ordinary human pressure acting on them. That failure is quieter and nobody plans for it.</p>

      <p>Almost everything difficult about this subject comes from holding both requirements at once. Nothing here is legal or tax advice, and this is a subject where a professional in your own jurisdiction earns their fee.</p>

      ${figureSlot({
        shot: "A sealed envelope on a desk beside a closed laptop and a set of keys, afternoon light, nobody in the room.",
        caption: "The plan has to survive you. It also has to be inert while you are still here.",
        ratio: "16 / 9",
        icon: "bi-people"
      })}

      <h2><span class="sc-article-num">1</span>Separate three different things</h2>

      <p>Most bad plans collapse because they treat this as one problem. It is three, and they have completely different security requirements.</p>

      ${checklist([
        "<strong>The knowledge that bitcoin exists.</strong> Somebody must learn this after you die. If nobody does, everything else was irrelevant. This part is not secret in any useful sense &mdash; it only needs to be reliable.",
        "<strong>The instructions for how to reach it.</strong> What devices exist, where they are, what order to do things in, who to ask for help. Sensitive, but not sufficient to steal with if written properly.",
        "<strong>The secrets themselves.</strong> Seed words, passphrases, PINs. These should never be assembled in one place, by anyone, until they are actually needed."
      ])}

      <p>A plan that keeps these three separate can be robust and safe at once. A plan that merges them &mdash; the classic envelope containing the words and the explanation together &mdash; is a wallet with a delayed fuse.</p>

      <h2><span class="sc-article-num">2</span>Your will is the wrong place</h2>

      <p>This is the most consequential mistake in the subject, and it is made by careful people acting in good faith.</p>

      <p>In many jurisdictions, including much of Canada, <strong>a will submitted to probate becomes a public document.</strong> Anyone can request a copy. That means seed words in a will are seed words published, and a passphrase written into a bequest is a passphrase disclosed to whoever cares to look.</p>

      ${cautions([
        "<strong>Never put seed words, a passphrase, or a device PIN in a will.</strong> Not in the body, not in a schedule, not in an annex.",
        "<strong>Do not put exact storage locations in it either.</strong> A published document naming the bank and the box number is a map for a stranger.",
        "<strong>Assume anything in the will may be read by people you did not choose</strong>, at a moment when your estate is publicly known to contain valuable assets."
      ])}

      <p>What the will <em>should</em> do is establish authority and point onward: that a bitcoin estate exists, who inherits it, and that a separate letter of instruction is held by a named person or firm. That is enough to give your executor standing without disclosing anything worth stealing.</p>

      ${pullQuote("The will says the treasure exists and who it belongs to. It must never say where the shovel is.")}

      <h2><span class="sc-article-num">3</span>Choosing the mechanism</h2>

      <p>Several arrangements solve the timing problem &mdash; access afterwards, none before. They differ mostly in how much competence they demand from your heirs and how much they cost.</p>

      <div class="sc-guide-data-panel sc-inheritance-panel">
        <div class="sc-guide-data-heading">
          <span class="sc-guide-data-mark">&rarr;</span>
          <div><span>Access after death</span><h3>Five ways to hold the line</h3></div>
          <strong>Capability arrives later</strong>
        </div>
        <div class="sc-inheritance-grid">
          <article class="is-green"><h3>Multisig with a third party</h3><p><span>How it works</span>Heirs hold one key; a lawyer, firm, or trusted person holds another. Neither side can act alone.</p><p><span>It demands</span>Coordination, and an heir who can complete a signing.</p></article>
          <article class="is-orange"><h3>Collaborative custody</h3><p><span>How it works</span>Unchained or Casa holds a key and runs a verified inheritance process.</p><p><span>It demands</span>Ongoing fees, and trusting a company to still exist.</p></article>
          <article class="is-cream"><h3>Timelocked spending paths</h3><p><span>How it works</span>A smaller quorum becomes valid only after a long delay, enforced by bitcoin itself.</p><p><span>It demands</span>Real technical skill. See <a href='scripts-and-miniscript.html'>scripts and Miniscript</a>.</p></article>
          <article class="is-red"><h3>Product inheritance features</h3><p><span>How it works</span>Built-in claim processes with long notice periods, such as Bitkey's.</p><p><span>It demands</span>Committing to that product's ecosystem.</p></article>
          <article class="is-orange"><h3>Sealed instructions with a professional</h3><p><span>How it works</span>A lawyer holds a sealed envelope released only on death.</p><p><span>It demands</span>Trusting a firm and its filing over decades.</p></article>
        </div>
      </div>

      <p>The first two are where most people should look. A <a href='multisig-2of3.html'>2-of-3 multisig</a> is already the shape of an inheritance plan &mdash; you simply have to decide who holds the third key and under what conditions it becomes available.</p>

      <h2><span class="sc-article-num">4</span>The failure that loses the most coins</h2>

      <p>Not theft. Not fire. <strong>An heir who cannot execute the plan.</strong></p>

      <p>People design elaborate arrangements and hand them to a spouse or a child who has never owned bitcoin, has no idea what a PSBT is, and will be attempting this in the worst month of their life. The plan is technically perfect and practically inert.</p>

      ${checklist([
        "<strong>Write for a stressed beginner, not for yourself.</strong> Assume no prior knowledge, name specific software, and describe what each screen will look like.",
        "<strong>Name a technical helper explicitly.</strong> Someone competent your heirs may call, who is not the same person holding a key. Ask them first.",
        "<strong>Say what <em>not</em> to do</strong>, in bold, near the top. Do not type these words into a website. Do not photograph them. Do not accept help from anyone who contacts you first.",
        "<strong>Include the boring specifics.</strong> Which wallet software, which device, what a passphrase is and that one exists, roughly what the balance should be so they know when they have found all of it."
      ])}

      ${callout("The single most useful sentence you can write", "\"Do not be rushed, and do not let anyone you did not contact first help you with this.\" Newly bereaved people holding sudden wealth and unfamiliar technology are a well-known target. Your instructions are the only place you can warn them in advance.")}

      <h2><span class="sc-article-num">5</span>Making sure it is found</h2>

      <p>A perfect plan nobody discovers is identical to no plan. This is the most common total loss in bitcoin inheritance, and it is entirely preventable.</p>

      ${checklist([
        "<strong>Tell at least two people that a plan exists</strong> and where the instructions live &mdash; not what they contain.",
        "<strong>Make sure the executor knows</strong> before they are the executor. Discovering a bitcoin estate cold is a poor start.",
        "<strong>Keep the pointer somewhere ordinary.</strong> Wherever your important documents live is where someone will look. A brilliant hiding place is a failure mode.",
        "<strong>Do not rely on a dead man's switch alone.</strong> Automated services can fail, lapse, or shut down, and they can also fire early &mdash; which discloses everything while you are alive and well."
      ])}

      <p>There is a real tension here with <a href='multisig-key-geography.html'>key geography</a>: everyone who knows is a person who could be pressured or could talk. Two informed people is usually the right balance between discovery and exposure.</p>

      <h2><span class="sc-article-num">6</span>Rehearse it with the people who will use it</h2>

      <p>Every other backup on this site gets tested. This one almost never does, which is strange given it is the only one guaranteed to be used at a moment when you cannot help.</p>

      ${checklist([
        "<strong>Build a rehearsal wallet</strong> holding a trivial amount, using the same structure as the real one.",
        "<strong>Give your heir the instructions and leave the room.</strong> Watch where they get stuck without helping. Every place they hesitate is a place your document is unclear.",
        "<strong>Have the third-party keyholder participate</strong>, so their part is not theoretical either.",
        "<strong>Rewrite the instructions afterwards</strong>, using the words your heir actually used rather than the ones you assumed they knew."
      ])}

      <h2><span class="sc-article-num">7</span>The Canadian tax wrinkle</h2>

      <p>Worth knowing, and worth taking to a professional rather than to a forum.</p>

      <p>In Canada, death generally triggers a deemed disposition of capital property at fair market value, which can create a capital gain on your final return even though nothing was sold. Bitcoin is property for these purposes. That means an estate can owe tax on coins the heirs have not yet been able to reach &mdash; which is an unhappy combination if the access plan is slow.</p>

      ${checklist([
        "<strong>Keep records of what you paid and when.</strong> An heir who cannot establish a cost basis is in a much worse position.",
        "<strong>Consider the liquidity question.</strong> If the estate owes tax, something has to pay it.",
        "<strong>Tell your accountant the asset exists</strong>, in general terms, while you are alive."
      ])}

      <h2><span class="sc-article-num">8</span>Plans rot</h2>

      <p>An inheritance plan describes a world that keeps changing: devices get replaced, wallets get upgraded, people move, relationships change, and companies disappear.</p>

      ${checklist([
        "<strong>Review annually</strong>, at a fixed time you will not forget. Pair it with something you already do.",
        "<strong>Re-check after any change</strong> to your wallet setup, your keyholders, or your family.",
        "<strong>Date every version</strong> and destroy superseded copies. Two contradictory sets of instructions is worse than one imperfect set.",
        "<strong>Confirm your third party still exists</strong> and still offers the service you are relying on."
      ])}

      <h2>The short version</h2>

      <p>Separate the knowledge that bitcoin exists, the instructions for reaching it, and the secrets themselves. Keep all three out of your will, which may become public &mdash; the will should only establish authority and point to a separate letter. Choose a mechanism where access arrives after you are gone and not before, write the instructions for a stressed beginner, make sure two people know the plan exists, and rehearse it with the person who will have to do it.</p>

      ${callout("If you take one thing from this page", `Test it with your heirs while you are alive. Everything else on this page is guesswork until somebody who is not you tries to follow your instructions and you watch where they stop. It is an awkward afternoon that turns a document you hope works into one you know does.`)}`
  },
  /* The door into the concepts section, and the one page here that assumes no
     bitcoin knowledge at all -- hence beginner, and hence first. Written
     because twenty-one-million takes for granted that a reader already knows
     why a fixed supply is worth anything; this is the page that earns that
     assumption. The two case studies are load-bearing rather than decorative:
     beads and rai both failed the *same* way, which is the entire argument. */
  {
    slug: "what-is-money",
    category: "concepts",
    products: [],
    title: "What is money?",
    summary: "Cattle, salt, glass beads, limestone discs the size of a small car — plenty of things have done the job, and nearly all of them stopped. They stopped for the same reason every time, and it is the reason a hard cap exists.",
    level: "beginner",
    minutes: 18,
    goals: ["learn"],
    tags: ["Sound money", "Hard cap", "Scarcity"],
    icon: "bi-bank",
    updated: "2026-08-20",
    status: "published",
    related: ["twenty-one-million", "who-decides-the-rules", "owning-your-bitcoin"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Ask what money is and most answers point at examples &mdash; notes, coins, the balance in a banking app. That is a list of things currently doing the job, not a description of the job itself. The job is the interesting part, because the list keeps changing.</p>

      <p>Money is not a substance. It is a role, and an odd assortment of things have been hired into it: cattle, salt, cowrie shells, tobacco leaf, cigarettes, silver, gold, glass beads, and limestone discs weighing several tonnes. Nearly all of them were eventually fired. <strong>The manner of firing is the same story every time</strong>, and once you have seen it twice you will recognise it everywhere.</p>

      <h2><span class="sc-article-num">1</span>The job description</h2>

      <p>Something is money when it does three jobs at once.</p>

      ${checklist([
        "<strong>A medium of exchange.</strong> Something you accept not because you want it but because you know the next person will. This is what removes the need for a coincidence of wants — the baker who needs shoes finding a cobbler who happens to want bread that day.",
        "<strong>A store of value.</strong> Somewhere to keep effort you have already spent until you need it back. Work the harvest in September, eat in February. A money that leaks is a bucket with a hole in it: usable, but not for saving.",
        "<strong>A unit of account.</strong> A shared ruler. Wages, prices, debts and contracts all have to be quoted in something, and that something has to hold still enough to be worth quoting in."
      ])}

      <p>Most candidates fail at least one. Fresh fish is a fine medium of exchange for about a day and a hopeless store of value. A house stores value well and is useless for buying coffee. Doing all three at once is rare, and the ruler is usually the last job earned &mdash; nobody writes a five-year contract in something they expect to move.</p>

      <p>Notice that nothing on that list requires a government. <a href="../glossary.html#term-legal_tender">Legal tender</a> laws can compel a merchant to accept something, but they cannot make a population save in it, and history is full of people keeping accounts in one thing while paying taxes in another. Money is closer to a language than a law. It works because everyone else is using it, and it stops working when they stop.</p>

      <h2><span class="sc-article-num">2</span>Glass beads, and the cost of making more</h2>

      <p>For centuries, glass beads circulated as money across much of West Africa. The story is often told as one about gullibility &mdash; gold traded away for trinkets &mdash; and that telling is both unkind and wrong.</p>

      <p>The beads were a sensible money for the conditions. Glassmaking was a specialist craft, the beads arrived along long and dangerous trade routes, and producing one locally took real skill and real time. They were durable, portable, countable, hard to fake convincingly, and <strong>genuinely difficult to obtain</strong>. Every property you would want was present.</p>

      <p>Then the conditions changed. European glassworks &mdash; Venice above all &mdash; industrialised bead production. What had cost weeks of skilled labour came off a bench by the thousand for a fraction of a penny. Traders arriving on the coast were carrying something that was still money to the people they met and very nearly free to the people making it.</p>

      <p>What followed was not a trick played on fools. It was a large, sustained transfer of wealth conducted in the open, at prices both sides agreed to, using a money that only one side could manufacture. When enough beads had arrived they stopped being money at all &mdash; not because anyone banned them, but because everyone could see there were now far too many.</p>

      ${figure({
        src: "../assets/img/what-is-money-trade-beads.jpg",
        alt: "A handful of Venetian millefiori trade beads spilled across dark wood under a low side light, close enough that the machine-made regularity of the patterns is unmistakable",
        caption: "The beads never changed. The cost of making another one did.",
        width: 1300,
        height: 726
      })}

      <h2><span class="sc-article-num">3</span>Rai stones, and a ledger nobody wrote down</h2>

      <p>On the island of Yap, in the western Pacific, money was limestone. Not small pieces of it: carved discs up to twelve feet across with a hole through the middle, weighing several tonnes.</p>

      <p>Yap has no limestone. Every stone was quarried on Palau, some four hundred kilometres away, cut with shell tools, and floated home on rafts lashed to canoes. The voyages took months and men died on them. <strong>The worth of a stone was, quite literally, what it had cost to bring there</strong> &mdash; a stone whose journey had cost lives was worth more than a larger one that came home easily.</p>

      <p>The part that surprises people is what happened next. The stones did not move.</p>

      <p>Shifting several tonnes of limestone across a village to settle a debt is absurd, so the Yapese did not bother. Ownership changed by announcement: the transfer was made publicly, witnessed, and thereafter simply remembered. The stone stayed where it was. Anyone could tell you who owned which one and roughly how it had been acquired, because everybody had heard the same history.</p>

      <p>One famous stone sank in a storm on the way home. The crew reported the loss &mdash; the size, the quality, the fact that it was down there somewhere. The island accepted the account, and the stone was traded for generations afterwards without a single person ever laying eyes on it. Its owner was whoever the community agreed its owner was.</p>

      <p>That is a public ledger maintained by consensus, holding title to an asset nobody can pick up. It is not a bad description of a blockchain, and it is a very much older idea than the internet.</p>

      ${figure({
        src: "../assets/img/what-is-money-rai-stone.jpg",
        alt: "A rai stone standing in a village clearing on Yap: a limestone disc taller than the thatched houses behind it, the central hole framing the greenery, shot slightly from below so the scale reads immediately",
        caption: "A rai stone. Ownership moved by announcement; the stone stayed put.",
        width: 1300,
        height: 726
      })}

      <p>Rai money died the same death as the beads. In the 1870s an Irish-American trader named David O'Keefe worked out that with iron tools and a sailing ship he could produce rai stones faster and far more safely than any Yapese expedition. He did, and spent them on copra and labour.</p>

      <p>The Yapese were not fooled either. They could see the new stones were easy stones and discounted them accordingly, and older stones with hard histories kept their premium. But the supply kept arriving, and a money somebody else can produce cheaply does not stay money for long. Within a couple of generations rai was ceremonial.</p>

      ${pullQuote("Two societies, an ocean apart, with entirely different money. Both lost it the moment somebody found a cheaper way to make another one.")}

      <h2><span class="sc-article-num">4</span>What a money actually needs</h2>

      <p>Pull those two failures apart and a checklist falls out. It is roughly the same list everyone who has written seriously on the subject arrives at, and it has been stable for a very long time.</p>

      <div class="sc-guide-data-panel sc-money-panel">
        <div class="sc-guide-data-heading">
          <span class="sc-guide-data-mark">$</span>
          <div><span>Monetary properties</span><h3>Six tests across five monies</h3></div>
          <strong>Strength is multidimensional</strong>
        </div>
        <div class="sc-money-matrix" role="table" aria-label="The six properties and how historical monies scored">
          <div class="sc-money-head" role="row"><span>Property</span><span>Rai stones</span><span>Glass beads</span><span>Gold</span><span>Fiat</span><span>Bitcoin</span></div>
          <div class="sc-money-row" role="row"><strong>Durable<small>survives time</small></strong><span class="is-strong" data-label="Rai stones">Excellent</span><span class="is-mid" data-label="Glass beads">Good</span><span class="is-strong" data-label="Gold">Excellent</span><span class="is-mid" data-label="Fiat">Fair</span><span class="is-strong is-bitcoin" data-label="Bitcoin">Excellent</span></div>
          <div class="sc-money-row" role="row"><strong>Portable<small>moves easily</small></strong><span class="is-weak" data-label="Rai stones">Very poor</span><span class="is-mid" data-label="Glass beads">Good</span><span class="is-weak" data-label="Gold">Poor in bulk</span><span class="is-mid" data-label="Fiat">Good</span><span class="is-strong is-bitcoin" data-label="Bitcoin">Excellent</span></div>
          <div class="sc-money-row" role="row"><strong>Divisible<small>pays small sums</small></strong><span class="is-weak" data-label="Rai stones">No</span><span class="is-strong" data-label="Glass beads">Yes</span><span class="is-mid" data-label="Gold">Awkward</span><span class="is-strong" data-label="Fiat">Yes</span><span class="is-strong is-bitcoin" data-label="Bitcoin">8 decimals</span></div>
          <div class="sc-money-row" role="row"><strong>Fungible<small>units are alike</small></strong><span class="is-weak" data-label="Rai stones">No</span><span class="is-mid" data-label="Glass beads">Roughly</span><span class="is-strong" data-label="Gold">Yes</span><span class="is-strong" data-label="Fiat">Yes</span><span class="is-mid is-bitcoin" data-label="Bitcoin">Mostly</span></div>
          <div class="sc-money-row" role="row"><strong>Verifiable<small>you can check it</small></strong><span class="is-mid" data-label="Rai stones">By memory</span><span class="is-weak" data-label="Glass beads">Poor</span><span class="is-mid" data-label="Gold">Needs assay</span><span class="is-mid" data-label="Fiat">Fair</span><span class="is-strong is-bitcoin" data-label="Bitcoin">Any node</span></div>
          <div class="sc-money-row" role="row"><strong>Scarce<small>nobody can make more</small></strong><span class="is-weak" data-label="Rai stones">Failed</span><span class="is-weak" data-label="Glass beads">Failed</span><span class="is-strong" data-label="Gold">Strong</span><span class="is-weak" data-label="Fiat">None</span><span class="is-strong is-bitcoin" data-label="Bitcoin">Fixed</span></div>
        </div>
      </div>

      <p>The bottom row is where the two case studies landed, and they landed there for the same reason &mdash; iron tools for rai, industrial glass for beads. Gold reads "strong" rather than absolute because a higher price still funds deeper mines. Fiat has no constraint of that kind at all, only institutional restraint, which is a different sort of promise.</p>

      <p>Bitcoin gets "mostly" on fungibility rather than "yes" because the ledger is public: coins carry a visible history, and that history can be read. <a href="chain-analysis-heuristics.html">How chain analysis reads your wallet</a> covers what is genuinely inferable and what it costs you.</p>

      <p>Five of those six are engineering problems, and most candidates do reasonably well at them. The sixth is a different kind of thing entirely. Durability, portability, divisibility, <a href="../glossary.html#term-fungibility">fungibility</a> and verifiability are properties of the object. <strong><a href="../glossary.html#term-scarcity">Scarcity</a> is a property of everyone else's incentives</strong> &mdash; and it is the only one on the list that has ever actually killed a money.</p>

      <h2><span class="sc-article-num">5</span>Sound money</h2>

      <p><a href="../glossary.html#term-sound_money">Sound money</a> is the name for a money that keeps hold of that sixth property under pressure. The short definition: a money whose supply cannot be expanded by whoever stands to gain from expanding it.</p>

      <p>The useful way to think about it is a ratio &mdash; how much already exists, set against how much can be produced in a year. High ratio, hard money. Low ratio, easy money.</p>

      ${checklist([
        "<strong>Gold has run hard for millennia.</strong> All the gold ever mined would fit inside a large house, and a year of global mining adds something like one and a half per cent to it. A gold rush does not double the supply; it strains the mines slightly.",
        "<strong>Silver ran softer</strong>, which is a large part of why the world drifted onto a <a href='../glossary.html#term-gold_standard'>gold standard</a> rather than a silver one. New deposits and better smelting moved the number too much.",
        "<strong>Beads and rai ran hard right up until the tooling changed.</strong> Neither had a fixed supply — they had an <em>expensive</em> supply. Expense is a fact about the current state of technology, and technology improves."
      ])}

      <p>That is the trap, and it has no exceptions worth the name. Anything valuable enough to be used as money eventually becomes valuable enough to manufacture, and the moment manufacturing it costs less than earning it, somebody will. Not through malice &mdash; through arithmetic. The reward is simply sitting there.</p>

      <p>Modern <a href="../glossary.html#term-fiat">fiat</a> currency removes the manufacturing step altogether. There is no ore, no glassworks, no voyage. Supply is a decision, and the constraint on it is institutional restraint rather than physics or cost. Restraint can hold for a long time and frequently has. It is simply a different kind of guarantee from an expensive one, and it is worth being clear about which kind you are relying on.</p>

      ${figure({
        src: "../assets/img/what-is-money-hyperinflation-notes.jpg",
        alt: "A fan of Zimbabwean hyperinflation banknotes on a dark slate surface, the top note reading one hundred trillion dollars",
        caption: "Every note here was legal tender. None of them failed a technical test.",
        width: 1300,
        height: 726
      })}

      <h2><span class="sc-article-num">6</span>Why a hard cap is the whole argument</h2>

      <p>Bitcoin's answer to the sixth property is not "difficult to produce". It is <a href="../glossary.html#term-hard_cap">a hard cap</a>: <a href="../glossary.html#term-21_million">21 million</a> units, no more, ever &mdash; regardless of price, demand, effort, or how much equipment anyone points at the problem.</p>

      <p>It is worth being precise about why that differs from gold rather than merely doing the same trick better.</p>

      ${checklist([
        "<strong>Gold's supply responds to price.</strong> A higher price funds deeper mines and poorer ore, so more gets produced. The response is slow and weak, which is exactly why gold held the role for so long — but the feedback loop is there.",
        "<strong>Bitcoin's supply responds to nothing.</strong> Doubling the world's mining hardware overnight produces no extra coins: the <a href='../glossary.html#term-difficulty_adjustment'>difficulty adjustment</a> makes the puzzle harder and issuance carries on to schedule. Effort decides who receives new coins, never how many exist.",
        "<strong>The cap is not a target somebody set.</strong> Issuance <a href='../glossary.html#term-halving'>halves</a> roughly every four years, and 21 million is what that series adds up to — the derivation is in <a href='twenty-one-million.html'>the 21 million hard cap</a>."
      ])}

      <p>Now the part that reaches you personally. <a href="../glossary.html#term-inflation">Inflation</a> is usually described as prices going up, which makes it sound like something that happens to shops. The more useful framing is dilution: your holding stays the same size while the total grows, so your share of it shrinks. Rising prices are the symptom you happen to notice.</p>

      <p>Two consequences follow, and the second is the one that gets missed.</p>

      ${checklist([
        "<strong>Saving stops being a neutral act.</strong> In a diluting money, holding cash is a slow loss, so saving has to be done in something else — property, equities, whatever is currently rising. That is a real cost, and it falls hardest on the people with least access to those markets.",
        "<strong>New money does not arrive everywhere at once.</strong> It enters at particular points and spreads outward. Whoever receives it early spends it at yesterday's prices; whoever receives it last spends it at today's. Nobody signs for that transfer, and it only runs one way."
      ])}

      <p>A hard cap does not fix an economy, and pretending otherwise is where a great deal of bitcoin writing goes off the rails. What it does is narrower and, if it holds, significant: <strong>it removes dilution as an option.</strong> Your share of the total changes when you buy more or sell some, and not otherwise. Nobody else can move it.</p>

      <p>And "if it holds" is the entire question, because a supply limit written down is worth nothing &mdash; every currency that ever inflated had rules against it. Bitcoin's cap is not a promise anybody made. It is an arithmetic check performed independently by every <a href="../glossary.html#term-full_node">full node</a> on every block, and a block claiming more than the schedule allows is discarded rather than debated. That distinction is the only reason the number carries any weight, and it is why <a href="why-run-a-node.html">running a node</a> is a live question rather than a hobby.</p>

      ${callout("The cap is a check, not a clause", "Nobody can raise the limit by agreement, because there is no forum in which such an agreement would bind anyone. Changing it means persuading every node operator to run software that accepts larger rewards — and the last time hashpower tried to force a rule change through, it lost. <a href='who-decides-the-rules.html'>Who decides the rules</a> is the story of how that actually plays out.")}

      <h2><span class="sc-article-num">7</span>The objections worth taking seriously</h2>

      <p>Sound money is an argument, not a settled fact, and an honest version of this page includes the case against.</p>

      ${cautions([
        "<strong>A money that appreciates may discourage spending.</strong> If your units buy more next year, the argument runs, purchases get deferred and demand stalls. The counter is that people bought computers and phones for decades while prices fell, and that <a href='../glossary.html#term-low_time_preference'>deferring consumption</a> is not self-evidently a defect. Both sides have a point; neither has a clean proof.",
        "<strong>Debt behaves badly under deflation.</strong> Loans get repaid in units worth more than the ones borrowed, which is hard on borrowers and on any economy built around credit. That is a genuine structural problem, and a hard cap does not answer it.",
        "<strong>Bitcoin is not yet a unit of account.</strong> Almost nobody quotes prices in it, because it moves too much. It has a strong claim as a <a href='../glossary.html#term-store_of_value'>store of value</a> and a workable one as a medium of exchange, and by its own three-part test it is currently short of the third job.",
        "<strong>Nobody knows how mining gets paid for afterwards.</strong> The block subsidy halves toward nothing and fees must eventually carry the whole security budget. Whether that transition is comfortable is genuinely open, and anyone certain in either direction is overselling.",
        "<strong>The cap is enforced, not guaranteed.</strong> It holds because people run software that rejects violations. That is a far stronger arrangement than a promise, but it is a social fact rather than a law of nature, and it depends on enough people continuing to check."
      ])}

      <h2>The short version</h2>

      <p>Money is three jobs rather than a thing: a medium of exchange, a store of value, and a unit of account. A remarkable range of objects have done all three, glass beads and multi-tonne limestone discs among them, and the ones that stopped almost always stopped the same way &mdash; somebody found a cheaper method of producing more. Sound money is the name for resisting that. A hard cap is the strongest form of the idea available, because it swaps "expensive to produce" for "impossible to produce", and it holds not because anyone promised it but because every node checks every block.</p>

      ${callout("If you take one thing from this page", "Every money in this article was scarce until the cost of making another one fell. That is the failure mode, it is the only one that has ever really mattered, and a fixed cap is the first serious attempt to make it structurally impossible rather than merely expensive. Which is also why the cap is only yours if you <a href='owning-your-bitcoin.html'>hold your own keys</a> — a balance somebody else controls is a promise again, whatever it happens to be denominated in.")}`
  },
  {
    slug: "duress-and-coercion",
    category: "advanced",
    products: [],
    title: "Planning for coercion",
    summary: "The attack that ignores your cryptography and comes for you instead. Why decoy wallets are weaker than they sound, why being genuinely unable to comply beats lying convincingly, and the arrangements that make a bad situation worse.",
    level: "advanced",
    minutes: 30,
    goals: ["harden", "inherit"],
    tags: ["Threat model", "Duress"],
    icon: "bi-shield-exclamation",
    updated: "2026-08-18",
    status: "published",
    related: ["coldcard-advanced-features", "multisig-key-geography", "passphrase-setup"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Every other guide on this site makes the mathematics harder. Longer keys, more signers, better entropy, verified firmware. All of it assumes an attacker who has to get past the cryptography.</p>

      <p>There is a well-known cartoon about this. Security people imagine an adversary building enormous machines to crack a key, when the realistic approach is to hit the owner with a cheap wrench until they hand it over. That image gave the whole problem its name: the <strong><a href='../glossary.html#term-wrench_attack'>five-dollar wrench attack</a></strong> &mdash; the attack that does not engage with your security at all, and instead engages with you.</p>

      <p>No amount of key length helps here. What follows is an honest account of what does, what merely sounds like it does, and which popular measures can make a dangerous situation last longer.</p>

      ${callout("Before anything else", "If this ever happens to you, your safety is worth more than every coin you own. Bitcoin is replaceable and you are not. Nothing on this page is advice to resist, delay, or refuse someone who is threatening you — the entire purpose of planning in advance is so that you never have to make that choice while frightened.")}

      <h2><span class="sc-article-num">1</span>Be proportionate about this</h2>

      <p>This threat is real and it is also rare, and writing about it tends to make it feel imminent. It is worth placing accurately before redesigning your life around it.</p>

      ${checklist([
        "<strong>The attack requires a belief.</strong> Somebody has to think you hold enough bitcoin to be worth the risk of a violent crime. That belief comes from somewhere, and it is nearly always something that was said.",
        "<strong>It is concentrated among the visible.</strong> People who discuss holdings publicly, appear in media, work in the industry, or mention it socially are in a different position from people who have told nobody.",
        "<strong>The realistic threat for most people is remote:</strong> phishing, fake support, malware, and address-substitution &mdash; not physical confrontation.",
        "<strong>Household risk is worth naming.</strong> For some people the plausible coercion is domestic rather than a stranger, and that changes which measures make sense."
      ])}

      <h2><span class="sc-article-num">2</span>The most effective defence is not technical</h2>

      <p>Because the attack depends on someone believing you are worth targeting, the highest-value measure available is not a device feature. It is discretion, and it costs nothing.</p>

      ${checklist([
        "<strong>Do not discuss what you hold.</strong> Not amounts, not roughly, not as a joke, not to family who will repeat it warmly and harmlessly to somebody else.",
        "<strong>Do not signal it indirectly</strong> &mdash; conference lanyards, stickers, clothing, and forum handles attached to your real name all describe you to strangers.",
        "<strong>Keep addresses away from your identity.</strong> A public address next to your name lets anybody read your balance forever. <a href='bitcoin-privacy.html'>The privacy guide</a> covers why that link is hard to undo.",
        "<strong>Have deliveries sent somewhere sensible.</strong> A branded hardware wallet box arriving at your home tells the delivery chain, and anyone watching your porch, what you now own.",
        "<strong>Accept that some people must know.</strong> Your <a href='inheritance-plan.html'>inheritance plan</a> requires it. Keep that number small and chosen rather than accumulated."
      ])}

      <p>None of this is glamorous, and all of it outperforms every clever feature below.</p>

      <h2><span class="sc-article-num">3</span>Decoy wallets, honestly</h2>

      <p>The popular answer is a decoy: a wallet holding a modest amount that you surrender while the real one stays hidden, usually behind a passphrase or a device's alternate PIN.</p>

      <p><a href='passphrase-setup.html'>The passphrase guide</a> makes the core objection &mdash; it is a delay rather than a shield, because it depends on the attacker believing you and stopping. Three further problems are worth stating plainly before you rely on one.</p>

      ${cautions([
        "<strong>You have to perform, under the worst conditions of your life.</strong> A decoy is a lie that must be told convincingly to a violent person while terrified. Most planning quietly assumes a calm, competent version of you that will not be there.",
        "<strong>The amount is an unsolvable dilemma.</strong> Too little and it is transparently a decoy. Enough to be believed is enough that losing it genuinely hurts.",
        "<strong>Being disbelieved makes things worse.</strong> If they think you are holding back, the encounter continues &mdash; and you have spent your one deception and have nothing left to offer.",
        "<strong>Sophisticated attackers know the technique exists.</strong> Passphrases and duress PINs are not secrets; anyone who researched enough to target you has read the same pages you have."
      ])}

      <p>Decoys are not worthless. They are a reasonable hedge against an opportunistic thief who wants a quick result. They are a poor foundation against anyone patient or informed.</p>

      <h2><span class="sc-article-num">4</span>The principle that actually helps</h2>

      <p>Here is the shift that reframes the whole subject.</p>

      ${pullQuote("A truth you can state calmly is worth more than a lie you have to sell. Do not aim to deceive — aim to be genuinely unable to comply.")}

      <p>A decoy requires acting. An arrangement that makes immediate transfer <em>impossible</em> requires only that you explain it, and the explanation is verifiable, consistent, and does not collapse under pressure &mdash; because it is true.</p>

      ${checklist([
        "<strong>Time delays.</strong> A wallet with a mandatory waiting period cannot be emptied now by anyone, including you. The <a href='coldcard-advanced-features.html'>COLDCARD login countdown</a> does this at the device level; some products build a notice period into recovery itself.",
        "<strong>Timelocked spending paths.</strong> Bitcoin can enforce that certain coins simply are not spendable until a future date. That is a fact about the chain, not a claim about your wallet &mdash; see <a href='scripts-and-miniscript.html'>scripts and Miniscript</a>.",
        "<strong>Keys you cannot reach.</strong> A multisig whose second key is in another city, another country, or another person's hands cannot be assembled in an evening. <a href='multisig-key-geography.html'>Key geography</a> is the design work behind this.",
        "<strong>Keys other people must approve.</strong> A collaborative custody arrangement means a third party has to participate, on their schedule, through their process."
      ])}

      <p>Each of these converts &ldquo;transfer it now&rdquo; into a request that cannot be satisfied at speed by anybody. That is a materially different position from hoping to be believed.</p>

      <h2><span class="sc-article-num">5</span>The danger of over-engineering</h2>

      <p>This is where an honest guide has to complicate its own advice, because the measures in the previous section carry a real risk that enthusiasts rarely mention.</p>

      <p><strong>An attacker who cannot get what they want may not simply leave.</strong> A situation that could have ended in minutes with a transfer can instead continue while you explain a delay mechanism to somebody unwilling to hear it. Making yourself unable to comply is protective for your coins and is not automatically protective for you.</p>

      ${cautions([
        "<strong>Keep something available to give.</strong> A hot wallet with a realistic everyday balance is not a weakness; it is a way for an encounter to end.",
        "<strong>Never build an arrangement you cannot explain simply.</strong> If you cannot describe the delay in one sentence a stranger will accept, it will not help you in the moment.",
        "<strong>Do not rely on features you have not tested.</strong> A trick PIN you configured once and never rehearsed is not something you will use correctly under threat.",
        "<strong>Avoid measures that destroy.</strong> A wipe or brick triggered during a confrontation removes the attacker's incentive to stop without giving them anything &mdash; consider carefully whether that is the situation you want to create."
      ])}

      <h2><span class="sc-article-num">6</span>Matching the measure to the risk</h2>

      <div class="sc-guide-data-panel sc-duress-panel">
        <div class="sc-guide-data-heading">
          <span class="sc-guide-data-mark">!</span>
          <div><span>Match measure to threat</span><h3>Protection rises with personal cost</h3></div>
          <strong>Begin with discretion</strong>
        </div>
        <div class="sc-duress-ladder">
          <article class="is-green"><span class="sc-duress-rank">01</span><h3>Discretion about holdings</h3><p><span>Helps against</span>Being selected at all</p><p><span>Cost to you</span>None. Do this first.</p></article>
          <article class="is-cream"><span class="sc-duress-rank">02</span><h3>A funded everyday hot wallet</h3><p><span>Helps against</span>Opportunistic demands</p><p><span>Cost to you</span>The balance, occasionally</p></article>
          <article class="is-orange"><span class="sc-duress-rank">03</span><h3>Decoy wallet or duress PIN</h3><p><span>Helps against</span>An attacker who accepts it</p><p><span>Cost to you</span>A performance, and a real balance</p></article>
          <article class="is-orange"><span class="sc-duress-rank">04</span><h3>Login countdown or delay</h3><p><span>Helps against</span>Immediate transfer, credibly</p><p><span>Cost to you</span>Your own access is delayed too</p></article>
          <article class="is-red"><span class="sc-duress-rank">05</span><h3>Geographic multisig</h3><p><span>Helps against</span>Anything demanding speed</p><p><span>Cost to you</span>Complexity, travel, rehearsal</p></article>
          <article class="is-red"><span class="sc-duress-rank">06</span><h3>Timelocked coins</h3><p><span>Helps against</span>Any demand before the date</p><p><span>Cost to you</span>Technical skill; funds genuinely locked</p></article>
        </div>
      </div>

      <p>Read that top row as the recommendation. Almost everybody should do the first two and stop, and the remainder is for people with a specific, identified reason.</p>

      <h2><span class="sc-article-num">7</span>If it happens</h2>

      ${checklist([
        "<strong>Comply with what you can.</strong> Give up the hot wallet, the phone, the device. None of it is worth injury.",
        "<strong>Do not improvise a deception</strong> you have not rehearsed. Being caught in one mid-encounter is worse than never attempting it.",
        "<strong>Get to safety first, then act.</strong> Once you are safe, move whatever remains to a new wallet with new keys, because anything they saw must be treated as compromised.",
        "<strong>Report it.</strong> Bitcoin's finality means recovery is unlikely, but coercion is a serious crime and patterns of these offences matter beyond your own case.",
        "<strong>Rebuild differently.</strong> Whoever did this knew something. Work out what, and change it."
      ])}

      <h2>The short version</h2>

      <p>The five-dollar wrench attack bypasses your cryptography entirely, so cryptographic answers do not apply. It depends on someone believing you are worth targeting, which makes discretion the highest-value defence by a wide margin. Decoys ask you to act convincingly while terrified; delays and distributed keys let you tell the truth instead. And keep something available to hand over, because an encounter that can end quickly should.</p>

      ${callout("If you take one thing from this page", `Not being identified as a holder protects you from every attack on this page at once, and costs nothing but silence. Every technical measure here is a distant second — and the ones that make you unable to comply protect your coins, which is not the same thing as protecting you.`)}`
  },

  {
    slug: "supply-chain-and-vendor-risk",
    category: "advanced",
    products: [],
    title: "Supply chain, long cons, and the vendor you cannot avoid trusting",
    summary: "You cannot read the silicon, and you did not watch the parcel. Three different problems hide under one heading &mdash; the intercepted package, the patient maintainer, and the vendor who simply changes &mdash; and only one defence survives all three.",
    level: "intermediate",
    minutes: 18,
    goals: ["learn", "harden"],
    tags: ["Threat model", "Open source", "Reproducible firmware"],
    icon: "bi-box-seam",
    updated: "2026-08-27",
    status: "published",
    related: ["choosing-your-first-setup", "multisig-2of3", "duress-and-coercion"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">At some point in every self-custody setup there is a thing you did not make and cannot inspect. A chip whose contents you take on faith. Firmware you did not compile. A parcel that spent four days out of your sight. You can push that boundary back a long way, and this guide is about how far &mdash; but the honest starting point is that it never reaches zero.</p>

      <p>Three quite different problems get filed under "supply chain", and they call for different answers. Confusing them is how people end up buying tamper-evident stickers and calling it a threat model.</p>

      <h2><span class="sc-article-num">1</span>Three problems wearing one name</h2>

      <ul>
        <li><strong>Interception.</strong> Someone touched the device between the factory and your hands &mdash; a swapped unit, a counterfeit, a pre-loaded recovery sheet. An outsider, acting once, against one parcel.</li>
        <li><strong>The long con.</strong> Nobody intercepted anything, because the person you needed to worry about was inside from the beginning. They spent years being genuinely useful, and then spent the trust.</li>
        <li><strong>Plain vendor risk.</strong> No attacker at all. A company folds, a product line is dropped, a design trade-off you never knew you accepted turns out to matter. Most of what actually goes wrong lives here.</li>
      </ul>

      ${pullQuote("A tamper seal answers the first problem, weakly. It has nothing to say about the other two.")}

      <h2><span class="sc-article-num">2</span>The parcel</h2>

      <p>Holographic seals and shrink wrap are worth something, but much less than their theatre suggests: they are manufactured goods like anything else, and an attacker who can source a device can usually source the packaging. Treat an intact seal as mildly reassuring and a broken one as disqualifying, and do not build anything on top of that.</p>

      <p>The defence that actually works is procedural, and it is short: <strong>never accept a secret the device did not make while you were watching.</strong> The counterfeit that has taken the most money is not a sophisticated implant &mdash; it is a device shipped with a recovery sheet already filled in, and a card in the box explaining that this is your wallet. It is not. It is the attacker&rsquo;s wallet, and everything you send to it is a gift.</p>

      ${cautions([
        "A device that arrives with words already written on the recovery card is compromised. There is no benign version of this.",
        "Being asked to re-type words the device has just shown you is the normal backup check, and both COLDCARD and Trezor document it. The danger is a phrase that existed before you initialised the device &mdash; printed on a card, already loaded when it arrived, or read out to you by someone claiming to be support.",
        "Anyone who contacts you claiming your device needs its phrase re-entered for a firmware issue is running the same scam without the hardware."
      ])}

      <p>Beyond that: buy direct from the manufacturer rather than a marketplace where the listing and the fulfilment are different companies, initialise the device yourself, check the firmware version and its signature against the vendor&rsquo;s published value, and generate a fresh wallet before anything of value goes near it. Counterfeit units convincing enough to fool a casual look have been found in the wild, with the real microcontroller replaced &mdash; which is exactly why the check that matters is behavioural rather than visual.</p>

      <h2><span class="sc-article-num">3</span>The long con</h2>

      <p>This is the hard one, and it is not hypothetical.</p>

      <p>In March 2024 an engineer investigating why ssh logins on a test machine had become about half a second slower found a backdoor inside <strong>xz</strong>, a compression library that ships in nearly every Linux distribution. It had been introduced by an account that had been contributing to the project for roughly two years &mdash; fixing real bugs, doing real work, eventually becoming a co-maintainer and gaining the right to cut releases. The malicious code was not in the source anyone reads; it was assembled from files that looked like test fixtures. It was found by accident, by someone chasing a performance oddity that had nothing to do with security.</p>

      <p>Bitcoin has its own version. In 2018 the maintainer of a widely used JavaScript library, tired of supporting it for free, handed it to a volunteer who had been helpfully contributing for some time. The volunteer added a new dependency, and that dependency carried a payload aimed specifically at the build of a particular bitcoin wallet, targeting users&rsquo; keys. It reached an enormous number of machines before anyone noticed, because everything about the handover looked exactly like the open-source maintenance everyone wants more of.</p>

      <p>Notice what defeats every heuristic you would normally reach for. A long commit history, real contributions, an established name, code in front of everyone &mdash; those are not evidence against this attack, they are the attack&rsquo;s method. Reputation is accrued in public precisely so it can be spent once.</p>

      <h2><span class="sc-article-num">4</span>What reproducible builds prove</h2>

      <p>A reproducible build means anyone can compile the published source and get a binary identical to the one the vendor shipped, byte for byte. That is a real and valuable property, and a device whose firmware is reproducible is meaningfully better than one whose is not.</p>

      <p>Be precise about what it rules out, though. Reproducibility proves the binary matches the source. It says <em>nothing</em> about whether the source is honest. The xz backdoor was in the project&rsquo;s own repository, put there by someone entitled to put things there &mdash; a reproducible build would have faithfully reproduced it.</p>

      ${callout("The distinction worth holding", `Reproducible builds defeat a compromised build server and a tampered download. They do not defeat a malicious maintainer, because that attacker does not need to change the binary &mdash; they change the source, in public, and let you compile it yourself.`)}

      <h2><span class="sc-article-num">5</span>Signatures, and where the chain ends</h2>

      <p>Verifying a release signature before you flash it defeats a substituted download: a file altered in transit or on a mirror will not verify against the vendor&rsquo;s key. Do it. Most vendors document the exact command, and the ones that do not are telling you something.</p>

      <p>But follow the chain to its end and you arrive at a key you got from somewhere, most likely the same website that served the firmware. The usual answers help without closing it: fetch the key over a different network, check it against a copy published somewhere the vendor does not control, and note that a key you have been verifying against for three years is a better bet than one you fetched five minutes ago. A signature proves the vendor signed it. It cannot prove the vendor should have.</p>

      <h2><span class="sc-article-num">6</span>The one answer that survives a dishonest vendor</h2>

      <p>Every defence above assumes the vendor is honest and asks whether someone else interfered. Only one common arrangement drops that assumption: <strong>multisig across different manufacturers</strong>.</p>

      <p>In a 2-of-3 where the three keys live on devices from three vendors, running three independent firmware codebases, a single compromised device cannot move funds. It cannot even do it quietly &mdash; it needs a second signature from a device that shares none of its code. That is a structural answer rather than a procedural one, which is why it is the only thing on this page that keeps working when the vendor themselves is the problem.</p>

      <p>It is not free, and the costs are the familiar ones: three devices to buy, three backups to store and test, a descriptor to keep alongside them, and considerably more ways to lock yourself out by accident. A 2-of-3 protects you from one dishonest vendor and from one lost key. It also gives you three chances to lose the plot.</p>

      <p class="mt-4"><a class="sc-text-link" href="multisig-2of3.html">How a 2-of-3 multisig actually works <i class="bi bi-arrow-right"></i></a></p>

      <h2><span class="sc-article-num">7</span>Trade-offs you are choosing whether you notice or not</h2>

      <ul>
        <li><strong>Secure element or open silicon.</strong> A secure element resists someone who has your device on a bench, which is a real and common threat. It is also, by construction, a chip you cannot audit. Fully open designs invert both halves of that.</li>
        <li><strong>Closed or open firmware.</strong> Open firmware can be read and, at its best, reproduced. Closed firmware cannot, and you are trusting a process you can only see the outputs of. Neither answers the malicious-maintainer case on its own.</li>
        <li><strong>Standards or convenience.</strong> A device that stores a standard BIP39 phrase on a standard derivation path can be recovered on completely different hardware years from now. Anything proprietary makes the vendor&rsquo;s continued existence part of your backup plan.</li>
        <li><strong>How much the vendor knows about you.</strong> Customer databases leak; one hardware wallet company&rsquo;s did, and its customers received phishing and physical threats for years afterwards. Where a device is bought, and under what name, is part of this decision.</li>
      </ul>

      <p class="mt-4"><a class="sc-text-link" href="duress-and-coercion.html">Why being identified as a holder is its own risk <i class="bi bi-arrow-right"></i></a></p>

      <h2><span class="sc-article-num">8</span>What to actually do</h2>

      ${checklist([
        "Buy direct from the manufacturer, and prefer vendors who publish reproducible builds and signed releases.",
        "Initialise every device yourself. Never accept a pre-filled recovery sheet, and never re-enter an existing phrase because someone asked you to.",
        "Verify firmware signatures before flashing, and keep the vendor key you have been checking against rather than re-fetching it each time.",
        "Confirm receive addresses on the device&rsquo;s own screen, not on the computer driving it.",
        "Prefer standard BIP39 and standard derivation paths, so recovery never depends on one company still existing.",
        "For amounts that would genuinely hurt to lose, spread the trust across vendors with multisig rather than deepening it with one."
      ])}

      <h2>The short version</h2>

      <p>The parcel problem is real but tractable: buy direct, initialise it yourself, and never accept a secret you did not watch being made. The vendor-risk problem is mostly solved by standards, so that no company&rsquo;s survival is load-bearing. The long con is the one with no procedural fix, because it defeats reputation, code review and reproducible builds alike &mdash; and the only answer to it is not to let any single vendor be sufficient.</p>

      ${callout("If you take one thing from this page", `Every check here except one assumes the vendor is honest and asks whether somebody else interfered. Multisig across manufacturers is the only arrangement that keeps working if that assumption is wrong &mdash; which is the assumption a long con is built to exploit.`)}

      <p class="sc-source-note">
        The 2024 xz backdoor is documented as CVE-2024-3094; the 2018 npm incident is documented in the
        ${official("https://github.com/dominictarr/event-stream/issues/116", "event-stream maintainers&rsquo; own thread")}.
        Device-specific verification steps come from each vendor&rsquo;s published documentation.
      </p>`
  },

  /* ----------------------------------------------------------------- concepts */
  {
    slug: "double-spend-problem",
    category: "concepts",
    products: [],
    title: "The problem Bitcoin solved",
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

      <aside class="sc-tool-shortcut">
        <span class="sc-shortcut-mark" aria-hidden="true"><i class="bi bi-box-seam"></i></span>
        <div>
          <strong>Watch one land, without waiting for one</strong>
          <p>Blocks arrive about every ten minutes, which is a long time to sit looking at a page for the sake of an animation. The <a href="../block-demo.html">block confirmation simulator</a> fires one on demand so you can watch the pending block become the confirmed one and the rest of the strip shuffle down. The block it fires is invented and clearly marked as such &mdash; the prices, fees and network figures around it are the real live ones.</p>
        </div>
      </aside>

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
        "<strong>84'</strong> &mdash; the purpose, which in practice means the address type. 44' is legacy, 49' is wrapped SegWit, 84' is native SegWit, 86' is Taproot.",
        "<strong>0'</strong> &mdash; the coin. Zero is bitcoin.",
        "<strong>0'</strong> &mdash; the account number, so one seed can hold several separately-tracked wallets.",
        "<strong>0</strong> &mdash; the branch: 0 for addresses you hand out, 1 for change coming back to you.",
        "<strong>0</strong> &mdash; the index, counting up as you generate address after address."
      ])}

      <p>Change any one of those numbers and you land somewhere else entirely &mdash; a valid, empty wallet with no relationship to the one you were looking for. This is the same silent-failure shape as a mistyped <a href='passphrase-setup.html'>passphrase</a>: nothing errors, because nothing is wrong. You simply asked a different question and got its correct answer.</p>

      ${callout("Why the address-type number matters most", "The purpose field is the one that bites people, because different wallets default to different values. A wallet that defaults to 84' restoring a seed created by a wallet defaulting to 44' will show nothing at all — the coins are sitting on the 44' branch, untouched, perfectly safe, and completely invisible until someone tells the software to look there.")}

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
        "<strong>Check the address type.</strong> Try the other purpose values — 44', 49', 84', 86'. Good software offers this as a dropdown during import.",
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

      <div class="sc-guide-data-panel sc-address-panel">
        <div class="sc-guide-data-heading">
          <span class="sc-guide-data-mark">bc1</span>
          <div><span>Address evolution</span><h3>Four generations, all still valid</h3></div>
          <strong>2009 &rarr; 2021</strong>
        </div>
        <div class="sc-address-timeline">
          <article class="is-red"><div><strong>1</strong><span>2009</span></div><h3>Legacy <small>P2PKH</small></h3><p>Universally accepted, and the most expensive to spend.</p></article>
          <article class="is-cream"><div><strong>3</strong><span>2012</span></div><h3>Script hash <small>P2SH</small></h3><p>Multisig, and SegWit wrapped for compatibility.</p></article>
          <article class="is-orange"><div><strong>bc1q</strong><span>2017</span></div><h3>SegWit <small>bech32</small></h3><p>The common default. Cheaper to spend and error-detecting.</p></article>
          <article class="is-green"><div><strong>bc1p</strong><span>2021</span></div><h3>Taproot <small>bech32m</small></h3><p>Cheapest for simple spends, and hides complex conditions.</p></article>
        </div>
      </div>

      <p>A wallet that hands you a bc1q address is not a different kind of wallet from one handing you a 1 address. Very often it is the same seed, on the same device, walking a different branch of the same tree &mdash; which is precisely the mechanism described in <a href='how-wallets-find-coins.html'>how a wallet finds your coins</a>.</p>

      <h2><span class="sc-article-num">2</span>Why anyone bothered changing</h2>

      <p>Each format solved a real problem rather than being a redesign for its own sake.</p>

      <h3>P2SH, and paying to a condition</h3>

      <p>Originally, an address committed to a single public key. That made anything more sophisticated &mdash; multisig especially &mdash; awkward, because the sender had to be handed the whole complicated condition and pay for its size. P2SH inverted it: the address commits to a <em>hash</em> of the conditions, the sender pays for a short address regardless of complexity, and the spender reveals the full detail later. Addresses starting with 3 are the result, and it is why receiving into a multisig looks no different from any other payment.</p>

      <h3>SegWit, and moving the signatures</h3>

      <p>SegWit restructured transactions so signature data sits in a separate section, discounted when a block's size is measured. Two consequences follow: spending a SegWit output costs meaningfully less in fees, and transaction IDs stopped being malleable &mdash; a fix that Lightning depends on. Native SegWit uses bech32 encoding, which is why bc1q addresses are lowercase and slightly longer, and why they carry a <a href="../glossary.html#term-checksum">checksum</a> strong enough to catch typos rather than merely usually catching them.</p>

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
    related: ["stuck-transaction", "life-of-a-transaction", "sparrow-coin-control", "address-types"],
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
    title: "The 21 million hard cap",
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

      <div class="sc-guide-data-panel sc-halving-panel">
        <div class="sc-guide-data-heading">
          <span class="sc-guide-data-mark">&frac12;</span>
          <div><span>Issuance schedule</span><h3>The reward staircase toward zero</h3></div>
          <strong>Every 210,000 blocks</strong>
        </div>
        <div class="sc-halving-chart" role="img" aria-label="Bitcoin block reward halves in each four-year era">
          <article style="--halving-scale:1"><span>2009&ndash;2012</span><div><i></i><strong>50 BTC</strong></div><p><small>Created</small>10,500,000</p></article>
          <article style="--halving-scale:.5"><span>2012&ndash;2016</span><div><i></i><strong>25 BTC</strong></div><p><small>Created</small>5,250,000</p></article>
          <article style="--halving-scale:.25"><span>2016&ndash;2020</span><div><i></i><strong>12.5 BTC</strong></div><p><small>Created</small>2,625,000</p></article>
          <article style="--halving-scale:.125"><span>2020&ndash;2024</span><div><i></i><strong>6.25 BTC</strong></div><p><small>Created</small>1,312,500</p></article>
          <article style="--halving-scale:.0625"><span>2024&ndash;2028</span><div><i></i><strong>3.125 BTC</strong></div><p><small>Created</small>656,250</p></article>
          <article class="is-future"><span>&hellip;and so on</span><div><i></i><strong>Halving each era</strong></div><p><small>Created</small>Halving each era</p></article>
        </div>
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
    goals: ["learn", "harden", "privacy"],
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
    goals: ["learn", "harden", "privacy"],
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
  /* Rescoped from "Coin control and on-chain privacy", which duplicated
     sparrow-coin-control almost exactly -- that guide already covers linking,
     labelling, input selection, and consolidation. What was genuinely missing
     was the analyst's side: the heuristics past the obvious two, and the
     protocol-level defences (payjoin, silent payments) that are not coin
     control at all. Sits in concepts beside bitcoin-privacy, which it extends. */
  {
    slug: "chain-analysis-heuristics",
    category: "concepts",
    products: [],
    title: "How chain analysis reads your wallet",
    summary: "Everyone knows spending two coins together links them. That is one of about eight inferences an analyst makes, and your wallet software has an accent that identifies it. Plus the two defences that work at the protocol level rather than the habit level.",
    level: "advanced",
    minutes: 35,
    goals: ["learn", "harden", "privacy"],
    tags: ["Privacy", "UTXO"],
    icon: "bi-pie-chart",
    updated: "2026-08-18",
    status: "published",
    related: ["bitcoin-privacy", "sparrow-coin-control", "wasabi-coinjoin-basics"],
    layout: "article",
    body: `
      <p class="sc-guide-intro">Chain analysis is not surveillance in the usual sense. Nobody is watching you. It is a set of assumptions applied at scale to a public ledger, and each assumption is individually unremarkable &mdash; the kind of reasoning you would do yourself if handed the data.</p>

      <p>Most people who care about privacy know two of them. <a href='bitcoin-privacy.html'>The privacy guide</a> walks through both: coins spent together share an owner, and the round output is the payment while the awkward one is change. Those two do an enormous amount of work.</p>

      <p>They are not the whole toolkit. This page covers the rest &mdash; the change-detection tricks past the obvious one, the way your software signs its own name on every transaction, and the two newer defences that operate at the protocol level rather than relying on you to have good habits.</p>

      <h2><span class="sc-article-num">1</span>The two you have already met</h2>

      <p>Briefly, so the rest has somewhere to stand.</p>

      ${checklist([
        "<strong>Common-input-ownership.</strong> If a transaction spends several coins, one entity controlled all of them. This is the single strongest signal in the field, and it is right the overwhelming majority of the time.",
        "<strong>Change identification by roundness.</strong> Pay someone 0.05 BTC from a 0.31 BTC coin and the outputs are a round number and a remainder. Payments are round; change is whatever is left."
      ])}

      <p>An analyst who has identified your change can follow it into your next transaction, and the next, indefinitely. That is why change detection matters so much: it is what turns isolated transactions into a chain.</p>

      <h2><span class="sc-article-num">2</span>The other ways change gets spotted</h2>

      <p>Roundness is the famous one. When it does not apply, several others usually do.</p>

      ${checklist([
        "<strong>Script-type matching.</strong> If a transaction spends from a native SegWit address and produces one native SegWit output and one legacy output, the matching one is almost certainly change &mdash; your wallet makes change in its own format, while you pay whatever the recipient asked for.",
        "<strong>Address reuse.</strong> If one output goes to an address that has been seen before and the other is fresh, the fresh one is the change. Reused addresses are almost never change, because wallets generate a new one every time.",
        "<strong>The unnecessary input.</strong> If a transaction includes more inputs than the payment required, the surplus was needed to cover a larger output &mdash; which tells the analyst which output was the large one.",
        "<strong>The self-transfer shape.</strong> A single input producing a single output, or two outputs that both look like change, is usually somebody moving their own coins rather than paying anyone."
      ])}

      ${callout("Why several weak signals beat one strong one", "No single heuristic here is reliable alone, and analysts do not use them alone. They apply all of them, score the result, and act on the aggregate. A transaction that defeats one heuristic while satisfying three others has not been made private — it has been made slightly more interesting.")}

      <h2><span class="sc-article-num">3</span>Your wallet has an accent</h2>

      <p>This is the layer most people have never considered, and it requires nothing from you to leak.</p>

      <p>Bitcoin's rules leave several choices to whoever builds the transaction, and different wallet software makes those choices differently. The resulting pattern is consistent enough to identify which software produced a transaction &mdash; a technique usually called wallet fingerprinting.</p>

      ${checklist([
        "<strong>The locktime field.</strong> Some wallets set it to the current block height to discourage fee sniping; many leave it at zero. That choice alone splits the population.",
        "<strong>Transaction version number.</strong> Wallets differ, and they differ consistently.",
        "<strong>Input and output ordering.</strong> Some sort deterministically, some shuffle randomly, some preserve the order they built in.",
        "<strong>Replace-by-fee signalling.</strong> Whether the transaction is marked replaceable is a per-wallet default more than a per-user decision.",
        "<strong>Change output position.</strong> Always last, always first, or randomised &mdash; another consistent per-wallet habit."
      ])}

      <p>The consequence is subtle but real. If your wallet's fingerprint appears on both sides of a transaction &mdash; on the spending side and on one of the outputs &mdash; that output is probably yours. Fingerprinting is a change-detection heuristic wearing a different hat, and no amount of careful coin selection affects it.</p>

      <h2><span class="sc-article-num">4</span>Amounts and timing</h2>

      ${checklist([
        "<strong>Amount correlation.</strong> A withdrawal of an unusual amount leaving an exchange and an arrival of nearly that amount elsewhere, minus a plausible fee, is a link even with no shared inputs.",
        "<strong>Timing.</strong> Transactions that consistently appear during one part of the day describe a time zone, and eventually a routine.",
        "<strong>Fee-rate habits.</strong> Always paying the same wallet's default at the same urgency setting is one more consistent signature."
      ])}

      <h2><span class="sc-article-num">5</span>What coin control actually defeats</h2>

      <p>Now the practical question: which of these does careful spending address?</p>

      <div class="sc-guide-data-panel sc-heuristics-panel">
        <div class="sc-guide-data-heading">
          <span class="sc-guide-data-mark">CC</span>
          <div><span>Coin-control coverage</span><h3>What input choice can actually fix</h3></div>
          <strong>Two yes, two partly, three no</strong>
        </div>
        <div class="sc-heuristics-grid">
          <section class="is-yes"><h3><span>Yes</span> Directly helps</h3><article><strong>Common-input-ownership</strong><p>This is exactly what choosing inputs prevents.</p></article><article><strong>Address reuse</strong><p>Never reuse, and this one disappears.</p></article></section>
          <section class="is-partly"><h3><span>Partly</span> Reduces the signal</h3><article><strong>Change by roundness</strong><p>Spend a coin close to the payment amount.</p></article><article><strong>Unnecessary input</strong><p>Use fewer, better-sized inputs.</p></article></section>
          <section class="is-no"><h3><span>No</span> Needs another defence</h3><article><strong>Script-type matching</strong><p>A wallet setting, not a spending choice.</p></article><article><strong>Wallet fingerprinting</strong><p>Entirely outside your spending decisions.</p></article><article><strong>Amount and timing correlation</strong><p>Input choice does not remove it.</p></article></section>
        </div>
      </div>

      <p><a href='sparrow-coin-control.html'>Coin control</a> is genuinely the highest-value habit available, and this table is not an argument against it &mdash; it defeats the strongest heuristic in the field. But it is a habit-level defence, and several rows here are immune to habits. That is what the next two sections are for.</p>

      <h2><span class="sc-article-num">6</span>Payjoin: making the strongest assumption false</h2>

      <p>Every defence so far tries to avoid <em>triggering</em> common-input-ownership. Payjoin does something more interesting: it makes the assumption produce a wrong answer.</p>

      <p>In a payjoin, the person receiving the payment also contributes an input to it. The finished transaction spends coins belonging to two different people, so any analyst applying the strongest heuristic in the field concludes that one entity owned both &mdash; and is simply incorrect.</p>

      ${pullQuote("CoinJoin makes you one of many indistinguishable candidates. Payjoin lets an ordinary payment quietly poison the data instead.")}

      <p>It also breaks amount analysis, because the visible payment amount is no longer the amount that changed hands. And unlike a CoinJoin, a payjoin looks like a completely ordinary transaction &mdash; there is nothing conspicuous about having used one.</p>

      ${checklist([
        "<strong>The original design (BIP78)</strong> required the receiver to run a server and be online at the moment of payment, which restricted it in practice to merchants and enthusiasts.",
        "<strong>The newer variant (BIP77)</strong>, merged in 2025, removes that requirement by routing through an untrusted directory service, so the receiver no longer needs their own always-on infrastructure.",
        "<strong>Support is arriving but not universal.</strong> Bull Bitcoin &mdash; a Canadian exchange and wallet &mdash; and Cake Wallet are among those shipping the newer version.",
        "<strong>Both sides must support it.</strong> This is the honest limitation: a payjoin needs a willing counterparty, so its usefulness depends on adoption rather than on your own diligence."
      ])}

      <p>The wider benefit is worth noting. Every payjoin that occurs degrades the reliability of common-input-ownership for <em>everyone</em>, including people who never use it. It is one of the few privacy measures with a positive externality.</p>

      <h2><span class="sc-article-num">7</span>Silent payments: a reusable address that is not reuse</h2>

      <p>Address reuse is one of the clearest signals on the list, and there is a long-standing situation that forces it: publishing a donation address, putting one in a profile, or giving a static address to somebody who pays you regularly. You cannot hand out a fresh address every time if the point is to publish one.</p>

      <p>Silent payments (BIP352) resolve that. You publish one static address, and each sender derives a <em>unique, unlinkable</em> on-chain output from it. Every payment lands somewhere different, nothing on the chain connects them, and there is no address reuse to detect &mdash; while you only ever published one string.</p>

      ${checklist([
        "<strong>The cost is scanning.</strong> Your wallet must check incoming blocks to find payments meant for you, which is more work than watching a list of known addresses. This is the main reason adoption has been gradual.",
        "<strong>Support is uneven and growing.</strong> Through 2026 the underlying cryptography landed in the standard library, and wallets including Sparrow, Nunchuk, Cake Wallet, and Silentium have shipped varying degrees of support &mdash; receiving typically arriving before sending.",
        "<strong>It solves publication, not everything.</strong> Silent payments fix the static-address problem specifically. They do not affect common-input-ownership, change detection, or fingerprinting."
      ])}

      <h2><span class="sc-article-num">8</span>What none of this fixes</h2>

      ${cautions([
        "<strong>The past is permanent.</strong> Every link already published stays published. All of this changes your future only.",
        "<strong>Identity attaches off-chain.</strong> A verified exchange account ties your name to specific coins, and no on-chain technique reaches backwards through that.",
        "<strong>Your wallet's server sees your queries</strong> regardless of how the transactions look. That is a <a href='own-node-connection.html'>separate problem with a separate fix</a>.",
        "<strong>Amounts are always visible.</strong> Bitcoin's outputs are public values. Every technique here obscures ownership, not quantity."
      ])}

      <h2>The short version</h2>

      <p>Analysts combine roughly eight inferences, not one: shared inputs, several independent ways of spotting change, the fingerprint your wallet software leaves on every transaction, and correlations of amount and time. Coin control defeats the strongest of them and is worth doing for that reason alone, but several are immune to spending habits. Payjoin attacks the biggest heuristic directly by making it produce false answers, and silent payments remove the need to ever reuse a published address.</p>

      ${callout("If you take one thing from this page", `Privacy on a public ledger is a question of how many weak signals point the same way, not whether you defeated one strong one. That is why habits, wallet choice, and protocol-level tools are complementary rather than alternatives — and why the honest goal is raising the cost of the inference rather than achieving anonymity.`)}`
  },
  {
    slug: "scripts-and-miniscript",
    category: "concepts",
    products: [],
    title: "Scripts and Miniscript",
    summary: "Bitcoin can enforce far more than “whoever holds this key may spend”. It can enforce quorums, deadlines, and conditions that change over time — and Miniscript is what made writing those safely something other than a specialist art.",
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
        "<strong>It can be checked for correctness.</strong> Software can prove a Miniscript is spendable by the parties intended, and cannot be spent by anyone else. The catastrophic failure of a hand-written script becomes a compile-time error.",
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

      <p><a href="https://anchorwatch.com/" target="_blank" rel="noopener">AnchorWatch</a> is a Lloyd's of London coverholder offering insured bitcoin custody, and its Trident Vault is built on Miniscript rather than plain multisig. The reason is precisely the expressiveness described above.</p>

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

      ${callout("If you take one thing from this page", "The chain will enforce whatever you tell it to, exactly, forever, with nobody to appeal to. That is the feature and the danger in one sentence — and the reason Miniscript's ability to prove what a policy does before you fund it matters more than anything it makes newly expressible.")}`
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
  ["watch-only", "watch_only_wallet"],
  ["duress", "wrench_attack"],
  ["sound money", "sound_money"],
  ["hard cap", "hard_cap"],
  ["scarcity", "scarcity"]
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

/* Collapses a set of review dates into one phrase for a section heading.
   Same day reads as a single date; a spread inside one month keeps the month
   once ("Aug 17-18, 2026"); anything wider spells both ends out. Published
   guides only -- a planned one has nothing to review yet. */
const formatUpdatedRange = guides => {
  const dates = guides.map(g => g.updated).filter(Boolean).sort();
  if (!dates.length) return "";
  const [lo, hi] = [dates[0], dates[dates.length - 1]];
  if (lo === hi) return formatUpdated(lo);
  const [loY, loM, loD] = lo.split("-").map(Number);
  const [hiY, hiM] = hi.split("-").map(Number);
  if (loY === hiY && loM === hiM) {
    const month = formatUpdated(lo).split(" ")[0];
    return `${month} ${loD}&ndash;${hi.split("-").map(Number)[2]}, ${loY}`;
  }
  return `${formatUpdated(lo)} &ndash; ${formatUpdated(hi)}`;
};

/* ---- hub rendering ------------------------------------------------------ */

const guideCard = guide => {
  const planned = guide.status !== "published";
  const featured = guide.hubOrder < 0;
  const cardTitle = guide.category === "devices"
    ? guide.title.replace(/:\s*first-time setup$/i, "")
    : guide.title;
  /* Just the reading time. The review date used to sit here too, which forced
     "Read guide" onto a line of its own underneath and made every card taller
     for a per-guide fact the guide's own header already carries -- the hub
     states the range once per section instead. */
  const meta = `<span><i class="bi bi-hourglass-split" aria-hidden="true"></i> ${guide.minutes} min</span>`;
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
      <div class="sc-guide-card-foot">
        <p class="sc-guide-card-meta">${meta}</p>
        ${planned
          ? `<span class="sc-guide-card-soon">Being written</span>`
          : `<span class="sc-text-link">Read guide <i class="bi bi-arrow-right"></i></span>`}
      </div>
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
    ["exchanges", "Canadian exchanges"]
  ];
  /* Two vendors, so a fourth full-width group of its own read as more space
     than the category needed -- it now rides under Wallets as a sub-group,
     since a collaborative-custody wallet is still a wallet. */
  const collabChips = guideProducts.filter(p => p.category === "collaborative")
    .map(p => chip("product", p.key, p.label, "", p.image)).join("");
  const productGroups = finderGroups.map(([cat, label]) => {
    const chips = guideProducts.filter(p => p.category === cat)
      .map(p => chip("product", p.key, p.label, "", p.image)).join("");
    const collab = cat === "software"
      ? `<div class="sc-chip-divider" aria-hidden="true"></div><div class="sc-chip-subgroup"><h5>Collaborative custody</h5><div class="sc-chips">${collabChips}</div></div>`
      : "";
    return `<div class="sc-chip-group"><h4>${label}</h4><div class="sc-chips">${chips}</div>${collab}</div>`;
  }).join("");

  return `
    <section id="finder" class="sc-section sc-section-muted sc-finder-section" hidden data-guide-finder>
      <div class="container">
        <div class="sc-section-head">
          <h2>Guide finder</h2>
          <p>Tell us what you are doing. Answer one question or all three, and the library below narrows as you go — clear it at any point.</p>
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

          <div class="sc-finder-search">
            <label class="sc-finder-search-label" for="guide-search">Or search directly</label>
            <div class="sc-finder-search-wrap">
              <span class="sc-finder-search-icon" aria-hidden="true"></span>
              <input id="guide-search" class="sc-finder-search-input" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="Title, device, wallet, or topic…" data-guide-search>
              <button type="button" class="sc-finder-search-clear" data-guide-search-clear hidden>Clear</button>
            </div>
          </div>

          <div class="sc-finder-bar" data-finder-bar hidden>
            <p class="sc-finder-count" data-finder-count aria-live="polite"></p>
            <button type="button" class="sc-finder-clear" data-finder-clear><i class="bi bi-x" aria-hidden="true"></i> Clear answers</button>
          </div>

          <div class="sc-finder-pick" data-finder-pick hidden></div>
          <p class="sc-guides-empty" data-guide-none hidden>Nothing matches that combination yet. Clear an answer or your search, or <a href="contact.html">ask for the guide</a> and it moves up the queue.</p>
        </div>
      </div>
    </section>`;
};

const renderGuideSections = () => guideCategories.map((cat, index) => {
  const inCategory = listed.filter(g => g.category === cat.key);
  const cards = inCategory
    .slice()
    .sort((a, b) => (a.hubOrder ?? 0) - (b.hubOrder ?? 0))
    .map(guideCard)
    .join("");
  /* Stated once for the whole section rather than on every card. The filter
     hides cards without touching this line, so it describes the section as
     published, not whatever subset is on screen -- hence "these guides" and a
     range, not a count. */
  const reviewed = formatUpdatedRange(inCategory.filter(g => g.status === "published"));
  const reviewedNote = reviewed
    ? `<p class="sc-section-reviewed"><i class="bi bi-arrow-repeat" aria-hidden="true"></i> These guides were last reviewed ${reviewed}</p>`
    : "";
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
          ${reviewedNote}
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
  /* The tools are not a guide category, and they sit below all of them on the
     page. Without an entry here they are only reachable by scrolling past six
     sections, which is how the first one ended up effectively hidden. Marked
     out rather than blended in, because they are a different kind of thing --
     you use them rather than read them. */
  const tool = `<li><a class="is-tool" href="#entropy-workshop">Entropy</a></li>`;
  return `<nav class="sc-guide-nav" aria-label="Guide sections"><ul>${items}${tool}</ul></nav>`;
};

/* ---- the tool band -------------------------------------------------------

   One band on the hub for the one tool the site publishes. Deliberately not a
   guide card: it is not something to read, and dropping it into a category
   grid would both misfile it and bury it among forty siblings.

   The die face is the same mark the dice guide carries beside its title, so a
   reader who has met one recognises the other.

   On the home page the same band runs with `home`, which is not a style
   switch: a reader who arrived at guides.html has already chosen to read about
   custody, and one who landed on the home page has chosen nothing yet. The
   home copy therefore leads with checking a device you already own rather than
   with producing entropy, and drops the objection-handling bullets, which
   answer questions nobody has thought to ask that early. */
const renderToolsBand = ({ home = false } = {}) => `
    <section${home ? ' class="sc-section sc-home-tool-section"' : ' id="entropy-workshop" class="sc-section sc-section-dark"'}>
      <div class="container">
        <div class="sc-section-head">
          <span class="sc-eyebrow">Entropy</span>
          ${home
            ? `<h2>Check the Dice Math</h2>
          <p>Dice, coins or a shuffled deck &mdash; this shows you the words those events should have produced, and whether your device agrees. Experimental, and meant for checking rather than for making a wallet you intend to keep.</p>`
            : `<h2>Test the method</h2>
          <p>Check how your device turns physical randomness into a wallet, using a test sequence rather than the rolls behind a wallet you use. The tool is experimental, and meant for exactly that check.</p>`}
        </div>
        <div class="sc-tool-band">
          <span class="sc-die-mark" aria-hidden="true"></span>
          <div class="sc-tool-copy">
            <h2>Entropy Workshop</h2>
            <p>Enter your dice rolls, coin flips or drawn cards and see the recovery words and first addresses they convert to &mdash; then compare that against what your device showed you. If the two disagree, your device uses a different conversion, which is common and worth knowing before you trust a column of rolls as a backup.</p>
            <ul class="sc-tool-facts">
              ${home
                ? `<li>Beta software &mdash; for testing, not for securing real bitcoin</li>
              <li>Use it here, or save it and run it on a machine that has never been online</li>
              <li>Generates no randomness, and has nowhere to type an existing phrase</li>`
                : `<li>Beta software &mdash; for testing, not for securing real bitcoin</li>
              <li>One file, with nothing loaded from anywhere</li>
              <li>Use it here, or save it and run it on a machine that has never been online</li>
              <li>Checks itself against the published BIP test vectors on load</li>
              <li>Generates no randomness, and has nowhere to type an existing phrase</li>`}
            </ul>
          </div>
          <div class="sc-tool-actions">
            <div class="sc-hero-actions">
              <a class="sc-btn sc-btn-primary" href="entropy.html"><span>Enter Workshop</span></a>
            </div>
            <a class="sc-text-link" href="entropy-offline.html" download="selfcustody-entropy-check.html" data-tool-download>Download the file <i class="bi bi-arrow-down-right"></i></a>
            <p>Enter a test sequence, not the rolls behind a wallet you use. <a href="guides/dice-entropy.html">Roll the dice</a> explains the procedure and the rules that matter more than the tool does.</p>
          </div>
        </div>
        ${home ? '' : `<p class="sc-tool-aside">Also worth a minute: the <a href="guides/human-randomness.html#sc-rng-lab">guessing machine</a> in <em>Why you cannot think of a random number</em>. It calls your next tap before you make it and seals the guess so it cannot cheat, and it explains faster than any article can why nobody should invent their own randomness.</p>`}
      </div>
    </section>`;

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
        ${guide.titleMark
          ? `<div class="sc-guide-title-row"><span class="${guide.titleMark}" aria-hidden="true"></span><h1>${guide.title}</h1></div>`
          : `<h1>${guide.title}</h1>`}
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
  renderToolsBand,
  renderGuideBody
};

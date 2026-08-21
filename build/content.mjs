/* Content layer for selfcustody.ca -- the single source of truth for page
   markup. Consumed by build/render.mjs, which writes the static HTML in docs/.
   Extracted verbatim from site-refresh.js; the browser no longer carries it.

   Do not hand-edit docs/*.html -- edit here and rebuild. */

import { renderGuideFinder, renderGuideSections, renderGuideIndexNav, publishedGuides, productGuideLinks, renderGlossaryTag, guideCategories } from './guides.mjs';

const currentYear = new Date().getFullYear();

  const routes = [
    ["home", "Home", "index.html"],
    ["guides", "Guides", "guides.html"],
    ["devices", "Devices", "devices.html"],
    ["software", "Software", "software.html"],
    ["exchanges", "Exchanges", "exchanges.html"],
    ["glossary", "Glossary", "glossary.html"],
    ["dashboard", "Dashboard", "dashboard.html"],
    ["contact", "Get Help", "contact.html"]
  ];

  const externalLink = (url, label = "Official site") =>
    `<a class="sc-text-link" href="${url}" target="_blank" rel="noopener">${label} <i class="bi bi-arrow-up-right"></i></a>`;

  /* Footer row on a product's detail card: the official-site link anchored
     bottom left, that product's guide button (if it has one) anchored
     bottom right -- see productGuideLinks() in guides.mjs. */
  const detailFooter = (link, guideKey = "") =>
    `<div class="sc-detail-footer">${link}${productGuideLinks(guideKey)}</div>`;

  const hero = (eyebrow, title, lead, actions = "", media = null) => {
    const backgroundMedia = Boolean(media?.background);
    const copy = `
      ${eyebrow ? `<span class="sc-eyebrow">${eyebrow}</span>` : ""}
      <h1>${title}</h1>
      <p class="sc-lead">${lead}</p>
      ${actions ? `<div class="sc-hero-actions">${actions}</div>` : ""}`;

    return `
      <section class="sc-hero${media ? backgroundMedia ? " has-background-media" : " has-media" : ""}">
        ${backgroundMedia ? `
          <figure class="sc-hero-background-media" aria-hidden="true">
            ${media.video
              ? `<video autoplay muted loop playsinline preload="auto" poster="${media.poster}" width="${media.width}" height="${media.height}">
                  <source src="${media.src}" type="${media.type}">
                </video>`
              : `<img src="${media.src}" alt="" width="${media.width}" height="${media.height}" fetchpriority="high">`}
          </figure>` : ""}
        <div class="container">
          ${media ? `
            ${backgroundMedia
              ? `<div class="sc-hero-copy">${copy}</div>`
              : `<div class="row g-5 align-items-center">
                  <div class="col-lg-7 sc-hero-copy">${copy}</div>
                  <div class="col-lg-5">
                    <figure class="sc-hero-media">
                      <img src="${media.src}" alt="${media.alt}" width="${media.width}" height="${media.height}" fetchpriority="high">
                    </figure>
                  </div>
                </div>`}` : copy}
        </div>
      </section>`;
  };

  const card = (icon, title, text, href, linkText = "Learn more") => `
    <div class="col-md-6 col-xl-3">
      <article class="sc-card">
        <div class="sc-card-body">
          <div class="sc-icon"><i class="bi ${icon}"></i></div>
          <h3>${title}</h3>
          <p>${text}</p>
          <a class="sc-text-link" href="${href}">${linkText} <i class="bi bi-arrow-right"></i></a>
        </div>
      </article>
    </div>`;

  const pathCard = (icon, title, text, href, linkText = "Learn more") => `
    <div class="col-md-6 col-xl-3">
      <a class="sc-card sc-path-card-link" href="${href}">
        <div class="sc-card-body">
          <div class="sc-icon"><i class="bi ${icon}"></i></div>
          <h3>${title}</h3>
          <p>${text}</p>
          <span class="sc-text-link">${linkText} <i class="bi bi-arrow-right"></i></span>
        </div>
      </a>
    </div>`;

  const softwareCard = (logo, title, text, href, linkText) => `
    <div class="col-md-6 col-xl-3">
      <a class="sc-card sc-path-card-link sc-software-card" href="${href}">
        <div class="sc-card-body">
          <div class="sc-software-card-heading">
            <span class="sc-software-logo"><img src="${logo}" alt="" width="48" height="48" loading="lazy"></span>
            <h3>${title}</h3>
          </div>
          <p>${text}</p>
          <span class="sc-text-link">${linkText} <i class="bi bi-arrow-right"></i></span>
        </div>
      </a>
    </div>`;

  const pricingCard = ({ badge, title, price, priceNote, sessions, text, features, href, linkText = "Book a free call" }) => `
    <div class="col-lg-4">
      <a class="sc-card sc-pricing-card sc-path-card-link${badge ? " sc-pricing-featured" : ""}" href="${href}">
        <div class="sc-card-body">
          ${badge ? `<span class="sc-eyebrow">${badge}</span>` : ""}
          <h3>${title}</h3>
          <p class="sc-price">${price}<small>${priceNote}</small></p>
          ${sessions ? `<p class="sc-pricing-sessions">${sessions}</p>` : ""}
          <p>${text}</p>
          <ul class="sc-check-list">${features.map(f => `<li>${f}</li>`).join("")}</ul>
          <div class="sc-hero-actions sc-pricing-cta"><span class="sc-btn sc-btn-primary">${linkText}</span></div>
        </div>
      </a>
    </div>`;

  const productTagTone = tag => {
    const value = tag.toLowerCase();
    if (/bitcoin|multi-asset/.test(value)) return "scope";
    if (/open source|diy/.test(value)) return "open";
    if (/usb|nfc|qr|air-gap|bluetooth/.test(value)) return "connect";
    if (/secure element/.test(value)) return "security";
    if (/multisig|advanced/.test(value)) return "advanced";
    return "feature";
  };

  const productCard = ({ image, imageAlt, imageWidth, imageHeight, icon = "bi-usb-drive", title, text, tags, href }) => `
    <div class="col-md-6 col-xl-4">
      <article class="sc-card sc-product-card sc-path-card-link">
        <a class="sc-card-cover-link" href="${href}" aria-label="Read details: ${title}"></a>
        <div class="sc-product-image">
          ${image
            ? `<img src="${image}" alt="${imageAlt || title}" width="${imageWidth}" height="${imageHeight}" loading="lazy">`
            : `<div class="sc-icon mb-0"><i class="bi ${icon}"></i></div>`}
        </div>
        <div class="sc-card-body">
          <h3>${title}</h3>
          <p>${text}</p>
          <div class="sc-tags">${tags.map(tag => renderGlossaryTag(tag, "", `sc-tag-${productTagTone(tag)}`)).join("")}</div>
          <span class="sc-text-link">Read details <i class="bi bi-arrow-right"></i></span>
        </div>
      </article>
    </div>`;

  const lastLinkCheck = "August 6, 2026";

  const sourceNote = links => `
    <p class="sc-source-note">
      Product details checked against ${links.map(([label, url]) =>
        `<a href="${url}" target="_blank" rel="noopener">${label}</a>`).join(", ")}.
      Features, availability, and pricing can change.
      <span class="sc-source-note-date">Links checked ${lastLinkCheck}.</span>
    </p>`;

  const pages = {
    home: {
      title: "SelfCustody.ca | Control Your Money",
      description: "Clear, practical guidance for learning how to buy bitcoin, choose a wallet, protect recovery material, and withdraw to self custody.",
      content: `
        ${hero(
          "",
          `<span class="sc-hero-command-line"><span class="sc-neon-sign sc-neon-sign-exit">EXIT</span><span class="sc-outlined-word sc-hero-fiat" data-text="FIAT"><span class="sc-word-fill">FIAT</span></span></span>
           <span class="sc-hero-command-line"><span class="sc-neon-sign sc-neon-sign-enter">ENTER</span><span class="sc-outlined-word sc-hero-command-destination" data-text="BITCOIN"><span class="sc-word-fill">BITCOIN</span></span></span>`,
          "<span class=\"sc-home-lead-statement\">Your keys, your coins.</span><br class=\"sc-mobile-lead-break\"> Learn how to buy, move, and protect<br class=\"sc-medium-lead-break\"> your bitcoin without turning security into a full time job.",
          `<a class="sc-btn sc-btn-primary" href="guides.html"><span>Explore Guides</span></a>
           <a class="sc-btn sc-btn-ghost" href="contact.html"><span>Get Help</span></a>`,
          {
            src: "assets/img/cash-vortex/exchanges-cash-vortex-final3.mp4",
            type: "video/mp4",
            poster: "assets/img/cash-vortex/exchanges-cash-vortex.png",
            alt: "",
            width: 1616,
            height: 1072,
            video: true,
            background: true
          }
        )}

        <section class="sc-section sc-path-section">
          <div class="sc-path-stars" aria-hidden="true"></div>
          <div class="container">
            <div class="sc-path-heading-row">
              <div class="sc-section-head">
                <span class="sc-eyebrow">Choose your path</span>
                <h2>One step at a time</h2>
                <p>You don't need to learn everything today. Take your time.</p>
              </div>
              <div class="sc-path-constellation" aria-hidden="true"></div>
            </div>
            <div class="row g-4 sc-path-options">
              ${pathCard("bi-signpost-split", "I am brand new", "Learn the basic model: wallet, recovery backup, exchange, address, transaction, and confirmation.", "guides.html")}
              ${pathCard("bi-shield-lock", "I need a hardware wallet", "Compare approachable, air-gapped, open-source, and advanced signing devices without a one-size-fits-all ranking.", "devices.html", "Compare hardware")}
              ${pathCard("bi-window", "I need wallet software", "Understand which app creates transactions, which device signs them, and when mobile or desktop software makes sense.", "software.html", "Compare software")}
              ${pathCard("bi-bank", "I need to buy bitcoin", "Compare platforms by custody model, CAD funding, purchase methods, and withdrawal workflow.", "exchanges.html", "Compare platforms")}
            </div>
          </div>
        </section>

        <section class="sc-section sc-section-muted sc-mission-section">
          <div class="container">
            <div class="row g-5 align-items-center">
              <div class="col-lg-6">
                <span class="sc-eyebrow">The mission</span>
                <h2>Make self-custody understandable before making it advanced</h2>
                <p>Self-custody means controlling the private keys that authorize spending. It removes exchange counterparty risk, but it also makes you responsible for backups, privacy, software verification, and safe transaction habits.</p>
                <p>This site focuses on the middle ground: enough detail to make informed decisions, without pretending everyone needs the most complex setup on day one.</p>
                <a class="sc-text-link" href="guides.html">Read the complete learning path <i class="bi bi-arrow-right"></i></a>
              </div>
              <div class="col-lg-6">
                <div class="sc-detail">
                  <h3 class="mt-0">Four principles that matter</h3>
                  <ul class="sc-check-list">
                    <li>Buy security devices directly from the maker or an authorized reseller.</li>
                    <li>Never type recovery words into a website, chat, email, or ordinary notes app.</li>
                    <li>Verify addresses and transaction details on the signing device itself.</li>
                    <li>Practice recovery with a small amount before trusting a setup with meaningful savings.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="sc-section sc-sequence-section">
          <div class="container">
            <div class="sc-section-head centered">
              <span class="sc-eyebrow">A sensible sequence</span>
              <h2>Self-custody in four deliberate moves</h2>
              <p>The order matters more than the brand names.</p>
            </div>
            <div class="row justify-content-center">
              <div class="col-lg-9">
                <div class="sc-step"><span class="sc-step-number">1</span><div><h3>Choose a security model</h3><p>Decide whether you need a simple mobile wallet, a hardware signer, or a multi-key setup based on value, experience, and threat model.</p></div></div>
                <div class="sc-step"><span class="sc-step-number">2</span><div><h3>Create and protect the backup</h3><p>Generate recovery material on trusted hardware, make legible offline copies, and store them where one accident cannot destroy everything.</p></div></div>
                <div class="sc-step"><span class="sc-step-number">3</span><div><h3>Test before moving size</h3><p>Receive a small amount, send part of it back, verify the address on-device, and understand the fee before increasing the balance.</p></div></div>
                <div class="sc-step"><span class="sc-step-number">4</span><div><h3>Maintain the system</h3><p>Keep instructions current, verify software downloads, review inheritance, and revisit the setup when your balance or circumstances change.</p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section class="sc-close">
          <figure class="sc-close-glow" aria-hidden="true">
            <img src="assets/img/cash-vortex/controlled-orbit-v2.webp" alt="" width="1717" height="916" loading="lazy" decoding="async">
          </figure>
          <div class="container">
            <h2 class="sc-close-title">
              <span class="sc-outlined-word sc-close-word" data-text="CONTROL YOUR MONEY"><span class="sc-word-fill">CONTROL YOUR MONEY</span></span>
            </h2>
            <p class="sc-close-lead">Start with one clear next step. Use the guides to build your setup, or get help when you want a second set of eyes.</p>
            <div class="sc-hero-actions sc-close-actions">
              <a class="sc-btn sc-btn-primary" href="guides.html"><span>Open the guides</span></a>
              <a class="sc-btn sc-btn-ghost" href="contact.html"><span>Get help</span></a>
            </div>
          </div>
        </section>`
    },

    guides: {
      title: "Guides | Self Custody Canada",
      description: "Step-by-step Bitcoin self-custody guides: device setup, wallet software, withdrawing from Canadian exchanges, multisig, passphrases, and recovery testing.",
      content: `
        ${hero(
          "Library",
          "A wealth of knowledge,<br><em>at your fingertips.</em>",
          "Setup walkthroughs for every device and wallet, withdrawal guides for Canadian platforms, and advanced material worth a read.",
          `<a class="sc-btn sc-btn-primary" href="#finder">Find my guide</a>
           <a class="sc-btn sc-btn-ghost" href="guides/complete-path.html">Quickstart</a>`,
          {
            src: "assets/img/guides-library-hero.jpg",
            alt: "",
            width: 1584,
            height: 672,
            background: true
          }
        )}

        ${renderGuideIndexNav()}
        ${renderGuideFinder()}
        ${renderGuideSections()}

        <section class="sc-section sc-section-dark">
          <div class="container">
            <div class="sc-section-head centered">
              <span class="sc-eyebrow">Not finding it</span>
              <h2>Ask for the guide you need</h2>
              <p>The library is still being written, and requests decide what gets written next. If your device, platform, or situation is not covered yet, say so.</p>
            </div>
            <div class="sc-hero-actions justify-content-center">
              <a class="sc-btn sc-btn-primary" href="contact.html">Request a guide</a>
            </div>
          </div>
        </section>`
    },

    devices: {
      title: "Hardware Wallets & Signing Devices | Self Custody Canada",
      description: "Compare current Bitcoin hardware wallets and signing devices by security model, connectivity, usability, openness, and ideal use case.",
      content: `
        ${hero(
          "Hardware signers",
          `The many paths<br><em><span class="sc-hero-flip" aria-live="polite" data-flip-phrases='["to sovereignty.","to self custody.","to financial freedom.","to cold storage.","to peace of mind."]'><span class="sc-hero-flip-item is-active">to sovereignty.</span></span></em>`,
          "Compare the security model, transaction-review experience, backup method, connectivity, and learning curve—not just a feature count.",
          `<a class="sc-btn sc-btn-primary" href="#compare">Compare devices</a>`,
          {
            src: "assets/img/devices-hero.jpg",
            width: 1584,
            height: 672,
            background: true
          }
        )}

        <section class="sc-section">
          <div class="container">
            <aside class="sc-device-preflight mb-5" aria-labelledby="device-preflight-title">
              <div class="sc-device-preflight-head">
                <h2 id="device-preflight-title">What to know before you buy</h2>
              </div>
              <div class="sc-device-preflight-grid">
                <section>
                  <span class="sc-device-preflight-label"><i class="bi bi-box-seam" aria-hidden="true"></i> Supply chain</span>
                  <h3>Before choosing a brand</h3>
                  <p>Buy directly from the manufacturer or a listed authorized reseller. Check tamper evidence and device authenticity, install only official firmware, and never use recovery words supplied by a seller.</p>
                </section>
                <section>
                  <span class="sc-device-preflight-label"><i class="bi bi-calculator" aria-hidden="true"></i> Seed generation</span>
                  <h3>Don't blindly trust device randomness</h3>
                  <p>A device's random number generator is a component you cannot independently verify. Where supported, combine it with your own entropy from 50+ rolls of a six-sided die. Not every device offers this, so check the details before assuming yours does.</p>
                </section>
              </div>
              <div class="sc-device-preflight-guide">
                <div><strong>Generate verifiable entropy yourself</strong><span>Learn the exact dice-roll workflow, conversion process, and checks before using it with a compatible signer.</span></div>
                <div class="sc-device-preflight-guide-cta">
                  <a class="sc-text-link" href="guides/dice-entropy.html">Read the dice-roll guide <i class="bi bi-arrow-right"></i></a>
                  <span class="sc-die-mark" aria-hidden="true"></span>
                </div>
              </div>
            </aside>
            <div class="sc-section-head"><span class="sc-eyebrow">Shortlist</span><h2>Nine useful reference points</h2><p>This is not a winner-takes-all ranking. Each device represents a different balance of transparency, convenience, connectivity, and operator skill.</p></div>
            <div class="row g-4 sc-path-options sc-device-card-grid">
              ${productCard({
                image: "assets/img/devices/trezor-safe-7-shortlist.png",
                imageAlt: "Trezor Safe 7 hardware wallet",
                imageWidth: 560,
                imageHeight: 560,
                title: "Trezor Safe 7",
                text: "Premium touchscreen signer with a dedicated Bitcoin-only firmware edition, open-source security, and encrypted Bluetooth.",
                tags: ["Secure element", "Open source", "Bluetooth"],
                href: "#trezor"
              })}
              ${productCard({
                image: "assets/img/devices/bitkey.png",
                imageAlt: "Bitkey hardware key",
                imageWidth: 320,
                imageHeight: 363,
                title: "Bitkey",
                text: "Block's Bitcoin-only hardware key, phone app, and server key working together as a 2-of-3 multisig—no single point of failure, with company-assisted recovery.",
                tags: ["Bitcoin only", "2-of-3 multisig", "NFC"],
                href: "#bitkey-device"
              })}
              ${productCard({
                image: "assets/img/devices/bitbox02.webp",
                imageAlt: "BitBox02 hardware wallet",
                imageWidth: 1020,
                imageHeight: 574,
                title: "BitBox02",
                text: "Compact Swiss-made signer with a secure dual-chip architecture, open-source firmware, touch controls, and microSD backup.",
                tags: ["USB-C", "microSD backup", "Secure element"],
                href: "#bitbox"
              })}
              ${productCard({
                image: "assets/img/devices/blockstream-jade-plus.png",
                imageAlt: "Blockstream Jade Plus hardware wallet",
                imageWidth: 925,
                imageHeight: 547,
                title: "Blockstream Jade Plus",
                text: "Open-source Bitcoin signer with camera-based QR workflows, USB-C, Bluetooth, SD card support, and a larger display.",
                tags: ["Bitcoin + Liquid", "QR air-gap", "Open source"],
                href: "#jade"
              })}
              ${productCard({
                image: "assets/img/devices/coldcard-q-mk5.png",
                imageAlt: "COLDCARD Q and Mk5 hardware wallets",
                imageWidth: 836,
                imageHeight: 762,
                title: "COLDCARD Q / Mk5",
                text: "Bitcoin-only signers built for air-gapped, beginner-to-advanced workflows, with dual secure elements and strong transaction-policy features.",
                tags: ["Bitcoin only", "Air-gap options", "2× secure elements"],
                href: "#coldcard"
              })}
              ${productCard({
                image: "assets/img/devices/prime_light.webp",
                imageAlt: "Foundation Passport Prime hardware device",
                imageWidth: 1000,
                imageHeight: 1000,
                title: "Foundation Passport",
                text: "Open-source signer with a camera for QR air-gap, secure element, and NFC backup Keycards—now a multi-purpose device covering Bitcoin, 2FA, and security keys.",
                tags: ["Bitcoin + more", "QR air-gap", "NFC Keycards"],
                href: "#passport"
              })}
              ${productCard({
                image: "assets/img/devices/seedsigner.webp",
                imageAlt: "SeedSigner open-source hardware wallet",
                imageWidth: 1586,
                imageHeight: 992,
                title: "SeedSigner",
                text: "Open-source, Bitcoin-only firmware you build from an off-the-shelf Raspberry Pi Zero, camera, and screen, using QR codes for fully air-gapped, stateless signing.",
                tags: ["Bitcoin only", "DIY hardware", "QR air-gap"],
                href: "#seedsigner"
              })}
              ${productCard({
                image: "assets/img/devices/krux-yahboom.png",
                imageAlt: "Krux open-source Bitcoin signer running on K210 touchscreen hardware",
                imageWidth: 312,
                imageHeight: 440,
                title: "Krux",
                text: "Open-source, Bitcoin-only firmware you flash onto off-the-shelf K210 touchscreen hardware, with QR and SD-card air-gapped signing.",
                tags: ["Bitcoin only", "DIY firmware", "QR air-gap"],
                href: "#krux"
              })}
              ${productCard({
                image: "assets/img/devices/ledger-stax-face.webp",
                imageAlt: "Ledger Stax hardware wallet",
                imageWidth: 504,
                imageHeight: 480,
                title: "Ledger",
                text: "Widely used multi-asset signer line (Nano S Plus, Nano X, Flex, Stax) with a certified secure element, USB and Bluetooth connectivity, and a companion app.",
                tags: ["Multi-asset", "Bluetooth", "Secure element"],
                href: "#ledger"
              })}
            </div>
          </div>
        </section>

        <section id="compare" class="sc-section sc-section-muted">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Feature matrix</span><h2>Compare security and workflow</h2><p>Use the checks as a map, not a score. A feature is valuable only when it fits the way you intend to set up, sign, and recover.</p></div>
            <div class="sc-matrix-legend" aria-label="Comparison legend">
              <span><i class="sc-matrix-mark sc-matrix-yes" aria-hidden="true">✓</i> Available</span>
              <span><i class="sc-matrix-mark sc-matrix-partial" aria-hidden="true">◐</i> Optional or model-dependent</span>
              <span><i class="sc-matrix-mark sc-matrix-no" aria-hidden="true">—</i> Not part of the standard workflow</span>
            </div>
            <div class="sc-table-wrap">
              <table class="table sc-table sc-feature-matrix">
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">Trezor Safe 7</th>
                    <th scope="col">Bitkey</th>
                    <th scope="col">BitBox02</th>
                    <th scope="col">Blockstream<br>Jade Plus</th>
                    <th scope="col">COLDCARD<br>Q / Mk5</th>
                    <th scope="col">Foundation<br>Passport</th>
                    <th scope="col">SeedSigner</th>
                    <th scope="col">Krux</th>
                    <th scope="col">Ledger</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="sc-matrix-group"><th colspan="10">Security and auditability</th></tr>
                  <tr>
                    <th scope="row">Publicly reviewable firmware</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>MIT plus Commons Clause</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Deterministic builds</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Reproducible builds</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>No third-party audit yet</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Element OS is closed</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Dedicated key-isolation chip</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>EAL6+ TROPIC01</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Secure MCU; 2-of-3 multisig</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>EAL6+ secure chip</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Virtual secure element</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Two, different vendors</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Stateless design instead</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Encrypted storage instead</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>EAL5+ / EAL6+</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Bitcoin only firmware</th>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Separate firmware edition</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Separate edition, locked at factory</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Plus Liquid</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Multi-purpose</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Multi-asset only</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Transaction review on device</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                  </tr>

                  <tr class="sc-matrix-group"><th colspan="10">Air gap and connectivity</th></tr>
                  <tr>
                    <th scope="row">Fully air-gapped signing path</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>USB or Bluetooth only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Phone app plus NFC</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>USB, or BLE on Nova</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>QR, SD, USB drive</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>QR on Q; microSD both</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>QR only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>QR or SD card</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>USB or Bluetooth only</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Camera-based QR signing</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Q only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                  </tr>
                  <tr>
                    <th scope="row">Removable media for signing</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Backup only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>SD or USB drive</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>microSD</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>No microSD on Prime</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>QR only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>SD card</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                  </tr>
                  <tr>
                    <th scope="row">USB data connection</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Charging only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Off by default</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Power only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Power and flashing</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                  </tr>
                  <tr>
                    <th scope="row">Bluetooth</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Can be disabled</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Nova only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>QuantumLink</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>No radios at all</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Not Nano S Plus</small></td>
                  </tr>
                  <tr>
                    <th scope="row">NFC</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Main interface</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Can be disabled</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Backup Keycards</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Stax, Flex, Gen5</small></td>
                  </tr>

                  <tr class="sc-matrix-group"><th colspan="10">Backup and operating model</th></tr>
                  <tr>
                    <th scope="row">Recovery words supported</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Multi-share option</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>No seed phrase</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Plus dice rolls</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Plus SeedQR</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Plus dice, SeedQR</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                  </tr>
                  <tr>
                    <th scope="row">Removable-media backup</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Words only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Cloud and social</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>microSD default</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>SD or SeedQR</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Encrypted microSD</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Keycards, SeedQR</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Words or SeedQR</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Encrypted SD export</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Words only</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Runs without storing a seed</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Stateless QR signing</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Temporary seed in RAM</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Core design</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Amnesic by default</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="sc-source-note">Every row was cross-checked against each manufacturer's own current documentation on ${lastLinkCheck}; where a spec varies by model, the note says which models it applies to. No device is ranked or highlighted here—the marks describe design choices, not scores. A dash does not mean a device is unsafe; it usually means the maker chose a different approach, and a feature only matters if it fits how you actually plan to set up, sign, and recover.</p>
          </div>
        </section>

        <section class="sc-section sc-device-details">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Detailed notes</span><h2>What each device is really optimizing for</h2></div>

            <article id="trezor" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/trezor-safe-7-detail.png" alt="Trezor Safe 7" width="660" height="1118" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Trezor Safe 7</h2><p>Trezor's current premium model is also available as a dedicated Bitcoin-only firmware edition: same hardware as the standard Safe 7—large colour touchscreen, open-source software, a secure element plus a security microcontroller, encrypted Bluetooth, USB-C, wireless charging—with altcoin functionality removed entirely.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want clear on-device review and a guided companion app.</li><li>Users who value an open-source design but also want phone connectivity.</li><li>Bitcoin-only holders who still want a premium touchscreen experience.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>A premium device adds features, battery, radios, and complexity that a long-term Bitcoin-only holder may not need.</li><li>Bluetooth can be disabled; decide whether convenience belongs in your threat model.</li></ul></div>
              </div>
            ${detailFooter(externalLink("https://trezor.io/trezor-safe-7-bitcoin-only"), "trezor")}</article>

            <article id="bitkey-device" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/bitkey.png" alt="Bitkey hardware key" width="320" height="363" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Bitkey</h2><p>Bitkey is Block's Bitcoin-only wallet: a hardware key, a mobile app, and a Block-held recovery key form a 2-of-3 multisignature wallet by design—no single key can move funds alone. The hardware key has an OLED display, a fingerprint sensor, connects via NFC, and charges over USB-C. Firmware, app, server code, and hardware schematics are published on GitHub under the Commons Clause license, though the firmware cannot be independently rebuilt end-to-end because it depends on a proprietary third-party fingerprint-matching library Block cannot redistribute.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want multisig-level protection without configuring it themselves.</li><li>Users who prefer a polished, guided consumer product over a DIY or advanced setup.</li><li>Anyone comfortable with Block holding one of three keys to help with recovery.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>The published code carries a Commons Clause restriction and isn't independently buildable end-to-end—source-available, not fully open source.</li><li>Recovery leans on the app, encrypted cloud backup, and social recovery rather than a single standard seed phrase.</li><li>A company-held key is a different trust model than a fully self-contained signer.</li></ul></div>
              </div>
            ${detailFooter(externalLink("https://bitkey.world/"), "bitkey")}</article>

            <article id="bitbox" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/bitbox02.webp" alt="BitBox02 hardware wallet" width="1020" height="574" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>BitBox02</h2><p>The BitBox02 Bitcoin-only edition combines open-source firmware with a secure dual-chip design, a compact OLED display, touch sliders, USB-C, and a fast microSD backup workflow. The Bitcoin-only firmware edition is locked at the factory and cannot be switched to multi-asset firmware.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want a compact, approachable Bitcoin-only device.</li><li>Users who like guided desktop software and microSD recovery.</li><li>Sparrow, Electrum, Specter, and personal-node users.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>Normal use is connected over USB-C rather than camera-based air gap.</li><li>The original BitBox02 does not work with iPhone/iPad; verify the current Nova model if iOS matters.</li></ul></div>
              </div>
            ${detailFooter(externalLink("https://bitbox.swiss/bitbox02/bitcoin-only/"), "bitbox")}</article>

            <article id="jade" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/blockstream-jade-plus.png" alt="Blockstream Jade Plus" width="925" height="547" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Blockstream Jade Plus</h2><p>Jade Plus is a Bitcoin and Liquid signer with a larger display, camera, physical controls, QR signing, USB-C, Bluetooth, and SD card support. Its hardware and firmware are open source, and its security architecture uses Blockstream's virtual secure element approach.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want camera-based air-gapped signing with a modern screen.</li><li>Users who prefer auditable hardware and firmware.</li><li>Sparrow, Nunchuk, Specter, and Blockstream App workflows.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>Learn how PIN unlock, genuine check, and stateless recovery work before deciding on a backup plan.</li></ul></div>
              </div>
            ${detailFooter(externalLink("https://blockstream.com/jade/jade-plus/"), "jade")}</article>

            <article id="coldcard" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/coldcard-q-mk5.png" alt="COLDCARD Q and Mk5 hardware wallets" width="836" height="762" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>COLDCARD Q / Mk5</h2><p>COLDCARD Q and Mk5 are Bitcoin-only signers with dual secure elements from different vendors, publicly reviewable and reproducible firmware, and some of the deepest transaction-policy controls available on a consumer signer, while still working for someone building their first air-gapped setup.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want one device that scales from a first air-gapped wallet to advanced multisig and policy rules.</li><li>Users who value dual, independently-sourced secure elements and open, reproducible firmware.</li><li>Anyone who wants microSD, NFC, and (on the Q) QR/camera air-gap options in a single signer.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>Read the docs to get the most out of its more advanced features.</li><li>Choosing between Q and Mk5 comes down to keyboard-and-camera versus a smaller, simpler form factor.</li></ul><div class="sc-hero-actions"><a class="sc-btn sc-btn-primary" href="coinkite.html"><span>Explore Coinkite products</span></a></div></div>
              </div>
            ${detailFooter(externalLink("https://coldcard.com/"), "coldcard")}</article>

            <article id="passport" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/prime_light.webp" alt="Foundation Passport Prime hardware device" width="1000" height="1000" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Foundation Passport</h2><p>Passport Prime is Foundation's current device, and it is a significant change of direction from the earlier Bitcoin-only Passport. It keeps the open-source approach, the camera for QR-based air-gapped signing, and SeedQR import and export, but it is now a multi-purpose security device: alongside the Bitcoin wallet, its KeyOS firmware also handles 2FA codes, FIDO security keys, and encrypted file storage. It pairs a security processor with a secure element, adds QuantumLink Bluetooth and NFC backup Keycards, and drops the microSD slot the older model used.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want camera-based QR air-gapped signing with a large, modern touchscreen.</li><li>Anyone who wants one device for Bitcoin plus 2FA codes, security keys, and encrypted files.</li><li>Envoy companion-app workflows, including Magic Backups and Keycard recovery.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>No longer Bitcoin-only—the extra apps and radios add capability but also attack surface a single-purpose signer avoids.</li><li>Backup moves to NFC Keycards and SeedQR rather than the microSD workflow the earlier Passport used.</li><li>If you specifically want the older Bitcoin-only Passport, check availability first—Foundation's shop currently lists Passport Prime.</li></ul></div>
              </div>
            ${detailFooter(externalLink("https://foundation.xyz/passport"), "passport")}</article>

            <article id="seedsigner" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/seedsigner.webp" alt="SeedSigner open-source hardware wallet" width="1586" height="992" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>SeedSigner</h2><p>SeedSigner is open-source, Bitcoin-only firmware that you build yourself from off-the-shelf parts—typically a Raspberry Pi Zero, a camera module, and a small screen—into a fully air-gapped, QR-code-based signer. It has no secure element and, by design, does not persist your seed on the device: you re-enter it each session from words, dice rolls, or a SeedQR.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want a fully inspectable, DIY Bitcoin-only signer built from cheap, replaceable hardware.</li><li>QR-based single-sig and multisig workflows, including stateless "amnesic" use.</li><li>Users comfortable assembling hardware and flashing firmware themselves.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>No secure element—encryption and process-level protections are a different trust model than a certified chip.</li><li>Built on commodity consumer electronics rather than purpose-built security hardware.</li><li>Re-entering your seed each session is deliberate, but means you need a reliable physical backup.</li></ul></div>
              </div>
            ${detailFooter(externalLink("https://seedsigner.com/"), "seedsigner")}</article>

            <article id="krux" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/krux-yahboom.png" alt="Krux running on a Yahboom K210 touchscreen device" width="312" height="440" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Krux</h2><p>Krux is open-source, Bitcoin-only firmware that turns off-the-shelf Kendryte K210 devices—such as the Yahboom K210 module or M5StickV—into air-gapped signers using QR codes or an SD card. It has no secure element; protection relies on encryption. Krux was built amnesic-first—by default it holds nothing between sessions and you load your key each time—with optional encrypted storage on the device or an SD card if you want persistence.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want a fully inspectable, DIY Bitcoin-only signer.</li><li>QR-based single-sig and multisig workflows.</li><li>Users comfortable flashing firmware and sourcing their own hardware.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>The project states it has not yet been formally audited by a third party.</li><li>No secure element—encryption-based protection is a different trust model than a certified chip.</li><li>Built on commodity consumer electronics rather than purpose-built security hardware.</li></ul></div>
              </div>
            ${detailFooter(externalLink("https://selfcustody.github.io/krux/"), "krux")}</article>

            <article id="ledger" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/ledger-stax-face.webp" alt="Ledger Stax hardware wallet" width="504" height="480" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Ledger</h2><p>Ledger's current lineup (Nano S Plus, Nano X, Flex, Stax, and the touchscreen Nano Gen5) pairs a certified secure element—EAL5+ on the older Nano models, EAL6+ on the newer touchscreen devices—with the Ledger Live companion app. The individual apps you install are open source, but the underlying secure element operating system, BOLOS, is closed source, so the core security boundary can't be independently reviewed the way a fully open design can. Devices are multi-asset by default rather than shipping a dedicated Bitcoin-only firmware edition.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want a widely used, certified-hardware signer with a polished companion app.</li><li>Users who hold multiple assets, not just Bitcoin, on one device.</li><li>Anyone prioritizing a large ecosystem of supported apps and integrations.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>The secure element OS is closed source—you're trusting Ledger's certification, not auditing the code yourself.</li><li>No dedicated Bitcoin-only firmware edition, and no air-gapped (QR or SD card) signing path.</li><li>Ledger Recover, an opt-in cloud/social seed-backup service, has drawn criticism; it's optional and can be ignored if you self-custody your own backup.</li></ul></div>
              </div>
            ${detailFooter(externalLink("https://www.ledger.com/"), "ledger")}</article>

            ${sourceNote([
              ["COLDCARD", "https://coldcard.com/"],
              ["Trezor", "https://trezor.io/trezor-safe-7-bitcoin-only"],
              ["Krux", "https://selfcustody.github.io/krux/"],
              ["Blockstream", "https://blockstream.com/jade/jade-plus/"],
              ["Bitkey", "https://bitkey.world/"],
              ["BitBox", "https://bitbox.swiss/bitbox02/bitcoin-only/"],
              ["SeedSigner", "https://seedsigner.com/"],
              ["Foundation", "https://foundation.xyz/passport"],
              ["Ledger", "https://www.ledger.com/"]
            ])}
          </div>
        </section>`
    },

    coinkite: {
      title: "Coinkite Product Guide | Self Custody Canada",
      description: "A focused guide to Coinkite products including COLDCARD Q, Mk5, TAPSIGNER, SATSCARD, OPENDIME, and SEEDPLATE.",
      content: `
        ${hero(
          "Coinkite product family",
          "Canadian-built tools for<br><em>keys, signing, and physical bitcoin.</em>",
          "COLDCARD, TAPSIGNER, and SATSCARD may sit in the same store, but they do very different jobs. This page separates the models clearly.",
          `<a class="sc-btn sc-btn-primary" href="#compare-coinkite">Compare products</a>
           <a class="sc-btn sc-btn-ghost" href="devices.html">All device brands</a>`,
          {
            src: "assets/img/coinkite-metal-security.jpeg",
            alt: "Close-up of scratched, brushed metal catching warm light",
            width: 1600,
            height: 1067
          }
        )}

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">The key distinction</span><h2>Signer, card, or bearer instrument?</h2><p>Start with the role—not the form factor.</p></div>
            <div class="row g-4">
              ${card("bi-calculator", "COLDCARD Q / Mk5", "Display-equipped Bitcoin hardware signers. They create or hold wallet keys and independently show transaction details before signing.", "#coldcard", "Compare COLDCARD")}
              ${card("bi-wifi", "TAPSIGNER", "A reusable NFC signing key that stays with one owner. The companion wallet displays transaction details because the card has no screen.", "#tapsigner", "Understand TAPSIGNER")}
              ${card("bi-credit-card-2-front", "SATSCARD", "A physical bearer Bitcoin card with ten independent slots. The funded card itself can change owners.", "#satscard", "Understand SATSCARD")}
              ${card("bi-usb-drive", "OPENDIME & backups", "Physical bearer USB tools, steel seed backups, and accessories that support a wider custody plan.", "#related", "See related tools")}
            </div>
          </div>
        </section>

        <section id="compare-coinkite" class="sc-section sc-section-muted">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Compare</span><h2>Products that should not be confused</h2></div>
            <div class="sc-table-wrap">
              <table class="table sc-table">
                <thead><tr><th>Product</th><th>Job</th><th>Where you review</th><th>Backup / exit</th><th>Changes owner?</th></tr></thead>
                <tbody>
                  <tr><td><strong>COLDCARD Q</strong></td><td>Full-featured Bitcoin signer</td><td>Large device screen</td><td>Recovery words, encrypted backup, documented export options</td><td>No</td></tr>
                  <tr><td><strong>COLDCARD Mk5</strong></td><td>Compact Bitcoin signer</td><td>Device screen</td><td>Recovery words and encrypted microSD backup</td><td>No</td></tr>
                  <tr><td><strong>TAPSIGNER</strong></td><td>Reusable NFC signing key</td><td>Companion wallet; card has no screen</td><td>Encrypted backup file + separate printed key + wallet configuration</td><td>No</td></tr>
                  <tr><td><strong>SATSCARD</strong></td><td>Physical bearer bitcoin</td><td>Compatible app verifies card state and funding</td><td>Unseal current slot and sweep; ten independent slots</td><td>Yes</td></tr>
                  <tr><td><strong>OPENDIME</strong></td><td>USB bearer bitcoin</td><td>Computer verifies address and balance</td><td>Break physical seal to expose key and sweep</td><td>Yes</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="sc-section">
          <div class="container">
            <article id="coldcard" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/coldcard-q-mk5.png" alt="COLDCARD Q and Mk5 side by side" width="836" height="762" loading="lazy"></div></div>
                <div class="col-lg-7">
                  <span class="sc-eyebrow">Bitcoin hardware signers</span><h2>COLDCARD Q and Mk5</h2>
                  <p>Both models are Bitcoin-only signers built around dual secure elements, verifiable firmware, extensive PIN controls, PSBT workflows, microSD, NFC, and USB-C. They are designed to keep private keys on the device while letting you choose how transaction data moves.</p>
                  <h3>Choose Q when</h3><ul class="sc-check-list"><li>You want a 3.2-inch display, full QWERTY keyboard, built-in QR scanner, dual microSD slots, and AAA battery operation.</li><li>You use long BIP39 passphrases or frequent QR-based workflows.</li><li>You want the clearest COLDCARD interface for advanced multisig and policy work.</li></ul>
                  <h3>Choose Mk5 when</h3><ul class="sc-check-list"><li>You want the same core security philosophy in a pocketable form.</li><li>microSD and NFC signing fit your workflow and a QR camera is not required.</li><li>You prefer a compact keypad device with fewer physical extras.</li></ul>
                  <div class="sc-tags">${["Dual secure elements", "Bitcoin only", "MicroSD", "NFC", "Reproducible firmware"].map(tag => renderGlossaryTag(tag)).join("")}</div>
                </div>
              </div>
            ${detailFooter(externalLink("https://coldcard.com/", "Official COLDCARD comparison"), "coldcard")}</article>

            <article id="tapsigner" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/tapsigner.svg" alt="TAPSIGNER NFC Bitcoin hardware signer" width="571" height="360" loading="lazy"></div></div>
                <div class="col-lg-7">
                  <span class="sc-eyebrow">Reusable NFC signer</span><h2>TAPSIGNER</h2>
                  <p>TAPSIGNER keeps one BIP32 private key on a credit-card-sized NFC card. A compatible wallet constructs and displays the transaction; you tap the card and enter its PIN to authorize a signature.</p>
                  <h3>What it improves</h3><ul class="sc-check-list"><li>The phone does not normally hold the unencrypted master private key.</li><li>No battery, cable, or seed-word entry is required for routine signing.</li><li>Works as a single-signature key or one key in a multisig setup with compatible wallets.</li></ul>
                  <h3>The honest trade-off</h3><ul class="sc-caution-list"><li>There is no display on the card. You must trust your companion wallet to show the correct amount, destination, fee, inputs, and change.</li><li>Recovery requires the encrypted backup file, the separate printed key, and the wallet configuration. Plan and test this before funding.</li></ul>
                </div>
              </div>
            ${detailFooter(externalLink("https://tapsigner.com/"), "tapsigner")}</article>

            <article id="satscard" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/satscard.png" alt="SATSCARD physical bearer Bitcoin card" width="2015" height="532" loading="lazy"></div></div>
                <div class="col-lg-7">
                  <span class="sc-eyebrow">Physical bearer bitcoin</span><h2>SATSCARD</h2>
                  <p>SATSCARD has ten independent slots. You verify and fund the current sealed slot, then the card can be handed to another person without an on-chain transfer. The recipient can keep it sealed, pass it again, or unseal the slot and sweep the bitcoin into a normal wallet.</p>
                  <h3>Good use cases</h3><ul class="sc-check-list"><li>Giving actual bitcoin before the recipient has chosen a wallet.</li><li>Teaching the difference between possession, a sealed key, and an on-chain transaction.</li><li>Small, deliberate physical transfers after the recipient verifies the card and funding.</li></ul>
                  <h3>Do not mistake it for</h3><ul class="sc-caution-list"><li>A debit card, Lightning tap-to-pay card, exchange account, or recommended vault for large savings.</li><li>A TAPSIGNER: SATSCARD is meant to change owners; TAPSIGNER is a reusable signing key that stays with one owner.</li><li>A reusable address after unsealing. Sweep the full balance and never fund an exposed slot again.</li></ul>
                </div>
              </div>
            ${detailFooter(externalLink("https://satscard.com/"), "satscard")}</article>

            <article id="related" class="sc-detail">
              <span class="sc-eyebrow">Related tools</span><h2>OPENDIME, SEEDPLATE, COLDPOWER, and BLOCKCLOCK</h2>
              <div class="row g-4 mt-1">
                <div class="col-md-6"><h3>OPENDIME</h3><p>A small USB bearer instrument. Fund it and pass it physically while sealed; break the seal to reveal the private key and sweep. Treat possession as control.</p></div>
                <div class="col-md-6"><h3>SEEDPLATE</h3><p>A steel recovery-word backup. It improves fire and water resistance, but it does not solve theft, passphrase loss, poor storage, or an untested recovery plan.</p></div>
                <div class="col-md-6"><h3>COLDPOWER</h3><p>A 9-volt battery adapter that provides power without USB data—useful when operating a signer away from a computer port.</p></div>
                <div class="col-md-6"><h3>BLOCKCLOCK</h3><p>A Bitcoin data display for block height, price, and related network information. It is a display product, not a custody device.</p></div>
              </div>
              ${detailFooter(externalLink("https://coinkite.com/", "Official Coinkite product guide"))}
            </article>

            <div class="sc-callout mt-4"><h3>Supply-chain rule</h3><p>Coinkite recommends buying from its store or an authorized reseller and inspecting security products for tampering. A discount is not worth uncertainty about who handled a signing device.</p></div>
            ${sourceNote([
              ["Coinkite", "https://coinkite.com/"],
              ["COLDCARD", "https://coldcard.com/"],
              ["TAPSIGNER", "https://tapsigner.com/"],
              ["SATSCARD", "https://satscard.com/"]
            ])}
          </div>
        </section>`
    },

    software: {
      title: "Bitcoin Wallet Software | Self Custody Canada",
      description: "Compare Sparrow, Nunchuk, Cove, Electrum, BlueWallet, Wasabi, and Specter by platform, hardware support, privacy, and multisig.",
      content: `
        ${hero(
          "Wallet software",
          "Always visible.<br><em>Safely secured.</em>",
          "Show balances, generate receive addresses, construct transactions and broadcast them. Pair it with a hardware signer so the keys remain offline.",
          `<a class="sc-btn sc-btn-primary" href="#software-compare">Compare wallets</a>
           <a class="sc-btn sc-btn-ghost" href="devices.html">Pair with hardware</a>`,
          {
            src: "assets/img/software-hero.jpg",
            alt: "",
            width: 1586,
            height: 672,
            background: true
          }
        )}

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Featured wallets</span><h2>Match software to the job</h2><p>Shortlisted for strong hardware-wallet support—each one pairs with most signing devices, not just one brand. Download only from the official project website. Verify signatures or release hashes where the project documents a verification process.</p></div>
            <div class="row g-4 sc-path-options sc-software-card-grid">
              ${softwareCard("assets/img/software/sparrow.png", "Sparrow Wallet", "Desktop Bitcoin wallet with excellent PSBT, hardware, multisig, coin control, labeling, Tor, and personal-node support.", "#sparrow", "Read notes")}
              ${softwareCard("assets/img/software/nunchuk.png", "Nunchuk", "Mobile and desktop wallet focused on multisig, shared wallets, hardware keys, recovery planning, and optional inheritance services.", "#nunchuk", "Read notes")}
              ${softwareCard("assets/img/software/cove.png", "Cove Wallet", "Bitcoin-only mobile wallet with UTXO management, labels, hardware-wallet integration, and PSBT signing over QR or NFC.", "#cove", "Read notes")}
              ${softwareCard("assets/img/software/electrum.png", "Electrum", "Long-running desktop Bitcoin wallet with SPV verification, cold-storage workflows, multisig, plugins, and hardware support.", "#electrum", "Read notes")}
              ${softwareCard("assets/img/software/bluewallet.png", "BlueWallet", "Mobile Bitcoin and Lightning wallet with watch-only monitoring, multisig vaults, coin control, and hardware-wallet PSBT support.", "#bluewallet", "Read notes")}
              ${softwareCard("assets/img/software/wasabi.svg", "Wasabi Wallet", "Privacy-focused desktop wallet built around CoinJoin, mandatory Tor routing, advanced coin control, and broad hardware-wallet support via HWI.", "#wasabi", "Read notes")}
              ${softwareCard("assets/img/software/specter.png", "Specter", "Desktop multisig coordinator built for air-gapped signing, pairing with the widest range of hardware wallets of any option here.", "#specter", "Read notes")}
            </div>
          </div>
        </section>

        <section id="software-compare" class="sc-section sc-section-muted">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Feature matrix</span><h2>Compare privacy and hardware workflow</h2><p>Use the checks as a map, not a score. A feature is valuable only when it fits how you actually plan to hold, sign, and back up.</p></div>
            <div class="sc-matrix-legend" aria-label="Comparison legend">
              <span><i class="sc-matrix-mark sc-matrix-yes" aria-hidden="true">✓</i> Available</span>
              <span><i class="sc-matrix-mark sc-matrix-partial" aria-hidden="true">◐</i> Optional or model-dependent</span>
              <span><i class="sc-matrix-mark sc-matrix-no" aria-hidden="true">—</i> Not part of the standard workflow</span>
            </div>
            <div class="sc-table-wrap">
              <table class="table sc-table sc-feature-matrix">
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">Sparrow</th>
                    <th scope="col">Nunchuk</th>
                    <th scope="col">Cove</th>
                    <th scope="col">Electrum</th>
                    <th scope="col">BlueWallet</th>
                    <th scope="col">Wasabi</th>
                    <th scope="col">Specter</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="sc-matrix-group"><th colspan="8">Openness and platforms</th></tr>
                  <tr>
                    <th scope="row">Publicly reviewable source</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Apache 2.0</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Public repo</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>BDK-based, open</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>MIT</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Open source</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Open source</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Open source</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Desktop app</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Mac, Windows, Linux</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                  </tr>
                  <tr>
                    <th scope="row">Mobile app</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>iOS and Android</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>iOS and Android</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Android only, no iOS</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>iOS and Android</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                  </tr>

                  <tr class="sc-matrix-group"><th colspan="8">Privacy and network</th></tr>
                  <tr>
                    <th scope="row">Personal/private node support</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Bitcoin Core or Electrum server</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Platform-dependent</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Run your own Electrum server</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>EPS, ElectrumX, or Electrs</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Bitcoin Core</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Tor support</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Built in</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Desktop and Android only, not iOS</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Proxy flag, not a one-tap toggle</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>All traffic routed through Tor</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                  </tr>
                  <tr>
                    <th scope="row">CoinJoin / advanced privacy</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>WabiSabi coordinator</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                  </tr>

                  <tr class="sc-matrix-group"><th colspan="8">Wallet management</th></tr>
                  <tr>
                    <th scope="row">Watch-only mode</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Not fully detailed</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Not fully detailed</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                  </tr>
                  <tr>
                    <th scope="row">Coin control / UTXO management</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Advanced coin control</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Advanced</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                  </tr>
                  <tr>
                    <th scope="row">Labels (BIP-329)</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                  </tr>

                  <tr class="sc-matrix-group"><th colspan="8">Hardware and advanced signing</th></tr>
                  <tr>
                    <th scope="row">Hardware wallet / PSBT support</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Plugin-based</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Via HWI</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Widest range of any wallet here</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Air-gapped QR/SD signing</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>UR standard</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>QR or SD</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>BBQr</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>USB-oriented</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>QR and SD, multiple devices</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Multisig support</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Multi-user</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Core focus</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Lightning support</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Dedicated Lightning wallet</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="sc-source-note">Every row was cross-checked against each project's own current documentation on August 7, 2026. No wallet is ranked or highlighted—the marks describe design choices, not scores. A dash usually means a different design trade-off, not a flaw.</p>
          </div>
        </section>

        <section id="software-detail" class="sc-section sc-software-details">
          <div class="container">
            <div class="sc-section-head">
              <span class="sc-eyebrow">In detail</span>
              <h2>Seven wallets, up close</h2>
              <p>Where each one is strong, and what to weigh before relying on it.</p>
            </div>
            <article id="sparrow" class="sc-detail"><div class="sc-software-brand"><img src="assets/img/software/sparrow.png" alt="" width="48" height="48" loading="lazy"><h2>Sparrow Wallet</h2></div><p>Sparrow is a desktop Bitcoin wallet for users who want visibility into transactions and UTXOs. It supports single-signature and multisig policies, common script types, output descriptors, PSBTs, hardware wallets, QR signing, coin control, labeling, Tor, Bitcoin Core, and private Electrum servers.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Hardware-wallet setup and transaction review.</li><li>Coin selection, fee control, labeling, and privacy education.</li><li>Air-gapped and multisig PSBT workflows.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>A public server can learn wallet activity. Move toward your own node or private server when privacy matters.</li><li>The interface exposes more detail than a beginner mobile wallet.</li></ul></div></div>${detailFooter(externalLink("https://sparrowwallet.com/"), "sparrow")}</article>
            <article id="nunchuk" class="sc-detail"><div class="sc-software-brand"><img src="assets/img/software/nunchuk.png" alt="" width="48" height="48" loading="lazy"><h2>Nunchuk</h2></div><p>Nunchuk focuses on single-signature and multisig wallets, shared access, air-gapped signing, broad hardware support, and optional assisted services such as recovery and inheritance planning. It supports products including COLDCARD, TAPSIGNER, Jade, SeedSigner, Trezor, Ledger, BitBox, Passport, and Keystone.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Families, partners, and businesses that need multi-user multisig.</li><li>People building a deliberate inheritance or assisted-recovery plan.</li><li>NFC TAPSIGNER and multiple hardware-key setups.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>Understand which features are self-serve and which depend on a paid service or platform key.</li><li>Back up the complete wallet configuration as well as every private key.</li></ul></div></div>${detailFooter(externalLink("https://nunchuk.io/"), "nunchuk")}</article>
            <article id="cove" class="sc-detail"><div class="sc-software-brand"><img src="assets/img/software/cove.png" alt="" width="48" height="48" loading="lazy"><h2>Cove Wallet</h2></div><p>Cove is a Bitcoin-only mobile wallet designed for both straightforward on-chain use and more advanced workflows. It supports UTXO management, BIP329 labels, hardware-wallet PSBTs, and signing or wallet imports over QR and NFC.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Bitcoin-only mobile self custody.</li><li>Managing and labeling individual UTXOs.</li><li>Using supported hardware wallets through PSBT, QR, or NFC workflows.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>A phone remains a general-purpose, internet-connected device; use dedicated hardware for long-term savings keys when appropriate.</li><li>Test hardware-wallet and backup workflows with a small amount before relying on them.</li></ul></div></div>${detailFooter(externalLink("https://covebitcoin.com/"), "cove")}</article>
            <article id="electrum" class="sc-detail"><div class="sc-software-brand"><img src="assets/img/software/electrum.png" alt="" width="48" height="48" loading="lazy"><h2>Electrum</h2></div><p>Electrum is a mature Bitcoin wallet whose private keys stay encrypted on the local device. It uses decentralized Electrum servers, verifies transaction history with SPV, supports watch-only cold storage, multisig, and hardware-wallet plugins, and can export keys without platform lock-in.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Users who value a mature, lightweight Bitcoin-only desktop wallet.</li><li>Watch-only and offline-signing arrangements.</li><li>Custom server and hardware integrations.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>Electrum is frequently impersonated by phishing sites. Use only electrum.org and verify downloads.</li><li>Server selection affects privacy and the trust placed in transaction information.</li></ul></div></div>${detailFooter(externalLink("https://electrum.org/"), "electrum")}</article>
            <article id="bluewallet" class="sc-detail"><div class="sc-software-brand"><img src="assets/img/software/bluewallet.png" alt="" width="48" height="48" loading="lazy"><h2>BlueWallet</h2></div><p>BlueWallet is a mobile Bitcoin wallet with watch-only wallets, multisig vaults, coin control, fee tools, batch transactions, hardware-wallet PSBT support, and connections to personal Electrum infrastructure. It is useful both as a spending wallet and as a watch-only interface for cold storage.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Learning on mobile with small amounts.</li><li>Monitoring hardware wallets without importing private keys.</li><li>Creating or moving PSBTs for supported air-gapped devices.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>A phone is a general-purpose internet-connected device; keep long-term savings keys on dedicated hardware.</li><li>Lightning use requires a compatible node or service configuration—understand who controls the keys and channels.</li></ul></div></div>${detailFooter(externalLink("https://bluewallet.io/"), "bluewallet")}</article>
            <article id="wasabi" class="sc-detail"><div class="sc-software-brand"><img src="assets/img/software/wasabi.svg" alt="" width="48" height="48" loading="lazy"><h2>Wasabi Wallet</h2></div><p>Wasabi is a privacy-focused desktop wallet built around the WabiSabi CoinJoin protocol, with Silent Payments support and mandatory Tor routing for every connection. It pairs advanced coin control and a full labeling system with hardware-wallet support through HWI, covering Trezor, COLDCARD, Ledger, Blockstream Jade, and BitBox02.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want CoinJoin and Tor-by-default as part of normal use, not an add-on.</li><li>Detailed coin control and labeling to avoid mixing tainted history.</li><li>Pairing a hardware signer with a privacy-first coordinator.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>No multisig or air-gapped QR signing—it's a hot-wallet coordinator, not an air-gap tool.</li><li>CoinJoin has real fees and timing trade-offs; read the docs before mixing meaningful amounts.</li></ul></div></div>${detailFooter(externalLink("https://wasabiwallet.io/"), "wasabi")}</article>
            <article id="specter" class="sc-detail"><div class="sc-software-brand"><img src="assets/img/software/specter.png" alt="" width="48" height="48" loading="lazy"><h2>Specter</h2></div><p>Specter Desktop is a multisig coordinator built specifically for air-gapped signing, connecting to your own Bitcoin Core node and pairing with one of the widest hardware-wallet lineups of any wallet on this page—SeedSigner, Specter DIY, Blockstream Jade, COLDCARD, BitBox02, Passport, Keystone, Trezor, Ledger, KeepKey, and more, several of them fully air-gapped via QR or SD card.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Multisig setups spanning several different hardware-wallet brands.</li><li>Air-gapped signing as the default workflow, not an exception.</li><li>Running against your own Bitcoin Core node over Tor.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>Desktop only—no mobile app, and no Lightning support.</li><li>Built for coordinating hardware signers, not as a general-purpose spending wallet.</li></ul></div></div>${detailFooter(externalLink("https://specter.solutions/"), "specter")}</article>
            <aside class="sc-software-key-warning mt-4" aria-labelledby="software-key-warning-title">
              <div class="sc-software-key-warning-head">
                <span class="sc-software-key-warning-mark" aria-hidden="true"><i class="bi bi-shield-exclamation"></i></span>
                <div><span class="sc-software-key-warning-kicker">Key isolation rule</span><h2 id="software-key-warning-title">Never import hardware-wallet recovery words into ordinary software</h2></div>
              </div>
              <div class="sc-software-key-warning-grid">
                <section>
                  <span class="sc-software-key-warning-label is-danger"><i class="bi bi-shield-exclamation" aria-hidden="true"></i> Why it matters</span>
                  <p>Typing the recovery phrase into an online computer turns an isolated hardware key into a software-exposed key. It defeats the protection the signer was meant to provide.</p>
                </section>
                <section>
                  <span class="sc-software-key-warning-label is-safe"><i class="bi bi-diagram-2" aria-hidden="true"></i> Connect safely</span>
                  <p>Use the connection process documented by the device maker and wallet project.</p>
                  <div class="sc-software-key-methods"><span>Hardware integration</span><a href="glossary.html#term-xpub">XPUB</a><a href="glossary.html#term-descriptor">Descriptor</a><span>Wallet file</span><a href="glossary.html#term-psbt">PSBT</a></div>
                </section>
              </div>
            </aside>
            ${sourceNote([
              ["Sparrow", "https://sparrowwallet.com/features/"],
              ["BlueWallet", "https://bluewallet.io/features/"],
              ["Electrum", "https://electrum.org/"],
              ["Nunchuk", "https://nunchuk.io/"],
              ["Cove", "https://covebitcoin.com/"],
              ["Wasabi", "https://wasabiwallet.io/"],
              ["Specter", "https://specter.solutions/"]
            ])}
          </div>
        </section>`
    },

    exchanges: {
      title: "Buying Bitcoin in Canada | Exchange & Broker Comparison",
      description: "Compare Canadian bitcoin purchase routes by custody model, CAD funding, trading tools, withdrawal workflow, and fit for self-custody.",
      content: `
        ${hero(
          "Canadian exchanges",
          `From <span class="sc-outlined-word sc-hero-fiat" data-text="FIAT"><span class="sc-word-fill">FIAT</span></span> IOUs<br><em>to true <span class="sc-outlined-word sc-hero-command-destination" data-text="BITCOIN"><span class="sc-word-fill">BITCOIN</span></span> ownership.</em>`,
          "Compare Canadian exchanges by rates, spreads, fees, custody models, and withdrawal options before taking control of your money.",
          `<a class="sc-btn sc-btn-primary" href="#exchange-compare">Compare exchanges</a>
           <a class="sc-btn sc-btn-ghost" href="guides/exchange-withdrawal.html">Withdrawal guide</a>`,
          {
            src: "assets/img/exchanges-hero.jpg",
            width: 1584,
            height: 672,
            background: true
          }
        )}

        <section class="sc-section sc-section-dark">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Two models</span><h2>Direct-to-wallet versus custodial platform</h2></div>
            <div class="row g-4 sc-path-options sc-exchange-models">
              <div class="col-lg-6"><a class="sc-card sc-path-card-link" href="#exchange-compare"><div class="sc-card-body"><div class="sc-icon"><i class="bi bi-arrow-right-circle"></i></div><h3>Direct-to-wallet broker</h3><p>You provide a wallet address and purchased bitcoin settles to that address. This reduces time held by the service but requires you to have a tested wallet first.</p><p><strong>Examples:</strong> Bull Bitcoin and Bitcoin Well describe direct self-custody purchase flows.</p><span class="sc-text-link">See comparison <i class="bi bi-arrow-right"></i></span></div></a></div>
              <div class="col-lg-6"><a class="sc-card sc-path-card-link" href="#exchange-compare"><div class="sc-card-body"><div class="sc-icon"><i class="bi bi-building-lock"></i></div><h3>Custodial exchange or app</h3><p>The platform credits bitcoin to your account and holds the keys until you withdraw. It can be convenient for trading, but account access and platform solvency remain dependencies.</p><p><strong>Examples:</strong> Shakepay, Ndax, Kraken, and Bitbuy support external withdrawals.</p><span class="sc-text-link">See comparison <i class="bi bi-arrow-right"></i></span></div></a></div>
            </div>
          </div>
        </section>

        <section id="exchange-compare" class="sc-section">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Comparison</span><h2>Choose based on the workflow you need</h2></div>
            <div class="sc-matrix-legend" aria-label="Comparison legend">
              <span><i class="sc-matrix-mark sc-matrix-yes" aria-hidden="true">&#10003;</i> Available</span>
              <span><i class="sc-matrix-mark sc-matrix-partial" aria-hidden="true">&#9680;</i> Optional or model-dependent</span>
              <span><i class="sc-matrix-mark sc-matrix-no" aria-hidden="true">&#8212;</i> Not part of the standard workflow</span>
            </div>
            <div class="sc-table-wrap">
              <table class="table sc-table sc-feature-matrix">
                <thead>
                  <tr>
                    <th scope="col">Platform</th>
                    <th scope="col">Bull Bitcoin</th>
                    <th scope="col">Bitcoin Well</th>
                    <th scope="col">Shakepay</th>
                    <th scope="col">Ndax</th>
                    <th scope="col">Kraken</th>
                    <th scope="col">Bitbuy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="sc-matrix-group"><th colspan="7">Custody and asset scope</th></tr>
                  <tr>
                    <th scope="row">Direct-to-wallet settlement</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Non-custodial by design</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Non-custodial by design</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Custodial by default; manual transfer to your own wallet</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Custodial trading platform</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Custodial exchange</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Custodial marketplace</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Bitcoin-only platform</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Also ETH and other assets</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>30+ assets</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>175+ assets, plus stocks and futures</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Dozens of assets</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Order-book / pro trading interface</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Simple quoted-rate purchase only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Simple quoted-rate purchase only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>No order books, by design</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Kraken Pro</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Bitbuy Pro</small></td>
                  </tr>

                  <tr class="sc-matrix-group"><th colspan="7">CAD funding</th></tr>
                  <tr>
                    <th scope="row">Interac e-Transfer</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Typically under 30 seconds</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>30 seconds or less</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>0% fee</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Bank wire</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Wire and Inbound Bill Payments accepted</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Via OTC desk, $10,000 minimum</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>0% fee, $10,000 minimum</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Cash / ATM access</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>160+ cash ATM locations</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Cash and debit via Canada Post</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span></td>
                  </tr>

                  <tr class="sc-matrix-group"><th colspan="7">Costs and features</th></tr>
                  <tr>
                    <th scope="row">Recurring buys (DCA)</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Recurring Interac e-Transfer</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Zero fees or spread</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Daily, weekly, or monthly, from $1</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Auto-invest</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Not listed in current fee or help docs</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Published flat trading fee</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Quoted rate/spread, not a flat published %</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Portal and ATM pricing differ</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Spread embedded in the quote</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Flat 0.20%, no tiers</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>Simple-buy vs. Pro pricing differ</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Pro: 0.50%/0.50% maker/taker; Express embeds spread</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Free or flat-fee crypto withdrawals</th>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>No separate withdrawal—bitcoin settles directly on purchase</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not part of the standard workflow">&#8212;</span><small>No separate withdrawal—bitcoin settles directly on purchase</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Free on-chain BTC mainnet and Lightning</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Flat amount, not free</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Dynamic, network-based fee</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Mixed: some assets free, BTC/ETH dynamic</small></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <aside class="sc-exchange-live-note mt-5" aria-labelledby="exchange-live-note-title">
              <div class="sc-exchange-live-signal" aria-hidden="true">
                <i class="bi bi-arrow-repeat"></i>
                <span>Live variables</span>
                <small>Changes often</small>
              </div>
              <div class="sc-exchange-live-copy">
                <span class="sc-exchange-live-eyebrow">A fair comparison needs current numbers</span>
                <h2 id="exchange-live-note-title">Prices and fees are intentionally not ranked here</h2>
                <p>Spreads, trading fees, funding fees, withdrawal charges, network fees, limits, supported assets, and provincial availability change. Check the platform's current quote and fee page before transacting.</p>
                <div class="sc-exchange-live-markers" aria-hidden="true">
                  <span class="is-orange">Spreads</span><span class="is-cream">Fees</span><span class="is-green">Limits</span><span class="is-red">Availability</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="platforms" class="sc-section">
          <div class="container">
            <div class="sc-section-head">
              <span class="sc-eyebrow">The platforms</span>
              <h2>Six Canadian routes</h2>
              <p>Direct-to-wallet brokers first, then custodial platforms. Grouped, not ranked.</p>
            </div>
            <div class="row g-4 sc-exchange-card-grid">
              <div class="col-lg-6"><article id="bullbitcoin" class="sc-detail h-100"><div class="sc-exchange-brand"><img src="assets/img/exchanges/bull-bitcoin.png" alt="" width="48" height="48" loading="lazy"><h2>Bull Bitcoin</h2></div><p>A Canadian Bitcoin-only broker that sends purchased bitcoin directly to an address you control. It supports Interac e-Transfer, larger bank transfers, recurring buys, on-chain Bitcoin, Lightning, and Liquid workflows.</p><h3>Why self-custody users consider it</h3><ul class="sc-check-list"><li>No exchange bitcoin balance to withdraw later in the normal purchase flow.</li><li>Bitcoin-focused support and direct settlement.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>The all-in quoted rate and network fee for your order size.</li><li>Your address and wallet backup before placing the order.</li></ul>${externalLink("https://www.bullbitcoin.com/buy")}</article></div>
              <div class="col-lg-6"><article id="bitcoinwell" class="sc-detail h-100"><div class="sc-exchange-brand"><img src="assets/img/exchanges/bitcoin-well.png" alt="" width="48" height="48" loading="lazy"><h2>Bitcoin Well</h2></div><p>A Canadian self-custody Bitcoin company offering an online portal, recurring buys, an OTC desk, and a network of cash ATMs. Its published model delivers purchased bitcoin to a wallet you control rather than providing custody.</p><h3>Why self-custody users consider it</h3><ul class="sc-check-list"><li>Automatic direct-to-wallet settlement.</li><li>Online, recurring, OTC, and cash purchase options.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>Online-portal and ATM pricing are different products.</li><li>Verification requirements and limits depend on the transaction method and amount.</li></ul>${externalLink("https://bitcoinwell.com/about")}</article></div>
              <div class="col-lg-6"><article id="shakepay" class="sc-detail is-custodial h-100"><div class="sc-exchange-brand"><img src="assets/img/exchanges/shakepay.png" alt="" width="48" height="48" loading="lazy"><h2>Shakepay</h2></div><p>A Canadian app focused on a simple buy, earn, and withdraw experience. Shakepay currently advertises free Bitcoin mainnet withdrawals and Lightning transfers, but bitcoin is custodial until you send it to your wallet.</p><h3>Why people consider it</h3><ul class="sc-check-list"><li>Simple onboarding, recurring buys, and Canadian app experience.</li><li>Beginner-friendly withdrawal flow.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>The effective spread in the quote even when a separate trading fee is not shown.</li><li>Current withdrawal minimums and policy before relying on free withdrawals.</li></ul>${externalLink("https://shakepay.com/bitcoin")}</article></div>
              <div class="col-lg-6"><article id="ndax" class="sc-detail is-custodial h-100"><div class="sc-exchange-brand"><img src="assets/img/exchanges/ndax.png" alt="" width="48" height="48" loading="lazy"><h2>Ndax</h2></div><p>A Canadian order-execution platform with CAD funding, an order book, multiple assets, and external withdrawals. Ndax currently publishes a flat 0.20% trading fee, while crypto withdrawals use asset-specific flat fees.</p><h3>Why people consider it</h3><ul class="sc-check-list"><li>Visible order-book workflow and posted trading fee.</li><li>CAD Interac and bank-transfer options.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>The bid-ask spread and asset withdrawal fee, not just the trading percentage.</li><li>Whether a smaller withdrawal is economical after the flat fee.</li></ul>${externalLink("https://ndax.io/en/fees")}</article></div>
              <div class="col-lg-6"><article id="kraken" class="sc-detail is-custodial h-100"><div class="sc-exchange-brand"><img src="assets/img/exchanges/kraken.png" alt="" width="48" height="48" loading="lazy"><h2>Kraken</h2></div><p>A large global exchange with Canadian CAD support, Interac e-Transfer, cards, wire transfers, Canada Post funding, simple purchases, recurring buys, and advanced Kraken Pro trading tools.</p><h3>Why people consider it</h3><ul class="sc-check-list"><li>Deep product range, liquidity, advanced order types, and broad asset support.</li><li>Multiple Canadian funding methods.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>Simple-buy pricing can differ materially from Kraken Pro.</li><li>Funding and withdrawal charges vary by method and asset.</li></ul>${externalLink("https://www.kraken.com/ca/lp/kraken-in-canada")}</article></div>
              <div class="col-lg-6"><article id="bitbuy" class="sc-detail is-custodial h-100"><div class="sc-exchange-brand"><img src="assets/img/exchanges/bitbuy.png" alt="" width="48" height="48" loading="lazy"><h2>Bitbuy</h2></div><p>A Canadian crypto marketplace offering Express and Pro trading, Interac and bank funding, external withdrawals, and multiple assets. It operates under Coinsquare Capital Markets.</p><h3>Why people consider it</h3><ul class="sc-check-list"><li>Canadian-focused onboarding and regulation.</li><li>Choice between simple quotes and a Pro interface.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>Express quotes include spread; Pro uses maker/taker pricing.</li><li>Crypto withdrawal fees can change with the asset and network.</li></ul>${externalLink("https://bitbuy.ca/en-ca/fees")}</article></div>
            </div>

            ${sourceNote([
              ["Bull Bitcoin", "https://www.bullbitcoin.com/buy"],
              ["Bitcoin Well", "https://bitcoinwell.com/about"],
              ["Shakepay", "https://shakepay.com/bitcoin"],
              ["Ndax", "https://ndax.io/en/fees"],
              ["Kraken Canada", "https://www.kraken.com/ca/lp/kraken-in-canada"],
              ["Bitbuy", "https://bitbuy.ca/en-ca/fees"]
            ])}
            <aside class="sc-exchange-next-step" aria-labelledby="exchange-next-step-title">
              <div class="sc-exchange-next-copy">
                <span class="sc-eyebrow">Next step</span>
                <h2 id="exchange-next-step-title">It isn't yours until you move it.</h2>
                <p>Bitcoin left on a platform is another IOU. The withdrawal guide walks the transfer, address check, and test send, step by step.</p>
              </div>
              <div class="sc-hero-actions sc-exchange-next-cta">
                <a class="sc-btn sc-btn-primary" href="guides/exchange-withdrawal.html">Take custody <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
              </div>
              <p class="sc-exchange-tax-note"><span class="sc-exchange-tax-icon" aria-hidden="true">i</span><span>This site does not provide tax advice; use CRA guidance or a qualified Canadian tax professional for your situation.</span></p>
            </aside>
          </div>
        </section>`
    },

    dashboard: {
      title: "Live Bitcoin Dashboard | Self Custody Canada",
      description: "Live Bitcoin dashboard: price in CAD and USD, sats per dollar, block height, fee rates, network hashrate, and the Fear & Greed index.",
      content: `
        <section class="sc-blocks-top" aria-label="Latest Bitcoin blocks">
          <div class="container sc-blocks-container">
            <div class="sc-blocks" id="dash-blocks" aria-live="polite"></div>
          </div>
        </section>

        <section class="sc-dash-hero">
          <div class="sc-dash-glow" aria-hidden="true"></div>
          <div class="container">
            <div class="sc-dash-priceblock">
              <div class="sc-dash-price-main">
                <div class="sc-dash-price-heading">
                  <h1 class="visually-hidden">Live Bitcoin Dashboard</h1>
                  <p class="sc-dash-price-label">Bitcoin price</p>
                  <div class="sc-dash-status" id="dash-status">
                    <span class="sc-live-dot" aria-hidden="true"></span>
                    <span id="dash-updated">Connecting to the network…</span>
                  </div>
                </div>
                <p class="sc-dash-price" id="dash-price"><span class="sc-dash-skel sc-dash-skel-lg"></span></p>
                <p class="sc-dash-price-sub">
                  <span id="dash-price-alt" class="sc-dash-price-alt"></span>
                  <span id="dash-change" class="sc-dash-change"></span>
                </p>
              </div>
              <div class="sc-dash-controls">
                <div class="sc-seg" role="group" aria-label="Display currency">
                  <span class="sc-seg-thumb" aria-hidden="true"></span>
                  <button type="button" class="sc-seg-btn sc-currency-btn sc-currency-cad" data-cur="CAD">CAD</button>
                  <button type="button" class="sc-seg-btn sc-currency-btn sc-currency-usd is-active" data-cur="USD">USD</button>
                </div>
                <div class="sc-seg sc-seg-ranges" role="group" aria-label="Chart time range">
                  <span class="sc-seg-thumb" aria-hidden="true"></span>
                  <button type="button" class="sc-seg-btn" data-range="24h">24H</button>
                  <button type="button" class="sc-seg-btn is-active" data-range="7d">7D</button>
                  <button type="button" class="sc-seg-btn" data-range="30d">30D</button>
                  <button type="button" class="sc-seg-btn" data-range="1y">1Y</button>
                  <button type="button" class="sc-seg-btn" data-range="3y">3Y</button>
                  <button type="button" class="sc-seg-btn" data-range="5y">5Y</button>
                  <button type="button" class="sc-seg-btn" data-range="all">ALL</button>
                </div>
              </div>
            </div>

            <div class="sc-chart" id="dash-chart">
              <svg class="sc-chart-svg" id="dash-chart-svg" aria-hidden="true" focusable="false"></svg>
              <div class="sc-chart-state is-loading" id="dash-chart-state"><span>Loading price history…</span></div>
              <div class="sc-chart-zoom-tools">
                <span class="sc-chart-zoom-hint">Scroll to zoom</span>
                <button type="button" class="sc-chart-zoom-reset" id="dash-chart-zoom-reset" aria-label="Reset zoom" hidden><i class="bi bi-arrow-counterclockwise"></i> Reset</button>
                <div class="sc-chart-zoom-pan" id="dash-chart-zoom-pan" role="scrollbar" aria-label="Move through the zoomed date range" aria-orientation="horizontal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0" hidden>
                  <span class="sc-chart-zoom-pan-track" id="dash-chart-zoom-pan-track" aria-hidden="true"><span class="sc-chart-zoom-pan-thumb" id="dash-chart-zoom-pan-thumb"></span></span>
                </div>
              </div>
              <div class="sc-chart-tip" id="dash-chart-tip" hidden></div>
            </div>
          </div>
        </section>

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head"><div class="sc-dash-section-title"><h2>THE Bitcoin Network</h2><span class="sc-dash-gears" aria-hidden="true"><i class="bi bi-gear-fill"></i><i class="bi bi-gear-fill"></i></span></div><p>A live view of Bitcoin's network metrics, supply, fees, and mining activity.</p></div>

            <div class="row g-4 sc-dash-metrics-grid">
              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-currency-bitcoin"></i></span><h3 id="dash-sats-title">Sats per dollar</h3><button type="button" class="sc-swap" id="dash-sats-swap" title="Swap units" aria-label="Swap between sats per dollar and dollars per sat"><i class="bi bi-arrow-left-right" aria-hidden="true"></i></button></div>
                    <p class="sc-dash-value" id="dash-sats">&mdash;</p>
                    <p class="sc-dash-note">What a unit of currency buys, and how close a sat is to a cent.</p>
                    <p class="sc-dash-detail"><span>Five years ago</span><strong id="dash-sats-year">&mdash;</strong></p>
                    <div class="sc-dash-parity">
                      <span>Sat-cent parity</span>
                      <div class="sc-dash-bar" aria-hidden="true"><span id="dash-sats-bar"></span></div>
                      <strong id="dash-sats-parity">&mdash;%</strong>
                    </div>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-graph-down-arrow"></i></span><h3>Drawdown from high</h3></div>
                    <p class="sc-dash-value" id="dash-drawdown">&mdash;</p>
                    <p class="sc-dash-note" id="dash-drawdown-note">Distance from the highest price ever recorded.</p>
                    <p class="sc-dash-detail"><span>All-time high</span><strong id="dash-ath">&mdash;</strong></p>
                    <p class="sc-dash-detail"><span>Previous cycle low</span><strong id="dash-cycle-low">&mdash;</strong></p>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-lightning-charge"></i></span><h3>Hashprice</h3></div>
                    <p class="sc-dash-value" id="dash-hashprice">&mdash;</p>
                    <p class="sc-dash-note">Miner revenue per petahash per day.</p>
                    <p class="sc-dash-detail"><span>Network revenue a day</span><strong id="dash-hashprice-rev">&mdash;</strong></p>
                    <p class="sc-dash-detail"><span>Issued plus fees a day</span><strong id="dash-hashprice-btc">&mdash;</strong></p>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-cpu"></i></span><h3>Network hashrate</h3></div>
                    <p class="sc-dash-value" id="dash-hashrate">&mdash;</p>
                    <p class="sc-dash-note">Current estimated mining power securing the network.</p>
                    <div class="sc-dash-spark" id="dash-hash-spark" aria-hidden="true"></div>
                    <p class="sc-dash-detail"><span>Difficulty</span><strong id="dash-current-difficulty">&mdash;</strong></p>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-arrow-repeat"></i></span><h3>Difficulty adjustment</h3></div>
                    <p class="sc-dash-value" id="dash-diffchange">—</p>
                    <p class="sc-dash-note" id="dash-diffnote">Difficulty retargets roughly every two weeks.</p>
                    <div class="sc-dash-fees is-wide" id="dash-diff-tiers"></div>
                    <div class="sc-dash-bar" aria-hidden="true"><span id="dash-diff-bar"></span></div>
                    <p class="sc-dash-eta" id="dash-diff-eta" aria-live="polite"><span>Est.</span> <strong>Calculating&hellip;</strong></p>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile sc-dash-tile-fng">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-emoji-neutral"></i></span><h3>Fear &amp; Greed</h3></div>
                    <div class="sc-gauge">
                      <svg viewBox="0 0 200 116" class="sc-gauge-svg" aria-hidden="true" focusable="false">
                        <defs>
                          <linearGradient id="scGaugeGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stop-color="#e2564a"></stop>
                            <stop offset="35%" stop-color="#e8913c"></stop>
                            <stop offset="65%" stop-color="#e5c343"></stop>
                            <stop offset="100%" stop-color="#35b48a"></stop>
                          </linearGradient>
                        </defs>
                        <path d="M18 100 A82 82 0 0 1 182 100" fill="none" stroke="rgba(255,255,255,0.09)" stroke-width="14" stroke-linecap="round"></path>
                        <path id="dash-fng-arc" d="M18 100 A82 82 0 0 1 182 100" fill="none" stroke="url(#scGaugeGrad)" stroke-width="14" stroke-linecap="round"></path>
                        <g id="dash-fng-needle" style="transform-origin:100px 100px">
                          <line x1="100" y1="100" x2="100" y2="46" stroke="var(--sc-ink)" stroke-width="3" stroke-linecap="round"></line>
                          <circle cx="100" cy="100" r="7" fill="var(--sc-ink)"></circle>
                        </g>
                      </svg>
                      <div class="sc-gauge-readout">
                        <span class="sc-gauge-value" id="dash-fng">—</span>
                        <span class="sc-gauge-label" id="dash-fng-label">Loading…</span>
                      </div>
                    </div>
                    <p class="sc-dash-note mb-0">A sentiment gauge, not a signal. Zero is extreme fear, one hundred is extreme greed.</p>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-pie-chart-fill"></i></span><h3>Supply progress</h3></div>
                    <p class="sc-dash-value" id="dash-supply">&mdash;</p>
                    <p class="sc-dash-note" id="dash-supply-note">Scheduled issuance at the current block height.</p>
                    <div class="sc-dash-fees is-wide">
                      <span><em id="dash-supply-pct">&mdash;</em>issued</span>
                      <span><em id="dash-supply-left">&mdash;</em>remaining</span>
                      <span><em id="dash-supply-day">&mdash;</em>per day</span>
                    </div>
                    <div class="sc-dash-bar" aria-hidden="true"><span id="dash-supply-bar"></span></div>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-hourglass-split"></i></span><h3>Halving countdown</h3></div>
                    <p class="sc-dash-value" id="dash-halving">&mdash;</p>
                    <p class="sc-dash-note" id="dash-halving-note">Estimated from the 10-minute block target.</p>
                    <div class="sc-dash-fees is-wide">
                      <span><em id="dash-halving-current">&mdash;</em>current</span>
                      <span><em id="dash-halving-next">&mdash;</em>next</span>
                      <span><em id="dash-halving-progress">&mdash;</em>epoch</span>
                    </div>
                    <div class="sc-dash-bar" aria-hidden="true"><span id="dash-halving-bar"></span></div>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile sc-dash-tile-mempool">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-stack"></i></span><h3>Mempool backlog</h3></div>
                    <p class="sc-dash-value" id="dash-mempool">&mdash;</p>
                    <p class="sc-dash-note" id="dash-mempool-note">Transactions waiting to be confirmed.</p>
                    <div class="sc-dash-fees is-wide">
                      <span><em id="dash-mempool-tx">&mdash;</em>transactions</span>
                      <span><em id="dash-mempool-blocks">&mdash;</em>block equiv.</span>
                      <span><em id="dash-mempool-fees">&mdash;</em>total fees</span>
                    </div>
                    <p class="sc-dash-detail"><span>Clears in, at ten minutes a block</span><strong id="dash-mempool-eta">&mdash;</strong></p>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile sc-dash-tile-averages">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-graph-up"></i></span><h3>Weekly moving averages</h3></div>
                    <p class="sc-dash-note">Two long-term weekly averages for the current Bitcoin price.</p>
                    <div class="sc-dash-average-reading">
                      <span>200-week average</span>
                      <p class="sc-dash-value" id="dash-ma200w">&mdash;</p>
                    </div>
                    <div class="sc-dash-average-reading">
                      <span>50-week average</span>
                      <p class="sc-dash-value" id="dash-ma50w">&mdash;</p>
                    </div>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-rulers"></i></span><h3>Mayer Multiple</h3></div>
                    <p class="sc-dash-value" id="dash-mayer">&mdash;</p>
                    <p class="sc-dash-note" id="dash-mayer-note">Price measured against its 200-day average.</p>
                    <p class="sc-dash-detail"><span>200-day average</span><strong id="dash-mayer-ma">&mdash;</strong></p>
                    <p class="sc-dash-detail"><span>Historic average</span><strong>about 1.4</strong></p>
                  </div>
                </article>
              </div>

              <div class="col-md-6 col-lg-4">
                <article class="sc-card sc-dash-tile">
                  <div class="sc-card-body">
                    <div class="sc-dash-tile-head"><span class="sc-dash-tile-icon"><i class="bi bi-pie-chart"></i></span><h3>Fees share of reward</h3></div>
                    <p class="sc-dash-value" id="dash-feeshare">&mdash;</p>
                    <p class="sc-dash-note">Fee share of miner revenue across the latest 15 blocks.</p>
                    <p class="sc-dash-detail"><span>Fees per block</span><strong id="dash-feeshare-fees">&mdash;</strong></p>
                    <p class="sc-dash-detail"><span>Block subsidy</span><strong id="dash-feeshare-subsidy">&mdash;</strong></p>
                  </div>
                </article>
              </div>
            </div>
            <p class="sc-source-note">Live data from <a href="https://mempool.space/" target="_blank" rel="noopener noreferrer">mempool.space</a> and the <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer">Fear &amp; Greed index</a>. Figures are informational only, refresh automatically, and may lag the chain by a few moments. Always verify anything that matters against your own node.</p>
          </div>
        </section>`
    },

    contact: {
      title: "Contact & Setup Support | Self Custody Canada",
      description: "Book a free 20-minute discovery call, explore packages and hourly sessions, or email us directly with questions about wallets, devices, and recovery planning.",
      content: `
        ${hero(
          "Contact",
          `Ask your questions while protecting<br><em><span class="sc-hero-flip" aria-live="polite" data-flip-phrases='["your PIN","your private key","your passphrase","your backup","your personal info"]'><span class="sc-hero-flip-item is-active">your PIN</span></span></em>`,
          "Practical one-on-one guidance for people who want a second set of eyes while choosing tools, planning backups, or rehearsing a transaction—without handing over control.",
          `<a class="sc-btn sc-btn-primary" href="#book">Book a free call</a>
           <a class="sc-btn sc-btn-ghost" href="#packages">See packages</a>`,
          {
            src: "assets/img/hero-lock.webp",
            alt: "A padlock securing a hasp, graded in the site's brand orange",
            width: 2400,
            height: 1590
          }
        )}

        <section id="packages" class="sc-section">
          <div class="container">
            <div class="sc-section-head centered"><span class="sc-eyebrow">Packages</span><h2>By the hour,<br>or complete packages</h2><p>Every package starts with a free discovery call, so scope is agreed before anything is booked or paid for.</p></div>
            <div class="row g-4 justify-content-center sc-path-options">
              ${pricingCard({
                badge: "Most flexible",
                title: "Hourly 1:1",
                price: "Contact for current rate",
                priceNote: "billed per hour",
                sessions: "As many hours as you need",
                text: "For a focused question that doesn't need a full package—one topic, one session, booked directly after your free discovery call.",
                features: [
                  "Wallet comparison and recommendation for your situation",
                  "A guided setup checkpoint on a device you already own",
                  "A backup or recovery process review",
                  "A single test-transaction walkthrough"
                ],
                href: "#book",
                linkText: "Book an hourly session"
              })}
              ${pricingCard({
                title: "New Wallet Setup — Single Sig",
                price: "Contact for current rate",
                priceNote: "quoted after your free discovery call",
                text: "Choose, set up, and stress-test a single-signature hardware wallet—from first purchase decision to a proven, working setup.",
                features: [
                  "Wallet shortlist based on your goals and budget",
                  "Guided device setup, walked through step by step",
                  "Passphrase planning and a full recovery rehearsal",
                  "First test transaction, verified on-device"
                ],
                href: "#book",
                linkText: "Start single sig setup"
              })}
              ${pricingCard({
                title: "New Wallet Setup — Multisig",
                price: "Contact for current rate",
                priceNote: "quoted after your free discovery call",
                text: "For larger balances or multiple keys: a multisig quorum you understand and can operate confidently.",
                features: [
                  "Multisig quorum and key/device diversity design",
                  "Key and location mapping across signers",
                  "Recovery drill across multiple keys",
                  "Written summary of the quorum and signing procedure"
                ],
                href: "#book",
                linkText: "Start multisig setup"
              })}
            </div>
          </div>
        </section>

        <section class="sc-section sc-section-muted">
          <div class="container">
            <div class="row g-5 align-items-center">
              <div class="col-lg-7">
                <span class="sc-eyebrow">No pressure, no pitch</span>
                <h2>Start with a free 20-minute discovery call</h2>
                <p>Before any package or paid session, we get on a short call to understand what you're trying to accomplish, what you already own, and whether we're a good fit. There's no obligation, no sales pressure, and we never ask for recovery words, keys, or account access on this call or any other.</p>
                <div class="sc-hero-actions"><a class="sc-btn sc-btn-primary" href="#book">Book a free call</a></div>
              </div>
              <div class="col-lg-5">
                <div class="sc-callout h-100"><h3 class="mt-0">What the call covers</h3><ul class="sc-check-list"><li>Your goals, balance range, and experience level.</li><li>Which devices or software you already have.</li><li>Whether a package, a single hourly session, or just a guide article is the right fit.</li><li>A plain answer if we're not the right fit for what you need.</li></ul></div>
              </div>
            </div>
          </div>
        </section>

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head centered"><span class="sc-eyebrow">Topics we cover</span><h2>Bring any of these to a session</h2><p>Packages bundle sessions toward one outcome; hourly sessions below can focus on just one of these.</p></div>
            <div class="sc-tags sc-tags-lg justify-content-center">
              <span class="sc-tag">Hardware wallet selection</span>
              <span class="sc-tag">Seed generation</span>
              <span class="sc-tag">Guided device setup</span>
              <span class="sc-tag">Recovery word backups</span>
              ${renderGlossaryTag("Passphrases")}
              <span class="sc-tag">Test transactions</span>
              <span class="sc-tag">Software wallet comparison</span>
              <span class="sc-tag">Multisig planning</span>
              <span class="sc-tag">Privacy basics</span>
              <span class="sc-tag">Seed and device authenticity checks</span>
              <span class="sc-tag">Exchange withdrawal walkthroughs</span>
              <span class="sc-tag">Recovery rehearsal / drills</span>
            </div>
          </div>
        </section>

        <section class="sc-section sc-section-muted">
          <div class="container">
            <div class="row g-5 align-items-center">
              <div class="col-lg-6">
                <span class="sc-eyebrow">Prefer to pay as you go?</span>
                <h2>Hourly 1:1 sessions</h2>
                <p>For a focused question that doesn't need a full package—one topic, one session, booked directly after your free discovery call.</p>
                <p class="sc-price">Contact for current rate<small>billed per hour</small></p>
                <div class="sc-hero-actions"><a class="sc-btn sc-btn-primary" href="#book">Book a free call</a></div>
              </div>
              <div class="col-lg-6">
                <div class="sc-callout h-100"><h3 class="mt-0">What a typical hour covers</h3><ul class="sc-check-list"><li>Wallet comparison and recommendation for your situation.</li><li>A guided setup checkpoint on a device you already own.</li><li>A backup or recovery process review.</li><li>A single test-transaction walkthrough.</li></ul><p class="sc-source-note mb-0">Larger topics (full setup, recovery rehearsal, multisig) usually take more than one hour—see the packages above.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="boundaries" class="sc-section">
          <div class="container">
            <div class="sc-section-head centered"><span class="sc-eyebrow">Before you reach out</span><h2>What to expect, and what to have ready</h2><p>Whether you book a call or email us, having this ready up front saves time.</p></div>
            <div class="row g-5">
              <div class="col-lg-4"><div class="sc-detail h-100"><h2>What we do</h2><ul class="sc-check-list"><li>Teach concepts in plain language.</li><li>Use official vendor documentation and test amounts.</li><li>Help you compare trade-offs and document decisions.</li><li>Guide you while you operate your own devices.</li><li>Review a recovery process without collecting secrets.</li></ul></div></div>
              <div class="col-lg-4"><div class="sc-detail h-100"><h2>What we avoid</h2><ul class="sc-caution-list"><li>Your recovery words, private keys, PIN, passphrase, or wallet backup file.</li><li>Remote control of a funded wallet or exchange account.</li><li>A "verification" transaction to an address we provide.</li><li>Permission to hold, move, or trade bitcoin for you.</li><li>A percentage of your assets or transaction.</li><li>Access to tax, legal, or investment decisions outside educational scope.</li></ul></div></div>
              <div class="col-lg-4">
                <div class="sc-detail h-100">
                  <h2>Helpful notes</h2>
                  <ul class="sc-check-list">
                    <li>Your goal: first withdrawal, wallet selection, recovery rehearsal, multisig plan, or another specific outcome.</li>
                    <li>Your experience level and whether you have completed a Bitcoin transaction before.</li>
                    <li>The device and wallet-software names you are considering or already use.</li>
                    <li>Your computer or phone platform, without serial numbers or account details.</li>
                  </ul>
                  <div class="sc-hero-actions mt-3"><a class="sc-btn sc-btn-primary" href="mailto:info@selfcustody.ca?subject=Self-custody%20question">Email <i class="bi bi-envelope"></i></a></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="sc-section sc-section-muted">
          <div class="container">
            <div class="sc-section-head centered"><span class="sc-eyebrow">Quick answers</span><h2>Common questions</h2></div>
            <div class="row g-4">
              <div class="col-md-6"><article class="sc-detail h-100"><h3 class="mt-0">Can you recover lost recovery words?</h3><p>No. A legitimate helper cannot recreate unknown keys or bypass Bitcoin cryptography. Anyone promising guaranteed recovery may be attempting to steal additional information or payment.</p></article></div>
              <div class="col-md-6"><article class="sc-detail h-100"><h3 class="mt-0">Can you choose the best wallet for me?</h3><p>We can compare options against your needs and explain trade-offs. The final decision and custody responsibility stay with you.</p></article></div>
              <div class="col-md-6"><article class="sc-detail h-100"><h3 class="mt-0">Do you hold bitcoin for clients?</h3><p>No. The purpose is to help you understand and operate your own setup. We do not accept custody, execute trades, or take control of wallets.</p></article></div>
              <div class="col-md-6"><article class="sc-detail h-100"><h3 class="mt-0">Is this financial, legal, or tax advice?</h3><p>No. The site is educational. Use a qualified professional for investment, tax, estate, and legal decisions.</p></article></div>
            </div>
          </div>
        </section>

        <section id="book" class="sc-section">
          <div class="container">
            <div class="sc-section-head centered"><span class="sc-eyebrow">Ready when you are</span><h2>Pick a time for your free call</h2></div>
            <div class="row justify-content-center"><div class="col-lg-8">
              <div class="sc-callout text-center">
                <!-- TODO: replace href="#" with your real Calendly (or other booking tool) link -->
                <div class="sc-hero-actions"><a class="sc-btn sc-btn-primary" href="#">Open booking calendar <i class="bi bi-arrow-right"></i></a></div>
                <p class="sc-source-note mb-0">Prefer email? Use the form above and we'll reply directly.</p>
              </div>
            </div></div>
          </div>
        </section>`
    }
  };

  pages.glossary = {
    title: "Glossary | SelfCustody.ca",
    description: "Search more than 500 Bitcoin, mining, wallet, privacy, market, and self-custody terms.",
    content: `
      ${hero(
        "Bitcoin reference",
        "The <em>Bitcoin</em> Glossary.",
        "Search the language of Bitcoin, from addresses and air gaps to xpubs and zero-knowledge proofs.",
        "",
        {
          src: "assets/img/glossary-hero.jpg",
          alt: "",
          width: 1570,
          height: 656,
          background: true
        }
      )}

      <section class="sc-section sc-glossary" data-glossary>
        <div class="container">
          <div class="sc-glossary-tools">
            <div class="sc-glossary-search-wrap">
              <span class="sc-glossary-search-icon" aria-hidden="true"></span>
              <label class="visually-hidden" for="glossary-search">Search the Bitcoin glossary</label>
              <input id="glossary-search" class="sc-glossary-search" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="Search a term, definition, or category…" data-glossary-search>
              <button class="sc-glossary-clear" type="button" data-glossary-clear hidden>Clear</button>
            </div>
            <div class="sc-glossary-meta">
              <p class="sc-glossary-count" data-glossary-count aria-live="polite">Loading the lexicon…</p>
              <div class="sc-glossary-letters" data-glossary-letters aria-label="Filter glossary by first letter"></div>
            </div>
          </div>

          <div class="sc-glossary-status" data-glossary-status role="status">
            <span class="sc-glossary-loader" aria-hidden="true"></span>
            <p>Loading more than 500 Bitcoin terms…</p>
          </div>
          <div class="sc-glossary-grid" data-glossary-results hidden></div>

          <div class="sc-glossary-empty" data-glossary-empty hidden>
            <span class="sc-eyebrow">No exact match</span>
            <h2>Try a shorter or broader search.</h2>
            <p>You can search by term, definition, example, or category.</p>
          </div>

          <noscript>
            <div class="sc-callout"><h2>JavaScript is needed for the glossary</h2><p>The term catalogue is loaded from the public BTC Lexicon API so it can remain current.</p></div>
          </noscript>

          <footer class="sc-glossary-source">
            <p><strong>Reference.</strong> The core term catalogue is provided by the public <a href="https://btclexicon.com/api/v2/terms" target="_blank" rel="noopener noreferrer">BTC Lexicon API</a>, as featured by <a href="https://timechainstats.com/" target="_blank" rel="noopener noreferrer">TimechainStats.com</a>. Additional entries are researched and written by SelfCustody.ca from primary specifications, official documentation, and public security guidance.</p>
          </footer>
        </div>
      </section>`
  };

  /* Temporary holding page. Keep the full contact-page definition above in
     place so it can be restored when booking and support are ready to open. */
  pages.contact = {
    title: "Contact | SelfCustody.ca",
    description: "Contact and setup support for SelfCustody.ca.",
    content: `
      <section class="sc-coming-soon" aria-labelledby="coming-soon-title">
        <div class="sc-coming-soon-inner">
          <h1 id="coming-soon-title">Coming soon</h1>
          <figure class="sc-coming-soon-mark">
            <img src="assets/img/self-custody-symbol.svg" alt="Self Custody four-circle logo" width="920" height="320">
          </figure>
        </div>
      </section>`
  };

  /* Nav slot reserved ahead of the store existing. Swap this for the real
     product grid when there is one -- the nav position and routes entry
     shouldn't need to change either way. noindex in the <head> until then. */
  pages.merch = {
    title: "Merch | SelfCustody.ca",
    description: "Merch for SelfCustody.ca.",
    content: `
      <section class="sc-coming-soon" aria-labelledby="coming-soon-title">
        <div class="sc-coming-soon-inner">
          <h1 id="coming-soon-title">Coming soon</h1>
          <figure class="sc-coming-soon-mark">
            <img src="assets/img/self-custody-symbol.svg" alt="Self Custody four-circle logo" width="920" height="320">
          </figure>
        </div>
      </section>`
  };

  /* `base` is the prefix that gets from the page back to docs/ -- "" for the
     pages at the root, "../" for everything under docs/guides/. Pages there
     are otherwise identical, so the whole difference is threaded through here
     rather than duplicated into a second header. */
  const renderHeader = (pageKey, base = "") => {
    const links = routes.map(([key, label, href]) => {
      if (["software", "exchanges"].includes(key)) return "";
      if (key === "guides") {
        const menuActive = pageKey === "guides" ? "active" : "";
        const items = guideCategories
          .map(cat => {
            /* "Start here" is the hub's first section, so everything above
               it -- the hero and the finder -- is part of starting. It gets
               the top of the page rather than a jump past them; the rest
               stay jump links to their own section. */
            const target = cat.key === "fundamentals" ? `${base}guides.html` : `${base}guides.html#${cat.key}`;
            return `<li><a href="${target}">${cat.label}</a></li>`;
          })
          .join("\n            ");
        /* Same shape as Compare: the label only opens the list. The hub
           itself is still one click away as "Start here", the first item
           in the list, so nothing needs the label to be a link too. */
        return `<li class="sc-nav-menu">
          <button class="sc-nav-menu-toggle ${menuActive}" type="button" aria-expanded="false" aria-haspopup="true">
            <span>Guides</span><span class="sc-nav-menu-chevron" aria-hidden="true"></span>
          </button>
          <ul class="sc-nav-submenu">
            ${items}
          </ul>
        </li>`;
      }
      if (key === "devices") {
        const compareKeys = ["devices", "software", "exchanges"];
        const menuActive = compareKeys.includes(pageKey) ? "active" : "";
        const compareLink = (routeKey, routeLabel, routeHref) => {
          const active = pageKey === routeKey ? "active" : "";
          return `<li><a class="${active}" href="${base}${routeHref}"${active ? ' aria-current="page"' : ""}>${routeLabel}</a></li>`;
        };
        return `<li class="sc-nav-menu">
          <button class="sc-nav-menu-toggle ${menuActive}" type="button" aria-expanded="false" aria-haspopup="true">
            <span>Compare</span><span class="sc-nav-menu-chevron" aria-hidden="true"></span>
          </button>
          <ul class="sc-nav-submenu">
            ${compareLink("devices", "Devices", "devices.html")}
            ${compareLink("software", "Software", "software.html")}
            ${compareLink("exchanges", "Exchanges", "exchanges.html")}
          </ul>
        </li>`;
      }
      const active = key === pageKey ? "active" : "";
      const contactClass = key === "contact" ? "sc-contact-link" : "";
      return `<li><a class="${active} ${contactClass}" href="${base}${href}"><span>${label}</span></a></li>`;
    }).join("");

    return `
      <a class="sc-skip-link" href="#main-content">Skip to main content</a>
      <header id="header" class="fixed-top">
        <div class="container d-flex align-items-center">
          <a class="sc-brand me-auto" href="${base}index.html" aria-label="Self Custody home">
            <span class="sc-brand-mark" aria-hidden="true"></span>
            <span class="sc-brand-name">SELF CUSTODY</span>
            <span class="sc-brand-domain" aria-hidden="true"><span class="sc-brand-domain-text">.CA</span></span>
          </a>
          <nav id="navbar" class="navbar" aria-label="Primary navigation">
            <ul>${links}</ul>
            <i class="bi bi-list mobile-nav-toggle" aria-label="Open navigation" role="button" tabindex="0"></i>
          </nav>
        </div>
      </header>`;
  };

  const renderFooter = (base = "") => `
    <footer class="sc-footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-5">
            <h3 class="sc-footer-brand"><img src="${base}assets/img/self-custody-favicon.svg" alt="" width="34" height="34"><span>SelfCustody.ca</span></h3>
            <p>Clear, practical guidance to self custody your bitcoin. Learn the basics, test your backups, and keep control of your keys.</p>
          </div>
          <div class="col-12 col-lg-4 sc-footer-explore">
            <h4>Explore</h4>
            <ul class="sc-footer-links sc-footer-links-grid">
              ${routes.map(([, label, href]) => `<li><a href="${base}${href}">${label}</a></li>`).join("\n              ")}
            </ul>
          </div>
          <div class="col-lg-3">
            <aside class="sc-footer-warning" aria-label="Important security warning">
              <div class="sc-footer-warning-icon" aria-hidden="true"><i class="bi bi-shield-exclamation"></i></div>
              <h4>Important!</h4>
              <p><strong>NEVER</strong> share recovery words, private keys, PINs, or passphrases. This site provides education, not financial, tax, or legal advice.</p>
            </aside>
          </div>
        </div>
        <div class="sc-footer-bottom d-flex flex-wrap justify-content-between gap-2">
          <span>© <span data-year>${currentYear}</span> SelfCustody.ca</span>
          <span><a href="mailto:info@selfcustody.ca">info@selfcustody.ca</a></span>
        </div>
      </div>
    </footer>`;

export { routes, pages, renderHeader, renderFooter };

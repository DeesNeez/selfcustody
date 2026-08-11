(() => {
  "use strict";

  const pageKey = document.body.dataset.page || "home";
  const currentYear = new Date().getFullYear();

  const routes = [
    ["home", "Home", "index.html"],
    ["guides", "Guides", "guides.html"],
    ["devices", "Devices", "devices.html"],
    ["software", "Software", "software.html"],
    ["exchanges", "Exchanges", "exchanges.html"],
    ["dashboard", "Dashboard", "dashboard.html"],
    ["contact", "Get Help", "contact.html"]
  ];

  const externalLink = (url, label = "Official site") =>
    `<a class="sc-text-link" href="${url}" target="_blank" rel="noopener">${label} <i class="bi bi-arrow-up-right"></i></a>`;

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

  const productCard = ({ image, imageAlt, imageWidth, imageHeight, icon = "bi-usb-drive", title, text, tags, href }) => `
    <div class="col-md-6 col-xl-4">
      <a class="sc-card sc-product-card sc-path-card-link" href="${href}">
        <div class="sc-product-image">
          ${image
            ? `<img src="${image}" alt="${imageAlt || title}" width="${imageWidth}" height="${imageHeight}" loading="lazy">`
            : `<div class="sc-icon mb-0"><i class="bi ${icon}"></i></div>`}
        </div>
        <div class="sc-card-body">
          <h3>${title}</h3>
          <p>${text}</p>
          <div class="sc-tags">${tags.map(tag => `<span class="sc-tag">${tag}</span>`).join("")}</div>
          <span class="sc-text-link">Read details <i class="bi bi-arrow-right"></i></span>
        </div>
      </a>
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
      title: "SelfCustody.ca",
      description: "Clear, practical guidance for learning how to buy bitcoin, choose a wallet, protect recovery material, and withdraw to self custody.",
      content: `
        ${hero(
          "",
          `<span class="sc-hero-command-line"><span class="sc-neon-sign sc-neon-sign-exit">EXIT</span><span class="sc-outlined-word sc-hero-fiat" data-text="FIAT"><span class="sc-word-fill">FIAT</span></span></span>
           <span class="sc-hero-command-line"><span class="sc-neon-sign sc-neon-sign-enter">ENTER</span><span class="sc-outlined-word sc-hero-command-destination" data-text="BITCOIN"><span class="sc-word-fill">BITCOIN</span></span></span>`,
          "<span class=\"sc-home-lead-statement\">Your keys, your bitcoin.</span><br class=\"sc-mobile-lead-break\"> Learn how to buy it, move it,<br class=\"sc-medium-lead-break\"> and<br class=\"sc-tablet-lead-break\"> protect it without turning security into a full time job.",
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

        <section class="sc-cta">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-md-8"><h2>Ready to build your setup?</h2><p>Use the guides first, then compare tools once you know what problem each tool needs to solve.</p></div>
              <div class="col-md-4 text-md-end"><a class="sc-btn" href="guides.html"><span>Open the guides</span></a></div>
            </div>
          </div>
        </section>`
    },

    guides: {
      title: "Guides | Self Custody Canada",
      description: "A practical, step-by-step learning path for buying bitcoin, setting up a wallet, withdrawing safely, testing recovery, and maintaining self-custody.",
      content: `
        ${hero(
          "Practical learning path",
          "Learn the system,<br><em>not just the buttons.</em>",
          "A complete beginner-to-confident-owner path. Work through it in order, use small amounts, and stop whenever a step is not clear.",
          `<a class="sc-btn sc-btn-primary" href="#path">Step one</a>
           <a class="sc-btn sc-btn-ghost" href="contact.html">Get help</a>`,
          {
            src: "assets/img/education-library.jpeg",
            alt: "Bookshelves and a reading lamp in a quiet library",
            width: 1600,
            height: 2400
          }
        )}

        <section id="path" class="sc-section">
          <div class="container">
            <div class="sc-section-head">
              <span class="sc-eyebrow">The complete path</span>
              <h2>Five steps from exchange account to tested self-custody</h2>
              <p>Each step has one outcome. Do not move on until you can explain that outcome in your own words.</p>
            </div>

            <article class="sc-detail">
              <div class="row g-4">
                <div class="col-lg-4"><span class="sc-step-number">1</span><h2 class="mt-3">Understand what you own</h2></div>
                <div class="col-lg-8">
                  <p>A bitcoin wallet does not hold coins like a physical wallet. It manages keys and constructs transactions. The network records bitcoin outputs; your keys authorize spending them.</p>
                  <h3>Know these terms</h3>
                  <ul class="sc-check-list">
                    <li><strong>Private key:</strong> the secret that authorizes a spend.</li>
                    <li><strong>Recovery words:</strong> human-readable backup material from which wallet keys can be recreated.</li>
                    <li><strong>Address:</strong> a destination you can share to receive bitcoin.</li>
                    <li><strong>UTXO:</strong> an individual chunk of bitcoin your wallet can spend.</li>
                  </ul>
                </div>
              </div>
            </article>

            <article class="sc-detail">
              <div class="row g-4">
                <div class="col-lg-4"><span class="sc-step-number">2</span><h2 class="mt-3">Choose the setup</h2></div>
                <div class="col-lg-8">
                  <p>Use a mobile software wallet for learning and modest spending amounts. Use a hardware signer when you want keys isolated (air-gapped) from an internet-connected computer or phone. Consider multisig only when you can confidently back up every key and the wallet configuration.</p>
                  <div class="sc-tags"><span class="sc-tag">Mobile: convenient</span><span class="sc-tag">Hardware: air gapped keys</span><span class="sc-tag">Multisig: removes one key as a single point of failure</span></div>
                  <p><a class="sc-text-link" href="devices.html">Compare hardware <i class="bi bi-arrow-right"></i></a> &nbsp; <a class="sc-text-link" href="software.html">Compare wallet software <i class="bi bi-arrow-right"></i></a></p>
                </div>
              </div>
            </article>

            <article class="sc-detail">
              <div class="row g-4">
                <div class="col-lg-4"><span class="sc-step-number">3</span><h2 class="mt-3">Set up and back up</h2></div>
                <div class="col-lg-8">
                  <ul class="sc-check-list">
                    <li>Inspect packaging and authenticate the device using the maker's official app or process.</li>
                    <li>Generate a new wallet on the device; never use words supplied in the box.</li>
                    <li>Write the recovery words offline, in order, without photographing them.</li>
                    <li>Confirm the backup when prompted and record any passphrase policy separately.</li>
                    <li>Store device and backup separately so one theft, fire, or flood does not take both.</li>
                  </ul>
                  <div class="sc-callout mt-4"><h3>A passphrase is not a casual extra password</h3><p>A forgotten or mistyped BIP39 passphrase creates a different wallet. Use one only when you understand the recovery procedure and have a durable way to preserve it.</p></div>
                </div>
              </div>
            </article>

            <article class="sc-detail">
              <div class="row g-4">
                <div class="col-lg-4"><span class="sc-step-number">4</span><h2 class="mt-3">Withdraw carefully</h2></div>
                <div class="col-lg-8">
                  <ul class="sc-check-list">
                    <li>Create a fresh receive address in your wallet.</li>
                    <li>Verify the full address on the hardware device, not only on the computer screen.</li>
                    <li>Send a small test withdrawal and wait for confirmation.</li>
                    <li>Confirm the received transaction in your wallet before sending a larger amount.</li>
                    <li>Understand the platform fee, withdrawal fee, and Bitcoin network fee before approving.</li>
                  </ul>
                  <p class="mt-3"><a class="sc-text-link" href="exchanges.html">Compare Canadian purchase routes <i class="bi bi-arrow-right"></i></a></p>
                </div>
              </div>
            </article>

            <article class="sc-detail">
              <div class="row g-4">
                <div class="col-lg-4"><span class="sc-step-number">5</span><h2 class="mt-3">Prove you can recover</h2></div>
                <div class="col-lg-8">
                  <p>A backup you have never tested is an assumption. After the first small transaction, follow your device maker's documented recovery-check procedure or restore into a wiped spare device. Confirm the expected wallet fingerprint, addresses, or balance before relying on the setup.</p>
                  <h3>Maintain it</h3>
                  <ul class="sc-check-list">
                    <li>Review backups for legibility and environmental damage.</li>
                    <li>Keep an inheritance instruction that explains the process without exposing the secret.</li>
                    <li>Download wallet software only from official sources and verify releases when supported.</li>
                    <li>Re-evaluate single-signature versus multisig as the value and consequences change.</li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section class="sc-section sc-section-muted">
          <div class="container">
            <div class="sc-section-head centered"><span class="sc-eyebrow">Common failure modes</span><h2>What not to normalize</h2></div>
            <div class="row g-4">
              ${card("bi-camera", "Digital seed copies", "Photos, cloud notes, email drafts, printers, and ordinary password managers create copies you may not be able to track.", "#path", "Keep recovery material offline")}
              ${card("bi-box-seam", "Pre-filled recovery words", "A legitimate wallet should generate new words during setup. Words included in a package are a theft attempt.", "#path", "Generate on-device")}
              ${card("bi-arrow-left-right", "Skipping the test send", "A small test catches the wrong network, address errors, unfamiliar withdrawal screens, and fee surprises.", "#path", "Test first")}
              ${card("bi-diagram-3", "Complexity without recovery", "A sophisticated setup that nobody can restore is less secure than a simpler setup that has been tested.", "#path", "Earn complexity")}
            </div>
          </div>
        </section>`
    },

    devices: {
      title: "Hardware Wallets & Signing Devices | Self Custody Canada",
      description: "Compare current Bitcoin hardware wallets and signing devices by security model, connectivity, usability, openness, and ideal use case.",
      content: `
        ${hero(
          "Hardware wallets and signers",
          `There's many paths<br><em><span class="sc-hero-flip" aria-live="polite" data-flip-phrases='["to sovereignty.","to self custody.","to financial freedom.","to cold storage.","to peace of mind."]'><span class="sc-hero-flip-item is-active">to sovereignty.</span></span></em>`,
          "Compare the security model, transaction-review experience, backup method, connectivity, and learning curve—not just a feature count.",
          `<a class="sc-btn sc-btn-primary" href="#compare">Compare devices</a>`,
          {
            src: "assets/img/signing-device-circuit.jpeg",
            alt: "Close-up view of components on a circuit board",
            width: 2268,
            height: 1500
          }
        )}

        <section class="sc-section">
          <div class="container">
            <div class="sc-callout mb-4">
              <h2>Before choosing a brand</h2>
              <p>Buy directly from the manufacturer or a listed authorized reseller. Check tamper evidence and device authenticity, install only official firmware, and never use recovery words supplied by a seller.</p>
            </div>
            <div class="sc-callout mb-5">
              <h2>Don't blindly trust the device to generate your seed</h2>
              <p>A device's random number generator is a single component you can't independently verify. Where supported, rolling your own entropy—50+ rolls of a six-sided die—and combining it with the device's own randomness is a simple way to reduce that trust. Not every device offers this; check the details below before assuming yours does.</p>
            </div>
            <div class="sc-section-head"><span class="sc-eyebrow">Shortlist</span><h2>Nine useful reference points</h2><p>This is not a winner-takes-all ranking. Each device represents a different balance of transparency, convenience, connectivity, and operator skill.</p></div>
            <div class="row g-4 sc-path-options">
              ${productCard({
                image: "assets/img/devices/trezor-safe-7-shortlist.png",
                imageAlt: "Trezor Safe 7 hardware wallet",
                imageWidth: 560,
                imageHeight: 560,
                title: "Trezor Safe 7 Bitcoin-only",
                text: "Premium touchscreen signer with a dedicated Bitcoin-only firmware edition, open-source security, and encrypted Bluetooth.",
                tags: ["Bitcoin only", "Touchscreen", "Open source"],
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
                title: "BitBox02 Bitcoin-only",
                text: "Compact Swiss-made signer with a secure dual-chip architecture, open-source firmware, touch controls, and microSD backup.",
                tags: ["Bitcoin only", "USB-C", "microSD backup"],
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
                tags: ["Bitcoin only", "Air-gap options", "Advanced"],
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
                tags: ["Multi-asset", "USB / Bluetooth", "Certified secure element"],
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
                    <th scope="col">Trezor Safe 7<br>Bitcoin-only</th>
                    <th scope="col">Bitkey</th>
                    <th scope="col">BitBox02<br>Bitcoin-only</th>
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
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>EAL6+ plus TROPIC01</small></td>
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
                    <th scope="row">Bitcoin-only operation</th>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span><small>Locked at factory</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Plus Liquid</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">&#10003;</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional or model-dependent">&#9680;</span><small>Plus 2FA, keys, files</small></td>
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

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Detailed notes</span><h2>What each device is really optimizing for</h2></div>

            <article id="trezor" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/trezor-safe-7-detail.png" alt="Trezor Safe 7" width="660" height="1118" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Trezor Safe 7 Bitcoin-only</h2><p>Trezor's current premium model is also available as a dedicated Bitcoin-only firmware edition: same hardware as the standard Safe 7—large colour touchscreen, open-source software, two secure elements plus a security microcontroller, encrypted Bluetooth, USB-C, wireless charging—with altcoin functionality removed entirely.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want clear on-device review and a guided companion app.</li><li>Users who value an open-source design but also want phone connectivity.</li><li>Bitcoin-only holders who still want a premium touchscreen experience.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>A premium device adds features, battery, radios, and complexity that a long-term Bitcoin-only holder may not need.</li><li>Bluetooth can be disabled; decide whether convenience belongs in your threat model.</li></ul>${externalLink("https://trezor.io/trezor-safe-7-bitcoin-only")}</div>
              </div>
            </article>

            <article id="bitkey-device" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/bitkey.png" alt="Bitkey hardware key" width="320" height="363" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Bitkey</h2><p>Bitkey is Block's Bitcoin-only wallet: a hardware key, a mobile app, and a Block-held recovery key form a 2-of-3 multisignature wallet by design—no single key can move funds alone. The hardware key has an OLED display, a fingerprint sensor, connects via NFC, and charges over USB-C. Firmware, app, server code, and hardware schematics are published on GitHub under the Commons Clause license, though the firmware cannot be independently rebuilt end-to-end because it depends on a proprietary third-party fingerprint-matching library Block cannot redistribute.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want multisig-level protection without configuring it themselves.</li><li>Users who prefer a polished, guided consumer product over a DIY or advanced setup.</li><li>Anyone comfortable with Block holding one of three keys to help with recovery.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>The published code carries a Commons Clause restriction and isn't independently buildable end-to-end—source-available, not fully open source.</li><li>Recovery leans on the app, encrypted cloud backup, and social recovery rather than a single standard seed phrase.</li><li>A company-held key is a different trust model than a fully self-contained signer.</li></ul>${externalLink("https://bitkey.world/")}</div>
              </div>
            </article>

            <article id="bitbox" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/bitbox02.webp" alt="BitBox02 hardware wallet" width="1020" height="574" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>BitBox02 Bitcoin-only</h2><p>The BitBox02 Bitcoin-only edition combines open-source firmware with a secure dual-chip design, a compact OLED display, touch sliders, USB-C, and a fast microSD backup workflow. The Bitcoin-only firmware edition is locked at the factory and cannot be switched to multi-asset firmware.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want a compact, approachable Bitcoin-only device.</li><li>Users who like guided desktop software and microSD recovery.</li><li>Sparrow, Electrum, Specter, and personal-node users.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>Normal use is connected over USB-C rather than camera-based air gap.</li><li>The original BitBox02 does not work with iPhone/iPad; verify the current Nova model if iOS matters.</li></ul>${externalLink("https://bitbox.swiss/bitbox02/bitcoin-only/")}</div>
              </div>
            </article>

            <article id="jade" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/blockstream-jade-plus.png" alt="Blockstream Jade Plus" width="925" height="547" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Blockstream Jade Plus</h2><p>Jade Plus is a Bitcoin and Liquid signer with a larger display, camera, physical controls, QR signing, USB-C, Bluetooth, and SD card support. Its hardware and firmware are open source, and its security architecture uses Blockstream's virtual secure element approach.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want camera-based air-gapped signing with a modern screen.</li><li>Users who prefer auditable hardware and firmware.</li><li>Sparrow, Nunchuk, Specter, and Blockstream App workflows.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>Learn how PIN unlock, genuine check, and stateless recovery work before deciding on a backup plan.</li></ul>${externalLink("https://blockstream.com/jade/jade-plus/")}</div>
              </div>
            </article>

            <article id="coldcard" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/coldcard-q-mk5.png" alt="COLDCARD Q and Mk5 hardware wallets" width="836" height="762" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>COLDCARD Q / Mk5</h2><p>COLDCARD Q and Mk5 are Bitcoin-only signers with dual secure elements from different vendors, publicly reviewable and reproducible firmware, and some of the deepest transaction-policy controls available on a consumer signer, while still working for someone building their first air-gapped setup.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want one device that scales from a first air-gapped wallet to advanced multisig and policy rules.</li><li>Users who value dual, independently-sourced secure elements and open, reproducible firmware.</li><li>Anyone who wants microSD, NFC, and (on the Q) QR/camera air-gap options in a single signer.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>Read the docs to get the most out of its more advanced features.</li><li>Choosing between Q and Mk5 comes down to keyboard-and-camera versus a smaller, simpler form factor.</li></ul><p><a class="sc-btn sc-btn-primary mt-2" href="coinkite.html">Explore Coinkite products</a></p>${externalLink("https://coldcard.com/")}</div>
              </div>
            </article>

            <article id="passport" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/prime_light.webp" alt="Foundation Passport Prime hardware device" width="1000" height="1000" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Foundation Passport</h2><p>Passport Prime is Foundation's current device, and it is a significant change of direction from the earlier Bitcoin-only Passport. It keeps the open-source approach, the camera for QR-based air-gapped signing, and SeedQR import and export, but it is now a multi-purpose security device: alongside the Bitcoin wallet, its KeyOS firmware also handles 2FA codes, FIDO security keys, and encrypted file storage. It pairs a security processor with a secure element, adds QuantumLink Bluetooth and NFC backup Keycards, and drops the microSD slot the older model used.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want camera-based QR air-gapped signing with a large, modern touchscreen.</li><li>Anyone who wants one device for Bitcoin plus 2FA codes, security keys, and encrypted files.</li><li>Envoy companion-app workflows, including Magic Backups and Keycard recovery.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>No longer Bitcoin-only—the extra apps and radios add capability but also attack surface a single-purpose signer avoids.</li><li>Backup moves to NFC Keycards and SeedQR rather than the microSD workflow the earlier Passport used.</li><li>If you specifically want the older Bitcoin-only Passport, check availability first—Foundation's shop currently lists Passport Prime.</li></ul>${externalLink("https://foundation.xyz/passport")}</div>
              </div>
            </article>

            <article id="seedsigner" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/seedsigner.webp" alt="SeedSigner open-source hardware wallet" width="1586" height="992" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>SeedSigner</h2><p>SeedSigner is open-source, Bitcoin-only firmware that you build yourself from off-the-shelf parts—typically a Raspberry Pi Zero, a camera module, and a small screen—into a fully air-gapped, QR-code-based signer. It has no secure element and, by design, does not persist your seed on the device: you re-enter it each session from words, dice rolls, or a SeedQR.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want a fully inspectable, DIY Bitcoin-only signer built from cheap, replaceable hardware.</li><li>QR-based single-sig and multisig workflows, including stateless "amnesic" use.</li><li>Users comfortable assembling hardware and flashing firmware themselves.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>No secure element—encryption and process-level protections are a different trust model than a certified chip.</li><li>Built on commodity consumer electronics rather than purpose-built security hardware.</li><li>Re-entering your seed each session is deliberate, but means you need a reliable physical backup.</li></ul>${externalLink("https://seedsigner.com/")}</div>
              </div>
            </article>

            <article id="krux" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/krux-yahboom.png" alt="Krux running on a Yahboom K210 touchscreen device" width="312" height="440" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Krux</h2><p>Krux is open-source, Bitcoin-only firmware that turns off-the-shelf Kendryte K210 devices—such as the Yahboom K210 module or M5StickV—into air-gapped signers using QR codes or an SD card. It has no secure element; protection relies on encryption. Krux was built amnesic-first—by default it holds nothing between sessions and you load your key each time—with optional encrypted storage on the device or an SD card if you want persistence.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want a fully inspectable, DIY Bitcoin-only signer.</li><li>QR-based single-sig and multisig workflows.</li><li>Users comfortable flashing firmware and sourcing their own hardware.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>The project states it has not yet been formally audited by a third party.</li><li>No secure element—encryption-based protection is a different trust model than a certified chip.</li><li>Built on commodity consumer electronics rather than purpose-built security hardware.</li></ul>${externalLink("https://selfcustody.github.io/krux/")}</div>
              </div>
            </article>

            <article id="ledger" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/ledger-stax-face.webp" alt="Ledger Stax hardware wallet" width="504" height="480" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Ledger</h2><p>Ledger's current lineup (Nano S Plus, Nano X, Flex, Stax, and the touchscreen Nano Gen5) pairs a certified secure element—EAL5+ on the older Nano models, EAL6+ on the newer touchscreen devices—with the Ledger Live companion app. The individual apps you install are open source, but the underlying secure element operating system, BOLOS, is closed source, so the core security boundary can't be independently reviewed the way a fully open design can. Devices are multi-asset by default rather than shipping a dedicated Bitcoin-only firmware edition.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want a widely used, certified-hardware signer with a polished companion app.</li><li>Users who hold multiple assets, not just Bitcoin, on one device.</li><li>Anyone prioritizing a large ecosystem of supported apps and integrations.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>The secure element OS is closed source—you're trusting Ledger's certification, not auditing the code yourself.</li><li>No dedicated Bitcoin-only firmware edition, and no air-gapped (QR or SD card) signing path.</li><li>Ledger Recover, an opt-in cloud/social seed-backup service, has drawn criticism; it's optional and can be ignored if you self-custody your own backup.</li></ul>${externalLink("https://www.ledger.com/")}</div>
              </div>
            </article>

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
                  <div class="sc-tags"><span class="sc-tag">Dual secure elements</span><span class="sc-tag">Bitcoin only</span><span class="sc-tag">MicroSD</span><span class="sc-tag">NFC</span><span class="sc-tag">Reproducible firmware</span></div>
                  ${externalLink("https://coldcard.com/", "Official COLDCARD comparison")}
                </div>
              </div>
            </article>

            <article id="tapsigner" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/tapsigner.svg" alt="TAPSIGNER NFC Bitcoin hardware signer" width="571" height="360" loading="lazy"></div></div>
                <div class="col-lg-7">
                  <span class="sc-eyebrow">Reusable NFC signer</span><h2>TAPSIGNER</h2>
                  <p>TAPSIGNER keeps one BIP32 private key on a credit-card-sized NFC card. A compatible wallet constructs and displays the transaction; you tap the card and enter its PIN to authorize a signature.</p>
                  <h3>What it improves</h3><ul class="sc-check-list"><li>The phone does not normally hold the unencrypted master private key.</li><li>No battery, cable, or seed-word entry is required for routine signing.</li><li>Works as a single-signature key or one key in a multisig setup with compatible wallets.</li></ul>
                  <h3>The honest trade-off</h3><ul class="sc-caution-list"><li>There is no display on the card. You must trust your companion wallet to show the correct amount, destination, fee, inputs, and change.</li><li>Recovery requires the encrypted backup file, the separate printed key, and the wallet configuration. Plan and test this before funding.</li></ul>
                  ${externalLink("https://tapsigner.com/")}
                </div>
              </div>
            </article>

            <article id="satscard" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/satscard.png" alt="SATSCARD physical bearer Bitcoin card" width="2015" height="532" loading="lazy"></div></div>
                <div class="col-lg-7">
                  <span class="sc-eyebrow">Physical bearer bitcoin</span><h2>SATSCARD</h2>
                  <p>SATSCARD has ten independent slots. You verify and fund the current sealed slot, then the card can be handed to another person without an on-chain transfer. The recipient can keep it sealed, pass it again, or unseal the slot and sweep the bitcoin into a normal wallet.</p>
                  <h3>Good use cases</h3><ul class="sc-check-list"><li>Giving actual bitcoin before the recipient has chosen a wallet.</li><li>Teaching the difference between possession, a sealed key, and an on-chain transaction.</li><li>Small, deliberate physical transfers after the recipient verifies the card and funding.</li></ul>
                  <h3>Do not mistake it for</h3><ul class="sc-caution-list"><li>A debit card, Lightning tap-to-pay card, exchange account, or recommended vault for large savings.</li><li>A TAPSIGNER: SATSCARD is meant to change owners; TAPSIGNER is a reusable signing key that stays with one owner.</li><li>A reusable address after unsealing. Sweep the full balance and never fund an exposed slot again.</li></ul>
                  ${externalLink("https://satscard.com/")}
                </div>
              </div>
            </article>

            <article id="related" class="sc-detail">
              <span class="sc-eyebrow">Related tools</span><h2>OPENDIME, SEEDPLATE, COLDPOWER, and BLOCKCLOCK</h2>
              <div class="row g-4 mt-1">
                <div class="col-md-6"><h3>OPENDIME</h3><p>A small USB bearer instrument. Fund it and pass it physically while sealed; break the seal to reveal the private key and sweep. Treat possession as control.</p></div>
                <div class="col-md-6"><h3>SEEDPLATE</h3><p>A steel recovery-word backup. It improves fire and water resistance, but it does not solve theft, passphrase loss, poor storage, or an untested recovery plan.</p></div>
                <div class="col-md-6"><h3>COLDPOWER</h3><p>A 9-volt battery adapter that provides power without USB data—useful when operating a signer away from a computer port.</p></div>
                <div class="col-md-6"><h3>BLOCKCLOCK</h3><p>A Bitcoin data display for block height, price, and related network information. It is a display product, not a custody device.</p></div>
              </div>
              ${externalLink("https://coinkite.com/", "Official Coinkite product guide")}
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
          "The app builds the transaction.<br><em>The key authorizes it.</em>",
          "Wallet software shows balances, generates receive addresses, chooses coins and fees, and broadcasts transactions. A hardware signer can keep the private key outside that app.",
          `<a class="sc-btn sc-btn-primary" href="#software-compare">Compare wallets</a>
           <a class="sc-btn sc-btn-ghost" href="devices.html">Pair with hardware</a>`,
          {
            src: "assets/img/software-code-screen.jpeg",
            alt: "Blurred keyboard in the foreground with syntax-highlighted code on a laptop screen",
            width: 1600,
            height: 1067
          }
        )}

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Seven featured wallets</span><h2>Match software to the job</h2><p>Shortlisted for strong hardware-wallet support—each one pairs with most signing devices, not just one brand. Download only from the official project website. Verify signatures or release hashes where the project documents a verification process.</p></div>
            <div class="row g-4 sc-path-options">
              ${pathCard("bi-diagram-2", "Sparrow Wallet", "Desktop Bitcoin wallet with excellent PSBT, hardware, multisig, coin control, labeling, Tor, and personal-node support.", "#sparrow", "Read Sparrow notes")}
              ${pathCard("bi-people", "Nunchuk", "Mobile and desktop wallet focused on multisig, shared wallets, hardware keys, recovery planning, and optional inheritance services.", "#nunchuk", "Read Nunchuk notes")}
              ${pathCard("bi-phone", "Cove Wallet", "Bitcoin-only mobile wallet with UTXO management, labels, hardware-wallet integration, and PSBT signing over QR or NFC.", "#cove", "Read Cove notes")}
              ${pathCard("bi-lightning", "Electrum", "Long-running desktop Bitcoin wallet with SPV verification, cold-storage workflows, multisig, plugins, and hardware support.", "#electrum", "Read Electrum notes")}
              ${pathCard("bi-wallet2", "BlueWallet", "Mobile Bitcoin and Lightning wallet with watch-only monitoring, multisig vaults, coin control, and hardware-wallet PSBT support.", "#bluewallet", "Read BlueWallet notes")}
              ${pathCard("bi-shuffle", "Wasabi Wallet", "Privacy-focused desktop wallet built around CoinJoin, mandatory Tor routing, advanced coin control, and broad hardware-wallet support via HWI.", "#wasabi", "Read Wasabi notes")}
              ${pathCard("bi-diagram-3", "Specter", "Desktop multisig coordinator built for air-gapped signing, pairing with the widest range of hardware wallets of any option here.", "#specter", "Read Specter notes")}
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

        <section class="sc-section">
          <div class="container">
            <article id="sparrow" class="sc-detail"><h2>Sparrow Wallet</h2><p>Sparrow is a desktop Bitcoin wallet for users who want visibility into transactions and UTXOs. It supports single-signature and multisig policies, common script types, output descriptors, PSBTs, hardware wallets, QR signing, coin control, labeling, Tor, Bitcoin Core, and private Electrum servers.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Hardware-wallet setup and transaction review.</li><li>Coin selection, fee control, labeling, and privacy education.</li><li>Air-gapped and multisig PSBT workflows.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>A public server can learn wallet activity. Move toward your own node or private server when privacy matters.</li><li>The interface exposes more detail than a beginner mobile wallet.</li></ul></div></div>${externalLink("https://sparrowwallet.com/")}</article>
            <article id="nunchuk" class="sc-detail"><h2>Nunchuk</h2><p>Nunchuk focuses on single-signature and multisig wallets, shared access, air-gapped signing, broad hardware support, and optional assisted services such as recovery and inheritance planning. It supports products including COLDCARD, TAPSIGNER, Jade, SeedSigner, Trezor, Ledger, BitBox, Passport, and Keystone.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Families, partners, and businesses that need multi-user multisig.</li><li>People building a deliberate inheritance or assisted-recovery plan.</li><li>NFC TAPSIGNER and multiple hardware-key setups.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>Understand which features are self-serve and which depend on a paid service or platform key.</li><li>Back up the complete wallet configuration as well as every private key.</li></ul></div></div>${externalLink("https://nunchuk.io/")}</article>
            <article id="cove" class="sc-detail"><h2>Cove Wallet</h2><p>Cove is a Bitcoin-only mobile wallet designed for both straightforward on-chain use and more advanced workflows. It supports UTXO management, BIP329 labels, hardware-wallet PSBTs, and signing or wallet imports over QR and NFC.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Bitcoin-only mobile self custody.</li><li>Managing and labeling individual UTXOs.</li><li>Using supported hardware wallets through PSBT, QR, or NFC workflows.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>A phone remains a general-purpose, internet-connected device; use dedicated hardware for long-term savings keys when appropriate.</li><li>Test hardware-wallet and backup workflows with a small amount before relying on them.</li></ul></div></div>${externalLink("https://covebitcoin.com/")}</article>
            <article id="electrum" class="sc-detail"><h2>Electrum</h2><p>Electrum is a mature Bitcoin wallet whose private keys stay encrypted on the local device. It uses decentralized Electrum servers, verifies transaction history with SPV, supports watch-only cold storage, multisig, and hardware-wallet plugins, and can export keys without platform lock-in.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Users who value a mature, lightweight Bitcoin-only desktop wallet.</li><li>Watch-only and offline-signing arrangements.</li><li>Custom server and hardware integrations.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>Electrum is frequently impersonated by phishing sites. Use only electrum.org and verify downloads.</li><li>Server selection affects privacy and the trust placed in transaction information.</li></ul></div></div>${externalLink("https://electrum.org/")}</article>
            <article id="bluewallet" class="sc-detail"><h2>BlueWallet</h2><p>BlueWallet is a mobile Bitcoin wallet with watch-only wallets, multisig vaults, coin control, fee tools, batch transactions, hardware-wallet PSBT support, and connections to personal Electrum infrastructure. It is useful both as a spending wallet and as a watch-only interface for cold storage.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Learning on mobile with small amounts.</li><li>Monitoring hardware wallets without importing private keys.</li><li>Creating or moving PSBTs for supported air-gapped devices.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>A phone is a general-purpose internet-connected device; keep long-term savings keys on dedicated hardware.</li><li>Lightning use requires a compatible node or service configuration—understand who controls the keys and channels.</li></ul></div></div>${externalLink("https://bluewallet.io/")}</article>
            <article id="wasabi" class="sc-detail"><h2>Wasabi Wallet</h2><p>Wasabi is a privacy-focused desktop wallet built around the WabiSabi CoinJoin protocol, with Silent Payments support and mandatory Tor routing for every connection. It pairs advanced coin control and a full labeling system with hardware-wallet support through HWI, covering Trezor, COLDCARD, Ledger, Blockstream Jade, and BitBox02.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want CoinJoin and Tor-by-default as part of normal use, not an add-on.</li><li>Detailed coin control and labeling to avoid mixing tainted history.</li><li>Pairing a hardware signer with a privacy-first coordinator.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>No multisig or air-gapped QR signing—it's a hot-wallet coordinator, not an air-gap tool.</li><li>CoinJoin has real fees and timing trade-offs; read the docs before mixing meaningful amounts.</li></ul></div></div>${externalLink("https://wasabiwallet.io/")}</article>
            <article id="specter" class="sc-detail"><h2>Specter</h2><p>Specter Desktop is a multisig coordinator built specifically for air-gapped signing, connecting to your own Bitcoin Core node and pairing with one of the widest hardware-wallet lineups of any wallet on this page—SeedSigner, Specter DIY, Blockstream Jade, COLDCARD, BitBox02, Passport, Keystone, Trezor, Ledger, KeepKey, and more, several of them fully air-gapped via QR or SD card.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Multisig setups spanning several different hardware-wallet brands.</li><li>Air-gapped signing as the default workflow, not an exception.</li><li>Running against your own Bitcoin Core node over Tor.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>Desktop only—no mobile app, and no Lightning support.</li><li>Built for coordinating hardware signers, not as a general-purpose spending wallet.</li></ul></div></div>${externalLink("https://specter.solutions/")}</article>
            <div class="sc-callout mt-4"><h3>Never import hardware-wallet recovery words into ordinary software just to “connect” it</h3><p>Connect using the hardware integration, xpub, descriptor, wallet file, or PSBT process documented by the device maker. Typing the recovery phrase into an online computer defeats key isolation.</p></div>
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
          "Canadian purchase routes",
          "Buying is one step.<br><em>Withdrawing is the custody decision.</em>",
          "Compare brokers and exchanges by what happens after the purchase: where bitcoin sits, how it reaches your wallet, what the full cost includes, and which records you need to keep.",
          `<a class="sc-btn sc-btn-primary" href="#exchange-compare">Compare platforms</a>
           <a class="sc-btn sc-btn-ghost" href="guides.html">Withdrawal checklist</a>`
        )}

        <section class="sc-section">
          <div class="container">
            <div class="sc-callout mb-5"><h2>Prices and fees are intentionally not ranked here</h2><p>Spreads, trading fees, funding fees, withdrawal charges, network fees, limits, supported assets, and provincial availability change. Check the platform's current quote and fee page before transacting.</p></div>
            <div class="sc-section-head"><span class="sc-eyebrow">Two models</span><h2>Direct-to-wallet versus custodial platform</h2></div>
            <div class="row g-4 sc-path-options">
              <div class="col-lg-6"><a class="sc-card sc-path-card-link" href="#exchange-compare"><div class="sc-card-body"><div class="sc-icon"><i class="bi bi-arrow-right-circle"></i></div><h3>Direct-to-wallet broker</h3><p>You provide a wallet address and purchased bitcoin settles to that address. This reduces time held by the service but requires you to have a tested wallet first.</p><p><strong>Examples:</strong> Bull Bitcoin and Bitcoin Well describe direct self-custody purchase flows.</p><span class="sc-text-link">See comparison <i class="bi bi-arrow-right"></i></span></div></a></div>
              <div class="col-lg-6"><a class="sc-card sc-path-card-link" href="#exchange-compare"><div class="sc-card-body"><div class="sc-icon"><i class="bi bi-building-lock"></i></div><h3>Custodial exchange or app</h3><p>The platform credits bitcoin to your account and holds the keys until you withdraw. It can be convenient for trading, but account access and platform solvency remain dependencies.</p><p><strong>Examples:</strong> Shakepay, Ndax, Kraken, and Bitbuy support external withdrawals.</p><span class="sc-text-link">See comparison <i class="bi bi-arrow-right"></i></span></div></a></div>
            </div>
          </div>
        </section>

        <section id="exchange-compare" class="sc-section sc-section-muted">
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
          </div>
        </section>

        <section class="sc-section">
          <div class="container">
            <div class="row g-4">
              <div class="col-lg-6"><article class="sc-detail h-100"><h2>Bull Bitcoin</h2><p>A Canadian Bitcoin-only broker that sends purchased bitcoin directly to an address you control. It supports Interac e-Transfer, larger bank transfers, recurring buys, on-chain Bitcoin, Lightning, and Liquid workflows.</p><h3>Why self-custody users consider it</h3><ul class="sc-check-list"><li>No exchange bitcoin balance to withdraw later in the normal purchase flow.</li><li>Bitcoin-focused support and direct settlement.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>The all-in quoted rate and network fee for your order size.</li><li>Your address and wallet backup before placing the order.</li></ul>${externalLink("https://www.bullbitcoin.com/buy")}</article></div>
              <div class="col-lg-6"><article class="sc-detail h-100"><h2>Bitcoin Well</h2><p>A Canadian self-custody Bitcoin company offering an online portal, recurring buys, an OTC desk, and a network of cash ATMs. Its published model delivers purchased bitcoin to a wallet you control rather than providing custody.</p><h3>Why self-custody users consider it</h3><ul class="sc-check-list"><li>Automatic direct-to-wallet settlement.</li><li>Online, recurring, OTC, and cash purchase options.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>Online-portal and ATM pricing are different products.</li><li>Verification requirements and limits depend on the transaction method and amount.</li></ul>${externalLink("https://bitcoinwell.com/about")}</article></div>
              <div class="col-lg-6"><article class="sc-detail h-100"><h2>Shakepay</h2><p>A Canadian app focused on a simple buy, earn, and withdraw experience. Shakepay currently advertises free Bitcoin mainnet withdrawals and Lightning transfers, but bitcoin is custodial until you send it to your wallet.</p><h3>Why people consider it</h3><ul class="sc-check-list"><li>Simple onboarding, recurring buys, and Canadian app experience.</li><li>Beginner-friendly withdrawal flow.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>The effective spread in the quote even when a separate trading fee is not shown.</li><li>Current withdrawal minimums and policy before relying on free withdrawals.</li></ul>${externalLink("https://shakepay.com/bitcoin")}</article></div>
              <div class="col-lg-6"><article class="sc-detail h-100"><h2>Ndax</h2><p>A Canadian order-execution platform with CAD funding, an order book, multiple assets, and external withdrawals. Ndax currently publishes a flat 0.20% trading fee, while crypto withdrawals use asset-specific flat fees.</p><h3>Why people consider it</h3><ul class="sc-check-list"><li>Visible order-book workflow and posted trading fee.</li><li>CAD Interac and bank-transfer options.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>The bid-ask spread and asset withdrawal fee, not just the trading percentage.</li><li>Whether a smaller withdrawal is economical after the flat fee.</li></ul>${externalLink("https://ndax.io/en/fees")}</article></div>
              <div class="col-lg-6"><article class="sc-detail h-100"><h2>Kraken</h2><p>A large global exchange with Canadian CAD support, Interac e-Transfer, cards, wire transfers, Canada Post funding, simple purchases, recurring buys, and advanced Kraken Pro trading tools.</p><h3>Why people consider it</h3><ul class="sc-check-list"><li>Deep product range, liquidity, advanced order types, and broad asset support.</li><li>Multiple Canadian funding methods.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>Simple-buy pricing can differ materially from Kraken Pro.</li><li>Funding and withdrawal charges vary by method and asset.</li></ul>${externalLink("https://www.kraken.com/ca/lp/kraken-in-canada")}</article></div>
              <div class="col-lg-6"><article class="sc-detail h-100"><h2>Bitbuy</h2><p>A Canadian crypto marketplace offering Express and Pro trading, Interac and bank funding, external withdrawals, and multiple assets. It operates under Coinsquare Capital Markets.</p><h3>Why people consider it</h3><ul class="sc-check-list"><li>Canadian-focused onboarding and regulation.</li><li>Choice between simple quotes and a Pro interface.</li></ul><h3>Check</h3><ul class="sc-caution-list"><li>Express quotes include spread; Pro uses maker/taker pricing.</li><li>Crypto withdrawal fees can change with the asset and network.</li></ul>${externalLink("https://bitbuy.ca/en-ca/fees")}</article></div>
            </div>

            <div class="sc-callout mt-5"><h3>Canadian recordkeeping</h3><p>Keep trade confirmations, CAD funding records, withdrawal transaction IDs, wallet labels, and the CAD value at acquisition and disposal. This site does not provide tax advice; use CRA guidance or a qualified Canadian tax professional for your situation.</p></div>
            ${sourceNote([
              ["Bull Bitcoin", "https://www.bullbitcoin.com/buy"],
              ["Bitcoin Well", "https://bitcoinwell.com/about"],
              ["Shakepay", "https://shakepay.com/bitcoin"],
              ["Ndax", "https://ndax.io/en/fees"],
              ["Kraken Canada", "https://www.kraken.com/ca/lp/kraken-in-canada"],
              ["Bitbuy", "https://bitbuy.ca/en-ca/fees"]
            ])}
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
                  <button type="button" class="sc-seg-btn is-active" data-cur="CAD">CAD</button>
                  <button type="button" class="sc-seg-btn" data-cur="USD">USD</button>
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
                price: "Starting at $XXX CAD",
                priceNote: "placeholder — replace with your real price",
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
                price: "Starting at $XXX CAD",
                priceNote: "placeholder — replace with your real price",
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
              <span class="sc-tag">Passphrases</span>
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

  /* Temporary holding page. Keep the full contact-page definition above in
     place so it can be restored when booking and support are ready to open. */
  pages.contact = {
    title: "Coming Soon | Self Custody Canada",
    description: "Self Custody Canada's contact and setup-support page is coming soon.",
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

  const renderHeader = () => {
    const links = routes.map(([key, label, href]) => {
      const active = key === pageKey ? "active" : "";
      const contactClass = key === "contact" ? "sc-contact-link" : "";
      return `<li><a class="${active} ${contactClass}" href="${href}"><span>${label}</span></a></li>`;
    }).join("");

    return `
      <a class="sc-skip-link" href="#main-content">Skip to main content</a>
      <header id="header" class="fixed-top">
        <div class="container d-flex align-items-center">
          <a class="sc-brand me-auto" href="index.html" aria-label="Self Custody home">
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

  const renderFooter = () => `
    <footer class="sc-footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-5">
            <h3 class="sc-footer-brand"><img src="assets/img/self-custody-favicon.svg" alt="" width="34" height="34"><span>SelfCustody.ca</span></h3>
            <p>Clear, practical Bitcoin self custody education. Learn the system, test the recovery, and keep control of the keys.</p>
          </div>
          <div class="col-12 col-lg-4 sc-footer-explore">
            <h4>Explore</h4>
            <ul class="sc-footer-links sc-footer-links-grid">
              <li><a href="index.html">Home</a></li>
              <li><a href="guides.html">Guides</a></li>
              <li><a href="devices.html">Devices</a></li>
              <li><a href="software.html">Software</a></li>
              <li><a href="exchanges.html">Exchanges</a></li>
              <li><a href="dashboard.html">Dashboard</a></li>
              <li><a href="contact.html">Get Help</a></li>
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
          <span>© ${currentYear} SelfCustody.ca</span>
          <span><a href="mailto:info@selfcustody.ca">info@selfcustody.ca</a></span>
        </div>
      </div>
    </footer>`;

  const page = pages[pageKey] || pages.home;
  document.title = page.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", page.description);

  document.getElementById("site-header").innerHTML = renderHeader();
  document.getElementById("main-content").innerHTML = page.content;
  document.getElementById("site-footer").innerHTML = renderFooter();

  const header = document.getElementById("header");
  if ((pageKey === "home" || pageKey === "dashboard") && header) {
    let headerFadeFrame = 0;
    const updateHeaderFade = () => {
      const fadeDistance = pageKey === "dashboard" ? 100 : 160;
      const progress = Math.min(Math.max(window.scrollY / fadeDistance, 0), 1);
      header.style.setProperty("--sc-header-progress", progress.toFixed(3));
      headerFadeFrame = 0;
    };
    const requestHeaderFade = () => {
      if (!headerFadeFrame) headerFadeFrame = window.requestAnimationFrame(updateHeaderFade);
    };

    updateHeaderFade();
    window.addEventListener("scroll", requestHeaderFade, { passive: true });
  }

  if (pageKey === "home") {
    const pathSection = document.querySelector(".sc-path-section");
    const starField = pathSection?.querySelector(".sc-path-stars");
    const constellation = pathSection?.querySelector(".sc-path-constellation");
    const pathCards = [...(pathSection?.querySelectorAll(".sc-path-options .sc-card") || [])];

    const ambientStars = [
      [3, 8, 3, 0.1, 3.8], [9, 25, 2, 2.7, 4.4], [13, 40, 3, 1.8, 4.2],
      [18, 62, 2, 3.4, 4.9], [22, 13, 4, 2.6, 4.8], [27, 87, 3, 0.4, 4.1],
      [31, 73, 2, 0.9, 3.5], [36, 49, 4, 2, 5.1], [40, 18, 2, 1.3, 3.9],
      [44, 30, 3, 3.1, 4.4], [49, 66, 2, 2.4, 4.6], [52, 88, 4, 1.4, 5],
      [57, 43, 3, 0.7, 3.6], [61, 15, 2, 2.2, 3.7], [65, 76, 3, 3.7, 4.8],
      [69, 59, 4, 0.5, 4.6], [73, 93, 2, 2.5, 4.9], [77, 30, 3, 3.5, 4.1],
      [81, 10, 2, 1.9, 3.8], [85, 79, 4, 1.1, 5.2], [89, 62, 3, 1.6, 4],
      [93, 18, 2, 2.9, 3.9], [96, 49, 4, 0.2, 4.7], [6, 92, 3, 3.8, 4.3],
      [16, 52, 2, 0.6, 3.7], [25, 35, 3, 2.1, 4.5], [48, 6, 2, 3.3, 4],
      [59, 96, 3, 1.2, 4.8], [72, 46, 2, 2.8, 3.6], [91, 91, 3, 0.8, 5]
    ];

    if (starField) {
      starField.innerHTML = ambientStars.map(([x, y, size, delay, duration]) =>
        `<span style="--star-x:${x}%;--star-y:${y}%;--star-size:${size}px;--star-delay:${delay}s;--star-duration:${duration}s"></span>`
      ).join("");
    }

    const constellationPatterns = [
      {
        points: [[8, 55], [28, 34], [47, 52], [68, 22], [91, 38], [72, 75]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 4]]
      },
      {
        points: [[13, 20], [43, 10], [75, 23], [87, 52], [69, 82], [39, 91], [12, 61], [49, 49]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [0, 7], [7, 3]]
      },
      {
        points: [[10, 72], [29, 44], [50, 59], [68, 27], [91, 13], [84, 72], [58, 86]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [6, 2]]
      },
      {
        points: [[8, 46], [27, 19], [48, 35], [67, 12], [91, 36], [73, 61], [88, 84], [48, 80], [24, 66]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [5, 7], [7, 8], [8, 0]]
      }
    ];

    let activeConstellation = -1;
    const renderConstellation = index => {
      if (!constellation || index < 0) return;
      const pattern = constellationPatterns[index % constellationPatterns.length];
      const width = constellation.clientWidth || 330;
      const height = constellation.clientHeight || 170;
      const lines = pattern.edges.map(([start, end], lineIndex) => {
        const [x1, y1] = pattern.points[start];
        const [x2, y2] = pattern.points[end];
        const dx = ((x2 - x1) / 100) * width;
        const dy = ((y2 - y1) / 100) * height;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return `<span class="sc-constellation-line" style="left:${x1}%;top:${y1}%;width:${length}px;transform:rotate(${angle}deg);--line-delay:${lineIndex * 45}ms"></span>`;
      }).join("");
      const stars = pattern.points.map(([x, y], starIndex) =>
        `<span class="sc-constellation-star" style="left:${x}%;top:${y}%;--point-delay:${starIndex * 55}ms"></span>`
      ).join("");

      constellation.classList.remove("is-visible");
      constellation.innerHTML = `${lines}${stars}`;
      window.requestAnimationFrame(() => constellation.classList.add("is-visible"));
      activeConstellation = index;
    };

    const hideConstellation = () => {
      constellation?.classList.remove("is-visible");
      activeConstellation = -1;
    };

    pathCards.forEach((cardElement, index) => {
      cardElement.addEventListener("mouseenter", () => renderConstellation(index));
      cardElement.addEventListener("mouseleave", () => {
        if (!cardElement.contains(document.activeElement)) hideConstellation();
      });
      cardElement.addEventListener("focusin", () => renderConstellation(index));
      cardElement.addEventListener("focusout", () => {
        window.requestAnimationFrame(() => {
          if (!cardElement.contains(document.activeElement)) hideConstellation();
        });
      });
    });

    window.addEventListener("resize", () => {
      if (activeConstellation >= 0) renderConstellation(activeConstellation);
    });
  }

  const nav = document.getElementById("navbar");
  const toggle = document.querySelector(".mobile-nav-toggle");

  /**
   * Three classes, not two -- .navbar-mobile (structure), .sc-nav-animating
   * (arms the transition), .sc-nav-visible (the actual open/closed target).
   *
   * An earlier version used just .navbar-mobile + .sc-nav-visible, with the
   * transition declared directly on .navbar-mobile. That put the CSS
   * transition live from the instant .navbar-mobile landed -- which meant
   * it also caught the very first opacity jump, from the no-class default
   * down to 0, and tried to animate *that*. A couple of frames later
   * .sc-nav-visible retargeted it back up to 1, overriding the still-barely-
   * moved fade-to-0 before it had gone anywhere -- so the menu never
   * visibly left opacity 1 and just snapped open. Splitting "the transition
   * is armed" from "the target is visible" into two separate classes, added
   * on two separate frames, gives the browser an actual committed opacity:0
   * frame to interpolate away from.
   *
   * Two rAFs, not one, for the .sc-nav-animating add: a single rAF can
   * still land before the browser's next paint, coalescing the opacity:0
   * (structural) and transition-now-armed styles into one frame with
   * nothing to interpolate from.
   *
   * Closing removes .sc-nav-visible first (transition is still armed, so
   * the fade-out plays), then strips .sc-nav-animating and .navbar-mobile
   * together once NAV_TRANSITION_MS has passed -- doing that immediately
   * would instantly display:none the menu and cut the animation off after
   * one frame. NAV_TRANSITION_MS must match the CSS transition duration on
   * .navbar-mobile.sc-nav-animating in site-refresh.css.
   */
  const NAV_TRANSITION_MS = 280;
  let navCloseTimer = null;

  const openNav = () => {
    clearTimeout(navCloseTimer);
    nav.classList.add("navbar-mobile");
    document.body.classList.add("sc-nav-open");
    toggle.classList.remove("bi-list");
    toggle.classList.add("bi-x");
    toggle.setAttribute("aria-label", "Close navigation");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nav.classList.add("sc-nav-animating");
        nav.classList.add("sc-nav-visible");
      });
    });
  };

  const closeNav = () => {
    clearTimeout(navCloseTimer);
    nav.classList.remove("sc-nav-visible");
    toggle.classList.remove("bi-x");
    toggle.classList.add("bi-list");
    toggle.setAttribute("aria-label", "Open navigation");
    navCloseTimer = setTimeout(() => {
      nav.classList.remove("navbar-mobile", "sc-nav-animating");
      document.body.classList.remove("sc-nav-open");
      navCloseTimer = null;
    }, NAV_TRANSITION_MS);
  };

  const toggleNav = () => {
    if (nav.classList.contains("sc-nav-visible")) {
      closeNav();
    } else {
      openNav();
    }
  };

  toggle.addEventListener("click", toggleNav);
  toggle.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleNav();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("navbar-mobile")) toggleNav();
    });
  });

  /**
   * Hero headline rotation, generic across any page that has one (currently
   * home's "Say NO to ___" and contact's "...without revealing your ___").
   * Only the .sc-hero-flip span's contents rotate -- everything else in the
   * headline is static markup around it. The phrase list lives on the
   * element itself (data-flip-phrases, JSON-encoded) rather than hardcoded
   * here, so every page sharing this markup pattern gets the same rotation
   * behaviour and timing for free instead of duplicating this block. The
   * outgoing phrase drops down and out, the incoming one enters from the
   * top, both driven by CSS transitions on transform/opacity (see
   * .sc-hero-flip-item in site-refresh.css).
   */
  const heroFlip = document.querySelector(".sc-hero-flip");

  if (heroFlip) {
    const flipPhrases = JSON.parse(heroFlip.dataset.flipPhrases || "[]");

    const flipReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let flipIndex = 0;
    let flipActive = heroFlip.querySelector(".sc-hero-flip-item");

    const sizeFlipToContent = () => {
      // Fixes the container's width so it doesn't reflow (shifting the
      // trailing ".") as shorter/longer phrases rotate through. Grid
      // auto-sizing alone isn't enough: it reacts the instant a new phrase
      // is appended, before the slide animation starts, so it would jump
      // to the new width immediately rather than growing with the motion.
      const probe = flipActive.cloneNode(false);
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      probe.style.whiteSpace = "nowrap";
      heroFlip.appendChild(probe);
      let maxWidth = 0;
      flipPhrases.forEach(text => {
        probe.textContent = text;
        maxWidth = Math.max(maxWidth, probe.getBoundingClientRect().width);
      });
      heroFlip.removeChild(probe);
      heroFlip.style.width = `${Math.ceil(maxWidth)}px`;
    };

    sizeFlipToContent();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(sizeFlipToContent, 150);
    });

    const advanceFlip = () => {
      flipIndex = (flipIndex + 1) % flipPhrases.length;
      const incoming = document.createElement("span");
      incoming.className = "sc-hero-flip-item is-entering-start";
      incoming.textContent = flipPhrases[flipIndex];
      heroFlip.appendChild(incoming);

      if (flipReducedMotion) {
        flipActive.remove();
        incoming.classList.remove("is-entering-start");
        incoming.classList.add("is-active");
        flipActive = incoming;
        return;
      }

      // Flush layout so the entering item's start position (translateY(-100%),
      // transition: none) is committed before the transition is switched back
      // on below -- otherwise the browser can coalesce both class changes
      // into a single frame and the slide never renders.
      void incoming.offsetWidth;

      const outgoing = flipActive;
      outgoing.classList.remove("is-active");
      outgoing.classList.add("is-leaving");
      incoming.classList.remove("is-entering-start");
      incoming.classList.add("is-active");
      flipActive = incoming;

      outgoing.addEventListener("transitionend", () => outgoing.remove(), { once: true });
    };

    setInterval(advanceFlip, 3900);
  }


  /**
   * Live Bitcoin dashboard.
   *
   * Everything is read client-side from public, CORS-enabled endpoints --
   * there is no backend here, so each widget degrades on its own: a failed
   * request leaves that tile showing a dash instead of taking the page down.
   *
   * The price history is fetched ONCE (mempool returns hourly points for both
   * CAD and USD in a single response; USD reaches July 2010 while CAD starts
   * later. The result is then sliced in memory
   * for every range button. That is a chunkier first load in exchange for
   * range switching that costs no network round-trip at all.
   */
  if (pageKey === "dashboard") {
    const $ = id => document.getElementById(id);

    const state = {
      history: [],       // [{ t, CAD, USD }] ascending
      currency: "CAD",
      range: "7d",
      chartWindow: null,
      hover: null,
      tipHeight: null,
      blockTimers: [],
      projectedBlock: null,
      mempoolStats: null,
      mempoolSocket: null,
      socketReconnectTimer: null,
      socketReconnectMs: 2000,
      socketStopped: false,
      blockRefreshQueued: false,
      lastSocketMessageAt: null,
      /* Fed from separate requests; hashprice needs both plus the price. */
      hashrate: null,
      avgBlockFees: null,
      blockSubsidy: null
    };

    const RANGE_SECONDS = {
      "24h": 86400,
      "7d": 604800,
      "30d": 2592000,
      "1y": 31536000,
      "3y": 94608000,
      "5y": 157680000,
      "all": Infinity
    };

    const HALVING_INTERVAL = 210000;
    const DISPLAY_SUPPLY_LIMIT = 21000000;

    const fmtMoney = (v, cur) => new Intl.NumberFormat("en-CA", {
      style: "currency", currency: cur, maximumFractionDigits: 0
    }).format(v);

    const fmtMoneyPrecise = (v, cur) => new Intl.NumberFormat("en-CA", {
      style: "currency", currency: cur,
      minimumFractionDigits: v < 1000 ? 2 : 0, maximumFractionDigits: v < 1000 ? 2 : 0
    }).format(v);

    const fmtInt = v => new Intl.NumberFormat("en-CA").format(Math.round(v));

    const fmtFeeNumber = value => {
      if (value === null || value === undefined || value === "") return "—";
      const fee = Number(value);
      if (!Number.isFinite(fee)) return "—";
      return new Intl.NumberFormat("en-CA", { maximumFractionDigits: 2 }).format(fee);
    };

    const fmtFeeRate = value => {
      const formatted = fmtFeeNumber(value);
      return formatted === "—" ? formatted : formatted + " sat/vB";
    };

    /* feeRange arrives ascending and spans the projected block's cheapest to
       dearest transaction, so the ends are the range the next block is being
       built across. The low end keeps its decimals -- it is routinely under
       1 sat/vB, where they carry the whole value -- while the top end is in
       the tens or hundreds and rounds. Collapsed to one number when a single
       entry or matching ends make a span meaningless. */
    const fmtFeeSpan = range => {
      if (!Array.isArray(range) || !range.length) return "—";
      const lo = fmtFeeNumber(range[0]);
      if (lo === "—") return "—";
      if (range.length === 1) return lo;
      const top = Number(range[range.length - 1]);
      if (!Number.isFinite(top)) return "—";
      const hi = fmtInt(top);
      return lo === hi ? lo : lo + "–" + hi;
    };

    /* Maps 0..1 onto a red-yellow-green ramp: hue does the work while
       lightness climbs, so the bottom is a deep warning red and the top a
       bright green rather than both ending up the same muddy weight.
       Callers pass 0 for the "bad" end, so a scale running the other way
       (fees) just inverts its input.

       The hue is piecewise for two reasons. The midpoint has to land exactly
       on yellow (60deg), and the top has to land on 152deg rather than a
       pure 120deg green -- the site's existing positive green (#6fd8b2 and
       --sc-success) sits at hue ~158, so a 120deg green read as a different
       colour sitting next to it. Saturation and lightness are tuned to the
       same end point, which puts the top of the ramp within a few percent of
       #6fd8b2. */
    const scaleColor = t => {
      const c = Math.min(Math.max(t, 0), 1);
      const hue = c <= 0.5 ? c * 120 : 60 + (c - 0.5) * 184;
      return "hsl(" + Math.round(hue) + ", " +
        Math.round(72 - c * 15) + "%, " +
        Math.round(43 + c * 21) + "%)";
    };

    const fetchJSON = async (url, ms = 12000) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ms);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(res.status);
        return await res.json();
      } finally {
        clearTimeout(timer);
      }
    };

    const fetchText = async (url, ms = 12000) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ms);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(res.status);
        return await res.text();
      } finally {
        clearTimeout(timer);
      }
    };

    /* Count-up so refreshed numbers read as movement rather than a jump cut.
       Reduced-motion visitors get the final value immediately. */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animateValue = (el, to, format, ms = 620) => {
      if (!el) return;
      const from = Number(el.dataset.val || 0);
      el.dataset.val = String(to);
      if (reduceMotion || !from || from === to) {
        el.textContent = format(to);
        return;
      }
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / ms, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(from + (to - from) * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    /* Tint the figure green/red for a beat when it moves, then let it settle
       back to normal ink -- a permanent tint would just read as a colour
       choice rather than as "this number just changed". */
    let flashTimer = 0;
    const flash = (el, up) => {
      if (!el || reduceMotion) return;
      el.classList.remove("is-up", "is-down");
      void el.offsetWidth;
      el.classList.add(up ? "is-up" : "is-down");
      clearTimeout(flashTimer);
      flashTimer = setTimeout(() => el.classList.remove("is-up", "is-down"), 1400);
    };

    // ---------------------------------------------------------------- chart
    const chartEl = $("dash-chart");
    const svg = $("dash-chart-svg");
    const tip = $("dash-chart-tip");
    const chartState = $("dash-chart-state");
    const zoomReset = $("dash-chart-zoom-reset");
    const zoomPan = $("dash-chart-zoom-pan");
    const zoomPanTrack = $("dash-chart-zoom-pan-track");
    const zoomPanThumb = $("dash-chart-zoom-pan-thumb");
    const NS = "http://www.w3.org/2000/svg";

    let plot = null;   // geometry of the last render, for hit-testing
    let selAnchor = null;  // index a drag-to-measure started from, null when idle
    let touchCrosshairPinned = false;
    let touchTipFadeTimer = 0;
    let touchTipHideTimer = 0;

    const clearTouchTipTimers = () => {
      clearTimeout(touchTipFadeTimer);
      clearTimeout(touchTipHideTimer);
      touchTipFadeTimer = 0;
      touchTipHideTimer = 0;
    };

    const visibleSeries = () => {
      const cutoff = RANGE_SECONDS[state.range];
      const now = Math.floor(Date.now() / 1000);
      const key = state.currency;
      let pts = state.history.filter(p => p[key] > 0);
      if (state.chartWindow) {
        pts = pts.filter(p => p.t >= state.chartWindow.start && p.t <= state.chartWindow.end);
      } else if (cutoff !== Infinity) {
        pts = pts.filter(p => p.t >= now - cutoff);
      }
      if (pts.length < 2) return pts;
      /* Long ranges hold tens of thousands of hourly points; drawing them all
         costs a lot of path data for sub-pixel detail nobody can see. Stride
         down to a sane ceiling, always keeping the newest point. */
      const MAX = 800;
      if (pts.length > MAX) {
        /* Source density changes from weekly historical points to hourly
           recent points. Sampling by array stride would therefore throw
           away most early history. Pick the nearest point at evenly spaced
           timestamps so every era receives equal visual resolution. */
        const out = [pts[0]];
        const start = pts[0].t;
        const end = pts[pts.length - 1].t;
        let cursor = 1;
        for (let i = 1; i < MAX - 1; i++) {
          const target = start + (i / (MAX - 1)) * (end - start);
          while (cursor < pts.length - 1 && pts[cursor].t < target) cursor++;
          const before = pts[cursor - 1];
          const after = pts[cursor];
          const chosen = Math.abs(before.t - target) <= Math.abs(after.t - target) ? before : after;
          if (out[out.length - 1] !== chosen) out.push(chosen);
        }
        if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
        return out;
      }
      return pts;
    };

    const setChartState = (message, loading) => {
      if (!chartState) return;
      chartState.hidden = false;
      chartState.classList.toggle("is-loading", Boolean(loading));
      const label = chartState.querySelector("span");
      if (label) label.textContent = message;
      else chartState.textContent = message;
    };

    const renderChart = (animate = true) => {
      if (!svg || !chartEl) return;
      const pts = visibleSeries();
      chartEl.classList.toggle("is-zoomed", Boolean(state.chartWindow));
      if (zoomReset) zoomReset.hidden = !state.chartWindow;
      if (zoomPan) zoomPan.hidden = !state.chartWindow;
      const w = chartEl.clientWidth;
      const h = chartEl.clientHeight;
      if (!w || !h) return;

      if (pts.length < 2) {
        svg.replaceChildren();
        /* Still waiting on the one history request = shimmer. Anything else
           (empty range, dead endpoint) is a settled result, so it gets plain
           static text instead of a busy animation. */
        if (state.history.length) setChartState("No price history for this range.", false);
        else setChartState("Loading price history…", true);
        selAnchor = null;
        chartEl.classList.remove("is-measuring", "is-gain", "is-loss");
        if (tip) tip.hidden = true;
        plot = null;
        return;
      }
      if (chartState) chartState.hidden = true;

      const key = state.currency;
      /* The zoom controls live in a reserved strip rather than floating over
         data. Once zoomed, push the plot down far enough that the Reset and
         proportional pan bar can never cover the line or a hovered point. */
      const padL = 10, padR = 66, padT = state.chartWindow ? 58 : 18, padB = 28;
      const plotW = w - padL - padR;
      const plotH = h - padT - padB;

      let min = Infinity, max = -Infinity;
      for (const p of pts) {
        if (p[key] < min) min = p[key];
        if (p[key] > max) max = p[key];
      }
      const span = (max - min) || max || 1;
      min = Math.max(0, min - span * 0.08);
      max += span * 0.08;

      const minT = state.chartWindow ? state.chartWindow.start : pts[0].t;
      const maxT = state.chartWindow ? state.chartWindow.end : pts[pts.length - 1].t;
      const timeSpan = (maxT - minT) || 1;
      const x = i => padL + ((pts[i].t - minT) / timeSpan) * plotW;
      const y = v => padT + (1 - (v - min) / (max - min)) * plotH;

      const line = [];
      for (let i = 0; i < pts.length; i++) {
        line.push((i ? "L" : "M") + x(i).toFixed(1) + " " + y(pts[i][key]).toFixed(1));
      }
      const linePath = line.join(" ");
      const areaPath = linePath + " L" + x(pts.length - 1).toFixed(1) + " " + (padT + plotH) +
                       " L" + x(0).toFixed(1) + " " + (padT + plotH) + " Z";

      const rising = pts[pts.length - 1][key] >= pts[0][key];
      const stroke = rising ? "var(--sc-success)" : "#e2564a";

      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);

      const make = (tag, attrs, text) => {
        const el = document.createElementNS(NS, tag);
        for (const k in attrs) el.setAttribute(k, attrs[k]);
        if (text != null) el.textContent = text;
        return el;
      };

      const frag = document.createDocumentFragment();

      const defs = make("defs");
      const grad = make("linearGradient", { id: "scChartFill", x1: "0", y1: "0", x2: "0", y2: "1" });
      grad.append(
        make("stop", { offset: "0%", "stop-color": stroke, "stop-opacity": "0.30" }),
        make("stop", { offset: "100%", "stop-color": stroke, "stop-opacity": "0" })
      );
      defs.append(grad);
      frag.append(defs);

      // horizontal guides + right-edge price labels
      const STEPS = 4;
      for (let i = 0; i <= STEPS; i++) {
        const v = min + ((max - min) * i) / STEPS;
        const gy = y(v);
        frag.append(make("line", {
          x1: padL, y1: gy.toFixed(1), x2: (padL + plotW).toFixed(1), y2: gy.toFixed(1),
          stroke: "rgba(255,255,255,0.06)", "stroke-width": "1"
        }));
        frag.append(make("text", {
          x: (padL + plotW + 10).toFixed(1), y: (gy + 4).toFixed(1),
          fill: "var(--sc-muted)", "font-size": "11", "font-weight": "600"
        }, fmtMoney(v, key)));
      }

      // time labels along the bottom
      const labelCapacity = Math.max(3, Math.min(9, Math.floor(plotW / 130) + 1));
      const labelTargets = { "24h": 7, "7d": 7, "30d": 8, "1y": 8, "3y": 9, "5y": 9, "all": 9 };
      const LABELS = Math.min(pts.length, labelCapacity, labelTargets[state.range]);
      for (let i = 0; i < LABELS; i++) {
        const ratio = i / (LABELS - 1);
        const d = new Date((minT + ratio * timeSpan) * 1000);
        let label;
        if (timeSpan <= 172800) {
          label = d.toLocaleTimeString("en-CA", { hour: "numeric", hour12: true });
        } else if (timeSpan > 189216000) {
          label = d.toLocaleDateString("en-CA", { year: "numeric" });
        } else if (timeSpan > 7776000) {
          label = d.toLocaleDateString("en-CA", { month: "short", year: "numeric" });
        } else {
          label = d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
        }
        const tx = Math.min(Math.max(padL + ratio * plotW, padL + 18), padL + plotW - 18);
        frag.append(make("text", {
          x: tx.toFixed(1), y: (h - 8).toFixed(1), fill: "var(--sc-muted)",
          "font-size": "11", "font-weight": "600", "text-anchor": "middle"
        }, label));
      }

      frag.append(make("path", { d: areaPath, fill: "url(#scChartFill)" }));

      /* Drag-to-measure band. Sits between the area fill and the line so the
         highlight reads as behind the price rather than washing over it.
         Hidden until a drag starts. */
      const sel = make("g", { id: "scChartSel", opacity: "0" });
      const selRect = make("rect", {
        y: padT.toFixed(1), height: plotH.toFixed(1), width: "0",
        fill: "rgba(255,255,255,0.08)"
      });
      const selLine = make("line", {
        y1: padT.toFixed(1), y2: (padT + plotH).toFixed(1),
        stroke: "rgba(255,255,255,0.5)", "stroke-width": "1.5"
      });
      const selDot = make("circle", {
        r: "4.5", fill: "var(--sc-paper)", stroke: "rgba(255,255,255,0.85)", "stroke-width": "2"
      });
      sel.append(selRect, selLine, selDot);
      frag.append(sel);

      const path = make("path", {
        d: linePath, fill: "none", stroke: stroke, "stroke-width": "2.25",
        "stroke-linejoin": "round", "stroke-linecap": "round"
      });
      frag.append(path);

      // crosshair, hidden until pointer entry
      const cross = make("g", { id: "scChartCross", opacity: "0" });
      cross.append(make("line", {
        y1: padT, y2: (padT + plotH).toFixed(1), stroke: "rgba(255,255,255,0.35)",
        "stroke-width": "1", "stroke-dasharray": "3 3"
      }));
      cross.append(make("circle", { r: "5", fill: stroke, stroke: "var(--sc-paper)", "stroke-width": "2.5" }));
      frag.append(cross);

      svg.replaceChildren(frag);

      if (animate && !reduceMotion) {
        const len = path.getTotalLength();
        path.style.transition = "none";
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        void path.getBoundingClientRect();
        path.style.transition = "stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)";
        path.style.strokeDashoffset = "0";
      }

      /* A re-render replaces the SVG contents, so any live measurement is
         gone with it -- drop the anchor too or the next pointermove would
         measure from an index belonging to the previous range. */
      selAnchor = null;
      chartEl.classList.remove("is-measuring", "is-gain", "is-loss");
      if (tip) tip.hidden = true;
      plot = { pts, key, x, y, minT, maxT, padL, padR, padT, padB, plotW, plotH, w, h, cross,
               stroke, sel: { g: sel, rect: selRect, line: selLine, dot: selDot } };
      updateZoomPan();
    };

    const idxFromClientX = clientX => {
      const rect = svg.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left - plot.padL) / plot.plotW, 0), 1);
      const target = plot.minT + ratio * (plot.maxT - plot.minT);
      let lo = 0, hi = plot.pts.length - 1;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (plot.pts[mid].t < target) lo = mid + 1;
        else hi = mid;
      }
      if (lo > 0 && Math.abs(plot.pts[lo - 1].t - target) < Math.abs(plot.pts[lo].t - target)) return lo - 1;
      return lo;
    };

    const positionTipAwayFromPoint = (cx, cy, fallbackWidth) => {
      if (!tip || !plot) return;
      const gap = 16;
      const edge = 6;
      const tw = tip.offsetWidth || fallbackWidth;
      const th = tip.offsetHeight || 48;
      const left = Math.min(Math.max(cx - tw / 2, edge), plot.w - tw - edge);
      let top = cy - th - gap;
      if (top < edge) top = cy + gap;
      top = Math.min(Math.max(top, edge), plot.h - th - edge);
      tip.style.left = left + "px";
      tip.style.top = top + "px";
    };

    const moveCrosshair = clientX => {
      if (!plot) return;
      clearTouchTipTimers();
      if (tip) tip.classList.remove("is-fading");
      const idx = idxFromClientX(clientX);
      const p = plot.pts[idx];
      const cx = plot.x(idx), cy = plot.y(p[plot.key]);

      const g = plot.cross;
      g.setAttribute("opacity", "1");
      g.firstChild.setAttribute("x1", cx.toFixed(1));
      g.firstChild.setAttribute("x2", cx.toFixed(1));
      g.lastChild.setAttribute("cx", cx.toFixed(1));
      g.lastChild.setAttribute("cy", cy.toFixed(1));

      if (tip) {
        const d = new Date(p.t * 1000);
        const dateOptions = state.range === "all"
          ? { year: "numeric", month: "short", day: "numeric" }
          : { year: "numeric", month: "short", day: "numeric", hour: "numeric", hour12: true };
        tip.hidden = false;
        tip.innerHTML = "<strong>" + fmtMoneyPrecise(p[plot.key], plot.key) + "</strong><span>" +
          d.toLocaleString("en-CA", dateOptions) + "</span>";
        positionTipAwayFromPoint(cx, cy, 150);
      }
    };

    const hideCrosshair = (fade = false) => {
      touchCrosshairPinned = false;
      clearTouchTipTimers();
      if (plot) plot.cross.setAttribute("opacity", "0");
      if (!tip) return;
      if (fade && !reduceMotion && !tip.hidden) {
        tip.classList.add("is-fading");
        touchTipHideTimer = setTimeout(() => {
          tip.hidden = true;
          tip.classList.remove("is-fading");
          touchTipHideTimer = 0;
        }, 400);
      } else {
        tip.hidden = true;
        tip.classList.remove("is-fading");
      }
    };

    /* Press-and-drag measurement, the way the iOS Stocks chart works: the
       press sets an anchor, dragging measures from there to wherever the
       pointer is now, and the header chip reports that instead of the
       range's own change until the pointer is released. Works in both
       directions -- drag left from the anchor and it measures backwards. */
    const paintSelection = idx => {
      if (!plot || selAnchor === null) return;
      const s = plot.sel;
      const ax = plot.x(selAnchor), cx = plot.x(idx);
      s.g.setAttribute("opacity", "1");
      s.rect.setAttribute("x", Math.min(ax, cx).toFixed(1));
      s.rect.setAttribute("width", Math.abs(cx - ax).toFixed(1));
      s.line.setAttribute("x1", ax.toFixed(1));
      s.line.setAttribute("x2", ax.toFixed(1));
      s.dot.setAttribute("cx", ax.toFixed(1));
      s.dot.setAttribute("cy", plot.y(plot.pts[selAnchor][plot.key]).toFixed(1));

      const from = plot.pts[selAnchor][plot.key];
      const to = plot.pts[idx][plot.key];
      const diff = to - from;
      const up = diff > 0;
      const down = diff < 0;
      const tone = up ? "#35b48a" : down ? "#c94b43" : "#ff8a00";
      const wash = up ? "rgba(53,180,138,0.13)" : down ? "rgba(181,53,47,0.16)" : "rgba(255,138,0,0.11)";
      const sign = up ? "+" : down ? "-" : "";
      const pct = Math.abs(from ? (diff / from) * 100 : 0);

      s.rect.setAttribute("fill", wash);
      s.line.setAttribute("stroke", tone);
      s.dot.setAttribute("stroke", tone);
      plot.cross.lastChild.setAttribute("fill", tone);
      chartEl.classList.toggle("is-gain", up);
      chartEl.classList.toggle("is-loss", down);

      const el = $("dash-change");
      if (el) {
        el.className = "sc-dash-change is-measuring " + (up ? "is-positive" : down ? "is-negative" : "");
        el.innerHTML = "<i class=\"bi bi-arrow-" + (up ? "up-right" : down ? "down-right" : "right") + "\"></i> " +
          sign + pct.toFixed(2) + "% <span>" + sign + fmtMoney(Math.abs(diff), plot.key) + "</span>";
      }

      if (tip) {
        const dateOptions = state.range === "all"
          ? { year: "numeric", month: "short", day: "numeric" }
          : { year: "numeric", month: "short", day: "numeric", hour: "numeric", hour12: true };
        const formatPoint = p => new Date(p.t * 1000).toLocaleString("en-CA", dateOptions);
        tip.innerHTML = "<strong>" + sign + pct.toFixed(2) + "% · " + sign +
          fmtMoneyPrecise(Math.abs(diff), plot.key) + "</strong><span>" +
          formatPoint(plot.pts[selAnchor]) + " → " + formatPoint(plot.pts[idx]) + "</span>";
        positionTipAwayFromPoint(cx, plot.y(to), 210);
      }
    };

    const endSelection = (event, canceled = false) => {
      if (selAnchor === null) return;
      selAnchor = null;
      if (plot && plot.sel) plot.sel.g.setAttribute("opacity", "0");
      if (plot && plot.cross) plot.cross.lastChild.setAttribute("fill", plot.stroke);
      chartEl.classList.remove("is-measuring", "is-gain", "is-loss");
      updateChange();
      if (canceled) hideCrosshair();
      else if (event && Number.isFinite(event.clientX)) {
        moveCrosshair(event.clientX);
        /* Touch and pen devices have no hover state. Keep the released point
           briefly, restarting the timeout each time another point is used. */
        touchCrosshairPinned = event.pointerType !== "mouse";
        if (touchCrosshairPinned) {
          touchTipFadeTimer = setTimeout(() => hideCrosshair(true), 4000);
        }
      }
    };

    /* Bounds for the selected preset. Wheel zoom may move inside these
       limits, but never expands beyond the range the visitor chose. */
    const presetBounds = () => {
      const key = state.currency;
      const rows = state.history.filter(p => p[key] > 0);
      if (rows.length < 2) return null;
      const cutoff = RANGE_SECONDS[state.range];
      const end = rows[rows.length - 1].t;
      const start = cutoff === Infinity
        ? rows[0].t
        : Math.max(rows[0].t, Math.floor(Date.now() / 1000) - cutoff);
      return { start, end };
    };

    const resetChartZoom = (animate = false) => {
      if (!state.chartWindow) return;
      state.chartWindow = null;
      hideCrosshair();
      renderChart(animate);
      updateChange();
    };

    const updateZoomPan = () => {
      if (!zoomPan || !zoomPanThumb || !state.chartWindow) return;
      const bounds = presetBounds();
      if (!bounds) return;
      const baseSpan = bounds.end - bounds.start;
      const viewSpan = state.chartWindow.end - state.chartWindow.start;
      if (baseSpan <= 0 || viewSpan <= 0) return;

      const available = Math.max(baseSpan - viewSpan, 1);
      const position = Math.round(Math.min(Math.max((state.chartWindow.start - bounds.start) / available, 0), 1) * 100);
      const trackWidth = zoomPanTrack ? zoomPanTrack.clientWidth : 0;
      if (trackWidth) {
        const visibleRatio = Math.min(Math.max(viewSpan / baseSpan, 0), 1);
        const thumbWidth = Math.min(trackWidth, Math.max(18, trackWidth * visibleRatio));
        zoomPanThumb.style.width = thumbWidth + "px";
        zoomPanThumb.style.left = ((position / 100) * (trackWidth - thumbWidth)) + "px";
      }
      const date = seconds => new Date(seconds * 1000).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
      zoomPan.setAttribute("aria-valuenow", String(position));
      zoomPan.setAttribute("aria-valuetext", date(state.chartWindow.start) + " to " + date(state.chartWindow.end));
    };

    const setChartPan = ratio => {
      if (!state.chartWindow) return;
      const bounds = presetBounds();
      if (!bounds) return;
      const viewSpan = state.chartWindow.end - state.chartWindow.start;
      const available = Math.max((bounds.end - bounds.start) - viewSpan, 0);
      const start = bounds.start + Math.min(Math.max(ratio, 0), 1) * available;
      state.chartWindow = { start: Math.round(start), end: Math.round(start + viewSpan) };
      hideCrosshair();
      renderChart(false);
      updateZoomPan();
      updateChange();
    };

    const applyChartZoom = (deltaY, clientX) => {
      if (!plot || !deltaY) return;
      const bounds = presetBounds();
      if (!bounds) return;

      const baseSpan = bounds.end - bounds.start;
      const currentStart = state.chartWindow ? state.chartWindow.start : plot.minT;
      const currentEnd = state.chartWindow ? state.chartWindow.end : plot.maxT;
      const currentSpan = currentEnd - currentStart;
      if (baseSpan <= 0 || currentSpan <= 0) return;

      const rect = svg.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left - plot.padL) / plot.plotW, 0), 1);
      const anchor = currentStart + ratio * currentSpan;
      const pointStep = currentSpan / Math.max(plot.pts.length - 1, 1);
      const minSpan = Math.min(baseSpan, Math.max(21600, pointStep * 4));
      const normalizedDelta = Math.min(Math.max(deltaY, -240), 240);
      const factor = Math.exp(normalizedDelta * 0.0018);
      const nextSpan = Math.min(baseSpan, Math.max(minSpan, currentSpan * factor));

      if (nextSpan >= baseSpan * 0.995) {
        resetChartZoom(false);
        return;
      }
      if (Math.abs(nextSpan - currentSpan) < 1) return;

      let start = anchor - ratio * nextSpan;
      let end = start + nextSpan;
      if (start < bounds.start) {
        end += bounds.start - start;
        start = bounds.start;
      }
      if (end > bounds.end) {
        start -= end - bounds.end;
        end = bounds.end;
      }

      state.chartWindow = { start: Math.round(start), end: Math.round(end) };
      renderChart(false);
      updateZoomPan();
      updateChange();
      moveCrosshair(clientX);
    };

    let zoomRaf = 0;
    let zoomDelta = 0;
    let zoomClientX = 0;

    if (svg) {
      svg.addEventListener("pointerdown", e => {
        if (!plot) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        touchCrosshairPinned = false;
        selAnchor = idxFromClientX(e.clientX);
        chartEl.classList.add("is-measuring");
        chartEl.classList.remove("is-gain", "is-loss");
        /* Capture so a drag that leaves the SVG keeps reporting, and so the
           release is heard even if it happens outside the chart. Guarded
           because setPointerCapture throws if the pointer is already gone by
           the time this runs -- without the guard that throw would skip the
           two paint calls below and the band would not appear until the
           first move. Losing capture only costs us drags that wander off the
           element, so it is not worth failing the whole interaction over. */
        try {
          if (svg.setPointerCapture) svg.setPointerCapture(e.pointerId);
        } catch (err) { /* keep measuring without capture */ }
        moveCrosshair(e.clientX);
        paintSelection(selAnchor);
        e.preventDefault();
      });
      svg.addEventListener("pointermove", e => {
        moveCrosshair(e.clientX);
        if (selAnchor !== null) {
          paintSelection(idxFromClientX(e.clientX));
          if (e.cancelable) e.preventDefault();
        }
      });
      svg.addEventListener("pointerup", e => endSelection(e));
      svg.addEventListener("pointercancel", e => endSelection(e, true));
      svg.addEventListener("lostpointercapture", e => endSelection(e, true));
      svg.addEventListener("pointerleave", () => {
        /* Mid-drag the pointer is captured, so a leave here is just the
           cursor wandering off an idle chart. */
        if (selAnchor === null && !touchCrosshairPinned) hideCrosshair();
      });
      svg.addEventListener("wheel", e => {
        if (!plot) return;
        const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? plot.h : 1;
        zoomDelta += e.deltaY * unit;
        zoomClientX = e.clientX;
        if (!zoomRaf) {
          zoomRaf = requestAnimationFrame(() => {
            const delta = zoomDelta;
            const clientX = zoomClientX;
            zoomDelta = 0;
            zoomRaf = 0;
            applyChartZoom(delta, clientX);
          });
        }
        e.preventDefault();
      }, { passive: false });
      svg.addEventListener("dblclick", e => {
        resetChartZoom(false);
        e.preventDefault();
      });
    }

    if (zoomReset) zoomReset.addEventListener("click", () => resetChartZoom(false));

    if (zoomPan && zoomPanTrack && zoomPanThumb) {
      let panPointer = null;
      let panGrabOffset = 0;

      const panFromPointer = clientX => {
        const trackRect = zoomPanTrack.getBoundingClientRect();
        const thumbRect = zoomPanThumb.getBoundingClientRect();
        const travel = Math.max(trackRect.width - thumbRect.width, 0);
        if (!travel) return;
        const left = Math.min(Math.max(clientX - trackRect.left - panGrabOffset, 0), travel);
        setChartPan(left / travel);
      };

      zoomPan.addEventListener("pointerdown", e => {
        if (!state.chartWindow || e.button !== 0) return;
        const thumbRect = zoomPanThumb.getBoundingClientRect();
        panPointer = e.pointerId;
        panGrabOffset = e.target === zoomPanThumb
          ? e.clientX - thumbRect.left
          : thumbRect.width / 2;
        try { zoomPan.setPointerCapture(e.pointerId); } catch (err) { /* continue without capture */ }
        zoomPan.classList.add("is-dragging");
        panFromPointer(e.clientX);
        e.preventDefault();
      });
      zoomPan.addEventListener("pointermove", e => {
        if (panPointer !== e.pointerId) return;
        panFromPointer(e.clientX);
        e.preventDefault();
      });
      const endPan = e => {
        if (panPointer !== e.pointerId) return;
        panPointer = null;
        zoomPan.classList.remove("is-dragging");
      };
      zoomPan.addEventListener("pointerup", endPan);
      zoomPan.addEventListener("pointercancel", endPan);
      zoomPan.addEventListener("lostpointercapture", endPan);
      zoomPan.addEventListener("keydown", e => {
        if (!state.chartWindow) return;
        const current = Number(zoomPan.getAttribute("aria-valuenow")) / 100;
        let next = current;
        if (e.key === "ArrowLeft") next -= 0.04;
        else if (e.key === "ArrowRight") next += 0.04;
        else if (e.key === "PageUp") next -= 0.2;
        else if (e.key === "PageDown") next += 0.2;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = 1;
        else return;
        setChartPan(next);
        e.preventDefault();
      });
    }

    document.addEventListener("pointerdown", e => {
      if (touchCrosshairPinned && chartEl && !chartEl.contains(e.target)) hideCrosshair(true);
    }, true);

    if ("ResizeObserver" in window && chartEl) {
      let raf = 0;
      new ResizeObserver(() => {
        if (raf) return;
        raf = requestAnimationFrame(() => { raf = 0; renderChart(false); });
      }).observe(chartEl);
    }

    // ------------------------------------------------------------- controls

    /* The active pill is one element that slides, so its position has to be
       measured from the live button rather than declared in CSS. Re-measured
       on resize and once webfonts land, since both change button widths. */
    const segs = [...document.querySelectorAll(".sc-seg")];

    const positionThumb = (seg, animate = true) => {
      const thumb = seg.querySelector(".sc-seg-thumb");
      const active = seg.querySelector(".sc-seg-btn.is-active");
      if (!thumb || !active) return;
      if (!animate) thumb.style.transition = "none";
      thumb.style.width = active.offsetWidth + "px";
      thumb.style.transform = "translateX(" + active.offsetLeft + "px)";
      thumb.classList.add("is-ready");
      if (!animate) {
        void thumb.offsetWidth;
        thumb.style.transition = "";
      }
    };

    const positionAllThumbs = (animate = false) => segs.forEach(s => positionThumb(s, animate));

    positionAllThumbs(false);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => positionAllThumbs(false));
    }
    window.addEventListener("resize", () => positionAllThumbs(false), { passive: true });

    document.querySelectorAll("[data-range]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.range = btn.dataset.range;
        state.chartWindow = null;
        document.querySelectorAll("[data-range]").forEach(b => b.classList.toggle("is-active", b === btn));
        positionThumb(btn.closest(".sc-seg"));
        hideCrosshair();
        renderChart(true);
        updateChange();
      });
    });

    document.querySelectorAll("[data-cur]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.currency = btn.dataset.cur;
        document.querySelectorAll("[data-cur]").forEach(b => b.classList.toggle("is-active", b === btn));
        positionThumb(btn.closest(".sc-seg"));
        hideCrosshair();
        renderChart(true);
        paintPrice();
        updateChange();
        /* Both are quoted in the selected currency, so they have to follow the
           toggle -- the Mayer number itself will not move, being a ratio, but
           the average underneath it is money. */
        paintMovingAverages();
        paintMayerMultiple();
        paintDrawdown();
        paintHashprice();
      });
    });

    /* Flips the sats tile between "sats per dollar" and "dollars per sat".
       The stored count-up baseline is cleared first: animating between 1,105
       and 0.0009 would just be a meaningless blur of digits. */
    let satsInverted = false;
    const satsSwap = $("dash-sats-swap");
    if (satsSwap) {
      satsSwap.addEventListener("click", () => {
        satsInverted = !satsInverted;
        satsSwap.classList.toggle("is-flipped", satsInverted);
        const sats = $("dash-sats");
        if (sats) delete sats.dataset.val;
        paintPrice();
      });
    }

    // ---------------------------------------------------------------- price
    let latest = { CAD: 0, USD: 0 };

    const paintPrice = () => {
      const cur = state.currency;
      const alt = cur === "CAD" ? "USD" : "CAD";
      const el = $("dash-price");
      if (!latest[cur]) return;
      if (el.querySelector(".sc-dash-skel")) el.textContent = "";
      animateValue(el, latest[cur], v => fmtMoney(v, cur));
      const altEl = $("dash-price-alt");
      if (altEl) {
        const converted = fmtMoney(latest[alt], alt);
        altEl.textContent = alt === "CAD"
          ? "CAD " + converted
          : converted.replace(/^US\$/, "US $");
      }

      const sats = $("dash-sats");
      if (sats && latest[cur]) {
        const perDollar = 100000000 / latest[cur];
        const satCentParity = latest[cur] / 1000000 * 100;
        const title = $("dash-sats-title");

        if (satsInverted) {
          /* The same relationship read the other way: what a single satoshi
             costs. Six decimals because at these prices a sat is a fraction
             of a cent and rounding to cents would just show $0.00. */
          if (title) title.textContent = "Dollars per sat";
          animateValue(sats, latest[cur] / 100000000, v => "$" + v.toFixed(6));
        } else {
          if (title) title.textContent = "Sats per dollar";
          animateValue(sats, perDollar, v => fmtInt(v) + " sats");
        }

        const bar = $("dash-sats-bar");
        const parity = $("dash-sats-parity");
        /* One sat equalling one cent means a 1,000,000-unit BTC price in the
           selected currency. This gives the bar a stable, understandable
           milestone and does not change when the displayed units are flipped. */
        if (bar) bar.style.width = Math.min(satCentParity, 100) + "%";
        if (parity) parity.textContent = satCentParity.toFixed(1) + "%";

        /* The same rate five years back, which is the one comparison here that
           is not just the headline restated: it says which way the currency
           has moved against bitcoin, not what today's number is in other
           units. Five rather than one because a single year is mostly noise at
           this volatility, while five covers a halving and reads as a trend. */
        const yearEl = $("dash-sats-year");
        if (yearEl) {
          const then = closeAgo(365 * 5, cur);
          yearEl.textContent = then ? fmtInt(100000000 / then) + " sats" : "—";
        }
      }
    };

    const updateChange = () => {
      const el = $("dash-change");
      if (!el) return;
      const pts = visibleSeries();
      if (pts.length < 2) { el.textContent = ""; return; }
      const key = state.currency;
      const first = pts[0][key];
      const last = state.chartWindow ? pts[pts.length - 1][key] : (latest[key] || pts[pts.length - 1][key]);
      const diff = last - first;
      const pct = (diff / first) * 100;
      const up = diff >= 0;
      const labels = { "24h": "24h", "7d": "7 days", "30d": "30 days", "1y": "1 year", "3y": "3 years", "5y": "5 years", "all": "all time" };
      el.className = "sc-dash-change " + (up ? "is-positive" : "is-negative");
      el.innerHTML = "<i class=\"bi bi-arrow-" + (up ? "up" : "down") + "-right\"></i> " +
        (up ? "+" : "") + pct.toFixed(2) + "% <span>" + (state.chartWindow ? "visible range" : labels[state.range]) + "</span>";
    };

    const stampQuery = window.matchMedia("(max-width: 767px)");

    /* Held so the string can be rebuilt at a new width without inventing a
       fresher update time than the last one we actually received. */
    let stampedAt = null;

    const renderStamp = () => {
      const el = $("dash-updated");
      if (!el || !stampedAt) return;
      const time = stampedAt.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
      const compactTime = time.replace(/[.\s]/g, "").toLowerCase();
      el.textContent = stampQuery.matches ? "Live " + compactTime : "Live · updated " + time;
    };

    const stamp = () => {
      stampedAt = new Date();
      renderStamp();
      const status = $("dash-status");
      if (status) status.classList.add("is-live");
    };

    /* The compact/full choice is made when the stamp is written, so a rotation
       between polls would otherwise leave the wrong-length string in place. */
    if (stampQuery.addEventListener) stampQuery.addEventListener("change", renderStamp);
    else stampQuery.addListener(renderStamp);

    // ----------------------------------------------------------- data loads
    const fillHistoricalCad = async () => {
      const fx = await fetchJSON(
        "https://api.frankfurter.dev/v1/2010-01-01..2015-12-31?base=USD&symbols=CAD",
        25000
      );
      const dailyRates = Object.entries((fx && fx.rates) || {})
        .map(([date, rates]) => ({
          t: Math.floor(new Date(date + "T00:00:00Z").getTime() / 1000),
          rate: Number(rates && rates.CAD)
        }))
        .filter(item => Number.isFinite(item.t) && item.rate > 0)
        .sort((a, b) => a.t - b.t);

      if (!dailyRates.length) return false;

      let rateIndex = 0;
      let latestRate = dailyRates[0].rate;
      let filled = 0;
      state.history.forEach(row => {
        while (rateIndex + 1 < dailyRates.length && dailyRates[rateIndex + 1].t <= row.t) {
          rateIndex += 1;
          latestRate = dailyRates[rateIndex].rate;
        }
        if (!(row.CAD > 0) && row.USD > 0 && row.t >= dailyRates[0].t) {
          row.CAD = row.USD * latestRate;
          row.CADDerived = true;
          filled += 1;
        }
      });
      return filled > 0;
    };

    const loadHistory = async () => {
      try {
        const data = await fetchJSON("https://mempool.space/api/v1/historical-price?currency=CAD", 25000);
        const rows = (data && data.prices) || [];
        state.history = rows
          .map(r => ({ t: r.time, CAD: r.CAD, USD: r.USD }))
          .filter(r => r.t)
          .sort((a, b) => a.t - b.t);
        renderChart(true);
        updateChange();
        try {
          if (await fillHistoricalCad()) {
            renderChart(false);
            updateChange();
          }
        } catch (fxError) {
          // Native CAD history still renders if the optional historical FX lookup fails.
        }
        /* First point at which the long averages can be worked out at all --
           they need years of closes, and this is what fetches them. paintPrice
           is in the list because the sats tile's five-year comparison reads the
           same history, and the price poll that normally drives that tile
           finishes long before this request does. */
        paintPrice();
        paintMovingAverages();
        paintMayerMultiple();
        paintDrawdown();
        paintHashprice();
      } catch (err) {
        setChartState("Price history is unavailable right now.", false);
      }
    };

    const loadPrices = async () => {
      try {
        const p = await fetchJSON("https://mempool.space/api/v1/prices");
        const prev = latest[state.currency];
        latest = { CAD: p.CAD, USD: p.USD };
        paintPrice();
        if (prev && p[state.currency] !== prev) flash($("dash-price"), p[state.currency] > prev);

        /* Fold the live tick into the series so the chart's right edge and the
           headline number never disagree. Same hour updates in place; a new
           hour appends. */
        if (state.history.length) {
          const last = state.history[state.history.length - 1];
          const nowSec = Math.floor(Date.now() / 1000);
          if (nowSec - last.t < 3600) {
            last.CAD = p.CAD; last.USD = p.USD;
          } else {
            state.history.push({ t: nowSec, CAD: p.CAD, USD: p.USD });
          }
          renderChart(false);
        }
        updateChange();
        /* Keep both long-term averages aligned with the active currency. */
        paintMovingAverages();
        paintMayerMultiple();
        paintDrawdown();
        paintHashprice();
        stamp();
      } catch (err) { /* leave the last good value on screen */ }
    };

    const paintLowestNextBlockFee = projected => {
      const lowestFee = projected && Array.isArray(projected.feeRange)
        ? Number(projected.feeRange[0])
        : NaN;
      if (!Number.isFinite(lowestFee)) return;
      const feeEl = $("dash-fee");
      animateValue(feeEl, lowestFee, v => fmtFeeRate(v));
      /* Cheap is good here: keep the same green-to-red scale used before,
         but apply it to the projected entry floor rather than High priority. */
      if (feeEl) feeEl.style.color = scaleColor(1 - Math.min(lowestFee, 100) / 100);
    };

    /* Touch drags the strip natively and a trackpad can swipe it, but a mouse
       can do neither: the scrollbar is hidden, so without this the blocks past
       the right-hand fade cannot be reached at all. Pointer events rather than
       mouse ones, so a stylus behaves too; touch is left to the browser, which
       already does it better than this would.

       The wrinkle is that every card is a link. A press that turns into a drag
       must scroll and then NOT open a block when the button comes up, while a
       press that stays put must still follow the link. A few pixels of slop
       separates the two. */
    const bindBlocksDrag = wrap => {
      const DRAG_SLOP = 5;
      /* Glide tuning. Speeds are pointer pixels per millisecond; the cap keeps
         a violent flick from teleporting the strip and the floor decides what
         is too slow to be worth coasting at all. GLIDE_REACH turns a release
         speed into a distance -- at the cap, a throw of a little over 400px. */
      const GLIDE_MAX_SPEED = 2.5;
      const GLIDE_MIN_SPEED = 0.015;
      const GLIDE_REACH = 170;
      const GLIDE_MIN_MS = 260;
      const GLIDE_MAX_MS = 900;
      /* scrollLeft lands on whole pixels, so the very end of any easing curve
         asks for fractions of a pixel per frame and gets rounded into a 1, 0,
         1, 0 stutter -- worse on a high-refresh display, where the frames are
         shorter and the fractions smaller. Finish the moment the target is
         this close instead: the curve is doing under a pixel a frame by then,
         so closing the gap in one step cannot be seen, and skipping the crawl
         is what actually makes the ending read as smooth. */
      const GLIDE_SETTLE_PX = 2;
      /* How long a pointer may sit still before its last reading is treated as
         stale rather than as speed. */
      const GLIDE_STALE_MS = 100;

      let pointerId = null;
      let startX = 0;
      let startScroll = 0;
      let dragging = false;
      let swallowClick = false;
      let velocity = 0;
      let lastX = 0;
      let lastT = 0;
      let glideFrame = 0;

      const stopGlide = () => {
        if (glideFrame) cancelAnimationFrame(glideFrame);
        glideFrame = 0;
      };

      /* Eases to a landing point rather than bleeding speed off frame by
         frame. A decay loop has to quit at some floor while the strip is still
         moving, and that leftover speed is the abrupt part -- it also reaches
         either end of the row at full tilt and stops against it. Working out
         where the coast should land, clamping that into range, then easing to
         it makes the arrival the curve's own ending: an ease-out cubic is at
         exactly zero speed as it finishes, so the strip settles rather than
         stops, and settles into the boundary the same way instead of hitting
         it. Being a function of elapsed time it also self-corrects -- a tab
         backgrounded mid-glide resumes at the right place rather than
         integrating one enormous frame. */
      const glide = () => {
        const speed = Math.max(-GLIDE_MAX_SPEED, Math.min(GLIDE_MAX_SPEED, -velocity));
        const from = wrap.scrollLeft;
        const limit = wrap.scrollWidth - wrap.clientWidth;
        const to = Math.max(0, Math.min(limit, from + speed * GLIDE_REACH));
        const span = to - from;
        if (Math.abs(span) < 1) return;
        /* Tied to distance, so a nudge does not take as long to settle as a
           full-length throw. */
        const duration = Math.max(GLIDE_MIN_MS, Math.min(GLIDE_MAX_MS, Math.abs(span) * 1.7));
        const start = performance.now();
        const step = now => {
          const t = Math.min(1, (now - start) / duration);
          /* Squared rather than cubed: both finish at zero speed, but the
             gentler curve spends far less of its length below a pixel a
             frame, which is the stretch that cannot be drawn smoothly. */
          const remaining = span * Math.pow(1 - t, 2);
          if (t >= 1 || Math.abs(remaining) < GLIDE_SETTLE_PX) {
            wrap.scrollLeft = to;
            glideFrame = 0;
            return;
          }
          wrap.scrollLeft = to - remaining;
          glideFrame = requestAnimationFrame(step);
        };
        glideFrame = requestAnimationFrame(step);
      };

      wrap.addEventListener("pointerdown", e => {
        if (e.pointerType === "touch" || e.button !== 0) return;
        /* Catching a moving strip should stop it where it is, the way it does
           on a phone. */
        stopGlide();
        pointerId = e.pointerId;
        startX = e.clientX;
        startScroll = wrap.scrollLeft;
        dragging = false;
        velocity = 0;
        lastX = e.clientX;
        lastT = e.timeStamp;
        /* Any press begins a fresh gesture, so a suppression left armed by a
           drag whose click never arrived cannot eat this one's. */
        swallowClick = false;
      });

      wrap.addEventListener("pointermove", e => {
        if (pointerId === null || e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        if (!dragging) {
          if (Math.abs(dx) < DRAG_SLOP) return;
          dragging = true;
          wrap.classList.add("is-dragging");
          /* Capture so the drag survives the pointer leaving the strip. It
             throws if the pointer is no longer active, which is a race we
             cannot prevent and do not need to survive -- losing capture only
             means the drag ends early if the cursor leaves. */
          try { wrap.setPointerCapture(pointerId); } catch (err) { /* not captured */ }
        }
        /* Weighted towards the newest sample so the glide follows the flick at
           the end of the gesture rather than its average over the whole drag --
           dragging slowly across and snapping at the last moment should throw
           the strip, and a raw average would swallow that. */
        const dt = e.timeStamp - lastT;
        if (dt > 0) {
          velocity = ((e.clientX - lastX) / dt) * 0.7 + velocity * 0.3;
          lastX = e.clientX;
          lastT = e.timeStamp;
        }
        wrap.scrollLeft = startScroll - dx;
        e.preventDefault();
      });

      const endDrag = e => {
        if (pointerId === null || e.pointerId !== pointerId) return;
        try {
          if (wrap.hasPointerCapture(pointerId)) wrap.releasePointerCapture(pointerId);
        } catch (err) { /* already released with the pointer */ }
        pointerId = null;
        if (!dragging) return;
        dragging = false;
        wrap.classList.remove("is-dragging");
        swallowClick = true;
        /* A stationary pointer sends no events, so velocity still holds
           whatever the last movement was -- without this, dragging somewhere,
           pausing, and letting go would fling the strip on a reading taken
           who knows how long ago. Going quiet is how a person says stop. */
        if (e.timeStamp - lastT > GLIDE_STALE_MS) velocity = 0;
        if (!reduceMotion && Math.abs(velocity) > GLIDE_MIN_SPEED) glide();
      };

      wrap.addEventListener("pointerup", endDrag);
      wrap.addEventListener("pointercancel", endDrag);

      /* Capture phase: the click has to die before it reaches the card. */
      wrap.addEventListener("click", e => {
        if (!swallowClick) return;
        swallowClick = false;
        e.preventDefault();
        e.stopPropagation();
      }, true);
    };

    /* The phone aura is painted on the stage rather than inside the scroller
       -- overflow-x:auto would clip it -- so it does not move when the strip
       is scrolled, and the glow detaches from the pending card it belongs to.
       Feed the scroll offset back so it tracks the card. */
    let blocksOverflowBound = false;
    const syncBlocksOverflow = () => {
      const wrap = $("dash-blocks");
      const stage = wrap && wrap.closest(".sc-blocks-top");
      const box = wrap && wrap.closest(".sc-blocks-container");
      if (!stage) return;
      /* Measured against the container's right gutter rather than the
         scroller's own overflow. scrollWidth would answer a different
         question: the scroll box is 56px wider than the container on each
         side, so a card sitting in that margin still overflows the gutter the
         fade is drawn on while the scroller reports room to spare. The fade
         has to clear once the last block is inside that gutter, or the oldest
         block could never be read at the end of the row. */
      const cards = wrap.querySelectorAll(".sc-block");
      if (box && cards.length) {
        const gutter = box.getBoundingClientRect().right - parseFloat(getComputedStyle(box).paddingRight);
        const lastRight = cards[cards.length - 1].getBoundingClientRect().right;
        stage.classList.toggle("has-more-blocks", lastRight > gutter + 1);
      }
      stage.style.setProperty("--sc-blocks-scroll", wrap.scrollLeft + "px");
      if (!blocksOverflowBound) {
        blocksOverflowBound = true;
        wrap.addEventListener("scroll", syncBlocksOverflow, { passive: true });
        window.addEventListener("resize", () => { sizeBlockGhost(); syncBlocksOverflow(); measureBlocksFade(); });
        /* Bound to the scroller itself, which renderStrip() reuses -- it
           replaces the cards inside, never this element -- so this survives
           every rebuild without rebinding. */
        bindBlocksDrag(wrap);
      }
    };

    /* The container box runs well past the cards -- the scroller carries 56px
       of padding so the pending block's glow has somewhere to render, and the
       price heading is pulled up into that space. A full-height fade therefore
       washed over the "Live" chip's right end. Bound it to the cards instead;
       measuring beats per-breakpoint constants, since the stage padding, the
       scroller padding and the negative margins all differ by breakpoint. */
    /* The decorative continuation card is intentionally only a sliver. Keep
       it a little more visible on larger screens, but never let spare row width
       turn it into another full card. Its height follows the pending card so
       the two orange edges always line up. */
    const sizeBlockGhost = () => {
      const wrap = $("dash-blocks");
      const box = wrap && wrap.closest(".sc-blocks-container");
      const ghost = wrap && wrap.querySelector(".sc-block-ghost");
      const pending = wrap && wrap.querySelector(".sc-block-pending");
      if (!box || !ghost || !pending) return;

      const pendingHeight = pending.getBoundingClientRect().height;
      if (pendingHeight) ghost.style.height = pendingHeight + "px";

      if (window.matchMedia("(max-width: 575px)").matches) {
        ghost.style.width = "10px";
        return;
      }
      ghost.style.width = "30px";
    };

    const measureBlocksFade = () => {
      const wrap = $("dash-blocks");
      const box = wrap && wrap.closest(".sc-blocks-container");
      const card = wrap && wrap.querySelector(".sc-block");
      if (!box || !card) return;
      const boxRect = box.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();
      /* 90px of bleed so the hover glow (up to a 76px blur, lifted 10px) isn't
         cut off by the fade's own edge -- 8px only covered the resting shadow.

         Below the cards that figure has to shrink on phones. The scroller
         reserves exactly 90px of bottom padding for that same hover glow, so
         subtracting a 90px bleed from a 90px gap leaves an inset of zero and
         the fade runs the full height of its container -- roughly 90px below
         the cards, into a stretch the strip's own negative bottom margin has
         already handed to the hero. On desktop nothing is there to catch it.
         In the mobile layout the "Live - updated" chip is, and its right end
         sat under the gradient.

         30px is safe here because the thing the big bleed protects does not
         exist at this width: there is no hover lift, and the one card with a
         bright glow is the pending card, which is always leftmost and never
         reaches the right gutter this fade covers. What does overrun there is
         confirmed cards, whose shadows are black on a black stage -- masking
         them changes nothing visible. Their bright content stops at the card's
         own border box, well inside 30px. */
      const bleedBelow = window.matchMedia("(max-width: 767px)").matches ? 30 : 90;
      box.style.setProperty("--sc-strip-fade-top", Math.max(0, cardBox.top - boxRect.top - 90) + "px");
      box.style.setProperty("--sc-strip-fade-bottom", Math.max(0, boxRect.bottom - cardBox.bottom - bleedBelow) + "px");
    };

    /* Both projected.totalFees and block.extras.totalFees are transaction-fee
       totals in satoshis. They do not include the block subsidy. */
    const fmtBlockFees = totalFees => {
      const sats = Number(totalFees);
      if (!Number.isFinite(sats)) return "\u2014";
      const btc = sats / 1e8;
      return btc.toLocaleString("en-CA", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      }) + " BTC";
    };

    const fmtBlockAge = timestamp => {
      const seconds = Math.max(0, Math.floor(Date.now() / 1000 - Number(timestamp)));
      const mins = Math.floor(seconds / 60);
      if (mins < 1) return "just now";
      if (mins < 60) return mins + " min ago";
      return Math.floor(mins / 60) + " hr ago";
    };

    /* Block timestamps are retained on the cards so their ages keep advancing
       from the local clock even when the API and socket are quiet. */
    const tickBlockAges = () => {
      document.querySelectorAll(".sc-block-confirmed[data-block-timestamp]").forEach(card => {
        const age = card.querySelector(".sc-block-age");
        if (age) age.textContent = fmtBlockAge(card.dataset.blockTimestamp);
      });
    };

    const paintPendingBlock = projected => {
      if (!projected) return;
      state.projectedBlock = projected;
      paintLowestNextBlockFee(projected);
      const wrap = $("dash-blocks");
      if (!wrap || wrap.classList.contains("is-confirming")) return;
      const pendingEl = wrap.querySelector(".sc-block-pending");
      if (!pendingEl) return;
      const age = pendingEl.querySelector(".sc-block-age");
      const values = pendingEl.querySelectorAll("dd");
      if (age && Array.isArray(projected.feeRange) && projected.feeRange.length) {
        age.innerHTML = fmtFeeSpan(projected.feeRange) + " <span class=\"sc-fee-unit\">sat/vB</span>";
      }
      if (values[0] && Number.isFinite(Number(projected.nTx))) {
        values[0].textContent = fmtInt(projected.nTx);
      }
      if (values[1] && Number.isFinite(Number(projected.totalFees))) {
        values[1].textContent = fmtBlockFees(projected.totalFees);
      }
      if (values[2] && Array.isArray(projected.feeRange) && projected.feeRange.length) {
        values[2].textContent = fmtFeeRate(projected.feeRange[0]);
      }
    };

    const paintFees = f => {
      if (!f || !Number.isFinite(Number(f.fastestFee))) return;
      const tiers = $("dash-fee-tiers");
      if (tiers) {
        tiers.innerHTML =
          "<span><span class=\"sc-dash-fee-label\">Low</span><em>" + fmtFeeRate(f.hourFee) + "</em></span>" +
          "<span><span class=\"sc-dash-fee-label\">Medium</span><em>" + fmtFeeRate(f.halfHourFee) + "</em></span>" +
          "<span><span class=\"sc-dash-fee-label\">High</span><em>" + fmtFeeRate(f.fastestFee) + "</em></span>";
      }
    };

    const loadFees = async () => {
      try {
        paintFees(await fetchJSON("https://mempool.space/api/v1/fees/recommended"));
      } catch (err) { /* tile keeps its last good value */ }
    };

    const supplyAtHeight = height => {
      let blocks = Math.max(0, Math.floor(height) + 1);
      let subsidy = 50;
      let total = 0;
      while (blocks > 0 && subsidy > 0) {
        const inEra = Math.min(blocks, HALVING_INTERVAL);
        total += inEra * subsidy;
        blocks -= inEra;
        subsidy /= 2;
      }
      return total;
    };

    const formatSubsidy = value => {
      const digits = value >= 10 ? 0 : 4;
      return Number(value.toFixed(digits)).toLocaleString("en-CA", { maximumFractionDigits: digits }) + " BTC";
    };

    /* The price series is sampled weekly in its early years and hourly in its
       recent ones, so averaging raw points would let the last fortnight weigh
       as much as a decade. Collapse to one close per UTC day first and average
       those. Cached because a 1400-day mean is recomputed on every price tick
       while the series only ever grows at one end. */
    let dailyCloseCache = { stamp: null, rows: [] };
    const dailyCloses = () => {
      const hist = state.history;
      if (!hist.length) return [];
      const stamp = hist[hist.length - 1].t;
      if (dailyCloseCache.stamp === stamp) return dailyCloseCache.rows;
      const byDay = new Map();
      /* Later rows overwrite earlier ones, so each day keeps its last print. */
      hist.forEach(r => byDay.set(Math.floor(r.t / 86400), r));
      const rows = [...byDay.keys()].sort((a, b) => a - b).map(k => byDay.get(k));
      dailyCloseCache = { stamp, rows };
      return rows;
    };

    /* Windowed by date rather than by row count. The series is not one row per
       day all the way back -- CAD thins to roughly weekly before about 2023 --
       so counting rows backwards walks far further into the past than the
       window asked for. Taking everything newer than a cutoff timestamp gives
       the window its actual length whatever the sampling was doing. */
    const movingAverage = (days, cur) => {
      const rows = dailyCloses();
      if (!rows.length) return null;
      const cutoff = rows[rows.length - 1].t - days * 86400;
      if (rows[0].t > cutoff) return null;
      let sum = 0;
      let n = 0;
      rows.forEach(r => {
        if (r.t < cutoff) return;
        const v = Number(r[cur]);
        if (Number.isFinite(v) && v > 0) { sum += v; n += 1; }
      });
      /* Thin coverage inside the window would bias the mean rather than fail
         outright, so require the days present to be most of the days asked
         for. Sparse stretches are the reason, not missing prints. */
      return n >= days * 0.6 ? sum / n : null;
    };

    /* The close nearest a point in the past, found by timestamp for the same
       reason. Refuses a match that is not actually near the date wanted, so a
       gap in the record shows a dash instead of a number from the wrong year. */
    const closeAgo = (days, cur) => {
      const rows = dailyCloses();
      if (!rows.length) return null;
      const target = rows[rows.length - 1].t - days * 86400;
      let best = null;
      let bestGap = Infinity;
      rows.forEach(r => {
        const v = Number(r[cur]);
        if (!Number.isFinite(v) || v <= 0) return;
        const gap = Math.abs(r.t - target);
        if (gap < bestGap) { bestGap = gap; best = v; }
      });
      return bestGap <= 45 * 86400 ? best : null;
    };

    const paintMovingAverages = () => {
      const cur = state.currency;
      const ma200w = movingAverage(1400, cur);
      const ma50w = movingAverage(350, cur);
      const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
      set("dash-ma200w", ma200w ? fmtMoney(ma200w, cur) : "—");
      set("dash-ma50w", ma50w ? fmtMoney(ma50w, cur) : "—");
    };

    /* Deliberately the 200-day average, not the 200-week one above: the Mayer
       Multiple is defined against the daily figure, and quoting it off a
       different window would give a number that cannot be compared with the
       one everybody else publishes. */
    const paintMayerMultiple = () => {
      const cur = state.currency;
      const ma200d = movingAverage(200, cur);
      const price = latest[cur];
      const maEl = $("dash-mayer-ma");
      if (maEl) maEl.textContent = ma200d ? fmtMoney(ma200d, cur) : "—";
      const el = $("dash-mayer");
      if (!el) return;
      if (!ma200d || !price) { el.textContent = "—"; return; }
      const mayer = price / ma200d;
      el.textContent = mayer.toFixed(2) + "×";
      /* The fee tile's green-to-red scale, read the other way round: a high
         multiple is the expensive end, not the cheap one. */
      el.style.color = scaleColor(1 - Math.min(mayer / 3, 1));
      const note = $("dash-mayer-note");
      if (note) {
        note.textContent = mayer < 1
          ? "Below its 200-day average."
          : mayer < 2.4
            ? "Inside the range it has spent most of its history."
            : "Above 2.4, a level it has rarely held for long.";
      }
    };

    const paintDrawdown = () => {
      const cur = state.currency;
      const rows = dailyCloses();
      const price = latest[cur];
      const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
      if (!rows.length || !price) return;
      let peak = 0;
      let peakAt = null;
      let counted = 0;
      let cycleLow = Infinity;
      /* Previous bear-market cycle: from the November 2021 peak through the
         April 2024 halving that opened the current cycle. */
      const previousCycleStart = Date.UTC(2021, 10, 10) / 1000;
      const previousCycleEnd = Date.UTC(2024, 3, 20) / 1000;
      rows.forEach(r => {
        const v = Number(r[cur]);
        if (!Number.isFinite(v) || v <= 0) return;
        counted += 1;
        if (v > peak) { peak = v; peakAt = r.t; }
        if (r.t >= previousCycleStart && r.t < previousCycleEnd && v < cycleLow) cycleLow = v;
      });
      if (!counted || !peak) return;
      /* Today counts too, otherwise a fresh high would read as a drawdown from
         yesterday's peak. */
      const high = Math.max(peak, price);
      const off = (price / high - 1) * 100;
      set("dash-drawdown", off > -0.05 ? "At its high" : off.toFixed(1) + "%");
      set("dash-ath", fmtMoney(high, cur));
      set("dash-cycle-low", Number.isFinite(cycleLow) ? fmtMoney(cycleLow, cur) : "—");
      const note = $("dash-drawdown-note");
      if (note && peakAt) {
        const when = new Intl.DateTimeFormat("en-CA", { month: "short", year: "numeric" })
          .format(new Date(peakAt * 1000));
        note.textContent = price >= peak
          ? "Trading at the highest price it has ever reached."
          : "Below the high set in " + when + ".";
      }
    };

    /* Miner pay per unit of work: the whole network's daily take spread across
       the hashing that earned it. Needs three things that arrive from three
       different requests -- price, hashrate, and the fee half of the reward --
       so each of those calls this and it renders once they have all landed. */
    const paintHashprice = () => {
      const cur = state.currency;
      const price = latest[cur];
      const hashrate = state.hashrate;
      /* Taken from the fee-share pass rather than derived from state.tipHeight,
         which is not assigned until the end of loadChain -- long after this
         first wants to run, so the three inputs would never coincide. */
      const subsidy = state.blockSubsidy;
      if (!price || !hashrate || !Number.isFinite(subsidy)) return;
      const fees = Number.isFinite(state.avgBlockFees) ? state.avgBlockFees : 0;
      const btcPerDay = (subsidy + fees) * 144;
      const perDay = btcPerDay * price;
      const petahashes = hashrate / 1e15;
      const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
      set("dash-hashprice", fmtMoneyPrecise(perDay / petahashes, cur));
      set("dash-hashprice-rev", fmtMoney(perDay / 1e6, cur) + "M");
      set("dash-hashprice-btc", fmtInt(btcPerDay) + " BTC");
    };

    /* Fees against the whole of miner pay, which is the question the halvings
       eventually force: the subsidy is on its way to zero and this is the only
       thing left to pay for hashing. Averaged over the block window rather
       than read off the last block, since a single block's fees swing wildly
       with whatever happened to be waiting. */
    const paintFeeShare = (blocks, height) => {
      if (!Array.isArray(blocks) || !blocks.length || !Number.isFinite(height)) return;
      const subsidy = 50 / Math.pow(2, Math.floor(height / HALVING_INTERVAL));
      let fees = 0;
      let counted = 0;
      blocks.forEach(b => {
        const total = b.extras && Number(b.extras.totalFees);
        if (Number.isFinite(total)) { fees += total / 1e8; counted += 1; }
      });
      if (!counted) return;
      const perBlock = fees / counted;
      state.avgBlockFees = perBlock;
      state.blockSubsidy = subsidy;
      paintHashprice();
      const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
      set("dash-feeshare", (perBlock / (subsidy + perBlock) * 100).toFixed(2) + "%");
      set("dash-feeshare-fees", perBlock.toFixed(3) + " BTC");
      set("dash-feeshare-subsidy", subsidy + " BTC");
    };

    const paintSupplyAndHalving = height => {
      if (!Number.isFinite(height) || height < 0) return;
      const era = Math.floor(height / HALVING_INTERVAL);
      const subsidy = 50 / Math.pow(2, era);
      const nextSubsidy = subsidy / 2;
      const nextHeight = (era + 1) * HALVING_INTERVAL;
      const blocksLeft = Math.max(0, nextHeight - height);
      const epochProgress = ((height % HALVING_INTERVAL) / HALVING_INTERVAL) * 100;
      const supply = supplyAtHeight(height);
      const supplyPct = Math.min(supply / DISPLAY_SUPPLY_LIMIT * 100, 100);
      const remaining = Math.max(0, DISPLAY_SUPPLY_LIMIT - supply);

      animateValue($("dash-supply"), supply, v => (v / 1e6).toFixed(2) + "M BTC");
      const supplyNote = $("dash-supply-note");
      if (supplyNote) supplyNote.textContent = supplyPct.toFixed(2) + "% of the 21 million limit issued.";
      const supplyPctEl = $("dash-supply-pct");
      if (supplyPctEl) supplyPctEl.textContent = supplyPct.toFixed(2) + "%";
      const supplyLeft = $("dash-supply-left");
      if (supplyLeft) supplyLeft.textContent = remaining >= 1e6
        ? (remaining / 1e6).toFixed(2) + "M BTC"
        : Math.round(remaining / 1000) + "k BTC";
      const supplyDay = $("dash-supply-day");
      if (supplyDay) supplyDay.textContent = fmtInt(subsidy * 144) + " BTC";
      const supplyBar = $("dash-supply-bar");
      if (supplyBar) supplyBar.style.width = supplyPct.toFixed(2) + "%";

      animateValue($("dash-halving"), blocksLeft, v => fmtInt(v) + " blocks");
      const estimatedDate = new Date(Date.now() + blocksLeft * 10 * 60 * 1000);
      const halvingNote = $("dash-halving-note");
      if (halvingNote) {
        const monthYear = new Intl.DateTimeFormat("en-CA", { month: "short", year: "numeric" }).format(estimatedDate);
        halvingNote.textContent = "Est. " + monthYear + " at the 10-minute block target.";
      }
      const currentReward = $("dash-halving-current");
      if (currentReward) currentReward.textContent = formatSubsidy(subsidy);
      const nextReward = $("dash-halving-next");
      if (nextReward) nextReward.textContent = formatSubsidy(nextSubsidy);
      const halvingProgress = $("dash-halving-progress");
      if (halvingProgress) halvingProgress.textContent = epochProgress.toFixed(1) + "%";
      const halvingBar = $("dash-halving-bar");
      if (halvingBar) halvingBar.style.width = epochProgress.toFixed(1) + "%";
    };

    const paintMempool = (raw, feeUnit = "auto") => {
      if (!raw) return;
      const previous = state.mempoolStats || {};
      const count = Number(raw.count ?? raw.size);
      const vsize = Number(raw.vsize);
      const bytes = Number(raw.bytes);
      const totalFee = Number(raw.total_fee);
      const next = {
        count: Number.isFinite(count) ? count : previous.count,
        vsize: Number.isFinite(vsize) ? vsize : previous.vsize,
        approximateVsize: Number.isFinite(vsize) ? false : previous.approximateVsize,
        totalFeeSats: previous.totalFeeSats
      };

      /* The REST endpoint reports total_fee in satoshis. The socket's Core
         mempoolInfo reports BTC, so small decimal values are normalized. */
      if (Number.isFinite(totalFee)) {
        next.totalFeeSats = feeUnit === "btc" || (feeUnit === "auto" && totalFee < 1000)
          ? totalFee * 1e8
          : totalFee;
      }
      if (!Number.isFinite(next.vsize) && Number.isFinite(bytes)) {
        next.vsize = bytes;
        next.approximateVsize = true;
      }
      state.mempoolStats = next;

      if (Number.isFinite(next.vsize)) {
        const vmb = next.vsize / 1e6;
        animateValue($("dash-mempool"), vmb, v => (next.approximateVsize ? "~" : "") +
          v.toLocaleString("en-CA", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " vMB");
        const blocks = Math.max(1, Math.ceil(vmb));
        const blockEquiv = $("dash-mempool-blocks");
        /* "≈" rather than "~": at this tile's weight and size a tilde reads as
           a minus sign, turning the count into an impossible negative. */
        if (blockEquiv) blockEquiv.textContent = "≈" + fmtInt(blocks);
        /* The backlog in time rather than in bytes, which is the form the
           question is usually asked in. Assumes the target block interval and
           no new arrivals, so it is a floor, not a forecast. */
        const eta = $("dash-mempool-eta");
        if (eta) {
          const mins = blocks * 10;
          eta.textContent = mins < 60
            ? mins + " min"
            : (mins / 60).toFixed(mins < 600 ? 1 : 0) + " hr";
        }
      }
      const mempoolTx = $("dash-mempool-tx");
      if (mempoolTx && Number.isFinite(next.count)) mempoolTx.textContent = fmtInt(next.count);
      const mempoolNote = $("dash-mempool-note");
      if (mempoolNote && Number.isFinite(next.count)) {
        mempoolNote.textContent = fmtInt(next.count) + " unconfirmed transactions waiting.";
      }
      const mempoolFees = $("dash-mempool-fees");
      if (mempoolFees && Number.isFinite(next.totalFeeSats)) {
        const btc = next.totalFeeSats / 1e8;
        mempoolFees.textContent = btc.toLocaleString("en-CA", {
          minimumFractionDigits: btc < 1 ? 3 : 2,
          maximumFractionDigits: btc < 1 ? 3 : 2
        }) + " BTC";
      }
    };

    const loadMempool = async () => {
      try {
        paintMempool(await fetchJSON("https://mempool.space/api/mempool"), "sats");
      } catch (err) { /* tile keeps its last good value */ }
    };

    const loadChain = async () => {
      try {
        const h = await fetchText("https://mempool.space/api/blocks/tip/height");
        const height = parseInt(h, 10);
        if (Number.isFinite(height)) paintSupplyAndHalving(height);
      } catch (err) { /* tile keeps its placeholder */ }

      try {
        const blocks = await fetchJSON("https://mempool.space/api/v1/blocks");
        let projected = state.projectedBlock;
        try {
          const projectedBlocks = await fetchJSON("https://mempool.space/api/v1/fees/mempool-blocks");
          if (Array.isArray(projectedBlocks) && projectedBlocks.length) projected = projectedBlocks[0];
        } catch (err) { /* confirmed blocks can still render */ }
        if (projected) {
          state.projectedBlock = projected;
          paintLowestNextBlockFee(projected);
        }
        const wrap = $("dash-blocks");
        if (wrap && Array.isArray(blocks)) {
          const pendingTx = projected && Number.isFinite(Number(projected.nTx)) ? fmtInt(projected.nTx) : "—";
          const pendingFees = projected ? fmtBlockFees(projected.totalFees) : "\u2014";
          const pendingFee = projected && Array.isArray(projected.feeRange) && projected.feeRange.length ? fmtFeeSpan(projected.feeRange) + " <span class=\"sc-fee-unit\">sat/vB</span>" : "Building";
          const pendingLowest = projected && Array.isArray(projected.feeRange) && projected.feeRange.length ? fmtFeeRate(projected.feeRange[0]) : "\u2014";
          // The logo's animated SVG begins its own clock during asset paint.
          // Advance the CSS pulse by half a second so its visible peak meets
          // the orange-circle peak instead of trailing it.
          const logoPhase = -(((performance.now() + 500) / 1000) % 3.617).toFixed(3) + "s";
          const blocksStage = wrap.closest(".sc-blocks-top");
          if (blocksStage) blocksStage.style.setProperty("--sc-logo-phase", logoPhase);
          /* The height this block will take once it is mined -- one past the
             tip. Naming it now is also what makes the confirm transition read
             as one card: the number the pending card is showing is the number
             it keeps when it lands. Falls back to a label if the tip is
             unreadable, since a wrong height is worse than no height. */
          const tipNow = blocks.length ? Number(blocks[0].height) : NaN;
          const nextHeight = Number.isFinite(tipNow) ? fmtInt(tipNow + 1) : null;
          const pending =
            "<a class=\"sc-block sc-block-pending\" draggable=\"false\" style=\"--i:0;--sc-logo-phase:" + logoPhase + "\" href=\"https://mempool.space/mempool-block/0\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"View the projected next block" + (nextHeight ? " " + nextHeight : "") + " on mempool.space\">" +
              "<span class=\"sc-block-kicker\"><span class=\"sc-pending-dot\"></span>Pending</span>" +
              "<span class=\"sc-block-height\">" + (nextHeight || "Next block") + "</span>" +
              "<span class=\"sc-block-age\">" + pendingFee + "</span>" +
              "<dl class=\"sc-block-meta\">" +
                "<div><dt>Transactions</dt><dd>" + pendingTx + "</dd></div>" +
                "<div><dt>Projected</dt><dd>" + pendingFees + "</dd></div>" +
                "<div class=\"sc-block-lowest\"><dt>Lowest</dt><dd>" + pendingLowest + "</dd></div>" +
              "</dl></a>";
          /* /api/v1/blocks returns 15 and we were already fetching all of
             them, so the extra tail costs nothing on the wire. Only the first
             few are ever on screen; the rest sit past the right-hand fade and
             are reached by dragging the strip. */
          const buildConfirmed = fresh => blocks.slice(0, 15).map((b, i) => {
            const timestamp = Number.isFinite(Number(b.timestamp)) ? Number(b.timestamp) : Math.floor(Date.now() / 1000);
            /* Spelled out because .sc-block-age uppercases: a bare "5m ago"
               renders as "5M AGO", which reads as five months. */
            const age = fmtBlockAge(timestamp);
            const lowest = b.extras && Array.isArray(b.extras.feeRange) && b.extras.feeRange.length ? fmtFeeRate(b.extras.feeRange[0]) : "—";
            return "<a class=\"sc-block sc-block-confirmed" + (fresh && i === 0 ? " is-newest" : "") + "\" data-block-timestamp=\"" + timestamp + "\" draggable=\"false\" style=\"--i:" + (i + 1) + "\" href=\"https://mempool.space/block/" + b.id + "\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"View block " + b.height + " on mempool.space\">" +
              "<span class=\"sc-block-kicker\"><i class=\"bi bi-check2-circle\"></i>Confirmed</span>" +
              "<span class=\"sc-block-height\">" + fmtInt(b.height) + "</span>" +
              "<span class=\"sc-block-age\">" + age + "</span>" +
              "<dl class=\"sc-block-meta\">" +
                "<div><dt>Transactions</dt><dd>" + fmtInt(b.tx_count) + "</dd></div>" +
                "<div><dt>Fees</dt><dd>" + fmtBlockFees(b.extras && b.extras.totalFees) + "</dd></div>" +
                "<div class=\"sc-block-lowest\"><dt>Lowest</dt><dd>" + lowest + "</dd></div>" +
              "</dl></a>";
          }).join("");

          const renderStrip = fresh => {
            wrap.classList.remove("is-confirming");
            wrap.classList.add("is-ready");
            /* Only the rebuild that follows a landing brings the glow up from
               nothing -- the replacement card arrives dark, since the clipped
               copy that flew in carries no pulse. Ordinary poll rebuilds swap a
               lit card for a lit one and must not restage that. */
            wrap.classList.toggle("is-fresh", !!fresh);
            /* The arriving card is parked on the container, not inside the
               strip, so replacing the strip's markup below would leave it
               behind. This is also the catch-all for a flight cut short by the
               next block landing mid-animation. */
            const box = wrap.closest(".sc-blocks-container");
            const enterClip = box && box.querySelector(".sc-block-enter-clip");
            if (enterClip) enterClip.remove();
            wrap.innerHTML =
              "<span class=\"sc-block-ghost\" aria-hidden=\"true\"></span>" +
              pending + "<div class=\"sc-block-connector\" aria-hidden=\"true\"><span></span></div>" + buildConfirmed(fresh);
            sizeBlockGhost();
            /* Safe to measure on this frame: nothing in a rebuilt strip carries
               an entrance transform. The landed card's own animation touches
               only border-color and the rest are held by the :not(.is-newest)
               rule, so every getBoundingClientRect() here reads a resting
               position. The wash still running over the newest card animates
               opacity. Neither of those moves geometry. */
            syncBlocksOverflow();
            measureBlocksFade();

            /* Take the class off once the cool down has played. Its animations
               are fill-mode:both, and a filled animation outranks every normal
               declaration -- so while the class is on, the card's border stops
               answering :hover and that one card lights differently from the
               rest of the row. The strip is only rebuilt when a block lands,
               so left alone it would stay that way until the next one, ten
               minutes of a card that hovers wrong. */
            const landed = fresh && wrap.querySelector(".sc-block-confirmed.is-newest");
            if (landed) {
              landed.addEventListener("animationend", function settled(e) {
                if (e.target !== landed || e.animationName !== "sc-new-block-edge") return;
                landed.removeEventListener("animationend", settled);
                landed.classList.remove("is-newest");
              });
            }
          };

          const tipHeight = blocks.length ? Number(blocks[0].height) : null;
          const isNewBlock = Number.isFinite(tipHeight) && state.tipHeight !== null && tipHeight > state.tipHeight;

          /* Here rather than beside paintSupplyAndHalving above, because that
             branch only has the tip height -- the fee totals it needs come
             with this request. */
          paintFeeShare(blocks, tipHeight);

          state.blockTimers.forEach(timer => clearTimeout(timer));
          state.blockTimers = [];

          if (isNewBlock && !reduceMotion && wrap.querySelector(".sc-block-pending")) {
            /* The breathing pulse (sc-pending-logo-pulse) runs on its own
               shared, absolute clock, unrelated to when a block happens to
               land -- so without this, the confirm flight's own glow
               (sc-confirm-glow) could start at any point in that breath,
               including its brightest. Both animations own box-shadow, and
               swapping the animation-name list is a hard cut, not a
               transition: whatever the pulse's box-shadow was on the frame
               before cuts straight to sc-confirm-glow's 0% value with no
               interpolation between them, since the two don't even share a
               shadow layer structure to interpolate across (see
               sc-confirm-glow's own comment on that constraint). Catching the
               pulse mid-peak made that cut a visible brightness drop -- a
               stutter right as the flight begins.

               sc-confirm-glow's own 0% is close to the pulse's 0%/50%/100%
               resting keyframe, so waiting for the pulse to next land there
               is what makes the handover unremarkable rather than eliminating
               the cut outright (a hard cut between two structurally different
               shadow lists can't be interpolated away). The wait is at most
               half the pulse's 3.617s period, and it is computed fresh here
               rather than read from --sc-logo-phase because that variable is
               only ever set on a full renderStrip() and can be stale by the
               time a block actually lands. */
            const PULSE_PERIOD = 3.617;
            const PULSE_HALF = PULSE_PERIOD / 2;
            const cycleElapsed = (performance.now() / 1000 + 0.5) % PULSE_PERIOD;
            const startDelayMs = ((PULSE_HALF - (cycleElapsed % PULSE_HALF)) % PULSE_HALF) * 1000;

            state.blockTimers.push(setTimeout(() => startConfirmFlight(wrap, blocks, tipHeight, pending, renderStrip), startDelayMs));
          } else {
            renderStrip(false);
          }

          if (Number.isFinite(tipHeight)) state.tipHeight = tipHeight;
        }
      } catch (err) { /* strip stays empty */ }
    };

    /* Everything that flies the pending card over to the confirmed slot once a
       new block lands. Split out from loadChain() so the pulse-phase wait
       above it can delay this as one unit without indenting the whole thing
       another level. pending and renderStrip are passed explicitly rather
       than closed over -- this runs after loadChain() has already returned,
       and both are declared local to that call (renderStrip is defined fresh
       inside its try block, not shared across calls the way the fmt* helpers
       are), so nothing here could reach them any other way. */
    const startConfirmFlight = (wrap, blocks, tipHeight, pending, renderStrip) => {
      const pendingEl = wrap.querySelector(".sc-block-pending");
      if (!pendingEl) return;
      const newest = blocks[0];

      /* Bring the next pending card from beyond the orange continuation sliver.
         It travels the same measured distance, duration and easing as the
         outgoing pending card, preserving their spacing throughout the move
         instead of letting the incoming card crowd its leading neighbour. */
      const ghostEl = wrap.querySelector(".sc-block-ghost");
      const boxEl = wrap.closest(".sc-blocks-container");
      const firstConfirmed = wrap.querySelector(".sc-block-confirmed");
      if (ghostEl && boxEl && firstConfirmed) {
        const boxRect = boxEl.getBoundingClientRect();
        const frame = ghostEl.getBoundingClientRect();
        const slot = pendingEl.getBoundingClientRect();
        const distance = firstConfirmed.getBoundingClientRect().left - slot.left;
        const holder = document.createElement("div");
        holder.innerHTML = pending;
        const incoming = holder.firstChild;
        if (incoming && distance > 0) {
          const clip = document.createElement("div");
          clip.className = "sc-block-enter-clip";
          clip.style.left = (frame.left - boxRect.left) + "px";
          clip.style.top = (slot.top - boxRect.top - 80) + "px";
          clip.style.width = (boxRect.right - frame.left) + "px";
          clip.style.height = (slot.height + 160) + "px";

          /* A second copy of a link the reader can already reach. */
          incoming.setAttribute("aria-hidden", "true");
          incoming.setAttribute("tabindex", "-1");
          incoming.style.left = (slot.left - frame.left) + "px";
          incoming.style.top = "80px";
          incoming.style.width = slot.width + "px";
          incoming.style.height = slot.height + "px";
          incoming.style.setProperty("--sc-enter-distance", distance + "px");

          clip.appendChild(incoming);
          boxEl.appendChild(clip);
        }
      }

      wrap.classList.remove("is-ready");
      wrap.classList.add("is-confirming");

      /* Crossfade each individual line whose content changes at confirmation.
         Clones preserve the outgoing text while the updated originals fade in
         underneath; unchanged lines and the card itself never blink. */
      state.blockTimers.push(setTimeout(() => {
        const kicker = pendingEl.querySelector(".sc-block-kicker");
        const height = pendingEl.querySelector(".sc-block-height");
        const age = pendingEl.querySelector(".sc-block-age");
        const terms = pendingEl.querySelectorAll("dt");
        const values = pendingEl.querySelectorAll("dd");
        const timestamp = Number.isFinite(Number(newest.timestamp)) ? Number(newest.timestamp) : Math.floor(Date.now() / 1000);
        const nextHeight = fmtInt(tipHeight);
        const nextAge = fmtBlockAge(timestamp);
        const nextTransactions = fmtInt(newest.tx_count);
        const nextFees = fmtBlockFees(newest.extras && newest.extras.totalFees);
        const lowest = newest.extras && Array.isArray(newest.extras.feeRange) && newest.extras.feeRange.length ? newest.extras.feeRange[0] : null;
        const nextLowest = fmtFeeRate(lowest);
        /* Compared per element, never per row. Each meta row holds a label and
           a value, and only one of the three rows changes its label at all --
           "Projected" becomes "Fees", while "Transactions" and "Lowest" are the
           same word on both sides. Crossfading whole rows therefore dragged two
           unchanged labels through a fade for no reason, which is most of what
           made the card look like it blinked as a whole rather than updating
           the few figures that actually moved. The height line is usually
           unchanged too: the pending card already displays the height this
           block is about to take, so the comparison drops it on its own. */
        const changingLines = [];
        const changes = (line, next) => line && line.textContent.trim() !== String(next).trim();
        const fadeIfChanged = (line, next) => { if (changes(line, next)) changingLines.push(line); };
        fadeIfChanged(kicker, "Confirmed");
        fadeIfChanged(height, nextHeight);
        fadeIfChanged(age, nextAge);
        fadeIfChanged(terms[0], "Transactions");
        fadeIfChanged(values[0], nextTransactions);
        fadeIfChanged(terms[1], "Fees");
        fadeIfChanged(values[1], nextFees);
        fadeIfChanged(terms[2], "Lowest");
        fadeIfChanged(values[2], nextLowest);

        const copyLine = line => {
          if (!line) return null;
          const parent = line.parentElement;
          if (!parent) return null;
          const parentBox = parent.getBoundingClientRect();
          const lineBox = line.getBoundingClientRect();
          const copy = line.cloneNode(true);
          copy.classList.add("sc-block-copy-old");
          copy.setAttribute("aria-hidden", "true");
          copy.style.left = (lineBox.left - parentBox.left - parent.clientLeft) + "px";
          copy.style.top = (lineBox.top - parentBox.top - parent.clientTop) + "px";
          copy.style.width = lineBox.width + "px";
          copy.style.height = lineBox.height + "px";
          copy.style.color = getComputedStyle(line).color;
          parent.appendChild(copy);
          return copy;
        };
        const oldCopies = changingLines.map(copyLine).filter(Boolean);

        pendingEl.classList.add("is-mined");
        pendingEl.dataset.blockTimestamp = timestamp;
        pendingEl.href = "https://mempool.space/block/" + newest.id;
        pendingEl.setAttribute("aria-label", "View block " + tipHeight + " on mempool.space");
        if (kicker) kicker.innerHTML = "<i class=\"bi bi-check2-circle\"></i>Confirmed";
        if (height) height.textContent = nextHeight;
        if (age) age.textContent = nextAge;
        if (terms[1]) terms[1].textContent = "Fees";
        if (terms[2]) terms[2].textContent = "Lowest";
        if (values[0]) values[0].textContent = nextTransactions;
        if (values[1]) values[1].textContent = nextFees;
        if (values[2]) values[2].textContent = nextLowest;
        changingLines.forEach(line => line.classList.add("sc-block-copy-new"));
        state.blockTimers.push(setTimeout(() => {
          oldCopies.forEach(copy => copy.remove());
          changingLines.forEach(line => line.classList.remove("sc-block-copy-new"));
        }, 240));
      }, 180));

      /* Was setTimeout(..., 1400) -- the same 1.4s the flight's CSS
         animations declare. It fired early every time: the timer counts
         from this synchronous script, but the animations don't actually
         start until the browser's next paint, so their real clock began
         a frame or so later and animationend was still ~15-20ms out
         when the timer went off. renderStrip() tore the flight down and
         swapped in the rebuilt, rest-position markup while the old
         elements were still short of their final values -- a connector
         whose position is pure layout reflow (no easing of its own to
         hide the gap) visibly hopped the rest of the way, and the
         linear glow lost its last slice mid-fade instead of reaching
         zero.

         animationend fires when the browser's own clock says the
         animation is actually done, so there is no gap left to fall
         into. Filtered to one animation because .sc-block-pending carries
         two (the flight and its glow) and both fire animationend on the
         same element -- without a filter this would run twice.

         Matched by prefix, not by exact name: under 768px the stylesheet
         swaps the whole name list for the -mobile variants, so the events
         arrive as sc-confirm-glow-mobile. An exact comparison silently
         never matched there and every phone landing fell through to the
         1700ms safety net below -- not a visible break, since that still
         rebuilds, but a ~280ms freeze on the finished flight before the
         strip caught up. The prefix covers both spellings. */
      let flightSettled = false;
      const finishFlight = () => {
        if (flightSettled) return;
        flightSettled = true;
        renderStrip(true);
      };
      pendingEl.addEventListener("animationend", function onFlightEnd(e) {
        if (e.animationName.indexOf("sc-confirm-glow") !== 0) return;
        pendingEl.removeEventListener("animationend", onFlightEnd);
        finishFlight();
      });
      /* Safety net, not the primary trigger: covers a tab that throttled
         or skipped the animationend (backgrounded, reduced-motion toggled
         mid-flight, or any other browser quirk) so the strip can't get
         stuck showing the flight forever. Comfortably past 1.4s -- the
         observed slip was under 20ms -- so it never fires ahead of the
         real thing in normal operation. */
      state.blockTimers.push(setTimeout(finishFlight, 1700));
    };

    const connectMempoolSocket = () => {
      if (state.socketStopped || !("WebSocket" in window)) return;
      const current = state.mempoolSocket;
      if (current && (current.readyState === WebSocket.OPEN || current.readyState === WebSocket.CONNECTING)) return;

      clearTimeout(state.socketReconnectTimer);
      const socket = new WebSocket("wss://mempool.space/api/v1/ws");
      state.mempoolSocket = socket;

      socket.addEventListener("open", () => {
        state.socketReconnectMs = 2000;
        state.lastSocketMessageAt = Date.now();
        socket.send(JSON.stringify({ action: "want", data: ["blocks", "mempool-blocks", "stats"] }));
      });

      socket.addEventListener("message", event => {
        state.lastSocketMessageAt = Date.now();
        let payload;
        try { payload = JSON.parse(event.data); } catch (err) { return; }

        const projectedBlocks = payload && payload["mempool-blocks"];
        if (Array.isArray(projectedBlocks) && projectedBlocks.length) {
          paintPendingBlock(projectedBlocks[0]);
        }

        if (payload && payload.fees) paintFees(payload.fees);
        if (payload && payload.mempoolInfo) paintMempool(payload.mempoolInfo, "btc");

        const blocks = payload && payload.blocks;
        const pushedHeight = Array.isArray(blocks) && blocks.length ? Number(blocks[0].height) : null;
        if (Number.isFinite(pushedHeight) && state.tipHeight !== null &&
            pushedHeight > state.tipHeight && !state.blockRefreshQueued) {
          state.blockRefreshQueued = true;
          loadChain().finally(() => { state.blockRefreshQueued = false; });
        }
      });

      socket.addEventListener("close", () => {
        if (state.mempoolSocket === socket) state.mempoolSocket = null;
        if (state.socketStopped) return;
        state.socketReconnectTimer = setTimeout(connectMempoolSocket, state.socketReconnectMs);
        state.socketReconnectMs = Math.min(state.socketReconnectMs * 2, 30000);
      });

      socket.addEventListener("error", () => socket.close());
    };

    const loadMining = async () => {
      try {
        const m = await fetchJSON("https://mempool.space/api/v1/mining/hashrate/1m");
        if (m && m.currentHashrate) {
          animateValue($("dash-hashrate"), m.currentHashrate / 1e18, v => v.toFixed(0) + " EH/s");
          state.hashrate = Number(m.currentHashrate);
          paintHashprice();
        }
        if (m && Number.isFinite(Number(m.currentDifficulty))) {
          animateValue($("dash-current-difficulty"), Number(m.currentDifficulty) / 1e12, v => v.toFixed(2) + "T");
        }
        const spark = $("dash-hash-spark");
        if (spark && Array.isArray(m.hashrates) && m.hashrates.length > 1) {
          const vals = m.hashrates.map(x => x.avgHashrate);
          const lo = Math.min(...vals), hi = Math.max(...vals), rng = (hi - lo) || 1;
          spark.innerHTML = vals.map(v =>
            "<span style=\"height:" + (18 + ((v - lo) / rng) * 82) + "%\"></span>"
          ).join("");
        }
      } catch (err) { /* tile keeps its placeholder */ }

      try {
        const d = await fetchJSON("https://mempool.space/api/v1/difficulty-adjustment");
        const chg = d.difficultyChange;
        const el = $("dash-diffchange");
        if (el) {
          el.textContent = (chg >= 0 ? "+" : "") + chg.toFixed(2) + "%";
          el.classList.toggle("is-positive", chg >= 0);
          el.classList.toggle("is-negative", chg < 0);
        }
        const note = $("dash-diffnote");
        if (note) note.textContent = fmtInt(d.remainingBlocks) + " blocks until the next retarget.";

        /* Three more fields the same response already carries. Average block
           time is the one that explains the headline: above 10 minutes means
           blocks are running slow, so difficulty drops next retarget, and
           below means the opposite. */
        const dTiers = $("dash-diff-tiers");
        if (dTiers) {
          /* Minutes and seconds, not decimal minutes: the interesting part is
             the drift either side of the 10-minute target, and "9m 56s" shows
             that far more plainly than "9.9m". */
          let avgMin = "—";
          if (d.timeAvg) {
            const totalSec = Math.round(d.timeAvg / 1000);
            avgMin = Math.floor(totalSec / 60) + "m " + (totalSec % 60) + "s";
          }
          const prev = typeof d.previousRetarget === "number"
            ? (d.previousRetarget >= 0 ? "+" : "") + d.previousRetarget.toFixed(2) + "%"
            : "—";
          const at = d.nextRetargetHeight ? fmtInt(d.nextRetargetHeight) : "—";
          dTiers.innerHTML =
            "<span><em>" + avgMin + "</em>avg block</span>" +
            "<span><em>" + prev + "</em>previous</span>" +
            "<span><em>" + at + "</em>retarget at</span>";
        }

        const bar = $("dash-diff-bar");
        if (bar) bar.style.width = Math.min(Math.max(d.progressPercent, 0), 100).toFixed(1) + "%";
        const eta = $("dash-diff-eta");
        if (eta) {
          const rawDate = Number(d.estimatedRetargetDate);
          const retargetDate = new Date(rawDate < 1e12 ? rawDate * 1000 : rawDate);
          if (!Number.isNaN(retargetDate.getTime())) {
            const remainingMs = Math.max(0, retargetDate.getTime() - Date.now());
            const totalHours = Math.max(1, Math.round(remainingMs / 36e5));
            const days = Math.floor(totalHours / 24);
            const hours = totalHours % 24;
            const countdown = days ? days + "d " + hours + "h" : totalHours + "h";
            const calendar = new Intl.DateTimeFormat("en-CA", {
              month: "short",
              day: "numeric"
            }).format(retargetDate);
            const value = eta.querySelector("strong");
            if (value) value.textContent = countdown + " · " + calendar;
          }
        }
      } catch (err) { /* tile keeps its placeholder */ }
    };

    const loadFng = async () => {
      try {
        const d = await fetchJSON("https://api.alternative.me/fng/?limit=1");
        const row = d && d.data && d.data[0];
        if (!row) return;
        const val = parseInt(row.value, 10);
        const fng = $("dash-fng");
        animateValue(fng, val, v => String(Math.round(v)));
        /* Matches the gauge arc behind it, which already runs red at 0 to
           green at 100 -- so extreme fear reads red and extreme greed green. */
        if (fng) fng.style.color = scaleColor(val / 100);
        const label = $("dash-fng-label");
        if (label) label.textContent = row.value_classification;
        /* Needle sweeps -90deg (0) to +90deg (100) across the semicircle. */
        const needle = $("dash-fng-needle");
        if (needle) needle.style.transform = "rotate(" + (val / 100 * 180 - 90) + "deg)";
        const arc = $("dash-fng-arc");
        if (arc) {
          const len = arc.getTotalLength();
          arc.style.strokeDasharray = len;
          arc.style.strokeDashoffset = len * (1 - val / 100);
        }
      } catch (err) { /* gauge keeps its placeholder */ }
    };

    // ------------------------------------------------------------- schedule
    loadHistory();
    loadPrices();
    loadFees();
    loadMempool();
    loadChain().finally(connectMempoolSocket);
    loadMining();
    loadFng();

    setInterval(loadPrices, 60000);
    /* Live fee tiers arrive with the socket's stats stream. REST remains a
       low-frequency fallback for blocked or suspended WebSocket sessions. */
    setInterval(loadFees, 300000);
    /* Socket stats keep the transaction count and fees live; this exact
       virtual-size snapshot prevents the backlog estimate from drifting. */
    setInterval(loadMempool, 60000);
    /* This clock is deliberately independent of network refreshes. */
    setInterval(tickBlockAges, 15000);
    /* The socket announces new blocks instantly and stays the primary path.
       This poll still runs unconditionally: a socket can keep chattering on
       the stats channel -- so it looks open and fresh -- while the blocks
       push we actually care about is missed, and gating the poll on socket
       health left the chain stuck in exactly that case.

       Kept polite rather than kept rare: the tip height is a single short
       text response, and the three-request refresh only follows when that
       height has actually moved. Steady state is therefore one small request
       per tick, so a much tighter interval than the old five minutes still
       costs the API less than the full refresh it replaces. */
    setInterval(async () => {
      const socket = state.mempoolSocket;
      /* readyState can't see a connection that is nominally open but has
         quietly stopped delivering data; some proxies drop idle sockets
         without ever firing "close". Force the reconnect path on a gap
         longer than the stats channel's normal chatter. */
      if (socket && socket.readyState === WebSocket.OPEN &&
          state.lastSocketMessageAt !== null &&
          Date.now() - state.lastSocketMessageAt > 120000) {
        socket.close();
      }
      try {
        const height = parseInt(await fetchText("https://mempool.space/api/blocks/tip/height"), 10);
        if (!Number.isFinite(height) || height === state.tipHeight) return;
      } catch (err) { return; /* next tick tries again */ }
      loadChain();
    }, 20000);
    setInterval(loadMining, 300000);
    setInterval(loadFng, 900000);

    /* A tab left open for hours would otherwise show a stale "updated" time
       the moment it is looked at again. */
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        tickBlockAges();
        loadPrices();
        loadFees();
        loadMempool();
        loadChain();
        connectMempoolSocket();
      }
    });

    window.addEventListener("pagehide", () => {
      state.socketStopped = true;
      clearTimeout(state.socketReconnectTimer);
      if (state.mempoolSocket) state.mempoolSocket.close();
    });

    window.addEventListener("pageshow", event => {
      if (!event.persisted) return;
      state.socketStopped = false;
      loadPrices();
      loadFees();
      loadMempool();
      loadChain().finally(connectMempoolSocket);
    });
  }

  /**
   * Scroll-reveal entrance animation for section content.
   * Skipped entirely when the visitor prefers reduced motion.
   */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      "#main-content .sc-card, #main-content .sc-detail, #main-content .sc-step, " +
      "#main-content .sc-callout, #main-content .sc-section-head, #main-content .sc-table-wrap"
    );

    revealTargets.forEach((el, index) => {
      el.classList.add("sc-reveal");
      el.style.setProperty("--sc-reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach(el => observer.observe(el));
  }
})();

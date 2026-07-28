(() => {
  "use strict";

  const pageKey = document.body.dataset.page || "home";
  const currentYear = new Date().getFullYear();

  const routes = [
    ["home", "Home", "index.html"],
    ["guides", "Guides", "guides.html"],
    ["services", "Services", "services.html"],
    ["devices", "Devices", "devices.html"],
    ["software", "Software", "software.html"],
    ["exchanges", "Exchanges", "exchanges.html"],
    ["contact", "Get Help", "contact.html"]
  ];

  const externalLink = (url, label = "Official site") =>
    `<a class="sc-text-link" href="${url}" target="_blank" rel="noopener">${label} <i class="bi bi-arrow-up-right"></i></a>`;

  const hero = (eyebrow, title, lead, actions = "", media = null) => {
    const copy = `
      <span class="sc-eyebrow">${eyebrow}</span>
      <h1>${title}</h1>
      <p class="sc-lead">${lead}</p>
      ${actions ? `<div class="sc-hero-actions">${actions}</div>` : ""}`;

    return `
      <section class="sc-hero${media ? " has-media" : ""}">
        <div class="container">
          ${media ? `
            <div class="row g-5 align-items-center">
              <div class="col-lg-7 sc-hero-copy">${copy}</div>
              <div class="col-lg-5">
                <figure class="sc-hero-media">
                  <img src="${media.src}" alt="${media.alt}" width="${media.width}" height="${media.height}" fetchpriority="high">
                </figure>
              </div>
            </div>` : copy}
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

  const productCard = ({ image, imageAlt, imageWidth, imageHeight, icon = "bi-usb-drive", title, text, tags, href }) => `
    <div class="col-md-6 col-xl-4">
      <article class="sc-card sc-product-card">
        <div class="sc-product-image">
          ${image
            ? `<img src="${image}" alt="${imageAlt || title}" width="${imageWidth}" height="${imageHeight}" loading="lazy">`
            : `<div class="sc-icon mb-0"><i class="bi ${icon}"></i></div>`}
        </div>
        <div class="sc-card-body">
          <h3>${title}</h3>
          <p>${text}</p>
          <div class="sc-tags">${tags.map(tag => `<span class="sc-tag">${tag}</span>`).join("")}</div>
          <a class="sc-text-link" href="${href}">Read details <i class="bi bi-arrow-right"></i></a>
        </div>
      </article>
    </div>`;

  const lastLinkCheck = "July 28, 2026";

  const sourceNote = links => `
    <p class="sc-source-note">
      Product details checked against ${links.map(([label, url]) =>
        `<a href="${url}" target="_blank" rel="noopener">${label}</a>`).join(", ")}.
      Features, availability, and pricing can change.
      <span class="sc-source-note-date">Links checked ${lastLinkCheck}.</span>
    </p>`;

  const pages = {
    home: {
      title: "Self Custody Canada | Practical Bitcoin Self-Custody",
      description: "Clear, practical guidance for learning how to buy bitcoin, choose a wallet, protect recovery material, and withdraw to self custody.",
      content: `
        ${hero(
          "Bitcoin self-custody, explained",
          "Say <em>NO</em><br>to counterparty risk.",
          "Practical guidance for taking control of your own money. Learn how to buy bitcoin, move it off an exchange, and protect it without turning security into a full time job.",
          `<a class="sc-btn sc-btn-primary" href="guides.html">Explore Guides <i class="bi bi-arrow-right"></i></a>
           <a class="sc-btn sc-btn-ghost" href="contact.html">Get Help</a>`
        )}

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head">
              <span class="sc-eyebrow">Choose your path</span>
              <h2>Start with the decision in front of you</h2>
              <p>You do not need to learn everything at once. Pick the part of the journey you are working on now.</p>
            </div>
            <div class="row g-4">
              ${card("bi-signpost-split", "I am brand new", "Learn the basic model: wallet, recovery backup, exchange, address, transaction, and confirmation.", "guides.html")}
              ${card("bi-shield-lock", "I need a hardware wallet", "Compare approachable, air-gapped, open-source, and advanced signing devices without a one-size-fits-all ranking.", "devices.html", "Compare hardware")}
              ${card("bi-window", "I need wallet software", "Understand which app creates transactions, which device signs them, and when mobile or desktop software makes sense.", "software.html", "Compare software")}
              ${card("bi-bank", "I need to buy bitcoin", "Compare platforms by custody model, CAD funding, purchase methods, and withdrawal workflow.", "exchanges.html", "Compare platforms")}
            </div>
          </div>
        </section>

        <section class="sc-section sc-section-muted">
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

        <section class="sc-section">
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
              <div class="col-md-4 text-md-end"><a class="sc-btn" href="guides.html">Open the guides</a></div>
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
          `<a class="sc-btn sc-btn-primary" href="#path">Start at step one</a>
           <a class="sc-btn sc-btn-ghost" href="contact.html">Ask a question</a>`,
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
          "Different devices solve<br><em>different risks.</em>",
          "Compare the security model, transaction-review experience, backup method, connectivity, and learning curve—not just a feature count.",
          `<a class="sc-btn sc-btn-primary" href="#compare">Compare devices</a>
           <a class="sc-btn sc-btn-ghost" href="coinkite.html">Explore Coinkite products</a>`,
          {
            src: "assets/img/signing-device-circuit.jpeg",
            alt: "Close-up view of components on a circuit board",
            width: 2268,
            height: 1500
          }
        )}

        <section class="sc-section">
          <div class="container">
            <div class="sc-callout mb-5">
              <h2>Before choosing a brand</h2>
              <p>Buy directly from the manufacturer or a listed authorized reseller. Check tamper evidence and device authenticity, install only official firmware, and never use recovery words supplied by a seller.</p>
            </div>
            <div class="sc-section-head"><span class="sc-eyebrow">Shortlist</span><h2>Six useful reference points</h2><p>This is not a winner-takes-all ranking. Each device represents a different balance of transparency, convenience, connectivity, and operator skill.</p></div>
            <div class="row g-4">
              ${productCard({
                image: "assets/img/devices/coldcard-q-mk5.png",
                imageAlt: "COLDCARD Q and Mk5 hardware wallets",
                imageWidth: 836,
                imageHeight: 762,
                title: "COLDCARD Q / Mk5",
                text: "Bitcoin-only signers built for air-gapped and advanced workflows, with dual secure elements and strong transaction-policy features.",
                tags: ["Bitcoin only", "Air-gap options", "Advanced"],
                href: "coinkite.html#coldcard"
              })}
              ${productCard({
                image: "assets/img/devices/trezor-safe-7-shortlist.png",
                imageAlt: "Trezor Safe 7 hardware wallet",
                imageWidth: 560,
                imageHeight: 560,
                title: "Trezor Safe 7",
                text: "Premium touchscreen device with open-source security, multiple hardware layers, encrypted Bluetooth, and broad asset support.",
                tags: ["Touchscreen", "Open source", "Multi-asset"],
                href: "#trezor"
              })}
              ${productCard({
                image: "assets/img/devices/ledger-flex.webp",
                imageAlt: "Ledger Flex hardware wallet",
                imageWidth: 2244,
                imageHeight: 1800,
                title: "Ledger Flex",
                text: "Large E Ink touchscreen and polished mobile experience backed by Ledger's Secure Element and Ledger OS security model.",
                tags: ["E Ink", "Bluetooth", "Multi-asset"],
                href: "#ledger"
              })}
              ${productCard({
                image: "assets/img/devices/blockstream-jade-plus.png",
                imageAlt: "Blockstream Jade Plus hardware wallet",
                imageWidth: 900,
                imageHeight: 900,
                title: "Blockstream Jade Plus",
                text: "Open-source Bitcoin signer with camera-based QR workflows, USB-C, Bluetooth, SD card support, and a larger display.",
                tags: ["Bitcoin + Liquid", "QR air-gap", "Open source"],
                href: "#jade"
              })}
              ${productCard({
                image: "assets/img/devices/seedsigner.png",
                imageAlt: "SeedSigner DIY Bitcoin signing device",
                imageWidth: 1080,
                imageHeight: 380,
                title: "SeedSigner",
                text: "DIY, stateless, air-gapped signing built from commodity hardware. Powerful and verifiable, but intentionally hands-on.",
                tags: ["DIY", "Stateless", "QR air-gap"],
                href: "#seedsigner"
              })}
              ${productCard({
                icon: "bi-usb-c-drive",
                title: "BitBox02 Bitcoin-only",
                text: "Compact Swiss-made signer with a secure dual-chip architecture, open-source firmware, touch controls, and microSD backup.",
                tags: ["Bitcoin only", "USB-C", "microSD backup"],
                href: "#bitbox"
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
                    <th scope="col" class="sc-coldcard-col">COLDCARD<br>Q / Mk5</th>
                    <th scope="col">Trezor<br>Safe 7</th>
                    <th scope="col">Ledger<br>Flex</th>
                    <th scope="col">Jade<br>Plus</th>
                    <th scope="col">SeedSigner</th>
                    <th scope="col">BitBox02<br>Bitcoin-only</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="sc-matrix-group"><th colspan="7">Security and auditability</th></tr>
                  <tr>
                    <th scope="row">Publicly reviewable firmware</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Public source and reproducible builds</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Open-source security design</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span><small>Proprietary Ledger OS</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Open hardware and firmware</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Open DIY software stack</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Open, deterministic builds</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Secure hardware isolation</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Two secure elements from different vendors</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Two secure elements plus MCU</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Certified Secure Element</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Alternative design">◐</span><small>Open blind-oracle virtual secure element</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Alternative design">◐</span><small>Stateless design instead of a secure element</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Secure chip plus MCU</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Bitcoin-only operation</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Bitcoin-only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional">◐</span><small>Bitcoin-only firmware option</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span><small>Multi-asset platform</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Partial">◐</span><small>Bitcoin and Liquid</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Bitcoin-only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Bitcoin-only edition</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Transaction review on device</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                  </tr>

                  <tr class="sc-matrix-group"><th colspan="7">Air gap and connectivity</th></tr>
                  <tr>
                    <th scope="row">Fully air-gapped signing path</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>QR on Q; microSD on both</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>QR or removable media</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>QR workflow</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                  </tr>
                  <tr>
                    <th scope="row">Camera-based QR signing</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-partial" aria-label="Model dependent">◐</span><small>Q only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                  </tr>
                  <tr>
                    <th scope="row">Removable media for signing</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>microSD</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>SD card or USB drive</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span><small>microSD is for backup</small></td>
                  </tr>
                  <tr>
                    <th scope="row">USB data connection</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional">◐</span><small>Optional workflow</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span><small>USB power only</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                  </tr>
                  <tr>
                    <th scope="row">Bluetooth</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                  </tr>
                  <tr>
                    <th scope="row">NFC</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                  </tr>

                  <tr class="sc-matrix-group"><th colspan="7">Backup and operating model</th></tr>
                  <tr>
                    <th scope="row">Recovery words supported</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span></td>
                  </tr>
                  <tr>
                    <th scope="row">Removable-media backup</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Encrypted microSD backup</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>SD card / SeedQR options</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Alternative">◐</span><small>SeedQR or words; not device backup</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>microSD is the default backup</small></td>
                  </tr>
                  <tr>
                    <th scope="row">Stateless signing mode</th>
                    <td class="sc-coldcard-col"><span class="sc-matrix-mark sc-matrix-no" aria-label="Not standard">—</span><small>Temporary-seed tools exist</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                    <td><span class="sc-matrix-mark sc-matrix-partial" aria-label="Optional">◐</span><small>Optional SeedQR workflow</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-yes" aria-label="Available">✓</span><small>Normal operating model</small></td>
                    <td><span class="sc-matrix-mark sc-matrix-no" aria-label="Not available">—</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="sc-source-note">Format inspired by <a href="https://coldcard.com/docs/compare-other-wallets/" target="_blank" rel="noopener noreferrer">COLDCARD's comparison</a>; feature wording and device coverage are original to this guide and checked against current manufacturer documentation. A dash does not automatically mean a device is unsafe—it may reflect a different design or workflow.</p>
          </div>
        </section>

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Detailed notes</span><h2>What each device is really optimizing for</h2></div>

            <article id="trezor" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/trezor-safe-7-detail.png" alt="Trezor Safe 7" width="660" height="1118" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Trezor Safe 7</h2><p>Trezor's current premium model combines a large colour touchscreen, open-source software, two secure elements plus a security microcontroller, encrypted Bluetooth, USB-C, wireless charging, and broad asset compatibility.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want clear on-device review and a guided companion app.</li><li>Users who value an open-source design but also want phone connectivity.</li><li>Mixed-asset owners who do not want a Bitcoin-only signer.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>A premium device adds features, battery, radios, and complexity that a long-term Bitcoin-only holder may not need.</li><li>Bluetooth can be disabled; decide whether convenience belongs in your threat model.</li></ul>${externalLink("https://trezor.io/trezor-safe-7")}</div>
              </div>
            </article>

            <article id="ledger" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/ledger-flex.webp" alt="Ledger Flex" width="2244" height="1800" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Ledger Flex</h2><p>Ledger Flex emphasizes a readable 2.84-inch E Ink touchscreen, secure on-device confirmation, multi-device connectivity, and a polished mobile/desktop ecosystem. Private keys are isolated in a certified Secure Element running Ledger OS.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who prioritize a refined interface and broad asset support.</li><li>Frequent mobile users who want Bluetooth and a larger transaction-review screen.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>The firmware security model is not fully open source; decide how much vendor trust you accept.</li><li>Understand optional recovery products before enrolling—none are required for ordinary self-managed recovery.</li></ul>${externalLink("https://shop.ledger.com/pages/ledger-flex")}</div>
              </div>
            </article>

            <article id="jade" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/blockstream-jade-plus.png" alt="Blockstream Jade Plus" width="900" height="900" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>Blockstream Jade Plus</h2><p>Jade Plus is a Bitcoin and Liquid signer with a larger display, camera, physical controls, QR signing, USB-C, Bluetooth, and SD card support. Its hardware and firmware are open source, and its security architecture uses Blockstream's virtual secure element approach.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want camera-based air-gapped signing with a modern screen.</li><li>Users who prefer auditable hardware and firmware.</li><li>Sparrow, Nunchuk, Specter, and Blockstream App workflows.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>Learn how PIN unlock, genuine check, and stateless recovery work before deciding on a backup plan.</li></ul>${externalLink("https://blockstream.com/jade/jade-plus/")}</div>
              </div>
            </article>

            <article id="seedsigner" class="sc-detail">
              <div class="row g-5 align-items-center">
                <div class="col-lg-5"><div class="sc-detail-media"><img src="assets/img/devices/seedsigner.png" alt="SeedSigner DIY Bitcoin signing device" width="1080" height="380" loading="lazy"></div></div>
                <div class="col-lg-7"><h2>SeedSigner</h2><p>SeedSigner is a community-built, air-gapped signing system typically assembled from a Raspberry Pi Zero 1.3, camera, screen, and enclosure. The device is designed to be stateless: seed material is loaded when needed and not retained after power-off.</p><h3>Strong fit</h3><ul class="sc-check-list"><li>Technically curious users who want to assemble and verify their own signer.</li><li>QR-based multisig setups and geographically separated keys.</li><li>People who value commodity parts and transparent software.</li></ul><h3>Consider</h3><ul class="sc-caution-list"><li>Correct components, software verification, enclosure assembly, SeedQR handling, and backups are your responsibility.</li><li>Not the smoothest first device for someone who wants vendor support and a guided setup.</li></ul>${externalLink("https://seedsigner.com/")}</div>
              </div>
            </article>

            <article id="bitbox" class="sc-detail">
              <h2>BitBox02 Bitcoin-only</h2>
              <p>The BitBox02 Bitcoin-only edition combines open-source firmware with a secure dual-chip design, a compact OLED display, touch sliders, USB-C, and a fast microSD backup workflow. The Bitcoin-only firmware edition is locked at the factory and cannot be switched to multi-asset firmware.</p>
              <div class="row g-4">
                <div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>People who want a compact, approachable Bitcoin-only device.</li><li>Users who like guided desktop software and microSD recovery.</li><li>Sparrow, Electrum, Specter, and personal-node users.</li></ul></div>
                <div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>Normal use is connected over USB-C rather than camera-based air gap.</li><li>The original BitBox02 does not work with iPhone/iPad; verify the current Nova model if iOS matters.</li></ul></div>
              </div>
              ${externalLink("https://bitbox.swiss/bitbox02/bitcoin-only/")}
            </article>

            ${sourceNote([
              ["COLDCARD", "https://coldcard.com/"],
              ["Trezor", "https://trezor.io/trezor-safe-7"],
              ["Ledger", "https://shop.ledger.com/pages/ledger-flex"],
              ["Blockstream", "https://blockstream.com/jade/jade-plus/"],
              ["SeedSigner", "https://seedsigner.com/"],
              ["BitBox", "https://bitbox.swiss/bitbox02/bitcoin-only/"]
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
           <a class="sc-btn sc-btn-ghost" href="devices.html">All device brands</a>`
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
      description: "Compare Sparrow, BlueWallet, Electrum, Nunchuk, and Cove Wallet by platform, hardware support, privacy, and multisig.",
      content: `
        ${hero(
          "Wallet software",
          "The app builds the transaction.<br><em>The key authorizes it.</em>",
          "Wallet software shows balances, generates receive addresses, chooses coins and fees, and broadcasts transactions. A hardware signer can keep the private key outside that app.",
          `<a class="sc-btn sc-btn-primary" href="#software-compare">Compare wallets</a>
           <a class="sc-btn sc-btn-ghost" href="devices.html">Pair with hardware</a>`
        )}

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Five useful choices</span><h2>Match software to the job</h2><p>Download only from the official project website. Verify signatures or release hashes where the project documents a verification process.</p></div>
            <div class="row g-4">
              ${card("bi-diagram-2", "Sparrow Wallet", "Desktop Bitcoin wallet with excellent PSBT, hardware, multisig, coin control, labeling, Tor, and personal-node support.", "#sparrow", "Read Sparrow notes")}
              ${card("bi-phone", "BlueWallet", "Approachable iOS and Android wallet with watch-only accounts, coin control, multisig vaults, hardware PSBT workflows, and node connections.", "#bluewallet", "Read BlueWallet notes")}
              ${card("bi-lightning", "Electrum", "Long-running desktop Bitcoin wallet with SPV verification, cold-storage workflows, multisig, plugins, and hardware support.", "#electrum", "Read Electrum notes")}
              ${card("bi-people", "Nunchuk", "Mobile and desktop wallet focused on multisig, shared wallets, hardware keys, recovery planning, and optional inheritance services.", "#nunchuk", "Read Nunchuk notes")}
            </div>
          </div>
        </section>

        <section id="software-compare" class="sc-section sc-section-muted">
          <div class="container">
            <div class="sc-table-wrap">
              <table class="table sc-table">
                <thead><tr><th>Wallet</th><th>Platforms</th><th>Best at</th><th>Hardware use</th></tr></thead>
                <tbody>
                  <tr><td><strong>Sparrow</strong></td><td>Desktop</td><td>Detailed Bitcoin control and PSBT workflows</td><td>Excellent USB, file, SD, and QR support</td></tr>
                  <tr><td><strong>BlueWallet</strong></td><td>iOS, Android</td><td>Mobile self custody and watch only monitoring</td><td>Watch only and PSBT workflows</td></tr>
                  <tr><td><strong>Electrum</strong></td><td>Desktop, Android</td><td>Fast, mature Bitcoin wallet with flexible servers</td><td>Broad plugin support</td></tr>
                  <tr><td><strong>Nunchuk</strong></td><td>Mobile, desktop</td><td>Collaborative multisig and inheritance planning</td><td>Broad hardware and NFC support</td></tr>
                  <tr><td><strong>Cove Wallet</strong></td><td>iOS, Android</td><td>Simple Bitcoin only use with UTXO management and labels</td><td>PSBT, QR, and NFC support for most hardware wallets</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="sc-section">
          <div class="container">
            <article id="sparrow" class="sc-detail"><h2>Sparrow Wallet</h2><p>Sparrow is a desktop Bitcoin wallet for users who want visibility into transactions and UTXOs. It supports single-signature and multisig policies, common script types, output descriptors, PSBTs, hardware wallets, QR signing, coin control, labeling, Tor, Bitcoin Core, and private Electrum servers.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Hardware-wallet setup and transaction review.</li><li>Coin selection, fee control, labeling, and privacy education.</li><li>Air-gapped and multisig PSBT workflows.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>A public server can learn wallet activity. Move toward your own node or private server when privacy matters.</li><li>The interface exposes more detail than a beginner mobile wallet.</li></ul></div></div>${externalLink("https://sparrowwallet.com/")}</article>
            <article id="bluewallet" class="sc-detail"><h2>BlueWallet</h2><p>BlueWallet is a mobile Bitcoin wallet with watch-only wallets, multisig vaults, coin control, fee tools, batch transactions, hardware-wallet PSBT support, and connections to personal Electrum infrastructure. It is useful both as a spending wallet and as a watch-only interface for cold storage.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Learning on mobile with small amounts.</li><li>Monitoring hardware wallets without importing private keys.</li><li>Creating or moving PSBTs for supported air-gapped devices.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>A phone is a general-purpose internet-connected device; keep long-term savings keys on dedicated hardware.</li><li>Lightning use requires a compatible node or service configuration—understand who controls the keys and channels.</li></ul></div></div>${externalLink("https://bluewallet.io/")}</article>
            <article id="electrum" class="sc-detail"><h2>Electrum</h2><p>Electrum is a mature Bitcoin wallet whose private keys stay encrypted on the local device. It uses decentralized Electrum servers, verifies transaction history with SPV, supports watch-only cold storage, multisig, and hardware-wallet plugins, and can export keys without platform lock-in.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Users who value a mature, lightweight Bitcoin-only desktop wallet.</li><li>Watch-only and offline-signing arrangements.</li><li>Custom server and hardware integrations.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>Electrum is frequently impersonated by phishing sites. Use only electrum.org and verify downloads.</li><li>Server selection affects privacy and the trust placed in transaction information.</li></ul></div></div>${externalLink("https://electrum.org/")}</article>
            <article id="nunchuk" class="sc-detail"><h2>Nunchuk</h2><p>Nunchuk focuses on single-signature and multisig wallets, shared access, air-gapped signing, broad hardware support, and optional assisted services such as recovery and inheritance planning. It supports products including COLDCARD, TAPSIGNER, Jade, SeedSigner, Trezor, Ledger, BitBox, Passport, and Keystone.</p><div class="row g-4"><div class="col-md-6"><h3>Strong fit</h3><ul class="sc-check-list"><li>Families, partners, and businesses that need multi-user multisig.</li><li>People building a deliberate inheritance or assisted-recovery plan.</li><li>NFC TAPSIGNER and multiple hardware-key setups.</li></ul></div><div class="col-md-6"><h3>Consider</h3><ul class="sc-caution-list"><li>Understand which features are self-serve and which depend on a paid service or platform key.</li><li>Back up the complete wallet configuration as well as every private key.</li></ul></div></div>${externalLink("https://nunchuk.io/")}</article>
            <div class="sc-callout mt-4"><h3>Never import hardware-wallet recovery words into ordinary software just to “connect” it</h3><p>Connect using the hardware integration, xpub, descriptor, wallet file, or PSBT process documented by the device maker. Typing the recovery phrase into an online computer defeats key isolation.</p></div>
            ${sourceNote([
              ["Sparrow", "https://sparrowwallet.com/features/"],
              ["BlueWallet", "https://bluewallet.io/features/"],
              ["Electrum", "https://electrum.org/"],
              ["Nunchuk", "https://nunchuk.io/"],
              ["Cove", "https://covebitcoin.com/"]
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
           <a class="sc-btn sc-btn-ghost" href="guides.html">Withdrawal checklist</a>`,
          {
            src: "assets/img/money-coins.jpeg",
            alt: "A collection of international coins",
            width: 422,
            height: 750
          }
        )}

        <section class="sc-section">
          <div class="container">
            <div class="sc-callout mb-5"><h2>Prices and fees are intentionally not ranked here</h2><p>Spreads, trading fees, funding fees, withdrawal charges, network fees, limits, supported assets, and provincial availability change. Check the platform's current quote and fee page before transacting.</p></div>
            <div class="sc-section-head"><span class="sc-eyebrow">Two models</span><h2>Direct-to-wallet versus custodial platform</h2></div>
            <div class="row g-4">
              <div class="col-lg-6"><article class="sc-card"><div class="sc-card-body"><div class="sc-icon"><i class="bi bi-arrow-right-circle"></i></div><h3>Direct-to-wallet broker</h3><p>You provide a wallet address and purchased bitcoin settles to that address. This reduces time held by the service but requires you to have a tested wallet first.</p><p><strong>Examples:</strong> Bull Bitcoin and Bitcoin Well describe direct self-custody purchase flows.</p></div></article></div>
              <div class="col-lg-6"><article class="sc-card"><div class="sc-card-body"><div class="sc-icon"><i class="bi bi-building-lock"></i></div><h3>Custodial exchange or app</h3><p>The platform credits bitcoin to your account and holds the keys until you withdraw. It can be convenient for trading, but account access and platform solvency remain dependencies.</p><p><strong>Examples:</strong> Shakepay, Ndax, Kraken, and Bitbuy support external withdrawals.</p></div></article></div>
            </div>
          </div>
        </section>

        <section id="exchange-compare" class="sc-section sc-section-muted">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Comparison</span><h2>Choose based on the workflow you need</h2></div>
            <div class="sc-table-wrap">
              <table class="table sc-table">
                <thead><tr><th>Platform</th><th>Custody model</th><th>CAD access</th><th>Good fit</th><th>Check before use</th></tr></thead>
                <tbody>
                  <tr><td><strong>Bull Bitcoin</strong></td><td>Bitcoin sent directly to your wallet on purchase</td><td>Interac e-Transfer and bank transfer options</td><td>Bitcoin-only, self-custody-first buying and selling</td><td>Quoted rate, spread, network fee, limits</td></tr>
                  <tr><td><strong>Bitcoin Well</strong></td><td>Automatic self-custody; no customer bitcoin held</td><td>Online portal, Interac flows, cash ATMs, OTC</td><td>Direct-to-wallet purchases and cash access</td><td>Portal vs ATM pricing, verification rules, limits</td></tr>
                  <tr><td><strong>Shakepay</strong></td><td>Custodial until withdrawn</td><td>Canadian funding with simple app experience</td><td>Easy recurring purchases and beginner workflow</td><td>Quote spread, withdrawal policy, supported assets</td></tr>
                  <tr><td><strong>Ndax</strong></td><td>Custodial trading platform</td><td>Interac and bank funding</td><td>Order-book trading and transparent posted trading fee</td><td>Spread, asset-specific withdrawal fee, limits</td></tr>
                  <tr><td><strong>Kraken</strong></td><td>Custodial global exchange</td><td>CAD, Interac, card, wire, and Canada Post options</td><td>Deeper trading tools, liquidity, and many assets</td><td>Simple-buy vs Pro pricing, funding and withdrawal fees</td></tr>
                  <tr><td><strong>Bitbuy</strong></td><td>Custodial Canadian marketplace</td><td>Interac and bank wire</td><td>Canadian regulation, Express and Pro interfaces</td><td>Quote spread, Pro fees, crypto withdrawal fee</td></tr>
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

    services: {
      title: "Self-Custody Education & Setup Support | Self Custody Canada",
      description: "Educational sessions for wallet selection, setup planning, test transactions, recovery drills, privacy, and inheritance documentation.",
      content: `
        ${hero(
          "Education and setup support",
          "Get help building a setup<br><em>you can explain and recover.</em>",
          "Practical one-on-one guidance for people who want a second set of eyes while choosing tools, planning backups, or rehearsing a transaction—without handing over control.",
          `<a class="sc-btn sc-btn-primary" href="contact.html">Contact us</a>
           <a class="sc-btn sc-btn-ghost" href="#boundaries">See service boundaries</a>`
        )}

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Ways we can help</span><h2>Focused sessions with a clear outcome</h2></div>
            <div class="row g-4">
              ${card("bi-compass", "Wallet selection", "Translate your goals, devices, experience, balance, privacy needs, and recovery constraints into a practical shortlist.", "contact.html", "Discuss your needs")}
              ${card("bi-shield-check", "Guided setup", "Walk through official setup steps, authenticity checks, backup decisions, test receives, and test sends while you retain control.", "contact.html", "Plan a session")}
              ${card("bi-arrow-repeat", "Recovery rehearsal", "Create a safe test plan for proving that your backup, passphrase process, wallet configuration, and instructions work.", "contact.html", "Review recovery")}
              ${card("bi-diagram-3", "Multisig planning", "Map keys, locations, devices, descriptors, quorum, recovery paths, and inheritance before creating a complex wallet.", "contact.html", "Plan carefully")}
            </div>
          </div>
        </section>

        <section id="boundaries" class="sc-section sc-section-muted">
          <div class="container">
            <div class="row g-5">
              <div class="col-lg-6"><div class="sc-detail h-100"><h2>What we do</h2><ul class="sc-check-list"><li>Teach concepts in plain language.</li><li>Use official vendor documentation and test amounts.</li><li>Help you compare trade-offs and document decisions.</li><li>Guide you while you operate your own devices.</li><li>Review a recovery and inheritance process without collecting secrets.</li></ul></div></div>
              <div class="col-lg-6"><div class="sc-detail h-100"><h2>What we never need</h2><ul class="sc-caution-list"><li>Your recovery words, private keys, PIN, passphrase, or wallet backup file.</li><li>Remote control of a funded wallet or exchange account.</li><li>Permission to hold, move, or trade bitcoin for you.</li><li>A percentage of your assets or transaction.</li><li>Access to tax, legal, or investment decisions outside educational scope.</li></ul></div></div>
            </div>
          </div>
        </section>

        <section class="sc-section">
          <div class="container">
            <div class="sc-section-head"><span class="sc-eyebrow">Before a session</span><h2>Prepare without exposing secrets</h2></div>
            <div class="row justify-content-center"><div class="col-lg-9">
              <div class="sc-step"><span class="sc-step-number">1</span><div><h3>Write down the outcome</h3><p>Examples: choose a first hardware wallet, complete a test withdrawal, or design a recovery drill.</p></div></div>
              <div class="sc-step"><span class="sc-step-number">2</span><div><h3>Use an unfunded or low-value test wallet</h3><p>Learning should not put meaningful savings at risk. Have a small test amount available when transactions are part of the session.</p></div></div>
              <div class="sc-step"><span class="sc-step-number">3</span><div><h3>Protect the camera and screen</h3><p>Recovery words, PINs, passphrases, QR backups, and private keys must stay out of video calls, screen sharing, recordings, and messages.</p></div></div>
              <div class="sc-step"><span class="sc-step-number">4</span><div><h3>Bring official documentation</h3><p>Use the manufacturer's current setup and recovery pages so button labels, firmware steps, and supported workflows are not guessed.</p></div></div>
            </div></div>
          </div>
        </section>

        <section class="sc-cta"><div class="container"><div class="row align-items-center"><div class="col-md-8"><h2>Have a specific custody question?</h2><p>Describe the outcome you want, the devices you already own, and your experience level—never include wallet secrets.</p></div><div class="col-md-4 text-md-end"><a class="sc-btn" href="contact.html">Get in touch</a></div></div></div></section>`
    },

    contact: {
      title: "Contact | Self Custody Canada",
      description: "Contact Self Custody Canada for educational questions about Bitcoin wallets, hardware devices, withdrawals, backups, and recovery planning.",
      content: `
        ${hero(
          "Contact",
          "Ask the question.<br><em>Keep the secrets.</em>",
          "Tell us what you are trying to accomplish and where you are stuck. Never send recovery words, private keys, PINs, passphrases, wallet files, or account credentials.",
          `<a class="sc-btn sc-btn-primary" href="mailto:info@selfcustody.ca">Email info@selfcustody.ca</a>
           <a class="sc-btn sc-btn-ghost" href="services.html">Review services</a>`
        )}

        <section class="sc-section">
          <div class="container">
            <div class="row g-5">
              <div class="col-lg-7">
                <div class="sc-detail">
                  <span class="sc-eyebrow">A useful first message</span><h2>Include context, not credentials</h2>
                  <ul class="sc-check-list">
                    <li>Your goal: first withdrawal, wallet selection, recovery rehearsal, multisig plan, or another specific outcome.</li>
                    <li>Your experience level and whether you have completed a Bitcoin transaction before.</li>
                    <li>The device and wallet-software names you are considering or already use.</li>
                    <li>Your computer or phone platform, without serial numbers or account details.</li>
                    <li>The exact public error message, with names, addresses, balances, transaction IDs, and personal data removed.</li>
                  </ul>
                  <a class="sc-btn sc-btn-primary mt-3" href="mailto:info@selfcustody.ca?subject=Self-custody%20question">Write an email <i class="bi bi-envelope"></i></a>
                </div>
              </div>
              <div class="col-lg-5">
                <div class="sc-callout"><h3>We will never ask for</h3><ul class="sc-caution-list mb-0"><li>Recovery words or a photo of them</li><li>A private key or wallet backup</li><li>Your PIN or passphrase</li><li>Remote control of a funded wallet</li><li>A “verification” transaction to an address we provide</li></ul></div>
                <div class="sc-card mt-4"><div class="sc-card-body"><div class="sc-icon"><i class="bi bi-geo-alt"></i></div><h3>Based in Ontario, Canada</h3><p>Educational content is written for a Canadian audience, but Bitcoin wallet principles are global.</p><p><a class="sc-text-link" href="mailto:info@selfcustody.ca">info@selfcustody.ca</a></p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section class="sc-section sc-section-muted">
          <div class="container">
            <div class="sc-section-head centered"><span class="sc-eyebrow">Quick answers</span><h2>Before you email</h2></div>
            <div class="row g-4">
              <div class="col-md-6"><article class="sc-detail h-100"><h3 class="mt-0">Can you recover lost recovery words?</h3><p>No. A legitimate helper cannot recreate unknown keys or bypass Bitcoin cryptography. Anyone promising guaranteed recovery may be attempting to steal additional information or payment.</p></article></div>
              <div class="col-md-6"><article class="sc-detail h-100"><h3 class="mt-0">Can you choose the best wallet for me?</h3><p>We can compare options against your needs and explain trade-offs. The final decision and custody responsibility stay with you.</p></article></div>
              <div class="col-md-6"><article class="sc-detail h-100"><h3 class="mt-0">Do you hold bitcoin for clients?</h3><p>No. The purpose is to help you understand and operate your own setup. We do not accept custody, execute trades, or take control of wallets.</p></article></div>
              <div class="col-md-6"><article class="sc-detail h-100"><h3 class="mt-0">Is this financial, legal, or tax advice?</h3><p>No. The site is educational. Use a qualified professional for investment, tax, estate, and legal decisions.</p></article></div>
            </div>
          </div>
        </section>`
    }
  };

  const renderHeader = () => {
    const links = routes.map(([key, label, href]) => {
      const active = key === pageKey ? "active" : "";
      const contactClass = key === "contact" ? "sc-contact-link" : "";
      return `<li><a class="${active} ${contactClass}" href="${href}">${label}</a></li>`;
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
            <h3>Self Custody</h3>
            <p>Clear, practical Bitcoin self custody education. Learn the system, test the recovery, and keep control of the keys.</p>
          </div>
          <div class="col-6 col-lg-2">
            <h4>Learn</h4>
            <ul class="sc-footer-links">
              <li><a href="guides.html">Guides</a></li>
              <li><a href="devices.html">Devices</a></li>
              <li><a href="software.html">Software</a></li>
              <li><a href="exchanges.html">Exchanges</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <h4>Explore</h4>
            <ul class="sc-footer-links">
              <li><a href="coinkite.html">Coinkite products</a></li>
              <li><a href="services.html">Services</a></li>
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
          <span>Ontario, Canada · <a href="mailto:info@selfcustody.ca">info@selfcustody.ca</a></span>
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

  const nav = document.getElementById("navbar");
  const toggle = document.querySelector(".mobile-nav-toggle");
  const toggleNav = () => {
    nav.classList.toggle("navbar-mobile");
    toggle.classList.toggle("bi-list");
    toggle.classList.toggle("bi-x");
    document.body.classList.toggle("sc-nav-open", nav.classList.contains("navbar-mobile"));
    toggle.setAttribute("aria-label", nav.classList.contains("navbar-mobile") ? "Close navigation" : "Open navigation");
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
      el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
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

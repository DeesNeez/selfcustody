# Licensing inventory

A working audit of who owns what in this repository, carried out before any
project-wide licence is published. **This file grants no rights and licenses
nothing.** It records what was verified, what still needs an answer, and what
must be fixed before `LICENSE`, `LICENSE-CONTENT.md`, `LICENSING.md` and
`THIRD_PARTY_NOTICES.md` can be written honestly.

Verified against `refs/heads/readme-foundation`, as of the commit that adds
this file. Commit counts and blame figures below were measured on the
pre-rewrite history and are labelled where that matters. Anything marked
**needs maintainer confirmation** could not be determined from the repository
and must be answered by the person who put the material here.

## What the audit found

1. **The outside-contributor blocker is resolved.** The history once carried a
   single commit from someone other than the maintainer, changing two CSS
   `padding` values in a file the redesign later deleted. A line-by-line blame
   taken before the history rewrite confirmed none of it survived: of 31,028
   source lines and 83 images, none originated with anyone but the maintainer.
   That commit has since been removed from this repository's history. See
   [Contributor audit](#contributor-audit).
2. **Two third-party notices are missing and one is contradictory.** The font
   notices and the LifeHash notice are resolved; both were serious because the
   standalone offline artifact carried neither. Bootstrap and Bootstrap Icons
   still ship without theirs, and `secp256k1-wasm` still contradicts itself.
   See [Notice gaps](#notice-gaps).
3. **Roughly half the images are third-party brand assets.** 39 of 83 tracked
   images are manufacturer logos, product shots or exchange marks. They cannot
   go under a project content licence. The remaining 44 need the maintainer to
   state their origin. See [Image audit](#image-audit).
4. **Project-authored prose and diagrams are cleanly owned.** This is the
   material CC BY 4.0 is actually for.

## Contributor audit

The history was authored under five maintainer aliases, across different
machines, work and personal addresses, and an earlier account. All five are
the same person. The history has since been normalized to record them under
one canonical identity, so `main` now carries a single author name and
address across 376 commits.

### What survives, by author

The question that matters is not who committed but whose expression is still
in the distributed tree. Measured with `git blame -w` across every tracked
text file, before normalization:

| Scope | Lines measured | Outside-authored |
| --- | --- | --- |
| Source tree (`build/`, `.github/`, `secp256k1-wasm/`, `fuzzing/`, root files) | 31,028 | 0 |
| Generated `docs/` | 59,512 | 0 |
| Images (83 files, by adding commit) | — | 0 |

Every line of the current tree, and every tracked image, originates with the
maintainer. Nothing in what the project distributes depends on permission
from anyone else.

### The one outside-authored commit

Before normalization, one outside-authored commit changed exactly two CSS
declarations in `docs/styles.css`:

```
-  padding: 0 1rem;              →  +  padding: 0 0 1rem 0;
-  padding: 1rem;                →  +  padding: 1rem 0;
```

That stylesheet was deleted by the site redesign, so no line of the change
survived in anything the project distributes. Two CSS shorthand values are
also very unlikely to be a copyrightable contribution in the first place. No
permission was needed to license the current tree.

The rewrite restored the preceding stylesheet blob, which left that commit and
the merge carrying it empty and allowed both to be pruned. The mechanism
matters: dropping the commit on its own would have left the merge introducing
those two lines under the maintainer's name, transferring authorship rather
than removing it. No outside-authored content survives in the rewritten
branches.

## Notice gaps

These must be fixed before licensing files are published. Each is a licence
condition the project does not meet, or did not until the row says otherwise.

| # | Component | Licence | Gap | Required action |
| --- | --- | --- | --- | --- |
| 1 | Jost and Open Sans, embedded as base64 in `docs/entropy-offline.html` | SIL OFL 1.1 | **Resolved.** Both licences are now inlined in full in both Workshop builds, beside the bytes they cover. The full text travels rather than a reference, because the offline build is a single file people pass around. | — |
| 2 | `build/vendor/fonts/` | SIL OFL 1.1 | **Resolved.** `OFL-Jost.txt` and `OFL-OpenSans.txt` are vendored from the Google Fonts directories the subsets were cut from, and `build/render.mjs` copies them into `docs/assets/fonts/` so the served copies carry them too. | — |
| 3 | `docs/assets/vendor/bootstrap/css/bootstrap.min.css` | MIT | Shipped, minified, and the `/*! … */` banner Bootstrap's dist preserves has been stripped. No notice anywhere. Also has no source under `build/` — it is a hand-placed file inside otherwise-generated output. | Restore the banner or record the notice in `THIRD_PARTY_NOTICES.md`; record the exact upstream version, which is not stated anywhere. |
| 4 | `build/vendor/bootstrap-icons/` and the generated subset in `docs/assets/vendor/bootstrap-icons/` | MIT | No licence text vendored; the generated stylesheet carries no banner. `README.md` records only "as vendored in commit a565235", not an upstream version. | Vendor the upstream `LICENSE`, record the upstream version, and carry the notice into the subset output. |
| 5 | `build/tools/lifehash.js` | BSD-2-Clause-Patent | **Resolved.** The module is now distributed under Blockchain Commons' licence, retained verbatim at `build/vendor/lifehash/LICENSE.md` from pinned commit `0444dbed` and reproduced in full inside both generated Workshop pages. EntropyLab is recorded as the public-domain adaptation layer; AndreasGassmann/lifehash as differential-testing provenance only. | — |
| 6 | `secp256k1-wasm/` | **Contradictory** | `README.md` says "The Rust wrapper is Unlicensed"; `Cargo.toml` declares `license = "Unlicense"`. Those mean opposite things — no licence at all, versus a public-domain dedication. | Decide which is intended and make both files say it. |

### How the LifeHash licence was chosen

Its provenance runs Blockchain Commons (algorithm and C++ reference) to
EntropyLab (the JavaScript implementation adapted here) to this project, with
AndreasGassmann/lifehash a parallel implementation used only for differential
testing. EntropyLab's header described its work as a "faithful port of the
reference algorithm (Blockchain Commons / the lifehash JS package)", naming two
possible sources without distinguishing them.

A question asking which was consulted is open at `w-s-bitcoin/entropylab#74`.
Rather than wait on it, the conservative answer was taken: carry Blockchain
Commons' licence, which is correct whether the implementation was translated
from their source or written from the algorithm.

The MIT implementation is excluded on evidence rather than convenience.
Normalized-token similarity between EntropyLab's file and that package sits at
the unrelated-code floor once controls are used; none of Blockchain Commons'
distinctive identifiers survive into EntropyLab although that package preserved
them; and the one substantial matching passage appears verbatim in Blockchain
Commons' own `gradients.cpp`, so the resemblance is inherited rather than
copied. The package is also never installed by the site build, never committed
and never shipped. Should upstream reply showing it was in fact a source, its
notice would need adding beside the current one.

A seventh, non-licensing note: `secp256k1-wasm/Cargo.toml` cites
"CONTRIBUTING.md §2", and `CONTRIBUTING.md` does not exist. Phase 8 of the
project plan creates it; the reference should be checked against it then.

## Software inventory

| Path | Material | Origin | Copyright holder | Proposed licence | Evidence / action |
| --- | --- | --- | --- | --- | --- |
| `build/content.mjs` | Site software and written content | Project | Maintainer | MIT for the code, CC BY 4.0 for the prose it contains | Authorship confirmed by history; the file mixes both kinds of material, so the licensing files must split it by content rather than by path. |
| `build/guides.mjs` | Educational writing plus 7 inline SVG diagrams | Project | Maintainer | CC BY 4.0 | 56 published guides, all authored in-repo. The strongest candidate for the content licence. |
| `build/render.mjs` | Static-site renderer | Project | Maintainer | MIT | Sole authorship in history. |
| `build/tools/` | Workshop implementation, crypto, guards, tests | Project, except as noted | Maintainer, except as noted | MIT | 124 commits, all from the maintainer account. Three files are adapted from elsewhere — see the third-party table. |
| `build/tools/bip39-english.txt` | BIP39 English wordlist | Upstream BIP39 | Not the project | Follows upstream | **Needs confirmation** of which source copy was used and under what terms. The wordlist is universally redistributed, but the project should still name its source. |
| `secp256k1-wasm/src/lib.rs`, `builder/` | Rust wrapper and pinned builder image | Adapted from merged [w-s-bitcoin/entropylab#103](https://github.com/w-s-bitcoin/entropylab/pull/103) | Unresolved | Unresolved | Gap 6 above. |
| `fuzzing/lifehash/fuzz.mjs` | Differential test harness | Project | Maintainer | MIT | Test tooling, never shipped. |
| `.github/workflows/` | CI configuration | Project | Maintainer | MIT | Sole authorship. |
| `docs/` | Generated composite output | Mixed | Mixed | **No single licence** | Each component keeps the licence of its source. Must not be blanket-licensed. |
| `docs/assets/vendor/` | Third-party CSS and fonts | Upstream | Upstream | Upstream | Not generated from `build/` in the Bootstrap case — see gap 3. |

## Third-party components

| Component | Where | Licence | Notice present? |
| --- | --- | --- | --- |
| Project Nayuki QR generator | `build/vendor/qr/`, inlined into both Workshop builds | MIT | **Yes** — in both source files and the shipped artifact. `assert-no-fetch.mjs` explicitly protects the notice's URL from being flagged. This is the model the others should follow. |
| EntropyLab wallet export (`sqlite-writer.js`, `wallet-dat.js`) | `build/tools/`, licence at `build/vendor/entropylab-wallet-export/LICENSE` | MIT, © 2026 Mr.Hodl and Wicked | **Yes** — full notice inline in both files and present in the shipped artifact. |
| LifeHash | `build/tools/lifehash.js`, licence at `build/vendor/lifehash/LICENSE.md` | BSD-2-Clause-Patent, © 2019 Blockchain Commons, LLC | **Yes** — reproduced in full inside both Workshop builds, beside the module it covers. Adapted from EntropyLab's implementation (`w-s-bitcoin/entropylab#74`), contributed there under that project's public-domain terms. |
| Jost, Open Sans | `build/vendor/fonts/`, copied to `docs/assets/fonts/`, embedded in the offline artifact | SIL OFL 1.1 | **No** — gaps 1 and 2. |
| Bootstrap (CSS subset) | `docs/assets/vendor/bootstrap/css/` | MIT | **No** — gap 3. |
| Bootstrap Icons | `build/vendor/bootstrap-icons/`, subset to `docs/assets/vendor/bootstrap-icons/` | MIT | **No** — gap 4. |
| libsecp256k1 (via `secp256k1-sys` 0.14.0) | Compiled into `build/tools/secp256k1-wasm-b64.js` | Upstream MIT | Licence lives in the crate source fetched at build time, not in this repo. Should be reproduced in `THIRD_PARTY_NOTICES.md`, since the compiled output ships here. |
| `lifehash` npm package 1.0.0 (Andreas Gassmann) | `fuzzing/lifehash/` dev dependency | MIT | Test-only, never shipped. Worth listing for completeness. |
| `@noble/hashes` (Paul Miller) | Transitive dev dependency of the above | MIT | Test-only, never shipped. |

## Image audit

83 tracked files under `docs/assets/img/`. Do not place this directory under a
content licence as a whole.

### Third-party marks and product images — 39 files, exclude

| Group | Count | Files |
| --- | --- | --- |
| `device-logos/` | 12 | bitbox, bitkey, coldcard, foundation, jade, krux, ledger, satscard, seedsigner (×2), tapsigner, trezor |
| `devices/` | 12 | bitbox02, bitkey, blockstream-jade-plus, coldcard-q-mk5, krux-yahboom, ledger-stax-face, prime_light, satscard, seedsigner, tapsigner, trezor-safe-7 (×2) |
| `software/` | 7 | bluewallet, cove, electrum, nunchuk, sparrow, specter, wasabi |
| `exchanges/` | 6 | bitbuy, bitcoin-well, bull-bitcoin, kraken, ndax, shakepay |
| `custody/` | 2 | casa, unchained |

These are logos, trademarks and product photography belonging to their makers.
They stay with their owners and are excluded from any project content licence.
**Needs maintainer confirmation:** on what basis each is used — press kit,
media-kit terms, explicit permission, or nominative fair use. No credit,
permission note or source URL for any of them exists anywhere in the
repository.

### Project marks — 4 files, project-owned but not CC BY

`self-custody-symbol.svg`, `self-custody-favicon.svg`, `favicon.png`,
`apple-touch-icon.png`. **Needs maintainer confirmation** that these were
authored for the project. A project logo is normally kept out of a content
licence even when the project owns it, so that reuse of the writing does not
imply endorsement.

### Unresolved provenance — 40 files, cannot be classified from the repository

35 root images plus the 5 in `cash-vortex/`. The repository contains no credit
line, EXIF policy, source note or licence record for any of them, and nothing
in `build/content.mjs` or `build/guides.mjs` attributes an image to anyone.

Coinkite-related, and possibly manufacturer-supplied — note the maintainer's
past association with Coinkite and the site's dedicated Coinkite page:

    coinkite-metal-security.jpeg   coldcard-q-mk5-devices.jpg
    coldcard-seed-word-writing.jpg  coldcard-advanced-features-seed-plate.jpg

Device-specific photography or screen captures:

    passport-setup-qr-scan.jpg      jade-setup-qr-scan.jpg
    sparrow-laptop-hardware-wallet.jpg
    recovery-test-drill-two-devices.jpg
    dashboard-network-preview-v3.jpg

Editorial and illustrative imagery:

    quickstart-desk.jpg             quickstart-dice.jpg
    quickstart-seed-words.jpg       quickstart-rabbit-portrait.webp
    quickstart-rabbit-tablet.webp   dice-entropy.jpg
    bring-your-own-entropy-dice.jpg keys-addresses-utxos-flatlay.jpg
    signing-device-circuit.jpeg     education-library.jpeg
    choosing-your-first-setup-three-shapes.jpg
    owning-your-bitcoin-key.jpg     stuck-transaction-envelope.jpg
    what-is-money-rai-stone.jpg     what-is-money-trade-beads.jpg
    what-is-money-hyperinflation-notes.jpg
    what-not-to-normalize-phone-gallery.jpg
    fiat-single-bill.png            social-preview.jpg
    hero-lock.webp                  hero-keylock.webp
    devices-hero.jpg                exchanges-hero.jpg
    software-hero.jpg               guides-library-hero.jpg
    glossary-hero.jpg

Generated or composited:

    cash-vortex/cash-vortex-core.webp        cash-vortex/controlled-orbit.webp
    cash-vortex/controlled-orbit-v2.webp     cash-vortex/exchanges-cash-vortex.png
    cash-vortex/exchanges-cash-vortex-final3.mp4

Each needs one of: original project photography, original project
illustration, manufacturer-provided, third-party with permission, licensed
stock (with the licence recorded), generated derivative (with the tool and its
output terms recorded), or unknown provenance. Only the first two, plus
anything with explicit sublicensing rights, can go under CC BY 4.0. Anything
that stays **unknown** must be excluded by name.

## Questions the maintainer must answer

Commit 3 cannot proceed until these are recorded.

1. What is the correct copyright holder line for `LICENSE` — a personal name,
   or an entity?
2. On what basis is each manufacturer logo and product image used, and does any
   of it come with terms the project should reproduce?
3. For each of the 40 unresolved images: which of the seven classes above?
   Stock licences and generation tools need naming, not just approving.
4. Is the `secp256k1-wasm` wrapper meant to be Unlicense, or unlicensed?

## What happens next

- Fix the six notice gaps. They are licence conditions, independent of any
  decision about the project's own licensing.
- Record answers to the four questions above in this file.
- Then, and only then, write `LICENSE`, `LICENSE-CONTENT.md`, `LICENSING.md`
  and `THIRD_PARTY_NOTICES.md`, and update the README's licensing section.

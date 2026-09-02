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
2. **Every third-party notice gap is closed.** The fonts, LifeHash,
   libsecp256k1, Bootstrap Icons and Bootstrap all carry their notices, in the
   place each licence needs them: inside the artifact where it is distributed
   standalone, beside the file where it is served. `secp256k1-wasm` no longer
   contradicts itself about its own terms. `build/tools/assert-notices.mjs`
   fails the build if a served stylesheet loses its notice, because two of them
   already had. See [Notice gaps](#notice-gaps).
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
| 3 | `docs/assets/vendor/bootstrap/css/bootstrap.min.css` | MIT | **Resolved.** Identified as Bootstrap 5.2.3: the file as first vendored is byte-identical to the official 5.2.3 dist, and the subset's selectors and custom properties are all present in that release. `LICENSE` is vendored from the package and reproduced in full at the top of the served file. It remains hand-maintained rather than generated, so `assert-notices.mjs` fails the build if the notice is lost or altered. | — |
| 4 | `build/vendor/bootstrap-icons/` and the generated subset in `docs/assets/vendor/bootstrap-icons/` | MIT | **Resolved.** `LICENSE.md` is vendored from the package, and `npm run icons:subset` now writes it into a bang comment at the top of the generated stylesheet, read from the vendored file so the two cannot drift. The release is identified by matching bytes against every published package rather than by date: the files are identical to 1.10.2 and 1.10.3, which differ only in `package.json` and share one `LICENSE.md`. | — |
| 5 | `build/tools/lifehash.js` | MIT **and** BSD-2-Clause-Patent | **Resolved.** The module carries both upstream licences, retained verbatim at `build/vendor/lifehash/` from pinned revisions and reproduced in full inside both generated Workshop pages. Which licences applied was settled by asking the author of the implementation it was adapted from, not by inference. | — |
| 6 | `secp256k1-wasm/` | Unlicense | **Resolved.** The maintainer confirms the wrapper is released into the public domain under The Unlicense. `README.md` no longer says "Unlicensed", which meant the opposite, and the full text is vendored at `secp256k1-wasm/LICENSE` from unlicense.org, so manifest, prose and licence text agree. The identifier is not repeated in `src/lib.rs`: that file's line numbering reaches the compiled module, so even a comment there would require regenerating the committed WebAssembly. libsecp256k1 and secp256k1-sys keep their own upstream licences. | — |

### How the LifeHash licences were established

EntropyLab's implementation described itself as a "faithful port of the
reference algorithm (Blockchain Commons / the lifehash JS package)", naming two
possible sources without saying which was consulted. The question was put to
its author at `w-s-bitcoin/entropylab#74`.

The answer: the file was written by following the reference sources function by
function — primarily Andreas Gassmann's TypeScript package (MIT), itself a port
of Blockchain Commons' C++ (BSD-2-Clause-Patent) — and re-expressing them in
that project's idiom. Explicitly not clean-room. EntropyLab's public-domain
terms cover that project's original code but cannot cover adapted upstream
expression, so they do not reach the whole module. Both notices are therefore
carried.

The traces the author cited are checkable in this repository and check out:
`runGameOfLife` and `buildFracGrid` are names from the TypeScript package —
the C++ inlines that logic and has no such functions — and both appear in our
module; the string "BitEnumerator underflow." is verbatim in the package and in
the file ours was adapted from.

**A structural comparison run here first reached the opposite conclusion**, and
the failure is recorded rather than quietly dropped. Its similarity measure
normalised every string literal to a placeholder, so the verbatim error message
was invisible to it by construction; and its identifier test probed for
Blockchain Commons' `snake_case` names rather than the TypeScript package's own
names, answering a question nobody had asked. Author testimony about how code
was written beats inference from similarity metrics whose blind spots have not
been mapped.

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
| `secp256k1-wasm/src/lib.rs`, `builder/` | Rust wrapper and pinned builder image | Adapted from merged [w-s-bitcoin/entropylab#103](https://github.com/w-s-bitcoin/entropylab/pull/103) | Maintainer | Unlicense | Confirmed by the maintainer and stated identically in `Cargo.toml` and `README.md`, with the full text at `secp256k1-wasm/LICENSE`. |
| `fuzzing/lifehash/fuzz.mjs` | Differential test harness | Project | Maintainer | MIT | Test tooling, never shipped. |
| `.github/workflows/` | CI configuration | Project | Maintainer | MIT | Sole authorship. |
| `docs/` | Generated composite output | Mixed | Mixed | **No single licence** | Each component keeps the licence of its source. Must not be blanket-licensed. |
| `docs/assets/vendor/` | Third-party CSS and fonts | Upstream | Upstream | Upstream | Not generated from `build/` in the Bootstrap case — see gap 3. |

## Third-party components

| Component | Where | Licence | Notice present? |
| --- | --- | --- | --- |
| Project Nayuki QR generator | `build/vendor/qr/`, inlined into both Workshop builds | MIT | **Yes** — in both source files and the shipped artifact. `assert-no-fetch.mjs` explicitly protects the notice's URL from being flagged. This is the model the others should follow. |
| EntropyLab wallet export (`sqlite-writer.js`, `wallet-dat.js`) | `build/tools/`, licence at `build/vendor/entropylab-wallet-export/LICENSE` | MIT, © 2026 Mr.Hodl and Wicked | **Yes** — full notice inline in both files and present in the shipped artifact. |
| LifeHash | `build/tools/lifehash.js`, licences at `build/vendor/lifehash/` | MIT, © 2022 Andreas Gassmann **and** BSD-2-Clause-Patent, © 2019 Blockchain Commons, LLC | **Yes** — both reproduced in full inside both Workshop builds, beside the module they cover. Adapted from EntropyLab's implementation (`w-s-bitcoin/entropylab#74`), which was itself adapted from both sources rather than written clean-room. |
| Jost, Open Sans | `build/vendor/fonts/`, copied to `docs/assets/fonts/`, embedded in the offline artifact | SIL OFL 1.1 | **Yes** — all three distributed forms carry it. The upstream `OFL.txt` for each family is vendored beside the source, copied to `docs/assets/fonts/` alongside the served woff2 files, and inlined in full in both Workshop builds. |
| Bootstrap (CSS subset) | `docs/assets/vendor/bootstrap/css/`, licence at `build/vendor/bootstrap/` | MIT, © 2011-2022 Twitter, Inc. and The Bootstrap Authors | **Yes** — reproduced in full at the top of the served file. Identified as 5.2.3 by byte-matching the pre-subset copy in this repository's history against the official dist. |
| Bootstrap Icons | `build/vendor/bootstrap-icons/`, subset to `docs/assets/vendor/bootstrap-icons/` | MIT, © 2019-2021 The Bootstrap Authors | **Yes** — vendored from the package and written into the generated subset's bang comment. Identified as 1.10.2/1.10.3 by byte-matching against every published release. |
| libsecp256k1 (via `secp256k1-sys` 0.14.0) | Compiled into `build/tools/secp256k1-wasm-b64.js`, licences at `build/vendor/libsecp256k1/` | MIT, © 2013 Pieter Wuille, for the C sources; CC0-1.0 for the `secp256k1-sys` FFI crate and its wasm shim | **Yes** — the MIT text is reproduced in full inside both Workshop builds beside the payload it covers. CC0 is named there and vendored in full, not reproduced, since it requires no notice. Both taken from the crate pinned in `Cargo.lock` and verified against its recorded checksum. |
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
4. *(Answered.)* libsecp256k1's MIT notice now travels inside both generated
   pages, beside the WebAssembly it describes, because the offline build is
   downloaded on its own. It will also be indexed in `THIRD_PARTY_NOTICES.md`,
   which is a convenience for readers rather than what satisfies the licence.
   `secp256k1-sys` is separately CC0-1.0 and is identified rather than
   reproduced, since that dedication asks for nothing back. Both texts are
   vendored under `build/vendor/libsecp256k1/` from the crate pinned in
   `Cargo.lock`, checked against its recorded hash.

## What happens next

- The notice gaps are closed. What remains before the licensing files can be
  written is the maintainer's own material rather than anyone else's.
- Record answers to the remaining questions above in this file.
- Then, and only then, write `LICENSE`, `LICENSE-CONTENT.md`, `LICENSING.md`
  and `THIRD_PARTY_NOTICES.md`, and update the README's licensing section.

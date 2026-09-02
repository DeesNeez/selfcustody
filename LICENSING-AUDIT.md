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
   source lines and the 83 images tracked at that time, none was added by
   anyone but the maintainer.
   That commit has since been removed from this repository's history. See
   [Contributor audit](#contributor-audit).
2. **Every third-party notice gap is closed.** The fonts, LifeHash,
   libsecp256k1, Bootstrap Icons and Bootstrap all carry their notices, in the
   place each licence needs them: inside the artifact where it is distributed
   standalone, beside the file where it is served. `secp256k1-wasm` no longer
   contradicts itself about its own terms. `build/tools/assert-notices.mjs`
   fails the build if a served stylesheet loses its notice, because two of them
   already had. See [Notice gaps](#notice-gaps).
3. **Every image now has a recorded origin, and half of them are other
   people's.** Of 81 tracked images: 39 are third-party marks and product shots,
   37 are classified from the maintainer's own account — one of those being a
   manufacturer-provided image that likewise cannot be licensed onward — 4 are
   the project's own marks, and 1 is the placeholder added here. Three images
   were removed rather than classified. What remains is not classification but
   permission and copyrightability. See [Image audit](#image-audit).
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
| Images (83 files tracked at that time, by adding commit) | — | 0 |

Every tracked image was added to the repository by the maintainer. This does
not establish creative ownership; image provenance is documented separately
below, and in several cases the picture is somebody else's work.

The same distinction applies to the table above. Blame attributes lines to
whoever committed them, which is a fact about this repository's history and not
about who authored the material. What the table does establish is narrow and
worth stating exactly: **no part of the tree depends on permission from the one
outside Git contributor whose commit was removed.** It says nothing about the
project's third-party components, which plainly do carry other people's terms —
fonts under the OFL, libsecp256k1 and several JavaScript libraries under MIT,
the FFI crate under CC0, LifeHash under two licences at once, and photographs
under the Unsplash Licence.

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
| `build/tools/bip39-english.txt` | BIP-39 English wordlist | `trezor/python-mnemonic` v0.21, the reference implementation BIP-39 names as carrying the wordlists | Pavol Rusnak | MIT | **Resolved.** Byte-identical to that release's copy and to `bitcoin/bips` (sha256 `2f5eed53…`). Licence vendored at `build/vendor/bip39/LICENSE` and carried inside both Workshop builds. |
| `secp256k1-wasm/src/lib.rs`, `builder/` | Rust wrapper and pinned builder image | Adapted from merged [w-s-bitcoin/entropylab#103](https://github.com/w-s-bitcoin/entropylab/pull/103) | Maintainer | Unlicense | Confirmed by the maintainer and stated identically in `Cargo.toml` and `README.md`, with the full text at `secp256k1-wasm/LICENSE`. |
| `fuzzing/lifehash/fuzz.mjs` | Differential test harness | Project | Maintainer | MIT | Test tooling, never shipped. |
| `.github/workflows/` | CI configuration | Project | Maintainer | MIT | Sole authorship. |
| `docs/` | Generated composite output | Mixed | Mixed | **No single licence** | Each component keeps the licence of its source. Must not be blanket-licensed. |
| `docs/assets/vendor/` | Third-party CSS and fonts | Upstream | Upstream | Upstream | Not generated from `build/` in the Bootstrap case — see gap 3. |

## Third-party components

| Component | Where | Licence | Notice present? |
| --- | --- | --- | --- |
| Project Nayuki QR generator | `build/vendor/qr/`, inlined into both Workshop builds | MIT | **Yes** — in both source files and the shipped artifact. `assert-no-fetch.mjs` explicitly protects the notice's URL from being flagged. This is the model the others should follow. |
| BIP-39 English wordlist | `build/tools/bip39-english.txt`, inlined into both Workshop builds | MIT, © 2013-2016 Pavol Rusnak | **Yes** — taken from `trezor/python-mnemonic` v0.21, which BIP-39 names as the reference implementation carrying the wordlists, and whose repository-level licence names a copyright holder. Reproduced in full beside the wordlist in both builds. The `bitcoin/bips` copy confirms the bytes are canonical; it is not the source of the grant, and declared no licence at all at the commit that added it. |
| EntropyLab wallet export (`sqlite-writer.js`, `wallet-dat.js`) | `build/tools/`, licence at `build/vendor/entropylab-wallet-export/LICENSE` | MIT, © 2026 Mr.Hodl and Wicked | **Yes** — full notice inline in both files and present in the shipped artifact. |
| LifeHash | `build/tools/lifehash.js`, licences at `build/vendor/lifehash/` | MIT, © 2022 Andreas Gassmann **and** BSD-2-Clause-Patent, © 2019 Blockchain Commons, LLC | **Yes** — both reproduced in full inside both Workshop builds, beside the module they cover. Adapted from EntropyLab's implementation (`w-s-bitcoin/entropylab#74`), which was itself adapted from both sources rather than written clean-room. |
| Jost, Open Sans | `build/vendor/fonts/`, copied to `docs/assets/fonts/`, embedded in the offline artifact | SIL OFL 1.1 | **Yes** — all three distributed forms carry it. The upstream `OFL.txt` for each family is vendored beside the source, copied to `docs/assets/fonts/` alongside the served woff2 files, and inlined in full in both Workshop builds. |
| Bootstrap (CSS subset) | `docs/assets/vendor/bootstrap/css/`, licence at `build/vendor/bootstrap/` | MIT, © 2011-2022 Twitter, Inc. and The Bootstrap Authors | **Yes** — reproduced in full at the top of the served file. Identified as 5.2.3 by byte-matching the pre-subset copy in this repository's history against the official dist. |
| Bootstrap Icons | `build/vendor/bootstrap-icons/`, subset to `docs/assets/vendor/bootstrap-icons/` | MIT, © 2019-2021 The Bootstrap Authors | **Yes** — vendored from the package and written into the generated subset's bang comment. Identified as 1.10.2/1.10.3 by byte-matching against every published release. |
| libsecp256k1 (via `secp256k1-sys` 0.14.0) | Compiled into `build/tools/secp256k1-wasm-b64.js`, licences at `build/vendor/libsecp256k1/` | MIT, © 2013 Pieter Wuille, for the C sources; CC0-1.0 for the `secp256k1-sys` FFI crate and its wasm shim | **Yes** — the MIT text is reproduced in full inside both Workshop builds beside the payload it covers. CC0 is named there and vendored in full, not reproduced, since it requires no notice. Both taken from the crate pinned in `Cargo.lock` and verified against its recorded checksum. |
| `lifehash` npm package 1.0.0 (Andreas Gassmann) | `fuzzing/lifehash/` dev dependency | MIT | Test-only, never shipped. Worth listing for completeness. |
| `@noble/hashes` (Paul Miller) | Transitive dev dependency of the above | MIT | Test-only, never shipped. |

## Image audit

81 tracked files under `docs/assets/img/`. Three images were removed rather
than classified — `education-library.jpeg`, `signing-device-circuit.jpeg` and
`coinkite-metal-security.jpeg` — and one placeholder was added in the last of
their places. Do not place this directory under a content licence as a whole.

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

### Confirmed by the maintainer - 37 files

**AI-generated images, and the project-edited or compressed versions of them - 28 files.** The maintainer keeps the originals
in a `Gen photos` folder outside the repository and states that everything in
it was generated with Google Gemini. The tracked files are compressed copies of
those originals.

Compression means the tracked bytes differ from the originals, so the mapping
was established by image content rather than by hashing files: each image was
reduced to a perceptual fingerprint (an 8x8 gradient hash) and a coarse tone
signature, and a pair was accepted only where both agreed and the aspect ratio
matched. Every row below is an exact fingerprint match with a matching tone
signature. The tone signature is what separates the three near-identical dice
sources, which the gradient hash alone ties.

| Tracked file | Original in `Gen photos` |
| --- | --- |
| `bring-your-own-entropy-dice.jpg` | `dice3.jfif` |
| `choosing-your-first-setup-three-shapes.jpg` | `hww1.jfif` |
| `coldcard-advanced-features-seed-plate.jpg` | `ccs.jfif` |
| `coldcard-seed-word-writing.jpg` | `cc1.jfif` |
| `dashboard-network-preview-v3.jpg` | `dashboard.jfif` |
| `devices-hero.jpg` | `device.jfif` |
| `dice-entropy.jpg` | `dice2.jfif` |
| `exchanges-hero.jpg` | `exchange.jfif` |
| `glossary-hero.jpg` | `glossary.jfif` |
| `guides-library-hero.jpg` | `library 2.jfif` |
| `jade-setup-qr-scan.jpg` | `jade.jfif` |
| `keys-addresses-utxos-flatlay.jpg` | `cash.jfif` |
| `owning-your-bitcoin-key.jpg` | `key.jfif` |
| `passport-setup-qr-scan.jpg` | `foudnation.jfif` |
| `quickstart-desk.jpg` | `Self custody.jfif` |
| `quickstart-rabbit-portrait.webp` | not matched — see note below |
| `quickstart-dice.jpg` | `dice.jfif` |
| `quickstart-rabbit-tablet.webp` | `rabbit3.jfif` |
| `quickstart-seed-words.jpg` | `seed words.jfif` |
| `recovery-test-drill-two-devices.jpg` | `dev2.jfif` |
| `social-preview.jpg` | `selfcustody-vault-banner.jpg` |
| `software-hero.jpg` | not matched — see note below |
| `sparrow-laptop-hardware-wallet.jpg` | `Gemini_Generated_Image_6sth86sth86sth86.jfif` |
| `stuck-transaction-envelope.jpg` | `letter.jfif` |
| `what-is-money-hyperinflation-notes.jpg` | `money.jfif` |
| `what-is-money-rai-stone.jpg` | `yap stone.jfif` |
| `what-is-money-trade-beads.jpg` | `beads.jfif` |
| `what-not-to-normalize-phone-gallery.jpg` | `photo seed.jfif` |

Recorded as AI-generated images, together with the project-edited or
compressed versions of them that the site actually serves, naming Google Gemini
as the tool used. They are deliberately **not** called generated derivatives:
that term implies a particular identified source the work derives from, and for
these there is none beyond the model itself. Where a derivative source *is*
identified — the Motionleap animation below, or the recoloured Unsplash
photograph — the audit says so and names it.

Naming Gemini is a statement about how each file was made. It asserts nothing
about Gemini itself, and nothing here settles whether the output is
copyrightable or on what terms it may be licensed onward. That question is
separate, applies to all 26 together, and is still open.

Four rows rest on the maintainer's confirmation rather than on the fingerprint
evidence, and are marked so rather than blended in with the rest.

`dashboard-network-preview-v3.jpg` and `glossary-hero.jpg` matched a `Gen
photos` original closely but not exactly: one is a crop, the other an edited
iteration.

`quickstart-rabbit-portrait.webp` and `software-hero.jpg` did not match any
original at all. Both are crops at an aspect ratio no candidate shares — the
first is portrait against landscape sources — and the comparison used here
works on whole images, so a heavy crop defeats it by construction. Absence of a
match is therefore not evidence against the maintainer's account; it is the
method reaching its limit, which is worth recording so a later reader does not
mistake the blank for a finding.

`social-preview.jpg` carries one qualification. Its base matches the folder,
but this repository's own history shows later project compositing on it: a
masked lockup, a reconstructed gradient and an added credit line. Generated
base, project-authored composition above it.

**Created for this project - 5 files.** Created for this project using
ChatGPT; ownership, copyrightability, and onward-licensing treatment are
addressed separately. The five split into artwork and an animation made from
it, and the tools differ:

| File | How it was made |
| --- | --- |
| `cash-vortex/cash-vortex-core.webp` | Created for this project using ChatGPT |
| `cash-vortex/controlled-orbit.webp` | Created for this project using ChatGPT |
| `cash-vortex/controlled-orbit-v2.webp` | Created for this project using ChatGPT |
| `cash-vortex/exchanges-cash-vortex.png` | Created for this project using ChatGPT |
| `cash-vortex/exchanges-cash-vortex-final3.mp4` | Animated in Motionleap from the Cash Vortex artwork above |

The mp4 is an animation derived from those four stills: Motionleap is the
animation and editing tool, and the stills are its source. That describes how
it was made and how it relates to them, and claims nothing further about who
owns either.

Naming a tool describes how a file was made and asserts nothing about the tool
itself. As with the AI-generated set above, whether this material is
copyrightable at all, and on what terms it may be licensed onward, are separate
questions that this audit records rather than answers.

**Unsplash photographs - 3 files.** Each is now identified to a specific
photograph rather than to the platform, which is the difference between a
recorded source and a recorded licence. Verified against the live Unsplash
pages on 2026-09-02; each states "Free to use under the Unsplash License",
which permits modification and both commercial and non-commercial use.

| File | Photograph | Photographer |
| --- | --- | --- |
| `fiat-single-bill.png` | [a one hundred dollar bill with a picture of a man's face on it](https://unsplash.com/photos/a-one-hundred-dollar-bill-with-a-picture-of-a-mans-face-on-it-7aWvQdR36Y0) (`7aWvQdR36Y0`) | engin akyurt |
| `hero-lock.webp` | [a close up of a padlock on a door](https://unsplash.com/photos/a-close-up-of-a-padlock-on-a-door-KrPulSdUetk) (`KrPulSdUetk`) | Kaffeebart |
| `hero-keylock.webp` | [a close up of a key on a door](https://unsplash.com/photos/a-close-up-of-a-key-on-a-door-LkoDqb5E3zg) (`LkoDqb5E3zg`) | Dima Solomin |

`hero-lock.webp` is a **derivative**: its colours were modified using Claude.
The Unsplash Licence permits that, and the result is still governed by it
rather than becoming project-owned, because the photograph underneath is
someone else's work.

All three are **excluded from the project-wide CC BY 4.0 licence**. They are
redistributable under the Unsplash Licence on its own terms; that is not a
grant this project can pass on as its own, and the licences differ in what they
require of a reuser.

`hero-keylock.webp` was pending until its source was supplied. It was
deliberately not classified alongside `hero-lock.webp` earlier: the two have
neighbouring filenames and turned out to have different photographers, which is
exactly why a filename is not evidence of a shared source.

**Manufacturer-provided product image - 1 file.**

    coldcard-q-mk5-devices.jpg

Supplied by the manufacturer rather than made for this project, which puts it
with the 39 marks and product shots above: excluded from any project content
licence, and still needing a basis recorded for its use.

### Removed from the repository - 3 files

    education-library.jpeg

Three images were removed rather than classified. None is distributed any
more, so no licence needs to cover them.

**`education-library.jpeg` — removed; no longer distributed.** The maintainer
rejected this image's provenance and chose removal over replacement.

An earlier revision of this audit said the file was referenced nowhere. That
was wrong: the check behind it looked at `build/content.mjs`,
`build/guides.mjs` and the generated pages, and not at the stylesheets. It was
in fact live, as the third background layer of the homepage trust section in
`docs/assets/css/site-refresh.css`, beneath two gradients that covered between
76 and 97 per cent of it. Compositing those layers put its visible contribution
at a mean of 7/255 and a maximum of 51/255, confined to the right-hand edge.

Deleting the file alone would have left the stylesheet requesting an asset that
no longer existed, so both went together: the `url()` layer was removed along
with the third entry in `background-position` and `background-size`, leaving
the two gradients over the section's own ground. The homepage was then loaded
and scrolled in full, and its network log shows no request for the file and no
404 of any kind.

**`signing-device-circuit.jpeg` — removed; no longer distributed.** Provenance
unresolved, and genuinely unused: no reference in `build/content.mjs`,
`build/guides.mjs`, any generated page, or any stylesheet. Deleting it changed
nothing that renders, so it needed no replacement.

**`coinkite-metal-security.jpeg` — removed; replaced by a placeholder.**
Provenance unresolved. Unlike the other two this one was doing visible work: it
was the hero image of `docs/coinkite.html`, at 1600x1067 with
`fetchpriority="high"`, so deleting it outright would have left that page's
hero empty.

`docs/assets/img/coinkite-hero-placeholder.png` stands in — a plain vertical
gradient in the page's own dark range, generated for the purpose, carrying no
photographic content and no provenance question. Its `alt` is empty because it
is decorative: describing a photograph that is no longer there would have been
worse than describing nothing. It is project-created and can go under whatever
licence the project's own material does.

The placeholder is temporary by intent. A replacement with a recorded source
should take its place, and the comment beside it in `build/content.mjs` says
so.

### Nothing remains unclassified

Every tracked image now has a recorded origin. The category that opened this
audit — images the repository could say nothing about — is empty.

What that does **not** mean is that the image position is settled. Three things
still stand between here and a content licence:

- The 39 third-party marks and the manufacturer product image need a **basis**
  recorded for their use — press kit, media-kit terms, explicit permission, or
  nominative fair use. A classification says what they are, not why this project
  may show them.
- Whether AI-generated images attract copyright at all, and on what terms model
  output may be licensed onward, is unresolved and applies to 28 files plus the
  five Cash Vortex assets.
- The four project marks are presumed authored for the project, and that has
  still never been written down.


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

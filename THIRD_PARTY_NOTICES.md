# Third-party notices — DRAFT

> ## ⚠ Draft — not in effect
>
> **While this notice is present, this index is under review** in
> [PR #84](https://github.com/HodlDee/selfcustody/pull/84), alongside `LICENSE`,
> `LICENSING.md` and `LICENSE-CONTENT.md`. A finalization commit, made only
> after approval, removes all four notices together.
>
> One thing this draft marking does **not** affect: the obligations below are
> upstream licences, and they bind regardless of anything this project does.
> They are already satisfied in the shipped files, which is where satisfying
> them actually happens.

This file is an **index, not the mechanism**. Every licence that requires its
notice to travel with the material already has it travelling, and this page is a
convenience for anyone wanting the whole picture in one place.

How the notice travels depends on how the component ships, and there are three
arrangements rather than one:

- **Inlined into the shipped file.** The QR generator, the BIP-39 wordlist, the
  wallet-export code, LifeHash, libsecp256k1 and the two font families all have
  their full licence text written inside both Workshop builds. That matters most
  for `entropy-offline.html`, which is downloaded on its own and has to arrive
  complete.
- **A header comment in the served file.** The Bootstrap and Bootstrap Icons
  notices sit at the top of the stylesheets the site serves, where the CSS they
  cover is. `npm run build` fails if either is removed.
- **A file beside the asset.** The fonts are also served as `woff2` binaries,
  which cannot carry a comment, so `OFL-Jost.txt` and `OFL-OpenSans.txt` sit in
  `docs/assets/fonts/` next to the files they license.

Full texts are vendored in this repository at the paths given, so they survive
independently of any upstream URL.

## Shipped components

| Component | Where it ships | Licence | Full text |
| --- | --- | --- | --- |
| Project Nayuki QR generator | `build/vendor/qr/`, inlined into both Workshop builds | MIT | in the source files and the artifact |
| BIP-39 English wordlist | `build/tools/bip39-english.txt`, inlined into both Workshop builds | MIT, © 2013–2016 Pavol Rusnak | [`build/vendor/bip39/LICENSE`](build/vendor/bip39/LICENSE) |
| EntropyLab wallet export | `build/tools/sqlite-writer.js`, `build/tools/wallet-dat.js` | MIT, © 2026 Mr.Hodl and Wicked | [`build/vendor/entropylab-wallet-export/LICENSE`](build/vendor/entropylab-wallet-export/LICENSE) |
| LifeHash | `build/tools/lifehash.js` | MIT, © 2022 Andreas Gassmann **and** BSD-2-Clause-Patent, © 2019 Blockchain Commons, LLC | [`build/vendor/lifehash/LICENSE-MIT-lifehash-ts.txt`](build/vendor/lifehash/LICENSE-MIT-lifehash-ts.txt), [`build/vendor/lifehash/LICENSE.md`](build/vendor/lifehash/LICENSE.md) |
| Jost, Open Sans | `docs/assets/fonts/`, embedded in the offline artifact | SIL OFL 1.1 | [`build/vendor/fonts/OFL-Jost.txt`](build/vendor/fonts/OFL-Jost.txt), [`build/vendor/fonts/OFL-OpenSans.txt`](build/vendor/fonts/OFL-OpenSans.txt) |
| Bootstrap 5.2.3 (CSS subset) | `docs/assets/vendor/bootstrap/css/` | MIT, © 2011–2022 Twitter, Inc. and The Bootstrap Authors | [`build/vendor/bootstrap/LICENSE`](build/vendor/bootstrap/LICENSE) |
| Bootstrap Icons 1.10.2/1.10.3 | `docs/assets/vendor/bootstrap-icons/` | MIT, © 2019–2021 The Bootstrap Authors | [`build/vendor/bootstrap-icons/LICENSE.md`](build/vendor/bootstrap-icons/LICENSE.md) |
| libsecp256k1 (C sources) | compiled into `build/tools/secp256k1-wasm-b64.js` | MIT, © 2013 Pieter Wuille | [`build/vendor/libsecp256k1/COPYING`](build/vendor/libsecp256k1/COPYING) |
| `secp256k1-sys` 0.14.0 FFI crate and wasm shim | same | CC0-1.0 | [`build/vendor/libsecp256k1/LICENSE-CC0-secp256k1-sys.txt`](build/vendor/libsecp256k1/LICENSE-CC0-secp256k1-sys.txt) |

Two of those deserve a note.

**LifeHash carries two licences, not one.** The implementation was adapted
primarily from Andreas Gassmann's TypeScript, which itself derives from
Blockchain Commons' work, so both notices travel. Carrying only the
Blockchain Commons text would drop the licence of the code actually adapted.

**CC0 is named rather than reproduced.** A public-domain dedication asks for
nothing back, so `secp256k1-sys` is identified in the shipped notices and its
text vendored here for completeness. The MIT text beside it *is* reproduced in
full, because MIT requires it.

## Development-only dependencies

Never shipped to a visitor, listed for completeness.

| Component | Where | Licence |
| --- | --- | --- |
| `lifehash` npm package 1.0.0 (Andreas Gassmann) | `fuzzing/lifehash/` | MIT |
| `@noble/hashes` (Paul Miller) | transitive dependency of the above | MIT |

## Project code with its own licence

`secp256k1-wasm/` — the Rust wrapper and pinned builder image — is
project-authored but released under **The Unlicense** rather than MIT, stated
identically in its `Cargo.toml` and `README.md`, with the full text at
[`secp256k1-wasm/LICENSE`](secp256k1-wasm/LICENSE).

## How these were identified

Every entry is **tied to pinned upstream evidence**, not inferred from dates,
filenames or package metadata. Which kind of evidence depends on the component,
and three were used:

- **Byte matching.** Bootstrap and Bootstrap Icons were identified by matching
  the vendored files against every published release until one matched. The
  BIP-39 wordlist was sourced from `trezor/python-mnemonic` v0.21 — which BIP-39
  names as the reference implementation — rather than from a copy that declared
  no licence, and confirmed byte-identical.
- **Locked checksums.** libsecp256k1 and `secp256k1-sys` were taken from the
  crate pinned in `Cargo.lock` and verified against its recorded checksum, which
  establishes the source without matching a release tree by hand.
- **Documented derivation.** LifeHash could not be settled by comparison, and an
  early attempt to do so reached the wrong answer: structural matching suggested
  a single upstream, and it took the original author's own account of the
  adaptation to establish that the code descends primarily from Andreas
  Gassmann's TypeScript, which itself derives from Blockchain Commons' work.
  Both notices travel because of that account, not because of a diff.

The third case is why the claim is worded this way. Byte matching answers "are
these the same bytes"; it does not answer "what was this adapted from", and
treating the two as one question is how a licence gets dropped.

`npm run build` runs a notice check that fails if a served stylesheet loses its
licence header, and treats a missing vendored licence as a failure in itself.
[LICENSING-AUDIT.md](LICENSING-AUDIT.md) records the evidence for each.

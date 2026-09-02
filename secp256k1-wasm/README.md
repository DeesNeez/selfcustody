# libsecp256k1 WebAssembly source

This pinned Rust crate builds the WebAssembly curve engine embedded in the
Entropy Workshop. `secp256k1-sys` vendors Bitcoin Core's libsecp256k1 C source;
the exact crate version and transitive build dependencies are locked in
`Cargo.lock`. Run `npm run build:wasm:container` to regenerate
`build/tools/secp256k1-wasm-b64.js`.

That command builds inside a published, digest-pinned image rather than on
whatever toolchain the host happens to have. It has to: `rust-toolchain.toml`
pins rustc, but almost every byte of this artifact is compiled by clang from
the vendored C sources, and nothing in the crate pins clang. Two hosts running
the same pinned rustc produced artifacts 1,713 bytes apart, both of which
passed the functional vectors. `builder/` holds the Dockerfile and the exact
package versions; `builder/fetch-inputs.sh` fetches the inputs it cannot get
from signed apt metadata, each against a recorded SHA-256.

The integration is adapted from merged EntropyLab pull request
[w-s-bitcoin/entropylab#103](https://github.com/w-s-bitcoin/entropylab/pull/103).

## Licence

The Rust wrapper in this directory -- `src/lib.rs`, `Cargo.toml`,
`rust-toolchain.toml` and `builder/` -- is released into the public domain
under **The Unlicense** (`SPDX-License-Identifier: Unlicense`), matching the
`license` field in `Cargo.toml`. The full text is in `LICENSE` beside this
file, copied verbatim from <https://unlicense.org/UNLICENSE>.

The identifier is deliberately not repeated as a comment in `src/lib.rs`, and
the reason is worth knowing before anyone adds one. That file's line numbering
reaches the compiled module: adding four comment lines to the top of it changed
the emitted WebAssembly, and CI's `build-wasm` job caught the committed
`build/tools/secp256k1-wasm-b64.js` no longer matching what the pinned builder
produces. Any edit to `src/lib.rs`, comments included, therefore costs a
regeneration through `npm run build:wasm:container` and a new artifact
checksum. The manifest and this file carry the licence instead, which costs
nothing.

This used to read "the Rust wrapper is Unlicensed", which says the opposite of
what was meant: no licence at all, rather than a public-domain dedication.
Nothing about the intended terms changed, only the wording that described them.

libsecp256k1 and secp256k1-sys are not covered by that dedication. They keep
their own upstream licences, which live in the crate source downloaded at build
time rather than in this repository. Their applicable notices must be preserved
separately; distribution of the compiled dependency is tracked in
`LICENSING-AUDIT.md`, question 4.

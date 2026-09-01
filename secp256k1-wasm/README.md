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
[w-s-bitcoin/entropylab#103](https://github.com/w-s-bitcoin/entropylab/pull/103). The Rust
wrapper is Unlicensed; libsecp256k1 and secp256k1-sys retain their upstream
licenses in the downloaded crate source used at build time.

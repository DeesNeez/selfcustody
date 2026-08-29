# libsecp256k1 WebAssembly source

This pinned Rust crate builds the WebAssembly curve engine embedded in the
Entropy Workshop. `secp256k1-sys` vendors Bitcoin Core's libsecp256k1 C source;
the exact crate version and transitive build dependencies are locked in
`Cargo.lock`. Run `npm run build:wasm` with the Rust toolchain named in
`rust-toolchain.toml` to regenerate `build/tools/secp256k1-wasm-b64.js`.

The integration is adapted from merged EntropyLab pull request #103. The Rust
wrapper is Unlicensed; libsecp256k1 and secp256k1-sys retain their upstream
licenses in the downloaded crate source used at build time.


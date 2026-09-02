# libsecp256k1 and secp256k1-sys licences

The Entropy Workshop's curve engine is compiled from these sources, and the
compiled result ships inside both generated pages. Two different licences apply
to two different parts of it, and they are kept apart deliberately.

| File | Covers | Licence |
| --- | --- | --- |
| `COPYING` | libsecp256k1's C sources — the curve implementation itself | MIT, © 2013 Pieter Wuille |
| `LICENSE-CC0-secp256k1-sys.txt` | `secp256k1-sys`, the FFI crate, including the `wasm/wasm.c` shim compiled in alongside | CC0-1.0 |

Neither is part of this project's own Unlicense dedication, which covers only
the wrapper in `secp256k1-wasm/`.

## Where they came from

Not from upstream's current HEAD. From the exact crate the build pins:

    secp256k1-sys 0.14.0
    https://static.crates.io/crates/secp256k1-sys/secp256k1-sys-0.14.0.crate
    sha256 0dba61e98ffcb8aaa452eb2be632df2f54a48f72a8facf8d275ec63610c55b7d

That hash is the one recorded for the crate in `secp256k1-wasm/Cargo.lock`, and
the download was checked against it before anything was copied out. Taking the
text from `bitcoin-core/secp256k1` at HEAD instead would describe a version of
the library this project does not build.

Extracted verbatim:

| Vendored as | From, inside the crate | sha256 |
| --- | --- | --- |
| `COPYING` | `depend/secp256k1/COPYING` | `a735999c7e5649df…` |
| `LICENSE-CC0-secp256k1-sys.txt` | `LICENSE` | `7179683e8000e6bd…` |

## What ships, and what does not

`build.rs` in that crate compiles four C files from libsecp256k1 —
`contrib/lax_der_parsing.c`, `src/precomputed_ecmult_gen.c`,
`src/precomputed_ecmult.c` and `src/secp256k1.c` — plus the crate's own
`wasm/wasm.c` against `wasm/wasm-sysroot`. That is the whole of what becomes
`build/tools/secp256k1-wasm-b64.js` and therefore the whole of what reaches a
reader.

The crate carries two further notices that are **not** vendored here, because
nothing they cover is compiled or shipped:

- `depend/secp256k1/examples/EXAMPLES_COPYING` — the example programs.
- `depend/secp256k1/src/wycheproof/WYCHEPROOF_COPYING` — test vectors from
  project Wycheproof.

Vendoring notices for material the project does not distribute would make the
record less accurate, not more.

## How the notice travels

MIT asks that its notice accompany the software, and a compiled form is still
the software. `build/tools/entropy-page.mjs` reproduces `COPYING` in full
inside the script element that carries the WebAssembly payload, in both builds
— `docs/entropy-offline.html` is downloaded and passed around on its own, so a
notice left in this directory would not travel with the engine it describes.
The same embedding guard used for the font and LifeHash notices rejects any
licence text that could break out of that comment.

CC0 is treated differently on purpose. It is a dedication that asks for nothing
in return, so its seven kilobytes of legal code are not reproduced inside every
copy of the page. It is named in the embedded notice and kept in full here,
which identifies it without weighing down the artifact.

These notices will also be indexed in `THIRD_PARTY_NOTICES.md` when that file
is written. Indexing them there is a convenience for readers; it is not what
satisfies the MIT condition, which is satisfied by the copy inside the
artifact.

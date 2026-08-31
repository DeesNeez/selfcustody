/* Wraps the compiled .wasm into the classic script the page inlines.
   Runs inside the pinned builder image too: this file is what the site
   actually ships, so an unpinned host finishing the job would weaken the
   claim from "this image reproduces the shipped artifact" to "this image
   reproduces an intermediate one". */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const wasmPath = join(
  root, 'secp256k1-wasm/target/wasm32-unknown-unknown/release/secp256k1_wasm.wasm'
);
const outPath = join(root, 'build/tools/secp256k1-wasm-b64.js');

const wasm = readFileSync(wasmPath);
const sha256 = createHash('sha256').update(wasm).digest('hex');
const output = `// GENERATED FILE - do not edit. Rebuild with \`npm run build:wasm:container\`.
// libsecp256k1 0.8.0 (vendored by secp256k1-sys 0.14.0, see
// secp256k1-wasm/Cargo.lock) compiled to WebAssembly from secp256k1-wasm/
// inside the pinned builder image (secp256k1-wasm/builder/Dockerfile) with
// Rust 1.95.0, Ubuntu clang 18.1.3 and GNU ar 2.42. wasm sha256: ${sha256}
export const SECP256K1_WASM_B64 =
  "${wasm.toString('base64')}";
`;
writeFileSync(outPath, output);
console.log(`wrapped ${wasm.length} bytes into ${outPath} (${sha256})`);

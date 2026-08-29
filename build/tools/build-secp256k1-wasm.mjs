/* Rebuilds the committed libsecp256k1 WebAssembly payload from pinned Rust
   sources. The ordinary site build needs only Node and consumes the committed
   payload; this command is the auditable source-to-artifact path used by CI. */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const crateDir = join(root, 'secp256k1-wasm');
const wasmPath = join(crateDir, 'target/wasm32-unknown-unknown/release/secp256k1_wasm.wasm');
const outPath = join(root, 'build/tools/secp256k1-wasm-b64.js');
const portablePath = value => value.replaceAll('\\', '/');
const userRoot = process.env.USERPROFILE ?? process.env.HOME ?? '';
const cargoHome = process.env.CARGO_HOME ?? (userRoot ? join(userRoot, '.cargo') : '');
const rustupHome = process.env.RUSTUP_HOME ?? (userRoot ? join(userRoot, '.rustup') : '');
const rustflags = [
  `--remap-path-prefix=${portablePath(root)}=workspace`,
  cargoHome ? `--remap-path-prefix=${portablePath(cargoHome)}=cargo` : '',
  rustupHome ? `--remap-path-prefix=${portablePath(rustupHome)}=rustup` : ''
].filter(Boolean);

execFileSync('cargo', ['build', '--locked', '--release', '--target', 'wasm32-unknown-unknown'], {
  cwd: crateDir,
  stdio: 'inherit',
  env: { ...process.env, CARGO_ENCODED_RUSTFLAGS: rustflags.join('\x1f') }
});

const wasm = readFileSync(wasmPath);
const sha256 = createHash('sha256').update(wasm).digest('hex');
const b64 = wasm.toString('base64');
const output = `// GENERATED FILE - do not edit. Rebuild with \`npm run build:wasm\`.
// libsecp256k1 0.8.0 (vendored by secp256k1-sys 0.14.0, see
// secp256k1-wasm/Cargo.lock) compiled to WebAssembly from secp256k1-wasm/
// with the pinned Rust 1.95.0 toolchain. wasm sha256: ${sha256}
export const SECP256K1_WASM_B64 =
  "${b64}";
`;

writeFileSync(outPath, output);
console.log(`Built ${wasm.length} bytes of libsecp256k1 WebAssembly (${sha256})`);

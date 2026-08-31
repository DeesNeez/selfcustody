/* Compiles secp256k1-wasm to wasm32, inside the pinned builder image.
   Separate from the wrapping step so a failure says which half broke:
   compilation of the C and Rust, or packaging of the result. */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
export const crateDir = join(root, 'secp256k1-wasm');
export const wasmPath = join(
  crateDir, 'target/wasm32-unknown-unknown/release/secp256k1_wasm.wasm'
);

const portable = value => value.split('\\').join('/');
const cargoHome = process.env.CARGO_HOME ?? '/usr/local/cargo';

/* Absolute build paths would otherwise be baked into the artifact and differ
   between machines. Inside the image they are fixed, but the remap keeps the
   output independent of where the workspace is mounted. */
const rustflags = [
  `--remap-path-prefix=${portable(root)}=workspace`,
  `--remap-path-prefix=${portable(cargoHome)}=cargo`
];

/* Dependencies are baked into the image by cargo fetch, so an ordinary
   verification build needs no network at all. --locked means the committed
   lockfile decides, and cargo checks every crate against its recorded hash. */
const offline = process.argv.includes('--offline') ? ['--offline'] : [];

execFileSync(
  'cargo',
  ['build', '--locked', ...offline, '--release', '--target', 'wasm32-unknown-unknown'],
  { cwd: crateDir, stdio: 'inherit',
    env: { ...process.env, CARGO_ENCODED_RUSTFLAGS: rustflags.join('\x1f') } }
);

const wasm = readFileSync(wasmPath);
const sha256 = createHash('sha256').update(wasm).digest('hex');
console.log(`compiled ${wasm.length} bytes of libsecp256k1 WebAssembly (${sha256})`);

/* The single public entry point for producing the committed WebAssembly.
   Identical locally and in CI: one immutable builder image produces the exact
   bytes the site ships.

   Host side does three things only -- verify the pinned inputs, build or pull
   the image, and run the two build steps inside it. Nothing that influences
   the artifact runs out here. */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const builderDir = join(root, 'secp256k1-wasm/builder');
const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: 'inherit', cwd: root, ...opts });

/* A published digest is authoritative when given: CI pins it so verification
   runs against the exact image that produced the committed bytes, rather than
   whatever a local rebuild happens to yield. */
const pinned = process.env.WASM_BUILDER_IMAGE ?? '';
let image = pinned;

if (!image) {
  run('bash', [join(builderDir, 'fetch-inputs.sh')]);
  image = 'selfcustody-wasm-builder:local';
  /* Context is the crate directory, not builder/: the Dockerfile needs
     Cargo.toml and Cargo.lock, which sit above builder/ and COPY cannot
     reach outside its context. */
  run('docker', ['build', '--platform', 'linux/amd64', '--tag', image,
    '--file', join(builderDir, 'Dockerfile'), join(root, 'secp256k1-wasm')]);
} else {
  console.log(`using pinned builder image ${image}`);
  /* A digest can name a multi-platform index as readily as a single manifest,
     so digest addressing does not by itself fix the platform -- the base image
     this builder is made from is exactly such an index. */
  run('docker', ['pull', '--platform', 'linux/amd64', '--quiet', image]);
}

/* Built or pulled, confirm what is actually in hand rather than what was
   asked for. */
const platform = execFileSync(
  'docker', ['inspect', '--format', '{{.Os}}/{{.Architecture}}', image],
  { encoding: 'utf8' }
).trim();
if (platform !== 'linux/amd64') {
  throw new Error(`builder image is ${platform}, expected linux/amd64`);
}
console.log(`builder platform: ${platform}`);

console.log('--- builder provenance ---');
run('docker', ['run', '--platform', 'linux/amd64', '--rm', image, 'cat', '/etc/wasm-builder-provenance']);

/* --offline proves the image already carries every crate it needs; a
   verification build that silently reached the network would not be
   reproducing anything. */
/* Run as the invoking user on Linux so target/ and the wrapped artifact land
   host-owned; otherwise the next step cannot clean or read them. */
const asUser = process.platform === 'linux'
  ? ['--user', `${process.getuid()}:${process.getgid()}`]
  : [];
const inContainer = [
  'run', '--platform', 'linux/amd64', '--rm', ...asUser, '-v', `${root}:/workspace`, '-w', '/workspace', image
];
console.log('--- compile ---');
run('docker', [...inContainer, 'node', 'build/tools/wasm-compile.mjs', '--offline']);
console.log('--- wrap ---');
run('docker', [...inContainer, 'node', 'build/tools/wasm-wrap.mjs']);

if (!existsSync(join(root, 'build/tools/secp256k1-wasm-b64.js'))) {
  throw new Error('builder produced no wrapped artifact');
}
console.log('done: build/tools/secp256k1-wasm-b64.js written by the pinned builder');

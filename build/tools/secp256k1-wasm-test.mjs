import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const artifactSource = readFileSync('build/tools/secp256k1-wasm-b64.js', 'utf8');
const wrapperSource = readFileSync('build/tools/secp256k1-wasm.js', 'utf8');
const declared = artifactSource.match(/wasm sha256: ([0-9a-f]{64})/);
const payload = artifactSource.match(/export const SECP256K1_WASM_B64\s*=\s*"([A-Za-z0-9+/=]+)";/);
const packed = artifactSource.match(/export const SECP256K1_WASM_GZIP_B64\s*=\s*"([A-Za-z0-9+/=]+)";/);
assert.ok(declared, 'generated artifact declares its SHA-256');
assert.ok(payload, 'generated artifact contains a base64 WebAssembly payload');
assert.ok(packed, 'generated artifact contains the builder-produced gzip payload');
assert.equal(
  createHash('sha256').update(Buffer.from(payload[1], 'base64')).digest('hex'),
  declared[1],
  'committed WebAssembly checksum'
);

const S = new Function(
  'SECP256K1_WASM_B64',
  `${wrapperSource}\nreturn EntropySecp256k1;`
)(payload[1]);
await S.ready;
assert.deepEqual(Object.keys(S).sort(),
  ['pointAdd', 'pointValidate', 'publicKeyCreate', 'ready'],
  'the JavaScript boundary exposes only the operations the Workshop uses');

const bytes = hex => new Uint8Array(hex.match(/../g).map(value => parseInt(value, 16)));
const hex = input => [...input].map(value => value.toString(16).padStart(2, '0')).join('');
const key = value => bytes(value.toString(16).padStart(64, '0'));
const G = '0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798';
const TWO_G = '02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5';

assert.equal(hex(S.publicKeyCreate(key(1n))), G, 'private key 1 maps to the published generator');
assert.equal(hex(S.publicKeyCreate(key(2n))), TWO_G, 'private key 2 maps to the published 2G point');
assert.equal(hex(S.pointAdd(bytes(G), bytes(G))), TWO_G, 'G + G equals the published 2G point');
assert.equal(hex(S.pointValidate(bytes(G))), G, 'valid compressed point round-trips');
assert.equal(S.pointValidate(bytes(G), false).length, 65, 'uncompressed serialization is available');
assert.throws(() => S.publicKeyCreate(new Uint8Array(32)), /outside/);
assert.throws(() => S.pointValidate(new Uint8Array(33)), /invalid/);

/* Exercise the branch the shipped page takes. Passing process as undefined
   makes the classic wrapper use its browser path; these are the same Web APIs
   current browsers expose, including the asynchronous DecompressionStream. */
const compressedEngine = new Function(
  'SECP256K1_WASM_GZIP_B64', 'process', 'window',
  `${wrapperSource}\nreturn EntropySecp256k1;`
)(packed[1], undefined, { __entropyWorkshopPreflightPassed: true });
await compressedEngine.ready;
assert.equal(hex(compressedEngine.publicKeyCreate(key(1n))), G,
  'the shipped gzip path restores and instantiates the tested engine');
assert.equal(hex(compressedEngine.pointAdd(bytes(G), bytes(G))), TWO_G,
  'the shipped gzip path performs curve operations');

for (const banned of ['/home/', '/Users/', '.cargo/', '.rustup/']) {
  assert.equal(Buffer.from(payload[1], 'base64').toString('latin1').includes(banned), false,
    `artifact must not expose a build-host path: ${banned}`);
}

console.log('libsecp256k1 WASM: raw and shipped gzip paths, checksum, published points, invalid inputs and host-path guard passed');

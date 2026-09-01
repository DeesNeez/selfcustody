/* The allocator's secret-hygiene contract, exercised against the actual
   WebAssembly rather than the Rust source.

   secp_free used to drop the allocation as it stood, so a private key copied
   into linear memory for one derivation stayed there until some later
   allocation happened to land on the same bytes. The Rust unit tests cover the
   allocation lifecycle on the host; this covers what the browser can observe:
   the module's own memory, before and after each call. */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const artifactSource = readFileSync('build/tools/secp256k1-wasm-b64.js', 'utf8');
const wrapperSource = readFileSync('build/tools/secp256k1-wasm.js', 'utf8');
const payload = artifactSource.match(/export const SECP256K1_WASM_B64\s*=\s*"([A-Za-z0-9+/=]+)";/);
assert.ok(payload, 'generated artifact contains a base64 WebAssembly payload');

const wasm = new WebAssembly.Instance(
  new WebAssembly.Module(Buffer.from(payload[1], 'base64')), {}
).exports;

/* A memory growth detaches old views, so take a fresh one on every read. */
const heap = () => new Uint8Array(wasm.memory.buffer);
const region = (ptr, len) => heap().slice(ptr, ptr + len);
const zeros = len => new Uint8Array(len);

/* Zero length is the case the old Vec::from_raw_parts pairing got away with by
   accident, and the one a boxed slice has to state a layout for. */
const ZERO_LENGTH = 0;
/* Around the allocator's size classes and the sizes this library actually
   uses: 32-byte scalars, 33/65-byte points, 64-byte signatures. */
const BOUNDARIES = [1, 15, 16, 31, 32, 33, 64, 65, 255, 256, 4096];

for (const len of [ZERO_LENGTH, ...BOUNDARIES]) {
  const ptr = wasm.secp_alloc(len);
  assert.notEqual(ptr, 0, `allocation of ${len} bytes returned a null pointer`);
  assert.deepEqual(region(ptr, len), zeros(len),
    `a fresh ${len}-byte allocation must arrive zero-filled`);
  wasm.secp_free(ptr, len);
}

/* Repeated cycles at one size, each written full of a distinctive byte. The
   allocator is free to hand back a different address every time; what must
   hold is that whatever it hands back is clear. */
for (let cycle = 0; cycle < 16; cycle++) {
  const len = 32;
  const ptr = wasm.secp_alloc(len);
  assert.deepEqual(region(ptr, len), zeros(len),
    `cycle ${cycle} reused a block still holding data`);
  heap().fill(0xa5, ptr, ptr + len);
  wasm.secp_free(ptr, len);
  assert.deepEqual(region(ptr, len), zeros(len),
    `cycle ${cycle} left its bytes behind after secp_free`);
}

/* The same block, freed and immediately requested again: the strongest form of
   "cleared before reuse", because the address is almost certainly identical. */
const len = 64;
const first = wasm.secp_alloc(len);
heap().fill(0xc3, first, first + len);
wasm.secp_free(first, len);
const second = wasm.secp_alloc(len);
assert.deepEqual(region(second, len), zeros(len),
  'a block handed straight back must not carry the previous contents');
wasm.secp_free(second, len);

/* And now through the wrapper, which is what the page actually calls. Its own
   zero-fill before secp_free stays in place; these assertions hold with both
   halves working, and the Rust half alone is what the unit tests pin. */
const S = new Function(
  'SECP256K1_WASM_B64',
  `${wrapperSource}\nreturn EntropySecp256k1;`
)(payload[1]);
await S.ready;

const contains = needle => {
  const hay = heap();
  outer: for (let i = 0; i + needle.length <= hay.length; i++) {
    for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
    return true;
  }
  return false;
};

/* Distinctive and valid: a scalar of repeated 0x5c bytes is inside the curve
   order, so this is the success path. */
const secret = new Uint8Array(32).fill(0x5c);
assert.equal(contains(secret), false, 'the test key must not be resident before the call');
const point = S.publicKeyCreate(secret);
assert.equal(point.length, 33, 'the success path still returns a compressed point');
assert.equal(contains(secret), false,
  'the private key must not remain in linear memory after a successful derivation');

/* The exception path. An all-0xff scalar is above the curve order, so
   libsecp256k1 rejects it and the wrapper throws -- through the same finally
   block that has to clear the buffer. A cleanup that only runs on success is
   the version of this bug that survives a happy-path test. */
const invalid = new Uint8Array(32).fill(0xff);
assert.throws(() => S.publicKeyCreate(invalid), /outside/,
  'an out-of-range scalar must still be refused');
assert.equal(contains(invalid), false,
  'a rejected private key must not remain in linear memory either');

console.log('wasm wipe: zero-length, boundary sizes, reuse, and both call paths leave no secrets');

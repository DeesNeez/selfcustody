import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const core = readFileSync('build/tools/entropy-core.js', 'utf8');
const source = readFileSync('build/tools/lifehash.js', 'utf8');
const pageSource = readFileSync('build/tools/entropy-page.mjs', 'utf8');
const btoaShim = text => Buffer.from(text, 'binary').toString('base64');
const { L, C } = new Function('btoa', `${core}\n${source}\nreturn { L: WorkshopLifeHash, C: EntropyCore };`)(btoaShim);
const shaHex = bytes => createHash('sha256').update(Buffer.from(bytes)).digest('hex');

const renderRgb = text => {
  const digest = C.sha256(C.utf8(text));
  const { runGameOfLife, buildFracGrid, selectGradient, renderColors, makeBitEnumerator } = L._internals;
  const entropy = makeBitEnumerator(digest);
  entropy.next(); entropy.next();
  return renderColors(buildFracGrid(runGameOfLife(digest)), selectGradient(entropy), entropy.next());
};

const vectors = [
  ['73c5da0a', '094d645318061f009f3d60aa1f196d9ed59868f2407d78d69c0772c02cdd21c8'],
  ['00000000', '9cae40ba1272c23df266c71dc2535bf97a033f0e7d04d46b5b538f1b3345365c'],
  ['ffffffff', '77a2d1c510c4e173e4ee1b2531dec918e40d0790c7ffb78f964a38b882cc518a'],
  ['b8688df1', 'bd129ec7b61d576013ca2c5a0c242f3ffcd1f9c33ad2e32510200122d339df8a']
];

test('LifeHash version2 RGB matches the reference vectors', () => {
  for (const [input, expected] of vectors) {
    const image = renderRgb(input);
    assert.equal(image.width, 32);
    assert.equal(image.height, 32);
    assert.equal(shaHex(image.data), expected, input);
  }
});

test('fingerprint rendering is lowercase-normalized and produces PNG', () => {
  const lower = L.fromFingerprint('73c5da0a', 2);
  const upper = L.fromFingerprint('73C5DA0A', 2);
  assert.equal(lower, upper);
  assert.match(lower, /^data:image\/png;base64,/);
  const png = Buffer.from(lower.split(',')[1], 'base64');
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 64);
  assert.equal(png.readUInt32BE(20), 64);
});

test('only 32-byte digests are accepted', () => {
  assert.throws(() => L.fromDigest(new Uint8Array(16)), /32 bytes/);
});

test('the UI renders, distinguishes, and clears both visual fingerprints', () => {
  assert.match(pageSource, /id="lifehash-base" alt="" hidden/);
  assert.match(pageSource, /id="lifehash-pass" alt="" hidden/);
  assert.match(pageSource, /paintLifeHash\('lifehash-base', base\)/);
  assert.match(pageSource, /paintLifeHash\('lifehash-pass', withPass\)/);
  assert.match(pageSource, /function clearLifeHashes\(\)/);
  assert.match(pageSource, /clearLifeHashes\(\);/);
  assert.match(pageSource, /image\.removeAttribute\('src'\)/);
});

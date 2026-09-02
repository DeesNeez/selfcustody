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

const renderFromDigest = digest => {
  const { runGameOfLife, buildFracGrid, selectGradient, renderColors, makeBitEnumerator } = L._internals;
  const entropy = makeBitEnumerator(digest);
  entropy.next(); entropy.next();
  return renderColors(buildFracGrid(runGameOfLife(digest)), selectGradient(entropy), entropy.next());
};

/* The fingerprint path Sparrow uses: decode the hex to four bytes, hash
   those. Written out here rather than called through L.fromFingerprint so the
   vectors below pin the convention itself, not just today's implementation of
   it -- if fromFingerprint went back to hashing the string, these would still
   describe what the icon is supposed to be. */
const renderFingerprint = hex =>
  renderFromDigest(C.sha256(Uint8Array.from(Buffer.from(hex, 'hex'))));

/* SHA-256 over the raw 32x32 RGB pixels, at module size 1. Produced by the
   canonical `lifehash` npm package (AndreasGassmann/lifehash), which is a
   separate implementation from this one -- so a shared bug in this port
   cannot make them agree. Pinned via w-s-bitcoin/entropylab#232, which generated and
   verified them against Sparrow's icons. */
const SPARROW_VECTORS = [
  ['73c5da0a', '09da10ffd57a4f58616a5eda313d3f0c861e79b93e1b609a012f9c3530b427b5'],
  ['00000000', '9003d9fd366ec3aa06f54d6797485114ec00c61bf85c0efafa91bd2e40176d5b'],
  ['ffffffff', 'e856f1b33dfd8eef83151de7407c3d4861581ce09f11f11f2dfc6b0219a1e51b'],
  ['b8688df1', 'd44ba038c1389003c955a6f17accfb87c98fce4e8c98c9e2a44c71067b6521fe']
];

test('fingerprint icons match the Sparrow-compatible reference vectors', () => {
  for (const [input, expected] of SPARROW_VECTORS) {
    const image = renderFingerprint(input);
    assert.equal(image.width, 32, input);
    assert.equal(image.height, 32, input);
    assert.equal(image.data.length, 32 * 32 * 3, input);
    assert.equal(shaHex(image.data), expected, `LifeHash mismatch for ${input}`);
  }
});

/* The algorithm itself, against the vector its authors published: toucan's
   LifeHashTest pins the first thirty RGB bytes of
   makeFromUTF8("Hello", VERSION2, 1, false). The vectors above check the
   fingerprint convention; this checks the generator underneath it, and it is
   the one number here that comes from the library Sparrow actually uses. */
test('the generator matches toucan\'s published "Hello" vector', () => {
  const image = renderFromDigest(C.sha256(C.utf8('Hello')));
  assert.equal(image.width, 32);
  assert.equal(image.height, 32);
  const toucan = [
    146, 126, 130, 178, 104, 92, 182, 101, 87, 202, 88, 64, 199, 89, 66,
    197, 90, 69, 182, 101, 87, 180, 102, 89, 159, 117, 114, 210, 82, 54
  ];
  assert.deepEqual([...image.data.subarray(0, toucan.length)], toucan);
});

test('fingerprint rendering is case-insensitive and produces PNG', () => {
  const lower = L.fromFingerprint('73c5da0a', 2);
  const upper = L.fromFingerprint('73C5DA0A', 2);
  assert.equal(lower, upper, 'case is irrelevant once the hex is decoded');
  assert.match(lower, /^data:image\/png;base64,/);
  const png = Buffer.from(lower.split(',')[1], 'base64');
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 64);
  assert.equal(png.readUInt32BE(20), 64);
});

/* The icon a wallet shows and the icon this page shows have to come from the
   same bytes, so the page must not draw anything for input that is not a
   fingerprint. Coercing it -- lowercasing, padding, hashing whatever arrived
   -- would produce a confident picture of nothing in particular. */
test('only eight hexadecimal characters are accepted', () => {
  for (const bad of ['', '73c5da0', '73c5da0aa', '73c5da0g', '0x73c5da0', '73 c5da0a', null, undefined]) {
    assert.throws(() => L.fromFingerprint(bad, 2), /eight hexadecimal/,
      `accepted ${JSON.stringify(bad)} as a fingerprint`);
  }
});

test('the fingerprint path hashes the decoded bytes, not the text', () => {
  const bytesConvention = shaHex(renderFingerprint('73c5da0a').data);
  const stringConvention = shaHex(renderFromDigest(C.sha256(C.utf8('73c5da0a'))).data);
  assert.notEqual(bytesConvention, stringConvention,
    'the two conventions must differ, or these vectors prove nothing');
  assert.equal(bytesConvention, SPARROW_VECTORS[0][1]);
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

/* Anchored to the fingerprint box, not to the word "Sparrow" anywhere on the
   page -- it already appears twice in the descriptor notes, so a loose match
   would pass without the label existing. */
test('the page says which LifeHash convention its icons follow', () => {
  const note = pageSource.match(/<p class="hint" id="lifehash-note">([\s\S]*?)<\/p>/);
  assert.ok(note, 'the fingerprint box must carry a note about the icon convention');
  assert.match(note[1], /same icon Sparrow draws/,
    'the note must say the icon matches Sparrow');
  assert.match(note[1], /lifehash\.info/,
    'the note must name the older convention earlier icons used');
  assert.match(pageSource, /Sparrow-compatible LifeHash visual fingerprint for/,
    'the alt text must say which convention the image follows');
});

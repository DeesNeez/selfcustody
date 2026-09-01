/* Differential test: the Workshop's LifeHash against the canonical one.
 *
 * build/tools/lifehash.js is a port. Four pinned vectors say the port agrees
 * with the original on four inputs; they say nothing about the other four
 * billion fingerprints, and the parts most likely to diverge -- gradient
 * selection, the two symmetries, the fractal grid -- are chosen by bits of the
 * digest, so which path a given input takes is effectively random. This runs
 * both implementations over many inputs and compares the finished images.
 *
 * The comparison is of the public pipeline, not the internals: the Workshop's
 * PNG data URL is decoded back to RGB and must equal the canonical library's
 * pixels. A shared misunderstanding of the algorithm cannot hide there,
 * because the two sides share no code.
 *
 * Isolated on purpose. The dependency lives in fuzzing/lifehash/ with its own
 * lockfile; the site has no dependencies and this does not give it one. It is
 * a test tool, it runs in CI, and nothing it imports reaches the artifact.
 *
 *   node fuzz.mjs
 *   FUZZ_SEED=0xdeadbeef FUZZ_ITERATIONS=25 node fuzz.mjs
 */

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LifeHash, LifeHashVersion } from 'lifehash';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const load = () => {
  const core = readFileSync(join(root, 'build/tools/entropy-core.js'), 'utf8');
  const source = readFileSync(join(root, 'build/tools/lifehash.js'), 'utf8');
  const btoaShim = text => Buffer.from(text, 'binary').toString('base64');
  return new Function('btoa', `${core}\n${source}\nreturn WorkshopLifeHash;`)(btoaShim);
};

/* The Workshop writes every row with filter 0 and stores its deflate blocks
   uncompressed, but this decodes generically enough not to depend on that:
   inflate, then strip the one filter byte each row carries. A non-zero filter
   would be caught here rather than silently mis-decoded. */
const decodePng = dataUrl => {
  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], 'PNG signature');
  let at = 8;
  let width = 0, height = 0;
  const idat = [];
  while (at < png.length) {
    const length = png.readUInt32BE(at);
    const type = png.toString('ascii', at + 4, at + 8);
    const body = png.subarray(at + 8, at + 8 + length);
    if (type === 'IHDR') {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      assert.equal(body[8], 8, 'bit depth');
      assert.equal(body[9], 2, 'colour type must be truecolour RGB');
    } else if (type === 'IDAT') {
      idat.push(body);
    }
    at += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 3;
  const rgb = new Uint8Array(stride * height);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    assert.equal(filter, 0, `row ${y} uses PNG filter ${filter}; this decoder assumes none`);
    rgb.set(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)), y * stride);
  }
  return { width, height, rgb };
};

const canonical = (bytes, moduleSize) => {
  const image = LifeHash.makeFrom(bytes, LifeHashVersion.version2, moduleSize, false);
  return {
    width: image.width,
    height: image.height,
    rgb: Uint8Array.from(image.colors)
  };
};

const hexToBytes = hex => Uint8Array.from(Buffer.from(hex, 'hex'));
const sha = bytes => createHash('sha256').update(Buffer.from(bytes)).digest('hex');

const workshop = load();

/* Before comparing anything, prove both sides still produce the icon this
   repository has pinned. A fuzzer that silently compares nothing to nothing
   passes every run; this is the assertion that makes that impossible. */
const PINNED = ['73c5da0a', '09da10ffd57a4f58616a5eda313d3f0c861e79b93e1b609a012f9c3530b427b5'];
assert.equal(sha(canonical(hexToBytes(PINNED[0]), 1).rgb), PINNED[1],
  'the canonical library no longer produces the pinned vector');
assert.equal(sha(decodePng(workshop.fromFingerprint(PINNED[0], 1)).rgb), PINNED[1],
  'the Workshop no longer produces the pinned vector');

/* Fixed edges first: all-zero and all-one digests, the byte boundaries, and a
   few fingerprints that happen to select different gradient families. */
const EDGES = [
  '00000000', 'ffffffff', '00000001', '80000000', '7fffffff', 'ff000000',
  '000000ff', '73c5da0a', 'b8688df1', 'deadbeef', '0f0f0f0f', 'f0f0f0f0',
  'a5a5a5a5'
];

/* xorshift32: deterministic, seedable, and not used for anything but choosing
   test inputs. No entropy this project depends on comes from here. */
const seed = Number(process.env.FUZZ_SEED ?? 0x5ec0c7d1) >>> 0;
const iterations = Number(process.env.FUZZ_ITERATIONS ?? 300);
let state = seed || 1;
const next = () => {
  state ^= state << 13; state >>>= 0;
  state ^= state >>> 17;
  state ^= state << 5; state >>>= 0;
  return state;
};

const inputs = [...EDGES];
for (let i = 0; i < iterations; i++) inputs.push(next().toString(16).padStart(8, '0'));

let comparisons = 0;
for (const hex of inputs) {
  for (const moduleSize of [1, 2, 3]) {
    const mine = decodePng(workshop.fromFingerprint(hex, moduleSize));
    const theirs = canonical(hexToBytes(hex), moduleSize);
    const where = `fingerprint ${hex}, module size ${moduleSize} (FUZZ_SEED=0x${seed.toString(16)})`;
    assert.equal(mine.width, theirs.width, `width differs for ${where}`);
    assert.equal(mine.height, theirs.height, `height differs for ${where}`);
    if (Buffer.compare(Buffer.from(mine.rgb), Buffer.from(theirs.rgb)) !== 0) {
      const pixel = mine.rgb.findIndex((value, index) => value !== theirs.rgb[index]);
      assert.fail(`pixels differ for ${where}: first at byte ${pixel}, ` +
        `workshop ${mine.rgb[pixel]} vs canonical ${theirs.rgb[pixel]}`);
    }
    comparisons++;
  }
}

console.log(`lifehash differential: ${comparisons} comparisons over ${inputs.length} inputs, 0 mismatches`);

/* LifeHash version2.

   LifeHash originates with Blockchain Commons, whose C++ implementation is its
   reference. This module is adapted from EntropyLab's JavaScript
   implementation of it, contributed there under that project's public-domain
   terms (w-s-bitcoin/entropylab#74).

   This module and the modifications made to it here are distributed under the
   BSD-2-Clause-Patent licence, retained in full at
   build/vendor/lifehash/LICENSE.md and carried inside both generated Workshop
   pages. AndreasGassmann/lifehash is a separate implementation used only to
   check this one in fuzzing/lifehash; nothing from it is present here.

   The reference algorithm is preserved, but SHA-256 comes from EntropyCore so
   the offline page adds no browser API or network dependency.

   Fingerprints are hashed as raw bytes, which is what Sparrow shows. See
   fromFingerprint for why, and for what it means for icons from earlier
   Workshop releases. */
const WorkshopLifeHash = (() => {
  const C = EntropyCore;
  const SIZE = 16;
  const MAX_GENERATIONS = 150;
  const sha256 = bytes => C.sha256(bytes);

  const makeBitEnumerator = data => {
    let index = 0, mask = 128;
    const hasNext = () => mask !== 0 || index !== data.length - 1;
    const next = () => {
      if (!hasNext()) throw new Error('LifeHash bit stream ended early.');
      if (mask === 0) { mask = 128; index += 1; }
      const bit = (data[index] & mask) !== 0;
      mask >>= 1;
      return bit;
    };
    const nextBits = (bitMask, bits) => {
      let value = 0, bit = bitMask;
      for (let i = 0; i < bits; i += 1) { if (next()) value |= bit; bit >>= 1; }
      return value;
    };
    return { next, nextUint2: () => nextBits(2, 2), nextFrac: () => nextBits(32768, 16) / 65535 };
  };

  const gridIndex = (x, y) => y * SIZE + x;
  const wrap = i => (i + SIZE) % SIZE;
  const countNeighbors = (cells, x, y) => {
    let total = 0;
    for (let oy = -1; oy <= 1; oy += 1) for (let ox = -1; ox <= 1; ox += 1) {
      if ((ox || oy) && cells[gridIndex(wrap(x + ox), wrap(y + oy))]) total += 1;
    }
    return total;
  };
  const cellsToBytes = cells => {
    const out = new Uint8Array(SIZE * SIZE / 8);
    for (let i = 0; i < SIZE * SIZE; i += 1) if (cells[i]) out[i >> 3] |= 128 >> (i & 7);
    return out;
  };
  const runGameOfLife = digest => {
    const seed = sha256(digest);
    let cells = Array(SIZE * SIZE).fill(false);
    for (let i = 0; i < cells.length; i += 1) cells[i] = (seed[i >> 3] & (128 >> (i & 7))) !== 0;
    const seen = new Set(), history = [];
    while (history.length < MAX_GENERATIONS) {
      const data = cellsToBytes(cells);
      const key = [...sha256(data)].join(',');
      if (seen.has(key)) break;
      seen.add(key);
      history.push(data);
      const next = Array(SIZE * SIZE).fill(false);
      for (let y = 0; y < SIZE; y += 1) for (let x = 0; x < SIZE; x += 1) {
        const neighbors = countNeighbors(cells, x, y);
        next[gridIndex(x, y)] = cells[gridIndex(x, y)] ? neighbors === 2 || neighbors === 3 : neighbors === 3;
      }
      cells = next;
    }
    return history;
  };

  const clamp01 = n => Math.max(0, Math.min(1, n));
  const lerpTo = (a, b, t) => t * (b - a) + a;
  const lerpFrom = (a, b, t) => (a - t) / (a - b);
  const modulo = (a, b) => ((a % b) + b) % b;
  const rgb = (r, g, b) => ({ r, g, b });
  const lerpColor = (a, b, t) => {
    const f = clamp01(t);
    return rgb(clamp01(a.r * (1 - f) + b.r * f), clamp01(a.g * (1 - f) + b.g * f), clamp01(a.b * (1 - f) + b.b * f));
  };
  const blend = (a, b) => t => lerpColor(a, b, t);
  function blendMany(colors) {
    if (colors.length < 2) return blend(colors[0] || rgb(0, 0, 0), colors[0] || rgb(0, 0, 0));
    return t => {
      if (t >= 1) return colors[colors.length - 1];
      if (t <= 0) return colors[0];
      const scaled = t * (colors.length - 1), segment = Math.trunc(scaled);
      return lerpColor(colors[segment], colors[segment + 1], modulo(scaled, 1));
    };
  }
  const reverse = fn => t => fn(1 - t);
  const lighten = (c, t) => lerpColor(c, rgb(1, 1, 1), t);
  const darken = (c, t) => lerpColor(c, rgb(0, 0, 0), t);
  const luminance = c => Math.sqrt((0.299 * c.r) ** 2 + (0.587 * c.g) ** 2 + (0.114 * c.b) ** 2);
  const from8 = (r, g, b) => rgb(r / 255, g / 255, b / 255);
  const spectrum = blendMany([
    [0, 168, 222], [41, 60, 130], [210, 59, 130], [217, 63, 53],
    [244, 228, 81], [0, 158, 84], [0, 168, 222]
  ].map(v => from8(...v)));

  const monochromatic = entropy => {
    let key = spectrum(entropy.nextFrac());
    const tint = entropy.next(), reversed = entropy.next();
    const keyAdvance = entropy.nextFrac() * 0.3 + 0.05;
    const neutralAdvance = entropy.nextFrac() * 0.3 + 0.05;
    const contrast = tint ? 1 : 0;
    if (tint) key = darken(key, 0.5);
    const neutral = rgb(contrast, contrast, contrast);
    const gradient = blend(lerpColor(key, neutral, keyAdvance), lerpColor(neutral, key, neutralAdvance));
    return reversed ? reverse(gradient) : gradient;
  };
  const complementary = entropy => {
    const start = entropy.nextFrac(), other = modulo(start + 0.5, 1);
    const lighterAdvance = entropy.nextFrac() * 0.3, darkerAdvance = entropy.nextFrac() * 0.3;
    const reversed = entropy.next(), a = spectrum(start), b = spectrum(other);
    const [darker, lighter] = luminance(a) > luminance(b) ? [b, a] : [a, b];
    const gradient = blend(darken(darker, darkerAdvance), lighten(lighter, lighterAdvance));
    return reversed ? reverse(gradient) : gradient;
  };
  const triadic = entropy => {
    const start = entropy.nextFrac();
    const lighterAdvance = entropy.nextFrac() * 0.3, darkerAdvance = entropy.nextFrac() * 0.3;
    const reversed = entropy.next();
    const colors = [start, modulo(start + 1 / 3, 1), modulo(start + 2 / 3, 1)]
      .map(spectrum).sort((a, b) => luminance(a) - luminance(b));
    const gradient = blendMany([lighten(colors[2], lighterAdvance), colors[1], darken(colors[0], darkerAdvance)]);
    return reversed ? reverse(gradient) : gradient;
  };
  const analogous = entropy => {
    const start = entropy.nextFrac(), advance = entropy.nextFrac() * 0.5 + 0.2, reversed = entropy.next();
    const c = [start, start + 1 / 12, start + 2 / 12, start + 3 / 12].map(v => spectrum(modulo(v, 1)));
    const ordered = luminance(c[0]) < luminance(c[3]) ? c : c.reverse();
    const gradient = blendMany([darken(ordered[0], advance), darken(ordered[1], advance / 2), lighten(ordered[2], advance / 2), lighten(ordered[3], advance)]);
    return reversed ? reverse(gradient) : gradient;
  };
  const selectGradient = entropy => [monochromatic, complementary, triadic, analogous][entropy.nextUint2()](entropy);

  const buildFracGrid = history => {
    const frac = Array(SIZE * SIZE).fill(0);
    for (let i = 0; i < history.length; i += 1) {
      const value = clamp01(lerpFrom(0, history.length, i + 1));
      for (let p = 0; p < frac.length; p += 1) if (history[i][p >> 3] & (128 >> (p & 7))) frac[p] = value;
    }
    const min = Math.min(...frac), max = Math.max(...frac);
    if (max > min) for (let p = 0; p < frac.length; p += 1) frac[p] = lerpFrom(min, max, frac[p]);
    return frac;
  };
  const renderColors = (frac, gradient, snowflake) => {
    const width = SIZE * 2, data = new Uint8Array(width * width * 3), edge = width - 1;
    const set = (x, y, color) => {
      const at = (y * width + x) * 3;
      data[at] = Math.floor(clamp01(color.r) * 255);
      data[at + 1] = Math.floor(clamp01(color.g) * 255);
      data[at + 2] = Math.floor(clamp01(color.b) * 255);
    };
    for (let y = 0; y < SIZE; y += 1) for (let x = 0; x < SIZE; x += 1) {
      const color = gradient(frac[gridIndex(x, y)]);
      if (snowflake) {
        set(x, y, color); set(edge - x, y, color); set(x, edge - y, color); set(edge - x, edge - y, color);
      } else {
        set(x, y, color); set(y, edge - x, color); set(edge - y, x, color); set(edge - x, edge - y, color);
      }
    }
    return { width, height: width, data };
  };

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
    return table;
  })();
  const crc32 = bytes => {
    let c = 0xffffffff;
    for (const byte of bytes) c = crcTable[(c ^ byte) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const out = new Uint8Array(12 + data.length), view = new DataView(out.buffer);
    view.setUint32(0, data.length); out.set(type, 4); out.set(data, 8);
    view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
    return out;
  };
  const u32 = n => Uint8Array.from([n >>> 24 & 255, n >>> 16 & 255, n >>> 8 & 255, n & 255]);
  const ascii = text => Uint8Array.from([...text].map(c => c.charCodeAt(0)));
  const adler32 = bytes => {
    let a = 1, b = 0;
    for (const byte of bytes) { a = (a + byte) % 65521; b = (b + a) % 65521; }
    return ((b << 16) | a) >>> 0;
  };
  const encodePng = (width, height, colors) => {
    const stride = width * 3, raw = new Uint8Array((stride + 1) * height);
    for (let y = 0; y < height; y += 1) raw.set(colors.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
    const blocks = [];
    for (let offset = 0; offset < raw.length; offset += 65535) {
      const slice = raw.subarray(offset, Math.min(offset + 65535, raw.length));
      const block = new Uint8Array(5 + slice.length), view = new DataView(block.buffer);
      block[0] = offset + 65535 >= raw.length ? 1 : 0;
      view.setUint16(1, slice.length, true); view.setUint16(3, ~slice.length & 65535, true); block.set(slice, 5);
      blocks.push(block);
    }
    const zlib = new Uint8Array(6 + blocks.reduce((n, b) => n + b.length, 0));
    zlib.set([0x78, 0x01]);
    let at = 2;
    for (const block of blocks) { zlib.set(block, at); at += block.length; }
    new DataView(zlib.buffer).setUint32(at, adler32(raw));
    const ihdr = new Uint8Array(13); ihdr.set(u32(width)); ihdr.set(u32(height), 4); ihdr[8] = 8; ihdr[9] = 2;
    const parts = [Uint8Array.from([137,80,78,71,13,10,26,10]), chunk(ascii('IHDR'), ihdr), chunk(ascii('IDAT'), zlib), chunk(ascii('IEND'), new Uint8Array())];
    const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    at = 0; for (const part of parts) { out.set(part, at); at += part.length; }
    return out;
  };
  const scaleUp = ({ width, height, data }, moduleSize) => {
    const w = width * moduleSize, h = height * moduleSize, out = new Uint8Array(w * h * 3);
    for (let y = 0; y < h; y += 1) for (let x = 0; x < w; x += 1) {
      const source = (Math.floor(y / moduleSize) * width + Math.floor(x / moduleSize)) * 3;
      const target = (y * w + x) * 3;
      out.set(data.subarray(source, source + 3), target);
    }
    return { width: w, height: h, data: out };
  };
  const base64 = bytes => {
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary);
  };
  const fromDigest = (digest, moduleSize = 2) => {
    if (!(digest instanceof Uint8Array) || digest.length !== 32) throw new Error('LifeHash digest must be 32 bytes.');
    const entropy = makeBitEnumerator(digest);
    entropy.next(); entropy.next();
    const gradient = selectGradient(entropy), snowflake = entropy.next();
    const image = scaleUp(renderColors(buildFracGrid(runGameOfLife(digest)), gradient, snowflake), moduleSize);
    return 'data:image/png;base64,' + base64(encodePng(image.width, image.height, image.data));
  };
  /* Sparrow's convention, not lifehash.info's.

     A master fingerprint is four bytes that happen to be written as eight hex
     characters. lifehash.info hashes the characters; Sparrow -- through
     toucan's LifeHashIcon.setHex, which decodes with Utils.hexToBytes before
     calling makeFromData -- hashes the four bytes those characters spell. Both
     are valid LifeHash; they simply produce different icons for the same
     wallet.

     An icon is only useful if it agrees with what the user is comparing it
     against, and on the desktop that is usually Sparrow. So this hashes the
     decoded bytes. Icons produced by earlier Workshop releases used the
     string convention and will not match these.

     The input is validated rather than coerced: eight hex characters exactly,
     because four bytes is what a fingerprint is, and anything else is a
     caller's mistake worth surfacing rather than an icon worth drawing.
     Case is irrelevant once decoded, so mixed case still gives one icon. */
  const fromFingerprint = (fingerprint, moduleSize) => {
    const text = String(fingerprint).trim();
    if (!/^[0-9a-fA-F]{8}$/.test(text)) {
      throw new Error('LifeHash fingerprint must be eight hexadecimal characters.');
    }
    const bytes = new Uint8Array(4);
    for (let i = 0; i < 4; i++) bytes[i] = parseInt(text.slice(i * 2, i * 2 + 2), 16);
    return fromDigest(sha256(bytes), moduleSize);
  };

  return { fromDigest, fromFingerprint, _internals: { runGameOfLife, buildFracGrid, selectGradient, renderColors, encodePng, makeBitEnumerator } };
})();

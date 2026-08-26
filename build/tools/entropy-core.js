/* Crypto core for the entropy tool at docs/tools/entropy.html.
   Inlined into that page by build/tools/entropy-page.mjs -- the shipped file
   has no external requests of any kind, so it works from file:// on a machine
   that has never been online.

   Everything here is written from the specifications rather than pulled from a
   library, for one reason: the whole value of an offline tool is that a reader
   can open the file and check what it does. A bundled dependency is a blob you
   have to take on faith, which is the exact thing this tool exists to remove.

   The trade is that hand-written crypto can be subtly wrong, so nothing here is
   trusted on inspection. build/tools/entropy-test.mjs runs the official test
   vectors from BIP32, BIP39, BIP84 and BIP86 plus FIPS hash vectors, and the
   page runs the same suite on load and refuses to render results if any of it
   fails. A tool that cannot verify itself is worth nothing.

   No randomness is generated anywhere in this file. There is no call to
   Math.random or crypto.getRandomValues, and there is deliberately nothing
   that could produce a seed the user did not supply the entropy for. */

'use strict';

const EntropyCore = (() => {

  /* ---- bytes ------------------------------------------------------------ */

  const hex = bytes => [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  const fromHex = s => new Uint8Array(s.match(/../g).map(h => parseInt(h, 16)));
  const utf8 = s => new TextEncoder().encode(s);
  const concat = (...arrays) => {
    const out = new Uint8Array(arrays.reduce((n, a) => n + a.length, 0));
    let at = 0;
    for (const a of arrays) { out.set(a, at); at += a.length; }
    return out;
  };

  /* ---- derived constants ------------------------------------------------

     The SHA round constants are the leading fraction bits of the cube roots of
     the first n primes, and the initial state is the same of the square roots.
     They are computed here rather than transcribed: eighty 64-bit literals
     copied by hand is eighty chances to introduce a typo that only a test
     vector would ever catch, and the derivation is shorter than the table. */

  const PRIMES = (n) => {
    const out = [];
    for (let i = 2; out.length < n; i++) {
      let prime = true;
      for (let d = 2; d * d <= i; d++) if (i % d === 0) { prime = false; break; }
      if (prime) out.push(i);
    }
    return out;
  };

  /* Integer nth root by Newton's method, so the fraction bits come out exact. */
  const iroot = (n, k) => {
    if (n < 2n) return n;
    const kb = BigInt(k);
    let x = 1n << (BigInt(n.toString(2).length) / kb + 1n);
    for (;;) {
      const next = ((kb - 1n) * x + n / x ** (kb - 1n)) / kb;
      if (next >= x) return x;
      x = next;
    }
  };

  /* frac(p^(1/k)) * 2^bits, as an integer */
  const fracRoot = (p, k, bits) =>
    iroot(BigInt(p) << BigInt(bits * k), k) & ((1n << BigInt(bits)) - 1n);

  /* ---- SHA-256 ---------------------------------------------------------- */

  const K256 = PRIMES(64).map(p => Number(fracRoot(p, 3, 32)));
  const H256 = PRIMES(8).map(p => Number(fracRoot(p, 2, 32)));

  const rotr32 = (x, n) => (x >>> n) | (x << (32 - n));

  function sha256(msg) {
    const H = H256.slice();
    const len = msg.length;
    const withPad = new Uint8Array((((len + 9) >> 6) + 1) << 6);
    withPad.set(msg);
    withPad[len] = 0x80;
    new DataView(withPad.buffer).setUint32(withPad.length - 4, len << 3, false);
    /* Lengths here are always far below 2^32 bits, so the high word is zero. */
    new DataView(withPad.buffer).setUint32(withPad.length - 8, Math.floor(len / 536870912), false);

    const w = new Uint32Array(64);
    const view = new DataView(withPad.buffer);

    for (let block = 0; block < withPad.length; block += 64) {
      for (let i = 0; i < 16; i++) w[i] = view.getUint32(block + i * 4, false);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr32(w[i - 15], 7) ^ rotr32(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rotr32(w[i - 2], 17) ^ rotr32(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr32(e, 6) ^ rotr32(e, 11) ^ rotr32(e, 25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K256[i] + w[i]) >>> 0;
        const S0 = rotr32(a, 2) ^ rotr32(a, 13) ^ rotr32(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      const next = [a, b, c, d, e, f, g, h];
      for (let i = 0; i < 8; i++) H[i] = (H[i] + next[i]) >>> 0;
    }

    const out = new Uint8Array(32);
    const ov = new DataView(out.buffer);
    H.forEach((h, i) => ov.setUint32(i * 4, h, false));
    return out;
  }

  /* ---- SHA-512 ----------------------------------------------------------

     BigInt rather than 32-bit hi/lo pairs. It is markedly easier to check
     against the specification line by line, and the only place speed matters
     is PBKDF2, which is bounded and runs once. */

  const M64 = (1n << 64n) - 1n;
  const K512 = PRIMES(80).map(p => fracRoot(p, 3, 64));
  const H512 = PRIMES(8).map(p => fracRoot(p, 2, 64));

  const rotr64 = (x, n) => ((x >> n) | (x << (64n - n))) & M64;

  function sha512(msg) {
    const H = H512.slice();
    const len = msg.length;
    const blocks = (((len + 17) / 128) | 0) + 1;
    const withPad = new Uint8Array(blocks * 128);
    withPad.set(msg);
    withPad[len] = 0x80;
    const view = new DataView(withPad.buffer);
    view.setBigUint64(withPad.length - 8, BigInt(len) * 8n, false);

    const w = new Array(80);

    for (let block = 0; block < withPad.length; block += 128) {
      for (let i = 0; i < 16; i++) w[i] = view.getBigUint64(block + i * 8, false);
      for (let i = 16; i < 80; i++) {
        const s0 = rotr64(w[i - 15], 1n) ^ rotr64(w[i - 15], 8n) ^ (w[i - 15] >> 7n);
        const s1 = rotr64(w[i - 2], 19n) ^ rotr64(w[i - 2], 61n) ^ (w[i - 2] >> 6n);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & M64;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 80; i++) {
        const S1 = rotr64(e, 14n) ^ rotr64(e, 18n) ^ rotr64(e, 41n);
        const ch = (e & f) ^ (~e & M64 & g);
        const t1 = (h + S1 + ch + K512[i] + w[i]) & M64;
        const S0 = rotr64(a, 28n) ^ rotr64(a, 34n) ^ rotr64(a, 39n);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) & M64;
        h = g; g = f; f = e; e = (d + t1) & M64;
        d = c; c = b; b = a; a = (t1 + t2) & M64;
      }
      const next = [a, b, c, d, e, f, g, h];
      for (let i = 0; i < 8; i++) H[i] = (H[i] + next[i]) & M64;
    }

    const out = new Uint8Array(64);
    const ov = new DataView(out.buffer);
    H.forEach((h, i) => ov.setBigUint64(i * 8, h, false));
    return out;
  }

  /* ---- HMAC-SHA512 and PBKDF2 ------------------------------------------- */

  function hmacSha512(key, msg) {
    const B = 128;
    let k = key.length > B ? sha512(key) : key;
    const pad = new Uint8Array(B);
    pad.set(k);
    const inner = new Uint8Array(B);
    const outer = new Uint8Array(B);
    for (let i = 0; i < B; i++) { inner[i] = pad[i] ^ 0x36; outer[i] = pad[i] ^ 0x5c; }
    return sha512(concat(outer, sha512(concat(inner, msg))));
  }

  /* Single-block PBKDF2, which is all BIP39 needs: the output is 64 bytes and
     HMAC-SHA512 already produces 64. */
  function pbkdf2Sha512(password, salt, iterations) {
    let u = hmacSha512(password, concat(salt, new Uint8Array([0, 0, 0, 1])));
    const out = u.slice();
    for (let i = 1; i < iterations; i++) {
      u = hmacSha512(password, u);
      for (let j = 0; j < out.length; j++) out[j] ^= u[j];
    }
    return out;
  }

  /* ---- RIPEMD-160 -------------------------------------------------------

     Constants and permutations are transcribed from the specification; there
     is no derivation for these. The "abc" and million-a vectors in the test
     suite are what confirm the tables landed correctly. */

  const RL = [
    11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
    7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
    11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
    11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
    9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
  const RR = [
    8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
    9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
    9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
    15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
    8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];
  const IL = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
    3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
    1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
    4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
  const IR = [
    5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
    6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
    15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
    8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
    12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];
  const KL = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e];
  const KR = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000];

  const rol32 = (x, n) => ((x << n) | (x >>> (32 - n))) >>> 0;
  const rmdF = (j, x, y, z) =>
    j < 16 ? x ^ y ^ z :
    j < 32 ? (x & y) | (~x & z) :
    j < 48 ? (x | ~y) ^ z :
    j < 64 ? (x & z) | (y & ~z) :
             x ^ (y | ~z);

  function ripemd160(msg) {
    let h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    const len = msg.length;
    const withPad = new Uint8Array((((len + 9) >> 6) + 1) << 6);
    withPad.set(msg);
    withPad[len] = 0x80;
    const view = new DataView(withPad.buffer);
    view.setUint32(withPad.length - 8, (len << 3) >>> 0, true);
    view.setUint32(withPad.length - 4, Math.floor(len / 536870912), true);

    for (let block = 0; block < withPad.length; block += 64) {
      const x = new Array(16);
      for (let i = 0; i < 16; i++) x[i] = view.getUint32(block + i * 4, true);
      let [al, bl, cl, dl, el] = h;
      let [ar, br, cr, dr, er] = h;
      for (let j = 0; j < 80; j++) {
        const round = (j / 16) | 0;
        let t = (al + rmdF(j, bl, cl, dl) + x[IL[j]] + KL[round]) >>> 0;
        t = (rol32(t, RL[j]) + el) >>> 0;
        al = el; el = dl; dl = rol32(cl, 10); cl = bl; bl = t;

        t = (ar + rmdF(79 - j, br, cr, dr) + x[IR[j]] + KR[round]) >>> 0;
        t = (rol32(t, RR[j]) + er) >>> 0;
        ar = er; er = dr; dr = rol32(cr, 10); cr = br; br = t;
      }
      h = [
        (h[1] + cl + dr) >>> 0, (h[2] + dl + er) >>> 0, (h[3] + el + ar) >>> 0,
        (h[4] + al + br) >>> 0, (h[0] + bl + cr) >>> 0
      ];
    }

    const out = new Uint8Array(20);
    const ov = new DataView(out.buffer);
    h.forEach((v, i) => ov.setUint32(i * 4, v, true));
    return out;
  }

  const hash160 = bytes => ripemd160(sha256(bytes));
  const hash256 = bytes => sha256(sha256(bytes));

  /* Tagged hashes, as defined by BIP340 and used by the taproot tweak. */
  const taggedHash = (tag, msg) => {
    const t = sha256(utf8(tag));
    return sha256(concat(t, t, msg));
  };

  /* ---- secp256k1 --------------------------------------------------------

     Public-key derivation only. Nothing here signs anything, so there is no
     nonce to get wrong -- the classic catastrophic failure of hand-written
     curve code is not reachable from this file. Points are kept in affine
     coordinates with a modular inversion per addition, which is slower than
     Jacobian and very much easier to read against the group law. The whole
     page needs about a dozen scalar multiplications, so the cost is invisible. */

  const P = 2n ** 256n - 2n ** 32n - 977n;
  const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n;
  const Gx = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n;
  const Gy = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n;

  const mod = (a, m = P) => ((a % m) + m) % m;

  /* Extended Euclid. Fermat via modPow would be a one-liner but is far slower
     with BigInt, and this runs inside every point addition. */
  const inv = (a, m = P) => {
    let [lo, hi] = [mod(a, m), m];
    let [x0, x1] = [1n, 0n];
    while (lo > 0n) {
      const q = hi / lo;
      [lo, hi] = [hi - q * lo, lo];
      [x0, x1] = [x1 - q * x0, x0];
    }
    return mod(x1, m);
  };

  const pointAdd = (a, b) => {
    if (!a) return b;
    if (!b) return a;
    if (a.x === b.x) {
      /* Same x with opposite y is the point at infinity. */
      if (mod(a.y + b.y) === 0n) return null;
      const l = mod(3n * a.x * a.x * inv(2n * a.y));
      const x = mod(l * l - 2n * a.x);
      return { x, y: mod(l * (a.x - x) - a.y) };
    }
    const l = mod((b.y - a.y) * inv(b.x - a.x));
    const x = mod(l * l - a.x - b.x);
    return { x, y: mod(l * (a.x - x) - a.y) };
  };

  const pointMul = (k, point = { x: Gx, y: Gy }) => {
    let acc = null;
    let add = point;
    for (let n = mod(k, N); n > 0n; n >>= 1n) {
      if (n & 1n) acc = pointAdd(acc, add);
      add = pointAdd(add, add);
    }
    return acc;
  };

  const toBytes32 = n => fromHex(n.toString(16).padStart(64, '0'));
  const compress = point =>
    concat(new Uint8Array([point.y % 2n === 0n ? 0x02 : 0x03]), toBytes32(point.x));

  const modPow = (base, exp, m) => {
    let result = 1n;
    let b = mod(base, m);
    for (let e = exp; e > 0n; e >>= 1n) {
      if (e & 1n) result = result * b % m;
      b = b * b % m;
    }
    return result;
  };

  /* BIP340 lift_x: the x-only key names the point with even y. */
  const liftX = x => {
    const ySq = mod(x * x % P * x + 7n);
    const y = modPow(ySq, (P + 1n) / 4n, P);
    if (mod(y * y) !== ySq) throw new Error('x is not on the curve');
    return { x, y: y % 2n === 0n ? y : P - y };
  };

  /* ---- base58check ------------------------------------------------------ */

  const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

  const base58check = payload => {
    const full = concat(payload, hash256(payload).slice(0, 4));
    let n = 0n;
    for (const byte of full) n = (n << 8n) | BigInt(byte);
    let out = '';
    while (n > 0n) { out = B58[Number(n % 58n)] + out; n /= 58n; }
    /* Each leading zero byte is a literal '1', and is lost by the arithmetic. */
    for (const byte of full) { if (byte !== 0) break; out = '1' + out; }
    return out;
  };

  /* ---- bech32 and bech32m ----------------------------------------------- */

  const BECH32 = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  const BECH32_CONST = 1;
  const BECH32M_CONST = 0x2bc830a3;

  const polymod = values => {
    const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
    let chk = 1;
    for (const v of values) {
      const top = chk >> 25;
      chk = ((chk & 0x1ffffff) << 5) ^ v;
      for (let i = 0; i < 5; i++) if ((top >> i) & 1) chk ^= GEN[i];
    }
    return chk >>> 0;
  };

  const hrpExpand = hrp => [
    ...[...hrp].map(c => c.charCodeAt(0) >> 5),
    0,
    ...[...hrp].map(c => c.charCodeAt(0) & 31)
  ];

  const convertBits = (data, from, to, pad) => {
    let acc = 0, bits = 0;
    const out = [];
    const max = (1 << to) - 1;
    for (const value of data) {
      acc = (acc << from) | value;
      bits += from;
      while (bits >= to) { bits -= to; out.push((acc >> bits) & max); }
    }
    if (pad && bits) out.push((acc << (to - bits)) & max);
    return out;
  };

  const segwitAddress = (hrp, version, program) => {
    const data = [version, ...convertBits(program, 8, 5, true)];
    const constant = version === 0 ? BECH32_CONST : BECH32M_CONST;
    const chk = polymod([...hrpExpand(hrp), ...data, 0, 0, 0, 0, 0, 0]) ^ constant;
    const checksum = [0, 1, 2, 3, 4, 5].map(i => (chk >> (5 * (5 - i))) & 31);
    return `${hrp}1${[...data, ...checksum].map(d => BECH32[d]).join('')}`;
  };

  /* ---- BIP39 ------------------------------------------------------------ */

  /* entropy -> words. The checksum is the leading ENT/32 bits of its SHA-256,
     which is why the final word is not free: most of it is that check. */
  const entropyToMnemonic = (entropy, wordlist) => {
    const bits = [...entropy].map(b => b.toString(2).padStart(8, '0')).join('');
    const checksumBits = [...sha256(entropy)]
      .map(b => b.toString(2).padStart(8, '0')).join('')
      .slice(0, entropy.length * 8 / 32);
    const all = bits + checksumBits;
    const words = [];
    for (let i = 0; i < all.length; i += 11) {
      words.push(wordlist[parseInt(all.slice(i, i + 11), 2)]);
    }
    return words;
  };

  const mnemonicToSeed = (words, passphrase = '') =>
    pbkdf2Sha512(
      utf8(words.join(' ').normalize('NFKD')),
      utf8(`mnemonic${passphrase}`.normalize('NFKD')),
      2048
    );

  /* ---- BIP32 ------------------------------------------------------------ */

  const masterKey = seed => {
    const I = hmacSha512(utf8('Bitcoin seed'), seed);
    return { key: I.slice(0, 32), chainCode: I.slice(32), depth: 0 };
  };

  const toBigInt = bytes => BigInt('0x' + hex(bytes));

  const ckdPriv = (parent, index) => {
    const hardened = index >= 0x80000000;
    const indexBytes = new Uint8Array(4);
    new DataView(indexBytes.buffer).setUint32(0, index, false);
    const data = hardened
      ? concat(new Uint8Array([0]), parent.key, indexBytes)
      : concat(compress(pointMul(toBigInt(parent.key))), indexBytes);
    const I = hmacSha512(parent.chainCode, data);
    const child = mod(toBigInt(I.slice(0, 32)) + toBigInt(parent.key), N);
    if (child === 0n) throw new Error('invalid child key');
    return { key: toBytes32(child), chainCode: I.slice(32), depth: parent.depth + 1 };
  };

  /* "m/84'/0'/0'" -> [2147483732, 2147483648, 2147483648] */
  const parsePath = path => {
    const parts = path.trim().replace(/^m\/?/i, '').split('/').filter(Boolean);
    return parts.map(part => {
      const hardened = /['h]$/i.test(part);
      const n = Number(part.replace(/['h]$/i, ''));
      if (!Number.isInteger(n) || n < 0 || n >= 0x80000000) {
        throw new Error(`bad path element: ${part}`);
      }
      return hardened ? n + 0x80000000 : n;
    });
  };

  const derive = (node, path) => parsePath(path).reduce(ckdPriv, node);

  /* ---- addresses -------------------------------------------------------- */

  const ADDRESS_TYPES = {
    legacy: {
      label: 'Legacy',
      prefix: '1',
      purpose: 44,
      note: 'The original format. Understood everywhere, and the most expensive to spend.',
      encode: pub => base58check(concat(new Uint8Array([0x00]), hash160(pub)))
    },
    nested: {
      label: 'Nested SegWit',
      prefix: '3',
      purpose: 49,
      note: 'SegWit wrapped in a legacy-looking address, for senders that cannot pay to bc1.',
      encode: pub => {
        const redeem = concat(new Uint8Array([0x00, 0x14]), hash160(pub));
        return base58check(concat(new Uint8Array([0x05]), hash160(redeem)));
      }
    },
    native: {
      label: 'Native SegWit',
      prefix: 'bc1q',
      purpose: 84,
      note: 'The common default today. Cheaper to spend than either format above.',
      encode: pub => segwitAddress('bc', 0, hash160(pub))
    },
    taproot: {
      label: 'Taproot',
      prefix: 'bc1p',
      purpose: 86,
      note: 'The newest format. Cheapest for single-key spends, and not accepted everywhere yet.',
      encode: pub => {
        /* BIP86: tweak the internal key by the hash of itself, with no script
           tree, then publish the x coordinate of the result. */
        const internal = pub.slice(1);
        const tweak = toBigInt(taggedHash('TapTweak', internal));
        const output = pointAdd(liftX(toBigInt(internal)), pointMul(tweak));
        return segwitAddress('bc', 1, toBytes32(output.x));
      }
    }
  };

  const accountPath = (type, account = 0) =>
    `m/${ADDRESS_TYPES[type].purpose}'/0'/${account}'`;

  /* ---- entropy from what the user rolled or flipped ---------------------

     Two different jobs, so two different treatments, and the difference is not
     arbitrary. A coin gives exactly one bit, so 256 flips are 256 bits and can
     be packed straight in -- no processing, and a reader can check the mapping
     by hand. A die face carries log2(6) = 2.58 bits, which does not divide
     into whole bits, so the rolls are hashed instead. Hashing is what COLDCARD,
     SeedSigner, Krux and Gordian all do, and it is why 99 rolls is the number
     you see everywhere.

     Neither path invents anything. Same input, same words, every time. */

  const METHODS = {
    dice: {
      label: 'Dice',
      unit: 'roll',
      faces: '1-6',
      counts: { 12: 50, 24: 99 },
      /* Every roll goes into the hash, so rolling past the minimum genuinely
         adds to what the seed is made from -- there is no point at which an
         extra roll is ignored. The ceiling is arbitrary and only there to stop
         a paste of something enormous. */
      extra: true,
      most: 500,
      matches: 'COLDCARD, SeedSigner, Krux and Gordian all convert dice this way.',
      valid: /^[1-6]*$/,
      /* SHA-256 over the digits exactly as typed, then truncated. */
      entropy: (input, bytes) => sha256(utf8(input)).slice(0, bytes)
    },
    coin: {
      label: 'Coin flips',
      unit: 'flip',
      faces: 'H or T',
      counts: { 12: 128, 24: 256 },
      /* No extras here, and the reason is worth knowing rather than working
         around. A flip is exactly one bit and the bits are packed straight in,
         so 256 flips fill a 256-bit seed exactly. A 257th has nowhere to go --
         it would be read, counted, and then silently dropped, which is worse
         than refusing it. */
      extra: false,
      matches: 'Heads is a 1 bit, tails a 0, packed in the order you flipped them.',
      valid: /^[HT]*$/,
      entropy: (input, bytes) => {
        const out = new Uint8Array(bytes);
        for (let i = 0; i < bytes * 8; i++) {
          if (input[i] === 'H') out[i >> 3] |= 0x80 >> (i & 7);
        }
        return out;
      }
    }
  };

  const normalise = (method, raw) => {
    const text = String(raw).toUpperCase().replace(/[^0-9A-Z]/g, '');
    return method === 'coin'
      ? text.replace(/[^HT]/g, '')
      : text.replace(/[^1-6]/g, '');
  };

  /* ---- is this actually random? ------------------------------------------

     A sanity check on the input, not a randomness test. Its job is to catch
     input that was never rolled -- 99 ones, "123456" typed seventeen times,
     HTHT to the end of the line -- because a seed built from those is guessable
     in moments and nothing downstream would notice.

     Two things it is deliberately not.

     It is not a quality score. Passing means "nothing here is obviously
     fabricated", never "this is good randomness". Real dice can produce a run
     of sixes and this will wave it through, correctly.

     And it is not a reason to roll again. The dice guide is blunt about why:
     rejecting results because they look wrong replaces the die's judgement
     with yours, and yours is predictable. So every threshold below is set far
     out in the tail -- calibrated in build/tools/entropy-test.mjs against a
     million generated sequences, with the worst case observed still leaving
     headroom -- so that a genuine roll effectively never trips it. When one
     does fire, the honest reading is that the input was typed rather than
     rolled, and the answer is to go and roll, not to edit until it passes. */

  /* Worst case seen across a million generated sequences, against the limit:
       dice  chi 35.7 / 55    run 11 / 15    lz 0.92 / 0.55    distinct 5 / 4
       coin  chi 25.0 / 40    run 27 / 34    lz 1.64 / 0.55    distinct 2 / 2
     Every limit sits well past anything real randomness produced. Fabricated
     input is not close to these edges -- 99 identical rolls scores chi 495 and
     a run of 99 -- so the gap costs nothing in detection. */
  const RULES = {
    dice: { alphabet: '123456', minDistinct: 4, maxRun: 15, maxChi: 55, minLz: 0.55 },
    coin: { alphabet: 'HT', minDistinct: 2, maxRun: 34, maxChi: 40, minLz: 0.55 }
  };

  /* The smallest unit the whole string is built from: 6 for "123456123456",
     1 for "1111", 0 when nothing repeats.

     Note it does not require the unit to divide the length exactly. That
     mattered: "123456" typed until you reach 99 rolls ends on a partial "123",
     and an exact-tiling test returns nothing for it. It is also the single
     most likely thing a person types when faking dice -- the dice guide
     singles it out, because the face counts come out perfectly flat and every
     frequency-based check in the world waves it through. */
  const smallestPeriod = s => {
    for (let p = 1; p <= s.length >> 1; p++) {
      let holds = true;
      for (let i = p; i < s.length; i++) {
        if (s[i] !== s[i - p]) { holds = false; break; }
      }
      if (holds) return p;
    }
    return 0;
  };

  const longestRun = s => {
    let best = 0, run = 0;
    for (let i = 0; i < s.length; i++) {
      run = i && s[i] === s[i - 1] ? run + 1 : 1;
      if (run > best) best = run;
    }
    return best;
  };

  /* Pearson's chi-squared against a flat distribution. Catches a die that has
     come to rest in a crack, or a hand that favours one key. */
  const chiSquared = (s, alphabet) => {
    const expected = s.length / alphabet.length;
    return [...alphabet].reduce((sum, face) => {
      const seen = [...s].filter(c => c === face).length;
      return sum + (seen - expected) ** 2 / expected;
    }, 0);
  };

  /* LZ78 phrase count, normalised against the length. Structure of any kind --
     repeats, ascending runs, alternation -- means fewer distinct phrases, so
     this catches patterns that survive both a flat face count and a period
     test. The normaliser is the count a maximally incompressible string of the
     same length would reach, approximated as n / log_a(n). */
  const lzComplexity = (s, alphabet) => {
    const seen = new Set();
    let phrase = '';
    for (const c of s) {
      phrase += c;
      if (!seen.has(phrase)) { seen.add(phrase); phrase = ''; }
    }
    const ideal = s.length / (Math.log(s.length) / Math.log(alphabet.length));
    return seen.size / ideal;
  };

  const assessEntropy = ({ method, input }) => {
    const rules = RULES[method];
    const s = normalise(method, input);
    const unit = METHODS[method].unit;
    const distinct = new Set(s).size;
    const period = smallestPeriod(s);
    const run = longestRun(s);
    const chi = chiSquared(s, rules.alphabet);
    const lz = lzComplexity(s, rules.alphabet);
    const failures = [];

    if (!s.length) return { ok: false, failures: [], stats: {} };

    if (distinct < rules.minDistinct) {
      failures.push(distinct === 1
        ? `Every single ${unit} is the same. That is not a wallet, it is one number written ${s.length} times.`
        : `Only ${distinct} of the ${rules.alphabet.length} possible results ever appear.`);
    }
    if (period && period <= s.length / 3) {
      failures.push(period === 1
        ? `The same ${unit} repeats from beginning to end.`
        : `"${s.slice(0, period)}" repeats over and over, so there are really only ${period} ${unit}s here, not ${s.length}.`);
    }
    if (run >= rules.maxRun) {
      failures.push(`The same result appears ${run} times in a row. On fair ${unit}s that is rarer than one in a million.`);
    }
    if (chi > rules.maxChi) {
      failures.push(`The results are far too uneven to have come from fair ${unit}s.`);
    }
    if (lz < rules.minLz) {
      failures.push('The sequence is too regular — it follows a pattern rather than wandering the way real results do.');
    }

    return { ok: !failures.length, failures, stats: { distinct, period, run, chi, lz, length: s.length } };
  };

  /* ---- the whole job, end to end ---------------------------------------- */

  /* Split in two because the halves cost wildly different amounts. Everything
     up to the seed runs PBKDF2's 2048 rounds of HMAC-SHA512 and takes about a
     second; deriving addresses from that seed takes a few milliseconds. The
     page caches the first half, so changing the address type or the path
     repaints immediately instead of re-running the slow part for no reason. */

  /* The minimum is the count that fills the seed; the maximum is the same
     number unless the method absorbs extras. */
  const limits = (method, words) => {
    const spec = METHODS[method];
    const least = spec.counts[words];
    return { least, most: spec.extra ? spec.most : least };
  };

  const deriveSeed = ({ method, input, words, wordlist }) => {
    const spec = METHODS[method];
    const { least, most } = limits(method, words);
    const clean = normalise(method, input);
    if (clean.length < least) {
      throw new Error(`${least} ${spec.unit}s needed, ${clean.length} supplied`);
    }
    if (clean.length > most) {
      throw new Error(spec.extra
        ? `${most} ${spec.unit}s is the most this accepts, and ${clean.length} were supplied`
        : `exactly ${least} ${spec.unit}s are needed, and ${clean.length} were supplied`);
    }
    const entropy = spec.entropy(clean, words === 24 ? 32 : 16);
    const mnemonic = entropyToMnemonic(entropy, wordlist);
    return { entropy: hex(entropy), mnemonic, seed: mnemonicToSeed(mnemonic) };
  };

  const deriveAddresses = ({ seed, addressType, path }) => {
    const account = derive(masterKey(seed), path);
    const encode = ADDRESS_TYPES[addressType].encode;
    const addressAt = branch =>
      encode(compress(pointMul(toBigInt(ckdPriv(ckdPriv(account, branch), 0).key))));
    return {
      receive: { path: `${path}/0/0`, address: addressAt(0) },
      change: { path: `${path}/1/0`, address: addressAt(1) }
    };
  };

  const buildWallet = ({ method, input, words, addressType, path, wordlist }) => {
    const { entropy, mnemonic, seed } = deriveSeed({ method, input, words, wordlist });
    return { entropy, mnemonic, ...deriveAddresses({ seed, addressType, path }) };
  };

  return {
    hex, fromHex, utf8, concat,
    sha256, sha512, hmacSha512, pbkdf2Sha512, ripemd160,
    hash160, hash256, taggedHash,
    pointMul, compress, base58check, segwitAddress, convertBits,
    entropyToMnemonic, mnemonicToSeed, masterKey, ckdPriv, derive, parsePath,
    ADDRESS_TYPES, METHODS, accountPath, normalise,
    deriveSeed, deriveAddresses, buildWallet, limits,
    assessEntropy, smallestPeriod, longestRun, chiSquared, lzComplexity
  };
})();

/* No export statement on purpose. This file is a classic script: the page
   inlines it inside a plain <script> tag and picks up EntropyCore from there,
   and the test suite evaluates the same source the same way. Nothing about how
   it loads differs between the shipped page and the tests. */

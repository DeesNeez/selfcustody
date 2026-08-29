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

  /* The inverse is needed by the Bitcoin Core wallet.dat encoder, which
     stores an account private key as Core's DER key record rather than as an
     extended-key string. Decode and verify Base58Check here so that boundary
     never accepts a mistyped or truncated xprv silently. */
  const base58checkDecode = text => {
    if (typeof text !== 'string' || !text.length) throw new Error('empty base58check value');
    let n = 0n;
    for (const ch of text) {
      const digit = B58.indexOf(ch);
      if (digit < 0) throw new Error(`invalid base58 character: ${ch}`);
      n = n * 58n + BigInt(digit);
    }
    const tail = [];
    while (n > 0n) { tail.push(Number(n & 0xffn)); n >>= 8n; }
    tail.reverse();
    let leading = 0;
    while (leading < text.length && text[leading] === '1') leading++;
    const full = concat(new Uint8Array(leading), Uint8Array.from(tail));
    if (full.length < 5) throw new Error('base58check value is too short');
    const payload = full.slice(0, -4);
    const checksum = full.slice(-4);
    const expected = hash256(payload).slice(0, 4);
    if (!checksum.every((byte, i) => byte === expected[i])) {
      throw new Error('base58check checksum does not match');
    }
    return payload;
  };

  /* ---- extended public keys ---------------------------------------------

     78 bytes in a fixed order, base58check encoded: version, depth, parent
     fingerprint, child index, chain code, then the compressed public key.

     The version bytes are the interesting part. BIP32 defines one value, which
     renders as "xpub". Wallets later started varying it by address type so the
     prefix would say which kind of address the key was for -- ypub for nested
     SegWit, zpub for native. That convention is SLIP-132, and it is not a BIP:
     the key material is identical either way, and only the four leading bytes
     differ. Which is why the same account shown by two honest wallets can look
     like two different keys, and why this page shows both forms rather than
     picking a side. */
  const XPUB_VERSION = 0x0488b21e;

  const encodeXpub = (node, version = XPUB_VERSION) => {
    const out = new Uint8Array(78);
    const view = new DataView(out.buffer);
    view.setUint32(0, version, false);
    out[4] = node.depth;
    out.set(node.parentFingerprint, 5);
    view.setUint32(9, node.index, false);
    out.set(node.chainCode, 13);
    out.set(publicKeyOf(node), 45);
    return base58check(out);
  };

  /* The same 78 bytes with the private half in place of the public one: a
     different version prefix, and the key written as 0x00 followed by the 32
     private bytes so that both forms are the same length.

     This is the spending key for the account. It is shown because the page
     already shows the recovery words, which are strictly more powerful -- a
     phrase rebuilds every account, an account xprv rebuilds one. Withholding
     the lesser secret while printing the greater one would be theatre. */
  const XPRV_VERSION = 0x0488ade4;

  const encodeXprv = (node, version = XPRV_VERSION) => {
    const out = new Uint8Array(78);
    const view = new DataView(out.buffer);
    view.setUint32(0, version, false);
    out[4] = node.depth;
    out.set(node.parentFingerprint, 5);
    view.setUint32(9, node.index, false);
    out.set(node.chainCode, 13);
    out[45] = 0;
    out.set(node.key, 46);
    return base58check(out);
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

  /* Read a phrase back and check its last word.

     Every phrase this page produces ends in a word that is partly a checksum:
     BIP39 appends entropy/32 bits of SHA-256 over the entropy, so four bits
     for a 12-word phrase and eight for a 24-word one. The word carrying them
     is therefore not free, and how much of it is free differs by method --
     which is the whole reason some methods offer a choice of last word and
     others cannot.

     This recomputes the checksum from the phrase itself rather than trusting
     the construction that made it, so it is a genuine check of this page's own
     output and not a badge that always says yes. */
  const checkMnemonic = (words, wordlist) => {
    const indices = words.map(word => wordlist.indexOf(word));
    if (indices.some(i => i < 0)) throw new Error('that phrase contains a word outside the BIP39 list');

    const all = indices.map(i => i.toString(2).padStart(11, '0')).join('');
    const entropyBits = Math.floor(all.length * 32 / 33);
    const checksumBits = entropyBits / 32;
    const entropy = bitsToBytes(all.slice(0, entropyBits), entropyBits / 8);

    const expected = [...sha256(entropy)]
      .map(b => b.toString(2).padStart(8, '0')).join('')
      .slice(0, checksumBits);
    const actual = all.slice(entropyBits);

    return {
      ok: expected === actual,
      words: words.length,
      entropyBits,
      checksumBits,
      /* Bits of the last word that are entropy rather than checksum. Three for
         a 24-word phrase, seven for a 12-word one -- and whether anyone gets to
         choose them depends on whether they were rolled or hashed. */
      freeBits: 11 - checksumBits,
      lastWord: words[words.length - 1]
    };
  };

  const mnemonicToSeed = (words, passphrase = '') =>
    pbkdf2Sha512(
      utf8(words.join(' ').normalize('NFKD')),
      utf8(`mnemonic${passphrase}`.normalize('NFKD')),
      2048
    );

  /* ---- BIP32 ------------------------------------------------------------ */

  /* Depth, parent fingerprint and child index are carried alongside the key
     because an extended key is not just the key -- serialising one needs to
     say where in the tree it sits, and a wallet asked to import it will check
     that. The master node is depth 0 with no parent and no index. */
  const masterKey = seed => {
    const I = hmacSha512(utf8('Bitcoin seed'), seed);
    const key = I.slice(0, 32);

    /* BIP32 says a master key is invalid if the left half is zero or is not
       below the curve order, and that such a seed must be rejected rather than
       coerced. The odds are under one in 2^127, so no real seed will ever meet
       this -- but a tool whose claim is that it reproduces the specification
       exactly should not quietly do something else in the one case the
       specification bothers to name. */
    const parsed = toBigInt(key);
    if (parsed === 0n || parsed >= N) {
      throw new Error('this seed does not produce a valid master key under BIP32');
    }

    return {
      key, chainCode: I.slice(32), depth: 0,
      parentFingerprint: new Uint8Array(4), index: 0
    };
  };

  const toBigInt = bytes => BigInt('0x' + hex(bytes));

  /* The first four bytes of HASH160 over the compressed public key. Not a
     commitment to anything -- just enough for a wallet to notice it has been
     handed a key from a different tree than it expected. */
  const publicKeyOf = node => compress(pointMul(toBigInt(node.key)));
  const fingerprint = node => hash160(publicKeyOf(node)).slice(0, 4);

  /* The eight hex digits a signing device shows to say which wallet it is
     currently holding. It is derived from the seed, so adding a passphrase
     changes it -- which is the whole reason devices display it: entering the
     passphrase differently gives a different wallet, and this is the number
     that tells you so before you fund anything. Upper case, the way COLDCARD,
     SeedSigner and Sparrow print it. */
  const masterFingerprint = seed => hex(fingerprint(masterKey(seed))).toUpperCase();

  const ckdPriv = (parent, index) => {
    const hardened = index >= 0x80000000;
    const indexBytes = new Uint8Array(4);
    new DataView(indexBytes.buffer).setUint32(0, index, false);
    const data = hardened
      ? concat(new Uint8Array([0]), parent.key, indexBytes)
      : concat(compress(pointMul(toBigInt(parent.key))), indexBytes);
    const I = hmacSha512(parent.chainCode, data);

    /* Two rejections BIP32 requires, in the order it gives them. The left half
       has to be below the curve order before it is used, and the sum has to be
       non-zero after. Reducing IL modulo n instead -- which is what happens if
       the first test is skipped -- produces a key the specification says does
       not exist, and quietly disagrees with every other implementation for
       that index. Both cases are under one in 2^127; both are named in the
       spec, so both are checked rather than assumed away. */
    const tweak = toBigInt(I.slice(0, 32));
    if (tweak >= N) {
      throw new Error(`child index ${index} is invalid under BIP32; use the next index`);
    }
    const child = mod(tweak + toBigInt(parent.key), N);
    if (child === 0n) {
      throw new Error(`child index ${index} is invalid under BIP32; use the next index`);
    }
    return {
      key: toBytes32(child), chainCode: I.slice(32), depth: parent.depth + 1,
      parentFingerprint: fingerprint(parent), index
    };
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
      xpubVersion: 0x0488b21e, /* BIP32's own version bytes, and what every wallet understands. */
      xprvVersion: 0x0488ade4,
      label: 'Legacy',
      prefix: '1',
      purpose: 44,
      note: 'The original format. Understood everywhere, and the most expensive to spend.',
      encode: pub => base58check(concat(new Uint8Array([0x00]), hash160(pub)))
    },
    nested: {
      xpubVersion: 0x049d7cb2, /* The SLIP-132 variant for nested SegWit. */
      xprvVersion: 0x049d7878,
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
      xpubVersion: 0x04b24746, /* The SLIP-132 variant for native SegWit. */
      xprvVersion: 0x04b2430c,
      label: 'Native SegWit',
      prefix: 'bc1q',
      purpose: 84,
      note: 'The common default today. Cheaper to spend than either format above.',
      encode: pub => segwitAddress('bc', 0, hash160(pub))
    },
    taproot: {
      xpubVersion: 0x0488b21e, /* Taproot descriptors use plain xpub; there is no SLIP-132 prefix for it. */
      xprvVersion: 0x0488ade4,
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

  /* ---- the watch-only descriptor ----------------------------------------

     One line that tells a wallet everything it needs to watch this account and
     nothing it would need to spend from it. Sparrow, Bitcoin Core and most
     coordinators take it directly, which saves a reader picking an address
     type from a menu and hoping it matches the key they pasted -- the
     descriptor states the script type, so it cannot be mismatched.

     Three things make it a descriptor rather than just a key.

     The script type is a function around the key: wpkh for native segwit,
     sh(wpkh(...)) for nested, pkh for legacy, tr for taproot. This is why the
     canonical xpub is used and never the ypub/zpub form -- SLIP-132 prefixes
     say the same thing a second time, in a dialect Core does not read, and a
     descriptor carrying both could disagree with itself.

     The origin -- [fingerprint/84h/0h/0h] -- says which master key this came
     from and where it sits, so a signer can recognise its own key later.

     The multipath suffix /<0;1>/* is BIP389: receive and change in one
     expression, rather than importing two descriptors and hoping they were
     kept in step. */

  /* BIP380. The character set is written in three groups of 32 so that a
     change to a character's position within its group, or to its group,
     affects one symbol rather than several -- which is what lets this catch
     the transcription errors people actually make. */
  const DESC_INPUT_CHARSET =
    "0123456789()[],'/*abcdefgh@:$%{}IJKLMNOPQRSTUVWXYZ&+-.;<=>?!^_|~ijklmnopqrstuvwxyzABCDEFGH`#\"\\ ";
  const DESC_CHECKSUM_CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  /* 40-bit constants, so the arithmetic runs in BigInt. Doing this in Numbers
     would silently lose the top bits past 2^53. */
  const DESC_GENERATOR = [0xf5dee51989n, 0xa9fdca3312n, 0x1bab10e32dn, 0x3706b1677an, 0x644d626ffdn];

  const descPolymod = symbols => {
    let chk = 1n;
    for (const value of symbols) {
      const top = chk >> 35n;
      chk = ((chk & 0x7ffffffffn) << 5n) ^ BigInt(value);
      for (let i = 0n; i < 5n; i++) {
        if ((top >> i) & 1n) chk ^= DESC_GENERATOR[Number(i)];
      }
    }
    return chk;
  };

  const descExpand = text => {
    const groups = [];
    const symbols = [];
    for (const ch of text) {
      const v = DESC_INPUT_CHARSET.indexOf(ch);
      if (v < 0) throw new Error(`"${ch}" cannot appear in a descriptor`);
      symbols.push(v & 31);
      groups.push(v >> 5);
      if (groups.length === 3) {
        symbols.push(groups[0] * 9 + groups[1] * 3 + groups[2]);
        groups.length = 0;
      }
    }
    if (groups.length === 1) symbols.push(groups[0]);
    else if (groups.length === 2) symbols.push(groups[0] * 3 + groups[1]);
    return symbols;
  };

  const descriptorChecksum = text => {
    const chk = descPolymod([...descExpand(text), 0, 0, 0, 0, 0, 0, 0, 0]) ^ 1n;
    let out = '';
    for (let i = 0n; i < 8n; i++) {
      out += DESC_CHECKSUM_CHARSET[Number((chk >> (5n * (7n - i))) & 31n)];
    }
    return out;
  };

  const withChecksum = text => `${text}#${descriptorChecksum(text)}`;

  /* m/84'/0'/0' as descriptors write it: no leading m, and h for hardened.
     Both h and ' are legal; h is the one that survives a shell, a JSON file
     and a copy-paste into a terminal without being eaten as a quote.

     Rebuilt from the parsed indices rather than edited as a string, because
     parsePath is more forgiving than the descriptor grammar is. It accepts
     "m84h/0h/0h" -- no slash after the m -- and read as text that produced
     [deadbeef/m84h/0h/0h], an origin no wallet will parse, wearing a perfectly
     valid BIP380 checksum. A checksum over a malformed string is the worst of
     both worlds: it tells the reader the line survived transcription, which is
     true, and implies it is usable, which is not.

     Going through the indices means the output is canonical whatever the input
     looked like, and anything parsePath rejects never reaches here at all. */
  const descriptorOrigin = path => parsePath(path)
    .map(index => index >= 0x80000000 ? `${index - 0x80000000}h` : String(index))
    .join('/');

  const DESCRIPTOR_SCRIPT = {
    legacy: key => `pkh(${key})`,
    nested: key => `sh(wpkh(${key}))`,
    native: key => `wpkh(${key})`,
    taproot: key => `tr(${key})`
  };

  /* The public half of an account, as a wallet should be given it. Takes the
     canonical xpub deliberately: see the note above. */
  /* branch: leave it out for the multipath form, or pass 0 or 1 for the older
     one-descriptor-per-chain style. BIP389's <0;1> is still a draft, and
     software that predates it rejects the whole descriptor rather than
     guessing, so the page offers both. */
  const watchOnlyDescriptor = ({ addressType, fingerprint, path, xpub, branch = null }) => {
    const script = DESCRIPTOR_SCRIPT[addressType];
    if (!script) throw new Error(`no descriptor form for ${addressType}`);
    if (branch !== null && branch !== 0 && branch !== 1) {
      throw new Error('a descriptor branch is 0 for receiving or 1 for change');
    }
    const branches = branch === null ? '<0;1>' : String(branch);

    /* A root path derives nothing, so there is no path to write after the
       fingerprint -- and BIP380 has a form for exactly that: [fingerprint]
       with no slash. Joining unconditionally produced "[deadbeef/]", which is
       not valid origin syntax and which the checksum then blessed. That is the
       same failure the path canonicalisation was meant to end: a malformed
       string wearing a valid checksum, so the one signal a reader has that the
       line survived transcription says yes to a line no wallet will parse. */
    const origin = descriptorOrigin(path);
    const source = `[${String(fingerprint).toLowerCase()}${origin ? '/' + origin : ''}]`;
    const key = `${source}${xpub}/${branches}/*`;
    return withChecksum(script(key));
  };

  /* ---- entropy from what the user rolled or flipped ---------------------

     Two different jobs, so two different treatments, and the difference is not
     arbitrary. A coin gives exactly one bit, so 256 flips are 256 bits and can
     be packed straight in -- no processing, and a reader can check the mapping
     by hand. A die face carries log2(6) = 2.58 bits, which does not divide
     into whole bits, so the rolls are hashed instead. Hashing is what COLDCARD,
     SeedSigner, Krux and Gordian all do, and it is why 99 rolls is the number
     you see everywhere.

     Neither path invents anything. Same input, same words, every time. */

  /* ---- rewriting a 6 to a 0 ---------------------------------------------

     The BIP39 HTML tool works in base 6, where a die's faces are 0 to 5, so
     it rewrites every rolled 6 as a 0 before doing anything else. Keystone
     does the same and asks for 100 rolls.

     It looks like a triviality and is not. Hashing "126" and hashing "120"
     give unrelated wallets, so a device that rewrites and a device that does
     not will disagree on the same column of rolls even though both are
     honestly hashing dice. */
  const sixToZero = input => input.replace(/6/g, '0');

  /* ---- the bit table ----------------------------------------------------

     Also from entropy.js in the BIP39 HTML tool. Each base-6 value carries a
     fixed bit string:

       0 -> 00   1 -> 01   2 -> 10   3 -> 11   4 -> 0   5 -> 1

     Written in terms of the face actually rolled, which is what a person has
     in front of them:

       1 -> 01   2 -> 10   3 -> 11   4 -> 0    5 -> 1   6 -> 00

     Four faces carry two bits and two carry one, which is a deliberate trade:
     log2(6) = 2.58 bits per roll cannot be spent as whole bits without bias,
     so this spends (4*2 + 2*1) / 6 = 1.67 instead and keeps every bit
     unbiased. The cost is that no fixed number of rolls fills a seed -- 128
     rolls of 4s and 5s give 128 bits where 128 rolls of anything else give
     256 -- so this method counts bits, not rolls.

     Two things about it are easy to get wrong and both change the wallet.
     The codes are not prefix-free -- "0" opens "00" and "01" -- so the bits
     mean nothing without the rolls that produced them. And the tool keeps the
     LAST whole 32 bits, discarding from the front, not the back. */
  const DICE_BITS = { 0: '00', 1: '01', 2: '10', 3: '11', 4: '0', 5: '1', 6: '00' };

  const diceBits = input => {
    let bits = '';
    for (const face of input) bits += DICE_BITS[face] || '';
    return bits;
  };

  /* Bits are packed most significant first, the same order the coin path uses
     and the same order BIP39 reads entropy in. */
  const bitsToBytes = (bits, bytes) => {
    const out = new Uint8Array(bytes);
    for (let i = 0; i < bytes * 8; i++) {
      if (bits[i] === '1') out[i >> 3] |= 0x80 >> (i & 7);
    }
    return out;
  };

  /* The trailing bits, matching the BIP39 tool's raw mode. */
  const tailBits = (bits, bytes) => bitsToBytes(bits.slice(bits.length - bytes * 8), bytes);

  /* ---- the BitBox02 lookup table ----------------------------------------

     Five dice and a coin choose one word directly, with no hashing anywhere.
     Faces 5 and 6 are rerolled, so each die carries exactly 4 possibilities:
     4^5 = 1024, doubled by the coin, is 2048 -- the wordlist exactly.

     The published table is laid out die 1 as the page, dice 2 to 4 as the row
     and die 5 with the coin as the column, heads before tails. That makes the
     first die the most significant and the coin the last bit:

       (d1-1)*512 + (d2-1)*128 + (d3-1)*32 + (d4-1)*8 + (d5-1)*2 + coin

     Checked against every one of the 2048 cells in BitBox's own lookup table
     PDF, not against a sample of it.

     Only 23 words are rolled. The 24th is mostly checksum and cannot be
     chosen freely, which is why the device offers a short list of valid
     endings instead -- see bitboxDraft. */
  const BITBOX_GROUP = 6;
  const BITBOX_ROLLED = 23;

  const bitboxIndex = g =>
    (Number(g[0]) - 1) * 512 +
    (Number(g[1]) - 1) * 128 +
    (Number(g[2]) - 1) * 32 +
    (Number(g[3]) - 1) * 8 +
    (Number(g[4]) - 1) * 2 +
    (g[5] === 'T' ? 1 : 0);

  const BITBOX_GROUP_SHAPE = /^[1-4]{5}[HT]$/;

  /* ---- one octal and two hex dice ---------------------------------------

     Eight faces is three bits and sixteen is four, so one octal die and two
     hex dice are 3 + 4 + 4 = 11 bits thrown at once -- which is exactly one
     BIP39 word index, with nothing left over and nothing to hash. Three dice
     in a cup, read left to right, and the printed dictionary names the word.

     The detail that matters, and the one worth getting from the artifact
     rather than the explanation: the octal die is numbered 1 to 8, not 0 to 7.
     The published dictionary runs from 100 for "abandon" to 8FF for "zoo", so
     the leading digit is one more than the block it selects:

       index = (octal - 1) * 256 + hex1 * 16 + hex2

     Checked against cells sampled the length of that dictionary, both ends
     included. Reading the die as 0 to 7 would shift every word by 256 places
     and produce a wallet nobody could account for.

     Like the BitBox table, only 23 words are rolled. The 24th is mostly
     checksum, so the octal die is thrown once more and its face picks one of
     the eight endings the device offers. */
  const OCTAHEX_INDEX = g =>
    (Number(g[0]) - 1) * 256 + parseInt(g[1], 16) * 16 + parseInt(g[2], 16);

  /* ---- playing cards -----------------------------------------------------

     Suit-major, clubs first, ace low: the order iancoleman/bip39 numbers its
     card table in. Keeping the same order means one index serves both the
     bit table below and the ordinal the fabrication check steps through. */
  const CARD_RANKS = 'A23456789TJQK';
  const CARD_SUITS = 'CDHS';
  const CARD_DECK = (() => {
    const deck = [];
    for (const suit of CARD_SUITS) for (const rank of CARD_RANKS) deck.push(rank + suit);
    return deck;
  })();
  const CARD_ORD = card => CARD_DECK.indexOf(card);

  /* What people actually write down, mapped to what the table indexes.

     Two of these matter. A ten is written "10" far more often than "T", and
     both characters are outside the card alphabet, so the pair used to be
     dropped in silence: "10H" normalised to "H", which is half a card, and
     the reader was told their transcript was malformed without being told
     why. And a deal copied from anywhere that renders suits -- a notes app, a
     spreadsheet, another tool -- arrives carrying the symbols rather than the
     letters.

     Applied before the general strip in normalise(), because that strip is
     what was eating them. Both the filled and outline glyphs are accepted;
     which one a font or a keyboard produces is not something the reader
     chose. Written as escapes rather than the characters themselves so the
     built page stays inside the subset font -- these are read by the browser,
     never drawn.

     Every alias here is a character the old parser deleted. That does not by
     itself make the change backward compatible: a long raw transcript could
     contain a complete alias card that the old parser ignored and still have
     enough canonical cards left to derive a wallet. deriveSeed() therefore
     refuses the rare case where both readings are valid and different. */
  const CARD_ALIAS = raw => String(raw)
    .replace(/[\u2660\u2664]/g, 'S')
    .replace(/[\u2665\u2661]/g, 'H')
    .replace(/[\u2666\u2662]/g, 'D')
    .replace(/[\u2663\u2667]/g, 'C')
    .replace(/10/g, 'T');

  /* The BIP39 tool's card codes, which are not a flat six bits per card: the
     first 32 cards get five bits, the next 16 get four, the last 4 get two.
     That is the same variable-length trick as its dice table and carries the
     same caveat -- "00" for the ten of spades is a prefix of "00000" for the
     ace of clubs, so the codes cannot be read back apart. Generated from the
     rule rather than typed out, and pinned against the published table in
     build/tools/entropy-test.mjs so a slip in the rule cannot pass quietly. */
  const cardCode = index =>
    index < 32 ? index.toString(2).padStart(5, '0')
    : index < 48 ? (index - 32).toString(2).padStart(4, '0')
    : (index - 48).toString(2).padStart(2, '0');
  const CARD_BITS = Object.fromEntries(CARD_DECK.map((card, i) => [card, cardCode(i)]));

  const cardBits = input => {
    let out = '';
    for (let i = 0; i + 2 <= input.length; i += 2) out += CARD_BITS[input.slice(i, i + 2)] || '';
    return out;
  };

  /* How much a draw is actually worth. The first card off a shuffled deck is
     one of 52, the second one of 51, and so on -- so the total is
     log2(52!/(52-n)!), not n x log2(52). Drawing the deck out and shuffling
     again starts the count over, which is why the modulo is here: one deck
     tops out at log2(52!) = 225.6 bits, short of the 256 a 24-word seed
     needs, and the honest way to reach it is a second shuffle rather than
     pretending the 53rd card was worth as much as the first. */
  const LOG2 = x => Math.log(x) / Math.LN2;
  const cardEntropy = drawn => {
    let bits = 0;
    for (let i = 0; i < drawn; i++) bits += LOG2(52 - (i % 52));
    return bits;
  };

  /* Which cards are still face-down, given what has been drawn. Resets on each
     fresh shuffle so the keypad can offer the whole deck again. */
  const cardsLeft = input => {
    const drawn = [];
    for (let i = 0; i + 2 <= input.length; i += 2) drawn.push(input.slice(i, i + 2));
    const used = new Set(drawn.slice(Math.floor(drawn.length / 52) * 52));
    return CARD_DECK.filter(card => !used.has(card));
  };

  /* The first card drawn twice from the same deck, or null if there is none.

     Counted per pass rather than across the whole draw, because a finished
     deck is meant to be shuffled and drawn again: the 53rd card is legitimately
     one of the first 52 over. That is the same accounting cardsLeft uses to
     decide which keys to grey out, so the pad and this agree about when a deck
     has been used up.

     A repeat is not a fabrication -- it is arithmetic. The bits a draw is
     credited with come from cardEntropy, which is log2(52!/(52-n)!) and assumes
     every card is one that had not been drawn yet. Twenty-five copies of the
     ace of spades is worth 5.7 bits, not 132.4, and the meter would have said
     132.4. */
  const repeatedCard = (clean, deck = 52) => {
    const seen = new Set();
    for (let i = 0; i + 2 <= clean.length; i += 2) {
      const nth = i / 2;
      if (nth % deck === 0) seen.clear();
      const card = clean.slice(i, i + 2);
      if (seen.has(card)) return { card, at: nth + 1 };
      seen.add(card);
    }
    return null;
  };

  const METHODS = {
    dice: {
      label: 'Dice',
      unit: 'roll',
      faces: '1-6',
      keep: /[^1-6]/g,
      counts: { 12: 50, 24: 99 },
      /* Every roll goes into the hash, so rolling past the minimum genuinely
         adds to what the seed is made from -- there is no point at which an
         extra roll is ignored. The ceiling is arbitrary and only there to stop
         a paste of something enormous. */
      extra: true,
      most: 500,
      eventBits: LOG2(6),
      matches: 'COLDCARD, SeedSigner, Krux and Gordian all convert dice this way.',
      valid: /^[1-6]*$/,
      /* SHA-256 over the digits exactly as typed, then truncated. */
      entropy: (input, bytes) => sha256(utf8(input)).slice(0, bytes)
    },
    dicezero: {
      label: 'Dice, 6 as 0',
      unit: 'roll',
      faces: '1-6',
      keep: /[^1-6]/g,
      counts: { 12: 50, 24: 99 },
      extra: true,
      most: 500,
      eventBits: LOG2(6),
      matches: 'Keystone and the BIP39 HTML tool rewrite every 6 to a 0, then hash. Same hash as above, different digits going in.',
      valid: /^[1-6]*$/,
      entropy: (input, bytes) => sha256(utf8(sixToZero(input))).slice(0, bytes)
    },
    dicebits: {
      label: 'Dice, bit table',
      unit: 'roll',
      faces: '1-6',
      keep: /[^1-6]/g,
      /* A roll is worth one or two bits depending on the face, so no fixed
         count fills a seed. The fewest rolls that can do it is all-two-bit
         faces, the most is all-one-bit faces. The page counts bits rather
         than rolls for this method, and stops the moment there are enough:
         the tool this follows keeps the last whole 32 bits, so letting the
         count run past the target would quietly change which bits are used. */
      variable: true,
      bits: { 12: 128, 24: 256 },
      counts: { 12: 64, 24: 128 },
      extra: false,
      most: 256,
      eventBits: LOG2(6),
      bitsOf: diceBits,
      /* The last roll is worth one or two bits, so landing on the target
         exactly is not always possible and overshooting by one is. */
      slack: 1,
      matches: 'The BIP39 HTML tool in raw mode. The rolls are read as bits and never hashed, so this and the hashing methods disagree on the same rolls.',
      valid: /^[1-6]*$/,
      entropy: (input, bytes) => tailBits(diceBits(input), bytes)
    },
    bitbox: {
      label: 'Dice, BitBox lookup',
      unit: 'entry',
      faces: '1-4 for the dice, H or T for the coin',
      keep: /[^1-4HT]/g,
      /* Six entries per word -- five dice then the coin -- and 23 words are
         rolled, so the count is exact and the shape of every group matters as
         much as the total. Nothing here is hashed and there is no entropy
         function: the table names the word outright. */
      grouped: BITBOX_GROUP,
      rolled: BITBOX_ROLLED,
      lookup: true,
      /* What may be entered at each position in a group, so the keypad can
         grey out the rest rather than explaining the rule. */
      allow: ['1234', '1234', '1234', '1234', '1234', 'HT'],
      shape: BITBOX_GROUP_SHAPE,
      indexOf: bitboxIndex,
      wrong: 'each word needs five dice showing 1-4 then H or T',
      counts: { 24: BITBOX_GROUP * BITBOX_ROLLED },
      extra: false,
      most: BITBOX_GROUP * BITBOX_ROLLED,
      /* Five four-sided dice and a coin: 5 x log2(4) + 1 = 11 bits a word. */
      groupBits: 11,
      matches: 'The BitBox02 lookup table. Five dice and a coin name each word directly, with nothing hashed.',
      valid: /^([1-4]{5}[HT])*$/
    },
    octahex: {
      label: 'Octal and hex dice',
      unit: 'entry',
      faces: '1-8 for the octal die, 0-9 and A-F for the hex dice',
      keep: /[^0-9A-F]/g,
      grouped: 3,
      lookup: true,
      allow: ['12345678', '0123456789ABCDEF', '0123456789ABCDEF'],
      shape: /^[1-8][0-9A-F]{2}$/,
      indexOf: OCTAHEX_INDEX,
      wrong: 'each word is one octal die showing 1-8 then two hex dice',
      /* Both lengths, unlike the BitBox table. Three dice are 11 bits and a
         word index is 11 bits, so the method does not care how many words you
         want -- it is the same throw either way. 11 words rolled for a 12-word
         seed, 23 for a 24-word one; the last word is picked in both cases. */
      counts: { 12: 33, 24: 69 },
      extra: false,
      most: 69,
      /* One octal die and two hex dice: 3 + 4 + 4 = 11 bits a word. */
      groupBits: 11,
      matches: 'The printed dictionary from entropy.page. Three dice are eleven bits, which is one word exactly, so nothing is hashed and nothing is wasted.',
      valid: /^([1-8][0-9A-F]{2})*$/
    },
    cards: {
      label: 'Cards, hash the draw',
      unit: 'card',
      /* Two characters per event, unlike every other method here. Everything
         that counts entries goes through events(), which reads this. */
      size: 2,
      source: 'cards',
      faces: 'a rank A, 2-9, T, J, Q or K then a suit C, D, H or S. 10 for the ten and the suit symbols are read too',
      keep: /[^A2-9TJQKCDHS]/g,
      alias: CARD_ALIAS,
      deck: 52,
      /* 25 cards carry 132.4 bits and 58 carry 259.3; one short of either and
         the seed would be padded with nothing. Computed from cardEntropy
         rather than rounded off a bits-per-card average. */
      counts: { 12: 25, 24: 58 },
      extra: true,
      most: 104,
      allow: [CARD_RANKS, CARD_SUITS],
      shape: /^[A2-9TJQK][CDHS]$/,
      wrong: 'each card is a rank then a suit, like AS or 7H',
      matches: 'SHA-256 over the cards as drawn, the same way the dice methods hash rolls. Every card goes in whole, so nothing is wasted and no card is worth more than another.',
      valid: /^([A2-9TJQK][CDHS])*$/,
      entropy: (input, bytes) => sha256(utf8(input)).slice(0, bytes)
    },
    cardbits: {
      label: 'Cards, BIP39 tool table',
      unit: 'card',
      size: 2,
      source: 'cards',
      faces: 'a rank A, 2-9, T, J, Q or K then a suit C, D, H or S. 10 for the ten and the suit symbols are read too',
      keep: /[^A2-9TJQKCDHS]/g,
      alias: CARD_ALIAS,
      deck: 52,
      /* Variable-length codes, so cards do not map to a fixed number of bits
         and no card count is the right one -- the page counts bits here, the
         same as the dice bit table, and stops on the target for the same
         reason: this method keeps the LAST whole 32 bits. */
      variable: true,
      bits: { 12: 128, 24: 256 },
      bitsOf: cardBits,
      /* Card codes run two, four and five bits, so the last card can carry the
         total up to four bits past the target. Holding cards to the dice
         table's one-bit tolerance made this method unreachable: a draw sitting
         on 126 bits jumps to 131 and was refused both ways, as too few and
         then as too many. */
      slack: 4,
      counts: { 12: 26, 24: 52 },
      extra: false,
      most: 104,
      allow: [CARD_RANKS, CARD_SUITS],
      shape: /^[A2-9TJQK][CDHS]$/,
      wrong: 'each card is a rank then a suit, like AS or 7H',
      matches: 'The BIP39 HTML tool in card mode. Its codes run five, four and two bits long depending on the card, so the same draw fills a seed at a different point than hashing does.',
      valid: /^([A2-9TJQK][CDHS])*$/,
      entropy: (input, bytes) => tailBits(cardBits(input), bytes)
    },
    coin: {
      label: 'Coin flips',
      unit: 'flip',
      faces: 'H or T',
      keep: /[^HT]/g,
      bitsPer: 'one bit',
      counts: { 12: 128, 24: 256 },
      /* No extras here, and the reason is worth knowing rather than working
         around. A flip is exactly one bit and the bits are packed straight in,
         so 256 flips fill a 256-bit seed exactly. A 257th has nowhere to go --
         it would be read, counted, and then silently dropped, which is worse
         than refusing it. */
      extra: false,
      eventBits: 1,
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

  /* The canonical form of an input: what gets hashed, what gets counted, and
     what the field is rewritten to. Everything that is not a face of the
     chosen method is dropped, so spacing and punctuation never reach a hash. */
  const legacyNormalise = (method, raw) => {
    const spec = METHODS[method];
    return String(raw).toUpperCase().replace(/[^0-9A-Z]/g, '').replace(spec.keep, '');
  };

  const normalise = (method, raw) => {
    const spec = METHODS[method];
    /* Uppercased first so a lower-case deal aliases the same way, then the
       method's own rewrites, then the general strip. Order matters: the strip
       removes everything the alias pass is there to interpret. */
    const cased = String(raw).toUpperCase();
    const aliased = spec.alias ? spec.alias(cased) : cased;
    return aliased.replace(/[^0-9A-Z]/g, '').replace(spec.keep, '');
  };

  /* One entry per roll or flip. Every count, every statistic and every
     progress reading goes through this rather than reading the string
     directly, so what is counted is always what will be converted. */
  const events = (method, raw) => {
    const clean = normalise(method, raw);
    const size = METHODS[method].size || 1;
    if (size === 1) return [...clean];
    /* A trailing half-entry -- a rank with no suit yet -- is not an event and
       must not be counted as one, or the card being chosen right now would
       show up in the total before it exists. */
    const out = [];
    for (let i = 0; i + size <= clean.length; i += size) out.push(clean.slice(i, i + size));
    return out;
  };

  /* Estimated entropy of what has been entered, in bits. Not a quality score
     and not what the seed is made of -- every method below hashes or packs its
     input into a fixed-width seed. It answers a narrower question: how much
     unpredictability the physical events themselves could have carried. */
  const sourceEntropy = ({ method, input }) => {
    const spec = METHODS[method];
    const count = events(method, input).length;
    if (spec.deck) return cardEntropy(count);
    if (spec.grouped) return Math.floor(count / spec.grouped) * spec.groupBits;
    return count * spec.eventBits;
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
  /* The bit-table method rolls the same six-sided die as the hashing one, so
     it is held to the same thresholds. The BitBox method is checked on its
     dice alone: the coin column is a separate two-sided alphabet and mixing
     the two into one frequency test would compare faces that were never in
     competition. */
  const RULES = {
    dice: { alphabet: '123456', minDistinct: 4, maxRun: 15, maxChi: 55, minLz: 0.55 },
    dicezero: { alphabet: '123456', minDistinct: 4, maxRun: 15, maxChi: 55, minLz: 0.55 },
    dicebits: { alphabet: '123456', minDistinct: 4, maxRun: 15, maxChi: 55, minLz: 0.55 },
    bitbox: { alphabet: '1234', minDistinct: 3, maxRun: 13, maxChi: 40, minLz: 0.5, select: (_, i) => i % 6 !== 5 },
    /* Twenty faces over 60 rolls, so the thresholds sit in very different
       places than the six-sided ones: a run of four is already remarkable, and
       chi-squared has 19 degrees of freedom on an expected count of three.
       Calibrated the same way as the others -- far enough into the tail that
       real rolls are not refused. */
    /* Judged on the hex dice alone. The octal die has eight faces where the
       hex dice have sixteen, so counting them together would compare faces
       that were never in competition -- 9 through F can only come from two of
       the three dice. Same reasoning as the BitBox coin column. */
    octahex: {
      alphabet: '0123456789ABCDEF', minDistinct: 7, maxRun: 8, maxChi: 80, minLz: 0.5,
      ordinal: f => parseInt(f, 16),
      select: (_, i) => i % 3 !== 0
    },
    coin: { alphabet: 'HT', minDistinct: 2, maxRun: 34, maxChi: 40, minLz: 0.55 },
    /* Cards break both of the general-purpose tests, so they are switched off
       here rather than left in looking like cover they do not give.

       Chi-squared is degenerate: drawn without replacement every card appears
       once or not at all, so the statistic is a fixed function of how many
       were drawn -- 27.000 for 25 cards, every time, for a real shuffle and a
       sorted deck alike. LZ complexity is barely better. Over 40,000 simulated
       shuffles the lowest score at 25 cards was 0.815, and a deck dealt in
       order scores 0.815 too: with 52 symbols and 25 draws, every sequence
       looks equally novel.

       What does separate them is order. Three checks below, each calibrated
       against 30,000 shuffles at 25, 40, 58 and 80 cards -- worst real value
       in brackets, against the limit:
         adjacent  [0.25]  vs 0.40   sorted or reversed decks run 0.50 to 1.00
         same suit [0.63]  vs 0.80   dealt by suit runs 0.96 to 1.00
         suit run  [10]    vs 13     a suit dealt whole is 13
       A deck stepped through by rank instead -- AC AD AH AS 2C ... -- slips
       past all three, and is caught by the step-period test every method
       already shares. */
    cards: {
      alphabet: CARD_DECK, minDistinct: 2, maxRun: 3, maxChi: Infinity, minLz: 0,
      ordinal: CARD_ORD,
      maxAdjacent: 0.40, maxSameSuit: 0.80, maxSuitRun: 13
    },
    cardbits: {
      alphabet: CARD_DECK, minDistinct: 2, maxRun: 3, maxChi: Infinity, minLz: 0,
      ordinal: CARD_ORD,
      maxAdjacent: 0.40, maxSameSuit: 0.80, maxSuitRun: 13
    }
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
    /* Phrases are built as token lists and keyed with a separator no face can
       contain. Concatenating them as text would make the phrase "1","7" and
       the phrase "17" the same key on a twenty-sided die. */
    let phrase = [];
    for (const c of s) {
      phrase.push(c);
      const key = phrase.join('\u001f');
      if (!seen.has(key)) { seen.add(key); phrase = []; }
    }
    const ideal = s.length / (Math.log(s.length) / Math.log(alphabet.length));
    return seen.size / ideal;
  };

  /* The step from one roll to the next.

     Face counts can be perfectly flat while the sequence was still marched out
     by hand. 1,1,1,2,2,2,3,3,3 up to twenty uses every face exactly three
     times, never repeats as a whole, and sails past every test above --
     distinct faces, chi-squared, period, run length and LZ complexity all call
     it fine. Its derivative says 0,0,1 over and over.

     Krux computes the same thing on its own rolls for the same reason. Only
     defined where faces are numbers, so the coin never reaches it. */
  /* A face only has a derivative if it has an order, and the order is not
     always base ten: hex dice run 0 to F, where "A minus 9" is 1 and reading
     them as decimal would leave the check switched off exactly where a
     stepped sequence is easiest to write. Methods say how to value a face;
     without one, plain digits are assumed and anything else is skipped. */
  const derivative = (faces, ordinal) => {
    const value = ordinal
      || (faces.every(f => /^[0-9]+$/.test(f)) ? (f => Number(f)) : null);
    if (!value) return [];
    return faces.slice(1).map((v, i) => String(value(v) - value(faces[i])));
  };

  const assessEntropy = ({ method, input }) => {
    const rules = RULES[method];
    /* An array of faces, so that everything below counts rolls rather than
       characters. `only` narrows it to the faces a rule actually judges --
       the BitBox coin column is a separate alphabet and does not belong in a
       frequency test against the dice. */
    const all = events(method, input);
    const s = rules.select ? all.filter(rules.select) : all;
    const unit = METHODS[method].unit;
    const distinct = new Set(s).size;
    const period = smallestPeriod(s);
    const run = longestRun(s);
    const chi = chiSquared(s, rules.alphabet);
    const lz = lzComplexity(s, rules.alphabet);
    const steps = derivative(s, rules.ordinal);
    const stepPeriod = steps.length ? smallestPeriod(steps) : 0;
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
        : `"${s.slice(0, period).join('')}" repeats over and over, so there are really only ${period} ${unit}s here, not ${s.length}.`);
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

    /* Only cards carry these, so every other method skips them untouched. */
    if (rules.maxAdjacent && s.length > 1) {
      const ord = s.map(rules.ordinal);
      let adjacent = 0, sameSuit = 0, suitRun = 1, longestSuitRun = 1;
      for (let i = 1; i < s.length; i++) {
        if (Math.abs(ord[i] - ord[i - 1]) === 1) adjacent++;
        if (s[i][1] === s[i - 1][1]) { sameSuit++; suitRun++; if (suitRun > longestSuitRun) longestSuitRun = suitRun; }
        else suitRun = 1;
      }
      const pairs = s.length - 1;
      if (adjacent / pairs > rules.maxAdjacent) {
        failures.push('Card after card is the next one along in the deck. That is a deck being read, not shuffled.');
      }
      if (sameSuit / pairs > rules.maxSameSuit) {
        failures.push('Nearly every card is the same suit as the one before it, so the deck was never mixed.');
      }
      if (longestSuitRun >= rules.maxSuitRun) {
        failures.push(`${longestSuitRun} cards of the same suit came out in a row. A shuffled deck does not do that.`);
      }
    }

    if (stepPeriod && stepPeriod <= steps.length / 3) {
      failures.push(`The gap from each ${unit} to the next repeats in a fixed cycle. The faces themselves come out even, but they were stepped through in order rather than rolled.`);
    }

    return { ok: !failures.length, failures, stats: { distinct, period, run, chi, lz, stepPeriod, length: s.length } };
  };

  /* ---- the whole job, end to end ---------------------------------------- */

  /* Split in two because the halves cost wildly different amounts. Everything
     up to the seed runs PBKDF2's 2048 rounds of HMAC-SHA512 and takes about a
     second; deriving addresses from that seed takes a few milliseconds. The
     page caches the first half, so changing the address type or the path
     repaints immediately instead of re-running the slow part for no reason. */

  /* The minimum is the count that fills the seed; the maximum is the same
     number unless the method absorbs extras. */
  /* Whole words a lookup method rolls, for the length asked for. Derived from
     the entry count rather than stored twice: three dice make one word, so the
     two numbers cannot disagree if only one of them exists. */
  const rolledWords = (method, words) => {
    const spec = METHODS[method];
    return spec.counts[words] / spec.grouped;
  };

  const limits = (method, words) => {
    const spec = METHODS[method];
    const least = spec.counts[words];
    if (spec.variable) return { least, most: spec.bits[words] };
    return { least, most: spec.extra ? spec.most : least };
  };

  /* Whether an already-canonical string reaches the derivation gate. Kept in
     one place so the alias compatibility check asks the same questions as
     deriveSeed(): shape, duplicates and the method's exact size or bit range.
     It deliberately does not run the fabrication heuristic, which the page
     applies separately before derivation and library callers may not use. */
  const canDeriveCanonical = ({ method, clean, words }) => {
    const spec = METHODS[method];
    if (spec.valid && !spec.valid.test(clean)) return false;
    if (spec.deck && repeatedCard(clean, spec.deck)) return false;

    const count = events(method, clean).length;
    if (spec.variable) {
      const have = spec.bitsOf(clean).length;
      const need = spec.bits[words];
      return have >= need && have <= need + spec.slack;
    }

    const { least, most } = limits(method, words);
    return count >= least && count <= most;
  };

  /* Adding meaning to formerly ignored characters creates one unavoidable
     ambiguity: the old parser may have ignored an entire alias card while
     still deriving from the canonical cards around it. If both the legacy and
     alias-aware readings can derive and they differ, neither is chosen. The
     caller must supply an explicit T/C/D/H/S transcript instead. */
  const cardAliasAmbiguity = ({ method, input, words }) => {
    const spec = METHODS[method];
    if (!spec.alias) return null;
    const legacy = legacyNormalise(method, input);
    const aliased = normalise(method, input);
    if (legacy === aliased) return null;
    if (!canDeriveCanonical({ method, clean: legacy, words })) return null;
    if (!canDeriveCanonical({ method, clean: aliased, words })) return null;
    return { legacy, aliased };
  };

  /* How far along the input is, in whatever unit the method actually measures.

     Three different answers hide behind one question. The hashing and coin
     methods count what you typed. The bit-table method counts bits, because
     two inputs of the same length can be a long way apart. The BitBox method
     counts finished words, because five dice and a coin are one unit of
     progress and showing "17 of 138" tells a person nothing they can act on.

     Returning the same shape for all of them keeps the page from growing a
     branch per method every time it repaints. */
  const progress = ({ method, input, words }) => {
    const spec = METHODS[method];
    const clean = normalise(method, input);
    const count = events(method, input).length;

    if (spec.variable) {
      const need = spec.bits[words];
      const have = spec.bitsOf(clean).length;
      /* Stopping the moment the count is reached leaves at most one bit of
         overshoot, because the last roll was worth one or two. More than that
         means rolls were pasted in past the target, and those are refused
         rather than dropped -- the same rule the coin method follows, and for
         the same reason: this method keeps the LAST whole 32 bits, so quietly
         discarding the excess would change the wallet rather than trim it. */
      return {
        have, need, unit: 'bit', rolls: count,
        ready: have >= need && have <= need + spec.slack,
        over: have > need + spec.slack,
        full: have >= need
      };
    }

    if (spec.grouped) {
      const need = rolledWords(method, words);
      const have = Math.floor(count / spec.grouped);
      return {
        have, need, unit: 'word', rolls: count,
        ready: count === need * spec.grouped,
        over: count > need * spec.grouped,
        full: count >= need * spec.grouped
      };
    }

    const { least, most } = limits(method, words);
    return {
      have: count, need: least, unit: spec.unit, rolls: count,
      ready: count >= least && count <= most,
      over: count > most, full: count >= most
    };
  };

  /* Physical deck state is counted in cards even when the selected conversion
     reports progress in bits. Keeping this separate from progress() prevents
     a bit count from ever being labelled as a card count at the reshuffle. */
  const deckProgress = ({ method, input, words }) => {
    const spec = METHODS[method];
    if (!spec.deck) return null;
    const cards = events(method, input).length;
    const turns = Number(words) === 24;
    const second = turns && cards >= spec.deck ? cards - spec.deck : null;
    return {
      cards,
      turn: turns && cards === spec.deck,
      second,
      required: method === 'cards' ? spec.counts[24] - spec.deck : null
    };
  };

  /* The most this method will take, as a canonical string.

     The keypad already stops at the ceiling, but the text box did not: typing
     or pasting past the limit left a count the page would then refuse on
     submit, which is a worse way to find out. Trimming at the point of entry
     means what is on screen is always something that can be converted.

     Each method reaches its ceiling differently -- a fixed count, whole groups
     of six, or enough rolls to fill the bits -- so the trim has to ask the
     method rather than slice a fixed length. */
  const clamp = ({ method, input, words }) => {
    const spec = METHODS[method];
    const clean = normalise(method, input);

    if (spec.variable) {
      const need = spec.bits[words];
      const size = spec.size || 1;
      let bits = 0;
      let i = 0;
      while (i + size <= clean.length && bits < need) {
        bits += spec.bitsOf(clean.slice(i, i + size)).length;
        i += size;
      }
      return clean.slice(0, i);
    }

    if (spec.grouped) return clean.slice(0, rolledWords(method, words) * spec.grouped);

    return clean.slice(0, limits(method, words).most * (spec.size || 1));
  };

  /* Which faces may legally come next. Only the BitBox method restricts it --
     five dice and then a coin, over and over -- but the page asks every
     method so the keypad has one rule to follow. */
  const nextAllowed = (method, input) => {
    const spec = METHODS[method];
    if (!spec.allow) return null;
    const clean = normalise(method, input);

    /* Cards are the only source where what may come next depends on what came
       before rather than only on the position: a card already face-up cannot
       be drawn again from the same deck. Offering it and refusing it after the
       tap would be the worse half of both options. */
    if (spec.deck) {
      const left = cardsLeft(clean);
      if (clean.length % 2 === 0) return [...new Set(left.map(card => card[0]))].join('');
      const rank = clean[clean.length - 1];
      return left.filter(card => card[0] === rank).map(card => card[1]).join('');
    }

    return spec.allow[clean.length % (spec.grouped || spec.allow.length)];
  };

  /* ---- the BitBox02 draft ------------------------------------------------

     23 words come straight out of the table. The 24th cannot: 23 words carry
     253 bits, a 24-word seed is 256 bits of entropy plus an 8-bit checksum,
     so the last word is unrolled bits followed by a checksum over all of them,
     and every value those free bits can take is a different valid wallet.

     How many depends on the length, because 11 does not divide either seed
     evenly:

       24 words   23 rolled = 253 bits, 256 wanted, 3 free   ->   8 endings
       12 words   11 rolled = 121 bits, 128 wanted, 7 free   -> 128 endings

     The checksum is BIP39's: the first entropy/32 bits of its SHA-256, so 8
     bits for a 24-word seed and 4 for a 12-word one. The last word index is
     the free bits followed by those checksum bits, which is why the 24-word
     case reads as tail * 256 + the first hash byte.

     This returns every ending rather than choosing one, because choosing is
     the part of the procedure that belongs to the person doing it. */
  const lookupDraft = ({ method, input, words, wordlist }) => {
    const spec = METHODS[method];
    const clean = normalise(method, input);
    const rolled = rolledWords(method, words);
    const wanted = rolled * spec.grouped;

    if (clean.length !== wanted) {
      throw new Error(`${wanted} entries needed for ${rolled} words, ${clean.length} supplied`);
    }

    const indices = [];
    for (let i = 0; i < wanted; i += spec.grouped) {
      const group = clean.slice(i, i + spec.grouped);
      if (!spec.shape.test(group)) {
        throw new Error(`word ${i / spec.grouped + 1} is "${group}", and ${spec.wrong}`);
      }
      indices.push(spec.indexOf(group));
    }

    const entropyBits = words === 24 ? 256 : 128;
    const checksumBits = entropyBits / 32;
    const freeBits = entropyBits - rolled * 11;

    const rolledBits = indices.map(i => i.toString(2).padStart(11, '0')).join('');
    const options = [];
    for (let tail = 0; tail < (1 << freeBits); tail++) {
      const entropy = bitsToBytes(rolledBits + tail.toString(2).padStart(freeBits, '0'), entropyBits / 8);
      /* The checksum bits are the top of the first hash byte. */
      const checksum = sha256(entropy)[0] >> (8 - checksumBits);
      options.push({
        word: wordlist[(tail << checksumBits) | checksum],
        entropy: hex(entropy)
      });
    }

    return { words: indices.map(i => wordlist[i]), options };
  };

  /* The passphrase is not entropy and is deliberately not treated as any. It
     changes the seed the words produce without changing the words, which is
     exactly why a device can show the right recovery words and still hand back
     an address this page does not predict. Getting it wrong here looks
     identical to the device converting dice differently, so the page asks for
     it rather than letting people chase a mismatch that was never one. */
  /* The seed a set of words produces, plus the fingerprints either side of the
     passphrase. Without one the two are the same and the second PBKDF2 run is
     skipped. */
  const seedOf = (mnemonic, passphrase) => {
    const seed = mnemonicToSeed(mnemonic, passphrase);
    const fingerprint = masterFingerprint(seed);
    if (!passphrase) return { seed, fingerprint, baseFingerprint: fingerprint };
    return { seed, fingerprint, baseFingerprint: masterFingerprint(mnemonicToSeed(mnemonic)) };
  };

  const deriveSeed = ({ method, input, words, wordlist, passphrase = '', choice = 0 }) => {
    const spec = METHODS[method];

    /* The lookup method never builds entropy and then reads words off it; the
       table names the words and the entropy is what they imply. */
    if (spec.lookup) {
      const { words: rolled, options } = lookupDraft({ method, input, words, wordlist });
      const picked = options[choice];
      if (!picked) throw new Error(`pick one of the ${options.length} endings for the last word`);
      const mnemonic = [...rolled, picked.word];
      return { entropy: picked.entropy, mnemonic, options, ...seedOf(mnemonic, passphrase) };
    }

    const ambiguity = cardAliasAmbiguity({ method, input, words });
    if (ambiguity) {
      throw new Error('Those card aliases have two valid readings: older copies ignored them, while this copy reads them as cards. Re-enter the intended deal using T instead of 10 and C, D, H or S instead of suit symbols. Include that card in canonical form if it belongs to the deal, or remove it if it does not.');
    }

    const { least, most } = limits(method, words);
    const clean = normalise(method, input);
    const count = events(method, input).length;

    /* Shape before size, because a malformed sequence has no meaningful size.

       normalise() only drops characters the method has no use for, which is
       enough for every single-character alphabet here but not for cards: ranks
       and suits share one keep-list, so "SS", "AK" and a reversed "SA" all
       survive it and all read as two-character events. Each one hashed into a
       seed and returned a wallet.

       The quiet one is a trailing half-card. events() is right to refuse to
       count it -- the card being chosen right now is not yet an event -- so a
       draw of 25 cards and a stray rank passes the count check on 25 while
       spec.entropy hashes all 51 characters. The count, the meter and the
       thing actually hashed disagreed, and nothing said so.

       This is the last gate before a phrase, and the page is not the only
       caller: this file is meant to be read and reused on its own. */
    if (spec.valid && !spec.valid.test(clean)) {
      throw new Error(spec.wrong
        ? `that sequence is not valid — ${spec.wrong}`
        : `that sequence is not valid for ${spec.label}`);
    }

    /* Well-formed and still impossible. The pad cannot produce this -- it greys
       out what has been drawn -- but a pasted transcript can, and a repeat is
       the one error that costs entropy without changing the card count the
       meter reads. */
    if (spec.deck) {
      const again = repeatedCard(clean, spec.deck);
      if (again) {
        throw new Error(`card ${again.at} is ${again.card}, which has already been drawn — one deck cannot deal the same card twice. Shuffle and keep drawing to start a fresh deck, or correct the transcript.`);
      }
    }

    if (spec.variable) {
      const need = spec.bits[words];
      const have = spec.bitsOf(clean).length;
      if (have < need) {
        throw new Error(`${need} bits needed for ${words} words, and ${count} ${spec.unit}s gave ${have}`);
      }
      if (have > need + spec.slack) {
        throw new Error(`${count} ${spec.unit}s carry ${have} bits, and ${need} is what a ${words}-word seed takes — remove the extra ${spec.unit}s rather than letting the page choose which to drop`);
      }
    } else if (count < least) {
      throw new Error(`${least} ${spec.unit}s needed, ${count} supplied`);
    } else if (count > most) {
      throw new Error(spec.extra
        ? `${most} ${spec.unit}s is the most this accepts, and ${count} were supplied`
        : `exactly ${least} ${spec.unit}s are needed, and ${count} were supplied`);
    }

    const entropy = spec.entropy(clean, words === 24 ? 32 : 16);
    const mnemonic = entropyToMnemonic(entropy, wordlist);
    return { entropy: hex(entropy), mnemonic, ...seedOf(mnemonic, passphrase) };
  };

  /* `extra` addresses past the first on each branch. The page shows one of
     each and folds the rest away: a wallet checking against a device usually
     needs the first, and occasionally needs to see that the run continues.
     Each one costs a point multiplication, which is why this is a small
     number and not a scrolling list. */
  /* SeedQR, as SeedSigner defined it and as Krux, Jade, Passport and the
     COLDCARD Q read it: each word's position in the BIP39 list, zero-based,
     padded to four digits and run together. Twelve words give 48 digits and
     twenty-four give 96.

     Zero-based is the whole of the format and the only thing to get wrong:
     "abandon" is 0000, not 0001, so the all-abandon test phrase ends 0003 for
     "about". A one-off here would produce a QR that scans cleanly and restores
     somebody else's wallet. */
  const seedQrDigits = (mnemonic, wordlist) => mnemonic.map(word => {
    const at = wordlist.indexOf(word);
    if (at < 0) throw new Error(`${word} is not a BIP39 word`);
    return String(at).padStart(4, '0');
  }).join('');

  const deriveAddresses = ({ seed, addressType, path, extra = 4 }) => {
    const account = derive(masterKey(seed), path);
    const type = ADDRESS_TYPES[addressType];
    const addressAt = (branch, index = 0) =>
      type.encode(compress(pointMul(toBigInt(ckdPriv(ckdPriv(account, branch), index).key))));
    const runFrom = branch => Array.from({ length: Math.max(0, extra) }, (unused, i) => ({
      path: `${path}/${branch}/${i + 1}`,
      address: addressAt(branch, i + 1)
    }));
    /* The account key, which is the thing a watch-only wallet actually wants:
       it can derive every address below it and sign nothing. */
    const xpub = encodeXpub(account);
    const typed = encodeXpub(account, type.xpubVersion);
    return {
      receive: { path: `${path}/0/0`, address: addressAt(0) },
      change: { path: `${path}/1/0`, address: addressAt(1) },
      moreReceive: runFrom(0),
      moreChange: runFrom(1),
      xpub,
      /* Only present when the address type has a prefix of its own, so the
         page can stay quiet rather than showing the same string twice. */
      typedXpub: typed === xpub ? null : typed
    };
  };

  /* Address comparison for the result-page check. Bitcoin payment URIs are
     accepted because that is what many wallets copy. Bech32 is
     case-insensitive only when the whole address uses one case; mixed-case
     Bech32 is invalid and must not be made to look like a match by lowering it
     first. Base58 remains case-sensitive. */
  const isBech32Address = value => /^(bc1|tb1|bcrt1)/i.test(value);
  const hasMixedCase = value => /[a-z]/.test(value) && /[A-Z]/.test(value);
  const normalizeAddressCheck = value => {
    const text = String(value ?? '').trim()
      .replace(/^bitcoin:/i, '').replace(/\?.*$/, '').trim();
    if (!text || !isBech32Address(text) || hasMixedCase(text)) return text;
    return text.toLowerCase();
  };
  const addressesEqual = (left, right) => {
    if (!left || !right) return false;
    if (isBech32Address(left) || isBech32Address(right)) {
      if (hasMixedCase(left) || hasMixedCase(right)) return false;
      return left.toLowerCase() === right.toLowerCase();
    }
    return left === right;
  };
  const matchDerivedAddress = (raw, receive = [], change = []) => {
    const address = normalizeAddressCheck(raw);
    if (!address) return { state: 'empty' };
    const find = (rows, chain) => {
      for (const row of rows) {
        if (addressesEqual(address, String(row.address || ''))) {
          return { state: 'match', chain, index: row.index, path: row.path, address: row.address };
        }
      }
      return null;
    };
    return find(receive, 'receive') || find(change, 'change') || {
      state: 'miss', receiveCount: receive.length, changeCount: change.length
    };
  };

  /* Search a bounded slice so the page can yield between batches instead of
     locking the browser while it checks two thousand public keys. `end` is
     exclusive. The caller owns scheduling and cancellation; this stays a
     deterministic crypto primitive that is easy to test. */
  const findDerivedAddress = ({ seed, addressType, path, address, start = 0, end = 1000 }) => {
    const wanted = normalizeAddressCheck(address);
    if (!wanted) return { state: 'empty' };
    const type = ADDRESS_TYPES[addressType];
    if (!type) throw new Error('unknown address type');
    const account = derive(masterKey(seed), path);
    const branches = [ckdPriv(account, 0), ckdPriv(account, 1)];
    const from = Math.max(0, start);
    const to = Math.max(from, end);
    for (let index = from; index < to; index++) {
      for (let branch = 0; branch < 2; branch++) {
        const leaf = ckdPriv(branches[branch], index);
        const candidate = type.encode(compress(pointMul(toBigInt(leaf.key))));
        if (addressesEqual(wanted, candidate)) {
          return {
            state: 'match', chain: branch === 0 ? 'receive' : 'change', index,
            path: `${path}/${branch}/${index}`, address: candidate
          };
        }
      }
    }
    return { state: 'miss', searchedTo: to ? to - 1 : -1 };
  };

  /* Build the two text records that an export control can later download.

     Keeping this in the core, rather than assembling strings in the page,
     gives the boundary between secret and watch-only material one testable
     implementation. The private record receives only a boolean saying
     whether a BIP39 passphrase was used; accepting the value itself would
     make it much too easy for a future UI to write that second secret beside
     the recovery words. The fingerprint without the passphrase can be
     recovered from the words, so it is derived here instead.

     These are intentionally plain UTF-8-friendly, LF-only documents with no
     timestamp or locale-sensitive formatting. The same wallet therefore
     produces the same bytes on every run and on every platform. */
  /* Events per line, and how many sit together before a space. Cards get
     thirteen to a line, a rank's worth, so the rows line up with a deck rather
     than with the page: 58 cards -- what 24 words takes -- reads as four full
     rows and the six that came off the second shuffle. Everything else is
     single characters, grouped in fives the way anyone checking a long run of
     them against paper would group them.

     The spacing is presentation only. normalise() strips it, so what is
     written here can be typed straight back in, which is the whole point of
     recording it. */
  const TRANSCRIPT_SHAPE = { 1: { perLine: 50, group: 5 }, 2: { perLine: 13, group: 1 } };

  const transcriptLines = (method, input) => {
    const size = METHODS[method].size || 1;
    const { perLine, group } = TRANSCRIPT_SHAPE[size] || { perLine: 20, group: 1 };
    const all = events(method, input);
    const lines = [];
    for (let at = 0; at < all.length; at += perLine) {
      const row = all.slice(at, at + perLine);
      const groups = [];
      for (let j = 0; j < row.length; j += group) groups.push(row.slice(j, j + group).join(''));
      lines.push(groups.join(' '));
    }
    return lines;
  };

  const buildWalletExportTexts = ({
    mnemonic, wordlist, seed, addressType, path, passphraseUsed, extra = 4, source = null
  }) => {
    if (!Array.isArray(mnemonic) || ![12, 24].includes(mnemonic.length)) {
      throw new Error('an export needs 12 or 24 recovery words');
    }
    if (!Array.isArray(wordlist) || wordlist.length !== 2048) {
      throw new Error('an export needs the 2048-word BIP39 list');
    }
    if (!checkMnemonic(mnemonic, wordlist).ok) {
      throw new Error('cannot export recovery words with a bad BIP39 checksum');
    }
    if (!(seed instanceof Uint8Array) || seed.length !== 64) {
      throw new Error('an export needs a 64-byte BIP39 seed');
    }
    if (typeof passphraseUsed !== 'boolean') {
      throw new Error('an export must say whether a BIP39 passphrase was used');
    }
    if (!Number.isInteger(extra) || extra < 0) {
      throw new Error('extra address count must be a non-negative integer');
    }

    const type = ADDRESS_TYPES[addressType];
    if (!type) throw new Error(`unknown address type: ${addressType}`);

    /* The rolls, flips or draw that produced these words, so the record can be
       checked against the paper it was written on years later.

       Proof rather than claim: the transcript is run back through the same
       derivation and the record is refused if it does not reproduce the words
       beside it. A passphrase cannot change a mnemonic, only the seed under
       it, so this verification needs no secret the builder was not already
       handed. Watch-only never sees any of it -- a transcript is the seed
       material itself, not a key derived from it. */
    let sourceSections = [];
    if (source) {
      const { method, input, words, choice = 0 } = source;
      const spec = METHODS[method];
      if (!spec) throw new Error(`unknown entropy method: ${method}`);
      const replay = deriveSeed({ method, input, words, wordlist, choice });
      if (replay.mnemonic.join(' ') !== mnemonic.join(' ')) {
        throw new Error('the recorded sequence does not reproduce these recovery words');
      }
      const count = events(method, input).length;
      const unit = count === 1 ? spec.unit
        : spec.unit.endsWith('y') ? `${spec.unit.slice(0, -1)}ies` : `${spec.unit}s`;
      sourceSections = [
        [
          'Entropy source',
          `Method: ${spec.label}`,
          `Words: ${words}`,
          ...(spec.lookup ? [`Ending chosen: ${choice + 1} of ${replay.options.length}`] : []),
          `Recorded: ${count} ${unit}`
        ],
        [
          'Transcript',
          'Entered into the Workshop under the same method and word count, this',
          'reproduces the words above. Spacing and line breaks are ignored.',
          ...transcriptLines(method, input)
        ]
      ];
    }

    /* Rebuild the path from its parsed indices so spelling variants such as h
       and an uppercase M cannot make byte-different exports of one wallet. */
    const canonicalPath = `m${parsePath(path).map(index => {
      const hardened = index >= 0x80000000;
      return `/${hardened ? index - 0x80000000 : index}${hardened ? "'" : ''}`;
    }).join('')}`;

    const root = masterKey(seed);
    const account = derive(root, canonicalPath);
    const addresses = deriveAddresses({ seed, addressType, path: canonicalPath, extra });
    const fingerprint = masterFingerprint(seed);
    const baseFingerprint = passphraseUsed
      ? masterFingerprint(mnemonicToSeed(mnemonic))
      : fingerprint;
    const accountXprv = encodeXprv(account);
    const typedXprv = encodeXprv(account, type.xprvVersion);
    const descriptorArgs = {
      addressType, fingerprint, path: canonicalPath, xpub: addresses.xpub
    };

    const joinSections = sections => sections.map(lines => lines.join('\n')).join('\n\n') + '\n';
    const numberedWords = mnemonic.map((word, index) =>
      `${String(index + 1).padStart(2, '0')}. ${word}`);

    const privateText = joinSections([
      [
        'SelfCustody.ca Entropy Workshop - PRIVATE RECOVERY RECORD',
        'KEEP SECRET. Anyone with the recovery words or private keys can spend this wallet.'
      ],
      [`Recovery words (${mnemonic.length})`, ...numberedWords],
      ['SeedQR digits', seedQrDigits(mnemonic, wordlist)],
      [
        'Wallet identity',
        `Master fingerprint: ${fingerprint}`,
        `Fingerprint without passphrase: ${baseFingerprint}`,
        `BIP39 passphrase: ${passphraseUsed ? 'used (value intentionally not included)' : 'not used'}`,
        `Address type: ${type.label}`,
        `Account path: ${canonicalPath}`
      ],
      [
        'Master private key',
        'Path: m',
        `Canonical xprv: ${encodeXprv(root)}`
      ],
      [
        'Account private key',
        `Path: ${canonicalPath}`,
        `Canonical xprv: ${accountXprv}`,
        ...(typedXprv === accountXprv ? [] : [`SLIP-132 ${typedXprv.slice(0, 4)}: ${typedXprv}`])
      ],
      ...sourceSections
    ]);

    const receive = [addresses.receive, ...addresses.moreReceive];
    const change = [addresses.change, ...addresses.moreChange];
    const watchOnlyText = joinSections([
      [
        'SelfCustody.ca Entropy Workshop - WATCH-ONLY WALLET RECORD',
        'SHARE WITH CARE. This record cannot spend, but it reveals addresses and wallet activity.'
      ],
      [
        'Wallet identity',
        `Master fingerprint: ${fingerprint}`,
        `Address type: ${type.label}`,
        `Account path: ${canonicalPath}`
      ],
      [
        'Account public key',
        `Canonical xpub: ${addresses.xpub}`,
        ...(addresses.typedXpub
          ? [`SLIP-132 ${addresses.typedXpub.slice(0, 4)}: ${addresses.typedXpub}`]
          : [])
      ],
      [
        'Watch-only descriptors',
        `Combined receive/change: ${watchOnlyDescriptor(descriptorArgs)}`,
        `Receive: ${watchOnlyDescriptor({ ...descriptorArgs, branch: 0 })}`,
        `Change: ${watchOnlyDescriptor({ ...descriptorArgs, branch: 1 })}`
      ],
      [
        'Addresses',
        'Receive',
        ...receive.map(item => `${item.path}: ${item.address}`),
        'Change',
        ...change.map(item => `${item.path}: ${item.address}`)
      ]
    ]);

    return { privateText, watchOnlyText };
  };

  const buildWallet = ({ method, input, words, addressType, path, wordlist, passphrase = '', choice = 0 }) => {
    const { entropy, mnemonic, seed } = deriveSeed({ method, input, words, wordlist, passphrase, choice });
    return { entropy, mnemonic, ...deriveAddresses({ seed, addressType, path }) };
  };

  return {
    hex, fromHex, utf8, concat,
    sha256, sha512, hmacSha512, pbkdf2Sha512, ripemd160,
    hash160, hash256, taggedHash,
    pointMul, compress, base58check, base58checkDecode, segwitAddress, convertBits,
    entropyToMnemonic, checkMnemonic, mnemonicToSeed, masterKey, ckdPriv, derive, parsePath,
    encodeXpub, encodeXprv, fingerprint, masterFingerprint, publicKeyOf,
    XPUB_VERSION, XPRV_VERSION,
    descriptorChecksum, withChecksum, descriptorOrigin, watchOnlyDescriptor,
    ADDRESS_TYPES, METHODS, accountPath, legacyNormalise, normalise, events,
    diceBits, sixToZero, bitsToBytes, tailBits, bitboxIndex, lookupDraft,
    cardBits, cardEntropy, cardsLeft, repeatedCard, cardAliasAmbiguity, seedQrDigits,
    sourceEntropy, CARD_DECK, CARD_RANKS, CARD_SUITS,
    progress, deckProgress, nextAllowed, clamp, rolledWords,
    deriveSeed, deriveAddresses, normalizeAddressCheck, matchDerivedAddress,
    findDerivedAddress, buildWalletExportTexts, buildWallet, limits,
    assessEntropy, smallestPeriod, longestRun, chiSquared, lzComplexity, derivative
  };
})();

/* No export statement on purpose. This file is a classic script: the page
   inlines it inside a plain <script> tag and picks up EntropyCore from there,
   and the test suite evaluates the same source the same way. Nothing about how
   it loads differs between the shipped page and the tests. */

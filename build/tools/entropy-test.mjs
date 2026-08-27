/* Test vectors for build/tools/entropy-core.js.

   Run:  npm run test:entropy

   Every vector here is from a published specification, not from running this
   code and recording what it said. That distinction is the whole point: a
   self-check that compares the tool against itself proves nothing.

   The same suite is embedded in the shipped page and runs on load. If any of
   it fails the page refuses to show results, because a conversion tool that is
   quietly wrong is worse than no tool -- it would tell someone their hardware
   wallet is dishonest when the fault is here. */
import { readFileSync } from 'node:fs';
import { loadCore } from './load-core.mjs';

const C = loadCore();
const WORDLIST = readFileSync('build/tools/bip39-english.txt', 'utf8').trim().split(/\r?\n/);

/* The 12- and 24-word all-zero-entropy phrases from BIP39's own vectors, used
   as the base mnemonic for every address vector below. */
const ABANDON_12 = 'abandon '.repeat(11) + 'about';
const ABANDON_24 = 'abandon '.repeat(23) + 'art';

/* Two sequences straight from a CSPRNG, pinned here so the suite is
   deterministic. Both must be allowed through: the check exists to catch typed
   input, and a version of it that rejected genuine rolls would be worse than
   having no check at all -- it would teach people to re-roll until they pass,
   which is the one thing the dice guide says never to do. */
const REAL_ROLLS = '544114545535114225212651531526245631146421553114213555633324324654465346361515622414366414163654633';
const REAL_FLIPS = 'THTTTHTHTHTHHHTTHHTTTTHTTHHHTHHHTHHTHHHTTHTHTHTHTHHTHTHTTTTHTTTTTTTTTHHHTTTTHTHTHTTTTHTTTHTHTTTHHTHTTTHHHTTTHHHTHTHTTHTHTTHTHTHTTTHHHTHHHTHTHHTTTTHHTHTTHTHHHHHTHTHTTTHHHHHTTHHHHHHHHTHHTHTTHHHHTHHTHTTTHTHTTTHTHTTTHHTHTHHTTTTTHTTHHTTHHTTTTTTHHHHHHHTHHHTHHHHH';

/* Sixty-nine entries -- 23 words of octal, hex, hex -- from a CSPRNG, with
   the octal column held to 1-8 and the hex columns to 0-F. */
const REAL_OCTAHEX = '5B3172E48C6F19A2D7403E8B5C1'
  + '69F2A83D07E4B1C596A2F38D0E7'
  + '4B1A6C39F28E5D07B4A1936FC2E';

/* A real 25-card draw from a CSPRNG-shuffled deck, pinned so the suite stays
   deterministic. It has to be accepted: a check that refused genuine shuffles
   would teach people to redraw until they passed, which is the one thing the
   dice guide says never to do. */
const REAL_DRAW = '7H2CTS4DJHAS9C6SKD3H8DQCTC5H2SJD9HKC4S7DAH6C3STD8SQH5C';

/* iancoleman/bip39, src/js/entropy.js, eventBits["card"] -- transcribed from
   the published source rather than from this implementation. */
const COLEMAN_CARDS = [
  ['AC','00000'],['2C','00001'],['3C','00010'],['4C','00011'],['5C','00100'],['6C','00101'],
  ['7C','00110'],['8C','00111'],['9C','01000'],['TC','01001'],['JC','01010'],['QC','01011'],
  ['KC','01100'],['AD','01101'],['2D','01110'],['3D','01111'],['4D','10000'],['5D','10001'],
  ['6D','10010'],['7D','10011'],['8D','10100'],['9D','10101'],['TD','10110'],['JD','10111'],
  ['QD','11000'],['KD','11001'],['AH','11010'],['2H','11011'],['3H','11100'],['4H','11101'],
  ['5H','11110'],['6H','11111'],['7H','0000'],['8H','0001'],['9H','0010'],['TH','0011'],
  ['JH','0100'],['QH','0101'],['KH','0110'],['AS','0111'],['2S','1000'],['3S','1001'],
  ['4S','1010'],['5S','1011'],['6S','1100'],['7S','1101'],['8S','1110'],['9S','1111'],
  ['TS','00'],['JS','01'],['QS','10'],['KS','11']
];

/* The account descriptor for one address type, from BIP39's all-zero test
   mnemonic -- the same seed the address vectors above use. */
function descriptorFor(type, branch = null) {
  const seed = C.mnemonicToSeed(ABANDON_12.split(' '));
  const path = C.accountPath(type, 0);
  const { xpub } = C.deriveAddresses({ seed, addressType: type, path });
  return C.watchOnlyDescriptor({
    addressType: type, fingerprint: C.masterFingerprint(seed), path, xpub, branch
  });
}

/* BIP380's descsum_check, so the suite verifies its own output the way a
   wallet would rather than only comparing strings. */
function descsumCheck(text) {
  const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  if (text[text.length - 9] !== '#') return false;
  const sum = text.slice(-8);
  if (![...sum].every(c => CHARSET.includes(c))) return false;
  const body = text.slice(0, -9);
  return C.descriptorChecksum(body) === sum;
}

export const VECTORS = [
  /* ---- FIPS 180-4, RFC 1320 and RFC 4231 ---- */
  ['sha256 of empty', () => C.hex(C.sha256(C.utf8(''))),
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
  ['sha256 of abc', () => C.hex(C.sha256(C.utf8('abc'))),
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
  ['sha512 of abc', () => C.hex(C.sha512(C.utf8('abc'))),
    'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'],
  ['ripemd160 of abc', () => C.hex(C.ripemd160(C.utf8('abc'))),
    '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc'],
  ['hmac-sha512 rfc4231 case 2', () => C.hex(C.hmacSha512(C.utf8('Jefe'), C.utf8('what do ya want for nothing?'))),
    '164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b636e070a38bce737'],

  /* ---- BIP39 ---- */
  ['bip39 12 words from zero entropy',
    () => C.entropyToMnemonic(C.fromHex('00'.repeat(16)), WORDLIST).join(' '), ABANDON_12],
  ['bip39 24 words from zero entropy',
    () => C.entropyToMnemonic(C.fromHex('00'.repeat(32)), WORDLIST).join(' '), ABANDON_24],
  ['bip39 12 words from 7f entropy',
    () => C.entropyToMnemonic(C.fromHex('7f'.repeat(16)), WORDLIST).join(' '),
    'legal winner thank year wave sausage worth useful legal winner thank yellow'],
  ['bip39 12 words from 80 entropy',
    () => C.entropyToMnemonic(C.fromHex('80'.repeat(16)), WORDLIST).join(' '),
    'letter advice cage absurd amount doctor acoustic avoid letter advice cage above'],
  ['bip39 12 words from ff entropy',
    () => C.entropyToMnemonic(C.fromHex('ff'.repeat(16)), WORDLIST).join(' '),
    'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong'],
  ['bip39 seed with TREZOR passphrase',
    () => C.hex(C.mnemonicToSeed(ABANDON_12.split(' '), 'TREZOR')),
    'c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04'],

  /* ---- BIP32 test vector 1, seed 000102...0f ---- */
  ['bip32 master key from seed', () => {
    const m = C.masterKey(C.fromHex('000102030405060708090a0b0c0d0e0f'));
    return `${C.hex(m.key)} ${C.hex(m.chainCode)}`;
  }, 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35 '
   + '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508'],
  ['bip32 derive m/0h/1/2h/2/1000000000', () => {
    const node = C.derive(C.masterKey(C.fromHex('000102030405060708090a0b0c0d0e0f')), "m/0'/1/2'/2/1000000000");
    return `${C.hex(node.key)} ${C.hex(node.chainCode)}`;
  }, '471b76e389e528d6de6d816857e012c5455051cad6660850e58372a6c3e6e7c8 '
   + 'c783e67b921d2beb8f6b389cc646d7263b4145701dadd2161548a8b078e65e9e'],

  /* ---- the master fingerprint ----

     BIP32's first test vector gives the parent fingerprint of m/0' as
     3442193e, and the parent of m/0' is the master key -- so that value is the
     master fingerprint for its seed, quoted from the specification rather than
     from this code. */
  ['bip32 master fingerprint',
    () => C.masterFingerprint(C.fromHex('000102030405060708090a0b0c0d0e0f')), '3442193E'],
  ['a passphrase changes the fingerprint', () => {
    const args = { method: 'dice', input: REAL_ROLLS, words: 24, wordlist: WORDLIST };
    const plain = C.deriveSeed(args);
    const salted = C.deriveSeed({ ...args, passphrase: 'test' });
    return [
      plain.fingerprint === plain.baseFingerprint,
      salted.fingerprint !== salted.baseFingerprint,
      salted.baseFingerprint === plain.fingerprint
    ].join(' ');
  }, 'true true true'],
  ['the fingerprint is eight hex digits', () => {
    const { fingerprint } = C.deriveSeed({ method: 'dice', input: REAL_ROLLS, words: 24, wordlist: WORDLIST });
    return /^[0-9A-F]{8}$/.test(fingerprint) ? 'eight upper hex' : fingerprint;
  }, 'eight upper hex'],

  /* ---- extended public keys ----

     BIP32 publishes the master and first-child xpub for its own seed; BIP49
     and BIP84 publish the account key for the abandon-about mnemonic in their
     own prefixes. All four are quoted verbatim, so the version bytes, the
     depth, the parent fingerprint and the child index are all pinned -- get
     any one of them wrong and the string still looks like an xpub. */
  ['bip32 master xpub',
    () => C.encodeXpub(C.masterKey(C.fromHex('000102030405060708090a0b0c0d0e0f'))),
    'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8'],
  ['bip32 xpub for m/0h',
    () => C.encodeXpub(C.derive(C.masterKey(C.fromHex('000102030405060708090a0b0c0d0e0f')), "m/0'")),
    'xpub68Gmy5EdvgibQVfPdqkBBCHxA5htiqg55crXYuXoQRKfDBFA1WEjWgP6LHhwBZeNK1VTsfTFUHCdrfp1bgwQ9xv5ski8PX9rL2dZXvgGDnw'],
  ['bip49 account ypub', () => accountKey("m/49'/0'/0'", 'nested'),
    'ypub6Ww3ibxVfGzLrAH1PNcjyAWenMTbbAosGNB6VvmSEgytSER9azLDWCxoJwW7Ke7icmizBMXrzBx9979FfaHxHcrArf3zbeJJJUZPf663zsP'],
  ['bip84 account zpub', () => accountKey("m/84'/0'/0'", 'native'),
    'zpub6rFR7y4Q2AijBEqTUquhVz398htDFrtymD9xYYfG1m4wAcvPhXNfE3EfH1r1ADqtfSdVCToUG868RvUUkgDKf31mGDtKsAYz2oz2AGutZYs'],
  /* The same key in two prefixes. SLIP-132 changes four version bytes and
     nothing else, which is why a wallet showing zpub and one showing xpub can
     look like a mismatch and not be one. */
  ['slip-132 prefixes are the same key in different clothes', () => {
    const node = C.derive(C.masterKey(C.mnemonicToSeed(ABANDON_12.split(' '))), "m/84'/0'/0'");
    const asX = C.encodeXpub(node);
    const asZ = C.encodeXpub(node, C.ADDRESS_TYPES.native.xpubVersion);
    return [asX.slice(0, 4), asZ.slice(0, 4), asX === asZ ? 'same' : 'different'].join(' ');
  }, 'xpub zpub different'],
  ['taproot has no prefix of its own',
    () => C.ADDRESS_TYPES.taproot.xpubVersion === C.XPUB_VERSION ? 'plain xpub' : 'other',
    'plain xpub'],
  ['the account key is handed back with the addresses', () => {
    const out = C.deriveAddresses({
      seed: C.mnemonicToSeed(ABANDON_12.split(' ')), addressType: 'native', path: "m/84'/0'/0'"
    });
    return [out.xpub.slice(0, 4), out.typedXpub.slice(0, 4)].join(' ');
  }, 'xpub zpub'],
  ['legacy needs no second form', () => {
    const out = C.deriveAddresses({
      seed: C.mnemonicToSeed(ABANDON_12.split(' ')), addressType: 'legacy', path: "m/44'/0'/0'"
    });
    return out.typedXpub === null ? 'one form' : 'two';
  }, 'one form'],

  /* ---- addresses, from the test vectors in BIP44/49/84/86 ---- */
  ['bip44 legacy receive', () => addressFor('legacy', "m/44'/0'/0'", 0),
    '1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA'],
  ['bip49 nested segwit receive', () => addressFor('nested', "m/49'/0'/0'", 0),
    '37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf'],
  ['bip84 native segwit receive', () => addressFor('native', "m/84'/0'/0'", 0),
    'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu'],
  ['bip84 native segwit change', () => addressFor('native', "m/84'/0'/0'", 1),
    'bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el'],
  ['bip86 taproot receive', () => addressFor('taproot', "m/86'/0'/0'", 0),
    'bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr'],
  ['bip86 taproot change', () => addressFor('taproot', "m/86'/0'/0'", 1),
    'bc1p3qkhfews2uk44qtvauqyr2ttdsw7svhkl9nkm9s9c3x4ax5h60wqwruhk7'],

  /* ---- the two input methods ---- */
  ['coin flips pack straight into entropy',
    () => C.hex(C.METHODS.coin.entropy('H'.repeat(128), 16)), 'ff'.repeat(16)],
  ['coin flips, all tails',
    () => C.hex(C.METHODS.coin.entropy('T'.repeat(128), 16)), '00'.repeat(16)],
  /* ---- the entropy sanity check ----
     Fabricated input must be refused, and real randomness must not be. The
     false-positive rate is measured separately in `npm run test:entropy --
     --calibrate`; these pin the behaviour that matters per case. */
  ['refuses 99 identical rolls', () => refused('dice', '1'.repeat(99)), 'refused'],
  ['refuses "123456" typed to length', () => refused('dice', '123456'.repeat(16) + '123'), 'refused'],
  ['refuses a descending pattern', () => refused('dice', '654321'.repeat(16) + '654'), 'refused'],
  ['refuses blocked runs', () => refused('dice', '111222333444555666'.repeat(5) + '111222333'), 'refused'],
  ['refuses two long blocks', () => refused('dice', '1'.repeat(50) + '2'.repeat(49)), 'refused'],
  ['refuses all heads', () => refused('coin', 'H'.repeat(256)), 'refused'],
  ['refuses alternating flips', () => refused('coin', 'HT'.repeat(128)), 'refused'],
  ['refuses HHTT repeated', () => refused('coin', 'HHTT'.repeat(64)), 'refused'],
  ['allows a real 99-roll sequence', () => refused('dice', REAL_ROLLS), 'allowed'],

  /* ---- how many rolls are accepted ---- */
  ['dice: 99 is the minimum for 24 words', () => C.limits('dice', 24).least, 99],
  ['dice: extras are welcome up to a ceiling', () => C.limits('dice', 24).most, 500],
  ['coin: the count is exact, not a minimum', () => {
    const { least, most } = C.limits('coin', 24);
    return least === most ? 'exact' : 'range';
  }, 'exact'],
  ['an extra roll changes the seed, so it is not wasted', () => {
    const more = REAL_ROLLS + '4';
    return C.hex(C.METHODS.dice.entropy(REAL_ROLLS, 32)) === C.hex(C.METHODS.dice.entropy(more, 32))
      ? 'ignored' : 'absorbed';
  }, 'absorbed'],
  ['150 rolls derive a wallet', () => {
    const long = (REAL_ROLLS + REAL_ROLLS).slice(0, 150);
    return C.deriveSeed({ method: 'dice', input: long, words: 24, wordlist: WORDLIST }).mnemonic.length;
  }, 24],
  ['too few rolls is still refused', () => {
    try { C.deriveSeed({ method: 'dice', input: '1234', words: 24, wordlist: WORDLIST }); return 'accepted'; }
    catch { return 'refused'; }
  }, 'refused'],
  ['past the ceiling is refused', () => {
    try { C.deriveSeed({ method: 'dice', input: REAL_ROLLS.repeat(6), words: 24, wordlist: WORDLIST }); return 'accepted'; }
    catch { return 'refused'; }
  }, 'refused'],
  ['an extra flip is refused rather than dropped', () => {
    try { C.deriveSeed({ method: 'coin', input: REAL_FLIPS + 'H', words: 24, wordlist: WORDLIST }); return 'accepted'; }
    catch { return 'refused'; }
  }, 'refused'],
  ['allows a real 256-flip sequence', () => refused('coin', REAL_FLIPS), 'allowed'],

  ['dice rolls are the sha256 of the digits as typed',
    () => C.hex(C.METHODS.dice.entropy('123456'.repeat(16) + '123', 32)),
    C.hex(C.sha256(C.utf8('123456'.repeat(16) + '123')))],

  /* COLDCARD's own documentation works this example: rolling 123456 gives a
     seed value of sha256('123456'). It is the only vendor-published vector
     this page has for a dice conversion, so it is pinned verbatim. */
  ['coldcard: the worked example from its docs',
    () => C.hex(C.METHODS.dice.entropy('123456', 32)),
    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'],

  /* ---- rewriting a 6 to a 0 ----

     The BIP39 HTML tool and Keystone both work in base 6, so a rolled 6
     becomes a 0 before hashing. Same hash, different digits going in. */
  ['six is rewritten as zero before hashing',
    () => C.hex(C.METHODS.dicezero.entropy('123456', 32)),
    C.hex(C.sha256(C.utf8('123450')))],
  ['rewriting changes the wallet',
    () => C.hex(C.METHODS.dicezero.entropy(REAL_ROLLS, 32))
      === C.hex(C.METHODS.dice.entropy(REAL_ROLLS, 32)) ? 'same' : 'different',
    'different'],
  ['rolls without a six hash identically either way',
    () => C.hex(C.METHODS.dicezero.entropy('12345'.repeat(20), 32))
      === C.hex(C.METHODS.dice.entropy('12345'.repeat(20), 32)) ? 'same' : 'different',
    'same'],

  /* ---- the bit table ----

     The mapping is the one in entropy.js in the BIP39 HTML tool, which works
     in base 6 -- a rolled 6 is a 0 there -- and gives 0:00 1:01 2:10 3:11
     4:0 5:1. Read back as rolled faces that is 1:01 2:10 3:11 4:0 5:1 6:00. */
  ['bit table: every face maps to its published code',
    () => C.diceBits('123456'), '0110110100'],
  ['bit table: 4s and 5s carry one bit each',
    () => C.diceBits('4545'), '0101'],
  ['bit table: a rolled six reads as base-6 zero',
    () => C.diceBits('6') === C.diceBits('0') ? 'same' : 'different', 'same'],
  /* The codes are NOT prefix-free, whatever the method gets called elsewhere:
     "0" opens both "00" and "01". Pinned so nobody later "fixes" the table
     into something self-delimiting and silently moves every wallet. */
  ['bit table: the codes are not prefix free',
    () => {
      const codes = ['00', '01', '10', '11', '0', '1'];
      return codes.some((a, i) => codes.some((b, j) => i !== j && b.startsWith(a)))
        ? 'not prefix free' : 'prefix free';
    }, 'not prefix free'],
  ['bit table: 128 rolls of 6 give 256 zero bits',
    () => C.hex(C.METHODS.dicebits.entropy('6'.repeat(128), 32)), '00'.repeat(32)],
  ['bit table: 128 rolls of 3 give 256 one bits',
    () => C.hex(C.METHODS.dicebits.entropy('3'.repeat(128), 32)), 'ff'.repeat(32)],
  /* Raw mode keeps the last whole 32 bits and discards from the front, so a
     leading roll that overshoots the target is dropped rather than the
     trailing one. 129 threes are 258 bits; the first two go. */
  ['bit table: the leading bits are the ones discarded',
    () => C.hex(C.METHODS.dicebits.entropy('6' + '3'.repeat(128), 32)), 'ff'.repeat(32)],
  ['bit table: hashing the same rolls gives something else',
    () => C.hex(C.METHODS.dicebits.entropy(REAL_ROLLS.repeat(2), 32))
      === C.hex(C.METHODS.dice.entropy(REAL_ROLLS.repeat(2), 32)) ? 'same' : 'different',
    'different'],
  ['bit table: rolls past the bit count are refused, not trimmed', () => {
    try {
      C.deriveSeed({ method: 'dicebits', input: '1'.repeat(200), words: 24, wordlist: WORDLIST });
      return 'accepted';
    } catch { return 'refused'; }
  }, 'refused'],
  ['bit table: one bit of overshoot is allowed', () => {
    /* Landing exactly on 256 is not always possible: 127 two-bit faces plus a
       one-bit face is 255, and the next roll carries the count to either 256
       or 257 depending on its face. Both must be accepted, or a legitimate
       sequence would be unusable. */
    const short = '1'.repeat(127) + '4';                       /* 255 bits */
    const at256 = C.progress({ method: 'dicebits', input: short + '4', words: 24 });
    const at257 = C.progress({ method: 'dicebits', input: short + '1', words: 24 });
    return [at256.have, at256.ready, at257.have, at257.ready].join(' ');
  }, '256 true 257 true'],
  ['bit table: two bits of overshoot is not', () => {
    const at258 = C.progress({ method: 'dicebits', input: '1'.repeat(129), words: 24 });
    return [at258.have, at258.ready, at258.over].join(' ');
  }, '258 false true'],
  ['bit table: rolls short of the bit count are refused', () => {
    try {
      C.deriveSeed({ method: 'dicebits', input: '4'.repeat(200), words: 24, wordlist: WORDLIST });
      return 'accepted';
    } catch { return 'refused'; }
  }, 'refused'],

  /* ---- the BitBox02 lookup table ----

     Cells quoted from BitBox's published lookup table PDF. Corners first, so
     a mistake in the weighting of any one die shows up rather than cancelling
     out in the middle of the range. */
  ['bitbox: first cell of the table', () => wordFor('11111H'), 'abandon'],
  ['bitbox: the coin is the last bit', () => wordFor('11111T'), 'ability'],
  ['bitbox: die five outranks the coin', () => wordFor('11114T'), 'abstract'],
  ['bitbox: row 1234 of page one', () => wordFor('12341H'), 'brand'],
  ['bitbox: page two starts at divorce', () => wordFor('21111H'), 'divorce'],
  ['bitbox: row 3222 of page three', () => wordFor('32221H'), 'never'],
  ['bitbox: last cell of the table', () => wordFor('44444T'), 'zoo'],

  /* 23 words of all-ones dice and heads is 253 zero bits, so the eight valid
     endings are the eight 24-word phrases whose entropy is all zeros bar the
     last three bits. The first of them is BIP39's own all-zero vector, which
     ties this table to the published standard rather than to itself. */
  ['bitbox: 23 rolled words from the first cell',
    () => C.lookupDraft({ method: 'bitbox', input: '11111H'.repeat(23), words: 24, wordlist: WORDLIST }).words.join(' '),
    'abandon '.repeat(22) + 'abandon'],
  ['bitbox: the eight endings offered for zero entropy',
    () => C.lookupDraft({ method: 'bitbox', input: '11111H'.repeat(23), words: 24, wordlist: WORDLIST })
      .options.map(o => o.word).join(' '),
    'art diesel false kite organ ready surface trouble'],
  ['bitbox: the first ending is the bip39 all-zero phrase',
    () => C.deriveSeed({ method: 'bitbox', input: '11111H'.repeat(23), words: 24, wordlist: WORDLIST, choice: 0 })
      .mnemonic.join(' '),
    ABANDON_24],
  ['bitbox: every offered ending passes the bip39 checksum',
    () => {
      const draft = C.lookupDraft({ method: 'bitbox', input: '11111H'.repeat(23), words: 24, wordlist: WORDLIST });
      return draft.options.every((opt, i) => {
        const built = C.entropyToMnemonic(C.fromHex(opt.entropy), WORDLIST);
        return built.join(' ') === [...draft.words, opt.word].join(' ')
          && C.deriveSeed({ method: 'bitbox', input: '11111H'.repeat(23), words: 24, wordlist: WORDLIST, choice: i })
            .mnemonic.join(' ') === built.join(' ');
      }) ? 'all valid' : 'mismatch';
    }, 'all valid'],
  ['bitbox: a coin where a die belongs is refused', () => {
    try {
      C.lookupDraft({ method: 'bitbox', input: 'H1111H' + '11111H'.repeat(22), words: 24, wordlist: WORDLIST });
      return 'accepted';
    } catch { return 'refused'; }
  }, 'refused'],
  ['bitbox: a short sequence is refused', () => {
    try { C.lookupDraft({ method: 'bitbox', input: '11111H'.repeat(22), words: 24, wordlist: WORDLIST }); return 'accepted'; }
    catch { return 'refused'; }
  }, 'refused'],

  /* Every method must be checkable. A method with no rules entry throws from
     assessEntropy rather than returning a verdict, and because that runs
     before the page's own try/catch it escaped as a silent failure -- the
     previous wallet stayed on screen looking like the answer. */
  ['every method has an entropy rule', () => Object.keys(C.METHODS).filter(m => {
    try { C.assessEntropy({ method: m, input: '1' }); return false; } catch { return true; }
  }).join(',') || 'all covered', 'all covered'],
  ['every method survives a full check', () => Object.keys(C.METHODS).filter(m => {
    const sample = m === 'coin' ? REAL_FLIPS : m === 'bitbox' ? '12341H'.repeat(23) : REAL_ROLLS;
    try { C.assessEntropy({ method: m, input: sample }); return false; } catch { return true; }
  }).join(',') || 'all covered', 'all covered'],

  /* ---- one octal and two hex dice ----

     Three dice are 3 + 4 + 4 = 11 bits, which is one word index exactly. The
     codes below are cells read off the published dictionary at entropy.page,
     sampled the length of it and at both ends, because the one thing that
     could silently go wrong here is the leading digit: the octal die is
     numbered 1 to 8, so the dictionary opens at 100 rather than 000 and every
     block is one higher than the multiplier it stands for. */
  ['octahex: the dictionary opens at 100', () => wordAt('100'), 'abandon'],
  ['octahex: the second hex die is the low digit', () => wordAt('101'), 'ability'],
  ['octahex: the first hex die is the middle digit', () => wordAt('110'), 'acoustic'],
  ['octahex: the last cell of the first block', () => wordAt('1FF'), 'cable'],
  ['octahex: the second block starts where the first ends', () => wordAt('200'), 'cactus'],
  ['octahex: a cell from the middle of the range', () => wordAt('6F0'), 'safe'],
  ['octahex: the seventh block', () => wordAt('700'), 'scale'],
  ['octahex: the eighth block', () => wordAt('800'), 'theme'],
  ['octahex: the dictionary ends at 8FF', () => wordAt('8FF'), 'zoo'],
  ['octahex: an octal die read as 0-7 would shift every word', () => {
    /* The mistake this method invites. 100 is the first word; treating the
       leading digit as the multiplier itself lands 256 places away. */
    const right = C.METHODS.octahex.indexOf('100');
    const wrong = Number('1') * 256 + 0 + 0;
    return `${right} ${wrong}`;
  }, '0 256'],

  ['octahex: 69 entries make 23 words',
    () => [C.limits('octahex', 24).least, C.rolledWords('octahex', 24)].join(' '), '69 23'],

  /* Both seed lengths, because three dice are 11 bits and a word index is 11
     bits whatever the seed length is. How many endings the last word has
     depends on how badly 11 divides the seed:

       24 words   23 rolled = 253 bits, 256 wanted, 3 free  ->   8 endings
       12 words   11 rolled = 121 bits, 128 wanted, 7 free  -> 128 endings

     Independently confirmed against entropylab, which tabulates the same
     three: 11/128, 17/32 and 23/8 for 12, 18 and 24 words. */
  ['octahex: 33 entries make 11 words, for a 12-word seed',
    () => [C.limits('octahex', 12).least, C.rolledWords('octahex', 12)].join(' '), '33 11'],
  ['octahex: a 12-word seed leaves 128 endings',
    () => C.lookupDraft({ method: 'octahex', input: '100'.repeat(11), words: 12, wordlist: WORDLIST }).options.length, 128],
  ['octahex: a 24-word seed leaves 8 endings',
    () => C.lookupDraft({ method: 'octahex', input: '100'.repeat(23), words: 24, wordlist: WORDLIST }).options.length, 8],
  ['octahex: all 128 twelve-word endings pass the BIP39 checksum',
    () => {
      const draft = C.lookupDraft({ method: 'octahex', input: '100'.repeat(11), words: 12, wordlist: WORDLIST });
      /* Each option is rebuilt from its own entropy through BIP39, so the
         checksum word has to fall out of the specification rather than being
         taken on trust from the table that produced it.

         Deliberately not through deriveSeed: that would run PBKDF2's 2048
         rounds 128 times, and this suite is embedded in the page and runs on
         load. The seed is not what is being checked here -- the last word is. */
      const wrong = draft.options.filter(option => {
        const rebuilt = C.entropyToMnemonic(C.fromHex(option.entropy), WORDLIST);
        return rebuilt.length !== 12
            || rebuilt[11] !== option.word
            || rebuilt.slice(0, 11).join(' ') !== draft.words.join(' ');
      });
      return wrong.length;
    }, 0],
  ['octahex: 11 throws produce a 12-word phrase',
    () => C.deriveSeed({ method: 'octahex', input: '100'.repeat(11), words: 12, wordlist: WORDLIST, choice: 0 }).mnemonic.length, 12],
  /* The BitBox table is published for 24 words only, so it must not gain a
     12-word form by accident. */
  ['bitbox: still 24 words only',
    () => Object.keys(C.METHODS.bitbox.counts).join(','), '24'],
  ['octahex: 23 rolled words from the first cell',
    () => C.lookupDraft({ method: 'octahex', input: '100'.repeat(23), words: 24, wordlist: WORDLIST }).words.join(' '),
    'abandon '.repeat(22) + 'abandon'],
  /* 23 words of the first cell is 253 zero bits, so the eight endings are the
     same eight the BitBox table offers for the same entropy, and the first of
     them is BIP39's published all-zero phrase. Two unrelated dice methods
     landing on the same standard vector is the check worth having. */
  ['octahex: the eight endings for zero entropy',
    () => C.lookupDraft({ method: 'octahex', input: '100'.repeat(23), words: 24, wordlist: WORDLIST })
      .options.map(o => o.word).join(' '),
    'art diesel false kite organ ready surface trouble'],
  ['octahex: the first ending is the bip39 all-zero phrase',
    () => C.deriveSeed({ method: 'octahex', input: '100'.repeat(23), words: 24, wordlist: WORDLIST, choice: 0 })
      .mnemonic.join(' '),
    ABANDON_24],
  ['octahex: the octal die picks the ending', () => {
    /* The deck says to roll the octal die once more and take that option
       number, so face 1 is the first ending and face 8 the last. */
    const draft = C.lookupDraft({ method: 'octahex', input: '100'.repeat(23), words: 24, wordlist: WORDLIST });
    return [draft.options[0].word, draft.options[7].word].join(' ');
  }, 'art trouble'],
  ['octahex: a 0 on the octal die is refused', () => {
    try { C.lookupDraft({ method: 'octahex', input: '000' + '100'.repeat(22), words: 24, wordlist: WORDLIST }); return 'accepted'; }
    catch { return 'refused'; }
  }, 'refused'],
  ['octahex: a 9 on the octal die is refused', () => {
    try { C.lookupDraft({ method: 'octahex', input: '900' + '100'.repeat(22), words: 24, wordlist: WORDLIST }); return 'accepted'; }
    catch { return 'refused'; }
  }, 'refused'],
  ['octahex: a short sequence is refused', () => {
    try { C.lookupDraft({ method: 'octahex', input: '100'.repeat(22), words: 24, wordlist: WORDLIST }); return 'accepted'; }
    catch { return 'refused'; }
  }, 'refused'],
  ['octahex: the keypad allows the octal die only in first place',
    () => [C.nextAllowed('octahex', ''), C.nextAllowed('octahex', '1'), C.nextAllowed('octahex', '1A')].join(' '),
    '12345678 0123456789ABCDEF 0123456789ABCDEF'],
  ['octahex: a real sequence is allowed', () => refused('octahex', REAL_OCTAHEX), 'allowed'],
  ['octahex: refuses a repeated cell',
    () => refused('octahex', '4C7'.repeat(23)), 'refused'],

  /* ---- the derivative check ----

     A sequence can use every face the right number of times, never repeat as a
     whole, and still have been written out rather than rolled. Blocks of three
     ascending are the clearest case: flat face counts, chi-squared of zero,
     high LZ complexity, and a derivative of 0,0,1 forever. Krux runs the same
     check on its own rolls. */
  ['blocked ascending rolls are refused despite flat face counts', () => {
    /* Every face six times, in order. Flat counts, chi-squared of nothing, no
       repeat of the whole, high LZ complexity -- and obviously typed. Named
       individually so a later change cannot quietly make this pass on a
       different rule than the one it is here to pin. */
    const blocks = Array.from({ length: 36 }, (_, i) => Math.floor(i / 6) + 1).join('').repeat(3) + '111';
    const st = C.assessEntropy({ method: 'dice', input: blocks });
    return [st.stats.distinct === 6, Math.round(st.stats.chi) === 0, st.ok ? 'allowed' : 'refused'].join(' ');
  }, 'true true refused'],
  ['the derivative leaves real rolls alone',
    () => [refused('dice', REAL_ROLLS), refused('coin', REAL_FLIPS)].join(' '),
    'allowed allowed'],
  ['the derivative is not computed for coin flips',
    () => C.derivative(['H', 'T', 'H']).length, 0],
  ['the derivative is the gap between rolls',
    () => C.derivative(['5', '9', '2']).join(','), '4,-7'],
  ['the derivative can be read in another base',
    () => C.derivative(['9', 'A', 'F'], f => parseInt(f, 16)).join(','), '1,5'],

  /* ---- the ceiling ----

     Entry is trimmed to what the method can actually convert, so the box never
     holds a sequence the page will refuse on submit. */
  ['clamp: dice stop at the ceiling',
    () => C.clamp({ method: 'dice', input: '1'.repeat(600), words: 24 }).length, 500],
  ['clamp: coin flips are exact, not a range',
    () => C.clamp({ method: 'coin', input: 'H'.repeat(400), words: 24 }).length, 256],
  ['clamp: twelve words take half the flips',
    () => C.clamp({ method: 'coin', input: 'H'.repeat(400), words: 12 }).length, 128],
  ['clamp: the lookup table stops on a whole word',
    () => C.clamp({ method: 'octahex', input: '135'.repeat(40), words: 24 }).length, 69],
  ['clamp: bitbox stops on a whole word',
    () => C.clamp({ method: 'bitbox', input: '1234H'.repeat(60), words: 24 }).length, 138],
  /* The bit table has no fixed roll count, so it trims at the roll that fills
     the last bit rather than at a length. */
  ['clamp: the bit table stops once the bits are there', () => {
    const trimmed = C.clamp({ method: 'dicebits', input: '1'.repeat(400), words: 24 });
    return [trimmed.length, C.diceBits(trimmed).length].join(' ');
  }, '128 256'],
  ['clamp: one-bit faces need more rolls to reach the same bits', () => {
    const trimmed = C.clamp({ method: 'dicebits', input: '4'.repeat(400), words: 24 });
    return [trimmed.length, C.diceBits(trimmed).length].join(' ');
  }, '256 256'],
  ['clamp: anything already inside the ceiling is untouched',
    () => C.clamp({ method: 'dice', input: REAL_ROLLS, words: 24 }), REAL_ROLLS],
  ['clamp: what it returns always converts', () => {
    const trimmed = C.clamp({ method: 'coin', input: 'H'.repeat(400), words: 24 });
    try {
      C.deriveSeed({ method: 'coin', input: trimmed, words: 24, wordlist: WORDLIST });
      return 'converts';
    } catch (err) { return 'refused: ' + err.message; }
  }, 'converts'],

  /* ---- the passphrase ----

     BIP39's own vector already pins the seed for "TREZOR" above. What matters
     to this page is the consequence: the words do not change, so a passphrase
     mismatch looks exactly like a device converting dice differently. */
  ['passphrase leaves the recovery words alone', () => {
    const args = { method: 'dice', input: REAL_ROLLS, words: 24, wordlist: WORDLIST };
    const plain = C.deriveSeed(args);
    const salted = C.deriveSeed({ ...args, passphrase: 'test' });
    return plain.mnemonic.join(' ') === salted.mnemonic.join(' ')
      && C.hex(plain.seed) !== C.hex(salted.seed) ? 'same words, different seed' : 'unexpected';
  }, 'same words, different seed'],
  ['an empty passphrase is the same as none', () => {
    const args = { method: 'dice', input: REAL_ROLLS, words: 24, wordlist: WORDLIST };
    return C.hex(C.deriveSeed(args).seed) === C.hex(C.deriveSeed({ ...args, passphrase: '' }).seed)
      ? 'identical' : 'different';
  }, 'identical'],

  /* ---- the checksum a phrase carries -------------------------------------

     BIP39 appends entropy/32 bits of SHA-256 over the entropy, so the last
     word is never fully free. checkMnemonic recomputes that from the phrase
     rather than from the construction that produced it, which is what makes it
     a check rather than a restatement. */
  ['checksum: BIP39’s own all-zero 12-word vector passes',
    () => C.checkMnemonic(ABANDON_12.split(' '), WORDLIST).ok, true],
  ['checksum: BIP39’s own all-zero 24-word vector passes',
    () => C.checkMnemonic(ABANDON_24.split(' '), WORDLIST).ok, true],
  ['checksum: a 12-word phrase carries 4 bits over 128',
    () => { const s = C.checkMnemonic(ABANDON_12.split(' '), WORDLIST);
            return [s.checksumBits, s.entropyBits, s.freeBits].join(); }, '4,128,7'],
  ['checksum: a 24-word phrase carries 8 bits over 256',
    () => { const s = C.checkMnemonic(ABANDON_24.split(' '), WORDLIST);
            return [s.checksumBits, s.entropyBits, s.freeBits].join(); }, '8,256,3'],
  /* The check has to be able to fail, or it says nothing. Swapping the last
     word for its neighbour in the list breaks the checksum and nothing else. */
  ['checksum: a wrong last word is caught',
    () => {
      const words = ABANDON_12.split(' ');
      words[11] = WORDLIST[WORDLIST.indexOf(words[11]) + 1];
      return C.checkMnemonic(words, WORDLIST).ok;
    }, false],
  ['checksum: every phrase this page builds passes its own check',
    () => {
      const built = [
        C.deriveSeed({ method: 'dice', input: REAL_ROLLS, words: 24, wordlist: WORDLIST }).mnemonic,
        C.deriveSeed({ method: 'coin', input: REAL_FLIPS.slice(0, 128), words: 12, wordlist: WORDLIST }).mnemonic,
        C.deriveSeed({ method: 'octahex', input: '100'.repeat(11), words: 12, wordlist: WORDLIST, choice: 5 }).mnemonic,
        C.deriveSeed({ method: 'octahex', input: '100'.repeat(23), words: 24, wordlist: WORDLIST, choice: 3 }).mnemonic
      ];
      return built.filter(m => !C.checkMnemonic(m, WORDLIST).ok).length;
    }, 0],

  /* ---- the watch-only descriptor ------------------------------------------

     The checksum is BIP380's. Its own published vector is pinned first, and
     the four account descriptors below were generated by running the reference
     implementation printed in that BIP -- the Python, unmodified, in a
     separate process -- over the descriptor bodies this code builds. Checking
     our checksum against our checksum would prove nothing.

     The keys are the BIP44/49/84/86 account keys for BIP39's all-zero test
     mnemonic, and 73c5da0a is that seed's master fingerprint, so every part of
     each line traces back to a published vector rather than to this file.

     All five were then put through Bitcoin Core's own descriptors.py, from
     test/functional/test_framework: descsum_create reproduces each string
     exactly, and descsum_check accepts each one. So these are not merely
     spec-conformant, they are what Core itself would write and would take. */
  ['descriptor: the checksum vector published in BIP380',
    () => C.withChecksum('raw(deadbeef)'), 'raw(deadbeef)#89f8spxm'],
  ['descriptor: a payload error changes the checksum',
    () => C.withChecksum('raw(deedbeef)') === 'raw(deedbeef)#89f8spxm', false],

  ['descriptor: legacy, BIP44',
    () => descriptorFor('legacy'),
    'pkh([73c5da0a/44h/0h/0h]xpub6BosfCnifzxcFwrSzQiqu2DBVTshkCXacvNsWGYJVVhhawA7d4R5WSWGFNbi8Aw6ZRc1brxMyWMzG3DSSSSoekkudhUd9yLb6qx39T9nMdj/<0;1>/*)#kw28l7md'],
  ['descriptor: nested segwit, BIP49',
    () => descriptorFor('nested'),
    'sh(wpkh([73c5da0a/49h/0h/0h]xpub6C6nQwHaWbSrzs5tZ1q7m5R9cPK9eYpNMFesiXsYrgc1P8bvLLAet9JfHjYXKjToD8cBRswJXXbbFpXgwsswVPAZzKMa1jUp2kVkGVUaJa7/<0;1>/*))#zmygnj3e'],
  ['descriptor: native segwit, BIP84',
    () => descriptorFor('native'),
    'wpkh([73c5da0a/84h/0h/0h]xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V/<0;1>/*)#qf45pmyh'],
  ['descriptor: taproot, BIP86',
    () => descriptorFor('taproot'),
    'tr([73c5da0a/86h/0h/0h]xpub6BgBgsespWvERF3LHQu6CnqdvfEvtMcQjYrcRzx53QJjSxarj2afYWcLteoGVky7D3UKDP9QyrLprQ3VCECoY49yfdDEHGCtMMj92pReUsQ/<0;1>/*)#xf07c0qd'],

  /* The canonical key, never the SLIP-132 one. A descriptor already states its
     script type; a zpub would state it again in a dialect Bitcoin Core does
     not read, and the two could then disagree. */
  ['descriptor: carries the canonical xpub, not the zpub',
    () => descriptorFor('native').includes('xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V')
       && !/[yz]pub/.test(descriptorFor('native')), true],
  /* The older one-descriptor-per-chain form, for wallets that predate BIP389
     and reject <0;1> outright. Same checksums the reference implementation
     produces for the same bodies. */
  ['descriptor: receiving branch, for wallets without multipath',
    () => descriptorFor('native', 0).slice(-9), '#afwvtk2s'],
  ['descriptor: change branch, for wallets without multipath',
    () => descriptorFor('native', 1).slice(-9), '#vatdkr6g'],
  ['descriptor: the split pair describes the same account as the combined one',
    () => {
      const combined = descriptorFor('native').split('/<0;1>/')[0];
      return [descriptorFor('native', 0).startsWith(combined),
              descriptorFor('native', 1).startsWith(combined)].join();
    }, 'true,true'],
  ['descriptor: a branch other than 0 or 1 is refused',
    () => { try { descriptorFor('native', 2); return 'accepted'; } catch (e) { return 'refused'; } }, 'refused'],

  ['descriptor: the origin uses h, which survives a shell',
    () => C.descriptorOrigin("m/84'/0'/0'"), '84h/0h/0h'],
  ['descriptor: receive and change in one expression',
    () => descriptorFor('native').includes('/<0;1>/*'), true],
  /* parsePath is more forgiving than the descriptor grammar. It accepts
     "m84h/0h/0h" with no slash after the m, and reading the path as text
     rather than rebuilding it from the parsed indices emitted
     [deadbeef/m84h/0h/0h] -- an origin no wallet parses, carrying a perfectly
     valid checksum. */
  ['descriptor: a path written without the slash still canonicalises',
    () => C.descriptorOrigin('m84h/0h/0h'), '84h/0h/0h'],
  ['descriptor: an uppercase M canonicalises',
    () => C.descriptorOrigin("M/84'/0'/0'"), '84h/0h/0h'],
  ['descriptor: unhardened steps keep their form',
    () => C.descriptorOrigin("m/0'/1/2'"), '0h/1/2h'],
  ['descriptor: a path that is not a path is refused, not checksummed',
    () => { try { C.descriptorOrigin('not a path'); return 'accepted'; } catch (e) { return 'refused'; } }, 'refused'],

  ['descriptor: never contains a private key',
    () => /xprv|[yz]prv/.test(descriptorFor('native')), false],
  /* Every checksum this builds must satisfy the spec's own verifier. */
  ['descriptor: all four verify under the BIP380 check',
    () => ['legacy', 'nested', 'native', 'taproot'].filter(t => !descsumCheck(descriptorFor(t))).length, 0],

  /* ---- playing cards ------------------------------------------------------

     The bit table is the BIP39 HTML tool's own, published in
     src/js/entropy.js. Every one of its 52 codes is pinned below rather than
     spot-checked: the table is generated here from a rule (five bits for the
     first 32 cards, four for the next 16, two for the last four) and a rule
     that is subtly wrong would still pass a handful of samples. */
  ['cards: every code matches the published BIP39 tool table',
    () => COLEMAN_CARDS.filter(([card, bits]) => C.cardBits(card) !== bits).length, 0],
  ['cards: all 52 codes are pinned, not a sample',
    () => COLEMAN_CARDS.length, 52],
  ['cards: the first card is five bits',
    () => C.cardBits('AC'), '00000'],
  ['cards: the last four are two bits',
    () => C.cardBits('TS') + ' ' + C.cardBits('KS'), '00 11'],
  /* The codes are not prefix-free -- "00" for the ten of spades opens "00000"
     for the ace of clubs -- exactly as the tool's dice table is not. Pinned so
     that nobody "fixes" the table into something the tool would not agree
     with. */
  ['cards: the codes are deliberately not prefix-free',
    () => C.cardBits('AC').startsWith(C.cardBits('TS')), true],
  ['cards: a whole deck averages the published 4.46 bits',
    () => (C.cardBits(C.CARD_DECK.join('')).length / 52).toFixed(4),
    ((32 * 5 + 16 * 4 + 4 * 2) / 52).toFixed(4)],

  /* Entropy of a draw. log2(52!) is the standard figure for a shuffled deck,
     and the running total has to land on it exactly at 52 cards. */
  ['cards: a full deck is log2(52!) bits',
    () => C.cardEntropy(52).toFixed(4),
    Array.from({ length: 52 }, (_, i) => Math.log2(i + 1)).reduce((a, b) => a + b).toFixed(4)],
  ['cards: 225.58 bits, which is short of a 24-word seed',
    () => C.cardEntropy(52).toFixed(2), '225.58'],
  ['cards: 25 is the first draw to carry 128 bits',
    () => [C.cardEntropy(24) < 128, C.cardEntropy(25) >= 128].join(),  'true,true'],
  ['cards: 58 is the first draw to carry 256 bits',
    () => [C.cardEntropy(57) < 256, C.cardEntropy(58) >= 256].join(), 'true,true'],
  ['cards: the 53rd card is worth a full log2(52) again',
    () => (C.cardEntropy(53) - C.cardEntropy(52)).toFixed(6), Math.log2(52).toFixed(6)],

  /* The deck itself: drawn cards cannot come back until it is exhausted. */
  ['cards: a fresh deck offers 52',
    () => C.cardsLeft('').length, 52],
  ['cards: a drawn card is not offered again',
    () => C.cardsLeft('ASKD').includes('AS'), false],
  ['cards: an exhausted deck comes back whole',
    () => C.cardsLeft(C.CARD_DECK.join('')).length, 52],
  ['cards: after a rank, every suit it still has',
    () => C.nextAllowed('cards', 'A'), 'CDHS'],
  ['cards: a suit already drawn at that rank is gone',
    () => C.nextAllowed('cards', 'ASA'), 'CDH'],

  /* Two characters an event, which every count has to respect. */
  ['cards: a spaced transcript counts cards, not characters',
    () => C.events('cards', 'AS KD 7H').length, 3],
  ['cards: a rank with no suit yet is not a card',
    () => C.events('cards', 'ASKD7').length, 2],
  ['cards: clamp never cuts a card in half',
    () => C.clamp({ method: 'cards', input: C.CARD_DECK.join('').repeat(3), words: 24 }).length % 2, 0],

  /* Per-event entropy, for the meter. */
  ['meter: a flip is one bit',
    () => C.sourceEntropy({ method: 'coin', input: 'HTHT' }), 4],
  ['meter: 99 rolls of a d6 fall just short of 256 bits',
    () => C.sourceEntropy({ method: 'dice', input: '4'.repeat(99) }).toFixed(1), '255.9'],
  ['meter: an octal die and two hex dice are 11 bits',
    () => C.sourceEntropy({ method: 'octahex', input: '1AB' }), 11],

  /* The fabrication check. Cards defeat chi-squared and LZ entirely, so what
     is left has to carry the whole load -- these pin that it does. */
  ['cards: a real shuffle is accepted',
    () => C.assessEntropy({ method: 'cards', input: REAL_DRAW }).ok, true],
  ['cards: a deck read in order is refused',
    () => C.assessEntropy({ method: 'cards', input: C.CARD_DECK.slice(0, 25).join('') }).ok, false],
  ['cards: a deck read backwards is refused',
    () => C.assessEntropy({ method: 'cards', input: C.CARD_DECK.slice(0, 25).reverse().join('') }).ok, false],
  ['cards: dealt one whole suit at a time is refused',
    () => C.assessEntropy({ method: 'cards',
      input: [...C.CARD_RANKS].map(r => r + 'S').concat([...C.CARD_RANKS].map(r => r + 'H')).slice(0, 25).join('') }).ok, false],
  ['cards: stepped by rank instead of suit is still refused',
    () => C.assessEntropy({ method: 'cards',
      input: [...C.CARD_RANKS].flatMap(r => [...C.CARD_SUITS].map(su => r + su)).slice(0, 25).join('') }).ok, false],
  /* Chi-squared really is constant here, which is why it is switched off. */
  ['cards: chi-squared cannot tell a shuffle from a sorted deck',
    () => {
      /* Held to the same number of cards, because the statistic is a function
         of how many were drawn and nothing else. That is the whole problem. */
      const n = 25;
      const shuffled = C.events('cards', REAL_DRAW).slice(0, n);
      const sorted = C.events('cards', C.CARD_DECK.slice(0, n).join(''));
      return C.chiSquared(shuffled, C.CARD_DECK).toFixed(3) === C.chiSquared(sorted, C.CARD_DECK).toFixed(3);
    }, true],

  /* End to end: the entropy is SHA-256 over the cards as drawn. */
  ['cards: the entropy is SHA-256 of the transcript',
    () => C.deriveSeed({ method: 'cards', input: REAL_DRAW, words: 12, wordlist: WORDLIST }).entropy,
    C.hex(C.sha256(C.utf8(REAL_DRAW)).slice(0, 16))],
  ['cards: 25 drawn cards make a 12-word phrase',
    () => C.deriveSeed({ method: 'cards', input: REAL_DRAW, words: 12, wordlist: WORDLIST }).mnemonic.length, 12],
  /* The tolerance is not a taste call: it is the longest code minus one, the
     furthest a single final event can carry the total past the target. Pinned
     so the two tables cannot drift apart from the numbers they imply. */
  ['slack: the dice table tolerates one bit, its longest code minus one',
    () => C.METHODS.dicebits.slack,
    Math.max(...[...'123456'].map(f => C.diceBits(f).length)) - 1],
  ['slack: the card table tolerates four, its longest code minus one',
    () => C.METHODS.cardbits.slack,
    Math.max(...C.CARD_DECK.map(c => C.cardBits(c).length)) - 1],
  ['cards: a draw landing past the target by less than the slack is accepted',
    () => {
      /* Every card is worth 2, 4 or 5 bits, so a draw that is one short of 128
         can only land between 128 and 132 -- the range the tolerance covers. */
      let bits = 0, n = 0;
      const deck = C.CARD_DECK.slice();
      while (bits < 128) { bits += C.cardBits(deck[n % 52]).length; n++; }
      return bits <= 128 + C.METHODS.cardbits.slack;
    }, true],
  ['cards: every method has a fabrication rule',
    () => Object.keys(C.METHODS).filter(m => !C.assessEntropy({ method: m, input: '' })).length, 0]
];

/* One BitBox cell, looked up the way the table is read: five dice and a coin
   name a word outright. */
function wordFor(group) {
  return WORDLIST[C.bitboxIndex(group)];
}

/* One cell of the octal-and-hex dictionary, given as the three characters
   printed beside the word. */
function wordAt(code) {
  return WORDLIST[C.METHODS.octahex.indexOf(code)];
}

function refused(method, input) {
  return C.assessEntropy({ method, input }).ok ? 'allowed' : 'refused';
}

/* The account-level extended key, in whichever prefix the address type uses. */
function accountKey(path, type) {
  const node = C.derive(C.masterKey(C.mnemonicToSeed(ABANDON_12.split(' '))), path);
  return C.encodeXpub(node, C.ADDRESS_TYPES[type].xpubVersion);
}

function addressFor(type, path, branch) {
  const node = C.derive(C.masterKey(C.mnemonicToSeed(ABANDON_12.split(' '))), path);
  const leaf = C.ckdPriv(C.ckdPriv(node, branch), 0);
  const pub = C.compress(C.pointMul(BigInt('0x' + C.hex(leaf.key))));
  return C.ADDRESS_TYPES[type].encode(pub);
}

export function run() {
  const results = VECTORS.map(([name, fn, want]) => {
    let got;
    try { got = fn(); } catch (err) { got = `threw: ${err.message}`; }
    return { name, got, want, ok: got === want };
  });
  return { results, passed: results.filter(r => r.ok).length, total: results.length };
}

const { results, passed, total } = run();
for (const r of results) {
  console.log(`${r.ok ? 'pass' : 'FAIL'}  ${r.name}`);
  if (!r.ok) console.log(`        got  ${r.got}\n        want ${r.want}`);
}
console.log(`\n${passed}/${total} vectors pass`);
process.exit(passed === total ? 0 : 1);

/* Test vectors for build/tools/entropy-core.js.

   Run:  npm run test:entropy

   Every cryptographic vector here is from a published specification, not from
   running this code and recording what it said. That distinction is the whole
   point: a self-check that compares the tool against itself proves nothing.
   Exact text-output tests separately pin this project's own export format;
   the values inside those records are the published vectors tested below.

   The same suite is embedded in the shipped page and runs on load. If any of
   it fails the page refuses to show results, because a conversion tool that is
   quietly wrong is worse than no tool -- it would tell someone their hardware
   wallet is dishonest when the fault is here. */
import { readFileSync } from 'node:fs';
import { loadCore } from './load-core.mjs';

const C = loadCore();

/* The QR generator the page inlines, evaluated rather than imported for the
   same reason the core is: it ships as a classic script, and testing anything
   other than the bytes that ship proves nothing about the bytes that ship. */
const QR = new Function(
  `${readFileSync('build/vendor/qr/qrcodegen.js', 'utf8')}\nreturn qrcodegen;`)();
const WORDLIST = readFileSync('build/tools/bip39-english.txt', 'utf8').trim().split(/\r?\n/);

/* The 12- and 24-word all-zero-entropy phrases from BIP39's own vectors, used
   as the base mnemonic for every address vector below. */
const ABANDON_12 = 'abandon '.repeat(11) + 'about';
const ABANDON_24 = 'abandon '.repeat(23) + 'art';
const ABANDON_12_WORDS = ABANDON_12.split(' ');
const ABANDON_24_WORDS = ABANDON_24.split(' ');
const ABANDON_12_SEED = C.mnemonicToSeed(ABANDON_12_WORDS);

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

/* A real 27-card draw from a CSPRNG-shuffled deck, pinned so the suite stays
   deterministic. It has to be accepted: a check that refused genuine shuffles
   would teach people to redraw until they passed, which is the one thing the
   dice guide says never to do.

   Twenty-seven, not the 25 the minimum asks for. It was described as 25 for
   long enough that the exact boundary went untested underneath the wrong
   number; the two cases below pin 25 and 24 from a prefix of this same draw. */
const REAL_DRAW = '7H2CTS4DJHAS9C6SKD3H8DQCTC5H2SJD9HKC4S7DAH6C3STD8SQH5C';
const CARDS_25 = REAL_DRAW.slice(0, 50);
const CARDS_24 = REAL_DRAW.slice(0, 48);
const refusedDraw = input => {
  try {
    C.deriveSeed({ method: 'cards', input, words: 12, wordlist: WORDLIST });
    return 'accepted';
  } catch { return 'refused'; }
};

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

/* `extra` is left out unless a test names it, so the default here is the
   builder's own default -- the address count that actually ships. The two
   literal-document tests below opt down to one address per branch to keep the
   expected text readable; every other test sees what a person downloads. */
function exportFor({ passphrase = '', passphraseUsed = false, extra,
  path = "m/84'/0'/0'" } = {}) {
  const mnemonic = ABANDON_12_WORDS;
  return C.buildWalletExportTexts({
    mnemonic, wordlist: WORDLIST,
    seed: passphrase ? C.mnemonicToSeed(mnemonic, passphrase) : ABANDON_12_SEED,
    addressType: 'native', path, passphraseUsed,
    ...(extra === undefined ? {} : { extra })
  });
}

/* The prose and line breaks are this project's file-format contract. The key,
   descriptor and address values are the BIP32/39/84/380 vectors independently
   pinned elsewhere in this suite. Keeping the expected documents literal is
   what catches a label, ordering or newline change that a structural test
   would silently bless. */
const PRIVATE_EXPORT_12 = [
  'SelfCustody.ca Entropy Workshop - PRIVATE RECOVERY RECORD',
  'KEEP SECRET. Anyone with the recovery words or private keys can spend this wallet.',
  '',
  'Recovery words (12)',
  '01. abandon',
  '02. abandon',
  '03. abandon',
  '04. abandon',
  '05. abandon',
  '06. abandon',
  '07. abandon',
  '08. abandon',
  '09. abandon',
  '10. abandon',
  '11. abandon',
  '12. about',
  '',
  'SeedQR digits',
  '000000000000000000000000000000000000000000000003',
  '',
  'Wallet identity',
  'Master fingerprint: 73C5DA0A',
  'Fingerprint without passphrase: 73C5DA0A',
  'BIP39 passphrase: not used',
  'Address type: Native SegWit',
  "Account path: m/84'/0'/0'",
  '',
  'Master private key',
  'Path: m',
  'Canonical xprv: xprv9s21ZrQH143K3GJpoapnV8SFfukcVBSfeCficPSGfubmSFDxo1kuHnLisriDvSnRRuL2Qrg5ggqHKNVpxR86QEC8w35uxmGoggxtQTPvfUu',
  '',
  'Account private key',
  "Path: m/84'/0'/0'",
  'Canonical xprv: xprv9ybY78BftS5UGANki6oSifuQEjkpyAC8ZmBvBNTshQnCBcxnefjHS7buPMkkqhcRzmoGZ5bokx7GuyDAiktd5HemohAU4wV1ZPMDRmLpBMm',
  'SLIP-132 zprv: zprvAdG4iTXWBoARxkkzNpNh8r6Qag3irQB8PzEMkAFeTRXxHpbF9z4QgEvBRmfvqWvGp42t42nvgGpNgYSJA9iefm1yYNZKEm7z6qUWCroSQnE',
  ''
].join('\n');

const WATCH_ONLY_EXPORT_12 = [
  'SelfCustody.ca Entropy Workshop - WATCH-ONLY WALLET RECORD',
  'SHARE WITH CARE. This record cannot spend, but it reveals addresses and wallet activity.',
  '',
  'Wallet identity',
  'Master fingerprint: 73C5DA0A',
  'Address type: Native SegWit',
  "Account path: m/84'/0'/0'",
  '',
  'Account public key',
  'Canonical xpub: xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V',
  'SLIP-132 zpub: zpub6rFR7y4Q2AijBEqTUquhVz398htDFrtymD9xYYfG1m4wAcvPhXNfE3EfH1r1ADqtfSdVCToUG868RvUUkgDKf31mGDtKsAYz2oz2AGutZYs',
  '',
  'Watch-only descriptors',
  'Combined receive/change: wpkh([73c5da0a/84h/0h/0h]xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V/<0;1>/*)#qf45pmyh',
  'Receive: wpkh([73c5da0a/84h/0h/0h]xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V/0/*)#afwvtk2s',
  'Change: wpkh([73c5da0a/84h/0h/0h]xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V/1/*)#vatdkr6g',
  '',
  'Addresses',
  'Receive',
  "m/84'/0'/0'/0/0: bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
  'Change',
  "m/84'/0'/0'/1/0: bc1q8c6fshw2dlwun7ekn9qwf37cu2rn755upcp6el",
  ''
].join('\n');

/* 128 coin flips, pinned so the suite is deterministic, and the wallet they
   produce. Not a published vector -- there is none for "these flips make these
   words" -- but every step between them is one, and the point of these tests
   is the record's shape rather than the arithmetic underneath it. */
const FLIPS = 'HTTHHTHTTHHHTHTTHTHHTTHTHHTHTTHH'.repeat(4);
const FLIP_WALLET = C.deriveSeed({
  method: 'coin', input: FLIPS, words: 12, wordlist: WORDLIST
});

function exportWithSource(overrides = {}) {
  return C.buildWalletExportTexts({
    mnemonic: FLIP_WALLET.mnemonic, wordlist: WORDLIST, seed: FLIP_WALLET.seed,
    addressType: 'native', path: "m/84'/0'/0'", passphraseUsed: false,
    source: { method: 'coin', input: FLIPS, words: 12, ...overrides }
  });
}

/* Pulls the transcript back out of a written record: everything after the
   explanation, which is what a person would select and paste back in. */
function recordedTranscript(text) {
  const lines = text.split('\n');
  const at = lines.indexOf('reproduces the words above. Spacing and line breaks are ignored.');
  if (at < 0) return '';
  const out = [];
  for (let i = at + 1; i < lines.length && lines[i].trim(); i++) out.push(lines[i]);
  return out.join('\n');
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
  ['address check: strips a BIP21 query and accepts uppercase Bech32',
    () => C.normalizeAddressCheck(' bitcoin:BC1QCR8TE4KR609GCAWUTMRZA0J4XV80JY8Z306FYU?amount=1 '),
    'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu'],
  ['address check: reports the matching branch and index', () => {
    const receive = [{ index: 0, path: "m/84'/0'/0'/0/0", address: 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu' }];
    const hit = C.matchDerivedAddress('bitcoin:BC1QCR8TE4KR609GCAWUTMRZA0J4XV80JY8Z306FYU', receive, []);
    return [hit.state, hit.chain, hit.index].join();
  }, 'match,receive,0'],
  ['address check: Base58 remains case-sensitive', () => {
    const change = [{ index: 0, path: "m/49'/0'/0'/1/0", address: '37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf' }];
    return C.matchDerivedAddress('37vucYSaXLCAsxYyAPfbSi9eh4iEcbShgf', [], change).state;
  }, 'miss'],
  ['address check: mixed-case Bech32 is not treated as a match', () => {
    const receive = [{ index: 0, path: "m/84'/0'/0'/0/0", address: 'bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu' }];
    return C.matchDerivedAddress('bc1QCR8TE4KR609GCAWUTMRZA0J4XV80JY8Z306FYU', receive, []).state;
  }, 'miss'],
  ['address check: bounded search finds BIP84 receive index 1', () => {
    const prepared = C.prepareDerivedAddressSearch({
      seed: ABANDON_12_SEED, addressType: 'native', path: "m/84'/0'/0'"
    });
    const hit = C.findDerivedAddress({
      seed: ABANDON_12_SEED, addressType: 'native', path: "m/84'/0'/0'",
      address: 'bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g', start: 1, end: 2, prepared
    });
    return [hit.state, hit.chain, hit.index, hit.path].join('|');
  }, "match|receive|1|m/84'/0'/0'/0/1"],
  ['address check: rejects a prepared context for another path', () => {
    const prepared = C.prepareDerivedAddressSearch({
      seed: ABANDON_12_SEED, addressType: 'native', path: "m/84'/0'/0'"
    });
    try {
      C.findDerivedAddress({
        addressType: 'native', path: "m/84'/0'/1'", address: 'bc1qwrong', prepared
      });
      return 'accepted';
    } catch (error) {
      return error.message;
    }
  }, 'address search context does not match this wallet'],

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
  ['octahex: an invalid 12-word choice reports all 128 endings',
    () => {
      try {
        C.deriveSeed({ method: 'octahex', input: '100'.repeat(11), words: 12,
                       wordlist: WORDLIST, choice: 128 });
        return 'accepted';
      } catch (err) {
        return err.message;
      }
    }, 'pick one of the 128 endings for the last word'],
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

  /* ---- the account private key -------------------------------------------

     Published in BIP84's own test vectors for the all-zero mnemonic, so this
     is the specification's value rather than a recording of what this code
     does. Worth pinning carefully: an xprv that is subtly wrong hands someone
     a key that looks right, imports without complaint, and controls a
     different wallet than the words beside it. */
  ['xprv: BIP84 account key for the all-zero mnemonic',
    () => C.encodeXprv(C.derive(C.masterKey(C.mnemonicToSeed(ABANDON_12.split(' '))), "m/84'/0'/0'"),
                       C.ADDRESS_TYPES.native.xprvVersion),
    'zprvAdG4iTXWBoARxkkzNpNh8r6Qag3irQB8PzEMkAFeTRXxHpbF9z4QgEvBRmfvqWvGp42t42nvgGpNgYSJA9iefm1yYNZKEm7z6qUWCroSQnE'],
  ['xprv: the canonical form is the same key with BIP32 version bytes',
    () => C.encodeXprv(C.derive(C.masterKey(C.mnemonicToSeed(ABANDON_12.split(' '))), "m/84'/0'/0'"))
            .slice(0, 4), 'xprv'],
  /* The private and public serialisations must describe one key. If they ever
     drift, the page would show an xpub for one account and an xprv for
     another, which is the worst way for this to fail. */
  ['xprv: private and public forms agree on the same account',
    () => {
      const node = C.derive(C.masterKey(C.mnemonicToSeed(ABANDON_12.split(' '))), "m/84'/0'/0'");
      const fromPriv = C.hex(C.compress(C.pointMul(BigInt('0x' + C.hex(node.key)))));
      const fromPub = C.hex(C.publicKeyOf(node));
      return fromPriv === fromPub;
    }, true],
  ['xprv: it is 78 bytes like the public form, private key padded with a zero',
    () => {
      const node = C.derive(C.masterKey(C.mnemonicToSeed(ABANDON_12.split(' '))), "m/84'/0'/0'");
      return [C.encodeXprv(node).length > 100, C.encodeXpub(node).length > 100].join();
    }, 'true,true'],
  ['xprv: Base58Check decoding recovers the 78-byte payload',
    () => {
      const node = C.derive(C.masterKey(C.mnemonicToSeed(ABANDON_12.split(' '))), "m/84'/0'/0'");
      const raw = C.base58checkDecode(C.encodeXprv(node));
      return [raw.length, C.hex(raw.slice(0, 4)), raw[45]].join();
    }, '78,0488ade4,0'],
  ['xprv: Base58Check decoding refuses a changed checksum',
    () => {
      const node = C.derive(C.masterKey(C.mnemonicToSeed(ABANDON_12.split(' '))), "m/84'/0'/0'");
      const encoded = C.encodeXprv(node);
      try { C.base58checkDecode(encoded.slice(0, -1) + (encoded.endsWith('1') ? '2' : '1')); }
      catch (error) { return /checksum/.test(error.message); }
      return false;
    }, true],
  /* And it must never reach the descriptor, which is the one thing on the page
     that is meant to be safe to hand out. */
  ['xprv: never appears in a watch-only descriptor',
    () => /xprv|[yz]prv/.test(descriptorFor('native')), false],

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
  ['descriptor: a root path has no slash after the fingerprint',
    () => {
      const seed = C.mnemonicToSeed(ABANDON_12.split(' '));
      const { xpub } = C.deriveAddresses({ seed, addressType: 'native', path: 'm' });
      const descriptor = C.watchOnlyDescriptor({
        addressType: 'native', fingerprint: C.masterFingerprint(seed), path: 'm', xpub
      });
      return descriptor.includes('[73c5da0a]')
        && !descriptor.includes('[73c5da0a/]')
        && descsumCheck(descriptor);
    }, true],
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
  ['cards: Ian Coleman transcript uses UTF-8 suit glyphs and spaces',
    () => C.colemanCardTranscript('AS2CTD'), 'A♠ 2♣ T♦'],
  ['cards: Ian Coleman reference transcript has the pinned SHA-256 digest',
    () => C.hex(C.sha256(C.utf8(C.colemanCardTranscript('AS2CTD')))),
    '487361395544bff8135d18c2d3370570d7e689983fbcf5dd545066d056010ce2'],
  ['cards: Ian Coleman mode derives from the displayed transcript',
    () => C.deriveSeed({ method: 'cardscoleman', input: REAL_DRAW, words: 12, wordlist: WORDLIST }).entropy,
    C.hex(C.sha256(C.utf8(C.colemanCardTranscript(REAL_DRAW))).slice(0, 16))],
  ['cards: compact and Ian Coleman hashes remain distinct conversions',
    () => C.deriveSeed({ method: 'cards', input: REAL_DRAW, words: 12, wordlist: WORDLIST }).entropy
      !== C.deriveSeed({ method: 'cardscoleman', input: REAL_DRAW, words: 12, wordlist: WORDLIST }).entropy,
    true],
  ['cards: 27 drawn cards make a 12-word phrase',
    () => C.deriveSeed({ method: 'cards', input: REAL_DRAW, words: 12, wordlist: WORDLIST }).mnemonic.length, 12],
  /* The boundary itself. 25 cards carry 132.4 bits and 24 carry 127.6, so 25
     is the fewest that can fill a 12-word seed -- taken as a prefix of the
     draw above so both sides of the line come from a genuine shuffle. */
  ['cards: exactly 25 is accepted, the fewest that fill 12 words',
    () => C.deriveSeed({ method: 'cards', input: CARDS_25, words: 12, wordlist: WORDLIST }).mnemonic.length, 12],
  ['cards: 24 is one short and refused',
    () => refusedDraw(CARDS_24), 'refused'],

  /* normalise() keeps ranks and suits in one list, so a malformed pair passes
     it and reads as an event. Every one of these derived a wallet before
     deriveSeed checked the shape. */
  ['cards: two suits are not a card',
    () => refusedDraw('SS'.repeat(25)), 'refused'],
  ['cards: two ranks are not a card',
    () => refusedDraw('AK'.repeat(25)), 'refused'],
  ['cards: a suit before its rank is refused',
    () => refusedDraw('SA'.repeat(25)), 'refused'],
  /* The one that counted as 25 cards and hashed 51 characters. */
  ['cards: a trailing half-card is refused rather than hashed',
    () => refusedDraw(CARDS_25 + 'A'), 'refused'],

  /* Duplicates. Well-formed, so the shape check passes them, and the card
     count the meter reads is unaffected -- which is exactly why they matter:
     cardEntropy is log2(52!/(52-n)!) and assumes every card is a new one. */
  ['cards: the same card 25 times is refused',
    () => refusedDraw('AS'.repeat(25)), 'refused'],
  ['cards: one repeat inside an otherwise real draw is refused',
    () => refusedDraw(CARDS_25.slice(0, 48) + CARDS_25.slice(0, 2)), 'refused'],
  /* Named and placed, because "there is a duplicate somewhere in 52 cards" is
     not something anyone can act on. Reported before the count is, so a short
     transcript hears about the impossible card rather than about its length. */
  ['cards: the repeat is named with its position',
    () => {
      try { C.deriveSeed({ method: 'cards', input: 'AS2H3D4CAS', words: 12, wordlist: WORDLIST }); return 'accepted'; }
      catch (err) { return err.message.startsWith('card 5 is AS, which has already been drawn'); }
    }, true],
  /* A finished deck is meant to be shuffled and drawn again, so the 53rd card
     repeating one of the first 52 is a legitimate draw rather than a mistake.
     The check counts per pass for this reason -- the same accounting cardsLeft
     uses to decide which keys the pad greys out. */
  ['cards: a fresh deck after 52 may repeat the first deck',
    () => C.deriveSeed({ method: 'cards', input: C.CARD_DECK.join('') + C.CARD_DECK.slice(0, 6).join(''),
      words: 24, wordlist: WORDLIST }).mnemonic.length, 24],
  ['cards: but a repeat inside the second deck is still refused',
    () => refusedDraw(C.CARD_DECK.join('') + 'AC2C3CAC'), 'refused'],
  ['cards: repeatedCard finds nothing in a real draw',
    () => C.repeatedCard(REAL_DRAW), null],

  /* ---- the master key -----------------------------------------------------

     The page shows this beside the account key, and the whole reason it is
     there is that a wallet handed the account key reports a different
     fingerprint -- which reads as a mismatch and is not one. These pin the
     three properties that claim rests on. */
  ['master: depth 0, so it carries no derivation of its own',
    () => C.masterKey(C.deriveSeed({ method: 'dice', input: REAL_ROLLS, words: 24,
      wordlist: WORDLIST }).seed).depth, 0],
  ['master: a wallet given it reproduces the fingerprint the page shows',
    () => {
      const s = C.deriveSeed({ method: 'dice', input: REAL_ROLLS, words: 24, wordlist: WORDLIST });
      return C.hex(C.fingerprint(C.masterKey(s.seed))).toUpperCase() === C.masterFingerprint(s.seed);
    }, true],
  ['master: the account key does not, which is the confusion it explains',
    () => {
      const s = C.deriveSeed({ method: 'dice', input: REAL_ROLLS, words: 24, wordlist: WORDLIST });
      const acct = C.derive(C.masterKey(s.seed), C.accountPath('native', 0));
      return C.hex(C.fingerprint(acct)).toUpperCase() === C.masterFingerprint(s.seed);
    }, false],
  /* It sits above the address-type choice, so all four branches share it.
     If this ever came out as four different keys the box would be lying. */
  ['master: one key above all four address types',
    () => {
      const s = C.deriveSeed({ method: 'dice', input: REAL_ROLLS, words: 24, wordlist: WORDLIST });
      const root = C.encodeXprv(C.masterKey(s.seed));
      const accounts = ['legacy', 'nested', 'native', 'taproot']
        .map(t => C.encodeXprv(C.derive(C.masterKey(s.seed), C.accountPath(t, 0))));
      return [new Set([root]).size, new Set(accounts).size, accounts.includes(root)].join();
    }, '1,4,false'],
  /* BIP32 test vector 1, from the specification rather than from this code. */
  ['master: BIP32 vector 1 serialises to the published master xprv',
    () => C.encodeXprv(C.masterKey(Uint8Array.from(
      '000102030405060708090a0b0c0d0e0f'.match(/../g).map(h => parseInt(h, 16))))),
    'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi'],
  /* The addresses behind the "more addresses" fold. BIP84 publishes the first
     two receiving addresses and the first change address for this phrase, so
     index 1 of the receiving run is checkable against the specification rather
     than against this code. The run is only useful if it continues correctly;
     an off-by-one in the index would be invisible without this. */
  ['addresses: the fold starts at index 1, not a repeat of the first',
    () => {
      const seed = C.mnemonicToSeed(('abandon '.repeat(11) + 'about').split(' '));
      const a = C.deriveAddresses({ seed, addressType: 'native', path: "m/84'/0'/0'" });
      return [a.moreReceive[0].path.endsWith('/0/1'),
              a.moreReceive[0].address !== a.receive.address].join();
    }, 'true,true'],
  ['addresses: receiving index 1 matches the BIP84 vector',
    () => {
      const seed = C.mnemonicToSeed(('abandon '.repeat(11) + 'about').split(' '));
      return C.deriveAddresses({ seed, addressType: 'native', path: "m/84'/0'/0'" }).moreReceive[0].address;
    }, 'bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g'],
  ['addresses: four on each branch, change on branch 1',
    () => {
      const seed = C.mnemonicToSeed(('abandon '.repeat(11) + 'about').split(' '));
      const a = C.deriveAddresses({ seed, addressType: 'native', path: "m/84'/0'/0'" });
      return [a.moreReceive.length, a.moreChange.length,
              a.moreChange.every(e => e.path.includes('/1/'))].join();
    }, '4,4,true'],
  ['master: and to the fingerprint BIP32 publishes for it',
    () => C.hex(C.fingerprint(C.masterKey(Uint8Array.from(
      '000102030405060708090a0b0c0d0e0f'.match(/../g).map(h => parseInt(h, 16)))))).toLowerCase(),
    '3442193e'],

  /* ---- deterministic wallet export text ---------------------------------

     These pin the format before the page grows download or copy controls.
     Most importantly, they test the watch-only boundary as an absence: none
     of the secret inputs or private extended-key prefixes may cross it. */
  ['export: the private recovery record is byte-for-byte stable',
    () => exportFor({ extra: 0 }).privateText, PRIVATE_EXPORT_12],
  ['export: the watch-only record is byte-for-byte stable',
    () => exportFor({ extra: 0 }).watchOnlyText, WATCH_ONLY_EXPORT_12],
  ['export: both documents are LF-only and end in exactly one newline',
    () => {
      const { privateText, watchOnlyText } = exportFor();
      return [privateText, watchOnlyText]
        .every(text => !text.includes('\r') && text.endsWith('\n') && !text.endsWith('\n\n'));
    }, true],
  ['export: path spelling canonicalises to the same bytes',
    () => {
      const variant = exportFor({ extra: 0, path: "M/84h/0H/0'" });
      return variant.privateText === PRIVATE_EXPORT_12
        && variant.watchOnlyText === WATCH_ONLY_EXPORT_12;
    }, true],
  ['export: watch-only text contains no mnemonic, seed, entropy or private key',
    () => {
      const mnemonic = ABANDON_12_WORDS;
      const seed = ABANDON_12_SEED;
      /* At the shipped address count, so the assertion covers all ten
         address lines rather than the two a trimmed record would carry. */
      const watch = exportFor().watchOnlyText;
      const secretValues = [
        ABANDON_12, ...new Set(mnemonic), C.hex(seed),
        C.seedQrDigits(mnemonic, WORDLIST), '00'.repeat(16)
      ];
      /* Past the title line, which names the tool -- "Entropy Workshop" is
         provenance, not a leak, and the title is pinned byte-for-byte by the
         document test above. Anywhere below it, one of these words announces
         a section that should not exist in a watch-only record. */
      const body = watch.split('\n').slice(1).join('\n');
      const namedSecret = /\b(?:mnemonic|entropy|seed|recovery words)\b/i.test(body);
      const privatePrefix = /\b(?:xprv|yprv|zprv|Yprv|Zprv|tprv|uprv|vprv)/.test(watch);
      return [secretValues.filter(value => watch.includes(value)).length,
              namedSecret, privatePrefix].join();
    }, '0,false,false'],
  ['export: a passphrase is recorded as used but its value is never accepted or written',
    () => {
      const { privateText, watchOnlyText } = exportFor({
        passphrase: 'TREZOR', passphraseUsed: true
      });
      return [
        privateText.includes('BIP39 passphrase: used (value intentionally not included)'),
        privateText.includes('Fingerprint without passphrase: 73C5DA0A'),
        privateText.includes('TREZOR'), watchOnlyText.includes('TREZOR')
      ].join();
    }, 'true,true,false,false'],
  ['export: callers must explicitly say whether a passphrase was used',
    () => {
      const mnemonic = ABANDON_12_WORDS;
      try {
        C.buildWalletExportTexts({
          mnemonic, wordlist: WORDLIST, seed: ABANDON_12_SEED,
          addressType: 'native', path: "m/84'/0'/0'"
        });
        return 'accepted';
      } catch (error) {
        return error.message.includes('whether a BIP39 passphrase was used') ? 'refused' : error.message;
      }
    }, 'refused'],
  ['export: the default watch-only run includes five addresses per branch',
    () => {
      const text = C.buildWalletExportTexts({
        mnemonic: ABANDON_12_WORDS, wordlist: WORDLIST, seed: ABANDON_12_SEED,
        addressType: 'native', path: "m/84'/0'/0'", passphraseUsed: false
      }).watchOnlyText;
      const addressLines = text.split('\n').filter(line =>
        /^m\/84'\/0'\/0'\/[01]\/\d+: /.test(line));
      return [addressLines.length, addressLines.at(4).startsWith("m/84'/0'/0'/0/4:"),
              addressLines.at(9).startsWith("m/84'/0'/0'/1/4:")].join();
    }, '10,true,true'],

  /* ---- the recorded entropy source --------------------------------------

     The record exists so somebody can check a file against the paper they
     rolled it on. That is only worth anything if what is written reproduces
     what was hashed, which is what the first of these tests states directly:
     the transcript, read back out of the finished document and normalised, is
     the same string the derivation consumed. */
  ['source: the written transcript normalises back to what was hashed',
    () => {
      const written = recordedTranscript(exportWithSource().privateText);
      return C.normalise('coin', written) === C.normalise('coin', FLIPS);
    }, true],
  ['source: the private record names the method, word count and tally',
    () => {
      const text = exportWithSource().privateText;
      return ['Method: Coin flips', 'Words: 12', 'Recorded: 128 flips']
        .every(line => text.includes(line));
    }, true],
  ['source: 128 single-character events wrap at fifty, grouped in fives',
    () => {
      const rows = recordedTranscript(exportWithSource().privateText).split('\n');
      return [rows.length, rows[0].length, rows.at(-1).length,
        rows.every(row => row.split(' ').every(g => g.length <= 5))].join();
    }, '3,59,33,true'],
  /* 58 cards, which is what 24 words takes: a full deck and six from the next.
     Thirteen to a line puts the turn of the deck partway through the fifth row
     rather than at a line break, which is the honest picture of it. */
  ['source: cards wrap at thirteen a line',
    () => {
      const deal = C.CARD_DECK.join('') + C.CARD_DECK.slice(0, 6).join('');
      const wallet = C.deriveSeed({ method: 'cards', input: deal, words: 24, wordlist: WORDLIST });
      const text = C.buildWalletExportTexts({
        mnemonic: wallet.mnemonic, wordlist: WORDLIST, seed: wallet.seed,
        addressType: 'native', path: "m/84'/0'/0'", passphraseUsed: false,
        source: { method: 'cards', input: deal, words: 24 }
      }).privateText;
      const rows = recordedTranscript(text).split('\n');
      return [rows.length, rows.map(row => row.split(' ').length).join('-')].join();
    }, '5,13-13-13-13-6'],
  /* The record must not be able to claim a sequence that produces a different
     wallet. Anything else would be worse than omitting it: a file that looks
     checkable and is not. */
  ['source: a transcript that does not reproduce the words is refused',
    () => {
      const wrong = 'T' + FLIPS.slice(1);
      try {
        exportWithSource({ input: wrong });
        return 'accepted';
      } catch (error) {
        return error.message.includes('does not reproduce these recovery words')
          ? 'refused' : error.message;
      }
    }, 'refused'],
  ['source: the watch-only record carries no transcript at all',
    () => {
      const watch = exportWithSource().watchOnlyText;
      return [watch.includes(FLIPS), watch.includes('Transcript'),
        watch.includes('Entropy source'), watch.includes('Coin flips')].join();
    }, 'false,false,false,false'],
  ['source: a record built without one is unchanged',
    () => {
      const bare = C.buildWalletExportTexts({
        mnemonic: FLIP_WALLET.mnemonic, wordlist: WORDLIST, seed: FLIP_WALLET.seed,
        addressType: 'native', path: "m/84'/0'/0'", passphraseUsed: false
      }).privateText;
      return [bare.includes('Entropy source'), bare.includes('Transcript')].join();
    }, 'false,false'],

  /* ---- SeedQR ------------------------------------------------------------

     What this project promises about a SeedQR is compatibility and grid size,
     not identical pixels to a SeedSigner-generated code. Grid size is the part
     that matters, because a SeedQR exists to be punched into metal by hand:
     25x25 for 12 words and 29x29 for 24, the dimensions SeedSigner's
     specification states. These pin our encoder against those numbers. */
  ['seedqr: 12 words are 48 numeric digits, 24 words are 96',
    () => {
      const twelve = C.seedQrDigits(ABANDON_12_WORDS, WORDLIST);
      const twentyFour = C.seedQrDigits(ABANDON_24_WORDS, WORDLIST);
      return [twelve.length, twentyFour.length,
        /^[0-9]+$/.test(twelve + twentyFour)].join();
    }, '48,96,true'],
  ['seedqr: the codes are the 25x25 and 29x29 grids SeedSigner specifies',
    () => [ABANDON_12_WORDS, ABANDON_24_WORDS]
      .map(words => QR.QrCode.encodeText(
        C.seedQrDigits(words, WORDLIST), QR.QrCode.Ecc.MEDIUM).size).join(),
    '25,29'],
  /* Not a promise, a pin on the vendored library: Nayuki raises the error
     correction of a code whose data already fits, so asking for Medium yields
     Quartile at 12 words and stays Medium at 24. Recorded so an encoder
     upgrade that changed the boost -- and with it the module pattern somebody
     has already transcribed -- cannot pass unnoticed. The dimensions would
     survive such a change; the pattern inside them would not. */
  ['seedqr: the encoder boosts 12 words to Quartile and leaves 24 at Medium',
    () => [ABANDON_12_WORDS, ABANDON_24_WORDS]
      .map(words => QR.QrCode.encodeText(
        C.seedQrDigits(words, WORDLIST), QR.QrCode.Ecc.MEDIUM)
        .errorCorrectionLevel.ordinal).join(),
    [QR.QrCode.Ecc.QUARTILE.ordinal, QR.QrCode.Ecc.MEDIUM.ordinal].join()],
  ['compact seedqr: all-zero entropy becomes 16 or 32 zero bytes', () => {
    const twelve = C.compactSeedQrBytes('00'.repeat(16));
    const twentyFour = C.compactSeedQrBytes('00'.repeat(32));
    return [twelve.length, twentyFour.length, C.hex(twelve), C.hex(twentyFour)].join();
  }, ['16', '32', '00'.repeat(16), '00'.repeat(32)].join()],
  ['compact seedqr: any non-BIP39 entropy length is refused', () => {
    try {
      C.compactSeedQrBytes('00'.repeat(24));
      return 'accepted';
    } catch (error) {
      return error.message;
    }
  }, 'CompactSeedQR needs 128-bit or 256-bit BIP39 entropy'],
  ['compact seedqr: binary codes are 21x21 and 25x25', () =>
    [16, 32].map(length => QR.QrCode.encodeBinary(
      new Uint8Array(length), QR.QrCode.Ecc.LOW).size).join(),
    '21,25'],

  /* The boundary itself, from both sides. The rule is per pass, so the same
     card is a mistake at 52 and a legitimate draw at 53 -- these pin that the
     flip happens exactly at the end of the deck and not a card either way. */
  ['cards: a repeat at card 52 is refused, the deck not yet finished',
    () => refusedDraw(C.CARD_DECK.slice(0, 51).join('') + 'AC'), 'refused'],
  ['cards: the same card at 53 is accepted, the deck having been finished',
    () => C.repeatedCard(C.CARD_DECK.join('') + 'AC'), null],
  ['cards: and it is refused again once it repeats within the second pass',
    () => C.repeatedCard(C.CARD_DECK.join('') + 'ACAC').at, 54],

  /* The reshuffle display is a physical-deck concern, not the unit used by
     progress(). In particular, the table method reports bits: twelve of the
     first cards already carry more than 52 bits, but are nowhere near the end
     of a deck. */
  ['deck turn: hash cards are one short at 51',
    () => JSON.stringify(C.deckProgress({ method: 'cards', input: C.CARD_DECK.slice(0, 51).join(''), words: 24 })),
    JSON.stringify({ cards: 51, turn: false, second: null, required: 6 })],
  ['deck turn: hash cards turn exactly at 52',
    () => JSON.stringify(C.deckProgress({ method: 'cards', input: C.CARD_DECK.join(''), words: 24 })),
    JSON.stringify({ cards: 52, turn: true, second: 0, required: 6 })],
  ['deck turn: hash cards count the first card after the reshuffle',
    () => JSON.stringify(C.deckProgress({ method: 'cards', input: C.CARD_DECK.join('') + 'AC', words: 24 })),
    JSON.stringify({ cards: 53, turn: false, second: 1, required: 6 })],
  ['deck turn: card-table bits are never mistaken for physical cards',
    () => JSON.stringify(C.deckProgress({ method: 'cardbits', input: C.CARD_DECK.slice(0, 12).join(''), words: 24 })),
    JSON.stringify({ cards: 12, turn: false, second: null, required: null })],
  ['deck turn: card-table method asks for a reshuffle without inventing a fixed remainder',
    () => JSON.stringify(C.deckProgress({ method: 'cardbits', input: C.CARD_DECK.join(''), words: 24 })),
    JSON.stringify({ cards: 52, turn: true, second: 0, required: null })],
  ['deck turn: a 12-word draw never asks for a second deck',
    () => C.deckProgress({ method: 'cards', input: C.CARD_DECK.join(''), words: 12 }).turn, false],
  ['deck turn: non-card methods have no deck state',
    () => C.deckProgress({ method: 'dice', input: '123456', words: 24 }), null],

  /* ---- aliases -----------------------------------------------------------

     Golden vectors. Every one of these has to normalise to the transcript the
     canonical form already produced, because the phrase is a hash of that
     string: if an alias changed it by one character it would silently hand
     somebody a different wallet than the same deal gave them yesterday.

     The last two are the regression guard rather than the feature -- a
     canonical deal and a spaced one, both of which have to come out exactly
     as they did before the alias pass existed. */
  ['alias: 10 is the ten', () => C.normalise('cards', '10H'), 'TH'],
  ['alias: filled suit symbols',
    () => C.normalise('cards', 'A\u2660Q\u2666K\u2665J\u2663'), 'ASQDKHJC'],
  ['alias: outline suit symbols',
    () => C.normalise('cards', 'A\u2664Q\u2662K\u2661J\u2667'), 'ASQDKHJC'],
  ['alias: lower case and spacing together',
    () => C.normalise('cards', 'as 10h  q\u2666'), 'ASTHQD'],
  ['alias: the same deal aliased and canonical hash identically',
    () => {
      const canonical = C.deriveSeed({ method: 'cards', input: CARDS_25, words: 12, wordlist: WORDLIST });
      const written = CARDS_25.replace(/T/g, '10').replace(/S/g, '\u2660')
        .replace(/H/g, '\u2665').replace(/D/g, '\u2666').replace(/C/g, '\u2663');
      const aliased = C.deriveSeed({ method: 'cards', input: written, words: 12, wordlist: WORDLIST });
      return aliased.mnemonic.join(' ') === canonical.mnemonic.join(' ');
    }, true],
  ['alias: cardbits reads them too',
    () => C.normalise('cardbits', '10\u2660'), 'TS'],
  ['alias: a canonical transcript is returned unchanged',
    () => C.normalise('cards', REAL_DRAW), REAL_DRAW],
  ['alias: spacing is still dropped and nothing else moves',
    () => C.normalise('cards', 'AS 2C TD'), 'AS2CTD'],
  /* A complete alias could previously be ignored inside an otherwise valid
     transcript. Both readings then derive, but to different wallets. Refuse
     that raw input instead of silently choosing the new interpretation. */
  ['alias: two valid legacy readings are refused rather than moving a wallet',
    () => {
      try {
        C.deriveSeed({ method: 'cards', input: '10\u2665' + CARDS_25, words: 12, wordlist: WORDLIST });
        return 'accepted';
      } catch (err) {
        return err.message.startsWith('Those card aliases have two valid readings');
      }
    }, true],
  /* The alias pass is card-only. A dice transcript containing "10" must keep
     losing the 0 exactly as it did, or every dice phrase ever produced from a
     sloppy paste would move. */
  ['alias: dice are left alone', () => C.normalise('dice', '102030'), '123'],
  ['alias: coin flips are left alone', () => C.normalise('coin', 'HT10'), 'HT'],
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

/* Integration check for the Entropy Workshop's Bitcoin Core wallet.dat path.
   The upstream encoder has byte-for-byte Bitcoin Core fixtures; this test
   exercises the adapter used here and asks the platform SQLite library to
   validate the database that a browser download receives. */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { loadCore } from './load-core.mjs';

const C = loadCore();
const sqliteSource = readFileSync('build/tools/sqlite-writer.js', 'utf8');
const walletSource = readFileSync('build/tools/wallet-dat.js', 'utf8');
const sqlite = new Function(`${sqliteSource}\nreturn hodlSqliteWriter;`)();
const walletExport = new Function('hodlSqliteWriter',
  `${walletSource}\nreturn hodlWalletExport;`)(sqlite);

const scratch = mkdtempSync(join(tmpdir(), 'selfcustody-wallet-dat-'));
const python = process.platform === 'win32' ? 'python' : 'python3';
const query = [
  'import json, sqlite3, sys',
  'db=sqlite3.connect(sys.argv[1])',
  'rows=db.execute("select hex(key), hex(value) from main").fetchall()',
  'print(json.dumps({"integrity":db.execute("pragma integrity_check").fetchone()[0],"rows":rows}))'
].join(';');
const asciiKey = hex => Buffer.from(hex, 'hex').toString('latin1');
const mnemonic = ('abandon '.repeat(11) + 'about').split(' ');
const seed = C.mnemonicToSeed(mnemonic);
const fingerprint = C.masterFingerprint(seed);
const tested = [];

try {
  if (walletExport.walletDatFilename(true) !== 'wallet.dat') {
    throw new Error('private Bitcoin Core export must download as wallet.dat');
  }

  for (const addressType of ['legacy', 'nested', 'native', 'taproot']) {
    const path = C.accountPath(addressType, 0);
    const accountNode = C.derive(C.masterKey(seed), path);
    const xpub = C.encodeXpub(accountNode);
    const xprv = C.encodeXprv(accountNode);
    const descriptor = (key, branch) => C.watchOnlyDescriptor({
      addressType, fingerprint, path, xpub: key, branch
    });
    const wallet = {
      kind: 'hd',
      network: 'mainnet',
      accounts: [{
        def: { id: `bip${C.ADDRESS_TYPES[addressType].purpose}` },
        receiveDescriptor: descriptor(xpub, 0),
        changeDescriptor: descriptor(xpub, 1),
        receiveDescriptorPriv: descriptor(xprv, 0),
        changeDescriptorPriv: descriptor(xprv, 1)
      }]
    };
    const deps = {
      sha256: C.sha256,
      checksum: C.descriptorChecksum,
      base58Decode: C.base58checkDecode,
      deriveBranchBody: (unusedXpub, branch) => {
        const node = C.ckdPriv(accountNode, branch);
        const body = new Uint8Array(74);
        const view = new DataView(body.buffer);
        body[0] = node.depth;
        body.set(node.parentFingerprint, 1);
        view.setUint32(5, node.index >>> 0, false);
        body.set(node.chainCode, 9);
        body.set(C.publicKeyOf(node), 41);
        return body;
      },
      publicKeyForPrivate: secret => C.publicKeyOf({ key: secret })
    };

    const bytes = walletExport.buildWalletDat(wallet, true, deps, 1700000000);
    if (new TextDecoder().decode(bytes.subarray(0, 15)) !== 'SQLite format 3') {
      throw new Error(`${addressType} wallet.dat has no SQLite header`);
    }
    if (Buffer.from(bytes.subarray(68, 72)).toString('hex') !== 'f9beb4d9') {
      throw new Error(`${addressType} wallet.dat does not carry Bitcoin mainnet magic`);
    }

    const database = join(scratch, `${addressType}-wallet.dat`);
    writeFileSync(database, bytes);
    const checked = spawnSync(python, ['-c', query, database], { encoding: 'utf8' });
    if (checked.status !== 0) throw new Error(checked.stderr || `SQLite could not read ${addressType} wallet.dat`);
    const report = JSON.parse(checked.stdout);
    if (report.integrity !== 'ok') throw new Error(`${addressType} SQLite integrity check: ${report.integrity}`);

    const names = report.rows.map(([key]) => asciiKey(key));
    const count = name => names.filter(key => key.includes(name)).length;
    if (count('walletdescriptor') !== 6) {
      throw new Error(`${addressType} wallet.dat is missing descriptor, cache or private-key records`);
    }
    if (count('walletdescriptorkey') !== 2) {
      throw new Error(`${addressType} wallet.dat needs two private descriptor keys`);
    }
    if (count('activeexternalspk') !== 1 || count('activeinternalspk') !== 1) {
      throw new Error(`${addressType} wallet.dat receiving/change descriptors are not active`);
    }
    tested.push(`${addressType}:${bytes.length}`);
  }

  /* Regression: the DescriptorID is SHA-256 over Bitcoin Core's ToString(),
     which writes hardened steps with an apostrophe. Base58 contains both
     digits and the letter h, so an account key ending in digit+h sits
     directly before the /0/* separator. A hardened-step rewrite that is not
     confined to the [origin] brackets rewrites that final character of the
     key as well and produces an ID Core will not agree with -- consistently
     enough that the file still loads, then breaks once Core tops up and
     writes cache records under the id it recomputes for itself.

     This mnemonic is a real one found by deterministic search: its BIP49
     account xpub ends in "N2h". The expectation below is derived
     independently of wallet-dat.js, so it fails if the conversion regresses. */
  const REGRESSION_WORDS = 'quit rely point urban report deliver gloom wrap visual advance hard spy'.split(' ');
  const regressionSeed = C.mnemonicToSeed(REGRESSION_WORDS);
  const regressionPath = C.accountPath('nested', 0);
  const regressionNode = C.derive(C.masterKey(regressionSeed), regressionPath);
  const regressionXpub = C.encodeXpub(regressionNode);
  if (!/\dh$/.test(regressionXpub)) {
    throw new Error('the wallet.dat regression vector no longer ends in a digit followed by h');
  }
  const regressionDescriptor = C.watchOnlyDescriptor({
    addressType: 'nested', fingerprint: C.masterFingerprint(regressionSeed),
    path: regressionPath, xpub: regressionXpub, branch: 0
  });
  const regressionBody = regressionDescriptor.slice(0, regressionDescriptor.lastIndexOf('#'));
  const compatBody = regressionBody.replace(/\[[^\]]*\]/g, origin => origin.replace(/(\d)h/g, "$1'"));
  const expectedId = createHash('sha256')
    .update(`${compatBody}#${C.descriptorChecksum(compatBody)}`)
    .digest('hex');
  const regressionRecords = walletExport.buildWalletRecords({
    kind: 'hd',
    network: 'mainnet',
    accounts: [{
      def: { id: 'bip49' },
      receiveDescriptor: regressionDescriptor,
      changeDescriptor: C.watchOnlyDescriptor({
        addressType: 'nested', fingerprint: C.masterFingerprint(regressionSeed),
        path: regressionPath, xpub: regressionXpub, branch: 1
      })
    }]
  }, false, {
    sha256: C.sha256,
    checksum: C.descriptorChecksum,
    base58Decode: C.base58checkDecode,
    deriveBranchBody: (unusedXpub, branch) => {
      const node = C.ckdPriv(regressionNode, branch);
      const body = new Uint8Array(74);
      const view = new DataView(body.buffer);
      body[0] = node.depth;
      body.set(node.parentFingerprint, 1);
      view.setUint32(5, node.index >>> 0, false);
      body.set(node.chainCode, 9);
      body.set(C.publicKeyOf(node), 41);
      return body;
    },
    publicKeyForPrivate: secret => C.publicKeyOf({ key: secret })
  }, 1700000000);
  const descriptorKey = regressionRecords
    .map(([key]) => key)
    .find(key => Buffer.from(key).toString('latin1').startsWith('\x10walletdescriptor'));
  const writtenId = Buffer.from(descriptorKey.slice(descriptorKey.length - 32)).toString('hex');
  if (writtenId !== expectedId) {
    throw new Error(
      `wallet.dat DescriptorID does not match Bitcoin Core's ToString() hash: ` +
      `wrote ${writtenId}, Core computes ${expectedId}`
    );
  }
  tested.push('descriptor-id:origin-only');
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

console.log(`wallet.dat: ${tested.join(', ')} bytes; SQLite integrity and private records verified`);

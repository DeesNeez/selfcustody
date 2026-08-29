/* Integration check for the Entropy Workshop's Bitcoin Core wallet.dat path.
   The upstream encoder has byte-for-byte Bitcoin Core fixtures; this test
   exercises the adapter used here and asks the platform SQLite library to
   validate the database that a browser download receives. */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadCore } from './load-core.mjs';

const C = loadCore();
const sqliteSource = readFileSync('build/tools/sqlite-writer.js', 'utf8');
const walletSource = readFileSync('build/tools/wallet-dat.js', 'utf8');
const sqlite = new Function(`${sqliteSource}\nreturn hodlSqliteWriter;`)();
const walletExport = new Function('hodlSqliteWriter',
  `${walletSource}\nreturn hodlWalletExport;`)(sqlite);

const mnemonic = ('abandon '.repeat(11) + 'about').split(' ');
const seed = C.mnemonicToSeed(mnemonic);
const path = C.accountPath('native', 0);
const accountNode = C.derive(C.masterKey(seed), path);
const fingerprint = C.masterFingerprint(seed);
const xpub = C.encodeXpub(accountNode);
const xprv = C.encodeXprv(accountNode);
const descriptor = (key, branch) => C.watchOnlyDescriptor({
  addressType: 'native', fingerprint, path, xpub: key, branch
});
const wallet = {
  kind: 'hd',
  network: 'mainnet',
  accounts: [{
    def: { id: 'bip84' },
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
  throw new Error('wallet.dat has no SQLite header');
}
if (Buffer.from(bytes.subarray(68, 72)).toString('hex') !== 'f9beb4d9') {
  throw new Error('wallet.dat does not carry Bitcoin mainnet magic');
}

const scratch = mkdtempSync(join(tmpdir(), 'selfcustody-wallet-dat-'));
const database = join(scratch, 'wallet.dat');
writeFileSync(database, bytes);
const python = process.platform === 'win32' ? 'python' : 'python3';
const query = [
  'import json, sqlite3, sys',
  'db=sqlite3.connect(sys.argv[1])',
  'rows=db.execute("select hex(key), hex(value) from main").fetchall()',
  'print(json.dumps({"integrity":db.execute("pragma integrity_check").fetchone()[0],"rows":rows}))'
].join(';');
const checked = spawnSync(python, ['-c', query, database], { encoding: 'utf8' });
rmSync(scratch, { recursive: true, force: true });
if (checked.status !== 0) throw new Error(checked.stderr || 'SQLite could not read wallet.dat');
const report = JSON.parse(checked.stdout);
if (report.integrity !== 'ok') throw new Error(`SQLite integrity check: ${report.integrity}`);

const asciiKey = hex => Buffer.from(hex, 'hex').toString('latin1');
const names = report.rows.map(([key]) => asciiKey(key));
const count = name => names.filter(key => key.includes(name)).length;
if (count('walletdescriptor') !== 6) {
  throw new Error('wallet.dat does not contain both descriptor, cache and private-key records');
}
if (count('walletdescriptorkey') !== 2) throw new Error('wallet.dat needs two private descriptor keys');
if (count('activeexternalspk') !== 1 || count('activeinternalspk') !== 1) {
  throw new Error('wallet.dat receiving/change descriptors are not active');
}

console.log(`wallet.dat: ${bytes.length} bytes, ${report.rows.length} records, SQLite integrity ok`);

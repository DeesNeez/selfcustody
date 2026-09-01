# SelfCustody.ca

SelfCustody.ca is a practical field guide to Bitcoin self-custody. It teaches
people how to create a wallet, protect its recovery material, prove that it can
be restored, and complete a small receive-and-spend cycle before storing
meaningful savings.

**Learn the process. Prove the recovery.**

[Visit the site](https://selfcustody.ca/) ·
[Start Here](https://selfcustody.ca/guides/quickstart.html) ·
[Entropy Workshop](https://selfcustody.ca/entropy.html) ·
[Security](SECURITY.md)

> **Never trust meaningful savings to a wallet you have not successfully backed
> up, recovered, received to, and spent from.**

The project is educational. It does not provide custody, operate a wallet, or
move funds. It teaches a process that can be applied across different products
and custody models, with verification and recovery at its centre.

## The four-step path

The site, the [Intro to Self Custody](https://selfcustody.ca/guides/quickstart.html)
guide and this README describe the same path. Each step ends with something you
can demonstrate, not something you can feel confident about.

### 1. Create your wallet

Choose the simplest setup that fits what you are protecting, generate a
completely new wallet, and keep it empty while you learn how it works.

Choose the custody model before choosing a brand: mobile wallets, hardware
signers and multisig solve different problems, and complexity you cannot operate
is a risk of its own. Generate a new wallet rather than importing recovery
material somebody else supplied, understand where its entropy came from, and
pair a signing device with watch-only software where that applies. Do not fund
it yet.

*Proof before continuing:* you can say where the wallet's spending keys live,
how the wallet is observed, and what material a recovery would require.

[Intro to Self Custody](https://selfcustody.ca/guides/quickstart.html) ·
[Choosing your first setup](https://selfcustody.ca/guides/choosing-your-first-setup.html) ·
[Devices](https://selfcustody.ca/devices.html) ·
[Software](https://selfcustody.ca/software.html) ·
[Entropy Workshop](https://selfcustody.ca/entropy.html)

### 2. Back it up

Record the recovery material offline, preserve its exact order and format, and
store it separately from the device it restores.

Recovery words are generally the wallet itself, not a password to it. Do not
photograph, email, upload or type them into an online device. Record the wallet
type and any configuration needed to find the same wallet again — a seed phrase
alone does not always describe one, and multisig needs its policy as well as its
keys. A passphrase adds a second irreplaceable secret. Paper and metal solve
durability problems, not theft problems.

*Proof before continuing:* another compatible wallet could be handed the
recorded material, plus enough configuration to locate the same wallet.

[Durable seed backups](https://selfcustody.ca/guides/seed-backup-metal.html) ·
[Keys, addresses, and UTXOs](https://selfcustody.ca/guides/keys-addresses-utxos.html) ·
[BIP39 passphrases](https://selfcustody.ca/guides/passphrase-setup.html) ·
[Where the keys actually live](https://selfcustody.ca/guides/multisig-key-geography.html) ·
[Inheritance planning](https://selfcustody.ca/guides/inheritance-plan.html)

### 3. Test your recovery

Restore the wallet while it is still empty, and confirm the restored wallet has
the same fingerprint, descriptor or receiving addresses as the original.

Typing the words back into the device that produced them proves your
transcription, which is not the same as proving a recovery. The safest time to
wipe and restore is while the wallet holds nothing. Compare identifiers rather
than trusting that the result looks familiar: fingerprint and first receiving
address for a single-signature wallet, the complete policy and descriptor for
multisig. Write down the software, derivation path, script type and any
passphrase requirement while you still remember them.

*Proof before continuing:* the recovered wallet produces the same fingerprint,
policy and receiving address as the original.

[Test your recovery without risking your coins](https://selfcustody.ca/guides/recovery-test-drill.html) ·
[How a wallet finds your coins](https://selfcustody.ca/guides/how-wallets-find-coins.html) ·
[Why addresses look different](https://selfcustody.ca/guides/address-types.html) ·
[Build a 2-of-3 multisig](https://selfcustody.ca/guides/multisig-2of3.html) ·
[Specter multisig coordinator](https://selfcustody.ca/guides/specter-multisig-coordinator.html)

### 4. Receive and spend bitcoin

Verify a receiving address, transfer a small test amount, confirm it arrives,
then spend some of it back out while reviewing the destination, fee and change
on the signing device.

Receiving proves that the wallet can generate the intended address, that the
software and signing device agree about it, and that the wallet can observe a
confirmed payment. Spending proves control: that the wallet can build a
transaction, that the device can review and sign it, and that the signed
transaction can be returned, broadcast and confirmed. Together they prove the
setup is operational, not merely recoverable.

*Proof before continuing:* you have completed a small round trip — received
bitcoin, verified it, signed a spend, reviewed the change, and confirmed the
outgoing transaction.

[Withdrawing from an exchange](https://selfcustody.ca/guides/exchange-withdrawal.html) ·
[Send a test transaction first](https://selfcustody.ca/guides/test-transaction.html) ·
[What a fee actually buys](https://selfcustody.ca/guides/how-fees-work.html) ·
[Your transaction is stuck](https://selfcustody.ca/guides/stuck-transaction.html) ·
[Sparrow coin control](https://selfcustody.ca/guides/sparrow-coin-control.html) ·
[The life of a transaction](https://selfcustody.ca/guides/life-of-a-transaction.html)

### The path in one table

| Step | Action | Proof |
| --- | --- | --- |
| 1. Create your wallet | Choose and create an empty wallet. | You understand where the keys live and how the wallet is operated. |
| 2. Back it up | Record and protect complete recovery material. | You hold an offline recovery record suitable for restoration. |
| 3. Test your recovery | Restore the wallet and compare meaningful identifiers. | The restored wallet produces the expected fingerprint and addresses. |
| 4. Receive and spend | Complete a small round-trip transaction. | Receipt, observation, signing, broadcasting, change and confirmation all work. |

Start small. Complete the first three steps while the wallet is empty. Then
complete the fourth with an amount you can afford to lose before deciding
whether the wallet should hold more.

## Go deeper when you need to

The four steps are the spine. The rest of the library exists for the moment a
step raises a question the step itself cannot answer.

- **Fundamentals** — what money is, what owning bitcoin means, keys, addresses
  and UTXOs, how transactions work, who decides Bitcoin's rules, and why the
  supply limit holds.
- **Setup guides** — hardware signing devices, desktop and mobile wallet
  software, watch-only wallets, air-gapped PSBT workflows, exchange withdrawals
  and recovery drills.
- **Security** — recovery backups, passphrases, supply-chain risk, duress and
  coercion, inheritance, multisig and geographic key separation.
- **Privacy and verification** — running a node, connecting wallets to it, coin
  control, chain-analysis heuristics, address reuse, CoinJoin and Payjoin
  concepts, and software and firmware verification.

Everything published is indexed on [the guides page](https://selfcustody.ca/guides.html),
alongside comparison pages for [devices](https://selfcustody.ca/devices.html),
[software](https://selfcustody.ca/software.html) and
[exchanges](https://selfcustody.ca/exchanges.html), a
[glossary](https://selfcustody.ca/glossary.html) and a live network
[dashboard](https://selfcustody.ca/dashboard.html).

## Entropy Workshop

The [Entropy Workshop](https://selfcustody.ca/entropy.html) converts
user-supplied dice rolls, coin flips or shuffled cards into the recovery words,
wallet identifiers, addresses and export files produced by several documented
conversion methods. It exists so that a result can be reproduced independently
from the same physical sequence and compared against what a device produced.

What it deliberately does not do:

- It does not generate randomness. Every bit comes from the physical events you
  enter.
- It has no field for importing an existing recovery phrase, so it cannot be
  used to exfiltrate one.
- It does not sign or broadcast transactions. It is not a wallet.
- It is experimental. Do not trust it with meaningful funds.

The downloadable edition, `docs/entropy-offline.html`, is a single
self-contained file that embeds its own fonts, styles, script and wordlist and
makes no automatic network request. Its SHA-256 is published beside it as
`docs/entropy-offline.html.sha256`, generated from the exact bytes in the same
build step, and every push to `main` publishes a keyless build-provenance
attestation for those bytes.

An offline file is not proof of an air gap. Nothing inside a browser can tell
whether the machine running it is connected; the page reports which copy you are
running and how that copy was loaded, and that is all it can honestly report.
[SECURITY.md](SECURITY.md) states the full set of claims, the limits of both the
published checksum and the attestation, and how to reproduce the artifact.

## How the site is built

The site is static. There is no server-side code, no database, no accounts and
no analytics. `docs/` is the published output, generated from sources in
`build/` by one Node script.

| Path | What lives there |
| --- | --- |
| `build/content.mjs` | Main-page content, navigation, shared components, homepage and comparison pages. |
| `build/guides.mjs` | Source content and metadata for every guide, including Intro to Self Custody. |
| `build/render.mjs` | The static-site renderer and Entropy Workshop build assembly. |
| `build/tools/` | Entropy Workshop implementation, cryptographic code, build guards, calibration tools and tests. |
| `build/vendor/` | Third-party components: the QR generator, fonts, the icon subset and the vendored wallet-export code. |
| `secp256k1-wasm/` | Rust wrapper and pinned builder for the libsecp256k1 WebAssembly engine. |
| `fuzzing/lifehash/` | Differential fuzz harness comparing this project's LifeHash against the canonical implementation. |
| `.github/workflows/` | CI, the reproducible WASM build, artifact verification and attestation. |
| `docs/` | Published static output. Most of it is generated. |

> **Do not edit generated guide pages or generated Entropy Workshop artifacts
> directly.** Edit the corresponding source under `build/`, run the build,
> inspect the result, and commit both the source and the regenerated output. CI
> fails any commit where a clean build would change the tree.

One nuance: the HTML files at the root of `docs/` are not fully generated. Their
`<head>` — canonicals, `og:` tags, JSON-LD — is maintained by hand and left
untouched; only their body containers are rewritten. Guide pages under
`docs/guides/` are written whole. Follow the comments at the top of
`build/render.mjs` rather than assuming every byte in `docs/` has the same
source.

## Working on the project

CI runs Node.js 22. Use that until an explicit supported range is established.

```bash
git clone https://github.com/DeesNeez/selfcustody.git
cd selfcustody
npm run build
```

There are no runtime dependencies in `package.json`, so the ordinary build needs
no `npm install`. (The LifeHash fuzz harness under `fuzzing/lifehash/` has its
own dependencies and its own install step; nothing else does.)

`npm run build` does more than render pages. In one run it also refreshes the
generated pages, assembles the offline Entropy Workshop artifact, writes its
SHA-256, and runs the guards that check for unexpected network requests, font
and glyph coverage, and the Workshop's structural invariants. Any of them
failing exits non-zero.

The editing loop:

1. Edit a source file under `build/`.
2. Run `npm run build`.
3. Review both the source diff and the regenerated `docs/` diff.
4. Run the tests relevant to the change.
5. Confirm that only the intended files changed.
6. Open the generated site through a local static server for a visual check.

Any static server works. If Python happens to be installed:

```bash
python -m http.server 4173 --directory docs
```

Then open <http://localhost:4173/>. Python is not a project requirement — it is
just one convenient way to serve a directory.

### Which tests to run

| If you changed | Run |
| --- | --- |
| Ordinary content | `npm run build`, then check the affected pages |
| Entropy conversion or derivation | `npm run test:entropy` |
| The WebAssembly boundary | `npm run test:secp256k1-wasm` and `npm run test:wasm-wipe` |
| Wallet export | `npm run test:wallet-dat` |
| Browser startup or warnings | `npm run test:browser-preflight` and `npm run test:beta-warning` |
| Fingerprint visuals | `npm run test:lifehash` |
| Dice and coin distribution displays | `npm run test:die-distribution` |
| Card-suit rendering | `npm run test:card-suit-fonts` |
| CI policy | `npm run test:ci-completeness` and `npm run test:attestation-workflow` |

Run `npm run build` after any of them. There is currently no umbrella `npm test`
script. If one is added, it should mirror the complete CI test set;
`npm run test:ci-completeness` is the guard that detects committed tests missing
from CI.

## Security

Report anything affecting the correctness or containment of the Entropy
Workshop privately: email **info@selfcustody.ca**, or use GitHub's
[private advisory form](https://github.com/DeesNeez/selfcustody/security/advisories/new).
Wrong derivations, exposed secrets, unexpected networking and offline-build
containment failures should not be filed as public issues. Broken links, wrong
facts and layout bugs are welcome as ordinary public issues.

**Never include real wallet material** — entropy, recovery phrases, passphrases,
private keys — in an issue, a pull request, a screenshot or a test vector. Use
disposable values.

[SECURITY.md](SECURITY.md) has the full policy: what the Workshop promises, what
it explicitly does not, what is in and out of scope, and how to verify or
reproduce a download.

## Licensing

Top-level project licensing is being prepared. Until it is published,
project-authored software, writing, diagrams and media remain under default
copyright.

Existing third-party components retain their upstream licences and notices. The
intended project licensing is MIT for project-authored software and Creative
Commons Attribution 4.0 International for project-authored educational writing
and diagrams, subject to the current authorship and provenance audit.
Third-party images, logos and trademarks are not included in that intended
content licence.

[LICENSING-AUDIT.md](LICENSING-AUDIT.md) records that audit in progress: what
has been verified, which third-party notices are still missing, and what is
still unresolved.

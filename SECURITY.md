# Security Policy

SelfCustody.ca is a static education site. It has no accounts, no database, no
server-side code, and no analytics. Almost all of it is text.

The exception is the **Entropy Workshop** — `docs/entropy.html` and the
downloadable `docs/entropy-offline.html` — which performs real cryptography in
the browser. That tool is where security reports matter most, and most of this
document is about it.

## Reporting a vulnerability

Email **info@selfcustody.ca**, or open a private report through GitHub's
["Report a vulnerability"](https://github.com/DeesNeez/selfcustody/security/advisories/new)
form on this repository.

Please do not open a public issue for anything that affects the correctness or
containment of the Entropy Workshop. Everything else — a broken link, a wrong
fact in a guide, a layout bug — is welcome as a normal public issue.

Include the page or file, what you did, what happened, and what you expected.
When relevant, include the entropy source, word count, conversion method,
address type, and derivation path.
If an exact input is necessary to reproduce the issue, use only a disposable
or minimized test vector. Never submit entropy, a recovery phrase, passphrase,
private key, or other material from a wallet you use or intend to use.
If the report concerns the offline build, include the SHA-256 of the file you
tested so we can identify the exact artifact.

Expect an acknowledgement within a week. There is no bounty programme.

## What the Entropy Workshop promises

These are the claims the tool makes about itself. **A demonstration that any of
them is false is a valid security report**, and the most useful kind:

1. **It never generates randomness.** There is no RNG, no CSPRNG call, and no
   "generate for me" button anywhere in the conversion path. Every bit comes
   from dice, coins or cards that the reader supplies.
2. **It has nowhere to enter an existing recovery phrase.** The tool converts
   physical events into words. It does not accept words as input, so it cannot
   be used to exfiltrate a phrase someone already holds.
3. **The downloadable build fetches nothing.** `entropy-offline.html` is a
   single self-contained file. It embeds its own fonts, styles, script and
   wordlist, carries a restrictive Content-Security-Policy, and makes no
   automatic network request of any kind. The external links it contains are
   click-through documentation references that only load if you click them.
4. **The published checksum matches the artifact.** `entropy-offline.html.sha256`
   is generated from the exact bytes written, in the same build step. If the two
   ever disagree, that is a reportable defect.
5. **The release artifact has build provenance.** After the ordinary build and
   pinned-source WebAssembly checks pass, every push to `main` publishes a
   keyless GitHub/Sigstore attestation for the exact
   `docs/entropy-offline.html` bytes in that commit.
6. **Conversions are correct.** The tool reproduces the published conventions it
   claims to reproduce — BIP32/39/44/49/84/86, SLIP-132, and the specific
   dice/card conventions of COLDCARD, Keystone, BitBox02, the BIP39 HTML tool
   and the printed octal-and-hex dictionary. A vector where the tool disagrees
   with a published specification or with the device it names is a bug, and a
   serious one: it would tell someone their hardware wallet is dishonest when
   the fault is ours.

The tool refuses to render its results at all if its embedded test vectors fail
on load, because a conversion tool that is quietly wrong is worse than none.

## What the Entropy Workshop does not promise

- **It cannot tell whether your machine is offline.** It reports which copy you
  are running and how that copy was loaded. A local file on a fully connected
  machine is indistinguishable, from inside a browser, from a local file on an
  air-gapped one. Do not read any badge on the page as proof of an air gap.
- **It is not a randomness test.** The fabrication check exists to catch input
  that was typed rather than rolled. Passing it means "nothing here is obviously
  fabricated", never "this is good randomness".
- **It is not a wallet.** It does not sign, does not broadcast, does not hold
  funds, and does not store entered or derived wallet material between visits.
  Its only persistent value is the current beta-warning acknowledgement version.

## Scope

**In scope**

- Correctness of any conversion, derivation, address or checksum.
- Anything that causes the offline build to make a network request, or to stop
  being self-contained.
- Anything that causes either build to retain, transmit or expose entered
  material beyond the page's own lifetime.
- Cross-site scripting or content injection in any generated page.
- A published checksum that does not match its artifact.
- A claim in the page's own copy that is false about that page.

**Out of scope**

- Response headers on the hosting platform. The site is served by GitHub Pages,
  which does not let us set arbitrary headers; page-level `<meta>` equivalents
  are used where they work. Reports that a header is absent are not defects we
  can fix, though notes on what *can* be tightened are welcome.
- Missing rate limiting, missing authentication, or missing account controls.
  There are no accounts and no server to protect.
- Denial of service against a static file host.
- Social engineering, physical access, or a compromised operating system. If the
  machine running the tool is compromised, nothing the tool does can help.
- Vulnerabilities that require a browser that is already fully controlled by an
  attacker.
- Reports generated by automated scanners with no demonstrated impact.

## Verifying a download

The offline build is meant to be checked before it is trusted. Its SHA-256 is
published beside it as `entropy-offline.html.sha256`:

```
certutil -hashfile entropy-offline.html SHA256     (Windows)
shasum -a 256 entropy-offline.html                 (macOS, Linux)
```

Compare the result against the published line. That one line is the only thing
you need a network for; it can be fetched from anywhere, on any machine.

### What that checksum does and does not prove

It proves the file arrived intact. A truncated download, a proxy that rewrote
something, a corrupted USB stick — all of those change the hash, and you will
see it immediately.

**It does not prove the file is genuine.** The checksum is served from the same
place as the file it describes. Anyone who could replace one could replace the
other, and you would compare a tampered file against a tampered hash and get a
clean result. Same-origin checksums detect accidents, not adversaries.

For a stronger origin check, verify the keyless build-provenance attestation
published by this repository's release workflow:

```
gh attestation verify entropy-offline.html -R DeesNeez/selfcustody
```

That proves the file's bytes were attested by this repository's GitHub Actions
workflow after its verification jobs passed. It does not prove that the source
itself is correct, that every reviewer is trustworthy, or that the machine on
which you open the file is safe. For an independent check, inspect the source
and reproduce the build locally.

The tool is for testing rather than for securing real bitcoin, so this matters
less than it would otherwise. It still matters: a tampered copy could report a
wrong phrase for a device you were checking, and send you looking for a fault
in the device. If a result is going to change what you believe about a wallet,
do not stop at the hash:

- Verify the repository attestation, then compare against a copy fetched over
  a different network or from the repository's commit history.
- Read the file. It is one HTML document with no minification and no
  runtime-loaded dependencies, specifically so that reading it is possible.
- Use a published or otherwise disposable test sequence and compare its
  expected phrase.

Treat the published hash as an integrity check, the attestation as evidence of
the file's build origin, and a source review plus a reproduced build as the
independent verification path.

### Reproducing the file yourself

Assembling `docs/entropy-offline.html` needs nothing but this repository and
Node:

```
npm run build
```

The build compiles nothing and compresses nothing — it assembles committed
inputs — so its output does not depend on a host compiler or compression
library, which are the parts that differ between machines. It has reproduced
byte-identically across the Node versions used to develop it and the one CI
runs; that is evidence, not a guarantee about every future release. A file
that matches the published hash confirms the artifact is what these sources
assemble to.

One of the inputs it assembles cannot be re-derived that way. The libsecp256k1
engine is committed as `build/tools/secp256k1-wasm-b64.js`, and both of its
forms — the raw WebAssembly, and the gzip stream the page actually ships — are
produced inside the pinned builder image, by `npm run build:wasm:container`,
which needs Docker.

Compiling the Rust reproducibly already required that image. The Rust
compiler, the C compiler that builds the vendored libsecp256k1 sources, the
archiver and the host linker all affect the emitted module, so the image
installs each at an exact version from one immutable Ubuntu snapshot, with the
Rust and Node tarballs verified by SHA-256 before they enter the build. The
workflow then names the image itself by digest rather than by tag, because a
tag can be repointed. Compression now requires it too. Deflate output
differs between zlib builds, and the builder's zlib and an ordinary host Node's
have been observed producing different bytes — of identical length — for the
same module. A gzip payload made anywhere else is a valid stream that restores
the same engine, and it is not the published bytes.

So the engine is **checked for identity rather than rebuilt**, and that check
needs no Docker:

- The generated file declares the module's SHA-256 on its `wasm sha256:` line.
- Decompress the `SECP256K1_WASM_GZIP_B64` payload embedded in the page and
  hash the result. It must equal that line, and it must equal the SHA-256 of
  the committed raw payload.

Read those two comparisons differently. The `wasm sha256:` line travels inside
the file it describes, so agreeing with it proves only that the copy is
self-consistent — the same limitation the published checksum has, for the same
reason. The comparison that carries weight is against
`build/tools/secp256k1-wasm-b64.js` obtained separately from the repository.

And even that establishes identity, not provenance: it shows your copy carries
the engine this repository committed. Whether that engine is what the pinned
toolchain actually produces from the Rust sources is a different question,
answered by rebuilding it or by the attestation above — not by any hash in the
file.

The build asserts exactly that on every run, for both pages, and the
`build-wasm` CI job separately rebuilds the engine in the pinned image twice
and refuses any wrapper that differs from the committed one — the check that
caught a locally-compressed payload before it shipped.

The practical consequence: assembling the page is open to anyone, rebuilding
the engine inside it is open to anyone with Docker, and everyone else can
still establish that their copy carries the same engine this repository
committed. That last claim is narrower than "the engine is sound" — it is the
one a hash can actually support.

## Using the tool safely

**This tool is experimental and is meant for testing.** Do not rely on it to
secure real bitcoin, and never test with funds you cannot afford to lose. Its
conversion and wallet-format glue follows the published specifications, while
curve operations use Bitcoin Core's libsecp256k1 compiled to WebAssembly. That
improves the curve implementation, but the surrounding code and browser bridge
still need independent verification rather than trust.

Use it the way it is meant to be used: a test sequence rather than the rolls
behind a wallet you use, a wallet holding nothing that you wipe afterwards, and
a comparison against what your device produced.

Even for that, download the file, verify the checksum, and open it from disk on
a machine that has never been online. A sequence entered over a network is one
you should treat as spent, whatever you intended it for.

Never enter dice rolls, flips or cards that produced a wallet holding real funds
into a copy of this page loaded over a network.

## Supported versions

The deployed site is the supported version. There are no maintained release
branches; fixes land on `main` and deploy directly. The offline build carries no
version number of its own — its SHA-256 identifies it exactly.

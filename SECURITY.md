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
5. **Conversions are correct.** The tool reproduces the published conventions it
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
  funds, and does not store anything between visits.

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

The tool is for testing rather than for securing real bitcoin, so this matters
less than it would otherwise. It still matters: a tampered copy could report a
wrong phrase for a device you were checking, and send you looking for a fault
in the device. If a result is going to change what you believe about a wallet,
do not stop at the hash:

- Compare it against a copy fetched over a different network, on a different
  device, or from the repository's commit history rather than the live site.
- Read the file. It is one HTML document with no minification and no
  dependencies, specifically so that reading it is possible.
- Derive a phrase you already control and check that the tool reproduces it.

If this project later publishes signed release tags or a signed manifest, that
will be the stronger check, and this section will say so. Until it does, treat
the published hash as an integrity check and nothing more.

## Using the tool safely

**This tool is experimental and is meant for testing.** Do not rely on it to
secure real bitcoin, and never test with funds you cannot afford to lose. Its
cryptography is written from the specifications rather than taken from an
audited library, which is what makes it readable end to end and also what makes
it something to check rather than trust.

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

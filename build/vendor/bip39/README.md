# BIP-39 English wordlist

`build/tools/bip39-english.txt` is the BIP-39 English wordlist, and the whole
of it ships inside both Workshop builds. `LICENSE` is what travels with it.

## Where the licence comes from

BIP-39's own Reference Implementation section says the reference implementation
"including wordlists" is `trezor/python-mnemonic`. That project carries a
repository-level MIT licence with a named copyright holder, so it can be quoted
rather than inferred, and it is the source this notice is taken from.

| | | |
| --- | --- | --- |
| Source revision | `trezor/python-mnemonic` tag `v0.21` | commit `d4b106cdec196202d44628026fcb8fedc8ea50c1` |
| Wordlist | `src/mnemonic/wordlist/english.txt` | blob `942040ed50f7205cafc465496229128ba4f78e75`, sha256 `2f5eed53a4727b4bf8880d8f3f199efc90e58503646d9ff8eff3a2ed3b24dbda` |
| Licence | `LICENSE`, vendored here | blob `b1357446497a09f87bc5e956d5c45b77e28f8545`, sha256 `d5e3c7c62a84e80073201e2f6e5130e9e6804fa05f8ac4f8b26a13c7d3969697` |

MIT, Copyright (c) 2013-2016 Pavol Rusnak. The wordlist in that release is
byte-identical to `build/tools/bip39-english.txt` — 13,116 bytes, 2,048 lines.

## Why not cite BIP-39's own licence declaration

BIP-39 today declares `License: MIT` in its preamble, and it would have been
convenient to stop there.

It would also have been an anachronism. At `ce1862ac6bcffa1dd20aad858380e51e66e949ea`
— the 2014 commit that added `bip-0039/english.txt` and the last to touch it —
BIP-39 declared no licence at all. The words "license" and "copyright" do not
appear anywhere in the document at that revision, and its preamble named a
different set of authors than it does now. Per-BIP licensing came later.

`bitcoin/bips` also carries no repository licence file, so even the modern
declaration offers no copyright line to reproduce. Reaching for one would have
meant writing "Copyright (c) … The BIP-39 Authors" — a notice nobody upstream
ever wrote.

So the licence is taken from the project that grants one, and BIP-39's copy
serves a different purpose.

## What the bitcoin/bips copy is for

Confirmation that these bytes are the canonical list, and nothing more.
`bip-0039/english.txt` at `ce1862ac` has the same sha256 as the file here and
as the copy in python-mnemonic v0.21. So does the `english.json` in npm
`bip39@3.1.0`, joined with newlines, and so does the hash published for this
list generally.

Four independent sources agreeing on the bytes is why the list can be called
canonical. It is not why it can be redistributed — that is the licence above.

## How it travels

`build/tools/entropy-page.mjs` reproduces `LICENSE` in the script element that
carries the wordlist, in both builds, guarded by the same `assertInlineSafe`
check the other embedded notices use. The offline build is downloaded and
passed around on its own, so a licence left in this directory would not travel
with the list it covers.

## What the repository's own history says

Nothing. The file arrived in a single commit on 2026-08-25 that added the
offline Workshop, at the path it still occupies, with no note of where it came
from. That is why the provenance had to be established by matching bytes rather
than by reading a record.

A separate point, recorded once rather than leaned on: 2,048 common English
words in alphabetical order, chosen by objective criteria, is thin subject
matter for copyright in the first place. The notice is carried because the
source grants a licence on stated terms and the list travels inside a
distributed artifact, not because the risk is significant.

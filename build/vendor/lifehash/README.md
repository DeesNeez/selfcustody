# LifeHash licence

`LICENSE.md` is Blockchain Commons' licence for LifeHash, copied byte-for-byte
from the upstream repository. It is here because `build/tools/lifehash.js`
implements their algorithm and is distributed under it.

## Where it came from

    https://github.com/BlockchainCommons/bc-lifehash
    LICENSE.md at commit 0444dbed5615fbc9a98163608c6499c025b7873b  (2026-02-20)
    sha256 ff4648e9a492f4bbb4ad89982cd65cbf5d3f7414e4981344671fcccdd38745de

BSD-2-Clause Plus Patent License, © 2019 Blockchain Commons, LLC. Pinned to a
commit rather than to a branch, so the text this repository claims to carry is
a fixed thing rather than whatever the default branch says today.

## Why the licence is here and not only a reference to it

The licence requires redistributions of source to retain the copyright notice,
the conditions and the disclaimer. `build/tools/lifehash.js` is inlined into
both `docs/entropy.html` and `docs/entropy-offline.html`, and the offline build
is a single file people download and pass around on its own. A notice that
stayed in this directory would not travel with it, so
`build/tools/entropy-page.mjs` reproduces this file in full inside the script
element that carries the module, and the build refuses to run if the text
contains anything that could break out of that comment.

## The chain, and what each link contributes

- **Blockchain Commons** — the algorithm and its reference C++ implementation.
  The licence in this directory is theirs, and it is the one that governs.
- **EntropyLab** (`w-s-bitcoin/entropylab#74`) — the JavaScript implementation
  this module was adapted from, contributed there under that project's
  public-domain terms. That grant is what permits the adaptation; it does not
  displace the licence above.
- **AndreasGassmann/lifehash** (MIT) — a separate implementation of the same
  algorithm, used only by the differential test in `fuzzing/lifehash/` and by
  the generation of the pinned vectors in `build/tools/lifehash-test.mjs`. It
  is never installed by the site build, never committed, and never shipped, and
  no code from it is present here. Testing provenance, not a licence
  obligation.

A structural comparison behind that last point — token-level similarity against
controls, identifier retention, and the shared colour table — was carried out
before this notice was chosen, and is recorded outside the repository.

## If the upstream question is ever answered

A provenance question is open at `w-s-bitcoin/entropylab#74` asking whether that
implementation was translated from Blockchain Commons' C++ or Andreas
Gassmann's TypeScript, or written from the algorithm. Carrying this licence is
the conservative answer either way, and does not depend on a reply. Should one
arrive showing the MIT implementation was in fact a source, its notice would
need adding beside this one.

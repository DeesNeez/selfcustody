# LifeHash licences

`build/tools/lifehash.js` carries two upstream licences, and both are here:

| File | Covers | Pinned source |
| --- | --- | --- |
| `LICENSE.md` | BSD-2-Clause Plus Patent, © 2019 Blockchain Commons, LLC — the LifeHash algorithm and its C++ reference implementation | `BlockchainCommons/bc-lifehash` at `0444dbed5615fbc9a98163608c6499c025b7873b` (2026-02-20), sha256 `ff4648e9a492f4bb…` |
| `LICENSE-MIT-lifehash-ts.txt` | MIT, © 2022 Andreas Gassmann — the TypeScript implementation the module was adapted from | `AndreasGassmann/lifehash` at tag `v1.0.0`, `366ce2f9b3df1bfecd2c4460000b56faebad9de4`, sha256 `4dfa0a2c660fd89f…` |

Both are pinned to a commit rather than a branch, so the text this repository
claims to carry is a fixed thing rather than whatever a default branch says
today. The MIT copy is byte-identical to the one inside the published npm
package version this project tests against.

## Why two

The provenance was not obvious from the code, so it was put to the author.
EntropyLab's implementation described itself as a "faithful port of the
reference algorithm (Blockchain Commons / the lifehash JS package)", naming two
possible sources without saying which was consulted.

The answer, on `w-s-bitcoin/entropylab#74`: their file was written by following
the reference sources function by function — **primarily Andreas Gassmann's
TypeScript package**, itself a port of Blockchain Commons' C++ — and
re-expressing them in that project's idiom, with closures instead of classes
and flat arrays instead of grid objects. Explicitly not clean-room.

The author pointed at traces that survive, and they are checkable here:

- `runGameOfLife` and `buildFracGrid` are names from the TypeScript package.
  The C++ inlines that logic and has no such functions, so those names could
  only have come from the TypeScript. Both appear in this module.
- The string `"BitEnumerator underflow."` is verbatim in the package and in the
  EntropyLab file this module was adapted from.

EntropyLab's own public-domain terms cover that project's original code. They
cannot cover adapted upstream expression, so they do not reach the whole of
`lifehash.js`. Hence both notices.

## What this corrects

An earlier structural comparison run here concluded the MIT implementation was
*not* a source, and this directory briefly carried only the Blockchain Commons
licence. That conclusion was wrong, and the way it was wrong is worth recording
so the mistake is not repeated:

- The similarity measure normalised every string literal to a placeholder, so
  the verbatim error message — the single strongest copy signal available —
  was invisible to it by construction.
- The identifier test probed for Blockchain Commons' `snake_case` names and
  found none, which was true but answered the wrong question. It never probed
  for the TypeScript package's own names, which are present.

Author testimony about how code was actually written beats inference from
similarity metrics, particularly metrics whose blind spots are not mapped.

## How the notices travel

Both licences require redistributions of source to retain the copyright notice
and the licence text. `build/tools/lifehash.js` is inlined into both
`docs/entropy.html` and `docs/entropy-offline.html`, and the offline build is a
single file people download and pass around on its own. A notice left in this
directory would not travel with it, so `build/tools/entropy-page.mjs`
reproduces both files in full inside the script element that carries the
module. The build refuses to run if either text contains anything that could
break out of that comment.

Upstream `w-s-bitcoin/entropylab#265` adds the same two notices to their own
header, so the artifact they publish carries them too.

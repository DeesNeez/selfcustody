# Licensing map — DRAFT

> ## ⚠ Draft — not in effect
>
> **While this notice is present, nothing here grants anything.** This map is
> under review in [PR #84](https://github.com/HodlDee/selfcustody/pull/84), and
> default copyright applies.
>
> A finalization commit, made only after approval, removes this notice from
> `LICENSE`, `LICENSE-CONTENT.md`, `THIRD_PARTY_NOTICES.md` and this file
> together, so the package takes effect as one. The presence of this notice, not
> the state of any pull request, is what tells you which version you are holding.

**Copyright © 2023–2026 HodlDee.** HodlDee is the pseudonymous identifier
designated by the licensor for attribution; compliance does not require
disclosure of the licensor's legal identity.

This repository is not under a single licence, and it would be misleading to
put one badge on it. Four regimes apply to different bodies of material.

## The four regimes

| Material | Licence | Full text |
| --- | --- | --- |
| Project-authored **software** | MIT | [LICENSE](LICENSE) |
| Project-authored **educational writing** and original diagrams | CC BY 4.0 | [LICENSE-CONTENT.md](LICENSE-CONTENT.md) |
| The **`secp256k1-wasm` wrapper** and its builder | The Unlicense | [`secp256k1-wasm/LICENSE`](secp256k1-wasm/LICENSE) |
| **Third-party** components | each keeps its own | [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) |

The third is project-authored too, and is separate rather than an oversight: it
was released into the public domain upstream, and `secp256k1-wasm/Cargo.toml`
and its `README.md` both state The Unlicense. Re-licensing it as MIT here would
narrow terms already given away.

## The split is by nature, not by path

This is the part that trips people up, so it is worth stating plainly: **the
licence follows what the material *is*, not what file it sits in or what format
it arrives in.**

`build/content.mjs` is the clearest case. It is a JavaScript module — so the
code in it is MIT — that contains the site's prose as string literals, and that
prose is CC BY 4.0. One file, two licences, split by content. A rule keyed to
the `.mjs` extension would get one of the two wrong.

The same principle runs the other way for format. The guide text is the same
licensed material whether you read it in `build/guides.mjs`, in the rendered
HTML under `docs/`, or in a PDF someone printed from it. CC BY 4.0 grants use
"in any medium or format", so reformatting changes nothing.

## Where each kind of material lives

| Path | What it is | Licence |
| --- | --- | --- |
| `build/render.mjs`, `build/tools/` | Renderer, Entropy Workshop, guards, tests | MIT, except the third-party files listed in the notices |
| `build/content.mjs` | Site software **and** the prose it contains | MIT for the code, CC BY 4.0 for the prose |
| `build/guides.mjs` | Module code **and** the 56 guides plus original SVG diagrams it contains | MIT for the code, CC BY 4.0 for the writing and diagrams |
| `secp256k1-wasm/` | Rust wrapper and pinned builder image | The Unlicense — see `secp256k1-wasm/LICENSE` |
| `fuzzing/` | Differential test harness, never shipped | MIT |
| `.github/workflows/` | CI configuration | MIT |
| `build/vendor/`, `docs/assets/vendor/` | Third-party code, fonts and licence texts | Upstream licences — see the notices |
| `docs/` | Generated output | **No single licence.** See below |

## Generated output has no licence of its own

The pages under `docs/` are assembled from every category at once. A single
guide page can carry project-authored prose, a vendored font, an AI-generated
image and a manufacturer's mark. **Each component keeps the licence of its
source**, and treating the page as CC BY because most of its words are would
sweep in material the content licence spends its length excluding.

Read precisely, that is a statement about the page as a unit, not about its
contents. The project-authored prose inside a rendered page is the same CC BY
material it is in `build/guides.mjs`, and the licence reaches it there as
anywhere else — quoting a paragraph from a published page is squarely within the
grant. What has no licence is **the assembled page as a whole**, because no
single set of terms covers everything on it.

So the practical question is not where you took the material from but what you
took. Take the project's writing and this licence comes with it. Take the page
entire and you have also taken a font, an image and a mark that arrive on their
own terms — which may still permit what you intend, but not because of anything
this licence says.

## What is excluded from the content licence

`LICENSE-CONTENT.md` is the authority; in outline, the exclusions are
AI-generated and AI-assisted images, four Unsplash photographs, manufacturer
marks and product photographs, the project's own branding, third-party
components, and anything whose provenance the audit does not record.

Two of those need flagging here because they are unresolved rather than merely
excluded:

- The **27 manufacturer marks** appear on a *proposed* nominative-use basis,
  recorded for review and not asserted as settled.
- The **13 product photographs** have **no documented permission**. Their use is
  unresolved — not authorised, not settled — and replacement is tracked in
  [issue #86](https://github.com/HodlDee/selfcustody/issues/86). Their exclusion
  from the content licence says what that licence does not grant; it says
  nothing about the basis on which they appear here.

## How this was established

[LICENSING-AUDIT.md](LICENSING-AUDIT.md) records the working: what was checked,
against which upstream source, and what each conclusion rests on. Every
third-party licence was established by matching bytes against a pinned upstream
release rather than inferred from dates or filenames, and `npm run build` fails
if a served stylesheet loses its notice.

# Licensing map

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
| The **project-authored files under `secp256k1-wasm/`** | The Unlicense | [`secp256k1-wasm/LICENSE`](secp256k1-wasm/LICENSE) |
| **Third-party** components | each keeps its own | [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) |

[LICENSE-CONTENT.md](LICENSE-CONTENT.md) is the **unmodified legal text** of
Creative Commons Attribution 4.0 International, and nothing else. What that
licence is applied to here — its scope, its exclusions, and what reuse asks of
you — is set out in this file, from
[What the content licence covers](#what-the-content-licence-covers) onwards.

The third regime is project-authored too, and is separate rather than an
oversight: it was released into the public domain upstream, and
`secp256k1-wasm/Cargo.toml` and its `README.md` both state The Unlicense.
Re-licensing it as MIT here would narrow terms already given away.

Its scope is the **files in that directory** — `src/lib.rs`, `Cargo.toml`,
`rust-toolchain.toml` and `builder/`. It is **not** a licence over the builder
image those files produce. That image is assembled from a pinned Ubuntu base
plus clang, GNU binutils, Rust and Node, each under its own upstream terms, and
no dedication this project makes can reach software it did not write. What is
dedicated is the recipe; what the recipe fetches keeps its own licences.

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
HTML under `docs/`, in a PDF, in an ePub or in print. CC BY 4.0 grants use "in
any medium or format", so reformatting changes nothing about what you may do
with the writing or what you owe in return.

Working from the source modules is practical advice rather than a condition:
that is where the licensed material sits unmixed, so you can take it without
sorting it out of everything else first.

## Where each kind of material lives

| Path | What it is | Licence |
| --- | --- | --- |
| `build/render.mjs`, `build/tools/` | Renderer, Entropy Workshop, guards, tests | MIT, except the third-party files listed in the notices |
| `build/content.mjs` | Site software **and** the prose it contains | MIT for the code, CC BY 4.0 for the prose |
| `build/guides.mjs` | Module code **and** the 56 guides plus original SVG diagrams it contains | MIT for the code, CC BY 4.0 for the writing and diagrams |
| `secp256k1-wasm/` | Rust wrapper, toolchain pin and the builder definition — **not** the third-party software the builder image installs | The Unlicense — see [`secp256k1-wasm/LICENSE`](secp256k1-wasm/LICENSE) |
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
this licence says, and none of which becomes grantable by being adjacent to
something that is.

---

# The content licence

> **Copyright © 2023–2026 HodlDee.**
>
> **This licence is in effect.** It applies to the eligible project-authored
> material in this repository — the writing and original diagrams described
> under *What the content licence covers*, and nothing else.
>
> Eligibility is not a formality. The exclusions below are as much a part of
> this licence as the grant is, and material this file excludes is not licensed
> by being distributed alongside material that is.
>
> **The thirteen product photographs the site serves are excluded**, and that is
> a statement about scope rather than a resolution. Their reuse permission is
> undocumented, their status is tracked in
> [issue #86](https://github.com/HodlDee/selfcustody/issues/86), and their use
> here remains **unresolved** — not authorised, not settled, and not made so by
> their absence from a licence that never claimed to cover them.

## What the content licence covers

The project's own educational writing and its original diagrams:

- the guide text in `build/guides.mjs`, which is what the pages under
  `docs/guides/` are generated from
- the prose in `build/content.mjs` that becomes the site's own pages
- the inline SVG diagrams authored in those two files
- `SECURITY.md`, `README.md` and this repository's other project-authored prose

Licensed under the **Creative Commons Attribution 4.0 International Licence
(CC BY 4.0)** — the full legal text is in
[LICENSE-CONTENT.md](LICENSE-CONTENT.md), and also at
<https://creativecommons.org/licenses/by/4.0/>.

Project-authored **software** is covered separately, under the MIT Licence in
[LICENSE](LICENSE). The split matters because the two live in the same files:
`build/content.mjs` is a JavaScript module that contains prose. The licence
follows the nature of the material, not the file extension — see
[The split is by nature, not by path](#the-split-is-by-nature-not-by-path).

## Attribution

**Copyright © 2023–2026 HodlDee**
**Attribute to:** HodlDee
**Licensor and copyright owner:** HodlDee
**Canonical URL:** <https://selfcustody.ca>

HodlDee is a **pseudonymous individual** — one person, writing under a name
rather than a legal one. The credit line and the owner are therefore the same
name, doing one job instead of two.

**HodlDee is the pseudonymous identifier designated by the licensor for
attribution. Compliance does not require disclosure of the licensor's legal
identity.** Crediting HodlDee is what the attribution condition asks of you; it
is **necessary but not sufficient on its own**, and the full set of conditions
is listed below.

That is a statement about what reuse requires, and not a claim that publishing
under a pseudonym costs nothing. Copyright arises on authorship whatever name an
author uses, but establishing or enforcing ownership can call for evidence
linking the author to the name, which a pseudonym does not supply on its own.
How that would play out in any particular dispute is not something this file
decides.

Preferred form:

> "Adapted from [SelfCustody.ca](https://selfcustody.ca/guides/the-page-you-used.html)
> by **HodlDee**, © 2023–2026 HodlDee, licensed under
> [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changes were made."

Four things are doing work there, and dropping the first is the common mistake:

| Element | In the example |
| --- | --- |
| **The author** | HodlDee |
| The source | a link to the page you used |
| The licence | a link to CC BY 4.0 itself, not just its name |
| Your changes | "Changes were made", ideally more specific |

Naming the author is not decoration, and a credit that omits HodlDee does not
satisfy the attribution condition. Linking the specific page rather than the
site root is a courtesy on top: it lets a reader check what you started with.

### What compliance actually requires

Attribution is the condition people remember, and it is not the only one. If you
share this material, CC BY 4.0 asks all of the following (section 3(a)):

The first four apply **to the extent they are supplied** with the material you
took, which here they are:

- **Credit the creator** — HodlDee, the name designated for attribution.
- **Retain the copyright notice** — `© 2023–2026 HodlDee`.
- **Retain a notice referring to this licence**, and a **notice referring to the
  disclaimer of warranties** below.
- **Retain a link to the material**, where reasonably practicable.

Then, in every case:

- **Indicate if you modified it**, and keep any indication of earlier
  modifications.
- **Say that the material is under CC BY 4.0, and include either the licence
  text or a link to it** — the text is in
  [LICENSE-CONTENT.md](LICENSE-CONTENT.md), the link is
  <https://creativecommons.org/licenses/by/4.0/>. The licence accepts either; a
  link is the usual choice.

Section 2 adds two limits, and both are conditioned on effect rather than
absolute. You may not offer additional or different terms, and you may not apply
effective technological measures, **where doing so would restrict anyone
downstream from exercising the rights this licence grants**. Terms that leave
those rights intact — your own licence over your own additions, for instance —
are not what that provision reaches.

You may satisfy all of this in any reasonable manner for your medium — a
footnote, a credits page, a link — and if the licensor asks, you must remove the
attribution information to the extent reasonably practicable.

### Saying what you changed

CC BY 4.0 requires you to indicate if you modified the material. A sentence is
enough, and being specific is more useful to your readers than being thorough:

- "Condensed from the original; the multisig section was removed."
- "Translated into French."
- "Updated fee figures for 2027; the rest is unchanged."

If you changed nothing, the licence asks nothing of you here — the condition is
to indicate modification, and there is none to indicate. Writing "reproduced
unchanged" anyway is a **courtesy, not a requirement**: it tells a reader they
can rely on the original. Nothing in this file adds conditions to CC BY 4.0, and
where it suggests going further than the licence asks, it says so.

## What the content licence does NOT cover

Everything below is **excluded**. Some of it belongs to other people, some has
an unresolved status, and one category is deliberately withheld. Reusing the
writing grants nothing over any of it.

### Images generated with, or assisted by, AI

Every image in this repository that was produced with a generative tool —
28 files made with Google Gemini, the five Cash Vortex assets made with ChatGPT
and Motionleap, and the project marks below.

The exclusion is not a judgement that these are worthless or that the project
lacks rights in them. It is that **whether AI output attracts copyright at all,
and on what terms it may be licensed onward, is unsettled**, and this project
will not resolve that question by asserting a licence over material whose
status it cannot state. Licensing something you may not own is worse than
licensing nothing.

### Photographs from Unsplash

Four photographs, each used under the Unsplash Licence:

| File | Photographer | Photograph |
| --- | --- | --- |
| `fiat-single-bill.png` | engin akyurt | [`7aWvQdR36Y0`](https://unsplash.com/photos/a-one-hundred-dollar-bill-with-a-picture-of-a-mans-face-on-it-7aWvQdR36Y0) |
| `hero-lock.webp` | Kaffeebart | [`KrPulSdUetk`](https://unsplash.com/photos/a-close-up-of-a-padlock-on-a-door-KrPulSdUetk) |
| `hero-keylock.webp` | Dima Solomin | [`LkoDqb5E3zg`](https://unsplash.com/photos/a-close-up-of-a-key-on-a-door-LkoDqb5E3zg) |
| `coinkite-circuit-board.jpg` | Alexandre Debiève | [`FO7JIlwjOtU`](https://unsplash.com/photos/macro-photography-of-black-circuit-board-FO7JIlwjOtU) |

They are redistributable on the Unsplash Licence's own terms, which is not a
grant this project can pass on as its own. Go to Unsplash rather than relying on
anything here. `hero-lock.webp` has additionally had its colours modified, which
that licence permits and which does not make it project-owned.

### Manufacturer logos, product photographs, and other third-party marks

**All forty are excluded from this licence**: twenty-seven logos and marks
belonging to hardware makers, wallet software vendors, exchanges and custody
services, and thirteen photographs of products — including
`coldcard-q-mk5-devices.jpg`, which is manufacturer-provided and is one of the
thirteen rather than an exception to them.

> Product names, logos and trademarks are the property of their respective
> owners. Their use here identifies the products discussed and does not indicate
> affiliation with, sponsorship by, or endorsement from their owners.

**Being excluded from this licence is not the same as this project having a
settled right to show them**, and the two should not be read as one statement.
Exclusion says only that reusing the writing grants you nothing over them. It
says nothing about the basis on which they appear here, and that basis differs
between the two groups:

- The **27 logos and marks** appear beside writing about the products they
  identify, under a proposed basis of nominative use. That is a use of a
  *mark*, recorded in the audit for a reviewer to accept or reject.
- The **13 product photographs** have **no documented permission**. A
  photograph is a separate copyrighted work owned by whoever took it, and being
  permitted to name a product grants nothing over someone else's picture of it.
  Their status is open and stays open: it is tracked in
  [issue #86](https://github.com/HodlDee/selfcustody/issues/86) and in
  [LICENSING-AUDIT.md](LICENSING-AUDIT.md), not settled by their absence from
  this licence. A vendor audit on 2026-09-02 found published terms for one
  vendor that **refuse** this use, and no usable terms at all for the other
  eight. Six vendors publish downloadable media kits stating no terms; that is
  not permission, and it is not recorded as permission anywhere.

Whichever way that resolves — terms located, images replaced, or images removed
— it changes what this project may display. It does not change this exclusion,
which holds regardless.

### The project's own marks

`self-custody-symbol.svg`, `self-custody-favicon.svg`, `favicon.png` and
`apple-touch-icon.png`.

These are **reserved**, and the reason has nothing to do with who owns them. A
content licence that included the project's branding would let anyone republish
this writing under this project's identity — which is the one thing a mark
exists to prevent, and the opposite of what attribution is for. You may reuse
the writing; you may not present it as though it came from SelfCustody.ca.

### Third-party software, fonts and vendored components

The QR generator, the fonts, Bootstrap and Bootstrap Icons, libsecp256k1 and its
FFI crate, the LifeHash implementation, the BIP-39 wordlist, and the vendored
wallet-export code. Each keeps its own licence; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

### Generated pages

The pages under `docs/` are **not** licensed as pages. Each component keeps the
licence of its source, and there is no licence that applies to a generated page
as a whole — see
[Generated output has no licence of its own](#generated-output-has-no-licence-of-its-own)
above. Lifting the project's prose out of a rendered page carries CC BY 4.0 with
it; copying the page wholesale also picks up a vendored font, an AI-generated
image and a third-party mark, none of which this licence grants — and none of
which becomes grantable by being adjacent to something that is.

### Anything whose provenance is unresolved

If the audit does not record where something came from, it is excluded, whatever
this page appears to say. An exclusion by name is a convenience; the absence of
a recorded grant is the operative fact.

## No warranty

**This material is offered as-is.** CC BY 4.0 (section 5) offers the Licensed
Material without warranties of any kind — express, implied, statutory or other,
including title, merchantability, fitness for a particular purpose,
non-infringement, absence of errors, or accuracy — and disclaims liability for
any losses arising from its use, to the fullest extent the law allows.

That is worth reading twice for a project about Bitcoin custody. These guides
describe operations where a mistake can lose money permanently and irreversibly.
Nothing here is a guarantee that a procedure is correct, current, or right for
your circumstances, and reusing it does not transfer that judgement to anyone
else. Verify against the manufacturer's own documentation, and test recovery
with an amount you can afford to lose.

Where the disclaimer cannot be given full effect in your jurisdiction, it
applies as closely as local law permits.

## How this was established

[LICENSING-AUDIT.md](LICENSING-AUDIT.md) records the working: what was checked,
against which upstream source, and what each conclusion rests on. Every
third-party licence was established by matching bytes against a pinned upstream
release rather than inferred from dates or filenames, and `npm run build` fails
if a served stylesheet loses its notice.

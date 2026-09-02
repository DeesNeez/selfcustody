# Pristine Bootstrap Icons

Build input, not shipped. `npm run icons:subset` reads these and writes the
subset the site actually serves into `docs/assets/vendor/bootstrap-icons/`.

They live here because the subset used to be generated *in place*, overwriting
the only copy of the stylesheet with the handful of rules the site was using at
the time. That made the step one-way: every run could remove a glyph and no run
could ever add one back. Two glyphs referenced by raw codepoint rather than by
`bi-*` class -- the tick on `.sc-check-list` and the triangle on
`.sc-caution-list` -- were dropped from the font that way and rendered blank
across every guide page until the subsetter learned to see them.

Keeping the full upstream here makes the step reproducible: the subset is
derived from a fixed source on every run, so adding an icon is just a rebuild.

- `bootstrap-icons.woff2` is the only font kept. fontTools reads it and writes
  both the woff2 and the woff the site serves, so the 164 KB upstream `.woff`
  is redundant.

## Which upstream release this is

Identified by matching the vendored bytes against every published
`bootstrap-icons` package, not by inferring from dates -- the files were
vendored here in 2026, years after all the candidate releases, so their commit
date constrains nothing.

Both files are byte-identical to **Bootstrap Icons 1.10.2 and 1.10.3**:

| File | sha256 |
| --- | --- |
| `bootstrap-icons.css` | `e1172d3a0a208cf01dc066f0abeaf17f00264a966159a69f71947d6edcd4935f` |
| `bootstrap-icons.woff2` | `966620f9e3bec428663687f9e8d67a6b8e35d79adebf6fb204e9b139eada7599` |

The stylesheet also carries upstream's own cache-busting token,
`24e3eb84d0bcaf83d77f904c78ac1f47`, which matches those two releases and no
other.

It cannot be narrowed further, and the reason is that there is nothing left to
narrow it with: 1.10.2 and 1.10.3 differ **only in `package.json`**, which is
not vendored here. Every other file in the two packages, fonts and stylesheet
included, is identical. Recording the pair is the honest answer rather than
picking one and implying a precision the evidence does not support.

That ambiguity has no licensing consequence. `LICENSE.md` is byte-identical
across both releases -- sha256 `ae58b37f46d8c7eb680f0223a416a1d26f699a0968f537465256e9274e28da59`
-- and is vendored here from the package. MIT, (c) 2019-2021 The Bootstrap
Authors.

## The notice on the subset

`npm run icons:subset` now writes that licence into a bang comment at the top
of `docs/assets/vendor/bootstrap-icons/bootstrap-icons.css`, read from
`LICENSE.md` rather than retyped so the two cannot drift.

The notice had been lost by accident rather than by decision. The subset
rebuilds its preamble by slicing from the first glyph rule, which starts below
upstream's own comment, so the notice was left behind on every run. A subset is
still a substantial portion of the software -- upstream's outlines, upstream's
class names, with the unused ones dropped -- so MIT asks for it.

The icon font is not embedded in either Workshop build, so unlike the font,
LifeHash and libsecp256k1 notices this one does not need to travel inside the
offline artifact. It ships with the stylesheet that carries the glyphs.

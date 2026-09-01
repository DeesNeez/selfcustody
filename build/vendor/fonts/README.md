# Webfonts

The site's two typefaces, vendored so nothing is fetched from Google.

Both builds use these files. `docs/assets/fonts/` is a copy made by
`build/render.mjs` and served to browsers; `build/tools/entropy-page.mjs`
inlines the same bytes as base64 `@font-face` rules inside the self-contained
`docs/entropy-offline.html`. This directory is the single source.

## Why they are here

The offline build could never link them: a `<link>` to fonts.googleapis.com is
a network request, and "this file fetches nothing" is the property the whole
tool rests on. Its CSP (`default-src 'none'`) would block it anyway.

The rest of the site kept loading them from Google until it became clear that
was the same mistake with a wider blast radius. Every visitor's IP reached
Google on every page, on a site about not handing your business to third
parties — and the Workshop's *site* build carried the same three tags, so
opening it from `file://` (what you do after downloading it) announced "this
copy is running offline", in green, while three requests went out. The page
said something untrue at the moment a reader was deciding whether to trust it.

## What these are

Google serves both families as a **single variable font**, not one file per
weight: the 400, 600 and 700 downloads of Open Sans are byte-identical, as are
the 600 and 700 of Jost. One file per family covers every weight the site uses,
via the `wght` axis.

Open Sans upstream also carries a `wdth` axis, which the site never varies. It
is pinned to 100 before subsetting, which is why the source below is an
intermediate file.

Each is then subset to the characters that actually appear.

| | as served by Google | subset here |
|---|---|---|
| Jost | 53 KB | 15 KB |
| Open Sans | 145 KB | 27 KB |

## What they cannot draw

Nine characters the site uses are **not in both typefaces**, in any weight —
verified against the upstream variable fonts, not just these subsets:

```
← → ✓ ◐ ♠ ♣ ♥ ♦    and the hair space, U+200A
```

Neither family contains the arrows, the check mark, the half-filled circle or
the card suits. The hair space is in Open Sans but not Jost, and a fallback
space is indistinguishable from the real one.

They have always been drawn by whatever face the operating system supplies,
under Google Fonts exactly as they are now. Nothing can change that short of
choosing different typefaces. They are recorded in `coverage.json` under
`knownFallback` so the build can tell them apart from a character that is
missing by accident.

`coverage.json` is generated alongside the subsets and lists every codepoint
they contain. `build/tools/assert-glyphs.mjs` fails the build if any page uses
a character that is in neither that list nor `knownFallback` — because the
failure mode otherwise is a blank box that nothing reports.

## Regenerating

The subsets were originally cut for the Workshop alone. When the same files
were reused site-wide, the copyright sign in every footer, an accented `e` in
one guide and a vulgar fraction in another fell outside them. Re-cut from the
upstream fonts, not from these files — you cannot add a glyph back to a subset.

```bash
# upstream variable fonts
curl -L -o Jost.ttf     'https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf'
curl -L -o OpenSans.ttf 'https://github.com/google/fonts/raw/main/ofl/opensans/OpenSans%5Bwdth,wght%5D.ttf'

U="U+0020-007E,U+00A0,U+00A9,U+00B7,U+00BD,U+00D7,U+00E9,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2082,U+2192,U+2212,U+2248,U+2264,U+2265"

python -m fontTools.subset Jost.ttf --unicodes="$U" --layout-features='' \
  --flavor=woff2 --output-file=build/vendor/fonts/jost-latin.woff2

# pin the width axis first, or the subset carries an axis the site never uses
python -m fontTools.varLib.instancer OpenSans.ttf wdth=100 -o OpenSans-wght.ttf
python -m fontTools.subset OpenSans-wght.ttf --unicodes="$U" --layout-features='' \
  --flavor=woff2 --output-file=build/vendor/fonts/open-sans-latin.woff2
```

Then regenerate `coverage.json` from the new files, and rebuild — the offline
artifact embeds these bytes, so its SHA-256 changes whenever they do.

Do not pass `--instance` for `wght`: that would flatten the weight axis and
cost a second file per family.

## Licensing

Both families are under the SIL Open Font License 1.1, which permits the
subsetting above. The licence is a bundling licence: it allows the fonts to
travel inside other software only if each copy carries the copyright notice
and the licence text.

The upstream licence files are vendored here, one per family, taken from the
same Google Fonts directories the regeneration commands above pull the TTFs
from. They are not interchangeable -- the two texts differ in their copyright
line and in small details of wording and URL scheme, so each family keeps its
own.

| Family | Version | Copyright | Licence |
| --- | --- | --- | --- |
| Jost | 3.710 | Copyright 2020 The Jost Project Authors (https://github.com/indestructible-type) | `OFL-Jost.txt` |
| Open Sans | 3.003 | Copyright 2020 The Open Sans Project Authors (https://github.com/googlefonts/opensans) | `OFL-OpenSans.txt` |

The versions come from each font's own `name` table rather than from a
release page, so they describe the bytes in this directory. Read them back
with `fontTools.ttLib.TTFont(path)["name"]` after any regeneration, and update
the table above if they move.

Both copies of the fonts carry the licence with them. `build/render.mjs` copies
these two text files into `docs/assets/fonts/` beside the woff2 files it serves,
and `build/tools/entropy-page.mjs` inlines both texts in full into the Workshop
builds -- `entropy-offline.html` is a single file people download and pass
around, so a licence that stayed in the repository would not travel with it.

Subsetting drops name IDs 13 and 14, the licence description and URL the
upstream fonts carry internally, which is why the notice has to be reattached
outside the font binary rather than left to it.

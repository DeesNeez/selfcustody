# Embedded webfonts

Build input, not shipped as files. `build/tools/entropy-page.mjs` inlines these
as base64 `@font-face` rules inside `docs/tools/entropy.html`.

The tool page wears the site's chrome, so it needs the site's two typefaces —
and it cannot link them from Google Fonts, because a `<link>` to fonts.googleapis.com
would be a network request, and "this page makes none" is the property the whole
tool rests on. Its CSP (`default-src 'none'`) would block the request anyway.

## What these are

Google serves both families as a **single variable font**, not one file per
weight: the 400, 600 and 700 downloads of Open Sans are byte-identical, as are
the 600 and 700 of Jost. So one file per family covers every weight the page
uses, via the `wght` axis.

Each is then subset to the characters that actually appear on the page —
ASCII plus the punctuation the copy uses (en/em dash, curly quotes, ellipsis,
middot, ×, ₂, →).

| | as served by Google | subset here |
|---|---|---|
| Jost (600 + 700) | 53 KB | 13 KB |
| Open Sans (400 + 600 + 700) | 145 KB | 25 KB |

That is the difference between adding ~257 KB of base64 to a 65 KB file and
adding ~50 KB.

## Regenerating

```
U="U+0020-007E,U+00A0,U+00B7,U+00D7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2082,U+2192"
python -m fontTools.subset jost.woff2 --unicodes="$U" --layout-features='' \
  --flavor=woff2 --output-file=build/vendor/fonts/jost-latin.woff2
```

Do not pass `--instance`: that would flatten the weight axis and cost a second
file per family. If new copy introduces a character outside the set above it
will render as a blank box, so extend `$U` and re-subset.

Both families are under the SIL Open Font License, which permits embedding.

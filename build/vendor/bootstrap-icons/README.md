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

- Version: Bootstrap Icons, as vendored in commit a565235
- `bootstrap-icons.woff2` is the only font kept. fontTools reads it and writes
  both the woff2 and the woff the site serves, so the 164 KB upstream `.woff`
  is redundant.

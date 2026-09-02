# Bootstrap licence

`LICENSE` is Bootstrap's, copied byte-for-byte from the published package. It
is here because `docs/assets/vendor/bootstrap/css/bootstrap.min.css` is a
subset of Bootstrap's stylesheet and is served to every visitor.

## Which release, and how that was established

**Bootstrap v5.2.3.** Not inferred, and not narrowed to a range: the file this
site serves descends from a copy that is byte-identical to the official
distribution.

The served stylesheet is 15.6 KB against upstream's 190 KB, so hashing it
against published releases proves nothing — a subset matches no release by
construction. What settles it is the repository's own history. The file was
vendored whole and only later cut down:

| Commit | What it did |
| --- | --- |
| `a565235` (as `2bc242d` before the history rewrite) | vendored the full dist |
| `601419e` | cut it to the rules the site uses, and stripped the banner with them |

The file as first vendored is 194,901 bytes, sha256
`c0bcf7898fdc3b87babca678cd19a8e3ef570e931c80a3afbffcc453738c951a` — byte-identical
to `dist/css/bootstrap.min.css` in the published `bootstrap@5.2.3` package
(tarball sha256 `60afd8571df30c32c5dd89146c000bc82c28885015d55bfc0b0fe56c03b41a9d`).

Three independent things agree:

- That byte-identity with the official 5.2.3 dist.
- The banner on the original file, which reads `Bootstrap v5.2.3`, and which is
  the thing the subsetting later removed.
- `bootstrap.bundle.min.js`, vendored in the same commit and since deleted,
  whose banner reads `Bootstrap v5.2.3` and which carries `5.2.3` twice as a
  `VERSION` constant.

And the current subset is checked against that release rather than assumed to
match it: all 179 of its selectors and all 98 of its `--bs-*` custom properties
appear in official 5.2.3, with nothing foreign in it.

## The notice

MIT asks that its copyright and permission notice accompany substantial
portions of the software. A subset is a substantial portion — upstream's
selectors, declarations and custom properties, with the unused ones dropped —
so the licence is reproduced in a bang comment at the top of the served file.

The full permission text is used rather than upstream's shorter dist banner,
which points at a licence URL instead of carrying the grant. It is also
deliberately free of URLs: `build/tools/assert-no-fetch.mjs` scans served
stylesheets for named origins, and a notice is a poor reason to widen the list
of origins this site is allowed to name. The licence text itself contains none.

`build/tools/assert-notices.mjs` fails the build if the served copy loses the
notice or carries one that no longer matches this file. Both stylesheets lost
their notices once, in the same way, and nothing reported it.

## Not generated

Unlike the icon subset, there is no script that produces this file from the
vendored source. The cut-down stylesheet is committed directly under `docs/`,
which makes it the one hand-maintained file inside otherwise-generated output.
Replacing it means re-cutting it by hand, and the notice check is what stops
that from silently dropping the licence again.

# Contributing

This site teaches people to hold their own bitcoin, and the thing it asks of a
reader — verify, don't trust — is what it asks of a contributor too. Most of
what follows exists so a change can be checked rather than believed.

Before anything else: **never put real wallet material in this repository.**
Not in an issue, a pull request, a test fixture, a screenshot, or a commit
message. See [§7](#7-never-submit-real-wallet-material).

## 1. How the project fits together

The site is generated. `build/render.mjs` reads `build/content.mjs` (page prose
and layout) and `build/guides.mjs` (the 56 guides and their diagrams) and writes
into `docs/`, which is what GitHub Pages serves. Not everything there is
generated, though — §4 says which files are and which are maintained by hand.

The Entropy Workshop is the exception worth knowing about. It exists twice: as
`docs/entropy.html` on the site, and as `docs/entropy-offline.html`, a single
self-contained file people are encouraged to download, verify and run on a
machine that never goes online. Its SHA-256 is published beside it and attested
by CI. That is why several rules below are stricter than they would be for an
ordinary static site: someone is going to check the bytes.

```bash
npm run build
```

There is no separate lint or format step, and no `npm test` aggregate. The
guards run inside the build (§5), and each test is its own script.

## 2. Dependencies and reproducibility

*This is the section `secp256k1-wasm/Cargo.toml` refers to.*

**The best dependency is the one not added.** This project ships cryptography
to people protecting savings; every package added is a package whose compromise
becomes ours. Prefer writing the twenty lines.

When something genuinely is needed:

- **Pin exact versions. No ranges, ever.** `^1.2.0` means "whatever the registry
  hands you today", which is not a thing a reproducible build can contain.
- **Commit the lockfile.** `Cargo.lock` is committed here even for the library
  crate, deliberately.
- **Pin container images by digest, not tag.** A tag is a moving pointer; the
  builder is referenced as `ghcr.io/hodldee/selfcustody-wasm-builder@sha256:…`
  because a tag could be repointed under us.
- **Verify inputs by hash before they enter a build context.**
  `secp256k1-wasm/builder/fetch-inputs.sh` checks the SHA-256 of every
  downloaded file on the host first.
- **Vendor the licence with the code.** A new third-party component means its
  full licence text under `build/vendor/<component>/`, a row in
  [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), and an entry in
  [LICENSING-AUDIT.md](LICENSING-AUDIT.md) recording *how* the provenance was
  established — byte match against a pinned release, a locked checksum, or
  documented derivation. "It was on npm" is not provenance.
- **Carry the notice into everything that ships it.** If a licence requires its
  notice to travel, it must reach every distributed file — including
  `entropy-offline.html`, which is downloaded on its own and has to arrive
  complete. `build/tools/assert-notices.mjs` fails the build if a served
  stylesheet loses its notice, because two of them already had.

**Reproducibility is enforced, not hoped for.** CI builds the WebAssembly twice
from clean and compares the raw wasm and wrapper byte-for-byte; it rebuilds the
site and fails if the committed `docs/` differs; and it checks the published
checksum against the artifact. A change that makes the build non-deterministic
will be caught, so it is cheaper to notice it yourself first.

## 3. Building

```bash
npm run build
```

That regenerates the generated files under `docs/` (§4) and runs every guard. It
should be quiet and it should be fast; if it prints a warning, that is a
finding, not noise.

The WebAssembly is a separate, containerised build and is **not** rebuilt by
`npm run build` — the compiled result is committed. Only touch it if you are
changing the crypto engine:

```bash
npm run build:wasm:container
```

## 4. Generated files, and the ones that only look generated

`docs/` is **not** uniformly generated, and treating it as though it were is the
mistake worth avoiding in both directions: editing output that will be
overwritten, or refusing to edit a file that is only ever maintained by hand.

**Fully generated — never hand-edit.** An edit here is overwritten by the next
build, and CI catches the divergence anyway.

| Path | Written by |
| --- | --- |
| `docs/guides/*.html` | `build/render.mjs` from `build/guides.mjs` |
| `docs/entropy.html`, `docs/entropy-offline.html`, `.sha256` | `build/render.mjs` |
| `docs/sitemap.xml` | `build/render.mjs` |
| `docs/assets/vendor/bootstrap-icons/` | `build/subset-icons.mjs` (`npm run icons:subset`) |

**Partly generated — edit with care.** The root pages (`docs/index.html`,
`docs/devices.html`, `docs/guides.html` and their siblings) are hand-maintained
shells. `build/render.mjs` reads each one and replaces only three containers —
`#site-header`, `#main-content`, `#site-footer` — plus the asset-version query
strings. **Everything else in those files, including the entire `<head>`, is
hand-maintained and yours to edit**: title, meta description, Open Graph and
Twitter tags, canonical link, preloads, structured data.

Read `build/render.mjs` before touching one. It aborts rather than guessing if a
page's three containers are missing, or if a page has an empty shell but is not
listed in its `FILES` map — so a new root page has to be registered there.

**Hand-maintained — no generator at all.** `docs/assets/css/`, the images, the
fonts, and `docs/assets/vendor/bootstrap/css/bootstrap.min.css`. That last one
is a *hand-cut subset* of Bootstrap — a fraction of upstream's size, and not the
output of any build step; read
[`build/vendor/bootstrap/README.md`](build/vendor/bootstrap/README.md) before
changing it, and keep the licence header at the top intact —
`assert-notices.mjs` fails the build if it goes.

When you change a source that *does* generate output, run `npm run build` and
**commit the regenerated files in the same commit**. A commit whose source and
output disagree is a commit that does not describe a working state.

Two files have deliberately unusual handling, both recorded in
`.gitattributes`: `docs/entropy-offline.html` and its `.sha256` are stored with
no end-of-line translation, because the published checksum describes exact
bytes and letting git rewrite them made the checksum describe a file nobody
could obtain. Licence texts and Markdown are pinned to LF for the same family
of reason.

If your change alters the offline artifact, its digest changes. Say so in the
pull request (§6) rather than leaving a reviewer to discover it.

## 5. Testing

Every test is a script, and **every committed test runs in CI** —
`npm run test:ci-completeness` fails the build if a test exists that CI does not
run, so adding a test means wiring it into `.github/workflows/build.yml` too.

Run the ones your change touches. The full list is in `package.json`; the ones
people need most often:

```bash
npm run test:entropy            # crypto vectors and the entropy model
npm run test:lifehash           # fingerprint rendering against the reference
npm run test:secp256k1-wasm     # the committed WebAssembly engine
npm run test:wallet-dat         # Bitcoin Core wallet.dat export
npm run test:browser-preflight  # startup behaviour in a browser context
```

Guards that run inside `npm run build`, and what each protects:

| Guard | What it refuses to let through |
| --- | --- |
| `assert-no-fetch.mjs` | any unexpected automatic network request from a page |
| `assert-workshop.mjs` | a Workshop build with a broken checksum, self-test, CSP or clearing behaviour |
| `assert-notices.mjs` | a served stylesheet that has lost its upstream licence notice |
| `assert-glyphs.mjs` | a character the subset font cannot render |

If you are changing behaviour the Workshop depends on and no test covers it,
write the test. This is the part of the repository where "it looked right" is
not a standard anyone should accept.

## 6. Pull requests

Small and focused beats large and comprehensive. One concern per pull request.

The template will ask you to confirm the things that go wrong most often:
relevant tests run, `docs/` regenerated if you touched build sources, provenance
recorded if you added assets or third-party code, and whether the offline
artifact digest changed.

Write the commit message for someone reading it in two years with no memory of
the discussion: what changed, and why it needed to.

## 7. Never submit real wallet material

**Do not put a real seed phrase, private key, passphrase, extended private key,
or real collected entropy anywhere in this project.** Not in an issue, a pull
request, a test fixture, a screenshot, a log paste, a branch, or a commit
message.

This is not a formality. A repository is public, permanent and mirrored;
deleting a comment does not unpublish it, and a rewritten branch does not
unpublish it either. Anything that reaches this repository should be assumed to
be readable by anyone, forever.

Use test vectors instead. BIP-39's published vectors, the all-zeros seed, or any
obviously-fake value make better bug reports anyway, because they let someone
else reproduce what you saw.

If you believe you have already exposed material that protects real funds:
**move the funds first**, to a wallet generated from a new seed, and worry about
the repository afterwards. Nothing here is more urgent than that.

## 8. Reporting a security vulnerability

**Do not open a public issue for a security problem.**

Use GitHub's [private advisory
form](https://github.com/HodlDee/selfcustody/security/advisories/new), or email
**info@selfcustody.ca**. [SECURITY.md](SECURITY.md) has the full policy,
including what the Workshop does and does not claim — several of those claims
are falsifiable, and **a demonstration that one of them is false is a valid
security report, and the most useful kind.**

If your report concerns the offline build, include the SHA-256 of the file you
actually have. It identifies which build you are looking at, and it is the first
thing anyone will ask for.

## 9. Licensing

Contributions are accepted under the licences this repository already uses.
There are **three** regimes for project-authored material, and which one applies
depends on what you are changing:

| What you are contributing | Licence |
| --- | --- |
| Project-authored software | [MIT](LICENSE) |
| Educational writing and original diagrams | [CC BY 4.0](LICENSE-CONTENT.md) |
| Project-authored files under `secp256k1-wasm/` | [The Unlicense](secp256k1-wasm/LICENSE) |

The third catches people out, so it is worth stating plainly: `src/lib.rs`,
`Cargo.toml`, `rust-toolchain.toml` and the `builder/` recipe files were
dedicated to the public domain upstream, and a contribution to them is dedicated
the same way. That is a broader give-away than MIT and it cannot be walked back,
so if you are not willing to place your work in the public domain, do not submit
it there — say so and it can go somewhere else in the tree.

[LICENSING.md](LICENSING.md) maps the whole repository. The split follows what
material *is* rather than which file holds it: `build/guides.mjs` is a module
containing prose, so its code is MIT and its writing is CC BY 4.0.

**By submitting a contribution you agree that:**

- it is licensed under whichever of the three regimes above applies to the
  material you changed, on the same terms as the rest of that material; and
- **you have the right to submit it** — it is your own work, or you have the
  necessary permission, and it is not carrying someone else's copyright,
  licence obligations or employer claim into this repository unrecorded.

There is no separate CLA to sign. If any part of your contribution is not yours
to give, say which part and where it came from, and it can be handled properly
under §2 instead of arriving silently.

**Do not add images without provenance.** Every tracked image has a recorded
origin, and keeping it that way is easier than reconstructing it later. If you
cannot say where an image came from and on what terms, it cannot go in.

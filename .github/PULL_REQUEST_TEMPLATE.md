<!--
Never include real wallet material in a pull request: no seed phrase, private
key, passphrase, or real collected entropy — not in code, tests, fixtures,
screenshots or commit messages. Use published test vectors instead.
See CONTRIBUTING.md §7.
-->

## What this changes, and why

<!-- What a reader in two years needs to know. The why matters more than the what. -->

## Tests

<!-- Name the ones you ran, and paste the relevant output if it is short. -->

```
npm run test:...
```

- [ ] I ran the tests relevant to this change
- [ ] `npm run build` completes with every guard passing
- [ ] If I added a test, I wired it into `.github/workflows/build.yml`
      (`npm run test:ci-completeness` fails otherwise)

## Generated output

`docs/` is generated, never hand-edited. If you changed `build/content.mjs`,
`build/guides.mjs`, the CSS or the renderer, the regenerated output belongs in
the same commit.

- [ ] I changed build sources, and the regenerated `docs/` is committed here
- [ ] Not applicable — this change does not touch build sources

## The offline artifact

`docs/entropy-offline.html` is downloaded and verified against a published
SHA-256, so a changed digest is a real event rather than a detail.

- [ ] The digest is unchanged
- [ ] The digest changed, and `docs/entropy-offline.html.sha256` is updated to
      match. New digest: `________`

<!-- If it changed, say why in one line. An unexplained digest change is the
     thing a reviewer will stop on. -->

## Assets and third-party code

Every tracked image has a recorded origin, and every third-party component has
its licence vendored and its provenance recorded. Keeping that true is much
easier than reconstructing it later.

- [ ] This adds no images and no third-party code
- [ ] It adds images, and I recorded where each came from and on what terms
- [ ] It adds third-party code, and I have:
  - [ ] vendored the full licence text under `build/vendor/<component>/`
  - [ ] added a row to `THIRD_PARTY_NOTICES.md` naming where it ships
  - [ ] recorded in `LICENSING-AUDIT.md` *how* provenance was established —
        byte match against a pinned release, a locked checksum, or documented
        derivation
  - [ ] pinned an exact version and committed the lockfile (`CONTRIBUTING.md` §2)
  - [ ] confirmed the notice reaches every file that ships it, including
        `entropy-offline.html`

## Before requesting review

- [ ] This contains no real seed phrase, private key, passphrase or entropy
- [ ] This is not a security fix that should have gone through the
      [private advisory form](https://github.com/HodlDee/selfcustody/security/advisories/new)

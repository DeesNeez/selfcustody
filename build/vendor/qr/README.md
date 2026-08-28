# QR Code generator (vendored)

`qrcodegen.js` is compiled output, not something to edit. Change `qrcodegen.ts`
only to take a newer upstream, then rebuild.

## Where it came from

Project Nayuki's QR Code generator, MIT licensed:
<https://www.nayuki.io/page/qr-code-generator-library> ·
<https://github.com/nayuki/QR-Code-generator>

    typescript-javascript/qrcodegen.ts
    commit 8329a7108fc22be3e1eec0a9f9318978579e3621  (2024-09-01)

The copyright and permission notice at the head of both files is required by
the licence and must survive any future rebuild. It is why the compile keeps
comments.

## How the .js was produced

    npx --yes -p typescript tsc build/vendor/qr/qrcodegen.ts \
      --target ES2020 --removeComments false

One-time, then trailing spaces are stripped from the generated class-field
lines and the output is committed. That whitespace cleanup is the only change
after compilation. TypeScript is deliberately not a dependency of `npm run
build`: a reader checking the offline file should not need a toolchain to see
what is in it, and the build should not need the network to produce a
byte-identical artifact.

## Why a library here, when the crypto is hand-written

The rest of this tool implements its own primitives from the specifications,
which is defensible because a wrong derivation is silently wrong -- you find
out when the coins are gone. A QR code fails the other way round. A bad one
either will not scan or produces a string the wallet visibly rejects, and the
canonical text is printed beside every code on the page, so nothing here is
trusted that cannot be checked by reading.

Given that, a widely reviewed implementation is a better answer than several
hundred lines of new Reed-Solomon written for this page alone.

## What is not vendored

The upstream demo files, the other language ports, and the minified builds.
Only the source and its compiled output are here, so what ships can be read.

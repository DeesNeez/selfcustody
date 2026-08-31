#!/usr/bin/env bash
# Downloads every input the builder image cannot obtain from signed apt
# metadata, and verifies each against a hash recorded here.
#
# Runs on the host, where CA trust already exists. The base image has none --
# no ca-certificates package and no bundle -- so the two .deb files below are
# the trust bootstrap: without them apt cannot reach the snapshot over HTTPS,
# and it fails quietly, emitting Ign: on every InRelease and exiting zero.
#
# Everything else those two packages need (libssl3t64, debconf, perl-base,
# libc6, libgcc-s1, zlib1g, dpkg, tar, gpgv) is already in the base image, so
# its bytes are covered by the base digest. That was measured, not assumed:
# see build/tools/snapshot-probe.sh.
set -euo pipefail

SNAP="https://snapshot.ubuntu.com/ubuntu/20260824T000000Z"
RUST="https://static.rust-lang.org/dist"
NODE="https://nodejs.org/dist/v22.23.2"
here="$(cd "$(dirname "$0")" && pwd)"
out="$here/inputs"
mkdir -p "$out"

# url<TAB>filename<TAB>sha256
INPUTS=$(cat <<'LIST'
SNAP/pool/main/o/openssl/openssl_3.0.13-0ubuntu3.12_amd64.deb	openssl.deb	321b30ad5a1c3783cb3d73ae439f824f6d3874d76a93a62f4a984959b490aa7b
SNAP/pool/main/c/ca-certificates/ca-certificates_20260601~24.04.1_all.deb	ca-certificates.deb	6bac2a01979e210d9eac1d4d56747ec709ea60654744d66705dc3c36e7629e50
RUST/rust-1.95.0-x86_64-unknown-linux-gnu.tar.xz	rust.tar.xz	2e0338f18ecbaa4a0f631b9e80e8b8e26bb6fe77dd5454fba8a70cf96c1e84a1
RUST/rust-std-1.95.0-wasm32-unknown-unknown.tar.xz	rust-std-wasm32.tar.xz	5587b89ff69623d09e476439d44a24453b4e4ea3d5e0b53a5c0a935151ff3fd1
NODE/node-v22.23.2-linux-x64.tar.xz	node.tar.xz	d60acfe00a2932254bb0ad20e01b0d74397a0875595de719654b214f4b03f307
LIST
)

printf '%s\n' "$INPUTS" | while IFS=$'\t' read -r url name sha; do
  [ -n "$url" ] || continue
  url="${url/#SNAP/$SNAP}"; url="${url/#RUST/$RUST}"; url="${url/#NODE/$NODE}"
  target="$out/$name"
  if [ -f "$target" ] && echo "$sha  $target" | sha256sum -c - >/dev/null 2>&1; then
    echo "cached  $name"
    continue
  fi
  echo "fetch   $name"
  curl -fsSL --retry 3 -o "$target" "$url"
  echo "$sha  $target" | sha256sum -c -
done

echo "all builder inputs verified in $out"

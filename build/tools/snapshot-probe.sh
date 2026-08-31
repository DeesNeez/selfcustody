#!/usr/bin/env bash
# TEMPORARY. Verifies the WASM builder's input set before any Dockerfile
# exists, so that a later image-build failure can only mean the Dockerfile is
# wrong -- not that the snapshot, a version pin or the dependency closure was.
#
# Runs inside a digest-pinned ubuntu:24.04 container. Every version below was
# measured on the runner that produced the two deterministic builds which
# passed the functional vectors; none of it is inferred.
#
# Run it twice: once with no mounts, to learn whether the base image can reach
# an HTTPS archive on its own, and once with the runner's CA bundle mounted so
# the rest of the checks can proceed regardless.
set -eu

SNAP=https://snapshot.ubuntu.com/ubuntu/20260824T000000Z
KEY=/usr/share/keyrings/ubuntu-archive-keyring.gpg
PINS="
clang-18=1:18.1.3-1ubuntu1
libclang-common-18-dev=1:18.1.3-1ubuntu1
llvm-18=1:18.1.3-1ubuntu1
binutils=2.42-4ubuntu2.10
binutils-common=2.42-4ubuntu2.10
libbinutils=2.42-4ubuntu2.10
binutils-x86-64-linux-gnu=2.42-4ubuntu2.10
"

echo "===== base image CA state ====="
echo "NOTE: only meaningful when this runs with no /etc/ssl/certs mount."
ver=$(dpkg-query -W -f='${Version}' ca-certificates 2>/dev/null || true)
if [ -n "$ver" ]; then
  echo "ca-certificates INSTALLED in base image: $ver"
else
  echo "ca-certificates NOT installed in base image"
fi
if [ -e /etc/ssl/certs/ca-certificates.crt ]; then
  echo "CA bundle visible at /etc/ssl/certs/ca-certificates.crt"
else
  echo "NO CA bundle at /etc/ssl/certs/ca-certificates.crt"
fi
test -f "$KEY" && echo "archive keyring present: $KEY"

echo "===== point apt at the immutable snapshot ====="
rm -f /etc/apt/sources.list.d/ubuntu.sources
for pocket in noble noble-updates noble-security; do
  echo "deb [signed-by=$KEY] $SNAP $pocket main universe"
done > /etc/apt/sources.list
cat /etc/apt/sources.list
apt-get update

echo "===== BOOTSTRAP: what the pinned base image lacks for HTTPS ====="
echo "Run against pristine dpkg state, before any toolchain install, so the"
echo "Inst list below is exactly the delta from the base image."
# shellcheck disable=SC2086
apt-get install -s --no-install-recommends ca-certificates openssl \
  | grep '^Inst' | sort

echo "===== BOOTSTRAP: explicit base-image status of likely dependencies ====="
for p in ca-certificates openssl libssl3t64 debconf perl-base libc6 \
         libgcc-s1 zlib1g dpkg tar gpgv; do
  v=$(dpkg-query -W -f='${Version}' "$p" 2>/dev/null || true)
  if [ -n "$v" ]; then
    echo "$p=$v  PROVIDED BY BASE IMAGE (bytes covered by the base digest)"
  else
    echo "$p  ABSENT from base -- needs an explicit pinned .deb"
  fi
done

echo "===== BOOTSTRAP: URLs, sizes and SHA-256 for each missing .deb ====="
BOOT=$(apt-get install -s --no-install-recommends ca-certificates openssl \
  | awk '/^Inst /{print $2}')
echo "closure to fetch: ${BOOT:-<none>}"
for p in $BOOT; do
  apt-get download --print-uris "$p" | sed 's/^/  /'
done

echo "===== BOOTSTRAP: matching entries from the signed Packages metadata ====="
for p in $BOOT; do
  apt-cache show "$p" | awk '
    /^Package: /{pk=$2} /^Version: /{v=$2} /^Filename: /{f=$2} /^Size: /{sz=$2}
    /^SHA256: /{print pk"="v"\n  filename: "f"\n  size:     "sz"\n  sha256:   "$2; exit}
  '
done

echo "===== dependency closure, simulated, --no-install-recommends ====="
# shellcheck disable=SC2086
apt-get install -s --no-install-recommends $PINS | grep '^Inst' | sort

echo "===== real install ====="
# shellcheck disable=SC2086
DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends $PINS

echo "===== measured absolute paths ====="
test -x /usr/lib/llvm-18/bin/clang   && echo "CC path present: /usr/lib/llvm-18/bin/clang"
test -x /usr/bin/x86_64-linux-gnu-ar && echo "AR path present: /usr/bin/x86_64-linux-gnu-ar"
/usr/lib/llvm-18/bin/clang --version | head -1
/usr/bin/x86_64-linux-gnu-ar --version | head -1

echo "===== installed versions ====="
dpkg-query -W -f='${Package}=${Version}\n' \
  clang-18 libclang-common-18-dev llvm-18 \
  binutils binutils-common libbinutils binutils-x86-64-linux-gnu

echo "===== signed metadata retained as evidence ====="
sha256sum /var/lib/apt/lists/*InRelease

echo "===== per-package hashes from the signed indices ====="
# apt-cache reads the indices whatever compression apt chose to store them in;
# globbing /var/lib/apt/lists/*_Packages assumed they were left uncompressed.
for pin in $PINS; do
  apt-cache show "$pin" | awk '
    /^Package: /{p=$2} /^Version: /{v=$2}
    /^SHA256: /{print p"="v"  sha256:"$2; exit}
  '
done

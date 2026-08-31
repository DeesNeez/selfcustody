#!/usr/bin/env bash
# TEMPORARY. Verifies the WASM builder's input set before any Dockerfile
# exists, so that a later image-build failure can only mean the Dockerfile is
# wrong -- not that the snapshot, a version pin or the dependency closure was.
#
# Runs inside a digest-pinned ubuntu:24.04 container. Every version below was
# measured on the runner that produced the two deterministic builds which
# passed the functional vectors; none of it is inferred.
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

echo "===== base image CA state (does the Dockerfile need a CA bootstrap?) ====="
dpkg-query -W -f='ca-certificates=${Version}\n' ca-certificates 2>/dev/null \
  || echo "ca-certificates: NOT INSTALLED in base image"
ls -l /etc/ssl/certs/ca-certificates.crt 2>/dev/null \
  || echo "no CA bundle in base image"
test -f "$KEY" && echo "archive keyring present: $KEY"

echo "===== point apt at the immutable snapshot ====="
rm -f /etc/apt/sources.list.d/ubuntu.sources
for pocket in noble noble-updates noble-security; do
  echo "deb [signed-by=$KEY] $SNAP $pocket main universe"
done > /etc/apt/sources.list
cat /etc/apt/sources.list
apt-get update

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

echo "===== signed metadata and package hashes retained as evidence ====="
sha256sum /var/lib/apt/lists/*InRelease
for pkg in clang-18 libclang-common-18-dev llvm-18 \
           binutils binutils-common libbinutils binutils-x86-64-linux-gnu; do
  awk -v P="$pkg" '
    /^Package: /{pk=$2} /^Version: /{v=$2}
    /^SHA256: /{if (pk==P) print pk"="v"  sha256:"$2}
  ' /var/lib/apt/lists/*_Packages
done

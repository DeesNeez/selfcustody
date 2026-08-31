# The canonical builder for the Entropy Workshop's libsecp256k1 WebAssembly.
#
# Every input is pinned. The base image by digest; the two trust-bootstrap
# .deb files, Rust and Node by SHA-256 verified on the host before they
# entered this build context (secp256k1-wasm/builder/fetch-inputs.sh); the C
# toolchain by exact version from one immutable Ubuntu snapshot, resolved
# through signed archive metadata.
#
# The versions here are not chosen, they are measured. clang 18.1.3 and GNU
# ar 2.42 are what produced the two deterministic builds that passed the
# functional vectors; see build/tools/snapshot-probe.sh for how each was
# established.
FROM ubuntu:24.04@sha256:33ceb71981b602c1a7443a53469e4dba065f7503eab3078a2d7a57a2ab987517

SHELL ["/bin/bash", "-euo", "pipefail", "-c"]

# --- trust bootstrap ---------------------------------------------------------
# The base image carries no CA bundle, so apt cannot fetch over HTTPS yet.
# openssl first: ca-certificates depends on it and its postinst needs it.
COPY builder/inputs/openssl.deb builder/inputs/ca-certificates.deb /tmp/bootstrap/
RUN dpkg -i /tmp/bootstrap/openssl.deb /tmp/bootstrap/ca-certificates.deb \
 && rm -rf /tmp/bootstrap \
 && test -s /etc/ssl/certs/ca-certificates.crt \
 && echo "CA bundle established"

# --- C toolchain from one immutable snapshot ---------------------------------
# xz-utils comes along because the base image ships no xz binary at all, so
# tar cannot unpack the Rust and Node .tar.xz inputs in the next stage.
#
# gcc-13 is here as the *host* linker. secp256k1-sys has a build script, which
# cargo compiles and links for the host before it can emit any wasm at all, and
# a minimal image has no cc. It cannot influence the artifact: the build script
# only decides how clang is invoked for wasm32, and clang emits every byte that
# ends up in the module. Pinned anyway, since everything else here is.
# gcc-13 rather than the gcc metapackage, which exists only in noble while its
# components are in noble-updates -- pinning the component avoids that skew.
ARG SNAPSHOT=https://snapshot.ubuntu.com/ubuntu/20260824T000000Z
RUN rm -f /etc/apt/sources.list.d/ubuntu.sources \
 && for pocket in noble noble-updates noble-security; do \
      echo "deb [signed-by=/usr/share/keyrings/ubuntu-archive-keyring.gpg] ${SNAPSHOT} ${pocket} main universe"; \
    done > /etc/apt/sources.list \
 && apt-get update \
 # apt-get update exits zero when it cannot establish TLS -- it merely Ign's
 # every index. Assert the signed metadata actually arrived.
 && ls /var/lib/apt/lists/ | grep -q 'noble-updates_InRelease' \
 && apt-get install -y --no-install-recommends \
      clang-18=1:18.1.3-1ubuntu1 \
      libclang-common-18-dev=1:18.1.3-1ubuntu1 \
      llvm-18=1:18.1.3-1ubuntu1 \
      binutils=2.42-4ubuntu2.10 \
      binutils-common=2.42-4ubuntu2.10 \
      libbinutils=2.42-4ubuntu2.10 \
      binutils-x86-64-linux-gnu=2.42-4ubuntu2.10 \
      xz-utils=5.6.1+really5.4.5-1ubuntu0.3 \
      liblzma5=5.6.1+really5.4.5-1ubuntu0.3 \
      gcc-13=13.3.0-6ubuntu2~24.04.1 \
      libgcc-13-dev=13.3.0-6ubuntu2~24.04.1 \
 && ln -s /usr/bin/gcc-13 /usr/bin/cc \
 && rm -rf /var/lib/apt/lists/*

# --- Rust 1.95.0 and the wasm32 std, installed offline -----------------------
ENV CARGO_HOME=/usr/local/cargo
ENV PATH=/usr/local/cargo/bin:/usr/local/bin:$PATH
COPY builder/inputs/rust.tar.xz builder/inputs/rust-std-wasm32.tar.xz builder/inputs/node.tar.xz /tmp/dist/
RUN cd /tmp/dist \
 && tar -xf rust.tar.xz && tar -xf rust-std-wasm32.tar.xz && tar -xf node.tar.xz \
 && ./rust-1.95.0-x86_64-unknown-linux-gnu/install.sh \
      --prefix=/usr/local --components=rustc,cargo,rust-std-x86_64-unknown-linux-gnu \
 && ./rust-std-1.95.0-wasm32-unknown-unknown/install.sh --prefix=/usr/local \
 && cp -a node-v22.23.2-linux-x64/. /usr/local/ \
 && cd / && rm -rf /tmp/dist

# --- crate dependencies, resolved once and baked in --------------------------
# Only the manifest and lockfile, so the image pins the dependency set without
# pinning the crate's own sources. --locked means the lockfile decides, and
# cargo verifies each download against its recorded checksum. Ordinary
# verification builds can then run with --offline.
#
# The build context is secp256k1-wasm/, not builder/, because these two files
# live above it and COPY cannot reach outside the context.
COPY Cargo.toml Cargo.lock /seed/secp256k1-wasm/
RUN mkdir -p /seed/secp256k1-wasm/src \
 && echo '// placeholder for cargo fetch' > /seed/secp256k1-wasm/src/lib.rs \
 && cd /seed/secp256k1-wasm && cargo fetch --locked \
 && rm -rf /seed \
 # The build runs as the invoking user so artifacts land host-owned rather
 # than root-owned; the crate cache must be writable by whoever that is.
 && chmod -R a+rwX "$CARGO_HOME"

# --- the toolchain this image is, recorded in the image ----------------------
ENV CC_wasm32_unknown_unknown=/usr/lib/llvm-18/bin/clang
ENV AR_wasm32_unknown_unknown=/usr/bin/x86_64-linux-gnu-ar
RUN { echo "base:  ubuntu:24.04@sha256:33ceb71981b602c1a7443a53469e4dba065f7503eab3078a2d7a57a2ab987517"; \
      echo "snap:  ${SNAPSHOT}"; \
      echo "rustc: $(rustc --version)"; \
      echo "cargo: $(cargo --version)"; \
      echo "node:  $(node --version)"; \
      echo "clang: $(${CC_wasm32_unknown_unknown} --version | head -1)"; \
      echo "ar:    $(${AR_wasm32_unknown_unknown} --version | head -1)"; \
    } > /etc/wasm-builder-provenance \
 && cat /etc/wasm-builder-provenance

WORKDIR /workspace

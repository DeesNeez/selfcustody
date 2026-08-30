/* Minimal classic-script facade over the libsecp256k1 WebAssembly module.

   The compiled bytes are injected immediately before this file by
   entropy-page.mjs. Curve operations cross this boundary as fixed-size byte
   arrays: 32-byte private scalars and SEC-encoded public points. The wrapper
   deliberately exposes only the operations the Workshop uses; it does not
   sign, verify, or generate randomness. */

'use strict';

const EntropySecp256k1 = (() => {
  const decodeBase64 = text => {
    const binary = atob(text);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  };

  let wasm = null;
  const isNode = typeof process !== 'undefined'
    && Boolean(process.versions && process.versions.node);
  const preflightFailed = typeof window !== 'undefined'
    && window.__entropyWorkshopPreflightPassed !== true;
  const wasmBytes = preflightFailed ? null : decodeBase64(SECP256K1_WASM_B64);

  if (isNode) {
    wasm = new WebAssembly.Instance(new WebAssembly.Module(wasmBytes), {}).exports;
  }

  const ready = preflightFailed || isNode
    ? Promise.resolve()
    : WebAssembly.instantiate(wasmBytes, {}).then(result => {
        wasm = result.instance.exports;
      });

  const requireReady = () => {
    if (!wasm) throw new Error('libsecp256k1 WebAssembly is not initialized');
  };

  /* A memory growth detaches old views, so take a fresh view each time. */
  const heap = () => new Uint8Array(wasm.memory.buffer);

  const withInput = (input, fn) => {
    if (!(input instanceof Uint8Array)) throw new TypeError('expected a Uint8Array');
    const ptr = wasm.secp_alloc(input.length);
    heap().set(input, ptr);
    try {
      return fn(ptr);
    } finally {
      /* Private scalars must not remain in reusable linear memory. Public
         points are cleared too, keeping one simple lifetime rule. */
      heap().fill(0, ptr, ptr + input.length);
      wasm.secp_free(ptr, input.length);
    }
  };

  const withOutput = (capacity, fn) => {
    const ptr = wasm.secp_alloc(capacity);
    try {
      const length = fn(ptr);
      return length < 0 ? null : heap().slice(ptr, ptr + length);
    } finally {
      heap().fill(0, ptr, ptr + capacity);
      wasm.secp_free(ptr, capacity);
    }
  };

  const publicKeyCreate = (secret, compressed = true) => {
    requireReady();
    if (!(secret instanceof Uint8Array) || secret.length !== 32) {
      throw new Error('private key must be 32 bytes');
    }
    const result = withInput(secret, key =>
      withOutput(65, out => wasm.secp_pubkey_create(key, out, compressed ? 1 : 0)));
    if (!result) throw new Error('private key is outside the secp256k1 range');
    return result;
  };

  const pointValidate = (point, compressed = true) => {
    requireReady();
    const result = withInput(point, input =>
      withOutput(65, out => wasm.secp_point_validate(
        input, point.length, out, compressed ? 1 : 0
      )));
    if (!result) throw new Error('invalid secp256k1 public point');
    return result;
  };

  const pointAdd = (left, right) => {
    requireReady();
    const result = withInput(left, a => withInput(right, b =>
      withOutput(33, out => wasm.secp_point_add(a, left.length, b, right.length, out))));
    if (!result) throw new Error('secp256k1 point addition failed');
    return result;
  };

  return { ready, publicKeyCreate, pointValidate, pointAdd };
})();

const EntropySecp256k1Ready = EntropySecp256k1.ready;

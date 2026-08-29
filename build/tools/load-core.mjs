/* Loads build/tools/entropy-core.js the way the browser does.

   The core is a classic script, not a module -- the shipped page inlines it in
   a <script> tag, and `type="module"` is not an option because module scripts
   are blocked by CORS on file:// in Chrome, which would break the one thing
   the tool is for. So the tests evaluate the same source in the same way
   rather than importing it, and there is no build-only export path that could
   drift from what actually ships. */
import { readFileSync } from 'node:fs';

export const CORE_PATH = 'build/tools/entropy-core.js';
export const coreSource = () => readFileSync(CORE_PATH, 'utf8');

const wasmPayload = () => {
  const source = readFileSync('build/tools/secp256k1-wasm-b64.js', 'utf8');
  const match = source.match(/export const SECP256K1_WASM_B64\s*=\s*"([A-Za-z0-9+/=]+)";/);
  if (!match) throw new Error('libsecp256k1 WebAssembly payload is malformed');
  return match[1];
};

export const loadCore = () =>
  new Function(
    'SECP256K1_WASM_B64',
    `${readFileSync('build/tools/secp256k1-wasm.js', 'utf8')}\n${coreSource()}\nreturn EntropyCore;`
  )(wasmPayload());

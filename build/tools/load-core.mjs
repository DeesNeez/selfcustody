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

export const loadCore = () =>
  new Function(`${coreSource()}\nreturn EntropyCore;`)();

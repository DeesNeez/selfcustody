/* Tests the browser preflight as the built page runs it: a classic script with
   browser globals, before any Workshop application code. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('build/tools/browser-preflight.js', 'utf8');
const PAGE = '<section class="workbench">wallet controls</section>';

class WorkingUrl {
  static createObjectURL() { return 'blob:test'; }
  static revokeObjectURL() {}
}
class WorkingBlob {}
class MissingBigUint64View {
  constructor(buffer) { this.view = new DataView(buffer); }
  setUint32(...args) { this.view.setUint32(...args); }
}

function run(overrides = {}) {
  const workspace = { innerHTML: PAGE };
  const documentElement = { dataset: {} };
  const document = {
    documentElement,
    querySelector: selector => selector === '.workspace' ? workspace : null,
    createElementNS: overrides.createElementNS === false
      ? undefined : () => ({ setAttribute() {} }),
    createElement: overrides.createElement === false ? undefined : tag => ({
      replaceChildren() {},
      ...(tag === 'dialog' ? { showModal() {}, close() {} } : {})
    })
  };
  const window = {};
  const values = {
    window, document, BigInt,
    TextEncoder, TextDecoder, Uint8Array, DataView,
    Blob: WorkingBlob, URL: WorkingUrl,
    ...overrides
  };
  const originalNormalize = String.prototype.normalize;
  if (Object.hasOwn(overrides, 'normalize')) String.prototype.normalize = overrides.normalize;
  try {
    new Function(...Object.keys(values), source)(...Object.values(values));
  } finally {
    String.prototype.normalize = originalNormalize;
  }
  return { workspace, documentElement, window };
}

function failedNames(workspace) {
  return [...workspace.innerHTML.matchAll(/<tr><td>([^<]+)<\/td><td>Failed<\/td><\/tr>/g)]
    .map(match => match[1]);
}

assert.doesNotMatch(source,
  /crypto\.getRandomValues|Math\.random\s*\(|\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon/);
assert.doesNotMatch(source, /\b\d+n\b/, 'preflight must parse in a browser without BigInt literals');

const healthy = run();
assert.equal(healthy.workspace.innerHTML, PAGE);
assert.equal(healthy.documentElement.dataset.browserChecks, '7');
assert.equal(healthy.documentElement.dataset.browserFailed, '0');
assert.equal(healthy.window.__entropyWorkshopPreflightPassed, true);

for (const [name, overrides] of [
  ['BigInt arithmetic', { BigInt: undefined }],
  ['UTF-8 TextEncoder and TextDecoder', { TextEncoder: undefined }],
  ['String.normalize (NFKD)', { normalize: undefined }],
  ['Typed arrays and DataView', { DataView: undefined }],
  ['Typed arrays and DataView', { DataView: MissingBigUint64View }],
  ['SVG document support', { createElementNS: false }],
  ['Modern DOM controls', { createElement: false }],
  ['Local Blob downloads', { Blob: undefined }]
]) {
  const result = run(overrides);
  assert.deepEqual(failedNames(result.workspace), [name]);
  assert.equal(result.window.__entropyWorkshopPreflightPassed, false);
}

const multiple = run({ BigInt: undefined, Blob: undefined });
assert.deepEqual(failedNames(multiple.workspace), ['BigInt arithmetic', 'Local Blob downloads']);
assert.match(multiple.workspace.innerHTML, /No wallet was produced/);

console.log('browser preflight: healthy host passes; 7 failure paths and combined reporting verified');

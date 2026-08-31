import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('build/tools/beta-warning.js', 'utf8');

function classList(initial = []) {
  const values = new Set(initial);
  return {
    add: value => values.add(value),
    remove: value => values.delete(value),
    contains: value => values.has(value)
  };
}

function element({ hidden = false } = {}) {
  const listeners = {};
  const attrs = new Map();
  return {
    hidden, removed: false, focused: false, classList: classList(),
    addEventListener: (name, fn) => { listeners[name] = fn; },
    dispatch: name => listeners[name]?.({ key: '', preventDefault() {} }),
    focus() { this.focused = true; },
    remove() { this.removed = true; },
    getAttribute: name => attrs.get(name) ?? null,
    setAttribute: (name, value) => attrs.set(name, value),
  };
}

function setup({ stored = null, storageThrows = false } = {}) {
  const overlay = element({ hidden: true });
  const accept = element();
  const elements = {
    'beta-disclaimer': overlay,
    'beta-disclaimer-accept': accept
  };
  const body = { classList: classList(), style: { overflow: '' } };
  const document = {
    body,
    getElementById: id => elements[id] ?? null,
    querySelector: () => null
  };
  const window = {
    matchMedia: () => ({ matches: false })
  };
  let written = null;
  const localStorage = {
    getItem: () => { if (storageThrows) throw new Error('denied'); return stored; },
    setItem: (key, value) => { if (storageThrows) throw new Error('denied'); written = [key, value]; }
  };
  const api = new Function(
    'document', 'window', 'localStorage', 'requestAnimationFrame', 'setTimeout',
    `${source}\nreturn EntropyBetaWarning;`
  )(document, window, localStorage, fn => { fn(); return 0; }, fn => fn());
  return { api, overlay, accept, body, written: () => written };
}

const first = setup();
assert.equal(first.api.init({ version: 'release-1' }), true);
assert.equal(first.overlay.hidden, false);
assert.equal(first.overlay.classList.contains('is-visible'), true);
assert.equal(first.accept.focused, true);
assert.equal(first.body.classList.contains('beta-gate-open'), true);
assert.equal(first.body.style.overflow, 'hidden');
first.accept.dispatch('click');
assert.deepEqual(first.written(), ['selfcustody-entropy-beta-accepted', 'release-1']);
assert.equal(first.overlay.removed, true);
assert.equal(first.body.style.overflow, '');

const remembered = setup({ stored: 'release-1' });
assert.equal(remembered.api.init({ version: 'release-1' }), false);
assert.equal(remembered.overlay.removed, true);

const newRelease = setup({ stored: 'release-1' });
assert.equal(newRelease.api.init({ version: 'release-2' }), true);
assert.equal(newRelease.overlay.hidden, false);

const denied = setup({ storageThrows: true });
assert.equal(denied.api.init({ version: 'release-1' }), true);
denied.accept.dispatch('click');
assert.equal(denied.overlay.removed, true);

assert.doesNotMatch(source, /seed|mnemonic|passphrase|privateKey|getRandomValues|fetch\s*\(/i,
  'the warning controller must not touch secret inputs, randomness, or the network');

console.log('beta warning: first boot, persistence, release bump and storage failure pass');

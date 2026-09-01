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

/* ---- the dialog's shape and its one styling contract --------------------

   The behaviour above runs against a mock DOM, so it cannot see the layout.
   These read the built page instead. Only the parts that would be a
   regression if they changed are pinned: the wording, the order of the
   card's three regions, and -- the point of the redesign -- that the
   acknowledgement wears the download action's own skin rather than a copy of
   it. Spacing and colour values are deliberately not pinned; they are design,
   not contract, and a test that fails on a 2px change is a test people learn
   to ignore. */
const page = readFileSync('docs/entropy.html', 'utf8');
const card = page.match(/<div class="beta-disclaimer-card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
assert.ok(card, 'the built page still contains the acknowledgement card');
const markup = card[0];

assert.match(markup, /<div class="beta-disclaimer-icon">\s*<svg/,
  'the warning triangle leads the card on its own line');
const iconAt = markup.indexOf('beta-disclaimer-icon');
const headingAt = markup.indexOf('beta-disclaimer-title');
const bodyAt = markup.indexOf('beta-disclaimer-body');
const actionAt = markup.indexOf('beta-disclaimer-actions');
assert.ok(iconAt < headingAt && headingAt < bodyAt && bodyAt < actionAt,
  'the card reads icon, heading, warnings, action in that order');

assert.match(markup, /<div class="beta-disclaimer-divider" aria-hidden="true"><\/div>/,
  'the two warnings stay separated by the divider');
assert.match(markup, /<strong>Beta software\.<\/strong> This tool is experimental/,
  'the beta wording is unchanged');
assert.match(markup, /<strong>Never enter an existing recovery phrase into any page<\/strong>/,
  'the recovery-phrase wording is unchanged');

assert.match(markup,
  /<div class="dl-frame">\s*<button class="dl beta-disclaimer-accept" id="beta-disclaimer-accept" type="button"><span>I understand<\/span><\/button>/,
  'the acknowledgement reuses the download frame and skin, and wraps its label');
assert.doesNotMatch(page, /\.beta-disclaimer-accept\s*\{/,
  'the acknowledgement must not carry button styling of its own -- that is how the two drift');

/* The heavier top edge the redesign removed: a 3px orange bar sitting above a
   1px orange border, which read as one uneven side. */
assert.doesNotMatch(page, /\.beta-disclaimer-card::before/,
  'the card has one even border on all four sides');

/* Both buttons share one skin, so reduced motion has to be answered there
   rather than on either one of them. Selectors are scoped at build time, so
   match on the declarations rather than on the authored text. */
const reducedMotion = page
  .split('@media (prefers-reduced-motion: reduce)')
  .find(block => /\.dl\{/.test(block.slice(0, 400)));
assert.ok(reducedMotion, 'the shared action skin has a reduced-motion block');
assert.match(reducedMotion.slice(0, 400), /\.dl\{ transition: none; \}/,
  'reduced motion stops the shared skin transitioning');
assert.match(reducedMotion.slice(0, 400), /\.dl:hover\{ transform: none; \}/,
  'reduced motion removes the two-pixel hover lift');
assert.match(reducedMotion.slice(0, 400), /\.dl::after\{ display: none; \}/,
  'reduced motion removes the shine sweep');

console.log('beta warning: first boot, persistence, release bump, storage failure, dialog structure and shared action skin pass');

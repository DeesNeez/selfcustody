import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('build/tools/entropy-page.mjs', 'utf8');

const stack = name => source.match(new RegExp(`--${name}: ([^;]+);`))?.[1] ?? '';

for (const name of ['workshop-sans', 'workshop-mono']) {
  const value = stack(name);
  for (const family of ['"Segoe UI Symbol"', '"Apple Symbols"', '"Noto Sans Symbols"']) {
    assert.ok(value.includes(family), `${name} is missing the ${family} fallback`);
  }
}

assert.match(stack('workshop-sans').trim(), /, sans-serif$/,
  'the sans stack must retain its generic fallback last');
assert.match(stack('workshop-mono').trim(), /, monospace$/,
  'the monospace stack must retain its generic fallback last');

assert.match(source, /body \{[\s\S]*?font-family: var\(--workshop-sans\);/,
  'ordinary card-suit copy must use the symbol-capable sans stack');
assert.match(source, /input\[type="text"\], textarea \{[\s\S]*?font-family: var\(--workshop-mono\);/,
  'typed card suits must use the symbol-capable monospace stack');
assert.match(source, /\.deal b \{[\s\S]*?font-family: var\(--workshop-mono\);/,
  'recorded card suits must use the symbol-capable monospace stack');
assert.match(source, /\.key\[data-suit\] \{[\s\S]*?font-family: var\(--workshop-sans\);/,
  'card-suit keypad buttons must use the symbol-capable sans stack');

console.log('card suit fonts: explicit local symbol fallbacks cover copy, entry, keypad and deal');

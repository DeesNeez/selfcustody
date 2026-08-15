/* Writes the static HTML in docs/ from build/content.mjs.
   Run:  npm run build

   Only the <body> containers are rewritten -- <head> is left exactly as it is,
   so og: tags, canonicals, JSON-LD and cache-busters stay hand-maintained. */
import { readFileSync, writeFileSync } from 'node:fs';
import { pages, renderHeader, renderFooter } from './content.mjs';

const FILES = {
  home: 'index.html',
  guides: 'guides.html',
  devices: 'devices.html',
  software: 'software.html',
  exchanges: 'exchanges.html',
  dashboard: 'dashboard.html',
  contact: 'contact.html',
  coinkite: 'coinkite.html',
};

/* The whole container block, anchored on the <noscript> that always follows it.
   A non-greedy match on </div> would work on the empty shell but not on an
   already-built file, where the header contains nested divs of its own -- so
   the build has to be greedy here to stay idempotent. */
const SHELL = /<div id="site-header">[\s\S]*<\/div>(?=\s*<noscript)/;

let changed = 0;
for (const [key, file] of Object.entries(FILES)) {
  const path = `docs/${file}`;
  const html = readFileSync(path, 'utf8');
  const page = pages[key] || pages.home;

  if (!SHELL.test(html)) {
    console.error(`  ABORT ${file}: could not find the three containers`);
    process.exit(1);
  }

  const filled =
    `<div id="site-header">${renderHeader(key)}</div>\n` +
    `    <main id="main-content">${page.content}</main>\n` +
    `    <div id="site-footer">${renderFooter()}</div>`;

  const out = html.replace(SHELL, () => filled);
  if (out !== html) {
    writeFileSync(path, out);
    changed++;
  }
  console.log(`  ${file.padEnd(16)} ${Math.round(out.length / 1024)} KB`);
}
console.log(`\n${changed} file(s) written`);

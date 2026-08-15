/* Writes the static HTML in docs/ from build/content.mjs.
   Run:  npm run build

   Only the <body> containers are rewritten -- <head> is left exactly as it is,
   so og: tags, canonicals, JSON-LD and cache-busters stay hand-maintained. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { pages, renderHeader, renderFooter } from './content.mjs';

/* file -> page key. Several files can share a key: lab-demo.html is the same
   dashboard markup wrapped with lab-probe.js. */
const FILES = {
  'index.html': 'home',
  'guides.html': 'guides',
  'devices.html': 'devices',
  'software.html': 'software',
  'exchanges.html': 'exchanges',
  'dashboard.html': 'dashboard',
  'contact.html': 'contact',
  'coinkite.html': 'coinkite',
  'lab-demo.html': 'dashboard',
};

/* The whole container block, anchored on the <noscript> that always follows it.
   A non-greedy match on </div> would work on the empty shell but not on an
   already-built file, where the header contains nested divs of its own -- so
   the build has to be greedy here to stay idempotent. */
const SHELL = /<div id="site-header">[\s\S]*<\/div>(?=\s*<noscript)/;

/* Any page carrying the shell but missing from FILES would be left with three
   empty divs and no script to fill them, so fail loudly rather than ship it. */
const missed = readdirSync('docs')
  .filter(f => f.endsWith('.html') && !f.startsWith('_') && !(f in FILES))
  .filter(f => /<div id="site-header">\s*<\/div>/.test(readFileSync(`docs/${f}`, 'utf8')));
if (missed.length) {
  console.error(`  ABORT: these have an empty shell but are not in FILES: ${missed.join(', ')}`);
  process.exit(1);
}

let changed = 0;
for (const [file, key] of Object.entries(FILES)) {
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

/* The icon font is subset to the glyphs in use, so an icon added later would
   render as a blank box. Catch that here rather than in someone's browser.
   Two names are built by concatenation in site-refresh.js and cannot be found
   by scanning, so they are listed explicitly. */
const iconCss = readFileSync('docs/assets/vendor/bootstrap-icons/bootstrap-icons.css', 'utf8');
const available = new Set([...iconCss.matchAll(/\.(bi-[a-z0-9-]+)::before/g)].map(m => m[1]));

let scan = readFileSync('build/content.mjs', 'utf8') + readFileSync('docs/assets/js/site-refresh.js', 'utf8');
for (const f of readdirSync('docs')) if (f.endsWith('.html') && !f.startsWith('_')) scan += readFileSync(`docs/${f}`, 'utf8');
for (const f of ['docs/assets/css/site-refresh.css', 'docs/assets/css/lab.css', 'docs/lab-probe.js']) {
  try { scan += readFileSync(f, 'utf8'); } catch {}
}

const referenced = new Set(['bi-arrow-up-right', 'bi-arrow-down-right', 'bi-arrow-right']);
for (const m of scan.matchAll(/\bbi-[a-z0-9]+(?:-[a-z0-9]+)*/g)) referenced.add(m[0]);
referenced.delete('bi-arrow');   // truncated match from the concatenations above

const absent = [...referenced].filter(n => !available.has(n));
if (absent.length) {
  console.error(`\n  ABORT: these icons are used but not in the subset font: ${absent.join(', ')}`);
  console.error('  Run "npm run icons:subset", then re-subset the woff2 (see build/subset-icons.mjs).');
  process.exit(1);
}
console.log(`icon check: all ${referenced.size} referenced glyphs present in the subset font`);

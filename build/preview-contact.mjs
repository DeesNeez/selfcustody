/* Renders the REAL contact page -- packages, pricing, booking -- which the
   "Coming soon" holding page in content.mjs shadows.

   Writes docs/_contact-preview.html, which is gitignored, so it can never be
   committed or deployed. docs/contact.html is never touched.

   Run:   npm run preview:contact
   View:  http://localhost:4173/_contact-preview.html
*/
import { readFileSync, writeFileSync } from 'node:fs';
import { pages, renderHeader, renderFooter } from './content.mjs';

const OUT = 'docs/_contact-preview.html';
const SHELL = /<div id="site-header">[\s\S]*<\/div>(?=\s*<noscript)/;

/* content.mjs applies `pages.contact = {holding page}` after defining the real
   one, so the full version is no longer reachable through `pages`. Recover it
   by re-reading the module source and evaluating just that object literal. */
const src = readFileSync('build/content.mjs', 'utf8');
const start = src.indexOf('    contact: {');
if (start === -1) {
  console.error('ABORT: could not find the full contact definition');
  process.exit(1);
}

// walk braces to find the end of the object literal, ignoring those in strings
let depth = 0, i = src.indexOf('{', start), end = -1, tick = false;
for (; i < src.length; i++) {
  const c = src[i];
  if (c === '`' && src[i - 1] !== '\\') tick = !tick;
  if (tick) continue;
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
}
if (end === -1) {
  console.error('ABORT: could not find the end of the contact definition');
  process.exit(1);
}

const helpers = src.slice(src.indexOf('  const externalLink'), src.indexOf('  const pages = {'));
const literal = src.slice(src.indexOf('{', start), end + 1);
const real = (0, eval)(`(() => { ${helpers}\n return ${literal}; })()`);

if (!/#book|packages/.test(real.content)) {
  console.error('ABORT: recovered page does not look like the real contact page');
  process.exit(1);
}

const html = readFileSync('docs/contact.html', 'utf8').replace(
  SHELL,
  () =>
    `<div id="site-header">${renderHeader('contact')}</div>\n` +
    `    <main id="main-content">${real.content}</main>\n` +
    `    <div id="site-footer">${renderFooter()}</div>`
);

writeFileSync(OUT, html);
console.log(`  ${OUT}  ${Math.round(html.length / 1024)} KB`);
console.log('  view at http://localhost:4173/_contact-preview.html');
console.log('  (gitignored -- never committed, never deployed)');

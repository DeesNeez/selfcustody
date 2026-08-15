/* Rewrites bootstrap-icons.css down to the glyphs the site actually uses and
   prints the codepoints so the woff2 can be subset to match.

   Run:  npm run icons:subset

   The list is derived, not hand-maintained: every `bi-*` literal in the built
   HTML, the content module and the runtime, plus DYNAMIC below for the two
   places site-refresh.js concatenates an icon name and static scanning cannot
   see the result. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const VENDOR = 'docs/assets/vendor/bootstrap-icons';
const SRC = `${VENDOR}/bootstrap-icons.css`;

/* site-refresh.js:823  "bi bi-arrow-" + (up ? "up-right" : down ? "down-right" : "right")
   site-refresh.js:1233 "bi bi-arrow-" + (up ? "up" : "down") + "-right"            */
const DYNAMIC = ['bi-arrow-up-right', 'bi-arrow-down-right', 'bi-arrow-right'];

let hay = '';
for (const f of readdirSync('docs')) if (f.endsWith('.html')) hay += readFileSync(`docs/${f}`, 'utf8');
for (const f of ['docs/assets/js/site-refresh.js', 'docs/lab-probe.js',
                 'docs/assets/css/site-refresh.css', 'docs/assets/css/lab.css',
                 'build/content.mjs']) {
  try { hay += readFileSync(f, 'utf8'); } catch {}
}

const used = new Set(DYNAMIC);
for (const m of hay.matchAll(/\bbi-[a-z0-9]+(?:-[a-z0-9]+)*/g)) used.add(m[0]);

const css = readFileSync(SRC, 'utf8');

// name -> codepoint, straight from the stylesheet
const cp = new Map();
for (const m of css.matchAll(/\.(bi-[a-z0-9-]+)::before\s*\{\s*content:\s*"\\([0-9a-f]{4})"/g)) cp.set(m[1], m[2]);

const keep = [...used].filter(n => cp.has(n)).sort();
const missing = [...used].filter(n => !cp.has(n) && n !== 'bi');
if (missing.length) console.log('  note: not real glyph names, ignored ->', missing.join(', '));

const preamble = css.slice(0, css.indexOf('.bi-123::before'));
const rules = keep.map(n => `.${n}::before { content: "\\${cp.get(n)}"; }`).join('\n');
const out = preamble + rules + '\n';

writeFileSync(SRC, out);
console.log(`  ${SRC}`);
console.log(`  ${cp.size} glyph rules -> ${keep.length}   ${Math.round(css.length / 1024)} KB -> ${Math.round(out.length / 1024)} KB`);

// codepoints for pyftsubset
const unicodes = keep.map(n => 'U+' + cp.get(n).toUpperCase()).join(',');
writeFileSync('build/.icon-unicodes.txt', unicodes);
console.log(`  ${keep.length} codepoints written to build/.icon-unicodes.txt`);
console.log('  icons kept: ' + keep.join(' '));

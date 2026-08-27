/* Rewrites the shipped Bootstrap Icons stylesheet and font down to the glyphs
   the site actually uses.

   Run:  npm run icons:subset

   Source is build/vendor/bootstrap-icons/, never the shipped copy. That
   matters: this step used to read and overwrite the same file, which made it
   one-way -- a run could drop a glyph and no run could ever put one back. Two
   glyphs went missing that way (see the note on codepoints below), so the
   subset is now always derived from the pristine upstream and every run
   produces the same output from the same inputs.

   The keep-list is derived, not hand-maintained. Three sources:

     1. `bi-*` class names in the built HTML, the content module, the guide
        library, and the runtime.
     2. Raw `content: "\fXXXX"` codepoints in the stylesheets. These are the
        ones that used to be invisible here -- `.sc-check-list li::before` and
        `.sc-caution-list li::before` set their glyph directly rather than by
        class, so scanning for names alone silently dropped them.
     3. DYNAMIC below, for the two places site-refresh.js concatenates an icon
        name and static scanning cannot see the result.

   Subsetting the font needs fontTools. If it is not installed the stylesheet
   is still written and the exact command to finish the job is printed, which
   is the behaviour this script had before. */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const SRC_DIR = 'build/vendor/bootstrap-icons';
const OUT_DIR = 'docs/assets/vendor/bootstrap-icons';
const SRC_CSS = `${SRC_DIR}/bootstrap-icons.css`;
const SRC_WOFF2 = `${SRC_DIR}/bootstrap-icons.woff2`;
const OUT_CSS = `${OUT_DIR}/bootstrap-icons.css`;
const OUT_FONTS = `${OUT_DIR}/fonts`;

/* Cache-buster on the font URLs. Bumped whenever the glyph set changes, so a
   browser holding the previous subset does not keep serving it against a
   stylesheet that now references a glyph it does not have -- which is the
   failure this whole file exists to prevent. */
const SUBSET_TAG = 'subset-20260825';

/* site-refresh.js:823  "bi bi-arrow-" + (up ? "up-right" : down ? "down-right" : "right")
   site-refresh.js:1233 "bi bi-arrow-" + (up ? "up" : "down") + "-right"            */
const DYNAMIC = ['bi-arrow-up-right', 'bi-arrow-down-right', 'bi-arrow-right'];

const CSS_SOURCES = ['docs/assets/css/site-refresh.css', 'docs/assets/css/block-demo.css'];
const CODE_SOURCES = ['docs/assets/js/site-refresh.js', 'docs/block-probe.js',
                      'build/content.mjs', 'build/guides.mjs'];

const read = f => { try { return readFileSync(f, 'utf8'); } catch { return ''; } };

let hay = '';
for (const f of readdirSync('docs')) if (f.endsWith('.html')) hay += read(`docs/${f}`);
if (existsSync('docs/guides')) {
  for (const f of readdirSync('docs/guides')) hay += read(`docs/guides/${f}`);
}
for (const f of [...CSS_SOURCES, ...CODE_SOURCES]) hay += read(f);

const usedNames = new Set(DYNAMIC);
for (const m of hay.matchAll(/\bbi-[a-z0-9]+(?:-[a-z0-9]+)*/g)) usedNames.add(m[0]);

/* Codepoints written straight into CSS content, which carry no class name to
   find. Kept separate from the names so the report can say where each glyph
   was asked for. */
const usedPoints = new Set();
for (const f of CSS_SOURCES) {
  for (const m of read(f).matchAll(/content:\s*"\\([0-9a-fA-F]{4})"/g)) {
    usedPoints.add(m[1].toLowerCase());
  }
}

const css = readFileSync(SRC_CSS, 'utf8');

/* name -> codepoint, and back, straight from the upstream stylesheet. */
const cp = new Map();
const names = new Map();
for (const m of css.matchAll(/\.(bi-[a-z0-9-]+)::before\s*\{\s*content:\s*"\\([0-9a-f]{4})"/g)) {
  cp.set(m[1], m[2]);
  if (!names.has(m[2])) names.set(m[2], m[1]);
}

const keep = [...usedNames].filter(n => cp.has(n));
for (const point of usedPoints) {
  const name = names.get(point);
  if (name && !keep.includes(name)) keep.push(name);
}
keep.sort();

const missing = [...usedNames].filter(n => !cp.has(n) && n !== 'bi');
if (missing.length) console.log('  note: not real glyph names, ignored ->', missing.join(', '));

const orphanPoints = [...usedPoints].filter(p => !names.has(p));
if (orphanPoints.length) {
  console.error(`\n  ABORT: CSS asks for codepoints that are not in ${SRC_CSS}: ${orphanPoints.map(p => 'U+' + p.toUpperCase()).join(', ')}`);
  process.exit(1);
}

/* The preamble is rebuilt rather than sliced out of upstream, so the subset
   tag on the font URLs is set here in one place instead of being hand-edited
   into the output after every run. */
const preamble = css
  .slice(0, css.indexOf('.bi-123::before'))
  .replace(/(bootstrap-icons\.woff2?)\?[^")]*/g, `$1?${SUBSET_TAG}`);

const rules = keep.map(n => `.${n}::before { content: "\\${cp.get(n)}"; }`).join('\n');
writeFileSync(OUT_CSS, preamble + rules + '\n');

console.log(`  ${OUT_CSS}`);
console.log(`  ${cp.size} glyph rules -> ${keep.length}   ${Math.round(css.length / 1024)} KB -> ${Math.round((preamble.length + rules.length) / 1024)} KB`);
if (usedPoints.size) {
  console.log(`  by codepoint in CSS: ${[...usedPoints].map(p => `U+${p.toUpperCase()} (${names.get(p)})`).join(', ')}`);
}

const unicodes = keep.map(n => 'U+' + cp.get(n).toUpperCase()).join(',');
writeFileSync('build/.icon-unicodes.txt', unicodes);

/* Subset the font itself. pyftsubset is the same tool either way; invoking it
   as a module avoids depending on the console script being on PATH. */
const subset = (flavor, out) => spawnSync('python', [
  '-m', 'fontTools.subset', SRC_WOFF2,
  `--unicodes=${unicodes}`,
  `--flavor=${flavor}`,
  `--output-file=${out}`
], { encoding: 'utf8' });

const woff2 = subset('woff2', `${OUT_FONTS}/bootstrap-icons.woff2`);
if (woff2.error || woff2.status !== 0) {
  console.log('\n  fontTools not available, so the stylesheet was written but the font was not.');
  console.log('  Finish with, from the repo root:');
  console.log(`    python -m fontTools.subset ${SRC_WOFF2} --unicodes-file=build/.icon-unicodes.txt --flavor=woff2 --output-file=${OUT_FONTS}/bootstrap-icons.woff2`);
  console.log(`    python -m fontTools.subset ${SRC_WOFF2} --unicodes-file=build/.icon-unicodes.txt --flavor=woff  --output-file=${OUT_FONTS}/bootstrap-icons.woff`);
  process.exit(0);
}

const woff = subset('woff', `${OUT_FONTS}/bootstrap-icons.woff`);
if (woff.status !== 0) {
  console.error(`\n  ABORT: writing the woff failed\n${woff.stderr}`);
  process.exit(1);
}

const kb = f => `${Math.round(readFileSync(f).length / 1024)} KB`;
console.log(`  ${OUT_FONTS}/bootstrap-icons.woff2   ${kb(`${OUT_FONTS}/bootstrap-icons.woff2`)}`);
console.log(`  ${OUT_FONTS}/bootstrap-icons.woff    ${kb(`${OUT_FONTS}/bootstrap-icons.woff`)}`);
console.log(`  ${keep.length} glyphs kept: ${keep.join(' ')}`);

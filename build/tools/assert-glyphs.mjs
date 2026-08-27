/* Build guard: no page may use a character the webfonts cannot draw.

   The two families are subset to the characters the site actually uses, which
   keeps them at 15 KB and 27 KB instead of 53 KB and 145 KB. The cost of that
   trade is a failure mode with no warning: write a character outside the
   subset and it renders as a blank box, or silently swaps to whatever face the
   operating system offers instead. Nothing errors. You just have to notice.

   That was not hypothetical. The subsets were originally cut for the Entropy
   Workshop alone, and when the same files were reused site-wide the copyright
   sign in every footer, an accented e in one guide and a vulgar fraction in
   another fell outside them.

   A page is what it loads, not just what it contains, so this follows the same
   local asset graph the fetch guard walks. Before it did, characters painted
   from shared assets were invisible to a guard reporting full coverage: the
   hair space and the almost-equal sign built into strings in site-refresh.js,
   and the minus sign in two `content:` rules in site-refresh.css.

   Some characters are genuinely absent upstream -- neither Jost nor Open Sans
   contains a check mark, a half-filled circle or the card suits, in any
   weight. Those are listed as knownFallback in coverage.json and skipped,
   because a system face has always drawn them and nothing short of a different
   typeface can change that. */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const COVERAGE = 'build/vendor/fonts/coverage.json';

/* Control characters and zero-width marks are never drawn. */
const IGNORE = new Set([0x09, 0x0a, 0x0d, 0x200B, 0x200C, 0x200D, 0xFEFF]);

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', rarr: '→',
  larr: '←', middot: '·', times: '×', copy: '©',
  reg: '®', trade: '™', lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”', bull: '•', deg: '°',
  frac12: '½', minus: '−', hyphen: '‐', para: '¶'
};

/* An entity or a source escape is a character by the time anyone sees it. */
function decode(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+\d*);/gi, (m, name) => NAMED[name] ?? NAMED[name.toLowerCase()] ?? m)
    .replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u\{([0-9a-f]+)\}/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

/* What a stylesheet paints: generated content only. Selectors, colours, font
   names and url() values are not drawn as text. */
function cssText(css) {
  const out = [];
  for (const m of css.matchAll(/content\s*:\s*(["'])((?:\\.|(?!\1).)*)\1/g)) out.push(m[2]);
  return out.join(' ');
}

/* What a script paints: its quoted strings. Broad on purpose -- a false
   positive costs one line in coverage.json, a false negative ships a blank
   box. Comments are stripped first, so prose about a breakpoint is not
   mistaken for copy: site-refresh.css alone carries four comments naming
   characters it never renders. */
function scriptText(js) {
  const code = js
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, '$1 ');
  const out = [];
  for (const m of code.matchAll(/(["'`])((?:\\.|(?!\1).)*)\1/g)) out.push(m[2]);
  return out.join(' ');
}

/* Text a page paints from its own markup. */
function pageText(html) {
  const out = [];

  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) out.push(cssText(m[1]));
  for (const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) out.push(scriptText(m[1]));

  const body = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');

  /* Attribute values a person is shown. Others are machine-facing. */
  for (const m of body.matchAll(/\b(?:alt|title|aria-label|placeholder|content)\s*=\s*"([^"]*)"/gi)) {
    out.push(m[1]);
  }
  out.push(body.replace(/<[^>]+>/g, ' '));

  return out.join(' ');
}

/* Local stylesheets and scripts a page pulls in. Absolute and data URLs are
   somebody else's bytes; anything relative resolves against the page. */
function localAssets(html, dir) {
  const out = [];
  const add = url => {
    if (!url) return;
    if (/^(?:https?:|data:|blob:|#|\/\/)/i.test(url)) return;
    const file = join(dir, url.split('?')[0].split('#')[0]);
    if (existsSync(file) && statSync(file).isFile()) out.push(file);
  };

  for (const m of html.matchAll(/<script\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi)) add(m[1]);

  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const rel = (tag.match(/\brel\s*=\s*["']([^"']*)["']/i) || [, ''])[1].toLowerCase();
    /* rel can carry several tokens; only the stylesheet one brings text. */
    if (!rel.split(/\s+/).includes('stylesheet')) continue;
    const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if (href) add(href[1]);
  }

  return out;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.html$/i.test(entry)) out.push(full);
  }
  return out;
}

export function assertGlyphCoverage(root = 'docs') {
  const coverage = JSON.parse(readFileSync(COVERAGE, 'utf8'));
  const covered = new Set(coverage.codepoints);
  const fallback = new Set(coverage.knownFallback.codepoints);

  const pages = walk(root);
  const missing = new Map();       /* codepoint -> Set(where) */
  const seenAssets = new Set();    /* shared assets are read once */

  const scan = (text, where) => {
    for (const ch of decode(text)) {
      const cp = ch.codePointAt(0);
      if (cp < 0x20 || IGNORE.has(cp)) continue;
      if (covered.has(cp) || fallback.has(cp)) continue;
      if (!missing.has(cp)) missing.set(cp, new Set());
      missing.get(cp).add(where);
    }
  };

  for (const file of pages) {
    const name = relative(root, file).replace(/\\/g, '/');
    const html = readFileSync(file, 'utf8');
    scan(pageText(html), name);

    for (const asset of localAssets(html, dirname(file))) {
      if (seenAssets.has(asset)) continue;
      seenAssets.add(asset);
      const body = readFileSync(asset, 'utf8');
      const text = /\.css$/i.test(asset) ? cssText(body) : scriptText(body);
      scan(text, relative(root, asset).replace(/\\/g, '/'));
    }
  }

  if (missing.size) {
    console.error('\nABORT: characters used on the site are not in the webfont subsets.\n');
    for (const [cp, where] of [...missing].sort((a, b) => a[0] - b[0])) {
      const list = [...where].sort();
      const shown = list.slice(0, 3).join(', ') + (list.length > 3 ? ` +${list.length - 3} more` : '');
      console.error(`  U+${cp.toString(16).toUpperCase().padStart(4, '0')}  ${String.fromCodePoint(cp)}   ${shown}`);
    }
    console.error('\nThese render as blank boxes, or silently in another face. Either re-subset');
    console.error('the fonts to include them (build/vendor/fonts/README.md), or -- if neither');
    console.error('typeface contains them -- add them to knownFallback in coverage.json with a');
    console.error('reason.\n');
    process.exit(1);
  }

  console.log(`glyph check: ${pages.length} pages and ${seenAssets.size} shared assets, every character covered or a known fallback`);
}

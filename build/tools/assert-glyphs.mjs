/* Build guard: no page may use a character the webfonts cannot draw.

   The two families are subset to the characters the site actually uses, which
   keeps them at 14 KB and 26 KB instead of 53 KB and 145 KB. The cost of that
   trade is a failure mode with no warning: write a character outside the
   subset and it renders as a blank box, or silently swaps to whatever face the
   operating system offers instead. Nothing errors. You just have to notice.

   That was not hypothetical. The subsets were originally cut for the Entropy
   Workshop alone, and when the same files were reused site-wide the copyright
   sign in every footer and the accented e in one guide fell outside them.

   Some characters are genuinely absent upstream -- neither Jost nor Open Sans
   contains a check mark, a half-filled circle or the card suits, in any
   weight. Those are listed as knownFallback in coverage.json and skipped here,
   because a system face has always drawn them and nothing can change that
   short of a different typeface. */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const COVERAGE = 'build/vendor/fonts/coverage.json';

/* Text that will actually be painted: element content, and the strings the
   page builds at runtime. Script and style bodies are excluded -- they are
   code, not copy -- except for the quoted strings a script inserts into the
   DOM, which are copy in every sense that matters here. */
function renderedText(html) {
  let out = [];

  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);

  /* CSS generated content is painted. url() and font names are not. */
  for (const css of styles) {
    for (const m of css.matchAll(/content\s*:\s*(["'])((?:\\.|(?!\1).)*)\1/g)) out.push(m[2]);
  }

  /* Runtime strings: anything quoted that reaches textContent, a label, a
     title, or an array of key faces. Broad on purpose -- a false positive
     costs one entry in coverage.json, a false negative ships a blank box. */
  for (const js of scripts) {
    for (const m of js.matchAll(/(["'`])((?:\\.|(?!\1).){2,})\1/g)) out.push(m[2]);
  }

  let body = html;
  body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ');
  body = body.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
  /* Attribute values that are shown to someone: alt, title, aria-label,
     placeholder. Other attributes are machine-facing. */
  const shown = [...body.matchAll(/\b(?:alt|title|aria-label|placeholder|content)\s*=\s*"([^"]*)"/gi)].map(m => m[1]);
  body = body.replace(/<[^>]+>/g, ' ');
  out.push(body, ...shown);

  return out.join(' ');
}

const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', rarr: '→',
  larr: '←', middot: '·', times: '×', copy: '©',
  reg: '®', trade: '™', lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”', bull: '•', deg: '°',
  frac12: '½', minus: '−', hyphen: '‐', para: '¶'
};

function decode(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+\d*);/gi, (m, name) => NAMED[name] ?? NAMED[name.toLowerCase()] ?? m)
    /* A JS source escape is a character once the string is built. */
    .replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u\{([0-9a-f]+)\}/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
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

  /* Control characters and layout whitespace are never drawn. */
  const ignore = new Set([0x09, 0x0a, 0x0d, 0x200B, 0x200C, 0x200D, 0xFEFF]);

  const missing = new Map();   /* codepoint -> Set(page) */
  for (const file of walk(root)) {
    const name = relative(root, file).replace(/\\/g, '/');
    const text = decode(renderedText(readFileSync(file, 'utf8')));
    for (const ch of text) {
      const cp = ch.codePointAt(0);
      if (cp < 0x20 || ignore.has(cp)) continue;
      if (covered.has(cp) || fallback.has(cp)) continue;
      if (!missing.has(cp)) missing.set(cp, new Set());
      missing.get(cp).add(name);
    }
  }

  if (missing.size) {
    console.error('\nABORT: characters used on the site are not in the webfont subsets.\n');
    for (const [cp, pages] of [...missing].sort((a, b) => a[0] - b[0])) {
      const where = [...pages].sort();
      console.error(`  U+${cp.toString(16).toUpperCase().padStart(4, '0')}  ${String.fromCodePoint(cp)}   ${where.slice(0, 3).join(', ')}${where.length > 3 ? ` +${where.length - 3} more` : ''}`);
    }
    console.error('\nThese will render as blank boxes. Either re-subset the fonts to include');
    console.error('them (build/vendor/fonts/README.md), or -- if the typefaces do not contain');
    console.error('them at all -- add them to knownFallback in coverage.json with a reason.\n');
    process.exit(1);
  }

  console.log(`glyph check: every character on ${walk(root).length} pages is covered or a known fallback`);
}

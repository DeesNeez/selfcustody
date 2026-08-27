/* Build guard: nothing in docs/ may fetch from somewhere it should not.

   This exists because of a bug that survived a long time and was invisible to
   every test we had. The Entropy Workshop's site build carried the same three
   Google Fonts tags as the rest of the site. Opened from file:// -- the thing
   a reader does after downloading it -- it printed "this copy is running
   offline", in green, while three requests went to Google. Nothing failed. The
   page simply said something untrue at the moment someone was deciding whether
   to trust it.

   So the rule is enforced at build time, and it is two different rules:

     offline build   no automatic request at all, not even a relative one.
                     Everything it needs is inline or a data: URI.

     everything else relative requests are fine and necessary. An automatic
                     request to another origin is not, unless it is listed in
                     ALLOWED below with a reason.

   What it does NOT flag matters as much. A click-through <a href> to a
   specification, a canonical link, an og:image URL in metadata -- none of
   those fetch anything on load, and the offline file is full of the first
   kind on purpose. Banning the string "https://" would be easy, wrong, and
   would train people to work around the guard. So this looks at the surfaces
   that actually cause a fetch. */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

/* Automatic requests we accept from a page's own markup, and why. Anything
   not listed is a failure. */
const ALLOWED = {
  /* Both pages preconnect in their own <head>, ahead of the calls the shared
     script makes below. */
  'dashboard.html': ['https://mempool.space'],
  'block-demo.html': ['https://mempool.space']
};

/* Origins the shared site script may reach.

   Kept separate from ALLOWED because assets/js/site-refresh.js is loaded by
   every page and decides what to call at runtime from what it finds in the
   DOM -- the glossary fetch only runs where there is a glossary, the price
   calls only where there is a dashboard. Attributing them page by page from
   the source would be guesswork, so they are declared once, here, as the set
   the shared script is permitted to reach at all.

   Every one is a public read-only endpoint called with no key and no
   identifier attached.

   The Workshop is not an exception that needs listing: it loads the same
   script, and its CSP says connect-src 'none', so none of these can fire
   there whatever the script contains. */
const SHARED_SCRIPT_ORIGINS = {
  'https://mempool.space': 'blocks, fees and mempool state for the dashboard',
  'https://api.kraken.com': 'spot price for the dashboard',
  'https://api.alternative.me': 'fear and greed index for the dashboard',
  'https://api.frankfurter.dev': 'USD to CAD, so the price can be shown in local currency',
  'https://btclexicon.com': 'the glossary term list'
};

/* Every element attribute that makes the browser fetch without being clicked.
   <link> is the awkward one: rel=stylesheet/preload/prefetch/preconnect/
   dns-prefetch/icon/manifest/modulepreload all reach out, while rel=canonical
   and rel=alternate do not. */
const FETCHING_LINK_RELS = new Set([
  'stylesheet', 'preconnect', 'dns-prefetch', 'preload', 'modulepreload',
  'prefetch', 'icon', 'shortcut icon', 'apple-touch-icon', 'apple-touch-icon-precomposed',
  'manifest', 'prerender'
]);

const findAll = (html, re) => [...html.matchAll(re)];

/* Returns [{ url, why }] for everything the page fetches on load. */
function autoFetched(html) {
  const found = [];
  /* A fragment reference points inside the document and fetches nothing.
     Inline SVG gradients inside a data: URI arrive percent-encoded, so "%23a"
     is the same thing as "#a" and has to be excluded too -- the guard's first
     run flagged four of them in the offline build. */
  const add = (url, why) => {
    const u = (url || '').trim();
    if (!u || u.startsWith('#') || u.toLowerCase().startsWith('%23')) return;
    found.push({ url: u, why });
  };

  for (const m of findAll(html, /<link\b([^>]*)>/gi)) {
    const attrs = m[1];
    const rel = (attrs.match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1] || '').toLowerCase().trim();
    if (!FETCHING_LINK_RELS.has(rel)) continue;
    add(attrs.match(/\bhref\s*=\s*["']([^"']*)["']/i)?.[1], `<link rel="${rel}">`);
  }

  for (const [attr, why] of [['src', 'src'], ['poster', 'poster'], ['data', '<object data>']]) {
    const re = new RegExp(`<(?:script|img|iframe|frame|audio|video|source|track|embed|object|input)\\b[^>]*\\b${attr}\\s*=\\s*["']([^"']*)["']`, 'gi');
    for (const m of findAll(html, re)) add(m[1], why);
  }

  for (const m of findAll(html, /\bsrcset\s*=\s*["']([^"']*)["']/gi)) {
    for (const part of m[1].split(',')) add(part.trim().split(/\s+/)[0], 'srcset');
  }

  /* CSS, inline or in a file: @import and every url() that is not a data: URI. */
  for (const m of findAll(html, /@import\s+(?:url\()?["']?([^"')]+)/gi)) add(m[1], '@import');
  for (const m of findAll(html, /url\(\s*["']?(?!data:)([^"')]+)/gi)) add(m[1], 'css url()');

  /* Runtime. Matching source text, not behaviour -- a determined author can
     always defeat this, but it catches the accident, which is the point. */
  const RUNTIME = [
    [/\bfetch\s*\(\s*["'`]([^"'`]+)/g, 'fetch()'],
    [/\.open\s*\(\s*["'][A-Z]+["']\s*,\s*["'`]([^"'`]+)/g, 'XMLHttpRequest'],
    [/new\s+WebSocket\s*\(\s*["'`]([^"'`]+)/g, 'WebSocket'],
    [/new\s+EventSource\s*\(\s*["'`]([^"'`]+)/g, 'EventSource'],
    [/new\s+(?:Worker|SharedWorker)\s*\(\s*["'`]([^"'`]+)/g, 'Worker'],
    [/navigator\.serviceWorker\.register\s*\(\s*["'`]([^"'`]+)/g, 'service worker'],
    [/sendBeacon\s*\(\s*["'`]([^"'`]+)/g, 'sendBeacon'],
    [/\bimport\s*\(\s*["'`]([^"'`]+)/g, 'dynamic import()'],
    [/new\s+Image\s*\([^)]*\)\s*\.\s*src\s*=\s*["'`]([^"'`]+)/g, 'new Image().src']
  ];
  for (const [re, why] of RUNTIME) for (const m of findAll(html, re)) add(m[1], why);

  return found;
}

const originOf = url => url.match(/^(?:https?:)?\/\/[^/]+/i)?.[0].replace(/^\/\//, 'https://') || null;

/* Any absolute origin named in a script or stylesheet.

   Markup and code need different rules. In markup, most external URLs are
   click-through links that fetch nothing, so the guard looks only at the
   attributes that actually cause a request. In a script that reasoning
   inverts: a URL literal is there to be called, and matching only the ones
   written directly inside fetch() misses almost everything real code does.
   Both of the dashboard's forms escaped that: one wraps the call
   (fetchJSON("https://...")), the other builds the URL into a variable first.

   So for scripts the rule is blunter and stricter: every external origin
   mentioned must be declared. Over-reporting a URL that turns out to be a
   link target costs one line of documentation. Under-reporting costs exactly
   what happened here -- five origins the site calls, past a guard whose whole
   job was to notice them. */
/* XML namespaces are identifiers that happen to look like URLs. No browser
   ever dereferences xmlns="http://www.w3.org/2000/svg", and every inline SVG
   on the site carries one. Excluded rather than declared as an allowed
   origin, because calling it a permitted request would be false. */
const NAMESPACE_ORIGINS = new Set(['https://www.w3.org']);

function scriptOrigins(text) {
  const found = new Set();
  for (const m of text.matchAll(/https?:\/\/[a-z0-9.-]+/gi)) {
    const origin = m[0].toLowerCase().replace(/^http:/, 'https:');
    if (!NAMESPACE_ORIGINS.has(origin)) found.add(origin);
  }
  return [...found];
}

/* Local scripts and stylesheets a page pulls in. Their contents are as much a
   part of what the page fetches as its own markup, and until this existed the
   guard could not see any of it: the dashboard's calls live in
   assets/js/site-refresh.js, so four external origins passed a guard whose
   entire job was to notice them. The offline build was never affected -- it
   inlines everything -- which is exactly why the gap went unnoticed. */
function localAssets(html, dir) {
  const out = [];
  const add = url => {
    if (!url || /^(https?:|data:|blob:|#|\/\/)/i.test(url)) return;
    const file = join(dir, url.split('?')[0].split('#')[0]);
    if (existsSync(file) && statSync(file).isFile()) out.push(file);
  };
  for (const m of html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']*)["']/gi)) add(m[1]);
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = (m[0].match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1] || '').toLowerCase();
    if (rel !== 'stylesheet') continue;
    add(m[0].match(/\bhref\s*=\s*["']([^"']*)["']/i)?.[1]);
  }
  return out;
}

function checkFile(path, name) {
  const html = readFileSync(path, 'utf8');
  const problems = [];
  const allowed = ALLOWED[name] || [];

  /* Everything the page loads is scanned by the stricter script rule. */
  for (const asset of localAssets(html, dirname(path))) {
    const where = relative('docs', asset).replace(/\\/g, '/');
    for (const origin of scriptOrigins(readFileSync(asset, 'utf8'))) {
      if (!(origin in SHARED_SCRIPT_ORIGINS)) {
        problems.push(`${where} names ${origin}, which is not declared`);
      }
    }
  }

  for (const { url, why } of autoFetched(html)) {
    const origin = originOf(url);
    if (name === 'entropy-offline.html') {
      /* The strict one: nothing at all, relative included. */
      if (!/^(data:|blob:)/i.test(url)) {
        problems.push(`${why} -> ${url}  (the offline build must fetch nothing)`);
      }
      continue;
    }
    if (!origin) continue;                                   /* relative: fine */
    if (allowed.some(a => origin.toLowerCase() === a.toLowerCase())) continue;
    problems.push(`${why} -> ${url}`);
  }
  return problems;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.html$/i.test(entry)) out.push(full);
  }
  return out;
}

export function assertNoUnexpectedFetches(root = 'docs') {
  const failures = [];
  for (const file of walk(root)) {
    const name = relative(root, file).replace(/\\/g, '/');
    const problems = checkFile(file, name.split('/').pop());
    if (problems.length) failures.push([name, problems]);
  }

  if (failures.length) {
    console.error('\nABORT: pages fetch from somewhere they should not.\n');
    for (const [name, problems] of failures) {
      console.error(`  ${name}`);
      for (const p of problems) console.error(`     ${p}`);
    }
    console.error('\nIf a request is intentional, add its origin to ALLOWED (page markup)');
    console.error('or SHARED_SCRIPT_ORIGINS (shared script) in');
    console.error('build/tools/assert-no-fetch.mjs, with a reason beside it.\n');
    process.exit(1);
  }

  const pages = walk(root).length;
  console.log(`fetch guard: ${pages} pages, no unexpected automatic requests`);
}

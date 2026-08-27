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
/* Which local script may name which external origin, and why.

   Permission belongs to a file, not to an origin in the abstract. A single
   allowlist applied to every asset meant a stylesheet could carry
   background-image: url("https://api.kraken.com/pixel") and pass, because an
   API was permitted somewhere else entirely -- a real automatic request, waved
   through. Any file not listed here may name no external origin at all.

   The rule for a script is deliberately blunter than for markup: every origin
   it names must be declared, whether or not the guard can see a call. Real
   code builds URLs in variables and wraps its own fetch helper, and matching
   only literals inside fetch() missed every one of the dashboard's. The cost
   is that a URL in a comment also has to be written down, which is a line of
   documentation rather than a defect.

   Every endpoint below is a public read-only one, called with no key and no
   identifier attached. */
const SCRIPT_ORIGINS = {
  'assets/js/site-refresh.js': {
    'https://mempool.space': 'blocks, fees and mempool state for the dashboard',
    'https://api.kraken.com': 'spot price for the dashboard',
    'https://api.alternative.me': 'fear and greed index for the dashboard',
    'https://api.frankfurter.dev': 'USD to CAD, so the price can be shown in local currency',
    'https://btclexicon.com': 'the glossary term list'
  },
  /* Instrumentation for block-demo.html, which is not part of the site proper.
     It wraps fetch to fake a confirmation on demand and never calls out itself;
     the origin appears in a comment naming the endpoint it intercepts. */
  'block-probe.js': {
    'https://mempool.space': 'named in a comment describing the request it wraps'
  }
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
    /* rel carries a token list, not one value. Comparing the whole attribute
       against a set meant rel="preload stylesheet" matched nothing and walked
       past a real fetch. Any single fetching token is enough. */
    const rel = (attrs.match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1] || '').toLowerCase().trim();
    const tokens = rel.split(/\s+/).filter(Boolean);
    if (!tokens.some(token => FETCHING_LINK_RELS.has(token))) continue;
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
const NAMESPACE_ORIGINS = new Set([
  'https://www.w3.org',      /* xmlns on every inline SVG */
  'https://schema.org'       /* JSON-LD @context; vocabulary identifier, not a URL to load */
]);

/* Our own origin. It appears in code for one reason: the offline build
   rewrites its relative links to absolute ones, so a file saved to a USB stick
   still has somewhere to point. Those are anchors -- following one is a
   decision to leave the tool -- and the same string appears in canonical tags
   and JSON-LD, which are metadata. None of it is fetched on load.

   Declared rather than ignored, so that if something ever does call our own
   origin automatically it still has to be written down here first. */
const SELF_ORIGIN = 'https://selfcustody.ca';

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
    if (!rel.split(/\s+/).includes('stylesheet')) continue;
    add(m[0].match(/\bhref\s*=\s*["']([^"']*)["']/i)?.[1]);
  }
  return out;
}

/* Local assets, plus anything they @import, to a fixed depth. Nothing on the
   site uses @import today; this exists so that adding one does not quietly
   move a stylesheet out of the guard's view. */
function assetGraph(html, dir, depth = 4) {
  const seen = new Set();
  const queue = localAssets(html, dir).map(file => [file, depth]);

  while (queue.length) {
    const [file, left] = queue.shift();
    if (seen.has(file)) continue;
    seen.add(file);
    if (left <= 0 || !/\.css$/i.test(file)) continue;

    const css = readFileSync(file, 'utf8');
    for (const m of css.matchAll(/@import\s+(?:url\()?\s*["']?([^"')\s]+)/gi)) {
      const url = m[1];
      if (/^(?:https?:|data:|\/\/)/i.test(url)) continue;
      const next = join(dirname(file), url.split('?')[0]);
      if (existsSync(next) && statSync(next).isFile()) queue.push([next, left - 1]);
    }
  }
  return [...seen];
}

/* One asset, under the rule that fits what it is.

   The shared script is the one file permitted to reach the declared APIs,
   because it is the one file that calls them. Any other asset gets no
   exemption: a stylesheet has no business naming an external origin, and a
   CSS url() is a fetch the moment the rule matches.

   Scanned once for the whole site rather than once per page that links it.
   The first version of this ran inside the per-page loop, so a single bad line
   in site-refresh.css reported itself seventy times -- which buries the one
   other thing a build failure might also be telling you. */
function checkAsset(file) {
  const where = relative('docs', file).replace(/\\/g, '/');
  const body = readFileSync(file, 'utf8');
  const permitted = SCRIPT_ORIGINS[where] || {};
  const problems = [];

  for (const origin of scriptOrigins(body)) {
    if (origin === SELF_ORIGIN) continue;
    if (origin in permitted) continue;
    problems.push(SCRIPT_ORIGINS[where]
      ? `${where} names ${origin}, which is not declared for it`
      : `${where} names ${origin}, and no external origin is declared for this file`);
  }

  /* A stylesheet's own fetching surfaces, which the markup pass never sees
     because it only reads the page. */
  if (/\.css$/i.test(file)) {
    for (const { url, why } of autoFetched(body)) {
      const origin = originOf(url);
      if (origin && origin !== SELF_ORIGIN) problems.push(`${where}: ${why} -> ${url}`);
    }
  }
  return problems;
}

function checkFile(path, name) {
  const html = readFileSync(path, 'utf8');
  const problems = [];
  const allowed = ALLOWED[name] || [];

  /* Inline code gets the strict rule as well as linked code.

     autoFetched below reads markup, where most external URLs are inert links,
     so it only looks at the attributes that cause a request. That leniency is
     right for markup and wrong for a script: the offline build is one file
     with everything inlined, so a call written as fetchJSON("https://...") in
     an inline block would meet only the lenient rule, in the build whose
     entire claim is that it calls nothing. */
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    /* Only executable blocks. A <script type="application/ld+json"> is data:
       its URLs are vocabulary identifiers and canonical addresses, and a
       browser parses them as strings rather than fetching them. Scanning it
       with the code rule flagged schema.org on all 54 guide pages. */
    const type = (m[1].match(/\btype\s*=\s*["']([^"']*)["']/i)?.[1] || '').toLowerCase();
    if (type && !/(java|ecma)script$|^module$|^text\/js$/.test(type)) continue;

    for (const origin of scriptOrigins(m[2])) {
      if (origin === SELF_ORIGIN) continue;
      if (!(origin in SHARED_SCRIPT_ORIGINS)) {
        problems.push(`an inline script names ${origin}, which is not declared`);
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
  const assets = new Set();

  for (const file of walk(root)) {
    const name = relative(root, file).replace(/\\/g, '/');
    const problems = checkFile(file, name.split('/').pop());
    if (problems.length) failures.push([name, problems]);
    for (const asset of assetGraph(readFileSync(file, 'utf8'), dirname(file))) assets.add(asset);
  }

  for (const asset of [...assets].sort()) {
    const problems = checkAsset(asset);
    if (problems.length) failures.push([relative(root, asset).replace(/\\/g, '/'), problems]);
  }

  if (failures.length) {
    console.error('\nABORT: pages fetch from somewhere they should not.\n');
    for (const [name, problems] of failures) {
      console.error(`  ${name}`);
      for (const p of problems) console.error(`     ${p}`);
    }
    console.error('\nIf a request is intentional, declare it in build/tools/assert-no-fetch.mjs');
    console.error('with a reason beside it: ALLOWED for a page\'s own markup, SCRIPT_ORIGINS');
    console.error('for a script, keyed by the file allowed to reach it.\n');
    process.exit(1);
  }

  const pages = walk(root).length;
  console.log(`fetch guard: ${pages} pages, no unexpected automatic requests`);
}

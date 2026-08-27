/* Writes the static HTML in docs/ from build/content.mjs.
   Run:  npm run build

   Two kinds of output:

   1. The pages at docs/ root. Only the <body> containers are rewritten --
      <head> is left exactly as it is, so og: tags, canonicals, JSON-LD and
      cache-busters stay hand-maintained.

   2. docs/guides/*.html, one per published entry in build/guides.mjs. These
      are written whole, <head> included, because the point of the guide
      library is that adding the fortieth guide costs one object in an array
      and nothing else. */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { pages, renderHeader, renderFooter, routes } from './content.mjs';
import { guides, publishedGuides, renderGuideBody } from './guides.mjs';
import { renderEntropyOffline, renderEntropyEmbed } from './tools/entropy-page.mjs';
import { assertNoUnexpectedFetches } from './tools/assert-no-fetch.mjs';
import { assertGlyphCoverage } from './tools/assert-glyphs.mjs';
import { assertWorkshop } from './tools/assert-workshop.mjs';
import { createHash } from 'node:crypto';
import { copyFileSync } from 'node:fs';

/* ---- webfonts -----------------------------------------------------------

   These used to come from fonts.googleapis.com on every page. Two problems
   with that, and the second is the serious one.

   Every visitor's IP reached Google on every page load, for a site whose
   subject is not handing your business to third parties.

   And the Entropy Workshop's site build carried the same three tags. Opened
   from file:// -- which is exactly what someone does after downloading it --
   it announced "this copy is running offline", in green, while three requests
   went to Google. The page stated something false at the moment a reader was
   deciding whether to trust it.

   The same two files were already vendored for the offline build, which
   inlines them as data: URIs. They are copied out here so the site can serve
   them from its own origin, which keeps one source of truth for the bytes.

   Note what is NOT in them: the check mark, the half-filled circle and the
   four card suits. Neither Jost nor Open Sans contains those glyphs at all --
   verified against the upstream variable fonts, not just the subsets -- so
   they have always been drawn by a system fallback face, under Google Fonts
   exactly as here. Adding them to the subset is not possible and not needed. */
const FONTS = ['jost-latin.woff2', 'open-sans-latin.woff2'];

/* Every generated file is written LF-only, on every platform.

   This is a correctness requirement, not a style choice. entropy-core.js is
   checked out with CRLF on Windows and LF elsewhere, and it is inlined
   verbatim into templates that are LF, so the artifact came out mixed: 1569
   CRLF lines and 2356 LF ones. Git normalised the committed blob, which meant
   the SHA-256 published beside the file described the working copy rather than
   the bytes GitHub served. Anyone following the verify instructions in
   SECURITY.md would have got a mismatch and been right to distrust the file.

   It also made the build platform-dependent: identical source, different
   checksum, depending on which operating system ran it.

   The artifact is committed with -text in .gitattributes so git stores these
   bytes exactly, and assert-workshop.mjs fails the build if a CR survives. */
const toLF = text => text.replace(/\r\n/g, '\n');

/* file -> page key. Several files can share a key: block-demo.html is the same
   dashboard markup wrapped with block-probe.js. */
const FILES = {
  'index.html': 'home',
  'guides.html': 'guides',
  'glossary.html': 'glossary',
  'devices.html': 'devices',
  'software.html': 'software',
  'exchanges.html': 'exchanges',
  'dashboard.html': 'dashboard',
  'merch.html': 'merch',
  'contact.html': 'contact',
  'coinkite.html': 'coinkite',
  'block-demo.html': 'dashboard',
};

const SITE = 'https://selfcustody.ca';
const ASSET_VERSION = '20260827-4931';
const ASSET_QUERY = /(assets\/(?:vendor\/bootstrap-icons\/bootstrap-icons\.css|css\/(?:style|site-refresh)\.css|js\/site-refresh\.js)\?v=)[^"']+/g;

/* The whole container block, anchored on the <noscript> that always follows it.
   A non-greedy match on </div> would work on the empty shell but not on an
   already-built file, where the header contains nested divs of its own -- so
   the build has to be greedy here to stay idempotent. */
const SHELL = /<div id="site-header">[\s\S]*<\/div>(?=\s*<noscript)/;
const NOSCRIPT = /<noscript>[\s\S]*?<\/noscript>/;

/* The old fallback said "enable JavaScript to view this site", which stopped
   being true once the pages were prerendered -- and its <h1> gave every page a
   second one. What genuinely still needs JS is the nav: below 992px
   `.navbar ul` is display:none and only the toggle script reveals it, so
   without JS there is no way off the page. So the fallback carries the links
   itself. No heading, to keep one <h1> per page. */
const noscriptFor = (key, base = '') => {
  const links = routes
    .map(([, label, href]) => `<li><a href="${base}${href}">${label}</a></li>`)
    .join('');
  const live = key === 'dashboard'
    ? ' The live network figures on this page also need JavaScript.'
    : '';
  return `<noscript><div class="container py-4"><p><strong>JavaScript is off, so the menu button will not open.</strong>${live} Every page:</p><ul>${links}</ul></div></noscript>`;
};

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
  const source = readFileSync(path, 'utf8');
  const html = source.replace(ASSET_QUERY, `$1${ASSET_VERSION}`);
  const page = pages[key] || pages.home;

  if (!SHELL.test(html)) {
    console.error(`  ABORT ${file}: could not find the three containers`);
    process.exit(1);
  }

  const filled =
    `<div id="site-header">${renderHeader(key)}</div>\n` +
    `    <main id="main-content">${page.content}</main>\n` +
    `    <div id="site-footer">${renderFooter()}</div>`;

  let out = html.replace(SHELL, () => filled);
  if (NOSCRIPT.test(out)) out = out.replace(NOSCRIPT, () => noscriptFor(key));
  if (out !== source) {
    writeFileSync(path, out);
    changed++;
  }
  console.log(`  ${file.padEnd(16)} ${Math.round(out.length / 1024)} KB`);
}
console.log(`\n${changed} file(s) written`);

/* ---- guide pages --------------------------------------------------------

   Written whole rather than patched into a shell, so a new guide never needs a
   hand-made file to land in. The directory is cleared first: a guide that is
   renamed or demoted back to "planned" should stop being served, and there is
   nothing else in there to lose. */

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const guideHead = guide => {
  const url = `${SITE}/guides/${guide.slug}.html`;
  const title = `${esc(guide.title)} | SelfCustody.ca`;
  const desc = esc(guide.summary);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.summary,
    url,
    datePublished: guide.updated,
    dateModified: guide.updated,
    inLanguage: 'en-CA',
    publisher: { '@type': 'Organization', name: 'SelfCustody.ca', url: `${SITE}/` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${desc}">
  <title>${title}</title>
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="en_CA">
  <meta property="og:site_name" content="SelfCustody.ca">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/assets/img/social-preview.jpg?v=5">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1406">
  <meta property="og:image:height" content="703">
  <meta property="og:image:alt" content="SelfCustody.ca beside an open bank vault on a dark brick wall">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${SITE}/assets/img/social-preview.jpg?v=5">
  <meta name="twitter:image:alt" content="SelfCustody.ca beside an open bank vault on a dark brick wall">
  <link rel="icon" type="image/svg+xml" href="../assets/img/self-custody-favicon.svg">
  <link rel="icon" href="../assets/img/favicon.png">
  <link rel="apple-touch-icon" href="../assets/img/apple-touch-icon.png">
  <link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="../assets/vendor/bootstrap-icons/bootstrap-icons.css?v=${ASSET_VERSION}" rel="stylesheet">
  <link href="../assets/css/style.css?v=${ASSET_VERSION}" rel="stylesheet">
  <link href="../assets/css/site-refresh.css?v=${ASSET_VERSION}" rel="stylesheet">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>`;
};

/* A `related` entry pointing at a slug that does not exist would render a link
   to a 404, and the typo is invisible on the page that contains it. */
const slugs = new Set(guides.map(g => g.slug));
const badRefs = guides.flatMap(g => (g.related || [])
  .filter(r => !slugs.has(r))
  .map(r => `${g.slug} -> ${r}`));
if (badRefs.length) {
  console.error(`\n  ABORT: related guides that do not exist: ${badRefs.join(', ')}`);
  process.exit(1);
}

/* Guides link to each other in prose, and a link written before its target is
   published points at a 404 that nothing else would catch -- the `related`
   check below only covers the metadata. Same-directory hrefs in a guide body
   must resolve to a guide that actually gets a page. */
const publishedSlugs = new Set(publishedGuides.map(g => g.slug));
const deadLinks = [];
for (const guide of publishedGuides) {
  /* Both quote styles: attributes inside a double-quoted JS string are written
     with single quotes to avoid escaping, so a check for one style only would
     silently skip half the links. */
  for (const m of guide.body.matchAll(/href=["']([a-z0-9-]+)\.html["']/g)) {
    if (!publishedSlugs.has(m[1])) deadLinks.push(`${guide.slug} -> ${m[1]}.html`);
  }
}
if (deadLinks.length) {
  console.error(`\n  ABORT: guide prose links to pages that are not published: ${deadLinks.join(', ')}`);
  process.exit(1);
}

const dupes = guides.map(g => g.slug).filter((s, i, a) => a.indexOf(s) !== i);
if (dupes.length) {
  console.error(`\n  ABORT: duplicate guide slugs: ${[...new Set(dupes)].join(', ')}`);
  process.exit(1);
}

if (existsSync('docs/guides')) rmSync('docs/guides', { recursive: true });
mkdirSync('docs/guides', { recursive: true });

for (const guide of publishedGuides) {
  const html = `${guideHead(guide)}
<body class="site-refresh" data-page="guides">
  <div id="site-header">${renderHeader('guides', '../')}</div>
    <main id="main-content">${renderGuideBody(guide)}</main>
    <div id="site-footer">${renderFooter('../')}</div>
  ${noscriptFor('guides', '../')}
  <script src="../assets/js/site-refresh.js?v=${ASSET_VERSION}"></script>
</body>
</html>
`;
  writeFileSync(`docs/guides/${guide.slug}.html`, html);
  console.log(`  guides/${guide.slug}.html`.padEnd(46) + `${Math.round(html.length / 1024)} KB`);
}

/* A guide that has been renamed or absorbed into another keeps its old paths
   alive through `aliases`. Pages are static, so there is no server redirect to
   configure -- a stub carrying rel=canonical (for crawlers) and a meta refresh
   (for people) is the whole mechanism. docs/guides is rebuilt from scratch on
   every run, so these have to be generated rather than left lying around. */
let aliasCount = 0;
for (const guide of publishedGuides) {
  for (const alias of guide.aliases || []) {
    writeFileSync(`docs/guides/${alias}.html`, `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Moved: ${guide.title}</title>
  <link rel="canonical" href="https://selfcustody.ca/guides/${guide.slug}.html">
  <meta name="robots" content="noindex, follow">
  <meta http-equiv="refresh" content="0; url=${guide.slug}.html">
</head>
<body>
  <p>This guide has moved to <a href="${guide.slug}.html">${guide.title}</a>.</p>
</body>
</html>
`);
    aliasCount++;
    console.log(`  guides/${alias}.html`.padEnd(46) + `redirect -> ${guide.slug}.html`);
  }
}

/* ---- the offline entropy tool -------------------------------------------

   One self-contained file with the crypto core and the wordlist inlined, so
   the copy served from the site and the copy saved to a USB stick are byte for
   byte the same thing. Its SHA-256 is written alongside it: a reader who
   downloads the page can check they got what was published, which is the only
   way an offline tool can be worth anything.

   Deliberately absent from the sitemap, and carrying noindex of its own. It is
   reached from the guides that explain how to use it, not from a search
   result landed on cold. */

/* Lived at docs/tools/entropy.html before it moved to the root. Removed
   outright rather than left behind: a stale copy at the old URL would keep
   answering requests with an out-of-date file, silently, forever. */
/* Serve the two webfonts from our own origin. Copied rather than committed
   twice so build/vendor/fonts stays the single place the bytes live -- the
   offline build inlines the same files as data: URIs. */
mkdirSync('docs/assets/fonts', { recursive: true });
for (const font of FONTS) {
  copyFileSync(`build/vendor/fonts/${font}`, `docs/assets/fonts/${font}`);
}

if (existsSync('docs/tools')) rmSync('docs/tools', { recursive: true });

/* Same reasoning, one level down. entropy.html used to be the downloadable
   artifact and had a checksum published beside it; it is now the browsable
   page, and that stale .sha256 would describe a file nobody can obtain --
   worse than no checksum, because it invites a comparison that must fail. */
if (existsSync('docs/entropy.html.sha256')) rmSync('docs/entropy.html.sha256');

/* The downloadable artifact, and the checksum published beside it. This is the
   file the verify instructions name and the one a reader is meant to hash --
   the browsable page below is a different file with the site's chrome around
   the same tool, and hashing that instead would prove nothing. */
/* Belt and braces on the line endings. entropy-page.mjs normalises what it
   inlines, and this catches anything a future template drags in: the bytes
   hashed on the next line are the bytes written, and both are LF only. */
const entropyOffline = toLF(renderEntropyOffline());
writeFileSync('docs/entropy-offline.html', entropyOffline);
const entropyHash = createHash('sha256').update(entropyOffline).digest('hex');
writeFileSync('docs/entropy-offline.html.sha256', `${entropyHash}  entropy-offline.html
`);

/* The same tool inside an ordinary page, so browsing it does not mean landing
   on something that looks like a different website. */
const embed = renderEntropyEmbed();
const entropySite = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <!-- Before every stylesheet, script, font and image below, because a meta
       CSP only governs what is fetched after it is parsed. Same shape as the
       offline build's policy, loosened exactly where this build differs: it
       has real files beside it, so 'self' where that one says none.

       connect-src 'none' is the load-bearing line. This page has nothing to
       send anywhere, and the shared site script that runs on every other page
       does fetch (the glossary loads its terms) -- so the policy states that
       on this page, that must not happen.

       frame-ancestors is absent on purpose: meta CSP cannot enforce it. It
       needs a response header, which GitHub Pages does not let us set. -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="x-dns-prefetch-control" content="off">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Turn dice rolls, coin flips or a shuffled deck into the recovery words, addresses and account key they produce, and check them against your device. Experimental, and meant for testing rather than for securing real bitcoin.">
  <title>Entropy Workshop | SelfCustody.ca</title>
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE}/entropy.html">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_CA">
  <meta property="og:site_name" content="SelfCustody.ca">
  <meta property="og:title" content="Entropy Workshop | SelfCustody.ca">
  <meta property="og:description" content="Turn dice rolls, coin flips or a shuffled deck into the recovery words, addresses and account key they produce, and check them against your device. Experimental, and meant for testing rather than for securing real bitcoin.">
  <meta property="og:url" content="${SITE}/entropy.html">
  <meta property="og:image" content="${SITE}/assets/img/social-preview.jpg?v=5">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${SITE}/assets/img/social-preview.jpg?v=5">
  <link rel="icon" type="image/svg+xml" href="assets/img/self-custody-favicon.svg">
  <link rel="icon" href="assets/img/favicon.png">
  <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css?v=${ASSET_VERSION}" rel="stylesheet">
  <link href="assets/css/style.css?v=${ASSET_VERSION}" rel="stylesheet">
  <link href="assets/css/site-refresh.css?v=${ASSET_VERSION}" rel="stylesheet">
  <style>${embed.styles}</style>
</head>
<body class="site-refresh" data-page="entropy">
  <div id="site-header">${renderHeader('entropy')}</div>
    <main id="main-content">${embed.markup.replace('{{FILESIZE}}', embed.downloadSize)}</main>
    <div id="site-footer">${renderFooter()}</div>
  ${noscriptFor('entropy')}
  <script src="assets/js/site-refresh.js?v=${ASSET_VERSION}"></script>
${embed.scripts}
</body>
</html>
`;
writeFileSync('docs/entropy.html', toLF(entropySite));

console.log(`
entropy-offline.html           ${Math.round(entropyOffline.length / 1024)} KB`);
console.log(`  sha256  ${entropyHash}`);
console.log(`entropy.html                   ${Math.round(entropySite.length / 1024)} KB  (site page)`);

const planned = guides.length - publishedGuides.length;
console.log(`\n${publishedGuides.length} guide page(s) written, ${planned} planned, ${aliasCount} redirect(s)`);

/* ---- sitemap ------------------------------------------------------------
   Planned guides are deliberately absent: they have no page to point at. */

const ROOT_URLS = [
  ['/', 'monthly', '1.0'],
  ['/guides.html', 'weekly', '0.9'],
  ['/glossary.html', 'monthly', '0.8'],
  ['/devices.html', 'monthly', '0.9'],
  ['/coinkite.html', 'monthly', '0.8'],
  ['/software.html', 'monthly', '0.8'],
  ['/exchanges.html', 'monthly', '0.8'],
  ['/dashboard.html', 'daily', '0.8'],
  /* The browsable Workshop. It was kept out of here while it was the raw
     downloadable file -- landing on that cold, without the guidance around it,
     was the thing to avoid. It is a normal page now, with the safety brief
     above the tool and nowhere to type an existing phrase. The offline copy it
     links to stays out: a 211 KB near-duplicate, and cold arrival there is
     what the original reasoning was actually about. */
  ['/entropy.html', 'monthly', '0.7'],
  ['/contact.html', 'yearly', '0.5'],
];

const sitemapEntries = [
  ...ROOT_URLS.map(([loc, freq, pri]) => ({ loc, freq, pri, lastmod: null })),
  ...publishedGuides.map(g => ({
    loc: `/guides/${g.slug}.html`,
    freq: 'monthly',
    pri: '0.7',
    lastmod: g.updated
  }))
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(e => `  <url>
    <loc>${SITE}${e.loc}</loc>${e.lastmod ? `
    <lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>${e.freq}</changefreq>
    <priority>${e.pri}</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync('docs/sitemap.xml', sitemap);
console.log(`sitemap.xml    ${sitemapEntries.length} URLs`);

/* The icon font is subset to the glyphs in use, so an icon added later would
   render as a blank box. Catch that here rather than in someone's browser.
   Two names are built by concatenation in site-refresh.js and cannot be found
   by scanning, so they are listed explicitly.

   Glyphs are asked for two ways and both are checked. Most are `bi-*` classes
   in markup. A few are raw `content: "\fXXXX"` codepoints in the stylesheet --
   the tick on .sc-check-list and the triangle on .sc-caution-list -- and those
   used to pass this check while being absent from the font, because nothing
   here looked at them. They rendered blank on every guide page.

   Checking the shipped stylesheet is enough to cover the font as well:
   subset-icons.mjs writes the rules and the woff/woff2 from one keep list, so
   a rule in that file and a glyph in that font cannot disagree. */
const iconCss = readFileSync('docs/assets/vendor/bootstrap-icons/bootstrap-icons.css', 'utf8');
const iconRules = [...iconCss.matchAll(/\.(bi-[a-z0-9-]+)::before\s*\{\s*content:\s*"\\([0-9a-f]{4})"/g)];
const available = new Set(iconRules.map(m => m[1]));
const availablePoints = new Set(iconRules.map(m => m[2]));

let scan = readFileSync('build/content.mjs', 'utf8')
  + readFileSync('build/guides.mjs', 'utf8')
  + readFileSync('docs/assets/js/site-refresh.js', 'utf8');
for (const f of readdirSync('docs')) if (f.endsWith('.html') && !f.startsWith('_')) scan += readFileSync(`docs/${f}`, 'utf8');
for (const f of readdirSync('docs/guides')) scan += readFileSync(`docs/guides/${f}`, 'utf8');

let cssScan = '';
for (const f of ['docs/assets/css/site-refresh.css', 'docs/assets/css/block-demo.css']) {
  try { cssScan += readFileSync(f, 'utf8'); } catch {}
}
try { scan += readFileSync('docs/block-probe.js', 'utf8'); } catch {}
scan += cssScan;

const referenced = new Set(['bi-arrow-up-right', 'bi-arrow-down-right', 'bi-arrow-right']);
for (const m of scan.matchAll(/\bbi-[a-z0-9]+(?:-[a-z0-9]+)*/g)) referenced.add(m[0]);
referenced.delete('bi-arrow');   // truncated match from the concatenations above

const referencedPoints = new Set();
for (const m of cssScan.matchAll(/content:\s*"\\([0-9a-fA-F]{4})"/g)) referencedPoints.add(m[1].toLowerCase());

const absent = [...referenced].filter(n => !available.has(n));
const absentPoints = [...referencedPoints].filter(p => !availablePoints.has(p));
if (absent.length || absentPoints.length) {
  const named = absent.length ? ` ${absent.join(', ')}` : '';
  const points = absentPoints.length ? ` ${absentPoints.map(p => `U+${p.toUpperCase()}`).join(', ')} (set by codepoint in CSS)` : '';
  console.error(`\n  ABORT: these icons are used but not in the subset font:${named}${points}`);
  console.error('  Run "npm run icons:subset" to regenerate the stylesheet and the font.');
  process.exit(1);
}
console.log(`icon check: ${referenced.size} glyphs by name and ${referencedPoints.size} by codepoint, all present in the subset font`);

/* Last, once every page is on disk: nothing may fetch from an origin it has
   no business fetching from, and the offline build may not fetch at all. */
assertNoUnexpectedFetches('docs');
assertGlyphCoverage('docs');
assertWorkshop();

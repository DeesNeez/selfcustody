/* Rewrites the Entropy Workshop's stylesheet so it can share a page with the
   rest of the site.

   The tool was written for a document where nothing else exists, so it styles
   bare `a`, `body`, `main`, `h1`, `details` and friends. That is fine in the
   downloadable single file and ruinous on a page that also loads
   site-refresh.css: the tool's rules would restyle the real header and footer
   around it.

   So every selector is confined to a wrapper element. Brace-aware rather than
   a regular expression, because `@media` nests and a naive pass would prefix
   the at-rule itself.

   What is deliberately left alone:

     @font-face and @keyframes  -- no selectors to scope, and prefixing the
                                   name would break the reference.
     :root                      -- the tool's custom properties are checked
                                   against the site's and share no names, so
                                   they can sit at the root harmlessly. Moving
                                   them onto the wrapper would work too, but
                                   leaving them keeps the two builds' output
                                   closer to identical. */

/* `body` and `main` describe the page the tool used to own. Inside the site
   they describe the wrapper itself, so they collapse onto it rather than
   reaching outward. */
const COLLAPSE = new Set(['body', 'main', 'html']);

/* A block's prelude carries whatever preceded it, comments included, and the
   comments must not be read as part of it. `head` decides whether a block is
   an at-rule or a selector list, and a comment sitting above an @media pushed
   the `@` off the front: the block was taken for a selector, its condition was
   prefixed as though it were one, and the rules inside were emitted with no
   wrapper at all. That put the tool's own offline header, nav, hero and footer
   rules -- .site-header, .site-nav, .footer-grid -- onto the site page
   unscoped, where they matched the real chrome. Comments are stripped for the
   decision and kept in the output. */
const COMMENT = /\/\*[\s\S]*?\*\//g;
const LEADING = /^(?:\s|\/\*[\s\S]*?\*\/)*/;

const splitTop = (list, separator) => {
  const out = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < list.length; i++) {
    const ch = list[i];
    /* A comment is copied across whole. Prose punctuation is not selector
       punctuation: a comma in "off the screen, so the rows" split the prelude
       and the wrapper was spliced into the middle of the sentence. */
    if (ch === '/' && list[i + 1] === '*') {
      const close = list.indexOf('*/', i + 2);
      const stop = close === -1 ? list.length : close + 2;
      current += list.slice(i, stop);
      i = stop - 1;
      continue;
    }
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === separator && depth === 0) { out.push(current); current = ''; continue; }
    current += ch;
  }
  out.push(current);
  return out;
};

const scopeSelector = (selector, wrapper) => {
  const trimmed = selector.trim();
  if (!trimmed) return trimmed;
  if (trimmed === ':root') return wrapper;
  if (COLLAPSE.has(trimmed)) return wrapper;
  /* A rule like `body.something` or `main > x` still starts at the page, so
     the leading element is replaced rather than nested under the wrapper. */
  for (const tag of COLLAPSE) {
    if (trimmed === tag || trimmed.startsWith(tag + '.') || trimmed.startsWith(tag + '[')) {
      return wrapper + trimmed.slice(tag.length);
    }
    if (trimmed.startsWith(tag + ' ') || trimmed.startsWith(tag + '>')) {
      return wrapper + trimmed.slice(tag.length);
    }
  }
  return wrapper + ' ' + trimmed;
};

export function scopeCss(css, wrapper) {
  let out = '';
  let i = 0;

  /* Where a comment ends, given that it starts at k. Braces inside one are
     prose, not structure: a comment reading `[hidden]{ display: none }` was
     taken for the start of a block, which ended the prelude mid-sentence and
     left the brace counter one deep in a rule that was never opened. */
  const pastComment = k =>
    css[k] === '/' && css[k + 1] === '*'
      ? (css.indexOf('*/', k + 2) === -1 ? css.length : css.indexOf('*/', k + 2) + 2)
      : -1;

  const readBlock = start => {
    let depth = 0;
    for (let k = start; k < css.length; k++) {
      const skip = pastComment(k);
      if (skip !== -1) { k = skip - 1; continue; }
      if (css[k] === '{') depth++;
      else if (css[k] === '}') {
        depth--;
        if (depth === 0) return k;
      }
    }
    return css.length - 1;
  };

  const nextBrace = from => {
    for (let k = from; k < css.length; k++) {
      const skip = pastComment(k);
      if (skip !== -1) { k = skip - 1; continue; }
      if (css[k] === '{') return k;
    }
    return -1;
  };

  while (i < css.length) {
    const brace = nextBrace(i);
    if (brace === -1) { out += css.slice(i); break; }

    const prelude = css.slice(i, brace);
    const end = readBlock(brace);
    const body = css.slice(brace + 1, end);
    const head = prelude.replace(COMMENT, '').trim();

    if (head.startsWith('@font-face') || head.startsWith('@keyframes')) {
      out += prelude + '{' + body + '}';
    } else if (head.startsWith('@')) {
      /* @media, @supports: the condition is untouched and the rules inside
         are scoped as though they were at the top level. */
      out += prelude + '{' + scopeCss(body, wrapper) + '}';
    } else if (head === ':root') {
      out += prelude + '{' + body + '}';
    } else {
      const scoped = splitTop(prelude, ',')
        .map(sel => {
          const lead = sel.match(LEADING)[0];
          return lead + scopeSelector(sel.slice(lead.length), wrapper);
        })
        .join(',');
      out += scoped + '{' + body + '}';
    }
    i = end + 1;
  }

  return out;
}

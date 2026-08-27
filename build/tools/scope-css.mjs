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

const splitTop = (list, separator) => {
  const out = [];
  let depth = 0;
  let current = '';
  for (const ch of list) {
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

  const readBlock = start => {
    let depth = 0;
    for (let k = start; k < css.length; k++) {
      if (css[k] === '{') depth++;
      else if (css[k] === '}') {
        depth--;
        if (depth === 0) return k;
      }
    }
    return css.length - 1;
  };

  while (i < css.length) {
    const brace = css.indexOf('{', i);
    if (brace === -1) { out += css.slice(i); break; }

    const prelude = css.slice(i, brace);
    const end = readBlock(brace);
    const body = css.slice(brace + 1, end);
    const head = prelude.trim();

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
          const lead = sel.match(/^\s*/)[0];
          return lead + scopeSelector(sel, wrapper);
        })
        .join(',');
      out += scoped + '{' + body + '}';
    }
    i = end + 1;
  }

  return out;
}

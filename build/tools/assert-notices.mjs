/* Third-party notices survive the build.

   Two of the stylesheets this site serves are other people's work, reduced to
   the parts it uses, and both licences ask for their notice to travel with the
   result. Both had lost it, in the same way and for the same reason: a subset
   is produced by keeping the rules and dropping everything else, and the
   notice is part of the everything else.

   Bootstrap Icons lost its notice to a preamble rebuilt from the first glyph
   rule, which starts below the comment. Bootstrap's was stripped when the full
   dist was cut down by hand. Neither was a decision; both were the same
   oversight, and nothing would have reported either.

   So the notices are asserted rather than trusted. This runs against what is
   actually written to docs/, not against the vendored sources, because the
   served file is the copy a reader receives -- and it is the served copy that
   both times went out without the notice.

   The check is deliberately about content rather than byte-equality: a subset
   may be regenerated, reordered or recompressed, and none of that should fail
   the build. Losing the copyright line or the permission grant should. */

import { readFileSync, existsSync } from 'node:fs';

/* Each entry names the served file, and the strings that must appear in it.
   The copyright line identifies whose work it is; the permission sentence is
   the operative half of MIT, and the half a banner-only notice tends to
   drop. */
const REQUIRED = [
  {
    file: 'docs/assets/vendor/bootstrap/css/bootstrap.min.css',
    what: 'Bootstrap 5.2.3',
    source: 'build/vendor/bootstrap/LICENSE',
    strings: [
      'The MIT License (MIT)',
      'Copyright (c) 2011-2022 Twitter, Inc.',
      'Copyright (c) 2011-2022 The Bootstrap Authors',
      'Permission is hereby granted, free of charge'
    ]
  },
  {
    file: 'docs/assets/vendor/bootstrap-icons/bootstrap-icons.css',
    what: 'Bootstrap Icons',
    source: 'build/vendor/bootstrap-icons/LICENSE.md',
    strings: [
      'The MIT License (MIT)',
      'Copyright (c) 2019-2021 The Bootstrap Authors',
      'Permission is hereby granted, free of charge'
    ]
  }
];

export function assertNotices() {
  const problems = [];

  for (const { file, what, source, strings } of REQUIRED) {
    if (!existsSync(file)) {
      problems.push(`${file} is missing, so ${what}'s notice cannot be there either`);
      continue;
    }
    const text = readFileSync(file, 'utf8');
    for (const needle of strings) {
      if (!text.includes(needle)) {
        problems.push(`${file} no longer carries ${what}'s notice: "${needle}" is gone`);
      }
    }

    /* The served copy is checked against the vendored licence, not just for a
       few strings, so that a notice cannot be quietly paraphrased into
       something shorter than the licence requires.

       A missing vendored licence is a failure, not a reason to skip the
       comparison. Skipping would mean deleting the source file silently
       disabled the strongest half of this check, which is the failure mode a
       guard is least allowed to have: the more of the evidence goes missing,
       the quieter it would get. */
    if (!existsSync(source)) {
      problems.push(`${source} is missing, so ${what}'s notice in ${file} cannot be checked against it`);
      continue;
    }
    const licence = readFileSync(source, 'utf8').replace(/\r\n/g, '\n').trim();
    const flat = s => s.replace(/^[\s*]+/gm, '').replace(/\s+/g, ' ').trim();
    if (!flat(text).includes(flat(licence))) {
      problems.push(`${file} carries a notice for ${what} that does not match ${source}`);
    }
  }

  if (problems.length) {
    console.error('  ABORT: third-party notices are missing from what the site serves');
    for (const p of problems) console.error(`    ${p}`);
    process.exit(1);
  }

  console.log(`notice check: ${REQUIRED.length} served stylesheets, each carrying its upstream licence in full`);
}

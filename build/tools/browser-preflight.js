/* Browser preflight for the Entropy Workshop.

   This runs before the crypto core and UI. It tests only host features the
   Workshop actually uses: BigInt key arithmetic, UTF-8, BIP39 NFKD
   normalization, typed binary views, SVG creation and local Blob downloads.
   It deliberately does not test or call a random-number generator: this tool
   converts entropy supplied by the reader and must never generate any.

   Keep BigInt literal syntax out of this file. A browser without BigInt must
   still be able to parse the check and show a useful refusal. */
(function () {
  'use strict';

  var checks = [
    {
      name: 'BigInt arithmetic',
      run: function () {
        if (typeof BigInt !== 'function') return false;
        var value = (BigInt(1) << BigInt(255)) + BigInt(1);
        return value.toString(16) === '8' + '0'.repeat(62) + '1';
      }
    },
    {
      name: 'UTF-8 TextEncoder and TextDecoder',
      run: function () {
        if (typeof TextEncoder !== 'function' || typeof TextDecoder !== 'function') return false;
        var bytes = new TextEncoder().encode('\u00e9');
        return bytes.length === 2 && bytes[0] === 0xc3 && bytes[1] === 0xa9
          && new TextDecoder().decode(bytes) === '\u00e9';
      }
    },
    {
      name: 'String.normalize (NFKD)',
      run: function () {
        return typeof ''.normalize === 'function'
          && String.fromCharCode(0x00e9).normalize('NFKD')
            === String.fromCharCode(0x0065, 0x0301);
      }
    },
    {
      name: 'Typed arrays and DataView',
      run: function () {
        if (typeof Uint8Array !== 'function' || typeof DataView !== 'function') return false;
        /* BigInt has its own diagnostic above. Avoid reporting this second
           check as failed only because the first primitive is absent. */
        if (typeof BigInt !== 'function') return true;
        var bytes = new Uint8Array(8);
        var view = new DataView(bytes.buffer);
        view.setUint32(0, 0x01020304, false);
        if (bytes[0] !== 1 || bytes[1] !== 2 || bytes[2] !== 3 || bytes[3] !== 4) return false;
        if (typeof view.setBigUint64 !== 'function' || typeof view.getBigUint64 !== 'function') return false;
        view.setBigUint64(0, BigInt('72623859790382856'), false);
        return view.getBigUint64(0, false).toString(16) === '102030405060708';
      }
    },
    {
      name: 'SVG document support',
      run: function () {
        if (!document || typeof document.createElementNS !== 'function') return false;
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        return Boolean(svg && typeof svg.setAttribute === 'function');
      }
    },
    {
      name: 'Modern DOM controls',
      run: function () {
        if (!document || typeof document.createElement !== 'function') return false;
        var holder = document.createElement('div');
        var dialog = document.createElement('dialog');
        return typeof holder.replaceChildren === 'function'
          && typeof dialog.showModal === 'function' && typeof dialog.close === 'function';
      }
    },
    {
      name: 'Local Blob downloads',
      run: function () {
        return typeof Blob === 'function' && typeof URL === 'function'
          && typeof URL.createObjectURL === 'function' && typeof URL.revokeObjectURL === 'function';
      }
    }
  ];

  var failed = [];
  for (var i = 0; i < checks.length; i++) {
    var ok = false;
    try { ok = checks[i].run() === true; } catch (error) { ok = false; }
    if (!ok) failed.push(checks[i].name);
  }

  var root = document.documentElement;
  if (root) {
    root.dataset.browserChecks = String(checks.length);
    root.dataset.browserFailed = String(failed.length);
  }
  window.__entropyWorkshopPreflightPassed = failed.length === 0;
  if (failed.length === 0) return;

  var workspace = document.querySelector('.workspace');
  if (!workspace) return;
  var rows = failed.map(function (name) {
    return '<tr><td>' + name + '</td><td>Failed</td></tr>';
  }).join('');
  workspace.innerHTML = '<section class="sanity-failure" role="alert">'
    + '<div class="sanity-failure-card">'
    + '<div class="sanity-failure-icon" aria-hidden="true">\u00d7</div>'
    + '<h1>Browser sanity check failed</h1>'
    + '<p>This browser cannot safely run the Entropy Workshop. No wallet was produced.</p>'
    + '<table><thead><tr><th>Required feature</th><th>Result</th></tr></thead><tbody>'
    + rows + '</tbody></table>'
    + '<p class="sanity-failure-advice">Open this file in a current Firefox, Chrome, Edge or Safari browser on the trusted offline computer.</p>'
    + '</div></section>';
})();

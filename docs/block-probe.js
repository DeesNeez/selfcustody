/* Instrumentation for block-demo.html -- a copy of the dashboard that can be made
   to confirm a block on demand, so the strip's confirmation animation can be
   watched without waiting ten minutes for the real thing.

   Nothing here is loaded by the site proper. It must run BEFORE site-refresh.js,
   because it wraps fetch and WebSocket before the page captures them.

   The block is INVENTED. Everything else on the page is live. */
(function () {
  var BUMP = 0;
  var socket = null;
  var log = [];
  var t0 = Date.now();

  function stamp() { return "+" + ((Date.now() - t0) / 1000).toFixed(1) + "s"; }

  /* ---- the invented block ----------------------------------------------- */
  /* Trims a request down to something readable in a 10px monospace box:
     https://mempool.space/api/v1/fees/mempool-blocks -> fees/mempool-blocks */
  function shortUrl(url) {
    return String(url).replace(/^https?:\/\/[^/]+\//, "").replace(/^api\/(v1\/)?/, "");
  }

  /* Bumped by every GET, socket push and strip-state line -- see afterLanding()
     below, which uses this to tell "still working, just slow" apart from
     "actually stuck". mempool.space's own latency is well outside this page's
     control, and a wall-clock timeout sized for a fast connection is exactly
     what produced a genuine duplicate FIRED in testing: the real landing was
     still in flight, only slow, when the old fixed 5s cap gave up on it and
     queued the same height a second time. */
  var lastActivity = Date.now();

  /* Without this, every fabricated head is a straight JSON.parse(JSON.stringify)
     clone of the real chain tip -- so a run of fired blocks all show the exact
     same Transactions, Fees and Lowest, and it reads as one card copy-pasted
     five times rather than five separate blocks. Ranges are ordinary-day
     Bitcoin figures, not stress-tested against any real distribution: enough
     that each simulated block looks like a plausible, distinct block, nothing
     more precise than that. */
  /* height -> the one fabricated block for that height, invented on first use
     and reused thereafter. See the note at its only read, in the block-list
     branch of the fetch patch. */
  var simulatedBlocks = Object.create(null);

  function randInt(min, max) { return Math.floor(min + Math.random() * (max - min + 1)); }
  function randFloat(min, max, decimals) {
    var v = min + Math.random() * (max - min);
    return Number(v.toFixed(decimals));
  }
  function randomizeBlockStats(head) {
    head.tx_count = randInt(1200, 4800);
    head.extras = head.extras || {};
    head.extras.totalFees = randInt(300000, 3000000);
    /* Ascending, as the real API returns it -- fmtFeeSpan (the pending card's
       preview) reads the first and last entries as the range's ends, and the
       confirmed card's "Lowest" reads only feeRange[0]. Three points is enough
       to shape a believable curve for both without needing a fourth anything
       here reads. */
    var lowest = randFloat(0.5, 4, 2);
    var mid = randFloat(lowest + 2, 40, 1);
    var high = randFloat(mid + 5, 120, 0);
    head.extras.feeRange = [lowest, mid, high];
  }

  /* Failures are logged, not just successes. The monitor used to attach only a
     fulfilment handler, so a request that rejected -- the interesting case,
     since site-refresh.js's fetchJSON aborts on its own timeout and the page
     then quietly falls back to an empty strip or "Price history is
     unavailable" -- passed through leaving no trace at all. A monitor that
     shows every request that worked and none that didn't is worse than no
     monitor, because it reads as though nothing was attempted.

     The rejection is re-thrown, not swallowed: the page's own error handling
     is what puts those fallback states on screen, and it has to keep seeing
     the failure exactly as it would without this file in the way. */
  var origFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || "";
    var began = Date.now();
    return origFetch(input, init).catch(function (err) {
      lastActivity = Date.now();
      var why = err && err.name === "AbortError"
        ? "TIMED OUT (page gave up waiting)"
        : "FAILED " + ((err && err.name) || "") + " " + ((err && err.message) || "");
      log.push("GET " + shortUrl(url) + "  " + why + "  after " + (Date.now() - began) + "ms");
      if (log.length > 160) log = log.slice(-160);
      render();
      throw err;
    }).then(function (res) {
      lastActivity = Date.now();
      log.push("GET " + shortUrl(url) + "  " + res.status + "  " + (Date.now() - began) + "ms");
      if (log.length > 160) log = log.slice(-160);
      render();
      if (!BUMP) return res;
      if (url.indexOf("/api/blocks/tip/height") !== -1) {
        return res.clone().text().then(function (t) {
          return new Response(String(parseInt(t, 10) + BUMP), { status: 200 });
        });
      }
      /* Must not catch /api/v1/fees/mempool-blocks, or the pending card loses
         its projection and the demo stops looking like the real thing. */
      if (url.indexOf("/api/v1/blocks") !== -1) {
        return res.clone().json().then(function (arr) {
          if (!Array.isArray(arr) || !arr.length) return res;
          for (var i = 0; i < BUMP; i++) {
            /* Kept, not rebuilt. This runs on EVERY block-list fetch, so every
               landing re-fabricates all the earlier simulated blocks too --
               which, with fresh random stats each time, made a card's
               transactions, fees and lowest change under it as the strip
               shifted along. Cached by height so a simulated block is invented
               exactly once and then reused verbatim. The timestamp is part of
               that: caching it is also what lets these cards age normally
               instead of resetting to "just now" on every later landing. */
            var nextHeight = Number(arr[0].height) + 1;
            var head = simulatedBlocks[nextHeight];
            if (!head) {
              head = JSON.parse(JSON.stringify(arr[0]));
              head.height = nextHeight;
              head.id = "simulated" + nextHeight;
              head.timestamp = Math.floor(Date.now() / 1000);
              randomizeBlockStats(head);
              simulatedBlocks[nextHeight] = head;
            }
            arr.unshift(head);
          }
          return new Response(JSON.stringify(arr), {
            status: 200, headers: { "content-type": "application/json" }
          });
        });
      }
      return res;
    });
  };

  /* The page refreshes the strip the moment the mempool socket announces a
     height above the one it is holding. Keeping a reference to that socket lets
     the button deliver exactly that announcement, so the landing runs through
     the page's own new-block path immediately.

     This is why the tip poll is left alone at its usual twenty seconds: an
     earlier version shortened it to four so the button felt responsive, which
     meant every visitor to this page quietly polled mempool.space five times as
     often as the real dashboard does. */
  var OrigWS = window.WebSocket;
  window.WebSocket = function (url, protocols) {
    var ws = protocols === undefined ? new OrigWS(url) : new OrigWS(url, protocols);
    if (String(url).indexOf("mempool.space") !== -1) {
      socket = ws;
      ws.addEventListener("open", function () { log.push("SOCKET open — " + shortUrl(url)); render(); });
      ws.addEventListener("close", function () { log.push("SOCKET closed"); render(); });
      /* The stats channel chatters constantly, so log what each push carried
         rather than its contents, and collapse identical shapes arriving in
         quick succession -- otherwise the interesting lines scroll away. */
      var lastShape = "", lastAt = 0;
      ws.addEventListener("message", function (e) {
        var keys;
        try { keys = Object.keys(JSON.parse(e.data)).join(","); } catch (err) { return; }
        var now = Date.now();
        lastActivity = now;
        if (keys === lastShape && now - lastAt < 3000) return;
        lastShape = keys; lastAt = now;
        log.push("PUSH " + keys);
        if (log.length > 160) log = log.slice(-160);
        render();
      });
    }
    return ws;
  };
  window.WebSocket.prototype = OrigWS.prototype;
  ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach(function (k) {
    window.WebSocket[k] = OrigWS[k];
  });

  function currentTip() {
    var el = document.querySelector(".sc-block-confirmed .sc-block-height");
    var n = el ? parseInt(el.textContent.replace(/[^0-9]/g, ""), 10) : NaN;
    return isFinite(n) ? n : null;
  }

  /* The offset accumulates: each press adds another block on top of the real
     tip, so after a few the strip is showing heights the chain has not reached.
     That is the honest behaviour for a button labelled "fire a block", but it
     has to be stated on screen or the page quietly turns into a liar. */
  function showOffset() {
    var el = document.getElementById("lab-offset");
    if (el) {
      el.textContent = BUMP
        ? "Showing " + BUMP + " simulated block" + (BUMP === 1 ? "" : "s") +
          " above the real chain tip. Reload to return to reality."
        : "";
    }
    /* The feed genuinely is live -- every request and socket push below is
       real -- but once a block has been fired the strip above is not, and a
       badge reading only LIVE next to an invented block is the monitor telling
       a small lie about itself. */
    var badge = document.querySelector(".lab-monitor-bar em");
    if (badge) badge.textContent = BUMP ? "LIVE +" + BUMP + " SIM" : "LIVE";
  }

  /* Firing reads the chain tip from the DOM and announces tip+1. That is why
     rapid clicks used to drop: two clicks inside one round trip both read the
     SAME tip, so both announce the SAME height, and the real page's own dedup
     (pushedHeight > state.tipHeight in the socket handler) silently discards
     the second one as a repeat -- indistinguishable, from here, between "was
     dropped" and "just hasn't landed yet".

     So clicks queue instead of firing straight away, and the queue holds
     until a landing is actually observed before reading the tip again for the
     next one. That is also the fix, not just a workaround for it: serialized
     like this, no two dispatches can ever compute the same height, because
     each one only reads the tip after the previous landing changed it. */
  var queue = 0;
  var pumping = false;

  function queueFire() {
    queue++;
    log.push("");
    log.push("QUEUED " + stamp() + " — " + queue + " block" + (queue === 1 ? "" : "s") + " waiting to fire");
    render();
    pump();
  }

  function dispatch() {
    BUMP += 1;
    showOffset();
    var tip = currentTip();
    log.push("FIRED " + stamp() + " — simulated block " + (tip ? tip + 1 : "?"));
    if (socket && socket.readyState === 1) {
      socket.dispatchEvent(new MessageEvent("message", {
        data: JSON.stringify({ blocks: [{ height: (tip || 0) + 1 }] })
      }));
      log.push("  delivered via the page's own socket path");
    } else {
      log.push("  socket not open — the 20s tip poll will pick it up");
    }
    render();
    return tip;
  }

  /* Landing is detected as "the DOM's own tip number went up", not as a class
     name coming and going. sc-block-confirm plays only when the strip isn't
     reduced-motion and already has a pending card to fly; the reduced-motion
     path skips straight to a plain rebuild with no is-confirming phase at
     all, so watching classes would leave a queue waiting on an event that page
     path never produces. Polling the number sideways of that distinction
     covers both.

     Giving up is judged by QUIET, not by a wall clock -- a fixed cap sized for
     a fast connection is what produced a genuine duplicate FIRED in testing:
     mempool.space answered a touch slowly, the real landing was still on its
     way in, and a flat 5s cap gave up on it mid-flight and queued the same
     height again. lastActivity (bumped by every GET, socket push and strip
     change) tells "still working" apart from "actually stuck" regardless of
     how long the real round trip happens to take. The 15s absolute cap only
     exists so a truly dead page can't wedge the queue forever. */
  function afterLanding(tipBefore, cb) {
    var start = Date.now();
    var iv = setInterval(function () {
      var now = currentTip();
      var landed = now !== null && (tipBefore === null || now > tipBefore);
      var quiet = Date.now() - lastActivity > 2500 && Date.now() - start > 3000;
      var overCap = Date.now() - start > 15000;
      if (landed || quiet || overCap) {
        clearInterval(iv);
        if (!landed) log.push("  (queue) gave up waiting for that one to land — continuing");
        render();
        cb();
      }
    }, 150);
  }

  function pump() {
    if (pumping || queue === 0) return;
    pumping = true;
    queue--;
    var tipBefore = currentTip();
    dispatch();
    afterLanding(tipBefore, function () {
      pumping = false;
      pump();
    });
  }

  /* ---- watching the card ------------------------------------------------ */
  var VISIBLE = 0.06;

  function lineName(el) {
    if (el.classList.contains("sc-block-kicker")) return "kicker";
    if (el.classList.contains("sc-block-height")) return "height";
    if (el.classList.contains("sc-block-age")) return "age";
    return el.tagName.toLowerCase();
  }

  /* A line at opacity 0 is perfectly fine while a crossfade clone of it is still
     showing on top, so a position only counts as blank when neither the line nor
     any clone over it contributes anything. */
  function inspect(card) {
    var els = [];
    card.querySelectorAll(".sc-block-kicker,.sc-block-height,.sc-block-age,dt,dd").forEach(function (el) {
      var cs = getComputedStyle(el);
      var r = el.getBoundingClientRect();
      els.push({
        name: lineName(el), text: el.textContent.trim().slice(0, 12),
        op: parseFloat(cs.opacity), vis: cs.visibility,
        w: Math.round(r.width), h: Math.round(r.height),
        cx: r.left + r.width / 2, cy: r.top + r.height / 2,
        clone: el.classList.contains("sc-block-copy-old")
      });
    });
    var blanks = [], real = 0;
    els.filter(function (e) { return !e.clone; }).forEach(function (e) {
      real++;
      if (e.op > VISIBLE && e.vis === "visible" && e.w > 0 && e.h > 0) return;
      var covered = els.some(function (c) {
        return c.clone && c.op > VISIBLE && c.vis === "visible" &&
               Math.abs(c.cy - e.cy) < 6 && Math.abs(c.cx - e.cx) < 30;
      });
      if (!covered) {
        blanks.push(e.name + " \"" + e.text + "\" " +
          (e.vis !== "visible" ? "vis=" + e.vis
           : (e.w < 1 || e.h < 1) ? "rect=" + e.w + "x" + e.h
           : "op=" + e.op.toFixed(2)));
      }
    });
    return {
      blanks: blanks, real: real,
      clones: els.filter(function (e) { return e.clone; }).length,
      promoted: getComputedStyle(card.querySelector(".sc-block-height") || card).transform !== "none"
    };
  }

  function render() {
    var ta = document.getElementById("lab-out");
    if (ta) { ta.value = log.join("\n"); ta.scrollTop = ta.scrollHeight; }
  }

  /* The watchdog below only speaks when the verdict changes, which is right for
     the hours between blocks and wrong for the 1.4 seconds anyone actually came
     here to watch. So while the strip is mid-flight, stream a line per frame-ish
     with the card's live position, width, clone count and -- the point of the
     whole exercise -- whether its text is currently readable. */
  var flightTick = null;
  function streamFlight(wrap) {
    /* One stream at a time. A second block can land while the previous stream is
       still running -- two presses of the button is enough -- and two intervals
       writing from two different t=0 clocks interleave into something unreadable
       that then signs off twice. */
    if (flightTick) clearInterval(flightTick);
    var start = Date.now();
    var sawMissing = false;
    var lastLine = null;
    flightTick = setInterval(function () {
      var card = wrap.querySelector(".sc-block-pending.is-mined") ||
                 wrap.querySelector(".sc-block-confirmed.is-newest") ||
                 wrap.querySelector(".sc-block-pending");
      if (!card) return;
      var r = card.getBoundingClientRect();
      var i = inspect(card);
      var ms = Date.now() - start;
      if (i.blanks.length) sawMissing = true;
      /* x/w/text/clones/layer -- everything but the timestamp. The card sits
         still for most of a 120ms tick once it lands, so without this the tail
         of the stream is the same line dozens of times with nothing but the
         clock moving, which buries the two moments -- the clone handoff, the
         arrival -- that are the actual point of watching it. */
      var line = Math.round(r.left) + "," + Math.round(r.width) + "," +
        (i.real - i.blanks.length) + "/" + i.real + "," + i.clones + "," + i.promoted;
      if (line !== lastLine) {
        lastLine = line;
        log.push("  t=" + String(ms).padStart(4, " ") + "ms" +
          "  x=" + String(Math.round(r.left)).padStart(3, " ") +
          "  w=" + Math.round(r.width) +
          "  text " + (i.real - i.blanks.length) + "/" + i.real +
          "  clones=" + i.clones +
          "  " + (i.promoted ? "promoted" : "flat") +
          (i.blanks.length ? "  <-- MISSING" : ""));
        if (log.length > 160) log = log.slice(-160);
        render();
      }
      if (ms > 2600) {
        clearInterval(flightTick);
        flightTick = null;
        /* Read off the samples rather than asserted. The old line claimed the
           text was intact no matter what the samples had just shown, on a page
           whose entire subject is text going missing. "In every sample" is also
           the strongest claim this can honestly make: at 120ms it watches about
           a dozen moments of the flight, not every frame of it. */
        log.push(sawMissing
          ? "  landed — TEXT WENT MISSING during this flight"
          : "  landed — text readable in every sample");
        render();
      }
    }, 120);
  }

  function watchdog() {
    var last = -1;
    setInterval(function () {
      var wrap = document.getElementById("dash-blocks");
      if (!wrap) return;
      var card = wrap.querySelector(".sc-block-pending.is-mined") ||
                 wrap.querySelector(".sc-block-confirmed.is-newest") ||
                 wrap.querySelector(".sc-block-pending");
      if (!card) return;
      var i = inspect(card);
      if (i.blanks.length === last) return;
      last = i.blanks.length;
      log.push((i.blanks.length ? "!!! TEXT MISSING " : "ok ") + stamp() +
        "  readable " + (i.real - i.blanks.length) + "/" + i.real +
        "  clones=" + i.clones + "  layer=" + (i.promoted ? "promoted" : "flat") +
        (i.blanks.length ? "\n     " + i.blanks.join(" ; ") : ""));
      if (log.length > 120) log = log.slice(-120);
      render();
    }, 400);
  }

  function panel() {
    var box = document.createElement("section");
    box.className = "lab-panel";
    box.setAttribute("aria-labelledby", "lab-panel-title");
    box.innerHTML =
      '<div class="lab-tape" aria-hidden="true"></div>' +
      '<div class="lab-rig">' +
        '<div class="lab-console">' +
          '<h2 id="lab-panel-title">Block confirmation simulator</h2>' +
          '<p class="lab-note">Trigger one <b>simulated</b> block to inspect the confirmation sequence. ' +
            'Prices, fees and network data stay live.</p>' +
          '<p class="lab-offset" id="lab-offset" aria-live="polite"></p>' +
          '<div class="lab-button-bay">' +
            '<button id="lab-fire" class="lab-fire" aria-label="Fire one simulated block"></button>' +
          '</div>' +
        '</div>' +
        '<div class="lab-computer">' +
          '<div class="lab-monitor">' +
            '<div class="lab-monitor-bar"><span></span><b>BLOCK EVENT MONITOR</b><em>LIVE</em></div>' +
            '<textarea id="lab-out" readonly aria-label="Live block event monitor"></textarea>' +
          '</div>' +
          '<div class="lab-monitor-stand" aria-hidden="true"></div>' +
          '<div class="lab-actions">' +
            /* dashboard.html is a plain page load, not a client-side toggle --
               this file's fetch/WebSocket patches and any simulated-block
               offset die with the navigation rather than needing to be undone
               here. That is also why it is a link, not a button with a click
               handler: nothing in this script needs to run when it's used. */
            '<a class="lab-close" href="dashboard.html">Close simulator</a>' +
            /* lab.html (the write-up this linked back to) and the exhibit pages
               are gone -- this demo is now the only lab page left, so there is
               nowhere left for a "back to notes" link to go. */
            '<button id="lab-clear" class="lab-clear">Clear monitor</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="lab-tape lab-tape-bottom" aria-hidden="true"></div>';
    var anchor = document.querySelector(".sc-dash-hero");
    if (anchor) anchor.insertAdjacentElement("beforebegin", box);
    else (document.getElementById("main-content") || document.body).appendChild(box);
    document.getElementById("lab-fire").onclick = queueFire;
    document.getElementById("lab-clear").onclick = function () { log = []; render(); };
  }

  /* The strip's own state machine, said out loud. is-ready is the resting strip
     and is-confirming is the 1.4s flight, so the class list is a running
     commentary on what the page thinks it is doing. */
  function narrate() {
    var wrap = document.getElementById("dash-blocks");
    if (!wrap) return setTimeout(narrate, 300);
    var last = wrap.className;
    log.push("STRIP " + last);
    render();
    new MutationObserver(function () {
      if (wrap.className === last) return;
      lastActivity = Date.now();
      var was = last;
      last = wrap.className;
      log.push("STRIP " + was + "  ->  " + last);
      render();
      if (wrap.classList.contains("is-confirming")) streamFlight(wrap);
    }).observe(wrap, { attributes: true, attributeFilter: ["class"] });
  }

  function start() {
    panel();
    log.push("probe ready. reduced-motion=" + matchMedia("(prefers-reduced-motion: reduce)").matches);
    log.push("watching the page work — requests, socket pushes, strip state, and");
    log.push("a line per frame while a block lands.");
    render();
    narrate();
    watchdog();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else { start(); }
})();

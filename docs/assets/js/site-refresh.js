(() => {
  "use strict";

  /* Page markup is prerendered into docs/*.html from build/content.mjs, so
     this file carries only behaviour. pageKey still gates the per-page bits
     below. */
  const pageKey = document.body.dataset.page || "home";

  /* The one value that cannot be baked at build time without going stale. */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const header = document.getElementById("header");
  if ((pageKey === "home" || pageKey === "dashboard") && header) {
    let headerFadeFrame = 0;
    const updateHeaderFade = () => {
      const fadeDistance = pageKey === "dashboard" ? 100 : 160;
      const progress = Math.min(Math.max(window.scrollY / fadeDistance, 0), 1);
      header.style.setProperty("--sc-header-progress", progress.toFixed(3));
      headerFadeFrame = 0;
    };
    const requestHeaderFade = () => {
      if (!headerFadeFrame) headerFadeFrame = window.requestAnimationFrame(updateHeaderFade);
    };

    updateHeaderFade();
    window.addEventListener("scroll", requestHeaderFade, { passive: true });
  }

  if (pageKey === "home") {
    const pathSection = document.querySelector(".sc-path-section");
    const starField = pathSection?.querySelector(".sc-path-stars");
    const constellation = pathSection?.querySelector(".sc-path-constellation");
    const pathCards = [...(pathSection?.querySelectorAll(".sc-path-options .sc-card") || [])];

    const ambientStars = [
      [3, 8, 3, 0.1, 3.8], [9, 25, 2, 2.7, 4.4], [13, 40, 3, 1.8, 4.2],
      [18, 62, 2, 3.4, 4.9], [22, 13, 4, 2.6, 4.8], [27, 87, 3, 0.4, 4.1],
      [31, 73, 2, 0.9, 3.5], [36, 49, 4, 2, 5.1], [40, 18, 2, 1.3, 3.9],
      [44, 30, 3, 3.1, 4.4], [49, 66, 2, 2.4, 4.6], [52, 88, 4, 1.4, 5],
      [57, 43, 3, 0.7, 3.6], [61, 15, 2, 2.2, 3.7], [65, 76, 3, 3.7, 4.8],
      [69, 59, 4, 0.5, 4.6], [73, 93, 2, 2.5, 4.9], [77, 30, 3, 3.5, 4.1],
      [81, 10, 2, 1.9, 3.8], [85, 79, 4, 1.1, 5.2], [89, 62, 3, 1.6, 4],
      [93, 18, 2, 2.9, 3.9], [96, 49, 4, 0.2, 4.7], [6, 92, 3, 3.8, 4.3],
      [16, 52, 2, 0.6, 3.7], [25, 35, 3, 2.1, 4.5], [48, 6, 2, 3.3, 4],
      [59, 96, 3, 1.2, 4.8], [72, 46, 2, 2.8, 3.6], [91, 91, 3, 0.8, 5]
    ];

    if (starField) {
      starField.innerHTML = ambientStars.map(([x, y, size, delay, duration]) =>
        `<span style="--star-x:${x}%;--star-y:${y}%;--star-size:${size}px;--star-delay:${delay}s;--star-duration:${duration}s"></span>`
      ).join("");
    }

    const constellationPatterns = [
      {
        points: [[8, 55], [28, 34], [47, 52], [68, 22], [91, 38], [72, 75]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 4]]
      },
      {
        points: [[13, 20], [43, 10], [75, 23], [87, 52], [69, 82], [39, 91], [12, 61], [49, 49]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [0, 7], [7, 3]]
      },
      {
        points: [[10, 72], [29, 44], [50, 59], [68, 27], [91, 13], [84, 72], [58, 86]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [6, 2]]
      },
      {
        points: [[8, 46], [27, 19], [48, 35], [67, 12], [91, 36], [73, 61], [88, 84], [48, 80], [24, 66]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [5, 7], [7, 8], [8, 0]]
      }
    ];

    let activeConstellation = -1;
    const renderConstellation = index => {
      if (!constellation || index < 0) return;
      const pattern = constellationPatterns[index % constellationPatterns.length];
      const width = constellation.clientWidth || 330;
      const height = constellation.clientHeight || 170;
      const lines = pattern.edges.map(([start, end], lineIndex) => {
        const [x1, y1] = pattern.points[start];
        const [x2, y2] = pattern.points[end];
        const dx = ((x2 - x1) / 100) * width;
        const dy = ((y2 - y1) / 100) * height;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return `<span class="sc-constellation-line" style="left:${x1}%;top:${y1}%;width:${length}px;transform:rotate(${angle}deg);--line-delay:${lineIndex * 45}ms"></span>`;
      }).join("");
      const stars = pattern.points.map(([x, y], starIndex) =>
        `<span class="sc-constellation-star" style="left:${x}%;top:${y}%;--point-delay:${starIndex * 55}ms"></span>`
      ).join("");

      constellation.classList.remove("is-visible");
      constellation.innerHTML = `${lines}${stars}`;
      window.requestAnimationFrame(() => constellation.classList.add("is-visible"));
      activeConstellation = index;
    };

    const hideConstellation = () => {
      constellation?.classList.remove("is-visible");
      activeConstellation = -1;
    };

    pathCards.forEach((cardElement, index) => {
      cardElement.addEventListener("mouseenter", () => renderConstellation(index));
      cardElement.addEventListener("mouseleave", () => {
        if (!cardElement.contains(document.activeElement)) hideConstellation();
      });
      cardElement.addEventListener("focusin", () => renderConstellation(index));
      cardElement.addEventListener("focusout", () => {
        window.requestAnimationFrame(() => {
          if (!cardElement.contains(document.activeElement)) hideConstellation();
        });
      });
    });

    window.addEventListener("resize", () => {
      if (activeConstellation >= 0) renderConstellation(activeConstellation);
    });
  }

  const nav = document.getElementById("navbar");
  const toggle = document.querySelector(".mobile-nav-toggle");
  const navMenus = [...(nav?.querySelectorAll(".sc-nav-menu") || [])];

  /* Both menus open the same way: neither Guides nor Compare is a page of
     its own, so the whole .sc-nav-menu-toggle is a button that only ever
     opens the list. Their destinations live in the list itself. */
  const menuOpener = menu => menu?.querySelector(".sc-nav-menu-toggle");

  const setNavMenu = (menu, open) => {
    const menuToggle = menuOpener(menu);
    if (!menu || !menuToggle) return;
    menu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  };

  const closeAllNavMenus = except => {
    navMenus.forEach(menu => {
      if (menu !== except) setNavMenu(menu, false);
    });
  };

  navMenus.forEach(menu => {
    const menuToggle = menuOpener(menu);

    menuToggle?.addEventListener("click", event => {
      event.preventDefault();
      const open = !menu.classList.contains("is-open");
      closeAllNavMenus(menu);
      setNavMenu(menu, open);
    });

    menu.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!menu.contains(document.activeElement)) setNavMenu(menu, false);
      });
    });

    menu.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        setNavMenu(menu, false);
        menuToggle?.focus();
      }
    });
  });

  document.addEventListener("click", event => {
    navMenus.forEach(menu => {
      if (!menu.contains(event.target)) setNavMenu(menu, false);
    });
  });

  /**
   * Three classes, not two -- .navbar-mobile (structure), .sc-nav-animating
   * (arms the transition), .sc-nav-visible (the actual open/closed target).
   *
   * An earlier version used just .navbar-mobile + .sc-nav-visible, with the
   * transition declared directly on .navbar-mobile. That put the CSS
   * transition live from the instant .navbar-mobile landed -- which meant
   * it also caught the very first opacity jump, from the no-class default
   * down to 0, and tried to animate *that*. A couple of frames later
   * .sc-nav-visible retargeted it back up to 1, overriding the still-barely-
   * moved fade-to-0 before it had gone anywhere -- so the menu never
   * visibly left opacity 1 and just snapped open. Splitting "the transition
   * is armed" from "the target is visible" into two separate classes, added
   * on two separate frames, gives the browser an actual committed opacity:0
   * frame to interpolate away from.
   *
   * Two rAFs, not one, for the .sc-nav-animating add: a single rAF can
   * still land before the browser's next paint, coalescing the opacity:0
   * (structural) and transition-now-armed styles into one frame with
   * nothing to interpolate from.
   *
   * Closing removes .sc-nav-visible first (transition is still armed, so
   * the fade-out plays), then strips .sc-nav-animating and .navbar-mobile
   * together once NAV_TRANSITION_MS has passed -- doing that immediately
   * would instantly display:none the menu and cut the animation off after
   * one frame. NAV_TRANSITION_MS must match the CSS transition duration on
   * .navbar-mobile.sc-nav-animating in site-refresh.css.
   */
  const NAV_TRANSITION_MS = 280;
  let navCloseTimer = null;

  const openNav = () => {
    clearTimeout(navCloseTimer);
    nav.classList.add("navbar-mobile");
    document.body.classList.add("sc-nav-open");
    toggle.classList.remove("bi-list");
    toggle.classList.add("bi-x");
    toggle.setAttribute("aria-label", "Close navigation");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nav.classList.add("sc-nav-animating");
        nav.classList.add("sc-nav-visible");
      });
    });
  };

  const closeNav = () => {
    clearTimeout(navCloseTimer);
    closeAllNavMenus();
    nav.classList.remove("sc-nav-visible");
    toggle.classList.remove("bi-x");
    toggle.classList.add("bi-list");
    toggle.setAttribute("aria-label", "Open navigation");
    navCloseTimer = setTimeout(() => {
      nav.classList.remove("navbar-mobile", "sc-nav-animating");
      document.body.classList.remove("sc-nav-open");
      navCloseTimer = null;
    }, NAV_TRANSITION_MS);
  };

  const toggleNav = () => {
    if (nav.classList.contains("sc-nav-visible")) {
      closeNav();
    } else {
      openNav();
    }
  };

  toggle.addEventListener("click", toggleNav);
  toggle.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleNav();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("navbar-mobile")) toggleNav();
    });
  });

  /**
   * Hero headline rotation, generic across any page that has one (currently
   * home's "Say NO to ___" and contact's "...without revealing your ___").
   * Only the .sc-hero-flip span's contents rotate -- everything else in the
   * headline is static markup around it. The phrase list lives on the
   * element itself (data-flip-phrases, JSON-encoded) rather than hardcoded
   * here, so every page sharing this markup pattern gets the same rotation
   * behaviour and timing for free instead of duplicating this block. The
   * outgoing phrase drops down and out, the incoming one enters from the
   * top, both driven by CSS transitions on transform/opacity (see
   * .sc-hero-flip-item in site-refresh.css).
   */
  const heroFlip = document.querySelector(".sc-hero-flip");

  if (heroFlip) {
    const flipPhrases = JSON.parse(heroFlip.dataset.flipPhrases || "[]");

    const flipReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let flipIndex = 0;
    let flipActive = heroFlip.querySelector(".sc-hero-flip-item");

    const sizeFlipToContent = () => {
      // Fixes the container's width so it doesn't reflow (shifting the
      // trailing ".") as shorter/longer phrases rotate through. Grid
      // auto-sizing alone isn't enough: it reacts the instant a new phrase
      // is appended, before the slide animation starts, so it would jump
      // to the new width immediately rather than growing with the motion.
      const probe = flipActive.cloneNode(false);
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      probe.style.whiteSpace = "nowrap";
      heroFlip.appendChild(probe);
      let maxWidth = 0;
      flipPhrases.forEach(text => {
        probe.textContent = text;
        maxWidth = Math.max(maxWidth, probe.getBoundingClientRect().width);
      });
      heroFlip.removeChild(probe);
      heroFlip.style.width = `${Math.ceil(maxWidth)}px`;
    };

    sizeFlipToContent();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(sizeFlipToContent, 150);
    });

    const advanceFlip = () => {
      flipIndex = (flipIndex + 1) % flipPhrases.length;
      const incoming = document.createElement("span");
      incoming.className = "sc-hero-flip-item is-entering-start";
      incoming.textContent = flipPhrases[flipIndex];
      heroFlip.appendChild(incoming);

      if (flipReducedMotion) {
        flipActive.remove();
        incoming.classList.remove("is-entering-start");
        incoming.classList.add("is-active");
        flipActive = incoming;
        return;
      }

      // Flush layout so the entering item's start position (translateY(-100%),
      // transition: none) is committed before the transition is switched back
      // on below -- otherwise the browser can coalesce both class changes
      // into a single frame and the slide never renders.
      void incoming.offsetWidth;

      const outgoing = flipActive;
      outgoing.classList.remove("is-active");
      outgoing.classList.add("is-leaving");
      incoming.classList.remove("is-entering-start");
      incoming.classList.add("is-active");
      flipActive = incoming;

      outgoing.addEventListener("transitionend", () => outgoing.remove(), { once: true });
    };

    setInterval(advanceFlip, 3900);
  }


  /**
   * Live Bitcoin dashboard.
   *
   * Everything is read client-side from public, CORS-enabled endpoints --
   * there is no backend here, so each widget degrades on its own: a failed
   * request leaves that tile showing a dash instead of taking the page down.
   *
   * The price history is fetched ONCE (mempool returns hourly points for both
   * CAD and USD in a single response; USD reaches July 2010 while CAD starts
   * later. The result is then sliced in memory
   * for every range button. That is a chunkier first load in exchange for
   * range switching that costs no network round-trip at all.
   */
  if (pageKey === "dashboard") {
    const $ = id => document.getElementById(id);

    const state = {
      history: [],       // [{ t, CAD, USD }] ascending
      currency: "USD",
      range: "7d",
      chartWindow: null,
      hover: null,
      tipHeight: null,
      blockTimers: [],
      projectedBlock: null,
      mempoolStats: null,
      mempoolSocket: null,
      socketReconnectTimer: null,
      socketReconnectMs: 2000,
      socketStopped: false,
      blockRefreshQueued: false,
      lastSocketMessageAt: null,
      /* Fed from separate requests; hashprice needs both plus the price. */
      hashrate: null,
      avgBlockFees: null,
      blockSubsidy: null,
      /* Fine-grained candles for the short ranges, keyed by candle minutes. */
      intraday: {},
      intradayPending: {}
    };

    const RANGE_SECONDS = {
      "24h": 86400,
      "7d": 604800,
      "30d": 2592000,
      "1y": 31536000,
      "3y": 94608000,
      "5y": 157680000,
      "all": Infinity
    };

    /* mempool's history is hourly. Across years that is far more detail than
       the chart can draw, but it leaves the two short ranges looking like a
       handful of straight segments -- 24h is 25 points and 7d is 169, against
       the 800 every longer range gets after downsampling.

       Kraken's OHLC endpoint is CORS-open and returns up to 720 candles, so a
       5-minute call covers 24h with ~288 points and a 15-minute call covers 7d
       with ~672: the same visual density as the rest of the range strip.

       These are real trades, not interpolation between the hourly points --
       which is the whole reason for the request. The cost is that it is one
       venue rather than mempool's aggregate index. Measured against 180
       overlapping hourly points they differ by 0.12% on average (0.24% stdev,
       2.2% worst case in a fast minute), with no bias in either direction:
       mean signed difference +0.03%, Kraken higher in 77 of 180. So it is
       sampling noise between two venues, not drift, and nothing needs
       rebasing -- but it is why the short ranges stay end-to-end Kraken
       rather than having mempool's live tick spliced onto the right edge.
       Splicing across a 0.2% gap would put a fake jag in the last segment,
       and Kraken's newest candle is the one still forming, so the right edge
       is already live. The headline price above the chart stays mempool's, so
       on these two ranges it can sit a tenth of a percent off the last
       plotted point. */
    const RANGE_INTRADAY_MINUTES = { "24h": 5, "7d": 15 };
    const KRAKEN_PAIRS = { USD: "XBTUSD", CAD: "XBTCAD" };
    /* The forming candle carries the live price, so this only controls how
       often the older candles behind it are re-pulled. */
    const INTRADAY_MAX_AGE_MS = 300000;

    const HALVING_INTERVAL = 210000;
    const DISPLAY_SUPPLY_LIMIT = 21000000;

    const fmtMoney = (v, cur) => new Intl.NumberFormat("en-CA", {
      style: "currency", currency: cur,
      currencyDisplay: cur === "USD" ? "narrowSymbol" : "symbol",
      maximumFractionDigits: 0
    }).format(v);

    const fmtMoneyPrecise = (v, cur) => new Intl.NumberFormat("en-CA", {
      style: "currency", currency: cur,
      currencyDisplay: cur === "USD" ? "narrowSymbol" : "symbol",
      minimumFractionDigits: v < 1000 ? 2 : 0, maximumFractionDigits: v < 1000 ? 2 : 0
    }).format(v);

    const fmtInt = v => new Intl.NumberFormat("en-CA").format(Math.round(v));

    const fmtFeeNumber = value => {
      if (value === null || value === undefined || value === "") return "—";
      const fee = Number(value);
      if (!Number.isFinite(fee)) return "—";
      return new Intl.NumberFormat("en-CA", { maximumFractionDigits: 2 }).format(fee);
    };

    const fmtFeeRate = value => {
      const formatted = fmtFeeNumber(value);
      return formatted === "—" ? formatted : formatted + " sat/vB";
    };

    /* feeRange arrives ascending and spans the projected block's cheapest to
       dearest transaction, so the ends are the range the next block is being
       built across. The low end keeps its decimals -- it is routinely under
       1 sat/vB, where they carry the whole value -- while the top end is in
       the tens or hundreds and rounds. Collapsed to one number when a single
       entry or matching ends make a span meaningless. */
    const fmtFeeSpan = range => {
      if (!Array.isArray(range) || !range.length) return "—";
      const lo = fmtFeeNumber(range[0]);
      if (lo === "—") return "—";
      if (range.length === 1) return lo;
      const top = Number(range[range.length - 1]);
      if (!Number.isFinite(top)) return "—";
      const hi = fmtInt(top);
      return lo === hi ? lo : lo + "–" + hi;
    };

    /* Maps 0..1 onto a red-yellow-green ramp: hue does the work while
       lightness climbs, so the bottom is a deep warning red and the top a
       bright green rather than both ending up the same muddy weight.
       Callers pass 0 for the "bad" end, so a scale running the other way
       (fees) just inverts its input.

       The hue is piecewise for two reasons. The midpoint has to land exactly
       on yellow (60deg), and the top has to land on 152deg rather than a
       pure 120deg green -- the site's existing positive green (#6fd8b2 and
       --sc-success) sits at hue ~158, so a 120deg green read as a different
       colour sitting next to it. Saturation and lightness are tuned to the
       same end point, which puts the top of the ramp within a few percent of
       #6fd8b2. */
    const scaleColor = t => {
      const c = Math.min(Math.max(t, 0), 1);
      const hue = c <= 0.5 ? c * 120 : 60 + (c - 0.5) * 184;
      return "hsl(" + Math.round(hue) + ", " +
        Math.round(72 - c * 15) + "%, " +
        Math.round(43 + c * 21) + "%)";
    };

    const fetchJSON = async (url, ms = 12000) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ms);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(res.status);
        return await res.json();
      } finally {
        clearTimeout(timer);
      }
    };

    const fetchText = async (url, ms = 12000) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ms);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(res.status);
        return await res.text();
      } finally {
        clearTimeout(timer);
      }
    };

    /* Count-up so refreshed numbers read as movement rather than a jump cut.
       Reduced-motion visitors get the final value immediately. */
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animateValue = (el, to, format, ms = 620) => {
      if (!el) return;
      const from = Number(el.dataset.val || 0);
      el.dataset.val = String(to);
      if (reduceMotion || !from || from === to) {
        el.textContent = format(to);
        return;
      }
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / ms, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(from + (to - from) * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    /* Tint the figure green/red for a beat when it moves, then let it settle
       back to normal ink -- a permanent tint would just read as a colour
       choice rather than as "this number just changed". */
    let flashTimer = 0;
    const flash = (el, up) => {
      if (!el || reduceMotion) return;
      el.classList.remove("is-up", "is-down");
      void el.offsetWidth;
      el.classList.add(up ? "is-up" : "is-down");
      clearTimeout(flashTimer);
      flashTimer = setTimeout(() => el.classList.remove("is-up", "is-down"), 1400);
    };

    // ---------------------------------------------------------------- chart
    const chartEl = $("dash-chart");
    const svg = $("dash-chart-svg");
    const tip = $("dash-chart-tip");
    const chartState = $("dash-chart-state");
    const zoomReset = $("dash-chart-zoom-reset");
    const zoomPan = $("dash-chart-zoom-pan");
    const zoomPanTrack = $("dash-chart-zoom-pan-track");
    const zoomPanThumb = $("dash-chart-zoom-pan-thumb");
    const NS = "http://www.w3.org/2000/svg";

    let plot = null;   // geometry of the last render, for hit-testing
    let selAnchor = null;  // index a drag-to-measure started from, null when idle
    let touchCrosshairPinned = false;
    let touchTipFadeTimer = 0;
    let touchTipHideTimer = 0;

    const clearTouchTipTimers = () => {
      clearTimeout(touchTipFadeTimer);
      clearTimeout(touchTipHideTimer);
      touchTipFadeTimer = 0;
      touchTipHideTimer = 0;
    };

    /* Kraken returns [time, open, high, low, close, vwap, volume, count] rows
       under a pair key whose name is its own ("XXBTZUSD"), alongside a "last"
       cursor -- hence the key hunt rather than a fixed lookup. Only the close
       matters here; this chart is a line, not candles. */
    const parseKrakenOHLC = data => {
      const result = data && data.result;
      if (!result) return [];
      const pairKey = Object.keys(result).find(k => k !== "last");
      const rows = pairKey ? result[pairKey] : null;
      if (!Array.isArray(rows)) return [];
      return rows
        .map(r => ({ t: Number(r[0]), close: Number(r[4]) }))
        .filter(r => Number.isFinite(r.t) && r.close > 0);
    };

    /* One entry per candle size, both currencies merged onto shared
       timestamps. allSettled so a dead CAD pair still leaves USD usable --
       sourceRows checks the active currency before trusting the entry. */
    const loadIntraday = minutes => {
      const cached = state.intraday[minutes];
      if (cached && Date.now() - cached.fetchedAt < INTRADAY_MAX_AGE_MS) return Promise.resolve(cached);
      if (state.intradayPending[minutes]) return state.intradayPending[minutes];

      /* `since` trims the response to the window actually on screen -- 23KB
         instead of 65KB for 24h -- with a couple of candles of slack so the
         series is guaranteed to start before the range does. */
      const since = Math.floor(Date.now() / 1000) - RANGE_SECONDS[state.range] - minutes * 120;
      const url = cur => "https://api.kraken.com/0/public/OHLC?pair=" + KRAKEN_PAIRS[cur] +
        "&interval=" + minutes + "&since=" + since;

      const request = Promise.allSettled([fetchJSON(url("USD")), fetchJSON(url("CAD"))])
        .then(([usd, cad]) => {
          const merged = new Map();
          const absorb = (settled, cur) => {
            if (settled.status !== "fulfilled") return;
            parseKrakenOHLC(settled.value).forEach(point => {
              const row = merged.get(point.t) || { t: point.t, CAD: 0, USD: 0 };
              row[cur] = point.close;
              merged.set(point.t, row);
            });
          };
          absorb(usd, "USD");
          absorb(cad, "CAD");
          if (merged.size < 3) return null;
          const entry = {
            rows: [...merged.values()].sort((a, b) => a.t - b.t),
            fetchedAt: Date.now()
          };
          state.intraday[minutes] = entry;
          return entry;
        })
        .catch(() => null)
        .finally(() => { delete state.intradayPending[minutes]; });

      state.intradayPending[minutes] = request;
      return request;
    };

    /* Fetch or refresh whatever the active range wants, repainting only when
       a new batch actually landed. Ranges from 30d up have no intraday tier
       and skip the request entirely. */
    const refreshIntraday = () => {
      const minutes = RANGE_INTRADAY_MINUTES[state.range];
      if (!minutes) return;
      const before = state.intraday[minutes];
      loadIntraday(minutes).then(entry => {
        if (!entry || entry === before) return;
        /* The visitor may have moved on while this was in flight. */
        if (RANGE_INTRADAY_MINUTES[state.range] !== minutes) return;
        renderChart(false);
        updateChange();
      });
    };

    /* Which series backs the current range: the fine candles when they are
       loaded, hold the active currency, and reach back far enough to cover
       the whole window -- otherwise the hourly history they stand in for, so
       a failed or half-filled Kraken request is invisible.

       The flag is what stops the change figure from being measured across two
       venues: it reads mempool's live price as its endpoint, which is right
       for a mempool-sourced series and wrong for this one. */
    let sourceIsIntraday = false;
    const sourceRows = () => {
      const key = state.currency;
      const minutes = RANGE_INTRADAY_MINUTES[state.range];
      const entry = minutes ? state.intraday[minutes] : null;
      sourceIsIntraday = false;
      if (entry) {
        const rows = entry.rows.filter(p => p[key] > 0);
        const nowSec = Math.floor(Date.now() / 1000);
        if (rows.length > 2 && rows[0].t <= nowSec - RANGE_SECONDS[state.range] + minutes * 60) {
          sourceIsIntraday = true;
          return rows;
        }
      }
      return state.history.filter(p => p[key] > 0);
    };

    const visibleSeries = () => {
      const cutoff = RANGE_SECONDS[state.range];
      const now = Math.floor(Date.now() / 1000);
      let pts = sourceRows();
      if (state.chartWindow) {
        pts = pts.filter(p => p.t >= state.chartWindow.start && p.t <= state.chartWindow.end);
      } else if (cutoff !== Infinity) {
        pts = pts.filter(p => p.t >= now - cutoff);
      }
      if (pts.length < 2) return pts;
      /* Long ranges hold tens of thousands of hourly points; drawing them all
         costs a lot of path data for sub-pixel detail nobody can see. Stride
         down to a sane ceiling, always keeping the newest point. */
      const MAX = 800;
      if (pts.length > MAX) {
        /* Source density changes from weekly historical points to hourly
           recent points. Sampling by array stride would therefore throw
           away most early history. Pick the nearest point at evenly spaced
           timestamps so every era receives equal visual resolution. */
        const out = [pts[0]];
        const start = pts[0].t;
        const end = pts[pts.length - 1].t;
        let cursor = 1;
        for (let i = 1; i < MAX - 1; i++) {
          const target = start + (i / (MAX - 1)) * (end - start);
          while (cursor < pts.length - 1 && pts[cursor].t < target) cursor++;
          const before = pts[cursor - 1];
          const after = pts[cursor];
          const chosen = Math.abs(before.t - target) <= Math.abs(after.t - target) ? before : after;
          if (out[out.length - 1] !== chosen) out.push(chosen);
        }
        if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
        return out;
      }
      return pts;
    };

    const setChartState = (message, loading) => {
      if (!chartState) return;
      chartState.hidden = false;
      chartState.classList.toggle("is-loading", Boolean(loading));
      const label = chartState.querySelector("span");
      if (label) label.textContent = message;
      else chartState.textContent = message;
    };

    const renderChart = (animate = true) => {
      if (!svg || !chartEl) return;
      const pts = visibleSeries();
      chartEl.classList.toggle("is-zoomed", Boolean(state.chartWindow));
      if (zoomReset) zoomReset.hidden = !state.chartWindow;
      if (zoomPan) zoomPan.hidden = !state.chartWindow;
      const w = chartEl.clientWidth;
      const h = chartEl.clientHeight;
      if (!w || !h) return;

      if (pts.length < 2) {
        svg.replaceChildren();
        /* Still waiting on the one history request = shimmer. Anything else
           (empty range, dead endpoint) is a settled result, so it gets plain
           static text instead of a busy animation. */
        if (state.history.length) setChartState("No price history for this range.", false);
        else setChartState("Loading price history…", true);
        selAnchor = null;
        chartEl.classList.remove("is-measuring", "is-gain", "is-loss");
        if (tip) tip.hidden = true;
        plot = null;
        return;
      }
      if (chartState) chartState.hidden = true;

      const key = state.currency;
      /* The zoom controls live in a reserved strip rather than floating over
         data. Once zoomed, push the plot down far enough that the Reset and
         proportional pan bar can never cover the line or a hovered point. */
      const padL = 10, padR = 66, padT = state.chartWindow ? 58 : 18, padB = 28;
      const plotW = w - padL - padR;
      const plotH = h - padT - padB;

      let min = Infinity, max = -Infinity;
      for (const p of pts) {
        if (p[key] < min) min = p[key];
        if (p[key] > max) max = p[key];
      }
      const span = (max - min) || max || 1;
      min = Math.max(0, min - span * 0.08);
      max += span * 0.08;

      const minT = state.chartWindow ? state.chartWindow.start : pts[0].t;
      const maxT = state.chartWindow ? state.chartWindow.end : pts[pts.length - 1].t;
      const timeSpan = (maxT - minT) || 1;
      const x = i => padL + ((pts[i].t - minT) / timeSpan) * plotW;
      const y = v => padT + (1 - (v - min) / (max - min)) * plotH;

      const line = [];
      for (let i = 0; i < pts.length; i++) {
        line.push((i ? "L" : "M") + x(i).toFixed(1) + " " + y(pts[i][key]).toFixed(1));
      }
      const linePath = line.join(" ");
      const areaPath = linePath + " L" + x(pts.length - 1).toFixed(1) + " " + (padT + plotH) +
                       " L" + x(0).toFixed(1) + " " + (padT + plotH) + " Z";

      const rising = pts[pts.length - 1][key] >= pts[0][key];
      const stroke = rising ? "var(--sc-success)" : "#e2564a";

      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.setAttribute("width", w);
      svg.setAttribute("height", h);

      const make = (tag, attrs, text) => {
        const el = document.createElementNS(NS, tag);
        for (const k in attrs) el.setAttribute(k, attrs[k]);
        if (text != null) el.textContent = text;
        return el;
      };

      const frag = document.createDocumentFragment();

      const defs = make("defs");
      const grad = make("linearGradient", { id: "scChartFill", x1: "0", y1: "0", x2: "0", y2: "1" });
      grad.append(
        make("stop", { offset: "0%", "stop-color": stroke, "stop-opacity": "0.30" }),
        make("stop", { offset: "100%", "stop-color": stroke, "stop-opacity": "0" })
      );
      defs.append(grad);
      frag.append(defs);

      // horizontal guides + right-edge price labels
      const STEPS = 4;
      for (let i = 0; i <= STEPS; i++) {
        const v = min + ((max - min) * i) / STEPS;
        const gy = y(v);
        frag.append(make("line", {
          x1: padL, y1: gy.toFixed(1), x2: (padL + plotW).toFixed(1), y2: gy.toFixed(1),
          stroke: "rgba(255,255,255,0.06)", "stroke-width": "1"
        }));
        frag.append(make("text", {
          x: (padL + plotW + 10).toFixed(1), y: (gy + 4).toFixed(1),
          fill: "var(--sc-muted)", "font-size": "11", "font-weight": "600"
        }, fmtMoney(v, key)));
      }

      // time labels along the bottom
      const labelCapacity = Math.max(3, Math.min(9, Math.floor(plotW / 130) + 1));
      const labelTargets = { "24h": 7, "7d": 7, "30d": 8, "1y": 8, "3y": 9, "5y": 9, "all": 9 };
      const LABELS = Math.min(pts.length, labelCapacity, labelTargets[state.range]);
      for (let i = 0; i < LABELS; i++) {
        const ratio = i / (LABELS - 1);
        const d = new Date((minT + ratio * timeSpan) * 1000);
        let label;
        if (timeSpan <= 172800) {
          label = d.toLocaleTimeString("en-CA", { hour: "numeric", hour12: true });
        } else if (timeSpan > 189216000) {
          label = d.toLocaleDateString("en-CA", { year: "numeric" });
        } else if (timeSpan > 7776000) {
          label = d.toLocaleDateString("en-CA", { month: "short", year: "numeric" });
        } else {
          label = d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
        }
        const tx = Math.min(Math.max(padL + ratio * plotW, padL + 18), padL + plotW - 18);
        frag.append(make("text", {
          x: tx.toFixed(1), y: (h - 8).toFixed(1), fill: "var(--sc-muted)",
          "font-size": "11", "font-weight": "600", "text-anchor": "middle"
        }, label));
      }

      frag.append(make("path", { d: areaPath, fill: "url(#scChartFill)" }));

      /* Drag-to-measure band. Sits between the area fill and the line so the
         highlight reads as behind the price rather than washing over it.
         Hidden until a drag starts. */
      const sel = make("g", { id: "scChartSel", opacity: "0" });
      const selRect = make("rect", {
        y: padT.toFixed(1), height: plotH.toFixed(1), width: "0",
        fill: "rgba(255,255,255,0.08)"
      });
      const selLine = make("line", {
        y1: padT.toFixed(1), y2: (padT + plotH).toFixed(1),
        stroke: "rgba(255,255,255,0.5)", "stroke-width": "1.5"
      });
      const selDot = make("circle", {
        r: "4.5", fill: "var(--sc-paper)", stroke: "rgba(255,255,255,0.85)", "stroke-width": "2"
      });
      sel.append(selRect, selLine, selDot);
      frag.append(sel);

      const path = make("path", {
        d: linePath, fill: "none", stroke: stroke, "stroke-width": "2.25",
        "stroke-linejoin": "round", "stroke-linecap": "round"
      });
      frag.append(path);

      // crosshair, hidden until pointer entry
      const cross = make("g", { id: "scChartCross", opacity: "0" });
      cross.append(make("line", {
        y1: padT, y2: (padT + plotH).toFixed(1), stroke: "rgba(255,255,255,0.35)",
        "stroke-width": "1", "stroke-dasharray": "3 3"
      }));
      cross.append(make("circle", { r: "5", fill: stroke, stroke: "var(--sc-paper)", "stroke-width": "2.5" }));
      frag.append(cross);

      svg.replaceChildren(frag);

      if (animate && !reduceMotion) {
        const len = path.getTotalLength();
        path.style.transition = "none";
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        void path.getBoundingClientRect();
        path.style.transition = "stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)";
        path.style.strokeDashoffset = "0";
      }

      /* A re-render replaces the SVG contents, so any live measurement is
         gone with it -- drop the anchor too or the next pointermove would
         measure from an index belonging to the previous range. */
      selAnchor = null;
      chartEl.classList.remove("is-measuring", "is-gain", "is-loss");
      if (tip) tip.hidden = true;
      plot = { pts, key, x, y, minT, maxT, padL, padR, padT, padB, plotW, plotH, w, h, cross,
               stroke, sel: { g: sel, rect: selRect, line: selLine, dot: selDot } };
      updateZoomPan();
    };

    const idxFromClientX = clientX => {
      const rect = svg.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left - plot.padL) / plot.plotW, 0), 1);
      const target = plot.minT + ratio * (plot.maxT - plot.minT);
      let lo = 0, hi = plot.pts.length - 1;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (plot.pts[mid].t < target) lo = mid + 1;
        else hi = mid;
      }
      if (lo > 0 && Math.abs(plot.pts[lo - 1].t - target) < Math.abs(plot.pts[lo].t - target)) return lo - 1;
      return lo;
    };

    const positionTipAwayFromPoint = (cx, cy, fallbackWidth) => {
      if (!tip || !plot) return;
      const gap = 16;
      const edge = 6;
      const tw = tip.offsetWidth || fallbackWidth;
      const th = tip.offsetHeight || 48;
      const left = Math.min(Math.max(cx - tw / 2, edge), plot.w - tw - edge);
      let top = cy - th - gap;
      if (top < edge) top = cy + gap;
      top = Math.min(Math.max(top, edge), plot.h - th - edge);
      tip.style.left = left + "px";
      tip.style.top = top + "px";
    };

    const moveCrosshair = clientX => {
      if (!plot) return;
      clearTouchTipTimers();
      if (tip) tip.classList.remove("is-fading");
      const idx = idxFromClientX(clientX);
      const p = plot.pts[idx];
      const cx = plot.x(idx), cy = plot.y(p[plot.key]);

      const g = plot.cross;
      g.setAttribute("opacity", "1");
      g.firstChild.setAttribute("x1", cx.toFixed(1));
      g.firstChild.setAttribute("x2", cx.toFixed(1));
      g.lastChild.setAttribute("cx", cx.toFixed(1));
      g.lastChild.setAttribute("cy", cy.toFixed(1));

      if (tip) {
        const d = new Date(p.t * 1000);
        const dateOptions = state.range === "all"
          ? { year: "numeric", month: "short", day: "numeric" }
          : { year: "numeric", month: "short", day: "numeric", hour: "numeric", hour12: true };
        tip.hidden = false;
        tip.innerHTML = "<strong>" + fmtMoneyPrecise(p[plot.key], plot.key) + "</strong><span>" +
          d.toLocaleString("en-CA", dateOptions) + "</span>";
        positionTipAwayFromPoint(cx, cy, 150);
      }
    };

    const hideCrosshair = (fade = false) => {
      touchCrosshairPinned = false;
      clearTouchTipTimers();
      if (plot) plot.cross.setAttribute("opacity", "0");
      if (!tip) return;
      if (fade && !reduceMotion && !tip.hidden) {
        tip.classList.add("is-fading");
        touchTipHideTimer = setTimeout(() => {
          tip.hidden = true;
          tip.classList.remove("is-fading");
          touchTipHideTimer = 0;
        }, 400);
      } else {
        tip.hidden = true;
        tip.classList.remove("is-fading");
      }
    };

    /* Press-and-drag measurement, the way the iOS Stocks chart works: the
       press sets an anchor, dragging measures from there to wherever the
       pointer is now, and the header chip reports that instead of the
       range's own change until the pointer is released. Works in both
       directions -- drag left from the anchor and it measures backwards. */
    const paintSelection = idx => {
      if (!plot || selAnchor === null) return;
      const s = plot.sel;
      const ax = plot.x(selAnchor), cx = plot.x(idx);
      s.g.setAttribute("opacity", "1");
      s.rect.setAttribute("x", Math.min(ax, cx).toFixed(1));
      s.rect.setAttribute("width", Math.abs(cx - ax).toFixed(1));
      s.line.setAttribute("x1", ax.toFixed(1));
      s.line.setAttribute("x2", ax.toFixed(1));
      s.dot.setAttribute("cx", ax.toFixed(1));
      s.dot.setAttribute("cy", plot.y(plot.pts[selAnchor][plot.key]).toFixed(1));

      const from = plot.pts[selAnchor][plot.key];
      const to = plot.pts[idx][plot.key];
      const diff = to - from;
      const up = diff > 0;
      const down = diff < 0;
      const tone = up ? "#35b48a" : down ? "#c94b43" : "#ff8a00";
      const wash = up ? "rgba(53,180,138,0.13)" : down ? "rgba(181,53,47,0.16)" : "rgba(255,138,0,0.11)";
      const sign = up ? "+" : down ? "-" : "";
      const pct = Math.abs(from ? (diff / from) * 100 : 0);

      s.rect.setAttribute("fill", wash);
      s.line.setAttribute("stroke", tone);
      s.dot.setAttribute("stroke", tone);
      plot.cross.lastChild.setAttribute("fill", tone);
      chartEl.classList.toggle("is-gain", up);
      chartEl.classList.toggle("is-loss", down);

      const el = $("dash-change");
      if (el) {
        el.className = "sc-dash-change is-measuring " + (up ? "is-positive" : down ? "is-negative" : "");
        el.innerHTML = "<i class=\"bi bi-arrow-" + (up ? "up-right" : down ? "down-right" : "right") + "\"></i> " +
          sign + pct.toFixed(2) + "% <span>" + sign + fmtMoney(Math.abs(diff), plot.key) + "</span>";
      }

      if (tip) {
        const dateOptions = state.range === "all"
          ? { year: "numeric", month: "short", day: "numeric" }
          : { year: "numeric", month: "short", day: "numeric", hour: "numeric", hour12: true };
        const formatPoint = p => new Date(p.t * 1000).toLocaleString("en-CA", dateOptions);
        tip.innerHTML = "<strong>" + sign + pct.toFixed(2) + "% · " + sign +
          fmtMoneyPrecise(Math.abs(diff), plot.key) + "</strong><span>" +
          formatPoint(plot.pts[selAnchor]) + " → " + formatPoint(plot.pts[idx]) + "</span>";
        positionTipAwayFromPoint(cx, plot.y(to), 210);
      }
    };

    const endSelection = (event, canceled = false) => {
      if (selAnchor === null) return;
      selAnchor = null;
      if (plot && plot.sel) plot.sel.g.setAttribute("opacity", "0");
      if (plot && plot.cross) plot.cross.lastChild.setAttribute("fill", plot.stroke);
      chartEl.classList.remove("is-measuring", "is-gain", "is-loss");
      updateChange();
      if (canceled) hideCrosshair();
      else if (event && Number.isFinite(event.clientX)) {
        moveCrosshair(event.clientX);
        /* Touch and pen devices have no hover state. Keep the released point
           briefly, restarting the timeout each time another point is used. */
        touchCrosshairPinned = event.pointerType !== "mouse";
        if (touchCrosshairPinned) {
          touchTipFadeTimer = setTimeout(() => hideCrosshair(true), 4000);
        }
      }
    };

    /* Bounds for the selected preset. Wheel zoom may move inside these
       limits, but never expands beyond the range the visitor chose. */
    const presetBounds = () => {
      const rows = sourceRows();
      if (rows.length < 2) return null;
      const cutoff = RANGE_SECONDS[state.range];
      const end = rows[rows.length - 1].t;
      const start = cutoff === Infinity
        ? rows[0].t
        : Math.max(rows[0].t, Math.floor(Date.now() / 1000) - cutoff);
      return { start, end };
    };

    const resetChartZoom = (animate = false) => {
      if (!state.chartWindow) return;
      state.chartWindow = null;
      hideCrosshair();
      renderChart(animate);
      updateChange();
    };

    const updateZoomPan = () => {
      if (!zoomPan || !zoomPanThumb || !state.chartWindow) return;
      const bounds = presetBounds();
      if (!bounds) return;
      const baseSpan = bounds.end - bounds.start;
      const viewSpan = state.chartWindow.end - state.chartWindow.start;
      if (baseSpan <= 0 || viewSpan <= 0) return;

      const available = Math.max(baseSpan - viewSpan, 1);
      const position = Math.round(Math.min(Math.max((state.chartWindow.start - bounds.start) / available, 0), 1) * 100);
      const trackWidth = zoomPanTrack ? zoomPanTrack.clientWidth : 0;
      if (trackWidth) {
        const visibleRatio = Math.min(Math.max(viewSpan / baseSpan, 0), 1);
        const thumbWidth = Math.min(trackWidth, Math.max(18, trackWidth * visibleRatio));
        zoomPanThumb.style.width = thumbWidth + "px";
        zoomPanThumb.style.left = ((position / 100) * (trackWidth - thumbWidth)) + "px";
      }
      const date = seconds => new Date(seconds * 1000).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
      zoomPan.setAttribute("aria-valuenow", String(position));
      zoomPan.setAttribute("aria-valuetext", date(state.chartWindow.start) + " to " + date(state.chartWindow.end));
    };

    const setChartPan = ratio => {
      if (!state.chartWindow) return;
      const bounds = presetBounds();
      if (!bounds) return;
      const viewSpan = state.chartWindow.end - state.chartWindow.start;
      const available = Math.max((bounds.end - bounds.start) - viewSpan, 0);
      const start = bounds.start + Math.min(Math.max(ratio, 0), 1) * available;
      state.chartWindow = { start: Math.round(start), end: Math.round(start + viewSpan) };
      hideCrosshair();
      renderChart(false);
      updateZoomPan();
      updateChange();
    };

    const applyChartZoom = (deltaY, clientX) => {
      if (!plot || !deltaY) return;
      const bounds = presetBounds();
      if (!bounds) return;

      const baseSpan = bounds.end - bounds.start;
      const currentStart = state.chartWindow ? state.chartWindow.start : plot.minT;
      const currentEnd = state.chartWindow ? state.chartWindow.end : plot.maxT;
      const currentSpan = currentEnd - currentStart;
      if (baseSpan <= 0 || currentSpan <= 0) return;

      const rect = svg.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left - plot.padL) / plot.plotW, 0), 1);
      const anchor = currentStart + ratio * currentSpan;
      const pointStep = currentSpan / Math.max(plot.pts.length - 1, 1);
      const minSpan = Math.min(baseSpan, Math.max(21600, pointStep * 4));
      const normalizedDelta = Math.min(Math.max(deltaY, -240), 240);
      const factor = Math.exp(normalizedDelta * 0.0018);
      const nextSpan = Math.min(baseSpan, Math.max(minSpan, currentSpan * factor));

      if (nextSpan >= baseSpan * 0.995) {
        resetChartZoom(false);
        return;
      }
      if (Math.abs(nextSpan - currentSpan) < 1) return;

      let start = anchor - ratio * nextSpan;
      let end = start + nextSpan;
      if (start < bounds.start) {
        end += bounds.start - start;
        start = bounds.start;
      }
      if (end > bounds.end) {
        start -= end - bounds.end;
        end = bounds.end;
      }

      state.chartWindow = { start: Math.round(start), end: Math.round(end) };
      renderChart(false);
      updateZoomPan();
      updateChange();
      moveCrosshair(clientX);
    };

    let zoomRaf = 0;
    let zoomDelta = 0;
    let zoomClientX = 0;

    if (svg) {
      svg.addEventListener("pointerdown", e => {
        if (!plot) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        touchCrosshairPinned = false;
        selAnchor = idxFromClientX(e.clientX);
        chartEl.classList.add("is-measuring");
        chartEl.classList.remove("is-gain", "is-loss");
        /* Capture so a drag that leaves the SVG keeps reporting, and so the
           release is heard even if it happens outside the chart. Guarded
           because setPointerCapture throws if the pointer is already gone by
           the time this runs -- without the guard that throw would skip the
           two paint calls below and the band would not appear until the
           first move. Losing capture only costs us drags that wander off the
           element, so it is not worth failing the whole interaction over. */
        try {
          if (svg.setPointerCapture) svg.setPointerCapture(e.pointerId);
        } catch (err) { /* keep measuring without capture */ }
        moveCrosshair(e.clientX);
        paintSelection(selAnchor);
        e.preventDefault();
      });
      svg.addEventListener("pointermove", e => {
        moveCrosshair(e.clientX);
        if (selAnchor !== null) {
          paintSelection(idxFromClientX(e.clientX));
          if (e.cancelable) e.preventDefault();
        }
      });
      svg.addEventListener("pointerup", e => endSelection(e));
      svg.addEventListener("pointercancel", e => endSelection(e, true));
      svg.addEventListener("lostpointercapture", e => endSelection(e, true));
      svg.addEventListener("pointerleave", () => {
        /* Mid-drag the pointer is captured, so a leave here is just the
           cursor wandering off an idle chart. */
        if (selAnchor === null && !touchCrosshairPinned) hideCrosshair();
      });
      svg.addEventListener("wheel", e => {
        if (!plot) return;
        const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? plot.h : 1;
        zoomDelta += e.deltaY * unit;
        zoomClientX = e.clientX;
        if (!zoomRaf) {
          zoomRaf = requestAnimationFrame(() => {
            const delta = zoomDelta;
            const clientX = zoomClientX;
            zoomDelta = 0;
            zoomRaf = 0;
            applyChartZoom(delta, clientX);
          });
        }
        e.preventDefault();
      }, { passive: false });
      svg.addEventListener("dblclick", e => {
        resetChartZoom(false);
        e.preventDefault();
      });
    }

    if (zoomReset) zoomReset.addEventListener("click", () => resetChartZoom(false));

    if (zoomPan && zoomPanTrack && zoomPanThumb) {
      let panPointer = null;
      let panGrabOffset = 0;

      const panFromPointer = clientX => {
        const trackRect = zoomPanTrack.getBoundingClientRect();
        const thumbRect = zoomPanThumb.getBoundingClientRect();
        const travel = Math.max(trackRect.width - thumbRect.width, 0);
        if (!travel) return;
        const left = Math.min(Math.max(clientX - trackRect.left - panGrabOffset, 0), travel);
        setChartPan(left / travel);
      };

      zoomPan.addEventListener("pointerdown", e => {
        if (!state.chartWindow || e.button !== 0) return;
        const thumbRect = zoomPanThumb.getBoundingClientRect();
        panPointer = e.pointerId;
        panGrabOffset = e.target === zoomPanThumb
          ? e.clientX - thumbRect.left
          : thumbRect.width / 2;
        try { zoomPan.setPointerCapture(e.pointerId); } catch (err) { /* continue without capture */ }
        zoomPan.classList.add("is-dragging");
        panFromPointer(e.clientX);
        e.preventDefault();
      });
      zoomPan.addEventListener("pointermove", e => {
        if (panPointer !== e.pointerId) return;
        panFromPointer(e.clientX);
        e.preventDefault();
      });
      const endPan = e => {
        if (panPointer !== e.pointerId) return;
        panPointer = null;
        zoomPan.classList.remove("is-dragging");
      };
      zoomPan.addEventListener("pointerup", endPan);
      zoomPan.addEventListener("pointercancel", endPan);
      zoomPan.addEventListener("lostpointercapture", endPan);
      zoomPan.addEventListener("keydown", e => {
        if (!state.chartWindow) return;
        const current = Number(zoomPan.getAttribute("aria-valuenow")) / 100;
        let next = current;
        if (e.key === "ArrowLeft") next -= 0.04;
        else if (e.key === "ArrowRight") next += 0.04;
        else if (e.key === "PageUp") next -= 0.2;
        else if (e.key === "PageDown") next += 0.2;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = 1;
        else return;
        setChartPan(next);
        e.preventDefault();
      });
    }

    document.addEventListener("pointerdown", e => {
      if (touchCrosshairPinned && chartEl && !chartEl.contains(e.target)) hideCrosshair(true);
    }, true);

    if ("ResizeObserver" in window && chartEl) {
      let raf = 0;
      new ResizeObserver(() => {
        if (raf) return;
        raf = requestAnimationFrame(() => { raf = 0; renderChart(false); });
      }).observe(chartEl);
    }

    // ------------------------------------------------------------- controls

    /* The active pill is one element that slides, so its position has to be
       measured from the live button rather than declared in CSS. Re-measured
       on resize and once webfonts land, since both change button widths. */
    const segs = [...document.querySelectorAll(".sc-seg")];

    const positionThumb = (seg, animate = true) => {
      const thumb = seg.querySelector(".sc-seg-thumb");
      const active = seg.querySelector(".sc-seg-btn.is-active");
      if (!thumb || !active) return;
      if (!animate) thumb.style.transition = "none";
      thumb.style.width = active.offsetWidth + "px";
      thumb.style.transform = "translateX(" + active.offsetLeft + "px)";
      thumb.classList.add("is-ready");
      if (!animate) {
        void thumb.offsetWidth;
        thumb.style.transition = "";
      }
    };

    const positionAllThumbs = (animate = false) => segs.forEach(s => positionThumb(s, animate));

    positionAllThumbs(false);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => positionAllThumbs(false));
    }
    window.addEventListener("resize", () => positionAllThumbs(false), { passive: true });

    document.querySelectorAll("[data-range]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.range = btn.dataset.range;
        state.chartWindow = null;
        document.querySelectorAll("[data-range]").forEach(b => b.classList.toggle("is-active", b === btn));
        positionThumb(btn.closest(".sc-seg"));
        hideCrosshair();
        renderChart(true);
        updateChange();
        /* 24h and 7d each want their own candle size; both repaint again when
           the finer series lands. */
        refreshIntraday();
      });
    });

    document.querySelectorAll("[data-cur]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.currency = btn.dataset.cur;
        document.querySelectorAll("[data-cur]").forEach(b => b.classList.toggle("is-active", b === btn));
        positionThumb(btn.closest(".sc-seg"));
        hideCrosshair();
        renderChart(true);
        paintPrice();
        updateChange();
        /* Both are quoted in the selected currency, so they have to follow the
           toggle -- the Mayer number itself will not move, being a ratio, but
           the average underneath it is money. */
        paintMovingAverages();
        paintMayerMultiple();
        paintDrawdown();
        paintHashprice();
      });
    });

    /* Flips the sats tile between "sats per dollar" and "dollars per sat".
       The stored count-up baseline is cleared first: animating between 1,105
       and 0.0009 would just be a meaningless blur of digits. */
    let satsInverted = false;
    const satsSwap = $("dash-sats-swap");
    if (satsSwap) {
      satsSwap.addEventListener("click", () => {
        satsInverted = !satsInverted;
        satsSwap.classList.toggle("is-flipped", satsInverted);
        const sats = $("dash-sats");
        if (sats) delete sats.dataset.val;
        paintPrice();
      });
    }

    // ---------------------------------------------------------------- price
    let latest = { CAD: 0, USD: 0 };

    const paintPrice = () => {
      const cur = state.currency;
      const alt = cur === "CAD" ? "USD" : "CAD";
      const el = $("dash-price");
      if (!latest[cur]) return;
      if (el.querySelector(".sc-dash-skel")) el.textContent = "";
      animateValue(el, latest[cur], v => fmtMoney(v, cur));
      const altEl = $("dash-price-alt");
      if (altEl) {
        const converted = fmtMoney(latest[alt], alt);
        altEl.textContent = alt + " " + converted;
      }

      const sats = $("dash-sats");
      if (sats && latest[cur]) {
        const perDollar = 100000000 / latest[cur];
        const satCentParity = latest[cur] / 1000000 * 100;
        const title = $("dash-sats-title");

        if (satsInverted) {
          /* The same relationship read the other way: what a single satoshi
             costs. Six decimals because at these prices a sat is a fraction
             of a cent and rounding to cents would just show $0.00. */
          if (title) title.textContent = "Dollars per sat";
          animateValue(sats, latest[cur] / 100000000, v => "$" + v.toFixed(6));
        } else {
          if (title) title.textContent = "Sats per dollar";
          animateValue(sats, perDollar, v => fmtInt(v) + " sats");
        }

        const bar = $("dash-sats-bar");
        const parity = $("dash-sats-parity");
        /* One sat equalling one cent means a 1,000,000-unit BTC price in the
           selected currency. This gives the bar a stable, understandable
           milestone and does not change when the displayed units are flipped. */
        if (bar) bar.style.width = Math.min(satCentParity, 100) + "%";
        if (parity) parity.textContent = satCentParity.toFixed(1) + "%";

        /* The same rate five years back, which is the one comparison here that
           is not just the headline restated: it says which way the currency
           has moved against bitcoin, not what today's number is in other
           units. Five rather than one because a single year is mostly noise at
           this volatility, while five covers a halving and reads as a trend. */
        const yearEl = $("dash-sats-year");
        if (yearEl) {
          const then = closeAgo(365 * 5, cur);
          yearEl.textContent = then ? fmtInt(100000000 / then) + " sats" : "—";
        }
      }
    };

    const updateChange = () => {
      const el = $("dash-change");
      if (!el) return;
      const pts = visibleSeries();
      if (pts.length < 2) { el.textContent = ""; return; }
      const key = state.currency;
      const first = pts[0][key];
      const seriesEnd = pts[pts.length - 1][key];
      const last = (state.chartWindow || sourceIsIntraday) ? seriesEnd : (latest[key] || seriesEnd);
      const diff = last - first;
      const pct = (diff / first) * 100;
      const up = diff >= 0;
      const labels = { "24h": "24h", "7d": "7 days", "30d": "30 days", "1y": "1 year", "3y": "3 years", "5y": "5 years", "all": "all time" };
      el.className = "sc-dash-change " + (up ? "is-positive" : "is-negative");
      el.innerHTML = "<i class=\"bi bi-arrow-" + (up ? "up" : "down") + "-right\"></i> " +
        (up ? "+" : "") + pct.toFixed(2) + "% <span>" + (state.chartWindow ? "visible range" : labels[state.range]) + "</span>";
    };

    const stampQuery = window.matchMedia("(max-width: 767px)");

    /* Held so the string can be rebuilt at a new width without inventing a
       fresher update time than the last one we actually received. */
    let stampedAt = null;

    const renderStamp = () => {
      const el = $("dash-updated");
      if (!el || !stampedAt) return;
      const time = stampedAt.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
      const compactTime = time.replace(/[.\s]/g, "").toLowerCase();
      /* Just the time after the label. "updated" said nothing the timestamp
         beside a live indicator did not already imply. */
      el.textContent = stampQuery.matches ? "Live " + compactTime : "Live · " + time;
    };

    const stamp = () => {
      stampedAt = new Date();
      renderStamp();
      const status = $("dash-status");
      if (status) status.classList.add("is-live");
    };

    /* The compact/full choice is made when the stamp is written, so a rotation
       between polls would otherwise leave the wrong-length string in place. */
    if (stampQuery.addEventListener) stampQuery.addEventListener("change", renderStamp);
    else stampQuery.addListener(renderStamp);

    // ----------------------------------------------------------- data loads
    const fillHistoricalCad = async () => {
      const fx = await fetchJSON(
        "https://api.frankfurter.dev/v1/2010-01-01..2015-12-31?base=USD&symbols=CAD",
        25000
      );
      const dailyRates = Object.entries((fx && fx.rates) || {})
        .map(([date, rates]) => ({
          t: Math.floor(new Date(date + "T00:00:00Z").getTime() / 1000),
          rate: Number(rates && rates.CAD)
        }))
        .filter(item => Number.isFinite(item.t) && item.rate > 0)
        .sort((a, b) => a.t - b.t);

      if (!dailyRates.length) return false;

      let rateIndex = 0;
      let latestRate = dailyRates[0].rate;
      let filled = 0;
      state.history.forEach(row => {
        while (rateIndex + 1 < dailyRates.length && dailyRates[rateIndex + 1].t <= row.t) {
          rateIndex += 1;
          latestRate = dailyRates[rateIndex].rate;
        }
        if (!(row.CAD > 0) && row.USD > 0 && row.t >= dailyRates[0].t) {
          row.CAD = row.USD * latestRate;
          row.CADDerived = true;
          filled += 1;
        }
      });
      return filled > 0;
    };

    const loadHistory = async () => {
      try {
        const data = await fetchJSON("https://mempool.space/api/v1/historical-price?currency=CAD", 25000);
        const rows = (data && data.prices) || [];
        state.history = rows
          .map(r => ({ t: r.time, CAD: r.CAD, USD: r.USD }))
          .filter(r => r.t)
          .sort((a, b) => a.t - b.t);
        renderChart(true);
        updateChange();
        try {
          if (await fillHistoricalCad()) {
            renderChart(false);
            updateChange();
          }
        } catch (fxError) {
          // Native CAD history still renders if the optional historical FX lookup fails.
        }
        /* First point at which the long averages can be worked out at all --
           they need years of closes, and this is what fetches them. paintPrice
           is in the list because the sats tile's five-year comparison reads the
           same history, and the price poll that normally drives that tile
           finishes long before this request does. */
        paintPrice();
        paintMovingAverages();
        paintMayerMultiple();
        paintDrawdown();
        paintHashprice();
      } catch (err) {
        setChartState("Price history is unavailable right now.", false);
      }
    };

    const loadPrices = async () => {
      try {
        const p = await fetchJSON("https://mempool.space/api/v1/prices");
        const prev = latest[state.currency];
        latest = { CAD: p.CAD, USD: p.USD };
        paintPrice();
        if (prev && p[state.currency] !== prev) flash($("dash-price"), p[state.currency] > prev);

        /* Fold the live tick into the series so the chart's right edge and the
           headline number never disagree. Same hour updates in place; a new
           hour appends. */
        if (state.history.length) {
          const last = state.history[state.history.length - 1];
          const nowSec = Math.floor(Date.now() / 1000);
          if (nowSec - last.t < 3600) {
            last.CAD = p.CAD; last.USD = p.USD;
          } else {
            state.history.push({ t: nowSec, CAD: p.CAD, USD: p.USD });
          }
          renderChart(false);
        }
        updateChange();
        /* A no-op while the cached candles are still fresh. */
        refreshIntraday();
        /* Keep both long-term averages aligned with the active currency. */
        paintMovingAverages();
        paintMayerMultiple();
        paintDrawdown();
        paintHashprice();
        stamp();
      } catch (err) { /* leave the last good value on screen */ }
    };

    const paintLowestNextBlockFee = projected => {
      const lowestFee = projected && Array.isArray(projected.feeRange)
        ? Number(projected.feeRange[0])
        : NaN;
      if (!Number.isFinite(lowestFee)) return;
      const feeEl = $("dash-fee");
      animateValue(feeEl, lowestFee, v => fmtFeeRate(v));
      /* Cheap is good here: keep the same green-to-red scale used before,
         but apply it to the projected entry floor rather than High priority. */
      if (feeEl) feeEl.style.color = scaleColor(1 - Math.min(lowestFee, 100) / 100);
    };

    /* Touch drags the strip natively and a trackpad can swipe it, but a mouse
       can do neither: the scrollbar is hidden, so without this the blocks past
       the right-hand fade cannot be reached at all. Pointer events rather than
       mouse ones, so a stylus behaves too; touch is left to the browser, which
       already does it better than this would.

       The wrinkle is that every card is a link. A press that turns into a drag
       must scroll and then NOT open a block when the button comes up, while a
       press that stays put must still follow the link. A few pixels of slop
       separates the two. */
    /* Five taps on the strip's backdrop opens the block simulator -- the same
       strip, plus a button that confirms a block on demand and a monitor
       narrating what the page does about it. The write-up of how the blank-card
       bug was found is one link away from there, rather than in the way.

       Deliberately unlinked from anywhere else on the site. Taps that land on a
       card are ignored, because those are links to mempool.space and stealing
       them would break the strip's actual job. The window resets after a
       second, so ordinary poking at the page never accumulates five. */
    const bindLabEasterEgg = stage => {
      if (!stage) return;
      let taps = 0;
      let reset = null;
      stage.addEventListener("click", e => {
        if (e.target.closest(".sc-block")) return;
        taps += 1;
        clearTimeout(reset);
        if (taps >= 5) {
          taps = 0;
          window.location.href = "lab-demo.html";
          return;
        }
        reset = setTimeout(() => { taps = 0; }, 1000);
      });
    };

    const bindBlocksDrag = wrap => {
      const DRAG_SLOP = 5;
      /* Glide tuning. Speeds are pointer pixels per millisecond; the cap keeps
         a violent flick from teleporting the strip and the floor decides what
         is too slow to be worth coasting at all. GLIDE_REACH turns a release
         speed into a distance -- at the cap, a throw of a little over 400px. */
      const GLIDE_MAX_SPEED = 2.5;
      const GLIDE_MIN_SPEED = 0.015;
      const GLIDE_REACH = 170;
      const GLIDE_MIN_MS = 260;
      const GLIDE_MAX_MS = 900;
      /* scrollLeft lands on whole pixels, so the very end of any easing curve
         asks for fractions of a pixel per frame and gets rounded into a 1, 0,
         1, 0 stutter -- worse on a high-refresh display, where the frames are
         shorter and the fractions smaller. Finish the moment the target is
         this close instead: the curve is doing under a pixel a frame by then,
         so closing the gap in one step cannot be seen, and skipping the crawl
         is what actually makes the ending read as smooth. */
      const GLIDE_SETTLE_PX = 2;
      /* How long a pointer may sit still before its last reading is treated as
         stale rather than as speed. */
      const GLIDE_STALE_MS = 100;

      let pointerId = null;
      let startX = 0;
      let startScroll = 0;
      let dragging = false;
      let swallowClick = false;
      let velocity = 0;
      let lastX = 0;
      let lastT = 0;
      let glideFrame = 0;

      const stopGlide = () => {
        if (glideFrame) cancelAnimationFrame(glideFrame);
        glideFrame = 0;
      };

      /* Eases to a landing point rather than bleeding speed off frame by
         frame. A decay loop has to quit at some floor while the strip is still
         moving, and that leftover speed is the abrupt part -- it also reaches
         either end of the row at full tilt and stops against it. Working out
         where the coast should land, clamping that into range, then easing to
         it makes the arrival the curve's own ending: an ease-out cubic is at
         exactly zero speed as it finishes, so the strip settles rather than
         stops, and settles into the boundary the same way instead of hitting
         it. Being a function of elapsed time it also self-corrects -- a tab
         backgrounded mid-glide resumes at the right place rather than
         integrating one enormous frame. */
      const glide = () => {
        const speed = Math.max(-GLIDE_MAX_SPEED, Math.min(GLIDE_MAX_SPEED, -velocity));
        const from = wrap.scrollLeft;
        const limit = wrap.scrollWidth - wrap.clientWidth;
        const to = Math.max(0, Math.min(limit, from + speed * GLIDE_REACH));
        const span = to - from;
        if (Math.abs(span) < 1) return;
        /* Tied to distance, so a nudge does not take as long to settle as a
           full-length throw. */
        const duration = Math.max(GLIDE_MIN_MS, Math.min(GLIDE_MAX_MS, Math.abs(span) * 1.7));
        const start = performance.now();
        const step = now => {
          const t = Math.min(1, (now - start) / duration);
          /* Squared rather than cubed: both finish at zero speed, but the
             gentler curve spends far less of its length below a pixel a
             frame, which is the stretch that cannot be drawn smoothly. */
          const remaining = span * Math.pow(1 - t, 2);
          if (t >= 1 || Math.abs(remaining) < GLIDE_SETTLE_PX) {
            wrap.scrollLeft = to;
            glideFrame = 0;
            return;
          }
          wrap.scrollLeft = to - remaining;
          glideFrame = requestAnimationFrame(step);
        };
        glideFrame = requestAnimationFrame(step);
      };

      wrap.addEventListener("pointerdown", e => {
        if (e.pointerType === "touch" || e.button !== 0) return;
        /* Catching a moving strip should stop it where it is, the way it does
           on a phone. */
        stopGlide();
        pointerId = e.pointerId;
        startX = e.clientX;
        startScroll = wrap.scrollLeft;
        dragging = false;
        velocity = 0;
        lastX = e.clientX;
        lastT = e.timeStamp;
        /* Any press begins a fresh gesture, so a suppression left armed by a
           drag whose click never arrived cannot eat this one's. */
        swallowClick = false;
      });

      wrap.addEventListener("pointermove", e => {
        if (pointerId === null || e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        if (!dragging) {
          if (Math.abs(dx) < DRAG_SLOP) return;
          dragging = true;
          wrap.classList.add("is-dragging");
          /* Capture so the drag survives the pointer leaving the strip. It
             throws if the pointer is no longer active, which is a race we
             cannot prevent and do not need to survive -- losing capture only
             means the drag ends early if the cursor leaves. */
          try { wrap.setPointerCapture(pointerId); } catch (err) { /* not captured */ }
        }
        /* Weighted towards the newest sample so the glide follows the flick at
           the end of the gesture rather than its average over the whole drag --
           dragging slowly across and snapping at the last moment should throw
           the strip, and a raw average would swallow that. */
        const dt = e.timeStamp - lastT;
        if (dt > 0) {
          velocity = ((e.clientX - lastX) / dt) * 0.7 + velocity * 0.3;
          lastX = e.clientX;
          lastT = e.timeStamp;
        }
        wrap.scrollLeft = startScroll - dx;
        e.preventDefault();
      });

      const endDrag = e => {
        if (pointerId === null || e.pointerId !== pointerId) return;
        try {
          if (wrap.hasPointerCapture(pointerId)) wrap.releasePointerCapture(pointerId);
        } catch (err) { /* already released with the pointer */ }
        pointerId = null;
        if (!dragging) return;
        dragging = false;
        wrap.classList.remove("is-dragging");
        swallowClick = true;
        /* A stationary pointer sends no events, so velocity still holds
           whatever the last movement was -- without this, dragging somewhere,
           pausing, and letting go would fling the strip on a reading taken
           who knows how long ago. Going quiet is how a person says stop. */
        if (e.timeStamp - lastT > GLIDE_STALE_MS) velocity = 0;
        if (!reduceMotion && Math.abs(velocity) > GLIDE_MIN_SPEED) glide();
      };

      wrap.addEventListener("pointerup", endDrag);
      wrap.addEventListener("pointercancel", endDrag);

      /* Capture phase: the click has to die before it reaches the card. */
      wrap.addEventListener("click", e => {
        if (!swallowClick) return;
        swallowClick = false;
        e.preventDefault();
        e.stopPropagation();
      }, true);
    };

    /* The phone aura is painted on the stage rather than inside the scroller
       -- overflow-x:auto would clip it -- so it does not move when the strip
       is scrolled, and the glow detaches from the pending card it belongs to.
       Feed the scroll offset back so it tracks the card. */
    let blocksOverflowBound = false;
    const syncBlocksOverflow = () => {
      const wrap = $("dash-blocks");
      const stage = wrap && wrap.closest(".sc-blocks-top");
      const box = wrap && wrap.closest(".sc-blocks-container");
      if (!stage) return;
      /* Measured against the container's right gutter rather than the
         scroller's own overflow. scrollWidth would answer a different
         question: the scroll box is 56px wider than the container on each
         side, so a card sitting in that margin still overflows the gutter the
         fade is drawn on while the scroller reports room to spare. The fade
         has to clear once the last block is inside that gutter, or the oldest
         block could never be read at the end of the row. */
      const cards = wrap.querySelectorAll(".sc-block");
      if (box && cards.length) {
        const gutter = box.getBoundingClientRect().right - parseFloat(getComputedStyle(box).paddingRight);
        const lastRight = cards[cards.length - 1].getBoundingClientRect().right;
        stage.classList.toggle("has-more-blocks", lastRight > gutter + 1);
      }
      stage.classList.toggle("has-scrolled-blocks", wrap.scrollLeft > 1);
      stage.style.setProperty("--sc-blocks-scroll", wrap.scrollLeft + "px");
      if (!blocksOverflowBound) {
        blocksOverflowBound = true;
        wrap.addEventListener("scroll", syncBlocksOverflow, { passive: true });
        window.addEventListener("resize", () => { sizeBlockGhost(); syncBlocksOverflow(); measureBlocksFade(); });
        /* Bound to the scroller itself, which renderStrip() reuses -- it
           replaces the cards inside, never this element -- so this survives
           every rebuild without rebinding. */
        bindBlocksDrag(wrap);
        bindLabEasterEgg(stage);
      }
    };

    /* The container box runs well past the cards -- the scroller carries 56px
       of padding so the pending block's glow has somewhere to render, and the
       price heading is pulled up into that space. A full-height fade therefore
       washed over the "Live" chip's right end. Bound it to the cards instead;
       measuring beats per-breakpoint constants, since the stage padding, the
       scroller padding and the negative margins all differ by breakpoint. */
    /* The decorative continuation card is intentionally only a sliver. Keep
       it a little more visible on larger screens, but never let spare row width
       turn it into another full card. Its height follows the pending card so
       the two orange edges always line up. */
    const sizeBlockGhost = () => {
      const wrap = $("dash-blocks");
      const box = wrap && wrap.closest(".sc-blocks-container");
      const ghost = wrap && wrap.querySelector(".sc-block-ghost");
      const pending = wrap && wrap.querySelector(".sc-block-pending");
      if (!box || !ghost || !pending) return;

      const pendingHeight = pending.getBoundingClientRect().height;
      if (pendingHeight) ghost.style.height = pendingHeight + "px";

      /* 767px, matching the stylesheet's own mobile breakpoint, not 575.
         Everything that dresses this sliver -- its dissolve, its radius, the
         card widths it is sized against -- switches at 767px, so sizing it at
         575 left a band from 576 to 767 where a 30px sliver wore the phone's
         much shorter dissolve. That is roughly three quarters of it at full
         opacity behind a hard little feather, where every other width has it
         fading out well before its own edge. */
      if (window.matchMedia("(max-width: 767px)").matches) {
        ghost.style.width = "10px";
        return;
      }
      ghost.style.width = "30px";
    };

    const measureBlocksFade = () => {
      const wrap = $("dash-blocks");
      const box = wrap && wrap.closest(".sc-blocks-container");
      const card = wrap && wrap.querySelector(".sc-block");
      if (!box || !card) return;
      const boxRect = box.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();
      /* 90px of bleed so the hover glow (up to a 76px blur, lifted 10px) isn't
         cut off by the fade's own edge -- 8px only covered the resting shadow.

         Below the cards that figure has to shrink on phones. The scroller
         reserves exactly 90px of bottom padding for that same hover glow, so
         subtracting a 90px bleed from a 90px gap leaves an inset of zero and
         the fade runs the full height of its container -- roughly 90px below
         the cards, into a stretch the strip's own negative bottom margin has
         already handed to the hero. On desktop nothing is there to catch it.
         In the mobile layout the "Live" chip is, and its right end sat under
         the gradient.

         30px is safe here because the thing the big bleed protects does not
         exist at this width: there is no hover lift, and the one card with a
         bright glow is the pending card, which is always leftmost and never
         reaches the right gutter this fade covers. What does overrun there is
         confirmed cards, whose shadows are black on a black stage -- masking
         them changes nothing visible. Their bright content stops at the card's
         own border box, well inside 30px. */
      const bleedBelow = window.matchMedia("(max-width: 767px)").matches ? 30 : 90;
      box.style.setProperty("--sc-strip-fade-top", Math.max(0, cardBox.top - boxRect.top - 90) + "px");
      box.style.setProperty("--sc-strip-fade-bottom", Math.max(0, boxRect.bottom - cardBox.bottom - bleedBelow) + "px");
    };

    /* Both projected.totalFees and block.extras.totalFees are transaction-fee
       totals in satoshis. They do not include the block subsidy. */
    const fmtBlockFees = totalFees => {
      const sats = Number(totalFees);
      if (!Number.isFinite(sats)) return "\u2014";
      const btc = sats / 1e8;
      return btc.toLocaleString("en-CA", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      }) + " BTC";
    };

    const fmtBlockAge = timestamp => {
      const seconds = Math.max(0, Math.floor(Date.now() / 1000 - Number(timestamp)));
      const mins = Math.floor(seconds / 60);
      if (mins < 1) return "just now";
      if (mins < 60) return mins + " min ago";
      return Math.floor(mins / 60) + " hr ago";
    };

    /* Block timestamps are retained on the cards so their ages keep advancing
       from the local clock even when the API and socket are quiet. */
    const tickBlockAges = () => {
      document.querySelectorAll(".sc-block-confirmed[data-block-timestamp]").forEach(card => {
        const age = card.querySelector(".sc-block-age");
        if (age) age.textContent = fmtBlockAge(card.dataset.blockTimestamp);
      });
    };

    const paintPendingBlock = projected => {
      if (!projected) return;
      state.projectedBlock = projected;
      paintLowestNextBlockFee(projected);
      const wrap = $("dash-blocks");
      if (!wrap || wrap.classList.contains("is-confirming")) return;
      const pendingEl = wrap.querySelector(".sc-block-pending");
      if (!pendingEl) return;
      const age = pendingEl.querySelector(".sc-block-age");
      const values = pendingEl.querySelectorAll("dd");
      if (age && Array.isArray(projected.feeRange) && projected.feeRange.length) {
        age.innerHTML = fmtFeeSpan(projected.feeRange) + " <span class=\"sc-fee-unit\">sat/vB</span>";
      }
      if (values[0] && Number.isFinite(Number(projected.nTx))) {
        values[0].textContent = fmtInt(projected.nTx);
      }
      if (values[1] && Number.isFinite(Number(projected.totalFees))) {
        values[1].textContent = fmtBlockFees(projected.totalFees);
      }
      if (values[2] && Array.isArray(projected.feeRange) && projected.feeRange.length) {
        values[2].textContent = fmtFeeRate(projected.feeRange[0]);
      }
    };

    const paintFees = f => {
      if (!f || !Number.isFinite(Number(f.fastestFee))) return;
      const tiers = $("dash-fee-tiers");
      if (tiers) {
        tiers.innerHTML =
          "<span><span class=\"sc-dash-fee-label\">Low</span><em>" + fmtFeeRate(f.hourFee) + "</em></span>" +
          "<span><span class=\"sc-dash-fee-label\">Medium</span><em>" + fmtFeeRate(f.halfHourFee) + "</em></span>" +
          "<span><span class=\"sc-dash-fee-label\">High</span><em>" + fmtFeeRate(f.fastestFee) + "</em></span>";
      }
    };

    const loadFees = async () => {
      try {
        paintFees(await fetchJSON("https://mempool.space/api/v1/fees/recommended"));
      } catch (err) { /* tile keeps its last good value */ }
    };

    const supplyAtHeight = height => {
      let blocks = Math.max(0, Math.floor(height) + 1);
      let subsidy = 50;
      let total = 0;
      while (blocks > 0 && subsidy > 0) {
        const inEra = Math.min(blocks, HALVING_INTERVAL);
        total += inEra * subsidy;
        blocks -= inEra;
        subsidy /= 2;
      }
      return total;
    };

    const formatSubsidy = value => {
      const digits = value >= 10 ? 0 : 4;
      return Number(value.toFixed(digits)).toLocaleString("en-CA", { maximumFractionDigits: digits }) + " BTC";
    };

    /* The price series is sampled weekly in its early years and hourly in its
       recent ones, so averaging raw points would let the last fortnight weigh
       as much as a decade. Collapse to one close per UTC day first and average
       those. Cached because a 1400-day mean is recomputed on every price tick
       while the series only ever grows at one end. */
    let dailyCloseCache = { stamp: null, rows: [] };
    const dailyCloses = () => {
      const hist = state.history;
      if (!hist.length) return [];
      const stamp = hist[hist.length - 1].t;
      if (dailyCloseCache.stamp === stamp) return dailyCloseCache.rows;
      const byDay = new Map();
      /* Later rows overwrite earlier ones, so each day keeps its last print. */
      hist.forEach(r => byDay.set(Math.floor(r.t / 86400), r));
      const rows = [...byDay.keys()].sort((a, b) => a - b).map(k => byDay.get(k));
      dailyCloseCache = { stamp, rows };
      return rows;
    };

    /* Windowed by date rather than by row count. The series is not one row per
       day all the way back -- CAD thins to roughly weekly before about 2023 --
       so counting rows backwards walks far further into the past than the
       window asked for. Taking everything newer than a cutoff timestamp gives
       the window its actual length whatever the sampling was doing. */
    const movingAverage = (days, cur) => {
      const rows = dailyCloses();
      if (!rows.length) return null;
      const cutoff = rows[rows.length - 1].t - days * 86400;
      if (rows[0].t > cutoff) return null;
      let sum = 0;
      let n = 0;
      rows.forEach(r => {
        if (r.t < cutoff) return;
        const v = Number(r[cur]);
        if (Number.isFinite(v) && v > 0) { sum += v; n += 1; }
      });
      /* Thin coverage inside the window would bias the mean rather than fail
         outright, so require the days present to be most of the days asked
         for. Sparse stretches are the reason, not missing prints. */
      return n >= days * 0.6 ? sum / n : null;
    };

    /* The close nearest a point in the past, found by timestamp for the same
       reason. Refuses a match that is not actually near the date wanted, so a
       gap in the record shows a dash instead of a number from the wrong year. */
    const closeAgo = (days, cur) => {
      const rows = dailyCloses();
      if (!rows.length) return null;
      const target = rows[rows.length - 1].t - days * 86400;
      let best = null;
      let bestGap = Infinity;
      rows.forEach(r => {
        const v = Number(r[cur]);
        if (!Number.isFinite(v) || v <= 0) return;
        const gap = Math.abs(r.t - target);
        if (gap < bestGap) { bestGap = gap; best = v; }
      });
      return bestGap <= 45 * 86400 ? best : null;
    };

    const paintMovingAverages = () => {
      const cur = state.currency;
      const ma200w = movingAverage(1400, cur);
      const ma50w = movingAverage(350, cur);
      const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
      set("dash-ma200w", ma200w ? fmtMoney(ma200w, cur) : "—");
      set("dash-ma50w", ma50w ? fmtMoney(ma50w, cur) : "—");
    };

    /* Deliberately the 200-day average, not the 200-week one above: the Mayer
       Multiple is defined against the daily figure, and quoting it off a
       different window would give a number that cannot be compared with the
       one everybody else publishes. */
    const paintMayerMultiple = () => {
      const cur = state.currency;
      const ma200d = movingAverage(200, cur);
      const price = latest[cur];
      const maEl = $("dash-mayer-ma");
      if (maEl) maEl.textContent = ma200d ? fmtMoney(ma200d, cur) : "—";
      const el = $("dash-mayer");
      if (!el) return;
      if (!ma200d || !price) { el.textContent = "—"; return; }
      const mayer = price / ma200d;
      el.textContent = mayer.toFixed(2) + "×";
      /* The fee tile's green-to-red scale, read the other way round: a high
         multiple is the expensive end, not the cheap one. */
      el.style.color = scaleColor(1 - Math.min(mayer / 3, 1));
      const note = $("dash-mayer-note");
      if (note) {
        note.textContent = mayer < 1
          ? "Below its 200-day average."
          : mayer < 2.4
            ? "Inside the range it has spent most of its history."
            : "Above 2.4, a level it has rarely held for long.";
      }
    };

    const paintDrawdown = () => {
      const cur = state.currency;
      const rows = dailyCloses();
      const price = latest[cur];
      const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
      if (!rows.length || !price) return;
      let peak = 0;
      let peakAt = null;
      let counted = 0;
      let cycleLow = Infinity;
      /* Previous bear-market cycle: from the November 2021 peak through the
         April 2024 halving that opened the current cycle. */
      const previousCycleStart = Date.UTC(2021, 10, 10) / 1000;
      const previousCycleEnd = Date.UTC(2024, 3, 20) / 1000;
      rows.forEach(r => {
        const v = Number(r[cur]);
        if (!Number.isFinite(v) || v <= 0) return;
        counted += 1;
        if (v > peak) { peak = v; peakAt = r.t; }
        if (r.t >= previousCycleStart && r.t < previousCycleEnd && v < cycleLow) cycleLow = v;
      });
      if (!counted || !peak) return;
      /* Today counts too, otherwise a fresh high would read as a drawdown from
         yesterday's peak. */
      const high = Math.max(peak, price);
      const off = (price / high - 1) * 100;
      /* Hair space (U+200A) after the minus sign -- flush against the digit it
         reads as a dash mashed into the number, not a negative sign. */
      set("dash-drawdown", off > -0.05 ? "At its high" : "- " + Math.abs(off).toFixed(1) + "%");
      const valEl = $("dash-drawdown");
      /* Pure red ramp (not the red-yellow-green scaleColor): an 80%+ drawdown
         is as deep red as it gets, fading to a light red near a fresh high. */
      if (valEl) {
        /* Backloaded toward the 80% cap so light drawdowns stay light, but
           less aggressively than a square -- midpoint reads as clearly red,
           not barely tinted. */
        const lin = Math.min(Math.abs(off), 80) / 80;
        const t = Math.pow(lin, 1.5);
        valEl.style.color = off > -0.05 ? ""
          : "hsl(0, " + Math.round(20 + t * 65) + "%, " + Math.round(75 - t * 45) + "%)";
      }
      set("dash-ath", fmtMoney(high, cur));
      set("dash-cycle-low", Number.isFinite(cycleLow) ? fmtMoney(cycleLow, cur) : "—");
      const note = $("dash-drawdown-note");
      if (note && peakAt) {
        const when = new Intl.DateTimeFormat("en-CA", { month: "short", year: "numeric" })
          .format(new Date(peakAt * 1000));
        note.textContent = price >= peak
          ? "Trading at the highest price it has ever reached."
          : "Below the high set in " + when + ".";
      }
    };

    /* Miner pay per unit of work: the whole network's daily take spread across
       the hashing that earned it. Needs three things that arrive from three
       different requests -- price, hashrate, and the fee half of the reward --
       so each of those calls this and it renders once they have all landed. */
    const paintHashprice = () => {
      const cur = state.currency;
      const price = latest[cur];
      const hashrate = state.hashrate;
      /* Taken from the fee-share pass rather than derived from state.tipHeight,
         which is not assigned until the end of loadChain -- long after this
         first wants to run, so the three inputs would never coincide. */
      const subsidy = state.blockSubsidy;
      if (!price || !hashrate || !Number.isFinite(subsidy)) return;
      const fees = Number.isFinite(state.avgBlockFees) ? state.avgBlockFees : 0;
      const btcPerDay = (subsidy + fees) * 144;
      const perDay = btcPerDay * price;
      const petahashes = hashrate / 1e15;
      const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
      set("dash-hashprice", fmtMoneyPrecise(perDay / petahashes, cur));
      set("dash-hashprice-rev", fmtMoney(perDay / 1e6, cur) + "M");
      set("dash-hashprice-btc", fmtInt(btcPerDay) + " BTC");
    };

    /* Fees against the whole of miner pay, which is the question the halvings
       eventually force: the subsidy is on its way to zero and this is the only
       thing left to pay for hashing. Averaged over the block window rather
       than read off the last block, since a single block's fees swing wildly
       with whatever happened to be waiting. */
    const paintFeeShare = (blocks, height) => {
      if (!Array.isArray(blocks) || !blocks.length || !Number.isFinite(height)) return;
      const subsidy = 50 / Math.pow(2, Math.floor(height / HALVING_INTERVAL));
      let fees = 0;
      let counted = 0;
      blocks.forEach(b => {
        const total = b.extras && Number(b.extras.totalFees);
        if (Number.isFinite(total)) { fees += total / 1e8; counted += 1; }
      });
      if (!counted) return;
      const perBlock = fees / counted;
      state.avgBlockFees = perBlock;
      state.blockSubsidy = subsidy;
      paintHashprice();
      const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
      set("dash-feeshare", (perBlock / (subsidy + perBlock) * 100).toFixed(2) + "%");
      set("dash-feeshare-fees", perBlock.toFixed(3) + " BTC");
      set("dash-feeshare-subsidy", subsidy + " BTC");
    };

    const paintSupplyAndHalving = height => {
      if (!Number.isFinite(height) || height < 0) return;
      const era = Math.floor(height / HALVING_INTERVAL);
      const subsidy = 50 / Math.pow(2, era);
      const nextSubsidy = subsidy / 2;
      const nextHeight = (era + 1) * HALVING_INTERVAL;
      const blocksLeft = Math.max(0, nextHeight - height);
      const epochProgress = ((height % HALVING_INTERVAL) / HALVING_INTERVAL) * 100;
      const supply = supplyAtHeight(height);
      const supplyPct = Math.min(supply / DISPLAY_SUPPLY_LIMIT * 100, 100);
      const remaining = Math.max(0, DISPLAY_SUPPLY_LIMIT - supply);

      animateValue($("dash-supply"), supply, v => (v / 1e6).toFixed(2) + "M BTC");
      const supplyNote = $("dash-supply-note");
      if (supplyNote) supplyNote.textContent = supplyPct.toFixed(2) + "% of the 21 million limit issued.";
      const supplyPctEl = $("dash-supply-pct");
      if (supplyPctEl) supplyPctEl.textContent = supplyPct.toFixed(2) + "%";
      const supplyLeft = $("dash-supply-left");
      if (supplyLeft) supplyLeft.textContent = remaining >= 1e6
        ? (remaining / 1e6).toFixed(2) + "M BTC"
        : Math.round(remaining / 1000) + "k BTC";
      const supplyDay = $("dash-supply-day");
      if (supplyDay) supplyDay.textContent = fmtInt(subsidy * 144) + " BTC";
      const supplyBar = $("dash-supply-bar");
      if (supplyBar) supplyBar.style.width = supplyPct.toFixed(2) + "%";

      animateValue($("dash-halving"), blocksLeft, v => fmtInt(v) + " blocks");
      const estimatedDate = new Date(Date.now() + blocksLeft * 10 * 60 * 1000);
      const halvingNote = $("dash-halving-note");
      if (halvingNote) {
        const monthYear = new Intl.DateTimeFormat("en-CA", { month: "short", year: "numeric" }).format(estimatedDate);
        halvingNote.textContent = "Est. " + monthYear + " at the 10-minute block target.";
      }
      const currentReward = $("dash-halving-current");
      if (currentReward) currentReward.textContent = formatSubsidy(subsidy);
      const nextReward = $("dash-halving-next");
      if (nextReward) nextReward.textContent = formatSubsidy(nextSubsidy);
      const halvingProgress = $("dash-halving-progress");
      if (halvingProgress) halvingProgress.textContent = epochProgress.toFixed(1) + "%";
      const halvingBar = $("dash-halving-bar");
      if (halvingBar) halvingBar.style.width = epochProgress.toFixed(1) + "%";
    };

    const paintMempool = (raw, feeUnit = "auto") => {
      if (!raw) return;
      const previous = state.mempoolStats || {};
      const count = Number(raw.count ?? raw.size);
      const vsize = Number(raw.vsize);
      const bytes = Number(raw.bytes);
      const totalFee = Number(raw.total_fee);
      const next = {
        count: Number.isFinite(count) ? count : previous.count,
        vsize: Number.isFinite(vsize) ? vsize : previous.vsize,
        approximateVsize: Number.isFinite(vsize) ? false : previous.approximateVsize,
        totalFeeSats: previous.totalFeeSats
      };

      /* The REST endpoint reports total_fee in satoshis. The socket's Core
         mempoolInfo reports BTC, so small decimal values are normalized. */
      if (Number.isFinite(totalFee)) {
        next.totalFeeSats = feeUnit === "btc" || (feeUnit === "auto" && totalFee < 1000)
          ? totalFee * 1e8
          : totalFee;
      }
      if (!Number.isFinite(next.vsize) && Number.isFinite(bytes)) {
        next.vsize = bytes;
        next.approximateVsize = true;
      }
      state.mempoolStats = next;

      if (Number.isFinite(next.vsize)) {
        const vmb = next.vsize / 1e6;
        animateValue($("dash-mempool"), vmb, v => (next.approximateVsize ? "~" : "") +
          v.toLocaleString("en-CA", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " vMB");
        const blocks = Math.max(1, Math.ceil(vmb));
        const blockEquiv = $("dash-mempool-blocks");
        /* "≈" rather than "~": at this tile's weight and size a tilde reads as
           a minus sign, turning the count into an impossible negative. */
        if (blockEquiv) blockEquiv.textContent = "≈" + fmtInt(blocks);
        /* The backlog in time rather than in bytes, which is the form the
           question is usually asked in. Assumes the target block interval and
           no new arrivals, so it is a floor, not a forecast. */
        const eta = $("dash-mempool-eta");
        if (eta) {
          const mins = blocks * 10;
          eta.textContent = mins < 60
            ? mins + " min"
            : (mins / 60).toFixed(mins < 600 ? 1 : 0) + " hr";
        }
      }
      const mempoolTx = $("dash-mempool-tx");
      if (mempoolTx && Number.isFinite(next.count)) mempoolTx.textContent = fmtInt(next.count);
      const mempoolNote = $("dash-mempool-note");
      if (mempoolNote && Number.isFinite(next.count)) {
        mempoolNote.textContent = fmtInt(next.count) + " unconfirmed transactions waiting.";
      }
      const mempoolFees = $("dash-mempool-fees");
      if (mempoolFees && Number.isFinite(next.totalFeeSats)) {
        const btc = next.totalFeeSats / 1e8;
        mempoolFees.textContent = btc.toLocaleString("en-CA", {
          minimumFractionDigits: btc < 1 ? 3 : 2,
          maximumFractionDigits: btc < 1 ? 3 : 2
        }) + " BTC";
      }
    };

    const loadMempool = async () => {
      try {
        paintMempool(await fetchJSON("https://mempool.space/api/mempool"), "sats");
      } catch (err) { /* tile keeps its last good value */ }
    };

    const PENDING_PULSE_SECONDS = 3.617;
    const pendingPulsePhase = () =>
      -(((performance.now() + 500) / 1000) % PENDING_PULSE_SECONDS).toFixed(3) + "s";

    const loadChain = async () => {
      try {
        const h = await fetchText("https://mempool.space/api/blocks/tip/height");
        const height = parseInt(h, 10);
        if (Number.isFinite(height)) paintSupplyAndHalving(height);
      } catch (err) { /* tile keeps its placeholder */ }

      try {
        const blocks = await fetchJSON("https://mempool.space/api/v1/blocks");
        let projected = state.projectedBlock;
        try {
          const projectedBlocks = await fetchJSON("https://mempool.space/api/v1/fees/mempool-blocks");
          if (Array.isArray(projectedBlocks) && projectedBlocks.length) projected = projectedBlocks[0];
        } catch (err) { /* confirmed blocks can still render */ }
        if (projected) {
          state.projectedBlock = projected;
          paintLowestNextBlockFee(projected);
        }
        const wrap = $("dash-blocks");
        if (wrap && Array.isArray(blocks)) {
          const pendingTx = projected && Number.isFinite(Number(projected.nTx)) ? fmtInt(projected.nTx) : "—";
          const pendingFees = projected ? fmtBlockFees(projected.totalFees) : "\u2014";
          const pendingFee = projected && Array.isArray(projected.feeRange) && projected.feeRange.length ? fmtFeeSpan(projected.feeRange) + " <span class=\"sc-fee-unit\">sat/vB</span>" : "Building";
          const pendingLowest = projected && Array.isArray(projected.feeRange) && projected.feeRange.length ? fmtFeeRate(projected.feeRange[0]) : "\u2014";
          // The logo's animated SVG begins its own clock during asset paint.
          // Advance the CSS pulse by half a second so its visible peak meets
          // the orange-circle peak instead of trailing it.
          const logoPhase = pendingPulsePhase();
          const blocksStage = wrap.closest(".sc-blocks-top");
          if (blocksStage) blocksStage.style.setProperty("--sc-logo-phase", logoPhase);
          /* The height this block will take once it is mined -- one past the
             tip. Naming it now is also what makes the confirm transition read
             as one card: the number the pending card is showing is the number
             it keeps when it lands. Falls back to a label if the tip is
             unreadable, since a wrong height is worse than no height. */
          const tipNow = blocks.length ? Number(blocks[0].height) : NaN;
          const nextHeight = Number.isFinite(tipNow) ? fmtInt(tipNow + 1) : null;
          const pending =
            "<a class=\"sc-block sc-block-pending\" draggable=\"false\" style=\"--i:0;--sc-logo-phase:" + logoPhase + "\" href=\"https://mempool.space/mempool-block/0\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"View the projected next block" + (nextHeight ? " " + nextHeight : "") + " on mempool.space\">" +
              "<span class=\"sc-block-kicker\"><span class=\"sc-pending-dot\"></span>Pending</span>" +
              "<span class=\"sc-block-height\">" + (nextHeight || "Next block") + "</span>" +
              "<span class=\"sc-block-age\">" + pendingFee + "</span>" +
              "<dl class=\"sc-block-meta\">" +
                "<div><dt>Transactions</dt><dd>" + pendingTx + "</dd></div>" +
                "<div><dt>Projected</dt><dd>" + pendingFees + "</dd></div>" +
                "<div class=\"sc-block-lowest\"><dt>Lowest</dt><dd>" + pendingLowest + "</dd></div>" +
              "</dl></a>";
          /* /api/v1/blocks returns 15 and we were already fetching all of
             them, so the extra tail costs nothing on the wire. Only the first
             few are ever on screen; the rest sit past the right-hand fade and
             are reached by dragging the strip. */
          const buildConfirmed = fresh => blocks.slice(0, 15).map((b, i) => {
            const timestamp = Number.isFinite(Number(b.timestamp)) ? Number(b.timestamp) : Math.floor(Date.now() / 1000);
            /* Spelled out because .sc-block-age uppercases: a bare "5m ago"
               renders as "5M AGO", which reads as five months. */
            const age = fmtBlockAge(timestamp);
            const lowest = b.extras && Array.isArray(b.extras.feeRange) && b.extras.feeRange.length ? fmtFeeRate(b.extras.feeRange[0]) : "—";
            return "<a class=\"sc-block sc-block-confirmed" + (fresh && i === 0 ? " is-newest" : "") + "\" data-block-timestamp=\"" + timestamp + "\" draggable=\"false\" style=\"--i:" + (i + 1) + "\" href=\"https://mempool.space/block/" + b.id + "\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"View block " + b.height + " on mempool.space\">" +
              "<span class=\"sc-block-kicker\"><i class=\"bi bi-check2-circle\"></i>Confirmed</span>" +
              "<span class=\"sc-block-height\">" + fmtInt(b.height) + "</span>" +
              "<span class=\"sc-block-age\">" + age + "</span>" +
              "<dl class=\"sc-block-meta\">" +
                "<div><dt>Transactions</dt><dd>" + fmtInt(b.tx_count) + "</dd></div>" +
                "<div><dt>Fees</dt><dd>" + fmtBlockFees(b.extras && b.extras.totalFees) + "</dd></div>" +
                "<div class=\"sc-block-lowest\"><dt>Lowest</dt><dd>" + lowest + "</dd></div>" +
              "</dl></a>";
          }).join("");

          const renderStrip = fresh => {
            wrap.classList.remove("is-confirming");
            wrap.classList.add("is-ready");
            /* The arriving card is parked on the container, not inside the
               strip, so replacing the strip's markup below would leave it
               behind. This is also the catch-all for a flight cut short by the
               next block landing mid-animation. */
            const box = wrap.closest(".sc-blocks-container");
            const enterClip = box && box.querySelector(".sc-block-enter-clip");
            if (enterClip) enterClip.remove();
            wrap.innerHTML =
              "<span class=\"sc-block-ghost\" aria-hidden=\"true\"></span>" +
              pending + "<div class=\"sc-block-connector\" aria-hidden=\"true\"><span></span></div>" + buildConfirmed(fresh);
            /* This is a new node, so its CSS animation gets a new start time.
               Recalculate the negative delay at insertion instead of reusing
               the value captured when the request began; that keeps its breath
               on the same absolute clock as the travelling copy and stage aura. */
            const rebuiltPending = wrap.querySelector(".sc-block-pending");
            if (rebuiltPending) rebuiltPending.style.setProperty("--sc-logo-phase", pendingPulsePhase());
            sizeBlockGhost();
            /* Safe to measure on this frame: nothing in a rebuilt strip carries
               an entrance transform. The landed card's border cooldown is
               started below and touches only border-color, and the rest are
               held by the :not(.is-newest) rule, so every
               getBoundingClientRect() here reads a resting position. The wash still running over the newest card animates
               opacity. Neither of those moves geometry. */
            syncBlocksOverflow();
            measureBlocksFade();

            const landed = fresh && wrap.querySelector(".sc-block-confirmed.is-newest");
            if (landed) {
              /* The border cooldown, run from script rather than from a CSS
                 keyframe on the card. It used to be one, and the reason it
                 cannot be is the flight's own rule: .sc-blocks.is-confirming
                 .sc-block-confirmed declares `animation` as a shorthand and
                 outranks .sc-block-confirmed.is-newest, so the moment the NEXT
                 block starts flying, this card's animation list is replaced
                 wholesale and a half-cooled border-color is dropped where it
                 stands -- straight to the resting grey in one frame, while the
                 ::after wash inside (untouched, it is a pseudo-element) keeps
                 dissolving around it.

                 Ten minutes between blocks and the fade is over long before
                 that; back-to-back blocks and the next flight starts inside
                 these two seconds every time, so the rim blinks off on every
                 landing but the last. A script animation is not part of the
                 element's CSS animation list, so no class swap can reach it.

                 The easings sit on the keyframes, not in the options: CSS
                 applies animation-timing-function per segment, the options'
                 `easing` would apply once across the whole iteration, and only
                 the per-keyframe form reproduces what the old
                 hold-then-ease-out keyframe did. The hold to 22% is the card's
                 landing motion -- see sc-new-block-cool, which shares it. */
              let edge = null;
              if (!reduceMotion && typeof Element !== "undefined" && Element.prototype.animate) {
                edge = landed.animate([
                  { borderColor: "rgba(255, 189, 77, 0.94)", easing: "ease-in-out" },
                  { borderColor: "rgba(255, 189, 77, 0.94)", offset: 0.22, easing: "ease-in-out" },
                  { borderColor: "rgba(255, 255, 255, 0.25)" }
                ], { duration: 2000, fill: "forwards" });
              }

              /* Take the class off once the cool down has played, and cancel
                 the border animation with it. Both for the same reason: a
                 filled animation outranks every normal declaration,
                 script-created ones included, so while either is in force the
                 card's border stops answering :hover and that one card lights
                 differently from the rest of the row. The strip is only
                 rebuilt when a block lands, so left alone it would stay that
                 way until the next one, ten minutes of a card that hovers
                 wrong. Cancelling costs nothing on screen: the animation's end
                 colour is .sc-block-confirmed's own border.

                 Timed off sc-new-block-cool, the ::after wash. It is the same
                 2s ease-in-out the border now runs, and being on a
                 pseudo-element it is the one part of this cooldown the next
                 flight cannot cut short -- so it is the honest signal for "the
                 cooldown finished". Its animationend arrives with e.target set
                 to the card itself, which is what separates it from the kicker
                 and age fades bubbling up from the children. */
              let settledOnce = false;
              const settleLanded = () => {
                if (settledOnce) return;
                settledOnce = true;
                landed.classList.remove("is-newest");
                if (edge) { try { edge.cancel(); } catch (err) { /* already gone */ } }
              };
              landed.addEventListener("animationend", function settled(e) {
                if (e.target !== landed || e.animationName !== "sc-new-block-cool") return;
                landed.removeEventListener("animationend", settled);
                settleLanded();
              });
              /* Deliberately a bare setTimeout rather than one of
                 state.blockTimers, on the same reasoning as crossfadeLines'
                 net: this is the guarantee the class comes back off, so it has
                 to survive every loadChain() that clears those. Covers the
                 reduced-motion stylesheet, which sets the ::after to
                 animation:none and would otherwise leave nothing to listen for.
                 Padded past the 2s so it never pre-empts the real event. */
              setTimeout(settleLanded, 2600);
            }
          };

          const tipHeight = blocks.length ? Number(blocks[0].height) : null;
          const isNewBlock = Number.isFinite(tipHeight) && state.tipHeight !== null && tipHeight > state.tipHeight;

          /* Here rather than beside paintSupplyAndHalving above, because that
             branch only has the tip height -- the fee totals it needs come
             with this request. */
          paintFeeShare(blocks, tipHeight);

          state.blockTimers.forEach(timer => clearTimeout(timer));
          state.blockTimers = [];

          if (isNewBlock && !reduceMotion && wrap.querySelector(".sc-block-pending")) {
            /* The breathing pulse (sc-pending-logo-pulse) runs on its own
               shared, absolute clock, unrelated to when a block happens to
               land -- so without this, the confirm flight's own glow
               (sc-confirm-glow) could start at any point in that breath,
               including its brightest. Both animations own box-shadow, and
               swapping the animation-name list is a hard cut, not a
               transition: whatever the pulse's box-shadow was on the frame
               before cuts straight to sc-confirm-glow's 0% value with no
               interpolation between them, since the two don't even share a
               shadow layer structure to interpolate across (see
               sc-confirm-glow's own comment on that constraint). Catching the
               pulse mid-peak made that cut a visible brightness drop -- a
               stutter right as the flight begins.

               sc-confirm-glow's own 0% is close to the pulse's 0%/50%/100%
               resting keyframe, so waiting for the pulse to next land there
               is what makes the handover unremarkable rather than eliminating
               the cut outright (a hard cut between two structurally different
               shadow lists can't be interpolated away). The wait is at most
               half the pulse's 3.617s period, and it is computed fresh here
               rather than read from --sc-logo-phase because that variable is
               only ever set on a full renderStrip() and can be stale by the
               time a block actually lands. */
            const PULSE_HALF = PENDING_PULSE_SECONDS / 2;
            const cycleElapsed = (performance.now() / 1000 + 0.5) % PENDING_PULSE_SECONDS;
            const startDelayMs = ((PULSE_HALF - (cycleElapsed % PULSE_HALF)) % PULSE_HALF) * 1000;

            state.blockTimers.push(setTimeout(() => startConfirmFlight(wrap, blocks, tipHeight, pending, renderStrip), startDelayMs));
          } else {
            renderStrip(false);
          }

          if (Number.isFinite(tipHeight)) state.tipHeight = tipHeight;
        }
      } catch (err) { /* strip stays empty */ }
    };

    /* Fades a set of updated lines up while the clones of their previous text
       fade out over them. Driven from script rather than by adding a CSS class
       whose animation carries fill-mode: both, and torn down from the
       animations' own completion rather than from a timer.

       Both of those are the fix for a card that landed with no text on it at
       all. The class-based version parked each updated line on the 0% keyframe
       -- opacity 0 -- and depended on a 240ms timer to take the class back off.
       That timer was pushed onto state.blockTimers, which every loadChain()
       clears, so a poll or a socket refresh arriving inside the crossfade
       cancelled it outright; and 240ms over a 220ms animation is a 20ms margin,
       thin enough for one slow frame to beat. Neither shows up in a browser
       that runs the fade to completion, because the fill mode then holds the
       line at opacity 1 either way -- but where the fade did not play out, the
       line kept holding 0 and the whole card read as blank until the strip was
       rebuilt at the end of the flight. Reported on iOS Safari.

       So: no class to get stuck on, and a teardown that cannot be cancelled by
       anything else. Only the outgoing clones need forwards fill to stay hidden
       after their fade; the updated lines use backwards, so once the active
       phase is over they sit on their own opacity rather than on a filled
       keyframe. The worst case left is a crossfade that does not play, which
       reads as a plain text swap -- never a card with its text missing. */
    const CROSSFADE_MS = 220;
    const crossfadeLines = (newLines, oldCopies) => {
      const drop = () => oldCopies.forEach(copy => copy.remove());
      if (typeof Element === "undefined" || !Element.prototype.animate) { drop(); return; }
      /* Complementary easings, deliberately not both linear -- see the note on
         .sc-block-copy-old in the stylesheet for why the pair has to hold high
         through the crossing. */
      const running = oldCopies.map(copy => copy.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: CROSSFADE_MS, easing: "ease-in", fill: "forwards" }
      )).concat(newLines.map(line => line.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: CROSSFADE_MS, easing: "ease-out", fill: "backwards" }
      )));
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        drop();
        /* Returns the updated lines to their own opacity even if their fade
           never ran. Cancelling an animation that already finished is a no-op
           here: with backwards fill there is nothing left holding a value. */
        running.forEach(anim => { try { anim.cancel(); } catch (err) { /* already gone */ } });
      };
      Promise.all(running.map(anim => anim.finished)).then(settle, settle);
      /* Deliberately a bare setTimeout, not one of state.blockTimers: this is
         the guarantee that the clones come off and the lines come back, so it
         must survive whatever else decides to clear those.

         600ms against a 220ms fade. Comfortable enough that it never pre-empts
         the animations in normal operation -- their start would have to slip
         most of 400ms first -- and if it ever does, it only cuts the fade
         short and leaves the text sitting at full opacity, which is the
         direction to fail in. Kept tight for the same reason: this is the
         ceiling on how long a card could show no text at all if the fade does
         not run, so it should not be generous. */
      setTimeout(settle, 600);
    };

    /* Everything that flies the pending card over to the confirmed slot once a
       new block lands. Split out from loadChain() so the pulse-phase wait
       above it can delay this as one unit without indenting the whole thing
       another level. pending and renderStrip are passed explicitly rather
       than closed over -- this runs after loadChain() has already returned,
       and both are declared local to that call (renderStrip is defined fresh
       inside its try block, not shared across calls the way the fmt* helpers
       are), so nothing here could reach them any other way. */
    const startConfirmFlight = (wrap, blocks, tipHeight, pending, renderStrip) => {
      const pendingEl = wrap.querySelector(".sc-block-pending");
      if (!pendingEl) return;
      const newest = blocks[0];

      /* The next pending card begins as the orange continuation sliver and
         slides right out of it. */
      const ghostEl = wrap.querySelector(".sc-block-ghost");
      const boxEl = wrap.closest(".sc-blocks-container");
      if (ghostEl && boxEl) {
        const boxRect = boxEl.getBoundingClientRect();
        const frame = ghostEl.getBoundingClientRect();
        const slot = pendingEl.getBoundingClientRect();
        /* Measured so the card's RIGHT edge starts on the sliver's right edge,
           rather than so its left edge starts a slot away. At the first frame
           the only part of it inside the clip is then its own leading edge,
           lying exactly over the sliver and carrying the clip's matching
           dissolve -- the sliver and the card's front are the same thing. It
           ends on the resting slot, which is where the rebuild paints the live
           card, so the handover has nothing to jump.

           Deliberately shorter than the outgoing card's own travel, and that
           is correct rather than a mismatch: the two are moving to different
           destinations. This one lands in the pending slot with only a gap
           behind the sliver, while the outgoing one lands in the confirmed
           slot with the connector between. Their separation therefore has to
           open from one gap to gap-connector-gap over the flight -- the
           connector's space appearing between them is the chain advancing, not
           a drift. */
        const distance = slot.left + slot.width - frame.right;
        const holder = document.createElement("div");
        holder.innerHTML = pending;
        const incoming = holder.firstChild;
        if (incoming && distance > 0) {
          /* The markup was built before the pulse-alignment wait. Refresh the
             delay now so the arriving card joins the breath at its current
             phase rather than replaying an earlier one. */
          incoming.style.setProperty("--sc-logo-phase", pendingPulsePhase());
          const clip = document.createElement("div");
          clip.className = "sc-block-enter-clip";
          clip.style.left = (frame.left - boxRect.left) + "px";
          clip.style.top = (slot.top - boxRect.top - 80) + "px";
          clip.style.width = (boxRect.right - frame.left) + "px";
          clip.style.height = (slot.height + 160) + "px";

          /* A second copy of a link the reader can already reach. */
          incoming.setAttribute("aria-hidden", "true");
          incoming.setAttribute("tabindex", "-1");
          incoming.style.left = (slot.left - frame.left) + "px";
          incoming.style.top = "80px";
          incoming.style.width = slot.width + "px";
          incoming.style.height = slot.height + "px";
          incoming.style.setProperty("--sc-enter-distance", distance + "px");

          /* The block queued behind this one, riding the same measured
             distance so the pair holds its spacing across the flight. It
             travels in here rather than in the strip because the clip is
             pinned to the content gutter: inside it the sliver emerges
             through that fixed fade, where in the strip it would have come
             up 56px early, out in the scroller's padding. The one still in
             the strip is hidden for the duration (see the is-confirming
             rule) and the rebuild restores it at rest. */
          const trailing = ghostEl.cloneNode(true);
          trailing.setAttribute("aria-hidden", "true");
          trailing.style.left = "0px";
          trailing.style.top = (frame.top - slot.top + 80) + "px";
          trailing.style.width = frame.width + "px";
          trailing.style.height = frame.height + "px";
          trailing.style.setProperty("--sc-enter-distance", distance + "px");

          clip.appendChild(trailing);
          clip.appendChild(incoming);
          boxEl.appendChild(clip);
        }
      }

      wrap.classList.remove("is-ready");
      wrap.classList.add("is-confirming");

      /* Crossfade each individual line whose content changes at confirmation.
         Clones preserve the outgoing text while the updated originals fade in
         underneath; unchanged lines and the card itself never blink. */
      state.blockTimers.push(setTimeout(() => {
        const kicker = pendingEl.querySelector(".sc-block-kicker");
        const height = pendingEl.querySelector(".sc-block-height");
        const age = pendingEl.querySelector(".sc-block-age");
        const terms = pendingEl.querySelectorAll("dt");
        const values = pendingEl.querySelectorAll("dd");
        const timestamp = Number.isFinite(Number(newest.timestamp)) ? Number(newest.timestamp) : Math.floor(Date.now() / 1000);
        const nextHeight = fmtInt(tipHeight);
        const nextAge = fmtBlockAge(timestamp);
        const nextTransactions = fmtInt(newest.tx_count);
        const nextFees = fmtBlockFees(newest.extras && newest.extras.totalFees);
        const lowest = newest.extras && Array.isArray(newest.extras.feeRange) && newest.extras.feeRange.length ? newest.extras.feeRange[0] : null;
        const nextLowest = fmtFeeRate(lowest);
        /* Compared per element, never per row. Each meta row holds a label and
           a value, and only one of the three rows changes its label at all --
           "Projected" becomes "Fees", while "Transactions" and "Lowest" are the
           same word on both sides. Crossfading whole rows therefore dragged two
           unchanged labels through a fade for no reason, which is most of what
           made the card look like it blinked as a whole rather than updating
           the few figures that actually moved. The height line is usually
           unchanged too: the pending card already displays the height this
           block is about to take, so the comparison drops it on its own. */
        const changingLines = [];
        const changes = (line, next) => line && line.textContent.trim() !== String(next).trim();
        const fadeIfChanged = (line, next) => { if (changes(line, next)) changingLines.push(line); };
        fadeIfChanged(kicker, "Confirmed");
        fadeIfChanged(height, nextHeight);
        fadeIfChanged(age, nextAge);
        fadeIfChanged(terms[0], "Transactions");
        fadeIfChanged(values[0], nextTransactions);
        fadeIfChanged(terms[1], "Fees");
        fadeIfChanged(values[1], nextFees);
        fadeIfChanged(terms[2], "Lowest");
        fadeIfChanged(values[2], nextLowest);

        const copyLine = line => {
          if (!line) return null;
          const parent = line.parentElement;
          if (!parent) return null;
          const parentBox = parent.getBoundingClientRect();
          const lineBox = line.getBoundingClientRect();
          const copy = line.cloneNode(true);
          copy.classList.add("sc-block-copy-old");
          copy.setAttribute("aria-hidden", "true");
          copy.style.left = (lineBox.left - parentBox.left - parent.clientLeft) + "px";
          copy.style.top = (lineBox.top - parentBox.top - parent.clientTop) + "px";
          copy.style.width = lineBox.width + "px";
          copy.style.height = lineBox.height + "px";
          copy.style.color = getComputedStyle(line).color;
          parent.appendChild(copy);
          return copy;
        };
        const oldCopies = changingLines.map(copyLine).filter(Boolean);

        pendingEl.classList.add("is-mined");
        pendingEl.dataset.blockTimestamp = timestamp;
        pendingEl.href = "https://mempool.space/block/" + newest.id;
        pendingEl.setAttribute("aria-label", "View block " + tipHeight + " on mempool.space");
        if (kicker) kicker.innerHTML = "<i class=\"bi bi-check2-circle\"></i>Confirmed";
        if (height) height.textContent = nextHeight;
        if (age) age.textContent = nextAge;
        if (terms[1]) terms[1].textContent = "Fees";
        if (terms[2]) terms[2].textContent = "Lowest";
        if (values[0]) values[0].textContent = nextTransactions;
        if (values[1]) values[1].textContent = nextFees;
        if (values[2]) values[2].textContent = nextLowest;
        crossfadeLines(changingLines, oldCopies);
      }, 180));

      /* Was setTimeout(..., 1400) -- the same 1.4s the flight's CSS
         animations declare. It fired early every time: the timer counts
         from this synchronous script, but the animations don't actually
         start until the browser's next paint, so their real clock began
         a frame or so later and animationend was still ~15-20ms out
         when the timer went off. renderStrip() tore the flight down and
         swapped in the rebuilt, rest-position markup while the old
         elements were still short of their final values -- a connector
         whose position is pure layout reflow (no easing of its own to
         hide the gap) visibly hopped the rest of the way, and the
         linear glow lost its last slice mid-fade instead of reaching
         zero.

         animationend fires when the browser's own clock says the
         animation is actually done, so there is no gap left to fall
         into. Filtered to one animation because .sc-block-pending carries
         two (the flight and its glow) and both fire animationend on the
         same element -- without a filter this would run twice.

         Matched by prefix, not by exact name: under 768px the stylesheet
         swaps the whole name list for the -mobile variants, so the events
         arrive as sc-confirm-glow-mobile. An exact comparison silently
         never matched there and every phone landing fell through to the
         1700ms safety net below -- not a visible break, since that still
         rebuilds, but a ~280ms freeze on the finished flight before the
         strip caught up. The prefix covers both spellings. */
      let flightSettled = false;
      const finishFlight = () => {
        if (flightSettled) return;
        flightSettled = true;
        renderStrip(true);
      };
      pendingEl.addEventListener("animationend", function onFlightEnd(e) {
        if (e.animationName.indexOf("sc-confirm-glow") !== 0) return;
        pendingEl.removeEventListener("animationend", onFlightEnd);
        finishFlight();
      });
      /* Safety net, not the primary trigger: covers a tab that throttled
         or skipped the animationend (backgrounded, reduced-motion toggled
         mid-flight, or any other browser quirk) so the strip can't get
         stuck showing the flight forever. Comfortably past 1.4s -- the
         observed slip was under 20ms -- so it never fires ahead of the
         real thing in normal operation. */
      state.blockTimers.push(setTimeout(finishFlight, 1700));
    };

    const connectMempoolSocket = () => {
      if (state.socketStopped || !("WebSocket" in window)) return;
      const current = state.mempoolSocket;
      if (current && (current.readyState === WebSocket.OPEN || current.readyState === WebSocket.CONNECTING)) return;

      clearTimeout(state.socketReconnectTimer);
      const socket = new WebSocket("wss://mempool.space/api/v1/ws");
      state.mempoolSocket = socket;

      socket.addEventListener("open", () => {
        state.socketReconnectMs = 2000;
        state.lastSocketMessageAt = Date.now();
        socket.send(JSON.stringify({ action: "want", data: ["blocks", "mempool-blocks", "stats"] }));
      });

      socket.addEventListener("message", event => {
        state.lastSocketMessageAt = Date.now();
        let payload;
        try { payload = JSON.parse(event.data); } catch (err) { return; }

        const projectedBlocks = payload && payload["mempool-blocks"];
        if (Array.isArray(projectedBlocks) && projectedBlocks.length) {
          paintPendingBlock(projectedBlocks[0]);
        }

        if (payload && payload.fees) paintFees(payload.fees);
        if (payload && payload.mempoolInfo) paintMempool(payload.mempoolInfo, "btc");

        const blocks = payload && payload.blocks;
        const pushedHeight = Array.isArray(blocks) && blocks.length ? Number(blocks[0].height) : null;
        if (Number.isFinite(pushedHeight) && state.tipHeight !== null &&
            pushedHeight > state.tipHeight && !state.blockRefreshQueued) {
          state.blockRefreshQueued = true;
          loadChain().finally(() => { state.blockRefreshQueued = false; });
        }
      });

      socket.addEventListener("close", () => {
        if (state.mempoolSocket === socket) state.mempoolSocket = null;
        if (state.socketStopped) return;
        state.socketReconnectTimer = setTimeout(connectMempoolSocket, state.socketReconnectMs);
        state.socketReconnectMs = Math.min(state.socketReconnectMs * 2, 30000);
      });

      socket.addEventListener("error", () => socket.close());
    };

    const loadMining = async () => {
      try {
        const m = await fetchJSON("https://mempool.space/api/v1/mining/hashrate/1m");
        if (m && m.currentHashrate) {
          animateValue($("dash-hashrate"), m.currentHashrate / 1e18, v => v.toFixed(0) + " EH/s");
          state.hashrate = Number(m.currentHashrate);
          paintHashprice();
        }
        if (m && Number.isFinite(Number(m.currentDifficulty))) {
          animateValue($("dash-current-difficulty"), Number(m.currentDifficulty) / 1e12, v => v.toFixed(2) + "T");
        }
        const spark = $("dash-hash-spark");
        if (spark && Array.isArray(m.hashrates) && m.hashrates.length > 1) {
          const vals = m.hashrates.map(x => x.avgHashrate);
          const lo = Math.min(...vals), hi = Math.max(...vals), rng = (hi - lo) || 1;
          spark.innerHTML = vals.map(v =>
            "<span style=\"height:" + (18 + ((v - lo) / rng) * 82) + "%\"></span>"
          ).join("");
        }
      } catch (err) { /* tile keeps its placeholder */ }

      try {
        const d = await fetchJSON("https://mempool.space/api/v1/difficulty-adjustment");
        const chg = d.difficultyChange;
        const el = $("dash-diffchange");
        if (el) {
          /* Hair space (U+200A) after the sign -- a full space read as too
             wide a gap, flush read as the minus mashed into the digit. */
          el.textContent = (chg >= 0 ? "+ " : "- ") + Math.abs(chg).toFixed(2) + "%";
          el.classList.toggle("is-positive", chg >= 0);
          el.classList.toggle("is-negative", chg < 0);
        }
        const note = $("dash-diffnote");
        if (note) note.textContent = fmtInt(d.remainingBlocks) + " blocks until the next retarget.";

        /* Three more fields the same response already carries. Average block
           time is the one that explains the headline: above 10 minutes means
           blocks are running slow, so difficulty drops next retarget, and
           below means the opposite. */
        const dTiers = $("dash-diff-tiers");
        if (dTiers) {
          /* Minutes and seconds, not decimal minutes: the interesting part is
             the drift either side of the 10-minute target, and "9m 56s" shows
             that far more plainly than "9.9m". */
          let avgMin = "—";
          if (d.timeAvg) {
            const totalSec = Math.round(d.timeAvg / 1000);
            avgMin = Math.floor(totalSec / 60) + "m " + (totalSec % 60) + "s";
          }
          const prev = typeof d.previousRetarget === "number"
            ? (d.previousRetarget >= 0 ? "+" : "") + d.previousRetarget.toFixed(2) + "%"
            : "—";
          const at = d.nextRetargetHeight ? fmtInt(d.nextRetargetHeight) : "—";
          dTiers.innerHTML =
            "<span><em>" + avgMin + "</em>avg block</span>" +
            "<span><em>" + prev + "</em>previous</span>" +
            "<span><em>" + at + "</em>retarget at</span>";
        }

        const bar = $("dash-diff-bar");
        if (bar) bar.style.width = Math.min(Math.max(d.progressPercent, 0), 100).toFixed(1) + "%";
        const eta = $("dash-diff-eta");
        if (eta) {
          const rawDate = Number(d.estimatedRetargetDate);
          const retargetDate = new Date(rawDate < 1e12 ? rawDate * 1000 : rawDate);
          if (!Number.isNaN(retargetDate.getTime())) {
            const remainingMs = Math.max(0, retargetDate.getTime() - Date.now());
            const totalHours = Math.max(1, Math.round(remainingMs / 36e5));
            const days = Math.floor(totalHours / 24);
            const hours = totalHours % 24;
            const countdown = days ? days + "d " + hours + "h" : totalHours + "h";
            const calendar = new Intl.DateTimeFormat("en-CA", {
              month: "short",
              day: "numeric"
            }).format(retargetDate);
            const value = eta.querySelector("strong");
            if (value) value.textContent = countdown + " · " + calendar;
          }
        }
      } catch (err) { /* tile keeps its placeholder */ }
    };

    const loadFng = async () => {
      try {
        const d = await fetchJSON("https://api.alternative.me/fng/?limit=1");
        const row = d && d.data && d.data[0];
        if (!row) return;
        const val = parseInt(row.value, 10);
        const fng = $("dash-fng");
        animateValue(fng, val, v => String(Math.round(v)));
        /* Matches the gauge arc behind it, which already runs red at 0 to
           green at 100 -- so extreme fear reads red and extreme greed green. */
        if (fng) fng.style.color = scaleColor(val / 100);
        const label = $("dash-fng-label");
        if (label) label.textContent = row.value_classification;
        /* Needle sweeps -90deg (0) to +90deg (100) across the semicircle. */
        const needle = $("dash-fng-needle");
        if (needle) needle.style.transform = "rotate(" + (val / 100 * 180 - 90) + "deg)";
        const arc = $("dash-fng-arc");
        if (arc) {
          const len = arc.getTotalLength();
          arc.style.strokeDasharray = len;
          arc.style.strokeDashoffset = len * (1 - val / 100);
        }
      } catch (err) { /* gauge keeps its placeholder */ }
    };

    // ------------------------------------------------------------- schedule
    /* Small requests first -- a few hundred bytes each, 29KB for the blocks --
       and every one of them paints something a visitor sees immediately. */
    const pricesReady = loadPrices();
    loadFees();
    loadMempool();
    const chainReady = loadChain().finally(connectMempoolSocket);
    loadMining();
    loadFng();
    /* Small, and the default range is one it serves, so the chart can draw at
       full detail well before the 1.4MB history behind it arrives. */
    refreshIntraday();

    /* The CAD history is ~1.4MB, roughly fifty times everything else on this
       page put together, and it used to be requested first. On a fast link
       that is invisible; on a weak phone connection it holds the pipe long
       enough to starve the requests behind it, and since those give up after
       12s the page settled into the worst possible shape -- an empty block
       strip and "Price history is unavailable", from a network that was
       working, just slowly.

       Starting it after the small ones removes the contention. It costs the
       chart a couple of hundred ms on a good connection, which is the right
       trade against the strip and price failing outright on a bad one.

       allSettled, not all: a rejection here must not cancel the history, and
       these two already fail softly on their own. Waiting on the price and the
       strip specifically rather than all six -- those are what the big request
       was starving, and every one of them is capped by fetchJSON's own timeout,
       so this cannot defer the chart indefinitely. */
    Promise.allSettled([pricesReady, chainReady]).then(loadHistory);

    setInterval(loadPrices, 60000);
    /* Live fee tiers arrive with the socket's stats stream. REST remains a
       low-frequency fallback for blocked or suspended WebSocket sessions. */
    setInterval(loadFees, 300000);
    /* Socket stats keep the transaction count and fees live; this exact
       virtual-size snapshot prevents the backlog estimate from drifting. */
    setInterval(loadMempool, 60000);
    /* This clock is deliberately independent of network refreshes. */
    setInterval(tickBlockAges, 15000);
    /* The socket announces new blocks instantly and stays the primary path.
       This poll still runs unconditionally: a socket can keep chattering on
       the stats channel -- so it looks open and fresh -- while the blocks
       push we actually care about is missed, and gating the poll on socket
       health left the chain stuck in exactly that case.

       Kept polite rather than kept rare: the tip height is a single short
       text response, and the three-request refresh only follows when that
       height has actually moved. Steady state is therefore one small request
       per tick, so a much tighter interval than the old five minutes still
       costs the API less than the full refresh it replaces. */
    setInterval(async () => {
      const socket = state.mempoolSocket;
      /* readyState can't see a connection that is nominally open but has
         quietly stopped delivering data; some proxies drop idle sockets
         without ever firing "close". Force the reconnect path on a gap
         longer than the stats channel's normal chatter. */
      if (socket && socket.readyState === WebSocket.OPEN &&
          state.lastSocketMessageAt !== null &&
          Date.now() - state.lastSocketMessageAt > 120000) {
        socket.close();
      }
      try {
        const height = parseInt(await fetchText("https://mempool.space/api/blocks/tip/height"), 10);
        if (!Number.isFinite(height) || height === state.tipHeight) return;
      } catch (err) { return; /* next tick tries again */ }
      loadChain();
    }, 20000);
    setInterval(loadMining, 300000);
    setInterval(loadFng, 900000);

    /* A tab left open for hours would otherwise show a stale "updated" time
       the moment it is looked at again. */
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        tickBlockAges();
        loadPrices();
        loadFees();
        loadMempool();
        loadChain();
        connectMempoolSocket();
      }
    });

    window.addEventListener("pagehide", () => {
      state.socketStopped = true;
      clearTimeout(state.socketReconnectTimer);
      if (state.mempoolSocket) state.mempoolSocket.close();
    });

    window.addEventListener("pageshow", event => {
      if (!event.persisted) return;
      state.socketStopped = false;
      loadPrices();
      loadFees();
      loadMempool();
      loadChain().finally(connectMempoolSocket);
    });
  }

  /**
   * Scroll-reveal entrance animation for section content.
   * Skipped entirely when the visitor prefers reduced motion.
   */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      "#main-content .sc-card, #main-content .sc-detail, #main-content .sc-step, " +
      "#main-content .sc-callout, #main-content .sc-section-head, #main-content .sc-table-wrap"
    );

    revealTargets.forEach((el, index) => {
      el.classList.add("sc-reveal");
      el.style.setProperty("--sc-reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach(el => observer.observe(el));
  }

  /**
   * Guide finder (guides.html).
   *
   * Three optional answers -- goal, product, experience -- filter the guide
   * cards in place. The markup ships with every card visible and the finder
   * itself hidden, so without JavaScript the library is still a complete,
   * browsable page rather than a row of dead controls. This reveals the
   * controls and takes over from there.
   *
   * State also lives in the query string, so devices.html can link straight to
   * guides.html?product=coldcard and land on a filtered library.
   */
  const finderSection = document.querySelector("[data-guide-finder]");

  if (finderSection) {
    const cells = [...document.querySelectorAll(".sc-guide-cell")];
    const chips = [...finderSection.querySelectorAll("[data-finder-group]")];
    const bar = finderSection.querySelector("[data-finder-bar]");
    const countEl = finderSection.querySelector("[data-finder-count]");
    const clearBtn = finderSection.querySelector("[data-finder-clear]");
    const pick = finderSection.querySelector("[data-finder-pick]");
    const noneEl = finderSection.querySelector("[data-guide-none]");
    const searchInput = finderSection.querySelector("[data-guide-search]");
    const searchClear = finderSection.querySelector("[data-guide-search-clear]");

    /* Searched against a card's full text (title, summary, tags) rather than
       just the title, computed once since the cards themselves never change. */
    const cellText = new Map(cells.map(cell => [cell, cell.textContent.toLowerCase()]));

    /* Saying you are advanced should never hide the basics, so each answer maps
       to the set of levels it keeps rather than to a single level. */
    const LEVELS = {
      new: ["beginner"],
      some: ["beginner", "intermediate"],
      advanced: ["beginner", "intermediate", "advanced"]
    };

    /* `query` is a fourth answer alongside the three chip questions -- typing
       into the search box surfaces matches in the same results box a chip
       pick does, rather than filtering the library below on its own. */
    const answers = { goal: null, product: null, level: null, query: "" };
    const anyAnswer = () => Object.values(answers).some(Boolean);

    const matches = cell => {
      if (answers.goal && !cell.dataset.guideGoals.split(" ").includes(answers.goal)) return false;
      if (answers.level && !LEVELS[answers.level].includes(cell.dataset.guideLevel)) return false;
      /* Strict inclusion, no exemption for an empty product list. A product
         answer is "show me what's written about this," and a universal guide
         with no mention of it is not an answer to that -- it used to survive
         the filter regardless, which is how picking a single vendor like
         Unchained surfaced a dozen unrelated guides instead of the one that
         actually names it. */
      if (answers.product && !cell.dataset.guideProducts.split(" ").includes(answers.product)) return false;
      if (answers.query && !cellText.get(cell).includes(answers.query)) return false;
      return true;
    };

    const syncChips = () => {
      chips.forEach(chip => {
        const on = answers[chip.dataset.finderGroup] === chip.dataset.finderValue;
        chip.setAttribute("aria-pressed", on ? "true" : "false");
      });
    };

    /* Clones the real card out of the grid below rather than rebuilding a
       text-link summary of it -- the card already has its own title, summary,
       tags, and "Read guide" link. No heading of its own either: the count bar
       directly above already says "N guides ready to read", so a second
       "N guides available" line here was the same fact twice.

       Capped at PICK_LIMIT cards up front -- a wide-open question like just
       picking a level can match a dozen guides, and this box sits above the
       full, un-filtered library anyway, so there is no need to dump all of
       them here at once. The rest sit in the DOM already hidden, so "Show
       more" is just an unhide rather than a second render pass. Document
       order is already the curated order (foundations before devices before
       advanced), so no re-sort is needed either way. */
    const PICK_LIMIT = 3;

    const renderPick = matched => {
      const readable = matched.filter(c => c.dataset.guideStatus === "published");
      if (!anyAnswer() || !readable.length) {
        pick.hidden = true;
        pick.replaceChildren();
        return;
      }

      const row = document.createElement("div");
      row.className = "row g-4";
      readable.forEach((cell, index) => {
        const card = cell.querySelector(".sc-guide-card");
        if (!card) return;
        const col = document.createElement("div");
        col.className = "col-md-6 col-xl-4";
        col.hidden = index >= PICK_LIMIT;
        const clone = card.cloneNode(true);
        /* Cards further down the page may not have been scroll-revealed yet,
           and the clone inherits .sc-reveal's opacity: 0 with them. The finder
           sits above them, so the clone has to be marked revealed itself. */
        clone.classList.add("sc-reveal", "is-visible");
        col.appendChild(clone);
        row.appendChild(col);
      });

      const extra = readable.length - PICK_LIMIT;
      const children = extra > 0 ? [row, moreButton(row, extra)] : [row];
      pick.replaceChildren(...children);
      pick.hidden = false;
    };

    const moreButton = (row, extra) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sc-finder-more";
      button.textContent = `Show ${extra} more`;
      button.addEventListener("click", () => {
        row.querySelectorAll("[hidden]").forEach(col => { col.hidden = false; });
        button.remove();
      });
      return button;
    };

    const apply = () => {
      /* The library below the finder is left exactly as it renders on load --
         no cards hidden, no sections collapsed, no jump links removed. The
         finder answers inside its own box; the page underneath stays a
         complete, browsable library either way. That also means the results
         in the box have to be the full set rather than a preview, since
         there is no longer a filtered grid below to fall back on. */
      const matched = cells.filter(matches);
      const ready = matched.filter(c => c.dataset.guideStatus === "published").length;
      const soon = matched.length - ready;

      bar.hidden = !anyAnswer();
      if (noneEl) noneEl.hidden = !(anyAnswer() && !matched.length);

      if (anyAnswer()) {
        countEl.textContent = "";
        if (!matched.length) {
          countEl.textContent = "Nothing matches those answers yet.";
        } else {
          const strong = document.createElement("strong");
          strong.textContent = String(ready);
          countEl.append(
            strong,
            document.createTextNode(
              ` guide${ready === 1 ? "" : "s"} ready to read` +
              (soon ? `, ${soon} more being written` : "")
            )
          );
        }
      }

      renderPick(matched);
    };

    const syncUrl = () => {
      const params = new URLSearchParams();
      Object.entries(answers).forEach(([k, v]) => { if (v) params.set(k, v); });
      const query = params.toString();
      history.replaceState(null, "", query ? `?${query}${location.hash}` : location.pathname + location.hash);
    };

    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        const group = chip.dataset.finderGroup;
        const value = chip.dataset.finderValue;
        /* Clicking the selected chip again clears that answer, which is the
           only way back to "all" for a single question without resetting the
           other two. */
        answers[group] = answers[group] === value ? null : value;
        syncChips();
        apply();
        syncUrl();
      });
    });

    searchInput.addEventListener("input", () => {
      answers.query = searchInput.value.trim().toLowerCase();
      searchClear.hidden = !answers.query;
      apply();
      syncUrl();
    });

    searchClear.addEventListener("click", () => {
      searchInput.value = "";
      answers.query = "";
      searchClear.hidden = true;
      apply();
      syncUrl();
      searchInput.focus();
    });

    clearBtn.addEventListener("click", () => {
      answers.goal = null;
      answers.product = null;
      answers.level = null;
      answers.query = "";
      searchInput.value = "";
      searchClear.hidden = true;
      syncChips();
      apply();
      syncUrl();
      finderSection.scrollIntoView({ block: "start" });
    });

    /* Read any incoming ?goal=&product=&level=&query= before the first paint
       of the revealed finder, so a deep link never flashes the unfiltered
       library. */
    const incoming = new URLSearchParams(location.search);
    const valid = {
      goal: new Set(chips.filter(c => c.dataset.finderGroup === "goal").map(c => c.dataset.finderValue)),
      product: new Set(chips.filter(c => c.dataset.finderGroup === "product").map(c => c.dataset.finderValue)),
      level: new Set(Object.keys(LEVELS))
    };
    ["goal", "product", "level"].forEach(key => {
      const value = incoming.get(key);
      if (value && valid[key].has(value)) answers[key] = value;
    });
    const incomingQuery = incoming.get("query");
    if (incomingQuery) {
      answers.query = incomingQuery.trim().toLowerCase();
      searchInput.value = incomingQuery;
      searchClear.hidden = false;
    }

    finderSection.hidden = false;
    syncChips();
    apply();

    /* A deep link with answers but no anchor should land on the results rather
       than at the top of the page. An explicit #section in the URL wins. */
    if (anyAnswer() && !location.hash) {
      requestAnimationFrame(() => finderSection.scrollIntoView({ block: "start" }));
    }
  }

  /**
   * Searchable Bitcoin glossary. The public API is the source of record, so a
   * catalogue update does not require rebuilding this site. All remote values
   * are inserted with textContent rather than interpreted as markup.
   */
  const glossary = document.querySelector("[data-glossary]");

  if (glossary) {
    const API_URL = "https://btclexicon.com/api/v2/terms";
    const search = glossary.querySelector("[data-glossary-search]");
    const clear = glossary.querySelector("[data-glossary-clear]");
    const count = glossary.querySelector("[data-glossary-count]");
    const letters = glossary.querySelector("[data-glossary-letters]");
    const status = glossary.querySelector("[data-glossary-status]");
    const results = glossary.querySelector("[data-glossary-results]");
    const empty = glossary.querySelector("[data-glossary-empty]");
    const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });
    const state = { terms: [], query: "", letter: "all" };
    const localTerms = [
      {
        id: "descriptor",
        title: "Wallet descriptor",
        definition: "A structured description of a Bitcoin wallet's public keys, derivation paths, script type, and spending policy. Also called an output descriptor, it lets compatible software reconstruct addresses and coordinate or watch the wallet without containing the private keys required to spend.",
        example: "A multisig backup includes the wallet descriptor so compatible software can rebuild the same 2-of-3 policy and derive the same addresses.",
        categories: ["Wallets", "Recovery", "Multisig", "Technical"]
      },
      {
        id: "microsd_backup",
        title: "MicroSD backup",
        definition: "A backup file or wallet record stored on a removable MicroSD card. Hardware wallets may use MicroSD cards to move PSBTs, export wallet data, install firmware, or save an encrypted device backup without connecting the signer directly to an online computer. What the card contains—and whether it is encrypted—depends on the device and workflow.",
        example: "A COLDCARD can save an encrypted backup containing its seed and settings to a MicroSD card; the backup file and its separate password are both required for recovery.",
        categories: ["Hardware Wallets", "Backups", "Recovery", "Storage"]
      },
      {
        id: "nfc",
        title: "NFC",
        definition: "Near Field Communication: a very short-range wireless technology that exchanges data when compatible devices are brought within a few centimetres of each other. Bitcoin devices and keycards may use NFC to transfer wallet data or approve actions, but NFC is still a communication channel and should not automatically be treated as an air gap.",
        example: "A user taps an NFC keycard against a phone to authorize a wallet operation without plugging in a cable.",
        categories: ["Hardware Wallets", "Connectivity", "Technical"]
      },
      {
        id: "passphrase",
        title: "Passphrase",
        definition: "An optional secret combined with a wallet backup to derive a different wallet. Under BIP39, every passphrase—including an empty or incorrect one—produces a valid wallet, so there is no error message that can identify the right one. The same recovery words and exact passphrase are both required to restore the intended wallet.",
        example: "Restoring the correct recovery words with a misspelled passphrase opens a different, usually empty wallet rather than reporting a mistake.",
        categories: ["Wallets", "Security", "Recovery", "BIP39"]
      },
      {
        id: "phishing",
        title: "Phishing",
        definition: "A social-engineering attack that impersonates a trusted person, company, website, or app to trick someone into revealing secrets or approving a harmful action. In Bitcoin, phishing commonly targets exchange credentials, recovery words, passphrases, wallet downloads, addresses, and transaction approvals.",
        example: "A fake support message sends a user to a look-alike website that asks for recovery words to ‘verify’ a wallet.",
        categories: ["Security", "Threats", "Exchanges"]
      },
      {
        id: "secure_element",
        title: "Secure element",
        definition: "A tamper-resistant chip designed to store sensitive data and perform security-critical operations in an isolated environment. In a hardware wallet it may protect secrets, enforce PIN rules, or assist with signing, but its presence alone does not prove the entire device or firmware is secure.",
        example: "A hardware wallet stores key material in a secure element while its main processor handles the display and user interface.",
        categories: ["Hardware Wallets", "Security", "Technical"]
      },
      {
        id: "shamir_backup",
        title: "Shamir backup",
        definition: "A threshold backup method, commonly implemented for wallets as SLIP39, that divides a master secret into multiple unique recovery shares. A chosen minimum number of shares can reconstruct the wallet; fewer than that threshold do not reveal the master secret. SLIP39 shares are not ordinary BIP39 recovery words and require compatible recovery software or hardware.",
        example: "With a 2-of-3 Shamir backup, any two of the three shares can recover the wallet, while one share alone is insufficient.",
        categories: ["Backups", "Recovery", "Security", "SLIP39"]
      },
      {
        id: "reproducible_firmware",
        title: "Reproducible firmware",
        definition: "Firmware whose published source code and documented build process can be independently rebuilt to produce the same binary distributed by the vendor. Matching builds provide evidence that the released firmware corresponds to the reviewed source, but they do not prove that the source itself is bug-free or safe.",
        example: "Independent builders compile a hardware wallet's tagged source release and compare the resulting firmware hash with the vendor's download.",
        categories: ["Hardware Wallets", "Open Source", "Security", "Firmware"]
      },
      {
        id: "sim_swap",
        title: "SIM swap",
        definition: "An account-takeover attack in which a criminal causes a mobile carrier to move a victim's phone number to a SIM or device the criminal controls. Calls and text messages—including SMS login codes—can then be intercepted, which is why SMS should not be the strongest protection on an exchange account.",
        example: "An attacker takes over a phone number, resets an exchange password, and receives the exchange's SMS verification code.",
        categories: ["Security", "Threats", "Exchanges", "2FA"]
      },
      {
        id: "threat_model",
        title: "Threat model",
        definition: "A structured assessment of what you are protecting, who or what could harm it, how likely those events are, and which safeguards address them. A useful Bitcoin threat model includes digital theft, physical loss, coercion, fire or flood, user error, privacy leakage, and the people who may need to recover the wallet.",
        example: "Someone living alone may prioritize recoverability and inheritance differently from a public figure who faces targeted physical threats.",
        categories: ["Security", "Planning", "Risk"]
      },
      {
        id: "watch_only_wallet",
        title: "Watch-only wallet",
        definition: "A wallet that tracks addresses, balances, and transactions without holding the private keys needed to spend. It can receive funds and usually construct unsigned transactions, but signing must happen in a separate wallet or hardware device. Importing an XPUB or descriptor can create a watch-only wallet while also exposing wallet history to the software or server used.",
        example: "Sparrow on an online computer watches the wallet and prepares a PSBT; an offline hardware wallet reviews and signs it.",
        categories: ["Wallets", "Security", "Privacy", "Technical"]
      },
      {
        id: "wrench_attack",
        title: "Wrench attack",
        definition: "An attack that bypasses cryptography entirely by coercing the owner into handing over their keys or moving funds. Also called the $5 wrench attack, after a well-known comic observing that an adversary is far more likely to threaten a person than to break their encryption. Because no key length or signing policy applies, the defences are different in kind: discretion about holdings, arrangements that make immediate transfer genuinely impossible, and keeping a small amount available to surrender.",
        example: "A holder is confronted at home and forced to unlock a wallet; a mandatory login countdown means the funds cannot be moved that evening by anyone, including them.",
        categories: ["Security", "Risk", "Planning"]
      },
      {
        id: "checksum",
        title: "Checksum",
        definition: "A short value calculated from a larger piece of data specifically to catch errors in it. Bitcoin uses checksums in several unrelated places: the final word of a BIP39 recovery phrase encodes a checksum of the words before it, so most (not all) transcription mistakes produce an invalid phrase rather than a silently different wallet; bech32 addresses carry a checksum strong enough to catch typos reliably; and software releases are distributed with a checksum file so a download can be verified against what the developers actually published.",
        example: "Before flashing a signer's firmware, a user checks the published SHA256 checksum against the file they downloaded to confirm nothing was altered in transit.",
        categories: ["Technical", "Backups", "Security"]
      }
    ];

    const normalize = value => String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const firstLetter = title => {
      const first = String(title || "").trim().charAt(0).toUpperCase();
      return /[A-Z]/.test(first) ? first : "0-9";
    };

    const make = (tag, className, text) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (text !== undefined) element.textContent = text;
      return element;
    };

    const renderCard = term => {
      const article = make("article", "sc-glossary-card");
      article.id = `term-${term.id}`;

      const headingRow = make("div", "sc-glossary-card-head");
      const heading = make("h2", "", term.title);
      headingRow.append(heading);

      const definition = make("p", "sc-glossary-definition", term.definition);
      article.append(headingRow, definition);

      if (term.example) {
        const example = make("p", "sc-glossary-example");
        example.append(make("span", "", "Example: "), document.createTextNode(term.example));
        article.append(example);
      }

      if (term.categories.length) {
        const categoryList = make("ul", "sc-glossary-categories");
        categoryList.setAttribute("aria-label", "Categories");
        term.categories.forEach(category => {
          const item = make("li", "", category);
          categoryList.append(item);
        });
        article.append(categoryList);
      }

      return article;
    };

    const render = () => {
      const words = normalize(state.query).split(/\s+/).filter(Boolean);
      const shown = state.terms.filter(term => {
        if (state.letter !== "all" && term.letter !== state.letter) return false;
        return words.every(word => term.searchText.includes(word));
      });

      const fragment = document.createDocumentFragment();
      shown.forEach(term => fragment.append(renderCard(term)));
      results.replaceChildren(fragment);
      results.hidden = !shown.length;
      empty.hidden = Boolean(shown.length);
      clear.hidden = !state.query;
      count.textContent = `${shown.length.toLocaleString()} of ${state.terms.length.toLocaleString()} terms`;
    };

    const renderLetters = () => {
      const available = new Set(state.terms.map(term => term.letter));
      const options = ["all", "0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
      const fragment = document.createDocumentFragment();

      options.forEach(letter => {
        const button = make("button", "sc-glossary-letter", letter === "all" ? "All" : letter);
        button.type = "button";
        button.dataset.letter = letter;
        button.disabled = letter !== "all" && !available.has(letter);
        button.setAttribute("aria-pressed", String(letter === state.letter));
        button.addEventListener("click", () => {
          state.letter = letter;
          letters.querySelectorAll("button").forEach(item => {
            item.setAttribute("aria-pressed", String(item.dataset.letter === letter));
          });
          render();
        });
        fragment.append(button);
      });

      letters.replaceChildren(fragment);
    };

    search.addEventListener("input", () => {
      state.query = search.value.trim();
      render();
    });

    clear.addEventListener("click", () => {
      search.value = "";
      state.query = "";
      search.focus();
      render();
    });

    fetch(API_URL, { headers: { Accept: "application/json" } })
      .then(response => {
        if (!response.ok) throw new Error(`Glossary request failed: ${response.status}`);
        return response.json();
      })
      .then(payload => {
        const apiTerms = Object.entries(payload)
          .filter(([, group]) => group && typeof group === "object" && !Array.isArray(group))
          .flatMap(([, group]) => Object.values(group));

        state.terms = [...new Map([...apiTerms, ...localTerms].map(term => [term.id, term])).values()]
          /* The API includes one `lexicon_categories` metadata record alongside
             its term objects. It has a title but no definition and should not
             be rendered as a glossary card. */
          .filter(term => term && term.id && term.title && term.definition)
          .map(term => ({
            ...term,
            categories: Array.isArray(term.categories) ? term.categories : [],
            letter: firstLetter(term.title),
            searchText: normalize([
              term.title,
              term.definition,
              term.example,
              term.part_of_speech,
              ...(Array.isArray(term.categories) ? term.categories : [])
            ].join(" "))
          }))
          .sort((a, b) => collator.compare(a.title, b.title));

        status.hidden = true;
        renderLetters();
        render();

        if (location.hash.startsWith("#term-")) {
          requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
        }
      })
      .catch(() => {
        status.classList.add("is-error");
        status.replaceChildren(
          make("h2", "", "The glossary could not be loaded."),
          make("p", "", "The source may be temporarily unavailable. Refresh this page to try again.")
        );
        count.textContent = "Glossary unavailable";
      });
  }
})();

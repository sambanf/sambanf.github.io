/* ============================================================
   Shared scroll motion for sambanf.github.io.

   Load it in <head>, right after theme.js. It is tiny and must run
   before first paint, so content that waits to be revealed never
   flashes in and then disappears:
     <script src="../assets/motion.js"></script>

   Markup hooks:
     data-reveal                rise and fade in when scrolled into view
     data-reveal="left|right"   slide in from that side instead
     data-reveal="zoom|fade"    grow in, or a plain fade
     data-reveal="stagger"      the element fades in, then its children
                                rise in one by one (headings, text blocks)
     data-reveal="load"         a card "loads": like stagger, plus a sheen
                                sweeping across the card. Combine freely:
                                data-reveal="load right". The element
                                becomes position: relative.
     data-parallax="0.1"        drift at this fraction of the scroll distance
     <body data-scroll-progress> thin reading-progress bar along the top

   Elements that come into view together are staggered in reading order.
   With prefers-reduced-motion, or without JavaScript, nothing is hidden
   and nothing moves. The CSS lives here (not in style.css) so the app
   pages, which carry their own styles, get it too.
   ============================================================ */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var enabled = !reduced && 'IntersectionObserver' in window;

  var EASE = 'cubic-bezier(.16,1,.3,1)';
  var STAGGER = 65;   // ms between items that enter together
  var MAX_STEPS = 8;  // ...capped, so a full screen of cards doesn't drag

  var css = [
    'html.motion [data-reveal]:not(.is-in){opacity:0;translate:0 28px;scale:.97}',
    'html.motion [data-reveal~="fade"]:not(.is-in){translate:none;scale:none}',
    'html.motion [data-reveal~="left"]:not(.is-in){translate:-40px 0;scale:none}',
    'html.motion [data-reveal~="right"]:not(.is-in){translate:40px 0;scale:none}',
    'html.motion [data-reveal~="zoom"]:not(.is-in){translate:0 16px;scale:.9}',
    'html.motion [data-reveal].is-in:not(.is-done){transition:opacity .6s cubic-bezier(.2,.65,.3,1) var(--reveal-delay,0s),' +
      'translate .9s ' + EASE + ' var(--reveal-delay,0s),scale .9s ' + EASE + ' var(--reveal-delay,0s)}',

    /* Phones: sideways slides would push the page wider, so rise instead */
    '@media (max-width:700px){html.motion [data-reveal~="left"]:not(.is-in),' +
      'html.motion [data-reveal~="right"]:not(.is-in){translate:0 28px}}',

    /* "stagger" and "load": the shell first, then the contents one by one */
    'html.motion :is([data-reveal~="load"],[data-reveal~="stagger"]):not(.is-in)>*{opacity:0;translate:0 12px}',
    'html.motion :is([data-reveal~="load"],[data-reveal~="stagger"]).is-in:not(.is-done)>*{transition:' +
      'opacity .5s ease calc(var(--reveal-delay,0s) + .2s + var(--child-delay,0s)),' +
      'translate .7s ' + EASE + ' calc(var(--reveal-delay,0s) + .2s + var(--child-delay,0s))}',
    'html.motion :is([data-reveal~="load"],[data-reveal~="stagger"])>:nth-child(2){--child-delay:.07s}',
    'html.motion :is([data-reveal~="load"],[data-reveal~="stagger"])>:nth-child(3){--child-delay:.14s}',
    'html.motion :is([data-reveal~="load"],[data-reveal~="stagger"])>:nth-child(4){--child-delay:.21s}',
    'html.motion :is([data-reveal~="load"],[data-reveal~="stagger"])>:nth-child(n+5){--child-delay:.28s}',
    '[data-reveal~="load"]{position:relative}',
    'html.motion [data-reveal~="load"].is-in:not(.is-done)::after{content:"";position:absolute;inset:0;border-radius:inherit;' +
      'pointer-events:none;background:linear-gradient(100deg,transparent 30%,' +
      'color-mix(in srgb,var(--accent,#3b82f6) 18%,transparent) 50%,transparent 70%) no-repeat;' +
      'background-size:250% 100%;animation:reveal-sheen 1.1s ease var(--reveal-delay,0s) both}',
    '@keyframes reveal-sheen{from{background-position:130% 0}to{background-position:-30% 0}}',

    '.scroll-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:1000;pointer-events:none;' +
      'transform-origin:0 50%;transform:scaleX(0);' +
      'background:linear-gradient(90deg,var(--accent,#3b82f6),color-mix(in srgb,var(--accent,#3b82f6) 45%,#a78bfa))}',

    '@media print{html.motion [data-reveal]:not(.is-in),html.motion [data-reveal]:not(.is-in)>*' +
      '{opacity:1!important;translate:none!important;scale:none!important}.scroll-progress{display:none}}'
  ].join('\n');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  if (enabled) root.classList.add('motion');

  /* ---------- Reveal on scroll ---------- */

  function finish(el) {
    el.classList.add('is-in', 'is-done');
  }

  function reveal(el, delay) {
    el.style.setProperty('--reveal-delay', delay + 'ms');
    el.classList.add('is-in');
    var settle = /load|stagger/.test(el.getAttribute('data-reveal') || '') ? 1300 : 1000;
    setTimeout(function () {
      el.classList.add('is-done');
      el.style.removeProperty('--reveal-delay');
    }, delay + settle);
  }

  function inReadingOrder(a, b) {
    var ra = a.boundingClientRect, rb = b.boundingClientRect;
    return (Math.round(ra.top / 8) - Math.round(rb.top / 8)) || (ra.left - rb.left);
  }

  var io = null;

  function startReveal() {
    io = new IntersectionObserver(function (entries) {
      var entering = [];
      entries.forEach(function (entry) {
        var r = entry.boundingClientRect;
        if (entry.isIntersecting) {
          entering.push(entry);
        } else if (r.bottom <= 0 && (r.width || r.height)) {
          // Already scrolled past (reload mid-page, anchor jump): show it
          // as-is rather than animating content the reader won't watch.
          finish(entry.target);
          io.unobserve(entry.target);
        }
      });
      entering.sort(inReadingOrder).forEach(function (entry, i) {
        io.unobserve(entry.target);
        reveal(entry.target, Math.min(i, MAX_STEPS) * STAGGER);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

    observeAll(document);
  }

  function observeAll(scope) {
    if (!io) return;
    var els = scope.querySelectorAll('[data-reveal]:not(.is-in)');
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
  }

  /* ---------- Scroll-linked: progress bar + parallax ---------- */

  var bar = null;
  var parallax = [];
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function update() {
    ticking = false;
    var y = window.pageYOffset || root.scrollTop;
    if (bar) {
      var max = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
    for (var i = 0; i < parallax.length; i++) {
      parallax[i].el.style.translate = '0 ' + (y * parallax[i].factor).toFixed(1) + 'px';
    }
  }

  function startScrollEffects() {
    if (document.body.hasAttribute('data-scroll-progress')) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
    }
    if (enabled) {
      var els = document.querySelectorAll('[data-parallax]');
      for (var i = 0; i < els.length; i++) {
        var f = parseFloat(els[i].getAttribute('data-parallax'));
        if (f) parallax.push({ el: els[i], factor: f });
      }
    }
    if (!bar && !parallax.length) return;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function init() {
    try {
      if (enabled) startReveal();
      startScrollEffects();
    } catch (e) {
      // Never leave content hidden because of a script error.
      root.classList.remove('motion');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.SiteMotion = {
    enabled: enabled,
    reduced: reduced,
    /* Watch [data-reveal] elements added after load. */
    observe: function (scope) { observeAll(scope || document); }
  };
})();

/* ============================================================
   Shared dark-mode toggle for sambanf.github.io.

   Load this in <head> (it is tiny and must run before first paint
   so a saved choice never flashes the wrong theme):
     <script src="../assets/theme.js"></script>

   Pages add a button anywhere in the body:
     <button type="button" class="theme-toggle" aria-label="Dark mode / Mode gelap" aria-pressed="false">
       <svg class="icon-sun">…</svg><svg class="icon-moon">…</svg>
     </button>

   Behavior: with no saved choice the site follows the system
   (prefers-color-scheme) and keeps following it live. Clicking the
   toggle stores an explicit 'light'/'dark' in localStorage
   ('site.theme') and sets data-theme on <html>, which the
   stylesheets treat as an override.
   ============================================================ */

(function () {
  'use strict';

  var KEY = 'site.theme';
  var stored = null;
  try {
    var s = localStorage.getItem(KEY);
    if (s === 'light' || s === 'dark') stored = s;
  } catch (e) { /* private browsing */ }

  function systemDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function effective() {
    return stored || (systemDark() ? 'dark' : 'light');
  }

  function apply() {
    if (stored) document.documentElement.setAttribute('data-theme', stored);
    else document.documentElement.removeAttribute('data-theme');
    var pressed = effective() === 'dark' ? 'true' : 'false';
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', pressed);
  }

  // One delegated listener — works no matter when the button is rendered.
  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('.theme-toggle') : null;
    if (!btn) return;
    stored = effective() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, stored); } catch (e2) { /* ignore */ }
    apply();
  });

  // Keep following the system while the user hasn't chosen explicitly.
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () { if (!stored) apply(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  apply();                                            // before first paint (script runs in <head>)
  document.addEventListener('DOMContentLoaded', apply); // sync aria-pressed once buttons exist
})();

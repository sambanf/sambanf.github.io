/* ============================================================
   Shared language switcher for sambanf.github.io (EN / ID).

   Usage per page:
     1. Include this script, then define a dictionary:
          var I18N = {
            en: { _title: '...', _meta: '...', key: 'text', ... },
            id: { _title: '...', _meta: '...', key: 'teks', ... }
          };
     2. Mark elements:  <p data-i18n="key">english default</p>
        Attributes:     <input data-i18n-attr="aria-label:key;placeholder:key2">
     3. Call SiteLang.init(I18N, function (lang) { ...re-render dynamic bits... });

   The chosen language persists in localStorage ('site.lang') and is
   shared by every page on the site. First visit defaults to Indonesian
   when the browser reports an Indonesian locale, otherwise English.
   ============================================================ */

(function () {
  'use strict';

  var KEY = 'site.lang';
  var current = null;

  try { current = localStorage.getItem(KEY); } catch (e) { /* private browsing */ }
  if (current !== 'en' && current !== 'id') {
    var nav = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
    current = nav.indexOf('id') === 0 ? 'id' : 'en';
  }

  var listeners = [];

  function apply(dict) {
    var strings = dict[current] || dict.en;
    if (!strings) return;

    document.documentElement.lang = current;
    if (strings._title) document.title = strings._title;
    if (strings._meta) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', strings._meta);
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (strings[key] != null) el.textContent = strings[key];
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i === -1) return;
        var attr = pair.slice(0, i).trim();
        var key = pair.slice(i + 1).trim();
        if (strings[key] != null) el.setAttribute(attr, strings[key]);
      });
    });
  }

  function refreshButtons() {
    document.querySelectorAll('.lang-toggle [data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === current ? 'true' : 'false');
    });
  }

  window.SiteLang = {
    get: function () { return current; },

    /* BCP 47 locale for number formatting */
    locale: function () { return current === 'id' ? 'id-ID' : 'en-US'; },

    set: function (lang) {
      if (lang !== 'en' && lang !== 'id') return;
      if (lang === current) return;
      current = lang;
      try { localStorage.setItem(KEY, lang); } catch (e) { /* ignore */ }
      listeners.forEach(function (fn) { fn(lang); });
    },

    /* t('key') convenience against the dict passed to init */
    t: function (key) {
      var dict = this._dict;
      if (!dict) return key;
      var strings = dict[current] || dict.en;
      return (strings && strings[key] != null) ? strings[key] : key;
    },

    init: function (dict, onChange) {
      this._dict = dict;

      document.querySelectorAll('.lang-toggle [data-lang]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          window.SiteLang.set(btn.getAttribute('data-lang'));
        });
      });

      listeners.push(function (lang) {
        apply(dict);
        refreshButtons();
        if (onChange) onChange(lang);
      });

      apply(dict);
      refreshButtons();
      if (onChange) onChange(current);
    }
  };
})();

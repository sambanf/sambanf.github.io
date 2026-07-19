# sambanf.github.io

Personal site and simple tools, served by [GitHub Pages](https://pages.github.com/).

- **`/`** — portfolio landing page ([index.html](index.html))
- **`/stockavgdown/`** — stock average calculator ([stockavgdown/index.html](stockavgdown/index.html))
- **`/charcount/`** — character & word counter ([charcount/index.html](charcount/index.html))
- **`/base64/`** — Base64 encoder & decoder ([base64/index.html](base64/index.html))
- **`/timestamp/`** — Unix timestamp converter ([timestamp/index.html](timestamp/index.html))
- **`/jsonformat/`** — JSON formatter & validator ([jsonformat/index.html](jsonformat/index.html))
- **`/urlencode/`** — URL encoder & decoder ([urlencode/index.html](urlencode/index.html))
- **`/jwtdecode/`** — JWT decoder ([jwtdecode/index.html](jwtdecode/index.html))
- **`/hashgen/`** — hash & UUID generator ([hashgen/index.html](hashgen/index.html))
- **`/password/`** — password generator ([password/index.html](password/index.html))
- **`/cron/`** — cron expression builder ([cron/index.html](cron/index.html))
- **`/randompick/`** — random list picker ([randompick/index.html](randompick/index.html))
- **`/diff/`** — text diff checker ([diff/index.html](diff/index.html))
- **`/color/`** — color converter & contrast checker ([color/index.html](color/index.html))
- **`/assets/style.css`** — shared design tokens and base styles used by every page
- **`/assets/lang.js`** — shared English/Indonesian language switcher
- **`/assets/theme.js`** — shared dark-mode toggle (system default, manual override in `localStorage['site.theme']`)

## Adding a new tool

1. Create a folder, e.g. `mytool/`, with an `index.html` inside.
2. Link the shared stylesheet: `<link rel="stylesheet" href="../assets/style.css">`.
3. Add a card for it in the Tools section of the root `index.html`.
4. Commit and push — it appears at `https://sambanf.github.io/mytool/`.

## Languages (EN / ID)

Every page is bilingual. The flag toggle stores the choice in
`localStorage` under `site.lang`, shared across all pages; first-time
visitors get Indonesian if their browser locale is `id-*`, otherwise
English. To translate a new page: include `../assets/lang.js`, copy the
`.lang-toggle` markup from an existing page, mark elements with
`data-i18n="key"` (or `data-i18n-attr="aria-label:key"`), define a
`var I18N = { en: {...}, id: {...} }` dictionary, and call
`SiteLang.init(I18N)`. Use `SiteLang.t('key')` for strings built in JS
and `SiteLang.locale()` for number formatting.

Everything is plain HTML/CSS/JS with no build step and no external dependencies.

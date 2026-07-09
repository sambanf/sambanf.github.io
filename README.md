# sambanf.github.io

Personal site and simple tools, served by [GitHub Pages](https://pages.github.com/).

- **`/`** — portfolio landing page ([index.html](index.html))
- **`/stockavgdown/`** — stock average calculator ([stockavgdown/index.html](stockavgdown/index.html))
- **`/assets/style.css`** — shared design tokens and base styles used by every page
- **`/assets/lang.js`** — shared English/Indonesian language switcher

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

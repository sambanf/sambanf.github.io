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
- **`/countdown/`** — countdown timer, input in seconds ([countdown/index.html](countdown/index.html))
- **`/diff/`** — text diff checker ([diff/index.html](diff/index.html))
- **`/color/`** — color converter & contrast checker ([color/index.html](color/index.html))
- **`/tictactoe/`** — tic-tac-toe vs AI or 2 players ([tictactoe/index.html](tictactoe/index.html))
- **`/snake/`** — snake game ([snake/index.html](snake/index.html))
- **`/2048/`** — 2048 puzzle ([2048/index.html](2048/index.html))
- **`/memory/`** — memory match game ([memory/index.html](memory/index.html))
- **`/kings/`** — Lone Kings logic puzzle ([kings/index.html](kings/index.html))
- **`/sudoku/`** — Sudoku ([sudoku/index.html](sudoku/index.html))
- **`/slidepuzzle/`** — photo slide puzzle with offline download ([slidepuzzle/index.html](slidepuzzle/index.html))
- **`/stokancil/`** — Stokancil app site: homepage ([stokancil/index.html](stokancil/index.html)) and privacy policy ([stokancil/privacy/index.html](stokancil/privacy/index.html))
- **`/kaskucing/`** — Kaskucing app site: homepage ([kaskucing/index.html](kaskucing/index.html)) and privacy policy ([kaskucing/privacy/index.html](kaskucing/privacy/index.html))
- **`/koaladeck/`** — Koala Deck, a Windows app for an ESP32 volume controller ([koaladeck/index.html](koaladeck/index.html))
- **`/assets/style.css`** — shared design tokens, base styles and the tool-page header, used by every tool page
- **`/assets/motion.js`** — shared scroll animations (reveal on scroll, parallax, reading-progress bar); see [Motion](#motion)
- **`/assets/lang.js`** — shared English/Indonesian language switcher
- **`/assets/theme.js`** — shared dark-mode toggle (system default, manual override in `localStorage['site.theme']`)

## Adding a new tool

1. Create a folder, e.g. `mytool/`, with an `index.html` inside. Copying an
   existing tool page is the quickest start: it already has the top bar
   (`.top-nav` with the `.home-link` back to the homepage), the language and
   theme toggles, and the header (`h1` + one-line `.lede`).
2. In `<head>`, link `../assets/style.css`, then load `../assets/theme.js` and
   `../assets/motion.js` (in that order, both before the page's own styles run).
3. Give the main `.card.tool-card` and the `.card.how-card` below it a
   `data-reveal` attribute so they animate in.
4. Add a `<li class="tile">` to the right `.tool-group` in the Tools section of
   the root `index.html` (a template sits in a comment at the end of that
   section). The hero's tool count and the filter-chip counts update themselves.
5. Commit and push — it appears at `https://sambanf.github.io/mytool/`.

## App landing pages

Each app gets a folder holding a bilingual landing page and an `assets/` folder
with `icon-192.png` and `icon-512.png` (the Android apps also have a privacy
policy at `privacy/` and a 1200×630 `og.png` for link previews). They are
listed in the **Apps** section of the root `index.html`, above Tools and
deliberately outside it, so the tool search never filters them away. Each
`.app-card` shows the app's real launcher icon, a platform badge with the
Android or Windows logo, and sets `--brand` to the app's own colour for the
glow in its corner. The Android logo is the Android robot, shared by Google
under CC BY 3.0 — keep the credit line in the homepage footer while it's used.

Unlike the tools, these pages carry their own colour tokens inline rather than
using `assets/style.css`, so each app keeps its own brand palette. They still
load `assets/motion.js` for the scroll animations.

## Motion

`assets/motion.js` adds scroll animations through plain attributes, and injects
its own CSS so it works on pages that don't use `style.css`:

- `data-reveal` — the element rises and fades in when it scrolls into view.
  Variants: `left`, `right`, `zoom`, `fade`.
- `data-reveal="stagger"` — fades in, then its children rise in one by one
  (headings, text blocks).
- `data-reveal="load"` — for cards: the card rises in, a sheen sweeps across it,
  then its contents fade in one by one. Variants combine: `data-reveal="load right"`.
- `data-parallax="0.2"` — the element drifts at that fraction of the scroll.
- `<body data-scroll-progress>` — a thin reading-progress bar along the top.

Elements that come into view together are staggered in reading order.
Visitors who ask for reduced motion (or have JavaScript off) get every
element in place with no animation. The homepage hero, the tile stack, and
the tool-page headers animate with CSS keyframes gated on the `html.motion`
class that `motion.js` sets.

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

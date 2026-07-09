# sambanf.github.io

Personal site and simple tools, served by [GitHub Pages](https://pages.github.com/).

- **`/`** — portfolio landing page ([index.html](index.html))
- **`/stockavgdown/`** — stock average down calculator ([stockavgdown/index.html](stockavgdown/index.html))
- **`/assets/style.css`** — shared design tokens and base styles used by every page

## Adding a new tool

1. Create a folder, e.g. `mytool/`, with an `index.html` inside.
2. Link the shared stylesheet: `<link rel="stylesheet" href="../assets/style.css">`.
3. Add a card for it in the Tools section of the root `index.html`.
4. Commit and push — it appears at `https://sambanf.github.io/mytool/`.

Everything is plain HTML/CSS/JS with no build step and no external dependencies.

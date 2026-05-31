# My Sewing Picks — static affiliate site

Pure HTML/CSS/JS. No build step, no Node, no npm. Open `index.html` in a
browser, or upload everything to Bluehost `public_html` via File Manager.

## Folder structure
```
mysewingpicks/
├── index.html              Home (hero, category previews, YouTube link)
├── tools.html              Tools category page
├── fabrics.html            Fabrics & Materials category page
├── about.html              About the channel
├── css/
│   └── styles.css          All styling + the cozy theme (edit colors at the top)
├── js/
│   └── site.js             Header/footer + product-card rendering + SITE config
├── data/
│   ├── products.js         ⭐ ALL product data lives here — add products here
│   └── i18n.js             ⭐ ALL user-facing UI text lives here (translations)
└── assets/
    ├── logo.png            ← YOU ADD THIS (header logo; text shows if missing)
    ├── placeholder.svg     Auto-shown when a product photo is missing
    └── products/           ← YOU ADD PHOTOS HERE (filenames below)
```

## Files YOU need to add
1. **`assets/logo.png`** — your channel logo for the header. Until then the
   header shows the text "My Sewing Picks".
2. **`assets/products/<id>.jpg`** — one photo per product. Filenames must match
   the `image` field in `data/products.js`:
   - `olfa-rotary-cutter.jpg`
   - `olfa-cutting-mat.jpg`
   - `free-motion-presser-foot.jpg`
   - `quilting-rulers-set.jpg`
   - `rowenta-travel-iron.jpg`
   - `sewline-air-erasable-pen.jpg`
   - `lace-ribbon.jpg`
   - `quilting-fabric-bundles.jpg`

   Cards show a placeholder until the real photo exists — no code changes needed.

## Add a new product later
Open `data/products.js`, copy one `{ ... }` block, change the fields, and append
it to the array. Set `category` to `"tools"` or `"fabrics"`. Done — it appears
automatically on the right page.

## Add a social button later
Open `js/site.js`, find `SITE.socials`, and push another `{ label, url, icon }`.

## Internationalization (i18n) — foundation only, NOT active yet
All user-facing text is extracted into **`data/i18n.js`**, keyed by language code.
The site is **English-only right now** — only the `en` dictionary is filled and
`ACTIVE_LANG = 'en'` (in `js/site.js`).

Planned language codes (ISO 639-1), none active except `en`:

| Code | Language | Status |
|------|----------|--------|
| `en` | English  | ✅ active |
| `de` | German   | planned |
| `fr` | French   | planned |
| `es` | Spanish  | planned |
| `it` | Italian  | planned |
| `tr` | Turkish  | planned |
| `ja` | Japanese | planned |
| `pl` | Polish   | planned |
| `nl` | Dutch    | planned |
| `ar` | Arabic   | planned (right-to-left) |

To add a language later: copy the `en` block in `data/i18n.js`, translate the
values, then un-comment the language-switcher placeholder in `js/site.js`
(`renderHeader`) and set `ACTIVE_LANG` from the user's choice. Page text is wired
through `data-i18n` / `data-i18n-html` attributes, so no HTML copy is hardcoded.

## Multi-marketplace Amazon links — foundation only, NOT active yet
Each product in `data/products.js` now has a `links` object keyed by marketplace
(`us`, `de`, `es`, `uk`, `fr`, `it`, `tr`, `jp`, `ca`, `ae`) instead of a single
URL. **Only `us` is filled** today; the rest are empty placeholders.

`js/site.js` has a single constant `ACTIVE_MARKETPLACE = 'us'` that the card
renderer reads. To go multi-country later, fill the other links and change that
constant (or replace it with geo-detection / an Amazon OneLink URL — the seam is
marked with comments in `renderProductCard`).

## Notes
- Image paths are relative (no leading `/`), so the site works both when opened
  directly and on Bluehost in `public_html`.
- We intentionally show NO price or rating (Amazon Associates compliance).
- `.claude/launch.json` is only a local preview helper — harmless to upload or delete.

Built with AI-assisted development (Claude Code).

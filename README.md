# My Sewing Picks — affiliate site

Static affiliate site for the **SEWING DIY PATCHWORK** YouTube channel:
hand-picked sewing tools and fabrics with "View on Amazon" links.
Live at [mysewingpicks.com](https://mysewingpicks.com).

Built with [Astro](https://astro.build) as a **static site generator**: Astro
turns the source in `src/` into plain HTML/CSS in `dist/`. No server runtime —
the output is uploaded as static files to Bluehost shared hosting.

## Commands
```bash
npm ci            # install exact dependencies from package-lock.json
npm run dev       # local dev server with live reload (http://localhost:4321)
npm run build     # build the static site into dist/
npm run preview   # serve the built dist/ locally
```

## Folder structure
```
mysewingpicks/
├── src/
│   ├── pages/              One .astro file = one page (index, tools, fabrics, about)
│   ├── layouts/
│   │   └── BaseLayout.astro    Shared <head> + header + footer around every page
│   ├── components/
│   │   ├── Header.astro        Logo + navigation + mobile menu
│   │   ├── Footer.astro        Affiliate disclosure + social buttons
│   │   └── ProductCard.astro   The one reusable product card
│   ├── data/
│   │   ├── products.js     ⭐ ALL product data lives here — add products here
│   │   └── amazon.js       Marketplace + tracking ID; builds affiliate links
│   ├── assets/products/    Product photos (Astro converts them to optimized WebP)
│   └── styles/styles.css   All styling + the cozy theme (colors at the top)
├── public/                 Copied to the site as-is (logo)
├── dist/                   ⚠️ BUILT site — committed on purpose (see Deploy)
├── astro.config.mjs        Static output, file-style URLs (about.html)
└── .cpanel.yml             Bluehost deploy: copies dist/ into public_html
```

## Add a new product
1. Put the photo in `src/assets/products/<id>.jpg` (filename = product `id`).
2. Open `src/data/products.js`, copy one `{ ... }` block, change the fields and
   append it. Set `category` to `"tools"` or `"fabrics"` and `asin` to the
   product's Amazon code (the 10 characters after `/dp/` in its Amazon URL).
   The affiliate link is built automatically from the ASIN + the site's tag.
3. `npm run build`, then commit **both** the source and `dist/`.

If the photo is missing, the build stops with a clear error naming the product.

## Deploy
The server has no Node, so it cannot build. That is why `dist/` is committed:
on push, `.cpanel.yml` copies the contents of `dist/` into `public_html`.
**Always run `npm run build` before committing**, or the live site won't change.

## Amazon Associates rules
Cards show only photo + name + short description + "View on Amazon" + the
"(paid link)" marker. No prices, no ratings, no review counts. The footer
carries the site-wide disclosure.

## Affiliate links and marketplaces
Links are built in `src/data/amazon.js` as
`https://www.amazon.com/dp/<ASIN>?tag=<site tag>`. The site uses its own
tracking ID, separate from the YouTube channels, so its sales are reported
separately. Only the US marketplace is configured; adding another country means
joining that country's Associates program and adding its domain + tag to
`MARKETPLACES`. A product can override a link per marketplace via `links`.

## Security note
`.npmrc` sets `ignore-scripts=true`: npm never runs package install scripts
automatically (supply-chain hardening). Keep it that way.

Built with AI-assisted development (Claude Code).

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
│   ├── pages/              One .astro file = one page (index, tools, fabrics, setup, about)
│   ├── layouts/
│   │   └── BaseLayout.astro    Shared <head> + header + footer around every page
│   ├── components/
│   │   ├── Header.astro        Logo + navigation + mobile menu
│   │   ├── Footer.astro        Affiliate disclosure + social buttons
│   │   ├── ProductCard.astro   The one reusable product card
│   │   └── ProductSections.astro  A category's products, split into sections
│   ├── data/
│   │   ├── products.js     ⭐ ALL product data lives here — add products here
│   │   ├── categories.js   Category pages and their sections
│   │   └── amazon.js       Marketplace + tracking ID; builds affiliate links
│   ├── assets/products/    Product photos (Astro converts them to optimized WebP)
│   └── styles/styles.css   All styling + the cozy theme (colors at the top)
├── public/                 Copied to the site as-is (logo)
├── server/                 PHP cron script for Amazon product images (runs on
│                           Bluehost, deployed outside public_html)
├── dist/                   ⚠️ BUILT site — committed on purpose (see Deploy)
├── astro.config.mjs        Static output, file-style URLs (about.html)
└── .cpanel.yml             Bluehost deploy: copies dist/ into public_html
```

## Product images
Each card shows, in order of preference: the product's own photo (`image`) →
the Amazon image from the Creators API → a category placeholder. Amazon images
are never downloaded: a server cron (`server/refresh-images.php`) stores their
URLs in `catalog/images.json` twice a day, and the page ignores data older than
24 hours, as Amazon's policies require. API credentials live only on the server.

## Add a new product
1. Optional: put your OWN photo in `src/assets/products/<id>.jpg` and set
   `image`. Without it the card uses the Amazon image (or a placeholder).
2. Open `src/data/products.js`, copy one `{ ... }` block, change the fields and
   add it to the right section. Set `category` (`"tools"`, `"fabrics"` or
   `"setup"`), `group` (a section id from `src/data/categories.js`) and `asin`
   (the 10 characters after `/dp/` in the product's Amazon URL).
   The affiliate link is built automatically from the ASIN + the site's tag.
3. `npm run build`, then commit **both** the source and `dist/`.

If `image` names a file that doesn't exist, the build stops with a clear error.

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

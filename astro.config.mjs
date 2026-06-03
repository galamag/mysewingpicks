// @ts-check
import { defineConfig } from 'astro/config';

// Static site generation: Astro emits plain HTML/CSS/JS into dist/.
// No server runtime is produced — the output is uploaded as static files,
// which suits Bluehost shared hosting (no Node on the server).
export default defineConfig({
  site: 'https://mysewingpicks.com',
  output: 'static',
  build: {
    // Emit "about.html" (file-style URLs) instead of "about/index.html",
    // so migrated pages keep their existing URLs (e.g. /about.html).
    format: 'file',
    // Always emit the global CSS as an external, content-hashed file
    // (/_astro/styles.[hash].css) rather than inlining it — gives every page
    // a stable, cache-bustable URL that changes only when the CSS changes.
    inlineStylesheets: 'never',
  },
});

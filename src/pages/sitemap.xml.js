/* Build-time sitemap → dist/sitemap.xml. Deployed with the rest of dist/, so it
   replaces the hand-edited file on the server (don't edit it there any more).
   Every page in every built language comes from the page table in
   src/i18n/index.js — a new page, project or language lands here by itself. */
import { LOCALES, PAGES, pageUrl } from '../i18n/index.js';

export function GET({ site }) {
  if (!site) throw new Error('sitemap.xml: `site` is not set in astro.config.mjs');
  const urls = LOCALES.flatMap((lang) =>
    Object.keys(PAGES).map((page) => new URL(pageUrl(page, lang), site).href)
  );
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}

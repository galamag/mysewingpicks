/* =====================================================================
   AMAZON CONFIG  —  My Sewing Picks
   ---------------------------------------------------------------------
   One place for marketplace settings. Affiliate links are BUILT from a
   product's ASIN + this site's tracking ID (tag), so changing the tag here
   updates every link on the site.

   The site has its OWN tracking ID (separate from the YouTube channels'
   sewingandpatc-20), so site sales show up separately in Associates reports.

   To activate another marketplace later: join that country's Associates
   program, add its domain + tag below, then switch ACTIVE_MARKETPLACE.
   ===================================================================== */

export const ACTIVE_MARKETPLACE = 'us';

export const MARKETPLACES = {
  us: { domain: 'www.amazon.com', tag: 'mysewingpicks-20' },
};

/* Affiliate URL for a product in the active marketplace.
   A product may override it with links[marketplace] (e.g. when its ASIN
   differs in another country); otherwise the URL is built from its ASIN. */
export function amazonUrl(product, marketplace = ACTIVE_MARKETPLACE) {
  const override = product.links && product.links[marketplace];
  if (override) return override;

  const market = MARKETPLACES[marketplace];
  if (!market) throw new Error(`amazonUrl: marketplace "${marketplace}" is not configured`);
  if (!product.asin) throw new Error(`amazonUrl: product "${product.id}" has no asin`);

  return `https://${market.domain}/dp/${product.asin}?tag=${market.tag}`;
}

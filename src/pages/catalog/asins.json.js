/* Build-time list of product ASINs → dist/catalog/asins.json.
   Read on the server by the cron script (server/refresh-images.php), which
   fetches these products' image URLs from the Amazon Creators API. */
import { products } from '../../data/products.js';

export function GET() {
  const asins = [...new Set(products.map((p) => p.asin).filter(Boolean))];
  return new Response(JSON.stringify({ asins }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}

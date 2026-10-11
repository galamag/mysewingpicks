/* =====================================================================
   PRODUCTS DATA  —  My Sewing Picks  (Astro source of truth)
   ---------------------------------------------------------------------
   One place for all product data. Rendered STATICALLY at build time by
   src/components/ProductCard.astro (no browser JS).

   Each product:
     id               unique slug
     name             product title
     shortDescription one friendly line
     category         "tools" | "fabrics"  (drives which page shows it)
     asin             Amazon product code (10 chars, from amazon.com/dp/<ASIN>).
                      The affiliate link is built from it + the site's tag
                      in src/data/amazon.js.
     links            OPTIONAL per-marketplace URL override, e.g. { de: '...' }
                      — only when the built link can't be used.
     image            OPTIONAL. OWN photo filename in src/assets/products/
                      (Astro optimizes it). Without it the card shows the
                      Amazon image from the Creators API, or a placeholder.
                      NEVER use photos downloaded from Amazon.
     imageFit         OPTIONAL, own photos only. "cover" (default, fills box) |
                      "contain" (fits whole photo inside the box, soft padding).

   Amazon rules: NO price, NO rating, NO review count.
   This file is the ONLY source of product data.
   ===================================================================== */

export const products = [
  /* ---------------- TOOLS ---------------- */
  {
    id: 'olfa-rotary-cutter',
    name: 'Olfa 45mm Rotary Cutter',
    shortDescription:
      'A sharp, comfortable rotary cutter for clean, accurate cuts through several layers of fabric at once.',
    category: 'tools',
    asin: 'B000BNLLHW',
  },
  {
    id: 'olfa-cutting-mat',
    name: 'OLFA 24"x18" Self-Healing Rotary Cutting Mat',
    shortDescription:
      'A self-healing mat that protects your table and keeps every rotary cut crisp and precise.',
    category: 'tools',
    asin: 'B000BNLO3S',
  },
  {
    id: 'free-motion-presser-foot',
    name: 'Free Motion Sewing Machine Presser Foot (3 pcs, low shank)',
    shortDescription:
      'A set of low-shank darning feet for smooth free-motion quilting and thread sketching.',
    category: 'tools',
    asin: 'B07CH388RL',
  },
  {
    id: 'quilting-rulers-set',
    name: 'Complete Quilting Rulers Set (12.5 / 9.5 / 6.5 / 4.5 in + 6x12 + right triangle)',
    shortDescription:
      'A full set of clear acrylic rulers for measuring, squaring up, and cutting quilt blocks accurately.',
    category: 'tools',
    asin: 'B08W324ZXD',
  },
  {
    id: 'rowenta-travel-iron',
    name: 'Rowenta DA1560 Travel Compact Steam Iron',
    shortDescription:
      'A lightweight, compact steam iron for crisp seams and pressing wherever you sew.',
    category: 'tools',
    asin: 'B001RNOQIQ',
  },
  {
    id: 'sewline-air-erasable-pen',
    name: 'Sewline Air-Erasable Fabric Pen',
    shortDescription:
      'Marks your fabric clearly, then fades away on its own — no rinsing and no residue left behind.',
    category: 'tools',
    asin: 'B0083JM7VU',
  },

  /* ---------------- FABRICS & MATERIALS ---------------- */
  {
    id: 'lace-ribbon',
    name: 'Lace Ribbon for Sewing',
    shortDescription:
      'Delicate lace trim for finishing edges, embellishing bags, and adding a handmade touch to any project.',
    category: 'fabrics',
    asin: 'B08Y8G4M35',
  },
  {
    id: 'quilting-fabric-bundles',
    name: 'Quilting Fabric Bundles for DIY Sewing',
    shortDescription:
      'Pre-coordinated fabric bundles to jump-start your next patchwork or quilting project with ready-to-go colors.',
    category: 'fabrics',
    asin: 'B08CZGXSWD',
  },
];

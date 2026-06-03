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
     links            affiliate links keyed by Amazon marketplace (us active)
     image            filename in src/assets/products/ (Astro optimizes it)
     imageFit         OPTIONAL. "cover" (default, fills box) | "contain"
                      (fits whole photo inside the box, soft padding) — pick
                      per photo's proportions so cards look tidy & uniform.

   Amazon rules: NO price, NO rating, NO review count.
   (During migration this mirrors the legacy data/products.js. After the
   legacy files are removed in a later phase, this becomes the only source.)
   ===================================================================== */

export const products = [
  /* ---------------- TOOLS ---------------- */
  {
    id: 'olfa-rotary-cutter',
    name: 'Olfa 45mm Rotary Cutter',
    shortDescription:
      'A sharp, comfortable rotary cutter for clean, accurate cuts through several layers of fabric at once.',
    category: 'tools',
    links: { us: 'https://amzn.to/4veHJ3T', de: '', es: '', uk: '', fr: '', it: '', tr: '', jp: '', ca: '', ae: '' },
    image: 'olfa-rotary-cutter.jpg',
    imageFit: 'contain', // wide & short photo — fit whole knife, don't crop
  },
  {
    id: 'olfa-cutting-mat',
    name: 'OLFA 24"x18" Self-Healing Rotary Cutting Mat',
    shortDescription:
      'A self-healing mat that protects your table and keeps every rotary cut crisp and precise.',
    category: 'tools',
    links: { us: 'https://amzn.to/3KwG2ZA', de: '', es: '', uk: '', fr: '', it: '', tr: '', jp: '', ca: '', ae: '' },
    image: 'olfa-cutting-mat.jpg',
    // landscape (~4:3) — "cover" fills the box nicely
  },
  {
    id: 'free-motion-presser-foot',
    name: 'Free Motion Sewing Machine Presser Foot (3 pcs, low shank)',
    shortDescription:
      'A set of low-shank darning feet for smooth free-motion quilting and thread sketching.',
    category: 'tools',
    links: { us: 'https://amzn.to/3R4aRY6', de: '', es: '', uk: '', fr: '', it: '', tr: '', jp: '', ca: '', ae: '' },
    image: 'free-motion-presser-foot.jpg',
    imageFit: 'contain', // square 6-photo collage — fit whole thing, don't crop any panel
  },
  {
    id: 'quilting-rulers-set',
    name: 'Complete Quilting Rulers Set (12.5 / 9.5 / 6.5 / 4.5 in + 6x12 + right triangle)',
    shortDescription:
      'A full set of clear acrylic rulers for measuring, squaring up, and cutting quilt blocks accurately.',
    category: 'tools',
    links: { us: 'https://amzn.to/3wHxIjQ', de: '', es: '', uk: '', fr: '', it: '', tr: '', jp: '', ca: '', ae: '' },
    image: 'quilting-rulers-set.jpg',
    imageFit: 'contain', // near-square — show the full set without cropping ruler edges
  },
  {
    id: 'rowenta-travel-iron',
    name: 'Rowenta DA1560 Travel Compact Steam Iron',
    shortDescription:
      'A lightweight, compact steam iron for crisp seams and pressing wherever you sew.',
    category: 'tools',
    links: { us: 'https://amzn.to/3RFrKIH', de: '', es: '', uk: '', fr: '', it: '', tr: '', jp: '', ca: '', ae: '' },
    image: 'rowenta-travel-iron.jpg',
    imageFit: 'contain', // square product shot — keep the whole iron in frame
  },
  {
    id: 'sewline-air-erasable-pen',
    name: 'Sewline Air-Erasable Fabric Pen',
    shortDescription:
      'Marks your fabric clearly, then fades away on its own — no rinsing and no residue left behind.',
    category: 'tools',
    links: { us: 'https://amzn.to/3B1jHQN', de: '', es: '', uk: '', fr: '', it: '', tr: '', jp: '', ca: '', ae: '' },
    image: 'sewline-air-erasable-pen.jpg',
    imageFit: 'contain', // tall/portrait photo — fit it instead of cropping a slice
  },

  /* ---------------- FABRICS & MATERIALS ---------------- */
  {
    id: 'lace-ribbon',
    name: 'Lace Ribbon for Sewing',
    shortDescription:
      'Delicate lace trim for finishing edges, embellishing bags, and adding a handmade touch to any project.',
    category: 'fabrics',
    links: { us: 'https://amzn.to/3RtkO1b', de: '', es: '', uk: '', fr: '', it: '', tr: '', jp: '', ca: '', ae: '' },
    image: 'lace-ribbon.jpg',
    // square texture — "cover" fills the box, cropping is fine for a repeating pattern
  },
  {
    id: 'quilting-fabric-bundles',
    name: 'Quilting Fabric Bundles for DIY Sewing',
    shortDescription:
      'Pre-coordinated fabric bundles to jump-start your next patchwork or quilting project with ready-to-go colors.',
    category: 'fabrics',
    links: { us: 'https://amzn.to/3cxHuye', de: '', es: '', uk: '', fr: '', it: '', tr: '', jp: '', ca: '', ae: '' },
    image: 'quilting-fabric-bundles.jpg',
    // square stack of fabrics — "cover" looks full and tidy
  },
];

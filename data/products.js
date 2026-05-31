/* =====================================================================
   PRODUCTS DATA  —  My Sewing Picks
   ---------------------------------------------------------------------
   This is the ONE place where all products live.
   To add a new product later, just copy an object below, change the
   fields, and append it to the PRODUCTS array. Nothing else to touch.

   Each product object has:
     id               unique slug, also used for the image filename
     name             the product title shown on the card
     shortDescription one friendly line: what it's for in sewing/quilting
     category         "tools"  or  "fabrics"  (drives which page shows it)
     links            affiliate links keyed by Amazon marketplace (see below)
     image            local image path. Convention: assets/products/<id>.jpg
                      (drop the real photo there later — see README notes)
     imageFit         OPTIONAL. "cover" (default) crops the photo to fill the
                      card's image box. "contain" shrinks the whole photo to fit
                      inside the SAME box, leaving soft padding — use it for wide
                      or oddly-shaped photos so nothing gets cropped.

   MULTI-MARKETPLACE LINKS (future-proofing):
     `links` is an object keyed by marketplace code:
       us  United States   ← the ONLY active one right now
       de  Germany
       es  Spain
       uk  United Kingdom
       fr  France
       it  Italy
       tr  Turkey
       jp  Japan
       ca  Canada
       ae  United Arab Emirates
     For now ONLY `us` is filled (the existing amzn.to links). All other
     marketplaces are empty strings "" — placeholders for later.

     The card renderer reads links[ACTIVE_MARKETPLACE] (set in js/site.js,
     currently 'us'). When you're ready to go multi-country, that's the
     seam where Amazon OneLink or per-country routing plugs in — see the
     comments in js/site.js → renderProductCard.

   IMPORTANT (Amazon Associates rules): do NOT add price, star rating,
   or review-count fields here. We intentionally don't show those.
   ===================================================================== */

const PRODUCTS = [
  /* ---------------- TOOLS ---------------- */
  {
    id: "olfa-rotary-cutter",
    name: "Olfa 45mm Rotary Cutter",
    shortDescription:
      "A sharp, comfortable rotary cutter for clean, accurate cuts through several layers of fabric at once.",
    category: "tools",
    links: { us: "https://amzn.to/4veHJ3T", de: "", es: "", uk: "", fr: "", it: "", tr: "", jp: "", ca: "", ae: "" },
    image: "assets/products/olfa-rotary-cutter.jpg",
    // This source photo is wide & short; "contain" fits it inside the card's
    // image box (with soft padding) instead of cropping it. See `imageFit` note above.
    imageFit: "contain",
  },
  {
    id: "olfa-cutting-mat",
    name: 'OLFA 24"x18" Self-Healing Rotary Cutting Mat',
    shortDescription:
      "A self-healing mat that protects your table and keeps every rotary cut crisp and precise.",
    category: "tools",
    links: { us: "https://amzn.to/3KwG2ZA", de: "", es: "", uk: "", fr: "", it: "", tr: "", jp: "", ca: "", ae: "" },
    image: "assets/products/olfa-cutting-mat.jpg",
  },
  {
    id: "free-motion-presser-foot",
    name: "Free Motion Sewing Machine Presser Foot (3 pcs, low shank)",
    shortDescription:
      "A set of low-shank darning feet for smooth free-motion quilting and thread sketching.",
    category: "tools",
    links: { us: "https://amzn.to/3R4aRY6", de: "", es: "", uk: "", fr: "", it: "", tr: "", jp: "", ca: "", ae: "" },
    image: "assets/products/free-motion-presser-foot.jpg",
  },
  {
    id: "quilting-rulers-set",
    name: "Complete Quilting Rulers Set (12.5 / 9.5 / 6.5 / 4.5 in + 6x12 + right triangle)",
    shortDescription:
      "A full set of clear acrylic rulers for measuring, squaring up, and cutting quilt blocks accurately.",
    category: "tools",
    links: { us: "https://amzn.to/3wHxIjQ", de: "", es: "", uk: "", fr: "", it: "", tr: "", jp: "", ca: "", ae: "" },
    image: "assets/products/quilting-rulers-set.jpg",
  },
  {
    id: "rowenta-travel-iron",
    name: "Rowenta DA1560 Travel Compact Steam Iron",
    shortDescription:
      "A lightweight, compact steam iron for crisp seams and pressing wherever you sew.",
    category: "tools",
    links: { us: "https://amzn.to/3RFrKIH", de: "", es: "", uk: "", fr: "", it: "", tr: "", jp: "", ca: "", ae: "" },
    image: "assets/products/rowenta-travel-iron.jpg",
  },
  {
    id: "sewline-air-erasable-pen",
    name: "Sewline Air-Erasable Fabric Pen",
    shortDescription:
      "Marks your fabric clearly, then fades away on its own — no rinsing and no residue left behind.",
    category: "tools",
    links: { us: "https://amzn.to/3B1jHQN", de: "", es: "", uk: "", fr: "", it: "", tr: "", jp: "", ca: "", ae: "" },
    image: "assets/products/sewline-air-erasable-pen.jpg",
  },

  /* ---------------- FABRICS & MATERIALS ---------------- */
  {
    id: "lace-ribbon",
    name: "Lace Ribbon for Sewing",
    shortDescription:
      "Delicate lace trim for finishing edges, embellishing bags, and adding a handmade touch to any project.",
    category: "fabrics",
    links: { us: "https://amzn.to/3RtkO1b", de: "", es: "", uk: "", fr: "", it: "", tr: "", jp: "", ca: "", ae: "" },
    image: "assets/products/lace-ribbon.jpg",
  },
  {
    id: "quilting-fabric-bundles",
    name: "Quilting Fabric Bundles for DIY Sewing",
    shortDescription:
      "Pre-coordinated fabric bundles to jump-start your next patchwork or quilting project with ready-to-go colors.",
    category: "fabrics",
    links: { us: "https://amzn.to/3cxHuye", de: "", es: "", uk: "", fr: "", it: "", tr: "", jp: "", ca: "", ae: "" },
    image: "assets/products/quilting-fabric-bundles.jpg",
  },
];

/* Make the data available to the render code in /js/site.js.
   (Plain global on purpose — no modules/build step needed.) */
window.PRODUCTS = PRODUCTS;

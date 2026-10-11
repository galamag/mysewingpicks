/* =====================================================================
   PRODUCTS DATA  —  My Sewing Picks  (Astro source of truth)
   ---------------------------------------------------------------------
   One place for all product data. Rendered STATICALLY at build time by
   src/components/ProductCard.astro (no browser JS), page by page and
   section by section (src/data/categories.js).

   Each product:
     id               unique slug
     name             short product title (brand + product + key spec)
     shortDescription one friendly line — accurate to the actual Amazon product
     category         "tools" | "fabrics" | "setup"  (which page shows it)
     group            section on that page (ids in src/data/categories.js)
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

   Order in this file = order on the page within each section.
   Amazon rules: NO price, NO rating, NO review count; names and descriptions
   must match the real product (checked against each Amazon page, 2026-10-12).
   This file is the ONLY source of product data.
   ===================================================================== */

export const products = [
  /* ================= TOOLS ================= */

  /* ---- Machines & presser feet ---- */
  {
    id: 'janome-hd2200',
    name: 'Janome HD2200 Heavy-Duty Sewing Machine',
    shortDescription:
      'A heavy-duty mechanical machine with 24 stitches, a one-step buttonhole and a built-in needle threader for everyday projects.',
    category: 'tools',
    group: 'machines',
    asin: 'B0F8CKCY3L',
  },
  {
    id: 'janome-1522rd',
    name: 'Janome 1522RD Sewing Machine, 22 Stitches',
    shortDescription:
      'A friendly mechanical machine with 22 stitches, a one-step buttonhole, an LED light and six presser feet included.',
    category: 'tools',
    group: 'machines',
    asin: 'B0FBT5HLRB',
  },
  {
    id: 'free-motion-presser-foot',
    name: 'Free Motion Presser Feet, 3 pcs (Low Shank)',
    shortDescription:
      'A set of low-shank darning feet for smooth free-motion quilting and thread sketching.',
    category: 'tools',
    group: 'machines',
    asin: 'B07CH388RL',
  },
  {
    id: 'windman-presser-feet-set',
    name: 'Windman Snap-On Presser Feet, 11 pcs (Low Shank)',
    shortDescription:
      'Eleven snap-on feet, including zipper, roller, quilting and button feet, for low-shank Brother, Singer, Janome and similar machines.',
    category: 'tools',
    group: 'machines',
    asin: 'B082N1F9R3',
  },
  {
    id: 'madam-sew-walking-foot',
    name: 'Madam Sew Open-Toe Walking Foot (Low Shank)',
    shortDescription:
      'Feeds the top and bottom layers evenly, so quilting lines and thick seams stay smooth and pucker-free.',
    category: 'tools',
    group: 'machines',
    asin: 'B08GYD6Z4V',
  },

  /* ---- Cutting & measuring ---- */
  {
    id: 'olfa-rotary-cutter',
    name: 'OLFA 45mm Deluxe Rotary Cutter',
    shortDescription:
      'A sharp, comfortable rotary cutter for clean, accurate cuts through several layers of fabric at once.',
    category: 'tools',
    group: 'cutting',
    asin: 'B000BNLLHW',
  },
  {
    id: 'olfa-ergonomic-rotary-cutter',
    name: 'OLFA 45mm Ergonomic Rotary Cutter + Spare Blade',
    shortDescription:
      'An ergonomic cutter for right or left hand that slices through up to six layers of fabric, with a spare blade included.',
    category: 'tools',
    group: 'cutting',
    asin: 'B00M6OCZZ6',
  },
  {
    id: 'olfa-cutting-mat',
    name: 'OLFA 24×18 in Self-Healing Cutting Mat',
    shortDescription:
      'A self-healing mat that protects your table and keeps every rotary cut crisp and precise.',
    category: 'tools',
    group: 'cutting',
    asin: 'B000BNLO3S',
  },
  {
    id: 'quilting-rulers-set',
    name: 'Quilting Ruler Set: Squares, 6×12 & Triangle',
    shortDescription:
      'A full set of clear acrylic rulers for measuring, squaring up, and cutting quilt blocks accurately.',
    category: 'tools',
    group: 'cutting',
    asin: 'B08W324ZXD',
  },
  {
    id: 'linxiao-square-rulers',
    name: 'LINXIAO Square Quilting Rulers, 4 pcs',
    shortDescription:
      'Four clear acrylic squares from 3.5 to 10.5 inches with 1/8-inch and 45° markings for trimming blocks.',
    category: 'tools',
    group: 'cutting',
    asin: 'B0DY78557S',
  },
  {
    id: 'tailor-scissors',
    name: '9 in Tailor Scissors + Tape Measure',
    shortDescription:
      'Heavy-duty bent-handle fabric shears with a high-carbon steel blade, plus a 60-inch tape measure.',
    category: 'tools',
    group: 'cutting',
    asin: 'B07L6MJQ6S',
  },
  {
    id: 'beaditive-thread-snips',
    name: 'Beaditive Thread Snips, 3 pcs',
    shortDescription:
      'Small spring snips that trim threads right at the seam: keep one by the machine and one in your kit.',
    category: 'tools',
    group: 'cutting',
    asin: 'B07H8QJPFV',
  },
  {
    id: 'ibayam-tape-measures',
    name: 'iBayam Tape Measures, 2-Pack (60 in)',
    shortDescription:
      'A soft tape and a retractable one, both double-sided in inches and centimeters, for bodies and fabric.',
    category: 'tools',
    group: 'cutting',
    asin: 'B07WG5B464',
  },

  /* ---- Marking & pressing ---- */
  {
    id: 'sewline-air-erasable-pen',
    name: 'Sewline Air-Erasable Fabric Pen',
    shortDescription:
      'Marks your fabric clearly, then fades away on its own — no rinsing and no residue left behind.',
    category: 'tools',
    group: 'marking-pressing',
    asin: 'B0083JM7VU',
  },
  {
    id: 'lange-konig-heat-erasable-pens',
    name: 'Lange & König Heat-Erasable Fabric Pens, 4 + Refills',
    shortDescription:
      'Fine marking pens in four colors whose lines disappear under the heat of your iron; eight refills included.',
    category: 'tools',
    group: 'marking-pressing',
    asin: 'B0F99YDJFF',
  },
  {
    id: 'rowenta-travel-iron',
    name: 'Rowenta DA1560 Travel Steam Iron',
    shortDescription:
      'A lightweight, compact steam iron for crisp seams and pressing wherever you sew.',
    category: 'tools',
    group: 'marking-pressing',
    asin: 'B001RNOQIQ',
  },
  {
    id: 'rowenta-steam-station',
    name: 'Rowenta DG8624 Perfect Pro Steam Station',
    shortDescription:
      'A steam generator iron with a separate 1.1 L water tank for strong, even steam when pressing seams and finished projects.',
    category: 'tools',
    group: 'marking-pressing',
    asin: 'B084JBZPLG',
  },
  {
    id: 'vevor-water-distiller',
    name: 'VEVOR 4L Countertop Water Distiller',
    shortDescription:
      'Makes distilled water at home, about a liter an hour, handy for filling your steam iron.',
    category: 'tools',
    group: 'marking-pressing',
    asin: 'B0G23WZK9D',
  },

  /* ---- Handy helpers ---- */
  {
    id: 'beaditive-magnetic-pin-holder',
    name: 'Beaditive Magnetic Pin Holder + 50 Pins',
    shortDescription:
      'A magnetic pin dish with a little drawer and 50 glass-head pins, so pins stay put on your sewing table.',
    category: 'tools',
    group: 'helpers',
    asin: 'B08WR7GSXB',
  },
  {
    id: 'soraco-sewing-clips',
    name: 'Soraco Sewing Clips, 100 pcs',
    shortDescription:
      'Colorful clips that hold binding, thick layers and vinyl where pins would leave holes; they come in a handy tin.',
    category: 'tools',
    group: 'helpers',
    asin: 'B01M7YAHNL',
  },
  {
    id: 'xihircd-drawstring-threaders',
    name: 'XIHIRCD Drawstring Threaders, 4 pcs',
    shortDescription:
      'Metal bodkin-style threaders that pull elastic and cord through waistbands and casings without twisting.',
    category: 'tools',
    group: 'helpers',
    asin: 'B0DKDXX4M2',
  },
  {
    id: 'kamtop-snap-pliers-kit',
    name: 'KAMTOP Snap Pliers Kit + 408 Plastic Snaps',
    shortDescription:
      'Snap pliers with 408 sets of plastic snaps in 24 colors for neat closures on bags, bibs and pouches.',
    category: 'tools',
    group: 'helpers',
    asin: 'B08YRBY72P',
  },
  {
    id: 'adjustoform-dress-form',
    name: 'Adjustoform Sew Simple FG304 Dress Form, S–M',
    shortDescription:
      'An adjustable dress form for US sizes 4–12 with a hem marker, for fitting garments and pinning details.',
    category: 'tools',
    group: 'helpers',
    asin: 'B0D8B8WYMG',
  },

  /* ================= FABRICS & MATERIALS ================= */

  /* ---- Fabrics ---- */
  {
    id: 'quilting-fabric-bundles',
    name: 'Quilting Fabric Bundles for DIY Sewing',
    shortDescription:
      'Pre-coordinated fabric bundles to jump-start your next patchwork or quilting project with ready-to-go colors.',
    category: 'fabrics',
    group: 'fabrics',
    asin: 'B08CZGXSWD',
  },
  {
    id: 'solid-cotton-squares',
    name: 'Solid Cotton Quilting Squares 12×12 in, 50 pcs',
    shortDescription:
      'Fifty 12-inch squares of 100% cotton in fifty different solid colors, ready for blocks and patchwork.',
    category: 'fabrics',
    group: 'fabrics',
    asin: 'B08GC5DMV2',
  },
  {
    id: 'ojyudd-printed-squares',
    name: 'OJYUDD Printed Cotton Squares 4×4 in, 150 pcs',
    shortDescription:
      'A big stack of 4-inch printed cotton squares in random patterns, great for scrappy patchwork and charm quilts.',
    category: 'fabrics',
    group: 'fabrics',
    asin: 'B07VHMT14L',
  },
  {
    id: 'cotton-duck-cloth',
    name: 'Printed Cotton Duck Cloth by the Yard, 54 in',
    shortDescription:
      'Sturdy 100% cotton duck cloth with a printed design, a good weight for tote bags, cushions and home decor.',
    category: 'fabrics',
    group: 'fabrics',
    asin: 'B09MR2F5S2',
  },
  {
    id: 'barcelonetta-broadcloth',
    name: 'Barcelonetta Poly-Cotton Broadcloth, 60 in (Khaki)',
    shortDescription:
      'Lightweight poly-cotton broadcloth that works well for linings, pockets and simple garments.',
    category: 'fabrics',
    group: 'fabrics',
    asin: 'B0C9GCC195',
  },
  {
    id: 'purreitti-felt-sheets',
    name: 'PURREITTI Stiff Felt Sheets 12×12 in, 80 pcs',
    shortDescription:
      'Thick 2 mm wool-blend felt in 40 colors that holds its shape for bag bases, ornaments and crafts.',
    category: 'fabrics',
    group: 'fabrics',
    asin: 'B0DNC461X9',
  },

  /* ---- Batting, stuffing & interfacing ---- */
  {
    id: 'plantional-cotton-batting',
    name: 'PLANTIONAL Natural Cotton Batting, 47×59 in',
    shortDescription:
      'Breathable 100% cotton batting that gives quilts, placemats and pot holders a soft, natural feel.',
    category: 'fabrics',
    group: 'batting-interfacing',
    asin: 'B0BWQQ5WR4',
  },
  {
    id: 'pandoroom-polyester-batting',
    name: 'PANDOROOM Polyester Batting, 48×59 in',
    shortDescription:
      'Medium-thick polyester batting that adds loft and warmth to quilted bags, cushions and quilts.',
    category: 'fabrics',
    group: 'batting-interfacing',
    asin: 'B0FFP1P57Q',
  },
  {
    id: 'fairfield-poly-fil',
    name: 'Fairfield Poly-Fil Fiberfill Stuffing, 32 oz',
    shortDescription:
      'Soft, washable polyester fiberfill for stuffing pillows, toys and padded pieces evenly.',
    category: 'fabrics',
    group: 'batting-interfacing',
    asin: 'B004ALQ0M2',
  },
  {
    id: 'jupean-medium-interfacing',
    name: 'JUPEAN Medium-Weight Fusible Interfacing, 30 yd',
    shortDescription:
      'Iron-on interfacing that adds body to bags, collars and pouches so they keep their shape.',
    category: 'fabrics',
    group: 'batting-interfacing',
    asin: 'B0DZ2KMDYD',
  },
  {
    id: 'plantional-lightweight-interfacing',
    name: 'PLANTIONAL Lightweight Fusible Interfacing, 30 yd',
    shortDescription:
      'Light non-woven iron-on interfacing that adds gentle structure without making cotton projects stiff.',
    category: 'fabrics',
    group: 'batting-interfacing',
    asin: 'B0BWN4GN6G',
  },
  {
    id: 'hbi-wash-away-stabilizer',
    name: 'HBI Wash-Away Embroidery Stabilizer, 12 in × 25 yd',
    shortDescription:
      'A water-soluble stabilizer that supports embroidery and free-standing lace, then rinses away completely.',
    category: 'fabrics',
    group: 'batting-interfacing',
    asin: 'B08HVTR7TG',
  },
  {
    id: 'brothread-wash-away-stabilizer',
    name: 'New brothread Wash-Away Stabilizer, 10 in × 3 yd',
    shortDescription:
      'A small roll of wash-away stabilizer for machine embroidery that dissolves in cold or warm water.',
    category: 'fabrics',
    group: 'batting-interfacing',
    asin: 'B078KPWJP1',
  },

  /* ---- Trims, tapes & cords ---- */
  {
    id: 'lace-ribbon',
    name: 'Lace Ribbon for Sewing',
    shortDescription:
      'Delicate lace trim for finishing edges, embellishing bags, and adding a handmade touch to any project.',
    category: 'fabrics',
    group: 'trims',
    asin: 'B08Y8G4M35',
  },
  {
    id: 'sari-silk-ribbon',
    name: 'Recycled Sari Silk Ribbon Strips, 45 Yards',
    shortDescription:
      'Frayed-edge silk ribbon strips cut from recycled saris; every bundle is a unique mix of colors for trims and textile art.',
    category: 'fabrics',
    group: 'trims',
    asin: 'B0B697SMS1',
  },
  {
    id: 'mandala-crafts-bias-tape',
    name: 'Mandala Crafts Double-Fold Bias Tape, 1/2 in (Cream)',
    shortDescription:
      'A long spool of pre-folded bias tape for binding edges, hems and curves with a tidy finish.',
    category: 'fabrics',
    group: 'trims',
    asin: 'B08B4Y3DPP',
  },
  {
    id: 'willbond-twill-tape',
    name: 'Willbond Cotton Herringbone Twill Tape, 3/8 in',
    shortDescription:
      'Natural cotton twill tape for drawstrings, ties, hanging loops and reinforcing seams in bags and aprons.',
    category: 'fabrics',
    group: 'trims',
    asin: 'B089W9NR85',
  },
  {
    id: 'windyun-webbing',
    name: 'Windyun Poly-Cotton Webbing, 1.5 in, 36 Colors',
    shortDescription:
      'Thirty-six rolls of sturdy webbing for bag handles, straps and belts in almost any color you need.',
    category: 'fabrics',
    group: 'trims',
    asin: 'B0D7VXTQ6N',
  },
  {
    id: 'knit-elastic-set',
    name: 'Knit Elastic Set, 4 Widths (White)',
    shortDescription:
      'Four rolls of white knit elastic from 0.6 to 2 inches wide, with threading clips, for waistbands and cuffs.',
    category: 'fabrics',
    group: 'trims',
    asin: 'B0FBX4GMZ9',
  },
  {
    id: 'xkdous-knit-elastic',
    name: 'XKDOUS Knit Elastic, 1/4 in × 40 yd',
    shortDescription:
      'A long roll of narrow white elastic for waistbands, sleeves and scrunchies.',
    category: 'fabrics',
    group: 'trims',
    asin: 'B0C85NH596',
  },
  {
    id: 'cridoz-satin-cord',
    name: 'Cridoz Satin Rattail Cord, 12 Rolls',
    shortDescription:
      'Silky nylon satin cord in assorted colors for drawstrings, gift pouches, braiding and decorative ties.',
    category: 'fabrics',
    group: 'trims',
    asin: 'B0CBJWTZX6',
  },
  {
    id: 'kinglake-jute-twine',
    name: 'KINGLAKE Natural Jute Twine, 2 mm × 656 ft',
    shortDescription:
      'Natural jute twine for rustic tags, drawstrings, gift wrapping and decorative accents.',
    category: 'fabrics',
    group: 'trims',
    asin: 'B00WHXQIJA',
  },

  /* ---- Zippers, buttons & thread ---- */
  {
    id: 'mandala-crafts-zippers',
    name: 'Mandala Crafts 14 in Nylon Zippers, 80 pcs',
    shortDescription:
      'Eighty closed-end nylon zippers in 20 colors for pouches, pillows and garments.',
    category: 'fabrics',
    group: 'notions',
    asin: 'B07GSJ1PGX',
  },
  {
    id: 'mebuzip-zipper-by-the-yard',
    name: 'MebuZip #5 Zipper by the Yard, 10 yd + 25 Pulls',
    shortDescription:
      'Continuous antique-brass zipper tape with separate pulls, so you can cut a zipper to any length for bags.',
    category: 'fabrics',
    group: 'notions',
    asin: 'B09657CCF3',
  },
  {
    id: 'swpeet-covered-buttons',
    name: 'Swpeet Fabric-Covered Shank Buttons, 100 pcs',
    shortDescription:
      'Satin-covered round shank buttons in ten colors for cushions, coats and decorative handmade details.',
    category: 'fabrics',
    group: 'notions',
    asin: 'B0C27VQ47N',
  },
  {
    id: 'hagbou-thread-set',
    name: 'HAGBOU Sewing Thread Set, 36 Colors + Bobbins',
    shortDescription:
      'Thirty-six spools of polyester thread, each with a matching bobbin, so the right color is always at hand.',
    category: 'fabrics',
    group: 'notions',
    asin: 'B0D4LK21SX',
  },
  {
    id: 'dritz-invisible-thread',
    name: 'Dritz Invisible Thread, Clear, 150 yd',
    shortDescription:
      'Clear thread that blends into any fabric, handy for quilting, appliqué and discreet finishing stitches.',
    category: 'fabrics',
    group: 'notions',
    asin: 'B005574FAO',
  },

  /* ================= MY FILMING SETUP ================= */
  {
    id: 'sensyne-ring-light',
    name: 'SENSYNE 10 in Ring Light with 50 in Tripod',
    shortDescription:
      'A USB-powered ring light on an extendable phone stand with three color modes and a remote for even lighting.',
    category: 'setup',
    group: 'setup',
    asin: 'B08B3X7NXC',
  },
  {
    id: 'skytex-softbox-kit',
    name: 'Skytex Softbox Lighting Kit, 2 Lights',
    shortDescription:
      'Two 20×28 in softboxes with dimmable LED bulbs and stands that soften shadows when you film or photograph.',
    category: 'setup',
    group: 'setup',
    asin: 'B096THSHLP',
  },
  {
    id: 'liphisy-tripod',
    name: 'Liphisy 64 in Phone & Camera Tripod',
    shortDescription:
      'A tall aluminum tripod with a phone holder, ball head and remote for steady shots from any angle.',
    category: 'setup',
    group: 'setup',
    asin: 'B0CMM89Y6Z',
  },
  {
    id: 'iphone-15-pro-max-renewed',
    name: 'Apple iPhone 15 Pro Max 512GB (Renewed)',
    shortDescription:
      'A renewed iPhone 15 Pro Max with a 6.7-inch display and a camera that captures close-up sewing details.',
    category: 'setup',
    group: 'setup',
    asin: 'B0CMZH1SGK',
  },
  {
    id: 'macbook-pro-m5',
    name: 'Apple MacBook Pro 14 in, M5, 16GB / 1TB',
    shortDescription:
      'A 14-inch laptop with the M5 chip for editing videos, organizing photos and running a small creative business.',
    category: 'setup',
    group: 'setup',
    asin: 'B0FWD623D1',
  },
  {
    id: 'ergear-standing-desk',
    name: 'ErGear Electric Standing Desk, 48×24 in',
    shortDescription:
      'An electric sit-stand desk with four height presets, so you can cut, sew or edit at a comfortable height.',
    category: 'setup',
    group: 'setup',
    asin: 'B0B423MVSC',
  },
];

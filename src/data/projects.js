/*
  Sewing projects — one entry per page in src/pages/[...lang]/projects/ (+ the list on
  /projects.html). Each project links to the maker's video and lists the
  catalog products it needs (ids from src/data/products.js; a wrong id fails
  the build). The animated "anatomy" figure and the steps live in
  src/lib/anatomy/<model>.js.
  Texts here are English; other languages: src/i18n/<lang>/projects.js (same fields).
*/
export const projects = [
  {
    slug: 'tote-bag',
    title: 'The 10-minute tote bag',
    blurb: 'A lined tote with long straps: one piece of cotton duck, one of satin, two straps. Watch it come together step by step.',
    // Page texts (English; translations in src/i18n/<lang>/projects.js). pageTitle, pageDescription
    // and heading (the page's h1) use the words people search with in each language (Vault: «Шопер —
    // страница под поисковые запросы (спецификация)»); no "animated" / "3D" in the title or h1;
    // pageTitle ≤ ~60 characters, no "— My Sewing Picks" (Google shows the site name by itself).
    pageTitle: 'How to Sew a Lined Tote Bag: Cutting Sizes, Boxed Corners',
    pageDescription: 'Cutting sizes for a lined tote: outer and lining 86 × 45 cm, straps 100 × 16 cm, 0.5 cm seams, a boxed bottom with no corner seams. Every step animated.',
    heading: 'How to sew a lined tote bag with boxed corners',
    teaser: 'One piece of cotton duck, one of satin, two long straps — every fold and seam, animated.',
    videoTitle: 'Sew in 10 minutes — a lined tote bag',
    videoIntro: 'The whole bag, sewn start to finish on the channel.',
    needsIntro: 'Cotton duck for the outer and straps, satin for the lining, thread — and the tools I personally recommend for cutting, pressing and sewing it.',
    // Questions people search with ("People also ask"), answered ONLY with the maker's numbers that
    // the page already shows. Never the finished bag's size (Galamat's rule). The cutting diagram
    // sits under the first answer. Every language has the same number of questions (content.js).
    faq: [
      {
        q: 'How much fabric do I need for a tote bag?',
        a: 'For this tote you cut four pieces: an 86 × 45 cm (33⅞ × 17¾ in) rectangle of cotton duck for the outer, a satin one the same size for the lining, and two duck strips 100 × 16 cm (39⅜ × 6¼ in) for the straps. The cutting diagram below shows them all.',
      },
      {
        q: 'How do you make the bottom and boxed corners of a tote bag?',
        a: 'This tote needs no separate corner seams. Crease the outer across the middle, fold 6 cm (2⅜ in) to each side of the crease and stitch close to each fold. Tuck the bottom in so the crease goes 6 cm inside, then sew the side seams through all the layers. Turn it out: the bottom opens into a 12 cm (4¾ in) base and the corners form by themselves. The lining is made the same way.',
      },
      {
        q: 'Does a tote bag need a lining?',
        a: 'Not every tote has one, but this one does: satin, cut the same size as the outer, 86 × 45 cm, and sewn the same way, with an 8 cm (3⅛ in) opening left in one side seam. It covers the seams inside the bag. There is no interfacing.',
      },
      {
        q: 'What seam allowance should I use for a tote bag?',
        a: 'Every seam in this tote is 0.5 cm (³⁄₁₆ in): the side seams of the outer and the lining and the seam around the top. The topstitching around the top goes 1 cm (⅜ in) from the edge.',
      },
      {
        q: 'Where do you leave the opening to turn a lined bag?',
        a: 'In one side seam of the lining, low down just above the tucked-in bottom: leave 8 cm (3⅛ in) unsewn. Turn the whole bag right side out through it, then tuck in the raw edges and stitch the opening closed, close to the edge.',
      },
      {
        q: 'How long should tote bag straps be?',
        a: 'For this tote, cut two strips 100 × 16 cm (39⅜ × 6¼ in). Fold each into four layers — in half, open, both edges to the crease, in half again — for a 4 cm (1⅝ in) strap, and topstitch both edges. Pin the ends level with the top edge, 6 cm (2⅜ in) from the centre.',
      },
    ],
    icon: '👜',
    video: 'Fs1QfrJIfwE',
    // "What you'll need" — fabric first, then tools in the order they are used.
    needs: [
      'cotton-duck-cloth',
      'hagbou-thread-set',
      'olfa-rotary-cutter',
      'olfa-cutting-mat',
      'quilting-rulers-set',
      'sewline-air-erasable-pen',
      'rowenta-travel-iron',
      'soraco-sewing-clips',
      'janome-hd2200',
    ],
  },
  {
    // The maker's numbers: Vault «Анатомия изделий — Корзинка». The video's on-screen "50 × 50 cm" is a
    // mistake — the squares are 60 × 60 (said on the page, under the video). Never the finished size.
    slug: 'fabric-basket',
    title: 'A fabric basket for Christmas',
    blurb: 'A lined fabric basket from two squares of cotton: walls stiffened with interfacing, lace and bows glued on. Watch it come together step by step.',
    pageTitle: 'How to Sew a Fabric Basket with Lining: Cutting Sizes',
    pageDescription: 'Cutting sizes for a lined fabric basket: 60 × 60 cm squares, 20 cm corners cut away, five 19 cm squares of interfacing, 0.5 cm seams. Every step animated.',
    heading: 'How to sew a lined fabric basket',
    teaser: 'Two squares of cotton, a little interfacing, lace and bows — every fold and seam, animated.',
    videoTitle: 'A fabric basket for the Christmas table',
    videoIntro: 'The whole basket, sewn start to finish on the channel. One correction: the caption in the video says 50 × 50 cm by mistake — the squares are 60 × 60 cm.',
    needsIntro: 'Cotton for the outer and the lining, lace for the trim, thread — and the tools I personally recommend for cutting, pressing and sewing it. You will also need heavy fusible interfacing and a hot glue gun.',
    faq: [
      {
        q: 'How much fabric do I need for a fabric basket?',
        a: 'For this basket you need two 60 × 60 cm (23⅝ in) squares of cotton — one for the outer, one for the lining — and five 19 × 19 cm (7½ in) squares of heavy fusible interfacing. From every corner of both cotton squares cut away a 20 × 20 cm (7⅞ in) square. The cutting diagram below shows it all.',
      },
      {
        q: 'How do you make a fabric basket stand up?',
        a: 'With heavy fusible interfacing on the outer: five 19 × 19 cm (7½ in) squares, one in the middle of the base and of each wall, 0.5 cm (³⁄₁₆ in) in from the edges, ironed onto the wrong side. The lining gets no interfacing.',
      },
      {
        q: 'How do you sew the corners of a fabric basket?',
        a: 'Fold up the walls of the cross so the edges of two neighbouring walls meet, right sides together. Pin them and sew 0.5 cm (³⁄₁₆ in) from the edge, from the top right down to the point at the base. Four corner seams make the box — first on the outer, then on the lining.',
      },
      {
        q: 'Where do you leave the opening to turn a lined basket?',
        a: 'In one corner seam of the lining: leave 15 cm (5⅞ in) unsewn. It is this big because the interfaced walls are stiff. Turn the basket right side out through it, then stitch the opening closed on the machine.',
      },
      {
        q: 'What seam allowance should I use for a fabric basket?',
        a: 'Every seam in this basket is 0.5 cm (³⁄₁₆ in): the four corner seams of the outer and of the lining and the seam round the top. The topstitching round the top is 0.5 cm from the edge too.',
      },
      {
        q: 'How do you decorate a fabric basket for Christmas?',
        a: 'The trim is glued on with a hot glue gun, not sewn: a ribbon all round the top, with the joint on a flat side rather than on a corner, and a bow on every corner. In the video it is lace and white bows with a red half-bead in the middle. Any ribbon works — a black one, or an orange one with pumpkins for Halloween — or no trim at all.',
      },
    ],
    icon: '🧺',
    video: '7kt1rZdiFCM',
    // "What you'll need" — fabric and trim first, then tools in the order they are used. Not in the
    // catalog yet (mentioned in needsIntro, no link): heavy fusible interfacing, a hot glue gun.
    needs: [
      'barcelonetta-broadcloth',
      'lace-ribbon',
      'hagbou-thread-set',
      'olfa-rotary-cutter',
      'olfa-cutting-mat',
      'quilting-rulers-set',
      'tailor-scissors',
      'sewline-air-erasable-pen',
      'rowenta-travel-iron',
      'beaditive-magnetic-pin-holder',
      'janome-1522rd',
    ],
  },
  {
    // The maker's numbers: Vault «Анатомия изделий — Косметичка с круглыми уголками». The zipper is
    // named in needsIntro, without a link (no 20 cm zipper in the catalog). Never the finished size,
    // never a reason for the 3.5 × 2.5 cm corner.
    slug: 'cosmetic-bag',
    title: 'A makeup bag with round corners',
    blurb: 'A lined zipper bag from one rectangle of printed cotton, with a pink round corner at each end of the bottom. Watch it come together step by step.',
    pageTitle: 'How to Sew a Lined Zipper Makeup Bag: Cutting Sizes',
    pageDescription: 'Cutting sizes for a lined zipper makeup bag: outer and lining 23 × 31 cm, four pink pieces 18 × 10 cm, a 20 cm zipper, 0.5 cm seams. Every step animated.',
    heading: 'How to sew a lined makeup bag with a zipper',
    teaser: 'One rectangle of cotton, a zipper and two pink half-moons that turn into round corners — every seam, animated.',
    videoTitle: 'A zipper makeup bag with round corners',
    videoIntro: 'The whole bag, sewn start to finish on the channel.',
    needsIntro: 'Printed cotton for the outer and the lining, pink cotton for the corners, thin fusible interfacing, thread — and the tools I personally recommend for cutting, pressing and sewing it. You will also need a 20 cm (7⅞ in) zipper.',
    faq: [
      {
        q: 'How much fabric do I need for a makeup bag?',
        a: 'For this bag you need a 23 × 31 cm (9 × 12¼ in) piece of printed cotton for the outer and one the same size for the lining, four 18 × 10 cm (7⅛ × 3⅞ in) pieces of pink cotton for the round corners, thin fusible interfacing — 21 × 29 cm (8¼ × 11⅜ in) and a 16 × 16 cm (6¼ in) square — and a 20 cm (7⅞ in) zipper. The cutting diagram below shows it all.',
      },
      {
        q: 'How do you sew a zipper into a lined pouch?',
        a: 'Lay the outer right side up, put the zipper face down along one short 23 cm (9 in) side, in the middle, and the lining face down on top. Sew through all the layers 0.5 cm (³⁄₁₆ in) from the edge. Then fold the outer and the lining in half so their other short sides meet the other side of the zipper, and sew it the same way. There is no topstitching along the zipper.',
      },
      {
        q: 'How do you make the corners of a makeup bag?',
        a: 'After the side seams, cut a 3.5 × 2.5 cm (1⅜ × 1 in) piece from each bottom corner — two on the outer, two on the lining: 3.5 cm along the bottom, 2.5 cm along the side seam. Open each corner so the side seam meets the bottom fold and sew straight across, 0.5 cm (³⁄₁₆ in) from the edge.',
      },
      {
        q: 'How do you make the round corners?',
        a: 'Cut a circle of radius 8 cm (3⅛ in) from a 16 × 16 cm (6¼ in) square of interfacing, using a paper template, and cut it in half. Iron each half-circle onto a pink 18 × 10 cm (7⅛ × 3⅞ in) piece, its straight side 1 cm (⅜ in) from the long edge, sew it to a second pink piece along the curve, trim, notch and turn. Stitch the half-moons onto the side edges of the outer, their middle on the bottom line: once the corners are sewn, they turn into round pink corners.',
      },
      {
        q: 'Does a makeup bag need interfacing?',
        a: 'This one has thin fusible interfacing on the outer only: a 21 × 29 cm (8¼ × 11⅜ in) piece ironed onto the wrong side, 1 cm (⅜ in) from every edge. The lining has none.',
      },
      {
        q: 'Where do you leave the opening to turn it?',
        a: 'In the middle of one side seam of the lining: leave 6 cm (2⅜ in) unsewn, and open the zipper before you sew the side seams. Turn the bag right side out through the opening and the zipper, then close the opening by hand.',
      },
    ],
    icon: '👛',
    video: 'aYIwFMz5RO4',
    // "What you'll need" — fabric first, then tools in the order they are used. The 20 cm zipper:
    // in needsIntro, no link (decision 11.2 of the spec).
    needs: [
      'quilting-fabric-bundles',
      'solid-cotton-squares',
      'plantional-lightweight-interfacing',
      'hagbou-thread-set',
      'olfa-rotary-cutter',
      'olfa-cutting-mat',
      'quilting-rulers-set',
      'tailor-scissors',
      'sewline-air-erasable-pen',
      'rowenta-travel-iron',
      'soraco-sewing-clips',
      'janome-1522rd',
    ],
  },
  {
    // The maker's numbers: Vault «Анатомия изделий — Мини-сумочка для телефона». The video is on her
    // channel Cozy Scraps. The printed cotton for the outer and the chain are named in needsIntro,
    // without a link (Galamat, 2026-10-23); there is no chain in the video. Never the finished size.
    slug: 'phone-pouch',
    title: 'A phone pouch with a flap',
    blurb: 'A small lined pouch for a phone, money and cards: one T of two pieces folds into three pockets, a flap with a snap and two little ears. Watch it come together step by step.',
    pageTitle: 'How to Sew a Lined Phone Pouch with Flap: Cutting Sizes',
    pageDescription: 'Cutting sizes for a phone pouch with a flap: outer and lining 57 × 19 cm and 31 × 13 cm, two 5 × 5 cm squares for the ears, 0.5 cm seams. Every step animated.',
    heading: 'How to sew a small phone bag with a flap and inner pockets',
    teaser: 'Two pieces sewn into a T, two lines of stitching — and they fold into three pockets: every fold, animated.',
    videoTitle: 'A phone pouch with three pockets',
    videoIntro: 'The whole pouch, sewn start to finish on my channel Cozy Scraps.',
    needsIntro: 'Printed cotton for the outer, cotton for the lining, light fusible interfacing, thread, a plastic snap — and the tools I personally recommend for cutting, pressing and sewing it. For carrying it, any chain or strap with clasps fits the ears; there is none in the video.',
    faq: [
      {
        q: 'What size should I cut the fabric for a phone pouch?',
        a: 'For this pouch you cut two pieces of printed cotton — a long piece 57 × 19 cm (22½ × 7½ in) and a flap piece 31 × 13 cm (12¼ × 5⅛ in) — the same two of lining, the same two of fusible interfacing for the outer, and two 5 × 5 cm (2 in) squares for the ears. Every seam is 0.5 cm (³⁄₁₆ in). The cutting diagram below shows it all.',
      },
      {
        q: 'Do I need interfacing for a phone pouch?',
        a: 'This one has light fusible interfacing on the two outer pieces only, cut the same sizes — 57 × 19 cm and 31 × 13 cm — and ironed onto the wrong side. The lining has none.',
      },
      {
        q: 'How do you make the pockets inside?',
        a: 'Fold the topstitched T in half across the long piece, lining inside, and sew two lines through both halves, 11 cm (4⅜ in) and 22 cm (8⅝ in) from the fold. Open it out: the seams go to the middle and the long piece folds like an accordion into three pockets — the phone next to the back, money in the middle, cards at the front. The flap piece goes round the bottom, so its fold closes every pocket.',
      },
      {
        q: 'Where do you leave the opening to turn it?',
        a: "In the middle of the long piece's long edge, opposite the flap piece: leave 6 cm (2⅜ in) unsewn when you sew the two Ts together. Turn it right side out through the opening; the topstitching 0.5 cm (³⁄₁₆ in) from the edge all round closes it.",
      },
      {
        q: 'How do you put a plastic snap on the flap?',
        a: "Set one half in the middle of the flap's round end, on the line of topstitching. Fold the flap down, mark where the snap lands on the front and set the other half there.",
      },
      {
        q: 'How do you make loops for a strap or chain?',
        a: 'From two 5 × 5 cm (2 in) squares: fold each like a tote strap — in half, both edges to the fold, in half again — and then in half into a loop. Slip them into the sides near the top, between the back and the pockets, and stitch the sides right on the edge. There is no strap in the video; a chain or a strap with clasps fits the ears.',
      },
    ],
    icon: '📱',
    video: 'H4oTNTlq6bg',
    // "What you'll need" — fabric first, then tools in the order they are used. The printed outer
    // cotton and a chain: in needsIntro, no link (decision 11.3–11.4 of the spec).
    needs: [
      'barcelonetta-broadcloth',
      'plantional-lightweight-interfacing',
      'hagbou-thread-set',
      'olfa-rotary-cutter',
      'olfa-cutting-mat',
      'quilting-rulers-set',
      'ibayam-tape-measures',
      'tailor-scissors',
      'sewline-air-erasable-pen',
      'rowenta-travel-iron',
      'soraco-sewing-clips',
      'kamtop-snap-pliers-kit',
      'janome-1522rd',
    ],
  },
];

export const projectBySlug = (slug) => {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`projects.js: no project "${slug}"`);
  return p;
};

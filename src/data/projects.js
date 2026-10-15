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
];

export const projectBySlug = (slug) => {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`projects.js: no project "${slug}"`);
  return p;
};

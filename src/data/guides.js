/*
  Sewing guides — one technique per page (src/pages/[...lang]/guides/[slug].astro) + the list on
  /guides.html, in groups (GUIDE_GROUPS, in this order; a group with no guide is not shown).
  A guide is a technique, not a make: its animated figure (src/lib/anatomy/<figure>.js, registered in
  figures.js and models.js) shows it step by step with the maker's numbers from the projects.
  Texts here are English; other languages: src/i18n/<lang>/guides.js (same fields, GUIDE_FIELDS in
  src/i18n/content.js — a missing or extra one fails the build). Spec: Vault «Гайды — спецификация».
  Plain data, no imports: src/i18n/index.js builds PAGES from this list.

  Fields: slug (English, the address /guides/<slug>.html in every language), group, figure (slug in
  figures.js), icon (the card), page texts — pageTitle / pageDescription / heading (the h1) use the words
  people search with in each language; title — the card in lists; blurb — under the h1 and on the card;
  teaser — the home page; needsIntro — "What you'll need" (I personally recommend, never "I use").
  needs — catalog product ids (src/data/products.js); usedIn — the projects and the steps of their
  figures where the technique is used; video (optional) — the project's own video from `start` seconds.
  Numbers: only the maker's (spec 3.2) — never a finished size.
*/
export const GUIDE_GROUPS = ['machine', 'cutting', 'construction', 'patchwork'];

export const guides = [
  {
    // The maker's numbers from the tote and the basket (spec 6): 8 / 15 cm openings, 0.5 cm top seam,
    // 1 / 0.5 cm topstitch, straps 6 cm from the centre. The ladder stitch: spec 6, "Источники".
    slug: 'line-a-bag',
    group: 'construction',
    figure: 'line-a-bag',
    icon: '🪡',
    title: 'Lining a bag: sew, turn, topstitch',
    blurb: 'How a lining goes in: one seam round the top, then the whole bag turns out through an opening in the lining. Shown on the tote and on the fabric basket, with two ways to close the opening.',
    pageTitle: 'How to Line a Tote Bag: Turning Gap and Topstitching',
    pageDescription: 'How to line a bag: sew the lining with an 8 cm turning gap, join it to the outer with a 0.5 cm seam, turn it through the gap, close the gap and topstitch. Every step animated.',
    heading: 'How to line a tote bag and turn it through the gap',
    teaser: 'Sew the lining, turn the bag through the gap, close it and topstitch — every step animated.',
    needsIntro: 'Thread, sewing clips, thread snips, an iron and the sewing machine — the tools I personally recommend for these steps. To close the opening by hand you will also need a hand-sewing needle.',
    // "What you'll need" — only what these steps use, in the order they are used.
    needs: ['hagbou-thread-set', 'soraco-sewing-clips', 'beaditive-thread-snips', 'rowenta-travel-iron', 'janome-hd2200'],
    // Tote: 7 Sew the lining · 8 Join outer and lining · 9 Turn and topstitch.
    // Basket: 4 Sew the lining · 5 Join outer and lining · 6 Turn it out · 7 Topstitch the top.
    usedIn: [
      { project: 'tote-bag', steps: [7, 8, 9] },
      { project: 'fabric-basket', steps: [4, 5, 6, 7] },
    ],
    // Where the maker puts the outer into the lining (Galamat, 2026-10-18): tote 6:00, basket 5:55.
    video: [
      { project: 'tote-bag', start: 360 },
      { project: 'fabric-basket', start: 355 },
    ],
  },
];

for (const g of guides) {
  if (!GUIDE_GROUPS.includes(g.group)) throw new Error(`guides.js: "${g.slug}" has an unknown group "${g.group}" (${GUIDE_GROUPS.join(', ')})`);
}
if (new Set(guides.map((g) => g.slug)).size !== guides.length) throw new Error('guides.js: two guides share a slug');

/** The groups that have at least one guide, in GUIDE_GROUPS order — the list page shows only these. */
export const liveGroups = (list = guides) => GUIDE_GROUPS.filter((id) => list.some((g) => g.group === id));

export const guideBySlug = (slug) => {
  const g = guides.find((x) => x.slug === slug);
  if (!g) throw new Error(`guides.js: no guide "${slug}"`);
  return g;
};

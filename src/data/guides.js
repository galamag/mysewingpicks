/*
  Sewing guides — one technique per page (src/pages/[...lang]/guides/[slug].astro) + the list on
  /guides.html, in groups (GUIDE_GROUPS, in this order; a group with no guide is not shown).
  A guide is a technique, not a make: its animated figure (src/lib/anatomy/<figure>.js, registered in
  figures.js and models.js) shows it step by step with the maker's numbers from the projects.
  A guide may instead hold several `sections` (one figure each, with its own usedIn): then it has no
  figure / usedIn of its own. Section: { id (the #anchor, [a-z-]+, same in every language), figure,
  usedIn, title, line, choose } - texts English here, translated in src/i18n/<lang>/guides.js under
  [slug].sections[id] (SECTION_FIELDS in content.js).
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
    // Where the lining work starts in the maker's video (Galamat): tote 4:40 — she sews the lining
    // (2026-10-19; at 6:00 it is already turned out). Only the tote: the figure shows a bag's lining,
    // and the cube-shaped basket is lined differently (Galamat, 2026-10-19).
    video: [
      { project: 'tote-bag', start: 280 },
    ],
  },
];

/** Checks a guide list (run on `guides` at load; takes a list so tests can feed it a stub). */
export function validateGuides(list) {
  for (const g of list) {
    if (!GUIDE_GROUPS.includes(g.group)) throw new Error(`guides.js: "${g.slug}" has an unknown group "${g.group}" (${GUIDE_GROUPS.join(', ')})`);
    const own = g.figure !== undefined || g.usedIn !== undefined;
    if (g.sections !== undefined) {
      if (own) throw new Error(`guides.js: "${g.slug}" has both sections and its own figure / usedIn - either one or the other`);
      if (!Array.isArray(g.sections) || !g.sections.length) throw new Error(`guides.js: "${g.slug}".sections must be a non-empty list`);
      const seen = new Set();
      for (const s of g.sections) {
        if (typeof s.id !== 'string' || !/^[a-z]+(?:-[a-z]+)*$/.test(s.id)) throw new Error(`guides.js: "${g.slug}" has a section id "${s.id}" that is not [a-z-]+`);
        if (seen.has(s.id)) throw new Error(`guides.js: "${g.slug}" has the section id "${s.id}" twice`);
        seen.add(s.id);
        if (typeof s.figure !== 'string' || !s.figure) throw new Error(`guides.js: "${g.slug}" section "${s.id}" needs a figure (a slug in figures.js)`);
        if (!Array.isArray(s.usedIn)) throw new Error(`guides.js: "${g.slug}" section "${s.id}" needs a usedIn list`);
      }
    } else if (!g.figure || !g.usedIn) {
      throw new Error(`guides.js: "${g.slug}" needs either figure + usedIn or sections`);
    }
  }
  if (new Set(list.map((g) => g.slug)).size !== list.length) throw new Error('guides.js: two guides share a slug');
}
validateGuides(guides);

/**
 * The sections of a guide: its `sections`, or, for a guide without them, one section with no id that
 * carries the guide's own figure and usedIn (so callers treat both kinds the same).
 */
export const guideSections = (guide) => guide.sections ?? [{ id: null, figure: guide.figure, usedIn: guide.usedIn }];

/** The groups that have at least one guide, in GUIDE_GROUPS order — the list page shows only these. */
export const liveGroups = (list = guides) => GUIDE_GROUPS.filter((id) => list.some((g) => g.group === id));

/**
 * Where a project's figure links to from step `step` ("How it's done ->" under the step): a { guide, section }
 * pair for every guide section whose `usedIn` has this figure with that step (section.id is the #anchor, or
 * null for a guide without sections). A project's figure has the project's slug (tote-bag, fabric-basket).
 * A guide's own figure is no project, so it gets no links (no self-links).
 */
export const guidesForStep = (figureSlug, step, list = guides) =>
  list.flatMap((guide) => guideSections(guide)
    .filter((section) => section.usedIn.some((u) => u.project === figureSlug && u.steps.includes(step)))
    .map((section) => ({ guide, section })));

export const guideBySlug = (slug) => {
  const g = guides.find((x) => x.slug === slug);
  if (!g) throw new Error(`guides.js: no guide "${slug}"`);
  return g;
};

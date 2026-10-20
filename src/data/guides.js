/*
  Sewing guides — one technique per page (src/pages/[...lang]/guides/[slug].astro) + the list on
  /guides.html, in groups (GUIDE_GROUPS, in this order; a group with no guide is not shown).
  A guide is a technique, not a make: its animated figure (src/lib/anatomy/<figure>.js, registered in
  figures.js and models.js) shows it step by step with the maker's numbers from the projects.
  A guide may instead hold several `sections` (one figure each, with its own usedIn): then it has no
  figure / usedIn of its own. Section: { id (the #anchor, [a-z-]+, same in every language), figure,
  usedIn, title, line, choose, note? } - texts English here, translated in src/i18n/<lang>/guides.js under
  [slug].sections[id] (SECTION_FIELDS + the optional SECTION_OPTIONAL in content.js). `choose` ("When to
  choose it") has no numbers; `note` (optional) is a plain paragraph by "Where it's used" and may have them.
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
  {
    // One page, one section per kind of bottom (Vault «Гайды — Дно сумки (спецификация)»), in this order:
    // folded (the maker's, the tote), cut-out (the maker's, the makeup bag), boxed (public, no numbers), panel (public, no numbers).
    // Section numbers: only the maker's (spec 3); `folded` - the tote's 6, 12, 0.5 cm; `cut-out` - the makeup bag's
    // 23 x 31, 0.5, 3.5 x 2.5 cm and the basket's 60, 20 cm; `boxed` and `panel` - none at all. Title, h1 and page title: spec 5.1 as approved.
    // No video (spec 6): "Where it's used" links to the projects instead.
    slug: 'bag-bottom',
    group: 'construction',
    icon: '👜',
    title: 'Bag bottoms: boxed corners and more',
    blurb: "How to give a bag a bottom it can stand on, four ways: the tote's folded-in bottom (two folds stitched 6 cm from the centre, so the corners form by themselves), cut-out corners, boxed corners and a separate bottom panel. Each one is animated, with advice on when to choose it.",
    pageTitle: 'How to Sew a Bag Bottom: Boxed Corners and 3 More Ways',
    pageDescription: 'How to sew a bag bottom four ways: folded-in (folds stitched 6 cm from the centre, a 12 cm base), cut-out corners, boxed corners and a separate bottom panel. Every step animated.',
    heading: 'How to sew a bag bottom: boxed corners and 3 more ways',
    teaser: 'Four ways to give a bag a flat bottom — folded in, cut-out corners, boxed corners, a separate panel — every step animated.',
    needsIntro: 'An iron, a quilting ruler, an air-erasable pen, thread, sewing clips, the sewing machine and fabric scissors — the tools I personally recommend for these steps.',
    // "What you'll need" - only what the sections' steps use, in the order they are used.
    needs: ['rowenta-travel-iron', 'quilting-rulers-set', 'sewline-air-erasable-pen', 'hagbou-thread-set', 'soraco-sewing-clips', 'janome-hd2200', 'tailor-scissors'],
    sections: [
      {
        // Tote: 3 Shape the bottom · 4 Tuck the bottom in · 5 Sew the sides · 6 Turn it out · 7 Sew the lining
        // (its bottom is made the same way; step 7 links to the lining guide too).
        id: 'folded',
        figure: 'bag-bottom-folded',
        usedIn: [{ project: 'tote-bag', steps: [3, 4, 5, 6, 7] }],
        title: 'Folded-in bottom',
        line: 'Two stitched folds, tucked in before the side seams: the corners form by themselves.',
        choose: 'When the bag is cut in one piece, folded across the middle, and you want a flat bottom with no corner seams: the corners form by themselves when the bag is turned out.',
      },
      {
        // The makeup bag: 10 Box the corners (a 23 x 31 cm piece folded in half, 0.5 cm seams, 3.5 x 2.5 cm cut from each
        // bottom corner). The basket: 1 Cut the pieces (a 60 x 60 cm square, 20 x 20 cm cut from each corner) and
        // 3 Sew the outer (the corner seams) - one sentence in `note`; its link is "Where it's used". Never the sources'
        // formula, never why 3.5 x 2.5 (spec 3). "When to choose it": the sources' general advice (spec 5.2), no numbers.
        id: 'cut-out',
        figure: 'bag-bottom-cut-out',
        usedIn: [{ project: 'cosmetic-bag', steps: [10] }, { project: 'fabric-basket', steps: [1, 3] }],
        title: 'Cut-out corners',
        line: 'A small piece cut from each bottom corner, then the corner opened and sewn straight across.',
        choose: 'When the bag is folded at the bottom, its sides are sewn first and you want a flat bottom: with the corners cut out, the seams meet neatly, and it suits thicker fabrics too.',
        note: 'On the fabric basket the corners are cut out right at cutting time: a 60 × 60 cm square with a 20 × 20 cm square cut from each corner.',
      },
      {
        // A public technique, no maker's project yet (usedIn: [] - no "Where it's used"): the sources of spec 5.2
        // agree on the method; NO numbers (spec 3), the relations in words - the line across is as long as the base
        // is wide, marked half the base width from the end of the seam; the tip trimmed leaving a small allowance.
        // "When to choose it": the sources' advice (Sew4Home, spec 5.2), no numbers.
        id: 'boxed',
        figure: 'bag-bottom-boxed',
        usedIn: [],
        title: 'Boxed corners (pinched)',
        line: 'The bag is sewn first, then each bottom corner is flattened into a triangle and sewn straight across.',
        choose: 'When you want to try the depth first: nothing is cut beforehand, so you can still sew a deeper bottom. The corner is strong, and it suits light fabrics.',
      },
      {
        // A public technique, no maker's project yet (usedIn: [] - no "Where it's used"): the sources of spec 5.2
        // agree on the method (a rectangular base drawn); NO numbers (spec 3: the sources give none). "When to
        // choose it": the sources' list (spec 5.2) - a flat stable base, another fabric, a firm base, round or oval.
        id: 'panel',
        figure: 'bag-bottom-panel',
        usedIn: [],
        title: 'Separate bottom panel',
        line: 'The base is a piece of its own, sewn into the bottom of the walls all round.',
        choose: "When you want a flat, stable base, a base in another fabric, or a firm one with interfacing or an insert. Round and oval bases are sewn in too, with the walls' allowance snipped into all along the curve.",
      },
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
    // every usedIn entry names at least one step: an empty list would link nothing and list "steps " on the page
    for (const s of guideSections(g)) {
      for (const u of s.usedIn) {
        if (!Array.isArray(u.steps) || !u.steps.length) throw new Error(`guides.js: "${g.slug}"${s.id ? ` section "${s.id}"` : ''} usedIn "${u.project}" needs a non-empty steps list`);
      }
    }
  }
  if (new Set(list.map((g) => g.slug)).size !== list.length) throw new Error('guides.js: two guides share a slug');
}
validateGuides(guides);

/**
 * The sections of a guide: its `sections`, or, for a guide without them, one section with no id that
 * carries the guide's own figure and usedIn (so callers treat both kinds the same).
 */
export function guideSections(guide) {
  return guide.sections ?? [{ id: null, figure: guide.figure, usedIn: guide.usedIn }];
}

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

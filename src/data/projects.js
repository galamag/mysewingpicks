/*
  Sewing projects — one entry per page in src/pages/projects/ (+ the list on
  /projects.html). Each project links to the maker's video and lists the
  catalog products it needs (ids from src/data/products.js; a wrong id fails
  the build). The animated "anatomy" figure and the steps live in
  src/lib/anatomy/<model>.js.
*/
export const projects = [
  {
    slug: 'tote-bag',
    title: 'The 10-minute tote bag',
    blurb: 'A lined tote with long straps: one piece of cotton duck, one of satin, two straps. Watch it come together step by step.',
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

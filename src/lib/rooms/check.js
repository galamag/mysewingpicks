/*
  Does a room model agree with the catalogue? Run at build time: a part that
  points at a product, section or project that does not exist must fail the
  build, not turn into a dead tap area on the live site.

  A part's `target` is exactly one of { product }, { section }, { project }.
  A section that exists but has no products yet (an empty group) is not an
  error: its part is returned in `inactive` and the room draws it as plain
  decoration until a product appears.
*/

const KINDS = ['product', 'section', 'project'];

/**
  model    a room model (render.js)
  catalog  productIds   Map<product id, its category>
           category     the category this room belongs to ('setup', 'tools'…)
           allSections  ids of every section of the category
           liveSections ids of the sections that have at least one product
           projectSlugs slugs of the projects
  → { inactive: Set<part id> }
*/
export function checkTargets(model, { productIds, category, allSections, liveSections, projectSlugs }) {
  const fail = (text) => { throw new Error(`rooms/${model.key}: ${text}`); };
  const inactive = new Set();

  for (const part of model.parts) {
    const target = part.target;
    if (!target) continue;

    const given = KINDS.filter((kind) => target[kind] !== undefined);
    if (given.length !== 1) fail(`part "${part.id}" target needs exactly one of ${KINDS.join(', ')}`);

    if (given[0] === 'product') {
      const id = target.product;
      if (!productIds.has(id)) fail(`unknown product "${id}"`);
      if (productIds.get(id) !== category) fail(`product "${id}" is not in ${category}`);
    } else if (given[0] === 'section') {
      const id = target.section;
      if (!allSections.includes(id)) fail(`unknown section "${id}"`);
      if (!liveSections.includes(id)) inactive.add(part.id);
    } else {
      const slug = target.project;
      if (!projectSlugs.includes(slug)) fail(`unknown project "${slug}"`);
    }
  }

  return { inactive };
}

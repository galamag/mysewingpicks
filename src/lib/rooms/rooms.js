/*
  The room models by page key, and the catalogue category each room belongs to
  (its products and sections are checked against that category, see check.js).
  A new room: its model in src/lib/rooms/<key>.js, registered here.
  projects has no category: its items are projects, not products.
*/
import setup from './setup.js';
import tools from './tools.js';
import fabrics from './fabrics.js';
import projectRoom from './projects.js';
import { products } from '../../data/products.js';
import { categories } from '../../data/categories.js';
import { projects } from '../../data/projects.js';

export const ROOMS = { setup, tools, fabrics, projects: projectRoom };

export const ROOM_CATEGORY = { setup: 'setup', tools: 'tools', fabrics: 'fabrics', projects: null };

/**
  The catalogue as checkTargets (check.js) wants it, for a room of `category` (null: none).
  Room.astro and the tests both call this, so the tests check the build's own catalogue.
*/
export function catalogOf(category) {
  const groups = category ? categories[category]?.groups : [];
  if (!groups) throw new Error(`rooms: no category "${category}" in src/data/categories.js`);
  const sections = groups.map((g) => g.id);
  return {
    productIds: new Map(products.map((p) => [p.id, p.category])),
    category,
    allSections: sections,
    liveSections: sections.filter((id) => products.some((p) => p.category === category && p.group === id)),
    projectSlugs: projects.map((p) => p.slug),
  };
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import setup from '../../src/lib/rooms/setup.js';
import { ROOMS, ROOM_CATEGORY } from '../../src/lib/rooms/rooms.js';
import { checkTargets } from '../../src/lib/rooms/check.js';
import { renderRoom } from '../../src/lib/rooms/render.js';
import { products } from '../../src/data/products.js';
import { categories } from '../../src/data/categories.js';
import { projects } from '../../src/data/projects.js';

// Pinned here, not read from products.js: a new Setup product without an item in
// the room must not break the build or the tests.
const ITEMS = [
  'skytex-softbox-kit', 'sensyne-ring-light', 'liphisy-tripod',
  'iphone-15-pro-max-renewed', 'asus-zenbook-pro-16x', 'ergear-standing-desk',
];

/** The catalogue as the page sees it (Room.astro builds the same thing). */
function catalogOf(category) {
  const productIds = new Map(products.map((p) => [p.id, p.category]));
  const groups = categories[category]?.groups ?? [];
  return {
    productIds,
    category,
    allSections: groups.map((g) => g.id),
    liveSections: groups.filter((g) => products.some((p) => p.category === category && p.group === g.id)).map((g) => g.id),
    projectSlugs: projects.map((p) => p.slug),
  };
}

test('setup maps the six items from the spec', () => {
  const targets = setup.parts.filter((part) => part.target).map((part) => part.target.product);
  assert.deepEqual([...new Set(targets)].sort(), [...ITEMS].sort());
  assert.equal(targets.length, ITEMS.length, 'one part per product (the two softboxes are one part)');
});

test('setup passes the catalog check', () => {
  const { inactive } = checkTargets(setup, catalogOf(ROOM_CATEGORY.setup));
  assert.equal(inactive.size, 0);
});

test('setup is registered with its category', () => {
  assert.equal(setup.key, 'setup');
  assert.deepEqual(setup.size, [60, 50, 40]);
  assert.equal(setup.window?.wall, 'left');
  assert.equal(ROOMS.setup, setup);
  assert.deepEqual(ROOM_CATEGORY, { setup: 'setup', tools: 'tools', fabrics: 'fabrics', projects: null });
});

test('setup draws one tap area per item, decoration stays plain', () => {
  const resolve = (target) => ({ href: `#product-${target.product}`, label: target.product, kind: 'product' });
  const { svg, hots } = renderRoom(setup, { resolve });
  assert.deepEqual(hots.map((h) => h.href).sort(), ITEMS.map((id) => `#product-${id}`).sort());
  for (const part of setup.parts.filter((p) => !p.target)) {
    assert.ok(!svg.includes(`data-part="${part.id}"`), `${part.id} is decoration`);
  }
  assert.ok(setup.parts.some((p) => !p.target), 'the room has decoration (chair, plant)');
  assert.ok(!svg.includes('amazon.'), 'nothing in the drawing links to Amazon');
});

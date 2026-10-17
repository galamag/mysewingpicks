import { test } from 'node:test';
import assert from 'node:assert/strict';
import setup, { CHAIR } from '../../src/lib/rooms/setup.js';
import { ROOMS, ROOM_CATEGORY } from '../../src/lib/rooms/rooms.js';
import { checkTargets } from '../../src/lib/rooms/check.js';
import { renderRoom } from '../../src/lib/rooms/render.js';
import { project } from '../../src/lib/anatomy/iso.js';
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

/* Decoration must not turn into a link: sample its surfaces against the printed tap areas. */
const tapAreas = () => {
  const width = renderRoom({ ...setup, parts: [] }).viewBox[2];
  const minHit = Math.ceil((44 * width) / 320); // as Room.astro: 44 px on a 320 px phone
  const resolve = (target) => ({ href: `#product-${target.product}`, label: target.product, kind: 'product' });
  const { svg } = renderRoom(setup, { resolve, minHit });
  return [...svg.matchAll(/<polygon class="room__hit" points="([^"]*)"/g)]
    .map((m) => m[1].split(' ').map((q) => q.split(',').map(Number)));
};
const inside = (poly, [x, y]) => {
  const side = poly.map((a, i) => {
    const b = poly[(i + 1) % poly.length];
    return Math.sign((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]));
  });
  return side.every((v) => v >= 0) || side.every((v) => v <= 0);
};
/** Share of the points of a world rectangle at(u, v), u, v in 0..1, that land in a tap area. */
function linked(areas, at) {
  let n = 0, hit = 0;
  for (let i = 0; i <= 20; i++) for (let j = 0; j <= 20; j++) {
    n++;
    if (areas.some((poly) => inside(poly, project(at(i / 20, j / 20))))) hit++;
  }
  return hit / n;
}

test('setup: the chair and the window stay clear of the tap areas', () => {
  const areas = tapAreas();
  const { x, y, w, d } = CHAIR;
  const seat = linked(areas, (u, v) => [x + w * u, y + d * v, 17]);
  const back = linked(areas, (u, v) => [x + 2.2, y + 0.6 + (d - 1.2) * u, 18.5 + 11 * v]);
  assert.ok(seat <= 0.15, `chair seat ${(seat * 100).toFixed(1)}% linked`);
  assert.ok(back <= 0.15, `chair back ${(back * 100).toFixed(1)}% linked`);
  const { from, to, z: [z0, z1] } = setup.window;
  const glass = linked(areas, (u, v) => [0, from + (to - from) * u, z0 + (z1 - z0) * v]);
  assert.ok(glass <= 0.25, `window ${(glass * 100).toFixed(1)}% linked`);
  console.log(`  linked: chair seat ${(seat * 100).toFixed(1)}%, back ${(back * 100).toFixed(1)}%, window ${(glass * 100).toFixed(1)}%`);
});

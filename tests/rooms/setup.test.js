import { test } from 'node:test';
import assert from 'node:assert/strict';
import setup, { CHAIR } from '../../src/lib/rooms/setup.js';
import { ROOMS, ROOM_CATEGORY, catalogOf } from '../../src/lib/rooms/rooms.js';
import { checkTargets } from '../../src/lib/rooms/check.js';
import { renderRoom } from '../../src/lib/rooms/render.js';
import { onPhone, linked, glassOf } from './helpers.js';

// Pinned here, not read from products.js: a new Setup product without an item in
// the room must not break the build or the tests.
const ITEMS = [
  'skytex-softbox-kit', 'sensyne-ring-light', 'liphisy-tripod',
  'iphone-15-pro-max-renewed', 'asus-zenbook-pro-16x', 'ergear-standing-desk',
];

const toProduct = (target) => ({ href: `#product-${target.product}`, label: target.product, kind: 'product' });

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

test('catalogOf gives checkTargets the live catalogue (Room.astro uses the same function)', () => {
  const tools = catalogOf('tools');
  assert.ok(tools.allSections.length > 0 && tools.liveSections.every((id) => tools.allSections.includes(id)));
  assert.equal(tools.category, 'tools');
  assert.equal(tools.productIds.get('ergear-standing-desk'), 'setup');
  assert.ok(tools.projectSlugs.includes('tote-bag'));
  // a room with no category (projects) has no sections; a category the data does not know is an error
  const none = catalogOf(ROOM_CATEGORY.projects);
  assert.deepEqual([none.allSections, none.liveSections], [[], []]);
  assert.throws(() => catalogOf('nowhere'), { message: 'rooms: no category "nowhere" in src/data/categories.js' });
});

test('setup draws one tap area per item, decoration stays plain', () => {
  const { svg, hots } = renderRoom(setup, { resolve: toProduct });
  assert.deepEqual(hots.map((h) => h.href).sort(), ITEMS.map((id) => `#product-${id}`).sort());
  for (const part of setup.parts.filter((p) => !p.target)) {
    assert.ok(!svg.includes(`data-part="${part.id}"`), `${part.id} is decoration`);
  }
  assert.ok(setup.parts.some((p) => !p.target), 'the room has decoration (chair, plant)');
  assert.ok(!svg.includes('amazon.'), 'nothing in the drawing links to Amazon');
});

// Decoration must not turn into a link: sample its surfaces against the printed tap areas.
test('setup: the chair and the window stay clear of the tap areas', () => {
  const { areas } = onPhone(setup, toProduct);
  const { x, y, w, d } = CHAIR;
  const seat = linked(areas, (u, v) => [x + w * u, y + d * v, 17]);
  const back = linked(areas, (u, v) => [x + 2.2, y + 0.6 + (d - 1.2) * u, 18.5 + 11 * v]);
  assert.ok(seat <= 0.15, `chair seat ${(seat * 100).toFixed(1)}% linked`);
  assert.ok(back <= 0.15, `chair back ${(back * 100).toFixed(1)}% linked`);
  const glass = linked(areas, glassOf(setup.window));
  assert.ok(glass <= 0.25, `window ${(glass * 100).toFixed(1)}% linked`);
  console.log(`  linked: chair seat ${(seat * 100).toFixed(1)}%, back ${(back * 100).toFixed(1)}%, window ${(glass * 100).toFixed(1)}%`);
});

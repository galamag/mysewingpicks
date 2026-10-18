import { test } from 'node:test';
import assert from 'node:assert/strict';
import fabrics, { POUF } from '../../src/lib/rooms/fabrics.js';
import { ROOMS, ROOM_CATEGORY, catalogOf } from '../../src/lib/rooms/rooms.js';
import { checkTargets } from '../../src/lib/rooms/check.js';
import { renderRoom } from '../../src/lib/rooms/render.js';
import { onPhone, linked, glassOf, ownSquare, unlink } from './helpers.js';

// The zones of the spec (4.3), pinned here: a zone links to a section of the page, not to products.
const SECTIONS = ['fabrics', 'batting-interfacing', 'trims', 'notions'];

const toSection = (target) => ({ href: `#${target.section}`, label: target.section, kind: 'section' });

test('fabrics zones are the four sections from the spec', () => {
  const zones = fabrics.parts.filter((part) => part.target);
  assert.ok(zones.every((part) => Object.keys(part.target).join() === 'section'), 'zones link to sections only');
  assert.deepEqual(zones.map((part) => part.target.section).sort(), [...SECTIONS].sort(), 'one zone per section');
});

test('fabrics passes the catalog check', () => {
  // An empty section is legal (spec 4.3): its zone just turns into decoration. The check only throws
  // for a zone that points at nothing.
  assert.doesNotThrow(() => checkTargets(fabrics, catalogOf(ROOM_CATEGORY.fabrics)));
});

test('all four sections of fabrics have products today, so all four zones are live', () => {
  // A snapshot of the catalogue, not a rule: when a section is emptied on purpose, update this test.
  const { inactive } = checkTargets(fabrics, catalogOf(ROOM_CATEGORY.fabrics));
  assert.deepEqual([...inactive], []);
});

test('fabrics is registered with its category', () => {
  assert.equal(fabrics.key, 'fabrics');
  assert.equal(ROOMS.fabrics, fabrics);
  assert.equal(ROOM_CATEGORY.fabrics, 'fabrics');
  assert.deepEqual(fabrics.size.slice(0, 2), [60, 50], 'one cell of the house (Task 9: cell [60, 50])');
});

test('the fabric shelf and the window are on the back wall, the outer wall of the house', () => {
  // In the house this room sits on the right, its back wall (y = 0) is the house's outer wall:
  // the shelf stands against it, the window is in it (windows only on outer walls).
  const shelf = fabrics.parts.find((part) => part.target?.section === 'fabrics');
  assert.ok(Math.min(...shelf.hit.map(([, y]) => y)) <= 1, 'the shelf stands against y = 0');
  assert.equal(fabrics.window?.wall, 'back');
});

test('fabrics draws one tap area per section, nothing links to Amazon, no lettering', () => {
  const { svg, hots } = renderRoom(fabrics, { resolve: toSection });
  assert.deepEqual(hots.map((h) => h.href).sort(), SECTIONS.map((id) => `#${id}`).sort());
  assert.ok(hots.every((h) => h.kind === 'section'));
  assert.ok(!svg.includes('amazon.'), 'nothing in the drawing links to Amazon');
  assert.ok(!svg.includes('#product-'), 'zones, not items');
  assert.ok(!unlink(svg).includes('<text'), 'no names or lettering drawn on anything (the corner labels aside)');
});

test('an empty section turns its zone into decoration', () => {
  const catalog = catalogOf('fabrics');
  const plain = renderRoom(fabrics, { resolve: () => null }).svg;
  for (const section of SECTIONS) {
    const zone = fabrics.parts.find((part) => part.target?.section === section);
    const { inactive } = checkTargets(fabrics, { ...catalog, liveSections: catalog.liveSections.filter((id) => id !== section) });
    assert.deepEqual([...inactive], [zone.id], section);

    const { svg, hots } = renderRoom(fabrics, { resolve: toSection, inactive });
    assert.ok(!svg.includes(`href="#${section}"`), `${section}: no anchor into nowhere`);
    assert.equal(hots.length, SECTIONS.length - 1, section);
    assert.ok(!svg.includes(`data-part="${zone.id}"`), `${section}: the zone is plain decoration`);
    // …and its drawing stays: without the links and their groups the room is the all-decoration room.
    assert.equal(unlink(svg), plain, `${section}: the drawing stays`);
  }
});

/* ---------- tap areas on the narrowest phone ---------- */

test('every zone keeps a thumb-size square of its own on a 320 px phone', () => {
  const { areas, thumb, minHit } = onPhone(fabrics, toSection);
  assert.equal(minHit, Math.ceil(thumb), 'minHitFor: the whole units that hold a thumb');
  const sides = areas.map((a, i) => [a.href, ownSquare(areas, i)]);
  for (const [href, side] of sides) {
    assert.ok(side >= thumb, `${href}: own square ${side.toFixed(1)} < ${thumb.toFixed(1)} units (44 px)`);
  }
  console.log(`  own squares at 320 px: ${sides.map(([h, side]) => `${h.slice(1)} ${Math.floor((side / thumb) * 44)} px`).join(', ')}`);
});

// Decoration must not turn into a link: sample its surfaces against the printed tap areas.
test('fabrics: the window and the pouf stay clear of the tap areas', () => {
  const { areas } = onPhone(fabrics, toSection);
  const glass = linked(areas, glassOf(fabrics.window));
  const { x, y, r, h } = POUF;
  // its top (a disc: u around, v out from the middle) and the half of its side that faces the viewer
  const top = linked(areas, (u, v) => [x + r * v * Math.cos(2 * Math.PI * u), y + r * v * Math.sin(2 * Math.PI * u), h]);
  const side = linked(areas, (u, v) => {
    const a = (-0.25 + u) * Math.PI; // -45° … 135°: the side that faces (1, 1)
    return [x + r * Math.cos(a), y + r * Math.sin(a), h * v];
  });
  for (const [name, share] of [['window', glass], ['pouf top', top], ['pouf side', side]]) {
    assert.ok(share <= 0.15, `${name} ${(share * 100).toFixed(1)}% linked`);
  }
  console.log(`  linked: window ${(glass * 100).toFixed(1)}%, pouf top ${(top * 100).toFixed(1)}%, side ${(side * 100).toFixed(1)}%`);
});

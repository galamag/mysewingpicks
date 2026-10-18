import { test } from 'node:test';
import assert from 'node:assert/strict';
import tools, { BASKET } from '../../src/lib/rooms/tools.js';
import { ROOMS, ROOM_CATEGORY, catalogOf } from '../../src/lib/rooms/rooms.js';
import { checkTargets } from '../../src/lib/rooms/check.js';
import { renderRoom } from '../../src/lib/rooms/render.js';
import { onPhone, linked, glassOf, ownSquare } from './helpers.js';

// The zones of the spec (4.2), pinned here: a zone links to a section of the page, not to products.
const SECTIONS = ['machines', 'cutting', 'marking-pressing', 'helpers'];

const toSection = (target) => ({ href: `#${target.section}`, label: target.section, kind: 'section' });

test('tools zones are the four sections from the spec', () => {
  const zones = tools.parts.filter((part) => part.target);
  assert.ok(zones.every((part) => Object.keys(part.target).join() === 'section'), 'zones link to sections only');
  assert.deepEqual(zones.map((part) => part.target.section).sort(), [...SECTIONS].sort(), 'one zone per section');
});

test('tools passes the catalog check', () => {
  // An empty section is legal (spec 4.2): its zone just turns into decoration. The check only throws
  // for a zone that points at nothing.
  assert.doesNotThrow(() => checkTargets(tools, catalogOf(ROOM_CATEGORY.tools)));
});

test('all four sections of tools have products today, so all four zones are live', () => {
  // A snapshot of the catalogue, not a rule: when a section is emptied on purpose, update this test.
  const { inactive } = checkTargets(tools, catalogOf(ROOM_CATEGORY.tools));
  assert.deepEqual([...inactive], []);
});

test('tools is registered with its category', () => {
  assert.equal(tools.key, 'tools');
  assert.equal(ROOMS.tools, tools);
  assert.equal(ROOM_CATEGORY.tools, 'tools');
  assert.deepEqual(tools.size.slice(0, 2), [60, 50], 'one cell of the house (Task 9: cell [60, 50])');
});

test('tools draws one tap area per section, nothing links to Amazon', () => {
  const { svg, hots } = renderRoom(tools, { resolve: toSection });
  assert.deepEqual(hots.map((h) => h.href).sort(), SECTIONS.map((id) => `#${id}`).sort());
  assert.ok(hots.every((h) => h.kind === 'section'));
  assert.ok(!svg.includes('amazon.'), 'nothing in the drawing links to Amazon');
  assert.ok(!svg.includes('#product-'), 'zones, not items');
});

test('an empty section turns its zone into decoration', () => {
  const catalog = catalogOf('tools');
  const zone = tools.parts.find((part) => part.target?.section === 'helpers');
  const { inactive } = checkTargets(tools, { ...catalog, liveSections: catalog.liveSections.filter((id) => id !== 'helpers') });
  assert.deepEqual([...inactive], [zone.id]);

  const { svg, hots } = renderRoom(tools, { resolve: toSection, inactive });
  assert.ok(!svg.includes('href="#helpers"'), 'no anchor into nowhere');
  assert.equal(hots.length, SECTIONS.length - 1);
  assert.ok(!svg.includes(`data-part="${zone.id}"`), 'the zone is plain decoration');

  // …and its drawing stays: without the links and their groups the room is the all-decoration room.
  const plain = renderRoom(tools, { resolve: () => null }).svg;
  assert.equal(unlink(svg), plain);
});

/** An svg without its tap areas and without the <g class="room__part"> wrappers (what is inside them stays). */
function unlink(svg) {
  const wrappers = []; // for every open <g>: is it a wrapper?
  return svg
    .replace(/<a class="room__hot".*?<\/a>/g, '')
    .replace(/<g class="room__part"[^>]*>|<g\b[^>]*>|<\/g>/g, (tag) => {
      if (tag === '</g>') return wrappers.pop() ? '' : tag;
      const wrapper = tag.startsWith('<g class="room__part"');
      wrappers.push(wrapper);
      return wrapper ? '' : tag;
    });
}

/* ---------- tap areas on the narrowest phone ---------- */

test('every zone keeps a thumb-size square of its own on a 320 px phone', () => {
  const { areas, thumb, minHit } = onPhone(tools, toSection);
  assert.equal(minHit, Math.ceil(thumb), 'minHitFor: the whole units that hold a thumb');
  const sides = areas.map((a, i) => [a.href, ownSquare(areas, i)]);
  for (const [href, side] of sides) {
    assert.ok(side >= thumb, `${href}: own square ${side.toFixed(1)} < ${thumb.toFixed(1)} units (44 px)`);
  }
  console.log(`  own squares at 320 px: ${sides.map(([h, side]) => `${h.slice(1)} ${Math.floor((side / thumb) * 44)} px`).join(', ')}`);
});

// Decoration must not turn into a link: sample its surfaces against the printed tap areas.
test('tools: the window and the scrap basket stay clear of the tap areas', () => {
  const { areas } = onPhone(tools, toSection);
  assert.ok(tools.window, 'the room has a window to keep clear');
  const glass = linked(areas, glassOf(tools.window));
  const { x, y, w, d, h } = BASKET;
  const top = linked(areas, (u, v) => [x + w * u, y + d * v, h + 2]); // with the scraps poking out
  const front = linked(areas, (u, v) => [x + w * u, y + d, h * v]);
  const side = linked(areas, (u, v) => [x + w, y + d * u, h * v]);
  for (const [name, share] of [['window', glass], ['basket top', top], ['basket front', front], ['basket side', side]]) {
    assert.ok(share <= 0.15, `${name} ${(share * 100).toFixed(1)}% linked`);
  }
  console.log(`  linked: window ${(glass * 100).toFixed(1)}%, basket top ${(top * 100).toFixed(1)}%, front ${(front * 100).toFixed(1)}%, side ${(side * 100).toFixed(1)}%`);
});

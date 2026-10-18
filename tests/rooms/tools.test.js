import { test } from 'node:test';
import assert from 'node:assert/strict';
import tools, { BASKET, WINDOW } from '../../src/lib/rooms/tools.js';
import { ROOMS, ROOM_CATEGORY } from '../../src/lib/rooms/rooms.js';
import { checkTargets } from '../../src/lib/rooms/check.js';
import { renderRoom } from '../../src/lib/rooms/render.js';
import { project } from '../../src/lib/anatomy/iso.js';
import { products } from '../../src/data/products.js';
import { categories } from '../../src/data/categories.js';
import { projects } from '../../src/data/projects.js';

// The zones of the spec (4.2), pinned here: a zone links to a section of the page, not to products.
const SECTIONS = ['machines', 'cutting', 'marking-pressing', 'helpers'];

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

const toSection = (target) => ({ href: `#${target.section}`, label: target.section, kind: 'section' });

test('tools zones are the four sections from the spec', () => {
  const zones = tools.parts.filter((part) => part.target);
  assert.ok(zones.every((part) => Object.keys(part.target).join() === 'section'), 'zones link to sections only');
  assert.deepEqual(zones.map((part) => part.target.section).sort(), [...SECTIONS].sort(), 'one zone per section');
});

test('tools passes the catalog check', () => {
  const { inactive } = checkTargets(tools, catalogOf(ROOM_CATEGORY.tools));
  assert.equal(inactive.size, 0);
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

/** As Room.astro: minHit = 44 px on a 320 px phone, in viewBox units. */
function tapAreas(model) {
  const width = renderRoom({ ...model, parts: [] }).viewBox[2];
  const minHit = Math.ceil((44 * width) / 320);
  const { svg } = renderRoom(model, { resolve: toSection, minHit });
  const areas = [...svg.matchAll(/<a class="room__hot"[^>]*href="#([^"]*)"[^>]*><polygon class="room__hit" points="([^"]*)"/g)]
    .map((m) => ({ section: m[1], poly: m[2].split(' ').map((q) => q.split(',').map(Number)) }));
  return { areas, thumb: (44 * width) / 320 };
}

const inside = (poly, [x, y]) => {
  const side = poly.map((a, i) => {
    const b = poly[(i + 1) % poly.length];
    return Math.sign((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]));
  });
  return side.every((v) => v >= 0) || side.every((v) => v <= 0);
};

/**
  The side of the largest square (viewBox units) where a tap reaches area `i`: inside it and
  under no area printed after it (later = on top). Sampled every `step` units.
*/
function ownSquare(areas, i, step = 0.25) {
  const xs = areas[i].poly.map((q) => q[0]);
  const ys = areas[i].poly.map((q) => q[1]);
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  const cols = Math.ceil((Math.max(...xs) - x0) / step);
  const rows = Math.ceil((Math.max(...ys) - y0) / step);
  let best = 0;
  let prev = new Array(cols + 1).fill(0);
  for (let r = 0; r <= rows; r++) {
    const row = new Array(cols + 1).fill(0);
    for (let c = 0; c <= cols; c++) {
      const pt = [x0 + c * step, y0 + r * step];
      const own = inside(areas[i].poly, pt) && !areas.slice(i + 1).some((a) => inside(a.poly, pt));
      if (!own) continue;
      row[c] = r && c ? Math.min(prev[c], row[c - 1], prev[c - 1]) + 1 : 1;
      best = Math.max(best, row[c]);
    }
    prev = row;
  }
  return (best - 1) * step;
}

test('every zone keeps a thumb-size square of its own on a 320 px phone', () => {
  const { areas, thumb } = tapAreas(tools);
  const sides = areas.map((a, i) => [a.section, ownSquare(areas, i)]);
  for (const [section, side] of sides) {
    assert.ok(side >= thumb, `${section}: own square ${side.toFixed(1)} < ${thumb.toFixed(1)} units (44 px)`);
  }
  console.log(`  own squares at 320 px: ${sides.map(([s, side]) => `${s} ${Math.floor((side / thumb) * 44)} px`).join(', ')}`);
});

/* Decoration must not turn into a link: sample its surfaces against the printed tap areas. */

/** Share of the points of a world rectangle at(u, v), u, v in 0..1, that land in a tap area. */
function linked(areas, at) {
  let n = 0, hit = 0;
  for (let i = 0; i <= 20; i++) for (let j = 0; j <= 20; j++) {
    n++;
    if (areas.some((a) => inside(a.poly, project(at(i / 20, j / 20))))) hit++;
  }
  return hit / n;
}

test('tools: the window and the scrap basket stay clear of the tap areas', () => {
  const { areas } = tapAreas(tools);
  assert.equal(tools.window, WINDOW);
  const { wall, from, to, z: [z0, z1] } = WINDOW;
  const onWall = (along, z) => (wall === 'left' ? [0, along, z] : [along, 0, z]);
  const glass = linked(areas, (u, v) => onWall(from + (to - from) * u, z0 + (z1 - z0) * v));
  const { x, y, w, d, h } = BASKET;
  const top = linked(areas, (u, v) => [x + w * u, y + d * v, h + 2]); // with the scraps poking out
  const front = linked(areas, (u, v) => [x + w * u, y + d, h * v]);
  const side = linked(areas, (u, v) => [x + w, y + d * u, h * v]);
  for (const [name, share] of [['window', glass], ['basket top', top], ['basket front', front], ['basket side', side]]) {
    assert.ok(share <= 0.15, `${name} ${(share * 100).toFixed(1)}% linked`);
  }
  console.log(`  linked: window ${(glass * 100).toFixed(1)}%, basket top ${(top * 100).toFixed(1)}%, front ${(front * 100).toFixed(1)}%, side ${(side * 100).toFixed(1)}%`);
});

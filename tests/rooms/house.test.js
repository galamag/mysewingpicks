import { test } from 'node:test';
import assert from 'node:assert/strict';
import { project } from '../../src/lib/anatomy/iso.js';
import { PALETTE, num } from '../../src/lib/rooms/paint.js';
import { FLOOR_THICK } from '../../src/lib/rooms/render.js';
import { HOUSE, HOUSE_ASPECT, renderHouse } from '../../src/lib/rooms/house.js';
import { ROOMS } from '../../src/lib/rooms/rooms.js';
import { LOCALES, pageUrl, t } from '../../src/i18n/index.js';
import { THUMB_PX, PHONE_PX, ownSquare } from './helpers.js';

const KEYS = ['projects', 'fabrics', 'setup', 'tools'];
const LABELS = { projects: 'Projects', fabrics: 'Fabrics', setup: 'My Setup', tools: 'Tools' };
const HREFS = { projects: '/projects.html', fabrics: '/fabrics.html', setup: '/setup.html', tools: '/tools.html' };
const OPTS = { prefix: 'house', labels: LABELS, hrefs: HREFS };

/** The printed room links of a house svg, in document order: { attrs, room, href, label, zoom, poly }. */
function hotsOf(svg) {
  return [...svg.matchAll(/<a class="house__hot"([^>]*)><polygon class="house__hit" points="([^"]*)"\/><\/a>/g)]
    .map(([, attrs, points]) => ({
      attrs,
      room: /data-room="([^"]*)"/.exec(attrs)?.[1],
      href: /href="([^"]*)"/.exec(attrs)?.[1],
      label: /aria-label="([^"]*)"/.exec(attrs)?.[1],
      zoom: /data-zoom="([^"]*)"/.exec(attrs)?.[1],
      poly: points.split(' ').map((q) => q.split(',').map(Number)),
    }));
}

/** The printed label pills: { x, y, w, h, text }. */
function labelsOf(svg) {
  return [...svg.matchAll(/<g class="house__label" aria-hidden="true"><rect x="([^"]*)" y="([^"]*)" width="([^"]*)" height="([^"]*)"[^>]*\/><text[^>]*>([^<]*)<\/text><\/g>/g)]
    .map(([, x, y, w, h, text]) => ({ x: +x, y: +y, w: +w, h: +h, text }));
}

/** The floor of a cell of the house as the svg prints it. */
const floorOf = (key) => {
  const [ox, oy] = HOUSE.at[key];
  const [w, d] = HOUSE.cell;
  return [[ox, oy, 0], [ox + w, oy, 0], [ox + w, oy + d, 0], [ox, oy + d, 0]].map((q) => project(q).map(num));
};

/** A window pane as the painter prints it (render.js windowOnWall), on a wall of the HOUSE. */
const pane = (wall, from, to, [z0, z1]) => {
  const on = (a, z) => (wall === 'left' ? [0, a, z] : [a, 0, z]);
  return [on(from, z0), on(to, z0), on(to, z1), on(from, z1)].map((q) => project(q).map(num).join(',')).join(' ');
};
const PANE = new RegExp(`<polygon points="([^"]*)" fill="${PALETTE.glass}" stroke="${PALETTE.woodDark}" stroke-width="0.8"`, 'g');
const panesOf = (svg) => [...svg.matchAll(PANE)].map((m) => m[1]);

test('the house is the four rooms of the site, each a cell of it', () => {
  assert.deepEqual(Object.keys(HOUSE.at), KEYS, 'back to front: the order they are drawn in');
  assert.deepEqual(Object.keys(ROOMS).sort(), [...KEYS].sort());
  for (const key of KEYS) assert.deepEqual(ROOMS[key].size, [...HOUSE.cell, HOUSE.wallH], key);
  assert.equal(HOUSE.partitionH, 7);
  assert.equal(HOUSE_ASPECT, 224 / 196);
});

test('four rooms link to their pages', () => {
  const { svg } = renderHouse(ROOMS, OPTS);
  const hots = hotsOf(svg);
  assert.equal((svg.match(/class="house__hot"/g) ?? []).length, 4, 'exactly four room links');
  assert.deepEqual(hots.map((h) => h.room), KEYS);
  for (const h of hots) {
    assert.equal(h.href, HREFS[h.room], h.room);
    assert.equal(h.label, LABELS[h.room], h.room);
    assert.deepEqual(h.poly, floorOf(h.room), `${h.room}: the tap area is the room's floor`);
  }
  // the links come last: on top of the rooms and the labels
  assert.ok(svg.lastIndexOf('class="house__room"') < svg.indexOf('<a class="house__hot"'));
  assert.ok(svg.lastIndexOf('class="house__label"') < svg.indexOf('<a class="house__hot"'));
  assert.ok(svg.endsWith('</a>'));

  // the build's own links: pageUrl in every language
  for (const lang of LOCALES) {
    const hrefs = Object.fromEntries(KEYS.map((k) => [k, pageUrl(k, lang)]));
    const got = hotsOf(renderHouse(ROOMS, { ...OPTS, hrefs }).svg);
    assert.deepEqual(got.map((h) => h.href), KEYS.map((k) => pageUrl(k, lang)), lang);
  }
  assert.equal(pageUrl('setup', 'ru'), '/ru/setup.html');
});

test('no product links in the house', () => {
  const { svg } = renderHouse(ROOMS, OPTS);
  assert.ok(!svg.includes('room__hot'), 'no tap areas of the rooms');
  assert.ok(!svg.includes('room__part'), 'nothing in a room is a link');
  assert.ok(!svg.includes('#product-'), 'no product cards');
  assert.ok(!svg.includes('amazon.'), 'nothing links to Amazon');
  assert.equal((svg.match(/<a /g) ?? []).length, 4, 'the four rooms are the only links');
  assert.equal((svg.match(/ href="/g) ?? []).length, 4);
});

test('every room is drawn in its own group, back to front', () => {
  const { svg } = renderHouse(ROOMS, OPTS);
  const groups = [...svg.matchAll(/<g class="house__room" data-room="([^"]*)">/g)].map((m) => m[1]);
  assert.deepEqual(groups, KEYS);
});

test('zoom frames each room', () => {
  const { svg, viewBox, rooms } = renderHouse(ROOMS, OPTS);
  assert.deepEqual(rooms.map((r) => r.key), KEYS);
  const hots = hotsOf(svg);
  const [w, d] = HOUSE.cell;
  for (const { key, zoom } of rooms) {
    assert.equal(zoom.length, 4, key);
    const [zx, zy, zw, zh] = zoom;
    assert.ok(Math.abs(zw / zh - HOUSE_ASPECT) <= 0.01, `${key}: aspect ${zw / zh}`);
    assert.ok(zw < viewBox[2] && zh < viewBox[3], `${key}: a zoom IN`);
    // the box of the room: its floor (slab included) up to the top of the walls
    const [ox, oy] = HOUSE.at[key];
    for (const x of [ox, ox + w]) for (const y of [oy, oy + d]) for (const z of [-FLOOR_THICK, HOUSE.wallH]) {
      const [sx, sy] = project([x, y, z]);
      assert.ok(sx >= zx && sx <= zx + zw && sy >= zy && sy <= zy + zh, `${key}: corner ${x},${y},${z} outside the zoom`);
    }
    assert.equal(hots.find((h) => h.room === key).zoom, zoom.join(' '), `${key}: data-zoom`);
  }
  assert.ok(Math.abs(viewBox[2] / viewBox[3] - HOUSE_ASPECT) <= 0.01, `the house: aspect ${viewBox[2] / viewBox[3]}`);
});

test('labels come from the caller', () => {
  const labels = { projects: 'Proj & "Co"', fabrics: 'Ткани', setup: 'Il mio studio', tools: '<Tools>' };
  const { svg } = renderHouse(ROOMS, { ...OPTS, labels });
  const pills = labelsOf(svg);
  assert.deepEqual(pills.map((l) => l.text), ['Proj &amp; &quot;Co&quot;', 'Ткани', 'Il mio studio', '&lt;Tools&gt;']);
  assert.ok(!svg.includes('<Tools>'), 'escaped');
  assert.deepEqual(hotsOf(svg).map((h) => h.label), ['Proj &amp; &quot;Co&quot;', 'Ткани', 'Il mio studio', '&lt;Tools&gt;']);
  // each pill sits at its world point outside the house (HOUSE.label)
  for (const [i, key] of KEYS.entries()) {
    const [cx, cy] = project(HOUSE.label[key]);
    const { x, y, w, h } = pills[i];
    assert.ok(Math.abs(x + w / 2 - cx) < 0.02 && Math.abs(y + h / 2 - cy) < 0.02, `${key}: pill centred on its point`);
  }
});

test('every language\'s labels fit in the picture', () => {
  for (const lang of LOCALES) {
    const { ui } = t(lang);
    const labels = Object.fromEntries(KEYS.map((k) => [k, ui.nav[k]]));
    const { svg, viewBox: [vx, vy, vw, vh] } = renderHouse(ROOMS, { ...OPTS, labels });
    const pills = labelsOf(svg);
    assert.equal(pills.length, 4, lang);
    for (const { x, y, w, h, text } of pills) {
      assert.ok(x >= vx && y >= vy && x + w <= vx + vw && y + h <= vy + vh, `${lang} "${text}": pill outside the viewBox`);
    }
  }
});

test('windows only on outer walls', () => {
  // the models: the window walls the house relies on
  assert.equal(ROOMS.projects.window.wall, 'back');
  assert.equal(ROOMS.fabrics.window.wall, 'back');
  assert.equal(ROOMS.setup.window.wall, 'left');
  assert.equal(ROOMS.tools.window.wall, 'left');

  const { svg } = renderHouse(ROOMS, OPTS);
  const at = (key) => HOUSE.at[key];
  const { projects, fabrics, setup, tools } = ROOMS;
  const kept = [
    pane('back', projects.window.from + at('projects')[0], projects.window.to + at('projects')[0], projects.window.z),
    pane('back', fabrics.window.from + at('fabrics')[0], fabrics.window.to + at('fabrics')[0], fabrics.window.z),
    pane('left', setup.window.from + at('setup')[1], setup.window.to + at('setup')[1], setup.window.z),
  ];
  assert.deepEqual(panesOf(svg).sort(), [...kept].sort(), 'Projects and Fabrics on the back wall, Setup on the left wall');

  // Tools has no outer wall: its window is neither on the partition it would face nor anywhere else
  const [tx, ty] = at('tools');
  const shifted = [[tx, ty + tools.window.from, tools.window.z[0]], [tx, ty + tools.window.to, tools.window.z[0]], [tx, ty + tools.window.to, tools.window.z[1]], [tx, ty + tools.window.from, tools.window.z[1]]]
    .map((q) => project(q).map(num).join(',')).join(' ');
  assert.ok(!svg.includes(shifted), 'no Tools window on the partition');
  assert.ok(!svg.includes(pane('left', tools.window.from, tools.window.to, tools.window.z)), 'no Tools window at its page place');
});

test('windows only on outer walls: the rule, for any wall', () => {
  const toy = (key, wall) => ({ key, size: [60, 50, 40], window: { wall, from: 10, to: 30, z: [20, 32] }, parts: [] });
  const house = (wall) => panesOf(renderHouse(Object.fromEntries(KEYS.map((k) => [k, toy(k, wall)])), OPTS).svg).sort();
  // a left-wall window survives where the room's left wall is the house's (x = 0): Projects, Setup
  assert.deepEqual(house('left'), [pane('left', 10, 30, [20, 32]), pane('left', 60, 80, [20, 32])].sort());
  // a back-wall window where the room's back wall is the house's (y = 0): Projects, Fabrics
  assert.deepEqual(house('back'), [pane('back', 10, 30, [20, 32]), pane('back', 70, 90, [20, 32])].sort());
});

test('svg is the inner content: defs first, ids carry the prefix, every url() is defined', () => {
  const { svg } = renderHouse(ROOMS, OPTS);
  assert.ok(svg.startsWith('<defs>'));
  assert.ok(!svg.includes('<svg'));
  const ids = [...svg.matchAll(/ id="([^"]*)"/g)].map((m) => m[1]);
  assert.ok(ids.length > 0);
  for (const id of ids) assert.ok(id.startsWith('house-'), id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  for (const [, id] of svg.matchAll(/url\(#([^)]*)\)/g)) assert.ok(ids.includes(id), `undefined ${id}`);
  // one painter for the whole house: a colour's gradient is made once, not once per room
  const stops = [...svg.matchAll(/<linearGradient id="[^"]*"([^>]*)>(.*?)<\/linearGradient>/g)].map((m) => m[1] + m[2]);
  assert.equal(new Set(stops).size, stops.length, 'no gradient twice');
});

test('every room link keeps a big tap area on a 320 px phone', () => {
  const { svg, viewBox } = renderHouse(ROOMS, OPTS);
  const areas = hotsOf(svg);
  const thumb = (THUMB_PX * viewBox[2]) / PHONE_PX; // 44 px in viewBox units, the house as wide as the phone
  const px = (units) => Math.floor((units * PHONE_PX) / viewBox[2]);
  const sides = areas.map((a, i) => [a.room, ownSquare(areas, i, 0.5)]);
  for (const [room, side] of sides) assert.ok(side >= thumb, `${room}: own square ${side.toFixed(1)} < ${thumb.toFixed(1)} units (44 px)`);
  console.log(`  own squares at 320 px: ${sides.map(([room, side]) => `${room} ${px(side)} px`).join(', ')}`);
});

test('a room that does not fit its cell, or a missing label or link, fails loudly', () => {
  assert.throws(() => renderHouse({ ...ROOMS, tools: { ...ROOMS.tools, size: [70, 50, 40] } }, OPTS), /house: room "tools" is 70 × 50 × 40/);
  const { tools, ...three } = ROOMS;
  assert.ok(tools);
  assert.throws(() => renderHouse(three, OPTS), /house: no room "tools"/);
  assert.throws(() => renderHouse(ROOMS), /house: no label for "projects"/);
  assert.throws(() => renderHouse(ROOMS, { ...OPTS, labels: { ...LABELS, setup: undefined } }), /house: no label for "setup"/);
  assert.throws(() => renderHouse(ROOMS, { ...OPTS, hrefs: { ...HREFS, fabrics: '' } }), /house: no link for "fabrics"/);
});

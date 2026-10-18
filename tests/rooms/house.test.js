import { test } from 'node:test';
import assert from 'node:assert/strict';
import { project } from '../../src/lib/anatomy/iso.js';
import { PALETTE, num } from '../../src/lib/rooms/paint.js';
import { FLOOR_THICK } from '../../src/lib/rooms/render.js';
import { HOUSE, HOUSE_ASPECT, renderHouse } from '../../src/lib/rooms/house.js';
import { ROOMS } from '../../src/lib/rooms/rooms.js';
import { LOCALES, pageUrl, t } from '../../src/i18n/index.js';
import { THUMB_PX, PHONE_PX, inside } from './helpers.js';

const KEYS = ['projects', 'fabrics', 'setup', 'tools'];
const LABELS = { projects: 'Projects', fabrics: 'Fabrics', setup: 'My Setup', tools: 'Tools' };
const HREFS = { projects: '/projects.html', fabrics: '/fabrics.html', setup: '/setup.html', tools: '/tools.html' };
const OPTS = { prefix: 'house', labels: LABELS, hrefs: HREFS };

const POLY = /<polygon class="(house__hit|house__pad)" points="([^"]*)" fill="transparent"\/>/g;
const PILL_PAD = /<rect class="house__pad" x="([^"]*)" y="([^"]*)" width="([^"]*)" height="([^"]*)"[^>]*fill="transparent"\/>/g;

/**
  The printed room links of a house svg, in document order (later = on top):
  { attrs, room, href, label, zoom, floors, pads, pills, rest }
    floors  the styled polygons (house__hit) — the room's floor
    pads    the always-transparent polygons (house__pad): walls, furniture
    pills   the transparent rects over the labels: { x, y, w, h }
    rest    whatever else is inside the link (should be nothing)
*/
function hotsOf(svg) {
  return [...svg.matchAll(/<a class="house__hot"([^>]*)>(.*?)<\/a>/g)].map(([, attrs, inner]) => {
    const polys = [...inner.matchAll(POLY)].map(([, cls, pts]) => ({ cls, poly: pts.split(' ').map((q) => q.split(',').map(Number)) }));
    return {
      attrs,
      room: /data-room="([^"]*)"/.exec(attrs)?.[1],
      href: /href="([^"]*)"/.exec(attrs)?.[1],
      label: /aria-label="([^"]*)"/.exec(attrs)?.[1],
      zoom: /data-zoom="([^"]*)"/.exec(attrs)?.[1],
      floors: polys.filter((p) => p.cls === 'house__hit').map((p) => p.poly),
      pads: polys.filter((p) => p.cls === 'house__pad').map((p) => p.poly),
      pills: [...inner.matchAll(PILL_PAD)].map(([, x, y, w, h]) => ({ x: +x, y: +y, w: +w, h: +h })),
      rest: inner.replace(POLY, '').replace(PILL_PAD, ''),
    };
  });
}

/** Does a tap at screen point `pt` land in this link (any of its shapes)? */
const reaches = (hot, pt) =>
  hot.floors.some((poly) => inside(poly, pt)) || hot.pads.some((poly) => inside(poly, pt)) ||
  hot.pills.some(({ x, y, w, h }) => pt[0] >= x && pt[0] <= x + w && pt[1] >= y && pt[1] <= y + h);

/** The room a tap at `pt` opens: the LAST link that reaches it (later links are on top), or null. */
const ownerAt = (hots, pt) => {
  let owner = null;
  for (const hot of hots) if (reaches(hot, pt)) owner = hot.room;
  return owner;
};

/** Convex hull of 2D points (monotone chain) — the test's own, not render.js's. */
function hullOf(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const turn = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const chain = (list) => {
    const out = [];
    for (const q of list) {
      while (out.length >= 2 && turn(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop();
      out.push(q);
    }
    return out.slice(0, -1);
  };
  return chain(pts).concat(chain([...pts].reverse()));
}

/** The screen outline of a linked part in the house: the hull of its `hit`, moved to its room's cell. */
const partOutline = (key, part) => {
  const [ox, oy] = HOUSE.at[key];
  return hullOf(part.hit.map(([x, y, z]) => project([x + ox, y + oy, z])));
};

/** Points every `step` units inside a convex polygon. */
function samples(poly, step = 0.5) {
  const xs = poly.map((q) => q[0]);
  const ys = poly.map((q) => q[1]);
  const out = [];
  for (let x = Math.min(...xs); x <= Math.max(...xs); x += step) {
    for (let y = Math.min(...ys); y <= Math.max(...ys); y += step) if (inside(poly, [x, y])) out.push([x, y]);
  }
  return out;
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
  // ROOMS may hold rooms that are not in the house (yet): the classroom of /guides.html joins it in stage 3
  for (const key of KEYS) assert.ok(key in ROOMS, `${key} is in ROOMS`);
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
    assert.deepEqual(h.floors, [floorOf(h.room)], `${h.room}: one styled shape, the room's floor`);
    assert.ok(h.pads.length > 0, `${h.room}: its walls and furniture`);
    assert.equal(h.pills.length, 1, `${h.room}: its label`);
    assert.equal(h.rest, '', `${h.room}: nothing else in the link`);
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
  const { svg, viewBox: [vx, vy, vw, vh] } = renderHouse(ROOMS, OPTS);
  const hots = hotsOf(svg);
  const thumb = (THUMB_PX * vw) / PHONE_PX; // 44 px in viewBox units, the house as wide as the phone
  const px = (units) => Math.floor((units * PHONE_PX) / vw);
  // who a tap opens, every half unit over the whole picture; then each room's largest square of its own
  const step = 0.5;
  const [cols, rows] = [Math.ceil(vw / step), Math.ceil(vh / step)];
  const grid = [];
  for (let r = 0; r <= rows; r++) {
    const row = [];
    for (let c = 0; c <= cols; c++) row.push(ownerAt(hots, [vx + c * step, vy + r * step]));
    grid.push(row);
  }
  const sides = KEYS.map((key) => {
    let best = 0;
    let prev = new Array(cols + 1).fill(0);
    for (let r = 0; r <= rows; r++) {
      const row = new Array(cols + 1).fill(0);
      for (let c = 0; c <= cols; c++) {
        if (grid[r][c] !== key) continue;
        row[c] = r && c ? Math.min(prev[c], row[c - 1], prev[c - 1]) + 1 : 1;
        best = Math.max(best, row[c]);
      }
      prev = row;
    }
    return [key, (best - 1) * step];
  });
  for (const [room, side] of sides) assert.ok(side >= thumb, `${room}: own square ${side.toFixed(1)} < ${thumb.toFixed(1)} units (44 px)`);
  console.log(`  own squares at 320 px: ${sides.map(([room, side]) => `${room} ${px(side)} px`).join(', ')}`);
});

// "What you see is what you tap": a tap on a room's furniture opens THAT room, also where the
// furniture rises over the floor of the room behind it. Only furniture really standing in front
// of it (in a nearer room) may take a part of it.
test('a tap on a room\'s furniture opens that room', () => {
  const hots = hotsOf(renderHouse(ROOMS, OPTS).svg);
  const shares = [];
  for (const key of KEYS) {
    for (const part of ROOMS[key].parts.filter((pt) => pt.hit?.length)) {
      const pts = samples(partOutline(key, part));
      const own = pts.filter((pt) => ownerAt(hots, pt) === key).length / pts.length;
      const lost = pts.filter((pt) => ownerAt(hots, pt) === null).length / pts.length;
      shares.push([`${key}/${part.id}`, own]);
      // most of it; what a nearer room's furniture stands in front of goes to that room (today the
      // least: Fabrics' notions table, 60%, behind the Tools shelf and dress form)
      assert.ok(own > 0.5, `${key} ${part.id}: only ${(own * 100).toFixed(0)}% of it opens ${key}`);
      assert.ok(lost <= 0.02, `${key} ${part.id}: ${(lost * 100).toFixed(0)}% of it opens nothing`);
    }
  }
  assert.ok(shares.length >= 14, 'every linked part of the four rooms was checked');
  console.log(`  own room: ${shares.map(([name, own]) => `${name} ${Math.round(own * 100)}%`).join(', ')}`);
  // the cases of the review: the machine, the laptop, the fabric shelf, the tote
  const at = (key, id) => shares.find(([name]) => name === `${key}/${id}`)[1];
  assert.ok(at('tools', 'sewing-table') >= 0.95, 'the sewing machine opens Tools');
  assert.ok(at('setup', 'laptop') >= 0.95, 'the laptop opens My Setup');
  assert.ok(at('fabrics', 'fabric-shelf') >= 0.95, 'the fabric shelf opens Fabrics');
  assert.ok(at('projects', 'project-tote-bag') >= 0.95, 'the tote opens Projects');
});

test('a tap on a room\'s label opens that room', () => {
  const { svg } = renderHouse(ROOMS, OPTS);
  const hots = hotsOf(svg);
  const pills = labelsOf(svg);
  for (const [i, key] of KEYS.entries()) {
    const hot = hots.find((h) => h.room === key);
    assert.deepEqual(hot.pills, [{ x: pills[i].x, y: pills[i].y, w: pills[i].w, h: pills[i].h }], `${key}: the link covers its pill`);
    const { x, y, w, h } = pills[i];
    for (const pt of [[x + w / 2, y + h / 2], [x + h / 2, y + h / 2], [x + w - h / 2, y + h / 2]]) {
      assert.equal(ownerAt(hots, pt), key, `${key}: a tap on its pill at ${pt}`);
    }
  }
});

test('a tap on an outer wall opens the room it belongs to; Tools has none', () => {
  const hots = hotsOf(renderHouse(ROOMS, OPTS).svg);
  const top = HOUSE.wallH - 2; // high on the wall, over the furniture
  const [w, d] = HOUSE.cell;
  const walls = [
    ['projects', [w / 2, 0, top]], ['projects', [0, d / 2, top]],
    ['fabrics', [w + w / 2, 0, top]], ['setup', [0, d + d / 2, top]],
  ];
  for (const [key, q] of walls) assert.equal(ownerAt(hots, project(q)), key, `${key}: its wall at ${q}`);
  // one shape per linked part, plus one per outer wall: Projects 2, Fabrics 1, Setup 1, Tools none
  const WALLS = { projects: 2, fabrics: 1, setup: 1, tools: 0 };
  for (const hot of hots) {
    assert.equal(hot.pads.length, ROOMS[hot.room].parts.filter((pt) => pt.hit?.length).length + WALLS[hot.room], hot.room);
  }
  // above the walls and outside the house, away from the labels: nothing
  assert.equal(ownerAt(hots, project([w, 0, HOUSE.wallH + 12])), null);
  assert.equal(ownerAt(hots, project([2 * w + 10, 2 * d, 0])), null);
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

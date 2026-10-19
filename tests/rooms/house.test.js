import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { project } from '../../src/lib/anatomy/iso.js';
import { PALETTE, painter, shade, num } from '../../src/lib/rooms/paint.js';
import { FLOOR_THICK, textEm, hitPieces } from '../../src/lib/rooms/render.js';
import { HOUSE, HOUSE_ASPECT, renderHouse } from '../../src/lib/rooms/house.js';
import { ROOMS } from '../../src/lib/rooms/rooms.js';
import { LOCALES, pageUrl, t } from '../../src/i18n/index.js';
import { THUMB_PX, PHONE_PX, inside } from './helpers.js';
import { shapesOf, grid } from './seen.js';

// HOUSE.at: the back row left to right, then the front row (layout A of the spec «Гайды», 9)
const KEYS = ['projects', 'guides', 'fabrics', 'setup', 'about', 'tools'];
// back to front, as drawn and as linked (a nearer room is drawn, and linked, after the rooms behind it)
const DRAWN = ['projects', 'setup', 'guides', 'about', 'fabrics', 'tools'];
const LABELS = { projects: 'Projects', guides: 'Guides', fabrics: 'Fabrics', setup: 'My Setup', about: 'About', tools: 'Tools' };
const HREFS = {
  projects: '/projects.html', guides: '/guides.html', fabrics: '/fabrics.html',
  setup: '/setup.html', about: '/about.html', tools: '/tools.html',
};
const OPTS = { prefix: 'house', labels: LABELS, hrefs: HREFS };

// the narrowest phones: the house is as wide as the screen (styles.css), its labels must stay readable
const READABLE = [[320, 9], [375, 10]]; // [screen css px, smallest label text css px]

const POLY = /<polygon class="(house__hit|house__pad)" points="([^"]*)" fill="transparent"\/>/g;
const PILL_PAD = /<rect class="house__pad" x="([^"]*)" y="([^"]*)" width="([^"]*)" height="([^"]*)" rx="([^"]*)"[^>]*fill="transparent"\/>/g;

/**
  The printed room links of a house svg, in document order (later = on top):
  { attrs, room, href, label, zoom, floors, pads, pills, rest }
    floors  the styled polygons (house__hit) — the room's floor
    pads    the always-transparent polygons (house__pad): walls, furniture
    pills   the transparent rounded rects over the labels: { x, y, w, h, rx }
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
      pills: [...inner.matchAll(PILL_PAD)].map(([, x, y, w, h, rx]) => ({ x: +x, y: +y, w: +w, h: +h, rx: +rx })),
      rest: inner.replace(POLY, '').replace(PILL_PAD, ''),
    };
  });
}

/** Does a tap at screen point `pt` land in this link (any of its shapes)? */
const reaches = (hot, pt) =>
  hot.floors.some((poly) => inPoly(poly, pt)) || hot.pads.some((poly) => inPoly(poly, pt)) || hot.pills.some((pill) => inPill(pill, pt));

/** Is the point on the pill { x, y, w, h, rx } — its rounded shape, as the browser hit-tests the rect? */
function inPill({ x, y, w, h, rx }, [px, py]) {
  const r = Math.min(rx, w / 2, h / 2);
  const [cx, cy] = [Math.min(Math.max(px, x + r), x + w - r), Math.min(Math.max(py, y + r), y + h - r)];
  return (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
}

/** `inside`, after a quick look at the polygon's screen box (the 320 px test asks this ~1.3 million times). */
const BOXES = new WeakMap();
function inPoly(poly, pt) {
  let b = BOXES.get(poly);
  if (!b) {
    const xs = poly.map((q) => q[0]);
    const ys = poly.map((q) => q[1]);
    b = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    BOXES.set(poly, b);
  }
  return pt[0] >= b[0] && pt[0] <= b[1] && pt[1] >= b[2] && pt[1] <= b[3] && inside(poly, pt);
}

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

/** The screen outlines of a part in the house: the hull of each piece of its `hit` (render.js hitPieces), moved to its room's cell. */
const partOutlines = (key, part) => {
  const [ox, oy] = HOUSE.at[key];
  return hitPieces(part.hit).map((piece) => hullOf(piece.map(([x, y, z]) => project([x + ox, y + oy, z]))));
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

/** The printed label pills: { x, y, w, h, rx, text, fs } (fs: the font size of its text, viewBox units). */
function labelsOf(svg) {
  return [...svg.matchAll(/<g class="house__label" aria-hidden="true"><rect x="([^"]*)" y="([^"]*)" width="([^"]*)" height="([^"]*)" rx="([^"]*)"\/><text([^>]*)>([^<]*)<\/text><\/g>/g)]
    .map(([, x, y, w, h, rx, attrs, text]) => ({ x: +x, y: +y, w: +w, h: +h, rx: +rx, text, fs: Number(/ font-size="([^"]*)"/.exec(attrs)?.[1]) }));
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
/** A pane at the window's place inside its cell, wherever that is in the house (on a partition, say). */
const paneInCell = (key, { wall, from, to, z: [z0, z1] }) => {
  const [ox, oy] = HOUSE.at[key];
  const on = (a, z) => (wall === 'left' ? [ox, oy + a, z] : [ox + a, oy, z]);
  return [on(from, z0), on(to, z0), on(to, z1), on(from, z1)].map((q) => project(q).map(num).join(',')).join(' ');
};
const PANE = new RegExp(`<polygon points="([^"]*)" fill="${PALETTE.glass}" stroke="${PALETTE.woodDark}" stroke-width="0.8"`, 'g');
const panesOf = (svg) => [...svg.matchAll(PANE)].map((m) => m[1]);

/** Two rects { x, y, w, h } overlap (touching edges do not)? */
const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** The body of the first css rule with exactly this selector. */
const ruleOf = (css, selector) => {
  const at = css.indexOf(`${selector} {`);
  assert.ok(at >= 0, `styles.css: no rule "${selector}"`);
  return css.slice(css.indexOf('{', at) + 1, css.indexOf('}', at));
};
const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('the house is the six rooms of the site, 3 × 2, each a cell of it', () => {
  assert.deepEqual(HOUSE.cell, [60, 50]);
  assert.equal(HOUSE.cols, 3);
  assert.equal(HOUSE.rows, 2);
  assert.equal(HOUSE.wallH, 40);
  assert.equal(HOUSE.partitionH, 7);
  // layout A: Projects in the far corner, Guides, Fabrics at the back; My Setup, About, Tools in front
  assert.deepEqual(HOUSE.at, { projects: [0, 0], guides: [60, 0], fabrics: [120, 0], setup: [0, 50], about: [60, 50], tools: [120, 50] });
  assert.deepEqual(Object.keys(HOUSE.at), KEYS);
  assert.deepEqual(Object.keys(HOUSE.label).sort(), [...KEYS].sort(), 'a label for every room');
  // ROOMS may hold more rooms than the house; every room of the house is one of them, a cell big
  for (const key of KEYS) assert.ok(key in ROOMS, `${key} is in ROOMS`);
  for (const key of KEYS) assert.deepEqual(ROOMS[key].size, [...HOUSE.cell, HOUSE.wallH], key);
  // every cell of the grid holds exactly one room
  const [cw, cd] = HOUSE.cell;
  const cells = Object.values(HOUSE.at).map(([x, y]) => `${x / cw},${y / cd}`).sort();
  const grid = [];
  for (let c = 0; c < HOUSE.cols; c++) for (let r = 0; r < HOUSE.rows; r++) grid.push(`${c},${r}`);
  assert.deepEqual(cells, grid.sort());
});

test('aspect matches the view', () => {
  const { viewBox, rooms } = renderHouse(ROOMS, OPTS);
  assert.equal(HOUSE_ASPECT, viewBox[2] / viewBox[3], 'worked out from the view, not typed in');
  for (const { key, zoom } of rooms) assert.ok(Math.abs(zoom[2] / zoom[3] - HOUSE_ASPECT) <= 0.01, `${key}: the zoom keeps the aspect`);
  // the page keeps the space before the svg paints: the svg carries the aspect of its own viewBox …
  const astro = read('src/components/House.astro');
  assert.match(astro, /aspect-ratio:\s*\$\{viewBox\[2\]\}\s*\/\s*\$\{viewBox\[3\]\}/, 'House.astro: aspect-ratio from the viewBox');
  // … and no number typed into the stylesheet can go stale
  assert.ok(!/aspect-ratio/.test(ruleOf(read('src/styles/styles.css'), '.house__svg')), 'styles.css: no aspect-ratio for .house__svg');
});

test('six rooms link to their pages, back to front', () => {
  const { svg } = renderHouse(ROOMS, OPTS);
  const hots = hotsOf(svg);
  assert.equal((svg.match(/class="house__hot"/g) ?? []).length, 6, 'exactly six room links');
  assert.deepEqual(hots.map((h) => h.room), DRAWN);
  // back to front: a room's neighbour in front (+x or +y) comes after it
  const [cw, cd] = HOUSE.cell;
  for (const a of KEYS) {
    for (const b of KEYS) {
      const [ax, ay] = HOUSE.at[a];
      const [bx, by] = HOUSE.at[b];
      if ((bx === ax + cw && by === ay) || (bx === ax && by === ay + cd)) {
        assert.ok(DRAWN.indexOf(a) < DRAWN.indexOf(b), `${b} is in front of ${a}: linked after it`);
      }
    }
  }
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
    assert.deepEqual(got.map((h) => h.href), DRAWN.map((k) => pageUrl(k, lang)), lang);
  }
  assert.equal(pageUrl('setup', 'ru'), '/ru/setup.html');
  assert.equal(pageUrl('guides', 'ru'), '/ru/guides.html');
  assert.equal(pageUrl('about', 'de'), '/de/about.html');
});

test('no product links in the house', () => {
  const { svg } = renderHouse(ROOMS, OPTS);
  assert.ok(!svg.includes('room__hot'), 'no tap areas of the rooms');
  assert.ok(!svg.includes('room__part'), 'nothing in a room is a link');
  assert.ok(!svg.includes('#product-'), 'no product cards');
  assert.ok(!svg.includes('href="#'), 'no sections of the classroom');
  assert.ok(!svg.includes('amazon.'), 'nothing links to Amazon');
  assert.equal((svg.match(/<a /g) ?? []).length, 6, 'the six rooms are the only links');
  assert.equal((svg.match(/ href="/g) ?? []).length, 6);
});

test('every room is drawn in its own group, back to front', () => {
  const { svg } = renderHouse(ROOMS, OPTS);
  const groups = [...svg.matchAll(/<g class="house__room" data-room="([^"]*)">/g)].map((m) => m[1]);
  assert.deepEqual(groups, DRAWN);
});

test('zoom frames each room', () => {
  const { svg, viewBox, rooms } = renderHouse(ROOMS, OPTS);
  assert.deepEqual(rooms.map((r) => r.key), DRAWN);
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
});

test('labels come from the caller', () => {
  const labels = { projects: 'Proj & "Co"', guides: 'Уроки', fabrics: 'Ткани', setup: 'Il mio studio', about: 'À propos', tools: '<Tools>' };
  const { svg } = renderHouse(ROOMS, { ...OPTS, labels });
  const pills = labelsOf(svg);
  const printed = { projects: 'Proj &amp; &quot;Co&quot;', guides: 'Уроки', fabrics: 'Ткани', setup: 'Il mio studio', about: 'À propos', tools: '&lt;Tools&gt;' };
  assert.deepEqual(pills.map((l) => l.text), KEYS.map((k) => printed[k]));
  assert.ok(!svg.includes('<Tools>'), 'escaped');
  assert.deepEqual(hotsOf(svg).map((h) => h.label), DRAWN.map((k) => printed[k]));
  // each pill sits at its world point outside the house (HOUSE.label)
  for (const [i, key] of KEYS.entries()) {
    const [cx, cy] = project(HOUSE.label[key]);
    const { x, y, w, h } = pills[i];
    assert.ok(Math.abs(x + w / 2 - cx) < 0.02 && Math.abs(y + h / 2 - cy) < 0.02, `${key}: pill centred on its point`);
  }
});

test('every language\'s labels fit in the picture, hold their text and keep apart', () => {
  for (const lang of LOCALES) {
    const { ui } = t(lang);
    const labels = Object.fromEntries(KEYS.map((k) => [k, ui.nav[k]]));
    const { svg, viewBox: [vx, vy, vw, vh] } = renderHouse(ROOMS, { ...OPTS, labels });
    const pills = labelsOf(svg);
    assert.equal(pills.length, 6, lang);
    for (const [i, { x, y, w, h, text, fs }] of pills.entries()) {
      assert.equal(text, labels[KEYS[i]], `${lang}: the name of the menu`);
      assert.ok(x >= vx && y >= vy && x + w <= vx + vw && y + h <= vy + vh, `${lang} "${text}": pill outside the viewBox`);
      // the text (its width never under-guessed: render.js textEm) with half an em of air at each end
      assert.ok(w >= (textEm(text) + 1) * fs, `${lang} "${text}": the pill is too narrow for its text`);
      assert.ok(h >= 1.5 * fs, `${lang} "${text}": the pill is too low for its text`);
    }
    for (const [i, a] of pills.entries()) {
      for (const b of pills.slice(i + 1)) assert.ok(!overlap(a, b), `${lang}: "${a.text}" and "${b.text}" overlap`);
    }
    // a label hangs outside the rooms: it hides no furniture (no part's hit hull), every quarter unit
    for (const { x, y, w, h, text } of pills) {
      for (const [key, part, poly] of FURNITURE) {
        let hidden = false;
        for (let px = x; px <= x + w && !hidden; px += 0.25) {
          for (let py = y; py <= y + h && !hidden; py += 0.25) hidden = inPoly(poly, [px, py]);
        }
        assert.ok(!hidden, `${lang} "${text}" hides ${key}/${part.id}`);
      }
    }
  }
});

/** Every part with a hit in the house: [key, part, a screen outline of it] — one per piece. */
const FURNITURE = KEYS.flatMap((key) => ROOMS[key].parts.filter((pt) => pt.hit?.length).flatMap((part) => partOutlines(key, part).map((poly) => [key, part, poly])));

test('labels are readable on a phone', () => {
  const { svg, viewBox: [, , vw] } = renderHouse(ROOMS, OPTS);
  const sizes = [...new Set(labelsOf(svg).map((l) => l.fs))];
  assert.equal(sizes.length, 1, 'one font size for every label, printed on its text');
  const [fs] = sizes;
  assert.ok(fs > 0, 'a font size');
  // the house is as wide as the phone: a label's text is fs × screen / viewBox width css px
  const px = READABLE.map(([screen]) => [screen, (fs * screen) / vw]);
  for (const [[screen, least], [, got]] of READABLE.map((r, i) => [r, px[i]])) {
    assert.ok(got >= least, `${got.toFixed(2)} px on a ${screen} px phone, at least ${least}`);
  }
  console.log(`  label text: ${px.map(([screen, got]) => `${got.toFixed(1)} px at ${screen}`).join(', ')}`);
  // the stylesheet must not set it over the svg's own size
  const rule = ruleOf(read('src/styles/styles.css'), '.house__label text');
  assert.ok(!/font-size|font:/.test(rule), `styles.css .house__label text sets its own font size: ${rule.trim()}`);
});

test('windows only on outer walls', () => {
  // the models: the window walls the house relies on
  assert.equal(ROOMS.projects.window.wall, 'back');
  assert.equal(ROOMS.guides.window.wall, 'back');
  assert.equal(ROOMS.fabrics.window.wall, 'back');
  assert.equal(ROOMS.setup.window.wall, 'left');
  assert.equal(ROOMS.about.window.wall, 'left');
  assert.equal(ROOMS.tools.window.wall, 'left');

  const { svg } = renderHouse(ROOMS, OPTS);
  const at = (key) => HOUSE.at[key];
  const { projects, guides, fabrics, setup, about, tools } = ROOMS;
  const kept = [
    pane('back', projects.window.from + at('projects')[0], projects.window.to + at('projects')[0], projects.window.z),
    pane('back', guides.window.from + at('guides')[0], guides.window.to + at('guides')[0], guides.window.z),
    pane('back', fabrics.window.from + at('fabrics')[0], fabrics.window.to + at('fabrics')[0], fabrics.window.z),
    pane('left', setup.window.from + at('setup')[1], setup.window.to + at('setup')[1], setup.window.z),
  ];
  assert.deepEqual(panesOf(svg).sort(), [...kept].sort(), 'Projects, Guides and Fabrics on the back wall, Setup on the left wall');
  // the light of those four windows on their floors (render.js lightOnFloor: the only blurred polygon), no other
  assert.equal(svg.match(/<polygon [^>]*filter="url\(#house-blur\)"/g)?.length ?? 0, 4, 'four patches of window light');

  // About and Tools have no outer wall: their windows are neither on the partition they would face
  // nor anywhere else
  for (const [key, model] of [['about', about], ['tools', tools]]) {
    assert.ok(!svg.includes(paneInCell(key, model.window)), `no ${key} window on the partition`);
    assert.ok(!svg.includes(pane(model.window.wall, model.window.from, model.window.to, model.window.z)), `no ${key} window at its page place`);
  }
});

test('windows only on outer walls: the rule, for any wall', () => {
  const toy = (key, wall) => ({ key, size: [60, 50, 40], window: { wall, from: 10, to: 30, z: [20, 32] }, parts: [] });
  const house = (wall) => panesOf(renderHouse(Object.fromEntries(KEYS.map((k) => [k, toy(k, wall)])), OPTS).svg).sort();
  // a left-wall window survives where the room's left wall is the house's (x = 0): Projects, Setup
  assert.deepEqual(house('left'), [pane('left', 10, 30, [20, 32]), pane('left', 60, 80, [20, 32])].sort());
  // a back-wall window where the room's back wall is the house's (y = 0): Projects, Guides, Fabrics
  assert.deepEqual(house('back'), [pane('back', 10, 30, [20, 32]), pane('back', 70, 90, [20, 32]), pane('back', 130, 150, [20, 32])].sort());
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

test('every room link keeps a big tap area on a 320 px phone, in every language', () => {
  // the labels are the only shapes that change with the language (a longer name, a wider pill)
  for (const lang of LOCALES) {
    const { ui } = t(lang);
    const labels = Object.fromEntries(KEYS.map((k) => [k, ui.nav[k]]));
    const { svg, viewBox: [vx, vy, vw, vh] } = renderHouse(ROOMS, { ...OPTS, labels });
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
    for (const [room, side] of sides) assert.ok(side >= thumb, `${lang} ${room}: own square ${side.toFixed(1)} < ${thumb.toFixed(1)} units (44 px)`);
    console.log(`  own squares at 320 px, ${lang}: ${sides.map(([room, side]) => `${room} ${px(side)} px`).join(', ')}`);
  }
});

// "What you see is what you tap": a tap on a room's furniture opens THAT room, also where the
// furniture rises over the floor of the room behind it. Only furniture really standing in front
// of it (in a nearer room) may take a part of it.
test('a tap on a room\'s furniture opens that room', () => {
  const hots = hotsOf(renderHouse(ROOMS, OPTS).svg);
  const shares = [];
  for (const key of KEYS) {
    for (const part of ROOMS[key].parts.filter((pt) => pt.hit?.length)) {
      const pts = partOutlines(key, part).flatMap((poly) => samples(poly));
      const own = pts.filter((pt) => ownerAt(hots, pt) === key).length / pts.length;
      const lost = pts.filter((pt) => ownerAt(hots, pt) === null).length / pts.length;
      shares.push([`${key}/${part.id}`, own]);
      // most of it; what a nearer room's furniture stands in front of goes to that room
      assert.ok(own > 0.5, `${key} ${part.id}: only ${(own * 100).toFixed(0)}% of it opens ${key}`);
      assert.ok(lost <= 0.02, `${key} ${part.id}: ${(lost * 100).toFixed(0)}% of it opens nothing`);
    }
  }
  // the four rooms of before (16 parts), the four zones of the classroom, the six pieces of the corner
  assert.ok(shares.length >= 26, `every part with a hit of the six rooms was checked (${shares.length})`);
  for (const key of KEYS) assert.ok(shares.some(([name]) => name.startsWith(`${key}/`)), `${key}: parts checked`);
  console.log(`  own room: ${shares.map(([name, own]) => `${name} ${Math.round(own * 100)}%`).join(', ')}`);
  // the cases of the review: the machine, the laptop, the fabric shelf, the tote; the classroom's
  // design wall (on the outer wall) and the corner's armchair (in the middle of the house)
  const at = (key, id) => shares.find(([name]) => name === `${key}/${id}`)[1];
  assert.ok(at('tools', 'sewing-table') >= 0.95, 'the sewing machine opens Tools');
  assert.ok(at('setup', 'laptop') >= 0.95, 'the laptop opens My Setup');
  assert.ok(at('fabrics', 'fabric-shelf') >= 0.95, 'the fabric shelf opens Fabrics');
  assert.ok(at('projects', 'project-tote-bag') >= 0.95, 'the tote opens Projects');
  assert.ok(at('guides', 'design-wall') >= 0.95, 'the design wall opens Guides');
  assert.ok(at('about', 'armchair') >= 0.95, 'the armchair opens About');
});

/* ---------- an outline is its furniture, not the air round it ---------- */

const SEEN_STEP = 0.25; // viewBox units
const [C30, S30] = [Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)];

/** The room whose floor is drawn at the screen point [sx, sy] (z = 0: project() undone), or null. */
function floorAt([sx, sy]) {
  const [x, y] = [(sx / C30 + sy / S30) / 2, (sy / S30 - sx / C30) / 2];
  const [w, d] = HOUSE.cell;
  return KEYS.find((key) => {
    const [ox, oy] = HOUSE.at[key];
    return x >= ox && x < ox + w && y >= oy && y < oy + d;
  }) ?? null;
}

/**
  What the eye sees over a house svg (seen.js: the last shape painted over a point): a grid of a room
  key where a room's furniture or its label is seen, 'floor' where the floor slab or its boards are
  (whose room: floorAt), 'wall' on the walls and the partitions (they stand between rooms), null on
  the background.
*/
function seenOf(svg, viewBox) {
  const seen = grid(viewBox, SEEN_STEP);
  const boards = shade(PALETTE.floor, -0.12);
  let label = -1;
  for (const { tag, shape, at } of shapesOf(svg)) {
    const room = at.find((g) => g.class === 'house__room')?.room;
    if (room) seen.paint(shape, room);
    else if (at.some((g) => g.class === 'house__label')) seen.paint(shape, KEYS[++label]); // a label is one rect, in the order of KEYS
    else if (tag.includes('url(#house-bg)')) continue;
    else seen.paint(shape, tag.includes(`stroke="${PALETTE.floor}"`) || tag.includes(`stroke="${boards}"`) ? 'floor' : 'wall');
  }
  assert.equal(label, KEYS.length - 1, 'every label painted');
  return seen;
}

/**
  The air in the outlines of the house's furniture: per part with a hit ('room/part'), the side
  (viewBox units) of the largest square in one of its outlines (a piece's hull) where ANOTHER room is
  seen — its furniture or its floor —, yet a tap opens the part's room, and the part's own drawing is
  not under it (a nearer room's furniture standing over it is that room's business). → Map
*/
function airOf(rooms) {
  const { svg, viewBox } = renderHouse(rooms, OPTS);
  const hots = hotsOf(svg);
  const seen = seenOf(svg, viewBox);
  const air = new Map();
  for (const key of KEYS) {
    const [dx, dy] = project([...HOUSE.at[key], 0]);
    for (const part of rooms[key].parts.filter((pt) => pt.hit?.length)) {
      const own = shapesOf(part.draw(painter('air'))).map((s) => s.shape);
      const isAir = (pt, value) => {
        const room = value === 'floor' ? floorAt(pt) : value;
        return !!room && room !== 'wall' && room !== key && ownerAt(hots, pt) === key && !own.some((s) => s.covers([pt[0] - dx, pt[1] - dy]));
      };
      let best = 0;
      for (const poly of partOutlines(key, part)) {
        const [c0, r0] = seen.cell([Math.min(...poly.map((q) => q[0])), Math.min(...poly.map((q) => q[1]))]);
        const [c1, r1] = seen.cell([Math.max(...poly.map((q) => q[0])), Math.max(...poly.map((q) => q[1]))]);
        let prev = [];
        for (let r = r0; r <= r1; r++) {
          const row = [];
          for (let c = c0; c <= c1; c++) {
            const pt = seen.pt(c, r);
            const i = c - c0;
            row[i] = inside(poly, pt) && isAir(pt, seen.get(c, r)) ? (r > r0 && i ? Math.min(prev[i], row[i - 1], prev[i - 1]) : 0) + 1 : 0;
            best = Math.max(best, row[i]);
          }
          prev = row;
        }
      }
      air.set(`${key}/${part.id}`, best ? (best - 1) * SEEN_STEP : 0);
    }
  }
  return air;
}

// The largest square of air an outline may hold: a hairline (the gaps between a plant's leaves, the
// rounding at an edge), 2.4 px on a 320 px phone — far under a fingertip.
const AIR = 2;
// Outlines older than this test with a bigger square of air, pinned at their size today (they may
// shrink, not grow): trim them as the ones below were trimmed, then take them off the list.
const AIR_KNOWN = new Map([['guides/sewing-table', 3], ['setup/desk', 3], ['fabrics/batting-rolls', 2.5]]);

// The converse of the test above, and of about.test's "every piece of furniture has a hit that
// covers it": an outline must be its furniture, not the air round it. Through the air in an outline
// the eye sees the room behind, but a tap there opens the room in front — the review of 2026-10-19
// found the softboxes' one hull over the Projects shelf, the box round the corner's lamp over My
// Setup's floor, the Tools machine's and the corner screen's over the classroom's cutting table.
// Where one hull would take in air, the hit comes in pieces (render.js hitPieces).
test('an outline of furniture is its own drawing, not another room seen through the air in it', () => {
  const air = airOf(ROOMS);
  assert.ok(air.size >= 26, `every part with a hit of the six rooms was checked (${air.size})`);
  for (const [id, side] of air) {
    const limit = AIR_KNOWN.get(id) ?? AIR;
    assert.ok(side <= limit, `${id}: a square of another room ${side} units wide opens ${id.split('/')[0]} (at most ${limit})`);
  }
  for (const [id, side] of AIR_KNOWN) assert.ok(air.get(id) > AIR, `${id} holds ${air.get(id)} units of air now: take it off AIR_KNOWN`);
  console.log(`  air in outlines: ${[...air].filter(([, side]) => side > 0).sort((a, b) => b[1] - a[1]).map(([id, side]) => `${id} ${side}`).join(', ')}`);
});

// …and the test can see it: one hull over the pieces of the softboxes, the lamp or the Tools table
// takes the air back in. (The corner screen gained most by being outlined as drawn: as one hull its
// pieces hold 2 units of air, at the limit; in pieces, none.)
test('an outline of furniture: one hull over the pieces would hold the air again', () => {
  const merged = (key, id) => ({
    ...ROOMS,
    [key]: { ...ROOMS[key], parts: ROOMS[key].parts.map((part) => (part.id === id ? { ...part, hit: hitPieces(part.hit).flat() } : part)) },
  });
  const sides = [['setup', 'softboxes'], ['about', 'lamp'], ['tools', 'sewing-table']].map(([key, id]) => {
    assert.ok(hitPieces(ROOMS[key].parts.find((part) => part.id === id).hit).length > 1, `${key}/${id} comes in pieces`);
    return [`${key}/${id}`, airOf(merged(key, id)).get(`${key}/${id}`)];
  });
  console.log(`  air as one hull: ${sides.map(([id, side]) => `${id} ${side}`).join(', ')}`);
  for (const [id, side] of sides) assert.ok(side > AIR, `${id} as one hull: ${side} units of air`);
});

// A label is painted over every room, so ALL of it opens its own room: no shape of a link that comes
// later (a nearer room's floor, slab edge, furniture or label) may reach under it. The whole pill as
// the browser hit-tests it (its rounded ends), every tenth of a unit, in every language.
test('a tap anywhere on a room\'s label opens that room, in every language', () => {
  const lost = [];
  for (const lang of LOCALES) {
    const labels = Object.fromEntries(KEYS.map((k) => [k, t(lang).ui.nav[k]]));
    const { svg } = renderHouse(ROOMS, { ...OPTS, labels });
    const hots = hotsOf(svg);
    const pills = labelsOf(svg);
    for (const [i, key] of KEYS.entries()) {
      const { x, y, w, h, rx } = pills[i];
      const at = hots.findIndex((hot) => hot.room === key);
      assert.deepEqual(hots[at].pills, [{ x, y, w, h, rx }], `${lang} ${key}: the link covers its pill`);
      // its own link reaches all of the pill: a tap there opens another room only if a LATER link reaches it too
      const later = hots.slice(at + 1);
      let all = 0;
      const away = {};
      for (let px = x; px <= x + w; px += 0.1) {
        for (let py = y; py <= y + h; py += 0.1) {
          if (!inPill(pills[i], [px, py])) continue;
          all++;
          const owner = ownerAt(later, [px, py]);
          if (owner) away[owner] = (away[owner] ?? 0) + 1;
        }
      }
      assert.ok(all > 1000, `${lang} ${key}: the pill was sampled`);
      const n = Object.values(away).reduce((a, b) => a + b, 0);
      if (n) lost.push(`${lang} ${key}: ${((100 * n) / all).toFixed(2)}% opens ${Object.keys(away).join(', ')}`);
    }
  }
  assert.deepEqual(lost, [], 'every point of every label opens its own room');
});

test('a tap on an outer wall opens the room it belongs to; About and Tools have none', () => {
  const hots = hotsOf(renderHouse(ROOMS, OPTS).svg);
  const top = HOUSE.wallH - 2; // high on the wall, over the furniture
  const [w, d] = HOUSE.cell;
  const walls = [
    ['projects', [w / 2, 0, top]], ['projects', [0, d / 2, top]],
    ['guides', [w + w / 2, 0, top]], ['fabrics', [2 * w + w / 2, 0, top]],
    ['setup', [0, d + d / 2, top]],
  ];
  for (const [key, q] of walls) assert.equal(ownerAt(hots, project(q)), key, `${key}: its wall at ${q}`);
  // the edge of a room's floor where it is the edge of the house (the slab seen from the side, under
  // the floor, above the label): the front row at the front, the right column at the right
  const low = -FLOOR_THICK / 2;
  const edges = [
    ['setup', [w / 2, 2 * d, low]], ['about', [w + w / 4, 2 * d, low]], ['about', [w + (3 * w) / 4, 2 * d, low]],
    ['tools', [2 * w + w / 2, 2 * d, low]], ['tools', [3 * w, d + d / 2, low]], ['fabrics', [3 * w, d / 2, low]],
  ];
  for (const [key, q] of edges) assert.equal(ownerAt(hots, project(q)), key, `${key}: the edge of its floor at ${q}`);
  // one shape per piece of a part's hit, plus one per outer wall and one per edge of the slab
  const SIDES = { projects: 2, guides: 1, fabrics: 1 + 1, setup: 1 + 1, about: 0 + 1, tools: 0 + 2 };
  for (const hot of hots) {
    assert.equal(hot.pads.length, ROOMS[hot.room].parts.flatMap((pt) => hitPieces(pt.hit)).length + SIDES[hot.room], hot.room);
  }
  // above the back wall between two labels, and outside the house past its right corner: nothing
  assert.equal(ownerAt(hots, project([w / 2, -6, HOUSE.wallH + 8])), null);
  assert.equal(ownerAt(hots, project([3 * w + 4, -6, -FLOOR_THICK - 4])), null);
});

test('a room that does not fit its cell, or a missing label or link, fails loudly', () => {
  assert.throws(() => renderHouse({ ...ROOMS, tools: { ...ROOMS.tools, size: [70, 50, 40] } }, OPTS), /house: room "tools" is 70 × 50 × 40/);
  const { about, ...five } = ROOMS;
  assert.ok(about);
  assert.throws(() => renderHouse(five, OPTS), /house: no room "about"/);
  assert.throws(() => renderHouse(ROOMS), /house: no label for "projects"/);
  assert.throws(() => renderHouse(ROOMS, { ...OPTS, labels: { ...LABELS, guides: undefined } }), /house: no label for "guides"/);
  assert.throws(() => renderHouse(ROOMS, { ...OPTS, hrefs: { ...HREFS, fabrics: '' } }), /house: no link for "fabrics"/);
});

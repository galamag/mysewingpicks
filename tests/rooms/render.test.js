import { test } from 'node:test';
import assert from 'node:assert/strict';
import { project } from '../../src/lib/anatomy/iso.js';
import { PALETTE, painter } from '../../src/lib/rooms/paint.js';
import {
  ROOM_ASPECT, MIN_HIT, WALL_THICK, FLOOR_THICK, renderRoom, roomParts,
} from '../../src/lib/rooms/render.js';

// A toy room: a desk and a laptop that link somewhere, a chair that does not.
const toy = {
  key: 'toy',
  size: [60, 50, 40],
  window: { wall: 'left', from: 12, to: 34, z: [16, 32] },
  parts: [
    {
      id: 'desk',
      draw: (p) => p.box(8, 6, 0, 40, 20, 22, PALETTE.wood),
      target: { product: 'x' },
      hit: [[8, 6, 22], [48, 6, 22], [48, 26, 22], [8, 26, 22], [8, 6, 0], [48, 26, 0]],
    },
    {
      id: 'laptop',
      draw: (p) => p.box(22, 12, 22, 12, 8, 1, PALETTE.metal),
      target: { product: 'y' },
      hit: [[28, 16, 23]], // a single point: the area must be grown to a thumb size
    },
    {
      id: 'chair',
      draw: (p) => p.box(24, 30, 0, 10, 10, 12, PALETTE.sage),
    },
  ],
};

const LINKS = {
  x: { href: '#product-x', label: 'X', kind: 'product' },
  y: { href: '#product-y', label: 'Y', kind: 'product' },
};
const resolve = (target) => LINKS[target.product] ?? null;

/** The tap areas of an svg, in document order: part id + polygon points. */
function anchors(svg) {
  return [...svg.matchAll(/<a class="room__hot"[^>]*data-part="([^"]*)"[^>]*><polygon class="room__hit" points="([^"]*)" fill="transparent"\/><\/a>/g)]
    .map((m) => ({ part: m[1], points: m[2].split(' ').map((q) => q.split(',').map(Number)) }));
}

const extent = (points, axis) => {
  const v = points.map((q) => q[axis]);
  return Math.max(...v) - Math.min(...v);
};

test('targets become labelled links', () => {
  const { svg, hots } = renderRoom(toy, { prefix: 'room-toy', resolve });
  assert.ok(svg.includes('href="#product-x"'));
  assert.ok(svg.includes('aria-label="X"'));
  assert.ok(svg.includes('href="#product-y"'));
  assert.equal(hots.length, 2);
  assert.deepEqual(hots.map((h) => h.part).sort(), ['desk', 'laptop']);
  const desk = hots.find((h) => h.part === 'desk');
  assert.deepEqual(desk, { part: 'desk', kind: 'product', href: '#product-x', label: 'X' });
});

test('decoration gets no link', () => {
  const { svg } = renderRoom(toy, { prefix: 'room-toy', resolve });
  assert.ok(!anchors(svg).some((a) => a.part === 'chair'));
  assert.ok(!svg.includes('data-part="chair"'));

  // a resolver that knows nothing turns every part into decoration
  const bare = renderRoom(toy, { prefix: 'room-toy', resolve: () => null });
  assert.ok(!bare.svg.includes('room__hot'));
  assert.ok(!bare.svg.includes('room__part'));
  assert.equal(bare.hots.length, 0);

  // a part named in `inactive` is drawn, but not linked
  const quiet = renderRoom(toy, { prefix: 'room-toy', resolve, inactive: new Set(['desk']) });
  assert.deepEqual(anchors(quiet.svg).map((a) => a.part), ['laptop']);
  assert.ok(!quiet.svg.includes('data-part="desk"'));
  assert.equal(quiet.hots.length, 1);
  // the drawing itself is untouched: only the tap area of the laptop is added
  assert.equal(quiet.svg.match(/<polygon/g).length, bare.svg.match(/<polygon/g).length + 1);
});

test('hit is at least minHit', () => {
  const eps = 1e-6;
  const { svg } = renderRoom(toy, { prefix: 'room-toy', resolve });
  const laptop = anchors(svg).find((a) => a.part === 'laptop');
  assert.ok(extent(laptop.points, 0) >= MIN_HIT - eps, 'x');
  assert.ok(extent(laptop.points, 1) >= MIN_HIT - eps, 'y');
  assert.equal(MIN_HIT, 14);

  const wide = renderRoom(toy, { prefix: 'room-toy', resolve, minHit: 30 });
  const big = anchors(wide.svg).find((a) => a.part === 'laptop');
  assert.ok(extent(big.points, 0) >= 30 - eps);
  assert.ok(extent(big.points, 1) >= 30 - eps);
});

test('hit is the hull of the projected points when it is big enough', () => {
  const { svg } = renderRoom(toy, { prefix: 'room-toy', resolve });
  const desk = anchors(svg).find((a) => a.part === 'desk');
  const xs = toy.parts[0].hit.map((q) => project(q)[0]);
  assert.ok(Math.abs(extent(desk.points, 0) - (Math.max(...xs) - Math.min(...xs))) < 0.02);
  assert.ok(desk.points.length >= 3);
});

/* Geometry of a printed tap area (a convex polygon, either winding). */
const cross = (a, b, q) => (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]);
const edges = (poly) => poly.map((a, i) => [a, poly[(i + 1) % poly.length]]);
const areaOf = (poly) => Math.abs(edges(poly).reduce((s, [a, b]) => s + a[0] * b[1] - b[0] * a[1], 0)) / 2;

/** The narrowest width of a convex polygon: for each edge, how far the polygon reaches from it. */
const narrowest = (poly) => Math.min(...edges(poly).map(([a, b]) =>
  Math.max(...poly.map((q) => Math.abs(cross(a, b, q)))) / Math.hypot(b[0] - a[0], b[1] - a[1])));

/** Does the polygon contain the rectangle [x0, x1] x [y0, y1] (within `tol`)? */
function contains(poly, [x0, x1, y0, y1], tol = 0.02) {
  const sign = Math.sign(edges(poly).reduce((s, [a, b]) => s + a[0] * b[1] - b[0] * a[1], 0));
  return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].every((q) =>
    edges(poly).every(([a, b]) => (sign * cross(a, b, q)) / Math.hypot(b[0] - a[0], b[1] - a[1]) >= -tol));
}

/** The screen box of a hit: [x0, x1, y0, y1]. */
function screenBox(hit) {
  const pts = hit.map(project);
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
}

/** Render one linked part with this hit and return its printed tap area. */
function tapAreaOf(hit, options = {}) {
  const room = { key: 'one', size: [60, 50, 40], parts: [{ id: 'p', draw: () => '', target: { product: 'x' }, hit }] };
  return anchors(renderRoom(room, { prefix: 'room-one', resolve, ...options }).svg)[0].points;
}

/** The tap-area guarantee: a minHit x minHit square around the hit's centre fits inside it. */
function assertThumb(name, hit, minHit = MIN_HIT) {
  const poly = tapAreaOf(hit, { minHit });
  const [x0, x1, y0, y1] = screenBox(hit);
  const [cx, cy, half] = [(x0 + x1) / 2, (y0 + y1) / 2, minHit / 2];
  assert.ok(contains(poly, [cx - half, cx + half, cy - half, cy + half]), `${name}: no thumb square around the centre`);
  assert.ok(areaOf(poly) >= minHit * minHit - 0.5, `${name}: area ${areaOf(poly)}`);
  assert.ok(narrowest(poly) >= minHit - 0.02, `${name}: narrowest width ${narrowest(poly)}`);
  return poly;
}

const THUMB_CASES = {
  'a point': [[28, 16, 23]],
  'a vertical line (width 0 on screen)': [[10, 10, 0], [10, 10, 40]],
  // three points in a line, over minHit on both axes: floating-point noise must not leave a flat "hull"
  'collinear points': [[10, 10, 0], [30, 10, 0], [50, 10, 0]],
  // a slanted line: two hull points, and its screen extent is not zero on either axis
  'a slanted line': [[10, 10, 0], [40, 20, 0]],
  // a 30 x 1 ruler: its screen box is big enough, but the shape is a sliver about 1 unit wide
  'a thin ruler': [[10, 10, 0], [40, 10, 0], [40, 11, 0], [10, 11, 0]],
  'a thin vertical strip': [[10, 10, 0], [10, 10, 40], [11, 10, 40], [11, 10, 0]],
};

for (const [name, hit] of Object.entries(THUMB_CASES)) {
  test(`tap area holds a thumb-size square: ${name}`, () => {
    assertThumb(name, hit);
    assertThumb(name, hit, 30);
  });
}

test('the thumb cases are the degenerate ones they claim to be', () => {
  // slanted: neither screen extent is zero, both are over minHit, so a bounding-box check alone would pass it
  const [x0, x1, y0, y1] = screenBox(THUMB_CASES['a slanted line']);
  assert.ok(x1 - x0 > MIN_HIT && y1 - y0 > MIN_HIT);
  // collinear: over minHit on both axes too
  const [c0, c1, d0, d1] = screenBox(THUMB_CASES['collinear points']);
  assert.ok(c1 - c0 > MIN_HIT && d1 - d0 > MIN_HIT);
});

test('a long thin item stays tappable along its whole length', () => {
  // on screen: 34.6 wide, 2.5 tall (a strip lying across the room, like a shelf edge)
  const hit = [[20, 0, 0], [0, 20, 0], [20, 0, 2.5], [0, 20, 2.5]];
  const [x0, x1, y0, y1] = screenBox(hit);
  const mid = (y0 + y1) / 2;
  const poly = assertThumb('shelf edge', hit);
  assert.ok(contains(poly, [x0, x1, mid - MIN_HIT / 2, mid + MIN_HIT / 2]), 'the full length, minHit tall');
  // and the same upright
  const upright = [[10, 10, 0], [10, 10, 40], [11, 10, 40], [11, 10, 0]];
  const [u0, u1, v0, v1] = screenBox(upright);
  const tall = assertThumb('upright', upright);
  assert.ok(contains(tall, [(u0 + u1) / 2 - MIN_HIT / 2, (u0 + u1) / 2 + MIN_HIT / 2, v0, v1]), 'minHit wide, the full height');
});

test('a big hit keeps its own shape', () => {
  const hit = toy.parts[0].hit; // the desk
  const poly = tapAreaOf(hit);
  const given = new Set(hit.map((q) => project(q).map((v) => +v.toFixed(2)).join(',')));
  // every corner of the area is one of the given points: nothing was added or inflated
  for (const q of poly) assert.ok(given.has(q.join(',')), `unexpected corner ${q}`);
});

test('small hits on top', () => {
  const { svg } = renderRoom(toy, { prefix: 'room-toy', resolve });
  const order = anchors(svg).map((a) => a.part);
  assert.ok(order.indexOf('laptop') > order.indexOf('desk'), order.join());

  // ...even when the small one is listed first
  const flipped = { ...toy, parts: [toy.parts[1], toy.parts[0], toy.parts[2]] };
  const again = anchors(renderRoom(flipped, { prefix: 'room-toy', resolve }).svg).map((a) => a.part);
  assert.ok(again.indexOf('laptop') > again.indexOf('desk'), again.join());
});

test('tap areas come after every part', () => {
  const { svg } = renderRoom(toy, { prefix: 'room-toy', resolve });
  assert.ok(svg.lastIndexOf('class="room__part"') < svg.indexOf('<a class="room__hot"'));
  assert.ok(svg.endsWith('</a>'));
});

test('hots follow the order of the tap areas', () => {
  const { svg, hots } = renderRoom(toy, { prefix: 'room-toy', resolve });
  assert.deepEqual(hots.map((h) => h.part), anchors(svg).map((a) => a.part));
});

test('viewBox fits the room', () => {
  for (const size of [[60, 50, 40], [100, 30, 40], [30, 90, 70]]) {
    const { viewBox } = renderRoom({ ...toy, size, window: undefined }, { prefix: 'room-toy', resolve });
    const [vx, vy, vw, vh] = viewBox;
    assert.ok(Math.abs(vw / vh - ROOM_ASPECT) < 0.01, `${size}: aspect ${vw / vh}`);
    const [w, d, h] = size;
    for (const x of [-WALL_THICK, w]) {
      for (const y of [-WALL_THICK, d]) {
        for (const z of [-FLOOR_THICK, h]) {
          const [sx, sy] = project([x, y, z]);
          assert.ok(sx >= vx && sx <= vx + vw && sy >= vy && sy <= vy + vh, `${size}: corner ${x},${y},${z}`);
        }
      }
    }
  }
  assert.equal(ROOM_ASPECT, 1.15);
});

test('svg is the inner content: defs first, ids carry the prefix, every url() is defined', () => {
  const { svg } = renderRoom(toy, { prefix: 'room-toy', resolve });
  assert.ok(svg.startsWith('<defs>'));
  assert.ok(!svg.includes('<svg'));
  const ids = [...svg.matchAll(/ id="([^"]*)"/g)].map((m) => m[1]);
  assert.ok(ids.length > 0);
  for (const id of ids) assert.ok(id.startsWith('room-toy-'), id);
  assert.equal(new Set(ids).size, ids.length, 'ids are unique');
  for (const [, id] of svg.matchAll(/url\(#([^)]*)\)/g)) assert.ok(ids.includes(id), `undefined ${id}`);
  assert.ok(ids.includes('room-toy-bg'));
  assert.ok(svg.includes(`stop-color="${PALETTE.bgFrom}"`) && svg.includes(`stop-color="${PALETTE.bgTo}"`));
});

test('the window is drawn on either wall', () => {
  for (const wall of ['left', 'back']) {
    const { svg } = renderRoom({ ...toy, window: { wall, from: 10, to: 30, z: [14, 30] } }, { prefix: 'room-toy', resolve });
    assert.ok(svg.includes(`fill="${PALETTE.glass}"`), wall);
    assert.ok(svg.includes('url(#room-toy-glow)'), wall);
  }
  const none = renderRoom({ ...toy, window: undefined }, { prefix: 'room-toy', resolve }).svg;
  assert.ok(!none.includes(`fill="${PALETTE.glass}"`));
  assert.throws(
    () => renderRoom({ ...toy, window: { wall: 'right', from: 1, to: 2, z: [1, 2] } }, { prefix: 'room-toy', resolve }),
    { message: 'rooms/toy: window wall must be "left" or "back"' },
  );
});

test('labels are escaped in attributes', () => {
  const tricky = () => ({ href: '#product-x', label: 'Tom & "Jerry" <b>', kind: 'product' });
  const { svg } = renderRoom(toy, { prefix: 'room-toy', resolve: tricky });
  assert.ok(svg.includes('aria-label="Tom &amp; &quot;Jerry&quot; &lt;b&gt;"'));
  assert.ok(!svg.includes('<b>'));
});

test('a duplicate part id throws', () => {
  const twin = { ...toy, parts: [...toy.parts, { id: 'chair', draw: () => '' }] };
  assert.throws(() => renderRoom(twin, { prefix: 'room-toy', resolve }),
    { message: 'rooms/toy: duplicate part id "chair"' });
});

test('a target without a hit throws', () => {
  const blind = { ...toy, parts: [{ id: 'lamp', draw: () => '', target: { product: 'x' } }] };
  assert.throws(() => renderRoom(blind, { prefix: 'room-toy', resolve }),
    { message: 'rooms/toy: part "lamp" has a target but no hit' });
  // ...even when nothing would be linked
  assert.throws(() => renderRoom(blind, { prefix: 'room-toy', resolve: () => null }),
    { message: 'rooms/toy: part "lamp" has a target but no hit' });
});

test('roomParts gives body, hits and hots without a shell', () => {
  const p = painter('room-toy');
  const out = roomParts(toy, p, resolve);
  assert.deepEqual(Object.keys(out).sort(), ['body', 'hits', 'hots']);
  assert.ok(!out.body.includes('<a '));
  assert.ok(out.body.includes('<g class="room__part" data-part="desk">'));
  assert.equal((out.hits.match(/<a /g) ?? []).length, 2);
  assert.equal(out.hots.length, 2);
});

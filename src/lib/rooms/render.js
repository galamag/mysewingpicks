/*
  A room as svg: the shell (floor slab, two tall back walls, a window) and the
  parts of a room model, then the tap areas on top. Pure functions, no DOM —
  the same code draws the first frame at build time (Astro).

  A room model:
    key     the page key ('setup'…), used in error texts
    size    [w, d, h] cm: w along x, d along y, h the height of the walls
    window  optional { wall: 'left' | 'back', from, to, z: [z0, z1] } — 'left'
            is the wall in the plane x = 0, 'back' the one in y = 0; from/to run
            along that wall
    parts   drawn in order, back to front:
              id      unique within the model
              draw    (painter) → svg string
              target  optional, exactly one of { product } | { section } | { project }
              hit     [[x, y, z], …] world points of the tap area (needed with a target)
  A part without a target is decoration: drawn, never a link.

  Nothing in a drawing links straight to Amazon: `resolve(target)` hands back
  { href, label, kind } for OUR page / card / section, or null (decoration).
*/
import { project } from '../anatomy/iso.js';
import { PALETTE, painter, shade } from './paint.js';

export const ROOM_ASPECT = 1.15; // viewBox width / height, so the page can reserve the space
export const MIN_HIT = 14; // world units on screen: the room is ~110 wide on a ~340 px phone, 14 ≈ 44 px
export const WALL_THICK = 6;
export const FLOOR_THICK = 6;

const PAD = 4; // around the box of the room, in the same units
const PLANK = 8; // about this far apart
const LIGHT_PATCH = '#ffe7b0';

const num = (n) => +n.toFixed(2);
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- the shell ---------- */

/** A point on the window's wall: `a` along the wall, `z` up. */
const onWall = (wall, a, z) => (wall === 'left' ? [0, a, z] : [a, 0, z]);

function checkWindow(model) {
  const win = model.window;
  if (win && win.wall !== 'left' && win.wall !== 'back') {
    throw new Error(`rooms/${model.key}: window wall must be "left" or "back"`);
  }
}

/** The window: glass in a wooden frame with one cross, warm light laid over it. */
function windowOnWall(p, { wall, from, to, z: [z0, z1] }) {
  const pane = [onWall(wall, from, z0), onWall(wall, to, z0), onWall(wall, to, z1), onWall(wall, from, z1)];
  const a = (from + to) / 2;
  const z = (z0 + z1) / 2;
  return (
    p.plane(pane, PALETTE.glass, { stroke: PALETTE.woodDark, strokeWidth: 0.8 }) +
    p.line(onWall(wall, a, z0), onWall(wall, a, z1), PALETTE.woodDark, 0.6) +
    p.line(onWall(wall, from, z), onWall(wall, to, z), PALETTE.woodDark, 0.6) +
    p.glow(pane)
  );
}

/** The window's light on the floor: a blurred parallelogram leaning away from the wall. */
function lightOnFloor(prefix, [w, d], { wall, from, to, z: [z0, z1] }) {
  const REACH = 1; // floor distance from the wall per unit of window height
  const LEAN = 0.3; // sideways drift per unit of floor distance
  const [alongMax, depthMax] = wall === 'left' ? [d, w] : [w, d];
  const clamp = (v, max) => Math.min(Math.max(v, 0), max);
  const onFloor = ([a, depth]) => {
    const [aa, dd] = [clamp(a, alongMax), clamp(depth, depthMax)];
    return wall === 'left' ? [dd, aa, 0] : [aa, dd, 0];
  };
  const [near, far] = [z0 * REACH, z1 * REACH];
  const pts = [
    [from + near * LEAN, near], [to + near * LEAN, near],
    [to + far * LEAN, far], [from + far * LEAN, far],
  ].map(onFloor).map((q) => project(q).map(num).join(',')).join(' ');
  return `<polygon points="${pts}" fill="${LIGHT_PATCH}" opacity=".35" filter="url(#${prefix}-blur)"/>`;
}

/**
  Walls first, then the slab: the walls stand on the slab's level (their foot is
  hidden behind it), so the slab must be painted over them. Window and its
  floor light follow the walls / the slab.
*/
function shell(p, prefix, model) {
  const [w, d, h] = model.size;
  const T = WALL_THICK;
  const F = FLOOR_THICK;
  const wall = PALETTE.wall;
  const win = model.window;

  const walls =
    // the back wall (plane y = 0): its +y face is the inside, the +x face its cut end
    p.box(-T, -T, -F, w + T, T, h + F, PALETTE.wallTop, { l: wall, r: shade(wall, -0.15) }) +
    // the left wall (plane x = 0): its +x face is the inside, the +y face its cut end
    p.box(-T, 0, -F, T, d, h + F, PALETTE.wallTop, { l: shade(wall, -0.1), r: shade(wall, -0.04) });

  const slab = p.box(0, 0, -F, w, d, F, PALETTE.floor, { l: PALETTE.floorSide, r: shade(PALETTE.floorSide, -0.12) });

  const boards = Math.max(2, Math.round(d / PLANK));
  let planks = '';
  for (let i = 1; i < boards; i++) {
    const y = (d * i) / boards;
    planks += p.line([0, y, 0], [w, y, 0], shade(PALETTE.floor, -0.12), 0.3);
  }

  return (
    walls +
    (win ? windowOnWall(p, win) : '') +
    slab +
    planks +
    (win ? lightOnFloor(prefix, [w, d], win) : '')
  );
}

/** [x, y, w, h] of the box of the room (walls and slab included) + padding, widened to ROOM_ASPECT. */
function viewBoxOf([w, d, h]) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const x of [-WALL_THICK, w]) {
    for (const y of [-WALL_THICK, d]) {
      for (const z of [-FLOOR_THICK, h]) {
        const [sx, sy] = project([x, y, z]);
        x0 = Math.min(x0, sx); y0 = Math.min(y0, sy);
        x1 = Math.max(x1, sx); y1 = Math.max(y1, sy);
      }
    }
  }
  x0 -= PAD; y0 -= PAD; x1 += PAD; y1 += PAD;
  let vw = x1 - x0;
  let vh = y1 - y0;
  if (vw / vh < ROOM_ASPECT) {
    const wide = vh * ROOM_ASPECT;
    x0 -= (wide - vw) / 2;
    vw = wide;
  } else {
    const tall = vw / ROOM_ASPECT;
    y0 -= (tall - vh) / 2;
    vh = tall;
  }
  return [x0, y0, vw, vh].map(num);
}

/* ---------- tap areas ---------- */

/** Convex hull of 2D points (monotone chain); fewer than 3 points back when they are all in a line. */
function hull(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .filter((q, i, all) => i === 0 || q[0] !== all[i - 1][0] || q[1] !== all[i - 1][1]);
  if (pts.length < 3) return pts;
  const turn = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const chain = (list) => {
    const out = [];
    for (const q of list) {
      while (out.length >= 2 && turn(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop();
      out.push(q);
    }
    out.pop();
    return out;
  };
  return chain(pts).concat(chain([...pts].reverse()));
}

const areaOf = (poly) => Math.abs(poly.reduce((sum, q, i) => {
  const r = poly[(i + 1) % poly.length];
  return sum + q[0] * r[1] - r[0] * q[1];
}, 0)) / 2;

/**
  The tap area of a part: the hull of its projected `hit` points. When it is
  thinner than `minHit` in x or y (or flat: a line or a point), it is grown
  about its centre to a box of at least minHit × minHit — rounded outwards, so
  the printed numbers keep the size.
*/
function tapArea(hit, minHit) {
  const pts = hit.map(project);
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const poly = hull(pts);
  if (poly.length >= 3 && x1 - x0 >= minHit && y1 - y0 >= minHit) return poly;

  const [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2];
  const [hw, hh] = [Math.max(x1 - x0, minHit) / 2, Math.max(y1 - y0, minHit) / 2];
  const down = (v) => Math.floor(v * 100) / 100;
  const up = (v) => Math.ceil(v * 100) / 100;
  const box = [
    [down(cx - hw), down(cy - hh)], [up(cx + hw), down(cy - hh)],
    [up(cx + hw), up(cy + hh)], [down(cx - hw), up(cy + hh)],
  ];
  return hull([...pts, ...box]);
}

/**
  Draw the parts of a model with the painter `p`.
    resolve(target) → { href, label, kind: 'product' | 'section' | 'page' } | null
    inactive        part ids drawn as decoration even though they have a target
  → body   the parts, in order; a part that links is wrapped in <g class="room__part" data-part>
    hits   the tap areas <a class="room__hot">, AFTER everything, the biggest first
           (small ones on top, so a laptop on a desk stays tappable)
    hots   { part, kind, href, label } — in the order of `hits` (which is the Tab order)
*/
export function roomParts(model, p, resolve, { minHit = MIN_HIT, inactive = new Set() } = {}) {
  const seen = new Set();
  const links = [];
  let body = '';

  for (const part of model.parts) {
    if (seen.has(part.id)) throw new Error(`rooms/${model.key}: duplicate part id "${part.id}"`);
    seen.add(part.id);

    const art = part.draw(p);
    if (part.target && !part.hit?.length) {
      throw new Error(`rooms/${model.key}: part "${part.id}" has a target but no hit`);
    }
    const info = part.target && !inactive.has(part.id) ? resolve?.(part.target) : null;
    if (!info) {
      body += art;
      continue;
    }

    body += `<g class="room__part" data-part="${esc(part.id)}">${art}</g>`;
    const poly = tapArea(part.hit, minHit);
    links.push({ part: part.id, ...info, poly, area: areaOf(poly) });
  }

  links.sort((a, b) => b.area - a.area); // stable: equal areas keep the order of the model

  const hits = links.map((l) =>
    `<a class="room__hot" href="${esc(l.href)}" aria-label="${esc(l.label)}" data-kind="${esc(l.kind)}" data-part="${esc(l.part)}">` +
    `<polygon class="room__hit" points="${l.poly.map(([x, y]) => `${num(x)},${num(y)}`).join(' ')}"/></a>`,
  ).join('');
  const hots = links.map(({ part, kind, href, label }) => ({ part, kind, href, label }));
  return { body, hits, hots };
}

/* ---------- the room ---------- */

/**
  → svg      the INNER content of an <svg> (starts with <defs>); the component
             wraps it in <svg viewBox="…">
    viewBox  [x, y, w, h]: the box of the room + padding, w / h = ROOM_ASPECT
    hots     see roomParts
  `prefix` (default room-<key>) starts every id, so several rooms can share a page.
*/
export function renderRoom(model, { prefix = `room-${model.key}`, resolve, minHit, inactive } = {}) {
  checkWindow(model);
  const p = painter(prefix);
  const viewBox = viewBoxOf(model.size);
  const [vx, vy, vw, vh] = viewBox;

  const room = shell(p, prefix, model);
  const { body, hits, hots } = roomParts(model, p, resolve, { minHit, inactive });

  // after drawing: the painter makes its gradients while it paints
  const defs =
    `<defs><radialGradient id="${prefix}-bg" cx=".55" cy=".35" r=".75">` +
    `<stop offset="0" stop-color="${PALETTE.bgFrom}"/><stop offset="1" stop-color="${PALETTE.bgTo}"/></radialGradient>` +
    `${p.defs()}</defs>`;
  const background = `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="url(#${prefix}-bg)"/>`;

  return { svg: defs + background + room + body + hits, viewBox, hots };
}

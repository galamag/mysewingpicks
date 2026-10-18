/*
  Helpers shared by the room tests (setup.test.js, tools.test.js, the next rooms).
  NOT a test file (no .test.js in its name): the test glob of package.json must not pick it up.
*/
import { project } from '../../src/lib/anatomy/iso.js';
import { renderRoom, minHitFor } from '../../src/lib/rooms/render.js';

// The thumb rule, pinned here on purpose (not read from render.js): a tap area of a real room
// must be at least a 44 css px thumb on a 320 px phone, where the room is as wide as the screen.
export const THUMB_PX = 44;
export const PHONE_PX = 320;

/** The printed tap areas of an svg, in document order (later = on top): { part, href, poly }. */
export function areasOf(svg) {
  return [...svg.matchAll(/<a class="room__hot"([^>]*)><polygon class="room__hit" points="([^"]*)"/g)]
    .map(([, attrs, points]) => ({
      part: /data-part="([^"]*)"/.exec(attrs)[1],
      href: /href="([^"]*)"/.exec(attrs)[1],
      poly: points.split(' ').map((q) => q.split(',').map(Number)),
    }));
}

/**
  A room as the narrowest phone gets it: drawn with minHitFor(model), as Room.astro does it.
    resolve  as for renderRoom
  → svg, the printed tap areas, the thumb in viewBox units (44 px on a 320 px phone), minHit
*/
export function onPhone(model, resolve) {
  const minHit = minHitFor(model);
  const { svg, viewBox } = renderRoom(model, { resolve, minHit });
  return { svg, areas: areasOf(svg), thumb: (THUMB_PX * viewBox[2]) / PHONE_PX, minHit };
}

/** Is the point inside the convex polygon (either winding)? */
export const inside = (poly, [x, y]) => {
  const side = poly.map((a, i) => {
    const b = poly[(i + 1) % poly.length];
    return Math.sign((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]));
  });
  return side.every((v) => v >= 0) || side.every((v) => v <= 0);
};

/** Share of the points of a world rectangle at(u, v), u, v in 0..1, that land in a tap area. */
export function linked(areas, at) {
  let n = 0, hit = 0;
  for (let i = 0; i <= 20; i++) for (let j = 0; j <= 20; j++) {
    n++;
    if (areas.some((a) => inside(a.poly, project(at(i / 20, j / 20))))) hit++;
  }
  return hit / n;
}

/** A model's window as a world rectangle at(u, v), u along the wall, v up: for `linked`. */
export const glassOf = ({ wall, from, to, z: [z0, z1] }) => (u, v) => {
  const along = from + (to - from) * u;
  const z = z0 + (z1 - z0) * v;
  return wall === 'left' ? [0, along, z] : [along, 0, z];
};

/**
  The side of the largest square (viewBox units) where a tap reaches area `i`: inside it and
  under no area printed after it (later = on top). Sampled every `step` units.
*/
export function ownSquare(areas, i, step = 0.25) {
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

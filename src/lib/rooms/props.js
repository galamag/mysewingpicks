/*
  Small drawing helpers shared by the room models (setup.js, tools.js, …): what
  each of them used to carry its own copy of. Pure functions, no DOM.

  Room-specific helpers (a slab, a shadow on a table top, the dress form, the
  tripod legs…) stay in the room's own file.
*/
import { project } from '../anatomy/iso.js';
import { num } from './paint.js';

// A horizontal circle of radius r around a world point is, through project(), an
// ellipse: rx = r·√1.5 wide, ry = r·√0.5 tall.
export const ISO_RX = Math.sqrt(1.5);
export const ISO_RY = Math.SQRT1_2;

/** A circle drawn flat on the screen around a world point (leaves, wheels, knobs, pin heads). */
export const dot = ([x, y, z], r, fill) => {
  const [cx, cy] = project([x, y, z]);
  return `<circle cx="${num(cx)}" cy="${num(cy)}" r="${r}" fill="${fill}"/>`;
};

/** A horizontal circle of radius r around a world point: on screen an ellipse rx = ISO_RX · r, ry = ISO_RY · r. */
export const disc = ([x, y, z], r, fill, extra = '') => {
  const [cx, cy] = project([x, y, z]);
  return `<ellipse cx="${num(cx)}" cy="${num(cy)}" rx="${num(r * ISO_RX)}" ry="${num(r * ISO_RY)}" fill="${fill}"${extra}/>`;
};

/** The points of a rectangle lying flat at height z. */
export const flat = (x0, x1, y0, y1, z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];

/** The eight corners of the box from (x, y, z), size w × d × h: the points for a part's `hit`. */
export const corners = (x, y, z, w, d, h) => [
  [x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z],
  [x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h],
];

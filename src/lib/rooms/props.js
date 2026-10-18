/*
  Small drawing helpers and finishes shared by the room models (setup.js, tools.js,
  fabrics.js, …): what each of them used to carry its own copy of. Pure functions, no DOM.

  Room-specific helpers (a slab, the dress form, the tripod legs, a lying roll…) stay in
  the room's own file until a second room needs them.
*/
import { project } from '../anatomy/iso.js';
import { PALETTE, shade, num } from './paint.js';

/** The dark frames of the rooms: desk frame, tripods, stands, the legs of the ironing board. */
export const FRAME = shade(PALETTE.dark, 0.12);
/** Steel: needles, pins, the iron's sole, zipper teeth. */
export const STEEL = shade(PALETTE.metal, -0.22);
/** The side faces of wooden furniture (`faces` of painter.box with PALETTE.wood). */
export const WOOD = { l: shade(PALETTE.wood, -0.12), r: shade(PALETTE.wood, -0.22) };

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

/**
  A soft shadow on a surface at height z (a table top): the painter's floor shadow, moved so its
  centre lands where (x, y, z) is on the screen — (x - z, y - z, 0) projects to the same point.
*/
export const shadowOn = (p, [x, y, z], rx, ry) => p.shadow(x - z, y - z, rx, ry);

/** The eight corners of the box from (x, y, z), size w × d × h: the points for a part's `hit`. */
export const corners = (x, y, z, w, d, h) => [
  [x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z],
  [x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h],
];

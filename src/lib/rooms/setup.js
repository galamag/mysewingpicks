/*
  The filming room of My Setup (/setup.html, and the Setup room of the house).

  The standing desk with the laptop stands against the left wall (x = 0) under
  the window, as in the approved sketch (house-v2, "Съёмка"); the two softboxes
  stand along the back wall, the phone on its tripod and the ring light in the
  middle of the room; the chair (in the front-left corner, facing the camera)
  and the plant (in the back-right corner) are decoration.

  Decoration must not turn into a link: every tap area is the convex hull of its
  part's `hit` (render.js), so the chair, the plant and the window stand clear
  of the hulls — the chair is NOT at the desk on purpose, the window is over the
  back half of the desk and the laptop on its front half.

  Every product item links to its card (target.product); the two softboxes are
  ONE part (one product: the kit of two). No brand names or logos on anything.
  Model contract: src/lib/rooms/render.js. World units (cm-like): x → right-down,
  y → left-down, z → up; parts are listed back to front (painted in order).
*/
import { project } from '../anatomy/iso.js';
import { PALETTE as C, shade } from './paint.js';

const num = (n) => +n.toFixed(2);
const FRAME = shade(C.dark, 0.12); // desk frame, tripods, stands
const SCREEN = '#5f6f73'; // a dark, slightly cool screen
const SCREEN_LIT = '#8fa3a0';

/** A circle drawn flat on the screen around a world point (leaves, wheels). */
const dot = ([x, y, z], r, fill) => {
  const [cx, cy] = project([x, y, z]);
  return `<circle cx="${num(cx)}" cy="${num(cy)}" r="${r}" fill="${fill}"/>`;
};

/** Three legs from a joint at (x, y, top) to the floor, `reach` away, turned by `turn` degrees. */
function legs(p, [x, y], top, reach, turn, color = FRAME, width = 0.7) {
  return [0, 120, 240].map((a) => {
    const t = ((a + turn) * Math.PI) / 180;
    return p.line([x, y, top], [x + reach * Math.cos(t), y + reach * Math.sin(t), 0], color, width);
  }).join('');
}

/** A ring of radius r standing across the diagonal (facing ±(1, 1, 0)): on screen an upright ellipse, rx = 1.22 r, ry = r. */
function ring(center, r, stroke, width) {
  const [cx, cy] = project(center);
  return `<ellipse cx="${num(cx)}" cy="${num(cy)}" rx="${num(r * 1.2247)}" ry="${r}" fill="none" stroke="${stroke}" stroke-width="${width}"/>`;
}

/* ---------- the items ---------- */

const WINDOW = { wall: 'left', from: 4, to: 20, z: [28, 38] }; // over the back half of the desk

// standing desk: top x 1.5..16.5, y 8..36, top surface at z 26.2
const DESK = { x: 1.5, y: 8, w: 15, d: 28, z: 24, t: 2.2 };
const deskTop = DESK.z + DESK.t;

function desk(p) {
  const { x, y, w, d, z, t } = DESK;
  let s = p.shadow(9, 22, 14, 6);
  for (const fy of [10, 31]) {
    s += p.box(3, fy, 0, 12, 3, 1.3, FRAME); // T foot along x
    s += p.box(7.6, fy + 0.25, 1.3, 2.8, 2.5, 11, FRAME); // lower column
    s += p.box(8, fy + 0.5, 12.3, 2, 2, z - 13.3, C.metal); // upper column, slides out
  }
  s += p.box(8.3, 13, z - 1.4, 1.4, 18, 1.4, FRAME); // cross bar under the top
  s += p.box(x, y, z, w, d, t, C.wood, { l: shade(C.wood, -0.12), r: shade(C.wood, -0.22) });
  // the height buttons under the front edge, at the right end
  s += p.box(x + w - 0.6, 30, z - 1, 1.2, 3.2, 1, FRAME);
  s += p.plane([[x + w + 0.62, 31, z - 0.45], [x + w + 0.62, 31.8, z - 0.45], [x + w + 0.62, 31.8, z - 0.15], [x + w + 0.62, 31, z - 0.15]], C.gold);
  return s;
}

// the laptop on the front half of the desk: base x0..x1 × y0..y1, the lid hinged at x0 leaning back to x = lean
const LAPTOP = { x0: 5, x1: 12, y0: 20, y1: 31, base: 0.7, lean: 3.6, lidH: 6.8 };

function laptop(p) {
  const { x0, x1, y0, y1, lean, lidH } = LAPTOP;
  const base = deskTop + LAPTOP.base;
  const LID = 0.6; // its thickness, behind the screen
  let s = p.box(x0, y0, deskTop, x1 - x0, y1 - y0, LAPTOP.base, C.metal);
  // keyboard and touchpad on the base
  const flat = (a0, a1, b0, b1) => [[a0, b0, base], [a1, b0, base], [a1, b1, base], [a0, b1, base]];
  s += p.plane(flat(x0 + 1.2, x0 + 4.3, y0 + 1.2, y1 - 1.2), shade(C.metal, -0.16));
  s += p.plane(flat(x0 + 5, x0 + 6.3, y0 + 3.5, y1 - 3.5), shade(C.metal, -0.07));
  // the lid: its side and top edges, then the bezel and the screen facing the room (+x)
  const lid = (u, v) => [x0 + (lean - x0) * v, y0 + (y1 - y0) * u, base + lidH * v];
  const back = ([x, y, z]) => [x - LID, y, z];
  s += p.plane([lid(1, 0), back(lid(1, 0)), back(lid(1, 1)), lid(1, 1)], shade(C.metal, -0.25));
  s += p.plane([lid(0, 1), lid(1, 1), back(lid(1, 1)), back(lid(0, 1))], shade(C.metal, -0.1));
  s += p.plane([lid(0, 0), lid(1, 0), lid(1, 1), lid(0, 1)], C.dark);
  s += p.plane([lid(0.06, 0.08), lid(0.94, 0.08), lid(0.94, 0.92), lid(0.06, 0.92)], SCREEN);
  s += p.plane([lid(0.12, 0.2), lid(0.5, 0.2), lid(0.5, 0.8), lid(0.12, 0.8)], C.rose); // a video being edited
  s += p.plane([lid(0.56, 0.2), lid(0.88, 0.2), lid(0.88, 0.32), lid(0.56, 0.32)], C.gold); // its timeline
  s += p.plane([lid(0.56, 0.42), lid(0.88, 0.42), lid(0.88, 0.5), lid(0.56, 0.5)], SCREEN_LIT);
  return s;
}

// two softboxes on stands along the back wall, their white fronts facing the room (+y)
const SOFTBOXES = [[22, 6], [46, 6]];
const SB = { w: 9, h: 12, depth: 5, z: 26 }; // front face w × h, its bottom at z

function softbox(p, [x, y]) {
  const { w, h, depth, z } = SB;
  const front = y + depth / 2; // the diffuser
  const back = y - depth / 2;
  const [l, r, b, t] = [x - w / 2, x + w / 2, z, z + h];
  const inset = 1.6; // the box narrows towards the lamp at the back
  let s = p.shadow(x, y + 2, 9, 3.5) + legs(p, [x, y], 9, 5, 15) + p.line([x, y, 9], [x, y, b + 2], FRAME, 0.9);
  s += p.box(x - 1.5, back - 1.2, b + h / 2 - 1.5, 3, 1.2, 3, FRAME); // the lamp housing behind
  // the dark body: its right side and its top, narrowing to the back
  s += p.plane([[r, front, b], [r - inset, back, b + inset], [r - inset, back, t - inset], [r, front, t]], shade(C.dark, -0.05));
  s += p.plane([[l, front, t], [r, front, t], [r - inset, back, t - inset], [l + inset, back, t - inset]], shade(C.dark, 0.18));
  // the white diffuser in its black rim
  s += p.plane([[l, front, b], [r, front, b], [r, front, t], [l, front, t]], C.dark);
  s += p.plane([[l + 0.6, front, b + 0.6], [r - 0.6, front, b + 0.6], [r - 0.6, front, t - 0.6], [l + 0.6, front, t - 0.6]], C.light);
  s += p.glow([[l + 0.6, front, b + 0.6], [r - 0.6, front, b + 0.6], [r - 0.6, front, t - 0.6], [l + 0.6, front, t - 0.6]]);
  return s;
}

// the office chair in the front-left corner, facing the room and the camera (+x): its back against the left wall
export const CHAIR = { x: 2, y: 40, w: 9, d: 9 };

function chair(p) {
  const { x, y, w, d } = CHAIR;
  const [cx, cy] = [x + w / 2, y + d / 2];
  let s = p.shadow(cx, cy, 9, 4);
  for (const a of [18, 90, 162, 234, 306]) {
    const t = (a * Math.PI) / 180;
    const foot = [cx + 5 * Math.cos(t), cy + 5 * Math.sin(t), 0.9];
    s += p.line([cx, cy, 2.2], foot, FRAME, 1);
    s += dot([foot[0], foot[1], 0.5], 0.7, C.dark);
  }
  s += p.box(cx - 0.6, cy - 0.6, 2, 1.2, 1.2, 12, C.metal); // gas lift
  s += p.box(x, y, 14, w, d, 3, C.sage, { l: C.sageDeep, r: shade(C.sageDeep, -0.12) }); // seat
  s += p.box(x + 0.5, cy - 0.5, 16, 1, 1, 3, C.metal); // back support
  s += p.box(x, y + 0.6, 18.5, 2.2, d - 1.2, 11, C.sage, { l: C.sageDeep, r: shade(C.sage, 0.1) }); // back, its cushion towards +x
  return s;
}

// a potted plant in the back-right corner
function plant(p) {
  const [x, y] = [52, 1];
  let s = p.shadow(x + 3.5, y + 3.5, 6, 3);
  s += p.box(x, y, 0, 7, 7, 7.5, C.rose, { l: C.roseDeep, r: shade(C.roseDeep, -0.12) });
  s += p.plane([[x + 0.6, y + 0.6, 7.5], [x + 6.4, y + 0.6, 7.5], [x + 6.4, y + 6.4, 7.5], [x + 0.6, y + 6.4, 7.5]], C.woodDark);
  // leaves fanning out of the pot: [angle from upright°, length, colour]; the back ones first
  const [bx, by] = project([x + 3.5, y + 3.5, 8]);
  const leaf = ([a, len, c]) => {
    const t = (a * Math.PI) / 180;
    const [cx, cy] = [bx + Math.sin(t) * len * 0.55, by - Math.cos(t) * len * 0.55];
    return `<ellipse cx="${num(cx)}" cy="${num(cy)}" rx="${num(len * 0.2)}" ry="${num(len * 0.55)}" fill="${c}" transform="rotate(${a} ${num(cx)} ${num(cy)})"/>`;
  };
  s += [
    [-48, 10, C.sageDeep], [42, 10.5, C.sageDeep], [-16, 13, C.sageDeep], [14, 12.5, C.sageDeep],
    [-62, 8, C.sage], [64, 8.5, C.sage], [-30, 11, C.sage], [30, 10, C.sage], [0, 11.5, shade(C.sage, 0.12)],
  ].map(leaf).join('');
  return s;
}

// the phone tripod, the phone on it filming the desk (its screen towards the room, +x)
const TRIPOD = { x: 43, y: 35, joint: 17, top: 27.5 };
const PHONE = { x: TRIPOD.x - 0.5, y: TRIPOD.y - 2.6, z: TRIPOD.top + 1, t: 1, w: 5.2, h: 9.6 };

function tripod(p) {
  const { x, y, joint, top } = TRIPOD;
  return (
    p.shadow(x, y, 8, 3.5) +
    legs(p, [x, y], joint, 7, 40, FRAME, 0.8) +
    p.box(x - 0.45, y - 0.45, joint - 1, 0.9, 0.9, top - joint + 1, C.metal) + // centre column
    p.box(x - 1, y - 1, joint - 1.2, 2, 2, 1.4, FRAME) + // leg joint
    p.box(x - 0.9, y - 0.9, top, 1.8, 1.8, 1, FRAME) // ball head
  );
}

function phone(p) {
  const { x, y, z, t, w, h } = PHONE;
  const sx = x + t + 0.02; // the screen, on the +x face
  let s = p.box(x - 0.2, y + w / 2 - 1.2, z - 0.4, t + 0.4, 2.4, 0.6, FRAME); // the clamp
  s += p.box(x, y, z, t, w, h, C.dark, { l: shade(C.dark, 0.1), r: C.dark });
  s += p.plane([[sx, y + 0.45, z + 0.5], [sx, y + w - 0.45, z + 0.5], [sx, y + w - 0.45, z + h - 0.5], [sx, y + 0.45, z + h - 0.5]], SCREEN);
  s += p.plane([[sx, y + 0.9, z + 1.5], [sx, y + w - 0.9, z + 1.5], [sx, y + w - 0.9, z + 5.2], [sx, y + 0.9, z + 5.2]], C.wood); // the desk, on screen
  s += p.plane([[sx, y + 0.9, z + 5.2], [sx, y + w - 0.9, z + 5.2], [sx, y + w - 0.9, z + h - 1.5], [sx, y + 0.9, z + h - 1.5]], SCREEN_LIT);
  return s;
}

// the ring light on its stand, the ring turned to the back-left corner (the desk side)
const RING = { x: 58, y: 28, r: 5.2, z: 29 };

function ringLight(p) {
  const { x, y, r, z } = RING;
  const centre = [x, y, z];
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const t = (i / 16) * Math.PI * 2;
    pts.push([x + (r * Math.cos(t)) / Math.SQRT2, y - (r * Math.cos(t)) / Math.SQRT2, z + r * Math.sin(t)]);
  }
  return (
    p.shadow(x, y, 6.5, 3) +
    legs(p, [x, y], 6, 5, 15) +
    p.line([x, y, 6], [x, y, z - r - 0.4], FRAME, 0.9) +
    p.box(x - 0.7, y - 0.7, z - r - 1.6, 1.4, 1.4, 1.4, FRAME) + // the mount
    p.glow(pts) +
    ring(centre, r, shade(C.metal, -0.25), 3) +
    ring(centre, r, C.light, 2.2)
  );
}

/* ---------- the model ---------- */

const corners = (x, y, z, w, d, h) => [
  [x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z],
  [x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h],
];

export default {
  key: 'setup',
  size: [60, 50, 40],
  window: WINDOW,
  parts: [
    {
      id: 'desk',
      draw: desk,
      target: { product: 'ergear-standing-desk' },
      // the top, the columns and the back foot; of the front foot only its inner end: its outer end
      // would pull the hull over the chair in the corner
      hit: [
        ...corners(DESK.x, DESK.y, DESK.z, DESK.w, DESK.d, DESK.t),
        [3, 10, 0], [15, 10, 0], [15, 13, 0], [7.6, 33.75, 0], [15, 34, 0],
      ],
    },
    {
      id: 'laptop',
      draw: laptop,
      target: { product: 'asus-zenbook-pro-16x' },
      hit: [
        ...corners(LAPTOP.x0, LAPTOP.y0, deskTop, LAPTOP.x1 - LAPTOP.x0, LAPTOP.y1 - LAPTOP.y0, LAPTOP.base),
        [LAPTOP.lean, LAPTOP.y0, deskTop + LAPTOP.base + LAPTOP.lidH], [LAPTOP.lean, LAPTOP.y1, deskTop + LAPTOP.base + LAPTOP.lidH],
      ],
    },
    {
      id: 'softboxes',
      draw: (p) => SOFTBOXES.map((at) => softbox(p, at)).join(''),
      target: { product: 'skytex-softbox-kit' },
      hit: SOFTBOXES.flatMap(([x, y]) => [
        ...corners(x - SB.w / 2, y - SB.depth / 2, SB.z, SB.w, SB.depth, SB.h),
        [x, y + 4, 0],
      ]),
    },
    { id: 'plant', draw: plant },
    { id: 'chair', draw: chair },
    {
      id: 'tripod',
      draw: tripod,
      target: { product: 'liphisy-tripod' },
      hit: [[TRIPOD.x + 6, TRIPOD.y + 3, 0], [TRIPOD.x - 5, TRIPOD.y + 5, 0], [TRIPOD.x, TRIPOD.y - 6, 0], [TRIPOD.x, TRIPOD.y, TRIPOD.top + 1]],
    },
    {
      id: 'phone',
      draw: phone,
      target: { product: 'iphone-15-pro-max-renewed' },
      hit: corners(PHONE.x, PHONE.y, PHONE.z, PHONE.t, PHONE.w, PHONE.h),
    },
    {
      id: 'ring-light',
      draw: ringLight,
      target: { product: 'sensyne-ring-light' },
      hit: [
        [RING.x + RING.r / Math.SQRT2, RING.y - RING.r / Math.SQRT2, RING.z], // the ring's sides
        [RING.x - RING.r / Math.SQRT2, RING.y + RING.r / Math.SQRT2, RING.z],
        [RING.x, RING.y, RING.z + RING.r], [RING.x, RING.y, 0], // its top, the stand's foot
      ],
    },
  ],
};

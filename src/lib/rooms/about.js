/*
  The maker's corner of About («Уголок мастерицы»; /about.html, and the About room of the house —
  spec «Гайды», 9): where she sits down after sewing. An ILLUSTRATION: no part has a target, nothing
  in it is a link (Room.astro draws it as a picture, without a hint under it).

    armchair      dusty rose, a patchwork throw over its back
    lamp          a floor lamp by the armchair
    plant         a leafy plant in a pot, in the back corner behind the armchair
    side-table    a round little table by the armchair: a cup of tea and a photo in a frame
    screen        a small screen on a low cabinet against the back wall, a video paused on it: a
                  "play" triangle in a light circle and a progress bar — no logo, no lettering
    basket        a round wicker basket of rolled fabric, in the window's light
    rug           a round rug in the middle
  The window is in the left wall, towards the front.

  In the house (stage 3) this room is in the front middle: no outer wall (the house hides the window,
  house.js outerWindow), its back and left walls are low partitions — nothing hangs on them, the
  plant, the lamp and the cabinet only stand by them. Nothing tall stands at its right edge: the Tools
  room, drawn after it, stands in front there. Every piece of furniture still has a `hit` (the rug
  lies on the floor): here it links nowhere (no target), but the house reaches a room through its
  parts' `hit` (house.js reach), so a tap on the armchair or on the lamp rising over the room behind
  opens About there ("what you see is what you tap"; tested: each `hit` covers its drawing).

  No brand names, logos or lettering on anything. Model contract: src/lib/rooms/render.js. World
  units (cm-like): x → right-down, y → left-down, z → up; parts are listed back to front.
*/
import { project } from '../anatomy/iso.js';
import { PALETTE as C, shade, num } from './paint.js';
import { dot, disc, corners, ISO_RX, ISO_RY, WOOD, FRAME } from './props.js';

const xy = ([a, b]) => `${num(a)} ${num(b)}`;

/** An upright cylinder of radius r standing on (x, y, z), h tall: its side, then its top. */
function drum([x, y, z], r, h, side, top, extra = '') {
  const [cx, cb] = project([x, y, z]);
  const [rx, ry] = [r * ISO_RX, r * ISO_RY];
  return `<path d="M${xy([cx - rx, cb - h])}L${xy([cx - rx, cb])}A${num(rx)} ${num(ry)} 0 0 0 ${xy([cx + rx, cb])}L${xy([cx + rx, cb - h])}Z" fill="${side}"/>` +
    disc([x, y, z + h], r, top, extra);
}

/** The points of a rectangle standing in the plane y = const (facing the room, +y): x0..x1 × z0..z1. */
const upright = (y, x0, x1, z0, z1) => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];

/* ---------- the window and the rug ---------- */

const WINDOW = { wall: 'left', from: 30, to: 43, z: [17, 30] };

// a round rug in the middle of the room: rings of colour, the outer one first
const RUG = { x: 35, y: 33, r: 16 };
const rug = () => [[1, C.cream], [0.8, C.sage], [0.6, C.beige], [0.38, shade(C.sage, 0.3)]]
  .map(([k, c]) => disc([RUG.x, RUG.y, 0.03], RUG.r * k, c, k === 1 ? ` stroke="${shade(C.sage, 0.15)}" stroke-width="0.5"` : '')).join('');

/* ---------- the floor lamp ---------- */

const LAMP = { x: 5.5, y: 23, r: 3.2, top: 28, shade: 5.5 };

function lamp(p) {
  const { x, y, r, top } = LAMP;
  const low = top - LAMP.shade;
  let s = p.shadow(x + 1, y + 1, 4, 1.5) + disc([x, y, 0.1], 2, FRAME);
  s += p.line([x, y, 0.2], [x, y, low + 1], FRAME, 0.6);
  // the drum shade, lit from inside: its side, a warm glow under it, its open top
  const side = shade(C.gold, 0.35);
  return s + drum([x, y, low], r, LAMP.shade, side, shade(C.gold, 0.7), ` stroke="${side}" stroke-width="0.4"`) +
    disc([x, y, low], r * 0.8, shade(C.gold, 0.6), ' opacity=".8"');
}

/* ---------- the armchair and its patchwork throw ---------- */

// facing the room (+y): the back at y..y + back, two arms, the seat between them
const CHAIR = { x: 12, y: 11, w: 16, d: 13, back: 3.4, arm: 2.8, seat: 7.6, armH: 12, top: 20 };
const THROW = [C.cream, C.sage, C.gold, C.light, C.roseDeep, C.sageDeep]; // the patches, in turn

function armchair(p) {
  const { x, y, w, d, back, arm, seat, armH, top } = CHAIR;
  const body = C.rose;
  const faces = { l: shade(body, -0.06), r: shade(body, -0.18) };
  const leg = (lx, ly) => p.box(lx, ly, 0, 1, 1, 3, C.woodDark);
  let s = p.shadow(x + w / 2 + 1, y + d / 2 + 1, 13, 4.6);
  s += leg(x + 0.6, y + 0.6) + leg(x + w - 1.6, y + 0.6);
  s += p.box(x, y, 3, w, back, top - 3, body, faces); // the back
  // the throw over the back: down its front to the seat, four patches across, four down …
  const [a, b] = [x + arm, x + w - arm];
  const fy = y + back + 0.03;
  const [cols, rows] = [4, 4];
  const [pw, ph] = [(b - a) / cols, (top - seat) / rows];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      s += p.plane(upright(fy, a + i * pw, a + (i + 1) * pw, top - (j + 1) * ph, top - j * ph), THROW[(i + 2 * j) % THROW.length]);
    }
  }
  // … and folded over its top
  for (let i = 0; i < cols; i++) {
    s += p.plane([[a + i * pw, y + 0.6, top + 0.03], [a + (i + 1) * pw, y + 0.6, top + 0.03], [a + (i + 1) * pw, fy, top + 0.03], [a + i * pw, fy, top + 0.03]], shade(THROW[(i + 4) % THROW.length], 0.12));
  }
  s += p.line([a, fy + 0.02, seat + 0.1], [b, fy + 0.02, seat + 0.1], C.sageDeep, 0.35); // its binding
  s += p.box(x, y + back, 3, arm, d - back, armH - 3, body, faces); // the left arm
  s += p.box(x + arm, y + back, 3, w - 2 * arm, d - back, seat - 3, shade(body, 0.12), faces); // the seat cushion
  s += leg(x + 0.6, y + d - 1.6) + leg(x + w - 1.6, y + d - 1.6);
  return s + p.box(x + w - arm, y + back, 3, arm, d - back, armH - 3, body, faces); // the right arm
}

/* ---------- the side table: a cup of tea, a photo in a frame ---------- */

const TABLE = { x: 35, y: 19, r: 4.4, z: 11 };
const tableTop = TABLE.z + 0.8;

function sideTable(p) {
  const { x, y, r, z } = TABLE;
  let s = p.shadow(x + 1, y + 1, 5, 1.8) + disc([x, y, 0.1], 2.2, C.woodDark);
  s += p.box(x - 0.5, y - 0.5, 0, 1, 1, z, C.woodDark);
  s += drum([x, y, z], r, 0.8, shade(C.wood, -0.2), C.wood);
  // the photo, standing at the back: a frame, a mat, a portrait (shoulders and a head) on a sage ground
  const fy = y - 1.2;
  const [f0, f1, g0, g1] = [x - 1, x + 3, tableTop, tableTop + 4.8];
  s += p.plane(upright(fy, f0, f1, g0, g1), C.woodDark);
  s += p.plane(upright(fy + 0.02, f0 + 0.4, f1 - 0.4, g0 + 0.4, g1 - 0.4), shade(C.sage, 0.45));
  s += p.plane(upright(fy + 0.04, f0 + 1, f1 - 1, g0 + 0.4, g0 + 1.8), C.rose);
  s += dot([(f0 + f1) / 2, fy + 0.06, g0 + 2.7], 0.85, shade(C.gold, 0.5));
  // the cup in front: a saucer, the cup, the tea, the handle
  const [cx, cy] = [x - 1, y + 1.8];
  s += disc([cx, cy, tableTop], 1.9, C.light, ` stroke="${shade(C.light, -0.15)}" stroke-width="0.2"`);
  s += drum([cx, cy, tableTop + 0.1], 1.25, 2, C.rose, shade(C.rose, 0.3));
  s += disc([cx, cy, tableTop + 2.1], 0.95, shade(C.woodDark, -0.2));
  const [hx, hy] = project([cx + 1.25, cy, tableTop + 1.2]);
  return s + `<path d="M${xy([hx - 0.2, hy - 0.5])}Q${xy([hx + 1.3, hy - 0.4])} ${xy([hx - 0.1, hy + 0.6])}" fill="none" stroke="${C.rose}" stroke-width="0.35"/>`;
}

/* ---------- the screen on its cabinet ---------- */

const CAB = { x: 34, y: 0.6, w: 18, d: 6.6, h: 9.6 };
// the screen: x0..x1 × z0..z1 in the plane y, on a foot in the middle
const TV = { x0: 37, x1: 49, y: 3.6, z0: CAB.h + 1.6, z1: CAB.h + 9.2, t: 0.8 };

function screen(p) {
  const { x, y, w, d, h } = CAB;
  let s = p.shadow(x + w / 2 + 1.5, y + d / 2 + 1.5, 13, 4);
  s += p.box(x, y, 0, w, d, h, C.wood, WOOD);
  // two doors, a gold knob each
  const fy = y + d + 0.03;
  for (const [a, b, k] of [[x + 1, x + w / 2 - 0.4, x + w / 2 - 1.3], [x + w / 2 + 0.4, x + w - 1, x + w / 2 + 1.3]]) {
    s += p.plane(upright(fy, a, b, 1.2, h - 1.2), shade(C.wood, 0.06), { stroke: shade(C.wood, -0.28), strokeWidth: 0.3 });
    s += dot([k, fy + 0.02, h / 2], 0.45, C.gold);
  }
  // the foot, the screen's back box, the picture
  const { x0, x1, y: ty, z0, z1, t } = TV;
  const mid = (x0 + x1) / 2;
  s += p.box(mid - 2, ty - 1, h, 4, 2.4, 0.4, FRAME) + p.box(mid - 0.5, ty - 0.2, h + 0.4, 1, 0.6, z0 - h - 0.4, FRAME);
  s += p.box(x0, ty, z0, x1 - x0, t, z1 - z0, C.dark, { l: C.dark, r: shade(C.dark, -0.2) });
  const py = ty + t + 0.03;
  s += p.plane(upright(py, x0 + 0.5, x1 - 0.5, z0 + 0.5, z1 - 0.5), shade(C.dark, 0.3));
  // paused: a light circle with the triangle, the progress bar under it
  const [cx, cz] = [mid, (z0 + z1) / 2 + 0.4];
  const circle = Array.from({ length: 16 }, (_, i) => [cx + 1.9 * Math.cos((i * Math.PI) / 8), py + 0.02, cz + 1.9 * Math.sin((i * Math.PI) / 8)]);
  s += p.plane(circle, C.light);
  s += p.plane([[cx - 0.6, py + 0.04, cz - 1], [cx - 0.6, py + 0.04, cz + 1], [cx + 1.1, py + 0.04, cz]], C.roseDeep);
  const bz = z0 + 1.3;
  s += p.line([x0 + 1.4, py + 0.02, bz], [x1 - 1.4, py + 0.02, bz], shade(C.dark, 0.6), 0.35);
  s += p.line([x0 + 1.4, py + 0.04, bz], [x0 + 4.6, py + 0.04, bz], C.gold, 0.35);
  return s + dot([x0 + 4.6, py + 0.06, bz], 0.4, C.gold);
}

/* ---------- the basket of rolled fabric ---------- */

// a round wicker basket in the window's light, rolls of fabric standing in it
const BASKET = { x: 18, y: 41, r: 5, h: 5 };
// [u, v from its middle, colour, height], the back ones first
const ROLLS = [[-1.4, -2.4, C.rose, 7], [1.8, -1.8, C.sage, 8], [-2.8, 0.2, C.gold, 6.4], [0.4, 0.2, C.cream, 7.4], [2.8, 1.6, C.roseDeep, 6.6], [-0.8, 2.8, C.light, 6]];

function basket(p) {
  const { x, y, r, h } = BASKET;
  const wicker = shade(C.gold, -0.1);
  const [cx, cb] = project([x, y, 0]);
  const [rx, ry] = [num(r * ISO_RX), num(r * ISO_RY)];
  /** the front half of the ellipse of the basket at height z, left to right */
  const front = (z) => `M${xy([cx - rx, cb - z])}A${rx} ${ry} 0 0 0 ${xy([cx + rx, cb - z])}`;
  let s = p.shadow(x + 1, y + 1, 8, 2.8);
  s += disc([x, y, h], r, shade(C.woodDark, -0.1), ` stroke="${shade(wicker, 0.25)}" stroke-width="0.6"`); // the inside
  for (const [u, v, c, t] of ROLLS) s += drum([x + u, y + v, 1], 1.15, t, c, shade(c, 0.25)) + disc([x + u, y + v, 1 + t + 0.02], 0.4, shade(c, -0.15));
  // its front over the rolls' feet: the wall, woven bands across it, the rim
  s += `<path d="${front(0)}L${xy([cx + rx, cb - h])}A${rx} ${ry} 0 0 1 ${xy([cx - rx, cb - h])}Z" fill="${wicker}"/>`;
  for (const z of [1.3, 2.6, 3.9]) s += `<path d="${front(z)}" fill="none" stroke="${shade(wicker, -0.2)}" stroke-width="0.3"/>`;
  return s + `<path d="${front(h)}" fill="none" stroke="${shade(wicker, 0.25)}" stroke-width="0.7"/>`;
}

/* ---------- the plant ---------- */

const PLANT = { x: 4.5, y: 4.5, r: 2.6, pot: 5.2 };
// leaves: [u, v (screen offsets from the top of the pot), radius, turn], the back ones first
const LEAVES = [[-3.6, 8.5, 2.2, -50], [3.4, 9.2, 2.2, 45], [-1.4, 12.6, 2.2, -20], [1.6, 12.2, 2.1, 25], [-3.2, 4.6, 2, -70], [3, 5, 2, 65], [0, 9, 2.4, 0], [-1.6, 3, 1.8, -35], [1.6, 3.2, 1.8, 35]];

function plant(p) {
  const { x, y, r, pot } = PLANT;
  let s = p.shadow(x + 1, y + 1, 4, 1.5);
  s += drum([x, y, 0], r, pot, C.roseDeep, shade(C.woodDark, -0.1), ` stroke="${C.roseDeep}" stroke-width="0.5"`);
  const [bx, by] = project([x, y, pot]);
  LEAVES.forEach(([u, v, k, turn], i) => {
    const [cx, cy] = [num(bx + u), num(by - v)];
    s += `<line x1="${num(bx)}" y1="${num(by)}" x2="${cx}" y2="${cy}" stroke="${C.sageDeep}" stroke-width="0.3"/>`;
    s += `<ellipse cx="${cx}" cy="${cy}" rx="${k}" ry="${num(k * 0.62)}" transform="rotate(${turn} ${cx} ${cy})" fill="${i < 4 ? C.sageDeep : i < 7 ? C.sage : shade(C.sage, 0.15)}"/>`;
  });
  return s;
}

/* ---------- the model ---------- */

export default {
  key: 'about',
  size: [60, 50, 40],
  window: WINDOW,
  parts: [
    { id: 'rug', draw: rug },
    { id: 'plant', draw: plant, hit: corners(PLANT.x - 3.5, PLANT.y - 3.5, 0, 7, 7, PLANT.pot + 14) },
    { id: 'lamp', draw: lamp, hit: corners(LAMP.x - LAMP.r, LAMP.y - LAMP.r, 0, 2 * LAMP.r, 2 * LAMP.r, LAMP.top) },
    { id: 'screen', draw: screen, hit: [...corners(CAB.x, CAB.y, 0, CAB.w, CAB.d, CAB.h), ...corners(TV.x0, TV.y - 1, CAB.h, TV.x1 - TV.x0, TV.t + 1.2, TV.z1 - CAB.h)] },
    { id: 'armchair', draw: armchair, hit: corners(CHAIR.x, CHAIR.y, 0, CHAIR.w, CHAIR.d, CHAIR.top) },
    { id: 'side-table', draw: sideTable, hit: corners(TABLE.x - TABLE.r, TABLE.y - TABLE.r, 0, 2 * TABLE.r, 2 * TABLE.r, tableTop + 4.8) },
    { id: 'basket', draw: basket, hit: corners(BASKET.x - BASKET.r, BASKET.y - BASKET.r, 0, 2 * BASKET.r, 2 * BASKET.r, 1 + Math.max(...ROLLS.map((q) => q[3])) + 0.3) },
  ],
};

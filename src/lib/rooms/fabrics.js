/*
  The fabric room of Fabrics & Materials (/fabrics.html, and the Fabrics room of the house).

  As in Tools, not one item per product: four ZONES, each linking to its section of the
  list below (spec 4.3); an empty section turns its zone into decoration (check.js).
    tall shelf of folded and rolled fabric (back wall)       → fabrics
    a roll of batting, a roll of interfacing, a bag of stuffing → batting-interfacing
    low cabinet of elastic, twine and cord, a ribbon rack on it → trims
    small table: open sewing box, thread, zippers, buttons    → notions
  The shelf and the cabinet stand against the back wall (y = 0). In the house this room
  sits on the right and that wall is the house's outer wall, so the window is in it too
  (over the cabinet). The rolls stand along the left wall — in the house only a low
  partition, so nothing hangs on it — and the table stands free in the front.

  Decoration: the window and a knitted pouf in the window's light on the floor (POUF), both
  clear of the tap areas. Every tap area is the convex hull of its part's `hit`
  (render.js); the zones barely overlap, so a tap opens the zone you see.

  No brand names, logos or lettering on anything (the rolls' paper bands are plain).
  Model contract: src/lib/rooms/render.js. World units (cm-like): x → right-down,
  y → left-down, z → up; parts are listed back to front (painted in order).
*/
import { project } from '../anatomy/iso.js';
import { PALETTE as C, shade, num } from './paint.js';
import { dot, disc, flat, corners, shadowOn, ISO_RX, ISO_RY, WOOD, STEEL } from './props.js';

const xy = ([a, b]) => `${num(a)} ${num(b)}`;
const SHADE = C.dark; // laid thinly over the side of a round thing away from the light

/** Eight points round a horizontal circle (its screen extremes and the points between): for `hit`. */
const ringHit = ([x, y, z], r) => [0, 1, 2, 3, 4, 5, 6, 7].map((k) => [x + r * Math.cos((k * Math.PI) / 4), y + r * Math.sin((k * Math.PI) / 4), z]);

/** The world point that lands `dx` right and `dy` down (up when negative) of floor point (x, y) on the screen. */
const lift = ([x, y], dx, dy) => {
  const a = dx / (2 * Math.cos(Math.PI / 6));
  return dy >= 0 ? [x + a + dy, y - a + dy, 0] : [x + a, y - a, -dy];
};

/**
  An upright cylinder (a roll standing on its end, a spool, the pouf): its side down to the front
  half of its bottom circle, a band of shade on its right, then its top.
  `bands` — [z0, z1, colour] rings round its side (paper bands); `shaded: false` for the very small ones.
*/
function upright(p, [x, y, z], r, h, color, { top = shade(color, 0.1), edge = shade(color, -0.14), bands = [], shaded = true } = {}) {
  const [cx, by] = project([x, y, z]);
  const ty = by - h;
  const [rx, ry] = [r * ISO_RX, r * ISO_RY];
  const R = `${num(rx)} ${num(ry)} 0 0`;
  const yAt = (zz) => by - (zz - z);
  let s = `<path d="M${xy([cx - rx, ty])}L${xy([cx - rx, by])}A${R} 0 ${xy([cx + rx, by])}L${xy([cx + rx, ty])}Z" fill="${color}" stroke="${edge}" stroke-width="0.4"/>`;
  for (const [z0, z1, c] of bands) {
    s += `<path d="M${xy([cx - rx, yAt(z1)])}L${xy([cx - rx, yAt(z0)])}A${R} 0 ${xy([cx + rx, yAt(z0)])}L${xy([cx + rx, yAt(z1)])}A${R} 1 ${xy([cx - rx, yAt(z1)])}Z" fill="${c}"/>`;
  }
  const k = 0.35; // the shade starts this far right of the middle
  if (shaded) s += `<path d="M${xy([cx + k * rx, ty])}L${xy([cx + rx, ty])}L${xy([cx + rx, by])}A${R} 1 ${xy([cx + k * rx, by + ry * Math.sqrt(1 - k * k)])}Z" fill="${SHADE}" opacity=".1"/>`;
  return s + disc([x, y, z + h], r, top, ` stroke="${edge}" stroke-width="0.4"`);
}

/*
  A circle standing in a wall-like plane — x = const (it faces +x) or y = const (it faces +y) —
  is, through project(), the same ellipse as a horizontal one (rx = ISO_RX · r, ry = ISO_RY · r)
  turned by -60° (x) or +60° (y). Its outline as a cylinder along that axis leaves the circle
  at ±r · (∓ISO_RY · cos 30°, ISO_RY · 1.5) from its centre on the screen.
*/
const TURN = { x: -60, y: 60 };
const LEAVE = { x: [-ISO_RY * Math.cos(Math.PI / 6), ISO_RY * 1.5], y: [ISO_RY * Math.cos(Math.PI / 6), ISO_RY * 1.5] };

/** An upright circle facing +x or +y around a world point (the end of a roll, a coil of cord). */
function face(axis, [x, y, z], r, fill, extra = '') {
  const [cx, cy] = project([x, y, z]).map(num);
  return `<ellipse cx="${cx}" cy="${cy}" rx="${num(r * ISO_RX)}" ry="${num(r * ISO_RY)}" transform="rotate(${TURN[axis]} ${cx} ${cy})" fill="${fill}"${extra}/>`;
}

/** A coil (a roll seen end on): the ring and its dark hole. */
const coil = (axis, at, r, color) => face(axis, at, r, color, ` stroke="${shade(color, -0.2)}" stroke-width="0.3"`) + face(axis, at, r * 0.36, shade(C.woodDark, -0.3));

/**
  A cylinder lying along x or y (a ribbon spool on its rod, a rolled fabric), from `at` for `len`:
  its outline, then the end that faces the viewer (+x or +y) and its core.
*/
function lying(axis, [x, y, z], len, r, color) {
  const a = project([x, y, z]);
  const b = project(axis === 'x' ? [x + len, y, z] : [x, y + len, z]);
  const [lx, ly] = LEAVE[axis];
  const off = (q, k) => [q[0] + k * r * lx, q[1] + k * r * ly];
  const arc = (q) => `A${num(r * ISO_RX)} ${num(r * ISO_RY)} ${TURN[axis]} 0 ${axis === 'x' ? 0 : 1} ${xy(q)}`;
  const body = `<path d="M${xy(off(a, 1))}L${xy(off(b, 1))}${arc(off(b, -1))}L${xy(off(a, -1))}${arc(off(a, 1))}Z" fill="${color}" stroke="${shade(color, -0.16)}" stroke-width="0.3"/>`;
  const end = axis === 'x' ? [x + len, y, z] : [x, y + len, z];
  return body + face(axis, end, r, shade(color, -0.1)) + face(axis, end, r * 0.22, shade(C.woodDark, -0.2));
}

/* ---------- the fabric shelf (fabrics) ---------- */

// the shelf against the back wall: x 2..30, y 0.5..9.5, 35 tall, four open levels
const SHELF = { x: 2, y: 0.5, w: 28, d: 9, h: 35 };
const LEVELS = [0, 8.6, 17.2, 25.8]; // the boards of the four levels (1 thick); the top board is at h - 1
const PANEL = 0.8;
const FOLD = 2.1; // one folded piece of fabric
const BOLTS = [C.rose, C.sage, C.gold, C.cream, C.roseDeep, C.sageDeep, shade(C.rose, 0.4)];

/** A stack of folded fabric: one piece per colour, the first at the bottom; `dots` on some fronts. */
function stack(p, x, y, z, w, d, colors, dots = []) {
  let s = '';
  colors.forEach((c, i) => {
    const z0 = z + i * FOLD;
    s += p.box(x, y, z0, w, d, FOLD - 0.1, c);
    if (dots.includes(i)) {
      for (let k = 0; k < 4; k++) s += dot([x + 1 + k * ((w - 2) / 3), y + d + 0.02, z0 + (k % 2 ? 0.6 : 1.3)], 0.32, C.light);
    }
  });
  return s;
}

function shelf(p) {
  const { x, y, w, d, h } = SHELF;
  const inner = { x: x + PANEL, w: w - 2 * PANEL };
  let s = p.shadow(x + w / 2 + 2, y + d / 2 + 2, 18, 5.5);
  // the back board, darker, so the fabric stands out
  s += p.plane([[inner.x, y + 0.05, 0], [inner.x + inner.w, y + 0.05, 0], [inner.x + inner.w, y + 0.05, h], [inner.x, y + 0.05, h]], shade(C.wood, -0.28));
  s += p.box(x, y, 0, PANEL, d, h, C.wood, WOOD); // left side
  const slot = (inner.w - 0.9 * 4) / 3; // three stacks a level, 0.9 apart
  const sx = (i) => inner.x + 0.9 + i * (slot + 0.9);
  LEVELS.forEach((z0, lv) => {
    s += p.box(inner.x, y, z0, inner.w, d, 1, C.wood, WOOD);
    const z = z0 + 1;
    if (lv < 3) {
      // three stacks of folded fabric, three pieces each
      for (let i = 0; i < 3; i++) {
        const colors = [0, 1, 2].map((k) => BOLTS[(i * 3 + k + lv * 2) % BOLTS.length]);
        s += stack(p, sx(i), y + 1.2, z, slot, d - 2, colors, lv === 1 && i === 1 ? [1] : lv === 0 && i === 2 ? [2] : []);
      }
    } else {
      // the top level: rolled fabric, ends to the room, five below and four on them
      const r = 1.7;
      const step = inner.w / 5;
      const rolls = [];
      for (let i = 0; i < 5; i++) rolls.push([inner.x + step * (i + 0.5), z + r]);
      for (let i = 0; i < 4; i++) rolls.push([inner.x + step * (i + 1), z + r + r * 1.7]);
      rolls.forEach(([rx, rz], i) => { s += lying('y', [rx, y + 1, rz], d - 1.6, r, BOLTS[(i * 3 + 1) % BOLTS.length]); });
    }
  });
  s += p.box(x + w - PANEL, y, 0, PANEL, d, h - 1, C.wood, WOOD); // right side, in front of everything
  s += p.box(x, y, h - 1, w, d, 1, C.wood, WOOD); // the top
  return s;
}

/* ---------- the trims cabinet and the ribbon rack (trims) ---------- */

const CAB = { x: 38, y: 0.5, w: 19, d: 8.5, h: 11 };
// the ribbon rack on the cabinet: two rods along x at height `rods`, five spools of radius r on each
const RACK = { y: 4.2, rods: [15.2, 20.4], from: CAB.x + 1.4, to: CAB.x + CAB.w - 1.4, r: 2, top: CAB.h + 11.2 };
const SPOOL_LEN = (RACK.to - RACK.from - 4 * 0.5) / 5; // 0.5 apart
const RIBBONS = [[C.rose, C.gold, C.light, C.sage, C.roseDeep], [C.sageDeep, C.cream, C.rose, C.gold, C.beige]];

function cabinet(p) {
  const { x, y, w, d, h } = CAB;
  const fy = y + d + 0.02; // its front
  let s = p.shadow(x + w / 2 + 1.5, y + d / 2 + 1.5, 15, 4.5);
  s += p.box(x, y, 0, w, d, h, C.wood, WOOD);
  // three open cubbies on the front: coils of elastic, balls of twine, coils of cord — two below, one on them
  const CW = 5.3; // a cubby's width
  const cub = (k) => x + 0.9 + k * (CW + (w - 1.8 - 3 * CW) / 2);
  for (let k = 0; k < 3; k++) {
    s += p.plane([[cub(k), fy, 1.4], [cub(k) + CW, fy, 1.4], [cub(k) + CW, fy, 9.4], [cub(k), fy, 9.4]], shade(C.woodDark, -0.35));
  }
  const three = [[CW / 2 - 1.25, 3.2], [CW / 2 + 1.25, 3.2], [CW / 2, 6.5]];
  const at = (k, [u, z]) => [cub(k) + u, fy + 0.1, z];
  const twine = shade(C.wood, 0.25);
  three.forEach((q, i) => {
    s += coil('y', at(0, q), 1.4, i < 2 ? C.light : C.cream);
    s += dot(at(1, q), 1.45, twine) + dot(at(1, [q[0] - 0.45, q[1] + 0.45]), 0.45, shade(twine, 0.3));
    s += coil('y', at(2, q), 1.4, [C.rose, C.sage, C.gold][i]);
  });
  return s;
}

function ribbonRack(p) {
  const { y, rods, from, to, r, top } = RACK;
  const post = (px) => p.box(px, y - 0.4, CAB.h, 0.8, 0.8, top - CAB.h, C.woodDark);
  let s = post(from - 1.2);
  rods.forEach((z, i) => {
    s += p.line([from - 0.8, y, z], [to + 0.4, y, z], shade(C.woodDark, -0.2), 0.5);
    RIBBONS[i].forEach((c, k) => { s += lying('x', [from + k * (SPOOL_LEN + 0.5), y, z], SPOOL_LEN, r, c); });
  });
  // two ribbon ends hanging from the lower spools, over the front edge of the cabinet
  [[1, C.gold], [3, C.sage]].forEach(([k, c]) => {
    const sx = from + k * (SPOOL_LEN + 0.5) + SPOOL_LEN / 2;
    const pts = [[sx, y + r * 0.7, rods[0] - r * 0.7], [sx + 0.3, CAB.y + CAB.d - 0.4, CAB.h + 0.05], [sx + 0.3, CAB.y + CAB.d + 0.1, CAB.h - 0.3], [sx + 0.5, CAB.y + CAB.d + 0.1, CAB.h - 4.5]];
    s += `<path d="M${pts.map((q) => xy(project(q))).join('L')}" fill="none" stroke="${c}" stroke-width="1.1" stroke-linejoin="round"/>`;
  });
  return s + post(to + 0.4);
}

/* ---------- batting, interfacing and stuffing (batting-interfacing) ---------- */

const BATTING = { x: 5.4, y: 19, r: 4.6, h: 21 }; // a big roll of batting, standing on its end
const INTERFACING = { x: 4.6, y: 27.6, r: 2.5, h: 18 }; // a roll of interfacing on its cardboard tube
const SACK = [8, 37.5]; // a bag of stuffing on the floor: where its bottom is
// its outline for the tap area, in screen units from that point (the stuffing poking out included)
const SACK_HIT = [[-5.4, -0.6], [-6.2, -5], [-4.6, -10.6], [-3.2, -14.6], [3.2, -15.1], [4.6, -10.6], [6.2, -5], [5.4, -0.6], [0, 1.8], [-3, 1.2], [3, 1.2]];

function batting(p) {
  const { x, y, r, h } = BATTING;
  let s = p.shadow(x + 2, y + 2, 9, 3.5);
  s += upright(p, [x, y, 0], r, h, C.cream, { top: C.light, edge: shade(C.cream, -0.2), bands: [[8.5, 12.5, C.gold]] });
  // the wound layers on its top, and the hole in the middle
  for (const k of [0.68, 0.36]) s += disc([x, y, h], r * k, 'none', ` stroke="${shade(C.cream, -0.18)}" stroke-width="0.3"`);
  return s + disc([x, y, h], 0.6, shade(C.cream, -0.3));
}

function interfacing(p) {
  const { x, y, r, h } = INTERFACING;
  let s = p.shadow(x + 1.5, y + 1.5, 5, 2.4);
  s += upright(p, [x, y, 0], r, h, C.light, { edge: shade(C.beige, -0.18), bands: [[h - 3.4, h - 2.2, C.sage], [2.2, 3.4, C.sage]] });
  return s + disc([x, y, h], 0.9, shade(C.wood, 0.2)) + disc([x, y, h], 0.55, shade(C.woodDark, -0.2)); // its tube
}

function stuffing(p) {
  const [bx, by] = project([...SACK, 0]);
  const at = (dx, dy) => xy([bx + dx, by + dy]);
  const bag = shade(C.light, -0.02);
  let s = p.shadow(SACK[0] + 2, SACK[1] + 1, 7.5, 2.8);
  s += `<path d="M${at(-5.2, -0.6)}C${at(-6.8, -6)} ${at(-4.6, -10.6)} ${at(-1.8, -11.4)}L${at(1.8, -11.4)}C${at(4.6, -10.6)} ${at(6.8, -6)} ${at(5.2, -0.6)}Q${at(0, 2.6)} ${at(-5.2, -0.6)}Z" fill="${bag}" stroke="${shade(C.beige, -0.2)}" stroke-width="0.4"/>`;
  s += `<path d="M${at(1.6, -11.2)}C${at(4.2, -10.2)} ${at(6.3, -6)} ${at(4.9, -1)}Q${at(3.2, 0.6)} ${at(1.8, 1.1)}C${at(3.4, -3)} ${at(3.2, -8)} ${at(1.6, -11.2)}Z" fill="${SHADE}" opacity=".08"/>`;
  // the stuffing poking out of its neck, and the tie
  for (const [dx, dy, r] of [[-1.5, -13, 1.7], [1.3, -13.4, 1.8], [0, -12.4, 1.4]]) {
    s += `<circle cx="${num(bx + dx)}" cy="${num(by + dy)}" r="${r}" fill="${C.light}" stroke="${shade(C.beige, -0.12)}" stroke-width="0.3"/>`;
  }
  return s + `<ellipse cx="${num(bx)}" cy="${num(by - 11.4)}" rx="2.2" ry="0.8" fill="${C.rose}"/>`;
}

/* ---------- the notions table (notions) ---------- */

// the table stands free in the front, clear of the shelf on the screen; what is on it is placed from its corner
const TABLE = { x: 28, y: 33.5, w: 22, d: 15, z: 13, t: 1.4 };
const tableTop = TABLE.z + TABLE.t;
const onTable = (u, v) => [TABLE.x + u, TABLE.y + v];
const BOX = { x: TABLE.x + 2, y: TABLE.y + 2.4, w: 9.6, d: 6.8, h: 3.4, lid: 5.6 }; // the sewing box, its lid open to the back
const SPOOLS = [[15, 3.4, C.rose], [17.8, 4, C.sage], [15.8, 6.4, C.gold], [18.6, 7, C.roseDeep]].map(([u, v, c]) => [...onTable(u, v), c]);
const JAR = { x: TABLE.x + 15.6, y: TABLE.y + 10, s: 3.2, h: 3.8 }; // a glass jar of buttons
const ZIPPERS = [[[2.4, 10.6], [12.2, 11.6], C.sage], [[2, 12.6], [11.8, 13.6], C.gold]].map(([a, b, c]) => [onTable(...a), onTable(...b), c]);
const BUTTONS = [[13.8, 13.4, C.rose], [9.6, 8.6, C.sage]].map(([u, v, c]) => [...onTable(u, v), c]);

function table(p) {
  const { x, y, w, d, z, t } = TABLE;
  const leg = (lx, ly) => p.box(lx, ly, 0, 1.4, 1.4, z, C.woodDark);
  let s = p.shadow(x + w / 2 + 1.5, y + d / 2 + 1.5, 16, 6);
  s += leg(x + 0.8, y + 0.8) + leg(x + w - 2.2, y + 0.8);
  // a lower shelf with a wicker basket of zippers, their ends hanging out
  s += p.box(x + 1.2, y + 1.2, 3.6, w - 2.4, d - 2.4, 0.8, shade(C.wood, -0.06), WOOD);
  const [bx, by, bw, bd, bh] = [x + 4, y + 3, 9, 7.6, 3.8];
  const wicker = shade(C.wood, 0.12);
  s += p.box(bx, by, 4.4, bw, bd, bh, shade(C.woodDark, -0.25), { l: wicker, r: shade(wicker, -0.16) });
  for (let i = 1; i <= 2; i++) s += p.line([bx, by + bd, 4.4 + (bh * i) / 3], [bx + bw, by + bd, 4.4 + (bh * i) / 3], C.woodDark, 0.22);
  [[2, C.rose], [4.5, C.sageDeep], [7, C.gold]].forEach(([u, c]) => {
    s += p.line([bx + u, by + bd - 1, 4.4 + bh], [bx + u + 0.4, by + bd + 0.4, 4.4 + bh - 2.4], c, 0.9);
  });
  s += leg(x + 0.8, y + d - 2.2);
  s += p.box(x + 0.8, y + d - 1.6, z - 1.8, w - 1.6, 0.8, 1.8, C.wood, WOOD); // the apron along the front
  s += leg(x + w - 2.2, y + d - 2.2);
  return s + p.box(x, y, z, w, d, t, C.wood, WOOD);
}

function sewingBox(p) {
  const { x, y, w, d, h, lid } = BOX;
  const z = tableTop;
  const top = z + h;
  let s = shadowOn(p, [x + w / 2 + 1, y + d / 2 + 1, z], 7, 2.4);
  // the lid, hinged at the back edge and leaning back by 1: its lining faces the room
  const back = (u, v) => [x + u, y - v, top + lid * v];
  s += p.plane([back(0, 0), back(w, 0), back(w, 1), back(0, 1)], C.woodDark);
  s += p.plane([back(0.5, 0.08), back(w - 0.5, 0.08), back(w - 0.5, 0.92), back(0.5, 0.92)].map(([a, b, c]) => [a, b + 0.05, c]), C.rose);
  for (const [u, v] of [[2, 0.3], [4.8, 0.6], [7.6, 0.3], [3.2, 0.84], [6.4, 0.84], [5, 0.2]]) s += dot([x + u, y - v + 0.08, top + lid * v], 0.34, C.cream);
  // the box: its top is the dark inside, split into compartments of little things
  s += p.box(x, y, z, w, d, h, shade(C.woodDark, -0.3), { l: C.wood, r: shade(C.wood, -0.18) });
  const cells = [[0, 0, C.gold], [1, 0, C.sage], [2, 0, C.rose], [0, 1, C.rose], [1, 1, C.light], [2, 1, C.sageDeep]];
  const cw = (w - 0.8) / 3;
  const cd = (d - 0.8) / 2;
  for (const [i, j, c] of cells) {
    const [x0, y0] = [x + 0.4 + i * cw + 0.25, y + 0.4 + j * cd + 0.25];
    s += p.plane(flat(x0, x0 + cw - 0.5, y0, y0 + cd - 0.5, top - 0.4), c);
  }
  // buttons in the front compartments
  for (const [u, v, c] of [[1.5, 4.6, C.cream], [2.5, 5.5, C.gold], [5.2, 4.6, C.rose], [7.6, 5.2, C.gold], [8.3, 4.3, C.cream]]) s += disc([x + u, y + v, top - 0.3], 0.6, c, ` stroke="${shade(c, -0.25)}" stroke-width="0.15"`);
  return s;
}

function spools(p) {
  let s = '';
  for (const [x, y, c] of SPOOLS) {
    const flange = shade(C.wood, 0.3);
    s += disc([x, y, tableTop], 1.25, flange);
    s += upright(p, [x, y, tableTop + 0.3], 0.95, 2.4, c, { shaded: false });
    s += disc([x, y, tableTop + 2.7], 1.25, flange, ` stroke="${shade(flange, -0.2)}" stroke-width="0.2"`) + disc([x, y, tableTop + 2.72], 0.35, shade(C.woodDark, -0.2));
  }
  return s;
}

/** A zipper lying on the table from (x0, y0) to (x1, y1): its tape, its row of teeth and the pull at the start. */
function zipper(p, [x0, y0], [x1, y1], color) {
  const z = tableTop + 0.03;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const [nx, ny] = [-(y1 - y0) / len * 0.75, (x1 - x0) / len * 0.75]; // half its width, across
  let s = p.plane([[x0 + nx, y0 + ny, z], [x1 + nx, y1 + ny, z], [x1 - nx, y1 - ny, z], [x0 - nx, y0 - ny, z]], color, { stroke: shade(color, -0.15), strokeWidth: 0.2 });
  const [a, b] = [project([x0, y0, z]), project([x1, y1, z])];
  s += `<line x1="${num(a[0])}" y1="${num(a[1])}" x2="${num(b[0])}" y2="${num(b[1])}" stroke="${STEEL}" stroke-width="0.55" stroke-dasharray=".22 .2"/>`;
  return s + p.box(x0 - 0.45, y0 - 0.45, z, 0.9, 0.9, 0.35, C.gold) + p.line([x0, y0, z + 0.35], [x0 - 0.9 * Math.sign(x1 - x0), y0, z + 0.4], C.gold, 0.45);
}

function jar(p) {
  const { x, y, s: size, h } = JAR;
  const z = tableTop;
  let s = p.box(x, y, z, size, size, h, C.glass, { l: shade(C.glass, -0.04), r: shade(C.glass, -0.1) });
  [[0.6, 0.8, C.rose], [1.6, 1.2, C.sage], [2.3, 0.7, C.gold], [1, 2, C.gold], [2, 2.3, C.roseDeep], [0.7, 2.8, C.sageDeep]].forEach(([u, v, c]) => {
    s += dot([x + u, y + size, z + v], 0.42, c);
  });
  return s + p.box(x - 0.1, y - 0.1, z + h, size + 0.2, size + 0.2, 0.6, C.gold);
}

const looseButtons = () => BUTTONS
  .map(([x, y, c]) => disc([x, y, tableTop + 0.1], 0.85, c, ` stroke="${shade(c, -0.25)}" stroke-width="0.2"`) +
    dot([x - 0.25, y + 0.1, tableTop + 0.12], 0.14, shade(c, -0.4)) + dot([x + 0.25, y - 0.1, tableTop + 0.12], 0.14, shade(c, -0.4)))
  .join('');

/* ---------- decoration ---------- */

// a knitted pouf on the floor, in the light of the window
export const POUF = { x: 54, y: 27, r: 4.4, h: 6 };

function pouf(p) {
  const { x, y, r, h } = POUF;
  const knit = shade(C.sage, 0.18);
  let s = p.shadow(x + 1.5, y + 1.5, 7.5, 3);
  s += upright(p, [x, y, 0], r, h, C.sage, { top: shade(C.sage, 0.12), edge: C.sageDeep });
  // knitted ribs down its side, the button in the middle of its top
  for (const a of [-20, 10, 40, 70, 100]) {
    const t = (a * Math.PI) / 180;
    s += p.line([x + r * Math.cos(t), y + r * Math.sin(t), h - 0.4], [x + r * Math.cos(t), y + r * Math.sin(t), 0.5], knit, 0.35);
  }
  return s + disc([x, y, h], r * 0.55, 'none', ` stroke="${knit}" stroke-width="0.3"`) + disc([x, y, h + 0.05], 0.55, C.sageDeep);
}

/* ---------- the model ---------- */

export default {
  key: 'fabrics',
  size: [60, 50, 40],
  window: { wall: 'back', from: 40, to: 56, z: [24, 35] }, // over the cabinet
  parts: [
    {
      id: 'fabric-shelf',
      draw: shelf,
      target: { section: 'fabrics' },
      hit: corners(SHELF.x, SHELF.y, 0, SHELF.w, SHELF.d, SHELF.h),
    },
    {
      id: 'trims-cabinet',
      draw: (p) => cabinet(p) + ribbonRack(p),
      target: { section: 'trims' },
      hit: [
        ...corners(CAB.x, CAB.y, 0, CAB.w, CAB.d, CAB.h),
        ...corners(RACK.from - 1.2, RACK.y - RACK.r, CAB.h, RACK.to - RACK.from + 2.4, 2 * RACK.r, RACK.top - CAB.h),
      ],
    },
    {
      id: 'batting-rolls',
      draw: (p) => batting(p) + interfacing(p) + stuffing(p),
      target: { section: 'batting-interfacing' },
      hit: [
        ...ringHit([BATTING.x, BATTING.y, 0], BATTING.r), ...ringHit([BATTING.x, BATTING.y, BATTING.h], BATTING.r),
        ...ringHit([INTERFACING.x, INTERFACING.y, 0], INTERFACING.r), ...ringHit([INTERFACING.x, INTERFACING.y, INTERFACING.h], INTERFACING.r),
        ...SACK_HIT.map(([dx, dy]) => lift(SACK, dx, dy)),
      ],
    },
    {
      id: 'notions-table',
      draw: (p) => table(p) + sewingBox(p) + spools(p) + ZIPPERS.map(([a, b, c]) => zipper(p, a, b, c)).join('') + looseButtons() + jar(p),
      target: { section: 'notions' },
      hit: [
        ...corners(TABLE.x, TABLE.y, 0, TABLE.w, TABLE.d, tableTop),
        [BOX.x, BOX.y - 1, tableTop + BOX.h + BOX.lid], [BOX.x + BOX.w, BOX.y - 1, tableTop + BOX.h + BOX.lid],
        [JAR.x + JAR.s, JAR.y, tableTop + JAR.h + 0.6],
      ],
    },
    { id: 'pouf', draw: pouf },
  ],
};

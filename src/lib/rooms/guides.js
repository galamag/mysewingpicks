/*
  The classroom of Guides (/guides.html; spec «Гайды», 8): where the techniques are learnt.

  As in Tools and Fabrics, four ZONES, each linking to its group of guides in the list below;
  a group without a guide turns its zone into decoration (check.js, catalogOf('guides')).
    sewing table with the machine, its thread path lit           → machine
    cutting table: mat, long ruler, strips of fabric, the cutter  → cutting
    small table: a tote half made, its lining pulled out over it  → construction
    design wall: four patchwork blocks pinned to the back wall    → patchwork
  The design wall hangs on the back wall (y = 0): in the house (stage 3) this room sits in the
  middle at the back, its back wall is the house's outer wall and its left wall a low partition, so
  nothing hangs on the left wall. The window is in the back wall too, over a low bookcase.

  Decoration: the window, the bookcase under it (BOOKSHELF), two stools at the sewing table (STOOLS)
  and the oval rug under them (RUG) — clear of the tap areas (tested). Every tap area is the convex
  hull of its part's `hit` (render.js), so the hits leave out what stands in front anyway: the front
  legs of the sewing table only down to the stools' seats. The four zones stand apart on the screen
  (the bookcase stands between the design wall and the small table, the window over it), so each
  keeps a thumb's square of its own on a 320 px phone.

  Every zone has its group's name in a corner of the picture (`label`, render.js; the names are the
  only lettering): the design wall top left, the half-made tote top right, the machine bottom left,
  the cutting mat bottom right — the leaders do not cross.

  No brand names, logos or lettering on anything (the machine is a generic one).
  Model contract: src/lib/rooms/render.js. World units (cm-like): x → right-down,
  y → left-down, z → up; parts are listed back to front (painted in order).
*/
import { project } from '../anatomy/iso.js';
import { PALETTE as C, shade, num } from './paint.js';
import { dot, disc, flat, corners, shadowOn, ISO_RX, ISO_RY, STEEL, WOOD } from './props.js';

const xy = ([a, b]) => `${num(a)} ${num(b)}`;
const path = (pts) => pts.map((q) => xy(project(q))).join('L');

/* ---------- the window and the low bookcase under it (decoration) ---------- */

const WINDOW = { wall: 'back', from: 24, to: 33, z: [21, 33] };

// a low bookcase against the back wall, under the window: two shelves of books, a plant on top
export const BOOKSHELF = { x: 23.5, y: 0.5, w: 10, d: 6, h: 14 };
const BOOKS = [C.rose, C.sage, C.gold, C.roseDeep, C.sageDeep, C.cream, C.rose, C.gold, C.sage];

function bookcase(p) {
  const { x, y, w, d, h } = BOOKSHELF;
  const panel = 0.8;
  let s = p.shadow(x + w / 2 + 1, y + d / 2 + 1, 10, 3.2);
  s += p.plane([[x + panel, y + 0.05, 0], [x + w - panel, y + 0.05, 0], [x + w - panel, y + 0.05, h], [x + panel, y + 0.05, h]], shade(C.wood, -0.28));
  s += p.box(x, y, 0, panel, d, h, C.wood, WOOD); // left side
  [0, 6.6].forEach((z0, k) => {
    s += p.box(x + panel, y, z0, w - 2 * panel, d, 0.8, C.wood, WOOD);
    // a row of standing books; on the upper shelf fewer, and a stack of lying ones after them
    let bx = x + panel + 0.3;
    const n = k ? 3 : 6;
    for (let i = 0; i < n; i++) {
      const bw = 1.1 + ((i * 5 + k) % 3) * 0.2;
      const bh = 4.4 + ((i * 7 + k * 3) % 4) * 0.45;
      s += p.box(bx, y + 1.2, z0 + 0.8, bw, d - 2.2, bh, BOOKS[(i + k * 4) % BOOKS.length]);
      bx += bw + 0.08;
    }
    if (k) {
      [[C.sage, 0], [C.cream, 1], [C.roseDeep, 2]].forEach(([c, j]) => {
        s += p.box(bx + 0.4 + j * 0.15, y + 1.2, z0 + 0.8 + j * 0.9, x + w - panel - bx - 0.8, d - 2.4, 0.85, c);
      });
    }
  });
  s += p.box(x + w - panel, y, 0, panel, d, h, C.wood, WOOD); // right side
  s += p.box(x, y, h, w, d, 0.8, C.wood, WOOD); // the top
  // a plant on top: its pot, then its leaves
  const [px, py, pz] = [x + w - 2.6, y + 3, h + 0.8];
  s += p.box(px - 1.4, py - 1.4, pz, 2.8, 2.8, 2.6, C.rose, { l: C.roseDeep, r: shade(C.roseDeep, -0.12) });
  for (const [u, v, r] of [[-1.2, 3.6, 1.3], [1.3, 3.4, 1.2], [0, 5.2, 1.4], [-0.6, 6.6, 1], [0.8, 6.2, 0.9]]) {
    const [cx, cy] = project([px, py, pz + 2.6]);
    s += `<ellipse cx="${num(cx + u)}" cy="${num(cy - v + 2.6)}" rx="${r}" ry="${num(r * 1.6)}" transform="rotate(${num(u * 14)} ${num(cx + u)} ${num(cy - v + 2.6)})" fill="${u < 0 ? C.sageDeep : C.sage}"/>`;
  }
  return s;
}

/* ---------- the design wall (patchwork) ---------- */

// a felt board on the back wall, by the back corner; four blocks pinned to it (2 × 2)
const BOARD = { x: 3, x1: 21, z: 12, z1: 35.4 };
const BLOCKS = [[4.2, 11.6, 24.4, 33.4], [12.4, 19.8, 24.4, 33.4], [4.2, 11.6, 13.6, 22.6], [12.4, 19.8, 13.6, 22.6]]; // [x0, x1, z0, z1]

function designWall(p) {
  const { x, x1, z, z1 } = BOARD;
  const on = (y) => (a, b, c, d) => [[a, y, c], [b, y, c], [b, y, d], [a, y, d]];
  let s = p.plane(on(0.3)(x, x1, z, z1), C.woodDark, { stroke: shade(C.woodDark, -0.15), strokeWidth: 0.4 }); // the frame
  s += p.plane(on(0.4)(x + 0.5, x1 - 0.5, z + 0.5, z1 - 0.5), C.cream); // the felt
  const R = on(0.5);
  const y = 0.5;
  // half-square triangles: a pinwheel of four
  {
    const [a, b, c, d] = BLOCKS[0];
    const [m, n] = [(a + b) / 2, (c + d) / 2];
    s += p.plane(R(a, b, c, d), C.light);
    // one rose triangle in each quarter, all turning the same way round the middle
    for (const tri of [
      [[a, y, d], [m, y, d], [m, y, n]], [[b, y, d], [b, y, n], [m, y, n]],
      [[b, y, c], [m, y, c], [m, y, n]], [[a, y, c], [a, y, n], [m, y, n]],
    ]) s += p.plane(tri, C.rose);
  }
  // nine-patch
  {
    const [a, b, c, d] = BLOCKS[1];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      s += p.plane(R(a + ((b - a) * i) / 3, a + ((b - a) * (i + 1)) / 3, c + ((d - c) * j) / 3, c + ((d - c) * (j + 1)) / 3), (i + j) % 2 ? C.light : C.sage);
    }
  }
  // four-patch
  {
    const [a, b, c, d] = BLOCKS[2];
    const [m, n] = [(a + b) / 2, (c + d) / 2];
    s += p.plane(R(a, m, n, d), C.gold) + p.plane(R(m, b, n, d), C.roseDeep) + p.plane(R(a, m, c, n), C.roseDeep) + p.plane(R(m, b, c, n), C.gold);
  }
  // flying geese, two of them
  {
    const [a, b, c, d] = BLOCKS[3];
    const n = (c + d) / 2;
    s += p.plane(R(a, b, c, d), C.light);
    s += p.plane([[a, y, c], [b, y, c], [(a + b) / 2, y, n]], C.sageDeep);
    s += p.plane([[a, y, n], [b, y, n], [(a + b) / 2, y, d]], C.sage);
  }
  // the seams of every block, and a pin at its top
  for (const [a, b, c, d] of BLOCKS) {
    s += p.plane(R(a, b, c, d).map(([u, , w]) => [u, y + 0.02, w]), 'none', { stroke: shade(C.cream, -0.25), strokeWidth: 0.25 });
    s += dot([(a + b) / 2, y + 0.1, d - 0.5], 0.45, C.gold);
  }
  return s;
}

/* ---------- the sewing table and the machine (machine) ---------- */

const SEW = { x: 1, y: 28, w: 20, d: 12, z: 15, t: 1.6 };
const sewTop = SEW.z + SEW.t;
const MACHINE = { x: 3.5, y: 31, w: 15, d: 6, h: 11.4 }; // its front (needle, dial) to the room (+y)

function sewingTable(p) {
  const { x, y, w, d, z, t } = SEW;
  const leg = (lx, ly) => p.box(lx, ly, 0, 1.4, 1.4, z, C.woodDark);
  let s = p.shadow(x + w / 2 + 1, y + d / 2 + 1, 16, 5.5);
  s += leg(x + 0.6, y + 0.6) + leg(x + w - 2, y + 0.6);
  s += leg(x + 0.6, y + d - 2) + leg(x + w - 2, y + d - 2);
  // the apron along the front, with a drawer and its knob
  s += p.box(x + 0.6, y + d - 1.6, z - 2.6, w - 1.2, 1, 2.6, C.wood, WOOD);
  const fy = y + d - 0.58;
  s += p.plane([[x + 6, fy, z - 2.2], [x + 14, fy, z - 2.2], [x + 14, fy, z - 0.4], [x + 6, fy, z - 0.4]], shade(C.wood, -0.05), { stroke: shade(C.wood, -0.3), strokeWidth: 0.3 });
  s += dot([x + 10, fy + 0.02, z - 1.3], 0.5, C.gold);
  s += p.box(x, y, z, w, d, t, C.wood, WOOD);
  return s;
}

function machine(p) {
  const { x, y, w, d, h } = MACHINE;
  const z = sewTop;
  const body = C.light;
  const faces = { l: shade(body, -0.06), r: shade(body, -0.17) };
  const fy = y + d - 0.5; // the front of the pillar, the arm and the head
  let s = shadowOn(p, [x + w / 2, y + d / 2 + 0.5, z], 10, 2.6);
  s += p.box(x, y, z, w, d, 2.4, body, faces); // the bed
  s += p.plane(flat(x + w - 5, x + w - 2.6, y + 1.2, y + d - 0.6, z + 2.42), STEEL); // the needle plate
  s += p.box(x + 0.5, y + 0.5, z + 2.4, 4.2, d - 1, 6, body, faces); // the pillar
  s += p.box(x + w - 4, y + 0.5, z + 4.6, 3.6, d - 1, 3.8, body, faces); // the needle head
  s += p.line([x + w - 2.6, fy - 1.4, z + 4.6], [x + w - 2.6, fy - 1.4, z + 3.1], STEEL, 0.5); // the needle
  s += p.box(x + w - 3.4, fy - 2.4, z + 2.4, 1.8, 1.6, 0.5, STEEL); // the presser foot
  s += p.box(x + 0.5, y + 0.5, z + 8.4, w - 1, d - 1, h - 8.4, body, { l: C.sage, r: faces.r }); // the arm, its front sage
  // the stitch dial on the pillar front
  s += p.plane([[x + 1.2, fy + 0.02, z + 3.4], [x + 4, fy + 0.02, z + 3.4], [x + 4, fy + 0.02, z + 7.6], [x + 1.2, fy + 0.02, z + 7.6]], shade(body, -0.04), { stroke: shade(body, -0.2), strokeWidth: 0.3 });
  s += dot([x + 2.6, fy + 0.04, z + 6.2], 0.9, C.rose);
  s += dot([x + 2.6, fy + 0.04, z + 4.4], 0.45, C.gold);
  // the spool on its pin on the arm
  const [sx, sy] = [x + 3, y + 2.4];
  s += disc([sx + 0.7, sy + 0.7, z + h], 0.95, shade(C.roseDeep, -0.1));
  s += p.box(sx, sy, z + h, 1.4, 1.4, 1.8, C.rose);
  s += disc([sx + 0.7, sy + 0.7, z + h + 1.8], 0.95, shade(C.rose, 0.15));
  // the thread path, lit: what the threading guide is about — from the spool along the top to the
  // tension guide, down the front of the head to the take-up lever, back up, down to the needle
  const hx = x + w - 2.6;
  const thread = [
    [sx + 0.7, sy + 0.7, z + h + 1.6], [hx - 2, sy + 0.9, z + h + 0.05], [hx, fy + 0.02, z + h - 0.6],
    [hx - 0.9, fy + 0.02, z + 7.4], [hx, fy + 0.02, z + h - 1.6], [hx + 0.2, fy - 1.4, z + 4.6],
  ];
  s += `<path d="M${path(thread)}" fill="none" stroke="${C.gold}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" opacity=".38"/>`;
  s += `<path d="M${path(thread)}" fill="none" stroke="${C.roseDeep}" stroke-width="0.4" stroke-linejoin="round" stroke-linecap="round"/>`;
  for (const q of [thread[1], thread[2], thread[3]]) s += dot(q, 0.36, C.gold);
  return s;
}

/* ---------- stools and the rug (decoration) ---------- */

export const STOOLS = [{ x: 7, y: 46.2, r: 2.2, h: 9 }, { x: 15, y: 46.2, r: 2.2, h: 9 }];
// an oval braided rug on the floor under them: rx along the table (x), ry across (y)
export const RUG = { x: 11, y: 45.2, rx: 8.6, ry: 4.4 };

function rug(p) {
  const { x, y, rx, ry } = RUG;
  const ring = (k) => Array.from({ length: 32 }, (_, i) => [x + k * rx * Math.cos((i * Math.PI) / 16), y + k * ry * Math.sin((i * Math.PI) / 16), 0.04]);
  const braid = shade(C.rose, 0.3);
  return p.plane(ring(1), shade(C.rose, 0.55), { stroke: braid, strokeWidth: 0.5 }) +
    p.plane(ring(0.72), 'none', { stroke: braid, strokeWidth: 0.5 }) +
    p.plane(ring(0.42), shade(C.rose, 0.42), { stroke: braid, strokeWidth: 0.4 });
}

function stool(p, { x, y, r, h }) {
  let s = p.shadow(x + 1, y + 1, 4, 1.5);
  // three splayed legs, the back one first
  for (const a of [225, 345, 105]) {
    const t = (a * Math.PI) / 180;
    s += p.line([x + r * 0.55 * Math.cos(t), y + r * 0.55 * Math.sin(t), h - 0.6], [x + r * 0.95 * Math.cos(t), y + r * 0.95 * Math.sin(t), 0.2], C.woodDark, 0.7);
  }
  // a round seat: its side, then its sage cushion
  const [cx, by] = project([x, y, h - 0.9]);
  const ty = by - 0.9;
  const [rx, ry] = [r * ISO_RX, r * ISO_RY];
  s += `<path d="M${xy([cx - rx, ty])}L${xy([cx - rx, by])}A${num(rx)} ${num(ry)} 0 0 0 ${xy([cx + rx, by])}L${xy([cx + rx, ty])}Z" fill="${C.wood}" stroke="${shade(C.wood, -0.25)}" stroke-width="0.3"/>`;
  return s + disc([x, y, h], r, C.sage, ` stroke="${C.sageDeep}" stroke-width="0.4"`) + disc([x, y, h + 0.02], r * 0.45, shade(C.sage, 0.15));
}

/* ---------- the half-made tote (construction) ---------- */

// a small table against the back wall, at the right
const SIDE = { x: 45, y: 2, w: 13, d: 10, z: 10, t: 1.2 };
const sideTop = SIDE.z + SIDE.t;
// the tote standing on it, half made (the tote of the Projects room: its check, its satin lining):
// the lining pulled out over its front, the turning gap in it still open, a needle in it to close it
const BAG = { x: 47, y: 4.6, w: 9, d: 3.4, h: 8.6, rise: 6, half: 2.3, drop: 4.2 };
const SATIN = '#e6d0ae'; // the tote's satin lining, as in the Projects room and its anatomy

function sideTable(p) {
  const { x, y, w, d, z, t } = SIDE;
  const leg = (lx, ly) => p.box(lx, ly, 0, 1.2, 1.2, z, C.woodDark);
  let s = p.shadow(x + w / 2 + 1, y + d / 2 + 1, 11, 4);
  s += leg(x + 0.6, y + 0.6) + leg(x + w - 1.8, y + 0.6);
  s += p.box(x + 1, y + 1, 3, w - 2, d - 2, 0.7, shade(C.wood, -0.06), WOOD); // a lower shelf
  // a folded lining waiting on it
  s += p.box(x + 2.4, y + 2.6, 3.7, 5, 4.4, 0.9, C.sage) + p.box(x + 2.4, y + 2.6, 4.6, 5, 4.4, 0.9, shade(C.sage, 0.2));
  s += leg(x + 0.6, y + d - 1.8) + leg(x + w - 1.8, y + d - 1.8);
  return s + p.box(x, y, z, w, d, t, C.wood, WOOD);
}

function tote(p) {
  const { x, y, w, d, h, rise, half, drop } = BAG;
  const z = sideTop;
  const zt = z + h; // the rim
  const [cx, fy] = [x + w / 2, y + d + 0.02];
  const strap = (sy) => {
    const [a, b, c, e] = [[cx - half, sy, zt - 0.4], [cx - half, sy, zt + rise * 1.33], [cx + half, sy, zt + rise * 1.33], [cx + half, sy, zt - 0.4]].map(project);
    return `<path d="M${xy(a)}C${xy(b)} ${xy(c)} ${xy(e)}" fill="none" stroke="${C.roseDeep}" stroke-width="1.1" stroke-linecap="round"/>`;
  };
  let s = shadowOn(p, [x + w / 2 + 1, y + d / 2 + 1, z], 6.5, 2.2);
  s += strap(y + 0.4);
  // the bag: rose sides, the satin of the lining seen through the open top
  s += p.box(x, y, z, w, d, h, SATIN, { l: C.rose, r: shade(C.rose, -0.16) });
  s += p.plane([[x, y, zt], [x, y + d, zt], [x, y, zt - d]], shade(SATIN, 0.1)); // the far walls inside
  s += p.plane([[x, y, zt], [x + w, y, zt], [x + w - d, y, zt - d], [x, y, zt - d]], shade(SATIN, -0.1));
  // the check on its front, below where the lining hangs over it
  const [cw, ch] = [w / 3, (h - drop) / 2];
  for (const [i, j, c] of [[1, 0, C.cream], [0, 1, C.gold], [2, 1, C.sage], [2, 0, C.cream]]) {
    s += p.plane([[x + i * cw, fy, z + j * ch], [x + (i + 1) * cw, fy, z + j * ch], [x + (i + 1) * cw, fy, z + (j + 1) * ch], [x + i * cw, fy, z + (j + 1) * ch]], c);
  }
  s += p.plane([[x + w + 0.02, y, z + ch], [x + w + 0.02, y + d, z + ch], [x + w + 0.02, y + d, z + 2 * ch], [x + w + 0.02, y, z + 2 * ch]], shade(C.gold, -0.12));
  // the lining, pulled out of the top and hanging over the front; its hem (right to left) in three
  // soft scallops
  const ly = fy + 0.06;
  let hem = '';
  for (let i = 0; i < 3; i++) {
    const [a, b] = [x + w - (w * i) / 3, x + w - (w * (i + 1)) / 3];
    hem += `Q${xy(project([(a + b) / 2, ly + 0.3, zt - drop - 0.9]))} ${xy(project([b - (i === 2 ? 0.1 : 0), ly + 0.3, zt - drop + (i === 2 ? 0.2 : 0.35)]))}`;
  }
  s += `<path d="M${path([[x - 0.1, ly, zt + 0.5], [x + w + 0.1, ly, zt + 0.5], [x + w + 0.1, ly + 0.3, zt - drop + 0.2]])}${hem}Z" fill="${SATIN}" stroke="${shade(SATIN, -0.2)}" stroke-width="0.3" stroke-linejoin="round"/>`;
  s += p.plane([[x - 0.1, ly, zt + 0.5], [x + w + 0.1, ly, zt + 0.5], [x + w + 0.1, ly, zt - 0.4], [x - 0.1, ly, zt - 0.4]], shade(SATIN, 0.18)); // its fold over the rim
  // the turning gap in its seam, still open, and a needle in it with the thread to close it
  const [g0, g1, gz] = [x + w * 0.3, x + w * 0.7, zt - drop + 1.4];
  s += p.line([x + 0.6, ly + 0.05, gz], [g0, ly + 0.05, gz], shade(SATIN, -0.35), 0.25) + p.line([g1, ly + 0.05, gz], [x + w - 0.6, ly + 0.05, gz], shade(SATIN, -0.35), 0.25);
  s += `<path d="M${path([[g0, ly + 0.05, gz], [(g0 + g1) / 2, ly + 0.05, gz - 0.55], [g1, ly + 0.05, gz], [(g0 + g1) / 2, ly + 0.05, gz + 0.45]])}Z" fill="${shade(C.dark, 0.25)}"/>`;
  s += p.line([g1 + 0.4, ly + 0.1, gz - 0.4], [g1 + 2, ly + 0.1, gz + 1.6], STEEL, 0.3);
  const [na, nb] = [project([g1 + 0.4, ly + 0.1, gz - 0.4]), project([x + w + 0.8, ly + 0.2, z + 1])];
  s += `<path d="M${xy(na)}Q${xy([nb[0] + 0.6, na[1] + 1])} ${xy(nb)}" fill="none" stroke="${C.gold}" stroke-width="0.25"/>`;
  return s + strap(y + d - 0.4);
}

// a spool of thread and the thread snips by the tote
function smallThings(p) {
  const z = sideTop;
  const [sx, sy] = [SIDE.x + 1.6, SIDE.y + 7.6];
  let s = disc([sx, sy, z], 1, shade(C.wood, 0.3));
  s += p.box(sx - 0.65, sy - 0.65, z + 0.2, 1.3, 1.3, 1.8, C.sageDeep) + disc([sx, sy, z + 2], 1, shade(C.wood, 0.3));
  // the snips, lying: two blades and a gold spring
  const [kx, ky] = [SIDE.x + 9.6, SIDE.y + 8.4];
  s += p.line([kx, ky, z + 0.1], [kx + 2.6, ky - 0.5, z + 0.1], STEEL, 0.45) + p.line([kx, ky + 0.5, z + 0.1], [kx + 2.6, ky - 0.2, z + 0.1], STEEL, 0.45);
  return s + dot([kx - 0.2, ky + 0.25, z + 0.15], 0.5, C.gold);
}

/* ---------- the cutting table (cutting) ---------- */

const CUT = { x: 32, y: 28, w: 24, d: 16, z: 15, t: 1.4 };
const cutTop = CUT.z + CUT.t;

function cuttingTable(p) {
  const { x, y, w, d, z, t } = CUT;
  const leg = (lx, ly) => p.box(lx, ly, 0, 1.6, 1.6, z, C.woodDark);
  let s = p.shadow(x + w / 2 + 1, y + d / 2 + 1, 20, 6.5);
  s += leg(x + 0.8, y + 0.8) + leg(x + w - 2.4, y + 0.8);
  s += p.box(x + 1.4, y + 1.4, 4, w - 2.8, d - 2.8, 0.8, shade(C.wood, -0.06), WOOD); // the lower shelf
  // rolls of strips (jelly rolls) on the lower shelf, tied
  [[5, C.rose], [10.5, C.sage], [16, C.gold]].forEach(([u, c]) => {
    const [cx, cy] = [x + u, y + d / 2];
    s += disc([cx, cy, 4.8], 2.1, shade(c, -0.15)) + p.box(cx - 1.48, cy - 1.48, 4.8, 2.96, 2.96, 2.6, c, { l: c, r: shade(c, -0.15) }) + disc([cx, cy, 7.4], 2.1, shade(c, 0.2));
    s += p.line([cx - 1.5, cy + 1.5, 6.1], [cx + 1.5, cy + 1.5, 6.1], C.light, 0.35);
  });
  s += leg(x + 0.8, y + d - 2.4) + leg(x + w - 2.4, y + d - 2.4);
  return s + p.box(x, y, z, w, d, t, C.wood, WOOD);
}

function cuttingMat(p) {
  const { x, y, w, d } = CUT;
  const z = cutTop + 0.02;
  const [x0, x1, y0, y1] = [x + 1.2, x + w - 1.2, y + 1.2, y + d - 1.2];
  const MAT = C.sageDeep;
  let s = p.plane(flat(x0, x1, y0, y1, z), MAT, { stroke: shade(MAT, -0.15), strokeWidth: 0.4 });
  const grid = shade(MAT, 0.3);
  for (let gx = x0 + 2.5; gx < x1 - 0.5; gx += 2.5) s += p.line([gx, y0 + 0.4, z], [gx, y1 - 0.4, z], grid, 0.15);
  for (let gy = y0 + 2.5; gy < y1 - 0.5; gy += 2.5) s += p.line([x0 + 0.4, gy, z], [x1 - 0.4, gy, z], grid, 0.15);
  // a piece of fabric, three strips already cut from it, the long ruler on the next cut
  const zf = z + 0.03;
  s += p.plane(flat(x0 + 1.5, x0 + 16.5, y0 + 1.4, y0 + 5.6, zf), C.rose, { stroke: shade(C.rose, -0.1), strokeWidth: 0.2 });
  for (const [u, v] of [[3, 2.6], [7, 4.2], [11, 2.4], [14.6, 4.4]]) s += dot([x0 + u, y0 + v, zf + 0.02], 0.3, C.cream);
  [[6.4, C.rose], [8.8, C.gold], [11.2, C.sage]].forEach(([v, c]) => {
    s += p.plane(flat(x0 + 2.2, x0 + 17.2, y0 + v, y0 + v + 1.8, zf), c, { stroke: shade(c, -0.12), strokeWidth: 0.2 });
  });
  const ruler = flat(x0 + 0.6, x0 + 20, y0 + 4.6, y0 + 6.6, z + 0.1);
  s += `<g opacity=".82">${p.plane(ruler, C.light, { stroke: shade(C.metal, -0.15), strokeWidth: 0.3 })}</g>`;
  for (let i = 0; i <= 15; i++) {
    const rx = x0 + 1.1 + i * 1.2;
    s += p.line([rx, y0 + 4.6, z + 0.12], [rx, y0 + (i % 2 ? 5.1 : 5.5), z + 0.12], C.gold, 0.18);
  }
  // the rotary cutter by the ruler: a handle and its round blade
  s += p.box(x0 + 17.4, y0 + 7.2, z, 1.1, 4.6, 0.9, C.rose, { l: C.roseDeep, r: shade(C.roseDeep, -0.1) });
  s += disc([x0 + 17.95, y0 + 6.7, z + 0.5], 1.3, C.metal, ` stroke="${STEEL}" stroke-width="0.3"`) + disc([x0 + 17.95, y0 + 6.7, z + 0.55], 0.4, STEEL);
  // squares cut from the strips, stacked at the front
  [[C.gold, 0], [C.rose, 1], [C.sage, 2]].forEach(([c, k]) => {
    s += p.box(x0 + 3 + k * 0.25, y0 + 12 - k * 0.2, z + k * 0.25, 2.8, 2.8, 0.25, c);
  });
  return s;
}

/* ---------- the model ---------- */

export default {
  key: 'guides',
  size: [60, 50, 40],
  window: WINDOW,
  parts: [
    { id: 'bookcase', draw: bookcase },
    {
      id: 'design-wall',
      draw: designWall,
      target: { section: 'patchwork' },
      label: { corner: 'tl', at: [(BLOCKS[0][0] + BLOCKS[0][1]) / 2, 0.5, (BLOCKS[0][2] + BLOCKS[0][3]) / 2] }, // the pinwheel
      hit: corners(BOARD.x, 0, BOARD.z, BOARD.x1 - BOARD.x, 0.6, BOARD.z1 - BOARD.z),
    },
    {
      id: 'lining-table',
      draw: (p) => sideTable(p) + tote(p) + smallThings(p),
      target: { section: 'construction' },
      label: { corner: 'tr', at: [BAG.x + BAG.w / 2, BAG.y + BAG.d + 0.1, sideTop + BAG.h - 0.5] }, // the lining over its front, above the gap
      hit: [
        ...corners(SIDE.x, SIDE.y, 0, SIDE.w, SIDE.d, sideTop),
        ...corners(BAG.x, BAG.y, sideTop, BAG.w, BAG.d + 0.4, BAG.h + 0.5),
        ...[BAG.y, BAG.y + BAG.d].flatMap((sy) => [-1, 1].map((k) => [BAG.x + BAG.w / 2 + k * BAG.half, sy, sideTop + BAG.h + BAG.rise])), // the straps
      ],
    },
    {
      id: 'sewing-table',
      draw: (p) => sewingTable(p) + machine(p),
      target: { section: 'machine' },
      label: { corner: 'bl', at: [MACHINE.x + MACHINE.w / 2, MACHINE.y + MACHINE.d - 0.5, sewTop + 9.9] }, // the sage front of the arm
      // the top and the machine; the back legs to the floor, the front ones only down to the stools' seats
      hit: [
        ...corners(SEW.x, SEW.y, SEW.z, SEW.w, SEW.d, SEW.t),
        ...corners(MACHINE.x, MACHINE.y, sewTop, MACHINE.w, MACHINE.d, MACHINE.h + 2),
        [SEW.x, SEW.y, 0], [SEW.x + SEW.w, SEW.y, 0], [SEW.x, SEW.y + SEW.d, 6], [SEW.x + SEW.w, SEW.y + SEW.d, 6],
      ],
    },
    { id: 'rug', draw: rug },
    { id: 'stools', draw: (p) => STOOLS.map((st) => stool(p, st)).join('') },
    {
      id: 'cutting-table',
      draw: (p) => cuttingTable(p) + cuttingMat(p),
      target: { section: 'cutting' },
      label: { corner: 'br', at: [CUT.x + 15, CUT.y + 11, cutTop] }, // the strips on the mat
      hit: corners(CUT.x, CUT.y, 0, CUT.w, CUT.d, cutTop),
    },
  ],
};

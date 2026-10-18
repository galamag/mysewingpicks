/*
  The sewing room of Tools (/tools.html, and the Tools room of the house).

  Not one item per product (a couple of dozen small things a thumb cannot hit, and
  the catalogue changes): four ZONES, each linking to its section of the list below
  (spec 4.2); an empty section turns its zone into decoration (check.js).
    sewing table with the machine (back wall)       → machines
    cutting table: mat, rulers, rotary cutter       → cutting
    ironing board: iron, steam station, pen cup     → marking-pressing
    small shelf (clips, pins) and the dress form    → helpers
  The ironing board stands against the left wall (x = 0) under the window, the
  sewing table against the back wall, the shelf and the dress form next to it, the
  cutting table free in the front of the room.

  Decoration: the window and a basket of scraps on the floor (BASKET), both clear
  of the tap areas. Every tap area is the convex hull of its part's `hit`
  (render.js), so the hits leave out what the room in front hides anyway — the
  lower legs of the sewing table and the ironing board are behind the cutting
  table — and the zones barely overlap: a tap opens the zone you see. In the
  house this room has no walls of its own, so nothing hangs on a wall (its window
  is for the page only).

  Every zone has its section's name in a corner of the picture (`label`, render.js), the dot
  on what the eye takes for the zone: the ironing board top left, the machine top right, the
  cutting mat bottom left, the shelf bottom right — the leaders do not cross.

  No brand names or logos on anything (the machine is a generic one).
  Model contract: src/lib/rooms/render.js. World units (cm-like): x → right-down,
  y → left-down, z → up; parts are listed back to front (painted in order).
*/
import { project } from '../anatomy/iso.js';
import { PALETTE as C, shade, num } from './paint.js';
import { dot, disc, flat, corners, shadowOn, ISO_RX, ISO_RY, FRAME, STEEL, WOOD } from './props.js';

/**
  A flat-topped solid with any convex outline (the ironing board, the iron): the sides that
  face the viewer (+x / +y), then the top. `outline` is a list of [x, y] going round the
  way the board's is: from its back point along its +x side, then back along its +y side
  (clockwise on the screen).
*/
function slab(p, outline, z0, z1, top, side, edge) {
  let s = '';
  const sides = [];
  outline.forEach(([ax, ay], i) => {
    const [bx, by] = outline[(i + 1) % outline.length];
    const [nx, ny] = [by - ay, ax - bx]; // outward for this winding
    if (nx + ny > 0.01) sides.push({ ax, ay, bx, by, depth: ax + ay + bx + by, f: nx > ny ? -0.2 : -0.08 });
  });
  sides.sort((u, v) => u.depth - v.depth);
  for (const { ax, ay, bx, by, f } of sides) {
    s += p.plane([[ax, ay, z0], [bx, by, z0], [bx, by, z1], [ax, ay, z1]], shade(side, f), { stroke: shade(side, f), strokeWidth: 0.5 });
  }
  return s + p.plane(outline.map(([x, y]) => [x, y, z1]), top, { stroke: edge ?? top, strokeWidth: 0.6 });
}

/* ---------- the sewing table and the machine (machines) ---------- */

// table: top x 2..28, y 1..14, its surface at z 16.6; drawers under the left end
const SEW = { x: 2, y: 1, w: 26, d: 13, z: 15, t: 1.6 };
const sewTop = SEW.z + SEW.t;
// the machine on it, its front (needle, dial) towards the room (+y): the pillar at the
// -x end, the needle head at the +x end
const MACHINE = { x: 6, y: 4, w: 15, d: 6, h: 11.4 };
const RACK = { x: 22, y: 1.2, w: 5.5, h: 10 }; // the thread rack at the back of the table

function sewingTable(p) {
  const { x, y, w, d, z, t } = SEW;
  const ped = { x: x + 0.6, y: y + 0.6, w: 8, d: d - 1.2 }; // the drawer pedestal
  let s = p.shadow(x + w / 2 + 1, y + d / 2 + 1, 19, 5.5);
  s += p.box(x + w - 2, y + 0.6, 0, 1.4, 1.4, z, C.woodDark); // back-right leg
  s += p.box(ped.x, ped.y, 0, ped.w, ped.d, z, C.wood, WOOD);
  // three drawers on its front (+y), with knobs
  const front = ped.y + ped.d + 0.02;
  for (const [z0, z1] of [[1, 5.4], [5.9, 10.2], [10.7, 14.4]]) {
    const q = [[ped.x + 0.7, front, z0], [ped.x + ped.w - 0.7, front, z0], [ped.x + ped.w - 0.7, front, z1], [ped.x + 0.7, front, z1]];
    s += p.plane(q, shade(C.wood, -0.05), { stroke: shade(C.wood, -0.3), strokeWidth: 0.35 });
    s += dot([ped.x + ped.w / 2, front, (z0 + z1) / 2], 0.55, C.gold);
  }
  s += p.box(x + 8.6, y + d - 1.7, z - 2, w - 10.6, 1, 2, C.wood, WOOD); // apron
  s += p.box(x + w - 2, y + d - 2, 0, 1.4, 1.4, z, C.woodDark); // front-right leg
  s += p.box(x, y, z, w, d, t, C.wood, WOOD);
  return s;
}

function threadRack(p) {
  const { x, y, w, h } = RACK;
  let s = p.box(x, y, sewTop, w, 0.7, h, C.woodDark, { l: shade(C.woodDark, 0.12), r: shade(C.woodDark, -0.15) });
  s += p.box(x - 0.4, y - 0.2, sewTop, w + 0.8, 2.6, 0.6, C.woodDark); // its foot
  const colors = [C.rose, C.gold, C.sage, C.sageDeep, C.roseDeep, C.light];
  [[sewTop + 6.2, 0], [sewTop + 1.8, 3]].forEach(([z0, k]) => {
    for (let i = 0; i < 3; i++) {
      const sx = x + 0.6 + i * 1.7;
      s += p.box(sx, y + 0.8, z0, 1.2, 1.2, 2.6, colors[k + i]);
    }
  });
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
  // needle and presser foot under the head
  s += p.line([x + w - 2.6, fy - 1.4, z + 4.6], [x + w - 2.6, fy - 1.4, z + 3.1], STEEL, 0.5);
  s += p.box(x + w - 3.4, fy - 2.4, z + 2.4, 1.8, 1.6, 0.5, STEEL);
  // the arm over everything, its front in rose as in the sketch
  s += p.box(x + 0.5, y + 0.5, z + 8.4, w - 1, d - 1, h - 8.4, body, { l: C.rose, r: faces.r });
  // the stitch dial and the stitch window on the pillar front
  s += p.plane([[x + 1.2, fy + 0.02, z + 3.4], [x + 4, fy + 0.02, z + 3.4], [x + 4, fy + 0.02, z + 7.6], [x + 1.2, fy + 0.02, z + 7.6]], shade(body, -0.04), { stroke: shade(body, -0.2), strokeWidth: 0.3 });
  s += dot([x + 2.6, fy + 0.04, z + 6.2], 0.9, C.sage);
  s += dot([x + 2.6, fy + 0.04, z + 4.4], 0.45, C.gold);
  // a spool of thread on its pin on the arm; the thread runs along the top and down the head to the needle
  const [sx, sy] = [x + 3, y + 2.4];
  s += disc([sx + 0.7, sy + 0.7, z + h], 0.95, shade(C.sageDeep, -0.1));
  s += p.box(sx, sy, z + h, 1.4, 1.4, 1.8, C.sage);
  s += disc([sx + 0.7, sy + 0.7, z + h + 1.8], 0.95, shade(C.sage, 0.15));
  const thread = [[sx + 0.7, sy + 0.7, z + h + 1.6], [x + w - 2.6, sy + 1, z + h + 0.02], [x + w - 2.6, fy + 0.02, z + h - 0.4], [x + w - 2.6, fy + 0.02, z + 4.8]]
    .map((q) => project(q).map(num).join(' ')).join(' L');
  s += `<path d="M${thread}" fill="none" stroke="${shade(C.sageDeep, -0.1)}" stroke-width="0.3" stroke-linejoin="round"/>`;
  return s;
}

/* ---------- the shelf and the dress form (helpers) ---------- */

const SHELF = { x: 35, y: 1, w: 10, d: 6, h: 22 };
const LEVELS = [0, 7.5, 14.5, 21]; // the boards, 1 thick (the last is the top)
const FORM = { x: 55, y: 10 }; // the dress form stands here
const FEET = [30, 150, 270].map((a) => [FORM.x + 4.5 * Math.cos((a * Math.PI) / 180), FORM.y + 4.5 * Math.sin((a * Math.PI) / 180), 0]);

function shelf(p) {
  const { x, y, w, d, h } = SHELF;
  const panel = 0.8;
  let s = p.shadow(x + w / 2 + 1, y + d / 2 + 1, 11, 4);
  s += p.box(x, y, 0, panel, d, h + 1, C.wood, WOOD); // left side
  const board = (z) => p.box(x + panel, y, z, w - 2 * panel, d, 1, C.wood, WOOD);
  const [b0, b1, b2, top] = LEVELS.map((z) => z + 1); // where things stand

  // bottom: a basket
  s += board(LEVELS[0]);
  s += p.box(x + 1.6, y + 1, b0, 7, 4.2, 4.2, shade(C.wood, 0.1), { l: shade(C.wood, -0.05), r: shade(C.wood, -0.2) });
  for (let i = 1; i <= 3; i++) s += p.line([x + 1.6, y + 5.2, b0 + i * 1.05], [x + 8.6, y + 5.2, b0 + i * 1.05], C.woodDark, 0.25);
  // lower shelf: the box of a snap kit and a spool
  s += board(LEVELS[1]);
  s += p.box(x + 1.4, y + 1.2, b1, 5, 3.6, 2.2, C.sage, { l: C.sageDeep, r: shade(C.sageDeep, -0.12) });
  s += p.box(x + 1.4, y + 1.2, b1 + 2.2, 5, 3.6, 0.5, C.sageDeep);
  s += p.box(x + 7, y + 2.6, b1, 1.3, 1.3, 2, C.roseDeep);
  // middle shelf: a glass jar of clips, its lid gold
  s += board(LEVELS[2]);
  const jar = { x: x + 1.8, y: y + 1.6, s: 3, h: 3.6 };
  s += p.box(jar.x, jar.y, b2, jar.s, jar.s, jar.h, C.glass, { l: shade(C.glass, -0.04), r: shade(C.glass, -0.1) });
  [[0.8, 0.9, C.rose], [2, 1.4, C.gold], [1.2, 2.2, C.sageDeep], [2.3, 2.7, C.rose], [0.9, 3, C.gold]].forEach(([u, v, c]) => {
    s += dot([jar.x + u, jar.y + jar.s, b2 + v], 0.45, c);
  });
  s += p.box(jar.x - 0.1, jar.y - 0.1, b2 + jar.h, jar.s + 0.2, jar.s + 0.2, 0.6, C.gold);
  s += p.box(x + 6, y + 2, b2, 2.6, 2.6, 1.4, C.rose, { l: C.roseDeep, r: shade(C.roseDeep, -0.1) }); // a tin of pins
  // on top: the magnetic pin dish and a tomato pincushion
  s += board(LEVELS[3]);
  s += disc([x + 3, y + 3.2, top], 1.9, STEEL) + disc([x + 3, y + 3.2, top + 0.5], 1.5, C.metal);
  for (const [u, v] of [[-0.6, -0.4], [0.2, 0.3], [0.8, -0.5], [-0.2, 0.7]]) {
    s += p.line([x + 3 + u, y + 3.2 + v, top + 0.5], [x + 3 + u + 0.4, y + 3.2 + v - 0.4, top + 1.7], STEEL, 0.25);
    s += dot([x + 3 + u + 0.4, y + 3.2 + v - 0.4, top + 1.7], 0.3, C.gold);
  }
  s += disc([x + 7.2, y + 3.2, top + 1.1], 1.6, C.roseDeep) + disc([x + 7.2, y + 3.2, top + 1.6], 1.2, shade(C.rose, 0.05));
  s += disc([x + 7.2, y + 3.2, top + 2.2], 0.5, C.sageDeep);
  for (const [u, v] of [[-0.8, 0.2], [0.6, -0.6]]) s += dot([x + 7.2 + u, y + 3.2 + v, top + 2.4], 0.3, C.gold);
  s += p.box(x + w - panel, y, 0, panel, d, h + 1, C.wood, WOOD); // right side, in front of everything
  return s;
}

/** The dress form: a torso of horizontal circles [z, r] on a pole and three feet. */
const TORSO = [[17.6, 2.9], [19, 3.6], [21, 3.5], [23, 2.8], [25.2, 3.4], [27.4, 3.9], [29.2, 3.7], [30.4, 2.6], [31, 1.1]];
const KNOB = 32.4; // the top of its neck knob

function dressForm(p) {
  const { x, y } = FORM;
  let s = p.shadow(x + 1, y + 1, 8, 3);
  for (const [fx, fy] of FEET) s += p.line([x, y, 4], [fx, fy, 0.4], C.woodDark, 0.9);
  s += p.box(x - 0.5, y - 0.5, 2.6, 1, 1, 2, C.woodDark); // the joint
  s += p.line([x, y, 4], [x, y, 18], STEEL, 0.8); // the pole

  // the silhouette: left contour up, right contour down, sampled every half unit
  const r = (z) => {
    for (let i = 1; i < TORSO.length; i++) {
      const [z0, r0] = TORSO[i - 1];
      const [z1, r1] = TORSO[i];
      if (z <= z1) {
        const k = (1 - Math.cos(((z - z0) / (z1 - z0)) * Math.PI)) / 2;
        return r0 + (r1 - r0) * k;
      }
    }
    return TORSO[TORSO.length - 1][1];
  };
  const zs = [];
  for (let z = TORSO[0][0]; z < TORSO[TORSO.length - 1][0]; z += 0.5) zs.push(z);
  zs.push(TORSO[TORSO.length - 1][0]);
  const at = (z, side) => {
    const [cx, cy] = project([x, y, z]);
    return [cx + side * r(z) * ISO_RX, cy];
  };
  const path = (pts) => pts.map(([a, b], i) => `${i ? 'L' : 'M'}${num(a)} ${num(b)}`).join('') + 'Z';
  const [bx, by] = project([x, y, TORSO[0][0]]);
  const bottom = []; // the lower half of the hip ellipse, right to left
  for (let i = 0; i <= 8; i++) {
    const t = (i / 8) * Math.PI;
    bottom.push([bx + Math.cos(t) * TORSO[0][1] * ISO_RX, by + Math.sin(t) * TORSO[0][1] * ISO_RY]);
  }
  const left = zs.map((z) => at(z, -1));
  const right = zs.map((z) => at(z, 1)).reverse();
  s += `<path d="${path([...left, ...right, ...bottom])}" fill="${C.rose}" stroke="${C.roseDeep}" stroke-width="0.4" stroke-linejoin="round"/>`;
  // the shaded right side, a highlight on the left
  const inner = zs.map((z) => at(z, 0.3)).reverse();
  s += `<path d="${path([...inner, ...zs.map((z) => at(z, 1))])}" fill="${C.roseDeep}" opacity=".45"/>`;
  const [hx, hy] = project([x, y, 26.5]);
  s += `<ellipse cx="${num(hx - 2.2)}" cy="${num(hy)}" rx="0.9" ry="3.2" fill="${C.light}" opacity=".3"/>`;
  // neck cap and knob
  const top = TORSO[TORSO.length - 1][0];
  s += disc([x, y, top], 1.1, C.woodDark) + p.box(x - 0.35, y - 0.35, top, 0.7, 0.7, KNOB - top, C.woodDark) + disc([x, y, KNOB], 0.6, C.wood);
  // a tape measure over the shoulders, both ends hanging down the front
  const [nx, ny] = project([x, y, 30.6]);
  s += `<path d="M${num(nx - 2.4)} ${num(ny + 1.2)}Q${num(nx)} ${num(ny + 2.6)} ${num(nx + 2.4)} ${num(ny + 1.2)}" fill="none" stroke="${C.gold}" stroke-width="0.7" stroke-linecap="round"/>`;
  s += `<path d="M${num(nx - 1.9)} ${num(ny + 1.6)}Q${num(nx - 2.4)} ${num(ny + 6)} ${num(nx - 1.6)} ${num(ny + 9)}" fill="none" stroke="${C.gold}" stroke-width="0.7" stroke-linecap="round"/>`;
  s += `<path d="M${num(nx + 1.9)} ${num(ny + 1.6)}Q${num(nx + 2.2)} ${num(ny + 5)} ${num(nx + 1.4)} ${num(ny + 7)}" fill="none" stroke="${C.gold}" stroke-width="0.7" stroke-linecap="round"/>`;
  return s;
}

/* ---------- the ironing board (marking-pressing) ---------- */

// the board along the left wall, its nose to the back (y0), its rest for the iron at the front
const BOARD = { x: 2.5, y0: 20, y1: 43, rest: 4, w: 8, z: 17 };
const IRON = { x: 4, y: 30, w: 4.4, d: 7 }; // standing on the board, its toe to the nose
const STATION = { x: 3.6, y: 43.4, w: 5.8, d: 3.6, h: 4.6 }; // the steam station on the rest

const boardOutline = () => {
  const { x, y0, y1, w } = BOARD;
  const cx = x + w / 2;
  return [[cx, y0], [x + w * 0.86, y0 + 1.6], [x + w, y0 + 5.5], [x + w, y1], [x, y1], [x, y0 + 5.5], [x + w * 0.14, y0 + 1.6]];
};

function ironingBoard(p) {
  const { x, y0, y1, rest, w, z } = BOARD;
  const [ya, yb] = [y0 + 7, y1 - 4]; // where the legs cross the floor and the board
  let s = p.shadow(x + w / 2 + 1, (y0 + y1) / 2 + 2, 10, 9);
  // the X legs, far side first, and their feet across
  for (const lx of [x + 1.2, x + w - 1.2]) {
    s += p.line([lx, ya, z - 0.8], [lx, yb, 0.5], FRAME, 0.7) + p.line([lx, yb, z - 0.8], [lx, ya, 0.5], FRAME, 0.7);
  }
  s += p.box(x + 0.6, ya - 0.5, 0, w - 1.2, 1, 0.6, FRAME) + p.box(x + 0.6, yb - 0.5, 0, w - 1.2, 1, 0.6, FRAME);
  // the rest for the iron: a metal grid at the front end
  s += p.plane(flat(x + 0.8, x + w - 0.8, y1, y1 + rest, z - 0.4), STEEL);
  for (let i = 1; i < 4; i++) s += p.line([x + 0.8 + i * ((w - 1.6) / 4), y1, z - 0.38], [x + 0.8 + i * ((w - 1.6) / 4), y1 + rest, z - 0.38], shade(STEEL, -0.25), 0.25);
  // the board with its striped cover
  s += slab(p, boardOutline(), z - 0.9, z, C.cream, shade(C.metal, -0.1), shade(C.cream, -0.08));
  for (let k = 1; k <= 3; k++) {
    const sx = x + (w * k) / 4;
    const from = k === 2 ? y0 + 0.6 : y0 + 3.2;
    s += p.line([sx, from, z + 0.02], [sx, y1 - 0.4, z + 0.02], C.rose, 0.55);
  }
  return s;
}

function iron(p) {
  const { x, y, w, d } = IRON;
  const z = BOARD.z;
  const cx = x + w / 2;
  // the steel sole, pointed to the nose; the body on it, white like its station; a sage handle
  let s = slab(p, [[cx, y], [x + w, y + 3.2], [x + w, y + d], [x, y + d], [x, y + 3.2]], z, z + 0.6, STEEL, C.metal);
  s += slab(p, [[cx, y + 1.1], [x + w - 0.5, y + 3.7], [x + w - 0.5, y + d - 0.2], [x + 0.5, y + d - 0.2], [x + 0.5, y + 3.7]], z + 0.6, z + 2, C.light, C.light);
  s += p.plane([[cx, y + 2.2], [x + w - 1.2, y + 4.1], [x + w - 1.2, y + d - 0.9], [x + 1.2, y + d - 0.9], [x + 1.2, y + 4.1]].map(([a, b]) => [a, b, z + 2.02]), C.sage);
  const post = (py) => p.box(cx - 0.45, py, z + 2, 0.9, 0.7, 1.5, C.sageDeep);
  s += post(y + 3.2) + post(y + d - 1.5);
  s += p.box(cx - 0.45, y + 3.2, z + 3.5, 0.9, d - 4, 0.8, C.sage, { l: C.sageDeep, r: shade(C.sageDeep, -0.12) }); // the grip
  return s;
}

function station(p) {
  const { x, y, w, d, h } = STATION;
  const z = BOARD.z - 0.4;
  let s = p.box(x, y, z, w, d, h, C.light, { l: shade(C.light, -0.07), r: shade(C.light, -0.18) });
  // the water tank window on its front, the power light
  const fy = y + d + 0.02;
  s += p.plane([[x + 0.8, fy, z + 0.8], [x + w - 2.2, fy, z + 0.8], [x + w - 2.2, fy, z + h - 1], [x + 0.8, fy, z + h - 1]], C.glass, { stroke: shade(C.metal, -0.15), strokeWidth: 0.3 });
  s += p.plane([[x + 0.8, fy, z + 0.8], [x + w - 2.2, fy, z + 0.8], [x + w - 2.2, fy, z + 2.2], [x + 0.8, fy, z + 2.2]], shade(C.glass, -0.12));
  s += dot([x + w - 1.1, fy, z + h - 1.2], 0.4, C.sage);
  // the hose to the heel of the iron
  const [ax, ay] = project([x + w / 2, y, z + h]);
  const [bx, by] = project([IRON.x + IRON.w / 2, IRON.y + IRON.d, BOARD.z + 3]);
  s += `<path d="M${num(ax)} ${num(ay)}Q${num((ax + bx) / 2 + 3)} ${num(Math.min(ay, by) - 4)} ${num(bx)} ${num(by)}" fill="none" stroke="${shade(C.metal, -0.3)}" stroke-width="0.7" stroke-linecap="round"/>`;
  return s;
}

// a cup of marking pens on the board, by the nose
const CUP = { x: 5, y: 24, s: 1.8, h: 2.2 };

function pens(p) {
  const { x, y, s: size, h } = CUP;
  const z = BOARD.z;
  let s = p.box(x, y, z, size, size, h, C.gold, { l: shade(C.gold, -0.08), r: shade(C.gold, -0.2) });
  [[0.5, 0.6, C.rose, 2.4], [1.2, 0.9, C.sageDeep, 2.1], [0.8, 1.3, C.dark, 2.7]].forEach(([u, v, c, len]) => {
    s += p.line([x + u, y + v, z + h], [x + u - 0.2, y + v + 0.3, z + h + len], c, 0.6);
  });
  return s;
}

/* ---------- the cutting table (cutting) ---------- */

const CUT = { x: 27, y: 27, w: 28, d: 19, z: 16.6, t: 1.4 };
const cutTop = CUT.z + CUT.t;

function cuttingTable(p) {
  const { x, y, w, d, z, t } = CUT;
  const leg = (lx, ly) => p.box(lx, ly, 0, 1.6, 1.6, z, C.woodDark);
  let s = p.shadow(x + w / 2 + 1, y + d / 2 + 1, 22, 7);
  s += leg(x + 0.8, y + 0.8) + leg(x + w - 2.4, y + 0.8);
  s += p.box(x + 1.4, y + 1.4, 4, w - 2.8, d - 2.8, 0.8, shade(C.wood, -0.06), WOOD); // the lower shelf
  // folded fabric waiting to be cut, on the lower shelf
  [[3, C.rose], [9, C.sage], [15, C.gold]].forEach(([u, c]) => {
    s += p.box(x + u, y + 4, 4.8, 4.6, 8, 1.2, c) + p.box(x + u, y + 4, 6, 4.6, 8, 1.1, shade(c, 0.18));
  });
  s += leg(x + 0.8, y + d - 2.4) + leg(x + w - 2.4, y + d - 2.4);
  s += p.box(x, y, z, w, d, t, C.wood, WOOD);
  return s;
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
  // a piece of fabric on the mat, the long ruler across it, the rotary cutter beside
  s += p.plane([[x0 + 3, y0 + 2, z + 0.03], [x0 + 15, y0 + 1.4, z + 0.03], [x0 + 15.6, y0 + 11, z + 0.03], [x0 + 3.4, y0 + 11.8, z + 0.03]], C.rose);
  for (const [u, v] of [[6, 4], [10, 3.6], [13, 6], [7, 8], [11, 9.2], [5, 10.5]]) s += dot([x0 + u, y0 + v, z + 0.05], 0.35, C.cream);
  const ruler = [[x0 + 1.5, y0 + 5, z + 0.1], [x0 + 19, y0 + 5, z + 0.1], [x0 + 19, y0 + 8, z + 0.1], [x0 + 1.5, y0 + 8, z + 0.1]];
  s += `<g opacity=".82">${p.plane(ruler, C.light, { stroke: shade(C.metal, -0.15), strokeWidth: 0.3 })}</g>`;
  for (let i = 0; i <= 14; i++) {
    const rx = x0 + 2 + i * 1.2;
    s += p.line([rx, y0 + 8, z + 0.12], [rx, y0 + (i % 2 ? 7.3 : 6.8), z + 0.12], C.gold, 0.18);
  }
  // a square ruler, turned
  const sq = (u, v) => {
    const t = (18 * Math.PI) / 180;
    const [cx, cy] = [x0 + 20.5, y0 + 11];
    return [cx + u * Math.cos(t) - v * Math.sin(t), cy + u * Math.sin(t) + v * Math.cos(t), z + 0.1];
  };
  s += `<g opacity=".82">${p.plane([sq(-2.6, -2.6), sq(2.6, -2.6), sq(2.6, 2.6), sq(-2.6, 2.6)], C.light, { stroke: shade(C.metal, -0.15), strokeWidth: 0.3 })}</g>`;
  s += p.line(sq(-2.6, 0), sq(2.6, 0), C.gold, 0.18) + p.line(sq(0, -2.6), sq(0, 2.6), C.gold, 0.18);
  // the rotary cutter: a handle and its round blade
  s += p.box(x0 + 9, y0 + 13.2, z, 5, 1.1, 0.9, C.rose, { l: C.roseDeep, r: shade(C.roseDeep, -0.1) });
  s += disc([x0 + 8.4, y0 + 13.75, z + 0.5], 1.3, C.metal, ` stroke="${STEEL}" stroke-width="0.3"`);
  s += disc([x0 + 8.4, y0 + 13.75, z + 0.55], 0.4, STEEL);
  return s;
}

/* ---------- decoration ---------- */

// a wicker basket of fabric scraps on the floor, between the cutting table and the dress form
export const BASKET = { x: 55.6, y: 21, w: 4.2, d: 4.6, h: 4 };

function scrapBasket(p) {
  const { x, y, w, d, h } = BASKET;
  const wicker = shade(C.wood, 0.12);
  let s = p.shadow(x + w / 2 + 0.5, y + d / 2 + 0.5, 6, 2.4);
  s += p.box(x, y, 0, w, d, h, shade(C.woodDark, -0.25), { l: wicker, r: shade(wicker, -0.16) }); // its top: the dark inside
  for (let i = 1; i <= 3; i++) {
    const z = (h * i) / 4;
    s += p.line([x, y + d, z], [x + w, y + d, z], C.woodDark, 0.22) + p.line([x + w, y, z], [x + w, y + d, z], C.woodDark, 0.22);
  }
  s += p.plane(flat(x, x + w, y, y + d, h), 'none', { stroke: shade(wicker, -0.08), strokeWidth: 0.7 }); // the rim
  // scraps poking out: [u0, v0, u1, v1, lean, colour] — a leaning piece of fabric from (u0, v0) to (u1, v1)
  [[0.8, 1.2, 2.6, 0.8, 2.6, C.rose], [2.4, 1.4, 4.2, 2.2, 2.2, C.gold], [0.9, 2.6, 2.2, 3.8, 1.9, C.sage], [2.6, 3, 4.1, 3.9, 1.5, C.cream]]
    .forEach(([u0, v0, u1, v1, lean, c]) => {
      const q = [[x + u0, y + v0, h - 0.3], [x + u1, y + v1, h - 0.3], [x + u1 + 0.3, y + v1 + 0.3, h + lean], [x + u0 + 0.5, y + v0 + 0.4, h + lean - 0.4]];
      s += p.plane(q, c, { stroke: shade(c, -0.15), strokeWidth: 0.25 });
    });
  return s;
}

/* ---------- the model ---------- */

const WINDOW = { wall: 'left', from: 22, to: 39, z: [25, 36] }; // over the ironing board

export default {
  key: 'tools',
  size: [60, 50, 40],
  window: WINDOW,
  parts: [
    {
      id: 'sewing-table',
      draw: (p) => sewingTable(p) + threadRack(p) + machine(p),
      target: { section: 'machines' },
      label: { corner: 'tr', at: [MACHINE.x + MACHINE.w / 2, MACHINE.y + MACHINE.d - 0.5, sewTop + 9.9] }, // the rose front of the arm
      // the top, the machine and the rack; the legs only down to where the cutting table hides them
      hit: [
        ...corners(SEW.x, SEW.y, SEW.z, SEW.w, SEW.d, SEW.t),
        ...corners(MACHINE.x, MACHINE.y, sewTop, MACHINE.w, MACHINE.d, MACHINE.h + 2),
        [RACK.x, RACK.y, sewTop + RACK.h], [RACK.x + RACK.w, RACK.y, sewTop + RACK.h],
        [SEW.x, SEW.y, 0], [SEW.x + SEW.w, SEW.y, 0], [SEW.x, SEW.y + SEW.d, 6], [SEW.x + SEW.w, SEW.y + SEW.d, 6],
      ],
    },
    {
      id: 'shelf',
      draw: (p) => shelf(p) + dressForm(p),
      target: { section: 'helpers' },
      label: { corner: 'br', at: [SHELF.x + SHELF.w / 2, SHELF.y + SHELF.d, LEVELS[1] + 3] }, // the snap kit on the lower shelf
      hit: [
        ...corners(SHELF.x, SHELF.y, 0, SHELF.w, SHELF.d, SHELF.h + 1),
        // the torso's outline (a circle of radius r looks widest at (∓r/√2, ±r/√2)), its knob, its feet
        ...TORSO.flatMap(([z, r]) => [[FORM.x - r / Math.SQRT2, FORM.y + r / Math.SQRT2, z], [FORM.x + r / Math.SQRT2, FORM.y - r / Math.SQRT2, z]]),
        [FORM.x, FORM.y, KNOB], ...FEET,
      ],
    },
    { id: 'scrap-basket', draw: scrapBasket },
    {
      id: 'ironing-board',
      draw: (p) => ironingBoard(p) + pens(p) + iron(p) + station(p),
      target: { section: 'marking-pressing' },
      label: { corner: 'tl', at: [BOARD.x + BOARD.w / 2, BOARD.y1 - 3, BOARD.z] }, // the cover, between the iron and its station
      // the board, the station, the iron and the front foot; of the back legs only their upper
      // part: lower down the cutting table stands in front of them
      hit: [
        ...boardOutline().map(([x, y]) => [x, y, BOARD.z]),
        ...corners(STATION.x, STATION.y, BOARD.z - 0.4, STATION.w, STATION.d, STATION.h),
        [IRON.x + IRON.w / 2, IRON.y + 3, BOARD.z + 4.3], [CUP.x + 0.6, CUP.y + 1.6, BOARD.z + CUP.h + 2.7],
        [BOARD.x + BOARD.w, BOARD.y0 + 7, 6],
        [BOARD.x + 0.6, BOARD.y1 - 3.5, 0], [BOARD.x + BOARD.w - 0.6, BOARD.y1 - 3.5, 0],
      ],
    },
    {
      id: 'cutting-table',
      draw: (p) => cuttingTable(p) + cuttingMat(p),
      target: { section: 'cutting' },
      label: { corner: 'bl', at: [CUT.x + 9, CUT.y + 12, cutTop] }, // the mat, by the rotary cutter
      hit: corners(CUT.x, CUT.y, 0, CUT.w, CUT.d, cutTop),
    },
  ],
};

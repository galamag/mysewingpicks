/*
  Cosmetic bag with round corners — the anatomy figure's model and its sewing steps.
  Every number comes from the maker (Vault: «Анатомия изделий — Косметичка с круглыми
  уголками»; video https://youtu.be/aYIwFMz5RO4). Change numbers HERE only. Words:
  cosmetic.<lang>.js (cosmetic.text.js).

  The bag is one rectangle of printed cotton folded in half — the fold is the bottom — with a
  zipper between its short ends; the lining is the same rectangle. Pink "half-moons" (two
  layers of pink cotton sewn along a half-circle of interfacing and turned) sit on the side
  edges of the outer, across the bottom line: they go into the side seams and turn into the
  round pink corners once the corners of the bottom are boxed. Outer and lining are sewn to
  the zipper, then the side seams (an opening in the lining), then the four corners; the bag is
  turned through the opening, which is closed by hand.

  Step 0 is the finished bag (tap to take it apart); steps 1–11 each animate one stage over
  t = 0…1. Flat work lies on the table (x → right-down, y → left-down); the cut pieces and the
  half-moons stand on a board facing the viewer. Shared parts (camera, inset, machine,
  renderer): kit.js.
*/
import { at, lerp, turn } from './iso.js';
import { fadeAll, labelKeys, makeRenderer, rect, rot2, shell, span } from './kit.js';

const ID = 'cosmetic-bag'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {
  outer: [23, 31], // printed cotton; folded in half across the 31 cm → the fold is the bottom, the 23 cm sides go to the zipper
  lining: [23, 31], // the same, made the same way
  iface: [21, 29], // thin fusible interfacing on the wrong side of the outer only, 1 cm in from every edge
  moonIface: 16, // a 16 × 16 cm square of the same thin interfacing for the round corners…
  radius: 8, // …cut into a circle of radius 8 cm (a paper template), then in half → two half-circles
  pink: [18, 10], // four pink pieces, two for each corner, right sides together
  pinkCount: 4,
  moonInset: 1, // the half-circle sits in the middle of a pink piece, its straight side 1 cm from the long edge
  zipper: 20, // in the middle of the 23 cm side; its ends stop short of the side seams; no topstitching along it
  seam: 0.5, // every seam; the half-moon's straight side is stitched 0.5 cm from the edge too
  opening: 6, // in the middle of one side seam of the lining, closed by hand
  notch: [3.5, 2.5], // cut from each bottom corner: 3.5 cm along the bottom × 2.5 cm along the side seam
};

const [OW, OL] = SPEC.outer; // 23 × 31
const HALF = OL / 2; // 15.5: the fold (the bottom)
const IM = (OW - SPEC.iface[0]) / 2; // 1: interfacing margin
const R = SPEC.radius, I = SPEC.moonInset;
const [PW, PH] = SPEC.pink;
const Z = SPEC.zipper, ZX = (OW - Z) / 2; // the zipper from x = 1.5 to 21.5
const [NX, NY] = SPEC.notch;
const T = 0.18; // fabric thickness in the drawing (cm)
const ZW = 2.6; // zipper width in the drawing (not a measurement)

/* The finished bag, for the drawing only — never published: the bottom is boxed by the notches. */
const BW = OW - 2 * SPEC.seam; // 22: the top, seam to seam
const BD = 2 * NY; // 5: the depth of the bottom (drawing)
const BH = Math.sqrt((HALF - SPEC.seam) ** 2 - (BD / 2) ** 2) - BD / 2; // the height of the walls (drawing)
const BL = BW - BD; // the length of the bottom (drawing)

const F = (name) => `url(#${ID}-${name})`;
const PRINT = F('print'), BACK = F('back'); // the outer cotton: right side, wrong side
const LIN = F('lining'), LIN_BACK = F('liningBack');
const PINK = F('pink'), PINK_BACK = F('pinkBack');
const IFACE = F('iface'), PAPER = F('paper');
const TAPE = F('tape'), TEETH = F('teeth');

/* ---------- Shapes ---------- */

const arc = (cx, cy, r, a0, a1, n = 24) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

/*
  A half-moon in its own coordinates: s along the straight (raw) edge, centred on s = 0;
  n inward from that edge. Its curve is the seam on the interfacing's edge (radius R, centre
  I in from the raw edge); `half` = -1 / +1 keeps only one side of s = 0 (it straddles the fold).
*/
function moonPts(half = 0, r = R) {
  const e = r + 0.4;
  if (!half) return [[-e, 0], [e, 0], [e, I], ...arc(0, I, r, 0, Math.PI), [-e, I]];
  const h = half;
  const curve = h > 0 ? arc(0, I, r, 0, Math.PI / 2, 12) : arc(0, I, r, Math.PI / 2, Math.PI, 12);
  return h > 0 ? [[0, 0], [e, 0], [e, I], ...curve, [0, I]] : [[-e, 0], [0, 0], [0, I], ...curve, [-e, I]];
}

/* ---------- The finished bag ---------- */

/*
  The bag stands on the table, centred on the origin: the zipper along x on top (z = BH + BD/2),
  the bottom a BL × BD rectangle on the floor. Front and back walls are trapezoids, the ends are
  triangles (the boxed corners). k < 1 → a smaller copy (the lining inside, the interfacing).
*/
function bagFaces(key, k, fill, inner, z0 = 0) {
  const a = (BW / 2) * k, b = (BL / 2) * k, d = (BD / 2) * k, h = (BH + BD / 2) * k;
  const top = (x) => [x, 0, z0 + h];
  const foot = (x, y) => [x, y, z0];
  const quad = (id, p0, p1, p2, p3, out) => face(id, [p0, p1, p2, p3], out, fill, inner);
  return {
    back: quad(`${key}-back`, top(-a), top(a), foot(b, -d), foot(-b, -d), [0, -1, 0.3]),
    left: face(`${key}-left`, [foot(-b, -d), foot(-b, d), top(-a)], [-1, 0, 0.2], fill, inner),
    bottom: quad(`${key}-bottom`, foot(-b, -d), foot(b, -d), foot(b, d), foot(-b, d), [0, 0, -1]),
    front: quad(`${key}-front`, top(-a), top(a), foot(b, d), foot(-b, d), [0, 1, 0.3]),
    right: face(`${key}-right`, [foot(b, -d), foot(b, d), top(a)], [1, 0, 0.2], fill, inner),
  };
}

/** A flat piece through world points p[0..]: U along p0→p1, V in-plane perpendicular; local pts. */
function face(id, P, out, fill, inner) {
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const len = (p) => Math.sqrt(dot(p, p));
  const e1 = sub(P[1], P[0]), U = e1.map((v) => v / len(e1));
  const e2 = sub(P[P.length - 1], P[0]);
  const w = e2.map((v, i) => v - dot(e2, U) * U[i]);
  const V = w.map((v) => v / len(w));
  const pts = P.map((p) => { const q = sub(p, P[0]); return [dot(q, U), dot(q, V)]; });
  return { id, pts, O: P[0], U, V, out, fill, inner };
}

/** The round pink corners on the outer: a patch on each end triangle and on the walls next to it. */
function corners(f) {
  const out = [];
  for (const side of ['left', 'right', 'front', 'back']) {
    const p = f[side];
    if (side === 'left' || side === 'right') {
      // the end triangle: its base (the corner seam) is pts[0]→pts[1], its tip the zipper end
      const [b0, b1, tip] = p.pts;
      const lift = 0.42; // how far up the end the pink comes (drawing)
      const l = [lerp(b0[0], tip[0], lift), lerp(b0[1], tip[1], lift)], r = [lerp(b1[0], tip[0], lift), lerp(b1[1], tip[1], lift)];
      const mid = [(l[0] + r[0]) / 2, (l[1] + r[1]) / 2 + 1.2];
      out.push({ ...p, id: `${p.id}-moon`, pts: [b0, b1, r, mid, l], fill: PINK, inner: PINK, lines: [{ pts: [l, mid, r], kind: 'seam' }] });
    } else {
      // a wall: its bottom corners are pts[3] (at x < 0) and pts[2] (x > 0); pts[0], pts[1] its top
      const [t0, t1, f1, f0] = p.pts;
      for (const [foot, topc, sgn] of [[f0, t0, 1], [f1, t1, -1]]) {
        const up = 0.5; // up the slanted side (drawing)
        const sideP = [lerp(foot[0], topc[0], up), lerp(foot[1], topc[1], up)];
        const along = [foot[0] + sgn * 5.2, foot[1]];
        const curve = arc(foot[0], foot[1], 1, 0, 1, 10).map((_, i, all) => {
          const s = i / (all.length - 1);
          const q = [lerp(sideP[0], along[0], s), lerp(sideP[1], along[1], s)];
          return [q[0] + sgn * 2.1 * Math.sin(Math.PI * s) * 0.7, q[1] - 2.1 * Math.sin(Math.PI * s) * 0.6];
        });
        out.push({ ...p, id: `${p.id}-moon-${sgn > 0 ? 'l' : 'r'}`, pts: [foot, ...curve.reverse()], fill: PINK, inner: PINK, lines: [] });
      }
    }
  }
  return out;
}

const facingOut = (p) => p.out[0] + p.out[1] + p.out[2] >= 0;

/** The zipper on the ridge: tape + teeth, z on top; `open` 0…1 slides the pull from the right end. */
function zipperOnTop(z, open = 0, key = 'zip', o = 1) {
  const tape = { id: `${key}-tape`, pts: rect(Z, ZW), O: [-Z / 2, -ZW / 2, z + 0.03], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], fill: TAPE, inner: TAPE };
  const teeth = { id: `${key}-teeth`, pts: rect(Z, 0.7), O: [-Z / 2, -0.35, z + 0.06], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], fill: TEETH, inner: TEETH };
  const px = Z / 2 - 1.6 - open * (Z - 3.2);
  const pull = { id: `${key}-pull`, pts: [[0, 0], [1.4, 0], [1.4, 0.8], [3.4, 0.6], [3.4, -0.6], [1.4, -0.8], [1.4, 0]].map(([u, v]) => [u - 0.7, v]), O: [px, 0, z + 0.1], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], fill: F('pull'), inner: F('pull') };
  return fadeAll([tape, teeth, pull], o);
}

/** The finished bag (outer, pink corners, zipper), painted far to near; the hidden faces are dropped. */
function bagPieces({ z0 = 0, open = 0, zip = true } = {}) {
  const f = bagFaces('outer', 1, PRINT, BACK, z0);
  const seen = ['back', 'left', 'bottom', 'front', 'right'].map((s) => f[s]).filter(facingOut);
  const pink = corners(f).filter(facingOut);
  return [...seen, ...pink, ...(zip ? zipperOnTop(z0 + BH + BD / 2, open) : [])];
}

const TOPZ = BH + BD / 2;

/* ---------- Step 0: the finished bag, together (e = 0) or apart (e = 1) ---------- */

const shift = (ps, d) => ps.map((p) => ({ ...p, O: [p.O[0] + d[0], p.O[1] + d[1], p.O[2] + d[2]] }));

function anatomy(e = 0) {
  const lift = span(e, 0, 0.7), aside = span(e, 0.35, 1), show = span(e, 0.3, 0.8);
  const outer = bagPieces({ zip: false });
  const zip = shift(zipperOnTop(TOPZ), [0, 0, lerp(0, 9, lift)]);
  const lf = bagFaces('lining', 0.92, LIN, LIN_BACK);
  const lining = shift(['front', 'right'].map((s) => lf[s]), [lerp(0, -BW - 6, aside), 0, lerp(0, TOPZ + 14, lift) - lerp(0, 16, aside)]);
  const ff = bagFaces('iface', 0.95, IFACE, IFACE);
  const iface = fadeAll(shift([ff.front], [lerp(0, BW + 6, aside), 0, lerp(0, 6, lift) - lerp(0, 6, aside)]), show);
  return { pieces: [...lining, ...outer, ...iface, ...zip], over: [] };
}

/** Numbered pins for the legend (shown when apart). */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  const mid = (p, s = 0.5, t = 0.45) => {
    const xs = p.pts.map((q) => q[0]), ys = p.pts.map((q) => q[1]);
    return at(p, lerp(Math.min(...xs), Math.max(...xs), s), lerp(Math.min(...ys), Math.max(...ys), t));
  };
  return [
    { n: 1, p: mid(byId['outer-front'], 0.5, 0.4) },
    { n: 2, p: mid(byId['iface-front']) },
    { n: 3, p: mid(byId['outer-front-moon-r'], 0.75, 0.75) },
    { n: 4, p: mid(byId['zip-tape'], 0.3, 0.5) },
    { n: 5, p: mid(byId['lining-front']) },
  ];
}

/* ---------- Step 1: cut — on a board facing the viewer ---------- */

const board = (id, pts, x, z, fill, extra = {}) =>
  ({ id, pts, O: [x, 0, z], U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], fill, inner: fill, ...extra });

const ROW = 41; // the outer and the lining stand on the top row
const LX = OW + 7; // the lining's x
const PX = LX + OW + 7, PZ = ROW + 9, PSTEP = 1.6; // the four pink pieces, a little fanned, right of the lining
const SQX = PX, SQZ = 22; // the interfacing square for the corners, under them
const ZPX = PX + PW + 6, ZZ = 22; // the zipper, upright, beside the square

function stepCut(t) {
  const a = (i) => span(t, i * 0.08, i * 0.08 + 0.22);
  const drop = (i) => (1 - a(i)) * 6;
  const pieces = [
    board('cut-outer', rect(OW, OL), 0, ROW + drop(0), PRINT, { opacity: a(0) }),
    board('cut-lining', rect(OW, OL), LX, ROW + drop(1), LIN, { opacity: a(1) }),
    board('cut-iface', rect(...SPEC.iface), 0, IM + drop(2), IFACE, { opacity: a(2) }),
    ...[3, 2, 1, 0].map((j) => board(`cut-pink-${j}`, rect(PW, PH), PX + j * PSTEP * 0.5, PZ + j * PSTEP + drop(3 + j * 0.3), PINK, { opacity: a(3 + j * 0.3) })),
    board('cut-square', rect(SPEC.moonIface, SPEC.moonIface), SQX, SQZ + drop(5), IFACE, { opacity: a(5) }),
    board('cut-zip-tape', rect(ZW, Z), ZPX, ZZ + drop(6), TAPE, { opacity: a(6) }),
    board('cut-zip-teeth', rect(0.7, Z), ZPX + (ZW - 0.7) / 2, ZZ + drop(6), TEETH, { opacity: a(6), O: [ZPX + (ZW - 0.7) / 2, 0.05, ZZ + drop(6)] }),
  ];
  const o = span(t, 0.7, 0.9);
  const top = PZ + PH + 3 * PSTEP;
  return {
    pieces,
    over: [
      { type: 'dim', a: [0, 0, ROW + OL + 3.5], b: [OW, 0, ROW + OL + 3.5], label: 'cm23', o },
      { type: 'dim', a: [-3.5, 0, ROW], b: [-3.5, 0, ROW + OL], label: 'cm31', o },
      { type: 'dim', a: [-3.5, 0, IM], b: [-3.5, 0, IM + SPEC.iface[1]], label: 'cm29', o },
      { type: 'dim', a: [0, 0, -3.5], b: [SPEC.iface[0], 0, -3.5], label: 'cm21', o },
      { type: 'dim', a: [PX + 1.5 * PSTEP, 0, top + 3], b: [PX + 1.5 * PSTEP + PW, 0, top + 3], label: 'cm18', o },
      { type: 'dim', a: [PX + PW + 6.5, 0, PZ + 3 * PSTEP], b: [PX + PW + 6.5, 0, top], label: 'cm10', o },
      { type: 'dim', a: [SQX, 0, SQZ - 3.5], b: [SQX + SPEC.moonIface, 0, SQZ - 3.5], label: 'cm16', o },
      { type: 'dim', a: [ZPX + ZW + 2.6, 0, ZZ], b: [ZPX + ZW + 2.6, 0, ZZ + Z], label: 'cm20', o, hot: true },
      { type: 'label', p: [OW / 2, 0, ROW + OL / 2], label: 'outerCotton', o },
      { type: 'label', p: [LX + OW / 2, 0, ROW + OL / 2], label: 'liningCotton', o },
      { type: 'label', p: [SPEC.iface[0] / 2, 0, IM + SPEC.iface[1] / 2], label: 'ifaceThin', o },
      { type: 'label', p: [PX + PW / 2 + PSTEP, 0, PZ + PH / 2 + PSTEP * 1.5], label: 'pink4', o, hot: true, dx: -6 },
      { type: 'label', p: [SQX + SPEC.moonIface / 2, 0, SQZ + 5], label: 'ifaceCorners', o },
      { type: 'label', p: [ZPX + ZW / 2, 0, ZZ + Z + 8], label: 'zipper', o, dx: -9 },
    ],
  };
}

/* ---------- Step 2: the corners' template — a circle of radius 8 from the square, cut in half ---------- */

const SQ = SPEC.moonIface, SC = SQ / 2;

function stepTemplate(t) {
  const paper = span(t, 0.04, 0.16) * (1 - span(t, 0.36, 0.44));
  const draw = span(t, 0.18, 0.34);
  const round = span(t, 0.42, 0.52);
  const halve = span(t, 0.6, 0.66), apart = span(t, 0.7, 0.86);
  const disc = arc(SC, SC, R, 0, 2 * Math.PI, 48);
  const upper = arc(SC, SC, R, 0, Math.PI, 24), lower = arc(SC, SC, R, Math.PI, 2 * Math.PI, 24);
  const pieces = [];
  if (round < 0.999) pieces.push(board('tpl-square', rect(SQ, SQ), 0, 0, IFACE, { opacity: 1 - round }));
  if (round > 0.001 && apart <= 0.001) pieces.push(board('tpl-disc', disc, 0, 0, IFACE, { opacity: round }));
  if (apart > 0.001) {
    pieces.push(board('tpl-half-up', upper, 0, 2.5 * apart, IFACE));
    pieces.push(board('tpl-half-down', lower, 0, -2.5 * apart, IFACE));
  }
  if (paper > 0.001) pieces.push(board('tpl-paper', disc, 0, 0, PAPER, { opacity: paper * 0.85, O: [0, 0.08, 0] }));
  const ring = disc.map(([u, v]) => [u, 0.12, v]);
  return {
    pieces,
    over: [
      { type: 'line', pts: ring, t: draw, kind: 'mark', o: draw > 0 ? 1 - round : 0 },
      { type: 'dim', a: [SC, 0.15, SC], b: [SC + R, 0.15, SC], label: 'radius8', o: span(t, 0.08, 0.14) * (1 - span(t, 0.56, 0.6)), hot: true },
      { type: 'label', p: [SC, 0, SQ + 3], label: 'paperTemplate', o: paper },
      { type: 'line', pts: [[-1, 0.15, SC], [SQ + 1, 0.15, SC]], t: halve, kind: 'mark', o: halve > 0 ? 1 - apart : 0 },
      { type: 'label', p: [SC, 0, SC], label: 'cutInHalf', o: span(t, 0.6, 0.66) * (1 - span(t, 0.9, 0.96)), hot: true, dy: -7 },
      { type: 'label', p: [SC, 0, -5], label: 'twoHalves', o: span(t, 0.88, 0.94) },
    ],
  };
}

/* ---------- Steps 3–4: the half-moons — sew along the curve, trim, turn ---------- */

const MC = PW / 2; // the half-circle's centre on the pink piece, along its long side
const curveOnPink = arc(MC, I, R, Math.PI, 0, 32); // left to right, over the top

function stepMoonSew(t) {
  const fuse = span(t, 0.04, 0.2), iron = span(t, 0.2, 0.26) * (1 - span(t, 0.34, 0.38));
  const second = span(t, 0.4, 0.52), sew = span(t, 0.6, 0.9);
  const half = board('moon-iface', arc(MC, I, R, 0, Math.PI, 24), 0, 0, IFACE, { O: [0, 0.06 + (1 - fuse) * 0, (1 - fuse) * 8], opacity: fuse });
  return {
    pieces: [
      board('moon-b', rect(PW, PH), 0.8 * (1 - second), 0, PINK, { O: [0.8 * (1 - second), -0.2, 0.8 * (1 - second)], opacity: second }),
      board('moon-a', rect(PW, PH), 0, 0, PINK_BACK),
      half,
    ],
    over: [
      { type: 'label', p: [MC, 0, I + R / 2], label: 'ironOn', o: iron, hot: true },
      { type: 'dim', a: [PW + 2.5, 0, 0], b: [PW + 2.5, 0, I], label: 'cm1', o: span(t, 0.22, 0.28) * (1 - span(t, 0.9, 0.96)), hot: true },
      { type: 'label', p: [MC, 0, PH + 3], label: 'rightSides', o: span(t, 0.42, 0.48) * (1 - span(t, 0.58, 0.62)) },
      { type: 'line', pts: curveOnPink.map(([u, v]) => [u, 0.12, v]), t: sew, kind: 'hot' },
      { type: 'label', p: [MC, 0, PH + 3], label: 'alongEdge', o: span(t, 0.62, 0.68), hot: true },
      { type: 'label', p: [MC, 0, -4], label: 'makeTwo', o: span(t, 0.9, 0.96) },
    ],
  };
}

function stepMoonTurn(t) {
  const trim = span(t, 0.06, 0.2), notch = span(t, 0.24, 0.42), turned = span(t, 0.5, 0.7), two = span(t, 0.78, 0.92);
  const trimmed = moonPts(0, R + 0.5).map(([s, n]) => [s + MC, n]);
  const sewn = curveOnPink.map(([u, v]) => [u, v]);
  const pieces = [];
  if (trim < 0.999) pieces.push(board('turn-rect', rect(PW, PH), 0, 0, PINK_BACK, { opacity: 1 - trim, lines: [{ pts: sewn, kind: 'seam' }] }));
  if (trim > 0.001 && turned < 0.999) pieces.push(board('turn-trim', trimmed, 0, 0, PINK_BACK, { opacity: trim * (1 - turned), lines: [{ pts: sewn, kind: 'seam' }] }));
  const moon = moonPts().map(([s, n]) => [s + MC, n]);
  if (turned > 0.001) pieces.push(board('turn-moon', moon, 0, 0, PINK, { opacity: turned }));
  if (two > 0.001) pieces.push(board('turn-moon-2', moon, PW + 3, (1 - two) * 5, PINK, { opacity: two }));
  const ticks = Array.from({ length: 7 }, (_, i) => {
    const a = (Math.PI * (i + 1)) / 8;
    return { type: 'line', pts: [[MC + (R + 0.5) * Math.cos(a), 0.12, I + (R + 0.5) * Math.sin(a)], [MC + (R + 0.1) * Math.cos(a), 0.12, I + (R + 0.1) * Math.sin(a)]], t: span(notch, i / 8, (i + 1) / 8), kind: 'hot', o: 1 - turned };
  });
  return {
    pieces,
    over: [
      ...ticks,
      { type: 'label', p: [MC, 0, PH + 3], label: 'trimNotch', o: span(t, 0.06, 0.12) * (1 - span(t, 0.44, 0.48)), hot: true },
      { type: 'arrow', pts: [[MC - 4, 0, PH + 1], [MC, 0, PH + 3], [MC + 4, 0, PH + 1]], t: span(t, 0.48, 0.6), o: 1 - span(t, 0.7, 0.76) },
      { type: 'label', p: [MC, 0, PH + 3], label: 'turnOut', o: span(t, 0.5, 0.56), hot: true },
      { type: 'label', p: [PW + 3 + MC, 0, -4], label: 'makeTwo', o: two },
    ],
  };
}

/* ---------- Flat work on the table (steps 5–10) ---------- */

/** A flat piece on the table (x → right-down, y → left-down), right side up (`up`) or down. */
const table = (id, pts, z, fill, inner, up = true, extra = {}) =>
  ({ id, pts, O: [0, 0, z], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, up ? 1 : -1], fill, inner, ...extra });

/** The interfacing, seen through the outer's wrong side, as lines on a part [y0, y1] of the outer. */
const ifaceOn = (y0, y1, side) => {
  const a = Math.max(y0, IM), b = Math.min(y1, OL - IM);
  if (b <= a) return [];
  return [{ pts: [[IM, a], [OW - IM, a], [OW - IM, b], [IM, b], [IM, a]], kind: 'iface', side }];
};

/** The half-moons on the outer (x = 0 and x = OW, centred on the fold), `part` -1/+1/0 = which half. */
function moonsOnOuter(z, part = 0, o = 1, extra = () => ({})) {
  const left = { O: [0, HALF, z], U: [0, 1, 0], V: [1, 0, 0] };
  const right = { O: [OW, HALF, z], U: [0, 1, 0], V: [-1, 0, 0] };
  return [['l', left], ['r', right]].map(([k, pl]) => ({
    id: `moon-${k}${part ? (part > 0 ? '-far' : '-near') : ''}`, pts: moonPts(part), ...pl, out: [0, 0, 1], fill: PINK, inner: PINK_BACK, opacity: o, ...extra(k),
  }));
}

/* Step 5: interfacing on the wrong side of the outer, 1 cm in; notch the middle (the bottom). */
function stepIface(t) {
  const drop = span(t, 0.08, 0.32), iron = span(t, 0.36, 0.42) * (1 - span(t, 0.54, 0.58)), mark = span(t, 0.66, 0.8);
  const notches = [[[0, HALF, T * 3], [1.4, HALF, T * 3]], [[OW, HALF, T * 3], [OW - 1.4, HALF, T * 3]]];
  return {
    pieces: [
      table('if-outer', rect(OW, OL), 0, PRINT, BACK, false),
      table('if-iface', rect(...SPEC.iface), T + (1 - drop) * 10, IFACE, IFACE, true, { O: [IM, IM, T + (1 - drop) * 10], opacity: drop }),
    ],
    over: [
      { type: 'label', p: [OW / 2, OL / 2, 0], label: 'wrongSideUp', o: span(t, 0.02, 0.06) * (1 - span(t, 0.12, 0.16)) },
      { type: 'label', p: [OW / 2, OL / 2, T], label: 'ironOn', o: iron, hot: true },
      { type: 'dim', a: [IM, OL + 2.5, 0], b: [OW - IM, OL + 2.5, 0], label: 'cm21', o: span(t, 0.36, 0.42) },
      { type: 'label', p: [OW, OL, 0], label: 'edges1', o: span(t, 0.42, 0.48), dx: 6, dy: 7, hot: true },
      ...notches.map((pts) => ({ type: 'line', pts, t: mark, kind: 'hot' })),
      { type: 'line', pts: [[0, HALF, T * 2], [OW, HALF, T * 2]], t: mark, kind: 'fold', o: mark },
      { type: 'label', p: [OW / 2, HALF, T], label: 'middleBottom', o: span(t, 0.7, 0.76), hot: true },
    ],
  };
}

/* Step 6: the outer right side up; the half-moons on the side edges across the bottom line, stitched all round. */
const moonStitch = [...arc(0, I, R - 0.15, Math.PI, 0, 32), [R + 0.3, SPEC.seam], [-(R + 0.3), SPEC.seam]];

function stepMoons(t) {
  const flip = span(t, 0.02, 0.14), place = span(t, 0.18, 0.4), sew = span(t, 0.5, 0.9);
  const outer = [
    table('mo-outer-wrong', rect(OW, OL), 0, PRINT, BACK, false, { opacity: 1 - flip, lines: ifaceOn(0, OL, 'in') }),
    table('mo-outer', rect(OW, OL), 0, PRINT, BACK, true, { opacity: flip }),
  ];
  const moons = moonsOnOuter(T + (1 - place) * 8, 0, place, () => ({ lines: [{ pts: moonStitch, t: sew, kind: 'hotstitch' }] }));
  return {
    pieces: [...fadeAll(outer, 1), ...moons],
    over: [
      { type: 'label', p: [OW / 2, OL / 2, 0], label: 'rightSideUp', o: span(t, 0.08, 0.12) * (1 - span(t, 0.2, 0.24)) },
      { type: 'line', pts: [[0, HALF, T], [OW, HALF, T]], kind: 'fold', o: span(t, 0.14, 0.2) },
      { type: 'label', p: [0, HALF, T], label: 'onBottomLine', o: span(t, 0.3, 0.36) * (1 - span(t, 0.46, 0.5)), dx: 14, dy: -6, hot: true },
      { type: 'label', p: [R + 1, HALF, T], label: 'stitchRound', o: span(t, 0.52, 0.58), dx: 12, dy: -9, hot: true },
      { type: 'label', p: [0, HALF + R, T], label: 'straight05', o: span(t, 0.72, 0.78), dx: 4, dy: 8 },
    ],
  };
}

/* Steps 7–8: the zipper between outer and lining — the first side, then the second. */

/** The zipper lying along y = 0 on the outer, face down (step 7). */
const zipFlat = (z, o = 1, key = 'zf', y0 = 0, down = true) => fadeAll([
  table(`${key}-tape`, rect(Z, ZW), z, TAPE, TAPE, !down, { O: [ZX, y0, z] }),
  table(`${key}-teeth`, rect(Z, 0.7), z + 0.02, TEETH, TEETH, !down, { O: [ZX, y0 + (ZW - 0.7) / 2, z + 0.02] }),
], o);

function stepZip1(t) {
  const zin = span(t, 0.06, 0.24), lin = span(t, 0.34, 0.52), sew = span(t, 0.62, 0.92);
  return {
    pieces: [
      table('z1-outer', rect(OW, OL), 0, PRINT, BACK, true),
      ...moonsOnOuter(T),
      ...zipFlat(2 * T + (1 - zin) * 8, zin),
      table('z1-lining', rect(OW, OL), 3 * T + (1 - lin) * 10, LIN, LIN_BACK, false, { opacity: lin }),
    ],
    over: [
      { type: 'label', p: [OW / 2, OL / 2, 0], label: 'outerUp', o: span(t, 0.02, 0.06) * (1 - span(t, 0.1, 0.14)) },
      { type: 'label', p: [OW / 2, ZW / 2, 2 * T], label: 'zipperDown', o: span(t, 0.14, 0.2) * (1 - span(t, 0.3, 0.34)), dy: -7, hot: true },
      { type: 'dim', a: [ZX, -2.5, 2 * T], b: [ZX + Z, -2.5, 2 * T], label: 'cm20', o: span(t, 0.2, 0.26) * (1 - span(t, 0.34, 0.38)) },
      { type: 'label', p: [OW / 2, OL / 2, 3 * T], label: 'liningDown', o: span(t, 0.44, 0.5) * (1 - span(t, 0.58, 0.62)), hot: true },
      { type: 'line', pts: [[0, SPEC.seam, 4 * T], [OW, SPEC.seam, 4 * T]], t: sew, kind: 'hot' },
      { type: 'label', p: [OW, SPEC.seam, 4 * T], label: 'seam05', o: span(t, 0.64, 0.7), dx: -12, dy: -7, hot: true },
    ],
    focus: { pts: [[0, -3, 0], [OW, -3, 0], [0, 10, 0], [OW, 10, 0]], k: 0.5 * span(t, 0.56, 0.62) * (1 - span(t, 0.94, 1)) },
  };
}

/*
  Step 8: open the lining away from the zipper (it turns right side up beyond y = 0), then fold
  both far halves over — outer onto outer, lining onto lining, right sides together — so their
  other short ends meet the zipper's other side; sew that seam. The END VIEW shows the loop.
*/
const Y_LINE = 0; // where the zipper is

/*
  The halves of outer and lining with the bottom corners cut away (step 10 on): 3.5 along the
  bottom (the fold) × 2.5 along the side seam. `atEnd` — the fold is at v = HALF (the near halves),
  else at v = 0 (the far halves). The interfacing outline goes round the cut too.
*/
function notched(atEnd) {
  const f = atEnd ? (v) => v : (v) => HALF - v; // v measured from the far edge → the piece's own v
  const piece = [[0, 0], [OW, 0], [OW, HALF - NY], [OW - NX, HALF - NY], [OW - NX, HALF], [NX, HALF], [NX, HALF - NY], [0, HALF - NY]];
  const iface = [[IM, IM], [OW - IM, IM], [OW - IM, HALF - NY], [OW - NX, HALF - NY], [OW - NX, HALF], [NX, HALF], [NX, HALF - NY], [IM, HALF - NY], [IM, IM]];
  const map = (pts) => pts.map(([u, v]) => [u, f(v)]);
  return { pts: map(piece), iface: [{ pts: map(iface), kind: 'iface', side: 'in' }] };
}

/** Split a piece's rect [0,OW]×[y0,y1] (in its own coords, placed by O/U/V) — near and far parts. */
function stateFolded({ flipL, foldO, foldL, cut = false }) {
  const hinge = [0, HALF, T];
  const aO = Math.PI * foldO;
  const nEnd = notched(true), nStart = notched(false);
  const outerNear = table('f-outer-near', cut ? nEnd.pts : rect(OW, HALF), 0, PRINT, BACK, true, { lines: cut ? nEnd.iface : ifaceOn(0, HALF, 'in') });
  const farRaw = table('f-outer-far', cut ? nStart.pts : rect(OW, HALF), 0, PRINT, BACK, true, { O: [0, HALF, 0], lines: cut ? nStart.iface : ifaceOn(HALF, OL, 'in').map((l) => ({ ...l, pts: l.pts.map(([u, v]) => [u, v - HALF]) })) });
  const outerFar = turn({ ...farRaw, O: [0, HALF, T] }, hinge, [1, 0, 0], aO);
  // the half-moons lie between the outer's layers, hidden; once the corners are cut they are left out
  const moonsNear = cut ? [] : moonsOnOuter(T * 1.5, -1);
  const moonsFar = cut ? [] : moonsOnOuter(T * 2.5, 1).map((m) => turn(m, hinge, [1, 0, 0], aO));
  // the lining: first flipped about y = 0 (lies over y -31…0, right side up), then its far half folds over
  const aF = Math.PI * flipL, aL = -Math.PI * foldL;
  const zLine = [0, Y_LINE, 4 * T];
  const linNear = turn(table('f-lin-near', cut ? nEnd.pts : rect(OW, HALF), 4 * T, LIN, LIN_BACK, false, { O: [0, 0, 4 * T] }), zLine, [1, 0, 0], aF);
  const linFar0 = turn(table('f-lin-far', cut ? nStart.pts : rect(OW, HALF), 4 * T, LIN, LIN_BACK, false, { O: [0, HALF, 4 * T] }), zLine, [1, 0, 0], aF);
  const lHinge = [0, -HALF, T];
  const linFar = flipL >= 0.999 ? turn({ ...linFar0, O: [linFar0.O[0], linFar0.O[1], T] }, lHinge, [1, 0, 0], aL) : linFar0;
  const zip = zipFlat(2 * T, 1, 'f-zip', flipL >= 0.5 ? -ZW + 0.4 : 0, flipL < 0.5);
  const flat = flipL >= 0.999;
  // painter: what lies low first; a far half in the air last
  return [
    ...(flat ? [linNear] : []), outerNear, ...moonsNear, ...zip, ...(flat ? [] : [linNear]),
    ...(foldO > 0 ? moonsFar.filter((m) => m.O[2] > -1) : []), outerFar, ...(flat ? [linFar] : [linFar]),
  ];
}

/** The END VIEW of step 8: outer (left of the zipper) and lining (right), folded by foldO / foldL. */
function loopInset(flipL, foldO, foldL) {
  const segs = [];
  const p = (a, b) => segs.push({ a, b });
  const lift = 0.6; // layers drawn apart
  p([0, 0], [HALF, 0]);
  p([HALF, 0], rot2([OL, 0], [HALF, lift / 2], Math.PI * foldO));
  const lin = (q) => rot2(q, [0, lift], Math.PI * flipL);
  const l0 = lin([0, lift]), l1 = lin([HALF, lift]);
  p(l0, l1);
  if (flipL >= 0.999) p(l1, rot2(lin([OL, lift]), l1, -Math.PI * foldL));
  else p(l1, lin([OL, lift]));
  return { segs, range: [-HALF - 2, HALF + 2] };
}

function stepZip2(t) {
  const flipL = span(t, 0.04, 0.28), fold = span(t, 0.34, 0.62), sew = span(t, 0.7, 0.94);
  const s = { flipL, foldO: fold, foldL: fold };
  return {
    pieces: stateFolded(s),
    over: [
      { type: 'label', p: [OW / 2, -HALF, 0], label: 'liningAway', o: span(t, 0.1, 0.16) * (1 - span(t, 0.3, 0.34)) },
      { type: 'label', p: [OW / 2, 0, 0], label: 'foldBoth', o: span(t, 0.36, 0.42) * (1 - span(t, 0.62, 0.66)), dy: -8 },
      { type: 'line', pts: [[0, Y_LINE, 6 * T], [OW, Y_LINE, 6 * T]], t: sew, kind: 'hot' },
      { type: 'label', p: [OW, Y_LINE, 6 * T], label: 'otherSide', o: span(t, 0.72, 0.78), dx: 10, dy: -6, hot: true },
    ],
    inset: loopInset(flipL, fold, fold),
  };
}

/* Steps 9–10: the bag flat, inside out: the outer half (y 0…15.5) and the lining half (y -15.5…0). */

const FLAT = (cut = false) => stateFolded({ flipL: 1, foldO: 1, foldL: 1, cut });
const GAP_Y = [-HALF / 2 - SPEC.opening / 2, -HALF / 2 + SPEC.opening / 2]; // the opening, in the middle of the lining's side

function stepSides(t) {
  const open = span(t, 0.04, 0.2), sew = span(t, 0.3, 0.88);
  const z = 7 * T;
  const left = [[SPEC.seam, -HALF, z], [SPEC.seam, HALF, z]];
  const rLin = [[OW - SPEC.seam, -HALF, z], [OW - SPEC.seam, GAP_Y[0], z]];
  const rLin2 = [[OW - SPEC.seam, GAP_Y[1], z], [OW - SPEC.seam, HALF, z]];
  const pull = { id: 'side-pull', pts: [[0, 0], [1.6, 0.3], [1.6, -0.3]].map(([u, v]) => [u, v]), O: [lerp(OW - 1.2, OW / 2, open), 0, z], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], fill: F('pull'), inner: F('pull') };
  const k = (a) => span(sew, a, a + 0.5);
  return {
    pieces: [...FLAT(), pull],
    over: [
      { type: 'label', p: [OW / 2, 0, z], label: 'openZipper', o: span(t, 0.04, 0.1) * (1 - span(t, 0.24, 0.28)), dy: -7, hot: true },
      { type: 'line', pts: left, t: k(0), kind: 'hot' },
      { type: 'line', pts: rLin, t: k(0.5) * 1, kind: 'hot', o: sew > 0.5 ? 1 : 0 },
      { type: 'line', pts: rLin2, t: k(0.5), kind: 'hot', o: sew > 0.5 ? 1 : 0 },
      { type: 'line', pts: [[OW - SPEC.seam, GAP_Y[0], z], [OW - SPEC.seam, GAP_Y[1], z]], kind: 'open', o: span(t, 0.7, 0.76) },
      { type: 'label', p: [OW - SPEC.seam, -HALF / 2, z], label: 'opening6', o: span(t, 0.72, 0.78), dx: -12, dy: 5, hot: true },
      { type: 'label', p: [SPEC.seam, HALF / 2, z], label: 'seam05', o: span(t, 0.32, 0.38) * (1 - span(t, 0.66, 0.7)), dx: 10 },
      { type: 'label', p: [OW / 2, HALF / 2, z], label: 'outerHalf', o: span(t, 0.88, 0.94) },
      { type: 'label', p: [OW / 2, -HALF / 2, z], label: 'liningHalf', o: span(t, 0.88, 0.94) },
    ],
  };
}

/* Step 10: cut 3.5 (along the bottom) × 2.5 (along the side seam) from each bottom corner; flatten and sew. */
const NOTCHES = [
  { x: 0, y: HALF, sx: 1, sy: -1 }, { x: OW, y: HALF, sx: -1, sy: -1 },
  { x: 0, y: -HALF, sx: 1, sy: 1 }, { x: OW, y: -HALF, sx: -1, sy: 1 },
];
const notchRect = (n) => [[n.x, n.y], [n.x + n.sx * NX, n.y], [n.x + n.sx * NX, n.y + n.sy * NY], [n.x, n.y + n.sy * NY]];

/*
  Mark the four rectangles, cut them out through both layers (the outline gets a real step, the
  cut-offs slide away on the table), then open each cut corner and flatten it so that the side
  seam lies on the bottom fold: the corner stands up as a small flat fin, its cut edge one
  straight line; sew across it. The END VIEW looks at a corner end-on: the opened cut is a
  triangle (the side seam at its tip, the fold in the middle of its base) that flattens into a line.
*/
const FIN_H = 2 * NY; // the fin's cut edge — the bottom's cut, across the fold (drawing)

function cornerFin(n, i, h, z) {
  const c = [n.x + n.sx * NX, n.y + n.sy * NY]; // the inner corner of the cut
  const dx = n.x - c[0], dy = n.y - c[1], len = Math.hypot(dx, dy);
  const d = [dx / len, dy / len, 0];
  const fill = n.y > 0 ? BACK : LIN_BACK;
  const fin = {
    id: `fin-${i}`, pts: [[0, h / 2], [len, 0], [len, h]], O: [c[0], c[1], z], U: d, V: [0, 0, 1], out: [-d[1], d[0], 0],
    fill, inner: fill, lines: [{ pts: [[0, h / 2], [len, h / 2]], kind: 'seam' }],
  };
  const at = (s, v) => [c[0] + d[0] * s, c[1] + d[1] * s, z + v];
  return { fin, stitch: [at(len - SPEC.seam, SPEC.seam * (h / FIN_H)), at(len - SPEC.seam, h - SPEC.seam * (h / FIN_H))], top: at(len, h) };
}

/** The END VIEW: the opened cut seen end-on — a triangle whose tip (the side seam) comes down onto the fold. */
function cornerInset(pinch) {
  const b = FIN_H / 2, tip = Math.sqrt(NX ** 2 - b ** 2) * (1 - pinch);
  return {
    segs: [
      { a: [-b, 0], b: [b, 0] }, // the bottom's cut, across the fold
      { a: [-b, 0], b: [0, tip] }, { a: [b, 0], b: [0, tip] }, // the cuts along the side seam, front and back
      { a: [0, 0], b: [0, -0.7] }, // the fold
      { a: [0, tip], b: [0, tip + 0.7] }, // the side seam
    ],
    range: [-3.6, 3.6],
  };
}

function stepCorners(t) {
  const mark = span(t, 0.04, 0.18), cut = span(t, 0.22, 0.26), away = span(t, 0.26, 0.4);
  const pinch = span(t, 0.48, 0.64), sew = span(t, 0.7, 0.92);
  const z = 7.5 * T;
  const pieces = [...FLAT(cut > 0.5)];
  const over = [];
  const fins = NOTCHES.map((n, i) => cornerFin(n, i, FIN_H * Math.max(pinch, 0.001), z));
  NOTCHES.forEach((n, i) => {
    const r = notchRect(n);
    const fill = n.y > 0 ? BACK : LIN_BACK;
    over.push({ type: 'line', pts: [r[1], r[2], r[3]].map(([x, y]) => [x, y, z + 0.05]), t: mark, kind: 'mark', o: 1 - cut });
    // the cut-off rectangle slides away on the table and is gone
    if (cut > 0.5 && away < 0.999) pieces.push(table(`cutoff-${i}`, r, z, fill, fill, true, { O: [-n.sx * away * 4, -n.sy * away * 4, z], opacity: 1 - away }));
    if (pinch > 0.001) pieces.push(fins[i].fin);
    over.push({ type: 'line', pts: fins[i].stitch, t: sew, kind: 'hot', o: pinch > 0.001 ? 1 : 0 });
  });
  const near = fins[0]; // the outer's left corner: its fin faces the viewer
  return {
    pieces,
    over: [
      ...over,
      { type: 'dim', a: [0, HALF + 2, z], b: [NX, HALF + 2, z], label: 'cm35', o: span(t, 0.08, 0.14) * (1 - span(t, 0.4, 0.44)), hot: true },
      { type: 'dim', a: [-2, HALF - NY, z], b: [-2, HALF, z], label: 'cm25', o: span(t, 0.08, 0.14) * (1 - span(t, 0.4, 0.44)), hot: true },
      { type: 'label', p: [NX, HALF - NY, z], label: 'cutCorners', o: span(t, 0.22, 0.28) * (1 - span(t, 0.4, 0.44)), dx: 12, dy: -6 },
      { type: 'label', p: near.top, label: 'seamOnFold', o: span(t, 0.5, 0.56) * (1 - span(t, 0.68, 0.72)), dx: 14, dy: -8, hot: true },
      { type: 'label', p: near.top, label: 'pinchSew', o: span(t, 0.72, 0.78) * (1 - span(t, 0.9, 0.94)), dx: 14, dy: -8, hot: true },
      { type: 'label', p: [OW / 2, 0, z], label: 'allFour', o: span(t, 0.92, 0.97) },
    ],
    inset: t > 0.44 ? cornerInset(pinch) : null,
    focus: { pts: [[-3, HALF - 6, 0], [7, HALF + 3, 0], [NX, HALF - NY, FIN_H + 1], [-3, HALF, FIN_H + 1]], k: 0.8 * span(t, 0.02, 0.1) * (1 - span(t, 0.9, 0.97)) },
  };
}

/* Step 11: turn it out through the opening, close it by hand, push the lining in, close the zipper. */

/** The lining out of the zipper above the bag: a box, its bottom up, the opening in its right side seam. */
const tube = (ext, close) => shell({
  key: 'tube', xa: -Z / 2 + 0.6, xb: Z / 2 - 0.6, ya: -BD / 2 + 0.4, yb: BD / 2 - 0.4, z0: TOPZ, h: Math.max(ext, 0.01),
  fill: LIN, inner: LIN_BACK, seams: true, lid: true,
  opening: close < 0.999 ? [ext / 2 - SPEC.opening / 2, ext / 2 + SPEC.opening / 2] : null,
}).walls.filter(facingOut);

function stepTurn(t) {
  const turned = span(t, 0.08, 0.3), close = span(t, 0.36, 0.62), push = span(t, 0.7, 0.86), zipUp = span(t, 0.88, 0.97);
  const ext = 12 * (1 - push);
  const flat = fadeAll([...FLAT(true), ...NOTCHES.map((n, i) => cornerFin(n, i, FIN_H, 7.5 * T).fin)], 1 - turned);
  const bag = fadeAll(bagPieces({ open: 1 - zipUp, zip: false }), turned);
  const lining = fadeAll(tube(ext, close), turned * (1 - span(t, 0.8, 0.86)));
  const zip = fadeAll(zipperOnTop(TOPZ, (1 - zipUp) * 0.85), turned);
  const gx = Z / 2 - 0.6 + 0.12;
  const gap = [[gx, 0, TOPZ + ext / 2 + SPEC.opening / 2], [gx, 0, TOPZ + ext / 2 - SPEC.opening / 2]];
  return {
    pieces: [...flat, ...bag, ...zip, ...lining],
    over: [
      { type: 'arrow', pts: [[OW, -HALF / 2, 1], [OW + 6, -HALF / 2, 6], [OW + 9, -HALF / 2 + 4, 12]], t: span(t, 0.02, 0.12), o: 1 - turned },
      { type: 'label', p: [OW + 9, -HALF / 2 + 4, 12], label: 'turnThrough', o: span(t, 0.02, 0.08) * (1 - turned), dx: -18, dy: -4 },
      { type: 'line', pts: gap, kind: 'open', o: turned * (1 - close) },
      { type: 'line', pts: gap, t: close, kind: 'hotstitch', o: turned * (1 - push) },
      { type: 'label', p: gap[0], label: 'byHand', o: span(t, 0.36, 0.42) * (1 - span(t, 0.66, 0.7)), dx: 12, hot: true },
      { type: 'arrow', pts: [[0, 0, TOPZ + 16], [0, 0, TOPZ + 6]], o: span(t, 0.68, 0.72) * (1 - span(t, 0.84, 0.88)) },
      { type: 'label', p: [0, 0, TOPZ + 18], label: 'pushLining', o: span(t, 0.68, 0.72) * (1 - span(t, 0.84, 0.88)) },
      { type: 'label', p: [0, 0, TOPZ], label: 'closeZip', o: span(t, 0.9, 0.95), dy: -8 },
    ],
  };
}

/* ---------- Steps ---------- */

/*
  Steps — how each one is built, without words. Every text lives in cosmetic.<lang>.js,
  index-aligned with this array (cosmetic.text.js checks it). `sew` fabrics: 'print' (the
  outer) | 'pink' | 'lining' — the colour under the mini machine. `uses` — catalog ids.
  The last step has no machine: the opening is closed by hand.
*/
export const STEPS = [
  {}, // 0: the finished bag
  {
    scene: stepCut, duration: 4.5,
    uses: ['quilting-fabric-bundles', 'solid-cotton-squares', 'plantional-lightweight-interfacing', 'olfa-rotary-cutter', 'olfa-cutting-mat', 'quilting-rulers-set'],
  },
  { scene: stepTemplate, duration: 5.5, uses: ['sewline-air-erasable-pen', 'tailor-scissors'] },
  { scene: stepMoonSew, duration: 6, stitch: 'straight', sew: [[0.6, 0.9, 'pink']], uses: ['rowenta-travel-iron', 'janome-1522rd', 'hagbou-thread-set'] },
  { scene: stepMoonTurn, duration: 5.5, uses: ['tailor-scissors'] },
  { scene: stepIface, duration: 5, uses: ['rowenta-travel-iron'] },
  { scene: stepMoons, duration: 6, stitch: 'straight', sew: [[0.5, 0.9, 'pink']], uses: ['soraco-sewing-clips', 'janome-1522rd'] },
  { scene: stepZip1, duration: 6, stitch: 'straight', sew: [[0.62, 0.92, 'lining']], uses: ['soraco-sewing-clips', 'janome-1522rd'] },
  { scene: stepZip2, duration: 7, stitch: 'straight', sew: [[0.7, 0.94, 'lining']], pad: 0.22, uses: ['janome-1522rd'] },
  { scene: stepSides, duration: 6, stitch: 'straight', sew: [[0.3, 0.88, 'lining']], uses: ['soraco-sewing-clips', 'janome-1522rd'] },
  { scene: stepCorners, duration: 7.5, stitch: 'straight', sew: [[0.7, 0.92, 'print']], uses: ['quilting-rulers-set', 'sewline-air-erasable-pen', 'tailor-scissors', 'janome-1522rd'] },
  { scene: stepTurn, duration: 7, uses: [] },
];

/**
  The static cutting diagram (cut-diagram.js; an <img> on the project page): the end of this
  step + these lines of `legend` from the texts (outer, interfacing, pink corners, zipper, lining, seams).
*/
export const CUT = { step: 1, legend: [0, 1, 2, 3, 4, 5] };

/** Every chip key the drawing uses — each language must have them all (cosmetic.text.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far apart it is) → { body, viewBox }. L = the texts (cosmetic.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  floorAt: (k) => (k === 0 || k === 11 ? [0, 0, 0] : null),
  shadow: [BW * 0.62, BW * 0.36],
  fabrics: { print: '#efd9d2', pink: '#e2a9a4', lining: '#b9615d' },
});

/** Fabric patterns (ids prefixed with the figure's ID), in each piece's own cm coordinates. */
export const DEFS = `
<defs>
  <pattern id="${ID}-print" width="6" height="6" patternUnits="userSpaceOnUse">
    <rect width="6" height="6" fill="#f3e3dc"/>
    <circle cx="1.6" cy="1.6" r=".9" fill="#c98a86" opacity=".85"/><circle cx="1.6" cy="1.6" r=".35" fill="#a86f6c"/>
    <circle cx="4.6" cy="4.4" r=".7" fill="#d9a7a3" opacity=".85"/>
    <path d="M2.6 2.2q.9.3 1.3 1.2M4.4 1.2q.5.4.3 1" stroke="#7f9469" stroke-width=".25" fill="none"/>
  </pattern>
  <pattern id="${ID}-back" width="6" height="6" patternUnits="userSpaceOnUse">
    <rect width="6" height="6" fill="#f7ede8"/>
    <rect width="6" height="6" fill="url(#${ID}-print)" opacity=".18"/>
  </pattern>
  <pattern id="${ID}-lining" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#b9615d"/><path d="M0 4L4 0" stroke="#a65450" stroke-width=".25"/>
  </pattern>
  <pattern id="${ID}-liningBack" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#d79a96"/>
  </pattern>
  <pattern id="${ID}-pink" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#e2a9a4"/><circle cx="1.5" cy="1.5" r=".25" fill="#f3d3d0"/>
  </pattern>
  <pattern id="${ID}-pinkBack" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#f0cfcc"/>
  </pattern>
  <pattern id="${ID}-iface" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#fbf8f2"/>
    <path d="M.4 .6l.8.4M1.8 2.1l.7-.5M2.2 .5l.3.6" stroke="#d8cdbd" stroke-width=".12"/>
  </pattern>
  <pattern id="${ID}-paper" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#fffdf8"/><path d="M0 3.6H4" stroke="#c9d6e0" stroke-width=".12"/>
  </pattern>
  <pattern id="${ID}-tape" width="2" height="2" patternUnits="userSpaceOnUse">
    <rect width="2" height="2" fill="#a86f6c"/><path d="M0 1H2" stroke="#97615e" stroke-width=".2"/>
  </pattern>
  <pattern id="${ID}-teeth" width=".6" height=".7" patternUnits="userSpaceOnUse">
    <rect width=".6" height=".7" fill="#8f5552"/><rect x=".08" width=".3" height=".7" fill="#e9c4c1"/>
  </pattern>
  <linearGradient id="${ID}-pull" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e8e2d8"/><stop offset="1" stop-color="#9a948c"/>
  </linearGradient>
  <pattern id="${ID}-board" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#fbf8f2"/>
  </pattern>
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

/*
  Fabric basket — the anatomy figure's model and its sewing steps.
  Every number comes from the maker (Vault: «Анатомия изделий — Корзинка»; video
  https://www.youtube.com/watch?v=7kt1rZdiFCM — its on-screen "50 × 50 cm" is a mistake,
  the square is 60 × 60). Change numbers HERE only. Words: basket.<lang>.js (basket.text.js).

  The basket is a cross: a square with a square cut from each corner. Its centre is the
  base, its arms are the four walls; the walls fold up and adjacent edges are sewn — four
  corner seams. Outer (cotton + heavy fusible interfacing) and lining (cotton) are made the
  same way, sewn together round the top, turned through an opening in a lining corner seam.
  Ribbon and bows are glued on, and any trim works — step 8 shows three versions.

  Step 0 is the finished basket (tap to take it apart); steps 1–8 each animate one stage of
  sewing over t = 0…1. Shared parts (shell, camera, inset, machine, renderer): kit.js.
*/
import { at, lerp, turn } from './iso.js';
import { fadeAll, inside, labelKeys, makeRenderer, outside, rect, shell, span } from './kit.js';

const ID = 'fabric-basket'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {
  square: 60, // outer and lining: one 60 × 60 cm square each
  corner: 20, // a 20 × 20 cm square cut from each corner → the base and four walls, 20 × 20 each
  interfacing: 19, // heavy fusible, 5 squares (base + 4 walls), centred, 0.5 cm smaller each side; outer only
  seam: 0.5,
  opening: 15, // left open in one corner seam of the lining (the interfaced walls are stiff)
  topstitch: 0.5,
};

const SQ = SPEC.square, C = SPEC.corner;
const B = SQ - 2 * C; // 20: the base (the centre of the cross); the walls are B wide, C tall
const IF = SPEC.interfacing, M = (C - IF) / 2; // 0.5: interfacing margin on every side
const W = B - 2 * SPEC.seam; // 19: the base once the corner seams are sewn (drawing only — not published)
const H = C - SPEC.seam; // 19.5: wall height once the top is sewn (drawing only — not published)
const T = 0.25; // fabric thickness in the drawing (cm)
const LINE = 0.35; // gap between outer and lining
const GAP = [(C - SPEC.opening) / 2, (C + SPEC.opening) / 2]; // the opening, cm up the corner seam (drawn centred)

const F = (name) => `url(#${ID}-${name})`;
const LOOK = {
  christmas: { fabric: F('xmas'), trim: F('lace'), bow: F('bowWhite'), bead: F('bead') },
  halloween: { fabric: F('amber'), trim: F('ribbonInk'), bow: F('bowInk'), bead: F('beadAmber') },
  everyday: { fabric: F('sage') },
};
const BACK = F('back'); // wrong side of the outer cotton
const CHECK = F('check'), CHECK_BACK = F('checkBack'); // the lining: grey check
const IFACE = F('iface');

/* ---------- Pieces ---------- */

/** Interfacing on a 20 × 20 panel: a 19 × 19 square, 0.5 cm in, on the given side ('in' = wrong side). */
const ifaceLine = (side) => ({ pts: [[M, M], [C - M, M], [C - M, C - M], [M, C - M], [M, M]], kind: 'iface', side });

/*
  The cross lying flat, RIGHT side up, its base on [20,40]², or folded into a box by `up`
  (0 flat … 1 walls upright). Panels are 20 × 20: the base and the walls back (y < 20),
  front (y > 40), left (x < 20), right (x > 40); each wall turns up about its base edge.
  Painter order: the walls beyond the base, the base, the walls before it.
*/
function crossBox({ key, up, fill, inner, iface }) {
  const lines = iface ? [ifaceLine('in')] : [];
  const base = { id: `${key}-base`, pts: rect(B, B), O: [C, C, 0], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], fill, inner, lines };
  const a = (Math.PI / 2) * up;
  const wall = (id, O, U, V, axis, sign) =>
    turn({ id: `${key}-${id}`, pts: rect(B, C), O, U, V, out: [0, 0, 1], fill, inner, lines }, O, axis, sign * a);
  const back = wall('back', [C, C, 0], [1, 0, 0], [0, -1, 0], [1, 0, 0], -1);
  const front = wall('front', [C, C + B, 0], [1, 0, 0], [0, 1, 0], [1, 0, 0], 1);
  const left = wall('left', [C, C, 0], [0, 1, 0], [-1, 0, 0], [0, 1, 0], 1);
  const right = wall('right', [C + B, C, 0], [0, 1, 0], [1, 0, 0], [0, 1, 0], -1);
  return [back, left, base, front, right];
}

/** A plain box (kit `shell`) with interfacing squares on the walls' outside (the outer, inside out). */
const ifaceOutside = (walls) => walls.map((p) => (p.id.endsWith('-lid') ? p : { ...p, lines: [...(p.lines ?? []), {
  pts: [[M, M], [p.pts[1][0] - M, M], [p.pts[1][0] - M, p.pts[2][1] - M], [M, p.pts[2][1] - M], [M, M]], kind: 'iface', side: 'out',
}] }));

/* ---------- Trim: the ribbon round the top and a bow on every corner ---------- */

const RH = 2.4; // ribbon height in the drawing (any ribbon works — not a measurement)
const RZ = H - 2.4 - RH; // ribbon bottom edge, a little below the topstitching
const JOINT = W * 0.3; // where the ribbon starts and ends: on the flat of the front wall, not on a corner

/*
  The ribbon, glued on from the joint round the basket (draw-on 0…1): front wall from the joint
  to the corner, right wall, back, left (both hidden), front again up to the joint. Only the walls
  turned to the viewer get a strip.
*/
function ribbon(fill, p) {
  const s = 4 * W * p;
  const runs = [
    { from: 0, len: W - JOINT, O: [JOINT, W + 0.06, RZ], U: [1, 0, 0], out: [0, 1, 0] },
    { from: W - JOINT, len: W, O: [W + 0.06, W, RZ], U: [0, -1, 0], out: [1, 0, 0] },
    { from: 4 * W - JOINT, len: JOINT, O: [0, W + 0.06, RZ], U: [1, 0, 0], out: [0, 1, 0] },
  ];
  return runs.flatMap((r, i) => {
    const l = Math.min(r.len, Math.max(0, s - r.from));
    if (l < 0.05) return [];
    return [{ id: `ribbon-${i}`, pts: rect(l, RH), O: r.O, U: r.U, V: [0, 0, 1], out: r.out, fill, inner: fill }];
  });
}

const LOOP = [[0, 0], [-1.2, 1.4], [-2.8, 2.2], [-3.7, 1.5], [-3.9, 0], [-3.7, -1.5], [-2.8, -2.2], [-1.2, -1.4]];
const TAIL = [[-0.3, -0.4], [-1.5, -3.6], [-0.5, -3.2], [0.2, -0.6]];
const KNOT = [[-0.7, -0.8], [0.7, -0.8], [0.7, 0.8], [-0.7, 0.8]];
const BEAD = Array.from({ length: 12 }, (_, i) => [0.62 * Math.cos((i * Math.PI) / 6), 0.62 * Math.sin((i * Math.PI) / 6)]);
const mirror = (pts) => pts.map(([u, v]) => [-u, v]);

/** One bow (tails, loops, knot, bead) centred at c in the plane spanned by U and up; grows with s 0…1. */
function bow(key, c, U, out, look, s) {
  if (s <= 0.01) return [];
  const k = 0.8 * (0.5 + 0.5 * s);
  const place = (id, pts, fill) => ({
    id: `${key}-${id}`, pts: pts.map(([u, v]) => [u * k, v * k]), O: c, U, V: [0, 0, 1], out, fill, inner: fill, opacity: s,
  });
  const parts = [
    place('tail-l', TAIL, look.bow), place('tail-r', mirror(TAIL), look.bow),
    place('loop-l', LOOP, look.bow), place('loop-r', mirror(LOOP), look.bow),
    place('knot', KNOT, look.bow),
  ];
  if (look.bead) parts.push(place('bead', BEAD, look.bead));
  return parts;
}

const BZ = RZ + RH / 2; // bows sit on the ribbon, on the corners
const BOWS = [
  // the left and the right corner: on the face turned to the viewer; the front corner: across it; the back one is hidden
  { c: [1.7, W + 0.12, BZ], U: [1, 0, 0], out: [0, 1, 0] },
  { c: [W + 0.15, W + 0.15, BZ], U: [Math.SQRT1_2, -Math.SQRT1_2, 0], out: [Math.SQRT1_2, Math.SQRT1_2, 0] },
  { c: [W + 0.12, 1.7, BZ], U: [0, -1, 0], out: [1, 0, 0] },
];

/** The ribbon (draw-on r) and the bows (each pops in over its own window of b) of one look. */
function trim(look, r, b) {
  if (!look.trim) return [];
  return [
    ...ribbon(look.trim, r),
    ...BOWS.flatMap((w, i) => bow(`bow-${i}`, w.c, w.U, w.out, look, span(b, i * 0.25, i * 0.25 + 0.5))),
  ];
}

/* ---------- The finished basket ---------- */

/** Outer + lining, sewn and topstitched, in the painter order (the trim goes on top). */
function basketPieces(look, { topstitch = 1, topKind = 'stitch' } = {}) {
  const outer = shell({
    key: 'outer', xa: 0, xb: W, ya: 0, yb: W, h: H, fill: look.fabric, inner: BACK, seams: false,
    top: topstitch > 0 ? { at: SPEC.topstitch, t: topstitch, kind: topKind } : null,
  }).walls;
  const lining = shell({
    key: 'lining', xa: LINE, xb: W - LINE, ya: LINE, yb: W - LINE, z0: LINE, h: H - LINE,
    fill: CHECK_BACK, inner: CHECK, seams: false,
  }).walls;
  return [...inside(outer), ...inside(lining), ...outside(lining), ...outside(outer)];
}

/** Two looks of the same basket cross-faded piece by piece (o = 0 → a, 1 → b), so nothing shows through. */
function crossfade(a, b, o) {
  if (o <= 0.001) return a;
  if (o >= 0.999) return b;
  return a.flatMap((p, i) => [p, { ...b[i], opacity: o }]);
}

/* ---------- Step 0: the finished basket, together (e = 0) or apart (e = 1) ---------- */

function anatomy(e = 0) {
  const lift = span(e, 0, 0.7), aside = span(e, 0.35, 1), show = span(e, 0.3, 0.8);
  const L = LOOK.christmas;
  const outer = shell({
    key: 'outer', xa: 0, xb: W, ya: 0, yb: W, h: H, fill: L.fabric, inner: BACK, seams: false,
    top: { at: SPEC.topstitch, t: 1 },
  }).walls;
  const move = (ps, d) => ps.map((p) => ({ ...p, O: [p.O[0] + d[0], p.O[1] + d[1], p.O[2] + d[2]] }));
  // apart: the interfacing (a box of 5 squares, as it sits inside the outer) and the lining, lifted out to the left
  const iface = fadeAll(move(shell({ key: 'iface', xa: M, xb: W - M, ya: M, yb: W - M, h: IF, fill: IFACE, inner: IFACE, seams: false }).walls,
    [lerp(0, -W - 7, aside), 0, lerp(0, H + 3, lift) - lerp(0, 12, aside)]), show);
  const lining = move(shell({
    key: 'lining', xa: LINE, xb: W - LINE, ya: LINE, yb: W - LINE, z0: LINE, h: H - LINE, fill: CHECK_BACK, inner: CHECK, seams: false,
  }).walls, [lerp(0, -2 * W - 14, aside), 0, lerp(0, 2 * H + 6, lift) - lerp(0, 24, aside)]);
  return {
    pieces: [...inside(outer), ...inside(lining), ...outside(lining), ...inside(iface), ...outside(iface), ...outside(outer), ...trim(L, 1, 1)],
    over: [],
  };
}

/** Numbered pins for the legend (shown when apart). */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  return [
    { n: 1, p: at(byId['outer-front'], W * 0.62, H * 0.4) },
    { n: 2, p: at(byId['iface-front'], (W - 2 * M) * 0.5, IF * 0.45) },
    { n: 3, p: at(byId['lining-front'], (W - 2 * LINE) * 0.5, H * 0.45) },
    { n: 4, p: at(byId['ribbon-1'], W * 0.55, RH / 2) },
    { n: 5, p: at(byId['bow-1-knot'], 0, 0) },
    { n: 6, p: at(byId['outer-front'], W * 0.3, H - SPEC.topstitch) },
  ];
}

/* ---------- Step 1: cut — two 60 cm squares, a 20 cm square off every corner; 5 squares of interfacing ---------- */

const CROSS = [[C, 0], [C + B, 0], [C + B, C], [SQ, C], [SQ, C + B], [C + B, C + B], [C + B, SQ], [C, SQ], [C, C + B], [0, C + B], [0, C], [C, C]];
const CORNERS = [[0, 0], [C + B, 0], [0, C + B], [C + B, C + B]];
const OUTER_Z = SQ + 6; // the outer above the lining on the cutting board
const IF_X = SQ + 8, IF_STEP = (OUTER_Z + SQ - IF) / 4; // the interfacing squares in a column on the right

function stepCut(t) {
  const board = (id, pts, x, z, fill, extra = {}) =>
    ({ id, pts, O: [x, 0, z], U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], fill, inner: fill, ...extra });
  const pieces = [];
  const marks = [];
  const mark = span(t, 0.3, 0.4), off = span(t, 0.44, 0.62);
  [['outer', OUTER_Z, LOOK.christmas.fabric], ['lining', 0, CHECK]].forEach(([key, z, fill], i) => {
    const a = span(t, i * 0.12, i * 0.12 + 0.25);
    pieces.push(board(`cut-${key}`, CROSS, 0, z + (1 - a) * 8, fill, { opacity: a }));
    // mark the four corner squares (the inner edges of each), then cut them away
    for (const L of [[[C, 0], [C, C], [0, C]], [[C + B, 0], [C + B, C], [SQ, C]], [[0, C + B], [C, C + B], [C, SQ]], [[SQ, C + B], [C + B, C + B], [C + B, SQ]]]) {
      marks.push({ type: 'line', pts: L.map(([u, v]) => [u, 0, z + v]), t: mark, kind: 'mark', o: mark > 0 ? 1 - off : 0 });
    }
    CORNERS.forEach(([u, v], j) => {
      const dx = (u === 0 ? -1 : 1) * 6 * off, dz = (v === 0 ? -1 : 1) * 6 * off;
      const o = a * (1 - off);
      if (o > 0.01) pieces.push(board(`cut-${key}-corner-${j}`, rect(C, C), u + dx, z + v + dz + (1 - a) * 8, fill, { opacity: o }));
    });
  });
  for (let i = 0; i < 5; i++) {
    const a = span(t, 0.62 + i * 0.04, 0.72 + i * 0.04);
    pieces.push(board(`cut-iface-${i}`, rect(IF, IF), IF_X, OUTER_Z + SQ - IF - i * IF_STEP + (1 - a) * 6, IFACE, { opacity: a }));
  }
  const o = span(t, 0.78, 0.95);
  const cut = span(t, 0.42, 0.48) * (1 - span(t, 0.62, 0.68));
  return {
    pieces,
    over: [
      ...marks,
      { type: 'label', p: [C / 2, 0, OUTER_Z + SQ - C / 2], label: 'cutCorners', o: cut, hot: true },
      { type: 'dim', a: [0, 0, OUTER_Z + SQ + 5], b: [SQ, 0, OUTER_Z + SQ + 5], label: 'cm60', o },
      { type: 'dim', a: [-5, 0, OUTER_Z], b: [-5, 0, OUTER_Z + SQ], label: 'cm60', o },
      { type: 'dim', a: [0, 0, -5], b: [C, 0, -5], label: 'cm20', o, hot: true },
      { type: 'dim', a: [-5, 0, 0], b: [-5, 0, C], label: 'cm20', o, hot: true },
      { type: 'dim', a: [IF_X + IF + 4, 0, OUTER_Z + SQ - IF], b: [IF_X + IF + 4, 0, OUTER_Z + SQ], label: 'cm19', o },
      { type: 'label', p: [SQ / 2 + 8, 0, OUTER_Z + SQ / 2], label: 'outerCotton', o },
      { type: 'label', p: [SQ / 2 + 8, 0, SQ / 2], label: 'liningCotton', o },
      { type: 'label', p: [IF_X + IF / 2, 0, -5], label: 'iface5', o },
    ],
  };
}

/* ---------- Step 2: fuse the interfacing — 5 squares on the wrong side of the outer ---------- */

const CENTRES = [[C + B / 2, C + B / 2], [C + B / 2, C / 2], [C + B / 2, SQ - C / 2], [C / 2, C + B / 2], [SQ - C / 2, C + B / 2]];

function stepIface(t) {
  const cross = {
    id: 'iface-cross', pts: CROSS, O: [0, 0, 0], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, -1],
    fill: LOOK.christmas.fabric, inner: BACK,
  };
  const squares = CENTRES.map(([cx, cy], i) => {
    const d = span(t, 0.12 + i * 0.1, 0.24 + i * 0.1);
    return {
      id: `iface-${i}`, pts: rect(IF, IF), O: [cx - IF / 2, cy - IF / 2, T + (1 - d) * 14], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1],
      fill: IFACE, inner: IFACE, opacity: d,
    };
  });
  const iron = span(t, 0.7, 0.76) * (1 - span(t, 0.9, 0.95));
  const o = span(t, 0.84, 0.92);
  const [fx, fy] = CENTRES[2]; // the front wall's square: dimensions on it
  return {
    pieces: [cross, ...squares],
    over: [
      { type: 'label', p: [SQ / 2, SQ / 2, 0], label: 'wrongSideUp', o: span(t, 0.02, 0.08) * (1 - span(t, 0.14, 0.2)) },
      { type: 'label', p: [SQ / 2, SQ / 2, T], label: 'ironOn', o: iron, hot: true },
      { type: 'dim', a: [fx - IF / 2, SQ + 3, 0], b: [fx + IF / 2, SQ + 3, 0], label: 'cm19', o, hot: true },
      { type: 'label', p: [fx + IF / 2, fy + IF / 2, T], label: 'edges05', o, dx: 14, dy: 6 },
    ],
  };
}

/* ---------- Steps 3–4: fold the walls up, sew the four corner seams ---------- */

const BOX_CORNERS = [[C + B, C + B], [C + B, C], [C, C + B]]; // the front, right and left corners (the back one is hidden)
const corner = ([x, y], z0, z1) => [[x, y, z0], [x, y, z1]];
/** The folded box and room for its chips: where the camera goes while the corners are sewn. */
const BOX_VIEW = [[C, C, C], [C + B + 12, C + B, 0], [C, C + B + 12, 0], [C + B, C, C + 4], [C, C + B, C + 4]];

function stepOuter(t) {
  const flip = span(t, 0.04, 0.22), up = span(t, 0.28, 0.55), sew = span(t, 0.62, 0.92);
  // wrong side up (the interfacing on top), turned over, walls up: right side IN, the interfacing outside
  const before = fadeAll(crossBox({ key: 'outer-wrong', up: 0, fill: BACK, inner: LOOK.christmas.fabric, iface: false }), 1 - flip)
    .map((p) => ({ ...p, lines: [{ ...ifaceLine('out') }] }));
  const after = fadeAll(crossBox({ key: 'outer', up, fill: LOOK.christmas.fabric, inner: BACK, iface: true }), flip);
  const z = 0.06;
  return {
    pieces: [...before, ...after],
    over: [
      { type: 'label', p: [SQ / 2, SQ / 2, 0], label: 'turnOver', o: span(t, 0.02, 0.08) * (1 - span(t, 0.22, 0.27)) },
      { type: 'label', p: [C + B / 2, C + B, C * 0.6], label: 'rightSideIn', o: span(t, 0.5, 0.56) * (1 - span(t, 0.6, 0.64)), dy: -6 },
      ...BOX_CORNERS.map((c) => ({ type: 'line', pts: corner(c, C, z), t: sew, kind: 'hot' })),
      { type: 'label', p: [C + B, C + B, C / 2], label: 'seam05', o: span(t, 0.64, 0.7), dx: 14, hot: true },
      { type: 'label', p: [C + B, C + B, 0], label: 'toThePoint', o: span(t, 0.88, 0.94), dx: 14, dy: 4 },
    ],
    focus: { pts: BOX_VIEW, k: 0.55 * span(t, 0.55, 0.62) },
  };
}

function stepLining(t) {
  const up = span(t, 0.06, 0.34), sew = span(t, 0.4, 0.86);
  const [g0, g1] = GAP;
  const sewGap = (s) => s * C; // how far down the seams have gone (from the top)
  const front = BOX_CORNERS[0];
  const done = sewGap(sew);
  // the front corner: sewn from the top down to the opening, then from below it to the point
  const upper = Math.min(done, C - g1), lower = Math.max(0, done - (C - g0));
  return {
    pieces: crossBox({ key: 'lining', up, fill: CHECK, inner: CHECK_BACK }),
    over: [
      ...BOX_CORNERS.slice(1).map((c) => ({ type: 'line', pts: corner(c, C, 0.06), t: sew, kind: 'hot' })),
      { type: 'line', pts: corner(front, C, g1), t: upper / (C - g1), kind: 'hot' },
      { type: 'line', pts: corner(front, g0, 0.06), t: lower / g0, kind: 'hot', o: lower > 0 ? 1 : 0 },
      { type: 'line', pts: corner([front[0] + 0.2, front[1] + 0.2], g1, g0), kind: 'open', o: span(t, 0.6, 0.66) },
      { type: 'label', p: [front[0], front[1], (g0 + g1) / 2], label: 'opening15', o: span(t, 0.6, 0.66), dx: 15, hot: true },
      { type: 'label', p: [C + B / 2, C + B, C * 0.6], label: 'sameAsOuter', o: span(t, 0.02, 0.08) * (1 - span(t, 0.3, 0.36)), dy: -6 },
    ],
    focus: { pts: BOX_VIEW, k: 0.55 * span(t, 0.32, 0.4) },
  };
}

/* ---------- Step 5: outer right side out, into the inside-out lining, sew round the top ---------- */

function joinState(t) {
  const turned = span(t, 0.04, 0.24), down = span(t, 0.3, 0.62), sew = span(t, 0.7, 0.96);
  const raw = (fill, inner) => shell({ key: 'outer', xa: 0, xb: W, ya: 0, yb: W, h: C, fill, inner, seams: false }).walls;
  const outer = crossfade(ifaceOutside(raw(BACK, LOOK.christmas.fabric)), raw(LOOK.christmas.fabric, BACK), turned);
  const lining = fadeAll(shell({
    key: 'lining', xa: -LINE, xb: W + LINE, ya: -LINE, yb: W + LINE, z0: lerp(C + 16, 0, down), h: C,
    fill: CHECK_BACK, inner: CHECK, seams: false, top: { at: SPEC.seam, t: sew, kind: 'hot' },
  }).walls, span(t, 0.28, 0.36));
  return [...inside(lining), ...inside(outer), ...outside(outer), ...outside(lining)];
}

function stepJoin(t) {
  const z0 = lerp(C + 16, 0, span(t, 0.3, 0.62));
  const o = span(t, 0.58, 0.64);
  return {
    pieces: joinState(t),
    over: [
      { type: 'label', p: [W / 2, W, C * 0.55], label: 'outerRightOut', o: span(t, 0.04, 0.1) * (1 - span(t, 0.24, 0.28)), dy: -4 },
      { type: 'line', pts: corner([W + LINE + 0.15, W + LINE + 0.15], z0 + GAP[1], z0 + GAP[0]), kind: 'open', o },
      { type: 'label', p: [W / 2, W, C * 0.55], label: 'rightSides', o: o * (1 - span(t, 0.68, 0.72)), dy: -4 },
      { type: 'label', p: [W, W / 2, C - SPEC.seam], label: 'seam05', o: span(t, 0.74, 0.8), dx: 13, hot: true },
    ],
  };
}

/* ---------- Step 6: turn it through the opening, stitch the opening closed ---------- */

const outerShell = (top) => shell({ key: 'outer', xa: 0, xb: W, ya: 0, yb: W, h: H, fill: LOOK.christmas.fabric, inner: BACK, seams: false, top }).walls;
const liningInside = () => shell({ key: 'lining', xa: LINE, xb: W - LINE, ya: LINE, yb: W - LINE, z0: LINE, h: H - LINE, fill: CHECK_BACK, inner: CHECK, seams: false }).walls;
/** The lining pulled out above the outer: its bottom up, right side out, ext cm tall. */
const tubeShell = (ext) => shell({ key: 'tube', xa: LINE, xb: W - LINE, ya: LINE, yb: W - LINE, z0: H, h: Math.max(ext, 0.01), fill: CHECK, inner: CHECK_BACK, seams: false, lid: true }).walls;

/** The outer right side out, the lining pulled out above it; `gap` — the opening on the tube's front corner. */
function turnedState(ext) {
  const outer = outerShell(null), tube = tubeShell(ext);
  return { pieces: [...inside(outer), ...inside(tube), ...outside(tube), ...outside(outer)], gap: [H + ext - GAP[1], H + ext - GAP[0]] };
}

function stepTurn(t) {
  const turned = span(t, 0.18, 0.36), close = span(t, 0.48, 0.8);
  const ext = H - LINE;
  const after = turnedState(ext);
  const [lo, hi] = after.gap;
  const edge = [W - LINE + 0.12, W - LINE + 0.12];
  const turnArc = [[W + LINE, W + LINE, 8], [W + 7, W + 7, 12], [W + 11, W + 11, 20]];
  return {
    pieces: [...fadeAll(joinState(1), 1 - turned), ...fadeAll(after.pieces, turned)],
    over: [
      { type: 'line', pts: corner([W + LINE + 0.15, W + LINE + 0.15], GAP[1], GAP[0]), kind: 'open', o: 1 - turned },
      { type: 'arrow', pts: turnArc, t: span(t, 0.02, 0.16), o: 1 - turned },
      { type: 'label', p: [W + 11, W + 11, 20], label: 'turnThrough', o: span(t, 0.04, 0.1) * (1 - turned), dy: -4 },
      { type: 'line', pts: corner(edge, hi, lo), kind: 'open', o: turned * (1 - close) },
      { type: 'line', pts: corner(edge, hi, lo), t: close, kind: 'hot', o: turned },
      { type: 'label', p: [edge[0], edge[1], (lo + hi) / 2], label: 'stitchClosed', o: span(t, 0.44, 0.5), dx: 14, hot: true },
    ],
    focus: { pts: [[W, W, H], [W, 0, H + ext], [0, W, H + ext], [W, W, H + ext + 2]], k: 0.5 * span(t, 0.4, 0.48) },
  };
}

/* ---------- Step 7: push the lining in, topstitch round the top ---------- */

function stepTopstitch(t) {
  const push = span(t, 0.06, 0.42), stitch = span(t, 0.52, 0.94);
  const outer = outerShell(stitch > 0 ? { at: SPEC.topstitch, t: stitch, kind: 'hotstitch' } : null);
  const lining = fadeAll(liningInside(), span(t, 0.28, 0.42));
  const tube = fadeAll(tubeShell((H - LINE) * (1 - push)), 1 - span(t, 0.32, 0.42));
  return {
    pieces: [...inside(outer), ...inside(lining), ...outside(lining), ...inside(tube), ...outside(tube), ...outside(outer)],
    over: [
      { type: 'arrow', pts: [[W / 2, W / 2, H + 30], [W / 2, W / 2, H + 18]], o: span(t, 0.04, 0.1) * (1 - span(t, 0.36, 0.42)) },
      { type: 'label', p: [W / 2, W / 2, H + 33], label: 'pushLining', o: span(t, 0.04, 0.1) * (1 - span(t, 0.36, 0.42)) },
      { type: 'label', p: [W, W / 2, H - SPEC.topstitch], label: 'topstitch05', o: span(t, 0.54, 0.6), dx: 13, hot: true },
    ],
  };
}

/* ---------- Step 8: trim — glued on; any ribbon, any bows (three versions) ---------- */

/*
  As in the video first: lace glued on from the joint round the basket, then a bow on every corner.
  Then the same basket in two more versions (the maker: any ribbon, any bows, or none) —
  Halloween, everyday — and back to the video's. Each change cross-fades the whole basket.
*/
function stepTrim(t) {
  const glue = span(t, 0.04, 0.3), bows = span(t, 0.3, 0.44);
  const toH = span(t, 0.52, 0.6), toE = span(t, 0.72, 0.8), back = span(t, 0.9, 0.98);
  const X = LOOK.christmas, Hw = LOOK.halloween, E = LOOK.everyday;
  const body = t < 0.66 ? crossfade(basketPieces(X), basketPieces(Hw), toH)
    : t < 0.86 ? crossfade(basketPieces(Hw), basketPieces(E), toE)
    : crossfade(basketPieces(E), basketPieces(X), back);
  const xmas = t < 0.66 ? fadeAll(trim(X, glue, bows), 1 - toH) : t >= 0.86 ? fadeAll(trim(X, 1, 1), back) : [];
  const halloween = t >= 0.5 && t < 0.86 ? fadeAll(trim(Hw, 1, 1), toH * (1 - toE)) : [];
  return {
    pieces: [...body, ...xmas, ...halloween],
    over: [
      { type: 'label', p: [JOINT, W, RZ], label: 'hotGlue', o: span(t, 0.06, 0.1) * (1 - span(t, 0.22, 0.26)), dx: 20, dy: 9 },
      { type: 'label', p: [JOINT, W, RZ], label: 'jointFlat', o: span(t, 0.27, 0.31) * (1 - span(t, 0.36, 0.4)), dx: 20, dy: 9, hot: true },
      { type: 'label', p: [W, W, BZ], label: 'bows4', o: span(t, 0.38, 0.42) * (1 - span(t, 0.47, 0.5)), dx: 15 },
      { type: 'label', p: [W / 2, W / 2, H + 7], label: 'christmas', o: span(t, 0.42, 0.46) * (1 - span(t, 0.52, 0.55)) + span(t, 0.92, 0.98), hot: true },
      { type: 'label', p: [W / 2, W / 2, H + 7], label: 'halloween', o: span(t, 0.56, 0.6) * (1 - span(t, 0.7, 0.73)), hot: true },
      { type: 'label', p: [W / 2, W / 2, H + 7], label: 'everyday', o: span(t, 0.76, 0.8) * (1 - span(t, 0.88, 0.91)), hot: true },
    ],
  };
}

/* ---------- Steps ---------- */

/*
  Steps — how each one is built, without words. Every text lives in basket.<lang>.js,
  index-aligned with this array (basket.text.js checks it). `sew` fabrics: 'cotton' (the
  outer) | 'check' (the lining) — the colour under the mini machine. `uses` — catalog ids.
*/
export const STEPS = [
  {}, // 0: the finished basket
  {
    scene: stepCut, duration: 4,
    uses: ['barcelonetta-broadcloth', 'olfa-rotary-cutter', 'olfa-cutting-mat', 'quilting-rulers-set', 'tailor-scissors', 'sewline-air-erasable-pen'],
  },
  { scene: stepIface, duration: 5.5, uses: ['rowenta-travel-iron'] },
  {
    scene: stepOuter, duration: 7, stitch: 'straight', sew: [[0.62, 0.92, 'cotton']],
    uses: ['beaditive-magnetic-pin-holder', 'janome-1522rd', 'hagbou-thread-set'],
  },
  {
    scene: stepLining, duration: 6, stitch: 'straight', sew: [[0.4, 0.86, 'check']],
    uses: ['beaditive-magnetic-pin-holder', 'janome-1522rd'],
  },
  { scene: stepJoin, duration: 6.5, stitch: 'straight', sew: [[0.7, 0.96, 'check']], uses: ['janome-1522rd'] },
  { scene: stepTurn, duration: 6, stitch: 'straight', sew: [[0.48, 0.8, 'check']], uses: ['janome-1522rd'] },
  { scene: stepTopstitch, duration: 5.5, stitch: 'straight', sew: [[0.52, 0.94, 'cotton']], uses: ['janome-1522rd'] },
  { scene: stepTrim, duration: 11, uses: ['lace-ribbon'] },
];

/**
  The static cutting diagram (cut-diagram.js; an <img> on the project page): the end of this
  step + these lines of `legend` from the texts (outer, interfacing, lining, seams).
*/
export const CUT = { step: 1, legend: [0, 1, 2, 5] };

/** Every chip key the drawing uses — each language must have them all (basket.text.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far apart it is) → { body, viewBox }. L = the texts (basket.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  // the shadow: under the box while it is folded up and sewn (3, 4), under the basket (0, 5–8)
  floorAt: (k) => (k === 0 || k >= 5 ? [W / 2, W / 2, 0] : k >= 3 ? [C + B / 2, C + B / 2, 0] : null),
  shadow: [W * 1.05, W * 0.62],
  fabrics: { cotton: '#a86f6c', check: '#c9c3b8' },
});

/** Fabric patterns (ids prefixed with the figure's ID), in each piece's own cm coordinates. */
export const DEFS = `
<defs>
  <pattern id="${ID}-xmas" width="8" height="8" patternUnits="userSpaceOnUse">
    <rect width="8" height="8" fill="#a86f6c"/>
    <path d="M2 0.9V3.1M0.9 2H3.1M1.2 1.2l1.6 1.6m0-1.6l-1.6 1.6" stroke="#fffdf8" stroke-width=".22" opacity=".85"/>
    <path d="M6 4.9V7.1M4.9 6H7.1M5.2 5.2l1.6 1.6m0-1.6l-1.6 1.6" stroke="#fffdf8" stroke-width=".22" opacity=".85"/>
    <circle cx="6" cy="2" r=".35" fill="#e8c27a"/><circle cx="2" cy="6" r=".35" fill="#fffdf8" opacity=".7"/>
  </pattern>
  <pattern id="${ID}-amber" width="8" height="8" patternUnits="userSpaceOnUse">
    <rect width="8" height="8" fill="#d9a441"/>
    <circle cx="2" cy="2" r=".9" fill="#4a3f35" opacity=".8"/><circle cx="6" cy="6" r=".9" fill="#4a3f35" opacity=".8"/>
    <path d="M2 .9v-.5M6 4.9v-.5" stroke="#7f9469" stroke-width=".3"/>
  </pattern>
  <pattern id="${ID}-sage" width="8" height="8" patternUnits="userSpaceOnUse">
    <rect width="8" height="8" fill="#9caf88"/>
    <circle cx="2" cy="2" r=".55" fill="#fffdf8" opacity=".8"/><circle cx="6" cy="6" r=".55" fill="#fffdf8" opacity=".8"/>
    <path d="M5.4 1.4l1.2 1.2M1.4 5.4l1.2 1.2" stroke="#7f9469" stroke-width=".3"/>
  </pattern>
  <pattern id="${ID}-back" width="8" height="8" patternUnits="userSpaceOnUse">
    <rect width="8" height="8" fill="#f3e3dc"/>
    <rect width="8" height="8" fill="url(#${ID}-xmas)" opacity=".18"/>
  </pattern>
  <pattern id="${ID}-check" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#c9c3b8"/>
    <path d="M0 1H4M1 0V4" stroke="#9a948c" stroke-width=".28"/><path d="M0 3H4M3 0V4" stroke="#fffdf8" stroke-width=".18" opacity=".6"/>
  </pattern>
  <pattern id="${ID}-checkBack" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#e4dfd6"/>
    <path d="M0 1H4M1 0V4" stroke="#9a948c" stroke-width=".2" opacity=".35"/>
  </pattern>
  <pattern id="${ID}-iface" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#fbf8f2"/>
    <path d="M.4 .6l.8.4M1.8 2.1l.7-.5M2.2 .5l.3.6" stroke="#d8cdbd" stroke-width=".12"/>
  </pattern>
  <pattern id="${ID}-lace" width="2.4" height="2.4" patternUnits="userSpaceOnUse">
    <rect width="2.4" height="2.4" fill="#fffdf8"/>
    <circle cx="1.2" cy="1.2" r=".55" fill="none" stroke="#d8cdbd" stroke-width=".16"/><circle cx="0" cy="0" r=".3" fill="#e4d6c2"/>
    <circle cx="2.4" cy="2.4" r=".3" fill="#e4d6c2"/>
  </pattern>
  <pattern id="${ID}-ribbonInk" width="2" height="2" patternUnits="userSpaceOnUse">
    <rect width="2" height="2" fill="#4a3f35"/><path d="M0 1H2" stroke="#5c5045" stroke-width=".25"/>
  </pattern>
  <linearGradient id="${ID}-bowWhite" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fffdf8"/><stop offset="1" stop-color="#ece2d3"/>
  </linearGradient>
  <linearGradient id="${ID}-bowInk" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#5c5045"/><stop offset="1" stop-color="#3b3129"/>
  </linearGradient>
  <radialGradient id="${ID}-bead" cx=".35" cy=".35" r=".7">
    <stop offset="0" stop-color="#d9918d"/><stop offset="1" stop-color="#8f5552"/>
  </radialGradient>
  <radialGradient id="${ID}-beadAmber" cx=".35" cy=".35" r=".7">
    <stop offset="0" stop-color="#f0c97a"/><stop offset="1" stop-color="#c0892b"/>
  </radialGradient>
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

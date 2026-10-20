/*
  Boxed corners (pinched) — the figure of the third section (`boxed`) of the guide "Bag bottoms"
  (/guides/bag-bottom#boxed; Vault «Гайды — Дно сумки (спецификация)», 3 row 3, 5.2). A public technique:
  there is no maker's project with it yet, so there are NO numbers — what every source (spec 5.2) agrees on
  is said in words: the bag is sewn at the sides (and the bottom, if it has a seam there); a bottom corner is
  opened and flattened so that the side seam lies on the bottom seam — a triangle; a line is marked straight
  across it, at right angles to the seam, half the base width from the END OF THE SEAM (not from the tip of
  the fabric) — so the line is as long as the base is wide; it is sewn with a backstitch, the tip is cut off
  leaving a small allowance; every corner the same, the lining too; turned out, the bag has a flat bottom.

  SPEC is empty on purpose (no maker's numbers). DRAWING holds the sizes the drawing is made with — never
  published, never in a text or a chip — and keeps the sources' relations (tests/guides/bag-bottom-boxed.test.js):
  line = base, fromSeamEnd = base / 2. Own drawing, made with this engine: no source's diagram is redrawn.
  Words (titles, captions, instructions, chips, legend) are NOT here: bottom-boxed.<lang>.js, picked
  through bottom-boxed.text.js.

  Step 0 is the finished bottom: the bag turned out and upside down, its base on top with the bottom seam
  along it and a corner seam across each end (tap: it stands up). Step 1 sews the pouch flat on the table;
  from step 2 on the pouch stands upside down on its open top, inside out, its corners opened into
  triangles ("ears") that stick out from the ends of the base. Shared parts (shell, camera, machine,
  renderer) live in kit.js. SVG ids carry the figure's prefix ('bag-bottom-boxed-…'), so it never collides
  with the other figures of the same page.
*/
import { at, turn } from './iso.js';
import { fadeAll, inside, labelKeys, makeRenderer, outside, rect, shell, span } from './kit.js';

const ID = 'bag-bottom-boxed'; // prefix of every SVG id of this figure (fills, floor)

/** The maker's numbers: none — this section has no maker's project (spec 3). */
export const SPEC = {};

/**
  The drawing's own sizes (cm in the drawing, never published): the base width, the line across the corner
  and how far it is from the end of the seam — the sources' relations, in numbers only for the engine.
*/
export const DRAWING = { base: 10, line: 10, fromSeamEnd: 5, allowance: 0.9 };

const D = DRAWING.base;
const HE = DRAWING.fromSeamEnd; // the triangle, from its line (the end of the base) to the end of the seam
const A = DRAWING.allowance; // what is left beyond the line once the tip is cut off
const S = 1; // the seam allowance in the drawing
const PW = 24, PH = 15; // the pouch, seam to seam × open top to bottom seam (drawing)
const W0 = PW + 2 * S, H0 = PH + S; // each of the two pieces
const T = 0.18; // fabric thickness in the drawing
const Z2 = 2 * T; // the top piece
const TIP = 1.4; // the fabric's tip beyond the end of the seam (the two seam allowances)
const LU = 0.2; // the marked / sewn line sits just inside the triangle's base, so the piece's edge does not hide it
const YC = -T; // the standing pouch: between its two layers
const TILT = (30 * Math.PI) / 180; // the triangles leave the base's plane a little — the near one droops, the far one rises — so both face the viewer (drawing)

/* The finished bag, for the drawing only — never published: an open box, its bottom boxed by the corners. */
const BL = PW - D; // the base's length: each corner takes half the base width
const BD = D;
const BH = PH - D / 2;

const PRINT = `url(#${ID}-print)`, BACK = `url(#${ID}-back)`; // a light cotton gingham: right side · wrong side

/** A flat piece on the table (x → right-down, y → left-down), right side up (`up`) or down. */
const table = (id, pts, z, up, extra = {}) =>
  ({ id, pts, O: [0, 0, z], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, up ? 1 : -1], fill: PRINT, inner: BACK, ...extra });

/** Only what can be seen: a piece faded to nothing is dropped, not drawn at opacity ~0. */
const seen = (ps) => ps.filter((p) => (p.opacity ?? 1) > 0.01);

/** Turn pieces upside down about the x axis through (yc, h / 2): an open box standing on its open top. */
const upsideDown = (ps, yc, h) => ps.map((p) => turn(p, [0, yc, h / 2], [1, 0, 0], Math.PI));

/* ---------- Step 1: the front on the back, right sides together; sew the sides and the bottom ---------- */

// The seam round the pouch, on the front piece (seen from its wrong side): up one side, across the bottom, down the other.
const USEAM = [[S, 0], [S, H0 - S], [W0 - S, H0 - S], [W0 - S, 0]];

/** The pouch flat on the table: the back right side up, the front on it wrong side up (`z` its height). */
function pouch({ z = Z2, sewn = false } = {}) {
  return [table('back', rect(W0, H0), 0, true), table('front', rect(W0, H0), z, false, { lines: sewn ? [{ pts: USEAM, kind: 'stitch' }] : [] })];
}

function stepSew(t) {
  const land = span(t, 0.04, 0.3);
  const sew = span(t, 0.44, 0.9);
  const done = t > 0.9;
  const z = Z2 + 0.04;
  return {
    pieces: pouch({ z: Z2 + 10 * (1 - land), sewn: done }),
    over: [
      { type: 'line', pts: USEAM.map(([x, y]) => [x, y, z]), t: sew, kind: 'hot', o: 1 - span(t, 0.9, 0.96) },
      { type: 'label', p: [W0 / 2, H0 / 2, Z2], label: 'rightSides', o: span(t, 0.28, 0.34) * (1 - span(t, 0.42, 0.46)) },
      { type: 'label', p: [W0 / 2, H0 - S, z], label: 'sidesBottom', o: span(t, 0.46, 0.52) * (1 - span(t, 0.88, 0.92)), dy: 7, hot: true },
      { type: 'label', p: [W0 / 2, H0 / 2, Z2], label: 'aPouch', o: span(t, 0.92, 0.98) },
    ],
  };
}

/* ---------- The pouch standing upside down, inside out, its bottom corners opened (steps 2–5) ---------- */

/*
  The pouch opened to depth d (0 → D): a box standing on its open top, its base on top (the bottom seam along
  its middle), and at each end of the base a corner flattened into a triangle — the side seam on the bottom
  seam, along its middle, to the end of the seam at its point (the fabric's tip just beyond). The triangle's
  base is the end of the base: at half the base width from the end of the seam it is exactly as wide as the
  base. `ear`: 'full' | 'trimmed'; `marked`, `sewn` — the line across; `away` — the cut-off tips sliding away.
*/
function box(d, { ear = 'full', marked = false, sewn = false, away = 0 } = {}) {
  const xa = S + d / 2, xb = W0 - S - d / 2, h = PH - d / 2, he = d / 2, k = d / D;
  const walls = upsideDown(shell({ key: 'box', xa, xb, ya: YC - d / 2, yb: YC + d / 2, h, fill: BACK, inner: PRINT }).walls, YC, h)
    .map((p) => (p.id === 'box-bottom' ? { ...p, lines: [BOTTOM_SEAM(xb - xa, d), BOTTOM_SEAM(xb - xa, d)] } : p));
  const q = 0.5 * k, tip = TIP * k;
  const across = (kind) => ({ pts: [[LU, -(he - LU)], [LU, he - LU]], kind });
  const line = sewn ? [across('stitch')] : marked ? [across('mark')] : [];
  const ears = [], tips = [];
  [[xa, -1], [xb, 1]].forEach(([x, sx], i) => {
    const { O, U, V, out } = earFrame(x, sx, h);
    const look = { O, U, V, out, fill: BACK, inner: PRINT };
    if (ear === 'full') {
      const axis = { pts: [[0, 0], [he, 0]], kind: 'seam' };
      ears.push({ id: `ear-${i}`, pts: [[0, -he], [he - q, -q], [he + tip, 0], [he - q, q], [0, he]], lines: [axis, axis, ...line], ...look });
    } else {
      const axis = { pts: [[0, 0], [A, 0]], kind: 'seam' };
      ears.push({ id: `ear-${i}`, pts: [[0, -he], [A, -(he - A)], [A, he - A], [0, he]], lines: [axis, ...line], ...look });
      const slide = U.map((c) => c * away * 4);
      tips.push({
        id: `tip-${i}`, pts: [[A, -(he - A)], [he - q, -q], [he + tip, 0], [he - q, q], [A, he - A]],
        lines: [{ pts: [[A, 0], [he, 0]], kind: 'seam' }], ...look, O: [O[0] + slide[0], O[1], O[2] + slide[2]], opacity: 1 - away,
      });
    }
  });
  // painter: the far corner (beyond the far end), the box, then the near corner and its cut-off tip
  return { pieces: seen([ears[0], tips[0], ...inside(walls), ...outside(walls), ears[1], tips[1]].filter(Boolean)), xa, xb, h, he };
}

/*
  A corner's triangle on the end of the base at x (sx = +1 the near end, −1 the far one): its base on the base's end
  edge, going outward at TILT — the near one drooping over its end wall, the far one rising (seen flat in the plane
  of the base, the near triangle would be edge-on). Local u = out from that edge along the seam, v = across (world y).
*/
function earFrame(x, sx, h) {
  const a = -sx * TILT;
  const U = [sx * Math.cos(a), 0, Math.sin(a)];
  return { O: [x, YC, h + 0.03], U, V: [0, 1, 0], out: [-U[2] * sx, 0, U[0] * sx] };
}
/** A point (u, v) of the near (sx = 1) or far (−1) triangle of the opened pouch, in the world. */
const earAt = (sx, u, v, lift = 0) => {
  const { O, U, V } = earFrame(sx > 0 ? XB : XA, sx, HB);
  return [0, 1, 2].map((i) => O[i] + U[i] * u + V[i] * v + (i === 2 ? lift : 0));
};

/** The bottom seam, along the middle of the base (drawn twice: one thin seam line is faint on the print). */
const BOTTOM_SEAM = (w, d) => ({ pts: [[0.3, d / 2], [w - 0.3, d / 2]], kind: 'seam' });

// The opened pouch (d = D) and its points: the near corner's triangle (end of the seam, its middle, its tip).
const OPEN = box(D);
const XB = OPEN.xb, XA = OPEN.xa, HB = OPEN.h;
const YA = YC - D / 2, YB = YC + D / 2;
const NEAR = { end: earAt(1, HE, 0), mid: earAt(1, HE * 0.5, 0), tip: earAt(1, HE + TIP, 0) };
const FAR = { end: earAt(-1, HE, 0), mid: earAt(-1, HE * 0.5, 0) };
const lineAt = (sx, u) => [earAt(sx, u, -(HE - u), 0.05), earAt(sx, u, HE - u, 0.05)];
const LINES = [lineAt(-1, LU), lineAt(1, LU)]; // the line across each triangle (far, near)
const CORNER_FOCUS = [[XB - 6, YA - 4, HB], [XB + HE + 4, YA - 4, HB], [XB - 6, YB + 3, HB], [XB + HE + 4, YB + 3, HB], [XB, YB, HB - 6]];
// step 3 (the mark): the far corner, whose triangle reads clearly at 375 px, and the base beside it
const FAR_FOCUS = [[XA - HE - 3, YA - 2, HB], [XB - 1, YA - 2, HB], [XA - HE - 3, YB + 6, HB], [XB - 1, YB + 6, HB], [XA, YB, HB - 4]];

/* ---------- Step 2: stand the pouch on its open top and open each bottom corner into a triangle ---------- */

const DMIN = 0.5; // the pouch, barely opened, as it takes the place of the flat one

function stepOpen(t) {
  const stand = span(t, 0.04, 0.3);
  const swap = span(t, 0.3, 0.38);
  const d = DMIN + (D - DMIN) * span(t, 0.4, 0.78);
  const flat = fadeAll(pouch({ sewn: true }).map((p) => turn(p, [0, 0, 0], [1, 0, 0], (Math.PI / 2) * stand)), 1 - swap);
  const opened = t >= 0.3 ? fadeAll(box(d).pieces, swap) : [];
  return {
    pieces: seen([...flat, ...opened]),
    over: [
      { type: 'label', p: [W0 / 2, H0 / 2, 0], label: 'standUp', o: span(t, 0.02, 0.08) * (1 - span(t, 0.22, 0.28)) },
      { type: 'label', p: [W0 / 2, YC, PH - d / 2], label: 'openCorner', o: span(t, 0.42, 0.48) * (1 - span(t, 0.74, 0.8)), dy: -8 },
      { type: 'label', p: NEAR.mid, label: 'seamOnSeam', o: span(t, 0.82, 0.88), dx: -10, dy: 12, hot: true },
      { type: 'label', p: FAR.mid, label: 'triangle', o: span(t, 0.86, 0.92), dy: -8 },
    ],
    focus: { pts: [[XA - HE - 2, YA, HB], [XB + HE + 3, YB, HB], [XA, YB, 0], [XB, YA, 0], [XB, YB, 0]], k: 0.55 * span(t, 0.3, 0.42) },
  };
}

/* ---------- Step 3: mark the line across — half the base width from the end of the seam ---------- */

function stepMark(t) {
  const draw = span(t, 0.46, 0.66);
  const done = t > 0.68;
  return {
    pieces: box(D, { marked: done }).pieces,
    over: [
      ...LINES.map((pts) => ({ type: 'line', pts, t: draw, kind: 'mark', o: done ? 0 : 1 })),
      // on the far triangle — at 375 px the near one is a thin sliver, the far one reads clearly
      { type: 'label', p: FAR.end, label: 'seamEnd', o: span(t, 0.06, 0.14), dx: 0, dy: -9, hot: true },
      // along the far triangle's seam, beside it: from the line to the end of the seam
      { type: 'dim', a: earAt(-1, 0, HE + 1.2), b: earAt(-1, HE, HE + 1.2), label: 'halfBase', o: span(t, 0.2, 0.3), hot: true },
      // across the base, towards the near end (clear of the far corner's chips): the base width — the line across is as long
      { type: 'dim', a: [XB - 3.5, YA, HB], b: [XB - 3.5, YB, HB], label: 'baseWidth', o: span(t, 0.7, 0.8) },
    ],
    focus: { pts: FAR_FOCUS, k: 0.6 * span(t, 0.02, 0.1) },
  };
}

/* ---------- Step 4: sew on the line, a backstitch at both ends; both corners ---------- */

function stepSewAcross(t) {
  const sew = span(t, 0.14, 0.8);
  const done = t > 0.8;
  const sewing = span(t, 0.1, 0.16) * (1 - span(t, 0.8, 0.84));
  return {
    pieces: box(D, { marked: !done, sewn: done }).pieces,
    over: [
      ...LINES.map((pts) => ({ type: 'line', pts, t: sew, kind: 'hot', o: 1 - span(t, 0.8, 0.86) })),
      { type: 'label', p: LINES[1][1], label: 'sewLine', o: sewing, dx: 10, dy: 7, hot: true },
      { type: 'label', p: LINES[1][0], label: 'backstitch', o: sewing, dx: 10, dy: -6 },
      { type: 'label', p: [W0 / 2, YC, HB], label: 'bothCorners', o: span(t, 0.88, 0.94), dy: -7 },
    ],
    focus: { pts: CORNER_FOCUS, k: 0.4 * span(t, 0, 0.06) * (1 - span(t, 0.82, 0.9)) },
  };
}

/* ---------- Step 5: cut the tip off, leaving a small allowance beyond the stitching ---------- */

function stepTrim(t) {
  const mark = span(t, 0.08, 0.28);
  const cut = t >= 0.36;
  const away = span(t, 0.38, 0.6);

  return {
    pieces: box(D, cut ? { ear: 'trimmed', sewn: true, away } : { sewn: true }).pieces,
    over: [
      ...[lineAt(-1, A), lineAt(1, A)].map((pts) => ({ type: 'line', pts, t: mark, kind: 'mark', o: cut ? 0 : 1 })),
      { type: 'label', p: NEAR.tip, label: 'trimTip', o: span(t, 0.04, 0.1) * (1 - span(t, 0.4, 0.46)), dx: 2, dy: 9, hot: true },
      { type: 'label', p: earAt(1, A, HE - A - 1), label: 'smallAllowance', o: span(t, 0.64, 0.72), dx: 10, dy: 8, hot: true },
    ],
    focus: { pts: CORNER_FOCUS, k: 0.4 * span(t, 0, 0.06) },
  };
}

/* ---------- Step 0 and step 6: the finished bag, right side out ---------- */

// On the base: the bottom seam along its middle, and the corner seams across its ends, where it meets the end walls.
// On each end wall: the side seam up its middle meets the corner seam along its bottom — a T. The lines are drawn
// more than once (one thin seam line is faint on the print): the bottom seam twice, the corner seams three times.
const BASE_SEAM = { pts: [[0.4, BD / 2], [BL - 0.4, BD / 2]], kind: 'seam', side: 'out' };
const BASE_ENDS = [
  { pts: [[0.45, 0.3], [0.45, BD - 0.3]], kind: 'seam', side: 'out' },
  { pts: [[BL - 0.45, 0.3], [BL - 0.45, BD - 0.3]], kind: 'seam', side: 'out' },
];
const END_SEAM = { pts: [[0.3, 0.45], [BD - 0.3, 0.45]], kind: 'seam', side: 'out' };
const END_SIDE = { pts: [[BD / 2, 0.45], [BD / 2, BH]], kind: 'seam', side: 'out' }; // the side seam once more, over the shell's

/** The turned-out bag (walls `<key>-…`) on [x0, x0 + BL] × [y0, y0 + BD], standing: an open box with boxed corners. */
function finished(key, x0 = 0, y0 = 0) {
  return shell({ key, xa: x0, xb: x0 + BL, ya: y0, yb: y0 + BD, h: BH, fill: PRINT, inner: BACK }).walls.map((p) => {
    if (p.id === `${key}-bottom`) return { ...p, lines: [BASE_SEAM, BASE_SEAM, ...BASE_ENDS, ...BASE_ENDS, ...BASE_ENDS] };
    if (p.id === `${key}-left` || p.id === `${key}-right`) return { ...p, lines: [...(p.lines ?? []), END_SIDE, END_SEAM, END_SEAM, END_SEAM] };
    return p;
  });
}

/* ---------- Step 6: turn it out — a flat bottom ---------- */

/** The trimmed, sewn pouch at the end of step 5 (inside out, upside down). */
const doneWork = () => box(D, { ear: 'trimmed', sewn: true, away: 1 }).pieces;

function stepTurnOut(t) {
  const flip = span(t, 0.12, 0.5);
  const bag = upsideDown(finished('fin', XA, YA), YC, BH);
  const end = span(t, 0.6, 0.68);
  return {
    pieces: seen([...fadeAll(doneWork(), 1 - flip), ...fadeAll([...inside(bag), ...outside(bag)], flip)]),
    over: [
      { type: 'label', p: [W0 / 2, YC, HB], label: 'turnOut', o: span(t, 0.02, 0.08) * (1 - span(t, 0.3, 0.36)), dy: -7 },
      { type: 'label', p: [XA + BL * 0.35, YC, BH], label: 'flatBottom', o: end, dy: -7, hot: true },
      { type: 'label', p: [XB, YB, BH - 0.3], label: 'cornerSeam', o: end, dx: 6, dy: 9 },
    ],
  };
}

/* ---------- Step 0: the finished bottom — upside down, base on top (e = 0, the first frame) or stood up (e = 1) ---------- */

/*
  At rest the bag stands upside down: the base on top with the bottom seam along it and a corner seam across
  each end, the T of side seam and corner seam at the top of the right wall — the view the legend's pins
  explain, so they are on it from the first frame (pinsAt: 0). Tapped, it stands up (a crossfade, like the
  other bottoms' figures: a real swing would leave step 0's camera, which kit.js fits to the two end states only).
*/
export function anatomy(e = 0) {
  const lift = 4 * span(e, 0.05, 0.45);
  const up = seen(fadeAll(upsideDown(finished('up'), BD / 2, BH).map((q) => ({ ...q, O: [q.O[0], q.O[1], q.O[2] + lift] })), 1 - span(e, 0.05, 0.45)));
  const standing = seen(fadeAll(finished('bag'), span(e, 0.4, 0.8)));
  return { pieces: [...inside(standing), ...outside(standing), ...inside(up), ...outside(up)], over: [] };
}

/** Numbered pins for the legend, on the upside-down bag (shown at rest): bottom, bottom seam, corner seam, side seam. */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  return [
    { n: 1, p: at(byId['up-bottom'], BL * 0.32, BD * 0.27) },
    { n: 2, p: at(byId['up-bottom'], BL * 0.68, BD / 2) },
    { n: 3, p: at(byId['up-right'], BD * 0.25, 0.45) },
    { n: 4, p: at(byId['up-right'], BD / 2, BH * 0.6) },
  ];
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption, written instruction, the
  chips drawn in the scenes, the legend) lives in bottom-boxed.<lang>.js, index-aligned with this
  array; bottom-boxed.text.js checks that. `scene` draws the step over t = 0…1, `duration` is its
  animation in seconds, `stitch` — the machine stitch (a key of `stitches` in the texts), `sew` — when
  and on which fabric the seam is sewn. `uses` — catalog products handy in that step (ids from
  src/data/products.js, shown as labelled affiliate links under the caption).
*/
export const STEPS = [
  {}, // 0: the finished bottom (texts: bottom-boxed.<lang>.js)
  {
    scene: stepSew, duration: 6.5, stitch: 'straight', sew: [[0.44, 0.9, 'print']],
    uses: ['soraco-sewing-clips', 'janome-hd2200'],
  },
  { scene: stepOpen, duration: 7 },
  {
    scene: stepMark, duration: 7,
    uses: ['quilting-rulers-set', 'sewline-air-erasable-pen'],
  },
  {
    scene: stepSewAcross, duration: 5.5, stitch: 'straight', sew: [[0.14, 0.8, 'print']],
    uses: ['janome-hd2200'],
  },
  {
    scene: stepTrim, duration: 5.5,
    uses: ['tailor-scissors'],
  },
  { scene: stepTurnOut, duration: 6 },
];

/** Every chip key the drawing uses — each language must have them all (bottom-boxed.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far it is tipped) → { body, viewBox }. L = the texts (bottom-boxed.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  // the shadow: under the finished bag (0) and the pouch standing upside down (3–6)
  floorAt: (k) => (k === 0 ? [BL / 2, BD / 2, 0] : k >= 3 ? [W0 / 2, YC, 0] : null),
  shadow: [BL * 0.62, BD * 1.6],
  fabrics: { print: '#dfe8d6' },
  pinsAt: 0, // the pins are on the rest view (upside down, base on top): already in the first frame
});

/** Fabric patterns, in each piece's own cm coordinates (a light cotton gingham in the site's sage). */
export const DEFS = `
<defs>
  <pattern id="${ID}-print" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#eef2e8"/>
    <rect width="2" height="4" fill="#9caf88" opacity=".42"/>
    <rect width="4" height="2" fill="#9caf88" opacity=".42"/>
    <circle cx="3" cy="3" r=".28" fill="#fffdf8" opacity=".8"/>
  </pattern>
  <pattern id="${ID}-back" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#f5f7f1"/>
    <rect width="4" height="4" fill="url(#${ID}-print)" opacity=".2"/>
  </pattern>
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

/*
  Cut-out corners — the figure of the second section (`cut-out`) of the guide "Bag bottoms"
  (/guides/bag-bottom#cut-out; Vault «Гайды — Дно сумки (спецификация)», 3 row 2). The maker's
  cosmetic bag, its step 10 "Box the corners": one 23 × 31 cm piece folded in half (the fold is the
  bottom), both side seams sewn 0.5 cm; then from each bottom corner a 3.5 × 2.5 cm piece is cut
  out — 3.5 cm along the bottom, 2.5 cm along the side seam — each corner is opened so that the side
  seam lies on the bottom fold, and sewn straight across; turned out, the bag has a flat bottom.

  Numbers: ONLY the cosmetic bag's (cosmetic.js SPEC — tests/guides/bag-bottom-cutout.test.js checks
  they match): 23 × 31, 0.5, 3.5 × 2.5 cm. Literals here, not an import: the guide page must not load
  the cosmetic bag's model. Why the cut is 3.5 × 2.5 is not explained (the maker does not remember);
  the finished bag's sizes below are for the drawing only and never published.
  Words (titles, captions, instructions, chips, legend) are NOT here: bottom-cutout.<lang>.js,
  picked through bottom-cutout.text.js.

  Step 0 is the finished bottom: the bag turned out and upside down, its base on top, a corner seam
  across each end (tap: it stands up). Steps 1–6 each animate one move over t = 0…1, the work flat on
  the table (x → right-down along the 23 cm, y → left-down; the fold — the bottom — on the near edge).
  Only the outer is drawn; the lining's corners are made the same way (the texts say so). Shared parts
  (shell, camera, inset, machine, renderer) live in kit.js. SVG ids carry the figure's prefix
  ('bag-bottom-cut-out-…'), so it never collides with the other figures of the same page.
*/
import { at, turn } from './iso.js';
import { fadeAll, inside, labelKeys, makeRenderer, outside, rect, rot2, shell, span } from './kit.js';

const ID = 'bag-bottom-cut-out'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {
  piece: [23, 31], // one piece, folded in half across the 31 cm: the fold is the bottom (cosmetic.js SPEC.outer)
  seam: 0.5, // the side seams and the corner seams (cosmetic.js SPEC.seam)
  notch: [3.5, 2.5], // cut from each bottom corner: 3.5 cm along the bottom × 2.5 cm along the side seam (cosmetic.js SPEC.notch)
};

const [OW, OL] = SPEC.piece;
const HALF = OL / 2; // the fold, once folded: the piece lies on y 0…HALF, the fold on the near edge y = HALF
const [NX, NY] = SPEC.notch;
const S = SPEC.seam;
const T = 0.18; // fabric thickness in the drawing (cm)
const Z2 = 2 * T; // the top layer of the folded piece
const FIN_H = 2 * NY; // the pinched corner's cut edge, across the fold (drawing)

/* The finished bag, for the drawing only — never published: an open box, its bottom boxed by the corners. */
const BW = OW - 2 * S; // seam to seam
const BD = 2 * NY; // the depth of the bottom
const BL = BW - BD; // the length of the bottom
const BH = HALF - NY; // the height of the walls, the top still raw

const PRINT = `url(#${ID}-print)`, BACK = `url(#${ID}-back)`; // the cosmetic bag's cotton: right side · wrong side

/** A flat piece on the table (x → right-down, y → left-down), right side up (`up`) or down; `pts` in table cm. */
const table = (id, pts, z, up, extra = {}) =>
  ({ id, pts, O: [0, 0, z], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, up ? 1 : -1], fill: PRINT, inner: BACK, ...extra });

/** Only what can be seen: a piece faded to nothing is dropped, not drawn at opacity ~0. */
const seen = (ps) => ps.filter((p) => (p.opacity ?? 1) > 0.01);

/* ---------- The folded piece: two layers, right sides together, the fold on the near edge ---------- */

// The outline once the corners are cut: a 3.5 (along the fold) × 2.5 (along the side) rectangle gone from both bottom corners.
const NOTCHED = [[0, 0], [OW, 0], [OW, HALF - NY], [OW - NX, HALF - NY], [OW - NX, HALF], [NX, HALF], [NX, HALF - NY], [0, HALF - NY]];

// The two bottom corners: x of the side, which way the cut runs in from it, and its rectangle on the table.
const CORNERS = [{ x: 0, sx: 1 }, { x: OW, sx: -1 }].map((c) => {
  const xi = c.x + c.sx * NX; // the inner edge of the cut
  return { ...c, xi, rect: [[c.x, HALF - NY], [xi, HALF - NY], [xi, HALF], [c.x, HALF]] };
});

/** The folded work: the far half under (right side up), the near half folded over it (wrong side up). */
function folded({ cut = false, seams = false } = {}) {
  const pts = cut ? NOTCHED : rect(OW, HALF);
  const to = cut ? HALF - NY : HALF; // the side seams stop at the cut
  const lines = seams ? [{ pts: [[S, 0], [S, to]], kind: 'stitch' }, { pts: [[OW - S, 0], [OW - S, to]], kind: 'stitch' }] : []; // seen from the wrong side
  return [table('lo', pts, 0, true), table('hi', pts, Z2, false, { lines })];
}

/* ---------- Step 1: fold the 23 × 31 cm piece in half, right sides together — the fold is the bottom ---------- */

/** Cross-section (y, z): the far half flat, the near half turning over the fold onto it. */
function foldSection(fold, th = T) {
  const far = { a: [0, 0], b: [HALF, 0] };
  const near = { a: [HALF, 0], b: rot2([OL, 0], [HALF, th / 2], Math.PI * fold) };
  return [far, near];
}

function stepFold(t) {
  const dims = span(t, 0.04, 0.12) * (1 - span(t, 0.3, 0.36));
  const fold = span(t, 0.38, 0.72);
  const near = turn(table('near', rect(OW, HALF), 0, true, { O: [0, HALF, 0] }), [0, HALF, T], [1, 0, 0], Math.PI * fold);
  return {
    pieces: [table('far', rect(OW, HALF), 0, true), near],
    over: [
      { type: 'dim', a: [0, OL + 3, 0], b: [OW, OL + 3, 0], label: 'cm23', o: dims },
      { type: 'dim', a: [OW + 3, 0, 0], b: [OW + 3, OL, 0], label: 'cm31', o: dims },
      { type: 'label', p: [OW / 2, HALF / 2, Z2], label: 'rightSides', o: span(t, 0.6, 0.66) },
      { type: 'label', p: [OW / 2, HALF, Z2], label: 'foldBottom', o: span(t, 0.76, 0.84), dy: 7, hot: true },
    ],
    inset: { segs: foldSection(fold, 2.5), range: [0, OL] },
    // once folded, closer on the folded piece
    focus: { pts: [[0, 0, 0], [OW, 0, 0], [0, HALF + 4, 0], [OW, HALF + 4, 0]], k: 0.7 * span(t, 0.74, 0.84) },
  };
}

/* ---------- Step 2: sew both sides, 0.5 cm, from the top down to the fold ---------- */

function stepSides(t) {
  const sew = span(t, 0.15, 0.85);
  const done = t > 0.86;
  const z = Z2 + 0.04;
  const hot = 1 - span(t, 0.86, 0.92);
  return {
    pieces: folded({ seams: done }),
    over: [
      { type: 'line', pts: [[S, 0, z], [S, HALF, z]], t: sew, kind: 'hot', o: hot },
      { type: 'line', pts: [[OW - S, 0, z], [OW - S, HALF, z]], t: sew, kind: 'hot', o: hot },
      { type: 'label', p: [OW - S, HALF * 0.4, z], label: 'seam05', o: span(t, 0.2, 0.28), dx: -14, hot: true },
    ],
  };
}

/* ---------- Step 3: cut a 3.5 × 2.5 cm piece from each bottom corner, through both layers ---------- */

function stepCut(t) {
  const mark = span(t, 0.04, 0.2);
  const dims = span(t, 0.08, 0.14) * (1 - span(t, 0.46, 0.52));
  const cut = t >= 0.32;
  const away = span(t, 0.34, 0.5);
  const z = Z2 + 0.05;
  // the cut-offs (both layers) slide away from the corner and are gone
  const offs = cut ? CORNERS.flatMap((c, i) => [
    table(`cutoff-${i}-lo`, c.rect, 0, true, { O: [-c.sx * away * 4.8, away * 4.8, 0], opacity: 1 - away }),
    table(`cutoff-${i}`, c.rect, Z2, false, { O: [-c.sx * away * 4, away * 4, Z2], opacity: 1 - away }),
  ]) : [];
  const right = CORNERS[1];
  return {
    pieces: [...folded({ cut, seams: true }), ...seen(offs)],
    over: [
      // the rectangles drawn with the pen: the cut's two inner edges in each corner
      ...CORNERS.map((c) => ({ type: 'line', pts: [[c.xi, HALF, z], [c.xi, HALF - NY, z], [c.x, HALF - NY, z]], t: mark, kind: 'mark', o: cut ? 0 : 1 })),
      { type: 'dim', a: [right.xi, HALF + 2.5, z], b: [OW, HALF + 2.5, z], label: 'cm35', o: dims, hot: true },
      { type: 'dim', a: [OW + 2.5, HALF - NY, z], b: [OW + 2.5, HALF, z], label: 'cm25', o: dims, hot: true },
      { type: 'label', p: [right.xi, HALF - NY, z], label: 'cutBoth', o: span(t, 0.3, 0.36) * (1 - span(t, 0.62, 0.68)), dx: -14, dy: -8 },
    ],
    focus: {
      pts: [[OW - 10, HALF - 7, 0], [OW + 5, HALF - 7, 0], [OW - 10, HALF + 5, 0], [OW + 5, HALF + 5, 0]],
      k: 0.65 * span(t, 0.02, 0.1) * (1 - span(t, 0.56, 0.66)),
    },
  };
}

/* ---------- Steps 4–5: open each cut corner, the side seam onto the bottom fold; sew straight across ---------- */

/*
  A pinched corner, drawn as a small flap rising out of the cut corner: from the cut's inner corner it
  runs out past the piece's corner, tilted up off the work, its cut edge — one straight line, across —
  at the outer end, the side seam lying on the fold along its middle. Both corners' flaps face the
  viewer. No END VIEW here: unlabelled, the flattened triangle read as a bare "+", and the chip on
  the flap ("side seam on the fold") says it.
*/
const RISE = 0.15; // how much the flap rises off the work: nearly flat, the corner opened out on the table (drawing)
function fin(c, i, h, z, sewn) {
  const ci = [c.xi, HALF - NY], co = [c.x, HALF];
  const dx = co[0] - ci[0], dy = co[1] - ci[1], len = Math.hypot(dx, dy);
  const n = Math.hypot(1, RISE);
  const U = [dx / len / n, dy / len / n, RISE / n]; // out from the inner corner, rising
  const V = [-dy / len, dx / len, 0]; // across, flat
  const out = [U[1] * V[2] - U[2] * V[1], U[2] * V[0] - U[0] * V[2], U[0] * V[1] - U[1] * V[0]]; // up, toward the viewer
  const w = (p, v) => [ci[0] + U[0] * p + V[0] * v, ci[1] + U[1] * p + V[1] * v, z + U[2] * p];
  const e = (h / 2) * (len - S) / len; // the stitch, 0.5 cm in from the cut edge, spans the flap there
  const lines = [{ pts: [[0, 0], [len, 0]], kind: 'stitch' }]; // the side seam, lying on the fold
  if (sewn) lines.push({ pts: [[len - S, -e], [len - S, e]], kind: 'stitch' });
  return {
    piece: { id: `fin-${i}`, pts: [[0, 0], [len, -h / 2], [len, h / 2]], O: w(0, 0), U, V, out, fill: BACK, inner: BACK, lines },
    stitch: [w(len - S, -e), w(len - S, e)], // across, 0.5 cm in from the cut edge
    top: w(len, 0), foot: w(len, h / 2), mid: w(len * 0.6, 0),
  };
}

const ZF = Z2 + 0.06; // the fins stand on the top layer
const CORNER_FOCUS = [[OW - 9, HALF - 6, 0], [OW + 4, HALF - 6, 0], [OW - 9, HALF + 4, FIN_H + 1], [OW + 4, HALF + 4, FIN_H + 1]];

function stepPinch(t) {
  const pinch = span(t, 0.12, 0.62);
  const fins = CORNERS.map((c, i) => fin(c, i, FIN_H * Math.max(pinch, 0.001), ZF, false));
  const near = fins[1]; // the right corner, nearest the viewer
  return {
    pieces: [...folded({ cut: true, seams: true }), ...(pinch > 0.001 ? fins.map((f) => f.piece) : [])],
    over: [
      { type: 'label', p: near.mid, label: 'seamOnFold', o: span(t, 0.4, 0.48), dx: 14, dy: -10, hot: true },
    ],
    focus: { pts: CORNER_FOCUS, k: 0.3 * span(t, 0.02, 0.1) },
  };
}

function stepSew(t) {
  const sew = span(t, 0.14, 0.8);
  const done = t > 0.8;
  const fins = CORNERS.map((c, i) => fin(c, i, FIN_H, ZF, done));
  const near = fins[1];
  const sewing = span(t, 0.1, 0.16) * (1 - span(t, 0.8, 0.84));
  return {
    pieces: [...folded({ cut: true, seams: true }), ...fins.map((f) => f.piece)],
    over: [
      ...fins.map((f) => ({ type: 'line', pts: f.stitch, t: sew, kind: 'hot', o: 1 - span(t, 0.8, 0.86) })),
      { type: 'label', p: near.top, label: 'sewAcross', o: sewing, dx: 14, dy: -8, hot: true },
      { type: 'label', p: near.foot, label: 'seam05', o: sewing, dx: 14, dy: 7 },
      { type: 'label', p: [OW / 2, HALF / 2, Z2], label: 'bothCorners', o: span(t, 0.88, 0.94) },
    ],
    focus: { pts: CORNER_FOCUS, k: 0.5 * span(t, 0, 0.06) * (1 - span(t, 0.82, 0.9)) },
  };
}

/* ---------- Step 6: turn it out — a flat bottom ---------- */

// The finished bag, standing where the flat work lay (its middle).
const X0 = OW / 2 - BL / 2, Y0 = HALF / 2 - BD / 2;

/** The flat work at the end of step 5: the corners cut and sewn. */
const sewnWork = () => [...folded({ cut: true, seams: true }), ...CORNERS.map((c, i) => fin(c, i, FIN_H, ZF, true).piece)];

function stepTurnOut(t) {
  const flip = span(t, 0.12, 0.5);
  const bag = finished('bag', X0, Y0);
  const end = span(t, 0.6, 0.68);
  return {
    pieces: seen([...fadeAll(sewnWork(), 1 - flip), ...fadeAll([...inside(bag), ...outside(bag)], flip)]),
    over: [
      { type: 'label', p: [OW / 2, HALF / 2, Z2], label: 'turnOut', o: span(t, 0.02, 0.08) * (1 - span(t, 0.3, 0.36)) },
      { type: 'label', p: [X0 + BL / 2, Y0 + BD, 0], label: 'flatBottom', o: end, dy: 7, hot: true },
      { type: 'label', p: [X0 + BL, Y0 + BD / 2, 0.3], label: 'cornerSeam', o: end, dx: 4, dy: 9 },
    ],
  };
}

/* ---------- Step 0: the finished bottom — upside down, base on top (e = 0, the first frame) or stood up (e = 1) ---------- */

// On the base: the bottom fold along its middle, and the corner seams across its ends, where it meets the end walls.
// On each end wall: the side seam up its middle meets the corner seam along its bottom — a T. The lines are drawn
// more than once (one thin seam or dashed fold line is faint on the print): the fold twice, the corner seams three times.
const BASE_FOLD = { pts: [[0.4, BD / 2], [BL - 0.4, BD / 2]], kind: 'fold' };
const BASE_SEAMS = [
  { pts: [[0.45, 0.3], [0.45, BD - 0.3]], kind: 'seam', side: 'out' },
  { pts: [[BL - 0.45, 0.3], [BL - 0.45, BD - 0.3]], kind: 'seam', side: 'out' },
];
const END_SEAM = { pts: [[0.3, 0.45], [BD - 0.3, 0.45]], kind: 'seam', side: 'out' };
const END_SIDE = { pts: [[BD / 2, 0.45], [BD / 2, BH]], kind: 'seam', side: 'out' }; // the side seam once more, over the shell's

/** The turned-out bag (walls `<key>-…`) on [x0, x0 + BL] × [y0, y0 + BD]: an open box with its boxed corners. */
function finished(key, x0 = 0, y0 = 0) {
  return shell({ key, xa: x0, xb: x0 + BL, ya: y0, yb: y0 + BD, h: BH, fill: PRINT, inner: BACK }).walls.map((p) => {
    if (p.id === `${key}-bottom`) return { ...p, lines: [BASE_FOLD, BASE_FOLD, ...BASE_SEAMS, ...BASE_SEAMS, ...BASE_SEAMS] };
    if (p.id === `${key}-left` || p.id === `${key}-right`) return { ...p, lines: [...(p.lines ?? []), END_SIDE, END_SEAM, END_SEAM, END_SEAM] };
    return p;
  });
}

/*
  At rest the bag stands upside down: the base on top with the fold along it and a corner seam across each
  end, the T of side seam and corner seam at the top of the right wall — the view the legend's pins explain,
  so they are on it from the first frame (pinsAt: 0). Tapped, it stands up (a crossfade, like the folded
  bottom's figure: a real swing would leave step 0's camera, which kit.js fits to the two end states only).
*/
export function anatomy(e = 0) {
  const lift = 4 * span(e, 0.05, 0.45);
  const up = seen(fadeAll(finished('up').map((p) => {
    const q = turn(p, [0, BD / 2, BH / 2], [1, 0, 0], Math.PI);
    return { ...q, O: [q.O[0], q.O[1], q.O[2] + lift] };
  }), 1 - span(e, 0.05, 0.45)));
  const standing = seen(fadeAll(finished('bag'), span(e, 0.4, 0.8)));
  return { pieces: [...inside(standing), ...outside(standing), ...inside(up), ...outside(up)], over: [] };
}

/** Numbered pins for the legend, on the upside-down bag (shown at rest): bottom, bottom fold, corner seam, side seam. */
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
  chips drawn in the scenes, the legend) lives in bottom-cutout.<lang>.js, index-aligned with this
  array; bottom-cutout.text.js checks that. `scene` draws the step over t = 0…1, `duration` is its
  animation in seconds, `stitch` — the machine stitch (a key of `stitches` in the texts), `sew` — when
  and on which fabric the seam is sewn. `uses` — catalog products handy in that step (ids from
  src/data/products.js, shown as labelled affiliate links under the caption).
*/
export const STEPS = [
  {}, // 0: the finished bottom (texts: bottom-cutout.<lang>.js)
  { scene: stepFold, duration: 6, pad: 0.22 },
  {
    scene: stepSides, duration: 5, stitch: 'straight', sew: [[0.15, 0.85, 'print']],
    uses: ['soraco-sewing-clips', 'janome-hd2200'],
  },
  {
    scene: stepCut, duration: 6.5,
    uses: ['quilting-rulers-set', 'sewline-air-erasable-pen', 'tailor-scissors'],
  },
  { scene: stepPinch, duration: 5.5 },
  {
    scene: stepSew, duration: 5.5, stitch: 'straight', sew: [[0.14, 0.8, 'print']],
    uses: ['janome-hd2200'],
  },
  { scene: stepTurnOut, duration: 6 },
];

/** Every chip key the drawing uses — each language must have them all (bottom-cutout.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far it is tipped) → { body, viewBox }. L = the texts (bottom-cutout.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  // the shadow: under the finished bag (0) and the turned-out one (6)
  floorAt: (k) => (k === 0 ? [BL / 2, BD / 2, 0] : k === 6 ? [OW / 2, HALF / 2, 0] : null),
  shadow: [BL * 0.62, BD * 1.6],
  fabrics: { print: '#efd9d2' },
  pinsAt: 0, // the pins are on the rest view (upside down, base on top): already in the first frame
});

/** Fabric patterns, in each piece's own cm coordinates (the cosmetic bag's printed cotton). */
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
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

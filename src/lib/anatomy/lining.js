/*
  Lining a bag — the anatomy figure of the first guide, "Lining a bag: sew, turn through the
  gap, topstitch" (/guides/line-a-bag; Vault «Гайды — спецификация», section 6). A technique,
  not an item: the bag is drawn in the tote's shape (tote.js SPEC), the outer cotton duck and
  the lining satin, as on the tote page.

  Numbers: ONLY the maker's, from her two projects — the tote (an 8 cm opening, a 0.5 cm top
  seam, straps 6 cm from the centre, a 1 cm topstitch) and the basket (a 15 cm opening, a 0.5 cm
  topstitch), which the texts name for comparison. Never a finished size, never a stitch length.
  tests/guides/lining.test.js checks that they are the numbers of tote.js and basket.js.
  Words (titles, captions, instructions, chips, legend) are NOT here: lining.<lang>.js, picked
  through lining.text.js.

  Step 0 is the lined bag (tap to take it apart); steps 1–7 each animate one move over
  t = 0…1. Shared parts (shell, camera, inset, machine, renderer) live in kit.js. SVG ids carry
  the figure's prefix ('line-a-bag-…'), so it never collides with another figure on a page.
*/
import { at, band, lerp, offset, turn } from './iso.js';
import { fadeAll, inside, labelKeys, makeRenderer, outside, rot2, shell, span } from './kit.js';

const ID = 'line-a-bag'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {
  opening: 8, // the tote: left open low in one side seam of the lining (tote.js SPEC.opening)
  seam: 0.5, // the top seam — the tote and the basket alike (the tote's side seams too)
  strapFromCenter: 6, // the tote's straps, pinned 6 cm each side of the centre (tote.js SPEC.strap.fromCenter)
  topstitch: 1, // the tote: 1 cm from the top edge (tote.js SPEC.topstitch)
  basket: { opening: 15, topstitch: 0.5 }, // the basket, named in the texts for comparison (basket.js SPEC)
  // The bag in the drawing: the tote's cut (tote.js SPEC) — drawing only, its size is never published.
  bag: { cut: [86, 45], base: 12, strap: [100, 16], strapWidth: 4 },
};

const D = SPEC.bag.base; // 12: depth (the tote's base)
const W = SPEC.bag.cut[1] - 2 * SPEC.seam - D; // 32: front width (side seams sewn, the base taken off)
const HB = SPEC.bag.cut[0] / 2 - D / 2; // 37: height before the top seam (the tote's tucked bottom)
const H = HB - SPEC.seam; // 36.5: height once the top is sewn and the bag turned (drawing only)
const LINE = 0.35; // gap between the outer and the lining
// The opening, cm up the lining's side seam from the bottom: where the tote has it, just above
// the V where that seam caught the tucked bottom.
const OPEN = [8, 8 + SPEC.opening];
const MID = (OPEN[0] + OPEN[1]) / 2;

const FILL = {
  duck: `url(#${ID}-duck)`, duckBack: `url(#${ID}-duckBack)`,
  satin: `url(#${ID}-satin)`, satinBack: `url(#${ID}-satinBack)`,
};
const DUCK = { fill: FILL.duck, inner: FILL.duckBack }; // the outer, right side out
const SATIN = { fill: FILL.satin, inner: FILL.satinBack }; // the lining, right side out
const SATIN_INSIDE_OUT = { fill: FILL.satinBack, inner: FILL.satin }; // the lining, inside out

/* ---------- Pieces ---------- */

/**
  One strap: a loop on the rim (z = zRim) in the plane y = y0, its legs 6 cm each side of the
  centre (the tote's), the ends level with the edge. fold 1 = turned down over the bag (pinned
  before the outer goes into the lining); squash shortens the loop while it hangs.
*/
function strap({ id, y0, zRim, front, fold = 0, squash = 1, dx = 0 }) {
  const w = SPEC.bag.strapWidth;
  const a = dx + W / 2 - SPEC.strapFromCenter - w / 2; // centreline of the left leg
  const b = dx + W / 2 + SPEC.strapFromCenter + w / 2; // and of the right one
  const len = SPEC.bag.strap[0] - 2 * (SPEC.seam + SPEC.topstitch); // the ends disappear into the top seam
  const r = 3; // the round top of the loop
  const lean = (b - a) / 2 - r; // each leg leans in by this much
  const leg = (len - Math.PI * r) / 2;
  const rise = Math.sqrt(leg * leg - lean * lean);
  const mid = (a + b) / 2;
  const centre = [[a, 0], [a + lean / 2, rise / 2], [a + lean, rise]];
  for (let i = 1; i < 12; i++) {
    const q = Math.PI * (1 - i / 12);
    centre.push([mid + r * Math.cos(q), rise + r * Math.sin(q)]);
  }
  centre.push([b - lean, rise], [b - lean / 2, rise / 2], [b, 0]);
  const edge = w / 2 - 0.4;
  const p = {
    id, pts: band(centre, w).pts, O: [0, y0, zRim], U: [1, 0, 0], V: [0, 0, squash], out: front ? [0, 1, 0] : [0, -1, 0],
    ...DUCK, inner: FILL.duck,
    lines: [{ pts: offset(centre, edge), kind: 'stitch' }, { pts: offset(centre, -edge), kind: 'stitch' }],
  };
  return fold ? turn(p, [0, y0, zRim], [1, 0, 0], (front ? -1 : 1) * Math.PI * fold) : p;
}

/** Both straps on a rim at height zRim (back strap first — it is drawn behind the bag). */
const straps = (o) => [
  strap({ id: 'strap-back', front: false, ...o, y0: o.y0 ?? -0.05 }),
  strap({ id: 'strap-front', front: true, ...o, y0: o.y1 ?? D + 0.05 }),
];

/** The outer, right side out, before the top seam (dx, z0 = where it is while it is moved). */
const outerWalls = ({ dx = 0, z0 = 0 } = {}) =>
  shell({ key: 'outer', xa: dx, xb: dx + W, ya: 0, yb: D, z0, h: HB, ...DUCK, vee: 'bottom' }).walls;

/** The lining inside out, a little bigger than the outer it takes in; the opening in its right side seam. */
const liningInsideOut = ({ top, seams = true } = {}) =>
  shell({
    key: 'lining', xa: -LINE, xb: W + LINE, ya: -LINE, yb: D + LINE, h: HB,
    ...SATIN_INSIDE_OUT, vee: 'bottom', opening: OPEN, top, seams,
  }).walls;

/** The lining turned and pushed into the outer (its wrong side against the outer's). */
const liningIn = (lines = []) =>
  addLines(shell({
    key: 'lining', xa: LINE, xb: W - LINE, ya: LINE, yb: D - LINE, z0: LINE, h: H - LINE,
    ...SATIN_INSIDE_OUT, seams: false,
  }).walls, lines);

/** Extra lines on some walls: [{ wall: 'back', line }, …]. */
function addLines(walls, extra) {
  if (!extra.length) return walls;
  return walls.map((p) => {
    const more = extra.filter((e) => p.id.endsWith(`-${e.wall}`)).map((e) => e.line);
    return more.length ? { ...p, lines: [...(p.lines ?? []), ...more] } : p;
  });
}

/*
  The stitch round the top seen from INSIDE the bag, on the far walls (back, then left) — the
  shell draws its ring on the outside only. `t` runs like the shell's ring: front, right, back, left.
*/
function ringInside(h, at, t, kind, w = W, d = D) {
  const part = (i, len, rev) => {
    const s = Math.max(0, Math.min(1, t * 4 - i));
    if (s <= 0) return null;
    const a = [0.3, h - at], b = [len - 0.3, h - at];
    return { pts: rev ? [b, a] : [a, b], t: s, kind, side: 'in' };
  };
  return [{ wall: 'back', line: part(2, w, true) }, { wall: 'left', line: part(3, d, false) }].filter((e) => e.line);
}

/** The opening on the lining's right side seam, as an overlay line (world points). */
const openingLine = (x, z0, z1, o = 1) => ({ type: 'line', pts: [[x, D / 2, z0], [x, D / 2, z1]], kind: 'open', o });

/** Scale pieces about point c (the bag going in and coming out through the opening). */
const grow = (ps, c, s) => (s >= 0.999 ? ps : ps.map((p) => ({
  ...p,
  O: [c[0] + s * (p.O[0] - c[0]), c[1] + s * (p.O[1] - c[1]), c[2] + s * (p.O[2] - c[2])],
  U: p.U.map((v) => v * s),
  V: p.V.map((v) => v * s),
})));

/* ---------- Step 0: the lined bag, together (e = 0) or apart (e = 1) ---------- */

function anatomy(e = 0) {
  const lift = span(e, 0, 0.7), aside = span(e, 0.35, 1), sp = span(e, 0.2, 0.9);
  const outer = shell({
    key: 'outer', xa: 0, xb: W, ya: 0, yb: D, h: H, vee: 'bottom', ...DUCK, top: { at: SPEC.topstitch, t: 1 },
  }).walls;
  const shift = [lerp(0, -W - 6, aside), 0, lerp(0, H + 4, lift) - lerp(0, 18, aside)];
  // the lining with its seams; the opening, stitched closed at the edge, next to the right side seam
  const d = D - 2 * LINE;
  const lining = addLines(shell({
    key: 'lining', xa: LINE, xb: W - LINE, ya: LINE, yb: D - LINE, z0: LINE, h: H - LINE,
    ...SATIN_INSIDE_OUT, vee: 'bottom',
  }).walls, [{ wall: 'right', line: { pts: [[d / 2 + 0.3, OPEN[0]], [d / 2 + 0.3, OPEN[1]]], kind: 'stitch', side: 'out' } }])
    .map((p) => ({ ...p, O: [p.O[0] + shift[0], p.O[1] + shift[1], p.O[2] + shift[2]] }));
  const [back, front] = straps({ zRim: H, y0: LINE, y1: D - LINE });
  back.O = [back.O[0], back.O[1] - 10 * sp, back.O[2] + 9 * sp];
  front.O = [front.O[0], front.O[1] + 10 * sp, front.O[2] + 9 * sp];
  return {
    pieces: [back, ...inside(outer), ...inside(lining), ...outside(lining), ...outside(outer), front],
    over: [],
  };
}

/** Numbered pins for the legend (shown when apart): outer, lining, opening, top seam, topstitch. */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  return [
    { n: 1, p: at(byId['outer-front'], W * 0.5, H * 0.45) },
    { n: 2, p: at(byId['lining-front'], (W - 2 * LINE) * 0.5, H * 0.45) },
    { n: 3, p: at(byId['lining-right'], D / 2 - LINE, MID) },
    { n: 4, p: at(byId['outer-front'], W / 2, H) },
    { n: 5, p: at(byId['outer-front'], W - 3, H - SPEC.topstitch) },
  ];
}

/* ---------- Step 1: the lining, sewn like the outer, inside out, with an opening ---------- */

const SEAM_X = W + LINE + 0.05; // the lining's right side seam (it faces the viewer), just off the wall
const VEE = (D + 2 * LINE) / 2; // where that seam meets its V at the bottom (shell: half the side's width)

function stepLining(t) {
  const sewTop = span(t, 0.12, 0.42), sewLow = span(t, 0.48, 0.6);
  const hot = 1 - span(t, 0.62, 0.7);
  const gap = span(t, 0.42, 0.48);
  const end = span(t, 0.7, 0.78);
  const y = D / 2;
  return {
    pieces: fadeAll(liningInsideOut({ seams: t > 0.6 }), span(t, 0, 0.08)),
    over: [
      { type: 'label', p: [W / 2, D + LINE, HB * 0.62], label: 'liningInsideOut', o: span(t, 0.03, 0.1) * (1 - span(t, 0.64, 0.7)) },
      { type: 'line', pts: [[SEAM_X, y, HB], [SEAM_X, y, OPEN[1]]], t: sewTop, kind: 'hot', o: hot },
      { type: 'line', pts: [[SEAM_X, y, OPEN[0]], [SEAM_X, y, VEE]], t: sewLow, kind: 'hot', o: hot },
      // the opening, left unsewn: its ends marked across the seam
      openingLine(SEAM_X, OPEN[0], OPEN[1], gap),
      { type: 'line', pts: [[SEAM_X, y - 1.6, OPEN[0]], [SEAM_X, y + 1.6, OPEN[0]]], kind: 'hot', o: gap },
      { type: 'line', pts: [[SEAM_X, y - 1.6, OPEN[1]], [SEAM_X, y + 1.6, OPEN[1]]], kind: 'hot', o: gap },
      // the chip sits just under the opening, centred on the seam (a chip beside it would leave the frame)
      { type: 'label', p: [SEAM_X, y, OPEN[0]], label: 'opening8', o: end, dy: 5, hot: true },
    ],
    focus: {
      pts: [[W + LINE, -LINE, 0], [W + LINE, D + LINE, 0], [W + LINE, y, OPEN[1] + 9], [W - 12, D + LINE, 0]],
      k: 0.5 * span(t, 0.72, 0.86),
    },
  };
}

/* ---------- Step 2: straps on, the outer (right side out) into the lining (inside out) ---------- */

/** The outer inside the lining, rims level, right sides together, the straps between them. */
function nested({ top, inner = [] } = {}) {
  const outer = addLines(outerWalls(), inner);
  const [back, front] = straps({ zRim: HB, fold: 1, squash: 0.7 });
  const lining = liningInsideOut({ top });
  return [...inside(lining), back, ...inside(outer), ...outside(outer), front, ...outside(lining)];
}

function stepJoin(t) {
  const fold = span(t, 0.4, 0.52); // pinned, the straps turn down over the outer
  const lift = span(t, 0.54, 0.62), slide = span(t, 0.62, 0.74), lower = span(t, 0.76, 0.88);
  const dx = lerp(-(W + 16), 0, slide); // the outer starts beside the lining, clear of it
  const z0 = (HB + 3) * lift * (1 - lower); // up over the rim of the lining, then down into it
  const outer = outerWalls({ dx, z0 });
  const [back, front] = straps({ dx, zRim: z0 + HB, fold, squash: lerp(1, 0.7, fold) });
  const lining = liningInsideOut();
  const ghost = 1 - 0.55 * span(t, 0.88, 0.93); // see the straps between the layers
  const names = span(t, 0.02, 0.08) * (1 - span(t, 0.17, 0.21));
  const o6 = span(t, 0.25, 0.3) * (1 - span(t, 0.36, 0.4));
  const end = span(t, 0.9, 0.95);
  const cx = dx + W / 2;
  return {
    pieces: [...inside(lining), back, ...inside(outer), ...outside(outer), front, ...fadeAll(outside(lining), ghost)],
    over: [
      openingLine(SEAM_X, OPEN[0], OPEN[1]),
      { type: 'label', p: [cx, D, HB * 0.5], label: 'outerRightOut', o: names },
      { type: 'label', p: [W / 2, D + LINE, HB * 0.3], label: 'liningInsideOut', o: names },
      { type: 'dim', a: [cx, D, HB + 2], b: [cx + SPEC.strapFromCenter, D, HB + 2], label: 'cm6', o: o6, hot: true },
      { type: 'label', p: [W / 2, D + LINE, HB - 14], label: 'strapsBetween', o: end, hot: true },
      { type: 'label', p: [W / 2, D + LINE, HB * 0.3], label: 'rightSides', o: end },
    ],
    // first close on the 6 cm, at the end close on the outer in the lining
    focus: t < 0.6
      ? { pts: [[cx - 13, D, HB - 6], [cx + 13, D, HB - 6], [cx, D, HB + 14]], k: 0.5 * span(t, 0.21, 0.27) * (1 - span(t, 0.38, 0.45)) }
      : { pts: [[-LINE, D + LINE, 0], [W + LINE, D + LINE, 0], [W + LINE, -LINE, HB], [-LINE, -LINE, HB]], k: 0.5 * span(t, 0.86, 0.94) },
  };
}

/* ---------- Step 3: sew round the top, 0.5 cm ---------- */

function stepTop(t) {
  const sew = span(t, 0.12, 0.88);
  return {
    pieces: nested({
      top: { at: SPEC.seam, t: sew, kind: 'hot' },
      inner: ringInside(HB, SPEC.seam, sew, 'hot'), // the same seam, seen inside on the outer's far walls
    }),
    over: [
      openingLine(SEAM_X, OPEN[0], OPEN[1]),
      { type: 'label', p: [W * 0.6, D + LINE, HB - SPEC.seam], label: 'seam05', o: span(t, 0.16, 0.24), dy: 10, hot: true },
    ],
    focus: {
      pts: [[0, D + LINE, HB - 12], [W + LINE, D + LINE, HB - 12], [W + LINE, -LINE, HB + 2], [0, -LINE, HB + 2]],
      k: 0.45 * span(t, 0.03, 0.12) * (1 - span(t, 0.9, 1)),
    },
  };
}

/* ---------- Step 4: turn the whole bag through the opening ---------- */

/** The bag turned through the opening: the outer right side out, the lining out on top of it,
    right side out too and bottom up, its opening (cm below its bottom, now on top) still open. */
function turned({ ext = H - LINE, opening = true } = {}) {
  const outer = shell({ key: 'outer', xa: 0, xb: W, ya: 0, yb: D, h: H, ...DUCK, vee: 'bottom' }).walls;
  const tube = shell({
    key: 'tube', xa: LINE, xb: W - LINE, ya: LINE, yb: D - LINE, z0: H, h: Math.max(ext, 0.01),
    ...SATIN, lid: true, vee: 'top', opening: opening ? [ext - OPEN[1], ext - OPEN[0]] : null,
  }).walls;
  const [back, front] = straps({ zRim: H, y0: LINE, y1: D - LINE });
  return { back, outer, tube, front };
}
const turnedPieces = (s) => [s.back, ...inside(s.outer), ...inside(s.tube), ...outside(s.tube), ...outside(s.outer), s.front];

const TOP = H + (H - LINE); // the lining's bottom, on top once the bag is turned
const TUBE_X = W - LINE + 0.05; // the lining's side seam with the opening, now on the tube

/*
  Turning is an impossible morph, so it is told in three beats: an arrow into the opening; the
  outer's fabric coming out through it, right side out (a bundle of duck growing out of the
  gap); then the whole bag, turned, grows out of the opening while the sewn state fades.
*/
function stepTurn(t) {
  const pull = span(t, 0.16, 0.42); // the outer's fabric comes out through the opening
  const through = span(t, 0.42, 0.6); // the rest follows: the turned bag
  const G = [W + LINE, D / 2, MID];
  const len = 13 * pull;
  const bundle = len > 0.05
    ? shell({
      key: 'pull', xa: W + LINE, xb: W + LINE + len, ya: D / 2 - 3, yb: D / 2 + 3, z0: MID - 3.6, h: 7.2,
      ...DUCK, seams: false, lid: true,
    }).walls
    : [];
  const sewn = nested({ top: { at: SPEC.seam, t: 1, kind: 'seam' } });
  const before = fadeAll([...sewn, ...inside(bundle), ...outside(bundle)], 1 - through);
  const after = grow(fadeAll(turnedPieces(turned()), through), G, lerp(0.55, 1, through));
  const arc = [[W - 9, D / 2, MID + 6], [W + LINE, D / 2, MID], [W + 8, D / 2 + 3, MID - 1], [W + 14, D / 2 + 5, MID + 5]];
  return {
    pieces: [...before, ...after],
    over: [
      openingLine(SEAM_X, OPEN[0], OPEN[1], 1 - span(t, 0.16, 0.22)),
      { type: 'arrow', pts: arc, t: span(t, 0.04, 0.16), o: 1 - span(t, 0.18, 0.24) },
      { type: 'label', p: arc[3], label: 'turnThrough', o: span(t, 0.06, 0.12) * (1 - through), dy: -14 },
      openingLine(TUBE_X, TOP - OPEN[1], TOP - OPEN[0], span(t, 0.6, 0.66)),
      { type: 'label', p: [W / 2, D, H * 0.5], label: 'rightSideOut', o: span(t, 0.64, 0.72), hot: true },
    ],
    focus: {
      pts: [[W + LINE, -LINE, 0], [W + LINE, D + LINE, 0], [W + LINE, D / 2, OPEN[1] + 8], arc[3], [W + LINE + 13, D / 2, MID]],
      k: 0.45 * span(t, 0.02, 0.1) * (1 - span(t, 0.4, 0.5)),
    },
  };
}

/* ---------- Step 5: close the opening — edges tucked in, stitched at the very edge ---------- */

/*
  END VIEW across the opening: the lining's two sides meet at the seam line; their raw edges
  stick out of the gap (down here = outside), then fold in through it, one and then the other,
  so the two folds meet side by side (up = inside). (s, n): s across the seam, n inward.
*/
function gapSection(t) {
  // the raw edge (drawn bigger than life), half the space between the folds, and the height of
  // the lining in the inset (the inset's baseline sits low: room for the edges both ways)
  const a = 1.5, g = 0.22, z = 1.5;
  const edge = (hinge, sign, f) => ({ a: hinge, b: rot2([hinge[0], hinge[1] - a], hinge, sign * Math.PI * f) });
  return [
    { a: [-4, z], b: [-g, z] }, edge([-g, z], 1, span(t, 0.12, 0.26)),
    { a: [g, z], b: [4, z] }, edge([g, z], -1, span(t, 0.28, 0.42)),
  ];
}

function stepClose(t) {
  const sew = span(t, 0.5, 0.86);
  const s = turned({ opening: t < 0.86 });
  const g0 = TOP - OPEN[1], g1 = TOP - OPEN[0];
  const y = D / 2;
  return {
    pieces: turnedPieces(s),
    over: [
      openingLine(TUBE_X, g0, g1, 1 - span(t, 0.46, 0.52)),
      // the chips sit just under the opening, centred on the seam
      { type: 'label', p: [TUBE_X, y, g0], label: 'tuckEdges', o: span(t, 0.08, 0.16) * (1 - span(t, 0.42, 0.48)), dy: 5, hot: true },
      { type: 'line', pts: [[TUBE_X, y + 0.2, g1], [TUBE_X, y + 0.2, g0]], t: sew, kind: 'hotstitch' },
      { type: 'label', p: [TUBE_X, y, g0], label: 'stitchEdge', o: span(t, 0.5, 0.58), dy: 5, hot: true },
    ],
    inset: { segs: gapSection(t), range: [-4, 4] },
    focus: {
      pts: [[TUBE_X, LINE, g0 - 7], [TUBE_X, D - LINE, g0 - 7], [TUBE_X, y, g1 + 7], [W - 10, D - LINE, g0 - 7]],
      k: 0.55 * span(t, 0, 0.08) * (1 - span(t, 0.92, 1)),
    },
  };
}

/* ---------- Step 6: push the lining in, press the top edge ---------- */

function stepPush(t) {
  const push = span(t, 0.08, 0.42);
  const press = span(t, 0.56, 0.92);
  const ext = (H - LINE) * (1 - push);
  const s = turned({ ext, opening: false });
  const tube = fadeAll(s.tube, 1 - span(t, 0.34, 0.44));
  const lin = fadeAll(liningIn(), span(t, 0.3, 0.44));
  const down = span(t, 0.04, 0.1) * (1 - span(t, 0.36, 0.42));
  return {
    pieces: [s.back, ...inside(s.outer), ...inside(lin), ...inside(tube), ...outside(tube), ...outside(lin), ...outside(s.outer), s.front],
    over: [
      { type: 'arrow', pts: [[W / 2, D / 2, H + ext + 22], [W / 2, D / 2, H + ext + 3]], o: down },
      { type: 'label', p: [W / 2, D / 2, H + ext + 26], label: 'pushLining', o: down },
      // pressing: the top edge lights up all the way round
      { type: 'line', pts: [[0, D, H], [W, D, H], [W, 0, H], [0, 0, H], [0, D, H]], t: press, kind: 'hot' },
      { type: 'label', p: [W * 0.6, D, H], label: 'pressEdge', o: span(t, 0.58, 0.66), dy: 10, hot: true },
    ],
    focus: {
      pts: [[0, D, H - 12], [W, D, H - 12], [W, 0, H + 2], [0, 0, H + 2]],
      k: 0.45 * span(t, 0.48, 0.56),
    },
  };
}

/* ---------- Step 7: topstitch round the top, 1 cm ---------- */

function stepTopstitch(t) {
  const st = span(t, 0.1, 0.9);
  const outer = shell({
    key: 'outer', xa: 0, xb: W, ya: 0, yb: D, h: H, ...DUCK, vee: 'bottom', top: { at: SPEC.topstitch, t: st, kind: 'hotstitch' },
  }).walls;
  // through the outer and the lining: inside, it shows on the lining's far walls
  const lin = liningIn(ringInside(H - LINE, SPEC.topstitch, st, 'hotstitch', W - 2 * LINE, D - 2 * LINE));
  const [back, front] = straps({ zRim: H, y0: LINE, y1: D - LINE });
  return {
    pieces: [back, ...inside(outer), ...inside(lin), ...outside(lin), ...outside(outer), front],
    over: [
      { type: 'label', p: [W * 0.6, D, H - SPEC.topstitch], label: 'topstitch1', o: span(t, 0.12, 0.2), dy: 10, hot: true },
    ],
    focus: {
      pts: [[0, D, H - 12], [W, D, H - 12], [W, 0, H + 2], [0, 0, H + 2]],
      k: 0.45 * span(t, 0.03, 0.12) * (1 - span(t, 0.92, 1)),
    },
  };
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption, written
  instruction, the chips drawn in the scenes, the legend) lives in lining.<lang>.js,
  index-aligned with this array; lining.text.js checks that. `scene` draws the step over
  t = 0…1, `duration` is its animation in seconds, `stitch` — the machine stitch (a key of
  `stitches` in the texts), `sew` — when and on which fabric the seam is sewn. `uses` — catalog
  products handy in that step (ids from src/data/products.js, shown as labelled affiliate
  links under the caption).
*/
export const STEPS = [
  {}, // 0: the lined bag (texts: lining.<lang>.js)
  {
    scene: stepLining, duration: 6, stitch: 'straight', sew: [[0.12, 0.6, 'satin']],
    uses: ['soraco-sewing-clips', 'janome-hd2200', 'hagbou-thread-set'],
  },
  {
    scene: stepJoin, duration: 9,
    uses: ['soraco-sewing-clips'],
  },
  {
    scene: stepTop, duration: 5, stitch: 'straight', sew: [[0.12, 0.88, 'satin']],
    uses: ['janome-hd2200'],
  },
  {
    scene: stepTurn, duration: 6,
  },
  {
    scene: stepClose, duration: 7, stitch: 'straight', sew: [[0.5, 0.86, 'satin']], pad: 0.22,
    uses: ['janome-hd2200', 'beaditive-thread-snips'],
  },
  {
    scene: stepPush, duration: 6,
    uses: ['rowenta-travel-iron'],
  },
  {
    scene: stepTopstitch, duration: 5, stitch: 'straight', sew: [[0.1, 0.9, 'duck']],
    uses: ['janome-hd2200'],
  },
];

/** Every chip key the drawing uses — each language must have them all (lining.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far apart it is) → { body, viewBox }. L = the texts (lining.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  floorAt: () => [W / 2, D / 2, 0], // the bag always stands
  shadow: [W * 0.62, D * 0.9],
  fabrics: { duck: '#c08a87', satin: '#e6d0ae' },
});

/** Fabric patterns, in each piece's own cm coordinates (the tote's fabrics). */
export const DEFS = `
<defs>
  <pattern id="${ID}-duck" width="10" height="10" patternUnits="userSpaceOnUse">
    <rect width="5" height="5" fill="#c08a87"/>
    <circle cx="1.25" cy="1.25" r="0.45" fill="#fffdf8" opacity=".75"/><circle cx="3.75" cy="3.75" r="0.45" fill="#fffdf8" opacity=".75"/>
    <rect x="5" width="5" height="5" fill="#fffdf8"/>
    <path d="M6.2 1.2l.9.9m0-.9l-.9.9M8.4 3.4l.9.9m0-.9l-.9.9" stroke="#a86f6c" stroke-width=".22"/>
    <rect y="5" width="5" height="5" fill="#9caf88"/>
    <path d="M0 6.25H5M0 7.5H5M0 8.75H5" stroke="#fffdf8" stroke-width=".35" opacity=".45"/>
    <rect x="5" y="5" width="5" height="5" fill="#e8c27a"/>
    <circle cx="7.5" cy="7.5" r="1.3" fill="none" stroke="#fffdf8" stroke-width=".35" opacity=".8"/>
  </pattern>
  <pattern id="${ID}-duckBack" width="10" height="10" patternUnits="userSpaceOnUse">
    <rect width="10" height="10" fill="#f3e9da"/>
    <rect width="10" height="10" fill="url(#${ID}-duck)" opacity=".28"/>
  </pattern>
  <linearGradient id="${ID}-satin" x1="0" y1="0" x2="1" y2="0.35">
    <stop offset="0" stop-color="#e2cba8"/><stop offset=".38" stop-color="#f6e9d4"/>
    <stop offset=".55" stop-color="#e6d0ae"/><stop offset=".8" stop-color="#f2e2c7"/><stop offset="1" stop-color="#dcc29c"/>
  </linearGradient>
  <linearGradient id="${ID}-satinBack" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ddc8a8"/><stop offset="1" stop-color="#e6d5ba"/>
  </linearGradient>
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

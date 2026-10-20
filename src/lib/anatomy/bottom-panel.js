/*
  A separate bottom panel — the figure of the fourth section (`panel`) of the guide "Bag bottoms"
  (/guides/bag-bottom#panel; Vault «Гайды — Дно сумки (спецификация)», 3 row 4, 5.2). A public technique:
  there is no maker's project with it yet, and the sources give no numbers for it, so there are NO numbers.
  What every source (spec 5.2) agrees on is said in words: mark the middles (quarters) of the base and of the
  tube of the walls by folding and creasing; match the marks first, then clip in between; sew wrong side out;
  clip the walls' seam allowance at the corners up to the stitching, not through it; sew one side at a time,
  stopping one seam allowance from each corner, with a backstitch, and turn the corner; turned out, the bag has
  a flat base. Stiffening (interfacing, an insert) goes on the base. A rectangular base is drawn.

  SPEC is empty on purpose (no maker's numbers). DRAWING holds the sizes the drawing is made with — never
  published, never in a text or a chip — and keeps the method's geometry (tests/guides/bag-bottom-panel.test.js):
  each of the tube's two pieces spans half the base's seam line round (tube = long + short), so its side seams
  land on the middles of the base's short sides and its creases on the middles of the long sides. Own drawing,
  made with this engine: no source's diagram is redrawn. Words (titles, captions, instructions, chips, legend) are
  NOT here: bottom-panel.<lang>.js, picked through bottom-panel.text.js.

  Step 0 is the finished bottom: the bag turned out and upside down, the separate base on top in a fabric of its
  own (deep sage), seamed all round (tap: it stands up). Steps 1–2 work flat on the table (the tube, the marks);
  from step 3 on the tube stands wrong side out on the base, right side up, the walls' seam allowance folded out
  flat onto the base's edge. Shared parts (shell, camera, machine, renderer) live in kit.js. SVG ids carry the
  figure's prefix ('bag-bottom-panel-…'), so it never collides with the other figures of the same page.
*/
import { at, cross, norm, sub, turn } from './iso.js';
import { fadeAll, inside, labelKeys, makeRenderer, outside, rect, shell, span } from './kit.js';

const ID = 'bag-bottom-panel'; // prefix of every SVG id of this figure (fills, floor)

/** The maker's numbers: none — this section has no maker's project (spec 3). */
export const SPEC = {};

/**
  The drawing's own sizes (cm in the drawing, never published): the base's seam line (long × short sides), the
  seam allowance, the walls' height and the tube's width between its side seams (half the way round the base).
*/
export const DRAWING = { long: 16, short: 8, allowance: 2, height: 11, tube: 24 };

const { long: LG, short: SH, allowance: S, height: H } = DRAWING;
const BW = LG + 2 * S, BD = SH + 2 * S; // the base as cut: its seam line + the allowance all round
const W0 = DRAWING.tube + 2 * S, H0 = H + S; // each of the tube's two pieces (between the side seams + their allowances; the wall + its allowance)
const T = 0.18; // fabric thickness in the drawing
const Z2 = 2 * T; // the top layer of the flat tube
const X0 = LG / 2 - W0 / 2, Y1 = -S - 3, Y0 = Y1 - H0; // the flat tube on the table (steps 1–2), behind the base; its lower edge (y = Y1) gets the base
const LIFT = 12; // the tube above the base before it comes down (step 3)
const ZF = 0.05; // the folded-out allowance lies just above the base

/** The corners of the base's seam line (where the walls turn) — the clips head for them (step 4). */
export const CORNERS = [[0, 0], [LG, 0], [LG, SH], [0, SH]];

const PRINT = `url(#${ID}-print)`, BACK = `url(#${ID}-back)`; // the walls: a cream ticking stripe · its wrong side
const BASE = `url(#${ID}-base)`, BASEBACK = `url(#${ID}-baseBack)`; // the base: deep sage canvas · its wrong side

/** Only what can be seen: a piece faded to nothing is dropped, not drawn at opacity ~0. */
const seen = (ps) => ps.filter((p) => (p.opacity ?? 1) > 0.01);

/** Turn pieces upside down about the x axis through (yc, h / 2): a bag standing on its open top. */
const upsideDown = (ps, yc, h) => ps.map((p) => turn(p, [0, yc, h / 2], [1, 0, 0], Math.PI));

/** Part [u0,u1]×[v0,v1] of a flat piece, in the same frame (its lines are given, already in that part). */
const part = (p, id, [u0, u1], [v0, v1], lines = []) => ({ ...p, id, pts: [[u0, v0], [u1, v0], [u1, v1], [u0, v1]], lines });

/* ---------- The base ---------- */

const MARK = S; // the marks: short lines across the edge, into the seam allowance (a little outside it too, to read)
const OUTM = 0.5;
const BASE_FOLDS = [{ pts: [[BW / 2, 0.2], [BW / 2, BD - 0.2]], kind: 'fold' }, { pts: [[0.2, BD / 2], [BW - 0.2, BD / 2]], kind: 'fold' }];
const BASE_MARKS = [
  { pts: [[BW / 2, -OUTM], [BW / 2, MARK]], kind: 'mark' }, { pts: [[BW / 2, BD + OUTM], [BW / 2, BD - MARK]], kind: 'mark' },
  { pts: [[-OUTM, BD / 2], [MARK, BD / 2]], kind: 'mark' }, { pts: [[BW + OUTM, BD / 2], [BW - MARK, BD / 2]], kind: 'mark' },
];

/** The base on the table, right side up (`folds`: 0 none · 1 the crease across · 2 both creases; `marks`). */
const base = ({ folds = 2, marks = true, opacity } = {}) => ({
  id: 'base', pts: rect(BW, BD), O: [-S, -S, 0], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], fill: BASE, inner: BASEBACK,
  lines: [...BASE_FOLDS.slice(0, folds), ...(marks ? BASE_MARKS : [])], ...(opacity === undefined ? {} : { opacity }),
});

/* ---------- Step 1: the front on the back, right sides together; sew both sides into a tube ---------- */

const SIDES = [[[S, 0], [S, H0]], [[W0 - S, H0], [W0 - S, 0]]]; // the two side seams on the front piece (its wrong side)
const TUBE_CREASE = { pts: [[W0 / 2, 0.2], [W0 / 2, H0 - 0.2]], kind: 'fold' };

/** The flat tube on the table: the back right side up, the front on it wrong side up (`z` its height). */
function flatTube({ z = Z2, sewn = true, crease = false } = {}) {
  const look = { U: [1, 0, 0], V: [0, 1, 0], fill: PRINT, inner: BACK, pts: rect(W0, H0) };
  const lines = [...(sewn ? SIDES.map((pts) => ({ pts, kind: 'stitch' })) : []), ...(crease ? [TUBE_CREASE] : [])];
  return [
    { id: 'flat-back', O: [X0, Y0, 0], out: [0, 0, 1], ...look, lines: crease ? [TUBE_CREASE] : [] },
    { id: 'flat-front', O: [X0, Y0, z], out: [0, 0, -1], ...look, lines },
  ];
}

function stepSewTube(t) {
  const land = span(t, 0.04, 0.3);
  const z = Z2 + 0.04;
  const on = (pts) => pts.map(([u, v]) => [X0 + u, Y0 + v, z]);
  const done = t > 0.9;
  return {
    pieces: flatTube({ z: Z2 + 10 * (1 - land), sewn: done }),
    over: [
      { type: 'line', pts: on(SIDES[0]), t: span(t, 0.4, 0.62), kind: 'hot', o: 1 - span(t, 0.9, 0.96) },
      { type: 'line', pts: on(SIDES[1]), t: span(t, 0.66, 0.88), kind: 'hot', o: 1 - span(t, 0.9, 0.96) },
      { type: 'label', p: [X0 + W0 / 2, Y0 + H0 / 2, Z2], label: 'rightSides', o: span(t, 0.28, 0.34) * (1 - span(t, 0.38, 0.42)) },
      { type: 'label', p: [X0 + W0 / 2, Y0 + H0 / 2, z], label: 'bothSides', o: span(t, 0.42, 0.48) * (1 - span(t, 0.86, 0.9)), hot: true },
      { type: 'label', p: [X0 + W0 / 2, Y0 + H0 / 2, Z2], label: 'aTube', o: span(t, 0.92, 0.98) },
    ],
  };
}

/* ---------- Step 2: mark the middles — fold the base in half both ways and crease; fold the tube in half ---------- */

/** A fold-and-unfold: 0 → 1 → 0 over [a, d] (folded flat between b and c). */
const foldBack = (t, a, b, c, d) => span(t, a, b) - span(t, c, d);
const FLAT = Math.PI * 0.985; // a half folded over, just short of flat (the layers stay apart)

function baseFolding(t) {
  const fa = foldBack(t, 0.06, 0.15, 0.2, 0.29), fb = foldBack(t, 0.31, 0.4, 0.45, 0.54);
  const o = span(t, 0, 0.05);
  const b = base({ folds: t < 0.2 ? 0 : t < 0.45 ? 1 : 2, marks: t > 0.6, opacity: o });
  if (fa > 0.001) {
    // across: the right half over the left, about the base's middle (x = LG / 2)
    const right = turn(part(b, 'base-r', [BW / 2, BW], [0, BD]), [LG / 2, 0, 0.02], [0, -1, 0], FLAT * fa);
    return [part(b, 'base-l', [0, BW / 2], [0, BD]), right];
  }
  if (fb > 0.001) {
    // lengthwise: the near half over the far one, about y = SH / 2 (the first crease shows on both halves)
    const crease = (v0, v1) => [{ pts: [[BW / 2, v0 + 0.2], [BW / 2, v1 - 0.2]], kind: 'fold' }];
    const near = turn(part(b, 'base-n', [0, BW], [BD / 2, BD], crease(BD / 2, BD)), [0, SH / 2, 0.02], [1, 0, 0], FLAT * fb);
    return [part(b, 'base-f', [0, BW], [0, BD / 2], crease(0, BD / 2)), near];
  }
  return [b];
}

function tubeFolding(t) {
  const f = foldBack(t, 0.63, 0.72, 0.77, 0.86);
  const flat = flatTube({ crease: t > 0.77 });
  if (f <= 0.001) return flat;
  const [back, front] = flat.map((p) => ({ ...p, lines: [] }));
  const axis = (p) => turn(p, [X0 + W0 / 2, 0, Z2 + T], [0, -1, 0], FLAT * f);
  const sideL = [{ pts: SIDES[0], kind: 'stitch' }], sideR = [{ pts: SIDES[1], kind: 'stitch' }];
  const rb = axis(part(back, 'flat-back-r', [W0 / 2, W0], [0, H0])), rf = axis(part(front, 'flat-front-r', [W0 / 2, W0], [0, H0], sideR));
  // folded past upright, the back's half is on top
  return [part(back, 'flat-back-l', [0, W0 / 2], [0, H0]), part(front, 'flat-front-l', [0, W0 / 2], [0, H0], sideL), ...(f > 0.5 ? [rf, rb] : [rb, rf])];
}

function stepMark(t) {
  const draw = span(t, 0.55, 0.6);
  const onBase = (pts) => pts.map(([u, v]) => [u - S, v - S, 0.03]);
  return {
    pieces: seen([...tubeFolding(t), ...baseFolding(t)]),
    over: [
      ...BASE_MARKS.map((m) => ({ type: 'line', pts: onBase(m.pts), t: draw, kind: 'hot', o: t > 0.6 ? 0 : span(t, 0.54, 0.55) })),
      { type: 'label', p: [LG / 2, SH / 2, 0], label: 'foldCrease', o: span(t, 0.07, 0.13) * (1 - span(t, 0.5, 0.55)), hot: true },
      { type: 'label', p: [LG / 2, SH / 2, 0], label: 'markMiddle', o: span(t, 0.6, 0.66) },
      { type: 'label', p: [X0 + W0 / 2, Y0 + H0 / 2, Z2], label: 'foldCrease', o: span(t, 0.64, 0.7) * (1 - span(t, 0.84, 0.88)), dy: -6, hot: true },
      { type: 'label', p: [X0 + S, Y0 + H0 * 0.5, Z2], label: 'seamMark', o: span(t, 0.88, 0.94), dy: 4 },
    ],
  };
}

/* ---------- The tube standing on the base, wrong side out (steps 3–6) ---------- */

/** The four walls of the tube on the base's seam line (no bottom of its own), wrong side out, `lift` above it. */
function tubeWalls(lift) {
  const walls = shell({ key: 'tube', xa: 0, xb: LG, ya: 0, yb: SH, z0: lift, h: H, fill: BACK, inner: PRINT }).walls.filter((p) => p.id !== 'tube-bottom');
  // the creases (the middles of front and back), from step 2
  return walls.map((p) => (p.id === 'tube-front' || p.id === 'tube-back' ? { ...p, lines: [...(p.lines ?? []), { pts: [[LG / 2, 0.2], [LG / 2, H - 0.2]], kind: 'fold' }] } : p));
}

/*
  The walls' seam allowance below each wall, folded out flat onto the base's edge (`fold` = 1) or still hanging
  down (0), `lift` above the base. Local u runs along the base's side, v outward; the strip carries the tube's
  mark (the crease or the side seam) across it, and once sewn the stitching along its inner edge.
*/
const FLANGES = [
  { id: 'flange-front', O: [0, SH], U: [1, 0, 0], n: [0, 1, 0], len: LG, far: false },
  { id: 'flange-right', O: [LG, SH], U: [0, -1, 0], n: [1, 0, 0], len: SH, far: false },
  { id: 'flange-back', O: [LG, 0], U: [-1, 0, 0], n: [0, -1, 0], len: LG, far: true },
  { id: 'flange-left', O: [0, 0], U: [0, 1, 0], n: [-1, 0, 0], len: SH, far: true },
];
const DOWN = [0, 0, -1];

function flanges({ lift = 0, fold = 1, sewn = 0 }) {
  const out = { far: [], near: [] };
  for (const f of FLANGES) {
    const flat = {
      id: f.id, pts: rect(f.len, S), O: [f.O[0], f.O[1], ZF + lift], U: f.U, V: f.n, out: [0, 0, 1], fill: BACK, inner: PRINT,
      lines: [
        { pts: [[f.len / 2, 0.15], [f.len / 2, S - 0.1]], kind: 'mark' }, // the tube's mark: the crease (long sides) or the side seam (short ones)
        ...(sewn > 0 ? [{ pts: [[0.1, 0.18], [f.len - 0.1, 0.18]], t: sewn, kind: 'stitch' }] : []),
      ],
    };
    const k = cross(f.n, DOWN); // rotating about it turns the outward strip down
    const p = fold >= 0.999 ? flat : turn(flat, [f.O[0], f.O[1], lift], k, (Math.PI / 2) * (1 - fold));
    (f.far ? out.far : out.near).push(p);
  }
  return out;
}

/*
  Before the clip a corner of the folded-out allowance cannot lie flat: drawn as a little tent over the corner of
  the base (two triangles, the ridge from the seam corner out to the base's corner). Only the three corners in view
  (the far one is behind the tube). `o` its opacity.
*/
const VISIBLE_CORNERS = [[LG, SH, 1, 1], [LG, 0, 1, -1], [0, SH, -1, 1]];
const RIDGE = 0.25 * S; // how high the pulled corner stands at the base's corner
const ridgeEnd = ([cx, cy, sx, sy]) => [cx + sx * S, cy + sy * S, ZF + RIDGE];

function puckers(o) {
  if (o <= 0.01) return [];
  return VISIBLE_CORNERS.flatMap((c, i) => {
    const [cx, cy, sx, sy] = c;
    const C = [cx, cy, ZF + 0.02], Q = ridgeEnd(c);
    return [[cx, cy + sy * S], [cx + sx * S, cy]].map(([px, py], j) => {
      const P = [px, py, ZF + 0.02];
      const U = sub(Q, C), V = sub(P, C);
      let n = norm(cross(U, V));
      if (n[2] < 0) n = n.map((x) => -x);
      return {
        id: `pucker-${i}-${j}`, pts: [[0, 0], [1, 0], [0, 1]], O: C, U, V, out: n, fill: BACK, inner: PRINT,
        lines: [{ pts: [[0.05, 0], [1, 0]], kind: 'fold' }], ...(o < 0.999 ? { opacity: o } : {}),
      };
    });
  });
}

/** The clip into a corner: from the base's corner along the ridge toward the seam corner, stopping short of it. */
const CLIP_STOP = 0.25; // the part of the way left uncut: the clip never reaches the stitching
const clipLine = (c) => {
  const C = [c[0], c[1], ZF + 0.06], Q = ridgeEnd(c);
  return [Q, Q.map((v, i) => v + (C[i] - v) * (1 - CLIP_STOP))];
};

/*
  The sewing clips that hold the tube to the base: first at the marks (the middle of each side), then in between
  (along the long sides). On the flange strip at local u, lying across its edge. `o` — [at the marks, in between].
*/
const CLIPS = FLANGES.flatMap((f) => [
  { f, u: f.len / 2, first: true },
  ...(f.len === LG ? [{ f, u: f.len / 4, first: false }, { f, u: (3 * f.len) / 4, first: false }] : []),
]);
const CLIP_FILL = '#c08a87';

function clips([oMarks, oBetween], gone = () => 0) {
  const out = { far: [], near: [] };
  CLIPS.forEach((c, i) => {
    const o = (c.first ? oMarks : oBetween) * (1 - gone(c));
    if (o <= 0.01) return;
    const { f, u } = c;
    const O = [f.O[0] + f.U[0] * (u - 0.4) - f.n[0] * 0.3, f.O[1] + f.U[1] * (u - 0.4) - f.n[1] * 0.3, ZF + 0.12];
    const p = { id: `clip-${i}`, pts: rect(0.8, S + 0.6), O, U: f.U, V: f.n, out: [0, 0, 1], fill: CLIP_FILL, inner: CLIP_FILL, ...(o < 0.999 ? { opacity: o } : {}) };
    (f.far ? out.far : out.near).push(p);
  });
  return out;
}

/** The tube on the base, in painter's order: the base, the far strips, the walls, the near strips, the corners, the clips. */
function work({ lift = 0, wallsO = 1, fold = 1, sewn = 0, pucker = 0, clipO = [0, 0], gone, baseO = 1 } = {}) {
  const walls = fadeAll(tubeWalls(lift), wallsO);
  const fl = flanges({ lift, fold, sewn });
  const cl = clips(clipO, gone);
  const f = (ps) => fadeAll(ps, wallsO);
  return seen([
    base({ opacity: baseO < 0.999 ? baseO : undefined }), ...f(fl.far), ...f(cl.far), ...inside(walls), ...outside(walls),
    ...f(fl.near), ...f(puckers(pucker)), ...f(cl.near),
  ]);
}

/** The flaps' fold as the tube comes down: hanging while high, opening out as their edge touches the base. */
const flapFold = (lift) => 1 - Math.asin(Math.min(1, lift / S)) / (Math.PI / 2);

/**
  The tube on its base, for the camera once it is down: the base's corners and the top of the walls, drawn in
  toward their middle (the focus box gets a wide padding in kit.js) so the landed tube fills the view.
*/
const LANDED = [[-S, -S, 0], [LG + S, -S, 0], [-S, SH + S, 0], [LG + S, SH + S, 0], [0, 0, H], [LG, SH, H], [LG, 0, H], [0, SH, H]]
  .map((p) => p.map((v, i) => [LG / 2, SH / 2, H / 2][i] + (v - [LG / 2, SH / 2, H / 2][i]) * 0.72));

/* ---------- Step 3: stand the tube up wrong side out, bring it down on the base; mark on mark, then clip ---------- */

function stepMatch(t) {
  const swap = span(t, 0.04, 0.16);
  const lift = LIFT * (1 - span(t, 0.2, 0.56));
  const flat = fadeAll(flatTube({ crease: true }), 1 - swap);
  const standing = t >= 0.04 ? work({ lift, wallsO: swap, fold: flapFold(lift), pucker: span(t, 0.56, 0.64), clipO: [span(t, 0.72, 0.78), span(t, 0.84, 0.9)] }) : [base()];
  return {
    pieces: seen([...flat, ...standing]),
    over: [
      { type: 'label', p: [LG / 2, SH / 2, LIFT + H], label: 'insideOut', o: span(t, 0.12, 0.18) * (1 - span(t, 0.46, 0.52)), dy: -6 },
      { type: 'label', p: [LG / 2, SH + S / 2, ZF], label: 'markOnMark', o: span(t, 0.64, 0.7) * (1 - span(t, 0.8, 0.84)), dy: 7, hot: true },
      { type: 'label', p: [LG / 2, SH + S / 2, ZF], label: 'clipBetween', o: span(t, 0.86, 0.92), dy: 7 },
    ],
    // once down, closer: the tube on its base fills the view
    focus: { pts: LANDED, k: span(t, 0.5, 0.64) },
  };
}

/* ---------- Step 4: clip the walls' allowance at each corner, up to the stitching, not through it ---------- */

const NEAR_CORNER = [LG, SH, 0];
const CORNER_FOCUS = [[LG - 5, SH - 3, 0], [LG + S + 3, SH - 3, 0], [LG - 5, SH + S + 3, 0], [LG + S + 3, SH + S + 3, 0], [LG - 2, SH, 5]];

function stepClip(t) {
  const cut = span(t, 0.14, 0.4);
  return {
    pieces: work({ pucker: 1 - span(t, 0.46, 0.6), clipO: [1, 1] }),
    over: [
      ...VISIBLE_CORNERS.map((c) => ({ type: 'line', pts: clipLine(c), t: cut, kind: 'hot', o: 1 - span(t, 0.62, 0.7), clip: true })),
      { type: 'label', p: ridgeEnd(VISIBLE_CORNERS[0]), label: 'clipCorner', o: span(t, 0.08, 0.14) * (1 - span(t, 0.42, 0.48)), dx: 4, dy: 7, hot: true },
      { type: 'label', p: NEAR_CORNER, label: 'notThrough', o: span(t, 0.62, 0.7), dx: 2, dy: 9, hot: true },
    ],
    focus: { pts: CORNER_FOCUS, k: 0.7 * span(t, 0.02, 0.1) },
  };
}

/* ---------- Step 5: sew round the base, one side at a time; at each corner stop, turn, go on ---------- */

/*
  The stitching on the seam line, from the middle of the front side: to the near corner, up the right side, along
  the back and the left side (behind the tube), and along the front back to the start. Only the parts in view
  are drawn as overlays (the rest is hidden by the walls).
*/
const ZS = ZF + 0.08;
const PATH = [[LG / 2, SH], [LG, SH], [LG, 0], [0, 0], [0, SH], [LG / 2, SH]];
const SEGS = PATH.slice(1).map((b, i) => ({ a: PATH[i], b, len: Math.hypot(b[0] - PATH[i][0], b[1] - PATH[i][1]) }));
const TOTAL = SEGS.reduce((s, x) => s + x.len, 0);
const START = SEGS.map((_, i) => SEGS.slice(0, i).reduce((s, x) => s + x.len, 0) / TOTAL); // where each side begins (0…1)
const SEW = [0.14, 0.86];
const sewn = (t) => Math.max(0, Math.min(1, (t - SEW[0]) / (SEW[1] - SEW[0]))); // linear: the machine feeds evenly
/** Where along the path (0…1) a clip of strip f at local u sits — the stitching takes it out as it passes. */
const clipAt = ({ f, u }) => {
  const i = { 'flange-front': 0, 'flange-right': 1, 'flange-back': 2, 'flange-left': 3 }[f.id];
  if (i === 0) return u >= LG / 2 ? (u - LG / 2) / TOTAL : START[4] + u / TOTAL; // the front strip runs from x = 0: its right half is sewn first, its left half last
  return START[i] + u / TOTAL;
};

function stepSew(t) {
  const p = sewn(t);
  const segT = (i) => Math.max(0, Math.min(1, (p - START[i]) / (SEGS[i].len / TOTAL)));
  const seg = (i) => [[...SEGS[i].a, ZS], [...SEGS[i].b, ZS]];
  const live = 1 - span(t, SEW[1], SEW[1] + 0.05);
  const C = [LG, SH, ZS], R = [LG, 0, ZS];
  return {
    pieces: work({ sewn: t >= SEW[1] ? 1 : 0, clipO: [1, 1], gone: (c) => span(p, clipAt(c), clipAt(c) + 0.03) }),
    over: [
      { type: 'line', pts: seg(0), t: segT(0), kind: 'hot', o: live },
      { type: 'line', pts: seg(1), t: segT(1), kind: 'hot', o: live },
      { type: 'line', pts: seg(4), t: segT(4), kind: 'hot', o: live },
      { type: 'label', p: [LG / 2, SH, ZS], label: 'backstitch', o: span(t, 0.08, 0.13) * (1 - span(t, 0.2, 0.24)), dx: -3, dy: 8 },
      { type: 'label', p: [LG * 0.75, SH, ZS], label: 'oneSide', o: span(t, 0.18, 0.22) * (1 - span(t, 0.27, 0.3)), dy: 9, hot: true },
      { type: 'label', p: C, label: 'stopTurn', o: span(t, 0.27, 0.3) * (1 - span(t, 0.44, 0.48)), dx: 4, dy: 9, hot: true },
      { type: 'label', p: R, label: 'stopTurn', o: span(t, 0.4, 0.44) * (1 - span(t, 0.52, 0.56)), dx: -12, dy: 4, hot: true },
      { type: 'label', p: [LG / 2, SH, ZS], label: 'allRound', o: span(t, 0.9, 0.96), dy: 9 },
    ],
  };
}

/* ---------- Step 0 and step 6: the finished bag, right side out ---------- */

// On the base: the seam round its edge (drawn twice: one thin seam line is faint on the canvas). On each wall: the
// seam along its lower edge, where it meets the base (the side seams come from the shell: up the middle of each end).
const RIM = 0.35;
const BASE_SEAM = [
  { pts: [[RIM, RIM], [LG - RIM, RIM]], kind: 'seam', side: 'out' }, { pts: [[LG - RIM, RIM], [LG - RIM, SH - RIM]], kind: 'seam', side: 'out' },
  { pts: [[LG - RIM, SH - RIM], [RIM, SH - RIM]], kind: 'seam', side: 'out' }, { pts: [[RIM, SH - RIM], [RIM, RIM]], kind: 'seam', side: 'out' },
];
const WALL_SEAM = (len) => ({ pts: [[0.3, RIM], [len - 0.3, RIM]], kind: 'seam', side: 'out' });

/** The turned-out bag (pieces `<key>-…`), standing on its base: an open box of walls on a base of its own. */
function finished(key) {
  const walls = shell({ key, xa: 0, xb: LG, ya: 0, yb: SH, h: H, fill: PRINT, inner: BACK }).walls
    .filter((p) => p.id !== `${key}-bottom`)
    .map((p) => {
      const len = p.id === `${key}-left` || p.id === `${key}-right` ? SH : LG;
      return { ...p, lines: [...(p.lines ?? []), WALL_SEAM(len), WALL_SEAM(len)] };
    });
  const b = { id: `${key}-base`, pts: rect(LG, SH), O: [0, 0, 0], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, -1], fill: BASE, inner: BASEBACK, lines: [...BASE_SEAM, ...BASE_SEAM] };
  return [b, ...walls];
}

/* ---------- Step 6: turn it out — a flat base ---------- */

function stepTurnOut(t) {
  const flip = span(t, 0.12, 0.5);
  const bag = upsideDown(finished('fin'), SH / 2, H);
  return {
    pieces: seen([...fadeAll(work({ sewn: 1 }), 1 - flip), ...fadeAll([...inside(bag), ...outside(bag)], flip)]),
    over: [
      { type: 'label', p: [LG / 2, SH / 2, H], label: 'turnOut', o: span(t, 0.02, 0.08) * (1 - span(t, 0.3, 0.36)), dy: -8 },
      { type: 'label', p: [LG * 0.4, SH / 2, H], label: 'flatBottom', o: span(t, 0.6, 0.68), dy: -6, hot: true },
      { type: 'label', p: [LG * 0.7, SH, H], label: 'baseSeam', o: span(t, 0.6, 0.68), dy: 6 },
    ],
  };
}

/* ---------- Step 0: the finished bottom — upside down, base on top (e = 0, the first frame) or stood up (e = 1) ---------- */

/*
  At rest the bag stands upside down: the base on top, in its own fabric, the seam round it, and the side seam up
  the middle of the near end meeting it — the view the legend's pins explain, so they are on it from the first
  frame (pinsAt: 0). Tapped, it stands up (a crossfade, like the other bottoms' figures).
*/
export function anatomy(e = 0) {
  const lift = 4 * span(e, 0.05, 0.45);
  const up = seen(fadeAll(upsideDown(finished('up'), SH / 2, H).map((q) => ({ ...q, O: [q.O[0], q.O[1], q.O[2] + lift] })), 1 - span(e, 0.05, 0.45)));
  const standing = seen(fadeAll(finished('bag'), span(e, 0.4, 0.8)));
  return { pieces: [...inside(standing), ...outside(standing), ...inside(up), ...outside(up)], over: [] };
}

/** Numbered pins for the legend, on the upside-down bag (shown at rest): the base, the seam round it, a corner, a side seam. */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  return [
    { n: 1, p: at(byId['up-base'], LG * 0.3, SH * 0.55) },
    { n: 2, p: at(byId['up-base'], LG * 0.62, RIM) },
    { n: 3, p: at(byId['up-base'], LG - RIM, RIM) },
    { n: 4, p: at(byId['up-right'], SH / 2, H * 0.55) },
  ];
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption, written instruction, the
  chips drawn in the scenes, the legend) lives in bottom-panel.<lang>.js, index-aligned with this
  array; bottom-panel.text.js checks that. `scene` draws the step over t = 0…1, `duration` is its
  animation in seconds, `stitch` — the machine stitch (a key of `stitches` in the texts), `sew` — when
  and on which fabric the seam is sewn. `uses` — catalog products handy in that step (ids from
  src/data/products.js, shown as labelled affiliate links under the caption).
*/
export const STEPS = [
  {}, // 0: the finished bottom (texts: bottom-panel.<lang>.js)
  {
    scene: stepSewTube, duration: 6, stitch: 'straight', sew: [[0.4, 0.88, 'print']],
    uses: ['soraco-sewing-clips', 'janome-hd2200'],
  },
  {
    scene: stepMark, duration: 9,
    uses: ['rowenta-travel-iron', 'sewline-air-erasable-pen'],
  },
  {
    scene: stepMatch, duration: 8,
    uses: ['soraco-sewing-clips'],
  },
  {
    scene: stepClip, duration: 6,
    uses: ['tailor-scissors'],
  },
  {
    scene: stepSew, duration: 8, stitch: 'straight', sew: [SEW.concat('print')],
    uses: ['janome-hd2200'],
  },
  { scene: stepTurnOut, duration: 6 },
];

/** Every chip key the drawing uses — each language must have them all (bottom-panel.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far it is tipped) → { body, viewBox }. L = the texts (bottom-panel.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  // the shadow: under the finished bag (0) and the tube on its base (3–6)
  floorAt: (k) => (k === 0 || k >= 3 ? [LG / 2, SH / 2, 0] : null),
  shadow: [LG * 0.7, SH * 0.8],
  fabrics: { print: '#f1e6cf' },
  pinsAt: 0, // the pins are on the rest view (upside down, base on top): already in the first frame
});

/** Fabric patterns, in each piece's own cm coordinates: the walls a cream ticking stripe, the base a deep sage canvas. */
export const DEFS = `
<defs>
  <pattern id="${ID}-print" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#f6efe2"/>
    <rect width="0.9" height="3" fill="#e8c27a" opacity=".75"/>
    <rect x="1.9" width="0.25" height="3" fill="#c08a87" opacity=".55"/>
  </pattern>
  <pattern id="${ID}-back" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#faf6ee"/>
    <rect width="3" height="3" fill="url(#${ID}-print)" opacity=".22"/>
  </pattern>
  <pattern id="${ID}-base" width="1.2" height="1.2" patternUnits="userSpaceOnUse">
    <rect width="1.2" height="1.2" fill="#7f9469"/>
    <rect width="0.6" height="0.6" fill="#71865c" opacity=".7"/>
    <rect x="0.6" y="0.6" width="0.6" height="0.6" fill="#8ea27a" opacity=".7"/>
  </pattern>
  <pattern id="${ID}-baseBack" width="1.2" height="1.2" patternUnits="userSpaceOnUse">
    <rect width="1.2" height="1.2" fill="#c9d3bc"/>
    <rect width="0.6" height="0.6" fill="#bcc8ad" opacity=".7"/>
  </pattern>
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

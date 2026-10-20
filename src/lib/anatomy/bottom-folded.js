/*
  The folded-in bottom — the figure of the first section (`folded`) of the guide "Bag bottoms"
  (/guides/bag-bottom#folded; Vault «Гайды — Дно сумки (спецификация)», 3–4). The maker's own
  trick from the tote ("like a doypack"): two folds stitched 6 cm each side of the centre crease,
  the 12 cm bottom tucked in 6 cm (the centre crease inside, like a paper bag), then the side seams,
  0.5 cm, through four layers at the bottom — turned out, the bottom opens into a flat 12 cm base
  and the corners form by themselves. The tote page shows the same moves as its steps 3–6.

  Numbers: ONLY the tote's (tote.js SPEC — tests/guides/bag-bottom.test.js checks they match):
  6, 12 and 0.5 cm. The piece in the drawing is the tote's outer (86 × 45 cm, folded across the
  middle); its size is never named here, and the finished size is never published.
  Words (titles, captions, instructions, chips, legend) are NOT here: bottom-folded.<lang>.js,
  picked through bottom-folded.text.js.

  Step 0 is the finished bottom: the bag turned out, standing (tap: it turns upside down, the base on
  top). Steps 1–5 each animate one move over t = 0…1. Shared parts (shell, camera,
  inset, machine, renderer) live in kit.js. SVG ids carry the figure's prefix ('bag-bottom-folded-…'),
  so it never collides with another figure on the same page.
*/
import { at, turn } from './iso.js';
import { fadeAll, inside, labelKeys, makeRenderer, outside, rect, rot2, shell, span } from './kit.js';

const ID = 'bag-bottom-folded'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {
  fromCentre: 6, // a fold stitched 6 cm each side of the centre crease (tote.js SPEC.boxBase / 2)
  base: 12, // → the bottom between the two stitched folds: a 12 cm base (tote.js SPEC.boxBase)
  tuck: 6, // the centre crease goes 6 cm inside when the bottom is tucked in
  seam: 0.5, // the side seams (tote.js SPEC.seam)
  layers: 4, // the side seams go through 4 layers at the bottom (a count, not cm)
  piece: [86, 45], // the piece in the drawing: the tote's outer, along × across (tote.js SPEC.outer.cut) — never named
};

const T = 0.25; // fabric thickness in the drawing (cm)
const LEN = SPEC.piece[0], WID = SPEC.piece[1];
const HALF = LEN / 2; // the centre crease, along the piece
const BOT = SPEC.fromCentre;
const Y1 = HALF - BOT, Y2 = HALF + BOT; // the two lines, 6 cm each side of the crease
const LENS = [Y1, BOT, BOT, LEN - Y2]; // the piece in four bands: far end · bottom half · bottom half · near end
const D = SPEC.base; // the base, once turned out
const W = WID - 2 * SPEC.seam - D; // front width of the turned-out bag (drawing only)
const HB = Y1; // height of the turned-out bag, the top still raw (drawing only)
const GAP = 4 * T; // how close the walls come once the piece is folded flat
const MID = WID / 2;

const FILL = { duck: `url(#${ID}-duck)`, duckBack: `url(#${ID}-duckBack)` };
const DUCK = { fill: FILL.duck, inner: FILL.duckBack }; // right side · wrong side

/* ---------- The flat piece in four bands, from a cross-section ---------- */

/** Rotate a segment of a cross-section (y, z) about c by angle a, its right side with it. */
function spin(s, c, a) {
  s.a = rot2(s.a, c, a);
  s.b = rot2(s.b, c, a);
  s.out = rot2(s.out, [0, 0], a);
}

/** The piece laid flat, right side up: four segments [a, b] in (y, z) with their right side `out`. */
const flatSection = () => [[0, Y1], [Y1, HALF], [HALF, Y2], [Y2, LEN]].map(([a, b]) => ({ a: [a, 0], b: [b, 0], out: [0, 1] }));

/** A line across the whole width of a band, v cm along it. */
const across = (v, kind, side) => ({ pts: [[0.4, v], [WID - 0.4, v]], kind, side });

/** The four bands in 3D from their cross-section (painter order: the lower band first when `sort`). */
function bands(segs, lines, { sort = false, ghost = 1 } = {}) {
  const pieces = segs.map((s, i) => ({
    id: `band-${i}`, pts: rect(WID, LENS[i]), O: [0, s.a[0], s.a[1]], U: [1, 0, 0],
    V: [0, (s.b[0] - s.a[0]) / LENS[i], (s.b[1] - s.a[1]) / LENS[i]], out: [0, s.out[0], s.out[1]],
    ...DUCK, lines: lines[i] ?? [], opacity: i === 3 ? ghost : 1, zc: (s.a[1] + s.b[1]) / 2,
  }));
  return sort ? pieces.sort((p, q) => p.zc - q.zc) : pieces;
}

// The lines the piece carries once they are made: the centre crease, the two marked lines, the stitches by the folds.
const CREASE = across(BOT, 'fold'); // on band 1, at its end = the centre
const MARK1 = across(0, 'mark'), MARK2 = across(BOT, 'mark'); // band 1 start = line 1 · band 2 end = line 2
const STITCH1 = across(0.3, 'stitch', 'out'), STITCH2 = across(BOT - 0.3, 'stitch', 'out'); // close to each fold

/* ---------- Step 1: crease the centre, measure 6 cm each side, draw the lines ---------- */

const centrePhases = (t) => ({
  fold: span(t, 0.04, 0.2) * (1 - span(t, 0.32, 0.44)), // folded in half across the middle, pressed, opened
  press: span(t, 0.21, 0.31),
  measure: span(t, 0.5, 0.56),
  draw1: span(t, 0.6, 0.72),
  draw2: span(t, 0.76, 0.88),
});

function centreSection(t, th = T) {
  const p = centrePhases(t);
  const segs = flatSection();
  if (p.fold) { spin(segs[2], [HALF, th / 2], Math.PI * p.fold); spin(segs[3], [HALF, th / 2], Math.PI * p.fold); }
  return segs;
}

function stepCentre(t) {
  const p = centrePhases(t);
  const creased = t > 0.32;
  const lines = [
    [],
    [...(creased ? [CREASE] : []), ...(p.draw1 >= 1 ? [MARK1] : [])],
    [...(p.draw2 >= 1 ? [MARK2] : [])],
    [],
  ];
  const z = 0.04;
  const pressing = span(t, 0.2, 0.22) * (1 - span(t, 0.31, 0.33));
  const six = p.measure;
  return {
    pieces: bands(centreSection(t), lines, { sort: true }),
    over: [
      // the fold being pressed (the folded edge lies at the centre, z = 0)
      { type: 'line', pts: [[0.4, HALF, z], [WID - 0.4, HALF, z]], t: p.press, kind: 'hot', o: pressing },
      { type: 'label', p: [MID, HALF, z], label: 'foldPress', o: span(t, 0.06, 0.12) * (1 - span(t, 0.31, 0.34)), dy: -6, hot: true },
      { type: 'label', p: [MID, HALF, z], label: 'centreCrease', o: span(t, 0.42, 0.48), dy: -4 },
      { type: 'dim', a: [-2, Y1, 0], b: [-2, HALF, 0], label: 'cm6', o: six, hot: true },
      { type: 'dim', a: [WID + 2, HALF, 0], b: [WID + 2, Y2, 0], label: 'cm6', o: six, hot: true },
      // the lines drawn across with the pen, then left on the fabric
      { type: 'line', pts: [[0.4, Y1, z], [WID - 0.4, Y1, z]], t: p.draw1, kind: 'hot', o: span(t, 0.58, 0.6) * (1 - span(t, 0.72, 0.74)) },
      { type: 'line', pts: [[0.4, Y2, z], [WID - 0.4, Y2, z]], t: p.draw2, kind: 'hot', o: span(t, 0.74, 0.76) * (1 - span(t, 0.88, 0.9)) },
    ],
    inset: { segs: centreSection(t, 2.5), range: [0, LEN] },
    focus: {
      pts: [[-2, Y1 - 8, 0], [WID + 2, Y1 - 8, 0], [-2, Y2 + 8, 0], [WID + 2, Y2 + 8, 0]],
      k: 0.45 * span(t, 0.46, 0.56),
    },
  };
}

/* ---------- Step 2: fold on each line and stitch close to the fold ---------- */

const foldPhases = (t) => ({
  f1: span(t, 0.04, 0.16) * (1 - span(t, 0.34, 0.44)),
  s1: span(t, 0.18, 0.32),
  f2: span(t, 0.5, 0.62) * (1 - span(t, 0.8, 0.9)),
  s2: span(t, 0.64, 0.78),
});

/** Cross-section: band 0 folds over line 1, right sides together, then back; then band 3 over line 2. */
function foldSection(t, th = T) {
  const p = foldPhases(t);
  const segs = flatSection();
  if (p.f1) spin(segs[0], [Y1, th / 2], -Math.PI * p.f1);
  if (p.f2) spin(segs[3], [Y2, th / 2], Math.PI * p.f2);
  return segs;
}

function stepFolds(t) {
  const p = foldPhases(t);
  const lines = [[], [CREASE, MARK1, ...(t > 0.32 ? [STITCH1] : [])], [MARK2, ...(t > 0.78 ? [STITCH2] : [])], []];
  const z = T + 0.04;
  const sewing1 = span(t, 0.16, 0.18) * (1 - span(t, 0.32, 0.34));
  const sewing2 = span(t, 0.62, 0.64) * (1 - span(t, 0.78, 0.8));
  return {
    pieces: bands(foldSection(t), lines, { sort: true }),
    over: [
      { type: 'line', pts: [[0.4, Y1 + 0.3, z], [WID - 0.4, Y1 + 0.3, z]], t: p.s1, kind: 'hotstitch', o: sewing1 },
      { type: 'line', pts: [[0.4, Y2 - 0.3, z], [WID - 0.4, Y2 - 0.3, z]], t: p.s2, kind: 'hotstitch', o: sewing2 },
      { type: 'label', p: [MID, Y1, z], label: 'rightSides', o: span(t, 0.08, 0.14) * (1 - span(t, 0.16, 0.18)), dy: -6 },
      { type: 'label', p: [MID, Y1, z], label: 'stitchFold', o: sewing1, dy: -6, hot: true },
      { type: 'label', p: [MID, Y2, z], label: 'stitchFold', o: sewing2, dy: -6, hot: true },
      { type: 'dim', a: [WID + 2, Y1, 0], b: [WID + 2, Y2, 0], label: 'bottom12', o: span(t, 0.9, 0.96), hot: true },
    ],
    inset: { segs: foldSection(t, 2.5), range: [0, LEN] },
    focus: {
      pts: t < 0.47 ? [[0, Y1 - 10, 0], [WID, Y1 - 10, 0], [0, Y1 + 12, 0], [WID, Y1 + 12, 0]]
        : [[0, Y2 - 12, 0], [WID, Y2 - 12, 0], [0, Y2 + 10, 0], [WID, Y2 + 10, 0]],
      k: 0.45 * (sewing1 + sewing2),
    },
  };
}

/* ---------- Step 3: tuck the bottom in — the centre crease goes 6 cm inside ---------- */

/*
  Cross-section (y, z) of the piece folded with its bottom tucked in: both ends lift at the stitched
  folds (a U), the 12 cm bottom folds in on itself so the centre crease goes 6 cm up inside (like a
  paper bag), then the whole thing is laid down flat, right sides together.
*/
function tuckSection(t, gap = GAP) {
  const up = span(t, 0.04, 0.3), fold = span(t, 0.36, 0.72), lay = span(t, 0.78, 0.96);
  const psi = Math.acos(gap / (2 * BOT)) * fold;
  const c1 = [Y1, 0];
  const tip = [Y1 + BOT * Math.cos(psi), BOT * Math.sin(psi)];
  const c2 = [Y1 + 2 * BOT * Math.cos(psi), 0];
  const a0 = Math.PI - (Math.PI / 2) * up, a3 = (Math.PI / 2) * up;
  const end0 = [c1[0] + LENS[0] * Math.cos(a0), LENS[0] * Math.sin(a0)];
  const end3 = [c2[0] + LENS[3] * Math.cos(a3), LENS[3] * Math.sin(a3)];
  return [[end0, c1], [c1, tip], [tip, c2], [c2, end3]].map(([a, b]) => {
    if (lay) { a = rot2(a, c1, (Math.PI / 2) * lay); b = rot2(b, c1, (Math.PI / 2) * lay); }
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return { a, b, out: [-(b[1] - a[1]) / l, (b[0] - a[0]) / l] }; // right side = left of travel
  });
}

/** The piece with its bottom tucked in (far wall, two bottom halves, near wall — the near one ghosted). */
const tuckPieces = (t, ghost = 1) => bands(tuckSection(t), [[], [STITCH1, CREASE], [STITCH2], []], { ghost });

function stepTuck(t) {
  const ghost = 1 - 0.55 * span(t, 0.34, 0.4) * (1 - span(t, 0.76, 0.82));
  const end = span(t, 0.95, 1);
  return {
    pieces: tuckPieces(t, ghost),
    over: [
      { type: 'label', p: [MID, Y1, 0], label: 'liftEnds', o: span(t, 0.04, 0.1) * (1 - span(t, 0.3, 0.34)), dy: 7 },
      { type: 'label', p: [MID, HALF, 3], label: 'foldsIn', o: span(t, 0.4, 0.46) * (1 - span(t, 0.74, 0.78)), dy: -4, hot: true },
      { type: 'dim', a: [WID + 2, Y1, 0], b: [WID + 2, Y1 - SPEC.tuck, 0], label: 'centreInside', o: end, hot: true },
      { type: 'label', p: [MID, Y1 / 2, GAP], label: 'rightSides', o: end },
    ],
    inset: { segs: tuckSection(t, 3), range: [0, LEN] },
  };
}

/* ---------- Step 4: sew the sides, 0.5 cm, through every layer — four at the bottom ---------- */

function stepSides(t) {
  const sew = span(t, 0.15, 0.85);
  const z = GAP + 0.04;
  return {
    pieces: tuckPieces(1, 1 - 0.5 * span(t, 0.86, 0.92)),
    over: [
      { type: 'line', pts: [[SPEC.seam, 0, z], [SPEC.seam, Y1, z]], t: sew, kind: 'hot' },
      { type: 'line', pts: [[WID - SPEC.seam, 0, z], [WID - SPEC.seam, Y1, z]], t: sew, kind: 'hot' },
      { type: 'label', p: [WID, Y1 / 2, z], label: 'seam05', o: span(t, 0.2, 0.28), dx: 10, hot: true },
      { type: 'label', p: [WID, Y1 - BOT / 2, z], label: 'layers4', o: span(t, 0.86, 0.92), dx: 10 },
    ],
    inset: { segs: tuckSection(1, 2), range: [Y1 - 13, Y1 + 3] },
  };
}

/* ---------- Step 5: turn it out — a flat 12 cm base, the corners form by themselves ---------- */

/** The sewn bag standing (stand 1) or lying flat (0), opened to depth d. */
function openBox(d, stand) {
  const walls = shell({
    key: 'bag', xa: SPEC.seam + d / 2, xb: WID - SPEC.seam - d / 2, ya: Y1 - d / 2, yb: Y1 + d / 2,
    h: Y1, ...DUCK, vee: 'bottom', veeHot: d > D * 0.99,
  }).walls;
  const lay = (Math.PI / 2) * (1 - stand);
  const ps = lay ? walls.map((p) => turn(p, [0, Y1, 0], [1, 0, 0], lay)) : walls;
  return [...inside(ps), ...outside(ps)];
}

function stepTurnOut(t) {
  const flip = span(t, 0.08, 0.26), stand = span(t, 0.3, 0.5), d = D * span(t, 0.52, 0.86);
  const xb = WID - SPEC.seam - d / 2;
  const o = span(t, 0.88, 0.94);
  return {
    pieces: [...fadeAll(tuckPieces(1), 1 - flip), ...fadeAll(openBox(d, stand), flip)],
    over: [
      { type: 'label', p: [MID, Y1 / 2, GAP], label: 'turnOut', o: span(t, 0.02, 0.08) * (1 - span(t, 0.26, 0.3)) },
      { type: 'label', p: [MID, Y1, Y1 + 4], label: 'openUp', o: span(t, 0.52, 0.58) * (1 - span(t, 0.84, 0.88)) },
      { type: 'dim', a: [xb, Y1 - d / 2, 0], b: [xb, Y1 + d / 2, 0], label: 'base12', o, hot: true },
      { type: 'label', p: [xb, Y1, d / 2], label: 'cornersForm', o, dx: -14, dy: -14, hot: true },
    ],
    focus: { pts: [[xb - 22, Y1 + d / 2, 0], [xb, Y1 - d / 2, 0], [xb + 3, Y1, 0], [xb, Y1, 30]], k: 0.4 * o },
  };
}

/* ---------- Step 0: the finished bottom — standing (e = 0) or tipped over, base to the viewer (e = 1) ---------- */

/** The turned-out bag: a 12 cm base with the centre crease in its middle, the stitched folds along its long edges. */
function finished() {
  return shell({ key: 'bag', xa: 0, xb: W, ya: 0, yb: D, h: HB, ...DUCK, vee: 'bottom' }).walls.map((p) => {
    if (p.id === 'bag-bottom') return { ...p, lines: [{ pts: [[0.4, D / 2], [W - 0.4, D / 2]], kind: 'fold' }] };
    if (p.id === 'bag-front' || p.id === 'bag-back') return { ...p, lines: [...(p.lines ?? []), { pts: [[0.4, 0.3], [W - 0.4, 0.3]], kind: 'stitch', side: 'out' }] };
    return p;
  });
}

/*
  Turned upside down: the base comes up on top, the back wall (with its stitched fold) to the front. A
  crossfade, not a swing — mid-turn the bag would lie across the frame, outside step 0's camera (which kit.js
  fits to the two end states only): the standing bag fades out, the upside-down one settles in from above.
*/
function anatomy(e = 0) {
  const up = finished().map((p) => turn(p, [0, D / 2, HB / 2], [1, 0, 0], Math.PI));
  const drop = 4 * (1 - span(e, 0.4, 0.85));
  const standing = fadeAll(finished(), 1 - span(e, 0.05, 0.45));
  const upside = e > 0.001 ? fadeAll(up.map((p) => ({ ...p, O: [p.O[0], p.O[1], p.O[2] + drop] })), span(e, 0.4, 0.8)) : [];
  // pins() looks pieces up by id: when both bags are there, the upside-down one (later in the list) wins
  return { pieces: [...inside(standing), ...outside(standing), ...inside(upside), ...outside(upside)], over: [] };
}

/** Numbered pins for the legend (shown upside down): base, stitched fold, centre crease, side seam, corner. */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  return [
    { n: 1, p: at(byId['bag-bottom'], W * 0.72, D * 0.28) },
    { n: 2, p: at(byId['bag-back'], W * 0.5, 0.3) },
    { n: 3, p: at(byId['bag-bottom'], W * 0.28, D / 2) },
    { n: 4, p: at(byId['bag-right'], D / 2, HB * 0.55) },
    { n: 5, p: at(byId['bag-right'], D / 2, D / 2) },
  ];
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption, written instruction, the
  chips drawn in the scenes, the legend) lives in bottom-folded.<lang>.js, index-aligned with this
  array; bottom-folded.text.js checks that. `scene` draws the step over t = 0…1, `duration` is its
  animation in seconds, `stitch` — the machine stitch (a key of `stitches` in the texts), `sew` — when
  and on which fabric the seam is sewn. `uses` — catalog products handy in that step (ids from
  src/data/products.js, shown as labelled affiliate links under the caption).
*/
export const STEPS = [
  {}, // 0: the finished bottom (texts: bottom-folded.<lang>.js)
  {
    scene: stepCentre, duration: 8, pad: 0.22,
    uses: ['rowenta-travel-iron', 'quilting-rulers-set', 'sewline-air-erasable-pen'],
  },
  {
    scene: stepFolds, duration: 8.5, stitch: 'straight', pad: 0.22,
    sew: [[0.18, 0.32, 'duck'], [0.64, 0.78, 'duck']],
    uses: ['janome-hd2200', 'hagbou-thread-set'],
  },
  {
    scene: stepTuck, duration: 8, pad: 0.22,
    uses: ['soraco-sewing-clips'],
  },
  {
    scene: stepSides, duration: 4.5, stitch: 'straight', pad: 0.22, sew: [[0.15, 0.85, 'duck']],
    uses: ['soraco-sewing-clips', 'janome-hd2200'],
  },
  {
    scene: stepTurnOut, duration: 6,
  },
];

/** Every chip key the drawing uses — each language must have them all (bottom-folded.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far it is tipped) → { body, viewBox }. L = the texts (bottom-folded.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  // the shadow: under the standing bag (0), the piece lying flat after the tuck (4), turned out (5)
  floorAt: (k) => (k === 0 ? [W / 2, D / 2, 0] : k === 5 ? [MID, Y1, 0] : k === 4 ? [MID, Y1 / 2, 0] : null),
  shadow: [W * 0.62, D * 0.9],
  fabrics: { duck: '#c08a87' },
});

/** Fabric patterns, in each piece's own cm coordinates (the tote's cotton duck). */
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
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

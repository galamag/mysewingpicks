/*
  Lined zipper pouch — the figure of the first section (`lined`) of the guide "How to sew a zipper"
  (/guides/sew-a-zipper#lined; Vault «Гайды — Молния (спецификация)», 3 row 1). The maker's own way, from
  her makeup bag (cosmetic.js, steps 7–8): the outer right side up, the 20 cm zipper face down along its
  23 cm side, in the middle (its ends stop short of the side edges), the lining face down on top, one
  0.5 cm seam through all the layers; the lining opened out, outer and lining each folded in half, so their
  other short sides meet the other side of the zipper, sewn the same way; then the zipper opened, ready for
  the side seams (those, and turning the bag out, are on the makeup bag's page — not drawn here).
  No topstitching along the zipper (the maker's bag has none). No presser foot named (spec 3.2).

  Numbers: ONLY the makeup bag's 20, 23 and 0.5 cm (cosmetic.js SPEC — tests/guides/sew-a-zipper.test.js
  checks they match). Literals here, not an import: the guide page must not download the makeup bag's model.
  The pieces' other side (the makeup bag's 31 cm) is drawn but never labelled; the finished size never shown.
  Words (titles, captions, instructions, chips, legend) are NOT here: zipper-lined.<lang>.js, picked
  through zipper-lined.text.js.

  Step 0 is the finished zipper (the end of step 6): the work flat on the table, inside out — the outer
  folded in half on one side, the lining on the other, the zipper between them, sewn on both sides and open.
  Tap: the zipper closes. Steps 1–6 each animate one move over t = 0…1 (x → right-down along the 23 cm
  side, y → left-down, away from the zipper). The flat drawing is a schematic: the END VIEW of step 4 shows
  the real loop. Shared parts (camera, inset, machine, renderer) live in kit.js. SVG ids carry the figure's
  prefix ('zipper-lined-…'), so it never collides with the other figures of the same page.
*/
import { at, turn } from './iso.js';
import { labelKeys, makeRenderer, rect, rot2, span } from './kit.js';

const ID = 'zipper-lined'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {
  zipper: 20, // the zipper's length (cosmetic.js SPEC.zipper)
  side: 23, // the side it goes in, in the middle: its ends stop short of the side edges (cosmetic.js SPEC.outer[0])
  seam: 0.5, // both seams, one on each side of the zipper (cosmetic.js SPEC.seam)
};

const OW = SPEC.side, Z = SPEC.zipper, S = SPEC.seam;
const ZX = (OW - Z) / 2; // where the zipper starts: centred, its ends short of the side edges
const OL = 31; // the pieces' other side, for the drawing only (the makeup bag's piece) — never labelled
const HALF = OL / 2; // where outer and lining fold in half
const T = 0.18; // fabric thickness in the drawing (cm)
const ZW = 3; // the zipper's width in the drawing (not a measurement): two tapes and the teeth
const TW = 0.8, GAP = 0.45; // the teeth band, and how far apart its halves lie once open (drawing)
const X = [1, 0, 0];

const F = (name) => `url(#${ID}-${name})`;
const PRINT = F('print'), BACK = F('back'); // the outer cotton: right side · wrong side
const LIN = F('lining'), LIN_BACK = F('liningBack');
const TAPE = F('tape'), TEETH = F('teeth'), PULL = F('pull');

/** A flat piece on the table (x → right-down, y → left-down), right side up (`up`) or down. */
const table = (id, pts, z, fill, inner, up = true, extra = {}) =>
  ({ id, pts, O: [0, 0, z], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, up ? 1 : -1], fill, inner, ...extra });

/** Only what can be seen: a piece faded to nothing is dropped, not drawn at opacity ~0. */
const seen = (ps) => ps.filter((p) => (p.opacity ?? 1) > 0.01);
const fade = (ps, o) => ps.map((p) => ({ ...p, opacity: (p.opacity ?? 1) * o }));

/* ---------- The zipper ---------- */

/** The pull, round its own origin (on the teeth): a body, and the tab toward the zipper's start. */
const PULL_PTS = [[0.6, -0.5], [0.6, 0.5], [-1.2, 0.75], [-1.2, 0.32], [-2.6, 0.28], [-2.6, -0.28], [-1.2, -0.32], [-1.2, -0.75]];

/** Where the pull is along the zipper (from its start): `pull` 0 = near the start (open) … 1 = near the end (closed). */
const pullAt = (pull) => 2.4 + pull * (Z - 3.2);

/*
  The zipper as it first lies on the outer: face down along the edge y = 0, from x = ZX, at height z, its own
  v running across it (y = v): tape a (v 0…ZW/2) along the raw edge — the first side, sewn first; tape b
  (ZW/2…ZW) — the second side; the teeth down the middle and, face up only, the pull. `pull` 0…1: where the
  pull is (0 = the start, open; 1 = the end, closed): the teeth are closed from the start up to the pull and
  parted beyond it. `sewn`: which tapes carry their seam, 0.5 cm from the tape's edge ('', 'a', 'ab').
*/
function zipper(z, { pull = 1, sewn = '', face = false } = {}) {
  const c = ZW / 2;
  const piece = (id, pts, dz, fill, lines = [], O = [ZX, 0, z - dz]) =>
    ({ id, pts, O, U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, -1], fill, inner: fill, lines });
  const u = pullAt(pull);
  const band = (a, b, v0, v1) => [[a, v0], [b, v0], [b, v1], [a, v1]];
  const ps = [
    piece('zip-tape-a', band(0, Z, 0, c), 0, TAPE, sewn.includes('a') ? [{ pts: [[0, S], [Z, S]], kind: 'stitch' }] : []),
    piece('zip-tape-b', band(0, Z, c, ZW), 0, TAPE, sewn.includes('b') ? [{ pts: [[0, ZW - S], [Z, ZW - S]], kind: 'stitch' }] : []),
  ];
  if (u > 0.05) ps.push(piece('zip-teeth', band(0, u, c - TW / 2, c + TW / 2), 0.02, TEETH));
  if (Z - u > 0.05) {
    ps.push(piece('zip-teeth-a', band(u, Z, c - TW / 2 - GAP / 2, c - GAP / 2), 0.02, TEETH));
    ps.push(piece('zip-teeth-b', band(u, Z, c + GAP / 2, c + TW / 2 + GAP / 2), 0.02, TEETH));
  }
  // the pull rides on the teeth, its tab toward the start; only seen face up (then it is on top)
  if (face) ps.push(piece('zip-pull', PULL_PTS, 0.06, PULL, [], [ZX + u, c, z - 0.06]));
  return ps;
}

/** The zipper turned face up beside the outer's edge (y −ZW…0), as the lining is opened out: a turn about the seam. */
const zipperUp = (z, opts) => zipper(T, { ...opts, face: true }).map((p) => {
  const q = turn(p, [0, 0, T], X, Math.PI);
  return { ...q, O: [q.O[0], q.O[1], q.O[2] + (z - T)] };
});

/* ---------- The layers (steps 1–3): outer, zipper face down, lining face down ---------- */

const outerFlat = () => table('outer', rect(OW, OL), 0, PRINT, BACK, true);
const liningOn = (z, o = 1) => table('lining', rect(OW, OL), z, LIN, LIN_BACK, false, { opacity: o });

/* Step 1: the outer right side up; the zipper face down along its 23 cm side, in the middle. */
function stepZipper(t) {
  const zin = span(t, 0.12, 0.34);
  const dims = span(t, 0.36, 0.42) * (1 - span(t, 0.56, 0.6));
  return {
    pieces: seen([outerFlat(), ...fade(zipper(T + (1 - zin) * 8), zin)]),
    over: [
      { type: 'label', p: [OW / 2, OL / 2, 0], label: 'outerUp', o: span(t, 0.02, 0.08) * (1 - span(t, 0.16, 0.2)) },
      { type: 'label', p: [OW / 2, ZW / 2, T], label: 'zipperDown', o: span(t, 0.22, 0.28) * (1 - span(t, 0.36, 0.4)), dy: 8, hot: true },
      { type: 'dim', a: [ZX, -2.5, T], b: [ZX + Z, -2.5, T], label: 'cm20', o: dims, hot: true },
      { type: 'dim', a: [0, -13, 0], b: [OW, -13, 0], label: 'cm23', o: dims },
      { type: 'label', p: [ZX + Z, ZW / 2, T], label: 'endsShort', o: span(t, 0.66, 0.72), dx: -4, dy: 9, hot: true },
    ],
    // at the end, closer on the zipper's end: it stops short of the side edge
    focus: { pts: [[OW - 9, -4, 0], [OW + 1, -4, 0], [OW - 9, 6, 0], [OW + 1, 6, 0]], k: 0.55 * span(t, 0.58, 0.66) },
  };
}

/* Step 2: the lining face down on top, its edge level with the outer's. */
function stepLining(t) {
  const lin = span(t, 0.1, 0.42);
  return {
    pieces: seen([outerFlat(), ...zipper(T), liningOn(2 * T + (1 - lin) * 10, lin)]),
    over: [
      { type: 'label', p: [OW / 2, OL / 2, 2 * T], label: 'liningDown', o: span(t, 0.2, 0.26) * (1 - span(t, 0.5, 0.56)), hot: true },
      { type: 'label', p: [OW * 0.25, 0, 2 * T], label: 'edgesLevel', o: span(t, 0.6, 0.66), dx: 10, dy: -7, hot: true },
    ],
  };
}

/* Step 3: one seam through the three layers, 0.5 cm from the edge. The lining is ghosted: the zipper shows under it. */
function stepSewA(t) {
  const sew = span(t, 0.2, 0.86);
  const ghost = 1 - 0.45 * span(t, 0.04, 0.14);
  const done = t > 0.86;
  const z = 3 * T;
  return {
    pieces: [outerFlat(), ...zipper(T, { sewn: done ? 'a' : '' }), liningOn(2 * T, ghost)],
    over: [
      { type: 'line', pts: [[0, S, z], [OW, S, z]], t: sew, kind: 'hot', o: 1 - span(t, 0.88, 0.94) },
      { type: 'label', p: [OW, S, z], label: 'seam05', o: span(t, 0.22, 0.28), dx: -10, dy: -8, hot: true },
    ],
    focus: { pts: [[0, -3, 0], [OW, -3, 0], [0, 7, 0], [OW, 7, 0]], k: 0.5 * span(t, 0.1, 0.18) },
  };
}

/* ---------- Step 4 on: opened out and folded — the flat loop ---------- */

/*
  `flip` 0…1 — the lining (and the zipper with it) opens out about the seam, to the other side of the outer's
  edge, right side up; `fold` 0…1 — outer and lining each fold in half (right sides together), their far ends
  coming back to the zipper. The zipper lifts a little as they come, to stay on top in the drawing.
*/
function loop({ flip = 1, fold = 1, pull = 1, sewn = 'a' }) {
  const aF = Math.PI * flip, aO = Math.PI * fold;
  const flipped = (p) => turn(p, [0, 0, T], X, aF);
  const zip = flip >= 0.999
    ? zipperUp(T + 2 * T * fold, { pull, sewn })
    : zipper(T, { sewn }).map(flipped);
  if (fold <= 0.001) {
    // not folded yet: each still one piece (no line across it where it will fold)
    const outer = table('outer', rect(OW, OL), 0, PRINT, BACK, true);
    const lining = flipped(table('lining', rect(OW, OL), 2 * T, LIN, LIN_BACK, false, { O: [0, 0, 2 * T] }));
    return flip < 0.5 ? [outer, ...zip, lining] : [lining, outer, ...zip];
  }
  const outerNear = table('outer-near', rect(OW, HALF), 0, PRINT, BACK, true);
  const outerFar = turn(table('outer-far', rect(OW, HALF), 0, PRINT, BACK, true, { O: [0, HALF, 0] }), [0, HALF, T], X, aO);
  const linNear = flipped(table('lining-near', rect(OW, HALF), 2 * T, LIN, LIN_BACK, false, { O: [0, 0, 2 * T] }));
  const linFar0 = flipped(table('lining-far', rect(OW, HALF), 2 * T, LIN, LIN_BACK, false, { O: [0, HALF, 2 * T] }));
  const linFar = turn(linFar0, [0, -HALF, T], X, -aO);
  // painter: what lies low first; the lining's far half is in the air above the zipper until it lands
  const landed = fold > 0.97;
  return flip < 0.5
    ? [outerNear, outerFar, ...zip, linNear, linFar]
    : [linNear, outerNear, ...(landed ? [linFar, ...zip] : [...zip, linFar]), outerFar];
}

/**
  The END VIEW of step 4: outer (right of the seam), zipper, lining (left). The lining and the zipper open out
  about the seam; then each half folds over its fold line, so at the end the outer and the lining are two
  loops' halves joined at the zipper: the loop the bag is made of.
*/
function loopInset(flip, fold) {
  const lift = 4; // layers drawn apart (thicker than life, or they merge into one line)
  const segs = [];
  const p = (a, b) => segs.push({ a, b });
  /** A half folding over at `h` (its fold line, at height z0): near part, the fold, the far part turning over. */
  const half = (a, h, b, z0, sign) => {
    const hinge = [h[0], z0 + lift / 2];
    const f0 = rot2(h, hinge, sign * Math.PI * fold), f1 = rot2(b, hinge, sign * Math.PI * fold);
    p(a, h);
    p(h, f0);
    p(f0, f1);
  };
  half([0, 0], [HALF, 0], [OL, 0], 0, 1); // the outer
  const fl = (q) => rot2(q, [0, lift / 2], Math.PI * flip); // the lining and the zipper open out about the seam
  if (flip < 0.999) {
    p(fl([0, lift]), fl([OL, lift])); // the lining, face down on top
  } else {
    half([0, 0], [-HALF, 0], [-OL, 0], 0, -1); // the lining, opened out: right side up, then folded
  }
  // the zipper: between the layers, then on the edge; folded, it stands where the two halves' ends meet
  const z1 = fl([ZW, lift / 2]);
  p([0, (lift / 2) * (1 - fold)], [z1[0] * (1 - fold), z1[1] + (lift - z1[1]) * fold]);
  return { segs, range: [-HALF - 2, HALF + 2] };
}

function stepFold(t) {
  const flip = span(t, 0.04, 0.3), fold = span(t, 0.36, 0.64);
  return {
    pieces: loop({ flip, fold }),
    over: [
      { type: 'label', p: [OW / 2, -HALF / 2, 0], label: 'liningOut', o: span(t, 0.14, 0.2) * (1 - span(t, 0.32, 0.36)), hot: true },
      { type: 'label', p: [OW / 2, 0, 0], label: 'foldBoth', o: span(t, 0.4, 0.46) * (1 - span(t, 0.66, 0.7)), dy: -8 },
      { type: 'label', p: [OW / 2, -ZW / 2, 3 * T], label: 'otherEnds', o: span(t, 0.74, 0.8), dy: 8, hot: true },
    ],
    inset: loopInset(flip, fold),
    // folded, closer on the loop
    focus: { pts: [[0, -HALF, 0], [OW, -HALF, 0], [0, HALF, 0], [OW, HALF, 0]], k: 0.75 * span(t, 0.62, 0.72) },
  };
}

/* Step 5: the other side of the zipper, sewn the same way: 0.5 cm from the edge. */
const B_SEAM = -(ZW - S); // tape b's seam, once the zipper lies face up (y = −v)

function stepSewB(t) {
  const sew = span(t, 0.2, 0.86);
  const done = t > 0.86;
  const z = 4 * T;
  return {
    pieces: loop({ sewn: done ? 'ab' : 'a' }),
    over: [
      { type: 'line', pts: [[0, B_SEAM, z], [OW, B_SEAM, z]], t: sew, kind: 'hot', o: 1 - span(t, 0.88, 0.94) },
      { type: 'label', p: [OW / 2, B_SEAM, z], label: 'otherSide', o: span(t, 0.04, 0.1) * (1 - span(t, 0.2, 0.24)), dy: 8, hot: true },
      { type: 'label', p: [OW, B_SEAM, z], label: 'seam05', o: span(t, 0.24, 0.3), dx: -10, dy: 8, hot: true },
    ],
    focus: { pts: [[0, -7, 0], [OW, -7, 0], [0, 4, 0], [OW, 4, 0]], k: 0.5 * span(t, 0.08, 0.16) },
  };
}

/* Step 6: open the zipper — the pull slides to the start, the teeth part behind it. Ready for the side seams. */
function stepOpen(t) {
  const pull = 1 - span(t, 0.16, 0.66);
  const z = 4 * T;
  return {
    pieces: loop({ pull, sewn: 'ab' }),
    over: [
      { type: 'label', p: [ZX + pullAt(pull), -ZW / 2, z], label: 'openZipper', o: span(t, 0.06, 0.12) * (1 - span(t, 0.68, 0.74)), dy: 8, hot: true },
      { type: 'label', p: [OW / 2, HALF / 2, 2 * T], label: 'readySides', o: span(t, 0.78, 0.84) },
    ],
    focus: { pts: [[0, -7, 0], [OW, -7, 0], [0, 4, 0], [OW, 4, 0]], k: 0.4 * span(t, 0.04, 0.12) * (1 - span(t, 0.7, 0.78)) },
  };
}

/* ---------- Step 0: the finished zipper — open (e = 0, the first frame) or closed (e = 1) ---------- */

/** The flat loop, sewn on both sides; e = 0 open, 1 closed (tap). */
export function anatomy(e = 0) {
  return { pieces: loop({ pull: span(e, 0.1, 0.9), sewn: 'ab' }), over: [] };
}

/** Numbered pins for the legend, on the open zipper (shown at rest): outer, zipper, lining, seams. */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  return [
    { n: 1, p: at(byId['outer-far'], OW * 0.62, HALF * 0.55) },
    { n: 2, p: at(byId['zip-tape-a'], Z * 0.78, ZW / 2) },
    { n: 3, p: at(byId['lining-far'], OW * 0.6, HALF * 0.3) },
    { n: 4, p: at(byId['zip-tape-b'], Z * 0.3, ZW - S) },
  ];
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption, written instruction, the chips
  drawn in the scenes, the legend) lives in zipper-lined.<lang>.js, index-aligned with this array;
  zipper-lined.text.js checks that. `scene` draws the step over t = 0…1, `duration` is its animation in
  seconds, `stitch` — the machine stitch (a key of `stitches` in the texts), `sew` — when and on which fabric
  the seam is sewn. `uses` — catalog products handy in that step (ids from src/data/products.js, shown as
  labelled affiliate links under the caption): the makeup bag's own (cosmetic.js steps 7–8) — no presser foot.
*/
export const STEPS = [
  {}, // 0: the finished zipper (texts: zipper-lined.<lang>.js)
  { scene: stepZipper, duration: 6.5 },
  { scene: stepLining, duration: 4.5, uses: ['soraco-sewing-clips'] },
  { scene: stepSewA, duration: 5.5, stitch: 'straight', sew: [[0.2, 0.86, 'lining']], uses: ['janome-1522rd'] },
  { scene: stepFold, duration: 7, pad: 0.22 },
  { scene: stepSewB, duration: 5.5, stitch: 'straight', sew: [[0.2, 0.86, 'lining']], uses: ['soraco-sewing-clips', 'janome-1522rd'] },
  { scene: stepOpen, duration: 5 },
];

/** Every chip key the drawing uses — each language must have them all (zipper-lined.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far it is closed) → { body, viewBox }. L = the texts (zipper-lined.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  floorAt: () => null, // flat work on the table: no shadow
  shadow: [1, 1],
  fabrics: { lining: '#b9615d' },
  pinsAt: 0, // the pins are on the open zipper: already in the first frame
});

/** Fabric patterns (ids prefixed with the figure's ID), in each piece's own cm coordinates — the makeup bag's. */
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
  <pattern id="${ID}-tape" width="2" height="2" patternUnits="userSpaceOnUse">
    <rect width="2" height="2" fill="#6f8a8c"/><path d="M0 1H2" stroke="#5f7779" stroke-width=".2"/>
  </pattern>
  <pattern id="${ID}-teeth" width=".6" height=".8" patternUnits="userSpaceOnUse">
    <rect width=".6" height=".8" fill="#4d6264"/><rect x=".08" width=".3" height=".8" fill="#e8ecea"/>
  </pattern>
  <linearGradient id="${ID}-pull" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e8e2d8"/><stop offset="1" stop-color="#9a948c"/>
  </linearGradient>
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

/*
  Zipper with end tabs — the figure of the second section (`tabs`) of the guide "How to sew a zipper"
  (/guides/sew-a-zipper#tabs; Vault «Гайды — Молния (спецификация)», 3 row 2 and 5.3 «Раздел 2 — закрытые концы»).
  A public technique, no maker's project: what the sources agree on, in our own drawing. A strip of fabric a little
  wider than the zipper tape is folded like bias tape (two opposite edges to the middle, then in half) and pressed;
  slipped over the end of the zipper (the end inside, up to the fold, the folded edges just past the stop) and
  stitched along its folded edges — through the tab and the tape, never over the metal stop or the teeth; the other
  end the same way. The rest — the zipper between the outer and the lining — is section 1 (`lined`): not drawn again,
  the page links to #lined under this figure.

  NO numbers (spec 3, «Разделы 2–6 — без цифр»): the tab's size differs from source to source, so it is said in
  words ("a little wider than the zipper tape"). `SPEC` is empty; `DRAWING` holds the drawing's own proportions
  (not measurements — never shown), so the tests can check the relations: the strip a little wider than the tape, the
  tab a quarter of the strip, every stitch on the bare tape past a stop. Words (titles, captions, instructions,
  chips, legend) are NOT here: zipper-tabs.<lang>.js, picked through zipper-tabs.text.js.

  Step 0 is the finished zipper: face up on the table, a tab on each end, each stitched past its stop. Tap: the
  tabs lift off, so the stops and the zipper's ends show. Steps 1–6 each animate one move over t = 0…1 (x → right-down
  along the zipper, y → left-down across it). The tab is made beside the zipper's right end (steps 1–3), slipped on
  and stitched (4–5); the second one comes ready-folded to the left end (6). Shared parts (camera, inset, machine,
  renderer) live in kit.js. SVG ids carry the figure's prefix ('zipper-tabs-…'), so it never collides with the other
  figures of the same page.
*/
import { at, turn } from './iso.js';
import { labelKeys, makeRenderer, rect, rot2, span } from './kit.js';

const ID = 'zipper-tabs'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {}; // no maker's numbers in this section

/* ---------- The drawing's proportions (not measurements: never labelled, never written) ---------- */

const ZL = 14; // the zipper's length in the drawing
const ZW = 3; // its width: two tapes and the teeth ("the zipper tape")
const C = ZW / 2; // the middle of the teeth
const TW = 0.8; // the teeth band
const E = 1.5; // bare tape past each stop, at each end
const SW = 0.35; // a stop, along the zipper
const A = 1.3; // the folded tab, along the zipper (a quarter of the strip)
const OV = 0.35; // how far the tab sticks out past each edge of the tape: "a little wider"
const GAP = 0.3; // the tab's folded edges lie this far past the stop
const ES = 0.2; // the stitch, this close to the folded edges
const T = 0.18; // fabric thickness in the drawing (the tab on the zipper)
const TS = 0.1; // the strip's layers while it is folded (thinner, or the stack looks like a pile of plates)
const LY = ZW + 2 * OV; // the strip across the zipper: a little wider than the tape

const STOP_L = [E, E + SW]; // the top stops (one on each row of teeth)
const STOP_R = [ZL - E - SW, ZL - E]; // the bottom stop (one across both rows)
const TEETH = [E + SW, ZL - E - SW];
const OPEN = { left: E - GAP, right: ZL - E + GAP }; // where each tab's folded edges lie
const STITCH = { left: OPEN.left - ES, right: OPEN.right + ES }; // each tab's stitch line (x)

/** The drawing's relations, for the tests (tests/guides/sew-a-zipper.test.js). */
export const DRAWING = {
  length: ZL, tape: ZW, over: OV, depth: A, gap: GAP,
  stops: [STOP_L, STOP_R], teeth: TEETH, stitch: [STITCH.left, STITCH.right],
};

const Y = [0, 1, 0];
const F = (name) => `url(#${ID}-${name})`;
const PRINT = F('print'), BACK = F('back'); // the tab's cotton: right side · wrong side
const TAPE = F('tape'), TEETH_FILL = F('teeth'), METAL = F('metal'), PULL = F('pull');

/** A flat piece on the table (x → right-down, y → left-down), right side up (`up`) or down. */
const table = (id, pts, z, fill, inner, up = true, extra = {}) =>
  ({ id, pts, O: [0, 0, z], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, up ? 1 : -1], fill, inner, ...extra });

/** Only what can be seen: a piece faded to nothing is dropped, not drawn at opacity ~0. */
const seen = (ps) => ps.filter((p) => (p.opacity ?? 1) > 0.01);

/* ---------- The zipper: face up on the table, closed (the pull by the top stops, on the left) ---------- */

const band = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
/** The pull, round its own origin (on the teeth): a body, and its tab toward the middle of the zipper. */
const PULL_PTS = [[-0.6, -0.5], [-0.6, 0.5], [1.2, 0.75], [1.2, 0.32], [2.6, 0.28], [2.6, -0.28], [1.2, -0.32], [1.2, -0.75]];

function zipper() {
  const z = (id, pts, fill, extra = {}) => table(id, pts, 0, fill, fill, true, extra);
  return [
    z('zip-tape-a', band(0, ZL, 0, C), TAPE),
    z('zip-tape-b', band(0, ZL, C, ZW), TAPE),
    z('zip-teeth', band(TEETH[0], TEETH[1], C - TW / 2, C + TW / 2), TEETH_FILL),
    z('zip-stop-left-a', band(STOP_L[0], STOP_L[1], C - TW / 2 - 0.06, C - 0.03), METAL),
    z('zip-stop-left-b', band(STOP_L[0], STOP_L[1], C + 0.03, C + TW / 2 + 0.06), METAL),
    z('zip-stop-right', band(STOP_R[0], STOP_R[1], C - TW / 2 - 0.12, C + TW / 2 + 0.12), METAL),
    z('zip-pull', PULL_PTS, PULL, { O: [TEETH[0] + 0.75, C, 0.04] }),
  ];
}

/* ---------- The strip, folded like bias tape (steps 1–3), beside the zipper's right end ---------- */

const SX = ZL + 2.2; // where the strip lies (its near edge), across the zipper's width (y −OV … ZW + OV)

/** The strip as one piece, wrong side up (step 1), `drop` above the table while it comes in. */
const stripFlat = (drop = 0, o = 1) => table('strip', rect(4 * A, LY), drop, PRINT, BACK, false, { O: [SX, -OV, drop], opacity: o });

/*
  The strip in four panels (wrong side up): `edges` 0…1 — the two outer panels fold over to the middle (bias tape);
  `half` 0…1 — the right half folds over onto the left (in half). Panel order is the painter's: lowest first.
*/
function stripPanels(edges, half) {
  const panel = (i) => table(`strip-${i}`, rect(A, LY), 0, PRINT, BACK, false, { O: [SX + (i - 1) * A, -OV, 0] });
  const p1 = turn(panel(1), [SX + A, 0, TS], Y, Math.PI * edges);
  const p2 = panel(2);
  let p3 = panel(3);
  let p4 = turn(panel(4), [SX + 3 * A, 0, TS], Y, -Math.PI * edges);
  if (half <= 0.001) return [p2, p3, p1, p4];
  p3 = turn(p3, [SX + 2 * A, 0, 3 * TS], Y, -Math.PI * half);
  p4 = turn(p4, [SX + 2 * A, 0, 3 * TS], Y, -Math.PI * half);
  // past a quarter turn the right half's stack is upside down: panel 4 goes under panel 3
  return half < 0.25 ? [p2, p1, p3, p4] : [p2, p1, p4, p3];
}

/** The END VIEW of steps 2–3: the strip in section (along the zipper), layers drawn apart. */
function stripInset(edges, half) {
  const L = 0.32; // layers drawn apart (thicker than life)
  const segs = [];
  const p = (a, b) => segs.push({ a, b });
  const r1 = (q) => rot2(q, [A, L / 2], -Math.PI * edges); // panel 1 over to the middle
  const r4 = (q) => rot2(q, [3 * A, L / 2], Math.PI * edges); // panel 4 over to the middle
  const rh = (q) => rot2(q, [2 * A, 1.5 * L], Math.PI * half); // the right half over onto the left
  p([A, 0], [2 * A, 0]); // panel 2
  p(r1([0, 0]), r1([A, 0])); // panel 1
  p([A, 0], r1([A, 0])); // its fold
  p(rh([2 * A, 0]), rh([3 * A, 0])); // panel 3
  p(rh(r4([3 * A, 0])), rh(r4([4 * A, 0]))); // panel 4
  p(rh([3 * A, 0]), rh(r4([3 * A, 0]))); // its fold
  p([2 * A, 0], rh([2 * A, 0])); // the middle: the fold of the finished tab
  return { segs, range: [-0.5, 4 * A + 0.5] };
}

const stripFocus = (k) => ({ pts: [[SX - 0.6, -OV - 0.6, 0], [SX + 4 * A + 1.6, -OV - 0.6, 0], [SX - 0.6, LY, 0], [SX + 4 * A + 1.6, LY, 0]], k });

/* ---------- A finished tab (folded in four) on an end of the zipper ---------- */

/*
  The tab at `end` ('left' | 'right'): its folded edges at OPEN[end] + dx, its fold toward the zipper's cut end;
  the bottom layer at zb (under the zipper), the top at zt (over it), the fold joining them. `sewn` — its stitch line,
  ES from the folded edges. → { under, over }: the pieces drawn before the zipper, and after it (painter's order).
*/
function tab(end, { dx = 0, zb = -T, zt = T, sewn = false } = {}) {
  const right = end === 'right';
  const x0 = right ? OPEN.right + dx : OPEN.left + dx - A; // the tab's near side (smaller x)
  const xf = right ? x0 + A : x0; // the fold
  const u = right ? ES : A - ES; // the stitch, in the tab's own u
  const lines = sewn ? [{ pts: [[u, 0.12], [u, LY - 0.12]], kind: 'stitch' }] : [];
  const bottom = table(`tab-${end}-bottom`, rect(A, LY), zb, PRINT, BACK, false, { O: [x0, -OV, zb] });
  const top = table(`tab-${end}-top`, rect(A, LY), zt, PRINT, BACK, true, { O: [x0, -OV, zt], lines });
  const h = zt - zb;
  const fold = h > 0.01
    ? { id: `tab-${end}-fold`, pts: rect(LY, h), O: [xf, -OV, zb], U: [0, 1, 0], V: [0, 0, 1], out: [right ? 1 : -1, 0, 0], fill: PRINT, inner: BACK }
    : null;
  // the right fold faces the viewer (+x): drawn last; the left one faces away: drawn first
  const under = right || !fold ? [bottom] : [fold, bottom];
  const over = right && fold ? [top, fold] : [top];
  return { under, over, bottom, top, fold };
}

/** The zipper with what is on its ends: [under…, zipper, over…] in painter's order. */
const assemble = (...tabs) => [...tabs.flatMap((t) => t.under), ...zipper(), ...tabs.flatMap((t) => t.over)];

const endFocus = (end, k) => {
  const [a, b] = end === 'right' ? [ZL - 4.2, ZL + 1.6] : [-1.6, 4.2];
  return { pts: [[a, -1.2, 0], [b, -1.2, 0], [a, ZW + 1.2, 0], [b, ZW + 1.2, 0]], k };
};

/** The END VIEW of step 4: the zipper's end and its stop in section, the tab sliding over it. */
function slipInset(dx, open) {
  const L = 0.32, segs = [];
  const p = (a, b) => segs.push({ a, b });
  p([ZL - 3.6, 0], [ZL, 0]); // the zipper
  p([STOP_R[0], 0], [STOP_R[0], 0.3]); p([STOP_R[0], 0.3], [STOP_R[1], 0.3]); p([STOP_R[1], 0.3], [STOP_R[1], 0]); // the stop
  const x0 = OPEN.right + dx, x1 = x0 + A, top = L + open;
  p([x0, -L], [x1, -L]); // the tab's bottom layer
  p([x0, top], [x1, top]); // its top layer
  p([x1, -L], [x1, top]); // the fold
  return { segs, range: [ZL - 3.4, ZL + 5.6] };
}

/* ---------- Steps ---------- */

/* Step 1: a strip of fabric, a little wider than the zipper tape, beside the zipper. */
function stepStrip(t) {
  const come = span(t, 0.08, 0.32);
  const dims = span(t, 0.42, 0.5);
  return {
    pieces: seen([...zipper(), stripFlat((1 - come) * 6, come)]),
    over: [
      { type: 'label', p: [SX + 2 * A, LY / 2 - OV, 0], label: 'strip', o: span(t, 0.2, 0.28) * (1 - span(t, 0.38, 0.42)), dx: -8, dy: -8, hot: true },
      { type: 'dim', a: [SX - 0.7, -OV, 0], b: [SX - 0.7, ZW + OV, 0], label: 'widerThanTape', o: dims, hot: true },
    ],
  };
}

/* Step 2: two opposite edges folded to the middle, wrong sides together, and pressed — like bias tape. */
function stepEdges(t) {
  const edges = span(t, 0.12, 0.56);
  return {
    pieces: [...zipper(), ...stripPanels(edges, 0)],
    over: [
      { type: 'label', p: [SX + 2 * A, LY / 2 - OV, 2 * TS], label: 'edgesMiddle', o: span(t, 0.14, 0.2) * (1 - span(t, 0.58, 0.62)), dy: -9, hot: true },
      { type: 'label', p: [SX + 2 * A, LY / 2 - OV, 2 * TS], label: 'press', o: span(t, 0.68, 0.74), dy: -9 },
    ],
    inset: stripInset(edges, 0),
    focus: stripFocus(0.75 * span(t, 0, 0.1)),
  };
}

/* Step 3: folded in half along the middle, the folded edges inside, and pressed: the tab. */
function stepHalf(t) {
  const half = span(t, 0.12, 0.56);
  return {
    pieces: [...zipper(), ...stripPanels(1, half)],
    over: [
      { type: 'label', p: [SX + 1.5 * A, LY / 2 - OV, 4 * TS], label: 'inHalf', o: span(t, 0.14, 0.2) * (1 - span(t, 0.58, 0.62)), dy: -9, hot: true },
      { type: 'label', p: [SX + 1.5 * A, LY / 2 - OV, 6 * TS], label: 'press', o: span(t, 0.68, 0.74), dy: -9 },
    ],
    inset: stripInset(1, half),
    focus: stripFocus(0.75),
  };
}

/* Step 4: the tab slipped over the zipper's end: the end inside, up to the fold; the folded edges just past the stop. */
const DX0 = SX + A - OPEN.right; // the folded tab, where step 3 left it

function stepSlip(t) {
  const mv = span(t, 0.12, 0.6);
  const open = 0.5 * Math.sin(Math.PI * mv); // the top layer lifts a little as the end goes in
  const dx = (1 - mv) * DX0;
  const zt = 6 * TS + (T - 6 * TS) * mv + open, zb = -T * mv;
  return {
    pieces: assemble(tab('right', { dx, zb, zt })),
    over: [
      { type: 'label', p: [ZL - 1.5, LY / 2 - OV, T], label: 'slipOn', o: span(t, 0.14, 0.2) * (1 - span(t, 0.56, 0.6)), dy: -10, hot: true },
      { type: 'label', p: [(STOP_R[1] + OPEN.right) / 2, C, T], label: 'pastStop', o: span(t, 0.66, 0.72), dx: -4, dy: 11, hot: true },
    ],
    inset: slipInset(dx, 0.3 * (1 - mv) + 0.8 * open),
    focus: endFocus('right', 0.7 * span(t, 0.58, 0.68)),
  };
}

/* Step 5: stitched along the folded edges with the zipper foot — on the tape past the stop, never over it. */
function stepSewRight(t) {
  const sew = span(t, 0.24, 0.8);
  const done = t > 0.8;
  return {
    pieces: assemble(tab('right', { sewn: done })),
    over: [
      { type: 'line', pts: [[STITCH.right, -OV + 0.12, T + 0.01], [STITCH.right, ZW + OV - 0.12, T + 0.01]], t: sew, kind: 'hot', o: 1 - span(t, 0.82, 0.88) },
      { type: 'label', p: [STITCH.right, -OV, T], label: 'alongEdge', o: span(t, 0.06, 0.12) * (1 - span(t, 0.84, 0.88)), dx: 4, dy: -8, hot: true },
      { type: 'label', p: [(STOP_R[0] + STOP_R[1]) / 2, C, 0], label: 'notOverStop', o: span(t, 0.16, 0.22), dx: -8, dy: 10, hot: true },
    ],
    focus: endFocus('right', 0.7),
  };
}

/* Step 6: the second tab on the other end, stitched the same way, past the stop there; then the rest is section 1. */
function stepLeft(t) {
  const mv = span(t, 0.06, 0.34);
  const sew = span(t, 0.44, 0.78);
  const done = t > 0.78;
  const lift = (1 - mv) * 1.4;
  const z = (1 - span(t, 0.8, 0.88));
  return {
    pieces: assemble(tab('left', { dx: -(1 - mv) * 3.5, zb: -T + lift, zt: T + lift, sewn: done }), tab('right', { sewn: true })),
    over: [
      { type: 'line', pts: [[STITCH.left, -OV + 0.12, T + 0.01], [STITCH.left, ZW + OV - 0.12, T + 0.01]], t: sew, kind: 'hot', o: span(t, 0.4, 0.44) * (1 - span(t, 0.8, 0.86)) },
      { type: 'label', p: [OPEN.left - A / 2, -OV, T], label: 'otherEnd', o: span(t, 0.04, 0.1) * (1 - span(t, 0.36, 0.4)), dx: 6, dy: -9, hot: true },
      { type: 'label', p: [(STOP_L[0] + STOP_L[1]) / 2, C, 0], label: 'notOverStop', o: span(t, 0.42, 0.48) * (1 - span(t, 0.8, 0.84)), dx: 8, dy: 10, hot: true },
      { type: 'label', p: [ZL / 2, C, 0], label: 'thenLined', o: span(t, 0.88, 0.94), dy: 11 },
    ],
    focus: endFocus('left', 0.7 * span(t, 0.02, 0.1) * z),
  };
}

/* ---------- Step 0: the finished zipper — both tabs on (e = 0, the first frame) or lifted off (e = 1) ---------- */

/** The zipper with both tabs stitched; e = 0 on, 1 lifted off its ends (tap). */
export function anatomy(e = 0) {
  const k = span(e, 0.1, 0.9);
  const up = 2.4 * k;
  const L = tab('left', { dx: -1.6 * k, zb: -T + up, zt: T + up, sewn: true });
  const R = tab('right', { dx: 1.6 * k, zb: -T + up, zt: T + up, sewn: true });
  // lifted above the zipper, the bottom layers are drawn after it
  const pieces = up - T > 0 ? [...zipper(), ...L.under, ...L.over, ...R.under, ...R.over] : assemble(L, R);
  return { pieces, over: [] };
}

/** Numbered pins for the legend, on the finished zipper (shown at rest): tab, stitching, stop, zipper. */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  return [
    { n: 1, p: at(byId['tab-left-top'], A * 0.5, LY * 0.55) },
    { n: 2, p: at(byId['tab-right-top'], ES, LY * 0.2) },
    { n: 3, p: [(STOP_R[0] + STOP_R[1]) / 2, C, 0] },
    { n: 4, p: at(byId['zip-tape-b'], ZL * 0.55, ZW * 0.8) },
  ];
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption, written instruction, the chips drawn
  in the scenes, the legend) lives in zipper-tabs.<lang>.js, index-aligned with this array; zipper-tabs.text.js
  checks that. `scene` draws the step over t = 0…1, `duration` is its animation in seconds, `stitch` — the machine
  stitch (a key of `stitches` in the texts), `sew` — when and on which fabric the seam is sewn. `uses` — catalog
  products handy in that step (ids from src/data/products.js, shown as labelled affiliate links under the caption):
  the zippers (a general recommendation, not the maker's), scissors, the iron, the zipper foot (Windman set) and
  the machine where it sews.
*/
export const STEPS = [
  {}, // 0: the finished zipper (texts: zipper-tabs.<lang>.js)
  { scene: stepStrip, duration: 4.5, uses: ['mandala-crafts-zippers', 'tailor-scissors'] },
  { scene: stepEdges, duration: 5, uses: ['rowenta-travel-iron'] },
  { scene: stepHalf, duration: 5, uses: ['rowenta-travel-iron'] },
  { scene: stepSlip, duration: 5.5 },
  { scene: stepSewRight, duration: 5.5, stitch: 'straight', sew: [[0.24, 0.8, 'tab']], uses: ['windman-presser-feet-set', 'janome-1522rd'] },
  { scene: stepLeft, duration: 7.5, stitch: 'straight', sew: [[0.44, 0.78, 'tab']], uses: ['windman-presser-feet-set', 'janome-1522rd'] },
];

/** Every chip key the drawing uses — each language must have them all (zipper-tabs.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far the tabs are lifted) → { body, viewBox }. L = the texts (zipper-tabs.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  floorAt: () => null, // flat work on the table: no shadow
  shadow: [1, 1],
  fabrics: { tab: '#9caf88' },
  pinsAt: 0, // the pins are on the finished zipper: already in the first frame
});

/** Fabric patterns (ids prefixed with the figure's ID), in each piece's own coordinates. */
export const DEFS = `
<defs>
  <pattern id="${ID}-print" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#dfe6d3"/>
    <circle cx=".8" cy=".8" r=".38" fill="#8fa37c"/><circle cx="2.3" cy="2.2" r=".28" fill="#c98a86" opacity=".9"/>
  </pattern>
  <pattern id="${ID}-back" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#eef1e8"/>
    <rect width="3" height="3" fill="url(#${ID}-print)" opacity=".2"/>
  </pattern>
  <pattern id="${ID}-tape" width="2" height="2" patternUnits="userSpaceOnUse">
    <rect width="2" height="2" fill="#6f8a8c"/><path d="M0 1H2" stroke="#5f7779" stroke-width=".2"/>
  </pattern>
  <pattern id="${ID}-teeth" width=".6" height=".8" patternUnits="userSpaceOnUse">
    <rect width=".6" height=".8" fill="#4d6264"/><rect x=".08" width=".3" height=".8" fill="#e8ecea"/>
  </pattern>
  <linearGradient id="${ID}-metal" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ece6da"/><stop offset="1" stop-color="#8f897f"/>
  </linearGradient>
  <linearGradient id="${ID}-pull" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e8e2d8"/><stop offset="1" stop-color="#9a948c"/>
  </linearGradient>
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

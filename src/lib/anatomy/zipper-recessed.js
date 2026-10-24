/*
  Recessed zipper at the top of a bag — the figure of the third section (`recessed`) of the guide "How to sew a zipper"
  (/guides/sew-a-zipper#recessed; Vault «Гайды — Молния (спецификация)», 3 row 3 and 5.3 «Раздел 3 — вставка по верху
  сумки»). A public technique, no maker's project: what the sources agree on, in our own drawing. Four strips as long as
  the top edge of the bag, two for each side of the zipper; each zipper tape between two strips, right sides inward, and
  stitched; the strips turned away from the zipper, pressed away from the teeth and topstitched close to them; the other
  side the same way; the ends closed with tabs (section 2, `tabs`: the page links to #tabs); the panel sewn to the LINING,
  middles matched; then the outer and the lining are joined as usual. In the bag the zipper sits below the edge and the
  bag opens wide.

  NO numbers (spec 3, «Разделы 2–6 — без цифр»): strip width, allowances and how much longer the zipper is differ from
  source to source, so they are said in words. `SPEC` is empty; `DRAWING` holds the drawing's own proportions (not
  measurements — never shown), so the tests can check the relations. Words (titles, captions, instructions, chips,
  legend) are NOT here: zipper-recessed.<lang>.js, picked through zipper-recessed.text.js.

  Step 0 is the finished bag: the zipper closed, the panel dipping from the top edge to the zipper below it. Tap: the
  pull slides along, the zipper opens and the two halves of the panel drop against the walls — the bag opens wide.
  Steps 1–8 are flat work on the table (x → right-down along the zipper, y → left-down across it); step 9 puts the bag
  together (a crossfade to the finished bag). Shared parts (camera, inset, machine, renderer) live in kit.js. SVG ids
  carry the figure's prefix ('zipper-recessed-…'), so it never collides with the other figures of the same page.
*/
import { at, turn } from './iso.js';
import { labelKeys, makeRenderer, rect, rot2, span } from './kit.js';

const ID = 'zipper-recessed'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {}; // no maker's numbers in this section

/* ---------- The drawing's proportions (not measurements: never labelled, never written) ---------- */

const PL = 16; // a strip's length = the top edge of the bag
const SW = 3.2; // a strip's width (the wider the strips, the lower the zipper sits)
const ZW = 2.4; // the zipper's width: two tapes and the teeth
const C = ZW / 2;
const TW = 0.7; // the teeth band
const EXT = 1.6; // the zipper past each end of the strips: "a little longer"
const E = 0.9; // bare tape at each end of the zipper, past its stop
const SS = 0.3; // a stop, along the zipper
const T = 0.16; // fabric thickness in the drawing
const SEAM = 0.15; // the seam joining a tape and its two strips, from their edge (hidden once turned)
const TOP = 0.3; // the topstitch on the top strip, from its edge by the zipper: "close to the teeth"
const LM = 0.9; // the lining piece past each end of the panel (its side seam allowances)
const LH = 5; // as much of the lining piece as the drawing shows
const GAP = 0.15; // a tab's folded edges lie this far past the stop
const ES = 0.18; // a tab's stitch, this close to its folded edges
const OV = 0.25; // a tab sticks out this far past each edge of the zipper

const STOP_L = [-EXT + E, -EXT + E + SS];
const STOP_R = [PL + EXT - E - SS, PL + EXT - E];
const TEETH = [STOP_L[1], STOP_R[0]];
const OPEN = { left: STOP_L[0] - GAP, right: STOP_R[1] + GAP }; // each tab's folded edges
const A = OPEN.left + EXT + 0.1; // a folded tab, along the zipper: from its folded edges to just past the cut end
const STITCH = { left: OPEN.left - ES, right: OPEN.right + ES };
const LY = ZW + 2 * OV; // a tab across the zipper

/* The finished bag (step 0, step 9): as wide as the strips are long, the panel's two halves from the top edge down. */
const W = PL, D = 8, H = 8;
const Y0 = -C - D / 2; // the bag's back wall: the zipper's middle line (y = −C) runs down the middle of the bag
const HL = SW + C; // one half of the panel, from the top edge to the middle of the zipper
const SLOPE = Math.acos(D / 2 / HL); // closed: how steeply each half dips to the zipper (it is a little wider than half the bag)

/** The drawing's relations, for the tests (tests/guides/sew-a-zipper.test.js). */
export const DRAWING = { strip: PL, width: SW, zipper: PL + 2 * EXT, tape: ZW, stops: [STOP_L, STOP_R], depth: D, height: H };

const X = [1, 0, 0];
const F = (name) => `url(#${ID}-${name})`;
const PRINT = F('print'), BACK = F('back'); // the outer and the panel: right side · wrong side
const LIN = F('lining'), LIN_BACK = F('liningBack');
const TAPE = F('tape'), TEETH_FILL = F('teeth'), METAL = F('metal'), PULL = F('pull');

/** A flat piece on the table (x → right-down, y → left-down), right side up (`up`) or down. */
const table = (id, pts, z, fill, inner, up = true, extra = {}) =>
  ({ id, pts, O: [0, 0, z], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, up ? 1 : -1], fill, inner, ...extra });

/** Only what can be seen: a piece faded to nothing is dropped, not drawn at opacity ~0. */
const seen = (ps) => ps.filter((p) => (p.opacity ?? 1) > 0.01);
const fade = (ps, o) => ps.map((p) => ({ ...p, opacity: (p.opacity ?? 1) * o }));
const lift = (ps, dz) => ps.map((p) => ({ ...p, O: [p.O[0], p.O[1], p.O[2] + dz] }));
const band = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/* ---------- The zipper, flat (steps 1–8): face up at z = T, tape a by the strips of side a (y −C…0), tape b (−ZW…−C) ---------- */

/** The pull, round its own origin (on the teeth): a body, and its tab toward the middle of the zipper. */
const PULL_PTS = [[-0.6, -0.5], [-0.6, 0.5], [1.2, 0.75], [1.2, 0.32], [2.6, 0.28], [2.6, -0.28], [1.2, -0.32], [1.2, -0.75]];

function zipperFlat() {
  const z = (id, pts, fill, extra = {}) => table(id, pts, T, fill, fill, true, extra);
  return [
    z('zip-tape-a', band(-EXT, PL + EXT, -C, 0), TAPE),
    z('zip-tape-b', band(-EXT, PL + EXT, -ZW, -C), TAPE),
    z('zip-teeth', band(TEETH[0], TEETH[1], -C - TW / 2, -C + TW / 2), TEETH_FILL),
    z('zip-stop-left', band(STOP_L[0], STOP_L[1], -C - TW / 2 - 0.08, -C + TW / 2 + 0.08), METAL),
    z('zip-stop-right', band(STOP_R[0], STOP_R[1], -C - TW / 2 - 0.08, -C + TW / 2 + 0.08), METAL),
    z('zip-pull', PULL_PTS, PULL, { O: [TEETH[0] + 0.8, -C, T + 0.04] }),
  ];
}

/*
  The zipper turned about its edge (the line y = 0 at z = T) by angle a: 0 = face up beside the strips (y < 0), −π = face
  down on strip a1 (y > 0), its tape a's edge on the strip's edge. In between it swings up and over (never through the
  table).
*/
const zipperAt = (a) => (Math.abs(a) < 1e-9 ? zipperFlat() : zipperFlat().map((p) => turn(p, [0, 0, T], X, a)));

/* ---------- The strips ---------- */

/** A strip right side up on the table, its near edge at y0 (it runs along the zipper, x 0…PL). */
const strip = (id, y0, z = 0, extra = {}) => table(id, rect(PL, SW), z, PRINT, BACK, true, { O: [0, y0, z], ...extra });
/** A strip right side down (wrong side up). */
const stripDown = (id, y0, z = 0, extra = {}) => table(id, rect(PL, SW), z, PRINT, BACK, false, { O: [0, y0, z], ...extra });

/** The topstitch on a top strip: along its edge by the zipper (v = TOP for side a, SW − TOP for side c). */
const topstitch = (v) => [{ pts: [[0.15, v], [PL - 0.15, v]], kind: 'stitch' }];

/*
  Side a's second strip (a2) as the zipper turns out: `s1` 0…1 — it swings over with the zipper (about the same edge,
  staying on top of it, so it ends face up under the zipper, y < 0); `s2` 0…1 — it folds back under strip a1 (about the
  edge, below it): wrong sides together, the right side down. Its seam (`sewn`) is on its edge by the zipper.
*/
function stripA2(s1, s2, sewn) {
  const base = table('strip-a2', rect(PL, SW), 0, PRINT, BACK, true, { O: [0, -SW, 0], lines: sewn ? [{ pts: [[0.15, SW - SEAM], [PL - 0.15, SW - SEAM]], kind: 'stitch' }] : [] });
  let p = s1 < 1 - 1e-9 ? turn(base, [0, 0, T], X, -Math.PI * (1 - s1)) : base;
  if (s2 > 1e-9) p = turn(p, [0, 0, -T / 2], X, Math.PI * s2);
  return p;
}

/** The finished panel, flat: side a's strips (a2 under a1), the zipper face up, side c's strips; `topA`/`topC` — topstitched. */
function panelFlat({ topA = true, topC = true, cIn = 1, cDrop = 0 } = {}) {
  const a2 = stripDown('strip-a2', 0, -T);
  const a1 = strip('strip-a1', 0, 0, { lines: topA ? topstitch(TOP) : [] });
  const yc = -ZW - SW - (1 - cIn) * 4;
  const c2 = stripDown('strip-c2', yc, -T + cDrop);
  const c1 = strip('strip-c1', yc, cDrop, { lines: topC ? topstitch(SW - TOP) : [] });
  return { under: [a2, c2], top: [a1, c1] };
}

/* ---------- The END VIEW of steps 2–4: side a in section (across the zipper), layers drawn apart ---------- */

function sandwichInset(zipA, s1, s2, show = { a2: 1 }) {
  const L = 0.4;
  const segs = [];
  const p = (a, b) => segs.push({ a, b });
  p([0, 0], [SW, 0]); // a1, right side up
  const zr = (q) => rot2(q, [0, L], zipA);
  p(zr([-ZW, L]), zr([0, L])); // the zipper (its teeth at −C)
  p(zr([-C, L + 0.25]), zr([-C, L - 0.25])); // the teeth, a tick across the zipper
  if (show.a2) {
    const r1 = (q) => rot2(q, [0, L], -Math.PI * (1 - s1));
    const r2 = (q) => (s2 > 1e-9 ? rot2(r1(q), [0, -L / 2], Math.PI * s2) : r1(q));
    p(r2([-SW, 0]), r2([0, 0])); // a2
  }
  return { segs, range: [-ZW - 0.8, SW + 0.8] };
}

/* ---------- Steps ---------- */

/* Step 1: four strips as long as the top edge of the bag, and a zipper a little longer than them. */
function stepCut(t) {
  const come = span(t, 0.06, 0.3);
  const drop = (1 - come) * 5;
  const strips = [
    strip('strip-a1', 0.5, drop, { opacity: come }),
    strip('strip-a2', 1 + SW, drop, { opacity: come }),
    strip('strip-c1', -ZW - 0.5 - SW, drop, { opacity: come }),
    strip('strip-c2', -ZW - 1 - 2 * SW, drop, { opacity: come }),
  ];
  const zin = span(t, 0.5, 0.66);
  return {
    pieces: seen([...strips, ...fade(lift(zipperFlat(), (1 - zin) * 5), zin)]),
    over: [
      { type: 'label', p: [PL / 2, 1 + 1.5 * SW, 0], label: 'fourStrips', o: span(t, 0.18, 0.24) * (1 - span(t, 0.36, 0.4)), hot: true },
      { type: 'dim', a: [0, 1.6 + 2 * SW, 0], b: [PL, 1.6 + 2 * SW, 0], label: 'topLength', o: span(t, 0.38, 0.44), hot: true },
      { type: 'label', p: [PL + EXT, -C, T], label: 'zipperLonger', o: span(t, 0.66, 0.72), dx: -6, dy: 10, hot: true },
    ],
  };
}

/* Step 2: strip a1 right side up, the zipper face down on it (edge on edge), strip a2 face down on top: right sides inward. */
function stepSandwich(t) {
  const flip = span(t, 0.14, 0.42);
  const zipA = -Math.PI * flip;
  const a2in = span(t, 0.52, 0.72);
  const a1 = strip('strip-a1', 0);
  const a2 = { ...stripA2(0, 0, false), opacity: a2in };
  a2.O = [a2.O[0], a2.O[1], a2.O[2] + (1 - a2in) * 5];
  return {
    pieces: seen([a1, ...zipperAt(zipA), a2]),
    over: [
      { type: 'label', p: [PL * 0.3, SW / 2, 0], label: 'stripUp', o: span(t, 0.02, 0.08) * (1 - span(t, 0.12, 0.16)), hot: true },
      { type: 'label', p: [PL * 0.5, C, 2 * T], label: 'zipperDown', o: span(t, 0.36, 0.42) * (1 - span(t, 0.5, 0.54)), dy: -9, hot: true },
      { type: 'label', p: [PL * 0.5, SW / 2, 3 * T], label: 'stripDown', o: span(t, 0.66, 0.72), dy: -9, hot: true },
    ],
    inset: sandwichInset(zipA, 0, 0, { a2: a2in > 0.01 ? 1 : 0 }),
  };
}

/* Step 3: one seam along the edge, through the strip, the zipper tape and the other strip — with the zipper foot. */
function stepSewA(t) {
  const sew = span(t, 0.2, 0.82);
  const done = t > 0.82;
  const ghost = 1 - 0.45 * span(t, 0.04, 0.14);
  return {
    pieces: [strip('strip-a1', 0), ...zipperAt(-Math.PI), { ...stripA2(0, 0, done), opacity: ghost }],
    over: [
      { type: 'line', pts: [[0, SEAM, 3 * T], [PL, SEAM, 3 * T]], t: sew, kind: 'hot', o: 1 - span(t, 0.84, 0.9) },
      { type: 'label', p: [PL, SEAM, 3 * T], label: 'alongEdge', o: span(t, 0.08, 0.14), dx: -12, dy: -8, hot: true },
    ],
  };
}

/* Step 4: turned out — the zipper and the strips away from each other, the strips wrong sides together; pressed away from the teeth. */
function stepTurn(t) {
  const s1 = span(t, 0.08, 0.4), s2 = span(t, 0.44, 0.7);
  const zipA = -Math.PI * (1 - s1);
  const a1 = strip('strip-a1', 0);
  const a2 = stripA2(s1, s2, true);
  const zip = zipperAt(zipA);
  const pieces = s2 > 0.5 ? [a2, a1, ...zip] : s1 < 0.5 ? [a1, ...zip, a2] : [a1, a2, ...zip];
  return {
    pieces,
    over: [
      { type: 'label', p: [PL * 0.5, 0, 2 * T], label: 'turnOut', o: span(t, 0.08, 0.14) * (1 - span(t, 0.7, 0.74)), dy: -10, hot: true },
      { type: 'label', p: [PL * 0.6, SW * 0.55, 0], label: 'pressAway', o: span(t, 0.78, 0.84), dy: -6 },
    ],
    inset: sandwichInset(zipA, s1, s2),
  };
}

/* Step 5: topstitched on strip a1, close to the teeth, with the zipper foot. */
function stepTopA(t) {
  const sew = span(t, 0.22, 0.8);
  const done = t > 0.8;
  const { under, top } = panelFlat({ topA: done, cIn: 0 });
  return {
    pieces: [under[0], top[0], ...zipperFlat()],
    over: [
      { type: 'line', pts: [[0.15, TOP, 0.01], [PL - 0.15, TOP, 0.01]], t: sew, kind: 'hot', o: 1 - span(t, 0.82, 0.88) },
      { type: 'label', p: [PL * 0.6, TOP, 0], label: 'nearTeeth', o: span(t, 0.08, 0.14), dy: 9, hot: true },
    ],
  };
}

/* Step 6: the other side the same way: strips c1 and c2 on tape b, stitched, turned out, topstitched close to the teeth. */
function stepSideC(t) {
  const cIn = span(t, 0.06, 0.34);
  const sew = span(t, 0.46, 0.84);
  const done = t > 0.84;
  const { under, top } = panelFlat({ topC: done, cIn, cDrop: (1 - cIn) * 2 });
  const fadeC = (p) => (/c\d$/.test(p.id) ? { ...p, opacity: cIn } : p);
  return {
    pieces: seen([...under, ...top].map(fadeC).concat(zipperFlat())),
    over: [
      { type: 'line', pts: [[0.15, -ZW - TOP, 0.01], [PL - 0.15, -ZW - TOP, 0.01]], t: sew, kind: 'hot', o: span(t, 0.42, 0.46) * (1 - span(t, 0.86, 0.92)) },
      { type: 'label', p: [PL * 0.4, -ZW - SW / 2, 0], label: 'otherSide', o: span(t, 0.1, 0.16) * (1 - span(t, 0.4, 0.44)), hot: true },
      { type: 'label', p: [PL * 0.6, -ZW - TOP, 0], label: 'nearTeeth', o: span(t, 0.46, 0.52), dy: 9, hot: true },
    ],
  };
}

/* ---------- The ends: a tab on each end of the zipper, past the strips (section 2) ---------- */

/*
  The tab at `end` ('left' | 'right'): folded like bias tape, its folded edges just past the stop (OPEN[end] + dx), its
  fold past the zipper's cut end; the bottom layer under the zipper, the top over it. → { under, over } (painter's order).
*/
function tab(end, { dx = 0, dz = 0, sewn = false } = {}) {
  const right = end === 'right';
  const x0 = right ? OPEN.right + dx : OPEN.left + dx - A;
  const xf = right ? x0 + A : x0;
  const u = right ? ES : A - ES;
  const zb = dz, zt = 2 * T + dz; // under the zipper (it lies at z = T) … over it
  const lines = sewn ? [{ pts: [[u, 0.1], [u, LY - 0.1]], kind: 'stitch' }] : [];
  const bottom = table(`tab-${end}-bottom`, rect(A, LY), zb, PRINT, BACK, false, { O: [x0, -ZW - OV, zb] });
  const top = table(`tab-${end}-top`, rect(A, LY), zt, PRINT, BACK, true, { O: [x0, -ZW - OV, zt], lines });
  const fold = { id: `tab-${end}-fold`, pts: rect(LY, zt - zb), O: [xf, -ZW - OV, zb], U: [0, 1, 0], V: [0, 0, 1], out: [right ? 1 : -1, 0, 0], fill: PRINT, inner: BACK };
  return { under: right ? [bottom] : [fold, bottom], over: right ? [top, fold] : [top] };
}

/* Step 7: the ends closed with tabs, as in the second way — stitched just past each stop, never over it. */
function stepEnds(t) {
  const mv = span(t, 0.06, 0.36);
  const sew = span(t, 0.44, 0.8);
  const done = t > 0.8;
  const tl = tab('left', { dx: -(1 - mv) * 3, dz: (1 - mv) * 1.2, sewn: done });
  const tr = tab('right', { dx: (1 - mv) * 3, dz: (1 - mv) * 1.2, sewn: done });
  const { under, top } = panelFlat();
  const lineAt = (x) => [[x, -ZW - OV + 0.1, 2 * T + 0.01], [x, OV - 0.1, 2 * T + 0.01]];
  return {
    pieces: [...under, ...top, ...tl.under, ...tr.under, ...zipperFlat(), ...tl.over, ...tr.over],
    over: [
      { type: 'line', pts: lineAt(STITCH.left), t: sew, kind: 'hot', o: span(t, 0.4, 0.44) * (1 - span(t, 0.82, 0.88)) },
      { type: 'line', pts: lineAt(STITCH.right), t: sew, kind: 'hot', o: span(t, 0.4, 0.44) * (1 - span(t, 0.82, 0.88)) },
      { type: 'label', p: [PL / 2, -C, T], label: 'endsTabs', o: span(t, 0.08, 0.14) * (1 - span(t, 0.38, 0.42)), dy: 10, hot: true },
      { type: 'label', p: [(STOP_R[0] + STOP_R[1]) / 2, -C, T], label: 'notOverStop', o: span(t, 0.46, 0.52), dx: -6, dy: 12, hot: true },
    ],
    focus: { pts: [[PL - 3, -ZW - 1.4, 0], [PL + EXT + 1.4, -ZW - 1.4, 0], [PL - 3, 1.4, 0], [PL + EXT + 1.4, 1.4, 0]], k: 0.6 * span(t, 0.38, 0.46) * (1 - span(t, 0.86, 0.94)) },
  };
}

/* ---------- Step 8: the panel to the LINING (not the outer), middles matched ---------- */

const LIN_FRONT_Y = SW; // the front lining piece's top edge: on side a's strips' far edge
const LIN_BACK_Y = -ZW - SW; // the back lining piece's top edge: on side c's strips' far edge
const MID = PL / 2;

/** The two lining pieces, right side up, their top edges on the panel's edges (`dy` — still sliding in). */
function linings({ dy = 0, o = 1, sewnF = false, sewnB = false } = {}) {
  const wide = PL + 2 * LM;
  const front = table('lining-front', rect(wide, LH), 0, LIN, LIN_BACK, true, {
    O: [-LM, LIN_FRONT_Y + dy, 0], opacity: o,
    lines: sewnF ? [{ pts: [[LM, 0.15], [LM + PL, 0.15]], kind: 'stitch' }] : [],
  });
  const back = table('lining-back', rect(wide, LH), 0, LIN, LIN_BACK, true, {
    O: [-LM, LIN_BACK_Y - LH - dy, 0], opacity: o,
    lines: sewnB ? [{ pts: [[LM, LH - 0.15], [LM + PL, LH - 0.15]], kind: 'stitch' }] : [],
  });
  return [front, back];
}

/** The finished flat panel with its tabs (steps 8–9). */
function panelWithTabs() {
  const { under, top } = panelFlat();
  const tl = tab('left', { sewn: true }), tr = tab('right', { sewn: true });
  return [...under, ...top, ...tl.under, ...tr.under, ...zipperFlat(), ...tl.over, ...tr.over];
}

function stepLining(t) {
  const come = span(t, 0.04, 0.28);
  const seamF = span(t, 0.5, 0.68), seamB = span(t, 0.72, 0.9);
  const mark = (y) => [[MID, y - 0.6, 0.02], [MID, y + 0.6, 0.02]];
  return {
    pieces: seen([...linings({ dy: (1 - come) * 4, o: come, sewnF: t > 0.68, sewnB: t > 0.9 }), ...panelWithTabs()]),
    over: [
      { type: 'line', pts: mark(LIN_FRONT_Y), kind: 'hot', o: span(t, 0.3, 0.36) * (1 - span(t, 0.92, 0.98)) },
      { type: 'line', pts: mark(LIN_BACK_Y), kind: 'hot', o: span(t, 0.3, 0.36) * (1 - span(t, 0.92, 0.98)) },
      { type: 'line', pts: [[0, LIN_FRONT_Y, 0.02], [PL, LIN_FRONT_Y, 0.02]], t: seamF, kind: 'hot', o: span(t, 0.46, 0.5) * (1 - span(t, 0.7, 0.74)) },
      { type: 'line', pts: [[0, LIN_BACK_Y, 0.02], [PL, LIN_BACK_Y, 0.02]], t: seamB, kind: 'hot', o: span(t, 0.68, 0.72) * (1 - span(t, 0.92, 0.96)) },
      { type: 'label', p: [MID, LIN_FRONT_Y + LH * 0.6, 0], label: 'toLining', o: span(t, 0.12, 0.18), hot: true },
      { type: 'label', p: [MID, LIN_BACK_Y, 0], label: 'middles', o: span(t, 0.34, 0.4) * (1 - span(t, 0.62, 0.66)), dx: 18, dy: 9, hot: true },
    ],
    // closer on the panel and the two lining pieces where they end up
    focus: { pts: [[-LM, LIN_BACK_Y - LH, 0], [PL + EXT + 0.4, LIN_BACK_Y - LH, 0], [-LM, LIN_FRONT_Y + LH, 0], [PL + EXT + 0.4, LIN_FRONT_Y + LH, 0]], k: 0.6 },
  };
}

/* ---------- The finished bag: the outer with the lining inside (one shell), the panel's two halves from its top edge ---------- */

/*
  One half of the panel ('back' from the back wall's top edge, 'front' from the front wall's), at angle `ang` below the
  horizontal (SLOPE: closed, the halves meet at the zipper; π/2: open, hanging down along the wall). In its own frame,
  u along the top edge, v from the top edge down to the zipper: the strip (v 0…SW), the tape (SW…HL), the teeth by the
  middle. The right side of the panel faces up (out of the bag).
*/
function half(side, ang) {
  const back = side === 'back';
  const c = Math.cos(ang), s = Math.sin(ang);
  const V = back ? [0, c, -s] : [0, -c, -s];
  const out = back ? [0, s, c] : [0, -s, c];
  const O = [0, back ? Y0 : Y0 + D, H];
  const piece = (id, pts, fill, extra = {}) => ({ id: `panel-${side}-${id}`, pts, O, U: [1, 0, 0], V, out, fill, inner: fill, ...extra });
  return [
    piece('strip', band(0, W, 0, SW), PRINT, { inner: BACK, lines: topstitch(SW - TOP) }),
    piece('tape', band(0, W, SW, HL), TAPE),
    piece('teeth', band(0.3, W - 0.3, HL - TW / 2, HL), TEETH_FILL),
  ];
}

/** The pull on the back half's teeth, `pos` along the zipper (0 = by the right end, closed … 1 = by the left, open). */
function pullOn(ang, pos) {
  const c = Math.cos(ang), s = Math.sin(ang);
  const V = [0, c, -s], out = [0, s, c];
  const p0 = at({ O: [0, Y0, H], U: [1, 0, 0], V }, W - 1.2 - (W - 3.2) * pos, HL);
  const O = [p0[0] + out[0] * 0.06, p0[1] + out[1] * 0.06, p0[2] + out[2] * 0.06];
  return { id: 'zip-pull', pts: PULL_PTS.map(([u, v]) => [-u, v]), O, U: [1, 0, 0], V, out, fill: PULL, inner: PULL };
}

/** The bag's walls: the outer outside, the lining inside (one shell; the lining's own pieces are joined to it). */
const walls = () => {
  const lit = (id, pts, O, U, V, out) => ({ id: `bag-${id}`, pts, O, U, V, out, fill: PRINT, inner: LIN });
  return {
    far: [
      lit('bottom', rect(W, D), [0, Y0, 0], [1, 0, 0], [0, 1, 0], [0, 0, -1]),
      lit('back', rect(W, H), [0, Y0, 0], [1, 0, 0], [0, 0, 1], [0, -1, 0]),
      lit('left', rect(D, H), [0, Y0, 0], [0, 1, 0], [0, 0, 1], [-1, 0, 0]),
    ],
    near: [
      lit('right', rect(D, H), [W, Y0, 0], [0, 1, 0], [0, 0, 1], [1, 0, 0]),
      lit('front', rect(W, H), [0, Y0 + D, 0], [1, 0, 0], [0, 0, 1], [0, 1, 0]),
    ],
  };
};

/** The finished bag; e = 0 the zipper closed (the first frame) … 1 opened, the halves dropped against the walls. */
function bag(e = 0, o = 1) {
  const pull = span(e, 0.05, 0.5);
  const ang = SLOPE + (Math.PI / 2 - SLOPE) * span(e, 0.45, 0.95);
  const { far, near } = walls();
  const ps = [...far, ...half('back', ang), ...half('front', ang), pullOn(ang, pull), ...near];
  return o >= 0.999 ? ps : fade(ps, o);
}

/** The END VIEW of step 9: the top of the bag in section (across it), the panel dipping to the zipper, or hanging open. */
function bagInset(e) {
  const ang = SLOPE + (Math.PI / 2 - SLOPE) * span(e, 0.45, 0.95);
  const top = 3; // the top part of the walls (the rest is the bag below)
  const segs = [];
  const p = (a, b) => segs.push({ a, b });
  p([0, top - 2.8], [0, top]); // the back wall
  p([D, top - 2.8], [D, top]); // the front wall
  const c = Math.cos(ang), s = Math.sin(ang);
  p([0, top], [HL * c, top - HL * s]); // the back half
  p([D, top], [D - HL * c, top - HL * s]); // the front half
  return { segs, range: [-1.2, D + 1.2] };
}

/* Step 9: then the outer and the lining are joined as usual: the bag — the zipper below the edge; it opens wide. */
function stepBag(t) {
  const flat = 1 - span(t, 0.06, 0.28);
  const show = span(t, 0.18, 0.38);
  const e = span(t, 0.62, 0.86);
  const flatPieces = flat > 0.01 ? fade([...linings({ sewnF: true, sewnB: true }), ...panelWithTabs()], flat) : [];
  return {
    pieces: seen([...flatPieces, ...(show > 0.01 ? bag(e, show) : [])]),
    over: [
      { type: 'label', p: [W / 2, Y0 + D, H * 0.45], label: 'asUsual', o: span(t, 0.3, 0.36) * (1 - span(t, 0.5, 0.54)), hot: true },
      { type: 'label', p: [W * 0.55, Y0 + D / 2, H - HL * Math.sin(SLOPE)], label: 'belowEdge', o: span(t, 0.46, 0.52) * (1 - span(t, 0.6, 0.64)), dy: -9, hot: true },
      { type: 'label', p: [W / 2, Y0 + D, H * 0.45], label: 'opensWide', o: span(t, 0.86, 0.92), hot: true },
    ],
    inset: bagInset(e),
    focus: { pts: bagCorners(), k: span(t, 0.24, 0.4) },
  };
}

const bagCorners = () => [[0, Y0, 0], [W, Y0, 0], [0, Y0 + D, 0], [W, Y0 + D, 0], [0, Y0, H], [W, Y0, H], [0, Y0 + D, H], [W, Y0 + D, H]];

/* ---------- Step 0: the finished bag — the zipper closed (e = 0, the first frame) or open (e = 1) ---------- */

export function anatomy(e = 0) {
  return { pieces: bag(e), over: [] };
}

/** Numbered pins for the legend, on the closed bag (shown at rest): panel, zipper, lining, outer. */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  return [
    { n: 1, p: at(byId['panel-back-strip'], W * 0.3, SW * 0.45) },
    { n: 2, p: at(byId['panel-back-teeth'], W * 0.62, HL - TW / 4) },
    { n: 3, p: [0, Y0 + D / 2, H - 0.45] },
    { n: 4, p: at(byId['bag-front'], W * 0.55, H * 0.45) },
  ];
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption, written instruction, the chips drawn in the
  scenes, the legend) lives in zipper-recessed.<lang>.js, index-aligned with this array; zipper-recessed.text.js checks
  that. `scene` draws the step over t = 0…1, `duration` is its animation in seconds, `stitch` — the machine stitch (a key
  of `stitches` in the texts), `sew` — when and on which fabric the seam is sewn ('panel': next to the zipper, with the
  zipper foot; 'lining': the panel to the lining). `uses` — catalog products handy in that step (ids from
  src/data/products.js, shown as labelled affiliate links under the caption): the zipper by the yard (a general
  recommendation, not the maker's), scissors, clips, the iron, the zipper foot (Windman set) and the machine.
*/
const FOOT = ['windman-presser-feet-set', 'janome-1522rd'];
export const STEPS = [
  {}, // 0: the finished bag (texts: zipper-recessed.<lang>.js)
  { scene: stepCut, duration: 5.5, uses: ['mebuzip-zipper-by-the-yard', 'tailor-scissors'] },
  { scene: stepSandwich, duration: 6, uses: ['soraco-sewing-clips'] },
  { scene: stepSewA, duration: 5.5, stitch: 'straight', sew: [[0.2, 0.82, 'panel']], uses: FOOT },
  { scene: stepTurn, duration: 6.5, pad: 0.14, uses: ['rowenta-travel-iron'] },
  { scene: stepTopA, duration: 5.5, stitch: 'straight', sew: [[0.22, 0.8, 'panel']], uses: FOOT },
  { scene: stepSideC, duration: 7, stitch: 'straight', sew: [[0.46, 0.84, 'panel']], uses: FOOT },
  { scene: stepEnds, duration: 7, stitch: 'straight', sew: [[0.44, 0.8, 'panel']], uses: FOOT },
  { scene: stepLining, duration: 8, stitch: 'straight', sew: [[0.5, 0.68, 'lining'], [0.72, 0.9, 'lining']], uses: ['soraco-sewing-clips', 'janome-1522rd'] },
  { scene: stepBag, duration: 8 },
];

/** Every chip key the drawing uses — each language must have them all (zipper-recessed.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far it is opened) → { body, viewBox }. L = the texts (zipper-recessed.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  floorAt: (k) => (k === 0 ? [W / 2, Y0 + D / 2, 0] : null),
  shadow: [12, 4.5],
  fabrics: { panel: '#e7c9b4', lining: '#9caf88' },
  pinsAt: 0, // the pins are on the closed bag: already in the first frame
});

/** Fabric patterns (ids prefixed with the figure's ID), in each piece's own coordinates. */
export const DEFS = `
<defs>
  <pattern id="${ID}-print" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#efe0cf"/>
    <circle cx="1" cy="1" r=".45" fill="#c98a86"/><circle cx="3" cy="3" r=".3" fill="#a86f6c" opacity=".8"/>
  </pattern>
  <pattern id="${ID}-back" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="4" fill="#f6ede4"/>
    <rect width="4" height="4" fill="url(#${ID}-print)" opacity=".18"/>
  </pattern>
  <pattern id="${ID}-lining" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#9caf88"/><path d="M0 3L3 0" stroke="#8a9d77" stroke-width=".3"/>
  </pattern>
  <pattern id="${ID}-liningBack" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#c9d4bd"/>
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

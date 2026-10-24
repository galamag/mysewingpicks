/*
  Centered zipper — the figure of the fourth section (`centered`) of the guide "How to sew a zipper"
  (/guides/sew-a-zipper#centered; Vault «Гайды — Молния (спецификация)», 3 row 4 and 5.3 «Раздел 4 — центральная
  молния»). A public technique, no maker's project: what the sources agree on, in our own drawing. A PIECE OF THE SEAM,
  not a garment (spec 4): two pieces of fabric right sides together; the seam sewn up to the mark at the zipper's bottom
  stop, with a backstitch; the opening above it basted with the longest stitch; the seam pressed open; the zipper face
  down on the seam allowances, its teeth right on the seam line, pinned to the allowances only; from the right side,
  with the zipper foot, stitched across the bottom below the stop and along each side — both sides in the SAME
  direction (which direction differs between the sources, so the texts never say it; the drawing has to pick one); the
  pull moved out of the way with the needle down and the foot up; the basting unpicked, so the two folded edges meet
  over the teeth.

  NO numbers (spec 3, 3.1): the stitching's distance from the seam line, the stitch length and so on are said in words
  (the sources' 6 mm is not given). `SPEC` is empty; `DRAWING` holds the drawing's own proportions (not measurements —
  never shown), so the tests can check the relations. Words (titles, captions, instructions, chips, legend) are NOT here:
  zipper-centered.<lang>.js, picked through zipper-centered.text.js.

  Frames (x → right-down along the seam, x = 0 the top edge; y → left-down across it; z up):
    S — the stack (steps 1–3): piece B right side up, piece A right side down on it; the seam line at y = 0, the seam
        allowances on the −y side;
    W — wrong side up, the seam pressed open (steps 4–5): the bodies at z = 0, the allowances folded back on them at
        z = T (right side up), the zipper face down on the allowances at z = 2T; every fabric piece's own (u, v) is then
        (x, |y|) on its side;
    R — right side up (steps 6–9 and step 0): W turned over about the seam line (y = 0, z = T).
  Step 0 is the finished seam, right side up: the folds meet over the teeth, the stitching along both sides and across
  the bottom. Tap: the fabric goes see-through, so the zipper under it and its stitching show. Shared parts (camera,
  inset, machine, renderer) live in kit.js. SVG ids carry the figure's prefix ('zipper-centered-…'), so it never
  collides with the other figures of the same page.
*/
import { at, turn } from './iso.js';
import { labelKeys, makeRenderer, rect, span } from './kit.js';

const ID = 'zipper-centered'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {}; // no maker's numbers in this section

/* ---------- The drawing's proportions (not measurements: never labelled, never written) ---------- */

const L = 15; // the piece of the seam, along it (x = 0: the top edge)
const OL = 9; // the opening for the zipper: x 0…OL; the mark (the zipper's bottom stop) at OL
const PW = 3; // each piece, across the seam (as much as the drawing shows)
const SA = 1.5; // a seam allowance
const T = 0.1; // fabric thickness in the drawing
const ZW = 2.2; // the zipper's width: two tapes and the teeth
const C = ZW / 2;
const TW = 0.55; // the teeth band
const ZX = [0.15, OL + 0.9]; // the zipper, along the seam: its top just below the top edge, its tape past the bottom stop
const SS = 0.3; // a stop, along the zipper
const STOP_TOP = [0.45, 0.45 + SS];
const STOP_BOT = [OL - SS, OL]; // the bottom stop, on the mark
const TEETH = [STOP_TOP[1], STOP_BOT[0]];
const DS = 0.8; // the stitching, this far from the seam line on each side ("the same distance from the seam line")
const XB = OL + 0.35; // the stitching across the bottom: below the bottom stop, never over it
const XT = 0.25; // the stitching ends by the top edge
const XP = 4.6; // side one stops here: the pull is in the way
const GAP = 0.2; // the basting unpicked: each folded edge this far from the seam line (the teeth just show)
const LN = 0.06; // the seam and the basting, drawn this far from the fold
const PULL_AT = [STOP_TOP[1] + 0.45, 5.6]; // the pull (its origin): closed, by the top stops · moved out of the way

/** One side's stitching, in that side's own (x, |y|): across the bottom from the seam line, pivot, then along the side. */
const SIDE = [[XB, 0], [XB, DS], [XT, DS]];
const SIDE_TO_PULL = [[XB, 0], [XB, DS], [XP, DS]];

/** The drawing's relations, for the tests (tests/guides/sew-a-zipper.test.js). */
export const DRAWING = {
  length: L, opening: OL, allowance: SA, tape: C, teeth: TEETH, teethBand: TW, stops: [STOP_TOP, STOP_BOT],
  stitch: DS, across: XB, gap: GAP, side: SIDE,
};

const X = [1, 0, 0];
const F = (name) => `url(#${ID}-${name})`;
const PRINT = F('print'), BACK = F('back'); // the fabric: right side · wrong side
const TAPE = F('tape'), TEETH_FILL = F('teeth'), METAL = F('metal'), PULL = F('pull');

/** A flat piece on the table (x → right-down, y → left-down), right side up (`up`) or down. */
const table = (id, pts, z, fill, inner, up = true, extra = {}) =>
  ({ id, pts, O: [0, 0, z], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, up ? 1 : -1], fill, inner, ...extra });

/** Only what can be seen: a piece faded to nothing is dropped, not drawn at opacity ~0. */
const seen = (ps) => ps.filter((p) => (p.opacity ?? 1) > 0.01);
const fade = (ps, o) => (o >= 0.999 ? ps : ps.map((p) => ({ ...p, opacity: (p.opacity ?? 1) * o })));
const band = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
/** Rotate a piece about a line along x through (y, z). */
const rx = (p, y, z, a) => (Math.abs(a) < 1e-9 ? p : turn(p, [0, y, z], X, a));
/** World point of frame W → frame R (turned over about the seam line, y = 0, z = T). */
const toR = ([x, y, z]) => [x, -y, 2 * T - z];

/* ---------- The fabric: two pieces, each a body and its seam allowance (one fold at the seam line) ---------- */

/** A piece's outline in its own (u along the seam, v from the fold): with the opening's folded edge `g` from the seam line. */
const outline = (w, g) => (g > 1e-6 ? [[0, g], [OL, g], [OL, 0], [L, 0], [L, w], [0, w]] : rect(L, w));

/*
  The four fabric pieces in the stack (frame S), with what is sewn on them:
    mark   the mark across the seam line at the bottom stop (air-erasable, on the wrong side)
    seam   the seam below the mark (in the fold: seen only from the wrong side)
    baste  the basting over the opening: 0 none … 1 all of it (unpicking: less and less)
    sides  [A, B] — each side's final stitching (a path in its own (x, |y|), or null), seen on the right side
    g      the opening's folded edges, this far from the seam line (once the basting is out)
*/
function stack({ mark = false, seam = false, baste = 0, sides = [null, null], g = 0 } = {}) {
  const lines = (side) => [
    ...(mark ? [{ pts: [[OL, 0.02], [OL, 0.9]], kind: 'mark', side: 'in' }] : []),
    ...(seam ? [{ pts: [[OL, LN], [L - 0.05, LN]], kind: 'stitch', side: 'in' }] : []),
    ...(baste > 0.001 ? [{ pts: [[0.05, LN + g], [OL, LN + g]], t: baste, kind: 'fold', baste: true }] : []),
    ...(sides[side] ? [{ pts: sides[side], kind: 'stitch', side: 'out', topstitch: true }] : []),
  ];
  const piece = (id, w, O, V, up, ls) => ({ id, pts: outline(w, g), O, U: X, V, out: [0, 0, up ? 1 : -1], fill: PRINT, inner: BACK, lines: ls });
  return {
    Bb: piece('piece-b', PW, [0, 0, 0], [0, 1, 0], true, lines(1)),
    Ba: piece('allowance-b', SA, [0, 0, 0], [0, -1, 0], true, []),
    Ab: piece('piece-a', PW, [0, 0, T], [0, 1, 0], false, lines(0)),
    Aa: piece('allowance-a', SA, [0, 0, T], [0, -1, 0], false, lines(0).filter((l) => l.side !== 'out')),
  };
}

/*
  The fabric from the stack (S) to the pressed-open seam (W): `a` 0…1 — opened out (piece A over to the other side like a
  book, the allowances hanging under the seam); `b` 0…1 — turned over (wrong side up: the allowances stand up); `c` 0…1 —
  pressed open (each allowance down onto its own piece). → pieces in painter's order.
*/
function fabric(o = {}, a = 0, b = 0, c = 0) {
  const s = stack(o);
  let ab = rx(s.Ab, 0, T / 2, Math.PI * a);
  let aa = rx(s.Aa, 0, T / 2, (Math.PI / 2) * a);
  let ba = rx(s.Ba, 0, T / 2, (Math.PI / 2) * a);
  let bb = s.Bb;
  [ab, aa, ba, bb] = [ab, aa, ba, bb].map((p) => rx(p, 0, 0, Math.PI * b));
  if (c > 1e-9) {
    // each allowance swings down about its fold, and its fold settles on the seam line, on top of the pieces
    const press = (p, sign) => {
      const q = turn(p, p.O, X, -sign * (Math.PI / 2) * c);
      return { ...q, O: [q.O[0], q.O[1] * (1 - c), q.O[2] + (T - q.O[2]) * c] };
    };
    aa = press(aa, 1);
    ba = press(ba, -1);
  }
  if (b > 0.5) return [bb, ab, ba, aa]; // wrong side up: the allowances on top
  if (a > 0.02) return [ba, aa, bb, ab]; // opened: the allowances hang under the seam
  return [ba, bb, aa, ab]; // the stack
}

/* ---------- The zipper ---------- */

/** The pull, round its own origin (on the teeth): a body, and its tab along the teeth (narrow: it fits between the stitching). */
const PULL_PTS = [[-0.5, -0.3], [-0.5, 0.3], [0.9, 0.42], [0.9, 0.2], [2, 0.18], [2, -0.18], [0.9, -0.2], [0.9, -0.42]];

/*
  The zipper flat at height z, face up (`up`) or face down, its teeth on y = 0; `pull` — the pull's x; `sides` [A, B] —
  the stitching through each tape (frame W: tape a on side A, y > 0). → { tapes, teeth, stops, pull }.
*/
function zipper({ z, up = true, pull = PULL_AT[0], sides = [null, null], o = 1 }) {
  const piece = (id, pts, fill, extra = {}) => table(id, pts, z, fill, fill, up, { opacity: o, ...extra });
  const line = (path, s) => (path ? [{ pts: path.map(([x, y]) => [x, s * y]), kind: 'stitch' }] : []);
  const zp = z + (up ? 0.04 : -0.04);
  return {
    tapes: [
      piece('zip-tape-a', band(ZX[0], ZX[1], 0, C), TAPE, { lines: line(sides[0], 1) }),
      piece('zip-tape-b', band(ZX[0], ZX[1], -C, 0), TAPE, { lines: line(sides[1], -1) }),
    ],
    teeth: piece('zip-teeth', band(TEETH[0], TEETH[1], -TW / 2, TW / 2), TEETH_FILL),
    stops: [
      piece('zip-stop-top', band(STOP_TOP[0], STOP_TOP[1], -TW / 2 - 0.06, TW / 2 + 0.06), METAL),
      piece('zip-stop-bottom', band(STOP_BOT[0], STOP_BOT[1], -TW / 2 - 0.08, TW / 2 + 0.08), METAL),
    ],
    pull: piece('zip-pull', PULL_PTS, PULL, { O: [pull, 0, zp] }),
  };
}
/** Face up: the tapes, the teeth on them, the stops, the pull on top. */
const zipUp = (z) => [...z.tapes, z.teeth, ...z.stops, z.pull];
/** Face down: the pull and the stops under the tapes; the teeth show on the back of the zipper too. */
const zipDown = (z) => [z.pull, ...z.stops, ...z.tapes, z.teeth];

/* ---------- The work, wrong side up (W) or turned right side up (R) ---------- */

/*
  The pressed-open seam with the zipper face down on it (frame W), turned over by `r` 0…1 (1 = frame R, right side up).
  `ghost` — the fabric's opacity (see-through, so the zipper under it shows). Options: as stack(), plus `pull` and
  `zipO` (the zipper fading in).
*/
function work({ r = 0, ghost = 1, pull = PULL_AT[0], zipO = 1, zipDrop = 0, ...o } = {}) {
  const fab = fade(fabric(o, 1, 1, 1), ghost);
  const z = zipper({ z: 2 * T + zipDrop, up: false, pull, sides: o.sides ?? [null, null], o: zipO });
  const turnR = (ps) => ps.map((p) => rx(p, 0, T, Math.PI * r));
  const [bb, ab, ba, aa] = turnR(fab);
  const zz = { tapes: turnR(z.tapes), teeth: turnR([z.teeth])[0], stops: turnR(z.stops), pull: turnR([z.pull])[0] };
  return seen(r > 0.5 ? [...zipUp(zz), ba, aa, bb, ab] : [bb, ab, ba, aa, ...zipDown(zz)]);
}

/* ---------- The END VIEW: the seam in section (across it, through the opening), layers drawn apart ---------- */

function section(pieces) {
  const ZK = 3; // heights drawn three times thicker than life, so the layers read apart
  const segs = [];
  for (const p of pieces) {
    if (!/^(piece|allowance|zip-tape)/.test(p.id) || (p.opacity ?? 1) < 0.3) continue;
    const vs = p.pts.map((q) => q[1]);
    const a = at(p, OL / 2, Math.min(...vs)), b = at(p, OL / 2, Math.max(...vs));
    segs.push({ a: [a[1], a[2] * ZK], b: [b[1], b[2] * ZK] });
    if (p.id === 'zip-tape-a') segs.push({ a: [a[1], a[2] * ZK - 0.35], b: [a[1], a[2] * ZK + 0.35] }); // the teeth
  }
  return { segs, range: [-3, 3] };
}

/* ---------- Steps ---------- */

/* Step 1: right sides together; the zipper laid along the seam line, its bottom stop marked — the opening ends there. */
function stepMark(t) {
  const come = span(t, 0.04, 0.26);
  const zin = span(t, 0.36, 0.5), zout = span(t, 0.8, 0.94);
  const drop = (1 - come) * 4;
  const [ba, bb, aa, ab] = fabric({ mark: t > 0.7 });
  const a = [aa, ab].map((p) => ({ ...p, O: [p.O[0], p.O[1], p.O[2] + drop], opacity: come }));
  const zo = zin * (1 - zout);
  const zip = zo > 0.01 ? zipUp(zipper({ z: T + 0.03 + (1 - zin) * 3 + zout * 3, o: zo })) : [];
  return {
    pieces: seen([ba, bb, ...a, ...zip]),
    over: [
      { type: 'line', pts: [[OL, -0.9, T + 0.02], [OL, 0.9, T + 0.02]], kind: 'hot', o: span(t, 0.6, 0.66) * (1 - span(t, 0.84, 0.9)) },
      { type: 'label', p: [L * 0.62, PW * 0.5, T], label: 'rightSides', o: span(t, 0.12, 0.18) * (1 - span(t, 0.32, 0.36)), hot: true },
      { type: 'label', p: [OL, 0, T], label: 'markStop', o: span(t, 0.62, 0.68), dx: 4, dy: 10, hot: true },
    ],
  };
}

/* Step 2: the seam from the other end up to the mark, and a backstitch at the mark. */
function stepSeam(t) {
  const sew = span(t, 0.18, 0.78);
  const done = t > 0.78;
  const z = T + 0.01;
  return {
    pieces: fabric({ mark: true, seam: done }),
    over: [
      { type: 'line', pts: [[L - 0.05, LN, z], [OL, LN, z], [OL + 0.8, LN, z], [OL, LN, z]], t: sew, kind: 'hot', o: 1 - span(t, 0.8, 0.86) },
      { type: 'label', p: [(OL + L) / 2, 0, T], label: 'toMark', o: span(t, 0.06, 0.12) * (1 - span(t, 0.62, 0.66)), dx: -2, dy: -9, hot: true },
      { type: 'label', p: [OL, 0, T], label: 'backstitch', o: span(t, 0.7, 0.76), dx: 4, dy: 10, hot: true },
    ],
  };
}

/* Step 3: the opening basted closed on the same seam line, with the longest stitch. */
function stepBaste(t) {
  const sew = span(t, 0.2, 0.8);
  const done = t > 0.8;
  const z = T + 0.01;
  return {
    pieces: fabric({ mark: true, seam: true, baste: done ? 1 : 0 }),
    over: [
      { type: 'line', pts: [[OL, LN, z], [0.05, LN, z]], t: sew, kind: 'hot', o: 1 - span(t, 0.82, 0.88) },
      { type: 'label', p: [OL * 0.45, 0, T], label: 'baste', o: span(t, 0.06, 0.12), dx: 2, dy: -9, hot: true },
    ],
  };
}

/* Step 4: opened out, turned wrong side up, the seam pressed open (the allowances one to each side). */
function stepPress(t) {
  const a = span(t, 0.06, 0.32), b = span(t, 0.38, 0.62), c = span(t, 0.68, 0.9);
  const pieces = fabric({ mark: true, seam: true, baste: 1 }, a, b, c);
  return {
    pieces,
    over: [
      { type: 'label', p: [L * 0.6, 0, 0], label: 'openOut', o: span(t, 0.06, 0.12) * (1 - span(t, 0.32, 0.36)), dy: -12, hot: true },
      { type: 'label', p: [L * 0.6, 0, 0], label: 'wrongUp', o: span(t, 0.4, 0.46) * (1 - span(t, 0.62, 0.66)), dy: -12, hot: true },
      { type: 'label', p: [L * 0.6, 0, 0], label: 'pressOpen', o: span(t, 0.7, 0.76), dy: -10, hot: true },
    ],
    inset: section(pieces),
    pad: 0.06,
  };
}

/* Step 5: the zipper face down on the seam allowances, its teeth right on the seam line; pinned to the allowances only. */
function stepZipper(t) {
  const zin = span(t, 0.08, 0.4);
  const pieces = work({ mark: true, seam: true, baste: 1, zipO: zin, zipDrop: (1 - zin) * 3 });
  return {
    pieces,
    over: [
      { type: 'line', pts: [[0.05, 0, T + 0.01], [OL, 0, T + 0.01]], kind: 'hot', o: span(t, 0.02, 0.08) * (1 - span(t, 0.34, 0.4)) },
      { type: 'label', p: [OL * 0.55, 0, 2 * T], label: 'faceDown', o: span(t, 0.14, 0.2) * (1 - span(t, 0.42, 0.46)), dy: -10, hot: true },
      { type: 'label', p: [OL * 0.55, 0, 2 * T], label: 'teethOnSeam', o: span(t, 0.46, 0.52) * (1 - span(t, 0.66, 0.7)), dy: -10, hot: true },
      { type: 'label', p: [OL * 0.55, C, 2 * T], label: 'allowancesOnly', o: span(t, 0.7, 0.76), dx: 2, dy: 11, hot: true },
    ],
    inset: section(pieces),
  };
}

/** A sewing overlay in frame R: a path given in side `s`'s own (x, |y|) (s = 1: side A, −1: side B), on top of the fabric. */
const pathR = (path, s) => path.map(([x, y]) => toR([x, s * y, -0.01]));

/* Step 6: turned right side up; with the zipper foot, across the bottom below the stop, pivot, and along one side. */
function stepSideA(t) {
  const r = span(t, 0.04, 0.26);
  const sew = span(t, 0.4, 0.88);
  const done = t > 0.88;
  const corner = toR([XB, DS, -0.01]);
  return {
    pieces: work({ r, seam: true, baste: 1, sides: [done ? SIDE_TO_PULL : null, null] }),
    over: [
      { type: 'line', pts: pathR(SIDE_TO_PULL, 1), t: sew, kind: 'hot', o: span(t, 0.36, 0.4) * (1 - span(t, 0.9, 0.96)) },
      { type: 'label', p: [L * 0.6, 0, 2 * T], label: 'rightUp', o: span(t, 0.14, 0.2) * (1 - span(t, 0.34, 0.38)), dy: -10, hot: true },
      { type: 'label', p: toR([XB, 0, 0]), label: 'belowStop', o: span(t, 0.4, 0.46) * (1 - span(t, 0.56, 0.6)), dx: 6, dy: 10, hot: true },
      { type: 'label', p: corner, label: 'pivot', o: span(t, 0.56, 0.62) * (1 - span(t, 0.74, 0.78)), dx: -10, dy: -9, hot: true },
    ],
  };
}

/* Step 7: the pull is in the way — needle down, foot up, the pull slid past the foot; then the side is finished. */
function stepPull(t) {
  const mv = span(t, 0.2, 0.46);
  const sew = span(t, 0.58, 0.88);
  const done = t > 0.88;
  const pull = PULL_AT[0] + (PULL_AT[1] - PULL_AT[0]) * mv;
  return {
    pieces: work({ r: 1, ghost: 1 - 0.5 * span(t, 0.04, 0.14) * (1 - span(t, 0.5, 0.6)), pull, seam: true, baste: 1, sides: [done ? SIDE : SIDE_TO_PULL, null] }),
    over: [
      { type: 'line', pts: pathR([[XP, DS], [XT, DS]], 1), t: sew, kind: 'hot', o: span(t, 0.54, 0.58) * (1 - span(t, 0.9, 0.96)) },
      { type: 'label', p: toR([XP, DS, 0]), label: 'needleDown', o: span(t, 0.04, 0.1) * (1 - span(t, 0.5, 0.54)), dx: 8, dy: -9, hot: true },
      { type: 'label', p: toR([PULL_AT[1] + 1, 0, 0]), label: 'movePull', o: span(t, 0.2, 0.26) * (1 - span(t, 0.5, 0.54)), dx: -6, dy: 11, hot: true },
    ],
  };
}

/* Step 8: the other side the same way — across the bottom from the seam line, pivot, along the side: in the same direction. */
function stepSideB(t) {
  const sew = span(t, 0.2, 0.84);
  const done = t > 0.84;
  return {
    pieces: work({ r: 1, pull: PULL_AT[1], seam: true, baste: 1, sides: [SIDE, done ? SIDE : null] }),
    over: [
      { type: 'line', pts: pathR(SIDE, -1), t: sew, kind: 'hot', o: span(t, 0.16, 0.2) * (1 - span(t, 0.86, 0.92)) },
      { type: 'label', p: toR([L * 0.6, -PW * 0.55, 0]), label: 'otherSide', o: span(t, 0.04, 0.1) * (1 - span(t, 0.3, 0.34)), hot: true },
      { type: 'label', p: toR([OL * 0.45, 0, 0]), label: 'sameWay', o: span(t, 0.4, 0.46), dy: -10, hot: true },
    ],
  };
}

/* Step 9: the basting unpicked; the two folded edges meet over the teeth; pressed. */
function stepUnpick(t) {
  const out = span(t, 0.22, 0.6);
  const g = GAP * span(t, 0.6, 0.76);
  return {
    pieces: work({ r: 1, pull: PULL_AT[1], seam: true, baste: 1 - out, sides: [SIDE, SIDE], g }),
    over: [
      { type: 'label', p: toR([OL * 0.45, 0, 0]), label: 'unpick', o: span(t, 0.16, 0.22) * (1 - span(t, 0.6, 0.64)), dy: -10, hot: true },
      { type: 'label', p: toR([OL * 0.45, 0, 0]), label: 'meet', o: span(t, 0.78, 0.84), dy: -10, hot: true },
    ],
  };
}

/* ---------- Step 0: the finished seam, right side up — opaque (e = 0, the first frame) or see-through (e = 1) ---------- */

/** The finished centered zipper; e = 0 as it looks, 1 the fabric see-through (the zipper and its stitching under it). */
export function anatomy(e = 0) {
  return { pieces: work({ r: 1, ghost: 1 - 0.6 * span(e, 0.1, 0.9), seam: true, sides: [SIDE, SIDE], g: GAP }), over: [] };
}

/** Numbered pins for the legend, on the finished seam (shown at rest): fabric, stitching, seam, zipper. */
function pins() {
  return [
    { n: 1, p: toR([L * 0.72, -PW * 0.55, 0]) },
    { n: 2, p: toR([OL * 0.62, DS, 0]) },
    { n: 3, p: toR([(XB + L) / 2 + 0.6, 0, 0]) },
    { n: 4, p: toR([OL * 0.22, 0, 0]) },
  ];
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption, written instruction, the chips drawn in the
  scenes, the legend) lives in zipper-centered.<lang>.js, index-aligned with this array; zipper-centered.text.js checks
  that. `scene` draws the step over t = 0…1, `duration` is its animation in seconds, `stitch` — the machine stitch (a key
  of `stitches` in the texts: 'basting' = the longest stitch), `sew` — when and on which fabric the seam is sewn ('seam':
  the seam and the basting, a plain seam; 'zipper': next to the zipper, with the zipper foot). `uses` — catalog products
  handy in that step (ids from src/data/products.js, shown as labelled affiliate links under the caption): clips, the
  marking pen, the machine, the iron, pins, the zipper foot (Windman set).
*/
const FOOT = ['windman-presser-feet-set', 'janome-1522rd'];
export const STEPS = [
  {}, // 0: the finished seam (texts: zipper-centered.<lang>.js)
  { scene: stepMark, duration: 6, uses: ['soraco-sewing-clips', 'sewline-air-erasable-pen'] },
  { scene: stepSeam, duration: 5.5, stitch: 'straight', sew: [[0.18, 0.78, 'seam']], uses: ['janome-1522rd'] },
  { scene: stepBaste, duration: 5, stitch: 'basting', sew: [[0.2, 0.8, 'seam']], uses: ['janome-1522rd'] },
  { scene: stepPress, duration: 8, uses: ['rowenta-travel-iron'] },
  { scene: stepZipper, duration: 6.5, uses: ['beaditive-magnetic-pin-holder'] },
  { scene: stepSideA, duration: 7.5, stitch: 'straight', sew: [[0.4, 0.88, 'zipper']], uses: FOOT },
  { scene: stepPull, duration: 6.5, stitch: 'straight', sew: [[0.58, 0.88, 'zipper']], uses: FOOT },
  { scene: stepSideB, duration: 7, stitch: 'straight', sew: [[0.2, 0.84, 'zipper']], uses: FOOT },
  { scene: stepUnpick, duration: 6, uses: ['rowenta-travel-iron'] },
];

/** Every chip key the drawing uses — each language must have them all (zipper-centered.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how see-through the fabric is) → { body, viewBox }. L = the texts (zipper-centered.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  floorAt: () => null, // flat work on the table: no shadow
  shadow: [1, 1],
  fabrics: { seam: '#c9a7c7', zipper: '#c9a7c7' },
  pinsAt: 0, // the pins are on the finished seam: already in the first frame
});

/** Fabric patterns (ids prefixed with the figure's ID), in each piece's own coordinates. */
export const DEFS = `
<defs>
  <pattern id="${ID}-print" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#e6dcea"/>
    <circle cx=".75" cy=".75" r=".3" fill="#c98a86"/><circle cx="2.25" cy="2.25" r=".22" fill="#9caf88"/>
  </pattern>
  <pattern id="${ID}-back" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#f3eef4"/>
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

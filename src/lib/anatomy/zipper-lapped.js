/*
  Lapped zipper — the figure of the fifth section (`lapped`) of the guide "How to sew a zipper"
  (/guides/sew-a-zipper#lapped; Vault «Гайды — Молния (спецификация)», 3 row 5 and 5.3 «Раздел 5 — молния с
  перекрытием»). A public technique, no maker's project: what the sources agree on, in our own drawing. A PIECE OF THE
  SEAM, not a garment (spec 4): two pieces of fabric right sides together; the seam sewn up to the mark at the zipper's
  bottom stop, with a backstitch; the opening above it basted with the longest stitch; the seam pressed open. Then the
  two sides of the opening do different jobs: the UNDERLAP side's seam allowance is folded a little narrower than the
  seam allowance, so its fold sits just past the seam line, right beside the teeth of the zipper (face up under it), and
  is stitched along that fold through the allowance and the zipper tape — the OVERLAP side folded back out of the way,
  so it is not caught. The overlap comes back over the zipper: folded on the seam line, it covers the teeth and that
  stitching. From the right side, with the zipper foot, one line of stitching across the bottom below the stop and along
  the overlap side, wide enough to clear the teeth and the pull; the basting unpicked. One stitching line shows outside.

  NO numbers (spec 3, 3.1): the fold "a little narrower than the seam allowance" and the stitching "wide enough to clear
  the teeth and the pull" are said in words (the sources' 3 mm is not given). `SPEC` is empty; `DRAWING` holds the
  drawing's own proportions (not measurements — never shown), so the tests can check the relations. Words (titles,
  captions, instructions, chips, legend) are NOT here: zipper-lapped.<lang>.js, picked through zipper-lapped.text.js.
  The texts never say which way the stitching runs, nor where it starts (the sources differ); the drawing has to pick
  one.

  Frames (x → right-down along the seam, x = 0 the top edge; y → left-down across it; z up):
    S — the stack (steps 1–3): piece B right side up, piece A right side down on it; the seam line at y = 0, the seam
        allowances on the −y side;
    W — wrong side up, the seam pressed open (step 4): the bodies at z = 0 (A on +y, B on −y), the allowances folded
        back on them at z = T;
    R — right side up (steps 5–10 and step 0): W turned over about the seam line (y = 0, z = T), so A lies on −y and B
        on +y; the overlap (A, body and allowance) lifted over the underlap, which reaches under it past the seam line.
  Step 0 is the finished seam, right side up: the overlap's folded edge on the seam line, one line of stitching on it.
  Tap: the fabric goes see-through, so the zipper under it and the hidden stitching on the underlap show. Shared parts
  (camera, inset, machine, renderer) live in kit.js. SVG ids carry the figure's prefix ('zipper-lapped-…'), so it never
  collides with the other figures of the same page.
*/
import { at, turn } from './iso.js';
import { labelKeys, makeRenderer, span } from './kit.js';

const ID = 'zipper-lapped'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {}; // no maker's numbers in this section

/* ---------- The drawing's proportions (not measurements: never labelled, never written) ---------- */

const L = 15; // the piece of the seam, along it (x = 0: the top edge)
const OL = 9; // the opening for the zipper: x 0…OL; the mark (the zipper's bottom stop) at OL
const PW = 3.5; // each piece, across the seam (as much as the drawing shows)
const SA = 2; // a seam allowance
const T = 0.1; // fabric thickness in the drawing
const ZW = 2.2; // the zipper's width: two tapes and the teeth
const C = ZW / 2;
const TW = 0.55; // the teeth band
const LAP = 0.35; // the underlap's fold, this far past the seam line (its allowance folded a little narrower)
const ZC = LAP + 0.03 + TW / 2; // the zipper's middle (the teeth), across: right beside the underlap's fold
const ZX = [0.15, OL + 0.9]; // the zipper, along the seam: its top just below the top edge, its tape past the bottom stop
const SS = 0.3; // a stop, along the zipper
const STOP_TOP = [0.45, 0.45 + SS];
const STOP_BOT = [OL - SS, OL]; // the bottom stop, on the mark
const TEETH = [STOP_TOP[1], STOP_BOT[0]];
const EPS = 0.12; // the underlap's stitching, this far inside its fold
const UY = LAP - EPS; // … across, past the seam line
const XU = OL - 0.15; // the underlap's stitching runs the zipper's length, as far as the bottom stop
const DS = 1.35; // the overlap's stitching, this far from the seam line: wide enough to clear the teeth and the pull
const XB = OL + 0.35; // the stitching across the bottom: below the bottom stop, never over it
const XT = 0.25; // the stitching ends by the top edge
const LN = 0.06; // the seam and the basting, drawn this far from the fold
const PULL_AT = STOP_TOP[1] + 0.45; // the pull (its origin): closed, by the top stops
/** The pull, round its own origin (on the teeth): a body, and its tab along the teeth. */
const PULL_PTS = [[-0.5, -0.3], [-0.5, 0.3], [0.9, 0.42], [0.9, 0.2], [2, 0.18], [2, -0.18], [0.9, -0.2], [0.9, -0.42]];
const PULL_W = 0.42; // the pull's half width, across

/** The overlap's stitching, in its own (x, distance from the seam line): across the bottom, pivot, along the side. */
const TOP = [[XB, 0], [XB, DS], [XT, DS]];
/** The underlap's stitching, along its fold, in the underlap's own (x, v): v < 0 is past the seam line. */
const UNDER = [[XU, -UY], [XT, -UY]];

/** The drawing's relations, for the tests (tests/guides/sew-a-zipper.test.js). */
export const DRAWING = {
  length: L, opening: OL, piece: PW, allowance: SA, lap: LAP, zipper: ZC, tape: C, teeth: TEETH, teethBand: TW,
  stops: [STOP_TOP, STOP_BOT], pullHalf: PULL_W, stitch: DS, across: XB, under: UY, top: TOP,
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
const lift = (p, dz) => (dz ? { ...p, O: [p.O[0], p.O[1], p.O[2] + dz] } : p);
/** World point of frame W → frame R (turned over about the seam line, y = 0, z = T). */
const toR = ([x, y, z]) => [x, -y, 2 * T - z];

/* ---------- The fabric: two pieces, each a body and its seam allowance (one fold at the seam line) ---------- */

/*
  The underlap's outlines in its own (u along the seam, v from the seam line into the piece): over the opening its fold
  moves `f` 0…1 past the seam line (v = −LAP f), so the allowance folded under is a little narrower than the allowance;
  below the opening it stays on the seam line (the seam is sewn there).
*/
const bodyB = (f) => (f > 1e-6 ? [[0, -LAP * f], [OL, -LAP * f], [OL, 0], [L, 0], [L, PW], [0, PW]] : band(0, L, 0, PW));
const allowB = (f) => (f > 1e-6 ? [[0, -LAP * f], [OL, -LAP * f], [OL, 0], [L, 0], [L, SA], [OL, SA], [OL, SA - 2 * LAP * f], [0, SA - 2 * LAP * f]] : band(0, L, 0, SA));

/*
  The four fabric pieces in the stack (frame S), with what is sewn on them:
    mark    the mark across the seam line at the bottom stop (air-erasable, on the wrong side)
    seam    the seam below the mark (in the fold: seen only from the wrong side)
    baste   the basting over the opening: 0 none … 1 all of it (unpicking: less and less)
    refold  the underlap's fold over the opening: 0 on the seam line … 1 just past it (allowance a little narrower)
    under   the underlap's stitching along its fold (seen on the right side, under the overlap at the end)
    top     the overlap's stitching across the bottom and along its side (sewn or not)
*/
function stack({ mark = false, seam = false, baste = 0, refold = 0, under = false, top = false } = {}) {
  const lines = (side) => [
    ...(mark ? [{ pts: [[OL, 0.02], [OL, 0.9]], kind: 'mark', side: 'in' }] : []),
    ...(seam ? [{ pts: [[OL, LN], [L - 0.05, LN]], kind: 'stitch', side: 'in' }] : []),
    ...(baste > 0.001 ? [{ pts: [[0.05, LN], [OL, LN]], t: baste, kind: 'fold', baste: true }] : []),
    ...(side === 0 && top ? [{ pts: TOP, kind: 'stitch', side: 'out', topstitch: true }] : []),
    ...(side === 1 && under ? [{ pts: UNDER, kind: 'stitch', side: 'out', under: true }] : []),
  ];
  const piece = (id, pts, O, V, up, ls) => ({ id, pts, O, U: X, V, out: [0, 0, up ? 1 : -1], fill: PRINT, inner: BACK, lines: ls });
  return {
    Bb: piece('piece-b', bodyB(refold), [0, 0, 0], [0, 1, 0], true, lines(1)),
    Ba: piece('allowance-b', allowB(refold), [0, 0, 0], [0, -1, 0], true, lines(1).filter((l) => l.side !== 'out')),
    Ab: piece('piece-a', band(0, L, 0, PW), [0, 0, T], [0, 1, 0], false, lines(0)),
    Aa: piece('allowance-a', band(0, L, 0, SA), [0, 0, T], [0, -1, 0], false, lines(0).filter((l) => l.side !== 'out')),
  };
}

/*
  The fabric from the stack (S) to the pressed-open seam (W): `a` 0…1 — opened out (piece A over to the other side like a
  book, the allowances hanging under the seam); `b` 0…1 — turned over (wrong side up: the allowances stand up); `c` 0…1 —
  pressed open (each allowance down onto its own piece). → [bb, ab, ba, aa] and the painter's order.
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
  const order = b > 0.5 ? [bb, ab, ba, aa] : a > 0.02 ? [ba, aa, bb, ab] : [ba, bb, aa, ab];
  return { bb, ab, ba, aa, order };
}

/* ---------- The zipper (frame W: its middle `c` across, toward side A; face down on the wrong side) ---------- */

/*
  The zipper flat at height z, face up (`up`) or face down, its teeth on y = c; `pull` — the pull's x; `under` / `top` —
  the two stitchings through the tapes (the underlap's along tape b; the overlap's across both and along tape a).
  → { tapes, teeth, stops, pull }.
*/
function zipper({ z, c = ZC, up = true, pull = PULL_AT, under = false, top = false, o = 1 }) {
  const piece = (id, pts, fill, extra = {}) => table(id, pts, z, fill, fill, up, { opacity: o, ...extra });
  const zp = z + (up ? 0.04 : -0.04);
  const st = (pts, tag) => ({ pts, kind: 'stitch', ...tag });
  return {
    tapes: [
      piece('zip-tape-a', band(ZX[0], ZX[1], c, c + C), TAPE, { lines: top ? [st([[XB, c], [XB, DS], [XT, DS]], { topstitch: true })] : [] }),
      piece('zip-tape-b', band(ZX[0], ZX[1], c - C, c), TAPE, {
        lines: [...(under ? [st([[XU, UY], [XT, UY]], { under: true })] : []), ...(top ? [st([[XB, 0], [XB, c]], { topstitch: true })] : [])],
      }),
    ],
    teeth: piece('zip-teeth', band(TEETH[0], TEETH[1], c - TW / 2, c + TW / 2), TEETH_FILL),
    stops: [
      piece('zip-stop-top', band(STOP_TOP[0], STOP_TOP[1], c - TW / 2 - 0.06, c + TW / 2 + 0.06), METAL),
      piece('zip-stop-bottom', band(STOP_BOT[0], STOP_BOT[1], c - TW / 2 - 0.08, c + TW / 2 + 0.08), METAL),
    ],
    pull: piece('zip-pull', PULL_PTS, PULL, { O: [pull, c, zp] }),
  };
}
/** Face up: the tapes, the teeth on them, the stops, the pull on top. */
const zipUp = (z) => [...z.tapes, z.teeth, ...z.stops, z.pull];

/* ---------- The work, turned right side up (R) ---------- */

/*
  The pressed-open seam (frame W) turned over by `r` 0…1 (1 = frame R, right side up); the overlap (A) lifted over the
  underlap as it turns; `flip` 0…1 — the overlap folded back about the seam line, over the underlap, out of the way;
  `ghost` — the fabric's opacity (see-through, so the zipper under it shows); `zipO` / `zipIn` — the zipper fading in
  and sliding in under the underlap's fold (0 = far out on the overlap's side). Options: as stack().
*/
function work({ r = 1, flip = 0, ghost = 1, zipO = 0, zipIn = 1, ...o } = {}) {
  const f = fabric(o, 1, 1, 1);
  const turnR = (p) => rx(p, 0, T, Math.PI * r);
  const up = 2 * T * r; // the overlap over the underlap
  const hinge = (p) => rx(lift(turnR(p), up), 0, 3.5 * T, -Math.PI * flip);
  const bb = turnR(f.bb), ba = turnR(f.ba), ab = hinge(f.ab), aa = hinge(f.aa);
  const fab = (ps) => fade(ps, ghost);
  if (r < 0.5) return seen(fab([bb, ab, ba, aa])); // still wrong side up: the allowances on top
  const z = zipper({ z: 2 * T, c: ZC + (1 - zipIn) * 3.2, up: false, under: o.under, top: o.top, o: zipO });
  const zip = zipO > 0.01 ? zipUp(z).map(turnR) : []; // face up once turned: tapes, teeth, stops, the pull on top
  const lap = flip > 0.5 ? [ab, aa] : [aa, ab]; // folded back: its allowance on top
  return seen([...zip, ...fab([ba, bb, ...lap])]);
}

/* ---------- The END VIEW: the seam in section (across it, through the opening), layers drawn apart ---------- */

/** Where a piece's outline crosses the line u = x0, in its own v: [min, max] (null: not there). */
function across(p, x0) {
  const vs = [];
  const n = p.pts.length;
  for (let i = 0; i < n; i++) {
    const [u0, v0] = p.pts[i], [u1, v1] = p.pts[(i + 1) % n];
    if ((u0 - x0) * (u1 - x0) > 0 || u0 === u1) continue;
    vs.push(v0 + ((x0 - u0) / (u1 - u0)) * (v1 - v0));
  }
  return vs.length ? [Math.min(...vs), Math.max(...vs)] : null;
}

function section(pieces) {
  const ZK = 3; // heights drawn three times thicker than life, so the layers read apart
  const x0 = OL / 2;
  const segs = [];
  for (const p of pieces) {
    if (!/^(piece|allowance|zip-tape)/.test(p.id) || (p.opacity ?? 1) < 0.3) continue;
    const r = across(p, x0);
    if (!r) continue;
    const a = at(p, x0, r[0]), b = at(p, x0, r[1]);
    segs.push({ a: [a[1], a[2] * ZK], b: [b[1], b[2] * ZK] });
    if (p.id === 'zip-tape-a') segs.push({ a: [a[1], a[2] * ZK - 0.35], b: [a[1], a[2] * ZK + 0.35] }); // the teeth
  }
  return { segs, range: [-3.2, 3.2] };
}

/* ---------- Steps ---------- */

/* Step 1: right sides together; the zipper laid along the seam line, its bottom stop marked — the opening ends there. */
function stepMark(t) {
  const come = span(t, 0.04, 0.26);
  const zin = span(t, 0.36, 0.5), zout = span(t, 0.8, 0.94);
  const drop = (1 - come) * 4;
  const f = fabric({ mark: t > 0.7 });
  const [ba, bb, aa, ab] = f.order;
  const a = [aa, ab].map((p) => ({ ...p, O: [p.O[0], p.O[1], p.O[2] + drop], opacity: come }));
  const zo = zin * (1 - zout);
  const zip = zo > 0.01 ? zipUp(zipper({ z: T + 0.03 + (1 - zin) * 3 + zout * 3, c: 0, o: zo })) : [];
  return {
    pieces: seen([ba, bb, ...a, ...zip]),
    over: [
      { type: 'line', pts: [[OL, -0.9, T + 0.02], [OL, 0.9, T + 0.02]], kind: 'hot', o: span(t, 0.6, 0.66) * (1 - span(t, 0.84, 0.9)) },
      { type: 'label', p: [L * 0.62, PW * 0.5, T], label: 'rightSides', o: span(t, 0.12, 0.18) * (1 - span(t, 0.32, 0.36)), hot: true },
      { type: 'label', p: [OL, 0, T], label: 'markStop', o: span(t, 0.62, 0.68), dx: 4, dy: 10, hot: true },
    ],
  };
}

/* Step 2: the seam up to the mark, and a backstitch at the mark. */
function stepSeam(t) {
  const sew = span(t, 0.18, 0.78);
  const done = t > 0.78;
  const z = T + 0.01;
  return {
    pieces: fabric({ mark: true, seam: done }).order,
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
    pieces: fabric({ mark: true, seam: true, baste: done ? 1 : 0 }).order,
    over: [
      { type: 'line', pts: [[OL, LN, z], [0.05, LN, z]], t: sew, kind: 'hot', o: 1 - span(t, 0.82, 0.88) },
      { type: 'label', p: [OL * 0.45, 0, T], label: 'baste', o: span(t, 0.06, 0.12), dx: 2, dy: -9, hot: true },
    ],
  };
}

/* Step 4: opened out, turned wrong side up, the seam pressed open (the allowances one to each side). */
function stepPress(t) {
  const a = span(t, 0.06, 0.32), b = span(t, 0.38, 0.62), c = span(t, 0.68, 0.9);
  const pieces = fabric({ mark: true, seam: true, baste: 1 }, a, b, c).order;
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

/** A point in frame R on top of the underlap (B) or of the overlap (A): given in frame W's (x, y). */
const onB = ([x, y]) => toR([x, y, -0.01]);
const onA = ([x, y]) => toR([x, y, -2 * T - 0.01]);

/* Step 5: turned right side up; the overlap side folded back over the underlap, out of the way (the basting holds it). */
function stepFoldBack(t) {
  const r = span(t, 0.04, 0.3);
  const flip = span(t, 0.46, 0.84);
  return {
    pieces: work({ r, flip, seam: true, baste: 1 }),
    over: [
      { type: 'label', p: onB([L * 0.62, -PW * 0.5]), label: 'rightUp', o: span(t, 0.12, 0.18) * (1 - span(t, 0.36, 0.4)), hot: true },
      { type: 'label', p: onB([L * 0.62, -PW * 0.5]), label: 'foldBack', o: span(t, 0.48, 0.54), hot: true },
    ],
  };
}

/* Step 6: the underlap's allowance folded a little narrower, its fold just past the seam line; the zipper face up under
   it, the fold right beside the teeth. */
function stepUnderlap(t) {
  const refold = span(t, 0.06, 0.34);
  const zin = span(t, 0.44, 0.74);
  const pieces = work({ flip: 1, refold, zipO: span(t, 0.4, 0.5), zipIn: zin, seam: true, baste: 1 });
  return {
    pieces,
    over: [
      { type: 'line', pts: [onB([0.05, LAP]), onB([OL, LAP])], kind: 'hot', o: span(t, 0.08, 0.14) * (1 - span(t, 0.36, 0.42)) },
      { type: 'label', p: onB([OL * 0.5, LAP]), label: 'narrower', o: span(t, 0.1, 0.16) * (1 - span(t, 0.38, 0.42)), dx: -4, dy: -10, hot: true },
      { type: 'label', p: onB([OL * 0.5, ZC + 1.5]), label: 'faceUp', o: span(t, 0.46, 0.52) * (1 - span(t, 0.72, 0.76)), dx: -2, dy: -8, hot: true },
      { type: 'label', p: onB([OL * 0.5, LAP]), label: 'besideTeeth', o: span(t, 0.78, 0.84), dx: -4, dy: -10, hot: true },
    ],
    inset: section(pieces),
  };
}

/* Step 7: with the zipper foot, along the underlap's fold, through the allowance and the zipper tape only. */
function stepUnder(t) {
  const sew = span(t, 0.18, 0.84);
  const done = t > 0.84;
  return {
    pieces: work({ flip: 1, refold: 1, zipO: 1, seam: true, baste: 1, under: done }),
    over: [
      { type: 'line', pts: [onB([XU, UY]), onB([XT, UY])], t: sew, kind: 'hot', o: span(t, 0.14, 0.18) * (1 - span(t, 0.86, 0.92)) },
      { type: 'label', p: onB([OL * 0.5, LAP]), label: 'alongFold', o: span(t, 0.06, 0.12) * (1 - span(t, 0.5, 0.54)), dx: -4, dy: -10, hot: true },
      { type: 'label', p: onB([OL * 0.5, LAP]), label: 'allowanceOnly', o: span(t, 0.56, 0.62), dx: -4, dy: -10, hot: true },
    ],
  };
}

/* Step 8: the overlap back over the zipper, folded on the seam line: it covers the teeth and the stitching just sewn. */
function stepOverlap(t) {
  const flip = 1 - span(t, 0.08, 0.5);
  const pieces = work({ flip, refold: 1, zipO: 1, seam: true, baste: 1, under: true });
  return {
    pieces,
    over: [
      { type: 'label', p: onB([L * 0.62, -PW * 0.5]), label: 'overlapBack', o: span(t, 0.06, 0.12) * (1 - span(t, 0.46, 0.5)), hot: true },
      { type: 'label', p: onA([OL * 0.5, 0]), label: 'covers', o: span(t, 0.56, 0.62), dx: 2, dy: -10, hot: true },
    ],
    inset: section(pieces),
  };
}

/* Step 9: with the zipper foot, across the bottom below the stop and along the overlap side, clear of the teeth and the
   pull; pivot at the corner with the needle down. */
function stepTopstitch(t) {
  const sew = span(t, 0.2, 0.84);
  const done = t > 0.84;
  return {
    pieces: work({ refold: 1, zipO: 1, seam: true, baste: 1, under: true, top: done }),
    over: [
      { type: 'line', pts: TOP.map(onA), t: sew, kind: 'hot', o: span(t, 0.16, 0.2) * (1 - span(t, 0.86, 0.92)) },
      { type: 'label', p: onA([XB, 0]), label: 'belowStop', o: span(t, 0.2, 0.26) * (1 - span(t, 0.4, 0.44)), dx: 6, dy: 10, hot: true },
      { type: 'label', p: onA([XB, DS]), label: 'pivot', o: span(t, 0.4, 0.46) * (1 - span(t, 0.58, 0.62)), dx: -10, dy: -9, hot: true },
      { type: 'label', p: onA([OL * 0.5, DS]), label: 'clearTeeth', o: span(t, 0.62, 0.68), dx: 4, dy: 10, hot: true },
    ],
  };
}

/* Step 10: the basting unpicked; pressed. One line of stitching shows on the right side. */
function stepUnpick(t) {
  const out = span(t, 0.22, 0.6);
  return {
    pieces: work({ refold: 1, zipO: 1, seam: true, baste: 1 - out, under: true, top: true }),
    over: [
      { type: 'label', p: onA([OL * 0.45, 0]), label: 'unpick', o: span(t, 0.16, 0.22) * (1 - span(t, 0.6, 0.64)), dx: 2, dy: -10, hot: true },
      { type: 'label', p: onA([OL * 0.45, DS]), label: 'oneLine', o: span(t, 0.7, 0.76), dx: 4, dy: 10, hot: true },
    ],
  };
}

/* ---------- Step 0: the finished seam, right side up — opaque (e = 0, the first frame) or see-through (e = 1) ---------- */

/** The finished lapped zipper; e = 0 as it looks, 1 the fabric see-through (the zipper and the hidden stitching). */
export function anatomy(e = 0) {
  return { pieces: work({ ghost: 1 - 0.6 * span(e, 0.1, 0.9), refold: 1, zipO: 1, seam: true, under: true, top: true }), over: [] };
}

/** Numbered pins for the legend, on the finished seam (shown at rest): fabric, stitching, seam, zipper. */
function pins() {
  return [
    { n: 1, p: onB([L * 0.72, -PW * 0.55]) },
    { n: 2, p: onA([OL * 0.62, DS]) },
    { n: 3, p: onB([(XB + L) / 2 + 0.6, 0]) },
    { n: 4, p: onA([OL * 0.22, 0]) },
  ];
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption, written instruction, the chips drawn in the
  scenes, the legend) lives in zipper-lapped.<lang>.js, index-aligned with this array; zipper-lapped.text.js checks
  that. `scene` draws the step over t = 0…1, `duration` is its animation in seconds, `stitch` — the machine stitch (a key
  of `stitches` in the texts: 'basting' = the longest stitch), `sew` — when and on which fabric the seam is sewn ('seam':
  the seam and the basting, a plain seam; 'zipper': next to the zipper, with the zipper foot). `uses` — catalog products
  handy in that step (ids from src/data/products.js, shown as labelled affiliate links under the caption): clips, the
  marking pen, the machine, the iron, pins, the zipper foot (Windman set).
*/
const FOOT = ['windman-presser-feet-set', 'janome-1522rd'];
export const STEPS = [
  {}, // 0: the finished seam (texts: zipper-lapped.<lang>.js)
  { scene: stepMark, duration: 6, uses: ['soraco-sewing-clips', 'sewline-air-erasable-pen'] },
  { scene: stepSeam, duration: 5.5, stitch: 'straight', sew: [[0.18, 0.78, 'seam']], uses: ['janome-1522rd'] },
  { scene: stepBaste, duration: 5, stitch: 'basting', sew: [[0.2, 0.8, 'seam']], uses: ['janome-1522rd'] },
  { scene: stepPress, duration: 8, uses: ['rowenta-travel-iron'] },
  { scene: stepFoldBack, duration: 6.5, uses: [] },
  { scene: stepUnderlap, duration: 7.5, uses: ['rowenta-travel-iron', 'beaditive-magnetic-pin-holder'] },
  { scene: stepUnder, duration: 6.5, stitch: 'straight', sew: [[0.18, 0.84, 'zipper']], uses: FOOT },
  { scene: stepOverlap, duration: 6, uses: ['beaditive-magnetic-pin-holder'] },
  { scene: stepTopstitch, duration: 7.5, stitch: 'straight', sew: [[0.2, 0.84, 'zipper']], uses: FOOT },
  { scene: stepUnpick, duration: 6, uses: ['rowenta-travel-iron'] },
];

/** Every chip key the drawing uses — each language must have them all (zipper-lapped.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how see-through the fabric is) → { body, viewBox }. L = the texts (zipper-lapped.text.js). */
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
    <rect width="3" height="3" fill="#e9dfd3"/>
    <circle cx=".75" cy=".75" r=".3" fill="#9caf88"/><circle cx="2.25" cy="2.25" r=".22" fill="#c98a86"/>
  </pattern>
  <pattern id="${ID}-back" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#f5f0ea"/>
    <rect width="3" height="3" fill="url(#${ID}-print)" opacity=".2"/>
  </pattern>
  <pattern id="${ID}-tape" width="2" height="2" patternUnits="userSpaceOnUse">
    <rect width="2" height="2" fill="#8a6f8c"/><path d="M0 1H2" stroke="#775f79" stroke-width=".2"/>
  </pattern>
  <pattern id="${ID}-teeth" width=".6" height=".8" patternUnits="userSpaceOnUse">
    <rect width=".6" height=".8" fill="#5e4a60"/><rect x=".08" width=".3" height=".8" fill="#ece8ec"/>
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

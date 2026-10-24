/*
  Invisible zipper — the figure of the sixth section (`invisible`) of the guide "How to sew a zipper"
  (/guides/sew-a-zipper#invisible; Vault «Гайды — Молния (спецификация)», 3 row 6 and «Лапка», 4, 5.3 «Раздел 6 —
  потайная молния»). A public technique, no maker's project: what the nine sources agree on, in their order, in our own
  drawing. A PIECE OF THE SEAM, not a garment (spec 4): two pieces of fabric, each a body and its seam allowance, and the
  zipper. The consensus, step by step:
    the seam left open — the zipper goes in first, the seam below it afterwards;
    the zipper opened, its coil pressed flat from the back with a barely warm iron;
    the zipper face down on the right side of one piece, its coil on the seam line;
    the coil in one groove of the invisible zipper foot, stitched from top to bottom until the pull stops the foot,
      backstitched (all the sources agree on this direction, so the texts may say it);
    the other side with the other groove, the top edges (and any cross seams) level, the zipper not twisted;
    the zipper closed;
    the seam below sewn with the (regular) zipper foot, starting a little above and to the side of the end of the
      zipper stitching;
    the zipper tape's ends stitched to the seam allowances only.
  From the outside only the seam line and the pull show (step 0).

  NO numbers (spec 3, 5.3): how much longer the zipper is than the opening, where the seam below starts, the stitch
  length — in words only. `SPEC` is empty; `DRAWING` holds the drawing's own proportions (never labelled, never
  written), so the tests can check the relations. Words live in zipper-invisible.<lang>.js (zipper-invisible.text.js).

  Every piece is flat and hinged on its seam line (x along the seam, x = 0 the top edge; y across it; z up). A piece's
  place is { y, z, th, s }: its seam line at (y, z), its own v axis at angle th in the y-z plane, s which way its right
  side faces (see place()). Moves are rotations about the seam line and lifts, so nothing ever passes below the table.
  Poses:
    P — apart (steps 1–4): piece A right side up, its allowance flat; piece B right side up off to the side;
    WB — the other side (steps 5–7, 9): B right side up, its allowance flat; A turned over onto B, right sides
         together, its allowance and the sewn half of the zipper folded back on top;
    S — right sides together for the seam below (step 8): A's allowance turned back over B's;
    R — the finished seam, right side up (step 0): each allowance folded under its own piece, the zipper under them.
  Shared parts (camera, inset, machine, renderer) live in kit.js. SVG ids carry the figure's prefix
  ('zipper-invisible-…').
*/
import { at } from './iso.js';
import { labelKeys, makeRenderer, rect, rot2, span } from './kit.js';

const ID = 'zipper-invisible'; // prefix of every SVG id of this figure (fills, clip)

export const SPEC = {}; // no maker's numbers in this section

/* ---------- The drawing's proportions (not measurements: never labelled, never written) ---------- */

const L = 15; // the piece of the seam, along it (x = 0: the top edge)
const PW = 3; // each piece's body, across the seam (as much as the drawing shows)
const SA = 1.5; // a seam allowance
const T = 0.1; // fabric thickness in the drawing
const C = 1.1; // one zipper tape, from its coil to its outer edge
const CW0 = 0.12, CW = 0.3; // the coil: rolled (as bought) · pressed flat
const ZX = [0.2, 11.2]; // the zipper along the seam: its top just below the top edge
const XT = 0.3; // the zipper stitching starts by the top
const XE = 8.4; // … and ends where the pull stops the foot: the end of the zipper stitching (the opening)
const PO = XE + 0.6; // the pull (its origin), the zipper open: right below the end of the stitching
const PC = ZX[0] + 0.6; // the pull, the zipper closed: at the top
const STOP = [ZX[1] - 0.35, ZX[1]]; // the bottom stop
const ZS = CW + 0.12; // the zipper stitching, this far from the seam line: close to the coil, on the tape
const LN = 0.06; // a seam on the seam line, drawn this far from the fold
/** The seam below, in an allowance's own (u, v): a little above the end of the zipper stitching and a little to the side
    of it (toward the seam line), then on the seam line to the bottom edge. */
const LOW = [[XE - 0.5, ZS - 0.1], [XE + 0.7, LN], [L - 0.05, LN]];
/** Each tape's end stitched to its own allowance only, in the tape's (and the allowance's) own (u, v). */
const ENDS = [[XE + 0.3, C - 0.25], [ZX[1] - 0.15, C - 0.25]];
const ZIP = [[XT, ZS], [XE, ZS]]; // the zipper stitching (tape and allowance), top to bottom
const SPLAY = 0.15; // the open zipper: its free half splays away from the seam line above the pull
const DB = 2 * SA + 0.6; // piece B lies apart, its seam line this far on −y (steps 1–4)
const Z2 = 0.35; // the zipper laid down a little off the seam line (step 2), then put right on it (step 3)
const LIFT = PW + 0.4; // step 5: what is lifted clears the body turning over under it
const H3 = 2.4, H4 = SA + 0.2; // step 10: piece A lifted while it turns over · piece B lifted while its allowance folds under

/** The drawing's relations, for the tests (tests/guides/sew-a-zipper.test.js). */
export const DRAWING = {
  length: L, body: PW, allowance: SA, tape: C, coil: [CW0, CW], zipper: ZX, top: XT, end: XE, pull: [PO, PC],
  stop: STOP, stitch: ZS, lower: LOW, ends: ENDS, zip: ZIP,
};

const VIEW = [1, 1, 1];
const F = (name) => `url(#${ID}-${name})`;
const PRINT = F('print'), BACK = F('back'); // the fabric: right side · wrong side
const TAPE = F('tape'), COIL = F('coil'), METAL = F('metal'), PULL = F('pull');

/* ---------- Places: a flat piece hinged on its seam line ---------- */

/** A piece's place: its seam line at (y, z), its v axis at angle th (y-z plane), s = which way its right side faces. */
const place0 = (y, z, th, s) => ({ y, z, th, s });
/** Flat on the table: its v axis along +y (dir 1) or −y (dir −1), right side up or down. */
const flat = (y, z, dir, up) => place0(y, z, dir > 0 ? 0 : Math.PI, (up ? 1 : -1) * dir);
/** Rotate a place about the line along x through (yc, zc). */
const rot = (p, yc, zc, a) => {
  if (Math.abs(a) < 1e-9) return p;
  const [y, z] = rot2([p.y, p.z], [yc, zc], a);
  return { ...p, y, z, th: p.th + a };
};
const lift = (p, dz) => (dz ? { ...p, z: p.z + dz } : p);
const slide = (p, dy) => (dy ? { ...p, y: p.y + dy } : p);
/** Which way a place's right side faces, in the world. */
const outOf = (p) => [0, -p.s * Math.sin(p.th), p.s * Math.cos(p.th)];
/** A placed piece (iso.js): its own (u along x, v along its axis). */
const put = (id, pts, p, fill, inner, extra = {}) => ({
  id, pts, O: [0, p.y, p.z], U: [1, 0, 0], V: [0, Math.cos(p.th), Math.sin(p.th)], out: outOf(p), fill, inner, ...extra,
});
/** A place moved this far along its own right-side normal (a pull on the zipper's face). */
const onFace = (p, d) => { const o = outOf(p); return { ...p, y: p.y + o[1] * d, z: p.z + o[2] * d }; };
/** Is the stack's "up" (its right-side normal at rest, now `p`'s) turned to the viewer? */
const toViewer = (p) => { const o = outOf(p); return o[0] * VIEW[0] + o[1] * VIEW[1] + o[2] * VIEW[2] >= 0; };

/* ---------- The pieces ---------- */

const band = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
/** A tape (or its coil), splayed by `k` above the pull: its edge by the seam line moves away from it toward the top. */
const splayed = (x0, x1, v0, v1, k) => (k > 1e-6
  ? [[x0, v0 + k * (XE - x0)], [XE, v0], [x1, v0], [x1, v1], [XE, v1], [x0, v1 + k * (XE - x0)]]
  : band(x0, x1, v0, v1));
/** The pull, round its own origin (on the coils): a body, and its tab along the seam. */
const PULL_PTS = [[-0.5, -0.3], [-0.5, 0.3], [0.9, 0.42], [0.9, 0.2], [2, 0.18], [2, -0.18], [0.9, -0.2], [0.9, -0.42]];

/*
  What is sewn so far: zip ['a', 'b'] — the zipper stitching on each side; lower — the seam below; ends — the tape ends
  to the allowances. Lines are in each piece's own (u, v) and show on both its sides (the needle goes through).
*/
function lines(kind, side, sewn) {
  const ls = [];
  if (kind !== 'body' && sewn.zip?.includes(side)) ls.push({ pts: ZIP, kind: 'stitch', zip: side });
  if (kind === 'allow' && sewn.lower) ls.push({ pts: LOW, kind: 'stitch', lower: true });
  if (kind !== 'body' && sewn.ends) ls.push({ pts: ENDS, kind: 'stitch', ends: true });
  return ls;
}

/*
  Every piece from its places: `pl` { aBody, aAllow, aTape, bBody, bAllow, bTape, pull } (pull: its place on the
  zipper's face), `o` options: sewn, coil (its width), splay (the free half, k), pull x, ghost (the fabric's opacity;
  ga / gb: piece A's / piece B's on their own), zip (the zipper's opacity). → { name: piece }.
*/
function pieces(pl, { sewn = {}, coil = CW, splay = 0, pullX = PO, ghost = 1, ga = ghost, gb = ghost, zip = 1 } = {}) {
  const fab = (id, pts, p, kind, side, o) => put(id, pts, p, PRINT, BACK, { lines: lines(kind, side, sewn), ...(o < 0.999 ? { opacity: o } : {}) });
  const zp = (id, pts, p, fill, extra = {}) => put(id, pts, p, fill, fill, { ...(zip < 0.999 ? { opacity: zip } : {}), ...extra });
  return {
    aBody: fab('piece-a', rect(L, PW), pl.aBody, 'body', 'a', ga),
    aAllow: fab('allowance-a', rect(L, SA), pl.aAllow, 'allow', 'a', ga),
    bBody: fab('piece-b', rect(L, PW), pl.bBody, 'body', 'b', gb),
    bAllow: fab('allowance-b', rect(L, SA), pl.bAllow, 'allow', 'b', gb),
    aTape: zp('zip-tape-a', band(ZX[0], ZX[1], 0, C), pl.aTape, TAPE, { lines: lines('tape', 'a', sewn) }),
    aCoil: zp('zip-coil-a', band(ZX[0], STOP[0], 0, coil), pl.aTape, COIL),
    bTape: zp('zip-tape-b', splayed(ZX[0], ZX[1], 0, C, splay), pl.bTape, TAPE, { lines: lines('tape', 'b', sewn) }),
    bCoil: zp('zip-coil-b', splayed(ZX[0], STOP[0], 0, coil, splay), pl.bTape, COIL),
    stop: zp('zip-stop-bottom', band(STOP[0], STOP[1], -0.25, 0.25), onFace(pl.bTape, 0.03), METAL),
    pull: zp('zip-pull', PULL_PTS.map(([u, v]) => [u + pullX, v]), pl.pull, PULL),
  };
}

/** Only what can be seen: a piece faded to nothing is dropped, not drawn at opacity ~0. */
const seen = (ps) => ps.filter((p) => p && (p.opacity ?? 1) > 0.01);
/** Layers of a stack, bottom to top at rest; reversed once the stack is turned away from the viewer (`ref` its place). */
const stack = (layers, ref) => (toViewer(ref) ? layers : [...layers].reverse()).flat();

/* ---------- The poses ---------- */

/** P: piece A right side up, its allowance flat; piece B apart (dy: where its seam line is); the zipper on A (dz above). */
function poseP({ dy = -DB, zy = 0, zz = 0 } = {}) {
  const aTape = flat(zy, T + zz, -1, false), bTape = flat(zy, T + zz, 1, false);
  return {
    aBody: flat(0, 0, 1, true), aAllow: flat(0, 0, -1, true), bBody: flat(dy, 0, -1, true), bAllow: flat(dy, 0, 1, true),
    aTape, bTape, pull: onFace(bTape, 0.04),
  };
}
/** WB: B right side up (its allowance flat, the free tape face down on it); A over it, right sides together, its
    allowance folded back on top with the sewn half of the zipper. */
function poseWB() {
  const bTape = flat(0, T, 1, false);
  return {
    aBody: flat(0, T, -1, false), aAllow: flat(0, 2 * T, -1, true), aTape: flat(0, 3 * T, -1, false),
    bBody: flat(0, 0, -1, true), bAllow: flat(0, 0, 1, true), bTape, pull: onFace(bTape, 0.04),
  };
}
const FOLD = 2.5 * T; // A's allowance turns about the seam line at this height between WB and S
/** A's allowance and its half of the zipper turned by `a` about the seam line: 0 = WB (folded back), −π = S. */
function poseFold(a) {
  const p = poseWB();
  return { ...p, aAllow: rot(p.aAllow, 0, FOLD, a), aTape: rot(p.aTape, 0, FOLD, a) };
}
/** R: the finished seam, right side up: the bodies on top, each allowance under its own body, the zipper under them. */
function poseR() {
  const bTape = flat(0, T, -1, true);
  return {
    aBody: flat(0, 3 * T, 1, true), aAllow: flat(0, 2 * T, 1, false), aTape: flat(0, T, 1, true),
    bBody: flat(0, 3 * T, -1, true), bAllow: flat(0, 2 * T, -1, false), bTape, pull: { ...flat(0, 3 * T + 0.05, -1, true) },
  };
}

/* Painter's orders (each list bottom to top), by pose. */
const orderP = (q) => [q.bBody, q.bAllow, q.aBody, q.aAllow, q.pull, q.stop, q.aTape, q.aCoil, q.bTape, q.bCoil];
const orderWB = (q, aRef) => [q.bBody, q.bAllow, q.pull, q.stop, q.aBody, q.bTape, q.bCoil,
  ...stack([[q.aAllow], [q.aTape, q.aCoil]], aRef)];
/** R (the finished seam), the pull on top. */
const orderR = (q) => [q.bTape, q.bCoil, q.stop, q.bAllow, q.bBody, q.aTape, q.aCoil, q.aAllow, q.aBody, q.pull];

/* ---------- The END VIEW: across the seam (through the zipper), layers drawn apart ---------- */

function section(ps) {
  const ZK = 3; // heights drawn three times thicker than life, so the layers read apart
  const segs = [];
  for (const p of ps) {
    if (!/^(piece|allowance|zip-tape)/.test(p.id) || (p.opacity ?? 1) < 0.3) continue;
    const vs = p.pts.map((q) => q[1]);
    const a = at(p, XE / 2, Math.min(...vs)), b = at(p, XE / 2, Math.max(...vs));
    segs.push({ a: [a[1], a[2] * ZK], b: [b[1], b[2] * ZK] });
    if (/^zip-tape/.test(p.id)) { const c = at(p, XE / 2, 0); segs.push({ a: [c[1], c[2] * ZK - 0.3], b: [c[1], c[2] * ZK + 0.3] }); } // the coil
  }
  return { segs, range: [-3, 3] };
}

/* ---------- Steps ---------- */

/** World points of a path in a placed piece's own (u, v). */
const onPiece = (p, path) => path.map(([u, v]) => at(p, u, v));

/* Step 1: the seam stays open — the two pieces lie apart, right side up; the zipper goes in first. */
function stepOpen(t) {
  const a = span(t, 0.04, 0.24), b = span(t, 0.14, 0.34);
  const pl = poseP();
  const q = pieces({ ...pl, aBody: lift(pl.aBody, (1 - a) * 3), aAllow: lift(pl.aAllow, (1 - a) * 3), bBody: lift(pl.bBody, (1 - b) * 3), bAllow: lift(pl.bAllow, (1 - b) * 3) }, { zip: 0, ga: a, gb: b });
  const seam = (y) => [[0.05, y, 0.01], [L - 0.05, y, 0.01]];
  const hot = span(t, 0.44, 0.52) * (1 - span(t, 0.9, 0.96));
  return {
    pieces: seen(orderP(q)),
    over: [
      { type: 'line', pts: seam(0), kind: 'hot', o: hot },
      { type: 'line', pts: seam(-DB), kind: 'hot', o: hot },
      { type: 'label', p: [L * 0.3, -SA - 0.3, 0], label: 'seamOpen', o: span(t, 0.46, 0.52), dy: -8, hot: true },
      { type: 'label', p: [L * 0.8, PW * 0.5, 0], label: 'zipperFirst', o: span(t, 0.66, 0.72), dy: 8, hot: true },
    ],
  };
}

/* Step 2: the zipper opened and laid face down (its back up) by the seam line; the coil pressed flat with a barely warm iron. */
function stepPress(t) {
  const come = span(t, 0.04, 0.3);
  const press = span(t, 0.5, 0.8);
  const q = pieces(poseP({ zy: -Z2, zz: (1 - come) * 2.5 }), { zip: come, coil: CW0 + (CW - CW0) * press, splay: SPLAY });
  const coil = (s) => onPiece(q.aTape, [[ZX[0] + 0.2, s], [STOP[0] - 0.2, s]]);
  return {
    pieces: seen(orderP(q)),
    over: [
      { type: 'line', pts: coil(CW / 2), kind: 'hot', o: span(t, 0.46, 0.52) * (1 - span(t, 0.86, 0.92)) },
      { type: 'label', p: at(q.bTape, 4.5, C + 0.9), label: 'openZip', o: span(t, 0.12, 0.18) * (1 - span(t, 0.4, 0.44)), dy: -6, hot: true },
      { type: 'label', p: at(q.aTape, XE * 0.55, C), label: 'fromBack', o: span(t, 0.42, 0.48), dy: 10, hot: true },
      { type: 'label', p: at(q.bTape, XE * 0.45, C + 0.6), label: 'coolIron', o: span(t, 0.54, 0.6), dy: -9, hot: true },
    ],
  };
}

/* Step 3: the zipper face down on the right side of piece A, its coil right on the seam line; pinned. */
function stepPlace(t) {
  const mv = span(t, 0.12, 0.42);
  const q = pieces(poseP({ zy: -Z2 * (1 - mv) }), { splay: SPLAY });
  return {
    pieces: seen(orderP(q)),
    over: [
      { type: 'line', pts: [[ZX[0], 0, 0.01], [STOP[0], 0, 0.01]], kind: 'hot', o: span(t, 0.04, 0.1) * (1 - span(t, 0.46, 0.52)) },
      { type: 'label', p: at(q.aTape, XE * 0.5, C), label: 'faceDown', o: span(t, 0.08, 0.14) * (1 - span(t, 0.44, 0.48)), dy: 10, hot: true },
      { type: 'label', p: [XE * 0.6, 0, T], label: 'coilOnSeam', o: span(t, 0.5, 0.56), dy: 11, hot: true },
    ],
    inset: section(orderP(q)),
  };
}

/** The stitching overlay: down the side, close to the coil, then a backstitch at the pull (a tape's own (u, v)). */
const RUN = [[XT, ZS], [XE, ZS], [XE - 0.7, ZS], [XE, ZS]];

/* Step 4: the invisible zipper foot, the coil in one groove; from top to bottom until the pull stops the foot; backstitch. */
function stepSideA(t) {
  const sew = span(t, 0.2, 0.82);
  const q = pieces(poseP({ dy: -DB }), { splay: SPLAY, sewn: t > 0.82 ? { zip: ['a'] } : {} });
  return {
    pieces: seen(orderP(q)),
    over: [
      { type: 'line', pts: onPiece(q.aTape, RUN), t: sew, kind: 'hot', o: span(t, 0.16, 0.2) * (1 - span(t, 0.86, 0.92)) },
      { type: 'label', p: at(q.aTape, XE * 0.3, C), label: 'oneGroove', o: span(t, 0.04, 0.1) * (1 - span(t, 0.3, 0.34)), dy: 10, hot: true },
      { type: 'label', p: at(q.aTape, XE * 0.4, C), label: 'topDown', o: span(t, 0.32, 0.38) * (1 - span(t, 0.58, 0.62)), dy: 10, hot: true },
      { type: 'label', p: [PO, 0, T], label: 'toPull', o: span(t, 0.6, 0.66), dx: 6, dy: 11, hot: true },
    ],
  };
}

/*
  Step 5: the other side. A's allowance and the zipper lift out of the way; piece A turns over onto the other side, right
  side down; piece B slides in under it, right side up; then A's allowance with the sewn half comes down folded back on
  top of A, and the free half of the zipper face down on B's allowance, its coil on B's seam line; the top edges level.
*/
function stepSideB(t) {
  const up = span(t, 0.04, 0.22), turn = span(t, 0.24, 0.6), come = span(t, 0.32, 0.56), down = span(t, 0.62, 0.8);
  const unsplay = span(t, 0.1, 0.3);
  const P = poseP(), W = poseWB();
  const hov = LIFT * up * (1 - down);
  // what is lifted lands where it lies in WB: A's allowance and its tape two layers higher, the free tape as it was
  const aAllow = lift(P.aAllow, hov + 2 * T * down), aTape = lift(P.aTape, hov + 2 * T * down);
  const bTape = lift(P.bTape, hov);
  const pl = {
    aBody: rot(P.aBody, 0, T / 2, Math.PI * turn), aAllow, aTape, bTape, pull: onFace(bTape, 0.04),
    bBody: slide(P.bBody, DB * come), bAllow: slide(P.bAllow, DB * come),
  };
  const q = pieces(pl, { splay: SPLAY * (1 - unsplay), sewn: { zip: ['a'] } });
  // while lifted, A's allowance lies under the pull (on the free tape's face); once lowered, over it; at rest, as in WB
  const order = down > 0.98 ? orderWB(q, W.aAllow)
    : [q.bBody, q.bAllow, q.aBody, ...(down < 0.3 ? [q.aAllow, q.pull, q.stop, q.bTape, q.bCoil] : [q.pull, q.stop, q.bTape, q.bCoil, q.aAllow]), q.aTape, q.aCoil];
  return {
    pieces: seen(order),
    over: [
      { type: 'line', pts: [[ZX[0], 0, 0.01], [STOP[0], 0, 0.01]], kind: 'hot', o: span(t, 0.8, 0.84) * (1 - span(t, 0.92, 0.96)) },
      { type: 'line', pts: [[0, -PW + 0.2, 0.02], [0, SA - 0.1, 0.02]], kind: 'hot', o: span(t, 0.84, 0.88) },
      { type: 'label', p: [L * 0.68, -PW * 0.55, 0], label: 'otherPiece', o: span(t, 0.36, 0.42) * (1 - span(t, 0.58, 0.62)), hot: true },
      { type: 'label', p: [XE * 0.65, C * 0.7, T], label: 'freeHalf', o: span(t, 0.66, 0.72) * (1 - span(t, 0.84, 0.88)), dx: 6, dy: 10, hot: true },
      { type: 'label', p: [0.6, SA * 0.4, 0], label: 'topsLevel', o: span(t, 0.86, 0.9), dx: 12, dy: -9, hot: true },
      { type: 'label', p: [L * 0.62, -PW * 0.4, 3 * T], label: 'notTwisted', o: span(t, 0.88, 0.92), hot: true },
    ],
    inset: section(order),
  };
}

/* Step 6: the coil in the other groove; from top to bottom until the pull stops the foot; backstitch. */
function stepSideBSew(t) {
  const sew = span(t, 0.2, 0.82);
  const q = pieces(poseWB(), { sewn: { zip: t > 0.82 ? ['a', 'b'] : ['a'] } });
  return {
    pieces: seen(orderWB(q, poseWB().aAllow)),
    over: [
      { type: 'line', pts: onPiece(q.bTape, RUN), t: sew, kind: 'hot', o: span(t, 0.16, 0.2) * (1 - span(t, 0.86, 0.92)) },
      { type: 'label', p: at(q.bTape, XE * 0.55, C), label: 'otherGroove', o: span(t, 0.04, 0.1) * (1 - span(t, 0.3, 0.34)), dx: 8, dy: 10, hot: true },
      { type: 'label', p: at(q.bTape, XE * 0.42, C), label: 'topDown', o: span(t, 0.32, 0.38) * (1 - span(t, 0.58, 0.62)), dx: 4, dy: 10, hot: true },
      { type: 'label', p: [PO, 0, T], label: 'toPull', o: span(t, 0.6, 0.66), dx: 8, dy: 11, hot: true },
    ],
  };
}

const BOTH = ['a', 'b'];

/* Step 7: the zipper closed — the pull goes up to the top. */
function stepClose(t) {
  const mv = span(t, 0.2, 0.75);
  const q = pieces(poseWB(), { sewn: { zip: BOTH }, pullX: PO + (PC - PO) * mv });
  return {
    pieces: seen(orderWB(q, poseWB().aAllow)),
    over: [
      { type: 'label', p: [PO + (PC - PO) * mv + 1, 0, T], label: 'close', o: span(t, 0.1, 0.16), dx: 6, dy: 11, hot: true },
    ],
  };
}

/* Step 8: right sides together (A's allowance turned back over B's); the zipper foot; the seam below, from a little
   above and to the side of the end of the zipper stitching. */
function stepLower(t) {
  const a = span(t, 0.04, 0.3);
  const sew = span(t, 0.38, 0.86);
  const pl = poseFold(-Math.PI * a);
  const q = pieces(pl, { sewn: { zip: BOTH, lower: t > 0.86 }, pullX: PC });
  const order = [q.bBody, q.bAllow, q.pull, q.stop, q.aBody, q.bTape, q.bCoil, ...stack([[q.aAllow], [q.aTape, q.aCoil]], pl.aAllow)];
  return {
    pieces: seen(order),
    over: [
      { type: 'line', pts: onPiece(q.aAllow, LOW), t: sew, kind: 'hot', o: span(t, 0.34, 0.38) * (1 - span(t, 0.9, 0.96)) },
      { type: 'label', p: [L * 0.64, SA * 0.5, 3 * T], label: 'rightSides', o: span(t, 0.12, 0.18) * (1 - span(t, 0.34, 0.38)), hot: true },
      { type: 'label', p: at(q.aAllow, LOW[0][0], LOW[0][1]), label: 'aboveSide', o: span(t, 0.38, 0.44) * (1 - span(t, 0.64, 0.68)), dx: -4, dy: -10, hot: true },
      { type: 'label', p: [(XE + L) / 2 + 1, 0, 3 * T], label: 'zipperFoot', o: span(t, 0.66, 0.72), dx: -2, dy: 10, hot: true },
    ],
    inset: section(order),
  };
}

/* Step 9: A's allowance folded back again; each tape's end stitched to its own seam allowance only. */
function stepEnds(t) {
  const a = span(t, 0.04, 0.3);
  const sa = span(t, 0.38, 0.6), sb = span(t, 0.62, 0.84);
  const pl = poseFold(-Math.PI * (1 - a));
  const q = pieces(pl, { sewn: { zip: BOTH, lower: true, ends: t > 0.84 }, pullX: PC });
  const order = [q.bBody, q.bAllow, q.pull, q.stop, q.aBody, q.bTape, q.bCoil, ...stack([[q.aAllow], [q.aTape, q.aCoil]], pl.aAllow)];
  return {
    pieces: seen(order),
    over: [
      { type: 'line', pts: onPiece(q.aTape, ENDS), t: sa, kind: 'hot', o: span(t, 0.34, 0.38) * (1 - span(t, 0.88, 0.94)) },
      { type: 'line', pts: onPiece(q.bTape, ENDS), t: sb, kind: 'hot', o: span(t, 0.58, 0.62) * (1 - span(t, 0.88, 0.94)) },
      { type: 'label', p: at(q.bTape, (ENDS[0][0] + ENDS[1][0]) / 2, C), label: 'tapeEnds', o: span(t, 0.36, 0.42), dx: 4, dy: 10, hot: true },
    ],
  };
}

/*
  The work from WB to R, by k (0…1): piece A lifts and turns over to its own side, right side up (its allowance and half
  of the zipper under it); piece B lifts, its allowance and the free half fold under it; both come down; the pull comes
  out on top, at the seam line.
*/
function toR(k) {
  const aUp = span(k, 0.04, 0.24), aTurn = span(k, 0.26, 0.52), bUp = span(k, 0.4, 0.56), bFold = span(k, 0.56, 0.74), down = span(k, 0.76, 0.92);
  const pop = span(k, 0.9, 1);
  const W = poseWB();
  const aMove = (p) => lift(rot(lift(p, H3 * aUp), 0, 2 * T + H3, -Math.PI * aTurn), -H3 * down);
  const bLift = H4 * bUp - (H4 - 3 * T) * down;
  const bMove = (p) => rot(lift(p, H4 * bUp), 0, H4 - T / 2, -Math.PI * bFold);
  const bDown = (p) => lift(p, -(H4 - 3 * T) * down);
  const bTape = bDown(bMove(W.bTape));
  const under = onFace(bTape, 0.04);
  const top = flat(0, 3 * T + 0.05, -1, true);
  const pull = { ...under, z: under.z + (top.z - under.z) * pop };
  const pl = {
    aBody: aMove(W.aBody), aAllow: aMove(W.aAllow), aTape: aMove(W.aTape),
    bBody: lift(W.bBody, bLift), bAllow: bDown(bMove(W.bAllow)), bTape, pull,
  };
  return pl;
}
/* Painter's order on the way to R: B's allowance group, B's body, then piece A's stack (it stays above B). */
function orderToR(q, pl) {
  const b = stack([[q.bAllow], [q.stop, ...(pl.pullTop ? [] : [q.pull])], [q.bTape, q.bCoil]], pl.bAllow);
  const a = stack([[q.aBody], [q.aAllow], [q.aTape, q.aCoil]], pl.aAllow);
  return [...b, q.bBody, ...a, ...(pl.pullTop ? [q.pull] : [])];
}

/* Step 10: opened out and turned right side up: from the outside only the seam line and the pull show. */
function stepRight(t) {
  const pl = toR(span(t, 0.04, 0.84));
  pl.pullTop = t > 0.8;
  const q = pieces(pl, { sewn: { zip: BOTH, lower: true, ends: true }, pullX: PC });
  return {
    pieces: seen(orderToR(q, pl)),
    over: [
      { type: 'label', p: [L * 0.62, PW * 0.5, 3 * T], label: 'rightUp', o: span(t, 0.66, 0.72) * (1 - span(t, 0.82, 0.86)), hot: true },
      { type: 'label', p: [PC + 1.4, 0, 3 * T], label: 'onlyPull', o: span(t, 0.86, 0.9), dx: 8, dy: 11, hot: true },
    ],
  };
}

/* ---------- Step 0: the finished seam, right side up — opaque (e = 0, the first frame) or see-through (e = 1) ---------- */

/** The finished invisible zipper; e = 0 as it looks (only the seam line and the pull), 1 the fabric see-through. */
export function anatomy(e = 0) {
  const pl = poseR();
  const q = pieces(pl, { sewn: { zip: BOTH, lower: true, ends: true }, pullX: PC, ghost: 1 - 0.6 * span(e, 0.1, 0.9) });
  return { pieces: seen(orderR(q)), over: [] };
}

/** Numbered pins for the legend, on the finished seam (shown at rest): fabric, seam line, zipper, pull. */
function pins() {
  return [
    { n: 1, p: [L * 0.72, -PW * 0.55, 3 * T] },
    { n: 2, p: [(XE + L) / 2 + 0.8, 0, 3 * T] },
    { n: 3, p: [XE * 0.55, PW * 0.3, 3 * T] },
    { n: 4, p: [PC + 1.2, 0, 3 * T + 0.05] },
  ];
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption, written instruction, the chips drawn in the
  scenes, the legend) lives in zipper-invisible.<lang>.js, index-aligned with this array; zipper-invisible.text.js
  checks that. `scene` draws the step over t = 0…1, `duration` is its animation in seconds, `stitch` — the machine
  stitch, `sew` — when and on what it sews ('groove': the zipper, with the invisible zipper foot — named in the texts,
  never linked: it is not in the catalog; 'zipper': the seam below, with the regular zipper foot; 'seam': the tape ends).
  `uses` — catalog products handy in that step (ids from src/data/products.js, shown as labelled affiliate links under
  the caption): the iron, pins, the machine, the zipper foot (Windman set) for the seam below only.
*/
export const STEPS = [
  {}, // 0: the finished seam (texts: zipper-invisible.<lang>.js)
  { scene: stepOpen, duration: 5.5 },
  { scene: stepPress, duration: 6.5, uses: ['rowenta-travel-iron'] },
  { scene: stepPlace, duration: 5.5, uses: ['beaditive-magnetic-pin-holder'] },
  { scene: stepSideA, duration: 6.5, stitch: 'straight', sew: [[0.2, 0.82, 'groove']], uses: ['janome-1522rd'] },
  { scene: stepSideB, duration: 9, uses: ['beaditive-magnetic-pin-holder'] },
  { scene: stepSideBSew, duration: 6.5, stitch: 'straight', sew: [[0.2, 0.82, 'groove']], uses: ['janome-1522rd'] },
  { scene: stepClose, duration: 4.5 },
  { scene: stepLower, duration: 7.5, stitch: 'straight', sew: [[0.38, 0.86, 'zipper']], uses: ['windman-presser-feet-set', 'janome-1522rd'] },
  { scene: stepEnds, duration: 7, stitch: 'straight', sew: [[0.38, 0.6, 'seam'], [0.62, 0.84, 'seam']], uses: ['janome-1522rd'] },
  { scene: stepRight, duration: 8 },
];

/** Every chip key the drawing uses — each language must have them all (zipper-invisible.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how see-through the fabric is) → { body, viewBox }. L = the texts (zipper-invisible.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  floorAt: () => null, // flat work on the table: no shadow
  shadow: [1, 1],
  fabrics: { groove: '#9fb3c2', zipper: '#9fb3c2', seam: '#9fb3c2' },
  pinsAt: 0, // the pins are on the finished seam: already in the first frame
});

/** Fabric patterns (ids prefixed with the figure's ID), in each piece's own coordinates. */
export const DEFS = `
<defs>
  <pattern id="${ID}-print" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#dfe7ec"/>
    <circle cx=".75" cy=".75" r=".28" fill="#8fa5b4"/><circle cx="2.25" cy="2.25" r=".22" fill="#c98a86"/>
  </pattern>
  <pattern id="${ID}-back" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#f1f4f6"/>
    <rect width="3" height="3" fill="url(#${ID}-print)" opacity=".2"/>
  </pattern>
  <pattern id="${ID}-tape" width="2" height="2" patternUnits="userSpaceOnUse">
    <rect width="2" height="2" fill="#a9bccb"/><path d="M0 1H2" stroke="#97abba" stroke-width=".2"/>
  </pattern>
  <pattern id="${ID}-coil" width=".5" height=".5" patternUnits="userSpaceOnUse">
    <rect width=".5" height=".5" fill="#7d93a3"/><path d="M0 .25H.5" stroke="#e9eef1" stroke-width=".14"/>
  </pattern>
  <linearGradient id="${ID}-metal" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ece6da"/><stop offset="1" stop-color="#8f897f"/>
  </linearGradient>
  <linearGradient id="${ID}-pull" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e8e2d8"/><stop offset="1" stop-color="#9a948c"/>
  </linearGradient>
</defs>`;

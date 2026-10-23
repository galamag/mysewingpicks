/*
  Phone pouch with a flap — the anatomy figure's model and its sewing steps.
  Every number comes from the maker (Vault: «Анатомия изделий — Мини-сумочка для телефона»;
  video https://youtu.be/H4oTNTlq6bg). Change numbers HERE only. Words: pouch.<lang>.js
  (pouch.text.js).

  Two pieces make a "T": the long piece (57 × 19) and, sewn to the middle of its long edge, the
  flap piece (31 × 13); the lining is the same T. The two Ts are sewn right sides together round
  the edge (a 6 cm opening opposite the flap), turned and topstitched. Then the long piece is
  folded in half and stitched 11 and 22 cm from the fold through both halves: two loops and two
  short ends. Opened out, the seams go to the middle and the long piece lies in an accordion — two
  pockets (the loops: cards at the front, money). The flap piece runs under the bottom and up the
  back and comes over the top as the flap: its fold closes the bottom of every pocket, and between it
  and the stack is the third pocket (the phone). Ears (5 × 5 squares, folded into a strip, then into a
  loop) go between the back and the stack at the top; the sides are stitched right on the edge —
  through the back and the layer next to it only, the accordion's folds stay free (END VIEW of
  step 13); a plastic snap closes the flap. Step 15 fills the pockets and hooks a chain on.

  Step 0 is the finished pouch (tap to take it apart); steps 1–15 each animate one stage over
  t = 0…1. Flat work lies on the table (x → right-down, y → left-down): the long piece along x,
  the flap piece towards +y. Shared parts (camera, inset, machine, renderer): kit.js.
*/
import { at, band, lerp, turn } from './iso.js';
import { ease, fadeAll, labelKeys, makeRenderer, rect, rot2, span } from './kit.js';

const ID = 'phone-pouch'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {
  bar: [57, 19], // the long piece: printed cotton, lining and interfacing the same
  stem: [31, 13], // the flap piece: its 13 cm side sewn to the middle of the long piece's long edge
  ear: 5, // two 5 × 5 squares: in half, edges to the fold, in half again — a strip, then into a loop
  ears: 2,
  seam: 0.5, // every seam
  opening: 6, // in the middle of the long edge opposite the flap piece; closed by the topstitching
  topstitch: 0.5, // all round the T
  lines: [11, 22], // stitched through both halves, measured from the fold (the middle)
};

const S = SPEC.seam;
const [BLc, BHc] = SPEC.bar; // 57 × 19 (cut)
const [SLc, SWc] = SPEC.stem; // 31 × 13 (cut)
const C = BLc / 2; // 28.5: the middle of the long piece (where the flap piece goes, where it folds)
const BH = BHc - 2 * S; // 18: the long piece's height, sewn
const SW = SWc - 2 * S; // 12: the flap piece's width, sewn
const SL = SLc - 2 * S; // 30: the flap piece's length beyond the long piece, sewn
const [L1, L2] = SPEC.lines;
const YB = BHc - S; // 18.5: the seam that joins the flap piece (and, sewn, the long piece's edge)
const YE_CUT = YB + SLc - S; // 49: the flap piece's raw end
const RC = 3; // the flap's round corners (drawing: "any round object" — no size)
const T = 0.18; // fabric thickness in the drawing (cm)

/* The finished pouch, for the drawing only — never published. */
const W = SW; // width (the flap piece's width)
const D = 2.6; // thickness with three pockets (drawing)
const H = BH; // height (the long piece's height)
const FL = SL - H - 2 * D; // how far the flap comes down the front (drawing)
const TH = 1; // the folded pockets lying flat on the table (drawing)
const SNAP_R = 0.55;
const SNAP_ON_FLAP = FL - SPEC.topstitch - 0.2; // the snap on the flap: in the middle, on the topstitching
const SNAP_Z = H + T - SNAP_ON_FLAP; // …and where it lands on the front

const F = (name) => `url(#${ID}-${name})`;
const PRINT = F('print'), BACK = F('back'); // the outer cotton: right side, wrong side (interfacing)
const LIN = F('lining'), LIN_BACK = F('liningBack');
const IFACE = F('iface'), LID = F('lid'), SNAP = F('snap'), STEEL = F('steel');
const CLIP = '#7f9469';

/* ---------- Shapes ---------- */

const arc = (cx, cy, r, a0, a1, n = 10) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

/*
  The T outline in table coordinates, `e` in from the raw edge: the long piece [e, 57 − e] ×
  [e, yb], the flap piece [22 + e, 35 − e] up to ye, its end corners rounded by r (0 = square).
  cut: e 0, yb 19, ye 49 · sewn: e 0.5, yb 18.5, ye 48.5 · topstitching: e 1, yb 18, ye 48.
*/
function outline(e, yb, ye, r) {
  const x0 = e, x1 = BLc - e, y0 = e, sx0 = C - SWc / 2 + e, sx1 = C + SWc / 2 - e;
  const end = r > 0 ? [...arc(sx1 - r, ye - r, r, 0, Math.PI / 2), ...arc(sx0 + r, ye - r, r, Math.PI / 2, Math.PI)] : [[sx1, ye], [sx0, ye]];
  return [[x0, y0], [x1, y0], [x1, yb], [sx1, yb], ...end, [sx0, yb], [x0, yb]];
}
const CUT_T = (round = false) => outline(0, BHc, YE_CUT, round ? RC + S : 0);
const SEWN_T = outline(S, YB, YE_CUT - S, RC);
const TOP_T = outline(S + SPEC.topstitch, YB - SPEC.topstitch, YE_CUT - S - SPEC.topstitch, RC - SPEC.topstitch);

/** A flat piece on the table, right side (`fill`) up or down. */
const table = (id, pts, z, fill, inner, up = true, extra = {}) =>
  ({ id, pts, O: [0, 0, z], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, up ? 1 : -1], fill, inner, ...extra });
/** The same piece shifted on the table. */
const at2 = (p, dx, dy, dz = 0) => ({ ...p, O: [p.O[0] + dx, p.O[1] + dy, p.O[2] + dz] });
const onTop = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const closed = (pts) => [...pts, pts[0]];

/* ---------- The finished pouch, standing ---------- */

/*
  The pouch stands centred on `o`: front y = +D/2 (the long piece's middle, printed), back
  y = −D/2 (the flap piece), the flap over the top. `c` 0 = the flap stands up open, 1 = closed
  down the front. The flap is two flat parts: over the top (D) and down the front (FL).
*/
function flapParts(c) {
  const a1 = (Math.PI / 2) * Math.min(1, 2 * c), a2 = (Math.PI / 2) * Math.max(0, 2 * c - 1);
  const d1 = [Math.sin(a1), Math.cos(a1)]; // (y, z): up when open, towards the front when closed
  const th2 = Math.PI / 2 - a1 - a2;
  const d2 = [Math.cos(th2), Math.sin(th2)];
  const h1 = [-D / 2, H + T], len1 = D + 2 * T;
  const h2 = [h1[0] + d1[0] * len1, h1[1] + d1[1] * len1];
  return { d1, d2, h1, h2, len1 };
}

const flapEnd = (len, r) => [[0, 0], [W, 0], ...arc(W - r, len - r, r, 0, Math.PI / 2), ...arc(r, len - r, r, Math.PI / 2, Math.PI), [0, len - r]];
const flapStitch = (len, r) => {
  const e = SPEC.topstitch;
  return [[e, 0], [e, len - r], ...arc(r, len - r, r - e, Math.PI, Math.PI / 2), ...arc(W - r, len - r, r - e, Math.PI / 2, 0), [W - e, 0]];
};

/** The snap: a small round button (both sides look the same). */
const snapDisc = (id, O, U, V) => ({ id, pts: arc(0, 0, SNAP_R, 0, 2 * Math.PI, 16), O, U, V, out: crossOut(U, V), fill: SNAP, inner: SNAP, lines: [{ pts: arc(0, 0, SNAP_R * 0.45, 0, 2 * Math.PI, 12), kind: 'seam' }] });
const crossOut = (U, V) => [U[1] * V[2] - U[2] * V[1], U[2] * V[0] - U[0] * V[2], U[0] * V[1] - U[1] * V[0]];

/** An ear: the folded loop sticking out of the side edge, in the plane of the back. */
const EAR_Z = H - 2.6, EAR_W = SPEC.ear / 4, EAR_OUT = 1.7;
function earPiece(id, side, o, y, extra = {}) {
  const x = side > 0 ? W / 2 - 0.6 : -W / 2 + 0.6;
  const len = EAR_OUT + 0.6;
  const pts = [[0, 0], [len - EAR_W / 2, 0], ...arc(len - EAR_W / 2, EAR_W / 2, EAR_W / 2, -Math.PI / 2, Math.PI / 2, 8), [0, EAR_W]];
  return { id, pts, O: [o[0] + x, o[1] + y, o[2] + EAR_Z], U: [side, 0, 0], V: [0, 0, 1], out: [0, side > 0 ? 1 : -1, 0], fill: PRINT, inner: PRINT, lines: [{ pts: [[0, EAR_W / 2], [len - EAR_W / 2, EAR_W / 2]], kind: 'fold' }], ...extra };
}
/** A snap hook on an ear's tip. */
const HOOK_X = W / 2 + EAR_OUT - 0.1, HOOK_Z = EAR_Z + EAR_W / 2 + 0.2;
function hook(id, side, o, y) {
  const pts = [[-0.5, -0.4], [0.5, -0.4], [0.5, 1.4], ...arc(0, 1.4, 0.5, 0, Math.PI, 6), [-0.5, -0.4]];
  const O = [o[0] + side * HOOK_X, o[1] + y, o[2] + HOOK_Z];
  return { id, pts, O, U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], fill: STEEL, inner: STEEL, lines: [{ pts: [[-0.2, -0.1], [-0.2, 1.4]], kind: 'seam' }] };
}
/** The chain: a thin band from hook to hook, rising over the pouch (in the plane of the back); drawn last. */
function chainPiece(o, y) {
  const n = 32, rise = 6;
  const c = Array.from({ length: n + 1 }, (_, i) => {
    const s = i / n;
    return [-HOOK_X + 2 * HOOK_X * s, 1.9 + rise * (1 - (2 * s - 1) ** 2)];
  });
  return { id: 'chain', pts: band(c, 0.32).pts, O: [o[0], o[1] + y + 0.05, o[2] + HOOK_Z], U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], fill: STEEL, inner: STEEL, lines: [{ pts: c, kind: 'chain' }] };
}

/*
  The pouch: { o, c (flap closed), apart (0…1, step 0), snapFlap, snapFront, chain, ears } → pieces,
  painted far to near. Apart, the layers move back and up in a staircase (front, the two pocket
  dividers, the back with its flap open) and the interfacing slides out to the left.
*/
/*
  What goes in (the last step): a phone, a banknote, a bank card — everyday things, drawn only to
  show which pocket takes what (not the maker's numbers). Each one stands in the plane of its pocket.
*/
const PHONE_SIZE = [7, 14.5], NOTE_SIZE = [10, 5.4], CARD_SIZE = [8.5, 5.4];
const POCKET_Y = { phone: -D / 3, money: 0, card: D / 3 };
const rounded = (w, h, r) => [...arc(w - r, r, r, -Math.PI / 2, 0, 4), ...arc(w - r, h - r, r, 0, Math.PI / 2, 4), ...arc(r, h - r, r, Math.PI / 2, Math.PI, 4), ...arc(r, r, r, Math.PI, 1.5 * Math.PI, 4)];
/** One thing going into its pocket: `k` 0 = above the pouch (faded in), 1 = all the way in. */
function thing(kind, P, k) {
  const [w, h] = kind === 'phone' ? PHONE_SIZE : kind === 'money' ? NOTE_SIZE : CARD_SIZE;
  // it comes in sticking out of its pocket, stays a moment (half in), then slides all the way down
  const z0 = kind === 'phone' ? H - h + 6 : H + 1.5, z1 = H - h * 0.5;
  const z = k < 0.6 ? lerp(z0, z1, ease(k / 0.45)) : lerp(z1, 0.6, ease((k - 0.6) / 0.4)), y = POCKET_Y[kind] + 0.02;
  const O = P(-w / 2, y, z), base = { U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], opacity: span(k, 0, 0.12) };
  if (kind === 'phone') {
    return [
      { ...base, id: 'phone', pts: rounded(w, h, 0.9), O, fill: '#3d3a40', inner: '#3d3a40' },
      { ...base, id: 'phone-screen', pts: rounded(w - 0.8, h - 1.6, 0.5), O: [O[0] + 0.4, O[1] + 0.02, O[2] + 0.8], fill: F('screen'), inner: F('screen') },
    ];
  }
  if (kind === 'money') {
    return [{ ...base, id: 'money', pts: rect(w, h), O, fill: F('note'), inner: F('note'), lines: [{ pts: arc(w / 2, h / 2, 1.5, 0, 2 * Math.PI, 16), kind: 'seam' }, { pts: [[0.6, 0.6], [w - 0.6, 0.6], [w - 0.6, h - 0.6], [0.6, h - 0.6], [0.6, 0.6]], kind: 'seam' }] }];
  }
  return [
    { ...base, id: 'card', pts: rounded(w, h, 0.45), O, fill: '#5f7fa3', inner: '#5f7fa3', lines: [{ pts: [[0.8, 1.2], [w - 0.8, 1.2]], kind: 'seam' }] },
    { ...base, id: 'card-chip', pts: rounded(1.3, 1, 0.15), O: [O[0] + 1, O[1] + 0.02, O[2] + h - 2.4], fill: '#d9b45a', inner: '#d9b45a' },
  ];
}

function pouch({ o = [0, 0, 0], c = 1, apart = 0, snapFlap = 1, snapFront = 1, chain = 0, ears = 1, earOut = 0, chainDrop = 0, things = null } = {}) {
  const P = (dx, dy, dz) => [o[0] + dx, o[1] + dy, o[2] + dz];
  const k = apart;
  // layer offsets when apart: [dx, dy, dz]
  const off = (i) => [i * 2.5 * k, -i * 4 * k, i * 4.5 * k];
  const back = off(3), div2 = off(2), div1 = off(1), front = off(0);
  const pieces = [];
  const yEar = -D / 2 + 0.4;
  const earO = (side) => [o[0] + side * earOut * 3 + back[0], o[1] + back[1], o[2] + back[2]];
  const hookO = [o[0] + back[0], o[1] + back[1], o[2] + back[2] + chainDrop * 4];
  // the flap (over the top and down the front), riding with the back: painted with the back while it
  // stands open behind the pouch, last once it is down over the front
  const f = flapParts(c);
  const bo = [back[0], back[1], back[2]];
  const flapO = (h) => P(-W / 2 + bo[0], h[0] + bo[1], h[1] + bo[2]);
  const seg1 = {
    id: 'flap-top', pts: rect(W, f.len1), O: flapO(f.h1), U: [1, 0, 0], V: [0, f.d1[0], f.d1[1]], out: outwardOf(f.d1), fill: PRINT, inner: LIN,
    lines: [{ pts: [[0.5, 0], [0.5, f.len1]], kind: 'stitch', side: 'out' }, { pts: [[W - 0.5, 0], [W - 0.5, f.len1]], kind: 'stitch', side: 'out' }],
  };
  const seg2 = { id: 'flap-front', pts: flapEnd(FL, RC), O: flapO(f.h2), U: [1, 0, 0], V: [0, f.d2[0], f.d2[1]], out: outwardOf(f.d2), fill: PRINT, inner: LIN, lines: [{ pts: flapStitch(FL, RC), kind: 'stitch', side: 'out' }] };
  const flap = [seg1, seg2];
  if (snapFlap > 0.001) {
    const sp = [f.h2[0] + f.d2[0] * SNAP_ON_FLAP, f.h2[1] + f.d2[1] * SNAP_ON_FLAP];
    const nn = seg2.out;
    flap.push({ ...snapDisc('snap-flap', P(bo[0], sp[0] + bo[1] + nn[1] * 0.05, sp[1] + bo[2] + nn[2] * 0.05), [1, 0, 0], [0, f.d2[0], f.d2[1]]), opacity: snapFlap });
  }
  const flapBehind = c < 0.5;
  // far: the left ear and its hook
  if (ears > 0.001) {
    pieces.push(earPiece('ear-l', -1, earO(-1), yEar, { opacity: ears }));
    if (chain > 0.001) pieces.push({ ...hook('hook-l', -1, hookO, yEar), opacity: chain });
  }
  // the back (the flap piece going up the back); its lining faces the pockets
  pieces.push({ id: 'back', pts: rect(W, H), O: P(-W / 2 + back[0], -D / 2 + back[1], back[2]), U: [1, 0, 0], V: [0, 0, 1], out: [0, -1, 0], fill: PRINT, inner: LIN });
  if (flapBehind) pieces.push(...flap);
  // the pocket openings at the top (only seen with the flap open)
  if (c < 0.999 && k < 0.5) {
    const top = { id: 'top', pts: rect(W, D), O: P(-W / 2, -D / 2, H - 0.05), U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], fill: LIN_BACK, inner: LIN_BACK, lines: [1, 2].map((i) => ({ pts: [[0.2, (D * i) / 3], [W - 0.2, (D * i) / 3]], kind: 'edge' })) };
    pieces.push(top);
  }
  // what goes in, back pocket first — the front hides what is already inside
  if (things) for (const kind of ['phone', 'money', 'card']) if (things[kind] > 0.001 && things[kind] < 0.999) pieces.push(...thing(kind, P, things[kind]));
  // the pocket dividers: the joined faces of the loops — lining on both sides
  const divider = (id, d, y, op) => ({ id, pts: rect(W, H - 0.3), O: P(-W / 2 + d[0], y + d[1], d[2]), U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], fill: LIN, inner: LIN, opacity: op, lines: [{ pts: [[W / 2, 0.3], [W / 2, H - 0.6]], kind: 'seam' }] });
  const dk = span(k, 0, 0.3);
  if (dk > 0.001) pieces.push(divider('div2', div2, -D / 6, dk), divider('div1', div1, D / 6, dk));
  // the interfacing (apart only): on the wrong side of the outer, slid out to the left
  if (k > 0.001) pieces.push({ id: 'iface', pts: rect(W - 0.4, H - 0.4), O: P(-W / 2 - 15 * k, D / 2 + 1.5 * k, 0.2 + 3 * k), U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], fill: IFACE, inner: IFACE, opacity: span(k, 0.2, 0.7) });
  // the front: the long piece's middle, topstitched along the top edge
  pieces.push({
    id: 'front', pts: rect(W, H), O: P(-W / 2 + front[0], D / 2 + front[1], front[2]), U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], fill: PRINT, inner: LIN,
    lines: [{ pts: [[0.3, H - SPEC.topstitch], [W - 0.3, H - SPEC.topstitch]], kind: 'stitch', side: 'out' }, { pts: [[0.15, 0.2], [0.15, H - 0.2]], kind: 'stitch', side: 'out' }, { pts: [[W - 0.15, 0.2], [W - 0.15, H - 0.2]], kind: 'stitch', side: 'out' }],
  });
  if (snapFront > 0.001) pieces.push({ ...snapDisc('snap-front', P(front[0], D / 2 + 0.03 + front[1], front[2] + SNAP_Z), [1, 0, 0], [0, 0, 1]), opacity: snapFront });
  // the right side: the stitched edges of every layer
  if (k < 0.999) {
    pieces.push({ id: 'side', pts: rect(D, H), O: P(W / 2, -D / 2, 0), U: [0, 1, 0], V: [0, 0, 1], out: [1, 0, 0], fill: PRINT, inner: PRINT, opacity: 1 - span(k, 0, 0.2), lines: [1, 2].map((i) => ({ pts: [[(D * i) / 3, 0.2], [(D * i) / 3, H - 0.2]], kind: 'seam' })) });
  }
  if (ears > 0.001) pieces.push(earPiece('ear-r', 1, earO(1), yEar, { opacity: ears }));
  if (!flapBehind) pieces.push(...flap);
  if (ears > 0.001 && chain > 0.001) pieces.push({ ...hook('hook-r', 1, hookO, yEar), opacity: chain }, { ...chainPiece(hookO, yEar), opacity: chain });
  return pieces;
}

/** A flap part's outward normal (its printed side): along d = (y, z) turned a quarter — back when it points up. */
const outwardOf = (d) => [0, -d[1], d[0]];

/* ---------- Step 0: the finished pouch, together (e = 0) or apart (e = 1) ---------- */

function anatomy(e = 0) {
  const k = span(e, 0, 0.85);
  return { pieces: pouch({ c: 1 - span(e, 0.1, 0.7), apart: k, chain: 1 - span(e, 0, 0.3), earOut: span(e, 0.2, 0.9) }), over: [] };
}

/** Numbered pins for the legend (shown when apart). Order = the legend in pouch.<lang>.js. */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  const mid = (p, s = 0.5, t = 0.5) => {
    const xs = p.pts.map((q) => q[0]), ys = p.pts.map((q) => q[1]);
    return at(p, lerp(Math.min(...xs), Math.max(...xs), s), lerp(Math.min(...ys), Math.max(...ys), t));
  };
  return [
    { n: 1, p: mid(byId.front, 0.3, 0.3) }, // outer
    { n: 2, p: mid(byId.iface, 0.4, 0.6) }, // interfacing
    { n: 3, p: mid(byId.back, 0.75, 0.88) }, // lining (inside the back)
    { n: 4, p: mid(byId['flap-front'], 0.5, 0.5) }, // flap
    { n: 5, p: mid(byId.div1, 0.75, 0.85) }, // pockets
    { n: 6, p: mid(byId['ear-r'], 0.75, 0.5) }, // ears
    { n: 7, p: mid(byId['snap-front'], 0.5, 0.5) }, // snap
  ];
}

/* ---------- Step 1: cut — on a board facing the viewer ---------- */

const board = (id, pts, x, z, fill, extra = {}) =>
  ({ id, pts, O: [x, 0, z], U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], fill, inner: fill, ...extra });

// one row, every piece standing: the long pieces (outer, lining, interfacing), then the flap pieces, then the squares
const BAR_X = [0, 24, 48];
const STEM_X = [72, 89, 106], STEM_Z = 13;
const EAR_X = 124, EAR_ZS = [26, 18];

function stepCut(t) {
  const a = (i) => span(t, i * 0.07, i * 0.07 + 0.22);
  const drop = (i) => (1 - a(i)) * 6;
  const fills = [PRINT, LIN, IFACE];
  const pieces = [
    ...BAR_X.map((x, i) => board(`cut-bar-${i}`, rect(BHc, BLc), x, drop(i), fills[i], { opacity: a(i) })),
    ...STEM_X.map((x, i) => board(`cut-stem-${i}`, rect(SWc, SLc), x, STEM_Z + drop(3 + i * 0.5), fills[i], { opacity: a(3 + i * 0.5) })),
    ...EAR_ZS.map((z, i) => board(`cut-ear-${i}`, rect(SPEC.ear, SPEC.ear), EAR_X, z + drop(5 + i * 0.4), PRINT, { opacity: a(5 + i * 0.4) })),
  ];
  const o = span(t, 0.66, 0.9);
  return {
    pieces,
    over: [
      { type: 'dim', a: [0, 0, BLc + 3.5], b: [BHc, 0, BLc + 3.5], label: 'cm19', o },
      { type: 'dim', a: [-3.5, 0, 0], b: [-3.5, 0, BLc], label: 'cm57', o },
      { type: 'dim', a: [STEM_X[0], 0, STEM_Z - 3.5], b: [STEM_X[0] + SWc, 0, STEM_Z - 3.5], label: 'cm13', o },
      { type: 'dim', a: [STEM_X[0] - 2.5, 0, STEM_Z], b: [STEM_X[0] - 2.5, 0, STEM_Z + SLc], label: 'cm31', o },
      { type: 'dim', a: [EAR_X + SPEC.ear + 3, 0, EAR_ZS[0]], b: [EAR_X + SPEC.ear + 3, 0, EAR_ZS[0] + SPEC.ear], label: 'cm5', o, hot: true },
      { type: 'label', p: [BAR_X[0] + BHc / 2, 0, BLc * 0.84], label: 'outerPrint', o, dx: 15 },
      { type: 'label', p: [BAR_X[1] + BHc / 2, 0, BLc * 0.84], label: 'liningSame', o, dx: 10 },
      { type: 'label', p: [BAR_X[2] + BHc / 2, 0, BLc * 0.84], label: 'ifaceSame', o },
      { type: 'label', p: [STEM_X[1] + SWc / 2, 0, STEM_Z + SLc * 0.55], label: 'flapPieces', o },
      { type: 'label', p: [EAR_X + SPEC.ear / 2, 0, EAR_ZS[1] - 4], label: 'ears2', o, dx: -8 },
    ],
  };
}

/* ---------- Steps 2–3: interfacing; the T ---------- */

// the flap piece's place before it is sewn on: below the long piece
const STEM_FLAT_Y = BHc + 3;

function stepIface(t) {
  const drop = span(t, 0.1, 0.36), drop2 = span(t, 0.2, 0.46), iron = span(t, 0.5, 0.56) * (1 - span(t, 0.7, 0.74));
  const sx = C - SWc / 2;
  return {
    pieces: [
      table('if-bar', rect(BLc, BHc), 0, PRINT, BACK, false),
      table('if-stem', rect(SWc, SLc), 0, PRINT, BACK, false, { O: [sx, STEM_FLAT_Y, 0] }),
      table('if-iface-bar', rect(BLc, BHc), T + (1 - drop) * 10, IFACE, IFACE, true, { opacity: drop }),
      table('if-iface-stem', rect(SWc, SLc), T + (1 - drop2) * 10, IFACE, IFACE, true, { O: [sx, STEM_FLAT_Y, T + (1 - drop2) * 10], opacity: drop2 }),
    ],
    over: [
      { type: 'label', p: [C, BHc / 2, 0], label: 'wrongSideUp', o: span(t, 0.02, 0.06) * (1 - span(t, 0.12, 0.16)) },
      { type: 'label', p: [C, BHc / 2, T], label: 'ironOn', o: iron, hot: true },
      { type: 'label', p: [C, STEM_FLAT_Y + SLc / 2, T], label: 'outerOnly', o: span(t, 0.78, 0.84) },
    ],
  };
}

/*
  Step 3: the flap piece face down across the middle of the long piece, its end on the long edge;
  sew 0.5 cm along that edge; open it out → the T. The lining's T (the same) shows behind.
*/
function stepT(t) {
  const lay = span(t, 0.04, 0.24), sew = span(t, 0.3, 0.52), flip = span(t, 0.58, 0.78), lin = span(t, 0.84, 0.96);
  const sx = C - SWc / 2;
  // the flap piece, face down across the long piece: its raw end on y = 19, the rest over the long piece and beyond
  const stem0 = { id: 't-stem', pts: rect(SWc, SLc), O: [sx, BHc - SLc, T + (1 - lay) * 8], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, -1], fill: PRINT, inner: BACK, opacity: lay };
  const stem = turn(stem0, [0, YB, T * 1.5], [1, 0, 0], -Math.PI * flip);
  const pieces = [];
  if (lin > 0.001) pieces.push(at2(table('t-lin', CUT_T(), -T, LIN, LIN_BACK, true, { opacity: lin }), -4, -4));
  pieces.push(table('t-bar', rect(BLc, BHc), 0, PRINT, BACK, true));
  pieces.push(stem);
  return {
    pieces,
    over: [
      { type: 'label', p: [C, BHc - SLc / 2, T], label: 'faceDown', o: span(t, 0.16, 0.22) * (1 - span(t, 0.3, 0.34)), hot: true },
      { type: 'line', pts: [[sx, YB, 2 * T + 0.05], [sx + SWc, YB, 2 * T + 0.05]], t: sew, kind: 'hot' },
      { type: 'dim', a: [sx, BHc + 2.5, 0], b: [sx + SWc, BHc + 2.5, 0], label: 'cm13', o: span(t, 0.3, 0.36) * (1 - span(t, 0.56, 0.6)), hot: true },
      { type: 'label', p: [sx + SWc, YB, T], label: 'seam05', o: span(t, 0.4, 0.46) * (1 - span(t, 0.56, 0.6)), dx: 12, dy: -6 },
      { type: 'label', p: [C, YB + SLc / 2, T], label: 'openOut', o: span(t, 0.68, 0.74) * (1 - span(t, 0.84, 0.88)) },
      { type: 'label', p: [-4, -4, 0], label: 'liningSameT', o: lin, dx: 8, dy: -6 },
    ],
    focus: { pts: [[sx - 6, YB - 6, 0], [sx + SWc + 6, YB + 6, 0]], k: 0.45 * span(t, 0.26, 0.32) * (1 - span(t, 0.54, 0.6)) },
  };
}

/* ---------- Steps 4–7: the two Ts, round the flap, sew round, turn, topstitch ---------- */

function stepRound(t) {
  const drop = span(t, 0.04, 0.24);
  const lidR = span(t, 0.3, 0.36) * (1 - span(t, 0.62, 0.68)), lidL = span(t, 0.46, 0.5) * (1 - span(t, 0.62, 0.68));
  const traceR = span(t, 0.34, 0.44), traceL = span(t, 0.5, 0.6), trim = span(t, 0.7, 0.84);
  const sx0 = C - SWc / 2, sx1 = C + SWc / 2, r = RC + S, ye = YE_CUT;
  const z = 2 * T;
  const square = [table('r-outer', CUT_T(false), 0, PRINT, BACK, true), table('r-lin', CUT_T(false), T + (1 - drop) * 10, LIN, LIN_BACK, false, { opacity: drop })];
  const round = [table('r-outer-r', CUT_T(true), 0, PRINT, BACK, true), table('r-lin-r', CUT_T(true), T, LIN, LIN_BACK, false)];
  const pieces = trim < 0.999 ? fadeAll(square, 1) : [];
  if (trim > 0.001) pieces.push(...fadeAll(round, trim));
  // the cut-off corners slide away
  if (trim > 0.001 && trim < 0.999) {
    const corner = (id, pts, dx) => table(id, pts, z, LIN, LIN_BACK, false, { O: [dx * trim * 3, trim * 3, z], opacity: 1 - trim });
    pieces.push(corner('r-off-r', [[sx1, ye], [sx1, ye - r], ...arc(sx1 - r, ye - r, r, 0, Math.PI / 2, 6)], 1));
    pieces.push(corner('r-off-l', [[sx0, ye], ...arc(sx0 + r, ye - r, r, Math.PI / 2, Math.PI, 6)], -1));
  }
  const lid = (id, cx, o) => table(id, arc(0, 0, r, 0, 2 * Math.PI, 24), z + 0.1, LID, LID, true, { O: [cx, ye - r, z + 0.1], opacity: o, lines: [{ pts: arc(0, 0, r * 0.75, 0, 2 * Math.PI, 20), kind: 'seam' }] });
  if (lidR > 0.001) pieces.push(lid('lid-r', sx1 - r, lidR));
  if (lidL > 0.001) pieces.push(lid('lid-l', sx0 + r, lidL));
  return {
    pieces,
    over: [
      { type: 'label', p: [C, YE_CUT - 12, z], label: 'rightSides', o: span(t, 0.12, 0.18) * (1 - span(t, 0.24, 0.28)), hot: true },
      { type: 'line', pts: onTop(arc(sx1 - r, ye - r, r, 0, Math.PI / 2, 10), z + 0.15), t: traceR, kind: 'mark', o: 1 - trim },
      { type: 'line', pts: onTop(arc(sx0 + r, ye - r, r, Math.PI / 2, Math.PI, 10), z + 0.15), t: traceL, kind: 'mark', o: 1 - trim },
      { type: 'label', p: [sx1, ye, z], label: 'roundObject', o: span(t, 0.32, 0.38) * (1 - span(t, 0.64, 0.68)), dx: 4, dy: -9, hot: true },
      { type: 'label', p: [C, ye, z], label: 'roundCorners', o: span(t, 0.74, 0.8), dy: 7 },
    ],
    focus: { pts: [[sx0 - 7, ye - 14, 0], [sx1 + 7, ye + 4, 0]], k: 0.7 * span(t, 0.24, 0.3) * (1 - span(t, 0.88, 0.96)) },
  };
}

// the seam round the Ts, from the right end of the opening all round to its left end
const GAP = [C - SPEC.opening / 2, C + SPEC.opening / 2];
const SEAM_PATH = [[GAP[1], S], ...SEWN_T.slice(1), SEWN_T[0], [GAP[0], S]];

function twoTs(z0 = 0) {
  return [table('s-outer', CUT_T(true), z0, PRINT, BACK, true), table('s-lin', CUT_T(true), z0 + T, LIN, LIN_BACK, false)];
}

function stepSewRound(t) {
  const sew = span(t, 0.06, 0.66), clip = span(t, 0.74, 0.9);
  const z = 2 * T + 0.05;
  const sx0 = C - SWc / 2 + S, sx1 = C + SWc / 2 - S, ye = YE_CUT - S, r = RC;
  // clips: across the round corners and into the two inner corners of the T
  const tick = (p, q) => ({ type: 'line', pts: [[...p, z], [...q, z]], t: span(clip, 0, 0.6), kind: 'hot', o: clip > 0 ? 1 : 0 });
  const roundTicks = [0.35, 0.75].flatMap((s) => [
    tick([sx1 - r + (r + 0.5) * Math.cos(s * Math.PI / 2), ye - r + (r + 0.5) * Math.sin(s * Math.PI / 2)], [sx1 - r + (r - 0.1) * Math.cos(s * Math.PI / 2), ye - r + (r - 0.1) * Math.sin(s * Math.PI / 2)]),
    tick([sx0 + r - (r + 0.5) * Math.cos(s * Math.PI / 2), ye - r + (r + 0.5) * Math.sin(s * Math.PI / 2)], [sx0 + r - (r - 0.1) * Math.cos(s * Math.PI / 2), ye - r + (r - 0.1) * Math.sin(s * Math.PI / 2)]),
  ]);
  return {
    pieces: twoTs(),
    over: [
      { type: 'line', pts: onTop(SEAM_PATH, z), t: sew, kind: 'hot' },
      { type: 'line', pts: [[GAP[0], S, z], [GAP[1], S, z]], kind: 'open', o: span(t, 0.62, 0.68) },
      { type: 'label', p: [BLc - 14, S, z], label: 'seam05', o: span(t, 0.08, 0.14) * (1 - span(t, 0.36, 0.4)), dx: -4, dy: -7 },
      { type: 'label', p: [C, S, z], label: 'opening6', o: span(t, 0.64, 0.7), dy: -7, hot: true },
      { type: 'label', p: [C, S, z], label: 'oppositeFlap', o: span(t, 0.66, 0.72) * (1 - span(t, 0.74, 0.78)), dy: 6 },
      tick([sx0 - 0.5, YB + 0.5], [sx0 + 0.1, YB - 0.1]),
      tick([sx1 + 0.5, YB + 0.5], [sx1 - 0.1, YB - 0.1]),
      ...roundTicks,
      { type: 'label', p: [C, YB + SL / 2, z], label: 'clipCorners', o: span(t, 0.78, 0.84), hot: true },
    ],
  };
}

function stepTurn(t) {
  const out = span(t, 0.14, 0.5), press = span(t, 0.6, 0.66) * (1 - span(t, 0.86, 0.9));
  const sewn = table('tu-sewn', SEWN_T, 0, PRINT, LIN, true);
  return {
    pieces: [...fadeAll(twoTs(), 1 - out), ...fadeAll([sewn], out)],
    over: [
      { type: 'arrow', pts: [[C, S, 3], [C, -5, 3]], t: span(t, 0.04, 0.14), o: 1 - out },
      { type: 'label', p: [C, -5, 2], label: 'turnOut', o: span(t, 0.04, 0.1) * (1 - span(t, 0.5, 0.56)), hot: true },
      { type: 'label', p: [C, BHc / 2, T], label: 'press', o: press },
    ],
  };
}

const SEWN = (lines = []) => table('sewn-t', SEWN_T, 0, PRINT, LIN, true, { lines });
const TOP_PATH = [[GAP[1], S + SPEC.topstitch], ...TOP_T.slice(1), TOP_T[0], [GAP[0], S + SPEC.topstitch]];

function stepTopstitch(t) {
  const st = span(t, 0.06, 0.82);
  return {
    pieces: [SEWN()],
    over: [
      { type: 'line', pts: onTop(TOP_PATH, T), t: st, kind: 'hotstitch' },
      { type: 'line', pts: [[GAP[0], S + SPEC.topstitch, T], [GAP[1], S + SPEC.topstitch, T]], t: span(t, 0.82, 0.9), kind: 'hotstitch' },
      { type: 'label', p: [BLc - 14, S, T], label: 'topstitch05', o: span(t, 0.08, 0.14) * (1 - span(t, 0.7, 0.74)), dx: -4, dy: -7, hot: true },
      { type: 'label', p: [C, S, T], label: 'closesOpening', o: span(t, 0.84, 0.9), dy: -7 },
    ],
  };
}

/* ---------- Steps 8–10: fold in half, two lines, the accordion ---------- */

// the sewn T split at the middle: the long piece's halves and the flap piece's halves
const sx0s = C - SW / 2;
const BAR_L = [[S, S], [C, S], [C, YB], [S, YB]];
const STEM_L = [[sx0s, YB], [C, YB], [C, YE_CUT - S], [sx0s + RC, YE_CUT - S], ...arc(sx0s + RC, YE_CUT - S - RC, RC, Math.PI / 2, Math.PI, 8), [sx0s, YB]];
const mirror = (pts) => pts.map(([x, y]) => [2 * C - x, y]).reverse();
const LX1 = C - L1, LX2 = C - L2; // the lines, on the folded piece

/** The folded state: `fold` 0…1 (the right half over the left), `stemOpen` 0…1 (its flap half back out). */
function folded({ fold = 1, stemOpen = 0, lining = true }) {
  const [fill, inner] = [PRINT, LIN];
  const up = !lining; // lining up = printed side down
  const hinge = [C, 0, T];
  const barL = table('fo-bar-l', BAR_L, 0, fill, inner, up, { lines: [{ pts: [[C - 0.1, S], [C - 0.1, YB]], kind: 'fold' }] });
  const stemL = table('fo-stem-l', STEM_L, 0, fill, inner, up);
  const barR = turn(table('fo-bar-r', mirror(BAR_L), 0, fill, inner, up), hinge, [0, 1, 0], -Math.PI * fold);
  const stemR = turn(table('fo-stem-r', mirror(STEM_L), 0, fill, inner, up), hinge, [0, 1, 0], -Math.PI * fold * (1 - stemOpen));
  return { barL, stemL, barR, stemR };
}

const foldedPieces = (s) => {
  const f = folded(s);
  // the half in the air goes last; once it is down it still lies on top
  return [f.barL, f.stemL, f.stemR, f.barR];
};

function stepFold(t) {
  const over = span(t, 0.03, 0.14), fold = span(t, 0.2, 0.46), mark = span(t, 0.56, 0.86);
  const z = 2 * T + 0.05;
  const pieces = over < 0.999 ? fadeAll([SEWN()], 1 - over) : [];
  if (over > 0.001) pieces.push(...fadeAll(foldedPieces({ fold, lining: true }), over));
  const line = (x, a) => ({ type: 'line', pts: [[x, S + 0.3, z], [x, YB - 0.3, z]], t: span(mark, a, a + 0.35), kind: 'mark', o: fold > 0.99 ? 1 : 0 });
  return {
    pieces,
    over: [
      { type: 'label', p: [C, BHc / 2, T], label: 'turnOver', o: span(t, 0.02, 0.06) * (1 - span(t, 0.14, 0.18)) },
      { type: 'label', p: [C, BHc / 2, 2 * T], label: 'foldHalf', o: span(t, 0.24, 0.3) * (1 - span(t, 0.48, 0.52)), dy: -7, hot: true },
      { type: 'dim', a: [C, -2.5, z], b: [LX1, -2.5, z], label: 'cm11', o: span(t, 0.56, 0.62), hot: true },
      { type: 'dim', a: [LX1, -2.5, z], b: [LX2, -2.5, z], label: 'cm11', o: span(t, 0.7, 0.76), hot: true },
      line(LX1, 0), line(LX2, 0.45),
      { type: 'label', p: [C, S, z], label: 'fromFold', o: span(t, 0.6, 0.66), dx: 6, dy: -12 },
    ],
  };
}

/* The END VIEW of the long piece, across its length (the flap piece left out): */
const G = 0.8; // inset: layers drawn apart
/** Folded: the top half and the bottom half, the fold on the right; `s1`, `s2` — the lines sewn. */
function insetFolded(s1 = 0, s2 = 0) {
  const segs = [
    { a: [0, G], b: [-28, G] }, { a: [0, -G], b: [-28, -G] }, { a: [0, G], b: [0.7, 0] }, { a: [0.7, 0], b: [0, -G] },
  ];
  if (s1) segs.push({ a: [-L1, -G - 0.4], b: [-L1, -G - 0.4 + (2 * G + 0.8) * s1] });
  if (s2) segs.push({ a: [-L2, -G - 0.4], b: [-L2, -G - 0.4 + (2 * G + 0.8) * s2] });
  return { segs, range: [-29.5, 1.5] };
}

/*
  The long piece's cross-section as it opens into the accordion. d runs along the long piece
  (0 = the middle, ±28 its ends); every state is a polyline over the same intervals, so they
  morph point by point. folded → loops opened (diamonds) → flat in a stack, seams in the middle:
  the middle part (−5.5…5.5) lies flat at the bottom (the front), then the first loop's other
  face, the second loop, the ends — the seams of both lines in the middle of their faces.
*/
const BPS = [-28, -22, -16.5, -11, -5.5, 0, 5.5, 11, 16.5, 22, 28];
const VS = 0.8; // inset: the stack's layers apart
const INSET = { g: G, open: VS, flat: VS }; // the END VIEW draws layers far apart
const SOLID = { g: T, open: 1.1, flat: TH / 4 }; // the 3D long piece: real thickness flat, the loops opened up
/** A point d of the long piece in a mode → [w across, v up]; `g` the half gap of the folded layers, `open`/`flat` the level step. */
function stackAt(d, mode, { g, open, flat }) {
  const a = Math.abs(d), s = Math.sign(d) || 1;
  if (mode === 'folded') return [-a, d >= 0 ? g : -g];
  // level and position across the width for each part of the long piece
  let w, v;
  if (a <= 5.5) { w = d; v = 0; }
  else if (a <= 11) { w = s * (11 - a); v = mode === 'flat' ? 1 : 0.6 + 1.8 * ((a - 5.5) / 5.5); }
  else if (a <= 16.5) { w = s * (a - 11); v = mode === 'flat' ? 2 : 2.4 + 0.6 * ((a - 11) / 5.5); }
  else if (a <= 22) { w = s * (22 - a); v = mode === 'flat' ? 3 : 3.6 + 1.8 * ((a - 16.5) / 5.5); }
  else { w = s * (a - 22); v = mode === 'flat' ? 4 : 5.4 + 0.6 * ((a - 22) / 6); }
  return [w, v * (mode === 'flat' ? flat : open)];
}
/** Points of the cross-section in a mode, each interval's two ends (left/right limits at the breaks). */
function stackPts(mode, opt) {
  const pts = [];
  for (let i = 0; i < BPS.length - 1; i++) {
    const a = BPS[i], b = BPS[i + 1], e = 1e-6;
    pts.push(stackAt(a + e, mode, opt), stackAt(b - e, mode, opt));
  }
  return pts;
}
const lerp2 = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
/** The cross-section at k 0…1: folded → the loops opened (diamonds) → flat in a stack, seams in the middle. */
function accordionPts(k, opt) {
  const A = stackPts('folded', opt), B = stackPts('open', opt), Cf = stackPts('flat', opt);
  const k1 = span(k, 0, 0.5), k2 = span(k, 0.5, 1);
  return A.map((p, i) => lerp2(lerp2(p, B[i], k1), Cf[i], k2));
}
/** The END VIEW of the accordion at k. Extra: the flap piece on top (`back`), the side stitching. */
function insetStack(k, { back = 0, sides = 0 } = {}) {
  const P = accordionPts(k, INSET);
  const segs = [];
  for (let i = 0; i < P.length - 1; i++) segs.push({ a: P[i], b: P[i + 1] });
  if (back) segs.push({ a: [-6, 5 * VS], b: [-6 + 12 * back, 5 * VS] });
  if (sides) for (const x of [-6, 6]) segs.push({ a: [x, -0.4], b: [x, -0.4 + (5 * VS + 0.8) * sides] });
  const k1 = span(k, 0, 0.5);
  const r0 = [-29.5, 1.5], r1 = [-7.5, 7.5];
  return { segs, range: [lerp(r0[0], r1[0], k1), lerp(r0[1], r1[1], k1)] };
}
/*
  The long piece in 3D at k: one strip per segment of the cross-section, running along y (the piece's
  height), the printed side out (to the right of the direction of travel along the piece). The two
  seams (11 and 22 cm from the fold) are drawn on the strips that meet there. Painted far to near.
*/
const SEAM_ENDS = new Set([11, 22]);
function accordionStrips(k) {
  const P = accordionPts(k, SOLID);
  const lift = SOLID.g * (1 - span(k, 0, 0.5)); // the bottom layer of the folded piece lies on the table
  const len = YB - S, strips = [];
  for (let i = 0; i < P.length - 1; i++) {
    const [w0, v0] = P[i], [w1, v1] = P[i + 1];
    const dx = w1 - w0, dz = v1 - v0, l = Math.hypot(dx, dz);
    if (l < 1e-3) continue;
    const lines = [];
    if (i % 2 === 0) { // a part of the piece (odd i: a fold edge between two parts)
      const [a, b] = [BPS[i / 2], BPS[i / 2 + 1]];
      if (SEAM_ENDS.has(b)) lines.push({ pts: [[l, 0.2], [l, len - 0.2]], kind: 'stitch' });
      if (SEAM_ENDS.has(-a)) lines.push({ pts: [[0, 0.2], [0, len - 0.2]], kind: 'stitch' });
    }
    strips.push({
      id: `acc-${i}`, pts: rect(l, len), O: [C + w0, S, v0 + lift], U: [dx / l, 0, dz / l], V: [0, 1, 0], out: [dz / l, 0, -dx / l],
      fill: PRINT, inner: LIN, lines, depth: C + (w0 + w1) / 2 + (v0 + v1) / 2,
    });
  }
  return strips.sort((p, q) => p.depth - q.depth);
}

function stepLines(t) {
  const s1 = span(t, 0.08, 0.42), s2 = span(t, 0.5, 0.84);
  const z = 2 * T + 0.05;
  return {
    pieces: foldedPieces({ fold: 1 }),
    over: [
      { type: 'line', pts: [[LX1, S + 0.3, z], [LX1, YB - 0.3, z]], kind: 'mark', o: 1 - s1 },
      { type: 'line', pts: [[LX2, S + 0.3, z], [LX2, YB - 0.3, z]], kind: 'mark', o: 1 - s2 },
      { type: 'line', pts: [[LX1, S, z], [LX1, YB, z]], t: s1, kind: 'hotstitch' },
      { type: 'line', pts: [[LX2, S, z], [LX2, YB, z]], t: s2, kind: 'hotstitch' },
      { type: 'label', p: [LX1, YB, z], label: 'throughBoth', o: span(t, 0.12, 0.18) * (1 - span(t, 0.44, 0.48)), dx: 4, dy: 8, hot: true },
      { type: 'label', p: [(LX1 + LX2) / 2, S, z], label: 'twoLines', o: span(t, 0.86, 0.92), dy: -7 },
    ],
    inset: insetFolded(s1, s2),
    pad: 0.22,
  };
}

/* The stack on the table: the pockets folded flat (width = the flap piece), the flap piece flat beyond its end. */
const SX0 = C - W / 2, SX1 = C + W / 2;
function stack(z0 = 0, o = 1) {
  // on top: the two short ends, meeting at the second line's stitching in the middle
  const top = table('st-top', rect(W, YB - S), z0 + TH, LIN, LIN, true, { O: [SX0, S, z0 + TH], opacity: o, lines: [{ pts: [[W / 2, 0.2], [W / 2, YB - S - 0.2]], kind: 'stitch' }] });
  const layers = (len) => [1, 2, 3, 4].map((i) => ({ pts: [[0, (TH * i) / 5], [len, (TH * i) / 5]], kind: 'seam' }));
  const side = { id: 'st-side', pts: rect(YB - S, TH), O: [SX1, S, z0], U: [0, 1, 0], V: [0, 0, 1], out: [1, 0, 0], fill: LIN_BACK, inner: LIN_BACK, opacity: o, lines: layers(YB - S) };
  const end = { id: 'st-end', pts: rect(W, TH), O: [SX0, YB, z0], U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], fill: LIN_BACK, inner: LIN_BACK, opacity: o, lines: layers(W) };
  return [top, side, end];
}
const YE = YE_CUT - S; // 48.5: the flap's end, sewn
const STEM_FULL = [[SX0, YB], [SX1, YB], ...arc(SX1 - RC, YE - RC, RC, 0, Math.PI / 2, 8), ...arc(SX0 + RC, YE - RC, RC, Math.PI / 2, Math.PI, 8)];
/** The flap piece lying flat beyond the stack, lining up (topstitched round). */
const STEM_FLAT = (o = 1) => table('st-stem', STEM_FULL, 0, PRINT, LIN, false, { opacity: o });

/*
  Step 10: open the flap piece out; the long piece opens with it — the right half swings over, the two
  loops open (diamonds) and flatten into a stack, the seams in the middle. That makes TWO pockets (the
  loops); the third comes in step 12, when the flap piece folds over the stack.
*/
/** The flap piece's right half while the long piece opens: it moves with the middle (s −1 folded over → 1 flat). */
function stemRightAt(s) {
  const pts = mirror(STEM_L).map(([x, y]) => [C + (x - C) * s, y]);
  return table('acc-stem-r', s < 0 ? pts.slice().reverse() : pts, lerp(2 * T, 0, (s + 1) / 2), PRINT, LIN, s < 0);
}

function stepAccordion(t) {
  const morph = span(t, 0.06, 0.86), opened = span(morph, 0, 0.5), swap = span(t, 0.88, 0.96);
  const pieces = [];
  if (swap < 0.999) {
    const s = lerp(-1, 1, opened);
    const stem = opened < 0.999 ? [table('acc-stem-l', STEM_L, 0, PRINT, LIN, false), ...(Math.abs(s) > 0.02 ? [stemRightAt(s)] : [])] : [STEM_FLAT()];
    pieces.push(...fadeAll([...accordionStrips(morph), ...stem], 1 - swap));
  }
  if (swap > 0.001) pieces.push(...fadeAll([...stack(), STEM_FLAT()], swap));
  return {
    pieces,
    over: [
      { type: 'label', p: [C, YB + SL / 2, T], label: 'openFlap', o: span(t, 0.04, 0.1) * (1 - span(t, 0.26, 0.3)), hot: true },
      { type: 'label', p: [C, YB + SL / 2, T], label: 'accordion', o: span(t, 0.32, 0.38) * (1 - span(t, 0.5, 0.54)) },
      { type: 'label', p: [C, BH / 2, TH], label: 'seamsMiddle', o: span(t, 0.56, 0.62) * (1 - span(t, 0.8, 0.84)), dy: -8, hot: true },
      { type: 'label', p: [C, BH / 2, TH], label: 'pockets2', o: span(t, 0.88, 0.94), dy: -8, hot: true },
    ],
    inset: insetStack(morph),
    pad: 0.22,
  };
}

/* ---------- Step 11: the ears — a 5 × 5 square folded into a narrow strip, then into a loop ---------- */

const EQ = SPEC.ear / 4; // 1.25: one quarter of the square
/** Cross-section of the square: four quarter segments [a, b, out] in (y, z): in half, edges to the fold, in half again. */
function earSection(t, th = T) {
  const th1 = Math.PI * span(t, 0.03, 0.16) * (1 - span(t, 0.2, 0.3));
  const th2 = Math.PI * span(t, 0.34, 0.52);
  const th3 = Math.PI * span(t, 0.56, 0.7);
  const segs = [0, 1, 2, 3].map((i) => ({ a: [-2 * EQ + EQ * i, 0], b: [-EQ + EQ * i, 0], out: [0, -1] }));
  const spin = (s, c, a) => { s.a = rot2(s.a, c, a); s.b = rot2(s.b, c, a); s.out = rot2(s.out, [0, 0], a); };
  if (th1) { spin(segs[2], [0, th / 2], th1); spin(segs[3], [0, th / 2], th1); }
  if (th2) { spin(segs[0], [-EQ, th / 2], -th2); spin(segs[3], [EQ, th / 2], th2); }
  if (th3) { spin(segs[2], [0, 1.5 * th], th3); spin(segs[3], [0, 1.5 * th], th3); }
  return segs;
}

const EX = SX1 + 6; // the ears are made beside the stack
function earStrip(t, y0, key) {
  return earSection(t).map((s, i) => {
    const vy = (s.b[0] - s.a[0]) / EQ, vz = (s.b[1] - s.a[1]) / EQ;
    return { id: `${key}-${i}`, pts: rect(SPEC.ear, EQ), O: [EX, y0 + s.a[0], s.a[1]], U: [1, 0, 0], V: [0, vy, vz], out: [0, s.out[0], s.out[1]], fill: PRINT, inner: BACK, zc: (s.a[1] + s.b[1]) / 2 };
  }).sort((p, q) => p.zc - q.zc);
}
/** A finished ear lying on the table: the strip folded in half into a loop (two layers, the fold at the tip). */
const earLoop = (id, x, y, z, side = 1, o = 1) => table(id, [[0, 0], [SPEC.ear / 2 - EQ / 2, 0], ...arc(SPEC.ear / 2 - EQ / 2, EQ / 2, EQ / 2, -Math.PI / 2, Math.PI / 2, 8), [0, EQ]], z, PRINT, PRINT, true, {
  O: [x, y, z], U: [side, 0, 0], opacity: o, lines: [{ pts: [[0.1, EQ / 2], [SPEC.ear / 2 - EQ / 2, EQ / 2]], kind: 'fold' }],
});

/*
  The strip (5 cm long, four layers) folded in half into a loop: it lies flat up to A, wraps round a
  small circle by `phi` (0…π), and the rest runs on along the tangent — at phi = π back over itself.
  → the strip's centreline in (x along the strip, z up), sampled along its length.
*/
const LOOP_R = 0.45; // the loop's opening (drawing)
const LOOP_A = SPEC.ear / 2 - (Math.PI * LOOP_R) / 2;
function loopLine(phi, n = 8) {
  const r = LOOP_R, A = LOOP_A, rest = SPEC.ear - A - r * phi;
  const pts = [[0, 0], [A, 0]];
  for (let j = 1; j <= n; j++) {
    const th = (phi * j) / n;
    pts.push([A + r * Math.sin(th), r - r * Math.cos(th)]);
  }
  const [ex, ez] = pts[pts.length - 1];
  pts.push([ex + rest * Math.cos(phi), ez + rest * Math.sin(phi)]);
  return pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-4);
}
/** The strip in 3D bent by phi: one piece per segment of its centreline, `EQ` wide along y. */
function bentStrip(key, phi, x0, y0, z0, o = 1) {
  const pts = loopLine(phi);
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [u0, w0] = pts[i], [u1, w1] = pts[i + 1], dx = u1 - u0, dz = w1 - w0, l = Math.hypot(dx, dz);
    out.push({ id: `${key}-${i}`, pts: rect(l, EQ), O: [x0 + u0, y0 - EQ, z0 + w0], U: [dx / l, 0, dz / l], V: [0, 1, 0], out: [-dz / l, 0, dx / l], fill: PRINT, inner: PRINT, opacity: o, depth: u0 + u1 + w0 + w1 });
  }
  return out.sort((p, q) => p.depth - q.depth);
}
/** The END VIEW of the loop: the four-layer strip drawn as two lines, its thickness apart. */
function loopInset(phi) {
  const c = loopLine(phi, 16), h = 0.12, segs = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < c.length - 1; i++) {
      const [x0, z0] = c[i], [x1, z1] = c[i + 1], l = Math.hypot(x1 - x0, z1 - z0) || 1;
      const nx = (-(z1 - z0) / l) * h * side, nz = ((x1 - x0) / l) * h * side;
      segs.push({ a: [x0 + nx, z0 + nz], b: [x1 + nx, z1 + nz] });
    }
  }
  return { segs, range: [-0.4, SPEC.ear + 0.4] };
}

/*
  Step 11: the ears, made on their own (the pockets wait aside; the camera frames just the square):
  the square folds into a narrow strip (END VIEW: across it), then the strip folds in half into a
  loop (END VIEW: along it). Then the second one.
*/
function stepEars(t) {
  const strap = 0.72 * span(t, 0.02, 0.44), bend = span(t, 0.5, 0.74), two = span(t, 0.82, 0.94);
  const y0 = 4;
  const pieces = [];
  if (bend <= 0.001) pieces.push(...earStrip(strap, y0, 'ear'));
  else pieces.push(...bentStrip('loop-a', Math.PI * bend, EX, y0, 2 * T));
  if (two > 0.001) pieces.push(...bentStrip('loop-b', Math.PI, EX, y0 + 3, 2 * T, two));
  const o5 = 1 - span(t, 0.26, 0.3);
  return {
    pieces,
    over: [
      { type: 'dim', a: [EX + SPEC.ear + 1.2, y0 - 2 * EQ, 0], b: [EX + SPEC.ear + 1.2, y0 + 2 * EQ, 0], label: 'cm5', o: o5, hot: true },
      { type: 'label', p: [EX + SPEC.ear / 2, y0 - 2 * EQ, 4 * T], label: 'edgesIn', o: span(t, 0.2, 0.26) * (1 - span(t, 0.44, 0.48)), dy: -6 },
      { type: 'label', p: [EX + SPEC.ear / 2, y0 - 2 * EQ, 4 * T], label: 'intoLoop', o: span(t, 0.5, 0.56) * (1 - span(t, 0.78, 0.82)), dy: -6, hot: true },
      { type: 'label', p: [EX + SPEC.ear / 2, y0 + 2 * EQ, 0], label: 'makeTwo', o: two, dy: 6 },
    ],
    inset: bend > 0.001 ? loopInset(Math.PI * bend) : { segs: earSection(strap, 0.25).map(({ a, b }) => ({ a, b })), range: [-3, 3] },
    pad: 0.22,
  };
}

/* ---------- Steps 12–13: the flap piece over (the back), the ears in, the sides stitched ---------- */

/** The flap piece turned over the stack about the stack's end: k 0…1. Printed side up at the end. */
const flapOver = (k) => turn(STEM_FLAT(), [0, YB, TH / 2], [1, 0, 0], Math.PI * k);
const EAR_Y = S + 1.2; // the ears go in near the top (the long piece's edge with the opening)
const earsIn = (k, o = 1) => [
  earLoop('in-ear-l', SX0 + 0.6 - 4 * (1 - k), EAR_Y, TH + 0.05, -1, o),
  earLoop('in-ear-r', SX1 - 0.6 + 4 * (1 - k), EAR_Y, TH + 0.05, 1, o),
];
const CLIPS = [[SX0, 7], [SX0, 14], [SX1, 7], [SX1, 14]];
const clipPieces = (o) => CLIPS.map(([x, y], i) => table(`clip-${i}`, rect(2.4, 1.4), TH + 2 * T + 0.1, CLIP, CLIP, true, { O: [x - 1.2, y, TH + 2 * T + 0.1], opacity: o }));
/** The bottom: the flap piece's fold round the stack's end (seen once it is over). */
const wrap = (o) => ({ id: 'wrap', pts: rect(W, TH + T), O: [SX0, YB, 0], U: [1, 0, 0], V: [0, 0, 1], out: [0, 1, 0], fill: PRINT, inner: PRINT, opacity: o });

/* Step 12: the flap piece over the stack — round the bottom, up the back: the third pocket (between the back and the stack). */
function stepBack(t) {
  const over = span(t, 0.04, 0.36), ears = span(t, 0.6, 0.74), clips = span(t, 0.8, 0.9);
  const pieces = [...stack()];
  pieces.push(...earsIn(ears, ears));
  pieces.push(flapOver(over));
  if (over > 0.98) pieces.push(wrap(1));
  if (clips > 0.001) pieces.push(...clipPieces(clips));
  const z = TH + T;
  return {
    pieces,
    over: [
      { type: 'arrow', pts: [[C, YB + 9, 5], [C, YB + 1, 9], [C, YB - 5, TH + 4]], t: span(t, 0.02, 0.12), o: 1 - span(t, 0.36, 0.42) },
      { type: 'label', p: [C, YB / 2, z], label: 'overTop', o: span(t, 0.04, 0.1) * (1 - span(t, 0.32, 0.36)), dy: -8, hot: true },
      { type: 'label', p: [C, YB / 2, z], label: 'backAndFlap', o: span(t, 0.36, 0.41) * (1 - span(t, 0.46, 0.49)), dy: -8 },
      { type: 'label', p: [C, YB / 2, z], label: 'pocket3', o: span(t, 0.49, 0.53) * (1 - span(t, 0.6, 0.63)), dy: -8, hot: true },
      { type: 'label', p: [C, S, z], label: 'earsIn', o: span(t, 0.64, 0.68) * (1 - span(t, 0.78, 0.81)), dy: -7, hot: true },
      { type: 'label', p: [SX1, 10.5, z], label: 'clipIt', o: span(t, 0.84, 0.9), dx: 10, dy: 2 },
    ],
    inset: insetStack(1, { back: over }),
    pad: 0.22,
  };
}

function stepSides(t) {
  const left = span(t, 0.06, 0.44), right = span(t, 0.5, 0.88);
  const z = TH + 2 * T + 0.05;
  const e = 0.2;
  return {
    pieces: [...stack(), ...earsIn(1), flapOver(1), wrap(1), ...clipPieces(1 - span(t, 0, 0.06))],
    over: [
      { type: 'line', pts: [[SX0 + e, S, z], [SX0 + e, YB, z]], t: left, kind: 'hot' },
      { type: 'line', pts: [[SX1 - e, S, z], [SX1 - e, YB, z]], t: right, kind: 'hot' },
      { type: 'label', p: [SX1, YB / 2, z], label: 'edgeStitch', o: span(t, 0.08, 0.14) * (1 - span(t, 0.88, 0.92)), dx: 12, dy: -6, hot: true },
      { type: 'label', p: [C, YB / 2, z], label: 'backAndNext', o: span(t, 0.9, 0.96), dy: -8 },
    ],
    inset: insetStack(1, { back: 1, sides: span(t, 0.06, 0.88) }),
    pad: 0.22,
  };
}

/* ---------- Step 14: the snap; the finished pouch ---------- */

const O14 = [C, YB / 2, 0]; // the pouch stands where it lay

function stepSnap(t) {
  const up = span(t, 0.04, 0.22); // the flat work crossfades into the standing pouch, flap open
  const s1 = span(t, 0.26, 0.32);
  const close1 = span(t, 0.38, 0.5), reopen = span(t, 0.58, 0.66), s2 = span(t, 0.68, 0.74), close2 = span(t, 0.78, 0.92);
  const c = close1 * (1 - reopen) + close2;
  const flat = [...stack(), ...earsIn(1), flapOver(1), wrap(1)];
  const pieces = [];
  if (up < 0.999) pieces.push(...fadeAll(flat, 1 - up));
  if (up > 0.001) pieces.push(...fadeAll(pouch({ o: O14, c, snapFlap: s1, snapFront: s2 }), up));
  const mark = [O14[0], O14[1] + D / 2 + 0.05, SNAP_Z];
  return {
    pieces,
    over: [
      { type: 'label', p: [O14[0], O14[1] - D / 2, H + FL + D], label: 'snapFlap', o: span(t, 0.26, 0.32) * (1 - span(t, 0.38, 0.42)), dy: -6, hot: true },
      { type: 'line', pts: [[mark[0] - 0.8, mark[1], mark[2] - 0.8], [mark[0] + 0.8, mark[1], mark[2] + 0.8]], kind: 'hot', o: span(t, 0.5, 0.56) * (1 - s2) },
      { type: 'line', pts: [[mark[0] - 0.8, mark[1], mark[2] + 0.8], [mark[0] + 0.8, mark[1], mark[2] - 0.8]], kind: 'hot', o: span(t, 0.5, 0.56) * (1 - s2) },
      { type: 'label', p: mark, label: 'whereItLands', o: span(t, 0.52, 0.58) * (1 - span(t, 0.66, 0.7)), dx: -14, dy: 6, hot: true },
      { type: 'label', p: mark, label: 'secondHalf', o: span(t, 0.7, 0.74) * (1 - span(t, 0.8, 0.84)), dx: -14, dy: 6, hot: true },
    ],
  };
}

/*
  Step 15: the result — open the flap: the phone goes into the pocket next to the back, money into
  the middle one, a card into the front one; close the flap; a chain with clasps hooks onto the
  ears (there is none in the video — the texts say so).
*/
function stepFill(t) {
  const c = 1 - span(t, 0.02, 0.09) + span(t, 0.74, 0.81);
  const things = { phone: span(t, 0.1, 0.32), money: span(t, 0.33, 0.52), card: span(t, 0.53, 0.72) };
  const chain = span(t, 0.82, 0.9), drop = 1 - span(t, 0.82, 0.95);
  const above = (y) => [O14[0] - W / 2, O14[1] + y, H + 2];
  const live = (a, b) => span(t, a, a + 0.04) * (1 - span(t, b - 0.03, b));
  return {
    pieces: pouch({ o: O14, c, things, chain, chainDrop: drop }),
    over: [
      { type: 'label', p: above(POCKET_Y.phone), label: 'phone', o: live(0.1, 0.32), dx: -9, hot: true },
      { type: 'label', p: above(POCKET_Y.money), label: 'money', o: live(0.33, 0.52), dx: -9, hot: true },
      { type: 'label', p: above(POCKET_Y.card), label: 'cards', o: live(0.53, 0.72), dx: -9, hot: true },
      { type: 'label', p: [O14[0], O14[1] - D / 2, H + 9], label: 'chainOn', o: span(t, 0.86, 0.92) },
    ],
  };
}

/* ---------- Steps ---------- */

/*
  Steps — how each one is built, without words. Every text lives in pouch.<lang>.js,
  index-aligned with this array (pouch.text.js checks it). `sew` fabrics: 'print' (the outer) |
  'lining' — the colour under the mini machine. `uses` — catalog ids.
*/
export const STEPS = [
  {}, // 0: the finished pouch
  { scene: stepCut, duration: 4.5, uses: ['barcelonetta-broadcloth', 'plantional-lightweight-interfacing', 'olfa-rotary-cutter', 'olfa-cutting-mat', 'quilting-rulers-set'] },
  { scene: stepIface, duration: 4.5, uses: ['plantional-lightweight-interfacing', 'rowenta-travel-iron'] },
  { scene: stepT, duration: 6.5, stitch: 'straight', sew: [[0.3, 0.52, 'print']], uses: ['janome-1522rd', 'hagbou-thread-set'] },
  { scene: stepRound, duration: 6.5, uses: ['soraco-sewing-clips', 'sewline-air-erasable-pen', 'tailor-scissors'] },
  { scene: stepSewRound, duration: 7, stitch: 'straight', sew: [[0.06, 0.66, 'lining']], uses: ['janome-1522rd', 'tailor-scissors'] },
  { scene: stepTurn, duration: 4.5, uses: ['rowenta-travel-iron'] },
  { scene: stepTopstitch, duration: 6, stitch: 'straight', sew: [[0.06, 0.9, 'print']], uses: ['janome-1522rd'] },
  { scene: stepFold, duration: 6.5, uses: ['ibayam-tape-measures', 'quilting-rulers-set', 'sewline-air-erasable-pen'] },
  { scene: stepLines, duration: 6, stitch: 'straight', sew: [[0.08, 0.42, 'print'], [0.5, 0.84, 'print']], pad: 0.22, uses: ['janome-1522rd'] },
  { scene: stepAccordion, duration: 9, pad: 0.22, uses: ['rowenta-travel-iron'] },
  { scene: stepEars, duration: 7, pad: 0.22, uses: ['rowenta-travel-iron'] },
  { scene: stepBack, duration: 8, pad: 0.22, uses: ['soraco-sewing-clips'] },
  { scene: stepSides, duration: 6, stitch: 'straight', sew: [[0.06, 0.44, 'print'], [0.5, 0.88, 'print']], pad: 0.22, uses: ['janome-1522rd'] },
  { scene: stepSnap, duration: 8, uses: ['kamtop-snap-pliers-kit'] },
  { scene: stepFill, duration: 9, uses: [] },
];

/**
  The static cutting diagram (cut-diagram.js; an <img> on the project page): the end of this
  step + these lines of `legend` from the texts (outer, lining, interfacing, ears, seams).
*/
export const CUT = { step: 1, legend: [0, 1, 2, 5, 7] };

/** Every chip key the drawing uses — each language must have them all (pouch.text.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far apart it is) → { body, viewBox }. L = the texts (pouch.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  floorAt: (k) => (k === 0 ? [0, 0, 0] : k === 14 || k === 15 ? O14 : null),
  shadow: [W * 0.75, W * 0.42],
  fabrics: { print: '#efd9d2', lining: '#e2a9a4' },
});

/** Fabric patterns (ids prefixed with the figure's ID), in each piece's own cm coordinates. */
export const DEFS = `
<defs>
  <pattern id="${ID}-print" width="6" height="6" patternUnits="userSpaceOnUse">
    <rect width="6" height="6" fill="#f6ece6"/>
    <circle cx="1.7" cy="1.6" r="1" fill="#d9a3a0" opacity=".8"/><circle cx="1.7" cy="1.6" r=".38" fill="#9c8f8d"/>
    <ellipse cx="4.5" cy="4.3" rx=".95" ry=".6" fill="#e7c3ad" opacity=".9"/><circle cx="4" cy="4.1" r=".18" fill="#c97d76"/>
    <path d="M2.8 2.4q.8.4 1.1 1.2M4.5 1.1q.5.3.4 1" stroke="#a7a39b" stroke-width=".22" fill="none"/>
  </pattern>
  <pattern id="${ID}-back" width="6" height="6" patternUnits="userSpaceOnUse">
    <rect width="6" height="6" fill="#faf5f0"/>
    <rect width="6" height="6" fill="url(#${ID}-print)" opacity=".16"/>
  </pattern>
  <pattern id="${ID}-lining" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#e2a9a4"/><circle cx="1.5" cy="1.5" r=".22" fill="#f1cfcb"/>
  </pattern>
  <pattern id="${ID}-liningBack" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#f0cfcc"/>
  </pattern>
  <pattern id="${ID}-iface" width="3" height="3" patternUnits="userSpaceOnUse">
    <rect width="3" height="3" fill="#fbf8f2"/>
    <path d="M.4 .6l.8.4M1.8 2.1l.7-.5M2.2 .5l.3.6" stroke="#d8cdbd" stroke-width=".12"/>
  </pattern>
  <radialGradient id="${ID}-lid" cx=".4" cy=".35">
    <stop offset="0" stop-color="#f3efe8"/><stop offset="1" stop-color="#cfc6b8"/>
  </radialGradient>
  <radialGradient id="${ID}-snap" cx=".38" cy=".35">
    <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3ddd3"/>
  </radialGradient>
  <linearGradient id="${ID}-screen" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#9fb8c9"/><stop offset="1" stop-color="#5d7c92"/>
  </linearGradient>
  <pattern id="${ID}-note" width="2" height="2" patternUnits="userSpaceOnUse">
    <rect width="2" height="2" fill="#c3d3ad"/><path d="M0 2L2 0" stroke="#aebf98" stroke-width=".18"/>
  </pattern>
  <linearGradient id="${ID}-steel" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e8e2d8"/><stop offset="1" stop-color="#9a948c"/>
  </linearGradient>
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

/*
  Tote bag ("shopper") — the anatomy figure's model and its sewing steps.
  Every number comes from the maker's own pattern (Vault: «Анатомия изделий —
  пилот «Шопер»»; video https://youtu.be/Fs1QfrJIfwE). Change numbers HERE only.

  Step 0 is the finished bag (tap to take it apart); steps 1–7 each animate one
  stage of sewing over t = 0…1. Each returns painter-ordered pieces + overlays.
*/
import {
  at, band, bounds, lerp, offset, overlayPoints, overlaySvg, pieceSvg,
  pointBounds, project, turn,
} from './iso.js';

export const SPEC = {
  outer: { cut: [86, 45], fabric: 'cotton duck' }, // folded at the bottom: each half 45 wide × 43 tall
  lining: { cut: [86, 45], fabric: 'satin' },
  strap: { cut: [100, 16], done: 4, count: 2, fromCenter: 6 },
  seam: 0.5,
  boxCorner: 6, // measured from the corner tip → a 12 cm seam = a 12 cm base
  boxBase: 12,
  opening: 8, // left open low in a lining side seam
  topstitch: 1,
};

const T = 0.25; // fabric thickness in the drawing (cm)
const HALF = SPEC.outer.cut[0] / 2; // 43
const FLAT = SPEC.outer.cut[1] - 2 * SPEC.seam; // 44: width once the sides are sewn
const D = SPEC.boxBase; // 12
const W = FLAT - D; // 32: front width when boxed
const HB = HALF - SPEC.boxCorner; // 37: boxed height before the top seam
const H = HB - SPEC.seam; // 36.5: finished height (drawing only — not published)
const LINE = 0.35; // gap between outer and lining
const ASPECT = 0.8; // figure width / height, the same for every step
const OPEN = [2, 2 + SPEC.opening]; // opening, cm above the bottom of the lining

const FILL = { duck: 'url(#duck)', duckBack: 'url(#duckBack)', satin: 'url(#satin)', satinBack: 'url(#satinBack)' };

const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const span = (t, a, b) => ease((t - a) / (b - a));
const rect = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
const facing = (p) => p.out[0] + p.out[1] + p.out[2] >= 0;
const inside = (ps) => ps.filter((p) => !facing(p));
const outside = (ps) => ps.filter(facing);
const fadeAll = (ps, o) => (o >= 0.999 ? ps : o <= 0.001 ? [] : ps.map((p) => ({ ...p, opacity: (p.opacity ?? 1) * o })));

/*
  An open box of fabric (outer or lining): walls on [xa,xb]×[ya,yb], height h
  from z0. `fill` is the side facing out, `inner` the side facing in — so an
  inside-out bag simply swaps them. Options:
    flaps   boxed-corner triangles at the bottom ({ hot } marks the 12 cm seam)
    opening gap in the right side seam ([from, to] cm above z0)
    top     a stitch line round the walls { at: cm below the top, t, kind }
*/
function shell({ key, xa, xb, ya, yb, z0 = 0, h, fill, inner, flaps, opening, top, seams = true, lid, ridges }) {
  const w = xb - xa, d = yb - ya;
  const look = { fill, inner };
  const ring = (i, len, rev) => {
    if (!top) return [];
    const t = Math.max(0, Math.min(1, top.t * 4 - i));
    if (t <= 0) return [];
    const v = h - top.at;
    const a = [0.3, v], b = [len - 0.3, v];
    return [{ pts: rev ? [b, a] : [a, b], t, kind: top.kind ?? 'stitch', side: 'out' }];
  };
  const side = (gap) => {
    if (!seams || d < 0.3) return [];
    const u = d / 2;
    if (!gap) return [{ pts: [[u, 0], [u, h]], kind: 'seam', side: 'out' }];
    return [
      { pts: [[u, 0], [u, gap[0]]], kind: 'seam', side: 'out' },
      { pts: [[u, gap[1]], [u, h]], kind: 'seam', side: 'out' },
    ];
  };
  const edge = () => (ridges ? [{ pts: [[0.3, 0.3], [w - 0.3, 0.3]], kind: 'stitch', side: 'out' }] : []);
  const wall = (id, O, U, out, len, lines) =>
    ({ id: `${key}-${id}`, pts: rect(len, h), O, U, V: [0, 0, 1], out, lines, ...look });
  const walls = [
    { id: `${key}-bottom`, pts: rect(w, d), O: [xa, ya, z0], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, -1], ...look },
    wall('back', [xa, ya, z0], [1, 0, 0], [0, -1, 0], w, [...ring(2, w, true), ...edge()]),
    wall('left', [xa, ya, z0], [0, 1, 0], [-1, 0, 0], d, [...side(null), ...ring(3, d, false)]),
    wall('right', [xb, ya, z0], [0, 1, 0], [1, 0, 0], d, [...side(opening), ...ring(1, d, true)]),
    wall('front', [xa, yb, z0], [1, 0, 0], [0, 1, 0], w, [...ring(0, w, false), ...edge()]),
  ];
  if (lid) walls.push({ id: `${key}-lid`, pts: rect(w, d), O: [xa, ya, z0 + h], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], ...look });
  const tips = [];
  if (flaps && d > 0.3) {
    const tri = [[0, 0], [d, 0], [d / 2, d / 2]];
    const lines = [
      { pts: [[d / 2, 0], [d / 2, d / 2]], kind: 'seam' },
      { pts: [[0, 0], [d, 0]], kind: flaps.hot ? 'hot' : 'seam' },
    ];
    tips.push({ id: `${key}-flap-l`, pts: tri, O: [xa, ya, z0], U: [0, 1, 0], V: [-1, 0, 0], out: [0, 0, 1], lines, ...look });
    tips.push({ id: `${key}-flap-r`, pts: tri, O: [xb, ya, z0], U: [0, 1, 0], V: [1, 0, 0], out: [0, 0, 1], lines, ...look });
  }
  return { walls, flapL: tips.slice(0, 1), flapR: tips.slice(1) };
}

/** One strap: a 4 cm band rising from the rim in the plane y = y0 (fold 1 = hanging down). */
function strap({ id, xMid, y0, zRim, front, fold = 0, squash = 1 }) {
  const done = SPEC.strap.done;
  const visible = SPEC.strap.cut[0] - 2 * (SPEC.seam + SPEC.topstitch); // ends hidden in the top seam
  const c1 = xMid - SPEC.strap.fromCenter - done / 2;
  const c2 = xMid + SPEC.strap.fromCenter + done / 2;
  const r = 3;
  const dx = (c2 - c1 - 2 * r) / 2;
  const leg = (visible - Math.PI * r) / 2;
  const rise = Math.sqrt(leg * leg - dx * dx);
  const mid = (c1 + c2) / 2;
  const center = [[c1, 0], [c1 + dx * 0.5, rise * 0.5], [c1 + dx, rise]];
  for (let i = 1; i < 12; i++) {
    const a = Math.PI - (Math.PI * i) / 12;
    center.push([mid + r * Math.cos(a), rise + r * Math.sin(a)]);
  }
  center.push([c2 - dx, rise], [c2 - dx * 0.5, rise * 0.5], [c2, 0]);
  const { pts } = band(center, done);
  const edge = done / 2 - 0.4;
  let p = {
    id, pts, O: [0, y0, zRim], U: [1, 0, 0], V: [0, 0, squash], out: front ? [0, 1, 0] : [0, -1, 0],
    fill: FILL.duck, inner: FILL.duck,
    lines: [
      { pts: offset(center, edge), kind: 'stitch' },
      { pts: offset(center, -edge), kind: 'stitch' },
    ],
  };
  if (fold) p = turn(p, [0, y0, zRim], [1, 0, 0], (front ? -1 : 1) * Math.PI * fold);
  return p;
}

/* ---------- Step 0: the finished bag, together (e = 0) or apart (e = 1) ---------- */

function anatomy(e = 0) {
  const lift = span(e, 0, 0.7), aside = span(e, 0.35, 1), sp = span(e, 0.2, 0.9);
  const outer = shell({
    key: 'outer', xa: 0, xb: W, ya: 0, yb: D, h: H, ridges: true,
    fill: FILL.duck, inner: FILL.duckBack, top: { at: SPEC.topstitch, t: 1 },
  }).walls;
  const shift = [lerp(0, -W - 6, aside), 0, lerp(0, H + 4, lift) - lerp(0, 18, aside)];
  const lining = shell({
    key: 'lining', xa: LINE, xb: W - LINE, ya: LINE, yb: D - LINE, z0: LINE, h: H - LINE,
    fill: FILL.satinBack, inner: FILL.satin, seams: false,
  }).walls.map((p) => ({ ...p, O: [p.O[0] + shift[0], p.O[1] + shift[1], p.O[2] + shift[2]] }));
  const back = strap({ id: 'strap-back', xMid: W / 2, y0: LINE, zRim: H, front: false });
  const front = strap({ id: 'strap-front', xMid: W / 2, y0: D - LINE, zRim: H, front: true });
  back.O = [back.O[0], back.O[1] - 10 * sp, back.O[2] + 9 * sp];
  front.O = [front.O[0], front.O[1] + 10 * sp, front.O[2] + 9 * sp];
  return {
    pieces: [back, ...inside(outer), ...inside(lining), ...outside(lining), ...outside(outer), front],
    over: [],
  };
}

/** Numbered pins for the legend (shown when apart). */
function pins(e) {
  const byId = Object.fromEntries(anatomy(e).pieces.map((p) => [p.id, p]));
  return [
    { n: 1, p: at(byId['outer-front'], W * 0.5, H * 0.45) },
    { n: 2, p: at(byId['lining-front'], (W - 2 * LINE) * 0.5, H * 0.45) },
    { n: 3, p: at(byId['strap-front'], W / 2, 40) },
    { n: 4, p: at(byId['outer-right'], D / 2, 2.2) },
    { n: 5, p: at(byId['outer-front'], W * 0.8, H - SPEC.topstitch) },
  ];
}

/* ---------- Step 1: cut ---------- */

function stepCut(t) {
  const items = [
    { id: 'cut-outer', x: 0, w: 45, h: 86, z: 0, fill: FILL.duck, fold: true },
    { id: 'cut-lining', x: 50, w: 45, h: 86, z: 0, fill: FILL.satin, fold: true },
    { id: 'cut-strap-1', x: 100, w: 16, h: 100, z: -14, fill: FILL.duck },
    { id: 'cut-strap-2', x: 121, w: 16, h: 100, z: -14, fill: FILL.duck },
  ];
  const pieces = items.map((it, i) => {
    const a = span(t, i * 0.13, i * 0.13 + 0.3);
    return {
      id: it.id, pts: rect(it.w, it.h), O: [it.x, 0, it.z + (1 - a) * 10], U: [1, 0, 0], V: [0, 0, 1],
      out: [0, 1, 0], fill: it.fill, inner: it.fill, opacity: a,
      lines: it.fold ? [{ pts: [[0.6, HALF], [it.w - 0.6, HALF]], kind: 'fold' }] : [],
    };
  });
  const o = span(t, 0.62, 0.9);
  return {
    pieces,
    over: [
      { type: 'dim', a: [0, 0, -5], b: [45, 0, -5], text: '45 cm', o },
      { type: 'dim', a: [-5, 0, 0], b: [-5, 0, 86], text: '86 cm', o },
      { type: 'label', p: [22.5, 0, HALF], text: 'fold', o },
      { type: 'label', p: [72.5, 0, HALF], text: 'fold', o },
      { type: 'label', p: [22.5, 0, 93], text: 'outer · duck', o },
      { type: 'label', p: [72.5, 0, 93], text: 'lining · satin', o },
      { type: 'label', p: [118.5, 0, 93], text: '2 straps · duck', o },
      { type: 'dim', a: [100, 0, -19], b: [116, 0, -19], text: '16 cm', o },
      { type: 'dim', a: [142, 0, -14], b: [142, 0, 86], text: '100 cm', o },
    ],
  };
}

/* ---------- Step 2: fold a strap (16 cm → 4 cm, four layers) ---------- */

const rot2 = ([y, z], [cy, cz], a) => {
  const dy = y - cy, dz = z - cz, c = Math.cos(a), s = Math.sin(a);
  return [cy + dy * c - dz * s, cz + dy * s + dz * c];
};

/** Cross-section of the strip: four 4 cm segments [a, b, out] in (y, z). */
function strapSection(t, th = T) {
  const th1 = Math.PI * span(t, 0.03, 0.18) * (1 - span(t, 0.22, 0.32));
  const th2 = Math.PI * span(t, 0.36, 0.56);
  const th3 = Math.PI * span(t, 0.6, 0.78);
  const segs = [0, 1, 2, 3].map((i) => ({ a: [-8 + 4 * i, 0], b: [-4 + 4 * i, 0], out: [0, -1] }));
  const spin = (s, c, a) => {
    s.a = rot2(s.a, c, a);
    s.b = rot2(s.b, c, a);
    s.out = rot2(s.out, [0, 0], a);
  };
  if (th1) { spin(segs[2], [0, th / 2], th1); spin(segs[3], [0, th / 2], th1); }
  if (th2) { spin(segs[0], [-4, th / 2], -th2); spin(segs[3], [4, th / 2], th2); }
  if (th3) { spin(segs[2], [0, 1.5 * th], th3); spin(segs[3], [0, 1.5 * th], th3); }
  return segs;
}

function stepStrap(t) {
  const L = 36;
  const st = span(t, 0.82, 1);
  const pieces = strapSection(t).map((s, i) => {
    const vy = (s.b[0] - s.a[0]) / 4, vz = (s.b[1] - s.a[1]) / 4;
    return {
      id: `strip-${i}`, pts: rect(L, 4), O: [0, s.a[0], s.a[1]], U: [1, 0, 0], V: [0, vy, vz],
      out: [0, s.out[0], s.out[1]], fill: FILL.duck, inner: FILL.duckBack,
      lines: i === 2 && st > 0
        ? [{ pts: [[0.3, 0.4], [L - 0.3, 0.4]], t: st, kind: 'hotstitch', side: 'out' },
           { pts: [[0.3, 3.6], [L - 0.3, 3.6]], t: st, kind: 'hotstitch', side: 'out' }]
        : [],
      zc: (s.a[1] + s.b[1]) / 2,
    };
  });
  pieces.sort((p, q) => p.zc - q.zc);
  const o16 = 1 - span(t, 0.33, 0.38);
  const o8 = span(t, 0.55, 0.58) * (1 - span(t, 0.6, 0.64));
  const o4 = span(t, 0.78, 0.84);
  return {
    pieces,
    over: [
      { type: 'dim', a: [L + 4, -8, 0], b: [L + 4, 8, 0], text: '16 cm', o: o16 },
      { type: 'dim', a: [L + 4, -4, 0], b: [L + 4, 4, 0], text: '8 cm', o: o8 },
      { type: 'dim', a: [L + 4, -4, 3 * T], b: [L + 4, 0, 3 * T], text: '4 cm', o: o4, hot: true },
      { type: 'label', p: [L / 2, -2, 3 * T], text: 'topstitch both edges', o: span(t, 0.84, 0.9), dy: -6 },
    ],
    inset: { segs: strapSection(t, 0.9), range: [-8, 8] },
  };
}

/* ---------- Step 3: the bottom — centre crease, then a stitched fold 6 cm each side ---------- */

const BOT = SPEC.boxBase / 2; // 6 cm each side of the centre
const Y1 = HALF - BOT, Y2 = HALF + BOT; // 37 and 49 cm along the 86 cm piece

const bottomPhases = (t) => ({
  crease: span(t, 0.02, 0.12) * (1 - span(t, 0.14, 0.24)),
  mark: span(t, 0.26, 0.34),
  f1: span(t, 0.36, 0.46) * (1 - span(t, 0.58, 0.66)),
  s1: span(t, 0.47, 0.57),
  f2: span(t, 0.68, 0.78) * (1 - span(t, 0.9, 0.98)),
  s2: span(t, 0.79, 0.89),
});

/** Cross-section along the piece: four bands [far end · line 1 · centre · line 2 · near end]. */
function bottomSection(t, th = T) {
  const p = bottomPhases(t);
  const segs = [[0, Y1], [Y1, HALF], [HALF, Y2], [Y2, 86]].map(([a, b]) => ({ a: [a, 0], b: [b, 0], out: [0, 1] }));
  const spin = (s, c, a) => {
    s.a = rot2(s.a, c, a);
    s.b = rot2(s.b, c, a);
    s.out = rot2(s.out, [0, 0], a);
  };
  if (p.crease) { spin(segs[2], [HALF, th / 2], Math.PI * p.crease); spin(segs[3], [HALF, th / 2], Math.PI * p.crease); }
  if (p.f1) spin(segs[0], [Y1, th / 2], -Math.PI * p.f1);
  if (p.f2) spin(segs[3], [Y2, th / 2], Math.PI * p.f2);
  return segs;
}

function stepBottom(t) {
  const p = bottomPhases(t);
  const lens = [Y1, BOT, BOT, 86 - Y2];
  const across = (v, kind, side) => ({ pts: [[0.4, v], [44.6, v]], kind, side });
  const pieces = bottomSection(t).map((s, i) => {
    const len = lens[i];
    const lines = [];
    if (i === 1 && t > 0.24) lines.push(across(BOT, 'fold'));
    if (p.mark > 0 && i === 1) lines.push(across(0, 'mark'));
    if (p.mark > 0 && i === 2) lines.push(across(BOT, 'mark'));
    if (i === 1 && t > 0.6) lines.push(across(0.3, 'stitch', 'out'));
    if (i === 2 && t > 0.92) lines.push(across(BOT - 0.3, 'stitch', 'out'));
    return {
      id: `bottom-${i}`, pts: rect(45, len), O: [0, s.a[0], s.a[1]], U: [1, 0, 0],
      V: [0, (s.b[0] - s.a[0]) / len, (s.b[1] - s.a[1]) / len], out: [0, s.out[0], s.out[1]],
      fill: FILL.duck, inner: FILL.duckBack, lines, zc: (s.a[1] + s.b[1]) / 2,
    };
  });
  pieces.sort((a, b) => a.zc - b.zc);
  const z = T + 0.04;
  const sewing1 = span(t, 0.45, 0.47) * (1 - span(t, 0.58, 0.6));
  const sewing2 = span(t, 0.77, 0.79) * (1 - span(t, 0.9, 0.92));
  const end = span(t, 0.95, 1);
  return {
    pieces,
    over: [
      { type: 'label', p: [22.5, HALF, 0], text: 'centre crease', o: span(t, 0.22, 0.28) * (1 - span(t, 0.36, 0.4)), dy: -4 },
      { type: 'dim', a: [-2, Y1, 0], b: [-2, HALF, 0], text: '6 cm', o: p.mark * (1 - span(t, 0.36, 0.4)), hot: true },
      { type: 'dim', a: [47, HALF, 0], b: [47, Y2, 0], text: '6 cm', o: p.mark * (1 - span(t, 0.36, 0.4)), hot: true },
      { type: 'line', pts: [[0.4, Y1 + 0.3, z], [44.6, Y1 + 0.3, z]], t: p.s1, kind: 'hot', o: sewing1 },
      { type: 'line', pts: [[0.4, Y2 - 0.3, z], [44.6, Y2 - 0.3, z]], t: p.s2, kind: 'hot', o: sewing2 },
      { type: 'label', p: [22.5, Y1, z], text: 'stitch close to the fold', o: sewing1, dy: -6, hot: true },
      { type: 'label', p: [22.5, Y2, z], text: 'stitch close to the fold', o: sewing2, dy: -6, hot: true },
      { type: 'dim', a: [47, Y1, 0], b: [47, Y2, 0], text: '12 cm bottom', o: end, hot: true },
    ],
    inset: { segs: bottomSection(t, 2.5), range: [0, 86] },
    focus: {
      pts: t < 0.68 ? [[0, Y1 - 10, 0], [45, Y1 - 10, 0], [0, Y1 + 12, 0], [45, Y1 + 12, 0]]
                    : [[0, Y2 - 12, 0], [45, Y2 - 12, 0], [0, Y2 + 10, 0], [45, Y2 + 10, 0]],
      k: 0.45 * (sewing1 + sewing2),
    },
  };
}

/* ---------- Step 4: fold the outer at the centre crease, sew the sides ---------- */

function foldedFlat(t, look, key) {
  const fold = span(t, 0.04, 0.5);
  const ridge = (v) => [{ pts: [[0.4, v], [44.6, v]], kind: 'stitch', side: 'out' }];
  const A = { id: `${key}-a`, pts: rect(45, HALF), O: [0, 0, 0], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], ...look, lines: ridge(Y1 + 0.3) };
  let B = { id: `${key}-b`, pts: rect(45, HALF), O: [0, HALF, 0], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], ...look, lines: ridge(BOT - 0.3) };
  B = turn(B, [0, HALF, T / 2], [1, 0, 0], Math.PI * fold);
  return { pieces: [A, B], fold };
}

function stepOuter(t) {
  const { pieces, fold } = foldedFlat(t, { fill: FILL.duck, inner: FILL.duckBack }, 'outer');
  const sew = span(t, 0.58, 0.95);
  const arc = [];
  for (let i = 0; i <= 16; i++) {
    const a = (Math.PI * i) / 16;
    arc.push([22.5, HALF + Math.cos(a) * (HALF + 4), T / 2 + Math.sin(a) * (HALF + 4) * 0.55]);
  }
  const z = T + 0.02;
  return {
    pieces,
    over: [
      { type: 'arrow', pts: arc, t: span(t, 0, 0.45), o: 1 - span(t, 0.48, 0.56) },
      { type: 'label', p: [22.5, HALF, 0], text: 'centre crease', o: span(t, 0.5, 0.58), dy: 4 },
      { type: 'line', pts: [[SPEC.seam, 0, z], [SPEC.seam, HALF, z]], t: sew, kind: 'hot' },
      { type: 'line', pts: [[45 - SPEC.seam, 0, z], [45 - SPEC.seam, HALF, z]], t: sew, kind: 'hot' },
      { type: 'label', p: [45, HALF / 2, z], text: '0.5 cm seam', o: span(t, 0.62, 0.7), dx: 9, hot: true },
      { type: 'label', p: [22.5, HALF / 2, z], text: 'right sides together', o: span(t, 0.5, 0.58) },
    ],
    focus: { pts: [[0, 0, 0], [45, 0, 0], [45, HALF, 0], [0, HALF, 0]], k: span(t, 0.5, 0.6) },
  };
}

/* ---------- Steps 4–5: stand the bag up and box the corners ---------- */

function boxed(t, { key, look, standUp, d, hot, opening }) {
  const sh = shell({
    key, xa: SPEC.seam + d / 2, xb: 45 - SPEC.seam - d / 2, ya: HALF - d / 2, yb: HALF + d / 2,
    h: HALF - d / 2, ...look, flaps: { hot }, opening,
  });
  const lay = (Math.PI / 2) * (1 - standUp);
  const tilt = (ps) => (lay ? ps.map((p) => turn(p, [0, HALF, 0], [1, 0, 0], lay)) : ps);
  const walls = tilt(sh.walls), fl = tilt(sh.flapL), fr = tilt(sh.flapR);
  return { pieces: [...fl, ...inside(walls), ...outside(walls), ...fr], sh };
}

function stepCorners(t) {
  const d = D * span(t, 0.3, 0.82);
  const hot = t > 0.84;
  const { pieces } = boxed(t, {
    key: 'outer', look: { fill: FILL.duckBack, inner: FILL.duck }, standUp: span(t, 0, 0.28), d, hot,
  });
  const xb = 45 - SPEC.seam - d / 2;
  const o = span(t, 0.84, 0.92);
  return {
    pieces,
    over: [
      { type: 'label', p: [xb, HALF + d / 4, 0], text: '12 cm seam', o, hot: true, dx: -9, dy: 6 },
      { type: 'dim', a: [xb + 0.3, HALF, 0.1], b: [45 - SPEC.seam, HALF, 0.1], text: '6 cm', o },
      { type: 'label', p: [xb, HALF, 16], text: 'side seam', o, dx: 10 },
    ],
    focus: {
      pts: [[xb - 14, HALF + d / 2, 0], [xb, HALF - d / 2, 0], [45 - SPEC.seam + 4, HALF, 0], [xb, HALF, 22]],
      k: 0.75 * span(t, 0.82, 0.95),
    },
  };
}

function stepLining(t) {
  const d = D * span(t, 0.05, 0.5);
  const { pieces } = boxed(t, {
    key: 'lining', look: { fill: FILL.satinBack, inner: FILL.satin }, standUp: 1, d, opening: OPEN,
  });
  const xb = 45 - SPEC.seam - d / 2;
  const o = span(t, 0.55, 0.65);
  return {
    pieces,
    over: [
      { type: 'line', pts: [[xb + 0.1, HALF, OPEN[0]], [xb + 0.1, HALF, OPEN[1]]], kind: 'open', o },
      { type: 'label', p: [xb, HALF, (OPEN[0] + OPEN[1]) / 2], text: '8 cm opening', o, dx: 13, hot: true },
    ],
    focus: { pts: [[xb, HALF - d / 2, 0], [xb, HALF + d / 2, 0], [xb, HALF, 18], [45, HALF, 0]], k: span(t, 0.5, 0.62) },
  };
}

/* ---------- Step 6: straps on, outer into the lining, sew the top ---------- */

function joinState(t) {
  const strapFold = span(t, 0.22, 0.42);
  const outer = shell({ key: 'outer', xa: 0, xb: W, ya: 0, yb: D, h: HB, fill: FILL.duck, inner: FILL.duckBack, ridges: true }).walls;
  const sq = lerp(1, 0.7, strapFold);
  const back = strap({ id: 'strap-back', xMid: W / 2, y0: -0.05, zRim: HB, front: false, fold: strapFold, squash: sq });
  const front = strap({ id: 'strap-front', xMid: W / 2, y0: D + 0.05, zRim: HB, front: true, fold: strapFold, squash: sq });
  const lining = fadeAll(shell({
    key: 'lining', xa: -LINE, xb: W + LINE, ya: -LINE, yb: D + LINE, z0: lerp(46, 0, span(t, 0.45, 0.72)), h: HB,
    fill: FILL.satinBack, inner: FILL.satin, opening: OPEN, top: { at: SPEC.seam, t: span(t, 0.76, 1), kind: 'hot' },
  }).walls, span(t, 0.4, 0.48));
  return [...inside(lining), back, ...inside(outer), ...outside(outer), front, ...outside(lining)];
}

function stepJoin(t) {
  const o6 = span(t, 0.06, 0.12) * (1 - span(t, 0.2, 0.24));
  return {
    pieces: fadeAll(joinState(t), span(t, 0, 0.08)),
    over: [
      { type: 'dim', a: [W / 2, D, HB + 2], b: [W / 2 + SPEC.strap.fromCenter, D, HB + 2], text: '6 cm', o: o6, hot: true },
      { type: 'label', p: [W / 2, D, HB + 30], text: 'ends level with the top edge', o: o6 },
      { type: 'label', p: [W, D / 2, HB - 0.5], text: '0.5 cm seam', o: span(t, 0.8, 0.88), dx: 12, hot: true },
    ],
    focus: { pts: [[0, D, HB - 6], [W, D, HB - 6], [W / 2, D, HB + 32]], k: span(t, 0.04, 0.1) * (1 - span(t, 0.2, 0.27)) },
  };
}

/* ---------- Step 7: turn, close the opening, push the lining in, topstitch ---------- */

function stepFinish(t) {
  const turned = span(t, 0.22, 0.36);
  const close = span(t, 0.4, 0.52);
  const push = span(t, 0.56, 0.78);
  const stitch = span(t, 0.8, 1);

  const before = fadeAll(joinState(1), 1 - turned);

  const outer = shell({
    key: 'outer', xa: 0, xb: W, ya: 0, yb: D, h: H, fill: FILL.duck, inner: FILL.duckBack, ridges: true,
    top: stitch > 0 ? { at: SPEC.topstitch, t: stitch, kind: 'hotstitch' } : null,
  }).walls;
  const ext = (H - LINE) * (1 - push);
  const tube = fadeAll(shell({
    key: 'tube', xa: LINE, xb: W - LINE, ya: LINE, yb: D - LINE, z0: H, h: Math.max(ext, 0.01),
    fill: FILL.satin, inner: FILL.satinBack, lid: true,
    opening: close < 1 ? [ext - OPEN[1], ext - OPEN[0]] : null,
  }).walls, 1 - span(t, 0.66, 0.78));
  const lining = fadeAll(shell({
    key: 'lining', xa: LINE, xb: W - LINE, ya: LINE, yb: D - LINE, z0: LINE, h: H - LINE,
    fill: FILL.satinBack, inner: FILL.satin, seams: false,
  }).walls, span(t, 0.62, 0.78));
  const back = strap({ id: 'strap-back', xMid: W / 2, y0: LINE, zRim: H, front: false });
  const front = strap({ id: 'strap-front', xMid: W / 2, y0: D - LINE, zRim: H, front: true });
  const after = fadeAll(
    [back, ...inside(outer), ...inside(lining), ...inside(tube), ...outside(tube), ...outside(lining), ...outside(outer), front],
    turned,
  );

  const gapTop = H + ext - OPEN[0], gapLow = H + ext - OPEN[1];
  const turnArc = [[W + LINE, D / 2, 6], [W + 8, D / 2 + 3, 9], [W + 13, D / 2 + 5, 16]];
  return {
    pieces: [...before, ...after],
    over: [
      { type: 'line', pts: [[W + LINE + 0.1, D / 2, OPEN[0]], [W + LINE + 0.1, D / 2, OPEN[1]]], kind: 'open', o: 1 - turned },
      { type: 'arrow', pts: turnArc, t: span(t, 0.04, 0.18), o: 1 - turned },
      { type: 'label', p: [W + 13, D / 2 + 5, 16], text: 'turn through the opening', o: span(t, 0.06, 0.12) * (1 - turned), dy: -4 },
      { type: 'line', pts: [[W - LINE + 0.1, D / 2, gapLow], [W - LINE + 0.1, D / 2, gapTop]], t: close, kind: 'hot', o: turned * (1 - push) },
      { type: 'label', p: [W - LINE, D / 2, (gapLow + gapTop) / 2], text: 'stitch it closed', o: span(t, 0.38, 0.44) * (1 - span(t, 0.54, 0.58)), dx: 12, hot: true },
      { type: 'arrow', pts: [[W / 2, D / 2, H + 40], [W / 2, D / 2, H + 26]], o: span(t, 0.54, 0.6) * (1 - span(t, 0.72, 0.78)) },
      { type: 'label', p: [W / 2, D / 2, H + 44], text: 'push the lining in', o: span(t, 0.54, 0.6) * (1 - span(t, 0.72, 0.78)) },
      { type: 'label', p: [W, D / 2, H - SPEC.topstitch], text: '1 cm topstitch', o: span(t, 0.82, 0.9), dx: 12, hot: true },
    ],
    focus: t < 0.3
      ? { pts: [[W, 0, 0], [W, D, 0], [W, D / 2, 18], [W + 13, D / 2 + 5, 16]], k: span(t, 0.02, 0.1) * (1 - span(t, 0.2, 0.28)) }
      : { pts: [[0, D, H], [W, 0, H + ext + 2], [W, D, gapLow - 6]], k: 0.7 * span(t, 0.36, 0.42) * (1 - span(t, 0.5, 0.56)) },
  };
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps. `text` is the short caption under the figure; `details` is the full
  written instruction (the list under the figure). `uses` — catalog products
  handy in that step (ids from src/data/products.js, shown as labelled
  affiliate links under the caption). `stitch` — the machine stitch.
*/
export const STEPS = [
  {
    title: 'The finished bag',
    text: 'A lined tote in three parts: a cotton duck outer, a satin lining and two long straps. Tap the bag to take it apart.',
  },
  {
    title: 'Cut the pieces', scene: stepCut, duration: 2.6,
    uses: ['cotton-duck-cloth', 'olfa-rotary-cutter', 'olfa-cutting-mat', 'quilting-rulers-set', 'sewline-air-erasable-pen'],
    text: 'Outer: cotton duck, 86 × 45 cm (33⅞ × 17¾ in). Lining: satin, the same size. Straps: two strips of duck, 100 × 16 cm (39⅜ × 6¼ in).',
    details: [
      'Cut one 86 × 45 cm (33⅞ × 17¾ in) rectangle of cotton duck for the outer and one of satin, the same size, for the lining.',
      'For the straps, cut two strips of duck, 100 × 16 cm (39⅜ × 6¼ in).',
      'On the outer and the lining, mark the fold line across the middle, 43 cm (16⅞ in) from either short end — it becomes the bottom of the bag.',
      'Every seam allowance in this bag is 0.5 cm (³⁄₁₆ in).',
    ],
  },
  {
    title: 'Make the straps', scene: stepStrap, duration: 7, stitch: 'straight', sew: [[0.82, 1, 'duck']], pad: 0.22,
    uses: ['rowenta-travel-iron', 'janome-hd2200', 'hagbou-thread-set'],
    text: 'Fold in half and press, open, fold both edges to the crease, fold again: a 4 cm (1⅝ in) strap, four layers thick. Topstitch both edges.',
    details: [
      'Fold a strip in half lengthwise, wrong sides together, and press a crease.',
      'Open it out. Fold both long edges in so they meet at the crease, and press again.',
      'Fold in half along the first crease. The strap is now 4 cm (1⅝ in) wide and four layers thick, with every raw edge tucked inside.',
      'Topstitch close to both long edges with a straight stitch. Make two straps.',
    ],
  },
  {
    title: 'Shape the bottom', scene: stepBottom, duration: 9.5, stitch: 'straight', pad: 0.22,
    sew: [[0.47, 0.57, 'duck'], [0.79, 0.89, 'duck']],
    uses: ['rowenta-travel-iron', 'quilting-rulers-set', 'sewline-air-erasable-pen', 'janome-hd2200'],
    text: 'Crease the centre and open it out. Measure 6 cm (2⅜ in) to each side, fold on each line and stitch close to the fold: two stitched folds, a 12 cm (4¾ in) bottom.',
    details: [
      'Fold the outer in half across the middle and press a crease. Open it out again.',
      'Measure 6 cm (2⅜ in) from the crease towards each end and mark a line across the whole width of the piece.',
      'Fold along the first line and stitch close to the fold. Open it out, then fold and stitch along the second line the same way.',
      'The two stitched folds, 12 cm (4¾ in) apart, become the crisp edges of the bottom of the bag.',
    ],
  },
  {
    title: 'Sew the sides', scene: stepOuter, duration: 4, stitch: 'straight', sew: [[0.58, 0.95, 'duck']],
    uses: ['soraco-sewing-clips', 'janome-hd2200'],
    text: 'Fold the outer in half on the centre crease, right sides together. Sew both sides with a 0.5 cm (³⁄₁₆ in) seam.',
    details: [
      'Fold the outer in half on the centre crease, right sides together, so the stitched folds lie on top of each other.',
      'Clip or pin the sides and sew both side seams, 0.5 cm (³⁄₁₆ in) from the edge. Leave the top open.',
    ],
  },
  {
    title: 'Box the corners', scene: stepCorners, duration: 4.5, stitch: 'straight', sew: [[0.84, 1, 'duck']],
    uses: ['quilting-rulers-set', 'sewline-air-erasable-pen', 'janome-hd2200'],
    text: 'Flatten a bottom corner into a triangle, side seam on the fold. Sew across 6 cm (2⅜ in) from the tip — a 12 cm (4¾ in) seam. Repeat.',
    details: [
      'With the outer still inside out, open one bottom corner and flatten it into a triangle, so the side seam lies right on top of the bottom fold.',
      'Measure 6 cm (2⅜ in) from the tip and draw a line straight across. It is 12 cm (4¾ in) long, and its ends meet the two stitched folds.',
      'Sew along the line. Repeat on the other corner — the bag now stands on a 12 cm (4¾ in) base.',
    ],
  },
  {
    title: 'Sew the lining', scene: stepLining, duration: 3.5, stitch: 'straight', sew: [[0.05, 0.5, 'satin']],
    uses: ['soraco-sewing-clips', 'janome-hd2200'],
    text: 'Sew the satin lining the same way — but leave an 8 cm (3⅛ in) opening low in one side seam. You will turn the bag through it.',
    details: [
      'Fold the satin lining at the fold line, right sides together, and sew both side seams, 0.5 cm (³⁄₁₆ in) from the edge.',
      'On one side, leave an 8 cm (3⅛ in) gap in the seam, low down near the bottom — you will turn the bag through it.',
      'Box both corners exactly like the outer: 6 cm (2⅜ in) from the tip, a 12 cm (4¾ in) seam. Keep the lining inside out.',
    ],
  },
  {
    title: 'Join outer and lining', scene: stepJoin, duration: 6, stitch: 'straight', sew: [[0.76, 1, 'satin']],
    uses: ['soraco-sewing-clips', 'janome-hd2200'],
    text: 'Pin the straps to the outer, 6 cm (2⅜ in) from the centre. Slip the outer into the inside-out lining and sew around the top.',
    details: [
      'Turn the outer right side out.',
      'Pin a strap to the front top edge: ends level with the raw edge, 6 cm (2⅜ in) from the centre, the loop hanging down over the bag. Do the same on the back.',
      'Slip the outer, straps and all, into the inside-out lining, so the right sides face each other. Line up the side seams and the top edges.',
      'Sew all the way around the top, 0.5 cm (³⁄₁₆ in) from the edge.',
    ],
  },
  {
    title: 'Turn and topstitch', scene: stepFinish, duration: 7, stitch: 'straight', sew: [[0.4, 0.52, 'satin'], [0.8, 1, 'duck']],
    uses: ['rowenta-travel-iron', 'janome-hd2200'],
    text: 'Turn the bag through the opening and stitch it closed. Push the lining in and topstitch around the top, 1 cm (⅜ in) from the edge.',
    details: [
      'Pull the whole bag right side out through the opening in the lining.',
      'Tuck in the raw edges of the opening and stitch it closed, close to the edge.',
      'Push the lining down inside the bag and press the top edge flat.',
      'Topstitch all around the top, 1 cm (⅜ in) from the edge. Your tote is done!',
    ],
  },
];

export const LEGEND = [
  { n: 1, title: 'Outer', text: 'cotton duck · cut 86 × 45 cm (33⅞ × 17¾ in), folded at the bottom' },
  { n: 2, title: 'Lining', text: 'satin · cut 86 × 45 cm, the same as the outer' },
  { n: 3, title: 'Straps ×2', text: 'cut 100 × 16 cm (39⅜ × 6¼ in) · folded in four to 4 cm (1⅝ in)' },
  { n: 4, title: 'Bottom', text: 'two folds stitched 6 cm (2⅜ in) each side of the centre → a 12 cm (4¾ in) base; corners boxed 6 cm from the tip' },
  { n: 5, title: 'Topstitch', text: '1 cm (⅜ in) from the top edge · all seams 0.5 cm (³⁄₁₆ in)' },
];

const union = (a, b) => {
  const x0 = Math.min(a[0], b[0]), y0 = Math.min(a[1], b[1]);
  return [x0, y0, Math.max(a[0] + a[2], b[0] + b[2]) - x0, Math.max(a[1] + a[3], b[1] + b[3]) - y0];
};

/** Grow a box to the figure's aspect ratio, centred, with padding. */
function fit(b, padK = 0.06) {
  const pad = Math.max(b[2], b[3]) * padK;
  let w = b[2] + 2 * pad, h = b[3] + 2 * pad;
  if (w / h < ASPECT) w = h * ASPECT; else h = w / ASPECT;
  const cx = b[0] + b[2] / 2, cy = b[1] + b[3] / 2;
  return [cx - w / 2, cy - h / 2, w, h];
}

function sceneBounds(s) {
  const pts = s.over.filter((o) => (o.o ?? 1) > 0.01).flatMap(overlayPoints);
  const live = s.pieces.filter((p) => (p.opacity ?? 1) > 0.01);
  let b = live.length ? bounds(live) : null;
  if (pts.length) b = b ? union(b, pointBounds(pts)) : pointBounds(pts);
  return b;
}

const cams = [];
function camera(k) {
  if (cams[k]) return cams[k];
  if (k === 0) {
    const b1 = fit(union(sceneBounds(anatomy(0)), sceneBounds(anatomy(1))), 0.05);
    const b0 = fit(sceneBounds(anatomy(0)), 0.07);
    cams[0] = [b0, b1];
  } else {
    let b = null;
    for (let i = 0; i <= 20; i++) {
      const s = STEPS[k].scene(i / 20);
      const sb = sceneBounds(s);
      if (sb) b = b ? union(b, sb) : sb;
    }
    cams[k] = fit(b, STEPS[k].pad ?? 0.08);
  }
  return cams[k];
}

/** The cross-section ("end view") of the strap, drawn flat in a corner box. */
function insetSvg({ segs, range }, cam) {
  const u = cam[2] / 100;
  const bw = 46 * u, bh = 24 * u;
  const x0 = cam[0] + 4 * u, y0 = cam[1] + cam[3] - bh - 4 * u;
  const k = (bw - 10 * u) / (range[1] - range[0]); // the whole width across (layers drawn thicker than life)
  const cy = y0 + bh * 0.8;
  const P = ([y, z]) => `${(x0 + 5 * u + (y - range[0]) * k).toFixed(2)} ${(cy - z * k).toFixed(2)}`;
  const lines = segs.map((s) => `<path class="inset__seg" d="M${P(s.a)}L${P(s.b)}" stroke-width="${(1.1 * u).toFixed(2)}"/>`).join('');
  return (
    `<g class="inset"><rect x="${x0.toFixed(2)}" y="${y0.toFixed(2)}" width="${bw.toFixed(2)}" height="${bh.toFixed(2)}" rx="${(2 * u).toFixed(2)}"/>` +
    `<text x="${(x0 + 2.4 * u).toFixed(2)}" y="${(y0 + 4.2 * u).toFixed(2)}" font-size="${(2.6 * u).toFixed(2)}">END VIEW</text>` +
    lines + `</g>`
  );
}

export const STITCHES = { straight: 'Straight stitch' };

/** Which sewing window (if any) is running at t → { s: progress, o: opacity, fabric }. */
function sewingAt(step, t) {
  for (const [a, b, fabric] of step.sew ?? []) {
    const o = span(t, a - 0.04, a) * (b >= 1 ? 1 : 1 - span(t, b, b + 0.04));
    if (o > 0.01) return { s: Math.max(0, Math.min(1, (t - a) / (b - a))), o, fabric };
  }
  return null;
}

/*
  A tiny sewing machine in the top-right corner while a seam is being sewn:
  the needle goes up and down, the fabric feeds left and the stitches follow.
  Generic shape — no brand.
*/
function machineSvg(m, cam, stitch) {
  const u = cam[2] / 100;
  const w = 38 * u, h = 25 * u;
  const x0 = cam[0] + cam[2] - w - 4 * u, y0 = cam[1] + 4 * u;
  const X = (a) => (x0 + a * u).toFixed(2), Y = (b) => (y0 + b * u).toFixed(2), L = (a) => (a * u).toFixed(2);
  const turns = 16;
  const dip = (1.7 * (1 - Math.cos(m.s * Math.PI * 2 * turns))) / 2;
  const feed = (m.s * turns * 2) % 2;
  const nx = 13;
  const fabric = m.fabric === 'satin' ? '#e6d0ae' : '#c08a87';
  return (
    `<g class="machine" opacity="${m.o.toFixed(3)}">` +
    `<rect class="machine__box" x="${X(0)}" y="${Y(0)}" width="${L(38)}" height="${L(25)}" rx="${L(2)}"/>` +
    `<text x="${X(2.4)}" y="${Y(4.2)}" font-size="${L(2.6)}">${(STITCHES[stitch] ?? '').toUpperCase()}</text>` +
    `<rect class="machine__bed" x="${X(3)}" y="${Y(19)}" width="${L(32)}" height="${L(2.6)}" rx="${L(1)}"/>` +
    `<rect class="machine__body" x="${X(27)}" y="${Y(8)}" width="${L(5)}" height="${L(11.5)}"/>` +
    `<rect class="machine__body" x="${X(10.5)}" y="${Y(6)}" width="${L(23)}" height="${L(4.6)}" rx="${L(2)}"/>` +
    `<rect class="machine__head" x="${X(9.5)}" y="${Y(6)}" width="${L(6.5)}" height="${L(9)}" rx="${L(1.4)}"/>` +
    `<circle class="machine__wheel" cx="${X(33.5)}" cy="${Y(9)}" r="${L(2.4)}"/>` +
    `<rect class="machine__fabric" x="${X(3)}" y="${Y(18.2)}" width="${L(32)}" height="${L(1)}" fill="${fabric}"/>` +
    `<path class="machine__stitches" d="M${X(3)} ${Y(18.7)}H${X(nx)}" stroke-width="${L(0.45)}" stroke-dasharray="${L(1.2)} ${L(0.8)}" stroke-dashoffset="${L(feed)}"/>` +
    `<path class="machine__bar" d="M${X(nx)} ${Y(15)}V${Y(16.2 + dip)}" stroke-width="${L(0.8)}"/>` +
    `<path class="machine__needle" d="M${X(nx)} ${Y(16.2 + dip)}V${Y(18.5 + dip)}" stroke-width="${L(0.35)}"/>` +
    `<rect class="machine__foot" x="${X(nx - 1.8)}" y="${Y(17.5)}" width="${L(3.6)}" height="${L(0.7)}" rx="${L(0.3)}"/>` +
    `</g>`
  );
}

const shadowSvg = (cam, at3) => {
  const [x, y] = project(at3);
  return `<ellipse class="floor" cx="${x.toFixed(2)}" cy="${(y + 1).toFixed(2)}" rx="${(W * 0.62).toFixed(2)}" ry="${(D * 0.9).toFixed(2)}"/>`;
};

/** Step k at time t (for step 0, t is how far apart it is). Returns SVG body + viewBox. */
export function renderStep(k, t) {
  if (k === 0) {
    const [b0, b1] = camera(0);
    const tt = ease(t);
    const cam = b0.map((v, i) => lerp(v, b1[i], tt));
    const s = anatomy(t);
    const show = span(t, 0.75, 1);
    const u = cam[2] / 100;
    const pinSvg = show
      ? `<g class="pins" opacity="${show.toFixed(3)}">` +
        pins(t).map(({ n, p }) => {
          const [x, y] = project(p);
          return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)})"><circle r="${(3.2 * u).toFixed(2)}"/><text y="${(1.15 * u).toFixed(2)}" font-size="${(3.4 * u).toFixed(2)}">${n}</text></g>`;
        }).join('') + `</g>`
      : '';
    return { body: shadowSvg(cam, [W / 2, D / 2, 0]) + s.pieces.map(pieceSvg).join('') + pinSvg, viewBox: cam };
  }
  const s = STEPS[k].scene(t);
  let cam = camera(k);
  if (s.focus && s.focus.k > 0.001) {
    const f = fit(pointBounds(s.focus.pts), 0.3);
    cam = cam.map((v, i) => lerp(v, f[i], s.focus.k));
  }
  const floor = k >= 4 ? shadowSvg(cam, k >= 6 ? [W / 2, D / 2, 0] : [22.5, HALF, 0]) : '';
  const sewing = sewingAt(STEPS[k], t);
  return {
    body: floor + s.pieces.map(pieceSvg).join('') + s.over.map((o) => overlaySvg(o, cam)).join('') +
      (s.inset ? insetSvg(s.inset, cam) : '') + (sewing ? machineSvg(sewing, cam, STEPS[k].stitch) : ''),
    viewBox: cam,
  };
}

/** Fabric patterns, in each piece's own cm coordinates. */
export const DEFS = `
<defs>
  <pattern id="duck" width="10" height="10" patternUnits="userSpaceOnUse">
    <rect width="5" height="5" fill="#c08a87"/>
    <circle cx="1.25" cy="1.25" r="0.45" fill="#fffdf8" opacity=".75"/><circle cx="3.75" cy="3.75" r="0.45" fill="#fffdf8" opacity=".75"/>
    <rect x="5" width="5" height="5" fill="#fffdf8"/>
    <path d="M6.2 1.2l.9.9m0-.9l-.9.9M8.4 3.4l.9.9m0-.9l-.9.9" stroke="#a86f6c" stroke-width=".22"/>
    <rect y="5" width="5" height="5" fill="#9caf88"/>
    <path d="M0 6.25H5M0 7.5H5M0 8.75H5" stroke="#fffdf8" stroke-width=".35" opacity=".45"/>
    <rect x="5" y="5" width="5" height="5" fill="#e8c27a"/>
    <circle cx="7.5" cy="7.5" r="1.3" fill="none" stroke="#fffdf8" stroke-width=".35" opacity=".8"/>
  </pattern>
  <pattern id="duckBack" width="10" height="10" patternUnits="userSpaceOnUse">
    <rect width="10" height="10" fill="#f3e9da"/>
    <rect width="10" height="10" fill="url(#duck)" opacity=".28"/>
  </pattern>
  <linearGradient id="satin" x1="0" y1="0" x2="1" y2="0.35">
    <stop offset="0" stop-color="#e2cba8"/><stop offset=".38" stop-color="#f6e9d4"/>
    <stop offset=".55" stop-color="#e6d0ae"/><stop offset=".8" stop-color="#f2e2c7"/><stop offset="1" stop-color="#dcc29c"/>
  </linearGradient>
  <linearGradient id="satinBack" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ddc8a8"/><stop offset="1" stop-color="#e6d5ba"/>
  </linearGradient>
  <radialGradient id="floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

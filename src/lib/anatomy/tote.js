/*
  Tote bag ("shopper") — the anatomy figure's model and its sewing steps.
  Every number comes from the maker's own pattern (Vault: «Анатомия изделий —
  пилот «Шопер»»; video https://youtu.be/Fs1QfrJIfwE). Change numbers HERE only.
  Words (titles, captions, instructions, chips, legend) are NOT here: tote.<lang>.js,
  picked through tote.text.js.

  Step 0 is the finished bag (tap to take it apart); steps 1–9 each animate one
  stage of sewing over t = 0…1. Each returns painter-ordered pieces + overlays.

  The bottom is the maker's own trick: two folds stitched 6 cm each side of the
  centre crease, then the bottom is tucked in (centre crease inside, like a
  paper bag) before the side seams — so the corners form by themselves.

  Shared parts (shell, camera, inset, machine, renderer) live in kit.js. SVG ids carry the
  figure's prefix ('tote-bag-…'), so two figures can never collide.
*/
import { at, band, lerp, offset, turn } from './iso.js';
import { fadeAll, inside, labelKeys, makeRenderer, outside, rect, rot2, shell, span } from './kit.js';

const ID = 'tote-bag'; // prefix of every SVG id of this figure (fills, clip, floor)

export const SPEC = {
  outer: { cut: [86, 45], fabric: 'cotton duck' }, // folded at the bottom: each half 45 wide × 43 tall
  lining: { cut: [86, 45], fabric: 'satin' },
  strap: { cut: [100, 16], done: 4, count: 2, fromCenter: 6 },
  seam: 0.5,
  boxBase: 12, // two stitched folds 6 cm each side of the centre crease → a 12 cm base
  opening: 8, // left open low in a lining side seam, just above the tucked bottom
  topstitch: 1,
};

const T = 0.25; // fabric thickness in the drawing (cm)
const HALF = SPEC.outer.cut[0] / 2; // 43
const FLAT = SPEC.outer.cut[1] - 2 * SPEC.seam; // 44: width once the sides are sewn
const D = SPEC.boxBase; // 12
const W = FLAT - D; // 32: front width when boxed
const HB = HALF - SPEC.boxBase / 2; // 37: height once the bottom is tucked in, before the top seam
const H = HB - SPEC.seam; // 36.5: finished height (drawing only — not published)
const LINE = 0.35; // gap between outer and lining
const OPEN = [8, 8 + SPEC.opening]; // opening, cm above the bottom of the lining (above the 6 cm tuck)

const FILL = {
  duck: `url(#${ID}-duck)`, duckBack: `url(#${ID}-duckBack)`,
  satin: `url(#${ID}-satin)`, satinBack: `url(#${ID}-satinBack)`,
};

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
    key: 'outer', xa: 0, xb: W, ya: 0, yb: D, h: H, vee: 'bottom',
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
      { type: 'dim', a: [0, 0, -5], b: [45, 0, -5], label: 'cm45', o },
      { type: 'dim', a: [-5, 0, 0], b: [-5, 0, 86], label: 'cm86', o },
      { type: 'label', p: [22.5, 0, HALF], label: 'fold', o },
      { type: 'label', p: [72.5, 0, HALF], label: 'fold', o },
      { type: 'label', p: [22.5, 0, 93], label: 'outerDuck', o },
      { type: 'label', p: [72.5, 0, 93], label: 'liningSatin', o },
      { type: 'label', p: [118.5, 0, 93], label: 'strapsDuck', o },
      { type: 'dim', a: [100, 0, -19], b: [116, 0, -19], label: 'cm16', o },
      { type: 'dim', a: [142, 0, -14], b: [142, 0, 86], label: 'cm100', o },
    ],
  };
}

/* ---------- Step 2: fold a strap (16 cm → 4 cm, four layers) ---------- */

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
      { type: 'dim', a: [L + 4, -8, 0], b: [L + 4, 8, 0], label: 'cm16', o: o16 },
      { type: 'dim', a: [L + 4, -4, 0], b: [L + 4, 4, 0], label: 'cm8', o: o8 },
      { type: 'dim', a: [L + 4, -4, 3 * T], b: [L + 4, 0, 3 * T], label: 'cm4', o: o4, hot: true },
      { type: 'label', p: [L / 2, -2, 3 * T], label: 'topstitchEdges', o: span(t, 0.84, 0.9), dy: -6 },
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
    if (i === 1 && t > 0.6) lines.push(across(0.3, 'seam', 'out'));
    if (i === 2 && t > 0.92) lines.push(across(BOT - 0.3, 'seam', 'out'));
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
      { type: 'label', p: [22.5, HALF, 0], label: 'centreCrease', o: span(t, 0.22, 0.28) * (1 - span(t, 0.36, 0.4)), dy: -4 },
      { type: 'dim', a: [-2, Y1, 0], b: [-2, HALF, 0], label: 'cm6', o: p.mark * (1 - span(t, 0.36, 0.4)), hot: true },
      { type: 'dim', a: [47, HALF, 0], b: [47, Y2, 0], label: 'cm6', o: p.mark * (1 - span(t, 0.36, 0.4)), hot: true },
      { type: 'line', pts: [[0.4, Y1 + 0.3, z], [44.6, Y1 + 0.3, z]], t: p.s1, kind: 'hot', o: sewing1 },
      { type: 'line', pts: [[0.4, Y2 - 0.3, z], [44.6, Y2 - 0.3, z]], t: p.s2, kind: 'hot', o: sewing2 },
      { type: 'label', p: [22.5, Y1, z], label: 'stitchFold', o: sewing1, dy: -6, hot: true },
      { type: 'label', p: [22.5, Y2, z], label: 'stitchFold', o: sewing2, dy: -6, hot: true },
      { type: 'dim', a: [47, Y1, 0], b: [47, Y2, 0], label: 'bottom12', o: end, hot: true },
    ],
    inset: { segs: bottomSection(t, 2.5), range: [0, 86] },
    focus: {
      pts: t < 0.68 ? [[0, Y1 - 10, 0], [45, Y1 - 10, 0], [0, Y1 + 12, 0], [45, Y1 + 12, 0]]
                    : [[0, Y2 - 12, 0], [45, Y2 - 12, 0], [0, Y2 + 10, 0], [45, Y2 + 10, 0]],
      k: 0.45 * (sewing1 + sewing2),
    },
  };
}

/* ---------- Step 4: tuck the bottom in — the centre crease goes inside ---------- */

const GAP = 4 * T; // how close the walls come once the piece is folded flat

/*
  Cross-section (y, z) of the piece folded with its bottom tucked in: both ends
  lift at the stitched folds (a U), the 12 cm bottom folds in on itself so the
  centre crease goes 6 cm up inside (like a paper bag), then the whole thing is
  laid down flat — 6 cm shorter than a plain fold in half, right sides together.
*/
function tuckSection(t, gap = GAP) {
  const up = span(t, 0.04, 0.3), fold = span(t, 0.36, 0.72), lay = span(t, 0.78, 0.96);
  const psi = Math.acos(gap / (2 * BOT)) * fold;
  const c1 = [Y1, 0];
  const tip = [Y1 + BOT * Math.cos(psi), BOT * Math.sin(psi)];
  const c2 = [Y1 + 2 * BOT * Math.cos(psi), 0];
  const a0 = Math.PI - (Math.PI / 2) * up, a3 = (Math.PI / 2) * up;
  const end0 = [c1[0] + Y1 * Math.cos(a0), Y1 * Math.sin(a0)];
  const end3 = [c2[0] + (86 - Y2) * Math.cos(a3), (86 - Y2) * Math.sin(a3)];
  return [[end0, c1], [c1, tip], [tip, c2], [c2, end3]].map(([a, b]) => {
    if (lay) { a = rot2(a, c1, (Math.PI / 2) * lay); b = rot2(b, c1, (Math.PI / 2) * lay); }
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return { a, b, out: [-(b[1] - a[1]) / l, (b[0] - a[0]) / l] }; // right side = left of travel
  });
}

/** The four bands of the piece in 3D (far wall, bottom half, bottom half, near wall). */
function tuckPieces(t, look, ghost = 1) {
  const lens = [Y1, BOT, BOT, 86 - Y2];
  const across = (v, kind) => ({ pts: [[0.4, v], [44.6, v]], kind, side: 'out' });
  const lines = [[], [across(0.3, 'seam'), across(BOT, 'fold')], [across(BOT - 0.3, 'seam')], []];
  return tuckSection(t).map((s, i) => ({
    id: `tuck-${i}`, pts: rect(45, lens[i]), O: [0, s.a[0], s.a[1]], U: [1, 0, 0],
    V: [0, (s.b[0] - s.a[0]) / lens[i], (s.b[1] - s.a[1]) / lens[i]], out: [0, s.out[0], s.out[1]],
    ...look, lines: lines[i], opacity: i === 3 ? ghost : 1,
  }));
}

const DUCK = { fill: FILL.duck, inner: FILL.duckBack };

function stepTuck(t) {
  const ghost = 1 - 0.55 * span(t, 0.34, 0.4) * (1 - span(t, 0.76, 0.82));
  const end = span(t, 0.95, 1);
  return {
    pieces: tuckPieces(t, DUCK, ghost),
    over: [
      { type: 'label', p: [22.5, Y1, 0], label: 'liftEnds', o: span(t, 0.04, 0.1) * (1 - span(t, 0.3, 0.34)), dy: 7 },
      { type: 'label', p: [22.5, HALF, 3], label: 'foldsIn', o: span(t, 0.4, 0.46) * (1 - span(t, 0.74, 0.78)), dy: -4, hot: true },
      { type: 'dim', a: [47, Y1, 0], b: [47, Y1 - BOT, 0], label: 'centreInside', o: end, hot: true },
      { type: 'label', p: [22.5, Y1 / 2, GAP], label: 'rightSides', o: end },
    ],
    inset: { segs: tuckSection(t, 3), range: [0, 86] },
  };
}

/* ---------- Step 5: sew the sides through all the layers ---------- */

function stepSides(t) {
  const sew = span(t, 0.15, 0.85);
  const z = GAP + 0.04;
  return {
    pieces: tuckPieces(1, DUCK, 1 - 0.5 * span(t, 0.86, 0.92)),
    over: [
      { type: 'line', pts: [[SPEC.seam, 0, z], [SPEC.seam, Y1, z]], t: sew, kind: 'hot' },
      { type: 'line', pts: [[45 - SPEC.seam, 0, z], [45 - SPEC.seam, Y1, z]], t: sew, kind: 'hot' },
      { type: 'label', p: [45, Y1 / 2, z], label: 'seam05', o: span(t, 0.2, 0.28), dx: 10, hot: true },
      { type: 'label', p: [45, Y1 - BOT / 2, z], label: 'layers4', o: span(t, 0.86, 0.92), dx: 10 },
    ],
    inset: { segs: tuckSection(1, 2), range: [Y1 - 13, Y1 + 3] },
  };
}

/* ---------- Step 6: turn it out — the corners form by themselves ---------- */

/** The sewn bag standing (stand 1) or lying flat (0), opened to depth d. */
function openBox({ key, d, stand, look, opening, veeHot }) {
  const walls = shell({
    key, xa: SPEC.seam + d / 2, xb: 45 - SPEC.seam - d / 2, ya: Y1 - d / 2, yb: Y1 + d / 2,
    h: Y1, ...look, opening, vee: 'bottom', veeHot,
  }).walls;
  const lay = (Math.PI / 2) * (1 - stand);
  const ps = lay ? walls.map((p) => turn(p, [0, Y1, 0], [1, 0, 0], lay)) : walls;
  return [...inside(ps), ...outside(ps)];
}

function stepTurnOut(t) {
  const flip = span(t, 0.08, 0.26), stand = span(t, 0.3, 0.5), d = D * span(t, 0.52, 0.86);
  const xb = 45 - SPEC.seam - d / 2;
  const o = span(t, 0.88, 0.94);
  return {
    pieces: [
      ...fadeAll(tuckPieces(1, DUCK), 1 - flip),
      ...fadeAll(openBox({ key: 'outer', d, stand, look: DUCK, veeHot: t > 0.88 }), flip),
    ],
    over: [
      { type: 'label', p: [22.5, Y1 / 2, GAP], label: 'turnOut', o: span(t, 0.02, 0.08) * (1 - span(t, 0.26, 0.3)) },
      { type: 'label', p: [22.5, Y1, Y1 + 4], label: 'openUp', o: span(t, 0.52, 0.58) * (1 - span(t, 0.84, 0.88)) },
      { type: 'dim', a: [xb, Y1 - d / 2, 0], b: [xb, Y1 + d / 2, 0], label: 'base12', o, hot: true },
      { type: 'label', p: [xb, Y1, d / 2], label: 'cornersForm', o, dx: -14, dy: -14, hot: true },
    ],
    focus: { pts: [[xb - 22, Y1 + d / 2, 0], [xb, Y1 - d / 2, 0], [xb + 3, Y1, 0], [xb, Y1, 30]], k: 0.4 * o },
  };
}

/* ---------- Step 7: the lining — the same, with an opening in one side ---------- */

function stepLining(t) {
  const sew1 = span(t, 0.14, 0.31), sew2 = span(t, 0.35, 0.5);
  const swap = span(t, 0.52, 0.58), stand = span(t, 0.58, 0.72), d = D * span(t, 0.72, 0.92);
  const flat = fadeAll(tuckPieces(1, { fill: FILL.satin, inner: FILL.satinBack }), span(t, 0, 0.1) * (1 - swap));
  const box = fadeAll(openBox({ key: 'lining', d, stand, look: { fill: FILL.satinBack, inner: FILL.satin }, opening: OPEN }), swap);
  const z = GAP + 0.04, R = 45 - SPEC.seam;
  const g0 = Y1 - OPEN[1], g1 = Y1 - OPEN[0]; // the gap while flat (y runs from the top edge)
  const xb = 45 - SPEC.seam - d / 2;
  const o = span(t, 0.92, 0.97);
  return {
    pieces: [...flat, ...box],
    over: [
      { type: 'line', pts: [[SPEC.seam, 0, z], [SPEC.seam, Y1, z]], t: span(t, 0.14, 0.5), kind: 'hot', o: 1 - swap },
      { type: 'line', pts: [[R, 0, z], [R, g0, z]], t: sew1, kind: 'hot', o: 1 - swap },
      { type: 'line', pts: [[R, g1, z], [R, Y1, z]], t: sew2, kind: 'hot', o: 1 - swap },
      { type: 'line', pts: [[R + 0.3, g0, z], [R + 0.3, g1, z]], kind: 'open', o: span(t, 0.31, 0.35) * (1 - swap) },
      { type: 'label', p: [R, (g0 + g1) / 2, z], label: 'opening8', o: span(t, 0.31, 0.35) * (1 - swap), dx: 12, hot: true },
      { type: 'line', pts: [[xb + 0.1, Y1, OPEN[0]], [xb + 0.1, Y1, OPEN[1]]], kind: 'open', o },
      { type: 'label', p: [xb, Y1, (OPEN[0] + OPEN[1]) / 2], label: 'opening8', o, dx: 13, hot: true },
    ],
    focus: { pts: [[xb - 22, Y1 + d / 2, 0], [xb, Y1 - d / 2, 0], [xb, Y1, 30], [xb + 3, Y1, 0]], k: 0.4 * o },
  };
}

/* ---------- Step 6: straps on, outer into the lining, sew the top ---------- */

function joinState(t) {
  const strapFold = span(t, 0.22, 0.42);
  const outer = shell({ key: 'outer', xa: 0, xb: W, ya: 0, yb: D, h: HB, fill: FILL.duck, inner: FILL.duckBack, vee: 'bottom' }).walls;
  const sq = lerp(1, 0.7, strapFold);
  const back = strap({ id: 'strap-back', xMid: W / 2, y0: -0.05, zRim: HB, front: false, fold: strapFold, squash: sq });
  const front = strap({ id: 'strap-front', xMid: W / 2, y0: D + 0.05, zRim: HB, front: true, fold: strapFold, squash: sq });
  const lining = fadeAll(shell({
    key: 'lining', xa: -LINE, xb: W + LINE, ya: -LINE, yb: D + LINE, z0: lerp(46, 0, span(t, 0.45, 0.72)), h: HB,
    fill: FILL.satinBack, inner: FILL.satin, opening: OPEN, vee: 'bottom', top: { at: SPEC.seam, t: span(t, 0.76, 1), kind: 'hot' },
  }).walls, span(t, 0.4, 0.48));
  return [...inside(lining), back, ...inside(outer), ...outside(outer), front, ...outside(lining)];
}

function stepJoin(t) {
  const o6 = span(t, 0.06, 0.12) * (1 - span(t, 0.2, 0.24));
  return {
    pieces: fadeAll(joinState(t), span(t, 0, 0.08)),
    over: [
      { type: 'dim', a: [W / 2, D, HB + 2], b: [W / 2 + SPEC.strap.fromCenter, D, HB + 2], label: 'cm6', o: o6, hot: true },
      { type: 'label', p: [W / 2, D, HB + 30], label: 'endsLevel', o: o6 },
      { type: 'label', p: [W, D / 2, HB - 0.5], label: 'seam05', o: span(t, 0.8, 0.88), dx: 12, hot: true },
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
    key: 'outer', xa: 0, xb: W, ya: 0, yb: D, h: H, fill: FILL.duck, inner: FILL.duckBack, vee: 'bottom',
    top: stitch > 0 ? { at: SPEC.topstitch, t: stitch, kind: 'hotstitch' } : null,
  }).walls;
  const ext = (H - LINE) * (1 - push);
  const tube = fadeAll(shell({
    key: 'tube', xa: LINE, xb: W - LINE, ya: LINE, yb: D - LINE, z0: H, h: Math.max(ext, 0.01),
    fill: FILL.satin, inner: FILL.satinBack, lid: true, vee: 'top',
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
      { type: 'label', p: [W + 13, D / 2 + 5, 16], label: 'turnThrough', o: span(t, 0.06, 0.12) * (1 - turned), dy: -4 },
      { type: 'line', pts: [[W - LINE + 0.1, D / 2, gapLow], [W - LINE + 0.1, D / 2, gapTop]], t: close, kind: 'hot', o: turned * (1 - push) },
      { type: 'label', p: [W - LINE, D / 2, (gapLow + gapTop) / 2], label: 'stitchClosed', o: span(t, 0.38, 0.44) * (1 - span(t, 0.54, 0.58)), dx: 12, hot: true },
      { type: 'arrow', pts: [[W / 2, D / 2, H + 40], [W / 2, D / 2, H + 26]], o: span(t, 0.54, 0.6) * (1 - span(t, 0.72, 0.78)) },
      { type: 'label', p: [W / 2, D / 2, H + 44], label: 'pushLining', o: span(t, 0.54, 0.6) * (1 - span(t, 0.72, 0.78)) },
      { type: 'label', p: [W, D / 2, H - SPEC.topstitch], label: 'topstitch1', o: span(t, 0.82, 0.9), dx: 12, hot: true },
    ],
    focus: t < 0.3
      ? { pts: [[W, 0, 0], [W, D, 0], [W, D / 2, 18], [W + 13, D / 2 + 5, 16]], k: span(t, 0.02, 0.1) * (1 - span(t, 0.2, 0.28)) }
      : { pts: [[0, D, H], [W, 0, H + ext + 2], [W, D, gapLow - 6]], k: 0.7 * span(t, 0.36, 0.42) * (1 - span(t, 0.5, 0.56)) },
  };
}

/* ---------- Steps, camera, rendering ---------- */

/*
  Steps — how each one is built, without words. Every text (title, caption,
  written instruction, the chips drawn in the scenes, the legend) lives in
  tote.<lang>.js, index-aligned with this array; tote.text.js checks that.
  `scene` draws the step over t = 0…1, `duration` is its animation in seconds,
  `stitch` — the machine stitch (a key of `stitches` in the texts), `sew` — when
  and on which fabric the seam is sewn. `uses` — catalog products handy in that
  step (ids from src/data/products.js, shown as labelled affiliate links under
  the caption).
*/
export const STEPS = [
  {}, // 0: the finished bag (texts: tote.<lang>.js)
  {
    scene: stepCut, duration: 2.6,
    uses: ['cotton-duck-cloth', 'olfa-rotary-cutter', 'olfa-cutting-mat', 'quilting-rulers-set', 'sewline-air-erasable-pen'],
  },
  {
    scene: stepStrap, duration: 7, stitch: 'straight', sew: [[0.82, 1, 'duck']], pad: 0.22,
    uses: ['rowenta-travel-iron', 'janome-hd2200', 'hagbou-thread-set'],
  },
  {
    scene: stepBottom, duration: 9.5, stitch: 'straight', pad: 0.22,
    sew: [[0.47, 0.57, 'duck'], [0.79, 0.89, 'duck']],
    uses: ['rowenta-travel-iron', 'quilting-rulers-set', 'sewline-air-erasable-pen', 'janome-hd2200'],
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
  {
    scene: stepLining, duration: 6.5, stitch: 'straight', sew: [[0.14, 0.5, 'satin']],
    uses: ['soraco-sewing-clips', 'janome-hd2200'],
  },
  {
    scene: stepJoin, duration: 6, stitch: 'straight', sew: [[0.76, 1, 'satin']],
    uses: ['soraco-sewing-clips', 'janome-hd2200'],
  },
  {
    scene: stepFinish, duration: 7, stitch: 'straight', sew: [[0.4, 0.52, 'satin'], [0.8, 1, 'duck']],
    uses: ['rowenta-travel-iron', 'janome-hd2200'],
  },
];

/**
  The static cutting diagram (src/lib/anatomy/cut-diagram.js; an <img> on the project page):
  the end of this step + these lines of `legend` from the texts (outer, lining, straps, seams).
*/
export const CUT = { step: 1, legend: [0, 1, 2, 4] };

/** Every chip key the drawing uses — each language must have them all (tote.text.js; see labelKeys in kit.js). */
export const LABEL_KEYS = labelKeys(STEPS);

/** Step k at time t (for step 0, t is how far apart it is) → { body, viewBox }. L = the texts (tote.text.js). */
export const renderStep = makeRenderer({
  id: ID,
  steps: STEPS,
  anatomy,
  pins,
  // the shadow under the bag: standing (0, 8, 9), lying flat after the tuck (5), turned out (6, 7)
  floorAt: (k) => (k === 0 || k >= 8 ? [W / 2, D / 2, 0] : k >= 6 ? [22.5, Y1, 0] : k === 5 ? [22.5, Y1 / 2, 0] : null),
  shadow: [W * 0.62, D * 0.9],
  fabrics: { duck: '#c08a87', satin: '#e6d0ae' },
});

/** Fabric patterns, in each piece's own cm coordinates. */
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
  <linearGradient id="${ID}-satin" x1="0" y1="0" x2="1" y2="0.35">
    <stop offset="0" stop-color="#e2cba8"/><stop offset=".38" stop-color="#f6e9d4"/>
    <stop offset=".55" stop-color="#e6d0ae"/><stop offset=".8" stop-color="#f2e2c7"/><stop offset="1" stop-color="#dcc29c"/>
  </linearGradient>
  <linearGradient id="${ID}-satinBack" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ddc8a8"/><stop offset="1" stop-color="#e6d5ba"/>
  </linearGradient>
  <radialGradient id="${ID}-floor">
    <stop offset="0" stop-color="#785f46" stop-opacity=".28"/><stop offset="1" stop-color="#785f46" stop-opacity="0"/>
  </radialGradient>
</defs>`;

/*
  Tiny isometric engine for fabric figures ("anatomy" of a sewn item).

  Every part is a FLAT piece: a polygon in its own 2D coordinates (cm), placed
  in 3D by an origin O and two axes U, V. An orthographic (isometric) view maps
  a plane affinely, so each piece renders as ONE <g transform="matrix(...)">:
  its fabric pattern, seams and stitches ride along exactly, at any angle.

  World axes (cm): x → right-down on screen, y → left-down, z → up.
  The viewer looks from (+x, +y, +z). Pure functions, no DOM — the same code
  renders the first frame at build time (Astro) and animates in the browser.
*/

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);

export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const norm = (a) => scale(a, 1 / Math.hypot(a[0], a[1], a[2]));
export const lerp = (a, b, t) => a + (b - a) * t;
export const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** World point (cm) → screen point (cm-sized units; the SVG viewBox scales them). */
export const project = (p) => [(p[0] - p[1]) * C, (p[0] + p[1]) * S - p[2]];

const VIEW = norm([1, 1, 1]);
const LIGHT = norm([0.5, 1, 1.6]); // upper left: tops light, left faces mid, right faces darker

/** Rotate vector v about unit axis k by angle a (Rodrigues). */
export function rotate(v, k, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return add(add(scale(v, c), scale(cross(k, v), s)), scale(k, dot(k, v) * (1 - c)));
}

/** Rotate a piece rigidly about the line through `at` along unit axis `k`. */
export function turn(piece, at, k, a) {
  return {
    ...piece,
    O: add(at, rotate(sub(piece.O, at), k, a)),
    U: rotate(piece.U, k, a),
    V: rotate(piece.V, k, a),
    out: piece.out && rotate(piece.out, k, a),
  };
}

export const move = (piece, d) => ({ ...piece, O: add(piece.O, d) });

/** Point on a piece: local (u, v) cm → world. */
export const at = (piece, u, v) => add(add(piece.O, scale(piece.U, u)), scale(piece.V, v));

/** The piece's outward normal (`out` if given, else U × V). */
const outward = (p) => (p.out ? p.out : norm(cross(p.U, p.V)));

/** Is the piece's outside turned toward the viewer? */
export const facing = (p) => dot(outward(p), VIEW) >= 0;

/** The first fraction t (0..1) of a polyline, by length (2D or 3D points). */
export function partial(pts, t = 1) {
  if (t >= 1) return pts;
  if (t <= 0) return [pts[0], pts[0]];
  const segs = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(...pts[i].map((v, j) => v - pts[i - 1][j]));
    segs.push(l);
    total += l;
  }
  let left = total * t;
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (left >= segs[i - 1]) { out.push(pts[i]); left -= segs[i - 1]; continue; }
    const k = left / segs[i - 1];
    out.push(pts[i - 1].map((v, j) => v + (pts[i][j] - v) * k));
    break;
  }
  return out;
}

/** Polygon points → SVG path. */
export const pathOf = (pts, close = true) =>
  pts.map(([u, v], i) => `${i ? 'L' : 'M'}${f(u)} ${f(v)}`).join('') + (close ? 'Z' : '');

const f = (n) => +n.toFixed(3);

/** Screen-space bounds of pieces (for the viewBox). */
export function bounds(pieces, pad = 0) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of pieces) {
    for (const [u, v] of p.pts) {
      const [x, y] = project(at(p, u, v));
      x0 = Math.min(x0, x); y0 = Math.min(y0, y);
      x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
  }
  return [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad];
}

/*
  One piece → SVG. A piece:
    pts       polygon in local cm (u along U, v along V)
    O, U, V   placement in the world (U, V unit vectors = 1 cm per unit)
    out       optional outward normal (which side is the fabric's "outside")
    fill      outside fill · inner: inside fill (wrong side / lining)
    lines     [{ d, kind: 'stitch' | 'seam' | 'fold' | 'hot' }] in local cm
    opacity   optional (fades)
*/
export function pieceSvg(p) {
  const out = outward(p);
  const front = dot(out, VIEW) >= 0;
  const n = front ? out : scale(out, -1);
  const lit = Math.max(0, dot(n, LIGHT));
  const shade = (1 - lit) * 0.34;
  const [a, b] = project(p.U);
  const [c, d] = project(p.V);
  const [e, g] = project(p.O);
  const shape = pathOf(p.pts);
  const fill = front ? p.fill : (p.inner ?? p.fill);
  const lines = (p.lines ?? [])
    .filter((l) => !l.side || (l.side === 'out') === front)
    .map((l) => `<path class="ln ln--${l.kind ?? 'stitch'}" d="${l.d ?? pathOf(partial(l.pts, l.t), false)}"/>`)
    .join('');
  const op = p.opacity === undefined || p.opacity >= 0.999 ? '' : ` opacity="${f(p.opacity)}"`;
  return (
    `<g transform="matrix(${f(a)} ${f(b)} ${f(c)} ${f(d)} ${f(e)} ${f(g)})"${op}>` +
    `<path d="${shape}" fill="${fill}"/>` +
    `<path d="${shape}" fill="#3b2a1e" fill-opacity="${f(shade)}"/>` +
    lines +
    `<path class="ln ln--edge" d="${shape}"/>` +
    `</g>`
  );
}

/*
  Overlays — drawn flat on the screen, above the pieces, sized from the camera
  (u = 1% of the view width) so labels read the same at every zoom:
    { type: 'line',  pts: [world…], t, kind }       a seam/stitch being sewn
    { type: 'dim',   a, b, text, side }             dimension line with end ticks
    { type: 'label', p, text, hot, dx, dy }         a chip
    { type: 'arrow', pts: [world…], t }             motion hint
  Every overlay takes an optional `o` (opacity).
*/
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function chip(x, y, text, u, hot) {
  const fs = 3.5 * u;
  const w = text.length * fs * 0.56 + 2.4 * u;
  const h = fs * 1.55;
  return (
    `<g class="chip${hot ? ' chip--hot' : ''}" transform="translate(${f(x)} ${f(y)})">` +
    `<rect x="${f(-w / 2)}" y="${f(-h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(h / 2)}"/>` +
    `<text y="${f(fs * 0.36)}" font-size="${f(fs)}">${esc(text)}</text></g>`
  );
}

export function overlaySvg(o, cam) {
  const u = cam[2] / 100;
  const op = o.o === undefined ? 1 : o.o;
  if (op <= 0.001) return '';
  const wrap = (s) => (op >= 0.999 ? s : `<g opacity="${f(op)}">${s}</g>`);
  if (o.type === 'line') {
    const pts = partial(o.pts, o.t).map(project);
    return wrap(`<path class="ln ln--${o.kind ?? 'hot'}" d="${pathOf(pts, false)}"/>`);
  }
  if (o.type === 'label') {
    const [x, y] = project(o.p);
    return wrap(chip(x + (o.dx ?? 0) * u, y + (o.dy ?? 0) * u, o.text, u, o.hot));
  }
  if (o.type === 'dim') {
    const [ax, ay] = project(o.a), [bx, by] = project(o.b);
    const l = Math.hypot(bx - ax, by - ay) || 1;
    const nx = -(by - ay) / l, ny = (bx - ax) / l, k = 1.3 * u;
    const tick = (x, y) => `M${f(x - nx * k)} ${f(y - ny * k)}L${f(x + nx * k)} ${f(y + ny * k)}`;
    return wrap(
      `<path class="ln ln--dim" d="M${f(ax)} ${f(ay)}L${f(bx)} ${f(by)}${tick(ax, ay)}${tick(bx, by)}"/>` +
      chip((ax + bx) / 2, (ay + by) / 2, o.text, u, o.hot)
    );
  }
  if (o.type === 'arrow') {
    const pts = partial(o.pts, o.t ?? 1).map(project);
    if (pts.length < 2) return '';
    const [px, py] = pts[pts.length - 2], [qx, qy] = pts[pts.length - 1];
    const l = Math.hypot(qx - px, qy - py) || 1;
    const dx = (qx - px) / l, dy = (qy - py) / l, s = 2.2 * u;
    const head = `M${f(qx - dx * s - dy * s * 0.6)} ${f(qy - dy * s + dx * s * 0.6)}L${f(qx)} ${f(qy)}L${f(qx - dx * s + dy * s * 0.6)} ${f(qy - dy * s - dx * s * 0.6)}`;
    return wrap(`<path class="ln ln--arrow" d="${pathOf(pts, false)}${head}"/>`);
  }
  return '';
}

/** World points an overlay needs on screen (for the camera). */
export const overlayPoints = (o) =>
  o.type === 'line' || o.type === 'arrow' ? o.pts : o.type === 'dim' ? [o.a, o.b] : o.type === 'label' ? [o.p] : [];

/** Screen bounds of world points. */
export function pointBounds(points) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of points) {
    const [x, y] = project(p);
    x0 = Math.min(x0, x); y0 = Math.min(y0, y);
    x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  return [x0, y0, x1 - x0, y1 - y0];
}

/** A centreline (local 2D points) → band polygon of the given width. */
export function band(center, width) {
  const h = width / 2;
  const left = [], right = [];
  for (let i = 0; i < center.length; i++) {
    const p = center[i];
    const q = center[Math.min(i + 1, center.length - 1)];
    const o = center[Math.max(i - 1, 0)];
    let tx = q[0] - o[0], ty = q[1] - o[1];
    const l = Math.hypot(tx, ty) || 1;
    tx /= l; ty /= l;
    left.push([p[0] - ty * h, p[1] + tx * h]);
    right.push([p[0] + ty * h, p[1] - tx * h]);
  }
  return { left, right, pts: [...left, ...right.reverse()] };
}

/** Offset a centreline sideways by d (positive = left of travel). */
export function offset(center, d) {
  return center.map((p, i) => {
    const q = center[Math.min(i + 1, center.length - 1)];
    const o = center[Math.max(i - 1, 0)];
    let tx = q[0] - o[0], ty = q[1] - o[1];
    const l = Math.hypot(tx, ty) || 1;
    return [p[0] - (ty / l) * d, p[1] + (tx / l) * d];
  });
}

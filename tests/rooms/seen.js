/*
  What the eye sees at a point of a drawn svg (the house): a small rasterizer for the shapes the room
  painters print — polygon, line, ellipse (turned by rotate()), circle, rect (rounded), path (M L H V
  Q C A Z, relative too), in groups moved by translate() and scale() — painted in document order onto a
  grid, so the last shape over a point is the one seen there. No DOM at build time, no packages.
  NOT a test file (no .test.js in its name): the test glob of package.json must not pick it up.

  What counts as seen: a filled shape by its fill (its outline in its own colour is cosmetic), a
  shape without fill by its stroke (lines, threads, rings). Translucent things are seen through: the
  blurred shadows and floor light (filter), the window glow, anything under 50 % opacity.
*/

const attr = (tag, name) => new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
const nums = (s) => (s.match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? []).map(Number);

/** Squared distance from p to the segment ab. */
function segment2([px, py], [ax, ay], [bx, by]) {
  const [dx, dy] = [bx - ax, by - ay];
  const len = dx * dx + dy * dy;
  const t = len ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len)) : 0;
  return (ax + t * dx - px) ** 2 + (ay + t * dy - py) ** 2;
}

/** Is the point inside the polygon (even-odd: any polygon the painters print)? */
function inPolygon(poly, [x, y]) {
  let odd = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [[xi, yi], [xj, yj]] = [poly[i], poly[j]];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) odd = !odd;
  }
  return odd;
}

/** Points along an arc from p to q (svg's endpoint form, spec F.6.5), q last. */
function arc([x1, y1], rx, ry, turn, large, sweep, [x2, y2]) {
  if (!rx || !ry) return [[x2, y2]];
  const [c, s] = [Math.cos(turn), Math.sin(turn)];
  const [dx, dy] = [(x1 - x2) / 2, (y1 - y2) / 2];
  const [x1p, y1p] = [c * dx + s * dy, -s * dx + c * dy];
  [rx, ry] = [Math.abs(rx), Math.abs(ry)];
  const grow = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (grow > 1) [rx, ry] = [rx * Math.sqrt(grow), ry * Math.sqrt(grow)];
  const k = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0,
    (rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p) / (rx * rx * y1p * y1p + ry * ry * x1p * x1p)));
  const [cxp, cyp] = [(k * rx * y1p) / ry, (-k * ry * x1p) / rx];
  const [cx, cy] = [c * cxp - s * cyp + (x1 + x2) / 2, s * cxp + c * cyp + (y1 + y2) / 2];
  const angle = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && dt > 0) dt -= 2 * Math.PI;
  if (sweep && dt < 0) dt += 2 * Math.PI;
  return Array.from({ length: 24 }, (_, i) => {
    const t = t1 + (dt * (i + 1)) / 24;
    const [ex, ey] = [rx * Math.cos(t), ry * Math.sin(t)];
    return [cx + ex * c - ey * s, cy + ex * s + ey * c];
  });
}

/** The subpaths of a path's `d`, flattened to points: [{ pts, closed }]. */
export function subpaths(d) {
  const tokens = d.match(/[MLHVQCAZ]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? [];
  const out = [];
  let [i, cmd, pos, start, sub] = [0, '', [0, 0], [0, 0], null];
  const next = () => Number(tokens[i++]);
  const curve = (n, f) => { for (let k = 1; k <= n; k++) sub.pts.push(f(k / n)); };
  while (i < tokens.length) {
    if (/[a-z]/i.test(tokens[i])) cmd = tokens[i++];
    const rel = cmd !== cmd.toUpperCase();
    const at = (x, y) => (rel ? [pos[0] + x, pos[1] + y] : [x, y]);
    switch (cmd.toUpperCase()) {
      case 'M':
        pos = at(next(), next());
        start = pos;
        sub = { pts: [pos], closed: false };
        out.push(sub);
        cmd = rel ? 'l' : 'L'; // more pairs after a moveto are linetos
        break;
      case 'L': pos = at(next(), next()); sub.pts.push(pos); break;
      case 'H': pos = [rel ? pos[0] + next() : next(), pos[1]]; sub.pts.push(pos); break;
      case 'V': pos = [pos[0], rel ? pos[1] + next() : next()]; sub.pts.push(pos); break;
      case 'Q': {
        const [p0, q, p] = [pos, at(next(), next()), at(next(), next())];
        curve(12, (t) => [0, 1].map((a) => (1 - t) ** 2 * p0[a] + 2 * (1 - t) * t * q[a] + t * t * p[a]));
        pos = p;
        break;
      }
      case 'C': {
        const [p0, q1, q2, p] = [pos, at(next(), next()), at(next(), next()), at(next(), next())];
        curve(16, (t) => [0, 1].map((a) => (1 - t) ** 3 * p0[a] + 3 * (1 - t) ** 2 * t * q1[a] + 3 * (1 - t) * t * t * q2[a] + t ** 3 * p[a]));
        pos = p;
        break;
      }
      case 'A': {
        const [rx, ry, turn, large, sweep] = [next(), next(), next(), next(), next()];
        const p = at(next(), next());
        sub.pts.push(...arc(pos, rx, ry, (turn * Math.PI) / 180, large, sweep, p));
        pos = p;
        break;
      }
      case 'Z':
        sub.closed = true;
        pos = start;
        cmd = '';
        break;
      default: throw new Error(`seen.js: path command "${cmd}" in "${d}"`);
    }
  }
  return out;
}

/**
  One printed shape as something that covers points: { box: [x0, y0, x1, y1], covers([x, y]) }, in the
  coordinates of the svg; `move` = [k, tx, ty], the groups' scale and translation around it. null for
  what paints nothing (text, a transparent shape).
*/
export function shapeOf(tag, [k, tx, ty] = [1, 0, 0]) {
  const name = /^<(\w+)/.exec(tag)[1];
  const fill = attr(tag, 'fill');
  const stroke = attr(tag, 'stroke');
  const filled = fill !== 'none' && fill !== 'transparent';
  const half = (fill === undefined || fill === 'none') && stroke && stroke !== 'none' ? Number(attr(tag, 'stroke-width') ?? 1) / 2 : 0;
  if (!filled && !half) return null;
  const local = ([x, y]) => [(x - tx) / k, (y - ty) / k];
  const world = ([x0, y0, x1, y1]) => [x0 * k + tx, y0 * k + ty, x1 * k + tx, y1 * k + ty];
  const boxOf = (pts, pad) => {
    const xs = pts.map((q) => q[0]);
    const ys = pts.map((q) => q[1]);
    return world([Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) + pad, Math.max(...ys) + pad]);
  };
  /** filled outlines and stroked lines, both in local coordinates */
  const of = (outlines, lines) => ({
    box: boxOf([...outlines, ...lines].flat(), half),
    covers(pt) {
      const q = local(pt);
      if (filled && outlines.some((poly) => inPolygon(poly, q))) return true;
      return half > 0 && lines.some((line) => line.some((a, i) => i > 0 && segment2(q, line[i - 1], a) <= half * half));
    },
  });

  if (name === 'polygon') {
    const v = nums(attr(tag, 'points'));
    const poly = Array.from({ length: v.length / 2 }, (_, i) => [v[2 * i], v[2 * i + 1]]);
    return of([poly], [[...poly, poly[0]]]);
  }
  if (name === 'line') return of([], [[[+attr(tag, 'x1'), +attr(tag, 'y1')], [+attr(tag, 'x2'), +attr(tag, 'y2')]]]);
  if (name === 'path') {
    const subs = subpaths(attr(tag, 'd'));
    return of(subs.map((s) => s.pts), subs.map((s) => (s.closed ? [...s.pts, s.pts[0]] : s.pts)));
  }
  if (name === 'ellipse' || name === 'circle') {
    const [cx, cy] = [+attr(tag, 'cx'), +attr(tag, 'cy')];
    const [rx, ry] = name === 'circle' ? [+attr(tag, 'r'), +attr(tag, 'r')] : [+attr(tag, 'rx'), +attr(tag, 'ry')];
    const turn = (Number(/rotate\(([^ )]*)/.exec(attr(tag, 'transform') ?? '')?.[1] ?? 0) * Math.PI) / 180;
    const big = Math.max(rx, ry) + half;
    return {
      box: world([cx - big, cy - big, cx + big, cy + big]),
      covers(pt) {
        const [dx, dy] = [local(pt)[0] - cx, local(pt)[1] - cy];
        const [u, v] = [dx * Math.cos(turn) + dy * Math.sin(turn), -dx * Math.sin(turn) + dy * Math.cos(turn)];
        const r = (a, b) => (u / a) ** 2 + (v / b) ** 2;
        if (filled) return r(rx, ry) <= 1;
        return r(rx + half, ry + half) <= 1 && (rx <= half || ry <= half || r(rx - half, ry - half) >= 1);
      },
    };
  }
  if (name === 'rect') {
    const [x, y, w, h] = ['x', 'y', 'width', 'height'].map((n) => Number(attr(tag, n) ?? 0));
    const r = Math.min(Number(attr(tag, 'rx') ?? 0), w / 2, h / 2);
    return {
      box: world([x, y, x + w, y + h]),
      covers(pt) {
        const [px, py] = local(pt);
        if (px < x || px > x + w || py < y || py > y + h) return false;
        const [qx, qy] = [Math.min(Math.max(px, x + r), x + w - r), Math.min(Math.max(py, y + r), y + h - r)];
        return (px - qx) ** 2 + (py - qy) ** 2 <= r * r;
      },
    };
  }
  return null;
}

/**
  The painted shapes of an svg, in document order: { tag, shape, at } — `at` holds the class and the
  data-room of every <g> and <a> around the shape (the innermost last). What is seen through (see the
  top of the file) and what is inside <defs> is left out.
*/
export function shapesOf(svg) {
  const out = [];
  const stack = [{ move: [1, 0, 0], at: [], clear: false }];
  let defs = 0;
  for (const [tag, close, name] of svg.matchAll(/<(\/?)(\w+)[^>]*>/g)) {
    if (name === 'defs') { defs += close ? -1 : tag.endsWith('/>') ? 0 : 1; continue; }
    if (defs) continue;
    const top = stack[stack.length - 1];
    if (name === 'g' || name === 'a') {
      if (close) { stack.pop(); continue; }
      let [k, tx, ty] = top.move;
      for (const [, op, args] of (attr(tag, 'transform') ?? '').matchAll(/(translate|scale)\(([^)]*)\)/g)) {
        const [a, b = op === 'scale' ? a : 0] = nums(args);
        // a point of this group: first its own transform (right to left), then the one around it
        if (op === 'translate') [tx, ty] = [tx + k * a, ty + k * b];
        else k *= a;
      }
      const opacity = Number(attr(tag, 'opacity') ?? 1);
      stack.push({ move: [k, tx, ty], at: [...top.at, { class: attr(tag, 'class'), room: attr(tag, 'data-room') }], clear: top.clear || opacity < 0.5 });
      continue;
    }
    if (close || top.clear) continue;
    if (/\sfilter="/.test(tag) || /-glow\)"/.test(tag) || Number(attr(tag, 'opacity') ?? 1) < 0.5) continue;
    const shape = shapeOf(tag, top.move);
    if (shape) out.push({ tag, shape, at: top.at });
  }
  return out;
}

/**
  A grid over the frame [x, y, w, h], a point every `step`, each holding the value of the last shape
  painted over it (painter's order). paint(shape, value) paints one; get(c, r) reads a cell; pt(c, r)
  is its point; cell([x, y]) the nearest cell.
*/
export function grid([vx, vy, vw, vh], step) {
  const cols = Math.ceil(vw / step) + 1;
  const rows = Math.ceil(vh / step) + 1;
  const cells = new Array(cols * rows).fill(null);
  const clampC = (c) => Math.max(0, Math.min(cols - 1, c));
  const clampR = (r) => Math.max(0, Math.min(rows - 1, r));
  return {
    cols, rows, step,
    pt: (c, r) => [vx + c * step, vy + r * step],
    get: (c, r) => cells[r * cols + c],
    cell: ([x, y]) => [clampC(Math.round((x - vx) / step)), clampR(Math.round((y - vy) / step))],
    paint({ box: [x0, y0, x1, y1], covers }, value) {
      for (let r = clampR(Math.floor((y0 - vy) / step)); r <= clampR(Math.ceil((y1 - vy) / step)); r++) {
        for (let c = clampC(Math.floor((x0 - vx) / step)); c <= clampC(Math.ceil((x1 - vx) / step)); c++) {
          if (covers([vx + c * step, vy + r * step])) cells[r * cols + c] = value;
        }
      }
    },
  };
}

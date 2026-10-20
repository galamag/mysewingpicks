/*
  Shared kit of the anatomy figures (tote, basket, …): timing helpers, the open
  fabric box (`shell`), the camera, the END VIEW inset, the mini sewing machine,
  the floor shadow and `makeRenderer()`, which turns a model's scenes into
  renderStep(k, t, L). Items keep only their own numbers, scenes and fills in
  src/lib/anatomy/<item>.js; their words live in <item>.<lang>.js.
  Pure functions, no DOM: the same code draws the first frame at build time and
  animates in the browser — so no newest JS APIs here (older iPhones).
*/
import { esc, lerp, overlayPoints, overlaySvg, pieceSvg, pointBounds, bounds, project } from './iso.js';

export const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
/** 0 → 1 while t goes from a to b (eased). */
export const span = (t, a, b) => ease((t - a) / (b - a));
export const rect = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
/** Is the piece's `out` side turned toward the viewer (+x, +y, +z)? */
export const facing = (p) => p.out[0] + p.out[1] + p.out[2] >= 0;
export const inside = (ps) => ps.filter((p) => !facing(p));
export const outside = (ps) => ps.filter(facing);
export const fadeAll = (ps, o) => (o >= 0.999 ? ps : o <= 0.001 ? [] : ps.map((p) => ({ ...p, opacity: (p.opacity ?? 1) * o })));

/** Rotate a 2D point (y, z) about c by angle a (cross-sections). */
export const rot2 = ([y, z], [cy, cz], a) => {
  const dy = y - cy, dz = z - cz, c = Math.cos(a), s = Math.sin(a);
  return [cy + dy * c - dz * s, cz + dy * s + dz * c];
};

/*
  An open box of fabric (outer or lining): walls on [xa,xb]×[ya,yb], height h
  from z0. `fill` is the side facing out, `inner` the side facing in — so an
  inside-out piece simply swaps them. Options:
    vee     side seams split into a V where they caught a tucked bottom
            ('bottom'; 'top' for a lining pulled out bottom-up)
    opening gap in the right side seam ([from, to] cm above z0)
    top     a stitch line round the walls { at: cm below the top, t, kind }
    lid     close the top (a lining pulled out, its bottom up)
*/
export function shell({ key, xa, xb, ya, yb, z0 = 0, h, fill, inner, opening, top, seams = true, lid, vee, veeHot }) {
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
  const seam = (pts, hot) => ({ pts, kind: hot ? 'hot' : 'seam', side: 'out' });
  const side = (gap) => {
    if (!seams || d < 0.3) return [];
    const u = d / 2, k = Math.min(d / 2, h);
    let v0 = 0, v1 = h;
    const lines = [];
    if (vee === 'bottom') { v0 = k; lines.push(seam([[0, 0], [u, k]], veeHot), seam([[d, 0], [u, k]], veeHot)); }
    if (vee === 'top') { v1 = h - k; lines.push(seam([[0, h], [u, v1]]), seam([[d, h], [u, v1]])); }
    if (gap) lines.push(seam([[u, v0], [u, gap[0]]]), seam([[u, gap[1]], [u, v1]]));
    else lines.push(seam([[u, v0], [u, v1]]));
    return lines;
  };
  const wall = (id, O, U, out, len, lines) =>
    ({ id: `${key}-${id}`, pts: rect(len, h), O, U, V: [0, 0, 1], out, lines, ...look });
  const walls = [
    { id: `${key}-bottom`, pts: rect(w, d), O: [xa, ya, z0], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, -1], ...look },
    wall('back', [xa, ya, z0], [1, 0, 0], [0, -1, 0], w, ring(2, w, true)),
    wall('left', [xa, ya, z0], [0, 1, 0], [-1, 0, 0], d, [...side(null), ...ring(3, d, false)]),
    wall('right', [xb, ya, z0], [0, 1, 0], [1, 0, 0], d, [...side(opening), ...ring(1, d, true)]),
    wall('front', [xa, yb, z0], [1, 0, 0], [0, 1, 0], w, ring(0, w, false)),
  ];
  if (lid) walls.push({ id: `${key}-lid`, pts: rect(w, d), O: [xa, ya, z0 + h], U: [1, 0, 0], V: [0, 1, 0], out: [0, 0, 1], ...look });
  return { walls };
}

/* ---------- Camera ---------- */

const union = (a, b) => {
  const x0 = Math.min(a[0], b[0]), y0 = Math.min(a[1], b[1]);
  return [x0, y0, Math.max(a[0] + a[2], b[0] + b[2]) - x0, Math.max(a[1] + a[3], b[1] + b[3]) - y0];
};

/** Grow a box to the figure's aspect ratio, centred, with padding. */
function fit(b, padK, aspect) {
  const pad = Math.max(b[2], b[3]) * padK;
  let w = b[2] + 2 * pad, h = b[3] + 2 * pad;
  if (w / h < aspect) w = h * aspect; else h = w / aspect;
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

/* ---------- Corner widgets: END VIEW inset, sewing machine; the floor shadow ---------- */

/** A cross-section ("end view"), drawn flat in the bottom-left corner. */
function insetSvg({ segs, range }, cam, title, clipId) {
  const u = cam[2] / 100;
  const bw = 46 * u, bh = 24 * u;
  const x0 = cam[0] + 4 * u, y0 = cam[1] + cam[3] - bh - 4 * u;
  const k = (bw - 10 * u) / (range[1] - range[0]); // the whole width across (layers drawn thicker than life)
  const cy = y0 + bh * 0.8;
  const P = ([y, z]) => `${(x0 + 5 * u + (y - range[0]) * k).toFixed(2)} ${(cy - z * k).toFixed(2)}`;
  const lines = segs.map((s) => `<path class="inset__seg" d="M${P(s.a)}L${P(s.b)}" stroke-width="${(1.1 * u).toFixed(2)}"/>`).join('');
  const box = `x="${x0.toFixed(2)}" y="${y0.toFixed(2)}" width="${bw.toFixed(2)}" height="${bh.toFixed(2)}" rx="${(2 * u).toFixed(2)}"`;
  return (
    `<g class="inset"><clipPath id="${clipId}"><rect ${box}/></clipPath><rect ${box}/>` +
    `<text x="${(x0 + 2.4 * u).toFixed(2)}" y="${(y0 + 4.2 * u).toFixed(2)}" font-size="${(2.6 * u).toFixed(2)}">${esc(title)}</text>` +
    `<g clip-path="url(#${clipId})">${lines}</g></g>`
  );
}

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
  Generic shape — no brand. `color` — the fabric under the foot.
*/
function machineSvg(m, cam, stitchName, color) {
  const u = cam[2] / 100;
  const w = 38 * u;
  const x0 = cam[0] + cam[2] - w - 4 * u, y0 = cam[1] + 4 * u;
  const X = (a) => (x0 + a * u).toFixed(2), Y = (b) => (y0 + b * u).toFixed(2), L = (a) => (a * u).toFixed(2);
  const turns = 16;
  const dip = (1.7 * (1 - Math.cos(m.s * Math.PI * 2 * turns))) / 2;
  const feed = (m.s * turns * 2) % 2;
  const nx = 13;
  return (
    `<g class="machine" opacity="${m.o.toFixed(3)}">` +
    `<rect class="machine__box" x="${X(0)}" y="${Y(0)}" width="${L(38)}" height="${L(25)}" rx="${L(2)}"/>` +
    `<text x="${X(2.4)}" y="${Y(4.2)}" font-size="${L(2.6)}">${esc(stitchName.toUpperCase())}</text>` +
    `<rect class="machine__bed" x="${X(3)}" y="${Y(19)}" width="${L(32)}" height="${L(2.6)}" rx="${L(1)}"/>` +
    `<rect class="machine__body" x="${X(27)}" y="${Y(8)}" width="${L(5)}" height="${L(11.5)}"/>` +
    `<rect class="machine__body" x="${X(10.5)}" y="${Y(6)}" width="${L(23)}" height="${L(4.6)}" rx="${L(2)}"/>` +
    `<rect class="machine__head" x="${X(9.5)}" y="${Y(6)}" width="${L(6.5)}" height="${L(9)}" rx="${L(1.4)}"/>` +
    `<circle class="machine__wheel" cx="${X(33.5)}" cy="${Y(9)}" r="${L(2.4)}"/>` +
    `<rect class="machine__fabric" x="${X(3)}" y="${Y(18.2)}" width="${L(32)}" height="${L(1)}" fill="${color}"/>` +
    `<path class="machine__stitches" d="M${X(3)} ${Y(18.7)}H${X(nx)}" stroke-width="${L(0.45)}" stroke-dasharray="${L(1.2)} ${L(0.8)}" stroke-dashoffset="${L(feed)}"/>` +
    `<path class="machine__bar" d="M${X(nx)} ${Y(15)}V${Y(16.2 + dip)}" stroke-width="${L(0.8)}"/>` +
    `<path class="machine__needle" d="M${X(nx)} ${Y(16.2 + dip)}V${Y(18.5 + dip)}" stroke-width="${L(0.35)}"/>` +
    `<rect class="machine__foot" x="${X(nx - 1.8)}" y="${Y(17.5)}" width="${L(3.6)}" height="${L(0.7)}" rx="${L(0.3)}"/>` +
    `</g>`
  );
}

/** The soft shadow under the item: the fill is an attribute (its gradient id carries the figure's prefix). */
const shadowSvg = (at3, [rx, ry], gradient) => {
  const [x, y] = project(at3);
  return `<ellipse class="floor" fill="url(#${gradient})" cx="${x.toFixed(2)}" cy="${(y + 1).toFixed(2)}" rx="${rx.toFixed(2)}" ry="${ry.toFixed(2)}"/>`;
};

/* ---------- Labels ---------- */

/**
  Every chip key the drawing uses — each language must have them all (<item>.text.js).
  The keys are sampled at t = 0, so every scene's `over` must be a literal list:
  never add a labelled overlay only for some t, or its key would be missed here.
*/
export const labelKeys = (steps) => [...new Set(steps.slice(1).flatMap((s) => s.scene(0).over.map((o) => o.label).filter(Boolean)))];

/* ---------- The renderer ---------- */

/*
  makeRenderer({ id, steps, anatomy, pins, floorAt, shadow, fabrics, aspect }) → renderStep(k, t, L)
    id       the figure's prefix for SVG ids (the slug: 'tote-bag') — the model's DEFS use it too
    steps    the model's STEPS (step 0 = the finished item; 1… have `scene(t)`)
    anatomy  e → { pieces, over } — step 0, together (e = 0) or apart (e = 1)
    pins     e → [{ n, p }] — numbered pins of the legend, shown when apart
    floorAt  k → [x, y, z] where the shadow sits in step k, or null (no shadow)
    shadow   [rx, ry] of the shadow ellipse
    fabrics  fabric name (as in a step's `sew`) → colour under the machine's foot
    aspect   figure width / height, the same for every step (0.8)
    pinsAt   which end of step 0 shows the pins: 1 = taken apart (default), 0 = at rest, i.e. already in the
             first frame (a figure whose rest state is the view the legend explains: the folded bag bottom)
*/
export function makeRenderer({ id, steps, anatomy, pins, floorAt, shadow, fabrics, aspect = 0.8, pinsAt = 1 }) {
  const cams = [];
  const camera = (k) => {
    if (cams[k]) return cams[k];
    if (k === 0) {
      const b1 = fit(union(sceneBounds(anatomy(0)), sceneBounds(anatomy(1))), 0.05, aspect);
      const b0 = fit(sceneBounds(anatomy(0)), 0.07, aspect);
      cams[0] = [b0, b1];
    } else {
      let b = null;
      for (let i = 0; i <= 20; i++) {
        const sb = sceneBounds(steps[k].scene(i / 20));
        if (sb) b = b ? union(b, sb) : sb;
      }
      cams[k] = fit(b, steps[k].pad ?? 0.08, aspect);
    }
    return cams[k];
  };
  const labelOf = (L, key) => {
    const text = L.labels[key];
    if (!text) throw new Error(`${id}: no label "${key}"`);
    return text;
  };
  const floor = (k) => {
    const p = floorAt(k);
    return p ? shadowSvg(p, shadow, `${id}-floor`) : '';
  };

  /** Step k at time t (for step 0, t is how far apart it is). Returns SVG body + viewBox. */
  return function renderStep(k, t, L) {
    if (!L) throw new Error(`renderStep: pass the figure texts (${id})`);
    if (k === 0) {
      const [b0, b1] = camera(0);
      const tt = ease(t);
      const cam = b0.map((v, i) => lerp(v, b1[i], tt));
      const s = anatomy(t);
      const show = pinsAt ? span(t, 0.75, 1) : 1 - span(t, 0, 0.25);
      const u = cam[2] / 100;
      const pinSvg = show
        ? `<g class="pins" opacity="${show.toFixed(3)}">` +
          pins(t).map(({ n, p }) => {
            const [x, y] = project(p);
            return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)})"><circle r="${(3.2 * u).toFixed(2)}"/><text y="${(1.15 * u).toFixed(2)}" font-size="${(3.4 * u).toFixed(2)}">${n}</text></g>`;
          }).join('') + `</g>`
        : '';
      return { body: floor(0) + s.pieces.map(pieceSvg).join('') + pinSvg, viewBox: cam };
    }
    const s = steps[k].scene(t);
    let cam = camera(k);
    if (s.focus && s.focus.k > 0.001) {
      const f = fit(pointBounds(s.focus.pts), 0.3, aspect);
      cam = cam.map((v, i) => lerp(v, f[i], s.focus.k));
    }
    const sewing = sewingAt(steps[k], t);
    return {
      body: floor(k) + s.pieces.map(pieceSvg).join('') + s.over.map((o) => overlaySvg(o.label ? { ...o, text: labelOf(L, o.label) } : o, cam)).join('') +
        (s.inset ? insetSvg(s.inset, cam, L.ui.endView, `${id}-inset-clip`) : '') +
        (sewing ? machineSvg(sewing, cam, L.stitches[steps[k].stitch] ?? '', fabrics[sewing.fabric] ?? '#c08a87') : ''),
      viewBox: cam,
    };
  };
}

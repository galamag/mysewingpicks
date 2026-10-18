/*
  Soft isometric painter for the rooms ("My Setup", the house…): style B from
  the approved sketch — rounded edges, gentle gradients, a blurred shadow and
  warm window light. Pure functions, no DOM — the same code draws the first
  frame at build time (Astro).

  Coordinates are WORLD points (cm) as in the anatomy engine (iso.js): x →
  right-down, y → left-down, z → up; `project()` puts them on the screen.

  `painter(prefix)` returns the drawing methods for ONE svg. Every id it
  creates is `<prefix>-…` (so several rooms can share a page), and gradients are
  made once per colour and kind of face. Draw first, then put `defs()` — the
  inner elements, without the <defs> wrapper — into the svg.
*/
import { project } from '../anatomy/iso.js';

export const PALETTE = {
  floor: '#c99f76', floorSide: '#a9805a', wall: '#f6ecdc', wallTop: '#e9c9a0',
  wood: '#d6a777', woodDark: '#9b7350', metal: '#d8d2ca', dark: '#4a3f35',
  light: '#fffdf8', rose: '#c08a87', roseDeep: '#a86f6c', sage: '#9caf88',
  sageDeep: '#7f9469', gold: '#d9a441', beige: '#f0e6d6', cream: '#f6efe4',
  glass: '#fff6dc', bgFrom: '#fbeedb', bgTo: '#ead2b4',
};

const EDGE = 0.9; // outline of a face: its own colour, rounded joins
const SHADOW = '#5a3d24';

/** A number as it is printed in the svg: 2 decimals, no trailing zeros. The one formatter of the rooms. */
export const num = (n) => +n.toFixed(2);
const mark = ([x, y]) => `${num(x)},${num(y)}`;
const points = (pts3) => pts3.map((p) => mark(project(p))).join(' ');

/** Lighten (f > 0, towards white) or darken (f < 0, towards black) a #rrggbb colour. */
export function shade(hex, f) {
  return '#' + [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16))
    .map((c) => Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f))
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('');
}

export function painter(prefix) {
  const blur = `${prefix}-blur`;
  const glow = `${prefix}-glow`;
  const fixed =
    `<filter id="${blur}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>` +
    `<radialGradient id="${glow}"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>`;

  const ids = new Map(); // "kind|colour" → gradient id
  let gradients = '';

  /** `url(#…)` of the gradient for a face: 'top' runs diagonally, 'side' top to bottom. */
  function fillOf(color, kind) {
    const key = `${kind}|${color}`;
    if (!ids.has(key)) {
      const id = `${prefix}-g${ids.size}`;
      const top = kind === 'top';
      const [from, to] = top ? [shade(color, 0.14), color] : [shade(color, 0.06), shade(color, -0.1)];
      gradients +=
        `<linearGradient id="${id}" x1="0" y1="0" x2="${top ? 1 : 0}" y2="1">` +
        `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`;
      ids.set(key, id);
    }
    return `url(#${ids.get(key)})`;
  }

  const face = (pts3, color, kind) =>
    `<polygon points="${points(pts3)}" fill="${fillOf(color, kind)}" stroke="${color}" stroke-width="${EDGE}" stroke-linejoin="round"/>`;

  return {
    /** A box from (x, y, z), size w (x) × d (y) × h (z); `faces` = colours of the +y (left) and +x (right) sides. */
    box(x, y, z, w, d, h, color, faces) {
      const l = faces?.l ?? shade(color, -0.08);
      const r = faces?.r ?? shade(color, -0.2);
      const [x1, y1, z1] = [x + w, y + d, z + h];
      return (
        face([[x, y1, z], [x1, y1, z], [x1, y1, z1], [x, y1, z1]], l, 'side') +
        face([[x1, y, z], [x1, y1, z], [x1, y1, z1], [x1, y, z1]], r, 'side') +
        face([[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]], color, 'top')
      );
    },

    /** A flat polygon (window, mat, picture), optionally outlined: `{ stroke, strokeWidth }`. */
    plane(pts3, color, { stroke, strokeWidth = EDGE } = {}) {
      const edge = stroke ? ` stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"` : '';
      return `<polygon points="${points(pts3)}" fill="${color}"${edge}/>`;
    },

    line(a3, b3, color, width) {
      const [ax, ay] = project(a3);
      const [bx, by] = project(b3);
      return `<line x1="${num(ax)}" y1="${num(ay)}" x2="${num(bx)}" y2="${num(by)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
    },

    /** A blurred floor shadow centred under (x, y); rx, ry are screen radii in the same units. */
    shadow(x, y, rx, ry) {
      const [cx, cy] = project([x, y, 0]);
      return `<ellipse cx="${num(cx)}" cy="${num(cy)}" rx="${num(rx)}" ry="${num(ry)}" fill="${SHADOW}" opacity=".26" filter="url(#${blur})"/>`;
    },

    /** Window light laid over a polygon. */
    glow(pts3) {
      return `<polygon points="${points(pts3)}" fill="url(#${glow})"/>`;
    },

    /** Gradients and filters used so far, ready for an svg <defs>. */
    defs: () => fixed + gradients,
  };
}

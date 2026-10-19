/*
  A room as svg: the shell (floor slab, two tall back walls, a window) and the
  parts of a room model, then the tap areas on top. Pure functions, no DOM —
  the same code draws the first frame at build time (Astro).

  A room model:
    key     the page key ('setup'…), used in error texts
    size    [w, d, h] cm: w along x, d along y, h the height of the walls
    window  optional { wall: 'left' | 'back', from, to, z: [z0, z1] } — 'left'
            is the wall in the plane x = 0, 'back' the one in y = 0; from/to run
            along that wall
    parts   drawn in order, back to front:
              id      unique within the model
              draw    (painter) → svg string
              target  optional, exactly one of { product } | { section } | { project }
              hit     [[x, y, z], …] world points of the tap area (needed with a target); the house
                      (house.js reach) also uses it on a part WITHOUT a target: a tap on that
                      furniture opens its room there (About's). Or PIECES, [[[x, y, z], …], …], where
                      one hull would span the empty air between them (the two softboxes; a lamp's
                      foot and its shade, not the thin pole): the house reaches the part through each
                      piece's hull — the air between shows the room behind, and a tap there opens
                      it; a room page links the part through ONE shape, the hull of all the points
                      (tapArea). hitPieces() reads either form.
              label   optional (with a target), { corner: 'tl' | 'tr' | 'bl' | 'br', at: [x, y, z] }:
                      the link's name in that corner of the picture, a leader to a dot at `at`
                      (on the object, inside its tap area); see "labels" below
  A part without a target is decoration: drawn, never a link.

  Nothing in a drawing links straight to Amazon: `resolve(target)` hands back
  { href, label, kind } for OUR page / card / section, or null (decoration).
*/
import { project } from '../anatomy/iso.js';
import { PALETTE, painter, shade, num } from './paint.js';

export const ROOM_ASPECT = 1.15; // viewBox width / height, so the page can reserve the space
// The side of a tap area, in viewBox units, when the caller gives no `minHit` (the toy rooms of the
// tests). It is NOT a thumb size for a real room: those pass minHitFor(model).
export const MIN_HIT = 14;
export const WALL_THICK = 6;
export const FLOOR_THICK = 6;

const THUMB = 44; // css px: a finger (see minHitFor)
const NARROWEST = 320; // css px: the narrowest phone
const PAD = 4; // around the box of the room, in the same units
const PLANK = 8; // about this far apart
const LIGHT_PATCH = '#ffe7b0';

export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- the shell ---------- */

/** A point on the window's wall: `a` along the wall, `z` up. */
const onWall = (wall, a, z) => (wall === 'left' ? [0, a, z] : [a, 0, z]);

function checkWindow(model) {
  const win = model.window;
  if (win && win.wall !== 'left' && win.wall !== 'back') {
    throw new Error(`rooms/${model.key}: window wall must be "left" or "back"`);
  }
}

/** The window: glass in a wooden frame with one cross, warm light laid over it. */
export function windowOnWall(p, { wall, from, to, z: [z0, z1] }) {
  const pane = [onWall(wall, from, z0), onWall(wall, to, z0), onWall(wall, to, z1), onWall(wall, from, z1)];
  const a = (from + to) / 2;
  const z = (z0 + z1) / 2;
  return (
    p.plane(pane, PALETTE.glass, { stroke: PALETTE.woodDark, strokeWidth: 0.8 }) +
    p.line(onWall(wall, a, z0), onWall(wall, a, z1), PALETTE.woodDark, 0.6) +
    p.line(onWall(wall, from, z), onWall(wall, to, z), PALETTE.woodDark, 0.6) +
    p.glow(pane)
  );
}

/** The window's light on the floor: a blurred parallelogram leaning away from the wall. */
export function lightOnFloor(prefix, [w, d], { wall, from, to, z: [z0, z1] }) {
  const REACH = 1; // floor distance from the wall per unit of window height
  const LEAN = 0.3; // sideways drift per unit of floor distance
  const [alongMax, depthMax] = wall === 'left' ? [d, w] : [w, d];
  const clamp = (v, max) => Math.min(Math.max(v, 0), max);
  const onFloor = ([a, depth]) => {
    const [aa, dd] = [clamp(a, alongMax), clamp(depth, depthMax)];
    return wall === 'left' ? [dd, aa, 0] : [aa, dd, 0];
  };
  const [near, far] = [z0 * REACH, z1 * REACH];
  const pts = [
    [from + near * LEAN, near], [to + near * LEAN, near],
    [to + far * LEAN, far], [from + far * LEAN, far],
  ].map(onFloor).map((q) => project(q).map(num).join(',')).join(' ');
  return `<polygon points="${pts}" fill="${LIGHT_PATCH}" opacity=".35" filter="url(#${prefix}-blur)"/>`;
}

/**
  Walls first, then the slab: the walls stand on the slab's level (their foot is
  hidden behind it), so the slab must be painted over them. Window and its
  floor light follow the walls / the slab.
*/
function shell(p, prefix, model) {
  const [w, d, h] = model.size;
  const T = WALL_THICK;
  const F = FLOOR_THICK;
  const wall = PALETTE.wall;
  const win = model.window;

  const walls =
    // the back wall (plane y = 0): its +y face is the inside, the +x face its cut end
    p.box(-T, -T, -F, w + T, T, h + F, PALETTE.wallTop, { l: wall, r: shade(wall, -0.15) }) +
    // the left wall (plane x = 0): its +x face is the inside, the +y face its cut end
    p.box(-T, 0, -F, T, d, h + F, PALETTE.wallTop, { l: shade(wall, -0.1), r: shade(wall, -0.04) });

  const slab = p.box(0, 0, -F, w, d, F, PALETTE.floor, { l: PALETTE.floorSide, r: shade(PALETTE.floorSide, -0.12) });

  const boards = Math.max(2, Math.round(d / PLANK));
  let planks = '';
  for (let i = 1; i < boards; i++) {
    const y = (d * i) / boards;
    planks += p.line([0, y, 0], [w, y, 0], shade(PALETTE.floor, -0.12), 0.3);
  }

  return (
    walls +
    (win ? windowOnWall(p, win) : '') +
    slab +
    planks +
    (win ? lightOnFloor(prefix, [w, d], win) : '')
  );
}

/** [x, y, w, h] of the box of the room (walls and slab included) + padding, widened to ROOM_ASPECT. */
function viewBoxOf([w, d, h]) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const x of [-WALL_THICK, w]) {
    for (const y of [-WALL_THICK, d]) {
      for (const z of [-FLOOR_THICK, h]) {
        const [sx, sy] = project([x, y, z]);
        x0 = Math.min(x0, sx); y0 = Math.min(y0, sy);
        x1 = Math.max(x1, sx); y1 = Math.max(y1, sy);
      }
    }
  }
  x0 -= PAD; y0 -= PAD; x1 += PAD; y1 += PAD;
  let vw = x1 - x0;
  let vh = y1 - y0;
  if (vw / vh < ROOM_ASPECT) {
    const wide = vh * ROOM_ASPECT;
    x0 -= (wide - vw) / 2;
    vw = wide;
  } else {
    const tall = vw / ROOM_ASPECT;
    y0 -= (tall - vh) / 2;
    vh = tall;
  }
  return [x0, y0, vw, vh].map(num);
}

/**
  The side of a tap area, in viewBox units, that is at least THUMB css px on the narrowest phone,
  where the room is as wide as the screen (full-bleed on phones, styles.css). Worked out from the
  viewBox of the room alone: nothing is drawn. Pass it to renderRoom as `minHit`.
*/
export function minHitFor(model) {
  const [, , width] = viewBoxOf(model.size);
  return Math.ceil((THUMB * width) / NARROWEST);
}

/* ---------- tap areas ---------- */

/** Convex hull of 2D points (monotone chain); fewer than 3 points back when they are all in a line. */
export function hull(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
    .filter((q, i, all) => i === 0 || q[0] !== all[i - 1][0] || q[1] !== all[i - 1][1]);
  if (pts.length < 3) return pts;
  const turn = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const chain = (list) => {
    const out = [];
    for (const q of list) {
      while (out.length >= 2 && turn(out[out.length - 2], out[out.length - 1], q) <= 0) out.pop();
      out.push(q);
    }
    out.pop();
    return out;
  };
  return chain(pts).concat(chain([...pts].reverse()));
}

/** The pieces of a part's `hit`, each a list of world points: a plain list of points is one piece. */
export const hitPieces = (hit) => (!hit?.length ? [] : Array.isArray(hit[0][0]) ? hit : [hit]);

const areaOf = (poly) => Math.abs(poly.reduce((sum, q, i) => {
  const r = poly[(i + 1) % poly.length];
  return sum + q[0] * r[1] - r[0] * q[1];
}, 0)) / 2;

/**
  The tap area of a part: the hull of its projected `hit` points, always joined
  with a box around the centre of their screen box, so the area holds a
  minHit × minHit square whatever the points look like (a point, a line, a
  sliver: every width is >= minHit, not just the bounding box). The box is
  exactly minHit × minHit — except that an item thinner than minHit in one
  direction keeps its full length in the other (a shelf edge stays tappable end
  to end). A big, solid hit already holds the square, so it keeps its own shape.
  Everything is rounded to the printed 2 decimals first (the box outwards), so
  the numbers in the svg are the numbers that were checked.
*/
function tapArea(hit, minHit) {
  const pts = hit.map((q) => project(q).map(num));
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const [w, h] = [x1 - x0, y1 - y0];

  const [cx, cy] = [(x0 + x1) / 2, (y0 + y1) / 2];
  const hw = (h < minHit ? Math.max(w, minHit) : minHit) / 2;
  const hh = (w < minHit ? Math.max(h, minHit) : minHit) / 2;
  const down = (v) => Math.floor(v * 100) / 100;
  const up = (v) => Math.ceil(v * 100) / 100;
  const box = [
    [down(cx - hw), down(cy - hh)], [up(cx + hw), down(cy - hh)],
    [up(cx + hw), up(cy + hh)], [down(cx - hw), up(cy + hh)],
  ];
  return hull([...pts, ...box]);
}

/* ---------- labels ---------- */

/*
  A link's name in a corner of the picture (Tools, Fabrics, Projects; the approved mockup of
  2026-10-18): the name in a pill in the empty corner outside the room, a thin dashed leader from it
  to a gold dot on the object. Pinned in the model (`label: { corner, at }`), not worked out, so an
  edit of the room never reshuffles them. Drawn only for a part that links (an empty section, a
  decoration: no label) and only by renderRoom (the house has names of its own).
  The pill is part of the link too: the same rect, transparent, inside the part's <a class="room__hot">
  (room__pad), so a tap on it does what a tap on the object does; the visible label is decoration,
  hidden from screen readers (the link already has the name). Everything is in the svg: the pages
  without labels (the house, My Setup) do not change at all.
  Sizes are shares of the font size, the font size a share of the viewBox width: the label looks the
  same on a phone and a laptop (≈ 11 px on a 375 px phone).
*/
export const LABEL = {
  font: 0.03, // of the viewBox width
  maxW: 0.4, // the widest pill, of the viewBox width: a longer name wraps
  line: 1.2, // line height
  padX: 0.75, padY: 0.35, // inside the pill
  margin: 0.9, // from the edges of the picture
  dot: 0.32, ring: 0.12, leader: 0.12, dash: [0.35, 0.3], edge: 0.08,
  // the site's colours (styles.css): --paper, --beige-deep, --ink, --ink-soft, --amazon
  colors: { pill: PALETTE.light, edge: '#e4d6c2', ink: PALETTE.dark, leader: '#7a6e60', dot: PALETTE.gold },
};
export const CORNERS = ['tl', 'tr', 'bl', 'br'];

/*
  How wide the letters of the label font are (Nunito Sans, weight 800 — the site's body font), in em,
  rounded UP to 0.05: measured in a browser (Edge, 2026-10-18; the wider of weights 700 and 800).
  There is no DOM at build time, so a pill is sized by these. Anything not listed counts as WIDE (the
  widest letter measured, Щ): a pill may come out a little wide, never too narrow.
*/
export const GLYPHS = {
  0.3: ' \u00a0\u202f!\',./:;IijÌÍÎÏìíîï’', // with the no-break spaces of French ("10 minutes")
  0.35: '\\l|',
  0.4: '()-J[]f{}',
  0.45: '?rt',
  0.5: '"*`cszçгст«»–',
  0.55: '_ekvyèéêëýÿзуэ',
  0.6: '0123456789#$+<=>FLTYZ^abdhnopqux~×Ýàáâãäåðñòóôõö÷øùúûüþГавекхчьяё',
  0.65: 'EPSgÈÉÊËЕЗТбдийлнопрцъЁ',
  0.7: 'BCKRVXÇÞßБВКРСУХЬЭЯм',
  0.75: '&AGUÀÁÂÃÄÅÙÚÛÜЧ',
  0.8: 'DHNOQÐÑÒÓÔÕÖØАИЙЛНОП',
  0.85: 'wДЦЪыю…',
  0.9: 'MmæМжфшщ',
  0.95: 'ФЫœ',
  1.15: '%@Æ—ЖWШЮŒЩ',
};
const WIDE = 1.15;
const EM = new Map(Object.entries(GLYPHS).flatMap(([w, chars]) => [...chars].map((c) => [c, Number(w)])));

/** The width of a text in em of the label font: an estimate that is never short of the real width. */
export const textEm = (text) => [...String(text)].reduce((sum, c) => sum + (EM.get(c) ?? WIDE), 0);

/** Where a name may break: ordinary spaces only (a no-break space keeps "10 minutes" together). */
export const BREAK = /[ \t\r\n]+/;

/**
  A name in as few lines as fit `maxEm` (em), the lines as even as they can be: a pill in a corner
  stays small. In order:
    - no line ends in a one-letter word ("и", "y", "&": it goes down with the next one), unless
      there is no other way;
    - the widest line as narrow as possible, give or take EVEN; among those
    - fewer lines ending in a two-letter word ("Le tote bag / en 10 minutes"), then the longer first
      line ("Молнии, пуговицы / и нитки", as in the approved mockup).
  A word wider than maxEm gets a line of its own.
*/
const EVEN = 0.6; // em
export function wrap(text, maxEm) {
  const words = String(text).split(BREAK).filter(Boolean);
  /** every way to put words i… on n lines (names are short: a handful) */
  const splits = (i, n) => (n === 1 ? [[words.slice(i)]] : words.slice(i + 1, words.length - n + 2).flatMap((_, k) =>
    splits(i + 1 + k, n - 1).map((rest) => [words.slice(i, i + 1 + k), ...rest])));
  /** how many lines (not the last) end in a word of at most `n` letters */
  const ending = (lines, n) => lines.slice(0, -1).filter((line) => [...line[line.length - 1]].length <= n).length;
  for (let n = 1; n <= words.length; n++) {
    const fits = splits(0, n)
      .map((lines) => ({
        lines: lines.map((line) => line.join(' ')),
        widest: Math.max(...lines.map((line) => textEm(line.join(' ')))),
        hanging: ending(lines, 1),
        short: ending(lines, 2),
      }))
      .filter((s) => s.widest <= maxEm || n === words.length);
    if (!fits.length) continue;
    const hanging = Math.min(...fits.map((s) => s.hanging));
    const kept = fits.filter((s) => s.hanging === hanging);
    const narrowest = Math.min(...kept.map((s) => s.widest));
    return kept.filter((s) => s.widest <= narrowest + EVEN)
      .sort((a, b) => a.short - b.short || textEm(b.lines[0]) - textEm(a.lines[0]) || a.widest - b.widest)[0].lines;
  }
  return [''];
}

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/**
  Where a label goes: its pill in `corner` of the frame [x, y, w, h] (the viewBox), its dot at the
  world point `at`, the leader from the dot to the nearest point of the pill's straight edges.
  → { fs, lines, pill: { x, y, w, h, rx }, dot: [x, y], end: [x, y] } — the numbers as printed
*/
export function labelLayout(text, { corner, at }, [vx, vy, vw, vh]) {
  const fs = num(vw * LABEL.font);
  const lines = wrap(text, (vw * LABEL.maxW) / fs - 2 * LABEL.padX);
  const w = num((Math.max(...lines.map(textEm)) + 2 * LABEL.padX) * fs);
  const h = num((lines.length * LABEL.line + 2 * LABEL.padY) * fs);
  const rx = num(((LABEL.line + 2 * LABEL.padY) * fs) / 2); // a one-line pill is round at the ends
  const m = LABEL.margin * fs;
  const x = num(corner[1] === 'l' ? vx + m : vx + vw - m - w);
  const y = num(corner[0] === 't' ? vy + m : vy + vh - m - h);
  const dot = project(at).map(num);
  const end = [num(clamp(dot[0], x + rx, x + w - rx)), num(clamp(dot[1], y, y + h))];
  return { fs, lines, pill: { x, y, w, h, rx }, dot, end };
}

/** The pill's rect: its attributes (the visible label and the link's tap shape share them). */
const pillRect = ({ x, y, w, h, rx }) => `x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"`;

/** The visible label: the leader, the pill, the name, the dot. Decoration: the link has the name. */
function labelSvg(part, { fs, lines, pill, dot, end }) {
  const c = LABEL.colors;
  const cx = num(pill.x + pill.w / 2);
  // each line's baseline: the middle of its line box, lowered by .35 em (as the house labels)
  const text = lines.map((line, i) =>
    `<tspan x="${cx}" y="${num(pill.y + (LABEL.padY + LABEL.line * (i + 0.5) + 0.35) * fs)}">${esc(line)}</tspan>`).join('');
  return `<g class="room__label" data-part="${esc(part)}" aria-hidden="true" pointer-events="none">` +
    `<path d="M${dot.join(' ')}L${end.join(' ')}" fill="none" stroke="${c.leader}" stroke-opacity=".75" stroke-width="${num(LABEL.leader * fs)}" stroke-dasharray="${LABEL.dash.map((d) => num(d * fs)).join(' ')}"/>` +
    `<rect ${pillRect(pill)} fill="${c.pill}" fill-opacity=".96" stroke="${c.edge}" stroke-width="${num(LABEL.edge * fs)}"/>` +
    `<text font-size="${fs}" font-weight="800" fill="${c.ink}" text-anchor="middle" style="font-family:var(--font-body)">${text}</text>` +
    `<circle cx="${dot[0]}" cy="${dot[1]}" r="${num(LABEL.dot * fs)}" fill="${c.dot}" stroke="${c.pill}" stroke-width="${num(LABEL.ring * fs)}"/></g>`;
}

/** A model's labels must be where they can be: on a linked part, in a corner of their own, at a point. */
function checkLabels(model) {
  const corners = new Map();
  for (const part of model.parts) {
    const label = part.label;
    if (!label) continue;
    const where = `rooms/${model.key}: part "${part.id}"`;
    if (!part.target) throw new Error(`${where} has a label but no target`);
    if (!CORNERS.includes(label.corner)) throw new Error(`${where}: label corner must be one of ${CORNERS.join(', ')}`);
    if (label.at?.length !== 3 || !label.at.every(Number.isFinite)) throw new Error(`${where}: label needs at: [x, y, z]`);
    if (corners.has(label.corner)) throw new Error(`rooms/${model.key}: parts "${corners.get(label.corner)}" and "${part.id}" share the label corner "${label.corner}"`);
    corners.set(label.corner, part.id);
  }
}

/**
  Draw the parts of a model with the painter `p`.
    resolve(target) → { href, label, kind: 'product' | 'section' | 'page' } | null
    inactive        part ids drawn as decoration even though they have a target
    frame           the viewBox [x, y, w, h]: with it, a linked part with a `label` gets its label
  → body    the parts, in order; a part that links is wrapped in <g class="room__part" data-part>
    labels  the labels (<g class="room__label">), in the order of the parts; '' without a frame
    hits    the tap areas <a class="room__hot">, AFTER everything, the biggest first
            (small ones on top, so a laptop on a desk stays tappable); a labelled one also holds
            its pill (room__pad)
    hots    { part, kind, href, label } — in the order of `hits` (which is the Tab order)
*/
export function roomParts(model, p, resolve, { minHit = MIN_HIT, inactive = new Set(), frame } = {}) {
  checkLabels(model);
  const seen = new Set();
  const links = [];
  let body = '';
  let labels = '';

  for (const part of model.parts) {
    if (seen.has(part.id)) throw new Error(`rooms/${model.key}: duplicate part id "${part.id}"`);
    seen.add(part.id);

    const art = part.draw(p);
    if (part.target && !hitPieces(part.hit).length) {
      throw new Error(`rooms/${model.key}: part "${part.id}" has a target but no hit`);
    }
    const info = part.target && !inactive.has(part.id) ? resolve?.(part.target) : null;
    if (!info) {
      body += art;
      continue;
    }

    body += `<g class="room__part" data-part="${esc(part.id)}">${art}</g>`;
    const poly = tapArea(hitPieces(part.hit).flat(), minHit);
    const label = part.label && frame ? labelLayout(info.label, part.label, frame) : null;
    if (label) labels += labelSvg(part.id, label);
    links.push({ part: part.id, ...info, poly, area: areaOf(poly), pill: label?.pill });
  }

  links.sort((a, b) => b.area - a.area); // stable: equal areas keep the order of the model

  const hits = links.map((l) =>
    `<a class="room__hot" href="${esc(l.href)}" aria-label="${esc(l.label)}" data-kind="${esc(l.kind)}" data-part="${esc(l.part)}">` +
    `<polygon class="room__hit" points="${l.poly.map(([x, y]) => `${num(x)},${num(y)}`).join(' ')}" fill="transparent"/>` +
    `${l.pill ? `<rect class="room__pad" ${pillRect(l.pill)} fill="transparent"/>` : ''}</a>`,
  ).join('');
  const hots = links.map(({ part, kind, href, label }) => ({ part, kind, href, label }));
  return { body, labels, hits, hots };
}

/* ---------- the room ---------- */

/**
  → svg      the INNER content of an <svg> (starts with <defs>); the component
             wraps it in <svg viewBox="…">: the room, its parts, their labels, the tap areas
    viewBox  [x, y, w, h]: the box of the room + padding, w / h = ROOM_ASPECT
    hots     see roomParts
  `prefix` (default room-<key>) starts every id, so several rooms can share a page.
*/
export function renderRoom(model, { prefix = `room-${model.key}`, resolve, minHit, inactive } = {}) {
  checkWindow(model);
  const p = painter(prefix);
  const viewBox = viewBoxOf(model.size);
  const [vx, vy, vw, vh] = viewBox;

  const room = shell(p, prefix, model);
  const { body, labels, hits, hots } = roomParts(model, p, resolve, { minHit, inactive, frame: viewBox });

  // after drawing: the painter makes its gradients while it paints
  const defs =
    `<defs><radialGradient id="${prefix}-bg" cx=".55" cy=".35" r=".75">` +
    `<stop offset="0" stop-color="${PALETTE.bgFrom}"/><stop offset="1" stop-color="${PALETTE.bgTo}"/></radialGradient>` +
    `${p.defs()}</defs>`;
  const background = `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="url(#${prefix}-bg)"/>`;

  return { svg: defs + background + room + body + labels + hits, viewBox, hots };
}

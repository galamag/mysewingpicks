/*
  The sewing house of the home page (spec 3): the four rooms of the section pages under one
  roof, drawn from the SAME models (ROOMS, rooms.js) — a room is drawn once, in its model.

    projects  the far corner (top)      both its walls are the house's walls
    fabrics   on the right              its back wall (y = 0) is the house's
    setup     on the left               its left wall (x = 0) is the house's
    tools     in front (bottom)         no wall of its own

  One floor, two tall walls at the back (y = 0 and x = 0), low partitions between the rooms.
  A model's window is drawn only when its wall is an outer wall of the house (the Tools window
  is for its page only); furniture standing against a model's wall stands against the house's
  wall too (the Setup desk, the Fabrics shelf, the Projects shelf).

  Nothing inside the house is a link: the rooms are drawn as decoration (roomParts with a resolver
  that knows nothing). Each room is ONE link to its page — its floor (`house__hot`), carrying the
  frame the camera zooms to (`data-zoom`, the House.astro script). Labels: pills outside the house.
  Pure functions, no DOM — the first frame is drawn at build time (Astro).
*/
import { project } from '../anatomy/iso.js';
import { PALETTE, painter, shade, num } from './paint.js';
import { roomParts, windowOnWall, lightOnFloor, esc, WALL_THICK, FLOOR_THICK } from './render.js';

/**
  cell        [w, d] of a room (every model is this big)
  wallH       height of the two outer walls
  partitionH  height of the partitions between the rooms
  at          where each room's corner (0, 0) is in the house; back to front, the order they are drawn in
  label       world point of each room's label, outside the house
*/
export const HOUSE = {
  cell: [60, 50],
  wallH: 40,
  partitionH: 7,
  at: { projects: [0, 0], fabrics: [60, 0], setup: [0, 50], tools: [60, 50] },
  label: { projects: [0, 0, 49], fabrics: [120, 25, -12], setup: [25, 100, -12], tools: [120, 100, -16] },
};

export const HOUSE_ASPECT = 224 / 196; // viewBox width / height (and of every zoom), so the page can reserve the space

const PARTITION = 2; // thickness, centred on the line between two rooms
const PAD = 4; // around the house and its labels
const ZOOM_PAD = 6; // around a room the camera zooms to
const PLANK = 8; // floor boards about this far apart (as in a room)
// a label: a pill PILL.h tall round its text; the text's width is guessed (no DOM at build time) —
// EM wide per letter of the font size (the site's sans, bold), see the test "labels fit"
const PILL = { h: 12, font: 7, em: 0.64, side: 5 };

/** [x, y, w, h] of the screen box of `pts` + pad, widened to HOUSE_ASPECT (centred). */
function frame(pts, pad) {
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  let [x0, y0] = [Math.min(...xs) - pad, Math.min(...ys) - pad];
  let [w, h] = [Math.max(...xs) + pad - x0, Math.max(...ys) + pad - y0];
  if (w / h < HOUSE_ASPECT) {
    const wide = h * HOUSE_ASPECT;
    x0 -= (wide - w) / 2;
    w = wide;
  } else {
    const tall = w / HOUSE_ASPECT;
    y0 -= (tall - h) / 2;
    h = tall;
  }
  return [x0, y0, w, h].map(num);
}

/** The corners of the box from (x0, y0, z0) to (x1, y1, z1), on the screen. */
const boxCorners = ([x0, x1], [y0, y1], [z0, z1]) =>
  [x0, x1].flatMap((x) => [y0, y1].flatMap((y) => [z0, z1].map((z) => project([x, y, z]))));

/** The viewBox: the walls and the floor, and the labels' points (± half a pill), + PAD. */
function houseView() {
  const [w, d] = HOUSE.cell;
  const pts = boxCorners([-WALL_THICK, 2 * w], [-WALL_THICK, 2 * d], [-FLOOR_THICK, HOUSE.wallH]);
  for (const q of Object.values(HOUSE.label)) {
    const [x, y] = project(q);
    pts.push([x, y - PILL.h / 2], [x, y + PILL.h / 2]);
  }
  return frame(pts, PAD);
}

/** The zoom of a room: its box — the floor, the slab under it, up to the top of the walls — + ZOOM_PAD. */
function zoomOf([ox, oy]) {
  const [w, d] = HOUSE.cell;
  return frame(boxCorners([ox, ox + w], [oy, oy + d], [-FLOOR_THICK, HOUSE.wallH]), ZOOM_PAD);
}

/**
  The model's window on the house's wall, or null: drawn only where the room's wall is an outer
  wall of the house (its left wall at x = 0, its back wall at y = 0) — elsewhere it would hang on
  a low partition.
*/
function outerWindow(model, [ox, oy]) {
  const win = model.window;
  if (!win) return null;
  if (win.wall !== 'left' && win.wall !== 'back') throw new Error(`rooms/${model.key}: window wall must be "left" or "back"`);
  if (win.wall === 'back' && oy === 0) return { ...win, from: win.from + ox, to: win.to + ox };
  if (win.wall === 'left' && ox === 0) return { ...win, from: win.from + oy, to: win.to + oy };
  return null;
}

/** The two tall walls, the floor slab of the whole house and its boards. As a room's shell (render.js). */
function shell(p) {
  const [w, d] = [2 * HOUSE.cell[0], 2 * HOUSE.cell[1]];
  const [T, F, H] = [WALL_THICK, FLOOR_THICK, HOUSE.wallH];
  const wall = PALETTE.wall;
  let s =
    p.box(-T, -T, -F, w + T, T, H + F, PALETTE.wallTop, { l: wall, r: shade(wall, -0.15) }) +
    p.box(-T, 0, -F, T, d, H + F, PALETTE.wallTop, { l: shade(wall, -0.1), r: shade(wall, -0.04) }) +
    p.box(0, 0, -F, w, d, F, PALETTE.floor, { l: PALETTE.floorSide, r: shade(PALETTE.floorSide, -0.12) });
  const boards = Math.round(d / PLANK);
  for (let i = 1; i < boards; i++) {
    const y = (d * i) / boards;
    s += p.line([0, y, 0], [w, y, 0], shade(PALETTE.floor, -0.12), 0.3);
  }
  return s;
}

/** A low partition from (x, y), w × d. */
const partition = (p, x, y, w, d) =>
  p.box(x, y, 0, w, d, HOUSE.partitionH, PALETTE.wallTop, { l: PALETTE.wall, r: shade(PALETTE.wall, -0.12) });

/** A label: the text in a pill centred on the world point. Hidden from screen readers: the room's link has the same name. */
function label(text, at) {
  const [cx, cy] = project(at);
  const w = [...String(text)].length * PILL.font * PILL.em + 2 * PILL.side;
  return `<g class="house__label" aria-hidden="true"><rect x="${num(cx - w / 2)}" y="${num(cy - PILL.h / 2)}" width="${num(w)}" height="${PILL.h}" rx="${PILL.h / 2}"/>` +
    `<text x="${num(cx)}" y="${num(cy)}" dy=".35em">${esc(text)}</text></g>`;
}

/**
  rooms   the models by key (ROOMS): exactly the keys of HOUSE.at, each HOUSE.cell big
  prefix  starts every id (one painter for the whole house: a gradient is made once)
  labels  key → the room's name (its label and the link's aria-label)
  hrefs   key → the room's page
  → svg      the INNER content of an <svg> (starts with <defs>); House.astro wraps it
    viewBox  [x, y, w, h]: the house and its labels + padding, w / h = HOUSE_ASPECT
    rooms    [{ key, zoom }] in the order of HOUSE.at: zoom = [x, y, w, h] the camera ends on
*/
export function renderHouse(rooms, { prefix = 'house', labels, hrefs } = {}) {
  const keys = Object.keys(HOUSE.at);
  for (const key of keys) {
    const model = rooms[key];
    if (!model) throw new Error(`house: no room "${key}"`);
    const [w, d, h] = model.size;
    if (w !== HOUSE.cell[0] || d !== HOUSE.cell[1] || h !== HOUSE.wallH) {
      throw new Error(`house: room "${key}" is ${w} × ${d} × ${h}, a cell of the house is ${HOUSE.cell.join(' × ')} × ${HOUSE.wallH}`);
    }
    if (!labels?.[key]) throw new Error(`house: no label for "${key}"`);
    if (!hrefs?.[key]) throw new Error(`house: no link for "${key}"`);
  }

  const p = painter(prefix);
  const viewBox = houseView();
  const [vx, vy, vw, vh] = viewBox;

  /** A room: the window on the house's wall, then (moved to its cell) the light on its floor and its parts. */
  const room = (key) => {
    const model = rooms[key];
    const at = HOUSE.at[key];
    const win = outerWindow(model, at);
    const [dx, dy] = project([...at, 0]);
    const { body } = roomParts(model, p, () => null); // decoration only: nothing in a room is a link here
    return `<g class="house__room" data-room="${key}">${win ? windowOnWall(p, win) : ''}` +
      `<g transform="translate(${num(dx)} ${num(dy)})">${win ? lightOnFloor(prefix, model.size, model.window) : ''}${body}</g></g>`;
  };

  // back to front: the far room, the partitions in front of it, the two side rooms, the
  // partitions behind the front room, the front room
  const [cw, cd] = HOUSE.cell;
  const half = PARTITION / 2;
  const drawing =
    shell(p) +
    room('projects') +
    partition(p, cw - half, 0, PARTITION, cd) + partition(p, 0, cd - half, cw, PARTITION) +
    room('fabrics') + room('setup') +
    partition(p, cw, cd - half, cw, PARTITION) + partition(p, cw - half, cd, PARTITION, cd) +
    room('tools');

  const pills = keys.map((key) => label(labels[key], HOUSE.label[key])).join('');

  const zooms = keys.map((key) => ({ key, zoom: zoomOf(HOUSE.at[key]) }));
  const hots = zooms.map(({ key, zoom }) => {
    const [ox, oy] = HOUSE.at[key];
    const floor = [[ox, oy, 0], [ox + cw, oy, 0], [ox + cw, oy + cd, 0], [ox, oy + cd, 0]]
      .map((q) => project(q).map(num).join(',')).join(' ');
    return `<a class="house__hot" href="${esc(hrefs[key])}" aria-label="${esc(labels[key])}" data-room="${key}" data-zoom="${zoom.join(' ')}">` +
      `<polygon class="house__hit" points="${floor}"/></a>`;
  }).join('');

  // after drawing: the painter makes its gradients while it paints
  const defs =
    `<defs><radialGradient id="${prefix}-bg" cx=".55" cy=".35" r=".75">` +
    `<stop offset="0" stop-color="${PALETTE.bgFrom}"/><stop offset="1" stop-color="${PALETTE.bgTo}"/></radialGradient>` +
    `${p.defs()}</defs>`;
  const background = `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="url(#${prefix}-bg)"/>`;

  return { svg: defs + background + drawing + pills + hots, viewBox, rooms: zooms };
}

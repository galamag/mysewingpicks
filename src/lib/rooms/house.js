/*
  The sewing house of the home page (spec «Изометрические комнаты», 3; layout A of spec «Гайды», 9):
  six rooms of the site under one roof, 3 × 2, drawn from the SAME models (ROOMS, rooms.js) — a room
  is drawn once, in its model.

    back row   projects (the far corner)   guides               fabrics
    front row  setup                       about                tools (the near corner)

  One floor, two tall walls at the back (y = 0 and x = 0), low partitions between the rooms.
  The back row's back walls and the left column's left walls are the house's walls: Projects has
  both, Guides and Fabrics the back one, My Setup the left one; About and Tools have none.
  A model's window is drawn only when its wall is an outer wall of the house (the About and Tools
  windows are for their pages only); furniture standing against a model's wall stands against the
  house's wall too (the Setup desk, the Fabrics shelf, the Projects shelf, the Guides design wall).

  Nothing inside a room is a link of its own: the rooms are drawn as decoration (roomParts with a
  resolver that knows nothing). Each room is ONE link to its page (`house__hot`), carrying the frame
  the camera zooms to (`data-zoom`, the House.astro script), and a tap reaches it wherever the room is
  seen: its floor, its outer walls, its furniture, its label (see `reach`). Labels: pills outside the house.
  Pure functions, no DOM — the first frame is drawn at build time (Astro).
*/
import { project } from '../anatomy/iso.js';
import { PALETTE, painter, shade, num } from './paint.js';
import { roomParts, windowOnWall, lightOnFloor, hull, hitPieces, esc, textEm, WALL_THICK, FLOOR_THICK } from './render.js';
import { LOCALES, t } from '../../i18n/index.js';

/**
  cell        [w, d] of a room (every model is this big)
  cols, rows  the grid of cells: cols along x, rows along y
  wallH       height of the two outer walls
  partitionH  height of the partitions between the rooms
  at          where each room's corner (0, 0) is in the house (a corner of a cell of the grid)
  label       world point of each room's label, outside the house
*/
export const HOUSE = {
  cell: [60, 50],
  cols: 3,
  rows: 2,
  wallH: 40,
  partitionH: 7,
  at: { projects: [0, 0], guides: [60, 0], fabrics: [120, 0], setup: [0, 50], about: [60, 50], tools: [120, 50] },
  // the sketch's places, four moved: Guides higher (z 49 → 56: its pill, bigger now, hid the top of
  // the design wall), Tools lower (−12 → −16: a long name hid the foot of the cutting table), About
  // 10 to the left of its middle (90 → 80: there its pill joins the front of its floor, the test
  // "every room link keeps a big tap area on a 320 px phone"), My Setup 8 to the left ([30, 100, -12]
  // → [22, 100, -14]: the right end of a long name, "Il mio studio", lay over About's floor corner,
  // and About's link, later, took the taps there — the test "a tap anywhere on a room's label")
  label: { projects: [0, 0, 49], guides: [90, 0, 56], fabrics: [180, 25, -12], tools: [180, 75, -16], about: [80, 100, -12], setup: [22, 100, -14] },
};

const PARTITION = 2; // thickness, centred on the line between two rooms
const PAD = 4; // around the house and its labels
const ZOOM_PAD = 6; // around a room the camera zooms to
const PLANK = 8; // floor boards about this far apart (as in a room)
// a label: its text in a pill. The font size (viewBox units) is the one knob: on the narrowest phones
// the house is as wide as the screen, so the text is font × screen / viewBox width css px (the test
// "labels are readable on a phone"). The pill is 1.7 font sizes tall and as wide as the text — guessed,
// there is no DOM at build time, by render.js textEm (the site's sans, bold; never short) — plus `side`
// font sizes at each end.
const FONT = 8.5;
const PILL = { font: FONT, h: num(FONT * 1.7), side: 0.7 };

/** The width of the pill round a name. */
const pillWidth = (text) => (textEm(text) + 2 * PILL.side) * PILL.font;

/**
  The widest pill each room's label gets in any language of the site (its name in the menu, ui.nav —
  what House.astro shows): the picture leaves room for it, so a label can stand where its longest
  name still clears its neighbours, and a longer translation widens the picture instead of spilling out.
*/
const WIDEST = Object.fromEntries(Object.keys(HOUSE.at).map((key) => [key, Math.max(...LOCALES.map((lang) => pillWidth(t(lang).ui.nav[key])))]));

/** The rooms back to front, the order they are drawn (and linked) in: by the diagonal of their cell, then left to right. */
const ORDER = Object.keys(HOUSE.at).sort((a, b) => {
  const [[ax, ay], [bx, by]] = [HOUSE.at[a], HOUSE.at[b]];
  const [cw, cd] = HOUSE.cell;
  return ax / cw + ay / cd - (bx / cw + by / cd) || ax - bx;
});

/** The corners of the box from (x0, y0, z0) to (x1, y1, z1), on the screen. */
const boxCorners = ([x0, x1], [y0, y1], [z0, z1]) =>
  [x0, x1].flatMap((x) => [y0, y1].flatMap((y) => [z0, z1].map((z) => project([x, y, z]))));

/** [x, y, w, h] of the screen box of `pts` + pad. */
function boxOf(pts, pad) {
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const [x0, y0] = [Math.min(...xs) - pad, Math.min(...ys) - pad];
  return [x0, y0, Math.max(...xs) + pad - x0, Math.max(...ys) + pad - y0];
}

/**
  The viewBox: the walls and the floor of the whole grid, and round each label's point its widest pill
  (WIDEST: the same box in every language, so HOUSE_ASPECT is one number), + PAD.
*/
function houseView() {
  const [w, d] = HOUSE.cell;
  const pts = boxCorners([-WALL_THICK, HOUSE.cols * w], [-WALL_THICK, HOUSE.rows * d], [-FLOOR_THICK, HOUSE.wallH]);
  for (const [key, q] of Object.entries(HOUSE.label)) {
    const [x, y] = project(q);
    pts.push([x - WIDEST[key] / 2, y - PILL.h / 2], [x + WIDEST[key] / 2, y + PILL.h / 2]);
  }
  return boxOf(pts, PAD).map(num);
}

const VIEW = houseView();
// viewBox width / height, and of every zoom (the camera never stretches the picture); worked out, never typed in
export const HOUSE_ASPECT = VIEW[2] / VIEW[3];

/** [x, y, w, h] of the screen box of `pts` + pad, widened to HOUSE_ASPECT (centred). */
function frame(pts, pad) {
  let [x0, y0, w, h] = boxOf(pts, pad);
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
  const [w, d] = [HOUSE.cols * HOUSE.cell[0], HOUSE.rows * HOUSE.cell[1]];
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

/** The partitions a room stands behind: along its back side and its left side, where it has a neighbour there. */
function partitionsOf(p, [ox, oy]) {
  const [cw, cd] = HOUSE.cell;
  const half = PARTITION / 2;
  return (oy > 0 ? partition(p, ox, oy - half, cw, PARTITION) : '') + (ox > 0 ? partition(p, ox - half, oy, PARTITION, cd) : '');
}

/** The pill round a label's text, centred on the world point: the rect's attributes (the label and its link share it). */
function pill(text, at) {
  const [cx, cy] = project(at);
  const w = pillWidth(text);
  return `x="${num(cx - w / 2)}" y="${num(cy - PILL.h / 2)}" width="${num(w)}" height="${PILL.h}" rx="${num(PILL.h / 2)}"`;
}

/** A label: the text in its pill. Hidden from screen readers: the room's link has the same name. */
function label(text, at) {
  const [cx, cy] = project(at);
  return `<g class="house__label" aria-hidden="true"><rect ${pill(text, at)}/>` +
    `<text x="${num(cx)}" y="${num(cy)}" dy=".35em" font-size="${PILL.font}">${esc(text)}</text></g>`;
}

const points = (pts) => pts.map(([x, y]) => `${x},${y}`).join(' ');

/** The hull, on the screen, of world points (each rounded as the svg prints it). */
const outline = (pts3) => hull(pts3.map((q) => project(q).map(num)));

/**
  What a tap on a room reaches, besides its floor ("what you see is what you tap"): its OUTER walls
  (the faces of the house's walls along its cell), the edge of its floor where that is the edge of
  the house (the front face of the slab under a front-row room, the right face under a right-column
  one: the floor seen from the side, between the floor and the label below it) and the `hit` hull of
  EVERY part that has one — with a target or not (About links nowhere on its own page, its furniture
  still opens it here), a hull per piece of it (render.js hitPieces) — moved to its cell: tall
  furniture rises on the screen over the floor of the room behind it, and a tap on it must open its
  own room. Only on it: the air between two pieces shows the room behind, and a tap there opens that.
  The links are in drawing order (back to front), so where a nearer room's furniture covers this
  room's, the nearer one wins, as the eye sees it.
*/
function reach(model, [ox, oy]) {
  const [w, d] = HOUSE.cell;
  const [T, F, H] = [WALL_THICK, FLOOR_THICK, HOUSE.wallH];
  /** the corners of the box x0..x1 × y0..y1 × z0..z1 */
  const box = ([x0, x1], [y0, y1], [z0, z1]) => [x0, x1].flatMap((x) => [y0, y1].flatMap((y) => [z0, z1].map((z) => [x, y, z])));
  const sides = [
    ...(oy === 0 ? [box([ox === 0 ? -T : ox, ox + w], [-T, 0], [-F, H])] : []), // the back wall (y = 0) along the cell
    ...(ox === 0 ? [box([-T, 0], [oy, oy + d], [-F, H])] : []), // the left wall (x = 0)
    ...(oy + d === HOUSE.rows * d ? [box([ox, ox + w], [oy + d, oy + d], [-F, 0])] : []), // the slab's front face
    ...(ox + w === HOUSE.cols * w ? [box([ox + w, ox + w], [oy, oy + d], [-F, 0])] : []), // the slab's right face
  ];
  const parts = model.parts.flatMap((part) => hitPieces(part.hit))
    .map((piece) => piece.map(([x, y, z]) => [x + ox, y + oy, z]));
  return [...sides, ...parts].map(outline).filter((poly) => poly.length >= 3);
}

/**
  rooms   the models by key (ROOMS): every key of HOUSE.at must be there (it may hold more), each
          HOUSE.cell big
  prefix  starts every id (one painter for the whole house: a gradient is made once)
  labels  key → the room's name (its label and the link's aria-label)
  hrefs   key → the room's page
  → svg      the INNER content of an <svg> (starts with <defs>); House.astro wraps it
    viewBox  [x, y, w, h]: the house and its labels + padding, w / h = HOUSE_ASPECT
    rooms    [{ key, zoom }] back to front (the order of the links): zoom = [x, y, w, h] the camera ends on
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
  const viewBox = [...VIEW];
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

  // back to front: each room after the partitions it stands behind (so they hide its back and left edges)
  const drawing = shell(p) + ORDER.map((key) => partitionsOf(p, HOUSE.at[key]) + room(key)).join('');

  const pills = keys.map((key) => label(labels[key], HOUSE.label[key])).join('');

  // one link per room, back to front as drawn (a nearer room wins where it covers one behind):
  // its floor (house__hit: the hover / focus feedback), then, never painted (house__pad), its
  // outer walls, its furniture and its label's pill
  const [cw, cd] = HOUSE.cell;
  const zooms = ORDER.map((key) => ({ key, zoom: zoomOf(HOUSE.at[key]) }));
  const hots = zooms.map(({ key, zoom }) => {
    const [ox, oy] = HOUSE.at[key];
    const floor = [[ox, oy, 0], [ox + cw, oy, 0], [ox + cw, oy + cd, 0], [ox, oy + cd, 0]].map((q) => project(q).map(num));
    const pads = reach(rooms[key], [ox, oy]).map((poly) => `<polygon class="house__pad" points="${points(poly)}" fill="transparent"/>`).join('');
    return `<a class="house__hot" href="${esc(hrefs[key])}" aria-label="${esc(labels[key])}" data-room="${key}" data-zoom="${zoom.join(' ')}">` +
      `<polygon class="house__hit" points="${points(floor)}" fill="transparent"/>${pads}<rect class="house__pad" ${pill(labels[key], HOUSE.label[key])} fill="transparent"/></a>`;
  }).join('');

  // after drawing: the painter makes its gradients while it paints
  const defs =
    `<defs><radialGradient id="${prefix}-bg" cx=".55" cy=".35" r=".75">` +
    `<stop offset="0" stop-color="${PALETTE.bgFrom}"/><stop offset="1" stop-color="${PALETTE.bgTo}"/></radialGradient>` +
    `${p.defs()}</defs>`;
  const background = `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="url(#${prefix}-bg)"/>`;

  return { svg: defs + background + drawing + pills + hots, viewBox, rooms: zooms };
}

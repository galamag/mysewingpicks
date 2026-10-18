/*
  The project room of Projects (/projects.html, and the Projects room of the house).

  Finished items stand for the projects (spec 4.4): a tap opens the project's page in the
  page's language. Six places (SLOTS): two on the table in the middle of the room, four on
  the shelf against the left wall. The newest project (the last in src/data/projects.js)
  stands in front on the table, the next one behind it, older ones go to the shelf; more
  than six — only in the list under the room.

  A project is in the room only if it has an item here: ITEMS[slug], a mini version of the
  finished thing, drawn at the origin (its footprint centred on x = y = 0, its base at
  z = 0) and placed by its slot (moved and, on the shelf, scaled). Without an item a new
  project simply is not in the room — the build never fails for that. An empty place on
  the shelf holds a few small things instead (SPARE: a vase, folded fabric, spools — decoration).

  In the house this room is the far corner: both its walls are outer walls, so the window
  and the picture (the back wall) and the shelf (the left wall) stay there.

  Decoration: the window, the picture (a patchwork block, no lettering), the plant under the
  window and the rug, all clear of the tap areas — with every place taken too (tested). Every
  item's tap area is the hull of its box (render.js), at least a thumb on a 320 px phone; the
  places stand far enough apart on the screen that each keeps a thumb's square of its own.
  Model contract: src/lib/rooms/render.js. World units (cm-like): x → right-down,
  y → left-down, z → up; parts are listed back to front (painted in order).
*/
import { project } from '../anatomy/iso.js';
import { PALETTE as C, shade, num } from './paint.js';
import { dot, disc, flat, corners, WOOD } from './props.js';
import { projects } from '../../data/projects.js';

const xy = ([a, b]) => `${num(a)} ${num(b)}`;

/* ---------- the items (ITEMS) ---------- */

/** A mini item: its drawing (painter → svg) with `box` = [w, d, h], the box it fills round the origin. */
const item = (box, draw) => Object.assign(draw, { box });

/**
  An open box round the origin, w × d × h (d ≤ w, d ≤ h): its outer sides and, through the open
  top, the lining of its two far walls. Their corner runs down from the back corner of the rim;
  from the room the left far wall shows as a triangle down to the front rim, the back far wall
  as the rest of the opening (where the front rim hides them, the corner is at h - d).
*/
function openBox(p, [w, d, h], outer, lining) {
  const [a, b] = [w / 2, d / 2];
  const [B, Q] = [[-a, -b, h], [-a, -b, h - d]];
  return p.box(-a, -b, 0, w, d, h, lining, { l: outer, r: shade(outer, -0.16) }) +
    p.plane([B, [-a, b, h], Q], shade(lining, 0.1)) +
    p.plane([B, [a, -b, h], [a - d, -b, h - d], Q], shade(lining, -0.1));
}

const TOTE = { w: 11, d: 4, h: 12, rise: 9.5, half: 2.7 }; // `half`: from the middle to a strap leg
const LINING = '#e6d0ae'; // the tote's satin, as in its anatomy

/** The tote: a patchwork bag, its satin lining in the open top, two long straps standing up. */
function tote(p) {
  const { w, d, h, rise, half } = TOTE;
  const [x0, y0] = [-w / 2, -d / 2];
  const strap = (y) => {
    const [a, b, c, e] = [[-half, y, h - 0.4], [-half, y, h + rise * 1.33], [half, y, h + rise * 1.33], [half, y, h - 0.4]].map(project);
    const d0 = `M${xy(a)}C${xy(b)} ${xy(c)} ${xy(e)}`;
    return `<path d="${d0}" fill="none" stroke="${C.roseDeep}" stroke-width="1.3" stroke-linecap="round"/>` +
      `<path d="${d0}" fill="none" stroke="${C.cream}" stroke-width="0.25" stroke-dasharray=".5 .4"/>`;
  };
  let s = p.shadow(0.8, 0.8, w * 0.65, 2.2);
  s += strap(y0 + 0.4);
  s += openBox(p, [w, d, h], C.rose, LINING);
  // the check of the duck: squares on the front (+y) and on the side (+x)
  const fy = y0 + d + 0.02;
  const fx = x0 + w + 0.02;
  const [cw, ch] = [w / 3, h / 3];
  const CHECK = [[1, 0, C.cream], [2, 0, C.gold], [0, 1, C.sage], [2, 1, C.cream], [1, 2, C.cream], [0, 2, C.gold]];
  for (const [i, j, c] of CHECK) {
    s += p.plane([[x0 + i * cw, fy, j * ch], [x0 + (i + 1) * cw, fy, j * ch], [x0 + (i + 1) * cw, fy, (j + 1) * ch], [x0 + i * cw, fy, (j + 1) * ch]], c);
  }
  s += p.plane([[fx, y0, ch], [fx, y0 + d, ch], [fx, y0 + d, 2 * ch], [fx, y0, 2 * ch]], shade(C.gold, -0.12));
  s += p.line([x0, fy, h - 0.6], [x0 + w, fy, h - 0.6], C.cream, 0.2); // the topstitching
  return s + strap(y0 + d - 0.4);
}

const BASKET = { w: 8.6, h: 8.8 };
const XMAS = C.roseDeep; // the basket's Christmas cotton
const CHECKED = '#c9c3b8'; // its grey check lining, as in its anatomy

/** The basket: an open box, the grey check lining inside, lace round the top, a bow on every corner. */
function basket(p) {
  const { w, h } = BASKET;
  const a = w / 2;
  let s = p.shadow(0.8, 0.8, w * 0.75, 2.6);
  s += openBox(p, [w, w, h], XMAS, CHECKED);
  // the check of the lining on the two far walls
  for (const k of [1, 2]) {
    const u = (w * k) / 3;
    const line = (q, r) => p.line(q, r, shade(CHECKED, -0.25), 0.18);
    s += line([-a, -a, h - u], [-a, -a + u, h - u]) + line([-a, -a + u, h], [-a, -a + u, h - w + u]);
    s += line([-a, -a, h - u], [-a + u, -a, h - u]) + line([-a + u, -a, h], [-a + u, -a, h - w + u]);
  }
  // snowflakes and gold dots on the two sides in sight
  const flake = ([x, y, z]) => {
    const [cx, cy] = project([x, y, z]);
    return `<path d="M${num(cx - 0.7)} ${num(cy)}H${num(cx + 0.7)}M${num(cx - 0.35)} ${num(cy - 0.6)}L${num(cx + 0.35)} ${num(cy + 0.6)}M${num(cx + 0.35)} ${num(cy - 0.6)}L${num(cx - 0.35)} ${num(cy + 0.6)}" stroke="${C.light}" stroke-width="0.25"/>`;
  };
  s += [[-1.8, a, 3.2], [1.6, a, 1.6], [a, -1.6, 3.4], [a, 1.8, 1.4]].map(flake).join('');
  s += [[0, a, 4.2], [-2.2, a, 1], [a, 0.4, 3], [a, -2.6, 1.2]].map((q) => dot(q, 0.28, C.gold)).join('');
  // the lace round the top, its holes
  const [z0, z1] = [h - 1.8, h - 0.5];
  s += p.plane([[-a, a, z0], [a, a, z0], [a, a, z1], [-a, a, z1]], C.light) + p.plane([[a, -a, z0], [a, a, z0], [a, a, z1], [a, -a, z1]], shade(C.light, -0.08));
  for (const t of [-2.4, -0.8, 0.8, 2.4]) s += dot([t, a, (z0 + z1) / 2], 0.22, C.beige) + dot([a, t, (z0 + z1) / 2], 0.22, C.beige);
  // bows on the three corners in sight, with their red beads
  for (const q of [[-a, a, z0 + 0.6], [a, a, z0 + 0.6], [a, -a, z0 + 0.6]]) {
    const [cx, cy] = project(q);
    s += `<path d="M${num(cx - 0.3)} ${num(cy)}l-.5 1.6M${num(cx + 0.3)} ${num(cy)}l.5 1.6" stroke="${C.cream}" stroke-width="0.5"/>`;
    s += `<ellipse cx="${num(cx - 0.9)}" cy="${num(cy - 0.1)}" rx="0.9" ry="0.65" fill="${C.light}" stroke="${C.beige}" stroke-width="0.2"/>`;
    s += `<ellipse cx="${num(cx + 0.9)}" cy="${num(cy - 0.1)}" rx="0.9" ry="0.65" fill="${C.light}" stroke="${C.beige}" stroke-width="0.2"/>`;
    s += `<circle cx="${num(cx)}" cy="${num(cy)}" r="0.4" fill="${shade(C.roseDeep, -0.15)}"/>`;
  }
  return s;
}

/**
  One item per project slug. A new project gets its item here (a mini version of the finished
  thing, in the room's colours, no lettering); see the skill building-sewing-anatomy.
*/
export const ITEMS = {
  'tote-bag': item([TOTE.w, TOTE.d, TOTE.h + TOTE.rise], tote),
  'fabric-basket': item([BASKET.w, BASKET.w, BASKET.h], basket),
};

/* ---------- the furniture ---------- */

const WINDOW = { wall: 'back', from: 38, to: 54, z: [22, 34] }; // over the plant

// the shelf against the left wall (x = 0): two bays; things stand inside on the lower board and
// on its top (nothing above them: a board over the upper places would hide the tops of tall items)
const SHELF = { x: 0.5, d: 8, posts: [5, 27, 49], levels: [3, 25] }; // the boards, 1 thick
const BAYS = [16, 38]; // the middle of each bay, along y

// the table in the middle, its top at tableTop; a quilted runner along it
const TABLE = { x: 32, y: 14, w: 26, d: 19, z: 14, t: 1.4 };
const tableTop = TABLE.z + TABLE.t;

/**
  The six places: `at` the world point the item's origin goes to, `k` its scale.
  0 and 1 on the table (0 in front), 2–5 on the shelf (on its top first, then inside).
*/
export const SLOTS = [
  { at: [54, 21, tableTop], k: 1 },
  { at: [38, 27, tableTop], k: 1 },
  ...SHELF.levels.slice().reverse().flatMap((z) => BAYS.map((y) => ({ at: [SHELF.x + SHELF.d / 2, y, z + 1], k: 0.5 }))),
];

function shelf(p) {
  const { x, d, posts, levels: [low, top] } = SHELF;
  const [y0, y1] = [posts[0] - 0.4, posts[posts.length - 1] + 0.4];
  let s = p.shadow(x + d / 2 + 2, (y0 + y1) / 2 + 2, 9, 16);
  // the back board, darker, so what stands inside stands out
  s += p.plane([[x + 0.05, y0, 0], [x + 0.05, y1, 0], [x + 0.05, y1, top], [x + 0.05, y0, top]], shade(C.wood, -0.28));
  s += p.box(x, y0, low, d, y1 - y0, 1, C.wood, WOOD);
  s += p.box(x + d - 0.6, y0, 0, 0.6, y1 - y0, low, shade(C.wood, -0.1), WOOD); // the plinth along its front
  for (const y of posts) s += p.box(x, y - 0.4, 0, d, 0.8, top, C.wood, WOOD);
  return s + p.box(x, y0, top, d, y1 - y0, 1, C.wood, WOOD);
}

/** Folded fabric, one piece per colour, the first at the bottom. */
const folded = (p, [x, y, z], colors) => colors.map((c, k) => p.box(x - 2.4, y - 3.2, z + k * 1.6, 4.8, 6.4, 1.5, c)).join('');

/** What an empty place on the shelf holds instead (decoration), by slot: a vase, fabric, spools, fabric and a pincushion. */
const SPARE = {
  2: (p, [x, y, z]) => {
    let s = p.box(x - 1.3, y - 1.3, z, 2.6, 2.6, 3.8, C.sage, { l: C.sageDeep, r: shade(C.sageDeep, -0.12) });
    for (const [u, v, t, c] of [[-1.8, 0.6, 6.4, C.rose], [0.6, -1.8, 7, C.gold], [1.4, 1.4, 5.8, C.light]]) {
      s += p.line([x, y, z + 3.8], [x + u, y + v, z + t], C.sageDeep, 0.35) + dot([x + u, y + v, z + t + 0.3], 1.2, c) + dot([x + u, y + v, z + t + 0.3], 0.45, C.gold);
    }
    return s;
  },
  3: (p, at) => folded(p, at, [C.rose, C.cream, C.sage]),
  4: (p, [x, y, z]) => [[-1.4, -1.8, C.rose], [1.4, -1.4, C.gold], [0, 1.6, C.sage]].map(([u, v, c]) => {
    const flange = shade(C.wood, 0.3);
    return disc([x + u, y + v, z], 1.15, flange) + p.box(x + u - 0.8, y + v - 0.8, z + 0.2, 1.6, 1.6, 2.4, c) + disc([x + u, y + v, z + 2.6], 1.15, flange);
  }).join(''),
  5: (p, [x, y, z]) => folded(p, [x, y, z], [C.gold, C.sageDeep]) + disc([x, y, z + 3.6], 1.5, C.roseDeep) + disc([x, y, z + 4], 1.1, C.rose) + dot([x - 0.4, y + 0.4, z + 4.6], 0.3, C.gold),
};

function table(p) {
  const { x, y, w, d, z, t } = TABLE;
  const leg = (lx, ly) => p.box(lx, ly, 0, 1.4, 1.4, z, C.woodDark);
  let s = p.shadow(x + w / 2 + 1.5, y + d / 2 + 1.5, 18, 6.5);
  s += leg(x + 0.8, y + 0.8) + leg(x + w - 2.2, y + 0.8) + leg(x + 0.8, y + d - 2.2);
  s += p.box(x + 0.8, y + d - 1.6, z - 1.8, w - 1.6, 0.8, 1.8, C.wood, WOOD); // the apron along the front
  s += leg(x + w - 2.2, y + d - 2.2);
  s += p.box(x, y, z, w, d, t, C.wood, WOOD);
  // a patchwork runner along the table
  const [ry0, ry1] = [y + 5, y + 13];
  const top = tableTop + 0.03;
  s += p.plane(flat(x + 0.6, x + w - 0.6, ry0, ry1, top), C.cream, { stroke: shade(C.beige, -0.1), strokeWidth: 0.3 });
  for (let i = 0; i < 6; i++) {
    const cx = x + 1 + i * ((w - 2) / 6);
    s += p.plane(flat(cx + 0.4, cx + (w - 2) / 6 - 0.4, ry0 + (i % 2 ? 4.4 : 0.8), ry0 + (i % 2 ? 7.2 : 3.6), top + 0.01), [C.rose, C.sage, C.gold][i % 3]);
  }
  return s;
}

/* ---------- decoration ---------- */

// a patchwork block in a frame on the back wall: a pinwheel of eight triangles
export const PICTURE = { x0: 10, x1: 26, z: [20, 32] };

function picture(p) {
  const { x0, x1, z: [z0, z1] } = PICTURE;
  const at = (u, v) => [x0 + (x1 - x0) * u, 0.1, z0 + (z1 - z0) * v];
  let s = p.plane([at(0, 0), at(1, 0), at(1, 1), at(0, 1)], C.woodDark);
  s += p.plane([at(0.07, 0.09), at(0.93, 0.09), at(0.93, 0.91), at(0.07, 0.91)], C.sage);
  // the block: four squares, each two triangles, the rose ones turning round the middle
  const [u0, u1, v0, v1] = [0.2, 0.8, 0.2, 0.8];
  const [um, vm] = [(u0 + u1) / 2, (v0 + v1) / 2];
  s += p.plane([at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)], C.cream);
  for (const tri of [[[u0, v1], [um, v1], [um, vm]], [[u1, v1], [u1, vm], [um, vm]], [[u1, v0], [um, v0], [um, vm]], [[u0, v0], [u0, vm], [um, vm]]]) {
    s += p.plane(tri.map(([u, v]) => at(u, v)), C.rose);
  }
  return s;
}

// a snake plant in a pot under the window
export const PLANT = { x: 52, y: 2.5, s: 5.4, h: 6, leaves: 13 };

function plant(p) {
  const { x, y, s: size, h } = PLANT;
  let s = p.shadow(x + size / 2 + 1, y + size / 2 + 1, 5.5, 2.4);
  s += p.box(x, y, 0, size, size, h, C.cream, { l: shade(C.cream, -0.06), r: shade(C.cream, -0.16) });
  s += p.plane(flat(x + 0.5, x + size - 0.5, y + 0.5, y + size - 0.5, h), C.woodDark);
  // upright pointed leaves: [from the middle, lean, length, width, colour]; the back ones first
  const [bx, by] = project([x + size / 2, y + size / 2, h]);
  for (const [dx, lean, len, wd, c] of [[-1.5, -1.6, 10, 1.5, C.sageDeep], [1.5, 1.7, 10.5, 1.5, C.sageDeep], [-0.5, -0.4, PLANT.leaves, 1.7, C.sage], [0.7, 0.8, 11.5, 1.6, C.sage], [0, 0.2, 8.5, 1.4, shade(C.sage, 0.15)]]) {
    const [b, t] = [bx + dx, by - len];
    s += `<path d="M${num(b - wd / 2)} ${num(by)}Q${num(b + lean / 2 - wd)} ${num(by - len / 2)} ${num(b + lean)} ${num(t)}Q${num(b + lean / 2 + wd)} ${num(by - len / 2)} ${num(b + wd / 2)} ${num(by)}Z" fill="${c}" stroke="${shade(C.sage, 0.35)}" stroke-width="0.25"/>`;
  }
  return s;
}

// a round braided rug in front of the table: rings of colour, the outer one first
export const RUG = { x: 37, y: 33, r: 14 };
const rug = () => [[1, C.beige], [0.82, C.rose], [0.64, C.cream], [0.46, C.sage], [0.28, C.cream]]
  .map(([k, c]) => disc([RUG.x, RUG.y, 0.02], RUG.r * k, c, k === 1 ? ` stroke="${shade(C.beige, -0.12)}" stroke-width="0.4"` : '')).join('');

/* ---------- the model ---------- */

/** An item drawn at its slot: moved there (and scaled) as a whole. */
function placed(draw, { at, k }) {
  const [sx, sy] = project(at);
  return (p) => `<g transform="translate(${num(sx)} ${num(sy)})${k === 1 ? '' : ` scale(${k})`}">${draw(p)}</g>`;
}

/** The world points of an item's tap area at its slot: the corners of its box, moved and scaled. */
const hitAt = ([w, d, h], { at: [x, y, z], k }) =>
  corners(-w / 2, -d / 2, 0, w, d, h).map(([u, v, t]) => [x + k * u, y + k * v, z + k * t]);

/**
  The room for a list of projects (oldest first, as in src/data/projects.js): the last six
  that have an item, the newest in slot 0. `items` is ITEMS (the tests pass made-up ones).
*/
export function projectsRoom(list, items = ITEMS) {
  const shown = list.filter((pr) => items[pr.slug]).slice(-SLOTS.length).reverse();
  const at = (i) => {
    const pr = shown[i];
    if (!pr) return SPARE[i] ? [{ id: `spare-${i}`, draw: (p) => SPARE[i](p, SLOTS[i].at) }] : [];
    const draw = items[pr.slug];
    if (draw.box?.length !== 3) throw new Error(`rooms/projects: ITEMS["${pr.slug}"] must be item([w, d, h], draw)`);
    return [{ id: `project-${pr.slug}`, slot: i, draw: placed(draw, SLOTS[i]), target: { project: pr.slug }, hit: hitAt(draw.box, SLOTS[i]) }];
  };
  return {
    key: 'projects',
    size: [60, 50, 40],
    window: WINDOW,
    parts: [
      { id: 'picture', draw: picture },
      { id: 'plant', draw: plant },
      { id: 'rug', draw: rug },
      { id: 'shelf', draw: shelf },
      ...at(4), ...at(5), ...at(2), ...at(3),
      { id: 'table', draw: table },
      ...at(1), ...at(0),
    ],
  };
}

export default projectsRoom(projects);

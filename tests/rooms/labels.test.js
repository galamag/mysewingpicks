/*
  The corner labels of the rooms (Tools, Fabrics, Projects): a link's name in a pill in a corner of
  the picture, a dashed leader to a dot on the object (render.js "labels"; the approved mockup of
  2026-10-18). The house and My Setup have none.
*/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { project } from '../../src/lib/anatomy/iso.js';
import { PALETTE, painter } from '../../src/lib/rooms/paint.js';
import { renderRoom, roomParts, minHitFor, esc, labelLayout, wrap, textEm, LABEL, CORNERS, GLYPHS, BREAK } from '../../src/lib/rooms/render.js';
import { renderHouse } from '../../src/lib/rooms/house.js';
import { ROOMS, ROOM_CATEGORY, catalogOf } from '../../src/lib/rooms/rooms.js';
import { checkTargets } from '../../src/lib/rooms/check.js';
import { projectsRoom, ITEMS, SLOTS } from '../../src/lib/rooms/projects.js';
import { categories } from '../../src/data/categories.js';
import { projects } from '../../src/data/projects.js';
import { LOCALES } from '../../src/i18n/index.js';
import { groupTitle, projectText } from '../../src/i18n/content.js';
import {
  THUMB_PX, PHONE_PX, areasOf, labelsOf, ownerAt, ownSquare, inside, inRect, siteResolve,
} from './helpers.js';

/* ---------- geometry ---------- */

const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** Points every `step` units over a rect, its edges included. */
function rectPoints({ x, y, w, h }, step = 0.25) {
  const out = [];
  for (let i = 0; i <= Math.ceil(w / step); i++) {
    for (let j = 0; j <= Math.ceil(h / step); j++) out.push([Math.min(x + i * step, x + w), Math.min(y + j * step, y + h)]);
  }
  return out;
}

/** Points every `step` units along a segment. */
function segmentPoints([ax, ay], [bx, by], step = 0.25) {
  const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step));
  return Array.from({ length: n + 1 }, (_, i) => [ax + ((bx - ax) * i) / n, ay + ((by - ay) * i) / n]);
}

/** Do two segments cross (touching ends do not count)? */
function cross([a, b], [c, d]) {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
}

/* ---------- the helper (render.js) ---------- */

test('textEm: every letter has a width, an unknown one counts as wide', () => {
  assert.ok(textEm('i') < textEm('n') && textEm('n') < textEm('m') && textEm('m') < textEm('Щ'));
  assert.equal(textEm('ŷ'), textEm('Щ'), 'not measured: as wide as the widest');
  assert.equal(textEm('ab'), textEm('a') + textEm('b'));
  // every letter of every name the rooms show today is measured (none falls back to the guess)
  const known = Object.values(GLYPHS).join('');
  const names = LOCALES.flatMap((lang) => [
    ...['tools', 'fabrics'].flatMap((cat) => categories[cat].groups.map((g) => groupTitle(cat, g.id, lang))),
    ...projects.map((p) => projectText(p, lang).title),
  ]);
  for (const name of names) for (const c of name) assert.ok(known.includes(c), `"${c}" of "${name}" is not in GLYPHS`);
});

test('wrap: one line when it fits, else the fewest lines, as even as they can be', () => {
  assert.deepEqual(wrap('Handy helpers', 20), ['Handy helpers']);
  assert.deepEqual(wrap('  Handy   helpers ', 20), ['Handy helpers'], 'spaces squeezed');
  const two = wrap('Batting, stuffing & interfacing', textEm('Batting, stuffing & interfacing') - 1);
  assert.equal(two.length, 2);
  assert.equal(two.join(' '), 'Batting, stuffing & interfacing', 'every word, in order');
  // the narrowest widest line of all the ways to break it in two
  const words = 'Batting, stuffing & interfacing'.split(' ');
  const widest = (lines) => Math.max(...lines.map(textEm));
  for (let j = 1; j < words.length; j++) {
    assert.ok(widest(two) <= widest([words.slice(0, j).join(' '), words.slice(j).join(' ')]) + 1e-9, `break after word ${j}`);
  }
  // nearly as narrow, with the longer first line: chosen (the pyramid of the approved mockup)
  assert.deepEqual(wrap('Молнии, пуговицы и нитки', 11.8), ['Молнии, пуговицы', 'и нитки']);
  // but not when that costs a real widening: "pieds presseurs" stays together
  assert.deepEqual(wrap('Machines et pieds presseurs', 11.8), ['Machines et', 'pieds presseurs']);
  // a word too long for a line gets its own
  assert.deepEqual(wrap('Reißverschlüsse, Knöpfe', 3), ['Reißverschlüsse,', 'Knöpfe']);
  assert.deepEqual(wrap('Stoffe', 1), ['Stoffe']);
  // no line ends in a one-letter word, even where that would be narrower
  for (const name of ['Молнии, пуговицы и нитки', 'Cerniere, bottoni e fili', 'Guata, relleno y entretela', 'Trims, tapes & cords']) {
    const lines = wrap(name, textEm(name) * 0.7);
    assert.equal(lines.length, 2, name);
    assert.ok(lines.slice(0, -1).every((line) => line.split(' ').pop().length > 1), `${name}: ${lines.join(' / ')}`);
  }
  // a no-break space holds its words together
  assert.deepEqual(wrap('Le tote bag en 10\u00a0minutes', 7), ['Le tote bag', 'en 10\u00a0minutes']);
});

const FRAME = [-61.79, -50, 132.25, 115];

test('labelLayout: the pill in its corner, inside the frame; the leader from the dot to the pill', () => {
  const [vx, vy, vw, vh] = FRAME;
  const fs = +(vw * LABEL.font).toFixed(2);
  const m = LABEL.margin * fs;
  const at = [30, 25, 10];
  for (const corner of CORNERS) {
    const { pill, dot, end, lines } = labelLayout('Cutting & measuring', { corner, at }, FRAME);
    assert.deepEqual(lines, ['Cutting & measuring']);
    assert.ok(Math.abs((corner[1] === 'l' ? pill.x - vx : vx + vw - pill.x - pill.w) - m) < 0.02, `${corner}: side margin`);
    assert.ok(Math.abs((corner[0] === 't' ? pill.y - vy : vy + vh - pill.y - pill.h) - m) < 0.02, `${corner}: top / bottom margin`);
    assert.deepEqual(dot, project(at).map((v) => +v.toFixed(2)));
    assert.ok(inRect(pill, end), `${corner}: the leader ends at the pill`);
    assert.ok(pill.w <= vw * LABEL.maxW + 0.01, `${corner}: not wider than maxW`);
  }
  // a long name wraps, and stays within maxW
  const long = labelLayout('Ouatine, rembourrage et entoilage', { corner: 'tl', at }, FRAME);
  assert.equal(long.lines.length, 2);
  assert.ok(long.pill.w <= vw * LABEL.maxW + 0.01);
  assert.ok(long.pill.h > labelLayout('Tissus', { corner: 'tl', at }, FRAME).pill.h, 'two lines are taller');
});

// A toy room: a desk (labelled), a lamp on it (labelled), a chair (decoration).
const toy = {
  key: 'toy',
  size: [60, 50, 40],
  parts: [
    { id: 'desk', draw: (p) => p.box(8, 6, 0, 40, 20, 22, PALETTE.wood), target: { section: 'desk' }, hit: [[8, 6, 0], [48, 26, 22], [48, 6, 22], [8, 26, 22]], label: { corner: 'tr', at: [28, 16, 22] } },
    { id: 'lamp', draw: (p) => p.box(30, 10, 22, 4, 4, 8, PALETTE.gold), target: { section: 'lamp' }, hit: [[32, 12, 26]], label: { corner: 'bl', at: [32, 12, 26] } },
    { id: 'chair', draw: (p) => p.box(24, 30, 0, 10, 10, 12, PALETTE.sage) },
  ],
};
const NAMES = { desk: 'Desk & "chair" <b>', lamp: 'Lamp' };
const toyResolve = (target) => ({ href: `#${target.section}`, label: NAMES[target.section], kind: 'section' });
const unlabelled = (model) => ({ ...model, parts: model.parts.map(({ label, ...part }) => part) });

test('a linked part with a label gets one; the pill is also inside its link', () => {
  const { svg } = renderRoom(toy, { resolve: toyResolve });
  const labels = labelsOf(svg);
  assert.deepEqual(labels.map((l) => l.part), ['desk', 'lamp'], 'in the order of the parts');
  assert.equal(labels[0].text, esc(NAMES.desk), 'the link\'s name, escaped');
  assert.ok(!svg.includes('<b>'));
  const areas = areasOf(svg);
  for (const l of labels) {
    assert.deepEqual(areas.find((a) => a.part === l.part).pads, [l.pill], `${l.part}: the link holds the pill`);
  }
  // labels after the parts, before the links; hidden from screen readers, never in the way of a tap
  assert.ok(svg.lastIndexOf('class="room__part"') < svg.indexOf('class="room__label"'));
  assert.ok(svg.lastIndexOf('class="room__label"') < svg.indexOf('<a class="room__hot"'));
  assert.equal((svg.match(/<g class="room__label"[^>]*aria-hidden="true" pointer-events="none">/g) ?? []).length, 2);
  assert.ok(svg.endsWith('</a>'));
});

test('no label for decoration, an inactive part, or without a frame (the house)', () => {
  const quiet = renderRoom(toy, { resolve: toyResolve, inactive: new Set(['desk']) });
  assert.deepEqual(labelsOf(quiet.svg).map((l) => l.part), ['lamp']);
  assert.ok(!quiet.svg.includes('Desk'), 'no name of an inactive part anywhere');
  assert.equal(labelsOf(renderRoom(toy, { resolve: () => null }).svg).length, 0);
  // labels drawn by roomParts only with a frame: the house's rooms (no frame, nothing linked) are as before
  const p = () => painter('house');
  const bare = roomParts(toy, p(), () => null);
  assert.deepEqual(bare, roomParts(unlabelled(toy), p(), () => null));
  assert.equal(roomParts(toy, p(), toyResolve).labels, '', 'linked, but no frame: no label');
  assert.ok(!roomParts(toy, p(), toyResolve).hits.includes('room__pad'));
});

test('a room without labels draws exactly as before', () => {
  // the same room with and without `label`: without links nothing changes at all
  assert.equal(renderRoom(toy, { resolve: () => null }).svg, renderRoom(unlabelled(toy), { resolve: () => null }).svg);
  // with links only the labels and the pills in the links are added
  const withLabels = renderRoom(toy, { resolve: toyResolve }).svg
    .replace(/<g class="room__label".*?<\/g>/g, '').replace(/<rect class="room__pad"[^>]*\/>/g, '');
  assert.equal(withLabels, renderRoom(unlabelled(toy), { resolve: toyResolve }).svg);
});

test('a label in the wrong place says what is wrong', () => {
  const room = (parts) => ({ ...toy, parts });
  const [desk, lamp, chair] = toy.parts;
  assert.throws(() => renderRoom(room([desk, { ...chair, label: { corner: 'tl', at: [1, 2, 3] } }]), { resolve: toyResolve }),
    { message: 'rooms/toy: part "chair" has a label but no target' });
  assert.throws(() => renderRoom(room([{ ...desk, label: { corner: 'top', at: [1, 2, 3] } }]), { resolve: toyResolve }),
    { message: 'rooms/toy: part "desk": label corner must be one of tl, tr, bl, br' });
  assert.throws(() => renderRoom(room([{ ...desk, label: { corner: 'tl' } }]), { resolve: toyResolve }),
    { message: 'rooms/toy: part "desk": label needs at: [x, y, z]' });
  assert.throws(() => renderRoom(room([desk, { ...lamp, label: { corner: 'tr', at: [1, 2, 3] } }]), { resolve: toyResolve }),
    { message: 'rooms/toy: parts "desk" and "lamp" share the label corner "tr"' });
  // checked even where nothing is linked (the house): a broken model fails every build
  assert.throws(() => roomParts(room([desk, { ...lamp, label: { corner: 'tr', at: [1, 2, 3] } }]), painter('house'), () => null), /share the label corner/);
});

/* ---------- the rooms of the site ---------- */

const LABELLED = ['tools', 'fabrics', 'projects'];

/** A room as the narrowest phone gets it (Room.astro: minHitFor), with the site's names in `lang`. */
const drawn = (model, resolve) => renderRoom(model, { resolve, minHit: minHitFor(model), inactive: checkTargets(model, catalogOf(ROOM_CATEGORY[model.key])).inactive });

/**
  Everything a label promises, in one drawn room:
    one label per linked part that has `label`, showing the link's name in at most two lines; the
    pill in the picture, clear of the other pills and of every other link's tap area; the pill is in
    its own link (a tap on it opens what the object opens); the dot on the object, inside its tap
    area; leaders that do not cross, nor run over another link's tap area (another item, zone).
  → the labels, for the log
*/
function checkRoom(name, model, resolve) {
  const { svg, viewBox: [vx, vy, vw, vh], hots } = renderRoom(model, { resolve, minHit: minHitFor(model) });
  const areas = areasOf(svg);
  const labels = labelsOf(svg);
  const linked = model.parts.filter((part) => part.label && hots.some((h) => h.part === part.id));
  assert.ok(linked.length > 0, `${name}: nothing to check`);
  assert.deepEqual(labels.map((l) => l.part).sort(), linked.map((part) => part.id).sort(), `${name}: one label per labelled link`);

  for (const l of labels) {
    const where = `${name} ${l.part}`;
    const hot = hots.find((h) => h.part === l.part);
    assert.equal(l.text, esc(hot.label.split(BREAK).join(' ')), `${where}: shows the link's name`);
    assert.ok(l.lines.length <= 2, `${where}: ${l.lines.length} lines`);
    const { x, y, w, h } = l.pill;
    assert.ok(x >= vx && y >= vy && x + w <= vx + vw && y + h <= vy + vh, `${where}: pill outside the picture`);
    const own = areas.find((a) => a.part === l.part);
    assert.deepEqual(own.pads, [l.pill], `${where}: the pill is in its own link`);
    assert.ok(inside(own.poly, l.dot), `${where}: the dot is not on its own tap area`);
    assert.deepEqual(l.start, l.dot, `${where}: the leader starts at the dot`);
    assert.ok(inRect(l.pill, l.end), `${where}: the leader ends at the pill`);
    // a tap on the pill — its middle, anywhere on it — opens its own link
    assert.equal(ownerAt(areas, [x + w / 2, y + h / 2]), l.part, `${where}: a tap in the middle of its pill`);
    for (const pt of rectPoints(l.pill, 0.5)) assert.equal(ownerAt(areas, pt), l.part, `${where}: a tap on its pill at ${pt}`);
    for (const other of areas.filter((a) => a.part !== l.part)) {
      assert.ok(!rectPoints(l.pill).some((pt) => inside(other.poly, pt)), `${where}: the pill covers ${other.part}`);
      const over = segmentPoints(l.dot, l.end).filter((pt) => inside(other.poly, pt) && !inside(own.poly, pt));
      assert.equal(over.length, 0, `${where}: the leader runs over ${other.part}`);
    }
  }
  for (const [i, a] of labels.entries()) {
    for (const b of labels.slice(i + 1)) {
      assert.ok(!overlap(a.pill, b.pill), `${name}: pills of ${a.part} and ${b.part} overlap`);
      assert.ok(!cross([a.dot, a.end], [b.dot, b.end]), `${name}: leaders of ${a.part} and ${b.part} cross`);
    }
  }
  // every link keeps a thumb's square of its own on its object, the pills counted
  const thumb = (THUMB_PX * vw) / PHONE_PX;
  for (const [i, a] of areas.entries()) assert.ok(ownSquare(areas, i) >= thumb, `${name} ${a.part}: own square below 44 px`);
  return { labels, vw };
}

test('Tools, Fabrics and Projects: every link is labelled in every language, nothing collides', () => {
  for (const key of LABELLED) {
    const model = ROOMS[key];
    for (const lang of LOCALES) {
      const { labels, vw } = checkRoom(`${key}/${lang}`, model, siteResolve(ROOM_CATEGORY[key], lang));
      if (lang === 'en' || lang === 'ru' || lang === 'de' || lang === 'fr') {
        console.log(`  ${key}/${lang}: ${labels.map((l) => `${l.lines.join(' / ')} ${Math.round((l.pill.w / vw) * 100)}%`).join(', ')}`);
      }
    }
  }
});

test('every zone of Tools and Fabrics has a label in a corner of its own, as pinned in the model', () => {
  const PINNED = {
    tools: { 'ironing-board': 'tl', 'sewing-table': 'tr', 'cutting-table': 'bl', shelf: 'br' },
    fabrics: { 'batting-rolls': 'tl', 'fabric-shelf': 'tr', 'notions-table': 'bl', 'trims-cabinet': 'br' },
  };
  for (const [key, corners] of Object.entries(PINNED)) {
    const zones = ROOMS[key].parts.filter((part) => part.target);
    assert.deepEqual(Object.fromEntries(zones.map((part) => [part.id, part.label?.corner])), corners, key);
  }
  // setup opens cards, the house has its own names: no labels there
  assert.ok(ROOMS.setup.parts.every((part) => !part.label), 'no labels in My Setup');
});

test('an empty section loses its label with its link', () => {
  for (const key of ['tools', 'fabrics']) {
    const model = ROOMS[key];
    const catalog = catalogOf(ROOM_CATEGORY[key]);
    for (const zone of model.parts.filter((part) => part.target)) {
      const { inactive } = checkTargets(model, { ...catalog, liveSections: catalog.liveSections.filter((id) => id !== zone.target.section) });
      const { svg } = renderRoom(model, { resolve: siteResolve(key, 'en'), inactive, minHit: minHitFor(model) });
      const labels = labelsOf(svg);
      assert.equal(labels.length, 3, `${key} without ${zone.target.section}`);
      assert.ok(!labels.some((l) => l.part === zone.id), `${key}: no label for the empty ${zone.target.section}`);
      assert.ok(!svg.includes(esc(groupTitle(key, zone.target.section, 'en'))), `${key}: its name is nowhere in the picture`);
    }
  }
});

test('with the build\'s catalogue (as Room.astro draws them) every live zone and item is labelled', () => {
  for (const key of LABELLED) {
    const model = ROOMS[key];
    const { svg, hots } = drawn(model, siteResolve(ROOM_CATEGORY[key], 'en'));
    assert.equal(labelsOf(svg).length, hots.filter((h) => model.parts.find((part) => part.id === h.part).label).length, key);
  }
});

/* ---------- Projects: four corners for the four newest ---------- */

// made-up projects with long real names, every slot taken: the shelf is labelled and checked too
const LONG = ['Новогодняя корзинка из ткани', 'Un cestino di stoffa per Natale', 'Une panière en tissu pour Noël', 'A fabric basket for Christmas', 'Una cesta de tela para Navidad', 'Stoffkorb für Weihnachten', 'Le tote bag en 10 minutes'];
const FAKE = LONG.map((_, i) => `p${i + 1}`);
const NAMED = Object.fromEntries(FAKE.map((slug, i) => [slug, LONG[i]]));
const fakeItems = (bySlot) => Object.fromEntries(FAKE.map((slug, i) => [slug, ITEMS[bySlot[i % bySlot.length]]]));

test('Projects: the four newest are labelled (slots 0–3), the two oldest on the shelf are not', () => {
  for (const n of [1, 2, 3, 4, 5, 6, 7]) {
    const model = projectsRoom(FAKE.slice(-n).map((slug) => ({ slug })), fakeItems(Object.keys(ITEMS)));
    const items = model.parts.filter((part) => part.target);
    assert.deepEqual(items.filter((part) => part.label).map((part) => part.slot).sort(), items.map((part) => part.slot).filter((s) => s < 4).sort(), `${n} projects`);
    const { svg } = renderRoom(model, { resolve: siteResolve(null, 'en', NAMED), minHit: minHitFor(model) });
    assert.equal(labelsOf(svg).length, Math.min(n, 4), `${n} projects: labels`);
  }
  assert.equal(SLOTS.length, 6);
  assert.deepEqual(SLOTS.map((s) => s.corner ?? null).slice(4), [null, null], 'slots 4 and 5: no corner');
  assert.equal(new Set(SLOTS.slice(0, 4).map((s) => s.corner)).size, 4, 'slots 0–3: four different corners');
});

test('Projects with every slot taken: the labels still fit and keep clear of each other and of the items', () => {
  const kinds = Object.keys(ITEMS);
  for (const order of [kinds, [...kinds].reverse()]) {
    const model = projectsRoom(FAKE.map((slug) => ({ slug })), fakeItems(order));
    checkRoom(`projects full ${order.join('+')}`, model, siteResolve(null, 'en', NAMED));
  }
});

/* ---------- the house and My Setup do not change ---------- */

test('the house draws no room labels, and its drawing does not depend on them', () => {
  const OPTS = {
    prefix: 'house',
    labels: { projects: 'P', guides: 'G', fabrics: 'F', setup: 'S', about: 'A', tools: 'T' },
    hrefs: { projects: '/p', guides: '/g', fabrics: '/f', setup: '/s', about: '/a', tools: '/t' },
  };
  const { svg } = renderHouse(ROOMS, OPTS);
  assert.ok(!svg.includes('room__label') && !svg.includes('room__pad'));
  const plain = Object.fromEntries(Object.entries(ROOMS).map(([key, model]) => [key, unlabelled(model)]));
  assert.equal(svg, renderHouse(plain, OPTS).svg, 'byte for byte the house without labels');
});

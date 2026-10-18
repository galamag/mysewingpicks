import { test } from 'node:test';
import assert from 'node:assert/strict';
import projectsModel, { projectsRoom, ITEMS, SLOTS, PICTURE, PLANT, RUG } from '../../src/lib/rooms/projects.js';
import { ROOMS, ROOM_CATEGORY, catalogOf } from '../../src/lib/rooms/rooms.js';
import { checkTargets } from '../../src/lib/rooms/check.js';
import { renderRoom } from '../../src/lib/rooms/render.js';
import { projects } from '../../src/data/projects.js';
import { pageUrl } from '../../src/i18n/index.js';
import { onPhone, linked, glassOf, ownSquare, unlink } from './helpers.js';

const toPage = (target) => ({ href: `/projects/${target.project}.html`, label: target.project, kind: 'page' });
const shown = (model) => model.parts.filter((part) => part.target).map((part) => part.target.project);

// Seven made-up projects, each with an item (a real item's drawing under a made-up slug): the room
// with every slot taken, so the shelf is drawn and checked too, not only the table.
const FAKE = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
const fakeItems = Object.fromEntries(FAKE.map((slug, i) => [slug, Object.values(ITEMS)[i % Object.keys(ITEMS).length]]));
const full = projectsRoom(FAKE.map((slug) => ({ slug })), fakeItems);

/** A full room with the given real items in slots 0…5 (made-up slugs, the newest — slot 0 — last). */
const roomOf = (bySlot) => projectsRoom(bySlot.map((_, i) => ({ slug: `s${i}` })).reverse(), Object.fromEntries(bySlot.map((slug, i) => [`s${i}`, ITEMS[slug]])));
// the hardest mixes for the shelf: the shortest item on its top over the tallest inside, and back
const [short, tall] = (() => { const h = Object.keys(ITEMS).sort((a, b) => ITEMS[a].box[2] - ITEMS[b].box[2]); return [h[0], h[h.length - 1]]; })();
const MIXES = [['full', full], ['short over tall', roomOf([tall, short, short, short, tall, tall])], ['tall over short', roomOf([short, tall, tall, tall, short, short])]];

test('projects without an item are skipped', () => {
  const list = [{ slug: 'tote-bag' }, { slug: 'no-item-yet' }, { slug: 'fabric-basket' }];
  let model;
  assert.doesNotThrow(() => { model = projectsRoom(list); });
  assert.deepEqual(shown(model).sort(), ['fabric-basket', 'tote-bag']);
  assert.ok(!model.parts.some((part) => part.id.includes('no-item-yet')), 'not drawn at all');
  // a room with no project that has an item is just the furniture: no tap areas, no error
  const empty = projectsRoom([{ slug: 'no-item-yet' }]);
  assert.deepEqual(shown(empty), []);
  assert.deepEqual(renderRoom(empty, { resolve: toPage }).hots, []);
});

test('an item without its box says what is wrong', () => {
  const list = [{ slug: 'x' }];
  const draw = () => '';
  assert.throws(() => projectsRoom(list, { x: draw }), { message: 'rooms/projects: ITEMS["x"] must be item([w, d, h], draw)' });
  assert.throws(() => projectsRoom(list, { x: Object.assign(() => '', { box: [1, 2] }) }), /ITEMS\["x"\] must be item/);
  assert.doesNotThrow(() => projectsRoom(list, { x: Object.assign(draw, { box: [1, 2, 3] }) }));
});

test('at most six, newest first', () => {
  assert.equal(SLOTS.length, 6, 'six places: two on the table, four on the shelf');
  const placed = full.parts.filter((part) => part.target);
  assert.equal(placed.length, 6);
  // the newest (the last in the array) is in slot 0, the oldest of the six in slot 5, p1 is left out
  const bySlot = [...placed].sort((a, b) => a.slot - b.slot).map((part) => part.target.project);
  assert.deepEqual(bySlot, ['p7', 'p6', 'p5', 'p4', 'p3', 'p2']);
  // slot 0 is the front place on the table, slot 1 the back one; the shelf places are smaller
  const [front, back, ...shelf] = SLOTS;
  assert.equal(front.at[2], back.at[2], 'both on the table top');
  assert.ok(front.at[0] + front.at[1] > back.at[0] + back.at[1], 'slot 0 is nearer the viewer');
  assert.ok(shelf.every((s) => s.k < front.k), 'items on the shelf are smaller');
});

test('every real project with an item links to its page', () => {
  // the room of the build: the last six real projects that have an item (a new project with an
  // item joins it, one without stays out — neither breaks this test)
  const real = projects.filter((p) => ITEMS[p.slug]).slice(-SLOTS.length);
  assert.ok(['tote-bag', 'fabric-basket'].every((slug) => ITEMS[slug]), 'both projects of today have an item');
  assert.deepEqual(shown(projectsModel).sort(), real.map((p) => p.slug).sort());
  // the newest real project stands in front on the table
  const first = projectsModel.parts.find((part) => part.slot === 0);
  assert.equal(first.target.project, real[real.length - 1].slug);

  const { inactive } = checkTargets(projectsModel, catalogOf(ROOM_CATEGORY.projects));
  assert.deepEqual([...inactive], []);
  for (const lang of ['en', 'ru', 'de']) {
    const resolve = (target) => ({ href: pageUrl(`project/${target.project}`, lang), label: target.project, kind: 'page' });
    const { hots } = renderRoom(projectsModel, { resolve });
    const prefix = lang === 'en' ? '' : `/${lang}`;
    assert.deepEqual(hots.map((h) => h.href).sort(), real.map((p) => `${prefix}/projects/${p.slug}.html`).sort(), lang);
  }
});

test('projects is registered, has no category', () => {
  assert.equal(projectsModel.key, 'projects');
  assert.equal(ROOMS.projects, projectsModel);
  assert.equal(ROOM_CATEGORY.projects, null);
  assert.deepEqual(projectsModel.size.slice(0, 2), [60, 50], 'one cell of the house (Task 9: cell [60, 50])');
});

test('the room links only to project pages: no Amazon, no products, no lettering', () => {
  for (const model of [projectsModel, full]) {
    const { svg, hots } = renderRoom(model, { resolve: toPage });
    assert.ok(hots.every((h) => h.kind === 'page' && h.href.startsWith('/projects/')));
    assert.ok(!svg.includes('amazon.'), 'nothing in the drawing links to Amazon');
    assert.ok(!svg.includes('#product-'), 'no product cards here');
    assert.ok(!unlink(svg).includes('<text'), 'no names or lettering drawn on anything (the corner labels aside)');
  }
  for (const [slug, draw] of Object.entries(ITEMS)) {
    assert.equal(typeof draw, 'function', slug);
    assert.equal(draw.box.length, 3, `${slug}: the box it fills, [w, d, h]`);
  }
});

/* ---------- tap areas on the narrowest phone ---------- */

test('every item keeps a thumb-size square of its own on a 320 px phone, on the table and on the shelf', () => {
  for (const [name, model] of [['today', projectsModel], ...MIXES]) {
    const { areas, thumb, minHit } = onPhone(model, toPage);
    assert.equal(minHit, Math.ceil(thumb), 'minHitFor: the whole units that hold a thumb');
    const sides = areas.map((a, i) => [a.href, ownSquare(areas, i)]);
    for (const [href, side] of sides) {
      assert.ok(side >= thumb, `${name} ${href}: own square ${side.toFixed(1)} < ${thumb.toFixed(1)} units (44 px)`);
    }
    console.log(`  own squares at 320 px (${name}): ${sides.map(([h, side]) => `${h.slice(10, -5)} ${Math.floor((side / thumb) * 44)} px`).join(', ')}`);
  }
});

// Decoration must not turn into a link: sample its surfaces against the printed tap areas.
test('the window, the picture, the plant and the rug stay clear of the tap areas, with every slot taken', () => {
  for (const [name, model] of [['today', projectsModel], ...MIXES]) {
    const { areas } = onPhone(model, toPage);
    assert.ok(model.window, 'the room has a window to keep clear');
    const glass = linked(areas, glassOf(model.window));
    const { x0, x1, z: [z0, z1] } = PICTURE;
    const picture = linked(areas, (u, v) => [x0 + (x1 - x0) * u, 0, z0 + (z1 - z0) * v]);
    const { x, y, s, h, leaves: tall } = PLANT;
    assert.ok([x, y, s, h, tall].every(Number.isFinite), 'the plant is where the test looks');
    // the two sides of the pot in sight, then the leaves: a band facing the viewer, as wide as the
    // pot and a bit, from the soil to the tip of the longest leaf
    const pot = linked(areas, (u, v) => (u < 0.5 ? [x + s * 2 * u, y + s, h * v] : [x + s, y + s * (2 - 2 * u), h * v]));
    const leaves = linked(areas, (u, v) => [x + s / 2 + (u - 0.5) * s * 0.8, y + s / 2 - (u - 0.5) * s * 0.8, h + tall * v]);
    const rug = linked(areas, (u, v) => [RUG.x + RUG.r * v * Math.cos(2 * Math.PI * u), RUG.y + RUG.r * v * Math.sin(2 * Math.PI * u), 0]);
    const shares = [['window', glass], ['picture', picture], ['pot', pot], ['leaves', leaves], ['rug', rug]];
    for (const [what, share] of shares) {
      assert.ok(share <= 0.15, `${name}: ${what} ${(share * 100).toFixed(1)}% linked`);
    }
    console.log(`  linked (${name}): ${shares.map(([what, share]) => `${what} ${(share * 100).toFixed(1)}%`).join(', ')}`);
  }
});

test('the things on the empty shelf places stay clear of the tap areas', () => {
  // two projects (as today): only the table is taken, the four shelf places hold decoration
  const two = projectsRoom(FAKE.slice(-2).map((slug) => ({ slug })), fakeItems);
  const { areas } = onPhone(two, toPage);
  const empty = SLOTS.map((slot, i) => [slot, i]).filter(([, i]) => !two.parts.some((part) => part.slot === i));
  assert.deepEqual(empty.map(([, i]) => i), [2, 3, 4, 5]);
  assert.deepEqual(two.parts.filter((part) => part.id.startsWith('spare-')).map((part) => part.id).sort(), ['spare-2', 'spare-3', 'spare-4', 'spare-5']);
  assert.ok(!full.parts.some((part) => part.id.startsWith('spare-')), 'a taken place holds its item only');
  for (const [{ at: [x, y, z] }, i] of empty) {
    // the front of a 6 × 6 × 8 box round the place, as the room shows it
    const front = linked(areas, (u, v) => [x - 3 + 6 * u, y + 3, z + 8 * v]);
    const side = linked(areas, (u, v) => [x + 3, y - 3 + 6 * u, z + 8 * v]);
    assert.ok(front <= 0.15 && side <= 0.15, `place ${i}: ${(front * 100).toFixed(1)}% / ${(side * 100).toFixed(1)}% linked`);
    console.log(`  linked: place ${i} front ${(front * 100).toFixed(1)}%, side ${(side * 100).toFixed(1)}%`);
  }
});

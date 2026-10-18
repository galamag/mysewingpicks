import { test } from 'node:test';
import assert from 'node:assert/strict';
import guides, { BOOKSHELF, STOOLS, RUG } from '../../src/lib/rooms/guides.js';
import { ROOMS, ROOM_CATEGORY, catalogOf } from '../../src/lib/rooms/rooms.js';
import { checkTargets } from '../../src/lib/rooms/check.js';
import { renderRoom, minHitFor, esc, GLYPHS } from '../../src/lib/rooms/render.js';
import { GUIDE_GROUPS, liveGroups, guides as guideList } from '../../src/data/guides.js';
import { LOCALES, t } from '../../src/i18n/index.js';
import {
  onPhone, linked, glassOf, ownSquare, unlink, areasOf, labelsOf, ownerAt, inside, inRect, siteResolve, THUMB_PX, PHONE_PX,
} from './helpers.js';

// The classroom of /guides.html (spec «Гайды», 8): a zone per guide group, pinned here with its label corner.
const ZONES = { machine: 'bl', cutting: 'br', construction: 'tr', patchwork: 'tl' };

const toSection = (target) => ({ href: `#${target.section}`, label: target.section, kind: 'section' });
const zoneOf = (group) => guides.parts.find((part) => part.target?.section === group);

test('guides zones point at the guide groups', () => {
  const zones = guides.parts.filter((part) => part.target);
  assert.ok(zones.every((part) => Object.keys(part.target).join() === 'section'), 'zones link to groups only');
  assert.deepEqual(zones.map((part) => part.target.section).sort(), [...GUIDE_GROUPS].sort(), 'one zone per group');
  assert.deepEqual(Object.keys(ZONES).sort(), [...GUIDE_GROUPS].sort(), 'the test pins every group');
  for (const [group, corner] of Object.entries(ZONES)) assert.equal(zoneOf(group).label?.corner, corner, `${group}: label corner`);
});

test('guides is registered as a house cell, its catalogue is the guide groups', () => {
  assert.equal(guides.key, 'guides');
  assert.equal(ROOMS.guides, guides);
  assert.equal(ROOM_CATEGORY.guides, 'guides');
  assert.deepEqual(guides.size, [60, 50, 40], 'one cell of the house');
  const catalog = catalogOf('guides');
  assert.equal(catalog.category, 'guides');
  assert.deepEqual(catalog.allSections, GUIDE_GROUPS);
  assert.deepEqual(catalog.liveSections, liveGroups(guideList));
  assert.ok(catalog.productIds instanceof Map && catalog.productIds.size > 0, 'products as for any room');
  assert.ok(catalog.projectSlugs.length > 0, 'projects as for any room');
  assert.doesNotThrow(() => checkTargets(guides, catalog));
});

test('the design wall and the window are on the back wall, the outer wall of the house', () => {
  // In the house (stage 3) this room sits in the middle at the back: its back wall (y = 0) is the
  // house's outer wall, its left wall a low partition — nothing hangs there.
  const wall = zoneOf('patchwork');
  assert.ok(wall.hit.every(([, y]) => y <= 1), 'the blocks are pinned to y = 0');
  assert.equal(guides.window?.wall, 'back');
});

test('empty group is decoration', () => {
  const catalog = catalogOf('guides');
  const { inactive } = checkTargets(guides, { ...catalog, liveSections: ['construction'] });
  const others = GUIDE_GROUPS.filter((g) => g !== 'construction').map((g) => zoneOf(g).id);
  assert.deepEqual([...inactive].sort(), others.sort());

  const { svg, hots } = renderRoom(guides, { resolve: toSection, inactive });
  assert.deepEqual(hots.map((h) => h.href), ['#construction']);
  for (const group of GUIDE_GROUPS.filter((g) => g !== 'construction')) {
    assert.ok(!svg.includes(`href="#${group}"`), `${group}: no anchor into nowhere`);
    assert.ok(!svg.includes(`data-part="${zoneOf(group).id}"`), `${group}: the zone is plain decoration`);
  }
  assert.deepEqual(labelsOf(svg).map((l) => l.part), [zoneOf('construction').id], 'only the live zone is labelled');
  // …and the drawing stays: without the links and their groups the room is the all-decoration room
  assert.equal(unlink(svg), renderRoom(guides, { resolve: () => null }).svg);

  // a snapshot of the guides today, not a rule: one guide, in construction (update when a group fills)
  assert.deepEqual([...checkTargets(guides, catalog).inactive].sort(), others.sort());
});

test('guides draws one tap area per group, nothing links to Amazon, no lettering', () => {
  const { svg, hots } = renderRoom(guides, { resolve: toSection });
  assert.deepEqual(hots.map((h) => h.href).sort(), GUIDE_GROUPS.map((id) => `#${id}`).sort());
  assert.ok(hots.every((h) => h.kind === 'section'));
  assert.ok(!svg.includes('amazon.'), 'nothing in the drawing links to Amazon');
  assert.ok(!svg.includes('#product-'), 'zones, not items');
  assert.ok(!unlink(svg).includes('<text'), 'no names or lettering drawn on anything (the corner labels aside)');
});

/* ---------- tap areas on the narrowest phone ---------- */

test('every zone is a thumb on a 320 px phone', () => {
  const { areas, thumb, minHit } = onPhone(guides, toSection);
  assert.equal(minHit, Math.ceil(thumb), 'minHitFor: the whole units that hold a thumb');
  assert.equal(areas.length, GUIDE_GROUPS.length);
  const sides = areas.map((a, i) => [a.href, ownSquare(areas, i)]);
  for (const [href, side] of sides) {
    assert.ok(side >= thumb, `${href}: own square ${side.toFixed(1)} < ${thumb.toFixed(1)} units (44 px)`);
  }
  console.log(`  own squares at 320 px: ${sides.map(([h, side]) => `${h.slice(1)} ${Math.floor((side / thumb) * 44)} px`).join(', ')}`);
});

/* ---------- labels ---------- */

const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
function rectPoints({ x, y, w, h }, step = 0.25) {
  const out = [];
  for (let i = 0; i <= Math.ceil(w / step); i++) {
    for (let j = 0; j <= Math.ceil(h / step); j++) out.push([Math.min(x + i * step, x + w), Math.min(y + j * step, y + h)]);
  }
  return out;
}
function segmentPoints([ax, ay], [bx, by], step = 0.25) {
  const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step));
  return Array.from({ length: n + 1 }, (_, i) => [ax + ((bx - ax) * i) / n, ay + ((by - ay) * i) / n]);
}
function cross([a, b], [c, d]) {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
}

test('labels fit and do not overlap', () => {
  // every letter of every group's title is measured (none falls back to the wide guess)
  const known = Object.values(GLYPHS).join('');
  for (const lang of LOCALES) {
    for (const group of GUIDE_GROUPS) {
      const name = t(lang).pages.guides.groups[group].title;
      for (const c of name) assert.ok(known.includes(c), `${lang}: "${c}" of "${name}" is not in GLYPHS`);
    }
  }
  for (const lang of LOCALES) {
    // every group live (as the room will be once each has a guide), the names as Room.astro gives them
    const { svg, viewBox: [vx, vy, vw, vh], hots } = renderRoom(guides, { resolve: siteResolve('guides', lang), minHit: minHitFor(guides) });
    const areas = areasOf(svg);
    const labels = labelsOf(svg);
    assert.equal(labels.length, GUIDE_GROUPS.length, `${lang}: a label per zone`);
    for (const l of labels) {
      const where = `${lang} ${l.part}`;
      const hot = hots.find((h) => h.part === l.part);
      const group = guides.parts.find((part) => part.id === l.part).target.section;
      assert.equal(hot.label, t(lang).pages.guides.groups[group].title, `${where}: the group's title`);
      assert.equal(l.text, esc(hot.label), `${where}: shows the link's name`);
      assert.equal(l.lines.length, 1, `${where}: one line`);
      const { x, y, w, h } = l.pill;
      assert.ok(x >= vx && y >= vy && x + w <= vx + vw && y + h <= vy + vh, `${where}: pill outside the picture`);
      const own = areas.find((a) => a.part === l.part);
      assert.deepEqual(own.pads, [l.pill], `${where}: the pill is in its own link`);
      assert.ok(inside(own.poly, l.dot), `${where}: the dot is not on its own tap area`);
      assert.deepEqual(l.start, l.dot, `${where}: the leader starts at the dot`);
      assert.ok(inRect(l.pill, l.end), `${where}: the leader ends at the pill`);
      for (const pt of rectPoints(l.pill, 0.5)) assert.equal(ownerAt(areas, pt), l.part, `${where}: a tap on its pill at ${pt}`);
      for (const other of areas.filter((a) => a.part !== l.part)) {
        assert.ok(!rectPoints(l.pill).some((pt) => inside(other.poly, pt)), `${where}: the pill covers ${other.part}`);
        const over = segmentPoints(l.dot, l.end).filter((pt) => inside(other.poly, pt) && !inside(own.poly, pt));
        assert.equal(over.length, 0, `${where}: the leader runs over ${other.part}`);
      }
    }
    for (const [i, a] of labels.entries()) {
      for (const b of labels.slice(i + 1)) {
        assert.ok(!overlap(a.pill, b.pill), `${lang}: pills of ${a.part} and ${b.part} overlap`);
        assert.ok(!cross([a.dot, a.end], [b.dot, b.end]), `${lang}: leaders of ${a.part} and ${b.part} cross`);
      }
    }
    const thumb = (THUMB_PX * vw) / PHONE_PX;
    for (const [i, a] of areas.entries()) assert.ok(ownSquare(areas, i) >= thumb, `${lang} ${a.part}: own square below 44 px`);
    if (lang === 'en' || lang === 'ru') console.log(`  ${lang}: ${labels.map((l) => `${l.text} ${Math.round((l.pill.w / vw) * 100)}%`).join(', ')}`);
  }
});

/* ---------- decoration ---------- */

// Decoration must not turn into a link: sample its surfaces against the printed tap areas.
test('decor stays outside tap areas', () => {
  const { areas } = onPhone(guides, toSection);
  const shares = [['window', linked(areas, glassOf(guides.window))]];
  {
    const { x, y, w, d, h } = BOOKSHELF;
    shares.push(['bookshelf front', linked(areas, (u, v) => [x + w * u, y + d, h * v])]);
    shares.push(['bookshelf side', linked(areas, (u, v) => [x + w, y + d * u, h * v])]);
    shares.push(['bookshelf top', linked(areas, (u, v) => [x + w * u, y + d * v, h])]);
  }
  for (const [i, { x, y, r, h }] of STOOLS.entries()) {
    shares.push([`stool ${i + 1} seat`, linked(areas, (u, v) => [x + r * v * Math.cos(2 * Math.PI * u), y + r * v * Math.sin(2 * Math.PI * u), h])]);
    shares.push([`stool ${i + 1} legs`, linked(areas, (u, v) => [x + r * 0.7 * (u - 0.5), y + r * 0.7 * (0.5 - u), h * v])]);
  }
  {
    // an oval on the floor (u around, v out from the middle)
    const { x, y, rx, ry } = RUG;
    shares.push(['rug', linked(areas, (u, v) => [x + rx * v * Math.cos(2 * Math.PI * u), y + ry * v * Math.sin(2 * Math.PI * u), 0])]);
  }
  for (const [name, share] of shares) assert.ok(share <= 0.15, `${name} ${(share * 100).toFixed(1)}% linked`);
  console.log(`  linked: ${shares.map(([name, share]) => `${name} ${(share * 100).toFixed(1)}%`).join(', ')}`);
});

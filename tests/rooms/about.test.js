import { test } from 'node:test';
import assert from 'node:assert/strict';
import { project } from '../../src/lib/anatomy/iso.js';
import { PALETTE, painter, num } from '../../src/lib/rooms/paint.js';
import { renderRoom, minHitFor, hull } from '../../src/lib/rooms/render.js';
import { checkTargets } from '../../src/lib/rooms/check.js';
import { HOUSE } from '../../src/lib/rooms/house.js';
import about from '../../src/lib/rooms/about.js';
import { ROOMS, ROOM_CATEGORY, catalogOf } from '../../src/lib/rooms/rooms.js';
import { inside } from './helpers.js';

// The maker's corner of /about.html (spec «Гайды», 9): an illustration, no links. The spec's list,
// one part each (the patchwork throw is on the armchair, the cup and the photo frame on the side table).
const PARTS = ['rug', 'lamp', 'armchair', 'side-table', 'screen', 'basket', 'plant'];

// a resolver that would link anything it is asked about: the room must not ask
const anything = () => ({ href: '#anything', label: 'Anything', kind: 'section' });

test('about: nothing links', () => {
  assert.deepEqual(about.parts.map((part) => part.id).sort(), [...PARTS].sort(), 'the spec\'s list');
  for (const part of about.parts) {
    assert.equal(part.target, undefined, `${part.id}: no target`);
    assert.equal(part.label, undefined, `${part.id}: no label`);
  }
  const { svg, hots } = renderRoom(about, { resolve: anything, minHit: minHitFor(about) });
  assert.deepEqual(hots, []);
  for (const bit of ['room__hot', 'room__part', 'room__label', '<a', 'href=']) assert.ok(!svg.includes(bit), `no ${bit}`);
  assert.ok(!svg.includes('<text'), 'no lettering');
  assert.ok(!svg.includes('amazon.'), 'nothing links to Amazon');
  // no catalogue: the build's check passes with nothing to check
  assert.equal(ROOM_CATEGORY.about, null);
  assert.equal(checkTargets(about, catalogOf(ROOM_CATEGORY.about)).inactive.size, 0);
});

test('about: a house cell', () => {
  assert.equal(about.key, 'about');
  assert.equal(ROOMS.about, about);
  assert.deepEqual(about.size, [60, 50, 40]);
  assert.deepEqual(about.size, [...HOUSE.cell, HOUSE.wallH], 'as big as a cell of the house');
  // in the house its furniture must stay in its own cell
  const [w, d, h] = about.size;
  for (const part of about.parts) {
    for (const [x, y, z] of part.hit ?? []) {
      assert.ok(x >= 0 && x <= w && y >= 0 && y <= d && z >= 0 && z <= h, `${part.id}: ${[x, y, z]} outside the room`);
    }
  }
});

test('about: window on an outer wall', () => {
  // In the house (stage 3) this room is in the front middle, with no outer wall: the house hides the
  // window (house.js outerWindow). On its own page it hangs on the left wall.
  const win = about.window;
  assert.ok(['left', 'back'].includes(win?.wall), 'left | back');
  assert.equal(win.wall, 'left');
  const along = win.wall === 'left' ? about.size[1] : about.size[0];
  assert.ok(win.from >= 0 && win.from < win.to && win.to <= along, 'on the wall');
  assert.ok(win.z[0] > 0 && win.z[0] < win.z[1] && win.z[1] < about.size[2], 'under the top of the wall');
  const { svg } = renderRoom(about, {});
  assert.ok(svg.includes(`fill="${PALETTE.glass}"`), 'drawn');
});

/* ---------- the furniture in the house ---------- */

/**
  The screen points of a drawing: the corners of its polygons and rects, the ends of its lines, the
  points of its paths, the extremes of its circles and ellipses. Blurred shadows on the floor aside
  (the floor of the room is its own in the house).
*/
function drawnPoints(svg) {
  const pts = [];
  const nums = (s) => s.trim().split(/[\s,]+/).map(Number);
  const pairs = (list) => { for (let i = 0; i + 1 < list.length; i += 2) pts.push([list[i], list[i + 1]]); };
  for (const [tag] of svg.matchAll(/<(polygon|line|ellipse|circle|rect|path)\b[^>]*>/g)) {
    if (tag.includes('filter=')) continue;
    const at = (name) => Number(new RegExp(` ${name}="([^"]*)"`).exec(tag)?.[1]);
    if (tag.startsWith('<polygon')) pairs(nums(/ points="([^"]*)"/.exec(tag)[1]));
    else if (tag.startsWith('<line')) pts.push([at('x1'), at('y1')], [at('x2'), at('y2')]);
    else if (tag.startsWith('<rect')) pts.push([at('x'), at('y')], [at('x') + at('width'), at('y') + at('height')]);
    else if (tag.startsWith('<path')) {
      for (const [, cmd, args] of / d="([^"]*)"/.exec(tag)[1].matchAll(/([MLQCA])([^MLQCAZ]*)/g)) pairs(cmd === 'A' ? nums(args).slice(-2) : nums(args));
    } else {
      const [cx, cy] = [at('cx'), at('cy')];
      const [rx, ry] = tag.startsWith('<circle') ? [at('r'), at('r')] : [at('rx'), at('ry')];
      pts.push([cx - rx, cy], [cx + rx, cy], [cx, cy - ry], [cx, cy + ry]);
    }
  }
  return pts;
}

// "What you see is what you tap" in the house (stage 3): nothing here links on its page, but a tap on
// a piece of furniture must open About there, also where it rises over the room behind. The house
// reaches a room through every part's `hit` (house.js reach), so each piece carries one that covers
// its drawing. The rug lies on the floor: the floor is About's anyway.
test('about: every piece of furniture has a hit that covers it (the house opens About)', () => {
  const shares = [];
  for (const part of about.parts) {
    if (part.id === 'rug') {
      assert.equal(part.hit, undefined, 'the rug is the floor');
      continue;
    }
    assert.ok(part.hit?.length >= 3, `${part.id}: a hit`);
    const poly = hull(part.hit.map((q) => project(q).map(num)));
    const pts = drawnPoints(part.draw(painter('t')));
    assert.ok(pts.length > 0 && pts.every((q) => q.every(Number.isFinite)), `${part.id}: points read`);
    const share = pts.filter((q) => inside(poly, q)).length / pts.length;
    shares.push([part.id, share]);
    assert.ok(share >= 0.95, `${part.id}: only ${(share * 100).toFixed(0)}% of its drawing is in its hit`);
  }
  assert.equal(shares.length, PARTS.length - 1, 'every piece but the rug checked');
  console.log(`  drawing in its hit: ${shares.map(([id, s]) => `${id} ${Math.round(s * 100)}%`).join(', ')}`);
});

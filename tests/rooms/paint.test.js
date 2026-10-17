import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PALETTE, shade, painter } from '../../src/lib/rooms/paint.js';

const PREFIX = 'room-setup';

test('box draws three faces', () => {
  const p = painter(PREFIX);
  assert.equal(p.box(0, 0, 0, 10, 10, 10, PALETTE.wood).match(/<polygon/g).length, 3);
});

test('gradients are shared', () => {
  const p = painter(PREFIX);
  p.box(0, 0, 0, 10, 10, 10, PALETTE.wood);
  const once = p.defs();
  p.box(20, 5, 0, 8, 8, 4, PALETTE.wood);
  assert.equal(p.defs(), once);
});

test('ids carry the prefix', () => {
  const p = painter(PREFIX);
  p.box(0, 0, 0, 10, 10, 10, PALETTE.wood);
  p.box(0, 0, 0, 10, 10, 10, PALETTE.rose, { l: PALETTE.sage, r: PALETTE.sageDeep });
  const ids = [...p.defs().matchAll(/id="([^"]*)"/g)].map((m) => m[1]);
  assert.ok(ids.length > 0);
  for (const id of ids) assert.ok(id.startsWith(`${PREFIX}-`), id);
});

test('edges are soft', () => {
  const p = painter(PREFIX);
  assert.match(p.box(0, 0, 0, 10, 10, 10, PALETTE.wood), /stroke-linejoin="round"/);
});

test('shadow uses the blur', () => {
  const p = painter(PREFIX);
  assert.ok(p.shadow(10, 10, 8, 4).includes(`url(#${PREFIX}-blur)`));
  assert.ok(p.defs().includes(`<filter id="${PREFIX}-blur"`));
});

test('glow uses the window light gradient', () => {
  const p = painter(PREFIX);
  const out = p.glow([[0, 0, 0], [10, 0, 0], [10, 0, 10], [0, 0, 10]]);
  assert.ok(out.includes(`url(#${PREFIX}-glow)`));
  assert.ok(p.defs().includes(`<radialGradient id="${PREFIX}-glow"`));
});

test('shade lightens towards white and darkens towards black', () => {
  assert.equal(shade('#808080', 0.5), '#c0c0c0');
  assert.equal(shade('#808080', -0.5), '#404040');
  assert.equal(shade('#c99f76', 0), '#c99f76');
});

test('plane and line are drawn through the isometric projection', () => {
  const p = painter(PREFIX);
  // project([x, y, z]) = [(x - y) * cos30, (x + y) * sin30 - z]
  assert.equal(p.plane([[0, 0, 0], [10, 0, 0], [10, 10, 0]], PALETTE.glass),
    `<polygon points="0,0 8.66,5 0,10" fill="${PALETTE.glass}"/>`);
  assert.match(p.plane([[0, 0, 0], [10, 0, 0], [10, 10, 0]], PALETTE.glass, { stroke: PALETTE.woodDark, strokeWidth: 2 }),
    /stroke="#9b7350" stroke-width="2" stroke-linejoin="round"/);
  assert.equal(p.line([0, 0, 0], [0, 0, 10], PALETTE.dark, 2),
    `<line x1="0" y1="0" x2="0" y2="-10" stroke="${PALETTE.dark}" stroke-width="2" stroke-linecap="round"/>`);
});

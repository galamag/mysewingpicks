// Projects <-> guides: which guides a project's step links to ("How it's done ->" under the step) comes
// from each guide's `usedIn` (src/data/guides.js); the guide page lists the same pairs ("Where it's used").
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guides, guideBySlug, guideSections, guidesForStep } from '../../src/data/guides.js';

const SLUG = 'line-a-bag';
const slugs = (list) => list.map((x) => x.guide.slug);
const lining = (list) => slugs(list).filter((s) => s === SLUG); // other guides link to these steps too (bag-bottom: tote 3–7)

test('tote steps 7, 8, 9 link to the lining guide, the others do not', () => {
  for (const k of [7, 8, 9]) assert.deepEqual(lining(guidesForStep('tote-bag', k)), [SLUG], `tote step ${k}`);
  for (const k of [0, 1, 6, 10]) assert.deepEqual(lining(guidesForStep('tote-bag', k)), [], `tote step ${k}`);
  for (const k of [0, 1, 2, 10]) assert.deepEqual(guidesForStep('tote-bag', k), [], `tote step ${k}: no guide at all`);
});

test('basket steps 4, 5, 6, 7 link to the lining guide, the others do not', () => {
  for (const k of [4, 5, 6, 7]) assert.deepEqual(lining(guidesForStep('fabric-basket', k)), [SLUG], `basket step ${k}`);
  for (const k of [0, 1, 3, 8]) assert.deepEqual(lining(guidesForStep('fabric-basket', k)), [], `basket step ${k}`);
});

test('an unknown figure has no guides', () => {
  assert.deepEqual(guidesForStep('nope', 1), []);
});

test("a guide's own figure never links to itself", () => {
  for (const g of guides) {
    for (let k = 0; k <= 20; k++) {
      for (const s of guideSections(g)) assert.ok(!slugs(guidesForStep(s.figure, k)).includes(g.slug), `${g.slug}: self-link at step ${k}`);
    }
  }
  assert.deepEqual(guidesForStep(SLUG, 1), []);
});

test('guidesForStep returns the guide entries themselves', () => {
  assert.equal(guidesForStep('tote-bag', 7)[0].guide, guideBySlug(SLUG));
});

test('every usedIn step is linked, and only those', () => {
  for (const g of guides) {
    for (const s of guideSections(g)) {
      for (const u of s.usedIn) {
        for (let k = 0; k <= 20; k++) {
          const linked = guidesForStep(u.project, k).some((x) => x.guide === g && x.section.id === s.id);
          assert.equal(linked, u.steps.includes(k), `${g.slug}${s.id ? `#${s.id}` : ''} -> ${u.project} step ${k}`);
        }
      }
    }
  }
});

// Projects <-> guides: which guides a project's step links to ("How it's done ->" under the step) comes
// from each guide's `usedIn` (src/data/guides.js); the guide page lists the same pairs ("Where it's used").
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guides, guideBySlug, guidesForStep } from '../../src/data/guides.js';

const SLUG = 'line-a-bag';
const slugs = (list) => list.map((g) => g.slug);

test('tote steps 7, 8, 9 link to the lining guide, the others do not', () => {
  for (const k of [7, 8, 9]) assert.deepEqual(slugs(guidesForStep('tote-bag', k)), [SLUG], `tote step ${k}`);
  for (const k of [0, 1, 6, 10]) assert.deepEqual(guidesForStep('tote-bag', k), [], `tote step ${k}`);
});

test('basket steps 4, 5, 6, 7 link to the lining guide, the others do not', () => {
  for (const k of [4, 5, 6, 7]) assert.deepEqual(slugs(guidesForStep('fabric-basket', k)), [SLUG], `basket step ${k}`);
  for (const k of [0, 1, 3, 8]) assert.deepEqual(guidesForStep('fabric-basket', k), [], `basket step ${k}`);
});

test('an unknown figure has no guides', () => {
  assert.deepEqual(guidesForStep('nope', 1), []);
});

test("a guide's own figure never links to itself", () => {
  for (const g of guides) {
    for (let k = 0; k <= 20; k++) {
      assert.ok(!slugs(guidesForStep(g.figure, k)).includes(g.slug), `${g.slug}: self-link at step ${k}`);
    }
  }
  assert.deepEqual(guidesForStep(SLUG, 1), []);
});

test('guidesForStep returns the guide entries themselves', () => {
  assert.equal(guidesForStep('tote-bag', 7)[0], guideBySlug(SLUG));
});

test('every usedIn step is linked, and only those', () => {
  for (const g of guides) {
    for (const u of g.usedIn) {
      for (let k = 0; k <= 20; k++) {
        const linked = slugs(guidesForStep(u.project, k)).includes(g.slug);
        assert.equal(linked, u.steps.includes(k), `${g.slug} -> ${u.project} step ${k}`);
      }
    }
  }
});

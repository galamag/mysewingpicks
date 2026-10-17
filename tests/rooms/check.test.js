import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkTargets } from '../../src/lib/rooms/check.js';

const draw = () => '';
const room = (...targets) => ({
  key: 'toy',
  size: [60, 50, 40],
  parts: targets.map((target, i) => ({ id: `part${i}`, draw, target, hit: [[0, 0, 0]] })),
});

const catalog = {
  productIds: new Map([['desk', 'setup'], ['thread', 'fabrics']]),
  category: 'setup',
  allSections: ['machines', 'helpers'],
  liveSections: ['machines'],
  projectSlugs: ['tote-bag'],
};

test('a clean room passes', () => {
  const { inactive } = checkTargets(
    room({ product: 'desk' }, { section: 'machines' }, { project: 'tote-bag' }, undefined),
    catalog,
  );
  assert.equal(inactive.size, 0);
});

test('unknown product throws', () => {
  assert.throws(() => checkTargets(room({ product: 'nope' }), catalog),
    { message: 'rooms/toy: unknown product "nope"' });
});

test('foreign-category product throws', () => {
  assert.throws(() => checkTargets(room({ product: 'thread' }), catalog),
    { message: 'rooms/toy: product "thread" is not in setup' });
});

test('unknown section throws', () => {
  assert.throws(() => checkTargets(room({ section: 'nowhere' }), catalog),
    { message: 'rooms/toy: unknown section "nowhere"' });
});

test('empty section is inactive', () => {
  const { inactive } = checkTargets(room({ section: 'machines' }, { section: 'helpers' }), catalog);
  assert.deepEqual([...inactive], ['part1']);
});

test('unknown project throws', () => {
  assert.throws(() => checkTargets(room({ project: 'nope' }), catalog),
    { message: 'rooms/toy: unknown project "nope"' });
});

test('a target must name exactly one thing', () => {
  const message = 'rooms/toy: part "part0" target needs exactly one of product, section, project';
  assert.throws(() => checkTargets(room({}), catalog), { message });
  assert.throws(() => checkTargets(room({ product: 'desk', section: 'machines' }), catalog), { message });
});

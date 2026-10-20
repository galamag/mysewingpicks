// A guide may hold several sections (one figure each): data/guides.js (guideSections, guidesForStep,
// validateGuides) and the translations check in i18n/content.js (coverGuides, guideText).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guideBySlug, guideSections, guidesForStep, validateGuides } from '../../src/data/guides.js';
import { coverGuides, guideText, SECTION_FIELDS } from '../../src/i18n/content.js';

const sec = (id, figure, usedIn) => ({ id, figure, usedIn, title: `T ${id}`, line: `L ${id}`, choose: `C ${id}` });
const multi = (slug, sections, extra = {}) => ({ slug, group: 'construction', sections, ...extra });
const stub = [
  multi('one', [
    sec('folded', 'f-folded', [{ project: 'tote-bag', steps: [7] }]),
    sec('boxed', 'f-boxed', [{ project: 'fabric-basket', steps: [1, 3] }]),
  ]),
  multi('two', [sec('panel', 'f-panel', [{ project: 'tote-bag', steps: [7, 8] }])]),
];

test('a plain guide is one section with no id', () => {
  const g = guideBySlug('line-a-bag');
  assert.deepEqual(guideSections(g), [{ id: null, figure: g.figure, usedIn: g.usedIn }]);
});

test('a guide with sections keeps them in their order', () => {
  assert.deepEqual(guideSections(stub[0]).map((s) => s.id), ['folded', 'boxed']);
  assert.equal(guideSections(stub[0])[1].figure, 'f-boxed');
});

test('guidesForStep returns { guide, section } pairs, one per section that uses the step', () => {
  const r = guidesForStep('tote-bag', 7, stub);
  assert.equal(r.length, 2);
  assert.equal(r[0].guide, stub[0]);
  assert.equal(r[0].section.id, 'folded');
  assert.equal(r[1].guide, stub[1]);
  assert.equal(r[1].section.id, 'panel');
  assert.deepEqual(guidesForStep('fabric-basket', 3, stub).map((x) => x.section.id), ['boxed']);
  assert.deepEqual(guidesForStep('fabric-basket', 2, stub), []);
});

test('a plain guide gives a pair with section.id null', () => {
  const r = guidesForStep('tote-bag', 7);
  assert.equal(r[0].guide, guideBySlug('line-a-bag'));
  assert.equal(r[0].section.id, null);
});

test('the same section is not listed twice for one step', () => {
  const g = multi('dup', [sec('a', 'x', [{ project: 'tote-bag', steps: [7] }, { project: 'tote-bag', steps: [7, 8] }])]);
  assert.equal(guidesForStep('tote-bag', 7, [g]).length, 1);
});

test('validateGuides: section ids are unique, lower-case words, and a guide has figure+usedIn or sections', () => {
  assert.doesNotThrow(() => validateGuides(stub));
  assert.throws(() => validateGuides([multi('d', [sec('a', 'x', []), sec('a', 'y', [])])]), /"a".*twice|twice.*"a"|duplicate/i);
  assert.throws(() => validateGuides([multi('d', [sec('Bad_1', 'x', [])])]), /Bad_1/);
  assert.throws(() => validateGuides([multi('d', [sec('', 'x', [])])]), /id/);
  assert.throws(() => validateGuides([multi('d', [sec('a', 'x', [])], { figure: 'x', usedIn: [] })]), /both|either/i);
  assert.throws(() => validateGuides([multi('d', [sec('a', 'x', [])], { figure: 'x' })]), /both|either/i);
  assert.throws(() => validateGuides([multi('d', [sec('a', 'x', [])], { usedIn: [] })]), /both|either/i);
  assert.throws(() => validateGuides([{ slug: 'n', group: 'construction' }]), /figure|sections/i);
  assert.throws(() => validateGuides([multi('d', [])]), /sections/i);
});

// Translations: [slug].sections[id] = { title, line, choose } — every section, nothing extra.
const GF = ['t'];
const en = [multi('one', [sec('a', 'x', []), sec('b', 'y', [])], { t: 'x' })];
const tr = (over = {}) => ({ one: { t: 'x', sections: { a: { title: 'a', line: 'a', choose: 'a' }, b: { title: 'b', line: 'b', choose: 'b' } }, ...over } });

test('SECTION_FIELDS', () => {
  assert.deepEqual(SECTION_FIELDS, ['title', 'line', 'choose']);
});

test('coverGuides accepts a full translation', () => {
  assert.doesNotThrow(() => coverGuides('xx', en, tr(), GF));
});

test('coverGuides fails on a missing, extra or empty section translation', () => {
  assert.throws(() => coverGuides('xx', en, tr({ sections: { a: tr().one.sections.a } }), GF), /"b"/);
  assert.throws(() => coverGuides('xx', en, tr({ sections: { ...tr().one.sections, c: tr().one.sections.a } }), GF), /"c"/);
  assert.throws(() => coverGuides('xx', en, tr({ sections: { a: { title: 'a', line: 'a' }, b: tr().one.sections.b } }), GF), /choose/);
  assert.throws(() => coverGuides('xx', en, tr({ sections: { a: { title: 'a', line: 'a', choose: ' ' }, b: tr().one.sections.b } }), GF), /choose/);
  assert.throws(() => coverGuides('xx', en, tr({ sections: { a: { ...tr().one.sections.a, extra: 'z' }, b: tr().one.sections.b } }), GF), /extra/);
  assert.throws(() => coverGuides('xx', en, { one: { t: 'x' } }, GF), /sections/);
});

test('coverGuides: sections in a translation of a plain guide fail', () => {
  assert.throws(() => coverGuides('xx', [{ slug: 'p', group: 'g', figure: 'f', usedIn: [], t: 'x' }], { p: { t: 'x', sections: {} } }, GF), /sections/);
});

test('guideText gives the sections on the language, keeping the English data', () => {
  const g = guideBySlug('line-a-bag');
  assert.equal(guideText(g, 'en'), g);
  assert.equal(guideText(g, 'de').sections, undefined);
});

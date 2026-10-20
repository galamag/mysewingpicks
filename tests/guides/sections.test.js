// A guide may hold several sections (one figure each): data/guides.js (guideSections, guidesForStep,
// validateGuides) and the translations check in i18n/content.js (coverGuides, guideText).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guideBySlug, guideSections, guidesForStep, validateGuides } from '../../src/data/guides.js';
import { coverGuides, guideText, SECTION_FIELDS, SECTION_OPTIONAL } from '../../src/i18n/content.js';

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

test('validateGuides: every usedIn entry names its steps (an empty list links nothing)', () => {
  assert.throws(() => validateGuides([multi('d', [sec('a', 'x', [{ project: 'tote-bag', steps: [] }])])]), /steps/);
  assert.throws(() => validateGuides([multi('d', [sec('a', 'x', [{ project: 'tote-bag' }])])]), /steps/);
  assert.throws(() => validateGuides([{ slug: 'p', group: 'construction', figure: 'x', usedIn: [{ project: 'tote-bag', steps: [] }] }]), /steps/);
  assert.doesNotThrow(() => validateGuides([multi('d', [sec('a', 'x', [{ project: 'tote-bag', steps: [3] }])])]));
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

// The optional section text `note`: in a translation exactly when English has it, never empty.
test('SECTION_OPTIONAL: note', () => {
  assert.deepEqual(SECTION_OPTIONAL, ['note']);
});

test('coverGuides: a note in English needs one in every language, and only then', () => {
  const withNote = [multi('one', [{ ...sec('a', 'x', []), note: 'N a' }, sec('b', 'y', [])], { t: 'x' })];
  const full = { one: { t: 'x', sections: { a: { title: 'a', line: 'a', choose: 'a', note: 'n' }, b: { title: 'b', line: 'b', choose: 'b' } } } };
  assert.doesNotThrow(() => coverGuides('xx', withNote, full, GF));
  // English has a note, the translation does not / has an empty one
  assert.throws(() => coverGuides('xx', withNote, tr(), GF), /"a"\.note is missing/);
  assert.throws(() => coverGuides('xx', withNote, { one: { ...full.one, sections: { ...full.one.sections, a: { ...full.one.sections.a, note: ' ' } } } }, GF), /note/);
  // the translation has a note, English does not
  assert.throws(() => coverGuides('xx', en, { one: { ...tr().one, sections: { ...tr().one.sections, b: { ...tr().one.sections.b, note: 'n' } } } }, GF), /"b"\.note exists, but the English section has no note/);
});

test('coverGuides: sections in a translation of a plain guide fail', () => {
  assert.throws(() => coverGuides('xx', [{ slug: 'p', group: 'g', figure: 'f', usedIn: [], t: 'x' }], { p: { t: 'x', sections: {} } }, GF), /sections/);
});

test('guideText gives the sections on the language, keeping the English data', () => {
  const g = guideBySlug('line-a-bag');
  assert.equal(guideText(g, 'en'), g);
  assert.equal(guideText(g, 'de').sections, undefined);
});

// validateGuides also checks each section's own figure and usedIn.
test('validateGuides: a section needs a figure (non-empty string) and a usedIn list', () => {
  assert.throws(() => validateGuides([multi('d', [{ id: 'a', usedIn: [] }])]), /"a".*figure|figure.*"a"/);
  assert.throws(() => validateGuides([multi('d', [sec('a', '', [])])]), /figure/);
  assert.throws(() => validateGuides([multi('d', [sec('a', 7, [])])]), /figure/);
  assert.throws(() => validateGuides([multi('d', [{ id: 'a', figure: 'x' }])]), /usedIn/);
  assert.throws(() => validateGuides([multi('d', [sec('a', 'x', 'nope')])]), /usedIn/);
});

// "Where it's used" wording: usedInSteps(projectTitle, steps) in every language.
import { t } from '../../src/i18n/index.js';
import { howItsDoneLink, sectionUrl } from '../../src/lib/guidePage.js';

const steps = (lang, list) => t(lang).pages.guide.usedInSteps('P', list);

test('usedInSteps: a run is a range, a gap is a list, one step is singular (en, ru)', () => {
  assert.equal(steps('en', [3, 4, 5, 6, 7]), 'P: steps 3–7');
  assert.equal(steps('en', [1, 3]), 'P: steps 1, 3');
  assert.equal(steps('en', [10]), 'P: step 10');
  assert.equal(steps('ru', [3, 4, 5, 6, 7]), 'P: шаги 3–7');
  assert.equal(steps('ru', [1, 3]), 'P: шаги 1, 3');
  assert.equal(steps('ru', [10]), 'P: шаг 10');
});

test('usedInSteps: every language gives the same three shapes, and order / repeats do not matter', () => {
  for (const lang of ['en', 'ru', 'de', 'fr', 'it', 'es']) {
    assert.equal(steps(lang, [7, 5, 6]), steps(lang, [5, 6, 7]), lang);
    assert.equal(steps(lang, [3, 3, 4]), steps(lang, [3, 4]), lang);
    const single = steps(lang, [10]);
    assert.match(single, /^P[\s ]?: \S+ 10$/, lang);
    assert.match(steps(lang, [1, 3]), /1, 3$/, lang);
    assert.ok(!/1[–-]3|1 à 3/.test(steps(lang, [1, 3])), `${lang}: 1 and 3 are not a range`);
    assert.match(steps(lang, [2, 3, 4]), /2(–| à )4$/, lang);
    assert.notEqual(single.replace(' 10', ''), steps(lang, [1, 3]).replace(' 1, 3', ''), `${lang}: singular differs from plural`);
  }
});

test('the other new page words exist in every language', () => {
  for (const lang of ['en', 'ru', 'de', 'fr', 'it', 'es']) {
    const g = t(lang).pages.guide;
    for (const k of ['kindsHeading', 'chooseHeading']) assert.ok(typeof g[k] === 'string' && g[k].trim(), `${lang}.${k}`);
  }
});

// "How it's done" link: the section's anchor on the same language's guide page.
const cut = { id: 'cut-out', title: 'Cut-out corners' };
const guideStub = { slug: 'line-a-bag', title: 'Lining' };
const guideTr = { slug: 'line-a-bag', title: 'Подкладка', sections: [{ id: 'cut-out', title: 'Вырезанные уголки' }] };

test('sectionUrl: language prefix and #anchor, none for a guide without sections', () => {
  assert.equal(sectionUrl('line-a-bag', 'cut-out', 'ru'), '/ru/guides/line-a-bag.html#cut-out');
  assert.equal(sectionUrl('line-a-bag', 'cut-out', 'en'), '/guides/line-a-bag.html#cut-out');
  assert.equal(sectionUrl('line-a-bag', null, 'de'), '/de/guides/line-a-bag.html');
});

test("howItsDoneLink: section title and anchor; guide title and no # without a section", () => {
  const withSection = howItsDoneLink({ guide: guideStub, section: { ...cut } }, 'ru', guideTr);
  assert.equal(withSection.url, '/ru/guides/line-a-bag.html#cut-out');
  assert.equal(withSection.text, `${t('ru').ui.howItsDone} — Вырезанные уголки`);
  const plain = howItsDoneLink({ guide: guideStub, section: { id: null } }, 'ru', guideTr);
  assert.equal(plain.url, '/ru/guides/line-a-bag.html');
  assert.equal(plain.text, `${t('ru').ui.howItsDone} — Подкладка`);
  const en = howItsDoneLink({ guide: guideStub, section: { id: null } }, 'en', guideStub);
  assert.equal(en.url, '/guides/line-a-bag.html');
});

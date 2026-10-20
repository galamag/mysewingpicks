// The guides section: data (src/data/guides.js), translations (src/i18n/<lang>/guides.js, checked by
// content.js), addresses (PAGES in src/i18n/index.js). Spec: Vault «Гайды — спецификация», 3.1, 4–6, 10.1.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { guides, GUIDE_GROUPS, liveGroups, guideBySlug, guideSections } from '../../src/data/guides.js';
import { projects, projectBySlug } from '../../src/data/projects.js';
import { products } from '../../src/data/products.js';
import { figure } from '../../src/lib/anatomy/figures.js';
import { LOCALES, PAGES, pageUrl, t } from '../../src/i18n/index.js';
import { GUIDE_FIELDS, SECTION_FIELDS, guideText } from '../../src/i18n/content.js';

const SLUG = 'line-a-bag';
const OTHER = LOCALES.filter((l) => l !== 'en');

test('groups are known', () => {
  assert.deepEqual(GUIDE_GROUPS, ['machine', 'cutting', 'construction', 'patchwork']);
  assert.ok(guides.length > 0);
  assert.ok(guides.every((g) => GUIDE_GROUPS.includes(g.group)), 'a guide has an unknown group');
});

test('slugs are unique and not project slugs', () => {
  const slugs = guides.map((g) => g.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'two guides share a slug');
  for (const s of slugs) {
    assert.match(s, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `slug "${s}" is not an English address word`);
    assert.ok(!projects.some((p) => p.slug === s), `slug "${s}" is also a project`);
  }
});

test('needs are catalog products', () => {
  const ids = new Set(products.map((p) => p.id));
  for (const g of guides) {
    assert.ok(g.needs.length > 0, `${g.slug}: no "What you'll need"`);
    for (const id of g.needs) assert.ok(ids.has(id), `${g.slug}: unknown product "${id}"`);
    assert.equal(new Set(g.needs).size, g.needs.length, `${g.slug}: a product is listed twice`);
  }
});

test('usedIn points at real project steps', () => {
  for (const g of guides) {
    for (const u of guideSections(g).flatMap((s) => s.usedIn)) {
      assert.ok(projects.some((p) => p.slug === u.project), `${g.slug}: unknown project "${u.project}"`);
      const last = figure(u.project).model.STEPS.length - 1;
      assert.ok(u.steps.length > 0, `${g.slug} → ${u.project}: no steps`);
      for (const k of u.steps) {
        assert.ok(Number.isInteger(k) && k >= 1 && k <= last, `${g.slug} → ${u.project}: step ${k} is not in 1…${last}`);
      }
    }
  }
});

test('video points at a project video and a start second', () => {
  for (const g of guides) {
    for (const v of g.video ?? []) {
      assert.ok(projectBySlug(v.project).video, `${g.slug}: project "${v.project}" has no video`);
      assert.ok(Number.isInteger(v.start) && v.start >= 0, `${g.slug}: start ${v.start} is not a whole second`);
    }
  }
});

test('the pilot', () => {
  const g = guideBySlug(SLUG);
  assert.equal(g.group, 'construction');
  assert.equal(g.figure, SLUG);
  assert.doesNotThrow(() => figure(g.figure));
  assert.equal(g.icon, '🪡');
  assert.deepEqual(g.needs, ['hagbou-thread-set', 'soraco-sewing-clips', 'beaditive-thread-snips', 'rowenta-travel-iron', 'janome-hd2200']);
  assert.deepEqual(g.usedIn, [{ project: 'tote-bag', steps: [7, 8, 9] }, { project: 'fabric-basket', steps: [4, 5, 6, 7] }]);
  assert.deepEqual(g.video, [{ project: 'tote-bag', start: 280 }]);
  assert.throws(() => guideBySlug('nope'), /nope/);
});

test('addresses', () => {
  assert.equal(pageUrl('guides', 'en'), '/guides.html');
  assert.equal(pageUrl('guides', 'ru'), '/ru/guides.html');
  assert.equal(pageUrl(`guide/${SLUG}`, 'en'), `/guides/${SLUG}.html`);
  assert.equal(pageUrl(`guide/${SLUG}`, 'ru'), `/ru/guides/${SLUG}.html`);
  for (const g of guides) assert.equal(PAGES[`guide/${g.slug}`], `guides/${g.slug}.html`);
});

test('every language has the guide', () => {
  for (const g of guides) {
    for (const lang of OTHER) {
      const tr = guideText(g, lang);
      for (const f of GUIDE_FIELDS) assert.ok(typeof tr[f] === 'string' && tr[f].trim(), `${lang} ${g.slug}.${f} is empty`);
      assert.notEqual(tr.heading, g.heading, `${lang} ${g.slug}: heading is the English one`);
      // data that is not text stays the English entry's
      assert.deepEqual([tr.needs, tr.usedIn, tr.video, tr.group], [g.needs, g.usedIn, g.video, g.group]);
      // a section keeps its id, figure and usedIn; only its texts are translated
      assert.deepEqual((tr.sections ?? []).map((s) => [s.id, s.figure, s.usedIn]), (g.sections ?? []).map((s) => [s.id, s.figure, s.usedIn]));
    }
  }
  assert.ok(guideText(guideBySlug(SLUG), 'de').heading.trim());
});

test('every group has a title and an intro in every language', () => {
  for (const lang of LOCALES) {
    const { pages: { guides: text } } = t(lang);
    assert.deepEqual(Object.keys(text.groups), GUIDE_GROUPS, `${lang}: groups`);
    for (const id of GUIDE_GROUPS) {
      assert.ok(text.groups[id].title.trim() && text.groups[id].intro.trim(), `${lang}: group ${id}`);
    }
  }
});

test('empty groups are not rendered', () => {
  assert.deepEqual(liveGroups(), ['construction']);
  assert.deepEqual(liveGroups([]), []);
  // in GUIDE_GROUPS order, not in the order of the list
  assert.deepEqual(liveGroups([{ group: 'patchwork' }, { group: 'machine' }, { group: 'patchwork' }]), ['machine', 'patchwork']);
});

// Numbers: only the maker's (spec 3.2), per guide; no finished size. line-a-bag (spec 6): the tote's and the
// basket's 8, 15, 0.5, 1 and 6 cm; bag-bottom (its own spec, 3): so far the tote's 6, 12 and 0.5 cm.
const MAKER = { 'line-a-bag': ['8', '15', '0.5', '1', '6'], 'bag-bottom': ['6', '12', '0.5'] };
const texts = () => guides.flatMap((g) => LOCALES.flatMap((lang) => {
  const tr = guideText(g, lang);
  return [
    ...GUIDE_FIELDS.map((f) => [lang, `${g.slug}.${f}`, tr[f], g.slug]),
    ...(tr.sections ?? []).flatMap((s) => SECTION_FIELDS.map((f) => [lang, `${g.slug}#${s.id}.${f}`, s[f], g.slug])),
  ];
}));

test("cm numbers are the maker's", () => {
  for (const g of guides) assert.ok(MAKER[g.slug], `${g.slug}: list its maker's numbers in MAKER`);
  for (const [lang, where, s, slug] of texts()) {
    const allowed = new Set(MAKER[slug]);
    for (const m of s.matchAll(/(\d+(?:[.,]\d+)?)[\s\xa0]*(?:cm|см)/g)) {
      assert.ok(allowed.has(m[1].replace(',', '.')), `${lang} ${where}: "${m[0]}"`);
    }
    if (lang !== 'en') assert.doesNotMatch(s, /\d\.\d/, `${lang} ${where}: decimal point instead of a comma`);
  }
});

test('typography: non-breaking spaces, straight apostrophes', () => {
  for (const [lang, where, s] of texts()) {
    assert.doesNotMatch(s, /’/, `${lang} ${where}: typographic apostrophe (the site uses ')`);
    if (['de', 'fr', 'it', 'es'].includes(lang)) assert.doesNotMatch(s, /\d (?:cm|mm|m|g)\b/, `${lang} ${where}: plain space before a unit`);
    if (lang === 'fr') assert.doesNotMatch(s, / [:;!?]/, `fr ${where}: plain space before : ; ! ?`);
  }
});

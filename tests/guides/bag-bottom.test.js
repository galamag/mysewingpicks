// The second guide, "Bag bottoms" (slug bag-bottom): one page, one section per kind of bottom
// (Vault «Гайды — Дно сумки (спецификация)», 3–5, 7). Section 1, `folded` — the tote's own bottom
// (two folds stitched 6 cm each side of the centre crease, the bottom tucked in 6 cm, side seams
// 0.5 cm through 4 layers, turned out → a 12 cm base): figure src/lib/anatomy/bottom-folded.js
// (key bag-bottom-folded), its texts bottom-folded.<lang>.js, checked by bottom-folded.text.js.
// Numbers: only the tote's 6, 12 and 0.5 cm — never a finished size.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as folded from '../../src/lib/anatomy/bottom-folded.js';
import { FOLDED_TEXT, foldedText } from '../../src/lib/anatomy/bottom-folded.text.js';
import * as tote from '../../src/lib/anatomy/tote.js';
import { toteText } from '../../src/lib/anatomy/tote.text.js';
import { figure } from '../../src/lib/anatomy/figures.js';
import { products } from '../../src/data/products.js';
import { guideBySlug, guidesForStep } from '../../src/data/guides.js';
import { GUIDE_FIELDS, SECTION_FIELDS, guideText } from '../../src/i18n/content.js';
import { LOCALES } from '../../src/i18n/index.js';
import { strings, cmNumbers, chipRects, pinCount, touchingChips } from './helpers.js';

const { STEPS, SPEC, DEFS, LABEL_KEYS, renderStep } = folded;
const TOTE = tote.SPEC;
const KEY = 'bag-bottom-folded';
const SLUG = 'bag-bottom';
const LANGS = Object.keys(FOLDED_TEXT);
const MAKER = new Set(['6', '12', '0.5']);

/** The guide's own texts and its `folded` section's texts in a language. */
function guideStrings(lang) {
  const g = guideText(guideBySlug(SLUG), lang);
  const s = g.sections.find((x) => x.id === 'folded');
  return [
    ...GUIDE_FIELDS.map((f) => [`${f}`, g[f]]),
    ...SECTION_FIELDS.map((f) => [`sections.folded.${f}`, s[f]]),
  ];
}

test('every site language has the figure texts', () => {
  assert.deepEqual([...LANGS].sort(), [...LOCALES].sort());
});

test("cm numbers are the maker's: only 6, 12 and 0.5 cm (figure, guide and section texts)", () => {
  for (const lang of LANGS) {
    for (const [where, s] of [...strings(foldedText(lang)), ...guideStrings(lang)]) {
      for (const [m, n] of cmNumbers(s)) assert.ok(MAKER.has(n), `${lang} ${where}: "${m}" is not one of the maker's numbers`);
      assert.doesNotMatch(s, /\d[\s\xa0]*(?:mm|мм)(?!\p{L})/u, `${lang} ${where}: millimetres`);
    }
  }
});

test("the numbers are the tote's", () => {
  assert.equal(SPEC.fromCentre, TOTE.boxBase / 2); // two folds stitched 6 cm each side of the centre crease
  assert.equal(SPEC.base, TOTE.boxBase); // → a 12 cm bottom
  assert.equal(SPEC.tuck, TOTE.boxBase / 2); // the centre crease goes 6 cm inside
  assert.equal(SPEC.seam, TOTE.seam); // side seams 0.5 cm
  assert.equal(SPEC.layers, 4); // through 4 layers at the bottom (not cm)
  assert.deepEqual(SPEC.piece, TOTE.outer.cut); // the piece in the drawing: the tote's outer
  assert.deepEqual([...MAKER].sort(), [SPEC.fromCentre, SPEC.base, SPEC.seam].map(String).sort());
});

test('six steps: the finished bottom, then five moves', () => {
  assert.equal(STEPS.length, 6);
  STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of LANGS) assert.equal(foldedText(lang).steps.length, 6, lang);
});

test('uses are catalog products', () => {
  const ids = new Set(products.map((p) => p.id));
  STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  assert.deepEqual(STEPS.map((s) => s.uses ?? []), [
    [],
    ['rowenta-travel-iron', 'quilting-rulers-set', 'sewline-air-erasable-pen'],
    ['janome-hd2200', 'hagbou-thread-set'],
    ['soraco-sewing-clips'],
    ['soraco-sewing-clips', 'janome-hd2200'],
    [],
  ]);
});

test('figure is registered', () => {
  const f = figure(KEY);
  assert.equal(f.model.STEPS, STEPS);
  assert.equal(f.text('ru'), foldedText('ru'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'bag-bottom-folded':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/bottom-folded\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/bottom-folded\.\?\?\.js'\)\s*\}/);
});

test('every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of LANGS) {
    const L = foldedText(lang);
    for (let k = 0; k < STEPS.length; k++) {
      for (let i = 0; i <= 10; i++) {
        const r = renderStep(k, i / 10, L);
        assert.ok(r.viewBox.every(Number.isFinite), `${lang} step ${k} t=${i / 10}: viewBox`);
        assert.ok(!r.body.includes('NaN') && !r.body.includes('undefined'), `${lang} step ${k} t=${i / 10}: body`);
        for (const m of r.body.matchAll(/url\(#([^)]+)\)/g)) assert.ok(m[1].startsWith(`${KEY}-`), `${lang} step ${k}: #${m[1]}`);
      }
    }
  }
  for (const m of DEFS.matchAll(/id="([^"]+)"/g)) assert.ok(m[1].startsWith(`${KEY}-`), `DEFS: #${m[1]}`);
});

test('chips stay inside the figure (every step, every language)', () => {
  for (const lang of LANGS) {
    const L = foldedText(lang);
    for (let k = 1; k < STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox: [vx, vy, vw, vh] } = renderStep(k, i / 20, L);
        const where = `${lang} step ${k} t=${i / 20}`;
        for (const c of chipRects(body)) {
          assert.ok(c.x0 >= vx - 1e-6 && c.x1 <= vx + vw + 1e-6, `${where}: a chip runs out sideways`);
          assert.ok(c.y0 >= vy - 1e-6 && c.y1 <= vy + vh + 1e-6, `${where}: a chip runs out at the top or bottom`);
        }
      }
    }
  }
});

test('the first frame (the HTML, no JS needed) is the finished bottom: base up, crease on it, the five pins', () => {
  const rest = folded.anatomy(0).pieces;
  const base = rest.find((p) => p.id === 'up-bottom');
  assert.ok(base, 'no base in the rest state');
  assert.ok(base.out[2] > 0.99, 'the base does not face up');
  assert.ok((base.opacity ?? 1) >= 0.999, 'the base is faded');
  assert.ok(base.lines.filter((l) => l.kind === 'fold').length >= 2, 'the centre crease is not drawn heavier on the base');
  assert.ok(!rest.some((p) => p.id.startsWith('bag-')), 'the standing bag is drawn in the rest state');
  for (const lang of LANGS) {
    const L = foldedText(lang);
    assert.equal(pinCount(renderStep(0, 0, L).body), L.legend.length, `${lang}: pins in the first frame`);
    assert.equal(pinCount(renderStep(0, 1, L).body), 0, `${lang}: pins once stood up`);
  }
  // tapped: the bag stands up, the upside-down one is gone
  const up = folded.anatomy(1).pieces;
  assert.ok(up.some((p) => p.id === 'bag-front') && !up.some((p) => p.id.startsWith('up-')));
});

test('a fully faded copy is never drawn (step 0, the crossfade)', () => {
  for (let i = 0; i <= 40; i++) {
    for (const p of folded.anatomy(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `e=${i / 40}: ${p.id} at opacity ${p.opacity}`);
  }
});

test('the other figures still show their pins when taken apart, not at rest (kit default)', () => {
  const L = toteText('en');
  assert.equal(pinCount(tote.renderStep(0, 0, L).body), 0);
  assert.equal(pinCount(tote.renderStep(0, 1, L).body), L.legend.length);
});

test('lines are drawn before the chips (a line being drawn never paints over a label)', () => {
  for (let k = 1; k < STEPS.length; k++) {
    for (const t of [0, 0.5, 1]) {
      const kinds = STEPS[k].scene(t).over.map((o) => o.type);
      const lastLine = kinds.lastIndexOf('line');
      const firstChip = kinds.findIndex((x) => x === 'label' || x === 'dim');
      assert.ok(lastLine < firstChip || firstChip < 0, `step ${k}: a line comes after a chip`);
    }
  }
});

test('chips keep a gap between them: 1% of the figure width (every step, every language)', () => {
  for (const lang of LANGS) {
    const L = foldedText(lang);
    for (let k = 1; k < STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox } = renderStep(k, i / 20, L);
        for (const [a, b] of touchingChips(body, viewBox)) assert.fail(`${lang} step ${k} t=${i / 20}: chips ${a} and ${b} touch`);
      }
    }
  }
});

test('every chip key of the drawing has its text', () => {
  for (const lang of LANGS) assert.deepEqual(Object.keys(foldedText(lang).labels).sort(), [...LABEL_KEYS].sort(), lang);
});

test('language rules: no-break space before the unit, decimal comma, French punctuation, straight apostrophe', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of [...strings(foldedText(lang)), ...guideStrings(lang)]) {
      assert.doesNotMatch(s, /\d\.\d/, `${lang} ${where}: decimal point`);
      if (lang !== 'ru') assert.doesNotMatch(s, /\d[ \t]*cm\b/, `${lang} ${where}: no no-break space before cm`);
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?]/, `fr ${where}: no no-break space before : ; ! ?`);
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

// The approved strings (spec 5.1): the card title, the h1, the page title and the section's name.
const APPROVED = {
  en: ['Bag bottoms: boxed corners and more', 'How to sew a bag bottom: boxed corners and 3 more ways', 'How to Sew a Bag Bottom: Boxed Corners and 3 More Ways', 'Folded-in bottom'],
  ru: ['Дно сумки: четыре способа', 'Как сшить дно сумки и шоппера: четыре способа', 'Как сшить дно сумки и шоппера: 4 способа', 'Дно со складкой внутрь'],
  de: ['Taschenboden: Ecken abnähen und mehr', 'Taschenboden nähen: Ecken abnähen und drei andere Wege', 'Taschenboden nähen: Ecken abnähen, Boden einnähen & mehr', 'Eingefalteter Boden'],
  fr: ['Fond de sac\xa0: quatre méthodes', "Faire le fond d'un sac en tissu\xa0: quatre méthodes", 'Tuto fond de sac couture\xa0: angles, fond carré et plus', "Fond replié à l'intérieur"],
  it: ['Fondo della borsa: quattro modi', 'Come fare il fondo di una borsa di stoffa: quattro modi', 'Come cucire il fondo di una borsa di stoffa: 4 modi', "Fondo ripiegato all'interno"],
  es: ['Base de la bolsa: cuatro formas', 'Cómo hacer la base de una bolsa de tela: cuatro formas', 'Cómo coser la base de una bolsa de tela: 4 formas', 'Base plegada hacia dentro'],
};

test('title, h1, page title and section name are the approved strings (spec 5.1)', () => {
  for (const lang of LOCALES) {
    const g = guideText(guideBySlug(SLUG), lang);
    const [title, heading, pageTitle, section] = APPROVED[lang];
    assert.deepEqual([g.title, g.heading, g.pageTitle, g.sections[0].title], [title, heading, pageTitle, section], lang);
    assert.ok(g.pageTitle.length <= 60, `${lang}: pageTitle is ${g.pageTitle.length} characters`);
  }
});

test('the guide: construction, sections `folded` (tote steps 3–7) then `cut-out`, no video', () => {
  const g = guideBySlug(SLUG);
  assert.equal(g.group, 'construction');
  assert.equal(g.figure, undefined);
  assert.equal(g.usedIn, undefined);
  assert.equal(g.video, undefined);
  assert.deepEqual(g.sections.slice(0, 2).map((s) => [s.id, s.figure]), [['folded', KEY], ['cut-out', 'bag-bottom-cut-out']]);
  assert.deepEqual(g.sections[0].usedIn, [{ project: 'tote-bag', steps: [3, 4, 5, 6, 7] }]);
  assert.ok(typeof g.icon === 'string' && g.icon.trim());
});

test('"When to choose it" has no numbers — every section, every language (numbers go in `note`)', () => {
  for (const lang of LOCALES) {
    for (const s of guideText(guideBySlug(SLUG), lang).sections) assert.doesNotMatch(s.choose, /\d/, `${lang} ${s.id}: choose`);
  }
});

test("needs: only products the section's steps use", () => {
  const g = guideBySlug(SLUG);
  const used = new Set(g.sections.flatMap((s) => figure(s.figure).model.STEPS.flatMap((st) => st.uses ?? [])));
  for (const id of g.needs) assert.ok(used.has(id), `needs "${id}" is used in no step`);
  for (const id of used) assert.ok(g.needs.includes(id), `"${id}" is used in a step but not in needs`);
});

test('tote steps 3–7 link to the folded section; step 7 also to the lining guide', () => {
  for (const k of [3, 4, 5, 6, 7]) {
    const pairs = guidesForStep('tote-bag', k).filter((x) => x.guide.slug === SLUG);
    assert.deepEqual(pairs.map((x) => x.section.id), ['folded'], `tote step ${k}`);
  }
  for (const k of [1, 2, 8, 9]) assert.ok(!guidesForStep('tote-bag', k).some((x) => x.guide.slug === SLUG), `tote step ${k}`);
  assert.deepEqual(guidesForStep('tote-bag', 7).map((x) => x.guide.slug), ['line-a-bag', SLUG]);
});

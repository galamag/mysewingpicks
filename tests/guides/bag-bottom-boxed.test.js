// "Bag bottoms" (slug bag-bottom), section 3 `boxed` — boxed (pinched) corners, a public technique with no
// maker's project yet (Vault «Гайды — Дно сумки (спецификация)», 3 row 3, 5.1, 5.2). Figure
// src/lib/anatomy/bottom-boxed.js (key bag-bottom-boxed), its texts bottom-boxed.<lang>.js, checked by
// bottom-boxed.text.js.
// Numbers: NONE (spec 3, «Цифры разделов 3–4»: no maker's item, so no sizes). What every source agrees on is
// written in words: the line across the corner is as long as the base is wide, marked half the base width
// from the end of the seam (not from the tip of the fabric); the tip is trimmed leaving a small allowance.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as boxed from '../../src/lib/anatomy/bottom-boxed.js';
import { BOXED_TEXT, boxedText } from '../../src/lib/anatomy/bottom-boxed.text.js';
import { foldedText } from '../../src/lib/anatomy/bottom-folded.text.js';
import { figure } from '../../src/lib/anatomy/figures.js';
import { products } from '../../src/data/products.js';
import { projects } from '../../src/data/projects.js';
import { guideBySlug, guidesForStep } from '../../src/data/guides.js';
import { SECTION_FIELDS, SECTION_OPTIONAL, guideText } from '../../src/i18n/content.js';
import { LOCALES } from '../../src/i18n/index.js';
import { strings, chipRects, pinCount, touchingChips } from './helpers.js';

const { STEPS, SPEC, DRAWING, DEFS, LABEL_KEYS, renderStep } = boxed;
const SLUG = 'bag-bottom';
const KEY = 'bag-bottom-boxed';
const LANGS = Object.keys(BOXED_TEXT);
const section = (lang) => guideText(guideBySlug(SLUG), lang).sections.find((s) => s.id === 'boxed');
/** The section's texts in a language: [field, text] for every field it has. */
const sectionTexts = (lang) => [...SECTION_FIELDS, ...SECTION_OPTIONAL].filter((f) => section(lang)[f] !== undefined).map((f) => [f, section(lang)[f]]);
/** Every text of the section in a language: the figure's strings (its number `ui.fig` aside) and the section's. */
const allTexts = (lang) => [
  ...strings(boxedText(lang)).filter(([where]) => where !== 'ui.fig'),
  ...sectionTexts(lang).map(([f, s]) => [`section.${f}`, s]),
];

test('every site language has the figure texts', () => {
  assert.deepEqual([...LANGS].sort(), [...LOCALES].sort());
});

test('no numbers at all: no digit, no fraction, no unit (figure, chips, legend, section texts; every language)', () => {
  for (const lang of LANGS) {
    for (const [where, s] of allTexts(lang)) {
      assert.doesNotMatch(s, /\d/, `${lang} ${where}: a digit`);
      assert.doesNotMatch(s, /[¼½¾⅓⅔⅛⅜⅝⅞″%]|⁄/, `${lang} ${where}: a fraction or a unit sign`);
      assert.doesNotMatch(s, /(?<!\p{L})(?:cm|mm|см|мм|inch(?:es)?|Zoll|pouces?|pollici|pulgadas?)(?!\p{L})/iu, `${lang} ${where}: a unit`);
    }
    // the figure number is the only digit, and it is just that
    assert.match(boxedText(lang).ui.fig, /^\S+\.? 3$/u, `${lang}: ui.fig`);
  }
  assert.deepEqual(SPEC, {}, 'the model has no maker\'s numbers');
});

// "base width" and "half the base width" in each language (the chips and the written steps say it in words).
const WORDS = {
  en: { base: /base width/, half: /half the base width/ },
  ru: { base: /ширин\p{L}* дна/u, half: /половин\p{L}* ширины дна/u },
  de: { base: /Bodenbreite/, half: /halbe\p{L}* Bodenbreite|Hälfte der Bodenbreite/u },
  fr: { base: /largeur du fond/, half: /moitié de la largeur du fond|demi-largeur du fond/ },
  it: { base: /larghezza del fondo/, half: /metà (?:della )?larghezza del fondo/ },
  es: { base: /ancho de la base/, half: /mitad del ancho de la base/ },
};
// "from the end of the seam" — the sources measure from there, not from the tip of the fabric.
const SEAM_END = { en: /end of the seam/, ru: /кон\p{L}* шва/u, de: /Nahtende/, fr: /fin de la couture/, it: /fine della cucitura/, es: /fin de la costura/ };

test('the relations are in words: "base width", "half the base width", "from the end of the seam" (chips and steps)', () => {
  for (const lang of LOCALES) {
    const L = boxedText(lang);
    const w = WORDS[lang];
    assert.match(L.labels.baseWidth, w.base, `${lang}: the chip "base width"`);
    assert.match(L.labels.halfBase, w.half, `${lang}: the chip "half the base width"`);
    assert.match(L.labels.seamEnd, SEAM_END[lang], `${lang}: the chip "end of the seam"`);
    const steps = L.steps.flatMap((s) => [s.title, s.text, ...(s.details ?? [])]).join(' \n ');
    assert.match(steps, w.half, `${lang}: the steps never say "half the base width"`);
    assert.match(steps, w.base, `${lang}: the steps never say "base width"`);
    assert.match(steps, SEAM_END[lang], `${lang}: the steps never say "from the end of the seam"`);
    // the mark step (3) says both: half the base width, from the end of the seam
    const mark = [L.steps[3].text, ...L.steps[3].details].join(' ');
    assert.match(mark, w.half, `${lang}: step 3 without "half the base width"`);
    assert.match(mark, SEAM_END[lang], `${lang}: step 3 without "from the end of the seam"`);
  }
});

test('the drawing keeps the sources\' relations: the line across = the base width, half the base width from the end of the seam', () => {
  assert.equal(DRAWING.line, DRAWING.base, 'the line across the corner is as long as the base is wide');
  assert.equal(DRAWING.fromSeamEnd, DRAWING.base / 2, 'marked half the base width from the end of the seam');
  assert.ok(DRAWING.allowance > 0 && DRAWING.allowance < DRAWING.fromSeamEnd / 3, 'a small allowance is left when the tip is trimmed');
  // the dimensions of step 3 (the mark): "base width" is the base's width, "half the base width" half of it
  const dims = Object.fromEntries(STEPS[3].scene(1).over.filter((o) => o.type === 'dim').map((o) => [o.label, Math.hypot(...o.a.map((v, i) => v - o.b[i]))]));
  assert.ok(Math.abs(dims.baseWidth - DRAWING.base) < 1e-9, `the "base width" dimension is ${dims.baseWidth}`);
  assert.ok(Math.abs(dims.halfBase - DRAWING.base / 2) < 1e-9, `the "half the base width" dimension is ${dims.halfBase}`);
});

test('seven steps: the finished bottom, then six moves', () => {
  assert.equal(STEPS.length, 7);
  STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of LANGS) assert.equal(boxedText(lang).steps.length, 7, lang);
});

test('uses are catalog products, and the guide lists them all', () => {
  const ids = new Set(products.map((p) => p.id));
  STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  assert.deepEqual(STEPS.map((s) => s.uses ?? []), [
    [],
    ['soraco-sewing-clips', 'janome-hd2200'],
    [],
    ['quilting-rulers-set', 'sewline-air-erasable-pen'],
    ['janome-hd2200'],
    ['tailor-scissors'],
    [],
  ]);
  const needs = guideBySlug(SLUG).needs;
  for (const s of STEPS) for (const id of s.uses ?? []) assert.ok(needs.includes(id), `"${id}" is not in the guide's needs`);
});

test('figure is registered (build and browser)', () => {
  const f = figure(KEY);
  assert.equal(f.model.STEPS, STEPS);
  assert.equal(f.text('it'), boxedText('it'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'bag-bottom-boxed':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/bottom-boxed\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/bottom-boxed\.\?\?\.js'\)\s*\}/);
});

test('every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of LANGS) {
    const L = boxedText(lang);
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

test('chips stay inside the figure and keep a 1% gap between them (every step, t = 0…1, every language)', () => {
  for (const lang of LANGS) {
    const L = boxedText(lang);
    for (let k = 1; k < STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox } = renderStep(k, i / 20, L);
        const [vx, vy, vw, vh] = viewBox;
        const where = `${lang} step ${k} t=${i / 20}`;
        for (const c of chipRects(body)) {
          assert.ok(c.x0 >= vx - 1e-6 && c.x1 <= vx + vw + 1e-6, `${where}: a chip runs out sideways`);
          assert.ok(c.y0 >= vy - 1e-6 && c.y1 <= vy + vh + 1e-6, `${where}: a chip runs out at the top or bottom`);
        }
        for (const [a, b] of touchingChips(body, viewBox)) assert.fail(`${where}: chips ${a} and ${b} touch`);
      }
    }
  }
});

test('lines are drawn before the chips (a line being drawn never paints over a label)', () => {
  for (let k = 1; k < STEPS.length; k++) {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const kinds = STEPS[k].scene(t).over.map((o) => o.type);
      const lastLine = kinds.lastIndexOf('line');
      const firstChip = kinds.findIndex((x) => x === 'label' || x === 'dim');
      assert.ok(lastLine < firstChip || firstChip < 0, `step ${k} t=${t}: a line comes after a chip`);
    }
  }
});

test('every chip key of the drawing has its text', () => {
  for (const lang of LANGS) assert.deepEqual(Object.keys(boxedText(lang).labels).sort(), [...LABEL_KEYS].sort(), lang);
});

test('the first frame (the HTML, no JS) is the finished bottom: base up, the bottom seam along it, a corner seam at each end, the pins', () => {
  const rest = boxed.anatomy(0).pieces;
  const base = rest.find((p) => p.id === 'up-bottom');
  assert.ok(base && base.out[2] > 0.99 && (base.opacity ?? 1) >= 0.999, 'the base does not face up in the rest state');
  const along = base.lines.filter((l) => l.kind === 'seam' && l.pts[0][1] === l.pts[1][1]);
  assert.ok(along.length >= 2, 'no bottom seam (drawn heavier) along the base');
  const ends = new Set(base.lines.filter((l) => l.kind === 'seam' && l.pts[0][0] === l.pts[1][0]).map((l) => (l.pts[0][0] < 1 ? 'near 0' : 'far end')));
  assert.deepEqual([...ends].sort(), ['far end', 'near 0'], 'the base lacks a corner seam (straight across) at each end');
  const end = rest.find((p) => p.id === 'up-right');
  assert.ok(end && end.lines.filter((l) => l.kind === 'seam').length >= 2, 'the end wall lacks the side seam and the corner seam (the T)');
  assert.ok(!rest.some((p) => p.id.startsWith('bag-')), 'the standing bag is drawn in the rest state');
  for (const lang of LANGS) {
    const L = boxedText(lang);
    assert.equal(pinCount(renderStep(0, 0, L).body), L.legend.length, `${lang}: pins in the first frame`);
    assert.equal(pinCount(renderStep(0, 1, L).body), 0, `${lang}: pins once stood up`);
  }
  const up = boxed.anatomy(1).pieces;
  assert.ok(up.some((p) => p.id === 'bag-front') && !up.some((p) => p.id.startsWith('up-')), 'tapped: the bag stands up');
  for (let i = 0; i <= 40; i++) {
    for (const p of boxed.anatomy(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `e=${i / 40}: ${p.id} fully faded`);
  }
});

test('a fully faded copy is never drawn (every step)', () => {
  for (let k = 1; k < STEPS.length; k++) {
    for (let i = 0; i <= 40; i++) {
      for (const p of STEPS[k].scene(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `step ${k} t=${i / 40}: ${p.id}`);
    }
  }
});

test('the corners: a triangle with the seam along its middle, the line across it, and once trimmed only a small allowance', () => {
  const ears = (k, t) => STEPS[k].scene(t).pieces.filter((p) => /^ear-\d$/.test(p.id));
  assert.equal(ears(2, 1).length, 2, 'step 2: both corners open into a triangle');
  for (const e of ears(2, 1)) assert.ok(e.lines.some((l) => l.kind === 'seam' && l.pts.every(([, v]) => v === 0)), `${e.id}: no seam along its middle`);
  for (const e of ears(3, 1)) assert.ok(e.lines.some((l) => l.kind === 'mark'), `${e.id}: no marked line after step 3`);
  for (const e of ears(4, 1)) assert.ok(e.lines.some((l) => l.kind === 'stitch'), `${e.id}: not sewn after step 4`);
  const trimmed = ears(5, 1);
  assert.equal(trimmed.length, 2, 'step 5: both corners trimmed');
  for (const e of trimmed) {
    const reach = Math.max(...e.pts.map(([u]) => u));
    assert.ok(Math.abs(reach - DRAWING.allowance) < 1e-9, `${e.id}: ${reach} left beyond the line, not the small allowance`);
  }
  assert.ok(!STEPS[5].scene(1).pieces.some((p) => p.id.startsWith('tip-')), 'step 5: the trimmed tips are still drawn at the end');
});

test('language rules: French punctuation, straight apostrophe', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of allTexts(lang)) {
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?]/, `fr ${where}: no no-break space before : ; ! ?`);
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

// Spec 5.1, the section names (row boxed); the figure's title is the section's name, its number Fig. 3.
const NAME = { en: 'Boxed corners (pinched)', ru: 'Уголки «треугольником»', de: 'Ecken abnähen', fr: 'Coins carrés (en triangle)', it: 'Angoli a triangolo', es: 'Esquinas en triángulo' };
const FIG3 = { en: 'Fig. 3', ru: 'Рис. 3', de: 'Abb. 3', fr: 'Fig. 3', it: 'Fig. 3', es: 'Fig. 3' };

test('the section name is the approved one (spec 5.1); the figure is Fig. 3 under that title', () => {
  for (const lang of LOCALES) {
    assert.equal(section(lang).title, NAME[lang], lang);
    assert.equal(boxedText(lang).ui.title, NAME[lang], `${lang}: ui.title`);
    assert.equal(boxedText(lang).ui.fig, FIG3[lang], `${lang}: ui.fig`);
    assert.equal(foldedText(lang).ui.fig.replace('1', '3'), FIG3[lang], `${lang}: numbered like Fig. 1`);
  }
});

test('the section: third, after folded and cut-out; no project yet, so no "Where it\'s used" and no note', () => {
  const g = guideBySlug(SLUG);
  assert.deepEqual(g.sections.slice(0, 3).map((s) => [s.id, s.figure]), [['folded', 'bag-bottom-folded'], ['cut-out', 'bag-bottom-cut-out'], ['boxed', KEY]]);
  const s = g.sections[2];
  assert.deepEqual(s.usedIn, []);
  for (const lang of LOCALES) {
    assert.equal(section(lang).note, undefined, `${lang}: a note`);
    for (const f of SECTION_FIELDS) assert.ok(section(lang)[f].trim(), `${lang}: ${f}`);
    if (lang !== 'en') assert.notEqual(section(lang).choose, section('en').choose, `${lang}: choose not translated`);
  }
  // no project step links here
  for (const p of projects) {
    const n = figure(p.slug).model.STEPS.length;
    for (let k = 0; k < n; k++) assert.ok(!guidesForStep(p.slug, k).some((x) => x.section.id === 'boxed'), `${p.slug} step ${k} links to #boxed`);
  }
});

// "Bag bottoms" (slug bag-bottom), section 2 `cut-out` — the cosmetic bag's corners (Vault «Гайды — Дно сумки
// (спецификация)», 3 row 2, 5.1). Figure src/lib/anatomy/bottom-cutout.js (key bag-bottom-cut-out), its texts
// bottom-cutout.<lang>.js, checked by bottom-cutout.text.js.
// The maker's numbers (cosmetic.js SPEC, step 10 "Box the corners"): a 23 × 31 cm piece folded in half (the fold is
// the bottom), side seams 0.5 cm, a 3.5 × 2.5 cm piece cut from each bottom corner (3.5 along the bottom, 2.5 along
// the side seam), the corner pinched (side seam on the fold) and sewn straight across. The basket: one sentence with
// its own numbers (a 60 × 60 cm square, 20 × 20 cm cut from the corners). Never the sources' formula ("half the
// base width"), never why 3.5 × 2.5, never a finished size.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as cutout from '../../src/lib/anatomy/bottom-cutout.js';
import { CUTOUT_TEXT, cutoutText } from '../../src/lib/anatomy/bottom-cutout.text.js';
import { foldedText } from '../../src/lib/anatomy/bottom-folded.text.js';
import * as cosmetic from '../../src/lib/anatomy/cosmetic.js';
import * as basket from '../../src/lib/anatomy/basket.js';
import { figure } from '../../src/lib/anatomy/figures.js';
import { products } from '../../src/data/products.js';
import { guideBySlug, guidesForStep } from '../../src/data/guides.js';
import { SECTION_FIELDS, guideText } from '../../src/i18n/content.js';
import { LOCALES, t as dict } from '../../src/i18n/index.js';
import { howItsDoneLink } from '../../src/lib/guidePage.js';

const { STEPS, SPEC, DEFS, LABEL_KEYS, renderStep } = cutout;
const SLUG = 'bag-bottom';
const KEY = 'bag-bottom-cut-out';
const LANGS = Object.keys(CUTOUT_TEXT);
const MAKER = new Set(['3.5', '2.5', '0.5', '23', '31']);
const BASKET_NUMS = ['60', '20'];
const section = (lang) => guideText(guideBySlug(SLUG), lang).sections.find((s) => s.id === 'cut-out');

/** Every string of a language's figure texts (functions skipped), with where it sits. */
function strings(L) {
  const out = [];
  const add = (where, v) => { if (typeof v === 'string') out.push([where, v]); };
  for (const [k, v] of Object.entries(L.ui)) add(`ui.${k}`, v);
  for (const [k, v] of Object.entries(L.stitches)) add(`stitches.${k}`, v);
  for (const [k, v] of Object.entries(L.labels)) add(`labels.${k}`, v);
  L.steps.forEach((s, i) => {
    add(`steps[${i}].title`, s.title);
    add(`steps[${i}].text`, s.text);
    (s.details ?? []).forEach((d, j) => add(`steps[${i}].details[${j}]`, d));
  });
  L.legend.forEach((l, i) => { add(`legend[${i}].title`, l.title); add(`legend[${i}].text`, l.text); });
  return out;
}
const cmNumbers = (s) => [...s.matchAll(/(\d+(?:[.,]\d+)?)[\s\xa0]*(?:cm|см)/g)].map((m) => [m[0], m[1].replace(',', '.')]);
const CHIP = /<g class="chip[^"]*" transform="translate\(([-\d.e]+) ([-\d.e]+)\)"><rect x="([-\d.e]+)" y="([-\d.e]+)" width="([-\d.e]+)" height="([-\d.e]+)"/g;
const chipRects = (body) => [...body.matchAll(CHIP)].map((m) => {
  const [tx, ty, rx, ry, w, h] = m.slice(1).map(Number);
  return { x0: tx + rx, y0: ty + ry, x1: tx + rx + w, y1: ty + ry + h };
});
const pinCount = (body) => (body.match(/<g class="pins"[\s\S]*$/)?.[0].match(/<circle/g) ?? []).length;

test('every site language has the figure texts', () => {
  assert.deepEqual([...LANGS].sort(), [...LOCALES].sort());
});

test("cm numbers are the maker's: figure 3.5, 2.5, 0.5, 23, 31; the section's texts also the basket's 60 and 20", () => {
  for (const lang of LANGS) {
    for (const [where, s] of strings(cutoutText(lang))) {
      for (const [m, n] of cmNumbers(s)) assert.ok(MAKER.has(n), `${lang} figure ${where}: "${m}"`);
      assert.doesNotMatch(s, /\d[\s\xa0]*(?:mm|мм)(?!\p{L})/u, `${lang} figure ${where}: millimetres`);
    }
    const sec = section(lang);
    for (const f of SECTION_FIELDS) {
      for (const [m, n] of cmNumbers(sec[f])) assert.ok(MAKER.has(n) || BASKET_NUMS.includes(n), `${lang} section ${f}: "${m}"`);
      assert.doesNotMatch(sec[f], /\d[\s\xa0]*(?:mm|мм)(?!\p{L})/u, `${lang} section ${f}: millimetres`);
    }
  }
});

test("the numbers are the cosmetic bag's, and the basket sentence's are the basket's", () => {
  const C = cosmetic.SPEC;
  assert.deepEqual(SPEC.piece, C.outer); // 23 × 31, folded in half: the fold is the bottom
  assert.deepEqual(SPEC.notch, C.notch); // 3.5 along the bottom × 2.5 along the side seam
  assert.equal(SPEC.seam, C.seam); // 0.5
  assert.deepEqual([...MAKER].sort(), [...C.notch, C.seam, ...C.outer].map(String).sort());
  assert.deepEqual(BASKET_NUMS, [basket.SPEC.square, basket.SPEC.corner].map(String));
});

test('the basket: one sentence of "When to choose it" with its 60 and 20 cm, in every language; no inline link', () => {
  for (const lang of LOCALES) {
    const { choose } = section(lang);
    const nums = cmNumbers(choose).map(([, n]) => n);
    for (const n of BASKET_NUMS) assert.ok(nums.includes(n), `${lang}: choose has no ${n} cm`);
    const withBasket = choose.split(/(?<=[.!?])\s+/).filter((x) => /60/.test(x));
    assert.equal(withBasket.length, 1, `${lang}: the basket is in exactly one sentence`);
    assert.match(withBasket[0], /20/, `${lang}: 60 and 20 are in the same sentence`);
    assert.doesNotMatch(choose, /<a\b|href/, `${lang}: choose holds a link`);
  }
  assert.ok(guideBySlug(SLUG).sections[1].usedIn.some((u) => u.project === 'fabric-basket'), 'the link to the basket: "Where it\'s used"');
});

// The sources' formula for a bag cut from a rectangle ("the square = half the base width") is not this section's:
// the maker's cut is 3.5 × 2.5, not a square, and why is not explained.
const FORMULA = [/half (?:of )?the (?:base|bottom|width)/i, /половин\p{L}* (?:ширины|дна)/iu, /Hälfte (?:der|des) (?:Boden|Breite)/i,
  /moitié de la (?:largeur|base)|moitié du fond/i, /metà della (?:larghezza|base)|metà del fondo/i, /mitad del? (?:ancho|base|fondo)/i, /=/];

test('no formula, no reason for 3.5 × 2.5 (figure and section texts)', () => {
  for (const lang of LOCALES) {
    const all = [...strings(cutoutText(lang)), ...SECTION_FIELDS.map((f) => [`section.${f}`, section(lang)[f]])];
    for (const [where, s] of all) {
      for (const re of FORMULA) assert.doesNotMatch(s, re, `${lang} ${where}`);
      assert.doesNotMatch(s, /because|потому что|weil|parce que|perché|porque/i, `${lang} ${where}: a reason`);
    }
  }
});

test('seven steps: the finished bottom, then six moves', () => {
  assert.equal(STEPS.length, 7);
  STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of LANGS) assert.equal(cutoutText(lang).steps.length, 7, lang);
});

test('uses are catalog products', () => {
  const ids = new Set(products.map((p) => p.id));
  STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  assert.deepEqual(STEPS.map((s) => s.uses ?? []), [
    [],
    [],
    ['soraco-sewing-clips', 'janome-hd2200'],
    ['quilting-rulers-set', 'sewline-air-erasable-pen', 'tailor-scissors'],
    [],
    ['janome-hd2200'],
    [],
  ]);
});

test('figure is registered (build and browser)', () => {
  const f = figure(KEY);
  assert.equal(f.model.STEPS, STEPS);
  assert.equal(f.text('de'), cutoutText('de'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'bag-bottom-cut-out':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/bottom-cutout\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/bottom-cutout\.\?\?\.js'\)\s*\}/);
});

test('every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of LANGS) {
    const L = cutoutText(lang);
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
    const L = cutoutText(lang);
    for (let k = 1; k < STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox: [vx, vy, vw, vh] } = renderStep(k, i / 20, L);
        const where = `${lang} step ${k} t=${i / 20}`;
        const rects = chipRects(body);
        for (const c of rects) {
          assert.ok(c.x0 >= vx - 1e-6 && c.x1 <= vx + vw + 1e-6, `${where}: a chip runs out sideways`);
          assert.ok(c.y0 >= vy - 1e-6 && c.y1 <= vy + vh + 1e-6, `${where}: a chip runs out at the top or bottom`);
        }
        const g = vw / 200; // half the gap, on each chip
        const r = rects.map((c) => ({ x0: c.x0 - g, y0: c.y0 - g, x1: c.x1 + g, y1: c.y1 + g }));
        for (let a = 0; a < r.length; a++) for (let b = a + 1; b < r.length; b++) {
          const hit = r[a].x0 < r[b].x1 && r[b].x0 < r[a].x1 && r[a].y0 < r[b].y1 && r[b].y0 < r[a].y1;
          assert.ok(!hit, `${where}: chips ${a} and ${b} touch`);
        }
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
  for (const lang of LANGS) assert.deepEqual(Object.keys(cutoutText(lang).labels).sort(), [...LABEL_KEYS].sort(), lang);
});

test('the first frame (the HTML, no JS) is the finished bottom: base up, the fold on it, a corner seam at each end, the pins', () => {
  const rest = cutout.anatomy(0).pieces;
  const base = rest.find((p) => p.id === 'up-bottom');
  assert.ok(base && base.out[2] > 0.99 && (base.opacity ?? 1) >= 0.999, 'the base does not face up in the rest state');
  assert.ok(base.lines.some((l) => l.kind === 'fold'), 'no bottom fold on the base');
  const ends = new Set(base.lines.filter((l) => l.kind === 'seam' && l.pts[0][0] === l.pts[1][0]).map((l) => l.pts[0][0] < 1 ? 'near 0' : 'far end'));
  assert.deepEqual([...ends].sort(), ['far end', 'near 0'], 'the base lacks a corner seam (straight across) at each end');
  const end = rest.find((p) => p.id === 'up-right');
  assert.ok(end, 'no visible end wall');
  assert.ok(end.lines.filter((l) => l.kind === 'seam').length >= 2, 'the end wall lacks the side seam and the corner seam (the T)');
  assert.ok(!rest.some((p) => p.id.startsWith('bag-')), 'the standing bag is drawn in the rest state');
  for (const lang of LANGS) {
    const L = cutoutText(lang);
    assert.equal(pinCount(renderStep(0, 0, L).body), L.legend.length, `${lang}: pins in the first frame`);
    assert.equal(pinCount(renderStep(0, 1, L).body), 0, `${lang}: pins once stood up`);
  }
  const up = cutout.anatomy(1).pieces;
  assert.ok(up.some((p) => p.id === 'bag-front') && !up.some((p) => p.id.startsWith('up-')), 'tapped: the bag stands up');
  for (let i = 0; i <= 40; i++) {
    for (const p of cutout.anatomy(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `e=${i / 40}: ${p.id} fully faded`);
  }
});

test('a fully faded copy is never drawn (every step)', () => {
  for (let k = 1; k < STEPS.length; k++) {
    for (let i = 0; i <= 40; i++) {
      for (const p of STEPS[k].scene(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `step ${k} t=${i / 40}: ${p.id}`);
    }
  }
});

test("language rules: no-break space before the unit, decimal comma, French punctuation, straight apostrophe", () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    const all = [...strings(cutoutText(lang)), ...SECTION_FIELDS.map((f) => [`section.${f}`, section(lang)[f]])];
    for (const [where, s] of all) {
      assert.doesNotMatch(s, /\d\.\d/, `${lang} ${where}: decimal point`);
      if (lang !== 'ru') assert.doesNotMatch(s, /\d[ \t]*cm\b/, `${lang} ${where}: no no-break space before cm`);
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?]/, `fr ${where}: no no-break space before : ; ! ?`);
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

// Spec 5.1, the section names (row cut-out); the figure's title is the section's name, its number Fig. 2.
const NAME = { en: 'Cut-out corners', ru: 'Вырезанные уголки', de: 'Ausgeschnittene Ecken', fr: 'Coins découpés', it: 'Angoli tagliati', es: 'Esquinas recortadas' };
const FIG2 = { en: 'Fig. 2', ru: 'Рис. 2', de: 'Abb. 2', fr: 'Fig. 2', it: 'Fig. 2', es: 'Fig. 2' };

test('the section name is the approved one (spec 5.1); the figure is Fig. 2 under that title', () => {
  for (const lang of LOCALES) {
    assert.equal(section(lang).title, NAME[lang], lang);
    assert.equal(cutoutText(lang).ui.title, NAME[lang], `${lang}: ui.title`);
    assert.equal(cutoutText(lang).ui.fig, FIG2[lang], `${lang}: ui.fig`);
    assert.equal(foldedText(lang).ui.fig.replace('1', '2'), FIG2[lang], `${lang}: numbered like Fig. 1`);
  }
});

test('the section: second, on the cosmetic bag step 10 and the basket steps 1, 3', () => {
  const g = guideBySlug(SLUG);
  const s = g.sections[1];
  assert.equal(s.id, 'cut-out');
  assert.equal(s.figure, KEY);
  assert.deepEqual(s.usedIn, [{ project: 'cosmetic-bag', steps: [10] }, { project: 'fabric-basket', steps: [1, 3] }]);
  // "Where it's used": "step 10" and "steps 1, 3" (not "1–3")
  assert.equal(dict('en').pages.guide.usedInSteps('P', [10]), 'P: step 10');
  assert.equal(dict('en').pages.guide.usedInSteps('P', [1, 3]), 'P: steps 1, 3');
});

test('"How it\'s done — Cut-out corners": cosmetic step 10 and basket steps 1, 3, to #cut-out in the same language', () => {
  const at = (project, k) => guidesForStep(project, k).filter((x) => x.guide.slug === SLUG).map((x) => x.section.id);
  assert.deepEqual(at('cosmetic-bag', 10), ['cut-out']);
  for (const k of [1, 3]) assert.deepEqual(at('fabric-basket', k), ['cut-out'], `basket step ${k}`);
  for (let k = 0; k < cosmetic.STEPS.length; k++) if (k !== 10) assert.deepEqual(at('cosmetic-bag', k), [], `cosmetic step ${k}`);
  for (let k = 0; k < basket.STEPS.length; k++) if (k !== 1 && k !== 3) assert.deepEqual(at('fabric-basket', k), [], `basket step ${k}`);
  // the basket's lining steps keep their own guide, and only it
  for (const k of [4, 5, 6, 7]) assert.deepEqual(guidesForStep('fabric-basket', k).map((x) => x.guide.slug), ['line-a-bag'], `basket step ${k}`);
  const pair = guidesForStep('cosmetic-bag', 10).find((x) => x.guide.slug === SLUG);
  for (const lang of LOCALES) {
    const link = howItsDoneLink(pair, lang);
    assert.equal(link.url, `${lang === 'en' ? '' : `/${lang}`}/guides/bag-bottom.html#cut-out`, lang);
    assert.equal(link.text, `${dict(lang).ui.howItsDone} — ${NAME[lang]}`, lang);
  }
});

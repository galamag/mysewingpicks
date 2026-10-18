// The figure of the first guide, "Lining a bag" (slug line-a-bag): src/lib/anatomy/lining.js,
// its texts lining.<lang>.js (checked by lining.text.js) and its place in both figure registries.
// Numbers rule (Vault «Гайды — спецификация», 3.2 and 6): only the maker's numbers from the tote and
// the basket — 8, 15, 0.5, 1 and 6 cm — and never a finished size or a stitch length.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as lining from '../../src/lib/anatomy/lining.js';
import { LINING_TEXT, liningText } from '../../src/lib/anatomy/lining.text.js';
import { SPEC as TOTE } from '../../src/lib/anatomy/tote.js';
import { SPEC as BASKET } from '../../src/lib/anatomy/basket.js';
import { figure } from '../../src/lib/anatomy/figures.js';
import { products } from '../../src/data/products.js';
import { LOCALES } from '../../src/i18n/index.js';

const { STEPS, SPEC, DEFS, LABEL_KEYS, renderStep } = lining;
const SLUG = 'line-a-bag';
const LANGS = Object.keys(LINING_TEXT);

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

const stepStrings = (L, k) => [L.steps[k].title, L.steps[k].text, ...(L.steps[k].details ?? [])].join(' ');

test('every site language has the figure texts', () => {
  assert.deepEqual([...LANGS].sort(), [...LOCALES].sort());
});

test("cm numbers are the maker's", () => {
  const allowed = new Set(['8', '15', '0.5', '1', '6']);
  for (const lang of LANGS) {
    for (const [where, s] of strings(liningText(lang))) {
      for (const m of s.matchAll(/(\d+(?:[.,]\d+)?)[\s\xa0]*(?:cm|см)/g)) {
        const n = m[1].replace(',', '.');
        assert.ok(allowed.has(n), `${lang} ${where}: "${m[0]}" is not one of the maker's numbers`);
      }
      // no other unit sneaks in (a stitch length in mm, say)
      assert.doesNotMatch(s, /\d[\s\xa0]*(?:mm|мм)(?!\p{L})/u, `${lang} ${where}: millimetres`);
    }
  }
});

test('the numbers are the projects\' numbers', () => {
  assert.equal(SPEC.opening, TOTE.opening);
  assert.equal(SPEC.seam, TOTE.seam);
  assert.equal(SPEC.seam, BASKET.seam);
  assert.equal(SPEC.strapFromCenter, TOTE.strap.fromCenter);
  assert.equal(SPEC.topstitch, TOTE.topstitch);
  assert.equal(SPEC.basket.opening, BASKET.opening);
  assert.equal(SPEC.basket.topstitch, BASKET.topstitch);
  // the bag in the drawing has the tote's shape
  assert.deepEqual(SPEC.bag.cut, TOTE.outer.cut);
  assert.equal(SPEC.bag.base, TOTE.boxBase);
  assert.deepEqual(SPEC.bag.strap, TOTE.strap.cut);
  assert.equal(SPEC.bag.strapWidth, TOTE.strap.done);
});

test('eight steps', () => {
  assert.equal(STEPS.length, 8);
  STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of LANGS) assert.equal(liningText(lang).steps.length, 8, lang);
});

test('uses are catalog products', () => {
  const ids = new Set(products.map((p) => p.id));
  STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  assert.deepEqual(STEPS.map((s) => s.uses ?? []), [
    [],
    ['soraco-sewing-clips', 'janome-hd2200', 'hagbou-thread-set'],
    ['soraco-sewing-clips'],
    ['janome-hd2200'],
    [],
    ['janome-hd2200', 'beaditive-thread-snips'],
    ['rowenta-travel-iron'],
    ['janome-hd2200'],
  ]);
});

test('figure is registered', () => {
  const f = figure(SLUG);
  assert.equal(f.model.STEPS, STEPS);
  assert.equal(f.text('ru'), liningText('ru'));
  // the browser registry (models.js uses import.meta.glob, which plain Node has not — read its source)
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'line-a-bag':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/lining\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/lining\.\?\?\.js'\)\s*\}/);
});

test('every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of LANGS) {
    const L = liningText(lang);
    for (let k = 0; k < STEPS.length; k++) {
      for (let i = 0; i <= 10; i++) {
        const r = renderStep(k, i / 10, L);
        assert.ok(r.viewBox.every(Number.isFinite), `${lang} step ${k} t=${i / 10}: viewBox`);
        assert.ok(!r.body.includes('NaN') && !r.body.includes('undefined'), `${lang} step ${k} t=${i / 10}: body`);
        for (const m of r.body.matchAll(/url\(#([^)]+)\)/g)) assert.ok(m[1].startsWith(`${SLUG}-`), `${lang} step ${k}: #${m[1]}`);
      }
    }
  }
  for (const m of DEFS.matchAll(/id="([^"]+)"/g)) assert.ok(m[1].startsWith(`${SLUG}-`), `DEFS: #${m[1]}`);
});

test('chips stay inside the figure (every step, every language)', () => {
  const chip = /<g class="chip[^"]*" transform="translate\(([-\d.e]+) ([-\d.e]+)\)"><rect x="([-\d.e]+)" y="([-\d.e]+)" width="([-\d.e]+)" height="([-\d.e]+)"/g;
  for (const lang of LANGS) {
    const L = liningText(lang);
    for (let k = 1; k < STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox: [vx, vy, vw, vh] } = renderStep(k, i / 20, L);
        for (const m of body.matchAll(chip)) {
          const [tx, ty, rx, ry, w, h] = m.slice(1).map(Number);
          const x0 = tx + rx, y0 = ty + ry;
          const where = `${lang} step ${k} t=${i / 20}`;
          assert.ok(x0 >= vx - 1e-6 && x0 + w <= vx + vw + 1e-6, `${where}: a chip runs out sideways`);
          assert.ok(y0 >= vy - 1e-6 && y0 + h <= vy + vh + 1e-6, `${where}: a chip runs out at the top or bottom`);
        }
      }
    }
  }
});

test('every chip key of the drawing has its text', () => {
  for (const lang of LANGS) assert.deepEqual(Object.keys(liningText(lang).labels).sort(), [...LABEL_KEYS].sort(), lang);
});

test('language rules: no-break space before the unit, decimal comma, French punctuation, Russian «подкладка»', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of strings(liningText(lang))) {
      assert.doesNotMatch(s, /\d\.\d/, `${lang} ${where}: decimal point`);
      if (lang !== 'ru') assert.doesNotMatch(s, /\d[ \t]*cm\b/, `${lang} ${where}: no no-break space before cm`);
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?]/, `fr ${where}: no no-break space before : ; ! ?`);
      if (lang === 'ru') assert.doesNotMatch(s, /подклад(?!к)/i, `ru ${where}: «подклад» — the guide says «подкладка»`);
      // the site writes the straight apostrophe everywhere (tote.fr.js, src/i18n/fr.js …)
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

test('step 5 closes the opening on the machine, then by hand with a ladder stitch', () => {
  const names = {
    en: 'ladder stitch',
    ru: 'потайной шов («лесенка»)',
    de: 'Matratzenstich (Leiterstich)',
    fr: "point invisible (point d'échelle)",
    it: 'punto invisibile a mano',
    es: 'punto invisible a mano',
  };
  for (const lang of LANGS) {
    const details = liningText(lang).steps[5].details.join(' ').replace(/’/g, "'");
    assert.ok(details.includes(names[lang]), `${lang}: step 5 does not name "${names[lang]}"`);
  }
  assert.equal(STEPS[5].stitch, 'straight'); // the machine way is the one drawn
});

test('the basket comes in as the comparison: a 15 cm opening (step 1), a 0.5 cm topstitch (step 7)', () => {
  for (const lang of LANGS) {
    const L = liningText(lang);
    assert.match(stepStrings(L, 1), /15[\s\xa0]*(?:cm|см)/, `${lang} step 1`);
    assert.match(stepStrings(L, 7), /0[.,]5[\s\xa0]*(?:cm|см)/, `${lang} step 7`);
    assert.match(stepStrings(L, 7), /\b1[\s\xa0]*(?:cm|см)/, `${lang} step 7`);
  }
});

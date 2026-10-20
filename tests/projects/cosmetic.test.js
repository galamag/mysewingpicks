// The figure of the cosmetic bag with round corners (slug cosmetic-bag): src/lib/anatomy/cosmetic.js,
// its texts cosmetic.<lang>.js (checked by cosmetic.text.js) and its place in both figure registries.
// Numbers rule: only the maker's numbers (Vault «Анатомия изделий — Косметичка с круглыми уголками»),
// never the finished size and never a reason for the 3.5 × 2.5 cm corner she did not give.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as cosmetic from '../../src/lib/anatomy/cosmetic.js';
import { COSMETIC_TEXT, cosmeticText } from '../../src/lib/anatomy/cosmetic.text.js';
import { figure } from '../../src/lib/anatomy/figures.js';
import { products } from '../../src/data/products.js';

const { STEPS, SPEC, DEFS, LABEL_KEYS, CUT, renderStep } = cosmetic;
const SLUG = 'cosmetic-bag';
const LANGS = Object.keys(COSMETIC_TEXT);

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

test("the model's numbers are the maker's", () => {
  assert.deepEqual(SPEC, {
    outer: [23, 31], lining: [23, 31], iface: [21, 29], moonIface: 16, radius: 8,
    pink: [18, 10], pinkCount: 4, moonInset: 1, zipper: 20, seam: 0.5, opening: 6, notch: [3.5, 2.5],
  });
});

test("cm numbers in the texts are the maker's", () => {
  const allowed = new Set(['23', '31', '21', '29', '16', '8', '18', '10', '20', '0.5', '1', '6', '3.5', '2.5']);
  for (const lang of LANGS) {
    for (const [where, s] of strings(cosmeticText(lang))) {
      for (const m of s.matchAll(/(\d+(?:[.,]\d+)?)[\s\xa0]*(?:cm|см)/g)) {
        const n = m[1].replace(',', '.');
        assert.ok(allowed.has(n), `${lang} ${where}: "${m[0]}" is not one of the maker's numbers`);
      }
      assert.doesNotMatch(s, /\d[\s\xa0]*(?:mm|мм)(?!\p{L})/u, `${lang} ${where}: millimetres`);
    }
  }
});

test('twelve steps: the finished bag + eleven', () => {
  assert.equal(STEPS.length, 12);
  STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of LANGS) assert.equal(cosmeticText(lang).steps.length, 12, lang);
  assert.equal(CUT.step, 1);
});

test('uses are catalog products, no zipper link (the zipper is named in text only)', () => {
  const ids = new Set(products.map((p) => p.id));
  STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => {
    assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`);
    assert.ok(!/zip/.test(id), `step ${k}: "${id}" — the zipper has no link (decision 11.2)`);
  }));
});

test('figure is registered', () => {
  const f = figure(SLUG);
  assert.equal(f.model.STEPS, STEPS);
  assert.equal(f.text('en'), cosmeticText('en'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'cosmetic-bag':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/cosmetic\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/cosmetic\.\?\?\.js'\)\s*\}/);
});

test('every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of LANGS) {
    const L = cosmeticText(lang);
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
    const L = cosmeticText(lang);
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
  for (const lang of LANGS) assert.deepEqual(Object.keys(cosmeticText(lang).labels).sort(), [...LABEL_KEYS].sort(), lang);
});

test('the opening is closed by hand: the hand step names no machine stitch', () => {
  const last = STEPS[STEPS.length - 1];
  assert.ok(!(last.sew ?? []).length, 'the last step (turn out, close the opening by hand) has no machine window');
});

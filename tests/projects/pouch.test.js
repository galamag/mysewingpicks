// The figure of the phone pouch with a flap (slug phone-pouch): src/lib/anatomy/pouch.js, its texts
// pouch.<lang>.js (checked by pouch.text.js) and its place in both figure registries.
// Numbers rule: only the maker's numbers (Vault «Анатомия изделий — Мини-сумочка для телефона»), never
// the finished size. The video is on her channel Cozy Scraps; its title ("I sell a lot of them") is not
// the site's to repeat. There is no chain in the video — the texts say so.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as pouch from '../../src/lib/anatomy/pouch.js';
import { POUCH_TEXT, pouchText } from '../../src/lib/anatomy/pouch.text.js';
import { figure } from '../../src/lib/anatomy/figures.js';
import { products } from '../../src/data/products.js';
import { LOCALES } from '../../src/i18n/index.js';

const { STEPS, SPEC, DEFS, LABEL_KEYS, CUT, renderStep } = pouch;
const SLUG = 'phone-pouch';
const LANGS = Object.keys(POUCH_TEXT);
const ALLOWED = new Set(['57', '19', '31', '13', '5', '0.5', '6', '11', '22']);

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

/** The page's texts of the project (src/data/projects.js, src/i18n/<lang>/projects.js), with where they sit. */
async function pageStrings(lang) {
  const { projects } = await import('../../src/data/projects.js');
  const en = projects.find((p) => p.slug === SLUG);
  const p = lang === 'en' ? en : (await import(`../../src/i18n/${lang}/projects.js`)).default[SLUG];
  const out = Object.entries(p).filter(([k, v]) => typeof v === 'string' && !['slug', 'video', 'icon'].includes(k));
  p.faq.forEach((f, i) => out.push([`faq[${i}].q`, f.q], [`faq[${i}].a`, f.a]));
  return out;
}

const cmNumbers = (s) => [...s.matchAll(/(\d+(?:[.,]\d+)?)[\s\xa0]*(?:cm|см)/g)].map((m) => [m[0], m[1].replace(',', '.')]);

test("the model's numbers are the maker's", () => {
  assert.deepEqual(SPEC, { bar: [57, 19], stem: [31, 13], ear: 5, ears: 2, seam: 0.5, opening: 6, topstitch: 0.5, lines: [11, 22] });
});

test("cm numbers in the figure texts are the maker's", () => {
  for (const lang of LANGS) {
    for (const [where, s] of strings(pouchText(lang))) {
      for (const [m, n] of cmNumbers(s)) assert.ok(ALLOWED.has(n), `${lang} ${where}: "${m}" is not one of the maker's numbers`);
      assert.doesNotMatch(s, /\d[\s\xa0]*(?:mm|мм)(?!\p{L})/u, `${lang} ${where}: millimetres`);
    }
  }
});

test("the page's texts: the maker's cm numbers only, the site's spacing rules", async () => {
  for (const lang of LANGS) {
    for (const [where, s] of await pageStrings(lang)) {
      for (const [m, n] of cmNumbers(s)) assert.ok(ALLOWED.has(n), `${lang} ${where}: "${m}" is not one of the maker's numbers`);
      if (lang !== 'en') assert.doesNotMatch(s, /\d\.\d/, `${lang} ${where}: decimal point`);
      if (!['en', 'ru'].includes(lang)) assert.doesNotMatch(s, /\d[ \t]*cm\b/, `${lang} ${where}: no no-break space before cm`);
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?]/, `fr ${where}: no no-break space before : ; ! ?`);
    }
  }
});

test('sixteen steps: the finished pouch + fifteen (the last one fills it); the cutting diagram is step 1', () => {
  assert.equal(STEPS.length, 16);
  STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of LANGS) assert.equal(pouchText(lang).steps.length, 16, lang);
  assert.equal(CUT.step, 1);
});

test('uses are catalog products; the snap step names the snap pliers', () => {
  const ids = new Set(products.map((p) => p.id));
  STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  assert.ok(STEPS[14].uses.includes('kamtop-snap-pliers-kit'));
});

test('figure is registered', () => {
  const f = figure(SLUG);
  assert.equal(f.model.STEPS, STEPS);
  assert.equal(f.text('en'), pouchText('en'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'phone-pouch':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/pouch\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/pouch\.\?\?\.js'\)\s*\}/);
});

test('every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of LANGS) {
    const L = pouchText(lang);
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
    const L = pouchText(lang);
    for (let k = 1; k < STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox: [vx, vy, vw, vh] } = renderStep(k, i / 20, L);
        for (const m of body.matchAll(chip)) {
          // a chip fading in or out sits in a group with its opacity — a faint one may be cut
          const before = body.slice(Math.max(0, m.index - 30), m.index);
          const o = /opacity="([\d.]+)">$/.exec(before);
          if (o && +o[1] < 0.3) continue;
          const [tx, ty, rx, ry, w, h] = m.slice(1).map(Number);
          const x0 = tx + rx, y0 = ty + ry;
          const where = `${lang} step ${k} t=${i / 20}`;
          assert.ok(x0 >= vx - 0.5 && x0 + w <= vx + vw + 0.5, `${where}: a chip runs out sideways`);
          assert.ok(y0 >= vy - 0.5 && y0 + h <= vy + vh + 0.5, `${where}: a chip runs out at the top or bottom`);
        }
      }
    }
  }
});

test('every chip key of the drawing has its text', () => {
  for (const lang of LANGS) assert.deepEqual(Object.keys(pouchText(lang).labels).sort(), [...LABEL_KEYS].sort(), lang);
});

test('every site language has the figure texts', () => {
  assert.deepEqual([...LANGS].sort(), [...LOCALES].sort());
});

test('language rules: no-break space before the unit, decimal comma, French punctuation, straight apostrophe', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of strings(pouchText(lang))) {
      assert.doesNotMatch(s, /\d\.\d/, `${lang} ${where}: decimal point`);
      if (lang !== 'ru') assert.doesNotMatch(s, /\d[ \t]*cm\b/, `${lang} ${where}: no no-break space before cm`);
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?]/, `fr ${where}: no no-break space before : ; ! ?`);
    }
  }
  for (const lang of LANGS) {
    for (const [where, s] of strings(pouchText(lang))) assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
  }
});

test("the video's title is not the site's claim; the chain is said to be absent from the video", async () => {
  const traps = { en: /I sell|orders|phone holder/i, ru: /продаю|заказ/i, de: /verkaufe|Bestellung/i, fr: /je vends|commandes/i, it: /vendo|ordini/i, es: /vendo|pedidos/i };
  const noChain = { en: /none in the video/, ru: /в видео (?:её|ремешка) нет/, de: /im Video gibt es (?:keine|keinen)/, fr: /pas dans la vidéo/, it: /nel video non c'è/, es: /en el video no hay/ };
  for (const lang of LANGS) {
    const all = [...strings(pouchText(lang)), ...(await pageStrings(lang))].map(([, s]) => s).join(' ');
    assert.doesNotMatch(all, traps[lang], lang);
    assert.match(pouchText(lang).steps[0].text, noChain[lang], `${lang}: step 0 says the chain is not in the video`);
    const page = Object.fromEntries(await pageStrings(lang));
    assert.match(page.needsIntro, noChain[lang], `${lang}: needsIntro says the chain is not in the video`);
  }
});

test('taking it apart works from the very first frame (step 0, every 1/400 of the way)', () => {
  const L = pouchText('en');
  for (let i = 0; i <= 400; i++) {
    const r = renderStep(0, i / 400, L);
    assert.ok(r.viewBox.every(Number.isFinite) && !r.body.includes('NaN'), `t=${i / 400}`);
  }
});

test("Galamat's review: the accordion makes two pockets, the flap piece the third; the ears need no tote; the side seam is not through all the layers", async () => {
  const L = pouchText('en');
  const step10 = renderStep(10, 1, L).body, step12 = renderStep(12, 0.55, L).body, step13 = renderStep(13, 1, L).body;
  assert.ok(step10.includes(L.labels.pockets2) && !step10.includes(L.labels.pocket3), 'step 10 ends with two pockets');
  assert.ok(step12.includes(L.labels.pocket3), 'step 12 shows the third pocket');
  assert.ok(step13.includes(L.labels.backAndNext), 'step 13: back + the next layer');
  for (const lang of LANGS) {
    const all = [...strings(pouchText(lang)), ...(await pageStrings(lang))].map(([, s]) => s).join(' ');
    assert.doesNotMatch(all, /tote|шоппер|Tote Bag|shopper/i, `${lang}: no tote straps`);
    assert.doesNotMatch(all, /through all the layers|через все слои|durch alle Lagen|toutes les couches|tutti gli strati|todas las capas/, `${lang}: the side seam is not through all the layers`);
  }
});

test('the last step: phone, money and card go in, then a chain (not in the video, the step says so)', () => {
  const L = pouchText('en');
  const mid = (t) => renderStep(15, t, L).body;
  assert.ok(mid(0.2).includes('url(#phone-pouch-screen)'), 'the phone');
  assert.ok(mid(0.42).includes('url(#phone-pouch-note)'), 'the banknote');
  assert.ok(mid(0.62).includes('#5f7fa3'), 'the card');
  assert.ok(mid(1).includes(L.labels.chainOn), 'the chain');
  const noChain = { en: /none in the video/, ru: /в видео её нет/, de: /im Video gibt es keine/, fr: /pas dans la vidéo/, it: /nel video non c'è/i, es: /en el video no hay/i };
  for (const lang of LANGS) assert.match(pouchText(lang).steps[15].text, noChain[lang], lang);
});

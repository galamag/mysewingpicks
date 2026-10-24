// The third guide, "How to sew a zipper" (slug sew-a-zipper): one page, one section per way of sewing a zipper in
// (Vault «Гайды — Молния (спецификация)», 3, 4, 5.1, 5.2, 7). Section 1, `lined` — the maker's own: the makeup bag's
// zipper between the outer and the lining (cosmetic bag steps 7–8): outer right side up, the 20 cm zipper face down in
// the middle of the 23 cm side (its ends short of the side edges), the lining face down on top, one 0.5 cm seam; the
// lining opened out, outer and lining folded in half, the other side the same way; then the zipper opened. No
// topstitching along the zipper. No presser foot named (the maker has not said which foot — spec 3.2).
// Figure src/lib/anatomy/zipper-lined.js (key zipper-lined), its texts zipper-lined.<lang>.js, checked by
// zipper-lined.text.js. Tasks 2–6 add the sections tabs … invisible (and their tests) to this file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as lined from '../../src/lib/anatomy/zipper-lined.js';
import { LINED_TEXT, linedText } from '../../src/lib/anatomy/zipper-lined.text.js';
import { at } from '../../src/lib/anatomy/iso.js';
import * as cosmetic from '../../src/lib/anatomy/cosmetic.js';
import { figure } from '../../src/lib/anatomy/figures.js';
import { products } from '../../src/data/products.js';
import { guideBySlug, guidesForStep } from '../../src/data/guides.js';
import { GUIDE_FIELDS, SECTION_FIELDS, SECTION_OPTIONAL, guideText } from '../../src/i18n/content.js';
import { LOCALES, t as dict } from '../../src/i18n/index.js';
import { howItsDoneLink } from '../../src/lib/guidePage.js';
import { strings, cmNumbers, chipRects, pinCount, touchingChips } from './helpers.js';

const SLUG = 'sew-a-zipper';
const KEY = 'zipper-lined';
const { STEPS, SPEC, DEFS, LABEL_KEYS, renderStep } = lined;
const LANGS = Object.keys(LINED_TEXT);
const MAKER = new Set(['20', '23', '0.5']);

/** The guide's own texts and the texts of its section `id` in a language: [where, text] (note only when it has one). */
function guideStrings(lang, id) {
  const g = guideText(guideBySlug(SLUG), lang);
  const s = g.sections.find((x) => x.id === id);
  assert.ok(s, `${lang}: no section "${id}"`);
  return [
    ...GUIDE_FIELDS.map((f) => [f, g[f]]),
    ...[...SECTION_FIELDS, ...SECTION_OPTIONAL].filter((f) => s[f] !== undefined).map((f) => [`sections.${id}.${f}`, s[f]]),
  ];
}

/** Every text of the `lined` section in a language: the figure's and the guide's. */
const linedStrings = (lang) => [...strings(linedText(lang)), ...guideStrings(lang, 'lined')];

test('every site language has the figure texts', () => {
  assert.deepEqual([...LANGS].sort(), [...LOCALES].sort());
});

// English gives inches in brackets after the cm, as on the makeup bag's page: 20 cm (7⅞ in), 23 cm (9 in), 0.5 cm (³⁄₁₆ in).
const INCH_OF = { 20: '7⅞', 23: '9', 0.5: '³⁄₁₆' };
const INCH_WORD = /\b(?:inch\p{L}*|Zoll|pouces?|pollici|pulgadas?)\b|дюйм/iu;

test("cm numbers are the maker's: only 20, 23 and 0.5 cm (figure, guide and section `lined`, every language); no mm, no inches as a unit", () => {
  for (const lang of LANGS) {
    for (const [where, s] of linedStrings(lang)) {
      for (const [m, n] of cmNumbers(s)) assert.ok(MAKER.has(n), `${lang} ${where}: "${m}" is not one of the maker's numbers`);
      assert.doesNotMatch(s, /\d[\s\xa0]*(?:mm|мм)(?!\p{L})/u, `${lang} ${where}: millimetres`);
      assert.doesNotMatch(s, INCH_WORD, `${lang} ${where}: inches as a unit`);
      const brackets = [...s.matchAll(/(\d+(?:[.,]\d+)?)[\s\xa0]*cm[\s\xa0]*\(([^()]*?)[\s\xa0]*in\)/g)];
      const inches = (s.match(/\bin\)/g) ?? []).length;
      assert.equal(brackets.length, inches, `${lang} ${where}: inches not right after a cm number`);
      if (lang !== 'en') assert.equal(inches, 0, `${lang} ${where}: inches`);
      for (const [m, cm, inch] of brackets) assert.equal(inch, INCH_OF[cm.replace(',', '.')], `${lang} ${where}: "${m}"`);
    }
  }
});

test("the numbers are the makeup bag's", () => {
  const C = cosmetic.SPEC;
  assert.equal(SPEC.zipper, C.zipper); // a 20 cm zipper…
  assert.equal(SPEC.side, C.outer[0]); // …in the middle of the 23 cm side
  assert.equal(SPEC.seam, C.seam); // 0.5 cm seams
  assert.deepEqual([...MAKER].sort(), [C.zipper, C.outer[0], C.seam].map(String).sort());
});

/** World lines a piece draws along the zipper (along x): stitches only — [{ id, y, z }]. */
const STITCHES = new Set(['stitch', 'seam', 'hot', 'hotstitch']);
function alongZipper(pieces) {
  const out = [];
  for (const p of pieces) {
    for (const l of p.lines ?? []) {
      if (!STITCHES.has(l.kind ?? 'stitch')) continue;
      const w = l.pts.map(([u, v]) => at(p, u, v));
      const flat = w.every((q) => Math.abs(q[1] - w[0][1]) < 1e-6 && Math.abs(q[2] - w[0][2]) < 1e-6);
      if (flat && Math.abs(w[w.length - 1][0] - w[0][0]) > 1) out.push({ id: p.id, y: w[0][1], z: w[0][2] });
    }
  }
  return out;
}
const isTape = (id) => /^zip-tape-[ab]$/.test(id);

test('no topstitching along the zipper: the figure draws only the two seams on the zipper tapes', () => {
  // no topstitch key, in the model or in any language
  for (const s of STEPS) assert.ok(s.stitch === undefined || s.stitch === 'straight', `stitch "${s.stitch}"`);
  for (const lang of LANGS) {
    const L = linedText(lang);
    for (const k of [...Object.keys(L.stitches), ...Object.keys(L.labels)]) assert.doesNotMatch(k, /top.?stitch/i, `${lang}: key ${k}`);
  }
  // the finished zipper, open and closed: exactly two lines along it, one on each tape — none on the outer or the lining
  for (const e of [0, 0.5, 1]) {
    const lines = alongZipper(lined.anatomy(e).pieces);
    assert.deepEqual(lines.map((l) => l.id).sort(), ['zip-tape-a', 'zip-tape-b'], `e=${e}: ${JSON.stringify(lines)}`);
  }
  // every step: stitch lines along the zipper are on its tapes; a seam being sewn (an overlay) lies where a tape's
  // stitch is drawn once the step is done, and only in a step that sews
  for (let k = 1; k < STEPS.length; k++) {
    const sewn = alongZipper(STEPS[k].scene(1).pieces).filter((l) => isTape(l.id)).map((l) => l.y);
    for (let i = 0; i <= 20; i++) {
      const s = STEPS[k].scene(i / 20);
      for (const l of alongZipper(s.pieces)) assert.ok(isTape(l.id), `step ${k} t=${i / 20}: a stitch along the zipper on ${l.id}`);
      for (const o of s.over.filter((x) => x.type === 'line' && (x.o ?? 1) > 0.01)) {
        const flat = o.pts.every((q) => Math.abs(q[1] - o.pts[0][1]) < 1e-6);
        if (!flat) continue;
        assert.ok(STEPS[k].stitch, `step ${k} t=${i / 20}: a line along the zipper in a step that does not sew`);
        assert.ok(sewn.some((y) => Math.abs(y - o.pts[0][1]) < 1e-6), `step ${k} t=${i / 20}: a seam at y=${o.pts[0][1]} is no tape's stitch`);
      }
    }
  }
});

test('the first frame (the HTML, no JS) is the finished zipper: sewn on both sides, the pull at the open end, the pins', () => {
  const ZX = (SPEC.side - SPEC.zipper) / 2; // where the zipper starts: its ends short of the side edges
  const byId = (e) => Object.fromEntries(lined.anatomy(e).pieces.map((p) => [p.id, p]));
  const rest = byId(0);
  for (const id of ['outer-far', 'lining-far', 'zip-tape-a', 'zip-tape-b', 'zip-pull']) assert.ok(rest[id], `no ${id} at rest`);
  for (const id of ['zip-tape-a', 'zip-tape-b']) {
    assert.equal(rest[id].lines.filter((l) => l.kind === 'stitch').length, 1, `${id}: its seam`);
    assert.ok((rest[id].opacity ?? 1) >= 0.999, `${id} is faded`);
  }
  // open: the pull at the start of the zipper, the teeth parted behind it all the way; tapped, it closes
  const pullX = (e) => byId(e)['zip-pull'].O[0];
  assert.ok(pullX(0) < ZX + SPEC.zipper * 0.15, `the pull is not at the open end: x=${pullX(0)}`);
  assert.ok(pullX(1) > ZX + SPEC.zipper * 0.85, `tapped, the pull does not close it: x=${pullX(1)}`);
  const len = (p) => (p ? Math.max(...p.pts.map((q) => q[0])) - Math.min(...p.pts.map((q) => q[0])) : 0);
  assert.ok(len(rest['zip-teeth-a']) > SPEC.zipper * 0.85 && len(rest['zip-teeth-b']) > SPEC.zipper * 0.85, 'the teeth are not parted along the zipper');
  assert.ok(len(rest['zip-teeth']) < SPEC.zipper * 0.15, 'the teeth are still closed');
  assert.ok(len(byId(1)['zip-teeth']) > SPEC.zipper * 0.85, 'tapped: the teeth do not close');
  for (const lang of LANGS) {
    const L = linedText(lang);
    assert.equal(pinCount(renderStep(0, 0, L).body), L.legend.length, `${lang}: pins in the first frame`);
    assert.equal(pinCount(renderStep(0, 1, L).body), 0, `${lang}: pins once closed`);
  }
});

// Spec 5.2, as approved: the card title, the h1, the page title and the section name (fr: a no-break space before ':').
const APPROVED = {
  en: ['How to sew a zipper', 'How to sew a zipper: pouch, bag, pillow, skirt and dress', 'How to Sew a Zipper: Pouch, Bag, Pillow, Skirt & Dress', 'Lined zipper pouch'],
  ru: ['Как вшить молнию', 'Как вшить молнию в косметичку, сумку, наволочку, юбку и платье', 'Как вшить молнию: в косметичку, сумку, наволочку, юбку', 'Молния с подкладкой (косметичка)'],
  de: ['Reißverschluss einnähen', 'Reißverschluss einnähen: Kosmetiktasche, Tasche, Kissen, Rock und Kleid', 'Reißverschluss einnähen: Tasche, Kissen, Rock & Kleid', 'Reißverschluss mit Futter'],
  fr: ['Coudre une fermeture éclair', 'Coudre une fermeture éclair\xa0: trousse, sac, coussin, jupe et robe', 'Coudre une fermeture éclair\xa0: trousse, sac, coussin, jupe', 'Fermeture éclair en sandwich (trousse doublée)'],
  it: ['Come cucire una cerniera', 'Come cucire una cerniera: pochette, borsa, cuscino, gonna e abito', 'Come cucire una cerniera: pochette, borsa, cuscino, gonna', 'Cerniera con fodera'],
  es: ['Cómo coser una cremallera', 'Cómo coser una cremallera (cierre): neceser, bolso, cojín, falda y vestido', 'Cómo coser una cremallera: neceser, bolso, cojín, falda', 'Cremallera con forro'],
};
const FIG1 = { en: 'Fig. 1', ru: 'Рис. 1', de: 'Abb. 1', fr: 'Fig. 1', it: 'Fig. 1', es: 'Fig. 1' };

test("the guide's titles are the approved ones (spec 5.2); the figure is Fig. 1 under the section's name", () => {
  for (const lang of LOCALES) {
    const g = guideText(guideBySlug(SLUG), lang);
    const [title, heading, pageTitle, name] = APPROVED[lang];
    assert.deepEqual([g.title, g.heading, g.pageTitle, g.sections[0].title], [title, heading, pageTitle, name], lang);
    assert.ok(g.pageTitle.length <= 60, `${lang}: pageTitle is ${g.pageTitle.length} characters`);
    // the figure's title: the section's name without the bracket (one line on a phone)
    assert.equal(linedText(lang).ui.title, name.replace(/\s*\([^)]*\)$/, ''), `${lang}: ui.title`);
    assert.equal(linedText(lang).ui.fig, FIG1[lang], `${lang}: ui.fig`);
  }
});

const sentences = (s) => s.split(/(?<=[.!?:;])\s+/);

test("no search traps in the guide's texts (spec 5.1)", () => {
  for (const lang of LOCALES) {
    const all = linedStrings(lang);
    for (const [where, s] of all) {
      if (lang === 'en') assert.doesNotMatch(s, /zipper sandwich/i, `en ${where}: "zipper sandwich" (sandwich bags)`);
      if (lang === 'ru') {
        assert.doesNotMatch(s, /замо?к/iu, `ru ${where}: «замок» — the site says «молния»`);
        assert.doesNotMatch(s, /ушк/iu, `ru ${where}: «ушки» (the phone pouch's loops)`);
        assert.doesNotMatch(s, /молни\p{L}* с планкой/iu, `ru ${where}: «молния с планкой» (a jacket's flap)`);
      }
      if (lang === 'de') assert.doesNotMatch(s, /(?<!naht)verdeckt/iu, `de ${where}: «verdeckt» without «naht-»`);
      if (lang === 'it') assert.doesNotMatch(s, /centrale|nascost/iu, `it ${where}: «centrale» / «nascosta» (door hinges)`);
      if (lang === 'es') assert.doesNotMatch(s, /cierre invisible/iu, `es ${where}: «cierre invisible» (knitting in Spain)`);
    }
    // it: «cerniera» is also a hinge — every sentence of the guide's texts that says it also says sewing or the item
    // (the section's name is the approved string, under an h1 that says «cucire»)
    if (lang === 'it') {
      for (const [where, s] of guideStrings(lang, 'lined').filter(([w]) => w !== 'sections.lined.title')) {
        for (const x of sentences(s).filter((y) => /cerniera/i.test(y))) {
          assert.match(x, /cuci|pochette|borsa|cuscin|federa|gonna|abito|vestito|astuccio/i, `it ${where}: «${x}» — «cerniera» with no sewing word`);
        }
      }
    }
  }
});

test('the lined section names no presser foot (the maker has not said which — spec 3.2)', () => {
  const FOOT = /\bfoot\b|\bfeet\b|лапк|Fuß|Füß|\bpied\b|piedin|prensatelas/iu;
  for (const lang of LOCALES) for (const [where, s] of linedStrings(lang)) assert.doesNotMatch(s, FOOT, `${lang} ${where}`);
  assert.ok(!STEPS.some((s) => (s.uses ?? []).includes('windman-presser-feet-set')), 'the presser feet set in a step');
  // the guide's "What you'll need" has the presser feet set only because a later section (tabs …) sews with the zipper foot
  const footIn = guideBySlug(SLUG).sections.filter((s) => figure(s.figure).model.STEPS.some((st) => (st.uses ?? []).includes('windman-presser-feet-set')));
  assert.ok(!footIn.some((s) => s.id === 'lined'), 'the lined section uses the presser feet set');
  assert.equal(guideBySlug(SLUG).needs.includes('windman-presser-feet-set'), footIn.length > 0, 'the presser feet set in "What you\'ll need" without a section that uses it');
});

test("how it's done from the makeup bag: steps 7 and 8 link to #lined in the same language; step 10 stays with the bag bottom", () => {
  const at = (k) => guidesForStep('cosmetic-bag', k).filter((x) => x.guide.slug === SLUG).map((x) => x.section.id);
  assert.deepEqual(at(7), ['lined']);
  assert.deepEqual(at(8), ['lined']);
  for (let k = 0; k < cosmetic.STEPS.length; k++) if (k !== 7 && k !== 8) assert.deepEqual(at(k), [], `cosmetic step ${k}`);
  assert.deepEqual(guidesForStep('cosmetic-bag', 10).map((x) => [x.guide.slug, x.section.id]), [['bag-bottom', 'cut-out']]);
  for (const k of [7, 8]) {
    const pairs = guidesForStep('cosmetic-bag', k);
    assert.equal(pairs.length, 1, `cosmetic step ${k}: one guide`);
    for (const lang of LOCALES) {
      const link = howItsDoneLink(pairs[0], lang);
      assert.equal(link.url, `${lang === 'en' ? '' : `/${lang}`}/guides/sew-a-zipper.html#lined`, `${lang} step ${k}`);
      assert.equal(link.text, `${dict(lang).ui.howItsDone} — ${APPROVED[lang][3]}`, `${lang} step ${k}`);
    }
  }
});

test('the guide: construction, no video, the section `lined` first (cosmetic bag steps 7, 8)', () => {
  const g = guideBySlug(SLUG);
  assert.equal(g.group, 'construction');
  assert.equal(g.figure, undefined);
  assert.equal(g.usedIn, undefined);
  assert.equal(g.video, undefined);
  assert.ok(typeof g.icon === 'string' && g.icon.trim());
  const s = g.sections[0];
  assert.deepEqual([s.id, s.figure], ['lined', KEY]);
  assert.deepEqual(s.usedIn, [{ project: 'cosmetic-bag', steps: [7, 8] }]);
  assert.ok(typeof s.note === 'string' && s.note.trim(), 'the note on topstitching');
});

test('"When to choose it" has no numbers; the note has none either', () => {
  for (const lang of LOCALES) {
    for (const s of guideText(guideBySlug(SLUG), lang).sections) {
      assert.doesNotMatch(s.choose, /\d/, `${lang} ${s.id}: choose`);
      if (s.note) assert.doesNotMatch(s.note, /\d/, `${lang} ${s.id}: note`);
    }
  }
});

test("needs: only products the sections' steps use, in the order they are used", () => {
  const g = guideBySlug(SLUG);
  const used = [...new Set(g.sections.flatMap((s) => figure(s.figure).model.STEPS.flatMap((st) => st.uses ?? [])))];
  assert.deepEqual(g.needs, used);
});

test('the figure ends at the open zipper; the last step sends the reader to the makeup bag for the rest', () => {
  const last = STEPS.length - 1;
  for (const lang of LOCALES) {
    const L = linedText(lang);
    const step = L.steps[last];
    // the makeup bag is linked under the figure ("Where it's used": cosmetic bag, steps 7, 8 — pageUrl, same language)
    const bag = { en: /makeup bag/i, ru: /косметичк/i, de: /Kosmetiktasche/i, fr: /trousse/i, it: /pochette/i, es: /neceser/i }[lang];
    assert.match(step.details[step.details.length - 1], bag, `${lang}: the last line names the makeup bag`);
  }
});

test('seven steps: the finished zipper, then six moves', () => {
  assert.equal(STEPS.length, 7);
  STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of LANGS) assert.equal(linedText(lang).steps.length, 7, lang);
});

test('uses are catalog products', () => {
  const ids = new Set(products.map((p) => p.id));
  STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  assert.deepEqual(STEPS.map((s) => s.uses ?? []), [
    [],
    [],
    ['soraco-sewing-clips'],
    ['janome-1522rd'],
    [],
    ['soraco-sewing-clips', 'janome-1522rd'],
    [],
  ]);
});

test('figure is registered (build and browser)', () => {
  const f = figure(KEY);
  assert.equal(f.model.STEPS, STEPS);
  assert.equal(f.text('it'), linedText('it'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'zipper-lined':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/zipper-lined\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/zipper-lined\.\?\?\.js'\)\s*\}/);
});

test('the model does not load the makeup bag (the guide page must not download it)', () => {
  const src = readFileSync(new URL('../../src/lib/anatomy/zipper-lined.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /from\s+'\.\/cosmetic/);
});

test('every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of LANGS) {
    const L = linedText(lang);
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
    const L = linedText(lang);
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
  for (const lang of LANGS) assert.deepEqual(Object.keys(linedText(lang).labels).sort(), [...LABEL_KEYS].sort(), lang);
});

test('a fully faded copy is never drawn (every step and the first frame)', () => {
  for (let i = 0; i <= 40; i++) {
    for (const p of lined.anatomy(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `e=${i / 40}: ${p.id}`);
    for (let k = 1; k < STEPS.length; k++) {
      for (const p of STEPS[k].scene(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `step ${k} t=${i / 40}: ${p.id}`);
    }
  }
});

test('language rules: no-break space before the unit, decimal comma, French punctuation, straight apostrophe', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of linedStrings(lang)) {
      assert.doesNotMatch(s, /\d\.\d/, `${lang} ${where}: decimal point`);
      if (lang !== 'ru') assert.doesNotMatch(s, /\d[ \t]*cm\b/, `${lang} ${where}: no no-break space before cm`);
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?]/, `fr ${where}: no no-break space before : ; ! ?`);
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

/* ===================================================================================================================
   Section 2, `tabs` — the zipper with fabric end tabs: a public technique, no maker's project (spec 3 row 2, 5.3
   «Раздел 2 — закрытые концы»). The sources agree: a strip of fabric folded like bias tape (two edges to the middle,
   then in half), pressed, slipped over the zipper's end, stitched along its folded edges just past the stop — never over
   the metal stops or the teeth; the other end the same way; then the zipper is sewn in like section 1 (not shown again:
   one sentence and a link to #lined). The tab's size differs from source to source → in words: "a little wider than the
   zipper tape". NO numbers and NO units, in any language (data.test.js allows 20 / 23 / 0.5 for the whole guide — this
   section's own test is the strict one). Presser foot: the zipper foot (Windman set) in the stitching steps.
   Figure src/lib/anatomy/zipper-tabs.js (key zipper-tabs), texts zipper-tabs.<lang>.js, checks zipper-tabs.text.js.
   =================================================================================================================== */
import * as tabs from '../../src/lib/anatomy/zipper-tabs.js';
import { TABS_TEXT, tabsText } from '../../src/lib/anatomy/zipper-tabs.text.js';
import { existsSync } from 'node:fs';
import { projects } from '../../src/data/projects.js';

const TABS = 'zipper-tabs';
const TABS_LANGS = Object.keys(TABS_TEXT);
/** The section's own texts in a language (not the guide's fields, which the lined tests cover): [where, text]. */
const tabsSection = (lang) => guideStrings(lang, 'tabs').filter(([where]) => where.startsWith('sections.tabs.'));
/** Every text of the section: the figure's (its number `ui.fig` aside) and the section's. */
const tabsStrings = (lang) => [...strings(tabsText(lang)).filter(([where]) => where !== 'ui.fig'), ...tabsSection(lang)];
const UNIT = /(?<!\p{L})(?:cm|mm|см|мм|inch(?:es)?|Zoll|pouces?|pollici|pulgadas?)(?!\p{L})/iu;

test('tabs: every site language has the figure texts', () => {
  assert.deepEqual([...TABS_LANGS].sort(), [...LOCALES].sort());
});

test('tabs: no units — no digit, no fraction, no unit (figure, chips, legend, section texts; every language)', () => {
  for (const lang of TABS_LANGS) {
    for (const [where, s] of tabsStrings(lang)) {
      assert.doesNotMatch(s, /\d/, `${lang} ${where}: a digit`);
      assert.doesNotMatch(s, /[¼½¾⅓⅔⅛⅜⅝⅞″%]|⁄/, `${lang} ${where}: a fraction or a unit sign`);
      assert.doesNotMatch(s, UNIT, `${lang} ${where}: a unit`);
    }
    // the figure number is the only digit, and it is just that
    assert.match(tabsText(lang).ui.fig, /^\S+\.? 2$/u, `${lang}: ui.fig`);
  }
  assert.deepEqual(tabs.SPEC, {}, 'the model has no maker\'s numbers');
});

// "a little wider than the zipper tape": the short chip and the full words of the steps, per language.
const WIDER = {
  en: { chip: /a little wider than the tape/, full: /a little wider than the zipper tape/ },
  ru: { chip: /чуть шире ленты молнии/u, full: /чуть шире ленты молнии/u },
  de: { chip: /etwas breiter als das Band/, full: /etwas breiter als das Reißverschlussband/ },
  fr: { chip: /un peu plus large que le ruban/, full: /un peu plus large que le ruban de la fermeture éclair/ },
  it: { chip: /un po' più larga del nastro/, full: /un po' più larga del nastro della cerniera/ },
  es: { chip: /un poco más ancha que la cinta/, full: /un poco más ancha que la cinta de la cremallera/ },
};

test('tabs: the tab size is in words — "a little wider than the zipper tape" (chip, step 1, the drawing)', () => {
  const D = tabs.DRAWING;
  for (const lang of LOCALES) {
    const L = tabsText(lang);
    assert.match(L.labels.widerThanTape, WIDER[lang].chip, `${lang}: the chip`);
    assert.match([L.steps[1].text, ...L.steps[1].details].join(' '), WIDER[lang].full, `${lang}: step 1`);
  }
  // the drawing: the strip (its dimension in step 1) and every tab are a little wider than the zipper, on both sides
  const dim = tabs.STEPS[1].scene(1).over.find((o) => o.label === 'widerThanTape');
  const len = Math.hypot(...dim.a.map((v, i) => v - dim.b[i]));
  assert.ok(len > D.tape && len < D.tape * 1.5, `the strip is ${len}, the zipper tape ${D.tape}`);
  assert.ok(D.over > 0 && D.over < D.tape / 4, `the tab overhangs each edge by ${D.over}: not "a little"`);
});

test('tabs: never sewn over the stops — every stitch of the figure lies on the bare tape past a stop (model geometry)', () => {
  const D = tabs.DRAWING;
  const [stopL, stopR] = D.stops; // [x0, x1] of the stop at each end; the teeth run between them
  assert.ok(stopL[1] <= D.teeth[0] + 1e-9 && D.teeth[1] <= stopR[0] + 1e-9, 'the teeth are not between the stops');
  const offStops = (x) => x < stopL[0] - 1e-9 || x > stopR[1] + 1e-9;
  /** World points of every stitch a frame draws: the pieces' stitch lines and the seams being sewn (overlays). */
  const stitchesOf = (s) => [
    ...s.pieces.flatMap((p) => (p.lines ?? []).filter((l) => STITCHES.has(l.kind ?? 'stitch')).map((l) => ({ id: p.id, w: l.pts.map(([u, v]) => at(p, u, v)) }))),
    ...s.over.filter((o) => o.type === 'line' && STITCHES.has(o.kind ?? 'hot') && (o.o ?? 1) > 0.01).map((o) => ({ id: 'overlay', w: o.pts })),
  ];
  const frames = [];
  for (let i = 0; i <= 20; i++) frames.push([`e=${i / 20}`, tabs.anatomy(i / 20)]);
  for (let k = 1; k < tabs.STEPS.length; k++) for (let i = 0; i <= 40; i++) frames.push([`step ${k} t=${i / 40}`, tabs.STEPS[k].scene(i / 40)]);
  let seen = 0;
  for (const [where, s] of frames) {
    for (const { id, w } of stitchesOf(s)) {
      seen++;
      for (const q of w) assert.ok(offStops(q[0]), `${where}: a stitch on ${id} at x=${q[0].toFixed(2)} — over a stop or the teeth (${stopL[0]}…${stopR[1]})`);
    }
  }
  assert.ok(seen > 0, 'no stitch drawn at all');
  // the finished zipper: exactly one stitch line on each tab, past its own stop, close to the tab's folded edges
  const rest = tabs.anatomy(0).pieces;
  for (const [end, stop, sign] of [['left', stopL, -1], ['right', stopR, 1]]) {
    const top = rest.find((p) => p.id === `tab-${end}-top`);
    assert.ok(top, `no ${end} tab`);
    const st = (top.lines ?? []).filter((l) => l.kind === 'stitch');
    assert.equal(st.length, 1, `${end} tab: its stitch line`);
    const xs = st[0].pts.map(([u, v]) => at(top, u, v)[0]);
    const edge = sign > 0 ? stop[1] + D.gap : stop[0] - D.gap; // the tab's folded edges, just past the stop
    for (const x of xs) {
      assert.ok(sign > 0 ? x > stop[1] : x < stop[0], `${end}: the stitch is not past the stop`);
      assert.ok(Math.abs(x - edge) < D.depth / 3, `${end}: the stitch is not close to the folded edges`);
    }
  }
});

test('tabs: each tab covers the zipper\'s end, a little wider than the tape, its folded edges just past the stop', () => {
  const D = tabs.DRAWING;
  const rest = tabs.anatomy(0).pieces;
  const span3 = (p, i) => { const w = p.pts.map(([u, v]) => at(p, u, v)[i]); return [Math.min(...w), Math.max(...w)]; };
  for (const [end, stop, cut] of [['left', D.stops[0], 0], ['right', D.stops[1], D.length]]) {
    const top = rest.find((p) => p.id === `tab-${end}-top`);
    const [x0, x1] = span3(top, 0), [y0, y1] = span3(top, 1);
    assert.ok(x0 <= cut && cut <= x1, `${end}: the tab does not cover the zipper's cut end`);
    assert.ok(Math.abs(y0 + D.over) < 1e-9 && Math.abs(y1 - D.tape - D.over) < 1e-9, `${end}: the tab is not a little wider than the tape on both sides`);
    assert.ok(end === 'left' ? x1 < stop[0] : x0 > stop[1], `${end}: the tab lies over the stop`);
    assert.ok(Math.abs((x1 - x0) - D.depth) < 1e-9, `${end}: the tab is not one quarter of the strip`);
  }
  // made like bias tape: after step 3 the strip is folded in four, a quarter of its width, the right side out on top
  const folded = tabs.STEPS[3].scene(1).pieces.filter((p) => /^strip-\d$/.test(p.id));
  assert.equal(folded.length, 4, 'the strip is not in four panels');
  const xs = folded.flatMap((p) => span3(p, 0));
  assert.ok(Math.max(...xs) - Math.min(...xs) < D.depth + 1e-6, 'folded, the strip is wider than the tab');
  const topPanel = folded[folded.length - 1];
  assert.ok(topPanel.out[2] > 0.99 && topPanel.fill.includes('print'), 'the right side is not out on top');
  // step 2 ends with the two edges at the middle: two panels turned over, two not
  const edges = tabs.STEPS[2].scene(1).pieces.filter((p) => /^strip-\d$/.test(p.id));
  assert.deepEqual(edges.map((p) => p.out[2] > 0).sort(), [false, false, true, true], 'step 2: not two edges turned over');
});

// The other way's name in each language, as the last step's last line says it (the link is under the figure).
const LINED_WORDS = { en: /lined zipper pouch/i, ru: /с подкладкой/u, de: /mit Futter/, fr: /en sandwich/, it: /con fodera/, es: /con forro/ };

test('tabs: points to #lined — the rest is sewn as in section 1, one sentence and a link on the same page', () => {
  const s = guideBySlug(SLUG).sections.find((x) => x.id === 'tabs');
  assert.equal(s.restIn, 'lined', 'the section does not point to #lined');
  const lined1 = guideBySlug(SLUG).sections.findIndex((x) => x.id === 'lined');
  for (const lang of LOCALES) {
    const tr = guideText(guideBySlug(SLUG), lang).sections.find((x) => x.id === 'tabs');
    assert.ok(typeof tr.rest === 'string' && tr.rest.trim(), `${lang}: no "rest" sentence`);
    assert.match(tr.rest, LINED_WORDS[lang], `${lang}: the sentence does not name the first way`);
    const L = tabsText(lang);
    const last = L.steps[L.steps.length - 1];
    assert.match(last.details[last.details.length - 1], LINED_WORDS[lang], `${lang}: the last step does not send the reader to the first way`);
    // the built page (dist): inside <section id="tabs">, a plain link to #lined (our own page, not Amazon) with its title
    const file = new URL(`../../dist/${lang === 'en' ? '' : `${lang}/`}guides/sew-a-zipper.html`, import.meta.url);
    assert.ok(existsSync(file), `${lang}: run npm run build first`);
    const html = readFileSync(file, 'utf8');
    // the section: from its opening tag to the next page section (the figure holds <section>s of its own)
    const from = html.search(/<section[^>]*id="tabs"/);
    assert.ok(from >= 0, `${lang}: no <section id="tabs">`);
    const next = html.indexOf('<section class="section', from + 1);
    const sec = html.slice(from, next < 0 ? undefined : next);
    const link = sec.match(/<a\b[^>]*href="#lined"[^>]*>([\s\S]*?)<\/a>/);
    assert.ok(link, `${lang}: no link to #lined in the tabs section`);
    assert.doesNotMatch(link[0], /amazon|sponsored|target=/i, `${lang}: the link to #lined is not a plain link`);
    const title = guideText(guideBySlug(SLUG), lang).sections[lined1].title;
    const esc = (x) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    assert.ok(link[1].includes(esc(title)), `${lang}: the link does not say "${title}"`);
    assert.ok(html.includes('id="lined"'), `${lang}: no #lined on the page`);
  }
});

const STOP_WORD = { en: /\bstops?\b/, ru: /ограничител/u, de: /Stopper/, fr: /\barrêts?\b/, it: /\bferm[oi]\b/, es: /\btopes?\b/ };
const NOT_WORD = { en: /\b(?:not|never)\b/, ru: /(?:^|\s)не\s/u, de: /\b(?:nicht|nie)\b/, fr: /\b(?:pas|jamais)\b/, it: /\b(?:non|mai)\b/, es: /\b(?:no|nunca)\b/ };

test('tabs: the stitching steps say what NOT to do — never over the stop (chip and written steps)', () => {
  const sewing = tabs.STEPS.map((s, k) => (s.stitch ? k : -1)).filter((k) => k > 0);
  assert.ok(sewing.length >= 2, 'both ends are stitched');
  for (const lang of LOCALES) {
    const L = tabsText(lang);
    assert.match(L.labels.notOverStop, STOP_WORD[lang], `${lang}: chip notOverStop`);
    assert.match(L.labels.notOverStop, NOT_WORD[lang], `${lang}: chip notOverStop says no "not"`);
    for (const k of sewing) {
      const all = [L.steps[k].text, ...L.steps[k].details].join(' ');
      assert.match(all, STOP_WORD[lang], `${lang} step ${k}: the stop`);
      assert.match(all, NOT_WORD[lang], `${lang} step ${k}: no "not over the stop"`);
    }
  }
  // the chip is shown where the stitch is sewn
  for (const k of sewing) assert.ok(tabs.STEPS[k].scene(0).over.some((o) => o.label === 'notOverStop'), `step ${k}: no chip "not over the stop"`);
});

// The zipper foot: spec 3 «Лапка» — sections 2–5 sew with the zipper foot (the Windman set).
const ZIPPER_FOOT = { en: /zipper foot/, ru: /лапк\p{L}* для молнии/u, de: /Reißverschlussfuß/, fr: /pied fermeture éclair/, it: /piedino per cerniere/, es: /prensatelas para cremalleras/ };

test('tabs: sewn with the zipper foot — named in the stitching steps, linked there (Windman set)', () => {
  tabs.STEPS.forEach((s, k) => {
    const foot = (s.uses ?? []).includes('windman-presser-feet-set');
    assert.equal(foot, Boolean(s.stitch), `step ${k}: the presser feet set ${foot ? 'in a step that does not sew' : 'missing where it sews'}`);
  });
  for (const lang of LOCALES) {
    const L = tabsText(lang);
    tabs.STEPS.forEach((s, k) => {
      if (s.stitch) assert.match([L.steps[k].text, ...L.steps[k].details].join(' '), ZIPPER_FOOT[lang], `${lang} step ${k}: no zipper foot`);
    });
  }
  assert.ok(guideBySlug(SLUG).needs.includes('windman-presser-feet-set'), 'the presser feet set is not in "What you\'ll need"');
});

test('tabs: the zippers are a general recommendation — the texts never speak of the maker or in the first person', () => {
  // per language, a word on its own: letters on neither side (\b is ASCII-only in JS, so it would miss the Cyrillic words)
  const W = (words) => new RegExp(`(?<!\\p{L})(?:${words})(?!\\p{L})`, 'u');
  const MINE = {
    en: W('I|my|me|mom|maker'), ru: W('я|мой|моя|моё|мои|мам\\p{L}*'), de: W('ich|mein\\p{L}*|Mama'),
    fr: W("je|j'|mon|ma|mes|maman"), it: W('io|mio|mia|miei|mie|mamma'), es: W('yo|mi|mis|mamá'),
  };
  assert.match('это я сама', MINE.ru); // the check itself works on Cyrillic
  assert.doesNotMatch('язычок', MINE.ru);
  for (const lang of LOCALES) for (const [where, s] of tabsStrings(lang)) assert.doesNotMatch(s, MINE[lang], `${lang} ${where}: a first-person or maker claim`);
});

const TABS_NAME = { en: 'Zipper with end tabs', ru: 'Закрытые концы молнии', de: 'Reißverschluss-Enden einfassen', fr: 'Extrémités finies (languettes)', it: 'Estremità rifinite (linguette)', es: 'Extremos rematados' };
const FIG2 = { en: 'Fig. 2', ru: 'Рис. 2', de: 'Abb. 2', fr: 'Fig. 2', it: 'Fig. 2', es: 'Fig. 2' };

test('tabs: the section name is the approved one (spec 5.2); the figure is Fig. 2 under it', () => {
  for (const lang of LOCALES) {
    const g = guideText(guideBySlug(SLUG), lang);
    assert.equal(g.sections[1].title, TABS_NAME[lang], lang);
    assert.equal(tabsText(lang).ui.title, TABS_NAME[lang].replace(/\s*\([^)]*\)$/, ''), `${lang}: ui.title`);
    assert.equal(tabsText(lang).ui.fig, FIG2[lang], `${lang}: ui.fig`);
  }
});

test('tabs: second, after lined; no project yet, so no "Where it\'s used" and no note', () => {
  const g = guideBySlug(SLUG);
  assert.deepEqual(g.sections.slice(0, 2).map((s) => [s.id, s.figure]), [['lined', KEY], ['tabs', TABS]]);
  const s = g.sections[1];
  assert.deepEqual(s.usedIn, []);
  for (const lang of LOCALES) {
    const tr = guideText(g, lang).sections[1];
    assert.equal(tr.note, undefined, `${lang}: a note`);
    for (const f of SECTION_FIELDS) assert.ok(tr[f].trim(), `${lang}: ${f}`);
    if (lang !== 'en') for (const f of ['line', 'choose', 'rest']) assert.notEqual(tr[f], s[f], `${lang}: ${f} not translated`);
  }
  for (const p of projects) {
    const n = figure(p.slug).model.STEPS.length;
    for (let k = 0; k < n; k++) assert.ok(!guidesForStep(p.slug, k).some((x) => x.section.id === 'tabs'), `${p.slug} step ${k} links to #tabs`);
  }
});

test('tabs: no search traps (spec 5.1) — figure and section texts', () => {
  for (const lang of LOCALES) {
    for (const [where, s] of tabsStrings(lang)) {
      if (lang === 'en') assert.doesNotMatch(s, /sandwich/i, `en ${where}: "sandwich" (zipper sandwich = sandwich bags)`);
      if (lang === 'ru') {
        assert.doesNotMatch(s, /замо?к/iu, `ru ${where}: «замок» — the site says «молния»`);
        assert.doesNotMatch(s, /ушк/iu, `ru ${where}: «ушки» (the phone pouch's loops)`);
        assert.doesNotMatch(s, /молни\p{L}* с планкой/iu, `ru ${where}: «молния с планкой»`);
      }
      if (lang === 'de') assert.doesNotMatch(s, /(?<!naht)verdeckt/iu, `de ${where}: «verdeckt»`);
      if (lang === 'it') assert.doesNotMatch(s, /centrale|nascost/iu, `it ${where}: «centrale» / «nascosta» (door hinges)`);
      if (lang === 'es') assert.doesNotMatch(s, /cierre/iu, `es ${where}: «cierre» (once, in the h1, only)`);
    }
    // it: in the section's own texts, every sentence with «cerniera» also says sewing or the item
    if (lang === 'it') {
      for (const [where, s] of tabsSection(lang)) {
        for (const x of sentences(s).filter((y) => /cerniera/i.test(y))) {
          assert.match(x, /cuci|pochette|borsa|cuscin|federa|gonna|abito|vestito|astuccio/i, `it ${where}: «${x}» — «cerniera» with no sewing word`);
        }
      }
    }
  }
});

test('tabs: language rules — French punctuation, straight apostrophe', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of tabsStrings(lang)) {
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?»]/, `fr ${where}: no no-break space before : ; ! ? »`);
      if (lang === 'fr') assert.doesNotMatch(s, /«(?!\xa0)/, `fr ${where}: no no-break space after «`);
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

test('tabs: steps — the finished zipper, then cut, fold twice, slip on, stitch, the other end', () => {
  assert.equal(tabs.STEPS.length, 7);
  tabs.STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of TABS_LANGS) assert.equal(tabsText(lang).steps.length, 7, lang);
  assert.deepEqual(tabs.STEPS.map((s) => s.stitch ?? null), [null, null, null, null, null, 'straight', 'straight']);
});

test('tabs: uses are catalog products', () => {
  const ids = new Set(products.map((p) => p.id));
  tabs.STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  assert.deepEqual(tabs.STEPS.map((s) => s.uses ?? []), [
    [],
    ['mandala-crafts-zippers', 'tailor-scissors'],
    ['rowenta-travel-iron'],
    ['rowenta-travel-iron'],
    [],
    ['windman-presser-feet-set', 'janome-1522rd'],
    ['windman-presser-feet-set', 'janome-1522rd'],
  ]);
});

test('tabs: figure is registered (build and browser)', () => {
  const f = figure(TABS);
  assert.equal(f.model.STEPS, tabs.STEPS);
  assert.equal(f.text('it'), tabsText('it'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'zipper-tabs':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/zipper-tabs\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/zipper-tabs\.\?\?\.js'\)\s*\}/);
});

test('tabs: every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of TABS_LANGS) {
    const L = tabsText(lang);
    for (let k = 0; k < tabs.STEPS.length; k++) {
      for (let i = 0; i <= 10; i++) {
        const r = tabs.renderStep(k, i / 10, L);
        assert.ok(r.viewBox.every(Number.isFinite), `${lang} step ${k} t=${i / 10}: viewBox`);
        assert.ok(!r.body.includes('NaN') && !r.body.includes('undefined'), `${lang} step ${k} t=${i / 10}: body`);
        for (const m of r.body.matchAll(/url\(#([^)]+)\)/g)) assert.ok(m[1].startsWith(`${TABS}-`), `${lang} step ${k}: #${m[1]}`);
      }
    }
  }
  for (const m of tabs.DEFS.matchAll(/id="([^"]+)"/g)) assert.ok(m[1].startsWith(`${TABS}-`), `DEFS: #${m[1]}`);
});

test('tabs: chips stay inside the figure and keep a 1% gap between them (every step, t = 0…1, every language)', () => {
  for (const lang of TABS_LANGS) {
    const L = tabsText(lang);
    for (let k = 1; k < tabs.STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox } = tabs.renderStep(k, i / 20, L);
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

test('tabs: lines are drawn before the chips', () => {
  for (let k = 1; k < tabs.STEPS.length; k++) {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const kinds = tabs.STEPS[k].scene(t).over.map((o) => o.type);
      const lastLine = kinds.lastIndexOf('line');
      const firstChip = kinds.findIndex((x) => x === 'label' || x === 'dim');
      assert.ok(lastLine < firstChip || firstChip < 0, `step ${k} t=${t}: a line comes after a chip`);
    }
  }
});

test('tabs: every chip key of the drawing has its text', () => {
  for (const lang of TABS_LANGS) assert.deepEqual(Object.keys(tabsText(lang).labels).sort(), [...tabs.LABEL_KEYS].sort(), lang);
});

test('tabs: the first frame (the HTML, no JS) is the finished zipper with both tabs, and the pins; tapped, the tabs lift', () => {
  const ids = (e) => tabs.anatomy(e).pieces.map((p) => p.id);
  for (const id of ['tab-left-top', 'tab-right-top', 'zip-tape-a', 'zip-tape-b', 'zip-stop-right']) assert.ok(ids(0).includes(id), `no ${id} at rest`);
  const z = (e, id) => tabs.anatomy(e).pieces.find((p) => p.id === id).O[2];
  assert.ok(z(1, 'tab-right-top') > z(0, 'tab-right-top') + 1, 'tapped, the tab does not lift');
  for (const lang of TABS_LANGS) {
    const L = tabsText(lang);
    assert.equal(pinCount(tabs.renderStep(0, 0, L).body), L.legend.length, `${lang}: pins in the first frame`);
    assert.equal(pinCount(tabs.renderStep(0, 1, L).body), 0, `${lang}: pins once lifted`);
  }
  for (let i = 0; i <= 40; i++) {
    for (const p of tabs.anatomy(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `e=${i / 40}: ${p.id}`);
    for (let k = 1; k < tabs.STEPS.length; k++) {
      for (const p of tabs.STEPS[k].scene(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `step ${k} t=${i / 40}: ${p.id}`);
    }
  }
});

test('tabs: the model loads no other model', () => {
  const src = readFileSync(new URL('../../src/lib/anatomy/zipper-tabs.js', import.meta.url), 'utf8');
  for (const m of src.matchAll(/from\s+'\.\/([^']+)'/g)) assert.ok(['iso.js', 'kit.js'].includes(m[1]), `imports ${m[1]}`);
});

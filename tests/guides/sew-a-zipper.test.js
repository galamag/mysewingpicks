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

const LEAD_FIELDS = ['blurb', 'pageDescription', 'teaser', 'needsIntro'];
test('the lined section names no presser foot (the maker has not said which — spec 3.2)', () => {
  const FOOT = /\bfoot\b|\bfeet\b|лапк|Fuß|Füß|\bpied\b|piedin|prensatelas/iu;
  // the figure's texts and the section's own texts; the guide-level texts (blurb …) name the feet of the OTHER ways
  // (tabs … invisible) and are checked by 'guide texts: the zipper foot for …' below
  for (const lang of LOCALES) {
    for (const [where, s] of linedStrings(lang)) {
      if (LEAD_FIELDS.includes(where)) continue;
      assert.doesNotMatch(s, FOOT, `${lang} ${where}`);
    }
  }
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
const ZIPPER_FOOT = { en: /zipper foot/, ru: /лапк\p{L}* для молнии/iu, de: /Reißverschlussfuß/, fr: /pied fermeture éclair/, it: /piedino per cerniere/, es: /prensatelas para cremalleras/ };

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

/* ===================================================================================================================
   Section 3, `recessed` — the zipper set in a panel at the top of a lined bag, below the edge: a public technique, no
   maker's project (spec 3 row 3, 5.3 «Раздел 3 — вставка по верху сумки»). The sources agree: four strips (two for each
   side of the zipper) as long as the top edge of the bag, often with interfacing; each zipper tape between two strips,
   right sides inward, stitched; turned out, pressed away from the teeth, topstitched close to the teeth; the other side
   the same way; the ends closed (tabs — section 2, a link to #tabs); the panel sewn to the LINING, middles matched; then
   the outer and the lining are joined as usual. The bag opens wide, the zipper sits below the edge. Strip width,
   allowances, how much longer the zipper is — in words. NO numbers and NO units, in any language.
   Figure src/lib/anatomy/zipper-recessed.js (key zipper-recessed), texts zipper-recessed.<lang>.js, checks
   zipper-recessed.text.js.
   =================================================================================================================== */
import * as recessed from '../../src/lib/anatomy/zipper-recessed.js';
import { RECESSED_TEXT, recessedText } from '../../src/lib/anatomy/zipper-recessed.text.js';

const REC = 'zipper-recessed';
const REC_LANGS = Object.keys(RECESSED_TEXT);
/** The section's own texts in a language: [where, text]. */
const recSection = (lang) => guideStrings(lang, 'recessed').filter(([where]) => where.startsWith('sections.recessed.'));
/** Every text of the section: the figure's (its number `ui.fig` aside) and the section's. */
const recStrings = (lang) => [...strings(recessedText(lang)).filter(([where]) => where !== 'ui.fig'), ...recSection(lang)];
/** A step's written words: its caption and its details. */
const stepWords = (L, k) => [L.steps[k].text, ...(L.steps[k].details ?? [])].join(' ');
/** The world box of a piece: [[x0, x1], [y0, y1], [z0, z1]]. */
const box3 = (p) => [0, 1, 2].map((i) => { const w = p.pts.map(([u, v]) => at(p, u, v)[i]); return [Math.min(...w), Math.max(...w)]; });
/** The step that sews the panel to the lining (its machine works on the lining). */
const liningStep = () => {
  const ks = recessed.STEPS.map((s, k) => ((s.sew ?? []).some(([, , f]) => f === 'lining') ? k : -1)).filter((k) => k > 0);
  assert.equal(ks.length, 1, `one step sews the panel to the lining: ${ks}`);
  return ks[0];
};
/** The step that closes the zipper's ends (its chip "ends: as in the second way"). */
const endsStep = () => recessed.STEPS.findIndex((st, k) => k > 0 && st.scene(0).over.some((o) => o.label === 'endsTabs'));

test('recessed: every site language has the figure texts', () => {
  assert.deepEqual([...REC_LANGS].sort(), [...LOCALES].sort());
});

test('recessed: no units — no digit, no fraction, no unit (figure, chips, legend, section texts; every language)', () => {
  for (const lang of REC_LANGS) {
    for (const [where, s] of recStrings(lang)) {
      assert.doesNotMatch(s, /\d/, `${lang} ${where}: a digit`);
      assert.doesNotMatch(s, /[¼½¾⅓⅔⅛⅜⅝⅞″%]|⁄/, `${lang} ${where}: a fraction or a unit sign`);
      assert.doesNotMatch(s, UNIT, `${lang} ${where}: a unit`);
    }
    assert.match(recessedText(lang).ui.fig, /^\S+\.? 3$/u, `${lang}: ui.fig`);
  }
  assert.deepEqual(recessed.SPEC, {}, 'the model has no maker\'s numbers');
});

test('recessed: the panel goes on the lining — each strip of the panel is sewn to a lining piece, middles matched, never to the outer (model scene)', () => {
  const k = liningStep();
  assert.equal(k, recessed.STEPS.length - 2, 'the panel goes on the lining last, before the bag is put together');
  // no outer fabric anywhere while the panel is made and sewn on (steps 1 … k): only strips, zipper, tabs, lining
  for (let s = 1; s <= k; s++) {
    for (let i = 0; i <= 20; i++) {
      for (const p of recessed.STEPS[s].scene(i / 20).pieces) assert.doesNotMatch(p.id, /outer|bag-/, `step ${s} t=${i / 20}: ${p.id}`);
    }
  }
  const end = recessed.STEPS[k].scene(1).pieces;
  const linings = end.filter((p) => /^lining-/.test(p.id));
  assert.equal(linings.length, 2, 'two lining pieces: the front and the back');
  const strips = end.filter((p) => /^strip-/.test(p.id));
  const D = recessed.DRAWING;
  for (const lin of linings) {
    assert.match(lin.fill, /lining/, `${lin.id}: not the lining fabric`);
    const [lx, ly] = box3(lin);
    // a strip shares an edge with this lining piece: along the zipper, the whole strip's length
    const join = strips.map((s) => [s, box3(s)]).find(([, [, sy]]) => Math.abs(sy[0] - ly[1]) < 1e-6 || Math.abs(sy[1] - ly[0]) < 1e-6);
    assert.ok(join, `${lin.id}: no panel strip edge on it`);
    const [, [sx, sy]] = join;
    const y = Math.abs(sy[0] - ly[1]) < 1e-6 ? ly[1] : ly[0];
    assert.ok(Math.abs(sx[1] - sx[0] - D.strip) < 1e-6, `${lin.id}: the strip is not the strip's length`);
    assert.ok(lx[0] <= sx[0] + 1e-6 && sx[1] <= lx[1] + 1e-6, `${lin.id}: the strip runs past the lining`);
    assert.ok(Math.abs((lx[0] + lx[1]) / 2 - (sx[0] + sx[1]) / 2) < 1e-6, `${lin.id}: middles not matched`);
    // the seam: a stitch line on the join, the length of the strip
    const seams = (lin.lines ?? []).filter((l) => l.kind === 'stitch').map((l) => l.pts.map(([u, v]) => at(lin, u, v)));
    const seam = seams.find((w) => w.every((q) => Math.abs(q[1] - y) < 0.3));
    assert.ok(seam, `${lin.id}: no seam along the panel's edge`);
    assert.ok(Math.abs(seam[seam.length - 1][0] - seam[0][0]) > 0.9 * D.strip, `${lin.id}: the seam does not run the strip's length`);
  }
  // the seams being sewn (overlays) lie on these joins
  const joins = linings.flatMap((l) => box3(l)[1]);
  for (let i = 0; i <= 40; i++) {
    for (const o of recessed.STEPS[k].scene(i / 40).over.filter((x) => x.type === 'line' && x.kind === 'hot' && (x.o ?? 1) > 0.01)) {
      const along = Math.abs(o.pts[o.pts.length - 1][0] - o.pts[0][0]) > 1;
      if (along) assert.ok(o.pts.every((q) => joins.some((y) => Math.abs(q[1] - y) < 0.3)), `t=${i / 40}: a seam off the lining's edge`);
    }
  }
  // the step says it in every language: to the lining, not to the outer; the middles matched
  const LINING = { en: /lining/, ru: /подкладк/u, de: /Futter/, fr: /doublure/, it: /fodera/, es: /forro/ };
  const OUTER = { en: /\bouter\b/, ru: /(?<!\p{L})верх(?:у|а|ом)?(?!\p{L})/u, de: /Außenteil/, fr: /extérieur/, it: /esterno/, es: /exterior/ };
  const MIDDLE = { en: /middle/, ru: /середин/u, de: /Mitte/, fr: /milieu/, it: /centri/, es: /centros/ };
  for (const lang of LOCALES) {
    const L = recessedText(lang);
    const w = stepWords(L, k);
    assert.match(L.labels.toLining, LINING[lang], `${lang}: chip toLining`);
    assert.match(w, LINING[lang], `${lang} step ${k}: the lining`);
    assert.match(w, OUTER[lang], `${lang} step ${k}: "not the outer"`);
    assert.match(w, NOT_WORD[lang], `${lang} step ${k}: "not the outer"`);
    assert.match(w, MIDDLE[lang], `${lang} step ${k}: the middles`);
    assert.match(L.labels.middles, MIDDLE[lang], `${lang}: chip middles`);
  }
});

test('recessed: strips as long as the top edge, the zipper a little longer; in the bag the zipper sits below the edge and opens wide', () => {
  const D = recessed.DRAWING;
  // step 1: the strips' length is the dimension, in words
  const dim = recessed.STEPS[1].scene(1).over.find((o) => o.label === 'topLength');
  assert.ok(dim, 'no dimension "as long as the top edge" in step 1');
  assert.ok(Math.abs(Math.hypot(...dim.a.map((v, i) => v - dim.b[i])) - D.strip) < 1e-6, 'the dimension is not the strip\'s length');
  assert.ok(D.zipper > D.strip && D.zipper < D.strip * 1.3, `the zipper (${D.zipper}) is not a little longer than the strips (${D.strip})`);
  // the finished bag: its top edge is as long as the strips; the panel runs along it
  const byId = (e) => Object.fromEntries(recessed.anatomy(e).pieces.map((p) => [p.id, p]));
  const rest = byId(0);
  const [fx, , fz] = box3(rest['bag-front']);
  assert.ok(Math.abs(fx[1] - fx[0] - D.strip) < 1e-6, 'the bag\'s top edge is not the strips\' length');
  const H = fz[1];
  for (const side of ['back', 'front']) {
    const [sx, , sz] = box3(rest[`panel-${side}-strip`]);
    assert.ok(Math.abs(sx[0] - fx[0]) < 1e-6 && Math.abs(sx[1] - fx[1]) < 1e-6, `${side}: the panel does not run the top edge`);
    assert.ok(Math.abs(sz[1] - H) < 1e-6, `${side}: the panel does not start at the top edge`);
  }
  // closed: the zipper's two halves meet, below the edge
  const teeth = (e, side) => box3(byId(e)[`panel-${side}-teeth`]);
  const [, yb0, zb0] = teeth(0, 'back'), [, yf0] = teeth(0, 'front');
  assert.ok(Math.abs(yb0[1] - yf0[0]) < 0.05, 'closed, the zipper halves do not meet');
  assert.ok(zb0[1] < H - 0.5, 'the zipper is not below the edge');
  // opened (tap): the halves part all the way to the walls — the bag opens wide
  const [, yb1] = teeth(1, 'back'), [, yf1] = teeth(1, 'front');
  const [, fy] = box3(rest['bag-front']), [, by] = box3(rest['bag-back']);
  assert.ok(yf1[0] - yb1[1] > 0.85 * (fy[0] - by[0]), 'opened, the bag does not open wide');
  // the words: step 1 and its chips say the lengths in words
  const TOP = { en: /as long as the top edge/, ru: /длиной с верхний край/u, de: /so lang wie die Oberkante/, fr: /aussi longues? que le haut/, it: /lung(?:a|he) quanto il bordo/, es: /tan largas? como el borde/ };
  const LONGER = { en: /a little longer/, ru: /чуть длиннее/u, de: /etwas länger/, fr: /un peu plus longue/, it: /un po' più lunga/, es: /un poco más larga/ };
  for (const lang of LOCALES) {
    const L = recessedText(lang);
    assert.match(L.labels.topLength, TOP[lang], `${lang}: chip topLength`);
    assert.match(L.labels.zipperLonger, LONGER[lang], `${lang}: chip zipperLonger`);
    assert.match(stepWords(L, 1), TOP[lang], `${lang} step 1: the strips' length`);
    assert.match(stepWords(L, 1), LONGER[lang], `${lang} step 1: the zipper's length`);
  }
});

test('recessed: each zipper tape between two strips, right sides inward; turned out, topstitched close to the teeth on both sides', () => {
  // step 2 ends with the sandwich: a strip right side up, the zipper face down on it, a strip face down on top
  const s2 = recessed.STEPS[2].scene(1).pieces;
  const a1 = s2.find((p) => p.id === 'strip-a1'), a2 = s2.find((p) => p.id === 'strip-a2');
  const tape = s2.filter((p) => /^zip-tape-/.test(p.id));
  assert.ok(a1 && a2 && tape.length === 2, 'step 2: no strips or no zipper');
  assert.ok(a1.out[2] > 0.99 && a2.out[2] < -0.99, 'step 2: the strips are not right sides inward');
  for (const t of tape) assert.ok(t.out[2] < -0.99, 'step 2: the zipper is not face down');
  const z = (p) => box3(p)[2][0];
  assert.ok(z(a1) < z(tape[0]) && z(tape[0]) < z(a2), 'step 2: the zipper is not between the strips');
  // step 6 ends with the finished panel: the zipper face up, a topstitch on each top strip along the zipper, close to it
  const D = recessed.DRAWING;
  const s6 = recessed.STEPS[6].scene(1).pieces;
  const tapes6 = s6.filter((p) => /^zip-tape-/.test(p.id));
  for (const t of tapes6) assert.ok(t.out[2] > 0.99, 'step 6: the zipper is not face up');
  const zy = tapes6.flatMap((p) => box3(p)[1]);
  const [zy0, zy1] = [Math.min(...zy), Math.max(...zy)];
  for (const id of ['strip-a1', 'strip-c1']) {
    const p = s6.find((x) => x.id === id);
    assert.ok(p && p.out[2] > 0.99, `${id}: not right side up`);
    const st = (p.lines ?? []).filter((l) => l.kind === 'stitch').map((l) => l.pts.map(([u, v]) => at(p, u, v)));
    assert.equal(st.length, 1, `${id}: its topstitching`);
    const y = st[0][0][1];
    assert.ok(st[0].every((q) => Math.abs(q[1] - y) < 1e-6) && Math.abs(st[0][1][0] - st[0][0][0]) > 0.9 * D.strip, `${id}: the topstitch does not run along the zipper`);
    const gap = Math.min(Math.abs(y - zy0), Math.abs(y - zy1));
    assert.ok(gap < D.width / 4, `${id}: the topstitch is not close to the zipper (${gap})`);
  }
});

// The second way's name in each language (the ends are closed as there).
const TABS_WORDS = { en: /end tabs/i, ru: /закрытые концы молнии/iu, de: /Reißverschluss-Enden einfassen/, fr: /languettes/, it: /linguette/, es: /extremos rematados/i };

test('recessed: the ends are closed as in section 2 — a sentence and a link to #tabs on the same page', () => {
  const s = guideBySlug(SLUG).sections.find((x) => x.id === 'recessed');
  assert.equal(s.restIn, 'tabs', 'the section does not point to #tabs');
  const tabsAt = guideBySlug(SLUG).sections.findIndex((x) => x.id === 'tabs');
  const ends = endsStep();
  assert.ok(ends > 0, 'no step closes the ends');
  for (const lang of LOCALES) {
    const tr = guideText(guideBySlug(SLUG), lang).sections.find((x) => x.id === 'recessed');
    assert.ok(typeof tr.rest === 'string' && tr.rest.trim(), `${lang}: no "rest" sentence`);
    assert.match(tr.rest, TABS_WORDS[lang], `${lang}: the sentence does not name the second way`);
    const L = recessedText(lang);
    assert.match(stepWords(L, ends), TABS_WORDS[lang], `${lang} step ${ends}: the ends step does not name the second way`);
    for (const [where, x] of recStrings(lang)) assert.doesNotMatch(x, /under th\w+ figure|под рисунком|unter der Abbildung|sous (?:la|cette) figure|sotto (?:la|questa) figura|debajo de (?:la|esta) figura|bajo (?:la|esta) figura/iu, `${lang} ${where}: text tied to the page layout`);
    // the built page (dist): inside <section id="recessed">, a plain link to #tabs with its title
    const file = new URL(`../../dist/${lang === 'en' ? '' : `${lang}/`}guides/sew-a-zipper.html`, import.meta.url);
    assert.ok(existsSync(file), `${lang}: run npm run build first`);
    const html = readFileSync(file, 'utf8');
    const from = html.search(/<section[^>]*id="recessed"/);
    assert.ok(from >= 0, `${lang}: no <section id="recessed">`);
    const next = html.indexOf('<section class="section', from + 1);
    const sec = html.slice(from, next < 0 ? undefined : next);
    const link = sec.match(/<a\b[^>]*href="#tabs"[^>]*>([\s\S]*?)<\/a>/);
    assert.ok(link, `${lang}: no link to #tabs in the recessed section`);
    assert.doesNotMatch(link[0], /amazon|sponsored|target=/i, `${lang}: the link to #tabs is not a plain link`);
    const title = guideText(guideBySlug(SLUG), lang).sections[tabsAt].title;
    const esc = (x) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    assert.ok(link[1].includes(esc(title)), `${lang}: the link does not say "${title}"`);
  }
});

test('recessed: the zipper foot where it sews next to the zipper (Windman set); the panel to the lining with the machine', () => {
  const panelSewing = (s) => (s.sew ?? []).some(([, , f]) => f === 'panel');
  recessed.STEPS.forEach((s, k) => {
    const foot = (s.uses ?? []).includes('windman-presser-feet-set');
    assert.equal(foot, panelSewing(s), `step ${k}: the presser feet set ${foot ? 'where it does not sew next to the zipper' : 'missing where it sews next to the zipper'}`);
    if (s.stitch) assert.ok((s.uses ?? []).includes('janome-1522rd'), `step ${k}: sews without the machine`);
    assert.equal(Boolean(s.stitch), Boolean(s.sew), `step ${k}: stitch and sew go together`);
  });
  assert.ok(recessed.STEPS.filter(panelSewing).length >= 3, 'the zipper foot steps: the seam, the topstitching, the other side');
  const ends = endsStep();
  for (const lang of LOCALES) {
    const L = recessedText(lang);
    recessed.STEPS.forEach((s, k) => {
      if (panelSewing(s)) assert.match(stepWords(L, k), ZIPPER_FOOT[lang], `${lang} step ${k}: no zipper foot`);
    });
    // the ends are stitched past the stops, never over them (as in section 2)
    assert.match(stepWords(L, ends), STOP_WORD[lang], `${lang} step ${ends}: the stop`);
    assert.match(stepWords(L, ends), NOT_WORD[lang], `${lang} step ${ends}: "not over the stop"`);
  }
  assert.ok(guideBySlug(SLUG).needs.includes('mebuzip-zipper-by-the-yard'), 'the zipper by the yard is not in "What you\'ll need"');
});

test('recessed: no first person, no maker — a general recommendation', () => {
  const W = (words) => new RegExp(`(?<!\\p{L})(?:${words})(?!\\p{L})`, 'u');
  const MINE = {
    en: W('I|my|me|mom|maker'), ru: W('я|мой|моя|моё|мои|мам\\p{L}*'), de: W('ich|mein\\p{L}*|Mama'),
    fr: W("je|j'|mon|ma|mes|maman"), it: W('io|mio|mia|miei|mie|mamma'), es: W('yo|mi|mis|mamá'),
  };
  for (const lang of LOCALES) for (const [where, s] of recStrings(lang)) assert.doesNotMatch(s, MINE[lang], `${lang} ${where}: a first-person or maker claim`);
});

const REC_NAME = { en: 'Recessed zipper at the top of a bag', ru: 'Молния на планке в сумку', de: 'Reißverschluss mit Blende', fr: 'Fermeture éclair encastrée sur un sac cabas', it: 'Cerniera incassata nella borsa', es: 'Cremallera en el borde del bolso' };
const FIG3 = { en: 'Fig. 3', ru: 'Рис. 3', de: 'Abb. 3', fr: 'Fig. 3', it: 'Fig. 3', es: 'Fig. 3' };

test('recessed: the section name is the approved one (spec 5.2); the figure is Fig. 3, its title the start of the name, short', () => {
  for (const lang of LOCALES) {
    const g = guideText(guideBySlug(SLUG), lang);
    assert.equal(g.sections[2].title, REC_NAME[lang], lang);
    const title = recessedText(lang).ui.title;
    assert.ok(REC_NAME[lang].startsWith(title) && title.length <= 28, `${lang}: ui.title "${title}"`);
    assert.equal(recessedText(lang).ui.fig, FIG3[lang], `${lang}: ui.fig`);
  }
});

test('recessed: third, after tabs; no project yet, so no "Where it\'s used" and no note', () => {
  const g = guideBySlug(SLUG);
  assert.deepEqual(g.sections.slice(0, 3).map((s) => [s.id, s.figure]), [['lined', KEY], ['tabs', TABS], ['recessed', REC]]);
  const s = g.sections[2];
  assert.deepEqual(s.usedIn, []);
  for (const lang of LOCALES) {
    const tr = guideText(g, lang).sections[2];
    assert.equal(tr.note, undefined, `${lang}: a note`);
    for (const f of SECTION_FIELDS) assert.ok(tr[f].trim(), `${lang}: ${f}`);
    if (lang !== 'en') for (const f of ['line', 'choose', 'rest']) assert.notEqual(tr[f], s[f], `${lang}: ${f} not translated`);
  }
  for (const p of projects) {
    const n = figure(p.slug).model.STEPS.length;
    for (let k = 0; k < n; k++) assert.ok(!guidesForStep(p.slug, k).some((x) => x.section.id === 'recessed'), `${p.slug} step ${k} links to #recessed`);
  }
});

test('recessed: no search traps (spec 5.1) — figure and section texts', () => {
  for (const lang of LOCALES) {
    for (const [where, s] of recStrings(lang)) {
      if (lang === 'en') assert.doesNotMatch(s, /sandwich/i, `en ${where}: "sandwich"`);
      if (lang === 'ru') {
        assert.doesNotMatch(s, /замо?к/iu, `ru ${where}: «замок»`);
        assert.doesNotMatch(s, /ушк/iu, `ru ${where}: «ушки»`);
        assert.doesNotMatch(s, /молни\p{L}* с планкой/iu, `ru ${where}: «молния с планкой» (a jacket's flap)`);
      }
      if (lang === 'de') assert.doesNotMatch(s, /(?<!naht)verdeckt/iu, `de ${where}: «verdeckt»`);
      if (lang === 'it') assert.doesNotMatch(s, /centrale|nascost/iu, `it ${where}: «centrale» / «nascosta»`);
      if (lang === 'es') assert.doesNotMatch(s, /cierre/iu, `es ${where}: «cierre» (once, in the h1, only)`);
    }
    // it: in the section's own texts, every sentence with «cerniera» also says sewing or the item
    if (lang === 'it') {
      for (const [where, s] of recSection(lang)) {
        for (const x of sentences(s).filter((y) => /cerniera/i.test(y))) {
          assert.match(x, /cuci|pochette|borsa|cuscin|federa|gonna|abito|vestito|astuccio/i, `it ${where}: «${x}» — «cerniera» with no sewing word`);
        }
      }
    }
  }
});

test('recessed: language rules — French punctuation, straight apostrophe', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of recStrings(lang)) {
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?»]/, `fr ${where}: no no-break space before : ; ! ? »`);
      if (lang === 'fr') assert.doesNotMatch(s, /«(?!\xa0)/, `fr ${where}: no no-break space after «`);
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

test('recessed: steps — the finished bag, then cut, sandwich, sew, turn out, topstitch, the other side, the ends, the lining, the bag', () => {
  assert.equal(recessed.STEPS.length, 10);
  recessed.STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of REC_LANGS) assert.equal(recessedText(lang).steps.length, 10, lang);
  assert.deepEqual(recessed.STEPS.map((s) => s.stitch ?? null), [null, null, null, 'straight', null, 'straight', 'straight', 'straight', 'straight', null]);
});

test('recessed: uses are catalog products', () => {
  const ids = new Set(products.map((p) => p.id));
  recessed.STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  const FOOT = ['windman-presser-feet-set', 'janome-1522rd'];
  assert.deepEqual(recessed.STEPS.map((s) => s.uses ?? []), [
    [],
    ['mebuzip-zipper-by-the-yard', 'tailor-scissors'],
    ['soraco-sewing-clips'],
    FOOT,
    ['rowenta-travel-iron'],
    FOOT,
    FOOT,
    FOOT,
    ['soraco-sewing-clips', 'janome-1522rd'],
    [],
  ]);
});

test('recessed: figure is registered (build and browser)', () => {
  const f = figure(REC);
  assert.equal(f.model.STEPS, recessed.STEPS);
  assert.equal(f.text('it'), recessedText('it'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'zipper-recessed':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/zipper-recessed\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/zipper-recessed\.\?\?\.js'\)\s*\}/);
});

test('recessed: every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of REC_LANGS) {
    const L = recessedText(lang);
    for (let k = 0; k < recessed.STEPS.length; k++) {
      for (let i = 0; i <= 10; i++) {
        const r = recessed.renderStep(k, i / 10, L);
        assert.ok(r.viewBox.every(Number.isFinite), `${lang} step ${k} t=${i / 10}: viewBox`);
        assert.ok(!r.body.includes('NaN') && !r.body.includes('undefined'), `${lang} step ${k} t=${i / 10}: body`);
        for (const m of r.body.matchAll(/url\(#([^)]+)\)/g)) assert.ok(m[1].startsWith(`${REC}-`), `${lang} step ${k}: #${m[1]}`);
      }
    }
  }
  for (const m of recessed.DEFS.matchAll(/id="([^"]+)"/g)) assert.ok(m[1].startsWith(`${REC}-`), `DEFS: #${m[1]}`);
});

test('recessed: chips stay inside the figure and keep a 1% gap between them (every step, t = 0…1, every language)', () => {
  for (const lang of REC_LANGS) {
    const L = recessedText(lang);
    for (let k = 1; k < recessed.STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox } = recessed.renderStep(k, i / 20, L);
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

test('recessed: lines are drawn before the chips', () => {
  for (let k = 1; k < recessed.STEPS.length; k++) {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const kinds = recessed.STEPS[k].scene(t).over.map((o) => o.type);
      const lastLine = kinds.lastIndexOf('line');
      const firstChip = kinds.findIndex((x) => x === 'label' || x === 'dim');
      assert.ok(lastLine < firstChip || firstChip < 0, `step ${k} t=${t}: a line comes after a chip`);
    }
  }
});

test('recessed: every chip key of the drawing has its text', () => {
  for (const lang of REC_LANGS) assert.deepEqual(Object.keys(recessedText(lang).labels).sort(), [...recessed.LABEL_KEYS].sort(), lang);
});

test('recessed: the first frame (the HTML, no JS) is the finished bag, zipper closed below the edge, and the pins; tapped, it opens', () => {
  const ids = (e) => recessed.anatomy(e).pieces.map((p) => p.id);
  for (const id of ['bag-front', 'bag-back', 'panel-back-strip', 'panel-front-strip', 'panel-back-teeth', 'panel-front-teeth', 'zip-pull']) assert.ok(ids(0).includes(id), `no ${id} at rest`);
  for (const lang of REC_LANGS) {
    const L = recessedText(lang);
    assert.equal(pinCount(recessed.renderStep(0, 0, L).body), L.legend.length, `${lang}: pins in the first frame`);
    assert.equal(pinCount(recessed.renderStep(0, 1, L).body), 0, `${lang}: pins once opened`);
  }
  for (let i = 0; i <= 40; i++) {
    for (const p of recessed.anatomy(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `e=${i / 40}: ${p.id}`);
    for (let k = 1; k < recessed.STEPS.length; k++) {
      for (const p of recessed.STEPS[k].scene(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `step ${k} t=${i / 40}: ${p.id}`);
    }
  }
});

test('recessed: the model loads no other model', () => {
  const src = readFileSync(new URL('../../src/lib/anatomy/zipper-recessed.js', import.meta.url), 'utf8');
  for (const m of src.matchAll(/from\s+'\.\/([^']+)'/g)) assert.ok(['iso.js', 'kit.js'].includes(m[1]), `imports ${m[1]}`);
});

/* ===================================================================================================================
   Section 4, `centered` — the centered zipper (spec 3 row 4, 3.1, 4, 5.2, 5.3 «Раздел 4 — центральная молния»): a public
   technique, NO numbers and no units. A piece of the seam, not a garment: the seam sewn up to the mark at the bottom stop
   with a backstitch; the opening basted with the longest stitch; the seam pressed open; the zipper face down on the
   allowances, teeth on the seam line, pinned to the allowances only; from the right side with the zipper foot, across the
   bottom below the stop and along each side — both sides in the same direction (which one is never said); the pull moved
   out of the way (needle down, foot up); the basting unpicked, the folds meet over the teeth.
   Figure src/lib/anatomy/zipper-centered.js (key zipper-centered), texts zipper-centered.<lang>.js, checks
   zipper-centered.text.js.
   =================================================================================================================== */
import * as centered from '../../src/lib/anatomy/zipper-centered.js';
import { CENTERED_TEXT, centeredText } from '../../src/lib/anatomy/zipper-centered.text.js';

const CEN = 'zipper-centered';
const CEN_LANGS = Object.keys(CENTERED_TEXT);
/** The section's own texts in a language: [where, text]. */
const cenSection = (lang) => guideStrings(lang, 'centered').filter(([where]) => where.startsWith('sections.centered.'));
/** Every text of the section: the figure's (its number `ui.fig` aside) and the section's. */
const cenStrings = (lang) => [...strings(centeredText(lang)).filter(([where]) => where !== 'ui.fig'), ...cenSection(lang)];
/** The steps that sew next to the zipper (with the zipper foot) and the plain seams. */
const zipSewing = (s) => (s.sew ?? []).some(([, , f]) => f === 'zipper');
const seamSewing = (s) => (s.sew ?? []).some(([, , f]) => f === 'seam');
/** The basting lines on a set of pieces. */
const bastings = (pieces) => pieces.flatMap((p) => (p.lines ?? []).filter((l) => l.baste).map((l) => ({ p, l })));

test('centered: every site language has the figure texts', () => {
  assert.deepEqual([...CEN_LANGS].sort(), [...LOCALES].sort());
});

test('centered: no units — no digit, no fraction, no unit (figure, chips, legend, section texts; every language)', () => {
  const WORDS = /(?<!\p{L})(?:centimet\p{L}*|millimet\p{L}*|сантиметр\p{L}*|миллиметр\p{L}*|Zentimeter|Millimeter|centimètres?|millimètres?|centimetri|millimetri|centímetros?|milímetros?)(?!\p{L})/iu;
  for (const lang of CEN_LANGS) {
    for (const [where, s] of cenStrings(lang)) {
      assert.doesNotMatch(s, /\d/, `${lang} ${where}: a digit`);
      assert.doesNotMatch(s, /[¼½¾⅓⅔⅛⅜⅝⅞″%]|⁄/, `${lang} ${where}: a fraction or a unit sign`);
      assert.doesNotMatch(s, UNIT, `${lang} ${where}: a unit`);
      assert.doesNotMatch(s, WORDS, `${lang} ${where}: a unit in words`);
    }
    assert.match(centeredText(lang).ui.fig, /^\S+\.? 4$/u, `${lang}: ui.fig`);
  }
  assert.deepEqual(centered.SPEC, {}, 'the model has no maker\'s numbers');
});

test('centered: both sides sewn the same way — two stitching lines beside the teeth, the same distance off the seam line, in one direction (model)', () => {
  const D = centered.DRAWING;
  // the overlays being sewn next to the zipper: each long run along the seam, its side and its direction
  const runs = [];
  centered.STEPS.forEach((s, k) => {
    if (!zipSewing(s)) return;
    for (const o of s.scene(0.5).over.filter((x) => x.type === 'line' && x.kind === 'hot')) {
      for (let i = 1; i < o.pts.length; i++) {
        const [a, b] = [o.pts[i - 1], o.pts[i]];
        if (Math.abs(b[0] - a[0]) > 1 && Math.abs(b[1] - a[1]) < 1e-6) runs.push({ k, y: a[1], dir: Math.sign(b[0] - a[0]) });
      }
    }
  });
  const ys = [...new Set(runs.map((r) => Math.sign(r.y)))];
  assert.deepEqual(ys.sort(), [-1, 1], `stitching on both sides of the seam line: ${JSON.stringify(runs)}`);
  for (const r of runs) assert.ok(Math.abs(Math.abs(r.y) - D.stitch) < 1e-6, `step ${r.k}: a side not the same distance off the seam line`);
  assert.equal(new Set(runs.map((r) => r.dir)).size, 1, `the two sides go different ways: ${JSON.stringify(runs)}`);
  // the stitching beside the teeth, through the tape, never on them
  assert.ok(D.stitch > D.teethBand / 2 && D.stitch < D.tape, 'the stitching is not beside the teeth, on the tape');
  // across the bottom: below the bottom stop, never over it, still on the zipper tape
  assert.ok(D.across > D.stops[1][1] && D.across < D.opening + 1, 'the stitching across is not just below the bottom stop');
  // the finished seam: the same path on both pieces (each in its own (x, |y|)), and on both zipper tapes
  const done = centered.anatomy(0).pieces;
  for (const id of ['piece-a', 'piece-b', 'zip-tape-a', 'zip-tape-b']) {
    const p = done.find((x) => x.id === id);
    const st = (p.lines ?? []).filter((l) => l.kind === 'stitch' && (l.topstitch || /^zip/.test(id)));
    assert.equal(st.length, 1, `${id}: its stitching`);
    const pts = st[0].pts.map(([x, y]) => [x, Math.abs(y)]);
    assert.deepEqual(pts, D.side, `${id}: not the same stitching on both sides`);
  }
  // the words: both sides in the same direction — and the direction itself is never said (the sources differ)
  const SAME = { en: /same direction/, ru: /в одном направлении/u, de: /in dieselbe Richtung/, fr: /dans le même sens/, it: /nella stessa direzione/, es: /en la misma dirección/ };
  const DIRECTION = /from the (?:bottom|top)|(?:bottom|top) to (?:top|bottom)|\bupwards?\b|\bdownwards?\b|снизу|сверху|von unten|von oben|de bas en haut|de haut en bas|depuis le (?:bas|haut)|en remontant|en descendant|dal basso|dall'alto|verso l'alto|verso il basso|de abajo hacia arriba|de arriba hacia abajo|desde (?:abajo|arriba)/iu;
  const last = centered.STEPS.map((s, k) => (zipSewing(s) ? k : -1)).filter((k) => k > 0).pop();
  for (const lang of LOCALES) {
    const L = centeredText(lang);
    assert.match(stepWords(L, last), SAME[lang], `${lang} step ${last}: "in the same direction"`);
    assert.match(L.labels.sameWay, SAME[lang], `${lang}: chip sameWay`);
    for (const [where, s] of cenStrings(lang)) assert.doesNotMatch(s, DIRECTION, `${lang} ${where}: the stitching direction is said`);
  }
});

test('centered: the side stitching has no starting point and no order of travel (texts and chips, every language)', () => {
  // where a side starts (the seam line at the bottom, the top edge) and "first across, then up the side" pin a direction
  // the sources do not agree on (spec 5.3); each side is "one side and across the bottom", pivoting at the corner
  const ORIGIN = {
    en: /\bstart(?:ing)?\b|\bbegin|(?<!distance )from the seam line|\bfirst (?:across|along|stitch)|\bthen (?:up|down|along|across)\b/i,
    ru: /начн\p{L}*|начина\p{L}*|(?<!расстоянии )от (?:линии )?шва|сначала поперёк|сначала вдоль|затем вдоль|потом вдоль/iu,
    de: /\bfang\p{L}*|\bbeginn\p{L}*|von der Nahtlinie|zuerst (?:quer|entlang)|dann (?:an|entlang|quer)/iu,
    fr: /commencez|recommencez|commen[cç]\p{L}*|depuis la ligne|d'abord en travers|puis le long/iu,
    it: /comincia|ricomincia|inizia|partendo dalla|prima di traverso|poi lungo/iu,
    es: /empieza|comienza|empezando|desde la línea|primero de lado|luego a lo largo/iu,
  };
  for (const lang of LOCALES) {
    for (const [where, s] of cenStrings(lang)) assert.doesNotMatch(s, ORIGIN[lang], `${lang} ${where}: a starting point or an order of travel for the stitching`);
  }
  assert.match('Start on the seam line and stitch across', ORIGIN.en); // the check itself catches the old wording
  assert.match('Снова начните на линии шва', ORIGIN.ru);
});

test('centered: the basting comes out — none in the first frame, in the steps from the basting on, unpicked in the last step', () => {
  const D = centered.DRAWING;
  // step 0 (and tapped): no basting
  for (const e of [0, 0.5, 1]) assert.deepEqual(bastings(centered.anatomy(e).pieces), [], `e=${e}: basting in the finished seam`);
  // the basting step: the longest stitch, on the opening, after the seam
  const k = centered.STEPS.findIndex((s) => s.stitch === 'basting');
  assert.ok(k > 1, 'no step bastes with the longest stitch');
  assert.ok(seamSewing(centered.STEPS[k]) && seamSewing(centered.STEPS[k - 1]) && centered.STEPS[k - 1].stitch === 'straight', 'the seam, then the basting');
  assert.deepEqual(bastings(centered.STEPS[k].scene(0).pieces), [], 'basting before it is sewn');
  const b = bastings(centered.STEPS[k].scene(1).pieces);
  assert.ok(b.length > 0, 'no basting once sewn');
  for (const { p, l } of b) {
    const xs = l.pts.map((q) => at(p, ...q)[0]);
    assert.ok(Math.min(...xs) < 0.5 && Math.abs(Math.max(...xs) - D.opening) < 1e-6, `${p.id}: the basting is not over the opening`);
  }
  // the opening ends at the zipper's bottom stop (the mark)
  assert.equal(D.stops[1][1], D.opening, 'the opening does not end at the bottom stop');
  // it stays in while the zipper is sewn, every step after the basting up to the last
  const last = centered.STEPS.length - 1;
  for (let s = k + 1; s < last; s++) for (const t of [0, 0.5, 1]) assert.ok(bastings(centered.STEPS[s].scene(t).pieces).length > 0, `step ${s} t=${t}: the basting is gone too early`);
  // the last step unpicks it: there at the start, gone at the end — and then the folds meet over the teeth
  assert.ok(bastings(centered.STEPS[last].scene(0).pieces).length > 0, 'the last step does not start with the basting');
  assert.deepEqual(bastings(centered.STEPS[last].scene(1).pieces), [], 'the basting is not unpicked in the last step');
  assert.ok(D.gap > 0 && D.gap < D.teethBand / 2, 'the folded edges do not meet over the teeth');
  const LONGEST = { en: /longest stitch/i, ru: /сам\p{L}* длинн\p{L}* строчк/iu, de: /längste\p{L}* Stich/iu, fr: /point le plus long/i, it: /punto più lungo/i, es: /puntada más larga/i };
  const UNPICK = { en: /unpick/i, ru: /распор/iu, de: /auftrenn|trenn[^.]*\sauf\b/i, fr: /découd|décous/i, it: /scuci/i, es: /descos/i };
  for (const lang of LOCALES) {
    const L = centeredText(lang);
    assert.match(L.stitches.basting, LONGEST[lang], `${lang}: the machine's stitch`);
    assert.match(stepWords(L, k), LONGEST[lang], `${lang} step ${k}: the longest stitch`);
    assert.match(stepWords(L, last), UNPICK[lang], `${lang} step ${last}: unpick`);
    assert.match(L.labels.unpick, UNPICK[lang], `${lang}: chip unpick`);
  }
});

test('centered: the seam up to the mark with a backstitch; pressed open; the zipper face down on the allowances, teeth on the seam line', () => {
  const D = centered.DRAWING;
  const BACKSTITCH = { en: /backstitch/i, ru: /закрепк/iu, de: /verriegel|verriegl/i, fr: /point d'arrêt/i, it: /fermatura/i, es: /remat/i };
  const ONLY = { en: /\bonly\b/, ru: /только/u, de: /\bnur\b/, fr: /seulement|uniquement/, it: /\bsolo\b|soltanto/, es: /\bsolo\b|solamente/ };
  const seamStep = centered.STEPS.findIndex((s, k) => k > 0 && s.stitch === 'straight' && seamSewing(s));
  assert.ok(seamStep > 0, 'no seam step');
  const zipStep = centered.STEPS.findIndex((s, k) => k > seamStep + 1 && !s.sew && s.scene(1).pieces.some((p) => /^zip-tape/.test(p.id)));
  assert.ok(zipStep > 0, 'no step puts the zipper on');
  const end = centered.STEPS[zipStep].scene(1).pieces;
  const z = (id) => box3(end.find((p) => p.id === id))[2][0];
  // wrong side up: the pieces' right sides down, each allowance folded back on its own piece (right side up)
  for (const s of ['a', 'b']) {
    const body = end.find((p) => p.id === `piece-${s}`), al = end.find((p) => p.id === `allowance-${s}`);
    assert.ok(body.out[2] < -0.99 && al.out[2] > 0.99, `${s}: not pressed open, wrong side up`);
    const [, by] = box3(body), [, ay] = box3(al);
    assert.equal(Math.sign(by[0] + by[1]), Math.sign(ay[0] + ay[1]), `${s}: the allowance is not on its own side`);
    assert.ok(Math.abs(ay[1] - ay[0] - D.allowance) < 1e-6, `${s}: the allowance is not flat`);
  }
  // the zipper face down on top of the allowances, its teeth band centred on the seam line, the tapes on the allowances
  for (const id of ['zip-tape-a', 'zip-tape-b']) {
    const p = end.find((x) => x.id === id);
    assert.ok(p.out[2] < -0.99, `${id}: not face down`);
    assert.ok(z(id) > z('allowance-a') && z('allowance-a') > z('piece-a'), `${id}: not on the allowances`);
  }
  const [, ty] = box3(end.find((p) => p.id === 'zip-teeth'));
  assert.ok(Math.abs(ty[0] + ty[1]) < 1e-6, 'the teeth are not on the seam line');
  assert.ok(D.tape < D.allowance, 'the zipper tape runs past the allowances');
  for (const lang of LOCALES) {
    const L = centeredText(lang);
    assert.match(stepWords(L, seamStep), BACKSTITCH[lang], `${lang} step ${seamStep}: the backstitch`);
    assert.match(L.labels.backstitch, BACKSTITCH[lang], `${lang}: chip backstitch`);
    assert.match(stepWords(L, zipStep), ONLY[lang], `${lang} step ${zipStep}: pinned to the allowances only`);
    assert.match(L.labels.allowancesOnly, ONLY[lang], `${lang}: chip allowancesOnly`);
  }
});

test('centered: the zipper foot where it sews next to the zipper (Windman set); never over the stop; the pull moved with the needle down', () => {
  centered.STEPS.forEach((s, k) => {
    const foot = (s.uses ?? []).includes('windman-presser-feet-set');
    assert.equal(foot, zipSewing(s), `step ${k}: the presser feet set ${foot ? 'where it does not sew next to the zipper' : 'missing where it sews next to the zipper'}`);
    if (s.stitch) assert.ok((s.uses ?? []).includes('janome-1522rd'), `step ${k}: sews without the machine`);
    assert.equal(Boolean(s.stitch), Boolean(s.sew), `step ${k}: stitch and sew go together`);
  });
  assert.ok(centered.STEPS.filter(zipSewing).length >= 2, 'both sides with the zipper foot');
  const first = centered.STEPS.findIndex(zipSewing);
  const pullStep = centered.STEPS.findIndex((s, k) => k > 0 && s.scene(0).over.some((o) => o.label === 'movePull'));
  assert.ok(pullStep > 0, 'no step moves the pull');
  // the pull really moves along the teeth
  const pullAt = (t) => centered.STEPS[pullStep].scene(t).pieces.find((p) => p.id === 'zip-pull').O[0];
  assert.ok(pullAt(1) - pullAt(0) > 2, 'the pull is not moved out of the way');
  const NEEDLE = { en: /needle down/i, ru: /игл\p{L}* (?:опущен|в ткани)/iu, de: /Nadel unten|gesenkter Nadel/i, fr: /aiguille piquée/i, it: /ago abbassato/i, es: /aguja abajo/i };
  const FOOT_UP = { en: /lift the (?:presser )?foot/i, ru: /подним\p{L}* лапк/iu, de: /Fuß (?:an)?heben|Nähfuß hoch/i, fr: /relev\p{L}* le pied/iu, it: /alza\p{L}* il piedino/iu, es: /levanta\p{L}* el prensatelas/iu };
  for (const lang of LOCALES) {
    const L = centeredText(lang);
    centered.STEPS.forEach((s, k) => { if (zipSewing(s)) assert.match(stepWords(L, k), ZIPPER_FOOT[lang], `${lang} step ${k}: no zipper foot`); });
    assert.match(stepWords(L, first), STOP_WORD[lang], `${lang} step ${first}: the stop`);
    assert.match(stepWords(L, first), NOT_WORD[lang], `${lang} step ${first}: "never over the stop"`);
    assert.match(stepWords(L, pullStep), NEEDLE[lang], `${lang} step ${pullStep}: needle down`);
    assert.match(stepWords(L, pullStep), FOOT_UP[lang], `${lang} step ${pullStep}: foot up`);
  }
});

test('centered: a piece of the seam, not a garment — two pieces, their allowances and the zipper (every step and the first frame)', () => {
  const OK = /^(piece-[ab]|allowance-[ab]|zip-(?:tape-[ab]|teeth|stop-top|stop-bottom|pull))$/;
  for (let i = 0; i <= 10; i++) {
    for (const p of centered.anatomy(i / 10).pieces) assert.match(p.id, OK, `e=${i / 10}: ${p.id}`);
    for (let k = 1; k < centered.STEPS.length; k++) for (const p of centered.STEPS[k].scene(i / 10).pieces) assert.match(p.id, OK, `step ${k}: ${p.id}`);
  }
});

test('centered: the first frame (the HTML, no JS) is the finished seam, right side up, the folds over the teeth, and the pins; tapped, the zipper shows through', () => {
  const D = centered.DRAWING;
  const rest = centered.anatomy(0).pieces;
  for (const s of ['a', 'b']) {
    const body = rest.find((p) => p.id === `piece-${s}`);
    assert.ok(body.out[2] > 0.99 && (body.opacity ?? 1) > 0.999, `${s}: not right side up and opaque`);
    // below the opening the pieces meet on the seam line; over the opening their folded edges stop the gap short of it
    const ys = body.pts.map(([u, v]) => Math.abs(at(body, u, v)[1]));
    assert.ok(ys.some((y) => y < 1e-6) && ys.some((y) => Math.abs(y - D.gap) < 1e-6), `${s}: the folded edge is not over the teeth`);
  }
  const ids = rest.map((p) => p.id);
  assert.ok(ids.indexOf('zip-teeth') < ids.indexOf('piece-a') && ids.indexOf('zip-teeth') < ids.indexOf('piece-b'), 'the zipper is not drawn under the fabric');
  const tape = rest.find((p) => p.id === 'zip-tape-a');
  assert.ok(box3(tape)[2][0] < box3(rest.find((p) => p.id === 'piece-a'))[2][0], 'the zipper is not under the fabric');
  assert.ok(tape.out[2] > 0.99, 'the zipper is not face up under the fabric');
  for (const lang of CEN_LANGS) {
    const L = centeredText(lang);
    assert.equal(pinCount(centered.renderStep(0, 0, L).body), L.legend.length, `${lang}: pins in the first frame`);
    assert.equal(pinCount(centered.renderStep(0, 1, L).body), 0, `${lang}: pins once tapped`);
  }
  // tapped: the fabric see-through (never gone), the zipper under it
  for (const p of centered.anatomy(1).pieces.filter((x) => /^(piece|allowance)/.test(x.id))) assert.ok(p.opacity > 0.2 && p.opacity < 0.6, `${p.id}: not see-through`);
  for (let i = 0; i <= 40; i++) {
    for (const p of centered.anatomy(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `e=${i / 40}: ${p.id}`);
    for (let k = 1; k < centered.STEPS.length; k++) {
      for (const p of centered.STEPS[k].scene(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `step ${k} t=${i / 40}: ${p.id}`);
    }
  }
});

test('centered: no first person, no maker — a general recommendation', () => {
  const W = (words) => new RegExp(`(?<!\\p{L})(?:${words})(?!\\p{L})`, 'u');
  const MINE = {
    en: W('I|my|me|mom|maker'), ru: W('я|мой|моя|моё|мои|мам\\p{L}*'), de: W('ich|mein\\p{L}*|Mama'),
    fr: W("je|j'|mon|ma|mes|maman"), it: W('io|mio|mia|miei|mie|mamma'), es: W('yo|mi|mis|mamá'),
  };
  for (const lang of LOCALES) for (const [where, s] of cenStrings(lang)) assert.doesNotMatch(s, MINE[lang], `${lang} ${where}: a first-person or maker claim`);
});

const CEN_NAME = { en: 'Centered zipper', ru: 'Центральная молния', de: 'Reißverschluss mittig einnähen', fr: 'Fermeture éclair centrée', it: 'Cerniera centrata', es: 'Cremallera centrada' };
const FIG4 = { en: 'Fig. 4', ru: 'Рис. 4', de: 'Abb. 4', fr: 'Fig. 4', it: 'Fig. 4', es: 'Fig. 4' };

test('centered: the section name is the approved one (spec 5.2); the figure is Fig. 4 under it', () => {
  for (const lang of LOCALES) {
    const g = guideText(guideBySlug(SLUG), lang);
    assert.equal(g.sections[3].title, CEN_NAME[lang], lang);
    assert.equal(centeredText(lang).ui.title, CEN_NAME[lang], `${lang}: ui.title`);
    assert.equal(centeredText(lang).ui.fig, FIG4[lang], `${lang}: ui.fig`);
  }
});

test('centered: fourth, after recessed; no project yet, so no "Where it\'s used" and no note; "When to choose it" names the items people search', () => {
  const g = guideBySlug(SLUG);
  assert.deepEqual(g.sections.slice(0, 4).map((s) => [s.id, s.figure]), [['lined', KEY], ['tabs', TABS], ['recessed', REC], ['centered', CEN]]);
  const s = g.sections[3];
  assert.deepEqual(s.usedIn, []);
  assert.equal(s.restIn, undefined, 'centered stands on its own');
  const ITEMS = {
    en: [/pillow/, /skirt/, /center back seam/], ru: [/наволочк/u, /юбк/u, /средн\p{L}* (?:шов|шва|шве) спинки/u],
    de: [/Kissen/, /Rock/, /hinter\p{L}* Mittelnaht/u], fr: [/coussin|taie d'oreiller/, /jupe/, /couture milieu dos/],
    it: [/federa|cuscin/, /gonna/, /cucitura del centro dietro/], es: [/almohada|cojín/, /falda/, /costura central de la espalda/],
  };
  for (const lang of LOCALES) {
    const tr = guideText(g, lang).sections[3];
    assert.equal(tr.note, undefined, `${lang}: a note`);
    assert.equal(tr.rest, undefined, `${lang}: a rest sentence`);
    for (const f of SECTION_FIELDS) assert.ok(tr[f].trim(), `${lang}: ${f}`);
    if (lang !== 'en') for (const f of ['line', 'choose']) assert.notEqual(tr[f], s[f], `${lang}: ${f} not translated`);
    for (const re of ITEMS[lang]) assert.match(tr.choose, re, `${lang}: "When to choose it" does not name ${re}`);
  }
  for (const p of projects) {
    const n = figure(p.slug).model.STEPS.length;
    for (let k = 0; k < n; k++) assert.ok(!guidesForStep(p.slug, k).some((x) => x.section.id === 'centered'), `${p.slug} step ${k} links to #centered`);
  }
});

test('centered: no search traps (spec 5.1) — figure and section texts; never another section by its number or the page layout', () => {
  const ORDINAL = /\b(?:first|second|third|fourth|fifth|sixth) way\b|(?:перв|втор|трет|четв[её]рт|пят|шест)\p{L}* способ|(?:erste|zweite|dritte|vierte)n? (?:Art|Methode|Weg)|(?:première|deuxième|troisième|quatrième) (?:méthode|façon)|(?:primo|secondo|terzo|quarto) (?:modo|metodo)|(?:primera|segunda|tercera|cuarta) (?:forma|manera)/iu;
  const LAYOUT = /under th\w+ figure|below th\w+ figure|под рисунком|unter der Abbildung|sous (?:la|cette) figure|sotto (?:la|questa) figura|debajo de (?:la|esta) figura|bajo (?:la|esta) figura/iu;
  for (const lang of LOCALES) {
    for (const [where, s] of cenStrings(lang)) {
      if (lang === 'en') assert.doesNotMatch(s, /sandwich/i, `en ${where}: "sandwich"`);
      if (lang === 'ru') {
        assert.doesNotMatch(s, /замо?к/iu, `ru ${where}: «замок»`);
        // «ушки» as a word (the phone pouch's loops) — «подушка» (a pillow, the item people search for) is fine
        assert.doesNotMatch(s, /(?<!\p{L})ушк/iu, `ru ${where}: «ушки»`);
        assert.doesNotMatch(s, /молни\p{L}* с планкой/iu, `ru ${where}: «молния с планкой» (a jacket's flap)`);
      }
      if (lang === 'de') assert.doesNotMatch(s, /(?<!naht)verdeckt/iu, `de ${where}: «verdeckt»`);
      if (lang === 'it') assert.doesNotMatch(s, /centrale|nascost/iu, `it ${where}: «centrale» / «nascosta»`);
      if (lang === 'es') assert.doesNotMatch(s, /cierre/iu, `es ${where}: «cierre» (once, in the h1, only)`);
      assert.doesNotMatch(s, ORDINAL, `${lang} ${where}: another section by its number`);
      assert.doesNotMatch(s, LAYOUT, `${lang} ${where}: text tied to the page layout`);
    }
    if (lang === 'it') {
      for (const [where, s] of cenSection(lang).filter(([w]) => w !== 'sections.centered.title')) {
        for (const x of sentences(s).filter((y) => /cerniera/i.test(y))) {
          assert.match(x, /cuci|pochette|borsa|cuscin|federa|gonna|abito|vestito|astuccio/i, `it ${where}: «${x}» — «cerniera» with no sewing word`);
        }
      }
    }
  }
});

test('centered: language rules — French punctuation, straight apostrophe', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of cenStrings(lang)) {
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?»]/, `fr ${where}: no no-break space before : ; ! ? »`);
      if (lang === 'fr') assert.doesNotMatch(s, /«(?!\xa0)/, `fr ${where}: no no-break space after «`);
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

test('centered: steps — the finished seam, then mark, seam, baste, press open, the zipper, one side, the pull, the other side, unpick', () => {
  assert.equal(centered.STEPS.length, 10);
  centered.STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of CEN_LANGS) assert.equal(centeredText(lang).steps.length, 10, lang);
  assert.deepEqual(centered.STEPS.map((s) => s.stitch ?? null), [null, null, 'straight', 'basting', null, null, 'straight', 'straight', 'straight', null]);
  assert.deepEqual(centered.STEPS.map((s) => (s.sew ?? []).map(([, , f]) => f)), [[], [], ['seam'], ['seam'], [], [], ['zipper'], ['zipper'], ['zipper'], []]);
});

test('centered: uses are catalog products', () => {
  const ids = new Set(products.map((p) => p.id));
  centered.STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  const FOOT = ['windman-presser-feet-set', 'janome-1522rd'];
  assert.deepEqual(centered.STEPS.map((s) => s.uses ?? []), [
    [],
    ['soraco-sewing-clips', 'sewline-air-erasable-pen'],
    ['janome-1522rd'],
    ['janome-1522rd'],
    ['rowenta-travel-iron'],
    ['beaditive-magnetic-pin-holder'],
    FOOT,
    FOOT,
    FOOT,
    ['rowenta-travel-iron'],
  ]);
  // the catalog's zippers carry sizes in their names: not needed in this section's steps
  assert.ok(!centered.STEPS.some((s) => (s.uses ?? []).some((id) => /zipper/.test(id))), 'a zipper product in a step');
});

test('centered: figure is registered (build and browser)', () => {
  const f = figure(CEN);
  assert.equal(f.model.STEPS, centered.STEPS);
  assert.equal(f.text('it'), centeredText('it'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'zipper-centered':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/zipper-centered\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/zipper-centered\.\?\?\.js'\)\s*\}/);
});

test('centered: every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of CEN_LANGS) {
    const L = centeredText(lang);
    for (let k = 0; k < centered.STEPS.length; k++) {
      for (let i = 0; i <= 10; i++) {
        const r = centered.renderStep(k, i / 10, L);
        assert.ok(r.viewBox.every(Number.isFinite), `${lang} step ${k} t=${i / 10}: viewBox`);
        assert.ok(!r.body.includes('NaN') && !r.body.includes('undefined'), `${lang} step ${k} t=${i / 10}: body`);
        for (const m of r.body.matchAll(/url\(#([^)]+)\)/g)) assert.ok(m[1].startsWith(`${CEN}-`), `${lang} step ${k}: #${m[1]}`);
      }
    }
  }
  for (const m of centered.DEFS.matchAll(/id="([^"]+)"/g)) assert.ok(m[1].startsWith(`${CEN}-`), `DEFS: #${m[1]}`);
});

test('centered: chips stay inside the figure and keep a 1% gap between them (every step, t = 0…1, every language)', () => {
  for (const lang of CEN_LANGS) {
    const L = centeredText(lang);
    for (let k = 1; k < centered.STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox } = centered.renderStep(k, i / 20, L);
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

test('centered: lines are drawn before the chips', () => {
  for (let k = 1; k < centered.STEPS.length; k++) {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const kinds = centered.STEPS[k].scene(t).over.map((o) => o.type);
      const lastLine = kinds.lastIndexOf('line');
      const firstChip = kinds.findIndex((x) => x === 'label' || x === 'dim');
      assert.ok(lastLine < firstChip || firstChip < 0, `step ${k} t=${t}: a line comes after a chip`);
    }
  }
});

test('centered: every chip key of the drawing has its text', () => {
  for (const lang of CEN_LANGS) assert.deepEqual(Object.keys(centeredText(lang).labels).sort(), [...centered.LABEL_KEYS].sort(), lang);
});

test('centered: the model loads no other model', () => {
  const src = readFileSync(new URL('../../src/lib/anatomy/zipper-centered.js', import.meta.url), 'utf8');
  for (const m of src.matchAll(/from\s+'\.\/([^']+)'/g)) assert.ok(['iso.js', 'kit.js'].includes(m[1]), `imports ${m[1]}`);
});

test('centered: on the built page — its own <section id="centered"> after recessed, with its figure, no link to another section', () => {
  for (const lang of LOCALES) {
    const file = new URL(`../../dist/${lang === 'en' ? '' : `${lang}/`}guides/sew-a-zipper.html`, import.meta.url);
    assert.ok(existsSync(file), `${lang}: run npm run build first`);
    const html = readFileSync(file, 'utf8');
    const from = html.search(/<section[^>]*id="centered"/);
    assert.ok(from > html.search(/<section[^>]*id="recessed"/), `${lang}: no <section id="centered"> after recessed`);
    const next = html.indexOf('<section class="section', from + 1);
    const sec = html.slice(from, next < 0 ? undefined : next);
    assert.match(sec, /zipper-centered-print/, `${lang}: no centered figure in the section`);
    assert.doesNotMatch(sec, /href="#(?:lined|tabs|recessed|lapped|invisible)"/, `${lang}: a link to another section`);
  }
});

/* ===================================================================================================================
   Section 5, `lapped` — the lapped zipper (spec 3 row 5, 3.1, 4, 5.2, 5.3 «Раздел 5 — молния с перекрытием»): a public
   technique, NO numbers and no units. A piece of the seam, not a garment: the seam sewn up to the mark at the bottom stop
   with a backstitch; the opening basted with the longest stitch; the seam pressed open; the overlap folded back out of
   the way; on the underlap side the seam allowance folded a little narrower, its fold just past the seam line, beside
   the teeth of the zipper (face up under it), stitched along the fold through the allowance and the tape only; the
   overlap back over the zipper, covering that stitching; from the right side with the zipper foot, across the bottom
   below the stop and along the overlap side, clear of the teeth and the pull (which way and from where: never said);
   the basting unpicked. One line of stitching shows.
   Figure src/lib/anatomy/zipper-lapped.js (key zipper-lapped), texts zipper-lapped.<lang>.js, checks
   zipper-lapped.text.js.
   =================================================================================================================== */
import * as lapped from '../../src/lib/anatomy/zipper-lapped.js';
import { LAPPED_TEXT, lappedText } from '../../src/lib/anatomy/zipper-lapped.text.js';
import { dot as dot3 } from '../../src/lib/anatomy/iso.js';

const LAP = 'zipper-lapped';
const LAP_LANGS = Object.keys(LAPPED_TEXT);
/** The section's own texts in a language: [where, text]. */
const lapSection = (lang) => guideStrings(lang, 'lapped').filter(([where]) => where.startsWith('sections.lapped.'));
/** Every text of the section: the figure's (its number `ui.fig` aside) and the section's. */
const lapStrings = (lang) => [...strings(lappedText(lang)).filter(([where]) => where !== 'ui.fig'), ...lapSection(lang)];

/** Is the world point (x, y) inside a flat (horizontal) piece's outline? */
function covers(p, [x, y]) {
  const poly = p.pts.map(([u, v]) => at(p, u, v));
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
/** Sample points along a line drawn on a piece (world). */
const along = (p, l) => l.pts.flatMap((q, i) => (i ? [0.2, 0.5, 0.8].map((k) => {
  const [u0, v0] = l.pts[i - 1];
  return at(p, u0 + (q[0] - u0) * k, v0 + (q[1] - v0) * k);
}) : []));
const VIEW3 = [1, 1, 1];
/** The stitching that shows on a set of pieces: lines on the face turned to the viewer, not under a later opaque piece. */
function shownStitching(pieces) {
  const out = [];
  pieces.forEach((p, i) => {
    const front = dot3(p.out, VIEW3) >= 0;
    for (const l of p.lines ?? []) {
      if (l.kind !== 'stitch' || (l.side && (l.side === 'out') !== front)) continue;
      const pts = along(p, l);
      const hidden = pts.every((w) => pieces.slice(i + 1).some((q) => (q.opacity ?? 1) > 0.99 && Math.abs(q.out[2]) > 0.99 && at(q, 0, 0)[2] > w[2] && covers(q, w)));
      if (!hidden) out.push({ id: p.id, l });
    }
  });
  return out;
}

test('lapped: every site language has the figure texts', () => {
  assert.deepEqual([...LAP_LANGS].sort(), [...LOCALES].sort());
});

test('lapped: no units — no digit, no fraction, no unit (figure, chips, legend, section texts; every language)', () => {
  const WORDS = /(?<!\p{L})(?:centimet\p{L}*|millimet\p{L}*|сантиметр\p{L}*|миллиметр\p{L}*|Zentimeter|Millimeter|centimètres?|millimètres?|centimetri|millimetri|centímetros?|milímetros?)(?!\p{L})/iu;
  for (const lang of LAP_LANGS) {
    for (const [where, s] of lapStrings(lang)) {
      assert.doesNotMatch(s, /\d/, `${lang} ${where}: a digit`);
      assert.doesNotMatch(s, /[¼½¾⅓⅔⅛⅜⅝⅞″%]|⁄/, `${lang} ${where}: a fraction or a unit sign`);
      assert.doesNotMatch(s, UNIT, `${lang} ${where}: a unit`);
      assert.doesNotMatch(s, WORDS, `${lang} ${where}: a unit in words`);
    }
    assert.match(lappedText(lang).ui.fig, /^\S+\.? 5$/u, `${lang}: ui.fig`);
  }
  assert.deepEqual(lapped.SPEC, {}, 'the model has no maker\'s numbers');
});

// The underlap's two stitchings (spec 5.3): `first` — the zipper tape, face down, to the folded-out allowance close to
// the teeth; `under` — along the fold that forms once the zipper is turned face up. Where each is drawn at the end.
const UNDERLAP_STITCHINGS = { first: ['allowance-b', 'zip-tape-b'], under: ['piece-b', 'zip-tape-b'] };

test('lapped: the lap hides both underlap stitchings — in the first frame the overlap lies over them (model)', () => {
  const rest = lapped.anatomy(0).pieces;
  const a = rest.find((p) => p.id === 'piece-a');
  assert.ok((a.opacity ?? 1) > 0.999 && a.out[2] > 0.99, 'the overlap is not opaque, right side up');
  for (const [tag, ids] of Object.entries(UNDERLAP_STITCHINGS)) {
    for (const id of ids) {
      const p = rest.find((x) => x.id === id);
      const ls = (p.lines ?? []).filter((l) => l[tag]);
      assert.equal(ls.length, 1, `${id}: the ${tag} stitching is not there`);
      assert.ok(rest.indexOf(a) > rest.indexOf(p), `the overlap is not drawn over ${id}`);
      for (const w of along(p, ls[0])) {
        assert.ok(covers(a, w), `${id}: the overlap does not cover the ${tag} stitching at ${w.map((n) => n.toFixed(2))}`);
        assert.ok(at(a, 0, 0)[2] > w[2], `${id}: the overlap is not over the ${tag} stitching`);
      }
    }
  }
  // two different lines: the first stitching lies inside, under the fold, the second along the fold
  const D = lapped.DRAWING;
  assert.ok(D.firstTurned > 0 && D.firstTurned < D.under, 'the first stitching is not tucked under the fold, inside the second');
  // while each is sewn, the overlap is folded back, out of the way: it covers none of that stitching
  for (const [tag, label] of [['first', 'nearTeeth'], ['under', 'alongFold']]) {
    const k = lapped.STEPS.findIndex((s, i) => i > 0 && s.scene(0).over.some((o) => o.label === label));
    assert.ok(k > 0 && zipSewing(lapped.STEPS[k]), `no step sews the ${tag} stitching with the zipper foot`);
    const done = lapped.STEPS[k].scene(1).pieces;
    const host = done.find((p) => p.id === UNDERLAP_STITCHINGS[tag][0]);
    const st = (host.lines ?? []).find((l) => l[tag]);
    assert.ok(st, `step ${k}: the ${tag} stitching is not there once sewn`);
    for (const id of ['piece-a', 'allowance-a']) {
      const p = done.find((x) => x.id === id);
      for (const w of along(host, st)) assert.ok(!covers(p, w), `step ${k}: ${id} is under the needle — not folded out of the way`);
    }
    assert.deepEqual(lapped.STEPS[k].scene(0).pieces.filter((p) => (p.lines ?? []).some((l) => l[tag])).map((p) => p.id), [], `step ${k}: the ${tag} stitching is there before it is sewn`);
  }
  const first = lapped.STEPS.findIndex((s, i) => i > 0 && s.scene(0).over.some((o) => o.label === 'nearTeeth'));
  const fold = lapped.STEPS.findIndex((s, i) => i > 0 && s.scene(0).over.some((o) => o.label === 'alongFold'));
  assert.ok(first < fold, 'the stitching close to the teeth does not come before the one along the fold');
});

test('lapped: the zipper face down on the folded-out allowance, stitched close to the teeth, then turned face up — a fold forms by the teeth (model)', () => {
  const D = lapped.DRAWING;
  const step = (label) => lapped.STEPS.findIndex((s, i) => i > 0 && s.scene(0).over.some((o) => o.label === label));
  const tapes = (ps) => ps.filter((p) => /^zip-tape-[ab]$/.test(p.id));
  const z = (p) => at(p, 1, 1)[2];
  // the first stitching: the allowance folded out, right side up, flat past the seam line (frame R: y < 0 is past it);
  // the zipper face down on it, its teeth by the seam line
  const k1 = step('nearTeeth');
  for (const t of [0, 0.5, 1]) {
    const ps = lapped.STEPS[k1].scene(t).pieces;
    const flap = ps.find((p) => p.id === 'allowance-b');
    assert.ok(flap.out[2] > 0.99, `step ${k1} t=${t}: the allowance is not folded out, right side up`);
    for (const [u, v] of flap.pts) assert.ok(at(flap, u, v)[1] <= 1e-6, `step ${k1} t=${t}: the folded-out allowance is not past the seam line`);
    for (const tp of tapes(ps)) {
      assert.ok(tp.out[2] < -0.99, `step ${k1} t=${t}: ${tp.id} not face down`);
      assert.ok(z(tp) > z(flap), `step ${k1} t=${t}: ${tp.id} not on the allowance`);
    }
    const [, ty] = box3(ps.find((p) => p.id === 'zip-teeth'));
    assert.ok(ty[0] < 0 && ty[1] > 0, `step ${k1} t=${t}: the teeth are not by the seam line`);
  }
  // the turn: face down at its start, face up at its end, under the allowance folded under it; the fold by the teeth
  const k2 = step('faceUp');
  assert.ok(k2 === k1 + 1, 'the zipper is not turned right after the stitching close to the teeth');
  for (const tp of tapes(lapped.STEPS[k2].scene(0).pieces)) assert.ok(tp.out[2] < -0.99, `step ${k2}: ${tp.id} not face down at the start`);
  const end = lapped.STEPS[k2].scene(1).pieces;
  const flap = end.find((p) => p.id === 'allowance-b');
  assert.ok(flap.out[2] < -0.99, `step ${k2}: the allowance is not folded under`);
  for (const tp of tapes(end)) {
    assert.ok(tp.out[2] > 0.99, `step ${k2}: ${tp.id} not face up`);
    assert.ok(z(tp) < z(flap), `step ${k2}: ${tp.id} not under the folded allowance`);
  }
  const ys = flap.pts.map(([u, v]) => at(flap, u, v)[1]);
  assert.ok(Math.abs(Math.min(...ys) + D.lap) < 1e-6, `step ${k2}: the fold is not just past the seam line`);
  const [, ty] = box3(end.find((p) => p.id === 'zip-teeth'));
  assert.ok(-ty[1] > D.lap && -ty[1] - D.lap < D.teethBand / 4, `step ${k2}: the teeth are not right beside the fold`);
  // the first stitching goes round with the turn: on the folded-under allowance, inside the fold
  const st = (flap.lines ?? []).find((l) => l.first);
  for (const w of along(flap, st)) assert.ok(-w[1] > 0 && -w[1] < D.lap, `step ${k2}: the first stitching is not inside the fold`);
  // and the words: face down, face up, the fold by the teeth
  const DOWN = { en: /face down/i, ru: /лицом вниз/iu, de: /rechten Seite nach unten|rechts nach unten/i, fr: /endroit dessous/i, it: /a faccia in giù/i, es: /boca abajo/i };
  const UP = { en: /face up/i, ru: /лицом вверх/iu, de: /rechten Seite nach oben|rechts nach oben/i, fr: /endroit dessus/i, it: /a faccia in su/i, es: /boca arriba/i };
  const k0 = step('faceDown');
  assert.ok(k0 > 0 && k0 < k1, 'the zipper is not laid face down before the stitching close to the teeth');
  for (const lang of LOCALES) {
    const L = lappedText(lang);
    assert.match(stepWords(L, k0), DOWN[lang], `${lang} step ${k0}: face down`);
    assert.match(L.labels.faceDown, DOWN[lang], `${lang}: chip faceDown`);
    assert.match(stepWords(L, k2), UP[lang], `${lang} step ${k2}: face up`);
    assert.match(L.labels.faceUp, UP[lang], `${lang}: chip faceUp`);
  }
});

test('lapped: one visible stitching line outside — along the overlap side and across the bottom (model)', () => {
  const shown = shownStitching(lapped.anatomy(0).pieces);
  assert.deepEqual(shown.map((s) => s.id), ['piece-a'], `stitching that shows: ${JSON.stringify(shown.map((s) => s.id))}`);
  assert.ok(shown[0].l.topstitch, 'the stitching that shows is not the overlap\'s');
  assert.deepEqual(shown[0].l.pts, lapped.DRAWING.top, 'not across the bottom and along the side');
  // seen through the fabric (tapped), the hidden stitching on the underlap and the zipper shows too
  const ghost = lapped.anatomy(1).pieces;
  assert.ok(ghost.some((p) => (p.lines ?? []).some((l) => l.under)), 'tapped: the underlap\'s stitching is gone');
});

test('lapped: the underlap\'s fold is a little narrower than the allowance, just past the seam line, beside the teeth (model + words)', () => {
  const D = lapped.DRAWING;
  assert.ok(D.lap > 0 && D.lap < D.allowance / 3, 'the fold is not just past the seam line');
  // the allowance folded under: a little narrower than the allowance
  const rest = lapped.anatomy(0).pieces;
  const al = rest.find((p) => p.id === 'allowance-b');
  const r = [];
  for (const [u, v] of al.pts) if (u < D.opening - 1e-6) r.push(v);
  const width = Math.max(...r) - Math.min(...r);
  assert.ok(width < D.allowance && width > D.allowance / 2, `the folded allowance is ${width}, the allowance ${D.allowance}`);
  // the teeth right beside the fold, past it; the zipper face up under the fabric; the stitching on the fold, on the tape
  assert.ok(D.zipper - D.teethBand / 2 > D.lap && D.zipper - D.teethBand / 2 - D.lap < D.teethBand / 4, 'the teeth are not right beside the fold');
  assert.ok(D.under > 0 && D.under < D.lap && D.under > D.zipper - D.tape, 'the stitching is not along the fold, on the tape');
  for (const id of ['zip-tape-a', 'zip-tape-b', 'zip-teeth']) assert.ok(rest.find((p) => p.id === id).out[2] > 0.99, `${id}: not face up`);
  const NARROWER = { en: /a little narrower than the (?:seam )?allowance/i, ru: /чуть уже припуска/iu, de: /etwas schmaler als die Nahtzugabe/i, fr: /un peu plus étroite? que la valeur/i, it: /un po' più strett[ao] del margine/i, es: /un poco más estrech[oa] que el margen/i };
  const BESIDE = { en: /(?:beside|by) the teeth/i, ru: /у (?:самых )?зубчиков/iu, de: /neben den Zähnen|an den Zähnen/i, fr: /contre les dents/i, it: /accanto ai denti/i, es: /junto a los dientes/i };
  const k = lapped.STEPS.findIndex((s, i) => i > 0 && s.scene(0).over.some((o) => o.label === 'narrower'));
  for (const lang of LOCALES) {
    const L = lappedText(lang);
    assert.match(L.labels.narrower, NARROWER[lang], `${lang}: chip narrower`);
    assert.match(stepWords(L, k), NARROWER[lang], `${lang} step ${k}: "a little narrower than the seam allowance"`);
    assert.match(stepWords(L, k), BESIDE[lang], `${lang} step ${k}: the fold beside the teeth`);
    assert.match(L.labels.besideTeeth, BESIDE[lang], `${lang}: chip besideTeeth`);
  }
});

test('lapped: the overlap\'s stitching clears the teeth and the pull, through the tape; across below the stop (model + words)', () => {
  const D = lapped.DRAWING;
  assert.ok(D.stitch > D.zipper + D.teethBand / 2 && D.stitch > D.zipper + D.pullHalf, 'the stitching runs over the teeth or the pull');
  assert.ok(D.stitch < D.zipper + D.tape, 'the stitching misses the zipper tape');
  assert.ok(D.across > D.stops[1][1] && D.across < D.opening + 1, 'the stitching across is not just below the bottom stop');
  // the stitching being sewn (the overlay of the zipper-foot step that sews it) runs where the finished line is drawn
  const k = lapped.STEPS.findIndex((s, i) => i > 0 && s.scene(0).over.some((o) => o.label === 'clearTeeth'));
  const o = lapped.STEPS[k].scene(0.5).over.find((x) => x.type === 'line');
  const a = lapped.anatomy(0).pieces.find((p) => p.id === 'piece-a');
  const drawn = a.lines.find((l) => l.topstitch).pts.map(([u, v]) => at(a, u, v));
  o.pts.forEach((w, i) => assert.ok(Math.hypot(w[0] - drawn[i][0], w[1] - drawn[i][1]) < 1e-6, `step ${k}: the stitching sewn is not the one drawn`));
  const CLEAR = { en: /clear the teeth and the pull/i, ru: /обойти зубчики и бегунок/iu, de: /Zähne und Schieber nicht zu treffen/i, fr: /éviter les dents et le curseur/i, it: /evitare i denti e il cursore/i, es: /no tocar los dientes ni el tirador/i };
  const CHIP_CLEAR = { en: /teeth and the pull/i, ru: /зубчиков и бегунка/iu, de: /Zähnen und Schieber/i, fr: /dents et du curseur/i, it: /denti e cursore/i, es: /dientes y tirador/i };
  for (const lang of LOCALES) {
    const L = lappedText(lang);
    assert.match(stepWords(L, k), CLEAR[lang], `${lang} step ${k}: "wide enough to clear the teeth and the pull"`);
    assert.match(L.labels.clearTeeth, CHIP_CLEAR[lang], `${lang}: chip clearTeeth`);
    assert.match(stepWords(L, k), STOP_WORD[lang], `${lang} step ${k}: the stop`);
    assert.match(stepWords(L, k), NOT_WORD[lang], `${lang} step ${k}: "never over the stop"`);
  }
});

test('lapped: the overlap\'s stitching is written order-neutral — the side and the bottom in one line, the corner and the stop apart', () => {
  const k = lapped.STEPS.findIndex((s, i) => i > 0 && s.scene(0).over.some((o) => o.label === 'clearTeeth'));
  const SIDE = { en: /overlap side/, ru: /вдоль перекрытия/u, de: /am Übertritt entlang/, fr: /le long de la patte/, it: /lungo la patta/, es: /a lo largo de la solapa/ };
  const BOTTOM = { en: /across the bottom/, ru: /поперёк внизу/u, de: /quer unter/, fr: /en travers en bas/, it: /di traverso in basso/, es: /de lado a lado abajo/ };
  for (const lang of LOCALES) {
    const L = lappedText(lang);
    for (const s of [L.steps[k].text, ...L.steps[k].details]) {
      assert.equal(SIDE[lang].test(s), BOTTOM[lang].test(s), `${lang} step ${k}: «${s}» — the side and the bottom apart (an order)`);
    }
    assert.ok(L.steps[k].details.some((s) => SIDE[lang].test(s)), `${lang} step ${k}: no line names the side and the bottom`);
  }
});

test('lapped: no stitching direction, no starting point, no order of travel (texts and chips, every language)', () => {
  const DIRECTION = /from the (?:bottom|top)|(?:bottom|top) to (?:top|bottom)|\bupwards?\b|\bdownwards?\b|\bup the side|снизу|сверху|von unten|von oben|de bas en haut|de haut en bas|depuis le (?:bas|haut)|en remontant|en descendant|dal basso|dall'alto|verso l'alto|verso il basso|de abajo hacia arriba|de arriba hacia abajo|desde (?:abajo|arriba)/iu;
  const ORIGIN = {
    en: /\bstart(?:ing)?\b|\bbegin|from the seam line|\bfirst (?:across|along|stitch)|\bthen (?:up|down|along|across)\b/i,
    ru: /начн\p{L}*|начина\p{L}*|от (?:линии )?шва|сначала поперёк|сначала вдоль|затем вдоль|потом вдоль|затем поперёк|потом поперёк/iu,
    de: /\bfang\p{L}*|\bbeginn\p{L}*|von der Nahtlinie|zuerst (?:quer|entlang)|dann (?:an|entlang|quer)/iu,
    fr: /commencez|recommencez|commen[cç]\p{L}*|depuis la ligne|d'abord en travers|puis le long|puis en travers/iu,
    it: /comincia|ricomincia|inizia|partendo dalla|prima di traverso|poi lungo|poi di traverso/iu,
    es: /empieza|comienza|empezando|desde la línea|primero de lado|luego a lo largo|luego de lado/iu,
  };
  for (const lang of LOCALES) {
    for (const [where, s] of lapStrings(lang)) {
      assert.doesNotMatch(s, DIRECTION, `${lang} ${where}: the stitching direction is said`);
      assert.doesNotMatch(s, ORIGIN[lang], `${lang} ${where}: a starting point or an order of travel for the stitching`);
    }
  }
  assert.match('Start on the seam line and stitch across, then up the side', ORIGIN.en); // the check catches such wording
  assert.match('Начните на линии шва', ORIGIN.ru);
});

test('lapped: the basting comes out — none in the first frame, in the steps from the basting on, unpicked in the last step', () => {
  for (const e of [0, 0.5, 1]) assert.deepEqual(bastings(lapped.anatomy(e).pieces), [], `e=${e}: basting in the finished seam`);
  const k = lapped.STEPS.findIndex((s) => s.stitch === 'basting');
  assert.ok(k > 1, 'no step bastes with the longest stitch');
  assert.ok(seamSewing(lapped.STEPS[k]) && seamSewing(lapped.STEPS[k - 1]) && lapped.STEPS[k - 1].stitch === 'straight', 'the seam, then the basting');
  assert.deepEqual(bastings(lapped.STEPS[k].scene(0).pieces), [], 'basting before it is sewn');
  const b = bastings(lapped.STEPS[k].scene(1).pieces);
  assert.ok(b.length > 0, 'no basting once sewn');
  for (const { p, l } of b) {
    const xs = l.pts.map((q) => at(p, ...q)[0]);
    assert.ok(Math.min(...xs) < 0.5 && Math.abs(Math.max(...xs) - lapped.DRAWING.opening) < 1e-6, `${p.id}: the basting is not over the opening`);
  }
  assert.equal(lapped.DRAWING.stops[1][1], lapped.DRAWING.opening, 'the opening does not end at the bottom stop');
  const last = lapped.STEPS.length - 1;
  for (let s = k + 1; s < last; s++) for (const t of [0, 0.5, 1]) assert.ok(bastings(lapped.STEPS[s].scene(t).pieces).length > 0, `step ${s} t=${t}: the basting is gone too early`);
  assert.ok(bastings(lapped.STEPS[last].scene(0).pieces).length > 0, 'the last step does not start with the basting');
  assert.deepEqual(bastings(lapped.STEPS[last].scene(1).pieces), [], 'the basting is not unpicked in the last step');
  const LONGEST = { en: /longest stitch/i, ru: /сам\p{L}* длинн\p{L}* строчк/iu, de: /längste\p{L}* Stich/iu, fr: /point le plus long/i, it: /punto più lungo/i, es: /puntada más larga/i };
  const UNPICK = { en: /unpick/i, ru: /распор/iu, de: /auftrenn|trenn[^.]*\sauf\b/i, fr: /découd|décous/i, it: /scuci/i, es: /descos/i };
  for (const lang of LOCALES) {
    const L = lappedText(lang);
    assert.match(L.stitches.basting, LONGEST[lang], `${lang}: the machine's stitch`);
    assert.match(stepWords(L, k), LONGEST[lang], `${lang} step ${k}: the longest stitch`);
    assert.match(stepWords(L, last), UNPICK[lang], `${lang} step ${last}: unpick`);
    assert.match(L.labels.unpick, UNPICK[lang], `${lang}: chip unpick`);
  }
});

test('lapped: the seam up to the mark with a backstitch; pressed open, wrong side up, each allowance on its own side', () => {
  const D = lapped.DRAWING;
  const BACKSTITCH = { en: /backstitch/i, ru: /закрепк/iu, de: /verriegel|verriegl/i, fr: /point d'arrêt/i, it: /fermatura/i, es: /remat/i };
  const seamStep = lapped.STEPS.findIndex((s, k) => k > 0 && s.stitch === 'straight' && seamSewing(s));
  assert.ok(seamStep > 0, 'no seam step');
  const press = lapped.STEPS.findIndex((s, k) => k > 0 && s.scene(0).over.some((o) => o.label === 'pressOpen'));
  assert.ok(press > seamStep + 1, 'not pressed open after the basting');
  const end = lapped.STEPS[press].scene(1).pieces;
  for (const s of ['a', 'b']) {
    const body = end.find((p) => p.id === `piece-${s}`), al = end.find((p) => p.id === `allowance-${s}`);
    assert.ok(body.out[2] < -0.99 && al.out[2] > 0.99, `${s}: not pressed open, wrong side up`);
    const [, by] = box3(body), [, ay] = box3(al);
    assert.equal(Math.sign(by[0] + by[1]), Math.sign(ay[0] + ay[1]), `${s}: the allowance is not on its own side`);
    assert.ok(Math.abs(ay[1] - ay[0] - D.allowance) < 1e-6, `${s}: the allowance is not flat`);
  }
  for (const lang of LOCALES) {
    const L = lappedText(lang);
    assert.match(stepWords(L, seamStep), BACKSTITCH[lang], `${lang} step ${seamStep}: the backstitch`);
    assert.match(L.labels.backstitch, BACKSTITCH[lang], `${lang}: chip backstitch`);
  }
});

test('lapped: the zipper foot where it sews next to the zipper (Windman set); "only" through the allowance and the tape', () => {
  lapped.STEPS.forEach((s, k) => {
    const foot = (s.uses ?? []).includes('windman-presser-feet-set');
    assert.equal(foot, zipSewing(s), `step ${k}: the presser feet set ${foot ? 'where it does not sew next to the zipper' : 'missing where it sews next to the zipper'}`);
    if (s.stitch) assert.ok((s.uses ?? []).includes('janome-1522rd'), `step ${k}: sews without the machine`);
    assert.equal(Boolean(s.stitch), Boolean(s.sew), `step ${k}: stitch and sew go together`);
  });
  assert.equal(lapped.STEPS.filter(zipSewing).length, 3, 'close to the teeth, along the fold and the overlap, with the zipper foot');
  const ONLY = { en: /\bonly\b/, ru: /только/u, de: /\bnur\b/, fr: /seulement|uniquement/, it: /\bsolo\b|soltanto/, es: /\bsolo\b|solamente/ };
  const fold = lapped.STEPS.findIndex(zipSewing);
  const underlap = lapped.STEPS.map((s, k) => (zipSewing(s) ? k : -1)).filter((k) => k > 0).slice(0, 2); // the two underlap stitchings
  for (const lang of LOCALES) {
    const L = lappedText(lang);
    lapped.STEPS.forEach((s, k) => { if (zipSewing(s)) assert.match(stepWords(L, k), ZIPPER_FOOT[lang], `${lang} step ${k}: no zipper foot`); });
    for (const k of underlap) assert.match(stepWords(L, k), ONLY[lang], `${lang} step ${k}: through the allowance and the tape only`);
    assert.match(L.labels.allowanceOnly, ONLY[lang], `${lang}: chip allowanceOnly`);
    assert.match(stepWords(L, fold), STOP_WORD[lang], `${lang} step ${fold}: the stop`);
    assert.match(stepWords(L, fold), NOT_WORD[lang], `${lang} step ${fold}: "never over the stop"`);
  }
});

test('lapped: a piece of the seam, not a garment — two pieces, their allowances and the zipper (every step and the first frame)', () => {
  const OK = /^(piece-[ab]|allowance-[ab]|allowance-b-below|zip-(?:tape-[ab]|teeth|stop-top|stop-bottom|pull))$/;
  for (let i = 0; i <= 10; i++) {
    for (const p of lapped.anatomy(i / 10).pieces) assert.match(p.id, OK, `e=${i / 10}: ${p.id}`);
    for (let k = 1; k < lapped.STEPS.length; k++) for (const p of lapped.STEPS[k].scene(i / 10).pieces) assert.match(p.id, OK, `step ${k}: ${p.id}`);
  }
});

test('lapped: the first frame (the HTML, no JS) is the finished seam, right side up, the zipper under the overlap, and the pins; tapped, it shows through', () => {
  const rest = lapped.anatomy(0).pieces;
  for (const s of ['a', 'b']) {
    const body = rest.find((p) => p.id === `piece-${s}`);
    assert.ok(body.out[2] > 0.99 && (body.opacity ?? 1) > 0.999, `${s}: not right side up and opaque`);
  }
  // the overlap's folded edge on the seam line, over the opening and below it
  const a = rest.find((p) => p.id === 'piece-a');
  assert.ok(a.pts.map(([u, v]) => at(a, u, v)[1]).some((y) => Math.abs(y) < 1e-6), 'the overlap\'s folded edge is not on the seam line');
  // the zipper face up under the fabric, the teeth all under the overlap (it does not show)
  const teeth = rest.find((p) => p.id === 'zip-teeth');
  assert.ok(rest.indexOf(teeth) < rest.indexOf(a) && box3(teeth)[2][1] < box3(a)[2][0], 'the zipper is not under the overlap');
  for (const [u, v] of teeth.pts) assert.ok(covers(a, at(teeth, u, v)), 'a tooth shows past the overlap');
  for (const lang of LAP_LANGS) {
    const L = lappedText(lang);
    assert.equal(pinCount(lapped.renderStep(0, 0, L).body), L.legend.length, `${lang}: pins in the first frame`);
    assert.equal(pinCount(lapped.renderStep(0, 1, L).body), 0, `${lang}: pins once tapped`);
  }
  for (const p of lapped.anatomy(1).pieces.filter((x) => /^(piece|allowance)/.test(x.id))) assert.ok(p.opacity > 0.2 && p.opacity < 0.6, `${p.id}: not see-through`);
  for (let i = 0; i <= 40; i++) {
    for (const p of lapped.anatomy(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `e=${i / 40}: ${p.id}`);
    for (let k = 1; k < lapped.STEPS.length; k++) {
      for (const p of lapped.STEPS[k].scene(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `step ${k} t=${i / 40}: ${p.id}`);
    }
  }
});

test('lapped: no first person, no maker — a general recommendation', () => {
  const W = (words) => new RegExp(`(?<!\\p{L})(?:${words})(?!\\p{L})`, 'u');
  const MINE = {
    en: W('I|my|me|mom|maker'), ru: W('я|мой|моя|моё|мои|мам\\p{L}*'), de: W('ich|mein\\p{L}*|Mama'),
    fr: W("je|j'|mon|ma|mes|maman"), it: W('io|mio|mia|miei|mie|mamma'), es: W('yo|mi|mis|mamá'),
  };
  for (const lang of LOCALES) for (const [where, s] of lapStrings(lang)) assert.doesNotMatch(s, MINE[lang], `${lang} ${where}: a first-person or maker claim`);
});

const LAP_NAME = { en: 'Lapped zipper', ru: 'Молния с перекрытием', de: 'Reißverschluss mit Übertritt', fr: 'Fermeture éclair sous patte', it: 'Cerniera con patta', es: 'Cremallera con solapa' };
const FIG5 = { en: 'Fig. 5', ru: 'Рис. 5', de: 'Abb. 5', fr: 'Fig. 5', it: 'Fig. 5', es: 'Fig. 5' };

test('lapped: the section name is the approved one (spec 5.2); the figure is Fig. 5 under it', () => {
  for (const lang of LOCALES) {
    const g = guideText(guideBySlug(SLUG), lang);
    assert.equal(g.sections[4].title, LAP_NAME[lang], lang);
    assert.equal(lappedText(lang).ui.title, LAP_NAME[lang], `${lang}: ui.title`);
    assert.equal(lappedText(lang).ui.fig, FIG5[lang], `${lang}: ui.fig`);
  }
});

test('lapped: fifth, after centered; no project yet, so no "Where it\'s used" and no note; "When to choose it" names the items people search', () => {
  const g = guideBySlug(SLUG);
  assert.deepEqual(g.sections.slice(0, 5).map((s) => [s.id, s.figure]), [['lined', KEY], ['tabs', TABS], ['recessed', REC], ['centered', CEN], ['lapped', LAP]]);
  const s = g.sections[4];
  assert.deepEqual(s.usedIn, []);
  assert.equal(s.restIn, undefined, 'lapped stands on its own');
  const ITEMS = {
    en: [/side seam/, /skirt/, /dress/, /trousers/], ru: [/боков\p{L}* шов/u, /юбк/u, /плать/u, /брюк/u],
    de: [/Seitennaht/, /Rock/, /Kleid/, /Hose/], fr: [/couture de côté/, /jupe/, /robe/, /pantalon/],
    it: [/cucitura laterale/, /gonna/, /abito/, /pantaloni/], es: [/costura lateral/, /falda/, /vestido/, /pantal[oó]n/],
  };
  // it hides the zipper (good when its colour does not match) and one line of stitching shows
  const HIDES = { en: /colou?r/, ru: /цвет/u, de: /farblich|Farbe/, fr: /couleur|assortie/, it: /colore/, es: /color|combina/ };
  const ONE = { en: /one line of stitching/, ru: /одн\p{L}* строчк/u, de: /eine Steppnaht/, fr: /une seule piqûre/, it: /una sola cucitura/, es: /un solo pespunte/ };
  for (const lang of LOCALES) {
    const tr = guideText(g, lang).sections[4];
    assert.equal(tr.note, undefined, `${lang}: a note`);
    assert.equal(tr.rest, undefined, `${lang}: a rest sentence`);
    for (const f of SECTION_FIELDS) assert.ok(tr[f].trim(), `${lang}: ${f}`);
    if (lang !== 'en') for (const f of ['line', 'choose']) assert.notEqual(tr[f], s[f], `${lang}: ${f} not translated`);
    for (const re of ITEMS[lang]) assert.match(tr.choose, re, `${lang}: "When to choose it" does not name ${re}`);
    assert.match(tr.choose, HIDES[lang], `${lang}: "When to choose it" — the zipper hidden, its colour`);
    assert.match(tr.choose, ONE[lang], `${lang}: "When to choose it" — one line of stitching`);
  }
  for (const p of projects) {
    const n = figure(p.slug).model.STEPS.length;
    for (let k = 0; k < n; k++) assert.ok(!guidesForStep(p.slug, k).some((x) => x.section.id === 'lapped'), `${p.slug} step ${k} links to #lapped`);
  }
});

test('lapped: no search traps (spec 5.1) — figure and section texts; never another section by its number or the page layout', () => {
  const ORDINAL = /\b(?:first|second|third|fourth|fifth|sixth) way\b|(?:перв|втор|трет|четв[её]рт|пят|шест)\p{L}* способ|(?:erste|zweite|dritte|vierte|fünfte)n? (?:Art|Methode|Weg)|(?:première|deuxième|troisième|quatrième|cinquième) (?:méthode|façon)|(?:primo|secondo|terzo|quarto|quinto) (?:modo|metodo)|(?:primera|segunda|tercera|cuarta|quinta) (?:forma|manera)/iu;
  const LAYOUT = /under th\w+ figure|below th\w+ figure|под рисунком|unter der Abbildung|sous (?:la|cette) figure|sotto (?:la|questa) figura|debajo de (?:la|esta) figura|bajo (?:la|esta) figura/iu;
  for (const lang of LOCALES) {
    for (const [where, s] of lapStrings(lang)) {
      if (lang === 'en') assert.doesNotMatch(s, /sandwich/i, `en ${where}: "sandwich"`);
      if (lang === 'ru') {
        assert.doesNotMatch(s, /замо?к/iu, `ru ${where}: «замок»`);
        assert.doesNotMatch(s, /(?<!\p{L})ушк/iu, `ru ${where}: «ушки»`);
        assert.doesNotMatch(s, /планк/iu, `ru ${where}: «планка» («молния с планкой» — a jacket's flap)`);
      }
      if (lang === 'de') {
        assert.doesNotMatch(s, /(?<!naht)verdeckt/iu, `de ${where}: «verdeckt»`);
        assert.doesNotMatch(s, /\bRV\b/, `de ${where}: the abbreviation «RV» — the full word`);
      }
      if (lang === 'it') assert.doesNotMatch(s, /centrale|nascost/iu, `it ${where}: «centrale» / «nascosta»`);
      if (lang === 'es') assert.doesNotMatch(s, /cierre/iu, `es ${where}: «cierre» (once, in the h1, only)`);
      assert.doesNotMatch(s, ORDINAL, `${lang} ${where}: another section by its number`);
      assert.doesNotMatch(s, LAYOUT, `${lang} ${where}: text tied to the page layout`);
    }
    if (lang === 'it') {
      for (const [where, s] of lapSection(lang).filter(([w]) => w !== 'sections.lapped.title')) {
        for (const x of sentences(s).filter((y) => /cerniera/i.test(y))) {
          assert.match(x, /cuci|pochette|borsa|cuscin|federa|gonna|abito|vestito|astuccio|pantalon/i, `it ${where}: «${x}» — «cerniera» with no sewing word`);
        }
      }
    }
  }
});

test('lapped: language rules — French punctuation, straight apostrophe', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of lapStrings(lang)) {
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?»]/, `fr ${where}: no no-break space before : ; ! ? »`);
      if (lang === 'fr') assert.doesNotMatch(s, /«(?!\xa0)/, `fr ${where}: no no-break space after «`);
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

test('lapped: steps — the finished seam, then mark, seam, baste, press open, overlap back, the zipper face down, close to the teeth, turned face up, along the fold, the overlap over, its stitching, unpick', () => {
  assert.equal(lapped.STEPS.length, 13);
  lapped.STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of LAP_LANGS) assert.equal(lappedText(lang).steps.length, 13, lang);
  assert.deepEqual(lapped.STEPS.map((s) => s.stitch ?? null), [null, null, 'straight', 'basting', null, null, null, 'straight', null, 'straight', null, 'straight', null]);
  assert.deepEqual(lapped.STEPS.map((s) => (s.sew ?? []).map(([, , f]) => f)), [[], [], ['seam'], ['seam'], [], [], [], ['zipper'], [], ['zipper'], [], ['zipper'], []]);
});

test('lapped: uses are catalog products', () => {
  const ids = new Set(products.map((p) => p.id));
  lapped.STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  const FOOT = ['windman-presser-feet-set', 'janome-1522rd'];
  assert.deepEqual(lapped.STEPS.map((s) => s.uses ?? []), [
    [],
    ['soraco-sewing-clips', 'sewline-air-erasable-pen'],
    ['janome-1522rd'],
    ['janome-1522rd'],
    ['rowenta-travel-iron'],
    [],
    ['beaditive-magnetic-pin-holder'],
    FOOT,
    ['rowenta-travel-iron'],
    FOOT,
    ['beaditive-magnetic-pin-holder'],
    FOOT,
    ['rowenta-travel-iron'],
  ]);
  assert.ok(!lapped.STEPS.some((s) => (s.uses ?? []).some((id) => /zipper/.test(id))), 'a zipper product in a step');
});

test('lapped: figure is registered (build and browser)', () => {
  const f = figure(LAP);
  assert.equal(f.model.STEPS, lapped.STEPS);
  assert.equal(f.text('it'), lappedText('it'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'zipper-lapped':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/zipper-lapped\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/zipper-lapped\.\?\?\.js'\)\s*\}/);
});

test('lapped: every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of LAP_LANGS) {
    const L = lappedText(lang);
    for (let k = 0; k < lapped.STEPS.length; k++) {
      for (let i = 0; i <= 10; i++) {
        const r = lapped.renderStep(k, i / 10, L);
        assert.ok(r.viewBox.every(Number.isFinite), `${lang} step ${k} t=${i / 10}: viewBox`);
        assert.ok(!r.body.includes('NaN') && !r.body.includes('undefined'), `${lang} step ${k} t=${i / 10}: body`);
        for (const m of r.body.matchAll(/url\(#([^)]+)\)/g)) assert.ok(m[1].startsWith(`${LAP}-`), `${lang} step ${k}: #${m[1]}`);
      }
    }
  }
  for (const m of lapped.DEFS.matchAll(/id="([^"]+)"/g)) assert.ok(m[1].startsWith(`${LAP}-`), `DEFS: #${m[1]}`);
});

test('lapped: chips stay inside the figure and keep a 1% gap between them (every step, t = 0…1, every language)', () => {
  for (const lang of LAP_LANGS) {
    const L = lappedText(lang);
    for (let k = 1; k < lapped.STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox } = lapped.renderStep(k, i / 20, L);
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

test('lapped: lines are drawn before the chips', () => {
  for (let k = 1; k < lapped.STEPS.length; k++) {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const kinds = lapped.STEPS[k].scene(t).over.map((o) => o.type);
      const lastLine = kinds.lastIndexOf('line');
      const firstChip = kinds.findIndex((x) => x === 'label' || x === 'dim');
      assert.ok(lastLine < firstChip || firstChip < 0, `step ${k} t=${t}: a line comes after a chip`);
    }
  }
});

test('lapped: every chip key of the drawing has its text', () => {
  for (const lang of LAP_LANGS) assert.deepEqual(Object.keys(lappedText(lang).labels).sort(), [...lapped.LABEL_KEYS].sort(), lang);
});

test('lapped: the model loads no other model', () => {
  const src = readFileSync(new URL('../../src/lib/anatomy/zipper-lapped.js', import.meta.url), 'utf8');
  for (const m of src.matchAll(/from\s+'\.\/([^']+)'/g)) assert.ok(['iso.js', 'kit.js'].includes(m[1]), `imports ${m[1]}`);
});

test('lapped: on the built page — its own <section id="lapped"> after centered, with its figure, no link to another section', () => {
  for (const lang of LOCALES) {
    const file = new URL(`../../dist/${lang === 'en' ? '' : `${lang}/`}guides/sew-a-zipper.html`, import.meta.url);
    assert.ok(existsSync(file), `${lang}: run npm run build first`);
    const html = readFileSync(file, 'utf8');
    const from = html.search(/<section[^>]*id="lapped"/);
    assert.ok(from > html.search(/<section[^>]*id="centered"/), `${lang}: no <section id="lapped"> after centered`);
    const next = html.indexOf('<section class="section', from + 1);
    const sec = html.slice(from, next < 0 ? undefined : next);
    assert.match(sec, /zipper-lapped-print/, `${lang}: no lapped figure in the section`);
    assert.doesNotMatch(sec, /href="#(?:lined|tabs|recessed|centered|invisible)"/, `${lang}: a link to another section`);
  }
});

/* ===================================================================================================================
   Section 6, `invisible` — the invisible zipper (spec 3 row 6 and «Лапка», 4, 5.1, 5.2, 5.3 «Раздел 6 — потайная
   молния»): a public technique, NO numbers and no units. A piece of the seam, not a garment, sewn in the order the nine
   sources agree on: the seam left open; the zipper opened, its coil pressed flat from the back with a barely warm iron;
   face down on the right side of one piece, the coil on the seam line; the invisible zipper foot, the coil in one
   groove, stitched from top to bottom until the pull stops the foot, backstitched; the other side with the other
   groove, the top edges level, not twisted; the zipper closed; the seam below with the (regular) zipper foot, from a
   little above and to the side of the end of the zipper stitching; the tape ends to the seam allowances only. From the
   outside only the seam line and the pull show. Unlike centered and lapped, the direction "from top to bottom" IS said:
   all the sources agree on it; the opposite direction is never said. The invisible zipper foot is named, never linked
   (it is not in the catalog); the seam below links the zipper foot (Windman set).
   Figure src/lib/anatomy/zipper-invisible.js (key zipper-invisible), texts zipper-invisible.<lang>.js, checks
   zipper-invisible.text.js.
   =================================================================================================================== */
import * as invisible from '../../src/lib/anatomy/zipper-invisible.js';
import { INVISIBLE_TEXT, invisibleText } from '../../src/lib/anatomy/zipper-invisible.text.js';

const INV = 'zipper-invisible';
const INV_LANGS = Object.keys(INVISIBLE_TEXT);
/** The section's own texts in a language: [where, text]. */
const invSection = (lang) => guideStrings(lang, 'invisible').filter(([where]) => where.startsWith('sections.invisible.'));
/** Every text of the section: the figure's (its number `ui.fig` aside) and the section's. */
const invStrings = (lang) => [...strings(invisibleText(lang)).filter(([where]) => where !== 'ui.fig'), ...invSection(lang)];
/** The steps sewing the zipper with the invisible zipper foot (in its grooves), and the one with the zipper foot. */
const grooveSewing = (s) => (s.sew ?? []).some(([, , f]) => f === 'groove');
const grooveSteps = () => invisible.STEPS.map((s, k) => (grooveSewing(s) ? k : -1)).filter((k) => k > 0);
const lowerStep = () => invisible.STEPS.findIndex((s, k) => k > 0 && zipSewing(s));
const invStep = (label) => invisible.STEPS.findIndex((s, k) => k > 0 && s.scene(0).over.some((o) => o.label === label));
/** The lines of a kind (zip / lower / ends) on a set of pieces: [{ p, l }]. */
const sewnLines = (pieces, tag) => pieces.flatMap((p) => (p.lines ?? []).filter((l) => l[tag]).map((l) => ({ p, l })));
const BACKSTITCH_ANY = { en: /backstitch/i, ru: /закрепк/iu, de: /verriegel|verriegl/i, fr: /point d'arrêt/i, it: /fermatura/i, es: /remat/i };

// The invisible zipper foot (named, never linked) and the regular zipper foot (the seam below; the Windman set).
const INVISIBLE_FOOT = { en: /invisible zipper foot/, ru: /лапк\p{L}* для потайной молнии/u, de: /Nähfuß für nahtverdeckte Reißverschlüsse/, fr: /pied pour fermeture invisible/, it: /piedino per cerniera invisibile/, es: /prensatelas para cremalleras invisibles/ };
const REGULAR_FOOT = { en: /(?<!invisible )zipper foot/, ru: /лапк\p{L}* для молнии/iu, de: /Reißverschlussfuß/, fr: /pied fermeture éclair/, it: /piedino per cerniere(?! invisibili)/, es: /prensatelas para cremalleras(?! invisibles)/ };

test('invisible: every site language has the figure texts', () => {
  assert.deepEqual([...INV_LANGS].sort(), [...LOCALES].sort());
});

test('invisible: no units — no digit, no fraction, no unit (figure, chips, legend, section texts; every language)', () => {
  const WORDS = /(?<!\p{L})(?:centimet\p{L}*|millimet\p{L}*|сантиметр\p{L}*|миллиметр\p{L}*|Zentimeter|Millimeter|centimètres?|millimètres?|centimetri|millimetri|centímetros?|milímetros?|degrees?|градус\p{L}*|Grad|degrés?|gradi|grados?)(?!\p{L})/iu;
  for (const lang of INV_LANGS) {
    for (const [where, s] of invStrings(lang)) {
      assert.doesNotMatch(s, /\d/, `${lang} ${where}: a digit`);
      assert.doesNotMatch(s, /[¼½¾⅓⅔⅛⅜⅝⅞″%°]|⁄/, `${lang} ${where}: a fraction or a unit sign`);
      assert.doesNotMatch(s, UNIT, `${lang} ${where}: a unit`);
      assert.doesNotMatch(s, WORDS, `${lang} ${where}: a unit in words`);
    }
    assert.match(invisibleText(lang).ui.fig, /^\S+\.? 6$/u, `${lang}: ui.fig`);
  }
  assert.deepEqual(invisible.SPEC, {}, 'the model has no maker\'s numbers');
});

test('invisible: the zipper before the seam — the seam stays open while the zipper is sewn in; the seam below comes after (model + words)', () => {
  const low = lowerStep();
  const grooves = grooveSteps();
  assert.equal(grooves.length, 2, 'the two sides of the zipper, each with the invisible zipper foot');
  assert.ok(low > Math.max(...grooves), 'the seam below is not sewn after the zipper');
  // before the seam below, nothing joins the two pieces; the zipper stitching is there once each side is sewn
  for (let k = 1; k < low; k++) {
    for (const t of [0, 0.5, 1]) assert.deepEqual(sewnLines(invisible.STEPS[k].scene(t).pieces, 'lower'), [], `step ${k} t=${t}: the seam below before the zipper is in`);
  }
  assert.deepEqual(sewnLines(invisible.STEPS[low].scene(0).pieces, 'lower'), [], 'the seam below is there before it is sewn');
  assert.ok(sewnLines(invisible.STEPS[low].scene(1).pieces, 'lower').length > 0, 'the seam below is not sewn in its step');
  for (const [i, k] of grooves.entries()) {
    const side = ['a', 'b'][i];
    const has = (t) => sewnLines(invisible.STEPS[k].scene(t).pieces, 'zip').some(({ l }) => l.zip === side);
    assert.ok(!has(0) && has(1), `step ${k}: side ${side} is not sewn in its step`);
  }
  assert.ok(sewnLines(invisible.STEPS[low].scene(0).pieces, 'zip').length >= 4, 'both sides of the zipper are not in before the seam below');
  // the first step: leave the seam open (the zipper first)
  const OPEN = { en: /seam open/i, ru: /шов[^.]*открыт/iu, de: /Naht offen/i, fr: /couture ouverte/i, it: /cucitura aperta/i, es: /costura abierta/i };
  assert.equal(invStep('seamOpen'), 1, 'the first step does not leave the seam open');
  for (const lang of LOCALES) {
    const L = invisibleText(lang);
    assert.match(stepWords(L, 1), OPEN[lang], `${lang} step 1: leave the seam open`);
    assert.match(L.labels.seamOpen, OPEN[lang], `${lang}: chip seamOpen`);
  }
});

test('invisible: name traps (spec 5.1, 5.2) — de «nahtverdeckt», es without «cierre», it «cerniera invisibile» and never «nascosta»', () => {
  const g = guideBySlug(SLUG);
  const sec = (lang) => guideText(g, lang).sections.find((s) => s.id === 'invisible');
  assert.match(sec('de').title, /nahtverdeckt/i, 'de: the name without «nahtverdeckt»');
  for (const [where, s] of invStrings('de')) assert.doesNotMatch(s, /(?<!naht)verdeckt/iu, `de ${where}: «verdeckt» without «naht-» (also the lapped zipper)`);
  assert.doesNotMatch(sec('es').title, /cierre/i, 'es: «cierre» in the name');
  assert.doesNotMatch(sec('es').line, /cierre/i, 'es: «cierre» in the line');
  for (const [where, s] of invStrings('es')) assert.doesNotMatch(s, /cierre/iu, `es ${where}: «cierre» («cierre invisible» is knitting in Spain)`);
  assert.equal(sec('it').title, 'Cerniera invisibile', 'it: the name');
  for (const [where, s] of invStrings('it')) assert.doesNotMatch(s, /nascost|centrale/iu, `it ${where}: «nascosta» / «centrale» (door hinges)`);
});

test('invisible: the invisible zipper foot is named but not linked; the seam below with the zipper foot, linked (Windman set)', () => {
  const grooves = grooveSteps();
  const low = lowerStep();
  // no catalog product is an invisible zipper foot: nothing to link to
  assert.ok(!products.some((p) => /invisible[^.]*(?:zip|foot)|(?:zip|foot)[^.]*invisible/i.test(`${p.id} ${p.name} ${p.shortDescription}`)), 'an invisible zipper or foot in the catalog — link it on purpose, not by accident');
  for (const k of grooves) assert.deepEqual(invisible.STEPS[k].uses ?? [], ['janome-1522rd'], `step ${k}: a product linked where the invisible zipper foot sews`);
  assert.deepEqual(invisible.STEPS[low].uses, ['windman-presser-feet-set', 'janome-1522rd'], 'the seam below: the zipper foot (Windman set) and the machine');
  invisible.STEPS.forEach((s, k) => { if (k !== low) assert.ok(!(s.uses ?? []).includes('windman-presser-feet-set'), `step ${k}: the presser feet set outside the seam below`); });
  for (const lang of LOCALES) {
    const L = invisibleText(lang);
    for (const k of grooves) assert.match(stepWords(L, k), INVISIBLE_FOOT[lang], `${lang} step ${k}: no invisible zipper foot`);
    assert.match(stepWords(L, low), REGULAR_FOOT[lang], `${lang} step ${low}: no zipper foot for the seam below`);
    assert.doesNotMatch(stepWords(L, low), INVISIBLE_FOOT[lang], `${lang} step ${low}: the invisible zipper foot for the seam below`);
  }
  // on the built page: the foot's name is text — never inside a link
  for (const lang of LOCALES) {
    const file = new URL(`../../dist/${lang === 'en' ? '' : `${lang}/`}guides/sew-a-zipper.html`, import.meta.url);
    assert.ok(existsSync(file), `${lang}: run npm run build first`);
    const html = readFileSync(file, 'utf8').replace(/&#39;/g, "'");
    const from = html.search(/<section[^>]*id="invisible"/);
    assert.ok(from > 0, `${lang}: no <section id="invisible">`);
    const sec = html.slice(from);
    assert.match(sec, INVISIBLE_FOOT[lang], `${lang}: the invisible zipper foot is not named on the page`);
    for (const m of sec.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) assert.doesNotMatch(m[1], INVISIBLE_FOOT[lang], `${lang}: the invisible zipper foot in a link`);
  }
});

test('invisible: the coil pressed flat from the back with a barely warm iron — a hot iron melts it (model + words)', () => {
  const D = invisible.DRAWING;
  const k = invStep('coolIron');
  assert.equal(k, 2, 'the coil is not pressed right after the seam is left open');
  // the zipper comes in, then is pressed: rolled before, flat after
  const coil = (t) => invisible.STEPS[k].scene(t).pieces.find((p) => p.id === 'zip-coil-a');
  const width = (p) => Math.max(...p.pts.map((q) => q[1])) - Math.min(...p.pts.map((q) => q[1]));
  assert.ok(Math.abs(width(coil(0.45)) - D.coil[0]) < 1e-6 && Math.abs(width(coil(1)) - D.coil[1]) < 1e-6 && D.coil[1] > D.coil[0], 'the coil is not pressed flat');
  for (const t of [0.5, 1]) for (const p of invisible.STEPS[k].scene(t).pieces.filter((x) => /^zip-tape/.test(x.id))) assert.ok(p.out[2] < -0.99, `${p.id}: not back up (face down) while pressed from the back`);
  assert.deepEqual(invisible.STEPS[k].uses, ['rowenta-travel-iron']);
  const WARM = { en: /barely warm iron/i, ru: /чуть тёпл\p{L}* утюг/iu, de: /kaum warm\p{L}* Bügeleisen/iu, fr: /fer à peine chaud/i, it: /ferro appena tiepido/i, es: /plancha apenas tibia/i };
  const BACK = { en: /from the back/i, ru: /с изнанки/iu, de: /von hinten/i, fr: /sur l'envers/i, it: /dal rovescio/i, es: /por el revés/i };
  const MELT = { en: /hot iron melts/i, ru: /горяч\p{L}* утюг плавит/iu, de: /heißes Bügeleisen schmilzt/i, fr: /fer chaud fait fondre/i, it: /ferro caldo scioglie/i, es: /plancha caliente derrite/i };
  const LONGER = { en: /a little longer than the opening/i, ru: /чуть длиннее разреза/iu, de: /etwas länger als der Schlitz/i, fr: /un peu plus longue que l'ouverture/i, it: /un po' più lunga dell'apertura/i, es: /un poco más larga que la abertura/i };
  for (const lang of LOCALES) {
    const L = invisibleText(lang);
    assert.match(stepWords(L, k), WARM[lang], `${lang} step ${k}: a barely warm iron`);
    assert.match(L.labels.coolIron, WARM[lang], `${lang}: chip coolIron`);
    assert.match(stepWords(L, k), BACK[lang], `${lang} step ${k}: from the back`);
    assert.match(L.labels.fromBack, BACK[lang], `${lang}: chip fromBack`);
    assert.match(stepWords(L, k), MELT[lang], `${lang} step ${k}: a hot iron melts the coil`);
    assert.match(stepWords(L, k), LONGER[lang], `${lang} step ${k}: a zipper a little longer than the opening`);
  }
  // the drawing: the zipper is longer than the opening (the end of the zipper stitching), but only a little
  assert.ok(D.zipper[1] > D.end && D.zipper[1] - D.end < D.end / 2, 'the zipper is not a little longer than the opening');
});

test('invisible: face down on the right side of one piece, the coil on the seam line; then the other half the same way on the other piece, the top edges level, not twisted (model)', () => {
  const [g1, g2] = grooveSteps();
  const k1 = invStep('coilOnSeam'), k2 = invStep('freeHalf');
  assert.ok(k1 > 2 && k1 < g1 && k2 > g1 && k2 < g2, 'the zipper is not laid before each side is sewn');
  const check = (k, side) => {
    const ps = invisible.STEPS[k].scene(1).pieces;
    const tape = ps.find((p) => p.id === `zip-tape-${side}`), allow = ps.find((p) => p.id === `allowance-${side}`);
    assert.ok(tape.out[2] < -0.99, `step ${k}: tape ${side} not face down`);
    assert.ok(allow.out[2] > 0.99, `step ${k}: allowance ${side} not right side up under it`);
    assert.ok(tape.O[2] > allow.O[2], `step ${k}: tape ${side} not on the allowance`);
    assert.ok(Math.abs(tape.O[1] - allow.O[1]) < 1e-9 && Math.abs(tape.V[1] - allow.V[1]) < 1e-9, `step ${k}: tape ${side} not from the seam line over the allowance`);
    // the coil's edge right on that piece's seam line (where its body and its allowance meet)
    const coil = ps.find((p) => p.id === `zip-coil-${side}`);
    const ys = coil.pts.filter(([u]) => u > invisible.DRAWING.end).map(([u, v]) => at(coil, u, v)[1]);
    assert.ok(ys.some((y) => Math.abs(y - allow.O[1]) < 1e-9), `step ${k}: coil ${side} not on the seam line`);
    return tape;
  };
  check(k1, 'a');
  assert.ok(invisible.STEPS[k1].scene(1).pieces.find((p) => p.id === 'piece-a').out[2] > 0.99, 'piece A not right side up');
  const tb = check(k2, 'b');
  // the other side: A over B, right sides together; both halves face down, one on each side of the seam line (as the
  // closed zipper lies, turned over: not twisted), the top edges level
  const ps = invisible.STEPS[k2].scene(1).pieces;
  const a = ps.find((p) => p.id === 'piece-a'), b = ps.find((p) => p.id === 'piece-b');
  assert.ok(a.out[2] < -0.99 && b.out[2] > 0.99 && a.O[2] > b.O[2], 'piece A is not over piece B, right sides together');
  const ta = ps.find((p) => p.id === 'zip-tape-a');
  assert.ok(ta.out[2] < -0.99 && tb.out[2] < -0.99, 'the two halves are not both face down');
  assert.ok(ta.V[1] < -0.99 && tb.V[1] > 0.99, 'the two halves are not on either side of the seam line (twisted)');
  const top = (p) => Math.min(...p.pts.map(([u, v]) => at(p, u, v)[0]));
  assert.ok(Math.abs(top(ta) - top(tb)) < 1e-9 && Math.abs(top(a) - top(b)) < 1e-9, 'the top edges are not level');
  const TOPS = { en: /top edges/i, ru: /верхние края/iu, de: /Oberkanten/i, fr: /bords du haut/i, it: /bordi in alto/i, es: /bordes de arriba/i };
  const TWIST = { en: /not be twisted|not twisted/i, ru: /не перекру/iu, de: /nicht verdreht/i, fr: /sans la vriller|pas vrillée/i, it: /senza attorcigliarla|non attorcigliata/i, es: /sin torcerla|no torcida/i };
  const CROSS = { en: /cross seams/i, ru: /поперечные швы/iu, de: /Quernähte/i, fr: /coutures transversales/i, it: /cuciture trasversali/i, es: /costuras transversales/i };
  for (const lang of LOCALES) {
    const L = invisibleText(lang);
    assert.match(stepWords(L, k2), TOPS[lang], `${lang} step ${k2}: the top edges`);
    assert.match(stepWords(L, k2), TWIST[lang], `${lang} step ${k2}: not twisted`);
    assert.match(stepWords(L, k2), CROSS[lang], `${lang} step ${k2}: cross seams`);
    assert.match(L.labels.notTwisted, TWIST[lang], `${lang}: chip notTwisted`);
  }
});

test('invisible: from top to bottom until the pull stops the foot, backstitched; the coil in one groove, then the other — the opposite way never said (model + words)', () => {
  const D = invisible.DRAWING;
  const [g1, g2] = grooveSteps();
  for (const k of [g1, g2]) {
    const o = invisible.STEPS[k].scene(0.5).over.find((x) => x.type === 'line');
    // along the zipper toward the bottom (x grows), from by the top to the end of the stitching, then back a little
    assert.ok(o.pts[0][0] < 1 && Math.abs(o.pts[1][0] - D.end) < 1e-6, `step ${k}: not from top to bottom`);
    assert.ok(o.pts.length > 2 && o.pts[2][0] < o.pts[1][0], `step ${k}: no backstitch at the end`);
  }
  // the stitching ends right where the open zipper's pull is: the pull stops the foot
  const pull = invisible.STEPS[g1].scene(0.5).pieces.find((p) => p.id === 'zip-pull');
  const pullTop = Math.min(...pull.pts.map(([u, v]) => at(pull, u, v)[0]));
  assert.ok(pullTop > D.end && pullTop - D.end < 0.5, 'the stitching does not end at the pull');
  // close to the coil, on the tape
  assert.ok(D.stitch > D.coil[1] && D.stitch < D.tape / 2, 'the zipper stitching is not close to the coil');
  const TOP_DOWN = { en: /from top to bottom/i, ru: /сверху вниз/iu, de: /von oben nach unten/i, fr: /de haut en bas/i, it: /dall'alto verso il basso/i, es: /de arriba abajo/i };
  const STOPS = { en: /pull stops the foot/i, ru: /упр\p{L}* в бегунок/iu, de: /an den Schieber stößt/i, fr: /bute contre le curseur/i, it: /tocca il cursore/i, es: /tope con el tirador/i };
  const ONE = { en: /one of (?:its|the) (?:two )?grooves/i, ru: /одн\p{L}* из (?:двух )?канав/iu, de: /einer? der (?:zwei |beiden )?Rillen/i, fr: /une des (?:deux )?rainures/i, it: /una delle (?:due )?scanalature/i, es: /una de las (?:dos )?ranuras/i };
  const OTHER = { en: /other groove/i, ru: /друг\p{L}* канав/iu, de: /andere\p{L}* Rille/iu, fr: /autre rainure/i, it: /altra scanalatura/i, es: /otra ranura/i };
  const COIL_CAUGHT = { en: /catches the coil/i, ru: /строчк\p{L}* (?:захват|прихват)\p{L}* спирал/iu, de: /Naht die Spirale/i, fr: /piqûre attrape la spirale/i, it: /cucitura prende la spirale/i, es: /pespunte atrapa la espiral/i };
  const UPWARD = /bottom to top|from the bottom|\bupwards?\b|снизу вверх|снизу|von unten nach oben|von unten|de bas en haut|depuis le bas|en remontant|dal basso verso l'alto|dal basso|de abajo (?:hacia )?arriba|desde abajo/iu;
  for (const lang of LOCALES) {
    const L = invisibleText(lang);
    for (const k of [g1, g2]) {
      assert.match(stepWords(L, k), TOP_DOWN[lang], `${lang} step ${k}: from top to bottom`);
      assert.match(stepWords(L, k), STOPS[lang], `${lang} step ${k}: until the pull stops the foot`);
      assert.match(stepWords(L, k), BACKSTITCH_ANY[lang], `${lang} step ${k}: the backstitch`);
    }
    assert.match(stepWords(L, g1), ONE[lang], `${lang} step ${g1}: the coil in one groove`);
    assert.match(stepWords(L, g2), OTHER[lang], `${lang} step ${g2}: the other groove`);
    assert.match(L.labels.otherGroove, OTHER[lang], `${lang}: chip otherGroove`);
    assert.match(L.labels.topDown, TOP_DOWN[lang], `${lang}: chip topDown`);
    assert.match(L.labels.toPull, STOPS[lang], `${lang}: chip toPull`);
    assert.match(stepWords(L, g1), COIL_CAUGHT[lang], `${lang} step ${g1}: the coil caught in the stitching (a common mistake)`);
    for (const [where, s] of invStrings(lang)) assert.doesNotMatch(s, UPWARD, `${lang} ${where}: the opposite direction`);
  }
});

test('invisible: the zipper closed, the pull at the top; the seam below a little above and to the side of the end of the zipper stitching, to the bottom edge (model + words)', () => {
  const D = invisible.DRAWING;
  const k = invStep('close');
  const low = lowerStep();
  assert.ok(k > grooveSteps()[1] && k < low, 'the zipper is not closed between its second side and the seam below');
  const pullX = (t) => Math.min(...invisible.STEPS[k].scene(t).pieces.find((p) => p.id === 'zip-pull').pts.map(([u]) => u));
  assert.ok(pullX(0) > D.end && pullX(1) < 1, 'the pull does not go up to the top');
  const [start, , last] = D.lower;
  assert.ok(start[0] < D.end && D.end - start[0] < 1, 'the seam below does not start a little above the end of the zipper stitching');
  assert.ok(start[1] > 0 && start[1] < D.stitch, 'the seam below does not start to the side of the zipper stitching');
  assert.ok(Math.abs(last[0] - D.length) < 0.1 && last[1] < 0.1, 'the seam below does not run on the seam line to the bottom edge');
  // sewn right sides together, through both allowances (in each one's own (u, v) the same line)
  const end = invisible.STEPS[low].scene(1).pieces;
  const ls = sewnLines(end, 'lower');
  assert.deepEqual(ls.map(({ p }) => p.id).sort(), ['allowance-a', 'allowance-b'], 'the seam below is not through both allowances');
  const w = ls.map(({ p, l }) => at(p, ...l.pts[1]));
  assert.ok(Math.hypot(w[0][0] - w[1][0], w[0][1] - w[1][1]) < 1e-6, 'the seam below is not the same line on both allowances');
  const a = end.find((p) => p.id === 'allowance-a'), b = end.find((p) => p.id === 'allowance-b');
  assert.ok(a.out[2] < -0.99 && b.out[2] > 0.99, 'not right sides together for the seam below');
  const CLOSE = { en: /close the zipper/i, ru: /закройте молнию/iu, de: /schließe den Reißverschluss/i, fr: /fermez la fermeture/i, it: /chiudi la (?:zip|cerniera)/i, es: /cierra la cremallera/i };
  const ABOVE = { en: /a little above and to the side of the end of the zipper stitching/i, ru: /чуть выше и в стороне от конца строчки/iu, de: /etwas oberhalb und seitlich vom Ende der Reißverschlussnaht/i, fr: /un peu au-dessus et à côté de la fin de la piqûre/i, it: /un po' più in alto e di lato rispetto alla fine della cucitura/i, es: /un poco más arriba y a un lado del final del pespunte/i };
  for (const lang of LOCALES) {
    const L = invisibleText(lang);
    assert.match(stepWords(L, k), CLOSE[lang], `${lang} step ${k}: close the zipper`);
    assert.match(stepWords(L, low), ABOVE[lang], `${lang} step ${low}: a little above and to the side`);
  }
});

test('invisible: the tape ends to the seam allowances only — never through the pieces (model + words)', () => {
  const k = invStep('tapeEnds');
  assert.ok(k > lowerStep(), 'the tape ends are not stitched after the seam below');
  assert.deepEqual(sewnLines(invisible.STEPS[k].scene(0).pieces, 'ends'), [], 'the tape ends before they are sewn');
  const ids = sewnLines(invisible.STEPS[k].scene(1).pieces, 'ends').map(({ p }) => p.id).sort();
  assert.deepEqual(ids, ['allowance-a', 'allowance-b', 'zip-tape-a', 'zip-tape-b'], 'the tape ends are not stitched to the allowances only');
  for (const p of invisible.anatomy(0).pieces.filter((x) => /^piece/.test(x.id))) assert.deepEqual(p.lines ?? [], [], `${p.id}: stitching through the piece itself`);
  const ONLY = { en: /\bonly\b/, ru: /только/u, de: /\bnur\b/, fr: /seulement|uniquement/, it: /\bsolo\b|soltanto/, es: /\bsolo\b|solamente/ };
  for (const lang of LOCALES) {
    const L = invisibleText(lang);
    assert.match(stepWords(L, k), ONLY[lang], `${lang} step ${k}: to the allowances only`);
    assert.match(L.labels.tapeEnds, ONLY[lang], `${lang}: chip tapeEnds`);
  }
});

test('invisible: the first frame (the HTML, no JS) — from the outside only the seam line and the pull; tapped, the zipper shows through', () => {
  const rest = invisible.anatomy(0).pieces;
  const a = rest.find((p) => p.id === 'piece-a'), b = rest.find((p) => p.id === 'piece-b');
  for (const p of [a, b]) assert.ok(p.out[2] > 0.99 && (p.opacity ?? 1) > 0.999, `${p.id}: not right side up and opaque`);
  // the two pieces meet on the seam line (no gap: the zipper does not show between them)
  const ys = (p) => p.pts.map(([u, v]) => at(p, u, v)[1]);
  assert.ok(Math.abs(Math.min(...ys(a))) < 1e-9 && Math.abs(Math.max(...ys(b))) < 1e-9, 'the pieces do not meet on the seam line');
  // everything of the zipper but the pull lies under a piece; the pull is on top, on the seam line
  const underBody = (w) => [w[1], w[1] + 1e-6, w[1] - 1e-6].some((y) => [a, b].some((q) => q.O[2] > w[2] && covers(q, [w[0], y])));
  for (const p of rest.filter((x) => /^zip-/.test(x.id) && x.id !== 'zip-pull')) {
    for (const [u, v] of p.pts) {
      const w = at(p, u, v);
      assert.ok(underBody(w), `${p.id}: shows from the outside at ${w.map((n) => n.toFixed(2))}`);
    }
  }
  const pull = rest.find((p) => p.id === 'zip-pull');
  assert.equal(rest.indexOf(pull), rest.length - 1, 'the pull is not drawn on top');
  assert.ok(pull.O[2] > a.O[2] && Math.abs(pull.O[1]) < 1e-9, 'the pull is not on the outside, on the seam line');
  assert.ok(Math.min(...pull.pts.map(([u]) => u)) < 1, 'the pull is not at the top: the zipper is not closed');
  assert.deepEqual(shownStitching(rest), [], 'stitching shows from the outside');
  for (const lang of INV_LANGS) {
    const L = invisibleText(lang);
    assert.equal(pinCount(invisible.renderStep(0, 0, L).body), L.legend.length, `${lang}: pins in the first frame`);
    assert.equal(pinCount(invisible.renderStep(0, 1, L).body), 0, `${lang}: pins once tapped`);
  }
  for (const p of invisible.anatomy(1).pieces.filter((x) => /^(piece|allowance)/.test(x.id))) assert.ok(p.opacity > 0.2 && p.opacity < 0.6, `${p.id}: not see-through`);
  // the last step ends where the first frame is
  const last = invisible.STEPS[invisible.STEPS.length - 1].scene(1).pieces;
  for (const p of rest) {
    const q = last.find((x) => x.id === p.id);
    assert.ok(q, `${p.id}: not in the last step`);
    for (const [u, v] of p.pts) {
      const [m, n] = [at(p, u, v), at(q, u, v)];
      assert.ok(Math.hypot(m[0] - n[0], m[1] - n[1], m[2] - n[2]) < 1e-6, `${p.id}: the last step does not end at the finished seam`);
    }
  }
  const ONLY = { en: /only the seam line and the pull/i, ru: /только линия шва и бегунок/iu, de: /nur die Nahtlinie und den Schieber/i, fr: /que la ligne de couture et le curseur/i, it: /solo la linea di cucitura e il cursore/i, es: /solo (?:se ven )?la línea de costura y el tirador/i };
  for (const lang of LOCALES) {
    const L = invisibleText(lang);
    assert.match(L.steps[0].text, ONLY[lang], `${lang} step 0: only the seam line and the pull`);
    assert.match(guideText(guideBySlug(SLUG), lang).sections.find((s) => s.id === 'invisible').line, ONLY[lang], `${lang}: line`);
  }
});

test('invisible: nothing passes below the table, nothing fully faded is drawn (every step, t = 0…1, and the first frame)', () => {
  for (let i = 0; i <= 40; i++) {
    for (let k = 0; k < invisible.STEPS.length; k++) {
      const ps = k ? invisible.STEPS[k].scene(i / 40).pieces : invisible.anatomy(i / 40).pieces;
      for (const p of ps) {
        assert.ok((p.opacity ?? 1) > 0.01, `step ${k} t=${i / 40}: ${p.id} faded`);
        for (const [u, v] of p.pts) assert.ok(at(p, u, v)[2] > -1e-6, `step ${k} t=${i / 40}: ${p.id} below the table`);
      }
    }
  }
});

test('invisible: a piece of the seam, not a garment — two pieces, their allowances and the zipper (every step and the first frame)', () => {
  const OK = /^(piece-[ab]|allowance-[ab]|zip-(?:tape-[ab]|coil-[ab]|stop-bottom|pull))$/;
  for (let i = 0; i <= 10; i++) {
    for (const p of invisible.anatomy(i / 10).pieces) assert.match(p.id, OK, `e=${i / 10}: ${p.id}`);
    for (let k = 1; k < invisible.STEPS.length; k++) for (const p of invisible.STEPS[k].scene(i / 10).pieces) assert.match(p.id, OK, `step ${k}: ${p.id}`);
  }
});

test('invisible: no first person, no maker — a general recommendation', () => {
  const W = (words) => new RegExp(`(?<!\\p{L})(?:${words})(?!\\p{L})`, 'u');
  const MINE = {
    en: W('I|my|me|mom|maker'), ru: W('я|мой|моя|моё|мои|мам\\p{L}*'), de: W('ich|mein\\p{L}*|Mama'),
    fr: W("je|j'|mon|ma|mes|maman"), it: W('io|mio|mia|miei|mie|mamma'), es: W('yo|mi|mis|mamá'),
  };
  for (const lang of LOCALES) for (const [where, s] of invStrings(lang)) assert.doesNotMatch(s, MINE[lang], `${lang} ${where}: a first-person or maker claim`);
});

const INV_NAME = { en: 'Invisible zipper', ru: 'Потайная молния', de: 'Nahtverdeckter Reißverschluss', fr: 'Fermeture invisible', it: 'Cerniera invisibile', es: 'Cremallera invisible' };
const FIG6 = { en: 'Fig. 6', ru: 'Рис. 6', de: 'Abb. 6', fr: 'Fig. 6', it: 'Fig. 6', es: 'Fig. 6' };

test('invisible: the section name is the approved one (spec 5.2); the figure is Fig. 6 under it', () => {
  for (const lang of LOCALES) {
    const g = guideText(guideBySlug(SLUG), lang);
    assert.equal(g.sections[5].title, INV_NAME[lang], lang);
    assert.equal(invisibleText(lang).ui.title, INV_NAME[lang], `${lang}: ui.title`);
    assert.equal(invisibleText(lang).ui.fig, FIG6[lang], `${lang}: ui.fig`);
  }
});

test('invisible: sixth and last, after lapped; no project yet, no note; "When to choose it" names the items people search, the regular foot and what it is not for', () => {
  const g = guideBySlug(SLUG);
  assert.deepEqual(g.sections.map((s) => [s.id, s.figure]), [['lined', KEY], ['tabs', TABS], ['recessed', REC], ['centered', CEN], ['lapped', LAP], ['invisible', INV]]);
  const s = g.sections[5];
  assert.deepEqual(s.usedIn, []);
  assert.equal(s.restIn, undefined, 'invisible stands on its own');
  const ITEMS = {
    en: [/dress/, /skirt/, /pillowcase/, /satin/], ru: [/плать/u, /юбк/u, /наволочк/u, /атлас/u],
    de: [/Kleid/, /Rock|Röcke/, /Kissenbezug|Kissenbezüge/, /Satin/], fr: [/robe/, /jupe/, /taie d'oreiller|taies d'oreiller/, /satin/],
    it: [/abit/, /gonn/, /feder/, /raso/], es: [/vestido/, /falda/, /funda de almohada|fundas de almohada/, /satén/],
  };
  const ALSO = { en: /regular zipper foot also works, but not as well/, ru: /обычной лапкой для молнии тоже можно, но хуже/iu, de: /normalen Reißverschlussfuß geht es auch, aber weniger gut/, fr: /pied fermeture éclair classique convient aussi, mais moins bien/, it: /anche il piedino per cerniere normale, ma meno/, es: /también sirve el prensatelas para cremalleras normal, pero peor/i };
  const NOT = { en: /not for thick fabrics/i, ru: /не для толст/iu, de: /nicht für dicke Stoffe/i, fr: /pas pour les tissus épais/i, it: /non per tessuti spessi/i, es: /no para telas gruesas/i };
  for (const lang of LOCALES) {
    const tr = guideText(g, lang).sections[5];
    assert.equal(tr.note, undefined, `${lang}: a note`);
    assert.equal(tr.rest, undefined, `${lang}: a rest sentence`);
    for (const f of SECTION_FIELDS) assert.ok(tr[f].trim(), `${lang}: ${f}`);
    if (lang !== 'en') for (const f of ['line', 'choose']) assert.notEqual(tr[f], s[f], `${lang}: ${f} not translated`);
    for (const re of ITEMS[lang]) assert.match(tr.choose, re, `${lang}: "When to choose it" does not name ${re}`);
    assert.match(tr.choose, ALSO[lang], `${lang}: "When to choose it" — a regular zipper foot also works, but not as well`);
    assert.match(tr.choose, NOT[lang], `${lang}: "When to choose it" — not for thick fabrics`);
  }
  for (const p of projects) {
    const n = figure(p.slug).model.STEPS.length;
    for (let k = 0; k < n; k++) assert.ok(!guidesForStep(p.slug, k).some((x) => x.section.id === 'invisible'), `${p.slug} step ${k} links to #invisible`);
  }
});

test('invisible: no search traps (spec 5.1) — figure and section texts; never another section by its number or the page layout', () => {
  const ORDINAL = /\b(?:first|second|third|fourth|fifth|sixth) way\b|(?:перв|втор|трет|четв[её]рт|пят|шест)\p{L}* способ|(?:erste|zweite|dritte|vierte|fünfte|sechste)n? (?:Art|Methode|Weg)|(?:première|deuxième|troisième|quatrième|cinquième|sixième) (?:méthode|façon)|(?:primo|secondo|terzo|quarto|quinto|sesto) (?:modo|metodo)|(?:primera|segunda|tercera|cuarta|quinta|sexta) (?:forma|manera)/iu;
  const LAYOUT = /under th\w+ figure|below th\w+ figure|под рисунком|unter der Abbildung|sous (?:la|cette) figure|sotto (?:la|questa) figura|debajo de (?:la|esta) figura|bajo (?:la|esta) figura/iu;
  for (const lang of LOCALES) {
    for (const [where, s] of invStrings(lang)) {
      if (lang === 'en') assert.doesNotMatch(s, /sandwich/i, `en ${where}: "sandwich"`);
      if (lang === 'ru') {
        assert.doesNotMatch(s, /замо?к/iu, `ru ${where}: «замок»`);
        assert.doesNotMatch(s, /(?<!\p{L})ушк/iu, `ru ${where}: «ушки»`);
        assert.doesNotMatch(s, /планк/iu, `ru ${where}: «планка»`);
      }
      if (lang === 'de') assert.doesNotMatch(s, /\bRV\b/, `de ${where}: the abbreviation «RV» — the full word`);
      assert.doesNotMatch(s, ORDINAL, `${lang} ${where}: another section by its number`);
      assert.doesNotMatch(s, LAYOUT, `${lang} ${where}: text tied to the page layout`);
    }
    if (lang === 'it') {
      for (const [where, s] of invSection(lang).filter(([w]) => w !== 'sections.invisible.title')) {
        for (const x of sentences(s).filter((y) => /cerniera/i.test(y))) {
          assert.match(x, /cuci|piedino|pochette|borsa|cuscin|federa|gonna|abito|vestito|astuccio|pantalon/i, `it ${where}: «${x}» — «cerniera» with no sewing word`);
        }
      }
    }
  }
});

test('invisible: language rules — French punctuation, straight apostrophe', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of invStrings(lang)) {
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?»]/, `fr ${where}: no no-break space before : ; ! ? »`);
      if (lang === 'fr') assert.doesNotMatch(s, /«(?!\xa0)/, `fr ${where}: no no-break space after «`);
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

test('invisible: steps — the finished seam, then seam open, press, face down, first side, other side, stitch it, close, the seam below, tape ends, right side up', () => {
  assert.equal(invisible.STEPS.length, 11);
  invisible.STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of INV_LANGS) assert.equal(invisibleText(lang).steps.length, 11, lang);
  assert.deepEqual(invisible.STEPS.map((s) => s.stitch ?? null), [null, null, null, null, 'straight', null, 'straight', null, 'straight', 'straight', null]);
  assert.deepEqual(invisible.STEPS.map((s) => (s.sew ?? []).map(([, , f]) => f)), [[], [], [], [], ['groove'], [], ['groove'], [], ['zipper'], ['seam', 'seam'], []]);
});

test('invisible: uses are catalog products', () => {
  const ids = new Set(products.map((p) => p.id));
  invisible.STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  assert.deepEqual(invisible.STEPS.map((s) => s.uses ?? []), [
    [],
    [],
    ['rowenta-travel-iron'],
    ['beaditive-magnetic-pin-holder'],
    ['janome-1522rd'],
    ['beaditive-magnetic-pin-holder'],
    ['janome-1522rd'],
    [],
    ['windman-presser-feet-set', 'janome-1522rd'],
    ['janome-1522rd'],
    [],
  ]);
  invisible.STEPS.forEach((s, k) => { if (s.stitch) assert.ok((s.uses ?? []).includes('janome-1522rd'), `step ${k}: sews without the machine`); });
  // the catalog's zippers are not invisible zippers: none in this section's steps
  assert.ok(!invisible.STEPS.some((s) => (s.uses ?? []).some((id) => /zipper/.test(id))), 'a zipper product in a step');
  // every product the section links is already in the guide's "What you'll need"
  const needs = new Set(guideBySlug(SLUG).needs);
  invisible.STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(needs.has(id), `step ${k}: ${id} not in needs`)));
});

test('invisible: figure is registered (build and browser)', () => {
  const f = figure(INV);
  assert.equal(f.model.STEPS, invisible.STEPS);
  assert.equal(f.text('it'), invisibleText('it'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'zipper-invisible':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/zipper-invisible\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/zipper-invisible\.\?\?\.js'\)\s*\}/);
});

test('invisible: every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of INV_LANGS) {
    const L = invisibleText(lang);
    for (let k = 0; k < invisible.STEPS.length; k++) {
      for (let i = 0; i <= 10; i++) {
        const r = invisible.renderStep(k, i / 10, L);
        assert.ok(r.viewBox.every(Number.isFinite), `${lang} step ${k} t=${i / 10}: viewBox`);
        assert.ok(!r.body.includes('NaN') && !r.body.includes('undefined'), `${lang} step ${k} t=${i / 10}: body`);
        for (const m of r.body.matchAll(/url\(#([^)]+)\)/g)) assert.ok(m[1].startsWith(`${INV}-`), `${lang} step ${k}: #${m[1]}`);
      }
    }
  }
  for (const m of invisible.DEFS.matchAll(/id="([^"]+)"/g)) assert.ok(m[1].startsWith(`${INV}-`), `DEFS: #${m[1]}`);
});

test('invisible: chips stay inside the figure and keep a 1% gap between them (every step, t = 0…1, every language)', () => {
  for (const lang of INV_LANGS) {
    const L = invisibleText(lang);
    for (let k = 1; k < invisible.STEPS.length; k++) {
      for (let i = 0; i <= 20; i++) {
        const { body, viewBox } = invisible.renderStep(k, i / 20, L);
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

test('invisible: lines are drawn before the chips', () => {
  for (let k = 1; k < invisible.STEPS.length; k++) {
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const kinds = invisible.STEPS[k].scene(t).over.map((o) => o.type);
      const lastLine = kinds.lastIndexOf('line');
      const firstChip = kinds.findIndex((x) => x === 'label' || x === 'dim');
      assert.ok(lastLine < firstChip || firstChip < 0, `step ${k} t=${t}: a line comes after a chip`);
    }
  }
});

test('invisible: every chip key of the drawing has its text', () => {
  for (const lang of INV_LANGS) assert.deepEqual(Object.keys(invisibleText(lang).labels).sort(), [...invisible.LABEL_KEYS].sort(), lang);
});

test('invisible: the model loads no other model', () => {
  const src = readFileSync(new URL('../../src/lib/anatomy/zipper-invisible.js', import.meta.url), 'utf8');
  for (const m of src.matchAll(/from\s+'\.\/([^']+)'/g)) assert.ok(['iso.js', 'kit.js'].includes(m[1]), `imports ${m[1]}`);
});

test('invisible: on the built page — its own <section id="invisible"> after lapped, with its figure, no link to another section', () => {
  for (const lang of LOCALES) {
    const file = new URL(`../../dist/${lang === 'en' ? '' : `${lang}/`}guides/sew-a-zipper.html`, import.meta.url);
    assert.ok(existsSync(file), `${lang}: run npm run build first`);
    const html = readFileSync(file, 'utf8');
    const from = html.search(/<section[^>]*id="invisible"/);
    assert.ok(from > html.search(/<section[^>]*id="lapped"/), `${lang}: no <section id="invisible"> after lapped`);
    const next = html.indexOf('<section class="section', from + 1);
    const sec = html.slice(from, next < 0 ? undefined : next);
    assert.match(sec, /zipper-invisible-print/, `${lang}: no invisible figure in the section`);
    assert.doesNotMatch(sec, /href="#(?:lined|tabs|recessed|centered|lapped)"/, `${lang}: a link to another section`);
  }
});

// ── The guide as a whole (Task 7): blurb, pageDescription, teaser, needsIntro say what the six sections do (spec 4, 3.2) ──
const LEAD = ['blurb', 'pageDescription', 'teaser', 'needsIntro'];
const leadStrings = (lang) => {
  const g = guideText(guideBySlug(SLUG), lang);
  return LEAD.map((f) => [f, g[f]]);
};

// The foot named in the blurb: the zipper foot for the ways with end tabs, a recessed, a centered and a lapped zipper;
// the invisible zipper foot for the invisible zipper; none for the lined pouch (the maker has not said — spec 3.2).
const ZIP_FOOT = {
  en: /zipper foot/, ru: /лапк\p{L}* для молнии/iu, de: /Reißverschlussfuß/, fr: /pied fermeture éclair/,
  it: /piedino per cerniere/, es: /prensatelas para cremalleras(?! invisibles)/,
};
const GUIDE_INV_FOOT = {
  en: /invisible zipper foot/, ru: /лапк\p{L}* для потайной молнии/u, de: /Nähfuß für nahtverdeckte Reißverschlüsse/,
  fr: /pied pour fermeture invisible/, it: /piedino per cerniera invisibile/, es: /prensatelas para cremalleras invisibles/,
};
const GUIDE_LINED = {
  en: /lined/i, ru: /подкладк/i, de: /Futter/i, fr: /doubl|sandwich/i, it: /fodera/i, es: /forro/i,
};
const ITEMS = {
  en: [/pouch/, /\bbag/, /pillow/, /skirt/, /dress/],
  ru: [/косметич/, /сумк/, /наволочк/, /юбк/, /плать/],
  de: [/Kosmetiktasche/, /Tasche/, /Kissen/, /Rock/, /Kleid/],
  fr: [/trousse/, /sac/, /coussin/, /jupe/, /robe/],
  it: [/pochette/, /bors/, /federa|cuscin/, /gonna/, /abito/],
  es: [/neceser/, /bolso/, /cojín/, /falda/, /vestido/],
};
const NAMES = {
  en: [/lined zipper pouch/, /end tabs/, /recessed zipper/, /centered/, /lapped/, /invisible/],
  ru: [/молния с подкладкой/i, /закрытые концы/i, /на планке в сумку/, /центральн/, /с перекрытием/, /потайн/],
  de: [/mit Futter/, /Enden/, /Blende/, /mittig/, /Übertritt/, /nahtverdeckt/],
  fr: [/sandwich/, /extrémités finies/, /encastrée/, /centrée/, /sous patte/, /invisible/],
  it: [/con fodera/, /estremità rifinite/, /incassata/, /centrata/, /con patta/, /invisibile/],
  es: [/con forro/, /extremos rematados/, /en el borde del bolso/, /centrada/, /con solapa/, /invisible/],
};
const SIX = { en: /six ways/i, ru: /шесть способов/i, de: /sechs Arten/i, fr: /six façons/i, it: /sei modi/i, es: /seis formas/i };
const PROMISE = {
  en: /by hand|hand.?sew|without (?:a )?(?:zipper )?foot|no zipper foot|beginner/i,
  ru: /вручную|без лапки|без лапк|для начинающих|новичк/i,
  de: /von Hand|ohne (?:Reißverschluss)?fuß|Anfänger/i,
  fr: /à la main|sans pied|débutant/i,
  it: /a mano|senza piedino|principiant/i,
  es: /a mano|sin prensatelas|principiante/i,
};
const FIRST_PERSON_USE = /\bI use\b|я пользуюсь|ich benutze|j'utilise|j’utilise|utilizo|\buso\b/i;
const RECOMMEND = {
  en: /I personally recommend/, ru: /я лично рекомендую/, de: /ich persönlich[^.]*empfehle/, fr: /je recommande personnellement/,
  it: /consiglio personalmente/, es: /recomiendo personalmente/,
};

test('guide texts: no digit at all in the blurb, description, teaser and needs line (spec 3, 4)', () => {
  for (const lang of LOCALES) {
    for (const [where, s] of leadStrings(lang)) {
      assert.doesNotMatch(s, /\d/, `${lang} ${where}: a digit`);
      assert.doesNotMatch(s, UNIT, `${lang} ${where}: a unit`);
    }
  }
});

test('guide texts: the blurb says which way is for what — the pouch and bag ways, the seam ways, the items people search for', () => {
  const sections = guideBySlug(SLUG).sections;
  assert.equal(sections.length, 6);
  for (const lang of LOCALES) {
    const { blurb } = guideText(guideBySlug(SLUG), lang);
    assert.match(blurb, SIX[lang], `${lang}: "six ways"`);
    for (const re of ITEMS[lang]) assert.match(blurb, re, `${lang}: ${re}`);
    // all six ways are named, in the order of the sections
    const at = NAMES[lang].map((re) => blurb.search(re));
    assert.ok(at.every((i) => i >= 0), `${lang}: a way is not named: ${at}`);
    assert.deepEqual([...at].sort((x, y) => x - y), at, `${lang}: the ways are named out of order`);
  }
});

test('guide texts: the zipper foot for tabs, recessed, centered and lapped; the invisible zipper foot for the invisible; no foot for the lined pouch', () => {
  for (const lang of LOCALES) {
    const { blurb } = guideText(guideBySlug(SLUG), lang);
    const sents = sentences(blurb);
    const zip = sents.filter((x) => ZIP_FOOT[lang].test(x));
    const inv = sents.filter((x) => GUIDE_INV_FOOT[lang].test(x));
    assert.ok(zip.length >= 1, `${lang}: the zipper foot is not named in the blurb`);
    assert.ok(inv.length >= 1, `${lang}: the invisible zipper foot is not named in the blurb`);
    for (const x of [...zip, ...inv]) assert.doesNotMatch(x, GUIDE_LINED[lang], `${lang}: the lined pouch gets a foot: «${x}»`);
  }
});

test('guide texts: no promise of sewing by hand, without a zipper foot, for beginners; never "I use"; "I personally recommend" in the needs line', () => {
  for (const lang of LOCALES) {
    for (const [where, s] of leadStrings(lang)) {
      assert.doesNotMatch(s, PROMISE[lang], `${lang} ${where}: a promise the guide does not make`);
      assert.doesNotMatch(s, FIRST_PERSON_USE, `${lang} ${where}: "I use"`);
    }
    assert.match(guideText(guideBySlug(SLUG), lang).needsIntro, RECOMMEND[lang], `${lang}: needsIntro`);
  }
});

test('guide texts: the needs line names exactly the products "What you\'ll need" shows, nothing else the catalog lacks as a link', () => {
  const KEY = {
    'soraco-sewing-clips': { en: /sewing clips/, ru: /зажим\p{L}* для шитья/u, de: /Stoffklammern/, fr: /pinces à tissu/, it: /clip per cucito/, es: /pinzas para coser/ },
    'janome-1522rd': { en: /sewing machine/, ru: /швейная машина/, de: /Nähmaschine/, fr: /machine à coudre/, it: /macchina da cucire/, es: /máquina de coser/ },
    'mandala-crafts-zippers': { en: /\bZippers/, ru: /Молнии/, de: /Reißverschlüsse/, fr: /fermetures éclair/i, it: /Cerniere/, es: /Cremalleras/ },
    'mebuzip-zipper-by-the-yard': { en: /by the yard/, ru: /рулонн/, de: /Meterware/, fr: /au mètre/, it: /a metraggio/, es: /por metro/ },
    'tailor-scissors': { en: /scissors/, ru: /ножницы/, de: /[Ss]chere/, fr: /ciseaux/, it: /forbici/, es: /tijeras/ },
    'rowenta-travel-iron': { en: /\biron\b/, ru: /утюг/, de: /Bügeleisen/, fr: /fer à repasser/, it: /ferro da stiro/, es: /plancha/ },
    'windman-presser-feet-set': { en: /presser feet/, ru: /набор лапок/, de: /Nähfuß-Set/, fr: /lot de pieds/, it: /set di piedini/, es: /juego de prensatelas/ },
    'sewline-air-erasable-pen': { en: /air-erasable pen/, ru: /маркер/, de: /Markierstift/, fr: /stylo effaçable/, it: /penna evanescente/, es: /marcador borrable/ },
    'beaditive-magnetic-pin-holder': { en: /\bpins\b/, ru: /булавк/, de: /Stecknadeln/, fr: /épingles/, it: /spilli/, es: /alfileres/ },
  };
  const needs = guideBySlug(SLUG).needs;
  assert.deepEqual([...needs].sort(), Object.keys(KEY).sort(), 'the products in needs and the products this test knows');
  for (const lang of LOCALES) {
    const { needsIntro } = guideText(guideBySlug(SLUG), lang);
    for (const id of needs) assert.match(needsIntro, KEY[id][lang], `${lang}: the needs line does not name ${id}`);
  }
});

test('guide texts: the needs line says the invisible zipper and its foot are bought separately — never linked, never claimed as the maker\'s', () => {
  const INVISIBLE = {
    en: /invisible zipper and an invisible zipper foot/, ru: /потайная молния и лапка для потайной молнии/, de: /nahtverdeckten Reißverschluss/,
    fr: /fermeture invisible et un pied/, it: /cerniera invisibile e il suo piedino|cerniera invisibile e il piedino/, es: /cremallera invisible y su prensatelas/,
  };
  for (const lang of LOCALES) assert.match(guideText(guideBySlug(SLUG), lang).needsIntro, INVISIBLE[lang], lang);
  // and no product of the catalog is such a zipper or foot (it would have to be linked)
  const names = products.filter((p) => guideBySlug(SLUG).needs.includes(p.id)).map((p) => p.name);
  assert.ok(!names.some((n) => /invisible/i.test(n)), 'an invisible zipper product in needs');
});

test('guide texts: the description is short enough to show (200 characters) and the title and h1 do not promise a number of ways', () => {
  for (const lang of LOCALES) {
    const g = guideText(guideBySlug(SLUG), lang);
    assert.ok(g.pageDescription.length <= 200, `${lang}: pageDescription is ${g.pageDescription.length} characters`);
    for (const f of ['title', 'heading', 'pageTitle']) assert.doesNotMatch(g[f], SIX[lang], `${lang} ${f}`);
  }
});

test('guide texts: no search traps in the blurb, description, teaser and needs line (spec 5.1)', () => {
  for (const lang of LOCALES) {
    for (const [where, s] of leadStrings(lang)) {
      if (lang === 'en') assert.doesNotMatch(s, /zipper sandwich/i, `en ${where}`);
      if (lang === 'ru') {
        assert.doesNotMatch(s, /замо?к|ушк|молни\p{L}* с планкой/iu, `ru ${where}`);
      }
      if (lang === 'de') assert.doesNotMatch(s, /(?<!naht)verdeckt/iu, `de ${where}`);
      if (lang === 'it') {
        assert.doesNotMatch(s, /centrale|nascost/iu, `it ${where}`);
        for (const x of sentences(s).filter((y) => /cerniera/i.test(y))) {
          assert.match(x, /cuci|pochette|borsa|cuscin|federa|gonna|abito|vestito|astuccio/i, `it ${where}: «${x}» — «cerniera» with no sewing word`);
        }
      }
      if (lang === 'es') assert.doesNotMatch(s, /cierre invisible/iu, `es ${where}`);
    }
  }
});

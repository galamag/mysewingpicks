// "Bag bottoms" (slug bag-bottom), section 4 `panel` — a separate bottom panel sewn into the tube of the walls,
// a public technique with no maker's project yet (Vault «Гайды — Дно сумки (спецификация)», 3 row 4, 5.1, 5.2).
// Figure src/lib/anatomy/bottom-panel.js (key bag-bottom-panel), its texts bottom-panel.<lang>.js, checked by
// bottom-panel.text.js.
// Numbers: NONE (spec 3, «Цифры разделов 3–4»; the sources give none for this method). What every source agrees
// on is written in words: mark the middles on the base and on the tube by folding and creasing; match the marks
// first, then clip in between; sew wrong side out; clip the walls' allowance at the corners up to, not through,
// the stitching; sew one side at a time, stopping one seam allowance from each corner, with a backstitch, and
// turn the corner. Stiffening (interfacing, an insert) goes on the base.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as panel from '../../src/lib/anatomy/bottom-panel.js';
import { PANEL_TEXT, panelText } from '../../src/lib/anatomy/bottom-panel.text.js';
import { foldedText } from '../../src/lib/anatomy/bottom-folded.text.js';
import { figure } from '../../src/lib/anatomy/figures.js';
import { products } from '../../src/data/products.js';
import { projects } from '../../src/data/projects.js';
import { guideBySlug, guidesForStep } from '../../src/data/guides.js';
import { SECTION_FIELDS, SECTION_OPTIONAL, guideText } from '../../src/i18n/content.js';
import { LOCALES } from '../../src/i18n/index.js';
import { strings, chipRects, pinCount, touchingChips } from './helpers.js';

const { STEPS, SPEC, DRAWING, DEFS, LABEL_KEYS, renderStep } = panel;
const SLUG = 'bag-bottom';
const KEY = 'bag-bottom-panel';
const LANGS = Object.keys(PANEL_TEXT);
const section = (lang) => guideText(guideBySlug(SLUG), lang).sections.find((s) => s.id === 'panel');
/** The section's texts in a language: [field, text] for every field it has. */
const sectionTexts = (lang) => [...SECTION_FIELDS, ...SECTION_OPTIONAL].filter((f) => section(lang)[f] !== undefined).map((f) => [f, section(lang)[f]]);
/** Every text of the section in a language: the figure's strings (its number `ui.fig` aside) and the section's. */
const allTexts = (lang) => [
  ...strings(panelText(lang)).filter(([where]) => where !== 'ui.fig'),
  ...sectionTexts(lang).map(([f, s]) => [`section.${f}`, s]),
];
/** A step's written texts (title, caption, details) as one string. */
const stepText = (L, k) => [L.steps[k].title, L.steps[k].text, ...(L.steps[k].details ?? [])].join(' \n ');

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
    assert.match(panelText(lang).ui.fig, /^\S+\.? 4$/u, `${lang}: ui.fig`);
  }
  assert.deepEqual(SPEC, {}, 'the model has no maker\'s numbers');
});

// The method in words, per language (spec 5.2): which step says what.
const WORDS = {
  en: {
    middles: /middle/, marks: /mark/, crease: /crease/, match: /match the marks/, between: /in between/, wrongOut: /wrong side out/,
    clip: /snip/, notThrough: /not through the stitching/, shortOf: /short of the seam line/, scissors: /scissors/, stopShort: /one seam allowance from the corner/, backstitch: /backstitch/,
    turn: /turn the corner/, interfacing: /interfacing/, insert: /insert/,
  },
  ru: {
    middles: /середин/, marks: /метк/, crease: /загладь|разгладь|заутюжь/, match: /совмест\p{L}* метк/u, between: /между/, wrongOut: /изнанкой наружу/,
    clip: /надсе[кч]/, notThrough: /не доходя до строчки/, shortOf: /не доходя до линии шва/, scissors: /ножниц/, stopShort: /на ширину припуска от угла/, backstitch: /закрепк/,
    turn: /поверн\p{L}* работу/u, interfacing: /флизелин/, insert: /вставк/,
  },
  de: {
    middles: /Mitte/, marks: /Markierung|markier/, crease: /Bruch|bügel|streich/, match: /Markierung auf Markierung|Markierungen aufeinander/, between: /dazwischen/, wrongOut: /links auf links|auf links|linke Seite außen/,
    clip: /einschneiden|einknipsen/, notThrough: /nicht in die Naht/, shortOf: /knapp vor (?:die|der) Nahtlinie/, scissors: /Schere/, stopShort: /eine Nahtzugabe vor der Ecke/, backstitch: /[Vv]erriegel/,
    turn: /um die Ecke/, interfacing: /Bügeleinlage/, insert: /Einlegeboden/,
  },
  fr: {
    middles: /milieu/, marks: /repère/, crease: /pli/, match: /repère sur repère|repères l'un sur l'autre/, between: /entre/, wrongOut: /sur l'envers/,
    clip: /crant/, notThrough: /sans couper la couture/, shortOf: /avant la ligne de couture|ligne de couture sans l'atteindre/, scissors: /ciseaux/, stopShort: /à une marge de couture du coin/, backstitch: /point d'arrêt/,
    turn: /tourne\p{L}* (?:dans|à) l'angle|pivote/u, interfacing: /entoilage/, insert: /fond rigide amovible|plaque de fond/,
  },
  it: {
    middles: /centro|metà/, marks: /segn/, crease: /piega/, match: /segno su segno/, between: /in mezzo|fra un segno e l'altro|tra un segno e l'altro/, wrongOut: /al rovescio/,
    clip: /taglietto|taglietti/, notThrough: /senza tagliare la cucitura/, shortOf: /prima della linea di cucitura|quasi alla linea di cucitura/, scissors: /forbici/, stopShort: /a un margine di cucitura dall'angolo/, backstitch: /fermatura/,
    turn: /gira\p{L}* l'angolo/u, interfacing: /teletta/, insert: /inserto/,
  },
  es: {
    middles: /centro|mitad/, marks: /marca/, crease: /doblez|pliegue/, match: /marca sobre marca/, between: /entre/, wrongOut: /del revés/,
    clip: /piquete/, notThrough: /sin cortar la costura/, shortOf: /antes de la línea de costura|casi la línea de costura/, scissors: /tijeras/, stopShort: /a un margen de costura de la esquina/, backstitch: /remat/,
    turn: /gira\p{L}* (?:en )?la esquina/u, interfacing: /entretela/, insert: /base rígida/,
  },
};

test('the method is in words, step by step (spec 5.2), in every language', () => {
  for (const lang of LOCALES) {
    const L = panelText(lang);
    const w = WORDS[lang];
    const s = (k) => stepText(L, k);
    // 2: mark the middles of the base and of the tube, by folding and creasing
    for (const r of [w.middles, w.marks, w.crease]) assert.match(s(2), r, `${lang}: step 2 lacks ${r}`);
    // 3: wrong side out, the marks matched first, then clipped in between
    for (const r of [w.wrongOut, w.match, w.between]) assert.match(s(3), r, `${lang}: step 3 lacks ${r}`);
    // 4: snip the walls' allowance at the corners with the scissors, to just short of the seam line, not through the stitching
    for (const r of [w.clip, w.scissors, w.shortOf, w.notThrough]) assert.match(s(4), r, `${lang}: step 4 lacks ${r}`);
    // 5: one side at a time, stop one seam allowance from the corner, backstitch, turn the corner
    for (const r of [w.stopShort, w.backstitch, w.turn]) assert.match(s(5), r, `${lang}: step 5 lacks ${r}`);
    // the stiffening goes on the base (interfacing or an insert) — said somewhere in the steps
    const all = L.steps.map((_, k) => s(k)).join(' \n ');
    for (const r of [w.interfacing, w.insert]) assert.match(all, r, `${lang}: the steps never say ${r}`);
    // the chips say it too
    assert.match(L.labels.notThrough, w.shortOf, `${lang}: the chip "stop short of the seam line"`);
    assert.match(L.labels.markOnMark, w.marks, `${lang}: the chip "mark on mark"`);
  }
});

// Beginner safety (review of 4e777ea): fastening and cutting never share a word, the tube is not turned again in
// step 3, and the round / oval advice says what differs (the allowance snipped all along the curve; spec 5.2).
const TURNED_AGAIN = { en: /Turn the tube/, ru: /Выверните трубу/, de: /Wende den Schlauch/, fr: /Retournez le tube/, it: /Rivolta il tubo/, es: /Pon el tubo del revés/ };
const CURVE = { en: /all along the curve/, ru: /по всей дуге/, de: /ganzen Rundung/, fr: /tout le long de la courbe/, it: /lungo tutta la curva/, es: /a lo largo de toda la curva/ };

test('beginner safety: "clip" is never the cutting word in English; step 3 keeps the tube as it is; round bases are snipped along the curve', () => {
  for (const [where, s] of allTexts('en')) assert.doesNotMatch(s, /clip/i, `en ${where}: "clip" (fastening or cutting?) - say "sewing clips" or "snip"`);
  for (const lang of LOCALES) {
    assert.doesNotMatch(stepText(panelText(lang), 3), TURNED_AGAIN[lang], `${lang}: step 3 turns the tube again (it is already wrong side out)`);
    assert.match(section(lang).choose, CURVE[lang], `${lang}: choose - round and oval bases need the allowance snipped along the curve`);
  }
  assert.doesNotMatch(section('en').choose, /same way/, 'en: round bases are not sewn "the same way"');
});

test('step 4 ends showing where the cut stopped: the clip lines stay, short of the seam corner, and the V keeps its uncut point', () => {
  const end = STEPS[4].scene(1);
  const shown = end.over.filter((o) => o.type === 'line' && o.clip && (o.o ?? 1) > 0.01);
  assert.ok(shown.length >= 3, 'at the end of step 4 the clip lines are gone');
  for (const c of shown) {
    const e = c.pts[c.pts.length - 1];
    const gap = Math.min(...panel.CORNERS.map((q) => Math.hypot(q[0] - e[0], q[1] - e[1])));
    assert.ok(gap > 0.1 * DRAWING.allowance && gap < DRAWING.allowance, `a clip line ends ${gap} from its corner`);
  }
  const rest = end.pieces.filter((p) => p.id.startsWith('uncut-'));
  assert.equal(rest.length, 3, 'the uncut point of each opened corner');
  // the chip "stop short of the seam line" comes in while the cut is still being shown in red
  const chipOn = (t) => STEPS[4].scene(t).over.find((o) => o.label === 'notThrough').o > 0.5;
  const hotOn = (t) => STEPS[4].scene(t).over.some((o) => o.clip && o.kind === 'hot' && (o.o ?? 1) > 0.5);
  assert.ok([0.5, 0.55, 0.6].some((t) => chipOn(t) && hotOn(t)), 'the chip and the red cut are never on screen together');
  for (const k of [5, 6]) assert.ok(STEPS[k].scene(0).pieces.some((p) => p.id.startsWith('uncut-')), `step ${k}: the clipped corners lost their uncut point`);
});

test('the drawing keeps the method\'s geometry: the tube fits the base round, side seams and creases on the middles', () => {
  const { long, short, allowance, tube } = DRAWING;
  assert.equal(tube, long + short, 'each of the tube\'s two pieces spans half the base\'s seam line round');
  assert.ok(allowance > 0 && allowance < short / 3, 'a seam allowance, small beside the base');
  // step 3 at its end: the tube stands on the base's seam line, wrong side out
  const pieces = STEPS[3].scene(1).pieces;
  const byId = Object.fromEntries(pieces.map((p) => [p.id, p]));
  const width = (p) => Math.max(...p.pts.map(([u]) => u)) - Math.min(...p.pts.map(([u]) => u));
  assert.ok(Math.abs(width(byId['tube-front']) - long) < 1e-9 && Math.abs(width(byId['tube-back']) - long) < 1e-9, 'front and back along the long sides');
  assert.ok(Math.abs(width(byId['tube-left']) - short) < 1e-9 && Math.abs(width(byId['tube-right']) - short) < 1e-9, 'the ends along the short sides');
  for (const id of ['tube-front', 'tube-back', 'tube-left', 'tube-right']) assert.ok(Math.abs(byId[id].O[2]) < 1e-9, `${id}: not landed on the base`);
  // the tube's side seams sit in the middle of its ends (shell), so they land on the middles of the base's short sides
  for (const id of ['tube-left', 'tube-right']) {
    assert.ok(byId[id].lines.some((l) => l.kind === 'seam' && Math.abs(l.pts[0][0] - short / 2) < 1e-9), `${id}: the side seam is not in the middle`);
  }
  // the base: a mark at the middle of each of its four sides
  const base = byId.base;
  const marks = base.lines.filter((l) => l.kind === 'mark');
  assert.equal(marks.length, 4, 'the base has a mark at each middle');
  const W = long + 2 * allowance, D = short + 2 * allowance;
  const mids = marks.map((l) => [(l.pts[0][0] + l.pts[1][0]) / 2, (l.pts[0][1] + l.pts[1][1]) / 2]);
  assert.equal(mids.filter(([u]) => Math.abs(u - W / 2) < 1e-9).length, 2, 'marks at the middles of the long sides');
  assert.equal(mids.filter(([, v]) => Math.abs(v - D / 2) < 1e-9).length, 2, 'marks at the middles of the short sides');
  // the tube's creases: the middles of front and back
  for (const id of ['tube-front', 'tube-back']) {
    assert.ok(byId[id].lines.some((l) => l.kind === 'fold' && Math.abs(l.pts[0][0] - long / 2) < 1e-9), `${id}: no crease at its middle`);
  }
});

test('the corners: puckered before the clip, clipped up to the stitching (never through it), then open', () => {
  const puckers = (t) => STEPS[4].scene(t).pieces.filter((p) => p.id.startsWith('pucker-'));
  assert.ok(puckers(0).length >= 3, 'step 4 starts with the corners pulled (not clipped yet)');
  assert.equal(puckers(1).length, 0, 'step 4 ends with every visible corner clipped');
  // the clip lines (hot) run toward the seam corner and stop short of it
  const clips = STEPS[4].scene(1).over.filter((o) => o.type === 'line' && o.clip);
  assert.ok(clips.length >= 3, 'no clip lines in step 4');
  for (const c of clips) {
    const end = c.pts[c.pts.length - 1];
    const corner = panel.CORNERS.find((q) => Math.hypot(q[0] - end[0], q[1] - end[1]) < DRAWING.allowance);
    assert.ok(corner, 'a clip that does not head for a corner');
    const gap = Math.hypot(corner[0] - end[0], corner[1] - end[1]);
    assert.ok(gap > 0.1 * DRAWING.allowance, `a clip runs into the stitching (stops ${gap} from the corner)`);
  }
  // before step 3 there is nothing to clip; in step 3 the corners are still whole
  assert.ok(STEPS[3].scene(1).pieces.some((p) => p.id.startsWith('pucker-')), 'step 3: the corners are pulled until clipped');
});

test('sewing: the stitching runs round the base one side at a time, the strips are sewn at the end of step 5', () => {
  assert.ok(STEPS[5].sew && STEPS[5].sew.length >= 1, 'step 5 sews with the machine');
  const strips = STEPS[5].scene(1).pieces.filter((p) => p.id.startsWith('flange-'));
  assert.equal(strips.length, 4, 'four strips of the walls\' allowance, one per side');
  for (const p of strips) assert.ok(p.lines.some((l) => l.kind === 'stitch'), `${p.id}: not sewn`);
  for (const p of STEPS[5].scene(0).pieces.filter((x) => x.id.startsWith('flange-'))) assert.ok(!p.lines.some((l) => l.kind === 'stitch'), `${p.id}: sewn before step 5`);
});

test('seven steps: the finished bottom, then six moves', () => {
  assert.equal(STEPS.length, 7);
  STEPS.slice(1).forEach((s, i) => assert.equal(typeof s.scene, 'function', `step ${i + 1} has no scene`));
  for (const lang of LANGS) assert.equal(panelText(lang).steps.length, 7, lang);
});

test('uses are catalog products, and the guide lists them all', () => {
  const ids = new Set(products.map((p) => p.id));
  STEPS.forEach((s, k) => (s.uses ?? []).forEach((id) => assert.ok(ids.has(id), `step ${k}: unknown product "${id}"`)));
  assert.deepEqual(STEPS.map((s) => s.uses ?? []), [
    [],
    ['soraco-sewing-clips', 'janome-hd2200'],
    ['rowenta-travel-iron', 'sewline-air-erasable-pen'],
    ['soraco-sewing-clips'],
    ['tailor-scissors'],
    ['janome-hd2200'],
    [],
  ]);
  const needs = guideBySlug(SLUG).needs;
  for (const s of STEPS) for (const id of s.uses ?? []) assert.ok(needs.includes(id), `"${id}" is not in the guide's needs`);
});

test('figure is registered (build and browser)', () => {
  const f = figure(KEY);
  assert.equal(f.model.STEPS, STEPS);
  assert.equal(f.text('it'), panelText('it'));
  const src = readFileSync(new URL('../../src/lib/anatomy/models.js', import.meta.url), 'utf8');
  assert.match(src, /'bag-bottom-panel':\s*\{\s*model:\s*\(\)\s*=>\s*import\('\.\/bottom-panel\.js'\),\s*texts:\s*import\.meta\.glob\('\.\/bottom-panel\.\?\?\.js'\)\s*\}/);
});

test('every step renders in every language, its ids carry the figure prefix', () => {
  for (const lang of LANGS) {
    const L = panelText(lang);
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
    const L = panelText(lang);
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
  for (const lang of LANGS) assert.deepEqual(Object.keys(panelText(lang).labels).sort(), [...LABEL_KEYS].sort(), lang);
});

test('the first frame (the HTML, no JS) is the finished bottom: the separate base on top, in its own fabric, seamed all round, the pins', () => {
  const rest = panel.anatomy(0).pieces;
  const base = rest.find((p) => p.id === 'up-base');
  assert.ok(base && base.out[2] > 0.99 && (base.opacity ?? 1) >= 0.999, 'the base does not face up in the rest state');
  const walls = rest.filter((p) => /^up-(?:front|back|left|right)$/.test(p.id));
  assert.equal(walls.length, 4, 'the walls of the upside-down bag');
  for (const w of walls) assert.notEqual(w.fill, base.fill, `${w.id}: the base is not in a fabric of its own`);
  // the seam round the base: a line along each of its four edges
  const seams = base.lines.filter((l) => l.kind === 'seam');
  const [u0, u1] = [Math.min(...base.pts.map(([u]) => u)), Math.max(...base.pts.map(([u]) => u))];
  const [v0, v1] = [Math.min(...base.pts.map(([, v]) => v)), Math.max(...base.pts.map(([, v]) => v))];
  const near = (a, b) => Math.abs(a - b) < 0.6;
  const along = (pick, at) => seams.some((l) => l.pts.every((p) => near(pick(p), at)));
  assert.ok(along(([, v]) => v, v0) && along(([, v]) => v, v1) && along(([u]) => u, u0) && along(([u]) => u, u1), 'the base is not seamed all round');
  assert.ok(!rest.some((p) => p.id.startsWith('bag-')), 'the standing bag is drawn in the rest state');
  for (const lang of LANGS) {
    const L = panelText(lang);
    assert.equal(pinCount(renderStep(0, 0, L).body), L.legend.length, `${lang}: pins in the first frame`);
    assert.equal(pinCount(renderStep(0, 1, L).body), 0, `${lang}: pins once stood up`);
  }
  const up = panel.anatomy(1).pieces;
  assert.ok(up.some((p) => p.id === 'bag-front') && !up.some((p) => p.id.startsWith('up-')), 'tapped: the bag stands up');
  for (let i = 0; i <= 40; i++) {
    for (const p of panel.anatomy(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `e=${i / 40}: ${p.id} fully faded`);
  }
  // the last step turns out into the same view
  const end = STEPS[6].scene(1).pieces;
  assert.ok(end.some((p) => p.id === 'fin-base' && p.out[2] > 0.99), 'step 6 does not end on the finished bottom, base up');
});

test('a fully faded copy is never drawn (every step)', () => {
  for (let k = 1; k < STEPS.length; k++) {
    for (let i = 0; i <= 40; i++) {
      for (const p of STEPS[k].scene(i / 40).pieces) assert.ok((p.opacity ?? 1) > 0.01, `step ${k} t=${i / 40}: ${p.id}`);
    }
  }
});

test('language rules: French punctuation, straight apostrophe', () => {
  for (const lang of ['ru', 'de', 'fr', 'it', 'es']) {
    for (const [where, s] of allTexts(lang)) {
      if (lang === 'fr') assert.doesNotMatch(s, /(?:^|[^\xa0])[:;!?]/, `fr ${where}: no no-break space before : ; ! ?`);
      assert.ok(!s.includes(String.fromCharCode(0x2019)), `${lang} ${where}: typographic apostrophe — the site uses '`);
    }
  }
});

// Spec 5.1, the section names (row panel); the figure's title is the section's name, its number Fig. 4.
const NAME = { en: 'Separate bottom panel', ru: 'Отдельная деталь дна', de: 'Separater Boden', fr: 'Fond rapporté', it: 'Fondo separato', es: 'Base aparte' };
const FIG4 = { en: 'Fig. 4', ru: 'Рис. 4', de: 'Abb. 4', fr: 'Fig. 4', it: 'Fig. 4', es: 'Fig. 4' };

test('the section name is the approved one (spec 5.1); the figure is Fig. 4 under that title', () => {
  for (const lang of LOCALES) {
    assert.equal(section(lang).title, NAME[lang], lang);
    assert.equal(panelText(lang).ui.title, NAME[lang], `${lang}: ui.title`);
    assert.equal(panelText(lang).ui.fig, FIG4[lang], `${lang}: ui.fig`);
    assert.equal(foldedText(lang).ui.fig.replace('1', '4'), FIG4[lang], `${lang}: numbered like Fig. 1`);
  }
});

test('the section: fourth, after folded, cut-out and boxed; no project yet, so no "Where it\'s used" and no note', () => {
  const g = guideBySlug(SLUG);
  assert.deepEqual(g.sections.map((s) => [s.id, s.figure]), [
    ['folded', 'bag-bottom-folded'], ['cut-out', 'bag-bottom-cut-out'], ['boxed', 'bag-bottom-boxed'], ['panel', KEY],
  ]);
  const s = g.sections[3];
  assert.deepEqual(s.usedIn, []);
  for (const lang of LOCALES) {
    assert.equal(section(lang).note, undefined, `${lang}: a note`);
    for (const f of SECTION_FIELDS) assert.ok(section(lang)[f].trim(), `${lang}: ${f}`);
    if (lang !== 'en') assert.notEqual(section(lang).choose, section('en').choose, `${lang}: choose not translated`);
  }
  // no project step links here
  for (const p of projects) {
    const n = figure(p.slug).model.STEPS.length;
    for (let k = 0; k < n; k++) assert.ok(!guidesForStep(p.slug, k).some((x) => x.section.id === 'panel'), `${p.slug} step ${k} links to #panel`);
  }
});

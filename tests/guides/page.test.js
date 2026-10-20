// The built guide pages (dist/**/guides/*.html): an id may appear once per page (a guide with several
// sections holds several figures, each with its own ids). Build first: `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../../dist/', import.meta.url));
const guideDirs = ['', 'ru', 'de', 'fr', 'it', 'es'].map((l) => join(dist, l, 'guides'));

const pages = () => {
  assert.ok(existsSync(dist), 'dist/ is missing: run `npm run build` before `npm test`');
  return guideDirs.flatMap((d) => readdirSync(d).filter((f) => f.endsWith('.html')).map((f) => join(d, f)));
};

// Duplicated ids in the page's markup (attributes id="…" in tags; <script> and <style> bodies are skipped).
export const duplicateIds = (html) => {
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const seen = new Map();
  for (const m of body.matchAll(/<[a-zA-Z][^>]*?\sid="([^"]*)"/g)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
  return [...seen].filter(([, n]) => n > 1).map(([id]) => id);
};

test('duplicateIds finds a repeated id and ignores scripts', () => {
  assert.deepEqual(duplicateIds('<p id="a"></p><svg><g id="b"/><g id="a"/></svg><script>x="<i id=\\"a\\">"</script>'), ['a']);
  assert.deepEqual(duplicateIds('<p id="a"></p><p id="b"></p>'), []);
});

test('every built guide page has at least one page and no duplicate ids', () => {
  const list = pages();
  assert.ok(list.length >= 6, `expected a guide page per language, found ${list.length}`);
  for (const f of list) assert.deepEqual(duplicateIds(readFileSync(f, 'utf8')), [], f);
});

// "Bag bottoms", section `cut-out` on the built pages: its own figure, "Where it's used" with the cosmetic bag
// (step 10) and the basket (steps 1, 3) in the page's language; the projects' steps link back to #cut-out.
const LANG_DIRS = { en: '', ru: 'ru', de: 'de', fr: 'fr', it: 'it', es: 'es' };
const decode = (s) => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
/** The <section id="…"> of a page, up to the next section or the end of <main>. */
const sectionHtml = (html, id) => {
  const start = html.search(new RegExp(String.raw`<section[^>]*\sid="${id}"`));
  if (start < 0) return '';
  const rest = html.slice(start + 1);
  const end = rest.search(/<section class="section|<\/main>/); // the page's next section (a figure holds <section>s of its own)
  return html.slice(start, start + 1 + (end < 0 ? rest.length : end));
};

test('bag-bottom #cut-out: its own figure, "Where it\'s used" step 10 and steps 1, 3 in the page language', async () => {
  const { t } = await import('../../src/i18n/index.js');
  const { projectText } = await import('../../src/i18n/content.js');
  const { projectBySlug } = await import('../../src/data/projects.js');
  for (const [lang, dir] of Object.entries(LANG_DIRS)) {
    const html = readFileSync(join(dist, dir, 'guides', 'bag-bottom.html'), 'utf8');
    const sec = sectionHtml(html, 'cut-out');
    assert.ok(sec, `${lang}: no <section id="cut-out">`);
    assert.match(sec, /data-anatomy="bag-bottom-cut-out"/, `${lang}: the section's figure`);
    assert.doesNotMatch(sec, /data-anatomy="bag-bottom-folded"/, `${lang}: the folded figure inside cut-out`);
    const pre = dir ? `/${dir}` : '';
    const words = t(lang).pages.guide.usedInSteps;
    for (const [slug, steps] of [['cosmetic-bag', [10]], ['fabric-basket', [1, 3]]]) {
      const text = words(projectText(projectBySlug(slug), lang).title, steps);
      const m = sec.match(new RegExp(String.raw`<a[^>]*href="${pre}/projects/${slug}\.html"[^>]*>([^<]*)</a>`));
      assert.ok(m, `${lang}: no "Where it's used" link to ${slug}`);
      assert.equal(decode(m[1]), text, `${lang}: ${slug}`);
    }
    assert.ok(html.indexOf('id="folded"') < html.indexOf('id="cut-out"'), `${lang}: folded comes before cut-out`);
    // the section's note (the basket in one sentence, with its numbers): under the "Where it's used" links
    const { guideText } = await import('../../src/i18n/content.js');
    const { guideBySlug } = await import('../../src/data/guides.js');
    const note = guideText(guideBySlug('bag-bottom'), lang).sections.find((x) => x.id === 'cut-out').note;
    const p = sec.match(/<p class="guide-used__note"[^>]*>([^<]*)<\/p>/);
    assert.ok(p, `${lang}: the note is not rendered`);
    assert.equal(decode(p[1]), note, `${lang}: note text`);
    assert.ok(sec.indexOf('guide-used__list') < sec.indexOf('guide-used__note'), `${lang}: the note comes after the links`);
    assert.doesNotMatch(sectionHtml(html, 'folded'), /guide-used__note/, `${lang}: folded has no note`);
  }
});

test('the cosmetic bag and the basket link their steps to #cut-out of the same language', () => {
  for (const [lang, dir] of Object.entries(LANG_DIRS)) {
    const pre = dir ? `/${dir}` : '';
    for (const slug of ['cosmetic-bag', 'fabric-basket']) {
      const html = readFileSync(join(dist, dir, 'projects', `${slug}.html`), 'utf8');
      const hrefs = [...html.matchAll(/href="([^"]*bag-bottom\.html#cut-out)"/g)].map((m) => m[1]);
      // each step's link shows twice: under the step's caption and in "All steps" (cosmetic: step 10; basket: 1 and 3)
      assert.equal(hrefs.length, slug === 'cosmetic-bag' ? 2 : 4, `${lang} ${slug}: links to #cut-out`);
      for (const h of hrefs) assert.equal(h, `${pre}/guides/bag-bottom.html#cut-out`, `${lang} ${slug}: a link to another language`);
    }
  }
});

// "Bag bottoms", section `boxed` on the built pages: its own figure, after cut-out; no project yet, so no
// "Where it's used" block and no note.
test('bag-bottom #boxed: its own figure, third, no "Where it\'s used"', () => {
  for (const [lang, dir] of Object.entries(LANG_DIRS)) {
    const html = readFileSync(join(dist, dir, 'guides', 'bag-bottom.html'), 'utf8');
    const sec = sectionHtml(html, 'boxed');
    assert.ok(sec, `${lang}: no <section id="boxed">`);
    assert.match(sec, /data-anatomy="bag-bottom-boxed"/, `${lang}: the section's figure`);
    assert.doesNotMatch(sec, /data-anatomy="bag-bottom-(?:folded|cut-out)"/, `${lang}: another figure inside boxed`);
    assert.doesNotMatch(sec, /guide-used/, `${lang}: "Where it's used" without a project`);
    assert.ok(html.indexOf('id="cut-out"') < html.indexOf('id="boxed"'), `${lang}: cut-out comes before boxed`);
    assert.match(html, /href="#boxed"/, `${lang}: the contents link to #boxed`);
  }
});

// One figure per section of the guide, each in its own <section>, in the order of guides.js (none sharing an id:
// the duplicate test above).
test('bag-bottom: one figure per section, in order, each inside its own section', async () => {
  const { guideBySlug } = await import('../../src/data/guides.js');
  const sections = guideBySlug('bag-bottom').sections;
  for (const [lang, dir] of Object.entries(LANG_DIRS)) {
    const html = readFileSync(join(dist, dir, 'guides', 'bag-bottom.html'), 'utf8');
    assert.equal((html.match(/data-anatomy="/g) ?? []).length, sections.length, `${lang}: a figure per section`);
    const at = sections.map((s) => html.search(new RegExp(String.raw`<section[^>]*\sid="${s.id}"`)));
    assert.ok(at.every((i) => i > 0), `${lang}: a section is missing`);
    assert.deepEqual([...at].sort((a, b) => a - b), at, `${lang}: the sections are out of order`);
    for (const s of sections) {
      const figs = [...sectionHtml(html, s.id).matchAll(/data-anatomy="([^"]+)"/g)].map((m) => m[1]);
      assert.deepEqual(figs, [s.figure], `${lang} #${s.id}: its own figure only`);
      assert.match(html, new RegExp(`href="#${s.id}"`), `${lang}: the contents link to #${s.id}`);
    }
  }
});

// "Bag bottoms", section `panel`: a separate base sewn into the tube, no project yet — no "Where it's used", no note.
test('bag-bottom #panel: its own figure, last, no "Where it\'s used"', () => {
  for (const [lang, dir] of Object.entries(LANG_DIRS)) {
    const html = readFileSync(join(dist, dir, 'guides', 'bag-bottom.html'), 'utf8');
    const sec = sectionHtml(html, 'panel');
    assert.ok(sec, `${lang}: no <section id="panel">`);
    assert.match(sec, /data-anatomy="bag-bottom-panel"/, `${lang}: the section's figure`);
    assert.doesNotMatch(sec, /guide-used/, `${lang}: "Where it's used" without a project`);
    assert.ok(html.indexOf('id="boxed"') < html.indexOf('id="panel"'), `${lang}: boxed comes before panel`);
  }
});

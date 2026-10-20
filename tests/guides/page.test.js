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

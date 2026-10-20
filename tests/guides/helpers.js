// Shared checks of the guide figures' tests (bag-bottom*.test.js) — not a test itself (no `.test.js`).

/** Every string of a language's figure texts (functions skipped), with where it sits. */
export function strings(L) {
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

/** The cm numbers of a text: [[match, number with a decimal point]] ("0,5 см" → "0.5"). */
export const cmNumbers = (s) => [...s.matchAll(/(\d+(?:[.,]\d+)?)[\s\xa0]*(?:cm|см)/g)].map((m) => [m[0], m[1].replace(',', '.')]);

/** A chip as iso.js draws it: its group's translate, then its rect. */
export const CHIP = /<g class="chip[^"]*" transform="translate\(([-\d.e]+) ([-\d.e]+)\)"><rect x="([-\d.e]+)" y="([-\d.e]+)" width="([-\d.e]+)" height="([-\d.e]+)"/g;

/** The chips of a rendered body, as boxes { x0, y0, x1, y1 } in viewBox units. */
export const chipRects = (body) => [...body.matchAll(CHIP)].map((m) => {
  const [tx, ty, rx, ry, w, h] = m.slice(1).map(Number);
  return { x0: tx + rx, y0: ty + ry, x1: tx + rx + w, y1: ty + ry + h };
});

/** How many numbered pins a rendered body shows. */
export const pinCount = (body) => (body.match(/<g class="pins"[\s\S]*$/)?.[0].match(/<circle/g) ?? []).length;

/** Chips that touch, with a gap of 1% of the viewBox width between any two: [[a, b], …] (indices). */
export function touchingChips(body, viewBox) {
  const g = viewBox[2] / 200; // half the gap, on each chip
  const r = chipRects(body).map((c) => ({ x0: c.x0 - g, y0: c.y0 - g, x1: c.x1 + g, y1: c.y1 + g }));
  const hits = [];
  for (let a = 0; a < r.length; a++) for (let b = a + 1; b < r.length; b++) {
    if (r[a].x0 < r[b].x1 && r[b].x0 < r[a].x1 && r[a].y0 < r[b].y1 && r[b].y0 < r[a].y1) hits.push([a, b]);
  }
  return hits;
}

/*
  Helpers shared by the room tests (setup.test.js, tools.test.js, the next rooms).
  NOT a test file (no .test.js in its name): the test glob of package.json must not pick it up.
*/
import assert from 'node:assert/strict';
import { project } from '../../src/lib/anatomy/iso.js';
import { renderRoom, minHitFor } from '../../src/lib/rooms/render.js';
import { groupTitle, projectText } from '../../src/i18n/content.js';
import { pageUrl, t } from '../../src/i18n/index.js';
import { projects } from '../../src/data/projects.js';

/**
  The links of a room as the page makes them (Room.astro `resolve`, kept in step with it): a section
  → #<id> named by its title in `lang` (the classroom's sections are guide groups: their titles are on the
  guides page), a project → its page, named by its title. `names` (optional) names made-up projects of the
  tests: slug → name.
*/
export const siteResolve = (category, lang, names = {}) => (target) => {
  if (target.section) {
    const label = category === 'guides' ? t(lang).pages.guides.groups[target.section].title : groupTitle(category, target.section, lang);
    return { href: `#${target.section}`, label, kind: 'section' };
  }
  if (target.project) {
    const real = projects.find((p) => p.slug === target.project);
    if (real) return { href: pageUrl(`project/${real.slug}`, lang), label: projectText(real, lang).title, kind: 'page' };
    const label = names[target.project];
    return label ? { href: `/projects/${target.project}.html`, label, kind: 'page' } : null;
  }
  return null;
};

// The thumb rule, pinned here on purpose (not read from render.js): a tap area of a real room
// must be at least a 44 css px thumb on a 320 px phone, where the room is as wide as the screen.
export const THUMB_PX = 44;
export const PHONE_PX = 320;

const PAD = /<rect class="room__pad" x="([^"]*)" y="([^"]*)" width="([^"]*)" height="([^"]*)"[^>]*fill="transparent"\/>/g;

/**
  The printed tap areas of an svg, in document order (later = on top): { part, href, poly, pads }.
    pads  the label pills inside the link ({ x, y, w, h }; none without a label)
*/
export function areasOf(svg) {
  return [...svg.matchAll(/<a class="room__hot"([^>]*)><polygon class="room__hit" points="([^"]*)" fill="transparent"\/>(.*?)<\/a>/g)]
    .map(([, attrs, points, rest]) => {
      const pads = [...rest.matchAll(PAD)].map(([, x, y, w, h]) => ({ x: +x, y: +y, w: +w, h: +h }));
      assert.equal(rest.replace(PAD, ''), '', 'nothing else in a link than its polygon and its pill');
      return {
        part: /data-part="([^"]*)"/.exec(attrs)[1],
        href: /href="([^"]*)"/.exec(attrs)[1],
        poly: points.split(' ').map((q) => q.split(',').map(Number)),
        pads,
      };
    });
}

/** Is the point in the rect { x, y, w, h }? */
export const inRect = ({ x, y, w, h }, [px, py]) => px >= x && px <= x + w && py >= y && py <= y + h;

/** Does a tap at `pt` land in this area: its polygon or its pill? */
export const reaches = (area, pt) => inside(area.poly, pt) || area.pads.some((r) => inRect(r, pt));

/** The part a tap at `pt` opens: the LAST area that reaches it (later = on top), or null. */
export function ownerAt(areas, pt) {
  let owner = null;
  for (const a of areas) if (reaches(a, pt)) owner = a.part;
  return owner;
}

/**
  The printed labels of an svg, in document order: { part, lines, text, pill: { x, y, w, h }, dot, end }.
    text  the lines joined by a space (the name it shows)
*/
export function labelsOf(svg) {
  return [...svg.matchAll(/<g class="room__label" data-part="([^"]*)" aria-hidden="true"[^>]*>(.*?)<\/g>/g)].map(([, part, inner]) => {
    const [, x0, y0, x1, y1] = /<path d="M([^ ]*) ([^L]*)L([^ ]*) ([^"]*)"/.exec(inner);
    const [, x, y, w, h] = /<rect x="([^"]*)" y="([^"]*)" width="([^"]*)" height="([^"]*)"/.exec(inner);
    const [, cx, cy] = /<circle cx="([^"]*)" cy="([^"]*)"/.exec(inner);
    const lines = [...inner.matchAll(/<tspan[^>]*>([^<]*)<\/tspan>/g)].map((m) => m[1]);
    return {
      part, lines, text: lines.join(' '),
      pill: { x: +x, y: +y, w: +w, h: +h },
      dot: [+cx, +cy], start: [+x0, +y0], end: [+x1, +y1],
    };
  });
}

/**
  A room as the narrowest phone gets it: drawn with minHitFor(model), as Room.astro does it.
    resolve  as for renderRoom
  → svg, the printed tap areas, hots (renderRoom's), the thumb in viewBox units (44 px on a
    320 px phone), minHit
  Fails loudly when the room has no tap areas or when `areas` is not exactly the tap areas
  renderRoom made (same count, same order): a coverage test must never pass on nothing.
*/
export function onPhone(model, resolve) {
  const minHit = minHitFor(model);
  const { svg, viewBox, hots } = renderRoom(model, { resolve, minHit });
  const areas = areasOf(svg);
  assert.ok(hots.length > 0, `${model.key}: no tap areas to check`);
  assert.deepEqual(areas.map((a) => [a.part, a.href]), hots.map((h) => [h.part, h.href]), `${model.key}: parsed tap areas != renderRoom's hots`);
  return { svg, areas, hots, thumb: (THUMB_PX * viewBox[2]) / PHONE_PX, minHit };
}

/** An svg without its tap areas, its labels and the <g class="room__part"> wrappers (what is inside them stays). */
export function unlink(svg) {
  const wrappers = []; // for every open <g>: is it a wrapper?
  return svg
    .replace(/<a class="room__hot".*?<\/a>/g, '')
    .replace(/<g class="room__label".*?<\/g>/g, '')
    .replace(/<g class="room__part"[^>]*>|<g\b[^>]*>|<\/g>/g, (tag) => {
      if (tag === '</g>') return wrappers.pop() ? '' : tag;
      const wrapper = tag.startsWith('<g class="room__part"');
      wrappers.push(wrapper);
      return wrapper ? '' : tag;
    });
}

/** Is the point inside the convex polygon (either winding)? */
export const inside = (poly, [x, y]) => {
  const side = poly.map((a, i) => {
    const b = poly[(i + 1) % poly.length];
    return Math.sign((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]));
  });
  return side.every((v) => v >= 0) || side.every((v) => v <= 0);
};

/** Share of the points of a world rectangle at(u, v), u, v in 0..1, that land in a tap area. */
export function linked(areas, at) {
  let n = 0, hit = 0;
  for (let i = 0; i <= 20; i++) for (let j = 0; j <= 20; j++) {
    n++;
    if (areas.some((a) => inside(a.poly, project(at(i / 20, j / 20))))) hit++;
  }
  return hit / n;
}

/** A model's window as a world rectangle at(u, v), u along the wall, v up: for `linked`. */
export const glassOf = ({ wall, from, to, z: [z0, z1] }) => (u, v) => {
  const along = from + (to - from) * u;
  const z = z0 + (z1 - z0) * v;
  return wall === 'left' ? [0, along, z] : [along, 0, z];
};

/**
  The side of the largest square (viewBox units) where a tap reaches area `i` on its object: inside
  its polygon and under nothing printed after it (later = on top: another polygon or another label's
  pill). Sampled every `step` units.
*/
export function ownSquare(areas, i, step = 0.25) {
  const xs = areas[i].poly.map((q) => q[0]);
  const ys = areas[i].poly.map((q) => q[1]);
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  const cols = Math.ceil((Math.max(...xs) - x0) / step);
  const rows = Math.ceil((Math.max(...ys) - y0) / step);
  let best = 0;
  let prev = new Array(cols + 1).fill(0);
  for (let r = 0; r <= rows; r++) {
    const row = new Array(cols + 1).fill(0);
    for (let c = 0; c <= cols; c++) {
      const pt = [x0 + c * step, y0 + r * step];
      const own = inside(areas[i].poly, pt) && !areas.slice(i + 1).some((a) => reaches(a, pt));
      if (!own) continue;
      row[c] = r && c ? Math.min(prev[c], row[c - 1], prev[c - 1]) + 1 : 1;
      best = Math.max(best, row[c]);
    }
    prev = row;
  }
  return (best - 1) * step;
}

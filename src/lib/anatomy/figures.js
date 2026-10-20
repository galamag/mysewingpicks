/*
  Build-time registry of the anatomy figures: slug → the model and its texts.
  Used by AnatomyFigure's frontmatter and the project pages (cutting diagram). NEVER import it
  from a browser script: each <item>.text.js pulls in every language. The browser has its own
  registry, models.js (the model + ONE language's texts, loaded on demand).
  A new figure: add it here AND in models.js.
*/
import * as tote from './tote.js';
import { toteText } from './tote.text.js';
import * as basket from './basket.js';
import { basketText } from './basket.text.js';
import * as lining from './lining.js';
import { liningText } from './lining.text.js';
import * as cosmetic from './cosmetic.js';
import { cosmeticText } from './cosmetic.text.js';

const FIGURES = {
  'tote-bag': { model: tote, text: toteText },
  'fabric-basket': { model: basket, text: basketText },
  'line-a-bag': { model: lining, text: liningText }, // the guide "Lining a bag" (/guides/line-a-bag)
  'cosmetic-bag': { model: cosmetic, text: cosmeticText },
};

/** slug → { model, text(lang) } */
export function figure(slug) {
  const f = FIGURES[slug];
  if (!f) throw new Error(`anatomy: no figure "${slug}" in figures.js`);
  return f;
}

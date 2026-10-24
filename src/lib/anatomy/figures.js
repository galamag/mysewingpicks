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
import * as pouch from './pouch.js';
import { pouchText } from './pouch.text.js';
import * as bottomFolded from './bottom-folded.js';
import { foldedText } from './bottom-folded.text.js';
import * as bottomCutout from './bottom-cutout.js';
import { cutoutText } from './bottom-cutout.text.js';
import * as bottomBoxed from './bottom-boxed.js';
import { boxedText } from './bottom-boxed.text.js';
import * as bottomPanel from './bottom-panel.js';
import { panelText } from './bottom-panel.text.js';
import * as zipperLined from './zipper-lined.js';
import { linedText } from './zipper-lined.text.js';
import * as zipperTabs from './zipper-tabs.js';
import { tabsText } from './zipper-tabs.text.js';
import * as zipperRecessed from './zipper-recessed.js';
import { recessedText } from './zipper-recessed.text.js';
import * as zipperCentered from './zipper-centered.js';
import { centeredText } from './zipper-centered.text.js';
import * as zipperLapped from './zipper-lapped.js';
import { lappedText } from './zipper-lapped.text.js';
import * as zipperInvisible from './zipper-invisible.js';
import { invisibleText } from './zipper-invisible.text.js';

const FIGURES = {
  'tote-bag': { model: tote, text: toteText },
  'fabric-basket': { model: basket, text: basketText },
  'line-a-bag': { model: lining, text: liningText }, // the guide "Lining a bag" (/guides/line-a-bag)
  'cosmetic-bag': { model: cosmetic, text: cosmeticText },
  'phone-pouch': { model: pouch, text: pouchText },
  'bag-bottom-folded': { model: bottomFolded, text: foldedText }, // the guide "Bag bottoms", section #folded
  'bag-bottom-cut-out': { model: bottomCutout, text: cutoutText }, // the guide "Bag bottoms", section #cut-out
  'bag-bottom-boxed': { model: bottomBoxed, text: boxedText }, // the guide "Bag bottoms", section #boxed
  'bag-bottom-panel': { model: bottomPanel, text: panelText }, // the guide "Bag bottoms", section #panel
  'zipper-lined': { model: zipperLined, text: linedText }, // the guide "How to sew a zipper", section #lined
  'zipper-tabs': { model: zipperTabs, text: tabsText }, // the guide "How to sew a zipper", section #tabs
  'zipper-recessed': { model: zipperRecessed, text: recessedText }, // the guide "How to sew a zipper", section #recessed
  'zipper-centered': { model: zipperCentered, text: centeredText }, // the guide "How to sew a zipper", section #centered
  'zipper-lapped': { model: zipperLapped, text: lappedText }, // the guide "How to sew a zipper", section #lapped
  'zipper-invisible': { model: zipperInvisible, text: invisibleText }, // the guide "How to sew a zipper", section #invisible
};

/** slug → { model, text(lang) } */
export function figure(slug) {
  const f = FIGURES[slug];
  if (!f) throw new Error(`anatomy: no figure "${slug}" in figures.js`);
  return f;
}

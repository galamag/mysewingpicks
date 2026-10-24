/* Zipper with end tabs (guide figure, section `tabs` of "How to sew a zipper") texts by language. Every
   language has the same shape as English, and English labels cover exactly the chip keys the drawing uses —
   or the build fails (texts.js). Used at build only (AnatomyFigure frontmatter via figures.js); the browser
   script loads just zipper-tabs.<lang>.js. */
import { STEPS, LABEL_KEYS } from './zipper-tabs.js';
import { figureTexts } from './texts.js';
import en from './zipper-tabs.en.js';
import ru from './zipper-tabs.ru.js';
import de from './zipper-tabs.de.js';
import fr from './zipper-tabs.fr.js';
import it from './zipper-tabs.it.js';
import es from './zipper-tabs.es.js';

export const TABS_TEXT = { en, ru, de, fr, it, es };

// Every zipper-tabs.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./zipper-tabs.??.js')); } catch { /* not under Vite */ }

export const tabsText = figureTexts('zipper-tabs', TABS_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

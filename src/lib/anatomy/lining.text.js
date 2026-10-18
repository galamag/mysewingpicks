/* Lining a bag (guide figure) texts by language. Every language has the same shape as English,
   and English labels cover exactly the chip keys the drawing uses — or the build fails (texts.js).
   Used at build only (AnatomyFigure frontmatter via figures.js); the browser script loads just
   lining.<lang>.js. */
import { STEPS, LABEL_KEYS } from './lining.js';
import { figureTexts } from './texts.js';
import en from './lining.en.js';
import ru from './lining.ru.js';
import de from './lining.de.js';
import fr from './lining.fr.js';
import it from './lining.it.js';
import es from './lining.es.js';

export const LINING_TEXT = { en, ru, de, fr, it, es };

// Every lining.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./lining.??.js')); } catch { /* not under Vite */ }

export const liningText = figureTexts('lining', LINING_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

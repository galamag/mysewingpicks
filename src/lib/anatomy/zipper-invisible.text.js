/* Invisible zipper (guide figure, section `invisible` of "How to sew a zipper") texts by language. Every
   language has the same shape as English, and English labels cover exactly the chip keys the drawing uses —
   or the build fails (texts.js). Used at build only (AnatomyFigure frontmatter via figures.js); the browser
   script loads just zipper-invisible.<lang>.js. */
import { STEPS, LABEL_KEYS } from './zipper-invisible.js';
import { figureTexts } from './texts.js';
import en from './zipper-invisible.en.js';
import ru from './zipper-invisible.ru.js';
import de from './zipper-invisible.de.js';
import fr from './zipper-invisible.fr.js';
import it from './zipper-invisible.it.js';
import es from './zipper-invisible.es.js';

export const INVISIBLE_TEXT = { en, ru, de, fr, it, es };

// Every zipper-invisible.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./zipper-invisible.??.js')); } catch { /* not under Vite */ }

export const invisibleText = figureTexts('zipper-invisible', INVISIBLE_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

/* Recessed zipper at the top of a bag (guide figure, section `recessed` of "How to sew a zipper") texts by language. Every
   language has the same shape as English, and English labels cover exactly the chip keys the drawing uses —
   or the build fails (texts.js). Used at build only (AnatomyFigure frontmatter via figures.js); the browser
   script loads just zipper-recessed.<lang>.js. */
import { STEPS, LABEL_KEYS } from './zipper-recessed.js';
import { figureTexts } from './texts.js';
import en from './zipper-recessed.en.js';
import ru from './zipper-recessed.ru.js';
import de from './zipper-recessed.de.js';
import fr from './zipper-recessed.fr.js';
import it from './zipper-recessed.it.js';
import es from './zipper-recessed.es.js';

export const RECESSED_TEXT = { en, ru, de, fr, it, es };

// Every zipper-recessed.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./zipper-recessed.??.js')); } catch { /* not under Vite */ }

export const recessedText = figureTexts('zipper-recessed', RECESSED_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

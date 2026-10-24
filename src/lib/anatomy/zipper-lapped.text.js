/* Lapped zipper (guide figure, section `lapped` of "How to sew a zipper") texts by language. Every
   language has the same shape as English, and English labels cover exactly the chip keys the drawing uses —
   or the build fails (texts.js). Used at build only (AnatomyFigure frontmatter via figures.js); the browser
   script loads just zipper-lapped.<lang>.js. */
import { STEPS, LABEL_KEYS } from './zipper-lapped.js';
import { figureTexts } from './texts.js';
import en from './zipper-lapped.en.js';
import ru from './zipper-lapped.ru.js';
import de from './zipper-lapped.de.js';
import fr from './zipper-lapped.fr.js';
import it from './zipper-lapped.it.js';
import es from './zipper-lapped.es.js';

export const LAPPED_TEXT = { en, ru, de, fr, it, es };

// Every zipper-lapped.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./zipper-lapped.??.js')); } catch { /* not under Vite */ }

export const lappedText = figureTexts('zipper-lapped', LAPPED_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

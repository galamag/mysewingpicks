/* Centered zipper (guide figure, section `centered` of "How to sew a zipper") texts by language. Every
   language has the same shape as English, and English labels cover exactly the chip keys the drawing uses —
   or the build fails (texts.js). Used at build only (AnatomyFigure frontmatter via figures.js); the browser
   script loads just zipper-centered.<lang>.js. */
import { STEPS, LABEL_KEYS } from './zipper-centered.js';
import { figureTexts } from './texts.js';
import en from './zipper-centered.en.js';
import ru from './zipper-centered.ru.js';
import de from './zipper-centered.de.js';
import fr from './zipper-centered.fr.js';
import it from './zipper-centered.it.js';
import es from './zipper-centered.es.js';

export const CENTERED_TEXT = { en, ru, de, fr, it, es };

// Every zipper-centered.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./zipper-centered.??.js')); } catch { /* not under Vite */ }

export const centeredText = figureTexts('zipper-centered', CENTERED_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

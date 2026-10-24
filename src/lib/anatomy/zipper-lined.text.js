/* Lined zipper pouch (guide figure, section `lined` of "How to sew a zipper") texts by language. Every
   language has the same shape as English, and English labels cover exactly the chip keys the drawing uses —
   or the build fails (texts.js). Used at build only (AnatomyFigure frontmatter via figures.js); the browser
   script loads just zipper-lined.<lang>.js. */
import { STEPS, LABEL_KEYS } from './zipper-lined.js';
import { figureTexts } from './texts.js';
import en from './zipper-lined.en.js';
import ru from './zipper-lined.ru.js';
import de from './zipper-lined.de.js';
import fr from './zipper-lined.fr.js';
import it from './zipper-lined.it.js';
import es from './zipper-lined.es.js';

export const LINED_TEXT = { en, ru, de, fr, it, es };

// Every zipper-lined.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./zipper-lined.??.js')); } catch { /* not under Vite */ }

export const linedText = figureTexts('zipper-lined', LINED_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

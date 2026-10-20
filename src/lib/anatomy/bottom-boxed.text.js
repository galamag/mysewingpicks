/* Boxed corners (guide figure, section `boxed` of "Bag bottoms") texts by language. Every language has
   the same shape as English, and English labels cover exactly the chip keys the drawing uses — or the
   build fails (texts.js). Used at build only (AnatomyFigure frontmatter via figures.js); the browser
   script loads just bottom-boxed.<lang>.js. */
import { STEPS, LABEL_KEYS } from './bottom-boxed.js';
import { figureTexts } from './texts.js';
import en from './bottom-boxed.en.js';
import ru from './bottom-boxed.ru.js';
import de from './bottom-boxed.de.js';
import fr from './bottom-boxed.fr.js';
import it from './bottom-boxed.it.js';
import es from './bottom-boxed.es.js';

export const BOXED_TEXT = { en, ru, de, fr, it, es };

// Every bottom-boxed.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./bottom-boxed.??.js')); } catch { /* not under Vite */ }

export const boxedText = figureTexts('bottom-boxed', BOXED_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

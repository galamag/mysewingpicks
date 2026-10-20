/* Cut-out corners (guide figure, section `cut-out` of "Bag bottoms") texts by language. Every language
   has the same shape as English, and English labels cover exactly the chip keys the drawing uses — or the
   build fails (texts.js). Used at build only (AnatomyFigure frontmatter via figures.js); the browser
   script loads just bottom-cutout.<lang>.js. */
import { STEPS, LABEL_KEYS } from './bottom-cutout.js';
import { figureTexts } from './texts.js';
import en from './bottom-cutout.en.js';
import ru from './bottom-cutout.ru.js';
import de from './bottom-cutout.de.js';
import fr from './bottom-cutout.fr.js';
import it from './bottom-cutout.it.js';
import es from './bottom-cutout.es.js';

export const CUTOUT_TEXT = { en, ru, de, fr, it, es };

// Every bottom-cutout.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./bottom-cutout.??.js')); } catch { /* not under Vite */ }

export const cutoutText = figureTexts('bottom-cutout', CUTOUT_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

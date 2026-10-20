/* The folded-in bottom (guide figure, section `folded` of "Bag bottoms") texts by language. Every
   language has the same shape as English, and English labels cover exactly the chip keys the drawing
   uses — or the build fails (texts.js). Used at build only (AnatomyFigure frontmatter via figures.js);
   the browser script loads just bottom-folded.<lang>.js. */
import { STEPS, LABEL_KEYS } from './bottom-folded.js';
import { figureTexts } from './texts.js';
import en from './bottom-folded.en.js';
import ru from './bottom-folded.ru.js';
import de from './bottom-folded.de.js';
import fr from './bottom-folded.fr.js';
import it from './bottom-folded.it.js';
import es from './bottom-folded.es.js';

export const FOLDED_TEXT = { en, ru, de, fr, it, es };

// Every bottom-folded.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./bottom-folded.??.js')); } catch { /* not under Vite */ }

export const foldedText = figureTexts('bottom-folded', FOLDED_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

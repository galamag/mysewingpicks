/* Phone pouch figure texts by language. Every language has the same shape as English, and English
   labels cover exactly the chip keys the drawing uses — or the build fails (texts.js). Used at
   build only (AnatomyFigure frontmatter via figures.js); the browser script loads just pouch.<lang>.js. */
import { STEPS, LABEL_KEYS } from './pouch.js';
import { figureTexts } from './texts.js';
import en from './pouch.en.js';
import ru from './pouch.ru.js';
import de from './pouch.de.js';
import fr from './pouch.fr.js';
import it from './pouch.it.js';
import es from './pouch.es.js';

export const POUCH_TEXT = { en, ru, de, fr, it, es };

// Every pouch.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./pouch.??.js')); } catch { /* not under Vite */ }

export const pouchText = figureTexts('pouch', POUCH_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

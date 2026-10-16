/* Tote figure texts by language. Every language has the same shape as English, and English
   labels cover exactly the chip keys the drawing uses — or the build fails (texts.js). Used at
   build only (AnatomyFigure frontmatter via figures.js); the browser script loads just tote.<lang>.js. */
import { STEPS, LABEL_KEYS } from './tote.js';
import { figureTexts } from './texts.js';
import en from './tote.en.js';
import ru from './tote.ru.js';
import de from './tote.de.js';
import fr from './tote.fr.js';
import it from './tote.it.js';
import es from './tote.es.js';

export const TOTE_TEXT = { en, ru, de, fr, it, es };

// Every tote.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./tote.??.js')); } catch { /* not under Vite */ }

export const toteText = figureTexts('tote', TOTE_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

/* Fabric basket figure texts by language. Every language has the same shape as English, and English
   labels cover exactly the chip keys the drawing uses — or the build fails (texts.js). Used at
   build only (AnatomyFigure frontmatter via figures.js); the browser script loads just basket.<lang>.js. */
import { STEPS, LABEL_KEYS } from './basket.js';
import { figureTexts } from './texts.js';
import en from './basket.en.js';
import ru from './basket.ru.js';
import de from './basket.de.js';
import fr from './basket.fr.js';
import it from './basket.it.js';
import es from './basket.es.js';

export const BASKET_TEXT = { en, ru, de, fr, it, es };

// Every basket.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./basket.??.js')); } catch { /* not under Vite */ }

export const basketText = figureTexts('basket', BASKET_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

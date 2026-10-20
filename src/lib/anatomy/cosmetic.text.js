/* Cosmetic bag figure texts by language. Every language has the same shape as English, and English
   labels cover exactly the chip keys the drawing uses — or the build fails (texts.js). Used at
   build only (AnatomyFigure frontmatter via figures.js); the browser script loads just cosmetic.<lang>.js. */
import { STEPS, LABEL_KEYS } from './cosmetic.js';
import { figureTexts } from './texts.js';
import en from './cosmetic.en.js';

export const COSMETIC_TEXT = { en };

// Every cosmetic.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./cosmetic.??.js')); } catch { /* not under Vite */ }

export const cosmeticText = figureTexts('cosmetic', COSMETIC_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

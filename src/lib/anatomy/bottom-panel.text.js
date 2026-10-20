/* A separate bottom panel (guide figure, section `panel` of "Bag bottoms") texts by language. Every language
   has the same shape as English, and English labels cover exactly the chip keys the drawing uses — or the
   build fails (texts.js). Used at build only (AnatomyFigure frontmatter via figures.js); the browser script
   loads just bottom-panel.<lang>.js. */
import { STEPS, LABEL_KEYS } from './bottom-panel.js';
import { figureTexts } from './texts.js';
import en from './bottom-panel.en.js';
import ru from './bottom-panel.ru.js';
import de from './bottom-panel.de.js';
import fr from './bottom-panel.fr.js';
import it from './bottom-panel.it.js';
import es from './bottom-panel.es.js';

export const PANEL_TEXT = { en, ru, de, fr, it, es };

// Every bottom-panel.<xx>.js the browser would bundle: an unregistered one fails the build (texts.js).
// (The try: plain Node, e.g. the anatomy-sheet skill script, has no import.meta.glob; the real build always does.)
let FILES = [];
try { FILES = Object.keys(import.meta.glob('./bottom-panel.??.js')); } catch { /* not under Vite */ }

export const panelText = figureTexts('bottom-panel', PANEL_TEXT, { steps: STEPS, labelKeys: LABEL_KEYS, files: FILES });

/* Tote figure texts by language. Every language has the same shape as English,
   and English labels cover exactly the chip keys the drawing uses — or the
   build fails. Used at build only (ToteAnatomy frontmatter); the browser script loads just tote.<lang>.js. */
import { assertSameShape } from '../../i18n/shape.js';
import { STEPS, LABEL_KEYS } from './tote.js';
import en from './tote.en.js';
import ru from './tote.ru.js';
import de from './tote.de.js';

export const TOTE_TEXT = { en, ru, de };

if (en.steps.length !== STEPS.length) throw new Error(`tote.en: ${en.steps.length} steps, the model has ${STEPS.length}`);
for (const key of LABEL_KEYS) if (!en.labels[key]) throw new Error(`tote.en: label "${key}" is missing`);
for (const key of Object.keys(en.labels)) if (!LABEL_KEYS.includes(key)) throw new Error(`tote.en: label "${key}" is not used by the drawing`);
STEPS.forEach((step, k) => {
  if (step.stitch && !Object.prototype.hasOwnProperty.call(en.stitches, step.stitch)) {
    throw new Error(`tote: step ${k} uses stitch "${step.stitch}", but tote.en.js has no stitches.${step.stitch}`);
  }
});
for (const [lang, text] of Object.entries(TOTE_TEXT)) if (lang !== 'en') assertSameShape(en, text, `tote.${lang}`);

export function toteText(lang) {
  const text = TOTE_TEXT[lang];
  if (!text) throw new Error(`tote: no texts for "${lang}"`);
  return text;
}

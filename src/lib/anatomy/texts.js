/*
  Build-time checks of an anatomy figure's texts (<item>.<lang>.js), shared by every
  <item>.text.js: each language has English's shape, English labels cover exactly the chip
  keys the drawing uses, every step has its texts and its stitch, and no <item>.<xx>.js
  ships unregistered. Build only — the browser loads just <item>.<lang>.js.
*/
import { assertSameShape } from '../../i18n/shape.js';

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

/**
  name   the file prefix ('tote' for tote.en.js, tote.ru.js, …)
  all    { en, ru, … } — every registered language
  steps, labelKeys — from the model
  files  Object.keys(import.meta.glob('./<name>.??.js')) — every file the browser script
         would bundle ([] in plain Node, which has no import.meta.glob)
  → (lang) => the texts of that language
*/
export function figureTexts(name, all, { steps, labelKeys, files }) {
  // The figure's browser script bundles EVERY <name>.<xx>.js it finds (import.meta.glob). A file that is
  // not registered is checked by nobody and still ships — so it fails the build.
  for (const file of files) {
    const code = file.slice(`./${name}.`.length, -'.js'.length);
    if (!has(all, code)) throw new Error(`${name}: ${file} exists but is not registered — it would ship to the browser unreviewed`);
  }
  const en = all.en;
  if (!en) throw new Error(`${name}: no English texts`);
  if (en.steps.length !== steps.length) throw new Error(`${name}.en: ${en.steps.length} steps, the model has ${steps.length}`);
  for (const key of labelKeys) if (!en.labels[key]) throw new Error(`${name}.en: label "${key}" is missing`);
  for (const key of Object.keys(en.labels)) if (!labelKeys.includes(key)) throw new Error(`${name}.en: label "${key}" is not used by the drawing`);
  steps.forEach((step, k) => {
    if (step.stitch && !has(en.stitches, step.stitch)) {
      throw new Error(`${name}: step ${k} uses stitch "${step.stitch}", but ${name}.en.js has no stitches.${step.stitch}`);
    }
  });
  for (const [lang, text] of Object.entries(all)) if (lang !== 'en') assertSameShape(en, text, `${name}.${lang}`);

  return (lang) => {
    const text = all[lang];
    if (!text) throw new Error(`${name}: no texts for "${lang}"`);
    return text;
  };
}

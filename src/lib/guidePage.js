/*
  Small pure helpers of a guide page, kept out of the templates so tests can check them
  (tests/guides/sections.test.js): where a "How it's done" link goes, and what it says.
*/
import { pageUrl, t } from '../i18n/index.js';
import { guideText } from '../i18n/content.js';

/** Address of a guide page in a language, with the section's #anchor when there is one (id null → none). */
export const sectionUrl = (slug, id, lang) => pageUrl(`guide/${slug}`, lang) + (id ? `#${id}` : '');

/**
 * "How it's done — <title> →" under a project's step: the link to the guide's section (or to the guide
 * when it has no sections). `translated` is the guide in the page's language (guideText), by default made here.
 * The title is the section's when the guide has sections, else the guide's. A dash, not a colon: titles hold one.
 */
export function howItsDoneLink({ guide, section }, lang, translated = guideText(guide, lang)) {
  const own = section.id ? translated.sections?.find((s) => s.id === section.id) : null;
  return {
    text: `${t(lang).ui.howItsDone} — ${own?.title ?? translated.title}`,
    url: sectionUrl(guide.slug, section.id, lang),
  };
}

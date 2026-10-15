/* =====================================================================
   LANGUAGES  —  My Sewing Picks
   ---------------------------------------------------------------------
   The site's languages and page addresses. English lives at the root
   (/tools.html); every other language under its code (/ru/tools.html),
   its home page at /ru.html (build.format 'file').
   Every page is ONE template in src/pages/[...lang]/, built once per language.
   Links between pages: ALWAYS pageUrl(page, lang) — never a hand-written path.
   Texts: src/i18n/<lang>.js (interface + pages, every language incl. en);
   translations of products, sections and projects: src/i18n/<lang>/*.js
   (English stays in src/data/*.js), see content.js.
   ===================================================================== */
import { assertSameShape } from './shape.js';
import { projects } from '../data/projects.js';
import en from './en.js';
import ru from './ru.js';
import de from './de.js';
import fr from './fr.js';
import it from './it.js';

export const DEFAULT_LOCALE = 'en';
/** Languages that are BUILT (have pages). */
export const LOCALES = ['en', 'ru', 'de', 'fr', 'it'];
export const LANGS = {
  en: { name: 'English', ogLocale: 'en_US' },
  ru: { name: 'Русский', ogLocale: 'ru_RU' },
  de: { name: 'Deutsch', ogLocale: 'de_DE' },
  fr: { name: 'Français', ogLocale: 'fr_FR' },
  it: { name: 'Italiano', ogLocale: 'it_IT' },
};

/** Dictionaries — every one is checked against English, even before its pages are built. */
const DICTS = { en, ru, de, fr, it };
for (const [lang, dict] of Object.entries(DICTS)) if (lang !== DEFAULT_LOCALE) assertSameShape(en, dict, lang);

/** Page key → file under the language root. Project pages come from src/data/projects.js. */
export const PAGES = {
  home: '',
  tools: 'tools.html',
  fabrics: 'fabrics.html',
  setup: 'setup.html',
  projects: 'projects.html',
  about: 'about.html',
  privacy: 'privacy.html',
  ...Object.fromEntries(projects.map((p) => [`project/${p.slug}`, `projects/${p.slug}.html`])),
};

/** Pages that exist only in SOME languages and stay out of search: noindex, not in sitemap.xml, no hreflang.
    legal — the Legal notice (Impressum / Aviso legal / Mentions légales), only where the law asks for it
    (spec wave 1, 5.3). The owner's data are NOT in the repo: the page carries placeholders that
    server/fill-legal.php fills in on the server at every deploy. */
export const LIMITED_PAGES = { legal: { file: 'legal.html', langs: ['de', 'es', 'fr'] } };

/** Does `page` exist in `lang`? Every PAGES page does; a LIMITED_PAGES page only in its languages. */
export const hasPage = (page, lang) => page in PAGES || (LIMITED_PAGES[page]?.langs.includes(lang) ?? false);

/** Site-absolute URL of a page in a language: pageUrl('tools', 'ru') → '/ru/tools.html'. */
export function pageUrl(page, lang) {
  const file = PAGES[page] ?? LIMITED_PAGES[page]?.file;
  if (file === undefined) throw new Error(`i18n: unknown page "${page}" (keys: ${[...Object.keys(PAGES), ...Object.keys(LIMITED_PAGES)].join(', ')})`);
  if (!LOCALES.includes(lang)) throw new Error(`i18n: language "${lang}" is not built (LOCALES: ${LOCALES.join(', ')})`);
  if (!hasPage(page, lang)) throw new Error(`i18n: page "${page}" does not exist in "${lang}" (LIMITED_PAGES)`);
  if (lang === DEFAULT_LOCALE) return `/${file}`;
  return file === '' ? `/${lang}.html` : `/${lang}/${file}`;
}

/** getStaticPaths for src/pages/[...lang]/*: English at the root, the others under /<lang>/. */
export const localePaths = () =>
  LOCALES.map((lang) => ({ params: { lang: lang === DEFAULT_LOCALE ? undefined : lang } }));

/** getStaticPaths for a LIMITED_PAGES page: only the built languages that have it. */
export const limitedPaths = (page) =>
  LOCALES.filter((lang) => hasPage(page, lang)).map((lang) => ({ params: { lang: lang === DEFAULT_LOCALE ? undefined : lang } }));

/** The page's language from its route params. */
export const langOf = (params) => params.lang ?? DEFAULT_LOCALE;

/** Interface + page texts of a language. */
export function t(lang) {
  const dict = DICTS[lang];
  if (!dict) throw new Error(`i18n: no dictionary for "${lang}"`);
  return dict;
}

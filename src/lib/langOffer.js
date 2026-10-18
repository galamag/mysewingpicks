/*
  The language suggestion (src/components/LangOffer.astro). The site never switches language by
  itself (CLAUDE.md: no redirect by the browser's language): when the visitor's browser prefers
  ANOTHER site language, a small banner offers the same page in it — "Open" or "No, thanks".

  Pure functions, no imports: the banner's script (in the browser) and tests/langOffer.test.js use
  them; buildOffers() runs at build time and gets the i18n helpers passed in, so the browser
  bundle never pulls in the dictionaries.

  Storage: ONE localStorage key, written only when the visitor acts — "No, thanks" ('dismissed'),
  "Open" or a language picked in the header's switcher ('chosen'). Either one → no banner any more.
  Described on the Privacy page (pages.privacy.bodyHtml, every language).
*/

export const STORAGE_KEY = 'msp-lang-offer';

/** 'de-AT' → 'de', 'de;q=0.9' → 'de'. */
const primary = (tag) => String(tag).trim().toLowerCase().split(/[-_;]/)[0];

/**
  The visitor's first browser language that the site has, or null.
  languages  navigator.languages (a list) or an Accept-Language string ('de-AT,de;q=0.9,en')
  locales    the site's languages
*/
export function preferredLang(languages, locales) {
  const list = typeof languages === 'string' ? languages.split(',') : [...(languages ?? [])];
  for (const tag of list) {
    const lang = primary(tag);
    if (locales.includes(lang)) return lang;
  }
  return null;
}

/** Has the visitor said "No, thanks" or picked a language? Blocked storage → not known (show the banner). */
export function suppressed(storage) {
  try {
    return Boolean(storage?.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

/** Remember 'dismissed' or 'chosen'. false when the storage is blocked: then only this page view knows. */
export function remember(storage, value) {
  try {
    storage.setItem(STORAGE_KEY, value);
    return true;
  } catch {
    return false;
  }
}

/**
  The offer to show, or null.
  languages  the visitor's browser languages (see preferredLang)
  pageLang   the language of this page
  offers     { <lang>: { href, text, open, dismiss, label } } for every OTHER site language (buildOffers)
  storage    localStorage (or null when the browser blocks it)
  → { lang, href, text, open, dismiss, label } | null
*/
export function pickOffer({ languages, pageLang, offers, storage }) {
  if (suppressed(storage)) return null;
  const lang = preferredLang(languages, [pageLang, ...Object.keys(offers)]);
  if (!lang || lang === pageLang || !offers[lang]) return null;
  return { lang, ...offers[lang] };
}

/**
  Build time: what the banner on `page` (in `pageLang`) offers for every other language. The same
  address as the header's switcher: the same page in that language; a page the language does not
  have (the Legal notice) → that language's home page, and then the "site" text, not the "page" one.
  locales  LOCALES; hasPage, pageUrl — from src/i18n/index.js
  texts    (lang) → { page, site, open, dismiss, label }
*/
export function buildOffers(page, pageLang, { locales, hasPage, pageUrl, texts }) {
  return Object.fromEntries(locales.filter((l) => l !== pageLang).map((l) => {
    const same = hasPage(page, l);
    const { page: pageText, site, open, dismiss, label } = texts(l);
    return [l, { href: same ? pageUrl(page, l) : pageUrl('home', l), text: same ? pageText : site, open, dismiss, label }];
  }));
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STORAGE_KEY, preferredLang, pickOffer, remember, suppressed, buildOffers } from '../src/lib/langOffer.js';
import { LOCALES, hasPage, pageUrl, t } from '../src/i18n/index.js';

/** A localStorage stand-in. `blocked` — every call throws, as in a browser with site data blocked. */
const memoryStorage = (initial = {}, { blocked = false } = {}) => {
  const data = new Map(Object.entries(initial));
  const guard = () => { if (blocked) throw new Error('SecurityError: storage is blocked'); };
  return {
    getItem: (k) => { guard(); return data.has(k) ? data.get(k) : null; },
    setItem: (k, v) => { guard(); data.set(k, String(v)); },
    data,
  };
};

const texts = (l) => ({ ...t(l).ui.langOffer, label: t(l).ui.language });
const offersFor = (page, lang) => buildOffers(page, lang, { locales: LOCALES, hasPage, pageUrl, texts });

test('primary subtag: an Accept-Language list on an English page → German', () => {
  assert.equal(preferredLang('de-AT,de;q=0.9,en', LOCALES), 'de');
  assert.equal(preferredLang(['de-AT', 'de', 'en'], LOCALES), 'de');
  const offer = pickOffer({ languages: ['de-AT', 'de', 'en'], pageLang: 'en', offers: offersFor('tools', 'en'), storage: memoryStorage() });
  assert.equal(offer.lang, 'de');
  assert.equal(offer.href, '/de/tools.html');
  assert.equal(offer.text, t('de').ui.langOffer.page);
});

test('a language the site does not have is skipped: pt-BR, en on a Russian page → English', () => {
  const offer = pickOffer({ languages: 'pt-BR, en', pageLang: 'ru', offers: offersFor('fabrics', 'ru'), storage: memoryStorage() });
  assert.equal(offer.lang, 'en');
  assert.equal(offer.href, '/fabrics.html');
  assert.equal(offer.open, t('en').ui.langOffer.open);
  assert.equal(offer.dismiss, t('en').ui.langOffer.dismiss);
  assert.equal(offer.label, t('en').ui.language);
});

test('no site language in the browser → no banner', () => {
  assert.equal(preferredLang(['ja'], LOCALES), null);
  assert.equal(pickOffer({ languages: ['ja'], pageLang: 'en', offers: offersFor('home', 'en'), storage: memoryStorage() }), null);
  assert.equal(pickOffer({ languages: [], pageLang: 'en', offers: offersFor('home', 'en'), storage: memoryStorage() }), null);
  assert.equal(pickOffer({ languages: undefined, pageLang: 'en', offers: offersFor('home', 'en'), storage: memoryStorage() }), null);
});

test('the page is already in the first matching language → no banner', () => {
  assert.equal(pickOffer({ languages: ['ru-RU', 'en'], pageLang: 'ru', offers: offersFor('about', 'ru'), storage: memoryStorage() }), null);
  // the first MATCHING one counts, not the first one: ja is skipped, then fr is the page language
  assert.equal(pickOffer({ languages: ['ja', 'fr-CA', 'de'], pageLang: 'fr', offers: offersFor('about', 'fr'), storage: memoryStorage() }), null);
  assert.equal(pickOffer({ languages: ['EN-us'], pageLang: 'en', offers: offersFor('about', 'en'), storage: memoryStorage() }), null);
});

test('the Legal notice (only de, es, fr) offers a missing language its home page, with the "site" text', () => {
  const offer = pickOffer({ languages: ['ru'], pageLang: 'de', offers: offersFor('legal', 'de'), storage: memoryStorage() });
  assert.equal(offer.href, '/ru.html');
  assert.equal(offer.text, t('ru').ui.langOffer.site);
  const en = pickOffer({ languages: ['en-GB'], pageLang: 'fr', offers: offersFor('legal', 'fr'), storage: memoryStorage() });
  assert.equal(en.href, '/');
  // es has a Legal notice too: the same page, the "page" text
  const es = pickOffer({ languages: ['es-MX'], pageLang: 'de', offers: offersFor('legal', 'de'), storage: memoryStorage() });
  assert.equal(es.href, '/es/legal.html');
  assert.equal(es.text, t('es').ui.langOffer.page);
});

test('every page offers exactly the other languages, at the same address the header switcher uses', () => {
  for (const page of ['home', 'tools', 'privacy', 'project/tote-bag', 'legal']) {
    for (const lang of LOCALES.filter((l) => hasPage(page, l))) {
      const offers = offersFor(page, lang);
      assert.deepEqual(Object.keys(offers).sort(), LOCALES.filter((l) => l !== lang).sort(), `${page} in ${lang}`);
      for (const [l, o] of Object.entries(offers)) {
        assert.equal(o.href, hasPage(page, l) ? pageUrl(page, l) : pageUrl('home', l), `${page} in ${lang} → ${l}`);
        for (const key of ['text', 'open', 'dismiss', 'label']) assert.ok(o[key]?.trim(), `${page} in ${lang} → ${l}: ${key}`);
      }
    }
  }
  assert.equal(offersFor('home', 'en').ru.href, '/ru.html');
  assert.equal(offersFor('home', 'ru').en.href, '/');
});

test('"No, thanks" or an explicit language choice is remembered: no banner any more', () => {
  const offers = offersFor('tools', 'en');
  for (const value of ['dismissed', 'chosen']) {
    const storage = memoryStorage();
    assert.ok(pickOffer({ languages: ['ru'], pageLang: 'en', offers, storage }));
    assert.equal(remember(storage, value), true);
    assert.equal(storage.data.get(STORAGE_KEY), value);
    assert.equal(suppressed(storage), true);
    assert.equal(pickOffer({ languages: ['ru'], pageLang: 'en', offers, storage }), null);
  }
  assert.equal(pickOffer({ languages: ['ru'], pageLang: 'en', offers, storage: memoryStorage({ [STORAGE_KEY]: 'chosen' }) }), null);
});

test('blocked or missing storage: the banner still shows, remembering just fails quietly', () => {
  const offers = offersFor('tools', 'en');
  for (const storage of [memoryStorage({}, { blocked: true }), null, undefined]) {
    assert.equal(suppressed(storage), false);
    assert.equal(remember(storage, 'dismissed'), false);
    assert.equal(pickOffer({ languages: ['ru'], pageLang: 'en', offers, storage })?.lang, 'ru');
  }
});

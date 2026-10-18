/* Translated product, section, project and guide texts. English stays in src/data/*.js;
   other languages come from src/i18n/<lang>/*.js and must cover EVERY product,
   section, project and guide — a missing or extra id fails the build. */
import { products } from '../data/products.js';
import { categories } from '../data/categories.js';
import { projects } from '../data/projects.js';
import { guides } from '../data/guides.js';
import { DEFAULT_LOCALE } from './index.js';
import ruProducts from './ru/products.js';
import ruGroups from './ru/categories.js';
import ruProjects from './ru/projects.js';
import ruGuides from './ru/guides.js';
import deProducts from './de/products.js';
import deGroups from './de/categories.js';
import deProjects from './de/projects.js';
import deGuides from './de/guides.js';
import frProducts from './fr/products.js';
import frGroups from './fr/categories.js';
import frProjects from './fr/projects.js';
import frGuides from './fr/guides.js';
import itProducts from './it/products.js';
import itGroups from './it/categories.js';
import itProjects from './it/projects.js';
import itGuides from './it/guides.js';
import esProducts from './es/products.js';
import esGroups from './es/categories.js';
import esProjects from './es/projects.js';
import esGuides from './es/guides.js';

export const PROJECT_FIELDS = ['title', 'blurb', 'pageTitle', 'pageDescription', 'heading', 'teaser', 'videoTitle', 'videoIntro', 'needsIntro'];
/** Translatable LISTS of a project: field → the text keys of each item. A translation has as many
    items as English, each key a non-empty string (faq: the questions and answers of the page). */
export const PROJECT_LISTS = { faq: ['q', 'a'] };
/** Translatable texts of a guide (src/data/guides.js). */
export const GUIDE_FIELDS = ['title', 'blurb', 'pageTitle', 'pageDescription', 'heading', 'teaser', 'needsIntro'];

/** Translation sets by language: { products, groups, projects, guides }. */
const SETS = {
  ru: { products: ruProducts, groups: ruGroups, projects: ruProjects, guides: ruGuides },
  de: { products: deProducts, groups: deGroups, projects: deProjects, guides: deGuides },
  fr: { products: frProducts, groups: frGroups, projects: frProjects, guides: frGuides },
  it: { products: itProducts, groups: itGroups, projects: itProjects, guides: itGuides },
  es: { products: esProducts, groups: esGroups, projects: esProjects, guides: esGuides },
};

function cover(lang, kind, ids, table, fields, lists = {}) {
  if (!table) throw new Error(`i18n/${lang}: no ${kind} translations`);
  for (const id of ids) {
    if (!table[id]) throw new Error(`i18n/${lang}/${kind}: "${id}" has no translation`);
    for (const f of fields) {
      if (typeof table[id][f] !== 'string' || !table[id][f].trim()) throw new Error(`i18n/${lang}/${kind}: "${id}".${f} is missing`);
    }
    for (const f of Object.keys(table[id])) if (!fields.includes(f) && !lists[f]) throw new Error(`i18n/${lang}/${kind}: "${id}".${f} is not a translatable field`);
  }
  for (const id of Object.keys(table)) if (!ids.includes(id)) throw new Error(`i18n/${lang}/${kind}: "${id}" is not in src/data (typo or removed?)`);
}

/** A project's list (e.g. faq) in one language: an array of items, each key a non-empty string. */
function checkList(where, list, keys) {
  if (!Array.isArray(list) || !list.length) throw new Error(`${where} must be a non-empty list`);
  list.forEach((item, i) => {
    for (const k of keys) if (typeof item?.[k] !== 'string' || !item[k].trim()) throw new Error(`${where}[${i}].${k} is missing`);
    for (const k of Object.keys(item)) if (!keys.includes(k)) throw new Error(`${where}[${i}].${k} is not a translatable key`);
  });
}

/** A translation's lists match English: the same lists, the same number of items. Lists are optional per project. */
function coverLists(lang, table) {
  for (const p of projects) {
    for (const [f, keys] of Object.entries(PROJECT_LISTS)) {
      const where = `i18n/${lang}/projects: "${p.slug}".${f}`;
      if (p[f] === undefined) {
        if (table[p.slug][f] !== undefined) throw new Error(`${where} exists, but the English project has no ${f}`);
        continue;
      }
      checkList(where, table[p.slug][f], keys);
      if (table[p.slug][f].length !== p[f].length) throw new Error(`${where} has ${table[p.slug][f].length} items, English has ${p[f].length}`);
    }
  }
}

// English projects must carry every translatable field too (the translations are checked against this list).
for (const p of projects) {
  for (const f of PROJECT_FIELDS) {
    if (typeof p[f] !== 'string' || !p[f].trim()) throw new Error(`data/projects.js: project "${p.slug}" has no "${f}" text`);
  }
  for (const [f, keys] of Object.entries(PROJECT_LISTS)) if (p[f] !== undefined) checkList(`data/projects.js: "${p.slug}".${f}`, p[f], keys);
}

// …and so must English guides.
for (const g of guides) {
  for (const f of GUIDE_FIELDS) {
    if (typeof g[f] !== 'string' || !g[f].trim()) throw new Error(`data/guides.js: guide "${g.slug}" has no "${f}" text`);
  }
}

const groupKeys = Object.entries(categories).flatMap(([c, cfg]) => cfg.groups.map((g) => `${c}/${g.id}`));
for (const [lang, translations] of Object.entries(SETS)) {
  cover(lang, 'products', products.map((p) => p.id), translations.products, ['name', 'shortDescription']);
  cover(lang, 'categories', groupKeys, translations.groups, ['title']);
  cover(lang, 'projects', projects.map((p) => p.slug), translations.projects, PROJECT_FIELDS, PROJECT_LISTS);
  coverLists(lang, translations.projects);
  cover(lang, 'guides', guides.map((g) => g.slug), translations.guides, GUIDE_FIELDS);
}

function set(lang) {
  const s = SETS[lang];
  if (!s) throw new Error(`i18n: no translations for "${lang}"`);
  return s;
}

export const productText = (product, lang) =>
  lang === DEFAULT_LOCALE ? product : { ...product, ...set(lang).products[product.id] };

export function groupTitle(category, groupId, lang) {
  if (lang !== DEFAULT_LOCALE) return set(lang).groups[`${category}/${groupId}`].title;
  const group = categories[category]?.groups.find((g) => g.id === groupId);
  if (!group) throw new Error(`i18n: unknown section "${category}/${groupId}"`);
  return group.title;
}

export const projectText = (project, lang) =>
  lang === DEFAULT_LOCALE ? project : { ...project, ...set(lang).projects[project.slug] };

export const guideText = (guide, lang) =>
  lang === DEFAULT_LOCALE ? guide : { ...guide, ...set(lang).guides[guide.slug] };

/* Translated product, section and project texts. English stays in src/data/*.js;
   other languages come from src/i18n/<lang>/*.js and must cover EVERY product,
   section and project — a missing or extra id fails the build. */
import { products } from '../data/products.js';
import { categories } from '../data/categories.js';
import { projects } from '../data/projects.js';
import { DEFAULT_LOCALE } from './index.js';
import ruProducts from './ru/products.js';
import ruGroups from './ru/categories.js';
import ruProjects from './ru/projects.js';

export const PROJECT_FIELDS = ['title', 'blurb', 'pageTitle', 'pageDescription', 'teaser', 'videoTitle', 'videoIntro', 'needsIntro'];

/** Translation sets by language: { products, groups, projects }. */
const SETS = { ru: { products: ruProducts, groups: ruGroups, projects: ruProjects } };

function cover(lang, kind, ids, table, fields) {
  if (!table) throw new Error(`i18n/${lang}: no ${kind} translations`);
  for (const id of ids) {
    if (!table[id]) throw new Error(`i18n/${lang}/${kind}: "${id}" has no translation`);
    for (const f of fields) {
      if (typeof table[id][f] !== 'string' || !table[id][f].trim()) throw new Error(`i18n/${lang}/${kind}: "${id}".${f} is missing`);
    }
    for (const f of Object.keys(table[id])) if (!fields.includes(f)) throw new Error(`i18n/${lang}/${kind}: "${id}".${f} is not a translatable field`);
  }
  for (const id of Object.keys(table)) if (!ids.includes(id)) throw new Error(`i18n/${lang}/${kind}: "${id}" is not in src/data (typo or removed?)`);
}

// English projects must carry every translatable field too (the translations are checked against this list).
for (const p of projects) {
  for (const f of PROJECT_FIELDS) {
    if (typeof p[f] !== 'string' || !p[f].trim()) throw new Error(`data/projects.js: project "${p.slug}" has no "${f}" text`);
  }
}

const groupKeys = Object.entries(categories).flatMap(([c, cfg]) => cfg.groups.map((g) => `${c}/${g.id}`));
for (const [lang, translations] of Object.entries(SETS)) {
  cover(lang, 'products', products.map((p) => p.id), translations.products, ['name', 'shortDescription']);
  cover(lang, 'categories', groupKeys, translations.groups, ['title']);
  cover(lang, 'projects', projects.map((p) => p.slug), translations.projects, PROJECT_FIELDS);
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

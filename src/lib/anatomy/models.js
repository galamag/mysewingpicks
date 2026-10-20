/*
  Browser registry of the anatomy figures (AnatomyFigure's script): slug → the model and its
  texts, one file per language. Both are loaded on demand, so a page downloads only ITS figure's
  model and only ITS language (Vite splits every import below into its own file).
  The glob bundles EVERY <item>.<xx>.js it finds — <item>.text.js fails the build if one is
  not registered there. A new figure: add it here AND in figures.js.
*/
export const MODELS = {
  'tote-bag': { model: () => import('./tote.js'), texts: import.meta.glob('./tote.??.js') },
  'fabric-basket': { model: () => import('./basket.js'), texts: import.meta.glob('./basket.??.js') },
  'line-a-bag': { model: () => import('./lining.js'), texts: import.meta.glob('./lining.??.js') },
  'cosmetic-bag': { model: () => import('./cosmetic.js'), texts: import.meta.glob('./cosmetic.??.js') },
};

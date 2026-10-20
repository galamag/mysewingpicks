/* French texts of the sewing guides (src/data/guides.js), by slug.
   Same fields as GUIDE_FIELDS in src/i18n/content.js — the build checks it.
   vous; non-breaking spaces (U+00A0) as in src/i18n/fr.js: number–unit, before : ; ! ?;
   the straight apostrophe ' as everywhere on the site; the maker's numbers only (spec 3.2). */
export default {
  'line-a-bag': {
    title: 'Doublure : coudre, retourner, surpiquer',
    blurb: "Comment se monte une doublure : une seule couture tout autour du haut, puis tout le sac se retourne par une ouverture dans la doublure. Montré sur le tote bag et sur la panière en tissu, avec deux façons de fermer l'ouverture.",
    pageTitle: "Tuto doublure de sac : retourner et fermer l'ouverture",
    pageDescription: "Doubler un sac en tissu : doublure avec une ouverture de 8 cm, couture du haut à 0,5 cm, retourner par l'ouverture, la fermer à la machine ou au point invisible, surpiquer. Chaque étape animée.",
    heading: "Doubler un sac en tissu et le retourner par l'ouverture",
    teaser: "Coudre la doublure, retourner le sac par l'ouverture, la fermer et surpiquer — chaque étape en animation.",
    needsIntro: "Du fil, des pinces à tissu, un coupe-fil, un fer à repasser et la machine à coudre — les outils que je recommande personnellement pour ces étapes. Pour fermer l'ouverture à la main, il vous faudra aussi une aiguille à coudre.",
  },
  'bag-bottom': {
    title: 'Fond de sac : quatre méthodes',
    blurb: "Comment donner à un sac un fond sur lequel il tient debout. D'abord, le fond replié à l'intérieur du tote bag : deux plis piqués à 6 cm du milieu, rentrés à l'intérieur — et les coins se forment tout seuls.",
    pageTitle: 'Tuto fond de sac couture : angles, fond carré et plus',
    pageDescription: 'Tuto fond de sac couture : le fond replié du tote bag (deux plis piqués à 6 cm du pli central, rentrés, coutures de côté à 0,5 cm) se retourne en une base plate de 12 cm. Chaque étape animée.',
    heading: "Faire le fond d'un sac en tissu : quatre méthodes",
    teaser: 'Un fond de sac plat, avec des coins qui se forment tout seuls — chaque étape animée.',
    needsIntro: "Un fer à repasser, une règle de patchwork, un stylo effaçable à l'air, du fil, des pinces à tissu, la machine à coudre et des ciseaux de couture — les outils que je recommande personnellement pour ces étapes.",
    sections: {
      folded: {
        title: "Fond replié à l'intérieur",
        line: 'Deux plis piqués, rentrés avant les coutures de côté : les coins se forment tout seuls.',
        choose: "Quand le sac est coupé d'une seule pièce, pliée en deux en travers, et que vous voulez un fond plat sans couture d'angle : les coins se forment tout seuls quand on retourne le sac.",
      },
      'cut-out': {
        title: 'Coins découpés',
        line: 'Un petit morceau découpé dans chaque coin du bas, puis le coin ouvert et cousu en travers.',
        choose: "Quand le sac est plié au fond, que vous cousez d'abord les côtés et que vous voulez un fond plat : avec les coins découpés, les coutures se rejoignent proprement, et la méthode convient aussi aux tissus épais.",
        note: 'Sur la panière en tissu, les coins sont découpés dès la coupe : dans un carré de 60 × 60 cm, un carré de 20 × 20 cm à chaque coin.',
      },
    },
  },
};

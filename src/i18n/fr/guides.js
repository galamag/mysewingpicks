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
    blurb: "Comment donner à un sac un fond sur lequel il tient debout, de quatre façons : le fond replié à l'intérieur du tote bag (deux plis piqués à 6 cm du milieu, les coins se forment tout seuls), les coins découpés, les coins carrés (en triangle) et le fond rapporté. Chaque méthode est animée, avec un conseil pour savoir quand la choisir.",
    pageTitle: 'Tuto fond de sac couture : angles, fond carré et plus',
    pageDescription: 'Tuto fond de sac couture : quatre méthodes — fond replié (plis piqués à 6 cm du milieu, base de 12 cm), coins découpés, coins carrés et fond rapporté. Chaque étape animée.',
    heading: "Faire le fond d'un sac en tissu : quatre méthodes",
    teaser: 'Quatre façons de donner un fond plat à un sac — fond replié, coins découpés, coins carrés, fond rapporté — chaque étape animée.',
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
      boxed: {
        title: 'Coins carrés (en triangle)',
        line: "Le sac est d'abord cousu, puis chaque coin du bas est aplati en triangle et cousu en travers.",
        choose: "Quand vous voulez d'abord essayer la profondeur : rien n'est découpé à l'avance, vous pouvez donc encore coudre un fond plus profond. Le coin est solide, et la méthode convient aux tissus légers.",
      },
      panel: {
        title: 'Fond rapporté',
        line: 'Le fond est une pièce à part, cousue tout autour au bas des parois.',
        choose: 'Quand vous voulez un fond plat et stable, un fond dans un autre tissu, ou un fond rigide avec un entoilage ou une plaque. Les fonds ronds et ovales se cousent aussi, en crantant la marge des parois tout le long de la courbe.',
      },
    },
  },
  'sew-a-zipper': {
    title: 'Coudre une fermeture éclair',
    blurb: "Coudre une fermeture éclair pas à pas\u00a0: dans une trousse doublée, un sac, une housse de coussin, une jupe ou une robe. Chaque méthode est animée, avec un conseil pour savoir quand la choisir.",
    pageTitle: 'Coudre une fermeture éclair\u00a0: trousse, sac, coussin, jupe',
    pageDescription: "Coudre une fermeture éclair dans une trousse, un sac, un coussin, une jupe ou une robe\u00a0: la fermeture éclair en sandwich entre l'extérieur et la doublure, et d'autres méthodes. Chaque étape animée.",
    heading: 'Coudre une fermeture éclair\u00a0: trousse, sac, coussin, jupe et robe',
    teaser: 'Coudre une fermeture éclair dans une trousse, un sac, un coussin, une jupe ou une robe — chaque étape animée.',
    needsIntro: 'Des pinces à tissu et la machine à coudre — les outils que je recommande personnellement pour ces étapes.',
    sections: {
      lined: {
        title: 'Fermeture éclair en sandwich (trousse doublée)',
        line: "L'extérieur, la fermeture éclair et la doublure sont cousus d'une seule couture — puis l'autre côté de la fermeture éclair de la même façon.",
        choose: "Pour une trousse de toilette, une trousse à crayons ou une petite pochette doublée\u00a0: la fermeture éclair se pose en même temps que la doublure, et son ruban et les marges de couture restent cachés à l'intérieur.",
        note: "Beaucoup d'explications ajoutent une surpiqûre le long de la fermeture éclair, pour que le tissu ne se prenne pas dans les dents\u00a0; cette trousse n'en a pas.",
      },
      tabs: {
        title: 'Extrémités finies (languettes)',
        line: 'De petites languettes de tissu finissent les deux extrémités de la fermeture éclair avant de la coudre.',
        choose: "Quand vous voulez des extrémités nettes et plates sur une trousse : les languettes couvrent les bouts de la fermeture éclair, qui restent hors des coutures de côté, et les coins sont bien plats.",
        rest: "Ensuite, cousez la fermeture éclair comme pour la fermeture éclair en sandwich : l'extérieur, la fermeture et la doublure en une seule couture, puis l'autre côté de la même façon. Les coutures de côté passent juste à côté des languettes.",
      },
      recessed: {
        title: 'Fermeture éclair encastrée sur un sac cabas',
        line: "La fermeture éclair est cousue entre des bandes de tissu, et cette bande de fermeture se pose à l'intérieur, en haut du sac, sous le bord.",
        choose: "Quand vous cousez un sac cabas ou un grand sac doublé et que vous voulez qu'il s'ouvre en grand, la fermeture sous le bord. Elle se pose dans presque tout sac doublé ; sur un tissu très épais, les extrémités finies deviennent épaisses.",
        rest: "Les extrémités de la fermeture se finissent avec des languettes de tissu, comme dans « Extrémités finies (languettes) » : une bande pliée comme un biais sur chaque extrémité, piquée juste après l'arrêt.",
      },
    },
  },
};

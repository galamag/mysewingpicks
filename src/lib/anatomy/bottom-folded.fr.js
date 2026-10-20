/* Fond replié à l'intérieur (tuto « Fond de sac », section `folded`) — textes français. Même forme que
   l'anglais (bottom-folded.text.js le vérifie). Vouvoiement ; centimètres seulement, virgule décimale,
   espace insécable avant cm et avant : ; ! ? ; seulement les chiffres de la couturière — 6, 12 et
   0,5 cm (tote bag). */
export default {
  ui: {
    fig: 'Fig. 1',
    title: "Fond replié à l'intérieur",
    svgLabel: "Un dessin isométrique pour faire un fond replié à l'intérieur : le pli central, deux plis piqués à 6 cm de celui-ci, le fond rentré, les coutures de côté qui le prennent et le sac retourné.",
    prev: 'Étape précédente',
    dot: (i, title) => (i ? `Étape ${i} : ${title}` : title),
    start: 'Étapes →',
    next: 'Suivant →',
    overview: "Vue d'ensemble",
    stepOf: (k, n) => `Étape ${k} sur ${n}`,
    machine: (stitch) => `Machine : ${stitch.toLowerCase()}`,
    inThisStep: 'Pour cette étape',
    takeApart: 'Voir le dessous',
    putTogether: 'Remettre debout',
    replay: '↻ Revoir',
    parts: 'Pièces',
    allSteps: 'Instructions étape par étape',
    endView: 'VUE EN COUPE',
  },
  stitches: { straight: 'Point droit' },
  labels: {
    foldPress: 'plier en deux, repasser',
    centreCrease: 'pli central',
    cm6: '6 cm',
    rightSides: 'endroit contre endroit',
    stitchFold: 'piquer au ras du pli',
    bottom12: 'fond 12 cm',
    liftEnds: 'relever les bouts aux plis piqués',
    foldsIn: 'le fond se replie dedans',
    centreInside: 'milieu rentré de 6 cm',
    seam05: 'couture 0,5 cm',
    layers4: 'ici 4 épaisseurs',
    turnOut: "retourner sur l'endroit",
    openUp: 'ouvrir le sac',
    base12: 'base 12 cm',
    cornersForm: 'les coins se forment seuls',
  },
  steps: [
    {
      title: "Le fond replié à l'intérieur",
      text: "Le fond du tote bag : une base plate de 12 cm entre deux plis piqués, et des coins qui se forment tout seuls — sans couture d'angle. Appuyez sur le sac pour voir le fond.",
    },
    {
      title: 'Marquer le milieu et mesurer',
      text: 'Pliez la pièce en deux en travers, au milieu, marquez le pli au fer et dépliez-la. Mesurez 6 cm depuis le pli vers chaque extrémité et tracez une ligne en travers.',
      details: [
        "Le sac est coupé d'une seule pièce, pliée en deux en travers : le fond se trouve au milieu de la pièce.",
        'Pliez-la en deux en travers, au milieu, et marquez le pli au fer. Dépliez-la de nouveau : ce pli est le milieu du fond.',
        "Mesurez 6 cm depuis le pli vers chaque extrémité et tracez une ligne sur toute la largeur de la pièce, au stylo effaçable à l'air.",
      ],
    },
    {
      title: 'Piquer un pli sur chaque ligne',
      text: 'Pliez le long de la première ligne, endroit contre endroit, et piquez au ras du pli. Dépliez et faites de même sur la seconde ligne : deux plis piqués, à 12 cm l\'un de l\'autre.',
      details: [
        "Pliez la pièce le long de la première ligne, endroit contre endroit, et piquez au ras du pli sur toute la largeur. Dépliez-la.",
        'Pliez et piquez de la même façon le long de la seconde ligne.',
        "Les deux plis piqués, à 12 cm l'un de l'autre, sont les bords du fond ; le pli central en marque le milieu. À l'étape suivante, la pièce se plie au niveau de ces plis.",
      ],
    },
    {
      title: 'Rentrer le fond',
      text: "Soulevez les deux extrémités au niveau des plis piqués et rapprochez-les : le fond se replie vers l'intérieur et le pli central rentre de 6 cm. Posez à plat.",
      details: [
        "Posez la pièce endroit vers le haut et soulevez les deux extrémités, pour qu'elle se plie au niveau des deux plis piqués.",
        "Rapprochez les extrémités. Le fond de 12 cm se replie sur lui-même et le pli central rentre à l'intérieur, en remontant de 6 cm entre les épaisseurs — comme le fond d'un sac en papier.",
        'Posez à plat, endroit contre endroit. Les plis piqués forment maintenant le bord inférieur.',
      ],
    },
    {
      title: 'Coudre les côtés',
      text: 'Gardez le fond rentré et cousez les deux côtés à 0,5 cm — à travers toutes les épaisseurs, quatre en bas.',
      details: [
        'Maintenez les côtés avec des pinces pour que le fond rentré reste en place.',
        "Piquez les deux coutures de côté à 0,5 cm du bord, jusqu'en bas. En bas, la couture traverse quatre épaisseurs — le devant, les deux moitiés du fond rentré et le dos. Laissez le haut ouvert.",
        "Sur le tote bag, la doublure se coud de la même façon — seulement, on laisse une ouverture dans l'une de ses coutures de côté, pour retourner le sac plus tard.",
      ],
    },
    {
      title: 'Retourner',
      text: "Retournez sur l'endroit et ouvrez : le fond se déplie en une base plate de 12 cm, et les coins se forment tout seuls.",
      details: [
        "Retournez le sac sur l'endroit par le haut.",
        "Ouvrez-le et poussez le fond vers l'extérieur. Le fond rentré se déplie en une base plate de 12 cm et, là où les coutures de côté l'ont pris, de jolis coins se forment tout seuls — aucune couture d'angle supplémentaire n'est nécessaire.",
      ],
    },
  ],
  legend: [
    { title: 'Base', text: 'plate, 12 cm de large : le fond entre les deux plis piqués' },
    { title: 'Plis piqués', text: "un pli piqué au ras du bord, à 6 cm de part et d'autre du pli central · les grands côtés de la base" },
    { title: 'Pli central', text: 'le milieu du fond · rentré de 6 cm avant de coudre les côtés' },
    { title: 'Coutures de côté', text: '0,5 cm, cousues avec le fond rentré · quatre épaisseurs en bas' },
    { title: 'Coins', text: "formés tout seuls là où les coutures de côté ont pris le fond rentré · sans couture d'angle" },
  ],
};

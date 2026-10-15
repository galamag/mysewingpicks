/* Tote bag figure — French texts. Same shape as tote.en.js (tote.text.js checks
   it): `steps` index-aligned with STEPS in tote.js, each step with the same
   number of `details` lines as English. Centimetres only, decimal comma; « vous ».
   The maker's numbers (86 × 45, 100 × 16, 43, 6, 12, 0,5, 8, 1 cm) — unchanged.
   Non-breaking spaces (U+00A0) as in src/i18n/fr.js: number–unit, before : ; ! ? */
export default {
  ui: {
    fig: 'Fig. 1',
    title: 'Tote bag · anatomie',
    svgLabel: 'Un dessin isométrique du tote bag et de sa confection, étape par étape.',
    prev: 'Étape précédente',
    dot: (i, title) => (i ? `Étape ${i} : ${title}` : title),
    start: 'Étapes →',
    next: 'Suivant →',
    overview: "Vue d'ensemble",
    stepOf: (k, n) => `Étape ${k} sur ${n}`,
    machine: (stitch) => `Machine : ${stitch.toLowerCase()}`,
    inThisStep: 'Pour cette étape',
    takeApart: 'Démonter',
    putTogether: 'Assembler',
    replay: '↻ Revoir',
    parts: 'Pièces',
    allSteps: 'Instructions étape par étape',
    endView: 'VUE EN COUPE',
  },
  stitches: { straight: 'Point droit' },
  labels: {
    cm4: '4 cm', cm6: '6 cm', cm8: '8 cm', cm16: '16 cm', cm45: '45 cm', cm86: '86 cm', cm100: '100 cm',
    fold: 'pli',
    outerDuck: 'extérieur · toile',
    liningSatin: 'doublure · satin',
    strapsDuck: '2 anses · toile',
    topstitchEdges: 'surpiquer les deux bords',
    centreCrease: 'pli central',
    stitchFold: 'piquer au ras du pli',
    bottom12: 'fond 12 cm',
    liftEnds: 'relever les bouts aux plis piqués',
    foldsIn: 'le fond se replie dedans',
    centreInside: 'milieu rentré de 6 cm',
    rightSides: 'endroit contre endroit',
    seam05: 'couture 0,5 cm',
    layers4: 'ici 4 épaisseurs',
    turnOut: "retourner sur l'endroit",
    openUp: 'ouvrir le sac',
    base12: 'base 12 cm',
    cornersForm: 'les coins se forment seuls',
    opening8: 'ouverture 8 cm',
    endsLevel: 'bouts au ras du bord supérieur',
    turnThrough: "retourner par l'ouverture",
    stitchClosed: "fermer l'ouverture",
    pushLining: 'rentrer la doublure',
    topstitch1: 'surpiqûre à 1 cm',
  },
  steps: [
    { title: 'Le sac terminé', text: 'Un tote bag doublé en trois parties : un extérieur en toile canvas de coton, une doublure en satin et deux longues anses. Appuyez sur le sac pour le démonter.' },
    {
      title: 'Couper les pièces',
      text: 'Extérieur : toile canvas de coton, 86 × 45 cm. Doublure : satin, même taille. Anses : deux bandes de toile, 100 × 16 cm.',
      details: [
        "Coupez un rectangle de toile canvas de 86 × 45 cm pour l'extérieur et un rectangle de satin de la même taille pour la doublure.",
        'Pour les anses, coupez deux bandes de toile de 100 × 16 cm.',
        "Sur l'extérieur et sur la doublure, tracez la ligne de pliure en travers, au milieu, à 43 cm de chaque petit côté : elle deviendra le fond du sac.",
        'Toutes les marges de couture de ce sac font 0,5 cm.',
      ],
    },
    {
      title: 'Coudre les anses',
      text: "Pliez en deux et repassez, dépliez, rabattez les deux bords jusqu'au pli, repliez : une anse de 4 cm de large, en quatre épaisseurs. Surpiquez les deux bords.",
      details: [
        'Pliez une bande en deux dans la longueur, envers contre envers, et marquez le pli au fer.',
        "Dépliez-la. Rabattez les deux bords longs vers l'intérieur pour qu'ils se rejoignent au pli, puis repassez de nouveau.",
        "Repliez en deux le long du premier pli. L'anse mesure maintenant 4 cm de large et compte quatre épaisseurs, avec tous les bords bruts cachés à l'intérieur.",
        'Surpiquez près des deux bords longs au point droit. Faites deux anses.',
      ],
    },
    {
      title: 'Former le fond',
      text: 'Marquez le pli central, puis dépliez. Mesurez 6 cm de chaque côté, pliez sur chaque ligne et piquez au ras du pli : deux plis piqués, un fond de 12 cm.',
      details: [
        "Pliez l'extérieur en deux en travers, au milieu, et marquez le pli au fer. Dépliez-le de nouveau.",
        'Mesurez 6 cm depuis le pli vers chaque extrémité et tracez une ligne sur toute la largeur de la pièce.',
        'Pliez le long de la première ligne, endroit contre endroit, et piquez au ras du pli. Dépliez, puis pliez et piquez de la même façon le long de la seconde ligne.',
        "Les deux plis piqués, à 12 cm l'un de l'autre, sont les bords du fond ; le pli central en marque le milieu.",
      ],
    },
    {
      title: 'Rentrer le fond',
      text: "Soulevez les deux extrémités au niveau des plis piqués et rapprochez-les : le fond se replie vers l'intérieur et le pli central rentre de 6 cm. Posez à plat.",
      details: [
        "Posez la pièce endroit vers le haut et soulevez les deux extrémités, pour qu'elle se plie au niveau des deux plis piqués.",
        "Rapprochez les extrémités. Le fond de 12 cm se replie sur lui-même et le pli central rentre à l'intérieur, en remontant de 6 cm entre les épaisseurs — comme le fond d'un sac en papier.",
        "Posez à plat, endroit contre endroit. Les plis piqués forment maintenant le bord inférieur, et la pièce pliée est 6 cm plus courte qu'une simple pliure en deux.",
      ],
    },
    {
      title: 'Coudre les côtés',
      text: 'Gardez le fond rentré et cousez les deux côtés à 0,5 cm — à travers toutes les épaisseurs, quatre en bas.',
      details: [
        'Maintenez les côtés avec des pinces pour que le fond rentré reste en place.',
        "Piquez les deux coutures de côté à 0,5 cm du bord, jusqu'en bas. En bas, la couture traverse quatre épaisseurs — le devant, les deux moitiés du fond rentré et le dos. Laissez le haut ouvert.",
      ],
    },
    {
      title: 'Retourner',
      text: "Retournez l'extérieur sur l'endroit et ouvrez-le : le fond se déplie en une base de 12 cm, et les coins se forment tout seuls.",
      details: [
        "Retournez l'extérieur sur l'endroit par le haut.",
        "Ouvrez-le et poussez le fond vers l'extérieur. Le fond rentré se déplie en une base plate de 12 cm et, là où les coutures de côté l'ont pris, de jolis coins se forment tout seuls — aucune couture d'angle supplémentaire n'est nécessaire.",
      ],
    },
    {
      title: 'Coudre la doublure',
      text: "Préparez la doublure en satin de la même façon — mais laissez une ouverture de 8 cm dans une couture de côté. C'est par là que vous retournerez le sac.",
      details: [
        "Préparez la doublure exactement comme l'extérieur : marquez le pli central, piquez les deux plis à 6 cm de celui-ci, rentrez le fond.",
        "Piquez les deux coutures de côté à 0,5 cm du bord — mais d'un côté, laissez une ouverture de 8 cm, en bas, juste au-dessus du fond rentré. C'est par là que vous retournerez le sac.",
        "Gardez la doublure sur l'envers.",
      ],
    },
    {
      title: 'Assembler extérieur et doublure',
      text: "Épinglez les anses sur l'extérieur, à 6 cm du milieu. Glissez l'extérieur dans la doublure restée sur l'envers et cousez tout autour du haut.",
      details: [
        "Retournez l'extérieur sur l'endroit.",
        'Épinglez une anse sur le bord supérieur du devant : extrémités au ras du bord brut, à 6 cm du milieu, la boucle retombant sur le sac. Faites de même sur le dos.',
        "Glissez l'extérieur, anses comprises, dans la doublure restée sur l'envers, pour que les endroits soient face à face. Alignez les coutures de côté et les bords supérieurs.",
        'Cousez tout autour du haut, à 0,5 cm du bord.',
      ],
    },
    {
      title: 'Retourner et surpiquer',
      text: "Retournez le sac par l'ouverture et fermez-la. Rentrez la doublure et surpiquez tout autour du haut, à 1 cm du bord.",
      details: [
        "Retournez tout le sac sur l'endroit par l'ouverture de la doublure.",
        "Rentrez les bords bruts de l'ouverture et fermez-la par une piqûre au ras du bord.",
        'Poussez la doublure au fond du sac et repassez le bord supérieur bien à plat.',
        'Surpiquez tout autour du haut, à 1 cm du bord. Votre tote bag est terminé !',
      ],
    },
  ],
  legend: [
    { title: 'Extérieur', text: 'toile canvas de coton · pièce de 86 × 45 cm, pliée au fond' },
    { title: 'Doublure', text: "satin · pièce de 86 × 45 cm, comme l'extérieur" },
    { title: 'Anses ×2', text: 'bandes de 100 × 16 cm · pliées en quatre à 4 cm' },
    { title: 'Fond', text: "deux plis piqués à 6 cm de part et d'autre du pli central, rentrés avant les coutures de côté → une base de 12 cm, les coins se forment tout seuls" },
    { title: 'Surpiqûre', text: 'à 1 cm du bord supérieur · toutes les coutures à 0,5 cm' },
  ],
};

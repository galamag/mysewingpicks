/* Fermeture éclair centrée (tutoriel « Coudre une fermeture éclair », section `centered`) — textes en français. Même
   forme que l'anglais (zipper-centered.text.js le vérifie). Sans chiffres ni unités ; le bâti = « au point le plus long » ;
   le sens de la piqûre n'est pas dit (les sources divergent) — seulement « dans le même sens ». Vouvoiement. Espaces
   insécables avant : ; ! ? » et après «. */
export default {
  ui: {
    fig: 'Fig. 4',
    title: 'Fermeture éclair centrée',
    svgLabel: "Un dessin isométrique pour coudre une fermeture éclair centrée dans une couture : la couture cousue jusqu'au repère de l'arrêt du bas, avec un point d'arrêt, l'ouverture bâtie au point le plus long et la couture ouverte au fer ; la fermeture endroit dessous sur les valeurs de couture, les dents sur la ligne de couture ; piquée sur l'endroit au pied fermeture éclair en travers en bas et le long des deux côtés, dans le même sens ; puis le bâti décousu, et les deux bords pliés se rejoignent sur les dents.",
    prev: 'Étape précédente',
    dot: (i, title) => (i ? `Étape ${i} : ${title}` : title),
    start: 'Étapes →',
    next: 'Suivant →',
    overview: "Vue d'ensemble",
    stepOf: (k, n) => `Étape ${k} sur ${n}`,
    machine: (stitch) => `Machine : ${stitch.toLowerCase()}`,
    inThisStep: 'Pour cette étape',
    takeApart: 'Voir à travers le tissu',
    putTogether: 'Revenir au tissu',
    replay: '↻ Revoir',
    parts: 'Pièces',
    allSteps: 'Instructions étape par étape',
    endView: 'VUE EN COUPE',
  },
  stitches: { straight: 'Point droit', basting: 'Point le plus long' },
  labels: {
    rightSides: 'endroit contre endroit',
    markStop: "marquer l'arrêt du bas",
    toMark: "couture jusqu'au repère",
    backstitch: "point d'arrêt",
    baste: 'bâtir au point le plus long',
    openOut: 'ouvrir',
    wrongUp: 'envers dessus',
    pressOpen: 'ouvrir la couture au fer',
    faceDown: 'fermeture endroit dessous',
    teethOnSeam: 'dents sur la couture',
    allowancesOnly: 'épingler aux valeurs seulement',
    rightUp: 'endroit dessus',
    belowStop: "en travers, sous l'arrêt",
    pivot: 'pivoter, aiguille piquée',
    needleDown: 'aiguille piquée, pied relevé',
    movePull: 'curseur derrière le pied',
    otherSide: "l'autre côté",
    sameWay: 'dans le même sens',
    unpick: 'découdre le bâti',
    meet: 'les bords se rejoignent',
  },
  steps: [
    {
      title: 'Fermeture éclair centrée',
      text: "Les deux bords pliés de la couture se rejoignent sur les dents de la fermeture éclair ; une piqûre passe de chaque côté et en travers en bas. Touchez pour voir à travers le tissu.",
    },
    {
      title: 'Endroit contre endroit',
      text: "Posez les deux pièces endroit contre endroit. Placez la fermeture éclair le long de la ligne de couture et marquez où se trouve son arrêt du bas : l'ouverture pour la fermeture s'arrête au repère.",
      details: [
        "Surfilez d'abord les bords bruts de la couture, pour qu'ils ne s'effilochent pas.",
        'Posez les deux pièces endroit contre endroit, les bords alignés, et maintenez avec des pinces.',
        "Placez la fermeture éclair le long de la ligne de couture et marquez la ligne de couture à son arrêt du bas : l'ouverture pour la fermeture s'arrête au repère.",
      ],
    },
    {
      title: "La couture jusqu'au repère",
      text: "Cousez la couture au point normal jusqu'au repère et faites-y un point d'arrêt, pour que la couture tienne là où la fermeture s'arrête.",
      details: [
        "Cousez la couture au point normal, sur la ligne de couture, jusqu'au repère.",
        "Faites un point d'arrêt au repère : là où la fermeture s'arrête, la couture ne doit pas se défaire.",
      ],
    },
    {
      title: "Bâtir l'ouverture",
      text: "Réglez le point le plus long et fermez l'ouverture sur la même ligne de couture, du repère jusqu'au bord du haut. Ce bâti sera décousu à la fin.",
      details: [
        'Réglez la machine sur son point le plus long : c\'est un bâti, il sera décousu plus tard.',
        "Fermez l'ouverture sur la même ligne de couture, du repère jusqu'au bord du haut.",
        "Le bâti garde l'ouverture fermée pendant que vous cousez la fermeture.",
      ],
    },
    {
      title: 'Ouvrir la couture au fer',
      text: "Ouvrez les pièces, retournez-les envers dessus et ouvrez les valeurs de couture au fer, une de chaque côté, sur toute la couture.",
      details: [
        "Ouvrez les pièces et retournez-les, l'envers dessus.",
        'Ouvrez les valeurs de couture au fer, une de chaque côté, sur toute la couture, la partie bâtie aussi.',
      ],
    },
    {
      title: 'La fermeture endroit dessous',
      text: 'Posez la fermeture éclair endroit dessous sur les valeurs de couture, les dents juste sur la ligne de couture, et épinglez-la aux valeurs de couture seulement.',
      details: [
        'Posez la fermeture éclair endroit dessous sur les valeurs de couture ouvertes.',
        "Les dents juste sur la ligne de couture, l'arrêt du bas au repère.",
        'Épinglez le ruban de la fermeture aux valeurs de couture seulement, pas aux pièces dessous.',
      ],
    },
    {
      title: 'Un côté',
      text: "Retournez l'ouvrage, endroit dessus. Au pied fermeture éclair, piquez en travers en bas, sous l'arrêt, pivotez aiguille piquée et piquez le long d'un côté, à travers toutes les épaisseurs.",
      details: [
        "Retournez l'ouvrage, endroit dessus : la fermeture est dessous, ses dents sous la ligne de couture.",
        "Montez le pied fermeture éclair : avec lui, l'aiguille pique près de la fermeture.",
        "Commencez sur la ligne de couture et piquez en travers en bas, sous l'arrêt : jamais sur l'arrêt.",
        "Au coin, arrêtez-vous aiguille piquée, relevez le pied, tournez l'ouvrage et piquez le long du côté, toujours à la même distance de la couture.",
      ],
    },
    {
      title: 'Déplacer le curseur',
      text: "Quand le curseur gêne, arrêtez-vous aiguille piquée, relevez le pied et faites glisser le curseur derrière le pied. Baissez le pied et finissez le côté au pied fermeture éclair.",
      details: [
        "Quelques points avant le curseur, arrêtez-vous, l'aiguille piquée dans le tissu.",
        "Relevez le pied presseur et faites glisser le curseur derrière le pied, derrière l'aiguille.",
        'Baissez le pied et finissez le côté au pied fermeture éclair.',
      ],
    },
    {
      title: "L'autre côté",
      text: "Piquez l'autre côté de la même façon au pied fermeture éclair : en travers en bas depuis la ligne de couture, pivotez, le long du côté — dans le même sens que le premier côté.",
      details: [
        "Recommencez sur la ligne de couture et piquez l'autre moitié en travers, sous l'arrêt.",
        "Pivotez aiguille piquée et piquez le long de l'autre côté, à la même distance de la couture.",
        'Cousez les deux côtés dans le même sens.',
      ],
    },
    {
      title: 'Découdre le bâti',
      text: 'Décousez le bâti sur la fermeture et repassez. Les deux bords pliés se rejoignent sur les dents, la fermeture se voit à peine.',
      details: [
        'Décousez les points du bâti sur la fermeture éclair.',
        "Repassez sur l'endroit : les deux bords pliés se rejoignent sur les dents.",
      ],
    },
  ],
  legend: [
    { title: 'Tissu', text: 'deux pièces assemblées par une couture · leurs bords pliés se rejoignent sur les dents' },
    { title: 'Piqûre', text: "le long des deux côtés et en travers sous l'arrêt · à la même distance de la couture" },
    { title: 'Couture', text: "sous la fermeture, avec un point d'arrêt au repère" },
    { title: 'Fermeture éclair', text: 'endroit dessous sous la couture, les dents sur la ligne de couture' },
  ],
};

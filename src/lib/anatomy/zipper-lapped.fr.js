/* Fermeture éclair sous patte (tutoriel « Coudre une fermeture éclair », section `lapped`) — textes en français. Même
   forme que l'anglais (zipper-lapped.text.js le vérifie). Sans chiffres ni unités : le côté dessous replié « un peu plus
   étroit que la valeur de couture », la piqûre « assez loin pour éviter les dents et le curseur », le bâti « au point le
   plus long ». Le sens de la piqûre et l'endroit où elle commence ne sont pas dits (les sources divergent). Vouvoiement.
   Espaces insécables avant : ; ! ? » et après «. */
export default {
  ui: {
    fig: 'Fig. 5',
    title: 'Fermeture éclair sous patte',
    svgLabel: "Un dessin isométrique pour coudre une fermeture éclair sous patte dans une couture : la couture cousue jusqu'au repère de l'arrêt du bas, avec un point d'arrêt, l'ouverture bâtie au point le plus long et la couture ouverte au fer ; côté dessous, la valeur de couture dépliée et la fermeture piquée dessus endroit dessous, près des dents ; la fermeture retournée endroit dessus, un pli un peu plus étroit que la valeur se forme contre les dents, piqué à travers la valeur et le ruban ; la patte posée sur la fermeture, son pli sur la ligne de couture : elle recouvre ces deux piqûres ; piquée au pied fermeture éclair le long de la patte et en travers en bas, assez loin des dents et du curseur ; puis le bâti décousu. Une seule piqûre est visible.",
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
    rightUp: 'endroit dessus',
    foldBack: 'rabattre la patte',
    foldOut: 'déplier la valeur',
    faceDown: 'fermeture endroit dessous',
    teethBySeam: 'les dents contre la couture',
    nearTeeth: 'piquer près des dents',
    allowanceOnly: 'valeur et ruban seulement',
    faceUp: 'fermeture endroit dessus',
    besideTeeth: 'un pli contre les dents',
    narrower: 'un peu plus étroit que la valeur',
    alongFold: 'piquer le long du pli',
    overlapBack: 'ramener la patte',
    covers: 'elle recouvre la piqûre',
    belowStop: "en travers, sous l'arrêt",
    pivot: 'pivoter, aiguille piquée',
    clearTeeth: 'loin des dents et du curseur',
    unpick: 'découdre le bâti',
    oneLine: 'une seule piqûre visible',
  },
  steps: [
    {
      title: 'Fermeture éclair sous patte',
      text: "Un côté de la couture, la patte, recouvre la fermeture éclair : son pli est sur la ligne de couture, et une seule piqûre se voit, le long de ce côté et en travers en bas. Touchez pour voir à travers le tissu.",
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
      text: "Réglez le point le plus long et fermez l'ouverture sur la même ligne de couture, entre le repère et le bord du haut. Ce bâti sera décousu à la fin.",
      details: [
        "Réglez la machine sur son point le plus long : c'est un bâti, il sera décousu plus tard.",
        "Fermez l'ouverture sur la même ligne de couture, entre le repère et le bord du haut.",
        "Le bâti garde les deux côtés de l'ouverture sur la ligne de couture pendant que vous cousez la fermeture.",
      ],
    },
    {
      title: 'Ouvrir la couture au fer',
      text: 'Ouvrez les pièces, retournez-les envers dessus et ouvrez les valeurs de couture au fer, une de chaque côté, sur toute la couture.',
      details: [
        "Ouvrez les pièces et retournez-les, l'envers dessus.",
        'Ouvrez les valeurs de couture au fer, une de chaque côté, sur toute la couture, la partie bâtie aussi.',
      ],
    },
    {
      title: 'Rabattre la patte',
      text: "Retournez l'ouvrage, endroit dessus. Un côté de l'ouverture, la patte, recouvrira la fermeture ; l'autre, le côté dessous, passe sous elle. Rabattez la patte pour la dégager : le bâti la retient sur la ligne de couture.",
      details: [
        "Retournez l'ouvrage, endroit dessus.",
        "Choisissez la patte : le côté qui recouvrira la fermeture. L'autre côté est le côté dessous.",
        "Rabattez la patte sur le côté dessous, pour qu'elle ne soit pas prise dans la piqûre suivante.",
      ],
    },
    {
      title: 'La fermeture endroit dessous',
      text: 'Côté dessous, dépliez la valeur de couture, à plat au-delà de la ligne de couture. Posez dessus la fermeture éclair endroit dessous, les dents contre la ligne de couture, et épinglez-la à cette valeur.',
      details: [
        "Dépliez la valeur de couture du côté dessous, à plat au-delà de la ligne de couture : sous la fermeture, il n'y a que cette valeur.",
        "Posez la fermeture éclair endroit dessous sur la valeur, les dents contre la ligne de couture, l'arrêt du bas au repère.",
        'Épinglez le ruban de la fermeture à la valeur de couture.',
      ],
    },
    {
      title: 'Piquer près des dents',
      text: "Au pied fermeture éclair, piquez le ruban à la valeur de couture près des dents, à travers le ruban et la valeur seulement, sur toute la longueur de la fermeture, mais jamais sur l'arrêt du bas.",
      details: [
        "Montez le pied fermeture éclair : avec lui, l'aiguille pique près de la fermeture.",
        'Piquez près des dents, à travers le ruban et la valeur de couture seulement.',
        "Piquez sur toute la longueur de la fermeture, mais jamais sur l'arrêt du bas.",
      ],
    },
    {
      title: 'Retourner la fermeture',
      text: 'Retournez la fermeture endroit dessus : la valeur de couture se replie dessous, et un petit pli se forme tout contre les dents, un peu plus étroit que la valeur de couture. Repassez le pli.',
      details: [
        'Retournez la fermeture endroit dessus : la valeur de couture se replie sous la fermeture.',
        'Un petit pli se forme tout contre les dents, juste au-delà de la ligne de couture : la partie repliée est un peu plus étroite que la valeur de couture.',
        'Repassez le pli.',
      ],
    },
    {
      title: 'Piquer le long du pli',
      text: "Au pied fermeture éclair, piquez tout près du pli, à travers la valeur de couture et le ruban seulement, sur toute la longueur de la fermeture, mais jamais sur l'arrêt du bas.",
      details: [
        'Piquez tout près du pli, à travers la valeur de couture et le ruban seulement : la patte reste rabattue.',
        "Piquez sur toute la longueur de la fermeture, mais jamais sur l'arrêt du bas.",
      ],
    },
    {
      title: 'La patte sur la fermeture',
      text: 'Ramenez la patte sur la fermeture éclair, son pli sur la ligne de couture : elle recouvre les dents et les deux piqûres du côté dessous. Épinglez-la à travers toutes les épaisseurs.',
      details: [
        'Ramenez la patte sur la fermeture : le bâti garde son pli sur la ligne de couture.',
        'La patte recouvre les dents et les deux piqûres du côté dessous.',
        'Épinglez la patte au ruban de la fermeture dessous, à travers toutes les épaisseurs.',
      ],
    },
    {
      title: 'Piquer la patte',
      text: "Au pied fermeture éclair, piquez le long de la patte et en travers en bas, sous l'arrêt, en pivotant au coin aiguille piquée, à travers toutes les épaisseurs. Restez assez loin pour éviter les dents et le curseur.",
      details: [
        "Piquez le long de la patte et en travers en bas, sous l'arrêt, à travers toutes les épaisseurs : assez loin pour éviter les dents et le curseur.",
        "Au coin, arrêtez-vous aiguille piquée, relevez le pied, tournez l'ouvrage et continuez.",
        "Ne piquez jamais sur l'arrêt.",
      ],
    },
    {
      title: 'Découdre le bâti',
      text: 'Décousez le bâti sur la fermeture et repassez. La patte reste sur la fermeture, et une seule piqûre se voit.',
      details: [
        'Décousez les points du bâti sur la fermeture éclair.',
        "Repassez sur l'endroit : la patte recouvre la fermeture, seule sa propre piqûre se voit.",
      ],
    },
  ],
  legend: [
    { title: 'Tissu', text: 'deux pièces assemblées par une couture · le pli de la patte sur la ligne de couture' },
    { title: 'Piqûre', text: "une seule : le long de la patte et en travers sous l'arrêt" },
    { title: 'Couture', text: "sous la fermeture, avec un point d'arrêt au repère" },
    { title: 'Fermeture éclair', text: 'sous la patte, piquée deux fois à la valeur de couture du côté dessous' },
  ],
};

/* Fermeture éclair en sandwich (tuto « Coudre une fermeture éclair », section `lined`) — textes français. Même
   forme que l'anglais (zipper-lined.text.js le vérifie). vous ; cm seulement, virgule décimale, espace insécable
   avant cm et avant : ; ! ? ; seulement les chiffres de la créatrice (la trousse) : 20, 23, 0,5 cm. Pas de
   surpiqûre le long de la fermeture éclair ; aucun pied presseur nommé (spécification 3.2). « zip » seulement
   dans les étiquettes courtes du dessin (comme pour la trousse). */
export default {
  ui: {
    fig: 'Fig. 1',
    title: 'Fermeture éclair en sandwich',
    svgLabel: "Un dessin isométrique pour coudre la fermeture éclair d'une trousse doublée : l'extérieur, la fermeture éclair de 20 cm endroit dessous et la doublure endroit dessous, cousus d'une seule couture à 0,5 cm ; la doublure rabattue, l'extérieur et la doublure pliés en deux, l'autre côté de la fermeture éclair cousu de la même façon, et la fermeture éclair ouverte.",
    prev: 'Étape précédente',
    dot: (i, title) => (i ? `Étape ${i} : ${title}` : title),
    start: 'Étapes →',
    next: 'Suivant →',
    overview: "Vue d'ensemble",
    stepOf: (k, n) => `Étape ${k} sur ${n}`,
    machine: (stitch) => `Machine : ${stitch.toLowerCase()}`,
    inThisStep: 'Pour cette étape',
    takeApart: 'Fermer le zip',
    putTogether: 'Ouvrir le zip',
    replay: '↻ Revoir',
    parts: 'Pièces',
    allSteps: 'Instructions étape par étape',
    endView: 'VUE EN COUPE',
  },
  stitches: { straight: 'Point droit' },
  labels: {
    outerUp: 'extérieur, endroit dessus',
    zipperDown: 'zip endroit dessous',
    cm20: '20 cm',
    cm23: '23 cm',
    endsShort: 'bouts avant les bords',
    liningDown: 'doublure endroit dessous',
    edgesLevel: 'bord à bord',
    seam05: 'couture 0,5 cm',
    liningOut: 'rabattre la doublure',
    foldBoth: 'plier les deux en deux',
    otherEnds: 'les autres bords au zip',
    otherSide: "l'autre côté",
    openZipper: 'ouvrir le zip',
    readySides: 'place aux coutures de côté',
  },
  steps: [
    {
      title: 'Fermeture éclair en sandwich',
      text: "La fermeture éclair de la trousse, cousue : l'extérieur d'un côté, la doublure de l'autre, une couture de chaque côté de la fermeture éclair — et elle est ouverte, prête pour les coutures de côté. Touchez pour la fermer.",
    },
    {
      title: "Le zip sur l'extérieur",
      text: "Posez l'extérieur endroit dessus. Posez la fermeture éclair de 20 cm endroit dessous le long de son côté de 23 cm, au milieu : ses bouts s'arrêtent avant les bords de côté.",
      details: [
        "Posez l'extérieur endroit dessus.",
        "Posez la fermeture éclair endroit dessous le long d'un côté de 23 cm, son bord sur le bord du tissu.",
        "Centrez-la : la fermeture éclair de 20 cm est plus courte que le côté, ses bouts s'arrêtent donc avant les bords de côté et restent hors des coutures de côté.",
      ],
    },
    {
      title: 'La doublure par-dessus',
      text: "Posez la doublure par-dessus, endroit dessous, bord à bord avec l'extérieur. La fermeture éclair est maintenant entre les deux.",
      details: [
        'Posez la doublure endroit dessous sur la fermeture éclair.',
        "Son bord tombe pile sur le bord de l'extérieur : extérieur, fermeture éclair, doublure — trois épaisseurs.",
        'Maintenez les épaisseurs avec des pinces à tissu.',
      ],
    },
    {
      title: 'Coudre le premier côté',
      text: 'Cousez à travers toutes les épaisseurs, à 0,5 cm du bord.',
      details: [
        "Cousez ensemble l'extérieur, la fermeture éclair et la doublure, à 0,5 cm du bord.",
        'Pas de surpiqûre le long de la fermeture éclair.',
      ],
    },
    {
      title: 'Rabattre et plier',
      text: "Rabattez la doublure à l'écart de la fermeture éclair. Pliez l'extérieur en deux et la doublure en deux, pour que leurs autres petits côtés rejoignent l'autre côté de la fermeture éclair.",
      details: [
        "Rabattez la doublure à l'écart de la fermeture éclair : l'extérieur d'un côté, la doublure de l'autre.",
        "Pliez l'extérieur en deux, endroit contre endroit, et la doublure de la même façon.",
        "Leurs autres petits côtés rejoignent maintenant l'autre côté de la fermeture éclair : extérieur, fermeture éclair endroit dessous, doublure — comme la première fois.",
      ],
    },
    {
      title: 'Coudre le deuxième côté',
      text: "Cousez l'autre côté de la fermeture éclair de la même façon, à 0,5 cm du bord. L'extérieur et la doublure forment maintenant un anneau.",
      details: [
        'Maintenez les épaisseurs avec des pinces à tissu et cousez-les toutes, à 0,5 cm du bord.',
        "L'extérieur et la doublure forment maintenant un anneau, reliés des deux côtés par la fermeture éclair.",
      ],
    },
    {
      title: 'Ouvrir la fermeture éclair',
      text: "Ouvrez la fermeture éclair avant les coutures de côté : c'est par elle qu'on retournera la trousse.",
      details: [
        "Faites glisser le curseur jusqu'à l'autre bout : la fermeture éclair est ouverte.",
        'Laissez-la ouverte : viennent ensuite les coutures de côté, et la trousse se retourne par la fermeture éclair.',
        'Les coutures de côté et le retournement sont sur la page de la trousse — le lien est sous ce dessin.',
      ],
    },
  ],
  legend: [
    { title: 'Extérieur', text: 'coton · son côté de 23 cm va à la fermeture éclair' },
    { title: 'Fermeture éclair', text: '20 cm · au milieu du côté de 23 cm, ses bouts avant les bords de côté' },
    { title: 'Doublure', text: "de la même taille que l'extérieur" },
    { title: 'Coutures', text: '0,5 cm, une de chaque côté de la fermeture éclair · sans surpiqûre' },
  ],
};

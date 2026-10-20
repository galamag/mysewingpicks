/* Coins carrés (en triangle) (guide « Fond de sac », section `boxed`) — textes français. Même forme que
   l'anglais (bottom-boxed.text.js le vérifie). Aucun chiffre : la section n'a pas encore de projet de la
   couturière ; la règle des sources en mots seulement (ligne en travers = largeur du fond, à la moitié de
   la largeur du fond depuis la fin de la couture, pointe coupée en laissant une petite marge). Vouvoiement ;
   espace insécable avant : ; ! ? */
export default {
  ui: {
    fig: 'Fig. 3',
    title: 'Coins carrés (en triangle)',
    svgLabel: "Un dessin isométrique pour faire des coins carrés : le sac cousu sur les côtés et au fond, chaque coin du bas ouvert en triangle, la couture de côté sur la couture du fond, une ligne tracée en travers à la moitié de la largeur du fond depuis la fin de la couture, puis cousue, la pointe coupée en laissant une petite marge, et le sac retourné, avec un fond plat.",
    prev: 'Étape précédente',
    dot: (i, title) => (i ? `Étape ${i} : ${title}` : title),
    start: 'Étapes →',
    next: 'Suivant →',
    overview: "Vue d'ensemble",
    stepOf: (k, n) => `Étape ${k} sur ${n}`,
    machine: (stitch) => `Machine : ${stitch.toLowerCase()}`,
    inThisStep: 'Pour cette étape',
    takeApart: 'Remettre debout',
    putTogether: 'Voir le dessous',
    replay: '↻ Revoir',
    parts: 'Pièces',
    allSteps: 'Instructions étape par étape',
    endView: 'VUE EN COUPE',
  },
  stitches: { straight: 'Point droit' },
  labels: {
    rightSides: 'endroit contre endroit',
    sidesBottom: 'côtés et fond',
    aPouch: 'une poche plate',
    standUp: "poser à l'envers",
    openCorner: 'ouvrir le coin',
    seamOnSeam: 'couture sur couture',
    triangle: 'un triangle',
    seamEnd: 'fin de la couture',
    halfBase: 'demi-largeur du fond',
    baseWidth: 'largeur du fond',
    sewLine: 'coudre sur la ligne',
    backstitch: "point d'arrêt",
    bothCorners: 'les deux coins',
    trimTip: 'couper la pointe',
    smallAllowance: 'une petite marge',
    turnOut: "retourner sur l'endroit",
    flatBottom: 'un fond plat',
    cornerSeam: 'couture du coin',
  },
  steps: [
    {
      title: 'Coins carrés (en triangle)',
      text: "Le fond du sac, le sac à l'envers : un fond plat, avec la couture du fond au milieu et une courte couture en travers à chaque bout, là où la couture de côté la rejoint. Touchez le sac pour le remettre debout.",
    },
    {
      title: 'Coudre le sac',
      text: 'Posez le devant sur le dos, endroit contre endroit, et cousez les côtés et le fond : une poche plate, sans rien découper dans les coins.',
      details: [
        'Posez le devant sur le dos, endroit contre endroit, et maintenez-les avec des pinces.',
        'Cousez les deux côtés et le fond.',
        'On ne découpe rien dans les coins : le fond se forme aux étapes suivantes.',
        "Si le sac est une seule pièce pliée au fond, il n'y a pas de couture de fond : la couture de côté va alors sur la pliure du fond.",
      ],
    },
    {
      title: 'Ouvrir le coin',
      text: 'Écartez le devant et le dos à un coin du bas et aplatissez-le pour que la couture de côté tombe exactement sur la couture du fond : le coin devient un triangle.',
      details: [
        'Écartez le devant et le dos à un coin du bas.',
        'Aplatissez le coin pour que la couture de côté tombe exactement sur la couture du fond (ou sur la pliure du fond).',
        "Le coin est maintenant un triangle, la couture en son milieu jusqu'à sa pointe, où se trouve la fin de la couture.",
        "Ouvrez l'autre coin du bas de la même façon.",
        "Sur le dessin, le sac est posé à l'envers sur son ouverture, pour que les deux coins soient visibles.",
      ],
    },
    {
      title: 'Tracer la ligne',
      text: 'Tracez une ligne en travers du triangle, à angle droit avec la couture, à la moitié de la largeur du fond depuis la fin de la couture. La ligne est alors aussi longue que le fond est large.',
      details: [
        'Choisissez la largeur du fond que vous voulez.',
        'Mesurez la moitié de la largeur du fond le long de la couture, depuis la fin de la couture, là où les coutures se rejoignent à la pointe — et non depuis la pointe du tissu.',
        'Tracez là une ligne en travers du triangle, à angle droit avec la couture. Elle est aussi longue que le fond est large.',
        "Plus la ligne est loin de la pointe, plus le fond est large. Tracez l'autre coin de la même façon.",
      ],
    },
    {
      title: 'Coudre sur la ligne',
      text: "Cousez sur la ligne tracée, avec un point d'arrêt au début et à la fin.",
      details: [
        "Cousez sur la ligne, d'un bord du triangle à l'autre.",
        "Faites un point d'arrêt au début et à la fin pour que la couture tienne.",
        "Cousez l'autre coin de la même façon.",
      ],
    },
    {
      title: 'Couper la pointe',
      text: 'Coupez la pointe de chaque triangle en laissant une petite marge au-delà de la couture.',
      details: [
        'Coupez la pointe le long de la couture, en laissant une petite marge de couture.',
        'Ne coupez pas dans la couture.',
        'Faites tous les coins du bas de la même façon, et aussi ceux de la doublure si le sac en a une.',
      ],
    },
    {
      title: 'Retourner',
      text: "Retournez le sac sur l'endroit : il a un fond plat, avec une courte couture de coin en travers à chaque bout.",
      details: [
        "Retournez le sac sur l'endroit et poussez bien les coins.",
        'Le fond est plat et aussi large que la ligne était longue. À chaque bout, la couture de côté arrive au milieu de la couture du coin.',
      ],
    },
  ],
  legend: [
    { title: 'Fond', text: 'plat · aussi large que les coutures de coin sont longues' },
    { title: 'Couture du fond', text: 'assemble le devant et le dos · au milieu du fond' },
    { title: 'Coutures de coin', text: 'cousues en travers du coin, à la moitié de la largeur du fond depuis la fin de la couture' },
    { title: 'Coutures de côté', text: "chacune arrive au milieu d'une couture de coin" },
  ],
};

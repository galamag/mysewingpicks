/* Fermeture éclair encastrée sur un sac cabas (tuto « Coudre une fermeture éclair », section `recessed`) — textes
   français. Même forme que les textes anglais (zipper-recessed.text.js le vérifie). Vouvoiement ; espace insécable
   ( ) avant : ; ! ? » et après «. « Bande » = une bande de tissu de la bande de fermeture ; « languette » =
   l'extrémité finie ; « arrêt » = l'arrêt métallique. Aucun chiffre, aucune unité : la largeur des bandes et la longueur
   de la fermeture en mots. La bande se coud à la DOUBLURE, pas à l'extérieur. Pied : le pied fermeture éclair (lot
   Windman). */
export default {
  ui: {
    fig: 'Fig. 3',
    title: 'Fermeture éclair encastrée',
    svgLabel: "Dessin isométrique d'une fermeture éclair encastrée en haut d'un sac doublé : quatre bandes aussi longues que le haut du sac, chaque ruban de la fermeture cousu entre deux d'entre elles, endroit contre endroit, retournées et surpiquées près des dents ; les extrémités finies avec des languettes de tissu ; la bande cousue à la doublure, milieu sur milieu. Dans le sac, la fermeture est sous le bord, et le sac s'ouvre en grand.",
    prev: 'Étape précédente',
    dot: (i, title) => (i ? `Étape ${i} : ${title}` : title),
    start: 'Étapes →',
    next: 'Suivant →',
    overview: "Vue d'ensemble",
    stepOf: (k, n) => `Étape ${k} sur ${n}`,
    machine: (stitch) => `Machine : ${stitch.toLowerCase()}`,
    inThisStep: 'Pour cette étape',
    takeApart: 'Ouvrir la fermeture',
    putTogether: 'Fermer la fermeture',
    replay: '↻ Revoir',
    parts: 'Pièces',
    allSteps: 'Instructions étape par étape',
    endView: 'VUE EN COUPE',
  },
  stitches: { straight: 'Point droit' },
  labels: {
    fourStrips: 'quatre bandes',
    topLength: 'aussi longue que le haut',
    zipperLonger: 'fermeture un peu plus longue',
    stripUp: 'bande endroit dessus',
    zipperDown: 'zip endroit dessous',
    stripDown: 'deuxième bande endroit dessous',
    alongEdge: 'le long du bord',
    turnOut: 'retourner',
    pressAway: 'repasser loin des dents',
    nearTeeth: 'près des dents',
    otherSide: "l'autre côté, pareil",
    endsTabs: 'bouts : comme la deuxième façon',
    notOverStop: "pas sur l'arrêt",
    toLining: 'à la doublure',
    middles: 'milieu sur milieu',
    asUsual: "puis assembler comme d'habitude",
    belowEdge: 'sous le bord',
    opensWide: "s'ouvre en grand",
  },
  steps: [
    {
      title: 'Fermeture éclair encastrée sur un sac cabas',
      text: "La fermeture éclair est dans une bande sous le haut du sac, et la bande est cousue à la doublure. Touchez pour ouvrir la fermeture : le sac s'ouvre en grand.",
    },
    {
      title: 'Quatre bandes et une fermeture',
      text: 'Coupez quatre bandes aussi longues que le haut du sac, deux pour chaque côté de la fermeture, et une fermeture éclair un peu plus longue que les bandes.',
      details: [
        'Coupez quatre bandes de tissu aussi longues que le haut du sac : deux pour chaque côté de la fermeture.',
        'La largeur des bandes change selon les patrons : plus elles sont larges, plus la fermeture est basse dans le sac.',
        "Beaucoup de patrons thermocollent de l'entoilage sur les bandes, pour que la bande de fermeture garde sa forme.",
      ],
    },
    {
      title: 'Entre deux bandes',
      text: 'Posez une bande endroit dessus, la fermeture endroit dessous par-dessus, bord à bord, et la deuxième bande endroit dessous sur le tout : endroit contre endroit.',
      details: [
        'Posez une bande endroit dessus.',
        'Posez la fermeture endroit dessous par-dessus, le bord du ruban sur le grand bord de la bande.',
        'Posez la deuxième bande endroit dessous sur le tout, bords alignés : le ruban de la fermeture est maintenant entre deux bandes, endroit contre endroit. Maintenez les couches avec des pinces.',
      ],
    },
    {
      title: 'Piquer le long du bord',
      text: 'Avec le pied fermeture éclair, piquez le long du bord à travers les trois couches : la bande, le ruban de la fermeture et la deuxième bande.',
      details: [
        'Montez le pied fermeture éclair : il permet de piquer près des dents.',
        'Piquez le long du grand bord, à travers les deux bandes et le ruban de la fermeture.',
        'La couture reste sur le ruban, à côté des dents, pas dessus.',
      ],
    },
    {
      title: 'Retourner et repasser',
      text: 'Rabattez les bandes loin de la fermeture, envers contre envers, et repassez-les en les éloignant des dents.',
      details: [
        "Rabattez les bandes loin de la fermeture : la fermeture est maintenant à côté d'elles, endroit dessus.",
        'Les deux bandes sont envers contre envers, la couture cachée entre elles.',
        'Repassez les bandes en les éloignant des dents, pour que le tissu ne se prenne pas dans la fermeture.',
      ],
    },
    {
      title: 'Surpiquer près des dents',
      text: 'Avec le pied fermeture éclair, surpiquez la bande près des dents, à travers les deux bandes.',
      details: [
        'Avec le pied fermeture éclair, surpiquez le bord de la bande côté fermeture, près des dents.',
        'La surpiqûre tient les deux bandes bien à plat et garde le tissu loin des dents.',
      ],
    },
    {
      title: "L'autre côté",
      text: "Cousez l'autre ruban de la fermeture entre les deux autres bandes de la même façon, avec le pied fermeture éclair : piquer, retourner, repasser, surpiquer.",
      details: [
        "Posez les deux autres bandes endroit contre endroit autour de l'autre ruban et piquez le long du bord avec le pied fermeture éclair.",
        'Retournez-les, repassez-les en les éloignant des dents et surpiquez près des dents.',
        'La bande de fermeture est prête : la fermeture au milieu, deux bandes de chaque côté.',
      ],
    },
    {
      title: 'Finir les extrémités',
      text: "Finissez les deux extrémités de la fermeture avec des languettes de tissu, comme dans la deuxième façon, « Extrémités finies (languettes) » : piquées juste après chaque arrêt, jamais dessus.",
      details: [
        "Préparez deux languettes de tissu et glissez-les sur les extrémités de la fermeture, comme dans la deuxième façon, « Extrémités finies (languettes) ».",
        "Avec le pied fermeture éclair, piquez chaque languette juste après l'arrêt, pas sur l'arrêt : il est souvent en métal, et l'aiguille peut casser.",
      ],
    },
    {
      title: 'À la doublure',
      text: "Cousez la bande de fermeture à la doublure, pas à l'extérieur : chaque grand bord de la bande au haut d'une pièce de doublure, endroit contre endroit, milieu sur milieu.",
      details: [
        'Marquez le milieu des grands bords de la bande de fermeture et du haut des pièces de doublure.',
        "Posez un grand bord de la bande sur le haut d'une pièce de doublure, endroit contre endroit, milieu sur milieu, et maintenez avec des pinces.",
        "Piquez le long du bord. Cousez l'autre grand bord à l'autre pièce de doublure de la même façon.",
        "La bande va sur la doublure, pas sur l'extérieur : elle se retrouve ainsi à l'intérieur du sac, sous le bord.",
      ],
    },
    {
      title: 'Le sac',
      text: "Ensuite, l'extérieur et la doublure s'assemblent par le haut comme d'habitude pour un sac doublé. La fermeture est sous le bord, et le sac s'ouvre en grand.",
      details: [
        "Assemblez l'extérieur et la doublure par le haut comme d'habitude pour un sac doublé ; la bande de fermeture suit la doublure.",
        'La fermeture est sous le bord du sac.',
        "Ouverte, la bande retombe contre les côtés, et le sac s'ouvre en grand.",
      ],
    },
  ],
  legend: [
    { title: 'Bande de fermeture', text: 'quatre bandes aussi longues que le haut du sac · la fermeture au milieu' },
    { title: 'Fermeture éclair', text: 'un peu plus longue que les bandes · les extrémités finies avec des languettes' },
    { title: 'Doublure', text: 'la bande y est cousue' },
    { title: 'Extérieur', text: "assemblé à la doublure comme d'habitude" },
  ],
};

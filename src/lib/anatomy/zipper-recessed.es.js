/* Cremallera en el borde del bolso (tutorial «Cómo coser una cremallera», sección `recessed`) — textos en español. La
   misma forma que los textos en inglés (zipper-recessed.text.js lo comprueba). Tuteo, español neutro; «tira» = una tira
   de tela de la tira de la cremallera; «lengüeta» = el extremo rematado; «tope» = el tope metálico. Nunca «cierre» (solo
   una vez, en el h1). Ningún número ni unidad: el ancho de las tiras y el largo de la cremallera, con palabras. La tira
   va en el FORRO, no en el exterior. Prensatelas: el prensatelas para cremalleras (juego Windman). */
export default {
  ui: {
    fig: 'Fig. 3',
    title: 'Cremallera en el borde',
    svgLabel: 'Dibujo isométrico de cómo se cose una cremallera en el borde de un bolso con forro: cuatro tiras tan largas como el borde del bolso, cada cinta de la cremallera cosida entre dos de ellas, derecho con derecho, volteadas y pespunteadas cerca de los dientes; los extremos rematados con lengüetas de tela; la tira cosida al forro, haciendo coincidir los centros. En el bolso la cremallera queda por debajo del borde, y el bolso se abre bien.',
    prev: 'Paso anterior',
    dot: (i, title) => (i ? `Paso ${i}: ${title}` : title),
    start: 'Pasos →',
    next: 'Siguiente →',
    overview: 'Vista general',
    stepOf: (k, n) => `Paso ${k} de ${n}`,
    machine: (stitch) => `Máquina: ${stitch.toLowerCase()}`,
    inThisStep: 'En este paso',
    takeApart: 'Abrir la cremallera',
    putTogether: 'Cerrar la cremallera',
    replay: '↻ Repetir',
    parts: 'Piezas',
    allSteps: 'Instrucciones paso a paso',
    endView: 'CORTE',
  },
  stitches: { straight: 'Puntada recta' },
  labels: {
    fourStrips: 'cuatro tiras',
    topLength: 'tan larga como el borde',
    zipperLonger: 'cremallera un poco más larga',
    stripUp: 'tira derecho arriba',
    zipperDown: 'cremallera boca abajo',
    stripDown: 'segunda tira boca abajo',
    alongEdge: 'por el borde',
    turnOut: 'voltear',
    pressAway: 'planchar lejos de los dientes',
    nearTeeth: 'cerca de los dientes',
    otherSide: 'el otro lado, igual',
    endsTabs: 'extremos: como la segunda forma',
    notOverStop: 'no sobre el tope',
    toLining: 'al forro',
    middles: 'centros que coinciden',
    asUsual: 'luego exterior y forro, como siempre',
    belowEdge: 'por debajo del borde',
    opensWide: 'se abre bien',
  },
  steps: [
    {
      title: 'Cremallera en el borde del bolso',
      text: 'La cremallera va en una tira por debajo del borde del bolso, y la tira está cosida al forro. Toca para abrir la cremallera: el bolso se abre bien.',
    },
    {
      title: 'Cuatro tiras y una cremallera',
      text: 'Corta cuatro tiras tan largas como el borde del bolso, dos para cada lado de la cremallera, y una cremallera un poco más larga que las tiras.',
      details: [
        'Corta cuatro tiras de tela tan largas como el borde del bolso: dos para cada lado de la cremallera.',
        'El ancho de las tiras cambia según el patrón: cuanto más anchas, más abajo queda la cremallera en el bolso.',
        'Muchos patrones planchan entretela termoadhesiva sobre las tiras, para que la tira de la cremallera mantenga su forma.',
      ],
    },
    {
      title: 'Entre dos tiras',
      text: 'Pon una tira con el derecho hacia arriba, la cremallera boca abajo encima, borde con borde, y la segunda tira boca abajo arriba de todo: derecho con derecho.',
      details: [
        'Pon una tira con el derecho hacia arriba.',
        'Pon encima la cremallera boca abajo, con el borde de la cinta sobre el borde largo de la tira.',
        'Pon arriba de todo la segunda tira boca abajo, con los bordes parejos: la cinta de la cremallera queda entre dos tiras, derecho con derecho. Sujeta las capas con clips.',
      ],
    },
    {
      title: 'Coser por el borde',
      text: 'Con el prensatelas para cremalleras, cose por el borde a través de las tres capas: la tira, la cinta de la cremallera y la segunda tira.',
      details: [
        'Pon el prensatelas para cremalleras: con él coses cerca de los dientes.',
        'Cose por el borde largo, a través de las dos tiras y la cinta de la cremallera.',
        'La costura queda sobre la cinta, junto a los dientes, no encima de ellos.',
      ],
    },
    {
      title: 'Voltear y planchar',
      text: 'Dobla las tiras hacia fuera de la cremallera, revés con revés, y plánchalas alejándolas de los dientes.',
      details: [
        'Dobla las tiras hacia fuera de la cremallera: ahora la cremallera queda al lado, con el derecho hacia arriba.',
        'Las dos tiras quedan revés con revés, con la costura escondida entre ellas.',
        'Plancha las tiras alejándolas de los dientes, para que la tela no se meta en la cremallera.',
      ],
    },
    {
      title: 'Pespuntear cerca de los dientes',
      text: 'Con el prensatelas para cremalleras, pespuntea la tira cerca de los dientes, a través de las dos tiras.',
      details: [
        'Con el prensatelas para cremalleras, pespuntea el borde de la tira junto a la cremallera, cerca de los dientes.',
        'El pespunte mantiene planas las dos tiras y aleja la tela de los dientes.',
      ],
    },
    {
      title: 'El otro lado',
      text: 'Cose la otra cinta de la cremallera entre las otras dos tiras de la misma forma, con el prensatelas para cremalleras: coser, voltear, planchar y pespuntear.',
      details: [
        'Pon las otras dos tiras derecho con derecho alrededor de la otra cinta y cose por el borde con el prensatelas para cremalleras.',
        'Voltéalas, plánchalas alejándolas de los dientes y pespuntea cerca de los dientes.',
        'La tira de la cremallera está lista: la cremallera en el centro, dos tiras a cada lado.',
      ],
    },
    {
      title: 'Rematar los extremos',
      text: 'Remata los dos extremos de la cremallera con lengüetas de tela, como en la segunda forma, «Extremos rematados»: cosidas justo después de cada tope, nunca encima.',
      details: [
        'Prepara dos lengüetas de tela y colócalas sobre los extremos de la cremallera, como en la segunda forma, «Extremos rematados».',
        'Con el prensatelas para cremalleras, cose cada lengüeta justo después del tope, no sobre el tope: suele ser de metal, y la aguja se puede romper.',
      ],
    },
    {
      title: 'Al forro',
      text: 'Cose la tira de la cremallera al forro, no al exterior: cada borde largo de la tira al borde superior de una pieza de forro, derecho con derecho, haciendo coincidir los centros.',
      details: [
        'Marca los centros de los bordes largos de la tira y de los bordes superiores de las piezas de forro.',
        'Pon un borde largo de la tira sobre el borde superior de una pieza de forro, derecho con derecho, con los centros coincidiendo, y sujeta con clips.',
        'Cose por el borde. Cose el otro borde largo a la otra pieza de forro de la misma forma.',
        'La tira va en el forro, no en el exterior: así queda dentro del bolso, por debajo del borde.',
      ],
    },
    {
      title: 'El bolso',
      text: 'Luego el exterior y el forro se unen por el borde superior como siempre en un bolso con forro. La cremallera queda por debajo del borde, y el bolso se abre bien.',
      details: [
        'Une el exterior y el forro por el borde superior como siempre en un bolso con forro; la tira de la cremallera va junto con el forro.',
        'La cremallera queda por debajo del borde superior del bolso.',
        'Abierta, la tira cae contra los lados, y el bolso se abre bien.',
      ],
    },
  ],
  legend: [
    { title: 'Tira', text: 'cuatro tiras tan largas como el borde del bolso · la cremallera en el centro' },
    { title: 'Cremallera', text: 'un poco más larga que las tiras · extremos rematados con lengüetas' },
    { title: 'Forro', text: 'la tira está cosida a él' },
    { title: 'Exterior', text: 'unido al forro como siempre' },
  ],
};

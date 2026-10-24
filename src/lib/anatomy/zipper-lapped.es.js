/* Cremallera con solapa (tutorial «Cómo coser una cremallera», sección `lapped`) — textos en español. La misma forma
   que el inglés (lo comprueba zipper-lapped.text.js). Sin números ni unidades: el lado de abajo doblado «un poco más
   estrecho que el margen», el pespunte «lo bastante lejos para no tocar los dientes ni el tirador», el hilván «con la
   puntada más larga». El sentido del pespunte y dónde empieza no se dicen (las fuentes no coinciden). Se tutea. Nunca
   «cierre» aquí (una vez, en el h1, y basta). */
export default {
  ui: {
    fig: 'Fig. 5',
    title: 'Cremallera con solapa',
    svgLabel: 'Un dibujo isométrico de cómo coser una cremallera con solapa en una costura: la costura cosida hasta la marca del tope inferior, con remate, la abertura hilvanada con la puntada más larga y la costura abierta con la plancha; en el lado de abajo el margen doblado un poco más estrecho, el doblez junto a los dientes, pespunteado a lo largo del doblez a través del margen y la cinta de la cremallera; la solapa sobre la cremallera, con su doblez en la línea de costura, cubre ese pespunte; pespunteada con el prensatelas para cremalleras a lo largo de la solapa y de lado a lado abajo, lejos de los dientes y del tirador; luego el hilván descosido. Se ve un solo pespunte.',
    prev: 'Paso anterior',
    dot: (i, title) => (i ? `Paso ${i}: ${title}` : title),
    start: 'Pasos →',
    next: 'Siguiente →',
    overview: 'Vista general',
    stepOf: (k, n) => `Paso ${k} de ${n}`,
    machine: (stitch) => `Máquina: ${stitch.toLowerCase()}`,
    inThisStep: 'En este paso',
    takeApart: 'Ver a través de la tela',
    putTogether: 'Volver a la tela',
    replay: '↻ Repetir',
    parts: 'Piezas',
    allSteps: 'Instrucciones paso a paso',
    endView: 'CORTE',
  },
  stitches: { straight: 'Puntada recta', basting: 'Puntada más larga' },
  labels: {
    rightSides: 'derecho con derecho',
    markStop: 'marca el tope inferior',
    toMark: 'costura hasta la marca',
    backstitch: 'remata',
    baste: 'hilvana: puntada más larga',
    openOut: 'abre',
    wrongUp: 'revés hacia arriba',
    pressOpen: 'abre la costura con la plancha',
    rightUp: 'derecho hacia arriba',
    foldBack: 'dobla la solapa hacia atrás',
    narrower: 'un poco más estrecho que el margen',
    faceUp: 'cremallera boca arriba',
    besideTeeth: 'el doblez junto a los dientes',
    alongFold: 'pespuntea junto al doblez',
    allowanceOnly: 'solo margen y cinta',
    overlapBack: 'la solapa de vuelta',
    covers: 'cubre el pespunte',
    belowStop: 'de lado a lado, bajo el tope',
    pivot: 'gira, aguja abajo',
    clearTeeth: 'lejos de dientes y tirador',
    unpick: 'descose el hilván',
    oneLine: 'se ve un solo pespunte',
  },
  steps: [
    {
      title: 'Cremallera con solapa',
      text: 'Un lado de la costura, la solapa, cubre la cremallera: su borde doblado queda en la línea de costura, y se ve un solo pespunte, a lo largo de ese lado y de lado a lado abajo. Toca para ver a través de la tela.',
    },
    {
      title: 'Derecho con derecho',
      text: 'Pon las dos piezas derecho con derecho. Coloca la cremallera a lo largo de la línea de costura y marca dónde está su tope inferior: ahí termina la abertura para la cremallera.',
      details: [
        'Primero sobrehíla los bordes de la costura, para que no se deshilachen.',
        'Pon las dos piezas derecho con derecho, los bordes parejos, y sujétalas con clips.',
        'Coloca la cremallera a lo largo de la línea de costura y marca la línea de costura en su tope inferior: ahí termina la abertura para la cremallera.',
      ],
    },
    {
      title: 'La costura hasta la marca',
      text: 'Cose la costura con la puntada normal hasta la marca y remata ahí, para que la costura aguante donde termina la cremallera.',
      details: [
        'Cose la costura con la puntada normal, sobre la línea de costura, hasta la marca.',
        'Remata en la marca: donde termina la cremallera, la costura no debe abrirse.',
      ],
    },
    {
      title: 'Hilvana la abertura',
      text: 'Pon la puntada más larga y cierra la abertura sobre la misma línea de costura, entre la marca y el borde superior. Este hilván se descose al final.',
      details: [
        'Pon en la máquina la puntada más larga: es un hilván, después se descose.',
        'Cierra la abertura sobre la misma línea de costura, entre la marca y el borde superior.',
        'El hilván mantiene los dos lados de la abertura en la línea de costura mientras coses la cremallera.',
      ],
    },
    {
      title: 'Abre la costura con la plancha',
      text: 'Abre las piezas, ponlas con el revés hacia arriba y abre los márgenes de costura con la plancha, uno a cada lado, a lo largo de toda la costura.',
      details: [
        'Abre las piezas y ponlas con el revés hacia arriba.',
        'Abre los márgenes de costura con la plancha, uno a cada lado, a lo largo de toda la costura, también la parte hilvanada.',
      ],
    },
    {
      title: 'Dobla la solapa hacia atrás',
      text: 'Da la vuelta a la pieza, con el derecho hacia arriba. Un lado de la abertura, la solapa, cubrirá la cremallera; el otro, el lado de abajo, queda debajo de ella. Dobla la solapa hacia atrás para que no estorbe: el hilván la sujeta en la línea de costura.',
      details: [
        'Da la vuelta a la pieza, con el derecho hacia arriba.',
        'Elige la solapa: el lado que cubrirá la cremallera. El otro lado es el lado de abajo.',
        'Dobla la solapa sobre el lado de abajo, para que no quede atrapada en el pespunte siguiente.',
      ],
    },
    {
      title: 'El lado de abajo y la cremallera',
      text: 'En el lado de abajo, dobla el margen un poco más estrecho que el margen de costura, para que el doblez quede justo pasada la línea de costura. Mete debajo la cremallera boca arriba, el doblez junto a los dientes, y prende con alfileres.',
      details: [
        'Dobla el margen del lado de abajo un poco más estrecho que el margen de costura y plancha: el doblez queda justo pasada la línea de costura.',
        'Mete la cremallera boca arriba bajo el doblez, los dientes justo al lado, el tope inferior en la marca.',
        'Prende el doblez a la cinta de la cremallera con alfileres.',
      ],
    },
    {
      title: 'Pespuntea junto al doblez',
      text: 'Con el prensatelas para cremalleras, pespuntea muy cerca del doblez, solo a través del margen y la cinta de la cremallera, a lo largo de toda la cremallera, pero nunca sobre el tope inferior.',
      details: [
        'Pon el prensatelas para cremalleras: con él la aguja cose cerca de la cremallera.',
        'Pespuntea muy cerca del doblez, solo a través del margen y la cinta de la cremallera: la solapa sigue doblada hacia atrás.',
        'Pespuntea a lo largo de toda la cremallera, pero nunca sobre el tope inferior.',
      ],
    },
    {
      title: 'La solapa sobre la cremallera',
      text: 'Vuelve a poner la solapa sobre la cremallera, su borde doblado en la línea de costura: cubre los dientes y el pespunte junto al doblez. Préndela a través de todas las capas.',
      details: [
        'Vuelve a poner la solapa sobre la cremallera: el hilván mantiene su borde doblado en la línea de costura.',
        'La solapa cubre los dientes y el pespunte junto al doblez del lado de abajo.',
        'Prende la solapa a la cinta de la cremallera de debajo, a través de todas las capas.',
      ],
    },
    {
      title: 'Pespuntea la solapa',
      text: 'Con el prensatelas para cremalleras, pespuntea a lo largo de la solapa y de lado a lado abajo, bajo el tope, girando en la esquina con la aguja abajo, a través de todas las capas. Mantente lo bastante lejos para no tocar los dientes ni el tirador.',
      details: [
        'Pespuntea a lo largo de la solapa, siempre a la misma distancia de su borde doblado: lo bastante lejos para no tocar los dientes ni el tirador.',
        'Pespuntea de lado a lado abajo, bajo el tope: nunca sobre el tope.',
        'En la esquina, para con la aguja abajo en la tela, levanta el prensatelas, gira la pieza y sigue.',
      ],
    },
    {
      title: 'Descose el hilván',
      text: 'Descose el hilván sobre la cremallera y plancha. La solapa queda sobre la cremallera, y se ve un solo pespunte.',
      details: [
        'Descose las puntadas del hilván sobre la cremallera.',
        'Plancha por el derecho: la solapa cubre la cremallera, solo se ve su propio pespunte.',
      ],
    },
  ],
  legend: [
    { title: 'Tela', text: 'dos piezas unidas por una costura · el borde doblado de la solapa en la línea de costura' },
    { title: 'Pespunte', text: 'uno solo: a lo largo de la solapa y de lado a lado bajo el tope' },
    { title: 'Costura', text: 'debajo de la cremallera, rematada en la marca' },
    { title: 'Cremallera', text: 'bajo la solapa, cosida al lado de abajo junto a su doblez' },
  ],
};

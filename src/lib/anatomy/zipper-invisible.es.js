/* Cremallera invisible (tutorial «Cómo coser una cremallera», sección `invisible`) — textos en español. Misma forma
   que el inglés (lo comprueba zipper-invisible.text.js). Sin números ni unidades. «De arriba abajo» se dice: todas las
   fuentes coinciden. El prensatelas para cremalleras invisibles se nombra, nunca con enlace. Se tutea. Nunca «cierre»
   aquí («cierre invisible» en España es de tejido). */
export default {
  ui: {
    fig: 'Fig. 6',
    title: 'Cremallera invisible',
    svgLabel: 'Un dibujo isométrico de cómo coser una cremallera invisible en una costura: la costura dejada abierta; la cremallera abierta y su espiral planchada por el revés con una plancha apenas tibia; la cremallera boca abajo sobre el derecho de una pieza, la espiral sobre la línea de costura, pespunteada con el prensatelas para cremalleras invisibles de arriba abajo hasta que el prensatelas tope con el tirador; el otro lado igual, la espiral en la otra ranura, los bordes de arriba igualados; la cremallera cerrada; la costura de abajo cosida con el prensatelas para cremalleras; los extremos de la cinta cosidos solo a los márgenes. Por fuera solo se ven la línea de costura y el tirador.',
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
  stitches: { straight: 'Puntada recta' },
  labels: {
    seamOpen: 'deja la costura abierta',
    zipperFirst: 'primero la cremallera',
    openZip: 'abre la cremallera',
    fromBack: 'espiral plana por el revés',
    coolIron: 'plancha apenas tibia',
    faceDown: 'cremallera boca abajo',
    coilOnSeam: 'espiral sobre la costura',
    oneGroove: 'espiral en una ranura',
    topDown: 'de arriba abajo',
    toPull: 'hasta que tope con el tirador',
    otherPiece: 'la otra pieza, derecho arriba',
    freeHalf: 'mitad libre boca abajo',
    topsLevel: 'bordes de arriba igualados',
    notTwisted: 'sin torcerla',
    otherGroove: 'espiral en la otra ranura',
    close: 'cierra la cremallera',
    rightSides: 'derecho con derecho',
    aboveSide: 'un poco más arriba, a un lado',
    zipperFoot: 'prensatelas para cremalleras',
    tapeEnds: 'solo a los márgenes',
    rightUp: 'derecho hacia arriba',
    onlyPull: 'solo costura y tirador',
  },
  steps: [
    {
      title: 'Cremallera invisible',
      text: 'Por fuera la cremallera no se ve: solo se ven la línea de costura y el tirador. Toca para ver a través de la tela.',
    },
    {
      title: 'Deja la costura abierta',
      text: 'Deja la costura abierta: primero se cose la cremallera invisible y después la costura de abajo.',
      details: [
        'No cosas la costura todavía: la cremallera va primero en los bordes abiertos.',
        'La costura de abajo se cose cuando la cremallera ya está puesta.',
      ],
    },
    {
      title: 'Plancha la espiral',
      text: 'Abre la cremallera. Por el revés, plancha la espiral para dejarla plana con una plancha apenas tibia.',
      details: [
        'Elige una cremallera invisible un poco más larga que la abertura.',
        'Abre la cremallera del todo.',
        'Dale la vuelta y plancha la espiral por el revés con una plancha apenas tibia: una plancha caliente derrite la espiral.',
      ],
    },
    {
      title: 'La cremallera boca abajo',
      text: 'Coloca la cremallera abierta boca abajo sobre el derecho de una pieza, la espiral justo sobre la línea de costura, y préndela.',
      details: [
        'Coloca una mitad de la cremallera abierta boca abajo sobre el derecho de una pieza.',
        'La espiral justo sobre la línea de costura, la cinta sobre el margen.',
        'Prende la cinta con alfileres.',
      ],
    },
    {
      title: 'El primer lado',
      text: 'Pon el prensatelas para cremalleras invisibles, con la espiral en una de sus ranuras. Pespuntea de arriba abajo hasta que el prensatelas tope con el tirador, y remata.',
      details: [
        'Pon el prensatelas para cremalleras invisibles: la espiral pasa por una de las dos ranuras de debajo.',
        'Pespuntea de arriba abajo, cerca de la espiral, hasta que el prensatelas tope con el tirador.',
        'Remata ahí.',
        'Mantén la espiral en la ranura: si el pespunte atrapa la espiral, la cremallera no cerrará.',
      ],
    },
    {
      title: 'El otro lado',
      text: 'Coloca la otra pieza con el derecho hacia arriba y gira la primera pieza encima, derecho con derecho, con su margen y la mitad cosida de la cremallera doblados hacia atrás. La mitad libre de la cremallera queda boca abajo sobre la otra pieza, la espiral sobre la línea de costura.',
      details: [
        'Coloca la otra pieza con el derecho hacia arriba.',
        'Gira la primera pieza encima, derecho con derecho, con su margen y la mitad cosida de la cremallera doblados hacia atrás.',
        'Coloca la mitad libre de la cremallera boca abajo sobre el derecho de la otra pieza, la espiral justo sobre la línea de costura.',
        'Iguala los bordes de arriba y las costuras transversales, si las hay, y coloca la cremallera sin torcerla. Préndela.',
      ],
    },
    {
      title: 'Pespuntea el otro lado',
      text: 'Con la espiral en la otra ranura del prensatelas para cremalleras invisibles, pespuntea de arriba abajo hasta que el prensatelas tope con el tirador, y remata.',
      details: [
        'Pon la espiral en la otra ranura del prensatelas.',
        'Pespuntea de arriba abajo, cerca de la espiral, hasta que el prensatelas tope con el tirador.',
        'Remata ahí. La espiral queda fuera del pespunte.',
      ],
    },
    {
      title: 'Cierra la cremallera',
      text: 'Cierra la cremallera: el tirador llega arriba del todo.',
      details: [
        'Cierra la cremallera del todo.',
        'Se desliza bien si la espiral no quedó atrapada en el pespunte.',
      ],
    },
    {
      title: 'La costura de abajo',
      text: 'Pon las piezas derecho con derecho y cambia al prensatelas para cremalleras. Cose la costura de abajo, empezando un poco más arriba y a un lado del final del pespunte de la cremallera.',
      details: [
        'Pon las piezas derecho con derecho, los bordes igualados.',
        'Cambia al prensatelas para cremalleras normal.',
        'Empieza un poco más arriba y a un lado del final del pespunte de la cremallera, y cose el resto de la costura.',
      ],
    },
    {
      title: 'Los extremos de la cinta',
      text: 'Abre los márgenes y cose los extremos de la cinta de la cremallera solo a los márgenes, no a las piezas.',
      details: [
        'Abre los márgenes.',
        'Cose cada extremo de la cinta solo a su propio margen, no a la pieza.',
      ],
    },
    {
      title: 'Derecho hacia arriba',
      text: 'Abre las piezas y dales la vuelta con el derecho hacia arriba. Por fuera solo se ven la línea de costura y el tirador.',
      details: [
        'Abre las piezas y dales la vuelta con el derecho hacia arriba.',
        'Por fuera solo se ven la línea de costura y el tirador.',
      ],
    },
  ],
  legend: [
    { title: 'Tela', text: 'dos piezas unidas en la línea de costura · ningún pespunte a la vista' },
    { title: 'Línea de costura', text: 'la espiral queda dentro · debajo de la cremallera, una costura normal' },
    { title: 'Cremallera', text: 'bajo la tela · la cinta cosida solo a los márgenes' },
    { title: 'Tirador', text: 'lo único que se ve de la cremallera' },
  ],
};

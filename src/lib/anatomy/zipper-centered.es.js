/* Cremallera centrada (tutorial «Cómo coser una cremallera», sección `centered`) — textos en español. La misma forma que
   el inglés (lo comprueba zipper-centered.text.js). Sin números ni unidades; el hilván = «con la puntada más larga»; el
   sentido de la costura no se dice (las fuentes no coinciden) — solo «en la misma dirección». Se tutea. Nunca «cierre»
   aquí (una vez, en el h1, y basta). */
export default {
  ui: {
    fig: 'Fig. 4',
    title: 'Cremallera centrada',
    svgLabel: 'Un dibujo isométrico de cómo coser una cremallera centrada en una costura: la costura cosida hasta la marca del tope inferior, con remate, la abertura hilvanada con la puntada más larga y la costura abierta con la plancha; la cremallera boca abajo sobre los márgenes, los dientes sobre la línea de costura; pespunteada por el derecho con el prensatelas para cremalleras de lado a lado abajo y a lo largo de los dos lados, en la misma dirección; luego el hilván descosido, y los dos bordes doblados se juntan sobre los dientes.',
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
    faceDown: 'cremallera boca abajo',
    teethOnSeam: 'dientes sobre la costura',
    allowancesOnly: 'prende solo a los márgenes',
    rightUp: 'derecho hacia arriba',
    belowStop: 'de lado a lado, bajo el tope',
    pivot: 'gira, aguja abajo',
    needleDown: 'aguja abajo, prensatelas arriba',
    movePull: 'tirador detrás del prensatelas',
    otherSide: 'el otro lado',
    sameWay: 'en la misma dirección',
    unpick: 'descose el hilván',
    meet: 'los bordes se juntan',
  },
  steps: [
    {
      title: 'Cremallera centrada',
      text: 'Los dos bordes doblados de la costura se juntan sobre los dientes de la cremallera; un pespunte corre por cada lado y de lado a lado abajo. Toca para ver a través de la tela.',
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
      text: 'Pon la puntada más larga y cierra la abertura sobre la misma línea de costura, de la marca al borde superior. Este hilván se descose al final.',
      details: [
        'Pon en la máquina la puntada más larga: es un hilván, después se descose.',
        'Cierra la abertura sobre la misma línea de costura, de la marca al borde superior.',
        'El hilván mantiene la abertura cerrada mientras coses la cremallera.',
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
      title: 'La cremallera boca abajo',
      text: 'Coloca la cremallera boca abajo sobre los márgenes de costura, los dientes justo sobre la línea de costura, y préndela solo a los márgenes.',
      details: [
        'Coloca la cremallera boca abajo sobre los márgenes de costura abiertos.',
        'Los dientes justo sobre la línea de costura, el tope inferior en la marca.',
        'Prende la cinta de la cremallera con alfileres solo a los márgenes de costura, no a las piezas de debajo.',
      ],
    },
    {
      title: 'Un lado',
      text: 'Da la vuelta a la pieza, con el derecho hacia arriba. Con el prensatelas para cremalleras, pespuntea de lado a lado abajo, bajo el tope, gira con la aguja abajo y pespuntea a lo largo de un lado, a través de todas las capas.',
      details: [
        'Da la vuelta a la pieza, con el derecho hacia arriba: la cremallera queda debajo, sus dientes bajo la línea de costura.',
        'Pon el prensatelas para cremalleras: con él la aguja cose cerca de la cremallera.',
        'Empieza en la línea de costura y pespuntea de lado a lado, bajo el tope: nunca sobre el tope.',
        'En la esquina, para con la aguja abajo en la tela, levanta el prensatelas, gira la pieza y pespuntea a lo largo del lado, siempre a la misma distancia de la costura.',
      ],
    },
    {
      title: 'Mueve el tirador',
      text: 'Cuando el tirador estorbe, para con la aguja abajo, levanta el prensatelas y desliza el tirador detrás del prensatelas. Baja el prensatelas y termina el lado con el prensatelas para cremalleras.',
      details: [
        'Unas puntadas antes del tirador, para con la aguja abajo en la tela.',
        'Levanta el prensatelas y desliza el tirador detrás del prensatelas, detrás de la aguja.',
        'Baja el prensatelas y termina el lado con el prensatelas para cremalleras.',
      ],
    },
    {
      title: 'El otro lado',
      text: 'Pespuntea el otro lado igual con el prensatelas para cremalleras: de lado a lado abajo empezando en la línea de costura, gira, a lo largo del lado, en la misma dirección que el primer lado.',
      details: [
        'Empieza otra vez en la línea de costura y pespuntea la otra mitad de lado a lado, bajo el tope.',
        'Gira con la aguja abajo y pespuntea a lo largo del otro lado, a la misma distancia de la costura.',
        'Cose los dos lados en la misma dirección.',
      ],
    },
    {
      title: 'Descose el hilván',
      text: 'Descose el hilván sobre la cremallera y plancha. Los dos bordes doblados se juntan sobre los dientes, la cremallera apenas se ve.',
      details: [
        'Descose las puntadas del hilván sobre la cremallera.',
        'Plancha por el derecho: los dos bordes doblados se juntan sobre los dientes.',
      ],
    },
  ],
  legend: [
    { title: 'Tela', text: 'dos piezas unidas por una costura · sus bordes doblados se juntan sobre los dientes' },
    { title: 'Pespunte', text: 'a lo largo de los dos lados y de lado a lado bajo el tope · a la misma distancia de la costura' },
    { title: 'Costura', text: 'debajo de la cremallera, rematada en la marca' },
    { title: 'Cremallera', text: 'boca abajo bajo la costura, los dientes sobre la línea de costura' },
  ],
};

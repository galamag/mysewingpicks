/* Cremallera con forro (tutorial «Cómo coser una cremallera», sección `lined`) — textos en español. Misma forma
   que el inglés (zipper-lined.text.js lo comprueba). tú, español neutro; solo cm, coma decimal, espacio de no
   separación antes de cm; solo los números de la creadora (el neceser): 20, 23, 0,5 cm. Sin pespunte a lo largo
   de la cremallera; no se nombra ningún prensatelas (especificación 3.2). «cremallera», nunca «cierre invisible». */
export default {
  ui: {
    fig: 'Fig. 1',
    title: 'Cremallera con forro',
    svgLabel: 'Dibujo isométrico de cómo se cose la cremallera de un neceser con forro: el exterior, la cremallera de 20 cm boca abajo y el forro boca abajo, cosidos con una sola costura a 0,5 cm; el forro abierto, exterior y forro doblados por la mitad, el otro lado de la cremallera cosido igual, y la cremallera abierta.',
    prev: 'Paso anterior',
    dot: (i, title) => (i ? `Paso ${i}: ${title}` : title),
    start: 'Pasos →',
    next: 'Siguiente →',
    overview: 'Vista general',
    stepOf: (k, n) => `Paso ${k} de ${n}`,
    machine: (stitch) => `Máquina: ${stitch.toLowerCase()}`,
    inThisStep: 'En este paso',
    takeApart: 'Cerrar la cremallera',
    putTogether: 'Abrir la cremallera',
    replay: '↻ Repetir',
    parts: 'Piezas',
    allSteps: 'Instrucciones paso a paso',
    endView: 'CORTE',
  },
  stitches: { straight: 'Puntada recta' },
  labels: {
    outerUp: 'exterior, derecho arriba',
    zipperDown: 'cremallera boca abajo',
    cm20: '20 cm',
    cm23: '23 cm',
    endsShort: 'extremos antes del borde',
    liningDown: 'forro boca abajo',
    edgesLevel: 'borde con borde',
    seam05: 'costura 0,5 cm',
    liningOut: 'abrir el forro',
    foldBoth: 'doblar los dos a la mitad',
    otherEnds: 'otros lados a la cremallera',
    otherSide: 'el otro lado',
    openZipper: 'abrir la cremallera',
    readySides: 'ahora, las costuras laterales',
  },
  steps: [
    {
      title: 'Cremallera con forro',
      text: 'La cremallera del neceser, cosida: el exterior a un lado, el forro al otro, una costura a cada lado de la cremallera, y abierta, lista para las costuras laterales. Toca para cerrar la cremallera.',
    },
    {
      title: 'La cremallera sobre el exterior',
      text: 'Coloca el exterior con el derecho hacia arriba. Pon la cremallera de 20 cm boca abajo a lo largo de su lado de 23 cm, en el centro: sus extremos no llegan a los bordes laterales.',
      details: [
        'Coloca el exterior con el derecho hacia arriba.',
        'Pon la cremallera boca abajo a lo largo de un lado de 23 cm, con su borde sobre el borde de la tela.',
        'Céntrala: la cremallera de 20 cm es más corta que el lado, así que sus extremos no llegan a los bordes laterales y quedan fuera de las costuras laterales.',
      ],
    },
    {
      title: 'Encima, el forro',
      text: 'Pon encima el forro boca abajo, borde con borde con el exterior. La cremallera queda entre los dos.',
      details: [
        'Pon el forro boca abajo sobre la cremallera.',
        'Su borde coincide con el borde del exterior: exterior, cremallera, forro — tres capas.',
        'Sujeta las capas con pinzas para coser.',
      ],
    },
    {
      title: 'Cose el primer lado',
      text: 'Cose a través de todas las capas, a 0,5 cm del borde.',
      details: [
        'Cose juntos el exterior, la cremallera y el forro, a 0,5 cm del borde.',
        'Sin pespunte a lo largo de la cremallera.',
      ],
    },
    {
      title: 'Abre y dobla',
      text: 'Abre el forro hacia fuera de la cremallera. Dobla por la mitad el exterior y el forro, para que sus otros lados cortos lleguen al otro lado de la cremallera.',
      details: [
        'Abre el forro hacia fuera de la cremallera: el exterior a un lado, el forro al otro.',
        'Dobla el exterior por la mitad, derecho con derecho, y el forro igual.',
        'Sus otros lados cortos llegan ahora al otro lado de la cremallera: exterior, cremallera boca abajo, forro, como la primera vez.',
      ],
    },
    {
      title: 'Cose el segundo lado',
      text: 'Cose el otro lado de la cremallera igual, a 0,5 cm del borde. El exterior y el forro forman ahora un aro.',
      details: [
        'Sujeta las capas con pinzas y cose a través de todas, a 0,5 cm del borde.',
        'El exterior y el forro forman ahora un aro, unidos por la cremallera por los dos lados.',
      ],
    },
    {
      title: 'Abre la cremallera',
      text: 'Abre la cremallera antes de las costuras laterales: por ella se da la vuelta al neceser después.',
      details: [
        'Desliza el tirador hasta el otro extremo: la cremallera está abierta.',
        'Déjala abierta: luego vienen las costuras laterales, y al neceser se le da la vuelta por la cremallera.',
        'Las costuras laterales y cómo darle la vuelta están en la página del neceser; el enlace está debajo de este dibujo.',
      ],
    },
  ],
  legend: [
    { title: 'Exterior', text: 'algodón · su lado de 23 cm va a la cremallera' },
    { title: 'Cremallera', text: '20 cm · en el centro del lado de 23 cm, sus extremos no llegan a los bordes laterales' },
    { title: 'Forro', text: 'del mismo tamaño que el exterior' },
    { title: 'Costuras', text: '0,5 cm, una a cada lado de la cremallera · sin pespunte' },
  ],
};

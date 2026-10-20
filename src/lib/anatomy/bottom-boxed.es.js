/* Esquinas en triángulo (guía "Base de la bolsa", sección `boxed`) — textos en español. La misma forma
   que el inglés (bottom-boxed.text.js lo comprueba). Sin números: la sección aún no tiene un proyecto de
   la costurera; la regla de las fuentes solo en palabras (línea de lado a lado = ancho de la base, a la
   mitad del ancho de la base desde el fin de la costura, punta cortada dejando un pequeño margen). Tuteo,
   español neutro. */
export default {
  ui: {
    fig: 'Fig. 3',
    title: 'Esquinas en triángulo',
    svgLabel: 'Dibujo isométrico de cómo se hacen las esquinas en triángulo: la bolsa cosida por los lados y por la base, cada esquina de abajo abierta en triángulo con la costura lateral sobre la costura de la base, una línea marcada de lado a lado a la mitad del ancho de la base desde el fin de la costura y cosida, la punta cortada dejando un pequeño margen, y la bolsa del derecho, con la base plana.',
    prev: 'Paso anterior',
    dot: (i, title) => (i ? `Paso ${i}: ${title}` : title),
    start: 'Pasos →',
    next: 'Siguiente →',
    overview: 'Vista general',
    stepOf: (k, n) => `Paso ${k} de ${n}`,
    machine: (stitch) => `Máquina: ${stitch.toLowerCase()}`,
    inThisStep: 'En este paso',
    takeApart: 'Ponerla de pie',
    putTogether: 'Ver la base',
    replay: '↻ Repetir',
    parts: 'Piezas',
    allSteps: 'Instrucciones paso a paso',
    endView: 'CORTE',
  },
  stitches: { straight: 'Puntada recta' },
  labels: {
    rightSides: 'derecho con derecho',
    sidesBottom: 'lados y base',
    aPouch: 'una bolsa plana',
    standUp: 'ponerla boca abajo',
    openCorner: 'abrir la esquina',
    seamOnSeam: 'costura sobre costura',
    triangle: 'un triángulo',
    seamEnd: 'fin de la costura',
    halfBase: 'mitad del ancho de la base',
    baseWidth: 'ancho de la base',
    sewLine: 'coser sobre la línea',
    backstitch: 'rematar',
    bothCorners: 'las dos esquinas',
    trimTip: 'cortar la punta',
    smallAllowance: 'un pequeño margen',
    turnOut: 'dar la vuelta al derecho',
    flatBottom: 'una base plana',
    cornerSeam: 'costura de la esquina',
  },
  steps: [
    {
      title: 'Esquinas en triángulo',
      text: 'La base de la bolsa, con la bolsa boca abajo: una base plana, con la costura de la base en el centro y una costura corta de lado a lado en cada extremo, donde se junta con la costura lateral. Toca la bolsa para ponerla de pie.',
    },
    {
      title: 'Coser la bolsa',
      text: 'Pon el delantero sobre la espalda, derecho con derecho, y cose los lados y la base: una bolsa plana, sin recortar nada de las esquinas.',
      details: [
        'Pon el delantero sobre la espalda, derecho con derecho, y sujétalos con clips de costura.',
        'Cose los dos lados y la base.',
        'No se recorta nada de las esquinas: la base se forma en los pasos siguientes.',
        'Si la bolsa es una sola pieza doblada en la base, no hay costura de la base: entonces la costura lateral va sobre el doblez de la base.',
      ],
    },
    {
      title: 'Abrir la esquina',
      text: 'Separa el delantero y la espalda en una esquina de abajo y aplánala para que la costura lateral quede justo sobre la costura de la base: la esquina se vuelve un triángulo.',
      details: [
        'Separa el delantero y la espalda en una esquina de abajo.',
        'Aplana la esquina para que la costura lateral quede exactamente sobre la costura de la base (o sobre el doblez de la base).',
        'Ahora la esquina es un triángulo, con la costura por el centro hasta el fin de la costura, en su punta.',
        'Abre igual la otra esquina de abajo.',
        'En el dibujo la bolsa está boca abajo, apoyada en su abertura, para que se vean las dos esquinas.',
      ],
    },
    {
      title: 'Marcar la línea',
      text: 'Marca una línea de lado a lado del triángulo, en ángulo recto con la costura, a la mitad del ancho de la base desde el fin de la costura. Así la línea mide lo mismo que el ancho de la base.',
      details: [
        'Decide qué ancho quieres para la base: ese es el ancho de la base.',
        'Mide la mitad del ancho de la base a lo largo de la costura, desde el fin de la costura, donde se juntan las costuras en la punta, y no desde la punta de la tela.',
        'Marca ahí una línea de lado a lado del triángulo, en ángulo recto con la costura. Mide lo mismo que el ancho de la base.',
        'Cuanto más lejos de la punta esté la línea, más ancha será la base. Marca igual la otra esquina.',
      ],
    },
    {
      title: 'Coser sobre la línea',
      text: 'Cose sobre la línea marcada y remata al principio y al final.',
      details: [
        'Cose sobre la línea, de un borde del triángulo al otro.',
        'Remata al principio y al final para que la costura aguante.',
        'Cose igual la otra esquina.',
      ],
    },
    {
      title: 'Cortar la punta',
      text: 'Corta la punta de cada triángulo dejando un pequeño margen más allá de la costura.',
      details: [
        'Corta la punta a lo largo de la costura, dejando un pequeño margen de costura.',
        'No cortes la costura.',
        'Haz igual todas las esquinas de abajo, y también las del forro si la bolsa lleva forro.',
      ],
    },
    {
      title: 'Dar la vuelta',
      text: 'Dale la vuelta a la bolsa al derecho: tiene una base plana, con una costura de esquina corta de lado a lado en cada extremo.',
      details: [
        'Dale la vuelta a la bolsa al derecho y saca bien las esquinas.',
        'La base es plana y tan ancha como larga era la línea. En cada extremo la costura lateral llega al centro de la costura de la esquina.',
      ],
    },
  ],
  legend: [
    { title: 'Base', text: 'plana · tan ancha como largas son las costuras de las esquinas' },
    { title: 'Costura de la base', text: 'une el delantero y la espalda · por el centro de la base' },
    { title: 'Costuras de las esquinas', text: 'cosidas de lado a lado de la esquina, a la mitad del ancho de la base desde el fin de la costura' },
    { title: 'Costuras laterales', text: 'cada una llega al centro de una costura de esquina' },
  ],
};

/* Esquinas recortadas (guía «Base de la bolsa», sección `cut-out`) — textos en español neutro. La
   misma forma que el inglés (bottom-cutout.text.js lo comprueba). Solo centímetros, coma decimal,
   espacio de no separación antes de la unidad; solo los números de la costurera — 23 × 31, 0,5 y
   3,5 × 2,5 cm (el neceser). Tuteo. */
export default {
  ui: {
    fig: 'Fig. 2',
    title: 'Esquinas recortadas',
    svgLabel: 'Dibujo isométrico de cómo se hacen las esquinas recortadas: la pieza doblada por la mitad y cosida por los lados, un trocito de 3,5 × 2,5 cm recortado de cada esquina de abajo, cada esquina abierta con la costura lateral sobre el doblez de la base y cosida de lado a lado, y la bolsa del derecho, con la base plana.',
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
    cm23: '23 cm',
    cm31: '31 cm',
    rightSides: 'derecho con derecho',
    foldBottom: 'el doblez es la base',
    seam05: 'costura 0,5 cm',
    cm35: '3,5 cm',
    cm25: '2,5 cm',
    cutBoth: 'recortar las dos capas',
    seamOnFold: 'costura sobre el doblez',
    sewAcross: 'coser de lado a lado',
    bothCorners: 'las dos esquinas',
    turnOut: 'dar la vuelta al derecho',
    flatBottom: 'una base plana',
    cornerSeam: 'costura de la esquina',
  },
  steps: [
    {
      title: 'Esquinas recortadas',
      text: 'La base del neceser, con la bolsa boca abajo: una base plana, con una costura corta de lado a lado en cada extremo, donde la costura lateral se junta con el doblez de la base. Toca la bolsa para ponerla de pie.',
    },
    {
      title: 'Doblar por la mitad',
      text: 'El neceser es una sola pieza de 23 × 31 cm. Dóblala por la mitad a lo ancho, derecho con derecho: el doblez es la base.',
      details: [
        'Coloca la pieza de 23 × 31 cm con el derecho hacia arriba.',
        'Dóblala por la mitad a lo ancho, derecho con derecho. El doblez es la base de la bolsa: ahí no hay costura.',
        'El forro del neceser es la misma pieza de 23 × 31 cm y se hace igual.',
      ],
    },
    {
      title: 'Coser los lados',
      text: 'Cose los dos lados con una costura de 0,5 cm, desde arriba hasta el doblez.',
      details: [
        'Sujeta los lados con clips de costura.',
        'Cose las dos costuras laterales a 0,5 cm del borde, hasta el doblez.',
        'En el neceser, antes se cose la cremallera, y en una costura lateral del forro queda una abertura para darle la vuelta; las esquinas se hacen igual.',
      ],
    },
    {
      title: 'Recortar las esquinas',
      text: 'De cada esquina de abajo recorta un trocito de 3,5 × 2,5 cm: 3,5 cm a lo largo de la base, 2,5 cm a lo largo de la costura lateral.',
      details: [
        'Marca en cada esquina de abajo un rectángulo de 3,5 × 2,5 cm: 3,5 cm a lo largo del doblez de la base, 2,5 cm subiendo por la costura lateral.',
        'Recórtalo a través de las dos capas.',
        'En el neceser son cuatro esquinas: dos del exterior y dos del forro.',
      ],
    },
    {
      title: 'Abrir la esquina',
      text: 'Abre cada esquina recortada y aplánala para que la costura lateral quede sobre el doblez de la base: los bordes cortados forman una sola línea recta.',
      details: [
        'Abre la esquina recortada, separando el delantero y la espalda.',
        'Aplánala para que la costura lateral quede justo sobre el doblez de la base.',
        'Los bordes cortados forman ahora una sola línea recta de lado a lado de la esquina.',
      ],
    },
    {
      title: 'Coser de lado a lado',
      text: 'Cose cada esquina de lado a lado, a 0,5 cm del borde cortado.',
      details: [
        'Cose de lado a lado de la esquina, a 0,5 cm del borde.',
        'Haz la otra esquina igual y, en el neceser, también las dos esquinas del forro.',
      ],
    },
    {
      title: 'Dar la vuelta',
      text: 'Dale la vuelta a la bolsa al derecho: tiene una base plana, con una costura corta de esquina en cada extremo.',
      details: [
        'Dale la vuelta a la bolsa al derecho (el neceser se voltea por la abertura del forro) y saca bien las esquinas.',
        'La base queda plana. En cada extremo, la costura lateral llega al centro de la costura de la esquina.',
      ],
    },
  ],
  legend: [
    { title: 'Base', text: 'plana · entre las dos costuras de las esquinas' },
    { title: 'Doblez de la base', text: 'la pieza de 23 × 31 cm doblada por la mitad · sin costura en la base' },
    { title: 'Costuras de las esquinas', text: 'cosidas de lado a lado a 0,5 cm del borde, después de recortar de la esquina un trocito de 3,5 × 2,5 cm' },
    { title: 'Costuras laterales', text: '0,5 cm · cada una llega al centro de una costura de esquina' },
  ],
};

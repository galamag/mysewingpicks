/* Base plegada hacia dentro (guía «Base de la bolsa», sección `folded`) — textos en español. Misma forma
   que el inglés (bottom-folded.text.js lo comprueba). Tú; solo centímetros, coma decimal, espacio de no
   separación antes de cm; solo los números de la costurera — 6, 12 y 0,5 cm (tote bag). */
export default {
  ui: {
    fig: 'Fig. 1',
    title: 'Base plegada hacia dentro',
    svgLabel: 'Dibujo isométrico de cómo se hace una base plegada hacia dentro: el doblez central, dos dobleces cosidos a 6 cm de él, el fondo metido hacia dentro, las costuras laterales que lo atrapan y la bolsa del derecho.',
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
    foldPress: 'doblar y planchar',
    centreCrease: 'doblez central',
    cm6: '6 cm',
    rightSides: 'derecho con derecho',
    stitchFold: 'coser al ras del doblez',
    bottom12: 'fondo de 12 cm',
    liftEnds: 'levantar los extremos por los dobleces',
    foldsIn: 'el fondo se mete dentro',
    centreInside: 'centro: 6 cm dentro',
    seam05: 'costura 0,5 cm',
    layers4: '4 capas aquí',
    turnOut: 'dar la vuelta al derecho',
    openUp: 'desplegar',
    base12: 'base de 12 cm',
    cornersForm: 'las esquinas se forman solas',
  },
  steps: [
    {
      title: 'La base plegada hacia dentro',
      text: 'La base de la tote bag, con la bolsa boca abajo: una base plana de 12 cm entre dos dobleces pespunteados y unas esquinas que se forman solas, sin costuras en las esquinas. Toca la bolsa para ponerla de pie.',
    },
    {
      title: 'Marca el centro y mide',
      text: 'Dobla la pieza por la mitad a lo ancho, plancha el doblez y vuelve a abrirla. Mide 6 cm desde el doblez hacia cada extremo y traza una línea de lado a lado.',
      details: [
        'La bolsa se corta en una sola pieza, doblada por la mitad a lo ancho: la base queda en el centro de la pieza.',
        'Dóblala por la mitad a lo ancho y plancha para marcar el doblez. Vuelve a abrirla: el doblez es el centro de la base.',
        'Mide 6 cm desde el doblez hacia cada extremo y traza con el marcador borrable al aire una línea a lo ancho de toda la pieza.',
      ],
    },
    {
      title: 'Cose un doblez en cada línea',
      text: 'Dobla por la primera línea, derecho con derecho, y cose al ras del doblez. Abre la pieza y haz lo mismo en la segunda línea: dos dobleces pespunteados, a 12 cm uno del otro.',
      details: [
        'Dobla la pieza por la primera línea, derecho con derecho, y cose al ras del doblez de lado a lado. Ábrela.',
        'Dobla y cose de la misma manera por la segunda línea.',
        'Los dos dobleces pespunteados, a 12 cm uno del otro, son los bordes del fondo; el doblez central marca su mitad. En el paso siguiente la pieza se dobla justo por estos dobleces.',
      ],
    },
    {
      title: 'Mete el fondo hacia dentro',
      text: 'Levanta los dos extremos por los dobleces pespunteados y júntalos: el fondo se dobla hacia dentro y el doblez central entra 6 cm. Coloca la pieza plana.',
      details: [
        'Coloca la pieza con el derecho hacia arriba y levanta los dos extremos para que se doble por los dos dobleces pespunteados.',
        'Junta los extremos. El fondo de 12 cm se dobla sobre sí mismo hacia dentro y el doblez central queda dentro, 6 cm hacia arriba entre las capas, como el fondo de una bolsa de papel.',
        'Colócala plana, derecho con derecho. Ahora los dobleces pespunteados forman el borde inferior.',
      ],
    },
    {
      title: 'Cose los laterales',
      text: 'Mantén el fondo metido hacia dentro y cose los dos laterales con una costura de 0,5 cm, a través de todas las capas: cuatro en el fondo.',
      details: [
        'Sujeta los laterales con clips de costura para que el fondo metido no se mueva.',
        'Cose las dos costuras laterales a 0,5 cm del borde, hasta abajo del todo. En el fondo, la costura atraviesa cuatro capas: la parte delantera, las dos mitades del fondo metido y la trasera. Deja abierta la parte de arriba.',
        'En la tote bag, el forro se cose igual, solo que en una de sus costuras laterales se deja una abertura para darle la vuelta a la bolsa más adelante.',
      ],
    },
    {
      title: 'Dale la vuelta',
      text: 'Da la vuelta al derecho y abre la bolsa: el fondo se despliega en una base plana de 12 cm y las esquinas se forman solas.',
      details: [
        'Da la vuelta a la bolsa al derecho por la parte de arriba.',
        'Ábrela y empuja el fondo hacia fuera. El fondo metido se despliega en una base plana de 12 cm y, donde lo sujetaron las costuras laterales, se forman solas unas esquinas limpias, sin necesidad de coser las esquinas aparte.',
      ],
    },
  ],
  legend: [
    { title: 'Base', text: 'plana, de 12 cm de ancho: el fondo entre los dos dobleces pespunteados' },
    { title: 'Dobleces pespunteados', text: 'un doblez cosido al ras del borde, a 6 cm a cada lado del doblez central · los lados largos de la base' },
    { title: 'Doblez central', text: 'la mitad del fondo · se mete 6 cm hacia dentro antes de coser los laterales' },
    { title: 'Costuras laterales', text: '0,5 cm, cosidas con el fondo metido · cuatro capas en el fondo' },
    { title: 'Esquinas', text: 'se forman solas donde las costuras laterales atraparon el fondo metido · sin costuras en las esquinas' },
  ],
};

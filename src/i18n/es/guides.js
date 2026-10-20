/* Spanish texts of the sewing guides (src/data/guides.js), by slug.
   Same fields as GUIDE_FIELDS in src/i18n/content.js — the build checks it.
   tú, neutral Spanish («bolsa de tela»); non-breaking spaces (U+00A0) between number and unit;
   the maker's numbers only (spec 3.2). */
export default {
  'line-a-bag': {
    title: 'Forro: coser, dar la vuelta, pespuntear',
    blurb: 'Así se pone el forro: una sola costura alrededor del borde superior y luego se le da la vuelta a toda la bolsa por una abertura del forro. Lo ves en la tote bag y en la cesta de tela, con dos formas de cerrar la abertura.',
    pageTitle: 'Cómo forrar una bolsa de tela: darle la vuelta y cerrar',
    pageDescription: 'Cómo forrar una bolsa de tela: forro con una abertura de 8 cm, costura superior a 0,5 cm, darle la vuelta por la abertura, cerrarla y pespuntear. Cada paso, animado.',
    heading: 'Cómo forrar una bolsa de tela y darle la vuelta por la abertura',
    teaser: 'Coser el forro, darle la vuelta a la bolsa por la abertura, cerrarla y pespuntear: cada paso, animado.',
    needsIntro: 'Hilo, clips de costura, cortahilos, una plancha y la máquina de coser: las herramientas que recomiendo personalmente para estos pasos. Para cerrar la abertura a mano, también necesitarás una aguja de coser.',
  },
  'bag-bottom': {
    title: 'Base de la bolsa: cuatro formas',
    blurb: 'Cómo darle a una bolsa una base sobre la que se sostenga. Primero, la base plegada hacia dentro de la tote bag: dos dobleces cosidos a 6 cm del centro y metidos hacia dentro, y las esquinas se forman solas.',
    pageTitle: 'Cómo coser la base de una bolsa de tela: 4 formas',
    pageDescription: 'Cómo coser la base de una bolsa de tela: la base plegada de la tote bag (dos dobleces cosidos a 6 cm del doblez central, metidos hacia dentro, costuras laterales de 0,5 cm) se vuelve una base plana de 12 cm. Cada paso animado.',
    heading: 'Cómo hacer la base de una bolsa de tela: cuatro formas',
    teaser: 'Una base plana para tu bolsa, con esquinas que se forman solas: cada paso animado.',
    needsIntro: 'Plancha, regla de patchwork, marcador borrable al aire, hilo, clips de costura, la máquina de coser y tijeras de costura: las herramientas que recomiendo personalmente para estos pasos.',
    sections: {
      folded: {
        title: 'Base plegada hacia dentro',
        line: 'Dos dobleces cosidos, metidos hacia dentro antes de las costuras laterales: las esquinas se forman solas.',
        choose: 'Cuando la bolsa se corta en una sola pieza, doblada por la mitad a lo ancho, y quieres una base plana sin costuras en las esquinas: las esquinas se forman solas al darle la vuelta.',
      },
      'cut-out': {
        title: 'Esquinas recortadas',
        line: 'De cada esquina de abajo se recorta un trocito; luego la esquina se abre y se cose de lado a lado.',
        choose: 'Cuando la bolsa va doblada en la base, coses primero los lados y quieres una base plana: con las esquinas recortadas, las costuras coinciden con limpieza, y sirve también para telas gruesas.',
        note: 'En la cesta de tela las esquinas se recortan ya al cortar: de un cuadrado de 60 × 60 cm, un cuadrado de 20 × 20 cm en cada esquina.',
      },
      boxed: {
        title: 'Esquinas en triángulo',
        line: 'Primero se cose la bolsa; luego cada esquina de abajo se aplana en triángulo y se cose de lado a lado.',
        choose: 'Cuando quieres probar primero la profundidad: no se recorta nada antes, así que todavía puedes coser una base más honda. La esquina queda resistente y va bien con telas ligeras.',
      },
    },
  },
};

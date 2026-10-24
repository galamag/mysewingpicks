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
    blurb: 'Cómo darle a una bolsa una base sobre la que se sostenga, de cuatro formas: la base plegada hacia dentro de la tote bag (dos dobleces cosidos a 6 cm del centro, las esquinas se forman solas), las esquinas recortadas, las esquinas en triángulo y la base aparte. Cada forma está animada, con un consejo para saber cuándo elegirla.',
    pageTitle: 'Cómo coser la base de una bolsa de tela: 4 formas',
    pageDescription: 'Cómo coser la base de una bolsa de tela de cuatro formas: base plegada (dobleces cosidos a 6 cm del centro, base plana de 12 cm), esquinas recortadas, esquinas en triángulo y base aparte. Cada paso animado.',
    heading: 'Cómo hacer la base de una bolsa de tela: cuatro formas',
    teaser: 'Cuatro formas de dar una base plana a tu bolsa (plegada hacia dentro, esquinas recortadas, esquinas en triángulo y base aparte): cada paso animado.',
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
      panel: {
        title: 'Base aparte',
        line: 'La base es una pieza aparte, cosida todo alrededor a la parte de abajo de las paredes.',
        choose: 'Cuando quieres una base plana y estable, una base de otra tela o una base firme con entretela o con una base rígida. Las bases redondas y ovaladas también se cosen, con piquetes en el margen de las paredes a lo largo de toda la curva.',
      },
    },
  },
  'sew-a-zipper': {
    title: 'Cómo coser una cremallera',
    blurb: 'Cómo coser una cremallera paso a paso: en un neceser con forro, un bolso, una funda de cojín, una falda o un vestido. Cada forma está animada, con un consejo sobre cuándo elegirla.',
    pageTitle: 'Cómo coser una cremallera: neceser, bolso, cojín, falda',
    pageDescription: 'Cómo coser una cremallera en un neceser, un bolso, un cojín, una falda o un vestido: la cremallera entre el exterior y el forro, y otras formas. Cada paso animado.',
    heading: 'Cómo coser una cremallera (cierre): neceser, bolso, cojín, falda y vestido',
    teaser: 'Coser una cremallera en un neceser, un bolso, un cojín, una falda o un vestido: cada paso animado.',
    needsIntro: 'Pinzas para coser y la máquina de coser: las herramientas que recomiendo personalmente para estos pasos.',
    sections: {
      lined: {
        title: 'Cremallera con forro',
        line: 'El exterior, la cremallera y el forro se cosen con una sola costura; luego, el otro lado de la cremallera igual.',
        choose: 'Cuando coses un neceser, un estuche o un bolsito con forro: la cremallera se pone junto con el forro, y su cinta y los márgenes de costura quedan escondidos dentro.',
        note: 'Muchas instrucciones también hacen un pespunte a lo largo de la cremallera, para que la tela no se enganche en los dientes; este neceser no lo lleva.',
      },
      tabs: {
        title: 'Extremos rematados',
        line: 'Unas lengüetas de tela rematan los dos extremos de la cremallera antes de coserla.',
        choose: 'Cuando quieres extremos limpios y planos en un neceser o un estuche: las lengüetas cubren los extremos de la cremallera, que quedan fuera de las costuras laterales, y las esquinas quedan planas.',
        rest: 'Después, la cremallera se cose como la cremallera con forro: exterior, cremallera y forro con una sola costura, y luego el otro lado igual. Las costuras laterales pasan justo al lado de las lengüetas.',
      },
      recessed: {
        title: 'Cremallera en el borde del bolso',
        line: 'La cremallera se cose entre tiras de tela y forma una tira de cremallera que va por dentro, arriba del bolso, por debajo del borde.',
        choose: 'Cuando coses un bolso tote o un bolso grande con forro y quieres que se abra bien, con la cremallera por debajo del borde. Va en casi cualquier bolso con forro; en una tela muy gruesa, los extremos rematados abultan.',
        rest: 'Los extremos de la cremallera se rematan con lengüetas de tela, como en «Extremos rematados»: una tira doblada como un bies sobre cada extremo, cosida justo después del tope.',
      },
      centered: {
        title: 'Cremallera centrada',
        line: 'Los dos bordes doblados de la costura se juntan sobre los dientes de la cremallera, con un pespunte a cada lado.',
        choose: 'Cuando quieres la forma más sencilla de coser una cremallera en una costura: en una funda de almohada o de cojín, en una falda, en la costura central de la espalda de un vestido. La cremallera se ve un poco por los dos lados.',
      },
      lapped: {
        title: 'Cremallera con solapa',
        line: 'Un lado de la costura se dobla sobre la cremallera y la tapa, con un solo pespunte al lado.',
        choose: 'Cuando coses una cremallera en la costura lateral de una falda, un vestido o un pantalón y no quieres que se vea: la solapa tapa la cremallera, útil cuando su color no combina con la tela, y se ve un solo pespunte.',
      },
    },
  },
};

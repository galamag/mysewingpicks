/* Tote bag figure — Italian texts. Same shape as tote.en.js (tote.text.js checks
   it): `steps` index-aligned with STEPS in tote.js, each step with the same
   number of `details` lines as English. The reader is «tu» (Piega, Cuci, Stira).
   Centimetres only, decimal comma; the inch values in brackets are dropped, as on ru.
   The maker's numbers (86 × 45, 100 × 16, 43, 6, 12, 0,5, 8, 1 cm) — unchanged.
   Terms (glossary): tela canvas, raso, fodera, esterno, manico, piega, dritto contro
   dritto, impuntura, margine di cucitura, rivoltare sul dritto. */
export default {
  ui: {
    fig: 'Fig. 1',
    title: 'Tote bag · anatomia',
    svgLabel: 'Un disegno isometrico della tote bag e di come si cuce, passo dopo passo.',
    prev: 'Passo precedente',
    dot: (i, title) => (i ? `Passo ${i}: ${title}` : title),
    start: 'Passo passo →',
    next: 'Avanti →',
    overview: 'Panoramica',
    stepOf: (k, n) => `Passo ${k} di ${n}`,
    machine: (stitch) => `Macchina: ${stitch.toLowerCase()}`,
    inThisStep: 'In questo passo',
    takeApart: 'Scomponi',
    putTogether: 'Ricomponi',
    replay: '↻ Ripeti',
    parts: 'Parti',
    allSteps: 'Istruzioni passo passo',
    endView: 'VISTA LATERALE',
  },
  stitches: { straight: 'Punto dritto' },
  labels: {
    cm4: '4 cm', cm6: '6 cm', cm8: '8 cm', cm16: '16 cm', cm45: '45 cm', cm86: '86 cm', cm100: '100 cm',
    fold: 'piega',
    outerDuck: 'esterno · canvas',
    liningSatin: 'fodera · raso',
    strapsDuck: '2 manici · canvas',
    topstitchEdges: 'impuntura i due bordi',
    centreCrease: 'piega centrale',
    stitchFold: 'cuci a filo della piega',
    bottom12: 'fondo 12 cm',
    liftEnds: 'solleva le estremità lungo le pieghe cucite',
    foldsIn: 'il fondo rientra',
    centreInside: 'centro 6 cm dentro',
    rightSides: 'dritto contro dritto',
    seam05: 'cuci a 0,5 cm',
    layers4: '4 strati qui',
    turnOut: 'rivolta sul dritto',
    openUp: 'aprila',
    base12: 'base 12 cm',
    cornersForm: 'gli angoli si formano da soli',
    opening8: 'apertura 8 cm',
    endsLevel: 'estremità a filo del bordo superiore',
    turnThrough: "rivolta dall'apertura",
    stitchClosed: "chiudi l'apertura",
    pushLining: 'spingi dentro la fodera',
    topstitch1: 'impuntura a 1 cm',
  },
  steps: [
    { title: 'La borsa finita', text: 'Una tote bag foderata in tre parti: esterno in tela canvas, fodera di raso e due manici lunghi. Tocca la borsa per scomporla.' },
    {
      title: 'Taglia i pezzi',
      text: 'Esterno: tela canvas, 86 × 45 cm. Fodera: raso, della stessa misura. Manici: due strisce di canvas, 100 × 16 cm.',
      details: [
        "Taglia un rettangolo di tela canvas di 86 × 45 cm per l'esterno e uno di raso, della stessa misura, per la fodera.",
        'Per i manici, taglia due strisce di canvas di 100 × 16 cm.',
        "Sull'esterno e sulla fodera segna a metà la linea di piega trasversale, a 43 cm da ciascun lato corto: diventerà il fondo della borsa.",
        'Tutti i margini di cucitura di questa borsa sono di 0,5 cm.',
      ],
    },
    {
      title: 'Prepara i manici',
      text: 'Piega a metà e stira, riapri, porta entrambi i bordi alla piega, ripiega: un manico largo 4 cm, in quattro strati. Impuntura entrambi i bordi.',
      details: [
        'Piega una striscia a metà per il lungo, rovescio contro rovescio, e stira per segnare la piega.',
        "Riaprila. Piega verso l'interno entrambi i bordi lunghi, in modo che si incontrino sulla piega, e stira di nuovo.",
        "Ripiega a metà lungo la prima piega. Ora il manico è largo 4 cm e spesso quattro strati, con tutti i bordi vivi nascosti all'interno.",
        'Impuntura vicino a entrambi i bordi lunghi con un punto dritto. Prepara due manici.',
      ],
    },
    {
      title: 'Forma il fondo',
      text: 'Stira una piega al centro e riapri. Misura 6 cm da ogni lato, piega su ciascuna linea e cuci a filo della piega: due pieghe cucite, un fondo di 12 cm.',
      details: [
        "Piega l'esterno a metà per il largo e stira una piega. Riaprilo.",
        'Misura 6 cm dalla piega verso ciascuna estremità e traccia una linea su tutta la larghezza del pezzo.',
        'Piega lungo la prima linea, dritto contro dritto, e cuci a filo della piega. Riapri, poi piega e cuci allo stesso modo lungo la seconda linea.',
        "Le due pieghe cucite, a 12 cm l'una dall'altra, sono i bordi del fondo; la piega centrale ne segna la metà.",
      ],
    },
    {
      title: "Ripiega il fondo all'interno",
      text: "Solleva entrambe le estremità piegando lungo le pieghe cucite e uniscile: il fondo rientra e la piega centrale va 6 cm all'interno. Stendi il pezzo in piano.",
      details: [
        "Appoggia il pezzo con il dritto verso l'alto e solleva entrambe le estremità, così che si curvi sulle due pieghe cucite.",
        "Unisci le estremità. Il fondo di 12 cm si ripiega su se stesso e la piega centrale va all'interno, 6 cm in su tra gli strati — come il fondo di un sacchetto di carta.",
        'Stendilo in piano, dritto contro dritto. Ora le pieghe cucite sono il bordo inferiore, e il pezzo piegato è 6 cm più corto di una semplice piega a metà.',
      ],
    },
    {
      title: 'Cuci i lati',
      text: "Tieni il fondo ripiegato all'interno e cuci entrambi i lati a 0,5 cm — attraverso tutti gli strati, quattro in basso.",
      details: [
        'Fissa i lati con le clip, così il fondo ripiegato resta al suo posto.',
        'Cuci entrambe le cuciture laterali a 0,5 cm dal bordo, per tutta la lunghezza. In basso la cucitura passa attraverso quattro strati: il davanti, le due metà del fondo ripiegato e il dietro. Lascia aperto il lato superiore.',
      ],
    },
    {
      title: 'Rivoltala sul dritto',
      text: "Rivolta l'esterno sul dritto e aprilo: il fondo si distende in una base di 12 cm e gli angoli si formano da soli.",
      details: [
        "Rivolta l'esterno sul dritto dall'apertura in alto.",
        "Aprilo e spingi fuori il fondo. Il fondo ripiegato si distende in una base piatta di 12 cm e, dove le cuciture laterali l'hanno fermato, si formano da soli angoli precisi — senza cuciture in più per gli angoli.",
      ],
    },
    {
      title: 'Cuci la fodera',
      text: "Prepara la fodera di raso allo stesso modo, ma lascia un'apertura di 8 cm in una cucitura laterale. Da lì rivolterai la borsa.",
      details: [
        "Prepara la fodera esattamente come l'esterno: stira la piega centrale, cuci le due pieghe a 6 cm da essa, ripiega il fondo all'interno.",
        "Cuci entrambe le cuciture laterali a 0,5 cm dal bordo, ma su un lato lascia un'apertura di 8 cm, in basso, appena sopra il fondo ripiegato. Da lì rivolterai la borsa.",
        'Lascia la fodera al rovescio.',
      ],
    },
    {
      title: 'Unisci esterno e fodera',
      text: "Appunta i manici all'esterno a 6 cm dal centro. Infila l'esterno nella fodera al rovescio e cuci tutto intorno al bordo superiore.",
      details: [
        "Rivolta l'esterno sul dritto.",
        'Appunta un manico al bordo superiore del davanti: estremità a filo del bordo vivo, a 6 cm dal centro, con il manico che ricade verso il basso sulla borsa. Fai lo stesso sul dietro.',
        "Infila l'esterno, manici compresi, nella fodera al rovescio, così che siano dritto contro dritto. Allinea le cuciture laterali e i bordi superiori.",
        'Cuci tutto intorno al bordo superiore, a 0,5 cm dal bordo.',
      ],
    },
    {
      title: 'Rivoltala e impuntura',
      text: "Rivolta la borsa dall'apertura e chiudi l'apertura con una cucitura. Spingi dentro la fodera e impuntura tutto intorno al bordo superiore, a 1 cm dal bordo.",
      details: [
        "Tira tutta la borsa sul dritto attraverso l'apertura nella fodera.",
        "Ripiega all'interno i bordi vivi dell'apertura e chiudila con una cucitura, vicino al bordo.",
        'Spingi la fodera dentro la borsa e stira il bordo superiore ben piatto.',
        'Impuntura tutto intorno al bordo superiore, a 1 cm dal bordo. La tua tote bag è pronta!',
      ],
    },
  ],
  legend: [
    { title: 'Esterno', text: 'tela canvas · tagliata 86 × 45 cm, piegata sul fondo' },
    { title: 'Fodera', text: "raso · tagliato 86 × 45 cm, come l'esterno" },
    { title: 'Manici ×2', text: 'tagliati 100 × 16 cm · piegati in quattro strati, larghi 4 cm' },
    { title: 'Fondo', text: "due pieghe cucite a 6 cm dalla piega centrale, una per lato, ripiegate all'interno prima delle cuciture laterali → una base di 12 cm, gli angoli si formano da soli" },
    { title: 'Impuntura', text: 'a 1 cm dal bordo superiore · tutte le cuciture a 0,5 cm' },
  ],
};

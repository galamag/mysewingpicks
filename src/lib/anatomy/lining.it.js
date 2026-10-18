/* Lining a bag (guide figure) — Italian texts. Same shape as lining.en.js (lining.text.js
   checks it): `steps` index-aligned with STEPS in lining.js, each step with the same number
   of `details` lines as English. Centimetres only, decimal comma; «tu».
   The maker's numbers (8, 15, 0,5, 6, 1 cm) — unchanged; no finished size, no stitch length.
   Non-breaking spaces (U+00A0) between number and unit. */
export default {
  ui: {
    fig: 'Fig. 1',
    title: 'Foderare una borsa · passo passo',
    svgLabel: "Un disegno isometrico di come si fodera una borsa: la fodera con un'apertura, l'esterno infilato dentro, la cucitura in alto, la borsa rivoltata dall'apertura, l'apertura chiusa e l'impuntura.",
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
    endView: 'SEZIONE',
  },
  stitches: { straight: 'Punto dritto' },
  labels: {
    liningInsideOut: 'fodera al rovescio',
    opening8: 'apertura 8 cm',
    outerRightOut: 'esterno sul dritto',
    cm6: '6 cm',
    strapsBetween: 'manici in mezzo',
    rightSides: 'dritto contro dritto',
    seam05: 'cuci a 0,5 cm',
    turnThrough: "rivolta dall'apertura",
    rightSideOut: 'sul dritto',
    tuckEdges: 'ripiega i bordi dentro',
    stitchEdge: 'cuci a filo del bordo',
    pushLining: 'spingi dentro la fodera',
    pressEdge: 'stira il bordo',
    topstitch1: 'impuntura a 1 cm',
  },
  steps: [
    { title: 'La borsa foderata', text: "L'esterno e la fodera si cuciono insieme lungo il bordo superiore, si rivoltano da un'apertura nella fodera e si impunturano. Tocca la borsa per scomporla." },
    {
      title: "Cuci la fodera con un'apertura",
      text: "Cuci la fodera come l'esterno, senza rivoltarla, ma lascia un'apertura di 8 cm in basso, in una cucitura laterale. Da lì rivolterai la borsa.",
      details: [
        "Cuci la fodera allo stesso modo dell'esterno e lasciala al rovescio.",
        "In una cucitura laterale lascia un'apertura: sulla tote bag è di 8 cm, in basso, appena sopra il fondo.",
        "L'apertura può essere lunga quanto vuoi, purché la borsa ci passi. Un oggetto rigido ha bisogno di più spazio: il cestino di stoffa, con le pareti rinforzate dalla teletta, ha un'apertura di 15 cm in una cucitura d'angolo.",
      ],
    },
    {
      title: "Infila l'esterno nella fodera",
      text: "Rivolta l'esterno sul dritto e infilalo nella fodera al rovescio, dritto contro dritto. I manici restano in mezzo, appuntati a 6 cm dal centro.",
      details: [
        "Rivolta l'esterno sul dritto; la fodera resta al rovescio.",
        "Sulla tote bag, prima appunta i manici al bordo superiore dell'esterno: estremità a filo del bordo, a 6 cm dal centro, con i manici che ricadono verso il basso sulla borsa.",
        "Infila l'esterno nella fodera così che siano dritto contro dritto, con i manici presi in mezzo. Allinea le cuciture laterali e i bordi superiori e fissali con le clip.",
      ],
    },
    {
      title: 'Cuci il bordo superiore',
      text: "Cuci tutto intorno al bordo superiore, a 0,5 cm dal bordo, attraverso la fodera, i manici e l'esterno.",
      details: [
        "Cuci tutto intorno al bordo superiore, a 0,5 cm dal bordo, attraverso tutti gli strati: la fodera, i manici e l'esterno.",
        'La tote bag e il cestino hanno qui la stessa cucitura: 0,5 cm.',
      ],
    },
    {
      title: "Rivolta dall'apertura",
      text: "Infila la mano nell'apertura della fodera e tira fuori da lì tutta la borsa. L'esterno esce sul dritto e la fodera sporge sopra.",
      details: [
        "Infila la mano nell'apertura della fodera, prendi l'esterno e tira fuori da lì tutta la borsa.",
        "Distendi l'esterno: ora è sul dritto. Anche la fodera è sul dritto e sporge sopra la borsa, con l'apertura ancora da chiudere.",
      ],
    },
    {
      title: "Chiudi l'apertura",
      text: "Ripiega all'interno i bordi dell'apertura lungo la linea della cucitura e chiudila a macchina, a filo del bordo. Oppure chiudila con il punto invisibile a mano.",
      details: [
        "Ripiega all'interno i bordi vivi dell'apertura, in linea con il resto della cucitura, così che le due pieghe si incontrino.",
        'Primo modo, a macchina: cuci insieme le due pieghe a filo del bordo. Così sono chiusi la tote bag e il cestino; la cucitura poi sparisce dentro la borsa.',
        "Secondo modo, con il punto invisibile a mano: stira le due pieghe, infila l'ago con un filo dello stesso colore del tessuto e nascondi il nodo dentro una piega.",
        "Fai un piccolo punto dentro una piega, poi proprio di fronte un piccolo punto dentro l'altra. Continua così, da un lato all'altro: i fili tra le pieghe sembrano i pioli di una scala.",
        "Ogni pochi punti tira il filo: i bordi si chiudono e i punti spariscono. Alla fine ferma il filo e nascondi l'estremità dentro la fodera.",
      ],
    },
    {
      title: 'Spingi dentro la fodera',
      text: 'Spingi la fodera dentro la borsa e stira il bordo superiore ben piatto.',
      details: [
        "Spingi la fodera dentro l'esterno, fino al fondo.",
        'Sulla tote bag stira il bordo superiore ben piatto. Nel cestino distendi la fodera negli angoli.',
      ],
    },
    {
      title: 'Impuntura il bordo superiore',
      text: "Impuntura tutto intorno al bordo superiore, a 1 cm dal bordo. Nel cestino l'impuntura è a 0,5 cm dal bordo.",
      details: [
        "Impuntura tutto intorno al bordo superiore, attraverso l'esterno e la fodera: a 1 cm dal bordo sulla tote bag, a 0,5 cm nel cestino.",
        'La tua borsa è pronta!',
      ],
    },
  ],
  legend: [
    { title: 'Esterno', text: 'sul dritto · sulla tote bag i manici sono cuciti nel suo bordo superiore, a 6 cm dal centro' },
    { title: 'Fodera', text: "cucita come l'esterno, lasciata al rovescio, poi rivoltata e spinta dentro" },
    { title: 'Apertura', text: "in una cucitura della fodera: 8 cm in una cucitura laterale della tote bag, 15 cm in una cucitura d'angolo del cestino · chiusa a filo del bordo" },
    { title: 'Cucitura superiore', text: 'esterno e fodera dritto contro dritto, a 0,5 cm dal bordo' },
    { title: 'Impuntura', text: 'a 1 cm dal bordo superiore sulla tote bag, a 0,5 cm nel cestino' },
  ],
};

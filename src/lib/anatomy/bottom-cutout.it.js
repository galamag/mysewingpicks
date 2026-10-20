/* Angoli tagliati (guida «Fondo della borsa», sezione `cut-out`) — testi italiani. Stessa forma
   dell'inglese (bottom-cutout.text.js lo controlla). Solo centimetri, virgola decimale, spazio
   indivisibile prima dell'unità; solo i numeri della sarta — 23 × 31, 0,5 e 3,5 × 2,5 cm (la pochette).
   Si dà del tu. */
export default {
  ui: {
    fig: 'Fig. 2',
    title: 'Angoli tagliati',
    svgLabel: "Un disegno isometrico di come si fanno gli angoli tagliati: il pezzo piegato a metà e cucito sui lati, un pezzetto di 3,5 × 2,5 cm tagliato da ogni angolo in basso, ogni angolo aperto con la cucitura laterale sulla piega del fondo e cucito di traverso, la borsa rivoltata, con il fondo piatto.",
    prev: 'Passo precedente',
    dot: (i, title) => (i ? `Passo ${i}: ${title}` : title),
    start: 'Passo passo →',
    next: 'Avanti →',
    overview: 'Panoramica',
    stepOf: (k, n) => `Passo ${k} di ${n}`,
    machine: (stitch) => `Macchina: ${stitch.toLowerCase()}`,
    inThisStep: 'In questo passo',
    takeApart: 'Rimetti in piedi',
    putTogether: 'Mostra il fondo',
    replay: '↻ Ripeti',
    parts: 'Parti',
    allSteps: 'Istruzioni passo passo',
    endView: 'SEZIONE',
  },
  stitches: { straight: 'Punto dritto' },
  labels: {
    cm23: '23 cm',
    cm31: '31 cm',
    rightSides: 'dritto contro dritto',
    foldBottom: 'la piega è il fondo',
    seam05: 'cucitura 0,5 cm',
    cm35: '3,5 cm',
    cm25: '2,5 cm',
    cutBoth: 'taglia i due strati',
    seamOnFold: 'cucitura sulla piega',
    sewAcross: 'cuci di traverso',
    bothCorners: 'i due angoli',
    turnOut: 'rivolta sul dritto',
    flatBottom: 'un fondo piatto',
    cornerSeam: "cucitura dell'angolo",
  },
  steps: [
    {
      title: 'Angoli tagliati',
      text: "Il fondo della pochette, la borsa capovolta: un fondo piatto, con una breve cucitura di traverso a ogni estremità, dove la cucitura laterale incontra la piega del fondo. Tocca la borsa per rimetterla in piedi.",
    },
    {
      title: 'Piega a metà',
      text: 'La pochette è un solo pezzo di 23 × 31 cm. Piegalo a metà nel senso della larghezza, dritto contro dritto: la piega è il fondo.',
      details: [
        'Stendi il pezzo di 23 × 31 cm con il dritto sopra.',
        "Piegalo a metà nel senso della larghezza, dritto contro dritto. La piega è il fondo della borsa: lì non c'è cucitura.",
        'La fodera della pochette è lo stesso pezzo di 23 × 31 cm e si fa allo stesso modo.',
      ],
    },
    {
      title: 'Cuci i lati',
      text: 'Cuci i due lati a 0,5 cm, dall\'alto fino alla piega.',
      details: [
        'Fissa i lati con le clip.',
        'Cuci le due cuciture laterali a 0,5 cm dal bordo, fino alla piega.',
        "Nella pochette la cerniera è già cucita, e in una cucitura laterale della fodera resta un'apertura per rivoltare; gli angoli si fanno allo stesso modo.",
      ],
    },
    {
      title: 'Taglia gli angoli',
      text: 'Da ogni angolo in basso taglia un pezzetto di 3,5 × 2,5 cm: 3,5 cm lungo il fondo, 2,5 cm lungo la cucitura laterale.',
      details: [
        'Disegna in ogni angolo in basso un rettangolo di 3,5 × 2,5 cm: 3,5 cm lungo la piega del fondo, 2,5 cm su per la cucitura laterale.',
        'Ritaglialo attraverso i due strati.',
        "Nella pochette gli angoli sono quattro: due sull'esterno, due sulla fodera.",
      ],
    },
    {
      title: "Apri l'angolo",
      text: 'Apri ogni angolo tagliato e appiattiscilo in modo che la cucitura laterale cada sulla piega del fondo: i bordi tagliati formano una sola linea retta.',
      details: [
        "Apri l'angolo tagliato, allargando il davanti e il dietro.",
        'Appiattiscilo in modo che la cucitura laterale cada proprio sulla piega del fondo.',
        "Ora i bordi tagliati formano una sola linea retta di traverso all'angolo.",
      ],
    },
    {
      title: 'Cuci di traverso',
      text: 'Cuci ogni angolo di traverso, a 0,5 cm dal bordo tagliato.',
      details: [
        "Cuci di traverso all'angolo, a 0,5 cm dal bordo.",
        "Fai l'altro angolo allo stesso modo e, nella pochette, anche i due angoli della fodera.",
      ],
    },
    {
      title: 'Rivolta',
      text: 'Rivolta la borsa sul dritto: ha un fondo piatto, con una breve cucitura dell\'angolo a ogni estremità.',
      details: [
        "Rivolta la borsa sul dritto (la pochette si rivolta dall'apertura nella fodera) e spingi fuori gli angoli.",
        "Il fondo è piatto. A ogni estremità la cucitura laterale arriva a metà della cucitura dell'angolo.",
      ],
    },
  ],
  legend: [
    { title: 'Fondo', text: 'piatto · tra le due cuciture degli angoli' },
    { title: 'Piega del fondo', text: 'il pezzo di 23 × 31 cm piegato a metà · nessuna cucitura sul fondo' },
    { title: 'Cuciture degli angoli', text: "cucite di traverso a 0,5 cm dal bordo, dopo aver tagliato dall'angolo un pezzetto di 3,5 × 2,5 cm" },
    { title: 'Cuciture laterali', text: "0,5 cm · ognuna arriva a metà di una cucitura dell'angolo" },
  ],
};

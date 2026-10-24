/* Estremità rifinite (guida «Come cucire una cerniera», sezione `tabs`) — testi italiani, tu. Stessa forma
   dell'inglese (zipper-tabs.text.js controlla). Linguetta = la striscia di stoffa sull'estremità; fermo = il
   finecorsa della cerniera. «zip» nelle etichette corte del disegno. Nessun numero, nessuna unità: «un po' più
   larga del nastro della cerniera». Piedino per cerniere. Mai «centrale» / «nascosta» (cerniera = anche la
   cerniera della porta). */
export default {
  ui: {
    fig: 'Fig. 2',
    title: 'Estremità rifinite',
    svgLabel: "Un disegno isometrico di come si rifiniscono le estremità di una cerniera con linguette di stoffa: una striscia un po' più larga del nastro della cerniera piegata come uno sbieco, due bordi al centro e poi a metà; infilata su ogni estremità della zip e cucita lungo i bordi piegati, subito dopo il fermo, mai sopra.",
    prev: 'Passo precedente',
    dot: (i, title) => (i ? `Passo ${i}: ${title}` : title),
    start: 'Passo passo →',
    next: 'Avanti →',
    overview: 'Panoramica',
    stepOf: (k, n) => `Passo ${k} di ${n}`,
    machine: (stitch) => `Macchina: ${stitch.toLowerCase()}`,
    inThisStep: 'In questo passo',
    takeApart: 'Solleva le linguette',
    putTogether: 'Rimetti le linguette',
    replay: '↻ Ripeti',
    parts: 'Parti',
    allSteps: 'Istruzioni passo passo',
    endView: 'SEZIONE',
  },
  stitches: { straight: 'Punto dritto' },
  labels: {
    strip: 'una striscia di stoffa',
    widerThanTape: "un po' più larga del nastro",
    edgesMiddle: 'bordi al centro',
    press: 'stira',
    inHalf: 'piega a metà',
    slipOn: "sull'estremità della zip",
    pastStop: 'subito dopo il fermo',
    alongEdge: 'lungo i bordi piegati',
    notOverStop: 'non sopra il fermo',
    otherEnd: "l'altra estremità, uguale",
    thenLined: 'poi come il primo modo',
  },
  steps: [
    {
      title: 'Estremità rifinite',
      text: 'Le due estremità della zip sono chiuse da piccole linguette di stoffa, cucite subito dopo i fermi. Tocca per sollevare le linguette.',
    },
    {
      title: 'Una striscia di stoffa',
      text: "Taglia una striscia di stoffa un po' più larga del nastro della cerniera, una per ogni estremità.",
      details: [
        "Taglia una striscia corta di stoffa un po' più larga del nastro della cerniera: la linguetta copre l'estremità della zip da un bordo all'altro.",
        'Te ne servono due: una per ogni estremità della zip.',
        "Ogni cartamodello dà una misura diversa; l'importante è che la striscia sia un po' più larga del nastro della cerniera.",
      ],
    },
    {
      title: 'Bordi al centro',
      text: 'Metti la striscia con il rovescio in su, piega due bordi opposti verso il centro e stira, come uno sbieco.',
      details: [
        'Metti la striscia con il rovescio in su.',
        'Piega due bordi opposti in modo che si incontrino al centro, rovescio contro rovescio.',
        'Stira le pieghe.',
      ],
    },
    {
      title: 'Piega a metà',
      text: "Piega la striscia a metà, con i bordi piegati all'interno, e stira. La linguetta è pronta: da un lato la piega, dall'altro i bordi piegati.",
      details: [
        "Piega la striscia a metà, in modo che i bordi piegati restino all'interno.",
        "Stira: ora la linguetta ha da un lato la piega e dall'altro i due bordi piegati.",
        'Prepara la seconda linguetta allo stesso modo.',
      ],
    },
    {
      title: "Sull'estremità",
      text: "Infila la linguetta sull'estremità della zip: l'estremità entra fino alla piega, e i bordi piegati arrivano subito dopo il fermo.",
      details: [
        "Apri un po' la linguetta e infilaci l'estremità della zip, fino alla piega.",
        'I bordi piegati arrivano subito dopo il fermo, non sopra.',
        "La linguetta sporge un po' da entrambi i lati della zip.",
      ],
    },
    {
      title: 'Cuci la linguetta',
      text: 'Con il piedino per cerniere, cuci lungo i bordi piegati, attraverso la linguetta e il nastro. Non cucire mai sopra il fermo o i denti.',
      details: [
        'Monta il piedino per cerniere: ti permette di cucire vicino ai bordi piegati.',
        'Cuci di traverso sulla linguetta, vicino ai bordi piegati, attraverso tutti gli strati e il nastro.',
        "La cucitura resta sul nastro, dopo il fermo: non cucire mai sopra il fermo o i denti. Spesso sono di metallo, e l'ago può rompersi.",
      ],
    },
    {
      title: "L'altra estremità",
      text: "Infila la seconda linguetta sull'altra estremità e cucila allo stesso modo, con il piedino per cerniere, dopo il fermo. Poi la zip si cuce come la cerniera con fodera.",
      details: [
        "Infila la seconda linguetta sull'altra estremità della zip, con i bordi piegati subito dopo il fermo.",
        'Con il piedino per cerniere, cuci lungo i bordi piegati, non sopra il fermo.',
        'Il resto si cuce come nel primo modo, la cerniera con fodera: il link è sotto questo disegno.',
      ],
    },
  ],
  legend: [
    { title: 'Linguetta', text: "striscia di stoffa piegata come uno sbieco · un po' più larga del nastro" },
    { title: 'Cucitura', text: 'lungo i bordi piegati, dopo il fermo' },
    { title: 'Fermo', text: 'mai cucito sopra' },
    { title: 'Zip', text: 'le sue estremità dentro le linguette' },
  ],
};

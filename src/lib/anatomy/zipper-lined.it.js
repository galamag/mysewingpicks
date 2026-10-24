/* Cerniera con fodera (tutorial «Come cucire una cerniera», sezione `lined`) — testi italiani. Stessa forma
   dell'inglese (zipper-lined.text.js lo controlla). tu; solo cm, virgola decimale, spazio unificatore prima di
   cm; solo i numeri della creatrice (la pochette): 20, 23, 0,5 cm. Nessuna impuntura lungo la cerniera; nessun
   piedino nominato (specifica 3.2). «zip» solo nelle etichette corte del disegno (come nella pochette). */
export default {
  ui: {
    fig: 'Fig. 1',
    title: 'Cerniera con fodera',
    svgLabel: "Un disegno isometrico di come si cuce la cerniera in una pochette foderata: l'esterno, la cerniera da 20 cm con il dritto in giù e la fodera con il dritto in giù, cuciti con una sola cucitura a 0,5 cm; la fodera aperta, esterno e fodera piegati a metà, l'altro lato della cerniera cucito nello stesso modo, e la cerniera aperta.",
    prev: 'Passo precedente',
    dot: (i, title) => (i ? `Passo ${i}: ${title}` : title),
    start: 'Passo passo →',
    next: 'Avanti →',
    overview: 'Panoramica',
    stepOf: (k, n) => `Passo ${k} di ${n}`,
    machine: (stitch) => `Macchina: ${stitch.toLowerCase()}`,
    inThisStep: 'In questo passo',
    takeApart: 'Chiudi la zip',
    putTogether: 'Apri la zip',
    replay: '↻ Ripeti',
    parts: 'Parti',
    allSteps: 'Istruzioni passo passo',
    endView: 'SEZIONE',
  },
  stitches: { straight: 'Punto dritto' },
  labels: {
    outerUp: 'esterno, dritto sopra',
    zipperDown: 'zip dritto sotto',
    cm20: '20 cm',
    cm23: '23 cm',
    endsShort: 'estremità prima dei bordi',
    liningDown: 'fodera dritto sotto',
    edgesLevel: 'bordo contro bordo',
    seam05: 'cucitura 0,5 cm',
    liningOut: 'apri la fodera',
    foldBoth: 'piega entrambi a metà',
    otherEnds: 'gli altri lati alla zip',
    otherSide: "l'altro lato",
    openZipper: 'apri la zip',
    readySides: 'ora le cuciture laterali',
  },
  steps: [
    {
      title: 'Cerniera con fodera',
      text: "La cerniera della pochette, cucita: l'esterno da una parte, la fodera dall'altra, una cucitura su ogni lato della cerniera — ed è aperta, pronta per le cuciture laterali. Tocca per chiudere la zip.",
    },
    {
      title: "La cerniera sull'esterno",
      text: "Appoggia l'esterno con il dritto in su. Metti la cerniera da 20 cm con il dritto in giù lungo il suo lato di 23 cm, al centro: le estremità non arrivano ai bordi laterali.",
      details: [
        "Appoggia l'esterno con il dritto in su.",
        'Metti la cerniera con il dritto in giù lungo un lato di 23 cm, il suo bordo sul bordo del tessuto.',
        'Centrala: la cerniera da 20 cm è più corta del lato, quindi le estremità non arrivano ai bordi laterali e restano fuori dalle cuciture laterali.',
      ],
    },
    {
      title: 'Sopra, la fodera',
      text: "Sopra metti la fodera con il dritto in giù, bordo contro bordo con l'esterno. Ora la cerniera è in mezzo.",
      details: [
        'Metti la fodera con il dritto in giù sopra la cerniera.',
        "Il suo bordo combacia con il bordo dell'esterno: esterno, cerniera, fodera — tre strati.",
        'Ferma gli strati con le clip per cucito.',
      ],
    },
    {
      title: 'Cuci il primo lato',
      text: 'Cuci attraverso tutti gli strati, a 0,5 cm dal bordo.',
      details: [
        "Cuci insieme l'esterno, la cerniera e la fodera, a 0,5 cm dal bordo.",
        'Nessuna impuntura lungo la cerniera.',
      ],
    },
    {
      title: 'Apri e piega',
      text: "Apri la fodera lontano dalla cerniera. Piega a metà l'esterno e la fodera, così i loro altri lati corti arrivano all'altro lato della cerniera.",
      details: [
        "Apri la fodera lontano dalla cerniera: l'esterno da una parte, la fodera dall'altra.",
        "Piega l'esterno a metà, dritto contro dritto, e la fodera nello stesso modo.",
        "I loro altri lati corti arrivano ora all'altro lato della cerniera: esterno, cerniera con il dritto in giù, fodera — come la prima volta.",
      ],
    },
    {
      title: 'Cuci il secondo lato',
      text: "Cuci l'altro lato della cerniera nello stesso modo, a 0,5 cm dal bordo. L'esterno e la fodera ora formano un anello.",
      details: [
        'Ferma gli strati con le clip e cuci attraverso tutti, a 0,5 cm dal bordo.',
        "L'esterno e la fodera ora formano un anello, uniti dalla cerniera su entrambi i lati.",
      ],
    },
    {
      title: 'Apri la cerniera',
      text: 'Apri la cerniera prima delle cuciture laterali: da lì poi si rivolta la pochette.',
      details: [
        "Fai scorrere il cursore fino all'altra estremità: la cerniera è aperta.",
        'Lasciala aperta: poi vengono le cuciture laterali, e la pochette si rivolta attraverso la cerniera.',
        'Le cuciture laterali e il rivoltare sono nella pagina della pochette — il link è sotto questo disegno.',
      ],
    },
  ],
  legend: [
    { title: 'Esterno', text: 'cotone · il suo lato di 23 cm va alla cerniera' },
    { title: 'Cerniera', text: '20 cm · al centro del lato di 23 cm, le estremità non arrivano ai bordi laterali' },
    { title: 'Fodera', text: "della stessa misura dell'esterno" },
    { title: 'Cuciture', text: '0,5 cm, una per ogni lato della cerniera · senza impuntura' },
  ],
};

/* Cerniera con patta (tutorial «Come cucire una cerniera», sezione `lapped`) — testi in italiano. Stessa forma
   dell'inglese (lo controlla zipper-lapped.text.js). Niente numeri né unità: il lato sotto ripiegato «un po' più stretto
   del margine», la cucitura «abbastanza lontano da evitare i denti e il cursore», l'imbastitura «con il punto più lungo».
   Il verso della cucitura e il punto da cui parte non si dicono (le fonti non concordano). Si dà del tu. MAI «centrale»
   né «nascosta» (trappole di ricerca: le cerniere delle porte). Nelle etichette brevi «zip». */
export default {
  ui: {
    fig: 'Fig. 5',
    title: 'Cerniera con patta',
    svgLabel: "Un disegno isometrico di come cucire una cerniera con patta in una cucitura: la cucitura cucita fino al segno del fermo in basso, con la fermatura, l'apertura imbastita con il punto più lungo e la cucitura aperta con il ferro; sul lato sotto il margine aperto e la zip cucita sopra a faccia in giù, vicino ai denti; la zip girata a faccia in su, accanto ai denti si forma una piega un po' più stretta del margine, cucita attraverso il margine e il nastro; la patta stesa sulla zip con la piega sulla linea di cucitura copre queste due cuciture; cucita con il piedino per cerniere lungo la patta e di traverso in basso, lontano dai denti e dal cursore; poi l'imbastitura scucita. Si vede una sola cucitura.",
    prev: 'Passo precedente',
    dot: (i, title) => (i ? `Passo ${i}: ${title}` : title),
    start: 'Passo passo →',
    next: 'Avanti →',
    overview: 'Panoramica',
    stepOf: (k, n) => `Passo ${k} di ${n}`,
    machine: (stitch) => `Macchina: ${stitch.toLowerCase()}`,
    inThisStep: 'In questo passo',
    takeApart: 'Guarda attraverso la stoffa',
    putTogether: 'Torna alla stoffa',
    replay: '↻ Ripeti',
    parts: 'Parti',
    allSteps: 'Istruzioni passo passo',
    endView: 'SEZIONE',
  },
  stitches: { straight: 'Punto dritto', basting: 'Punto più lungo' },
  labels: {
    rightSides: 'dritto contro dritto',
    markStop: 'segna il fermo in basso',
    toMark: 'cucitura fino al segno',
    backstitch: 'fermatura',
    baste: 'imbastisci: punto più lungo',
    openOut: 'apri',
    wrongUp: 'rovescio sopra',
    pressOpen: 'apri la cucitura col ferro',
    rightUp: 'dritto sopra',
    foldBack: 'ribalta la patta',
    foldOut: 'apri il margine',
    faceDown: 'zip a faccia in giù',
    teethBySeam: 'denti sulla linea di cucitura',
    nearTeeth: 'cuci vicino ai denti',
    allowanceOnly: 'solo margine e nastro',
    faceUp: 'zip a faccia in su',
    besideTeeth: 'una piega accanto ai denti',
    narrower: "un po' più stretta del margine",
    alongFold: 'cuci lungo la piega',
    overlapBack: 'riporta la patta',
    covers: 'copre la cucitura',
    belowStop: 'di traverso, sotto il fermo',
    pivot: 'gira, ago abbassato',
    clearTeeth: 'lontano da denti e cursore',
    unpick: "scuci l'imbastitura",
    oneLine: 'si vede una sola cucitura',
  },
  steps: [
    {
      title: 'Cerniera con patta',
      text: 'Un lato della cucitura, la patta, copre la zip: il suo bordo piegato sta sulla linea di cucitura, e si vede una sola cucitura, lungo questo lato e di traverso in basso. Tocca per guardare attraverso la stoffa.',
    },
    {
      title: 'Dritto contro dritto',
      text: "Metti i due pezzi dritto contro dritto. Appoggia la zip lungo la linea di cucitura e segna dov'è il suo fermo in basso: lì finisce l'apertura per la zip.",
      details: [
        'Prima rifinisci i bordi della cucitura, così non si sfilacciano.',
        'Metti i due pezzi dritto contro dritto, i bordi pari, e fissali con le clip.',
        "Appoggia la zip lungo la linea di cucitura e segna la linea di cucitura al suo fermo in basso: lì finisce l'apertura per la zip.",
      ],
    },
    {
      title: 'La cucitura fino al segno',
      text: 'Cuci la cucitura con il punto normale fino al segno e fai lì la fermatura, così la cucitura tiene dove finisce la zip.',
      details: [
        'Cuci la cucitura con il punto normale, sulla linea di cucitura, fino al segno.',
        'Fai la fermatura al segno: dove finisce la zip la cucitura non deve aprirsi.',
      ],
    },
    {
      title: "Imbastisci l'apertura",
      text: "Imposta il punto più lungo e chiudi l'apertura sulla stessa linea di cucitura, tra il segno e il bordo superiore. Questa imbastitura alla fine si scuce.",
      details: [
        "Imposta sulla macchina il punto più lungo: è un'imbastitura, dopo la scuci.",
        "Chiudi l'apertura sulla stessa linea di cucitura, tra il segno e il bordo superiore.",
        "L'imbastitura tiene i due lati dell'apertura sulla linea di cucitura mentre cuci la zip.",
      ],
    },
    {
      title: 'Apri la cucitura col ferro',
      text: 'Apri i pezzi, girali con il rovescio sopra e apri i margini di cucitura con il ferro, uno per lato, lungo tutta la cucitura.',
      details: [
        'Apri i pezzi e girali con il rovescio sopra.',
        'Apri i margini di cucitura con il ferro, uno per lato, lungo tutta la cucitura, anche la parte imbastita.',
      ],
    },
    {
      title: 'Ribalta la patta',
      text: "Gira il lavoro con il dritto sopra. Un lato dell'apertura, la patta, poi coprirà la zip; l'altro, il lato sotto, le sta sotto. Ribalta la patta perché non dia fastidio: l'imbastitura la tiene sulla linea di cucitura.",
      details: [
        'Gira il lavoro con il dritto sopra.',
        "Scegli la patta: il lato che coprirà la zip. L'altro lato è il lato sotto.",
        'Ribalta la patta sul lato sotto, così non finisce nella cucitura seguente.',
      ],
    },
    {
      title: 'La zip a faccia in giù',
      text: 'Sul lato sotto apri il margine, steso oltre la linea di cucitura. Appoggiaci la zip a faccia in giù, i denti sulla linea di cucitura, e appuntala a questo margine.',
      details: [
        "Apri il margine del lato sotto, steso oltre la linea di cucitura: sotto la zip c'è solo questo margine.",
        'Appoggia la zip a faccia in giù sul margine, i denti sulla linea di cucitura, il fermo in basso al segno.',
        'Appunta il nastro della zip al margine.',
      ],
    },
    {
      title: 'Cuci vicino ai denti',
      text: 'Con il piedino per cerniere cuci il nastro della zip al margine vicino ai denti, solo attraverso il nastro e il margine, per tutta la lunghezza della zip, ma mai sopra il fermo in basso.',
      details: [
        "Monta il piedino per cerniere: con lui l'ago cuce vicino alla zip.",
        'Cuci vicino ai denti, solo attraverso il nastro della zip e il margine.',
        'Cuci per tutta la lunghezza della zip, ma mai sopra il fermo in basso.',
      ],
    },
    {
      title: 'La zip a faccia in su',
      text: "Gira la zip a faccia in su: il margine si ripiega sotto, e proprio accanto ai denti si forma una piccola piega, un po' più stretta del margine di cucitura. Stira la piega.",
      details: [
        'Gira la zip a faccia in su: il margine si ripiega sotto la zip.',
        "Proprio accanto ai denti si forma una piccola piega, appena oltre la linea di cucitura: la parte ripiegata è un po' più stretta del margine di cucitura.",
        'Stira la piega.',
      ],
    },
    {
      title: 'Cuci lungo la piega',
      text: 'Con il piedino per cerniere cuci vicinissimo alla piega, solo attraverso il margine e il nastro della zip, per tutta la lunghezza della zip, ma mai sopra il fermo in basso.',
      details: [
        'Cuci vicinissimo alla piega, solo attraverso il margine e il nastro della zip: la patta resta ribaltata.',
        'Cuci per tutta la lunghezza della zip, ma mai sopra il fermo in basso.',
      ],
    },
    {
      title: 'La patta sulla zip',
      text: 'Riporta la patta sopra la zip, il suo bordo piegato sulla linea di cucitura: copre i denti e le due cuciture del lato sotto. Appuntala attraverso tutti gli strati.',
      details: [
        "Riporta la patta sopra la zip: l'imbastitura tiene il suo bordo piegato sulla linea di cucitura.",
        'La patta copre i denti e le due cuciture del lato sotto.',
        'Appunta la patta al nastro della zip sotto, attraverso tutti gli strati.',
      ],
    },
    {
      title: 'Cuci la patta',
      text: "Con il piedino per cerniere cuci lungo la patta e di traverso in basso, sotto il fermo, girando all'angolo con l'ago abbassato, attraverso tutti gli strati. Resta abbastanza lontano da evitare i denti e il cursore.",
      details: [
        'Cuci lungo la patta e di traverso in basso, sotto il fermo, attraverso tutti gli strati: abbastanza lontano da evitare i denti e il cursore.',
        "All'angolo fermati con l'ago abbassato nella stoffa, alza il piedino, gira il lavoro e continua.",
        'Non cucire mai sopra il fermo.',
      ],
    },
    {
      title: "Scuci l'imbastitura",
      text: "Scuci l'imbastitura sopra la zip e stira. La patta resta sopra la zip, e si vede una sola cucitura.",
      details: [
        "Scuci i punti dell'imbastitura sopra la zip.",
        'Stira sul dritto: la patta copre la zip, si vede solo la sua cucitura.',
      ],
    },
  ],
  legend: [
    { title: 'Stoffa', text: 'due pezzi uniti da una cucitura · il bordo piegato della patta sulla linea di cucitura' },
    { title: 'Cucitura della zip', text: 'una sola: lungo la patta e di traverso sotto il fermo' },
    { title: 'Cucitura', text: 'sotto la zip, con la fermatura al segno' },
    { title: 'Zip', text: 'sotto la patta, cucita due volte al margine del lato sotto' },
  ],
};

/* Cerniera invisibile (tutorial «Come cucire una cerniera», sezione `invisible`) — testi in italiano. Stessa forma
   dell'inglese (lo controlla zipper-invisible.text.js). Niente numeri né unità. «Dall'alto verso il basso» si dice: tutte
   le fonti concordano. Il piedino per cerniera invisibile si nomina, mai con link. Si dà del tu. MAI «nascosta» né
   «centrale» (trappola di ricerca: le cerniere delle porte). Nelle etichette brevi «zip». */
export default {
  ui: {
    fig: 'Fig. 6',
    title: 'Cerniera invisibile',
    svgLabel: "Un disegno isometrico di come cucire una cerniera invisibile in una cucitura: la cucitura lasciata aperta; la zip aperta e la spirale stirata piatta dal rovescio con un ferro appena tiepido; la zip a faccia in giù sul dritto di un pezzo, la spirale sulla linea di cucitura, cucita con il piedino per cerniera invisibile dall'alto verso il basso finché il piedino non tocca il cursore; l'altro lato allo stesso modo, la spirale nell'altra scanalatura, i bordi in alto allineati; la zip chiusa; la cucitura sotto cucita con il piedino per cerniere; le estremità del nastro cucite solo ai margini. Da fuori si vedono solo la linea di cucitura e il cursore.",
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
  stitches: { straight: 'Punto dritto' },
  labels: {
    seamOpen: 'lascia la cucitura aperta',
    zipperFirst: 'prima la zip',
    openZip: 'apri la zip',
    fromBack: 'spirale piatta dal rovescio',
    coolIron: 'ferro appena tiepido',
    faceDown: 'zip a faccia in giù',
    coilOnSeam: 'spirale sulla cucitura',
    oneGroove: 'spirale in una scanalatura',
    topDown: "dall'alto verso il basso",
    toPull: 'finché il piedino tocca il cursore',
    otherPiece: "l'altro pezzo, dritto sopra",
    freeHalf: 'metà libera a faccia in giù',
    topsLevel: 'bordi in alto allineati',
    notTwisted: 'senza attorcigliarla',
    otherGroove: "spirale nell'altra scanalatura",
    close: 'chiudi la zip',
    rightSides: 'dritto contro dritto',
    aboveSide: "un po' più in alto, di lato",
    zipperFoot: 'piedino per cerniere',
    tapeEnds: 'solo ai margini',
    rightUp: 'dritto sopra',
    onlyPull: 'solo cucitura e cursore',
  },
  steps: [
    {
      title: 'Cerniera invisibile',
      text: 'Da fuori la zip non si vede: solo la linea di cucitura e il cursore. Tocca per guardare attraverso la stoffa.',
    },
    {
      title: 'Lascia la cucitura aperta',
      text: 'Lascia la cucitura aperta: prima si cuce la cerniera invisibile, poi la cucitura sotto.',
      details: [
        'Non cucire ancora la cucitura: la zip va prima sui bordi aperti.',
        'La cucitura sotto la zip si cuce quando la zip è già attaccata.',
      ],
    },
    {
      title: 'Stira la spirale',
      text: 'Apri la zip. Dal rovescio, stira la spirale piatta con un ferro appena tiepido.',
      details: [
        "Prendi una cerniera invisibile un po' più lunga dell'apertura.",
        'Apri la zip del tutto.',
        'Girala sul rovescio e stira la spirale piatta con un ferro appena tiepido: un ferro caldo scioglie la spirale.',
      ],
    },
    {
      title: 'La zip a faccia in giù',
      text: 'Appoggia la zip aperta a faccia in giù sul dritto di un pezzo, la spirale proprio sulla linea di cucitura, e appuntala.',
      details: [
        'Appoggia una metà della zip aperta a faccia in giù sul dritto di un pezzo.',
        'La spirale proprio sulla linea di cucitura, il nastro sul margine.',
        'Appunta il nastro con gli spilli.',
      ],
    },
    {
      title: 'Il primo lato',
      text: "Monta il piedino per cerniera invisibile, con la spirale in una delle sue scanalature. Cuci dall'alto verso il basso finché il piedino non tocca il cursore, e fai la fermatura.",
      details: [
        'Monta il piedino per cerniera invisibile: la spirale scorre in una delle due scanalature sotto il piedino.',
        "Cuci dall'alto verso il basso, vicino alla spirale, finché il piedino non tocca il cursore.",
        'Fai lì la fermatura.',
        'Tieni la spirale nella scanalatura: se la cucitura prende la spirale, la zip non si chiude.',
      ],
    },
    {
      title: "L'altro lato",
      text: "Appoggia l'altro pezzo con il dritto sopra e gira il primo pezzo sopra, dritto contro dritto, con il margine e la metà cucita della zip ripiegati indietro. La metà libera della zip sta a faccia in giù sull'altro pezzo, la spirale sulla linea di cucitura.",
      details: [
        "Appoggia l'altro pezzo con il dritto sopra.",
        'Gira il primo pezzo sopra, dritto contro dritto, con il margine e la metà cucita della zip ripiegati indietro.',
        "Appoggia la metà libera della zip a faccia in giù sul dritto dell'altro pezzo, la spirale proprio sulla linea di cucitura.",
        'Fai combaciare i bordi in alto ed eventuali cuciture trasversali, e appoggia la zip senza attorcigliarla. Appunta.',
      ],
    },
    {
      title: "Cuci l'altro lato",
      text: "Con la spirale nell'altra scanalatura del piedino per cerniera invisibile, cuci dall'alto verso il basso finché il piedino non tocca il cursore, e fai la fermatura.",
      details: [
        "Metti la spirale nell'altra scanalatura del piedino.",
        "Cuci dall'alto verso il basso, vicino alla spirale, finché il piedino non tocca il cursore.",
        'Fai lì la fermatura. La spirale resta fuori dalla cucitura.',
      ],
    },
    {
      title: 'Chiudi la zip',
      text: 'Chiudi la zip: il cursore arriva in cima.',
      details: [
        'Chiudi la zip fino in fondo.',
        'Scorre bene se la spirale non è presa nella cucitura.',
      ],
    },
    {
      title: 'La cucitura sotto',
      text: "Metti i pezzi dritto contro dritto e passa al piedino per cerniere. Cuci la cucitura sotto la zip, cominciando un po' più in alto e di lato rispetto alla fine della cucitura della zip.",
      details: [
        'Metti i pezzi dritto contro dritto, i bordi pari.',
        'Passa al piedino per cerniere normale.',
        "Comincia un po' più in alto e di lato rispetto alla fine della cucitura della zip, e cuci il resto della cucitura.",
      ],
    },
    {
      title: 'Le estremità del nastro',
      text: 'Apri i margini e cuci le estremità del nastro della zip solo ai margini, non ai pezzi.',
      details: [
        'Apri i margini.',
        'Cuci ogni estremità del nastro solo al suo margine, non al pezzo.',
      ],
    },
    {
      title: 'Dritto sopra',
      text: 'Apri i pezzi e girali con il dritto sopra. Da fuori si vedono solo la linea di cucitura e il cursore.',
      details: [
        'Apri i pezzi e girali con il dritto sopra.',
        'Da fuori si vedono solo la linea di cucitura e il cursore.',
      ],
    },
  ],
  legend: [
    { title: 'Stoffa', text: 'due pezzi uniti sulla linea di cucitura · nessuna cucitura in vista' },
    { title: 'Linea di cucitura', text: 'la spirale ci sta dentro · sotto la zip, una cucitura normale' },
    { title: 'Zip', text: 'sotto la stoffa · il nastro cucito solo ai margini' },
    { title: 'Cursore', text: "l'unica parte della zip che si vede" },
  ],
};

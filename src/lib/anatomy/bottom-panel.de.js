/* Separater Boden (Anleitung „Taschenboden“, Abschnitt `panel`) — deutsche Texte. Dieselbe Form wie Englisch
   (bottom-panel.text.js prüft das). Keine Zahlen: Der Abschnitt hat noch kein Projekt der Näherin, und die
   Quellen nennen keine; die Methode nur in Worten (Mitten durch Falten und Bügeln markieren, zuerst Markierung
   auf Markierung, die Nahtzugabe der Wände an den Ecken bis knapp vor die Naht einschneiden, Seite für Seite
   bis eine Nahtzugabe vor der Ecke nähen). Duzen. */
export default {
  ui: {
    fig: 'Abb. 4',
    title: 'Separater Boden',
    svgLabel: 'Eine isometrische Zeichnung, wie man einen separaten Boden einnäht: die Wände zu einem Schlauch genäht, die Mitten von Boden und Schlauch durch Falten markiert, der Schlauch auf links auf dem Boden, Markierung auf Markierung und mit Klammern fixiert, die Nahtzugabe der Wände an den Ecken eingeschnitten, der Boden Seite für Seite eingenäht, die Tasche gewendet – mit flachem Boden.',
    prev: 'Vorheriger Schritt',
    dot: (i, title) => (i ? `Schritt ${i}: ${title}` : title),
    start: 'Schritte →',
    next: 'Weiter →',
    overview: 'Übersicht',
    stepOf: (k, n) => `Schritt ${k} von ${n}`,
    machine: (stitch) => `Maschine: ${stitch}`,
    inThisStep: 'In diesem Schritt',
    takeApart: 'Hinstellen',
    putTogether: 'Boden zeigen',
    replay: '↻ Noch einmal',
    parts: 'Teile',
    allSteps: 'Schritt-für-Schritt-Anleitung',
    endView: 'QUERSCHNITT',
  },
  stitches: { straight: 'Geradstich' },
  labels: {
    rightSides: 'rechts auf rechts',
    bothSides: 'beide Seiten nähen',
    aTube: 'ein Schlauch, beidseitig offen',
    foldCrease: 'falten, Bruch bügeln',
    markMiddle: 'jede Mitte markieren',
    seamMark: 'Seitennaht = Markierung',
    insideOut: 'auf links gewendet',
    markOnMark: 'Markierung auf Markierung',
    clipBetween: 'dann dazwischen klammern',
    clipCorner: 'in die Ecke einschneiden',
    notThrough: 'nicht in die Naht',
    backstitch: 'verriegeln',
    oneSide: 'Seite für Seite',
    stopTurn: 'stopp und drehen',
    allRound: 'rundherum',
    turnOut: 'auf rechts wenden',
    flatBottom: 'ein flacher Boden',
    baseSeam: 'Naht rund um den Boden',
  },
  steps: [
    {
      title: 'Separater Boden',
      text: 'Der Taschenboden, die Tasche steht kopf: Der Boden ist ein eigenes Teil, hier aus einem anderen Stoff, und rundherum an die Wände genäht. Tippe auf die Tasche, um sie hinzustellen.',
    },
    {
      title: 'Wände zum Schlauch nähen',
      text: 'Lege das Vorderteil rechts auf rechts auf das Rückenteil und nähe beide Seiten: ein Schlauch, oben und unten offen. Der Boden ist ein eigenes Teil.',
      details: [
        'Lege das Vorderteil rechts auf rechts auf das Rückenteil und fixiere es mit Klammern.',
        'Nähe beide Seiten von oben bis unten.',
        'Auch unten bleibt der Schlauch offen: Der Boden ist ein eigenes Teil und wird später eingenäht.',
        'Sind die Wände aus einem Stück zugeschnitten, schließt eine einzige Naht den Schlauch.',
      ],
    },
    {
      title: 'Mitten markieren',
      text: 'Falte den Boden zur Hälfte und bügle den Bruch, dann falte ihn andersherum zur Hälfte: Markiere die Mitte jeder Seite. Falte auch den Schlauch zur Hälfte und bügle den Bruch: Die Brüche und die Seitennähte markieren seine Mitten.',
      details: [
        'Falte den Boden zur Hälfte und bügle den Bruch mit dem Bügeleisen oder streiche ihn mit den Fingern glatt.',
        'Öffne ihn, falte ihn andersherum zur Hälfte und bügle wieder.',
        'Setze an jeder Seite eine Markierung in die Mitte, am Rand, wo ein Bruch auf ihn trifft.',
        'Falte den Schlauch zur Hälfte, Seitennaht auf Seitennaht, und bügle: Die Brüche markieren die Mitte von Vorder- und Rückenteil.',
        'Auch die Seitennähte sind Markierungen: Der Schlauch ist wie der Boden in Viertel geteilt.',
      ],
    },
    {
      title: 'Markierungen aufeinander',
      text: 'Wende den Schlauch auf links und setze ihn rechts auf rechts auf den Boden, die Kanten bündig. Lege zuerst Markierung auf Markierung, die Seitennähte und die Brüche auf die Mitten des Bodens, und klammere dann dazwischen.',
      details: [
        'Der Schlauch ist auf links gewendet, der Boden liegt mit der rechten Seite nach oben: Die rechten Seiten liegen aufeinander.',
        'Lege die Kanten von Schlauch und Boden rundherum bündig; die Nahtzugabe der Wände liegt auf dem Rand des Bodens.',
        'Zuerst Markierung auf Markierung: jede Seitennaht auf die Mitte einer kurzen Seite, jeden Bruch auf die Mitte einer langen Seite.',
        'Fixiere zuerst die Markierungen mit Klammern, dann dazwischen.',
      ],
    },
    {
      title: 'Ecken einschneiden',
      text: 'Schneide an jeder Ecke des Bodens die Nahtzugabe der Wände gerade in die Ecke ein, bis knapp vor die Nahtlinie, nicht in die Naht: So kommen die Wände um die Ecke.',
      details: [
        'Suche die Stellen, an denen die Ecken des Bodens auf die Wände treffen.',
        'Schneide die Nahtzugabe der Wände in die Ecke ein, bis knapp vor die Nahtlinie: nicht in die Naht.',
        'So öffnet sich die Zugabe und liegt rund um die Ecke flach, und die Ecke bleibt spitz.',
        'Schneide alle Ecken genauso ein.',
      ],
    },
    {
      title: 'Boden einnähen',
      text: 'Nähe Seite für Seite: Beginne mit Verriegeln, halte eine Nahtzugabe vor der Ecke mit der Nadel unten an, dreh die Arbeit um die Ecke und nähe die nächste Seite.',
      details: [
        'Nähe mit dem Schlauch auf links, auf der Nahtlinie.',
        'Beginne in der Mitte einer Seite und verriegle den Nahtanfang.',
        'Halte eine Nahtzugabe vor der Ecke an, die Nadel bleibt im Stoff.',
        'Hebe das Füßchen, dreh die Arbeit um die Ecke, senke das Füßchen und nähe die nächste Seite.',
        'Nimm die Klammern ab, wenn du zu ihnen kommst, und nähe rundherum; am Ende wieder verriegeln.',
      ],
    },
    {
      title: 'Wenden',
      text: 'Wende die Tasche auf rechts und forme die Ecken aus: ein flacher Boden, rundherum an die Wände genäht.',
      details: [
        'Wende die Tasche auf rechts und forme die Ecken aus.',
        'Der Boden liegt flach, und die Naht läuft um seinen Rand.',
        'Für einen festen Boden kommt die Verstärkung auf den Boden: Bügeleinlage, die vor dem Einnähen aufgebügelt wird, oder später ein fester Einlegeboden.',
      ],
    },
  ],
  legend: [
    { title: 'Boden', text: 'ein eigenes Teil · hier aus einem anderen Stoff' },
    { title: 'Bodennaht', text: 'verbindet die Wände rundherum mit dem Boden' },
    { title: 'Ecken', text: 'Nahtzugabe der Wände eingeschnitten, so bleibt die Ecke spitz' },
    { title: 'Seitennähte', text: 'jede trifft auf die Mitte einer kurzen Seite des Bodens' },
  ],
};

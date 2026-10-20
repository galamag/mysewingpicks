/* Ausgeschnittene Ecken (Anleitung „Taschenboden“, Abschnitt `cut-out`) — deutsche Texte. Dieselbe
   Form wie Englisch (bottom-cutout.text.js prüft das). Nur Zentimeter, Dezimalkomma, geschütztes
   Leerzeichen vor der Einheit; nur die Zahlen der Macherin — 23 × 31, 0,5 und 3,5 × 2,5 cm
   (Kosmetiktasche). Anrede: du. */
export default {
  ui: {
    fig: 'Abb. 2',
    title: 'Ausgeschnittene Ecken',
    svgLabel: 'Eine isometrische Zeichnung, wie ausgeschnittene Ecken entstehen: das Stück zur Hälfte gefaltet und an den Seiten genäht, aus jeder unteren Ecke ein Stück von 3,5 × 2,5 cm ausgeschnitten, jede Ecke so aufgefaltet, dass die Seitennaht auf dem Bodenbruch liegt, und quer abgenäht, die Tasche gewendet – mit flachem Boden.',
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
    cm23: '23 cm',
    cm31: '31 cm',
    rightSides: 'rechts auf rechts',
    foldBottom: 'der Bruch ist der Boden',
    seam05: 'Naht 0,5 cm',
    cm35: '3,5 cm',
    cm25: '2,5 cm',
    cutBoth: 'durch beide Lagen schneiden',
    seamOnFold: 'Naht auf den Bruch',
    sewAcross: 'quer abnähen',
    bothCorners: 'beide Ecken',
    turnOut: 'auf rechts wenden',
    flatBottom: 'ein flacher Boden',
    cornerSeam: 'Ecknaht',
  },
  steps: [
    {
      title: 'Ausgeschnittene Ecken',
      text: 'Der Boden der Kosmetiktasche, die Tasche steht kopf: ein flacher Boden mit einer kurzen Quernaht an jedem Ende, dort, wo die Seitennaht auf den Bodenbruch trifft. Tippe auf die Tasche, um sie hinzustellen.',
    },
    {
      title: 'Zur Hälfte falten',
      text: 'Die Kosmetiktasche ist ein einziges Stück von 23 × 31 cm. Falte es quer zur Hälfte, rechts auf rechts: Der Bruch ist der Boden.',
      details: [
        'Leg das Stück von 23 × 31 cm mit der rechten Seite nach oben hin.',
        'Falte es quer zur Hälfte, rechts auf rechts. Der Bruch ist der Boden der Tasche – dort gibt es keine Naht.',
        'Das Futter der Kosmetiktasche ist dasselbe Stück von 23 × 31 cm und wird genauso genäht.',
      ],
    },
    {
      title: 'Seiten nähen',
      text: 'Nähe beide Seiten mit 0,5 cm Nahtzugabe, von oben bis zum Bruch.',
      details: [
        'Fixiere die Seiten mit Klammern.',
        'Nähe beide Seitennähte 0,5 cm von der Kante, bis ganz hinunter zum Bruch.',
        'Bei der Kosmetiktasche ist vorher der Reißverschluss eingenäht, und in einer Seitennaht des Futters bleibt eine Wendeöffnung; die Ecken entstehen genauso.',
      ],
    },
    {
      title: 'Ecken ausschneiden',
      text: 'Schneide aus jeder unteren Ecke ein Stück von 3,5 × 2,5 cm aus: 3,5 cm entlang des Bodens, 2,5 cm entlang der Seitennaht.',
      details: [
        'Zeichne in jede untere Ecke ein Rechteck von 3,5 × 2,5 cm: 3,5 cm entlang des Bodenbruchs, 2,5 cm die Seitennaht hinauf.',
        'Schneide es durch beide Lagen aus.',
        'Bei der Kosmetiktasche sind es vier Ecken: zwei am Außenteil, zwei am Futter.',
      ],
    },
    {
      title: 'Ecke auffalten',
      text: 'Falte jede ausgeschnittene Ecke auf und leg sie so flach, dass die Seitennaht auf dem Bodenbruch liegt: Die Schnittkanten bilden eine gerade Linie.',
      details: [
        'Falte die ausgeschnittene Ecke auf, indem du Vorder- und Rückseite auseinanderziehst.',
        'Leg sie so flach, dass die Seitennaht genau auf dem Bodenbruch liegt.',
        'Die Schnittkanten bilden jetzt eine gerade Linie quer über die Ecke.',
      ],
    },
    {
      title: 'Quer abnähen',
      text: 'Nähe jede Ecke quer ab, 0,5 cm von der Schnittkante.',
      details: [
        'Nähe quer über die Ecke, 0,5 cm von der Kante.',
        'Genauso die zweite Ecke – bei der Kosmetiktasche auch die beiden Ecken des Futters.',
      ],
    },
    {
      title: 'Wenden',
      text: 'Wende die Tasche auf rechts: Sie hat einen flachen Boden, mit einer kurzen Ecknaht an jedem Ende.',
      details: [
        'Wende die Tasche auf rechts (die Kosmetiktasche durch die Öffnung im Futter) und drück die Ecken aus.',
        'Der Boden ist flach. An jedem Ende trifft die Seitennaht auf die Mitte der Ecknaht.',
      ],
    },
  ],
  legend: [
    { title: 'Boden', text: 'flach · zwischen den beiden Ecknähten' },
    { title: 'Bodenbruch', text: 'das Stück von 23 × 31 cm zur Hälfte gefaltet · keine Naht am Boden' },
    { title: 'Ecknähte', text: 'quer genäht, 0,5 cm von der Kante, nachdem aus der Ecke ein Stück von 3,5 × 2,5 cm ausgeschnitten wurde' },
    { title: 'Seitennähte', text: '0,5 cm · jede trifft auf die Mitte einer Ecknaht' },
  ],
};

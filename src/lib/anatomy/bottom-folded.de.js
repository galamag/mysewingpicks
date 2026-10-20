/* Eingefalteter Boden (Anleitung „Taschenboden“, Abschnitt `folded`) — deutsche Texte. Dieselbe Form
   wie Englisch (bottom-folded.text.js prüft das). Anrede du; nur Zentimeter, Dezimalkomma, geschütztes
   Leerzeichen vor cm; nur die Zahlen der Macherin — 6, 12 und 0,5 cm (Tote Bag). */
export default {
  ui: {
    fig: 'Abb. 1',
    title: 'Eingefalteter Boden',
    svgLabel: 'Eine isometrische Zeichnung, wie ein eingefalteter Taschenboden entsteht: der Mittelbruch, zwei Bruchkanten, 6 cm daneben abgesteppt, der eingeschlagene Boden, die Seitennähte durch ihn hindurch und die gewendete Tasche.',
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
    foldPress: 'mittig falten, bügeln',
    centreCrease: 'Mittelbruch',
    cm6: '6 cm',
    rightSides: 'rechts auf rechts',
    stitchFold: 'knapp am Bruch steppen',
    bottom12: 'Boden 12 cm',
    liftEnds: 'beide Enden an den Bruchkanten anheben',
    foldsIn: 'Boden klappt nach innen',
    centreInside: 'Mitte 6 cm nach innen',
    seam05: 'Naht 0,5 cm',
    layers4: 'hier 4 Lagen',
    turnOut: 'auf rechts wenden',
    openUp: 'öffnen',
    base12: 'Boden 12 cm',
    cornersForm: 'Ecken entstehen von selbst',
  },
  steps: [
    {
      title: 'Der eingefaltete Boden',
      text: 'Der Boden der Tote Bag, die Tasche steht kopf: eine flache, 12 cm breite Standfläche zwischen zwei abgesteppten Bruchkanten, und Ecken, die von selbst entstehen – ohne Eckennähte. Tippe auf die Tasche, um sie hinzustellen.',
    },
    {
      title: 'Mittelbruch und Linien',
      text: 'Falte das Teil quer in der Mitte, bügle einen Bruch ein und klappe es wieder auf. Miss vom Bruch aus 6 cm zu jedem Ende hin ab und zeichne quer eine Linie.',
      details: [
        'Die Tasche wird aus einem Stück zugeschnitten und quer in der Mitte gefaltet: Der Boden liegt in der Mitte des Teils.',
        'Falte es quer in der Mitte und bügle einen Bruch ein. Klappe es wieder auf: Der Bruch ist die Mitte des Bodens.',
        'Miss vom Bruch aus 6 cm zu jedem Ende hin ab und zeichne mit einem selbstlöschenden Markierstift eine Linie über die ganze Breite des Teils.',
      ],
    },
    {
      title: 'An jeder Linie absteppen',
      text: 'Falte entlang der ersten Linie, rechts auf rechts, und steppe knapp am Bruch. Klappe das Teil auf und mach dasselbe an der zweiten Linie: zwei abgesteppte Bruchkanten, 12 cm voneinander entfernt.',
      details: [
        'Falte das Teil entlang der ersten Linie, rechts auf rechts, und steppe knapp am Bruch über die ganze Breite. Klappe es wieder auf.',
        'Falte und steppe die zweite Linie genauso.',
        'Die beiden abgesteppten Bruchkanten, 12 cm voneinander entfernt, sind die Kanten des Bodens; der Mittelbruch ist seine Mitte. Im nächsten Schritt knickt das Teil an diesen Kanten ab.',
      ],
    },
    {
      title: 'Boden einschlagen',
      text: 'Hebe beide Enden an den abgesteppten Bruchkanten hoch und führe sie zusammen: Der Boden klappt nach innen, und der Mittelbruch wandert 6 cm nach innen. Leg alles flach hin.',
      details: [
        'Leg das Teil mit der rechten Seite nach oben hin und hebe beide Enden an, sodass es an den beiden abgesteppten Bruchkanten abknickt.',
        'Führe die Enden zusammen. Der 12 cm breite Boden klappt nach innen, und der Mittelbruch liegt innen, 6 cm hoch zwischen den Lagen – wie der Boden einer Papiertüte.',
        'Leg das Teil flach hin, rechts auf rechts. Die abgesteppten Bruchkanten bilden jetzt die Unterkante.',
      ],
    },
    {
      title: 'Seiten nähen',
      text: 'Lass den Boden eingeschlagen und nähe beide Seiten mit 0,5 cm Nahtzugabe – durch alle Lagen, unten sind es vier.',
      details: [
        'Fixiere die Seiten mit Klammern, damit der eingeschlagene Boden an seinem Platz bleibt.',
        'Nähe beide Seitennähte 0,5 cm von der Kante entfernt bis ganz nach unten. Unten geht die Naht durch vier Lagen – Vorderteil, die beiden Hälften des eingeschlagenen Bodens und Rückteil. Lass die Oberkante offen.',
        'Bei der Tote Bag wird das Futter genauso genäht – nur in einer seiner Seitennähte bleibt eine Öffnung, durch die du die Tasche später wendest.',
      ],
    },
    {
      title: 'Wenden',
      text: 'Wende die Tasche auf rechts und öffne sie: Der Boden entfaltet sich zu einer flachen, 12 cm breiten Standfläche, und die Ecken entstehen von selbst.',
      details: [
        'Wende die Tasche durch die obere Öffnung auf rechts.',
        'Öffne sie und drück den Boden nach außen. Der eingeschlagene Boden entfaltet sich zu einer flachen, 12 cm breiten Standfläche, und wo die Seitennähte ihn gefasst haben, entstehen von selbst saubere Ecken – zusätzliche Nähte an den Ecken sind nicht nötig.',
      ],
    },
  ],
  legend: [
    { title: 'Standfläche', text: 'flach, 12 cm breit: der Boden zwischen den beiden abgesteppten Bruchkanten' },
    { title: 'Abgesteppte Bruchkanten', text: 'je eine Bruchkante, knapp an der Kante abgesteppt, 6 cm neben dem Mittelbruch · die langen Kanten der Standfläche' },
    { title: 'Mittelbruch', text: 'die Mitte des Bodens · vor den Seitennähten 6 cm nach innen eingeschlagen' },
    { title: 'Seitennähte', text: '0,5 cm, mit eingeschlagenem Boden genäht · unten vier Lagen' },
    { title: 'Ecken', text: 'entstehen von selbst, wo die Seitennähte den eingeschlagenen Boden gefasst haben · keine Eckennähte' },
  ],
};

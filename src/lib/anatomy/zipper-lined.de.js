/* Reißverschluss mit Futter (Anleitung „Reißverschluss einnähen“, Abschnitt `lined`) — deutsche Texte. Gleiche
   Form wie Englisch (zipper-lined.text.js prüft das). du; nur cm, Dezimalkomma, geschütztes Leerzeichen vor cm;
   nur die Zahlen der Macherin (Kosmetiktasche): 20, 23, 0,5 cm. Kein Absteppen am Reißverschluss; kein Nähfuß
   genannt (Spezifikation 3.2). „RV“ nur in den kurzen Beschriftungen der Zeichnung (wie bei der Kosmetiktasche). */
export default {
  ui: {
    fig: 'Abb. 1',
    title: 'Reißverschluss mit Futter',
    svgLabel: 'Eine isometrische Zeichnung, wie der Reißverschluss in eine gefütterte Kosmetiktasche eingenäht wird: Außenteil, der Reißverschluss von 20 cm mit der rechten Seite nach unten und das Futter mit der rechten Seite nach unten, mit einer Naht von 0,5 cm genäht; das Futter weggeklappt, Außenteil und Futter jeweils zur Hälfte gefaltet, die andere Seite des Reißverschlusses genauso genäht und der Reißverschluss geöffnet.',
    prev: 'Vorheriger Schritt',
    dot: (i, title) => (i ? `Schritt ${i}: ${title}` : title),
    start: 'Schritte →',
    next: 'Weiter →',
    overview: 'Übersicht',
    stepOf: (k, n) => `Schritt ${k} von ${n}`,
    machine: (stitch) => `Maschine: ${stitch}`,
    inThisStep: 'In diesem Schritt',
    takeApart: 'RV schließen',
    putTogether: 'RV öffnen',
    replay: '↻ Noch einmal',
    parts: 'Teile',
    allSteps: 'Schritt-für-Schritt-Anleitung',
    endView: 'QUERSCHNITT',
  },
  stitches: { straight: 'Geradstich' },
  labels: {
    outerUp: 'außen, rechts nach oben',
    zipperDown: 'RV rechts nach unten',
    cm20: '20 cm',
    cm23: '23 cm',
    endsShort: 'Enden nicht bis zum Rand',
    liningDown: 'Futter rechts nach unten',
    edgesLevel: 'Kante auf Kante',
    seam05: 'Naht 0,5 cm',
    liningOut: 'Futter wegklappen',
    foldBoth: 'beide zur Hälfte falten',
    otherEnds: 'andere Enden an den RV',
    otherSide: 'die andere Seite',
    openZipper: 'RV öffnen',
    readySides: 'jetzt die Seitennähte',
  },
  steps: [
    {
      title: 'Reißverschluss mit Futter',
      text: 'Der Reißverschluss der Kosmetiktasche ist eingenäht: auf der einen Seite das Außenteil, auf der anderen das Futter, eine Naht an jeder Seite des Reißverschlusses – und er ist offen, bereit für die Seitennähte. Tippe, um ihn zu schließen.',
    },
    {
      title: 'RV aufs Außenteil',
      text: 'Leg das Außenteil mit der rechten Seite nach oben. Leg den Reißverschluss von 20 cm mit der rechten Seite nach unten mittig an seine Seite von 23 cm: Seine Enden reichen nicht bis an die Seitenkanten.',
      details: [
        'Leg das Außenteil mit der rechten Seite nach oben.',
        'Leg den Reißverschluss mit der rechten Seite nach unten an eine Seite von 23 cm, seine Kante auf der Stoffkante.',
        'Leg ihn mittig: Der Reißverschluss von 20 cm ist kürzer als die Seite, seine Enden reichen also nicht bis an die Seitenkanten und kommen nicht in die Seitennähte.',
      ],
    },
    {
      title: 'Futter darauf',
      text: 'Leg das Futter mit der rechten Seite nach unten darauf, Kante auf Kante mit dem Außenteil. Der Reißverschluss liegt jetzt dazwischen.',
      details: [
        'Leg das Futter mit der rechten Seite nach unten auf den Reißverschluss.',
        'Seine Kante liegt genau auf der Kante des Außenteils: Außenteil, Reißverschluss, Futter – drei Lagen.',
        'Halte die Lagen mit Stoffklammern zusammen.',
      ],
    },
    {
      title: 'Erste Seite nähen',
      text: 'Nähe durch alle Lagen, 0,5 cm von der Kante.',
      details: [
        'Nähe Außenteil, Reißverschluss und Futter zusammen, 0,5 cm von der Kante.',
        'Am Reißverschluss wird nicht abgesteppt.',
      ],
    },
    {
      title: 'Wegklappen und falten',
      text: 'Klapp das Futter vom Reißverschluss weg. Falte das Außenteil und das Futter jeweils zur Hälfte, sodass ihre anderen kurzen Seiten an die andere Seite des Reißverschlusses kommen.',
      details: [
        'Klapp das Futter vom Reißverschluss weg: das Außenteil auf der einen Seite, das Futter auf der anderen.',
        'Falte das Außenteil zur Hälfte, rechts auf rechts, das Futter genauso.',
        'Ihre anderen kurzen Seiten treffen jetzt auf die andere Seite des Reißverschlusses: Außenteil, Reißverschluss mit der rechten Seite nach unten, Futter – wie beim ersten Mal.',
      ],
    },
    {
      title: 'Zweite Seite nähen',
      text: 'Näh die andere Seite des Reißverschlusses genauso an, 0,5 cm von der Kante. Außenteil und Futter sind jetzt ein Ring.',
      details: [
        'Halte die Lagen mit Stoffklammern zusammen und nähe durch alle, 0,5 cm von der Kante.',
        'Außenteil und Futter sind jetzt ein Ring, an beiden Seiten durch den Reißverschluss verbunden.',
      ],
    },
    {
      title: 'Reißverschluss öffnen',
      text: 'Öffne den Reißverschluss vor den Seitennähten: Durch ihn wird die Tasche später gewendet.',
      details: [
        'Zieh den Schieber bis ans andere Ende: Der Reißverschluss ist offen.',
        'Lass ihn offen: Als Nächstes kommen die Seitennähte, und die Tasche wird durch den Reißverschluss gewendet.',
        'Seitennähte und Wenden findest du auf der Seite der Kosmetiktasche – der Link steht unter dieser Abbildung.',
      ],
    },
  ],
  legend: [
    { title: 'Außenteil', text: 'Baumwolle · die Seite von 23 cm kommt an den Reißverschluss' },
    { title: 'Reißverschluss', text: '20 cm · mittig an der Seite von 23 cm, die Enden reichen nicht bis an die Seitenkanten' },
    { title: 'Futter', text: 'so groß wie das Außenteil' },
    { title: 'Nähte', text: '0,5 cm, eine an jeder Seite des Reißverschlusses · ohne Absteppen' },
  ],
};

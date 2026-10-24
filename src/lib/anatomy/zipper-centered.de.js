/* Reißverschluss mittig einnähen (Anleitung „Reißverschluss einnähen“, Abschnitt `centered`) — deutsche Texte. Gleiche
   Form wie Englisch (zipper-centered.text.js prüft das). Keine Zahlen, keine Einheiten; Heften = „mit dem längsten
   Stich“; die Nährichtung wird nicht genannt (die Quellen sind uneins) — nur „in dieselbe Richtung“. Anrede: du.
   Nie „verdeckt“ (Suchfalle). */
export default {
  ui: {
    fig: 'Abb. 4',
    title: 'Reißverschluss mittig einnähen',
    svgLabel: 'Eine isometrische Zeichnung, wie man einen Reißverschluss mittig in eine Naht einnäht: die Naht bis zur Markierung am unteren Stopper genäht und verriegelt, der Schlitz mit dem längsten Stich geheftet und die Naht auseinandergebügelt; der Reißverschluss mit der rechten Seite nach unten auf den Nahtzugaben, die Zähne auf der Nahtlinie; von rechts mit dem Reißverschlussfuß an beiden Seiten und quer unten abgesteppt, in dieselbe Richtung; dann die Heftnaht aufgetrennt, sodass sich die beiden Stoffkanten über den Zähnen treffen.',
    prev: 'Vorheriger Schritt',
    dot: (i, title) => (i ? `Schritt ${i}: ${title}` : title),
    start: 'Schritte →',
    next: 'Weiter →',
    overview: 'Übersicht',
    stepOf: (k, n) => `Schritt ${k} von ${n}`,
    machine: (stitch) => `Maschine: ${stitch}`,
    inThisStep: 'In diesem Schritt',
    takeApart: 'Durch den Stoff sehen',
    putTogether: 'Zurück zum Stoff',
    replay: '↻ Noch einmal',
    parts: 'Teile',
    allSteps: 'Schritt-für-Schritt-Anleitung',
    endView: 'QUERSCHNITT',
  },
  stitches: { straight: 'Geradstich', basting: 'Längster Stich' },
  labels: {
    rightSides: 'rechts auf rechts',
    markStop: 'unteren Stopper markieren',
    toMark: 'Naht bis zur Markierung',
    backstitch: 'verriegeln',
    baste: 'heften: längster Stich',
    openOut: 'aufklappen',
    wrongUp: 'linke Seite nach oben',
    pressOpen: 'Naht auseinanderbügeln',
    faceDown: 'RV rechts nach unten',
    teethOnSeam: 'Zähne auf der Nahtlinie',
    allowancesOnly: 'nur an die Nahtzugaben stecken',
    rightUp: 'rechte Seite nach oben',
    belowStop: 'quer, unter dem Stopper',
    pivot: 'drehen, Nadel unten',
    needleDown: 'Nadel unten, Fuß hoch',
    movePull: 'Schieber hinter den Fuß',
    otherSide: 'die andere Seite',
    sameWay: 'in dieselbe Richtung',
    unpick: 'Heftnaht auftrennen',
    meet: 'Kanten treffen sich über den Zähnen',
  },
  steps: [
    {
      title: 'Reißverschluss mittig einnähen',
      text: 'Die beiden Stoffkanten der Naht treffen sich über den Zähnen des Reißverschlusses; an jeder Seite und quer unten läuft eine Steppnaht. Tippe, um durch den Stoff zu sehen.',
    },
    {
      title: 'Rechts auf rechts',
      text: 'Leg die beiden Teile rechts auf rechts. Leg den Reißverschluss an die Nahtlinie und markiere, wo sein unterer Stopper ist: Dort endet der Schlitz für den Reißverschluss.',
      details: [
        'Versäubere zuerst die Schnittkanten der Naht, damit sie nicht ausfransen.',
        'Leg die beiden Teile rechts auf rechts, die Kanten bündig, und fixiere sie mit Klammern.',
        'Leg den Reißverschluss an die Nahtlinie und markiere die Nahtlinie am unteren Stopper: Dort endet der Schlitz für den Reißverschluss.',
      ],
    },
    {
      title: 'Die Naht bis zur Markierung',
      text: 'Näh die Naht mit normalem Stich bis zur Markierung und verriegle dort, damit die Naht hält, wo der Reißverschluss endet.',
      details: [
        'Näh die Naht mit normalem Stich auf der Nahtlinie bis zur Markierung.',
        'Verriegle an der Markierung: Wo der Reißverschluss endet, darf die Naht nicht aufgehen.',
      ],
    },
    {
      title: 'Den Schlitz heften',
      text: 'Stell den längsten Stich ein und näh den Schlitz auf derselben Nahtlinie zu, von der Markierung bis zur Oberkante. Diese Heftnaht kommt am Ende wieder heraus.',
      details: [
        'Stell an der Maschine den längsten Stich ein: Das ist eine Heftnaht, sie wird später wieder aufgetrennt.',
        'Näh den Schlitz auf derselben Nahtlinie zu, von der Markierung bis zur Oberkante.',
        'Die Heftnaht hält den Schlitz geschlossen, während du den Reißverschluss einnähst.',
      ],
    },
    {
      title: 'Die Naht auseinanderbügeln',
      text: 'Klapp die Teile auf, dreh sie auf die linke Seite und bügle die Nahtzugaben auseinander, zu beiden Seiten, über die ganze Naht.',
      details: [
        'Klapp die Teile auf und dreh sie mit der linken Seite nach oben.',
        'Bügle die Nahtzugaben auseinander, zu beiden Seiten, über die ganze Naht, auch den gehefteten Teil.',
      ],
    },
    {
      title: 'Reißverschluss rechts nach unten',
      text: 'Leg den Reißverschluss mit der rechten Seite nach unten auf die Nahtzugaben, die Zähne genau auf der Nahtlinie, und steck ihn nur an den Nahtzugaben fest.',
      details: [
        'Leg den Reißverschluss mit der rechten Seite nach unten auf die auseinandergebügelten Nahtzugaben.',
        'Die Zähne genau auf die Nahtlinie, der untere Stopper an der Markierung.',
        'Steck das Reißverschlussband nur an den Nahtzugaben fest, nicht an den Teilen darunter.',
      ],
    },
    {
      title: 'Eine Seite',
      text: 'Dreh die Arbeit auf die rechte Seite. Steppe mit dem Reißverschlussfuß durch alle Lagen eine Seite und quer unter dem Stopper ab; an der Ecke drehst du mit gesenkter Nadel.',
      details: [
        'Dreh die Arbeit mit der rechten Seite nach oben: Der Reißverschluss liegt darunter, seine Zähne unter der Nahtlinie.',
        'Setz den Reißverschlussfuß ein: Mit ihm näht die Nadel dicht am Reißverschluss.',
        'Steppe an einer Seite entlang, die ganze Zeit im gleichen Abstand zur Naht, und quer unter dem Stopper: nie über den Stopper.',
        'An der Ecke halte mit gesenkter Nadel an, stell den Nähfuß hoch, dreh die Arbeit und näh weiter.',
      ],
    },
    {
      title: 'Den Schieber wegschieben',
      text: 'Wenn der Schieber im Weg ist, halte mit gesenkter Nadel an, stell den Nähfuß hoch und schieb den Schieber hinter den Fuß. Senk den Fuß und näh die Seite mit dem Reißverschlussfuß fertig.',
      details: [
        'Ein paar Stiche vor dem Schieber halte an: Nadel unten, im Stoff.',
        'Stell den Nähfuß hoch und schieb den Schieber hinter den Fuß, hinter die Nadel.',
        'Senk den Fuß und näh die Seite mit dem Reißverschlussfuß fertig.',
      ],
    },
    {
      title: 'Die andere Seite',
      text: 'Steppe die andere Seite und den Rest unten genauso mit dem Reißverschlussfuß ab, an der Ecke mit gesenkter Nadel drehen, in dieselbe Richtung wie die erste Seite.',
      details: [
        'Steppe an der anderen Seite entlang, im gleichen Abstand zur Naht, und die andere Hälfte quer unter dem Stopper.',
        'Dreh an der Ecke mit gesenkter Nadel.',
        'Näh beide Seiten in dieselbe Richtung.',
      ],
    },
    {
      title: 'Die Heftnaht auftrennen',
      text: 'Trenn die Heftnaht über dem Reißverschluss auf und bügle. Die beiden Stoffkanten treffen sich über den Zähnen, vom Reißverschluss sieht man nur ein wenig.',
      details: [
        'Trenn die Stiche der Heftnaht über dem Reißverschluss auf.',
        'Bügle von rechts: Die beiden Stoffkanten treffen sich über den Zähnen.',
      ],
    },
  ],
  legend: [
    { title: 'Stoff', text: 'zwei Teile, mit einer Naht verbunden · ihre Kanten treffen sich über den Zähnen' },
    { title: 'Steppnaht', text: 'an beiden Seiten und quer unter dem Stopper · im gleichen Abstand zur Naht' },
    { title: 'Naht', text: 'unter dem Reißverschluss, an der Markierung verriegelt' },
    { title: 'Reißverschluss', text: 'rechts nach unten unter der Naht, die Zähne auf der Nahtlinie' },
  ],
};

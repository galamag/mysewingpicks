/* Reißverschluss mit Übertritt (Anleitung „Reißverschluss einnähen“, Abschnitt `lapped`) — deutsche Texte. Gleiche
   Form wie Englisch (zipper-lapped.text.js prüft das). Keine Zahlen, keine Einheiten: der Untertritt „etwas schmaler als
   die Nahtzugabe“ umgebügelt, die Steppnaht „weit genug, um Zähne und Schieber nicht zu treffen“, Heften „mit dem
   längsten Stich“. Wohin die Naht läuft und wo sie anfängt, wird nicht gesagt (die Quellen sind uneins). Anrede: du.
   Nie „verdeckt“ (Suchfalle): „deckt … ab“. Keine Abkürzung „RV“ in diesem Abschnitt. */
export default {
  ui: {
    fig: 'Abb. 5',
    title: 'Reißverschluss mit Übertritt',
    svgLabel: 'Eine isometrische Zeichnung, wie man einen Reißverschluss mit Übertritt in eine Naht einnäht: die Naht bis zur Markierung am unteren Stopper genäht und verriegelt, der Schlitz mit dem längsten Stich geheftet und die Naht auseinandergebügelt; am Untertritt die Nahtzugabe nach außen geklappt und der Reißverschluss mit der rechten Seite nach unten dicht an den Zähnen daran gesteppt; der Reißverschluss nach oben gedreht, sodass an den Zähnen eine Bruchkante entsteht, etwas schmaler als die Nahtzugabe, und knapp daran durch Nahtzugabe und Reißverschlussband gesteppt; der Übertritt mit der Bruchkante auf der Nahtlinie über den Reißverschluss gelegt, er deckt beide Steppnähte ab; mit dem Reißverschlussfuß am Übertritt entlang und quer unten abgesteppt, weit genug von Zähnen und Schieber; dann die Heftnaht aufgetrennt. Nur eine Steppnaht ist zu sehen.',
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
    rightUp: 'rechte Seite nach oben',
    foldBack: 'Übertritt zurückklappen',
    foldOut: 'Nahtzugabe nach außen klappen',
    faceDown: 'Reißverschluss rechts nach unten',
    teethBySeam: 'Zähne an der Nahtlinie',
    nearTeeth: 'dicht an den Zähnen steppen',
    allowanceOnly: 'nur Nahtzugabe und Band',
    faceUp: 'Reißverschluss rechts nach oben',
    besideTeeth: 'Bruchkante an den Zähnen',
    narrower: 'etwas schmaler als die Nahtzugabe',
    alongFold: 'an der Bruchkante steppen',
    overlapBack: 'Übertritt zurücklegen',
    covers: 'er deckt die Steppnaht ab',
    belowStop: 'quer, unter dem Stopper',
    pivot: 'drehen, Nadel unten',
    clearTeeth: 'neben Zähnen und Schieber',
    unpick: 'Heftnaht auftrennen',
    oneLine: 'nur eine Steppnaht zu sehen',
  },
  steps: [
    {
      title: 'Reißverschluss mit Übertritt',
      text: 'Eine Seite der Naht, der Übertritt, deckt den Reißverschluss ab: Seine Bruchkante liegt auf der Nahtlinie, und nur eine Steppnaht ist zu sehen, an dieser Seite entlang und quer unten. Tippe, um durch den Stoff zu sehen.',
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
      text: 'Stell den längsten Stich ein und näh den Schlitz auf derselben Nahtlinie zu, zwischen der Markierung und der Oberkante. Diese Heftnaht kommt am Ende wieder heraus.',
      details: [
        'Stell an der Maschine den längsten Stich ein: Das ist eine Heftnaht, sie wird später wieder aufgetrennt.',
        'Näh den Schlitz auf derselben Nahtlinie zu, zwischen der Markierung und der Oberkante.',
        'Die Heftnaht hält beide Seiten des Schlitzes auf der Nahtlinie, während du den Reißverschluss einnähst.',
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
      title: 'Den Übertritt zurückklappen',
      text: 'Dreh die Arbeit auf die rechte Seite. Eine Seite des Schlitzes, der Übertritt, deckt später den Reißverschluss ab; die andere, der Untertritt, liegt darunter. Klapp den Übertritt zurück, aus dem Weg: Die Heftnaht hält ihn auf der Nahtlinie.',
      details: [
        'Dreh die Arbeit mit der rechten Seite nach oben.',
        'Wähl den Übertritt: die Seite, die den Reißverschluss abdeckt. Die andere Seite ist der Untertritt.',
        'Klapp den Übertritt über den Untertritt zurück, damit er nicht in die nächste Steppnaht kommt.',
      ],
    },
    {
      title: 'Reißverschluss rechts nach unten',
      text: 'Klapp am Untertritt die Nahtzugabe nach außen, flach über die Nahtlinie hinaus. Leg den Reißverschluss mit der rechten Seite nach unten darauf, die Zähne an der Nahtlinie, und steck ihn an dieser Nahtzugabe fest.',
      details: [
        'Klapp die Nahtzugabe des Untertritts nach außen, flach über die Nahtlinie hinaus: Unter dem Reißverschluss liegt nur diese Nahtzugabe.',
        'Leg den Reißverschluss mit der rechten Seite nach unten auf die Nahtzugabe, die Zähne an der Nahtlinie, der untere Stopper an der Markierung.',
        'Steck das Reißverschlussband an der Nahtzugabe fest.',
      ],
    },
    {
      title: 'Dicht an den Zähnen steppen',
      text: 'Steppe mit dem Reißverschlussfuß das Reißverschlussband dicht an den Zähnen an die Nahtzugabe, nur durch Band und Nahtzugabe, über die ganze Länge des Reißverschlusses, aber nie über den unteren Stopper.',
      details: [
        'Setz den Reißverschlussfuß ein: Mit ihm näht die Nadel dicht am Reißverschluss.',
        'Steppe dicht an den Zähnen, nur durch Reißverschlussband und Nahtzugabe.',
        'Steppe über die ganze Länge des Reißverschlusses, aber nie über den unteren Stopper.',
      ],
    },
    {
      title: 'Reißverschluss rechts nach oben',
      text: 'Dreh den Reißverschluss mit der rechten Seite nach oben: Die Nahtzugabe legt sich darunter um, und dicht an den Zähnen entsteht eine kleine Bruchkante, etwas schmaler als die Nahtzugabe. Bügle die Bruchkante.',
      details: [
        'Dreh den Reißverschluss mit der rechten Seite nach oben: Die Nahtzugabe legt sich unter den Reißverschluss um.',
        'Dicht neben den Zähnen entsteht eine kleine Bruchkante, knapp über der Nahtlinie: Der umgelegte Teil ist etwas schmaler als die Nahtzugabe.',
        'Bügle die Bruchkante.',
      ],
    },
    {
      title: 'An der Bruchkante steppen',
      text: 'Steppe mit dem Reißverschlussfuß knapp an der Bruchkante, nur durch Nahtzugabe und Reißverschlussband, über die ganze Länge des Reißverschlusses, aber nie über den unteren Stopper.',
      details: [
        'Steppe knapp an der Bruchkante, nur durch Nahtzugabe und Reißverschlussband: Der Übertritt bleibt zurückgeklappt.',
        'Steppe über die ganze Länge des Reißverschlusses, aber nie über den unteren Stopper.',
      ],
    },
    {
      title: 'Der Übertritt über den Reißverschluss',
      text: 'Leg den Übertritt zurück über den Reißverschluss, seine Bruchkante auf der Nahtlinie: Er deckt die Zähne und beide Steppnähte des Untertritts ab. Steck ihn durch alle Lagen fest.',
      details: [
        'Leg den Übertritt zurück über den Reißverschluss: Die Heftnaht hält seine Bruchkante auf der Nahtlinie.',
        'Der Übertritt deckt die Zähne und beide Steppnähte des Untertritts ab.',
        'Steck den Übertritt am Reißverschlussband darunter fest, durch alle Lagen.',
      ],
    },
    {
      title: 'Den Übertritt absteppen',
      text: 'Steppe mit dem Reißverschlussfuß durch alle Lagen am Übertritt entlang und quer unter dem Stopper; an der Ecke drehst du mit gesenkter Nadel. Bleib weit genug weg, um Zähne und Schieber nicht zu treffen.',
      details: [
        'Steppe am Übertritt entlang und quer unter dem Stopper, durch alle Lagen: weit genug, um Zähne und Schieber nicht zu treffen.',
        'An der Ecke halte mit gesenkter Nadel an, stell den Nähfuß hoch, dreh die Arbeit und näh weiter.',
        'Steppe nie über den Stopper.',
      ],
    },
    {
      title: 'Die Heftnaht auftrennen',
      text: 'Trenn die Heftnaht über dem Reißverschluss auf und bügle. Der Übertritt bleibt über dem Reißverschluss, und nur eine Steppnaht ist zu sehen.',
      details: [
        'Trenn die Stiche der Heftnaht über dem Reißverschluss auf.',
        'Bügle von rechts: Der Übertritt deckt den Reißverschluss ab, nur seine eigene Steppnaht ist zu sehen.',
      ],
    },
  ],
  legend: [
    { title: 'Stoff', text: 'zwei Teile, mit einer Naht verbunden · die Bruchkante des Übertritts auf der Nahtlinie' },
    { title: 'Steppnaht', text: 'nur eine: am Übertritt entlang und quer unter dem Stopper' },
    { title: 'Naht', text: 'unter dem Reißverschluss, an der Markierung verriegelt' },
    { title: 'Reißverschluss', text: 'unter dem Übertritt, zweimal an die Nahtzugabe des Untertritts gesteppt' },
  ],
};

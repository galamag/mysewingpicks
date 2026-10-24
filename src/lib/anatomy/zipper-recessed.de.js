/* Reißverschluss mit Blende (Anleitung „Reißverschluss einnähen“, Abschnitt `recessed`) — deutsche Texte. Dieselbe Form
   wie die englischen (zipper-recessed.text.js prüft das). du-Form; „Blende“ = der Streifen mit dem Reißverschluss,
   „Abschlussstück“ = das Stoffstück am Ende, „Stopper“ = der Metallstopper. „RV“ nur in den Beschriftungen der
   Zeichnung. Keine Zahl, keine Einheit: Breite der Streifen und wie viel länger der Reißverschluss ist — in Worten. Die
   Blende kommt ans FUTTER, nicht ans Außenteil. Nähfuß: der Reißverschlussfuß (Windman-Set). */
export default {
  ui: {
    fig: 'Abb. 3',
    title: 'Reißverschluss mit Blende',
    svgLabel: 'Eine isometrische Zeichnung, wie ein Reißverschluss mit Blende oben in eine Tasche mit Futter kommt: vier Streifen so lang wie die Oberkante der Tasche, jedes Reißverschlussband rechts auf rechts zwischen zwei davon genäht, gewendet und knapp neben den Zähnen abgesteppt; die Enden mit Abschlussstücken aus Stoff eingefasst; die Blende ans Futter genäht, Mitte auf Mitte. In der Tasche liegt der Reißverschluss unterhalb der Kante, und die Tasche lässt sich weit öffnen.',
    prev: 'Vorheriger Schritt',
    dot: (i, title) => (i ? `Schritt ${i}: ${title}` : title),
    start: 'Schritte →',
    next: 'Weiter →',
    overview: 'Übersicht',
    stepOf: (k, n) => `Schritt ${k} von ${n}`,
    machine: (stitch) => `Maschine: ${stitch}`,
    inThisStep: 'In diesem Schritt',
    takeApart: 'Reißverschluss öffnen',
    putTogether: 'Reißverschluss schließen',
    replay: '↻ Noch einmal',
    parts: 'Teile',
    allSteps: 'Schritt-für-Schritt-Anleitung',
    endView: 'QUERSCHNITT',
  },
  stitches: { straight: 'Geradstich' },
  labels: {
    fourStrips: 'vier Streifen',
    topLength: 'so lang wie die Oberkante',
    zipperLonger: 'RV etwas länger',
    stripUp: 'Streifen rechts oben',
    zipperDown: 'RV rechts unten',
    stripDown: 'zweiter Streifen rechts unten',
    alongEdge: 'an der Kante entlang',
    turnOut: 'wenden',
    pressAway: 'von den Zähnen weg bügeln',
    nearTeeth: 'knapp neben den Zähnen',
    otherSide: 'andere Seite genauso',
    endsTabs: 'Enden: wie die zweite Variante',
    notOverStop: 'nicht über den Stopper',
    toLining: 'ans Futter',
    middles: 'Mitte auf Mitte',
    asUsual: 'dann Außenteil und Futter wie gewohnt',
    belowEdge: 'unterhalb der Kante',
    opensWide: 'öffnet sich weit',
  },
  steps: [
    {
      title: 'Reißverschluss mit Blende',
      text: 'Der Reißverschluss sitzt in einer Blende unterhalb der Oberkante der Tasche, und die Blende ist ans Futter genäht. Tippe, um den Reißverschluss zu öffnen: Die Tasche lässt sich weit öffnen.',
    },
    {
      title: 'Vier Streifen und ein Reißverschluss',
      text: 'Schneide vier Streifen zu, so lang wie die Oberkante der Tasche, zwei für jede Seite des Reißverschlusses, und einen Reißverschluss, etwas länger als die Streifen.',
      details: [
        'Schneide vier Stoffstreifen zu, so lang wie die Oberkante der Tasche: zwei für jede Seite des Reißverschlusses.',
        'Die Breite der Streifen ist in jedem Schnittmuster anders: Je breiter sie sind, desto tiefer sitzt der Reißverschluss in der Tasche.',
        'Viele Schnittmuster bügeln Einlage auf die Streifen, damit die Blende ihre Form behält.',
        'Schneide den Reißverschluss etwas länger als die Streifen zu; einen Endlosreißverschluss kannst du auf jede Länge kürzen.',
      ],
    },
    {
      title: 'Zwischen zwei Streifen',
      text: 'Lege einen Streifen mit der rechten Seite nach oben, den Reißverschluss mit der rechten Seite nach unten darauf, Kante auf Kante, und den zweiten Streifen mit der rechten Seite nach unten obenauf: rechts auf rechts.',
      details: [
        'Lege einen Streifen mit der rechten Seite nach oben.',
        'Lege den Reißverschluss mit der rechten Seite nach unten darauf, die Kante des Bandes an der langen Kante des Streifens.',
        'Lege den zweiten Streifen mit der rechten Seite nach unten obenauf, Kante auf Kante: Das Reißverschlussband liegt jetzt zwischen zwei Streifen, rechts auf rechts. Halte die Lagen mit Stoffklammern zusammen.',
      ],
    },
    {
      title: 'An der Kante nähen',
      text: 'Nähe mit dem Reißverschlussfuß an der Kante entlang, durch die drei Lagen: den Streifen, das Reißverschlussband und den zweiten Streifen.',
      details: [
        'Setze den Reißverschlussfuß ein: Mit ihm nähst du dicht an den Zähnen.',
        'Nähe an der langen Kante entlang, durch beide Streifen und das Reißverschlussband.',
        'Die Naht bleibt auf dem Band, neben den Zähnen, nicht darauf.',
      ],
    },
    {
      title: 'Wenden und bügeln',
      text: 'Klappe die Streifen vom Reißverschluss weg, links auf links, und bügle sie von den Zähnen weg.',
      details: [
        'Klappe die Streifen vom Reißverschluss weg: Der Reißverschluss liegt jetzt mit der rechten Seite nach oben daneben.',
        'Die beiden Streifen liegen links auf links, die Naht verschwindet zwischen ihnen.',
        'Bügle die Streifen von den Zähnen weg, damit der Stoff nicht in den Reißverschluss gerät.',
      ],
    },
    {
      title: 'Knapp neben den Zähnen absteppen',
      text: 'Steppe den Streifen mit dem Reißverschlussfuß knapp neben den Zähnen ab, durch beide Streifen.',
      details: [
        'Steppe mit dem Reißverschlussfuß die Kante des Streifens am Reißverschluss ab, knapp neben den Zähnen.',
        'Die Steppnaht hält beide Streifen flach und den Stoff von den Zähnen fern.',
      ],
    },
    {
      title: 'Die andere Seite',
      text: 'Nähe das andere Reißverschlussband genauso zwischen die zwei anderen Streifen, mit dem Reißverschlussfuß: nähen, wenden, bügeln, absteppen.',
      details: [
        'Lege die zwei anderen Streifen rechts auf rechts um das andere Reißverschlussband und nähe mit dem Reißverschlussfuß an der Kante entlang.',
        'Wende sie, bügle sie von den Zähnen weg und steppe knapp neben den Zähnen ab.',
        'Die Blende ist fertig: der Reißverschluss in der Mitte, auf jeder Seite zwei Streifen.',
      ],
    },
    {
      title: 'Die Enden einfassen',
      text: 'Fasse beide Enden des Reißverschlusses mit Abschlussstücken aus Stoff ein, wie in der zweiten Variante, „Reißverschluss-Enden einfassen“: direkt hinter jedem Stopper abgesteppt, nie darüber.',
      details: [
        'Mach zwei Abschlussstücke aus Stoff und schiebe sie über die Enden des Reißverschlusses, wie in der zweiten Variante, „Reißverschluss-Enden einfassen“.',
        'Steppe jedes Abschlussstück mit dem Reißverschlussfuß direkt hinter dem Stopper ab, nicht über den Stopper: Er ist oft aus Metall, und die Nadel kann brechen.',
      ],
    },
    {
      title: 'Ans Futter',
      text: 'Nähe die Blende ans Futter, nicht ans Außenteil: jede lange Kante der Blende an die Oberkante eines Futterteils, rechts auf rechts, Mitte auf Mitte.',
      details: [
        'Markiere die Mitte der langen Kanten der Blende und der Oberkanten der Futterteile.',
        'Lege eine lange Kante der Blende rechts auf rechts an die Oberkante eines Futterteils, Mitte auf Mitte, und halte sie mit Stoffklammern fest.',
        'Nähe an der Kante entlang. Nähe die andere lange Kante genauso an das andere Futterteil.',
        'Die Blende kommt ans Futter, nicht ans Außenteil: So liegt sie innen in der Tasche, unterhalb der Kante.',
      ],
    },
    {
      title: 'Die Tasche',
      text: 'Dann werden Außenteil und Futter an der Oberkante wie gewohnt bei einer Tasche mit Futter verbunden. Der Reißverschluss liegt unterhalb der Kante, und die Tasche lässt sich weit öffnen.',
      details: [
        'Verbinde Außenteil und Futter an der Oberkante wie gewohnt bei einer Tasche mit Futter; die Blende kommt mit dem Futter mit.',
        'Der Reißverschluss liegt unterhalb der Oberkante der Tasche.',
        'Geöffnet fällt die Blende an die Seiten, und die Tasche lässt sich weit öffnen.',
      ],
    },
  ],
  legend: [
    { title: 'Blende', text: 'vier Streifen so lang wie die Oberkante der Tasche · der Reißverschluss in der Mitte' },
    { title: 'Reißverschluss', text: 'etwas länger als die Streifen · die Enden mit Abschlussstücken eingefasst' },
    { title: 'Futter', text: 'die Blende ist daran genäht' },
    { title: 'Außenteil', text: 'wie gewohnt mit dem Futter verbunden' },
  ],
};

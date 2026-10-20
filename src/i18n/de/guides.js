/* German texts of the sewing guides (src/data/guides.js), by slug.
   Same fields as GUIDE_FIELDS in src/i18n/content.js — the build checks it.
   du; non-breaking spaces (U+00A0) between number and unit; the maker's numbers only (spec 3.2). */
export default {
  'line-a-bag': {
    title: 'Futter einnähen: nähen, wenden, absteppen',
    blurb: 'So kommt das Futter in die Tasche: eine Naht rundherum an der Oberkante, dann wird alles durch eine Öffnung im Futter gewendet. Gezeigt an der Tote Bag und am Stoffkorb – mit zwei Wegen, die Wendeöffnung zu schließen.',
    pageTitle: 'Futter einnähen: Tasche wenden, Wendeöffnung schließen',
    pageDescription: 'Futter in eine Tasche einnähen: Futter mit 8 cm Wendeöffnung, obere Naht 0,5 cm, durch die Öffnung wenden, Wendeöffnung schließen und absteppen. Jeder Schritt animiert.',
    heading: 'Tasche mit Futter nähen: wenden und Wendeöffnung schließen',
    teaser: 'Futter nähen, die Tasche durch die Wendeöffnung wenden, sie schließen und absteppen – jeder Schritt animiert.',
    needsIntro: 'Garn, Stoffklammern, Fadenknipser, Bügeleisen und Nähmaschine – die Werkzeuge, die ich persönlich für diese Schritte empfehle. Wenn du die Öffnung von Hand schließt, brauchst du außerdem eine Nähnadel.',
  },
  'bag-bottom': {
    title: 'Taschenboden: Ecken abnähen und mehr',
    blurb: 'Wie eine Tasche einen Boden bekommt, auf dem sie steht – auf vier Wegen: der eingefaltete Boden der Tote Bag (zwei Bruchkanten 6 cm neben der Mitte abgesteppt, die Ecken entstehen von selbst), ausgeschnittene Ecken, Ecken abnähen und ein separater Boden. Jeder Weg ist animiert, mit einem Rat, wann du ihn wählst.',
    pageTitle: 'Taschenboden nähen: Ecken abnähen, Boden einnähen & mehr',
    pageDescription: 'Taschenboden nähen auf vier Wegen: eingefalteter Boden (Bruchkanten 6 cm neben der Mitte, 12 cm breite Standfläche), ausgeschnittene Ecken, Ecken abnähen und separater Boden. Jeder Schritt animiert.',
    heading: 'Taschenboden nähen: Ecken abnähen und drei andere Wege',
    teaser: 'Vier Wege zu einem flachen Taschenboden – eingefaltet, ausgeschnittene Ecken, Ecken abnähen, separater Boden – jeder Schritt animiert.',
    needsIntro: 'Bügeleisen, Patchwork-Lineal, selbstlöschender Markierstift, Garn, Stoffklammern, Nähmaschine und Stoffschere – die Werkzeuge, die ich persönlich für diese Schritte empfehle.',
    sections: {
      folded: {
        title: 'Eingefalteter Boden',
        line: 'Zwei abgesteppte Bruchkanten, vor den Seitennähten nach innen eingeschlagen – die Ecken entstehen von selbst.',
        choose: 'Wenn die Tasche aus einem Stück zugeschnitten und quer in der Mitte gefaltet wird und du einen flachen Boden ohne Eckennähte möchtest: Die Ecken entstehen beim Wenden von selbst.',
      },
      'cut-out': {
        title: 'Ausgeschnittene Ecken',
        line: 'Aus jeder unteren Ecke wird ein kleines Stück ausgeschnitten, dann wird die Ecke aufgefaltet und quer abgenäht.',
        choose: 'Wenn die Tasche unten gefaltet ist, zuerst die Seiten genäht werden und du einen flachen Boden möchtest: Mit ausgeschnittenen Ecken treffen die Nähte sauber aufeinander, und es eignet sich auch für dickere Stoffe.',
        note: 'Beim Stoffkorb werden die Ecken gleich beim Zuschneiden ausgeschnitten: aus einem Quadrat von 60 × 60 cm an jeder Ecke ein Quadrat von 20 × 20 cm.',
      },
      boxed: {
        title: 'Ecken abnähen',
        line: 'Erst wird die Tasche genäht, dann wird jede untere Ecke zu einem Dreieck flach gelegt und quer abgenäht.',
        choose: 'Wenn du die Tiefe erst ausprobieren möchtest: Vorher wird nichts ausgeschnitten, also kannst du den Boden noch tiefer nähen. Die Ecke ist fest, und die Methode passt gut zu leichten Stoffen.',
      },
      panel: {
        title: 'Separater Boden',
        line: 'Der Boden ist ein eigenes Teil und wird rundherum unten an die Wände genäht.',
        choose: 'Wenn du einen flachen, stabilen Boden möchtest, einen Boden aus einem anderen Stoff oder einen festen Boden mit Bügeleinlage oder Einlegeboden. Auch runde und ovale Böden werden so eingenäht, nur schneidest du die Nahtzugabe der Wände entlang der ganzen Rundung ein.',
      },
    },
  },
};

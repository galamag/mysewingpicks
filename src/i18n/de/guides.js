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
    blurb: 'Wie eine Tasche einen Boden bekommt, auf dem sie steht. Zuerst der eingefaltete Boden der Tote Bag: zwei Bruchkanten, 6 cm neben der Mitte abgesteppt und nach innen eingeschlagen – die Ecken entstehen von selbst.',
    pageTitle: 'Taschenboden nähen: Ecken abnähen, Boden einnähen & mehr',
    pageDescription: 'Taschenboden nähen: Der eingefaltete Boden der Tote Bag (zwei Bruchkanten 6 cm neben dem Mittelbruch, eingeschlagen, Seitennähte 0,5 cm) wird gewendet zur flachen, 12 cm breiten Standfläche. Jeder Schritt animiert.',
    heading: 'Taschenboden nähen: Ecken abnähen und drei andere Wege',
    teaser: 'Ein flacher Taschenboden mit Ecken, die von selbst entstehen – jeder Schritt animiert.',
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
        choose: 'Wenn die Tasche unten gefaltet ist, zuerst die Seiten genäht werden und du einen flachen Boden möchtest: Mit ausgeschnittenen Ecken treffen die Nähte sauber aufeinander, und es eignet sich auch für dickere Stoffe. Beim Stoffkorb werden die Ecken gleich beim Zuschneiden ausgeschnitten: aus einem Quadrat von 60 × 60 cm an jeder Ecke ein Quadrat von 20 × 20 cm.',
      },
    },
  },
};

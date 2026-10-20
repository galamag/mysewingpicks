/* Italian texts of the sewing guides (src/data/guides.js), by slug.
   Same fields as GUIDE_FIELDS in src/i18n/content.js — the build checks it.
   tu; non-breaking spaces (U+00A0) between number and unit; the maker's numbers only (spec 3.2). */
export default {
  'line-a-bag': {
    title: 'Fodera: cucire, rivoltare, impunturare',
    blurb: "Come si monta la fodera: una sola cucitura lungo tutto il bordo superiore, poi tutta la borsa si rivolta da un'apertura nella fodera. Lo vedi sulla tote bag e sul cestino di stoffa, con due modi per chiudere l'apertura.",
    pageTitle: 'Come cucire la fodera di una borsa e rivoltarla',
    pageDescription: "Come foderare una borsa di stoffa: fodera con un'apertura di 8 cm, cucitura in alto a 0,5 cm, rivoltare dall'apertura, chiuderla e impunturare. Ogni passaggio, animato.",
    heading: "Come foderare una borsa e rivoltarla dall'apertura",
    teaser: "Cucire la fodera, rivoltare la borsa dall'apertura, chiuderla e impunturare — ogni passaggio, animato.",
    needsIntro: "Filo, clip per cucito, tagliafili, ferro da stiro e macchina da cucire — gli strumenti che consiglio personalmente per questi passaggi. Per chiudere l'apertura a mano ti servirà anche un ago da cucito.",
  },
  'bag-bottom': {
    title: 'Fondo della borsa: quattro modi',
    blurb: "Come dare a una borsa un fondo su cui stare in piedi. Prima, il fondo ripiegato all'interno della tote bag: due pieghe cucite a 6 cm dal centro e ripiegate dentro, e gli angoli si formano da soli.",
    pageTitle: 'Come cucire il fondo di una borsa di stoffa: 4 modi',
    pageDescription: 'Come cucire il fondo di una borsa di stoffa: il fondo ripiegato della tote bag (due pieghe cucite a 6 cm dalla piega centrale, ripiegate dentro, cuciture laterali a 0,5 cm) si rivolta in una base piatta di 12 cm. Ogni passo animato.',
    heading: 'Come fare il fondo di una borsa di stoffa: quattro modi',
    teaser: 'Un fondo piatto per la borsa, con angoli che si formano da soli — ogni passo animato.',
    needsIntro: 'Ferro da stiro, righello da patchwork, penna evanescente, filo, clip per cucito, macchina da cucire e forbici da sarta — gli strumenti che consiglio personalmente per questi passaggi.',
    sections: {
      folded: {
        title: "Fondo ripiegato all'interno",
        line: 'Due pieghe cucite, ripiegate dentro prima delle cuciture laterali: gli angoli si formano da soli.',
        choose: 'Quando la borsa si taglia in un solo pezzo, piegato a metà per il largo, e vuoi un fondo piatto senza cuciture agli angoli: gli angoli si formano da soli quando rivolti la borsa.',
      },
      'cut-out': {
        title: 'Angoli tagliati',
        line: "Da ogni angolo in basso si taglia un pezzetto, poi l'angolo si apre e si cuce di traverso.",
        choose: 'Quando la borsa è piegata sul fondo, cuci prima i lati e vuoi un fondo piatto: con gli angoli tagliati le cuciture si incontrano con precisione, e va bene anche per i tessuti spessi.',
        note: 'Nel cestino di stoffa gli angoli si tagliano già al momento del taglio: da un quadrato di 60 × 60 cm, un quadrato di 20 × 20 cm da ogni angolo.',
      },
    },
  },
};

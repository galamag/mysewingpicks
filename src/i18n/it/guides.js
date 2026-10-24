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
    blurb: "Come dare a una borsa un fondo su cui stare in piedi, in quattro modi: il fondo ripiegato all'interno della tote bag (due pieghe cucite a 6 cm dal centro, gli angoli si formano da soli), gli angoli tagliati, gli angoli a triangolo e il fondo separato. Ogni modo è animato, con un consiglio su quando sceglierlo.",
    pageTitle: 'Come cucire il fondo di una borsa di stoffa: 4 modi',
    pageDescription: 'Come cucire il fondo di una borsa di stoffa in quattro modi: fondo ripiegato (pieghe cucite a 6 cm dal centro, base di 12 cm), angoli tagliati, angoli a triangolo e fondo separato. Ogni passo animato.',
    heading: 'Come fare il fondo di una borsa di stoffa: quattro modi',
    teaser: 'Quattro modi per dare un fondo piatto alla borsa — fondo ripiegato, angoli tagliati, angoli a triangolo, fondo separato — ogni passo animato.',
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
      boxed: {
        title: 'Angoli a triangolo',
        line: 'Prima si cuce la borsa, poi ogni angolo in basso si appiattisce a triangolo e si cuce di traverso.',
        choose: "Quando vuoi provare prima la profondità: non si taglia niente in anticipo, quindi puoi ancora cucire un fondo più profondo. L'angolo è robusto, ed è adatto ai tessuti leggeri.",
      },
      panel: {
        title: 'Fondo separato',
        line: 'Il fondo è un pezzo a sé, cucito tutto intorno alla base delle pareti.',
        choose: 'Quando vuoi un fondo piatto e stabile, un fondo in un altro tessuto o un fondo rigido con teletta o inserto. Anche i fondi tondi e ovali si cuciono così, ma con taglietti nel margine delle pareti lungo tutta la curva.',
      },
    },
  },
  'sew-a-zipper': {
    title: 'Come cucire una cerniera',
    blurb: 'Come cucire una cerniera passo passo: in una pochette foderata, in una borsa, in una federa, in una gonna o in un abito. Ogni metodo è animato, con un consiglio su quando sceglierlo.',
    pageTitle: 'Come cucire una cerniera: pochette, borsa, cuscino, gonna',
    pageDescription: 'Come cucire una cerniera in una pochette, una borsa, un cuscino, una gonna o un abito: la cerniera cucita tra esterno e fodera e altri metodi. Ogni passaggio animato.',
    heading: 'Come cucire una cerniera: pochette, borsa, cuscino, gonna e abito',
    teaser: 'Cucire una cerniera in una pochette, una borsa, un cuscino, una gonna o un abito: ogni passaggio animato.',
    needsIntro: 'Le clip per cucito e la macchina da cucire: gli strumenti che consiglio personalmente per questi passaggi.',
    sections: {
      lined: {
        title: 'Cerniera con fodera',
        line: "Esterno, cerniera e fodera si cuciono con una sola cucitura, poi l'altro lato della cerniera nello stesso modo.",
        choose: "Quando cuci una pochette, un astuccio o una piccola borsa foderata: la cerniera si monta insieme alla fodera, e il suo nastro e i margini di cucitura restano all'interno.",
        note: "Molte istruzioni cuciono anche un'impuntura lungo la cerniera, perché il tessuto non finisca tra i denti; questa pochette non ce l'ha.",
      },
      tabs: {
        title: 'Estremità rifinite (linguette)',
        line: 'Piccole linguette di stoffa rifiniscono le due estremità prima di cucire la cerniera.',
        choose: 'Quando vuoi estremità pulite e piatte su una pochette o un astuccio: le linguette coprono le estremità della zip, che restano fuori dalle cuciture laterali, e gli angoli stanno piatti.',
        rest: "Poi cuci la cerniera come nella cerniera con fodera: esterno, zip e fodera con una sola cucitura, poi l'altro lato allo stesso modo. Le cuciture laterali passano subito accanto alle linguette.",
      },
      recessed: {
        title: 'Cerniera incassata nella borsa',
        line: 'La cerniera si cuce tra fasce di stoffa e la fascia della cerniera si cuce dentro la borsa, in cima, sotto il bordo.',
        choose: "Quando cuci una borsa shopper o una borsa grande foderata e vuoi che si apra bene, con la cerniera sotto il bordo. Si cuce in quasi ogni borsa foderata; su una stoffa molto spessa le estremità rifinite diventano ingombranti.",
        rest: "Per chiudere le estremità della cerniera cuci due linguette di stoffa, come in «Estremità rifinite (linguette)»: una striscia piegata come uno sbieco su ogni estremità, subito dopo il fermo.",
      },
      centered: {
        title: 'Cerniera centrata',
        line: 'Si cuce la cerniera in una cucitura: i due bordi piegati si incontrano sopra i denti, con una cucitura su ogni lato.',
        choose: 'Quando vuoi il modo più semplice per cucire una cerniera in una cucitura: in una federa o in un cuscino, in una gonna, nella cucitura del centro dietro di un abito. La zip si vede appena da entrambi i lati.',
      },
      lapped: {
        title: 'Cerniera con patta',
        line: 'Si cuce la cerniera sotto un lato della cucitura che la copre, con una sola cucitura a vista.',
        choose: 'Quando cuci una cerniera nella cucitura laterale di una gonna, di un abito o dei pantaloni e non vuoi che si veda: la patta copre la zip, comodo quando il colore della zip non è uguale al tessuto, e si vede una sola cucitura.',
      },
      invisible: {
        title: 'Cerniera invisibile',
        line: 'Da fuori si vedono solo la linea di cucitura e il cursore: la cerniera si cuce con un piedino speciale, il piedino per cerniera invisibile.',
        choose: 'Quando cuci un abito, una gonna o una federa e vuoi che la cerniera non si veda, solo il cursore: è adatta al raso e ai capi eleganti. Va bene anche il piedino per cerniere normale, ma meno. Non per tessuti spessi né per cuciture molto sollecitate.',
      },
    },
  },
};

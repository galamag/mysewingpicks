/* Italian names and descriptions of the catalog products, by product id
   (src/data/products.js). Every product must be here — the build checks it.
   Same order as products.js. Meaning = the English text (checked against each
   Amazon page) — nothing added. Brands and models in Latin, product type first;
   sizes converted to cm/mm/m (rounded, the same numbers as ru) — except inch-graduated
   quilting rulers, tape-measure scales and screen diagonals, which stay in inches
   («pollici»). Amazon's «Renewed» = «Ricondizionato» (as on Amazon.it). */
export default {
  /* ================= STRUMENTI ================= */

  /* ---- Macchine e piedini ---- */
  'janome-hd2200': {
    name: 'Macchina da cucire Janome HD2200 Heavy-Duty',
    shortDescription: 'Una macchina meccanica robusta con 24 punti, asola automatica in 1 tempo e infila-ago incorporato, per i progetti di tutti i giorni.',
  },
  'janome-1522rd': {
    name: 'Macchina da cucire Janome 1522RD, 22 punti',
    shortDescription: 'Una macchina meccanica facile da usare con 22 punti, asola automatica in 1 tempo, luce LED e sei piedini inclusi.',
  },
  'free-motion-presser-foot': {
    name: 'Piedini per cucito a mano libera, 3 pz (gambo basso)',
    shortDescription: 'Un set di piedini da rammendo a gambo basso per un quilting a mano libera fluido e per disegnare con il filo.',
  },
  'windman-presser-feet-set': {
    name: 'Piedini Windman a innesto rapido, 11 pz (gambo basso)',
    shortDescription: 'Undici piedini a innesto rapido, tra cui quelli per cerniere, a rullo, per quilting e attaccabottoni, per macchine Brother, Singer, Janome e simili a gambo basso.',
  },
  'madam-sew-walking-foot': {
    name: 'Piedino doppio trasporto aperto Madam Sew (gambo basso)',
    shortDescription: 'Trasporta in modo uniforme lo strato superiore e quello inferiore, così le linee di quilting e le cuciture spesse restano lisce e senza grinze.',
  },

  /* ---- Taglio e misurazione ---- */
  'olfa-rotary-cutter': {
    name: 'Taglierina rotante OLFA Deluxe, 45 mm',
    shortDescription: 'Una taglierina rotante affilata e comoda per tagli netti e precisi su più strati di tessuto alla volta.',
  },
  'olfa-cutting-mat': {
    name: 'Tappetino da taglio autorigenerante OLFA, 61 × 46 cm',
    shortDescription: 'Un tappetino autorigenerante che protegge il tavolo e rende netto e preciso ogni taglio con la taglierina rotante.',
  },
  'quilting-rulers-set': {
    name: 'Righelli per patchwork: quadrati, 6 × 12 e triangolo',
    shortDescription: 'Un set completo di righelli in acrilico trasparente per misurare, squadrare e tagliare con precisione i blocchi del quilt.',
  },
  'linxiao-square-rulers': {
    name: 'Righelli quadrati per patchwork LINXIAO, 4 pz',
    shortDescription: 'Quattro quadrati in acrilico trasparente da 3,5 a 10,5 pollici, con tacche ogni 1/8 di pollice e linee a 45°, per rifilare i blocchi.',
  },
  'tailor-scissors': {
    name: 'Forbici da sarta 23 cm + metro da sarta',
    shortDescription: 'Robuste forbici per tessuto con impugnatura angolata e lama in acciaio ad alto tenore di carbonio, più un metro da sarta di 150 cm.',
  },
  'beaditive-thread-snips': {
    name: 'Tagliafili Beaditive, 3 pz',
    shortDescription: 'Piccoli tagliafili a molla che tagliano i fili proprio sulla cucitura: tienine uno vicino alla macchina e uno nel tuo kit da cucito.',
  },
  'ibayam-tape-measures': {
    name: 'Metri da sarta iBayam, 2 pz (150 cm)',
    shortDescription: 'Un metro morbido e uno avvolgibile, entrambi a doppia scala in pollici e centimetri, per misurare il corpo e il tessuto.',
  },

  /* ---- Segnare e stirare ---- */
  'sewline-air-erasable-pen': {
    name: 'Penna per tessuto evanescente Sewline',
    shortDescription: 'Segna il tessuto in modo nitido, poi il segno svanisce da solo — niente risciacqui e nessun residuo.',
  },
  'lange-konig-heat-erasable-pens': {
    name: 'Penne termocancellabili Lange & König, 4 + ricariche',
    shortDescription: 'Penne a punta fine in quattro colori, le cui linee scompaiono con il calore del ferro da stiro; otto ricariche incluse.',
  },
  'rowenta-travel-iron': {
    name: 'Ferro da stiro a vapore da viaggio Rowenta DA1560',
    shortDescription: 'Un ferro a vapore leggero e compatto per cuciture ben stirate e una stiratura precisa ovunque tu cucia.',
  },
  'rowenta-steam-station': {
    name: 'Ferro con caldaia Rowenta DG8624 Perfect Pro',
    shortDescription: 'Un ferro con generatore di vapore e serbatoio separato da 1,1 litri, per un vapore potente e uniforme quando stiri cuciture e progetti finiti.',
  },
  'vevor-water-distiller': {
    name: "Distillatore d'acqua da tavolo VEVOR, 4 litri",
    shortDescription: "Produce acqua distillata a casa, circa un litro all'ora: comoda per riempire il ferro a vapore.",
  },

  /* ---- Aiuti pratici ---- */
  'beaditive-magnetic-pin-holder': {
    name: 'Puntaspilli magnetico Beaditive + 50 spilli',
    shortDescription: 'Un puntaspilli magnetico con un piccolo cassetto e 50 spilli con testa di vetro, così gli spilli restano al loro posto sul tavolo da cucito.',
  },
  'soraco-sewing-clips': {
    name: 'Clip per cucito Soraco, 100 pz',
    shortDescription: 'Clip colorate che tengono fermi bordature, strati spessi e vinile dove gli spilli lascerebbero dei buchi; arrivano in una pratica scatola di latta.',
  },
  'xihircd-drawstring-threaders': {
    name: 'Passanastri XIHIRCD, 4 pz',
    shortDescription: 'Passanastri in metallo, a forma di ago, che fanno passare elastico e cordoncino in cinturini e coulisse senza attorcigliarli.',
  },
  'kamtop-snap-pliers-kit': {
    name: 'Pinza per bottoni a pressione KAMTOP + 408 bottoni',
    shortDescription: 'Una pinza con 408 set di bottoni a pressione in plastica in 24 colori, per chiusure ordinate su borse, bavaglini e pochette.',
  },
  'adjustoform-dress-form': {
    name: 'Manichino da sarta Adjustoform Sew Simple FG304, S–M',
    shortDescription: 'Un manichino regolabile per le taglie USA 4–12, con segnaorli, per provare i capi e appuntare i dettagli.',
  },

  /* ================= TESSUTI E MATERIALI ================= */

  /* ---- Tessuti ---- */
  'quilting-fabric-bundles': {
    name: 'Set di tessuti per patchwork e cucito fai da te',
    shortDescription: "Set di tessuti già coordinati per iniziare subito il tuo prossimo progetto di patchwork o quilting, con colori pronti all'uso.",
  },
  'solid-cotton-squares': {
    name: 'Quadrati di cotone tinta unita 30 × 30 cm, 50 pz',
    shortDescription: 'Cinquanta quadrati di 30 cm in 100% cotone, in cinquanta diverse tinte unite, pronti per blocchi e patchwork.',
  },
  'ojyudd-printed-squares': {
    name: 'Quadrati di cotone stampato OJYUDD 10 × 10 cm, 150 pz',
    shortDescription: 'Una bella pila di quadrati di cotone stampato da 10 cm con fantasie assortite, perfetti per patchwork di ritagli e charm quilt.',
  },
  'cotton-duck-cloth': {
    name: 'Canvas di cotone stampato a metraggio, altezza 137 cm',
    shortDescription: 'Robusta tela canvas in 100% cotone con una stampa, dal peso giusto per tote bag, cuscini e arredo per la casa.',
  },
  'barcelonetta-broadcloth': {
    name: 'Popeline Barcelonetta in policotone, alt. 152 cm (salvia)',
    shortDescription: 'Popeline leggera in policotone, ottima per fodere, tasche e capi semplici.',
  },
  'purreitti-felt-sheets': {
    name: 'Feltro rigido PURREITTI, fogli 30 × 30 cm, 80 pz',
    shortDescription: 'Feltro spesso 2 mm in misto lana, in 40 colori, che mantiene la forma: per fondi di borse, decorazioni e lavoretti creativi.',
  },

  /* ---- Imbottiture e telette ---- */
  'plantional-cotton-batting': {
    name: 'Imbottitura in cotone naturale PLANTIONAL, 119 × 150 cm',
    shortDescription: 'Imbottitura traspirante in 100% cotone che dà a quilt, tovagliette e presine una sensazione morbida e naturale.',
  },
  'pandoroom-polyester-batting': {
    name: 'Imbottitura in poliestere PANDOROOM, 122 cm × 2,7 m',
    shortDescription: 'Imbottitura in poliestere di medio spessore che aggiunge volume e calore a borse trapuntate, cuscini e quilt.',
  },
  'fairfield-poly-fil': {
    name: 'Fibra per imbottitura Fairfield Poly-Fil, 907 g',
    shortDescription: 'Morbida fibra di poliestere lavabile per riempire in modo uniforme cuscini, giocattoli e altri elementi imbottiti.',
  },
  'jupean-medium-interfacing': {
    name: 'Teletta termoadesiva JUPEAN di media grammatura, 27 m',
    shortDescription: 'Teletta termoadesiva che dà corpo a borse, colletti e pochette, così mantengono la loro forma.',
  },
  'plantional-lightweight-interfacing': {
    name: 'Teletta termoadesiva leggera PLANTIONAL, 27 m',
    shortDescription: 'Teletta leggera in non tessuto, termoadesiva, che dà una struttura delicata senza irrigidire i progetti in cotone.',
  },
  'hbi-wash-away-stabilizer': {
    name: 'Stabilizzatore idrosolubile per ricamo HBI, 30 cm × 23 m',
    shortDescription: 'Uno stabilizzatore solubile in acqua che sostiene il ricamo e il pizzo autoportante, poi va via completamente con il risciacquo.',
  },
  'brothread-wash-away-stabilizer': {
    name: 'Stabilizzatore idrosolubile New brothread, 25 cm × 2,7 m',
    shortDescription: "Un piccolo rotolo di stabilizzatore idrosolubile per il ricamo a macchina, che si scioglie in acqua fredda o tiepida.",
  },

  /* ---- Passamaneria, nastri e corde ---- */
  'lace-ribbon': {
    name: 'Nastro di pizzo per cucito',
    shortDescription: 'Delicata passamaneria in pizzo per rifinire i bordi, abbellire le borse e dare un tocco fatto a mano a qualsiasi progetto.',
  },
  'sari-silk-ribbon': {
    name: 'Strisce di seta da sari riciclati, 41 m',
    shortDescription: 'Strisce di nastro di seta sfilacciate ai bordi, tagliate da sari riciclati; ogni matassa è un mix unico di colori per passamanerie e arte tessile.',
  },
  'mandala-crafts-bias-tape': {
    name: 'Sbieco a doppia piega Mandala Crafts, 13 mm, crema',
    shortDescription: 'Un lungo rotolo di sbieco già piegato per rifinire bordi, orli e curve con una bordatura ordinata.',
  },
  'willbond-twill-tape': {
    name: 'Fettuccia di cotone a spina di pesce Willbond, 10 mm',
    shortDescription: 'Fettuccia in cotone naturale per chiusure a coulisse, lacci, passanti per appendere e per rinforzare le cuciture di borse e grembiuli.',
  },
  'windyun-webbing': {
    name: 'Fettuccia per manici Windyun, 38 mm, 36 colori',
    shortDescription: 'Trentasei rotoli di robusta fettuccia in policotone per manici di borse, tracolle e cinture, in quasi tutti i colori che ti servono.',
  },
  'knit-elastic-set': {
    name: 'Set di elastico a maglia, 4 larghezze (bianco)',
    shortDescription: 'Quattro rotoli di elastico bianco a maglia, larghi da 1,5 a 5 cm, con clip per infilarlo, per cinturini e polsini.',
  },
  'xkdous-knit-elastic': {
    name: 'Elastico a maglia XKDOUS, 6 mm × 37 m',
    shortDescription: 'Un lungo rotolo di elastico bianco sottile per cinturini, maniche e scrunchie per capelli.',
  },
  'cridoz-satin-cord': {
    name: 'Cordoncino coda di topo di raso Cridoz, 12 rotoli',
    shortDescription: 'Setoso cordoncino di raso in nylon, in colori assortiti, per chiusure a coulisse, sacchetti regalo, intrecci e lacci decorativi.',
  },
  'kinglake-jute-twine': {
    name: 'Spago di juta naturale KINGLAKE, 2 mm × 200 m',
    shortDescription: 'Spago di juta naturale per etichette in stile rustico, chiusure a coulisse, confezioni regalo e tocchi decorativi.',
  },

  /* ---- Cerniere, bottoni e fili ---- */
  'mandala-crafts-zippers': {
    name: 'Cerniere in nylon Mandala Crafts 36 cm, 80 pz',
    shortDescription: 'Ottanta cerniere in nylon non divisibili, in 20 colori, per pochette, cuscini e capi.',
  },
  'mebuzip-zipper-by-the-yard': {
    name: 'Cerniera a metraggio MebuZip n. 5, 9 m + 25 cursori',
    shortDescription: 'Nastro di cerniera continuo color ottone anticato con cursori separati, così puoi tagliare una cerniera della lunghezza che vuoi per le borse.',
  },
  'swpeet-covered-buttons': {
    name: 'Bottoni a gambo ricoperti di stoffa Swpeet, 100 pz',
    shortDescription: 'Bottoni tondi a gambo ricoperti di raso, in dieci colori, per cuscini, cappotti e dettagli decorativi fatti a mano.',
  },
  'hagbou-thread-set': {
    name: 'Set di fili per cucire HAGBOU, 36 colori + spoline',
    shortDescription: 'Trentasei rocchetti di filo di poliestere, ognuno con la sua spolina abbinata, così il colore giusto è sempre a portata di mano.',
  },
  'dritz-invisible-thread': {
    name: 'Filo invisibile Dritz, trasparente, 137 m',
    shortDescription: 'Filo trasparente che si confonde con qualsiasi tessuto, comodo per quilting, applicazioni e punti di rifinitura discreti.',
  },

  /* ================= IL MIO STUDIO PER LE RIPRESE ================= */
  'sensyne-ring-light': {
    name: 'Luce ad anello SENSYNE 25 cm con treppiede 127 cm',
    shortDescription: "Una luce ad anello alimentata via USB su un supporto per telefono allungabile, con tre modalità di colore e un telecomando, per un'illuminazione uniforme.",
  },
  'skytex-softbox-kit': {
    name: 'Kit di illuminazione softbox Skytex, 2 luci',
    shortDescription: 'Due softbox da 51 × 71 cm, con lampadine LED dimmerabili e stativi, che ammorbidiscono le ombre quando filmi o fotografi.',
  },
  'liphisy-tripod': {
    name: 'Treppiede per telefono e fotocamera Liphisy, 163 cm',
    shortDescription: 'Un treppiede alto in alluminio con supporto per telefono, testa a sfera e telecomando, per riprese stabili da qualsiasi angolazione.',
  },
  'iphone-15-pro-max-renewed': {
    name: 'Apple iPhone 15 Pro Max 512 GB (Ricondizionato)',
    shortDescription: 'Un iPhone 15 Pro Max ricondizionato con display da 6,7 pollici e una fotocamera che cattura da vicino i dettagli del cucito.',
  },
  'macbook-pro-m5': {
    name: 'Apple MacBook Pro 14 pollici, M5, 16 GB / 1 TB',
    shortDescription: 'Un portatile da 14 pollici con chip M5 per montare video, organizzare foto e gestire una piccola attività creativa.',
  },
  'ergear-standing-desk': {
    name: 'Scrivania elettrica regolabile ErGear, 122 × 61 cm',
    shortDescription: "Una scrivania elettrica per lavorare sia seduti sia in piedi, con quattro altezze memorizzabili, così puoi tagliare, cucire o montare video all'altezza giusta per te.",
  },
};

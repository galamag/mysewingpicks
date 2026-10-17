/* German names and descriptions of the catalog products, by product id
   (src/data/products.js). Every product must be here — the build checks it.
   Same order as products.js. Meaning = the English text (checked against each
   Amazon page) — nothing added. Brands and models in Latin, brand first (as German
   shops write it); sizes converted to cm/mm/m (same numbers as ru) — except
   inch-graduated quilting rulers and screen diagonals, which stay in inches (Zoll). */
export default {
  /* ================= WERKZEUGE ================= */

  /* ---- Maschinen & Nähfüße ---- */
  'janome-hd2200': {
    name: 'Janome HD2200 Heavy-Duty Nähmaschine',
    shortDescription: 'Eine robuste mechanische Maschine mit 24 Stichen, 1-Stufen-Knopfloch und eingebautem Einfädler für alltägliche Projekte.',
  },
  'janome-1522rd': {
    name: 'Janome 1522RD Nähmaschine, 22 Stiche',
    shortDescription: 'Eine benutzerfreundliche mechanische Maschine mit 22 Stichen, 1-Stufen-Knopfloch, LED-Licht und sechs Nähfüßen im Lieferumfang.',
  },
  'free-motion-presser-foot': {
    name: 'Freihandquiltfüße, 3 Stück (Niedrigschaft)',
    shortDescription: 'Ein Set Stopffüße für Maschinen mit Niedrigschaft – für gleichmäßiges Freihandquilten und Zeichnen mit der Nähmaschine.',
  },
  'windman-presser-feet-set': {
    name: 'Windman Snap-on-Nähfüße, 11 Stück (Niedrigschaft)',
    shortDescription: 'Elf Nähfüße zum Aufklipsen, darunter Reißverschluss-, Roll-, Quilt- und Knopfannähfuß, für Brother, Singer, Janome und ähnliche Maschinen mit Niedrigschaft.',
  },
  'madam-sew-walking-foot': {
    name: 'Madam Sew offener Obertransportfuß (Niedrigschaft)',
    shortDescription: 'Transportiert obere und untere Lage gleichmäßig, sodass Quiltlinien und dicke Nähte glatt und ohne Kräuseln bleiben.',
  },

  /* ---- Zuschneiden & Messen ---- */
  'olfa-rotary-cutter': {
    name: 'OLFA Deluxe Rollschneider, 45 mm',
    shortDescription: 'Ein scharfer, angenehm zu haltender Rollschneider für saubere, genaue Schnitte durch mehrere Stofflagen auf einmal.',
  },
  'olfa-cutting-mat': {
    name: 'OLFA Schneidematte, selbstheilend, 61 × 46 cm',
    shortDescription: 'Eine selbstheilende Matte, die deinen Tisch schützt und jeden Schnitt mit dem Rollschneider sauber und präzise macht.',
  },
  'quilting-rulers-set': {
    name: 'Patchworklineal-Set: Quadrate, 6 × 12 Zoll und Dreieck',
    shortDescription: 'Ein komplettes Set transparenter Acryllineale, um Quiltblöcke genau abzumessen, zu begradigen und zuzuschneiden.',
  },
  'linxiao-square-rulers': {
    name: 'LINXIAO quadratische Patchworklineale, 4 Stück',
    shortDescription: 'Vier transparente Acrylquadrate von 3,5 bis 10,5 Zoll mit 1/8-Zoll- und 45°-Markierungen zum Begradigen von Blöcken.',
  },
  'tailor-scissors': {
    name: 'Schneiderschere 23 cm + Maßband',
    shortDescription: 'Robuste Stoffschere mit abgewinkeltem Griff und Klinge aus kohlenstoffreichem Stahl, dazu ein 150-cm-Maßband.',
  },
  'beaditive-thread-snips': {
    name: 'Beaditive Fadenknipser, 3 Stück',
    shortDescription: 'Kleine Fadenknipser mit Feder schneiden Fäden direkt an der Naht ab: Leg einen neben die Maschine und einen in dein Nähset.',
  },
  'ibayam-tape-measures': {
    name: 'iBayam Maßbänder, 2 Stück (150 cm)',
    shortDescription: 'Ein weiches Maßband und ein Rollmaßband, beide doppelseitig mit Zoll und Zentimetern, für Körpermaße und Stoff.',
  },

  /* ---- Markieren & Bügeln ---- */
  'sewline-air-erasable-pen': {
    name: 'Sewline Markierstift, selbstlöschend',
    shortDescription: 'Markiert deinen Stoff deutlich und verblasst dann von selbst – ohne Auswaschen und ohne Rückstände.',
  },
  'lange-konig-heat-erasable-pens': {
    name: 'Lange & König Thermo-Markierstifte, 4 Stück + Minen',
    shortDescription: 'Feine Markierstifte in vier Farben, deren Linien unter der Hitze des Bügeleisens verschwinden; acht Ersatzminen inklusive.',
  },
  'rowenta-travel-iron': {
    name: 'Rowenta DA1560 Reise-Dampfbügeleisen',
    shortDescription: 'Ein leichtes, kompaktes Dampfbügeleisen für scharf gebügelte Nähte – wo immer du nähst.',
  },
  'rowenta-steam-station': {
    name: 'Rowenta DG8624 Perfect Pro Dampfbügelstation',
    shortDescription: 'Eine Dampfbügelstation mit separatem 1,1-l-Wassertank für kräftigen, gleichmäßigen Dampf beim Bügeln von Nähten und fertigen Projekten.',
  },
  'vevor-water-distiller': {
    name: 'VEVOR Tisch-Wasserdestilliergerät, 4 l',
    shortDescription: 'Stellt zu Hause destilliertes Wasser her, etwa einen Liter pro Stunde – praktisch zum Befüllen deines Dampfbügeleisens.',
  },

  /* ---- Praktische Helfer ---- */
  'beaditive-magnetic-pin-holder': {
    name: 'Beaditive Magnet-Nadelkissen + 50 Stecknadeln',
    shortDescription: 'Eine magnetische Nadelschale mit kleiner Schublade und 50 Glaskopfstecknadeln, damit die Nadeln auf deinem Nähtisch bleiben, wo sie sind.',
  },
  'soraco-sewing-clips': {
    name: 'Soraco Stoffklammern, 100 Stück',
    shortDescription: 'Bunte Klammern halten Einfassungen, dicke Lagen und Kunstleder dort, wo Stecknadeln Löcher hinterlassen würden; sie werden in einer praktischen Dose geliefert.',
  },
  'xihircd-drawstring-threaders': {
    name: 'XIHIRCD Einziehnadeln, 4 Stück',
    shortDescription: 'Einziehnadeln aus Metall, die Gummiband und Kordel ohne Verdrehen durch Bunde und Tunnelzüge ziehen.',
  },
  'kamtop-snap-pliers-kit': {
    name: 'KAMTOP Druckknopfzange + 408 Kunststoff-Druckknöpfe',
    shortDescription: 'Druckknopfzange mit 408 Sets Kunststoff-Druckknöpfen in 24 Farben für saubere Verschlüsse an Taschen, Lätzchen und Täschchen.',
  },
  'adjustoform-dress-form': {
    name: 'Adjustoform Sew Simple FG304 Schneiderpuppe, S–M',
    shortDescription: 'Eine verstellbare Schneiderpuppe für US-Größen 4–12 mit Rockabrunder, zum Anpassen von Kleidung und Feststecken von Details.',
  },

  /* ================= STOFFE & MATERIALIEN ================= */

  /* ---- Stoffe ---- */
  'quilting-fabric-bundles': {
    name: 'Stoffpakete für Patchwork und DIY-Nähprojekte',
    shortDescription: 'Farblich abgestimmte Stoffpakete, mit denen du dein nächstes Patchwork- oder Quiltprojekt sofort mit fertiger Farbpalette beginnen kannst.',
  },
  'solid-cotton-squares': {
    name: 'Uni-Baumwollquadrate 30 × 30 cm, 50 Stück',
    shortDescription: 'Fünfzig Quadrate mit 30 cm Seitenlänge aus 100 % Baumwolle in fünfzig verschiedenen Unifarben, bereit für Blöcke und Patchwork.',
  },
  'ojyudd-printed-squares': {
    name: 'OJYUDD bedruckte Baumwollquadrate 10 × 10 cm, 150 Stück',
    shortDescription: 'Ein großer Stapel bedruckter Baumwollquadrate (10 × 10 cm) mit gemischten Mustern – ideal für Reste-Patchwork und Charm Quilts.',
  },
  'cotton-duck-cloth': {
    name: 'Bedruckter Baumwoll-Canvas, Meterware, 137 cm breit',
    shortDescription: 'Robuster Canvas aus 100 % Baumwolle mit Druckmuster – eine gute Stoffstärke für Tote Bags, Kissen und Wohndeko.',
  },
  'barcelonetta-broadcloth': {
    name: 'Barcelonetta Popeline (Polycotton), 152 cm, Salbei',
    shortDescription: 'Leichte Popeline aus Polyester und Baumwolle, gut geeignet für Futter, Innentaschen und einfache Kleidungsstücke.',
  },
  'purreitti-felt-sheets': {
    name: 'PURREITTI fester Bastelfilz, 30 × 30 cm, 80 Stück',
    shortDescription: 'Dicker 2-mm-Filz mit Wollanteil in 40 Farben, der seine Form hält – für Taschenböden, Dekoanhänger und Bastelprojekte.',
  },

  /* ---- Vlies, Füllwatte & Einlagen ---- */
  'plantional-cotton-batting': {
    name: 'PLANTIONAL Baumwollvlies, natur, 119 × 150 cm',
    shortDescription: 'Atmungsaktives Vlies aus 100 % Baumwolle, das Quilts, Tischsets und Topflappen einen weichen, natürlichen Griff gibt.',
  },
  'pandoroom-polyester-batting': {
    name: 'PANDOROOM Polyester-Volumenvlies, 122 cm × 2,7 m',
    shortDescription: 'Mittelstarkes Volumenvlies aus Polyester, das gequilteten Taschen, Kissen und Quilts Volumen und Wärme gibt.',
  },
  'fairfield-poly-fil': {
    name: 'Fairfield Poly-Fil Füllwatte, 907 g',
    shortDescription: 'Weiche, waschbare Füllwatte aus Polyester, um Kissen, Spielzeug und gepolsterte Teile gleichmäßig zu füllen.',
  },
  'jupean-medium-interfacing': {
    name: 'JUPEAN Bügeleinlage, mittelschwer, 27 m',
    shortDescription: 'Aufbügelbare Einlage, die Taschen, Kragen und Täschchen Stand gibt, damit sie ihre Form behalten.',
  },
  'plantional-lightweight-interfacing': {
    name: 'PLANTIONAL Bügeleinlage, leicht, 27 m',
    shortDescription: 'Leichte Vlieseinlage zum Aufbügeln: Sie gibt sanften Halt, ohne Projekte aus Baumwolle steif zu machen.',
  },
  'hbi-wash-away-stabilizer': {
    name: 'HBI wasserlösliches Stickvlies, 30 cm × 23 m',
    shortDescription: 'Ein wasserlösliches Stickvlies, das Stickereien und freistehende Spitze stützt und sich danach vollständig auswaschen lässt.',
  },
  'brothread-wash-away-stabilizer': {
    name: 'New brothread wasserlösliches Stickvlies, 25 cm × 2,7 m',
    shortDescription: 'Eine kleine Rolle wasserlösliches Stickvlies für Maschinenstickerei, das sich in kaltem oder warmem Wasser auflöst.',
  },

  /* ---- Borten, Bänder & Kordeln ---- */
  'lace-ribbon': {
    name: 'Spitzenband zum Nähen',
    shortDescription: 'Zarte Spitzenborte als Kantenabschluss, zum Verzieren von Taschen und für eine handgemachte Note an jedem Projekt.',
  },
  'sari-silk-ribbon': {
    name: 'Seidenband aus recycelten Saris, 41 m',
    shortDescription: 'Seidenstreifen mit ausgefransten Kanten, geschnitten aus recycelten Saris; jedes Bündel ist eine einzigartige Farbmischung für Borten und Textilkunst.',
  },
  'mandala-crafts-bias-tape': {
    name: 'Mandala Crafts Schrägband 13 mm, doppelt gefalzt (Creme)',
    shortDescription: 'Eine lange Rolle vorgefalztes Schrägband, um Kanten, Säume und Rundungen sauber einzufassen.',
  },
  'willbond-twill-tape': {
    name: 'Willbond Köperband aus Baumwolle, Fischgrat, 10 mm',
    shortDescription: 'Köperband aus Naturbaumwolle für Zugbänder, Bindebänder, Aufhängeschlaufen und zum Verstärken von Nähten an Taschen und Schürzen.',
  },
  'windyun-webbing': {
    name: 'Windyun Gurtband, Polycotton, 38 mm, 36 Farben',
    shortDescription: 'Sechsunddreißig Rollen robustes Gurtband für Taschenhenkel, Riemen und Gürtel – in fast jeder Farbe, die du brauchst.',
  },
  'knit-elastic-set': {
    name: 'Strickgummi-Set, 4 Breiten (weiß)',
    shortDescription: 'Vier Rollen weißes Strickgummi von 1,5 bis 5 cm Breite, mit Klammern zum Einziehen, für Bunde und Bündchen.',
  },
  'xkdous-knit-elastic': {
    name: 'XKDOUS Strickgummi, 6 mm × 37 m',
    shortDescription: 'Eine lange Rolle schmales weißes Gummiband für Bunde, Ärmel und Scrunchies.',
  },
  'cridoz-satin-cord': {
    name: 'Cridoz Satinkordel (Rattail), 12 Rollen',
    shortDescription: 'Seidig glänzende Satinkordel aus Nylon in verschiedenen Farben für Zugbänder, Geschenkbeutel, Flechtarbeiten und dekorative Bindebänder.',
  },
  'kinglake-jute-twine': {
    name: 'KINGLAKE Jutekordel, natur, 2 mm × 200 m',
    shortDescription: 'Kordel aus Naturjute für rustikale Anhänger, Zugbänder, Geschenkverpackungen und dekorative Akzente.',
  },

  /* ---- Reißverschlüsse, Knöpfe & Garn ---- */
  'mandala-crafts-zippers': {
    name: 'Mandala Crafts Nylon-Reißverschlüsse 36 cm, 80 Stück',
    shortDescription: 'Achtzig nicht teilbare Nylon-Reißverschlüsse in 20 Farben für Täschchen, Kissen und Kleidung.',
  },
  'mebuzip-zipper-by-the-yard': {
    name: 'MebuZip Endlosreißverschluss Nr. 5, 9 m + 25 Zipper',
    shortDescription: 'Endlos-Reißverschlussband in Altmessing mit separaten Zippern – so schneidest du für Taschen Reißverschlüsse in jeder Länge zu.',
  },
  'swpeet-covered-buttons': {
    name: 'Swpeet stoffbezogene Ösenknöpfe, 100 Stück',
    shortDescription: 'Runde, mit Satin bezogene Ösenknöpfe in zehn Farben für Kissen, Mäntel und dekorative handgemachte Details.',
  },
  'hagbou-thread-set': {
    name: 'HAGBOU Nähgarn-Set, 36 Farben + Spulen',
    shortDescription: 'Sechsunddreißig Garnrollen aus Polyester, jede mit passender Spule, damit du immer die richtige Farbe zur Hand hast.',
  },
  'dritz-invisible-thread': {
    name: 'Dritz unsichtbares Garn, transparent, 137 m',
    shortDescription: 'Transparentes Garn, das mit jedem Stoff verschmilzt – praktisch zum Quilten, für Applikationen und unauffällige Abschlussstiche.',
  },

  /* ================= MEIN FILMSTUDIO ================= */
  'sensyne-ring-light': {
    name: 'SENSYNE Ringlicht 25 cm mit Stativ 127 cm',
    shortDescription: 'Ein Ringlicht mit USB-Stromversorgung auf ausziehbarem Handyständer, mit drei Farbmodi und Fernbedienung für gleichmäßiges Licht.',
  },
  'skytex-softbox-kit': {
    name: 'Skytex Softbox-Set, 2 Leuchten',
    shortDescription: 'Zwei Softboxen (51 × 71 cm) mit dimmbaren LED-Lampen und Stativen, die beim Filmen oder Fotografieren Schatten weicher machen.',
  },
  'liphisy-tripod': {
    name: 'Liphisy Stativ für Handy und Kamera, 163 cm',
    shortDescription: 'Ein hohes Aluminiumstativ mit Handyhalterung, Kugelkopf und Fernbedienung für ruhige Aufnahmen aus jedem Winkel.',
  },
  'iphone-15-pro-max-renewed': {
    name: 'Apple iPhone 15 Pro Max, 512 GB (Generalüberholt)',
    shortDescription: 'Ein generalüberholtes iPhone 15 Pro Max mit 6,7-Zoll-Display und einer Kamera, die feine Nähdetails aus der Nähe einfängt.',
  },
  'asus-zenbook-pro-16x': {
    name: 'ASUS ZenBook Pro 16X OLED, i9, 32 GB / 2 TB',
    shortDescription: 'Ein 16-Zoll-Laptop mit 4K-OLED-Touchscreen, Core i9, RTX-3060-Grafik und Drehregler, um Videos zu schneiden.',
  },
  'ergear-standing-desk': {
    name: 'ErGear elektrischer Stehschreibtisch, 122 × 61 cm',
    shortDescription: 'Ein elektrischer Sitz-Steh-Schreibtisch mit vier Höhenspeichern, damit du in bequemer Höhe zuschneiden, nähen oder Videos bearbeiten kannst.',
  },
};

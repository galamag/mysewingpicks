/* Spanish names and descriptions of the catalog products, by product id
   (src/data/products.js). Every product must be here — the build checks it.
   Same order as products.js. Meaning = the English text (checked against each
   Amazon page) — nothing added. Neutral Spanish (Spain + Latin America); brands and
   models in Latin, product type first; sizes converted to cm/mm/m (same numbers as
   ru) — except inch-graduated quilting rulers, tape measures marked in both units and
   screen diagonals, which stay in inches («pulgadas»). */
export default {
  /* ================= HERRAMIENTAS ================= */

  /* ---- Máquinas y prensatelas ---- */
  'janome-hd2200': {
    name: 'Máquina de coser Janome HD2200 Heavy-Duty',
    shortDescription: 'Máquina mecánica resistente con 24 puntadas, ojal en un paso y enhebrador integrado, para los proyectos de cada día.',
  },
  'janome-1522rd': {
    name: 'Máquina de coser Janome 1522RD, 22 puntadas',
    shortDescription: 'Máquina mecánica fácil de usar con 22 puntadas, ojal en un paso, luz LED y seis prensatelas incluidos.',
  },
  'free-motion-presser-foot': {
    name: 'Prensatelas para acolchado libre, 3 piezas (caña baja)',
    shortDescription: 'Juego de prensatelas de zurcir para caña baja, para un acolchado libre fluido y para dibujar con hilo.',
  },
  'windman-presser-feet-set': {
    name: 'Prensatelas Windman de presión, 11 piezas (caña baja)',
    shortDescription: 'Once prensatelas de presión, entre ellos los de cremallera, rodillo, acolchado y botones, para máquinas Brother, Singer, Janome y similares de caña baja.',
  },
  'madam-sew-walking-foot': {
    name: 'Prensatelas doble arrastre abierto Madam Sew (caña baja)',
    shortDescription: 'Arrastra por igual las capas de arriba y de abajo, para que las líneas de acolchado y las costuras gruesas queden lisas y sin fruncidos.',
  },

  /* ---- Corte y medición ---- */
  'olfa-rotary-cutter': {
    name: 'Cortador rotativo OLFA Deluxe, 45 mm',
    shortDescription: 'Cortador rotativo afilado y cómodo para cortes limpios y precisos en varias capas de tela a la vez.',
  },
  'olfa-cutting-mat': {
    name: 'Base de corte autocicatrizante OLFA, 61 × 46 cm',
    shortDescription: 'Base autocicatrizante que protege tu mesa y hace que cada corte con el cortador rotativo quede nítido y preciso.',
  },
  'quilting-rulers-set': {
    name: 'Reglas para patchwork: cuadrados, 6 × 12 y triángulo',
    shortDescription: 'Juego completo de reglas de acrílico transparente para medir, escuadrar y cortar con precisión bloques de quilt.',
  },
  'linxiao-square-rulers': {
    name: 'Reglas cuadradas para patchwork LINXIAO, 4 piezas',
    shortDescription: 'Cuatro cuadrados de acrílico transparente de 3,5 a 10,5 pulgadas, con marcas cada 1/8 de pulgada y líneas de 45°, para recortar bloques.',
  },
  'tailor-scissors': {
    name: 'Tijeras de sastre de 23 cm + cinta métrica',
    shortDescription: 'Tijeras para tela resistentes, de mango acodado, con hoja de acero de alto carbono, y además una cinta métrica de 150 cm.',
  },
  'beaditive-thread-snips': {
    name: 'Cortahilos Beaditive, 3 piezas',
    shortDescription: 'Pequeños cortahilos de resorte que cortan los hilos justo en la costura: ten uno junto a la máquina y otro en tu costurero.',
  },
  'ibayam-tape-measures': {
    name: 'Cintas métricas iBayam, 2 piezas (150 cm)',
    shortDescription: 'Una cinta flexible y otra retráctil, ambas de doble cara, en pulgadas y centímetros, para medir el cuerpo y la tela.',
  },

  /* ---- Marcado y planchado ---- */
  'sewline-air-erasable-pen': {
    name: 'Marcador para tela borrable al aire Sewline',
    shortDescription: 'Marca la tela con nitidez y después el trazo desaparece solo: sin enjuagar y sin dejar residuos.',
  },
  'lange-konig-heat-erasable-pens': {
    name: 'Bolígrafos termoborrables Lange & König, 4 + recargas',
    shortDescription: 'Bolígrafos finos para marcar tela, en cuatro colores, cuyas líneas desaparecen con el calor de la plancha; incluye ocho recargas.',
  },
  'rowenta-travel-iron': {
    name: 'Plancha de vapor de viaje Rowenta DA1560',
    shortDescription: 'Plancha de vapor ligera y compacta para marcar bien las costuras y planchar dondequiera que cosas.',
  },
  'rowenta-steam-station': {
    name: 'Centro de planchado Rowenta DG8624 Perfect Pro',
    shortDescription: 'Plancha con generador de vapor y depósito de agua independiente de 1,1 l, para un vapor potente y uniforme al planchar costuras y proyectos terminados.',
  },
  'vevor-water-distiller': {
    name: 'Destilador de agua de mesa VEVOR, 4 l',
    shortDescription: 'Prepara agua destilada en casa, alrededor de un litro por hora; práctico para llenar tu plancha de vapor.',
  },

  /* ---- Accesorios útiles ---- */
  'beaditive-magnetic-pin-holder': {
    name: 'Alfiletero magnético Beaditive + 50 alfileres',
    shortDescription: 'Alfiletero magnético con un pequeño cajón y 50 alfileres con cabeza de cristal, para que los alfileres se queden en su lugar en tu mesa de costura.',
  },
  'soraco-sewing-clips': {
    name: 'Clips de costura Soraco, 100 piezas',
    shortDescription: 'Clips de colores que sujetan ribetes, capas gruesas y vinilo donde los alfileres dejarían agujeros; vienen en una práctica lata.',
  },
  'xihircd-drawstring-threaders': {
    name: 'Pasacintas XIHIRCD, 4 piezas',
    shortDescription: 'Pasacintas metálicos tipo aguja que pasan elástico y cordón por cinturillas y jaretas sin que se retuerzan.',
  },
  'kamtop-snap-pliers-kit': {
    name: 'Pinzas para broches KAMTOP + 408 broches de plástico',
    shortDescription: 'Pinzas con 408 juegos de broches de presión de plástico en 24 colores, para abrochar bolsas, baberos y estuches con un acabado limpio.',
  },
  'adjustoform-dress-form': {
    name: 'Maniquí de costura Adjustoform Sew Simple FG304, S–M',
    shortDescription: 'Maniquí ajustable para las tallas 4–12 de EE. UU., con marcador de dobladillo, para probar prendas y sujetar detalles con alfileres.',
  },

  /* ================= TELAS Y MATERIALES ================= */

  /* ---- Telas ---- */
  'quilting-fabric-bundles': {
    name: 'Lotes de telas para patchwork y costura DIY',
    shortDescription: 'Lotes de telas ya coordinadas, con colores listos para usar, para empezar enseguida tu próximo proyecto de patchwork o acolchado.',
  },
  'solid-cotton-squares': {
    name: 'Cuadrados de algodón lisos 30 × 30 cm, 50 piezas',
    shortDescription: 'Cincuenta cuadrados de 30 cm de 100 % algodón en cincuenta colores lisos distintos, listos para bloques y patchwork.',
  },
  'ojyudd-printed-squares': {
    name: 'Cuadrados de algodón estampado OJYUDD, 10 cm, 150 piezas',
    shortDescription: 'Un gran montón de cuadrados de algodón estampado de 10 cm con diseños variados, ideales para patchwork de retazos y charm quilts.',
  },
  'cotton-duck-cloth': {
    name: 'Lona de algodón estampada, por metro, 137 cm de ancho',
    shortDescription: 'Lona resistente de 100 % algodón con estampado, de buen gramaje para tote bags, cojines y decoración del hogar.',
  },
  'barcelonetta-broadcloth': {
    name: 'Popelina Barcelonetta de polialgodón, 152 cm, salvia',
    shortDescription: 'Popelina ligera de poliéster y algodón, ideal para forros, bolsillos y prendas sencillas.',
  },
  'purreitti-felt-sheets': {
    name: 'Hojas de fieltro rígido PURREITTI 30 × 30 cm, 80 piezas',
    shortDescription: 'Fieltro grueso de 2 mm con mezcla de lana, en 40 colores, que mantiene su forma: para bases de bolsas, adornos y manualidades.',
  },

  /* ---- Guata, relleno y entretela ---- */
  'plantional-cotton-batting': {
    name: 'Guata de algodón natural PLANTIONAL, 119 × 150 cm',
    shortDescription: 'Guata transpirable de 100 % algodón que da a quilts, manteles individuales y agarraderas un tacto suave y natural.',
  },
  'pandoroom-polyester-batting': {
    name: 'Guata de poliéster PANDOROOM, 122 cm × 2,7 m',
    shortDescription: 'Guata de poliéster de grosor medio que aporta volumen y calidez a bolsas acolchadas, cojines y quilts.',
  },
  'fairfield-poly-fil': {
    name: 'Relleno de fibra Fairfield Poly-Fil, 907 g',
    shortDescription: 'Relleno de fibra de poliéster suave y lavable para rellenar de forma uniforme cojines, juguetes y piezas acolchadas.',
  },
  'jupean-medium-interfacing': {
    name: 'Entretela termoadhesiva de gramaje medio JUPEAN, 27 m',
    shortDescription: 'Entretela termoadhesiva que da cuerpo a bolsas, cuellos y estuches para que mantengan su forma.',
  },
  'plantional-lightweight-interfacing': {
    name: 'Entretela termoadhesiva ligera PLANTIONAL, 27 m',
    shortDescription: 'Entretela termoadhesiva ligera no tejida que aporta una estructura suave sin endurecer los proyectos de algodón.',
  },
  'hbi-wash-away-stabilizer': {
    name: 'Estabilizador hidrosoluble para bordado HBI, 30 cm × 23 m',
    shortDescription: 'Estabilizador soluble en agua que sostiene el bordado y el encaje autoportante, y después desaparece por completo con el agua.',
  },
  'brothread-wash-away-stabilizer': {
    name: 'Estabilizador hidrosoluble New brothread, 25 cm × 2,7 m',
    shortDescription: 'Pequeño rollo de estabilizador hidrosoluble para bordado a máquina que se disuelve en agua fría o tibia.',
  },

  /* ---- Adornos, cintas y cordones ---- */
  'lace-ribbon': {
    name: 'Cinta de encaje para costura',
    shortDescription: 'Delicada puntilla de encaje para dar acabado a los bordes, decorar bolsas y añadir un toque hecho a mano a cualquier proyecto.',
  },
  'sari-silk-ribbon': {
    name: 'Tiras de cinta de seda de sari reciclado, 41 m',
    shortDescription: 'Tiras de cinta de seda con bordes deshilachados, cortadas de saris reciclados; cada lote es una mezcla única de colores para adornos y arte textil.',
  },
  'mandala-crafts-bias-tape': {
    name: 'Cinta al bies Mandala Crafts 13 mm, doble doblez, crema',
    shortDescription: 'Un carrete largo de cinta al bies ya doblada para ribetear bordes, dobladillos y curvas con un acabado limpio.',
  },
  'willbond-twill-tape': {
    name: 'Cinta de sarga de algodón Willbond, espiguilla, 10 mm',
    shortDescription: 'Cinta de algodón natural para cordones, lazos, presillas para colgar y para reforzar costuras en bolsas y delantales.',
  },
  'windyun-webbing': {
    name: 'Cinta para asas Windyun, polialgodón, 38 mm, 36 colores',
    shortDescription: 'Treinta y seis rollos de cinta resistente para asas de bolsas, correas y cinturones, en casi cualquier color que necesites.',
  },
  'knit-elastic-set': {
    name: 'Juego de elástico de punto, 4 anchos (blanco)',
    shortDescription: 'Cuatro rollos de elástico de punto blanco, de 1,5 a 5 cm de ancho, con clips para pasarlo, para cinturillas y puños.',
  },
  'xkdous-knit-elastic': {
    name: 'Elástico de punto XKDOUS, 6 mm × 37 m',
    shortDescription: 'Un rollo largo de elástico blanco estrecho para cinturillas, mangas y scrunchies.',
  },
  'cridoz-satin-cord': {
    name: 'Cordón cola de ratón de satén Cridoz, 12 rollos',
    shortDescription: 'Cordón sedoso de satén de nailon en colores variados para jaretas, bolsitas de regalo, trenzados y lazos decorativos.',
  },
  'kinglake-jute-twine': {
    name: 'Cordel de yute natural KINGLAKE, 2 mm × 200 m',
    shortDescription: 'Cordel de yute natural para etiquetas rústicas, cordones, envoltorios de regalo y detalles decorativos.',
  },

  /* ---- Cremalleras, botones e hilos ---- */
  'mandala-crafts-zippers': {
    name: 'Cremalleras de nailon Mandala Crafts 36 cm, 80 piezas',
    shortDescription: 'Ochenta cremalleras de nailon no separables en 20 colores para estuches, cojines y prendas.',
  },
  'mebuzip-zipper-by-the-yard': {
    name: 'Cremallera por metro MebuZip n.º 5, 9 m + 25 tiradores',
    shortDescription: 'Cinta de cremallera continua en latón envejecido con tiradores sueltos, para cortar una cremallera del largo que quieras para tus bolsas.',
  },
  'swpeet-covered-buttons': {
    name: 'Botones forrados de tela con pie Swpeet, 100 piezas',
    shortDescription: 'Botones redondos con pie forrados de satén, en diez colores, para cojines, abrigos y detalles decorativos hechos a mano.',
  },
  'hagbou-thread-set': {
    name: 'Juego de hilos de coser HAGBOU, 36 colores + canillas',
    shortDescription: 'Treinta y seis carretes de hilo de poliéster, cada uno con su canilla a juego, para tener siempre a mano el color adecuado.',
  },
  'dritz-invisible-thread': {
    name: 'Hilo invisible Dritz, transparente, 137 m',
    shortDescription: 'Hilo transparente que se funde con cualquier tela, práctico para acolchar, hacer aplicaciones y dar puntadas de acabado discretas.',
  },

  /* ================= MI ESTUDIO DE GRABACIÓN ================= */
  'sensyne-ring-light': {
    name: 'Aro de luz SENSYNE 25 cm con trípode de 127 cm',
    shortDescription: 'Aro de luz con alimentación USB sobre un soporte extensible para el teléfono, con tres modos de color y control remoto, para una iluminación uniforme.',
  },
  'skytex-softbox-kit': {
    name: 'Kit de iluminación softbox Skytex, 2 luces',
    shortDescription: 'Dos softbox de 51 × 71 cm con lámparas LED regulables y soportes, que suavizan las sombras al grabar o fotografiar.',
  },
  'liphisy-tripod': {
    name: 'Trípode para teléfono y cámara Liphisy, 163 cm',
    shortDescription: 'Trípode alto de aluminio con soporte para teléfono, rótula de bola y control remoto, para tomas estables desde cualquier ángulo.',
  },
  'iphone-15-pro-max-renewed': {
    name: 'Apple iPhone 15 Pro Max, 512 GB (Reacondicionado)',
    shortDescription: 'iPhone 15 Pro Max reacondicionado con pantalla de 6,7 pulgadas y una cámara que capta de cerca los detalles de la costura.',
  },
  'macbook-pro-m5': {
    name: 'Apple MacBook Pro de 14 pulgadas, M5, 16 GB / 1 TB',
    shortDescription: 'Laptop de 14 pulgadas con chip M5 para editar videos, organizar fotos y llevar un pequeño negocio creativo.',
  },
  'ergear-standing-desk': {
    name: 'Escritorio elevable eléctrico ErGear, 122 × 61 cm',
    shortDescription: 'Escritorio eléctrico para trabajar de pie o sentándote, con cuatro alturas memorizadas, para cortar, coser o editar a una altura cómoda.',
  },
};

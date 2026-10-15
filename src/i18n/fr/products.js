/* French names and descriptions of the catalog products, by product id
   (src/data/products.js). Every product must be here — the build checks it.
   Same order as products.js. Meaning = the English text (checked against each
   Amazon page) — nothing added. Brands and models in Latin, product type first;
   sizes converted to cm/mm/m/g (the same numbers as src/i18n/ru/products.js) —
   except inch-graduated quilting rulers, the tape's inch scale and screen sizes,
   which stay in inches (« pouces »). «(Reconditionné)» = Amazon.fr's « (Renewed) ».
   Non-breaking spaces (U+00A0) as in src/i18n/fr.js: number–unit, before : ; ! ? */
export default {
  /* ================= OUTILS ================= */

  /* ---- Machines et pieds presseurs ---- */
  'janome-hd2200': {
    name: 'Machine à coudre Janome HD2200 Heavy-Duty',
    shortDescription: 'Une machine mécanique robuste avec 24 points, une boutonnière en une étape et un enfile-aiguille intégré, pour les projets du quotidien.',
  },
  'janome-1522rd': {
    name: 'Machine à coudre Janome 1522RD, 22 points',
    shortDescription: 'Une machine mécanique facile à prendre en main : 22 points, une boutonnière en une étape, un éclairage LED et six pieds presseurs fournis.',
  },
  'free-motion-presser-foot': {
    name: 'Pieds pour piqué libre, lot de 3 (tige basse)',
    shortDescription: 'Un lot de pieds à repriser à tige basse pour un quilting en piqué libre bien fluide et le dessin au fil.',
  },
  'windman-presser-feet-set': {
    name: 'Pieds Windman à clipser, lot de 11 (tige basse)',
    shortDescription: 'Onze pieds à clipser, dont un pied fermeture éclair, un pied à roulettes, un pied quilting et un pied pose-boutons, pour les machines à tige basse Brother, Singer, Janome et similaires.',
  },
  'madam-sew-walking-foot': {
    name: 'Pied double entraînement ouvert Madam Sew (tige basse)',
    shortDescription: 'Entraîne uniformément les épaisseurs du dessus et du dessous : les lignes de quilting et les coutures épaisses restent bien à plat, sans gondoler.',
  },

  /* ---- Coupe et mesure ---- */
  'olfa-rotary-cutter': {
    name: 'Cutter rotatif OLFA Deluxe, 45 mm',
    shortDescription: 'Un cutter rotatif tranchant et confortable pour des coupes nettes et précises dans plusieurs épaisseurs de tissu à la fois.',
  },
  'olfa-cutting-mat': {
    name: 'Tapis de coupe autocicatrisant OLFA, 61 × 46 cm',
    shortDescription: 'Un tapis autocicatrisant qui protège votre table et rend chaque coupe au cutter rotatif nette et précise.',
  },
  'quilting-rulers-set': {
    name: 'Règles de patchwork : carrés, 6 × 12 et triangle',
    shortDescription: 'Un jeu complet de règles en acrylique transparent pour mesurer, rectifier et couper les blocs de quilt avec précision.',
  },
  'linxiao-square-rulers': {
    name: 'Règles carrées de patchwork LINXIAO, lot de 4',
    shortDescription: 'Quatre carrés en acrylique transparent de 3,5 à 10,5 pouces, avec graduations au 1/8 de pouce et lignes à 45°, pour rectifier les blocs.',
  },
  'tailor-scissors': {
    name: 'Ciseaux de couturière 23 cm + mètre ruban',
    shortDescription: 'Des ciseaux à tissu robustes et coudés, à lame en acier à haute teneur en carbone, avec en plus un mètre ruban de 150 cm.',
  },
  'beaditive-thread-snips': {
    name: 'Coupe-fils Beaditive, lot de 3',
    shortDescription: 'De petits coupe-fils à ressort qui coupent les fils au ras de la couture : gardez-en un près de la machine et un dans votre trousse de couture.',
  },
  'ibayam-tape-measures': {
    name: 'Mètres ruban iBayam, lot de 2 (150 cm)',
    shortDescription: 'Un ruban souple et un ruban à enrouleur, tous deux gradués en pouces et en centimètres des deux côtés, pour prendre les mesures du corps et mesurer le tissu.',
  },

  /* ---- Traçage et repassage ---- */
  'sewline-air-erasable-pen': {
    name: "Stylo pour tissu effaçable à l'air Sewline",
    shortDescription: "Marque clairement votre tissu, puis s'efface tout seul — sans rinçage et sans laisser de trace.",
  },
  'lange-konig-heat-erasable-pens': {
    name: 'Stylos thermo-effaçables Lange & König, 4 + recharges',
    shortDescription: 'Des stylos de marquage fins en quatre couleurs, dont les traits disparaissent à la chaleur du fer ; huit recharges incluses.',
  },
  'rowenta-travel-iron': {
    name: 'Fer à vapeur de voyage Rowenta DA1560',
    shortDescription: 'Un fer à vapeur léger et compact pour des coutures bien nettes et un repassage soigné, où que vous cousiez.',
  },
  'rowenta-steam-station': {
    name: 'Centrale vapeur Rowenta DG8624 Perfect Pro',
    shortDescription: "Une centrale vapeur avec un réservoir d'eau séparé de 1,1 L pour une vapeur puissante et régulière quand vous repassez les coutures et les projets terminés.",
  },
  'vevor-water-distiller': {
    name: "Distillateur d'eau de table VEVOR, 4 L",
    shortDescription: "Produit de l'eau distillée à la maison, environ un litre par heure — pratique pour remplir votre fer à vapeur.",
  },

  /* ---- Accessoires pratiques ---- */
  'beaditive-magnetic-pin-holder': {
    name: 'Porte-épingles magnétique Beaditive + 50 épingles',
    shortDescription: 'Un porte-épingles magnétique avec un petit tiroir et 50 épingles à tête de verre, pour que les épingles restent en place sur votre table de couture.',
  },
  'soraco-sewing-clips': {
    name: 'Pinces à tissu Soraco, lot de 100',
    shortDescription: 'Des pinces colorées qui maintiennent le biais, les fortes épaisseurs et le vinyle là où les épingles laisseraient des trous ; elles sont livrées dans une boîte en métal bien pratique.',
  },
  'xihircd-drawstring-threaders': {
    name: 'Passe-lacets XIHIRCD, lot de 4',
    shortDescription: "Des passe-lacets en métal, en forme d'aiguille, pour faire passer l'élastique et le cordon dans les ceintures et les coulisses sans qu'ils se vrillent.",
  },
  'kamtop-snap-pliers-kit': {
    name: 'Pince KAMTOP + 408 boutons-pression en plastique',
    shortDescription: 'Une pince à boutons-pression avec 408 jeux de pressions en plastique de 24 couleurs, pour des fermetures nettes sur les sacs, les bavoirs et les trousses.',
  },
  'adjustoform-dress-form': {
    name: 'Mannequin de couture Adjustoform Sew Simple FG304, S–M',
    shortDescription: 'Un mannequin réglable pour les tailles américaines 4 à 12, avec marque-ourlet, pour ajuster les vêtements et épingler les détails.',
  },

  /* ================= TISSUS ET MATÉRIAUX ================= */

  /* ---- Tissus ---- */
  'quilting-fabric-bundles': {
    name: 'Lots de tissus patchwork pour la couture DIY',
    shortDescription: "Des lots de tissus aux couleurs déjà assorties pour lancer votre prochain projet de patchwork ou de quilting avec une palette prête à l'emploi.",
  },
  'solid-cotton-squares': {
    name: 'Carrés de coton unis 30 × 30 cm, lot de 50',
    shortDescription: 'Cinquante carrés de 30 cm en 100 % coton, dans cinquante couleurs unies différentes, prêts pour les blocs et le patchwork.',
  },
  'ojyudd-printed-squares': {
    name: 'Carrés de coton imprimés OJYUDD 10 × 10 cm, lot de 150',
    shortDescription: 'Une grosse pile de carrés de coton imprimés de 10 cm aux motifs variés, parfaits pour un patchwork de chutes et les charm quilts.',
  },
  'cotton-duck-cloth': {
    name: 'Toile canvas imprimée au mètre, largeur 137 cm',
    shortDescription: "Une toile canvas solide en 100 % coton à motif imprimé, d'un bon grammage pour les tote bags, les coussins et la déco de la maison.",
  },
  'barcelonetta-broadcloth': {
    name: 'Popeline polycoton Barcelonetta, 152 cm (sauge)',
    shortDescription: 'Une popeline polycoton légère qui convient bien aux doublures, aux poches et aux vêtements simples.',
  },
  'purreitti-felt-sheets': {
    name: 'Feutrine rigide PURREITTI 30 × 30 cm, 80 feuilles',
    shortDescription: 'Une feutrine épaisse de 2 mm en mélange de laine, en 40 couleurs, qui tient sa forme pour les fonds de sac, les décorations et les loisirs créatifs.',
  },

  /* ---- Ouatine, rembourrage et entoilage ---- */
  'plantional-cotton-batting': {
    name: 'Ouatine de coton naturel PLANTIONAL, 119 × 150 cm',
    shortDescription: 'Une ouatine respirante en 100 % coton qui donne aux quilts, aux sets de table et aux maniques un toucher doux et naturel.',
  },
  'pandoroom-polyester-batting': {
    name: 'Ouatine polyester PANDOROOM, 122 cm × 2,7 m',
    shortDescription: "Une ouatine polyester d'épaisseur moyenne qui apporte du gonflant et de la chaleur aux sacs matelassés, aux coussins et aux quilts.",
  },
  'fairfield-poly-fil': {
    name: 'Ouate de rembourrage Fairfield Poly-Fil, 907 g',
    shortDescription: 'Une ouate de rembourrage en polyester, douce et lavable, pour garnir uniformément coussins, jouets et éléments rembourrés.',
  },
  'jupean-medium-interfacing': {
    name: 'Entoilage thermocollant moyen JUPEAN, 27 m',
    shortDescription: "Un entoilage thermocollant qui donne de la tenue aux sacs, aux cols et aux trousses pour qu'ils gardent leur forme.",
  },
  'plantional-lightweight-interfacing': {
    name: 'Entoilage thermocollant léger PLANTIONAL, 27 m',
    shortDescription: 'Un entoilage thermocollant non tissé et léger qui apporte une tenue douce sans rigidifier les projets en coton.',
  },
  'hbi-wash-away-stabilizer': {
    name: 'Stabilisateur hydrosoluble HBI, 30 cm × 23 m',
    shortDescription: "Un stabilisateur soluble dans l'eau qui soutient la broderie et la dentelle autoportante, puis disparaît entièrement au rinçage.",
  },
  'brothread-wash-away-stabilizer': {
    name: 'Stabilisateur hydrosoluble New brothread, 25 cm × 2,7 m',
    shortDescription: "Un petit rouleau de stabilisateur hydrosoluble pour la broderie machine, qui se dissout dans l'eau froide ou tiède.",
  },

  /* ---- Galons, rubans et cordons ---- */
  'lace-ribbon': {
    name: 'Galon de dentelle pour la couture',
    shortDescription: 'Une dentelle délicate pour finir les bords, embellir les sacs et ajouter une touche fait main à tous vos projets.',
  },
  'sari-silk-ribbon': {
    name: 'Ruban de soie de sari recyclé, 41 m',
    shortDescription: "Des bandes de soie aux bords effilochés, découpées dans des saris recyclés ; chaque lot est un mélange de couleurs unique pour les finitions et l'art textile.",
  },
  'mandala-crafts-bias-tape': {
    name: 'Biais replié Mandala Crafts, 13 mm (crème)',
    shortDescription: 'Une longue bobine de biais déjà plié pour border les contours, les ourlets et les arrondis avec une finition soignée.',
  },
  'willbond-twill-tape': {
    name: 'Ruban sergé chevron en coton Willbond, 10 mm',
    shortDescription: 'Un ruban sergé en coton naturel pour les cordons de serrage, les liens, les boucles de suspension et le renfort des coutures sur les sacs et les tabliers.',
  },
  'windyun-webbing': {
    name: 'Sangle polycoton Windyun, 38 mm, 36 couleurs',
    shortDescription: 'Trente-six rouleaux de sangle solide pour les anses de sac, les bandoulières et les ceintures, dans presque toutes les couleurs dont vous avez besoin.',
  },
  'knit-elastic-set': {
    name: "Lot d'élastiques tricotés, 4 largeurs (blanc)",
    shortDescription: "Quatre rouleaux d'élastique tricoté blanc de 1,5 à 5 cm de large, avec des pinces pour l'enfiler, pour les ceintures et les poignets.",
  },
  'xkdous-knit-elastic': {
    name: 'Élastique tricoté XKDOUS, 6 mm × 37 m',
    shortDescription: "Un long rouleau d'élastique blanc étroit pour les ceintures, les manches et les chouchous.",
  },
  'cridoz-satin-cord': {
    name: 'Cordon queue de rat en satin Cridoz, 12 rouleaux',
    shortDescription: 'Un cordon soyeux en satin de nylon, en couleurs variées, pour les fermetures à coulisse, les pochettes cadeaux, le tressage et les liens décoratifs.',
  },
  'kinglake-jute-twine': {
    name: 'Ficelle de jute naturelle KINGLAKE, 2 mm × 200 m',
    shortDescription: 'Une ficelle en jute naturel pour des étiquettes au style rustique, des cordons de serrage, des emballages cadeaux et des touches décoratives.',
  },

  /* ---- Fermetures, boutons et fils ---- */
  'mandala-crafts-zippers': {
    name: 'Fermetures éclair Mandala Crafts 36 cm, lot de 80',
    shortDescription: 'Quatre-vingts fermetures éclair en nylon, non séparables, en 20 couleurs, pour les trousses, les coussins et les vêtements.',
  },
  'mebuzip-zipper-by-the-yard': {
    name: 'Fermeture au mètre MebuZip n° 5, 9 m + 25 curseurs',
    shortDescription: 'Une fermeture éclair en continu, couleur laiton vieilli, avec des curseurs séparés : coupez une fermeture de la longueur voulue pour vos sacs.',
  },
  'swpeet-covered-buttons': {
    name: 'Boutons recouverts de tissu Swpeet, lot de 100',
    shortDescription: 'Des boutons ronds à queue recouverts de satin, en dix couleurs, pour les coussins, les manteaux et les détails décoratifs faits main.',
  },
  'hagbou-thread-set': {
    name: 'Lot de fils à coudre HAGBOU, 36 couleurs + canettes',
    shortDescription: 'Trente-six bobines de fil polyester, chacune avec sa canette assortie, pour avoir toujours la bonne couleur sous la main.',
  },
  'dritz-invisible-thread': {
    name: 'Fil invisible Dritz, transparent, 137 m',
    shortDescription: "Un fil transparent qui se fond dans tous les tissus, pratique pour le quilting, l'appliqué et les points de finition discrets.",
  },

  /* ================= MON STUDIO VIDÉO ================= */
  'sensyne-ring-light': {
    name: 'Anneau lumineux SENSYNE 25 cm avec trépied 127 cm',
    shortDescription: 'Un anneau lumineux alimenté par USB sur un pied extensible pour téléphone, avec trois modes de couleur et une télécommande, pour un éclairage uniforme.',
  },
  'skytex-softbox-kit': {
    name: "Kit d'éclairage softbox Skytex, 2 lampes",
    shortDescription: 'Deux softbox de 51 × 71 cm avec ampoules LED à intensité réglable et pieds, qui adoucissent les ombres quand vous filmez ou photographiez.',
  },
  'liphisy-tripod': {
    name: 'Trépied téléphone et appareil photo Liphisy, 163 cm',
    shortDescription: 'Un grand trépied en aluminium avec support pour téléphone, rotule boule et télécommande, pour des prises de vue stables sous tous les angles.',
  },
  'iphone-15-pro-max-renewed': {
    name: 'Apple iPhone 15 Pro Max, 512 Go (Reconditionné)',
    shortDescription: "Un iPhone 15 Pro Max reconditionné avec un écran de 6,7 pouces et un appareil photo qui capture en gros plan les détails de couture.",
  },
  'macbook-pro-m5': {
    name: 'Apple MacBook Pro 14 pouces, M5, 16 Go / 1 To',
    shortDescription: 'Un ordinateur portable de 14 pouces avec puce M5 pour monter des vidéos, classer des photos et faire tourner une petite activité créative.',
  },
  'ergear-standing-desk': {
    name: 'Bureau assis-debout électrique ErGear, 122 × 61 cm',
    shortDescription: 'Un bureau assis-debout électrique avec quatre hauteurs mémorisées, pour couper, coudre ou faire du montage à une hauteur confortable.',
  },
};

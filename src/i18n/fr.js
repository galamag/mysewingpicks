/* French texts of the site — interface + pages. Same keys as en.js (a missing or
   extra key fails the build). Values are plain text (Astro escapes them) unless
   the key ends in "Html". Function values keep their parameters ((title) =>, (links) =>).
   Rules: warm first person (the author is a woman: « ravie »), « vous »;
   centimetres only, decimal comma (« 0,5 cm »); brands in Latin;
   « je recommande personnellement » — never « j'utilise ».
   Typography: straight apostrophes (as in Amazon's official phrases); a NON-BREAKING
   space (U+00A0, looks like a plain space here) before : ; ! ? and », after «, and
   between a number and its unit (« 0,5 cm »). Keep it when editing a phrase. */
export default {
  brand: 'My Sewing Picks',
  ui: {
    nav: { home: 'Accueil', tools: 'Outils', fabrics: 'Tissus', projects: 'Projets', setup: 'Mon studio', about: 'À propos' },
    homeLabel: 'accueil',
    logo: '(logo)',
    toggleMenu: 'Ouvrir ou fermer le menu',
    primaryNav: 'Menu principal',
    language: 'Langue',
    viewOnAmazon: 'Voir sur Amazon',
    paidLink: '(publicité)',
    jumpToSection: 'Aller à la section',
    playVideo: (title) => `Lire la vidéo : ${title}`,
    watchOnYouTube: 'Regarder sur YouTube',
    socialLinks: 'Réseaux sociaux',
    ogImageAlt: 'My Sewing Picks — outils et tissus de couture choisis avec soin',
    pageDisclosure: 'Publicité : les liens ci-dessous sont des liens affiliés. En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises.',
    pageDisclosureSome: 'Publicité : certains liens de cette page sont des liens affiliés. En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises.',
    disclosure: 'En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises.',
    amazonContentNotice:
      "Certains contenus qui s'affichent sur ce site proviennent d'Amazon. Ce contenu est fourni « en l'état » et peut être modifié ou supprimé à tout moment.",
    privacy: 'Confidentialité et cookies',
    rooms: {
      tapRoom: 'Touchez une pièce pour y entrer',
      tapItem: 'Touchez un objet de la pièce pour le voir',
      tapShelf: 'Touchez une table ou une étagère pour aller à sa section',
      tapProject: "Touchez un projet pour l'ouvrir",
      house: 'Notre atelier de couture : touchez une pièce',
      roomLabel: (name) => `${name} : pièce illustrée`,
      close: 'Fermer',
    },
  },
  pages: {
    home: {
      title: 'My Sewing Picks — outils et tissus que je recommande',
      description: "Un coin douillet d'outils et de tissus de couture et de patchwork choisis avec soin par la créatrice de la chaîne YouTube SEWING DIY PATCHWORK.",
      eyebrow: 'Fait main avec amour',
      tagline: 'Des outils et des tissus choisis avec soin pour votre coin couture.',
      blurbHtml:
        "Bienvenue ! Je suis la créatrice de <strong>SEWING DIY PATCHWORK</strong>, la chaîne où je couds des sacs, des quilts, des vêtements et de jolies choses douillettes pour la maison. Tout ce que vous trouverez ici, je le recommande personnellement — et je l'ai réuni en un seul endroit pour que vous aussi trouviez votre prochain coup de cœur.",
      browse: 'Voir ma sélection',
      shelves: {
        eyebrow: 'Trois petites collections',
        heading: "Trouvez ce qu'il vous faut",
        intro: 'Tout est rangé sur trois étagères toutes simples : les outils qui facilitent la couture, les tissus et matériaux qui donnent vie à un projet, et le matériel pour filmer vos propres créations.',
      },
      cards: {
        tools: { heading: 'Outils', text: 'Machines à coudre, pieds presseurs, cutters rotatifs, règles, ciseaux, fers à repasser et stylos de marquage — les fidèles alliés qui rendent chaque projet net et précis.', more: 'Voir les outils →' },
        fabrics: { heading: 'Tissus et matériaux', text: "Tissus de patchwork, ouatine, entoilage, dentelle, rubans, fermetures éclair et fil — les couleurs et les textures qui transforment une idée en un objet que l'on tient entre ses mains.", more: 'Voir les tissus →' },
        setup: { heading: 'Mon studio vidéo', text: 'Anneau lumineux, softbox, trépied, appareil photo, ordinateur portable et bureau — tout pour aménager un petit coin douillet où filmer vos propres vidéos de couture.', more: 'Voir mon studio →' },
      },
      sewAlong: {
        eyebrow: 'Nouveau · cousez avec moi',
        heading: 'Regardez chaque projet prendre forme',
        intro: 'Des projets étape par étape, avec des guides animés et les vraies dimensions de coupe — un tote bag doublé et une panière en tissu pour Noël.',
        more: 'Voir étape par étape →',
      },
      channel: {
        eyebrow: 'De nouvelles vidéos régulièrement',
        heading: 'Cousez avec moi',
        text: 'Je partage des tutos étape par étape pour les couturières débutantes comme confirmées — patchwork, quilting, art quilts et créations du quotidien. Venez me dire bonjour sur la chaîne !',
        button: 'Voir la chaîne SEWING DIY PATCHWORK',
      },
    },
    tools: {
      title: 'Outils — My Sewing Picks',
      description: 'Les outils de couture et de patchwork que je recommande personnellement : machines à coudre et pieds presseurs, cutters rotatifs, tapis de coupe, règles, ciseaux, stylos de marquage, fers à repasser et petits accessoires pratiques.',
      heading: 'Outils',
      intro: 'Les fidèles alliés qui rendent chaque projet précis — machines, cutters, règles, accessoires de traçage et de repassage que je recommande personnellement.',
    },
    fabrics: {
      title: 'Tissus et matériaux — My Sewing Picks',
      description: 'Les tissus et matériaux que je recommande personnellement : tissus de patchwork, ouatine et entoilage, dentelle, rubans, cordons, fermetures éclair, boutons et fil pour votre prochain projet.',
      heading: 'Tissus et matériaux',
      intro: 'Les couleurs et les textures qui donnent vie à un projet — tissus, ouatine, galons et mercerie que je recommande personnellement pour le patchwork et les créations du quotidien.',
    },
    setup: {
      title: 'Mon studio vidéo — My Sewing Picks',
      description: "L'éclairage, le trépied, l'appareil photo, l'ordinateur portable et le bureau que je recommande personnellement pour filmer vos propres vidéos de couture et de patchwork.",
      heading: 'Mon studio vidéo',
      intro: "Vous pensez à filmer vos propres vidéos de couture ? Voici l'éclairage, le trépied, l'appareil photo, l'ordinateur portable et le bureau que je recommande personnellement pour un petit coin douillet où filmer.",
    },
    projects: {
      title: 'Projets à coudre avec moi — My Sewing Picks',
      description: 'Des projets de couture étape par étape, avec des guides animés, les vraies dimensions de coupe et la vidéo de la chaîne SEWING DIY PATCHWORK.',
      eyebrow: 'Cousez avec moi',
      heading: 'Projets',
      intro: 'Choisissez un projet et regardez-le prendre forme, étape par étape — chaque pièce avec ses vraies dimensions, chaque couture animée, avec en plus la vidéo et le matériel nécessaire.',
      more: 'Voir étape par étape →',
    },
    project: {
      eyebrow: 'Cousez avec moi · projet',
      videoEyebrow: 'La réalisation en vidéo',
      videoHeading: 'La vidéo',
      needsEyebrow: 'Pour ce projet',
      needsHeading: "Ce qu'il vous faut",
      faqEyebrow: 'Bon à savoir',
      faqHeading: 'Questions et réponses',
      more: '← Autres projets à coudre',
    },
    about: {
      title: 'À propos — My Sewing Picks',
      description: 'Découvrez la créatrice de SEWING DIY PATCHWORK — des tutos de patchwork, de quilting et de créations douillettes, ainsi que les outils et matériaux que je recommande personnellement.',
      eyebrow: 'Bonjour et bienvenue',
      heading: 'À propos de ce petit coin couture',
      paragraphsHtml: [
        "Je suis ravie que vous soyez là ! Vous êtes chez <strong>SEWING DIY PATCHWORK</strong> — ma chaîne YouTube où je partage des tutos pour des projets de couture de toutes sortes, des créations simples pour débuter aux réalisations plus élaborées. Au programme : sacs et trousses à maquillage, rangements, plaids, vêtements, cadeaux faits main pleins d'attention et toutes sortes de choses utiles pour la maison.",
        "Mais ma vraie passion, c'est le patchwork — le quilting, les art quilts, les quilts collage et le design textile. J'adore cette lente magie qui transforme de petites chutes de tissu en un bel ouvrage complet, et j'essaie de rendre ces techniques accessibles, que vous preniez un cutter rotatif en main pour la toute première fois ou que vous cousiez depuis des années.",
        "Je publie souvent de nouvelles vidéos, il y a donc toujours un nouveau projet à coudre avec moi. Et comme vous êtes nombreuses à me demander ce que je recommande, j'ai réuni ma sélection ici : chaque outil et chaque matériau de ce site, je le <em>recommande personnellement</em>. Rien sur ces étagères n'est là pour faire du remplissage — chaque choix est fait avec soin pour les couturières comme vous.",
        "Installez-vous confortablement, faites un tour, et j'espère que vous trouverez ici de quoi inspirer votre prochain projet. Bonne couture !",
      ],
      signature: '— Avec amour, de mon coin couture au vôtre 🧵',
      button: 'Voir ma chaîne YouTube',
    },
    // Privacy & Cookies page. A faithful translation of en.js (a legal disclosure:
    // sentence by sentence, no claim added or dropped). `links` — see en.js.
    privacy: {
      title: 'Confidentialité et cookies — My Sewing Picks',
      description: 'Comment My Sewing Picks utilise les cookies et quelles informations sont collectées lors de votre visite — par Amazon, Cloudflare et YouTube.',
      eyebrow: 'Confidentialité et cookies',
      heading: 'Confidentialité et cookies',
      updated: 'Dernière mise à jour : 15 octobre 2026',
      bodyHtml: (links) => `
          <p>
            My Sewing Picks est un petit site en lecture seule. Il n'y a ni comptes, ni inscriptions,
            ni commentaires, ni formulaires de contact, ni newsletters, ni outil d'analyse ou traceur
            publicitaire qui me soit propre ; ce site ne dépose aucun cookie qui lui soit propre et
            ne conserve lui-même aucune information sur les visiteurs. Quelques services extérieurs
            aident le site à fonctionner, et Amazon intervient parce qu'il s'agit d'un site affilié.
            Cette page explique ce qu'ils font.
          </p>

          <h2>Amazon : liens affiliés et images de produits</h2>
          <p>
            En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les
            conditions requises. Les boutons « Voir sur Amazon » et les images de produits sont des
            liens affiliés vers Amazon. Lorsque vous cliquez sur l'un d'eux, vous arrivez sur le site
            d'Amazon, et Amazon y dépose et y lit ses propres cookies — c'est ainsi qu'Amazon sait
            que la visite vient de ce site.
          </p>
          <p>
            La plupart des images de produits sont affichées directement depuis les serveurs d'Amazon
            (m.media-amazon.com) via l'API officielle d'Amazon : votre navigateur les télécharge donc
            chez Amazon, et Amazon peut voir votre adresse IP, des informations sur votre navigateur
            et la page sur laquelle vous vous trouvez.
          </p>
          <p>
            <strong>Des tiers, y compris Amazon, peuvent fournir du contenu sur ce site, collecter
            des informations directement auprès des visiteurs et déposer ou reconnaître des cookies
            sur les navigateurs des visiteurs.</strong>
          </p>
          <p>
            Amazon ne me transmet que des rapports globaux — par exemple le nombre de clics sur les
            liens et les articles commandés — et jamais votre nom, votre adresse ni quoi que ce soit
            d'autre qui permette de savoir qui vous êtes. La façon dont Amazon utilise vos informations
            est décrite dans l'<a href="${links.amazonPrivacy}" target="_blank" rel="noopener">Avis de confidentialité d'Amazon.com</a>
            et dans son <a href="${links.amazonAds}" target="_blank" rel="noopener">avis sur les publicités basées sur les centres d'intérêt</a> ;
            sur une autre boutique Amazon, c'est l'avis de confidentialité de cette boutique qui s'applique.
          </p>

          <h2>Cloudflare : sécurité et chargement rapide</h2>
          <p>
            Le site est distribué via Cloudflare, qui le protège contre les attaques et les robots et
            en accélère le chargement. Pour cela, Cloudflare traite des données techniques comme votre
            adresse IP et des informations sur votre navigateur, peut exécuter un court script de
            détection des robots et peut déposer des cookies de sécurité — par exemple
            <code>__cf_bm</code> (qui expire après 30 minutes d'inactivité) et, si l'on vous demande de
            vérifier que vous êtes un humain, <code>cf_clearance</code>. Cloudflare décrit ces cookies
            comme strictement nécessaires ; voir la
            <a href="${links.cloudflareCookies}" target="_blank" rel="noopener">politique de Cloudflare en matière de cookies</a>.
          </p>

          <h2>Vidéos YouTube</h2>
          <p>
            Les pages de projets contiennent une vidéo de ma chaîne YouTube. Tant que vous n'appuyez
            pas sur lecture, seule l'image d'aperçu de la vidéo s'affiche, et elle provient de ce site
            lui-même — YouTube n'est pas contacté. Lorsque vous appuyez sur lecture, le lecteur se
            charge depuis YouTube en mode confidentialité avancée (youtube-nocookie.com), et à partir
            de ce moment YouTube (Google) peut utiliser des cookies et des technologies similaires,
            comme décrit dans les
            <a href="${links.googlePrivacy}" target="_blank" rel="noopener">Règles de confidentialité de Google</a>.
          </p>

          <h2>Polices de caractères</h2>
          <p>
            Les polices du site sont chargées depuis ce site lui-même. Votre navigateur ne contacte
            pour cela ni Google ni aucun autre service de polices.
          </p>

          <h2>Journaux du serveur</h2>
          <p>
            Comme pour presque tous les sites web, mon hébergeur et Cloudflare enregistrent
            automatiquement des informations techniques de base sur chaque requête — adresse IP,
            type de navigateur, page demandée, page de provenance et heure. Elles servent à fournir
            le site, à le sécuriser et à corriger les problèmes. Je ne les utilise pas pour vous
            identifier ni pour établir des profils, et je ne vends ni ne partage aucune donnée
            personnelle.
          </p>

          <h2>Vos choix</h2>
          <ul>
            <li>
              Vous pouvez bloquer ou supprimer les cookies dans les paramètres de votre navigateur.
              Ce site fonctionne sans eux, même si la vérification de sécurité de Cloudflare peut vous
              demander à nouveau de vérifier que vous êtes un humain.
            </li>
            <li>
              Pour gérer les publicités d'Amazon basées sur vos centres d'intérêt, utilisez les
              <a href="${links.amazonAdPrefs}" target="_blank" rel="noopener">Préférences publicitaires d'Amazon</a>.
              Pour les publicités basées sur les centres d'intérêt d'autres entreprises, consultez
              <a href="${links.aboutAds}" target="_blank" rel="noopener">aboutads.info</a> (États-Unis),
              <a href="${links.yourAdChoicesCa}" target="_blank" rel="noopener">youradchoices.ca</a> (Canada) ou
              <a href="${links.yourOnlineChoicesEu}" target="_blank" rel="noopener">youronlinechoices.eu</a> (Europe).
            </li>
          </ul>

          <h2>Modifications et questions</h2>
          <p>
            Si le site se met à utiliser quelque chose de nouveau, je mettrai à jour cette page et la
            date ci-dessus. Des questions ? Contactez-moi via ma
            <a href="${links.youtube}" target="_blank" rel="noopener">chaîne YouTube</a>.
          </p>
      `,
    },
  },
};

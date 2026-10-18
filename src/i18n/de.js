/* German texts of the site — interface + pages. Same keys as en.js (a missing or
   extra key fails the build). Values are plain text (Astro escapes them) unless
   the key ends in "Html". Function values keep their parameters ((title) =>, (links) =>).
   Rules: warm first person (the maker is a woman), «du»; centimetres only, decimal
   comma («0,5 cm»); brands in Latin; «ich persönlich empfehle» — never «ich benutze».
   Amazon phrases word for word (spec wave 1, 5.1); per-link marker «(Anzeige)» (5.2). */
export default {
  brand: 'My Sewing Picks',
  ui: {
    nav: { home: 'Start', tools: 'Werkzeuge', fabrics: 'Stoffe', projects: 'Projekte', guides: 'Grundlagen', setup: 'Mein Studio', about: 'Über mich' },
    homeLabel: 'Startseite',
    logo: 'Logo',
    toggleMenu: 'Menü öffnen oder schließen',
    primaryNav: 'Hauptmenü',
    language: 'Sprache',
    langOffer: { page: 'Diese Seite gibt es auch auf Deutsch', site: 'Diese Website gibt es auch auf Deutsch', open: 'Öffnen', dismiss: 'Nein, danke' },
    viewOnAmazon: 'Bei Amazon ansehen',
    paidLink: '(Anzeige)',
    jumpToSection: 'Zum Abschnitt springen',
    toTop: 'Nach oben',
    playVideo: (title) => `Video abspielen: ${title}`,
    watchOnYouTube: 'Auf YouTube ansehen',
    howItsDone: 'So wird es gemacht',
    socialLinks: 'Soziale Netzwerke',
    ogImageAlt: 'My Sewing Picks — handverlesene Nähwerkzeuge und Stoffe',
    pageDisclosure: 'Anzeige: Die folgenden Links sind Affiliate-Links. Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.',
    pageDisclosureSome: 'Anzeige: Einige Links auf dieser Seite sind Affiliate-Links. Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.',
    disclosure: 'Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.',
    amazonContentNotice:
      'Bestimmte Inhalte, die auf dieser Website angezeigt werden, stammen von Amazon. Diese Inhalte werden ‚wie besehen‘ bereitgestellt und können jederzeit geändert oder entfernt werden.',
    privacy: 'Datenschutz & Cookies',
    rooms: {
      tapRoom: 'Tippe auf ein Zimmer, um hineinzugehen',
      tapItem: 'Tippe auf etwas im Zimmer, um es zu sehen',
      tapShelf: 'Tippe auf einen Tisch oder ein Regal, um zum Abschnitt zu springen',
      tapProject: 'Tippe auf ein Projekt, um es zu öffnen',
      house: 'Unsere Nähstube: Tippe auf ein Zimmer',
      roomLabel: (name) => `${name}: illustriertes Zimmer`,
      close: 'Schließen',
    },
  },
  pages: {
    home: {
      title: 'My Sewing Picks — Werkzeuge & Stoffe, die ich empfehle',
      description: 'Eine gemütliche Ecke mit handverlesenen Werkzeugen und Stoffen zum Nähen und Quilten, ausgewählt von der Frau hinter dem YouTube-Kanal SEWING DIY PATCHWORK.',
      eyebrow: 'Mit Liebe handgemacht',
      tagline: 'Handverlesene Werkzeuge & Stoffe für deine Nähecke.',
      blurbHtml:
        'Herzlich willkommen! Ich bin die Frau hinter <strong>SEWING DIY PATCHWORK</strong> – dort nähe ich Taschen, Quilts, Kleidung und gemütliche Dinge fürs Zuhause. Alles, was du hier findest, empfehle ich persönlich – an einem Ort gesammelt, damit auch du dein nächstes Lieblingsstück findest.',
      browse: 'Meine Auswahl ansehen',
      shelves: {
        eyebrow: 'Drei kleine Sammlungen',
        heading: 'Finde, was du brauchst',
        intro: 'Alles ist in drei einfache Regale sortiert – Werkzeuge, die das Nähen leichter machen, Stoffe & Materialien, die ein Projekt zum Leben erwecken, und die Ausrüstung, um deine eigenen Nähprojekte zu filmen.',
      },
      cards: {
        tools: { heading: 'Werkzeuge', text: 'Nähmaschinen, Nähfüße, Rollschneider, Lineale, Scheren, Bügeleisen und Markierstifte – die treuen Helfer, mit denen jedes Projekt sauber und präzise gelingt.', more: 'Werkzeuge entdecken →' },
        fabrics: { heading: 'Stoffe & Materialien', text: 'Patchworkstoffe, Volumenvlies, Bügeleinlage, Spitze, Bänder, Reißverschlüsse und Garn – die Farben und Strukturen, die aus einer Idee etwas machen, das du in den Händen halten kannst.', more: 'Stoffe entdecken →' },
        setup: { heading: 'Mein Video-Setup', text: 'Ringlicht, Softboxen, Stativ, Kamera, Laptop und Schreibtisch – alles für eine gemütliche kleine Ecke, in der du deine eigenen Nähvideos filmen kannst.', more: 'Mein Video-Setup entdecken →' },
      },
      sewAlong: {
        eyebrow: 'Neu · zum Mitnähen',
        heading: 'Sieh zu, wie Nähprojekte entstehen',
        intro: 'Schritt-für-Schritt-Projekte mit animierten Anleitungen und echten Zuschnittmaßen – eine gefütterte Tote Bag und ein Stoffkorb für Weihnachten.',
        more: 'Schritt für Schritt ansehen →',
      },
      channel: {
        eyebrow: 'Regelmäßig neue Videos',
        heading: 'Näh mit mir',
        text: 'Ich teile Schritt-für-Schritt-Anleitungen für Anfänger und Fortgeschrittene – Patchwork, Quilten, Art Quilts und Genähtes für den Alltag. Schau auf dem Kanal vorbei und sag Hallo!',
        button: 'SEWING DIY PATCHWORK besuchen',
      },
    },
    tools: {
      title: 'Werkzeuge — My Sewing Picks',
      description: 'Werkzeuge zum Nähen und Quilten, die ich persönlich empfehle: Nähmaschinen und Nähfüße, Rollschneider, Schneidematten, Lineale, Scheren, Markierstifte, Bügeleisen und praktische Helfer.',
      heading: 'Werkzeuge',
      intro: 'Die treuen Helfer, mit denen jedes Projekt präzise gelingt – Maschinen, Rollschneider, Lineale sowie Hilfsmittel zum Markieren und Bügeln, die ich persönlich empfehle.',
    },
    fabrics: {
      title: 'Stoffe & Materialien — My Sewing Picks',
      description: 'Stoffe und Materialien, die ich persönlich empfehle: Patchworkstoffe, Volumenvlies und Bügeleinlage, Spitze, Bänder, Kordeln, Reißverschlüsse, Knöpfe und Garn für dein nächstes Projekt.',
      heading: 'Stoffe & Materialien',
      intro: 'Die Farben und Strukturen, die ein Projekt zum Leben erwecken – Stoffe, Vlies, Borten und Kurzwaren, die ich persönlich für Patchwork und Genähtes für den Alltag empfehle.',
    },
    setup: {
      title: 'Mein Video-Setup — My Sewing Picks',
      description: 'Licht, Stativ, Kamera, Laptop und Schreibtisch, die ich persönlich empfehle, um deine eigenen Näh- und Quiltvideos zu filmen.',
      heading: 'Mein Video-Setup',
      intro: 'Du überlegst, deine eigenen Nähvideos zu filmen? Hier sind Licht, Stativ, Kamera, Laptop und Schreibtisch, die ich persönlich für eine gemütliche kleine Filmecke empfehle.',
    },
    projects: {
      title: 'Projekte zum Mitnähen — My Sewing Picks',
      description: 'Schritt-für-Schritt-Nähprojekte mit animierten Anleitungen, echten Zuschnittmaßen und dem Video vom Kanal SEWING DIY PATCHWORK.',
      eyebrow: 'Zum Mitnähen',
      heading: 'Projekte',
      intro: 'Such dir ein Projekt aus und sieh zu, wie es Schritt für Schritt entsteht – jedes Teil mit seinen echten Maßen, jede Naht animiert, dazu das Video und alles, was du brauchst.',
      more: 'Schritt für Schritt ansehen →',
    },
    project: {
      eyebrow: 'Zum Mitnähen · Projekt',
      videoEyebrow: 'So wird es genäht',
      videoHeading: 'Das Video',
      needsEyebrow: 'Für dieses Projekt',
      needsHeading: 'Das brauchst du',
      faqEyebrow: 'Gut zu wissen',
      faqHeading: 'Fragen und Antworten',
      more: '← Weitere Projekte zum Mitnähen',
    },
    guides: {
      title: 'Nähen lernen für Anfänger: Grundlagen Schritt für Schritt',
      description: 'Nähen lernen für Anfänger: jede Grundtechnik Schritt für Schritt animiert, mit den echten Maßen aus unseren Projekten. Zuerst: Futter in eine Tasche einnähen.',
      eyebrow: 'Nähgrundlagen',
      heading: 'Nähen lernen für Anfänger: Grundlagen Schritt für Schritt',
      intro: 'Eine Technik nach der anderen, jeder Schritt animiert und mit den echten Maßen aus meinen Projekten. Du kommst bei einem Schritt in einem Projekt nicht weiter? Hier siehst du, wie es gemacht wird.',
      more: 'Schritt für Schritt ansehen →',
      groups: {
        machine: { title: 'Die Nähmaschine', intro: 'Einfädeln, Spule, Stiche und Nähfüße – so machst du die Maschine bereit zum Nähen.' },
        cutting: { title: 'Zuschneiden', intro: 'Rollschneider, Lineal und Schneidematte – Streifen, Quadrate und Dreiecke gerade zuschneiden.' },
        construction: { title: 'Zusammennähen', intro: 'Die Schritte, mit denen aus den Zuschnitten eine fertige Tasche oder ein Korb wird: Futter, Wenden und Absteppen.' },
        patchwork: { title: 'Patchwork und Quilten', intro: 'Stoff schneiden und zu Mustern zusammennähen: Dreiecke aus Quadraten, Flying Geese, Blöcke und Quilten.' },
      },
    },
    guide: {
      eyebrow: 'Nähgrundlagen · Anleitung',
      usedInEyebrow: 'In den Projekten',
      usedInHeading: 'Wo du es brauchst',
      usedInSteps: (projectTitle, from, to) => `${projectTitle}: ${from === to ? `Schritt ${from}` : `Schritte ${from}–${to}`}`,
      needsEyebrow: 'Für diese Anleitung',
      needsHeading: 'Das brauchst du',
      videoEyebrow: 'Im Video',
      videoHeading: 'Die Technik im Video',
      videoIntro: (projectTitle) => `${projectTitle}: Das Video beginnt genau dort, wo diese Technik anfängt.`,
      more: '← Weitere Nähgrundlagen',
    },
    about: {
      title: 'Über mich — My Sewing Picks',
      description: 'Lerne die Frau hinter SEWING DIY PATCHWORK kennen – Anleitungen für Patchwork, Quilten und gemütliche Nähprojekte, dazu die Werkzeuge und Materialien, die ich persönlich empfehle.',
      eyebrow: 'Hallo & willkommen',
      heading: 'Über diese kleine Nähecke',
      paragraphsHtml: [
        'Wie schön, dass du da bist! Hier ist das Zuhause von <strong>SEWING DIY PATCHWORK</strong> – meinem YouTube-Kanal, auf dem ich Anleitungen für Nähprojekte aller Art teile, von einfachen Projekten für Anfänger bis zu aufwendigeren Stücken. Dazu gehören Taschen und Kosmetiktäschchen, Organizer, Decken, Kleidung, liebevoll handgemachte Geschenke und allerlei Nützliches fürs Zuhause.',
        'Meine wahre Leidenschaft ist aber Patchwork – Quilten, Art Quilts, Collage-Quilts und Textildesign. Ich liebe die langsame Magie, aus kleinen Stoffresten etwas Ganzes und Schönes zu machen, und ich versuche, diese Techniken verständlich zu erklären – egal, ob du zum allerersten Mal einen Rollschneider in die Hand nimmst oder schon seit Jahren nähst.',
        'Ich lade oft neue Videos hoch, es gibt also immer ein neues Projekt zum Mitnähen. Und weil mich so viele von euch fragen, was ich empfehlen würde, habe ich meine Auswahl hier gesammelt: Jedes Werkzeug und jedes Material auf dieser Website <em>empfehle ich persönlich</em>. Nichts in diesen Regalen ist nur dazu da, Platz zu füllen – jedes Stück ist mit Sorgfalt ausgewählt, für Nähbegeisterte wie dich.',
        'Mach es dir gemütlich, stöbere ein wenig herum – ich hoffe, du findest etwas, das dich zu deinem nächsten Projekt inspiriert. Viel Spaß beim Nähen!',
      ],
      signature: '– Mit Liebe, aus meiner Nähecke in deine 🧵',
      button: 'Zu meinem YouTube-Kanal',
    },
    // Privacy & Cookies page. A faithful translation of en.js (a legal disclosure:
    // sentence by sentence, no claim added or dropped). `links` — see en.js.
    privacy: {
      title: 'Datenschutz & Cookies — My Sewing Picks',
      description: 'Wie My Sewing Picks Cookies verwendet und welche Informationen bei deinem Besuch erhoben werden – von Amazon, Cloudflare und YouTube.',
      eyebrow: 'Datenschutz & Cookies',
      heading: 'Datenschutz & Cookies',
      updated: 'Zuletzt aktualisiert: 18. Oktober 2026',
      bodyHtml: (links) => `
          <p>
            My Sewing Picks ist eine kleine Website, die nur zum Lesen da ist. Es gibt keine
            Benutzerkonten, Registrierungen, Kommentare, Kontaktformulare oder Newsletter, keine
            eigene Webanalyse und keine eigenen Werbe-Tracker; diese Website setzt keine eigenen
            Cookies und speichert selbst keine Informationen über Besucher. Die einzige Ausnahme: Wenn
            du auf den Sprachhinweis unten auf dem Bildschirm antwortest (oder oben auf der Seite
            eine Sprache wählst), wird im lokalen Speicher (Local Storage) deines Browsers eine
            kleine Notiz abgelegt, damit diese Wahl gespeichert bleibt – sie ist kein Cookie, wird
            nirgendwohin gesendet, und du kannst sie in deinem Browser löschen. Einige externe Dienste
            helfen dabei, dass die Website funktioniert, und Amazon ist beteiligt, weil dies eine
            Affiliate-Website ist. Diese Seite erklärt, was sie tun.
          </p>

          <h2>Amazon: Affiliate-Links und Produktbilder</h2>
          <p>
            Als Amazon-Partner verdiene ich an qualifizierten Verkäufen. Die Schaltflächen
            „Bei Amazon ansehen“ und die Produktbilder sind Affiliate-Links zu Amazon. Wenn du auf
            einen davon klickst, gelangst du auf die Website von Amazon, und Amazon setzt und liest
            dort seine eigenen Cookies – so erkennt Amazon, dass der Besuch von dieser Website kam.
          </p>
          <p>
            Die meisten Produktbilder werden über die offizielle API von Amazon direkt von den
            Servern von Amazon (m.media-amazon.com) angezeigt. Dein Browser lädt sie also bei Amazon
            herunter, und Amazon kann deine IP-Adresse, Angaben zu deinem Browser und die Seite
            sehen, auf der du dich befindest.
          </p>
          <p>
            <strong>Dritte, einschließlich Amazon, können auf dieser Website Inhalte bereitstellen,
            Informationen direkt von Besuchern erheben und Cookies in den Browsern der Besucher
            setzen oder erkennen.</strong>
          </p>
          <p>
            Amazon gibt mir nur zusammengefasste Berichte – etwa, wie oft die Links angeklickt
            wurden und welche Artikel bestellt wurden –, aber niemals deinen Namen, deine Adresse
            oder sonst etwas, das verrät, wer du bist. Wie Amazon deine Daten verwendet, steht in der
            <a href="${links.amazonPrivacy}" target="_blank" rel="noopener">Datenschutzerklärung von Amazon.com</a>
            und in seinem <a href="${links.amazonAds}" target="_blank" rel="noopener">Hinweis zu interessenbasierter Werbung</a>;
            in einem anderen Amazon-Shop gilt die Datenschutzerklärung dieses Shops.
          </p>

          <h2>Cloudflare: Sicherheit und schnelle Auslieferung</h2>
          <p>
            Die Website wird über Cloudflare ausgeliefert. Cloudflare schützt sie vor Angriffen und
            Bots und macht sie schneller. Dafür verarbeitet Cloudflare technische Daten wie deine IP-Adresse
            und Angaben zu deinem Browser, kann ein kurzes Skript zur Bot-Erkennung ausführen und
            kann Sicherheits-Cookies setzen – zum Beispiel <code>__cf_bm</code> (läuft nach
            30 Minuten Inaktivität ab) und, falls du bestätigen sollst, dass du ein Mensch bist,
            <code>cf_clearance</code>. Cloudflare bezeichnet diese Cookies als unbedingt
            erforderlich; siehe die
            <a href="${links.cloudflareCookies}" target="_blank" rel="noopener">Cookie-Richtlinie von Cloudflare</a>.
          </p>

          <h2>YouTube-Videos</h2>
          <p>
            Auf den Projektseiten gibt es ein Video von meinem YouTube-Kanal. Solange du nicht auf
            Abspielen drückst, wird nur das Vorschaubild des Videos angezeigt, und es kommt von dieser
            Website selbst – es wird keine Verbindung zu YouTube hergestellt. Wenn du auf Abspielen
            drückst, wird der Player von YouTube im erweiterten Datenschutzmodus
            (youtube-nocookie.com) geladen, und ab dann kann YouTube (Google) Cookies und ähnliche
            Technologien verwenden, wie in der
            <a href="${links.googlePrivacy}" target="_blank" rel="noopener">Datenschutzerklärung von Google</a>
            beschrieben.
          </p>

          <h2>Schriften</h2>
          <p>
            Die Schriften der Website werden von dieser Website selbst geladen. Dein Browser stellt
            dafür keine Verbindung zu Google oder einem anderen Webfont-Dienst her.
          </p>

          <h2>Server-Logfiles</h2>
          <p>
            Wie bei fast jeder Website zeichnen mein Webhoster und Cloudflare automatisch grundlegende
            technische Informationen zu jeder Anfrage auf – IP-Adresse, Browsertyp, die angeforderte
            Seite, die Seite, von der du kommst, und den Zeitpunkt. Diese Informationen werden verwendet,
            um die Website auszuliefern, sie sicher zu halten und Probleme zu beheben. Ich nutze sie
            nicht, um dich zu identifizieren oder Profile zu erstellen, und ich verkaufe oder teile
            keine personenbezogenen Daten.
          </p>

          <h2>Deine Möglichkeiten</h2>
          <ul>
            <li>
              Du kannst Cookies in den Einstellungen deines Browsers blockieren oder löschen. Diese
              Website funktioniert auch ohne sie, allerdings kann dich die Sicherheitsprüfung von
              Cloudflare erneut bitten zu bestätigen, dass du ein Mensch bist.
            </li>
            <li>
              Um interessenbasierte Werbung von Amazon zu steuern, nutze die
              <a href="${links.amazonAdPrefs}" target="_blank" rel="noopener">Werbeeinstellungen von Amazon</a>.
              Zu interessenbasierter Werbung anderer Unternehmen siehe
              <a href="${links.aboutAds}" target="_blank" rel="noopener">aboutads.info</a> (USA),
              <a href="${links.yourAdChoicesCa}" target="_blank" rel="noopener">youradchoices.ca</a> (Kanada) oder
              <a href="${links.yourOnlineChoicesEu}" target="_blank" rel="noopener">youronlinechoices.eu</a> (Europa).
            </li>
          </ul>

          <h2>Änderungen und Fragen</h2>
          <p>
            Wenn die Website etwas Neues einsetzt, aktualisiere ich diese Seite und das Datum oben.
            Fragen? Du erreichst mich über meinen
            <a href="${links.youtube}" target="_blank" rel="noopener">YouTube-Kanal</a>.
          </p>
      `,
    },
  },
};

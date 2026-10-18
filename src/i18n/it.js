/* Italian texts of the site — interface + pages. Same keys as en.js (a missing or
   extra key fails the build). Values are plain text (Astro escapes them) unless
   the key ends in "Html". Function values keep their parameters ((title) =>, (links) =>).
   Rules: warm first person, female author («contenta»), the reader is «tu»;
   centimetres only, decimal comma («0,5 cm»); brands in Latin; «consiglio
   personalmente» — never «uso». Amazon phrases (ui.disclosure, ui.amazonContentNotice,
   the second sentence of ui.pageDisclosure*) — the official Italian wording, verbatim. */
export default {
  brand: 'My Sewing Picks',
  ui: {
    nav: { home: 'Home', tools: 'Strumenti', fabrics: 'Tessuti', projects: 'Progetti', setup: 'Il mio studio', about: 'Chi sono' },
    homeLabel: 'pagina iniziale',
    logo: '(logo)',
    toggleMenu: 'Apri o chiudi il menu',
    primaryNav: 'Menu principale',
    language: 'Lingua',
    langOffer: { page: 'Questa pagina è disponibile in italiano', site: 'Questo sito è disponibile in italiano', open: 'Apri', dismiss: 'No, grazie' },
    viewOnAmazon: 'Vedi su Amazon',
    paidLink: '(link a pagamento)',
    jumpToSection: 'Vai alla sezione',
    playVideo: (title) => `Riproduci il video: ${title}`,
    watchOnYouTube: 'Guarda su YouTube',
    socialLinks: 'Link ai social',
    ogImageAlt: 'My Sewing Picks — strumenti e tessuti per il cucito scelti con cura',
    pageDisclosure: 'I link qui sotto sono link di affiliazione. In qualità di Affiliato Amazon io ricevo un guadagno dagli acquisti idonei.',
    pageDisclosureSome: 'Alcuni link in questa pagina sono link di affiliazione. In qualità di Affiliato Amazon io ricevo un guadagno dagli acquisti idonei.',
    disclosure: 'In qualità di Affiliato Amazon io ricevo un guadagno dagli acquisti idonei.',
    amazonContentNotice:
      'Alcuni contenuti che appaiono su questo sito provengono da Amazon. Questo contenuto è fornito "così com\'è" ed è soggetto a modifica o rimozione in qualsiasi momento.',
    privacy: 'Privacy e cookie',
    rooms: {
      tapRoom: 'Tocca una stanza per entrare',
      tapItem: 'Tocca un oggetto nella stanza per vederlo',
      tapShelf: 'Tocca un tavolo o uno scaffale per andare alla sua sezione',
      tapProject: 'Tocca un progetto per aprirlo',
      house: 'Il nostro laboratorio di cucito: tocca una stanza',
      roomLabel: (name) => `${name}: stanza illustrata`,
      close: 'Chiudi',
    },
  },
  pages: {
    home: {
      title: 'My Sewing Picks — Strumenti e tessuti che consiglio',
      description: 'Un angolo accogliente di strumenti e tessuti per cucito e quilting, scelti con cura dalla creatrice del canale YouTube SEWING DIY PATCHWORK.',
      eyebrow: 'Fatto a mano con amore',
      tagline: 'Strumenti e tessuti scelti con cura per il tuo angolo del cucito.',
      blurbHtml:
        "Ti do il benvenuto! Sono la creatrice del canale <strong>SEWING DIY PATCHWORK</strong>, dove cucio borse, quilt, vestiti e oggetti che rendono la casa accogliente. Tutto quello che trovi qui è qualcosa che consiglio personalmente — l'ho raccolto in un unico posto, così anche tu potrai trovare il tuo prossimo colpo di fulmine.",
      browse: 'Scopri la mia selezione',
      shelves: {
        eyebrow: 'Tre piccole collezioni',
        heading: 'Trova quello che ti serve',
        intro: "Tutto è diviso in tre semplici scaffali: gli strumenti che rendono il cucito più facile, i tessuti e i materiali che danno vita a un progetto e l'attrezzatura per filmare le tue creazioni.",
      },
      cards: {
        tools: { heading: 'Strumenti', text: "Macchine da cucire, piedini, taglierine rotanti, righelli, forbici, ferri da stiro e penne per tessuto — l'attrezzatura fidata che rende ogni progetto ordinato e preciso.", more: 'Scopri gli strumenti →' },
        fabrics: { heading: 'Tessuti e materiali', text: "Tessuti per patchwork, imbottiture, telette, pizzi, nastri, cerniere e fili — i colori e le texture che trasformano un'idea in qualcosa che puoi tenere tra le mani.", more: 'Scopri i tessuti →' },
        setup: { heading: 'Il mio studio per le riprese', text: 'Luce ad anello, softbox, treppiede, fotocamera, portatile e scrivania — tutto per un piccolo angolo accogliente dove filmare i tuoi video di cucito.', more: 'Scopri il mio studio →' },
      },
      sewAlong: {
        eyebrow: 'Novità · cuci con me',
        heading: 'Guarda come prendono forma',
        intro: 'Progetti passo passo con guide animate e le vere misure di taglio — una tote bag foderata e un cestino di stoffa per Natale.',
        more: 'Guarda passo passo →',
      },
      channel: {
        eyebrow: 'Sempre nuovi video',
        heading: 'Cuci con me',
        text: 'Condivido tutorial passo passo sia per chi inizia sia per chi ha già esperienza — patchwork, quilting, art quilt e creazioni di tutti i giorni. Vieni a salutarmi sul canale.',
        button: 'Visita SEWING DIY PATCHWORK',
      },
    },
    tools: {
      title: 'Strumenti — My Sewing Picks',
      description: 'Strumenti per cucito e quilting che consiglio personalmente: macchine da cucire e piedini, taglierine rotanti, tappetini, righelli, forbici, penne per tessuto, ferri da stiro e piccoli aiuti pratici.',
      heading: 'Strumenti',
      intro: "L'attrezzatura fidata che rende preciso ogni progetto — macchine, taglierine, righelli, aiuti per segnare e stirare che consiglio personalmente.",
    },
    fabrics: {
      title: 'Tessuti e materiali — My Sewing Picks',
      description: 'Tessuti e materiali che consiglio personalmente: tessuti per patchwork, imbottiture e telette, pizzi, nastri, cordoncini, cerniere, bottoni e fili per il tuo prossimo progetto.',
      heading: 'Tessuti e materiali',
      intro: 'I colori e le texture che danno vita a un progetto — tessuti, imbottiture, passamanerie e merceria che consiglio personalmente per il patchwork e le creazioni di tutti i giorni.',
    },
    setup: {
      title: 'Il mio studio per le riprese — My Sewing Picks',
      description: 'Luci, treppiede, fotocamera, portatile e scrivania che consiglio personalmente per filmare i tuoi video di cucito e quilting.',
      heading: 'Il mio studio per le riprese',
      intro: 'Stai pensando di filmare i tuoi video di cucito? Ecco le luci, il treppiede, la fotocamera, il portatile e la scrivania che consiglio personalmente per un piccolo angolo accogliente dove fare le riprese.',
    },
    projects: {
      title: 'Progetti da cucire con me — My Sewing Picks',
      description: 'Progetti di cucito passo passo con guide animate, le vere misure di taglio e il video del canale SEWING DIY PATCHWORK.',
      eyebrow: 'Cuci con me',
      heading: 'Progetti',
      intro: 'Scegli un progetto e guardalo prendere forma, passo dopo passo — ogni pezzo con le sue misure reali, ogni cucitura animata, e in più il video e tutto quello che ti serve.',
      more: 'Guarda passo passo →',
    },
    project: {
      eyebrow: 'Cuci con me · progetto',
      videoEyebrow: 'Guarda come si fa',
      videoHeading: 'Il video',
      needsEyebrow: 'Per questo progetto',
      needsHeading: 'Cosa ti serve',
      faqEyebrow: 'Buono a sapersi',
      faqHeading: 'Domande e risposte',
      more: '← Altri progetti da cucire insieme',
    },
    about: {
      title: 'Chi sono — My Sewing Picks',
      description: 'Conosci la creatrice di SEWING DIY PATCHWORK — tutorial di patchwork, quilting e creazioni accoglienti, e in più gli strumenti e i materiali che consiglio personalmente.',
      eyebrow: 'Un caloroso benvenuto',
      heading: 'Questo piccolo angolo del cucito',
      paragraphsHtml: [
        'Sono così contenta che tu sia qui! Questa è la casa di <strong>SEWING DIY PATCHWORK</strong> — il mio canale YouTube dove condivido tutorial per progetti di cucito di ogni tipo, dalle creazioni semplici per principianti a lavori più impegnativi. Parlo di borse e pochette per il trucco, organizer, coperte, vestiti, regali fatti a mano pensati con il cuore e ogni genere di cose utili per la casa.',
        "La mia vera passione, però, è il patchwork — quilting, art quilt, quilt a collage e design tessile. Adoro la lenta magia di trasformare piccoli ritagli di stoffa in qualcosa di completo e bello, e cerco di rendere queste tecniche accessibili, che tu prenda in mano una taglierina rotante per la primissima volta o che cucia già da anni.",
        "Pubblico spesso nuovi video, quindi c'è sempre un progetto nuovo da cucire insieme. E visto che in tanti mi chiedono cosa consiglierei, ho raccolto qui la mia selezione: ogni strumento e materiale su questo sito è qualcosa che <em>consiglio personalmente</em>. Niente su questi scaffali è qui solo per riempire spazio — ogni scelta è fatta con cura pensando a chi ama cucire, come te.",
        "Accomodati, dai un'occhiata in giro: spero che tu trovi qualcosa che ti ispiri per il tuo prossimo progetto. Buon cucito!",
      ],
      signature: '— Con affetto, dal mio angolo del cucito al tuo 🧵',
      button: 'Visita il mio canale YouTube',
    },
    // Privacy & Cookies page. A faithful translation of en.js (a legal disclosure:
    // sentence by sentence, no claim added or dropped). `links` — see en.js.
    privacy: {
      title: 'Privacy e cookie — My Sewing Picks',
      description: 'Come My Sewing Picks usa i cookie e quali informazioni vengono raccolte quando visiti il sito — da Amazon, Cloudflare e YouTube.',
      eyebrow: 'Privacy e cookie',
      heading: 'Privacy e cookie',
      updated: 'Ultimo aggiornamento: 18 ottobre 2026',
      bodyHtml: (links) => `
          <p>
            My Sewing Picks è un piccolo sito di sola lettura. Non ci sono account, iscrizioni,
            commenti, moduli di contatto, newsletter, strumenti di analisi o tracker pubblicitari
            miei; questo sito non imposta cookie propri e non conserva di per sé alcuna
            informazione sui visitatori. L'unica eccezione: se rispondi al suggerimento della lingua
            in fondo allo schermo (o scegli una lingua in cima alla pagina), nella memoria locale
            (local storage) del tuo browser resta una piccola nota per ricordare questa scelta;
            non è un cookie, non viene inviata da nessuna parte e puoi cancellarla dal tuo browser.
            Alcuni servizi esterni aiutano il sito a funzionare, e
            Amazon è coinvolta perché questo è un sito di affiliazione. Questa pagina spiega cosa fanno.
          </p>

          <h2>Amazon: link di affiliazione e immagini dei prodotti</h2>
          <p>
            In qualità di Affiliato Amazon io ricevo un guadagno dagli acquisti idonei. I pulsanti
            «Vedi su Amazon» e le immagini dei prodotti sono link di affiliazione ad Amazon. Quando
            ne clicchi uno, vai sul sito di Amazon, e lì Amazon imposta e legge i propri cookie: è
            così che Amazon sa che la visita è arrivata da questo sito.
          </p>
          <p>
            La maggior parte delle immagini dei prodotti viene mostrata direttamente dai server di
            Amazon (m.media-amazon.com) tramite l'API ufficiale di Amazon, quindi il tuo browser le
            scarica da Amazon, e Amazon può vedere il tuo indirizzo IP, i dati del tuo browser e la
            pagina in cui ti trovi.
          </p>
          <p>
            <strong>Terze parti, inclusa Amazon, possono fornire contenuti su questo sito, raccogliere
            informazioni direttamente dai visitatori e installare o riconoscere cookie sui browser
            dei visitatori.</strong>
          </p>
          <p>
            Amazon mi fornisce solo resoconti riepilogativi — ad esempio quanti clic hanno ricevuto
            i link e quali articoli sono stati ordinati — mai il tuo nome, il tuo indirizzo o
            qualsiasi altra cosa che dica chi sei. Come Amazon usa le tue informazioni è descritto
            nell'<a href="${links.amazonPrivacy}" target="_blank" rel="noopener">Informativa sulla privacy di Amazon.com</a>
            e nella sua <a href="${links.amazonAds}" target="_blank" rel="noopener">Informativa sulla pubblicità basata sugli interessi</a>;
            in un altro negozio Amazon si applica l'informativa sulla privacy di quel negozio.
          </p>

          <h2>Cloudflare: sicurezza e caricamento veloce</h2>
          <p>
            Il sito viene distribuito tramite Cloudflare, che lo protegge da attacchi e bot e lo
            rende più veloce. Per farlo, Cloudflare elabora dati tecnici come il tuo indirizzo IP e
            i dati del tuo browser, può eseguire un breve script di rilevamento dei bot e può
            impostare cookie di sicurezza — ad esempio <code>__cf_bm</code> (scade dopo 30 minuti
            di inattività) e, se ti viene chiesto di confermare di essere una persona,
            <code>cf_clearance</code>. Cloudflare descrive questi cookie come strettamente
            necessari; vedi
            <a href="${links.cloudflareCookies}" target="_blank" rel="noopener">l'informativa sui cookie di Cloudflare</a>.
          </p>

          <h2>Video di YouTube</h2>
          <p>
            Le pagine dei progetti includono un video del mio canale YouTube. Finché non avvii il
            video, viene mostrata solo la sua immagine di anteprima, che proviene da questo stesso
            sito: YouTube non viene contattato. Quando avvii il video, il player si carica
            da YouTube in modalità di privacy avanzata (youtube-nocookie.com), e da quel momento
            YouTube (Google) può usare cookie e tecnologie simili come descritto nelle
            <a href="${links.googlePrivacy}" target="_blank" rel="noopener">Norme sulla privacy di Google</a>.
          </p>

          <h2>Font</h2>
          <p>
            I font del sito vengono caricati da questo stesso sito. Per ottenerli il tuo browser non
            contatta né Google né altri servizi di font.
          </p>

          <h2>Log del server</h2>
          <p>
            Come quasi ogni sito web, il mio provider di hosting e Cloudflare registrano automaticamente
            informazioni tecniche di base su ogni richiesta: indirizzo IP, tipo di browser, pagina
            richiesta, pagina di provenienza e ora. Servono a far funzionare il sito, a mantenerlo
            sicuro e a risolvere i problemi. Non le uso per identificarti né per creare profili, e
            non vendo né condivido informazioni personali.
          </p>

          <h2>Le tue scelte</h2>
          <ul>
            <li>
              Puoi bloccare o eliminare i cookie nelle impostazioni del browser. Il sito funziona
              anche senza, sebbene il controllo di sicurezza di Cloudflare possa chiederti di
              nuovo di confermare di essere una persona.
            </li>
            <li>
              Per gestire la pubblicità basata sugli interessi di Amazon, usa le
              <a href="${links.amazonAdPrefs}" target="_blank" rel="noopener">Preferenze pubblicitarie di Amazon</a>.
              Per la pubblicità basata sugli interessi di altre aziende, vedi
              <a href="${links.aboutAds}" target="_blank" rel="noopener">aboutads.info</a> (USA),
              <a href="${links.yourAdChoicesCa}" target="_blank" rel="noopener">youradchoices.ca</a> (Canada) o
              <a href="${links.yourOnlineChoicesEu}" target="_blank" rel="noopener">youronlinechoices.eu</a> (Europa).
            </li>
          </ul>

          <h2>Modifiche e domande</h2>
          <p>
            Se il sito inizierà a usare qualcosa di nuovo, aggiornerò questa pagina e la data qui
            sopra. Domande? Puoi contattarmi tramite il mio
            <a href="${links.youtube}" target="_blank" rel="noopener">canale YouTube</a>.
          </p>
      `,
    },
  },
};

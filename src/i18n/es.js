/* Spanish texts of the site — interface + pages. Same keys as en.js (a missing or
   extra key fails the build). Values are plain text (Astro escapes them) unless
   the key ends in "Html". Function values keep their parameters ((title) =>, (links) =>).
   Rules: neutral Spanish (Spain + Latin America), «tú» — never «vosotros» or «vos»;
   the author is a woman (first person, feminine agreement); centimetres only,
   decimal comma («0,5 cm»); brands in Latin; «recomiendo personalmente» — never
   «uso / tengo». Amazon phrases (disclosure, content notice) — official translations,
   word for word. */
export default {
  brand: 'My Sewing Picks',
  ui: {
    nav: { home: 'Inicio', tools: 'Herramientas', fabrics: 'Telas', projects: 'Proyectos', setup: 'Mi estudio', about: 'Sobre mí' },
    homeLabel: 'inicio',
    logo: '(logotipo)',
    toggleMenu: 'Abrir o cerrar el menú',
    primaryNav: 'Menú principal',
    language: 'Idioma',
    viewOnAmazon: 'Ver en Amazon',
    paidLink: '(enlace pagado)',
    jumpToSection: 'Ir a la sección',
    playVideo: (title) => `Reproducir el video: ${title}`,
    watchOnYouTube: 'Ver en YouTube',
    socialLinks: 'Redes sociales',
    ogImageAlt: 'My Sewing Picks — herramientas y telas de costura seleccionadas con cuidado',
    pageDisclosure: 'Los siguientes enlaces son enlaces de afiliado. En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.',
    pageDisclosureSome: 'Algunos enlaces de esta página son enlaces de afiliado. En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.',
    disclosure: 'En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.',
    amazonContentNotice:
      'Parte del contenido que aparece en este sitio procede de Amazon. Este contenido se ofrece en su condición actual y podrá modificarse o eliminarse en cualquier momento.',
    privacy: 'Privacidad y cookies',
  },
  pages: {
    home: {
      title: 'My Sewing Picks — herramientas y telas que recomiendo',
      description: 'Un rincón acogedor con herramientas y telas de costura y patchwork seleccionadas con cuidado por la creadora del canal de YouTube SEWING DIY PATCHWORK.',
      eyebrow: 'Hecho a mano con amor',
      tagline: 'Herramientas y telas seleccionadas con cuidado para tu rincón de costura.',
      blurbHtml:
        '¡Te doy la bienvenida! Soy la creadora de <strong>SEWING DIY PATCHWORK</strong>, donde coso bolsas, quilts, ropa y cosas acogedoras para el hogar. Todo lo que encontrarás aquí es algo que recomiendo personalmente, y lo he reunido en un solo lugar para que tú también encuentres tu próximo favorito.',
      browse: 'Descubre mi selección',
      shelves: {
        eyebrow: 'Tres pequeñas colecciones',
        heading: 'Encuentra lo que necesitas',
        intro: 'Todo está ordenado en tres sencillos estantes: las herramientas que hacen más fácil la costura, las telas y materiales que dan vida a un proyecto, y el equipo para grabar tus propias creaciones.',
      },
      cards: {
        tools: { heading: 'Herramientas', text: 'Máquinas de coser, prensatelas, cortadores rotativos, reglas, tijeras, planchas y marcadores para tela: los aliados de confianza que hacen que cada proyecto quede limpio y preciso.', more: 'Explora las herramientas →' },
        fabrics: { heading: 'Telas y materiales', text: 'Telas para patchwork, guata, entretela, encaje, cintas, cremalleras e hilos: los colores y texturas que convierten una idea en algo que puedes tener entre las manos.', more: 'Explora las telas →' },
        setup: { heading: 'Mi estudio de grabación', text: 'Aro de luz, softbox, trípode, cámara, laptop y escritorio: todo para crear un pequeño rincón acogedor donde grabar tus propios videos de costura.', more: 'Explora mi estudio →' },
      },
      sewAlong: {
        eyebrow: 'Novedad · cose conmigo',
        heading: 'Mira cómo toma forma',
        intro: 'Proyectos paso a paso con guías animadas y las medidas de corte reales: una tote bag forrada y una cesta de tela para Navidad.',
        more: 'Míralo paso a paso →',
      },
      channel: {
        eyebrow: 'Videos nuevos a menudo',
        heading: 'Cose conmigo',
        text: 'Comparto tutoriales paso a paso tanto para principiantes como para costureras con experiencia: patchwork, acolchado, art quilts y proyectos para el día a día. Ven a saludarme en el canal.',
        button: 'Visita SEWING DIY PATCHWORK',
      },
    },
    tools: {
      title: 'Herramientas — My Sewing Picks',
      description: 'Herramientas de costura y patchwork que recomiendo personalmente: máquinas de coser y prensatelas, cortadores rotativos, bases de corte, reglas, tijeras, marcadores, planchas y accesorios prácticos.',
      heading: 'Herramientas',
      intro: 'Los aliados de confianza que hacen que cada proyecto quede preciso: máquinas, cortadores, reglas y accesorios para marcar y planchar que recomiendo personalmente.',
    },
    fabrics: {
      title: 'Telas y materiales — My Sewing Picks',
      description: 'Telas y materiales que recomiendo personalmente: telas para patchwork, guata y entretela, encaje, cintas, cordones, cremalleras, botones e hilos para tu próximo proyecto.',
      heading: 'Telas y materiales',
      intro: 'Los colores y texturas que dan vida a un proyecto: telas, guata, pasamanería y mercería que recomiendo personalmente para patchwork y proyectos del día a día.',
    },
    setup: {
      title: 'Mi estudio de grabación — My Sewing Picks',
      description: 'Luces, trípode, cámara, laptop y escritorio que recomiendo personalmente para grabar tus propios videos de costura y patchwork.',
      heading: 'Mi estudio de grabación',
      intro: '¿Estás pensando en grabar tus propios videos de costura? Aquí tienes las luces, el trípode, la cámara, la laptop y el escritorio que recomiendo personalmente para montar un pequeño rincón de grabación acogedor.',
    },
    projects: {
      title: 'Proyectos para coser conmigo — My Sewing Picks',
      description: 'Proyectos de costura paso a paso con guías animadas, medidas de corte reales y el video del canal SEWING DIY PATCHWORK.',
      eyebrow: 'Cose conmigo',
      heading: 'Proyectos',
      intro: 'Elige un proyecto y mira cómo toma forma, paso a paso: cada pieza con sus medidas reales, cada costura animada, además del video y todo lo que necesitarás.',
      more: 'Míralo paso a paso →',
    },
    project: {
      eyebrow: 'Cose conmigo · proyecto',
      videoEyebrow: 'Mira cómo se hace',
      videoHeading: 'El video',
      needsEyebrow: 'Para este proyecto',
      needsHeading: 'Lo que necesitarás',
      faqEyebrow: 'Conviene saber',
      faqHeading: 'Preguntas y respuestas',
      more: '← Más proyectos para coser conmigo',
    },
    about: {
      title: 'Sobre mí — My Sewing Picks',
      description: 'Conoce a la creadora detrás de SEWING DIY PATCHWORK: tutoriales de patchwork, acolchado y proyectos acogedores, además de las herramientas y materiales que recomiendo personalmente.',
      eyebrow: 'Hola, te doy la bienvenida',
      heading: 'Sobre este pequeño rincón de costura',
      paragraphsHtml: [
        '¡Estoy encantada de que estés aquí! Este es el hogar de <strong>SEWING DIY PATCHWORK</strong>, mi canal de YouTube, donde comparto tutoriales de costura de todo tipo, desde proyectos sencillos para principiantes hasta otros más elaborados. Hablo de bolsas y estuches para cosméticos, organizadores, mantas, ropa, regalos hechos a mano con cariño y todo tipo de cosas útiles para el hogar.',
        'Pero mi verdadera pasión es el patchwork: el acolchado, los art quilts, los quilts collage y el diseño textil. Me encanta la magia pausada de convertir pequeños retazos de tela en algo completo y bonito, y procuro que estas técnicas resulten accesibles, tanto si tomas un cortador rotativo por primera vez como si llevas años cosiendo.',
        'Publico videos nuevos a menudo, así que siempre hay un proyecto nuevo para coser conmigo. Y como tanta gente me pregunta qué recomendaría, he reunido aquí mi selección: cada herramienta y cada material de este sitio es algo que <em>recomiendo personalmente</em>. Nada en estos estantes está solo para rellenar espacio: cada elección está hecha con cariño para costureras como tú.',
        'Acerca una silla, echa un vistazo y espero que encuentres algo que inspire tu próximo proyecto. ¡Feliz costura!',
      ],
      signature: '— Con cariño, de mi rincón de costura al tuyo 🧵',
      button: 'Visita mi canal de YouTube',
    },
    // Privacy & Cookies page. A faithful translation of en.js (a legal disclosure:
    // sentence by sentence, no claim added or dropped). `links` — see en.js.
    privacy: {
      title: 'Privacidad y cookies — My Sewing Picks',
      description: 'Cómo usa My Sewing Picks las cookies y qué información se recopila cuando visitas el sitio: por parte de Amazon, Cloudflare y YouTube.',
      eyebrow: 'Privacidad y cookies',
      heading: 'Privacidad y cookies',
      updated: 'Última actualización: 15 de octubre de 2026',
      bodyHtml: (links) => `
          <p>
            My Sewing Picks es un pequeño sitio web de solo lectura. No hay cuentas, registros,
            comentarios, formularios de contacto ni boletines, ni analítica ni rastreadores
            publicitarios propios; este sitio no instala cookies propias y no almacena por sí mismo ninguna
            información sobre los visitantes. Algunos servicios externos ayudan a que el sitio
            funcione, y Amazon interviene porque este es un sitio de afiliados. Esta página explica
            qué hacen.
          </p>

          <h2>Amazon: enlaces de afiliado e imágenes de productos</h2>
          <p>
            En calidad de Afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen
            los requisitos aplicables. Los botones «Ver en Amazon» y las imágenes de los productos son
            enlaces de afiliado a Amazon. Cuando haces clic en uno, vas al sitio web de Amazon, y allí
            Amazon coloca y lee sus propias cookies: así es como Amazon sabe que la visita llegó desde
            este sitio.
          </p>
          <p>
            La mayoría de las imágenes de productos se muestran directamente desde los servidores de
            Amazon (m.media-amazon.com) a través de la API oficial de Amazon, por lo que tu navegador
            las descarga de Amazon, y Amazon puede ver tu dirección IP, los datos de tu navegador y la
            página en la que estás.
          </p>
          <p>
            <strong>Terceros, incluido Amazon, pueden proporcionar contenido en este sitio, recopilar
            información directamente de los visitantes y colocar o reconocer cookies en los
            navegadores de los visitantes.</strong>
          </p>
          <p>
            Amazon solo me envía informes resumidos (por ejemplo, cuántos clics recibieron los enlaces
            y qué artículos se pidieron), nunca tu nombre, tu dirección ni nada más que indique quién
            eres. Cómo usa Amazon tu información se describe en el
            <a href="${links.amazonPrivacy}" target="_blank" rel="noopener">Aviso de privacidad de Amazon.com</a>
            y en su <a href="${links.amazonAds}" target="_blank" rel="noopener">aviso sobre anuncios basados en intereses</a>;
            en otra tienda de Amazon, se aplica el aviso de privacidad de esa tienda.
          </p>

          <h2>Cloudflare: seguridad y entrega rápida</h2>
          <p>
            El sitio se entrega a través de Cloudflare, que lo protege de ataques y bots y lo hace más
            rápido. Para ello, Cloudflare procesa datos técnicos como tu dirección IP y los datos de tu
            navegador, puede ejecutar un breve script de detección de bots y puede instalar cookies de
            seguridad; por ejemplo, <code>__cf_bm</code> (expira tras 30 minutos de inactividad) y, si
            se te pide verificar que eres una persona, <code>cf_clearance</code>. Cloudflare describe
            estas cookies como estrictamente necesarias; consulta la
            <a href="${links.cloudflareCookies}" target="_blank" rel="noopener">política de cookies de Cloudflare</a>.
          </p>

          <h2>Videos de YouTube</h2>
          <p>
            Las páginas de proyectos incluyen un video de mi canal de YouTube. Mientras no inicies la
            reproducción, solo se muestra la imagen de vista previa del video, que procede del propio
            sitio: no se establece ninguna conexión con YouTube. Cuando inicias la reproducción, el
            reproductor se carga desde YouTube en su modo de privacidad mejorado (youtube-nocookie.com), y a partir de
            ese momento YouTube (Google) puede usar cookies y tecnologías similares, tal como se
            describe en la
            <a href="${links.googlePrivacy}" target="_blank" rel="noopener">Política de privacidad de Google</a>.
          </p>

          <h2>Fuentes</h2>
          <p>
            Las fuentes del sitio se cargan desde este mismo sitio. Para obtenerlas, tu navegador no
            se conecta a Google ni a ningún otro servicio de fuentes.
          </p>

          <h2>Registros del servidor</h2>
          <p>
            Como casi cualquier sitio web, mi proveedor de alojamiento y Cloudflare registran
            automáticamente información técnica básica sobre cada solicitud: la dirección IP, el tipo
            de navegador, la página solicitada, la página desde la que llegaste y la hora. Se utiliza
            para entregar el sitio, mantenerlo seguro y solucionar problemas. No la uso para
            identificarte ni para crear perfiles, y no vendo ni comparto información personal.
          </p>

          <h2>Tus opciones</h2>
          <ul>
            <li>
              Puedes bloquear o eliminar las cookies en la configuración de tu navegador. Este sitio
              funciona sin ellas, aunque es posible que la comprobación de seguridad de Cloudflare te
              pida de nuevo que verifiques que eres una persona.
            </li>
            <li>
              Para controlar los anuncios basados en intereses de Amazon, usa las
              <a href="${links.amazonAdPrefs}" target="_blank" rel="noopener">Preferencias de publicidad de Amazon</a>.
              Para los anuncios basados en intereses de otras empresas, consulta
              <a href="${links.aboutAds}" target="_blank" rel="noopener">aboutads.info</a> (EE. UU.),
              <a href="${links.yourAdChoicesCa}" target="_blank" rel="noopener">youradchoices.ca</a> (Canadá) o
              <a href="${links.yourOnlineChoicesEu}" target="_blank" rel="noopener">youronlinechoices.eu</a> (Europa).
            </li>
          </ul>

          <h2>Cambios y preguntas</h2>
          <p>
            Si el sitio empieza a usar algo nuevo, actualizaré esta página y la fecha de arriba.
            ¿Tienes preguntas? Puedes ponerte en contacto conmigo a través de mi
            <a href="${links.youtube}" target="_blank" rel="noopener">canal de YouTube</a>.
          </p>
      `,
    },
  },
};

/* English texts of the site — interface + pages. Every other language has the
   same keys (src/i18n/<lang>.js); a missing or extra key fails the build.
   Values are plain text (Astro escapes them) unless the key ends in "Html". */
export default {
  brand: 'My Sewing Picks',
  ui: {
    nav: { home: 'Home', tools: 'Tools', fabrics: 'Fabrics', projects: 'Projects', setup: 'My Setup', about: 'About' },
    homeLabel: 'home',
    logo: 'logo',
    toggleMenu: 'Toggle menu',
    primaryNav: 'Primary',
    language: 'Language',
    viewOnAmazon: 'View on Amazon',
    paidLink: '(paid link)',
    jumpToSection: 'Jump to section',
    playVideo: (title) => `Play video: ${title}`,
    watchOnYouTube: 'Watch on YouTube',
    socialLinks: 'Social links',
    ogImageAlt: 'My Sewing Picks — hand-picked sewing tools and fabrics',
    pageDisclosure: 'The links below are affiliate links. As an Amazon Associate I earn from qualifying purchases.',
    pageDisclosureSome: 'Some links on this page are affiliate links. As an Amazon Associate I earn from qualifying purchases.',
    disclosure: 'As an Amazon Associate I earn from qualifying purchases.',
    amazonContentNotice:
      'Certain content that appears on this site comes from Amazon. This content is provided "as is" and is subject to change or removal at any time.',
    privacy: 'Privacy & Cookies',
  },
  pages: {
    home: {
      title: 'My Sewing Picks — Tools & Fabrics I Recommend',
      description: 'A cozy corner of hand-picked sewing and quilting tools and fabrics, chosen by the maker behind the SEWING DIY PATCHWORK YouTube channel.',
      eyebrow: 'Handmade with love',
      tagline: 'Hand-picked tools & fabrics for your sewing corner.',
      blurbHtml:
        "Welcome in! I'm the maker behind <strong>SEWING DIY PATCHWORK</strong>, where I sew bags, quilts, clothes, and cozy things for the home. Everything you'll find here is something I personally recommend — gathered in one place so you can find your next favorite, too.",
      browse: 'Browse my picks',
      shelves: {
        eyebrow: 'Three little collections',
        heading: 'Find what you need',
        intro: 'Everything is sorted into three simple shelves — the tools that make sewing easier, the fabrics & materials that bring a project to life, and the gear for filming your own makes.',
      },
      cards: {
        tools: { heading: 'Tools', text: 'Sewing machines, presser feet, rotary cutters, rulers, scissors, irons and marking pens — the trusty gear that keeps every project tidy and precise.', more: 'Explore tools →' },
        fabrics: { heading: 'Fabrics & Materials', text: 'Quilting fabrics, batting, interfacing, lace, tapes, zippers and thread — the colors and textures that turn an idea into something you can hold.', more: 'Explore fabrics →' },
        setup: { heading: 'My Filming Setup', text: 'Ring light, softboxes, tripod, camera, laptop and desk — everything for a cozy little corner to film your own sewing videos.', more: 'Explore my setup →' },
      },
      sewAlong: {
        eyebrow: 'New · sew along',
        heading: 'Watch a bag come together',
        intro: 'Step-by-step projects with animated guides and the real cutting sizes — starting with my 10-minute lined tote.',
        more: 'See it step by step →',
      },
      channel: {
        eyebrow: 'New videos often',
        heading: 'Sew along with me',
        text: 'I share step-by-step tutorials for beginners and advanced sewers alike — patchwork, quilting, art quilts and everyday makes. Come say hello on the channel.',
        button: 'Visit SEWING DIY PATCHWORK',
      },
    },
    tools: {
      title: 'Tools — My Sewing Picks',
      description: 'Sewing and quilting tools I personally recommend: sewing machines and presser feet, rotary cutters, mats, rulers, scissors, marking pens, irons and handy helpers.',
      heading: 'Tools',
      intro: 'The trusty gear that keeps every project precise — machines, cutters, rulers, marking and pressing helpers I personally recommend.',
    },
    fabrics: {
      title: 'Fabrics & Materials — My Sewing Picks',
      description: 'Fabrics and materials I personally recommend: quilting fabrics, batting and interfacing, lace, tapes, cords, zippers, buttons and thread for your next project.',
      heading: 'Fabrics & Materials',
      intro: 'The colors and textures that bring a project to life — fabrics, batting, trims and notions I personally recommend for patchwork and everyday makes.',
    },
    setup: {
      title: 'My Filming Setup — My Sewing Picks',
      description: 'Lights, tripod, camera, laptop and desk I personally recommend for filming your own sewing and quilting videos.',
      heading: 'My Filming Setup',
      intro: 'Thinking about filming your own sewing videos? Here are the lights, tripod, camera, laptop and desk I personally recommend for a cozy little filming corner.',
    },
    projects: {
      title: 'Sew-Along Projects — My Sewing Picks',
      description: 'Step-by-step sewing projects with animated guides, real cutting sizes and the video from the SEWING DIY PATCHWORK channel.',
      eyebrow: 'Sew along',
      heading: 'Projects',
      intro: "Pick a project and watch it come together, step by step — every piece with its real size, every seam animated, plus the video and what you'll need.",
      more: 'See it step by step →',
    },
    project: {
      eyebrow: 'Sew along · project',
      videoEyebrow: 'Watch it made',
      videoHeading: 'The video',
      needsEyebrow: 'For this project',
      needsHeading: "What you'll need",
      more: '← More sew-along projects',
    },
    about: {
      title: 'About — My Sewing Picks',
      description: 'Meet the maker behind SEWING DIY PATCHWORK — tutorials on patchwork, quilting and cozy makes, plus the tools and materials I personally recommend.',
      eyebrow: 'Hello & welcome',
      heading: 'About this little sewing corner',
      paragraphsHtml: [
        "I'm so glad you're here! This is the home of <strong>SEWING DIY PATCHWORK</strong> — my YouTube channel where I share tutorials for sewing projects of every kind, from simple beginner makes to more involved builds. Think bags and cosmetic pouches, organizers, blankets, clothes, thoughtful handmade gifts, and all sorts of useful things for around the home.",
        "My real passion, though, is patchwork — quilting, art quilts, collage quilts and textile design. I love the slow magic of turning small scraps of fabric into something whole and beautiful, and I try to make those techniques approachable whether you're picking up a rotary cutter for the very first time or you've been sewing for years.",
        "I post new videos often, so there's always a fresh project to sew along with. And because so many of you ask what I'd recommend, I gathered my picks here: every tool and material on this site is something I <em>personally recommend</em>. Nothing on these shelves is here just to fill space — each pick is chosen with care for sewers like you.",
        'Pull up a chair, browse around, and I hope you find something that sparks your next project. Happy sewing!',
      ],
      signature: '— With love, from my sewing corner to yours 🧵',
      button: 'Visit my YouTube channel',
    },
    // Privacy & Cookies page. `bodyHtml(links)` returns everything after the "Last updated"
    // line; `links` (the URLs) comes from src/pages/[...lang]/privacy.astro, so the
    // addresses live in ONE place for every language.
    privacy: {
      title: 'Privacy & Cookies — My Sewing Picks',
      description: 'How My Sewing Picks uses cookies and what information is collected when you visit — by Amazon, Cloudflare, YouTube and Google Fonts.',
      eyebrow: 'Privacy & cookies',
      heading: 'Privacy & Cookies',
      updated: 'Last updated: October 15, 2026',
      bodyHtml: (links) => `
          <p>
            My Sewing Picks is a small read-only website. There are no accounts, sign-ups,
            comments, contact forms, newsletters, analytics or advertising trackers of my own,
            this site does not set any cookies of its own, and it does not store any
            information about visitors itself. A few outside services help the site work, and
            Amazon is involved because this is an affiliate site. This page explains what they do.
          </p>

          <h2>Amazon: affiliate links and product images</h2>
          <p>
            As an Amazon Associate I earn from qualifying purchases. The “View on Amazon” buttons
            and product images are affiliate links to Amazon. When you click one, you go to
            Amazon’s website, and Amazon places and reads its own cookies there — that is how
            Amazon knows the visit came from this site.
          </p>
          <p>
            Most product images are shown directly from Amazon’s servers (m.media-amazon.com)
            through Amazon’s official API, so your browser downloads them from Amazon, and Amazon
            can see your IP address, browser details and the page you are on.
          </p>
          <p>
            <strong>Third parties, including Amazon, may provide content on this site, collect
            information directly from visitors, and place or recognize cookies on visitors’
            browsers.</strong>
          </p>
          <p>
            Amazon only gives me summary reports — such as how many clicks the links got and
            which items were ordered — never your name, address or anything else that says who
            you are. How Amazon uses your information is described in the
            <a href="${links.amazonPrivacy}" target="_blank" rel="noopener">Amazon.com Privacy Notice</a>
            and its <a href="${links.amazonAds}" target="_blank" rel="noopener">Interest-Based Ads notice</a>;
            on another Amazon store, that store’s privacy notice applies.
          </p>

          <h2>Cloudflare: security and fast delivery</h2>
          <p>
            The site is delivered through Cloudflare, which protects it from attacks and bots and
            speeds it up. To do this, Cloudflare processes technical data such as your IP address
            and browser details, may run a short bot-detection script, and may set security
            cookies — for example <code>__cf_bm</code> (expires after 30 minutes of inactivity) and,
            if you are asked to verify you are human, <code>cf_clearance</code>. Cloudflare describes
            these cookies as strictly necessary; see
            <a href="${links.cloudflareCookies}" target="_blank" rel="noopener">Cloudflare’s cookie policy</a>.
          </p>

          <h2>YouTube videos</h2>
          <p>
            Project pages include a video from my YouTube channel. Until you press play, only the
            video’s preview picture is shown; it is loaded from YouTube’s image server
            (i.ytimg.com), which sees your IP address. When you press play, the player loads
            from YouTube in its privacy-enhanced mode (youtube-nocookie.com), and from then on
            YouTube (Google) may use cookies and similar technologies as described in the
            <a href="${links.googlePrivacy}" target="_blank" rel="noopener">Google Privacy Policy</a>.
          </p>

          <h2>Fonts</h2>
          <p>
            The site’s fonts come from Google Fonts. Depending on the setup, they are delivered
            either by Cloudflare from this site’s own address or directly from Google’s servers;
            in the second case Google receives your IP address and browser details.
          </p>

          <h2>Server logs</h2>
          <p>
            Like nearly every website, my web host and Cloudflare automatically record basic
            technical information about each request — IP address, browser type, the page
            requested, the page you came from and the time. It is used to deliver the site, keep
            it secure and fix problems. I don’t use it to identify you or build profiles, and I
            don’t sell or share personal information.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>
              You can block or delete cookies in your browser settings. This site works without
              them, though Cloudflare’s security check may ask you to verify you are human again.
            </li>
            <li>
              To control interest-based ads from Amazon, use
              <a href="${links.amazonAdPrefs}" target="_blank" rel="noopener">Amazon’s Advertising Preferences</a>.
              For other companies’ interest-based ads, see
              <a href="https://optout.aboutads.info/" target="_blank" rel="noopener">aboutads.info</a> (US),
              <a href="https://youradchoices.ca/" target="_blank" rel="noopener">youradchoices.ca</a> (Canada) or
              <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener">youronlinechoices.eu</a> (Europe).
            </li>
          </ul>

          <h2>Changes and questions</h2>
          <p>
            If the site starts using something new, I will update this page and the date above.
            Questions? Reach me through my
            <a href="${links.youtube}" target="_blank" rel="noopener">YouTube channel</a>.
          </p>
      `,
    },
  },
};

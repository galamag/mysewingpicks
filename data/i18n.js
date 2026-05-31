/* =====================================================================
   I18N DICTIONARY  —  My Sewing Picks
   ---------------------------------------------------------------------
   ONE place for every user-facing UI string on the site.

   STATUS: only 'en' is active. The site is English-only for now.
           The other language codes are PLANNED, not implemented — do not
           add half-translated dictionaries until you're ready to ship them.

   Planned language codes (ISO 639-1):
     en  English   ← ACTIVE
     de  German        (planned)
     fr  French        (planned)
     es  Spanish       (planned)
     it  Italian       (planned)
     tr  Turkish       (planned)
     ja  Japanese      (planned)
     pl  Polish        (planned)
     nl  Dutch         (planned)
     ar  Arabic        (planned, right-to-left)

   HOW IT'S USED:
     - js/site.js picks the active language (ACTIVE_LANG, currently 'en')
       and exposes a t('key') helper.
     - Plain text elements in the HTML carry  data-i18n="key".
     - Rich text (with <strong>/<em>) elements carry  data-i18n-html="key".
       js/site.js fills both from this dictionary on page load.
     - The header/footer (built in JS) call t('key') directly.

   ADDING A LANGUAGE LATER:
     1. Copy the entire `en` block to a new code, e.g. `de`.
     2. Translate every value (keep the keys identical).
     3. Wire up the language dropdown placeholder in the header
        (see js/site.js → renderHeader) and set ACTIVE_LANG from the
        user's choice. Nothing else needs to change.

   NOTE: product names and descriptions are intentionally NOT here — they
   live with the product data in data/products.js. Translating product
   copy is a separate future step.
   ===================================================================== */

const I18N = {
  en: {
    /* ---- Brand ---- */
    brand_name: "My Sewing Picks",

    /* ---- Navigation ---- */
    nav_home: "Home",
    nav_tools: "Tools",
    nav_fabrics: "Fabrics",
    nav_about: "About",

    /* ---- Shared buttons ---- */
    btn_view_on_amazon: "View on Amazon",
    btn_browse_picks: "Browse my picks",
    btn_watch_youtube: "Watch on YouTube",
    btn_visit_channel: "Visit SEWING DIY PATCHWORK",
    btn_visit_youtube: "Visit my YouTube channel",

    /* ---- Home: hero ---- */
    hero_eyebrow: "Handmade with love",
    hero_title: "My Sewing Picks",
    hero_tagline: "The tools & fabrics from my own sewing corner.",
    hero_blurb:
      "Welcome in! I'm the maker behind <strong>SEWING DIY PATCHWORK</strong>, where I sew " +
      "bags, quilts, clothes, and cozy things for the home. Everything you'll find here is " +
      "something I genuinely reach for — gathered in one place so you can find your next " +
      "favorite, too.",

    /* ---- Home: category preview ---- */
    home_cat_eyebrow: "Two little collections",
    home_cat_title: "Find what you need",
    home_cat_subtitle:
      "Everything is sorted into two simple shelves — the tools that make sewing easier, " +
      "and the fabrics & materials I love to work with.",
    home_cat_tools_title: "Tools",
    home_cat_tools_desc:
      "Rotary cutters, mats, rulers, presser feet, irons and marking pens — the trusty gear " +
      "that keeps every project tidy and precise.",
    home_cat_tools_more: "Explore tools →",
    home_cat_fabrics_title: "Fabrics & Materials",
    home_cat_fabrics_desc:
      "Quilting fabric bundles, lace ribbon and pretty trims — the colors and textures that " +
      "turn an idea into something you can hold.",
    home_cat_fabrics_more: "Explore fabrics →",

    /* ---- Home: YouTube call-out ---- */
    home_yt_eyebrow: "New videos often",
    home_yt_title: "Sew along with me",
    home_yt_desc:
      "I share step-by-step tutorials for beginners and advanced sewers alike — patchwork, " +
      "quilting, art quilts and everyday makes. Come say hello on the channel.",

    /* ---- Tools page ---- */
    tools_eyebrow: "My Sewing Picks",
    tools_title: "Tools",
    tools_subtitle:
      "The trusty gear that keeps every project precise — these are the cutters, mats, rulers " +
      "and pressing helpers I reach for again and again.",

    /* ---- Fabrics page ---- */
    fabrics_eyebrow: "My Sewing Picks",
    fabrics_title: "Fabrics & Materials",
    fabrics_subtitle:
      "The colors and textures that bring a project to life — fabric bundles, lace and trims " +
      "I love to gather for patchwork and everyday makes.",

    /* ---- About page ---- */
    about_eyebrow: "Hello & welcome",
    about_title: "About this little sewing corner",
    about_p1:
      "I'm so glad you're here! This is the home of <strong>SEWING DIY PATCHWORK</strong> — " +
      "my YouTube channel where I share tutorials for sewing projects of every kind, from " +
      "simple beginner makes to more involved builds. Think bags and cosmetic pouches, " +
      "organizers, blankets, clothes, thoughtful handmade gifts, and all sorts of useful " +
      "things for around the home.",
    about_p2:
      "My real passion, though, is patchwork — quilting, art quilts, collage quilts and " +
      "textile design. I love the slow magic of turning small scraps of fabric into " +
      "something whole and beautiful, and I try to make those techniques approachable " +
      "whether you're picking up a rotary cutter for the very first time or you've been " +
      "sewing for years.",
    about_p3:
      "I post new videos often, so there's always a fresh project to sew along with. And " +
      "because so many of you ask what I'm using, I gathered it all here: every tool and " +
      "material on this site is something I <em>personally use and genuinely love</em>. " +
      "Nothing on these shelves is here just to fill space — it's the real gear from my " +
      "own sewing table.",
    about_p4:
      "Pull up a chair, browse around, and I hope you find something that sparks your next " +
      "project. Happy sewing!",
    about_signature: "— With love, from my sewing corner to yours 🧵",

    /* ---- Footer ---- */
    footer_disclosure: "As an Amazon Associate I earn from qualifying purchases.",
  },

  /* ---------------------------------------------------------------------
     PLANNED LANGUAGES — intentionally left empty until ready.
     Copy the `en` block above into each when you translate.
     --------------------------------------------------------------------- */
  // de: { ... },  // German
  // fr: { ... },  // French
  // es: { ... },  // Spanish
  // it: { ... },  // Italian
  // tr: { ... },  // Turkish
  // ja: { ... },  // Japanese
  // pl: { ... },  // Polish
  // nl: { ... },  // Dutch
  // ar: { ... },  // Arabic (remember: dir="rtl")
};

/* Expose globally for js/site.js (no modules/build step). */
window.I18N = I18N;

/* =====================================================================
   SITE LOGIC  —  My Sewing Picks
   ---------------------------------------------------------------------
   This single file:
     1) holds shared site CONFIG (links, nav, socials)
     2) holds the two future-proofing seams: ACTIVE_LANG and
        ACTIVE_MARKETPLACE (both pinned to today's behavior)
     3) builds the shared HEADER and FOOTER (so they live in ONE place)
     4) fills static page text from the i18n dictionary (data-i18n attrs)
     5) renders product cards from /data/products.js
     6) wires it all up on page load

   No frameworks, no build step. Just open the .html files in a browser.

   TEXT comes from /data/i18n.js (keyed by language).
   PRODUCT links come from /data/products.js (keyed by marketplace).
   Right now the site is English-only and US-Amazon-only — see the two
   constants in section 0.
   ===================================================================== */

/* ---------------------------------------------------------------------
   0) FUTURE-PROOFING SEAMS — the two "one-line change" switches.
   ---------------------------------------------------------------------
   These are deliberately constants for now. Internationalization and
   multi-marketplace routing are NOT implemented yet; this is only the
   foundation. When the time comes:

     ACTIVE_LANG         which i18n dictionary to read (see data/i18n.js).
                         Later: set from a language dropdown / saved choice.

     ACTIVE_MARKETPLACE  which Amazon link to use from each product's
                         `links` object (see data/products.js).
                         Later: this is where Amazon OneLink or per-country
                         geo-routing plugs in — detect the visitor's country
                         and choose the matching marketplace link.
   --------------------------------------------------------------------- */
const ACTIVE_LANG = "en";
const ACTIVE_MARKETPLACE = "us";

/* ---------------------------------------------------------------------
   t(key) — look up a UI string in the active language dictionary.
   Falls back to the raw key if a string is missing (makes gaps obvious).
   --------------------------------------------------------------------- */
function t(key) {
  const dict = (window.I18N && window.I18N[ACTIVE_LANG]) || {};
  return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
}

/* ---------------------------------------------------------------------
   1) SITE CONFIG — brand-wide, non-text settings live here.
      (User-facing TEXT lives in data/i18n.js, not here.)
   --------------------------------------------------------------------- */
const SITE = {
  // Path to your logo. Drop the real file at assets/logo.png.
  // If it's missing, the header automatically falls back to a text wordmark.
  logo: "assets/logo.png",
  youtubeUrl: "https://www.youtube.com/channel/UCbsWzrIcuaQQSdWRqh3FTmg",

  // Top navigation. `key` points at a label in the i18n dictionary.
  // Add/remove pages here and every page updates.
  nav: [
    { key: "nav_home", href: "index.html" },
    { key: "nav_tools", href: "tools.html" },
    { key: "nav_fabrics", href: "fabrics.html" },
    { key: "nav_about", href: "about.html" },
  ],

  // Footer social buttons. To add more later (Instagram, Pinterest...),
  // just push another object with a label, url, and an `icon` SVG string.
  socials: [
    {
      label: "YouTube",
      url: "https://www.youtube.com/channel/UCbsWzrIcuaQQSdWRqh3FTmg",
      icon:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>',
    },
    // Example for later — copy this shape and fill in your own:
    // { label: "Instagram", url: "https://instagram.com/yourhandle", icon: '<svg ...>...</svg>' },
  ],
};

/* ---------------------------------------------------------------------
   Small helper: escape text so product/site strings can't break the HTML
   we build with template strings.
   --------------------------------------------------------------------- */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ---------------------------------------------------------------------
   2a) HEADER — logo + nav. The current page's link gets an "active" style.
   --------------------------------------------------------------------- */
function renderHeader() {
  const host = document.getElementById("site-header");
  if (!host) return;

  const brandName = t("brand_name");

  // Which page are we on? Used to highlight the active nav link.
  let current = window.location.pathname.split("/").pop();
  if (!current) current = "index.html";

  // Nav labels come from the i18n dictionary via each item's key.
  const navLinks = SITE.nav
    .map((item) => {
      const isActive = item.href === current;
      return `<a href="${item.href}"${isActive ? ' aria-current="page"' : ""}>${escapeHtml(
        t(item.key)
      )}</a>`;
    })
    .join("");

  host.innerHTML = `
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="brand" href="index.html" aria-label="${escapeHtml(brandName)} — home">
          <!-- Logo image. If assets/logo.png is missing, onerror swaps in a text wordmark. -->
          <img
            class="brand__logo"
            src="${SITE.logo}"
            alt="${escapeHtml(brandName)} logo"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';"
          />
          <span class="brand__wordmark" style="display:none;">${escapeHtml(brandName)}</span>
        </a>

        <!-- Hamburger toggle (shown on small screens via CSS) -->
        <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <nav class="site-nav" aria-label="Primary">
          ${navLinks}

          <!-- =====================================================
               FUTURE: LANGUAGE SWITCHER goes here.
               Intentionally hidden/commented out for now — the site
               is English-only. When more languages are added to
               data/i18n.js, un-comment this, populate the options
               from Object.keys(window.I18N), and on change set
               ACTIVE_LANG + re-run initSite() (or reload).
               =====================================================
          <select class="lang-switcher" aria-label="Choose language">
            <option value="en">English</option>
            future: <option value="de">Deutsch</option> ...etc
          </select>
          -->
        </nav>
      </div>
    </header>
  `;

  // Mobile menu open/close
  const toggle = host.querySelector(".nav-toggle");
  const nav = host.querySelector(".site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ---------------------------------------------------------------------
   2b) FOOTER — affiliate disclosure + social icon buttons.
   --------------------------------------------------------------------- */
function renderFooter() {
  const host = document.getElementById("site-footer");
  if (!host) return;

  const socialButtons = SITE.socials
    .map(
      (s) => `
        <a class="social-btn" href="${s.url}" target="_blank" rel="noopener"
           aria-label="${escapeHtml(s.label)}" title="${escapeHtml(s.label)}">
          ${s.icon}
        </a>`
    )
    .join("");

  host.innerHTML = `
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <div class="site-footer__brand">
          <span class="site-footer__name">${escapeHtml(t("brand_name"))}</span>
          <p class="affiliate-disclosure">${escapeHtml(t("footer_disclosure"))}</p>
        </div>

        <!-- Social buttons corner. Add more in SITE.socials (js/site.js). -->
        <div class="socials" aria-label="Social links">
          ${socialButtons}
        </div>
      </div>
    </footer>
  `;
}

/* ---------------------------------------------------------------------
   2c) APPLY I18N — fill static page text from the dictionary.
   ---------------------------------------------------------------------
   The HTML carries keys instead of hardcoded copy:
     <h1 data-i18n="hero_title"></h1>              → textContent  = t(key)
     <p  data-i18n-html="hero_blurb"></p>          → innerHTML    = t(key)
   data-i18n-html is for strings that contain <strong>/<em> markup.
   --------------------------------------------------------------------- */
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });

  // Reflect the active language on <html lang="..."> for accessibility/SEO.
  // (When Arabic ships, also set document.documentElement.dir = "rtl".)
  document.documentElement.setAttribute("lang", ACTIVE_LANG);
}

/* ---------------------------------------------------------------------
   3) PRODUCT CARD — the ONE reusable card component.
   ---------------------------------------------------------------------
   Returns the HTML string for a single product card.
   Deliberately shows ONLY: image, name, description, "View on Amazon".
   No price, no rating, no review count (Amazon Associates compliance).
   --------------------------------------------------------------------- */
function renderProductCard(product) {
  // === MARKETPLACE SEAM ===
  // Today we always use the US link. Later, ACTIVE_MARKETPLACE could be
  // chosen per visitor (geo-detect) or replaced by an Amazon OneLink URL,
  // and product.links would carry a filled link for each country.
  // Fallback to the US link if the chosen marketplace isn't filled yet.
  const url = (product.links && product.links[ACTIVE_MARKETPLACE]) || (product.links && product.links.us) || "#";

  // Per-product image fit. Defaults to "cover" (fills the box) when absent.
  // "contain" scales the image down inside the SAME box (see styles.css).
  const fit = product.imageFit === "contain" ? "contain" : "cover";
  const mediaClass = fit === "contain" ? "card__media card__media--contain" : "card__media";
  const imgClass = fit === "contain" ? "card__img card__img--contain" : "card__img";

  return `
    <article class="card">
      <div class="${mediaClass}">
        <!-- Real photo goes at the product's image path.
             If it's missing, onerror swaps in the shared placeholder. -->
        <img
          class="${imgClass}"
          src="${escapeHtml(product.image)}"
          alt="${escapeHtml(product.name)}"
          loading="lazy"
          onerror="this.onerror=null; this.src='assets/placeholder.svg';"
        />
      </div>
      <div class="card__body">
        <h3 class="card__title">${escapeHtml(product.name)}</h3>
        <p class="card__desc">${escapeHtml(product.shortDescription)}</p>
        <div class="card__cta">
          <a class="btn btn--amazon" href="${escapeHtml(url)}"
             target="_blank" rel="nofollow sponsored noopener">
            ${escapeHtml(t("btn_view_on_amazon"))}
          </a>
          <!-- Link-level affiliate disclosure (Amazon Operating Agreement).
               Auto-added to EVERY card here — do NOT remove when editing this render. -->
          <p class="card__disclosure">${escapeHtml(t("card_paid_link"))}</p>
        </div>
      </div>
    </article>
  `;
}

/* ---------------------------------------------------------------------
   Render a grid of cards for one category into a host element.
   --------------------------------------------------------------------- */
function renderProducts(hostEl, category) {
  const all = window.PRODUCTS || [];
  const items = category ? all.filter((p) => p.category === category) : all;

  if (items.length === 0) {
    hostEl.innerHTML = `<p class="empty-note">No products here yet — check back soon!</p>`;
    return;
  }

  hostEl.innerHTML = items.map(renderProductCard).join("");
}

/* ---------------------------------------------------------------------
   4) INIT — run everything once the page is ready.
   --------------------------------------------------------------------- */
function initSite() {
  applyI18n();   // fill static page text first
  renderHeader();
  renderFooter();

  // Fill any product grid on the page based on its data-category attribute.
  document.querySelectorAll("[data-product-grid]").forEach((grid) => {
    renderProducts(grid, grid.getAttribute("data-category"));
  });

  // Stamp the year in the footer copyright, if present.
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", initSite);

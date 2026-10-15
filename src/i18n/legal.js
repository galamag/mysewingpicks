/* Legal notice texts — ONLY for the languages in LIMITED_PAGES.legal (src/i18n/index.js), whose law
   asks the site owner to name himself (spec wave 1, 5.3): de Impressum (§ 5 DDG), es Aviso legal
   (LSSI art. 10), fr Mentions légales (LCEN art. 1-1).
   The owner's data are NOT here and never in git: the page prints the placeholders %%LEGAL_NAME%%,
   %%LEGAL_ADDRESS%%, %%LEGAL_EMAIL%%, %%LEGAL_PHONE%%, and server/fill-legal.php replaces them on the
   server at every deploy (data: ~/mysewingpicks-api/legal.php). */
import { LIMITED_PAGES } from './index.js';

export const LEGAL = {
  de: {
    link: 'Impressum',
    title: 'Impressum — My Sewing Picks',
    description: 'Impressum von My Sewing Picks: Angaben zur Betreiberin bzw. zum Betreiber der Website.',
    heading: 'Impressum',
    owner: 'Angaben gemäß § 5 DDG',
    contact: 'Kontakt',
    email: 'E-Mail',
    phone: 'Telefon',
    host: null,
  },
  es: {
    link: 'Aviso legal',
    title: 'Aviso legal — My Sewing Picks',
    description: 'Aviso legal de My Sewing Picks: datos del titular del sitio web.',
    heading: 'Aviso legal',
    owner: 'Titular del sitio web (art. 10 de la Ley 34/2002, LSSI)',
    contact: 'Contacto',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    host: null,
  },
  fr: {
    link: 'Mentions légales',
    title: 'Mentions légales — My Sewing Picks',
    description: 'Mentions légales de My Sewing Picks : éditeur et hébergeur du site.',
    heading: 'Mentions légales',
    owner: 'Éditeur du site et directeur de la publication',
    contact: 'Contact',
    email: 'E-mail',
    phone: 'Téléphone',
    // Hosting provider — French law asks for its name, address and phone. Data from Bluehost's own site,
    // checked 2026-10-15: company name = Terms of Service (https://www.bluehost.com/terms: "an agreement
    // between you and Bluehost Inc."; notice address "Bluehost Inc., Attn: Legal Department, 5335 Gate Pkwy,
    // Jacksonville, FL 32256"); address and phone = Contact page (https://www.bluehost.com/contact:
    // "Bluehost Headquarters 5335 Gate Pkwy, Jacksonville, FL 32256", "Phone Support 888-401-4678", the
    // same number as in the Terms, section "Shared Hosting Uptime Guarantee": 1-888-401-4678; written here
    // in international form). Some Bluehost pages add "2nd Floor" to the address; the Terms' notice address does not.
    // Update when the site moves away from Bluehost (planned Feb 2027).
    host: { heading: 'Hébergeur', name: 'Bluehost Inc.', address: '5335 Gate Pkwy, Jacksonville, FL 32256, États-Unis', phone: '+1 888-401-4678' },
  },
};

for (const lang of LIMITED_PAGES.legal.langs) if (!LEGAL[lang]) throw new Error(`legal.js: no Legal notice texts for "${lang}"`);
for (const lang of Object.keys(LEGAL)) if (!LIMITED_PAGES.legal.langs.includes(lang)) throw new Error(`legal.js: "${lang}" has texts but is not in LIMITED_PAGES.legal`);
for (const [lang, text] of Object.entries(LEGAL)) {
  if (text.host && Object.values(text.host).some((v) => !v || v === '…')) throw new Error(`legal.js: ${lang}.host is not filled in (hosting provider's name, address, phone)`);
}

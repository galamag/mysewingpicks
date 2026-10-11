/* =====================================================================
   CATEGORIES & SECTIONS  —  My Sewing Picks
   ---------------------------------------------------------------------
   Each category is one page; its `groups` are the sections on that page,
   in display order. A product's `group` (src/data/products.js) must be one
   of its category's group ids — the build fails otherwise (typo guard).

   Pages with more than one group get a row of "jump to section" chips at
   the top (sticky under the header, built for phones).
   ===================================================================== */

export const categories = {
  tools: {
    placeholderIcon: '✂️',
    groups: [
      { id: 'machines', title: 'Machines & presser feet' },
      { id: 'cutting', title: 'Cutting & measuring' },
      { id: 'marking-pressing', title: 'Marking & pressing' },
      { id: 'helpers', title: 'Handy helpers' },
    ],
  },
  fabrics: {
    placeholderIcon: '🧵',
    groups: [
      { id: 'fabrics', title: 'Fabrics' },
      { id: 'batting-interfacing', title: 'Batting, stuffing & interfacing' },
      { id: 'trims', title: 'Trims, tapes & cords' },
      { id: 'notions', title: 'Zippers, buttons & thread' },
    ],
  },
  setup: {
    placeholderIcon: '📷',
    groups: [
      { id: 'setup', title: 'My filming setup' },
    ],
  },
};

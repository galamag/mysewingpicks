/* Fabric basket figure — English texts. Every language has the same shape
   (basket.text.js checks it). `steps` are index-aligned with STEPS in basket.js:
   step 0 = the finished basket (title + text), steps 1–8 also have `details`.
   `labels` — the chips in the drawing, by the keys basket.js uses.
   Function values (ui.dot, ui.stepOf, ui.machine) keep their parameters in every
   language: (i, title), (k, n), (stitch). A language may order them freely or
   leave one out of the sentence, but the signature stays the same.
   Numbers: the maker's only (Vault «Анатомия изделий — Корзинка»); never the finished size. */
export default {
  ui: {
    fig: 'Fig. 1',
    title: 'Fabric basket · anatomy',
    svgLabel: 'An isometric drawing of the lined fabric basket and how it is sewn, step by step.',
    prev: 'Previous step',
    dot: (i, title) => (i ? `Step ${i}: ${title}` : title),
    start: 'Steps →',
    next: 'Next →',
    overview: 'Overview',
    stepOf: (k, n) => `Step ${k} of ${n}`,
    machine: (stitch) => `Machine: ${stitch.toLowerCase()}`,
    inThisStep: 'In this step',
    takeApart: 'Take it apart',
    putTogether: 'Put it together',
    replay: '↻ Replay',
    parts: 'Parts',
    allSteps: 'Step-by-step instructions',
    endView: 'END VIEW',
    // The static cutting diagram (an <img> on the page; drawn by cut-diagram.mjs): its heading, alt, caption.
    cutTitle: 'Fabric basket · cutting sizes',
    cutAlt: 'Cutting diagram for a lined fabric basket: the outer and the lining, each a 60 × 60 cm square with a 20 × 20 cm square cut from every corner, and five 19 × 19 cm squares of interfacing.',
    cutCaption: 'The pieces to cut, with their sizes — the same as in step 1.',
  },
  stitches: { straight: 'Straight stitch' },
  labels: {
    cm60: '60 cm', cm20: '20 cm', cm19: '19 cm',
    cutCorners: 'cut away the corners',
    outerCotton: 'outer · cotton',
    liningCotton: 'lining · cotton',
    iface5: '5 × interfacing',
    wrongSideUp: 'outer, wrong side up',
    ironOn: 'iron on',
    edges05: '0.5 cm from the edges',
    turnOver: 'turn it over',
    rightSideIn: 'right side in',
    seam05: '0.5 cm seam',
    toThePoint: 'down to the point',
    opening15: '15 cm opening',
    sameAsOuter: 'the same as the outer',
    outerRightOut: 'outer right side out',
    rightSides: 'right sides together',
    turnThrough: 'turn through the opening',
    stitchClosed: 'stitch it closed',
    pushLining: 'push the lining in',
    topstitch05: '0.5 cm topstitch',
    hotGlue: 'hot glue, no sewing',
    jointFlat: 'joint on a flat side',
    bows4: 'a bow on every corner',
    christmas: 'Christmas: lace + bows',
    halloween: 'Halloween: black ribbon',
    everyday: 'every day: no trim',
  },
  steps: [
    { title: 'The finished basket', text: 'A lined fabric basket: a cotton outer stiffened with interfacing, a cotton lining, and lace and bows glued on. Tap the basket to take it apart.' },
    {
      title: 'Cut the pieces',
      text: 'Outer and lining: a 60 × 60 cm (23⅝ in) square of cotton each, with a 20 × 20 cm (7⅞ in) square cut from every corner. Interfacing: five 19 × 19 cm (7½ in) squares.',
      details: [
        'Cut a 60 × 60 cm (23⅝ × 23⅝ in) square of cotton for the outer and another one for the lining.',
        'From every corner of both squares cut away a 20 × 20 cm (7⅞ × 7⅞ in) square. What is left is a cross: the square in the middle is the base, the four arms are the walls.',
        'From heavy fusible interfacing cut five squares, 19 × 19 cm (7½ × 7½ in): one for the base and one for each wall of the outer.',
        'Every seam allowance in this basket is 0.5 cm (³⁄₁₆ in).',
        'The caption in the video says 50 × 50 cm — that is a mistake: the squares are 60 × 60 cm.',
      ],
    },
    {
      title: 'Fuse the interfacing',
      text: 'Lay the outer wrong side up. Put a square of interfacing in the middle of the base and of each wall, 0.5 cm (³⁄₁₆ in) in from the edges, and iron it on.',
      details: [
        'Lay the outer cross wrong side up.',
        'Place a square of interfacing, glue side down, in the middle of the base and of each of the four walls — 0.5 cm (³⁄₁₆ in) in from the edges all round, so it stays out of the seams.',
        'Iron the squares on. The interfacing goes on the outer only, not on the lining.',
      ],
    },
    {
      title: 'Sew the outer',
      text: 'Turn the outer right side up and fold the walls up. Pin the edges that meet and sew the four corner seams, 0.5 cm (³⁄₁₆ in), from the top down to the point.',
      details: [
        'Turn the outer cross over, right side up.',
        'Fold the walls up so that the edges of two neighbouring walls meet, right sides together. Pin them.',
        'Sew the corner seam 0.5 cm (³⁄₁₆ in) from the edge, from the top edge right down to the point at the base. No backstitching.',
        'Sew all four corners. The outer is now a box, inside out — the interfacing is on the outside.',
      ],
    },
    {
      title: 'Sew the lining',
      text: 'Make the lining the same way, without interfacing — but leave a 15 cm (5⅞ in) opening in one corner seam. You will turn the basket through it.',
      details: [
        'Fold up the walls of the lining cross, right sides together, and pin the edges that meet.',
        'Sew three corner seams 0.5 cm (³⁄₁₆ in) from the edge, from the top down to the point.',
        'Sew the fourth one too, but leave a 15 cm (5⅞ in) opening in it. It is this big because the interfaced walls of the outer are stiff and need room to come through.',
        'Keep the lining inside out.',
      ],
    },
    {
      title: 'Join outer and lining',
      text: 'Turn the outer right side out and slip it into the inside-out lining, right sides together. Sew all round the top, 0.5 cm (³⁄₁₆ in) from the edge.',
      details: [
        'Turn the outer right side out.',
        'Slip it into the lining, which stays inside out, so the right sides face each other. Line up the corner seams and the top edges.',
        'Sew all the way round the top, 0.5 cm (³⁄₁₆ in) from the edge.',
      ],
    },
    {
      title: 'Turn it out',
      text: 'Turn the basket right side out through the opening in the lining, then stitch the opening closed on the machine.',
      details: [
        'Pull the whole basket out through the 15 cm (5⅞ in) opening in the lining.',
        'Tuck in the raw edges of the opening and stitch it closed on the machine, close to the edge.',
      ],
    },
    {
      title: 'Topstitch the top',
      text: 'Push the lining down inside the basket and topstitch all round the top, 0.5 cm (³⁄₁₆ in) from the edge.',
      details: [
        'Push the lining down inside the basket, right into the corners.',
        'Topstitch all the way round the top, 0.5 cm (³⁄₁₆ in) from the edge. The basket is done — the trim is up to you.',
      ],
    },
    {
      title: 'Add the trim',
      text: 'Glue a ribbon round the top with hot glue, the joint on a flat side, and a bow on every corner. Any ribbon and any bows will do — or none at all.',
      details: [
        'The trim is glued on with a hot glue gun, not sewn.',
        'Glue a ribbon all the way round the top. Put the joint on the flat of a wall, not on a corner.',
        'Glue a bow on each of the four corners. In the video they are made beforehand from white ribbon, with a red plastic half-bead glued in the middle — ready-made bows work just as well.',
        'Any ribbon in any width: lace for Christmas, as in the video; a plain black ribbon or an orange one with pumpkins for Halloween; or no trim at all for every day. The basket in the video holds tangerines on the Christmas table — use yours for anything you like.',
      ],
    },
  ],
  legend: [
    { title: 'Outer', text: 'cotton · a 60 × 60 cm (23⅝ in) square with a 20 × 20 cm (7⅞ in) square cut from every corner' },
    { title: 'Interfacing ×5', text: 'heavy, fusible · 19 × 19 cm (7½ in) squares on the base and the walls of the outer, 0.5 cm (³⁄₁₆ in) in from the edges' },
    { title: 'Lining', text: 'cotton · the same cross as the outer, without interfacing' },
    { title: 'Ribbon', text: 'lace, or any ribbon · glued round the top with hot glue, the joint on a flat side' },
    { title: 'Bows ×4', text: 'one on every corner, glued on, a red half-bead in the middle' },
    { title: 'Seams', text: 'all 0.5 cm (³⁄₁₆ in) · a 15 cm (5⅞ in) opening in a lining corner seam · topstitch 0.5 cm from the top edge' },
  ],
};

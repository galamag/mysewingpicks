/* A separate bottom panel (guide "Bag bottoms", section `panel`) — English texts. Every language has the same
   shape (bottom-panel.text.js checks it). `steps` are index-aligned with STEPS in bottom-panel.js: step 0 =
   the finished bottom (title + text), steps 1–6 also have `details`. `labels` — the chips in the drawing, by
   the keys bottom-panel.js uses.
   Function values (ui.dot, ui.stepOf, ui.machine) keep their parameters in every language:
   (i, title), (k, n), (stitch).
   NO numbers (Vault «Гайды — Дно сумки (спецификация)», 3 and 5.2: no maker's project yet, and the sources give
   none): the method in words only — the middles marked by folding and creasing, the marks matched first, the
   walls' allowance clipped at the corners up to (not through) the stitching, each side sewn to one seam
   allowance from the corner, then the corner turned. */
export default {
  ui: {
    fig: 'Fig. 4',
    title: 'Separate bottom panel',
    svgLabel: "An isometric drawing of how a separate bottom panel is sewn in: the walls sewn into a tube, the middles of the base and of the tube marked by folding and creasing, the tube wrong side out on the base with the marks matched and clipped, the walls' seam allowance clipped at the corners, the base sewn in one side at a time, and the bag turned out with a flat base.",
    prev: 'Previous step',
    dot: (i, title) => (i ? `Step ${i}: ${title}` : title),
    start: 'Steps →',
    next: 'Next →',
    overview: 'Overview',
    stepOf: (k, n) => `Step ${k} of ${n}`,
    machine: (stitch) => `Machine: ${stitch.toLowerCase()}`,
    inThisStep: 'In this step',
    takeApart: 'Stand it up',
    putTogether: 'Show the bottom',
    replay: '↻ Replay',
    parts: 'Parts',
    allSteps: 'Step-by-step instructions',
    endView: 'END VIEW',
  },
  stitches: { straight: 'Straight stitch' },
  labels: {
    rightSides: 'right sides together',
    bothSides: 'sew both sides',
    aTube: 'a tube, open at both ends',
    foldCrease: 'fold in half, crease',
    markMiddle: 'a mark at each middle',
    seamMark: 'side seam = a mark',
    insideOut: 'wrong side out',
    markOnMark: 'mark on mark',
    clipBetween: 'then clip in between',
    clipCorner: 'clip into the corner',
    notThrough: 'not through the stitching',
    backstitch: 'backstitch',
    oneSide: 'one side at a time',
    stopTurn: 'stop and turn',
    allRound: 'all the way round',
    turnOut: 'turn it right side out',
    flatBottom: 'a flat base',
    baseSeam: 'seam round the base',
  },
  steps: [
    {
      title: 'Separate bottom panel',
      text: "The bag's bottom, the bag upside down: the base is a piece of its own, here in another fabric, sewn to the walls all round. Tap the bag to stand it up.",
    },
    {
      title: 'Sew the walls into a tube',
      text: 'Lay the front on the back, right sides together, and sew both sides: a tube, open at both ends. The base is a separate piece.',
      details: [
        'Lay the front on the back, right sides together, and clip them.',
        'Sew both sides, from top to bottom.',
        'The tube stays open at the bottom too: the base is a separate piece, sewn in later.',
        'If the walls are cut in one piece, a single seam closes the tube.',
      ],
    },
    {
      title: 'Mark the middles',
      text: 'Fold the base in half and crease the fold, then fold it in half the other way: mark the middle of each of its sides. Fold the tube in half and crease it too: the creases and the side seams mark its middles.',
      details: [
        'Fold the base in half and crease the fold with the iron or your fingers.',
        'Unfold it, fold it in half the other way and crease again.',
        'Make a mark at the middle of each side, at the edge, where a crease meets it.',
        'Fold the tube in half, side seam on side seam, and crease it: the creases mark the middle of the front and of the back.',
        'The side seams are marks too: the tube is marked in quarters, like the base.',
      ],
    },
    {
      title: 'Match the marks',
      text: 'Turn the tube wrong side out and set it on the base, right sides together, edges even. First match the marks, the side seams and the creases on the middles of the base, then clip in between.',
      details: [
        'The tube is wrong side out and the base lies right side up, so the right sides face each other.',
        "Line up the edges of the tube and the base all round; the walls' seam allowance lies on the edge of the base.",
        'First match the marks: each side seam on the middle of a short side, each crease on the middle of a long side.',
        'Clip the marks together first, then clip in between.',
      ],
    },
    {
      title: 'Clip the corners',
      text: "At each corner of the base, clip the walls' seam allowance straight into the corner, to just short of the seam line, not through the stitching: then the walls can turn the corner.",
      details: [
        'Find where each corner of the base meets the walls.',
        "Clip the walls' seam allowance into the corner, to just short of the seam line: not through the stitching.",
        'The allowance then opens and lies flat round the corner, and the corner stays sharp.',
        'Clip all the corners the same way.',
      ],
    },
    {
      title: 'Sew round the base',
      text: 'Sew one side at a time: start with a backstitch, stop one seam allowance from the corner with the needle down, turn the corner and sew the next side.',
      details: [
        'Sew with the tube wrong side out, on the seam line.',
        'Start in the middle of a side, with a backstitch.',
        'Stop one seam allowance from the corner, with the needle down in the fabric.',
        'Lift the presser foot, turn the corner, lower the foot and sew the next side.',
        'Take out the clips as you come to them and sew all the way round; backstitch where you started.',
      ],
    },
    {
      title: 'Turn it out',
      text: 'Turn the bag right side out and push the corners out: a flat base, sewn to the walls all round.',
      details: [
        'Turn the bag right side out and push out the corners.',
        'The base lies flat, and the seam runs round its edge.',
        'For a firm base, the stiffening goes on the base: interfacing ironed on before it is sewn in, or a firm insert laid in afterwards.',
      ],
    },
  ],
  legend: [
    { title: 'Base', text: 'a separate piece · here in another fabric' },
    { title: 'Base seam', text: 'joins the walls to the base, all round' },
    { title: 'Corners', text: "the walls' seam allowance clipped, so the corner stays sharp" },
    { title: 'Side seams', text: 'each meets the middle of a short side of the base' },
  ],
};

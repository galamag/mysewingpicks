/* Boxed corners (guide "Bag bottoms", section `boxed`) — English texts. Every language has the same
   shape (bottom-boxed.text.js checks it). `steps` are index-aligned with STEPS in bottom-boxed.js:
   step 0 = the finished bottom (title + text), steps 1–6 also have `details`. `labels` — the chips in
   the drawing, by the keys bottom-boxed.js uses.
   Function values (ui.dot, ui.stepOf, ui.machine) keep their parameters in every language:
   (i, title), (k, n), (stitch).
   NO numbers (Vault «Гайды — Дно сумки (спецификация)», 3 and 5.2: no maker's project yet): the sources'
   relations in words only — the line across is as long as the base is wide, marked half the base width
   from the end of the seam; the tip trimmed leaving a small allowance. */
export default {
  ui: {
    fig: 'Fig. 3',
    title: 'Boxed corners (pinched)',
    svgLabel: 'An isometric drawing of how boxed corners are made: the bag sewn at the sides and along the bottom, each bottom corner opened into a triangle with the side seam on the bottom seam, a line marked straight across it half the base width from the end of the seam and sewn, the tip cut off leaving a small allowance, and the bag turned out with a flat bottom.',
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
    sidesBottom: 'sides and bottom',
    aPouch: 'a flat pouch',
    standUp: 'stand it upside down',
    openCorner: 'open the corner',
    seamOnSeam: 'seam on seam',
    triangle: 'a triangle',
    seamEnd: 'end of the seam',
    halfBase: 'half the base width',
    baseWidth: 'base width',
    sewLine: 'sew on the line',
    backstitch: 'backstitch',
    bothCorners: 'both corners',
    trimTip: 'cut off the tip',
    smallAllowance: 'a small allowance',
    turnOut: 'turn it right side out',
    flatBottom: 'a flat bottom',
    cornerSeam: 'corner seam',
  },
  steps: [
    {
      title: 'Boxed corners (pinched)',
      text: 'The bag\'s bottom, the bag upside down: a flat bottom with the bottom seam along its middle and a short seam straight across each end, where the side seam meets it. Tap the bag to stand it up.',
    },
    {
      title: 'Sew the bag',
      text: 'Lay the front on the back, right sides together, and sew the sides and the bottom: a flat pouch, with nothing cut from the corners.',
      details: [
        'Lay the front on the back, right sides together, and clip them.',
        'Sew both sides and the bottom.',
        'Nothing is cut from the corners: the bottom is made in the next steps.',
        'If the bag is one piece folded at the bottom, there is no bottom seam: the side seam then goes onto the bottom fold.',
      ],
    },
    {
      title: 'Open the corner',
      text: 'Pull the front and the back apart at a bottom corner and flatten it so that the side seam lies right on the bottom seam: the corner becomes a triangle.',
      details: [
        'Pull the front and the back apart at one bottom corner.',
        'Flatten the corner so that the side seam lies exactly on the bottom seam (or on the bottom fold).',
        'The corner is now a triangle, with the seam running down its middle to the end of the seam at its point.',
        'Open the other bottom corner the same way.',
        'In the drawing the bag stands on its open top, bottom up, so both corners are in view.',
      ],
    },
    {
      title: 'Mark the line',
      text: 'Mark a line straight across the triangle, at right angles to the seam, half the base width from the end of the seam. The line is then as long as the base is wide.',
      details: [
        'Decide how wide the bottom should be: that is the base width.',
        'Measure half the base width along the seam, from the end of the seam, where the stitching meets at the point — not from the tip of the fabric.',
        'Draw a line there straight across the triangle, at right angles to the seam. It is as long as the base is wide.',
        'The farther the line is from the point, the wider the base. Mark the other corner the same way.',
      ],
    },
    {
      title: 'Sew on the line',
      text: 'Sew along the marked line, with a backstitch at both ends.',
      details: [
        'Sew along the line, from one edge of the triangle to the other.',
        'Backstitch at the start and at the end, so the seam holds.',
        'Sew the other corner the same way.',
      ],
    },
    {
      title: 'Cut off the tip',
      text: 'Cut off the tip of each triangle, leaving a small allowance beyond the stitching.',
      details: [
        'Cut off the tip along the stitching, leaving a small seam allowance.',
        'Do not cut into the stitching.',
        'Make every bottom corner the same way, and the lining\'s corners too if the bag has a lining.',
      ],
    },
    {
      title: 'Turn it out',
      text: 'Turn the bag right side out: it has a flat bottom, with a short corner seam across each end.',
      details: [
        'Turn the bag right side out and push the corners out.',
        'The bottom is flat and as wide as the line across was long. At each end the side seam meets the middle of the corner seam.',
      ],
    },
  ],
  legend: [
    { title: 'Bottom', text: 'flat · as wide as the corner seams are long' },
    { title: 'Bottom seam', text: 'joins the front and the back · along the middle of the bottom' },
    { title: 'Corner seams', text: 'sewn straight across the corner, half the base width from the end of the seam' },
    { title: 'Side seams', text: 'each meets the middle of a corner seam' },
  ],
};

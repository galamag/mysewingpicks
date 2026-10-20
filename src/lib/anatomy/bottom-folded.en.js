/* The folded-in bottom (guide "Bag bottoms", section `folded`) — English texts. Every language has
   the same shape (bottom-folded.text.js checks it). `steps` are index-aligned with STEPS in
   bottom-folded.js: step 0 = the finished bottom (title + text), steps 1–5 also have `details`.
   `labels` — the chips in the drawing, by the keys bottom-folded.js uses.
   Function values (ui.dot, ui.stepOf, ui.machine) keep their parameters in every language:
   (i, title), (k, n), (stitch). A language may order them freely or leave one out of the sentence,
   but the signature stays the same.
   Numbers: the maker's only — the tote's 6, 12 and 0.5 cm (Vault «Гайды — Дно сумки
   (спецификация)», 3); no finished size, no stitch length. */
export default {
  ui: {
    fig: 'Fig. 1',
    title: 'Folded-in bottom',
    svgLabel: 'An isometric drawing of how a folded-in bag bottom is made: the centre crease, two folds stitched 6 cm from it, the bottom tucked in, the side seams sewn through it and the bag turned out.',
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
    foldPress: 'fold in half and press',
    centreCrease: 'centre crease',
    cm6: '6 cm',
    rightSides: 'right sides together',
    stitchFold: 'stitch close to the fold',
    bottom12: '12 cm bottom',
    liftEnds: 'lift both ends at the stitched folds',
    foldsIn: 'the bottom folds in',
    centreInside: 'centre 6 cm inside',
    seam05: '0.5 cm seam',
    layers4: '4 layers here',
    turnOut: 'turn it right side out',
    openUp: 'open it up',
    base12: '12 cm base',
    cornersForm: 'corners form by themselves',
  },
  steps: [
    {
      title: 'The folded-in bottom',
      text: 'The tote\'s bottom, the bag upside down: a flat 12 cm (4¾ in) base between two stitched folds, and corners that form by themselves — no corner seams. Tap the bag to stand it up.',
    },
    {
      title: 'Crease the centre and measure',
      text: 'Fold the piece in half across the middle, press a crease and open it out. Measure 6 cm (2⅜ in) from the crease towards each end and draw a line across.',
      details: [
        'The bag is cut in one piece, folded across the middle: the bottom is in the middle of the piece.',
        'Fold it in half across the middle and press a crease with the iron. Open it out again: the crease is the middle of the bottom.',
        'Measure 6 cm (2⅜ in) from the crease towards each end and draw a line across the whole width of the piece with an air-erasable pen.',
      ],
    },
    {
      title: 'Stitch a fold on each line',
      text: 'Fold along the first line, right sides together, and stitch close to the fold. Open it out and do the same on the second line: two stitched folds, 12 cm (4¾ in) apart.',
      details: [
        'Fold the piece along the first line, right sides together, and stitch close to the fold, all the way across. Open it out.',
        'Fold and stitch along the second line the same way.',
        'The two stitched folds, 12 cm (4¾ in) apart, are the edges of the bottom; the centre crease is its middle. In the next step the piece bends at these folds.',
      ],
    },
    {
      title: 'Tuck the bottom in',
      text: 'Lift both ends at the stitched folds and bring them together: the bottom folds in and the centre crease goes 6 cm (2⅜ in) inside. Lay it flat.',
      details: [
        'Lay the piece right side up and lift both ends, so it bends at the two stitched folds.',
        'Bring the ends together. The 12 cm (4¾ in) bottom folds in on itself and the centre crease goes inside, 6 cm (2⅜ in) up between the layers — like the bottom of a paper bag.',
        'Lay it flat, right sides together. The stitched folds are now the bottom edge.',
      ],
    },
    {
      title: 'Sew the sides',
      text: 'Keep the bottom tucked in and sew both sides with a 0.5 cm (³⁄₁₆ in) seam — through all the layers, four at the bottom.',
      details: [
        'Clip the sides so the tucked-in bottom stays in place.',
        'Sew both side seams, 0.5 cm (³⁄₁₆ in) from the edge, all the way down. At the bottom the seam goes through four layers — the front, the two halves of the tucked bottom and the back. Leave the top open.',
        'On the tote, the lining is sewn the same way — only one of its side seams is left with an opening, to turn the bag through later.',
      ],
    },
    {
      title: 'Turn it out',
      text: 'Turn it right side out and open it up: the bottom unfolds into a flat 12 cm (4¾ in) base, and the corners form by themselves.',
      details: [
        'Turn the bag right side out through the top.',
        'Open it up and push the bottom out. The tucked bottom unfolds into a flat 12 cm (4¾ in) base, and where the side seams caught it, neat corners form by themselves — no extra corner seams needed.',
      ],
    },
  ],
  legend: [
    { title: 'Base', text: 'flat, 12 cm (4¾ in) wide: the bottom between the two stitched folds' },
    { title: 'Stitched folds', text: 'a fold stitched close to the edge, 6 cm (2⅜ in) each side of the centre crease · the long edges of the base' },
    { title: 'Centre crease', text: 'the middle of the bottom · tucked 6 cm (2⅜ in) inside before the side seams are sewn' },
    { title: 'Side seams', text: '0.5 cm (³⁄₁₆ in), sewn with the bottom tucked in · four layers at the bottom' },
    { title: 'Corners', text: 'formed by themselves where the side seams caught the tucked bottom · no corner seams' },
  ],
};

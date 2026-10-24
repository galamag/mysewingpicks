/* Invisible zipper (guide "How to sew a zipper", section `invisible`) — English texts. Every language has the same shape
   (zipper-invisible.text.js checks it). `steps` are index-aligned with STEPS in zipper-invisible.js: step 0 = the
   finished seam (title + text), steps 1–10 also have `details`. `labels` — the chips in the drawing, by the keys
   zipper-invisible.js uses. Function values (ui.dot, ui.stepOf, ui.machine) keep their parameters in every language:
   (i, title), (k, n), (stitch).
   NO numbers and no units (Vault «Гайды — Молния (спецификация)», 3 and 5.3): how much longer the zipper is, where the
   seam below starts, the iron's heat — in words. The zipper stitching goes from top to bottom until the pull stops the
   foot: all the sources agree on that, so it is said. The invisible zipper foot is named, never linked (not in the
   catalog); the seam below with the zipper foot (Windman set). Never "sandwich" in English (a search trap). No first
   person, no maker. Another section is never named by its number. */
export default {
  ui: {
    fig: 'Fig. 6',
    title: 'Invisible zipper',
    svgLabel: 'An isometric drawing of how an invisible zipper is sewn into a seam: the seam left open; the zipper opened and its coil pressed flat from the back with a barely warm iron; the zipper face down on the right side of one piece, its coil on the seam line, stitched with the invisible zipper foot from top to bottom until the pull stops the foot; the other side the same way, with the coil in the other groove and the top edges level; the zipper closed; the seam below sewn with the zipper foot; the ends of the zipper tape stitched to the seam allowances only. From the outside only the seam line and the pull show.',
    prev: 'Previous step',
    dot: (i, title) => (i ? `Step ${i}: ${title}` : title),
    start: 'Steps →',
    next: 'Next →',
    overview: 'Overview',
    stepOf: (k, n) => `Step ${k} of ${n}`,
    machine: (stitch) => `Machine: ${stitch.toLowerCase()}`,
    inThisStep: 'In this step',
    takeApart: 'See through the fabric',
    putTogether: 'Back to the fabric',
    replay: '↻ Replay',
    parts: 'Parts',
    allSteps: 'Step-by-step instructions',
    endView: 'END VIEW',
  },
  stitches: { straight: 'Straight stitch' },
  labels: {
    seamOpen: 'leave the seam open',
    zipperFirst: 'the zipper first',
    openZip: 'open the zipper',
    fromBack: 'press the coil flat from the back',
    coolIron: 'a barely warm iron',
    faceDown: 'zipper face down',
    coilOnSeam: 'coil on the seam line',
    oneGroove: 'coil in one groove',
    topDown: 'from top to bottom',
    toPull: 'until the pull stops the foot',
    otherPiece: 'the other piece, right side up',
    freeHalf: 'the free half face down',
    topsLevel: 'top edges level',
    notTwisted: 'not twisted',
    otherGroove: 'coil in the other groove',
    close: 'close the zipper',
    rightSides: 'right sides together',
    aboveSide: 'a little above, to the side',
    zipperFoot: 'the zipper foot',
    tapeEnds: 'to the seam allowances only',
    rightUp: 'right side up',
    onlyPull: 'only the seam line and the pull',
  },
  steps: [
    {
      title: 'Invisible zipper',
      text: 'From the outside the zipper does not show: only the seam line and the pull. Tap to see through the fabric.',
    },
    {
      title: 'Leave the seam open',
      text: 'Leave the seam open: the invisible zipper is sewn in first, and the seam below it afterwards.',
      details: [
        'Do not sew the seam yet: the zipper goes into the open edges first.',
        'The seam below the zipper is sewn once the zipper is in.',
      ],
    },
    {
      title: 'Press the coil flat',
      text: 'Open the zipper. From the back, press the coil flat with a barely warm iron.',
      details: [
        'Take an invisible zipper a little longer than the opening.',
        'Open the zipper all the way.',
        'Turn it to the back and press the coil flat with a barely warm iron: a hot iron melts the coil.',
      ],
    },
    {
      title: 'The zipper face down',
      text: 'Lay the open zipper face down on the right side of one piece, its coil right on the seam line, and pin it.',
      details: [
        'Lay one half of the open zipper face down on the right side of one piece.',
        'Put the coil right on the seam line, the tape on the seam allowance.',
        'Pin the tape in place.',
      ],
    },
    {
      title: 'The first side',
      text: 'Put on the invisible zipper foot, with the coil in one of its grooves. Stitch from top to bottom until the pull stops the foot, and backstitch.',
      details: [
        'Put on the invisible zipper foot: the coil runs in one of the two grooves under it.',
        'Stitch from top to bottom, close to the coil, until the pull stops the foot.',
        'Backstitch there.',
        'Keep the coil in the groove: if the stitching catches the coil, the zipper will not close.',
      ],
    },
    {
      title: 'The other side',
      text: 'Lay the other piece right side up and turn the first piece over onto it, right sides together, with its seam allowance and its half of the zipper folded back. The free half of the zipper lies face down on the other piece, its coil on the seam line.',
      details: [
        'Lay the other piece right side up.',
        'Turn the first piece over onto it, right sides together, its seam allowance and the sewn half of the zipper folded back.',
        'Lay the free half of the zipper face down on the right side of the other piece, its coil right on the seam line.',
        'Match the top edges, and any cross seams: the zipper must not be twisted. Pin.',
      ],
    },
    {
      title: 'Stitch the other side',
      text: 'With the coil in the other groove of the invisible zipper foot, stitch from top to bottom until the pull stops the foot, and backstitch.',
      details: [
        'Put the coil in the other groove of the invisible zipper foot.',
        'Stitch from top to bottom, close to the coil, until the pull stops the foot.',
        'Backstitch there. The coil stays out of the stitching.',
      ],
    },
    {
      title: 'Close the zipper',
      text: 'Close the zipper: the pull goes up to the top.',
      details: [
        'Close the zipper all the way.',
        'It slides freely when the coil is not caught in the stitching.',
      ],
    },
    {
      title: 'The seam below',
      text: 'Put the pieces right sides together and change to the zipper foot. Sew the seam below the zipper, starting a little above and to the side of the end of the zipper stitching.',
      details: [
        'Put the pieces right sides together, the raw edges even.',
        'Change to the zipper foot.',
        'Start a little above and to the side of the end of the zipper stitching, and sew the rest of the seam.',
      ],
    },
    {
      title: 'The tape ends',
      text: 'Fold the seam allowances out and stitch the ends of the zipper tape to the seam allowances only, not to the pieces.',
      details: [
        'Fold the seam allowances out.',
        'Stitch each end of the zipper tape to its own seam allowance only, not to the piece.',
      ],
    },
    {
      title: 'Right side up',
      text: 'Open the pieces out and turn them right side up. From the outside only the seam line and the pull show.',
      details: [
        'Open the pieces out and turn them right side up.',
        'From the outside only the seam line and the pull show.',
      ],
    },
  ],
  legend: [
    { title: 'Fabric', text: 'two pieces joined at the seam line · no stitching shows' },
    { title: 'Seam line', text: 'the coil hides in it · below the zipper, a plain seam' },
    { title: 'Zipper', text: 'under the fabric · its tapes stitched to the seam allowances only' },
    { title: 'Pull', text: 'the only part of the zipper that shows' },
  ],
};

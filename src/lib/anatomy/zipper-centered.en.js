/* Centered zipper (guide "How to sew a zipper", section `centered`) — English texts. Every language has the same shape
   (zipper-centered.text.js checks it). `steps` are index-aligned with STEPS in zipper-centered.js: step 0 = the finished
   seam (title + text), steps 1–9 also have `details`. `labels` — the chips in the drawing, by the keys zipper-centered.js
   uses. Function values (ui.dot, ui.stepOf, ui.machine) keep their parameters in every language: (i, title), (k, n),
   (stitch).
   NO numbers and no units (Vault «Гайды — Молния (спецификация)», 3, 3.1 and 5.3): the stitching's distance from the seam
   line is said in words, the basting is "the longest stitch". Both sides are sewn in the same direction — WHICH direction
   is never said (the sources differ). The zipper foot (Windman set) where it sews next to the zipper. Never "sandwich" in
   English (a search trap). No first person, no maker. Another section is never named by its number. */
export default {
  ui: {
    fig: 'Fig. 4',
    title: 'Centered zipper',
    svgLabel: 'An isometric drawing of how a centered zipper is sewn into a seam: the seam sewn up to the mark at the bottom stop with a backstitch, the opening basted with the longest stitch and the seam pressed open; the zipper face down on the seam allowances, its teeth on the seam line; stitched from the right side with the zipper foot across the bottom and along both sides, in the same direction; then the basting unpicked, so the two folded edges meet over the teeth.',
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
  stitches: { straight: 'Straight stitch', basting: 'Longest stitch' },
  labels: {
    rightSides: 'right sides together',
    markStop: 'mark the bottom stop',
    toMark: 'the seam, up to the mark',
    backstitch: 'backstitch',
    baste: 'baste: the longest stitch',
    openOut: 'open out',
    wrongUp: 'wrong side up',
    pressOpen: 'press the seam open',
    faceDown: 'zipper face down',
    teethOnSeam: 'teeth on the seam line',
    allowancesOnly: 'pin to the allowances only',
    rightUp: 'right side up',
    belowStop: 'across, below the stop',
    pivot: 'pivot, needle down',
    needleDown: 'needle down, foot up',
    movePull: 'move the pull past the foot',
    otherSide: 'the other side',
    sameWay: 'in the same direction',
    unpick: 'unpick the basting',
    meet: 'the folds meet over the teeth',
  },
  steps: [
    {
      title: 'Centered zipper',
      text: 'The two folded edges of the seam meet over the zipper teeth; a line of stitching runs along each side and across the bottom. Tap to see through the fabric.',
    },
    {
      title: 'Right sides together',
      text: 'Place the two pieces right sides together. Lay the zipper along the seam line and mark where its bottom stop is: the opening for the zipper ends at the mark.',
      details: [
        'Finish the raw edges of the seam first, so they do not fray.',
        'Place the two pieces right sides together, the edges even, and clip them.',
        'Lay the zipper along the seam line and mark the seam line at its bottom stop: the opening for the zipper ends at the mark.',
      ],
    },
    {
      title: 'The seam, up to the mark',
      text: 'Sew the seam with a regular stitch up to the mark and backstitch there, so the seam holds where the zipper ends.',
      details: [
        'Sew the seam with a regular stitch, on the seam line, up to the mark.',
        'Backstitch at the mark: the seam must not come undone where the zipper ends.',
      ],
    },
    {
      title: 'Baste the opening',
      text: 'Set the longest stitch and sew the opening closed on the same seam line, from the mark to the top edge. This basting comes out at the end.',
      details: [
        'Set the machine to its longest stitch: this is basting, it will be unpicked later.',
        'Sew the opening closed on the same seam line, from the mark to the top edge.',
        'The basting holds the opening closed while the zipper is sewn in.',
      ],
    },
    {
      title: 'Press the seam open',
      text: 'Open the pieces out, turn them wrong side up and press the seam allowances open, one to each side, along the whole seam.',
      details: [
        'Open the pieces out and turn them wrong side up.',
        'Press the seam allowances open, one to each side, along the whole seam, the basted part too.',
      ],
    },
    {
      title: 'The zipper face down',
      text: 'Lay the zipper face down on the seam allowances, its teeth right on the seam line, and pin it to the seam allowances only.',
      details: [
        'Lay the zipper face down on the pressed-open seam allowances.',
        'Put the teeth right on the seam line, the bottom stop at the mark.',
        'Pin the zipper tape to the seam allowances only, not to the pieces under them.',
      ],
    },
    {
      title: 'One side',
      text: 'Turn the work right side up. With the zipper foot, stitch across the bottom, below the stop, pivot with the needle down and stitch along one side, through all the layers.',
      details: [
        'Turn the work right side up: the zipper is underneath, its teeth under the seam line.',
        'Put on the zipper foot: it lets the needle stitch close to the zipper.',
        'Start on the seam line and stitch across the bottom, below the stop: never over the stop.',
        'At the corner, stop with the needle down in the fabric, lift the foot, turn the work and stitch along the side, the same distance from the seam line all the way.',
      ],
    },
    {
      title: 'Move the pull',
      text: 'When the pull gets in the way, stop with the needle down, lift the foot and slide the pull past the foot. Lower the foot and finish the side with the zipper foot.',
      details: [
        'A few stitches before the pull, stop with the needle down in the fabric.',
        'Lift the presser foot and slide the pull past the foot, behind the needle.',
        'Lower the foot and finish the side with the zipper foot.',
      ],
    },
    {
      title: 'The other side',
      text: 'Stitch the other side the same way with the zipper foot: across the bottom from the seam line, pivot, along the side, in the same direction as the first side.',
      details: [
        'Start again on the seam line and stitch the other half of the bottom, below the stop.',
        'Pivot with the needle down and stitch along the other side, the same distance from the seam line.',
        'Sew both sides in the same direction.',
      ],
    },
    {
      title: 'Unpick the basting',
      text: 'Unpick the basting over the zipper and press. The two folded edges meet over the teeth, and the zipper shows just a little.',
      details: [
        'Unpick the basting stitches over the zipper.',
        'Press from the right side: the two folded edges meet over the teeth.',
      ],
    },
  ],
  legend: [
    { title: 'Fabric', text: 'two pieces joined by one seam · their folded edges meet over the teeth' },
    { title: 'Stitching', text: 'along both sides and across the bottom, below the stop · the same distance from the seam line' },
    { title: 'Seam', text: 'below the zipper, backstitched at the mark' },
    { title: 'Zipper', text: 'face down under the seam, its teeth on the seam line' },
  ],
};

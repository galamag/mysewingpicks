/*
  The static cutting diagram of an anatomy figure — an ordinary <img> on the project page
  (image search; all the cut sizes in one picture). It is the figure's own frame: the end
  (t = 1) of the model's CUT step in one language, plus a heading (ui.cutTitle) and some
  lines of the legend. Our drawing, our numbers — never someone else's picture.
  The PNGs are drawn OUTSIDE the build (the build has no browser) by
  .claude/skills/building-sewing-anatomy/cut-diagram.mjs (Edge headless) into
  src/assets/projects/<slug>-cutting-diagram.<lang>.png, with <slug>-cutting-diagram.json
  next to them: a fingerprint of what each picture shows. The page recomputes it with
  cutDiagramStamp(): a changed number or label without a redrawn picture fails the build.
  Build time only (node:crypto) — never imported by the browser.
*/
import { createHash } from 'node:crypto';

/** What the diagram shows in one language: the frame, the heading, the legend lines. */
export function cutDiagram(model, L) {
  const { step, legend } = model.CUT;
  const notes = legend.map((i) => {
    if (!L.legend[i]) throw new Error(`cut-diagram: no legend line ${i}`);
    return L.legend[i];
  });
  if (!L.ui.cutTitle) throw new Error('cut-diagram: no ui.cutTitle in the texts');
  const { body, viewBox } = model.renderStep(step, 1, L);
  return { viewBox, body, title: L.ui.cutTitle, notes };
}

/** Fingerprint of a diagram (stored by cut-diagram.mjs, checked by the page). */
export const cutDiagramStamp = (d) => createHash('sha256').update(JSON.stringify(d)).digest('hex').slice(0, 16);

/*
  "Steps 3–7 / steps 1, 3 / step 10": how a language writes the project steps where a guide technique is
  used (pages.guide.usedInSteps). Plain function, so every <lang>.js gives its own words and separators:
  one — "step", many — "steps", range — between the first and the last step of an unbroken run (en dash
  unless the language says otherwise, fr "à"), sep — between steps that are not in a row.
*/
export function stepsText(steps, { one, many, range = '–', sep = ', ' }) {
  const list = [...new Set(steps)].sort((a, b) => a - b);
  if (list.length === 1) return `${one} ${list[0]}`;
  const run = list.every((k, i) => i === 0 || k === list[i - 1] + 1);
  return `${many} ${run ? `${list[0]}${range}${list[list.length - 1]}` : list.join(sep)}`;
}

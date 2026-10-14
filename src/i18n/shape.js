/* Same keys (deeply), same list lengths, same value types — or the build fails.
   No imports: the tote figure's browser script uses it too. */
export function assertSameShape(a, b, where) {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) throw new Error(`i18n: ${where}: expected a list`);
    if (a.length !== b.length) throw new Error(`i18n: ${where}: ${b.length} items, English has ${a.length}`);
    a.forEach((x, i) => assertSameShape(x, b[i], `${where}[${i}]`));
    return;
  }
  if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') throw new Error(`i18n: ${where}: expected an object`);
    for (const k of Object.keys(a)) if (!(k in b)) throw new Error(`i18n: ${where}.${k} is missing`);
    for (const k of Object.keys(b)) if (!(k in a)) throw new Error(`i18n: ${where}.${k} is extra (not in English)`);
    for (const k of Object.keys(a)) assertSameShape(a[k], b[k], `${where}.${k}`);
    return;
  }
  if (typeof a !== typeof b) throw new Error(`i18n: ${where}: ${typeof b} instead of ${typeof a}`);
  if (typeof b === 'string' && !b.trim()) throw new Error(`i18n: ${where} is empty`);
}

/** Atraso escalonado limitado, para listas longas não demorarem a aparecer. */
export function stagger(index: number, step = 0.06, max = 8) {
  return Math.min(index, max) * step;
}

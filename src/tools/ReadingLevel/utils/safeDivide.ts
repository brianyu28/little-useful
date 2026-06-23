export function safeDivide(numerator: number, denominator: number) {
  if (denominator === 0) {
    return null;
  }

  return numerator / denominator;
}

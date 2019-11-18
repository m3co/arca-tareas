export function getNumberFromString(string: string): number {
  return Number(string.match(/-?[0-9]+/i)[0]);
}
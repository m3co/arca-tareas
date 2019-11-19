export function getNumberFromString(string: string): number {
  return Number(string.match(/-?[0-9]+/i)[0]);
}

export function dateToYYYYMMDD(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
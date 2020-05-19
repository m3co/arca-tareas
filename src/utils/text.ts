export function getNumberFromString(string: string): number {
  return Number(string.match(/-?[0-9]+/i)[0]);
}

export function dateToYYYYMMDD(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function strTemplateBySeparator(separator: string, ...args: Array<string>) {
  const truthyValues = args.filter(elem => elem.trim() && elem !== 'null');
  return truthyValues.join(separator);
}

export function getPointOnTimeline(timeline: Array<Date>, date: Date) {
  return timeline.findIndex(item => String(item) === String(date));
}

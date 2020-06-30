import { State } from 'arca-redux-v4';
import head from 'lodash/head';
import last from 'lodash/last';

export const sortByStart = (rows: State['Source']['AAU-Tasks-Gantt']) => rows
  .sort((a, b) => Date.parse(String(a.Start)) - Date.parse(String(b.Start)));

export const sortByEnd = (rows: State['Source']['AAU-Tasks-Gantt']) => rows
  .sort((a, b) => Date.parse(String(a.End)) - Date.parse(String(b.End)));

export const getDurationTaskInDays = (
  row: State['Source']['AAU-Tasks-Gantt'][0],
) => ((Date.parse(String(row.End)) - Date.parse(String(row.Start))) / 60000) / 1440;

export const getDateList = (start: Date, end: Date) => {
  const list = [];
  const date = new Date(start);

  while (date <= end) {
    list.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return list;
};

export function addDaysToHeadList(numberDays: number, list: Array<Date>) {
  const newList = [];
  const headList = head(list);
  const date = new Date(headList);
  date.setDate(date.getDate() - numberDays);

  while (date < headList) {
    newList.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return [...newList, ...list];
}

export function addDaysToTailList(numberDays: number, list: Array<Date>) {
  const newList = [];
  const lastOfList = last(list);
  const date = new Date(lastOfList);
  date.setDate(date.getDate() + 1);

  while (newList.length < numberDays) {
    newList.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return [...list, ...newList];
}

export const getMappedDates = (list: Array<Date>) => {
  const mappedDates = new Map();

  const yearsMap = list.reduce((years, date) => {
    const year = date.getFullYear();

    if (years.has(year)) {
      years.set(year, [...years.get(year), date]);
    } else {
      years.set(year, [date]);
    }

    return years;
  }, new Map());

  yearsMap.forEach((month: Array<Date>, year) => {
    interface Imonth<T> {
      [key: number]: Array<Date>,
    }

    const months = month.reduce((year: Imonth<[]>, date: Date) => {
      const month: keyof Imonth<number> = date.getMonth();

      if (year[month]) {
        year[month].push(date);
      } else {
        Object.defineProperty(year, month, {
          configurable: true,
          enumerable: true,
          value: [date],
        });
      }

      return year;
    }, {});

    mappedDates.set(year, months);
  });

  return mappedDates;
};

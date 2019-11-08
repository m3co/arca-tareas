import { State } from 'arca-redux';

export const sortByStart = (rows: State['Source']['AAU-Tasks-Gantt']['Rows']) => rows
  .sort((a, b) => Date.parse(String(a.Start)) - Date.parse(String(b.Start)));

export const sortByEnd = (rows: State['Source']['AAU-Tasks-Gantt']['Rows']) => rows
  .sort((a, b) => Date.parse(String(a.End)) - Date.parse(String(b.End)));

export const getDurationTaskInDays = (row: State['Source']['AAU-Tasks-Gantt']['Rows'][0]) => {
  return ((Date.parse(String(row.End)) - Date.parse(String(row.Start))) / 60000) / 1440;
}

export const getDateList = (start: Date, end: Date) => {
  const list = new Array();
  const date = new Date(start);

  while (date <= end) {
      list.push(new Date(date));
      date.setDate(date.getDate() + 1);
  }

  return list;
}
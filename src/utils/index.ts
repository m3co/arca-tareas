import { State } from 'arca-redux';

export const sortByStart = (rows: State['Source']['AAU-Tasks-Gantt']['Rows']) => rows
  .sort((a, b) => Date.parse(String(a.Start)) - Date.parse(String(b.Start)));

export const sortByEnd = (rows: State['Source']['AAU-Tasks-Gantt']['Rows']) => rows
  .sort((a, b) => Date.parse(String(a.End)) - Date.parse(String(b.End)));

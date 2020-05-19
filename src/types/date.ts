export type TMonthsNumber = 0|1|2|3|4|5|6|7|8|9|10|11;

export interface IMonthsConstant {
  [key: number]: string,
}

export interface IDatesByMonthsInYear<T> {
  [key: number]: Array<Date>,
}

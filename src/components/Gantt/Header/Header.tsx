import React from 'react';
import { MONTHS } from '../../../utils/constant';
import { getMappedDates } from '../../../utils';
import { TMonthsNumber, IDatesByMonthsInYear } from '../../../types/date';
import './Header.less';

interface HeaderProps {
  timeLine: Array<Date>,
}

const Header: React.FunctionComponent<HeaderProps> = ({
  timeLine,
}) => {
  const renderHead = (mappedDates: Map<TMonthsNumber, IDatesByMonthsInYear<{}>>) => {
    const items: Array<JSX.Element> = [];

    mappedDates.forEach((months, year) => {
      items.push(
        <div className='gantt-header__year' key={year}>
          <div className='gantt-header__year-title'>{year}</div>
          <div className='gantt-header__year-content'>
            {
              renderMonth(months)
            }
          </div>
        </div>,
      );
    });

    return items;
  };

  const renderMonth = (year: IDatesByMonthsInYear<{}>) => {

    return Object.keys(year).map((month) => {
      const numberMonth: keyof IDatesByMonthsInYear<number> = Number(month);

      return (
        <div className='gantt-header__month' key={month}>
          <div className='gantt-header__month-title'>{MONTHS[numberMonth]}</div>
          <div className='gantt-header__month-content'>
            {
              year[numberMonth].map((day: Date) => (
                <div className='gantt-header__day' key={String(day)}>
                  { day.getDate() }
                </div>
              ))
            }
          </div>
        </div>
      )
    });
  };

  return (
    <div className='gantt-header'>
      <div className='gantt-header__title'>
        tasks/timeline
      </div>
      {
        renderHead(getMappedDates(timeLine))
      }
    </div>
  );
};

export default Header;

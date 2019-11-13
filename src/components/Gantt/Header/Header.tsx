import React from 'react';
import classNames from 'classnames';
import { MONTHS, SANDAY, SATURDAY } from '../../../utils/constant';
import { getMappedDates, addDaysToHeadList, addDaysToTailList } from '../../../utils';
import { TMonthsNumber, IDatesByMonthsInYear } from '../../../types/date';
import './Header.less';

interface HeaderProps {
  timeLine: Array<Date>,
}

const Header: React.FunctionComponent<HeaderProps> = ({
  timeLine,
}) => {
  const renderMonth = (year: IDatesByMonthsInYear<{}>) => Object.keys(year).map(month => {
    const numberMonth: keyof IDatesByMonthsInYear<number> = Number(month);

    return (
      <div className='gantt-header__month' key={month}>
        <div className='gantt-header__month-title'>{MONTHS[numberMonth]}</div>
        <div className='gantt-header__month-content'>
          {
              year[numberMonth].map((day: Date) => {
                const dayWeek = day.getDay();

                return (
                  <div
                    className={classNames('gantt-header__day', {
                      'gantt-header__day--weekend': dayWeek === SANDAY || dayWeek === SATURDAY,
                    })}
                    key={String(day)}
                  >
                    { day.getDate() }
                  </div>
                );
              })
            }
        </div>
      </div>
    );
  });

  const renderHead = (mappedDates: Map<TMonthsNumber, IDatesByMonthsInYear<{}>>) => {
    const items: Array<JSX.Element> = [];

    mappedDates.forEach((months, year) => {
      items.push(
        <div className='gantt-header__year' key={String(year)}>
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

  return (
    <div className='gantt-header'>
      <div className='gantt-header__title'>
        tasks/timeline
      </div>
      {
        renderHead(getMappedDates(addDaysToTailList(7, addDaysToHeadList(7, timeLine))))
      }
    </div>
  );
};

export default Header;

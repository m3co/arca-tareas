import React from 'react';
import './Header.less';
import { MONTHS } from '../../../utils/constant';

interface HeaderProps {
  timeLine: Array<Date>,
}

const Header: React.FunctionComponent<HeaderProps> = ({
  timeLine,
}) => {
  const yearsMap = timeLine.reduce((years, date) => {
    if (years[date.getFullYear()]) {
      years[date.getFullYear()].push(date);
    } else {
      years[date.getFullYear()] = [date];
    }

    return years;
  }, {})

  const yearsMappedBymonth = {};
  for (const year in yearsMap) {
    const dates = yearsMap[year];

    yearsMappedBymonth[year] = dates.reduce((acc, date) => {
      if (acc[date.getMonth()]) {
        acc[date.getMonth()].push(date);
      } else {
        acc[date.getMonth()] = [date];
      }
  
      return acc;
    }, {});
  }

  console.log(yearsMappedBymonth);

  const renderHead = (yearsMappedBymonth) => {
    const items = [];

    for (const year in yearsMappedBymonth) {
      items.push(
        <div className='gantt-header__year' key={year}>
          <div className='gantt-header__year-title'>{year}</div>
          <div className='gantt-header__year-content'>
            {
              renderMonth(yearsMappedBymonth[year])
            }
          </div>
        </div>
      )
    }

    return items;
  }

  const renderMonth = (year) => {
    const items = [];

    for (const month in year) {
      items.push(
        <div className='gantt-header__month' key={month}>
          <div className='gantt-header__month-title'>{MONTHS[month]}</div>
          <div className='gantt-header__month-content'>
            {
              year[month].map(day => (
                <div className='gantt-header__day' key={String(day)}>
                  { day.getDate() }
                </div>
              ))
            }
          </div>
        </div>
      )
    }

    return items;
  }

  return (
    <div className='gantt-header'>
      <div className='gantt-header__title'>
        tasks/timeline
      </div>
      {
        renderHead(yearsMappedBymonth)
      }
      {/* {
        timeLine.map(day => (
          <div className='gantt-header__day' key={String(day)}>
            { day.getDate() }
          </div>
        ))
      } */}
    </div>
  )
};

export default Header;

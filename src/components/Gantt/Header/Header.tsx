import React from 'react';
import range from 'lodash/range';
import './Header.less';

interface HeaderProps {
  startDate: Date,
  endDate: Date,
}

const Header: React.FunctionComponent<HeaderProps> = ({
  startDate, endDate,
}) => {
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);
  const diffTime = Math.abs(Number(date2) - Number(date1));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return (
    <div className='gantt-header'>
      <div className='gantt-header__title'>
        tasks/timeline
      </div>
      {
        range(diffDays).map(day => (
          <div className='gantt-header__day' key={day}>
            {day + 1}
          </div>
        ))
      }
    </div>
  )
}

export default Header;

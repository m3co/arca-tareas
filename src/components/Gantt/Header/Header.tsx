import React from 'react';
import './Header.less';

interface HeaderProps {
  timeLine: Array<Date>,
}

const Header: React.FunctionComponent<HeaderProps> = ({
  timeLine,
}) => {
  return (
    <div className='gantt-header'>
      <div className='gantt-header__title'>
        tasks/timeline
      </div>
      {
        timeLine.map(day => (
          <div className='gantt-header__day' key={String(day)}>
            { day.getDate() }
          </div>
        ))
      }
    </div>
  )
}

export default Header;

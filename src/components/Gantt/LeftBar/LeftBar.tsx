import React from 'react';
import { State } from 'arca-redux-v4';
import TaskName from './components/TaskName';
import './LeftBar.less';

interface LeftBarProps {
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
}

const LeftBar: React.FunctionComponent<LeftBarProps> = ({
  ganttInfo,
}) => (
  <div className='gantt-leftbar-wrap'>
    <div className='gantt-leftbar'>
      {
        ganttInfo.map((row, index) => (
          <TaskName
            rowInfo={row}
            key={`${row.Key + row.Constraint} ${String(index)}`}
          />
        ))
      }
    </div>
  </div>
);

export default LeftBar;

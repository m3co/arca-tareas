import React from 'react';
import { State } from 'arca-redux-v4';
import TaskName from './components/TaskName';
import './LeftBar.less';

interface LeftBarProps {
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
  currentType: string,
}

const LeftBar: React.FunctionComponent<LeftBarProps> = ({
  ganttInfo, currentType,
}) => (
  <div className='gantt-leftbar-wrap'>
    <div className='gantt-leftbar'>
      {
        ganttInfo.map((row, index) => (
          <TaskName
            currentType={currentType}
            rowInfo={row}
            key={`${row.Key + row.Constraint} ${String(index)}`}
          />
        ))
      }
    </div>
  </div>
);

export default LeftBar;

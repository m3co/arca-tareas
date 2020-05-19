import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import TaskName from './components/TaskName';
import './LeftBar.less';

interface LeftBarProps {
  socket: ARCASocket,
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
  fieldsInfo: State['Source']['AAU-Tasks-Gantt']['Info']['Fields'],
}

const LeftBar: React.FunctionComponent<LeftBarProps> = ({
  ganttInfo, socket, fieldsInfo,
}) => (
  <div className='gantt-leftbar-wrap'>
    <div className='gantt-leftbar'>
      {
        ganttInfo.Rows.map((row, index) => (
          <TaskName
            rowInfo={row}
            key={`${row.Key + row.Constraint} ${String(index)}`}
            socket={socket}
            fieldsInfo={fieldsInfo}
          />
        ))
      }
    </div>
  </div>
);

export default LeftBar;

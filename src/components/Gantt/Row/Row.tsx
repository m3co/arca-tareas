import React, { useState } from 'react';
import { State } from 'arca-redux';
import { getDateList } from '../../../utils';
import './Row.less';

interface RowProps {
  rowInfo: State['Source']['AAU-Tasks-Gantt']['Rows'][0],
  timeLine: Array<Date>,
}

const Row: React.FunctionComponent<RowProps> = ({
  rowInfo, timeLine,
}) => {
  const startOnTimeLine = timeLine.findIndex(item => {
    const startDate = new Date(rowInfo.Start);

    return String(item) === String(startDate);
  });

  const [start, setStart] = useState(startOnTimeLine);
  const [duration, setDuration] = useState(
    getDateList(new Date(rowInfo.Start), new Date(rowInfo.End)),
  );

  return (
    <div className='gantt-row'>
      <div className='gantt-row__task-name'>
        { rowInfo.Key }
      </div>
      <div
        className='gantt-row__task-timeline'
        style={{
          width: (51 * timeLine.length) - 1,
        }}
      >
        <div
          style={{
            width: (51 * duration.length) - 1,
            marginLeft: 51 * start,
          }}
          className='gantt-row__task-duration'
        />
      </div>
    </div>
  );
};

export default Row;

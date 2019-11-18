import React, { useState, useEffect, useRef } from 'react';
import { ARCASocket, State } from 'arca-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { getDateList } from '../../../utils';
import './Row.less';

interface RowProps {
  socket: ARCASocket,
  rowInfo: State['Source']['AAU-Tasks-Gantt']['Rows'][0],
  timeLine: Array<Date>,
}

const Row: React.FunctionComponent<RowProps> = ({
  socket, rowInfo, timeLine,
}) => {
  const rowRef = useRef(null);

  const startOnTimeLine = timeLine.findIndex(item => {
    const startDate = new Date(rowInfo.Start);

    return String(item) === String(startDate);
  });

  const [start, setStart] = useState(startOnTimeLine);
  const [duration, setDuration] = useState(
    getDateList(new Date(rowInfo.Start), new Date(rowInfo.End)),
  );

  // const onDrag = (event: React.DragEvent) => {
  //   console.log(event.nativeEvent.x);
  //   console.log(rowRef.current);
  //   if (event.nativeEvent.x !== 0) {
  //     setX(event.nativeEvent.x);
  //     socket.Update('AAU-Tasks-Gantt', {
  //       Key: "1.4.2",
  //       Constraint: "Level 3",
  //       Start: "2019-10-16",
  //       End: "2019-10-26",
  //     })
  //   }
  // }

  const [dragStart, setDragStart] = useState(0);

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const block = event.currentTarget;
    const diff = Math.floor(dragStart - event.pageX);

    block.style.transform = `translateX(${0 - diff}px)`;
  }

  const onMouseDown = (event: React.MouseEvent) => {
    setDragStart(event.pageX);
  }

  const onMouseUp = (event: React.MouseEvent) => {
    setDragStart(0);
  }

  const onMouseLeave = (event: React.MouseEvent) => {
    setDragStart(0);
  }

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
        <Tooltip title={(
          <div className='gantt-row__description'>
            <h2>{`key: ${rowInfo.Key}`}</h2>
            <p>{`Constraint: ${rowInfo.Constraint}`}</p>
            <p>{`start: ${rowInfo.Start}`}</p>
            <p>{`end: ${rowInfo.End}`}</p>
          </div>
        )}
        >
          <div
            ref={rowRef}
            style={{
              width: (51 * duration.length) - 1,
              marginLeft: 51 * start,
            }}
            className='gantt-row__task-duration'
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={dragStart ? onMouseMove : () => {}}
            onMouseLeave={onMouseLeave}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Row;

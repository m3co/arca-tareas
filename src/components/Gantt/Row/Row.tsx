import React, { useState, useEffect, useRef } from 'react';
import { ARCASocket, State } from 'arca-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { getDateList } from '../../../utils';
import { getNumberFromString, dateToYYYYMMDD } from '../../../utils/text';
import './Row.less';
import { CELL_WIDTH } from '../../../utils/constant';

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

  const [dragStart, setDragStart] = useState(0);

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const block = event.currentTarget;
    const diff = Math.floor(dragStart - event.pageX);

    block.style.transform = `translateX(${0 - diff}px)`;
  }

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDragStart(event.pageX);
  }

  const onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    const block = event.currentTarget;
    const shiftInDays = Math.round(getNumberFromString(block.style.transform) / CELL_WIDTH);
    const newStart = new Date(rowInfo.Start);
    const newEnd = new Date(rowInfo.End);

    newStart.setDate(newStart.getDate() + shiftInDays);
    newEnd.setDate(newEnd.getDate() + shiftInDays);

    socket.Update('AAU-Tasks-Gantt', {
      Key: rowInfo.Key,
      Constraint: rowInfo.Constraint,
      Start: dateToYYYYMMDD(newStart),
      End: dateToYYYYMMDD(newEnd),
    });

    console.log(dateToYYYYMMDD(newStart));
    console.log(shiftInDays);
    setDragStart(0);
    block.style.transform = 'translateX(0px)';
  }

  const onMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
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
          width: (CELL_WIDTH * timeLine.length) - 1,
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
              width: (CELL_WIDTH * duration.length) - 1,
              marginLeft: CELL_WIDTH * start,
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

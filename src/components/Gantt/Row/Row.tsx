import React, { useRef } from 'react';
import { ARCASocket, State } from 'arca-redux';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import { getDateList } from '../../../utils';
import { getNumberFromString, dateToYYYYMMDD } from '../../../utils/text';
import './Row.less';
import { CELL_WIDTH } from '../../../utils/constant';
import EditModal from './components/EditModal';

interface RowProps {
  socket: ARCASocket,
  rowInfo: State['Source']['AAU-Tasks-Gantt']['Rows'][0],
  timeLine: Array<Date>,
  fieldsInfo: State['Source']['AAU-Tasks-Gantt']['Info']['Fields'],
}

const Row: React.FunctionComponent<RowProps> = ({
  socket, rowInfo, timeLine, fieldsInfo,
}) => {
  const rowRef = useRef(null);
  const durationTask = getDateList(new Date(rowInfo.Start), new Date(rowInfo.End));

  const startOnTimeLine = timeLine.findIndex(item => {
    const startDate = new Date(rowInfo.Start);

    return String(item) === String(startDate);
  });

  const onMouseMove = (event: MouseEvent) => {
    const diff = Math.floor(Number(window.name) - event.pageX);

    rowRef.current.style.transform = `translateX(${0 - diff}px)`;
  };

  const onMouseUp = () => {
    const block = rowRef.current;
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

    window.name = '0';
    block.style.transform = 'translateX(0px)';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    window.name = String(event.pageX);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className='gantt-row'>
      <div className='gantt-row__task-name'>
        { rowInfo.Key }
        <EditIcon className='gantt-row__edit-button' onClick={handleOpen} />
        <Modal
          open={open}
          onClose={handleClose}
          className='gantt-row__edit-modal-wrapper'
        >
          <EditModal
            rowInfo={rowInfo}
            socket={socket}
            handleClose={handleClose}
            fieldsInfo={fieldsInfo}
          />
        </Modal>
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
            <p>{`Description: ${rowInfo.Description}`}</p>
            <p>{`Unit: ${rowInfo.Unit}`}</p>
            <p>{`start: ${rowInfo.Start}`}</p>
            <p>{`end: ${rowInfo.End}`}</p>
          </div>
        )}
        >
          <div
            role='presentation'
            ref={rowRef}
            style={{
              width: (CELL_WIDTH * durationTask.length) - 1,
              marginLeft: CELL_WIDTH * startOnTimeLine,
            }}
            className='gantt-row__task-duration'
            onMouseDown={onMouseDown}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Row;

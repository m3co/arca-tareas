import React, { useRef } from 'react';
import { ARCASocket, State } from 'arca-redux';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import { getDateList } from '../../../utils';
import { getNumberFromString, dateToYYYYMMDD, strTemplateBySeparator, getPointOnTimeline } from '../../../utils/text';
import './Row.less';
import { CELL_WIDTH, SANDAY, SATURDAY  } from '../../../utils/constant';
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

  const startOnTimeLine = getPointOnTimeline(timeLine, new Date(rowInfo.Start));

  const onMouseMove = (event: MouseEvent) => {
    const diff = Math.floor(Number(window.name) - event.pageX);

    rowRef.current.style.transform = `translateX(${0 - diff}px)`;
  };

  const onMouseUp = () => {
    const block = rowRef.current;
    const shiftInDays = Math.round(getNumberFromString(block.style.transform) / CELL_WIDTH);
    const newStart = new Date(rowInfo.Start);

    newStart.setDate(newStart.getDate() + shiftInDays);

    socket.Update('AAU-Tasks-Gantt', {
      ...rowInfo,
      Start: dateToYYYYMMDD(newStart),
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
        <EditIcon className='gantt-row__edit-button' onClick={handleOpen} color='action' />
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
        <div className='gantt-row__task-title'>
          <span>{ rowInfo.Key }</span>
          { rowInfo.Constraint && <span>{ rowInfo.Constraint }</span>}
        </div>
      </div>
      <div
        className='gantt-row__task-timeline'
        style={{
          width: (CELL_WIDTH * timeLine.length) - 1,
        }}
      >
        <Tooltip title={(
          <div className='gantt-row__description'>
            <p>{strTemplateBySeparator(' ', rowInfo.Key, String(rowInfo.Constraint))}</p>
            <p>{strTemplateBySeparator(', ', String(rowInfo.Description), String(rowInfo.Unit))}</p>
            <p>{`${rowInfo.Start} - ${rowInfo.End}`}</p>
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
          {
            durationTask.reduce((weekEndsList, day) => {
              const dayWeek = day.getDay();

              if (dayWeek === SANDAY || dayWeek === SATURDAY) {
                weekEndsList.push(
                  <div
                    className='gantt-row__weekend'
                    style={{
                      left: (CELL_WIDTH * getPointOnTimeline(timeLine, day)) - 1,
                    }}
                  />
                );
              }

              return weekEndsList;
            }, [])
          }
      </div>
    </div>
  );
};

export default Row;

import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import EditModal from './EditModal';

interface TaskNameProps {
  socket: ARCASocket,
  rowInfo: State['Source']['AAU-Tasks-Gantt']['Rows'][0],
  fieldsInfo: State['Source']['AAU-Tasks-Gantt']['Info']['Fields'],
}

const TaskName: React.FunctionComponent<TaskNameProps> = ({
  socket, rowInfo, fieldsInfo,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className='gantt-leftbar__task-name'>
      <EditIcon className='gantt-leftbar__edit-button' onClick={handleOpen} color='action' />
      <Modal
        open={open}
        onClose={handleClose}
        className='gantt-leftbar__edit-modal-wrapper'
      >
        <EditModal
          rowInfo={rowInfo}
          socket={socket}
          handleClose={handleClose}
          fieldsInfo={fieldsInfo}
        />
      </Modal>
      <div className='gantt-leftbar__task-title'>
        <span>{ rowInfo.Key }</span>
        { rowInfo.Constraint && <span>{ rowInfo.Constraint }</span>}
      </div>
    </div>
  );
};

export default TaskName;

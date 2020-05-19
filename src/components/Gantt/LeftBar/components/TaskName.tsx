import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import Modal from '@material-ui/core/Modal';
import EditIcon from '@material-ui/icons/Edit';
import { Tooltip } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
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
      <div className='gantt-leftbar__key'>
        <EditIcon className='gantt-leftbar__edit-button' onClick={handleOpen} color='action' />
        <Modal
          open={open}
          onClose={handleClose}
          className='gantt-leftbar__edit-modal-wrapper'
        >
          <DialogContent className='gantt-leftbar__edit-modal-dialog'>
            <EditModal
              rowInfo={rowInfo}
              socket={socket}
              handleClose={handleClose}
              fieldsInfo={fieldsInfo}
            />
          </DialogContent>
        </Modal>
        { rowInfo.Key }
      </div>
      <div className='gantt-leftbar__constraint'>
        { rowInfo.Constraint }
      </div>
      <Tooltip
        title={rowInfo.Description}
      >
        <div className='gantt-leftbar__description'>
          { rowInfo.Description }
        </div>
      </Tooltip>
      <div className='gantt-leftbar__unit'>
        { rowInfo.Unit }
      </div>
    </div>
  );
};

export default TaskName;

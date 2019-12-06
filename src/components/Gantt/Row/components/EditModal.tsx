import React, { useState } from 'react';
import { ARCASocket, State } from 'arca-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

interface EditModalProps {
  socket: ARCASocket,
  rowInfo: State['Source']['AAU-Tasks-Gantt']['Rows'][0],
  fieldsInfo: State['Source']['AAU-Tasks-Gantt']['Info']['Fields'],
  handleClose: () => void,
}

const EditModal: React.FunctionComponent<EditModalProps> = ({
  socket, rowInfo, fieldsInfo, handleClose,
}) => {
  const [values, setValues] = useState(rowInfo);
  const onChangeValues = (field: keyof State['Source']['AAU-Tasks-Gantt']['Rows'][0]) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [field]: event.target.value,
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    socket.Update('AAU-Tasks-Gantt', values);
    handleClose();
  };


  return (
    <div className='gantt-row__edit-modal'>
      <form onSubmit={onSubmit} className='gantt-row__edit-modal-form'>
        {
          Object.keys(rowInfo).reduce((list, field) => {
            const currentFieldInfo = fieldsInfo.find(item => item.Name === field);
            const fieldValue = currentFieldInfo.Name as keyof State['Source']['AAU-Tasks-Gantt']['Rows'][0];

            if (currentFieldInfo.Editable) {
              list.push(
                <TextField
                  className='gantt-row__edit-modal-field'
                  key={fieldValue}
                  value={String(values[fieldValue])}
                  label={fieldValue}
                  onChange={onChangeValues(fieldValue)}
                />,
              );
            }

            return list;
          }, [])
        }
        <Button
          variant='contained'
          color='inherit'
          type='submit'
          size='small'
          className='gantt-row__edit-modal-submit'
        >
          Send
        </Button>
        <Button
          variant='outlined'
          onClick={handleClose}
          size='small'
          className='gantt-row__edit-modal-cancel'
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default EditModal;

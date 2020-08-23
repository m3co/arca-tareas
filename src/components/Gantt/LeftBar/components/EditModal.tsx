import React, { useState } from 'react';
import { State } from 'arca-redux-v4';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { socket } from '../../../../redux/store';
import { strTemplateBySeparator } from '../../../../utils/text';

interface EditModalProps {
  rowInfo: State['Source']['AAU-Tasks-Gantt'][0],
  handleClose: () => void,
  currentType: string,
}

const EditModal: React.FunctionComponent<EditModalProps> = React.forwardRef(({
  rowInfo, handleClose, currentType,
}, ref: React.Ref<HTMLDivElement>) => {
  const [values, setValues] = useState(rowInfo);
  const onChangeValues = (field: keyof State['Source']['AAU-Tasks-Gantt'][0]) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [field]: event.target.value,
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    switch (currentType) {
      case 'AAU':
        socket.update('AAU-Tasks-Gantt', values, values);
        break;
      case 'APU':
        socket.update('APU-Tasks-Gantt', values, values);
        break;
      default:
        break;
    }
    handleClose();
  };


  return (
    <div className='gantt-leftbar__edit-modal' ref={ref}>
      <form onSubmit={onSubmit} className='gantt-leftbar__edit-modal-form'>
        <Typography
          variant='h6'
          component='h2'
          className='gantt-leftbar__edit-modal-title'
        >
          {strTemplateBySeparator(' ', rowInfo.Key, String(rowInfo.Constraint))}
        </Typography>
        {
          Object.keys(rowInfo).reduce((list, field: keyof typeof rowInfo) => {
            list.push(
              <TextField
                className='gantt-leftbar__edit-modal-field'
                key={field}
                value={String(values[field])}
                label={field}
                onChange={onChangeValues(field)}
              />,
            );

            return list;
          }, [])
        }
        <Button
          variant='contained'
          color='inherit'
          type='submit'
          size='small'
          className='gantt-leftbar__edit-modal-submit'
        >
          Send
        </Button>
        <Button
          variant='outlined'
          onClick={handleClose}
          size='small'
          className='gantt-leftbar__edit-modal-cancel'
        >
          Cancel
        </Button>
      </form>
    </div>
  );
});

export default EditModal;

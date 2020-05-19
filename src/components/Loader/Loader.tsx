import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import './Loader.less';

const Loader: React.FunctionComponent = () => (
  <div className='loader-wrap'>
    <div className='loader'>
      <div className='loader__logo' />
      <h1>Arca Gantt</h1>
      <LinearProgress />
    </div>
  </div>
);

export default Loader;

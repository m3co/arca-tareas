import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'typeface-roboto';
import App from './App/App';
import { store, socket } from './redux/store';
import './less/index.less';

render(
  <Provider store={store}>
    <App socket={socket} />
  </Provider>,
  document.getElementById('root'),
);

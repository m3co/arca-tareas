import React from 'react';
import { render } from 'react-dom';
import { ARCASocket, reducer } from 'arca-redux';
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import 'typeface-roboto';
import App from './App/App';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const socket = new ARCASocket(store);

render(
  <Provider store={store}>
    <App socket={socket} />
  </Provider>,
  document.getElementById('root'),
);

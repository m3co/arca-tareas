import React from 'react';
import { ARCASocket } from 'arca-redux';

interface AppProps {
  socket: ARCASocket,
}

const App: React.FunctionComponent<AppProps> = ({
  socket
}) => {
  socket.store.subscribe(() => {});
  socket.Select('AAU-Tasks-Gantt');
  socket.GetInfo('AAU-Tasks-Gantt');
  socket.Subscribe('AAU-Tasks-Gantt');

  return (
    <p>Gantt is here</p>
  )
}

export default App;

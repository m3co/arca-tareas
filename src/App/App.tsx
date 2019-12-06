import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import Gantt from '../components/Gantt/Gantt';

interface AppProps {
  socket: ARCASocket,
}

interface AppState {
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
  fieldsInfo: State['Source']['AAU-Tasks-Gantt']['Info'],
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      ganttInfo: null,
      fieldsInfo: null,
    };

    props.socket.store.subscribe(() => {
      const state = props.socket.store.getState();
      this.setState({
        ganttInfo: state.Source['AAU-Tasks-Gantt'],
        fieldsInfo: state.Source['AAU-Tasks-Gantt'].Info,
      });
    });

    props.socket.Select('AAU-Tasks-Gantt');
    props.socket.GetInfo('AAU-Tasks-Gantt');
    props.socket.Subscribe('AAU-Tasks-Gantt');
  }

  render() {
    const { ganttInfo, fieldsInfo } = this.state;
    const { socket } = this.props;

    return (
      ganttInfo && ganttInfo.Rows.length && fieldsInfo
        ? <Gantt ganttInfo={ganttInfo} socket={socket} fieldsInfo={fieldsInfo.Fields} />
        : <p>Loading...</p>
    );
  }
}

export default App;

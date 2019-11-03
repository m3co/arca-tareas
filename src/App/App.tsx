import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import Gantt from '../components/Gantt/Gantt';

interface AppProps {
  socket: ARCASocket,
}

interface AppState {
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      ganttInfo: null,
    };

    props.socket.store.subscribe(() => {
      const state = props.socket.store.getState();
      this.setState({
        ganttInfo: state.Source['AAU-Tasks-Gantt'],
      });
    });

    props.socket.Select('AAU-Tasks-Gantt');
    props.socket.GetInfo('AAU-Tasks-Gantt');
    props.socket.Subscribe('AAU-Tasks-Gantt');
  }

  render() {
    const { ganttInfo } = this.state;

    return (
      <div className='outer'>
        <div className='inner'>
          <Gantt ganttInfo={ganttInfo} />
        </div>
      </div>
    );
  }
}

export default App;

import React from 'react';
import { ARCASocket, State } from 'arca-redux';
import Gantt from '../components/Gantt/Gantt';
import Loader from '../components/Loader/Loader';
import StartPage from '../components/StartPage/StartPage';

interface AppProps {
  socket: ARCASocket,
}

interface AppState {
  projects: State['Source']['Projects']['Rows'],
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
  fieldsInfo: State['Source']['AAU-Tasks-Gantt']['Info'],
  currentProject: number,
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      projects: [],
      ganttInfo: null,
      fieldsInfo: null,
      currentProject: 0,
    };

    props.socket.store.subscribe(() => {
      const state = props.socket.store.getState();

      this.setState({
        ganttInfo: state.Source['AAU-Tasks-Gantt'],
        fieldsInfo: state.Source['AAU-Tasks-Gantt'].Info,
        projects: state.Source.Projects.Rows,
      });
    });

    props.socket.Select('Projects');
    props.socket.Subscribe('Projects');
  }

  componentDidMount() {
    const { socket } = this.props;
    const { currentProject } = this.state;

    if (currentProject > 0) {
      socket.Select('AAU-Tasks-Gantt', { Project: currentProject });
    } else {
      socket.Select('AAU-Tasks-Gantt');
    }

    socket.GetInfo('AAU-Tasks-Gantt');
    socket.Subscribe('AAU-Tasks-Gantt');
  }

  setCurrentProject = (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => {
    this.setState({ currentProject: Number(event.target.value) }, () => {
      const { socket } = this.props;
      const { currentProject } = this.state;

      socket.Select('AAU-Tasks-Gantt', { Project: currentProject });
      socket.GetInfo('AAU-Tasks-Gantt');
      socket.Subscribe('AAU-Tasks-Gantt');
    });
  };

  render() {
    const {
      ganttInfo, fieldsInfo, currentProject, projects,
    } = this.state;
    const { socket } = this.props;

    const projectOptions = projects.map(project => ({
      value: project.ID,
      name: project.Name,
    }));

    if (projects.length) {
      if (ganttInfo && ganttInfo.Rows.length && fieldsInfo && currentProject) {
        return (
          <Gantt
            ganttInfo={ganttInfo}
            socket={socket}
            fieldsInfo={fieldsInfo.Fields}
            currentProject={currentProject}
            setCurrentProject={this.setCurrentProject}
            projectOptions={projectOptions}
          />
        );
      }

      return (
        <StartPage
          currentProject={currentProject}
          setCurrentProject={this.setCurrentProject}
          projectOptions={projectOptions}
        />
      );
    }

    return <Loader />;
  }
}

export default App;

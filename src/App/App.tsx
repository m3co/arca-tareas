import React, { useEffect, useState } from 'react';
import { State, getSpecificSource } from 'arca-redux-v4';
import { useSelector } from 'react-redux';
import { Store } from 'redux';
import Gantt from '../components/Gantt/Gantt';
import Loader from '../components/Loader/Loader';
import StartPage from '../components/StartPage/StartPage';
import { socket } from '../redux/store';

const typeOptions = [
  {
    value: 'AAU',
    name: 'AAU',
  },
  {
    value: 'APU',
    name: 'APU',
  },
];

const App: React.FunctionComponent = () => {
  const projects: State['Source']['Projects'] = useSelector((state: Store) => getSpecificSource(state, 'Projects'));
  const ganttInfo = useSelector((state: Store) => getSpecificSource(state, 'AAU-Tasks-Gantt'));
  const ganttAPUInfo = useSelector((state: Store) => getSpecificSource(state, 'APU-Tasks-Gantt'));

  const [curProject, setCurProject] = useState(0);
  const [curType, setCurType] = useState('AAU');

  useEffect(() => {
    socket.select('Projects');
  }, []);

  useEffect(() => {
    if (curProject > 0) {
      switch (curType) {
        case 'AAU':
          socket.select('AAU-Tasks-Gantt', {
            Key: [String(curProject), `${curProject}.%`],
          });
          break;
        case 'APU':
          socket.select('APU-Tasks-Gantt', {
            Key: [String(curProject), `${curProject}.%`],
          });
          break;
        default:
          break;
      }
    }
  }, [curProject, curType]);

  const setCurrentProject = (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => {
    setCurProject(Number(event.target.value));
  };

  const setCurrentType = (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => {
    setCurType(String(event.target.value));
  };

  const projectOptions = projects.map(project => ({
    value: project.ID,
    name: project.Name,
  }));

  if (projects.length) {
    switch (curType) {
      case 'AAU':
        if (ganttInfo && ganttInfo.length && curProject) {
          return (
            <Gantt
              currentType={curType}
              ganttInfo={ganttInfo}
              currentProject={curProject}
              setCurrentProject={setCurrentProject}
              projectOptions={projectOptions}
              setCurrentType={setCurrentType}
              typeOptions={typeOptions}
            />
          );
        }
        break;
      case 'APU':
        if (ganttAPUInfo && ganttAPUInfo.length && curProject) {
          return (
            <Gantt
              currentType={curType}
              ganttInfo={ganttAPUInfo}
              currentProject={curProject}
              setCurrentProject={setCurrentProject}
              projectOptions={projectOptions}
              setCurrentType={setCurrentType}
              typeOptions={typeOptions}
            />
          );
        }
        break;
      default:
        break;
    }

    return (
      <StartPage
        currentProject={curProject}
        setCurrentProject={setCurrentProject}
        projectOptions={projectOptions}

        currentType={curType}
        setCurrentType={setCurrentType}
        typeOptions={typeOptions}
      />
    );
  }

  return <Loader />;
};

export default App;

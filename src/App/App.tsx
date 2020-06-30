import React, { useEffect, useState } from 'react';
import { State, getSpecificSource } from 'arca-redux-v4';
import { useSelector } from 'react-redux';
import { Store } from 'redux';
import Gantt from '../components/Gantt/Gantt';
import Loader from '../components/Loader/Loader';
import StartPage from '../components/StartPage/StartPage';
import { socket } from '../redux/store';

const App: React.FunctionComponent = () => {
  const projects: State['Source']['Projects'] = useSelector((state: Store) => getSpecificSource(state, 'Projects'));
  const ganttInfo = useSelector((state: Store) => getSpecificSource(state, 'AAU-Tasks-Gantt'));

  const [curProject, setCurProject] = useState(0);

  useEffect(() => {
    socket.select('Projects');
  }, []);

  useEffect(() => {
    if (curProject > 0) {
      socket.select('AAU-Tasks-Gantt', {
        Key: [String(curProject), `${curProject}.%`],
      });
    }
  }, [curProject]);

  const setCurrentProject = (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => {
    setCurProject(Number(event.target.value));
  };

  const projectOptions = projects.map(project => ({
    value: project.ID,
    name: project.Name,
  }));

  if (projects.length) {
    if (ganttInfo && ganttInfo.length && curProject) {
      return (
        <Gantt
          ganttInfo={ganttInfo}
          currentProject={curProject}
          setCurrentProject={setCurrentProject}
          projectOptions={projectOptions}
        />
      );
    }

    return (
      <StartPage
        currentProject={curProject}
        setCurrentProject={setCurrentProject}
        projectOptions={projectOptions}
      />
    );
  }

  return <Loader />;
};

export default App;

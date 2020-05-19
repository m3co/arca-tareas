import React from 'react';
import { Typography } from '@material-ui/core';
import ProjectSelect from '../ProjectSelect/ProjectSelect';
import './TopBar.less';

interface TopBarProps {
  currentProject: number,
  setCurrentProject: (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => void,
  projectOptions: Array<{ name: number | string; value: number }>,
}

const TopBar: React.FunctionComponent<TopBarProps> = ({
  currentProject, setCurrentProject, projectOptions,
}) => (
  <div className='gantt-top-bar'>
    <Typography component='h1' variant='h6'>
      Arca Gantt
    </Typography>
    <ProjectSelect
      currentProject={currentProject}
      onChange={setCurrentProject}
      options={projectOptions}
    />
  </div>
);

export default TopBar;

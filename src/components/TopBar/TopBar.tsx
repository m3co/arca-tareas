import React from 'react';
import { Typography } from '@material-ui/core';
import ProjectSelect from '../ProjectSelect/ProjectSelect';
import './TopBar.less';

interface TopBarProps {
  currentProject: number,
  setCurrentProject: (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => void,
  projectOptions: Array<{ name: number | string; value: number }>,
  currentType: string;
  setCurrentType: (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => void,
  typeOptions: Array<{ name: number | string; value: string }>,
}

const TopBar: React.FunctionComponent<TopBarProps> = ({
  currentProject, setCurrentProject, projectOptions, currentType, setCurrentType, typeOptions,
}) => (
  <div className='gantt-top-bar'>
    <Typography component='h1' variant='h6'>
      Arca Gantt
    </Typography>
    <div className='gantt-top-bar__selects'>
      <ProjectSelect
        currentProject={currentProject}
        onChange={setCurrentProject}
        options={projectOptions}
      />
      <ProjectSelect
        currentProject={currentType}
        onChange={setCurrentType}
        options={typeOptions}
      />
    </div>
  </div>
);

export default TopBar;

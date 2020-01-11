import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';
import ProjectSelect from '../ProjectSelect/ProjectSelect';
import './StartPage.less';

interface StartPageProps {
  currentProject: number,
  setCurrentProject: (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => void,
  projectOptions: Array<{ name: number | string; value: number }>,
}

const StartPage: React.FunctionComponent<StartPageProps> = ({
  currentProject, setCurrentProject, projectOptions,
}) => (
  <div className='start-page-wrap'>
    <div className='start-page'>
      <div className='start-page__logo' />
      <h1>Arca Gantt</h1>
      <ProjectSelect
        onChange={setCurrentProject}
        currentProject={currentProject}
        options={projectOptions}
      />
      {
        currentProject
          ? (
            <FormHelperText>
              The project is empty, please select another project.
            </FormHelperText>
          )
          : null
      }
    </div>
  </div>
);

export default StartPage;

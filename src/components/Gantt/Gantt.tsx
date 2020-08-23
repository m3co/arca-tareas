import React, { useState, useEffect, useCallback } from 'react';
import { State } from 'arca-redux-v4';
import first from 'lodash/first';
import last from 'lodash/last';
import {
  sortByEnd, sortByStart, getDateList, addDaysToHeadList, addDaysToTailList,
} from '../../utils';
import Header from './Header/Header';
import Row from './Row/Row';
import './Gantt.less';
import { ADDITIONAL_DAYS } from '../../utils/constant';
import LeftBar from './LeftBar/LeftBar';
import TopBar from '../TopBar/TopBar';

type styles = {
  ['margin-left']?: string,
  ['margin-top']?: string,
};

interface GanttProps {
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
  currentProject: number,
  currentType: string,
  setCurrentProject: (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => void,
  projectOptions: Array<{ name: number | string; value: number }>,
  setCurrentType: (event: React.ChangeEvent<{ name?: string, value: unknown, }>) => void,
  typeOptions: Array<{ name: number | string; value: string }>,
}

const Gantt: React.FunctionComponent<GanttProps> = ({
  ganttInfo, currentProject, setCurrentProject, projectOptions, currentType, setCurrentType, typeOptions,
}) => {
  const calcTimeLine = useCallback(() => {
    const sortedDataByEnd = sortByEnd([...ganttInfo]);
    const sortedDataByStart = sortByStart([...ganttInfo]);

    const startDate = new Date(first(sortedDataByStart).Start);
    const endDate = new Date(last(sortedDataByEnd).End);

    return getDateList(startDate, endDate);
  }, [ganttInfo]);

  const [timeLine, setTimeLine] = useState(addDaysToTailList(ADDITIONAL_DAYS, addDaysToHeadList(ADDITIONAL_DAYS, calcTimeLine())));

  useEffect(() => {
    setTimeLine(addDaysToTailList(ADDITIONAL_DAYS, addDaysToHeadList(ADDITIONAL_DAYS, calcTimeLine())));
  }, [calcTimeLine]);

  const onScroll = (event: React.UIEvent<HTMLElement>) => {
    const left = event.currentTarget.scrollLeft;
    const top = event.currentTarget.scrollTop;

    const innerChilds = event.currentTarget.children as HTMLCollection;

    const topPanel = innerChilds[1].children[1] as HTMLElement;
    const topPanelStyles = topPanel.style as styles;

    const leftBar = innerChilds[2].children[0] as HTMLElement;
    const leftBartyles = leftBar.style as styles;

    topPanelStyles['margin-left'] = `${-left + 471}px`;
    leftBartyles['margin-top'] = `${-top + 122}px`;
  };

  const displayGantt = () => (
    <div className='gantt__outer'>
      <div
        className='gantt__inner'
        onScroll={onScroll}
      >
        <TopBar
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
          projectOptions={projectOptions}
          currentType={currentType}
          setCurrentType={setCurrentType}
          typeOptions={typeOptions}
        />
        <Header timeLine={timeLine} />
        <LeftBar ganttInfo={ganttInfo} currentType={currentType} />
        {
          ganttInfo.map((row, index) => (
            <Row
              currentType={currentType}
              rowInfo={row}
              timeLine={timeLine}
              key={`${row.Key + row.Constraint} ${String(index)}`}
            />
          ))
        }
      </div>
    </div>
  );

  return displayGantt();
};

export default Gantt;

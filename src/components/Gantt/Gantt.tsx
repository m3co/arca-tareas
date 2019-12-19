import React, { useState, useEffect, useCallback } from 'react';
import { ARCASocket, State } from 'arca-redux';
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

type styles = {
  ['margin-left']?: string,
  ['margin-top']?: string,
};

interface GanttProps {
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
  socket: ARCASocket,
  fieldsInfo: State['Source']['AAU-Tasks-Gantt']['Info']['Fields'],
}

const Gantt: React.FunctionComponent<GanttProps> = ({
  ganttInfo, socket, fieldsInfo,
}) => {
  const calcTimeLine = useCallback(() => {
    const sortedDataByEnd = sortByEnd([...ganttInfo.Rows]);
    const sortedDataByStart = sortByStart([...ganttInfo.Rows]);

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
    const innerChilds = event.currentTarget.children[0] as HTMLElement;
    const topPanel = innerChilds.children[1] as HTMLElement;
    const topPanelStyles = topPanel.style as styles;

    const top = event.currentTarget.scrollTop;
    const leftBar = event.currentTarget.children[1] as HTMLElement;
    const leftBartyles = leftBar.style as styles;

    topPanelStyles['margin-left'] = `${-left + 230}px`;
    leftBartyles['margin-top'] = `${-top + 90}px`;
  };

  const displayGantt = () => (
    <div className='gantt__outer'>
      <div
        className='gantt__inner'
        onScroll={onScroll}
      >
        <Header timeLine={timeLine} />
        <LeftBar ganttInfo={ganttInfo} socket={socket} fieldsInfo={fieldsInfo} />
        {
          ganttInfo.Rows.map(row => (
            <Row
              rowInfo={row}
              timeLine={timeLine}
              key={row.Key + row.Constraint}
              socket={socket}
              fieldsInfo={fieldsInfo}
            />
          ))
        }
      </div>
    </div>
  );

  return displayGantt();
};

export default Gantt;

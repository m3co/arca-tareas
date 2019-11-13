import React, { useState } from 'react';
import { State } from 'arca-redux';
import first from 'lodash/first';
import last from 'lodash/last';
import {
  sortByEnd, sortByStart, getDateList, addDaysToHeadList, addDaysToTailList,
} from '../../utils';
import Header from './Header/Header';
import Row from './Row/Row';
import './Gantt.less';

interface GanttProps {
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
}

const Gantt: React.FunctionComponent<GanttProps> = ({
  ganttInfo,
}) => {
  const calcTimeLine = () => {
    const sortedDataByEnd = sortByEnd([...ganttInfo.Rows]);
    const sortedDataByStart = sortByStart([...ganttInfo.Rows]);

    const startDate = new Date(first(sortedDataByStart).Start);
    const endDate = new Date(last(sortedDataByEnd).End);

    return getDateList(startDate, endDate);
  };

  const [timeLine, setTimeLine] = useState(addDaysToTailList(3, addDaysToHeadList(3, calcTimeLine())));

  const displayGantt = () => (
    <div className='gantt__outer'>
      <div className='gantt__inner'>
      <Header timeLine={timeLine} />
      {
        ganttInfo.Rows.map(row => (
          <Row rowInfo={row} timeLine={timeLine} key={row.Key + row.Constraint} />
        ))
      }
      </div>
    </div>
  );

  return displayGantt();
};

export default Gantt;

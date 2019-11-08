import React from 'react';
import { State } from 'arca-redux';
import range from 'lodash/range';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { sortByEnd, sortByStart, getDurationTaskInDays } from '../../utils';
import Header from './Header/Header';

interface GanttProps {
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
}

const Gantt: React.FunctionComponent<GanttProps> = ({
  ganttInfo,
}) => {
  const getTableHead = () => {
    const sortedData = sortByEnd([...ganttInfo.Rows]);
    const diff = (Date.parse(String(sortedData[0].End)) - Date.parse(String(sortedData[sortedData.length - 1].End))) / 60000;

    return (
      <TableHead>
        <TableRow>
          <TableCell key='first th' className='fix'>
            tree/days
          </TableCell>
          {
            range(diff / 1440).map(item => (
              <TableCell key={String(item)}>
                {`day ${item}`}
              </TableCell>
            ))
          }
        </TableRow>
      </TableHead>
    )
  }

  const displayGantt = () => {
    const sortedDataByEnd = sortByEnd([...ganttInfo.Rows]);
    const sortedDataByStart = sortByStart([...ganttInfo.Rows]);
    return (
      <React.Fragment>
        <Header startDate={sortedDataByStart[0].Start} endDate={sortedDataByEnd[sortedDataByEnd.length - 1].End} />
        <Table>
          {/* { getTableHead() } */}
          <TableBody>
            {
              ganttInfo.Rows.map((item, id) => {
                const duration = getDurationTaskInDays(item);
                // console.log(duration);
                return (
                  <TableRow key={item.Key + String(id)}>
                    <TableCell className='fix'>
                      {item.Key}
                    </TableCell>
                    {
                      range(duration).map(item => (
                        <TableCell key={item}>
                          X
                        </TableCell>
                      ))
                    }
                  </TableRow>
                )}
              )
            }
          </TableBody>
        </Table>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {
        ganttInfo && ganttInfo.Rows.length ? displayGantt() : null
      }
    </React.Fragment>
  )
};

export default Gantt;

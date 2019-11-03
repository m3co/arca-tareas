import React from 'react';
import { State } from 'arca-redux';
import range from 'lodash/range';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

interface GanttProps {
  ganttInfo: State['Source']['AAU-Tasks-Gantt'],
}

const Gantt: React.FunctionComponent<GanttProps> = ({
  ganttInfo
}) => {
  const getStartDate = (rows: State['Source']['AAU-Tasks-Gantt']['Rows']) =>
    rows.sort((a, b) =>
      Date.parse(String(a.Start)) - Date.parse(String(b.Start)));

  const getEndDate = (rows: State['Source']['AAU-Tasks-Gantt']['Rows']) =>
    rows.sort((a, b) =>
      Date.parse(String(a.End)) - Date.parse(String(b.End)));

  const displayGantt = () => {
    const sortedData = getEndDate(ganttInfo.Rows);
    const diff = (Date.parse(String(sortedData[0].End)) - Date.parse(String(sortedData[sortedData.length - 1].End))) / 60000;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell key='first th' className="fix">
              tree/days
            </TableCell>
            {
              range(diff / 1440).map((item) => (
                <TableCell key={String(item)}>
                  {`day ${item}`}
                </TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            ganttInfo.Rows.map((item, id) => (
              <TableRow key={item.Key + id}>
                <TableCell className="fix">
                  {item.Key}
                </TableCell>
                <TableCell>
                  {Date.parse(String(item.Start))}
                </TableCell>
                <TableCell>
                  {Date.parse(String(item.End))}
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    )
  }

  return ganttInfo && ganttInfo.Rows.length? displayGantt() : null;
}

export default Gantt;

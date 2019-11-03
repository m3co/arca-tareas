import React from 'react';
import { State } from 'arca-redux';
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
  const displayGantt = () => {
    return ganttInfo.Rows.map((item, id) => (
      <TableRow key={String(id)}>
        <TableCell>
          {item.Key}
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <Table>
      <TableBody>
        { ganttInfo ? displayGantt() : null }
      </TableBody>
    </Table>
  )
}



export default Gantt;

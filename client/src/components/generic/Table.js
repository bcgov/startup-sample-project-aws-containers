import React from 'react';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Skeleton from '@material-ui/lab/Skeleton';
import { withStyles } from '@material-ui/core/styles';

import { Card } from './Card';

const StyledTableCell = withStyles((theme) => ({
  head: {
    ...theme.typography.body1,
    backgroundColor: theme.palette.common.white,
    color: '#333333',
  },
  body: {
    ...theme.typography.body1,
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-child(1)': {
      borderTop: `2px solid ${theme.palette.secondary.main}`
    },
    '&:nth-of-type(odd)': {
      backgroundColor: '#FAFAFA',
    },
  },
}))(TableRow);

const Table = ({ columns, rows, isLoading }) => {
  return (
    <Card noPadding>
      <MuiTable>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <StyledTableCell key={index}>{column}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? [...Array(8)].map((_, i) => (
            <StyledTableRow key={i}>
              {[...Array(columns.length)].map((_, i) => (
                <StyledTableCell key={i}><Skeleton animation="wave" /></StyledTableCell>
              ))}
            </StyledTableRow>
          )) : rows.map((row, index) => (
            <StyledTableRow key={index}>
              {Object.keys(row).map((key) => (
                <StyledTableCell key={key}>{row[key]}</StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </MuiTable>
    </Card>
  );
};

export { Table };

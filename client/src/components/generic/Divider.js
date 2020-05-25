import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  divider: {
    height: '3px',
    backgroundColor: '#E2A014',
    color: '#E2A014',
    borderStyle: 'solid',
  },
}));

const Divider = () => {
  const classes = useStyles();
  return <hr className={classes.divider} />;
};

export { Divider };

import React from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import MuiCard from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0 5px 0 #E5E9F2',
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
  noPadding: {
    padding: 0,
  },
}));

const Card = ({ children, title, noPadding, className, ...props }) => {
  const classes = useStyles();
  return (
    <MuiCard className={classNames(classes.root, { [classes.noPadding]: noPadding }, className)} {...props}>
      {title && <Typography className={classes.title} variant="h3" noWrap>{title}</Typography>}
      {children}
    </MuiCard>
  )
};

export { Card };

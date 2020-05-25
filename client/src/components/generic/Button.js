import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    height: '42px',
  },
  small: {
    height: '30px',
    fontSize: '13px',
    lineHeight: '16px',
  },
  large: {
    height: '52px',
  },
}));

const Button = ({
  text,
  loading,
  disabled,
  ...props
}) => {
  const classes = useStyles();
  return (
    <MuiButton
      classes={{ root: classes.root, sizeSmall: classes.small, sizeLarge: classes.large }}
      disabled={loading || disabled}
      variant="contained"
      color="primary"
      fullWidth
      {...props}
    >
      {loading ? <CircularProgress size={24} /> : text}
    </MuiButton>
  )
};

export { Button };

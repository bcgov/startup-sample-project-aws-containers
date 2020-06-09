import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { Card } from '../generic';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '123px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    height: '48px',
    marginRight: theme.spacing(2),
  },
}));

const SubmissionInfo = ({ id, lastest_greeting}) => {
  const classes = useStyles();
  return (
    <Grid container spacing={4}>
      <Grid xs={12} md={6} item>
        <Card className={classes.card}>
          <div>
            <Typography component="p" align="center" variant="overline" paragraph>Greeting Selection</Typography>
            <Typography align="center" variant="h1" color="primary">{id}</Typography>
          </div>
        </Card>
      </Grid>
      <Grid xs={12} md={6} item>
        <Card className={classes.card}>
          <Typography variant="subtitle2" color="textSecondary">{lastest_greeting}</Typography>
        </Card>
      </Grid>
    </Grid>
  );
};

export { SubmissionInfo };

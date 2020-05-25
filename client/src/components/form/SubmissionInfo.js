import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import PlanPass from '../../assets/images/icon_isolation_pass.svg';
import PlanFail from '../../assets/images/icon_isolation_fail.svg';

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

const SubmissionInfo = ({ id, isolationPlanStatus, isPdf = false }) => {
  const classes = useStyles();
  return (
    <Grid container spacing={4}>
      <Grid xs={12} md={6} item>
        <Card className={classes.card}>
          <div>
            <Typography component="p" align="center" variant="overline" paragraph>Confirmation Number</Typography>
            <Typography align="center" variant="h1" color="primary">{id}</Typography>
          </div>
        </Card>
      </Grid>
      {!isPdf && (
        <Grid xs={12} md={6} item>
          <Card className={classes.card}>
            <img
              className={classes.statusIcon}
              src={isolationPlanStatus ? PlanPass : PlanFail}
              alt="Isolation plan accepted or failed"
            />
            <Typography variant="subtitle2" color="textSecondary">Isolation Plan Status</Typography>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export { SubmissionInfo };

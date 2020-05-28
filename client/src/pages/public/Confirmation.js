import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';

import PlanPass from '../../assets/images/icon_isolation_pass.svg';
import PlanFail from '../../assets/images/icon_isolation_fail_white.svg';

import { Page } from '../../components/generic';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
}));

export default ({ location: { state } }) => {

  const classes = useStyles();
  const { id } = state || { id: null };

  useEffect(() => {
    // Snowplow goes here
  });

  return (
    <Page>
      <Grid className={classes.root} style={{ margin: "0 1rem" }} container justify="center">
        {
          (!id) ? (
            <Grid item xs={12} sm={12} md={10} lg={8} xl={8}>
              <Box margin="2rem 0">
                <Typography variant="h4">
                  No submission detected, please create a new submission.
                </Typography>
              </Box>
            </Grid>
          ) : <Grid item xs={12} sm={12} md={10} lg={8} xl={8}>
            <Box margin="2rem 0">
              <Typography variant="h6">
                Thank you. Your form has been submitted.
              </Typography>
            </Box>
          </Grid>
        }
      </Grid>
    </Page>
  )
}

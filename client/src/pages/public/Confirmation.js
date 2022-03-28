import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Page } from '../../components/generic';
import { Button } from '../../components/generic';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
  },
}));

export default ({ location: { state } }) => {

  const classes = useStyles();
  const { id, greeting } = state || { id: null };

  useEffect(() => {
    console.log(state)
  }, []);

  return (
    <Page>
      <Grid className={classes.root} style={{ margin: "0 1rem" }} container justify="center">
        {
          (!id) ? (
            <Grid item xs={12} sm={12} md={10} lg={8} xl={8}>
              <Box margin="2rem 0">
                <Typography variant="h4">
                  No submission detected, please choose a new greeting.
                </Typography>
              </Box>
            </Grid>
          ) : <Grid item xs={12} sm={12} md={10} lg={8} xl={8}>
            <Box margin="2rem 0" pt={8}>
              <Typography variant="h2" id="selectedGreeting">
                {greeting || 'Image Uploaded Successfully'}!
              </Typography>
            </Box>
          </Grid>
        }
        <Grid item xs={12} sm={12} md={10} lg={8} xl={8} container justify="center">
          <Grid item xs={4}>
            <Button
              id="submitButtonConfirmation_js"
              type="submit"
              disabled={false}
              size="large"
              href="/" 
              text="Return to Greeting Selection"
            />
          </Grid>
        </Grid>
      </Grid>
    </Page>
  )
}

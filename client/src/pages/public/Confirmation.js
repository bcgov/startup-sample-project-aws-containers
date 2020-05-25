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
  const { id, isolationPlanStatus } = state || { id: null };

  useEffect(() => {
    window.snowplow('trackSelfDescribingEvent', {
      schema: 'iglu:ca.bc.gov.enhanced_travel/results/jsonschema/1-0-0',
        data: {
          status: isolationPlanStatus? 'success': 'fail',
          confirmation_code: id
        }
      }
    );
  });

  // const genPDF = async () => {
  //   const response = await fetch(`/api/v1/pdf`, {
  //     headers: {
  //       'Accept': 'application/pdf',
  //       'Content-type': 'application/json',
  //     },
  //     method: 'POST',
  //     body: JSON.stringify({ id, accessToken })
  //   });
  //   if (response.ok) {
  //     const blob = await response.blob()
  //     const pdfBlob = new Blob([blob], {type: "application/pdf"})
  //     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
  //       window.navigator.msSaveOrOpenBlob(pdfBlob);
  //       return;
  //     }
  //     // For other browsers:
  //     // Create a link pointing to the ObjectURL containing the blob.
  //     const data = window.URL.createObjectURL(pdfBlob);
  //     const link = document.createElement('a');
  //     link.href = data;
  //     link.download = `screeningReport-${id}.pdf`;
  //     link.click();
  //     setTimeout(function(){
  //       // For Firefox it is necessary to delay revoking the ObjectURL
  //       window.URL.revokeObjectURL(data);
  //     }, 100);
  //   }
  // }

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
              <Typography variant="h6">
                DO NOT CLOSE THIS PAGE.
              </Typography>
            </Box>
            <Card variant="outlined">
              <CardContent>
                <Grid container>
                  <Grid item xs={12}>
                    <Box padding="0" paddingTop="0">
                      <Typography variant="h5">
                        Proceed to the provincial check point, if available at your location, where you may be asked to confirm how you will comply with the provincial order to self isolate.
                      </Typography>
                      <Typography variant="subtitle1">
                        You may be asked to present your confirmation number.
                      </Typography>
                    </Box>
                  </Grid>
                  <Hidden smDown>
                    <Grid item md={3}></Grid>
                  </Hidden>
                  <Grid item xs={12} md={6}>
                    {
                      isolationPlanStatus
                        ?
                          <Card style={{ margin: "15px" }}>
                            <CardContent>
                              <Typography variant="subtitle1">Confirmation Number</Typography>
                              <Typography variant="h2" style={{ color: "#16C92E" }}>
                                {id}
                              </Typography>
                              <Grid container style={{ marginTop: "1rem" }}>
                                {/* <Grid item xs={6}>
                                  <img src={Health} alt="health status" />
                                  <Typography variant="subtitle1">Health Status Complete</Typography>
                                </Grid> */}
                                <Grid item xs={12}>
                                  <img src={PlanPass} alt="Isolation plan" style={{ width: "128px"}} />
                                  <Typography variant="subtitle1" style={{ marginTop: "0.5rem" }}>Isolation Plan Status</Typography>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        :
                        <Card style={{ margin: '15px', color: 'white', backgroundColor: '#002C71' }}>
                          <CardContent>
                            <Typography variant="subtitle1" style={{ marginTop: "16px", color: 'white' }}>Confirmation Number</Typography>
                            <Typography variant="h2" style={{ color: 'white' }}>
                              {id}
                            </Typography>
                            <Grid container style={{ marginTop: "1rem" }}>
                              {/* <Grid item xs={6}>
                                <img src={Health} alt="health status" />
                                <Typography variant="subtitle1">Health Status Complete</Typography>
                              </Grid> */}
                              <Grid item xs={12}>
                                <img src={PlanFail} alt="Isolation plan" style={{ width: "128px" }} />
                                <Typography variant="subtitle1" style={{ marginTop: "16px", color: 'white' }}>Isolation Plan Status</Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                    }
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        }
      </Grid>
    </Page>
  )
}

import React, { Fragment } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { Card, Button } from '../generic';

const useStyles = makeStyles(() => ({
  list: {
    listStyle: 'none',
    padding: 0,
  },
}));

const Contact = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Card>
        <Box textAlign="center" padding="1rem">
          <Typography variant="subtitle1" gutterBottom>
            Need Assistance?
          </Typography>

          <Typography variant="body1" gutterBottom>
            Need help with your self isolation plan? Talk to a Service BC agent
          </Typography>

          <ul className={classes.list}>
            <li>Child Care</li>
            <li>Travel restrictions</li>
            <li>Business and funding support</li>
          </ul>

          <Typography variant="body2" paragraph>
            <b>Service is available 7:30am to 8pm Pacific Time</b>
          </Typography>


          <Box mb={2}>
            <Typography variant="body2" gutterBottom>
              <b>International</b>
            </Typography>
            <Button
              variant="outlined"
              fullWidth={false}
              text={<Link href="tel:+16044120957">1-604-412-0957</Link>}
            />
          </Box>

          <Box mb={2}>
            <Typography variant="body2" gutterBottom>
              <b>Within Canada</b>
            </Typography>
            <Grid container justify="center" spacing={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  fullWidth={false}
                  text={(
                    <Fragment>
                      Text&nbsp;<Link href="sms:+16046300300">1-604-630-0300</Link>
                    </Fragment>
                  )}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  fullWidth={false}
                  text={(
                    <Fragment>
                      Call&nbsp;<Link href="tel:+1888COVID19">1-888-COVID19</Link>
                    </Fragment>
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Typography variant="body2" paragraph>
            <Link href="tel:+18882684319">(1-888-268-4319)</Link>
          </Typography>

          <Typography variant="body2" paragraph>
            Standard message and data rates may apply.
          </Typography>

          <hr />
          <Box mt={2} mb={2}>
            <Typography variant="body2" gutterBottom>
              <b>Telephone for the Deaf</b>
            </Typography>
            <Button
              variant="outlined"
              fullWidth={false}
              text={<Link href="tel:+711">Across B.C. Dial 711</Link>}
            />
          </Box>
          <hr />

          <Typography variant="body2" paragraph>
            <b>Translation Services</b>
          </Typography>

          <Typography variant="body2" paragraph>
            Available in more than 110+ languages, including
          </Typography>

          <ul className={classes.list}>
            <li>翻譯服務</li>
            <li>翻译服务 </li>
            <li>ਅਨੁਵਾਦਸਰਵਿਸਿਜ</li>
            <li> خدمات  ت  رج  م  ه؟</li>
            <li>Services de traduction </li>
            <li>Servicios de traducción</li>
          </ul>

          <Typography variant="body2" paragraph>
            <b>Service is available 7:30 am to 8 pm Pacific Time</b>
          </Typography>

          <Button
            variant="outlined"
            fullWidth={false}
            text={(
              <Fragment>
                Call&nbsp;<Link href="tel:+18882684319">1-888-268-4319</Link>
              </Fragment>
            )}
          />
        </Box>
      </Card>
    </Fragment>
  );
};

export { Contact };

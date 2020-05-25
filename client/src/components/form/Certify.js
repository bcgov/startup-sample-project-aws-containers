import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Field, useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';

import { Button } from '../generic';
import { RenderCheckbox } from '../fields';

const useStyles = makeStyles((theme) => ({
  line: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderTop: '2px solid rgb(204, 204, 204)',
  },
}));

const Certify = ({ submitLoading, submitError }) => {
  const { values } = useFormikContext();
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <hr className={classes.line} />
      <Grid container spacing={2}>

        {/** Certify */}
        <Grid item xs={12}>
          <Field
            name="certified"
            component={RenderCheckbox}
            label="I certify this to be accurate."
          />
        </Grid>

        {/** Disclaimer */}
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            <b>Collection Notice</b>
          </Typography>
          <Typography variant="body2" paragraph>
            Your personal information as well as those of your household is collected by the Ministry
            of Health under the authority of sections 26(a), (c), (e) and s.27(1)(a)(iii) of the
            Freedom of Information and Protection of Privacy Act, the Public Health Act and the
            federal Quarantine Act, for the purposes of reducing the spread of COVID-19. Personal
            information may be shared with personnel providing support services and follow-up during
            self-isolation. Should you have any questions or concerns about the collection of your
            personal information please contact:
          </Typography>
          <Typography variant="body2" paragraph>
            Title: Ministry of Health, Chief Privacy Officer
          </Typography>
          <Typography variant="body2" paragraph>
            Telephone: 236-478-1666
          </Typography>
        </Grid>

        {/** Submit */}
        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item xs={8}>
              <Button
                type="submit"
                loading={submitLoading}
                disabled={!values.certified}
                size="large"
                text="Submit"
              />

              {/** Submit Error */}
              {submitError && (
                <Box pt="1rem">
                  <Typography variant="body1" color="error">{submitError}</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export { Certify };

import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { Field, useFormikContext } from 'formik';

import { Divider } from '../generic';
import { RenderSelectField } from '../fields';
import { Button } from '../generic';

const Greeter = ({ isDisabled, submitLoading, submitError }) => {
  const { values } = useFormikContext();
  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>

        {/** Title */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Select your favorite greeting</Typography>
          <Divider />
        </Grid>

        {/** Greeting */}
        <Grid item xs={12} md={6}>
          <Field
            name="greeting"
            component={RenderSelectField}
            label="* Favorite Greeting"
            disabled={isDisabled}
            options={[
              { value: 'Aloha', label: 'Aloha' },
              { value: 'Bonjour', label: 'Bonjour' },
              { value: 'Greetings and salutations', label: 'Greetings and salutations' },
              { value: 'Hello', label: 'Hello' },
              { value: 'Howdy', label: 'Howdy' },
              { value: 'Konichiwa', label: 'Konichiwa' },
            ]}
          />
        </Grid>

        {/** Submit */}
        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item xs={8}>
              <Button
                type="submit"
                loading={submitLoading}
                disabled={'' === values.greeting}
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


export { Greeter };

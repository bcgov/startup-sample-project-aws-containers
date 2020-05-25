import React, { Fragment, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Field, useFormikContext } from 'formik';

import { Divider } from '../generic';
import { RenderCheckboxGroup, RenderRadioGroup, RenderSelectField, RenderTextField } from '../fields';

const SelfIsolationPlan = ({ isDisabled }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values.accomodations === true) {
      if (values.isolationPlan === null) setFieldValue('isolationPlan', { type: '', city: '', address: '' });
    } else {
      setFieldValue('isolationPlan', null);
    }
  }, [setFieldValue, values.accomodations, values.isolationPlan]);

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>

        {/** Title */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Self Isolation Plan</Typography>
          <Divider />
        </Grid>

        {/** Accommodation */}
        <Grid item xs={12}>
          <Field
            name="accomodations"
            component={RenderRadioGroup}
            label="* Do you have accommodations arranged for your self-isolation period?"
            disabled={isDisabled}
            row
            options={[
              { value: true, label: 'Yes' },
              { value: false, label: 'No' },
            ]}
          />
        </Grid>

        {/** Isolation Plan */}
        {values.accomodations === true && (
          <Fragment>
            <Grid item xs={12} md={6}>
              <Field
                name="isolationPlan.type"
                component={RenderSelectField}
                label="* Isolation Type"
                disabled={isDisabled}
                options={[
                  { value: 'private', label: 'Private residence' },
                  { value: 'family', label: 'With family' },
                  { value: 'commercial', label: 'Commercial (hotel)' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                name="isolationPlan.city"
                component={RenderTextField}
                label="* Which city will you be isolating in?"
                disabled={isDisabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                name="isolationPlan.address"
                component={RenderTextField}
                label="* What is the address where you'll be staying?"
                disabled={isDisabled}
              />
            </Grid>
          </Fragment>
        )}

        {/** Accommodation Assistance */}
        <Grid item xs={12}>
          <Field
            name="ableToIsolate"
            component={RenderRadioGroup}
            label="* Do you need accommodation assistance to self-isolate from anyone who is over 60 years old or who has heart disease, high blood pressure, asthma or other lung disease, diabetes, cancer, immune suppression or is taking prednisone medication?"
            disabled={isDisabled}
            row
            options={[
              { value: false, label: 'Yes' },
              { value: true, label: 'No' },
            ]}
          />
        </Grid>

        {/** Arrangements */}
        <Grid item xs={12}>
          <Field
            name="supplies"
            component={RenderRadioGroup}
            label="* Are you able to make the necessary arrangements for your self-isolation period? (e.g. food, medication, child care, cleaning supplies, pet care)."
            disabled={isDisabled}
            row
            options={[
              { value: true, label: 'Yes' },
              { value: false, label: 'No' },
            ]}
          />
        </Grid>

        {/** Transportation */}
        <Grid item xs={12}>
          <Field
            name="transportation"
            component={RenderCheckboxGroup}
            label="What form of transportation will you take to your self-isolation location? (optional)"
            disabled={isDisabled}
            options={[
              { value: 'personal', label: 'Personal vehicle' },
              { value: 'public', label: 'Public transportation' },
              { value: 'taxi', label: 'Taxi or ride share' },
            ]}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export { SelfIsolationPlan };

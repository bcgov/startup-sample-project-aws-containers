import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Field } from 'formik';

import { Divider } from '../generic';
import { RenderDateField, RenderSelectField, RenderTextField } from '../fields';

const PrimaryContactInformation = ({ isDisabled }) => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>

        {/** Title */}
        <Grid item xs={12}>
          <Typography variant="subtitle1">Primary Contact Information</Typography>
          <Divider />
        </Grid>

        {/** First name */}
        <Grid item xs={12} md={6}>
          <Field
            name="firstName"
            component={RenderTextField}
            label="* First name (primary contact)"
            disabled={isDisabled}
          />
        </Grid>

        {/** Last name */}
        <Grid item xs={12} md={6}>
          <Field
            name="lastName"
            component={RenderTextField}
            label="* Last name (primary contact)"
            disabled={isDisabled}
          />
        </Grid>

        {/** Date of Birth */}
        <Grid item xs={12} md={6}>
          <Field
            name="dob"
            component={RenderDateField}
            label="* Date of birth (yyyy/mm/dd)"
            openTo="year"
            disableFuture
            disabled={isDisabled}
          />
        </Grid>

        {/** Phone Number */}
        <Grid item xs={12} md={6}>
          <Field
            name="telephone"
            component={RenderTextField}
            label="* Phone number"
            type="tel"
            disabled={isDisabled}
          />
        </Grid>

        {/** Email */}
        <Grid item xs={12} md={6}>
          <Field
            name="email"
            component={RenderTextField}
            label="Email (optional)"
            disabled={isDisabled}
          />
        </Grid>

        {/** Address */}
        <Grid item xs={12} md={6}>
          <Field
            name="address"
            component={RenderTextField}
            label="* Home address"
            disabled={isDisabled}
          />
        </Grid>

        {/** City */}
        <Grid item xs={12} md={6}>
          <Field
            name="city"
            component={RenderTextField}
            label="* City"
            disabled={isDisabled}
          />
        </Grid>

        {/** Province */}
        <Grid item xs={12} md={6}>
          <Field
            name="province"
            component={RenderSelectField}
            label="* Province / Territory"
            disabled={isDisabled}
            options={[
              { value: 'Alberta', label: 'Alberta' },
              { value: 'British Columbia', label: 'British Columbia' },
              { value: 'Manitoba', label: 'Manitoba' },
              { value: 'New Brunswick', label: 'New Brunswick' },
              { value: 'Newfoundland and Labrador', label: 'Newfoundland and Labrador' },
              { value: 'Northwest Territories', label: 'Northwest Territories' },
              { value: 'Nova Scotia', label: 'Nova Scotia' },
              { value: 'Nunavut', label: 'Nunavut' },
              { value: 'Ontario', label: 'Ontario' },
              { value: 'Prince Edward Island', label: 'Prince Edward Island' },
              { value: 'Québec', label: 'Québec' },
              { value: 'Saskatchewan', label: 'Saskatchewan' },
              { value: 'Yukon', label: 'Yukon' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </Grid>

        {/** Postal Code */}
        <Grid item xs={12} md={6}>
          <Field
            name="postalCode"
            component={RenderTextField}
            label="Postal Code (optional)"
            maxLength={6}
            disabled={isDisabled}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export { PrimaryContactInformation };

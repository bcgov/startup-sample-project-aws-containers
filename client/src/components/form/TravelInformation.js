import React, { Fragment, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Field, FieldArray, useFormikContext } from 'formik';

import { Divider, Card } from '../generic';
import { RenderDateField, RenderRadioGroup, RenderSelectField, RenderTextField } from '../fields';

const TravelInformation = ({ isDisabled }) => {
  const { values, setFieldValue } = useFormikContext();
  const { includeAdditionalTravellers, additionalTravellers, numberOfAdditionalTravellers } = values;

  useEffect(() => {
    if (includeAdditionalTravellers === true && numberOfAdditionalTravellers !== additionalTravellers.length) {
      let travellers = [];
      for (let i = 0; i < numberOfAdditionalTravellers; i++) travellers.push({ firstName: '', lastName: '', dob: '' });
      setFieldValue('additionalTravellers', travellers);
    }
    if (includeAdditionalTravellers === false && additionalTravellers?.length > 0) {
      setFieldValue('additionalTravellers', []);
      setFieldValue('numberOfAdditionalTravellers', 1);
    }
  }, [setFieldValue, includeAdditionalTravellers, additionalTravellers, numberOfAdditionalTravellers]);

  return (
    <Fragment>
      <Grid item xs={12}>
        <Grid container spacing={3}>

          {/** Title */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Travel Information</Typography>
            <Divider />
          </Grid>

          {/** Additional Travellers */}
          <Grid item xs={12} md={6}>
            <Field
              name="includeAdditionalTravellers"
              component={RenderRadioGroup}
              label="* Are there additional travellers in your group?"
              disabled={isDisabled}
              row
              options={[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ]}
            />
          </Grid>

          {/** Number of Additional Travellers */}
          {includeAdditionalTravellers === true && (
            <FieldArray
              name="additionalTravellers"
              render={() => (
                <Fragment>
                  <Grid item xs={12} md={6}>
                    <Field
                      name="numberOfAdditionalTravellers"
                      component={RenderSelectField}
                      label="* Number of additional travellers in your group?"
                      disabled={isDisabled}
                      options={[
                        { value: 1, label: '1' },
                        { value: 2, label: '2' },
                        { value: 3, label: '3' },
                        { value: 4, label: '4' },
                        { value: 5, label: '5' },
                        { value: 6, label: '6' },
                        { value: 7, label: '7' },
                        { value: 8, label: '8' },
                        { value: 9, label: '9' },
                        { value: 10, label: '10' },
                      ]}
                    />
                  </Grid>
                  {additionalTravellers.map((traveller, index) => (
                    <Grid key={index} item xs={12}>
                      <Card>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body1"><b>Additional Traveller Information</b></Typography>
                            <Typography variant="body2">For each traveller, please list their last name, first name and date of birth</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Field
                              name={`additionalTravellers[${index}].firstName`}
                              component={RenderTextField}
                              label="* First name"
                              disabled={isDisabled}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Field
                              name={`additionalTravellers[${index}].lastName`}
                              component={RenderTextField}
                              label="* Last name"
                              disabled={isDisabled}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Field
                              name={`additionalTravellers[${index}].dob`}
                              component={RenderDateField}
                              label="* Date of birth (yyyy/mm/dd)"
                              openTo="year"
                              disableFuture
                              disabled={isDisabled}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  ))}
                </Fragment>
              )}
            />
          )}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <Typography variant="subtitle1">Arrival Information</Typography>
          </Grid>

          {/** Arrival Date */}
          <Grid item xs={12} md={6}>
            <Field
              name="arrival.date"
              component={RenderDateField}
              label="* Arrival Date (yyyy/mm/dd)"
              disabled={isDisabled}
            />
          </Grid>

          {/** Arrival By */}
          <Grid item xs={12} md={6}>
            <Field
              name="arrival.by"
              component={RenderSelectField}
              label="* Arrival By"
              disabled={isDisabled}
              options={[
                { value: 'air', label: 'Air' },
                { value: 'sea', label: 'Sea' },
                { value: 'land', label: 'Ground Transportation' },
              ]}
            />
          </Grid>

          {/** Airline / Flight Number */}
          <Grid item xs={12} md={6}>
            <Field
              name="arrival.flight"
              component={RenderTextField}
              label="Airline / Flight Number (if applicable)"
              disabled={isDisabled}
            />
          </Grid>

          {/** City */}
          <Grid item xs={12} md={6}>
            <Field
              name="arrival.from"
              component={RenderTextField}
              label="* Arrival From (City, Country)"
              disabled={isDisabled}
            />
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export { TravelInformation };

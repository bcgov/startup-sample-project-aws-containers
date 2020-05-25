import React from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { Formik, Form, Field } from 'formik';
import { useHistory } from 'react-router-dom';

import { Routes } from '../../constants';

import { Page, Card } from '../../components/generic';
import { RenderSearchField } from '../../components/fields';

export default () => {
  const history = useHistory();
  const initialValuesConfirmation = { confirmationNumber: '' };
  const initialValuesLastName = { lastName: '' };

  const handleConfirmationNumberSubmit = (values) => {
    if (values.confirmationNumber) {
      history.push(Routes.LookupConfirmationNumber.dynamicRoute(values.confirmationNumber));
    }
  };

  const handleLastNameSubmit = (values) => {
    if (values.lastName) {
      history.push(Routes.LookupLastName.dynamicRoute(values.lastName));
    }
  };

  return (
    <Page>
      <Grid container alignItems="center" justify="center">
        <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
          <Box m={2}>
            <Card title="Submission Lookup">
              <Grid container spacing={3}>

                {/** Confirmation Number */}
                <Grid item xs={12}>
                  <Formik
                    initialValues={initialValuesConfirmation}
                    onSubmit={handleConfirmationNumberSubmit}
                  >
                    <Form>
                      <Typography variant="subtitle2" noWrap gutterBottom>By confirmation number:</Typography>
                      <Field
                        name="confirmationNumber"
                        component={RenderSearchField}
                        placeholder="Eg: BC12345"
                      />
                    </Form>
                  </Formik>
                </Grid>

                {/** Last Name */}
                <Grid item xs={12}>
                  <Formik
                    initialValues={initialValuesLastName}
                    onSubmit={handleLastNameSubmit}
                  >
                    <Form>
                      <Typography variant="subtitle2" noWrap gutterBottom>By traveller last name:</Typography>
                      <Field
                        name="lastName"
                        component={RenderSearchField}
                        placeholder="Enter last name..."
                      />
                    </Form>
                  </Formik>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Page>
  );
};

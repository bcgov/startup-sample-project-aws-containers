import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Formik, Form as FormikForm } from 'formik';
import { useHistory } from 'react-router-dom';

import { Routes, FormSchema } from '../../constants';
import { handleSubmission } from '../../utils';

import { Card } from '../generic';
import { Greeter } from './Greeter';
import { SubmissionInfo } from './SubmissionInfo';
import { Summary } from './Summary';

const Form = ({ initialValues = null, isDisabled, confirmationNumber = null, isPdf = false }) => {
  const history = useHistory();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const formValues = initialValues ? initialValues : {

    // Greeter
    greeting: '',
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    const modifiedValues = handleSubmission(values);
    const response = await fetch('/api/v1/form', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
      body: JSON.stringify({ ...modifiedValues }),
    });
    if (response.ok) {
      const { id, isolationPlanStatus, error } = await response.json();
      if (error) {
        setSubmitError(error.message || 'Failed to submit this form');
      } else {
        history.push(Routes.Confirmation, { id, isolationPlanStatus });
        return;
      }
    } else {
      setSubmitError(response.error || response.statusText || 'Server error');
    }
    setSubmitLoading(false);
  };

  return (
    <Grid item xs={12} sm={isDisabled ? 12 : 11} md={isDisabled ? 12 : 10} lg={isDisabled ? 12 : 8} xl={isDisabled ? 12 : 6}>

      {isDisabled && (
        <Box pl={2} pr={2} pb={3}>
          <SubmissionInfo isolationPlanStatus={formValues.isolationPlanStatus} id={confirmationNumber} isPdf={isPdf} />
        </Box>
      )}

      {!isDisabled && (
        <Box pt={4} pb={4} pl={2} pr={2}>
          <Summary />
        </Box>
      )}

      <Box pl={2} pr={2}>
        <Card>
          <Formik
            initialValues={formValues}
            validationSchema={FormSchema}
            onSubmit={handleSubmit}
          >
            <FormikForm>
              <Grid container spacing={2}>
                {!isDisabled && <Greeter submitLoading={submitLoading} submitError={submitError} />}
              </Grid>
            </FormikForm>
          </Formik>
        </Card>
      </Box>
    </Grid>
  );
};

export { Form };

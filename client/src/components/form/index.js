import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Formik, Form as FormikForm } from 'formik';
import { useHistory } from 'react-router-dom';

import { Routes, FormSchema } from '../../constants';
import { handleSubmission } from '../../utils';

import { Card } from '../generic';
import { DataForm } from './DataForm';
import { Greeter } from './Greeter';
import { SubmissionInfo } from './SubmissionInfo';
import { Summary } from './Summary';

const Form = ({ initialValues = null, isDisabled}) => {
  const history = useHistory();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  let formValues = initialValues ? initialValues : {
    greeting: '',
  };

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    const modifiedValues = handleSubmission(values);
    const response = await fetch('/api/v1/greeting', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
      body: JSON.stringify({ ...modifiedValues }),
    });
    setSubmitLoading(false);
    if (response.ok) {
      const { id, greeting, error } = await response.json();
      if (error) {
        setSubmitError(error.message || 'Failed to submit this form');
      } else {
        history.push(Routes.Confirmation, { id, greeting });
        const formValues = initialValues ? initialValues : {
          id: id,
          greeting: greeting,
        };
        // console.log(formValues.greeting);
        return RenderForm({formValues, isDisabled, submitLoading, submitError, handleSubmit});
      }
    } else {
      setSubmitError(response.error || response.statusText || 'Server error');
    }
  };
  return RenderForm({formValues, isDisabled, submitLoading, submitError, handleSubmit});
};

const RenderForm = ({ formValues = null, isDisabled, submitLoading, submitError, handleSubmit=()=>{} }) => {
  return (
    <Grid item xs={12} sm={isDisabled ? 12 : 11} md={isDisabled ? 12 : 10} lg={isDisabled ? 12 : 8} xl={isDisabled ? 12 : 6}>

      {isDisabled && formValues && (
        <Box pl={2} pr={2} pb={3}>
          <SubmissionInfo id={formValues.id} lastest_greeting={formValues.greeting} />
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
            enableReinitializeprop={true}
          >
            <FormikForm>
              <Grid container spacing={2}>
                {!isDisabled && <Greeter submitLoading={submitLoading} submitError={submitError} />}
              </Grid>
            </FormikForm>
          </Formik>
        </Card>
      </Box>

      <DataForm />
      
    </Grid>
  );
};

export { Form };

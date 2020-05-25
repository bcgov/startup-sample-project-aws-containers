import React, { Fragment, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { Routes, DeterminationSchema } from '../../constants';
import { adaptSubmission } from '../../utils';

import { Form } from '../../components/form';
import { Page, Button, Divider } from '../../components/generic';
import { RenderButtonGroup, RenderTextField } from '../../components/fields';

const useStyles = makeStyles((theme) => ({
  statusWrapper: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formWrapper: {
    height: '100%',
    overflowY: 'auto',
    padding: theme.spacing(4, 6),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(4, 2),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 0),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2, 0),
    },
  },
  sidebarWrapper: {
    height: '100%',
    boxShadow: '0 0 15px 0 rgba(0,0,0,0.2)',
    backgroundColor: '#FFFFFF',
    padding: theme.spacing(4),
  },
}));

export default () => {
  const classes = useStyles();
  const history = useHistory();
  const params = useParams();
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [lookupError, setLookupError] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [initialUserFormValues, setInitialUserFormValues] = useState(null);
  const [initialSidebarValues, setInitialSidebarValues] = useState({
    determination: '',
    notes: '',
  });

  /**
   * On page load, grab the ID from the url and perform a search
   * query to find the matching form data.
   */
  useEffect(() => {
    (async () => {
      setLookupLoading(true);
      const jwt = window.localStorage.getItem('jwt');
      const response = await fetch(`/api/v1/form/${params.confirmationNumber}`, {
        headers: { 'Accept': 'application/json', 'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}` },
        method: 'GET',
      });

      if (response.ok) {
        const { determination, notes, ...rest } = await response.json();
        const submission = adaptSubmission(rest);
        setInitialUserFormValues(submission);
        setInitialSidebarValues({ determination: determination || '', notes: notes || '' });
      } else {
        setLookupError(`Failed to find submission with ID ${params.confirmationNumber}`);
      }
      setLookupLoading(false);
    })();
  }, [params.confirmationNumber]);

  const handleSubmit = async (values) => {
    setSubmitLoading(true);
    const jwt = window.localStorage.getItem('jwt');
    const response = await fetch(`/api/v1/form/${params.confirmationNumber}`, {
      headers: { 'Accept': 'application/json', 'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}` },
      method: 'PATCH',
      body: JSON.stringify({ ...values })
    });

    if (response.ok) {
      setSubmitSuccess(true);
    } else {
       setSubmitError(response.error || 'Failed to update this submission.');
       setSubmitLoading(false);
     }
  };

  const renderSidebar = () => (
    <Grid className={classes.sidebarWrapper} item xs={12} md={4}>
      <Formik
        initialValues={initialSidebarValues}
        validationSchema={DeterminationSchema}
        onSubmit={handleSubmit}
      >
        <FormikForm>
          <Grid container spacing={3}>

            {/** Title */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Provincial Official Determination</Typography>
              <Divider />
            </Grid>

            {/** Determination */}
            <Grid item xs={12}>
              <Typography color="textSecondary" variant="subtitle2" gutterBottom>Determination*</Typography>
              <Field
                name="determination"
                component={RenderButtonGroup}
                options={[
                  { value: 'support', label: 'Support Needed', color: 'secondary' },
                  { value: 'accepted', label: 'No Support Needed', color: 'primary' },
                ]}
              />
            </Grid>

            {/** Notes */}
            <Grid item xs={12}>
              <Typography color="textSecondary" variant="subtitle2" gutterBottom>Notes*</Typography>
              <Field
                name="notes"
                component={RenderTextField}
                placeholder="Add notes to support your decision..."
                variant="outlined"
                multiline
                rows={10}
              />
            </Grid>

            {/** Submit */}
            <Grid item xs={12}>
              <Button
                type="submit"
                text="Submit"
                size="large"
                loading={submitLoading}
              />
            </Grid>

            {/** Submit Error */}
            {submitError && (
              <Grid item xs={12}>
                <Typography variant="body1" color="error">{submitError}</Typography>
              </Grid>
            )}
          </Grid>
        </FormikForm>
      </Formik>
    </Grid>
  );

  const renderLoading = () => <CircularProgress />;

  const renderSubmitError = () => (
    <Container maxWidth="sm" align="center">
      <Typography variant="body1" paragraph>{lookupError.message || lookupError}</Typography>
      <Button
        text="Go Back"
        onClick={() => history.goBack()}
        fullWidth={false}
      />
    </Container>
  );

  return submitSuccess ? <Redirect to={Routes.Lookup} /> : (
   <Page>
     {(lookupLoading || lookupError) ? (
       <div className={classes.statusWrapper}>
         {lookupLoading && renderLoading()}
         {lookupError && renderSubmitError()}
       </div>
     ) : (
       <Fragment>

         {/** Form */}
         <Grid className={classes.formWrapper} item xs={12} sm={11} md={8}>
           <Form
             initialValues={initialUserFormValues}
             isDisabled
             confirmationNumber={params.confirmationNumber}
             isPdf={false}
           />
           <Hidden mdUp>
             <Box p={4}>
               <Button
                 text="Submit Determination"
                 size="large"
                 onClick={() => setMobileDrawerOpen(true)}
               />
             </Box>
           </Hidden>
         </Grid>

         {/** Sidebar - Mobile */}
         <Hidden mdUp>
           <Drawer
             anchor="right"
             open={isMobileDrawerOpen}
             onClose={() => setMobileDrawerOpen(false)}
           >
             {renderSidebar()}
           </Drawer>
         </Hidden>

         {/** Sidebar - Desktop */}
         <Hidden smDown>
           {renderSidebar()}
         </Hidden>
       </Fragment>
     )}
   </Page>
  );
};

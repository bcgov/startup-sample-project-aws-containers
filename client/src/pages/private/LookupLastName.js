import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Field, Form, Formik } from 'formik';
import { useHistory, useParams } from 'react-router-dom';

import { Routes } from '../../constants';

import { Button, Page, Table } from '../../components/generic';
import { RenderSearchField } from '../../components/fields';

export default () => {
  const history = useHistory();
  const params = useParams();
  const [lookupError, setLookupError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const columns = ['Arrival Date', 'Last Name', 'First Name', 'Arrival City, Country', 'Confirmation Number'];
  const initialValuesQuery = { query: params.lastName };

  /**
   * On page load / on search, grab the name from the url and perform a search
   * query on the `lastName`.
   */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const jwt = window.localStorage.getItem('jwt');
      const response = await fetch(`/api/v1/last-name/${params.lastName}`, {
        headers: { 'Accept': 'application/json', 'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}` },
        method: 'GET',
      });

      if (response.ok) {
        const { travellers } = await response.json();
        const rows = travellers.map((traveller) =>
          ({
            date: traveller.arrival.date,
            lastName: traveller.lastName,
            firstName: traveller.firstName,
            cityCountry: traveller.arrival.from,
            confirmationNumber: traveller.id,
            viewMore: <Button onClick={() => history.push(Routes.LookupConfirmationNumber.dynamicRoute(traveller.id))}
              size="small" text="View" />,
          })
        );
        setRows(rows)
        setLookupError(null)
      } else {
        setLookupError(response.error || `No traveller found with last name: "${params.lastName}"`);
      }

      setLoading(false);
    })();
  }, [params.lastName]);

  const handleSearch = (values) => {
    history.replace(Routes.LookupLastName.dynamicRoute(values.query));
  };

  return (
    <Page>
      <Grid container justify="center">
        <Grid item xs={12} sm={12} md={10} lg={8} xl={6}>
          <Box m={4}>
            <Grid container spacing={3}>

              {/** Title */}
              <Grid item xs={12}>
                <Typography color="primary" variant="h2" gutterBottom noWrap>
                  Submission Lookup
               </Typography>
              </Grid>

              <Grid item xs={12}>
                <Grid container alignItems="center" justify="space-between">

                  {/** Results Text */}
                  <Grid item>
                    <Typography variant="subtitle2" gutterBottom noWrap>
                      {lookupError ? lookupError.message || lookupError : `${rows.length} Records found for ${params.lastName}`}
                    </Typography>
                  </Grid>

                  {/** Search Bar */}
                  <Grid item xs={12} sm={6}>
                    <Formik
                      initialValues={initialValuesQuery}
                      onSubmit={handleSearch}
                    >
                      <Form>
                        <Field
                          name="query"
                          component={RenderSearchField}
                          placeholder="Search last name..."
                        />
                      </Form>
                    </Formik>
                  </Grid>
                </Grid>
              </Grid>

              {/** Table */}
              <Grid item xs={12}>
                {!lookupError && <Table
                  columns={columns}
                  rows={rows}
                  isLoading={isLoading}
                />}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Page>
  );
};

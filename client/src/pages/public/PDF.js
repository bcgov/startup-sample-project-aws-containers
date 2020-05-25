import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';

import { Form } from '../../components/form';

export default ({ match: { params }}) => {
  const [initialValues, setInitialValues] = useState(null);
  const [loading, toggleLoading] = useState(true);
  const { jwt, id } = params;

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/v1/form/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-type': 'application/json', 'Authorization': `Bearer ${jwt}` },
      });
      if (response.ok) {
        const data = await response.json();
        setInitialValues(data);
        toggleLoading(false);
      }
    })();
  }, [jwt, id]);

  return (
     <Grid style={{ height: '100%', overflowY: 'auto'}} item xs={12}>
       {!loading && <Form confirmationNumber={id} initialValues={initialValues} isDisabled isPdf={true} />}
     </Grid>
  );
};

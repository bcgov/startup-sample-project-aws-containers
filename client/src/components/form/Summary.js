import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';

const Summary = () => {
  return (
    <Fragment>
      <Typography variant="h2" color="primary" gutterBottom>
        Simple Demo App
      </Typography>
      <Typography variant="body1" paragraph>
        In order to get you started in your journey, we've provided you a small demonstration app.
        It consists of a database,form and an s3 bucket connected to it. In the form below, pick your favorite greeting and see
        it reflected here or or Upload an image and see it get uploaded in the s3 bucket.
      </Typography>
    </Fragment>
  );
};

export { Summary };

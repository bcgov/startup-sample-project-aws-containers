import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const Summary = () => {
  return (
    <Fragment>
      <Typography variant="h2" color="primary" gutterBottom>
        Self-Isolation Plan
      </Typography>
      <Typography variant="body1" paragraph>
        B.C. has declared a state of emergency. To ensure the safety of all British Columbians you are being asked to
        declare your journey details and how you plan to self isolate. Please complete the form below.
      </Typography>
      <Typography variant="body1" paragraph>
        Need help with your self isolation plan? {window.innerWidth < 600 && <br />}
        <Link
          href="https://www2.gov.bc.ca/gov/content/safety/emergency-preparedness-response-recovery/covid-19-provincial-support"
          target="__blank"
          rel="noreferrer noopener"
        >
          Talk to a Service BC agent
        </Link>
      </Typography>
      <Typography variant="body1">
        Download a &nbsp;
        <Link
          href="https://www2.gov.bc.ca/assets/gov/health-safety/support_for_travellers_print.pdf"
          target="__blank"
          rel="noreferrer noopener"
        >
          PDF version of this form
        </Link>
      </Typography>
    </Fragment>
  );
};

export { Summary };

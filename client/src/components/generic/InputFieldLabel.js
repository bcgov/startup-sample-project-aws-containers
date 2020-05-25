import React from 'react';
import Typography from '@material-ui/core/Typography';

const InputFieldLabel = ({ label, ...props }) => {
  return (
    <Typography variant="body1" {...props}>
      {label}
    </Typography>
  );
};

export { InputFieldLabel };

import React from 'react';
import FormHelperText from '@material-ui/core/FormHelperText';

const InputFieldError = ({ error, ...props }) => {
  return (
    <FormHelperText error {...props}>{error}</FormHelperText>
  );
};

export { InputFieldError };

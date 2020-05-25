import React, { Fragment } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ErrorMessage } from 'formik';

import { InputFieldLabel, InputFieldError } from '../generic';

const RenderCheckboxGroup = ({
  field,
  form,
  label,
  options,
  ...props
}) => {
  return (
    <Fragment>
      {label && <InputFieldLabel label={label} />}
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          label={<InputFieldLabel label={option.label} />}
          control={
            <Checkbox
              color="primary"
              value={option.value}
              checked={Array.isArray(field.value) && field.value.includes(option.value)}
            />
          }
          {...field}
          {...props}
        />
      ))}
      <InputFieldError error={<ErrorMessage name={field.name} />} />
    </Fragment>
  );
};

export { RenderCheckboxGroup };

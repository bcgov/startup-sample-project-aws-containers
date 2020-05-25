import React, { Fragment } from 'react';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { ErrorMessage, useField } from 'formik';

import { dateToString, stringToDate } from '../../utils';

import { InputFieldError, InputFieldLabel } from '../generic';

const RenderDateField = ({
  field,
  form,
  label,
  ...props
}) => {
  const [, , helpers] = useField(field.name);
  const { setValue, setTouched } = helpers;
  return (
    <Fragment>
      {label && <InputFieldLabel label={label} />}
      <KeyboardDatePicker
        format="YYYY/MM/DD"
        value={!field.value ? null : stringToDate(field.value)}
        onChange={(value) => setValue(dateToString(value))}
        onBlur={() => setTouched(true)}
        invalidDateMessage={null}
        minDateMessage={null}
        maxDateMessage={null}
        openTo="date"
        variant="dialog"
        inputVariant="filled"
        fullWidth
        {...props}
      />
      <InputFieldError error={<ErrorMessage name={field.name} />} />
    </Fragment>
  );
};

export { RenderDateField };

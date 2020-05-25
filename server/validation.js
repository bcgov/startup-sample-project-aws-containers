const yup = require('yup');

const provinces = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Québec',
  'Saskatchewan',
  'Nunavut',
  'Northwest Territories',
  'Yukon',
  'Other',
];

const validateDateString = (s) => {
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(s) === false) return false;
  const date = Date.parse(s);
  return typeof date === 'number' && !Number.isNaN(date);
};

const validateUniqueArray = (a) => (
  Array.isArray(a) && new Set(a).size === a.length
);

const DeterminationSchema = yup.object().noUnknown().shape({
  determination: yup.string().oneOf(['support', 'accepted']).required('Determination is required'),
  notes: yup.string().required('Notes are required'),
});

const PhacSchema = yup.array().required('Submission must contain at least one item').of(
  yup.object().shape({
    covid_id: yup.string().typeError('covid_id must be a string').required('covid_id is required'),
  }),
);

const FormSchema = yup.object().noUnknown().shape({
  // Primary contact
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  // telephone: yup.string().required().matches(/^\d{10}$/),
  telephone: yup.string().required('Telephone number is required'),
  email: yup.string().nullable().matches(/^(.+@.+\..+)?$/, 'Invalid email address'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  province: yup.string().required('Province is required').oneOf(provinces, 'Invalid province'),
  // postalCode: yup.string().required().matches(/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/),
  postalCode: yup.string().nullable(),
  dob: yup.string().required('Date of birth is required').test('is-date', 'Not a valid date', validateDateString),

  // Travel information
  includeAdditionalTravellers: yup.boolean().typeError('Must specify additional travellers').required('Must specify additional travellers'),
  additionalTravellers: yup.array().when('includeAdditionalTravellers', {
    is: true,
    then: yup.array().required('Traveller information is required').of(
      yup.object().noUnknown('Unknown key for additional traveller information').shape({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        dob: yup.string().required('Date of birth is required').test('is-date', ' Not a valid date', validateDateString),
      }),
    ).test('is-length', 'Number of additional travellers must be between 1 and 10', (v) => v.length >= 1 && v.length <= 10),
    otherwise: yup.array().test('is-empty', 'Additional travellers must be empty', (v) => v && v.length === 0),
  }),
  arrival: yup.object().noUnknown('Unknown key for arrival information').shape({
    date: yup.string().required('Arrival date is required').test('is-date', 'Not a valid date', validateDateString),
    by: yup.string().required('Arrival method is required').oneOf(['air', 'sea', 'land'], 'Invalid arrival method'),
    from: yup.string().required('Arrival city and country are required'),
    flight: yup.string().nullable(),
  }),

  // Isolation plan
  accomodations: yup.boolean().typeError('Must specify if accommodations are available').required('Must specify if accommodations are available'),
  isolationPlan: yup.object().when('accomodations', {
    is: true,
    then: yup.object().noUnknown('Unknown key in isolation plan').shape({
      city: yup.string().required('Isolation city is required'),
      address: yup.string().required('Isolation address is required'),
      type: yup.string().required('Isolation type is required').oneOf(['private', 'family', 'commercial'], 'Invalid isolation type'),
    }),
    otherwise: yup.object().nullable().test('is-null', 'Isolation plan must be null', (v) => v == null),
  }),
  supplies: yup.boolean().typeError('Must specify if able to make isolation arrangements').required('Must specify if able to make isolation arrangements'),
  ableToIsolate: yup.boolean().typeError('Must specify whether accommodation assistance is required').required('Must specify whether accommodation assistance is required'),
  transportation: yup.array().of(
    yup.string().required('Transportation type is required').oneOf(['taxi', 'personal', 'public'], 'Invalid transportation type'),
  ).test('is-unique-array', 'Transportation types must be unique', validateUniqueArray),

  // Certify
  certified: yup.boolean().typeError('Must certify submitted information').required('Must certify submitted information').test('is-true', 'Certify must be true', (v) => v === true),
});

const validate = async (schema, data) => schema.validate(data, { strict: true });

module.exports = {
  DeterminationSchema, FormSchema, PhacSchema, validate,
};

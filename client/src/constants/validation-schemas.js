import * as yup from 'yup';

// const provinces = [
//   'Alberta',
//   'British Columbia',
//   'Manitoba',
//   'New Brunswick',
//   'Newfoundland and Labrador',
//   'Nova Scotia',
//   'Ontario',
//   'Prince Edward Island',
//   'Québec',
//   'Saskatchewan',
//   'Nunavut',
//   'Northwest Territories',
//   'Yukon',
//   'Other',
// ];

// const validateDateString = (s) => {
//   if (/^\d{4}\/\d{2}\/\d{2}$/.test(s) === false) return false;
//   const date = Date.parse(s);
//   return typeof date === 'number' && !Number.isNaN(date);
// };

// const validateUniqueArray = (a) => (
//   Array.isArray(a) && new Set(a).size === a.length
// );

export const FormSchema = yup.object().noUnknown().shape({
  // Greeting
  //greeting: yup.string().required('Greeting selection is required'),
});

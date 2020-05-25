/**
 * Intended to modify form values before submitting to the backend.
 *
 * @param {Object} submission - The form values.
 * @returns {Object} The modified object.
 */
export const handleSubmission = (submission) => {
  const modified = { ...submission };
  delete modified.numberOfAdditionalTravellers;
  return modified;
};

/**
 * Intended to adapt old, invalid versions of the form to display (mostly) correctly
 * Could remap field names, handle unexpected data types, etc. if migrations have not
 * yet been run against DB
 *
 * @param {Object} submission - The form values.
 * @returns {Object} The modified object.
 */
export const adaptSubmission = (submission) => {
  const modified = { ...submission };
  if (submission.includeAdditionalTravellers === true
    && typeof submission.numberOfAdditionalTravellers === 'undefined'
    && Array.isArray(submission.additionalTravellers)) {
    modified.numberOfAdditionalTravellers = submission.additionalTravellers.length;
  }
  return modified;
};

/**
 * Fetch multiple requests at once and concatenate the responses and errors.
 *
 * @param {Array} requests - Array of asynchronous functions.
 * @returns {Promise<Object>}
 */
export async function fetchMultiple(requests) {
  let errors = [], responses = [];

  // Concatenate all responses and errors
  return (await Promise.all(requests)).reduce((acc, response) => {
    errors = [...errors, ...response.errors];
    responses = [...responses, ...response.response];

    return {
      ...acc,
      errors,
      responses,
    };
  }, {});
}

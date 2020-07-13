/**
 * Fetch multiple requests at once and concatenate the responses.
 *
 * @param {Array} requests - Array of asynchronous functions.
 * @returns {Promise<Object>}
 */
export async function fetchMultiple(requests) {
  let responses = [];

  /**
   * Allow nested functions to be able to pass parameters to the requests.
   *
   * @type {Array}
   */
  requests = requests.map((request) => {
    return typeof request === 'function' ? request() : request;
  });

  if (!requests.length) {
    return {
      responses: [],
    };
  }

  // Concatenate all responses
  return (await Promise.all(requests)).reduce((acc, response) => {
    responses = [...responses, ...response];

    return {
      ...acc,
      responses,
    };
  }, {});
}

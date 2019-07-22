import { appConfig } from '@/config/appConfig';
import { configBus } from '@/config/configBus';

export const METHOD_GET = 'get';
export const METHOD_SEARCH = 'search';

/**
 * Fetch data from an endpoint and return an object containing the response and errors.
 *
 * @param {Function} Endpoint - Endpoint to use.
 *
 * @param {Object} options - Options.
 * @param {String} options.method? - Method.
 * @param {Object} options.params? - Parameters.
 * @param {Object} options.mockData? - Mock data to fall back to.
 * @param {Boolean} options.mock? - To mock or not to mock. That is the question.
 *
 * @param {Object} param - Parameter to add to the url.
 *
 * @returns {Promise.<{errors: Object, response: Object}>}
 */
export async function fetchFromEndpoint(Endpoint, options = {}, param = {}) {
  const endpoint = new Endpoint();
  endpoint.config.url = new URL(configBus.config.apiBaseUrl);

  let response = {};
  let errors = {};

  // Set default options and override with given options.
  options = {
    method: METHOD_GET,
    params: {
      ...param,
    },
    mockData: null,
    mock: false,
    ...options,
  };

  if ((configBus.mock || options.mock) && options.mockData) {
    response = await new Promise((resolve) => {

      setTimeout(() => {
        resolve(options.mockData.data[endpoint.namespace]);
      }, configBus.mockDelay || 0);
    });

  } else {
    try {
      response = await endpoint[options.method](options.params);
    } catch (e) {
      errors = e;
      configBus.addErrors(endpoint.endpoint, [e]);
    }
  }

  return {
    response: Array.isArray(response) ? response : [],
    errors: Array.isArray(errors) ? errors : [],
  };
}

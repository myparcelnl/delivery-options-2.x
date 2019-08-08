import { appConfig } from '@/config/data/appConfig';
import { configBus } from '@/config/configBus';

export const METHOD_GET = 'get';

export const METHOD_SEARCH = 'search';

const isDev = process.env.NODE_ENV === 'development';

/**
 * Fetch data from an endpoint and return an object containing the response and errors.
 *
 * @param {Function} Endpoint - Endpoint to use.
 *
 * @param {Object} options - Options.
 * @param {String} options.method? - Method.
 *
 * @param {Object} param - Parameter to add to the url.
 *
 * @returns {Promise.<{errors: Object, response: Object}>}
 */
export async function fetchFromEndpoint(Endpoint, options = {}, param = {}) {
  const endpoint = new Endpoint();

  // Set API URL and accept-language header from config
  endpoint.config.acceptLanguage = configBus.config.locale;
  endpoint.config.url = new URL(isDev ? appConfig.apiUrl : configBus.config.apiBaseUrl);

  let response = {};
  let errors = {};

  // Set default options and override with given options.
  options = {
    method: METHOD_GET,
    params: {
      ...param,
    },
    ...options,
  };

  try {
    response = await endpoint[options.method](options.params);
  } catch (e) {
    errors = e;
    configBus.addErrors(endpoint.endpoint, e[0].errors);
  }

  return {
    response: Array.isArray(response) ? response : [],
    errors: Array.isArray(errors) ? errors : [],
  };
}

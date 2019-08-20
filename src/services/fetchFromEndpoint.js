import { ERROR } from '@/config/data/eventConfig';
import { appConfig } from '@/config/data/appConfig';
import { configBus } from '@/config/configBus';

/**
 * Data that has been fetched is stored in this object.
 *
 * @type {Object}
 */
const values = {};

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
 * @param {Object} options.params? - URL parameters.
 *
 * @param {Array} unique - Array of properties to use to try and skip API calls.
 *
 * @returns {Promise.<{errors: Object, response: Object}>}
 */
export async function fetchFromEndpoint(Endpoint, options = {}, unique = null) {
  const endpoint = new Endpoint();

  // Set API URL and accept-language header from config
  endpoint.config.acceptLanguage = configBus.config.locale;
  endpoint.config.url = new URL(isDev ? appConfig.apiUrl : configBus.config.apiBaseUrl);

  let response = {};
  let errors = {};

  let key = '_';

  // Set default options and override with given options.
  options = {
    method: METHOD_GET,
    ...options,
  };

  const valueKey = endpoint.endpoint;

  console.log(values);
  if (unique) {
    key = Object.keys(options.params)
      .filter((item) => unique.includes(item))
      .map((item) => options.params[item]).join('_');

    if (values.hasOwnProperty(valueKey) && values[valueKey].hasOwnProperty(key)) {
      console.warn(endpoint.endpoint, 'skipping api, got this already :)))))))');
      return values[valueKey][key];
    }
    console.warn(endpoint.endpoint, 'don\'t have this yet, fetching');
  }

  try {
    response = await endpoint[options.method](options.params);
  } catch (e) {
    errors = e;
    if (e.length) {
      configBus.addErrors(endpoint.endpoint, e[0].errors);
      configBus.$emit(ERROR, { [endpoint.endpoint]: e[0].errors });
    }
  }

  values[valueKey] = {
    [key]: {
      response: Array.isArray(response) ? response : [],
      errors: Array.isArray(errors) ? errors : [],
    },
  };

  return values[valueKey][key];
}

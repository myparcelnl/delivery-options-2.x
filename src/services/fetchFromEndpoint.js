import Client from '../../myparcel-js-sdk/src';
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
 * @param {String} endpoint - Endpoint to use.
 *
 * @param {Object} options - Options.
 * @param {String} options.method? - Method.
 * @param {Object} options.params? - URL parameters.
 *
 * @param {Array} unique - Array of properties to use to try and skip API calls.
 *
 * @returns {Promise.<{errors: Object, response: Object}>}
 */
export async function fetchFromEndpoint(endpoint, options = {}, unique = null) {
  const client = new Client(null, configBus.config.locale);

  console.log(appConfig);
  console.log(isDev ? appConfig.dev.apiUrl : configBus.config.apiBaseUrl || appConfig.prod.apiUrl);
  // Set API URL from config
  client.config.url = new URL(isDev ? appConfig.dev.apiUrl : configBus.config.apiBaseUrl || appConfig.prod.apiUrl);

  let response = {};
  let errors = {};

  let key = '_';

  // Set default options and override with given options.
  options = {
    method: METHOD_GET,
    ...options,
  };

  if (unique) {
    key = Object.keys(options.params)
      .filter((item) => unique.includes(item))
      .map((item) => options.params[item]).join('_');

    if (values.hasOwnProperty(endpoint) && values[endpoint].hasOwnProperty(key)) {
      return values[endpoint][key];
    }
  }

  try {
    response = await client[endpoint][options.method](options.params);
  } catch (e) {
    errors = e;
    if (e.length) {
      configBus.addErrors(endpoint, e[0].errors);
      configBus.$emit(ERROR, { [endpoint]: e[0].errors });
    }
  }

  values[endpoint] = {
    [key]: {
      response: Array.isArray(response) ? response : [],
      errors: Array.isArray(errors) ? errors : [],
    },
  };

  return values[endpoint][key];
}

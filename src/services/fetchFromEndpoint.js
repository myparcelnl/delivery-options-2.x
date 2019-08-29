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
export async function fetchFromEndpoint(endpoint, options = {}) {
  const client = new Client();

  client.config.acceptLanguage = configBus.config[LOCALE];
  client.config.url = getApiUrl();

  let response = {};
  let errors = {};

  // Set default options and override with given options.
  options = {
    method: METHOD_GET,
    ...options,
  };

  try {
    response = await client[endpoint][options.method](options.params);
  } catch (e) {
    errors = e;
    if (e.length) {
      configBus.addErrors(endpoint, e[0].errors);
      configBus.$emit(ERROR, { [endpoint]: e[0].errors });
    }
  }

  return {
    response: Array.isArray(response) ? response : [],
    errors: Array.isArray(errors) ? errors : [],
  };
}

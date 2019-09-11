import Client from '@myparcel/sdk/src';
import { ERROR } from '@/config/data/eventConfig';
import { LOCALE } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { getApiUrl } from '@/data/request/getApiUrl';

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
 * @returns {Promise.<{errors: Object, response: Object}>}
 */
export async function fetchFromEndpoint(endpoint, options = {}) {
  const client = new Client();

  client.config.acceptLanguage = configBus.get(LOCALE);
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

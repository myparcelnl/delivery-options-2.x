import Client from '@myparcel/sdk/src';
import { ERROR } from '@/config/data/eventConfig';
import { LOCALE } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { getApiUrl } from '@/data/request/getApiUrl';

export const METHOD_GET = 'get';
export const METHOD_SEARCH = 'search';

/**
 * Fetch data from an endpoint and return an object containing the response.
 *
 * @param {string} endpoint - Endpoint to use.
 *
 * @param {object} options - Options.
 * @param {string} options.method? - Method.
 * @param {object} options.params? - URL parameters.
 *
 * @returns {Promise.<{response: object}>}
 */
export async function fetchFromEndpoint(endpoint, options = {}) {
  const client = new Client();

  client.config.acceptLanguage = configBus.get(LOCALE);
  client.config.url = getApiUrl();

  let response = {};

  // Set default options and override with given options.
  options = {
    method: METHOD_GET,
    ...options,
  };

  try {
    response = await client[endpoint][options.method](options.params);
  } catch (e) {
    if (e.errors.length) {
      configBus.addErrors(e.errors);
      configBus.$emit(ERROR, { [endpoint]: e.errors });
    }
  }

  return { response: Array.isArray(response) ? response : [] };
}

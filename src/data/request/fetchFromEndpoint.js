import Client from '@myparcel/sdk/src';
import { LOCALE } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { getApiUrl } from '@/data/request/getApiUrl';

export const METHOD_GET = 'get';
export const METHOD_SEARCH = 'search';

/**
 * Fetch data from an endpoint and return an object containing the response.
 *
 * @param {String} endpoint - Endpoint to use.
 *
 * @param {Object} options - Options.
 * @param {String} options.method? - Method.
 * @param {Object} options.params? - URL parameters.
 *
 * @returns {Promise.<Array>}
 */
export async function fetchFromEndpoint(endpoint, options = {}) {
  const client = new Client();

  client.config.acceptLanguage = configBus.get(LOCALE);
  client.config.url = getApiUrl();

  let response;

  // Set default options and override with given options.
  options = {
    method: METHOD_GET,
    ...options,
  };

  try {
    response = await client[endpoint][options.method](options.params);
  } catch (e) {
    if (e.errors && e.errors.length) {
      configBus.addErrors({ type: 'api', endpoint, error: e.errors });
    } else {
      configBus.addErrors({ type: 'fatal', endpoint, error: e });
    }
  }

  return response || [];
}

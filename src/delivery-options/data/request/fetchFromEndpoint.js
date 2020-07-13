import '@myparcel/js-sdk/dist/endpoint/public/carriers';
import '@myparcel/js-sdk/dist/endpoint/public/delivery-options';
import '@myparcel/js-sdk/dist/endpoint/public/pickup-locations';
import Client from '@myparcel/js-sdk/dist/client';
import { LOCALE } from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';
import { getApiUrl } from '@/delivery-options/data/request/getApiUrl';
import memoize from 'lodash-es/memoize';

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
export const fetchFromEndpoint = memoize(async function fetchFunc(endpoint, options = {}) {
  const client = new Client();

  client.config.acceptLanguage = configBus ? configBus.get(LOCALE) : 'nl-NL';
  client.config.url = getApiUrl();

  let response = [];

  // Set default options and override with given options.
  options = {
    method: METHOD_GET,
    ...options,
  };

  try {
    response = await client[endpoint][options.method](options.params) || [];
  } catch (e) {
    if (configBus) {
      if (e.errors && e.errors.length) {
        configBus.addErrors({ type: 'api', endpoint, ...e.errors[0] });
      } else {
        configBus.addErrors({ type: 'fatal', endpoint, error: e });
      }
    }
  }

  return response;
}, (...args) => JSON.stringify(args));

import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { ERROR_NO_ADDRESS } from '@/config/data/appConfig';
import { Pickup } from 'Sdk/src/endpoint/public/pickup';
import { configBus } from '@/config/configBus';

/**
 * Fetch pickup options.
 *
 * @returns {Promise}
 */
export function fetchPickupLocations() {
  if (!configBus.hasValidAddress) {
    configBus.addErrors(Pickup.prototype.endpoint, [ERROR_NO_ADDRESS]);
    return new Promise((resolve) => resolve({ errors: true, response: {} }));
  }

  return fetchFromEndpoint(Pickup, {
    method: METHOD_SEARCH,
    params: configBus.getRequestParameters(),
  });
}

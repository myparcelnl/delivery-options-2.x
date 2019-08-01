import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { Pickup } from 'Sdk/src/endpoint/public/pickup';
import { configBus } from '@/config/configBus';

/**
 * Fetch pickup options.
 *
 * @returns {Promise}
 */
export function fetchPickupLocations() {
  const { cc, number, postalCode } = configBus.address;

  if (!cc || !postalCode || !number) {
    return new Promise((resolve) => resolve({ errors: true, response: {} }));
  }

  return fetchFromEndpoint(Pickup, {
    method: METHOD_SEARCH,
    params: configBus.getRequestParameters(),
  });
}

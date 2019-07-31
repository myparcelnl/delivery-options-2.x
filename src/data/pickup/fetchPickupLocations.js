import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { Pickup } from 'Sdk/src/endpoint/public/pickup';
import { configBus } from '@/config/configBus';
import demoPickupOptions from '@/config/demo/demoPickupOptions';

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
    mockData: demoPickupOptions,
  });
}

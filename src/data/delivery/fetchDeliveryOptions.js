import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { addressRequirements } from '@/config/data/platformConfig';
import { configBus } from '@/config/configBus';

/**
 * Fetch delivery options.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise}
 */
export function fetchDeliveryOptions(carrier = configBus.currentCarrier) {
  return fetchFromEndpoint(
    'delivery_options',
    {
      method: METHOD_SEARCH,
      params: configBus.getRequestParameters(carrier),
    },
  );
}

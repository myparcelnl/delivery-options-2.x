import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { Delivery } from 'Sdk/src/endpoint/public/delivery';
import { configBus } from '@/config/configBus';

/**
 * Fetch delivery options.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise}
 */
export function fetchDeliveryOptions(carrier = configBus.currentCarrier) {
  return fetchFromEndpoint(Delivery, {
    method: METHOD_SEARCH,
    params: configBus.getRequestParameters(carrier),
  });
}

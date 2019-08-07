import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { Delivery } from 'Sdk/src/endpoint/public/delivery';
import { ERROR } from '@/config/data/eventConfig';
import { ERROR_NO_ADDRESS } from '@/config/data/appConfig';
import { configBus } from '@/config/configBus';

/**
 * Fetch delivery options.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise}
 */
export function fetchDeliveryOptions(carrier = configBus.currentCarrier) {
  // If the address is not filled in just throw an error immediately.
  if (!configBus.hasValidAddress) {
    return new Promise((resolve) => {
      configBus.$emit(ERROR, { address: ERROR_NO_ADDRESS });
      resolve({ response: [] });
    });
  }

  return fetchFromEndpoint(Delivery, {
    method: METHOD_SEARCH,
    params: configBus.getRequestParameters(carrier),
  });
}

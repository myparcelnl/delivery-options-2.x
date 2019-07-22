import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { Delivery } from 'Sdk/src/endpoint/delivery';
import { ERROR_NO_ADDRESS } from '@/config/appConfig';
import { configBus } from '@/config/configBus';
import demoDeliveryOptions from '@/config/demo/demoDeliveryOptions';

/**
 * Fetch delivery options.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise}
 */
export function fetchDeliveryOptions(carrier = configBus.currentCarrier) {
  const { cc, number, postalCode } = configBus.address;

  // If the address is not filled in just throw an error immediately.
  if (!cc || !postalCode || !number) {
    return new Promise((resolve) => {
      configBus.$emit('error', {address: ERROR_NO_ADDRESS});
      resolve({ response: [] });
    });
  }

  return fetchFromEndpoint(Delivery, {
    method: METHOD_SEARCH,
    params: configBus.getRequestParameters(carrier),
    mockData: demoDeliveryOptions,
  });
}

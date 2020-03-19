import { METHOD_SEARCH, fetchFromEndpoint } from '@/delivery-options/data/request/fetchFromEndpoint';
import { configBus } from '@/delivery-options/config/configBus';
import { getRequestParameters } from '@/delivery-options/data/request/getRequestParameters';

/**
 * Fetch delivery options.
 *
 * @param {MyParcel.CarrierName} carrier - Carrier name.
 *
 * @returns {Promise}
 */
export function fetchDeliveryOptions(carrier = configBus.currentCarrier) {
  return fetchFromEndpoint(
    'delivery_options',
    {
      method: METHOD_SEARCH,
      params: getRequestParameters(carrier),
    },
  );
}

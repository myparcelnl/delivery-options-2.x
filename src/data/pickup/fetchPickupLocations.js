import { METHOD_SEARCH, fetchFromEndpoint } from '@/data/request/fetchFromEndpoint';
import { configBus } from '@/config/configBus';
import { getRequestParameters } from '@/data/request/getRequestParameters';

/**
 * Fetch pickup options.
 *
 * @param {MyParcel.CarrierName} carrierName - Carrier name.
 * @param {Object} parameters - Request parameters which will be appended after getRequestParameters().
 * @returns {Promise}
 */
export async function fetchPickupLocations(carrierName, parameters = {}) {
  const data = await fetchFromEndpoint(
    'pickup_locations',
    {
      method: METHOD_SEARCH,
      params: {
        carrierName,
        ...{
          ...getRequestParameters(carrierName),
          ...parameters,
        },
      },
    },
  );

  /**
   * Add the carrier to the response.
   */
  return data.map((pickupLocation) => ({
    ...pickupLocation,
    carrier: configBus.getCarrierByName(carrierName),
  }));
}

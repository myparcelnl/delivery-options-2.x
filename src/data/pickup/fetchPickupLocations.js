import { METHOD_SEARCH, fetchFromEndpoint } from '@/data/request/fetchFromEndpoint';
import { configBus } from '@/config/configBus';
import { getRequestParameters } from '@/data/request/getRequestParameters';

/**
 * Fetch pickup options.
 *
 * @param {MyParcel.CarrierName} carrierName - Carrier name.
 *
 * @returns {Promise}
 */
export async function fetchPickupLocations(carrierName) {
  const data = await fetchFromEndpoint(
    'pickup_locations',
    {
      method: METHOD_SEARCH,
      params: {
        carrierName,
        ...getRequestParameters(carrierName),
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

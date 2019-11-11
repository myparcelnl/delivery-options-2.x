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

  data.response = data.response.map((res) => ({ ...res, carrier: configBus.getCarrierByName(carrierName) }));

  return data;
}

import { METHOD_SEARCH, fetchFromEndpoint } from '@/data/request/fetchFromEndpoint';
import { getRequestParameters } from '@/data/request/getRequestParameters';

/**
 * Fetch pickup options.
 *
 * @param {MyParcel.CarrierData} carrier - Carrier object.
 *
 * @returns {Promise}
 */
export async function fetchPickupLocations(carrier) {
  const data = await fetchFromEndpoint(
    'pickup_locations',
    {
      method: METHOD_SEARCH,
      params: {
        carrier,
        ...getRequestParameters(carrier.name),
      },
    },
  );

  data.response = data.response.map((res) => ({ ...res, carrier }));

  return data;
}

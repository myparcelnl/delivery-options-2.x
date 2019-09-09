import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { formatPickupResponse } from '@/data/pickup/formatPickupResponse';
import { getRequestParameters } from '@/services/getRequestParameters';

/**
 * Fetch pickup options.
 *
 * @param {MyParcel.Carrier} carrier - Carrier id or name.
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
        ...getRequestParameters(),
      },
    },
  );

  data.response = formatPickupResponse(data.response, carrier);

  return data;
}

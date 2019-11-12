import { METHOD_SEARCH, fetchFromEndpoint } from '@/data/request/fetchFromEndpoint';
import { formatCarrierResponse } from '@/data/carriers/formatCarrierResponse';

/**
 * Fetch carrier data.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise<Object>}
 */
export async function fetchCarrierData(carrier) {
  const data = await fetchFromEndpoint(
    'carriers',
    {
      method: METHOD_SEARCH,
      params: {
        carrier,
      },
    },
  );

  return formatCarrierResponse(data);
}

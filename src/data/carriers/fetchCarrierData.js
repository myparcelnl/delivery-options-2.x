import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { Carriers } from 'Sdk/src/endpoint/public/carriers';
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
    Carriers,
    {
      method: METHOD_SEARCH,
      params: {
        carrier,
      },
    },
    ['carrier']
  );

  data.response = formatCarrierResponse(data.response);

  return data;
}

import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { Carriers } from 'Sdk/src/endpoint/public/carriers';
import { formatCarrierData } from '@/data/carriers/formatCarrierData';

/**
 * Fetch carrier data.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise<Object>}
 */
export async function fetchCarrierData(carrier) {
  const data = await fetchFromEndpoint(Carriers, {
    method: METHOD_SEARCH,
  }, { carrier });

  if (Object.keys(data.response).length) {
    data.response = formatCarrierData(data.response);
  }

  return data;
}

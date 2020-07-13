import { METHOD_SEARCH, fetchFromEndpoint } from '@/delivery-options/data/request/fetchFromEndpoint';
import { formatCarrierResponse } from '@/delivery-options/data/carriers/formatCarrierResponse';

/**
 * Fetch carrier data.
 *
 * @param {MyParcel.CarrierNameOrId} carrier
 *
 * @returns {Promise<Object>}
 */
export async function fetchCarrierData(carrier = null) {
  const params = {};

  if (carrier) {
    params.carrier = carrier;
  }

  const data = await fetchFromEndpoint(
    'carriers',
    {
      method: METHOD_SEARCH,
      params,
    },
  );

  return formatCarrierResponse(data);
}

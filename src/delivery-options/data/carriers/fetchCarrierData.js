import { METHOD_SEARCH, fetchFromEndpoint } from '@/delivery-options/data/request/fetchFromEndpoint';
import { formatCarrierResponse } from '@/delivery-options/data/carriers/formatCarrierResponse';

/**
 * Fetch carrier data.
 *
 * @param {MyParcel.CarrierNameOrId} carrierNameOrId
 *
 * @returns {Promise<Object>}
 */
export async function fetchCarrierData(carrierNameOrId = null) {
  const params = {};

  if (carrierNameOrId) {
    params.carrier = carrierNameOrId;
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

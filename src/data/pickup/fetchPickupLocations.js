import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { addressRequirements } from '@/config/data/platformConfig';
import { configBus } from '@/config/configBus';
import { formatPickupResponse } from '@/data/pickup/formatPickupResponse';

const parameterMapping = {
  postalCode: 'postal_code',
};

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
        ...configBus.getRequestParameters(),
      },
    },
    addressRequirements[configBus.address.cc].map((item) => parameterMapping[item] || item)
  );

  data.response = formatPickupResponse(data.response, carrier);

  return data;
}

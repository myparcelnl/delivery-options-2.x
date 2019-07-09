import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { CARRIER_POSTNL } from '@/config/formConfig';
import { Carriers } from 'Sdk/src/endpoint/carriers';
import { appConfig } from '@/config/appConfig';
import demoCarriers from '@/config/demo/demoCarriers';
import { mockEndpoint } from '@/services/mockEndpoint';

/**
 * Fetch carrier data.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise<Object>}
 */
export async function fetchCarrierData(carrier = CARRIER_POSTNL) {
  return mockEndpoint(Carriers, demoCarriers);

  const response = await fetchFromEndpoint(Carriers, {
    method: METHOD_SEARCH,
    mockData: demoCarriers,
  }, { carrier });

  response.response = response.response.reduce((acc, response) => {
    const { meta, name, id, human } = response;

    return [{
      ...acc,
      id,
      name,
      label: human,
      image: `${appConfig.assetsUrl}/${meta.logo_svg}`,
    }];
  }, {});

  if (!Object.keys(response.errors).length) {
    response.errors = [];
  }

  return response;
}

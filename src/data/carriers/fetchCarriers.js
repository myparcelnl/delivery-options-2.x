import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
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
export async function fetchCarrierData(carrier = 1) {
  // return mockEndpoint(Carriers, demoCarriers);

  const data = await fetchFromEndpoint(Carriers, {
    method: METHOD_SEARCH,
    mockData: demoCarriers,
  }, { carrier });

  if (Object.keys(data.response).length > 1) {
    data.response = data.response.reduce((acc, response) => {
      const { meta, name, id, human } = response;

      return [{
        ...acc,
        id,
        name,
        label: human,
        image: `${appConfig.assetsUrl}/${meta.logo_svg}`,
      }];
    }, {});
  }

  return data;
}

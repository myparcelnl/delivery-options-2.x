import { METHOD_SEARCH, fetchFromEndpoint } from '@/services/fetchFromEndpoint';
import { CARRIER_POSTNL } from '@/config/formConfig';
import { Carriers } from 'Sdk/src/endpoint/carriers';

/**
 * Fetch carrier data.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise<Object>}
 */
export function fetchCarrierData(carrier = CARRIER_POSTNL) {
  return fetchFromEndpoint(Carriers, {
    method: METHOD_SEARCH,
    params: {
      carrier,
    },
  });

  // const carriersEndpoint = new Carriers(null, new URL(this.apiURL));
  //
  // try {
  //   let response;
  //
  //   // if (configBus.mock) {
  //   //   response = await new Promise((resolve) => {
  //   //     setTimeout(() => {
  //   //       resolve(demoDeliveryOptions);
  //   //     }, configBus.mockDelay || 0);
  //   //   });
  //   // } else {
  //   response = await carriersEndpoint.search(configBus.getRequestParameters);
  //   // }
  //
  //   if (response.hasOwnProperty('errors')) {
  //     this.errors.carriers = response.errors;
  //   } else {
  //     this.carriers = response.length ? response : null;
  //   }
  // } catch (e) {
  //   this.errors.carriers = e;
  //   console.error(e);
  // }
}

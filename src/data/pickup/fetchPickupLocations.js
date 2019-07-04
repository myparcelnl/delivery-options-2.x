import { METHOD_SEARCH, fetchFromEndpoint } from '../../services/fetchFromEndpoint';
import { Pickup } from '../../../myparcel-js-sdk/src/endpoint/pickup';
import { configBus } from '../../config/configBus';
import demoPickupOptions from '../../config/demo/demoPickupOptions';

/**
 * Fetch pickup options.
 *
 * @returns {Promise}
 */
export function fetchPickupOptions() {
  const { cc, number, postalCode } = configBus.address;

  if (!cc || !postalCode || !number) {
    return new Promise((resolve) => resolve({ errors: true, response: {} }));
  }

  return fetchFromEndpoint(Pickup, {
    method: METHOD_SEARCH,
    params: configBus.getRequestParameters(),
    mockData: demoPickupOptions,
  });

  // const pickupOptionsEndpoint = new Pickup(null, new URL(configBus.apiURL));
  //
  // try {
  //   let response;
  //   const pickupOptions = await pickupOptionsEndpoint.search(configBus.getRequestParameters);
  //
  //   if (configBus.mock) {
  //     response = await new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(demoPickupOptions);
  //       }, configBus.mockDelay || 0);
  //     });
  //   } else {
  //     response = await pickupOptionsEndpoint.search(configBus.getRequestParameters);
  //   }
  //
  //   if (response.hasOwnProperty('errors')) {
  //     this.errors.pickup = response.errors;
  //   } else {
  //     this.pickupOptions = pickupOptions.length ? pickupOptions : null;
  //   }
  // } catch (e) {
  //   this.errors = true;
  //   console.error(e);
  // }
}

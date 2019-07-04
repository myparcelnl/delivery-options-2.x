import { ERROR_NO_ADDRESS, appConfig } from '../../config/appConfig';
import { METHOD_SEARCH, fetchFromEndpoint } from '../../services/fetchFromEndpoint';
import { Delivery } from '../../../myparcel-js-sdk/src/endpoint/delivery';
import { configBus } from '../../config/configBus';
import demoDeliveryOptions from '../../config/demo/demoDeliveryOptions';

/**
 * Fetch delivery options.
 *
 * @param {string|number} carrier - Carrier name or id.
 *
 * @returns {Promise}
 */
export function fetchDeliveryOptions(carrier = configBus.currentCarrier) {
  const { cc, number, postalCode } = configBus.address;

  if (!cc || !postalCode || !number) {
    return new Promise((resolve) => resolve({ errors: ERROR_NO_ADDRESS, response: {} }));
  }

  return fetchFromEndpoint(Delivery, {
    method: METHOD_SEARCH,
    params: configBus.getRequestParameters(carrier),
    mockData: demoDeliveryOptions,
  });

  // const deliveryOptionsEndpoint = new Delivery(null, new URL(configBus.apiURL));

  // try {
  //   let response;
  //
  //   if (configBus.mock) {
  //     response = await new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(demoDeliveryOptions);
  //       }, configBus.mockDelay || 0);
  //     });
  //   } else {
  //     const carrier = 1;
  //     response = await deliveryOptionsEndpoint.search(configBus.getRequestParameters(carrier));
  //   }
  //
  //   if (response.hasOwnProperty('errors')) {
  //     this.errors.delivery = response.errors;
  //   } else {
  //     this.deliveryOptions = response.length ? response : null;
  //   }
  // } catch (e) {
  //   this.errors.delivery = e;
  //   console.error(e);
  // }
}

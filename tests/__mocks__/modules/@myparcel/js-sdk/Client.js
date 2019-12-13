import { METHOD_SEARCH } from '@/data/request/fetchFromEndpoint';
import { fakeCarriersResponse } from './fakeCarriersResponse';
import { fakeDeliveryOptionsResponse } from './fakeDeliveryOptionsResponse';
import { fakePickupLocationsResponse } from './fakePickupLocationsResponse';

const fakeResponses = {
  carriers: fakeCarriersResponse,
  delivery_options: fakeDeliveryOptionsResponse,
  pickup_locations: fakePickupLocationsResponse,
};

const fakeRequest = (endpoint) => {
  return new Promise((resolve) => resolve(fakeResponses[endpoint]));
};

/**
 * @param {String} method - Method to use.
 * @param {String} endpoint - Endpoint to use.
 *
 * @returns {Object}
 */
const mock = (method, endpoint) => ({ [method]: () => fakeRequest(endpoint) });

export default class Client {
  config = {
    acceptLanguage: null,
    url: null,
  };

  carriers = { ...mock(METHOD_SEARCH, 'carriers') };
  delivery_options = { ...mock(METHOD_SEARCH, 'delivery_options') };
  pickup_locations = { ...mock(METHOD_SEARCH, 'pickup_locations') };
}

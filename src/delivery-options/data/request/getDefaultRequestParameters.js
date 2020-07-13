import * as CONFIG from '@/data/keys/configKeys';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * Get the default parameters for all API requests.
 *
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {Object}
 */
export const getDefaultRequestParameters = (configBus = realConfigBus) => {
  const parameters = {
    /**
     * The endpoints we use in this application follow the JSON API "Inclusion of Related Resources" standard.
     *
     * @see https://jsonapi.org/format/#fetching-includes
     */
    include: 'shipment_options',

    platform: configBus.get(CONFIG.PLATFORM),
    carrier: configBus.currentCarrier,
  };

  const addressValues = {
    cc: configBus.address.cc,
    city: configBus.address.city,
    number: configBus.address.number,
    postal_code: configBus.address.postalCode,
  };

  Object.keys(addressValues).forEach((key) => {
    /**
     * Skip undefined items.
     */
    if (!addressValues[key]) {
      return;
    }

    parameters[key] = addressValues[key];
  });

  return parameters;
};

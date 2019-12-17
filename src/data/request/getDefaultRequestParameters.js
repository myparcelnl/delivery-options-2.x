import * as SETTINGS from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';

/**
 * Get the default parameters for all API requests.
 *
 * @returns {Object}
 */
export const getDefaultRequestParameters = () => {
  const parameters = {
    /**
     * The endpoints we use in this application follow the JSON API "Inclusion of Related Resources" standard.
     *
     * @see https://jsonapi.org/format/#fetching-includes
     */
    include: 'shipment_options',

    platform: configBus.get(SETTINGS.PLATFORM),
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

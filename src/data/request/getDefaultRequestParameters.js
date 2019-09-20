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

  /**
   * Skip undefined entries, if any.
   */
  Object.keys(addressValues).forEach((key) => {
    parameters[key] = addressValues[key];

    if (!!addressValues[key]) {
      /**
       * TODO: https://jira.dmp.zone/browse/MY-14888.
       *  This is a temporary workaround for the validation for the dpd endpoint; It gives a 422 response if there are
       *  location parameters it does not expect, city in this case. Can be removed once above story is fixed.
       */
      if (configBus.currentCarrier === 'dpd' && parameters[key] === 'city') {
        return;
      }

      parameters[key] = addressValues[key];
    }
  });

  return parameters;
};

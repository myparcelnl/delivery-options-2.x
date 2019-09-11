import * as SETTINGS from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';

/**
 * Get the default parameters for all API requests.
 *
 * @returns {Object}
 */
export const getDefaultRequestParameters = () => ({
  /**
   * The endpoints we use in this application follow the JSON API "Inclusion of Related Resources" standard.
   *
   * @see https://jsonapi.org/format/#fetching-includes
   */
  include: 'shipment_options',

  platform: configBus.get(SETTINGS.PLATFORM),
  carrier: configBus.currentCarrier,

  cc: configBus.address.cc,
  postal_code: configBus.address.postalCode,
  number: configBus.address.number,
});

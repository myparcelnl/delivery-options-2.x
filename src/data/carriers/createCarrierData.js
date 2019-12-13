import * as SETTINGS from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';

/**
 * Create the array of carrier data, deduping and adding pickup/delivery settings.
 *
 * @param {Array} data - Data.
 *
 * @returns {Array}
 */
export function createCarrierData(data) {
  const unique = new Set(data.map((obj) => JSON.stringify(obj)));
  const array = Array.from(unique).map((obj) => JSON.parse(obj));

  return array.map((carrier) => ({
    ...carrier,
    pickupEnabled: configBus.get(SETTINGS.ALLOW_PICKUP_LOCATIONS, null, carrier.name) || false,
    deliveryEnabled: configBus.get(SETTINGS.ALLOW_DELIVERY_OPTIONS, null, carrier.name) || false,
  }));
}

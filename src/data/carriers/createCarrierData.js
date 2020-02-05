import * as SETTINGS from '@/config/data/settingsConfig';
import {
  getAllowedCountriesForCarrierDeliver,
  getAllowedCountriesForCarrierPickup,
} from '@/config/data/countryConfig';
import { configBus } from '@/config/configBus';

/**
 * Create the array of carrier data, deduping and adding pickup/delivery settings.
 *
 * @param {Array} data - Data.
 *
 * @returns {Array}
 */
export function createCarrierData(data) {
  return data.map((carrier) => ({
    ...carrier,
    pickupEnabled: configBus.get(SETTINGS.ALLOW_PICKUP_LOCATIONS, 'name', carrier.name) || false,
    deliveryEnabled: configBus.get(SETTINGS.ALLOW_DELIVERY_OPTIONS, 'name', carrier.name) || false,
    pickupCountries: getAllowedCountriesForCarrierPickup(carrier.name),
    deliverCountries: getAllowedCountriesForCarrierDeliver(carrier.name),
  }));
}

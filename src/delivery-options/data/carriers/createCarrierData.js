import * as CONFIG from '@/data/keys/configKeys';
import {
  getAllowedCountriesForCarrierDeliver,
  getAllowedCountriesForCarrierPickup,
} from '@/config/countryConfig';
import { configBus } from '@/delivery-options/config/configBus';

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
    pickupEnabled: configBus.get(CONFIG.ALLOW_PICKUP_LOCATIONS, 'name', carrier.name) || false,
    deliveryEnabled: configBus.get(CONFIG.ALLOW_DELIVERY_OPTIONS, 'name', carrier.name) || false,
    pickupCountries: getAllowedCountriesForCarrierPickup(carrier.name),
    deliverCountries: getAllowedCountriesForCarrierDeliver(carrier.name),
  }));
}

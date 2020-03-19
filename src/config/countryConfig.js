import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { PLATFORM } from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';

/**
 * The base allowed country codes for each platform.
 *
 * @type {Object.<Array>}
 */
export const allowedCountries = {
  [MYPARCEL]: ['nl', 'be'],
  [SENDMYPARCEL]: ['nl', 'be'],
};

/**
 * Country codes per carrier which allow pickup locations.
 *
 * @type {Object<MyParcel.CarrierName,String[]>}
 */
export const allowedCountriesForCarrierPickup = {
  dpd: [
    'at',
    'be',
    'de',
    'dk',
    'fi',
    'fr',
    'gb',
    'nl',
    'pt',
  ],
};

/**
 * Country codes per carrier which allow delivery options.
 *
 * @type {Object<MyParcel.CarrierName,String[]>}
 */
export const allowedCountriesForCarrierDeliver = {};

export const getAllowedCountriesForCarrierPickup = (carrier) => {
  return allowedCountriesForCarrierPickup[carrier] || allowedCountries[configBus.get(PLATFORM)];
};

export const getAllowedCountriesForCarrierDeliver = (carrier) => {
  return allowedCountriesForCarrierDeliver[carrier] || allowedCountries[configBus.get(PLATFORM)];
};

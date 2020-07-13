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
 * Country code for delivery.
 *
 * @type {String[]}
 */
const countries = [
  'at',
  'be',
  'bg',
  'cy',
  'cz',
  'de',
  'dk',
  'ee',
  'es',
  'fi',
  'fr',
  'gb',
  'gr',
  'hu',
  'hr',
  'ie',
  'it',
  'lt',
  'lu',
  'lv',
  'mt',
  'nl',
  'pl',
  'pt',
  'ro',
  'se',
  'si',
  'sk',
];

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
export const allowedCountriesForCarrierDeliver = {
  dpd: countries,
  postnl: countries,
  bpost: countries,
};

export const getAllowedCountriesForCarrierPickup = (carrier) => {
  return allowedCountriesForCarrierPickup[carrier] || allowedCountries[configBus.get(PLATFORM)];
};

export const getAllowedCountriesForCarrierDeliver = (carrier) => {
  return allowedCountriesForCarrierDeliver[carrier] || allowedCountries[configBus.get(PLATFORM)];
};

import * as SETTINGS from './settingsConfig';

export const FLESPAKKET = 'flespakket';
export const MYPARCEL = 'myparcel';
export const SENDMYPARCEL = 'belgie';

export const DEFAULT_PLATFORM = MYPARCEL;

const isDev = process.env.NODE_ENV === 'development';

export const addressRequirements = {
  NL: ['cc', 'postalCode', 'number'],
  BE: ['cc', 'city', 'number', 'postalCode'],
};

export const addressNL = {
  cc: 'NL',
  city: 'Amsterdam',
  number: '576',
  postalCode: '1025WK',
};

export const addressBE = {
  cc: 'BE',
  city: 'Antwerpen',
  number: '16',
  postalCode: '2000',
};

export const configBE = {
  [SETTINGS.ALLOW_SATURDAY_DELIVERY]: 1,
  [SETTINGS.API_BASE_URL]: isDev ? 'http://api.dev.sendmyparcel.be' : 'https://api.sendmyparcel.be',
  [SETTINGS.CARRIERS]: ['bpost', 'dpd'],
  [SETTINGS.LOCALE]: 'nl-BE',
};

export const configNL = {
  [SETTINGS.ALLOW_MONDAY_DELIVERY]: 1,
  [SETTINGS.API_BASE_URL]: isDev ? 'http://api.dev.myparcel.nl' : 'https://api.myparcel.nl',
  [SETTINGS.CARRIERS]: ['postnl'],
  [SETTINGS.LOCALE]: 'nl-NL',
  [SETTINGS.SATURDAY_CUTOFF_TIME]: '16:00',
  carrierSettings: {
    postnl: {
      [SETTINGS.PRICE_SIGNATURE]: .35,
      [SETTINGS.PRICE_PICKUP_EXPRESS]: -1,
    },
  },
};

export const stringsBE = {
  [SETTINGS.SATURDAY_DELIVERY_TITLE]: 'saturday_delivery_title',
  [SETTINGS.WRONG_POSTAL_CODE_CITY]: 'Combinatie postcode/plaats onbekend',
};

export const stringsNL = {
  [SETTINGS.BE_DELIVERY_STANDARD_TITLE]: 'Standard delivery',
  [SETTINGS.BE_DELIVERY_TITLE]: 'Delivery',
  [SETTINGS.WRONG_HOUSE_NUMBER_POSTCODE]: 'House number/postcode combination unknown',
};

export const addressByPlatform = {
  [SENDMYPARCEL]: addressBE,
  [MYPARCEL]: addressNL,
  [FLESPAKKET]: addressNL,
};

export const stringsByPlatform = {
  [SENDMYPARCEL]: stringsBE,
  [MYPARCEL]: stringsNL,
  [FLESPAKKET]: stringsNL,
};

export const configByPlatform = {
  [SENDMYPARCEL]: configBE,
  [MYPARCEL]: configNL,
  [FLESPAKKET]: configNL,
};

/**
 * @param {Object} map - Map to getPlatformMap var from.
 * @param {String} platform - Platform name.
 * @returns {Object}
 */
export const getPlatformMap = (map, platform) => {
  return map.hasOwnProperty(platform) ? map[platform] : {};
};

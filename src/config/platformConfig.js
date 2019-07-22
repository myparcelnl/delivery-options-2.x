export const FLESPAKKET = 'flespakket';
export const MYPARCEL = 'myparcel';
export const SENDMYPARCEL = 'sendmyparcel';

export const addressNL = {
  cc: 'NL',
  postalCode: '1025WK',
  number: '576',
  city: 'Amsterdam',
};

export const addressBE = {
  cc: 'BE',
  postalCode: '2000',
  number: '16',
  city: 'Antwerpen',
};

export const configBE = {
  apiBaseUrl: process.env.NODE_ENV === 'development' ? 'http://api.dev.sendmyparcel.be' : 'https://api.sendmyparcel.be',
  carriers: 'bpost,dpd',
  allowSaturdayDelivery: 1,
};

export const configNL = {
  apiBaseUrl: process.env.NODE_ENV === 'development' ? 'http://api.dev.myparcel.nl' : 'https://api.myparcel.nl',
  carriers: 'postnl',
  saturdayCutoffTime: '16:00',
  allowMondayDelivery: 1,
};

export const stringsBE = {
  wrongPostalCodeCity: 'Combinatie postcode/plaats onbekend',
  saturdayDeliveryTitle: 'saturday_delivery_title',
};

export const stringsNL = {
  wrongHouseNumberPostcode: 'House number/postcode combination unknown',
  BEdeliveryStandardTitle: 'Standard delivery',
  BEdeliveryTitle: 'Delivery',
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

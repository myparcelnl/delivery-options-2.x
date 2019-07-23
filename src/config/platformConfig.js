export const FLESPAKKET = 'flespakket';
export const MYPARCEL = 'myparcel';
export const SENDMYPARCEL = 'sendmyparcel';

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
  allowSaturdayDelivery: 1,
  apiBaseUrl: process.env.NODE_ENV === 'development' ? 'http://api.dev.sendmyparcel.be' : 'https://api.sendmyparcel.be',
  carriers: 'bpost,dpd',
  locale: 'nl-BE',
};

export const configNL = {
  allowMondayDelivery: 1,
  apiBaseUrl: process.env.NODE_ENV === 'development' ? 'http://api.dev.myparcel.nl' : 'https://api.myparcel.nl',
  carriers: 'postnl',
  locale: 'nl-NL',
  saturdayCutoffTime: '16:00',
  carrierSettings: {
    postnl: {
      priceSignature: .35,
      pricePickupExpress: -1,
    },
  },
};

export const stringsBE = {
  saturdayDeliveryTitle: 'saturday_delivery_title',
  wrongPostalCodeCity: 'Combinatie postcode/plaats onbekend',
};

export const stringsNL = {
  BEdeliveryStandardTitle: 'Standard delivery',
  BEdeliveryTitle: 'Delivery',
  wrongHouseNumberPostcode: 'House number/postcode combination unknown',
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

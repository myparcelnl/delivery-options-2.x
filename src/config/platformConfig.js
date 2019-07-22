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
  apiBaseUrl: 'https://api.dev.sendmyparcel.be/',
  carriers: 'bpost,dpd',
  allowSaturdayDelivery: 1,
};

export const configNL = {
  apiBaseUrl: 'https://api.dev.myparcel.nl/',
  carriers: 'postnl',
  allowMondayDelivery: 1,
  allowEveningDelivery: 1,
  allowMorningDelivery: 1,
  allowOnlyRecipient: 1,
  allowPickupExpress: 1,
  pricePickupExpress: 3.95,
  saturdayCutoffTime: '16:00',
};

export const stringsBE = {
  onlyRecipientTitle: 'Home address only',
  wrongPostalCodeCity: 'Combinatie postcode/plaats onbekend',
  saturdayDeliveryTitle: 'saturday_delivery_title',
};

export const stringsNL = {
  onlyRecipientTitle: 'Home address only',
  deliveryEveningTitle: 'Evening delivery',
  deliveryMorningTitle: 'Morning delivery',
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

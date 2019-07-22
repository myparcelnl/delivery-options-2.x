import { addressByPlatform, configByPlatform, getPlatformMap, stringsByPlatform } from '@/config/platformConfig';

/**
 * Base checkout configuration.
 *
 * @type {Object}
 */
const baseConfig = {
  config: {
    allowDeliveryOptions: 1,
    allowPickupPoints: 1,
    allowSignature: 1,
    currency: 'EUR',
    cutoffTime: '17:00',
    deliverydaysWindow: 1,
    dropOffDays: '1;2;3;4',
    dropoffDelay: 1,
    priceEveningDelivery: 7.99,
    priceMorningDelivery: 8.99,
    priceOnlyRecipient: 0.23,
    pricePickup: -1,
    priceSignature: -0.35,
    priceStandardDelivery: 5.85,
  },

  strings: {
    // Address strings
    city: 'Plaats',
    postcode: 'Postcode',
    houseNumber: 'Huisnummer',
    addressNotFound: 'Adresgegevens niet ingevuld',

    // Other strings
    retry: 'Opnieuw proberen',
    again: 'Again',
    closed: 'Gesloten',

    // Titles of options
    deliveryStandardTitle: '',
    deliveryTitle: 'Bezorgen op',
    // headerDeliveryOptions: 'Delivery options', // unused
    pickUpFrom: 'Afhalen vanaf',
    pickupTitle: 'Afhalen op locatie',
    signatureTitle: 'Handtekening',
    // quickDelivery: 'Deliver as quickly as possible', // unused

    // Opening hours and weekdays
    openingHours: 'Openingstijden',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
};

/**
 * Get the default config for given platform. Gets the base config, sets platform and appends platform specific
 * variables, if any.
 *
 * @param {string} platform - Platform name.
 *
 * @returns {Object}
 */
export const defaultConfig = (platform) => {
  baseConfig.config.platform = platform;
  baseConfig.config = { ...baseConfig.config, ...getPlatformMap(configByPlatform, platform) };
  baseConfig.address = { ...baseConfig.address, ...getPlatformMap(addressByPlatform, platform) };
  baseConfig.strings = { ...baseConfig.strings, ...getPlatformMap(stringsByPlatform, platform) };

  console.log(baseConfig);
  return baseConfig;
};

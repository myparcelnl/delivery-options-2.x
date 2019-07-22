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
    currency: 'EUR',
    cutoffTime: '17:00',
    deliveryDaysWindow: 1,
    dropOffDays: '1;2;3;4',
    dropOffDelay: 1,

    allowEveningDelivery: 1,
    allowMorningDelivery: 1,
    allowOnlyRecipient: 1,
    allowPickupExpress: 1,
    pricePickupExpress: 3.95,
    allowSignature: 1,

    priceEveningDelivery: 0,
    priceMorningDelivery: 0,
    priceOnlyRecipient: 0,
    pricePickup: 0,
    priceSignature: 0,
    priceStandardDelivery: 0,

    carrierSettings: {},
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
    deliveryEveningTitle: 'Evening delivery',
    deliveryMorningTitle: 'Morning delivery',
    deliveryStandardTitle: '',
    deliveryTitle: 'Bezorgen op',
    onlyRecipientTitle: 'Home address only',
    pickUpFrom: 'Afhalen vanaf',
    pickupTitle: 'Afhalen op locatie',
    signatureTitle: 'Handtekening',

    // headerDeliveryOptions: 'Delivery options', // unused
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

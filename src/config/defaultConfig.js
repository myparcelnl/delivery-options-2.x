import * as SETTINGS from '@/config/settingsConfig';
import {
  DEFAULT_PLATFORM,
  addressByPlatform,
  configByPlatform,
  getPlatformMap,
  stringsByPlatform,
} from '@/config/platformConfig';

/**
 * Base checkout configuration.
 *
 * @type {MyParcelCheckout.Configuration}
 */
const baseConfig = {
  /**
   * @type {MyParcelCheckout.Config}
   */
  config: {
    [SETTINGS.PLATFORM]: DEFAULT_PLATFORM,
    [SETTINGS.CURRENCY]: 'EUR',

    [SETTINGS.CUTOFF_TIME]: '17:00',
    [SETTINGS.DELIVERY_DAYS_WINDOW]: 7,
    [SETTINGS.DROP_OFF_DAYS]: '1;2;3;4',
    [SETTINGS.DROP_OFF_DELAY]: 0,

    [SETTINGS.ALLOW_DELIVERY_OPTIONS]: 1,
    [SETTINGS.ALLOW_EVENING_DELIVERY]: 1,
    [SETTINGS.ALLOW_MORNING_DELIVERY]: 1,
    [SETTINGS.ALLOW_ONLY_RECIPIENT]: 1,
    [SETTINGS.ALLOW_PICKUP_EXPRESS]: 1,
    [SETTINGS.ALLOW_PICKUP_POINTS]: 1,
    [SETTINGS.ALLOW_SIGNATURE]: 1,

    [SETTINGS.PRICE_EVENING_DELIVERY]: 0,
    [SETTINGS.PRICE_MORNING_DELIVERY]: 0,
    [SETTINGS.PRICE_ONLY_RECIPIENT]: 0,
    [SETTINGS.PRICE_PICKUP]: 0,
    [SETTINGS.PRICE_PICKUP_EXPRESS]: 0,
    [SETTINGS.PRICE_SIGNATURE]: 0,
    [SETTINGS.PRICE_STANDARD_DELIVERY]: 0,

    [SETTINGS.CARRIER_SETTINGS]: {},
  },

  /**
   * @type {MyParcelCheckout.Strings}
   */
  strings: {
    // Address strings
    [SETTINGS.CITY]: 'Plaats',
    [SETTINGS.POSTCODE]: 'Postcode',
    [SETTINGS.HOUSE_NUMBER]: 'Huisnummer',
    [SETTINGS.ADDRESS_NOT_FOUND]: 'Adresgegevens niet ingevuld',

    // Other strings
    // [SETTINGS.AGAIN]: 'Again',
    [SETTINGS.CLOSED]: 'Gesloten',
    [SETTINGS.DISCOUNT]: 'korting',
    [SETTINGS.FREE]: 'Gratis',
    [SETTINGS.FROM]: 'Vanaf',
    [SETTINGS.LOAD_MORE]: 'Laad meer',
    [SETTINGS.RETRY]: 'Opnieuw proberen',

    // Titles of options
    [SETTINGS.DELIVERY_EVENING_TITLE]: 'Evening delivery',
    [SETTINGS.DELIVERY_MORNING_TITLE]: 'Morning delivery',
    [SETTINGS.DELIVERY_STANDARD_TITLE]: '',
    [SETTINGS.DELIVERY_TITLE]: 'Bezorgen op',
    [SETTINGS.ONLY_RECIPIENT_TITLE]: 'Home address only',
    [SETTINGS.PICK_UP_FROM]: 'Afhalen vanaf',
    [SETTINGS.PICKUP_TITLE]: 'Afhalen op locatie',
    [SETTINGS.SIGNATURE_TITLE]: 'Handtekening',

    // Opening hours and weekdays
    [SETTINGS.OPENING_HOURS]: 'Openingstijden',
  },
};

/**
 * Get the default config for given platform. Gets the base config, sets platform and appends platform specific
 * variables, if any.
 *
 * @param {MyParcelCheckout.Platform} platform - Platform name.
 *
 * @returns {MyParcelCheckout.Configuration}
 */
export const defaultConfig = (platform) => {
  baseConfig.config.platform = platform;
  baseConfig.config = { ...baseConfig.config, ...getPlatformMap(configByPlatform, platform) };
  baseConfig.address = { ...baseConfig.address, ...getPlatformMap(addressByPlatform, platform) };
  baseConfig.strings = { ...baseConfig.strings, ...getPlatformMap(stringsByPlatform, platform) };

  return baseConfig;
};

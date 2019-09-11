import * as SETTINGS from '@/config/data/settingsConfig';
import {
  DEFAULT_PLATFORM,
  platformConfig,
} from '@/config/data/platformConfig';
import _mergeWith from 'lodash.mergewith';

/**
 * Base checkout configuration.
 *
 * @type {MyParcel.CheckoutConfiguration}
 */
const baseConfig = {
  /**
   * @type {MyParcel.CheckoutConfig}
   */
  config: {
    [SETTINGS.PLATFORM]: DEFAULT_PLATFORM,
    [SETTINGS.CURRENCY]: 'EUR',

    [SETTINGS.FEATURE_ALLOW_RETRY]: true,
    [SETTINGS.FEATURE_USE_LEGACY]: false,

    [SETTINGS.ALLOW_DELIVERY_OPTIONS]: true,
    [SETTINGS.ALLOW_EVENING_DELIVERY]: true,
    [SETTINGS.ALLOW_MORNING_DELIVERY]: true,
    [SETTINGS.ALLOW_ONLY_RECIPIENT]: true,
    [SETTINGS.ALLOW_PICKUP_EXPRESS]: true,
    [SETTINGS.ALLOW_PICKUP_LOCATIONS]: true,
    [SETTINGS.ALLOW_SIGNATURE]: true,

    [SETTINGS.PRICE_EVENING_DELIVERY]: 0,
    [SETTINGS.PRICE_MORNING_DELIVERY]: 0,
    [SETTINGS.PRICE_ONLY_RECIPIENT]: 0,
    [SETTINGS.PRICE_PICKUP]: 0,
    [SETTINGS.PRICE_PICKUP_EXPRESS]: 0,
    [SETTINGS.PRICE_SIGNATURE]: 0,
    [SETTINGS.PRICE_STANDARD_DELIVERY]: 0,

    [SETTINGS.CARRIER_SETTINGS]: {},

    [SETTINGS.FEATURE_MAX_PAGE_ITEMS]: 5,
  },

  /**
   * @type {MyParcel.CheckoutStrings}
   */
  strings: {
    // Address strings
    [SETTINGS.CITY]: 'Plaats',
    [SETTINGS.POSTCODE]: 'Postcode',
    [SETTINGS.HOUSE_NUMBER]: 'Huisnummer',
    [SETTINGS.ADDRESS_NOT_FOUND]: 'Adresgegevens niet ingevuld',

    // Other strings
    [SETTINGS.CLOSED]: 'Gesloten',
    [SETTINGS.DISCOUNT]: 'korting',
    [SETTINGS.FREE]: 'Gratis',
    [SETTINGS.FROM]: 'Vanaf',
    [SETTINGS.LOAD_MORE]: 'Laad meer',
    [SETTINGS.RETRY]: 'Opnieuw',

    // Main header
    [SETTINGS.HEADER_DELIVERY_OPTIONS]: '',

    // Titles of options
    [SETTINGS.DELIVERY_EVENING_TITLE]: '',
    [SETTINGS.DELIVERY_MORNING_TITLE]: '',
    [SETTINGS.DELIVERY_STANDARD_TITLE]: '',
    [SETTINGS.DELIVERY_TITLE]: 'Thuis of op het werk bezorgen',
    [SETTINGS.ONLY_RECIPIENT_TITLE]: 'Alleen ontvanger',
    [SETTINGS.PICK_UP_FROM]: 'Afhalen vanaf',
    [SETTINGS.PICKUP_TITLE]: 'Afhalen op locatie',
    [SETTINGS.SIGNATURE_TITLE]: 'Handtekening voor ontvangst',

    // Opening hours
    [SETTINGS.OPENING_HOURS]: 'Openingstijden',
  },
};

/**
 * Get the default config for given platform. Gets the base config, sets platform and appends platform specific
 * variables, if any.
 *
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {MyParcel.CheckoutConfiguration}
 */
export const defaultConfig = (platform) => {
  baseConfig.config.platform = platform;

  return _mergeWith({}, baseConfig, platformConfig(platform), () => {});
};

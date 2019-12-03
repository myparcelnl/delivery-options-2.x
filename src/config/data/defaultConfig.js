import * as SETTINGS from '@/config/data/settingsConfig';
import {
  DEFAULT_PLATFORM,
  platformConfig,
} from '@/config/data/platformConfig';
import _mergeWith from 'lodash.mergewith';

/**
 * Base delivery options configuration.
 *
 * @type {MyParcelDeliveryOptions.Configuration}
 */
const baseConfig = {
  /**
   * @type {MyParcelDeliveryOptions.Configuration}
   */
  config: {
    [SETTINGS.PLATFORM]: DEFAULT_PLATFORM,
    [SETTINGS.CURRENCY]: 'EUR',

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

    [SETTINGS.FEATURE_ALLOW_RETRY]: true,
    [SETTINGS.FEATURE_PICKUP_LOCATIONS_MAP]: false,
    [SETTINGS.FEATURE_MAX_PAGE_ITEMS]: 5,

    /**
     * Default leaflet tile layer data.
     */
    [SETTINGS.PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA]: {
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      // eslint-disable-next-line max-len
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      maxZoom: 19,
    },
  },

  /**
   * @type {MyParcel.Strings}
   */
  strings: {
    // Address strings
    [SETTINGS.CITY]: 'Plaats',
    [SETTINGS.POSTAL_CODE]: 'Postcode',
    [SETTINGS.NUMBER]: 'Huisnummer',
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
    [SETTINGS.OPTIONS]: 'Opties',

    [SETTINGS.PICKUP_LOCATIONS_LIST_BUTTON]: 'Lijst',
    [SETTINGS.PICKUP_LOCATIONS_MAP_BUTTON]: 'Kaart',
  },
};

/**
 * Get the default config for given platform. Gets the base config, sets platform and appends platform specific
 * variables, if any.
 *
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {MyParcelDeliveryOptions.Configuration}
 */
export const defaultConfig = (platform = DEFAULT_PLATFORM) => {
  baseConfig.config.platform = platform;

  return _mergeWith({}, baseConfig, platformConfig(platform));
};

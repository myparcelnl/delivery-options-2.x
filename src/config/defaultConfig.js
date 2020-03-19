/* eslint-disable max-lines-per-function */
import * as ADDRESS from '@/data/keys/addressKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as STRINGS from '@/data/keys/stringsKeys';
import { DEFAULT_PLATFORM, DEFAULT_PRICE } from '@/data/keys/settingsConsts';
import merge from 'lodash-es/merge';
import { platformConfig } from '@/config/platformConfig';

/**
 * Get the default config for given platform. Gets the base config, sets platform and appends platform specific
 * variables, if any.
 *
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {MyParcelDeliveryOptions.Configuration}
 */
export const defaultConfig = (platform = DEFAULT_PLATFORM) => {
  /**
   * Base delivery options configuration.
   *
   * @type {MyParcelDeliveryOptions.Configuration}
   */
  const baseConfig = {
    [ADDRESS.KEY]: {},

    /**
     * @type {MyParcelDeliveryOptions.Config}
     */
    [CONFIG.KEY]: {
      [CONFIG.PLATFORM]: DEFAULT_PLATFORM,
      [CONFIG.CURRENCY]: 'EUR',

      [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      [CONFIG.ALLOW_EVENING_DELIVERY]: true,
      [CONFIG.ALLOW_MORNING_DELIVERY]: true,
      [CONFIG.ALLOW_ONLY_RECIPIENT]: true,
      [CONFIG.ALLOW_PICKUP_EXPRESS]: true,
      [CONFIG.ALLOW_PICKUP_LOCATIONS]: true,
      [CONFIG.ALLOW_SIGNATURE]: true,

      [CONFIG.CUTOFF_TIME]: '17:00',
      [CONFIG.DELIVERY_DAYS_WINDOW]: 1,
      [CONFIG.DROP_OFF_DAYS]: [1, 2, 3, 4, 5],
      [CONFIG.DROP_OFF_DELAY]: 0,

      [CONFIG.PRICE_EVENING_DELIVERY]: DEFAULT_PRICE,
      [CONFIG.PRICE_MORNING_DELIVERY]: DEFAULT_PRICE,
      [CONFIG.PRICE_ONLY_RECIPIENT]: DEFAULT_PRICE,
      [CONFIG.PRICE_PICKUP]: DEFAULT_PRICE,
      [CONFIG.PRICE_PICKUP_EXPRESS]: DEFAULT_PRICE,
      [CONFIG.PRICE_SIGNATURE]: DEFAULT_PRICE,
      [CONFIG.PRICE_STANDARD_DELIVERY]: DEFAULT_PRICE,

      [CONFIG.FEATURE_ALLOW_RETRY]: true,
      [CONFIG.FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW]: 'map',
      [CONFIG.FEATURE_MAX_PAGE_ITEMS]: 5,

      /**
       * Default leaflet tile layer data.
       *
       * @type {MyParcelDeliveryOptions.Config.pickupLocationsMapTileLayerData}
       */
      [CONFIG.PICKUP_LOCATIONS_MAP_TILE_LAYER_DATA]: JSON.stringify({
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        // eslint-disable-next-line max-len,vue/max-len
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
        maxZoom: 19,
      }),
    },

    /**
     * @type {MyParcelDeliveryOptions.Strings}
     */
    [STRINGS.KEY]: {
    // Address strings
      [STRINGS.CITY]: 'Plaats',
      [STRINGS.POSTAL_CODE]: 'Postcode',
      [STRINGS.NUMBER]: 'Huisnummer',
      [STRINGS.ADDRESS_NOT_FOUND]: 'Adresgegevens niet ingevuld',

      // Other strings
      [STRINGS.CLOSED]: 'Gesloten',
      [STRINGS.DISCOUNT]: 'korting',
      [STRINGS.FREE]: 'Gratis',
      [STRINGS.FROM]: 'Vanaf',
      [STRINGS.LOAD_MORE]: 'Laad meer',
      [STRINGS.RETRY]: 'Opnieuw',

      // Main header
      [STRINGS.HEADER_DELIVERY_OPTIONS]: '',

      // Title of options
      [STRINGS.DELIVERY_EVENING_TITLE]: '',
      [STRINGS.DELIVERY_MORNING_TITLE]: '',
      [STRINGS.DELIVERY_STANDARD_TITLE]: '',
      [STRINGS.DELIVERY_TITLE]: 'Thuis of op het werk bezorgen',
      [STRINGS.ONLY_RECIPIENT_TITLE]: 'Alleen ontvanger',
      [STRINGS.PICK_UP_FROM]: 'Afhalen vanaf',
      [STRINGS.PICKUP_TITLE]: 'Afhalen op locatie',
      [STRINGS.SIGNATURE_TITLE]: 'Handtekening voor ontvangst',

      // Opening hours
      [STRINGS.OPENING_HOURS]: 'Openingstijden',
      [STRINGS.OPTIONS]: 'Opties',

      [STRINGS.PICKUP_LOCATIONS_LIST_BUTTON]: 'Lijst',
      [STRINGS.PICKUP_LOCATIONS_MAP_BUTTON]: 'Kaart',
    },
  };

  baseConfig[CONFIG.KEY][CONFIG.PLATFORM] = platform;

  return merge({}, baseConfig, platformConfig(platform));
};

/* eslint-disable max-lines-per-function */
import * as ADDRESS from '@/data/keys/addressKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as STRINGS from '@/data/keys/stringsKeys';
import { DEFAULT_PACKAGE_TYPE, DEFAULT_PLATFORM, DEFAULT_PRICE } from '@/data/keys/settingsConsts';
import { getDefaultStrings } from '@/config/defaultStrings';
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
export const defaultConfiguration = (platform = DEFAULT_PLATFORM) => {
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

      [CONFIG.PACKAGE_TYPE]: DEFAULT_PACKAGE_TYPE,

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

      [CONFIG.PRICE_PACKAGE_TYPE_DIGITAL_STAMP]: DEFAULT_PRICE,
      [CONFIG.PRICE_PACKAGE_TYPE_MAILBOX]: DEFAULT_PRICE,

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
    [STRINGS.KEY]: getDefaultStrings(),
  };

  baseConfig[CONFIG.KEY][CONFIG.PLATFORM] = platform;

  return merge({}, baseConfig, platformConfig(platform));
};

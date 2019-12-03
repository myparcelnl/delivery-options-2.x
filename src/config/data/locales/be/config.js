import * as SETTINGS from '@/config/data/settingsConfig';
import { isDev } from '@/config/data/platformConfig';

export const config = {
  [SETTINGS.ALLOW_SATURDAY_DELIVERY]: 1,
  [SETTINGS.API_BASE_URL]: isDev ? 'http://api.dev.sendmyparcel.be' : 'https://api.sendmyparcel.be',
  [SETTINGS.LOCALE]: 'nl-BE',

  /**
   * BE pickup location distance is not based on the customer's address but to the center of the city so the distance is
   *  mostly irrelevant.
   */
  [SETTINGS.FEATURE_PICKUP_SHOW_DISTANCE]: false,

  /**
   * For the same reason as above, prefer the map view to the list view.
   */
  [SETTINGS.FEATURE_PICKUP_LOCATIONS_DEFAULT_VIEW]: true,

  /**
   * Show more pickup items by default for BE because it doesn't show the distance.
   */
  [SETTINGS.FEATURE_MAX_PAGE_ITEMS]: 10,

  [SETTINGS.CARRIER_SETTINGS]: {
    bpost: {
      [SETTINGS.ALLOW_DELIVERY_OPTIONS]: true,
      [SETTINGS.ALLOW_PICKUP_LOCATIONS]: true,
    },
    dpd: {
      [SETTINGS.ALLOW_DELIVERY_OPTIONS]: true,
      [SETTINGS.ALLOW_PICKUP_LOCATIONS]: true,
    },
  },
};

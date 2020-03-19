import * as SETTINGS from '@/data/keys/configKeys';
import { DEFAULT_MAX_PAGE_ITEMS, DEFAULT_PRICE } from '@/data/keys/settingsConsts';

export const config = {
  [SETTINGS.API_BASE_URL]: 'https://api.sendmyparcel.be',
  [SETTINGS.LOCALE]: 'nl-BE',

  [SETTINGS.ALLOW_SATURDAY_DELIVERY]: true,
  [SETTINGS.PRICE_SATURDAY_DELIVERY]: DEFAULT_PRICE,
  [SETTINGS.FRIDAY_CUTOFF_TIME]: '15:00',

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
  [SETTINGS.FEATURE_MAX_PAGE_ITEMS]: DEFAULT_MAX_PAGE_ITEMS,

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

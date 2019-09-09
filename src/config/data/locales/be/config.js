import * as SETTINGS from '@/config/data/settingsConfig';
import { isDev } from '@/config/data/platformConfig';

export const config = {
  [SETTINGS.ALLOW_SATURDAY_DELIVERY]: 1,
  [SETTINGS.API_BASE_URL]: isDev ? 'http://api.dev.sendmyparcel.be' : 'https://api.sendmyparcel.be',
  [SETTINGS.CARRIERS]: ['bpost', 'dpd'],
  [SETTINGS.LOCALE]: 'nl-BE',

  /**
   * BE pickup location distance is not based on the customer's address but to the center of the city so the distance is
   *  mostly irrelevant.
   */
  [SETTINGS.FEATURE_PICKUP_SHOW_DISTANCE]: false,

  /**
   * Show more pickup items by default for BE because it doesn't show the distance.
   */
  [SETTINGS.FEATURE_MAX_PAGE_ITEMS]: 10,
};

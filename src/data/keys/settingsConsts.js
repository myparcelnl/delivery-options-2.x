import * as PLATFORMS from '@/data/keys/platformKeys';

/**
 * @type {MyParcel.Platform}
 */
export const DEFAULT_PLATFORM = PLATFORMS.MYPARCEL;

export const DEFAULT_PRICE = 0;
export const DROP_OFF_DELAY_MAX = 14;
export const DROP_OFF_DELAY_MIN = 0;
export const PICKUP_MAX_PAGE_ITEMS_LIMIT = 20;
export const PICKUP_MIN_PAGE_ITEMS_LIMIT = 0;
export const DEFAULT_MAX_PAGE_ITEMS = 10;

export const PICKUP_LOCATIONS_VIEWS = [
  {
    text: 'pickup_locations.views.map',
    value: 'map',
  },
  {
    text: 'pickup_locations.views.list',
    value: 'list',
  },
];

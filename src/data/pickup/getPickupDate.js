import * as CONFIG from '@/config/data/formConfig';
import { configBus } from '@/config/configBus';
import { createIsoString } from '@/data/dates/createIsoString';

/**
 * Get the pickup date from given possibilities array using the currently selected pickup moment.
 *
 * @param {Array<Object>} possibilities - Possibilities array from pickup_locations response.
 *
 * @returns {String}
 */
export function getPickupDate(possibilities) {
  // Get the possibility that belongs to the currently selected pickup moment
  const possibility = possibilities.find((item) => {
    return item.delivery_type_name === configBus.getValue(CONFIG.PICKUP_MOMENT);
  });

  return createIsoString(possibility.moment.start.date);
}

import { PICKUP } from '@/config/data/formConfig';
import { PICKUP_TITLE } from '@/config/data/settingsConfig';
import { createPickupOptions } from '@/data/pickup/createPickupOptions';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Object|undefined}
 */
export function getPickupLocations() {
  return {
    name: PICKUP,
    label: PICKUP_TITLE,
    options: createPickupOptions,
  };
}

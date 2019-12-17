import { PICKUP } from '@/config/data/formConfig';
import { PICKUP_TITLE } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { createPickupOptions } from '@/data/pickup/createPickupOptions';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Object|undefined}
 */
export function getPickupLocations() {
  if (!configBus.carrierDataWithPickupLocations.length) {
    return;
  }

  return {
    name: PICKUP,
    label: PICKUP_TITLE,
    options: createPickupOptions,
  };
}

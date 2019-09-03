import { PICKUP } from '@/config/data/formConfig';
import { PICKUP_TITLE } from '@/config/data/settingsConfig';
import { getPickupChoices } from './getPickupChoices';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Object|undefined}
 */
export function getPickupLocations() {
  return {
    name: PICKUP,
    label: PICKUP_TITLE,
    options: () => getPickupChoices(),
  };
}

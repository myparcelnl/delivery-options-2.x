import { getPickupChoices } from './getPickupChoices';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Object|undefined}
 */
export function getPickupLocations() {
  return {
    name: 'pickup',
    label: 'pickupTitle',
    options: () => getPickupChoices(),
  };
}

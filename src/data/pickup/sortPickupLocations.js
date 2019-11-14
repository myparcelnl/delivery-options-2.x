import { FEATURE_PICKUP_SHOW_DISTANCE } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';

/**
 * Sort the given pickup locations by distance from low to high, if distance is enabled. Otherwise sort alphabetically
 *  by location name.
 *
 * @param {Array} pickupLocations - Response array from /pickup_locations.
 *
 * @returns {Array}
 */
export function sortPickupLocations(pickupLocations) {
  const hasDistance = configBus.isEnabled(FEATURE_PICKUP_SHOW_DISTANCE);
  const sortKey = hasDistance ? 'distance' : 'location_name';

  return pickupLocations.sort(({ location: locationA }, { location: locationB }) => {
    const comparisonA = locationA[sortKey];
    const comparisonB = locationB[sortKey];

    return comparisonA < comparisonB ? -1 : 1;
  });
}

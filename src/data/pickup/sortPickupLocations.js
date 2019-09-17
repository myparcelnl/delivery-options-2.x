/**
 * Sort the given pickup locations by distance from low to high.
 *
 * @param {Array} pickupLocations - Response array from /pickup_locations.
 *
 * @returns {Array}
 */
export function sortPickupLocations(pickupLocations) {
  return pickupLocations.sort(({ location: locationA }, { location: locationB }) => {
    const distanceA = locationA.distance;
    const distanceB = locationB.distance;

    return distanceA < distanceB ? -1 : 1;
  });
}

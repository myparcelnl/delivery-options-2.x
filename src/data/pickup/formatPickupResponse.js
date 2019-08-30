/**
 * Format the pickup location response, adding carrier name and sorting by distance if needed.
 *
 * @param {Array} response - Response array from /pickup_locations.
 * @param {String} carrier - Carrier name.
 *
 * @returns {Array}
 */
export function formatPickupResponse(response, carrier) {
  // Add a carrier property to every location.
  return response
    .map((res) => ({ ...res, carrier }))
    .sort(({ location: locationA }, { location: locationB }) => {
      const distanceA = locationA.distance;
      const distanceB = locationB.distance;

      return distanceA > distanceB ? -1 : 1;
    });
}

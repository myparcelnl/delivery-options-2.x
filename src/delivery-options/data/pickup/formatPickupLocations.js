/**
 * Format the pickup locations responses.
 *
 * @param {Array} responses - Responses array from pickup locations request.
 *
 * @returns {Object[]}
 */
export function formatPickupLocations(responses) {
  return responses.reduce((acc, { carrier, location, address, possibilities }) => {
    const { retail_network_id, location_code, location_name } = location;

    return {
      ...acc,
      [location_code]: {
        carrier: carrier.name,
        location_name,
        location_code,
        retail_network_id,
        possibilities,
        ...address,
      },
    };
  }, {});
}

import { configBus } from '@/delivery-options/config/configBus';
import { fetchMultiple } from '@/delivery-options/data/request/fetchMultiple';
import { fetchPickupLocations } from '@/delivery-options/data/pickup/fetchPickupLocations';
import { formatPickupLocations } from '@/delivery-options/data/pickup/formatPickupLocations';
import { getPickupMoments } from '@/delivery-options/data/pickup/getPickupMoments';
import { sortPickupLocations } from '@/delivery-options/data/pickup/sortPickupLocations';

/**
 * Format the pickup locations into choices for use with the recursive form.
 *
 * @param {Function} createRequestCallback - The callback used to create the array of requests. You can modify
 *  parameters here.
 *
 * @returns {Object[]}
 */
export async function createPickupChoices(createRequestCallback = (carrier) => fetchPickupLocations(carrier.name)) {
  const requests = configBus.carrierDataWithPickupLocations.map(createRequestCallback);
  let { responses } = await fetchMultiple(requests);

  if (!responses.length) {
    return [];
  }

  responses = sortPickupLocations(responses);

  // Create/update the pickupLocations object on configBus for later reference when sending data to the application.
  configBus.pickupLocations = formatPickupLocations(responses);

  return responses.map((option) => ({
    pickupData: option,
    name: option.location.location_code,
    label: option.location.location_name,
    carrier: option.carrier,
    image: configBus.isMultiCarrier ? option.carrier.image : null,
    options: getPickupMoments(option),
  }));
}

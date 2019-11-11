import { configBus } from '@/config/configBus';
import { getPickupMoments } from '@/data/pickup/getPickupMoments';

/**
 * Format the pickup locations into choices for use with the recursive form.
 *
 * @param {Array} responses - Responses array from pickup locations request.
 *
 * @returns {Object[]}
 */
export function createPickupChoices(responses) {
  return responses.map((option) => ({
    pickupData: option,
    name: option.location.location_code,
    label: option.location.location_name,
    carrier: option.carrier,
    image: configBus.isMultiCarrier ? option.carrier.image : null,
    options: getPickupMoments(option),
  }));
}

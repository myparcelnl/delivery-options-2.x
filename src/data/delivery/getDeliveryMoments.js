import { configBus } from '../../config/configBus';
import { getDeliveryPossibility } from './getDeliveryPossibility';

/**
 * Get delivery moments.
 *
 * @param {Object} deliveryOptions - Delivery options object.
 *
 * @returns {Object}
 */
export function getDeliveryMoments(deliveryOptions) {
  const index = configBus.values.deliveryMoment || 0;

  const selectedOption = deliveryOptions.find((option) => option.date === index) || deliveryOptions[0];

  // Return the delivery possibilities that are present and enabled in the config.
  return selectedOption.delivery_possibilities.map((time) => {
    const deliveryPossibility = getDeliveryPossibility(time);

    if (!!deliveryPossibility) {
      return deliveryPossibility;
    }
  });
}

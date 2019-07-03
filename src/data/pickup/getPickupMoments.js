import { DELIVERY_PICKUP_EXPRESS, formConfig } from '../../config/formConfig';
import { configBus } from '../../config/configBus';

/**
 * Get pickup moments.
 *
 * @param {Array} pickupLocations - Pickup locations array.
 * @param {Object} key - Key.
 *
 * @returns {Object}
 */
export function getPickupMoments(pickupLocations, key) {
  const moments = [];

  pickupLocations[key].time.forEach((time) => {
    const pickupText = `${configBus.textToTranslate.pickUpFrom} ${time.start}`;

    if (DELIVERY_PICKUP_EXPRESS === time.type && !configBus.config.allowPickupExpress) {
      return;
    }

    moments.push({
      ...formConfig.pickup[time.type],
      plainLabel: pickupText,
    });
  });

  return moments;
}

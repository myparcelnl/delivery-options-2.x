import { DELIVERY_PICKUP_EXPRESS, formConfig } from '../../config/formConfig';
import { configBus } from '../../config/configBus';

/**
 * Get pickup moments.
 *
 * @param {Object} key - Key.
 *
 * @returns {Object}
 */
export function getPickupMoments(key) {
  const moments = [];

  this.pickupLocations[key].time.forEach((time) => {
    const pickupText = `${this.strings.pickUpFrom} ${time.start}`;

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

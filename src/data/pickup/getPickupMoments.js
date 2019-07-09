import { DELIVERY_PICKUP_EXPRESS, formConfig } from '@/config/formConfig';
import { configBus } from '@/config/configBus';

/**
 * Get pickup moments.
 *
 * @param {Array} pickupLocation - Pickup location to render.
 *
 * @returns {Object}
 */
export function getPickupMoments(pickupLocation) {
  return [
    {
      name: 'pickupLocationTime',
      type: 'radio',
      choices: pickupLocation.time.map((time) => {
        const pickupText = `${configBus.textToTranslate.pickUpFrom} ${time.start}`;

        if (DELIVERY_PICKUP_EXPRESS === time.type && !configBus.config.allowPickupExpress) {
          return;
        }

        return {
          ...formConfig.pickup[time.type],
          plainLabel: pickupText,
        };
      }),
    },
  ];
}

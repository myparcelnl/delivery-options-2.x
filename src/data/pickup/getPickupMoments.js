import { PICKUP, PICKUP_EXPRESS, formConfig } from '@/config/formConfig';
import { configBus } from '@/config/configBus';

/**
 * Get pickup moments.
 *
 * @param {Object} pickupLocation - Pickup location to render.
 *
 * @param {Array} pickupLocation.possibilities - Possibilities array.
 * @param {Object} pickupLocation.possibilities.delivery_type_name - Possibilities array.
 *
 * @returns {Object}
 */
export function getPickupMoments(pickupLocation) {
  return [
    {
      name: 'pickupLocationTime',
      type: 'radio',
      choices: pickupLocation.possibilities.map((possibility) => {
        const pickupTime = configBus.formatTime(possibility.moment.start.date);
        const pickupText = `${configBus.strings.pickUpFrom} ${pickupTime}`;

        if (!configBus.isEnabled(possibility.delivery_type_name)) {
          return;
        }

        return {
          ...formConfig[PICKUP].options[possibility.delivery_type_name],
          plainLabel: pickupText,
        };
      }),
    },
  ];
}

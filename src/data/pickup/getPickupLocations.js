import { configBus } from '../../config/configBus';
import { formConfig } from '../../config/formConfig';
import { getPickupMoments } from './getPickupMoments';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @param {Array} pickupLocations - Pickup locations array.
 *
 * @returns {Object|undefined}
 */
export function getPickupLocations(pickupLocations) {
  console.log(pickupLocations);
  const pickupChoices = pickupLocations.map((option, key) => {
    const pickup = {
      ...option,
      name: key,
      label: option.location,
      // TODO: Random carrier right now
      carrier: Math.round((Math.random() * (configBus.config.carriers.split(',').length - 1)) + 1),
    };

    pickup.image = formConfig.carriers[pickup.carrier].image;
    pickup.options = [
      {
        name: 'pickupLocationTime',
        type: 'radio',
        choices: getPickupMoments(pickupLocations, key),
      },
    ];

    return pickup;
  });

  return {
    name: 'pickup',
    label: 'pickupTitle',
    options: [
      {
        name: 'pickupMoment',
        type: 'radio',
        component: 'PickupOption',
        overflow: true,
        choices: pickupChoices,
      },
    ],
  };
}

import { configBus } from '../../config/configBus';
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
    const random = Math.floor(Math.random() * configBus.carrierData.length);

    const pickup = {
      ...option,
      name: key,
      label: option.location,
      // TODO: Random carrier right now
      carrier: configBus.carrierData[random].name,
    };

    pickup.image = configBus.getCarrier(pickup.carrier).image;
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

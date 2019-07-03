/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Object|undefined}
 */
import { formConfig } from '../../config/formConfig';

export function getPickupOptions() {
  const pickupChoices = this.pickupLocations.map((option, key) => {
    const pickup = {
      ...option,
      name: key,
      label: option.location,
      // TODO: Random carrier right now
      carrier: Math.round((Math.random() * (this.config.carrierData.length - 1)) + 1),
    };

    pickup.image = formConfig.carriers[pickup.carrier].image;
    pickup.options = [
      {
        name: 'pickupLocationTime',
        type: 'radio',
        choices: this.getPickupMoments(key),
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

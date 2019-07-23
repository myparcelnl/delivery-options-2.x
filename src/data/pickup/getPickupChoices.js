import { configBus } from '@/config/configBus';
import { fetchPickupLocations } from './fetchPickupLocations';
import { getPickupMoments } from './getPickupMoments';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Promise}
 */
export async function getPickupChoices() {
  const { response } = await fetchPickupLocations();

  console.log(response);
  if (response.length) {
    const pickupChoices = response.map((option, key) => ({
      pickupData: option,
      name: key,
      label: option.location.location_name,
      carrier: option.carrier || 'postnl',
      image: configBus.isMultiCarrier ? configBus.getCarrier(option.carrier || 'postnl').image : null,
      options: getPickupMoments(option),
    }));

    // todo remove
    // pickupChoices.splice(0, 7);
    // pickupChoices.splice(3, pickupChoices.length - 3);

    return [
      {
        name: 'pickupMoment',
        type: 'radio',
        component: 'PickupOption',
        choices: pickupChoices,
      },
    ];
  }
}

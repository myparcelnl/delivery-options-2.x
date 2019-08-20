import { configBus } from '@/config/configBus';
import { fetchMultiple } from '@/services/fetchMultiple';
import { fetchPickupLocations } from './fetchPickupLocations';
import { getPickupMoments } from './getPickupMoments';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Promise}
 */
export async function getPickupChoices() {
  const requests = configBus.carrierData.map((carrier) => fetchPickupLocations(carrier));
  const { responses } = await fetchMultiple(requests);

  if (responses.length) {
    const pickupChoices = responses.map((option, key) => ({
      pickupData: option,
      name: key,
      label: option.location.location_name,
      // todo: multicarrier pickup locations
      // carrier: option.carrier,
      // image: configBus.isMultiCarrier ? configBus.getCarrier(option.carrier).image : null,
      options: getPickupMoments(option),
    }));

    const defaultPagination = 5;

    return [
      {
        name: 'pickupMoment',
        type: 'radio',
        component: 'PickupOption',
        pagination: defaultPagination,
        choices: pickupChoices,
      },
    ];
  }
}

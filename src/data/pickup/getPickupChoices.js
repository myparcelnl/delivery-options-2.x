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
  // Get requests for carriers which have pickup enabled.
  const requests = configBus.carrierData.reduce((acc, carrier) => {
    return carrier.pickupEnabled ? [...acc, fetchPickupLocations(carrier)] : acc;
  }, []);

  const { responses } = await fetchMultiple(requests);

  if (responses.length) {
    const pickupChoices = responses.map((option, key) => ({
      pickupData: option,
      name: key,
      label: option.location.location_name,
      carrier: option.carrier,
      image: configBus.isMultiCarrier ? configBus.getCarrier(option.carrier).image : null,
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

import { FEATURE_MAX_PAGE_ITEMS } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { fetchMultiple } from '@/services/fetchMultiple';
import { fetchPickupLocations } from './fetchPickupLocations';
import { getPickupMoments } from './getPickupMoments';
import { sortPickupLocations } from '@/data/pickup/sortPickupLocations';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Promise}
 */
export async function getPickupChoices() {
  // Get requests for carriers which have pickup enabled.
  const requests = configBus.carrierData.reduce((acc, carrier) => {
    return carrier.pickupEnabled ? [...acc, () => fetchPickupLocations(carrier)] : acc;
  }, []);

  let { responses } = await fetchMultiple(requests);

  if (responses.length) {
    responses = sortPickupLocations(responses);

    const pickupChoices = responses.map((option, key) => ({
      pickupData: option,
      name: key,
      label: option.location.location_name,
      carrier: option.carrier,
      image: configBus.isMultiCarrier ? option.carrier.image : null,
      options: getPickupMoments(option),
    }));

    return [
      {
        name: 'pickupMoment',
        type: 'radio',
        component: 'PickupOption',
        pagination: configBus.get(FEATURE_MAX_PAGE_ITEMS),
        choices: pickupChoices,
      },
    ];
  }
}

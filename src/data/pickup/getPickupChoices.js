import PickupOption from '@/components/PickupOption';
import { configBus } from '@/config/configBus';
import { PICKUP_LOCATION } from '@/config/data/formConfig';
import { FEATURE_MAX_PAGE_ITEMS } from '@/config/data/settingsConfig';
import { sortPickupLocations } from '@/data/pickup/sortPickupLocations';
import { fetchMultiple } from '@/data/request/fetchMultiple';
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
    return carrier.pickupEnabled ? [...acc, () => fetchPickupLocations(carrier)] : acc;
  }, []);

  let { responses } = await fetchMultiple(requests);

  if (responses.length) {
    responses = sortPickupLocations(responses);

    // Create a pickupLocations object on configBus for later reference when sending data to the application.
    configBus.pickupLocations = responses.reduce((acc, val) => {
      const { location, address } = val;

      return {
        ...acc,
        [location.location_code]: {
          location,
          address,
        },
      };
    }, {});

    const pickupChoices = responses.map((option) => ({
      pickupData: option,
      name: option.location.location_code,
      label: option.location.location_name,
      carrier: option.carrier,
      image: configBus.isMultiCarrier ? option.carrier.image : null,
      options: getPickupMoments(option),
    }));

    return [
      {
        name: PICKUP_LOCATION,
        type: 'radio',
        component: PickupOption,
        pagination: configBus.get(FEATURE_MAX_PAGE_ITEMS),
        choices: pickupChoices,
      },
    ];
  }
}

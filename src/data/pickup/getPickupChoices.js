import { FEATURE_MAX_PAGE_ITEMS } from '@/config/data/settingsConfig';
import { PICKUP_LOCATION } from '@/config/data/formConfig';
import PickupOption from '@/components/PickupOption';
import { configBus } from '@/config/configBus';
import { fetchMultiple } from '@/data/request/fetchMultiple';
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

    // Create a pickupLocations object on configBus for later reference when sending data to the application.
    configBus.pickupLocations = responses.reduce((acc, { location, address, carrier }) => {
      const { retail_network_id, location_code, location_name } = location;

      return {
        ...acc,
        [location_code]: {
          carrier: carrier.name,
          location_name,
          location_code,
          retail_network_id,
          ...address,
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

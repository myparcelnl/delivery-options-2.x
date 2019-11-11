import { FEATURE_MAX_PAGE_ITEMS, FEATURE_PICKUP_LOCATIONS_MAP } from '@/config/data/settingsConfig';
import Leaflet from '@/components/Pickup/Map/Leaflet';
import { PICKUP_LOCATION } from '@/config/data/formConfig';
import PickupOption from '@/components/Pickup/PickupOption';
import { configBus } from '@/config/configBus';
import { createPickupChoices } from '@/data/pickup/createPickupChoices';
import { createPickupLocations } from '@/data/pickup/createPickupLocations';
import { fetchMultiple } from '@/data/request/fetchMultiple';
import { fetchPickupLocations } from './fetchPickupLocations';
import { sortPickupLocations } from '@/data/pickup/sortPickupLocations';

/**
 * Get the pickup options if they are enabled in the config.
 *
 * @returns {Promise.<MyParcelDeliveryOptions.FormEntry[]>}
 */
export async function getPickupChoices() {
  // Get requests for carriers which have pickup enabled.
  const requests = configBus.carrierData.reduce((acc, carrier) => {
    return carrier.pickupEnabled ? [...acc, () => fetchPickupLocations(carrier)] : acc;
  }, []);

  let { responses } = await fetchMultiple(requests);

  if (!responses.length) {
    return [];
  }

  responses = sortPickupLocations(responses);
  // Create a pickupLocations object on configBus for later reference when sending data to the application.
  configBus.pickupLocations = createPickupLocations(responses);

  if (FEATURE_PICKUP_LOCATIONS_MAP) {
    return [
      {
        name: PICKUP_LOCATION,
        type: 'radio',
        component: Leaflet,
        choices: createPickupChoices(responses),
        loop: false,
      },
    ];
  }

  return [
    {
      name: PICKUP_LOCATION,
      type: 'radio',
      component: PickupOption,
      pagination: configBus.get(FEATURE_MAX_PAGE_ITEMS),
      choices: createPickupChoices(responses),
    },
  ];
}

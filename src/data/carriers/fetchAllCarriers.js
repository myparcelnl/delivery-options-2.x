import { CARRIER_SETTINGS } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { createCarrierData } from '@/data/carriers/createCarrierData';
import { fetchCarrierData } from '@/data/carriers/fetchCarrierData';
import { fetchMultiple } from '@/data/request/fetchMultiple';

/**
 * Fetch all carrier information.
 *
 * @returns {Promise.<configBus>}
 */
export async function fetchAllCarriers() {
  // Return if this function is called again.
  if (Object.keys(configBus.carrierData).length) {
    return configBus;
  }

  const carriersToFetch = Object.keys(configBus.get(CARRIER_SETTINGS));

  // Create an array with a request for each carrier.
  const requests = carriersToFetch.map((carrier) => () => fetchCarrierData(carrier));

  // Get the responses and errors from all the requests.
  const { responses } = await fetchMultiple(requests);

  // Create the carrierData array
  configBus.carrierData = createCarrierData(responses);
  configBus.carrierDataWithPickupLocations = configBus.carrierData.filter((carrier) => carrier.pickupEnabled);
  configBus.carrierDataWithDeliveryOptions = configBus.carrierData.filter((carrier) => carrier.deliveryEnabled);

  // Set the first carrier to currentCarrier
  configBus.currentCarrier = configBus.carrierData.length ? configBus.carrierData[0].name : null;

  return configBus;
}

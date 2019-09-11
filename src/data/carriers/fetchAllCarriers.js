import { CARRIERS } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { createCarrierData } from '@/data/carriers/createCarrierData';
import { fetchCarrierData } from '@/data/carriers/fetchCarrierData';
import { fetchMultiple } from '@/data/request/fetchMultiple';

/**
 * Fetch all carrier information.
 *
 * @returns {boolean}
 */
export async function fetchAllCarriers() {
  // Return existing carrierData if this function is called again.
  if (Object.keys(configBus.carrierData).length) {
    return configBus.carrierData;
  }

  const carriersToFetch = configBus.get(CARRIERS);
  // Create an array with a request for each carrier.
  const requests = carriersToFetch.map((carrier) => fetchCarrierData(carrier));

  // Get the responses and errors from all the requests.
  const { errors, responses } = await fetchMultiple(requests);

  if (errors.length) {
    configBus.addErrors('carriers', errors[0].errors);
  }

  // Create the carrierData array
  configBus.carrierData = createCarrierData(responses);

  // Set the first carrier to currentCarrier
  configBus.currentCarrier = configBus.carrierData.length ? configBus.carrierData[0].name : null;

  // Async function must return something to be able to resolve.
  return true;
}

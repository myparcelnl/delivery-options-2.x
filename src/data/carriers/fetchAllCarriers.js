import { ALLOW_DELIVERY_OPTIONS, ALLOW_PICKUP_LOCATIONS, CARRIERS } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { fetchCarrierData } from '@/data/carriers/fetchCarrierData';
import { fetchMultiple } from '@/services/fetchMultiple';

/**
 * Fetch all carrier information.
 *
 * @returns {Promise}
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

  const unique = new Set(responses.map((obj) => JSON.stringify(obj)));
  configBus.carrierData = Array.from(unique).map((obj) => JSON.parse(obj));
  configBus.carrierData = configBus.carrierData.map((carrier) => ({
    ...carrier,
    pickupEnabled: configBus.get(ALLOW_PICKUP_LOCATIONS, null, carrier.name),
    deliveryEnabled: configBus.get(ALLOW_DELIVERY_OPTIONS, null, carrier.name),
  }));

  console.log(configBus.carrierData);

  configBus.currentCarrier = configBus.carrierData.length ? configBus.carrierData[0].name : null;

  return configBus.carrierData;
}

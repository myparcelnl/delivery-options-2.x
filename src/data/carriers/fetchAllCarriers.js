import { configBus } from '@/config/configBus';
import { fetchCarrierData } from '@/data/carriers/fetchCarrierData';

/**
 * Fetch all carrier information.
 *
 * @returns {Promise}
 */
export async function fetchAllCarriers() {
  // Return existing carrierData if this function is called again.
  console.log('configBus.carrierData', configBus.carrierData);
  if (Object.keys(configBus.carrierData).length) {
    return configBus.carrierData;
  }

  const carriersToFetch = configBus.config.carriers;
  const requests = carriersToFetch.map((carrier) => fetchCarrierData(carrier));

  let errors = [], responses = [];
  // Concatenate all responses and errors
  const carriers = (await Promise.all(requests)).reduce((acc, response) => {
    errors = [...errors, ...response.errors];
    responses = [...responses, ...response.response];

    return { ...acc, errors, responses };
  }, {});

  if (carriers.errors.length) {
    configBus.addErrors('carriers', carriers.errors[0].errors);
  }

  const unique = new Set(carriers.responses.map((obj) => JSON.stringify(obj)));
  configBus.carrierData = Array.from(unique).map((obj) => JSON.parse(obj));

  configBus.currentCarrier = configBus.carrierData.length ? configBus.carrierData[0].name : null;

  return configBus.carrierData;
}

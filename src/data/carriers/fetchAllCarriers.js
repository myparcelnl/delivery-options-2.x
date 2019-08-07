import { configBus } from '@/config/configBus';
import { fetchCarrierData } from '@/data/carriers/fetchCarrierData';

/**
 * FetchCarriers.
 *
 * @returns {Promise}
 */
export async function fetchAllCarriers() {
  if (Object.keys(configBus.carrierData).length) {
    return configBus.carrierData;
  }

  const carriersToFetch = configBus.config.carriers;
  const requests = carriersToFetch.map((carrier) => fetchCarrierData(carrier));

  let errors = [], responses = [];
  const carriers = (await Promise.all(requests)).reduce((acc, response) => {
    errors = [...errors, ...response.errors];
    responses = [...responses, ...response.response];

    return { ...acc, errors, responses };
  }, {});

  configBus.addErrors('carriers', carriers.errors);

  const unique = new Set(carriers.responses.map((obj) => JSON.stringify(obj)));
  configBus.carrierData = Array.from(unique).map((obj) => JSON.parse(obj));

  configBus.currentCarrier = configBus.carrierData.length ? configBus.carrierData[0].name : null;

  return configBus.carrierData;
}

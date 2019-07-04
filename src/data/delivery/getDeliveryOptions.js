import { configBus } from '../../config/configBus';
import { fetchCarrierData } from '../carriers/fetchCarriers';
import { fetchDeliveryOptions } from './fetchDeliveryOptions';
import { deliveryAdditionalOptions } from './getDeliveryAdditionalOptions';
import { getDeliveryDates } from './getDeliveryDates';
import { getDeliveryMoments } from './getDeliveryMoments';

/**
 * Get deliver options for carriers in the config.
 *
 * @param {Object} deliveryOptions - Delivery options object.
 *
 * @returns {Object}
 */
export function getDeliveryOptions(deliveryOptions = null) {
  const deliver = {
    name: 'deliver',
    label: 'deliveryTitle',
  };

  if (configBus.isMultiCarrier) {
    deliver.type = 'radio';
    deliver.options = [
      {
        type: 'radio',
        name: 'deliveryCarrier',
        label: 'carrier',
        choices: configBus.carrierData.map((carrier) => {
          return {
            ...carrier,
            options: () => options(carrier.name),
          };
        }),
      },
    ];
  } else {
    deliver.options = options();
  }
  return deliver;
}

/**
 * If multi carrier, return another level of settings.
 */
async function options(carrier = configBus.currentCarrier) {
  console.log('fetchDeliveryOptions for', carrier);
  const deliveryOptions = (await fetchDeliveryOptions(carrier)).response;

  return [
    {
      name: 'deliveryDate',
      type: 'select',
      choices: getDeliveryDates(deliveryOptions),
    },
    {
      name: 'deliveryMoment',
      type: 'radio',
      choices: getDeliveryMoments(deliveryOptions),
    },
    {
      name: 'additionalOptions',
      type: 'checkbox',
      choices: deliveryAdditionalOptions(deliveryOptions),
    },
  ];
}

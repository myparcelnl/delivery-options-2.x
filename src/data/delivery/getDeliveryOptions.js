import { configBus } from '@/config/configBus';
import { deliveryAdditionalOptions } from './getDeliveryAdditionalOptions';
import { fetchDeliveryOptions } from './fetchDeliveryOptions';
import { getDeliveryDates } from './getDeliveryDates';
import { getDeliveryMoments } from './getDeliveryMoments';

/**
 * Get deliver options for carriers in the config.
 *
 * @returns {Object}
 */
export function getDeliveryOptions() {
  return {
    name: 'deliver',
    label: 'deliveryTitle',
    type: 'radio',
    // If multi carrier, return another level of settings and their options based on carrier.
    options: configBus.isMultiCarrier
      ? [{
        name: 'deliveryCarrier',
        label: 'carrier',
        type: 'radio',
        choices: configBus.carrierData.map((carrier) => ({
          ...carrier,
          options: () => options(carrier.name),
        })),
      }]
      : options(),
  };
}

/**
 * If multi carrier, return another level of settings.
 *
 * @param {String|Number} carrier - Carrier name or id.
 *
 * @returns {Promise<Object[]>}
 */
async function options(carrier = configBus.currentCarrier) {
  const { response } = await fetchDeliveryOptions(carrier);

  if (response.length) {
    return [
      {
        name: 'deliveryDate',
        type: 'select',
        choices: getDeliveryDates(response),
      },
      {
        name: 'deliveryMoment',
        type: 'radio',
        choices: getDeliveryMoments(response),
      },
      {
        name: 'additionalOptions',
        type: 'checkbox',
        choices: deliveryAdditionalOptions(response),
      },
    ];
  }
}

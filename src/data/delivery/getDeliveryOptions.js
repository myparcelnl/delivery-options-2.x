import { configBus } from '../../config/configBus';
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
export function getDeliveryOptions(deliveryOptions) {
  const deliver = {
    name: 'deliver',
    label: 'deliveryTitle',
  };

  const options = (carrier = configBus.carriers) => {
    console.log('carrier', configBus.values);
    return [
      {
        name: 'deliveryDate',
        type: 'select',
        choices: getDeliveryDates(deliveryOptions),
      },
      {
        name: 'deliveryMoment',
        type: 'radio',
        choices: getDeliveryMoments(deliveryOptions, carrier),
      },
      {
        name: 'additionalOptions',
        type: 'checkbox',
        choices: deliveryAdditionalOptions(),
      },
    ];
  };

  /**
       * If multi carrier, return another level of settings
       */
  if (configBus.isMultiCarrier) {
    deliver.type = 'radio';
    deliver.options = [
      {
        type: 'radio',
        name: 'deliveryCarrier',
        label: 'carrier',
        choices: this.config.carrierData.map((carrier) => ({
          ...carrier,
          options: options(carrier),
        })),
      },
    ];
  } else {
    deliver.options = options();
  }

  return deliver;
}

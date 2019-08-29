import { DELIVER, DELIVERY_CARRIER } from '@/config/data/formConfig';
import { DELIVERY_TITLE } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { createDeliveryOptions } from '@/data/delivery/createDeliveryOptions';

/**
 * Get deliver options for carriers in the config.
 *
 * @returns {Object}
 */
export function getDeliveryOptions() {
  return {
    name: DELIVER,
    label: DELIVERY_TITLE,
    type: 'radio',
    // If multi carrier, return another level of settings and their options based on carrier.
    options: configBus.isMultiCarrier
      ? [{
        name: DELIVERY_CARRIER,
        type: 'radio',
        choices: configBus.carrierData.map((carrier) => ({
          ...carrier,
          options: () => createDeliveryOptions(carrier.name),
        })),
      }]
      : createDeliveryOptions,
  };
}

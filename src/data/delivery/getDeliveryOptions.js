import { CARRIER, DELIVER } from '@/config/data/formConfig';
import { DELIVERY_TITLE } from '@/config/data/settingsConfig';
import Vue from 'vue';
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
        name: CARRIER,
        type: 'radio',
        choices: configBus.carrierData.reduce((acc, carrier) => {
          // Don't add the carrier if it doesn't have delivery enabled.
          if (carrier.deliveryEnabled) {
            return [
              ...acc,
              {
                ...carrier,
                class: `${Vue.prototype.$classBase}__spacing--md`,
                options: () => createDeliveryOptions(carrier.name),
              },
            ];
          }

          return acc;
        }, []),
      }]
      : createDeliveryOptions,
  };
}

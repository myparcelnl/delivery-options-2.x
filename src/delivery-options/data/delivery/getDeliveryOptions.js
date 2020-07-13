import * as STRINGS from '@/data/keys/stringsKeys';
import { CARRIER, DELIVER } from '@/config/formConfig';
import Vue from 'vue';
import { configBus } from '@/delivery-options/config/configBus';
import { createDeliveryOptions } from '@/delivery-options/data/delivery/createDeliveryOptions';

/**
 * Get deliver options for carriers in the config.
 *
 * @returns {Object}
 */
export function getDeliveryOptions() {
  if (!configBus.carrierDataWithDeliveryOptions.length) {
    return;
  }

  return {
    name: DELIVER,
    label: STRINGS.DELIVERY_TITLE,
    type: 'radio',
    // If multi carrier, return another level of settings and their options based on carrier.
    options: configBus.hasMultipleDeliveryCarriers
      ? [{
        name: CARRIER,
        type: 'radio',
        choices: configBus.carrierDataWithDeliveryOptions.map((carrier) => ({
          ...carrier,
          class: `${Vue.prototype.$classBase}__spacing--md`,
          options: () => createDeliveryOptions(carrier.name),
        })),
      }]
      : createDeliveryOptions,
  };
}

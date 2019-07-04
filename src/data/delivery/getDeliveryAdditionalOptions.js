import { configBus } from '../../config/configBus';
import { formConfig } from '../../config/formConfig';

/**
 *
 * @param {Object} deliveryOptions - Delivery options object.
 *
 * @returns {Array}
 */
export function deliveryAdditionalOptions(deliveryOptions) {
  const options = [];

  console.log('deliveryAdditionalOptions', deliveryOptions);

  if (configBus.config.allowOnlyRecipient) {
    options.push(formConfig.deliveryAdditionalOptions.onlyRecipient);
  }

  if (configBus.config.allowSignature) {
    options.push(formConfig.deliveryAdditionalOptions.signature);
  }

  return options;
}

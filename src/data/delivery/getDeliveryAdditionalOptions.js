import { configBus } from '../../config/configBus';
import { formConfig } from '../../config/formConfig';

/**
 *
 * @returns {Array}
 */
export function deliveryAdditionalOptions() {
  const options = [];

  if (configBus.config.allowOnlyRecipient) {
    options.push(formConfig.deliveryAdditionalOptions.onlyRecipient);
  }

  if (configBus.config.allowSignature) {
    options.push(formConfig.deliveryAdditionalOptions.signature);
  }

  return options;
}

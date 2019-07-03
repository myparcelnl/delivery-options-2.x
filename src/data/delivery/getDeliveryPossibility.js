import { configBus } from '../../config/configBus';
import { formConfig } from '../../config/formConfig';

/**
 * Get delivery option.
 *
 * @param {Object} time - Time object from delivery_options.
 *
 * @returns {Object}
 */
export function getDeliveryPossibility(time) {
  const option = formConfig.delivery[time.type];

  // Return if the current delivery type is turned off in the config.
  if (configBus.isEnabled(option)) {

    // If the current label isn't in the config or is an empty string show the delivery time as the title
    if (!option.hasOwnProperty('label')
          || !configBus.textToTranslate.hasOwnProperty(option.label)
          || !configBus.textToTranslate[option.label]) {
      // Remove the regular label and add a custom one
      delete option.label;
      option.plainLabel = `${time.start} – ${time.end}`;
    }

    return option;
  }
}

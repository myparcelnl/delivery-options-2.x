import { configBus } from '@/config/configBus';

/**
 * Get delivery option.
 *
 * @param {Object} option - Option to transform.
 * @param {Object} deps - Dependencies related to current option.
 *
 * @returns {Object}
 */
export function getDeliveryPossibility(option, deps) {
  // Only if the current delivery type is enabled in the config.
  if (configBus.isEnabled(option)) {

    // If the current label isn't in the config or is an empty string show the delivery time as the title
    if (!option.hasOwnProperty('label')
      || !configBus.strings.hasOwnProperty(option.label)
      || !configBus.strings[option.label]) {

      // Remove the regular label and add plainLabel
      delete option.label;

      option.plainLabel = `${deps.moments.start} – ${deps.moments.end}`;
    }

    return option;
  }
}

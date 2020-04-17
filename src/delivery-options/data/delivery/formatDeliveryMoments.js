import { configBus } from '@/delivery-options/config/configBus';

/**
 * Format the delivery moments for display. If the current label isn't in the config or is an empty string it shows the
 *  delivery time as the title.
 *
 * @param {MyParcelDeliveryOptions.FormEntryChoice} option - Option to transform.
 * @param {Object} deps - Dependencies related to current option.
 *
 * @returns {MyParcelDeliveryOptions.FormEntryChoice}
 */
export function formatDeliveryMoments(option, deps) {
  if (!option.hasOwnProperty('label')
    || !configBus.strings.hasOwnProperty(option.label)
    || !configBus.strings[option.label]) {
    // Remove the regular label and add plainLabel
    delete option.label;
    option.plainLabel = `${deps.moments.start} – ${deps.moments.end}`;
  }

  return option;
}

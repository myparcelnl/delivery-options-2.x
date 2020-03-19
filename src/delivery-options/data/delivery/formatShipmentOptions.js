/**
 * Format delivery shipment options choices.
 *
 * @param {Object} choice - Option to transform.
 * @param {Object} options - Delivery options from the API.
 *
 * @returns {Object}
 */
export function formatShipmentOptions(choice, options) {
  const hasOnlyOneOption = options.enum.length === 1;

  return {
    ...choice,
    disabled: hasOnlyOneOption,
    // If there is only one allowed value disable the option and set the selected property accordingly.
    selected: hasOnlyOneOption ? options.enum[0] : false,
  };
}

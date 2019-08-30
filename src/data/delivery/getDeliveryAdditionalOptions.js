/**
 * Format delivery additional options choices.
 *
 * @param {Object} choice - Option to transform.
 * @param {Object} options - Delivery options from the API.
 *
 * @returns {Object}
 */
export function deliveryAdditionalOptions(choice, options) {
  choice.disabled = options.enum.length === 1;

  // If there is only one allowed value disable the option and set the selected property accordingly.
  if (choice.disabled) {
    choice.selected = options.enum[0];
  }

  return choice;
}

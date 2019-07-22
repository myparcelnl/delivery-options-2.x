/**
 *
 * @param {Object} choice - Option to transform.
 * @param {Object} deliveryOptions - Delivery options object.
 *
 * @returns {Object}
 */
export function deliveryAdditionalOptions(choice, deliveryOptions) {
  choice.disabled = deliveryOptions.enum.length === 1;

  // If there is only one allowed value disable the option and set the selected property accordingly
  if (choice.disabled) {
    choice.selected = deliveryOptions.enum[0];
  }

  console.color('Transformed choice:', 'disabled', choice.disabled, 'selected', choice.selected, choice);
  return choice;
}

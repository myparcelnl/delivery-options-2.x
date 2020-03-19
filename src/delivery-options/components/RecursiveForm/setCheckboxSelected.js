import { configBus } from '@/delivery-options/config/configBus';

/**
 * Set the selected value for a checkbox option.
 *
 * @param {Object} currentValue - Current value of the parent option.
 * @param {Object} choice - A choice of the parent option.
 * @returns {*}
 */
export function setCheckboxSelected(currentValue, choice) {
  /**
   * If the choice is disabled set it to its only allowed value.
   *
   * @see src/data/delivery/formatShipmentOptions.js
   */
  if (choice.disabled === true) {
    return {
      ...currentValue,
      [choice.name]: choice.selected,
    };
  }

  /**
   * If choice is already set just return it. Note `setValue` being the initialValue of reduce().
   */
  if (currentValue.hasOwnProperty(choice.name)) {
    return currentValue;
  }

  /**
   * If the choice is enabled in the config return the value of choice.selected.
   */
  if (configBus.isEnabled(choice)) {
    return {
      ...currentValue,
      [choice.name]: choice.selected === true,
    };
  }

  /**
   * If the choice is not enabled, return null instead of omitting the property entirely, to improve clarity and
   *  readability of the data sent to the external platform.
   */
  return {
    ...currentValue,
    [choice.name]: null,
  };
}

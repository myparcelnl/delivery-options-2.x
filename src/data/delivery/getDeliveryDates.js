import * as SETTINGS from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';

/**
 * Helper function for date.toLocaleDateString with locale from the config bus and default format.
 *
 * @param {Date} date - Date to format.
 * @param {Object} format - The format to apply.
 *
 * @returns {string}
 */
function toLocaleDateString(date, format = { month: 'numeric', day: 'numeric', year: 'numeric' }) {
  return date.toLocaleDateString(configBus.get(SETTINGS.LOCALE), format);
}

/**
 *
 * @param {Object} deliveryOptions - Delivery options object.
 *
 * @returns {Array|null}
 */
export function getDeliveryDates(deliveryOptions) {
  if (!deliveryOptions) {
    return [];
  }

  // If the delivery days window is 0, don't show the delivery date to the user. We do this by just passing an empty
  //  string as the label.
  if (configBus.get(SETTINGS.DELIVERY_DAYS_WINDOW) === 0) {
    return [
      {
        name: toLocaleDateString(new Date(deliveryOptions[0].date.date)),
        label: '',
      },
    ];
  }

  return deliveryOptions.map(({ date: option }) => {
    const date = new Date(option.date);
    const name = toLocaleDateString(date);

    const dateString = toLocaleDateString(date, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    const label = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    return {
      label,
      name,
    };
  });
}

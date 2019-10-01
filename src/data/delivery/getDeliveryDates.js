import * as SETTINGS from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';
import { createDateString } from '@/data/createDateString';

/**
 * @param {MyParcel.DeliveryOption[]} deliveryOptions - Delivery options object.
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
        name: new Date(deliveryOptions[0].date.date).toString(),
        label: '',
      },
    ];
  }

  return deliveryOptions.map(({ date: option }) => {
    const date = new Date(option.date);
    const name = createDateString(option.date);

    const dateString = date.toLocaleDateString(
      configBus.get(SETTINGS.LOCALE),
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }
    );

    const label = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    return {
      label,
      name,
    };
  });
}

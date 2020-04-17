import * as CONFIG from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';
import { createIsoString } from '@/delivery-options/data/dates/createIsoString';

/**
 * @param {MyParcel.DeliveryOption[]} deliveryOptions - Delivery options object.
 *
 * @returns {MyParcelDeliveryOptions.FormEntryChoice[]}
 */
export function getDeliveryDates(deliveryOptions) {
  if (!deliveryOptions) {
    return [];
  }

  // If the delivery days window is 0, don't show the delivery date to the user. We do this by just passing an empty
  //  string as the label.
  if (configBus.get(CONFIG.DELIVERY_DAYS_WINDOW) === 0) {
    return [
      {
        name: createIsoString(deliveryOptions[0].date.date),
        label: '',
      },
    ];
  }

  return deliveryOptions.map((option) => {
    const { date: deliveryMoment } = option;

    const date = new Date(deliveryMoment.date);
    const name = createIsoString(deliveryMoment.date);

    const dateString = date.toLocaleDateString(
      configBus.get(CONFIG.LOCALE),
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      },
    );

    const label = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    return {
      label,
      name,
    };
  });
}

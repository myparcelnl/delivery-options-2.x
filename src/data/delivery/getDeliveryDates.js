import { LOCALE } from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';

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

  return deliveryOptions.map(({ date: option }) => {
    const date = new Date(option.date);
    const name = date.toLocaleDateString(configBus.get(LOCALE), {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });

    const dateString = date.toLocaleDateString(configBus.get(LOCALE), {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    const label = dateString.charAt(0).toUpperCase() + dateString.slice(1);
    return { label, name };
  });
}

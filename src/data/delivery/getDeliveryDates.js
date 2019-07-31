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

  return deliveryOptions.reverse().map(({ date: option }) => {
    const date = new Date(option.date);
    const name = date.toLocaleDateString(configBus.config.locale);
    const intl = new Intl.DateTimeFormat(configBus.config.locale, { weekday: 'long' });

    let weekDay = intl.format(date);
    weekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);

    const label = `${weekDay} ${name}`;
    return { label, name };
  });
}

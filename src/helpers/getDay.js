import * as CONFIG from '@/data/keys/configKeys';
import { configBus } from '@/delivery-options/config/configBus';

/**
 * Get the array of weekdays by using a (slightly) hacky trick with dates.
 *
 * @param {Date} date
 * @param {String} locale - Optional locale override.
 *
 * @returns {String}
 */
export const getDay = (date, locale = configBus.get(CONFIG.LOCALE)) => {
  return date.toLocaleString(
    locale,
    { weekday: 'long' },
  );
};

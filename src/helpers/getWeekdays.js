/* eslint-disable no-magic-numbers */
import * as CONFIG from '@/data/keys/configKeys';
import { capitalize } from '@/delivery-options/services/filters/capitalize';
import { configBus } from '@/delivery-options/config/configBus';
import { getDay } from '@/helpers/getDay';

/**
 * Get the array of weekdays by using a (slightly) hacky trick with dates.
 *
 * @param {String} locale - Optional locale override.
 *
 * @returns {String[]}
 */
export const getWeekdays = (locale = configBus.get(CONFIG.LOCALE)) => {
  const dates = [];

  for (let day = 5; day <= 11; day++) {
    let date = getDay(new Date(1970, 0, day), locale);

    // Uppercase first letter.
    date = capitalize(date);

    dates.push(date);
  }

  return dates;
};

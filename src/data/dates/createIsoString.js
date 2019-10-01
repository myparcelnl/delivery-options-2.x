import { createDate } from '@/data/dates/createDate';

/**
 * Return the date as ISO string to get a date string without changing the date/time because of timezones.
 * Example: "2019-11-15T17:00:00.000Z".
 *
 * @param {String} date - Date string.
 *
 * @returns {*}
 */
export function createIsoString(date) {
  return createDate(date).toISOString();
}

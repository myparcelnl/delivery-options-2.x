/**
 * Convert a date string to a date string not ruined by the existence of timezones.
 *
 * @param {String} date - The date to convert.
 *
 * @example createDate('2019-10-15 00:00:00.000000');
 *
 * @returns {Date}
 */
export function createDate(date) {
  /**
   * Index where the date ends, before the time starts.
   *
   * @type {Number}
   */
  const dateLength = 10;

  /**
   * The date string with the time stripped off.
   *
   * @example 2019-10-15
   */
  const dateWithoutTime = date.substr(0, dateLength);

  /**
   * Because months are 0-based we need to subtract 1 to get the correct month...
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#Parameters
   */
  const dateArr = dateWithoutTime.split('-');
  dateArr[1] = (parseInt(dateArr[1]) - 1).toString();

  /**
   * The rest of the string, so only the time.
   *
   * @example 08:00:00.000000
   */
  const timeWithoutDate = date.substr(dateLength + 1, date.length);

  /**
   * Split the date and time, passing the year, month, day, hours, minutes and seconds as arguments to Date.UTC to
   *  createScript a UTC date.
   *
   * @example 2019 10 15 17 00 00.000000 -> 1573837200000
   */
  const utcDate = Date.UTC(
    ...dateArr,
    ...timeWithoutDate.split(':'),
  );

  return new Date(utcDate);
}

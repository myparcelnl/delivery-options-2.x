/**
 * Convert a date string to a timezone-less string.
 *
 * @param {String} date - The date to convert.
 *
 * @returns {String}
 */
export function createDateString(date) {
  // Index where the date ends, before the time starts.
  // Date should look like "2019-10-15 00:00:00.000000" right now.
  const dateLength = 10;

  // The date string with the time stripped off.
  // Example: "2019-10-15"
  const dateWithoutTime = date.substr(0, dateLength);

  // Split the date and pass the year, month and day as arguments to Date.UTC to create a UTC date.
  // Example: "1573776000000"
  const utcDate = Date.UTC(...dateWithoutTime.split('-'));

  // Finally, return the date as ISO string to get a date string with 00:00 as time.
  // Example: "2019-11-15T00:00:00.000Z"
  return new Date(utcDate).toISOString();
}

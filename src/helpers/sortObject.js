import isPlainObject from 'lodash-es/isPlainObject';

/**
 * @param {Object} object - Object to sort.
 *
 * @returns {Object}
 */
export function sortObject(object) {
  return Object
    .keys(object)
    .sort()
    .reduce((acc, val) => {
      let value = object[val];

      if (isPlainObject(object[val])) {
        value = sortObject(object[val]);
      }

      return {
        ...acc,
        [val]: value,
      };
    }, {});
}

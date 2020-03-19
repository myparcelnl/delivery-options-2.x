import isPlainObject from 'lodash-es/isPlainObject';

/**
 * Flatten an object's keys recursively.
 *
 * @param {Object} object
 *
 * @returns {Object}
 */
export function flattenObject(object) {
  const flattenObj = (obj, keys = []) => {
    return Object.keys(obj).reduce((acc, key) => {
      if (isPlainObject(obj[key])) {
        return {
          ...acc,
          ...flattenObj(obj[key], keys.concat(key)),
        };
      }

      return {
        ...acc,
        ...{
          [keys.concat(key).join('.')]: obj[key],
        },
      };
    }, {});
  };

  return flattenObj(object);
}

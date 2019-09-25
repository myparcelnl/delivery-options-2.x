/**
 * Recursively search for dependencies.
 *
 * @param {Object} dependencies - Haystack.
 * @param {Array|String} dependencyNames - Dependency name(s).
 *
 * @returns {*}
 */
import { configBus } from '@/config/configBus';

export function getDependencies(dependencies, dependencyNames) {
  // Create a new array to avoid overwriting dependencyNames.
  const needles = typeof dependencyNames === 'string' ? [dependencyNames] : [...dependencyNames];
  const { values } = configBus;
  let result = null;

  needles.forEach((needle, index) => {
    if (dependencies.hasOwnProperty(needle)) {
      result = dependencies[needle][values[needle]];
      needles.splice(index, 1);

      // Get the first item if result is undefined
      if (!result) {
        const [first] = Object.keys(dependencies[needle]);
        result = dependencies[needle][first];
      }

      if (needles.length > 0) {
        result = getDependencies(result, needles);
      }
    }
  });

  return result;
}

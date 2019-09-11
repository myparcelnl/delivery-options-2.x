/**
 * Add a data-test attribute to an element with 'v-test="..."', but only if the environment is 'test'.
 *
 * @param {Element} el - The element with the v-test attribute.
 * @param {Object} binding - The value for the attribute.
 */
export const vTest = (el, binding) => {
  if (process.env.NODE_ENV === 'test') {
    el.setAttribute('data-test-id', binding.value);
  }
};

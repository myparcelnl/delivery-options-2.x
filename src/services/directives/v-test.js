/**
 * Add a data-test attribute to an element with 'v-test="..."', but only if the environment is 'test' or 'development'.
 *
 * @param {Element} el - The element with the v-test attribute.
 * @param {Object} binding - The value for the attribute.
 */
export const vTest = (el, binding) => {
  if (['test', 'development'].includes(process.env.NODE_ENV)) {
    el.setAttribute('data-test-id', binding.value);
  }
};

/**
 * Helper function for use with vue-test-utils wrappers.
 *
 * Taken from https://dev.to/dasdaniel/extending-vue-test-utils-5c8g and modified/extended further.
 *
 * @param {Wrapper} wrapper - Wrapper object to run functions on.
 * @returns {Object}
 */
export function withWrapper(wrapper) {
  return {
    find: (selector) => ({
      childSelectorHasText: (childSelector, str) => {
        return wrapper.findAll(selector).filter((i) => i.find(childSelector).text().match(str));
      },
      withText: (str) => {
        return wrapper.findAll(selector).filter((i) => i.text().match(str)).at(0);
      },
    }),
    findById: (selector) => wrapper.find(`[data-test-id="${selector}"]`),
    areVisible: (selector) => wrapper.findAll(selector).wrappers.filter((wrapper) => wrapper.isVisible()).length,
    areHidden: (selector) => wrapper.findAll(selector).wrappers.filter((wrapper) => !wrapper.isVisible()).length,
    areAllVisible: (selector) => wrapper.findAll(selector).wrappers.every((wrapper) => wrapper.isVisible()),
    areAllHidden: (selector) => wrapper.findAll(selector).wrappers.every((wrapper) => !wrapper.isVisible()),
  };
}


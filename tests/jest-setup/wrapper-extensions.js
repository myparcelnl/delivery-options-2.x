/**
 * @param wrapper
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


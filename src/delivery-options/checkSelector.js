/**
 * @param {CustomEvent|Event} event - Event.
 * @param {String} selector - CSS selector.
 *
 * @returns {String|undefined}
 */
export function checkSelector(event, selector) {
  if (event instanceof CustomEvent && event.detail.selector) {
    selector = event.detail.selector;
  }

  if (!document.querySelector(selector)) {
    // eslint-disable-next-line no-console
    console.error(`${selector} not found`);

    return;
  }

  return selector;
}

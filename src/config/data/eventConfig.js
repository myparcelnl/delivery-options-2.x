/**
 * Sent to configBus when a setting is updated.
 *
 * @type {string}
 */
export const UPDATE = 'update';

/**
 * Sent to configBus after a setting is updated (by `UPDATE`).
 *
 * @type {string}
 */
export const AFTER_UPDATE = 'afterUpdate';

/**
 * Sent to configBus when an error has occurred.
 *
 * @type {string}
 */
export const ERROR = 'error';

/**
 * For the external platform to tell this application to update.
 *
 * @type {string}
 */
export const UPDATE_CHECKOUT_IN = 'myparcel_update_checkout';

/**
 * To tell the external platform the address is updated.
 *
 * @type {string}
 */
export const ADDRESS_UPDATED_OUT = 'address_updated';

/**
 * To tell the external platform it needs to update.
 *
 * @type {string}
 */
export const UPDATE_CHECKOUT_OUT = 'update_checkout';

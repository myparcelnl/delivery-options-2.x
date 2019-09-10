/*
 * configBus events
 */

/**
 * Sent by configBus when a setting is updated.
 *
 * @type {string}
 */
export const UPDATE = 'update';

/**
 * Sent by configBus after a setting is updated (by `UPDATE`).
 *
 * @type {string}
 */
export const AFTER_UPDATE = 'afterUpdate';

/**
 * Sent by configBus when an error has occurred.
 *
 * @type {string}
 */
export const ERROR = 'error';

/*
 * Document events
 * The following events should be namespaced to avoid any possible conflicts.
 */

/**
 * This event is used to change the config after the initialization.
 *
 * @type {string}
 */
export const UPDATE_CONFIG_IN = 'myparcel_update_config';

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
export const UPDATE_ADDRESS_OUT = 'myparcel_updated_address';

/**
 * To tell the external platform it needs to update.
 *
 * @type {string}
 */
export const UPDATE_CHECKOUT_OUT = 'myparcel_updated_checkout';

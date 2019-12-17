import { CARRIER_SETTINGS } from '@/config/data/settingsConfig';
import { DEFAULT_PLATFORM } from '@/config/data/platformConfig';
import _mergeWith from 'lodash.mergewith';
import { defaultConfig } from '@/config/data/defaultConfig';

/**
 * Get the window object supplied by the environment we're in. Parse it as JSON if needed.
 *
 * @returns {MyParcelDeliveryOptions.Configuration}
 */
const getWindowObject = () => {
  // Allow mocking for user and tests.
  if (!window.hasOwnProperty('MyParcelConfig')) {
    if (['development', 'test'].includes(process.env.NODE_ENV)) {
      window.MyParcelConfig = {};
    } else {
      throw 'No config found! (window.MyParcelConfig is required.)';
    }
  }

  return typeof window.MyParcelConfig === 'string'
    ? JSON.parse(window.MyParcelConfig)
    : window.MyParcelConfig;
};

/**
 * Get the address from the window object and convert cc to lowercase.
 *
 * @returns {MyParcelDeliveryOptions.Address}
 */
export const getAddress = () => {
  const address = getWindowObject().address || {};

  if (address.cc) {
    address.cc = address.cc.toLowerCase();
  }

  return address;
};

/**
 * Get data from the window config object and convert some variables.
 *
 * @returns {MyParcelDeliveryOptions.Configuration}
 */
export const getConfig = () => {
  const windowObject = getWindowObject();

  // Get the given platform or fall back to default
  const platform = windowObject.config ? windowObject.config.platform : DEFAULT_PLATFORM;

  /**
   * Customizer function for lodash mergeWith().
   *
   * @param {*} defaultVal - The default value.
   * @param {*} newVal - The new value.
   * @param {String} key - Key of the current property.
   *
   * @returns {*}
   */
  const customizer = (defaultVal, newVal) => {
    return newVal === null || newVal === '' ? defaultVal : undefined;
  };

  /**
   * Merge the config data with the default config. Uses lodash mergeWith to be able to skip undefined entries.
   *
   * @see https://lodash.cobm/docs/4.17.15#mergeWith
   */
  return _mergeWith({}, defaultConfig(platform), windowObject, customizer);
};

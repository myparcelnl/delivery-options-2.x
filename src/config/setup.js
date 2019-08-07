import { DEFAULT_PLATFORM } from '@/config/data/platformConfig';
import _mergeWith from 'lodash.mergewith';
import { defaultConfig } from '@/config/data/defaultConfig';

export const mock = false;

/**
 * Get the window object supplied by the environment we're in. Parse it as JSON if needed.
 *
 * @returns {MyParcel.CheckoutConfiguration}
 */
function getWindowObject() {
  return typeof window.MyParcelConfig === 'string'
    ? JSON.parse(window.MyParcelConfig)
    : window.MyParcelConfig;
}

/**
 * Get the address from the window object.
 *
 * @returns {MyParcel.CheckoutAddress}
 */
export const getAddress = () => {
  return getWindowObject().address;
};

/**
 * Modifies the config data.
 *
 * @param {MyParcel.CheckoutConfiguration} data - Configuration.
 *
 * @returns {MyParcel.CheckoutConfiguration}
 */
const prepareConfig = (data) => {
  // Allow array of strings, single string and comma separated strings as input for carriers.
  if (typeof data.config.carriers === 'string') {
    if (data.config.carriers.includes(',')) {
      data.config.carriers = data.config.carriers.split(',');
    } else {
      data.config.carriers = [data.config.carriers];
    }
  }

  return data;
};

/**
 * Get data from the window config object and convert some variables.
 *
 * @returns {MyParcel.CheckoutConfiguration}
 */
export const getConfig = () => {
  const windowObject = getWindowObject();

  // Get the default config by given platform or fall back to default
  const defaultConfigObject = defaultConfig(windowObject.config.platform || DEFAULT_PLATFORM);

  /**
   * Customizer function for lodash mergeWith().
   *
   * @param {*} defaultVal  - The default value.
   * @param {*} newVal - The new value.
   *
   * @returns {undefined}
   */
  const customizer = (defaultVal, newVal) => {
    return newVal === null || newVal === '' ? defaultVal : undefined;
  };

  // Merge the config data with the default config. Uses lodash mergeWith to be able to skip undefined entries.
  // @see https://lodash.cobm/docs/4.17.15#mergeWith
  const data = _mergeWith({}, defaultConfigObject, windowObject, customizer);

  return prepareConfig(data);
};

import { DEFAULT_PLATFORM } from '@/config/data/platformConfig';
import _mergeWith from 'lodash.mergewith';
import { defaultConfig } from '@/config/data/defaultConfig';

export const mock = false;

/**
 * Get the window object supplied by the environment we're in. Parse it as JSON if needed.
 *
 * @returns {MyParcel.DeliveryOptionsConfiguration}
 */
const getWindowObject = () => {
  // Allow mocking for user and tests.
  if (!window.hasOwnProperty('MyParcelConfig') || mock === true) {
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
 * @returns {MyParcel.DeliveryOptionsAddress}
 */
export const getAddress = () => {
  const { address } = getWindowObject();
  address.cc = address.cc.toLowerCase();
  return address;
};

/**
 * Modifies the config data.
 *
 * @param {MyParcel.DeliveryOptionsConfiguration} data - Configuration.
 *
 * @returns {MyParcel.DeliveryOptionsConfiguration}
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
 * @returns {MyParcel.DeliveryOptionsConfiguration}
 */
export const getConfig = () => {
  const windowObject = getWindowObject();

  // Get the given platform or fall back to default
  const platform = windowObject.config ? windowObject.config.platform : DEFAULT_PLATFORM;

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
  const data = _mergeWith({}, defaultConfig(platform), windowObject, customizer);

  return prepareConfig(data);
};

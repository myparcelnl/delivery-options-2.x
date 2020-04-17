import { CARRIER_SETTINGS } from '@/data/keys/configKeys';
import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { getWindowObject } from '@/delivery-options/config/getWindowObject';
import mergeWith from 'lodash-es/mergeWith';

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
   * @param {String} key - Key of the current object.
   *
   * @returns {*}
   */
  const customizer = (defaultVal, newVal, key) => {
    // If carrier settings is being changed in any way, discard its default value.
    if (key === CARRIER_SETTINGS) {
      return newVal;
    }

    return newVal === null || newVal === '' ? defaultVal : undefined;
  };

  /**
   * Merge the config data with the default config. Uses lodash mergeWith to be able to skip undefined entries.
   *
   * @see https://lodash.cobm/docs/4.17.15#mergeWith
   */
  return mergeWith({}, defaultConfiguration(platform), windowObject, customizer);
};

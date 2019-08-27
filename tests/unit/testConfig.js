import { MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { configBus } from '@/config/configBus';
import { defaultConfig } from '@/config/data/defaultConfig';

/**
 * @type {Object<MyParcel.CheckoutAddress>}
 */
export const defaultAddress = {
  [MYPARCEL]: {
    postalCode: '2132WT',
    number: 66,
    cc: 'nl',
  },
  [SENDMYPARCEL]: {
    postalCode: '2000',
    city: 'Antwerpen',
    number: 16,
    cc: 'be',
  },
};

const emptyData = {
  address: {},
  config: {},
  strings: {},
};

/**
 * Get a configBus instance with the given default platform data and optional overrides.
 *
 * @param {MyParcel.Platform|Object} platform - Platform name or.
 * @param {Object} data - Platform name or.
 *
 * @returns {Vue}
 */
export const getConfigBus = (platform = SENDMYPARCEL, data = emptyData) => {
  if (typeof platform === 'string') {
    platform = defaultConfig(platform);
  }

  configBus.$data.config = { ...platform.config, ...data.config };
  configBus.$data.address = { ...platform.address, ...data.address };
  configBus.$data.strings = { ...platform.strings, ...data.strings };

  return configBus;
};

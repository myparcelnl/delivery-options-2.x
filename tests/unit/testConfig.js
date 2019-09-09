import { DEFAULT_PLATFORM, MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { carrierData } from '../placeholder/carrierData';
import { createCarrierData } from '@/data/carriers/createCarrierData';
import { createConfigBus } from '@/config/configBus';
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
 * @param {MyParcel.Platform|Object} platform - Platform name or settings object.
 * @param {Object} data - Platform name or.
 *
 * @returns {Object}
 */
export const getConfigBus = (platform = DEFAULT_PLATFORM, data = emptyData) => {
  const configBus = createConfigBus();
  if (typeof platform === 'string') {
    platform = defaultConfig(platform);
  }

  configBus.$data.config = { ...platform.config, ...data.config };
  configBus.$data.address = { ...platform.address, ...data.address };
  configBus.$data.strings = { ...platform.strings, ...data.strings };

  const { carriers } = configBus.$data.config;

  if (carriers) {
    configBus.$data.carrierData = createCarrierData(carriers.map((carrier) => carrierData(carrier)));
  }

  return configBus;
};

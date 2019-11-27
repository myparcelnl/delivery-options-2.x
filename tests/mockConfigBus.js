import { DEFAULT_PLATFORM, MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { createConfigBus } from '@/config/configBus';

/**
 * @type {object<MyParcelDeliveryOptions.Address>}
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

/**
 * Get a configBus instance with the given default platform data and optional overrides.
 *
 * @param {Object|MyParcel.Platform} data - Data object. Platform name can be used as a shorthand.
 *
 * @returns {Object}
 */
export const mockConfigBus = (data = DEFAULT_PLATFORM) => {
  let platform = data.hasOwnProperty('config') && data.config.hasOwnProperty('platform')
    ? data.config.platform
    : DEFAULT_PLATFORM;

  if (typeof data === 'string') {
    platform = data;
    data = {};
  }

  window.MyParcelConfig = {
    ...{
      address: defaultAddress[platform],
    },
    ...{
      ...{
        config: {
          platform,
        },
      },
      ...data,
    },
  };

  return createConfigBus();
};

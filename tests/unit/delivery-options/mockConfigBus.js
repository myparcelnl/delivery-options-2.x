import * as ADDRESS from '@/data/keys/addressKeys';
import * as CONFIG from '@/data/keys/configKeys';
import * as STRINGS from '@/data/keys/stringsKeys';
import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import { createConfigBus } from '@/delivery-options/config/configBus';
import { defaultAddress } from '@/data/defaultAddress';
import { defaultConfig } from '@/config/defaultConfig';
import mergeWith from 'lodash-es/mergeWith';

/**
 * Get a configBus instance with the given default platform data and optional overrides.
 *
 * @param {MyParcelDeliveryOptions.Configuration|MyParcel.Platform} data - Data object. Platform name can be used as a
 *  shorthand.
 *
 * @returns {import('@/delivery-options/config/configBus')}
 */
export const mockConfigBus = (data = DEFAULT_PLATFORM) => {
  const platformInConfig = data.hasOwnProperty(CONFIG.KEY) && data[CONFIG.KEY].hasOwnProperty(CONFIG.PLATFORM);

  let platform = platformInConfig
    ? data[CONFIG.KEY][CONFIG.PLATFORM]
    : DEFAULT_PLATFORM;

  if (typeof data === 'string') {
    platform = data;
    data = {};
  }

  // Merge data into the default config.
  window.MyParcelConfig = mergeWith(
    {
      ...defaultConfig(platform),
      [ADDRESS.KEY]: defaultAddress[platform],
    },
    data,
    (objValue, srcValue, key) => {
      // Override everything directly except the config and strings objects.
      if (![CONFIG.KEY, STRINGS.KEY].includes(key)) {
        return srcValue;
      }
    },
  );

  return createConfigBus();
};

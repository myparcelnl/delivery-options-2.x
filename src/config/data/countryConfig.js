import { MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { configBus } from '@/config/configBus';

/**
 * The country codes for each platform which are allowed to have delivery options.
 *
 * @type {Object.<Array>}
 */
const allowedCountries = {
  [MYPARCEL]: ['nl', 'be'],
  [SENDMYPARCEL]: ['nl', 'be'],
};

/**
 * @param {MyParcel.Platform} platform - Platform name or id.
 *
 * @returns {Array}
 */
export const allowedCountryCodesForPlatform = (platform = configBus.config.platform) => {
  return allowedCountries[platform];
};

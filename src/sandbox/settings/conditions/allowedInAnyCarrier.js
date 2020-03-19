import { allowedInCarrier } from '@/sandbox/settings/conditions/allowedInCarrier';
import { platformCarrierMap } from '@/config/platformConfig';

/**
 * Pass given data in an array if setting is allowed in any carrier of the current platform.
 *
 * @param {String} setting
 * @param {String} data - Form data.
 * @param {MyParcel.Platform} platform
 *
 * @returns {Array}
 */
export const allowedInAnyCarrier = (setting, data, platform) => {
  const allowed = platformCarrierMap[platform].some((carrier) => allowedInCarrier(carrier, setting));

  return allowed ? [data] : [];
};

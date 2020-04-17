import { allowedInCarrier } from '@/sandbox/settings/conditions/allowedInCarrier';
import { platformCarrierMap } from '@/config/platformConfig';

/**
 * Pass given data in an array if setting(s) are allowed in any carrier of the current platform.
 *
 * @param {String|String[]} settings
 * @param {String} data - Form data.
 * @param {MyParcel.Platform} platform
 *
 * @returns {Array}
 */
export const allowedInAnyCarrier = (settings, data, platform) => {
  const allowed = platformCarrierMap[platform].some((carrier) => {
    if (Array.isArray(settings)) {
      return settings.every((setting) => allowedInCarrier(carrier, setting));
    }

    return allowedInCarrier(carrier, settings);
  });

  return allowed ? [data] : [];
};

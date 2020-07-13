import { carrierPermissions } from '@/sandbox/settings/carrierPermissions';

/**
 * Checks if a carrier allows one or more features.
 *
 * @param {MyParcel.CarrierName} carrier
 * @param {String|String[]} features
 *
 * @returns {Boolean}
 */
export function allowedInCarrier(carrier, features) {
  if (Array.isArray(features)) {
    return features.some((feature) => carrierPermissions[carrier].includes(feature));
  }

  return carrierPermissions[carrier].includes(features);
}

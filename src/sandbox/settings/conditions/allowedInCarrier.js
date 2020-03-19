import { carrierPermissions } from '@/sandbox/settings/carrierPermissions';

/**
 * Checks if a carrier allows a feature.
 *
 * @param {MyParcel.CarrierName} carrier
 * @param {String} feature
 *
 * @returns {Boolean}
 */
export function allowedInCarrier(carrier, feature) {
  return carrierPermissions[carrier].includes(feature);
}

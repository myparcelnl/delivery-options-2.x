import { getCarrierSettingsPath } from '@/sandbox/settings/conditions/getCarrierSettingsPath';
import { platformCarrierMap } from '@/config/platformConfig';
import { sandboxConfigBus } from '@/sandbox/sandboxConfigBus';

/**
 * Match fallback value and any carrier's value.
 *
 * @param {String} setting - The setting to validate.
 *
 * @returns {Array}
 */
export function inAnyCarrier(setting) {
  const { platform } = sandboxConfigBus;

  return platformCarrierMap[platform].map((carrier) => getCarrierSettingsPath(carrier, setting));
}

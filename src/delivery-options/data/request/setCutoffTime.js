import * as CONFIG from '@/data/keys/configKeys';

const FRIDAY = 5;
const SATURDAY = 6;

/**
 * Set cutoff time for a special delivery day. Returns default if the conditions for Monday or Saturday delivery don't
 *  pass.
 *
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {MyParcelDeliveryOptions.Config.cutoffTime}
 */
export function setCutOffTime(configBus) {
  const defaultCutOffTime = configBus.get(CONFIG.CUTOFF_TIME);

  const fridayCutoffTime = configBus.get(CONFIG.FRIDAY_CUTOFF_TIME);
  const saturdayCutoffTime = configBus.get(CONFIG.SATURDAY_CUTOFF_TIME);

  const hasMondayDelivery = configBus.get(CONFIG.ALLOW_MONDAY_DELIVERY);
  const hasSaturdayDelivery = configBus.get(CONFIG.ALLOW_SATURDAY_DELIVERY);

  const today = new Date().getDay();

  if (today === SATURDAY && hasMondayDelivery && saturdayCutoffTime) {
    return saturdayCutoffTime;
  }

  if (today === FRIDAY && hasSaturdayDelivery && fridayCutoffTime) {
    return fridayCutoffTime;
  }

  return defaultCutOffTime;
}

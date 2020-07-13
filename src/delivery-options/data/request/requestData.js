import * as CONFIG from '@/data/keys/configKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';
import { setCutOffTime } from '@/delivery-options/data/request/setCutoffTime';

const getParametersForNL = (configBus) => ({
  monday_delivery: configBus.get(CONFIG.ALLOW_MONDAY_DELIVERY),
});

const getParametersForBE = (configBus) => ({
  /*
   * TODO:
   *  See https://jira.dmp.zone/browse/MY-12648
   *   > "Day-picker is nog niet van toepassing voor SendMyParcel. De data die
   *     terugkomt is zelf opgebouwd door JW en komt niet officieel uit bpost/DPD."
   *  When this is no longer relevant this override can be removed.
   */
  deliverydays_window: 1,
  saturday_delivery: configBus.get(CONFIG.ALLOW_SATURDAY_DELIVERY),
});

const parametersByPlatform = {
  [MYPARCEL]: getParametersForNL,
  [SENDMYPARCEL]: getParametersForBE,
};

/**
 * Get the request parameters for the given platform.
 *
 * @param {MyParcel.Platform} platform - Platform name.
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {Object}
 */
export function getParametersByPlatform(platform = realConfigBus.get(CONFIG.PLATFORM), configBus = realConfigBus) {
  return {
    ...parametersByPlatform[platform](configBus),
    cutoff_time: setCutOffTime(configBus),
  };
}

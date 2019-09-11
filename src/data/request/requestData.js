import * as SETTINGS from '@/config/data/settingsConfig';
import { FLESPAKKET, MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { configBus } from '@/config/configBus';

const getParametersForNL = () => ({
  monday_delivery: configBus.get(SETTINGS.ALLOW_MONDAY_DELIVERY),
});

const getParametersForBE = () => ({
  // TODO:
  //  "Day-picker is nog niet van toepassing voor SendMyParcel. De data die terugkomt is zelf opgebouwd door JW
  // en komt niet officieel uit bpost/DPD." < uit https://jira.dmp.zone/browse/MY-12648 Wanneer dit niet meer
  // van toepassing is moet deze override weg.
  deliverydays_window: 1,
});

const parametersByPlatform = {
  [MYPARCEL]: getParametersForNL,
  [FLESPAKKET]: getParametersForNL,
  [SENDMYPARCEL]: getParametersForBE,
};

/**
 * Get the request parameters for the given platform.
 *
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {Object}
 */
export function getParametersByPlatform(platform = configBus.get(SETTINGS.PLATFORM)) {
  return parametersByPlatform[platform]();
}

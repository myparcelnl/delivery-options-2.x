import * as SETTINGS from '@/config/data/settingsConfig';
import { configBus } from '@/config/configBus';

/**
 * These parameters are optional. If their respective settings  are not defined by the user they are not added to the
 *  parameters to use the default values from the API.
 *
 * @returns {Object}
 */
export const getOptionalRequestParameters = () => {
  const dropOffDays = configBus.get(SETTINGS.DROP_OFF_DAYS);

  return {
    cutoff_time: configBus.get(SETTINGS.CUTOFF_TIME),
    deliverydays_window: configBus.get(SETTINGS.DELIVERY_DAYS_WINDOW),
    // Convert dropOffDays to a semicolon separated string if needed
    dropoff_days: Array.isArray(dropOffDays) ? dropOffDays.join(';') : dropOffDays,
    dropoff_delay: configBus.get(SETTINGS.DROP_OFF_DELAY),
  };
};

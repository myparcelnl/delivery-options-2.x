import * as CONFIG from '@/data/keys/configKeys';
import { configBus as realConfigBus } from '@/delivery-options/config/configBus';

/**
 * These parameters are optional. If their respective settings  are not defined by the user they are not added to the
 * parameters to use the default values from the API.
 *
 * @param {import('@/delivery-options/config/configBus')} configBus - Optional parameter for easier testing.
 *
 * @returns {Object}
 */
export const getOptionalRequestParameters = (configBus = realConfigBus) => {
  const dropOffDays = configBus.get(CONFIG.DROP_OFF_DAYS);

  return {
    cutoff_time: configBus.get(CONFIG.CUTOFF_TIME),
    deliverydays_window: configBus.get(CONFIG.DELIVERY_DAYS_WINDOW),
    // Convert dropOffDays to a semicolon separated string if needed
    dropoff_days: Array.isArray(dropOffDays) ? dropOffDays.join(';') : dropOffDays,
    dropoff_delay: configBus.get(CONFIG.DROP_OFF_DELAY),
  };
};

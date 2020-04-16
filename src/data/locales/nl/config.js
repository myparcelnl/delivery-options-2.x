import * as CARRIERS from '@/data/keys/carrierKeys';
import * as CONFIG from '@/data/keys/configKeys';

export const config = {
  [CONFIG.LOCALE]: 'nl-NL',
  [CONFIG.ALLOW_MONDAY_DELIVERY]: true,
  [CONFIG.SATURDAY_CUTOFF_TIME]: '16:00',

  [CONFIG.CARRIER_SETTINGS]: {
    [CARRIERS.POSTNL]: {
      [CONFIG.ALLOW_DELIVERY_OPTIONS]: true,
      [CONFIG.ALLOW_PICKUP_LOCATIONS]: true,
    },
  },
};

import * as CONFIG from '@/data/keys/configKeys';

export const getCarrierSettingsPath = (...setting) => [CONFIG.KEY, CONFIG.CARRIER_SETTINGS, ...setting].join('.');

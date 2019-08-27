import { DEFAULT_PLATFORM, FLESPAKKET, MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { configBus } from '@/config/configBus';

/**
 * Map platform names to their respective URLs.
 */
const platformUrlMap = {
  [SENDMYPARCEL]: 'sendmyparcel.be',
  [MYPARCEL]: 'myparcel.nl',
  [FLESPAKKET]: 'flespakket.nl',
};

export const url = platformUrlMap[configBus.config ? configBus.config.platform : DEFAULT_PLATFORM];

export const appConfig = {};

appConfig.prod = {
  apiUrl: `https://api.${url}`,
  assetsUrl: `https://assets.${url}`,
};

appConfig.stage = {
  apiUrl: `https://api.staging.${url}`,
  assetsUrl: appConfig.prod.assetsUrl,
};

appConfig.dev = {
  apiUrl: `http://api.dev.${url}`,
  assetsUrl: appConfig.prod.assetsUrl,
};

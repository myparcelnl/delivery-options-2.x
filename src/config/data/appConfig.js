import { DEFAULT_PLATFORM, MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { configBus } from '@/config/configBus';

/**
 * Map platform names to their respective URLs.
 */
const platformUrlMap = {
  [SENDMYPARCEL]: 'sendmyparcel.be',
  [MYPARCEL]: 'myparcel.nl',
};

const platform = configBus && configBus.config ? configBus.config.platform : DEFAULT_PLATFORM;

const url = platformUrlMap[platform];

const config = {};

config.production = {
  apiUrl: `https://api.${url}`,
  assetsUrl: `https://assets.${url}`,
};

config.staging = {
  apiUrl: `https://api.staging.${url}`,
  assetsUrl: config.production.assetsUrl,
};

config.development = {
  apiUrl: `http://api.dev.${url}`,
  assetsUrl: config.production.assetsUrl,
};

config.test = config.production;

/**
 * Config by environment and platform.
 */
export const appConfig = config[process.env.NODE_ENV];

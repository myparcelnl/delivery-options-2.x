import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import { configBus } from '@/delivery-options/config/configBus';
import { platformUrlMap } from '@/config/platformConfig';

/**
 * Overrides environment. For use when developing. Set to null to use default behavior.
 *
 * @type {String}
 */
const mode = 'production';

const platform = configBus && configBus.config
  ? configBus.config.platform
  : DEFAULT_PLATFORM;

const url = platformUrlMap[platform];

const config = {};

config.production = {
  apiUrl: `https://api.${url}`,
  assetsUrl: `https://assets.${url}`,
};

config.staging = {
  ...config.production,
  apiUrl: `https://api.staging.${url}`,
};

config.development = {
  ...config.production,
  apiUrl: `http://api.dev.${url}`,
};

config.test = config.production;

/**
 * Config by environment and platform.
 */
export const appConfig = config[mode || process.env.NODE_ENV];

import { API_BASE_URL } from '@/config/data/settingsConfig';
import { appConfig } from '@/config/data/appConfig';
import { configBus } from '@/config/configBus';

/**
 * Get the apiUrl, first check if there is one entered in the config and return that, if not select either the prod or
 * dev URL from the appConfig based on the app's environment.
 *
 * @returns {URL}
 */
export function getApiUrl() {
  const apiUrl = configBus.config.hasOwnProperty(API_BASE_URL)
    ? configBus.get(API_BASE_URL)
    : appConfig.apiUrl;

  return new URL(apiUrl);
}

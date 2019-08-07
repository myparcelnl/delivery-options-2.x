import * as SETTINGS from '@/config/data/settingsConfig';
import { isDev } from '@/config/data/platformConfig';

export const config = {
  [SETTINGS.ALLOW_SATURDAY_DELIVERY]: 1,
  [SETTINGS.API_BASE_URL]: isDev ? 'http://api.dev.sendmyparcel.be' : 'https://api.sendmyparcel.be',
  [SETTINGS.CARRIERS]: ['bpost', 'dpd'],
  [SETTINGS.LOCALE]: 'nl-BE',
};

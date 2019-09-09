import * as SETTINGS from '@/config/data/settingsConfig';
import { isDev } from '@/config/data/platformConfig';

export const config = {
  [SETTINGS.API_BASE_URL]: isDev ? 'http://api.dev.myparcel.nl' : 'https://api.myparcel.nl',
  [SETTINGS.CARRIERS]: ['postnl'],
  [SETTINGS.LOCALE]: 'nl-NL',
  [SETTINGS.ALLOW_MONDAY_DELIVERY]: 1,
  [SETTINGS.SATURDAY_CUTOFF_TIME]: '16:00',
};

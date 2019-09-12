import { config as beConfig } from '@/config/data/locales/be/config';
import { strings as beStrings } from '@/config/data/locales/be/strings';
import { config as nlConfig } from '@/config/data/locales/nl/config';
import { strings as nlStrings } from '@/config/data/locales/nl/strings';

export const MYPARCEL = 'myparcel';
export const SENDMYPARCEL = 'belgie';

export const DEFAULT_PLATFORM = MYPARCEL;

export const isDev = process.env.NODE_ENV === 'development';

const configMap = {
  nl: {
    config: nlConfig,
    strings: nlStrings,
  },
  be: {
    config: beConfig,
    strings: beStrings,
  },
};

export const addressRequirements = {
  nl: ['postalCode', 'number'],
  be: ['postalCode'], // , 'city' // todo it's not mandatory right now?!
};

/**
 * Map platforms to locales.
 *
 * @type {Object<MyParcel.Platform, String>}
 */
const platformLocaleMap = {
  [SENDMYPARCEL]: 'be',
  [MYPARCEL]: 'nl',
};

/**
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {MyParcel.DeliveryOptionsConfiguration}
 */
export const platformConfig = (platform) => {
  return configMap[platformLocaleMap[platform]];
};

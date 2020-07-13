import * as CONFIG from '@/data/keys/configKeys';
import * as STRINGS from '@/data/keys/stringsKeys';
import { config as beConfig } from '@/data/locales/be/config';
import { strings as beStrings } from '@/data/locales/be/strings';
import { config as nlConfig } from '@/data/locales/nl/config';
import { strings as nlStrings } from '@/data/locales/nl/strings';

export const NL = 'nl';
export const BE = 'be';

/**
 * @type {Object<String, MyParcelDeliveryOptions.Configuration>}
 */
export const CONFIG_MAP = {
  [NL]: {
    [CONFIG.KEY]: nlConfig,
    [STRINGS.KEY]: nlStrings,
  },
  [BE]: {
    [CONFIG.KEY]: beConfig,
    [STRINGS.KEY]: beStrings,
  },
};

/**
 * TODO: Temporary hard coded requirements. Depends on https://jira.dmp.zone/browse/MY-16173.
 *
 * @type {Object<String, String[]>}
 */
export const addressRequirements = {
  [NL]: ['postalCode', 'number'],
  [BE]: ['postalCode', 'city'],
};

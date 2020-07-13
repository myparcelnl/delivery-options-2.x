import * as CONFIG from '@/data/keys/configKeys';
import * as CONSTS from '@/data/keys/settingsConsts';
import * as STRINGS from '@/data/keys/stringsKeys';

/**
 * For internal use only.
 *
 * @type {String}
 */
export const ALLOW_PACKAGE_TYPE_DIGITAL_STAMP = 'allowPackageTypeDigitalStamp';
export const ALLOW_PACKAGE_TYPE_MAILBOX = 'allowPackageTypeMailbox';

export const packageTypeLabelMap = {
  [CONSTS.PACKAGE_TYPE_DIGITAL_STAMP]: STRINGS.PACKAGE_TYPE_DIGITAL_STAMP,
  [CONSTS.PACKAGE_TYPE_MAILBOX]: STRINGS.PACKAGE_TYPE_MAILBOX,
};

export const packageTypePriceMap = {
  [CONSTS.PACKAGE_TYPE_PACKAGE]: CONFIG.PRICE_STANDARD_DELIVERY,
  [CONSTS.PACKAGE_TYPE_DIGITAL_STAMP]: CONFIG.PRICE_PACKAGE_TYPE_DIGITAL_STAMP,
  [CONSTS.PACKAGE_TYPE_MAILBOX]: CONFIG.PRICE_PACKAGE_TYPE_MAILBOX,
};

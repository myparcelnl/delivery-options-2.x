import * as CARRIERS from '@/data/keys/carrierKeys';
import * as LOCALE from '@/config/localeConfig';
import * as PLATFORMS from '@/data/keys/platformKeys';

/**
 * @type {MyParcel.Platform[]}
 */
export const platforms = [PLATFORMS.SENDMYPARCEL, PLATFORMS.MYPARCEL];

/**
 * @type {Object<MyParcel.Platform, MyParcel.CarrierName[]>}
 */
export const platformCarrierMap = {
  [PLATFORMS.MYPARCEL]: [CARRIERS.POSTNL],
  [PLATFORMS.SENDMYPARCEL]: [CARRIERS.BPOST, CARRIERS.DPD],
};

/**
 * Map platforms to locales.
 *
 * @type {Object<MyParcel.Platform, String>}
 */
const platformLocaleMap = {
  [PLATFORMS.SENDMYPARCEL]: LOCALE.BE,
  [PLATFORMS.MYPARCEL]: LOCALE.NL,
};

/**
 * Map platform names to their respective URLs.
 */
export const platformUrlMap = {
  [PLATFORMS.SENDMYPARCEL]: 'sendmyparcel.be',
  [PLATFORMS.MYPARCEL]: 'myparcel.nl',
};

/**
 * @param {MyParcel.Platform} platform - Platform name.
 *
 * @returns {MyParcelDeliveryOptions.Configuration}
 */
export const platformConfig = (platform) => {
  return LOCALE.CONFIG_MAP[platformLocaleMap[platform]];
};

export const platformTabs = [
  {
    name: PLATFORMS.MYPARCEL,
    human: 'platform.myparcel',
    links: [
      {
        text: 'links.backoffice',
        href: 'https://backoffice.myparcel.nl',
      },
      {
        text: 'links.website',
        href: 'https://myparcel.nl',
      },
    ],
  },
  {
    name: PLATFORMS.SENDMYPARCEL,
    human: 'platform.myparcel',
    links: [
      {
        text: 'links.backoffice',
        href: 'https://backoffice.sendmyparcel.be',
      },
      {
        text: 'links.website',
        href: 'https://sendmyparcel.be',
      },
    ],
  },
];

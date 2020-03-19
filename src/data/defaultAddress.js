/* eslint-disable no-magic-numbers */
import * as ADDRESS from '@/data/keys/addressKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';

/**
 * @type {object<MyParcelDeliveryOptions.Address>}
 */
export const defaultAddress = {
  [MYPARCEL]: {
    [ADDRESS.CC]: 'nl',
    [ADDRESS.NUMBER]: 66,
    [ADDRESS.POSTAL_CODE]: '2132WT',
  },
  [SENDMYPARCEL]: {
    [ADDRESS.CC]: 'be',
    [ADDRESS.CITY]: 'Antwerpen',
    [ADDRESS.NUMBER]: 16,
    [ADDRESS.POSTAL_CODE]: '2000',
  },
};

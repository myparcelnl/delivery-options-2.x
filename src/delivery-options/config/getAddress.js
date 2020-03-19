import { getWindowObject } from '@/delivery-options/config/getWindowObject';

/**
 * Use given address or get the address from the window object and convert cc to lowercase.
 *
 * @param {Object|null} address - Optional address object to use instead of window object.
 *
 * @returns {MyParcelDeliveryOptions.Address}
 */
export const getAddress = (address) => {
  const newAddress = address || getWindowObject().address || {};

  if (newAddress.cc) {
    newAddress.cc = newAddress.cc.toLowerCase();
  }

  return newAddress;
};

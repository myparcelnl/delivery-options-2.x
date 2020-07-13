import DeliveryOptions from '@/delivery-options/DeliveryOptions';
import { MYPARCEL } from '@/data/keys/platformKeys';
import { mockVue } from './mockVue';
import { mount } from '@vue/test-utils';

/**
 * @param {Object|MyParcel.CarrierName} data - Parameters to pass to mockConfigBus().
 *
 * @returns {Promise.<Wrapper>}
 */
export const mockApp = (data = MYPARCEL) => {
  const localVue = mockVue(data);

  return mount(DeliveryOptions, { localVue });
};

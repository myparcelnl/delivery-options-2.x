import App from '@/App';
import { MYPARCEL } from '@/config/data/platformConfig';
import { mockVue } from './mockVue';
import { mount } from '@vue/test-utils';

/**
 * @param {Object|MyParcel.CarrierName} data - Parameters to pass to mockConfigBus().
 *
 * @returns {Promise.<Wrapper>}
 */
export const mockApp = (data = MYPARCEL) => {
  const localVue = mockVue(data);

  return mount(App, { localVue });
};

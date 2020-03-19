import { mount, shallowMount } from '@vue/test-utils';
import Sandbox from '@/sandbox/Sandbox';
import { i18n } from '@/sandbox/services/vue-i18n';
import { mockVue } from './mockVue';

/**
 * @param {Boolean} shallow - Whether or not to do a shallow render.
 *
 * @returns {Promise.<Wrapper>}
 */
export const mockApp = (shallow = false) => {
  const localVue = mockVue();

  const mockFunction = shallow ? mount : shallowMount;

  return mockFunction(Sandbox, {
    localVue,
    i18n,
  });
};

import '@/services/directives';
import App from '@/App';
import AsyncComputed from 'vue-async-computed';
import { MYPARCEL } from '@/config/data/platformConfig';
import RecursiveForm from '@/components/RecursiveForm/RecursiveForm';
import Vue from 'vue';
import { configBus } from '@/config/configBus';
import { mockConfigBus } from './mockConfigBus';
import { mount } from '@vue/test-utils';

/**
 * @param {...*} config - Parameters to pass to mockConfigBus().
 *
 * @returns {Promise.<Wrapper>}
 */
export const mockApp = (config = MYPARCEL) => {
  mockConfigBus(config);

  Vue.use(AsyncComputed);
  Vue.component('recursive-form', RecursiveForm);

  Vue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;
  Vue.prototype.$configBus = configBus;

  return mount(App);
};

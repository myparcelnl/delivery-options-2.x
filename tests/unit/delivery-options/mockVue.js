import AsyncComputed from 'vue-async-computed';
import { MYPARCEL } from '@/data/keys/platformKeys';
import RecursiveForm from '@/delivery-options/components/RecursiveForm/RecursiveForm';
import { createLocalVue } from '@vue/test-utils';
import { mockConfigBus } from './mockConfigBus';
import { vTest } from '@/delivery-options/services/directives/v-test';

export const mockVue = (data = MYPARCEL) => {
  const localVue = createLocalVue();

  localVue.use(AsyncComputed);
  localVue.component('recursive-form', RecursiveForm);

  localVue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;
  localVue.prototype.$configBus = mockConfigBus(data);

  localVue.directive('test', vTest);

  return localVue;
};

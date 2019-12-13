import AsyncComputed from 'vue-async-computed';
import { MYPARCEL } from '@/config/data/platformConfig';
import RecursiveForm from '@/components/RecursiveForm/RecursiveForm';
import { configBus } from '@/config/configBus';
import { createLocalVue } from '@vue/test-utils';
import { mockConfigBus } from './mockConfigBus';
import { vTest } from '@/services/directives/v-test';

export const mockVue = (data = MYPARCEL) => {
  const localVue = createLocalVue();

  mockConfigBus(data);

  localVue.use(AsyncComputed);
  localVue.component('recursive-form', RecursiveForm);

  localVue.prototype.$classBase = process.env.VUE_APP_CLASS_BASE;
  localVue.prototype.$configBus = configBus;

  localVue.directive('test', vTest);

  return localVue;
};

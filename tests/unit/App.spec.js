import App from '@/App';
import Vue from 'vue';
import { configBus } from '@/config/configBus';
import { shallowMount } from '@vue/test-utils';

Vue.prototype.$configBus = configBus;

jest.spyOn(global.console, 'trace');
jest.spyOn(global.console, 'log');
jest.spyOn(global.console, 'warn');
jest.spyOn(global.console, 'error');

describe('App.vue', () => {
  let app;

  it('validates addresses', () => {
    app = shallowMount(App);
    expect(app.vm.hasValidAddress).toBe(false);

    app.vm.$configBus.address = {
      cc: 'nl',
      postalCode: '1025WK',
      number: 576,
    };
    expect(app.vm.hasValidAddress).toBe(true);

    app.vm.$configBus.address = {
      cc: 'nl',
      postalCode: '1025WK',
    };
    expect(app.vm.hasValidAddress).toBe(false);
  });
});

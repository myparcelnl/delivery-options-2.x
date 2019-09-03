import { defaultAddress, getConfigBus } from './testConfig';
import App from '@/App';
import { SENDMYPARCEL } from '@/config/data/platformConfig';
import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';

// Mock the Client because Travis can't use myparcel-js-sdk.
jest.mock('../../myparcel-js-sdk/src', () => jest.fn());

Vue.prototype.$configBus = getConfigBus(SENDMYPARCEL);

jest.spyOn(global.console, 'trace');
jest.spyOn(global.console, 'log');
jest.spyOn(global.console, 'warn');
jest.spyOn(global.console, 'error');

describe('App.vue', () => {
  let app;

  it('validates addresses', () => {
    app = shallowMount(App);
    app.vm.getCheckout = jest.fn();

    expect(app.vm.hasValidAddress).toBe(false);

    app.vm.$configBus.$data.address = defaultAddress[SENDMYPARCEL];
    expect(app.vm.hasValidAddress).toBe(true);

    app.vm.$configBus.$data.address = {
      cc: 'nl',
      postalCode: '1025WK',
    };
    expect(app.vm.hasValidAddress).toBe(false);
  });
});

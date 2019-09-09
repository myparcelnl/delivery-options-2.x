import * as SETTINGS from '@/config/data/settingsConfig';
import { MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { defaultAddress, getConfigBus } from './testConfig';
import App from '@/App';
import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';

describe('The checkout', () => {
  let app;

  it('checks address requirements', () => {
    Vue.prototype.$configBus = getConfigBus(SENDMYPARCEL);
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

  it('only shows itself when necessary', () => {
    Vue.prototype.$configBus = getConfigBus();
    app = shallowMount(App);

    expect(app.vm.hasSomethingToShow).toBe(false);

    Vue.prototype.$configBus = getConfigBus(MYPARCEL, {
      config: {
        carriers: ['postnl'],
        carrierSettings: {
          postnl: {
            [SETTINGS.ALLOW_DELIVERY_OPTIONS]: true,
            [SETTINGS.ALLOW_PICKUP_LOCATIONS]: false,
          },
        },
      },
    });
    app = shallowMount(App);

    expect(app.vm.hasSomethingToShow).toBe(true);
  });
});

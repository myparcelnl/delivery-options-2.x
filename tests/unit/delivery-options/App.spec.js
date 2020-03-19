import * as SETTINGS from '@/data/keys/configKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { mockApp } from './mockApp';

describe('Sandbox.vue', () => {
  let app;

  it('checks address requirements', () => {
    app = mockApp(SENDMYPARCEL);

    expect(app.vm.hasValidAddress).toBe(true);

    app.vm.$configBus.$data.address = {};
    expect(app.vm.hasValidAddress).toBe(false);

    app.vm.$configBus.$data.address = {
      cc: 'nl',
      postalCode: '1025WK',
    };
    expect(app.vm.hasValidAddress).toBe(false);
  });

  it('only shows itself when necessary', () => {
    app = mockApp();
    expect(app.vm.hasSomethingToShow).toBe(true);

    app = mockApp({
      config: {
        [SETTINGS.PLATFORM]: MYPARCEL,
        [SETTINGS.CARRIER_SETTINGS]: {
          postnl: {
            [SETTINGS.ALLOW_DELIVERY_OPTIONS]: false,
            [SETTINGS.ALLOW_PICKUP_LOCATIONS]: false,
          },
        },
      },
    });

    expect(app.vm.hasSomethingToShow).toBe(false);
  });
});

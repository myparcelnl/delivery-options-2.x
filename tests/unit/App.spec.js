import * as SETTINGS from '@/config/data/settingsConfig';
import { CARRIER, DELIVER, DELIVERY } from '@/config/data/formConfig';
import { MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { defaultAddress } from '../mockConfigBus';
import { mockApp } from '../mockApp';
import { withWrapper } from '../jest-setup/wrapper-extensions';

describe('App.vue', () => {
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

    // hasValidAddress is true as cc is allowed for current platform.
    app.vm.$configBus.$data.address = defaultAddress[MYPARCEL];
    expect(app.vm.hasSomethingToShow).toBe(true);
  });

  it('shows second carrier\'s options on the first click', () => {
    app = mockApp({
      config: {
        [SETTINGS.PLATFORM]: SENDMYPARCEL,
        [SETTINGS.CARRIER_SETTINGS]: {
          bpost: {
            [SETTINGS.ALLOW_DELIVERY_OPTIONS]: true,
            [SETTINGS.ALLOW_PICKUP_LOCATIONS]: true,
            [SETTINGS.ALLOW_SIGNATURE]: false,
            [SETTINGS.CUTOFF_TIME]: '18:00',
            [SETTINGS.DELIVERY_DAYS_WINDOW]: 1,
            [SETTINGS.DROP_OFF_DAYS]: ['1', '2', '3', '4', '5'],
            [SETTINGS.DROP_OFF_DELAY]: 0,
            [SETTINGS.PRICE_PICKUP]: -0.14,
            [SETTINGS.PRICE_SIGNATURE]: 0,
            [SETTINGS.PRICE_SATURDAY_DELIVERY]: 0,
          },
          dpd: {
            [SETTINGS.ALLOW_DELIVERY_OPTIONS]: true,
            [SETTINGS.ALLOW_PICKUP_LOCATIONS]: true,
            [SETTINGS.ALLOW_SIGNATURE]: false,
            [SETTINGS.CUTOFF_TIME]: '17:00',
            [SETTINGS.DELIVERY_DAYS_WINDOW]: 1,
            [SETTINGS.DROP_OFF_DAYS]: ['1', '2', '3', '4', '5'],
            [SETTINGS.DROP_OFF_DELAY]: 0,
            [SETTINGS.PRICE_PICKUP]: -0.2,
            [SETTINGS.PRICE_SIGNATURE]: 0,
            [SETTINGS.PRICE_SATURDAY_DELIVERY]: 0,
          },
        },
      },
    });

    expect(withWrapper(app).findById('form').exists()).toBe(true);
    expect(withWrapper(app).findById('loader').exists()).toBe(true);
    expect(withWrapper(app).findById(`${DELIVERY}--${DELIVER}`).exists()).toBe(true);
    expect(withWrapper(app).findById(`${CARRIER}--dpd`).exists()).toBe(true);
  });
});

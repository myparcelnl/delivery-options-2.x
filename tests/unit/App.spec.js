import * as SETTINGS from '@/config/data/settingsConfig';
import { CARRIER, DELIVER, DELIVERY } from '@/config/data/formConfig';
import { MYPARCEL, SENDMYPARCEL } from '@/config/data/platformConfig';
import { defaultAddress } from '../mockConfigBus';
import { mockApp } from '../mockApp';
import { withWrapper } from '../jest-setup/wrapper-extensions';

describe('The delivery options module', () => {
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
        platform: MYPARCEL,
        carrierSettings: {
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
        platform: SENDMYPARCEL,
        carrierSettings: {
          bpost: {
            allowDeliveryOptions: true,
            allowPickupLocations: true,
            allowSignature: false,
            cutoffTime: '18:00',
            deliveryDaysWindow: 1,
            dropOffDays: ['1', '2', '3', '4', '5'],
            dropOffDelay: 0,
            pricePickup: -0.14,
            priceSignature: 0,
            priceSaturdayDelivery: 0,
          },
          dpd: {
            allowDeliveryOptions: true,
            allowPickupLocations: true,
            allowSignature: false,
            cutoffTime: '17:00',
            deliveryDaysWindow: 1,
            dropOffDays: ['1', '2', '3', '4', '5'],
            dropOffDelay: 0,
            pricePickup: -0.2,
            priceSignature: 0,
            priceSaturdayDelivery: 0,
          },
        },
      },
    });

    expect(withWrapper(app).findById(`${DELIVERY}--${DELIVER}`).exists()).toBe(true);
    expect(withWrapper(app).findById(`${CARRIER}--dpd`).exists()).toBe(true);
  });
});

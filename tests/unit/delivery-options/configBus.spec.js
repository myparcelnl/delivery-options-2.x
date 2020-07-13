import * as SETTINGS from '@/data/keys/configKeys';
import { MYPARCEL, SENDMYPARCEL } from '@/data/keys/platformKeys';
import { DEFAULT_PLATFORM } from '@/data/keys/settingsConsts';
import { defaultConfiguration } from '@/config/defaultConfiguration';
import { mockConfigBus } from './mockConfigBus';

let configBus = mockConfigBus(DEFAULT_PLATFORM);

const settingCases = [
  SETTINGS.ALLOW_DELIVERY_OPTIONS,
  SETTINGS.ALLOW_EVENING_DELIVERY,
  SETTINGS.ALLOW_MORNING_DELIVERY,
  SETTINGS.ALLOW_ONLY_RECIPIENT,
  SETTINGS.ALLOW_PICKUP_EXPRESS,
  SETTINGS.ALLOW_PICKUP_LOCATIONS,
  SETTINGS.ALLOW_SIGNATURE,
];

describe('configBus', () => {
  it('is a renderless Vue instance', () => {
    expect(configBus._isVue).toBe(true);
    expect(configBus.render).toBeFalsy();
  });

  it.each(settingCases)('enables %p by default', (arg) => {
    expect(configBus.isEnabled({ enabled: arg })).toBe(true);
  });

  it('prioritizes settings correctly', () => {
    configBus = mockConfigBus({
      config: {
        platform: SENDMYPARCEL,
        [SETTINGS.ALLOW_PICKUP_LOCATIONS]: true,
        carrierSettings: {
          dpd: {
            [SETTINGS.ALLOW_PICKUP_LOCATIONS]: false,
          },
        },
      },
    });

    configBus.$data.currentCarrier = 'dpd';
    expect(configBus.get(SETTINGS.ALLOW_PICKUP_LOCATIONS)).toBe(false);

    configBus.$data.currentCarrier = 'bpost';
    expect(configBus.get(SETTINGS.ALLOW_PICKUP_LOCATIONS)).toBe(true);

    configBus = mockConfigBus({
      config: {
        platform: SENDMYPARCEL,
        [SETTINGS.ALLOW_SIGNATURE]: false,
      },
    });

    configBus.$data.currentCarrier = 'dpd';
    expect(configBus.get(SETTINGS.ALLOW_SIGNATURE)).toBe(false);

    configBus.$data.currentCarrier = 'bpost';
    expect(configBus.get(SETTINGS.ALLOW_SIGNATURE)).toBe(false);

    configBus = mockConfigBus(DEFAULT_PLATFORM);

    configBus.$data.currentCarrier = 'dpd';
    expect(configBus.get(SETTINGS.ALLOW_SIGNATURE))
      .toBe(defaultConfiguration(DEFAULT_PLATFORM).config[SETTINGS.ALLOW_SIGNATURE]);

    configBus.$data.currentCarrier = 'bpost';
    expect(configBus.get(SETTINGS.PRICE_ONLY_RECIPIENT))
      .toBe(defaultConfiguration(DEFAULT_PLATFORM).config[SETTINGS.PRICE_ONLY_RECIPIENT]);
  });

  test('getSettingsByCarrier', () => {
    configBus = mockConfigBus();
    const carrier = 'postnl';

    expect(configBus.getSettingsByCarrier(carrier)).toEqual(configBus.config.carrierSettings[carrier]);
  });

  test('isEnabledInAnyCarrier', () => {
    const mockData = {
      config: {
        platform: MYPARCEL,
        carrierSettings: {
          postnl: {
            allowPickupLocations: true,
          },
        },
      },
    };

    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(SETTINGS.ALLOW_PICKUP_LOCATIONS)).toEqual(true);

    mockData.config.carrierSettings.postnl.allowPickupLocations = false;
    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(SETTINGS.ALLOW_PICKUP_LOCATIONS)).toEqual(false);

    mockData.config.platform = 'bpost';
    mockData.config.carrierSettings = {
      bpost: { allowPickupLocations: true },
      dpd: { allowPickupLocations: false },
    };
    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(SETTINGS.ALLOW_PICKUP_LOCATIONS)).toEqual(true);

    mockData.config.carrierSettings.bpost.allowPickupLocations = false;
    mockData.config.carrierSettings.dpd.allowPickupLocations = false;
    configBus = mockConfigBus(mockData);
    expect(configBus.isEnabledInAnyCarrier(SETTINGS.ALLOW_PICKUP_LOCATIONS)).toEqual(false);
  });
});

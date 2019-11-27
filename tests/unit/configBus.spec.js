import * as SETTINGS from '@/config/data/settingsConfig';
import { DEFAULT_PLATFORM, MYPARCEL } from '@/config/data/platformConfig';
import { defaultConfig } from '@/config/data/defaultConfig';
import { mockConfigBus } from '../mockConfigBus';

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
  it('is a Vue instance', () => {
    expect(configBus._isVue).toBe(true);
    expect(configBus.render).toBeFalsy();
  });

  it('formats distances', () => {
    expect(configBus.formatDistance(0)).toBe('0m');
    expect(configBus.formatDistance(100)).toBe('100m');
    expect(configBus.formatDistance(2450)).toBe('2,5km');
    expect(configBus.formatDistance(10210)).toBe('10,2km');
  });

  it('formats prices', () => {
    // The spaces in the expected strings are non-breaking spaces.
    expect(configBus.formatPrice(0)).toBe('€ 0,00');
    expect(configBus.formatPrice(100)).toBe('€ 100,00');
    expect(configBus.formatPrice(24.50)).toBe('€ 24,50');
  });

  it.each(settingCases)('enables %p by default', (arg) => {
    expect(configBus.isEnabled({ enabled: arg })).toBe(true);
  });

  it('prioritizes settings correctly', () => {
    configBus = mockConfigBus(DEFAULT_PLATFORM, {
      config: {
        carriers: ['bpost', 'dpd'],
        [SETTINGS.DROP_OFF_DAYS]: '1;2;3;4;5;6',
        carrierSettings: {
          dpd: {
            [SETTINGS.DROP_OFF_DAYS]: '1;2;3',
          },
        },
      },
    });

    configBus.$data.currentCarrier = 'dpd';
    expect(configBus.get(SETTINGS.DROP_OFF_DAYS)).toBe('1;2;3');

    configBus.$data.currentCarrier = 'bpost';
    expect(configBus.get(SETTINGS.DROP_OFF_DAYS)).toBe('1;2;3;4;5;6');

    configBus = mockConfigBus(DEFAULT_PLATFORM, {
      config: {
        carriers: ['bpost', 'dpd'],
        [SETTINGS.ALLOW_SIGNATURE]: false,
      },
    });

    configBus.$data.currentCarrier = 'dpd';
    expect(configBus.get(SETTINGS.ALLOW_SIGNATURE)).toBe(false);

    configBus.$data.currentCarrier = 'bpost';
    expect(configBus.get(SETTINGS.ALLOW_SIGNATURE)).toBe(false);

    configBus = mockConfigBus(DEFAULT_PLATFORM, {
      config: {
        carriers: ['bpost', 'dpd'],
      },
    });

    configBus.$data.currentCarrier = 'dpd';
    expect(configBus.get(SETTINGS.ALLOW_SIGNATURE))
      .toBe(defaultConfig(DEFAULT_PLATFORM).config[SETTINGS.ALLOW_SIGNATURE]);

    configBus.$data.currentCarrier = 'bpost';
    expect(configBus.get(SETTINGS.PRICE_ONLY_RECIPIENT))
      .toBe(defaultConfig(DEFAULT_PLATFORM).config[SETTINGS.PRICE_ONLY_RECIPIENT]);
  });

  it('creates arrays of weekdays correctly per locale', () => {
    configBus = mockConfigBus(DEFAULT_PLATFORM);
    expect(configBus.get('locale')).toEqual('nl-NL');
    expect(configBus.getWeekdays()).toEqual([
      'Maandag',
      'Dinsdag',
      'Woensdag',
      'Donderdag',
      'Vrijdag',
      'Zaterdag',
      'Zondag',
    ]);

    configBus.$data.config.locale = 'en-GB';
    expect(configBus.getWeekdays()).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
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

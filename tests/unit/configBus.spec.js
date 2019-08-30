import * as SETTINGS from '@/config/data/settingsConfig';
import { DEFAULT_PLATFORM } from '@/config/data/platformConfig';
import { getConfigBus } from './testConfig';

const configBus = getConfigBus(DEFAULT_PLATFORM);

const settingCases = [
  SETTINGS.ALLOW_DELIVERY_OPTIONS,
  SETTINGS.ALLOW_EVENING_DELIVERY,
  SETTINGS.ALLOW_MORNING_DELIVERY,
  SETTINGS.ALLOW_ONLY_RECIPIENT,
  SETTINGS.ALLOW_PICKUP_EXPRESS,
  SETTINGS.ALLOW_PICKUP_POINTS,
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
});
